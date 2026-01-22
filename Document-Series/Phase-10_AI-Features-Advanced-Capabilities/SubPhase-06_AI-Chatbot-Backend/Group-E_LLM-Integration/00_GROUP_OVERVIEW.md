# Group E: LLM Integration

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Integrate OpenAI GPT for natural responses

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Action-Handlers](../Group-D_Action-Handlers/)
- **→ Next Group:** [Group-F_API-Testing](../Group-F_API-Testing/)

---

## Group Overview

This group integrates OpenAI GPT. Creates OpenAI Settings with OPENAI_API_KEY and OPENAI_MODEL settings. Creates OpenAIClient with chat_completion method. Creates System Prompt defining chatbot persona. Creates Context Builder with add_messages for history and add_context for order/product data. Creates ChatbotService with process_message method. Creates Response Formatter. Creates Fallback Response for LLM failures. Verifies LLM integration.

### Key Outcomes

- OpenAI Settings
- OPENAI_API_KEY
- OPENAI_MODEL
- OpenAIClient
- chat_completion method
- System Prompt
- Context Builder
- add_messages method
- add_context method
- ChatbotService
- process_message method
- Response Formatter
- Fallback Response
- LLM verified

### Technology Context

- **LLM:** OpenAI GPT-4
- **Context:** Conversation history
- **Fallback:** Rule-based
- **Persona:** Store assistant

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-77_Settings-Client-Context.md` | Create settings, client, context | 69-77 |
| 02 | `02_Tasks-78-82_Service-Formatter-Fallback.md` | Create service, formatter, fallback | 78-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create OpenAI Settings | Low | Task 68 |
| 70 | Create OPENAI_API_KEY | Low | Task 69 |
| 71 | Create OPENAI_MODEL | Low | Task 69 |
| 72 | Create OpenAIClient | Medium | Task 71 |
| 73 | Create chat_completion Method | Medium | Task 72 |
| 74 | Create System Prompt | Medium | Task 73 |
| 75 | Create Context Builder | Medium | Task 74 |
| 76 | Create add_messages | Low | Task 75 |
| 77 | Create add_context | Low | Task 76 |
| 78 | Create ChatbotService | High | Task 77 |
| 79 | Create process_message | High | Task 78 |
| 80 | Create Response Formatter | Low | Task 79 |
| 81 | Create Fallback Response | Medium | Task 80 |
| 82 | Verify LLM Integration | Low | Task 81 |

---

## Execution Order

```
Task 69: OpenAI Settings
    │
    ├────────┐
    ▼        ▼
T-70      T-71
(Key)   (Model)
    │        │
    └────────┘
         │
         ▼
  Task 72: OpenAIClient
         │
         ▼
  Task 73: chat_completion
         │
         ▼
  Task 74: System Prompt
         │
         ▼
  Task 75: Context Builder
         │
    ┌────┴────┐
    ▼         ▼
 T-76       T-77
(Messages)(Context)
    │         │
    └────┬────┘
         │
         ▼
  Task 78: ChatbotService
         │
         ▼
  Task 79: process_message
         │
         ▼
  Task 80: Response Formatter
         │
         ▼
  Task 81: Fallback Response
         │
         ▼
  Task 82: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── chatbot/
        ├── llm/
        │   ├── __init__.py
        │   ├── client.py
        │   ├── prompts.py
        │   └── context.py
        └── services/
            └── chatbot_service.py
```

---

## Notes for AI Agents

### OpenAI Settings (Task 69)
| File | settings/chatbot.py |
|------|---------------------|
| Purpose | OpenAI configuration |

### OPENAI_API_KEY (Task 70)
| Setting | OPENAI_API_KEY |
|---------|----------------|
| Source | Environment |
| Required | Yes |

### OPENAI_MODEL (Task 71)
| Setting | OPENAI_MODEL |
|---------|--------------|
| Default | gpt-4 |
| Options | gpt-4, gpt-3.5-turbo |

### OpenAIClient (Task 72)
| Class | OpenAIClient |
|-------|--------------|
| Purpose | OpenAI API wrapper |

### chat_completion Method (Task 73)
| Method | chat_completion(messages, **kwargs) |
|--------|-------------------------------------|
| Return | Response text |
| Async | Yes |

### API Parameters
| Parameter | Value |
|-----------|-------|
| model | gpt-4 |
| temperature | 0.7 |
| max_tokens | 500 |
| stream | False |

### System Prompt (Task 74)
| Purpose | Define chatbot persona |
|---------|----------------------|
| Role | Store assistant |
| Tone | Friendly, helpful |

### System Prompt Template
| Section | Content |
|---------|---------|
| Role | Customer support for {store_name} |
| Tone | Friendly and professional |
| Language | English and Sinhala |
| Limits | Store-related questions only |

### Context Builder (Task 75)
| Class | ContextBuilder |
|-------|----------------|
| Purpose | Build message context |

### add_messages (Task 76)
| Method | add_messages(conversation) |
|--------|---------------------------|
| Action | Add conversation history |
| Limit | Last 10 messages |

### Message Format
| Role | Content |
|------|---------|
| system | System prompt |
| user | Customer message |
| assistant | Bot response |

### add_context (Task 77)
| Method | add_context(entities, data) |
|--------|----------------------------|
| Action | Add order/product context |

### Context Injection
| Type | Content |
|------|---------|
| Order | Order status, tracking |
| Product | Name, price, stock |
| Customer | Name, order history |

### ChatbotService (Task 78)
| Class | ChatbotService |
|-------|----------------|
| Purpose | Main chatbot orchestration |

### process_message (Task 79)
| Method | process_message(conversation_id, message) |
|--------|------------------------------------------|
| Return | Response message |
| Flow | Classify → Extract → Handle → LLM |

### Processing Flow
| Step | Action |
|------|--------|
| 1 | Save user message |
| 2 | Classify intent |
| 3 | Extract entities |
| 4 | Get action handler |
| 5 | Execute handler |
| 6 | Enhance with LLM |
| 7 | Save bot message |
| 8 | Return response |

### Response Formatter (Task 80)
| Class | ResponseFormatter |
|-------|-------------------|
| Purpose | Format LLM response |

### Formatting Rules
| Rule | Action |
|------|--------|
| Length | Max 500 chars |
| Markdown | Convert to plain |
| Links | Format as text |
| Currency | Rs. format |

### Fallback Response (Task 81)
| Purpose | When LLM fails |
|---------|----------------|
| Trigger | API error, timeout |

### Fallback Responses
| Intent | Fallback |
|--------|----------|
| ORDER_STATUS | Your order is being processed. |
| PRODUCT_INFO | Please visit our website. |
| RETURNS | Contact us for returns. |
| SHIPPING | Standard delivery is 3-5 days. |
| STORE_INFO | Contact us at {phone}. |
| ESCALATE | Connecting you to support. |
| UNKNOWN | I'll connect you to support. |

### Error Handling
| Error | Action |
|-------|--------|
| APIError | Use fallback |
| RateLimitError | Queue and retry |
| Timeout | Use fallback |
| InvalidAPIKey | Alert admin |
