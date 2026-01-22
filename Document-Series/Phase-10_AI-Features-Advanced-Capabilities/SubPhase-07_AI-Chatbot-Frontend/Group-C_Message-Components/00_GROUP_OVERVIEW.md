# Group C: Message Components

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Create message list and bubble components

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Chat-Widget](../Group-B_Chat-Widget/)
- **→ Next Group:** [Group-D_Input-Actions](../Group-D_Input-Actions/)

---

## Group Overview

This group creates message components. Creates MessageList component with Auto-Scroll to bottom and Load More history. Creates MessageBubble component with User Bubble right-aligned and Bot Bubble left-aligned. Creates Bubble Tail speech bubble pointer and Timestamp display. Creates TypingIndicator with Dot Animation bouncing dots. Creates BotAvatar icon. Creates QuickReplies component with QuickReplyButton and Button Click Handler. Creates ProductCard Message, OrderCard Message, and ImageMessage. Verifies messages.

### Key Outcomes

- MessageList Component
- Auto-Scroll
- Load More
- MessageBubble Component
- User Bubble
- Bot Bubble
- Bubble Tail
- Timestamp
- TypingIndicator
- Dot Animation
- BotAvatar
- QuickReplies Component
- QuickReplyButton
- Button Click Handler
- ProductCard Message
- OrderCard Message
- ImageMessage
- Messages verified

### Technology Context

- **Scroll:** Ref-based auto-scroll
- **Animation:** CSS keyframes
- **Cards:** Rich message types
- **Quick replies:** Buttons

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-45_List-Bubble-Typing.md` | Create list, bubble, typing | 35-45 |
| 02 | `02_Tasks-46-52_QuickReplies-Cards.md` | Create quick replies, cards | 46-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create MessageList Component | Medium | Task 34 |
| 36 | Create Auto-Scroll | Low | Task 35 |
| 37 | Create Load More | Medium | Task 36 |
| 38 | Create MessageBubble Component | Medium | Task 37 |
| 39 | Create User Bubble | Low | Task 38 |
| 40 | Create Bot Bubble | Low | Task 38 |
| 41 | Create Bubble Tail | Low | Task 40 |
| 42 | Create Timestamp | Low | Task 41 |
| 43 | Create TypingIndicator | Low | Task 42 |
| 44 | Create Dot Animation | Low | Task 43 |
| 45 | Create BotAvatar | Low | Task 40 |
| 46 | Create QuickReplies Component | Medium | Task 45 |
| 47 | Create QuickReplyButton | Low | Task 46 |
| 48 | Create Button Click Handler | Low | Task 47 |
| 49 | Create ProductCard Message | Medium | Task 48 |
| 50 | Create OrderCard Message | Medium | Task 48 |
| 51 | Create ImageMessage | Low | Task 48 |
| 52 | Verify Messages | Low | Task 51 |

---

## Execution Order

```
Task 35: MessageList
    │
    ▼
Task 36: Auto-Scroll
    │
    ▼
Task 37: Load More
    │
    ▼
Task 38: MessageBubble
    │
    ├────────┐
    ▼        ▼
T-39      T-40
(User)   (Bot)
    │        │
    │        ├────────┐
    │        ▼        ▼
    │     T-41      T-45
    │    (Tail)   (Avatar)
    │        │        │
    │        ▼        │
    │     T-42       │
    │   (Time)       │
    │        │        │
    │        ▼        │
    │     T-43       │
    │   (Typing)     │
    │        │        │
    │        ▼        │
    │     T-44       │
    │   (Dots)       │
    │        │        │
    └────────┴────────┘
              │
              ▼
       Task 46: QuickReplies
              │
              ▼
       Task 47: QuickReplyButton
              │
              ▼
       Task 48: Button Click Handler
              │
         ┌────┼────┬────┐
         ▼    ▼    ▼    ▼
      T-49  T-50  T-51
    (Prod)(Order)(Image)
         │    │    │
         └────┴────┘
              │
              ▼
       Task 52: Verify
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── chat/
        └── messages/
            ├── MessageList.tsx
            ├── MessageBubble.tsx
            ├── TypingIndicator.tsx
            ├── QuickReplies.tsx
            ├── ProductCard.tsx
            ├── OrderCard.tsx
            └── ImageMessage.tsx
