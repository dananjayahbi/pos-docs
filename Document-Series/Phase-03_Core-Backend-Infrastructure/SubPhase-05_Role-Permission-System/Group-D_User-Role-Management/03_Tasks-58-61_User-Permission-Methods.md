# Tasks 58-61: User Permission Methods

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** D - User-Role Management  
> **Document:** 03 of 04  
> **Tasks Covered:** 58, 59, 60, 61

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-54-57_UserRoleManager.md](02_Tasks-54-57_UserRoleManager.md)
- **→ Next Document:** [04_Task-62_Documentation.md](04_Task-62_Documentation.md)

---

## Document Overview

This document covers the extension of the User model with permission checking methods and Redis-based permission caching for performance optimization. These methods enable efficient permission checking at the user level.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 58 | Add User.has_perm Method | Medium |
| 59 | Add User.has_role Method | Simple |
| 60 | Add User.get_all_permissions Method | Complex |
| 61 | Cache User Permissions | Complex |

---

## Task 58: Add User.has_perm Method

### Overview
Add a `has_perm` method to the User model that checks if the user has a specific permission by codename. This method supports Django's standard permission checking pattern.

### Dependencies
- Task 57: Add get_roles Method
- RolePermission model from Group C
- Permission model from Group B

### Instructions

1. **Locate User model file**
   - Navigate to `backend/apps/users/models/user.py`
   - Find the User class definition

2. **Add has_perm method**
   - Method name: `has_perm`
   - Parameters: `self`, `perm` (permission codename), `obj=None` (optional object)
   - Return type: `bool`

3. **Implement superuser check**
   - If user is superuser, return `True` immediately
   - Superusers have all permissions by default

4. **Implement permission lookup**
   - Get all user permissions using `get_all_permissions()` (Task 60)
   - Check if `perm` codename exists in permissions set
   - Return boolean result

5. **Handle permission format**
   - Accept codename only: `"view_product"`
   - Accept app.codename format: `"products.view_product"`
   - Normalize to compare both formats

6. **Add docstring**
   - Explain method purpose
   - Document parameters
   - Document return value
   - Include usage examples

### Method Signature
```python
def has_perm(self, perm: str, obj=None) -> bool:
    """
    Check if user has specific permission.
    
    Args:
        perm: Permission codename (e.g., 'view_product' or 'products.view_product')
        obj: Optional object for object-level permissions (future use)
    
    Returns:
        bool: True if user has permission, False otherwise
    
    Examples:
        >>> user.has_perm('view_product')
        True
        >>> user.has_perm('products.delete_product')
        False
    """
```

### Implementation Logic
```python
def has_perm(self, perm: str, obj=None) -> bool:
    # Superuser check
    if self.is_active and self.is_superuser:
        return True
    
    # Get all permissions (cached)
    permissions = self.get_all_permissions()
    
    # Check permission (handle both formats)
    if '.' in perm:
        # Format: 'app_label.codename'
        return perm in permissions
    else:
        # Format: 'codename' - check if any permission ends with it
        return any(p.endswith(f'.{perm}') for p in permissions)
```

### Permission Format Examples
| Input Format | Internal Format | Match |
|--------------|-----------------|-------|
| `view_product` | `products.view_product` | ✓ |
| `products.view_product` | `products.view_product` | ✓ |
| `delete_product` | `products.view_product` | ✗ |

### Expected Outcome
```python
# User model has permission checking
user = User.objects.get(id=1)
user.has_perm('view_product')  # Returns True/False
user.has_perm('products.change_product')  # Returns True/False
```

### Verification Checklist
- [ ] `has_perm` method added to User model
- [ ] Superuser check returns `True` for superusers
- [ ] Method uses cached permissions from `get_all_permissions()`
- [ ] Both permission formats are supported (codename and app.codename)
- [ ] Docstring explains parameters and return value
- [ ] Method returns boolean value

---

## Task 59: Add User.has_role Method

### Overview
Add a `has_role` method to the User model that checks if the user has been assigned a specific role by slug.

