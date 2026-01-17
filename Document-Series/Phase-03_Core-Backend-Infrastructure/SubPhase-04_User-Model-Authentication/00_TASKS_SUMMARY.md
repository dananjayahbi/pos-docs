# SubPhase 04: User Model & Authentication - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 04 of 12  
> **SubPhase Goal:** Implement custom user model with JWT authentication  
> **Total Tasks:** 96 | **Status:** Planning  
> **Estimated Duration:** 8-9 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Base-Models-Mixins](../SubPhase-03_Base-Models-Mixins/)
- **→ Next SubPhase:** [SubPhase-05_Role-Permission-System](../SubPhase-05_Role-Permission-System/)

---

## SubPhase Overview

This sub-phase creates the custom user model and implements JWT-based authentication for the LankaCommerce Cloud platform. The user model supports multi-tenant architecture with email as the primary identifier.

### Key Outcomes
- Custom User model created (email as username)
- Multi-tenant user support implemented
- JWT token authentication working
- Token blacklisting for logout
- Password reset flow implemented
- Email verification flow ready
- User registration API endpoints

### Key Features
- **Email as Username:** No traditional username field
- **Multi-Tenant:** User belongs to specific tenant
- **JWT Auth:** Access token + refresh token
- **Token Blacklist:** Secure logout
- **Password Reset:** Token-based flow
- **Email Verification:** Optional on signup

### Dependencies
- **Requires:** SubPhase-03 (Base Models & Mixins)

---

## Task Execution Order

```
TASK GROUP A: User Model Foundation (Tasks 01-16)
        │
        ▼
TASK GROUP B: User Manager & Signals (Tasks 17-32)
        │
        ▼
TASK GROUP C: JWT Configuration (Tasks 33-48)
        │
        ▼
TASK GROUP D: Authentication Endpoints (Tasks 49-64)
        │
        ▼
TASK GROUP E: Password Reset Flow (Tasks 65-80)
        │
        ▼
TASK GROUP F: Email Verification & Testing (Tasks 81-96)
```

---

## Task Index

### Group A: User Model Foundation (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create User Model File** | apps/users/models.py | SubPhase-03 | 🔴 Not Created |
| 02 | **Import AbstractBaseUser** | Django auth imports | Task 01 | 🔴 Not Created |
| 03 | **Import PermissionsMixin** | Permission support | Task 02 | 🔴 Not Created |
| 04 | **Create User Class** | Custom User model | Task 03 | 🔴 Not Created |
| 05 | **Extend Base Models** | Inherit TimeStamped, Audit | Task 04 | 🔴 Not Created |
| 06 | **Add email Field** | EmailField unique | Task 05 | 🔴 Not Created |
| 07 | **Add first_name Field** | CharField | Task 06 | 🔴 Not Created |
| 08 | **Add last_name Field** | CharField | Task 07 | 🔴 Not Created |
| 09 | **Add is_active Field** | BooleanField default True | Task 08 | 🔴 Not Created |
| 10 | **Add is_staff Field** | BooleanField default False | Task 09 | 🔴 Not Created |
| 11 | **Add is_verified Field** | Email verification status | Task 10 | 🔴 Not Created |
| 12 | **Add date_joined Field** | DateTimeField auto | Task 11 | 🔴 Not Created |
| 13 | **Add last_login Override** | Nullable last_login | Task 12 | 🔴 Not Created |
| 14 | **Set USERNAME_FIELD** | Set to email | Task 13 | 🔴 Not Created |
| 15 | **Set REQUIRED_FIELDS** | List required fields | Task 14 | 🔴 Not Created |
| 16 | **Add __str__ Method** | String representation | Task 15 | 🔴 Not Created |

---

### Group B: User Manager & Signals (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create UserManager File** | apps/users/managers.py | Task 16 | 🔴 Not Created |
| 18 | **Create UserManager Class** | Extend BaseUserManager | Task 17 | 🔴 Not Created |
| 19 | **Implement create_user** | Standard user creation | Task 18 | 🔴 Not Created |
| 20 | **Implement create_superuser** | Admin user creation | Task 19 | 🔴 Not Created |
| 21 | **Add email Normalization** | Lowercase email | Task 20 | 🔴 Not Created |
| 22 | **Assign Manager to User** | objects = UserManager() | Task 21 | 🔴 Not Created |
| 23 | **Update AUTH_USER_MODEL** | Point to custom User | Task 22 | 🔴 Not Created |
| 24 | **Create User Signals File** | apps/users/signals.py | Task 23 | 🔴 Not Created |
| 25 | **Create post_save Signal** | After user creation | Task 24 | 🔴 Not Created |
| 26 | **Add Profile Creation Signal** | Auto-create profile | Task 25 | 🔴 Not Created |
| 27 | **Connect Signals in apps.py** | Signal registration | Task 26 | 🔴 Not Created |
| 28 | **Create UserProfile Model** | Extended user info | Task 27 | 🔴 Not Created |
| 29 | **Add phone_number Field** | Profile phone | Task 28 | 🔴 Not Created |
| 30 | **Add avatar Field** | Profile image | Task 29 | 🔴 Not Created |
| 31 | **Add timezone Field** | User timezone | Task 30 | 🔴 Not Created |
| 32 | **Generate User Migrations** | makemigrations users | Task 31 | 🔴 Not Created |

