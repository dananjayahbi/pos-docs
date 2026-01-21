# Group A: Auth Route Group & Layout

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create the (auth) route group with centered layout and reusable auth components

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Login-Page-Form](../Group-B_Login-Page-Form/)

---

## Group Overview

This group creates the authentication route group and shared layout for all auth pages. Sets up app/(auth)/ directory with a centered layout component. Designs the auth layout with LCC brand colors and logo. Adds subtle background pattern or gradient. Creates reusable auth components: AuthCard, AuthLogo, AuthFooter, AuthHeading, AuthDivider, SocialLoginButtons, AuthAlert, and AuthLoading. Configures page metadata for SEO.

### Key Outcomes

- (auth) route group created
- Auth layout component
- Auth layout styling with brand
- Background pattern/gradient
- AuthCard component
- AuthLogo component
- AuthFooter component (privacy, terms)
- AuthHeading component
- AuthDivider component ("or")
- SocialLoginButtons (UI only)
- AuthAlert component
- AuthLoading state
- Page metadata configured
- Layout structure verified

### Technology Context

- **Routing:** Next.js App Router route groups
- **Styling:** Tailwind CSS
- **Components:** Shadcn/UI primitives
- **Layout:** Centered, responsive

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Route-Group-Layout.md` | Create route group and layout structure | 01-07 |
| 02 | `02_Tasks-08-14_Auth-Components-Metadata.md` | Create auth components and configure metadata | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create (auth) Route Group | Low | SubPhase-05 |
| 02 | Create Auth Layout Component | Low | Task 01 |
| 03 | Design Auth Layout Styling | Low | Task 02 |
| 04 | Add Auth Background Pattern | Low | Task 03 |
| 05 | Create Auth Card Component | Low | Task 03 |
| 06 | Create Auth Logo Component | Low | Task 02 |
| 07 | Create Auth Footer Component | Low | Task 02 |
| 08 | Create Auth Heading Component | Low | Task 02 |
| 09 | Create Auth Divider Component | Low | Task 02 |
| 10 | Create Social Login Buttons | Low | Task 02 |
| 11 | Create Auth Alert Component | Low | Task 02 |
| 12 | Create Auth Loading State | Low | Task 02 |
| 13 | Configure Auth Metadata | Low | Task 01 |
| 14 | Verify Auth Layout Structure | Low | Task 13 |

---

## Execution Order

```
Task 01: Create (auth) Route Group
    │
    ├──────────────────────┐
    ▼                      ▼
Task 02               Task 13
(Layout)              (Metadata)
    │                      │
    ▼                      │
Task 03: Styling           │
    │                      │
    ├──────────────────────┤
    ▼                      │
Task 04: Background        │
    │                      │
    ▼                      │
Task 05: AuthCard          │
    │                      │
    ├──────────┬───────────┤
    ▼          ▼           │
Task 06    Task 07         │
(Logo)     (Footer)        │
    │          │           │
    ├──────────┴───────────┤
    ▼                      │
Tasks 08-12                │
(Heading, Divider, etc.)   │
    │                      │
    └──────────────────────┘
               │
               ▼
          Task 14: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (auth)/
│       └── layout.tsx
└── components/
    └── auth/
        ├── AuthCard.tsx
        ├── AuthDivider.tsx
        ├── AuthFooter.tsx
        ├── AuthHeading.tsx
        ├── AuthLogo.tsx
        ├── AuthAlert.tsx
        ├── AuthLoading.tsx
        ├── SocialLoginButtons.tsx
        └── index.ts
```

---

## Notes for AI Agents

### Route Group Purpose (Task 01)
- Parentheses exclude from URL
- app/(auth)/login → /login
- Shared layout for all auth pages
- Separate from dashboard layout

### Auth Layout Structure (Task 02)
| Section | Content |
|---------|---------|
| Top | Logo |
| Center | Auth card |
| Bottom | Footer links |

### Layout Styling (Task 03)
| Property | Value |
|----------|-------|
| Background | Brand gradient or pattern |
| Content | Centered vertically |
| Card | White with shadow |
| Max width | sm (24rem) |

### AuthCard Props (Task 05)
| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Form content |
| className | string? | Additional classes |

### AuthHeading Props (Task 08)
| Prop | Type | Description |
|------|------|-------------|
| title | string | Main heading |
| subtitle | string? | Optional subtitle |

### AuthDivider Props (Task 09)
| Prop | Type | Default |
|------|------|---------|
| text | string | "or" |

### SocialLoginButtons (Task 10)
| Provider | Status |
|----------|--------|
| Google | UI only |
| Facebook | UI only |

### AuthAlert Props (Task 11)
| Prop | Type | Description |
|------|------|-------------|
| type | success/error | Alert type |
| message | string | Alert message |

### AuthLoading (Task 12)
- Full overlay
- Spinner or skeleton
- Used during API calls
