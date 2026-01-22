# Group D: Eligibility & Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement BNPL eligibility checking with NIC validation and credit verification

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_MintPay-Processor-Implementation](../Group-C_MintPay-Processor-Implementation/)
- **→ Next Group:** [Group-E_Installment-Management](../Group-E_Installment-Management/)

---

## Group Overview

This group implements BNPL eligibility and verification. Creates eligibility service as the central eligibility checker. Creates KOKO and MintPay eligibility API calls. Creates order amount check for min/max limits. Creates customer history check for previous BNPL status. Creates NIC validation for both old (9-digit) and new (12-digit) formats. Creates phone validation for +94 numbers. Creates age verification derived from NIC. Creates credit score check integration. Creates approval and rejection response handlers with rejection reasons. Creates eligibility caching. Verifies eligibility flow.

### Key Outcomes

- Eligibility service
- KOKO eligibility API
- MintPay eligibility API
- Order amount check
- Customer history check
- NIC validation
- Old NIC format (9-digit)
- New NIC format (12-digit)
- Phone validation (+94)
- Age verification
- Credit score check
- Approval response
- Rejection response
- Rejection reasons
- Eligibility cache
- Eligibility flow verified

### Technology Context

- **NIC Old:** 9 digits + V/X (e.g., 901234567V)
- **NIC New:** 12 digits (e.g., 199012345678)
- **Age:** Derived from NIC
- **Cache:** Redis for eligibility

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-58_Service-NIC-Validation.md` | Create service and NIC validation | 51-58 |
| 02 | `02_Tasks-59-66_Credit-Response-Verify.md` | Create credit check and verification | 59-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create Eligibility Service | High | Task 50 |
| 52 | Create KOKO Eligibility API | Medium | Task 51 |
| 53 | Create MintPay Eligibility | Medium | Task 51 |
| 54 | Create Order Amount Check | Low | Task 51 |
| 55 | Create Customer History Check | Medium | Task 51 |
| 56 | Create NIC Validation | Medium | Task 51 |
| 57 | Create Old NIC Format | Low | Task 56 |
| 58 | Create New NIC Format | Low | Task 56 |
| 59 | Create Phone Validation | Low | Task 51 |
| 60 | Create Age Verification | Medium | Task 56 |
| 61 | Create Credit Score Check | Medium | Task 51 |
| 62 | Create Approval Response | Low | Task 61 |
| 63 | Create Rejection Response | Low | Task 61 |
| 64 | Create Rejection Reasons | Low | Task 63 |
| 65 | Create Eligibility Cache | Medium | Task 51 |
| 66 | Verify Eligibility Flow | Low | Task 65 |

---

## Execution Order

```
Task 51: Eligibility Service
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-52     T-53     T-54     T-55     T-56     T-59     T-61  T-65
(KOKO) (MintPay)(Amount)(History)(NIC)  (Phone)(Credit)(Cache)
    │        │        │        │        │        │        │    │
    │        │        │        │   ┌────┴────┐   │   ┌────┴────┐
    │        │        │        │   ▼         ▼   │   ▼         ▼
    │        │        │        │ T-57      T-58  │ T-62      T-63
    │        │        │        │(Old)    (New)  │(Approve)(Reject)
    │        │        │        │   │         │   │   │         │
    │        │        │        │   └────┬────┘   │   │         ▼
    │        │        │        │        │        │   │       T-64
    │        │        │        │        ▼        │   │    (Reasons)
    │        │        │        │      T-60      │   │         │
    │        │        │        │     (Age)      │   │         │
    │        │        │        │        │        │   │         │
    └────────┴────────┴────────┴────────┴────────┴───┴─────────┘
                              │
                              ▼
                        Task 66: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            └── bnpl/
                ├── eligibility.py
                └── validators.py
```

---

## Notes for AI Agents

### Eligibility Service (Task 51)
| Class | BNPLEligibilityService |
|-------|------------------------|
| Methods | check(customer, order, provider) |
| Return | EligibilityResult |

### KOKO Eligibility API (Task 52)
| Endpoint | KOKO eligibility API |
|----------|----------------------|
| Input | NIC, phone, order amount |
| Output | Eligible or not |

### MintPay Eligibility (Task 53)
| Endpoint | MintPay eligibility API |
|----------|-------------------------|
| Input | NIC, phone, order amount |
| Output | Eligible or not |

### Order Amount Check (Task 54)
| Check | Rule |
|-------|------|
| Minimum | >= ₨5,000 |
| Maximum | <= ₨250,000 |
| Fail | Return ineligible |

### Customer History Check (Task 55)
| Check | Rule |
|-------|------|
| Previous defaults | No unpaid BNPL |
| Existing orders | Check pending |

### NIC Validation (Task 56)
| Formats | Both old and new |
|---------|------------------|
| Output | Validated NIC |
| Error | Invalid format |

### Old NIC Format (Task 57)
| Pattern | XXXXXXXXV or XXXXXXXXX |
|---------|-------------------------|
| Digits | 9 |
| Suffix | V, X, or digit |
| Example | 901234567V |

### New NIC Format (Task 58)
| Pattern | XXXXXXXXXXXX |
|---------|--------------|
| Digits | 12 |
| Year | First 4 digits |
| Example | 199012345678 |

### Phone Validation (Task 59)
| Format | +94XXXXXXXXX |
|--------|--------------|
| Length | 10 digits after 94 |
| Mobile | 7X prefix |

### Age Verification (Task 60)
| Source | NIC |
|--------|-----|
| Old NIC | Year from first 2 digits |
| New NIC | Year from first 4 digits |
| Min age | 18 years |

### Credit Score Check (Task 61)
| Provider | KOKO/MintPay API |
|----------|------------------|
| Check | Creditworthiness |
| Result | Score or pass/fail |

### Approval Response (Task 62)
| Response | Content |
|----------|---------|
| eligible | True |
| limit | Approved amount |
| plans | Available plans |

### Rejection Response (Task 63)
| Response | Content |
|----------|---------|
| eligible | False |
| reason_code | Rejection code |
| message | User-friendly message |

### Rejection Reasons (Task 64)
| Code | Reason |
|------|--------|
| LOW_SCORE | Low credit score |
| AGE | Under 18 |
| AMOUNT | Order outside limits |
| HISTORY | Previous defaults |

### Eligibility Cache (Task 65)
| Cache | Redis |
|-------|-------|
| Key | customer_id:provider |
| TTL | 15 minutes |
| Use | Avoid repeated API calls |
