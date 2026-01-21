# Group A: Theme Provider & Context

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create theme provider, context, Zustand store, and CSS variables injection system

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Color-Customization](../Group-B_Color-Customization/)

---

## Group Overview

This group creates the theme provider and context system. Creates theme directory and TypeScript interfaces. Creates React Context and Provider wrapper for theme. Creates useTheme hook for accessing theme values. Creates default theme with initial values. Creates theme loader to fetch from API and theme API service. Creates CSS variables injector with root CSS variables. Creates Zustand theme store with update and reset actions. Creates theme validation and local caching. Verifies theme provider setup.

### Key Outcomes

- Theme directory
- Theme TypeScript types
- Theme React Context
- Theme Provider wrapper
- useTheme hook
- Default theme values
- Theme loader (API fetch)
- Theme API service
- CSS variables injector
- Root CSS variables
- Theme Zustand store
- Theme update action
- Theme reset action
- Theme validation
- Theme cache
- Theme provider verified

### Technology Context

- **Context:** React Context API
- **State:** Zustand store
- **CSS:** CSS custom properties
- **Cache:** Local storage

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Context-API.md` | Create context, provider, and API | 01-08 |
| 02 | `02_Tasks-09-16_CSS-Store-Verify.md` | Create CSS injection, store, and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Theme Directory | Low | SubPhase-09 |
| 02 | Create Theme Types | Medium | Task 01 |
| 03 | Create Theme Context | Low | Task 02 |
| 04 | Create Theme Provider | Medium | Task 03 |
| 05 | Create useTheme Hook | Low | Task 04 |
| 06 | Create Default Theme | Low | Task 02 |
| 07 | Create Theme Loader | Medium | Task 04 |
| 08 | Create Theme API Service | Medium | Task 07 |
| 09 | Create CSS Variables Injector | Medium | Task 04 |
| 10 | Create Root CSS Variables | Low | Task 09 |
| 11 | Create Theme Zustand Store | Medium | Task 04 |
| 12 | Create Theme Update Action | Low | Task 11 |
| 13 | Create Theme Reset Action | Low | Task 11 |
| 14 | Create Theme Validation | Medium | Task 02 |
| 15 | Create Theme Cache | Medium | Task 07 |
| 16 | Verify Theme Provider | Low | Task 15 |

---

## Execution Order

```
Task 01: Theme Directory
    │
    ▼
Task 02: Theme Types
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 03: Theme Context                                 │
    │                                                  │
    ▼                                                  │
Task 04: Theme Provider                                │
    │                                                  │
    ├────────┬────────┬────────┬────────┐              │
    ▼        ▼        ▼        ▼        │              │
T-05     T-07     T-09     T-11        │              │
(Hook) (Loader) (CSS)   (Store)        │              │
    │        │        │        │        │              │
    │        ▼        ▼        ├────────┤              │
    │     T-08     T-10     T-12    T-13              │
    │    (API)    (Root)  (Update)(Reset)             │
    │        │        │        │        │              │
    │        ▼        │        │        │              │
    │     T-15        │        │        │              │
    │   (Cache)       │        │        │              │
    │        │        │        │        │              │
    └────────┴────────┴────────┴────────┘              │
                   │                                   │
Task 06: Default Theme                                 │
    │                                                  │
Task 14: Theme Validation ─────────────────────────────┘
    │
    ▼
Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── theme/
│           └── Provider/
│               ├── ThemeProvider.tsx
│               ├── ThemeContext.tsx
│               ├── CSSVariablesInjector.tsx
│               └── index.ts
├── stores/
│   └── storefront/
│       └── themeStore.ts
├── hooks/
│   └── storefront/
│       └── useTheme.ts
├── services/
│   └── storefront/
│       └── themeService.ts
├── types/
│   └── storefront/
│       └── theme.types.ts
└── styles/
    └── theme/
        ├── variables.css
        └── defaults.ts
```

---

## Notes for AI Agents

### Theme Directory (Task 01)
| Path | Purpose |
|------|---------|
| components/storefront/theme/ | Theme components |
| stores/storefront/themeStore.ts | Theme state |
| types/storefront/theme.types.ts | TypeScript types |

### Theme Types (Task 02)
| Interface | Properties |
|-----------|------------|
| Theme | colors, fonts, logo, homepage |
| ThemeColors | primary, secondary, accent, background, text |
| ThemeFonts | heading, body, scale |
| ThemeLogo | url, alt, width, height |

### Theme Context (Task 03)
| Value | Type |
|-------|------|
| theme | Theme object |
| updateTheme | (updates) => void |
| resetTheme | () => void |
| isLoading | boolean |

### Theme Provider (Task 04)
| Feature | Description |
|---------|-------------|
| Wrap | Storefront layout |
| Load | Fetch theme on mount |
| Inject | CSS variables |
| Children | Pass theme down |

### useTheme Hook (Task 05)
| Return | Type |
|--------|------|
| theme | Theme |
| colors | ThemeColors |
| fonts | ThemeFonts |
| updateTheme | function |

### Default Theme (Task 06)
| Property | Default |
|----------|---------|
| primary | #2563eb |
| secondary | #64748b |
| heading font | Inter |
| body font | Open Sans |

### Theme Loader (Task 07)
| Step | Action |
|------|--------|
| 1 | Check cache |
| 2 | If stale, fetch API |
| 3 | Apply to store |
| 4 | Inject CSS vars |

### CSS Variables Injector (Task 09)
| Variable | Format |
|----------|--------|
| --theme-primary | Color hex |
| --theme-secondary | Color hex |
| --theme-font-heading | Font family |
| --theme-font-body | Font family |

### Root CSS Variables (Task 10)
| Selector | Purpose |
|----------|---------|
| :root | Global CSS vars |
| [data-theme] | Theme override |

### Theme Zustand Store (Task 11)
| State | Type |
|-------|------|
| theme | Theme |
| isDirty | boolean |
| isLoading | boolean |
| lastSaved | Date |

### Theme Validation (Task 14)
| Rule | Check |
|------|-------|
| Colors | Valid hex |
| Fonts | In allowed list |
| Logo | Valid URL |
| Required | All fields present |

### Theme Cache (Task 15)
| Storage | Key |
|---------|-----|
| localStorage | theme-{tenantId} |
| Expiry | 1 hour |
| Invalidate | On save |
