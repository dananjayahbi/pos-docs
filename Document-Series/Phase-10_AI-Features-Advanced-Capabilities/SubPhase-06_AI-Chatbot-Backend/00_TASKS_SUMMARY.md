# SubPhase 06: AI Chatbot Backend - Tasks Summary

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase Index:** 06 of 12  
> **SubPhase Goal:** Implement conversational AI backend for customer support  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 13-15 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_Smart-Search-Sinhaglish](../SubPhase-05_Smart-Search-Sinhaglish/)
- **→ Next SubPhase:** [SubPhase-07_AI-Chatbot-Frontend](../SubPhase-07_AI-Chatbot-Frontend/)

---

## SubPhase Overview

This sub-phase implements the AI chatbot backend for customer support, including intent classification, entity extraction, action handlers, and integration with OpenAI GPT API.

### Key Outcomes
- Intent classification system
- Entity extraction (order ID, product, etc.)
- Action handlers for intents
- OpenAI GPT API integration
- Rule-based fallback system
- Conversation context management
- Human handoff capability

### Chatbot Capabilities
| Intent | Examples | Action |
|--------|----------|--------|
| Order Status | "Where is my order?" | Look up order |
| Product Info | "Tell me about this product" | Product details |
| Returns | "I want to return" | Return policy/initiate |
| Shipping | "Delivery time?" | Shipping info |
| Store Info | "Store hours" | Business info |

### Technology Stack
- **LLM:** OpenAI GPT-4 API
- **Fallback:** Rule-based responses
- **Context:** Redis for session
- **Queue:** Celery for async processing

---

## Task Execution Order

```
TASK GROUP A: Chatbot Models (Tasks 01-16)
        │
        ▼
TASK GROUP B: Intent Classification (Tasks 17-34)
        │
        ▼
TASK GROUP C: Entity Extraction (Tasks 35-50)
        │
        ▼
TASK GROUP D: Action Handlers (Tasks 51-68)
        │
        ▼
TASK GROUP E: LLM Integration (Tasks 69-82)
        │
        ▼
TASK GROUP F: API & Testing (Tasks 83-92)
```

---

## Task Index

### Group A: Chatbot Models (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Conversation Model** | Conversation sessions | SubPhase-05 | 🔴 Not Created |
| 02 | **Create session_id Field** | Unique session ID | Task 01 | 🔴 Not Created |
| 03 | **Create customer FK** | Customer link | Task 01 | 🔴 Not Created |
| 04 | **Create status Field** | active/resolved/escalated | Task 01 | 🔴 Not Created |
| 05 | **Create started_at Field** | Start timestamp | Task 01 | 🔴 Not Created |
| 06 | **Create ended_at Field** | End timestamp | Task 01 | 🔴 Not Created |
| 07 | **Create Message Model** | Individual messages | Task 01 | 🔴 Not Created |
| 08 | **Create conversation FK** | Link to conversation | Task 07 | 🔴 Not Created |
| 09 | **Create role Field** | user/assistant/system | Task 07 | 🔴 Not Created |
| 10 | **Create content Field** | Message text | Task 07 | 🔴 Not Created |
| 11 | **Create timestamp Field** | Message time | Task 07 | 🔴 Not Created |
| 12 | **Create Intent Model** | Intent definitions | Task 01 | 🔴 Not Created |
| 13 | **Create intent_name Field** | Intent identifier | Task 12 | 🔴 Not Created |
| 14 | **Create training_phrases Field** | Example phrases JSON | Task 12 | 🔴 Not Created |
| 15 | **Create Chatbot Migrations** | Generate migrations | Task 14 | 🔴 Not Created |
| 16 | **Verify Models** | Test model creation | Task 15 | 🔴 Not Created |

---

### Group B: Intent Classification (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create IntentClassifier** | Intent classification | Task 16 | 🔴 Not Created |
| 18 | **Create classify Method** | Classify intent | Task 17 | 🔴 Not Created |
| 19 | **Create get_confidence** | Confidence score | Task 18 | 🔴 Not Created |
| 20 | **Create ORDER_STATUS Intent** | Order tracking | Task 19 | 🔴 Not Created |
| 21 | **Create PRODUCT_INFO Intent** | Product questions | Task 19 | 🔴 Not Created |
| 22 | **Create RETURNS Intent** | Return/refund | Task 19 | 🔴 Not Created |
| 23 | **Create SHIPPING Intent** | Delivery questions | Task 19 | 🔴 Not Created |
| 24 | **Create STORE_INFO Intent** | Store information | Task 19 | 🔴 Not Created |
| 25 | **Create GREETING Intent** | Hello/Hi | Task 19 | 🔴 Not Created |
| 26 | **Create FAREWELL Intent** | Goodbye/Thanks | Task 19 | 🔴 Not Created |
| 27 | **Create ESCALATE Intent** | Human handoff | Task 19 | 🔴 Not Created |
| 28 | **Create Training Phrases** | Seed phrases per intent | Task 27 | 🔴 Not Created |
| 29 | **Create Text Preprocessor** | Clean input text | Task 28 | 🔴 Not Created |
| 30 | **Create Embedding Classifier** | Sentence embedding | Task 29 | 🔴 Not Created |
| 31 | **Create Rule-based Classifier** | Keyword fallback | Task 30 | 🔴 Not Created |
| 32 | **Create Hybrid Classifier** | Combine methods | Task 31 | 🔴 Not Created |
| 33 | **Create Intent Admin** | Admin for intents | Task 12 | 🔴 Not Created |
| 34 | **Verify Classification** | Test classifier | Task 33 | 🔴 Not Created |

