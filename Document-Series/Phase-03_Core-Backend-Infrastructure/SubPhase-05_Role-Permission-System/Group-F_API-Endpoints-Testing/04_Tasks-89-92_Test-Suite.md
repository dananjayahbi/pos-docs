# Tasks 89-92: Test Suite & Documentation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** F - API Endpoints & Testing  
> **Document:** 04 of 04  
> **Tasks Covered:** 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-87-88_URLs-Admin.md](03_Tasks-87-88_URLs-Admin.md)
- **→ Next SubPhase:** [../../SubPhase-06_Core-Middleware-Stack/](../../SubPhase-06_Core-Middleware-Stack/)

---

## Document Overview

This document covers the comprehensive test suite for the role-permission system and the creation of complete system documentation. This is the **FINAL document** in Group-F and SubPhase-05.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 89 | Create Role Model Tests | High |
| 90 | Create Permission Tests | High |
| 91 | Create Decorator Tests | High |
| 92 | Document Role System | High |

---

## Task 89: Create Role Model Tests

### Overview
Create comprehensive unit tests for the Role model, covering creation, validation, constraints, hierarchy, and system role protection.

### Dependencies
- Task 73: Create Role Model
- Task 74: Create Role-Permission Relationship
- Task 75: Add Hierarchy Support

### Instructions

1. **Create test_roles.py file**
   - Create file at `backend/apps/users/tests/test_roles.py`
   - Import necessary testing libraries

2. **Add test imports**
   ```python
   from django.test import TestCase
   from django.core.exceptions import ValidationError
   from django.db import IntegrityError
   from django.contrib.contenttypes.models import ContentType
   from apps.users.models import Role, Permission, UserRole, User
   from apps.tenants.models import Tenant
   ```

3. **Create RoleModelTests class**
   - Test class with setUp method
   - Create test tenant and users
   - Create sample roles for testing

4. **Test role creation**
   ```python
   def test_role_creation(self):
       """Test basic role creation"""
       role = Role.objects.create(
           tenant=self.tenant,
           name="Test Role",
           slug="test_role",
           description="Test description",
           hierarchy_level=50
       )
       self.assertEqual(role.name, "Test Role")
       self.assertEqual(role.slug, "test_role")
   ```

5. **Test role uniqueness constraints**
   ```python
   def test_role_unique_slug_per_tenant(self):
       """Test that slug is unique per tenant"""
       Role.objects.create(
           tenant=self.tenant,
           name="Role 1",
           slug="test_role"
       )
       with self.assertRaises(IntegrityError):
           Role.objects.create(
               tenant=self.tenant,
               name="Role 2",
               slug="test_role"
           )
   ```

6. **Test slug auto-generation**
   ```python
   def test_slug_auto_generation(self):
       """Test that slug is auto-generated from name"""
       role = Role.objects.create(
           tenant=self.tenant,
           name="Test Role Name"
       )
       self.assertEqual(role.slug, "test_role_name")
   ```

7. **Test role hierarchy**
   ```python
   def test_role_hierarchy_levels(self):
       """Test role hierarchy levels"""
       admin_role = Role.objects.create(
           tenant=self.tenant,
           name="Admin",
           hierarchy_level=90
       )
       manager_role = Role.objects.create(
           tenant=self.tenant,
           name="Manager",
           hierarchy_level=70
       )
       self.assertTrue(admin_role.hierarchy_level > manager_role.hierarchy_level)
   ```

8. **Test parent-child relationship**
   ```python
   def test_role_parent_child(self):
       """Test parent-child role relationship"""
       parent = Role.objects.create(
           tenant=self.tenant,
           name="Parent Role",
           hierarchy_level=80
       )
       child = Role.objects.create(
           tenant=self.tenant,
           name="Child Role",
           parent=parent,
           hierarchy_level=60
       )
       self.assertEqual(child.parent, parent)
       self.assertIn(child, parent.children.all())
   ```

9. **Test system role protection**
   ```python
   def test_system_role_cannot_be_deleted(self):
       """Test that system roles cannot be deleted"""
       system_role = Role.objects.create(
           tenant=self.tenant,
           name="System Admin",
           is_system_role=True
       )
       with self.assertRaises(ValidationError):
           system_role.delete()
   
   def test_system_role_cannot_be_modified(self):
       """Test that critical fields of system roles cannot be modified"""
       system_role = Role.objects.create(
           tenant=self.tenant,
           name="System Admin",
           slug="system_admin",
           is_system_role=True
       )
       system_role.slug = "modified_slug"
       with self.assertRaises(ValidationError):
           system_role.save()
   ```

10. **Test role string representation**
    ```python
    def test_role_str_method(self):
        """Test role string representation"""
        role = Role.objects.create(
            tenant=self.tenant,
            name="Test Role"
        )
        self.assertEqual(str(role), "Test Role")
    ```

11. **Test role permissions count**
    ```python
    def test_role_permissions_count(self):
        """Test counting permissions assigned to role"""
        role = Role.objects.create(
            tenant=self.tenant,
            name="Test Role"
        )
        # Create and assign permissions
        for i in range(3):
            perm = Permission.objects.create(
                tenant=self.tenant,
                codename=f"test_perm_{i}",
                name=f"Test Permission {i}"
            )
            role.permissions.add(perm)
        
        self.assertEqual(role.permissions.count(), 3)
    ```

