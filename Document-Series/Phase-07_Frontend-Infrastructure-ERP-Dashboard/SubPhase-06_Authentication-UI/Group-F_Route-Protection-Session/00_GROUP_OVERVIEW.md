# Group F: Route Protection & Session

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** F of F  
> **Tasks Covered:** 77-86  
> **Group Goal:** Create protected route wrapper, permission checks, and session expiry handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Email-Verification-2FA](../Group-E_Email-Verification-2FA/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-07_Dashboard-Layout](../SubPhase-07_Dashboard-Layout/)

---

## Group Overview

This group creates route protection and session management components. Creates ProtectedRoute component that wraps protected pages, checks auth state before rendering, and redirects unauthenticated users to login. Stores intended URL for post-login redirect. Implements permission checks for routes and creates unauthorized (403) page. Handles session expiry with modal prompting re-authentication and implements auto-logout on expiry. Performs final end-to-end testing of all auth flows.

### Key Outcomes

- ProtectedRoute component
- Auth check logic
- Redirect to login
- Intended URL storage
- Permission check
- Unauthorized (403) page
- Session expiry detection
- Session expiry modal
- Auto logout on expiry
- Final verification completed

### Technology Context

- **Protection:** HOC/wrapper pattern
- **Auth State:** Zustand auth store
- **Permissions:** RBAC from permissions array
- **Session:** Token expiry detection

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-77-82_Route-Protection.md` | Create protected route and permission checks | 77-82 |
| 02 | `02_Tasks-83-86_Session-Management.md` | Handle session expiry and final testing | 83-86 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 77 | Create ProtectedRoute Component | Medium | Task 30 |
| 78 | Implement Auth Check Logic | Low | Task 77 |
| 79 | Implement Redirect to Login | Low | Task 78 |
| 80 | Store Intended URL | Low | Task 79 |
| 81 | Create Permission Check | Medium | Task 77 |
| 82 | Create Unauthorized Page | Low | Task 81 |
| 83 | Implement Session Expiry Handling | Medium | Task 77 |
| 84 | Create Session Expiry Modal | Low | Task 83 |
| 85 | Implement Auto Logout | Low | Task 83 |
| 86 | Final Verification & Testing | Low | Task 85 |

---

## Execution Order

```
Task 77: ProtectedRoute Component
    │
    ▼
Task 78: Auth Check Logic
    │
    ▼
Task 79: Redirect to Login
    │
    ▼
Task 80: Store Intended URL
    │
    ▼
Task 81: Permission Check
    │
    ▼
Task 82: Unauthorized Page
    │
    ▼
Task 83: Session Expiry Handling
    │
    ├──────────────────────┐
    ▼                      ▼
Task 84               Task 85
(Modal)               (Auto Logout)
    │                      │
    └──────────┬───────────┘
               ▼
          Task 86: Final Test
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (auth)/
│       └── unauthorized/
│           └── page.tsx
└── components/
    └── auth/
        ├── ProtectedRoute.tsx
        └── SessionExpiryModal.tsx
```

---

## Notes for AI Agents

### ProtectedRoute Props (Task 77)
| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Protected content |
| requiredPermissions | string[]? | Required perms |
| requireAll | boolean? | All perms required |

### Auth Check Logic (Task 78)
| Check | Action |
|-------|--------|
| isLoading | Show loading |
| !isAuthenticated | Redirect to login |
| hasPermission | Render children |
| !hasPermission | Redirect to 403 |

### Intended URL Storage (Task 80)
- Store current path before redirect
- Use sessionStorage
- Retrieve after login
- Clear after use

### Permission Check (Task 81)
| Mode | Logic |
|------|-------|
| requireAll | All permissions needed |
| !requireAll | Any permission sufficient |

### Unauthorized Page (Task 82)
| Element | Content |
|---------|---------|
| Icon | Lock or shield |
| Title | Access Denied |
| Message | Insufficient permissions |
| Action | Go to Dashboard |

### Session Expiry Detection (Task 83)
- Monitor token expiry
- Detect 401 responses
- Check before each request
- Set timeout for expiry

### Session Expiry Modal (Task 84)
| Element | Description |
|---------|-------------|
| Title | Session Expired |
| Message | Re-login required |
| Action 1 | Login Again |
| Action 2 | Logout |

### Auto Logout (Task 85)
1. Clear auth store
2. Clear tokens
3. Clear query cache
4. Redirect to login
5. Show expiry message

### Final Testing Checklist (Task 86)
| Flow | Test |
|------|------|
| Login | Valid credentials |
| Login | Invalid credentials |
| Registration | Complete flow |
| Forgot Password | Email sent |
| Reset Password | Token valid |
| Email Verification | Token valid |
| 2FA Setup | QR + verify |
| Protected Route | Auth redirect |
| Session Expiry | Modal + logout |
