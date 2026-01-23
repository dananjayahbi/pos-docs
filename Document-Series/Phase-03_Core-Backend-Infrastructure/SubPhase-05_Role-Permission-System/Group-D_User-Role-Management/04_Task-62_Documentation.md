# Task 62: Document User Roles

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** D - User-Role Management  
> **Document:** 04 of 04  
> **Tasks Covered:** 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-58-61_User-Permission-Methods.md](03_Tasks-58-61_User-Permission-Methods.md)
- **→ Next Group:** [../Group-E_Permission-Decorators-Mixins/](../Group-E_Permission-Decorators-Mixins/)

---

## Document Overview

This document covers Task 62: creating comprehensive documentation for the User-Role management system. This documentation provides a complete reference for the UserRole model, UserRoleManager, User permission methods, API endpoints, caching strategies, and troubleshooting guides.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 62 | Document User Roles | Medium |

---

## Task 62: Document User Roles

### Overview
Create comprehensive documentation for the User-Role management system including model specifications, API endpoints, usage examples, caching strategies, and troubleshooting guides. This documentation serves as the primary reference for developers working with user roles and permissions.

### Dependencies
- Task 47-53: UserRole Model (complete)
- Task 54-57: UserRoleManager (complete)
- Task 58-61: User Permission Methods (complete)
- All previous groups (A, B, C) completed

### Instructions

1. **Create documentation directory structure**
   - Navigate to `backend/docs/`
   - Create subdirectory: `user-roles/`
   - Create main documentation file: `USER_ROLES.md`

2. **Document UserRole model**
   - Model overview and purpose
   - Field specifications with types and constraints
   - Relationships to User and Role models
   - Unique constraints and indexes
   - Database schema diagram

3. **Document UserRoleManager**
   - Manager overview and methods
   - `assign_role()` method documentation
   - `remove_role()` method documentation
   - `get_roles()` method documentation
   - Method parameters and return values
   - Usage examples for each method

4. **Document User permission methods**
   - `has_perm()` method specification
   - `has_role()` method specification
   - `get_all_permissions()` method specification
   - Permission checking logic flow
   - Superuser handling
   - Usage examples

5. **Document permission caching**
   - Redis cache structure
   - Cache key patterns
   - Cache timeout settings
   - Cache invalidation triggers
   - Performance considerations

6. **Document API endpoints**
   - User-role assignment endpoints
   - Permission checking endpoints
   - Role listing endpoints
   - Request/response formats
   - Authentication requirements
   - Example API calls with curl

7. **Add configuration section**
   - Settings.py configurations
   - Cache settings (REDIS)
   - Permission timeout settings
   - Multi-tenancy considerations

8. **Add code examples section**
   - Role assignment examples
   - Permission checking examples
   - Bulk operations examples
   - Admin interface usage
   - Testing examples

9. **Add troubleshooting section**
   - Common errors and solutions
   - Cache invalidation issues
   - Permission not updating
   - Primary role conflicts
   - Performance optimization tips

10. **Add migration guide**
    - Database migration steps
    - Data migration examples
    - Rollback procedures
    - Testing migration

11. **Add best practices section**
    - When to use primary roles
    - Role assignment strategies
    - Permission caching guidelines
    - Multi-tenant considerations
    - Security recommendations

12. **Add appendices**
    - Permission codename reference
    - Cache key reference
    - Error code reference
    - Version history

### Documentation Structure

| Section | Purpose |
|---------|---------|
| **Overview** | High-level introduction to User-Role system |
| **UserRole Model** | Complete model specification |
| **UserRoleManager** | Manager methods and usage |
| **User Methods** | Permission checking methods |
| **Caching Strategy** | Redis caching implementation |
| **API Reference** | REST API endpoints |
| **Configuration** | Settings and setup |
| **Code Examples** | Practical usage examples |
| **Troubleshooting** | Common issues and solutions |
| **Best Practices** | Recommended patterns |
| **Appendices** | Reference tables |

### UserRole Model Documentation Template

```markdown
## UserRole Model

### Overview
The UserRole model is a junction table that creates many-to-many relationships between Users and Roles. It tracks role assignments with metadata including assignment timestamp, the assigning user, and whether the role is the user's primary role.

### Model Definition
**Location:** `backend/apps/users/models/user_role.py`

**Class:** `UserRole(BaseModel)`

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | BigAutoField | Primary Key | Unique identifier |
| `user` | ForeignKey | User, CASCADE | User receiving the role |
| `role` | ForeignKey | Role, CASCADE | Role being assigned |
| `assigned_at` | DateTimeField | auto_now_add | Assignment timestamp |
| `assigned_by` | ForeignKey | User, SET_NULL, null | User who assigned the role |
| `is_primary` | BooleanField | default=False | Whether this is primary role |
| `tenant` | ForeignKey | Tenant (inherited) | Multi-tenant isolation |

### Relationships

```
UserRole
├── user (ForeignKey → User)
│   └── related_name: user_roles
├── role (ForeignKey → Role)
│   └── related_name: user_assignments
└── assigned_by (ForeignKey → User)
    └── related_name: role_assignments_made
```

### Meta Options

```python
class Meta:
    db_table = 'users_user_roles'
    verbose_name = 'User Role'
    verbose_name_plural = 'User Roles'
    unique_together = [('user', 'role')]
    indexes = [
        models.Index(fields=['user', 'is_primary']),
        models.Index(fields=['role']),
        models.Index(fields=['assigned_at']),
    ]
    ordering = ['-is_primary', '-assigned_at']
```

### Constraints

- **Unique Together:** Each user can only have a role assigned once
- **Primary Role:** Only one role per user can be marked as primary
- **Cascade Delete:** Deleting user or role removes UserRole entries
- **Tenant Isolation:** All queries are tenant-scoped

### Database Schema

```sql
CREATE TABLE users_user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles_role(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    assigned_by_id BIGINT REFERENCES users_user(id) ON DELETE SET NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    tenant_id BIGINT NOT NULL REFERENCES tenants_tenant(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, role_id)
);

CREATE INDEX idx_user_primary ON users_user_roles(user_id, is_primary);
CREATE INDEX idx_role ON users_user_roles(role_id);
CREATE INDEX idx_assigned_at ON users_user_roles(assigned_at);
```
```

### UserRoleManager Documentation Template

```markdown
## UserRoleManager

### Overview
The UserRoleManager provides high-level methods for managing user-role assignments, including assigning roles, removing roles, and querying user roles with validation and caching support.

### Location
**File:** `backend/apps/users/managers/user_role_manager.py`

**Class:** `UserRoleManager(models.Manager)`

---

### Method: assign_role()

Assign a role to a user with optional primary role designation.

#### Signature
```python
def assign_role(
    self,
    user: User,
    role: Role,
    assigned_by: User,
    is_primary: bool = False
) -> UserRole
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user` | User | Yes | User to receive the role |
| `role` | Role | Yes | Role to assign |
| `assigned_by` | User | Yes | User performing the assignment |
| `is_primary` | bool | No | Mark as primary role (default: False) |

#### Returns
- **Type:** `UserRole`
- **Description:** The created or updated UserRole instance

#### Behavior
1. Checks if assignment already exists
2. If exists and is_primary is True, updates primary status
3. If not exists, creates new assignment
4. If is_primary=True, unmarks other primary roles
5. Invalidates user permission cache
6. Logs the assignment action

#### Exceptions
- `ValidationError`: If role is not active
- `ValidationError`: If user is not active
- `IntegrityError`: If database constraint violated

#### Example Usage
```python
from apps.users.models import User
from apps.roles.models import Role

