# Tasks 01-11: Types and Store Creation

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** A - Chat State & Types  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-12-16_Actions-Client.md](02_Tasks-12-16_Actions-Client.md)

---

## Document Overview

This document covers the creation of TypeScript type definitions and Zustand store structure for the AI chatbot functionality. It establishes the foundational type system including Message Interface, Conversation Interface, QuickReply Interface, enums for chat status and message roles, and the core Zustand store with essential state properties for managing chat sessions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Chat Types | Medium | 30 min |
| 02 | Create Message Interface | Low | 15 min |
| 03 | Create Conversation Interface | Low | 20 min |
| 04 | Create QuickReply Interface | Low | 10 min |
| 05 | Create ChatStatus Enum | Low | 10 min |
| 06 | Create MessageRole Enum | Low | 10 min |
| 07 | Create Chat Store | Medium | 25 min |
| 08 | Create messages State | Low | 15 min |
| 09 | Create isOpen State | Low | 10 min |
| 10 | Create isTyping State | Low | 10 min |
| 11 | Create conversationId State | Low | 15 min |

---

## Task 01: Create Chat Types

### Overview
Create the foundational TypeScript types file for the AI chatbot system. This file serves as the central type definition hub containing all interfaces, enums, and utility types that will be used throughout the chat functionality. The types file ensures type safety and consistent data structures across the chatbot implementation.

### Dependencies
- SubPhase-06 (AI Chatbot Backend) must be complete
- Frontend project structure is established
- TypeScript configuration is properly set up

### Instructions

1. **Create chat types directory structure**
   - Navigate to `frontend/lib/` directory
   - Create new directory named `chat` if it doesn't exist
   - This will house all chat-related utility files

2. **Create types.ts file**
   - Create `types.ts` file in `frontend/lib/chat/` directory
   - Add file header comment with purpose description
   - Set up proper TypeScript module structure

3. **Define file organization structure**
   - Plan sections for interfaces, enums, and utility types
   - Add comments to separate different type categories
   - Prepare for export statements at the end

4. **Add base type imports**
   - Import necessary utility types if needed
   - Consider React types if components will use these types
   - Set up any third-party type dependencies

5. **Create type export strategy**
   - Plan named exports for all types
   - Consider creating a main export object
   - Ensure all types are accessible from other modules

6. **Add TypeScript configurations**
   - Ensure strict type checking compatibility
   - Add JSDoc comments for better developer experience
   - Set up proper module resolution

### File Structure Planning

```
frontend/lib/chat/types.ts
├── File Header Comment
├── Imports Section
├── Enums Section
├── Base Interfaces Section
├── Complex Interfaces Section
├── Utility Types Section
└── Export Statements
```

### Type Organization Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Enums | Fixed value sets | MessageRole, ChatStatus |
| Base Interfaces | Core data structures | Message, QuickReply |
| Complex Interfaces | Composite structures | Conversation |
| Utility Types | Helper types | ChatState, Actions |

### Export Strategy

| Export Type | Usage | Benefit |
|-------------|-------|---------|
| Named Exports | Individual types | Tree-shaking friendly |
| Namespace Export | Grouped access | Organized imports |
| Re-exports | From other modules | Centralized access |

### TypeScript Best Practices

| Practice | Implementation |
|----------|----------------|
| Strict Types | No `any` types |
| Optional Properties | Use `?` appropriately |
| Readonly Arrays | `readonly T[]` for immutable data |
| Generic Constraints | Proper type bounds |
| JSDoc Comments | Documentation strings |

### Expected Outcome
- Well-organized types file with clear structure
- Proper TypeScript module setup
- Foundation for all subsequent type definitions
- Exportable types for use across the chat system

### Verification Checklist
- [ ] `frontend/lib/chat/types.ts` file created
- [ ] File header comment added
- [ ] Proper module structure established
- [ ] Export strategy planned
- [ ] TypeScript strict mode compatible
- [ ] Ready for interface and enum definitions

---

## Task 02: Create Message Interface

### Overview
Define the Message interface that represents individual chat messages within conversations. This interface captures all essential properties of a chat message including unique identification, role classification, content, timestamps, and delivery status tracking.

### Dependencies
- Task 01: Create Chat Types

### Instructions

1. **Define Message interface structure**
   - Add Message interface to the types.ts file
   - Use clear, descriptive property names
   - Ensure all required fields are included

2. **Add message identification fields**
   - Include `id` property as string for unique identification
   - Consider UUID format for message IDs
   - Ensure ID uniqueness across the application

3. **Define message role classification**
   - Add `role` property using MessageRole enum
   - Support user, assistant, and system message types
   - Ensure proper role assignment for message flow

4. **Add content and metadata fields**
   - Include `content` property as string for message text
   - Add `timestamp` property as Date for timing information
   - Consider additional metadata fields if needed

5. **Define message status tracking**
   - Add `status` property for delivery status
   - Support 'sending', 'sent', and 'error' states
   - Enable proper UI feedback for message states

