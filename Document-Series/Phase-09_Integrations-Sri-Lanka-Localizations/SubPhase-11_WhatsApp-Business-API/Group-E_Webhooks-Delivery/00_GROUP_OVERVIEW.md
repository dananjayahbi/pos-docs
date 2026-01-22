# Group E: Webhooks & Delivery

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Handle webhooks for message delivery status and logging

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Notification-Service](../Group-D_Notification-Service/)
- **→ Next Group:** [Group-F_Frontend-Testing](../Group-F_Frontend-Testing/)

---

## Group Overview

This group implements webhooks and delivery tracking. Creates webhook endpoint at POST /api/webhooks/whatsapp/. Creates GET webhook verification for Meta challenge. Creates X-Hub-Signature-256 validation. Creates message status handler for sent/delivered/read events. Creates MessageLog model with message_id, status, delivered_at, read_at, and failed_reason fields. Creates status update handler to update message log. Creates failure alert for notification on failures. Creates webhook queue for async processing. Verifies webhook flow.

### Key Outcomes

- Webhook endpoint
- Webhook verification
- Signature validation
- Message status handler
- MessageLog model
- message_id field
- status field
- delivered_at field
- read_at field
- failed_reason field
- Status update handler
- Failure alert
- Webhook queue
- Webhook flow verified

### Technology Context

- **Webhook:** Meta callback
- **Signature:** X-Hub-Signature-256
- **Status:** sent → delivered → read
- **Queue:** Async processing

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-78_Webhook-MessageLog.md` | Create webhook and log model | 69-78 |
| 02 | `02_Tasks-79-82_Handler-Alert-Verify.md` | Create handlers and alerts | 79-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create Webhook Endpoint | Medium | Task 68 |
| 70 | Create Webhook Verification | Low | Task 69 |
| 71 | Create Signature Validation | Medium | Task 69 |
| 72 | Create Message Status Handler | Medium | Task 71 |
| 73 | Create MessageLog Model | Medium | Task 72 |
| 74 | Create message_id Field | Low | Task 73 |
| 75 | Create status Field | Low | Task 73 |
| 76 | Create delivered_at Field | Low | Task 73 |
| 77 | Create read_at Field | Low | Task 73 |
| 78 | Create failed_reason Field | Low | Task 73 |
| 79 | Create Status Update Handler | Medium | Task 78 |
| 80 | Create Failure Alert | Medium | Task 79 |
| 81 | Create Webhook Queue | Medium | Task 79 |
| 82 | Verify Webhook Flow | Low | Task 81 |

---

## Execution Order

```
Task 69: Webhook Endpoint
    │
    ├─────────┐
    ▼         ▼
T-70       T-71
(Verify)  (Sign)
    │         │
    │         ▼
    │      Task 72: Message Status Handler
    │         │
    │         ▼
    │      Task 73: MessageLog Model
    │         │
    │    ┌────┼────┬────────┬────────┬────────┐
    │    ▼    ▼    ▼        ▼        ▼        ▼
    │  T-74  T-75  T-76    T-77    T-78
    │ (MsgID)(Stat)(Deliv)(Read) (Fail)
    │    │    │    │        │        │
    │    └────┴────┴────────┴────────┘
    │                    │
    │                    ▼
    │             Task 79: Status Update Handler
    │                    │
    │               ┌────┴────┐
    │               ▼         ▼
    │            T-80      T-81
    │          (Alert)   (Queue)
    │               │         │
    └───────────────┴─────────┘
                        │
                        ▼
                  Task 82: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── notifications/
        ├── models/
        │   └── message_log.py
        └── webhooks/
            ├── whatsapp_webhook.py
            └── signature.py
```

---

## Notes for AI Agents

### Webhook Endpoint (Task 69)
| URL | POST /api/webhooks/whatsapp/ |
|-----|------------------------------|
| View | WhatsAppWebhookView |
| CSRF | Exempt |

### Webhook Verification (Task 70)
| Method | GET |
|--------|-----|
| Params | hub.mode, hub.verify_token, hub.challenge |
| Response | Return hub.challenge if valid |

### Signature Validation (Task 71)
| Header | X-Hub-Signature-256 |
|--------|---------------------|
| Algorithm | HMAC-SHA256 |
| Secret | App secret |

### Message Status Handler (Task 72)
| Status | Description |
|--------|-------------|
| sent | Message sent to server |
| delivered | Delivered to device |
| read | Message read by user |
| failed | Delivery failed |

### MessageLog Model (Task 73)
| Class | MessageLog |
|-------|------------|
| Purpose | Track message delivery |

### message_id Field (Task 74)
| Field | Type |
|-------|------|
| Name | message_id |
| Type | CharField(max_length=100) |
| Source | WhatsApp API response |

### status Field (Task 75)
| Field | Type |
|-------|------|
| Name | status |
| Choices | pending, sent, delivered, read, failed |

### Message Status Flow
| Flow | Order |
|------|-------|
| 1 | PENDING (created) |
| 2 | SENT (to Meta) |
| 3 | DELIVERED (to device) |
| 4 | READ (by user) |
| X | FAILED (error) |

### delivered_at Field (Task 76)
| Field | Type |
|-------|------|
| Name | delivered_at |
| Type | DateTimeField |
| Null | True |

### read_at Field (Task 77)
| Field | Type |
|-------|------|
| Name | read_at |
| Type | DateTimeField |
| Null | True |

### failed_reason Field (Task 78)
| Field | Type |
|-------|------|
| Name | failed_reason |
| Type | TextField |
| Null | True |
| Use | Error message from Meta |

### Status Update Handler (Task 79)
| Method | update_status(message_id, status, timestamp) |
|--------|----------------------------------------------|
| Action | Update MessageLog record |

### Failure Alert (Task 80)
| Trigger | status = failed |
|---------|-----------------|
| Alert | Email admin |
| Threshold | 10% failure rate |

### Webhook Queue (Task 81)
| Queue | webhook_events |
|-------|----------------|
| Process | Async |
| Retry | On failure |