12. **Test role ordering**
    ```python
    def test_role_default_ordering(self):
        """Test that roles are ordered by hierarchy_level desc"""
        Role.objects.create(tenant=self.tenant, name="Low", hierarchy_level=10)
        Role.objects.create(tenant=self.tenant, name="High", hierarchy_level=90)
        Role.objects.create(tenant=self.tenant, name="Medium", hierarchy_level=50)
        
        roles = Role.objects.all()
        self.assertEqual(roles[0].name, "High")
        self.assertEqual(roles[1].name, "Medium")
        self.assertEqual(roles[2].name, "Low")
    ```

### Test Class Structure
```python
class RoleModelTests(TestCase):
    def setUp(self):
        # Create test tenant
        # Create test users
        # Create sample roles
        
    def test_role_creation(self): ...
    def test_role_unique_slug_per_tenant(self): ...
    def test_slug_auto_generation(self): ...
    def test_role_hierarchy_levels(self): ...
    def test_role_parent_child(self): ...
    def test_system_role_cannot_be_deleted(self): ...
    def test_system_role_cannot_be_modified(self): ...
    def test_role_str_method(self): ...
    def test_role_permissions_count(self): ...
    def test_role_default_ordering(self): ...
```

### Expected Outcome
```
backend/apps/users/tests/
└── test_roles.py              # Role model tests
```

### Verification Checklist
- [ ] `test_roles.py` file created in tests directory
- [ ] All test methods follow naming convention `test_*`
- [ ] Tests cover role creation and validation
- [ ] Tests cover uniqueness constraints
- [ ] Tests cover hierarchy functionality
- [ ] Tests cover parent-child relationships
- [ ] Tests cover system role protection
- [ ] Tests cover string representation
- [ ] All tests pass successfully
- [ ] Test coverage > 90% for Role model

---

## Task 90: Create Permission Tests

### Overview
Create comprehensive tests for Permission model, permission assignment, inheritance, user permission checking, and caching.

### Dependencies
- Task 73: Create Role Model
- Task 74: Create Role-Permission Relationship
- Task 76: Add User Permission Methods

### Instructions

1. **Create test_permissions.py file**
   - Create file at `backend/apps/users/tests/test_permissions.py`
   - Import necessary testing libraries

2. **Add test imports**
   ```python
   from django.test import TestCase
   from django.core.cache import cache
   from django.contrib.contenttypes.models import ContentType
   from apps.users.models import Role, Permission, UserRole, User
   from apps.tenants.models import Tenant
   ```

3. **Create PermissionModelTests class**
   - Test class with setUp and tearDown methods
   - Clear cache in tearDown to ensure clean test state

4. **Test permission creation**
   ```python
   def test_permission_creation(self):
       """Test basic permission creation"""
       content_type = ContentType.objects.get(app_label='users', model='user')
       permission = Permission.objects.create(
           tenant=self.tenant,
           codename="test_permission",
           name="Test Permission",
           content_type=content_type
       )
       self.assertEqual(permission.codename, "test_permission")
       self.assertEqual(permission.name, "Test Permission")
   ```

5. **Test permission uniqueness**
   ```python
   def test_permission_unique_codename_per_tenant(self):
       """Test that codename is unique per tenant"""
       Permission.objects.create(
           tenant=self.tenant,
           codename="test_perm"
       )
       with self.assertRaises(IntegrityError):
           Permission.objects.create(
               tenant=self.tenant,
               codename="test_perm"
           )
   ```

6. **Test permission assignment to role**
   ```python
   def test_assign_permission_to_role(self):
       """Test assigning permission to role"""
       role = Role.objects.create(
           tenant=self.tenant,
           name="Test Role"
       )
       permission = Permission.objects.create(
           tenant=self.tenant,
           codename="test_permission"
       )
       role.permissions.add(permission)
       
       self.assertIn(permission, role.permissions.all())
       self.assertEqual(role.permissions.count(), 1)
   ```

7. **Test multiple permissions assignment**
   ```python
   def test_assign_multiple_permissions(self):
       """Test assigning multiple permissions to role"""
       role = Role.objects.create(
           tenant=self.tenant,
           name="Test Role"
       )
       permissions = [
           Permission.objects.create(
               tenant=self.tenant,
               codename=f"perm_{i}"
           ) for i in range(5)
       ]
       role.permissions.add(*permissions)
       
       self.assertEqual(role.permissions.count(), 5)
   ```

8. **Test user permission checking**
   ```python
   def test_user_has_permission(self):
       """Test checking if user has specific permission"""
       user = User.objects.create_user(
           tenant=self.tenant,
           username="testuser",
           email="test@example.com"
       )
       role = Role.objects.create(
           tenant=self.tenant,
           name="Editor"
       )
       permission = Permission.objects.create(
           tenant=self.tenant,
           codename="edit_article"
       )
       role.permissions.add(permission)
       UserRole.objects.create(user=user, role=role)
       
       self.assertTrue(user.has_perm("edit_article"))
   ```

9. **Test user without permission**
   ```python
   def test_user_does_not_have_permission(self):
       """Test that user without permission returns False"""
       user = User.objects.create_user(
           tenant=self.tenant,
           username="testuser",
           email="test@example.com"
       )
       self.assertFalse(user.has_perm("nonexistent_permission"))
   ```

