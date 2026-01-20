# Group F: API Endpoints & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** F of F  
> **Tasks Covered:** 79-92  
> **Group Goal:** Create API endpoints for role management and comprehensive tests

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Permission-Decorators-Mixins](../Group-E_Permission-Decorators-Mixins/)
- **→ Next SubPhase:** [SubPhase-06_Core-Middleware-Stack](../../SubPhase-06_Core-Middleware-Stack/)

---

## Group Overview

This group creates the REST API endpoints for managing roles and viewing permissions. It also includes comprehensive tests for the entire role-permission system.

### Key Components
- **Serializers:** Role, Permission, UserRole serializers
- **API Views:** List, Detail, Create, Assign, Revoke
- **URL Routes:** /api/v1/roles/...
- **Admin Integration:** Django admin for roles
- **Test Suite:** Complete test coverage

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/roles/ | List all roles |
| GET | /api/v1/roles/{id}/ | Get role details |
| POST | /api/v1/roles/ | Create new role |
| POST | /api/v1/roles/assign/ | Assign role to user |
| POST | /api/v1/roles/revoke/ | Remove role from user |
| GET | /api/v1/me/permissions/ | Current user permissions |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Serializers | Tasks 79-80 | Role and Permission serializers |
| DOC-02 | API Views | Tasks 81-86 | Role management views |
| DOC-03 | URLs & Admin | Tasks 87-88 | API routes and admin config |
| DOC-04 | Test Suite | Tasks 89-92 | Comprehensive tests |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 79 | Create Role Serializers | Role API serializers |
| 80 | Create Permission Serializers | Permission serializers |
| 81 | Create RoleListView | List roles API |
| 82 | Create RoleDetailView | Role detail API |
| 83 | Create RoleCreateView | Create role API (tenant admin) |
| 84 | Create AssignRoleView | Assign role to user |
| 85 | Create RevokeRoleView | Remove role from user |
| 86 | Create MyPermissionsView | Current user permissions |
| 87 | Create Role URLs | Role API routes |
| 88 | Register in Admin | Admin for roles |
| 89 | Create Role Model Tests | Model unit tests |
| 90 | Create Permission Tests | Permission model tests |
| 91 | Create Decorator Tests | Decorator unit tests |
| 92 | Document Role System | Complete documentation |

---

## Execution Order

```
[Tasks 79-80: Serializers]
        │
        ▼
[Tasks 81-86: API Views]
        │
        ▼
[Tasks 87-88: URLs & Admin]
        │
        ▼
[Tasks 89-92: Tests & Docs]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/users/
├── serializers/
│   └── role_serializers.py
│       ├── class RoleSerializer
│       ├── class RoleDetailSerializer
│       ├── class PermissionSerializer
│       ├── class UserRoleSerializer
│       └── class AssignRoleSerializer
├── views/
│   └── role_views.py
│       ├── class RoleListView
│       ├── class RoleDetailView
│       ├── class RoleCreateView
│       ├── class AssignRoleView
│       ├── class RevokeRoleView
│       └── class MyPermissionsView
├── urls.py
│   └── urlpatterns = [
│       path('roles/', ...),
│       path('roles/<int:pk>/', ...),
│       path('roles/assign/', ...),
│       path('roles/revoke/', ...),
│       path('me/permissions/', ...),
│   ]
├── admin.py
│   ├── class RoleAdmin
│   ├── class PermissionAdmin
│   └── class UserRoleAdmin
└── tests/
    ├── test_roles.py
    ├── test_permissions.py
    └── test_decorators.py
```

### Serializers
```python
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'slug', 'description', 'hierarchy_level']

class RoleDetailSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Role
        fields = ['id', 'name', 'slug', 'description', 'hierarchy_level', 
                  'is_system_role', 'parent', 'permissions']

class AssignRoleSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    role_id = serializers.IntegerField()
    is_primary = serializers.BooleanField(default=False)
```

### API Views
```python
class RoleListView(generics.ListAPIView):
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated, IsTenantAdmin]
    
    def get_queryset(self):
        return Role.objects.filter(tenant=self.request.user.tenant)

class MyPermissionsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'roles': RoleSerializer(request.user.get_roles(), many=True).data,
            'permissions': list(request.user.get_all_permissions())
        })
```

### Test Coverage
```python
class RoleModelTests(TestCase):
    def test_role_creation(self): ...
    def test_role_hierarchy(self): ...
    def test_system_role_protection(self): ...

class PermissionTests(TestCase):
    def test_permission_assignment(self): ...
    def test_permission_inheritance(self): ...
    def test_permission_caching(self): ...

class DecoratorTests(TestCase):
    def test_permission_required(self): ...
    def test_role_required(self): ...
    def test_permission_denied(self): ...
```

---

## Notes for AI Agents

1. **Permission Classes:** Apply IsTenantAdmin for role management
2. **Tenant Filtering:** Filter roles by request.user.tenant
3. **System Roles:** Prevent deletion of is_system_role=True
4. **Hierarchy Validation:** Users can only assign lower-level roles
5. **Test Coverage:** Test all permission combinations
6. **Admin Inlines:** Use inlines for related models
7. **Serializer Nesting:** Include permissions in detail view
8. **API Documentation:** Add OpenAPI annotations
