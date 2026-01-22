# Group B: PayHere Processor Implementation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement PayHereProcessor class with hash generation, data builders, and redirect URL

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_PayHere-Configuration](../Group-A_PayHere-Configuration/)
- **→ Next Group:** [Group-C_Payment-Initialization](../Group-C_Payment-Initialization/)

---

## Group Overview

This group implements the PayHereProcessor class. Creates PayHereProcessor extending PaymentProcessor ABC and registers with factory. Creates MD5 hash generator with proper parameter order and uppercase output. Creates amount formatter for 2 decimal places and currency validator for LKR. Creates order ID generator for unique references. Creates item name builder for product descriptions. Creates customer data builder with first name, last name, and address builder for billing address. Creates phone formatter for +94 Sri Lanka format and email validator. Creates delivery fields builder and custom fields handler. Creates payment intent builder and redirect URL builder. Verifies processor implementation.

### Key Outcomes

- PayHereProcessor class
- Processor registration
- MD5 hash generator
- Hash parameters
- Uppercase MD5
- Amount formatter
- Currency validator
- Order ID generator
- Item name builder
- Customer data builder
- Address builder
- Phone formatter (+94)
- Email validator
- Delivery fields
- Custom fields
- Payment intent builder
- Redirect URL builder
- Processor implementation verified

### Technology Context

- **Hash:** MD5 uppercase
- **Format:** PayHere form fields
- **Phone:** +94 format
- **Currency:** LKR only

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Processor-Hash-Builders.md` | Create processor, hash, and builders | 17-26 |
| 02 | `02_Tasks-27-34_Address-Intent-Verify.md` | Create address, intent, and verification | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create PayHereProcessor Class | High | Task 16 |
| 18 | Create Processor Registration | Low | Task 17 |
| 19 | Create Hash Generator | Medium | Task 17 |
| 20 | Create Hash Parameters | Low | Task 19 |
| 21 | Create Uppercase MD5 | Low | Task 19 |
| 22 | Create Amount Formatter | Low | Task 17 |
| 23 | Create Currency Validator | Low | Task 17 |
| 24 | Create Order ID Generator | Low | Task 17 |
| 25 | Create Item Name Builder | Low | Task 17 |
| 26 | Create Customer Data Builder | Medium | Task 17 |
| 27 | Create Address Builder | Medium | Task 26 |
| 28 | Create Phone Formatter | Low | Task 26 |
| 29 | Create Email Validator | Low | Task 26 |
| 30 | Create Delivery Fields | Low | Task 27 |
| 31 | Create Custom Fields | Low | Task 17 |
| 32 | Create Payment Intent Builder | Medium | Task 31 |
| 33 | Create Redirect URL Builder | Medium | Task 32 |
| 34 | Verify Processor Implementation | Low | Task 33 |

---

## Execution Order

```
Task 17: PayHereProcessor Class
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-18     T-19     T-22     T-23     T-24     T-25     T-26  T-31
(Reg)   (Hash)  (Amt)  (Curr)  (OrderID)(Item)(Customer)(Custom)
    │        │        │        │        │        │        │    │
    │   ┌────┴────┐   │        │        │        │   ┌────┼────┘
    │   ▼         ▼   │        │        │        │   ▼    │
    │ T-20     T-21  │        │        │        │ T-27   │
    │(Params) (Upper) │        │        │        │(Addr)  │
    │   │         │   │        │        │        │   │    │
    │   └────┬────┘   │        │        │        │   │    │
    │        │        │        │        │        ├───┤    │
    │        │        │        │        │        ▼   ▼    │
    │        │        │        │        │      T-28  T-29  │
    │        │        │        │        │     (Phone)(Email)
    │        │        │        │        │        │   │    │
    │        │        │        │        │        └───┤    │
    │        │        │        │        │            ▼    │
    │        │        │        │        │          T-30   │
    │        │        │        │        │       (Delivery)│
    │        │        │        │        │            │    │
    └────────┴────────┴────────┴────────┴────────────┴────┘
                              │
                              ▼
                        Task 32: Intent Builder
                              │
                              ▼
                        Task 33: Redirect URL
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
            └── payhere/
                ├── __init__.py
                ├── processor.py
                ├── hash.py
                └── builders.py
```

---

## Notes for AI Agents

### PayHereProcessor Class (Task 17)
| Attribute | Value |
|-----------|-------|
| gateway_type | PaymentGateway.PAYHERE |
| Extends | PaymentProcessor |
| Methods | All abstract methods |

### Processor Registration (Task 18)
| Register | Method |
|----------|--------|
| Factory | ProcessorFactory.register |
| Key | PaymentGateway.PAYHERE |
| Class | PayHereProcessor |

### Hash Generator (Task 19)
| Algorithm | MD5 |
|-----------|-----|
| Output | Uppercase hex |
| Library | hashlib |

### Hash Parameters (Task 20)
| Order | Fields |
|-------|--------|
| 1 | merchant_id |
| 2 | order_id |
| 3 | amount |
| 4 | currency |
| 5 | merchant_secret (MD5 hashed) |

### Uppercase MD5 (Task 21)
| Requirement | PayHere requirement |
|-------------|---------------------|
| Convert | .upper() |
| Format | ABCDEF123456 |

### Amount Formatter (Task 22)
| Format | Value |
|--------|-------|
| Decimals | 2 places |
| Example | 1234.56 |
| No commas | Just decimal |

### Currency Validator (Task 23)
| Currency | Allowed |
|----------|---------|
| LKR | Yes (only) |
| USD | No |
| Others | No |

### Order ID Generator (Task 24)
| Format | Value |
|--------|-------|
| Pattern | ORD-{tenant}-{uuid} |
| Unique | Always unique |

### Item Name Builder (Task 25)
| Content | Value |
|---------|-------|
| Pattern | "Order #{order_id}" |
| Max | 255 chars |

### Customer Data Builder (Task 26)
| Field | Source |
|-------|--------|
| first_name | Customer.first_name |
| last_name | Customer.last_name |
| email | Customer.email |
| phone | Customer.phone |

### Address Builder (Task 27)
| Field | PayHere Field |
|-------|---------------|
| Line 1 | address |
| City | city |
| Country | country (Sri Lanka) |

### Phone Formatter (Task 28)
| Input | Output |
|-------|--------|
| 0771234567 | 94771234567 |
| +94771234567 | 94771234567 |
| Strip | + and leading 0 |

### Delivery Fields (Task 30)
| Field | PayHere Field |
|-------|---------------|
| delivery_address | delivery_address |
| delivery_city | delivery_city |
| delivery_country | delivery_country |

### Custom Fields (Task 31)
| Field | Use |
|-------|-----|
| custom_1 | Internal order ID |
| custom_2 | Tenant ID |

### Redirect URL Builder (Task 33)
| URL | Format |
|-----|--------|
| Base | PayHere checkout URL |
| Method | POST form redirect |