6. **Add optional properties**
   - Consider optional fields for future extensibility
   - Include properties for attachments or rich content
   - Plan for message threading or replies

7. **Apply TypeScript best practices**
   - Use proper type annotations
   - Add JSDoc comments for documentation
   - Ensure interface is exportable

### Message Interface Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique message identifier |
| role | MessageRole | Yes | Message sender role |
| content | string | Yes | Message text content |
| timestamp | Date | Yes | Message creation time |
| status | MessageStatus | Yes | Delivery status |

### Message Status States

| Status | Description | UI Indication |
|--------|-------------|---------------|
| sending | Message being sent | Loading spinner |
| sent | Successfully delivered | Checkmark |
| error | Delivery failed | Error icon |

### Message Role Usage

| Role | Purpose | Display Style |
|------|---------|---------------|
| USER | User input messages | Right-aligned bubble |
| ASSISTANT | AI responses | Left-aligned bubble |
| SYSTEM | System notifications | Centered message |

### Interface Structure Example

```
interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}
```

### Future Extensibility Considerations

| Feature | Property | Type |
|---------|----------|------|
| Attachments | attachments? | Attachment[] |
| Reactions | reactions? | Reaction[] |
| Replies | replyTo? | string |
| Metadata | metadata? | Record<string, any> |

### Expected Outcome
- Complete Message interface definition
- Proper type safety for message objects
- Support for all message lifecycle states
- Foundation for message-related components

### Verification Checklist
- [ ] Message interface added to types.ts
- [ ] All required properties defined
- [ ] MessageRole enum referenced correctly
- [ ] Status property supports all states
- [ ] Timestamp uses Date type
- [ ] JSDoc comments added
- [ ] Interface exported properly

---

## Task 03: Create Conversation Interface

### Overview
Define the Conversation interface that represents a complete chat session between a user and the AI assistant. This interface encapsulates conversation metadata, session tracking, status management, and the collection of messages that make up the conversation history.

### Dependencies
- Task 01: Create Chat Types
- Task 02: Create Message Interface

### Instructions

1. **Define Conversation interface structure**
   - Add Conversation interface to types.ts file
   - Build upon Message interface for message array
   - Include comprehensive session metadata

2. **Add conversation identification**
   - Include `id` property as string for unique identification
   - Add `sessionId` property as string for session tracking
   - Use UUID format for both identifiers

3. **Define conversation status management**
   - Add `status` property with union type
   - Support 'active', 'resolved', and 'escalated' states
   - Enable proper conversation lifecycle management

4. **Add temporal tracking properties**
   - Include `startedAt` property as Date for session start
   - Consider `endedAt` optional property for completion
   - Add `lastMessageAt` for activity tracking

5. **Define message collection**
   - Add `messages` property as Message array
   - Ensure proper typing with Message interface
   - Support empty array for new conversations

6. **Add optional metadata fields**
   - Consider `title` property for conversation naming
   - Include `tags` array for categorization
   - Add `priority` for escalation handling

7. **Apply interface best practices**
   - Use readonly arrays where appropriate
   - Add comprehensive JSDoc documentation
   - Ensure proper export configuration

### Conversation Interface Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique conversation ID |
| sessionId | string | Yes | Session UUID |
| status | ConversationStatus | Yes | Current conversation state |
| startedAt | Date | Yes | Conversation start time |
| messages | Message[] | Yes | Array of conversation messages |
| endedAt | Date \| null | No | Conversation end time |
| title | string \| null | No | Conversation title |
| tags | string[] | No | Categorization tags |

### Conversation Status States

| Status | Description | UI Indication |
|--------|-------------|---------------|
| active | Ongoing conversation | Active chat indicator |
| resolved | Successfully completed | Resolved badge |
| escalated | Transferred to human | Escalation notice |

### Conversation Lifecycle

```
New Conversation
      │
      ▼
   Active ────┬──► Resolved
      │       │
      │       └──► Escalated
      ▼
  (Timeout)
```

### Message Array Specifications

| Aspect | Implementation |
|--------|----------------|
| Type | `Message[]` |
| Initial State | Empty array `[]` |
| Ordering | Chronological (oldest first) |
| Mutability | Mutable for adding messages |

### Session Management Fields

| Field | Purpose | Format |
|-------|---------|---------|
| id | Conversation identification | UUID v4 |
| sessionId | Browser session tracking | UUID v4 |
| startedAt | Conversation timestamp | ISO Date |
| endedAt | Completion timestamp | ISO Date or null |

### Expected Outcome
- Complete Conversation interface definition
- Proper integration with Message interface
- Support for conversation lifecycle management
- Foundation for conversation history features

### Verification Checklist
- [ ] Conversation interface added to types.ts
- [ ] All required properties defined
- [ ] Message[] array properly typed
- [ ] Status union type implemented
- [ ] Date properties use Date type
- [ ] Optional properties marked correctly
- [ ] JSDoc documentation added
- [ ] Interface exported properly

