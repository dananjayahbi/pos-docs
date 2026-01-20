# Group F: Email Verification & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** F of F  
> **Tasks Covered:** 81-96  
> **Group Goal:** Implement email verification and create comprehensive tests

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Password-Reset-Flow/](../Group-E_Password-Reset-Flow/)
- **→ Next SubPhase:** [../../SubPhase-05_Role-Permission-System/](../../SubPhase-05_Role-Permission-System/)

---

## Group Overview

This group implements email verification for new users and creates comprehensive tests for all authentication functionality.

### Key Outcomes
- Create EmailVerificationToken model
- Add verification fields
- Create verification email service
- Create verification email template
- Create EmailVerificationView
- Create ResendVerificationView
- Add verification endpoints
- Create User admin class
- Register User in admin
- Create user model tests
- Create auth endpoint tests
- Create JWT token tests
- Create password reset tests
- Run all migrations
- Document authentication

### Technology Context
- **Email Verification:** Verify user email ownership
- **Django Admin:** Custom user admin
- **Testing:** pytest with DRF test client
- **Migrations:** Apply all user migrations

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-81-88_Verification-Flow.md | 81-88 | Token model, email service, views, endpoints |
| 02 | 02_Tasks-89-92_Admin-Model-Tests.md | 89-92 | Admin class, registration, model tests, API tests |
| 03 | 03_Tasks-93-96_JWT-Reset-Tests-Docs.md | 93-96 | JWT tests, reset tests, migrations, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 81 | Create EmailVerificationToken Model | Task 80 | Medium |
| 82 | Add Verification Fields | Task 81 | Simple |
| 83 | Create VerificationEmailService | Task 82 | Medium |
| 84 | Create Verification Email Template | Task 83 | Simple |
| 85 | Create EmailVerificationView | Task 84 | Medium |
| 86 | Create ResendVerificationView | Task 85 | Medium |
| 87 | Add verify-email/ Endpoint | Task 86 | Simple |
| 88 | Add resend-verification/ Endpoint | Task 87 | Simple |
| 89 | Create User Admin Class | Task 88 | Medium |
| 90 | Register User in Admin | Task 89 | Simple |
| 91 | Create User Model Tests | Task 90 | Medium |
| 92 | Create Auth Endpoint Tests | Task 91 | Medium |
| 93 | Create JWT Token Tests | Task 92 | Medium |
| 94 | Create Password Reset Tests | Task 93 | Medium |
| 95 | Run All Migrations | Task 94 | Simple |
| 96 | Document Authentication | Task 95 | Medium |

---

## Execution Order

```
01_Tasks-81-88_Verification-Flow.md
        │
        ▼
02_Tasks-89-92_Admin-Model-Tests.md
        │
        ▼
03_Tasks-93-96_JWT-Reset-Tests-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/users/
├── models.py             # + EmailVerificationToken
├── views.py              # + Verification views
├── urls.py               # + Verification endpoints
├── admin.py              # User admin
├── services/
│   └── email_service.py  # + Verification method
├── templates/
│   ├── password_reset.html
│   └── email_verification.html
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_views.py
    ├── test_auth.py
    └── test_tokens.py
```

---

## EmailVerificationToken Model

```python
# apps/users/models.py (addition)
class EmailVerificationToken(TimeStampedModel):
    """Token for email verification."""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='verification_tokens'
    )
    token = models.CharField(
        max_length=64,
        unique=True,
        db_index=True
    )
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)
    
    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at
```

---

## User Admin Configuration

```python
# apps/users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 
                    'is_active', 'is_verified', 'date_joined']
    list_filter = ['is_active', 'is_staff', 'is_verified']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 
                                     'is_superuser', 'is_verified',
                                     'groups', 'user_permissions')}),
        ('Dates', {'fields': ('date_joined', 'last_login')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name',
                      'password1', 'password2'),
        }),
    )
    
    inlines = [UserProfileInline]
```

---

## Test Structure

```python
# apps/users/tests/test_models.py
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

class TestUserModel:
    def test_create_user(self):
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        assert user.email == 'test@example.com'
        assert user.is_active
        assert not user.is_staff
        assert not user.is_superuser
    
    def test_create_superuser(self):
        user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123'
        )
        assert user.is_staff
        assert user.is_superuser
        assert user.is_verified

# apps/users/tests/test_views.py
class TestAuthEndpoints:
    def test_register_user(self, api_client):
        response = api_client.post('/api/v1/auth/register/', {
            'email': 'new@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'securepass123',
            'password_confirm': 'securepass123',
        })
        assert response.status_code == 201
        assert 'tokens' in response.data
```

---

## Complete Auth API Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| /auth/register/ | POST | User registration |
| /auth/login/ | POST | Get JWT tokens |
| /auth/token/refresh/ | POST | Refresh access token |
| /auth/logout/ | POST | Blacklist refresh token |
| /auth/me/ | GET/PUT | Current user info |
| /auth/password-reset/ | POST | Request password reset |
| /auth/password-reset/confirm/ | POST | Confirm password reset |
| /auth/verify-email/ | POST | Verify email address |
| /auth/resend-verification/ | POST | Resend verification email |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group E complete
2. **Verification Expiry:** 7 days default
3. **Admin Customization:** Custom fieldsets for email login
4. **Comprehensive Tests:** Test all flows
5. **Migrations:** Run makemigrations and migrate
6. **Final Group:** Complete SubPhase-04 documentation
7. **Git Commit:** Commit after completing SubPhase-04

