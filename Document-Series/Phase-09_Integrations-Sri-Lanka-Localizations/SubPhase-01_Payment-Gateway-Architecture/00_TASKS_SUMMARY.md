# SubPhase 01: Payment Gateway Architecture - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 01 of 12  
> **SubPhase Goal:** Create unified payment processing layer supporting multiple Sri Lanka payment gateways  
> **Total Tasks:** 96 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-08_Webstore-Ecommerce-Platform](../../Phase-08_Webstore-Ecommerce-Platform/)
- **→ Next SubPhase:** [SubPhase-02_PayHere-Integration](../SubPhase-02_PayHere-Integration/)

---

## SubPhase Overview

This sub-phase creates the unified payment gateway architecture that will support PayHere, WebXPay, KOKO/MintPay BNPL, bank transfers, and COD. This is the foundation for all payment integrations.

### Key Outcomes
- Abstract payment processor interface
- Payment method configuration per tenant
- Payment transaction tracking
- Webhook handling architecture
- Refund processing workflow
- Payment status management

### Payment Gateways Supported
- PayHere (Visa, Master, Amex, Banking)
- WebXPay (Cards, QR)
- KOKO/MintPay (BNPL)
- Bank Transfer (Manual)
- Cash on Delivery (COD)

### Architecture Pattern
```
Order → PaymentService → PaymentProcessor (Abstract)
                              │
                              ├─→ PayHereProcessor
                              ├─→ WebXPayProcessor
                              ├─→ KOKOProcessor
                              ├─→ BankTransferProcessor
                              └─→ CODProcessor
```

### Technology Context
- **Backend:** Django 5.x, DRF
- **Async:** Celery for webhook processing
- **Currency:** LKR (Sri Lankan Rupees)
- **Security:** PCI DSS awareness, no card storage

---

## Task Execution Order

```
TASK GROUP A: Payment Models & Core (Tasks 01-18)
        │
        ▼
TASK GROUP B: Payment Processor Interface (Tasks 19-34)
        │
        ▼
TASK GROUP C: Payment Service Layer (Tasks 35-52)
        │
        ▼
TASK GROUP D: Webhook Infrastructure (Tasks 53-68)
        │
        ▼
TASK GROUP E: Transaction & Refund APIs (Tasks 69-82)
        │
        ▼
TASK GROUP F: Admin & Testing (Tasks 83-96)
```

---

## Task Index

### Group A: Payment Models & Core (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Payment App** | Django app for payments | Phase-08 complete | 🔴 Not Created |
| 02 | **Create PaymentGateway Choices** | Enum for gateway types | Task 01 | 🔴 Not Created |
| 03 | **Create PaymentStatus Choices** | pending/success/failed/refunded | Task 01 | 🔴 Not Created |
| 04 | **Create PaymentMethodType Choices** | card/bank/bnpl/cod | Task 01 | 🔴 Not Created |
| 05 | **Create PaymentMethod Model** | Payment methods per tenant | Task 02 | 🔴 Not Created |
| 06 | **Create PaymentMethod Config** | JSONB for gateway config | Task 05 | 🔴 Not Created |
| 07 | **Create PaymentMethod Validation** | Validate gateway config | Task 06 | 🔴 Not Created |
| 08 | **Create PaymentTransaction Model** | Transaction records | Task 03 | 🔴 Not Created |
| 09 | **Create Transaction Order FK** | Link to Order model | Task 08 | 🔴 Not Created |
| 10 | **Create Transaction Amount Fields** | amount, currency, fee | Task 08 | 🔴 Not Created |
| 11 | **Create Transaction Gateway Fields** | gateway, reference | Task 08 | 🔴 Not Created |
| 12 | **Create Transaction Response JSON** | Store gateway response | Task 08 | 🔴 Not Created |
| 13 | **Create PaymentRefund Model** | Refund transaction records | Task 08 | 🔴 Not Created |
| 14 | **Create Refund Fields** | amount, reason, status | Task 13 | 🔴 Not Created |
| 15 | **Create PaymentWebhookLog Model** | Log all webhook calls | Task 01 | 🔴 Not Created |
| 16 | **Create Webhook Log Fields** | gateway, payload, processed | Task 15 | 🔴 Not Created |
| 17 | **Create Payment Migrations** | Run makemigrations | Task 16 | 🔴 Not Created |
| 18 | **Verify Payment Models** | Test model creation | Task 17 | 🔴 Not Created |

