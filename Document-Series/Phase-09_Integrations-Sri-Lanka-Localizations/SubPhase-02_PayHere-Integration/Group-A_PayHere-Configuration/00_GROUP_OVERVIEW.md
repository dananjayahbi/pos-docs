# Group A: PayHere Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up PayHere configuration with API URLs, settings, and tenant-specific config

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_PayHere-Processor-Implementation](../Group-B_PayHere-Processor-Implementation/)

---

## Group Overview

This group sets up PayHere configuration. Creates PayHere constants with API URLs and endpoints. Creates sandbox and production URL configurations. Creates Django settings module with merchant ID, merchant secret, sandbox toggle, and callback URLs (notify, return, cancel). Creates PayHere config model for tenant-specific settings with encrypted merchant secret. Creates config validation to verify credentials. Creates environment detection for auto sandbox/production switching. Creates PayHere client initialization. Verifies PayHere configuration loads correctly.

### Key Outcomes

- PayHere constants
- Sandbox URL config
- Production URL config
- PayHere settings module
- Merchant ID setting
- Merchant secret setting
- Sandbox toggle setting
- Notify URL setting
- Return URL setting
- Cancel URL setting
- PayHere config model
- Config encryption
- Config validation
- Environment detection
- PayHere client init
- PayHere configuration verified

### Technology Context

- **Gateway:** PayHere (Sri Lanka)
- **Sandbox:** sandbox.payhere.lk
- **Production:** www.payhere.lk
- **Currency:** LKR only

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Constants-Settings.md` | Create constants and settings | 01-08 |
| 02 | `02_Tasks-09-12_URLs-Config-Model.md` | Create URLs and config model with encryption | 09-12 |
| 03 | `03_Tasks-13-16_Validation-Client-Verify.md` | Create validation, environment detection, and client | 13-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create PayHere Constants | Low | SubPhase-01 |
| 02 | Create Sandbox URL Config | Low | Task 01 |
| 03 | Create Production URL Config | Low | Task 01 |
| 04 | Create PayHere Settings | Medium | Task 01 |
| 05 | Create Merchant ID Setting | Low | Task 04 |
| 06 | Create Merchant Secret Setting | Low | Task 04 |
| 07 | Create Sandbox Toggle Setting | Low | Task 04 |
| 08 | Create Notify URL Setting | Low | Task 04 |
| 09 | Create Return URL Setting | Low | Task 04 |
| 10 | Create Cancel URL Setting | Low | Task 04 |
| 11 | Create PayHere Config Model | Medium | Task 04 |
| 12 | Create Config Encryption | Medium | Task 11 |
| 13 | Create Config Validation | Medium | Task 11 |
| 14 | Create Environment Detection | Low | Task 07 |
| 15 | Create PayHere Client Init | Medium | Task 14 |
| 16 | Verify PayHere Configuration | Low | Task 15 |

---

## Execution Order

```
Task 01: PayHere Constants
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-02     T-03     T-04
(Sandbox)(Prod) (Settings)
    │        │        │
    │        │   ┌────┼────┬────────┬────────┬────────┐
    │        │   ▼    ▼    ▼        ▼        ▼        ▼
    │        │ T-05  T-06  T-07   T-08    T-09    T-10
    │        │(MerchID)(Secret)(Sandbox)(Notify)(Return)(Cancel)
    │        │   │    │    │        │        │        │
    │        │   └────┴────┼────────┴────────┴────────┘
    │        │             │
    │        │             ▼
    │        │          T-14
    │        │        (EnvDetect)
    │        │             │
    └────────┴─────────────┘
                   │
                   ▼
             Task 11: Config Model
                   │
              ┌────┴────┐
              ▼         ▼
           T-12      T-13
        (Encrypt)  (Valid)
              │         │
              └────┬────┘
                   │
                   ▼
             Task 15: Client Init
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
            └── payhere/
                ├── __init__.py
                ├── constants.py
                └── config.py
```

---

## Notes for AI Agents

### PayHere Constants (Task 01)
| Constant | Value |
|----------|-------|
| CHECKOUT_ENDPOINT | /pay/checkout |
| VERIFY_ENDPOINT | /merchant/v1/payment/verify |
| REFUND_ENDPOINT | /merchant/v1/payment/refund |

### Sandbox URL Config (Task 02)
| Setting | Value |
|---------|-------|
| BASE_URL | https://sandbox.payhere.lk |
| Use | Development/testing |

### Production URL Config (Task 03)
| Setting | Value |
|---------|-------|
| BASE_URL | https://www.payhere.lk |
| Use | Production only |

### PayHere Settings (Task 04)
| Setting | Source |
|---------|--------|
| Location | settings.py or env |
| Prefix | PAYHERE_ |

### Merchant ID Setting (Task 05)
| Setting | Value |
|---------|-------|
| Name | PAYHERE_MERCHANT_ID |
| Type | String |
| Required | Yes |

### Merchant Secret Setting (Task 06)
| Setting | Value |
|---------|-------|
| Name | PAYHERE_MERCHANT_SECRET |
| Type | String |
| Security | Never expose |

### Sandbox Toggle Setting (Task 07)
| Setting | Value |
|---------|-------|
| Name | PAYHERE_SANDBOX |
| Type | Boolean |
| Default | True in DEBUG |

### Notify URL Setting (Task 08)
| Setting | Value |
|---------|-------|
| Name | PAYHERE_NOTIFY_URL |
| Format | https://domain/api/webhooks/payhere/ |
| Required | Yes |

### Return URL Setting (Task 09)
| Setting | Value |
|---------|-------|
| Name | PAYHERE_RETURN_URL |
| Format | https://domain/checkout/success/ |

### Cancel URL Setting (Task 10)
| Setting | Value |
|---------|-------|
| Name | PAYHERE_CANCEL_URL |
| Format | https://domain/checkout/cancel/ |

### PayHere Config Model (Task 11)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| merchant_id | CharField |
| merchant_secret | EncryptedField |
| is_sandbox | BooleanField |

### Config Encryption (Task 12)
| Field | Method |
|-------|--------|
| merchant_secret | Fernet encryption |
| Key | From settings |

### Config Validation (Task 13)
| Validation | Check |
|------------|-------|
| merchant_id | Not empty |
| merchant_secret | Not empty |
| notify_url | Valid URL |

### Environment Detection (Task 14)
| Condition | Mode |
|-----------|------|
| DEBUG=True | Sandbox |
| DEBUG=False | Production |
| Override | PAYHERE_SANDBOX |
