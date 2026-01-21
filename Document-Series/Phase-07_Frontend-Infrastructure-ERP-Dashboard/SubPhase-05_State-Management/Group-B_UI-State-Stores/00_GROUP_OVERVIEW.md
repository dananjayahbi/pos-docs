# Group B: UI State Stores

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Create Zustand store for UI state including sidebar, theme, modals, and notifications

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Zustand-Installation-Configuration](../Group-A_Zustand-Installation-Configuration/)
- **→ Next Group:** [Group-C_Auth-State-Store](../Group-C_Auth-State-Store/)

---

## Group Overview

This group creates the UI state store for managing application interface state. Creates store/uiStore.ts with sidebar state (isCollapsed, activeMenu) and toggle actions. Adds theme state (light/dark/system) with setTheme action. Implements modal registry with openModal, closeModal, and closeAllModals actions. Creates notification queue with add, remove, and clear actions. Adds command palette state with toggle action.

### Key Outcomes

- uiStore.ts created
- Sidebar isCollapsed state
- Sidebar activeMenu state
- toggleSidebar action
- setActiveMenu action
- Theme state (light/dark/system)
- setTheme action
- Modal registry (Map of modals)
- openModal action with props
- closeModal action
- closeAllModals action
- Notifications array
- addNotification action
- removeNotification action
- clearNotifications action
- CommandPalette isOpen state
- toggleCommandPalette action

### Technology Context

- **Store:** Zustand with immer
- **Theme:** System preference detection
- **Modals:** Registry pattern
- **Notifications:** Queue with auto-dismiss

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-24_Sidebar-Theme-Modals.md` | Create sidebar, theme, and modal state | 15-24 |
| 02 | `02_Tasks-25-30_Notifications-CommandPalette.md` | Create notification and command palette state | 25-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create UI Store | Low | Task 14 |
| 16 | Define Sidebar State | Low | Task 15 |
| 17 | Create toggleSidebar Action | Low | Task 16 |
| 18 | Create setActiveMenu Action | Low | Task 16 |
| 19 | Define Theme State | Low | Task 15 |
| 20 | Create setTheme Action | Low | Task 19 |
| 21 | Define Modal State | Low | Task 15 |
| 22 | Create openModal Action | Low | Task 21 |
| 23 | Create closeModal Action | Low | Task 21 |
| 24 | Create closeAllModals Action | Low | Task 21 |
| 25 | Define Notification State | Low | Task 15 |
| 26 | Create addNotification Action | Low | Task 25 |
| 27 | Create removeNotification Action | Low | Task 25 |
| 28 | Create clearNotifications Action | Low | Task 25 |
| 29 | Define CommandPalette State | Low | Task 15 |
| 30 | Create toggleCommandPalette Action | Low | Task 29 |

---

## Execution Order

```
Task 15: Create UI Store
    │
    ├──────────┬──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          ▼
Task 16    Task 19    Task 21    Task 25    Task 29
(sidebar)  (theme)    (modals)   (notifs)   (cmd)
    │          │          │          │          │
    ├──┬──┐    ▼          ├──┬──┐    ├──┬──┐    ▼
    ▼  ▼  ▼  Task 20      ▼  ▼  ▼    ▼  ▼  ▼  Task 30
   17 18 │  (setTheme)   22 23 24   26 27 28
    │  │ │                │  │  │    │  │  │
    └──┴─┘                └──┴──┘    └──┴──┘
```

---

## Expected Deliverables

```
frontend/
└── store/
    └── uiStore.ts
```

---

## Notes for AI Agents

### Sidebar State (Task 16)
| Property | Type | Default |
|----------|------|---------|
| isCollapsed | boolean | false |
| activeMenu | string or null | null |

### Theme Options (Task 19)
| Value | Description |
|-------|-------------|
| light | Always light mode |
| dark | Always dark mode |
| system | Follow OS preference |

### Modal Registry Pattern (Task 21)
| Property | Type | Description |
|----------|------|-------------|
| id | string | Modal identifier |
| isOpen | boolean | Open state |
| props | any | Modal-specific props |

### openModal Action (Task 22)
| Param | Type | Description |
|-------|------|-------------|
| id | string | Modal ID |
| props | any? | Optional props |

### Notification Type (Task 25)
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique ID |
| type | success/error/warning/info | Notification type |
| title | string | Notification title |
| message | string? | Optional message |
| duration | number? | Auto-dismiss ms |

### addNotification Action (Task 26)
- Generate unique ID
- Add to notifications array
- Set auto-dismiss timeout if duration
- Return notification ID

### CommandPalette State (Task 29)
| Property | Type | Default |
|----------|------|---------|
| isOpen | boolean | false |

### Keyboard Shortcut Integration
- Cmd/Ctrl + K triggers toggleCommandPalette
- Registered in useEffect on mount