---

## Task 04: Create QuickReply Interface

### Overview
Define the QuickReply interface for predefined response buttons that help users quickly respond to common questions or navigate conversation flows. These quick replies enhance user experience by providing contextual shortcuts for frequent interactions.

### Dependencies
- Task 01: Create Chat Types

### Instructions

1. **Define QuickReply interface structure**
   - Add QuickReply interface to types.ts file
   - Keep interface simple and focused
   - Enable easy integration with UI components

2. **Add identification properties**
   - Include `id` property as string for unique identification
   - Use consistent ID format across the application
   - Ensure IDs are unique within reply sets

3. **Define display properties**
   - Add `text` property as string for button display
   - Include clear, concise button labels
   - Support internationalization if needed

4. **Add value properties**
   - Include `value` property as string for actual message
   - Support different display text vs sent value
   - Enable complex value structures if needed

5. **Add optional metadata**
   - Consider `category` for reply grouping
   - Include `order` for display sequence
   - Add `disabled` state for conditional replies

6. **Define reply collections**
   - Create QuickReplySet type for grouping
   - Support conditional reply visibility
   - Enable context-aware reply suggestions

7. **Apply interface standards**
   - Use clear property naming
   - Add JSDoc documentation
   - Ensure proper TypeScript typing

### QuickReply Interface Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique reply identifier |
| text | string | Yes | Display text on button |
| value | string | Yes | Message value to send |
| category | string | No | Reply category |
| order | number | No | Display order |
| disabled | boolean | No | Disabled state |

### QuickReply Usage Examples

| Scenario | Text | Value |
|----------|------|-------|
| Greeting | "Hello" | "Hello, I need help with..." |
| Support | "Technical Issue" | "I'm experiencing a technical problem" |
| Information | "Pricing" | "Can you tell me about your pricing?" |
| Navigation | "Main Menu" | "/menu" |

### QuickReply Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| greeting | Initial interactions | Hello, Hi, Good morning |
| support | Help requests | Technical, Billing, General |
| navigation | Menu options | Products, Services, Contact |
| feedback | Response collection | Yes, No, Maybe |

### Display Order Specifications

| Order | Priority | Usage |
|-------|----------|-------|
| 1-10 | High priority | Primary actions |
| 11-20 | Medium priority | Secondary options |
| 21+ | Low priority | Additional choices |

### QuickReplySet Type Definition

```
type QuickReplySet = {
  context: string;
  replies: QuickReply[];
  maxDisplay?: number;
};
```

### Conditional Reply Logic

| Condition | Implementation |
|-----------|----------------|
| User State | Based on authentication |
| Conversation Stage | Based on message history |
| Time Context | Based on business hours |
| Category Filter | Based on current topic |

### Expected Outcome
- Complete QuickReply interface definition
- Support for various reply scenarios
- Foundation for interactive chat buttons
- Extensible structure for future enhancements

### Verification Checklist
- [ ] QuickReply interface added to types.ts
- [ ] All required properties defined
- [ ] Optional properties marked correctly
- [ ] Property types properly specified
- [ ] JSDoc documentation added
- [ ] Interface exported properly
- [ ] Compatible with UI button components

---

## Task 05: Create ChatStatus Enum

### Overview
Define the ChatStatus enum that represents the different visual and functional states of the chat widget. This enum controls the chat interface behavior, determining whether the chat is closed, minimized, or fully open for user interaction.

### Dependencies
- Task 01: Create Chat Types

### Instructions

1. **Define ChatStatus enum structure**
   - Add ChatStatus enum to types.ts file
   - Use descriptive, clear enum values
   - Ensure consistent naming convention

2. **Define closed state**
   - Add `CLOSED` value for hidden chat widget
   - Represents completely hidden chat interface
   - No chat UI elements visible to user

3. **Define minimized state**
   - Add `MINIMIZED` value for collapsed chat widget
   - Shows chat icon/button but not conversation
   - Allows user to quickly access chat

4. **Define open state**
   - Add `OPEN` value for fully expanded chat widget
   - Shows complete chat interface and conversation
   - Enables full user interaction

5. **Apply enum best practices**
   - Use uppercase naming convention
   - Add JSDoc documentation for each value
   - Consider numeric or string enum values

6. **Define state transitions**
   - Document valid state transitions
   - Define rules for state changes
   - Ensure logical progression between states

7. **Plan integration usage**
   - Consider how UI components will use enum
   - Plan for state management integration
   - Ensure compatibility with store actions

### ChatStatus Enum Values

| Value | Description | UI State |
|-------|-------------|----------|
| CLOSED | Chat completely hidden | No visible chat elements |
| MINIMIZED | Chat collapsed to icon | Chat button/icon visible |
| OPEN | Chat fully expanded | Full conversation interface |

### State Transition Rules

