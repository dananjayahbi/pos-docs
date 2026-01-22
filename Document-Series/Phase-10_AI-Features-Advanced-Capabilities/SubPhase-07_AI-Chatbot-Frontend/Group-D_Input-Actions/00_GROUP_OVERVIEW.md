# Group D: Input & Actions

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Create chat input and action components

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Message-Components](../Group-C_Message-Components/)
- **→ Next Group:** [Group-E_WebSocket-Realtime](../Group-E_WebSocket-Realtime/)

---

## Group Overview

This group creates input components. Creates ChatInput component with Input Field, Send Button, Enter Key Handler, Shift+Enter for new line, and Character Limit of 500. Creates AttachButton with FileUpload and ImageUpload with UploadProgress. Creates EmojiPicker button. Creates DisabledState when sending. Creates EscalateButton for human handoff with Human Handoff UI showing waiting for agent and Agent Connected UI. Verifies input.

### Key Outcomes

- ChatInput Component
- Input Field
- Send Button
- Enter Key Handler
- Shift+Enter
- Character Limit
- AttachButton
- FileUpload
- ImageUpload
- UploadProgress
- EmojiPicker
- DisabledState
- EscalateButton
- Human Handoff UI
- Agent Connected
- Input verified

### Technology Context

- **Input:** Textarea auto-resize
- **Upload:** File API
- **Emoji:** Emoji picker library
- **Handoff:** Agent transfer

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-62_Input-Upload.md` | Create input and upload | 53-62 |
| 02 | `02_Tasks-63-68_Emoji-Handoff.md` | Create emoji, handoff | 63-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create ChatInput Component | Medium | Task 52 |
| 54 | Create Input Field | Low | Task 53 |
| 55 | Create Send Button | Low | Task 54 |
| 56 | Create Enter Key Handler | Low | Task 55 |
| 57 | Create Shift+Enter | Low | Task 56 |
| 58 | Create Character Limit | Low | Task 57 |
| 59 | Create AttachButton | Low | Task 58 |
| 60 | Create FileUpload | Medium | Task 59 |
| 61 | Create ImageUpload | Medium | Task 60 |
| 62 | Create UploadProgress | Low | Task 61 |
| 63 | Create EmojiPicker | Medium | Task 58 |
| 64 | Create DisabledState | Low | Task 55 |
| 65 | Create EscalateButton | Low | Task 58 |
| 66 | Create Human Handoff UI | Medium | Task 65 |
| 67 | Create Agent Connected | Low | Task 66 |
| 68 | Verify Input | Low | Task 67 |

---

## Execution Order

```
Task 53: ChatInput
    │
    ▼
Task 54: Input Field
    │
    ▼
Task 55: Send Button
    │
    ├────────┐
    ▼        ▼
T-56      T-64
(Enter) (Disabled)
    │        │
    ▼        │
T-57       │
(Shift)    │
    │        │
    ▼        │
T-58       │
(Limit)    │
    │        │
    ├────────┼────────┬────────┐
    ▼        │        ▼        ▼
T-59       │      T-63      T-65
(Attach)   │    (Emoji)  (Escalate)
    │        │        │        │
    ▼        │        │        ▼
T-60       │        │      T-66
(File)     │        │    (Handoff)
    │        │        │        │
    ▼        │        │        ▼
T-61       │        │      T-67
(Image)    │        │    (Agent)
    │        │        │        │
    ▼        │        │        │
T-62       │        │        │
(Progress) │        │        │
    │        │        │        │
    └────────┴────────┴────────┘
                   │
                   ▼
            Task 68: Verify
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── chat/
        ├── ChatInput.tsx
        └── input/
            ├── AttachButton.tsx
            ├── EmojiPicker.tsx
            └── EscalateButton.tsx
        └── handoff/
            ├── WaitingForAgent.tsx
            └── AgentConnected.tsx
```

---

## Notes for AI Agents

### ChatInput Component (Task 53)
| Component | ChatInput |
|-----------|-----------|
| Purpose | Message input area |

### Input Field (Task 54)
| Element | Textarea |
|---------|----------|
| Rows | Auto-resize 1-4 |
| Placeholder | "Type a message..." |

### Send Button (Task 55)
| Element | Button |
|---------|--------|
| Icon | Send (Lucide) |
| Disabled | When empty |

### Enter Key Handler (Task 56)
| Key | Enter |
|-----|-------|
| Action | Send message |
| Prevent | Default newline |

### Shift+Enter (Task 57)
| Key | Shift + Enter |
|-----|---------------|
| Action | Insert newline |
| Allow | Multi-line input |

### Character Limit (Task 58)
| Limit | 500 characters |
|-------|----------------|
| Show | Counter when > 400 |
| Block | Input at limit |

### AttachButton (Task 59)
| Component | AttachButton |
|-----------|--------------|
| Icon | Paperclip |
| Action | Open file picker |

### FileUpload (Task 60)
| Feature | File upload |
|---------|-------------|
| Types | PDF, DOC, TXT |
| Max size | 5MB |

### ImageUpload (Task 61)
| Feature | Image upload |
|---------|--------------|
| Types | JPG, PNG, GIF |
| Max size | 10MB |

### UploadProgress (Task 62)
| Component | UploadProgress |
|-----------|----------------|
| Show | During upload |
| Display | Progress bar % |

### EmojiPicker (Task 63)
| Component | EmojiPicker |
|-----------|-------------|
| Library | emoji-picker-react |
| Trigger | Smile icon |

### DisabledState (Task 64)
| State | Disabled |
|-------|----------|
| When | Sending message |
| Style | Opacity, cursor |

### EscalateButton (Task 65)
| Component | EscalateButton |
|-----------|----------------|
| Text | "Talk to human" |
| Icon | User icon |

### Human Handoff UI (Task 66)
| Component | WaitingForAgent |
|-----------|-----------------|
| Show | During escalation |

### Waiting UI Content
| Element | Description |
|---------|-------------|
| Icon | Spinner |
| Text | "Connecting to support..." |
| Cancel | Cancel escalation |

### Agent Connected (Task 67)
| Component | AgentConnected |
|-----------|----------------|
| Show | When agent joins |

### Agent Connected Content
| Element | Description |
|---------|-------------|
| Avatar | Agent photo |
| Name | Agent name |
| Text | "Agent joined the chat" |
