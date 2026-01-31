# Tasks 12-16: Actions and Client

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** A - Chat State & Types  
> **Document:** 02 of 02  
> **Tasks Covered:** 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-11_Types-Store.md](01_Tasks-01-11_Types-Store.md)
- **→ Next Group:** [Group-B_Chat-Widget](../Group-B_Chat-Widget/)

---

## Document Overview

This document covers the creation of Zustand store actions and the Chat API client for the AI chatbot. It establishes the action methods for managing chat state, including adding messages, sending messages, clearing conversations, and creating a comprehensive API client for backend communication with proper error handling and state management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 12 | Create addMessage Action | Low | 15 min |
| 13 | Create sendMessage Action | Medium | 30 min |
| 14 | Create clearChat Action | Low | 10 min |
| 15 | Create Chat API Client | Medium | 45 min |
| 16 | Verify State | Low | 20 min |

---

## Task 12: Create addMessage Action

### Overview
Create the `addMessage` action in the Zustand chat store to add new messages to the messages array. This action serves as the foundation for all message operations, providing a centralized method to append messages while maintaining proper state immutability and type safety.

### Dependencies
- Task 11: Create conversationId State
- Message interface from types.ts
- Zustand store structure

### Instructions

1. **Navigate to the store file**
   - Open `frontend/lib/chat/store.ts`
   - Locate the store interface and implementation
   - Identify the messages state array

2. **Define addMessage action interface**
   - Add `addMessage` method to store interface
   - Define parameter type as `Message` from types
   - Return type should be void

3. **Implement addMessage action**
   - Use Zustand's set function to update state
   - Spread existing messages array to maintain immutability
   - Append new message to end of array
   - Ensure proper TypeScript typing

4. **Add message validation**
   - Check if message object has required fields
   - Validate message ID uniqueness
   - Ensure proper message role assignment
   - Handle timestamp assignment if missing

5. **Implement state side effects**
   - Update isTyping to false when assistant message added
   - Maintain conversation context
   - Preserve message ordering by timestamp

### Action Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| message | Message | Complete message object to add |

### Message Processing Flow

```
Input Message
     │
     ▼
Validate Fields
     │
     ▼
Check Uniqueness
     │
     ▼
Add Timestamp (if missing)
     │
     ▼
Append to Array
     │
     ▼
Update State
```

### State Updates

| State Field | Update Logic |
|-------------|--------------|
| messages | Append new message to array |
| isTyping | Set to false if assistant message |
| conversationId | Maintain existing value |

### Immutability Pattern

| Approach | Implementation |
|----------|----------------|
| Array Spread | `[...state.messages, message]` |
| State Update | `set((state) => ({ ...state, messages: newArray }))` |
| Type Safety | Ensure Message type compliance |

### Expected Outcome
- Functional addMessage action in Zustand store
- Proper state immutability maintained
- Message validation and ordering
- TypeScript type safety enforced

### Verification Checklist
- [ ] addMessage action defined in store interface
- [ ] Action implementation uses Zustand set function
- [ ] Message parameter properly typed as Message
- [ ] Array immutability maintained with spread operator
- [ ] Timestamp handling for messages
- [ ] isTyping state updated for assistant messages

---

## Task 13: Create sendMessage Action

### Overview
Create the `sendMessage` action that handles the complete message sending flow, including adding user message to state, calling the API client, handling responses, and updating state with assistant replies. This is the primary action for interactive chat functionality.

### Dependencies
- Task 12: Create addMessage Action
- Task 15: Create Chat API Client (implemented in parallel)
- MessageRole enum from types

### Instructions

1. **Define sendMessage action interface**
   - Add `sendMessage` method to store interface
   - Define parameter as `content: string`
   - Return type should be `Promise<void>`
   - Mark as async action

2. **Implement user message creation**
   - Generate unique message ID using crypto or UUID
   - Create Message object with user role
   - Set current timestamp
   - Set status as 'sending' initially

3. **Add user message to state**
   - Call addMessage action with user message
   - Update isTyping to true for loading indicator
   - Set conversation status if needed

4. **Handle conversation initialization**
   - Check if conversationId exists
   - Start new conversation if needed
   - Update conversationId in state
   - Handle session management

5. **Implement API call**
   - Import and use Chat API client
   - Send message content and conversation context
   - Handle streaming responses if applicable
   - Manage request timeout and errors

6. **Process API response**
   - Create assistant Message object from response
   - Generate unique ID for assistant message
   - Set proper timestamp and status
   - Add assistant message using addMessage action

7. **Handle error states**
   - Update user message status to 'error' on failure
   - Create error message for display
   - Reset isTyping state
   - Log errors for debugging

