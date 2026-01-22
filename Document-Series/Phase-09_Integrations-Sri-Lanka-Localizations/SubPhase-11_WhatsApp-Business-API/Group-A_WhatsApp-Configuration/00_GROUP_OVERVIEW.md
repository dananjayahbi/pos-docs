# Group A: WhatsApp Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up WhatsApp Business API configuration and opt-in models

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_API-Client-Auth](../Group-B_API-Client-Auth/)

---

## Group Overview

This group sets up WhatsApp configuration. Creates WhatsApp constants for API URLs and versions. Creates Django settings with access token, phone number ID, business account ID, and webhook verify token. Creates WhatsAppConfig model for tenant configuration with phone_number_id, encrypted access_token, is_enabled toggle, and daily_limit fields. Creates WhatsAppOptIn model to track customer consent with customer foreign key, opted_in_at and opted_out_at timestamps. Generates migrations.

### Key Outcomes

- WhatsApp constants
- WhatsApp settings
- Access token setting
- Phone ID setting
- Business ID setting
- Verify token setting
- WhatsAppConfig model
- phone_number_id field
- access_token field
- is_enabled field
- daily_limit field
- WhatsAppOptIn model
- customer FK
- opted_in_at field
- opted_out_at field
- WhatsApp migrations

### Technology Context

- **API:** Meta WhatsApp Cloud API
- **Auth:** Bearer token
- **Consent:** Opt-in required
- **Limits:** Messaging tier limits

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Settings-Config-Model.md` | Create settings and config model | 01-08 |
| 02 | `02_Tasks-09-16_OptIn-Migration.md` | Create opt-in model and migration | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create WhatsApp Constants | Low | SubPhase-10 |
| 02 | Create WhatsApp Settings | Low | Task 01 |
| 03 | Create WHATSAPP_ACCESS_TOKEN | Low | Task 02 |
| 04 | Create WHATSAPP_PHONE_ID | Low | Task 02 |
| 05 | Create WHATSAPP_BUSINESS_ID | Low | Task 02 |
| 06 | Create WHATSAPP_VERIFY_TOKEN | Low | Task 02 |
| 07 | Create WhatsAppConfig Model | Medium | Task 02 |
| 08 | Create phone_number_id Field | Low | Task 07 |
| 09 | Create access_token Field | Medium | Task 07 |
| 10 | Create is_enabled Field | Low | Task 07 |
| 11 | Create daily_limit Field | Low | Task 07 |
| 12 | Create WhatsAppOptIn Model | Medium | Task 07 |
| 13 | Create customer FK | Low | Task 12 |
| 14 | Create opted_in_at Field | Low | Task 12 |
| 15 | Create opted_out_at Field | Low | Task 12 |
| 16 | Create WhatsApp Migrations | Low | Task 15 |

---

## Execution Order

```
Task 01: WhatsApp Constants
    │
    ▼
Task 02: WhatsApp Settings
    │
    ├─────────┬─────────┬─────────┬─────────┐
    ▼         ▼         ▼         ▼         ▼
T-03       T-04       T-05       T-06     T-07
(Token)   (Phone)    (Biz)    (Verify)(Config)
    │         │         │         │         │
    │         │         │         │    ┌────┼────┬────────┬────────┐
    │         │         │         │    ▼    ▼    ▼        ▼        ▼
    │         │         │         │  T-08  T-09  T-10    T-11    T-12
    │         │         │         │ (PID) (Tok)(Enable)(Limit)(OptIn)
    │         │         │         │    │    │    │        │        │
    │         │         │         │    │    │    │        │   ┌────┼────┬────────┐
    │         │         │         │    │    │    │        │   ▼    ▼    ▼        ▼
    │         │         │         │    │    │    │        │ T-13  T-14  T-15
    │         │         │         │    │    │    │        │(Cust)(In) (Out)
    │         │         │         │    │    │    │        │   │    │    │
    └─────────┴─────────┴─────────┴────┴────┴────┴────────┴───┴────┴────┘
                                                 │
                                                 ▼
                                        Task 16: Migrations
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── notifications/
        ├── constants.py
        ├── settings.py
        └── models/
            ├── whatsapp_config.py
            └── whatsapp_optin.py
```

---

## Notes for AI Agents

### WhatsApp Constants (Task 01)
| Constant | Value |
|----------|-------|
| API_VERSION | v18.0 |
| API_BASE_URL | https://graph.facebook.com/ |

### WhatsApp Settings (Task 02)
| File | settings/whatsapp.py |
|------|----------------------|
| Purpose | WhatsApp-specific settings |

### WHATSAPP_ACCESS_TOKEN (Task 03)
| Setting | WHATSAPP_ACCESS_TOKEN |
|---------|----------------------|
| Env var | WHATSAPP_ACCESS_TOKEN |
| Type | Secret |

### WHATSAPP_PHONE_ID (Task 04)
| Setting | WHATSAPP_PHONE_ID |
|---------|-------------------|
| Env var | WHATSAPP_PHONE_ID |
| Use | Phone number ID |

### WHATSAPP_BUSINESS_ID (Task 05)
| Setting | WHATSAPP_BUSINESS_ID |
|---------|----------------------|
| Env var | WHATSAPP_BUSINESS_ID |
| Use | Business account ID |

### WHATSAPP_VERIFY_TOKEN (Task 06)
| Setting | WHATSAPP_VERIFY_TOKEN |
|---------|----------------------|
| Use | Webhook verification |
| Type | Random string |

### WhatsAppConfig Model (Task 07)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| phone_number_id | CharField |
| access_token | EncryptedField |
| is_enabled | BooleanField |
| daily_limit | IntegerField |

### access_token Field (Task 09)
| Field | Type |
|-------|------|
| Name | access_token |
| Encryption | django-fernet-fields |
| Sensitive | Yes |

### is_enabled Field (Task 10)
| Field | Type |
|-------|------|
| Name | is_enabled |
| Default | False |
| Use | Enable/disable per tenant |

### daily_limit Field (Task 11)
| Field | Type |
|-------|------|
| Name | daily_limit |
| Default | 1000 |
| Use | Limit messages per day |

### WhatsAppOptIn Model (Task 12)
| Class | WhatsAppOptIn |
|-------|---------------|
| Purpose | Track customer consent |
| Required | For all messaging |

### customer FK (Task 13)
| Field | Type |
|-------|------|
| Name | customer |
| Related | Customer model |
| Unique | Yes per tenant |

### opted_in_at Field (Task 14)
| Field | Type |
|-------|------|
| Name | opted_in_at |
| Type | DateTimeField |
| Null | True |

### opted_out_at Field (Task 15)
| Field | Type |
|-------|------|
| Name | opted_out_at |
| Type | DateTimeField |
| Null | True |
| Use | Track when opted out |
