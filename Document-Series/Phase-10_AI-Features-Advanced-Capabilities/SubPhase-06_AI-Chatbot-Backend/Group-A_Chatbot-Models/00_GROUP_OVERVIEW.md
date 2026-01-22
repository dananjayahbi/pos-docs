# Group A: Chatbot Models

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create conversation and message models for chatbot

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_Smart-Search-Sinhaglish](../../SubPhase-05_Smart-Search-Sinhaglish/)
- **→ Next Group:** [Group-B_Intent-Classification](../Group-B_Intent-Classification/)

---

## Group Overview

This group creates chatbot models. Creates Conversation model with session_id for unique session UUID, customer FK nullable for guests, status field with active/resolved/escalated choices, started_at and ended_at timestamps. Creates Message model with conversation FK, role field with user/assistant/system choices, content TextField, and timestamp. Creates Intent model with intent_name and training_phrases JSONField. Generates migrations. Verifies models.

### Key Outcomes

- Conversation model
- session_id field
- customer FK
- status field
- started_at field
- ended_at field
- Message model
- conversation FK
- role field
- content field
- timestamp field
- Intent model
- intent_name field
- training_phrases field
- Chatbot migrations
- Models verified

### Technology Context

- **Session:** UUID-based
- **Roles:** user, assistant, system
- **Status:** active, resolved, escalated
- **Intents:** Predefined + dynamic

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-11_Conversation-Message.md` | Create Conversation and Message | 01-11 |
| 02 | `02_Tasks-12-16_Intent-Migration.md` | Create Intent and migration | 12-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Conversation Model | Medium | SubPhase-05 |
| 02 | Create session_id Field | Low | Task 01 |
| 03 | Create customer FK | Low | Task 01 |
| 04 | Create status Field | Low | Task 01 |
| 05 | Create started_at Field | Low | Task 01 |
| 06 | Create ended_at Field | Low | Task 01 |
| 07 | Create Message Model | Medium | Task 01 |
| 08 | Create conversation FK | Low | Task 07 |
| 09 | Create role Field | Low | Task 07 |
| 10 | Create content Field | Low | Task 07 |
| 11 | Create timestamp Field | Low | Task 07 |
| 12 | Create Intent Model | Medium | Task 01 |
| 13 | Create intent_name Field | Low | Task 12 |
| 14 | Create training_phrases Field | Low | Task 12 |
| 15 | Create Chatbot Migrations | Low | Task 14 |
| 16 | Verify Models | Low | Task 15 |

---

## Execution Order

```
Task 01: Conversation Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-02      T-03      T-04      T-05     T-06     T-07    T-12
(Sess)  (Cust)  (Status)(Start) (End)  (Msg)  (Intent)
    │        │        │        │        │        │        │
    │        │        │        │        │   ┌────┼────┬───┼───┬────┐
    │        │        │        │        │   ▼    ▼    ▼   ▼   ▼    ▼
    │        │        │        │        │ T-08  T-09 T-10 T-11 T-13 T-14
    │        │        │        │        │(Conv)(Role)(Cont)(Time)(Name)(Phrase)
    │        │        │        │        │   │    │    │    │    │    │
    └────────┴────────┴────────┴────────┴───┴────┴────┴────┴────┴────┘
                                                          │
                                                          ▼
                                               Task 15: Migrations
                                                          │
                                                          ▼
                                               Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── chatbot/
        ├── __init__.py
        └── models/
            ├── __init__.py
            ├── conversation.py
            ├── message.py
            └── intent.py
```

---

## Notes for AI Agents

### Conversation Model (Task 01)
| Class | Conversation |
|-------|--------------|
| Purpose | Chat session container |

### session_id Field (Task 02)
| Field | Type |
|-------|------|
| Name | session_id |
| Type | UUIDField |
| Default | uuid4 |
| Unique | True |

### customer FK (Task 03)
| Field | Type |
|-------|------|
| Name | customer |
| FK | Customer |
| Null | True (guests) |
| On delete | SET_NULL |

### status Field (Task 04)
| Field | Type |
|-------|------|
| Name | status |
| Type | CharField(20) |
| Choices | active, resolved, escalated |
| Default | active |

### Status Choices
| Status | Description |
|--------|-------------|
| ACTIVE | Ongoing conversation |
| RESOLVED | Successfully closed |
| ESCALATED | Handed to human |

### started_at Field (Task 05)
| Field | Type |
|-------|------|
| Name | started_at |
| Type | DateTimeField |
| Auto | auto_now_add |

### ended_at Field (Task 06)
| Field | Type |
|-------|------|
| Name | ended_at |
| Type | DateTimeField |
| Null | True |

### Message Model (Task 07)
| Class | Message |
|-------|---------|
| Purpose | Individual chat message |

### conversation FK (Task 08)
| Field | Type |
|-------|------|
| Name | conversation |
| FK | Conversation |
| Related | messages |
| On delete | CASCADE |

### role Field (Task 09)
| Field | Type |
|-------|------|
| Name | role |
| Type | CharField(20) |
| Choices | user, assistant, system |

### Role Choices
| Role | Description |
|------|-------------|
| USER | Customer message |
| ASSISTANT | Bot response |
| SYSTEM | System context |

### content Field (Task 10)
| Field | Type |
|-------|------|
| Name | content |
| Type | TextField |
| Max | 4000 chars |

### timestamp Field (Task 11)
| Field | Type |
|-------|------|
| Name | timestamp |
| Type | DateTimeField |
| Auto | auto_now_add |

### Intent Model (Task 12)
| Class | Intent |
|-------|--------|
| Purpose | Intent definitions |

### intent_name Field (Task 13)
| Field | Type |
|-------|------|
| Name | intent_name |
| Type | CharField(50) |
| Unique | True |

### Predefined Intents
| Intent | Description |
|--------|-------------|
| ORDER_STATUS | Order tracking |
| PRODUCT_INFO | Product questions |
| RETURNS | Return/refund |
| SHIPPING | Delivery questions |
| STORE_INFO | Store information |
| GREETING | Hello messages |
| FAREWELL | Goodbye messages |
| ESCALATE | Human handoff |

### training_phrases Field (Task 14)
| Field | Type |
|-------|------|
| Name | training_phrases |
| Type | JSONField |
| Content | List of phrases |