10. **Test permission inheritance through hierarchy**
    ```python
    def test_permission_inheritance_from_parent_role(self):
        """Test that child role inherits parent permissions"""
        parent_role = Role.objects.create(
            tenant=self.tenant,
            name="Parent",
            hierarchy_level=80
        )
        child_role = Role.objects.create(
            tenant=self.tenant,
            name="Child",
            parent=parent_role,
            hierarchy_level=60
        )
        permission = Permission.objects.create(
            tenant=self.tenant,
            codename="parent_permission"
        )
        parent_role.permissions.add(permission)
        
        user = User.objects.create_user(
            tenant=self.tenant,
            username="testuser",
            email="test@example.com"
        )
        UserRole.objects.create(user=user, role=child_role)
        
        # User should inherit parent's permission
        self.assertTrue(user.has_perm("parent_permission"))
    ```

11. **Test get_all_permissions method**
    ```python
    def test_user_get_all_permissions(self):
        """Test getting all user permissions"""
        user = User.objects.create_user(
            tenant=self.tenant,
            username="testuser",
            email="test@example.com"
        )
        role = Role.objects.create(
            tenant=self.tenant,
            name="Editor"
        )
        permissions = [
            Permission.objects.create(
                tenant=self.tenant,
                codename=f"edit_{item}"
            ) for item in ["article", "page", "comment"]
        ]
        role.permissions.add(*permissions)
        UserRole.objects.create(user=user, role=role)
        
        all_perms = user.get_all_permissions()
        self.assertEqual(len(all_perms), 3)
        self.assertIn("edit_article", all_perms)
        self.assertIn("edit_page", all_perms)
        self.assertIn("edit_comment", all_perms)
    ```

12. **Test permission caching**
    ```python
    def test_permission_caching(self):
        """Test that permissions are cached"""
        user = User.objects.create_user(
            tenant=self.tenant,
            username="testuser",
            email="test@example.com"
        )
        role = Role.objects.create(
            tenant=self.tenant,
            name="Editor"
        )
        permission = Permission.objects.create(
            tenant=self.tenant,
            codename="edit_article"
        )
        role.permissions.add(permission)
        UserRole.objects.create(user=user, role=role)
        
        # First call - cache miss
        cache_key = f"user_permissions_{user.id}"
        cache.delete(cache_key)
        perms1 = user.get_all_permissions()
        
        # Second call - should use cache
        perms2 = user.get_all_permissions()
        
        self.assertEqual(perms1, perms2)
        self.assertIsNotNone(cache.get(cache_key))
    
    def test_permission_cache_invalidation(self):
        """Test that permission cache is invalidated on role change"""
        user = User.objects.create_user(
            tenant=self.tenant,
            username="testuser",
            email="test@example.com"
        )
        role = Role.objects.create(
            tenant=self.tenant,
            name="Editor"
        )
        UserRole.objects.create(user=user, role=role)
        
        # Get permissions - cache created
        user.get_all_permissions()
        cache_key = f"user_permissions_{user.id}"
        self.assertIsNotNone(cache.get(cache_key))
        
        # Add new permission - cache should be invalidated
        permission = Permission.objects.create(
            tenant=self.tenant,
            codename="new_permission"
        )
        role.permissions.add(permission)
        
        # Cache should be cleared
        self.assertIsNone(cache.get(cache_key))
    ```

13. **Test multiple roles permissions**
    ```python
    def test_user_with_multiple_roles(self):
        """Test user with multiple roles gets combined permissions"""
        user = User.objects.create_user(
            tenant=self.tenant,
            username="testuser",
            email="test@example.com"
        )
        
        # Create two roles with different permissions
        role1 = Role.objects.create(tenant=self.tenant, name="Role 1")
        role2 = Role.objects.create(tenant=self.tenant, name="Role 2")
        
        perm1 = Permission.objects.create(tenant=self.tenant, codename="perm_1")
        perm2 = Permission.objects.create(tenant=self.tenant, codename="perm_2")
        
        role1.permissions.add(perm1)
        role2.permissions.add(perm2)
        
        UserRole.objects.create(user=user, role=role1)
        UserRole.objects.create(user=user, role=role2)
        
        # User should have both permissions
        self.assertTrue(user.has_perm("perm_1"))
        self.assertTrue(user.has_perm("perm_2"))
        self.assertEqual(len(user.get_all_permissions()), 2)
    ```

14. **Test permission with content type**
    ```python
    def test_permission_with_content_type(self):
        """Test permission linked to specific content type"""
        content_type = ContentType.objects.get(app_label='users', model='user')
        permission = Permission.objects.create(
            tenant=self.tenant,
            codename="change_user",
            name="Can change user",
            content_type=content_type
        )
        self.assertEqual(permission.content_type, content_type)
        self.assertEqual(permission.content_type.model, 'user')
    ```

