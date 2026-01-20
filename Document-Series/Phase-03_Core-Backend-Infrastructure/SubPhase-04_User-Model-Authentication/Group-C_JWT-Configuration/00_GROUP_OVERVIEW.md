# Group C: JWT Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Configure JWT authentication with custom claims

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_User-Manager-Signals/](../Group-B_User-Manager-Signals/)
- **→ Next Group:** [../Group-D_Authentication-Endpoints/](../Group-D_Authentication-Endpoints/)

---

## Group Overview

This group configures JWT (JSON Web Token) authentication using djangorestframework-simplejwt with custom claims for multi-tenant support.

### Key Outcomes
- Create JWT settings file
- Configure SIMPLE_JWT dictionary
- Set token lifetimes (access: 15min, refresh: 7 days)
- Enable token rotation
- Enable token blacklisting
- Configure UPDATE_LAST_LOGIN
- Set signing key
- Configure auth header types
- Add custom token claims
- Create custom token serializer
- Add user_id, email, tenant_id to token
- Import JWT settings in base
- Document configuration

### Technology Context
- **SimpleJWT:** JWT library for DRF
- **Token Rotation:** New refresh token each use
- **Token Blacklist:** Revoke tokens on logout
- **Custom Claims:** Additional JWT payload data

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-33-40_Settings-Lifetimes.md | 33-40 | JWT file, SIMPLE_JWT, lifetimes, rotation, blacklist, signing key |
| 02 | 02_Tasks-41-48_Claims-Serializer-Docs.md | 41-48 | Auth headers, custom claims, serializer, user/email/tenant in token, docs |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 33 | Create JWT Settings File | Task 32 | Simple |
| 34 | Configure SIMPLE_JWT | Task 33 | Medium |
| 35 | Set ACCESS_TOKEN_LIFETIME | Task 34 | Simple |
| 36 | Set REFRESH_TOKEN_LIFETIME | Task 35 | Simple |
| 37 | Set ROTATE_REFRESH_TOKENS | Task 36 | Simple |
| 38 | Set BLACKLIST_AFTER_ROTATION | Task 37 | Simple |
| 39 | Set UPDATE_LAST_LOGIN | Task 38 | Simple |
| 40 | Configure SIGNING_KEY | Task 39 | Simple |
| 41 | Set AUTH_HEADER_TYPES | Task 40 | Simple |
| 42 | Add Token Claims | Task 41 | Medium |
| 43 | Create Custom Token Serializer | Task 42 | Medium |
| 44 | Add user_id to Token | Task 43 | Simple |
| 45 | Add email to Token | Task 44 | Simple |
| 46 | Add tenant_id to Token | Task 45 | Medium |
| 47 | Import JWT Settings | Task 46 | Simple |
| 48 | Document JWT Configuration | Task 47 | Simple |

---

## Execution Order

```
01_Tasks-33-40_Settings-Lifetimes.md
        │
        ▼
02_Tasks-41-48_Claims-Serializer-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/users/
│   └── serializers.py    # Custom token serializer
└── config/settings/
    └── jwt.py            # JWT configuration
```

---

## JWT Settings Configuration

```python
# config/settings/jwt.py
from datetime import timedelta

SIMPLE_JWT = {
    # Token Lifetimes
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    
    # Token Rotation & Blacklist
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    # Signing
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    
    # Auth Header
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    
    # Claims
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    # Custom Claims
    'TOKEN_OBTAIN_SERIALIZER': 'users.serializers.CustomTokenObtainPairSerializer',
}
```

---

## Custom Token Serializer

```python
# apps/users/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import connection

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer with additional claims."""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['user_id'] = user.id
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['is_verified'] = user.is_verified
        
        # Add tenant_id if in tenant context
        if hasattr(connection, 'tenant'):
            token['tenant_id'] = connection.tenant.id
            token['tenant_schema'] = connection.tenant.schema_name
        
        return token
```

---

## Token Payload Structure

```json
{
    "token_type": "access",
    "exp": 1705500000,
    "iat": 1705499100,
    "jti": "unique-token-id",
    "user_id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "is_verified": true,
    "tenant_id": 1,
    "tenant_schema": "tenant_acme"
}
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete
2. **Token Lifetime:** 15 min access, 7 days refresh
3. **Rotation:** New refresh token each use
4. **Blacklist:** Enable for secure logout
5. **tenant_id:** Include for multi-tenant context
6. **Git Commit:** Commit after completing this group