# Get user and role
user = User.objects.get(email='john@example.com')
role = Role.objects.get(slug='store-manager')
admin = request.user

# Assign role
user_role = UserRole.objects.assign_role(
    user=user,
    role=role,
    assigned_by=admin,
    is_primary=True
)

print(f"Assigned {role.name} to {user.email}")
# Output: Assigned Store Manager to john@example.com
```

---

### Method: remove_role()

Remove a role assignment from a user.

#### Signature
```python
def remove_role(self, user: User, role: Role) -> bool
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user` | User | Yes | User to remove role from |
| `role` | Role | Yes | Role to remove |

#### Returns
- **Type:** `bool`
- **Description:** True if role was removed, False if not assigned

#### Behavior
1. Checks if assignment exists
2. If exists, deletes the UserRole record
3. Invalidates user permission cache
4. Logs the removal action
5. Returns True if removed, False if not found

#### Example Usage
```python
# Remove role from user
removed = UserRole.objects.remove_role(
    user=user,
    role=role
)

if removed:
    print(f"Removed {role.name} from {user.email}")
else:
    print(f"{user.email} did not have {role.name}")
```

---

### Method: get_roles()

Get all roles assigned to a user with optional filtering.

#### Signature
```python
def get_roles(
    self,
    user: User,
    active_only: bool = True,
    primary_first: bool = True
) -> QuerySet[Role]
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user` | User | Yes | User to get roles for |
| `active_only` | bool | No | Return only active roles (default: True) |
| `primary_first` | bool | No | Order with primary first (default: True) |

#### Returns
- **Type:** `QuerySet[Role]`
- **Description:** QuerySet of Role objects

#### Example Usage
```python
# Get all active roles
roles = UserRole.objects.get_roles(user)
for role in roles:
    print(f"- {role.name} ({'Primary' if role.is_primary else 'Secondary'})")

# Get all roles including inactive
all_roles = UserRole.objects.get_roles(user, active_only=False)
```
```

### User Permission Methods Documentation Template

```markdown
## User Permission Methods

### Overview
The User model is extended with permission checking methods that leverage the role-permission system and Redis caching for optimal performance.

### Location
**File:** `backend/apps/users/models/user.py`

**Class:** `User(AbstractBaseUser, PermissionsMixin)`

---

### Method: has_perm()

Check if user has a specific permission by codename.

#### Signature
```python
def has_perm(self, perm: str, obj=None) -> bool
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `perm` | str | Yes | Permission codename or app.codename |
| `obj` | Model | No | Object for object-level permissions |

#### Returns
- **Type:** `bool`
- **Description:** True if user has permission, False otherwise

#### Permission Formats
- Codename only: `"view_product"`
- App.codename: `"products.view_product"`
- Both formats are accepted and normalized

#### Behavior
1. Returns True immediately if user is superuser
2. Returns False if user is inactive
3. Fetches all user permissions (cached)
4. Checks if permission exists in user's permission set
5. Returns boolean result

#### Example Usage
```python
# Check single permission
if user.has_perm('view_product'):
    # Show product list
    products = Product.objects.all()

# Check with app prefix
if user.has_perm('products.delete_product'):
    # Allow deletion
    product.delete()

# Multiple checks
permissions = ['view_order', 'edit_order', 'delete_order']
if all(user.has_perm(perm) for perm in permissions):
    # Full order management access
    pass
```

---

### Method: has_role()

Check if user has a specific role by slug.

#### Signature
```python
def has_role(self, role_slug: str) -> bool
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `role_slug` | str | Yes | Role slug (e.g., 'store-manager') |

#### Returns
- **Type:** `bool`
- **Description:** True if user has role, False otherwise

#### Example Usage
```python
# Check if user is store manager
if user.has_role('store-manager'):
    # Grant manager access
    pass

# Check multiple roles
if user.has_role('admin') or user.has_role('owner'):
    # High-level access
    pass
```

---

### Method: get_all_permissions()

Get all permissions for a user from all assigned roles.

#### Signature
```python
def get_all_permissions(self) -> Set[str]
```

#### Returns
- **Type:** `Set[str]`
- **Description:** Set of permission codenames

#### Behavior
1. Checks cache for existing permission set
2. If cached, returns cached permissions
3. If not cached:
   - Fetches all user roles
   - Fetches all permissions from role_permissions
   - Aggregates permissions into set
   - Caches result for 1 hour
   - Returns permission set

#### Cache Key
- **Pattern:** `user_permissions_{user_id}`
- **Timeout:** 3600 seconds (1 hour)
- **Invalidation:** On role assignment/removal

#### Example Usage
```python
# Get all permissions
permissions = user.get_all_permissions()
print(f"User has {len(permissions)} permissions")

# Check if permission exists
if 'delete_all_products' in permissions:
    print("User has dangerous permission!")

# List all permissions
for perm in sorted(permissions):
    print(f"- {perm}")
```
```

### Permission Caching Documentation Template

```markdown
## Permission Caching Strategy

### Overview
User permissions are cached in Redis to optimize permission checking performance. Cache is automatically invalidated when role assignments change.

### Cache Configuration

#### Settings
**File:** `backend/config/settings/base.py`

```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': env('REDIS_URL', default='redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'PARSER_CLASS': 'redis.connection.HiredisParser',
            'SOCKET_CONNECT_TIMEOUT': 5,
            'SOCKET_TIMEOUT': 5,
            'CONNECTION_POOL_KWARGS': {
                'max_connections': 50,
                'retry_on_timeout': True
            }
        },
        'KEY_PREFIX': 'lankacommerce',
        'TIMEOUT': 3600,  # 1 hour default
    }
}

# Permission cache settings
PERMISSION_CACHE_TIMEOUT = 3600  # 1 hour
ROLE_CACHE_TIMEOUT = 3600  # 1 hour
```

### Cache Keys

| Key Pattern | Example | Purpose | Timeout |
|-------------|---------|---------|---------|
| `user_permissions_{user_id}` | `user_permissions_123` | User permission set | 1 hour |
| `user_roles_{user_id}` | `user_roles_123` | User role list | 1 hour |
| `role_permissions_{role_id}` | `role_permissions_456` | Role permission set | 1 hour |

### Cache Invalidation

#### Automatic Invalidation Triggers

1. **Role Assignment**
   ```python
   # When role is assigned to user
   UserRole.objects.assign_role(user, role, assigned_by)
   # Invalidates: user_permissions_{user.id}, user_roles_{user.id}
   ```

2. **Role Removal**
   ```python
   # When role is removed from user
   UserRole.objects.remove_role(user, role)
   # Invalidates: user_permissions_{user.id}, user_roles_{user.id}
   ```

3. **Permission Assignment to Role**
   ```python
   # When permission is added to role
   RolePermission.objects.assign_permission(role, permission)
   # Invalidates: role_permissions_{role.id}
   # Invalidates: All user_permissions for users with this role
   ```

4. **Permission Removal from Role**
   ```python
   # When permission is removed from role
   RolePermission.objects.remove_permission(role, permission)
   # Invalidates: role_permissions_{role.id}
   # Invalidates: All user_permissions for users with this role
   ```

#### Manual Invalidation

```python
from django.core.cache import cache

