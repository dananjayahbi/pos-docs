# Group E: Session & Remember Me

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Create token management, session persistence, and cart merge on login

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Password-Reset](../Group-D_Password-Reset/)
- **→ Next Group:** [Group-F_Social-Login-Testing](../Group-F_Social-Login-Testing/)

---

## Group Overview

This group creates session management and token handling. Creates token storage using httpOnly cookies for access and refresh tokens. Creates token refresh logic with auto-refresh before expiry. Creates Axios interceptor to attach tokens to requests and 401 handler for expired tokens. Creates remember me logic to extend session duration. Creates auth state hydration to restore auth on page load. Creates logout logic to clear tokens with API call and redirect. Creates session expiry warning before token expires. Creates cart merge on login to combine guest cart with user cart. Verifies complete session management lifecycle.

### Key Outcomes

- Token storage service
- Access token cookie
- Refresh token cookie
- Token refresh logic
- Axios interceptor
- 401 error handler
- Remember me logic
- Auth state hydration
- Logout logic
- Logout API call
- Logout redirect
- Session expiry warning
- Cart merge on login
- Session management verified

### Technology Context

- **Tokens:** JWT (access + refresh)
- **Storage:** httpOnly cookies
- **Refresh:** Auto before expiry
- **Intercept:** Axios middleware

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-76_Tokens-Hydration.md` | Create token management and hydration | 69-76 |
| 02 | `02_Tasks-77-82_Logout-Cart-Verify.md` | Create logout, cart merge, and verification | 77-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create Token Storage | Medium | Task 68 |
| 70 | Create Access Token Cookie | Low | Task 69 |
| 71 | Create Refresh Token Cookie | Low | Task 69 |
| 72 | Create Token Refresh Logic | High | Task 71 |
| 73 | Create Axios Interceptor | Medium | Task 72 |
| 74 | Create 401 Handler | Medium | Task 73 |
| 75 | Create Remember Me Logic | Medium | Task 41 |
| 76 | Create Hydrate Auth State | Medium | Task 69 |
| 77 | Create Logout Logic | Low | Task 11 |
| 78 | Create Logout API Call | Low | Task 77 |
| 79 | Create Logout Redirect | Low | Task 78 |
| 80 | Create Session Expiry Warning | Medium | Task 72 |
| 81 | Create Cart Merge on Login | High | Task 46 |
| 82 | Verify Session Management | Low | Task 81 |

---

## Execution Order

```
Task 69: Token Storage
    │
    ├────────┬────────┐
    ▼        ▼        │
T-70     T-71        │
(Access)(Refresh)    │
    │        │        │
    └────────┘        │
         │            │
         ▼            │
    Task 72: Refresh Logic
         │            │
         ▼            │
    Task 73: Axios Interceptor
         │            │
         ▼            │
    Task 74: 401 Handler
         │            │
    ┌────┴────┐       │
    │         │       │
    ▼         ▼       │
T-75      T-76       │
(Remember)(Hydrate)  │
    │         │       │
    └────┬────┘       │
         │            │
Task 41 ─┘            │
(Remember Me)         │
                      │
Task 11: Logout Action│
    │                 │
    ▼                 │
Task 77: Logout Logic │
    │                 │
    ▼                 │
Task 78: Logout API   │
    │                 │
    ▼                 │
Task 79: Logout Redirect
    │                 │
    └─────────────────┘
              │
              ▼
        Task 80: Session Expiry Warning
              │
              ▼
Task 46 ──────┤
(Token)       │
              ▼
        Task 81: Cart Merge
              │
              ▼
        Task 82: Verify
```

---

## Expected Deliverables

```
frontend/
├── services/
│   └── storefront/
│       └── auth/
│           ├── tokenService.ts
│           └── sessionService.ts
├── lib/
│   └── axios/
│       ├── axiosInstance.ts
│       └── axiosInterceptor.ts
├── hooks/
│   └── storefront/
│       ├── useTokenRefresh.ts
│       ├── useHydrateAuth.ts
│       └── useSessionWarning.ts
└── components/
    └── storefront/
        └── auth/
            └── SessionWarning/
                ├── SessionExpiryWarning.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Token Storage (Task 69)
| Token | Location |
|-------|----------|
| accessToken | httpOnly cookie |
| refreshToken | httpOnly cookie |
| Why httpOnly | Prevent XSS access |

### Access Token Cookie (Task 70)
| Setting | Value |
|---------|-------|
| Name | access_token |
| HttpOnly | Yes |
| Secure | Yes (prod) |
| SameSite | Strict |
| Expiry | 15 minutes |

### Refresh Token Cookie (Task 71)
| Setting | Value |
|---------|-------|
| Name | refresh_token |
| HttpOnly | Yes |
| Secure | Yes (prod) |
| SameSite | Strict |
| Expiry | 7 days (30 if remember) |

### Token Refresh Logic (Task 72)
| Trigger | Action |
|---------|--------|
| Access expired | Call refresh endpoint |
| 2 min before | Proactive refresh |
| Refresh valid | Get new access token |
| Refresh expired | Force logout |

### Axios Interceptor (Task 73)
| Hook | Action |
|------|--------|
| Request | Attach access token |
| Response | Handle normally |
| 401 Error | Trigger refresh or logout |

### 401 Handler (Task 74)
| Scenario | Action |
|----------|--------|
| Access expired | Try refresh |
| Refresh valid | Retry request |
| Refresh expired | Logout user |
| Queue requests | During refresh |

### Remember Me Logic (Task 75)
| Option | Token Expiry |
|--------|--------------|
| Unchecked | 7 days |
| Checked | 30 days |
| Storage | Cookie maxAge |

### Hydrate Auth State (Task 76)
| On App Load | Action |
|-------------|--------|
| Check cookie | Exists? |
| If exists | Fetch user profile |
| If valid | Set auth state |
| If invalid | Clear and logout |

### Logout Logic (Task 77)
| Step | Action |
|------|--------|
| 1 | Clear local state |
| 2 | Call logout API |
| 3 | Clear cookies |
| 4 | Clear cart (optional) |
| 5 | Redirect |

### Session Expiry Warning (Task 80)
| Trigger | 5 min before expiry |
| UI | Modal / toast |
| Options | "Stay logged in" / Logout |
| Stay | Refresh token |

### Cart Merge on Login (Task 81)
| Scenario | Action |
|----------|--------|
| Guest cart empty | Use user cart |
| User cart empty | Keep guest cart |
| Both have items | Merge (combine quantities) |
| Conflict | Guest cart overwrites |
| API | /api/cart/merge |
