# Group A: User Model Foundation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create the custom User model with email as username

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_User-Manager-Signals/](../Group-B_User-Manager-Signals/)

---

## Group Overview

This group creates the custom User model that uses email as the primary identifier instead of a username. The model inherits from base models created in SubPhase-03.

### Key Outcomes
- Create User model file
- Import AbstractBaseUser and PermissionsMixin
- Create User class
- Extend TimeStampedModel and AuditModel
- Add email field (unique)
- Add first_name and last_name fields
- Add is_active, is_staff, is_verified fields
- Add date_joined and last_login fields
- Set USERNAME_FIELD to email
- Set REQUIRED_FIELDS
- Add __str__ method

### Technology Context
- **AbstractBaseUser:** Base Django user class
- **PermissionsMixin:** Permission support
- **EMAIL_FIELD:** Email as unique identifier
- **No Username:** Email-only authentication

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-08_Model-Class-Fields.md | 01-08 | Create file, imports, class, email, first_name, last_name |
| 02 | 02_Tasks-09-16_Status-Fields-Meta.md | 09-16 | is_active, is_staff, is_verified, date_joined, USERNAME_FIELD, __str__ |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Create User Model File | SubPhase-03 | Simple |
| 02 | Import AbstractBaseUser | Task 01 | Simple |
| 03 | Import PermissionsMixin | Task 02 | Simple |
| 04 | Create User Class | Task 03 | Medium |
| 05 | Extend Base Models | Task 04 | Simple |
| 06 | Add email Field | Task 05 | Simple |
| 07 | Add first_name Field | Task 06 | Simple |
| 08 | Add last_name Field | Task 07 | Simple |
| 09 | Add is_active Field | Task 08 | Simple |
| 10 | Add is_staff Field | Task 09 | Simple |
| 11 | Add is_verified Field | Task 10 | Simple |
| 12 | Add date_joined Field | Task 11 | Simple |
| 13 | Add last_login Override | Task 12 | Simple |
| 14 | Set USERNAME_FIELD | Task 13 | Simple |
| 15 | Set REQUIRED_FIELDS | Task 14 | Simple |
| 16 | Add __str__ Method | Task 15 | Simple |

---

## Execution Order

```
01_Tasks-01-08_Model-Class-Fields.md
        │
        ▼
02_Tasks-09-16_Status-Fields-Meta.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/users/
└── models.py
    └── User (class)
```

---

## User Model Implementation

```python
# apps/users/models.py
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from core.models import TimeStampedModel

class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """
    Custom user model using email as the primary identifier.
    
    Fields:
        email: Unique email address (used for login)
        first_name: User's first name
        last_name: User's last name
        is_active: Whether user account is active
        is_staff: Whether user can access admin
        is_verified: Whether email is verified
        date_joined: When user registered
    """
    email = models.EmailField(
        unique=True,
        db_index=True,
        help_text="User's email address (used for login)"
    )
    first_name = models.CharField(
        max_length=150,
        blank=True,
        help_text="User's first name"
    )
    last_name = models.CharField(
        max_length=150,
        blank=True,
        help_text="User's last name"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether user account is active"
    )
    is_staff = models.BooleanField(
        default=False,
        help_text="Whether user can access admin site"
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether email has been verified"
    )
    date_joined = models.DateTimeField(
        default=timezone.now,
        help_text="When the user registered"
    )
    last_login = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the user last logged in"
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        return self.first_name
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-03 complete
2. **Email as Username:** No username field
3. **AbstractBaseUser:** Not AbstractUser
4. **PermissionsMixin:** For permission support
5. **AUTH_USER_MODEL:** Set before migrations
6. **Git Commit:** Commit after completing this group

