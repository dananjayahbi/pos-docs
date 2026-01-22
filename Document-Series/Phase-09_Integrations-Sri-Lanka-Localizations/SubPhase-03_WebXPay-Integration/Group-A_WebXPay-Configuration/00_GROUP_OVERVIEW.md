# Group A: WebXPay Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 03 - WebXPay Integration  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Set up WebXPay configuration with API URLs, settings, and tenant-specific config

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_WebXPay-Processor-Implementation](../Group-B_WebXPay-Processor-Implementation/)

---

## Group Overview

This group sets up WebXPay configuration. Creates WebXPay constants with API URLs and endpoints. Creates sandbox and production URL configurations. Creates Django settings module with API key, secret key, merchant ID, sandbox toggle, and callback URL. Creates WebXPay config model for tenant-specific settings with encrypted secret key. Creates config validation to verify credentials. Creates API client initialization. Verifies WebXPay configuration loads correctly.

### Key Outcomes

- WebXPay constants
- Sandbox URL config
- Production URL config
- WebXPay settings module
- API key setting
- Secret key setting
- Merchant ID setting
- Sandbox toggle setting
- Callback URL setting
- WebXPay config model
- Config validation
- Config encryption
- API client init
- WebXPay configuration verified

### Technology Context

- **Gateway:** WebXPay (Sri Lanka)
- **API:** REST-based
- **Signature:** HMAC-SHA256
- **Currency:** LKR only

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Constants-Settings.md` | Create constants and settings | 01-07 |
| 02 | `02_Tasks-08-14_Config-Verify.md` | Create config and verification | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create WebXPay Constants | Low | SubPhase-01 |
| 02 | Create Sandbox URL | Low | Task 01 |
| 03 | Create Production URL | Low | Task 01 |
| 04 | Create WebXPay Settings | Medium | Task 01 |
| 05 | Create API Key Setting | Low | Task 04 |
| 06 | Create Secret Key Setting | Low | Task 04 |
| 07 | Create Merchant ID Setting | Low | Task 04 |
| 08 | Create Sandbox Toggle | Low | Task 04 |
| 09 | Create Callback URL Setting | Low | Task 04 |
| 10 | Create WebXPay Config Model | Medium | Task 04 |
| 11 | Create Config Validation | Medium | Task 10 |
| 12 | Create Config Encryption | Medium | Task 10 |
| 13 | Create API Client Init | Medium | Task 12 |
| 14 | Verify Configuration | Low | Task 13 |

---

## Execution Order

```
Task 01: WebXPay Constants
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-02     T-03     T-04
(Sandbox)(Prod) (Settings)
    │        │        │
    │        │   ┌────┼────┬────┬────┬────┐
    │        │   ▼    ▼    ▼    ▼    ▼    ▼
    │        │ T-05  T-06  T-07  T-08  T-09
    │        │(API) (Secret)(Merch)(Sand)(Callback)
    │        │   │    │    │    │    │
    │        │   └────┴────┴────┴────┘
    │        │             │
    └────────┴─────────────┘
                   │
                   ▼
             Task 10: Config Model
                   │
              ┌────┴────┐
              ▼         ▼
           T-11      T-12
         (Valid)  (Encrypt)
              │         │
              └────┬────┘
                   │
                   ▼
             Task 13: API Client Init
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
        └── processors/
            └── webxpay/
                ├── __init__.py
                ├── constants.py
                └── config.py
```

---

## Notes for AI Agents

### WebXPay Constants (Task 01)
| Constant | Value |
|----------|-------|
| PAYMENT_ENDPOINT | /api/v1/payment |
| STATUS_ENDPOINT | /api/v1/payment/status |
| REFUND_ENDPOINT | /api/v1/payment/refund |

### Sandbox URL (Task 02)
| Setting | Value |
|---------|-------|
| BASE_URL | WebXPay sandbox URL |
| Use | Development/testing |

### Production URL (Task 03)
| Setting | Value |
|---------|-------|
| BASE_URL | WebXPay production URL |
| Use | Production only |

### WebXPay Settings (Task 04)
| Setting | Source |
|---------|--------|
| Location | settings.py or env |
| Prefix | WEBXPAY_ |

### API Key Setting (Task 05)
| Setting | Value |
|---------|-------|
| Name | WEBXPAY_API_KEY |
| Type | String |
| Required | Yes |

### Secret Key Setting (Task 06)
| Setting | Value |
|---------|-------|
| Name | WEBXPAY_SECRET_KEY |
| Type | String |
| Security | Never expose |

### Merchant ID Setting (Task 07)
| Setting | Value |
|---------|-------|
| Name | WEBXPAY_MERCHANT_ID |
| Type | String |
| Required | Yes |

### Sandbox Toggle (Task 08)
| Setting | Value |
|---------|-------|
| Name | WEBXPAY_SANDBOX |
| Type | Boolean |
| Default | True in DEBUG |

### Callback URL Setting (Task 09)
| Setting | Value |
|---------|-------|
| Name | WEBXPAY_CALLBACK_URL |
| Format | https://domain/api/webhooks/webxpay/ |
| Required | Yes |

### WebXPay Config Model (Task 10)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| api_key | CharField |
| secret_key | EncryptedField |
| merchant_id | CharField |
| is_sandbox | BooleanField |

### Config Validation (Task 11)
| Validation | Check |
|------------|-------|
| api_key | Not empty |
| secret_key | Not empty |
| merchant_id | Not empty |
| callback_url | Valid URL |

### Config Encryption (Task 12)
| Field | Method |
|-------|--------|
| secret_key | Fernet encryption |
| Key | From settings |
