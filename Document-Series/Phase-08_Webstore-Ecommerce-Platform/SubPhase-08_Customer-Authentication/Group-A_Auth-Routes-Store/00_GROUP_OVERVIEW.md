# Group A: Auth Routes & Store

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create authentication route structure, Zustand store, and route guards

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Registration-Flow](../Group-B_Registration-Flow/)

---

## Group Overview

This group creates the authentication route structure and state management. Creates account directory with shared auth layout. Creates routes for login, register, forgot-password, and reset-password pages. Creates Zustand auth store with user state and actions for login, logout, and setUser. Creates TypeScript interfaces for User and AuthState. Creates auth context provider, auth guard for protected routes, and guest guard for redirecting logged-in users. Verifies all auth routes are accessible.

### Key Outcomes

- Account directory
- Auth layout
- Login page route
- Register page route
- Forgot password route
- Reset password route
- Zustand auth store
- User type interface
- Auth state type interface
- Login action
- Logout action
- setUser action
- Auth context provider
- Auth guard component
- Guest guard component
- Auth routes verified

### Technology Context

- **Routes:** account/* pages
- **State:** Zustand store
- **Guards:** Route protection
- **Types:** TypeScript interfaces

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Routes-Types.md` | Create routes and type definitions | 01-08 |
| 02 | `02_Tasks-09-16_Store-Guards-Verify.md` | Create store actions, guards, and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Account Directory | Low | SubPhase-07 |
| 02 | Create Account Layout | Medium | Task 01 |
| 03 | Create Login Page Route | Low | Task 01 |
| 04 | Create Register Page Route | Low | Task 01 |
| 05 | Create Forgot Password Route | Low | Task 01 |
| 06 | Create Reset Password Route | Low | Task 01 |
| 07 | Create Auth Store | Medium | Task 01 |
| 08 | Create User Type | Low | Task 07 |
| 09 | Create Auth State Type | Low | Task 08 |
| 10 | Create Login Action | Low | Task 07 |
| 11 | Create Logout Action | Low | Task 07 |
| 12 | Create Set User Action | Low | Task 07 |
| 13 | Create Auth Context Provider | Medium | Task 07 |
| 14 | Create Auth Guard Component | Medium | Task 13 |
| 15 | Create Guest Guard Component | Medium | Task 13 |
| 16 | Verify Auth Routes | Low | Task 15 |

---

## Execution Order

```
Task 01: Account Directory
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 02: Account Layout                                │
    │                                                  │
    ├────────┬────────┬────────┬────────┐              │
    ▼        ▼        ▼        ▼        │              │
Task 03  Task 04  Task 05  Task 06      │              │
(Login) (Register)(Forgot)(Reset)       │              │
    │        │        │        │        │              │
    └────────┴────────┴────────┘        │              │
                   │                    │              │
Task 07: Auth Store                     │              │
    │                                   │              │
    ▼                                   │              │
Task 08: User Type                      │              │
    │                                   │              │
    ▼                                   │              │
Task 09: Auth State Type                │              │
    │                                   │              │
    ├────────┬────────┐                 │              │
    ▼        ▼        ▼                 │              │
T-10     T-11     T-12                 │              │
(Login) (Logout)(SetUser)              │              │
    │        │        │                 │              │
    └────────┴────────┘                 │              │
              │                         │              │
              ▼                         │              │
         Task 13: Auth Context Provider │              │
              │                         │              │
         ┌────┴────┐                    │              │
         ▼         ▼                    │              │
      T-14      T-15                   │              │
    (AuthGuard)(GuestGuard)            │              │
         │         │                    │              │
         └────┬────┘                    │              │
              │                         │              │
              └─────────────────────────┘              │
                          │                            │
                          ▼
                    Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       └── account/
│           ├── layout.tsx
│           ├── login/
│           │   └── page.tsx
│           ├── register/
│           │   └── page.tsx
│           ├── forgot-password/
│           │   └── page.tsx
│           └── reset-password/
│               └── page.tsx
├── components/
│   └── storefront/
│       └── auth/
│           └── AuthLayout/
│               ├── AuthLayout.tsx
│               ├── AuthGuard.tsx
│               ├── GuestGuard.tsx
│               └── index.ts
├── stores/
│   └── storefront/
│       └── authStore.ts
├── types/
│   └── storefront/
│       └── auth.types.ts
└── providers/
    └── AuthProvider.tsx
```

---

## Notes for AI Agents

### Account Directory (Task 01)
| Path | Purpose |
|------|---------|
| /account | Auth pages container |
| /account/login | Customer login |
| /account/register | New registration |
| /account/forgot-password | Reset request |
| /account/reset-password | Set new password |

### Account Layout (Task 02)
| Feature | Description |
|---------|-------------|
| Logo | Store logo centered |
| Container | Centered card |
| Width | Max 400-450px |
| Background | Light pattern |

### Auth Store (Task 07)
| State | Type |
|-------|------|
| user | User or null |
| isAuthenticated | boolean |
| isLoading | boolean |
| error | string or null |

### User Type (Task 08)
| Field | Type |
|-------|------|
| id | string |
| email | string |
| phone | string (optional) |
| firstName | string |
| lastName | string |
| avatar | string (optional) |

### Auth State Type (Task 09)
| Field | Type |
|-------|------|
| user | User or null |
| isAuthenticated | boolean |
| isLoading | boolean |
| login | (credentials) => Promise |
| logout | () => void |
| setUser | (user) => void |

### Login Action (Task 10)
| Step | Action |
|------|--------|
| 1 | Set loading true |
| 2 | Call login API |
| 3 | Store tokens |
| 4 | Set user state |
| 5 | Set loading false |

### Auth Guard (Task 14)
| Check | Action |
|-------|--------|
| Not authenticated | Redirect to /account/login |
| Loading | Show spinner |
| Authenticated | Render children |

### Guest Guard (Task 15)
| Check | Action |
|-------|--------|
| Authenticated | Redirect to /account or returnUrl |
| Not authenticated | Render children |