---

### Group B: Payment Processor Interface (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create PaymentResult Dataclass** | Result type for payments | Task 18 | 🔴 Not Created |
| 20 | **Create PaymentIntent Dataclass** | Payment initiation data | Task 19 | 🔴 Not Created |
| 21 | **Create RefundResult Dataclass** | Refund result type | Task 19 | 🔴 Not Created |
| 22 | **Create PaymentProcessor ABC** | Abstract base class | Task 21 | 🔴 Not Created |
| 23 | **Create initiate_payment Method** | Abstract payment init | Task 22 | 🔴 Not Created |
| 24 | **Create verify_payment Method** | Abstract verification | Task 22 | 🔴 Not Created |
| 25 | **Create process_refund Method** | Abstract refund | Task 22 | 🔴 Not Created |
| 26 | **Create get_status Method** | Abstract status check | Task 22 | 🔴 Not Created |
| 27 | **Create supports_recurring Method** | Recurring support flag | Task 22 | 🔴 Not Created |
| 28 | **Create PaymentProcessorFactory** | Factory for processors | Task 27 | 🔴 Not Created |
| 29 | **Create Processor Registry** | Register processor classes | Task 28 | 🔴 Not Created |
| 30 | **Create get_processor Method** | Get by gateway type | Task 29 | 🔴 Not Created |
| 31 | **Create ProcessorConfig Type** | Config type for processors | Task 28 | 🔴 Not Created |
| 32 | **Create PaymentException Base** | Base exception class | Task 22 | 🔴 Not Created |
| 33 | **Create Specific Exceptions** | Gateway/validation errors | Task 32 | 🔴 Not Created |
| 34 | **Verify Processor Interface** | Test interface contract | Task 33 | 🔴 Not Created |

---

### Group C: Payment Service Layer (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create PaymentService Class** | Main payment service | Task 34 | 🔴 Not Created |
| 36 | **Create get_active_methods** | List active payment methods | Task 35 | 🔴 Not Created |
| 37 | **Create initiate_payment Method** | Start payment process | Task 35 | 🔴 Not Created |
| 38 | **Create Payment Logging** | Log payment attempts | Task 37 | 🔴 Not Created |
| 39 | **Create verify_payment Method** | Verify completed payment | Task 35 | 🔴 Not Created |
| 40 | **Create Update Order Status** | Mark order as paid | Task 39 | 🔴 Not Created |
| 41 | **Create process_refund Method** | Process refund request | Task 35 | 🔴 Not Created |
| 42 | **Create Partial Refund Logic** | Handle partial refunds | Task 41 | 🔴 Not Created |
| 43 | **Create get_transaction_status** | Check transaction status | Task 35 | 🔴 Not Created |
| 44 | **Create Transaction History** | Get payment history | Task 35 | 🔴 Not Created |
| 45 | **Create Amount Validation** | Validate payment amounts | Task 35 | 🔴 Not Created |
| 46 | **Create Currency Handling** | LKR currency formatting | Task 45 | 🔴 Not Created |
| 47 | **Create Retry Logic** | Retry failed payments | Task 35 | 🔴 Not Created |
| 48 | **Create Timeout Handling** | Handle gateway timeouts | Task 47 | 🔴 Not Created |
| 49 | **Create Payment Events** | Emit payment events | Task 35 | 🔴 Not Created |
| 50 | **Create Event Handlers** | Handle payment events | Task 49 | 🔴 Not Created |
| 51 | **Create Payment Analytics** | Track payment metrics | Task 35 | 🔴 Not Created |
| 52 | **Verify Payment Service** | Test service methods | Task 51 | 🔴 Not Created |

