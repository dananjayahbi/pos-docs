# Group A: BNPL Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up BNPL configuration for KOKO and MintPay with API URLs and tenant settings

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_KOKO-Processor-Implementation](../Group-B_KOKO-Processor-Implementation/)

---

## Group Overview

This group sets up BNPL configuration for both KOKO and MintPay. Creates BNPL constants with API URLs and endpoints. Creates sandbox and production URL configurations for both providers. Creates Django settings modules with API keys and merchant IDs. Creates BNPL config model for tenant-specific settings with min/max order amounts. Creates installment plans configuration. Creates config validation. Verifies BNPL configuration loads correctly.

### Key Outcomes

- BNPL constants
- KOKO sandbox URL
- KOKO production URL
- MintPay sandbox URL
- MintPay production URL
- KOKO settings
- KOKO API key
- KOKO merchant ID
- MintPay settings
- MintPay API key
- MintPay merchant ID
- BNPL config model
- Min/max order amount
- Installment plans config
- Config validation
- BNPL configuration verified

### Technology Context

- **Providers:** KOKO, MintPay
- **Payment:** Buy Now Pay Later
- **Plans:** 3, 4, 6 month
- **Currency:** LKR only

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Constants-Settings.md` | Create constants and settings | 01-08 |
| 02 | `02_Tasks-09-16_Config-Verify.md` | Create config and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create BNPL Constants | Low | SubPhase-01 |
| 02 | Create KOKO Sandbox URL | Low | Task 01 |
| 03 | Create KOKO Production URL | Low | Task 01 |
| 04 | Create MintPay Sandbox URL | Low | Task 01 |
| 05 | Create MintPay Production URL | Low | Task 01 |
| 06 | Create KOKO Settings | Medium | Task 01 |
| 07 | Create KOKO API Key | Low | Task 06 |
| 08 | Create KOKO Merchant ID | Low | Task 06 |
| 09 | Create MintPay Settings | Medium | Task 01 |
| 10 | Create MintPay API Key | Low | Task 09 |
| 11 | Create MintPay Merchant ID | Low | Task 09 |
| 12 | Create BNPL Config Model | Medium | Task 06 |
| 13 | Create Min/Max Order Amount | Low | Task 12 |
| 14 | Create Installment Plans | Medium | Task 12 |
| 15 | Create Config Validation | Medium | Task 12 |
| 16 | Verify BNPL Configuration | Low | Task 15 |

---

## Execution Order

```
Task 01: BNPL Constants
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-02     T-03     T-04     T-05     T-06    T-09
(KokoSB)(KokoPR)(MintSB)(MintPR) (KOKO)(MintPay)
    │        │        │        │        │      │
    │        │        │        │   ┌────┴───┐  ├────┐
    │        │        │        │   ▼        ▼  ▼    ▼
    │        │        │        │ T-07    T-08 T-10 T-11
    │        │        │        │(API)  (Merch)(API)(Merch)
    │        │        │        │   │        │  │    │
    └────────┴────────┴────────┴───┴────────┴──┴────┘
                              │
                              ▼
                        Task 12: BNPL Config Model
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                 T-13      T-14      T-15
               (Limits)  (Plans)   (Valid)
                    │         │         │
                    └─────────┴─────────┘
                              │
                              ▼
                        Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            ├── koko/
            │   ├── __init__.py
            │   ├── constants.py
            │   └── config.py
            └── mintpay/
                ├── __init__.py
                ├── constants.py
                └── config.py
```

---

## Notes for AI Agents

### BNPL Constants (Task 01)
| Provider | Endpoints |
|----------|-----------|
| KOKO | /checkout, /verify, /eligibility |
| MintPay | /payment, /status, /check |

### KOKO Sandbox URL (Task 02)
| Setting | Value |
|---------|-------|
| BASE_URL | KOKO sandbox URL |
| Use | Development/testing |

### KOKO Production URL (Task 03)
| Setting | Value |
|---------|-------|
| BASE_URL | KOKO production URL |
| Use | Production only |

### MintPay Sandbox URL (Task 04)
| Setting | Value |
|---------|-------|
| BASE_URL | MintPay sandbox URL |
| Use | Development/testing |

### MintPay Production URL (Task 05)
| Setting | Value |
|---------|-------|
| BASE_URL | MintPay production URL |
| Use | Production only |

### KOKO Settings (Task 06)
| Setting | Source |
|---------|--------|
| Location | settings.py or env |
| Prefix | KOKO_ |

### KOKO API Key (Task 07)
| Setting | Value |
|---------|-------|
| Name | KOKO_API_KEY |
| Type | String |
| Required | Yes |

### KOKO Merchant ID (Task 08)
| Setting | Value |
|---------|-------|
| Name | KOKO_MERCHANT_ID |
| Type | String |
| Required | Yes |

### MintPay Settings (Task 09)
| Setting | Source |
|---------|--------|
| Location | settings.py or env |
| Prefix | MINTPAY_ |

### MintPay API Key (Task 10)
| Setting | Value |
|---------|-------|
| Name | MINTPAY_API_KEY |
| Type | String |
| Required | Yes |

### MintPay Merchant ID (Task 11)
| Setting | Value |
|---------|-------|
| Name | MINTPAY_MERCHANT_ID |
| Type | String |
| Required | Yes |

### BNPL Config Model (Task 12)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| koko_enabled | BooleanField |
| mintpay_enabled | BooleanField |
| min_order_amount | DecimalField |
| max_order_amount | DecimalField |

### Min/Max Order Amount (Task 13)
| Field | Default |
|-------|---------|
| min_order_amount | ₨5,000 |
| max_order_amount | ₨250,000 |

### Installment Plans (Task 14)
| Plan | Months |
|------|--------|
| 3-month | 3 equal payments |
| 4-month | 4 equal payments |
| 6-month | 6 equal payments |

### Config Validation (Task 15)
| Validation | Check |
|------------|-------|
| API keys | Not empty |
| Merchant IDs | Not empty |
| Min < Max | Order limits valid |