8. **Update loading states**
   - Set isTyping to false when complete
   - Update message status to 'sent' on success
   - Clear any pending operation flags

### Message Flow Sequence

```
User Input (content)
        │
        ▼
Create User Message
        │
        ▼
addMessage(userMsg)
        │
        ▼
Set isTyping = true
        │
        ▼
Check conversationId
        │
        ▼
API Call (sendMessage)
        │
   ┌────┴────┐
   ▼         ▼
Success    Error
   │         │
   ▼         ▼
Create     Update
Assistant  Status
Message    to Error
   │         │
   ▼         │
addMessage  │
   │         │
   └────┬────┘
        │
        ▼
Set isTyping = false
```

### API Integration Points

| Operation | API Method | Purpose |
|-----------|------------|---------|
| New Conversation | `client.startConversation()` | Initialize session |
| Send Message | `client.sendMessage()` | Send user message |
| Error Handling | Try-catch blocks | Manage failures |

### Error Handling Strategy

| Error Type | Handling |
|------------|----------|
| Network Error | Update message status, show error |
| API Error | Display error message, log details |
| Timeout | Retry logic, fallback message |
| Parse Error | Log error, show generic message |

### State Management During Send

| Phase | isTyping | Message Status | Action |
|-------|----------|----------------|--------|
| Start | true | sending | Add user message |
| Processing | true | sending | API call in progress |
| Success | false | sent | Add assistant response |
| Error | false | error | Update user message |

### Expected Outcome
- Complete message sending workflow
- Proper error handling and state management
- Integration with API client
- User feedback through loading states

### Verification Checklist
- [ ] sendMessage action defined as async function
- [ ] User message created with proper Message structure
- [ ] addMessage called to add user message
- [ ] isTyping state managed correctly
- [ ] Conversation initialization handled
- [ ] API client integration implemented
- [ ] Assistant response processed and added
- [ ] Error handling for all failure scenarios
- [ ] Loading states properly managed

---

## Task 14: Create clearChat Action

### Overview
Create the `clearChat` action to reset the chat state, clearing all messages and conversation context. This action provides users with a clean slate for starting new conversations and helps manage memory usage in the application.

### Dependencies
- Task 12: Create addMessage Action
- Chat store state structure

### Instructions

1. **Define clearChat action interface**
   - Add `clearChat` method to store interface
   - No parameters required
   - Return type should be void

2. **Implement state reset logic**
   - Clear messages array (set to empty array)
   - Reset conversationId to null
   - Set isTyping to false
   - Reset any conversation metadata

3. **Handle persistent state cleanup**
   - Clear localStorage if persistence is used
   - Reset any cached conversation data
   - Clear any pending API requests

4. **Add confirmation handling**
   - Consider optional confirmation parameter
   - Handle bulk operations if needed
   - Maintain state consistency

5. **Implement cleanup side effects**
   - Cancel any ongoing API requests
   - Clear timeouts or intervals
   - Reset any UI-specific state

### State Reset Operations

| State Field | Reset Value | Reason |
|-------------|-------------|--------|
| messages | `[]` | Remove all chat history |
| conversationId | `null` | End current conversation |
| isTyping | `false` | Clear loading indicators |
| isOpen | Maintain current | Keep widget state |

### Cleanup Sequence

```
clearChat() Called
        │
        ▼
Clear messages Array
        │
        ▼
Reset conversationId
        │
        ▼
Set isTyping = false
        │
        ▼
Clear localStorage
        │
        ▼
Cancel API Requests
        │
        ▼
State Reset Complete
```

### Memory Management

| Resource | Cleanup Action |
|----------|----------------|
| Messages Array | Set to empty array |
| API Requests | Cancel pending requests |
| Timers | Clear intervals/timeouts |
| Event Listeners | Remove if applicable |

### Optional Features

| Feature | Implementation |
|---------|----------------|
| Confirmation Dialog | Optional parameter for confirmation |
| Selective Clear | Keep last N messages |
| Backup | Store cleared messages temporarily |

### Expected Outcome
- Complete chat state reset functionality
- Proper cleanup of resources and memory
- Consistent state after clearing
- No memory leaks or hanging requests

### Verification Checklist
- [ ] clearChat action defined in store interface
- [ ] messages array properly reset to empty
- [ ] conversationId reset to null
- [ ] isTyping set to false
- [ ] localStorage cleared if used
- [ ] Pending API requests cancelled
- [ ] State consistency maintained

---

## Task 15: Create Chat API Client

### Overview
Create a comprehensive Chat API client that handles all backend communication for the chatbot, including conversation management, message sending, history retrieval, and proper error handling. The client provides a clean abstraction layer between the frontend state and backend API.

