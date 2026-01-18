# SubPhase 12: SMS Gateway Integration - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 12 of 12  
> **SubPhase Goal:** Integrate SMS gateways for customer notifications and OTP verification  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 11-13 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-11_WhatsApp-Business-API](../SubPhase-11_WhatsApp-Business-API/)
- **→ Next Phase:** [Phase-10_AI-Features-Advanced-Capabilities](../../Phase-10_AI-Features-Advanced-Capabilities/)

---

## SubPhase Overview

This sub-phase integrates Sri Lanka SMS gateway providers (Dialog, Notify.lk, TextIt) for customer notifications, OTP verification, and order updates as a fallback to WhatsApp.

### Key Outcomes
- Multi-provider SMS gateway
- OTP verification system
- Order notifications via SMS
- Delivery status alerts
- SMS templates management
- Provider failover logic
- SMS usage analytics

### SMS Providers Supported
- **Dialog Enterprise SMS** - Largest carrier
- **Notify.lk** - Aggregator service
- **TextIt.lk** - Alternative provider
- **Mobitel** - Second carrier (optional)

### Technology Context
- **Interface:** SMSProvider ABC
- **Factory:** SMSProviderFactory
- **Queue:** Celery for async sending
- **Fallback:** Auto-switch on provider failure

---

## Task Execution Order

```
TASK GROUP A: SMS Configuration (Tasks 01-16)
        │
        ▼
TASK GROUP B: Provider Implementations (Tasks 17-38)
        │
        ▼
TASK GROUP C: OTP System (Tasks 39-54)
        │
        ▼
TASK GROUP D: Notification Service (Tasks 55-68)
        │
        ▼
TASK GROUP E: Delivery Reports (Tasks 69-78)
        │
        ▼
TASK GROUP F: Frontend & Testing (Tasks 79-86)
```

---

## Task Index

### Group A: SMS Configuration (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create SMS Constants** | API URLs and codes | SubPhase-11 | 🔴 Not Created |
| 02 | **Create SMS Settings** | Django settings | Task 01 | 🔴 Not Created |
| 03 | **Create DEFAULT_SMS_PROVIDER** | Default provider | Task 02 | 🔴 Not Created |
| 04 | **Create SMS_SENDER_ID** | Sender ID setting | Task 02 | 🔴 Not Created |
| 05 | **Create SMSConfig Model** | Tenant SMS config | Task 02 | 🔴 Not Created |
| 06 | **Create provider Field** | Selected provider | Task 05 | 🔴 Not Created |
| 07 | **Create api_key Field** | Encrypted API key | Task 05 | 🔴 Not Created |
| 08 | **Create sender_id Field** | Tenant sender ID | Task 05 | 🔴 Not Created |
| 09 | **Create is_enabled Field** | Enable/disable | Task 05 | 🔴 Not Created |
| 10 | **Create monthly_limit Field** | SMS limit | Task 05 | 🔴 Not Created |
| 11 | **Create SMSProvider ABC** | Abstract provider | Task 05 | 🔴 Not Created |
| 12 | **Create send Abstract** | Send method | Task 11 | 🔴 Not Created |
| 13 | **Create check_balance Abstract** | Balance check | Task 11 | 🔴 Not Created |
| 14 | **Create get_status Abstract** | Delivery status | Task 11 | 🔴 Not Created |
| 15 | **Create SMSProviderFactory** | Factory class | Task 14 | 🔴 Not Created |
| 16 | **Create SMS Migrations** | Generate migrations | Task 15 | 🔴 Not Created |

---

### Group B: Provider Implementations (Tasks 17-38)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create DialogSMSClient** | Dialog HTTP client | Task 16 | 🔴 Not Created |
| 18 | **Create Dialog Auth** | Dialog authentication | Task 17 | 🔴 Not Created |
| 19 | **Create Dialog Send** | Send via Dialog | Task 18 | 🔴 Not Created |
| 20 | **Create Dialog Balance** | Check Dialog credits | Task 18 | 🔴 Not Created |
| 21 | **Create Dialog Status** | Get delivery status | Task 18 | 🔴 Not Created |
| 22 | **Create DialogProvider** | Implement ABC | Task 21 | 🔴 Not Created |
| 23 | **Create NotifyLkClient** | Notify.lk client | Task 16 | 🔴 Not Created |
| 24 | **Create NotifyLk Auth** | Notify authentication | Task 23 | 🔴 Not Created |
| 25 | **Create NotifyLk Send** | Send via Notify | Task 24 | 🔴 Not Created |
| 26 | **Create NotifyLk Balance** | Check credits | Task 24 | 🔴 Not Created |
| 27 | **Create NotifyLk Status** | Get delivery status | Task 24 | 🔴 Not Created |
| 28 | **Create NotifyLkProvider** | Implement ABC | Task 27 | 🔴 Not Created |
| 29 | **Create TextItClient** | TextIt.lk client | Task 16 | 🔴 Not Created |
| 30 | **Create TextIt Auth** | TextIt authentication | Task 29 | 🔴 Not Created |
| 31 | **Create TextIt Send** | Send via TextIt | Task 30 | 🔴 Not Created |
| 32 | **Create TextIt Balance** | Check credits | Task 30 | 🔴 Not Created |
| 33 | **Create TextItProvider** | Implement ABC | Task 32 | 🔴 Not Created |
| 34 | **Register Dialog Provider** | Factory register | Task 22 | 🔴 Not Created |
| 35 | **Register NotifyLk Provider** | Factory register | Task 28 | 🔴 Not Created |
| 36 | **Register TextIt Provider** | Factory register | Task 33 | 🔴 Not Created |
| 37 | **Create Provider Fallback** | Auto-switch logic | Task 36 | 🔴 Not Created |
| 38 | **Verify Providers** | Test all providers | Task 37 | 🔴 Not Created |