### Dependencies
- Task 53: Create Unique Constraint (UserRole model complete)
- Task 57: Add get_roles Method

### Instructions

1. **Locate User model file**
   - Navigate to `backend/apps/users/models/user.py`
   - Find the User class definition

2. **Add has_role method**
   - Method name: `has_role`
   - Parameters: `self`, `role_slug` (role identifier)
   - Return type: `bool`

3. **Implement role lookup**
   - Query `UserRole` model for relationship
   - Filter by current user and role slug
   - Use `exists()` for efficient boolean check

4. **Add caching consideration**
   - Method queries database directly
   - Could be enhanced with caching in future
   - For now, keep implementation simple

5. **Add docstring**
   - Explain method purpose
   - Document parameters
   - Document return value
   - Include usage examples

### Method Signature
```python
def has_role(self, role_slug: str) -> bool:
    """
    Check if user has specific role.
    
    Args:
        role_slug: Role slug identifier (e.g., 'store-admin')
    
    Returns:
        bool: True if user has role, False otherwise
    
    Examples:
        >>> user.has_role('store-admin')
        True
        >>> user.has_role('system-admin')
        False
    """
```

### Implementation Logic
```python
def has_role(self, role_slug: str) -> bool:
    return self.user_roles.filter(role__slug=role_slug).exists()
```

### Alternative Implementation with Caching
```python
def has_role(self, role_slug: str) -> bool:
    """Check if user has specific role (uses cached roles)."""
    cache_key = f"user_roles_{self.id}"
    cached_roles = cache.get(cache_key)
    
    if cached_roles is None:
        # Fetch from database
        cached_roles = list(
            self.user_roles.values_list('role__slug', flat=True)
        )
        cache.set(cache_key, cached_roles, timeout=3600)
    
    return role_slug in cached_roles
```

### Expected Outcome
```python
# User model has role checking
user = User.objects.get(id=1)
user.has_role('store-admin')  # Returns True/False
user.has_role('cashier')  # Returns True/False
```

### Verification Checklist
- [ ] `has_role` method added to User model
- [ ] Method queries UserRole relationships
- [ ] Uses `exists()` for efficient boolean check
- [ ] Docstring explains parameters and return value
- [ ] Method returns boolean value
- [ ] Method accepts role slug as parameter

---

## Task 60: Add User.get_all_permissions Method

### Overview
Add a `get_all_permissions` method to the User model that retrieves all permissions from all user's roles, including permissions inherited from parent roles.

### Dependencies
- Task 53: Create Unique Constraint (UserRole model complete)
- Task 45: Add RolePermission.get_inherited_permissions Method
- Permission model from Group B

### Instructions

1. **Locate User model file**
   - Navigate to `backend/apps/users/models/user.py`
   - Find the User class definition

2. **Add get_all_permissions method**
   - Method name: `get_all_permissions`
   - Parameters: `self`, `include_inactive=False` (optional)
   - Return type: `set[str]`

3. **Handle superuser case**
   - If user is superuser, optionally return all permissions
   - Or return empty set to check at application level
   - Document behavior in docstring

4. **Query user's roles**
   - Get all roles assigned to user via UserRole
   - Include only active roles (is_active=True)
   - Use select_related for efficiency

5. **Collect permissions from each role**
   - For each role, get role permissions
   - Use RolePermission model to fetch permissions
   - Call `get_inherited_permissions()` to include parent permissions

6. **Build permissions set**
   - Create set to store unique permissions
   - Format: `"app_label.codename"`
   - Example: `"products.view_product"`

7. **Return permissions set**
   - Return set of permission strings
   - Empty set if user has no permissions

8. **Add docstring**
   - Explain method purpose
   - Document parameters
   - Document return value
   - Include usage examples

### Method Signature
```python
def get_all_permissions(self, include_inactive: bool = False) -> set[str]:
    """
    Get all permissions for user from all assigned roles.
    
    Includes permissions inherited from parent roles in the role hierarchy.
    Permissions are returned in 'app_label.codename' format.
    
    Args:
        include_inactive: Include permissions from inactive roles (default: False)
    
    Returns:
        set[str]: Set of permission strings in format 'app_label.codename'
    
    Examples:
        >>> user.get_all_permissions()
        {'products.view_product', 'products.change_product', 'orders.view_order'}
    """
```