# Invalidate specific user
cache_key = f"user_permissions_{user.id}"
cache.delete(cache_key)

# Invalidate multiple users
user_ids = [1, 2, 3, 4, 5]
cache_keys = [f"user_permissions_{uid}" for uid in user_ids]
cache.delete_many(cache_keys)

# Clear all permission caches
cache.delete_pattern("user_permissions_*")
```

### Cache Helper Functions

**Location:** `backend/apps/users/cache/permission_cache.py`

```python
from django.core.cache import cache
from typing import Set, Optional

def get_user_permissions_cached(user_id: int) -> Optional[Set[str]]:
    """Get cached user permissions."""
    cache_key = f"user_permissions_{user_id}"
    return cache.get(cache_key)

def set_user_permissions_cache(user_id: int, permissions: Set[str]) -> None:
    """Cache user permissions."""
    cache_key = f"user_permissions_{user_id}"
    cache.set(cache_key, permissions, timeout=3600)

def invalidate_user_cache(user_id: int) -> None:
    """Invalidate all caches for a user."""
    cache.delete_many([
        f"user_permissions_{user_id}",
        f"user_roles_{user_id}"
    ])

def invalidate_role_cache(role_id: int) -> None:
    """Invalidate caches for a role and all users with that role."""
    from apps.users.models import UserRole
    
    # Invalidate role cache
    cache.delete(f"role_permissions_{role_id}")
    
    # Get all users with this role
    user_ids = UserRole.objects.filter(role_id=role_id).values_list('user_id', flat=True)
    
    # Invalidate each user's cache
    for user_id in user_ids:
        invalidate_user_cache(user_id)
```

### Performance Considerations

#### Cache Hit Rate
- **Target:** > 95% cache hit rate
- **Monitoring:** Track cache hits vs misses
- **Optimization:** Increase timeout if hit rate is low

#### Memory Usage
```python
# Estimate memory per user
permissions_per_user = 50  # average
bytes_per_permission = 30  # average codename length
total_bytes = permissions_per_user * bytes_per_permission
# ≈ 1.5 KB per user

# For 10,000 users
total_memory = 10000 * 1.5
# ≈ 15 MB (acceptable)
```

#### Cache Warming
```python
# Warm cache for active users on deployment
from apps.users.models import User

def warm_permission_cache():
    """Pre-populate permission cache for active users."""
    active_users = User.objects.filter(is_active=True)
    for user in active_users:
        # This will cache permissions
        user.get_all_permissions()
```
```

### API Endpoints Documentation Template

```markdown
## API Endpoints

### Base URL
```
/api/v1/users/roles/
```

### Authentication
All endpoints require authentication via JWT token:
```
Authorization: Bearer <jwt_token>
```

---

### 1. Assign Role to User

Assign a role to a user.

#### Endpoint
```
POST /api/v1/users/{user_id}/roles/
```

#### Request Body
```json
{
    "role_id": 5,
    "is_primary": true
}
```

#### Response (201 Created)
```json
{
    "id": 123,
    "user": {
        "id": 45,
        "email": "john@example.com",
        "full_name": "John Doe"
    },
    "role": {
        "id": 5,
        "name": "Store Manager",
        "slug": "store-manager"
    },
    "assigned_at": "2026-01-23T10:30:00Z",
    "assigned_by": {
        "id": 1,
        "email": "admin@example.com",
        "full_name": "Admin User"
    },
    "is_primary": true
}
```

#### Error Responses
```json
// 400 Bad Request - Role already assigned
{
    "error": "User already has this role",
    "code": "ROLE_ALREADY_ASSIGNED"
}

// 403 Forbidden - Insufficient permissions
{
    "error": "You do not have permission to assign roles",
    "code": "PERMISSION_DENIED"
}

// 404 Not Found - User or role not found
{
    "error": "User not found",
    "code": "USER_NOT_FOUND"
}
```

#### cURL Example
```bash
curl -X POST https://api.lankacommerce.lk/api/v1/users/45/roles/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "role_id": 5,
    "is_primary": true
  }'
```

---

### 2. Remove Role from User

Remove a role assignment from a user.

#### Endpoint
```
DELETE /api/v1/users/{user_id}/roles/{role_id}/
```

#### Response (204 No Content)
No response body

#### Error Responses
```json
// 404 Not Found - Assignment not found
{
    "error": "User does not have this role",
    "code": "ROLE_NOT_ASSIGNED"
}
```

#### cURL Example
```bash
curl -X DELETE https://api.lankacommerce.lk/api/v1/users/45/roles/5/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. List User Roles

Get all roles assigned to a user.

#### Endpoint
```
GET /api/v1/users/{user_id}/roles/
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `active_only` | boolean | No | Filter to active roles only (default: true) |

#### Response (200 OK)
```json
{
    "count": 3,
    "results": [
        {
            "id": 123,
            "role": {
                "id": 5,
                "name": "Store Manager",
                "slug": "store-manager",
                "description": "Manages store operations",
                "is_active": true
            },
            "assigned_at": "2026-01-20T10:30:00Z",
            "assigned_by": {
                "id": 1,
                "email": "admin@example.com",
                "full_name": "Admin User"
            },
            "is_primary": true
        },
        {
            "id": 124,
            "role": {
                "id": 7,
                "name": "Cashier",
                "slug": "cashier",
                "description": "Handles POS transactions",
                "is_active": true
            },
            "assigned_at": "2026-01-21T14:15:00Z",
            "assigned_by": {
                "id": 1,
                "email": "admin@example.com",
                "full_name": "Admin User"
            },
            "is_primary": false
        }
    ]
}
```

#### cURL Example
```bash
curl -X GET https://api.lankacommerce.lk/api/v1/users/45/roles/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. Check User Permission

Check if a user has a specific permission.

#### Endpoint
```
GET /api/v1/users/{user_id}/permissions/{permission_codename}/
```

#### Response (200 OK)
```json
{
    "user_id": 45,
    "permission": "view_product",
    "has_permission": true,
    "source": "role",
    "roles_providing": [
        {
            "id": 5,
            "name": "Store Manager",
            "slug": "store-manager"
        }
    ]
}
```

#### Response (200 OK - No Permission)
```json
{
    "user_id": 45,
    "permission": "delete_all_products",
    "has_permission": false
}
```

#### cURL Example
```bash
curl -X GET https://api.lankacommerce.lk/api/v1/users/45/permissions/view_product/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 5. List All User Permissions

Get all permissions for a user.

#### Endpoint
```
GET /api/v1/users/{user_id}/permissions/
```

#### Response (200 OK)
```json
{
    "user_id": 45,
    "permission_count": 47,
    "permissions": [
        {
            "codename": "view_product",
            "name": "Can view product",
            "app_label": "products",
            "roles": ["Store Manager", "Inventory Manager"]
        },
        {
            "codename": "add_product",
            "name": "Can add product",
            "app_label": "products",
            "roles": ["Inventory Manager"]
        },
        {
            "codename": "view_order",
            "name": "Can view order",
            "app_label": "orders",
            "roles": ["Store Manager", "Cashier"]
        }
    ],
    "cached": true,
    "cache_expires_at": "2026-01-23T11:30:00Z"
}
```

#### cURL Example
```bash
curl -X GET https://api.lankacommerce.lk/api/v1/users/45/permissions/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
```

### Code Examples Documentation Template

```markdown
## Code Examples

