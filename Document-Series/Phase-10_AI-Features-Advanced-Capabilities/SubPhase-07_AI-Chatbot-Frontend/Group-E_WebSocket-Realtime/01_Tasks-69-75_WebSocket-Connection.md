# Tasks 69-75: WebSocket Connection

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** E - WebSocket & Real-time  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-76-80_Notifications-Offline.md](02_Tasks-76-80_Notifications-Offline.md)

---

## Document Overview

This document covers the implementation of WebSocket connection infrastructure for real-time messaging in the AI chatbot. It establishes the foundational WebSocket hook, connection management, automatic reconnection, message handling, and real-time features like typing indicators, read receipts, and connection status display.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create WebSocket Hook | High | 45 min |
| 70 | Create WS Connection | Medium | 30 min |
| 71 | Create Reconnection | Medium | 35 min |
| 72 | Create Message Handler | Medium | 30 min |
| 73 | Create Typing Event | Low | 20 min |
| 74 | Create Read Receipt | Low | 15 min |
| 75 | Create Connection Status | Low | 25 min |

---

## Task 69: Create WebSocket Hook

### Overview
Create a comprehensive React hook `useWebSocket` that manages WebSocket connection lifecycle, message sending/receiving, connection state, and provides a clean API for chat components. This hook serves as the central point for all WebSocket interactions in the chatbot frontend.

### Dependencies
- Task 68 must be complete (Chat Message Display)
- Chat context and store are established
- WebSocket server endpoint is configured

### Instructions

1. **Create hook file structure**
   - Navigate to `frontend/hooks/` directory
   - Create new file named `useWebSocket.ts`
   - This hook will be imported by chat components

2. **Define hook interfaces and types**
   - Create `WebSocketState` interface for connection state
   - Define `MessageEvent` type for incoming messages
   - Create `ConnectionStatus` enum (CONNECTING, OPEN, CLOSING, CLOSED)
   - Define `UseWebSocketReturn` interface for hook return value

3. **Implement hook state management**
   - Use React useState for WebSocket instance
   - Track connection status with state
   - Manage last received message state
   - Handle reconnection attempt counter
   - Store connection URL and session ID

4. **Create WebSocket instance management**
   - Initialize WebSocket connection on mount
   - Store WebSocket reference in useRef
   - Handle cleanup on component unmount
   - Prevent multiple connection attempts

5. **Implement connection state tracking**
   - Track WebSocket readyState changes
   - Map native WebSocket states to custom enum
   - Update React state when connection changes
   - Provide isConnected boolean for components

6. **Create message sending function**
   - Validate connection before sending
   - Serialize message data to JSON
   - Handle send errors gracefully
   - Queue messages if disconnected (prepare for Task 79)

### Hook API Design

| Property | Type | Description |
|----------|------|-------------|
| isConnected | boolean | Current connection status |
| connectionStatus | ConnectionStatus | Detailed connection state |
| lastMessage | Message \| null | Most recent received message |
| send | function | Send message to server |
| reconnect | function | Manually trigger reconnection |

### Hook State Structure

```typescript
interface WebSocketState {
  ws: WebSocket | null;
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  lastMessage: Message | null;
  reconnectAttempts: number;
}
```

### Connection URL Format

| Component | Value |
|-----------|-------|
| Protocol | ws:// (development) / wss:// (production) |
| Host | Process environment variable |
| Path | `/ws/chat/{sessionId}/` |
| Session ID | From chat context or props |

### Expected Outcome
- Functional WebSocket hook with clean API
- Proper TypeScript interfaces and types
- State management for connection status
- Message sending capability with error handling
- Foundation for reconnection and message handling

### Verification Checklist
- [ ] `frontend/hooks/useWebSocket.ts` file created
- [ ] Hook exports properly with correct return type
- [ ] Connection status tracking implemented
- [ ] Message sending function works
- [ ] TypeScript interfaces defined
- [ ] State management handles connection lifecycle
- [ ] No memory leaks on component unmount

---

## Task 70: Create WS Connection

### Overview
Implement the core WebSocket connection logic within the hook created in Task 69. Establish connection to the chatbot WebSocket endpoint, handle connection events, and integrate with the Django Channels WebSocket consumer on the backend.

### Dependencies
- Task 69: Create WebSocket Hook

### Instructions

1. **Configure WebSocket connection parameters**
   - Set WebSocket URL from environment variables
   - Include session ID in connection URL path
   - Configure connection timeout settings
   - Set proper WebSocket protocols if needed

2. **Implement connection establishment**
   - Create WebSocket instance with constructed URL
   - Set up event listeners for connection events
   - Handle initial connection handshake
   - Store WebSocket reference for later use

