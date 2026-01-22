# Group A: Payment Models & Core

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create payment Django app with models for methods, transactions, refunds, and webhook logs

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Payment-Processor-Interface](../Group-B_Payment-Processor-Interface/)

---

## Group Overview

This group creates the payment Django app and core models. Creates payment app structure. Creates choice enums for payment gateway types (PayHere, WebXPay, KOKO, COD), payment statuses (pending, success, failed, refunded), and payment method types (card, bank, bnpl, cod). Creates PaymentMethod model with JSONB config for tenant-specific gateway settings. Creates PaymentTransaction model linked to orders with amount, currency, fee, gateway reference, and response JSON. Creates PaymentRefund model for refund tracking. Creates PaymentWebhookLog model to log all webhook calls. Runs migrations and verifies model creation.

### Key Outcomes

- Payment Django app
- PaymentGateway choices enum
- PaymentStatus choices enum
- PaymentMethodType choices enum
- PaymentMethod model
- PaymentMethod config (JSONB)
- PaymentMethod validation
- PaymentTransaction model
- Transaction Order FK
- Transaction amount fields
- Transaction gateway fields
- Transaction response JSON
- PaymentRefund model
- Refund fields
- PaymentWebhookLog model
- Webhook log fields
- Payment migrations
- Payment models verified

### Technology Context

- **Framework:** Django 5.x
- **Database:** PostgreSQL 15+
- **Config:** JSONB for gateway settings
- **Currency:** LKR (Sri Lankan Rupees)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-10_App-Choices-Method-Transaction.md` | Create app, choices, and models | 01-10 |
| 02 | `02_Tasks-11-18_Refund-Webhook-Migrations.md` | Create refund, webhook, and migrations | 11-18 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Payment App | Low | Phase-08 complete |
| 02 | Create PaymentGateway Choices | Low | Task 01 |
| 03 | Create PaymentStatus Choices | Low | Task 01 |
| 04 | Create PaymentMethodType Choices | Low | Task 01 |
| 05 | Create PaymentMethod Model | Medium | Task 02 |
| 06 | Create PaymentMethod Config | Medium | Task 05 |
| 07 | Create PaymentMethod Validation | Medium | Task 06 |
| 08 | Create PaymentTransaction Model | Medium | Task 03 |
| 09 | Create Transaction Order FK | Low | Task 08 |
| 10 | Create Transaction Amount Fields | Low | Task 08 |
| 11 | Create Transaction Gateway Fields | Low | Task 08 |
| 12 | Create Transaction Response JSON | Low | Task 08 |
| 13 | Create PaymentRefund Model | Medium | Task 08 |
| 14 | Create Refund Fields | Low | Task 13 |
| 15 | Create PaymentWebhookLog Model | Medium | Task 01 |
| 16 | Create Webhook Log Fields | Low | Task 15 |
| 17 | Create Payment Migrations | Low | Task 16 |
| 18 | Verify Payment Models | Low | Task 17 |

---

## Execution Order

```
Task 01: Create Payment App
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-02     T-03     T-04     T-15
(Gateway)(Status)(Method)(Webhook)
    │        │        │        │
    ▼        │        │        ▼
T-05        │        │     T-16
(Method)    │        │   (Fields)
    │        │        │        │
    ▼        │        │        │
T-06        │        │        │
(Config)    │        │        │
    │        │        │        │
    ▼        │        │        │
T-07        │        │        │
(Valid)     │        │        │
    │        │        │        │
    └────────┴────────┘        │
              │                │
              ▼                │
        Task 08: Transaction   │
              │                │
    ┌────┬────┼────┬────┐      │
    ▼    ▼    ▼    ▼    ▼      │
 T-09  T-10  T-11  T-12  T-13  │
(Order)(Amt)(Gate)(JSON)(Refund)
    │    │    │    │    │      │
    │    │    │    │    ▼      │
    │    │    │    │  T-14    │
    │    │    │    │ (Fields)  │
    │    │    │    │    │      │
    └────┴────┴────┴────┴──────┘
                   │
                   ▼
             Task 17: Migrations
                   │
                   ▼
             Task 18: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        ├── __init__.py
        ├── apps.py
        ├── choices.py
        ├── models/
        │   ├── __init__.py
        │   ├── payment_method.py
        │   ├── transaction.py
        │   ├── refund.py
        │   └── webhook_log.py
        └── migrations/
            └── 0001_initial.py
```

---

## Notes for AI Agents

### Create Payment App (Task 01)
| Command | Value |
|---------|-------|
| Create | python manage.py startapp payments |
| Location | apps/payments/ |
| Register | INSTALLED_APPS |

### PaymentGateway Choices (Task 02)
| Gateway | Value |
|---------|-------|
| PAYHERE | payhere |
| WEBXPAY | webxpay |
| KOKO | koko |
| MINTPAY | mintpay |
| BANK_TRANSFER | bank_transfer |
| COD | cod |

### PaymentStatus Choices (Task 03)
| Status | Value |
|--------|-------|
| PENDING | pending |
| SUCCESS | success |
| FAILED | failed |
| REFUNDED | refunded |
| PARTIALLY_REFUNDED | partially_refunded |
| CANCELLED | cancelled |

### PaymentMethodType Choices (Task 04)
| Type | Value |
|------|-------|
| CARD | card |
| BANK | bank |
| BNPL | bnpl |
| COD | cod |
| QR | qr |

### PaymentMethod Model (Task 05)
| Field | Type |
|-------|------|
| tenant | ForeignKey (implicit) |
| gateway | CharField (choices) |
| method_type | CharField (choices) |
| name | CharField |
| is_active | BooleanField |
| display_order | PositiveIntegerField |

### PaymentMethod Config (Task 06)
| Field | Content |
|-------|---------|
| config | JSONField |
| Example | {"merchant_id": "...", "secret": "..."} |
| Encrypted | Sensitive keys |

### PaymentTransaction Model (Task 08)
| Field | Type |
|-------|------|
| order | ForeignKey |
| gateway | CharField (choices) |
| status | CharField (choices) |
| amount | DecimalField |
| currency | CharField (default=LKR) |

### Transaction Amount Fields (Task 10)
| Field | Type |
|-------|------|
| amount | DecimalField(10, 2) |
| fee | DecimalField(8, 2) |
| net_amount | DecimalField(10, 2) |
| currency | CharField(3) = "LKR" |

### Transaction Gateway Fields (Task 11)
| Field | Type |
|-------|------|
| gateway_reference | CharField |
| gateway_order_id | CharField |
| payment_method_used | CharField |

### Transaction Response JSON (Task 12)
| Field | Content |
|-------|---------|
| gateway_response | JSONField |
| Stores | Full gateway response |
| Purpose | Debugging, audit |

### PaymentRefund Model (Task 13)
| Field | Type |
|-------|------|
| transaction | ForeignKey |
| amount | DecimalField |
| reason | TextField |
| status | CharField (choices) |
| gateway_reference | CharField |

### PaymentWebhookLog Model (Task 15)
| Field | Type |
|-------|------|
| gateway | CharField (choices) |
| event_type | CharField |
| payload | JSONField |
| processed | BooleanField |
| processed_at | DateTimeField |
| error_message | TextField |