### Implementation Logic
```python
def get_all_permissions(self, include_inactive: bool = False) -> set[str]:
    # Import here to avoid circular imports
    from apps.rbac.models import RolePermission
    
    # Superuser has all permissions
    if self.is_active and self.is_superuser:
        # Return all permissions or empty set (to check elsewhere)
        return set()  # Or fetch all permissions from database
    
    # Build role filter
    role_filter = {'user': self}
    if not include_inactive:
        role_filter['role__is_active'] = True
    
    # Get all user's roles
    user_roles = self.user_roles.filter(**role_filter).select_related('role')
    
    # Collect all permissions
    permissions = set()
    
    for user_role in user_roles:
        # Get role permissions with inheritance
        role_perms = RolePermission.objects.get_inherited_permissions(
            role=user_role.role
        )
        
        # Add to set (format: 'app_label.codename')
        for perm in role_perms:
            permissions.add(f"{perm.content_type.app_label}.{perm.codename}")
    
    return permissions
```

### Permission Collection Flow
```
User
  └── UserRole (Cashier)
       └── Role (Cashier)
            ├── RolePermission (view_product)
            ├── RolePermission (create_order)
            └── parent_role (Employee)
                 ├── RolePermission (view_order)
                 └── RolePermission (view_inventory)

Result: {
    'products.view_product',
    'orders.create_order',
    'orders.view_order',
    'inventory.view_inventory'
}
```

### Performance Considerations
| Concern | Solution |
|---------|----------|
| Multiple DB queries | Use select_related and prefetch_related |
| Permission inheritance | Leverage Task 45's get_inherited_permissions |
| Repeated calls | Cache results (Task 61) |
| Large permission sets | Return set (not list) for O(1) lookups |

### Expected Outcome
```python
# User model can fetch all permissions
user = User.objects.get(id=1)
permissions = user.get_all_permissions()
# Returns: {'products.view_product', 'orders.change_order', ...}

# Check for specific permission
if 'products.delete_product' in permissions:
    # User can delete products
    pass
```

### Verification Checklist
- [ ] `get_all_permissions` method added to User model
- [ ] Method queries all user roles via UserRole
- [ ] Method includes inherited permissions from parent roles
- [ ] Returns set of strings in `app_label.codename` format
- [ ] Handles inactive roles (exclude by default)
- [ ] Uses efficient queries (select_related)
- [ ] Docstring explains parameters and return value

---

## Task 61: Cache User Permissions

### Overview
Implement Redis-based caching for user permissions to improve performance and reduce database queries. Cache permissions with a TTL and invalidate when user roles change.

### Dependencies
- Task 60: Add User.get_all_permissions Method
- Task 55: Add assign_role Method (for cache invalidation)
- Task 56: Add remove_role Method (for cache invalidation)
- Redis configured in Django settings

### Instructions

1. **Create permission cache utility module**
   - Create file: `backend/apps/users/cache/permission_cache.py`
   - Import Django cache framework
   - Import User model

2. **Define cache key pattern**
   - Pattern: `user_permissions_{user_id}`
   - Example: `user_permissions_123`
   - Consistent format for easy invalidation

3. **Create get_user_permissions function**
   - Function name: `get_user_permissions`
   - Parameters: `user` (User instance)
   - Return type: `set[str]`
   - Check cache first, fetch from DB if miss

4. **Implement cache retrieval**
   - Generate cache key from user ID
   - Try to get from Redis cache
   - If cache hit, return cached permissions
   - If cache miss, call `user.get_all_permissions()`
   - Store in cache with TTL (3600 seconds = 1 hour)
   - Return permissions

5. **Create invalidate_user_permissions function**
   - Function name: `invalidate_user_permissions`
   - Parameters: `user_id` (int or User instance)
   - Purpose: Clear cache when permissions change
   - Delete cache key from Redis

