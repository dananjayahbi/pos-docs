# Group D: User-Role Management

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** D of F  
> **Tasks Covered:** 47-62  
> **Group Goal:** Create User-Role junction and add permission checking methods to User model

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Role-Permission-Assignment](../Group-C_Role-Permission-Assignment/)
- **→ Next Group:** [Group-E_Permission-Decorators-Mixins](../Group-E_Permission-Decorators-Mixins/)

---

## Group Overview

This group creates the UserRole junction model that assigns roles to users. It also extends the User model with permission checking methods and implements Redis caching for performance.

### Key Components
- **UserRole Model:** Junction table for User-Role
- **UserRoleManager:** Custom manager with helper methods
- **User Extension:** has_perm, has_role, get_permissions methods
- **Permission Caching:** Redis caching for user permissions

### Assignment Flow
```
User ──┬── UserRole ──┬── Role ──┬── RolePermission ──┬── Permission
       │              │          │                    │
       │              ├── is_primary                  │
       │              └── assigned_by                 │
       │                                              │
       └── cached permissions (Redis) ◄───────────────┘
```

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | UserRole Model | Tasks 47-53 | Junction model with fields |
| DOC-02 | UserRoleManager | Tasks 54-57 | Manager with assignment methods |
| DOC-03 | User Permission Methods | Tasks 58-61 | User model extension & caching |
| DOC-04 | Documentation | Task 62 | User-role documentation |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 47 | Create UserRole Model | User-Role junction |
| 48 | Add user ForeignKey | Link to User |
| 49 | Add role ForeignKey | Link to Role |
| 50 | Add assigned_at Field | Assignment timestamp |
| 51 | Add assigned_by ForeignKey | Who assigned (User) |
| 52 | Add is_primary Field | Primary role flag |
| 53 | Create Unique Constraint | User-Role unique |
| 54 | Create UserRoleManager | User role manager |
| 55 | Add assign_role Method | Assign role to user |
| 56 | Add remove_role Method | Remove role from user |
| 57 | Add get_roles Method | Get user's roles |
| 58 | Add User.has_perm Method | Permission check on User |
| 59 | Add User.has_role Method | Role check on User |
| 60 | Add User.get_permissions | Get all user permissions |
| 61 | Cache User Permissions | Redis caching |
| 62 | Document User Roles | User-role documentation |

---

## Execution Order

```
[Tasks 47-53: UserRole Model]
        │
        ▼
[Tasks 54-57: UserRoleManager]
        │
        ▼
[Tasks 58-60: User Model Methods]
        │
        ▼
[Tasks 61-62: Caching & Docs]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/users/
├── models/
│   ├── user_role.py
│   │   └── class UserRole(BaseModel):
│   │       ├── user: ForeignKey (User)
│   │       ├── role: ForeignKey (Role)
│   │       ├── assigned_at: DateTimeField
│   │       ├── assigned_by: ForeignKey (User)
│   │       ├── is_primary: BooleanField
│   │       └── class Meta: unique_together
│   └── user.py (extended)
│       └── class User:
│           ├── has_perm(permission_codename)
│           ├── has_role(role_slug)
│           └── get_all_permissions()
├── managers/
│   └── user_role_manager.py
│       └── class UserRoleManager(Manager):
│           ├── assign_role()
│           ├── remove_role()
│           └── get_roles()
└── cache/
    └── permission_cache.py
        ├── get_user_permissions()
        └── invalidate_user_cache()
```

### User Model Methods
```python
class User(AbstractBaseUser, PermissionsMixin):
    # ... existing fields ...
    
    def has_perm(self, perm, obj=None):
        """Check if user has specific permission."""
        if self.is_superuser:
            return True
        return perm in self.get_all_permissions()
    
    def has_role(self, role_slug):
        """Check if user has specific role."""
        return self.user_roles.filter(role__slug=role_slug).exists()
    
    def get_all_permissions(self):
        """Get all permissions for user (cached)."""
        cache_key = f"user_permissions_{self.id}"
        permissions = cache.get(cache_key)
        if permissions is None:
            permissions = self._fetch_permissions()
            cache.set(cache_key, permissions, timeout=3600)
        return permissions
```

### Redis Cache Keys
```python
CACHE_KEYS = {
    'user_permissions': 'user_permissions_{user_id}',
    'user_roles': 'user_roles_{user_id}',
}
CACHE_TIMEOUT = 3600  # 1 hour
```

---

## Notes for AI Agents

1. **Primary Role:** Each user has one primary role
2. **Multiple Roles:** Users can have multiple roles
3. **Unique Constraint:** User-Role pair is unique
4. **Audit Trail:** Track assigned_at and assigned_by
5. **Permission Aggregation:** Collect from all roles
6. **Cache Invalidation:** Clear cache on role change
7. **Superuser Bypass:** is_superuser has all permissions
8. **Redis Caching:** Cache permissions for 1 hour