### Example 1: Assigning Primary Role

```python
from apps.users.models import User, UserRole
from apps.roles.models import Role

# Scenario: Assign Store Manager as primary role to new employee

# Get the user and role
user = User.objects.get(email='john.doe@mystore.lk')
store_manager_role = Role.objects.get(slug='store-manager')
admin_user = User.objects.get(email='admin@mystore.lk')

# Assign role as primary
user_role = UserRole.objects.assign_role(
    user=user,
    role=store_manager_role,
    assigned_by=admin_user,
    is_primary=True
)

# Verify assignment
assert user.has_role('store-manager')
assert user_role.is_primary

print(f"✓ Assigned {store_manager_role.name} to {user.email} as primary role")
```

### Example 2: Assigning Multiple Roles

```python
# Scenario: User needs multiple roles (Store Manager + Inventory Manager)

store_manager = Role.objects.get(slug='store-manager')
inventory_manager = Role.objects.get(slug='inventory-manager')

# Assign primary role
UserRole.objects.assign_role(
    user=user,
    role=store_manager,
    assigned_by=admin_user,
    is_primary=True
)

# Assign secondary role
UserRole.objects.assign_role(
    user=user,
    role=inventory_manager,
    assigned_by=admin_user,
    is_primary=False
)

# Verify both roles
roles = UserRole.objects.get_roles(user)
assert roles.count() == 2
assert user.has_role('store-manager')
assert user.has_role('inventory-manager')

print(f"✓ User has {roles.count()} roles")
```

### Example 3: Checking Permissions

```python
# Scenario: Check if user can perform specific actions

# Check single permission
if user.has_perm('view_product'):
    products = Product.objects.all()
    print(f"✓ User can view {products.count()} products")
else:
    print("✗ User cannot view products")

# Check multiple permissions
required_permissions = [
    'view_order',
    'add_order',
    'change_order'
]

if all(user.has_perm(perm) for perm in required_permissions):
    print("✓ User has full order management access")
else:
    missing = [p for p in required_permissions if not user.has_perm(p)]
    print(f"✗ User missing permissions: {missing}")

# Check with app prefix
if user.has_perm('products.delete_product'):
    print("⚠ User has dangerous delete permission")
```

### Example 4: Getting All Permissions

```python
# Scenario: Display all user permissions

# Get all permissions (cached)
permissions = user.get_all_permissions()

print(f"User: {user.email}")
print(f"Total Permissions: {len(permissions)}")
print("\nPermissions by category:")

# Group by app
from collections import defaultdict
by_app = defaultdict(list)

for perm in sorted(permissions):
    if '.' in perm:
        app, codename = perm.split('.')
    else:
        app = 'unknown'
        codename = perm
    by_app[app].append(codename)

for app, perms in sorted(by_app.items()):
    print(f"\n{app.upper()}:")
    for perm in sorted(perms):
        print(f"  - {perm}")
```

### Example 5: Role Removal

```python
# Scenario: Remove role from user (employee transfer)

cashier_role = Role.objects.get(slug='cashier')

# Remove role
removed = UserRole.objects.remove_role(
    user=user,
    role=cashier_role
)

if removed:
    print(f"✓ Removed {cashier_role.name} from {user.email}")
    
    # Verify removal
    assert not user.has_role('cashier')
    
    # Check permission changes
    if not user.has_perm('process_payment'):
        print("✓ Payment processing permission removed")
else:
    print(f"✗ {user.email} did not have {cashier_role.name}")
```

### Example 6: Bulk Role Assignment

```python
# Scenario: Assign same role to multiple users

cashier_role = Role.objects.get(slug='cashier')
new_employees = User.objects.filter(
    email__in=[
        'emp1@store.lk',
        'emp2@store.lk',
        'emp3@store.lk'
    ]
)

assigned_count = 0
for employee in new_employees:
    try:
        UserRole.objects.assign_role(
            user=employee,
            role=cashier_role,
            assigned_by=admin_user,
            is_primary=True
        )
        assigned_count += 1
    except Exception as e:
        print(f"✗ Failed to assign role to {employee.email}: {e}")

print(f"✓ Assigned {cashier_role.name} to {assigned_count} employees")
```

### Example 7: Cache Invalidation

```python
from django.core.cache import cache

# Scenario: Manual cache invalidation after bulk operations

# Get users who need cache refresh
users_to_refresh = User.objects.filter(
    user_roles__role__slug='store-manager'
).distinct()

# Invalidate caches
for user in users_to_refresh:
    cache_key = f"user_permissions_{user.id}"
    cache.delete(cache_key)
    print(f"✓ Invalidated cache for {user.email}")

# Warm cache immediately
for user in users_to_refresh:
    permissions = user.get_all_permissions()
    print(f"✓ Warmed cache for {user.email} ({len(permissions)} permissions)")
```

### Example 8: Admin Panel Usage

```python
# Scenario: Custom admin action to assign role

from django.contrib import admin
from apps.users.models import User, UserRole
from apps.roles.models import Role

@admin.action(description='Assign Store Manager role')
def assign_store_manager_role(modeladmin, request, queryset):
    """Bulk assign Store Manager role to selected users."""
    role = Role.objects.get(slug='store-manager')
    assigned_count = 0
    
    for user in queryset:
        if not user.has_role('store-manager'):
            UserRole.objects.assign_role(
                user=user,
                role=role,
                assigned_by=request.user,
                is_primary=True
            )
            assigned_count += 1
    
    modeladmin.message_user(
        request,
        f"Assigned Store Manager role to {assigned_count} users"
    )

class UserAdmin(admin.ModelAdmin):
    actions = [assign_store_manager_role]
```

### Example 9: Testing Role Assignments

```python
# Scenario: Unit test for role assignment

from django.test import TestCase
from apps.users.models import User, UserRole
from apps.roles.models import Role

class UserRoleTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email='admin@test.com',
            password='password123'
        )
        self.user = User.objects.create_user(
            email='user@test.com',
            password='password123'
        )
        self.role = Role.objects.create(
            name='Test Role',
            slug='test-role'
        )
    
    def test_assign_role(self):
        """Test role assignment."""
        user_role = UserRole.objects.assign_role(
            user=self.user,
            role=self.role,
            assigned_by=self.admin,
            is_primary=True
        )
        
        self.assertIsNotNone(user_role)
        self.assertTrue(self.user.has_role('test-role'))
        self.assertTrue(user_role.is_primary)
    
    def test_remove_role(self):
        """Test role removal."""
        # Assign first
        UserRole.objects.assign_role(
            user=self.user,
            role=self.role,
            assigned_by=self.admin
        )
        
        # Then remove
        removed = UserRole.objects.remove_role(self.user, self.role)
        
        self.assertTrue(removed)
        self.assertFalse(self.user.has_role('test-role'))
    
    def test_permission_caching(self):
        """Test permission caching."""
        from django.core.cache import cache
        
        # Clear cache
        cache_key = f"user_permissions_{self.user.id}"
        cache.delete(cache_key)
        
        # First call - not cached
        permissions1 = self.user.get_all_permissions()
        
        # Second call - should be cached
        permissions2 = self.user.get_all_permissions()
        
        self.assertEqual(permissions1, permissions2)
```
```

### Troubleshooting Documentation Template

```markdown
## Troubleshooting Guide

