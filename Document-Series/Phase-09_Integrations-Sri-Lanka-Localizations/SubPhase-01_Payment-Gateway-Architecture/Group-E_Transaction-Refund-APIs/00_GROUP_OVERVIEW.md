# Group E: Transaction & Refund APIs

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Create DRF API endpoints for payment methods, transactions, and refunds

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Webhook-Infrastructure](../Group-D_Webhook-Infrastructure/)
- **→ Next Group:** [Group-F_Admin-Testing](../Group-F_Admin-Testing/)

---

## Group Overview

This group creates the payment API endpoints. Creates PaymentMethod serializer and API to list active payment methods. Creates InitiatePayment serializer and API to start payment process. Creates VerifyPayment API for payment verification. Creates PaymentStatus API to check transaction status. Creates Transaction serializer and TransactionList API for order transactions. Creates RefundRequest serializer and RefundRequest API to initiate refunds. Creates RefundStatus API to check refund status. Creates payment permission classes and API throttling for rate limiting. Verifies all payment APIs.

### Key Outcomes

- PaymentMethod serializer
- PaymentMethods API (GET)
- InitiatePayment serializer
- InitiatePayment API (POST)
- VerifyPayment API (POST)
- PaymentStatus API (GET)
- Transaction serializer
- TransactionList API (GET)
- RefundRequest serializer
- RefundRequest API (POST)
- RefundStatus API (GET)
- Payment permissions
- API throttling
- Payment APIs verified

### Technology Context

- **Framework:** Django REST Framework
- **Auth:** JWT + permissions
- **Throttle:** Rate limiting
- **Currency:** LKR amounts

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-76_Methods-Initiate-Status.md` | Create methods and initiate APIs | 69-76 |
| 02 | `02_Tasks-77-82_Refund-Permissions-Verify.md` | Create refund APIs and verification | 77-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create PaymentMethod Serializer | Low | Task 68 |
| 70 | Create PaymentMethods API | Low | Task 69 |
| 71 | Create InitiatePayment Serializer | Medium | Task 69 |
| 72 | Create InitiatePayment API | High | Task 71 |
| 73 | Create VerifyPayment API | Medium | Task 72 |
| 74 | Create PaymentStatus API | Low | Task 73 |
| 75 | Create Transaction Serializer | Low | Task 69 |
| 76 | Create TransactionList API | Medium | Task 75 |
| 77 | Create RefundRequest Serializer | Medium | Task 75 |
| 78 | Create RefundRequest API | High | Task 77 |
| 79 | Create RefundStatus API | Low | Task 78 |
| 80 | Create Payment Permissions | Medium | Task 69 |
| 81 | Create API Throttling | Medium | Task 80 |
| 82 | Verify Payment APIs | Low | Task 81 |

---

## Execution Order

```
Task 69: PaymentMethod Serializer
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-70     T-71     T-75  T-80
(List)  (Init)  (Trans)(Perms)
    │        │        │    │
    │        ▼        │    ▼
    │     T-72       │   T-81
    │   (Initiate)   │ (Throttle)
    │        │        │    │
    │        ▼        │    │
    │     T-73       │    │
    │   (Verify)     │    │
    │        │        │    │
    │        ▼        │    │
    │     T-74       │    │
    │   (Status)     │    │
    │        │        │    │
    │        └────────┤    │
    │                 │    │
    │                 ▼    │
    │              T-76   │
    │            (List)   │
    │                 │    │
    │                 ▼    │
    │              T-77   │
    │           (RefundSer)|
    │                 │    │
    │                 ▼    │
    │              T-78   │
    │           (RefundAPI)│
    │                 │    │
    │                 ▼    │
    │              T-79   │
    │          (RefStatus) │
    │                 │    │
    └─────────────────┴────┘
              │
              ▼
        Task 82: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── api/
            ├── __init__.py
            ├── serializers.py
            ├── views.py
            ├── urls.py
            ├── permissions.py
            └── throttling.py
```

---

## Notes for AI Agents

### PaymentMethod Serializer (Task 69)
| Field | Include |
|-------|---------|
| id | Yes |
| gateway | Yes |
| method_type | Yes |
| name | Yes |
| display_order | Yes |
| config | NO (sensitive) |

### PaymentMethods API (Task 70)
| Endpoint | GET /api/payment-methods/ |
|----------|---------------------------|
| Auth | Optional |
| Filter | is_active=True |
| Response | List of methods |

### InitiatePayment Serializer (Task 71)
| Field | Type |
|-------|------|
| order_id | UUID |
| gateway | String |
| return_url | URL |
| cancel_url | URL |

### InitiatePayment API (Task 72)
| Endpoint | POST /api/payments/initiate/ |
|----------|------------------------------|
| Auth | Required |
| Action | Call PaymentService |
| Response | redirect_url or error |

### VerifyPayment API (Task 73)
| Endpoint | POST /api/payments/verify/ |
|----------|----------------------------|
| Input | gateway_reference, order_id |
| Action | Verify with gateway |
| Response | Success/failure |

### PaymentStatus API (Task 74)
| Endpoint | GET /api/payments/{id}/status/ |
|----------|--------------------------------|
| Auth | Required |
| Response | Current status |

### Transaction Serializer (Task 75)
| Field | Include |
|-------|---------|
| id | Yes |
| amount | Yes |
| status | Yes |
| gateway | Yes |
| created_at | Yes |
| gateway_reference | Yes |

### TransactionList API (Task 76)
| Endpoint | GET /api/orders/{id}/transactions/ |
|----------|-------------------------------------|
| Auth | Required |
| Filter | Order owner only |
| Response | List of transactions |

### RefundRequest Serializer (Task 77)
| Field | Type |
|-------|------|
| transaction_id | UUID |
| amount | Decimal |
| reason | String |

### RefundRequest API (Task 78)
| Endpoint | POST /api/payments/{id}/refund/ |
|----------|----------------------------------|
| Auth | Admin or staff |
| Action | Process refund |
| Response | RefundResult |

### RefundStatus API (Task 79)
| Endpoint | GET /api/refunds/{id}/status/ |
|----------|-------------------------------|
| Auth | Required |
| Response | Refund status |

### Payment Permissions (Task 80)
| Permission | Rule |
|------------|------|
| CanInitiatePayment | Authenticated + order owner |
| CanRequestRefund | Staff or admin |
| CanViewTransactions | Order owner or staff |

### API Throttling (Task 81)
| Endpoint | Limit |
|----------|-------|
| Initiate | 10/minute |
| Verify | 20/minute |
| Refund | 5/minute |