---

### Group C: OTP System (Tasks 39-54)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 39 | **Create OTP Model** | OTP storage model | Task 38 | 🔴 Not Created |
| 40 | **Create phone Field** | Phone number | Task 39 | 🔴 Not Created |
| 41 | **Create otp_code Field** | 6-digit code | Task 39 | 🔴 Not Created |
| 42 | **Create purpose Field** | OTP purpose enum | Task 39 | 🔴 Not Created |
| 43 | **Create expires_at Field** | Expiry timestamp | Task 39 | 🔴 Not Created |
| 44 | **Create attempts Field** | Verification attempts | Task 39 | 🔴 Not Created |
| 45 | **Create is_verified Field** | Verified flag | Task 39 | 🔴 Not Created |
| 46 | **Create OTPService** | OTP service class | Task 45 | 🔴 Not Created |
| 47 | **Create generate_otp** | Generate 6-digit | Task 46 | 🔴 Not Created |
| 48 | **Create send_otp** | Send OTP SMS | Task 47 | 🔴 Not Created |
| 49 | **Create verify_otp** | Verify OTP code | Task 48 | 🔴 Not Created |
| 50 | **Create OTP Expiry** | 5-minute default | Task 49 | 🔴 Not Created |
| 51 | **Create Max Attempts** | 3 attempt limit | Task 50 | 🔴 Not Created |
| 52 | **Create Resend Cooldown** | 60-second cooldown | Task 51 | 🔴 Not Created |
| 53 | **Create OTP Cleanup** | Celery cleanup task | Task 52 | 🔴 Not Created |
| 54 | **Verify OTP System** | Test OTP flow | Task 53 | 🔴 Not Created |

---

### Group D: Notification Service (Tasks 55-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 55 | **Create SMSTemplate Model** | SMS templates | Task 54 | 🔴 Not Created |
| 56 | **Create template_name Field** | Template identifier | Task 55 | 🔴 Not Created |
| 57 | **Create template_text Field** | Message template | Task 55 | 🔴 Not Created |
| 58 | **Create language Field** | en/si/ta | Task 55 | 🔴 Not Created |
| 59 | **Create Order Confirm SMS** | Order confirmation | Task 58 | 🔴 Not Created |
| 60 | **Create Shipped SMS** | Order shipped | Task 58 | 🔴 Not Created |
| 61 | **Create Delivered SMS** | Order delivered | Task 58 | 🔴 Not Created |
| 62 | **Create COD Reminder SMS** | COD due | Task 58 | 🔴 Not Created |
| 63 | **Create SMSNotificationService** | Notification service | Task 62 | 🔴 Not Created |
| 64 | **Create send_order_sms** | Order notification | Task 63 | 🔴 Not Created |
| 65 | **Create send_shipping_sms** | Shipping update | Task 63 | 🔴 Not Created |
| 66 | **Create SMSSendTask** | Celery send task | Task 65 | 🔴 Not Created |
| 67 | **Create SMS Queue** | Queue management | Task 66 | 🔴 Not Created |
| 68 | **Verify SMS Service** | Test notifications | Task 67 | 🔴 Not Created |

---

### Group E: Delivery Reports (Tasks 69-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create SMSLog Model** | Log all SMS | Task 68 | 🔴 Not Created |
| 70 | **Create message_id Field** | Provider message ID | Task 69 | 🔴 Not Created |
| 71 | **Create recipient Field** | Phone number | Task 69 | 🔴 Not Created |
| 72 | **Create status Field** | Delivery status | Task 69 | 🔴 Not Created |
| 73 | **Create provider Field** | Provider used | Task 69 | 🔴 Not Created |
| 74 | **Create cost Field** | SMS cost | Task 69 | 🔴 Not Created |
| 75 | **Create Delivery Callback** | DLR webhook | Task 74 | 🔴 Not Created |
| 76 | **Create Status Update** | Update SMS log | Task 75 | 🔴 Not Created |
| 77 | **Create Usage Analytics** | SMS usage report | Task 76 | 🔴 Not Created |
| 78 | **Verify Delivery Reports** | Test DLR flow | Task 77 | 🔴 Not Created |