### Issue 1: Permission Not Updating

#### Symptoms
- User assigned new role but permission check still returns False
- Changes to role permissions not reflected for users

#### Causes
1. **Cache not invalidated:** Permission cache still contains old data
2. **Django cache timeout:** Waiting for cache expiry

#### Solutions

**Solution 1: Manual Cache Invalidation**
```python
from django.core.cache import cache

# Invalidate user cache
user_id = 45
cache.delete(f"user_permissions_{user_id}")

# Force refresh
user = User.objects.get(id=user_id)
permissions = user.get_all_permissions()  # Rebuilds cache
```

**Solution 2: Automatic Invalidation Check**
```python
# Verify cache invalidation is working
from apps.users.managers import user_role_manager

# Check if signals are connected
from django.db.models.signals import post_save, post_delete
from apps.users.models import UserRole

# List signal handlers
print(post_save.receivers)  # Should include UserRole handler
print(post_delete.receivers)  # Should include UserRole handler
```

**Solution 3: Clear All Caches**
```bash
# Django management command
python manage.py clear_cache user_permissions

# Or via Redis CLI
redis-cli KEYS "user_permissions_*" | xargs redis-cli DEL
```

#### Prevention
- Ensure signal handlers are properly connected
- Add logging to cache invalidation functions
- Monitor cache hit/miss rates

---

### Issue 2: Primary Role Conflicts

#### Symptoms
- Multiple primary roles for same user
- Cannot set role as primary

#### Causes
1. **Race condition:** Multiple requests setting primary simultaneously
2. **Database constraint missing:** Unique constraint not enforced
3. **Signal handler error:** Exception in primary role update logic

#### Solutions

**Solution 1: Fix Primary Role Conflicts**
```python
from apps.users.models import UserRole

# Find users with multiple primary roles
from django.db.models import Count

users_with_multiple_primary = UserRole.objects.filter(
    is_primary=True
).values('user_id').annotate(
    count=Count('id')
).filter(count__gt=1)

# Fix each user
for item in users_with_multiple_primary:
    user_id = item['user_id']
    
    # Get all primary roles for this user
    primary_roles = UserRole.objects.filter(
        user_id=user_id,
        is_primary=True
    ).order_by('-assigned_at')
    
    # Keep the most recent, unmark others
    for user_role in primary_roles[1:]:
        user_role.is_primary = False
        user_role.save()
    
    print(f"✓ Fixed primary roles for user {user_id}")
```

**Solution 2: Add Database Constraint**
```python
# Migration to add partial unique index
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('users', '0005_previous_migration'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            CREATE UNIQUE INDEX users_user_roles_user_primary_unique 
            ON users_user_roles (user_id) 
            WHERE is_primary = TRUE;
            """,
            reverse_sql="""
            DROP INDEX IF EXISTS users_user_roles_user_primary_unique;
            """
        )
    ]
```

---

### Issue 3: Role Assignment Fails Silently

#### Symptoms
- `assign_role()` returns None or raises no error
- Role not assigned but no exception thrown

#### Causes
1. **Transaction rollback:** Outer transaction rolled back
2. **Validation error caught:** Exception caught and suppressed
3. **Signal handler error:** Post-save signal failing

#### Solutions

**Solution 1: Check Transaction State**
```python
from django.db import transaction

# Use atomic block
with transaction.atomic():
    user_role = UserRole.objects.assign_role(
        user=user,
        role=role,
        assigned_by=admin
    )
    
    # Verify immediately
    if not user.has_role(role.slug):
        raise Exception("Role assignment failed")
```

**Solution 2: Enable Verbose Logging**
```python
# settings/development.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'apps.users.managers': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

**Solution 3: Check Signal Handlers**
```python
# apps/users/signals.py
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=UserRole)
def invalidate_user_cache_on_role_save(sender, instance, **kwargs):
    logger.info(f"Invalidating cache for user {instance.user_id}")
    try:
        cache.delete(f"user_permissions_{instance.user_id}")
        logger.info(f"✓ Cache invalidated for user {instance.user_id}")
    except Exception as e:
        logger.error(f"✗ Failed to invalidate cache: {e}")
        raise
```

---

### Issue 4: Performance Degradation

#### Symptoms
- Slow permission checks
- High database query count
- Redis connection timeouts

#### Causes
1. **Cache misses:** Cache not being used effectively
2. **N+1 queries:** Not using select_related/prefetch_related
3. **Large permission sets:** Too many permissions per user
4. **Redis overload:** Too many cache operations

#### Solutions

**Solution 1: Optimize Queries**
```python
# Bad - N+1 queries
users = User.objects.all()
for user in users:
    roles = user.user_roles.all()  # Query per user
    for role in roles:
        permissions = role.role.permissions.all()  # Query per role

# Good - Optimized queries
users = User.objects.prefetch_related(
    'user_roles__role__role_permissions__permission'
).all()

for user in users:
    roles = user.user_roles.all()  # No query
    for user_role in roles:
        permissions = user_role.role.role_permissions.all()  # No query
```

**Solution 2: Monitor Cache Hit Rate**
```python
from django.core.cache import cache
import time

def check_permission_with_monitoring(user, perm):
    start_time = time.time()
    cache_key = f"user_permissions_{user.id}"
    
    # Check if cached
    cached = cache.get(cache_key)
    cache_hit = cached is not None
    
    # Check permission
    has_perm = user.has_perm(perm)
    
    duration = time.time() - start_time
    
    print(f"Permission check: {perm}")
    print(f"  Cache hit: {cache_hit}")
    print(f"  Duration: {duration*1000:.2f}ms")
    print(f"  Result: {has_perm}")
    
    return has_perm
```

**Solution 3: Implement Cache Warming**
```bash
# Management command: warm_permission_cache.py
from django.core.management.base import BaseCommand
from apps.users.models import User

class Command(BaseCommand):
    help = 'Warm permission cache for active users'

    def handle(self, *args, **options):
        users = User.objects.filter(is_active=True)
        count = 0
        
        for user in users:
            permissions = user.get_all_permissions()
            count += 1
            
            if count % 100 == 0:
                self.stdout.write(f"Warmed cache for {count} users")
        
        self.stdout.write(
            self.style.SUCCESS(f"✓ Warmed cache for {count} users")
        )
```

---

### Issue 5: Multi-Tenant Isolation Failure

#### Symptoms
- Users seeing roles from other tenants
- Permission checks crossing tenant boundaries

#### Causes
1. **Tenant context not set:** Request without tenant context
2. **Query not filtered:** Missing tenant filter in queryset
3. **Cache key collision:** Same cache key used across tenants

#### Solutions

**Solution 1: Verify Tenant Context**
```python
from django_tenants.utils import get_tenant