```
CLOSED ←──────────────────────→ MINIMIZED
    ↑                              ↓
    │                              │
    └──────────── OPEN ←───────────┘
```

### State Transition Matrix

| From | To | Trigger |
|------|----|---------| 
| CLOSED | MINIMIZED | User preference/session |
| CLOSED | OPEN | Direct chat activation |
| MINIMIZED | OPEN | User clicks chat icon |
| MINIMIZED | CLOSED | User closes chat |
| OPEN | MINIMIZED | User minimizes chat |
| OPEN | CLOSED | User closes chat |

### UI Behavior by Status

| Status | Chat Button | Chat Window | Animations |
|--------|-------------|-------------|------------|
| CLOSED | Hidden | Hidden | Fade out |
| MINIMIZED | Visible | Hidden | Slide in/out |
| OPEN | Visible | Visible | Expand/collapse |

### Storage and Persistence

| Status | Persist | Reason |
|--------|---------|--------|
| CLOSED | No | Should start fresh |
| MINIMIZED | Yes | User preference |
| OPEN | Optional | User experience |

### Default State Strategy

| Context | Default | Reasoning |
|---------|---------|-----------|
| New Visitor | CLOSED | Non-intrusive |
| Returning User | MINIMIZED | Available but not intrusive |
| Active Conversation | OPEN | Continue conversation |

### Expected Outcome
- Well-defined ChatStatus enum
- Clear state transition rules
- Foundation for chat widget behavior
- Consistent state management approach

### Verification Checklist
- [ ] ChatStatus enum added to types.ts
- [ ] All three states defined (CLOSED, MINIMIZED, OPEN)
- [ ] Uppercase naming convention used
- [ ] JSDoc documentation added
- [ ] State transitions documented
- [ ] Enum exported properly
- [ ] Compatible with store implementation

---

## Task 06: Create MessageRole Enum

### Overview
Define the MessageRole enum that classifies the different types of message senders in chat conversations. This enum distinguishes between user messages, AI assistant responses, and system notifications, enabling proper message styling and handling throughout the chat interface.

### Dependencies
- Task 01: Create Chat Types

### Instructions

1. **Define MessageRole enum structure**
   - Add MessageRole enum to types.ts file
   - Use clear, descriptive enum values
   - Follow consistent naming conventions

2. **Define user role**
   - Add `USER` value for human user messages
   - Represents messages sent by the chat user
   - Typically displayed on right side of chat

3. **Define assistant role**
   - Add `ASSISTANT` value for AI responses
   - Represents messages from the AI chatbot
   - Typically displayed on left side of chat

4. **Define system role**
   - Add `SYSTEM` value for system notifications
   - Represents automated system messages
   - Used for status updates and notifications

5. **Apply enum naming standards**
   - Use uppercase convention for enum values
   - Add comprehensive JSDoc documentation
   - Consider future role extensions

6. **Define role characteristics**
   - Document styling differences per role
   - Define interaction capabilities
   - Plan for role-specific features

7. **Ensure type integration**
   - Verify compatibility with Message interface
   - Plan for conditional rendering logic
   - Consider role-based permissions

### MessageRole Enum Values

| Value | Description | Message Source |
|-------|-------------|----------------|
| USER | Human user input | Chat input field |
| ASSISTANT | AI bot response | Backend API |
| SYSTEM | System notification | Application logic |

### Role Display Characteristics

| Role | Alignment | Background Color | Text Color |
|------|-----------|------------------|------------|
| USER | Right | Blue | White |
| ASSISTANT | Left | Gray | Dark |
| SYSTEM | Center | Yellow/Orange | Dark |

### Role-Specific Features

| Role | Features | Capabilities |
|------|----------|--------------|
| USER | Edit, delete, copy | Full user control |
| ASSISTANT | Copy, feedback | Read-only, reactions |
| SYSTEM | Dismiss | Limited interaction |

### Message Flow Pattern

```
USER: "Hello, I need help"
     │
     ▼
SYSTEM: "Connecting to AI assistant..."
     │
     ▼
ASSISTANT: "Hello! How can I help you today?"
```

### Role Usage Guidelines

| Role | When to Use | Examples |
|------|-------------|----------|
| USER | User input messages | Questions, commands, responses |
| ASSISTANT | AI generated content | Answers, suggestions, clarifications |
| SYSTEM | Application notifications | Connection status, errors, confirmations |

### Conditional Rendering Logic

| Role | Show Avatar | Show Actions | Show Timestamp |
|------|-------------|-------------- |----------------|
| USER | Optional | Edit, delete | Always |
| ASSISTANT | Yes | Copy, react | Always |
| SYSTEM | No | Dismiss | Optional |

### Styling Class Mapping

| Role | CSS Class | Tailwind Example |
|------|-----------|------------------|
| USER | `.message-user` | `bg-blue-500 text-white ml-auto` |
| ASSISTANT | `.message-assistant` | `bg-gray-200 text-gray-900 mr-auto` |
| SYSTEM | `.message-system` | `bg-yellow-100 text-center mx-auto` |

