# Group C: MintPay Processor Implementation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement MintPayProcessor class with API client and unified BNPL interface

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_KOKO-Processor-Implementation](../Group-B_KOKO-Processor-Implementation/)
- **→ Next Group:** [Group-D_Eligibility-Verification](../Group-D_Eligibility-Verification/)

---

## Group Overview

This group implements the MintPayProcessor class. Creates MintPayProcessor extending PaymentProcessor ABC and registers with factory. Creates MintPay API client with authentication and request signing. Creates amount formatter, order payload builder, customer data builder, and cart items builder. Creates initiate_payment method with MintPay redirect. Creates callback handler with status code mapping. Creates error handling. Creates provider abstraction for unified BNPL interface. Verifies MintPay processor implementation.

### Key Outcomes

- MintPayProcessor class
- Processor registration
- MintPay API client
- MintPay authentication
- MintPay signing
- MintPay amount formatter
- MintPay order builder
- MintPay customer builder
- MintPay items builder
- MintPay initiate
- MintPay redirect
- MintPay callback
- MintPay status mapping
- MintPay errors
- Provider abstraction
- MintPay processor verified

### Technology Context

- **Provider:** MintPay
- **API:** REST-based
- **Abstraction:** Unified BNPL interface
- **Currency:** LKR only

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-42_Processor-Builders.md` | Create processor and data builders | 35-42 |
| 02 | `02_Tasks-43-50_Payment-Abstraction-Verify.md` | Create payment flow and abstraction | 43-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create MintPayProcessor Class | High | Task 34 |
| 36 | Create Processor Registration | Low | Task 35 |
| 37 | Create MintPay API Client | Medium | Task 35 |
| 38 | Create MintPay Auth | Medium | Task 37 |
| 39 | Create MintPay Signing | Medium | Task 38 |
| 40 | Create MintPay Amount | Low | Task 35 |
| 41 | Create MintPay Order | Medium | Task 35 |
| 42 | Create MintPay Customer | Medium | Task 41 |
| 43 | Create MintPay Items | Medium | Task 41 |
| 44 | Create MintPay initiate | High | Task 43 |
| 45 | Create MintPay Redirect | Medium | Task 44 |
| 46 | Create MintPay Callback | Medium | Task 44 |
| 47 | Create MintPay Status | Low | Task 46 |
| 48 | Create MintPay Errors | Medium | Task 46 |
| 49 | Create Provider Abstraction | High | Task 48 |
| 50 | Verify MintPay Processor | Low | Task 49 |

---

## Execution Order

```
Task 35: MintPayProcessor Class
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-36     T-37     T-40     T-41
(Reg)   (API)   (Amt)   (Order)
    │        │        │        │
    │        ▼        │   ┌────┴────┐
    │      T-38      │   ▼         ▼
    │     (Auth)     │ T-42      T-43
    │        │        │(Cust)   (Items)
    │        ▼        │   │         │
    │      T-39      │   │         │
    │    (Sign)      │   │         │
    │        │        │   │         │
    └────────┴────────┴───┴─────────┘
                   │
                   ▼
             Task 44: MintPay initiate
                   │
              ┌────┴────┐
              ▼         ▼
           T-45      T-46
        (Redirect)(Callback)
              │         │
              │    ┌────┴────┐
              │    ▼         ▼
              │  T-47      T-48
              │(Status)  (Errors)
              │    │         │
              └────┴─────────┘
                      │
                      ▼
                Task 49: Provider Abstraction
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
            ├── mintpay/
            │   ├── __init__.py
            │   ├── processor.py
            │   ├── client.py
            │   └── builders.py
            └── bnpl/
                ├── __init__.py
                └── base.py
```

---

## Notes for AI Agents

### MintPayProcessor Class (Task 35)
| Attribute | Value |
|-----------|-------|
| gateway_type | PaymentGateway.MINTPAY |
| Extends | PaymentProcessor |
| Type | BNPL |

### Processor Registration (Task 36)
| Register | Method |
|----------|--------|
| Factory | ProcessorFactory.register |
| Key | PaymentGateway.MINTPAY |
| Class | MintPayProcessor |

### MintPay API Client (Task 37)
| Library | httpx or requests |
|---------|-------------------|
| Timeout | 30 seconds |
| Retry | 3 attempts |

### MintPay Auth (Task 38)
| Method | API key header |
|--------|----------------|
| Header | Authorization |
| Value | Bearer MINTPAY_API_KEY |

### MintPay Signing (Task 39)
| Method | HMAC or similar |
|--------|-----------------|
| Key | API secret |
| Include | Timestamp |

### MintPay Amount (Task 40)
| Format | Value |
|--------|-------|
| Decimals | 2 places |
| Example | 10000.00 |
| Currency | LKR |

### MintPay Order (Task 41)
| Field | Source |
|-------|--------|
| reference | Order.id |
| amount | Order.total |
| items | Order.items |

### MintPay Customer (Task 42)
| Field | Source |
|-------|--------|
| name | Customer.full_name |
| email | Customer.email |
| phone | Customer.phone |
| nic | Customer.nic |

### MintPay Items (Task 43)
| Field | Source |
|-------|--------|
| name | Item.name |
| quantity | Item.quantity |
| amount | Item.total |

### MintPay initiate (Task 44)
| Input | PaymentIntent |
|-------|---------------|
| Output | PaymentResult |
| Action | Create MintPay order |

### MintPay Redirect (Task 45)
| Response | Redirect URL |
|----------|--------------|
| Target | MintPay checkout page |
| Method | GET redirect |

### MintPay Callback (Task 46)
| Endpoint | /api/webhooks/mintpay/ |
|----------|------------------------|
| Method | POST |
| Verify | Signature |

### MintPay Status (Task 47)
| MintPay Status | Internal Status |
|----------------|-----------------|
| SUCCESS | PaymentStatus.SUCCESS |
| FAILED | PaymentStatus.FAILED |
| PENDING | PaymentStatus.PENDING |

### MintPay Errors (Task 48)
| Error | Action |
|-------|--------|
| Network | Retry |
| Rejection | Return reason |
| Validation | Return error |

### Provider Abstraction (Task 49)
| Interface | BNPLProcessor |
|-----------|---------------|
| Methods | check_eligibility, initiate, verify |
| Implement | KOKO, MintPay |
| Use | Unified BNPL interface |