# Check tenant context
def assign_role_with_tenant_check(user, role, assigned_by):
    current_tenant = get_tenant(request)
    
    # Verify all objects belong to same tenant
    assert user.tenant_id == current_tenant.id, "User tenant mismatch"
    assert role.tenant_id == current_tenant.id, "Role tenant mismatch"
    assert assigned_by.tenant_id == current_tenant.id, "Admin tenant mismatch"
    
    return UserRole.objects.assign_role(user, role, assigned_by)
```

**Solution 2: Update Cache Keys**
```python
# Include tenant_id in cache keys
def get_user_permissions_cache_key(user):
    return f"tenant_{user.tenant_id}_user_permissions_{user.id}"

# Update cache operations
cache_key = get_user_permissions_cache_key(user)
permissions = cache.get(cache_key)
```

**Solution 3: Add Tenant Validation**
```python
# apps/users/managers/user_role_manager.py

def assign_role(self, user, role, assigned_by, is_primary=False):
    # Validate tenant isolation
    if user.tenant_id != role.tenant_id:
        raise ValidationError("Cannot assign role from different tenant")
    
    if assigned_by.tenant_id != user.tenant_id:
        raise ValidationError("Assigner must be from same tenant")
    
    # Proceed with assignment
    # ...
```
```

### Best Practices Documentation Template

```markdown
## Best Practices

### 1. Role Assignment Strategy

#### Use Primary Roles for Main Job Function
```python
# ✓ Good: Assign primary role based on job title
employee = User.objects.create_user(
    email='manager@store.lk',
    job_title='Store Manager'
)

store_manager_role = Role.objects.get(slug='store-manager')
UserRole.objects.assign_role(
    user=employee,
    role=store_manager_role,
    assigned_by=admin,
    is_primary=True  # Reflects main job function
)
```

#### Assign Secondary Roles for Additional Responsibilities
```python
# ✓ Good: Secondary roles for cross-functional duties
inventory_role = Role.objects.get(slug='inventory-manager')
UserRole.objects.assign_role(
    user=employee,
    role=inventory_role,
    assigned_by=admin,
    is_primary=False  # Additional responsibility
)
```

#### Avoid Role Proliferation
```python
# ✗ Bad: Too many granular roles
UserRole.objects.assign_role(user, Role.objects.get(slug='can-view-products'))
UserRole.objects.assign_role(user, Role.objects.get(slug='can-edit-products'))
UserRole.objects.assign_role(user, Role.objects.get(slug='can-delete-products'))

# ✓ Good: Single comprehensive role
UserRole.objects.assign_role(user, Role.objects.get(slug='product-manager'))
```

---

### 2. Permission Checking Guidelines

#### Check Permissions Before Actions
```python
# ✓ Good: Check before performing action
def delete_product(request, product_id):
    if not request.user.has_perm('delete_product'):
        raise PermissionDenied("You cannot delete products")
    
    product = Product.objects.get(id=product_id)
    product.delete()
    return JsonResponse({'status': 'deleted'})
```

#### Use Decorators for View Protection
```python
# ✓ Good: Use permission decorators
from apps.users.decorators import permission_required

@permission_required('view_order')
def order_list(request):
    orders = Order.objects.all()
    return render(request, 'orders/list.html', {'orders': orders})
```

#### Batch Permission Checks
```python
# ✗ Bad: Multiple individual checks
if user.has_perm('view_product'):
    pass
if user.has_perm('edit_product'):
    pass
if user.has_perm('delete_product'):
    pass

# ✓ Good: Single permission fetch
permissions = user.get_all_permissions()
can_view = 'view_product' in permissions
can_edit = 'edit_product' in permissions
can_delete = 'delete_product' in permissions
```

---

### 3. Caching Optimization

#### Leverage Cache Warming
```python
# ✓ Good: Warm cache during off-peak hours
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    def handle(self, *args, **options):
        # Run at 3 AM daily
        active_users = User.objects.filter(
            is_active=True,
            last_login__gte=timezone.now() - timedelta(days=30)
        )
        
        for user in active_users:
            user.get_all_permissions()  # Warms cache
```

#### Invalidate Efficiently
```python
# ✓ Good: Targeted invalidation
def update_role_permissions(role, permission, action='add'):
    if action == 'add':
        RolePermission.objects.assign_permission(role, permission)
    else:
        RolePermission.objects.remove_permission(role, permission)
    
    # Invalidate only affected users
    user_ids = UserRole.objects.filter(role=role).values_list('user_id', flat=True)
    cache_keys = [f"user_permissions_{uid}" for uid in user_ids]
    cache.delete_many(cache_keys)
```

#### Monitor Cache Performance
```python
# ✓ Good: Track cache metrics
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

def get_permissions_with_metrics(user):
    cache_key = f"user_permissions_{user.id}"
    permissions = cache.get(cache_key)
    
    if permissions is None:
        logger.info(f"Cache MISS: user_permissions_{user.id}")
        permissions = user._fetch_permissions()
        cache.set(cache_key, permissions, timeout=3600)
    else:
        logger.debug(f"Cache HIT: user_permissions_{user.id}")
    
    return permissions
```

---

### 4. Multi-Tenant Security

#### Always Filter by Tenant
```python
# ✓ Good: Explicit tenant filtering
def assign_role_secure(request, user_id, role_id):
    tenant = get_tenant(request)
    
    user = User.objects.filter(
        id=user_id,
        tenant=tenant
    ).first()
    
    role = Role.objects.filter(
        id=role_id,
        tenant=tenant
    ).first()
    
    if not user or not role:
        raise NotFound()
    
    return UserRole.objects.assign_role(user, role, request.user)
```

#### Include Tenant in Cache Keys
```python
# ✓ Good: Tenant-specific cache keys
def get_cache_key(user, key_type):
    return f"tenant_{user.tenant_id}_{key_type}_{user.id}"

# Usage
cache_key = get_cache_key(user, 'permissions')
permissions = cache.get(cache_key)
```

---

### 5. Error Handling

#### Provide Meaningful Error Messages
```python
# ✓ Good: Descriptive errors
def assign_role(self, user, role, assigned_by, is_primary=False):
    try:
        # Validation
        if not role.is_active:
            raise ValidationError(
                f"Cannot assign inactive role '{role.name}'"
            )
        
        if not user.is_active:
            raise ValidationError(
                f"Cannot assign role to inactive user '{user.email}'"
            )
        
        # Assignment logic
        # ...
        
    except IntegrityError as e:
        if 'unique constraint' in str(e).lower():
            raise ValidationError(
                f"User '{user.email}' already has role '{role.name}'"
            )
        raise
```

#### Log Important Operations
```python
# ✓ Good: Audit logging
import logging

logger = logging.getLogger(__name__)

def assign_role(self, user, role, assigned_by, is_primary=False):
    logger.info(
        f"Assigning role '{role.slug}' to user '{user.email}' "
        f"by '{assigned_by.email}' (primary={is_primary})"
    )
    
    try:
        user_role = self.create(
            user=user,
            role=role,
            assigned_by=assigned_by,
            is_primary=is_primary
        )
        
        logger.info(f"✓ Role assignment successful: {user_role.id}")
        return user_role
        
    except Exception as e:
        logger.error(
            f"✗ Role assignment failed: {e}",
            exc_info=True
        )
        raise