### Test Class Structure
```python
class PermissionModelTests(TestCase):
    def setUp(self):
        # Create test tenant, users, roles
        
    def tearDown(self):
        # Clear cache
        cache.clear()
    
    def test_permission_creation(self): ...
    def test_permission_unique_codename_per_tenant(self): ...
    def test_assign_permission_to_role(self): ...
    def test_assign_multiple_permissions(self): ...
    def test_user_has_permission(self): ...
    def test_user_does_not_have_permission(self): ...
    def test_permission_inheritance_from_parent_role(self): ...
    def test_user_get_all_permissions(self): ...
    def test_permission_caching(self): ...
    def test_permission_cache_invalidation(self): ...
    def test_user_with_multiple_roles(self): ...
    def test_permission_with_content_type(self): ...
```

### Expected Outcome
```
backend/apps/users/tests/
├── test_roles.py
└── test_permissions.py        # Permission tests
```

### Verification Checklist
- [ ] `test_permissions.py` file created
- [ ] Tests cover permission creation
- [ ] Tests cover permission assignment
- [ ] Tests cover user permission checking
- [ ] Tests cover permission inheritance
- [ ] Tests cover permission caching
- [ ] Tests cover cache invalidation
- [ ] Tests cover multiple roles scenario
- [ ] Tests cover content type permissions
- [ ] All tests pass successfully
- [ ] Test coverage > 90% for Permission model

---

## Task 91: Create Decorator Tests

### Overview
Create comprehensive tests for permission decorators, DRF permission classes, and view-level permission enforcement.

### Dependencies
- Task 77: Create Permission Decorators
- Task 78: Create DRF Permission Classes
- Task 81-86: API Views

### Instructions

1. **Create test_decorators.py file**
   - Create file at `backend/apps/users/tests/test_decorators.py`
   - Import necessary testing libraries

2. **Add test imports**
   ```python
   from django.test import TestCase, RequestFactory
   from django.http import HttpResponse
   from django.contrib.auth.models import AnonymousUser
   from rest_framework.test import APITestCase, APIClient
   from rest_framework import status
   from apps.users.models import Role, Permission, UserRole, User
   from apps.users.decorators import (
       permission_required,
       role_required,
       tenant_admin_required
   )
   from apps.users.permissions import (
       HasPermission,
       HasRole,
       IsTenantAdmin
   )
   from apps.tenants.models import Tenant
   ```

3. **Create test view functions**
   ```python
   # Test view decorated with permission_required
   @permission_required("test_permission")
   def test_view_with_permission(request):
       return HttpResponse("Success")
   
   # Test view decorated with role_required
   @role_required("editor")
   def test_view_with_role(request):
       return HttpResponse("Success")
   
   # Test view decorated with tenant_admin_required
   @tenant_admin_required
   def test_view_admin_only(request):
       return HttpResponse("Success")
   ```

4. **Create PermissionDecoratorTests class**
   ```python
   class PermissionDecoratorTests(TestCase):
       def setUp(self):
           self.factory = RequestFactory()
           self.tenant = Tenant.objects.create(
               name="Test Tenant",
               slug="test-tenant"
           )
           self.user = User.objects.create_user(
               tenant=self.tenant,
               username="testuser",
               email="test@example.com",
               password="testpass123"
           )
           self.permission = Permission.objects.create(
               tenant=self.tenant,
               codename="test_permission"
           )
   ```

5. **Test permission_required decorator - success**
   ```python
   def test_permission_required_with_permission(self):
       """Test that user with permission can access view"""
       role = Role.objects.create(tenant=self.tenant, name="Test Role")
       role.permissions.add(self.permission)
       UserRole.objects.create(user=self.user, role=role)
       
       request = self.factory.get('/test/')
       request.user = self.user
       
       response = test_view_with_permission(request)
       self.assertEqual(response.status_code, 200)
       self.assertEqual(response.content.decode(), "Success")
   ```

6. **Test permission_required decorator - denied**
   ```python
   def test_permission_required_without_permission(self):
       """Test that user without permission is denied"""
       request = self.factory.get('/test/')
       request.user = self.user
       
       response = test_view_with_permission(request)
       self.assertEqual(response.status_code, 403)
   ```

7. **Test permission_required with anonymous user**
   ```python
   def test_permission_required_anonymous_user(self):
       """Test that anonymous user is redirected to login"""
       request = self.factory.get('/test/')
       request.user = AnonymousUser()
       
       response = test_view_with_permission(request)
       self.assertEqual(response.status_code, 302)  # Redirect
   ```

8. **Test role_required decorator - success**
   ```python
   def test_role_required_with_role(self):
       """Test that user with required role can access view"""
       role = Role.objects.create(
           tenant=self.tenant,
           name="Editor",
           slug="editor"
       )
       UserRole.objects.create(user=self.user, role=role)
       
       request = self.factory.get('/test/')
       request.user = self.user
       
       response = test_view_with_role(request)
       self.assertEqual(response.status_code, 200)
   ```

9. **Test role_required decorator - denied**
   ```python
   def test_role_required_without_role(self):
       """Test that user without required role is denied"""
       request = self.factory.get('/test/')
       request.user = self.user
       
       response = test_view_with_role(request)
       self.assertEqual(response.status_code, 403)
   ```

10. **Test tenant_admin_required decorator**
    ```python
    def test_tenant_admin_required_as_admin(self):
        """Test that tenant admin can access protected view"""
        self.user.is_tenant_admin = True
        self.user.save()
        
        request = self.factory.get('/test/')
        request.user = self.user
        
        response = test_view_admin_only(request)
        self.assertEqual(response.status_code, 200)
    
    def test_tenant_admin_required_not_admin(self):
        """Test that non-admin user is denied"""
        request = self.factory.get('/test/')
        request.user = self.user
        
        response = test_view_admin_only(request)
        self.assertEqual(response.status_code, 403)
    ```