---

### Group C: Entity Extraction (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create EntityExtractor** | Extract entities | Task 34 | 🔴 Not Created |
| 36 | **Create extract Method** | Extract from text | Task 35 | 🔴 Not Created |
| 37 | **Create ORDER_ID Entity** | Order number | Task 36 | 🔴 Not Created |
| 38 | **Create PRODUCT_NAME Entity** | Product reference | Task 36 | 🔴 Not Created |
| 39 | **Create QUANTITY Entity** | Quantity numbers | Task 36 | 🔴 Not Created |
| 40 | **Create DATE Entity** | Date references | Task 36 | 🔴 Not Created |
| 41 | **Create PHONE Entity** | Phone number | Task 36 | 🔴 Not Created |
| 42 | **Create EMAIL Entity** | Email address | Task 36 | 🔴 Not Created |
| 43 | **Create Regex Extractor** | Regex patterns | Task 42 | 🔴 Not Created |
| 44 | **Create Order ID Pattern** | #12345 pattern | Task 43 | 🔴 Not Created |
| 45 | **Create Phone Pattern** | +94 pattern | Task 43 | 🔴 Not Created |
| 46 | **Create SpaCy Extractor** | NER with SpaCy | Task 45 | 🔴 Not Created |
| 47 | **Create Entity Cache** | Cache extracted | Task 46 | 🔴 Not Created |
| 48 | **Create Context Entities** | From conversation | Task 47 | 🔴 Not Created |
| 49 | **Create Entity Validation** | Validate entities | Task 48 | 🔴 Not Created |
| 50 | **Verify Extraction** | Test extraction | Task 49 | 🔴 Not Created |

---

### Group D: Action Handlers (Tasks 51-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create ActionHandler ABC** | Abstract handler | Task 50 | 🔴 Not Created |
| 52 | **Create handle Abstract** | Execute action | Task 51 | 🔴 Not Created |
| 53 | **Create ActionResponse** | Response structure | Task 52 | 🔴 Not Created |
| 54 | **Create OrderStatusHandler** | Order lookup | Task 53 | 🔴 Not Created |
| 55 | **Create get_order_status** | Fetch order status | Task 54 | 🔴 Not Created |
| 56 | **Create format_order_response** | Format response | Task 55 | 🔴 Not Created |
| 57 | **Create ProductInfoHandler** | Product info | Task 53 | 🔴 Not Created |
| 58 | **Create get_product_info** | Fetch product | Task 57 | 🔴 Not Created |
| 59 | **Create ReturnHandler** | Return/refund | Task 53 | 🔴 Not Created |
| 60 | **Create get_return_policy** | Return policy | Task 59 | 🔴 Not Created |
| 61 | **Create initiate_return** | Start return | Task 60 | 🔴 Not Created |
| 62 | **Create ShippingHandler** | Shipping info | Task 53 | 🔴 Not Created |
| 63 | **Create StoreInfoHandler** | Store details | Task 53 | 🔴 Not Created |
| 64 | **Create EscalationHandler** | Human handoff | Task 53 | 🔴 Not Created |
| 65 | **Create notify_agent** | Notify support | Task 64 | 🔴 Not Created |
| 66 | **Create ActionRegistry** | Register handlers | Task 65 | 🔴 Not Created |
| 67 | **Create get_handler Method** | Get by intent | Task 66 | 🔴 Not Created |
| 68 | **Verify Handlers** | Test handlers | Task 67 | 🔴 Not Created |

---

### Group E: LLM Integration (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create OpenAI Settings** | API settings | Task 68 | 🔴 Not Created |
| 70 | **Create OPENAI_API_KEY** | API key setting | Task 69 | 🔴 Not Created |
| 71 | **Create OPENAI_MODEL** | Model setting | Task 69 | 🔴 Not Created |
| 72 | **Create OpenAIClient** | OpenAI client | Task 71 | 🔴 Not Created |
| 73 | **Create chat_completion Method** | Chat API call | Task 72 | 🔴 Not Created |
| 74 | **Create System Prompt** | Chatbot persona | Task 73 | 🔴 Not Created |
| 75 | **Create Context Builder** | Build context | Task 74 | 🔴 Not Created |
| 76 | **Create add_messages** | Add history | Task 75 | 🔴 Not Created |
| 77 | **Create add_context** | Add order/product | Task 76 | 🔴 Not Created |
| 78 | **Create ChatbotService** | Main service | Task 77 | 🔴 Not Created |
| 79 | **Create process_message** | Process user msg | Task 78 | 🔴 Not Created |
| 80 | **Create Response Formatter** | Format responses | Task 79 | 🔴 Not Created |
| 81 | **Create Fallback Response** | When LLM fails | Task 80 | 🔴 Not Created |
| 82 | **Verify LLM Integration** | Test OpenAI | Task 81 | 🔴 Not Created |