3. **Handle connection open event**
   - Update connection status to OPEN
   - Set isConnected to true
   - Reset reconnection attempt counter
   - Optionally send initial authentication message

4. **Handle connection close event**
   - Update connection status to CLOSED
   - Set isConnected to false
   - Log close reason and code
   - Prepare for reconnection logic (implemented in Task 71)

5. **Handle connection error event**
   - Log WebSocket errors appropriately
   - Update connection status to reflect error state
   - Prepare error information for UI display
   - Trigger reconnection if appropriate

6. **Implement connection cleanup**
   - Close WebSocket connection on hook unmount
   - Remove all event listeners
   - Clear connection state
   - Prevent memory leaks

### WebSocket Event Handlers

| Event | Handler | Purpose |
|-------|---------|---------|
| onopen | handleOpen | Connection established |
| onclose | handleClose | Connection terminated |
| onerror | handleError | Connection error occurred |
| onmessage | handleMessage | (Implemented in Task 72) |

### Connection States Flow

```
CONNECTING → OPEN → CLOSING → CLOSED
     ↑                           ↓
     └─────── (reconnect) ───────┘
```

### URL Construction Logic

| Environment | Base URL | Full URL Example |
|-------------|----------|-------------------|
| Development | ws://localhost:8000 | ws://localhost:8000/ws/chat/abc123/ |
| Production | wss://api.domain.com | wss://api.domain.com/ws/chat/abc123/ |

### Connection Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Timeout | 30 seconds | Connection attempt timeout |
| Protocols | [] (empty) | Standard WebSocket |
| Headers | Authentication | If required by backend |

### Expected Outcome
- Reliable WebSocket connection establishment
- Proper event handling for all connection states
- Clean connection lifecycle management
- Integration with session management
- Foundation for message communication

### Verification Checklist
- [ ] WebSocket connection establishes successfully
- [ ] Connection URL constructed correctly
- [ ] All event handlers attached properly
- [ ] Connection state updates reflected in UI
- [ ] Connection cleanup works on unmount
- [ ] Error handling prevents crashes
- [ ] Session ID included in connection URL

---

## Task 71: Create Reconnection

### Overview
Implement automatic reconnection logic with exponential backoff strategy to ensure robust WebSocket connectivity. Handle connection drops gracefully and attempt to restore connection automatically with increasing delays to prevent server overload.

### Dependencies
- Task 70: Create WS Connection

### Instructions

1. **Create reconnection state management**
   - Add reconnection attempt counter to hook state
   - Track reconnection timer reference
   - Store max reconnection attempts limit
   - Manage reconnection delay calculation

2. **Implement exponential backoff algorithm**
   - Start with 1-second initial delay
   - Double delay with each failed attempt
   - Cap maximum delay at 30 seconds
   - Reset delay on successful connection

3. **Create automatic reconnection trigger**
   - Trigger reconnection on unexpected connection close
   - Skip reconnection for intentional disconnections
   - Respect connection close codes from server
   - Handle network connectivity changes

4. **Implement reconnection attempt logic**
   - Clear existing connection before reconnecting
   - Create new WebSocket instance
   - Increment attempt counter
   - Schedule next attempt on failure

5. **Add manual reconnection capability**
   - Provide manual reconnect function
   - Reset attempt counter on manual reconnection
   - Allow users to force reconnection
   - Update UI to reflect reconnection status

6. **Handle reconnection limits and failure**
   - Set maximum reconnection attempts (10)
   - Stop attempting after max reached
   - Provide user notification of connection failure
   - Allow manual retry after failure

### Exponential Backoff Strategy

| Attempt | Delay | Calculation |
|---------|-------|-------------|
| 1 | 1s | 1 × 2^0 |
| 2 | 2s | 1 × 2^1 |
| 3 | 4s | 1 × 2^2 |
| 4 | 8s | 1 × 2^3 |
| 5 | 16s | 1 × 2^4 |
| 6+ | 30s | max(1 × 2^n, 30) |

### Reconnection Triggers

| Trigger | Action |
|---------|---------|
| Connection lost | Auto-reconnect |
| Network restored | Auto-reconnect |
| Manual request | Immediate reconnect |
| Tab focus | Check and reconnect |

### Connection Close Codes

| Code | Description | Reconnect? |
|------|-------------|------------|
| 1000 | Normal closure | No |
| 1001 | Going away | Yes |
| 1006 | Abnormal closure | Yes |
| 1011 | Server error | Yes |
| 1012 | Service restart | Yes |

### Reconnection State Management