```

---

### 6. Testing Recommendations

#### Test Role Assignments
```python
# ✓ Good: Comprehensive test coverage
class UserRoleTestCase(TestCase):
    def test_primary_role_uniqueness(self):
        """Only one primary role per user."""
        role1 = Role.objects.create(name='Role 1', slug='role-1')
        role2 = Role.objects.create(name='Role 2', slug='role-2')
        
        # Assign first as primary
        UserRole.objects.assign_role(
            user=self.user,
            role=role1,
            assigned_by=self.admin,
            is_primary=True
        )
        
        # Assign second as primary
        UserRole.objects.assign_role(
            user=self.user,
            role=role2,
            assigned_by=self.admin,
            is_primary=True
        )
        
        # First should no longer be primary
        role1_assignment = UserRole.objects.get(user=self.user, role=role1)
        role2_assignment = UserRole.objects.get(user=self.user, role=role2)
        
        self.assertFalse(role1_assignment.is_primary)
        self.assertTrue(role2_assignment.is_primary)
```

#### Test Cache Invalidation
```python
# ✓ Good: Verify cache behavior
def test_cache_invalidation_on_role_change(self):
    """Cache should be invalidated when roles change."""
    role = Role.objects.create(name='Test Role', slug='test-role')
    permission = Permission.objects.create(
        codename='test_permission',
        name='Test Permission'
    )
    RolePermission.objects.assign_permission(role, permission)
    
    # Assign role and cache permissions
    UserRole.objects.assign_role(self.user, role, self.admin)
    perms_before = self.user.get_all_permissions()  # Caches
    
    self.assertIn('test_permission', perms_before)
    
    # Remove role
    UserRole.objects.remove_role(self.user, role)
    
    # Cache should be invalidated
    perms_after = self.user.get_all_permissions()
    self.assertNotIn('test_permission', perms_after)
```
```

### Appendices Documentation Template

```markdown
## Appendices

### Appendix A: Permission Codename Reference

#### Products Module

| Codename | Name | Description |
|----------|------|-------------|
| `view_product` | Can view product | View product details and listings |
| `add_product` | Can add product | Create new products |
| `change_product` | Can change product | Edit existing products |
| `delete_product` | Can delete product | Remove products |
| `manage_product_pricing` | Can manage product pricing | Update product prices |
| `manage_product_inventory` | Can manage product inventory | Update stock levels |

#### Orders Module

| Codename | Name | Description |
|----------|------|-------------|
| `view_order` | Can view order | View order details and listings |
| `add_order` | Can add order | Create new orders |
| `change_order` | Can change order | Edit existing orders |
| `delete_order` | Can delete order | Cancel/remove orders |
| `process_order` | Can process order | Move orders through workflow |
| `refund_order` | Can refund order | Process order refunds |

#### Users Module

| Codename | Name | Description |
|----------|------|-------------|
| `view_user` | Can view user | View user profiles |
| `add_user` | Can add user | Create new users |
| `change_user` | Can change user | Edit user profiles |
| `delete_user` | Can delete user | Remove users |
| `assign_roles` | Can assign roles | Assign roles to users |
| `manage_permissions` | Can manage permissions | Modify user permissions |

#### Reports Module

| Codename | Name | Description |
|----------|------|-------------|
| `view_sales_report` | Can view sales report | Access sales reports |
| `view_inventory_report` | Can view inventory report | Access inventory reports |
| `view_financial_report` | Can view financial report | Access financial reports |
| `export_reports` | Can export reports | Download reports as files |

---

### Appendix B: Cache Key Reference

#### User-Related Cache Keys

| Key Pattern | Example | Purpose | TTL |
|-------------|---------|---------|-----|
| `user_permissions_{user_id}` | `user_permissions_123` | User's permission set | 3600s |
| `user_roles_{user_id}` | `user_roles_123` | User's role list | 3600s |
| `user_primary_role_{user_id}` | `user_primary_role_123` | User's primary role | 3600s |

#### Role-Related Cache Keys

| Key Pattern | Example | Purpose | TTL |
|-------------|---------|---------|-----|
| `role_permissions_{role_id}` | `role_permissions_456` | Role's permission set | 3600s |
| `role_users_{role_id}` | `role_users_456` | Users with this role | 3600s |

#### Multi-Tenant Cache Keys

| Key Pattern | Example | Purpose | TTL |
|-------------|---------|---------|-----|
| `tenant_{tenant_id}_user_permissions_{user_id}` | `tenant_5_user_permissions_123` | Tenant-scoped user permissions | 3600s |
| `tenant_{tenant_id}_role_permissions_{role_id}` | `tenant_5_role_permissions_456` | Tenant-scoped role permissions | 3600s |

---

### Appendix C: Error Code Reference

#### Validation Errors

| Error Code | HTTP Status | Description | Solution |
|------------|-------------|-------------|----------|
| `ROLE_ALREADY_ASSIGNED` | 400 | User already has this role | Check existing roles before assignment |
| `INACTIVE_ROLE` | 400 | Cannot assign inactive role | Use active role only |
| `INACTIVE_USER` | 400 | Cannot assign role to inactive user | Activate user first |
| `PRIMARY_ROLE_CONFLICT` | 409 | User already has a primary role | Unmark current primary or use is_primary=False |

#### Permission Errors

| Error Code | HTTP Status | Description | Solution |
|------------|-------------|-------------|----------|
| `PERMISSION_DENIED` | 403 | User lacks required permission | Assign appropriate role |
| `INVALID_PERMISSION` | 400 | Permission codename not found | Check permission exists |
| `NO_ROLES_ASSIGNED` | 400 | User has no roles | Assign at least one role |

#### Multi-Tenant Errors

| Error Code | HTTP Status | Description | Solution |
|------------|-------------|-------------|----------|
| `TENANT_MISMATCH` | 400 | User and role from different tenants | Ensure same tenant |
| `CROSS_TENANT_ACCESS` | 403 | Attempt to access other tenant's data | Check tenant context |

---

### Appendix D: Database Indexes

#### UserRole Table Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `pk_user_roles` | `id` | PRIMARY KEY | Unique identifier |
| `uk_user_role` | `user_id, role_id` | UNIQUE | Prevent duplicate assignments |
| `idx_user_primary` | `user_id, is_primary` | BTREE | Fast primary role lookup |
| `idx_role` | `role_id` | BTREE | Fast role-based queries |
| `idx_assigned_at` | `assigned_at` | BTREE | Chronological queries |
| `idx_tenant` | `tenant_id` | BTREE | Multi-tenant isolation |

---

### Appendix E: Version History

#### Version 1.0.0 - Initial Release
**Date:** 2026-01-23

**Features:**
- UserRole model with user-role junction
- UserRoleManager with assignment methods
- User permission checking methods (has_perm, has_role, get_all_permissions)
- Redis-based permission caching
- Multi-tenant support
- API endpoints for role management
- Primary role designation
- Audit trail (assigned_by, assigned_at)

**Database Schema:**
- users_user_roles table
- Unique constraint on user_id + role_id
- Indexes for performance optimization

**API Endpoints:**
- POST /api/v1/users/{user_id}/roles/
- DELETE /api/v1/users/{user_id}/roles/{role_id}/
- GET /api/v1/users/{user_id}/roles/
- GET /api/v1/users/{user_id}/permissions/{codename}/
- GET /api/v1/users/{user_id}/permissions/

**Performance:**
- Cache timeout: 3600 seconds
- Target cache hit rate: >95%
- Query optimization with select_related/prefetch_related

---

### Appendix F: Related Documentation

#### Internal Documentation

- [Permission Model Documentation](../../Group-B_Permission-Model/DOC-04_Documentation.md)
- [Role Model Documentation](../../Group-A_Role-Model/DOC-04_Documentation.md)
- [Role-Permission Assignment Documentation](../../Group-C_Role-Permission-Assignment/DOC-04_Documentation.md)
- [Permission Decorators Documentation](../Group-E_Permission-Decorators-Mixins/DOC-04_Documentation.md)
- [Multi-Tenancy Documentation](../../Phase-02_Database-Architecture-MultiTenancy/README.md)

#### External Resources

- [Django Authentication Documentation](https://docs.djangoproject.com/en/stable/topics/auth/)
- [Django Permissions Documentation](https://docs.djangoproject.com/en/stable/topics/auth/default/#permissions-and-authorization)
- [Redis Caching Documentation](https://redis.io/docs/manual/client-side-caching/)
- [django-redis Documentation](https://github.com/jazzband/django-redis)
- [PostgreSQL Indexes Documentation](https://www.postgresql.org/docs/current/indexes.html)

---

### Appendix G: SQL Query Examples

#### Get All Permissions for User

```sql
-- Get all permissions for a user via roles
SELECT DISTINCT p.codename, p.name, p.app_label
FROM users_user u
INNER JOIN users_user_roles ur ON u.id = ur.user_id
INNER JOIN roles_role r ON ur.role_id = r.id
INNER JOIN roles_role_permissions rp ON r.id = rp.role_id
INNER JOIN auth_permission p ON rp.permission_id = p.id
WHERE u.id = 123
  AND u.is_active = TRUE
  AND r.is_active = TRUE
