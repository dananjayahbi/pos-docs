# Group E: Delivery Reports

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** E of F  
> **Tasks Covered:** 69-78  
> **Group Goal:** Track SMS delivery status and usage analytics

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Notification-Service](../Group-D_Notification-Service/)
- **→ Next Group:** [Group-F_Frontend-Testing](../Group-F_Frontend-Testing/)

---

## Group Overview

This group implements delivery tracking. Creates SMSLog model with message_id from provider, recipient phone number, status for delivery state, provider used, and cost per message. Creates delivery callback (DLR) webhook endpoint. Creates status update handler to update SMSLog from webhook. Creates usage analytics for monthly reports. Verifies delivery report flow.

### Key Outcomes

- SMSLog model
- message_id field
- recipient field
- status field
- provider field
- cost field
- Delivery callback
- Status update handler
- Usage analytics
- Delivery reports verified

### Technology Context

- **DLR:** Delivery Report callback
- **Webhook:** Provider callbacks
- **Analytics:** Monthly usage
- **Cost:** Track per SMS cost

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-74_SMSLog-Model.md` | Create SMSLog model | 69-74 |
| 02 | `02_Tasks-75-78_Webhook-Analytics-Verify.md` | Create webhook and analytics | 75-78 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create SMSLog Model | Medium | Task 68 |
| 70 | Create message_id Field | Low | Task 69 |
| 71 | Create recipient Field | Low | Task 69 |
| 72 | Create status Field | Low | Task 69 |
| 73 | Create provider Field | Low | Task 69 |
| 74 | Create cost Field | Low | Task 69 |
| 75 | Create Delivery Callback | Medium | Task 74 |
| 76 | Create Status Update | Medium | Task 75 |
| 77 | Create Usage Analytics | Medium | Task 76 |
| 78 | Verify Delivery Reports | Low | Task 77 |

---

## Execution Order

```
Task 69: SMSLog Model
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-70      T-71      T-72      T-73     T-74
(MsgID) (Recip)  (Status)  (Prov)   (Cost)
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                        │
                        ▼
               Task 75: Delivery Callback
                        │
                        ▼
               Task 76: Status Update
                        │
                        ▼
               Task 77: Usage Analytics
                        │
                        ▼
               Task 78: Verify Delivery Reports
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── notifications/
        ├── models/
        │   └── sms_log.py
        ├── webhooks/
        │   └── delivery_callback.py
        └── services/
            └── sms_analytics.py
```

---

## Notes for AI Agents

### SMSLog Model (Task 69)
| Class | SMSLog |
|-------|--------|
| Purpose | Track all sent SMS |
| Indexes | message_id, recipient, status |

### message_id Field (Task 70)
| Field | Type |
|-------|------|
| Name | message_id |
| Type | CharField(max_length=100) |
| Source | Provider response |

### recipient Field (Task 71)
| Field | Type |
|-------|------|
| Name | recipient |
| Type | CharField(max_length=15) |
| Format | +94XXXXXXXXX |

### status Field (Task 72)
| Status | Description |
|--------|-------------|
| PENDING | Queued |
| SENT | Sent to provider |
| DELIVERED | Delivered to phone |
| FAILED | Delivery failed |

### provider Field (Task 73)
| Field | Type |
|-------|------|
| Name | provider |
| Choices | dialog, notifylk, textit |
| Use | Track which provider |

### cost Field (Task 74)
| Field | Type |
|-------|------|
| Name | cost |
| Type | DecimalField(max_digits=6, decimal_places=2) |
| Default | 0.00 |
| Unit | LKR |

### SMS Cost Reference
| Provider | Cost/SMS (LKR) |
|----------|----------------|
| Dialog | ~0.25 |
| Notify.lk | ~0.30 |
| TextIt | ~0.25 |

### Delivery Callback (Task 75)
| URL | POST /api/webhooks/sms/dlr/ |
|-----|------------------------------|
| View | SMSDeliveryCallbackView |
| CSRF | Exempt |

### DLR Payload Structure
| Field | Description |
|-------|-------------|
| message_id | Provider message ID |
| status | delivered/failed |
| timestamp | Delivery time |
| error_code | If failed |

### Status Update (Task 76)
| Method | update_sms_status(message_id, status) |
|--------|---------------------------------------|
| Action | Update SMSLog record |
| Fields | status, delivered_at |

### Usage Analytics (Task 77)
| Report | Content |
|--------|---------|
| Monthly | Total sent, delivered, failed |
| By provider | Count per provider |
| Cost | Total cost LKR |
| By type | OTP vs notification |

### Analytics Metrics
| Metric | Description |
|--------|-------------|
| total_sent | SMS sent count |
| delivered_count | Successfully delivered |
| failed_count | Failed delivery |
| delivery_rate | delivered / sent % |
| total_cost | Sum of cost field |
| avg_cost | total_cost / total_sent |
