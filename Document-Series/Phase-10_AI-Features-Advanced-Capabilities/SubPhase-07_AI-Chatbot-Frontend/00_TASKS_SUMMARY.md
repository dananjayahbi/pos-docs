# SubPhase 07: AI Chatbot Frontend - Tasks Summary

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase Index:** 07 of 12  
> **SubPhase Goal:** Implement chat widget and conversation UI for the webstore  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06_AI-Chatbot-Backend](../SubPhase-06_AI-Chatbot-Backend/)
- **→ Next SubPhase:** [SubPhase-08_POS-Offline-Enhancement](../SubPhase-08_POS-Offline-Enhancement/)

---

## SubPhase Overview

This sub-phase implements the frontend chat widget and conversation UI, including the floating widget, message bubbles, quick replies, file upload, and human handoff UI.

### Key Outcomes
- Floating chat widget
- Conversation message list
- Quick reply buttons
- Typing indicators
- File/image upload
- Human handoff UI
- Sound notifications
- Mobile-responsive design

### Chat Widget Design
```
┌─────────────────────────────────────┐
│ 💬 Chat with us                   ✕ │
├─────────────────────────────────────┤
│                                     │
│ 🤖 Hi! How can I help you today?   │
│                                     │
│                    Where is my     │
│                    order #12345? 👤│
│                                     │
│ 🤖 Let me check that for you...    │
│    Your order #12345 is currently  │
│    out for delivery. Expected      │
│    arrival: Today by 5 PM          │
│                                     │
├─────────────────────────────────────┤
│ [Type a message...]         [Send] │
└─────────────────────────────────────┘
```

### Technology Stack
- **Framework:** Next.js 14 with App Router
- **UI:** Tailwind CSS, Shadcn/UI
- **State:** Zustand for chat state
- **WebSocket:** Real-time messaging
- **Animation:** Framer Motion

---

## Task Execution Order

```
TASK GROUP A: Chat State & Types (Tasks 01-16)
        │
        ▼
TASK GROUP B: Chat Widget (Tasks 17-34)
        │
        ▼
TASK GROUP C: Message Components (Tasks 35-52)
        │
        ▼
TASK GROUP D: Input & Actions (Tasks 53-68)
        │
        ▼
TASK GROUP E: WebSocket & Real-time (Tasks 69-80)
        │
        ▼
TASK GROUP F: Polish & Testing (Tasks 81-88)
```

---

## Task Index

### Group A: Chat State & Types (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Chat Types** | TypeScript interfaces | SubPhase-06 | 🔴 Not Created |
| 02 | **Create Message Interface** | Message type | Task 01 | 🔴 Not Created |
| 03 | **Create Conversation Interface** | Conversation type | Task 01 | 🔴 Not Created |
| 04 | **Create QuickReply Interface** | Quick reply type | Task 01 | 🔴 Not Created |
| 05 | **Create ChatStatus Enum** | open/minimized/closed | Task 01 | 🔴 Not Created |
| 06 | **Create MessageRole Enum** | user/assistant/system | Task 01 | 🔴 Not Created |
| 07 | **Create Chat Store** | Zustand store | Task 06 | 🔴 Not Created |
| 08 | **Create messages State** | Message array | Task 07 | 🔴 Not Created |
| 09 | **Create isOpen State** | Widget open state | Task 07 | 🔴 Not Created |
| 10 | **Create isTyping State** | Typing indicator | Task 07 | 🔴 Not Created |
| 11 | **Create conversationId State** | Current session | Task 07 | 🔴 Not Created |
| 12 | **Create addMessage Action** | Add message | Task 11 | 🔴 Not Created |
| 13 | **Create sendMessage Action** | Send to API | Task 12 | 🔴 Not Created |
| 14 | **Create clearChat Action** | Clear messages | Task 12 | 🔴 Not Created |
| 15 | **Create Chat API Client** | API functions | Task 14 | 🔴 Not Created |
| 16 | **Verify State** | Test store | Task 15 | 🔴 Not Created |

---