ORDER BY p.app_label, p.codename;
```

#### Get Users with Specific Role

```sql
-- Find all users with 'Store Manager' role
SELECT u.id, u.email, u.full_name, ur.is_primary, ur.assigned_at
FROM users_user u
INNER JOIN users_user_roles ur ON u.id = ur.user_id
INNER JOIN roles_role r ON ur.role_id = r.id
WHERE r.slug = 'store-manager'
  AND u.is_active = TRUE
ORDER BY ur.is_primary DESC, ur.assigned_at DESC;
```

#### Find Primary Role for Users

```sql
-- Get primary role for all active users
SELECT u.id, u.email, r.name as primary_role, r.slug
FROM users_user u
LEFT JOIN users_user_roles ur ON u.id = ur.user_id AND ur.is_primary = TRUE
LEFT JOIN roles_role r ON ur.role_id = r.id
WHERE u.is_active = TRUE
ORDER BY u.email;
```

#### Check Permission for User

```sql
-- Check if specific user has specific permission
SELECT EXISTS (
    SELECT 1
    FROM users_user u
    INNER JOIN users_user_roles ur ON u.id = ur.user_id
    INNER JOIN roles_role r ON ur.role_id = r.id
    INNER JOIN roles_role_permissions rp ON r.id = rp.role_id
    INNER JOIN auth_permission p ON rp.permission_id = p.id
    WHERE u.id = 123
      AND p.codename = 'delete_product'
      AND u.is_active = TRUE
      AND r.is_active = TRUE
) as has_permission;
```

#### Role Assignment Statistics

```sql
-- Get role assignment statistics
SELECT 
    r.name as role_name,
    COUNT(DISTINCT ur.user_id) as user_count,
    COUNT(CASE WHEN ur.is_primary THEN 1 END) as primary_count,
    COUNT(DISTINCT rp.permission_id) as permission_count
FROM roles_role r
LEFT JOIN users_user_roles ur ON r.id = ur.role_id
LEFT JOIN roles_role_permissions rp ON r.id = rp.role_id
WHERE r.is_active = TRUE
GROUP BY r.id, r.name
ORDER BY user_count DESC;
```
```

### Expected Outcome

```
backend/
└── docs/
    └── user-roles/
        └── USER_ROLES.md              # Comprehensive documentation
            ├── Overview
            ├── UserRole Model
            ├── UserRoleManager
            ├── User Permission Methods
            ├── Caching Strategy
            ├── API Reference
            ├── Configuration
            ├── Code Examples
            ├── Troubleshooting
            ├── Best Practices
            └── Appendices
```

### Verification Checklist

- [ ] Documentation file created at `backend/docs/user-roles/USER_ROLES.md`
- [ ] UserRole model fully documented with schema
- [ ] UserRoleManager methods documented with examples
- [ ] User permission methods documented
- [ ] Permission caching strategy explained
- [ ] API endpoints documented with curl examples
- [ ] Configuration section included
- [ ] Code examples for common scenarios provided
- [ ] Troubleshooting guide with solutions included
- [ ] Best practices section added
- [ ] All appendices completed (A through G)
- [ ] Internal documentation links verified
- [ ] External resource links verified
- [ ] SQL query examples tested
- [ ] Documentation reviewed for accuracy
- [ ] Documentation follows markdown best practices

---

## Summary

### Task Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 62 | Document User Roles | `USER_ROLES.md` comprehensive documentation |

### Final Group D Directory Structure

```
backend/
├── apps/
│   └── users/
│       ├── models/
│       │   ├── user_role.py         # From Tasks 47-53
│       │   └── user.py               # Extended in Tasks 58-60
│       ├── managers/
│       │   └── user_role_manager.py  # From Tasks 54-57
│       └── cache/
│           └── permission_cache.py   # From Task 61
└── docs/
    └── user-roles/
        └── USER_ROLES.md             # Task 62 - Complete documentation
```

### Group D Completion

All 62 tasks in Group D are now complete. The User-Role management system has been fully implemented with:
- UserRole junction model with metadata
- UserRoleManager with assignment/removal methods
- User permission checking methods (has_perm, has_role, get_all_permissions)
- Redis-based permission caching for performance
- Comprehensive documentation covering all aspects

### Next Steps

1. **Review documentation** for accuracy and completeness
2. **Test all code examples** in the documentation
3. **Verify API endpoints** with actual requests
4. Proceed to [../Group-E_Permission-Decorators-Mixins/](../Group-E_Permission-Decorators-Mixins/) to implement permission decorators and view mixins

---

## Notes for AI Agents

1. **Documentation Location:** Place in `backend/docs/user-roles/USER_ROLES.md`
2. **Markdown Format:** Use proper Markdown with code blocks, tables, and links
3. **Code Examples:** All examples should be tested and working
4. **API Examples:** Provide complete curl commands with all required headers
5. **Troubleshooting:** Include real-world issues and tested solutions
6. **Appendices:** Keep reference tables up to date
7. **Links:** Verify all internal and external documentation links
8. **SQL Queries:** Test all SQL examples against actual schema
9. **Cache Keys:** Match cache key patterns used in actual implementation
10. **Version History:** Update when schema or functionality changes
11. **Multi-Tenant:** Emphasize tenant isolation throughout documentation
12. **Security:** Highlight security best practices and common pitfalls
