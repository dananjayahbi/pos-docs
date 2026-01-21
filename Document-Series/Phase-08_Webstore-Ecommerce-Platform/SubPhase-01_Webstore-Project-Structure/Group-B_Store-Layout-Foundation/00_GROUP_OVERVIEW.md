# Group B: Store Layout Foundation

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Build store layout with providers, theme, and foundational components

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Route-Group-Directory-Structure](../Group-A_Route-Group-Directory-Structure/)
- **→ Next Group:** [Group-C_Store-Configuration](../Group-C_Store-Configuration/)

---

## Group Overview

This group creates the store layout foundation. Creates main store layout component and store providers wrapper. Creates theme provider, cart provider, and store auth provider. Creates store head component with default meta tags. Sets up store fonts and global styles. Creates CSS variables and responsive breakpoints. Creates container, grid, and section layout components. Creates skeleton loading components. Sets up toast notifications. Verifies layout rendering.

### Key Outcomes

- Store layout component
- Store providers wrapper
- Store theme provider
- Cart context provider
- Store auth provider
- Store head component
- Store font setup
- Store global styles
- CSS custom properties
- Responsive breakpoints
- Store container component
- Store grid component
- Store section component
- Store skeleton components
- Store toast setup
- Layout structure verified

### Technology Context

- **Providers:** React Context for store state
- **Styling:** Tailwind CSS with custom theme
- **Fonts:** Next.js font optimization
- **Toast:** Sonner or similar

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-22_Layout-Providers-Styles.md` | Create layout, providers, and styles | 15-22 |
| 02 | `02_Tasks-23-30_Variables-Components-Verify.md` | Create CSS variables, components, and verification | 23-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create Store Layout Component | Medium | Task 14 |
| 16 | Create Store Providers | Medium | Task 15 |
| 17 | Create Store Theme Provider | Medium | Task 16 |
| 18 | Create Cart Provider | Medium | Task 16 |
| 19 | Create Store Auth Provider | Medium | Task 16 |
| 20 | Create Store Head Component | Low | Task 15 |
| 21 | Create Store Font Setup | Low | Task 15 |
| 22 | Create Store Global Styles | Low | Task 21 |
| 23 | Create Store CSS Variables | Low | Task 22 |
| 24 | Create Responsive Breakpoints | Low | Task 23 |
| 25 | Create Store Container Component | Low | Task 15 |
| 26 | Create Store Grid Component | Low | Task 25 |
| 27 | Create Store Section Component | Low | Task 25 |
| 28 | Create Store Skeleton Components | Medium | Task 15 |
| 29 | Create Store Toast Setup | Low | Task 15 |
| 30 | Verify Layout Structure | Low | Task 29 |

---

## Execution Order

```
Task 15: Store Layout Component
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 16: Store Providers                               │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 17    Task 18    Task 19       │                 │
(Theme)    (Cart)     (Auth)        │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
    ┌──────────┴──────────┐          │                 │
    ▼                     │          │                 │
Task 20: Head Component   │          │                 │
    │                     │          │                 │
    ▼                     │          │                 │
Task 21: Font Setup       │          │                 │
    │                     │          │                 │
    ▼                     │          │                 │
Task 22: Global Styles    │          │                 │
    │                     │          │                 │
    ▼                     │          │                 │
Task 23: CSS Variables    │          │                 │
    │                     │          │                 │
    ▼                     │          │                 │
Task 24: Breakpoints      │          │                 │
    │                     │          │                 │
    └──────────┬──────────┘          │                 │
               │                     │                 │
    ┌──────────┴──────────┬──────────┤                 │
    ▼                     ▼          │                 │
Task 25: Container    Task 28       │                 │
    │                 (Skeleton)     │                 │
    ├──────────┐          │          │                 │
    ▼          ▼          │          │                 │
Task 26    Task 27       │          │                 │
(Grid)     (Section)     │          │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               ▼                     │                 │
         Task 29: Toast              │                 │
               │                     │                 │
               ▼
         Task 30: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       └── layout.tsx
├── components/
│   └── storefront/
│       ├── layout/
│       │   ├── StoreLayout.tsx
│       │   ├── StoreProviders.tsx
│       │   ├── StoreHead.tsx
│       │   ├── Container.tsx
│       │   ├── Grid.tsx
│       │   ├── Section.tsx
│       │   └── index.ts
│       ├── skeleton/
│       │   ├── ProductSkeleton.tsx
│       │   ├── CardSkeleton.tsx
│       │   └── index.ts
│       └── providers/
│           ├── ThemeProvider.tsx
│           ├── CartProvider.tsx
│           ├── AuthProvider.tsx
│           └── index.ts
├── styles/
│   └── store.css
```

---

## Notes for AI Agents

### Store Providers Hierarchy (Task 16)
| Order | Provider | Purpose |
|-------|----------|---------|
| 1 | ThemeProvider | Store theme |
| 2 | QueryProvider | TanStack Query |
| 3 | AuthProvider | Customer auth |
| 4 | CartProvider | Shopping cart |
| 5 | ToastProvider | Notifications |

### Theme Colors (Task 17)
| Variable | Light | Dark |
|----------|-------|------|
| --store-bg | #ffffff | #0a0a0a |
| --store-text | #171717 | #fafafa |
| --store-primary | #0066cc | #3399ff |
| --store-accent | #ff6600 | #ff9933 |

### Store Fonts (Task 21)
| Usage | Font | Fallback |
|-------|------|----------|
| Headings | Inter | system-ui |
| Body | Inter | system-ui |
| Price | Inter | monospace |

### CSS Variables (Task 23)
| Variable | Value |
|----------|-------|
| --store-max-width | 1280px |
| --store-gutter | 16px |
| --store-radius | 8px |

### Responsive Breakpoints (Task 24)
| Breakpoint | Width | Device |
|------------|-------|--------|
| sm | 640px | Mobile L |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Wide |

### Container Component (Task 25)
| Prop | Type | Default |
|------|------|---------|
| size | sm/md/lg/xl | lg |
| padding | boolean | true |
| center | boolean | true |

### Grid Component (Task 26)
| Prop | Type | Default |
|------|------|---------|
| cols | 1-4 | 4 |
| gap | sm/md/lg | md |
| responsive | boolean | true |

### Skeleton Variants (Task 28)
| Variant | Usage |
|---------|-------|
| ProductCard | Product grid |
| ProductDetail | Product page |
| Cart | Cart items |
| Text | Text loading |

### Toast Config (Task 29)
| Position | Value |
|----------|-------|
| Position | bottom-center |
| Duration | 4000ms |
| Theme | Store theme |