---

### Group C: JWT Configuration (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create JWT Settings File** | config/settings/jwt.py | Task 32 | 🔴 Not Created |
| 34 | **Configure SIMPLE_JWT** | Main JWT settings | Task 33 | 🔴 Not Created |
| 35 | **Set ACCESS_TOKEN_LIFETIME** | 15 minutes | Task 34 | 🔴 Not Created |
| 36 | **Set REFRESH_TOKEN_LIFETIME** | 7 days | Task 35 | 🔴 Not Created |
| 37 | **Set ROTATE_REFRESH_TOKENS** | True for security | Task 36 | 🔴 Not Created |
| 38 | **Set BLACKLIST_AFTER_ROTATION** | Enable blacklist | Task 37 | 🔴 Not Created |
| 39 | **Set UPDATE_LAST_LOGIN** | Update last_login | Task 38 | 🔴 Not Created |
| 40 | **Configure SIGNING_KEY** | Use settings.SECRET_KEY | Task 39 | 🔴 Not Created |
| 41 | **Set AUTH_HEADER_TYPES** | Bearer | Task 40 | 🔴 Not Created |
| 42 | **Add Token Claims** | Custom JWT claims | Task 41 | 🔴 Not Created |
| 43 | **Create Custom Token Serializer** | Add user data | Task 42 | 🔴 Not Created |
| 44 | **Add user_id to Token** | Include in payload | Task 43 | 🔴 Not Created |
| 45 | **Add email to Token** | Include in payload | Task 44 | 🔴 Not Created |
| 46 | **Add tenant_id to Token** | Include in payload | Task 45 | 🔴 Not Created |
| 47 | **Import JWT Settings** | In base settings | Task 46 | 🔴 Not Created |
| 48 | **Document JWT Configuration** | JWT documentation | Task 47 | 🔴 Not Created |

---

### Group D: Authentication Endpoints (Tasks 49-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create Auth Serializers** | apps/users/serializers.py | Task 48 | 🔴 Not Created |
| 50 | **Create UserSerializer** | User data serializer | Task 49 | 🔴 Not Created |
| 51 | **Create RegisterSerializer** | User registration | Task 50 | 🔴 Not Created |
| 52 | **Create LoginSerializer** | Login validation | Task 51 | 🔴 Not Created |
| 53 | **Add Password Validation** | Django validators | Task 52 | 🔴 Not Created |
| 54 | **Create Auth Views File** | apps/users/views.py | Task 53 | 🔴 Not Created |
| 55 | **Create RegisterView** | User registration API | Task 54 | 🔴 Not Created |
| 56 | **Create LoginView** | Token obtain view | Task 55 | 🔴 Not Created |
| 57 | **Create RefreshView** | Token refresh view | Task 56 | 🔴 Not Created |
| 58 | **Create LogoutView** | Token blacklist view | Task 57 | 🔴 Not Created |
| 59 | **Create MeView** | Current user info | Task 58 | 🔴 Not Created |
| 60 | **Create Auth URLs** | apps/users/urls.py | Task 59 | 🔴 Not Created |
| 61 | **Add register/ Endpoint** | Registration URL | Task 60 | 🔴 Not Created |
| 62 | **Add login/ Endpoint** | Token obtain URL | Task 61 | 🔴 Not Created |
| 63 | **Add logout/ Endpoint** | Token blacklist URL | Task 62 | 🔴 Not Created |
| 64 | **Add me/ Endpoint** | Current user URL | Task 63 | 🔴 Not Created |

---

### Group E: Password Reset Flow (Tasks 65-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create PasswordResetToken Model** | Token storage | Task 64 | 🔴 Not Created |
| 66 | **Add user ForeignKey** | Link to User | Task 65 | 🔴 Not Created |
| 67 | **Add token Field** | Unique token string | Task 66 | 🔴 Not Created |
| 68 | **Add expires_at Field** | Token expiration | Task 67 | 🔴 Not Created |
| 69 | **Add is_used Field** | One-time use flag | Task 68 | 🔴 Not Created |
| 70 | **Create Token Generation Utility** | Generate secure token | Task 69 | 🔴 Not Created |
| 71 | **Create PasswordResetRequestSerializer** | Request serializer | Task 70 | 🔴 Not Created |
| 72 | **Create PasswordResetConfirmSerializer** | Confirm serializer | Task 71 | 🔴 Not Created |
| 73 | **Create PasswordResetRequestView** | Request reset API | Task 72 | 🔴 Not Created |
| 74 | **Create PasswordResetConfirmView** | Confirm reset API | Task 73 | 🔴 Not Created |
| 75 | **Create Email Service** | Send reset email | Task 74 | 🔴 Not Created |
| 76 | **Create Reset Email Template** | HTML template | Task 75 | 🔴 Not Created |
| 77 | **Add password-reset/ Endpoint** | Request URL | Task 76 | 🔴 Not Created |
| 78 | **Add password-reset/confirm/ Endpoint** | Confirm URL | Task 77 | 🔴 Not Created |
| 79 | **Add Token Expiration Check** | Validate not expired | Task 78 | 🔴 Not Created |
| 80 | **Document Password Reset** | Flow documentation | Task 79 | 🔴 Not Created |