### Expected Outcome
- Complete MessageRole enum definition
- Clear role differentiation and usage
- Foundation for message display logic
- Support for role-based styling and features

### Verification Checklist
- [ ] MessageRole enum added to types.ts
- [ ] USER, ASSISTANT, and SYSTEM values defined
- [ ] Uppercase naming convention used
- [ ] JSDoc documentation added
- [ ] Role characteristics documented
- [ ] Enum exported properly
- [ ] Compatible with Message interface

---

## Task 07: Create Chat Store

### Overview
Create the central Zustand store for chat state management. This store serves as the single source of truth for all chat-related state, including messages, UI status, and conversation tracking. The store provides reactive state management with proper TypeScript integration.

### Dependencies
- Task 06: Create MessageRole Enum
- Zustand library installation

### Instructions

1. **Create store.ts file**
   - Create `store.ts` file in `frontend/lib/chat/` directory
   - Import Zustand and required types
   - Set up proper TypeScript module structure

2. **Import required dependencies**
   - Import `create` from 'zustand'
   - Import types from './types'
   - Import additional utilities as needed

3. **Define ChatState interface**
   - Create interface defining all store state
   - Include state properties and actions
   - Ensure proper TypeScript typing

4. **Define store configuration**
   - Set up Zustand store with proper typing
   - Configure persistence if needed
   - Plan for middleware integration

5. **Initialize default state values**
   - Set appropriate default values for all state
   - Ensure consistency with type definitions
   - Consider user experience for initial state

6. **Plan action method structure**
   - Prepare space for action methods
   - Define method signatures in interface
   - Plan for async action support

7. **Configure store export**
   - Export store hook for component usage
   - Ensure proper TypeScript inference
   - Plan for store debugging and dev tools

### Chat Store Structure

```
useChatStore
├── State Properties
│   ├── messages: Message[]
│   ├── isOpen: boolean
│   ├── isTyping: boolean
│   └── conversationId: string | null
└── Actions (planned for Tasks 8-11)
    ├── addMessage
    ├── sendMessage
    └── clearChat
```

### ChatState Interface Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| messages | Message[] | [] | Chat message history |
| isOpen | boolean | false | Chat widget visibility |
| isTyping | boolean | false | AI typing indicator |
| conversationId | string \| null | null | Current conversation ID |

### Store Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| Persistence | localStorage | Maintain chat across sessions |
| DevTools | Enabled | Development debugging |
| Middleware | Immer | Immutable updates |
| Subscriptions | Enabled | Component reactivity |

### Store Architecture Pattern

```
Component ←→ useChatStore ←→ Actions ←→ API
    ↓             ↓           ↓        ↓
   UI          State      Business   Backend
 Updates      Changes     Logic      Data
```

### TypeScript Store Typing

| Aspect | Implementation |
|--------|----------------|
| State Interface | ChatState |
| Store Hook | UseBoundStore<ChatState> |
| Action Parameters | Typed function parameters |
| Return Types | Inferred from actions |

### Default State Initialization

| State | Default | Reasoning |
|-------|---------|-----------|
| messages | `[]` | No conversation history |
| isOpen | `false` | Non-intrusive start |
| isTyping | `false` | No AI activity |
| conversationId | `null` | No active conversation |

### Store Hook Usage Pattern

```
const {
  messages,
  isOpen,
  isTyping,
  conversationId,
  // actions will be added in subsequent tasks
} = useChatStore();
```

### Expected Outcome
- Functional Zustand store for chat state
- Proper TypeScript integration
- Default state initialization
- Foundation for state actions

### Verification Checklist
- [ ] `frontend/lib/chat/store.ts` file created
- [ ] Zustand create function imported
- [ ] ChatState interface defined
- [ ] Store hook exported properly
- [ ] Default values configured
- [ ] TypeScript types properly applied
- [ ] Ready for action methods

---

## Task 08: Create messages State

### Overview
Implement the messages state property within the Chat Store that maintains an array of Message objects representing the complete conversation history. This state enables real-time message display, conversation persistence, and chat history management.

### Dependencies
- Task 07: Create Chat Store
- Task 02: Create Message Interface

### Instructions

1. **Define messages property in ChatState**
   - Add `messages` property to ChatState interface
   - Type as `Message[]` array
   - Include JSDoc documentation

2. **Initialize default messages state**
   - Set default value as empty array `[]`
   - Ensure consistent typing with interface
   - Consider persistence restoration

3. **Plan message ordering strategy**
   - Determine chronological order (oldest first)
   - Ensure consistent message sequence
   - Support for message insertion

4. **Define message array operations**
   - Plan for append operations (new messages)
   - Consider bulk loading for history
   - Support for message updates and deletions

5. **Implement array immutability**
   - Use proper immutable update patterns
   - Consider Immer middleware for complex updates
   - Ensure proper React re-rendering

