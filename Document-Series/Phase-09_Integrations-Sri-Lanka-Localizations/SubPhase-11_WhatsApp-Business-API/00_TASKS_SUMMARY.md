# SubPhase 11: WhatsApp Business API - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 11 of 12  
> **SubPhase Goal:** Integrate WhatsApp Business API for customer notifications and order updates  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 13-15 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-10_Waybill-Generation](../SubPhase-10_Waybill-Generation/)
- **→ Next SubPhase:** [SubPhase-12_SMS-Gateway-Integration](../SubPhase-12_SMS-Gateway-Integration/)

---

## SubPhase Overview

This sub-phase integrates the WhatsApp Business API for automated customer notifications, order updates, shipping alerts, and two-way communication support.

### Key Outcomes
- WhatsApp Cloud API integration
- Order confirmation messages
- Shipping status updates
- Delivery notifications
- Template message management
- Interactive message support
- Opt-in/opt-out management

### Message Types
- **Template Messages** - Pre-approved messages
- **Session Messages** - Free-form replies
- **Interactive** - Buttons and lists
- **Media Messages** - Images, documents

### Technology Context
- **API:** Meta WhatsApp Cloud API
- **Webhooks:** Message delivery status
- **Queue:** Celery for async sending
- **Templates:** Language-specific (Sinhala, Tamil, English)

---

## Task Execution Order

```
TASK GROUP A: WhatsApp Configuration (Tasks 01-16)
        │
        ▼
TASK GROUP B: API Client & Auth (Tasks 17-32)
        │
        ▼
TASK GROUP C: Template Messages (Tasks 33-52)
        │
        ▼
TASK GROUP D: Notification Service (Tasks 53-68)
        │
        ▼
TASK GROUP E: Webhooks & Delivery (Tasks 69-82)
        │
        ▼
TASK GROUP F: Frontend & Testing (Tasks 83-92)
```

---

## Task Index

### Group A: WhatsApp Configuration (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create WhatsApp Constants** | API URLs and versions | SubPhase-10 | 🔴 Not Created |
| 02 | **Create WhatsApp Settings** | Django settings | Task 01 | 🔴 Not Created |
| 03 | **Create WHATSAPP_ACCESS_TOKEN** | Access token setting | Task 02 | 🔴 Not Created |
| 04 | **Create WHATSAPP_PHONE_ID** | Phone number ID | Task 02 | 🔴 Not Created |
| 05 | **Create WHATSAPP_BUSINESS_ID** | Business account ID | Task 02 | 🔴 Not Created |
| 06 | **Create WHATSAPP_VERIFY_TOKEN** | Webhook verify token | Task 02 | 🔴 Not Created |
| 07 | **Create WhatsAppConfig Model** | Tenant configuration | Task 02 | 🔴 Not Created |
| 08 | **Create phone_number_id Field** | Tenant phone ID | Task 07 | 🔴 Not Created |
| 09 | **Create access_token Field** | Encrypted token | Task 07 | 🔴 Not Created |
| 10 | **Create is_enabled Field** | Enable/disable | Task 07 | 🔴 Not Created |
| 11 | **Create daily_limit Field** | Message limit | Task 07 | 🔴 Not Created |
| 12 | **Create WhatsAppOptIn Model** | Customer opt-in | Task 07 | 🔴 Not Created |
| 13 | **Create customer FK** | Link to customer | Task 12 | 🔴 Not Created |
| 14 | **Create opted_in_at Field** | Opt-in timestamp | Task 12 | 🔴 Not Created |
| 15 | **Create opted_out_at Field** | Opt-out timestamp | Task 12 | 🔴 Not Created |
| 16 | **Create WhatsApp Migrations** | Generate migrations | Task 15 | 🔴 Not Created |

---

### Group B: API Client & Auth (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create WhatsAppClient Class** | Main API client | Task 16 | 🔴 Not Created |
| 18 | **Create Authentication** | Bearer token auth | Task 17 | 🔴 Not Created |
| 19 | **Create Request Handler** | Generic API requests | Task 18 | 🔴 Not Created |
| 20 | **Create Error Handling** | Handle API errors | Task 19 | 🔴 Not Created |
| 21 | **Create Rate Limiter** | Respect API limits | Task 20 | 🔴 Not Created |
| 22 | **Create Retry Logic** | Exponential backoff | Task 21 | 🔴 Not Created |
| 23 | **Create send_message Method** | Core send method | Task 22 | 🔴 Not Created |
| 24 | **Create send_template Method** | Send template msg | Task 23 | 🔴 Not Created |
| 25 | **Create send_text Method** | Send text message | Task 23 | 🔴 Not Created |
| 26 | **Create send_image Method** | Send image message | Task 23 | 🔴 Not Created |
| 27 | **Create send_document Method** | Send document | Task 23 | 🔴 Not Created |
| 28 | **Create send_interactive Method** | Buttons/lists | Task 23 | 🔴 Not Created |
| 29 | **Create Phone Validation** | Validate +94 format | Task 17 | 🔴 Not Created |
| 30 | **Create Phone Formatting** | Format to WhatsApp | Task 29 | 🔴 Not Created |
| 31 | **Create Message Logging** | Log all messages | Task 23 | 🔴 Not Created |
| 32 | **Verify API Client** | Test API connection | Task 31 | 🔴 Not Created |

