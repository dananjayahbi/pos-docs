# Group F: Preview & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** F of F  
> **Tasks Covered:** 81-92  
> **Group Goal:** Create live preview panel with viewport options and perform comprehensive theme testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Homepage-Sections](../Group-E_Homepage-Sections/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-11_Static-Pages-CMS](../SubPhase-11_Static-Pages-CMS/)

---

## Group Overview

This group creates preview and testing. Creates theme preview panel with iframe preview frame. Creates desktop and mobile viewport toggle. Creates preview refresh functionality. Creates save theme button, publish theme option, and draft mode. Creates undo changes functionality. Performs comprehensive testing: color application, font loading, and theme persistence across sessions.

### Key Outcomes

- Theme preview panel
- Preview iframe frame
- Desktop preview viewport
- Mobile preview viewport
- Preview refresh button
- Save theme button
- Publish theme option
- Draft mode
- Undo changes
- Color application tested
- Font loading tested
- Theme persistence tested

### Technology Context

- **Preview:** Iframe with theme
- **Viewport:** Responsive toggle
- **Draft:** Save without publish
- **Publish:** Apply to live site

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-89_Preview-Actions.md` | Create preview panel and actions | 81-89 |
| 02 | `02_Tasks-90-92_Testing.md` | Perform comprehensive testing | 90-92 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create Theme Preview Panel | Medium | Task 80 |
| 82 | Create Preview Frame | Medium | Task 81 |
| 83 | Create Desktop Preview | Low | Task 82 |
| 84 | Create Mobile Preview | Low | Task 82 |
| 85 | Create Preview Refresh | Low | Task 82 |
| 86 | Create Save Theme Button | Medium | Task 81 |
| 87 | Create Publish Theme | Medium | Task 86 |
| 88 | Create Draft Mode | Medium | Task 86 |
| 89 | Create Undo Changes | Medium | Task 86 |
| 90 | Test Color Application | Low | Task 34 |
| 91 | Test Font Loading | Low | Task 50 |
| 92 | Test Theme Persistence | Low | Task 87 |

---

## Execution Order

```
Task 81: Theme Preview Panel
    │
    ▼
Task 82: Preview Frame
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-83     T-84     T-85
(Desktop)(Mobile)(Refresh)
    │        │        │
    └────────┴────────┘
              │
              ▼
        Task 86: Save Theme
              │
         ┌────┴────┬────────┐
         ▼         ▼        ▼
      T-87      T-88     T-89
    (Publish) (Draft)  (Undo)
         │         │        │
         └─────────┴────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
T-90           T-91           T-92
(Colors)      (Fonts)      (Persist)
    │              │              │
    └──────────────┴──────────────┘
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── theme/
│           └── Preview/
│               ├── PreviewPanel.tsx
│               ├── PreviewFrame.tsx
│               ├── ViewportToggle.tsx
│               ├── DesktopPreview.tsx
│               ├── MobilePreview.tsx
│               ├── PreviewRefresh.tsx
│               ├── SaveThemeButton.tsx
│               ├── PublishTheme.tsx
│               ├── DraftMode.tsx
│               ├── UndoChanges.tsx
│               └── index.ts
└── tests/
    └── e2e/
        └── theme/
            ├── colors.spec.ts
            ├── fonts.spec.ts
            └── persistence.spec.ts
```

---

## Notes for AI Agents

### Theme Preview Panel (Task 81)
| Layout | Description |
|--------|-------------|
| Position | Right side or modal |
| Width | 50% or adjustable |
| Controls | Top toolbar |
| Frame | Main content |

### Preview Frame (Task 82)
| Feature | Value |
|---------|-------|
| Element | iframe |
| Source | Storefront homepage |
| Styling | Apply theme CSS vars |
| Sandbox | allow-scripts |

### Desktop Preview (Task 83)
| Feature | Value |
|---------|-------|
| Width | 100% of panel |
| Scale | Fit to panel |
| Toggle | Desktop icon |

### Mobile Preview (Task 84)
| Feature | Value |
|---------|-------|
| Width | 375px |
| Height | 667px |
| Frame | Phone-like border |
| Toggle | Mobile icon |

### Preview Refresh (Task 85)
| Feature | Description |
|---------|-------------|
| Button | Refresh icon |
| Action | Reload iframe |
| Trigger | After changes |

### Save Theme Button (Task 86)
| State | Action |
|-------|--------|
| Clean | Disabled |
| Dirty | Enabled |
| Click | Save to API |
| Success | "Saved" toast |

### Publish Theme (Task 87)
| Feature | Description |
|---------|-------------|
| Button | "Publish" |
| Action | Apply to live site |
| Confirm | Optional confirmation |
| Status | "Published" indicator |

### Draft Mode (Task 88)
| Feature | Description |
|---------|-------------|
| Save | Save as draft |
| Indicator | "Draft" badge |
| Publish | Separate action |
| Discard | Revert to published |

### Undo Changes (Task 89)
| Feature | Description |
|---------|-------------|
| Button | "Undo" |
| Scope | Last change or all |
| History | Optional change history |
| Confirm | If major changes |

### Test Color Application (Task 90)
| Test | Expected |
|------|----------|
| Set primary color | Buttons change |
| Set secondary color | Accents change |
| Reset colors | Defaults applied |
| Refresh page | Colors persist |

### Test Font Loading (Task 91)
| Test | Expected |
|------|----------|
| Select heading font | Headings change |
| Select body font | Body text changes |
| Loading indicator | Shows while loading |
| Fallback | System font while loading |

### Test Theme Persistence (Task 92)
| Test | Expected |
|------|----------|
| Save theme | API saves successfully |
| Publish theme | Live site updates |
| New session | Theme loads correctly |
| Different device | Theme matches |