### Dependencies
- Task 14: Create clearChat Action
- Backend API endpoints (SubPhase-06)
- Message and Conversation types

### Instructions

1. **Create API client file structure**
   - Create `frontend/lib/chat/client.ts`
   - Define base API URL and configuration
   - Set up TypeScript interfaces for responses

2. **Define API response types**
   - Create interfaces for API responses
   - Define error response structure
   - Type conversation and message responses

3. **Implement base client configuration**
   - Set up fetch defaults and headers
   - Configure authentication token handling
   - Implement request/response interceptors

4. **Create startConversation method**
   - POST request to `/api/chat/start/`
   - Include user context and session info
   - Return conversation ID and initial data
   - Handle authentication requirements

5. **Implement sendMessage method**
   - POST request to `/api/chat/message/`
   - Send message content and conversation ID
   - Handle streaming responses if supported
   - Return assistant response message

6. **Create getHistory method**
   - GET request to `/api/chat/{id}/history/`
   - Retrieve conversation message history
   - Support pagination if needed
   - Return array of Message objects

7. **Implement endConversation method**
   - POST request to `/api/chat/{id}/end/`
   - Properly close conversation session
   - Clean up server-side resources
   - Return confirmation response

8. **Add comprehensive error handling**
   - Network error detection and handling
   - HTTP status code interpretation
   - API error message parsing
   - Retry logic for transient failures

9. **Implement request timeout handling**
   - Set reasonable timeout values
   - Handle timeout scenarios gracefully
   - Provide fallback responses

### API Client Structure

```
ChatAPIClient
├── Configuration
│   ├── baseURL
│   ├── headers
│   └── timeout
├── Methods
│   ├── startConversation()
│   ├── sendMessage()
│   ├── getHistory()
│   └── endConversation()
└── Error Handling
    ├── NetworkError
    ├── APIError
    └── TimeoutError
```

### API Endpoints Mapping

| Method | Endpoint | HTTP Method | Purpose |
|--------|----------|-------------|---------|
| startConversation | `/api/chat/start/` | POST | Initialize new conversation |
| sendMessage | `/api/chat/message/` | POST | Send user message |
| getHistory | `/api/chat/{id}/history/` | GET | Retrieve message history |
| endConversation | `/api/chat/{id}/end/` | POST | Close conversation |

### Request/Response Interfaces

| Interface | Usage | Fields |
|-----------|-------|--------|
| StartConversationRequest | New conversation | `{ sessionId?, metadata? }` |
| StartConversationResponse | Conversation data | `{ conversationId, sessionId, status }` |
| SendMessageRequest | Message sending | `{ conversationId, content, role }` |
| SendMessageResponse | Assistant reply | `{ message, status, conversationId }` |

### Error Handling Categories

| Error Type | Status Codes | Handling Strategy |
|------------|-------------|-------------------|
| Network | Connection failed | Retry with backoff |
| Authentication | 401, 403 | Redirect to login |
| Rate Limiting | 429 | Wait and retry |
| Server Error | 500+ | Show error message |
| Bad Request | 400-499 | Show validation errors |

### Retry Logic Implementation

```
Request Attempt
       │
       ▼
Network Call
       │
   ┌───┴───┐
   ▼       ▼
Success   Error
   │       │
   ▼       ▼
Return   Check Error Type
Result      │
           ├── Retryable?
           │      │
           │      ▼
           │   Wait & Retry
           │      │
           └── Non-retryable?
                  │
                  ▼
            Throw Error
```

### Authentication Integration

| Method | Authentication | Implementation |
|--------|----------------|----------------|
| Token Header | `Authorization: Bearer <token>` | Add to all requests |
| Session Cookie | Automatic | Include credentials |
| CSRF Token | `X-CSRFToken` header | Get from cookie/meta |

### Configuration Options

| Setting | Default | Purpose |
|---------|---------|---------|
| baseURL | `/api/chat` | API base endpoint |
| timeout | 30000ms | Request timeout |
| retryAttempts | 3 | Failed request retries |
| retryDelay | 1000ms | Delay between retries |

### Expected Outcome
- Complete API client with all required methods
- Robust error handling and retry logic
- Type-safe request/response handling
- Authentication and security integration

### Verification Checklist
- [ ] `frontend/lib/chat/client.ts` file created
- [ ] All four API methods implemented
- [ ] Request/response types properly defined
- [ ] Error handling for all scenarios
- [ ] Authentication token integration
- [ ] Timeout handling implemented
- [ ] Retry logic for failed requests
- [ ] TypeScript types for all interfaces
- [ ] Base configuration properly set up

