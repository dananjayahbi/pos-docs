# Group B: User Manager & Signals

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Create UserManager and signals for user creation

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_User-Model-Foundation/](../Group-A_User-Model-Foundation/)
- **→ Next Group:** [../Group-C_JWT-Configuration/](../Group-C_JWT-Configuration/)

---

## Group Overview

This group creates the custom UserManager for user creation and signals for automatic actions like profile creation.

### Key Outcomes
- Create managers.py file
- Create UserManager class
- Implement create_user method
- Implement create_superuser method
- Add email normalization
- Assign manager to User model
- Update AUTH_USER_MODEL setting
- Create signals.py file
- Create post_save signal
- Auto-create UserProfile
- Connect signals in apps.py
- Create UserProfile model
- Generate user migrations

### Technology Context
- **BaseUserManager:** Django's user manager
- **Signals:** Django signal framework
- **UserProfile:** Extended user information

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-17-23_Manager-Methods.md | 17-23 | File, class, create_user, create_superuser, normalize, assign, AUTH_USER_MODEL |
| 02 | 02_Tasks-24-32_Signals-Profile.md | 24-32 | Signals file, post_save, profile creation, UserProfile model, migrations |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 17 | Create UserManager File | Task 16 | Simple |
| 18 | Create UserManager Class | Task 17 | Medium |
| 19 | Implement create_user | Task 18 | Medium |
| 20 | Implement create_superuser | Task 19 | Medium |
| 21 | Add email Normalization | Task 20 | Simple |
| 22 | Assign Manager to User | Task 21 | Simple |
| 23 | Update AUTH_USER_MODEL | Task 22 | Simple |
| 24 | Create User Signals File | Task 23 | Simple |
| 25 | Create post_save Signal | Task 24 | Medium |
| 26 | Add Profile Creation Signal | Task 25 | Medium |
| 27 | Connect Signals in apps.py | Task 26 | Simple |
| 28 | Create UserProfile Model | Task 27 | Medium |
| 29 | Add phone_number Field | Task 28 | Simple |
| 30 | Add avatar Field | Task 29 | Simple |
| 31 | Add timezone Field | Task 30 | Simple |
| 32 | Generate User Migrations | Task 31 | Simple |

---

## Execution Order

```
01_Tasks-17-23_Manager-Methods.md
        │
        ▼
02_Tasks-24-32_Signals-Profile.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/users/
├── models.py      # User + UserProfile
├── managers.py    # UserManager
├── signals.py     # User signals
├── apps.py        # Updated with signal connection
└── migrations/
    └── 0001_initial.py
```

---

## UserManager Implementation

```python
# apps/users/managers.py
from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    """Custom manager for User model with email as identifier."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user."""
        if not email:
            raise ValueError('Email is required')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)
```

---

## UserProfile Model

```python
# apps/users/models.py (addition)
class UserProfile(TimeStampedModel):
    """Extended user profile information."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        validators=[PhoneNumberValidator()]
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True
    )
    timezone = models.CharField(
        max_length=50,
        default='Asia/Colombo'
    )
    
    def __str__(self):
        return f"Profile: {self.user.email}"
```

---

## Signal Configuration

```python
# apps/users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create UserProfile when User is created."""
    if created:
        UserProfile.objects.create(user=instance)

# apps/users/apps.py
class UsersConfig(AppConfig):
    name = 'users'
    
    def ready(self):
        import users.signals
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete
2. **Email Normalization:** Lowercase domain
3. **AUTH_USER_MODEL:** Set before first migration
4. **Signals:** Connect in apps.py ready()
5. **Profile Auto-Create:** Signal on user creation
6. **Git Commit:** Commit after completing this group

