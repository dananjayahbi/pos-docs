# Group C: Auth State Store

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** C of F  
> **Tasks Covered:** 31-44  
> **Group Goal:** Create Zustand store for authentication state with user, tenant, and permissions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_UI-State-Stores](../Group-B_UI-State-Stores/)
- **→ Next Group:** [Group-D_TanStack-Query-Setup](../Group-D_TanStack-Query-Setup/)

---

## Group Overview

This group creates the authentication state store. Creates store/authStore.ts with user object (profile data), tenant object (subscription info), and permissions array (RBAC). Adds auth status states (isAuthenticated, isLoading). Creates actions: setUser, setTenant, setPermissions, composite login action, and logout action (clears state and tokens). Creates selectors: hasPermission for checking specific permissions and canAccess for route/feature access. Configures persistence for auth state and creates useAuth convenience hook.

### Key Outcomes

- authStore.ts created
- User state defined
- Tenant state defined
- Permissions array state
- isAuthenticated state
- isLoading state
- setUser action
- setTenant action
- setPermissions action
- login composite action
- logout action (clears all)
- hasPermission selector
- canAccess selector
- Auth state persisted
- useAuth hook created

### Technology Context

- **Store:** Zustand with persist
- **RBAC:** Permission-based access
- **Multi-Tenant:** Tenant context in store
- **Persistence:** Secure auth state storage

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-40_Auth-Store-Actions.md` | Create auth store with state and actions | 31-40 |
| 02 | `02_Tasks-41-44_Selectors-Persistence-Hook.md` | Create selectors, persistence, and useAuth hook | 41-44 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create Auth Store | Low | Task 14 |
| 32 | Define User State | Low | Task 31 |
| 33 | Define Tenant State | Low | Task 31 |
| 34 | Define Permissions State | Low | Task 31 |
| 35 | Define Auth Status State | Low | Task 31 |
| 36 | Create setUser Action | Low | Task 32 |
| 37 | Create setTenant Action | Low | Task 33 |
| 38 | Create setPermissions Action | Low | Task 34 |
| 39 | Create login Action | Medium | Tasks 36-38 |
| 40 | Create logout Action | Low | Task 31 |
| 41 | Create hasPermission Selector | Low | Task 34 |
| 42 | Create canAccess Selector | Low | Task 41 |
| 43 | Persist Auth Store | Low | Task 31 |
| 44 | Create useAuth Hook | Low | Task 43 |

---

## Execution Order

```
Task 31: Create Auth Store
    │
    ├──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼
Task 32    Task 33    Task 34    Task 35
(user)     (tenant)   (perms)    (status)
    │          │          │          │
    ▼          ▼          ▼          │
Task 36    Task 37    Task 38       │
(setUser)  (setTenant)(setPerms)    │
    │          │          │          │
    └──────────┴──────────┘          │
               │                     │
               ▼                     │
          Task 39: login             │
               │                     │
               ▼                     │
          Task 40: logout ←──────────┘
               │
               ▼
          Task 41: hasPermission
               │
               ▼
          Task 42: canAccess
               │
               ▼
          Task 43: Persist
               │
               ▼
          Task 44: useAuth Hook
```

---

## Expected Deliverables

```
frontend/
├── store/
│   └── authStore.ts
└── hooks/
    └── useAuth.ts
```

---

## Notes for AI Agents

### User State (Task 32)
| Property | Type | Description |
|----------|------|-------------|
| id | string | User ID |
| email | string | Email address |
| firstName | string | First name |
| lastName | string | Last name |
| role | string | User role |
| avatar | string? | Avatar URL |

### Tenant State (Task 33)
| Property | Type | Description |
|----------|------|-------------|
| id | string | Tenant ID |
| name | string | Business name |
| slug | string | URL slug |
| plan | string | Subscription plan |
| settings | object | Tenant settings |

### Permissions Array (Task 34)
- Array of permission strings
- Format: "module:action" (e.g., "products:create")
- Loaded from user's role

### Auth Status (Task 35)
| Property | Type | Default |
|----------|------|---------|
| isAuthenticated | boolean | false |
| isLoading | boolean | true |

### Login Action Flow (Task 39)
1. Set isLoading = true
2. Call setUser with user data
3. Call setTenant with tenant data
4. Call setPermissions with permissions
5. Set isAuthenticated = true
6. Set isLoading = false

### Logout Action Flow (Task 40)
1. Clear user, tenant, permissions
2. Set isAuthenticated = false
3. Call clearTokens from tokenStorage
4. Reset other stores

### hasPermission Selector (Task 41)
| Param | Type | Description |
|-------|------|-------------|
| permission | string | Permission to check |
| Returns | boolean | Has permission |

### canAccess Selector (Task 42)
| Param | Type | Description |
|-------|------|-------------|
| requiredPermissions | string[] | Required perms |
| mode | 'all' or 'any' | Match mode |
| Returns | boolean | Can access |

### useAuth Hook (Task 44)
| Return | Type | Description |
|--------|------|-------------|
| user | User or null | Current user |
| tenant | Tenant or null | Current tenant |
| isAuthenticated | boolean | Auth status |
| hasPermission | fn | Permission check |
| canAccess | fn | Access check |
| login | fn | Login action |
| logout | fn | Logout action |
