# Tasks 83-92: API, WebSocket & Documentation

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** F - API & Testing  
> **Document:** 01 of 01  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-E_LLM-Integration](../Group-E_LLM-Integration/)
- **→ Next SubPhase:** [SubPhase-07_AI-Chatbot-Frontend](../../SubPhase-07_AI-Chatbot-Frontend/)

---

## Document Overview

This document covers the creation of the complete chatbot API infrastructure, including RESTful endpoints, WebSocket support for real-time messaging, TypeScript type definitions, API client library, comprehensive testing, and documentation. It establishes the communication layer between the Django backend and Next.js frontend, enabling seamless chatbot interactions for customer support.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create Chatbot API Views | Medium | 45 min |
| 84 | Create Start Conversation | Low | 30 min |
| 85 | Create Send Message | Medium | 40 min |
| 86 | Create Get History | Low | 25 min |
| 87 | Create End Conversation | Low | 25 min |
| 88 | Create Chatbot Types | Low | 30 min |
| 89 | Create Chatbot API Client | Medium | 45 min |
| 90 | Create WebSocket Support | High | 60 min |
| 91 | Create Integration Tests | Medium | 50 min |
| 92 | Create Documentation | Low | 35 min |

---

## Task 83: Create Chatbot API Views

### Overview
Create the base Django REST Framework ViewSet for chatbot operations. This ViewSet serves as the foundation for all chatbot endpoints, providing standardized RESTful API patterns with proper authentication, serialization, and error handling. The ViewSet coordinates between the chatbot service layer and HTTP interface.

### Dependencies
- Task 82: Create LLM Service Integration
- Django REST Framework installed and configured
- Chatbot models and services from previous groups
- Authentication middleware configured

### Instructions

1. **Navigate to chatbot API directory**
   - Go to `backend/apps/chatbot/api/` directory
   - Create `views.py` file if not exists
   - Ensure `__init__.py` exists for Python package

2. **Import required dependencies**
   - Import DRF ViewSet and decorators
   - Import chatbot models (Conversation, Message)
   - Import chatbot service classes
   - Import serializers (to be created)
   - Import permission and authentication classes

3. **Define ChatbotViewSet class**
   - Inherit from `viewsets.ModelViewSet` or `viewsets.ViewSet`
   - Set queryset to Conversation model
   - Configure serializer class for data validation
   - Apply tenant-aware filtering

4. **Configure ViewSet permissions**
   - Require authentication for all endpoints
   - Apply role-based access control
   - Ensure tenant isolation per request
   - Add rate limiting for API abuse prevention

5. **Set up ViewSet routing**
   - Configure URL patterns for automatic routing
   - Define custom action routes for non-CRUD operations
   - Apply versioning if required
   - Ensure proper HTTP method mapping

6. **Implement error handling**
   - Add try-catch blocks for service layer calls
   - Return appropriate HTTP status codes
   - Provide user-friendly error messages
   - Log errors for debugging

7. **Add pagination support**
   - Configure pagination class for list endpoints
   - Set reasonable page size limits
   - Support cursor-based pagination for history

### ViewSet Structure

| Component | Purpose |
|-----------|---------|
| queryset | Base query for conversations |
| serializer_class | Data validation and transformation |
| permission_classes | Access control rules |
| filter_backends | Query filtering capabilities |
| pagination_class | Result pagination settings |

### ViewSet Actions

| Action | HTTP Method | Purpose |
|--------|-------------|---------|
| list | GET | List conversations |
| retrieve | GET | Get single conversation |
| create | POST | Start new conversation |
| update | PUT/PATCH | Update conversation |
| destroy | DELETE | Delete conversation |
| Custom actions | Various | Special operations |

### HTTP Response Codes

| Code | Usage | Description |
|------|-------|-------------|
| 200 | Success | Operation completed successfully |
| 201 | Created | New resource created |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error occurred |

### Expected Outcome
- Functional ChatbotViewSet with standard REST operations
- Proper authentication and permission enforcement
- Tenant-aware data filtering
- Error handling and logging configured
- Ready for custom action implementation

### Verification Checklist
- [ ] `backend/apps/chatbot/api/views.py` file created
- [ ] ChatbotViewSet class defined and configured
- [ ] Permissions and authentication applied
- [ ] Tenant isolation implemented
- [ ] Error handling added
- [ ] ViewSet registered in URL configuration

---

## Task 84: Create Start Conversation

### Overview
Implement the endpoint to initiate a new chatbot conversation. This endpoint creates a new conversation record, generates a unique session ID, initializes conversation context, and returns a welcome message to greet the user. It serves as the entry point for all chatbot interactions.

### Dependencies
- Task 83: Create Chatbot API Views

### Instructions

1. **Add start action to ViewSet**
   - Use `@action` decorator for custom endpoint
   - Set HTTP method to POST
   - Define URL path as `start/`
   - Set detail parameter to False (list-level action)

2. **Create serializer for start request**
   - Define `StartConversationSerializer`
   - Accept optional `customer_id` field
   - Accept optional `context` data (user info, page)
   - Validate all input fields

3. **Implement start conversation logic**
   - Extract customer ID if provided
   - Generate unique session ID (UUID4)
   - Create new Conversation instance
   - Set initial status to "active"
   - Store conversation context

4. **Initialize conversation state**
   - Set tenant from request
   - Set user from authenticated request
   - Initialize message history as empty
   - Record conversation start timestamp

5. **Generate welcome message**
   - Create initial bot Message instance
   - Set role to "assistant"
   - Use template: "Hello! How can I help you today?"
   - Personalize if customer data available
   - Save message to database

6. **Return response data**
   - Include session_id (UUID)
   - Include conversation_id (database ID)
   - Include welcome_message text
   - Include conversation status
   - Return HTTP 201 Created

7. **Handle edge cases**
   - Check for duplicate session IDs
   - Validate customer_id if provided
   - Handle database errors gracefully
   - Log conversation start event

### Start Request Format

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| customer_id | UUID | No | Existing customer identifier |
| context | Object | No | Initial conversation context |
| context.page | String | No | Page where chat initiated |
| context.user_info | Object | No | User metadata |

### Start Response Format

| Field | Type | Description |
|-------|------|-------------|
| session_id | UUID | Unique conversation session ID |
| conversation_id | Integer | Database conversation ID |
| welcome_message | String | Initial greeting message |
| status | String | Conversation status (active) |
| timestamp | ISO DateTime | Conversation start time |

### Welcome Message Variations

