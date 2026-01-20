# Group A: Role Model Foundation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create the Role model with hierarchical structure and tenant-scoping

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Permission-Model](../Group-B_Permission-Model/)

---

## Group Overview

This group establishes the foundation of the role-based access control (RBAC) system by creating the Role model. The model supports a hierarchical structure with 5 levels (Super Admin to Customer) and tenant-scoped roles.

### Key Components
- **Role Model:** Core role definition with hierarchy
- **RoleManager:** Custom manager for role operations
- **System Roles:** Non-deletable default roles
- **Data Migration:** Create default roles

### Role Hierarchy Levels
| Level | Role | Description |
|-------|------|-------------|
| 0 | Super Admin | Platform-wide access |
| 1 | Tenant Admin | Full tenant access |
| 2 | Manager | Department-level access |
| 3 | Staff | Basic CRUD operations |
| 4 | Customer | Webstore access only |

### Model Fields
- `name` - Role name (unique per tenant)
- `slug` - URL-safe identifier
- `description` - Role description
- `is_system_role` - Non-deletable flag
- `hierarchy_level` - Role level (0-4)
- `parent` - Parent role reference (ForeignKey)
- `tenant` - Tenant-scoped roles (ForeignKey)

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Role App Setup | Tasks 01-02 | Create roles app directory and model file |
| DOC-02 | Role Model Definition | Tasks 03-10 | Role model with all fields |
| DOC-03 | RoleManager & Meta | Tasks 11-12 | Custom manager and Meta class |
| DOC-04 | Default Roles Migration | Tasks 13-14 | Data migration and documentation |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 01 | Create Roles App Directory | mkdir apps/roles or add to users app |
| 02 | Create Role Model File | models.py for roles |
| 03 | Create Role Model Class | Role model definition |
| 04 | Add name Field | Role name (unique per tenant) |
| 05 | Add slug Field | URL-safe identifier |
| 06 | Add description Field | Role description |
| 07 | Add is_system_role Field | Non-deletable flag |
| 08 | Add hierarchy_level Field | Role level (0-4) |
| 09 | Add parent ForeignKey | Parent role reference (self) |
| 10 | Add tenant ForeignKey | Tenant-scoped roles |
| 11 | Create RoleManager | Custom manager for roles |
| 12 | Add Meta class | Unique together constraints |
| 13 | Create Default Roles Migration | System roles data migration |
| 14 | Document Role Model | Model documentation |

---

## Execution Order

```
[Task 01: Create Roles App Directory]
        │
        ▼
[Task 02: Create Role Model File]
        │
        ▼
[Tasks 03-10: Role Model Fields]
        │
        ▼
[Tasks 11-12: Manager & Meta]
        │
        ▼
[Tasks 13-14: Migration & Docs]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/users/  (or apps/roles/)
├── models/
│   └── role.py
│       ├── class Role(BaseModel):
│       │   ├── name: CharField
│       │   ├── slug: SlugField
│       │   ├── description: TextField
│       │   ├── is_system_role: BooleanField
│       │   ├── hierarchy_level: IntegerField
│       │   ├── parent: ForeignKey (self)
│       │   └── tenant: ForeignKey (Tenant)
│       └── class RoleManager(Manager)
└── migrations/
    └── XXXX_create_default_roles.py
```

### Default System Roles
```python
DEFAULT_ROLES = [
    {'name': 'Super Admin', 'slug': 'super-admin', 'level': 0},
    {'name': 'Tenant Admin', 'slug': 'tenant-admin', 'level': 1},
    {'name': 'Manager', 'slug': 'manager', 'level': 2},
    {'name': 'Staff', 'slug': 'staff', 'level': 3},
    {'name': 'Customer', 'slug': 'customer', 'level': 4},
]
```

---

## Notes for AI Agents

1. **Hierarchy Design:** Super Admin (level 0) has all permissions
2. **Tenant Scoping:** Roles except Super Admin are tenant-scoped
3. **System Roles:** is_system_role=True cannot be deleted
4. **Unique Constraint:** unique_together = ['name', 'tenant']
5. **Parent Relationship:** Used for permission inheritance
6. **Slug Generation:** Auto-generate from name using slugify
7. **Self-Referential FK:** parent points to same Role model
