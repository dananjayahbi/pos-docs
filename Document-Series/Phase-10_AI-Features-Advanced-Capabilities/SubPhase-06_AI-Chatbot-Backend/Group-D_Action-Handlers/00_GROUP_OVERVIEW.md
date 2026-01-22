# Group D: Action Handlers

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** D of F  
> **Tasks Covered:** 51-68  
> **Group Goal:** Implement intent-specific action handlers

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Entity-Extraction](../Group-C_Entity-Extraction/)
- **→ Next Group:** [Group-E_LLM-Integration](../Group-E_LLM-Integration/)

---

## Group Overview

This group implements action handlers. Creates ActionHandler abstract base class with handle abstract method. Creates ActionResponse dataclass with message, data, and follow_up fields. Creates OrderStatusHandler with get_order_status and format_order_response methods. Creates ProductInfoHandler with get_product_info. Creates ReturnHandler with get_return_policy and initiate_return. Creates ShippingHandler. Creates StoreInfoHandler. Creates EscalationHandler with notify_agent. Creates ActionRegistry with get_handler method. Verifies handlers.

### Key Outcomes

- ActionHandler ABC
- handle Abstract
- ActionResponse
- OrderStatusHandler
- get_order_status
- format_order_response
- ProductInfoHandler
- get_product_info
- ReturnHandler
- get_return_policy
- initiate_return
- ShippingHandler
- StoreInfoHandler
- EscalationHandler
- notify_agent
- ActionRegistry
- get_handler Method
- Handlers verified

### Technology Context

- **Pattern:** Strategy pattern
- **Registry:** Handler lookup
- **Response:** Structured response
- **Escalation:** Human handoff

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-60_Base-Order-Product-Return.md` | Create base, order, product, return | 51-60 |
| 02 | `02_Tasks-61-68_Shipping-Store-Escalation-Registry.md` | Create shipping, store, escalation, registry | 61-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create ActionHandler ABC | Medium | Task 50 |
| 52 | Create handle Abstract | Low | Task 51 |
| 53 | Create ActionResponse | Low | Task 52 |
| 54 | Create OrderStatusHandler | High | Task 53 |
| 55 | Create get_order_status | Medium | Task 54 |
| 56 | Create format_order_response | Low | Task 55 |
| 57 | Create ProductInfoHandler | Medium | Task 53 |
| 58 | Create get_product_info | Medium | Task 57 |
| 59 | Create ReturnHandler | Medium | Task 53 |
| 60 | Create get_return_policy | Low | Task 59 |
| 61 | Create initiate_return | Medium | Task 60 |
| 62 | Create ShippingHandler | Medium | Task 53 |
| 63 | Create StoreInfoHandler | Low | Task 53 |
| 64 | Create EscalationHandler | Medium | Task 53 |
| 65 | Create notify_agent | Medium | Task 64 |
| 66 | Create ActionRegistry | Medium | Task 65 |
| 67 | Create get_handler Method | Low | Task 66 |
| 68 | Verify Handlers | Low | Task 67 |

---

## Execution Order

```
Task 51: ActionHandler ABC
    │
    ▼
Task 52: handle Abstract
    │
    ▼
Task 53: ActionResponse
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼
T-54     T-57     T-59     T-62     T-63     T-64
(Order)(Product)(Return)(Ship) (Store)(Escalate)
    │        │        │        │        │        │
    ▼        ▼        ▼        │        │        ▼
T-55     T-58     T-60       │        │     T-65
(Get)   (Get)   (Policy)     │        │   (Notify)
    │        │        │        │        │        │
    ▼        │        ▼        │        │        │
T-56       │     T-61       │        │        │
(Format)   │  (Initiate)    │        │        │
    │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┘
                          │
                          ▼
                   Task 66: ActionRegistry
                          │
                          ▼
                   Task 67: get_handler
                          │
                          ▼
                   Task 68: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── chatbot/
        └── handlers/
            ├── __init__.py
            ├── base.py
            ├── order_status.py
            ├── product_info.py
            ├── returns.py
            ├── shipping.py
            ├── store_info.py
            ├── escalation.py
            └── registry.py