| Scenario | Message Template |
|----------|------------------|
| Anonymous User | "Hello! How can I help you today?" |
| Known Customer | "Welcome back, [Name]! How can I assist you?" |
| Returning User | "Hi again! What brings you back today?" |
| From Product Page | "I see you're interested in [Product]. Can I help?" |

### Conversation Context

| Context Field | Purpose |
|---------------|---------|
| customer_id | Link to customer record |
| initiated_page | Track conversation source |
| user_agent | Browser/device information |
| language | Preferred language |
| timezone | User timezone for timestamps |

### Expected Outcome
- Functional POST endpoint at `/api/chat/start/`
- New conversation created with unique session ID
- Welcome message generated and stored
- Conversation context initialized
- Ready to receive user messages

### Verification Checklist
- [ ] Start action added to ChatbotViewSet
- [ ] StartConversationSerializer created
- [ ] Conversation creation logic implemented
- [ ] Welcome message generation working
- [ ] Response format matches specification
- [ ] Edge cases handled properly
- [ ] Endpoint accessible and tested

---

## Task 85: Create Send Message

### Overview
Implement the core endpoint for sending messages to the chatbot and receiving responses. This endpoint handles user input, processes the message through the chatbot service, performs intent classification, extracts entities, generates appropriate responses, and maintains conversation history. It's the primary interaction point for the chatbot.

### Dependencies
- Task 83: Create Chatbot API Views
- Task 84: Create Start Conversation

### Instructions

1. **Add send message action to ViewSet**
   - Use `@action` decorator for custom endpoint
   - Set HTTP method to POST
   - Define URL path as `message/`
   - Set detail parameter to False

2. **Create serializer for message request**
   - Define `SendMessageSerializer`
   - Require `session_id` field (UUID)
   - Require `message` field (text content)
   - Validate message is not empty
   - Set maximum message length (e.g., 1000 chars)

3. **Validate conversation exists**
   - Lookup Conversation by session_id
   - Verify conversation belongs to current tenant
   - Check conversation status is "active"
   - Return 404 if not found
   - Return 400 if conversation ended

4. **Save user message**
   - Create new Message instance
   - Set role to "user"
   - Set content to user's message text
   - Link to conversation via foreign key
   - Save timestamp automatically

5. **Process message through chatbot service**
   - Call chatbot service with user message
   - Pass conversation context and history
   - Perform intent classification
   - Extract entities from message
   - Generate bot response

6. **Handle intent-specific logic**
   - Check detected intent type
   - Execute appropriate action handler
   - Retrieve data from database if needed
   - Format response based on intent
   - Include follow-up suggestions

7. **Save bot response**
   - Create new Message instance
   - Set role to "assistant"
   - Set content to bot's response text
   - Store detected intent and entities
   - Link to same conversation

8. **Return response data**
   - Include message_id for tracking
   - Include bot response text
   - Include detected intent
   - Include extracted entities
   - Include follow_up suggestions
   - Return HTTP 200 OK

9. **Handle errors gracefully**
   - Catch service layer exceptions
   - Return appropriate error messages
   - Log errors for debugging
   - Maintain conversation state

### Send Request Format

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| session_id | UUID | Yes | Active conversation session ID |
| message | String | Yes | User's message text (max 1000) |

### Send Response Format

| Field | Type | Description |
|-------|------|-------------|
| message_id | Integer | Database ID of bot message |
| response | String | Bot's response text |
| intent | String | Detected intent type |
| confidence | Float | Intent confidence score (0-1) |
| entities | Array | Extracted entities from message |
| follow_up | Array | Suggested follow-up questions |
| timestamp | ISO DateTime | Response generation time |

### Intent Classification

| Intent Type | Example Input | Response Action |
|-------------|---------------|-----------------|
| greeting | "hi", "hello" | Welcome response |
| order_status | "where's my order" | Lookup order details |
| product_inquiry | "tell me about product X" | Product information |
| complaint | "I have a problem" | Escalation consideration |
| general_question | "what are your hours" | FAQ response |
| fallback | unrecognized input | Clarification request |

### Entity Extraction

| Entity Type | Pattern | Example |
|-------------|---------|---------|
| order_number | #\d+ | "#12345" |
| product_name | Product catalog match | "Blue Widget" |
| date | Date patterns | "yesterday", "Jan 15" |
| email | Email pattern | "user@example.com" |
| phone | Phone pattern | "+94771234567" |

### Entity Response Format

| Field | Type | Description |
|-------|------|-------------|
| entity_type | String | Type of entity (order, product, etc.) |
| value | String | Extracted value |
| confidence | Float | Extraction confidence (0-1) |
| start_pos | Integer | Position in message |
| end_pos | Integer | End position in message |

### Follow-Up Suggestions

| Scenario | Suggestions |
|----------|-------------|
| After Order Status | "Track shipment", "Contact support", "Modify order" |
| After Product Info | "View specifications", "Check availability", "Compare products" |
| After Complaint | "Talk to human", "Provide more details", "View policies" |
| General Query | "Ask another question", "Browse products", "Contact us" |

### Expected Outcome
- Functional POST endpoint at `/api/chat/message/`
- User messages saved to database
- Intent classification working correctly
- Entity extraction functioning
- Bot responses generated appropriately
- Conversation history maintained
- Follow-up suggestions provided

### Verification Checklist
- [ ] Send message action added to ViewSet
- [ ] SendMessageSerializer created and validated
- [ ] Conversation lookup and validation working
- [ ] User message saved correctly
- [ ] Chatbot service integration complete
- [ ] Intent classification functional
- [ ] Entity extraction working
- [ ] Bot response generation successful
- [ ] Response format matches specification
- [ ] Error handling implemented

---

## Task 86: Create Get History

### Overview
Implement the endpoint to retrieve the complete message history for a conversation. This endpoint returns all messages exchanged between the user and bot in chronological order, enabling the frontend to display conversation history when users return to an existing chat session or want to review past interactions.

### Dependencies
- Task 83: Create Chatbot API Views
- Task 85: Create Send Message

### Instructions

1. **Add history action to ViewSet**
   - Use `@action` decorator for custom endpoint
   - Set HTTP method to GET
   - Define URL path with parameter: `{session_id}/history/`
   - Set detail parameter to True (instance-level action)

2. **Create serializer for history response**
   - Define `MessageSerializer` for individual messages
   - Include all message fields (id, role, content, timestamp)
   - Include intent and entities if available
   - Format timestamps in ISO 8601 format

3. **Validate conversation access**
   - Lookup Conversation by session_id from URL parameter
   - Verify conversation belongs to current tenant
   - Check user has permission to view conversation
   - Return 404 if conversation not found
   - Return 403 if access denied