### Group B: Chat Widget (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create ChatWidget Component** | Main widget container | Task 16 | 🔴 Not Created |
| 18 | **Create Widget Position** | Bottom-right fixed | Task 17 | 🔴 Not Created |
| 19 | **Create Widget Z-Index** | Above other content | Task 18 | 🔴 Not Created |
| 20 | **Create ChatButton Component** | Floating trigger | Task 17 | 🔴 Not Created |
| 21 | **Create Button Icon** | Chat bubble icon | Task 20 | 🔴 Not Created |
| 22 | **Create Button Badge** | Unread count | Task 21 | 🔴 Not Created |
| 23 | **Create Button Animation** | Pulse on new | Task 22 | 🔴 Not Created |
| 24 | **Create ChatWindow Component** | Expanded window | Task 23 | 🔴 Not Created |
| 25 | **Create Window Header** | Header with title | Task 24 | 🔴 Not Created |
| 26 | **Create Close Button** | Minimize/close | Task 25 | 🔴 Not Created |
| 27 | **Create Window Body** | Message area | Task 24 | 🔴 Not Created |
| 28 | **Create Window Footer** | Input area | Task 24 | 🔴 Not Created |
| 29 | **Create Open Animation** | Slide up animation | Task 28 | 🔴 Not Created |
| 30 | **Create Close Animation** | Slide down | Task 29 | 🔴 Not Created |
| 31 | **Create Mobile Layout** | Full screen mobile | Task 30 | 🔴 Not Created |
| 32 | **Create Tablet Layout** | Larger window | Task 31 | 🔴 Not Created |
| 33 | **Create Desktop Layout** | Fixed size | Task 32 | 🔴 Not Created |
| 34 | **Verify Widget** | Test widget | Task 33 | 🔴 Not Created |

---

### Group C: Message Components (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create MessageList Component** | Scrollable list | Task 34 | 🔴 Not Created |
| 36 | **Create Auto-Scroll** | Scroll to bottom | Task 35 | 🔴 Not Created |
| 37 | **Create Load More** | Load history | Task 36 | 🔴 Not Created |
| 38 | **Create MessageBubble Component** | Single message | Task 37 | 🔴 Not Created |
| 39 | **Create User Bubble** | Right-aligned | Task 38 | 🔴 Not Created |
| 40 | **Create Bot Bubble** | Left-aligned | Task 38 | 🔴 Not Created |
| 41 | **Create Bubble Tail** | Speech bubble tail | Task 40 | 🔴 Not Created |
| 42 | **Create Timestamp** | Message time | Task 41 | 🔴 Not Created |
| 43 | **Create TypingIndicator** | Three dots animation | Task 42 | 🔴 Not Created |
| 44 | **Create Dot Animation** | Bouncing dots | Task 43 | 🔴 Not Created |
| 45 | **Create BotAvatar** | Bot avatar icon | Task 40 | 🔴 Not Created |
| 46 | **Create QuickReplies Component** | Quick reply buttons | Task 45 | 🔴 Not Created |
| 47 | **Create QuickReplyButton** | Single button | Task 46 | 🔴 Not Created |
| 48 | **Create Button Click Handler** | Send quick reply | Task 47 | 🔴 Not Created |
| 49 | **Create ProductCard Message** | Product in chat | Task 48 | 🔴 Not Created |
| 50 | **Create OrderCard Message** | Order status card | Task 48 | 🔴 Not Created |
| 51 | **Create ImageMessage** | Image preview | Task 48 | 🔴 Not Created |
| 52 | **Verify Messages** | Test messages | Task 51 | 🔴 Not Created |

---

### Group D: Input & Actions (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create ChatInput Component** | Input field | Task 52 | 🔴 Not Created |
| 54 | **Create Input Field** | Text input | Task 53 | 🔴 Not Created |
| 55 | **Create Send Button** | Send message | Task 54 | 🔴 Not Created |
| 56 | **Create Enter Key Handler** | Send on enter | Task 55 | 🔴 Not Created |
| 57 | **Create Shift+Enter** | New line | Task 56 | 🔴 Not Created |
| 58 | **Create Character Limit** | Max 500 chars | Task 57 | 🔴 Not Created |
| 59 | **Create AttachButton** | File attachment | Task 58 | 🔴 Not Created |
| 60 | **Create FileUpload** | Upload files | Task 59 | 🔴 Not Created |
| 61 | **Create ImageUpload** | Upload images | Task 60 | 🔴 Not Created |
| 62 | **Create UploadProgress** | Upload progress | Task 61 | 🔴 Not Created |
| 63 | **Create EmojiPicker** | Emoji button | Task 58 | 🔴 Not Created |
| 64 | **Create DisabledState** | When sending | Task 55 | 🔴 Not Created |
| 65 | **Create EscalateButton** | Talk to human | Task 58 | 🔴 Not Created |
| 66 | **Create Human Handoff UI** | Waiting for agent | Task 65 | 🔴 Not Created |
| 67 | **Create Agent Connected** | Agent joined UI | Task 66 | 🔴 Not Created |
| 68 | **Verify Input** | Test input | Task 67 | 🔴 Not Created |

---

