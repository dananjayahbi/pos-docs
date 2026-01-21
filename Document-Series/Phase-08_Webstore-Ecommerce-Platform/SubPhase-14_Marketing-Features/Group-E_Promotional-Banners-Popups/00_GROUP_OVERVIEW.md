# Group E: Promotional Banners & Popups

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Implement promotional banners, announcement bars, and marketing popups

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_WhatsApp-Integration](../Group-D_WhatsApp-Integration/)
- **→ Next Group:** [Group-F_Newsletter-Social-Sharing](../Group-F_Newsletter-Social-Sharing/)

---

## Group Overview

This group implements promotional banners and popups. Creates banner types and API client. Creates useBanners hook for fetching active banners. Creates PromoBanner component with carousel for multiple banners and CTA button. Creates AnnouncementBar at top of page with dismiss functionality. Creates popup types and PromoPopup component with entry, exit, and scroll triggers. Creates popup frequency control to show once per session. Creates exit intent popup detection. Verifies banners and popups work correctly.

### Key Outcomes

- Banner types interface
- Banner API client
- useBanners hook
- PromoBanner component
- Banner carousel
- Banner CTA button
- Announcement bar
- Announcement dismiss
- Popup types interface
- PromoPopup component
- Popup timing (entry/exit/scroll)
- Popup frequency control
- Exit intent popup
- Banners & popups verified

### Technology Context

- **Storage:** localStorage for dismiss
- **Detection:** Mouse exit intent
- **Carousel:** Embla or Swiper
- **Triggers:** Scroll, exit, timer

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-76_Banners-Announcement.md` | Create banners and announcement bar | 69-76 |
| 02 | `02_Tasks-77-82_Popups-Verify.md` | Create popups and verification | 77-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create Banner Types | Medium | Task 68 |
| 70 | Create Banner API | Medium | Task 69 |
| 71 | Create Banner Query Hook | Medium | Task 70 |
| 72 | Create PromoBanner Component | Medium | Task 71 |
| 73 | Create Banner Carousel | Medium | Task 72 |
| 74 | Create Banner CTA | Low | Task 72 |
| 75 | Create Announcement Bar | Medium | Task 69 |
| 76 | Create Announcement Dismiss | Low | Task 75 |
| 77 | Create Popup Types | Medium | Task 68 |
| 78 | Create PromoPopup Component | Medium | Task 77 |
| 79 | Create Popup Timing | Medium | Task 78 |
| 80 | Create Popup Frequency | Medium | Task 78 |
| 81 | Create Exit Intent Popup | High | Task 79 |
| 82 | Verify Banners & Popups | Low | Task 81 |

---

## Execution Order

```
Task 69: Banner Types
    │
    ├────────┐
    ▼        ▼
T-70     T-75
(API)   (Announce)
    │        │
    ▼        ▼
T-71     T-76
(Hook) (Dismiss)
    │        │
    ▼        │
T-72        │
(Banner)    │
    │        │
    ├────────┤
    ▼        │
T-73  T-74  │
(Carousel)(CTA)
    │    │   │
    └────┴───┘
         │
         ▼
   Task 77: Popup Types
         │
         ▼
   Task 78: PromoPopup
         │
    ┌────┼────┐
    ▼    ▼    ▼
T-79  T-80
(Time)(Freq)
    │    │
    ▼    │
T-81    │
(Exit)  │
    │    │
    └────┘
         │
         ▼
   Task 82: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── marketing/
│       ├── banners/
│       │   ├── PromoBanner.tsx
│       │   ├── BannerCarousel.tsx
│       │   ├── AnnouncementBar.tsx
│       │   └── index.ts
│       └── popups/
│           ├── PromoPopup.tsx
│           ├── ExitIntentPopup.tsx
│           └── index.ts
├── lib/
│   └── marketing/
│       └── banner.ts
├── hooks/
│   └── marketing/
│       ├── useBanners.ts
│       └── useExitIntent.ts
└── types/
    └── marketing/
        ├── banner.types.ts
        └── popup.types.ts
```

---

## Notes for AI Agents

### Banner Types (Task 69)
| Type | Fields |
|------|--------|
| Banner | id, title, image, link |
| Position | hero, sidebar, inline |
| Schedule | startDate, endDate |

### Banner API (Task 70)
| Endpoint | Method |
|----------|--------|
| /api/banners/active | GET |
| Params | position, limit |

### Banner Query Hook (Task 71)
| Hook | Return |
|------|--------|
| useBanners | Array of banners |
| Options | position filter |

### PromoBanner Component (Task 72)
| Props | Type |
|-------|------|
| banner | Banner |
| aspectRatio | string |
| onClick | () => void |

### Banner Carousel (Task 73)
| Features | Value |
|----------|-------|
| Autoplay | 5 seconds |
| Dots | Navigation dots |
| Arrows | Optional |
| Swipe | Mobile gesture |

### Banner CTA (Task 74)
| Button | Display |
|--------|---------|
| Text | "Shop Now" |
| Position | Over image |
| Style | Prominent |

### Announcement Bar (Task 75)
| Position | Value |
|----------|-------|
| Top | Fixed or static |
| Height | 40-50px |
| Content | Text + optional link |

### Announcement Dismiss (Task 76)
| Feature | Value |
|---------|-------|
| Button | X close |
| Storage | localStorage |
| Duration | Session or 24h |

### Popup Types (Task 77)
| Type | Fields |
|------|--------|
| Popup | id, title, content, image |
| Trigger | entry, exit, scroll, timer |
| Frequency | once, session, always |

### PromoPopup Component (Task 78)
| Props | Type |
|-------|------|
| popup | Popup |
| onClose | () => void |
| isOpen | boolean |

### Popup Timing (Task 79)
| Trigger | Behavior |
|---------|----------|
| Entry | After X seconds |
| Exit | On mouse leave |
| Scroll | At Y% of page |
| Timer | After X seconds |

### Popup Frequency (Task 80)
| Setting | Storage |
|---------|---------|
| Once | localStorage permanent |
| Session | sessionStorage |
| Always | No storage |
| Per day | localStorage + date |

### Exit Intent Popup (Task 81)
| Detection | Method |
|-----------|--------|
| Desktop | Mouse y < 0 |
| Mobile | Not applicable |
| Delay | 500ms debounce |
| Once | Per session |