```

---

## Notes for AI Agents

### MessageList Component (Task 35)
| Component | MessageList |
|-----------|-------------|
| Purpose | Scrollable message container |

### Auto-Scroll (Task 36)
| Feature | Auto-scroll |
|---------|-------------|
| Trigger | New message |
| Behavior | Scroll to bottom |

### Auto-Scroll Implementation
| Hook | useEffect |
|------|-----------|
| Ref | messagesEndRef |
| Method | scrollIntoView |

### Load More (Task 37)
| Feature | Load history |
|---------|--------------|
| Trigger | Scroll to top |
| Action | Fetch older messages |

### MessageBubble Component (Task 38)
| Component | MessageBubble |
|-----------|---------------|
| Props | message, isUser |

### User Bubble (Task 39)
| Style | User message |
|-------|--------------|
| Align | Right |
| Color | Primary (blue) |
| Radius | rounded-l-lg rounded-tr-lg |

### Bot Bubble (Task 40)
| Style | Bot message |
|-------|-------------|
| Align | Left |
| Color | Gray/neutral |
| Radius | rounded-r-lg rounded-tl-lg |

### Bubble Tail (Task 41)
| Element | Speech bubble pointer |
|---------|----------------------|
| Position | Bottom corner |
| Style | CSS triangle |

### Timestamp (Task 42)
| Element | Message time |
|---------|--------------|
| Format | HH:mm |
| Position | Below bubble |
| Size | text-xs |

### TypingIndicator (Task 43)
| Component | TypingIndicator |
|-----------|-----------------|
| Purpose | Show bot is typing |

### Dot Animation (Task 44)
| Animation | Bouncing dots |
|-----------|---------------|
| Dots | 3 circles |
| Timing | Staggered |

### Dot Animation Keyframes
| Keyframe | Transform |
|----------|-----------|
| 0% | translateY(0) |
| 50% | translateY(-5px) |
| 100% | translateY(0) |

### BotAvatar (Task 45)
| Element | Bot avatar |
|---------|------------|
| Icon | Robot/chat icon |
| Size | 32px |
| Position | Left of bubble |

### QuickReplies Component (Task 46)
| Component | QuickReplies |
|-----------|--------------|
| Purpose | Quick reply buttons |
| Props | replies[] |

### QuickReplyButton (Task 47)
| Component | QuickReplyButton |
|-----------|------------------|
| Props | text, value, onClick |

### Button Style
| Style | Value |
|-------|-------|
| Variant | Outline |
| Size | Small |
| Radius | Full |

### Button Click Handler (Task 48)
| Handler | onClick |
|---------|---------|
| Action | Send quick reply value |
| Hide | After click |

### ProductCard Message (Task 49)
| Component | ProductCard |
|-----------|-------------|
| Purpose | Show product in chat |

### ProductCard Content
| Element | Description |
|---------|-------------|
| Image | Product thumbnail |
| Name | Product name |
| Price | Formatted price |
| Button | View / Add to cart |

### OrderCard Message (Task 50)
| Component | OrderCard |
|-----------|-----------|
| Purpose | Show order status |

### OrderCard Content
| Element | Description |
|---------|-------------|
| Order ID | #12345 |
| Status | Badge |
| Items | Count |
| Tracking | Link if available |

### ImageMessage (Task 51)
| Component | ImageMessage |
|-----------|--------------|
| Purpose | Show image in chat |

### ImageMessage Features
| Feature | Description |
|---------|-------------|
| Preview | Thumbnail |
| Lightbox | Full view on click |
| Loading | Skeleton placeholder |