4. **Query message history**
   - Filter Messages by conversation foreign key
   - Order by timestamp ascending (chronological)
   - Include both user and assistant messages
   - Apply pagination if history is long

5. **Format message data**
   - Serialize each message using MessageSerializer
   - Include message metadata (intent, entities)
   - Format timestamps consistently
   - Include role for each message

6. **Return response data**
   - Include array of message objects
   - Include total message count
   - Include conversation metadata (status, start time)
   - Include pagination info if applicable
   - Return HTTP 200 OK

7. **Implement pagination**
   - Support page-based pagination
   - Set reasonable page size (e.g., 50 messages)
   - Include next/previous page links
   - Allow client to request all messages

8. **Add filtering options**
   - Support filtering by role (user/assistant)
   - Support filtering by date range
   - Support search in message content
   - Support filtering by intent type

### History Response Format

| Field | Type | Description |
|-------|------|-------------|
| messages | Array | List of message objects |
| total | Integer | Total message count |
| conversation_id | Integer | Database conversation ID |
| session_id | UUID | Conversation session ID |
| status | String | Current conversation status |
| started_at | ISO DateTime | Conversation start timestamp |

### Message Object Format

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Database message ID |
| role | String | "user" or "assistant" |
| content | String | Message text content |
| timestamp | ISO DateTime | Message creation time |
| intent | String | Detected intent (assistant only) |
| entities | Array | Extracted entities (assistant only) |

### Pagination Format

| Field | Type | Description |
|-------|------|-------------|
| page | Integer | Current page number |
| page_size | Integer | Messages per page |
| total_pages | Integer | Total number of pages |
| next | String | URL for next page (or null) |
| previous | String | URL for previous page (or null) |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | Integer | 1 | Page number for pagination |
| page_size | Integer | 50 | Messages per page |
| role | String | null | Filter by role (user/assistant) |
| from_date | ISO Date | null | Filter messages after date |
| to_date | ISO Date | null | Filter messages before date |
| search | String | null | Search in message content |

### Message Role Values

| Role | Description | Who Sent |
|------|-------------|----------|
| user | User message | Customer/user |
| assistant | Bot message | Chatbot system |
| system | System message | Backend notifications |

### Example History Structure

```
Conversation History (10 messages)
├── [1] user: "Hello"
├── [2] assistant: "Hi! How can I help you?"
├── [3] user: "Where is my order #12345?"
├── [4] assistant: "Let me check order #12345..."
├── [5] assistant: "Your order is out for delivery."
├── [6] user: "When will it arrive?"
├── [7] assistant: "Expected delivery: Today by 6 PM"
├── [8] user: "Great, thanks!"
├── [9] assistant: "You're welcome! Anything else?"
└── [10] user: "No, that's all"
```

### Expected Outcome
- Functional GET endpoint at `/api/chat/{session_id}/history/`
- Complete message history returned in chronological order
- Pagination working for long conversations
- Filtering options available
- Proper access control enforced
- Response format matches specification

### Verification Checklist
- [ ] History action added to ViewSet
- [ ] MessageSerializer created
- [ ] Conversation validation implemented
- [ ] Message query working correctly
- [ ] Chronological ordering applied
- [ ] Pagination functional
- [ ] Filtering options working
- [ ] Response format correct
- [ ] Access control enforced

---

## Task 87: Create End Conversation

### Overview
Implement the endpoint to formally end a chatbot conversation. This endpoint marks the conversation as completed, records the resolution status, captures optional user feedback (rating), calculates conversation metrics (duration, message count), and allows for proper conversation lifecycle management.

### Dependencies
- Task 83: Create Chatbot API Views
- Task 86: Create Get History

### Instructions

1. **Add end conversation action to ViewSet**
   - Use `@action` decorator for custom endpoint
   - Set HTTP method to POST
   - Define URL path: `{session_id}/end/`
   - Set detail parameter to True

2. **Create serializer for end request**
   - Define `EndConversationSerializer`
   - Accept optional `resolution` field (text description)
   - Accept optional `rating` field (1-5 scale)
   - Accept optional `feedback` field (text comments)
   - Validate rating is between 1 and 5

3. **Validate conversation state**
   - Lookup Conversation by session_id
   - Verify conversation is currently "active"
   - Check user has permission to end conversation
   - Return 400 if already ended
   - Return 404 if not found

4. **Update conversation status**
   - Set status to "resolved" or "closed"
   - Store resolution description if provided
   - Store rating if provided
   - Store feedback comments if provided
   - Set ended_at timestamp to current time

5. **Calculate conversation metrics**
   - Calculate total duration (ended_at - started_at)
   - Count total messages in conversation
   - Count user messages
   - Count assistant messages
   - Calculate average response time

6. **Create conversation summary**
   - Generate summary of key topics discussed
   - List all intents detected during conversation
   - Compile list of entities extracted
   - Note if escalation occurred
   - Store summary in conversation record

7. **Return response data**
   - Include conversation status ("resolved")
   - Include total duration in seconds
   - Include message count
   - Include rating if provided
   - Include summary data
   - Return HTTP 200 OK

8. **Trigger post-conversation actions**
   - Send confirmation email if configured
   - Update customer satisfaction metrics
   - Archive conversation if retention policy applies
   - Notify relevant teams if issues identified

### End Request Format

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| resolution | String | No | Resolution description (max 500) |
| rating | Integer | No | Satisfaction rating (1-5) |
| feedback | String | No | User feedback comments (max 1000) |

### End Response Format

| Field | Type | Description |
|-------|------|-------------|
| status | String | Final conversation status |
| duration | Integer | Total duration in seconds |
| message_count | Integer | Total messages exchanged |
| user_messages | Integer | Messages from user |
| assistant_messages | Integer | Messages from bot |
| rating | Integer | User rating if provided |
| summary | Object | Conversation summary data |
| ended_at | ISO DateTime | Conversation end timestamp |

### Conversation Status Values

| Status | Description | When Set |
|--------|-------------|----------|
| active | Ongoing conversation | On start |
| resolved | Successfully ended | On normal end |
| escalated | Transferred to human | On escalation |
| abandoned | User left without ending | After timeout |
| closed | Manually closed | Admin action |

### Rating Scale

| Rating | Meaning | Icon |
|--------|---------|------|
| 1 | Very Unsatisfied | ⭐ |
| 2 | Unsatisfied | ⭐⭐ |
| 3 | Neutral | ⭐⭐⭐ |
| 4 | Satisfied | ⭐⭐⭐⭐ |
| 5 | Very Satisfied | ⭐⭐⭐⭐⭐ |

### Summary Object Format

