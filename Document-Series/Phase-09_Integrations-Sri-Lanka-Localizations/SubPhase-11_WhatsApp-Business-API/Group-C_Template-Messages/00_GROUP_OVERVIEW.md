# Group C: Template Messages

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** C of F  
> **Tasks Covered:** 33-52  
> **Group Goal:** Create message template management with multi-language support

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_API-Client-Auth](../Group-B_API-Client-Auth/)
- **→ Next Group:** [Group-D_Notification-Service](../Group-D_Notification-Service/)

---

## Group Overview

This group implements template messages. Creates MessageTemplate model with template_name identifier, language field (en/si/ta), template_type for notification type, header_params and body_params for placeholder definitions. Creates order confirmation, payment success, payment failed, shipped, out for delivery, delivered, and COD reminder templates. Creates Sinhala and Tamil language versions. Creates template builder to construct API payload. Creates parameter substitution logic. Creates template validator. Creates admin interface. Verifies template sending.

### Key Outcomes

- MessageTemplate model
- template_name field
- language field
- template_type field
- header_params field
- body_params field
- Order confirmation template
- Payment success template
- Payment failed template
- Shipped template
- Out for delivery template
- Delivered template
- COD reminder template
- Sinhala templates
- Tamil templates
- Template builder
- Param substitution
- Template validator
- Template admin
- Templates verified

### Technology Context

- **Templates:** Pre-approved by Meta
- **Languages:** en, si, ta
- **Placeholders:** Dynamic params
- **Builder:** Construct API payload

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-44_Model-Templates.md` | Create model and templates | 33-44 |
| 02 | `02_Tasks-45-52_Multilang-Builder-Admin.md` | Create multilang and builder | 45-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create MessageTemplate Model | Medium | Task 32 |
| 34 | Create template_name Field | Low | Task 33 |
| 35 | Create language Field | Low | Task 33 |
| 36 | Create template_type Field | Low | Task 33 |
| 37 | Create header_params Field | Low | Task 33 |
| 38 | Create body_params Field | Low | Task 33 |
| 39 | Create Order Confirm Template | Medium | Task 38 |
| 40 | Create Payment Success Template | Medium | Task 38 |
| 41 | Create Payment Failed Template | Medium | Task 38 |
| 42 | Create Shipped Template | Medium | Task 38 |
| 43 | Create Out for Delivery Template | Medium | Task 38 |
| 44 | Create Delivered Template | Medium | Task 38 |
| 45 | Create COD Reminder Template | Medium | Task 38 |
| 46 | Create Sinhala Templates | High | Task 44 |
| 47 | Create Tamil Templates | High | Task 44 |
| 48 | Create Template Builder | Medium | Task 38 |
| 49 | Create Param Substitution | Medium | Task 48 |
| 50 | Create Template Validator | Medium | Task 49 |
| 51 | Create Template Admin | Medium | Task 33 |
| 52 | Verify Templates | Low | Task 51 |

---

## Execution Order

```
Task 33: MessageTemplate Model
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼
T-34     T-35     T-36     T-37     T-38      T-51
(Name)  (Lang)  (Type) (Head)  (Body)   (Admin)
    │        │        │        │        │        │
    └────────┴────────┴────────┴────────┘        │
                           │                     │
         ┌─────────┬───────┼───────┬───────┬───────┬───────┐
         ▼         ▼       ▼       ▼       ▼       ▼       ▼
      T-39      T-40    T-41    T-42    T-43    T-44    T-45
    (Order)  (PayOK)(PayFail)(Ship) (OFD)  (Deliv) (COD)
         │         │       │       │       │       │       │
         └─────────┴───────┴───────┴───────┴───────┴───────┘
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                           T-46        T-47
                         (Sinhala)   (Tamil)
                              │           │
                              └─────┬─────┘
                                    │
                                    ▼
                              Task 48: Template Builder
                                    │
                                    ▼
                              Task 49: Param Substitution
                                    │
                                    ▼
                              Task 50: Validator
                                    │
                                    └─────────┘
                                          │
                                          ▼
                                    Task 52: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── notifications/
        ├── models/
        │   └── message_template.py
        ├── services/
        │   └── template_builder.py
        └── admin.py
```

---

## Notes for AI Agents

### MessageTemplate Model (Task 33)
| Class | MessageTemplate |
|-------|-----------------|
| Purpose | Store template definitions |

### template_name Field (Task 34)
| Field | Type |
|-------|------|
| Name | template_name |
| Type | CharField(max_length=100) |
| Example | order_confirmation_en |

### language Field (Task 35)
| Field | Type |
|-------|------|
| Name | language |
| Choices | en, si, ta |
| Default | en |

### template_type Field (Task 36)
| Type | Description |
|------|-------------|
| ORDER_CONFIRMATION | Order placed |
| PAYMENT_SUCCESS | Payment received |
| PAYMENT_FAILED | Payment failed |
| SHIPPED | Order shipped |
| OUT_FOR_DELIVERY | On delivery |
| DELIVERED | Order delivered |
| COD_REMINDER | COD collection |

### header_params Field (Task 37)
| Field | Type |
|-------|------|
| Name | header_params |
| Type | JSONField |
| Example | ["order_number"] |

### body_params Field (Task 38)
| Field | Type |
|-------|------|
| Name | body_params |
| Type | JSONField |
| Example | ["customer_name", "total", "tracking_url"] |

### Order Confirm Template (Task 39)
| Template | order_confirmation |
|----------|-------------------|
| Header | Order #{order_number} |
| Body | Thank you {name}! Order total: {total} |

### Payment Success Template (Task 40)
| Template | payment_success |
|----------|-----------------|
| Header | Payment Received |
| Body | Payment of {amount} confirmed |

### Shipped Template (Task 42)
| Template | order_shipped |
|----------|---------------|
| Header | Order Shipped |
| Body | Track: {tracking_url} |

### Out for Delivery Template (Task 43)
| Template | out_for_delivery |
|----------|------------------|
| Header | Out for Delivery |
| Body | Your order is on the way! |

### Delivered Template (Task 44)
| Template | order_delivered |
|----------|-----------------|
| Header | Delivered |
| Body | Order delivered successfully |

### COD Reminder Template (Task 45)
| Template | cod_reminder |
|----------|--------------|
| Header | COD Reminder |
| Body | Please prepare {amount} for delivery |

### Sinhala Templates (Task 46)
| Language | si |
|----------|-----|
| Templates | All templates in Sinhala |

### Tamil Templates (Task 47)
| Language | ta |
|----------|-----|
| Templates | All templates in Tamil |

### Template Builder (Task 48)
| Class | TemplateBuilder |
|-------|-----------------|
| Purpose | Build API payload |

### Param Substitution (Task 49)
| Method | substitute(template, params) |
|--------|------------------------------|
| Replace | Placeholders with values |

### Template Validator (Task 50)
| Validate | Required params present |
|----------|-------------------------|
| Check | Param count matches |