11. **Create DRF permission tests class**
    ```python
    class DRFPermissionTests(APITestCase):
        def setUp(self):
            self.client = APIClient()
            self.tenant = Tenant.objects.create(
                name="Test Tenant",
                slug="test-tenant"
            )
            self.user = User.objects.create_user(
                tenant=self.tenant,
                username="testuser",
                email="test@example.com",
                password="testpass123"
            )
    ```

12. **Test HasPermission class**
    ```python
    def test_has_permission_class_with_permission(self):
        """Test HasPermission DRF permission class"""
        permission = Permission.objects.create(
            tenant=self.tenant,
            codename="view_data"
        )
        role = Role.objects.create(tenant=self.tenant, name="Viewer")
        role.permissions.add(permission)
        UserRole.objects.create(user=self.user, role=role)
        
        self.client.force_authenticate(user=self.user)
        
        # Assuming an endpoint that requires 'view_data' permission
        response = self.client.get('/api/v1/protected-endpoint/')
        self.assertNotEqual(response.status_code, 403)
    
    def test_has_permission_class_without_permission(self):
        """Test HasPermission denies access without permission"""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get('/api/v1/protected-endpoint/')
        self.assertEqual(response.status_code, 403)
    ```

13. **Test HasRole class**
    ```python
    def test_has_role_class_with_role(self):
        """Test HasRole DRF permission class"""
        role = Role.objects.create(
            tenant=self.tenant,
            name="Editor",
            slug="editor"
        )
        UserRole.objects.create(user=self.user, role=role)
        
        self.client.force_authenticate(user=self.user)
        
        # Endpoint requiring 'editor' role
        response = self.client.get('/api/v1/editor-endpoint/')
        self.assertNotEqual(response.status_code, 403)
    ```

14. **Test IsTenantAdmin class**
    ```python
    def test_is_tenant_admin_class(self):
        """Test IsTenantAdmin DRF permission class"""
        self.user.is_tenant_admin = True
        self.user.save()
        
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get('/api/v1/admin-endpoint/')
        self.assertNotEqual(response.status_code, 403)
    
    def test_is_tenant_admin_class_denies_non_admin(self):
        """Test IsTenantAdmin denies non-admin users"""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get('/api/v1/admin-endpoint/')
        self.assertEqual(response.status_code, 403)
    ```

15. **Test API endpoint permissions**
    ```python
    def test_role_list_view_requires_admin(self):
        """Test that role list endpoint requires tenant admin"""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get('/api/v1/roles/')
        self.assertEqual(response.status_code, 403)
        
        # Grant admin
        self.user.is_tenant_admin = True
        self.user.save()
        
        response = self.client.get('/api/v1/roles/')
        self.assertEqual(response.status_code, 200)
    
    def test_my_permissions_view_requires_authentication(self):
        """Test that my permissions endpoint requires authentication"""
        response = self.client.get('/api/v1/me/permissions/')
        self.assertEqual(response.status_code, 401)
        
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/v1/me/permissions/')
        self.assertEqual(response.status_code, 200)
    ```

16. **Test permission with multiple conditions**
    ```python
    def test_multiple_permissions_required(self):
        """Test view requiring multiple permissions"""
        perm1 = Permission.objects.create(
            tenant=self.tenant,
            codename="read_data"
        )
        perm2 = Permission.objects.create(
            tenant=self.tenant,
            codename="write_data"
        )
        role = Role.objects.create(tenant=self.tenant, name="Editor")
        
        # Only has read permission
        role.permissions.add(perm1)
        UserRole.objects.create(user=self.user, role=role)
        
        self.client.force_authenticate(user=self.user)
        
        # Should fail without write permission
        response = self.client.post('/api/v1/data/')
        self.assertEqual(response.status_code, 403)
        
        # Add write permission
        role.permissions.add(perm2)
        
        # Should succeed with both permissions
        response = self.client.post('/api/v1/data/')
        self.assertNotEqual(response.status_code, 403)
    ```

### Test Class Structure
```python
class PermissionDecoratorTests(TestCase):
    def setUp(self): ...
    def test_permission_required_with_permission(self): ...
    def test_permission_required_without_permission(self): ...
    def test_permission_required_anonymous_user(self): ...
    def test_role_required_with_role(self): ...
    def test_role_required_without_role(self): ...
    def test_tenant_admin_required_as_admin(self): ...
    def test_tenant_admin_required_not_admin(self): ...

class DRFPermissionTests(APITestCase):
    def setUp(self): ...
    def test_has_permission_class_with_permission(self): ...
    def test_has_permission_class_without_permission(self): ...
    def test_has_role_class_with_role(self): ...
    def test_is_tenant_admin_class(self): ...
    def test_is_tenant_admin_class_denies_non_admin(self): ...
    def test_role_list_view_requires_admin(self): ...
    def test_my_permissions_view_requires_authentication(self): ...
    def test_multiple_permissions_required(self): ...
```

### Expected Outcome
```
backend/apps/users/tests/
├── test_roles.py
├── test_permissions.py
└── test_decorators.py         # Decorator and permission class tests
```