| Field | Type | Description |
|-------|------|-------------|
| topics | Array | Main topics discussed |
| intents | Array | All intents detected |
| entities | Array | All entities extracted |
| escalated | Boolean | Whether escalation occurred |
| issues | Array | Issues identified |
| resolution_quality | String | Auto-assessed quality |

### Conversation Metrics

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| Duration | ended_at - started_at | Total conversation time |
| Message Count | COUNT(messages) | Interaction volume |
| Avg Response Time | AVG(time between messages) | Bot performance |
| Intent Accuracy | % correctly classified | Quality metric |
| Resolution Rate | % ending with rating 4-5 | Satisfaction metric |

### Expected Outcome
- Functional POST endpoint at `/api/chat/{session_id}/end/`
- Conversation status updated to resolved
- Optional rating and feedback captured
- Conversation metrics calculated
- Summary generated and stored
- Response includes all metrics
- Post-conversation actions triggered

### Verification Checklist
- [ ] End conversation action added to ViewSet
- [ ] EndConversationSerializer created
- [ ] Conversation state validation working
- [ ] Status update implemented
- [ ] Metrics calculation functional
- [ ] Summary generation working
- [ ] Optional fields handled correctly
- [ ] Response format matches specification
- [ ] Post-conversation actions triggered

---

## Task 88: Create Chatbot Types

### Overview
Create comprehensive TypeScript type definitions for the chatbot frontend. These types ensure type safety across the React application, provide IntelliSense support in the IDE, document the expected data structures, and maintain consistency between API contracts and frontend implementation.

### Dependencies
- Task 87: Create End Conversation
- Frontend TypeScript configuration complete

### Instructions

1. **Create types directory**
   - Navigate to `frontend/lib/chatbot/` directory
   - Create new file `types.ts`
   - Ensure proper TypeScript configuration

2. **Define base conversation types**
   - Create `Conversation` interface
   - Include session_id, conversation_id, status
   - Include timestamps (started_at, ended_at)
   - Include optional rating and feedback

3. **Define message types**
   - Create `Message` interface
   - Include id, role, content, timestamp
   - Include optional intent and entities
   - Create union type for role ("user" | "assistant")

4. **Define request types**
   - Create `StartConversationRequest` interface
   - Create `SendMessageRequest` interface
   - Create `EndConversationRequest` interface
   - Mark optional fields properly

5. **Define response types**
   - Create `StartConversationResponse` interface
   - Create `SendMessageResponse` interface
   - Create `GetHistoryResponse` interface
   - Create `EndConversationResponse` interface

6. **Define entity and intent types**
   - Create `Intent` type with all possible values
   - Create `Entity` interface with type, value, confidence
   - Create `EntityType` union type
   - Export all types for use across app

7. **Define WebSocket message types**
   - Create `WebSocketMessage` interface
   - Create `WebSocketEventType` union
   - Create types for each event (message, typing, error)
   - Include timestamp and data fields

8. **Add utility types**
   - Create `ChatbotError` type for error handling
   - Create `PaginationInfo` type for history pagination
   - Create `ConversationSummary` type
   - Create `ConversationStatus` union type

9. **Document all types**
   - Add JSDoc comments for each interface
   - Explain purpose and usage of each field
   - Provide examples where helpful
   - Note which fields are optional

### Core Type Definitions

| Type Name | Purpose |
|-----------|---------|
| Conversation | Complete conversation state |
| Message | Individual message data |
| Intent | Classified user intent |
| Entity | Extracted entity information |
| WebSocketMessage | Real-time message format |

### Conversation Interface

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| session_id | string (UUID) | Yes | Unique session identifier |
| conversation_id | number | Yes | Database record ID |
| status | ConversationStatus | Yes | Current conversation state |
| started_at | string (ISO) | Yes | Start timestamp |
| ended_at | string (ISO) | No | End timestamp |
| rating | number | No | User rating (1-5) |
| message_count | number | No | Total messages |

### Message Interface

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | Yes | Message database ID |
| role | MessageRole | Yes | Sender role |
| content | string | Yes | Message text |
| timestamp | string (ISO) | Yes | Creation timestamp |
| intent | Intent | No | Detected intent |
| entities | Entity[] | No | Extracted entities |

### MessageRole Union Type

| Value | Description |
|-------|-------------|
| "user" | Message from user |
| "assistant" | Message from chatbot |
| "system" | System notification |

### Intent Union Type

| Value | Description |
|-------|-------------|
| "greeting" | User greeting |
| "order_status" | Order inquiry |
| "product_inquiry" | Product question |
| "complaint" | User complaint |
| "general_question" | General inquiry |
| "escalation" | Request human help |
| "farewell" | Ending conversation |
| "fallback" | Unknown intent |

### Entity Interface

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entity_type | EntityType | Yes | Type of entity |
| value | string | Yes | Extracted value |
| confidence | number | Yes | Confidence score (0-1) |
| start_pos | number | No | Start position in text |
| end_pos | number | No | End position in text |

### EntityType Union Type

| Value | Description |
|-------|-------------|
| "order_number" | Order ID |
| "product_name" | Product reference |
| "date" | Date/time reference |
| "email" | Email address |
| "phone" | Phone number |
| "amount" | Money amount |

### WebSocketEventType Union

| Value | Description |
|-------|-------------|
| "message" | New message |
| "typing" | Bot typing indicator |
| "error" | Error occurred |
| "connected" | Connection established |
| "disconnected" | Connection closed |

### ConversationStatus Union

| Value | Description |
|-------|-------------|
| "active" | Currently active |
| "resolved" | Successfully ended |
| "escalated" | Transferred to human |
| "abandoned" | User left |
| "closed" | Manually closed |

### Expected Outcome
- Complete TypeScript type definitions file created
- All API request/response types defined
- WebSocket message types included
- Proper union types for enums
- Comprehensive JSDoc documentation
- Types exported for application use

### Verification Checklist
- [ ] `frontend/lib/chatbot/types.ts` file created
- [ ] Conversation interface defined
- [ ] Message interface defined
- [ ] Request/response types created
- [ ] Intent and Entity types defined
- [ ] WebSocket types included
- [ ] Union types for enums
- [ ] All types properly exported
- [ ] JSDoc comments added
- [ ] No TypeScript errors

---

## Task 89: Create Chatbot API Client

### Overview
Create a comprehensive TypeScript API client for all chatbot operations. This client provides a clean, type-safe interface for the React frontend to interact with the chatbot backend, handles HTTP requests, manages error handling, implements retry logic, and provides consistent API access patterns across the application.

