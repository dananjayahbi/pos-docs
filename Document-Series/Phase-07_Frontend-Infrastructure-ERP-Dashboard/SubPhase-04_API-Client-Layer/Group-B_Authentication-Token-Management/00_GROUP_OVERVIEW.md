# Group B: Authentication & Token Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Implement JWT token storage, management, and authentication service functions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_HTTP-Client-Setup](../Group-A_HTTP-Client-Setup/)
- **→ Next Group:** [Group-C_Request-Response-Interceptors](../Group-C_Request-Response-Interceptors/)

---

## Group Overview

This group implements JWT authentication handling for the frontend. Creates the tokenStorage.ts module with functions for getting, setting, and clearing access and refresh tokens. Implements token expiration checking. Defines authentication types (LoginRequest, LoginResponse, User) and creates the authService with login, logout, token refresh, user retrieval, and password management functions.

### Key Outcomes

- lib/tokenStorage.ts created
- getAccessToken function
- setAccessToken function
- getRefreshToken function
- setRefreshToken function
- clearTokens function
- isTokenExpired function
- Auth types defined
- authService.ts created
- login function (POST /auth/login)
- logout function (POST /auth/logout)
- refreshToken function (POST /auth/refresh)
- getCurrentUser function (GET /auth/me)
- forgotPassword function
- resetPassword function
- changePassword function

### Technology Context

- **Token Storage:** localStorage or HTTP-only cookies
- **JWT Format:** access + refresh token pair
- **Token Decode:** jwt-decode library (optional)
- **Auth Flow:** Login → Store tokens → Attach to requests

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-21_Token-Storage-Module.md` | Create token storage and management functions | 15-21 |
| 02 | `02_Tasks-22-30_Auth-Types-Service.md` | Create auth types and service functions | 22-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create Token Storage Module | Low | Task 02 |
| 16 | Implement getAccessToken | Low | Task 15 |
| 17 | Implement setAccessToken | Low | Task 15 |
| 18 | Implement getRefreshToken | Low | Task 15 |
| 19 | Implement setRefreshToken | Low | Task 15 |
| 20 | Implement clearTokens | Low | Task 15 |
| 21 | Implement isTokenExpired | Medium | Task 15 |
| 22 | Create Auth Types | Low | Task 08 |
| 23 | Create Auth Service | Low | Task 22 |
| 24 | Implement login Function | Medium | Task 23 |
| 25 | Implement logout Function | Low | Task 23 |
| 26 | Implement refreshToken Function | Medium | Task 23 |
| 27 | Implement getCurrentUser Function | Low | Task 23 |
| 28 | Implement forgotPassword Function | Low | Task 23 |
| 29 | Implement resetPassword Function | Low | Task 23 |
| 30 | Implement changePassword Function | Low | Task 23 |

---

## Execution Order

```
Task 15: Create Token Storage Module
    │
    ├────┬────┬────┬────┬────┐
    ▼    ▼    ▼    ▼    ▼    ▼
   16   17   18   19   20   21
   │    │    │    │    │    │
   └────┴────┴────┴────┴────┘
              │
              ▼
        Task 22: Auth Types
              │
              ▼
        Task 23: Auth Service
              │
    ┌────┬────┼────┬────┬────┬────┐
    ▼    ▼    ▼    ▼    ▼    ▼    ▼
   24   25   26   27   28   29   30
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── tokenStorage.ts
├── services/
│   └── api/
│       └── authService.ts
└── types/
    └── auth.ts
```

---

## Notes for AI Agents

### Token Storage Functions (Tasks 16-20)
| Function | Purpose |
|----------|---------|
| getAccessToken | Retrieve access token from storage |
| setAccessToken | Store access token securely |
| getRefreshToken | Retrieve refresh token |
| setRefreshToken | Store refresh token |
| clearTokens | Remove all tokens (logout) |

### Token Storage Options
| Option | Pros | Cons |
|--------|------|------|
| localStorage | Simple, persistent | XSS vulnerable |
| sessionStorage | Tab-isolated | Lost on close |
| HTTP-only cookies | XSS-safe | CSRF needs handling |

### isTokenExpired Logic (Task 21)
- Decode JWT without verification
- Extract exp claim
- Compare with current timestamp
- Return true if expired or missing

### Auth Types (Task 22)
| Type | Fields |
|------|--------|
| LoginRequest | email, password, rememberMe? |
| LoginResponse | accessToken, refreshToken, user |
| User | id, email, firstName, lastName, role, permissions |

### Auth Service Endpoints
| Function | Method | Endpoint |
|----------|--------|----------|
| login | POST | /auth/login |
| logout | POST | /auth/logout |
| refreshToken | POST | /auth/refresh |
| getCurrentUser | GET | /auth/me |
| forgotPassword | POST | /auth/forgot-password |
| resetPassword | POST | /auth/reset-password |
| changePassword | POST | /auth/change-password |

### Login Flow
1. Call login with credentials
2. Receive access + refresh tokens
3. Store both tokens
4. Return user data

### Refresh Flow
1. Access token expires
2. Call refreshToken with refresh token
3. Receive new access token
4. Store new access token
5. Retry original request
