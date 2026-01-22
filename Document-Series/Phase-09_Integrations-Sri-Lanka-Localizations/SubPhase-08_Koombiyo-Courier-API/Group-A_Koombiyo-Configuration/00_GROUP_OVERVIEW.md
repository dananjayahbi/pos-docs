# Group A: Koombiyo Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up Koombiyo courier API configuration with credentials and tenant settings

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_API-Client-Implementation](../Group-B_API-Client-Implementation/)

---

## Group Overview

This group sets up Koombiyo configuration. Creates constants for API URLs including sandbox and production endpoints. Creates Django settings module with API key, merchant ID, sandbox toggle, and webhook secret settings. Creates KoombiyoConfig model with tenant pickup address, contact details, default package weight, and COD enabled toggle. Creates configuration validation to verify credentials. Creates Django admin for config management. Verifies configuration loading.

### Key Outcomes

- Koombiyo constants
- Sandbox URL
- Production URL
- Koombiyo settings
- API key setting
- Merchant ID setting
- Sandbox toggle
- Webhook secret
- KoombiyoConfig model
- Pickup address
- Contact details
- Default weight
- COD enabled
- Config validation
- Config admin
- Configuration verified

### Technology Context

- **Sandbox:** Test environment
- **Production:** Live API
- **Credentials:** API key + merchant ID
- **Per-tenant:** Individual config

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Constants-Settings.md` | Create constants and settings | 01-08 |
| 02 | `02_Tasks-09-16_Model-Admin-Verify.md` | Create model and admin | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Koombiyo Constants | Low | SubPhase-07 |
| 02 | Create Sandbox URL | Low | Task 01 |
| 03 | Create Production URL | Low | Task 01 |
| 04 | Create Koombiyo Settings | Medium | Task 01 |
| 05 | Create API Key Setting | Low | Task 04 |
| 06 | Create Merchant ID Setting | Low | Task 04 |
| 07 | Create Sandbox Toggle | Low | Task 04 |
| 08 | Create Webhook Secret | Low | Task 04 |
| 09 | Create KoombiyoConfig Model | Medium | Task 04 |
| 10 | Create Pickup Address | Low | Task 09 |
| 11 | Create Contact Details | Low | Task 09 |
| 12 | Create Default Weight | Low | Task 09 |
| 13 | Create COD Enabled | Low | Task 09 |
| 14 | Create Config Validation | Medium | Task 09 |
| 15 | Create Config Admin | Medium | Task 09 |
| 16 | Verify Configuration | Low | Task 15 |

---

## Execution Order

```
Task 01: Koombiyo Constants
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-02     T-03     T-04
(Sand)  (Prod) (Settings)
    │        │        │
    │        │   ┌────┼────┬────────┬────────┐
    │        │   ▼    ▼    ▼        ▼        ▼
    │        │ T-05  T-06  T-07    T-08    T-09
    │        │(Key)(Merch)(Sand) (Secret)(Config)
    │        │   │    │    │        │        │
    │        │   │    │    │        │   ┌────┼────┬────────┬────────┐
    │        │   │    │    │        │   ▼    ▼    ▼        ▼        ▼
    │        │   │    │    │        │ T-10  T-11  T-12    T-13    T-14
    │        │   │    │    │        │(Addr)(Cont)(Wt)   (COD)  (Valid)
    │        │   │    │    │        │   │    │    │        │        │
    └────────┴───┴────┴────┴────────┴───┴────┴────┴────────┴────────┘
                                            │
                                            ▼
                                      Task 15: Config Admin
                                            │
                                            ▼
                                      Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        └── providers/
            └── koombiyo/
                ├── __init__.py
                ├── constants.py
                └── config.py
```

---

## Notes for AI Agents

### Koombiyo Constants (Task 01)
| Constant | Description |
|----------|-------------|
| SANDBOX_URL | Test API base URL |
| PRODUCTION_URL | Live API base URL |
| ENDPOINTS | API endpoint paths |

### Sandbox URL (Task 02)
| Setting | Value |
|---------|-------|
| URL | https://sandbox.koombiyo.lk/api/ |
| Use | Testing and development |

### Production URL (Task 03)
| Setting | Value |
|---------|-------|
| URL | https://api.koombiyo.lk/api/ |
| Use | Live production |

### Koombiyo Settings (Task 04)
| File | settings/koombiyo.py |
|------|----------------------|
| Purpose | Koombiyo-specific settings |

### API Key Setting (Task 05)
| Setting | KOOMBIYO_API_KEY |
|---------|------------------|
| Env var | KOOMBIYO_API_KEY |
| Required | Yes |

### Merchant ID Setting (Task 06)
| Setting | KOOMBIYO_MERCHANT_ID |
|---------|----------------------|
| Env var | KOOMBIYO_MERCHANT_ID |
| Required | Yes |

### Sandbox Toggle (Task 07)
| Setting | KOOMBIYO_SANDBOX |
|---------|------------------|
| Default | True (development) |
| Prod | False |

### Webhook Secret (Task 08)
| Setting | KOOMBIYO_WEBHOOK_SECRET |
|---------|-------------------------|
| Use | Verify webhook signatures |

### KoombiyoConfig Model (Task 09)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| api_key | CharField |
| merchant_id | CharField |
| is_active | BooleanField |

### Pickup Address (Task 10)
| Field | Type |
|-------|------|
| pickup_address | TextField |
| pickup_city | ForeignKey (City) |
| pickup_district | ForeignKey (District) |

### Contact Details (Task 11)
| Field | Type |
|-------|------|
| contact_name | CharField |
| contact_phone | CharField |
| contact_email | EmailField |

### Default Weight (Task 12)
| Field | Type |
|-------|------|
| default_weight | DecimalField |
| Unit | kg |
| Default | 0.5 |

### COD Enabled (Task 13)
| Field | Type |
|-------|------|
| cod_enabled | BooleanField |
| Default | True |
| Use | Allow COD via Koombiyo |

### Config Validation (Task 14)
| Validate | API credentials |
|----------|-----------------|
| Method | Test API call |
| Error | Invalid credentials |