```typescript
interface ReconnectionState {
  isReconnecting: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  reconnectTimer: NodeJS.Timeout | null;
}
```

### Expected Outcome
- Robust automatic reconnection system
- Exponential backoff prevents server overload
- Manual reconnection capability
- Graceful handling of connection failures
- User-friendly reconnection status updates

### Verification Checklist
- [ ] Exponential backoff algorithm implemented
- [ ] Automatic reconnection triggers on connection loss
- [ ] Maximum attempt limit respected
- [ ] Manual reconnection function works
- [ ] Reconnection state tracked and displayed
- [ ] Server close codes handled appropriately
- [ ] Timer cleanup prevents memory leaks

---

## Task 72: Create Message Handler

### Overview
Implement comprehensive message handling for incoming WebSocket messages. Parse different message types, update application state accordingly, and ensure proper error handling for malformed or unexpected messages.

### Dependencies
- Task 71: Create Reconnection

### Instructions

1. **Implement onMessage event handler**
   - Attach message handler to WebSocket instance
   - Parse incoming JSON messages safely
   - Handle parsing errors gracefully
   - Update lastMessage state with parsed content

2. **Create message type routing**
   - Define message type enumeration
   - Route messages based on type field
   - Handle unknown message types
   - Log unrecognized messages for debugging

3. **Handle chat message type**
   - Parse message content and metadata
   - Update chat store with new message
   - Trigger UI updates for message display
   - Handle message ordering and deduplication

4. **Process typing indicator messages**
   - Update typing status in chat state
   - Set timeout to clear typing indicator
   - Handle multiple users typing
   - Update UI to show typing status

5. **Handle read receipt messages**
   - Update message read status
   - Mark messages as delivered/read
   - Update message UI indicators
   - Sync read status with backend

6. **Implement error message handling**
   - Display error messages to user
   - Handle authentication errors
   - Process rate limiting messages
   - Show appropriate user notifications

### Message Type Routing

| Message Type | Handler | Action |
|--------------|---------|---------|
| message | handleChatMessage | Add to chat |
| typing | handleTypingEvent | Update typing state |
| read | handleReadReceipt | Update read status |
| error | handleErrorMessage | Show error |
| system | handleSystemMessage | System notification |

### Message Structure Examples

```typescript
// Chat Message
{
  type: 'message',
  id: 'msg_123',
  content: 'Hello, how can I help you?',
  sender: 'assistant',
  timestamp: '2026-01-31T10:00:00Z'
}

// Typing Event
{
  type: 'typing',
  userId: 'user_123',
  isTyping: true
}

// Read Receipt
{
  type: 'read',
  messageId: 'msg_123',
  readAt: '2026-01-31T10:01:00Z'
}
```

### Error Handling Strategy

| Error Type | Response |
|------------|----------|
| JSON Parse Error | Log error, ignore message |
| Invalid Message Type | Log warning, ignore message |
| Missing Required Fields | Log error, show user notification |
| Server Error Message | Display error to user |

### Message Processing Flow

```
Receive WebSocket Message
        ↓
Parse JSON Content
        ↓
Validate Message Structure
        ↓
Route by Message Type
        ↓
Update Application State
        ↓
Trigger UI Updates
```

### Expected Outcome
- Reliable message parsing and handling
- Type-safe message routing system
- Proper error handling for malformed messages
- Integration with chat state management
- Real-time UI updates for all message types

### Verification Checklist
- [ ] Message parsing handles JSON errors gracefully
- [ ] All message types routed correctly
- [ ] Chat messages appear in UI immediately
- [ ] Typing events update UI state
- [ ] Read receipts update message status
- [ ] Error messages displayed to user
- [ ] Unknown message types handled safely

---

## Task 73: Create Typing Event

### Overview
Implement typing indicator functionality that sends real-time typing events to other chat participants and handles incoming typing events from others. Include debouncing to prevent excessive message sending and proper cleanup when typing stops.

### Dependencies
- Task 72: Create Message Handler

### Instructions

1. **Create typing event sender**
   - Add typing event function to WebSocket hook
   - Send typing status on input field changes
   - Include user identification in typing events
   - Handle connection status before sending

2. **Implement typing debouncing**
   - Debounce typing events to prevent spam
   - Set debounce delay to 500ms
   - Clear debounce timer on input stop
   - Send "stop typing" event after timeout

3. **Handle outgoing typing events**
   - Send isTyping: true on input start
   - Send isTyping: false after debounce timeout
   - Include session/user ID in events
   - Format message according to protocol

4. **Process incoming typing events**
   - Update typing state for other users
   - Display typing indicator in chat UI
   - Handle multiple users typing simultaneously
   - Clear typing state on timeout