6. **Update User.get_all_permissions to use cache**
   - Modify method to check cache first
   - Use `get_user_permissions` helper
   - Keep direct database method as `_fetch_all_permissions`

7. **Add cache invalidation to UserRoleManager**
   - In `assign_role` method: invalidate cache after assigning
   - In `remove_role` method: invalidate cache after removing
   - Ensure cache stays synchronized

8. **Add cache configuration**
   - Document Redis cache backend requirement
   - Set timeout: 3600 seconds (1 hour)
   - Consider cache warming strategies

9. **Handle cache failures gracefully**
   - If Redis is unavailable, fall back to database
   - Log cache errors without breaking functionality
   - Use try-except blocks

### Cache Utility Module Structure
```python
# backend/apps/users/cache/permission_cache.py

from django.core.cache import cache
from django.conf import settings
from typing import Union, Set
import logging

logger = logging.getLogger(__name__)

# Cache configuration
PERMISSION_CACHE_TTL = getattr(settings, 'PERMISSION_CACHE_TTL', 3600)  # 1 hour
PERMISSION_CACHE_PREFIX = 'user_permissions'


def get_cache_key(user_id: int) -> str:
    """Generate cache key for user permissions."""
    return f"{PERMISSION_CACHE_PREFIX}_{user_id}"


def get_user_permissions(user) -> Set[str]:
    """
    Get user permissions from cache or database.
    
    Args:
        user: User instance
    
    Returns:
        Set of permission strings in 'app_label.codename' format
    """
    cache_key = get_cache_key(user.id)
    
    try:
        # Try to get from cache
        cached_permissions = cache.get(cache_key)
        
        if cached_permissions is not None:
            logger.debug(f"Cache hit for user {user.id} permissions")
            return cached_permissions
        
        # Cache miss - fetch from database
        logger.debug(f"Cache miss for user {user.id} permissions")
        permissions = user._fetch_all_permissions()
        
        # Store in cache
        cache.set(cache_key, permissions, timeout=PERMISSION_CACHE_TTL)
        
        return permissions
        
    except Exception as e:
        # Cache failure - fall back to database
        logger.error(f"Cache error for user {user.id}: {e}")
        return user._fetch_all_permissions()


def invalidate_user_permissions(user_or_id: Union[int, 'User']) -> None:
    """
    Invalidate cached permissions for user.
    
    Args:
        user_or_id: User instance or user ID
    """
    user_id = user_or_id.id if hasattr(user_or_id, 'id') else user_or_id
    cache_key = get_cache_key(user_id)
    
    try:
        cache.delete(cache_key)
        logger.info(f"Invalidated permission cache for user {user_id}")
    except Exception as e:
        logger.error(f"Error invalidating cache for user {user_id}: {e}")


def invalidate_multiple_users(user_ids: list[int]) -> None:
    """
    Invalidate cached permissions for multiple users.
    
    Args:
        user_ids: List of user IDs
    """
    cache_keys = [get_cache_key(uid) for uid in user_ids]
    
    try:
        cache.delete_many(cache_keys)
        logger.info(f"Invalidated permission cache for {len(user_ids)} users")
    except Exception as e:
        logger.error(f"Error invalidating cache for multiple users: {e}")
```

### Updated User Model Methods
```python
# backend/apps/users/models/user.py

from apps.users.cache.permission_cache import (
    get_user_permissions,
    invalidate_user_permissions
)

class User(AbstractBaseUser, PermissionsMixin):
    # ... existing fields ...
    
    def get_all_permissions(self, include_inactive: bool = False) -> set[str]:
        """
        Get all permissions for user (cached).
        
        Uses Redis cache to improve performance. Cache is automatically
        invalidated when user roles change.
        """
        if include_inactive:
            # Don't cache inactive permissions
            return self._fetch_all_permissions(include_inactive=True)
        
        # Use cached version
        return get_user_permissions(self)
    
    def _fetch_all_permissions(self, include_inactive: bool = False) -> set[str]:
        """
        Fetch all permissions directly from database (no cache).
        
        This is the implementation from Task 60.
        """
        # ... implementation from Task 60 ...
        pass
    
    def invalidate_permission_cache(self) -> None:
        """Invalidate this user's permission cache."""
        invalidate_user_permissions(self)
```