```

---

## Notes for AI Agents

### ActionHandler ABC (Task 51)
| Class | ActionHandler(ABC) |
|-------|-------------------|
| Purpose | Base handler class |

### handle Abstract (Task 52)
| Method | handle(intent, entities, context) |
|--------|----------------------------------|
| Return | ActionResponse |
| Abstract | Yes |

### ActionResponse (Task 53)
| Class | ActionResponse |
|-------|----------------|
| Type | dataclass |

### ActionResponse Fields
| Field | Type | Description |
|-------|------|-------------|
| message | str | Response text |
| data | Dict | Additional data |
| follow_up | str | Next question |
| actions | List | UI actions |

### OrderStatusHandler (Task 54)
| Class | OrderStatusHandler(ActionHandler) |
|-------|----------------------------------|
| Intent | ORDER_STATUS |

### get_order_status (Task 55)
| Method | get_order_status(order_id, customer) |
|--------|-------------------------------------|
| Return | Order details |
| Auth | Customer ownership |

### Order Status Response
| Field | Value |
|-------|-------|
| order_id | #12345 |
| status | shipped |
| tracking | LK123456789 |
| eta | 2024-01-15 |

### format_order_response (Task 56)
| Method | format_order_response(order) |
|--------|------------------------------|
| Return | Human-readable text |

### Response Template
| Status | Message |
|--------|---------|
| pending | Order is being processed |
| shipped | Order is on the way, tracking: {tracking} |
| delivered | Order was delivered on {date} |

### ProductInfoHandler (Task 57)
| Class | ProductInfoHandler(ActionHandler) |
|-------|----------------------------------|
| Intent | PRODUCT_INFO |

### get_product_info (Task 58)
| Method | get_product_info(product_name) |
|--------|-------------------------------|
| Return | Product details |
| Match | Fuzzy match |

### Product Info Response
| Field | Value |
|-------|-------|
| name | Product Name |
| price | Rs. 1,500.00 |
| stock | In stock |
| description | Brief description |

### ReturnHandler (Task 59)
| Class | ReturnHandler(ActionHandler) |
|-------|------------------------------|
| Intent | RETURNS |

### get_return_policy (Task 60)
| Method | get_return_policy() |
|--------|---------------------|
| Return | Policy text |
| Source | Tenant config |

### Return Policy
| Rule | Value |
|------|-------|
| Window | 7 days |
| Condition | Unopened |
| Refund | Original payment |

### initiate_return (Task 61)
| Method | initiate_return(order_id, reason) |
|--------|----------------------------------|
| Return | Return request |
| Create | ReturnRequest object |

### ShippingHandler (Task 62)
| Class | ShippingHandler(ActionHandler) |
|-------|--------------------------------|
| Intent | SHIPPING |

### Shipping Info
| Field | Value |
|-------|-------|
| standard | 3-5 business days |
| express | 1-2 business days |
| free_threshold | Rs. 5,000 |

### StoreInfoHandler (Task 63)
| Class | StoreInfoHandler(ActionHandler) |
|-------|--------------------------------|
| Intent | STORE_INFO |

### Store Info
| Field | Source |
|-------|--------|
| name | Tenant.name |
| hours | Tenant.business_hours |
| phone | Tenant.phone |
| email | Tenant.email |
| address | Tenant.address |

### EscalationHandler (Task 64)
| Class | EscalationHandler(ActionHandler) |
|-------|--------------------------------|
| Intent | ESCALATE |

### notify_agent (Task 65)
| Method | notify_agent(conversation) |
|--------|---------------------------|
| Action | Create support ticket |
| Notify | Via email/SMS |

### Escalation Flow
| Step | Action |
|------|--------|
| 1 | Set status = ESCALATED |
| 2 | Create support ticket |
| 3 | Notify available agent |
| 4 | Respond to customer |

### ActionRegistry (Task 66)
| Class | ActionRegistry |
|-------|----------------|
| Pattern | Registry pattern |

### get_handler Method (Task 67)
| Method | get_handler(intent_name) |
|--------|-------------------------|
| Return | ActionHandler instance |
| Error | UnknownIntentError |

### Registry Mapping
| Intent | Handler |
|--------|---------|
| ORDER_STATUS | OrderStatusHandler |
| PRODUCT_INFO | ProductInfoHandler |
| RETURNS | ReturnHandler |
| SHIPPING | ShippingHandler |
| STORE_INFO | StoreInfoHandler |
| ESCALATE | EscalationHandler |
| GREETING | GreetingHandler |
| FAREWELL | FarewellHandler |
