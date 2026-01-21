# Group A: Layout Shell & Structure

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create the main layout shell with announcement bar, header/footer slots, and scroll handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Header-Components](../Group-B_Header-Components/)

---

## Group Overview

This group creates the main layout shell. Creates store layout shell component and layout TypeScript types. Creates responsive layout container. Creates announcement bar component with dismissible state and configurable message. Creates header placeholder and footer placeholder slots. Creates main content wrapper. Creates skip to content accessibility link. Creates layout scroll handler with sticky header logic. Creates layout animation wrapper. Verifies complete layout structure.

### Key Outcomes

- Store layout shell
- Layout TypeScript types
- Layout container component
- Announcement bar component
- Announcement bar state
- Announcement bar config
- Header placeholder slot
- Main content wrapper
- Footer placeholder slot
- Skip to content link
- Layout scroll handler
- Sticky header logic
- Layout animation wrapper
- Layout structure verified

### Technology Context

- **Styling:** Tailwind CSS with store theme
- **Animation:** Framer Motion for transitions
- **State:** Zustand for UI state
- **Accessibility:** Skip links, ARIA

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Layout-Shell-Announcement.md` | Create layout shell and announcement bar | 01-07 |
| 02 | `02_Tasks-08-14_Content-Scroll-Verify.md` | Create content wrapper, scroll handler, and verification | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Store Layout Shell | Medium | SubPhase-01 |
| 02 | Create Layout Types | Low | Task 01 |
| 03 | Create Layout Container | Low | Task 01 |
| 04 | Create Announcement Bar Component | Medium | Task 01 |
| 05 | Create Announcement Bar State | Low | Task 04 |
| 06 | Create Announcement Bar Config | Low | Task 04 |
| 07 | Create Header Placeholder | Low | Task 01 |
| 08 | Create Main Content Wrapper | Low | Task 01 |
| 09 | Create Footer Placeholder | Low | Task 01 |
| 10 | Create Skip to Content Link | Low | Task 01 |
| 11 | Create Layout Scroll Handler | Medium | Task 01 |
| 12 | Create Sticky Header Logic | Medium | Task 11 |
| 13 | Create Layout Animation Wrapper | Medium | Task 01 |
| 14 | Verify Layout Structure | Low | Task 13 |

---

## Execution Order

```
Task 01: Store Layout Shell
    │
    ├──────────┬──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          │
Task 02    Task 03    Task 04    Task 07       │
(Types)   (Container) (Announce) (Header)      │
    │          │          │          │          │
    │          │     ┌────┴────┐     │          │
    │          │     ▼         ▼     │          │
    │          │  Task 05  Task 06   │          │
    │          │  (State)  (Config)  │          │
    │          │     │         │     │          │
    └──────────┴─────┴─────────┴─────┴──────────┘
               │
    ┌──────────┼──────────┬──────────┐
    ▼          ▼          ▼          │
Task 08    Task 09    Task 10       │
(Content)  (Footer)  (Skip Link)    │
    │          │          │          │
    └──────────┴──────────┘          │
               │                     │
               ▼                     │
         Task 11: Scroll Handler     │
               │                     │
               ▼                     │
         Task 12: Sticky Header      │
               │                     │
               ▼                     │
         Task 13: Animation          │
               │                     │
               ▼
         Task 14: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── layout/
│           ├── StoreLayout.tsx
│           ├── LayoutContainer.tsx
│           ├── LayoutAnimation.tsx
│           ├── AnnouncementBar/
│           │   ├── AnnouncementBar.tsx
│           │   └── index.ts
│           ├── hooks/
│           │   ├── useScrollPosition.ts
│           │   └── useStickyHeader.ts
│           └── index.ts
└── types/
    └── store/
        └── layout.ts
```

---

## Notes for AI Agents

### Layout Shell Structure (Task 01)
| Section | Content |
|---------|---------|
| Skip Link | Accessibility skip to content |
| Announcement | Dismissible banner |
| Header | Sticky header slot |
| Main | Main content area |
| Footer | Footer slot |

### Announcement Bar (Task 04)
| Feature | Description |
|---------|-------------|
| Message | Configurable text |
| Link | Optional CTA link |
| Dismiss | X button to close |
| Storage | Remember dismissal |
| Style | Brand colors |

### Announcement Config (Task 06)
| Property | Type | Example |
|----------|------|---------|
| enabled | boolean | true |
| message | string | "Free shipping over ₨5,000" |
| link | string? | "/shipping" |
| linkText | string? | "Learn more" |
| bg | string | "bg-primary" |

### Skip to Content (Task 10)
| Feature | Description |
|---------|-------------|
| Visible | On focus only |
| Position | Absolute top-left |
| Target | #main-content |
| Style | High contrast |

### Scroll Handler (Task 11)
| Property | Type |
|----------|------|
| scrollY | number |
| scrollDirection | 'up' | 'down' |
| isScrolled | boolean |
| threshold | 50px |

### Sticky Header (Task 12)
| Behavior | Condition |
|----------|-----------|
| Visible | Always or on scroll up |
| Hidden | On scroll down |
| Transition | Smooth slide |
| Shadow | Add on scroll |

### Animation Wrapper (Task 13)
| Animation | Type |
|-----------|------|
| Enter | fadeIn |
| Exit | fadeOut |
| Duration | 200ms |
| Trigger | Route change |