### Dependencies
- Task 88: Create Chatbot Types
- Axios or Fetch API available
- Authentication token management configured

### Instructions

1. **Create API client file**
   - Navigate to `frontend/lib/chatbot/` directory
   - Create new file `client.ts`
   - Import types from `types.ts`
   - Import HTTP client library (axios or fetch wrapper)

2. **Define ChatbotClient class**
   - Create class to encapsulate all chatbot API calls
   - Store base URL as class property
   - Store authentication token manager
   - Initialize HTTP client in constructor

3. **Implement startConversation method**
   - Create async method accepting optional customer_id
   - Build POST request to `/api/chat/start/`
   - Include authentication headers
   - Return typed StartConversationResponse
   - Handle errors and return formatted error

4. **Implement sendMessage method**
   - Create async method accepting session_id and message
   - Build POST request to `/api/chat/message/`
   - Include authentication headers
   - Return typed SendMessageResponse
   - Implement retry logic for transient failures

5. **Implement getHistory method**
   - Create async method accepting session_id and pagination params
   - Build GET request to `/api/chat/{session_id}/history/`
   - Support query parameters (page, page_size, filters)
   - Return typed GetHistoryResponse
   - Handle pagination data

6. **Implement endConversation method**
   - Create async method accepting session_id and optional data
   - Build POST request to `/api/chat/{session_id}/end/`
   - Include rating and feedback if provided
   - Return typed EndConversationResponse
   - Handle already-ended conversations gracefully

7. **Add error handling utilities**
   - Create method to transform API errors
   - Extract user-friendly error messages
   - Handle network errors separately
   - Handle authentication errors (401)
   - Handle authorization errors (403)

8. **Implement request interceptors**
   - Add authentication token to all requests
   - Add tenant identifier header
   - Add request timestamp
   - Log requests in development mode

9. **Implement response interceptors**
   - Handle 401 errors (redirect to login)
   - Handle 429 errors (rate limiting)
   - Transform response data
   - Log responses in development

10. **Create singleton instance**
    - Export default instance of ChatbotClient
    - Configure with environment variables
    - Share across entire application
    - Allow custom configuration

### ChatbotClient Class Structure

| Method | Parameters | Return Type | Purpose |
|--------|------------|-------------|---------|
| startConversation | customer_id? | StartConversationResponse | Initiate chat |
| sendMessage | session_id, message | SendMessageResponse | Send user message |
| getHistory | session_id, params? | GetHistoryResponse | Fetch history |
| endConversation | session_id, data? | EndConversationResponse | End chat |

### Request Configuration

| Config Item | Purpose |
|-------------|---------|
| baseURL | API endpoint base |
| timeout | Request timeout (ms) |
| headers | Default headers |
| withCredentials | Include cookies |
| retries | Retry attempts |

### Authentication Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Authorization | Bearer {token} | User authentication |
| X-Tenant-ID | {tenant_id} | Tenant isolation |
| Content-Type | application/json | Request format |

### Error Handling

| Error Type | HTTP Code | Action |
|------------|-----------|--------|
| Network Error | - | Show offline message |
| Unauthorized | 401 | Redirect to login |
| Forbidden | 403 | Show access denied |
| Not Found | 404 | Show not found message |
| Rate Limited | 429 | Wait and retry |
| Server Error | 500 | Show error, log issue |

### Retry Logic

| Scenario | Retry Count | Backoff |
|----------|-------------|---------|
| Network failure | 3 | Exponential (1s, 2s, 4s) |
| Rate limit (429) | 2 | Fixed (5s) |
| Server error (500) | 2 | Exponential (2s, 4s) |
| Client error (4xx) | 0 | No retry |

### Error Response Format

| Field | Type | Description |
|-------|------|-------------|
| message | string | User-friendly error message |
| code | string | Error code for handling |
| details | object | Additional error details |
| status | number | HTTP status code |

### Expected Outcome
- Complete TypeScript API client class created
- All chatbot endpoints wrapped in methods
- Type-safe request and response handling
- Comprehensive error handling
- Retry logic for transient failures
- Authentication handled automatically
- Singleton instance exported for use

### Verification Checklist
- [ ] `frontend/lib/chatbot/client.ts` file created
- [ ] ChatbotClient class defined
- [ ] startConversation method implemented
- [ ] sendMessage method implemented
- [ ] getHistory method implemented
- [ ] endConversation method implemented
- [ ] Error handling utilities added
- [ ] Request/response interceptors configured
- [ ] Retry logic implemented
- [ ] Authentication headers included
- [ ] Singleton instance exported
- [ ] No TypeScript errors

---

## Task 90: Create WebSocket Support

### Overview
Implement real-time WebSocket communication for the chatbot, enabling instant message delivery, typing indicators, and live updates. This provides a superior user experience compared to polling, reduces server load, maintains persistent connections during chat sessions, and enables features like multi-user support and real-time notifications.

### Dependencies
- Task 89: Create Chatbot API Client
- Django Channels installed and configured
- Redis for channel layer (production)
- WebSocket support in frontend

### Instructions

1. **Configure Django Channels**
   - Add channels to INSTALLED_APPS
   - Create ASGI configuration file
   - Configure channel layers (Redis or in-memory)
   - Update project routing for WebSocket URLs

2. **Create WebSocket consumer**
   - Navigate to `backend/apps/chatbot/api/`
   - Create `websocket.py` file
   - Import AsyncWebsocketConsumer from channels
   - Create ChatbotConsumer class

3. **Implement connection handling**
   - Override connect method
   - Extract session_id from URL
   - Validate conversation exists
   - Authenticate user from scope
   - Accept connection or reject if invalid

4. **Implement disconnect handling**
   - Override disconnect method
   - Clean up any resources
   - Remove from channel groups
   - Log disconnection event

5. **Implement message receiving**
   - Override receive method
   - Parse JSON message from client
   - Validate message structure
   - Route to appropriate handler based on type

6. **Implement message sending**
   - Create method to send messages to client
   - Format messages as JSON
   - Include type and data fields
   - Add timestamps to all messages

7. **Add typing indicator support**
   - Implement typing event handler
   - Broadcast typing status to client
   - Auto-clear typing after response sent
   - Implement timeout for stuck typing state

8. **Integrate with chatbot service**
   - Call chatbot service from WebSocket handler
   - Process messages asynchronously
   - Send typing indicator while processing
   - Return response via WebSocket

9. **Implement channel groups**
   - Add connection to conversation group
   - Enable multi-user support (optional)
   - Broadcast updates to all participants
   - Handle group messaging properly