---

### Group C: Template Messages (Tasks 33-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create MessageTemplate Model** | Store templates | Task 32 | 🔴 Not Created |
| 34 | **Create template_name Field** | Template identifier | Task 33 | 🔴 Not Created |
| 35 | **Create language Field** | en/si/ta | Task 33 | 🔴 Not Created |
| 36 | **Create template_type Field** | Notification type | Task 33 | 🔴 Not Created |
| 37 | **Create header_params Field** | Header placeholders | Task 33 | 🔴 Not Created |
| 38 | **Create body_params Field** | Body placeholders | Task 33 | 🔴 Not Created |
| 39 | **Create Order Confirm Template** | Order confirmation | Task 38 | 🔴 Not Created |
| 40 | **Create Payment Success Template** | Payment received | Task 38 | 🔴 Not Created |
| 41 | **Create Payment Failed Template** | Payment failed | Task 38 | 🔴 Not Created |
| 42 | **Create Shipped Template** | Order shipped | Task 38 | 🔴 Not Created |
| 43 | **Create Out for Delivery Template** | On delivery | Task 38 | 🔴 Not Created |
| 44 | **Create Delivered Template** | Order delivered | Task 38 | 🔴 Not Created |
| 45 | **Create COD Reminder Template** | COD collection | Task 38 | 🔴 Not Created |
| 46 | **Create Sinhala Templates** | si language | Task 44 | 🔴 Not Created |
| 47 | **Create Tamil Templates** | ta language | Task 44 | 🔴 Not Created |
| 48 | **Create Template Builder** | Build template payload | Task 38 | 🔴 Not Created |
| 49 | **Create Param Substitution** | Replace placeholders | Task 48 | 🔴 Not Created |
| 50 | **Create Template Validator** | Validate params | Task 49 | 🔴 Not Created |
| 51 | **Create Template Admin** | Admin for templates | Task 33 | 🔴 Not Created |
| 52 | **Verify Templates** | Test template sending | Task 51 | 🔴 Not Created |

---

### Group D: Notification Service (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create WhatsAppService** | Main notification service | Task 52 | 🔴 Not Created |
| 54 | **Create check_opt_in Method** | Verify opt-in status | Task 53 | 🔴 Not Created |
| 55 | **Create get_language Method** | Get customer language | Task 53 | 🔴 Not Created |
| 56 | **Create send_order_confirmation** | Order confirm | Task 55 | 🔴 Not Created |
| 57 | **Create send_payment_success** | Payment success | Task 55 | 🔴 Not Created |
| 58 | **Create send_payment_failed** | Payment failed | Task 55 | 🔴 Not Created |
| 59 | **Create send_shipped** | Shipped notification | Task 55 | 🔴 Not Created |
| 60 | **Create send_out_for_delivery** | Out for delivery | Task 55 | 🔴 Not Created |
| 61 | **Create send_delivered** | Delivered notification | Task 55 | 🔴 Not Created |
| 62 | **Create send_cod_reminder** | COD reminder | Task 55 | 🔴 Not Created |
| 63 | **Create WhatsAppNotificationTask** | Celery task | Task 62 | 🔴 Not Created |
| 64 | **Create Notification Queue** | Queue management | Task 63 | 🔴 Not Created |
| 65 | **Create Batch Notifications** | Bulk sending | Task 64 | 🔴 Not Created |
| 66 | **Create Scheduled Messages** | Delayed send | Task 64 | 🔴 Not Created |
| 67 | **Create Notification Signals** | Django signals | Task 53 | 🔴 Not Created |
| 68 | **Verify Notification Service** | Test notifications | Task 67 | 🔴 Not Created |

---

### Group E: Webhooks & Delivery (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Webhook Endpoint** | POST /api/webhooks/whatsapp/ | Task 68 | 🔴 Not Created |
| 70 | **Create Webhook Verification** | GET verify challenge | Task 69 | 🔴 Not Created |
| 71 | **Create Signature Validation** | Validate X-Hub-Signature | Task 69 | 🔴 Not Created |
| 72 | **Create Message Status Handler** | sent/delivered/read | Task 71 | 🔴 Not Created |
| 73 | **Create MessageLog Model** | Log all messages | Task 72 | 🔴 Not Created |
| 74 | **Create message_id Field** | WhatsApp message ID | Task 73 | 🔴 Not Created |
| 75 | **Create status Field** | Message status | Task 73 | 🔴 Not Created |
| 76 | **Create delivered_at Field** | Delivery timestamp | Task 73 | 🔴 Not Created |
| 77 | **Create read_at Field** | Read timestamp | Task 73 | 🔴 Not Created |
| 78 | **Create failed_reason Field** | Failure reason | Task 73 | 🔴 Not Created |
| 79 | **Create Status Update Handler** | Update message log | Task 78 | 🔴 Not Created |
| 80 | **Create Failure Alert** | Alert on failures | Task 79 | 🔴 Not Created |
| 81 | **Create Webhook Queue** | Async processing | Task 79 | 🔴 Not Created |
| 82 | **Verify Webhook Flow** | Test webhook events | Task 81 | 🔴 Not Created |