6. **Add array length management**
   - Consider maximum message history
   - Plan for memory management
   - Implement cleanup strategies if needed

7. **Configure array indexing**
   - Enable efficient message lookup by ID
   - Support for message search and filtering
   - Plan for performance optimization

### Messages State Specifications

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| messages | Message[] | [] | Array of conversation messages |

### Message Array Structure

```
messages: [
  {
    id: "msg-001",
    role: MessageRole.USER,
    content: "Hello",
    timestamp: Date,
    status: "sent"
  },
  {
    id: "msg-002", 
    role: MessageRole.ASSISTANT,
    content: "Hi! How can I help?",
    timestamp: Date,
    status: "sent"
  }
]
```

### Message Ordering Rules

| Rule | Implementation | Benefit |
|------|----------------|---------|
| Chronological | Oldest messages first | Natural conversation flow |
| Immutable | New array on updates | Proper React rendering |
| Indexed | Map by ID for lookup | Performance optimization |

### Array Operations Support

| Operation | Method | Use Case |
|-----------|--------|----------|
| Append | push() | New messages |
| Prepend | unshift() | Historical loading |
| Update | map() | Status changes |
| Remove | filter() | Message deletion |
| Clear | set([]) | Conversation reset |

### Memory Management Strategy

| Aspect | Strategy | Implementation |
|--------|----------|----------------|
| Max Length | 1000 messages | Trim oldest when exceeded |
| Persistence | localStorage | Save/restore on load |
| Cleanup | On conversation end | Clear old conversations |

### Message Array Performance

| Concern | Solution |
|---------|----------|
| Large Arrays | Virtual scrolling in UI |
| Frequent Updates | Debounced re-renders |
| Memory Usage | Pagination for history |
| Search Performance | Indexed message lookup |

### State Update Patterns

| Pattern | Usage |
|---------|-------|
| Append Message | `set(state => ({ messages: [...state.messages, newMessage] }))` |
| Update Status | `set(state => ({ messages: state.messages.map(m => m.id === id ? {...m, status} : m) }))` |
| Clear All | `set({ messages: [] })` |

### Expected Outcome
- Properly typed messages array state
- Efficient message storage and retrieval
- Foundation for conversation display
- Support for message management operations

### Verification Checklist
- [ ] messages property added to ChatState interface
- [ ] Property typed as Message[]
- [ ] Default value set to empty array
- [ ] JSDoc documentation added
- [ ] Array operations planned
- [ ] Performance considerations addressed
- [ ] Ready for message actions implementation

---

## Task 09: Create isOpen State

### Overview
Implement the isOpen boolean state property that controls the visibility and expansion state of the chat widget. This state determines whether the chat interface is fully expanded and visible to users, enabling proper UI state management and user experience control.

### Dependencies
- Task 07: Create Chat Store
- Task 05: Create ChatStatus Enum

### Instructions

1. **Define isOpen property in ChatState**
   - Add `isOpen` property to ChatState interface
   - Type as boolean value
   - Include descriptive JSDoc documentation

2. **Initialize default isOpen state**
   - Set default value to `false`
   - Ensure non-intrusive initial state
   - Consider user preference restoration

3. **Define state behavior mapping**
   - Map isOpen to ChatStatus enum values
   - Plan relationship with chat visibility
   - Ensure consistent state representation

4. **Plan state transition logic**
   - Define conditions for opening chat
   - Handle closing chat scenarios
   - Support programmatic state changes

5. **Consider persistence strategy**
   - Decide if state should persist across sessions
   - Plan for user preference storage
   - Handle restoration on page load

6. **Plan UI integration**
   - Define how components read this state
   - Plan for conditional rendering
   - Support for animation triggers

7. **Add state validation**
   - Ensure boolean type consistency
   - Handle edge cases gracefully
   - Plan for error recovery

### isOpen State Specifications

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| isOpen | boolean | false | Chat widget visibility state |

### State Mapping Relationship

| isOpen | ChatStatus | UI State |
|--------|------------|----------|
| false | CLOSED/MINIMIZED | Chat hidden or minimized |
| true | OPEN | Chat fully expanded |

### State Transition Triggers

| Trigger | From | To | Context |
|---------|------|----|---------| 
| User clicks chat button | false | true | User action |
| User clicks close button | true | false | User action |
| New message arrives | false | true | Auto-open (optional) |
| User navigates away | true | false | Page change |

### State Persistence Strategy

| Scenario | Persist | Reasoning |
|----------|---------|-----------|
| User closes chat | Yes | Remember preference |
| Page reload | Optional | User experience balance |
| New session | No | Fresh start |
| Return visitor | Yes | Continuation |

### UI Conditional Rendering

```
{isOpen && (
  <ChatWindow>
    <ChatHeader />
    <MessageList messages={messages} />
    <ChatInput />
  </ChatWindow>
)}
```

### State Update Patterns