10. **Create frontend WebSocket client**
    - Navigate to `frontend/lib/chatbot/`
    - Create `websocket.ts` file
    - Implement WebSocketClient class
    - Handle connection, messages, errors

11. **Implement auto-reconnect**
    - Detect connection loss
    - Implement exponential backoff
    - Restore conversation state on reconnect
    - Notify user of connection status

### WebSocket URL Structure

| Pattern | Example |
|---------|---------|
| Development | ws://localhost:8000/ws/chat/{session_id}/ |
| Production | wss://api.domain.com/ws/chat/{session_id}/ |

### WebSocket Message Types

| Type | Direction | Purpose |
|------|-----------|---------|
| message | Client → Server | User sends message |
| response | Server → Client | Bot response |
| typing | Server → Client | Bot typing indicator |
| error | Server → Client | Error notification |
| status | Server → Client | Status update |
| ping | Bidirectional | Keep-alive |

### Message Format (Client → Server)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Message type ("message") |
| data | object | Yes | Message data |
| data.message | string | Yes | User message text |
| timestamp | string | Yes | ISO datetime |

### Message Format (Server → Client)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Event type |
| data | object | Yes | Event data |
| data.response | string | No | Bot response (if type=response) |
| data.intent | string | No | Detected intent |
| data.entities | array | No | Extracted entities |
| timestamp | string | Yes | ISO datetime |

### Connection Lifecycle

```
Client                          Server
  │                              │
  ├──── connect() ──────────────>│
  │                              ├─ validate session
  │                              ├─ authenticate user
  │<──── connected ──────────────┤
  │                              │
  ├──── message ────────────────>│
  │<──── typing ──────────────────┤
  │                              ├─ process message
  │<──── response ───────────────┤
  │                              │
  ├──── disconnect() ───────────>│
  │<──── disconnected ────────────┤
```

### Typing Indicator Flow

```
Timeline
├── [0s] User sends message
├── [0.1s] Server receives, sends "typing" event
├── [0.2s] Frontend displays typing indicator
├── [2s] LLM finishes processing
├── [2.1s] Server sends response
└── [2.2s] Frontend hides typing indicator
```

### Frontend WebSocketClient Structure

| Method | Purpose |
|--------|---------|
| connect(sessionId) | Establish WebSocket connection |
| disconnect() | Close connection gracefully |
| sendMessage(message) | Send user message |
| onMessage(callback) | Register message handler |
| onTyping(callback) | Register typing handler |
| onError(callback) | Register error handler |
| onStatusChange(callback) | Register status handler |

### Connection States

| State | Description | UI Indication |
|-------|-------------|---------------|
| connecting | Initiating connection | Loading spinner |
| connected | Active connection | Green indicator |
| disconnected | Connection closed | Gray indicator |
| reconnecting | Attempting reconnect | Yellow indicator |
| error | Connection failed | Red indicator |

### Error Handling

| Error Type | Cause | Action |
|------------|-------|--------|
| Connection Failed | Network issue | Auto-retry with backoff |
| Invalid Session | Session expired | Redirect to start |
| Authentication Failed | Token invalid | Redirect to login |
| Message Send Failed | Temporary error | Retry once, fallback to HTTP |
| Server Error | Backend issue | Show error, log to console |

### Auto-Reconnect Logic

| Attempt | Delay | Action |
|---------|-------|--------|
| 1 | 1 second | Immediate retry |
| 2 | 2 seconds | Wait and retry |
| 3 | 4 seconds | Wait and retry |
| 4 | 8 seconds | Wait and retry |
| 5+ | 10 seconds | Max backoff reached |
| After 5 | - | Give up, notify user |

### Expected Outcome
- Django Channels configured and running
- WebSocket consumer implemented
- Real-time message delivery working
- Typing indicators functional
- Frontend WebSocket client created
- Auto-reconnect implemented
- Connection state management working
- Error handling comprehensive

### Verification Checklist
- [ ] Django Channels installed and configured
- [ ] ASGI configuration created
- [ ] Channel layers configured
- [ ] ChatbotConsumer class implemented
- [ ] Connection/disconnect handlers working
- [ ] Message receiving functional
- [ ] Typing indicators implemented
- [ ] Frontend WebSocket client created
- [ ] Auto-reconnect working
- [ ] Error handling comprehensive
- [ ] WebSocket URL routing configured
- [ ] Real-time messaging tested

---

## Task 91: Create Integration Tests

### Overview
Create comprehensive end-to-end integration tests for the chatbot system. These tests verify that all components work together correctly, validate the complete user journey from conversation start to end, test intent classification and entity extraction accuracy, ensure WebSocket functionality, and confirm error handling across the system.

### Dependencies
- Task 90: Create WebSocket Support
- pytest and pytest-django installed
- Test database configured
- Django REST Framework test client available

### Instructions

1. **Set up test environment**
   - Navigate to `tests/chatbot/` directory
   - Create `test_chatbot_e2e.py` file
   - Import pytest and test utilities
   - Import chatbot models and services
   - Configure test fixtures

2. **Create test fixtures**
   - Create fixture for test tenant
   - Create fixture for test user with authentication
   - Create fixture for test customer
   - Create fixture for API client
   - Create fixture to clean up after tests

3. **Test conversation start flow**
   - Send POST to /api/chat/start/
   - Verify response includes session_id
   - Verify welcome message returned
   - Verify conversation created in database
   - Verify conversation status is "active"

4. **Test message sending flow**
   - Start conversation using fixture
   - Send POST to /api/chat/message/
   - Include valid session_id and message
   - Verify bot response received
   - Verify both messages saved in database
   - Verify response includes intent and entities

5. **Test intent classification**
   - Send greeting message ("hello")
   - Verify intent detected as "greeting"
   - Send order status query ("where is order #123")
   - Verify intent detected as "order_status"
   - Send product inquiry
   - Verify intent detected correctly

6. **Test entity extraction**
   - Send message with order number
   - Verify order_number entity extracted
   - Verify entity value matches expected
   - Send message with date
   - Verify date entity extracted
   - Test multiple entities in single message

7. **Test order status lookup flow**
   - Create test order in database
   - Send message: "Where is my order #[order_number]"
   - Verify intent is "order_status"
   - Verify order_number entity extracted
   - Verify response includes order status
   - Verify response formatted correctly

8. **Test escalation flow**
   - Start conversation
   - Send message: "I need to talk to a human"
   - Verify intent is "escalation"
   - Verify conversation status updated
   - Verify escalation flag set
   - Verify appropriate response received

9. **Test conversation history**
   - Start conversation and send several messages
   - Send GET to /api/chat/{session_id}/history/
   - Verify all messages returned
   - Verify messages in chronological order
   - Verify message count correct