---

### Group F: Frontend & Testing (Tasks 83-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create WhatsApp Types** | TypeScript interfaces | Task 82 | 🔴 Not Created |
| 84 | **Create WhatsApp API Client** | Frontend API client | Task 83 | 🔴 Not Created |
| 85 | **Create Opt-In Checkbox** | Checkout opt-in | Task 84 | 🔴 Not Created |
| 86 | **Create Opt-In Settings** | Customer settings | Task 84 | 🔴 Not Created |
| 87 | **Create Message History UI** | View sent messages | Task 84 | 🔴 Not Created |
| 88 | **Create Template Manager UI** | Admin template CRUD | Task 84 | 🔴 Not Created |
| 89 | **Create WhatsApp Config UI** | Admin configuration | Task 84 | 🔴 Not Created |
| 90 | **Create Delivery Report UI** | Message analytics | Task 84 | 🔴 Not Created |
| 91 | **Create Integration Tests** | E2E WhatsApp tests | Task 90 | 🔴 Not Created |
| 92 | **Create Documentation** | WhatsApp integration docs | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── notifications/
        ├── models/
        │   ├── whatsapp_config.py            # WhatsAppConfig (Task 07)
        │   ├── whatsapp_optin.py             # WhatsAppOptIn (Task 12)
        │   ├── message_template.py           # MessageTemplate (Task 33)
        │   └── message_log.py                # MessageLog (Task 73)
        ├── clients/
        │   └── whatsapp_client.py            # WhatsAppClient (Task 17)
        ├── services/
        │   ├── whatsapp_service.py           # WhatsAppService (Task 53)
        │   └── template_builder.py           # Template builder (Task 48)
        ├── tasks/
        │   └── whatsapp_tasks.py             # Celery tasks (Task 63)
        ├── webhooks/
        │   ├── whatsapp_webhook.py           # Webhook handler (Task 69)
        │   └── signature.py                  # Signature validation (Task 71)
        ├── signals/
        │   └── order_signals.py              # Django signals (Task 67)
        └── api/
            └── whatsapp_views.py             # API views

frontend/
└── lib/
    └── notifications/
        └── whatsapp/
            ├── types.ts                      # Types (Task 83)
            └── client.ts                     # API client (Task 84)
└── components/
    ├── checkout/
    │   └── WhatsAppOptIn.tsx                 # Opt-in checkbox (Task 85)
    ├── account/
    │   └── NotificationSettings.tsx          # Settings (Task 86)
    └── admin/
        ├── WhatsAppConfig.tsx                # Config UI (Task 89)
        ├── TemplateManager.tsx               # Templates (Task 88)
        └── MessageHistory.tsx                # History (Task 87)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | WhatsApp Configuration | 16 | 0 | 0% |
| B | API Client & Auth | 16 | 0 | 0% |
| C | Template Messages | 20 | 0 | 0% |
| D | Notification Service | 16 | 0 | 0% |
| E | Webhooks & Delivery | 14 | 0 | 0% |
| F | Frontend & Testing | 10 | 0 | 0% |
| **Total** | | **92** | **0** | **0%** |

---

## Message Templates Reference

| Template | Event | Languages |
|----------|-------|-----------|
| order_confirmation | Order placed | en, si, ta |
| payment_success | Payment received | en, si, ta |
| payment_failed | Payment failed | en, si, ta |
| order_shipped | Shipped | en, si, ta |
| out_for_delivery | On delivery | en, si, ta |
| order_delivered | Delivered | en, si, ta |
| cod_reminder | COD due | en, si, ta |

---

## WhatsApp Message Status Flow

```
PENDING → SENT → DELIVERED → READ
                    ↓
                  FAILED
```

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Meta Cloud API** - Use official WhatsApp Cloud API
3. **Template approval** - Templates must be pre-approved by Meta
4. **Opt-in required** - Never message without opt-in
5. **Rate limits** - Respect messaging tier limits
6. **Multi-language** - Support en, si (Sinhala), ta (Tamil)
7. **Webhook security** - Validate X-Hub-Signature-256
8. **Message logging** - Log all sent/received messages
9. **Celery queue** - Use for async message sending
10. **Phone format** - Convert +94 to 94 for WhatsApp