---

### Group F: Frontend & Testing (Tasks 79-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create SMS Types** | TypeScript interfaces | Task 78 | 🔴 Not Created |
| 80 | **Create SMS API Client** | Frontend API client | Task 79 | 🔴 Not Created |
| 81 | **Create OTP Input Component** | 6-digit input | Task 80 | 🔴 Not Created |
| 82 | **Create Phone Verification UI** | Verify phone flow | Task 81 | 🔴 Not Created |
| 83 | **Create SMS Config UI** | Admin configuration | Task 80 | 🔴 Not Created |
| 84 | **Create SMS Usage Dashboard** | Usage analytics | Task 80 | 🔴 Not Created |
| 85 | **Create Integration Tests** | E2E SMS tests | Task 84 | 🔴 Not Created |
| 86 | **Create Documentation** | SMS integration docs | Task 85 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── notifications/
        ├── models/
        │   ├── sms_config.py                 # SMSConfig (Task 05)
        │   ├── otp.py                        # OTP model (Task 39)
        │   ├── sms_template.py               # SMSTemplate (Task 55)
        │   └── sms_log.py                    # SMSLog (Task 69)
        ├── providers/
        │   ├── __init__.py
        │   ├── base.py                       # SMSProvider ABC (Task 11)
        │   ├── factory.py                    # SMSProviderFactory (Task 15)
        │   ├── dialog/
        │   │   ├── client.py                 # DialogSMSClient (Task 17)
        │   │   └── provider.py               # DialogProvider (Task 22)
        │   ├── notifylk/
        │   │   ├── client.py                 # NotifyLkClient (Task 23)
        │   │   └── provider.py               # NotifyLkProvider (Task 28)
        │   └── textit/
        │       ├── client.py                 # TextItClient (Task 29)
        │       └── provider.py               # TextItProvider (Task 33)
        ├── services/
        │   ├── otp_service.py                # OTPService (Task 46)
        │   └── sms_notification_service.py   # Notification (Task 63)
        ├── tasks/
        │   ├── sms_tasks.py                  # Celery tasks (Task 66)
        │   └── otp_cleanup_task.py           # OTP cleanup (Task 53)
        ├── webhooks/
        │   └── delivery_callback.py          # DLR webhook (Task 75)
        └── api/
            └── sms_views.py                  # API views

frontend/
└── lib/
    └── notifications/
        └── sms/
            ├── types.ts                      # Types (Task 79)
            └── client.ts                     # API client (Task 80)
└── components/
    ├── auth/
    │   ├── OTPInput.tsx                      # OTP input (Task 81)
    │   └── PhoneVerification.tsx             # Verify UI (Task 82)
    └── admin/
        ├── SMSConfig.tsx                     # Config UI (Task 83)
        └── SMSUsageDashboard.tsx             # Analytics (Task 84)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | SMS Configuration | 16 | 0 | 0% |
| B | Provider Implementations | 22 | 0 | 0% |
| C | OTP System | 16 | 0 | 0% |
| D | Notification Service | 14 | 0 | 0% |
| E | Delivery Reports | 10 | 0 | 0% |
| F | Frontend & Testing | 8 | 0 | 0% |
| **Total** | | **86** | **0** | **0%** |

---

## SMS Provider Comparison

| Provider | Coverage | Cost | DLR | API Type |
|----------|----------|------|-----|----------|
| Dialog | Island-wide | Low | Yes | HTTP/REST |
| Notify.lk | Island-wide | Medium | Yes | REST |
| TextIt.lk | Island-wide | Low | Yes | REST |
| Mobitel | Island-wide | Low | Limited | HTTP |

---

## OTP Flow

```
User Request → Generate 6-digit → Store with 5min expiry → Send SMS
                                                              ↓
                                                       User Enters OTP
                                                              ↓
                                                    Verify (max 3 attempts)
                                                              ↓
                                            Success → Mark verified, cleanup
                                                  OR
                                            Failure → Increment attempts → Block if max
```

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Provider pattern** - SMSProvider ABC with factory
3. **Multi-provider** - Dialog, Notify.lk, TextIt
4. **Fallback logic** - Auto-switch on failure
5. **OTP security** - 6-digit, 5min expiry, 3 attempts
6. **Phone format** - Sri Lanka +94 format
7. **DLR webhooks** - Delivery receipt callbacks
8. **Celery queue** - Async SMS sending
9. **Cost tracking** - Log SMS cost per message
10. **Rate limiting** - Prevent SMS abuse
