# Group B: KOKO Processor Implementation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement KOKOProcessor class with API client, data builders, and payment flow

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_BNPL-Configuration](../Group-A_BNPL-Configuration/)
- **→ Next Group:** [Group-C_MintPay-Processor-Implementation](../Group-C_MintPay-Processor-Implementation/)

---

## Group Overview

This group implements the KOKOProcessor class. Creates KOKOProcessor extending PaymentProcessor ABC and registers with factory. Creates KOKO API client with authentication and request signing. Creates amount formatter and order data builder. Creates customer data builder with NIC formatter and phone formatter for +94 format. Creates item list builder and shipping data builder. Creates initiate_payment method with checkout redirect. Creates callback handler with status mapping. Creates error handling. Verifies KOKO processor implementation.

### Key Outcomes

- KOKOProcessor class
- Processor registration
- API client
- Authentication
- Request signing
- Amount formatter
- Order data builder
- Customer data builder
- NIC formatter
- Phone formatter (+94)
- Item list builder
- Shipping data
- initiate_payment method
- Checkout redirect
- Callback handler
- Status mapping
- Error handling
- KOKO processor verified

### Technology Context

- **Provider:** KOKO
- **API:** REST-based
- **NIC:** Sri Lanka ID
- **Phone:** +94 format

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-25_Processor-Builders.md` | Create processor and data builders | 17-25 |
| 02 | `02_Tasks-26-34_Payment-Callback-Verify.md` | Create payment flow and verification | 26-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create KOKOProcessor Class | High | Task 16 |
| 18 | Create Processor Registration | Low | Task 17 |
| 19 | Create API Client | Medium | Task 17 |
| 20 | Create Authentication | Medium | Task 19 |
| 21 | Create Request Signing | Medium | Task 20 |
| 22 | Create Amount Formatter | Low | Task 17 |
| 23 | Create Order Data Builder | Medium | Task 17 |
| 24 | Create Customer Data Builder | Medium | Task 23 |
| 25 | Create NIC Formatter | Low | Task 24 |
| 26 | Create Phone Formatter | Low | Task 24 |
| 27 | Create Item List Builder | Medium | Task 23 |
| 28 | Create Shipping Data | Low | Task 23 |
| 29 | Create initiate_payment | High | Task 28 |
| 30 | Create Checkout Redirect | Medium | Task 29 |
| 31 | Create Callback Handler | Medium | Task 29 |
| 32 | Create Status Mapping | Low | Task 31 |
| 33 | Create Error Handling | Medium | Task 31 |
| 34 | Verify KOKO Processor | Low | Task 33 |

---

## Execution Order

```
Task 17: KOKOProcessor Class
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-18     T-19     T-22     T-23
(Reg)   (API)   (Amt)   (Order)
    │        │        │        │
    │        ▼        │   ┌────┼────┬────┐
    │      T-20      │   ▼    ▼    ▼    ▼
    │     (Auth)     │ T-24  T-27  T-28
    │        │        │(Cust)(Items)(Ship)
    │        ▼        │   │    │    │
    │      T-21      │   ├────┤    │
    │    (Sign)      │   ▼    │    │
    │        │        │ T-25  T-26  │
    │        │        │(NIC)(Phone) │
    │        │        │   │    │    │
    └────────┴────────┴───┴────┴────┘
                   │
                   ▼
             Task 29: initiate_payment
                   │
              ┌────┴────┐
              ▼         ▼
           T-30      T-31
        (Redirect) (Callback)
              │         │
              │    ┌────┴────┐
              │    ▼         ▼
              │  T-32      T-33
              │(Status)  (Error)
              │    │         │
              └────┴─────────┘
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
            └── koko/
                ├── __init__.py
                ├── processor.py
                ├── client.py
                └── builders.py
```

---

## Notes for AI Agents

### KOKOProcessor Class (Task 17)
| Attribute | Value |
|-----------|-------|
| gateway_type | PaymentGateway.KOKO |
| Extends | PaymentProcessor |
| Type | BNPL |

### Processor Registration (Task 18)
| Register | Method |
|----------|--------|
| Factory | ProcessorFactory.register |
| Key | PaymentGateway.KOKO |
| Class | KOKOProcessor |

### API Client (Task 19)
| Library | httpx or requests |
|---------|-------------------|
| Timeout | 30 seconds |
| Retry | 3 attempts |

### Authentication (Task 20)
| Method | API key header |
|--------|----------------|
| Header | X-API-Key |
| Value | KOKO_API_KEY |

### Request Signing (Task 21)
| Method | HMAC or similar |
|--------|-----------------|
| Key | API secret |
| Include | Timestamp |

### Amount Formatter (Task 22)
| Format | Value |
|--------|-------|
| Decimals | 2 places |
| Example | 10000.00 |
| Currency | LKR |

### Order Data Builder (Task 23)
| Field | Source |
|-------|--------|
| order_id | Order.id |
| total | Order.total |
| items | Order.items |
| customer | Customer data |

### Customer Data Builder (Task 24)
| Field | Source |
|-------|--------|
| name | Customer.full_name |
| email | Customer.email |
| phone | Customer.phone |
| nic | Customer.nic |

### NIC Formatter (Task 25)
| Format | Pattern |
|--------|---------|
| Old | 9 digits + V/X |
| New | 12 digits |
| Strip | Spaces, dashes |

### Phone Formatter (Task 26)
| Input | Output |
|-------|--------|
| 0771234567 | 94771234567 |
| +94771234567 | 94771234567 |

### Item List Builder (Task 27)
| Field | Source |
|-------|--------|
| name | Item.name |
| quantity | Item.quantity |
| price | Item.unit_price |
| sku | Item.sku |

### Shipping Data (Task 28)
| Field | Source |
|-------|--------|
| address | Shipping.address |
| city | Shipping.city |
| postal_code | Shipping.postal |

### initiate_payment (Task 29)
| Input | PaymentIntent |
|-------|---------------|
| Output | PaymentResult |
| Action | Create KOKO order |

### Checkout Redirect (Task 30)
| Response | Redirect URL |
|----------|--------------|
| Target | KOKO checkout page |
| Method | GET redirect |

### Callback Handler (Task 31)
| Endpoint | /api/webhooks/koko/ |
|----------|----------------------|
| Method | POST |
| Verify | Signature |

### Status Mapping (Task 32)
| KOKO Status | Internal Status |
|-------------|-----------------|
| APPROVED | PaymentStatus.SUCCESS |
| REJECTED | PaymentStatus.FAILED |
| PENDING | PaymentStatus.PENDING |
| CANCELLED | PaymentStatus.CANCELLED |

### Error Handling (Task 33)
| Error | Action |
|-------|--------|
| Network | Retry |
| Rejection | Return reason |
| Validation | Return error |