---

### Group F: Email Verification & Testing (Tasks 81-96)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create EmailVerificationToken Model** | Verification tokens | Task 80 | 🔴 Not Created |
| 82 | **Add Verification Fields** | user, token, expires_at | Task 81 | 🔴 Not Created |
| 83 | **Create VerificationEmailService** | Send verification | Task 82 | 🔴 Not Created |
| 84 | **Create Verification Email Template** | HTML template | Task 83 | 🔴 Not Created |
| 85 | **Create EmailVerificationView** | Verify email API | Task 84 | 🔴 Not Created |
| 86 | **Create ResendVerificationView** | Resend email API | Task 85 | 🔴 Not Created |
| 87 | **Add verify-email/ Endpoint** | Verification URL | Task 86 | 🔴 Not Created |
| 88 | **Add resend-verification/ Endpoint** | Resend URL | Task 87 | 🔴 Not Created |
| 89 | **Create User Admin Class** | Admin configuration | Task 88 | 🔴 Not Created |
| 90 | **Register User in Admin** | Admin registration | Task 89 | 🔴 Not Created |
| 91 | **Create User Model Tests** | Model unit tests | Task 90 | 🔴 Not Created |
| 92 | **Create Auth Endpoint Tests** | API tests | Task 91 | 🔴 Not Created |
| 93 | **Create JWT Token Tests** | Token tests | Task 92 | 🔴 Not Created |
| 94 | **Create Password Reset Tests** | Reset flow tests | Task 93 | 🔴 Not Created |
| 95 | **Run All Migrations** | Apply all migrations | Task 94 | 🔴 Not Created |
| 96 | **Document Authentication** | Complete auth docs | Task 95 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/users/
├── __init__.py
├── apps.py
├── models.py
│   ├── User
│   ├── UserProfile
│   ├── PasswordResetToken
│   └── EmailVerificationToken
├── managers.py
│   └── UserManager
├── serializers.py
│   ├── UserSerializer
│   ├── RegisterSerializer
│   ├── LoginSerializer
│   ├── PasswordResetRequestSerializer
│   └── PasswordResetConfirmSerializer
├── views.py
│   ├── RegisterView
│   ├── LoginView
│   ├── RefreshView
│   ├── LogoutView
│   ├── MeView
│   ├── PasswordResetRequestView
│   ├── PasswordResetConfirmView
│   ├── EmailVerificationView
│   └── ResendVerificationView
├── urls.py
├── admin.py
├── signals.py
├── services/
│   ├── __init__.py
│   ├── email_service.py
│   └── token_service.py
├── templates/
│   ├── password_reset.html
│   └── email_verification.html
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_views.py
    └── test_auth.py
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│             AUTHENTICATION FLOWS                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  REGISTRATION:                                      │
│  POST /api/v1/auth/register/                       │
│       │                                            │
│       ▼                                            │
│  Create User → Send Verification Email             │
│       │                                            │
│       ▼                                            │
│  Return Access + Refresh Tokens                    │
│                                                     │
│  LOGIN:                                            │
│  POST /api/v1/auth/login/                          │
│       │                                            │
│       ▼                                            │
│  Validate Credentials                              │
│       │                                            │
│       ▼                                            │
│  Return Access + Refresh Tokens                    │
│                                                     │
│  LOGOUT:                                           │
│  POST /api/v1/auth/logout/                         │
│       │                                            │
│       ▼                                            │
│  Blacklist Refresh Token                           │
│                                                     │
│  PASSWORD RESET:                                   │
│  POST /api/v1/auth/password-reset/                 │
│       │                                            │
│       ▼                                            │
│  Send Reset Email with Token                       │
│       │                                            │
│       ▼                                            │
│  POST /api/v1/auth/password-reset/confirm/         │
│       │                                            │
│       ▼                                            │
│  Update Password, Invalidate Token                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 96 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 96 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Email as Username:** No username field, use email
3. **AUTH_USER_MODEL:** Set before first migration
4. **JWT Tokens:** Access (short-lived) + Refresh (long-lived)
5. **Token Blacklist:** Enable for secure logout
6. **Multi-Tenant:** Include tenant_id in JWT claims
7. **Password Validation:** Use Django validators
8. **Email Templates:** HTML for password reset, verification
9. **Testing Required:** Comprehensive auth tests