---

### Group D: Webhook Infrastructure (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create Webhook Router View** | Route webhooks by gateway | Task 52 | 🔴 Not Created |
| 54 | **Create Webhook URL Patterns** | URL routing for webhooks | Task 53 | 🔴 Not Created |
| 55 | **Create Webhook Authentication** | Verify webhook signatures | Task 53 | 🔴 Not Created |
| 56 | **Create Signature Validators** | Per-gateway validation | Task 55 | 🔴 Not Created |
| 57 | **Create PayHere Signature** | PayHere MD5 signature | Task 56 | 🔴 Not Created |
| 58 | **Create WebXPay Signature** | WebXPay signature | Task 56 | 🔴 Not Created |
| 59 | **Create Webhook Parser** | Parse webhook payloads | Task 53 | 🔴 Not Created |
| 60 | **Create PayHere Parser** | Parse PayHere webhooks | Task 59 | 🔴 Not Created |
| 61 | **Create WebXPay Parser** | Parse WebXPay webhooks | Task 59 | 🔴 Not Created |
| 62 | **Create Webhook Processor** | Process webhook async | Task 59 | 🔴 Not Created |
| 63 | **Create Celery Webhook Task** | Async webhook processing | Task 62 | 🔴 Not Created |
| 64 | **Create Idempotency Check** | Prevent duplicate processing | Task 62 | 🔴 Not Created |
| 65 | **Create Webhook Retry Logic** | Handle failed webhooks | Task 62 | 🔴 Not Created |
| 66 | **Create Webhook Logging** | Log all webhook activity | Task 53 | 🔴 Not Created |
| 67 | **Create Webhook Error Handling** | Handle malformed webhooks | Task 62 | 🔴 Not Created |
| 68 | **Verify Webhook Infrastructure** | Test webhook flow | Task 67 | 🔴 Not Created |

---

### Group E: Transaction & Refund APIs (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create PaymentMethod Serializer** | List payment methods | Task 68 | 🔴 Not Created |
| 70 | **Create PaymentMethods API** | GET /api/payment-methods/ | Task 69 | 🔴 Not Created |
| 71 | **Create InitiatePayment Serializer** | Payment initiation data | Task 69 | 🔴 Not Created |
| 72 | **Create InitiatePayment API** | POST /api/payments/initiate/ | Task 71 | 🔴 Not Created |
| 73 | **Create VerifyPayment API** | POST /api/payments/verify/ | Task 72 | 🔴 Not Created |
| 74 | **Create PaymentStatus API** | GET /api/payments/{id}/status/ | Task 73 | 🔴 Not Created |
| 75 | **Create Transaction Serializer** | Transaction detail | Task 69 | 🔴 Not Created |
| 76 | **Create TransactionList API** | GET /api/orders/{id}/transactions/ | Task 75 | 🔴 Not Created |
| 77 | **Create RefundRequest Serializer** | Refund request data | Task 75 | 🔴 Not Created |
| 78 | **Create RefundRequest API** | POST /api/payments/{id}/refund/ | Task 77 | 🔴 Not Created |
| 79 | **Create RefundStatus API** | GET /api/refunds/{id}/status/ | Task 78 | 🔴 Not Created |
| 80 | **Create Payment Permissions** | Permission classes | Task 69 | 🔴 Not Created |
| 81 | **Create API Throttling** | Rate limit payment APIs | Task 80 | 🔴 Not Created |
| 82 | **Verify Payment APIs** | Test all API endpoints | Task 81 | 🔴 Not Created |

---