### Verification Checklist
- [ ] `test_decorators.py` file created
- [ ] Tests cover permission_required decorator
- [ ] Tests cover role_required decorator
- [ ] Tests cover tenant_admin_required decorator
- [ ] Tests cover HasPermission DRF class
- [ ] Tests cover HasRole DRF class
- [ ] Tests cover IsTenantAdmin DRF class
- [ ] Tests cover API endpoint permissions
- [ ] Tests cover anonymous user scenarios
- [ ] Tests cover multiple permission scenarios
- [ ] All tests pass successfully
- [ ] Test coverage > 90% for decorators and permission classes

---

## Task 92: Document Role System

### Overview
Create comprehensive documentation for the entire Role-Based Access Control (RBAC) system, including architecture, usage examples, API reference, and best practices.

### Dependencies
- All tasks in SubPhase-05 (Tasks 73-91)

### Instructions

1. **Create documentation directory structure**
   - Create directory at `backend/docs/rbac/`
   - Create subdirectories for different documentation types

2. **Create RBAC_OVERVIEW.md**
   - Create file at `backend/docs/rbac/RBAC_OVERVIEW.md`
   - Document the overall architecture and design decisions

3. **RBAC Overview content structure**
   ```markdown
   # Role-Based Access Control (RBAC) System
   
   ## Overview
   Comprehensive multi-tenant RBAC system for LankaCommerce Cloud.
   
   ## Architecture
   ### Components
   - Role Model
   - Permission Model
   - UserRole Model (many-to-many through table)
   - Hierarchy Support
   
   ## Design Principles
   - Multi-tenancy isolation
   - Role hierarchy
   - Permission inheritance
   - Caching for performance
   - Flexible assignment
   
   ## Key Features
   - Tenant-specific roles and permissions
   - System roles (protected)
   - Role hierarchy with inheritance
   - Multiple roles per user
   - Primary role designation
   - Permission caching
   - Django and DRF integration
   ```

4. **Create MODELS.md documentation**
   - Create file at `backend/docs/rbac/MODELS.md`
   - Document all models with field descriptions

5. **Models documentation content**
   ```markdown
   # RBAC Models
   
   ## Role Model
   ### Fields
   | Field | Type | Description |
   |-------|------|-------------|
   | tenant | FK | Tenant isolation |
   | name | CharField | Display name |
   | slug | SlugField | Unique identifier |
   | description | TextField | Role description |
   | hierarchy_level | IntegerField | 0-100, higher = more power |
   | parent | FK | Parent role for inheritance |
   | is_system_role | BooleanField | Protected system role |
   | permissions | M2M | Assigned permissions |
   
   ### Methods
   - get_all_permissions(): Returns all permissions including inherited
   - can_assign_role(other_role): Check if can assign another role
   
   ## Permission Model
   [Similar detailed documentation]
   
   ## UserRole Model
   [Through table documentation]
   ```

6. **Create API_REFERENCE.md**
   - Create file at `backend/docs/rbac/API_REFERENCE.md`
   - Document all API endpoints with examples

7. **API Reference content**
   ```markdown
   # RBAC API Reference
   
   ## Endpoints
   
   ### List Roles
   **GET** /api/v1/roles/
   
   **Permission:** Tenant Admin
   
   **Response:**
   ```json
   {
       "count": 5,
       "results": [
           {
               "id": 1,
               "name": "Tenant Admin",
               "slug": "tenant_admin",
               "hierarchy_level": 100
           }
       ]
   }
   ```
   
   ### Get Role Details
   **GET** /api/v1/roles/{id}/
   
   [Include all endpoints with examples]
   ```

8. **Create USAGE_GUIDE.md**
   - Create file at `backend/docs/rbac/USAGE_GUIDE.md`
   - Provide practical usage examples

9. **Usage guide content**
   ```markdown
   # RBAC Usage Guide
   
   ## Creating Roles
   ```python
   from apps.users.models import Role, Permission
   
   # Create a role
   role = Role.objects.create(
       tenant=tenant,
       name="Content Editor",
       slug="content_editor",
       hierarchy_level=50
   )
   ```
   
   ## Assigning Permissions
   ```python
   # Create permissions
   perm1 = Permission.objects.create(
       tenant=tenant,
       codename="edit_article"
   )
   
   # Assign to role
   role.permissions.add(perm1)
   ```
   
   ## Assigning Roles to Users
   ```python
   from apps.users.models import UserRole
   
   UserRole.objects.create(
       user=user,
       role=role,
       is_primary=True
   )
   ```
   
   ## Checking Permissions
   ```python
   # In views
   if user.has_perm("edit_article"):
       # Allow access
   
   # Using decorators
   @permission_required("edit_article")
   def my_view(request):
       pass
   ```
   ```

10. **Create DECORATORS.md**
    - Create file at `backend/docs/rbac/DECORATORS.md`
    - Document all decorators and permission classes

