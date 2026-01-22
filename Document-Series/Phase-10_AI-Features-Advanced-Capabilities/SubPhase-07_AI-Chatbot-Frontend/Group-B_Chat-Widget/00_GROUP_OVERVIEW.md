# Group B: Chat Widget

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Create floating chat widget container

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Chat-State-Types](../Group-A_Chat-State-Types/)
- **→ Next Group:** [Group-C_Message-Components](../Group-C_Message-Components/)

---

## Group Overview

This group creates the chat widget. Creates ChatWidget component with Widget Position fixed bottom-right and Widget Z-Index above other content. Creates ChatButton component with Button Icon chat bubble, Button Badge for unread count, and Button Animation pulse. Creates ChatWindow component with Window Header, Close Button, Window Body, and Window Footer. Creates Open Animation slide up and Close Animation slide down. Creates Mobile Layout full screen, Tablet Layout 400px, and Desktop Layout 380px. Verifies widget.

### Key Outcomes

- ChatWidget Component
- Widget Position
- Widget Z-Index
- ChatButton Component
- Button Icon
- Button Badge
- Button Animation
- ChatWindow Component
- Window Header
- Close Button
- Window Body
- Window Footer
- Open Animation
- Close Animation
- Mobile Layout
- Tablet Layout
- Desktop Layout
- Widget verified

### Technology Context

- **Position:** Fixed bottom-right
- **Animation:** Framer Motion
- **Responsive:** Mobile-first
- **Z-Index:** Above content

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-28_Widget-Button-Window.md` | Create widget, button, window | 17-28 |
| 02 | `02_Tasks-29-34_Animation-Layout.md` | Create animations, layouts | 29-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create ChatWidget Component | Medium | Task 16 |
| 18 | Create Widget Position | Low | Task 17 |
| 19 | Create Widget Z-Index | Low | Task 18 |
| 20 | Create ChatButton Component | Medium | Task 17 |
| 21 | Create Button Icon | Low | Task 20 |
| 22 | Create Button Badge | Low | Task 21 |
| 23 | Create Button Animation | Low | Task 22 |
| 24 | Create ChatWindow Component | Medium | Task 23 |
| 25 | Create Window Header | Low | Task 24 |
| 26 | Create Close Button | Low | Task 25 |
| 27 | Create Window Body | Low | Task 24 |
| 28 | Create Window Footer | Low | Task 24 |
| 29 | Create Open Animation | Low | Task 28 |
| 30 | Create Close Animation | Low | Task 29 |
| 31 | Create Mobile Layout | Medium | Task 30 |
| 32 | Create Tablet Layout | Low | Task 31 |
| 33 | Create Desktop Layout | Low | Task 32 |
| 34 | Verify Widget | Low | Task 33 |

---

## Execution Order

```
Task 17: ChatWidget
    │
    ├────────┐
    ▼        ▼
T-18      T-20
(Pos)   (Button)
    │        │
    ▼   ┌────┴────┬────┐
T-19    ▼         ▼    ▼
(Z)  T-21      T-22  T-23
     (Icon)  (Badge)(Anim)
        │         │    │
        └─────────┴────┘
                  │
                  ▼
           Task 24: ChatWindow
                  │
           ┌──────┼──────┐
           ▼      ▼      ▼
        T-25   T-27   T-28
       (Head) (Body)(Footer)
           │      │      │
           ▼      │      │
        T-26     │      │
       (Close)   │      │
           │      │      │
           └──────┴──────┘
                  │
                  ▼
           Task 29: Open Animation
                  │
                  ▼
           Task 30: Close Animation
                  │
                  ▼
           Task 31: Mobile Layout
                  │
                  ▼
           Task 32: Tablet Layout
                  │
                  ▼
           Task 33: Desktop Layout
                  │
                  ▼
           Task 34: Verify
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── chat/
        ├── ChatWidget.tsx
        ├── ChatButton.tsx
        ├── ChatWindow.tsx
        └── ChatHeader.tsx
```

---

## Notes for AI Agents

### ChatWidget Component (Task 17)
| Component | ChatWidget |
|-----------|------------|
| Purpose | Main widget container |

### Widget Position (Task 18)
| Position | Fixed |
|----------|-------|
| Bottom | 16px |
| Right | 16px |

### Widget Z-Index (Task 19)
| Z-Index | 9999 |
|---------|------|
| Above | All content |

### ChatButton Component (Task 20)
| Component | ChatButton |
|-----------|------------|
| Purpose | Floating trigger button |

### Button Icon (Task 21)
| Icon | MessageCircle |
|------|---------------|
| Library | Lucide React |
| Size | 24px |

### Button Badge (Task 22)
| Badge | Unread count |
|-------|--------------|
| Position | Top-right |
| Show | When count > 0 |

### Button Animation (Task 23)
| Animation | Pulse |
|-----------|-------|
| Trigger | New message |
| Duration | 2s |

### ChatWindow Component (Task 24)
| Component | ChatWindow |
|-----------|------------|
| Purpose | Expanded chat window |

### Window Header (Task 25)
| Element | Header |
|---------|--------|
| Content | Title, avatar, close |

### Header Content
| Element | Description |
|---------|-------------|
| Avatar | Bot icon |
| Title | "Chat with us" |
| Status | Online/offline |

### Close Button (Task 26)
| Button | Close/Minimize |
|--------|----------------|
| Icon | X or ChevronDown |
| Action | Toggle isOpen |

### Window Body (Task 27)
| Element | Body |
|---------|------|
| Content | MessageList |
| Scroll | Vertical |

### Window Footer (Task 28)
| Element | Footer |
|---------|--------|
| Content | ChatInput |
| Border | Top border |

### Open Animation (Task 29)
| Animation | Slide up |
|-----------|----------|
| From | translateY(100%) |
| To | translateY(0) |
| Duration | 300ms |

### Close Animation (Task 30)
| Animation | Slide down |
|-----------|------------|
| From | translateY(0) |
| To | translateY(100%) |
| Duration | 200ms |

### Mobile Layout (Task 31)
| Breakpoint | < 640px |
|------------|---------|
| Layout | Full screen |
| Width | 100vw |
| Height | 100vh |

### Tablet Layout (Task 32)
| Breakpoint | 640-1024px |
|------------|------------|
| Width | 400px |
| Height | 600px |

### Desktop Layout (Task 33)
| Breakpoint | > 1024px |
|------------|----------|
| Width | 380px |
| Height | 550px |

### Layout Responsive Classes
| Breakpoint | Class |
|------------|-------|
| Mobile | w-screen h-screen |
| Tablet | w-[400px] h-[600px] |
| Desktop | w-[380px] h-[550px] |
