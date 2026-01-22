# Group F: Polish & Testing

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** F of F  
> **Tasks Covered:** 81-88  
> **Group Goal:** Polish chat UI and create tests

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_WebSocket-Realtime](../Group-E_WebSocket-Realtime/)
- **→ Next SubPhase:** [SubPhase-08_POS-Offline-Enhancement](../../SubPhase-08_POS-Offline-Enhancement/)

---

## Group Overview

This group polishes and tests. Creates Dark Mode theme support. Creates Animations using Framer Motion. Creates Error State for connection errors. Creates Loading State with skeleton loaders. Creates Accessibility ARIA labels. Creates Keyboard Nav tab navigation. Creates Integration Tests for E2E chat testing. Creates Storybook component stories.

### Key Outcomes

- Dark Mode
- Animations
- Error State
- Loading State
- Accessibility
- Keyboard Nav
- Integration Tests
- Storybook

### Technology Context

- **Theme:** CSS variables / Tailwind
- **Animation:** Framer Motion
- **Testing:** Jest + RTL
- **Storybook:** Component docs

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-88_Polish-Tests-Storybook.md` | Create polish, tests, storybook | 81-88 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create Dark Mode | Medium | Task 80 |
| 82 | Create Animations | Medium | Task 81 |
| 83 | Create Error State | Low | Task 82 |
| 84 | Create Loading State | Low | Task 83 |
| 85 | Create Accessibility | Medium | Task 84 |
| 86 | Create Keyboard Nav | Medium | Task 85 |
| 87 | Create Integration Tests | High | Task 86 |
| 88 | Create Storybook | Medium | Task 87 |

---

## Execution Order

```
Task 81: Dark Mode
    │
    ▼
Task 82: Animations
    │
    ▼
Task 83: Error State
    │
    ▼
Task 84: Loading State
    │
    ▼
Task 85: Accessibility
    │
    ▼
Task 86: Keyboard Nav
    │
    ▼
Task 87: Integration Tests
    │
    ▼
Task 88: Storybook
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── chat/
        └── states/
            ├── ErrorState.tsx
            └── LoadingState.tsx

└── stories/
    └── chat/
        ├── ChatWidget.stories.tsx
        ├── MessageBubble.stories.tsx
        └── ChatInput.stories.tsx

tests/
└── chat/
    └── chat.spec.ts
```

---

## Notes for AI Agents

### Dark Mode (Task 81)
| Feature | Dark theme |
|---------|------------|
| Method | CSS variables / class |
| Toggle | System preference |

### Dark Mode Colors
| Element | Light | Dark |
|---------|-------|------|
| Background | white | gray-900 |
| Text | gray-900 | white |
| User bubble | blue-500 | blue-600 |
| Bot bubble | gray-100 | gray-800 |

### Animations (Task 82)
| Library | Framer Motion |
|---------|---------------|
| Purpose | Smooth transitions |

### Animation Variants
| Element | Animation |
|---------|-----------|
| Widget open | slideUp |
| Widget close | slideDown |
| Message appear | fadeIn + slideUp |
| Typing dots | bounce |

### Widget Animation
| Property | Open | Close |
|----------|------|-------|
| opacity | 0 → 1 | 1 → 0 |
| y | 20 → 0 | 0 → 20 |
| duration | 200ms | 150ms |

### Error State (Task 83)
| Component | ErrorState |
|-----------|------------|
| Show | On connection error |

### Error Content
| Element | Description |
|---------|-------------|
| Icon | AlertCircle |
| Title | "Connection lost" |
| Text | "Unable to connect" |
| Button | "Try again" |

### Loading State (Task 84)
| Component | LoadingState |
|-----------|--------------|
| Show | Initial load |

### Loading Content
| Element | Description |
|---------|-------------|
| Messages | Skeleton bubbles |
| Input | Disabled |
| Header | Skeleton |

### Accessibility (Task 85)
| Standard | WCAG 2.1 AA |
|----------|-------------|

### ARIA Labels
| Element | ARIA |
|---------|------|
| Widget | role="dialog" |
| Messages | role="log" |
| Input | aria-label="Message input" |
| Send | aria-label="Send message" |

### Accessibility Features
| Feature | Implementation |
|---------|----------------|
| Screen reader | ARIA labels |
| Focus trap | In widget |
| Live region | New messages |
| Contrast | 4.5:1 minimum |

### Keyboard Nav (Task 86)
| Feature | Keyboard navigation |
|---------|---------------------|

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Tab | Navigate elements |
| Enter | Send message |
| Escape | Close widget |
| Up/Down | Navigate messages |

### Integration Tests (Task 87)
| Framework | Jest + RTL |
|-----------|------------|
| E2E | Playwright |

### Test Cases
| Test | Description |
|------|-------------|
| test_widget_open | Open widget |
| test_send_message | Send and receive |
| test_quick_reply | Click quick reply |
| test_file_upload | Upload file |
| test_websocket | Real-time messages |
| test_escalation | Human handoff |
| test_dark_mode | Theme switch |
| test_keyboard | Keyboard nav |

### Test Scenarios
| Scenario | Assertion |
|----------|-----------|
| Open widget | Widget visible |
| Type message | Input updates |
| Send message | Message in list |
| Bot response | Response appears |
| Close widget | Widget hidden |

### Storybook (Task 88)
| Library | Storybook |
|---------|-----------|
| Purpose | Component documentation |

### Stories
| Component | Stories |
|-----------|---------|
| ChatWidget | Closed, Open, Loading, Error |
| MessageBubble | User, Bot, Typing |
| ChatInput | Empty, Typing, Disabled |
| QuickReplies | With options |
| ProductCard | With product |
| OrderCard | With order |

### Story Controls
| Control | Type |
|---------|------|
| isOpen | boolean |
| messages | array |
| isTyping | boolean |
| theme | select (light/dark) |
