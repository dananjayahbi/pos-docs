# Group E: Homepage Sections

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Create homepage section builder with drag-and-drop ordering and per-section configuration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Logo-Images](../Group-D_Logo-Images/)
- **→ Next Group:** [Group-F_Preview-Testing](../Group-F_Preview-Testing/)

---

## Group Overview

This group creates homepage section builder. Creates homepage builder UI with section list showing all available sections. Creates drag handle for reordering sections and toggle for enabling/disabling each section. Creates configuration for Hero, Featured Products, Categories, Testimonials, and Newsletter sections. Creates add section functionality and per-section settings panel. Creates save section order API integration. Creates homepage preview. Verifies section builder ordering and configuration works correctly.

### Key Outcomes

- Homepage builder UI
- Section list
- Section drag handle
- Section toggle
- Hero section config
- Featured products config
- Categories section config
- Testimonials config
- Newsletter config
- Add section
- Section settings
- Save section order
- Homepage preview
- Section builder verified

### Technology Context

- **Drag:** dnd-kit or react-beautiful-dnd
- **Toggle:** Enable/disable sections
- **Config:** Per-section settings
- **Preview:** Real-time homepage

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-75_Builder-Configs.md` | Create builder and section configs | 67-75 |
| 02 | `02_Tasks-76-80_Add-Save-Verify.md` | Create add section, save, and verification | 76-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create Homepage Builder | Medium | Task 66 |
| 68 | Create Section List | Medium | Task 67 |
| 69 | Create Section Drag Handle | Low | Task 68 |
| 70 | Create Section Toggle | Low | Task 68 |
| 71 | Create Hero Section Config | Medium | Task 67 |
| 72 | Create Featured Products Config | Medium | Task 67 |
| 73 | Create Categories Section Config | Medium | Task 67 |
| 74 | Create Testimonials Config | Medium | Task 67 |
| 75 | Create Newsletter Config | Low | Task 67 |
| 76 | Create Add Section | Low | Task 67 |
| 77 | Create Section Settings | Medium | Task 68 |
| 78 | Create Save Section Order | Medium | Task 68 |
| 79 | Create Homepage Preview | Medium | Task 78 |
| 80 | Verify Section Builder | Low | Task 79 |

---

## Execution Order

```
Task 67: Homepage Builder
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 68: Section List                                  │
    │                                                  │
    ├────────┬────────┐                                │
    ▼        ▼        │                                │
T-69     T-70     T-77                                │
(Drag)  (Toggle)(Settings)                            │
    │        │        │                                │
    └────────┴────────┘                                │
         │                                             │
    ┌────┴────┬────────┬────────┬────────┐             │
    ▼         ▼        ▼        ▼        │             │
T-71      T-72     T-73     T-74     T-75  T-76       │
(Hero)  (Featured)(Cats)  (Testi) (News) (Add)        │
    │         │        │        │        │    │        │
    └─────────┴────────┴────────┴────────┴────┘        │
                          │                            │
                          ▼                            │
                    Task 78: Save Section Order        │
                          │                            │
                          ▼                            │
                    Task 79: Homepage Preview          │
                          │                            │
                          └────────────────────────────┘
                                   │
                                   ▼
                             Task 80: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── theme/
│           └── Homepage/
│               ├── HomepageBuilder.tsx
│               ├── SectionList.tsx
│               ├── SectionItem.tsx
│               ├── SectionDragHandle.tsx
│               ├── SectionToggle.tsx
│               ├── SectionSettings.tsx
│               ├── HeroConfig.tsx
│               ├── FeaturedConfig.tsx
│               ├── CategoriesConfig.tsx
│               ├── TestimonialsConfig.tsx
│               ├── NewsletterConfig.tsx
│               ├── AddSection.tsx
│               ├── HomepagePreview.tsx
│               └── index.ts
└── services/
    └── storefront/
        └── homepageService.ts
```

---

## Notes for AI Agents

### Homepage Builder (Task 67)
| Layout | Description |
|--------|-------------|
| Left | Section list |
| Right | Preview or settings |
| Actions | Save, preview |

### Section List (Task 68)
| Feature | Description |
|---------|-------------|
| Items | All available sections |
| Order | Drag to reorder |
| State | Enabled/disabled |

### Section Drag Handle (Task 69)
| Feature | Value |
|---------|-------|
| Icon | Grip vertical |
| Cursor | grab/grabbing |
| Position | Left of item |

### Section Toggle (Task 70)
| State | Display |
|-------|---------|
| Enabled | Switch on, full opacity |
| Disabled | Switch off, dimmed |

### Hero Section Config (Task 71)
| Setting | Description |
|---------|-------------|
| Image | Hero background |
| Title | Heading text |
| Subtitle | Supporting text |
| CTA | Button text and link |

### Featured Products Config (Task 72)
| Setting | Description |
|---------|-------------|
| Title | Section heading |
| Count | Number of products |
| Source | Manual or auto |
| Columns | 3 or 4 |

### Categories Section Config (Task 73)
| Setting | Description |
|---------|-------------|
| Title | Section heading |
| Categories | Select which to show |
| Style | Grid or carousel |

### Testimonials Config (Task 74)
| Setting | Description |
|---------|-------------|
| Title | Section heading |
| Items | Add/edit testimonials |
| Style | Cards or carousel |

### Newsletter Config (Task 75)
| Setting | Description |
|---------|-------------|
| Title | Heading text |
| Subtitle | Description |
| Button | Submit text |
| Background | Color or image |

### Add Section (Task 76)
| Feature | Description |
|---------|-------------|
| Button | "+ Add Section" |
| Modal | Select section type |
| Types | Hero, Featured, etc. |

### Section Settings (Task 77)
| Feature | Description |
|---------|-------------|
| Open | Click section item |
| Panel | Right side or modal |
| Save | Per-section save |

### Save Section Order (Task 78)
| Endpoint | Method |
|----------|--------|
| /api/theme/homepage | PATCH |
| Payload | Section order array |
| Response | Updated config |

### Homepage Preview (Task 79)
| Feature | Description |
|---------|-------------|
| Mode | Live preview |
| Sections | Only enabled |
| Order | As configured |
| Style | Scaled iframe |