11. **Decorators documentation content**
    ```markdown
    # RBAC Decorators & Permission Classes
    
    ## Function-Based View Decorators
    
    ### @permission_required
    ```python
    from apps.users.decorators import permission_required
    
    @permission_required("edit_article")
    def edit_article_view(request, article_id):
        # User must have 'edit_article' permission
        pass
    ```
    
    ### @role_required
    ```python
    @role_required("editor")
    def editor_dashboard(request):
        # User must have 'editor' role
        pass
    ```
    
    ## DRF Permission Classes
    
    ### HasPermission
    ```python
    from rest_framework import generics
    from apps.users.permissions import HasPermission
    
    class ArticleUpdateView(generics.UpdateAPIView):
        permission_classes = [HasPermission]
        required_permission = "edit_article"
    ```
    
    [Document all classes with examples]
    ```

12. **Create TESTING.md**
    - Create file at `backend/docs/rbac/TESTING.md`
    - Document testing strategies and examples

13. **Testing documentation content**
    ```markdown
    # Testing RBAC
    
    ## Test Setup
    ```python
    from django.test import TestCase
    from apps.users.models import Role, Permission, UserRole, User
    
    class MyTestCase(TestCase):
        def setUp(self):
            self.tenant = Tenant.objects.create(...)
            self.user = User.objects.create_user(...)
            self.role = Role.objects.create(...)
    ```
    
    ## Testing Permissions
    [Include examples from test files]
    
    ## Testing API Endpoints
    ```python
    from rest_framework.test import APITestCase
    
    class RoleAPITests(APITestCase):
        def test_list_roles_as_admin(self):
            # Test implementation
    ```
    ```

14. **Create BEST_PRACTICES.md**
    - Create file at `backend/docs/rbac/BEST_PRACTICES.md`
    - Document recommended patterns and anti-patterns

15. **Best practices content**
    ```markdown
    # RBAC Best Practices
    
    ## Role Design
    ✅ **DO:**
    - Keep role hierarchy simple (3-5 levels max)
    - Use descriptive role names
    - Document role purposes
    - Group related permissions
    
    ❌ **DON'T:**
    - Create too many roles (complexity)
    - Assign permissions directly to users
    - Modify system roles
    - Skip hierarchy validation
    
    ## Permission Design
    ✅ **DO:**
    - Use action-based permission names (e.g., "edit_article")
    - Keep permissions granular
    - Document permission purposes
    - Cache permission checks
    
    ❌ **DON'T:**
    - Use vague permission names
    - Create overly broad permissions
    - Skip cache invalidation
    
    ## Security Considerations
    - Always filter by tenant
    - Validate hierarchy before assignment
    - Protect system roles from modification
    - Log permission changes
    - Regular audit of role assignments
    
    ## Performance Optimization
    - Use select_related/prefetch_related
    - Leverage permission caching
    - Batch role assignments
    - Invalidate cache on changes
    ```

16. **Create MIGRATION_GUIDE.md**
    - Create file at `backend/docs/rbac/MIGRATION_GUIDE.md`
    - Document how to migrate from other permission systems

17. **Migration guide content**
    ```markdown
    # Migrating to RBAC
    
    ## From Django Groups
    ### Step 1: Map Groups to Roles
    ```python
    from django.contrib.auth.models import Group
    from apps.users.models import Role
    
    for group in Group.objects.all():
        role = Role.objects.create(
            tenant=tenant,
            name=group.name,
            slug=slugify(group.name)
        )
        # Map permissions
    ```
    
    ## From Custom Permission System
    [Provide migration strategies]
    ```