| Action | Implementation |
|--------|----------------|
| Open Chat | `set({ isOpen: true })` |
| Close Chat | `set({ isOpen: false })` |
| Toggle Chat | `set(state => ({ isOpen: !state.isOpen }))` |

### Animation Integration

| State Change | Animation |
|--------------|-----------|
| false → true | Slide up/fade in |
| true → false | Slide down/fade out |
| Rapid toggles | Debounced transitions |

### Component Integration Pattern

```
const isOpen = useChatStore(state => state.isOpen);
const toggleChat = useChatStore(state => state.toggleChat);

return (
  <div>
    <ChatTrigger onClick={toggleChat} />
    {isOpen && <ChatWidget />}
  </div>
);
```

### Expected Outcome
- Boolean state controlling chat visibility
- Proper default state initialization
- Foundation for UI state management
- Support for user interaction patterns

### Verification Checklist
- [ ] isOpen property added to ChatState interface
- [ ] Property typed as boolean
- [ ] Default value set to false
- [ ] JSDoc documentation added
- [ ] State transition logic planned
- [ ] UI integration pattern defined
- [ ] Ready for toggle actions

---

## Task 10: Create isTyping State

### Overview
Implement the isTyping boolean state property that indicates when the AI assistant is processing and composing a response. This state enables the display of typing indicators, improving user experience by providing visual feedback during AI response generation.

### Dependencies
- Task 07: Create Chat Store

### Instructions

1. **Define isTyping property in ChatState**
   - Add `isTyping` property to ChatState interface
   - Type as boolean value
   - Include comprehensive JSDoc documentation

2. **Initialize default isTyping state**
   - Set default value to `false`
   - Ensure clean initial state
   - No typing indicator on first load

3. **Define typing indicator behavior**
   - Show indicator when AI is processing
   - Hide indicator when response completes
   - Handle typing state for multiple requests

4. **Plan timing and duration**
   - Set typing indicator timing
   - Handle minimum display duration
   - Prevent flickering on quick responses

5. **Integrate with message flow**
   - Activate on message send
   - Deactivate on response receipt
   - Handle error scenarios properly

6. **Plan UI indicator design**
   - Support for animated typing dots
   - Position indicator in message area
   - Style consistency with message design

7. **Add error handling**
   - Reset state on API errors
   - Handle timeout scenarios
   - Ensure state doesn't stick

### isTyping State Specifications

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| isTyping | boolean | false | AI assistant typing status |

### Typing State Lifecycle

```
User sends message
      ↓
  isTyping: true
      ↓
 API processing...
      ↓  
 Response received
      ↓
  isTyping: false
```

### State Timing Controls

| Timing Aspect | Duration | Purpose |
|---------------|----------|---------|
| Minimum Display | 800ms | Prevent flicker |
| Maximum Display | 30s | Timeout protection |
| Delay Before Show | 200ms | Quick response handling |

### UI Indicator Variations

| State | Display | Description |
|-------|---------|-------------|
| false | Hidden | No typing activity |
| true | Animated dots | "AI is typing..." |
| true | Pulse effect | Subtle indicator |
| true | Custom animation | Brand-specific design |

### State Integration Patterns

| Pattern | Usage |
|---------|-------|
| Message Send | Set true before API call |
| Response Received | Set false after processing |
| Error Handling | Set false on API error |
| Timeout | Set false after delay |

### Typing Indicator Component

```
{isTyping && (
  <TypingIndicator>
    <Avatar src="/ai-avatar.png" />
    <TypingDots />
    <Text>AI is typing...</Text>
  </TypingIndicator>
)}
```

### Animation Coordination

| Animation Type | Implementation |
|----------------|----------------|
| Dot Pulse | CSS keyframes |
| Wave Effect | Staggered delays |
| Breathing | Scale transform |
| Custom Brand | SVG animation |

### Error Recovery

| Error Scenario | Recovery Action |
|----------------|----------------|
| API Timeout | Set isTyping: false |
| Network Error | Set isTyping: false |
| Server Error | Set isTyping: false |
| Component Unmount | Clear typing state |

### Performance Considerations

| Aspect | Optimization |
|--------|-------------|
| Animation | Hardware acceleration |
| State Updates | Debounced changes |
| Memory | Cleanup on unmount |
| Rendering | Efficient re-renders |

### Expected Outcome
- Boolean state for AI typing indication
- Proper timing and lifecycle management
- Foundation for typing UI components
- Smooth user experience during AI processing

### Verification Checklist
- [ ] isTyping property added to ChatState interface
- [ ] Property typed as boolean
- [ ] Default value set to false
- [ ] JSDoc documentation added
- [ ] Timing logic planned
- [ ] UI integration pattern defined
- [ ] Error handling considered

---

## Task 11: Create conversationId State

### Overview
Implement the conversationId state property that tracks the unique identifier for the current chat conversation session. This nullable string state enables conversation persistence, history management, and proper session tracking across user interactions.

