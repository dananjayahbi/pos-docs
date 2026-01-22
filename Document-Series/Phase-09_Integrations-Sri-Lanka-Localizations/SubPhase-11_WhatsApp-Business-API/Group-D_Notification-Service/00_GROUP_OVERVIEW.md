# Group D: Notification Service

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Create notification service for order lifecycle messages

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Template-Messages](../Group-C_Template-Messages/)
- **→ Next Group:** [Group-E_Webhooks-Delivery](../Group-E_Webhooks-Delivery/)

---

## Group Overview

This group implements the notification service. Creates WhatsAppService as main service with check_opt_in method to verify consent and get_language to get customer preferred language. Creates notification methods: send_order_confirmation, send_payment_success, send_payment_failed, send_shipped, send_out_for_delivery, send_delivered, and send_cod_reminder. Creates WhatsAppNotificationTask as Celery task. Creates notification queue management. Creates batch notifications and scheduled messages for delayed sending. Creates Django signals for automatic triggering. Verifies notification service.

### Key Outcomes

- WhatsAppService
- check_opt_in method
- get_language method
- send_order_confirmation
- send_payment_success
- send_payment_failed
- send_shipped
- send_out_for_delivery
- send_delivered
- send_cod_reminder
- WhatsAppNotificationTask
- Notification queue
- Batch notifications
- Scheduled messages
- Django signals
- Notification service verified

### Technology Context

- **Celery:** Async message sending
- **Signals:** Auto-trigger on events
- **Queue:** Message queue management
- **Batch:** Bulk message sending

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-62_Service-Methods.md` | Create service and methods | 53-62 |
| 02 | `02_Tasks-63-68_Celery-Signals-Verify.md` | Create Celery and signals | 63-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create WhatsAppService | High | Task 52 |
| 54 | Create check_opt_in Method | Low | Task 53 |
| 55 | Create get_language Method | Low | Task 53 |
| 56 | Create send_order_confirmation | Medium | Task 55 |
| 57 | Create send_payment_success | Medium | Task 55 |
| 58 | Create send_payment_failed | Medium | Task 55 |
| 59 | Create send_shipped | Medium | Task 55 |
| 60 | Create send_out_for_delivery | Medium | Task 55 |
| 61 | Create send_delivered | Medium | Task 55 |
| 62 | Create send_cod_reminder | Medium | Task 55 |
| 63 | Create WhatsAppNotificationTask | Medium | Task 62 |
| 64 | Create Notification Queue | Medium | Task 63 |
| 65 | Create Batch Notifications | Medium | Task 64 |
| 66 | Create Scheduled Messages | Medium | Task 64 |
| 67 | Create Notification Signals | Medium | Task 53 |
| 68 | Verify Notification Service | Low | Task 67 |

---

## Execution Order

```
Task 53: WhatsAppService
    │
    ├─────────────────────────────────────────────────────┐
    ▼                                                     ▼
Task 54: check_opt_in                             Task 67: Signals
    │                                                     │
    ▼                                                     │
Task 55: get_language                                     │
    │                                                     │
    ├─────────┬─────────┬─────────┬─────────┬─────────┬───┼───────┐
    ▼         ▼         ▼         ▼         ▼         ▼   │       ▼
T-56       T-57       T-58       T-59       T-60      T-61│      T-62
(Order)  (PayOK) (PayFail)   (Ship)    (OFD)   (Deliv)│    (COD)
    │         │         │         │         │         │   │       │
    └─────────┴─────────┴─────────┴─────────┴─────────┴───┼───────┘
                                                          │
                                                          ▼
                                           Task 63: WhatsAppNotificationTask
                                                          │
                                                          ▼
                                           Task 64: Notification Queue
                                                          │
                                                     ┌────┴────┐
                                                     ▼         ▼
                                                  T-65      T-66
                                                (Batch)  (Schedule)
                                                     │         │
                                                     └────┬────┘
                                                          │
                                                          └─────────┘
                                                                │
                                                                ▼
                                                          Task 68: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── notifications/
        ├── services/
        │   └── whatsapp_service.py
        ├── tasks/
        │   └── whatsapp_tasks.py
        └── signals/
            └── order_signals.py
```

---

## Notes for AI Agents

### WhatsAppService (Task 53)
| Class | WhatsAppService |
|-------|-----------------|
| Purpose | High-level notification service |
| Uses | WhatsAppClient |

### check_opt_in Method (Task 54)
| Method | check_opt_in(customer) |
|--------|------------------------|
| Return | Boolean |
| Check | WhatsAppOptIn exists and active |

### get_language Method (Task 55)
| Method | get_language(customer) |
|--------|------------------------|
| Return | en, si, or ta |
| Default | en |

### send_order_confirmation (Task 56)
| Method | send_order_confirmation(order) |
|--------|--------------------------------|
| Template | order_confirmation |
| Params | order_number, customer_name, total |

### send_payment_success (Task 57)
| Method | send_payment_success(payment) |
|--------|-------------------------------|
| Template | payment_success |
| Params | amount, payment_method |

### send_payment_failed (Task 58)
| Method | send_payment_failed(payment) |
|--------|------------------------------|
| Template | payment_failed |
| Params | reason, retry_url |

### send_shipped (Task 59)
| Method | send_shipped(order) |
|--------|---------------------|
| Template | order_shipped |
| Params | courier, tracking_number, tracking_url |

### send_out_for_delivery (Task 60)
| Method | send_out_for_delivery(order) |
|--------|------------------------------|
| Template | out_for_delivery |
| Params | estimated_time |

### send_delivered (Task 61)
| Method | send_delivered(order) |
|--------|----------------------|
| Template | order_delivered |
| Params | delivered_at |

### send_cod_reminder (Task 62)
| Method | send_cod_reminder(order) |
|--------|--------------------------|
| Template | cod_reminder |
| Params | amount, delivery_date |

### WhatsAppNotificationTask (Task 63)
| Task | whatsapp_notification_task |
|------|---------------------------|
| Type | Celery task |
| Queue | notifications |

### Notification Queue (Task 64)
| Queue | whatsapp_messages |
|-------|-------------------|
| Priority | High/Normal |
| Concurrency | 3 workers |

### Batch Notifications (Task 65)
| Feature | Bulk sending |
|---------|--------------|
| Limit | 100 per batch |
| Delay | 100ms between |

### Scheduled Messages (Task 66)
| Feature | Delayed sending |
|---------|-----------------|
| Use | Send at specific time |
| ETA | Celery ETA |

### Notification Signals (Task 67)
| Signal | Trigger |
|--------|---------|
| post_save Order | Order confirmation |
| post_save Payment | Payment notification |
| post_save Shipment | Shipping notification |
