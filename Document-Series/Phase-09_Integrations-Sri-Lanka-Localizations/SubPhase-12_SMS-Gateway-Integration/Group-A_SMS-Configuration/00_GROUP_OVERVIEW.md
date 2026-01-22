# Group A: SMS Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up SMS gateway configuration, models, and provider abstraction

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-11_WhatsApp-Business-API](../../SubPhase-11_WhatsApp-Business-API/)
- **→ Next Group:** [Group-B_Provider-Implementations](../Group-B_Provider-Implementations/)

---

## Group Overview

This group sets up SMS configuration. Creates SMS constants for API URLs and status codes. Creates Django settings with DEFAULT_SMS_PROVIDER and SMS_SENDER_ID. Creates SMSConfig model for tenant configuration with provider selection, encrypted api_key, sender_id, is_enabled toggle, and monthly_limit fields. Creates SMSProvider abstract base class with send, check_balance, and get_status abstract methods. Creates SMSProviderFactory for instantiating provider by name. Generates migrations.

### Key Outcomes

- SMS constants
- SMS settings
- DEFAULT_SMS_PROVIDER setting
- SMS_SENDER_ID setting
- SMSConfig model
- provider field
- api_key field
- sender_id field
- is_enabled field
- monthly_limit field
- SMSProvider ABC
- send abstract method
- check_balance abstract method
- get_status abstract method
- SMSProviderFactory
- SMS migrations

### Technology Context

- **Providers:** Dialog, Notify.lk, TextIt
- **Pattern:** Abstract factory
- **Encryption:** Fernet for API keys
- **Multi-tenant:** Per-tenant config

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-10_Settings-Model.md` | Create settings and config model | 01-10 |
| 02 | `02_Tasks-11-16_ABC-Factory-Migration.md` | Create ABC, factory, migration | 11-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create SMS Constants | Low | SubPhase-11 |
| 02 | Create SMS Settings | Low | Task 01 |
| 03 | Create DEFAULT_SMS_PROVIDER | Low | Task 02 |
| 04 | Create SMS_SENDER_ID | Low | Task 02 |
| 05 | Create SMSConfig Model | Medium | Task 02 |
| 06 | Create provider Field | Low | Task 05 |
| 07 | Create api_key Field | Medium | Task 05 |
| 08 | Create sender_id Field | Low | Task 05 |
| 09 | Create is_enabled Field | Low | Task 05 |
| 10 | Create monthly_limit Field | Low | Task 05 |
| 11 | Create SMSProvider ABC | Medium | Task 05 |
| 12 | Create send Abstract | Low | Task 11 |
| 13 | Create check_balance Abstract | Low | Task 11 |
| 14 | Create get_status Abstract | Low | Task 11 |
| 15 | Create SMSProviderFactory | Medium | Task 14 |
| 16 | Create SMS Migrations | Low | Task 15 |

---

## Execution Order

```
Task 01: SMS Constants
    │
    ▼
Task 02: SMS Settings
    │
    ├─────────┬─────────┐
    ▼         ▼         ▼
T-03       T-04       T-05
(Default) (Sender) (SMSConfig)
    │         │         │
    │         │    ┌────┼────┬────────┬────────┬────────┐
    │         │    ▼    ▼    ▼        ▼        ▼        ▼
    │         │  T-06  T-07  T-08    T-09    T-10     T-11
    │         │ (Prov)(Key)(Send)  (Enab)  (Limit)  (ABC)
    │         │    │    │    │        │        │        │
    │         │    │    │    │        │        │   ┌────┼────┬────────┐
    │         │    │    │    │        │        │   ▼    ▼    ▼        ▼
    │         │    │    │    │        │        │ T-12  T-13  T-14
    │         │    │    │    │        │        │(Send)(Bal)(Status)
    │         │    │    │    │        │        │   │    │    │
    │         │    │    │    │        │        │   └────┴────┘
    │         │    │    │    │        │        │        │
    └─────────┴────┴────┴────┴────────┴────────┴────────┘
                                                 │
                                                 ▼
                                        Task 15: SMSProviderFactory
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
        ├── models/
        │   └── sms_config.py
        └── providers/
            ├── base.py
            └── factory.py
```

---

## Notes for AI Agents

### SMS Constants (Task 01)
| Constant | Description |
|----------|-------------|
| SMS_STATUS_PENDING | Message pending |
| SMS_STATUS_SENT | Sent to gateway |
| SMS_STATUS_DELIVERED | Delivered |
| SMS_STATUS_FAILED | Failed |

### SMS Settings (Task 02)
| File | settings/sms.py |
|------|-----------------|
| Purpose | SMS-specific settings |

### DEFAULT_SMS_PROVIDER (Task 03)
| Setting | DEFAULT_SMS_PROVIDER |
|---------|---------------------|
| Default | dialog |
| Options | dialog, notifylk, textit |

### SMS_SENDER_ID (Task 04)
| Setting | SMS_SENDER_ID |
|---------|---------------|
| Default | LCC |
| Max length | 11 characters |

### SMSConfig Model (Task 05)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| provider | CharField |
| api_key | EncryptedField |
| sender_id | CharField |
| is_enabled | BooleanField |
| monthly_limit | IntegerField |

### provider Field (Task 06)
| Field | Type |
|-------|------|
| Name | provider |
| Choices | dialog, notifylk, textit |
| Default | dialog |

### api_key Field (Task 07)
| Field | Type |
|-------|------|
| Name | api_key |
| Encryption | django-fernet-fields |
| Sensitive | Yes |

### sender_id Field (Task 08)
| Field | Type |
|-------|------|
| Name | sender_id |
| Max length | 11 |
| Use | Sender name/number |

### is_enabled Field (Task 09)
| Field | Type |
|-------|------|
| Name | is_enabled |
| Default | False |
| Use | Enable/disable per tenant |

### monthly_limit Field (Task 10)
| Field | Type |
|-------|------|
| Name | monthly_limit |
| Default | 1000 |
| Use | Limit SMS per month |

### SMSProvider ABC (Task 11)
| Class | SMSProvider |
|-------|-------------|
| Type | Abstract Base Class |
| Methods | send, check_balance, get_status |

### send Abstract (Task 12)
| Method | send(to, message) |
|--------|-------------------|
| Return | message_id |
| Abstract | Yes |

### check_balance Abstract (Task 13)
| Method | check_balance() |
|--------|-----------------|
| Return | float (credits) |
| Abstract | Yes |

### get_status Abstract (Task 14)
| Method | get_status(message_id) |
|--------|------------------------|
| Return | status string |
| Abstract | Yes |

### SMSProviderFactory (Task 15)
| Class | SMSProviderFactory |
|-------|-------------------|
| Method | get_provider(name) |
| Pattern | Factory pattern |