### Dependencies
- Task 07: Create Chat Store
- Task 03: Create Conversation Interface

### Instructions

1. **Define conversationId property in ChatState**
   - Add `conversationId` property to ChatState interface
   - Type as `string | null` union type
   - Include comprehensive JSDoc documentation

2. **Initialize default conversationId state**
   - Set default value to `null`
   - Represents no active conversation
   - Clean state for new users

3. **Define ID generation strategy**
   - Plan UUID v4 generation for new conversations
   - Ensure uniqueness across all conversations
   - Consider server-side ID assignment

4. **Plan conversation lifecycle**
   - Create ID on first message send
   - Maintain ID throughout conversation
   - Clear ID when conversation ends

5. **Implement session persistence**
   - Store conversation ID in localStorage
   - Restore ID on page reload
   - Handle expired or invalid IDs

6. **Define ID validation**
   - Validate ID format (UUID)
   - Handle malformed IDs gracefully
   - Ensure compatibility with backend

7. **Plan conversation history**
   - Link messages to conversation ID
   - Support conversation retrieval
   - Enable conversation switching

### conversationId State Specifications

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| conversationId | string \| null | null | Current conversation identifier |

### Conversation ID Lifecycle

```
New Chat Session
      ↓
conversationId: null
      ↓
First Message Sent
      ↓
Generate/Assign ID
      ↓
conversationId: "uuid-string"
      ↓
Conversation Continues...
      ↓
Conversation Ends
      ↓
conversationId: null
```

### ID Format Specifications

| Format | Example | Usage |
|--------|---------|-------|
| UUID v4 | "f47ac10b-58cc-4372-a567-0e02b2c3d479" | Standard format |
| Short ID | "conv_abc123def" | Human-readable |
| Timestamp | "chat_20260131_123456" | Time-based |

### State Null Handling

| Value | Meaning | UI Behavior |
|-------|---------|-------------|
| null | No active conversation | New chat mode |
| string | Active conversation | Continue existing chat |
| invalid | Corrupted/expired | Reset to null |

### Persistence Strategy

| Storage | Key | Value |
|---------|-----|-------|
| localStorage | "chatConversationId" | conversationId string |
| sessionStorage | "tempConversationId" | Temporary session |
| Memory only | Not persisted | Privacy mode |

### Conversation Management

| Action | ID State Change |
|--------|----------------|
| Start Chat | null → generated UUID |
| Continue Chat | Restore from storage |
| End Chat | string → null |
| New Chat | string → null → new UUID |

### Backend Integration

| API Endpoint | ID Usage |
|--------------|----------|
| POST /api/chat/start | Create new conversation |
| POST /api/chat/message | Continue existing conversation |
| GET /api/chat/{id}/history | Retrieve conversation |
| POST /api/chat/{id}/end | Close conversation |

### Error Handling Scenarios

| Scenario | Response |
|----------|----------|
| Invalid ID format | Reset to null |
| Expired conversation | Create new conversation |
| Server ID mismatch | Sync with server |
| Network error | Maintain current ID |

### State Update Patterns

| Pattern | Implementation |
|---------|----------------|
| New Conversation | `set({ conversationId: generateUUID() })` |
| Load Existing | `set({ conversationId: storedId })` |
| End Conversation | `set({ conversationId: null })` |
| Clear All | `set({ conversationId: null, messages: [] })` |

### Expected Outcome
- Nullable string state for conversation tracking
- Proper ID lifecycle management
- Foundation for conversation persistence
- Support for multi-conversation scenarios

### Verification Checklist
- [ ] conversationId property added to ChatState interface
- [ ] Property typed as string | null
- [ ] Default value set to null
- [ ] JSDoc documentation added
- [ ] ID generation strategy planned
- [ ] Persistence mechanism defined
- [ ] Backend integration considered
- [ ] Error handling planned

---

## Summary

This document established the complete TypeScript type system and Zustand store foundation for the AI chatbot frontend. It includes comprehensive type definitions for messages, conversations, and quick replies, enums for chat status and message roles, and a fully configured store with essential state properties for managing chat sessions.

### Completed Tasks
1. ✓ Created Chat Types file with organized structure
2. ✓ Created Message Interface with complete properties
3. ✓ Created Conversation Interface with session tracking
4. ✓ Created QuickReply Interface for user interactions
5. ✓ Created ChatStatus Enum for widget states
6. ✓ Created MessageRole Enum for message classification
7. ✓ Created Chat Store with Zustand integration
8. ✓ Created messages State array for conversation history
9. ✓ Created isOpen State for widget visibility
10. ✓ Created isTyping State for AI response indication
11. ✓ Created conversationId State for session tracking

### Next Steps
Proceed to [02_Tasks-12-16_Actions-Client.md](02_Tasks-12-16_Actions-Client.md) to implement store actions (addMessage, sendMessage, clearChat), create the Chat API Client, and verify the complete state management system.