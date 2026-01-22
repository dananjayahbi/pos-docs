# Group E: WebSocket & Real-time

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** E of F  
> **Tasks Covered:** 69-80  
> **Group Goal:** Implement WebSocket for real-time messaging

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Input-Actions](../Group-D_Input-Actions/)
- **→ Next Group:** [Group-F_Polish-Testing](../Group-F_Polish-Testing/)

---

## Group Overview

This group implements WebSocket. Creates WebSocket Hook useWebSocket with WS Connection to server and Reconnection auto-reconnect. Creates Message Handler for incoming messages. Creates Typing Event send and Read Receipt mark as read. Creates Connection Status online/offline indicator. Creates Notification Sound for new messages with Sound Toggle mute/unmute. Creates Browser Notification push. Creates Offline Queue for messages when disconnected. Verifies WebSocket.

### Key Outcomes

- WebSocket Hook
- WS Connection
- Reconnection
- Message Handler
- Typing Event
- Read Receipt
- Connection Status
- Notification Sound
- Sound Toggle
- Browser Notification
- Offline Queue
- WebSocket verified

### Technology Context

- **WebSocket:** Native WebSocket
- **Reconnect:** Exponential backoff
- **Audio:** Web Audio API
- **Push:** Notification API

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-75_WebSocket-Connection.md` | Create WebSocket connection | 69-75 |
| 02 | `02_Tasks-76-80_Notifications-Offline.md` | Create notifications, offline | 76-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create WebSocket Hook | High | Task 68 |
| 70 | Create WS Connection | Medium | Task 69 |
| 71 | Create Reconnection | Medium | Task 70 |
| 72 | Create Message Handler | Medium | Task 71 |
| 73 | Create Typing Event | Low | Task 72 |
| 74 | Create Read Receipt | Low | Task 73 |
| 75 | Create Connection Status | Low | Task 74 |
| 76 | Create Notification Sound | Low | Task 75 |
| 77 | Create Sound Toggle | Low | Task 76 |
| 78 | Create Browser Notification | Medium | Task 77 |
| 79 | Create Offline Queue | Medium | Task 78 |
| 80 | Verify WebSocket | Low | Task 79 |

---

## Execution Order

```
Task 69: WebSocket Hook
    │
    ▼
Task 70: WS Connection
    │
    ▼
Task 71: Reconnection
    │
    ▼
Task 72: Message Handler
    │
    ▼
Task 73: Typing Event
    │
    ▼
Task 74: Read Receipt
    │
    ▼
Task 75: Connection Status
    │
    ▼
Task 76: Notification Sound
    │
    ▼
Task 77: Sound Toggle
    │
    ▼
Task 78: Browser Notification
    │
    ▼
Task 79: Offline Queue
    │
    ▼
Task 80: Verify
```

---

## Expected Deliverables

```
frontend/
└── lib/
    └── chat/
        └── websocket.ts

└── hooks/
    └── useWebSocket.ts

└── components/
    └── chat/
        └── ConnectionStatus.tsx
```

---

## Notes for AI Agents

### WebSocket Hook (Task 69)
| Hook | useWebSocket |
|------|--------------|
| Purpose | WebSocket management |

### Hook Return
| Value | Type | Description |
|-------|------|-------------|
| isConnected | boolean | Connection state |
| send | function | Send message |
| lastMessage | Message | Latest message |

### WS Connection (Task 70)
| URL | ws://host/ws/chat/{sessionId}/ |
|-----|--------------------------------|
| Protocol | WebSocket |

### Connection States
| State | Description |
|-------|-------------|
| CONNECTING | Establishing |
| OPEN | Connected |
| CLOSING | Closing |
| CLOSED | Disconnected |

### Reconnection (Task 71)
| Strategy | Exponential backoff |
|----------|---------------------|
| Initial | 1 second |
| Max | 30 seconds |
| Factor | 2x |

### Reconnection Logic
| Attempt | Delay |
|---------|-------|
| 1 | 1s |
| 2 | 2s |
| 3 | 4s |
| 4 | 8s |
| 5+ | 30s (max) |

### Message Handler (Task 72)
| Handler | onMessage |
|---------|-----------|
| Action | Parse and dispatch |

### Message Types
| Type | Action |
|------|--------|
| message | Add to messages |
| typing | Set isTyping |
| read | Update receipt |
| error | Show error |

### Typing Event (Task 73)
| Event | typing |
|-------|--------|
| Send | On input change |
| Debounce | 500ms |

### Typing Payload
| Field | Value |
|-------|-------|
| type | "typing" |
| isTyping | boolean |

### Read Receipt (Task 74)
| Event | read |
|-------|------|
| Send | On message view |

### Read Payload
| Field | Value |
|-------|-------|
| type | "read" |
| messageId | string |

### Connection Status (Task 75)
| Component | ConnectionStatus |
|-----------|------------------|
| Show | Connection state |

### Status Indicators
| State | Icon | Color |
|-------|------|-------|
| Connected | Green dot | green |
| Connecting | Spinner | yellow |
| Disconnected | Red dot | red |

### Notification Sound (Task 76)
| Sound | Message notification |
|-------|----------------------|
| File | notification.mp3 |
| Play | On new message |

### Sound Toggle (Task 77)
| Toggle | Mute/unmute |
|--------|-------------|
| Store | localStorage |
| Default | Enabled |

### Browser Notification (Task 78)
| API | Notification API |
|-----|------------------|
| Request | Permission |
| Show | When minimized |

### Notification Content
| Field | Value |
|-------|-------|
| title | Store name |
| body | Message preview |
| icon | Bot avatar |

### Offline Queue (Task 79)
| Feature | Queue messages |
|---------|----------------|
| Store | IndexedDB |
| Sync | On reconnect |

### Offline Queue Flow
| Step | Action |
|------|--------|
| 1 | Detect offline |
| 2 | Queue message locally |
| 3 | Show pending status |
| 4 | Sync on reconnect |
| 5 | Update status |