---

### Group F: API & Testing (Tasks 83-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create Chatbot API Views** | DRF ViewSet | Task 82 | 🔴 Not Created |
| 84 | **Create Start Conversation** | POST /api/chat/start/ | Task 83 | 🔴 Not Created |
| 85 | **Create Send Message** | POST /api/chat/message/ | Task 83 | 🔴 Not Created |
| 86 | **Create Get History** | GET /api/chat/{id}/history/ | Task 83 | 🔴 Not Created |
| 87 | **Create End Conversation** | POST /api/chat/{id}/end/ | Task 83 | 🔴 Not Created |
| 88 | **Create Chatbot Types** | TypeScript interfaces | Task 87 | 🔴 Not Created |
| 89 | **Create Chatbot API Client** | Frontend API client | Task 88 | 🔴 Not Created |
| 90 | **Create WebSocket Support** | Real-time messages | Task 89 | 🔴 Not Created |
| 91 | **Create Integration Tests** | E2E chatbot tests | Task 90 | 🔴 Not Created |
| 92 | **Create Documentation** | Chatbot API docs | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── chatbot/
        ├── __init__.py
        ├── models/
        │   ├── conversation.py               # Conversation (Task 01)
        │   ├── message.py                    # Message (Task 07)
        │   └── intent.py                     # Intent (Task 12)
        ├── classification/
        │   ├── __init__.py
        │   ├── classifier.py                 # IntentClassifier (Task 17)
        │   ├── embedding.py                  # Embedding classifier (Task 30)
        │   └── rule_based.py                 # Rule-based (Task 31)
        ├── extraction/
        │   ├── __init__.py
        │   ├── extractor.py                  # EntityExtractor (Task 35)
        │   ├── regex.py                      # Regex patterns (Task 43)
        │   └── spacy.py                      # SpaCy NER (Task 46)
        ├── handlers/
        │   ├── __init__.py
        │   ├── base.py                       # ActionHandler ABC (Task 51)
        │   ├── order_status.py               # OrderStatusHandler (Task 54)
        │   ├── product_info.py               # ProductInfoHandler (Task 57)
        │   ├── returns.py                    # ReturnHandler (Task 59)
        │   ├── shipping.py                   # ShippingHandler (Task 62)
        │   ├── store_info.py                 # StoreInfoHandler (Task 63)
        │   ├── escalation.py                 # EscalationHandler (Task 64)
        │   └── registry.py                   # ActionRegistry (Task 66)
        ├── llm/
        │   ├── __init__.py
        │   ├── client.py                     # OpenAIClient (Task 72)
        │   ├── prompts.py                    # System prompts (Task 74)
        │   └── context.py                    # Context builder (Task 75)
        ├── services/
        │   └── chatbot_service.py            # ChatbotService (Task 78)
        └── api/
            ├── views.py                      # API views (Task 83)
            └── websocket.py                  # WebSocket (Task 90)

frontend/
└── lib/
    └── chatbot/
        ├── types.ts                          # Types (Task 88)
        └── client.ts                         # API client (Task 89)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Chatbot Models | 16 | 0 | 0% |
| B | Intent Classification | 18 | 0 | 0% |
| C | Entity Extraction | 16 | 0 | 0% |
| D | Action Handlers | 18 | 0 | 0% |
| E | LLM Integration | 14 | 0 | 0% |
| F | API & Testing | 10 | 0 | 0% |
| **Total** | | **92** | **0** | **0%** |

---

## Intent Definitions

| Intent | Training Phrases | Handler |
|--------|------------------|---------|
| ORDER_STATUS | "where is my order", "track order #123" | OrderStatusHandler |
| PRODUCT_INFO | "tell me about", "is this available" | ProductInfoHandler |
| RETURNS | "return policy", "want to return" | ReturnHandler |
| SHIPPING | "delivery time", "shipping cost" | ShippingHandler |
| STORE_INFO | "store hours", "contact number" | StoreInfoHandler |
| GREETING | "hi", "hello", "good morning" | GreetingHandler |
| FAREWELL | "bye", "thanks", "goodbye" | FarewellHandler |
| ESCALATE | "talk to human", "speak to agent" | EscalationHandler |

---

## Chatbot Flow

```
User Message → Preprocess → Intent Classification → 
Entity Extraction → Action Handler → 
LLM Enhancement → Response
```

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Hybrid classifier** - Embedding + rule-based fallback
3. **Entity extraction** - Regex + SpaCy NER
4. **Action handlers** - One per intent
5. **OpenAI API** - GPT-4 for natural responses
6. **Context window** - Include conversation history
7. **Escalation** - Notify human support
8. **Multi-tenant** - Tenant-specific store info
9. **Fallback** - Graceful when LLM fails
10. **WebSocket** - Real-time conversation
