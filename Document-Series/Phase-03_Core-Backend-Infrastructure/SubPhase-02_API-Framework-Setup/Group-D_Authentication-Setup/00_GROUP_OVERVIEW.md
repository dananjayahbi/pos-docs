# Group D: Authentication Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 02 - API Framework Setup  
> **Group:** D of F  
> **Tasks Covered:** 43-56  
> **Group Goal:** Configure JWT authentication with SimpleJWT

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Versioning-Routing/](../Group-C_Versioning-Routing/)
- **→ Next Group:** [../Group-E_Throttling-CORS/](../Group-E_Throttling-CORS/)

---

## Group Overview

This group configures JWT authentication using djangorestframework-simplejwt, including token lifetimes, rotation, blacklisting, and authentication endpoints.

### Key Outcomes
- Configure SIMPLE_JWT settings dictionary
- Set access token lifetime (15 minutes)
- Set refresh token lifetime (7 days)
- Enable token rotation
- Enable token blacklisting
- Configure signing key
- Set algorithm (HS256)
- Configure auth header types (Bearer)
- Add token blacklist app
- Create token obtain endpoint
- Create token refresh endpoint
- Create token verify endpoint
- Create logout (blacklist) endpoint
- Test and document authentication

### Technology Context
- **SimpleJWT:** JWT token library for DRF
- **Access Token:** Short-lived (15 min)
- **Refresh Token:** Long-lived (7 days)
- **Token Blacklist:** Revoke tokens on logout

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-43-48_JWT-Settings.md | 43-48 | SIMPLE_JWT dict, lifetimes, rotation, blacklist, signing key |
| 02 | 02_Tasks-49-53_Algorithm-Headers-URLs.md | 49-53 | Algorithm, auth headers, blacklist app, token obtain/refresh |
| 03 | 03_Tasks-54-56_Verify-Logout-Docs.md | 54-56 | Token verify, logout endpoint, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 43 | Configure SIMPLE_JWT Settings | Task 42 | Medium |
| 44 | Set ACCESS_TOKEN_LIFETIME | Task 43 | Simple |
| 45 | Set REFRESH_TOKEN_LIFETIME | Task 44 | Simple |
| 46 | Set ROTATE_REFRESH_TOKENS | Task 45 | Simple |
| 47 | Set BLACKLIST_AFTER_ROTATION | Task 46 | Simple |
| 48 | Configure SIGNING_KEY | Task 47 | Simple |
| 49 | Set ALGORITHM | Task 48 | Simple |
| 50 | Configure AUTH_HEADER_TYPES | Task 49 | Simple |
| 51 | Add Token Blacklist App | Task 50 | Simple |
| 52 | Create Token URLs | Task 51 | Medium |
| 53 | Create Token Verify URL | Task 52 | Simple |
| 54 | Create Logout URL | Task 53 | Medium |
| 55 | Test Token Generation | Task 54 | Simple |
| 56 | Document Authentication | Task 55 | Medium |

---

## Execution Order

```
01_Tasks-43-48_JWT-Settings.md
        │
        ▼
02_Tasks-49-53_Algorithm-Headers-URLs.md
        │
        ▼
03_Tasks-54-56_Verify-Logout-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── config/
│   ├── settings/
│   │   └── jwt.py            # JWT configuration
│   └── api_urls.py           # Updated with auth URLs
└── docs/api/
    └── authentication.md
```

---

## JWT Configuration

```python
# config/settings/jwt.py
from datetime import timedelta

SIMPLE_JWT = {
    # Token Lifetimes
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    
    # Token Rotation
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    
    # Signing
    'SIGNING_KEY': SECRET_KEY,
    'ALGORITHM': 'HS256',
    
    # Auth Headers
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    
    # Token Claims
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    # Token Types
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}
```

---

## Authentication URLs

```python
# config/api_urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # JWT Authentication
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/logout/', LogoutView.as_view(), name='token_blacklist'),
]
```

---

## Token Flow

```
┌─────────────┐     POST /auth/token/     ┌─────────────┐
│   Client    │ ──────────────────────────►│   Server    │
│             │   username, password       │             │
│             │◄──────────────────────────│             │
│             │   access_token,           │             │
│             │   refresh_token           │             │
└─────────────┘                           └─────────────┘
       │
       │  Authorization: Bearer <access_token>
       ▼
┌─────────────┐                           ┌─────────────┐
│   Client    │ ──────────────────────────►│  API Call   │
│             │   Protected Resource       │             │
└─────────────┘                           └─────────────┘
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete
2. **Token Lifetime:** 15 min access, 7 days refresh
3. **Rotation:** Enable for security
4. **Blacklisting:** Required for logout
5. **Bearer Token:** Standard auth header type
6. **Git Commit:** Commit after completing this group