10. **Test conversation end flow**
    - Start conversation
    - Send POST to /api/chat/{session_id}/end/
    - Include rating and feedback
    - Verify conversation status updated to "resolved"
    - Verify metrics calculated correctly
    - Verify rating saved

11. **Test WebSocket connection**
    - Establish WebSocket connection
    - Verify connection accepted
    - Send message via WebSocket
    - Verify response received via WebSocket
    - Verify typing indicator received
    - Close connection gracefully

12. **Test error handling**
    - Send message with invalid session_id (404)
    - Send message to ended conversation (400)
    - Send empty message (400)
    - Send overly long message (400)
    - Test rate limiting if configured

13. **Test edge cases**
    - Test concurrent messages
    - Test rapid message sending
    - Test very long conversation
    - Test special characters in messages
    - Test Unicode and emoji support

14. **Test tenant isolation**
    - Create conversations in different tenants
    - Verify cross-tenant access denied
    - Verify data isolated properly

### Test Structure

| Test Category | Test Count | Purpose |
|---------------|------------|---------|
| Conversation Flow | 3 | Start, message, end |
| Intent Classification | 6 | All intent types |
| Entity Extraction | 4 | All entity types |
| Business Logic | 3 | Order status, escalation, etc. |
| WebSocket | 4 | Real-time functionality |
| Error Handling | 5 | Edge cases and errors |
| Total | ~25 | Comprehensive coverage |

### Test Fixtures

| Fixture Name | Purpose |
|--------------|---------|
| test_tenant | Provides test tenant |
| test_user | Authenticated user |
| test_customer | Customer with orders |
| api_client | Authenticated API client |
| test_order | Order for status queries |
| test_conversation | Pre-started conversation |

### Intent Test Cases

| Test | Input | Expected Intent |
|------|-------|----------------|
| Greeting | "hi", "hello" | greeting |
| Order Status | "where is my order" | order_status |
| Product Inquiry | "tell me about X" | product_inquiry |
| Complaint | "I have a problem" | complaint |
| General | "what are your hours" | general_question |
| Escalation | "talk to human" | escalation |
| Farewell | "goodbye" | farewell |
| Unknown | "asdfgh" | fallback |

### Entity Test Cases

| Test | Input | Expected Entity | Expected Value |
|------|-------|-----------------|----------------|
| Order Number | "order #12345" | order_number | "12345" |
| Product Name | "Blue Widget" | product_name | "Blue Widget" |
| Date | "yesterday" | date | [calculated date] |
| Email | "test@example.com" | email | "test@example.com" |
| Multiple | "order #123 yesterday" | Both | Both values |

### Error Test Cases

| Test | Scenario | Expected Status | Expected Message |
|------|----------|----------------|------------------|
| Invalid Session | Non-existent session_id | 404 | "Conversation not found" |
| Ended Conversation | Message to ended chat | 400 | "Conversation has ended" |
| Empty Message | Empty message string | 400 | "Message cannot be empty" |
| Long Message | > 1000 characters | 400 | "Message too long" |
| Unauthorized | No auth token | 401 | "Authentication required" |

### Assertion Checklist

For each test, verify:
- [ ] Correct HTTP status code returned
- [ ] Response data structure matches expected
- [ ] Database records created/updated correctly
- [ ] Business logic executed properly
- [ ] Error messages are user-friendly
- [ ] Tenant isolation maintained

### Expected Outcome
- Comprehensive test suite covering all scenarios
- All tests passing consistently
- High code coverage (>80%)
- Edge cases and errors tested
- Integration between components verified
- Documentation of test scenarios

### Verification Checklist
- [ ] `tests/chatbot/test_chatbot_e2e.py` file created
- [ ] Test fixtures configured
- [ ] Conversation start test implemented
- [ ] Message sending test implemented
- [ ] Intent classification tests implemented
- [ ] Entity extraction tests implemented
- [ ] Order status flow test implemented
- [ ] Escalation flow test implemented
- [ ] History retrieval test implemented
- [ ] Conversation end test implemented
- [ ] WebSocket tests implemented
- [ ] Error handling tests implemented
- [ ] Edge case tests implemented
- [ ] Tenant isolation tests implemented
- [ ] All tests passing
- [ ] Coverage report generated

---

## Task 92: Create Documentation

### Overview
Create comprehensive documentation for the chatbot system, covering architecture, API reference, WebSocket protocol, intent and entity definitions, integration examples, troubleshooting guide, and best practices. This documentation serves as the primary reference for developers integrating with the chatbot, maintaining the system, and extending its capabilities.

### Dependencies
- Task 91: Create Integration Tests
- All previous tasks completed

### Instructions

1. **Create documentation directory**
   - Navigate to `docs/` directory in project root
   - Create `chatbot/` subdirectory
   - Create `README.md` as main documentation file
   - Create additional files for detailed sections

2. **Write system overview section**
   - Explain chatbot purpose and capabilities
   - Describe high-level architecture
   - List key features and benefits
   - Include system diagram showing components

3. **Document architecture**
   - Describe backend components (models, services, API)
   - Describe frontend components (client, types, UI)
   - Explain data flow through system
   - Show sequence diagrams for key operations

4. **Create API reference section**
   - Document each endpoint with full details
   - Include URL, HTTP method, authentication requirements
   - Show request format with all fields
   - Show response format with all fields
   - Provide example requests and responses

5. **Document WebSocket protocol**
   - Explain WebSocket connection process
   - Document all message types and formats
   - Show connection lifecycle diagram
   - Provide WebSocket usage examples
   - Document error scenarios

6. **Document intent system**
   - List all supported intents
   - Explain each intent's purpose
   - Provide example user inputs for each
   - Describe bot response patterns
   - Explain intent confidence scoring

7. **Document entity system**
   - List all entity types
   - Explain extraction patterns
   - Provide examples of each entity type
   - Document entity confidence scoring
   - Explain entity usage in responses

8. **Create integration guide**
   - Step-by-step guide to integrate chatbot
   - Frontend integration examples
   - Backend customization examples
   - Configuration options
   - Environment variables

9. **Write troubleshooting section**
   - Common issues and solutions
   - Debugging techniques
   - Log locations and formats
   - Performance optimization tips
   - FAQ section

10. **Add code examples**
    - Starting a conversation
    - Sending messages
    - Using WebSocket connection
    - Handling errors
    - Custom intent handlers

11. **Document testing approach**
    - How to run tests
    - How to add new tests
    - Test coverage expectations
    - Mock data for testing