### Updated UserRoleManager Methods
```python
# backend/apps/users/managers/user_role_manager.py

from apps.users.cache.permission_cache import invalidate_user_permissions

class UserRoleManager(models.Manager):
    
    def assign_role(self, user, role, assigned_by=None, is_primary=False):
        """Assign role to user and invalidate permission cache."""
        # ... existing implementation ...
        
        # Invalidate cache after assignment
        invalidate_user_permissions(user)
        
        return user_role
    
    def remove_role(self, user, role):
        """Remove role from user and invalidate permission cache."""
        # ... existing implementation ...
        
        # Invalidate cache after removal
        invalidate_user_permissions(user)
        
        return True
```

### Cache Invalidation Triggers
| Event | Action | Reason |
|-------|--------|--------|
| Role assigned to user | Invalidate user cache | Permissions changed |
| Role removed from user | Invalidate user cache | Permissions changed |
| Role permissions modified | Invalidate all users with role | Indirect permission change |
| Role parent changed | Invalidate all users with role | Inheritance changed |
| Permission activated/deactivated | Invalidate all affected users | Permission availability changed |

### Cache Configuration (settings.py)
```python
# backend/config/settings/base.py

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'lankacommerce',
        'TIMEOUT': 300,  # 5 minutes default
    }
}

# Permission cache settings
PERMISSION_CACHE_TTL = 3600  # 1 hour
```

### Cache Performance Metrics
| Metric | Target | Notes |
|--------|--------|-------|
| Cache hit rate | > 90% | Most permission checks hit cache |
| Cache response time | < 5ms | Redis local response |
| Database response time | 50-200ms | Without cache |
| Cache TTL | 3600s | Balance freshness vs performance |
| Invalidation delay | < 100ms | Near real-time updates |

### Cache Warming Strategy
```python
# Optional: Warm cache for active users on deployment
def warm_permission_cache():
    """Pre-populate cache for recently active users."""
    from django.utils import timezone
    from datetime import timedelta
    
    # Get users active in last 24 hours
    since = timezone.now() - timedelta(days=1)
    active_users = User.objects.filter(
        last_login__gte=since
    ).select_related('user_roles__role')
    
    for user in active_users:
        # This will cache permissions
        user.get_all_permissions()
```

### Expected Outcome
```python
# Permission checking uses cache
user = User.objects.get(id=1)

# First call - cache miss, fetches from DB
perms1 = user.get_all_permissions()  # ~100ms

# Second call - cache hit
perms2 = user.get_all_permissions()  # ~2ms

# After role change - cache invalidated
user_role_manager.assign_role(user, new_role)
perms3 = user.get_all_permissions()  # ~100ms (cache miss)
```

### Directory Structure
```
backend/apps/users/
├── cache/
│   ├── __init__.py
│   └── permission_cache.py
│       ├── get_cache_key()
│       ├── get_user_permissions()
│       ├── invalidate_user_permissions()
│       └── invalidate_multiple_users()
├── managers/
│   └── user_role_manager.py (updated)
└── models/
    └── user.py (updated)
```

### Verification Checklist
- [ ] `permission_cache.py` module created in `apps/users/cache/`
- [ ] `get_cache_key` function generates consistent keys
- [ ] `get_user_permissions` checks cache before database
- [ ] Cache stores permissions with 3600 second TTL
- [ ] `invalidate_user_permissions` clears cache for user
- [ ] `User.get_all_permissions` uses cache helper
- [ ] `User._fetch_all_permissions` contains direct DB implementation
- [ ] `UserRoleManager.assign_role` invalidates cache
- [ ] `UserRoleManager.remove_role` invalidates cache
- [ ] Cache failures fall back to database gracefully
- [ ] Redis configuration documented in settings

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 58 | Add User.has_perm Method | `User.has_perm(perm)` permission checker |
| 59 | Add User.has_role Method | `User.has_role(role_slug)` role checker |
| 60 | Add User.get_all_permissions Method | `User.get_all_permissions()` permission fetcher |
| 61 | Cache User Permissions | Redis-based permission caching with invalidation |