5. **Create typing state management**
   - Track who is currently typing
   - Store typing users in hook state
   - Provide typing status to components
   - Handle typing cleanup on disconnection

6. **Implement typing timeout handling**
   - Set timeout for typing indicator display
   - Clear typing state if no update received
   - Handle network delays in typing updates
   - Prevent stuck typing indicators

### Typing Event Protocol

| Direction | Event Structure |
|-----------|----------------|
| Outgoing | `{ type: 'typing', isTyping: boolean, userId: string }` |
| Incoming | `{ type: 'typing', userId: string, isTyping: boolean, username?: string }` |

### Debouncing Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Input Debounce | 500ms | Delay before sending stop typing |
| Typing Timeout | 3000ms | Clear typing if no updates |
| Max Send Rate | 2/second | Prevent message spam |

### Typing State Structure

```typescript
interface TypingState {
  usersTyping: Set<string>;
  typingTimeouts: Map<string, NodeJS.Timeout>;
  lastTypingSent: number;
  isCurrentUserTyping: boolean;
}
```

### Typing Indicator Flow

```
User Starts Typing
        ↓
Send { isTyping: true }
        ↓
User Continues Typing (debounced)
        ↓
User Stops Typing (500ms delay)
        ↓
Send { isTyping: false }
```

### Event Throttling

| Action | Throttle |
|--------|----------|
| Start Typing | Send immediately |
| Continue Typing | Debounce 500ms |
| Stop Typing | Send after debounce |
| Rapid Typing | Max 2 events/second |

### Expected Outcome
- Real-time typing indicators work smoothly
- Proper debouncing prevents message spam
- Typing state synced between participants
- Clean timeout handling prevents stuck indicators
- Efficient event sending with throttling

### Verification Checklist
- [ ] Typing events sent on input changes
- [ ] Debouncing prevents excessive messages
- [ ] Incoming typing events update UI
- [ ] Typing indicators clear after timeout
- [ ] Multiple users typing handled correctly
- [ ] Typing state resets on disconnection
- [ ] Event throttling works properly

---

## Task 74: Create Read Receipt

### Overview
Implement read receipt functionality to track and display message read status. Send read receipts when messages are viewed and handle incoming read receipts to update message status indicators in the chat interface.

### Dependencies
- Task 73: Create Typing Event

### Instructions

1. **Create read receipt sender**
   - Add sendReadReceipt function to WebSocket hook
   - Send receipt when message becomes visible
   - Include message ID and timestamp in receipt
   - Handle connection status before sending

2. **Implement message visibility tracking**
   - Track when messages enter viewport
   - Use Intersection Observer for visibility detection
   - Debounce visibility events to prevent spam
   - Send receipt only for unread messages

3. **Handle outgoing read receipts**
   - Send read receipt for each visible message
   - Include message ID and read timestamp
   - Mark message as read in local state
   - Prevent duplicate receipt sending

4. **Process incoming read receipts**
   - Update message read status in chat state
   - Display read indicators in message UI
   - Handle receipts for multiple messages
   - Sync read status across chat history

5. **Create read status state management**
   - Track read status for each message
   - Store read timestamps and user info
   - Provide read status to message components
   - Handle read status persistence

6. **Implement read indicator UI integration**
   - Prepare read status data for components
   - Provide isRead boolean for each message
   - Include readAt timestamp information
   - Handle read status for sent vs received messages

### Read Receipt Protocol

| Direction | Event Structure |
|-----------|----------------|
| Outgoing | `{ type: 'read', messageId: string, readAt: string }` |
| Incoming | `{ type: 'read', messageId: string, readAt: string, userId: string }` |

### Message Read States

| State | Description | UI Indicator |
|-------|-------------|--------------|
| Sent | Message sent | Single checkmark |
| Delivered | Reached recipient | Double checkmark |
| Read | Viewed by recipient | Double checkmark (blue) |

### Visibility Detection Strategy

| Method | Implementation |
|--------|----------------|
| Intersection Observer | Monitor message visibility |
| Throttling | Max 1 receipt per message |
| Debouncing | 1-second delay before sending |
| Batch Processing | Group multiple receipts |

### Read Receipt Flow

```
Message Enters Viewport
        ↓
Check if Already Read
        ↓
Send Read Receipt
        ↓
Update Local State
        ↓
Update UI Indicator
```

### Read Status Management

```typescript
interface ReadStatus {
  messageId: string;
  isRead: boolean;
  readAt: string | null;
  readBy: string | null;
}
```