---

## Task 16: Verify State

### Overview
Verify the complete chat state implementation by testing all actions, state updates, and API integrations. This task ensures that the Zustand store, actions, and API client work together correctly and handle all edge cases properly.

### Dependencies
- Task 15: Create Chat API Client
- All previous tasks in the group
- Complete store implementation

### Instructions

1. **Create verification test file**
   - Create `frontend/lib/chat/__tests__/store.test.ts`
   - Set up testing environment (Jest/Vitest)
   - Import all store functions and types

2. **Test initial state**
   - Verify default state values
   - Check state type definitions
   - Ensure proper initialization

3. **Test addMessage action**
   - Add user messages
   - Add assistant messages
   - Verify message ordering
   - Test message validation

4. **Test sendMessage action**
   - Mock API client responses
   - Test successful message sending
   - Verify error handling
   - Check loading states

5. **Test clearChat action**
   - Clear populated chat state
   - Verify all fields reset
   - Check cleanup operations

6. **Test API client integration**
   - Mock all API endpoints
   - Test success and error scenarios
   - Verify request formatting
   - Check response processing

7. **Test state persistence**
   - If localStorage is used, test persistence
   - Verify state restoration
   - Check migration handling

8. **Create manual verification checklist**
   - Define user scenarios to test
   - Create step-by-step verification
   - Document expected behaviors

### Test Categories

| Category | Tests | Coverage |
|----------|-------|----------|
| Initial State | Default values, types | Store initialization |
| Actions | All action functions | State mutations |
| API Integration | Client methods, mocking | External communication |
| Error Handling | Failed scenarios | Resilience |
| Edge Cases | Empty states, invalid data | Robustness |

### State Verification Points

```
Initial State Check
        │
        ▼
Add Message Test
        │
        ▼
Send Message Test
        │
        ▼
Clear Chat Test
        │
        ▼
API Client Test
        │
        ▼
Error Scenarios
        │
        ▼
Integration Test
        │
        ▼
Manual Verification
```

### Manual Verification Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Fresh Start | Open app, check initial state | Empty messages, closed chat |
| Send Message | Type message, send | User message added, API called |
| Receive Reply | Wait for response | Assistant message added |
| Clear Chat | Click clear button | All messages removed |
| Error Handling | Simulate network error | Error message shown |

### Automated Test Structure

| Test Suite | Test Cases | Purpose |
|------------|------------|---------|
| Store Tests | Initial state, actions | Unit testing |
| API Tests | Client methods, responses | Integration testing |
| Error Tests | Failure scenarios | Error handling |
| Flow Tests | Complete workflows | End-to-end testing |

### Verification Checklist Items

| Component | Verification Points |
|-----------|-------------------|
| Types | All interfaces compile, no TypeScript errors |
| Store | Initial state correct, actions work |
| Actions | State updates properly, side effects handled |
| API Client | All methods functional, errors handled |
| Integration | Store and client work together |

### Performance Verification

| Metric | Target | Test Method |
|--------|--------|-------------|
| State Updates | < 16ms | Performance timing |
| API Calls | < 2s response | Network monitoring |
| Memory Usage | No leaks | Memory profiling |
| Bundle Size | < 50KB | Build analysis |

### Expected Outcome
- Complete verification of chat state system
- All tests passing with good coverage
- Manual verification scenarios documented
- Performance benchmarks met

### Verification Checklist
- [ ] Test file created with comprehensive coverage
- [ ] Initial state verification passes
- [ ] addMessage action tests pass
- [ ] sendMessage action tests pass
- [ ] clearChat action tests pass
- [ ] API client tests pass with mocked responses
- [ ] Error handling scenarios covered
- [ ] Manual verification scenarios documented
- [ ] Performance benchmarks measured
- [ ] No TypeScript compilation errors
- [ ] All state transitions work correctly
- [ ] Integration between store and API client verified

---

## Summary

This document completed the chat state actions and API client implementation, providing a robust foundation for the AI chatbot frontend. The implementation includes comprehensive state management with Zustand, proper error handling, and a full-featured API client for backend communication.

### Completed Tasks
1. ✓ Created addMessage action for state updates
2. ✓ Created sendMessage action with complete flow
3. ✓ Created clearChat action for state reset
4. ✓ Created Chat API client with all endpoints
5. ✓ Verified state implementation and integration

### Key Deliverables
- Zustand store actions for message management
- Complete API client with error handling
- State verification and testing approach
- Integration between frontend state and backend API

### Next Steps
Proceed to [Group-B_Chat-Widget](../Group-B_Chat-Widget/) to create the chat widget UI components, including the chat container, message list, input form, and floating action button.