### Final User Model Permission Methods
```python
class User(AbstractBaseUser, PermissionsMixin):
    # ... existing fields ...
    
    def has_perm(self, perm: str, obj=None) -> bool:
        """Check if user has specific permission."""
        if self.is_active and self.is_superuser:
            return True
        return perm in self.get_all_permissions()
    
    def has_role(self, role_slug: str) -> bool:
        """Check if user has specific role."""
        return self.user_roles.filter(role__slug=role_slug).exists()
    
    def get_all_permissions(self, include_inactive: bool = False) -> set[str]:
        """Get all permissions for user (cached)."""
        if include_inactive:
            return self._fetch_all_permissions(include_inactive=True)
        return get_user_permissions(self)
    
    def _fetch_all_permissions(self, include_inactive: bool = False) -> set[str]:
        """Fetch all permissions directly from database."""
        # Implementation from Task 60
        pass
    
    def invalidate_permission_cache(self) -> None:
        """Invalidate this user's permission cache."""
        invalidate_user_permissions(self)
```

### Cache Utility Functions
```python
# apps/users/cache/permission_cache.py

def get_cache_key(user_id: int) -> str:
    """Generate cache key for user permissions."""

def get_user_permissions(user) -> Set[str]:
    """Get user permissions from cache or database."""

def invalidate_user_permissions(user_or_id: Union[int, 'User']) -> None:
    """Invalidate cached permissions for user."""

def invalidate_multiple_users(user_ids: list[int]) -> None:
    """Invalidate cached permissions for multiple users."""
```

### Permission Checking Flow
```
User.has_perm('view_product')
        ↓
User.get_all_permissions()
        ↓
get_user_permissions(user)
        ↓
    [Check Cache]
        ↓
    Cache Hit? ──Yes──→ Return cached permissions
        ↓ No
    user._fetch_all_permissions()
        ↓
    Query UserRoles + RolePermissions
        ↓
    Include inherited permissions
        ↓
    Store in cache (TTL: 3600s)
        ↓
    Return permissions set
```

### Cache Invalidation Flow
```
UserRoleManager.assign_role(user, role)
        ↓
    Create UserRole record
        ↓
invalidate_user_permissions(user)
        ↓
    Delete cache key: user_permissions_{user_id}
        ↓
    Next permission check will cache miss
        ↓
    Fresh permissions fetched from database
```

### Performance Impact
| Operation | Without Cache | With Cache | Improvement |
|-----------|---------------|------------|-------------|
| Permission check | 50-200ms | 2-5ms | 10-100x faster |
| Multiple checks | N × 50-200ms | N × 2-5ms | 10-100x faster |
| Role assignment | 10-50ms | 15-55ms | Slight overhead |

### Next Steps
1. **Implement permission decorators** in Group E for view protection
2. **Create permission mixins** for class-based views
3. **Add template tags** for permission checks in templates
4. **Document user-role system** (Task 62)

---

## Notes for AI Agents

1. **Execution Order:** Task 60 must be completed before Task 58 (has_perm depends on get_all_permissions)
2. **Cache Dependency:** Ensure Redis is configured before implementing Task 61
3. **Import Placement:** Import cache utilities at function level to avoid circular imports
4. **Testing:** Test cache invalidation thoroughly to ensure permission changes are reflected immediately
5. **Fallback:** Always provide database fallback if cache fails
6. **Performance:** Monitor cache hit rates in production (target > 90%)
7. **TTL Balance:** 3600 seconds balances performance vs freshness (adjust based on use case)
8. **Invalidation:** Invalidate cache whenever role assignments change, not just on CRUD operations
9. **Superuser:** Decide whether superuser returns all permissions or empty set (document choice)
10. **Format:** Maintain `app_label.codename` format consistently throughout system