18. **Create README.md in docs/rbac/**
    - Create file at `backend/docs/rbac/README.md`
    - Index of all documentation files

19. **README content**
    ```markdown
    # RBAC Documentation
    
    Complete documentation for the Role-Based Access Control system.
    
    ## Documentation Files
    
    | File | Description |
    |------|-------------|
    | [RBAC_OVERVIEW.md](RBAC_OVERVIEW.md) | System architecture and design |
    | [MODELS.md](MODELS.md) | Model reference |
    | [API_REFERENCE.md](API_REFERENCE.md) | API endpoint documentation |
    | [USAGE_GUIDE.md](USAGE_GUIDE.md) | Practical usage examples |
    | [DECORATORS.md](DECORATORS.md) | Decorator reference |
    | [TESTING.md](TESTING.md) | Testing guide |
    | [BEST_PRACTICES.md](BEST_PRACTICES.md) | Recommended patterns |
    | [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) | Migration from other systems |
    
    ## Quick Links
    - [Getting Started](#getting-started)
    - [Common Use Cases](#common-use-cases)
    - [Troubleshooting](#troubleshooting)
    ```

20. **Add inline code documentation**
    - Add comprehensive docstrings to all models
    - Add docstrings to all views and serializers
    - Add docstrings to decorators and utilities
    - Follow Google-style docstring format

21. **Example docstring format**
    ```python
    class Role(TenantAwareModel):
        """
        Represents a role within a tenant's permission system.
        
        Roles group permissions and can be assigned to users. Roles support
        hierarchy where child roles inherit permissions from parent roles.
        
        Attributes:
            name (str): Human-readable role name
            slug (str): Unique identifier within tenant
            hierarchy_level (int): Position in hierarchy (0-100)
            parent (Role): Parent role for inheritance
            is_system_role (bool): Protected system role flag
            
        Example:
            >>> role = Role.objects.create(
            ...     tenant=tenant,
            ...     name="Content Editor",
            ...     hierarchy_level=50
            ... )
            >>> role.permissions.add(permission)
            >>> user_role = UserRole.objects.create(user=user, role=role)
        """
    ```

22. **Create inline examples in models**
    - Add usage examples in model docstrings
    - Add examples in method docstrings
    - Include edge cases and gotchas

### Documentation Structure
```
backend/docs/rbac/
├── README.md                  # Index and overview
├── RBAC_OVERVIEW.md          # Architecture and design
├── MODELS.md                 # Model reference
├── API_REFERENCE.md          # API endpoint docs
├── USAGE_GUIDE.md            # Practical examples
├── DECORATORS.md             # Decorator reference
├── TESTING.md                # Testing guide
├── BEST_PRACTICES.md         # Recommended patterns
└── MIGRATION_GUIDE.md        # Migration strategies
```

### Expected Outcome
```
backend/
├── apps/users/
│   ├── models.py             # With comprehensive docstrings
│   ├── views/
│   │   └── role_views.py     # With docstrings
│   ├── serializers/
│   │   └── role_serializers.py  # With docstrings
│   └── tests/                # Complete test suite
└── docs/
    └── rbac/                 # Complete documentation
        ├── README.md
        ├── RBAC_OVERVIEW.md
        ├── MODELS.md
        ├── API_REFERENCE.md
        ├── USAGE_GUIDE.md
        ├── DECORATORS.md
        ├── TESTING.md
        ├── BEST_PRACTICES.md
        └── MIGRATION_GUIDE.md
```

### Verification Checklist
- [ ] All documentation files created in `backend/docs/rbac/`
- [ ] RBAC_OVERVIEW.md covers architecture
- [ ] MODELS.md documents all models
- [ ] API_REFERENCE.md includes all endpoints
- [ ] USAGE_GUIDE.md provides practical examples
- [ ] DECORATORS.md documents all decorators
- [ ] TESTING.md includes testing strategies
- [ ] BEST_PRACTICES.md covers recommendations
- [ ] MIGRATION_GUIDE.md helps users migrate
- [ ] README.md indexes all documentation
- [ ] All models have comprehensive docstrings
- [ ] All views have docstrings
- [ ] All serializers have docstrings
- [ ] All decorators have docstrings
- [ ] Code examples are included throughout
- [ ] Edge cases are documented
- [ ] Security considerations are highlighted

---

## SubPhase Completion Notes

### What We've Built
This completes **SubPhase-05: Role & Permission System**. We now have:

✅ **Models (Group A-C):**
- Role model with hierarchy
- Permission model
- UserRole through table
- Multi-tenant isolation

✅ **User Methods (Group D):**
- has_perm() implementation
- get_all_permissions()
- get_roles()
- Permission caching

✅ **Decorators (Group E):**
- @permission_required
- @role_required
- @tenant_admin_required
- HasPermission DRF class
- HasRole DRF class
- IsTenantAdmin DRF class

✅ **API & Admin (Group F):**
- Role serializers
- Permission serializers
- Role management views
- API endpoints
- Django admin integration

✅ **Testing (Group F):**
- Role model tests
- Permission tests
- Decorator tests
- API endpoint tests
- >90% code coverage

✅ **Documentation (Group F):**
- Comprehensive RBAC docs
- API reference
- Usage guides
- Best practices
- Migration guides

### Integration Points
The RBAC system integrates with:
- **Tenant System:** All roles/permissions are tenant-scoped
- **User Model:** Extended with permission methods
- **API Framework:** DRF permission classes
- **Admin Interface:** Django admin for management
- **Cache System:** Permission caching for performance

### Testing Coverage
- **Unit Tests:** All models and methods
- **Integration Tests:** API endpoints
- **Permission Tests:** Decorators and classes
- **Edge Cases:** Hierarchy, inheritance, caching
- **Performance Tests:** Cache effectiveness

### Next Steps
Proceed to **SubPhase-06: Core Middleware Stack** which will include:
- Tenant middleware (subdomain/domain routing)
- Request logging middleware
- Performance monitoring
- Error handling middleware
- CORS configuration
- Security headers

---

## Final Notes for AI Agents

### Key Implementation Points
1. **Multi-tenancy:** Everything is tenant-scoped
2. **Hierarchy:** Child roles inherit parent permissions
3. **Caching:** Permissions are cached per user
4. **System Roles:** Protected from modification/deletion
5. **Testing:** Comprehensive test coverage required
6. **Documentation:** Keep docs updated with code changes

### Common Pitfalls to Avoid
- ❌ Forgetting tenant filtering in queries
- ❌ Not invalidating cache on permission changes
- ❌ Allowing system role modification
- ❌ Missing hierarchy validation
- ❌ Direct permission assignment to users
- ❌ Not testing edge cases

### Performance Considerations
- ✅ Use select_related() for role queries
- ✅ Use prefetch_related() for permissions
- ✅ Cache permission lookups
- ✅ Invalidate cache on updates
- ✅ Batch role assignments

### Security Checklist
- ✅ All queries filtered by tenant
- ✅ Hierarchy validated before assignment
- ✅ System roles protected
- ✅ Admin-only endpoints secured
- ✅ Permission checks on all sensitive operations
- ✅ Audit logging for role changes

---

**Document Status:** ✅ Complete  
**SubPhase Status:** ✅ Complete  
**Ready for:** SubPhase-06 - Core Middleware Stack