### Group E: WebSocket & Real-time (Tasks 69-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create WebSocket Hook** | useWebSocket hook | Task 68 | 🔴 Not Created |
| 70 | **Create WS Connection** | Connect to server | Task 69 | 🔴 Not Created |
| 71 | **Create Reconnection** | Auto-reconnect | Task 70 | 🔴 Not Created |
| 72 | **Create Message Handler** | Handle incoming | Task 71 | 🔴 Not Created |
| 73 | **Create Typing Event** | Send typing status | Task 72 | 🔴 Not Created |
| 74 | **Create Read Receipt** | Mark as read | Task 73 | 🔴 Not Created |
| 75 | **Create Connection Status** | Online/offline | Task 74 | 🔴 Not Created |
| 76 | **Create Notification Sound** | Message sound | Task 75 | 🔴 Not Created |
| 77 | **Create Sound Toggle** | Mute/unmute | Task 76 | 🔴 Not Created |
| 78 | **Create Browser Notification** | Push notification | Task 77 | 🔴 Not Created |
| 79 | **Create Offline Queue** | Queue when offline | Task 78 | 🔴 Not Created |
| 80 | **Verify WebSocket** | Test real-time | Task 79 | 🔴 Not Created |

---

### Group F: Polish & Testing (Tasks 81-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create Dark Mode** | Dark theme support | Task 80 | 🔴 Not Created |
| 82 | **Create Animations** | Framer Motion | Task 81 | 🔴 Not Created |
| 83 | **Create Error State** | Connection error UI | Task 82 | 🔴 Not Created |
| 84 | **Create Loading State** | Loading skeleton | Task 83 | 🔴 Not Created |
| 85 | **Create Accessibility** | ARIA labels | Task 84 | 🔴 Not Created |
| 86 | **Create Keyboard Nav** | Tab navigation | Task 85 | 🔴 Not Created |
| 87 | **Create Integration Tests** | E2E chat tests | Task 86 | 🔴 Not Created |
| 88 | **Create Storybook** | Component stories | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
└── components/
    └── chat/
        ├── ChatWidget.tsx                    # Main widget (Task 17)
        ├── ChatButton.tsx                    # Floating button (Task 20)
        ├── ChatWindow.tsx                    # Expanded window (Task 24)
        ├── ChatHeader.tsx                    # Window header (Task 25)
        ├── ChatInput.tsx                     # Input field (Task 53)
        ├── messages/
        │   ├── MessageList.tsx               # Message list (Task 35)
        │   ├── MessageBubble.tsx             # Single message (Task 38)
        │   ├── TypingIndicator.tsx           # Typing dots (Task 43)
        │   ├── QuickReplies.tsx              # Quick replies (Task 46)
        │   ├── ProductCard.tsx               # Product card (Task 49)
        │   └── OrderCard.tsx                 # Order card (Task 50)
        ├── input/
        │   ├── AttachButton.tsx              # Attach file (Task 59)
        │   ├── EmojiPicker.tsx               # Emoji picker (Task 63)
        │   └── EscalateButton.tsx            # Human handoff (Task 65)
        └── handoff/
            ├── WaitingForAgent.tsx           # Waiting UI (Task 66)
            └── AgentConnected.tsx            # Agent joined (Task 67)

└── lib/
    └── chat/
        ├── types.ts                          # Types (Task 01)
        ├── store.ts                          # Zustand store (Task 07)
        ├── client.ts                         # API client (Task 15)
        └── websocket.ts                      # WebSocket hook (Task 69)

└── hooks/
    └── useChat.ts                            # Chat hook
    └── useWebSocket.ts                       # WS hook (Task 69)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Chat State & Types | 16 | 0 | 0% |
| B | Chat Widget | 18 | 0 | 0% |
| C | Message Components | 18 | 0 | 0% |
| D | Input & Actions | 16 | 0 | 0% |
| E | WebSocket & Real-time | 12 | 0 | 0% |
| F | Polish & Testing | 8 | 0 | 0% |
| **Total** | | **88** | **0** | **0%** |

---

## Widget States

| State | Description | UI |
|-------|-------------|-----|
| Closed | Only button visible | Floating button |
| Minimized | Button with badge | Button + unread count |
| Open | Full chat window | Expanded widget |
| Connecting | Establishing connection | Loading spinner |
| Error | Connection failed | Error message + retry |
| Handoff | Waiting for agent | Waiting message |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Full screen overlay |
| Tablet | 640-1024px | 400px wide widget |
| Desktop | > 1024px | 380px wide widget |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Zustand store** - Central chat state management
3. **WebSocket** - Real-time message delivery
4. **Auto-scroll** - Always scroll to latest
5. **Typing indicator** - Show when bot is typing
6. **Quick replies** - Buttons for common actions
7. **Human handoff** - UI for agent transfer
8. **Sound notifications** - Alert on new messages
9. **Mobile-first** - Full screen on mobile
10. **Accessibility** - ARIA labels, keyboard nav
