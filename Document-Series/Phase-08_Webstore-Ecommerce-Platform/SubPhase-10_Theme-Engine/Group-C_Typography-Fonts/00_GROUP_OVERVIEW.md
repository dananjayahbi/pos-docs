# Group C: Typography & Fonts

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Create font selection with Google Fonts integration, preview, and dynamic loading

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Color-Customization](../Group-B_Color-Customization/)
- **→ Next Group:** [Group-D_Logo-Images](../Group-D_Logo-Images/)

---

## Group Overview

This group creates typography customization. Creates typography section with heading and body font selectors. Creates font list of available fonts. Creates Google Fonts integration for dynamic loading. Creates font preview showing sample text. Creates font size scale and line height settings. Creates font weight options. Creates apply fonts function to update CSS variables. Creates dynamic font loader with loading state indicator. Creates font fallback stack. Creates reset typography and full typography preview. Verifies typography system works correctly.

### Key Outcomes

- Typography section
- Heading font selector
- Body font selector
- Font list (available)
- Google Fonts integration
- Font preview
- Font size scale
- Line height setting
- Font weight options
- Apply fonts to CSS
- Dynamic font loader
- Font loading state
- Font fallbacks
- Reset typography
- Typography preview section
- Typography system verified

### Technology Context

- **Fonts:** Google Fonts API
- **Loading:** Dynamic injection
- **Preview:** Real-time sample
- **Fallbacks:** System fonts

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_Selection-Apply.md` | Create selectors and apply fonts | 35-44 |
| 02 | `02_Tasks-45-50_Loading-Preview-Verify.md` | Create loading, preview, and verification | 45-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Typography Section | Low | Task 34 |
| 36 | Create Heading Font Selector | Low | Task 35 |
| 37 | Create Body Font Selector | Low | Task 35 |
| 38 | Create Font List | Medium | Task 36 |
| 39 | Create Google Fonts Integration | High | Task 38 |
| 40 | Create Font Preview | Medium | Task 39 |
| 41 | Create Font Size Scale | Low | Task 35 |
| 42 | Create Line Height Setting | Low | Task 35 |
| 43 | Create Font Weight Options | Low | Task 35 |
| 44 | Create Apply Fonts | Medium | Task 39 |
| 45 | Create Font Loader | Medium | Task 39 |
| 46 | Create Font Loading State | Low | Task 45 |
| 47 | Create Font Fallbacks | Low | Task 44 |
| 48 | Create Reset Typography | Low | Task 35 |
| 49 | Create Typography Preview | Medium | Task 44 |
| 50 | Verify Typography System | Low | Task 49 |

---

## Execution Order

```
Task 35: Typography Section
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        │
T-36     T-37     T-41     T-42     T-43     T-48
(Head)  (Body)  (Size)  (Line)  (Weight)(Reset)
    │        │        │        │        │        │
    └────────┘        │        │        │        │
         │            │        │        │        │
         ▼            │        │        │        │
    Task 38: Font List                            │
         │            │        │        │        │
         ▼            │        │        │        │
    Task 39: Google Fonts Integration             │
         │            │        │        │        │
         ├────────────┴────────┴────────┴────────┘
         │
    ┌────┴────┐
    ▼         ▼
T-40      T-44
(Preview)(Apply)
    │         │
    │         ▼
    │      T-47
    │   (Fallbacks)
    │         │
    └────┬────┘
         │
    ┌────┴────┐
    ▼         ▼
T-45      T-49
(Loader)(Preview)
    │         │
    ▼         │
T-46         │
(State)      │
    │         │
    └────┬────┘
         │
         ▼
    Task 50: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── theme/
│           └── Typography/
│               ├── TypographySettings.tsx
│               ├── FontSelector.tsx
│               ├── FontList.tsx
│               ├── FontPreview.tsx
│               ├── FontSizeScale.tsx
│               ├── LineHeightSetting.tsx
│               ├── FontWeightOptions.tsx
│               ├── FontLoader.tsx
│               ├── FontLoadingState.tsx
│               ├── TypographyPreview.tsx
│               └── index.ts
└── lib/
    └── theme/
        ├── googleFonts.ts
        └── fontFallbacks.ts
```

---

## Notes for AI Agents

### Typography Section (Task 35)
| Section | Settings |
|---------|----------|
| Heading | Font family, weight |
| Body | Font family, weight |
| Scale | Base size |
| Spacing | Line height |

### Heading Font Selector (Task 36)
| Feature | Value |
|---------|-------|
| Label | "Heading Font" |
| Type | Dropdown |
| Preview | Font name in that font |

### Font List (Task 38)
| Category | Examples |
|----------|----------|
| Sans-serif | Inter, Open Sans, Roboto |
| Serif | Merriweather, Playfair Display |
| Display | Poppins, Montserrat |

### Google Fonts Integration (Task 39)
| Feature | Implementation |
|---------|----------------|
| API | fonts.googleapis.com |
| Load | Link tag or @import |
| Weights | 400, 500, 600, 700 |
| Display | swap |

### Font Preview (Task 40)
| Element | Sample |
|---------|--------|
| Heading | "The quick brown fox" |
| Body | "Lorem ipsum dolor sit amet..." |
| Style | Show selected font |

### Font Size Scale (Task 41)
| Scale | Base Size |
|-------|-----------|
| Small | 14px |
| Medium | 16px (default) |
| Large | 18px |
| X-Large | 20px |

### Line Height Setting (Task 42)
| Option | Value |
|--------|-------|
| Tight | 1.25 |
| Normal | 1.5 (default) |
| Relaxed | 1.75 |
| Loose | 2.0 |

### Font Weight Options (Task 43)
| Weight | Name |
|--------|------|
| 400 | Regular |
| 500 | Medium |
| 600 | Semi-bold |
| 700 | Bold |

### Apply Fonts (Task 44)
| Variable | Source |
|----------|--------|
| --theme-font-heading | Heading font |
| --theme-font-body | Body font |
| --theme-font-size | Base size |
| --theme-line-height | Line height |

### Font Loader (Task 45)
| Step | Action |
|------|--------|
| 1 | Construct Google Fonts URL |
| 2 | Create link element |
| 3 | Append to head |
| 4 | Wait for load |
| 5 | Update state |

### Font Fallbacks (Task 47)
| Type | Stack |
|------|-------|
| Sans | system-ui, -apple-system, sans-serif |
| Serif | Georgia, "Times New Roman", serif |
| Mono | Menlo, Monaco, monospace |

### Typography Preview (Task 49)
| Element | Sample |
|---------|--------|
| H1 | "Heading 1" |
| H2 | "Heading 2" |
| Paragraph | "Body text sample..." |
| Link | "Link text" |
| Button | "Button Text" |
