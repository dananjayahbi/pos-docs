# Group A: Chat State & Types

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create TypeScript types and Zustand store for chat

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06_AI-Chatbot-Backend](../../SubPhase-06_AI-Chatbot-Backend/)
- **→ Next Group:** [Group-B_Chat-Widget](../Group-B_Chat-Widget/)

---

## Group Overview

This group creates chat types and state. Creates Chat Types file with Message Interface, Conversation Interface, QuickReply Interface, ChatStatus Enum, and MessageRole Enum. Creates Chat Store using Zustand with messages state array, isOpen state, isTyping state, and conversationId state. Creates addMessage action, sendMessage action, and clearChat action. Creates Chat API Client. Verifies state.

### Key Outcomes

- Chat Types
- Message Interface
- Conversation Interface
- QuickReply Interface
- ChatStatus Enum
- MessageRole Enum
- Chat Store
- messages State
- isOpen State
- isTyping State
- conversationId State
- addMessage Action
- sendMessage Action
- clearChat Action
- Chat API Client
- State verified

### Technology Context

- **Types:** TypeScript interfaces
- **State:** Zustand store
- **Persistence:** localStorage
- **API:** Fetch client

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-11_Types-Store.md` | Create types and store | 01-11 |
| 02 | `02_Tasks-12-16_Actions-Client.md` | Create actions and client | 12-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Chat Types | Medium | SubPhase-06 |
| 02 | Create Message Interface | Low | Task 01 |
| 03 | Create Conversation Interface | Low | Task 01 |
| 04 | Create QuickReply Interface | Low | Task 01 |
| 05 | Create ChatStatus Enum | Low | Task 01 |
| 06 | Create MessageRole Enum | Low | Task 01 |
| 07 | Create Chat Store | Medium | Task 06 |
| 08 | Create messages State | Low | Task 07 |
| 09 | Create isOpen State | Low | Task 07 |
| 10 | Create isTyping State | Low | Task 07 |
| 11 | Create conversationId State | Low | Task 07 |
| 12 | Create addMessage Action | Low | Task 11 |
| 13 | Create sendMessage Action | Medium | Task 12 |
| 14 | Create clearChat Action | Low | Task 12 |
| 15 | Create Chat API Client | Medium | Task 14 |
| 16 | Verify State | Low | Task 15 |

---

## Execution Order

```
Task 01: Chat Types
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-02      T-03      T-04     T-05     T-06
(Msg)   (Conv)  (Quick) (Status)(Role)
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                          │
                          ▼
                   Task 07: Chat Store
                          │
                ┌────┬────┼────┬────┐
                ▼    ▼    ▼    ▼    ▼
             T-08  T-09  T-10  T-11
            (Msgs)(Open)(Type)(Conv)
                │    │    │    │
                └────┴────┴────┘
                          │
                          ▼
                   Task 12: addMessage
                          │
                     ┌────┴────┐
                     ▼         ▼
                  T-13       T-14
                (Send)    (Clear)
                     │         │
                     └────┬────┘
                          │
                          ▼
                   Task 15: API Client
                          │
                          ▼
                   Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
└── lib/
    └── chat/
        ├── types.ts
        ├── store.ts
        └── client.ts
```

---

## Notes for AI Agents

### Chat Types (Task 01)
| File | lib/chat/types.ts |
|------|-------------------|
| Purpose | Chat type definitions |

### Message Interface (Task 02)
| Interface | Message |
|-----------|---------|

### Message Fields
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique ID |
| role | MessageRole | user/assistant |
| content | string | Message text |
| timestamp | Date | Send time |
| status | 'sending' \| 'sent' \| 'error' | Delivery status |

### Conversation Interface (Task 03)
| Interface | Conversation |
|-----------|--------------|

### Conversation Fields
| Field | Type | Description |
|-------|------|-------------|
| id | string | Conversation ID |
| sessionId | string | Session UUID |
| status | 'active' \| 'resolved' \| 'escalated' | Status |
| startedAt | Date | Start time |
| messages | Message[] | Message array |

### QuickReply Interface (Task 04)
| Interface | QuickReply |
|-----------|------------|

### QuickReply Fields
| Field | Type | Description |
|-------|------|-------------|
| id | string | Reply ID |
| text | string | Display text |
| value | string | Send value |

### ChatStatus Enum (Task 05)
| Enum | ChatStatus |
|------|------------|
| Values | CLOSED, MINIMIZED, OPEN |

### MessageRole Enum (Task 06)
| Enum | MessageRole |
|------|-------------|
| Values | USER, ASSISTANT, SYSTEM |

### Chat Store (Task 07)
| Store | useChatStore |
|-------|--------------|
| Library | Zustand |

### messages State (Task 08)
| State | messages |
|-------|----------|
| Type | Message[] |
| Default | [] |

### isOpen State (Task 09)
| State | isOpen |
|-------|--------|
| Type | boolean |
| Default | false |

### isTyping State (Task 10)
| State | isTyping |
|-------|----------|
| Type | boolean |
| Default | false |

### conversationId State (Task 11)
| State | conversationId |
|-------|----------------|
| Type | string \| null |
| Default | null |

### addMessage Action (Task 12)
| Action | addMessage(message) |
|--------|---------------------|
| Params | Message |
| Action | Append to messages |

### sendMessage Action (Task 13)
| Action | sendMessage(content) |
|--------|----------------------|
| Params | string |
| Action | Add user msg, call API, add response |

### clearChat Action (Task 14)
| Action | clearChat() |
|--------|-------------|
| Action | Reset messages, conversationId |

### Chat API Client (Task 15)
| File | lib/chat/client.ts |
|------|-------------------|

### Client Methods
| Method | Endpoint |
|--------|----------|
| startConversation | POST /api/chat/start/ |
| sendMessage | POST /api/chat/message/ |
| getHistory | GET /api/chat/{id}/history/ |
| endConversation | POST /api/chat/{id}/end/ |
