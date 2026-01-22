# Group B: Bank Transfer Processor

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Implement BankTransferProcessor with payment lifecycle and expiry handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Bank-Account-Configuration](../Group-A_Bank-Account-Configuration/)
- **→ Next Group:** [Group-C_Payment-Reference-Instructions](../Group-C_Payment-Reference-Instructions/)

---

## Group Overview

This group implements the BankTransferProcessor class. Creates BankTransferProcessor extending PaymentProcessor ABC and registers with factory. Creates initiate_payment method that creates pending transaction and returns bank details. Creates verify_payment method for manual verification. Creates confirm and reject payment methods for admin actions. Creates expiry check and expiry Celery task for auto-expiring unpaid orders. Creates process_refund method with refund instructions. Creates status transitions for valid state changes. Verifies processor flow.

### Key Outcomes

- BankTransferProcessor class
- Processor registration
- initiate_payment method
- Pending transaction creation
- Payment intent data
- verify_payment method
- Confirm payment
- Reject payment
- Expiry check
- Expiry Celery task
- process_refund method
- Refund instructions
- Status transitions
- Processor verified

### Technology Context

- **Processor:** Manual verification
- **Expiry:** Celery scheduled task
- **Refund:** Manual process
- **States:** Pending → Confirmed/Expired

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-21_Processor-Payment.md` | Create processor and payment methods | 15-21 |
| 02 | `02_Tasks-22-28_Expiry-Refund-Verify.md` | Create expiry, refund, and verification | 22-28 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create BankTransferProcessor | High | Task 14 |
| 16 | Create Processor Registration | Low | Task 15 |
| 17 | Create initiate_payment Method | Medium | Task 15 |
| 18 | Create Pending Transaction | Medium | Task 17 |
| 19 | Create Payment Intent Data | Low | Task 17 |
| 20 | Create verify_payment Method | Medium | Task 15 |
| 21 | Create Confirm Payment | Medium | Task 20 |
| 22 | Create Reject Payment | Medium | Task 20 |
| 23 | Create Expiry Check | Low | Task 15 |
| 24 | Create Expiry Celery Task | Medium | Task 23 |
| 25 | Create process_refund Method | Medium | Task 15 |
| 26 | Create Refund Instructions | Low | Task 25 |
| 27 | Create Status Transitions | Medium | Task 15 |
| 28 | Verify Processor | Low | Task 27 |

---

## Execution Order

```
Task 15: BankTransferProcessor
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼
T-16     T-17     T-20     T-23     T-25     T-27
(Reg)  (Initiate)(Verify)(Expiry)(Refund)(States)
    │        │        │        │        │        │
    │   ┌────┴────┐   ├────┐   ▼        ▼        │
    │   ▼         ▼   ▼    ▼ T-24    T-26      │
    │ T-18     T-19  T-21  T-22(Task)(Instr)   │
    │(Pend)  (Intent)(Conf)(Rej) │    │        │
    │   │         │   │    │    │    │        │
    └───┴─────────┴───┴────┴────┴────┴────────┘
                         │
                         ▼
                   Task 28: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            └── bank_transfer/
                ├── __init__.py
                └── processor.py
        └── tasks/
            └── expiry_task.py
```

---

## Notes for AI Agents

### BankTransferProcessor (Task 15)
| Attribute | Value |
|-----------|-------|
| gateway_type | PaymentGateway.BANK_TRANSFER |
| Extends | PaymentProcessor |
| Type | Manual |

### Processor Registration (Task 16)
| Register | Method |
|----------|--------|
| Factory | ProcessorFactory.register |
| Key | PaymentGateway.BANK_TRANSFER |
| Class | BankTransferProcessor |

### initiate_payment Method (Task 17)
| Input | PaymentIntent |
|-------|---------------|
| Output | PaymentResult |
| Status | PENDING |
| Action | Return bank details |

### Pending Transaction (Task 18)
| Model | PaymentTransaction |
|-------|---------------------|
| status | PENDING |
| expires_at | now + expiry_hours |

### Payment Intent Data (Task 19)
| Field | Value |
|-------|-------|
| bank_accounts | List of accounts |
| reference | Payment reference |
| amount | Order total |
| expires_at | Expiry datetime |

### verify_payment Method (Task 20)
| Input | transaction_id |
|-------|----------------|
| Output | PaymentResult |
| Use | Check current status |

### Confirm Payment (Task 21)
| Input | transaction_id, admin_id |
|-------|--------------------------|
| Action | Mark as SUCCESS |
| Update | Order status to PAID |
| Notify | Customer |

### Reject Payment (Task 22)
| Input | transaction_id, reason |
|-------|------------------------|
| Action | Mark as FAILED |
| Update | Order status |
| Notify | Customer with reason |

### Expiry Check (Task 23)
| Check | expires_at < now |
|-------|------------------|
| Status | PENDING only |
| Action | Return is_expired |

### Expiry Celery Task (Task 24)
| Schedule | Every hour |
|----------|------------|
| Query | Expired pending payments |
| Action | Mark as EXPIRED |
| Update | Order status to CANCELLED |

### process_refund Method (Task 25)
| Type | Manual refund |
|------|---------------|
| Action | Create refund record |
| Output | Refund instructions |

### Refund Instructions (Task 26)
| Content | Value |
|---------|-------|
| Message | "Refund will be processed..." |
| Include | Customer bank details |
| Timeline | 3-5 business days |

### Status Transitions (Task 27)
| From | To |
|------|-----|
| PENDING | CONFIRMED, REJECTED, EXPIRED |
| CONFIRMED | REFUNDED |
| EXPIRED | (terminal) |
| REJECTED | (terminal) |
