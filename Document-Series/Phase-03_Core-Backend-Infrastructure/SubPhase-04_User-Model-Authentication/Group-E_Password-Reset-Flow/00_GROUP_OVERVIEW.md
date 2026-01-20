# Group E: Password Reset Flow

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** E of F  
> **Tasks Covered:** 65-80  
> **Group Goal:** Implement secure password reset flow

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Authentication-Endpoints/](../Group-D_Authentication-Endpoints/)
- **→ Next Group:** [../Group-F_Email-Verification-Testing/](../Group-F_Email-Verification-Testing/)

---

## Group Overview

This group implements a secure token-based password reset flow with email notification.

### Key Outcomes
- Create PasswordResetToken model
- Add user FK, token, expires_at, is_used fields
- Create token generation utility
- Create PasswordResetRequestSerializer
- Create PasswordResetConfirmSerializer
- Create PasswordResetRequestView
- Create PasswordResetConfirmView
- Create email service
- Create reset email template
- Add password-reset endpoints
- Add token expiration validation
- Document password reset flow

### Technology Context
- **Token-based Reset:** Secure random tokens
- **Email Service:** Send reset emails
- **Expiration:** Tokens expire after set time
- **One-time Use:** Tokens invalidated after use

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-65-70_Token-Model.md | 65-70 | PasswordResetToken model, fields, token generation utility |
| 02 | 02_Tasks-71-76_Views-Email.md | 71-76 | Serializers, views, email service, template |
| 03 | 03_Tasks-77-80_URLs-Validation-Docs.md | 77-80 | Endpoints, expiration check, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 65 | Create PasswordResetToken Model | Task 64 | Medium |
| 66 | Add user ForeignKey | Task 65 | Simple |
| 67 | Add token Field | Task 66 | Simple |
| 68 | Add expires_at Field | Task 67 | Simple |
| 69 | Add is_used Field | Task 68 | Simple |
| 70 | Create Token Generation Utility | Task 69 | Medium |
| 71 | Create PasswordResetRequestSerializer | Task 70 | Medium |
| 72 | Create PasswordResetConfirmSerializer | Task 71 | Medium |
| 73 | Create PasswordResetRequestView | Task 72 | Medium |
| 74 | Create PasswordResetConfirmView | Task 73 | Medium |
| 75 | Create Email Service | Task 74 | Medium |
| 76 | Create Reset Email Template | Task 75 | Simple |
| 77 | Add password-reset/ Endpoint | Task 76 | Simple |
| 78 | Add password-reset/confirm/ Endpoint | Task 77 | Simple |
| 79 | Add Token Expiration Check | Task 78 | Simple |
| 80 | Document Password Reset | Task 79 | Simple |

---

## Execution Order

```
01_Tasks-65-70_Token-Model.md
        │
        ▼
02_Tasks-71-76_Views-Email.md
        │
        ▼
03_Tasks-77-80_URLs-Validation-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/users/
├── models.py             # + PasswordResetToken
├── serializers.py        # + Reset serializers
├── views.py              # + Reset views
├── urls.py               # + Reset endpoints
├── services/
│   ├── __init__.py
│   └── email_service.py
└── templates/
    └── password_reset.html
```

---

## PasswordResetToken Model

```python
# apps/users/models.py (addition)
import secrets
from datetime import timedelta
from django.utils import timezone

class PasswordResetToken(TimeStampedModel):
    """Token for password reset requests."""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_tokens'
    )
    token = models.CharField(
        max_length=64,
        unique=True,
        db_index=True
    )
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)
    
    def is_valid(self):
        """Check if token is valid."""
        return (
            not self.is_used and
            timezone.now() < self.expires_at
        )
    
    def invalidate(self):
        """Mark token as used."""
        self.is_used = True
        self.save(update_fields=['is_used'])
```

---

## Password Reset Flow

```
┌─────────────────────────────────────────────────┐
│           PASSWORD RESET FLOW                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. POST /api/v1/auth/password-reset/          │
│     { "email": "user@example.com" }            │
│          │                                      │
│          ▼                                      │
│     Create PasswordResetToken                   │
│          │                                      │
│          ▼                                      │
│     Send Email with Reset Link                  │
│          │                                      │
│          ▼                                      │
│  2. User clicks link in email                  │
│          │                                      │
│          ▼                                      │
│  3. POST /api/v1/auth/password-reset/confirm/  │
│     { "token": "xxx", "password": "new" }      │
│          │                                      │
│          ▼                                      │
│     Validate Token (not expired, not used)     │
│          │                                      │
│          ▼                                      │
│     Update Password                             │
│          │                                      │
│          ▼                                      │
│     Invalidate Token                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Email Service

```python
# apps/users/services/email_service.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

class EmailService:
    """Service for sending emails."""
    
    @staticmethod
    def send_password_reset(user, token):
        """Send password reset email."""
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        
        context = {
            'user': user,
            'reset_url': reset_url,
            'expires_in': '24 hours',
        }
        
        html_content = render_to_string(
            'password_reset.html',
            context
        )
        
        send_mail(
            subject='Password Reset Request',
            message=f'Reset your password: {reset_url}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
        )
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group D complete
2. **Token Security:** Use secrets.token_urlsafe
3. **Expiration:** 24 hours default
4. **One-time Use:** Mark used after consumption
5. **Email Template:** HTML for better formatting
6. **Git Commit:** Commit after completing this group