12. **Create deployment guide**
    - Production configuration
    - WebSocket server setup (Daphne/Uvicorn)
    - Redis configuration for channels
    - Scaling considerations
    - Monitoring and logging

### Documentation Structure

```
docs/chatbot/
├── README.md                 # Main documentation
├── architecture.md           # System architecture
├── api-reference.md          # API endpoint details
├── websocket-guide.md        # WebSocket documentation
├── intents-entities.md       # Intent and entity reference
├── integration-guide.md      # Integration instructions
├── troubleshooting.md        # Common issues
└── deployment.md             # Production deployment
```

### README.md Sections

| Section | Content |
|---------|---------|
| Overview | System purpose and capabilities |
| Quick Start | Minimal setup to get started |
| Architecture | High-level system design |
| API Reference | Link to detailed API docs |
| WebSocket | Link to WebSocket guide |
| Intents & Entities | Link to intent/entity reference |
| Integration | Link to integration guide |
| Troubleshooting | Link to troubleshooting guide |
| Deployment | Link to deployment guide |

### API Reference Format

For each endpoint, document:

| Component | Description |
|-----------|-------------|
| Endpoint | Full URL path |
| Method | HTTP method (GET, POST, etc.) |
| Authentication | Required auth method |
| Headers | Required headers |
| Request Body | JSON structure with types |
| Response | JSON structure with types |
| Status Codes | Possible HTTP statuses |
| Errors | Error response format |
| Example | Complete request/response example |

### API Endpoints Table

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/chat/start/ | POST | Start new conversation |
| /api/chat/message/ | POST | Send message to bot |
| /api/chat/{id}/history/ | GET | Get conversation history |
| /api/chat/{id}/end/ | POST | End conversation |
| /ws/chat/{id}/ | WebSocket | Real-time messaging |

### Intent Reference Format

For each intent:

| Field | Content |
|-------|---------|
| Intent Name | Canonical name |
| Description | What triggers this intent |
| Example Inputs | 5-10 example user messages |
| Response Pattern | How bot responds |
| Entities | Related entities extracted |
| Follow-up | Typical follow-up questions |

### Supported Intents Table

| Intent | Example | Response Pattern |
|--------|---------|------------------|
| greeting | "hi", "hello" | Welcome message |
| order_status | "where's my order" | Order lookup and status |
| product_inquiry | "tell me about X" | Product information |
| complaint | "I have a problem" | Empathy + solution |
| general_question | "what are your hours" | FAQ response |
| escalation | "talk to human" | Transfer notification |
| farewell | "goodbye" | Closing message |
| fallback | [unknown] | Clarification request |

### Entity Reference Format

| Entity Type | Pattern | Example |
|-------------|---------|---------|
| order_number | #\d+ | "#12345" |
| product_name | Catalog match | "Blue Widget" |
| date | Date patterns | "yesterday", "Jan 15" |
| email | Email regex | "user@example.com" |
| phone | Phone regex | "+94771234567" |
| amount | Currency patterns | "$50", "Rs. 1000" |

### WebSocket Flow Diagram

```
Conversation Lifecycle via WebSocket

1. Frontend Initiates
   ├── Establish WS connection: ws://host/ws/chat/{session_id}/
   └── Server validates session and accepts

2. User Sends Message
   ├── Client: { type: "message", data: { message: "hello" } }
   ├── Server: { type: "typing" }
   ├── Server processes with LLM
   └── Server: { type: "response", data: { response: "Hi!" } }

3. Conversation Continues
   └── Repeat message/response cycle

4. Connection Closes
   ├── Client closes explicitly, OR
   ├── Server closes on conversation end, OR
   └── Connection timeout
```

### Integration Code Example Structure

Provide examples for:

| Example | Purpose |
|---------|---------|
| Start Conversation | Initialize chatbot |
| Send Message | User interaction |
| WebSocket Setup | Real-time connection |
| Error Handling | Graceful degradation |
| Custom Intent | Extend functionality |

### Troubleshooting Scenarios

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Connection Refused | WebSocket not running | Start Daphne/Uvicorn server |
| 401 Unauthorized | Invalid token | Check authentication |
| 404 Not Found | Invalid session | Verify session_id |
| Slow Responses | LLM latency | Optimize prompts, cache |
| Intent Misclassification | Training data | Add more examples |

### Deployment Checklist

| Step | Description |
|------|-------------|
| 1. Environment | Set production environment variables |
| 2. Database | Run migrations |
| 3. Static Files | Collect static files |
| 4. Redis | Configure Redis for channels |
| 5. ASGI Server | Deploy Daphne or Uvicorn |
| 6. Web Server | Configure Nginx/Apache |
| 7. SSL | Enable WSS (secure WebSocket) |
| 8. Monitoring | Set up logging and monitoring |

### Expected Outcome
- Comprehensive documentation covering all aspects
- Clear API reference with examples
- WebSocket protocol fully documented
- Intent and entity reference complete
- Integration guide for developers
- Troubleshooting guide for common issues
- Deployment guide for production

### Verification Checklist
- [ ] `docs/chatbot/README.md` created
- [ ] System overview written
- [ ] Architecture documented with diagrams
- [ ] API reference complete
- [ ] WebSocket guide created
- [ ] All intents documented
- [ ] All entities documented
- [ ] Integration guide written
- [ ] Code examples provided
- [ ] Troubleshooting section complete
- [ ] Deployment guide created
- [ ] Documentation reviewed for accuracy

---

## Summary

This document established the complete API infrastructure for the chatbot system, including RESTful endpoints for conversation management, message handling, and history retrieval. WebSocket support enables real-time communication with typing indicators and instant message delivery. TypeScript types ensure frontend type safety, while the API client provides a clean interface for React components. Comprehensive integration tests verify all functionality, and detailed documentation supports future development and maintenance.

### Completed Tasks
1. ✓ Created ChatbotViewSet with DRF for standardized API patterns
2. ✓ Created Start Conversation endpoint with session management
3. ✓ Created Send Message endpoint with intent/entity processing
4. ✓ Created Get History endpoint with pagination support
5. ✓ Created End Conversation endpoint with metrics calculation
6. ✓ Created TypeScript type definitions for frontend integration
7. ✓ Created API client library with error handling and retry logic
8. ✓ Created WebSocket support for real-time messaging
9. ✓ Created comprehensive integration tests for all scenarios
10. ✓ Created complete documentation for developers

### Next Steps
Proceed to [SubPhase-07_AI-Chatbot-Frontend](../../SubPhase-07_AI-Chatbot-Frontend/) to build the React-based chatbot user interface, including chat window, message display, input components, and WebSocket integration.