### Group F: Admin & Testing (Tasks 83-96)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create PaymentMethod Admin** | Admin for payment methods | Task 82 | 🔴 Not Created |
| 84 | **Create Gateway Config Form** | Config form in admin | Task 83 | 🔴 Not Created |
| 85 | **Create Transaction Admin** | Admin for transactions | Task 83 | 🔴 Not Created |
| 86 | **Create Transaction Filters** | Filter by gateway/status | Task 85 | 🔴 Not Created |
| 87 | **Create Transaction Search** | Search transactions | Task 85 | 🔴 Not Created |
| 88 | **Create Refund Admin** | Admin for refunds | Task 83 | 🔴 Not Created |
| 89 | **Create Webhook Log Admin** | Admin for webhook logs | Task 83 | 🔴 Not Created |
| 90 | **Create Payment Reports** | Admin payment reports | Task 83 | 🔴 Not Created |
| 91 | **Create Unit Tests Setup** | Test fixtures/factories | Task 82 | 🔴 Not Created |
| 92 | **Create Model Unit Tests** | Test payment models | Task 91 | 🔴 Not Created |
| 93 | **Create Service Unit Tests** | Test PaymentService | Task 91 | 🔴 Not Created |
| 94 | **Create Webhook Unit Tests** | Test webhook processing | Task 91 | 🔴 Not Created |
| 95 | **Create API Integration Tests** | Test API endpoints | Task 91 | 🔴 Not Created |
| 96 | **Create Documentation** | API documentation | Task 95 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── payments/
        ├── __init__.py
        ├── admin.py                              # Admin config (Task 83)
        ├── apps.py                               # App config (Task 01)
        ├── models/
        │   ├── __init__.py
        │   ├── payment_method.py                 # PaymentMethod (Task 05)
        │   ├── transaction.py                    # PaymentTransaction (Task 08)
        │   ├── refund.py                         # PaymentRefund (Task 13)
        │   └── webhook_log.py                    # PaymentWebhookLog (Task 15)
        ├── choices.py                            # All choices (Task 02-04)
        ├── processors/
        │   ├── __init__.py
        │   ├── base.py                           # PaymentProcessor ABC (Task 22)
        │   ├── factory.py                        # ProcessorFactory (Task 28)
        │   ├── dataclasses.py                    # Result types (Task 19-21)
        │   └── exceptions.py                     # Exceptions (Task 32)
        ├── services/
        │   ├── __init__.py
        │   └── payment_service.py                # PaymentService (Task 35)
        ├── webhooks/
        │   ├── __init__.py
        │   ├── router.py                         # Webhook router (Task 53)
        │   ├── validators.py                     # Signature validators (Task 56)
        │   └── parsers.py                        # Payload parsers (Task 59)
        ├── api/
        │   ├── __init__.py
        │   ├── serializers.py                    # API serializers (Task 69)
        │   ├── views.py                          # API views (Task 70)
        │   └── urls.py                           # API URLs (Task 54)
        ├── tasks.py                              # Celery tasks (Task 63)
        ├── signals.py                            # Payment signals (Task 49)
        └── tests/
            ├── __init__.py
            ├── factories.py                      # Test factories (Task 91)
            ├── test_models.py                    # Model tests (Task 92)
            ├── test_services.py                  # Service tests (Task 93)
            ├── test_webhooks.py                  # Webhook tests (Task 94)
            └── test_api.py                       # API tests (Task 95)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Payment Models & Core | 18 | 0 | 0% |
| B | Payment Processor Interface | 16 | 0 | 0% |
| C | Payment Service Layer | 18 | 0 | 0% |
| D | Webhook Infrastructure | 16 | 0 | 0% |
| E | Transaction & Refund APIs | 14 | 0 | 0% |
| F | Admin & Testing | 14 | 0 | 0% |
| **Total** | | **96** | **0** | **0%** |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Abstract first** - Build interfaces before implementations
3. **No card storage** - Never store full card details
4. **LKR currency** - All amounts in Sri Lankan Rupees
5. **Webhook security** - Always validate signatures
6. **Idempotency** - Prevent duplicate payment processing
7. **Celery async** - Process webhooks asynchronously
8. **Tenant aware** - All models tenant-scoped
9. **Gateway testing** - Use sandbox/test modes always
