# Group B: COD Processor Implementation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Implement CODProcessor with eligibility checks and payment lifecycle

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_COD-Configuration](../Group-A_COD-Configuration/)
- **→ Next Group:** [Group-C_Risk-Management](../Group-C_Risk-Management/)

---

## Group Overview

This group implements the CODProcessor class. Creates CODProcessor extending PaymentProcessor ABC and registers with factory. Creates initiate_payment method with eligibility checks. Creates zone availability check, order amount check, and customer history check. Creates COD fee calculation for flat and percentage fees. Creates pending COD transaction record. Creates verify_payment method for cash collection confirmation. Creates cash collected and collection failed status updates. Creates return to sender handling. Creates process_refund method for rare COD refunds. Creates valid status transitions. Verifies processor flow.

### Key Outcomes

- CODProcessor class
- Processor registration
- initiate_payment method
- COD eligibility check
- Zone availability check
- Order amount check
- Customer history check
- COD fee calculation
- Pending COD transaction
- verify_payment method
- Cash collected status
- Collection failed status
- Return to sender (RTS)
- process_refund method
- Status transitions
- Processor verified

### Technology Context

- **Processor:** Manual collection
- **Eligibility:** Multiple checks
- **Fee:** Flat or percentage
- **States:** Pending → Collected/Failed

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-24_Processor-Eligibility.md` | Create processor and eligibility | 17-24 |
| 02 | `02_Tasks-25-32_Payment-Status-Verify.md` | Create payment and status handling | 25-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create CODProcessor Class | High | Task 16 |
| 18 | Create Processor Registration | Low | Task 17 |
| 19 | Create initiate_payment Method | Medium | Task 17 |
| 20 | Create COD Eligibility Check | Medium | Task 19 |
| 21 | Create Zone Availability Check | Low | Task 20 |
| 22 | Create Order Amount Check | Low | Task 20 |
| 23 | Create Customer History Check | Medium | Task 20 |
| 24 | Create COD Fee Calculation | Medium | Task 17 |
| 25 | Create Pending COD Transaction | Medium | Task 19 |
| 26 | Create verify_payment Method | Medium | Task 17 |
| 27 | Create Cash Collected | Medium | Task 26 |
| 28 | Create Collection Failed | Medium | Task 26 |
| 29 | Create Return to Sender | Medium | Task 28 |
| 30 | Create process_refund Method | Medium | Task 17 |
| 31 | Create Status Transitions | Medium | Task 17 |
| 32 | Verify COD Processor | Low | Task 31 |

---

## Execution Order

```
Task 17: CODProcessor Class
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-18     T-19     T-24     T-26     T-30     T-31
(Reg)  (Init)   (Fee)  (Verify)(Refund)(States)
    │     │        │        │        │        │
    │     ▼        │   ┌────┴────┐   │        │
    │   T-20      │   ▼         ▼   │        │
    │  (Elig)     │ T-27      T-28  │        │
    │     │        │(Collect)(Failed)│        │
    │ ┌───┼────┐   │   │         │   │        │
    │ ▼   ▼    ▼   │   │         ▼   │        │
    │T-21 T-22 T-23│   │       T-29  │        │
    │(Zone)(Amt)(Hist) │       (RTS) │        │
    │ │    │    │   │   │         │   │        │
    │ │    │    ▼   │   │         │   │        │
    │ │    │  T-25 │   │         │   │        │
    │ │    │(Pend) │   │         │   │        │
    │ │    │    │   │   │         │   │        │
    └─┴────┴────┴───┴───┴─────────┴───┴────────┘
                         │
                         ▼
                   Task 32: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            └── cod/
                ├── __init__.py
                ├── processor.py
                ├── eligibility.py
                └── fee_calculator.py
```

---

## Notes for AI Agents

### CODProcessor Class (Task 17)
| Attribute | Value |
|-----------|-------|
| gateway_type | PaymentGateway.COD |
| Extends | PaymentProcessor |
| Type | Manual collection |

### Processor Registration (Task 18)
| Register | Method |
|----------|--------|
| Factory | ProcessorFactory.register |
| Key | PaymentGateway.COD |
| Class | CODProcessor |

### initiate_payment Method (Task 19)
| Input | PaymentIntent |
|-------|---------------|
| Output | PaymentResult |
| Status | PENDING |
| Checks | Eligibility first |

### COD Eligibility Check (Task 20)
| Check | Description |
|-------|-------------|
| Zone | Zone allows COD |
| Amount | Within min/max |
| History | Customer history |
| Blacklist | Not blacklisted |

### Zone Availability Check (Task 21)
| Check | Zone COD enabled |
|-------|------------------|
| District | Customer district |
| Error | "COD not available in your area" |

### Order Amount Check (Task 22)
| Check | Min/max limits |
|-------|----------------|
| Min | Above minimum |
| Max | Below maximum |
| First order | Apply first order limit |

### Customer History Check (Task 23)
| Check | Past COD orders |
|-------|-----------------|
| Success rate | COD success rate |
| Failed count | Count of failed COD |

### COD Fee Calculation (Task 24)
| Type | Calculation |
|------|-------------|
| FLAT | Fixed amount |
| PERCENTAGE | order_total × percentage |

### Pending COD Transaction (Task 25)
| Model | PaymentTransaction |
|-------|---------------------|
| status | PENDING |
| payment_type | COD |
| cod_fee | Calculated fee |

### verify_payment Method (Task 26)
| Input | transaction_id, collection_data |
|-------|----------------------------------|
| Output | PaymentResult |
| Use | Confirm delivery agent collection |

### Cash Collected (Task 27)
| Status | SUCCESS |
|--------|---------|
| Update | Order status to PAID |
| Record | Collection amount |

### Collection Failed (Task 28)
| Status | FAILED |
|--------|--------|
| Reason | Customer unavailable, refused, etc. |
| Attempts | Track attempt count |

### Return to Sender (Task 29)
| Trigger | Max attempts reached |
|---------|---------------------|
| Status | RETURNED |
| Order | Cancel and restock |

### process_refund Method (Task 30)
| Type | Rare COD refund |
|------|-----------------|
| Use | Damaged goods, returns |
| Action | Manual refund process |

### Status Transitions (Task 31)
| From | To |
|------|-----|
| PENDING | DISPATCHED |
| DISPATCHED | OUT_FOR_DELIVERY |
| OUT_FOR_DELIVERY | COLLECTED, FAILED |
| FAILED | RESCHEDULED, RETURNED |
