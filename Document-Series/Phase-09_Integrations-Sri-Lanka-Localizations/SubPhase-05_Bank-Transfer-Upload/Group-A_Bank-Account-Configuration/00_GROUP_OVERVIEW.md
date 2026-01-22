# Group A: Bank Account Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Set up bank account configuration for tenant-specific bank transfer payments

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Bank-Transfer-Processor](../Group-B_Bank-Transfer-Processor/)

---

## Group Overview

This group sets up bank account configuration. Creates BankAccount model with bank name, account number, account holder name, branch, and Swift code fields. Creates is_active toggle and display order for multiple accounts. Creates Sri Lanka banks list with common banks. Creates Django admin for bank account management. Creates BankTransferConfig model for transfer settings. Creates payment expiry hours and reminder settings. Verifies bank configuration.

### Key Outcomes

- BankAccount model
- Bank name field
- Account number field
- Account name field
- Branch field
- Swift code field
- Is active field
- Display order field
- Sri Lanka banks list
- Bank account admin
- BankTransferConfig model
- Payment expiry hours
- Reminder settings
- Bank configuration verified

### Technology Context

- **Banks:** Sri Lanka banks
- **Multi-account:** Multiple per tenant
- **Expiry:** Configurable hours
- **Reminders:** Before expiry

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Model-Fields.md` | Create model and fields | 01-07 |
| 02 | `02_Tasks-08-14_Config-Verify.md` | Create config and verification | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create BankAccount Model | Medium | SubPhase-01 |
| 02 | Create Bank Name Field | Low | Task 01 |
| 03 | Create Account Number Field | Low | Task 01 |
| 04 | Create Account Name Field | Low | Task 01 |
| 05 | Create Branch Field | Low | Task 01 |
| 06 | Create Swift Code Field | Low | Task 01 |
| 07 | Create Is Active Field | Low | Task 01 |
| 08 | Create Display Order Field | Low | Task 01 |
| 09 | Create Sri Lanka Banks List | Low | Task 01 |
| 10 | Create Bank Account Admin | Medium | Task 01 |
| 11 | Create BankTransferConfig | Medium | Task 01 |
| 12 | Create Payment Expiry Hours | Low | Task 11 |
| 13 | Create Reminder Settings | Medium | Task 11 |
| 14 | Verify Bank Configuration | Low | Task 13 |

---

## Execution Order

```
Task 01: BankAccount Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-02     T-03     T-04     T-05     T-06     T-07     T-08     T-09
(Bank) (AccNum) (Name) (Branch)(Swift)(Active)(Order)(Banks)
    │        │        │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┴────────┴────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
             Task 10: Admin      Task 11: Config
                    │                   │
                    │              ┌────┴────┐
                    │              ▼         ▼
                    │           T-12      T-13
                    │         (Expiry) (Remind)
                    │              │         │
                    └──────────────┴─────────┘
                              │
                              ▼
                        Task 14: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        ├── models/
        │   └── bank_account.py
        └── processors/
            └── bank_transfer/
                ├── __init__.py
                └── config.py
```

---

## Notes for AI Agents

### BankAccount Model (Task 01)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| bank_name | CharField |
| account_number | CharField |
| account_name | CharField |
| is_active | BooleanField |

### Bank Name Field (Task 02)
| Field | Type |
|-------|------|
| Name | bank_name |
| Choices | Sri Lanka banks |
| Required | Yes |

### Account Number Field (Task 03)
| Field | Type |
|-------|------|
| Name | account_number |
| Max length | 20 |
| Required | Yes |

### Account Name Field (Task 04)
| Field | Type |
|-------|------|
| Name | account_name |
| Description | Account holder name |
| Required | Yes |

### Branch Field (Task 05)
| Field | Type |
|-------|------|
| Name | branch |
| Description | Bank branch |
| Required | No |

### Swift Code Field (Task 06)
| Field | Type |
|-------|------|
| Name | swift_code |
| Description | SWIFT/BIC code |
| Required | No |

### Is Active Field (Task 07)
| Field | Type |
|-------|------|
| Name | is_active |
| Default | True |
| Use | Toggle visibility |

### Display Order Field (Task 08)
| Field | Type |
|-------|------|
| Name | display_order |
| Default | 0 |
| Use | Order in list |

### Sri Lanka Banks List (Task 09)
| Bank | Code |
|------|------|
| Bank of Ceylon | BOC |
| People's Bank | PB |
| Commercial Bank | COMBANK |
| Sampath Bank | SAMPATH |
| Hatton National Bank | HNB |
| Seylan Bank | SEYLAN |
| Nations Trust Bank | NTB |
| DFCC Bank | DFCC |

### BankTransferConfig (Task 11)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| payment_expiry_hours | IntegerField |
| reminder_hours_before | JSONField |

### Payment Expiry Hours (Task 12)
| Field | Value |
|-------|-------|
| Default | 48 hours |
| Min | 1 hour |
| Max | 168 hours (7 days) |

### Reminder Settings (Task 13)
| Setting | Value |
|---------|-------|
| First reminder | 24 hours before |
| Final reminder | 6 hours before |
| Channel | Email, WhatsApp |
