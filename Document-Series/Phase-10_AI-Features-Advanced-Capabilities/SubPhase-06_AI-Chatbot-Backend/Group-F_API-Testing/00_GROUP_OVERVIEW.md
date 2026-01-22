# Group F: API & Testing

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** F of F  
> **Tasks Covered:** 83-92  
> **Group Goal:** Create chatbot API endpoints and frontend integration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_LLM-Integration](../Group-E_LLM-Integration/)
- **→ Next SubPhase:** [SubPhase-07_AI-Chatbot-Frontend](../../SubPhase-07_AI-Chatbot-Frontend/)

---

## Group Overview

This group creates API and frontend. Creates Chatbot API Views using DRF ViewSet. Creates Start Conversation at POST /api/chat/start/. Creates Send Message at POST /api/chat/message/. Creates Get History at GET /api/chat/{id}/history/. Creates End Conversation at POST /api/chat/{id}/end/. Creates TypeScript Chatbot Types. Creates Chatbot API Client. Creates WebSocket Support for real-time. Creates integration tests. Creates documentation.

### Key Outcomes

- Chatbot API Views
- Start Conversation
- Send Message
- Get History
- End Conversation
- Chatbot Types
- Chatbot API Client
- WebSocket Support
- Integration tests
- Documentation

### Technology Context

- **API:** Django REST Framework
- **WebSocket:** Django Channels
- **Frontend:** Next.js + TypeScript
- **Testing:** pytest

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-92_API-WebSocket-Docs.md` | Create API, WebSocket, docs | 83-92 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create Chatbot API Views | Medium | Task 82 |
| 84 | Create Start Conversation | Low | Task 83 |
| 85 | Create Send Message | Medium | Task 83 |
| 86 | Create Get History | Low | Task 83 |
| 87 | Create End Conversation | Low | Task 83 |
| 88 | Create Chatbot Types | Low | Task 87 |
| 89 | Create Chatbot API Client | Medium | Task 88 |
| 90 | Create WebSocket Support | High | Task 89 |
| 91 | Create Integration Tests | Medium | Task 90 |
| 92 | Create Documentation | Low | Task 91 |

---

## Execution Order

```
Task 83: Chatbot API Views
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-84     T-85     T-86     T-87
(Start) (Send) (History)(End)
    │        │        │        │
    └────────┴────────┴────────┘
                   │
                   ▼
            Task 88: Chatbot Types
                   │
                   ▼
            Task 89: Chatbot API Client
                   │
                   ▼
            Task 90: WebSocket Support
                   │
                   ▼
            Task 91: Integration Tests
                   │
                   ▼
            Task 92: Documentation
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── chatbot/
        └── api/
            ├── views.py
            ├── serializers.py
            └── websocket.py

frontend/
└── lib/
    └── chatbot/
        ├── types.ts
        └── client.ts

tests/
└── chatbot/
    └── test_chatbot_e2e.py

docs/
└── chatbot/
    └── README.md
```

---

## Notes for AI Agents

### Chatbot API Views (Task 83)
| ViewSet | ChatbotViewSet |
|---------|----------------|
| Purpose | Chatbot endpoints |

### Start Conversation (Task 84)
| Endpoint | POST /api/chat/start/ |
|----------|----------------------|
| Body | { customer_id: optional } |
| Return | Conversation object |

### Start Request
| Field | Type | Required |
|-------|------|----------|
| customer_id | UUID | No |

### Start Response
| Field | Description |
|-------|-------------|
| session_id | UUID |
| conversation_id | ID |
| welcome_message | Greeting |

### Send Message (Task 85)
| Endpoint | POST /api/chat/message/ |
|----------|------------------------|
| Body | { session_id, message } |
| Return | Bot response |

### Send Request
| Field | Type | Required |
|-------|------|----------|
| session_id | UUID | Yes |
| message | string | Yes |

### Send Response
| Field | Description |
|-------|-------------|
| message_id | ID |
| response | Bot message |
| intent | Detected intent |
| entities | Extracted entities |
| follow_up | Next question |

### Get History (Task 86)
| Endpoint | GET /api/chat/{session_id}/history/ |
|----------|-------------------------------------|
| Return | Message list |

### History Response
| Field | Description |
|-------|-------------|
| messages | List of messages |
| total | Total count |

### Message Object
| Field | Description |
|-------|-------------|
| id | Message ID |
| role | user/assistant |
| content | Message text |
| timestamp | ISO datetime |

### End Conversation (Task 87)
| Endpoint | POST /api/chat/{session_id}/end/ |
|----------|----------------------------------|
| Body | { resolution: optional } |
| Return | Summary |

### End Request
| Field | Type | Required |
|-------|------|----------|
| resolution | string | No |
| rating | 1-5 | No |

### End Response
| Field | Description |
|-------|-------------|
| status | resolved |
| duration | seconds |
| message_count | total |

### Chatbot Types (Task 88)
| Type | Fields |
|------|--------|
| Conversation | session_id, status, messages |
| Message | id, role, content, timestamp |
| SendRequest | session_id, message |
| SendResponse | response, intent, entities |

### Chatbot API Client (Task 89)
| Method | Endpoint |
|--------|----------|
| startConversation | POST /start/ |
| sendMessage | POST /message/ |
| getHistory | GET /{id}/history/ |
| endConversation | POST /{id}/end/ |

### WebSocket Support (Task 90)
| Protocol | WebSocket |
|----------|-----------|
| URL | ws://host/ws/chat/{session_id}/ |
| Library | Django Channels |

### WebSocket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| message | client→server | User message |
| response | server→client | Bot response |
| typing | server→client | Bot typing indicator |
| error | server→client | Error message |

### WebSocket Message Format
| Field | Description |
|-------|-------------|
| type | Event type |
| data | Message content |
| timestamp | ISO datetime |

### Integration Tests (Task 91)
| Test | Coverage |
|------|----------|
| test_start_conversation | Start flow |
| test_send_message | Message flow |
| test_intent_classification | Intent detection |
| test_entity_extraction | Entity extraction |
| test_order_status_flow | Order lookup |
| test_escalation_flow | Human handoff |
| test_websocket_connection | WebSocket |

### Test Scenarios
| Scenario | Input | Expected |
|----------|-------|----------|
| Greeting | "Hi" | Welcome message |
| Order status | "Where is order #123" | Order details |
| Unknown | "random text" | Fallback response |
| Escalate | "talk to human" | Escalation |

### Documentation (Task 92)
| Section | Content |
|---------|---------|
| Overview | Chatbot concept |
| API Reference | All endpoints |
| WebSocket | Real-time docs |
| Intents | Intent list |
| Entities | Entity types |
| Examples | Code examples |
| Troubleshooting | Common issues |