### Expected Outcome
- Accurate read receipt functionality
- Efficient message visibility tracking
- Real-time read status updates
- Proper message status indicators
- Performance-optimized receipt sending

### Verification Checklist
- [ ] Read receipts sent when messages are viewed
- [ ] Incoming receipts update message status
- [ ] Visibility detection works accurately
- [ ] Read indicators display correctly
- [ ] No duplicate receipts sent
- [ ] Read status persists across sessions
- [ ] Performance optimized for many messages

---

## Task 75: Create Connection Status

### Overview
Create a visual connection status component that displays the current WebSocket connection state to users. Provide clear indicators for connected, connecting, disconnected, and reconnecting states with appropriate styling and user-friendly messages.

### Dependencies
- Task 74: Create Read Receipt

### Instructions

1. **Create ConnectionStatus component**
   - Navigate to `frontend/components/chat/` directory
   - Create new file named `ConnectionStatus.tsx`
   - Define React component with TypeScript props

2. **Implement connection state display**
   - Import connection status from useWebSocket hook
   - Display different states with appropriate icons
   - Show connection status text and visual indicators
   - Handle all connection states (connected, connecting, disconnected)

3. **Design status indicators**
   - Use colored dots for connection states
   - Green dot for connected state
   - Yellow spinner for connecting/reconnecting
   - Red dot for disconnected state
   - Include appropriate icons from icon library

4. **Add status text descriptions**
   - "Connected" for stable connection
   - "Connecting..." for initial connection
   - "Reconnecting..." for reconnection attempts
   - "Disconnected" for failed connection
   - Include timestamp of last status change

5. **Implement interactive features**
   - Add manual reconnect button for disconnected state
   - Show reconnection attempt counter
   - Display estimated time until next reconnection
   - Handle manual reconnection triggers

6. **Style component responsively**
   - Position component appropriately in chat UI
   - Use consistent design with chat theme
   - Ensure visibility across device sizes
   - Apply smooth animations for state changes

### Connection Status States

| State | Icon | Color | Message |
|-------|------|-------|---------|
| Connected | ● (dot) | Green | "Connected" |
| Connecting | ⟳ (spinner) | Yellow | "Connecting..." |
| Reconnecting | ⟳ (spinner) | Orange | "Reconnecting... (attempt 2)" |
| Disconnected | ● (dot) | Red | "Disconnected" |

### Component Props Interface

```typescript
interface ConnectionStatusProps {
  status: ConnectionStatus;
  isReconnecting: boolean;
  reconnectAttempts: number;
  onReconnect?: () => void;
  showDetails?: boolean;
}
```

### Status Display Variations

| View Mode | Content |
|-----------|---------|
| Minimal | Icon + text |
| Detailed | Icon + text + timestamp |
| Interactive | Icon + text + reconnect button |
| Debug | All info + attempt counter |

### Component Positioning

| Location | Purpose |
|----------|---------|
| Chat Header | Primary status display |
| Message Input | Secondary indicator |
| Footer | Minimal status dot |

### Animation and Transitions

| State Change | Animation |
|--------------|-----------|
| Connecting | Rotating spinner |
| Connected | Fade in green |
| Disconnected | Fade to red |
| Reconnecting | Pulsing orange |

### Expected Outcome
- Clear visual connection status display
- User-friendly status messages
- Interactive reconnection capability
- Responsive design across devices
- Smooth status change animations

### Verification Checklist
- [ ] `frontend/components/chat/ConnectionStatus.tsx` created
- [ ] All connection states display correctly
- [ ] Icons and colors match design system
- [ ] Manual reconnect button works
- [ ] Component integrates with chat UI
- [ ] Status updates in real-time
- [ ] Responsive design on all devices
- [ ] TypeScript interfaces properly defined

---

## Summary

This document established the foundational WebSocket infrastructure for real-time messaging in the AI chatbot, including connection management, automatic reconnection with exponential backoff, comprehensive message handling, and real-time features like typing indicators and read receipts. The connection status component provides users with clear visibility into their connection state.

### Completed Tasks
1. ✓ Created WebSocket hook with clean API and state management
2. ✓ Implemented reliable WebSocket connection with proper event handling
3. ✓ Added automatic reconnection with exponential backoff strategy
4. ✓ Created comprehensive message handler for all message types
5. ✓ Implemented typing events with debouncing and state management
6. ✓ Added read receipt functionality with visibility tracking
7. ✓ Created connection status component with visual indicators

### Next Steps
Proceed to [02_Tasks-76-80_Notifications-Offline.md](02_Tasks-76-80_Notifications-Offline.md) to implement notification sounds, sound toggle, browser notifications, offline message queueing, and complete WebSocket verification.