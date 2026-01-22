# Group D: Notification Service

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** D of F  
> **Tasks Covered:** 55-68  
> **Group Goal:** Create SMS notification service for order lifecycle messages

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_OTP-System](../Group-C_OTP-System/)
- **→ Next Group:** [Group-E_Delivery-Reports](../Group-E_Delivery-Reports/)

---

## Group Overview

This group implements SMS notifications. Creates SMSTemplate model with template_name identifier, template_text for message content, and language field for en/si/ta support. Creates order confirmation, shipped, delivered, and COD reminder SMS templates. Creates SMSNotificationService with send_order_sms and send_shipping_sms methods. Creates SMSSendTask as Celery task. Creates SMS queue management. Verifies SMS service.

### Key Outcomes

- SMSTemplate model
- template_name field
- template_text field
- language field
- Order confirmation SMS
- Shipped SMS
- Delivered SMS
- COD reminder SMS
- SMSNotificationService
- send_order_sms
- send_shipping_sms
- SMSSendTask
- SMS queue
- SMS service verified

### Technology Context

- **Templates:** Multi-language
- **Languages:** en, si, ta
- **Celery:** Async sending
- **Queue:** Message queuing

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-55-62_Template-Model-SMS.md` | Create template model and SMS | 55-62 |
| 02 | `02_Tasks-63-68_Service-Celery-Queue.md` | Create service, Celery, queue | 63-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 55 | Create SMSTemplate Model | Medium | Task 54 |
| 56 | Create template_name Field | Low | Task 55 |
| 57 | Create template_text Field | Low | Task 55 |
| 58 | Create language Field | Low | Task 55 |
| 59 | Create Order Confirm SMS | Medium | Task 58 |
| 60 | Create Shipped SMS | Medium | Task 58 |
| 61 | Create Delivered SMS | Medium | Task 58 |
| 62 | Create COD Reminder SMS | Medium | Task 58 |
| 63 | Create SMSNotificationService | High | Task 62 |
| 64 | Create send_order_sms | Medium | Task 63 |
| 65 | Create send_shipping_sms | Medium | Task 63 |
| 66 | Create SMSSendTask | Medium | Task 65 |
| 67 | Create SMS Queue | Medium | Task 66 |
| 68 | Verify SMS Service | Low | Task 67 |

---

## Execution Order

```
Task 55: SMSTemplate Model
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-56      T-57      T-58
(Name)   (Text)   (Lang)
    │        │        │
    └────────┴────────┘
              │
    ┌─────────┼─────────┬─────────┬─────────┐
    ▼         ▼         ▼         ▼         ▼
T-59       T-60       T-61       T-62
(Order)  (Shipped) (Deliver)   (COD)
    │         │         │         │
    └─────────┴─────────┴─────────┘
                   │
                   ▼
          Task 63: SMSNotificationService
                   │
              ┌────┴────┐
              ▼         ▼
          T-64       T-65
       (Order)   (Shipping)
              │         │
              └────┬────┘
                   │
                   ▼
          Task 66: SMSSendTask
                   │
                   ▼
          Task 67: SMS Queue
                   │
                   ▼
          Task 68: Verify SMS Service
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── notifications/
        ├── models/
        │   └── sms_template.py
        ├── services/
        │   └── sms_notification_service.py
        └── tasks/
            └── sms_tasks.py
```

---

## Notes for AI Agents

### SMSTemplate Model (Task 55)
| Class | SMSTemplate |
|-------|-------------|
| Purpose | Store SMS templates |
| Unique | name + language |

### template_name Field (Task 56)
| Field | Type |
|-------|------|
| Name | template_name |
| Type | CharField(max_length=50) |
| Examples | order_confirm, shipped |

### template_text Field (Task 57)
| Field | Type |
|-------|------|
| Name | template_text |
| Type | TextField |
| Placeholders | {order_number}, {amount} |

### language Field (Task 58)
| Field | Type |
|-------|------|
| Name | language |
| Choices | en, si, ta |
| Default | en |

### Order Confirm SMS (Task 59)
| Template | order_confirm |
|----------|---------------|
| EN | "Order {order_number} confirmed. Total: Rs.{amount}" |
| SI | "ඔබගේ ඇණවුම {order_number} තහවුරු කරන ලදී. මුළු: රු.{amount}" |
| TA | "உங்கள் ஆர்டர் {order_number} உறுதிப்படுத்தப்பட்டது. மொத்தம்: ரூ.{amount}" |

### Shipped SMS (Task 60)
| Template | order_shipped |
|----------|---------------|
| EN | "Order {order_number} shipped via {courier}. Track: {tracking_url}" |

### Delivered SMS (Task 61)
| Template | order_delivered |
|----------|-----------------|
| EN | "Order {order_number} delivered. Thank you!" |

### COD Reminder SMS (Task 62)
| Template | cod_reminder |
|----------|--------------|
| EN | "Please prepare Rs.{amount} for COD delivery of order {order_number}" |

### SMSNotificationService (Task 63)
| Class | SMSNotificationService |
|-------|------------------------|
| Purpose | High-level SMS service |
| Uses | SMSProviderFactory |

### send_order_sms (Task 64)
| Method | send_order_sms(order) |
|--------|----------------------|
| Action | Send order confirmation |
| Template | order_confirm |

### send_shipping_sms (Task 65)
| Method | send_shipping_sms(order) |
|--------|-------------------------|
| Action | Send shipping update |
| Templates | order_shipped, order_delivered |

### SMSSendTask (Task 66)
| Task | sms_send_task |
|------|---------------|
| Type | Celery task |
| Queue | sms |

### SMS Queue (Task 67)
| Queue | sms_messages |
|-------|--------------|
| Priority | Normal |
| Concurrency | 3 workers |
