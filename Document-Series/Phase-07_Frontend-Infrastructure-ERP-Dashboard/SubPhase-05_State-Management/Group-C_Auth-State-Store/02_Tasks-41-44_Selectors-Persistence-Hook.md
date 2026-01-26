# Tasks 41-44: Selectors, Persistence, and Hook

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** C - Auth State Store  
> **Document:** 02 of 02  
> **Tasks Covered:** 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-40_Auth-Store-Actions.md](01_Tasks-31-40_Auth-Store-Actions.md)

---

## Document Overview

This document completes the authentication state store by implementing permission checking selectors, configuring state persistence to localStorage, and creating a convenience hook for component usage. These features make the auth store practical and easy to use throughout the application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Create hasPermission Selector | Low | 15 min |
| 42 | Create canAccess Selector | Low | 20 min |
| 43 | Persist Auth Store | Low | 15 min |
| 44 | Create useAuth Hook | Low | 15 min |

---

## Task 41: Create hasPermission Selector

### Overview
Create the hasPermission selector that checks if the current user has a specific permission. This is a fundamental function for implementing role-based access control throughout the application. Components use this to show/hide features, enable/disable actions, and control access to functionality.

### Dependencies
- Task 34: Define Permissions State
- Task 38: Create setPermissions Action

### Instructions

1. **Define hasPermission method in store**
   - Method name: `hasPermission`
   - Parameter: `permission: string`
   - Return type: `boolean`
   - Add to AuthStore interface

2. **Implement permission checking logic**
   - Access current permissions array from state
   - Check if permission exists in array
   - Return boolean result

3. **Handle wildcard permissions**
   - Check for exact permission match first
   - Check for module wildcard (e.g., `"products:*"`)
   - Check for superuser permission (`"*:*"`)
   - Return true if any match found

4. **Handle edge cases**
   - Empty permissions array returns false
   - Null/undefined permission parameter returns false
   - Case-sensitive comparison
   - Unauthenticated user returns false

5. **Optimize for performance**
   - Use array.includes() for simple check
   - Consider Set for large permission arrays
   - Cache result if permission checks are frequent

### hasPermission Selector Signature

```
Method Signature:
hasPermission: (permission: string) => boolean

Parameters:
- permission: Permission string to check (e.g., "products:create")

Returns: boolean (true if user has permission)
```

### Permission Checking Logic

```
Permission Check Algorithm:

1. Receive permission to check (e.g., "products:create")
    │
    ▼
2. Get current permissions array from state
    │
    ▼
3. Check for exact match
    │ permissions.includes("products:create")
    │
    ├─── Found ───> Return true
    │
    ▼
4. Check for module wildcard
    │ permissions.includes("products:*")
    │
    ├─── Found ───> Return true
    │
    ▼
5. Check for superuser
    │ permissions.includes("*:*")
    │
    ├─── Found ───> Return true
    │
    ▼
6. No match found
    │
    └─── Return false
```

### Wildcard Permission Handling

| Permission Type | Example | Matches |
|----------------|---------|---------|
| Specific | `products:create` | Exact: `products:create` |
| Module Wildcard | `products:*` | Any: `products:create`, `products:read`, `products:update` |
| Superuser | `*:*` | All permissions |

### Implementation Pattern

```
hasPermission Implementation:

function hasPermission(permission: string): boolean {
  // Get state
  const { permissions, isAuthenticated } = get()
  
  // Must be authenticated
  if (!isAuthenticated || !permissions) {
    return false
  }
  
  // Check exact match
  if (permissions.includes(permission)) {
    return true
  }
  
  // Check module wildcard
  const [module] = permission.split(':')
  if (permissions.includes(`${module}:*`)) {
    return true
  }
  
  // Check superuser
  if (permissions.includes('*:*')) {
    return true
  }
  
  return false
}
```

### Permission Check Examples

| User Permissions | Check | Result | Reason |
|-----------------|-------|--------|--------|
| `["products:create"]` | `products:create` | true | Exact match |
| `["products:*"]` | `products:create` | true | Module wildcard |
| `["*:*"]` | `products:create` | true | Superuser |
| `["products:read"]` | `products:create` | false | No match |
| `[]` | `products:create` | false | Empty permissions |

### Usage in Components

```
Component Usage Examples:

// Button visibility
{hasPermission('products:create') && (
  <CreateButton />
)}

// Feature access
if (authStore.hasPermission('invoices:approve')) {
  showApprovalButton()
}

// Conditional rendering
const canEdit = hasPermission('users:update')
return canEdit ? <EditForm /> : <ViewOnly />

// Multiple permissions
const canManageProducts = 
  hasPermission('products:create') &&
  hasPermission('products:update')
```

### Integration Points

| Integration | Usage |
|-------------|-------|
| UI Components | Show/hide elements |
| Button States | Enable/disable actions |
| Route Guards | Protect routes |
| Menu Items | Filter navigation |
| Forms | Show/hide fields |
| API Calls | Check before request |

### Performance Optimization

```
Performance Strategies:

1. Array Includes (Default):
   - Simple and fast for small arrays
   - O(n) complexity
   - Good for <100 permissions

2. Set Conversion:
   - Convert permissions to Set
   - O(1) lookup complexity
   - Better for >100 permissions
   
   const permSet = new Set(permissions)
   return permSet.has(permission)

3. Memoization:
   - Cache permission checks
   - Clear on permissions change
   - Useful for repeated checks
```

### Error Handling

| Scenario | Handling |
|----------|----------|
| Null permission | Return false |
| Empty string | Return false |
| Invalid format | Return false (or validate) |
| Not authenticated | Return false |
| No permissions loaded | Return false |

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Frontend Only | Not a security boundary |
| Backend Validation | Always validate on server |
| Consistency | Match backend permission logic |
| No Bypass | Cannot be circumvented easily |
| Defense in Depth | One layer of access control |

### Expected Outcome
- hasPermission selector defined in store
- Checks permissions array for match
- Handles wildcard permissions
- Returns boolean result
- Optimized for performance
- Ready for component usage

### Verification Checklist
- [ ] hasPermission method added to store
- [ ] Parameter type is `string`
- [ ] Returns `boolean`
- [ ] Checks exact permission match
- [ ] Handles module wildcard (`*`)
- [ ] Handles superuser (`*:*`)
- [ ] Returns false for unauthenticated
- [ ] Performance optimized

---

## Task 42: Create canAccess Selector

### Overview
Create the canAccess selector that checks if the user has access based on multiple permission requirements. This is a more sophisticated selector that supports "all" (AND) or "any" (OR) matching modes. It's used for route guards, feature gates, and complex access control scenarios.

### Dependencies
- Task 41: Create hasPermission Selector

### Instructions

1. **Define canAccess method in store**
   - Method name: `canAccess`
   - Parameters: `requiredPermissions: string[], mode?: 'all' | 'any'`
   - Return type: `boolean`
   - Add to AuthStore interface

2. **Set default matching mode**
   - Default mode: `'all'` (AND logic)
   - User must have all required permissions
   - More restrictive by default

3. **Implement 'all' mode**
   - Check each required permission
   - All must be present
   - Uses hasPermission for each check
   - Returns true only if all pass

4. **Implement 'any' mode**
   - Check each required permission
   - At least one must be present
   - Uses hasPermission for each check
   - Returns true if any pass

5. **Handle edge cases**
   - Empty requirements array returns true
   - Null/undefined requirements returns false
   - Invalid mode defaults to 'all'
   - Unauthenticated user returns false

6. **Leverage hasPermission selector**
   - Use hasPermission for individual checks
   - Inherits wildcard support
   - Consistent permission checking logic

### canAccess Selector Signature

```
Method Signature:
canAccess: (
  requiredPermissions: string[], 
  mode?: 'all' | 'any'
) => boolean

Parameters:
- requiredPermissions: Array of required permissions
- mode: Match mode ('all' or 'any'), default 'all'

Returns: boolean (true if access granted)
```

### Access Check Logic

```
canAccess Algorithm:

1. Receive requiredPermissions and mode
    │
    ▼
2. Validate inputs
    │ Check array not empty
    │ Check user authenticated
    │
    ▼
3. Determine mode (default: 'all')
    │
    ├─── Mode: 'all' ───┐
    │                   │
    │                   ▼
    │          Check ALL permissions
    │          For each permission:
    │            Call hasPermission()
    │          Return true if ALL true
    │          Return false if ANY false
    │
    └─── Mode: 'any' ───┐
                        │
                        ▼
               Check ANY permission
               For each permission:
                 Call hasPermission()
               Return true if ANY true
               Return false if ALL false
```

### Mode Comparison

| Mode | Logic | Description | Use Case |
|------|-------|-------------|----------|
| 'all' | AND | User must have all permissions | Restrictive access (edit AND delete) |
| 'any' | OR | User must have at least one | Flexible access (view OR edit) |

### Implementation Pattern

```
canAccess Implementation:

function canAccess(
  requiredPermissions: string[], 
  mode: 'all' | 'any' = 'all'
): boolean {
  // Validate inputs
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true  // No requirements = access granted
  }
  
  if (!get().isAuthenticated) {
    return false
  }
  
  // Mode: 'all' - requires ALL permissions
  if (mode === 'all') {
    return requiredPermissions.every(
      permission => hasPermission(permission)
    )
  }
  
  // Mode: 'any' - requires ANY permission
  if (mode === 'any') {
    return requiredPermissions.some(
      permission => hasPermission(permission)
    )
  }
  
  return false
}
```

### Access Check Examples

| User Permissions | Required | Mode | Result | Reason |
|-----------------|----------|------|--------|--------|
| `["products:read", "products:create"]` | `["products:read", "products:create"]` | all | true | Has all |
| `["products:read"]` | `["products:read", "products:create"]` | all | false | Missing create |
| `["products:read"]` | `["products:read", "products:create"]` | any | true | Has read |
| `["inventory:read"]` | `["products:read", "products:create"]` | any | false | Has neither |
| `["*:*"]` | `["products:read", "sales:create"]` | all | true | Superuser |

### Usage Scenarios

```
canAccess Usage Examples:

// Route guard - user needs view OR edit
const canAccessProducts = canAccess(
  ['products:read', 'products:update'],
  'any'
)

// Feature gate - user needs create AND delete
const canManageUsers = canAccess(
  ['users:create', 'users:delete'],
  'all'
)

// Admin section - needs multiple admin permissions
const canAccessAdmin = canAccess([
  'settings:update',
  'users:manage',
  'system:configure'
], 'all')

// Dashboard widget - show if has any data permission
const canViewDashboard = canAccess([
  'products:read',
  'sales:read',
  'reports:read'
], 'any')
```

### Route Guard Integration

```
Route Guard Pattern:

// In route configuration
{
  path: '/products',
  component: ProductsPage,
  beforeEnter: (to, from, next) => {
    if (authStore.canAccess(['products:read'], 'any')) {
      next()
    } else {
      next('/unauthorized')
    }
  }
}

// In route guard hook
function useRouteGuard(permissions: string[], mode: 'all' | 'any') {
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!canAccess(permissions, mode)) {
      navigate('/unauthorized')
    }
  }, [permissions, mode])
}
```

### Complex Access Patterns

| Pattern | Implementation |
|---------|----------------|
| Multi-level Access | Combine multiple canAccess calls |
| Role-based Sections | Group permissions by role |
| Feature Flags | Combine with feature toggle checks |
| Time-based Access | Add temporal logic on top |
| Resource-specific | Add resource ID checks |

### Component Integration

```
Component Usage:

// Conditional rendering
function ProductManager() {
  const canManage = authStore.canAccess([
    'products:create',
    'products:update',
    'products:delete'
  ], 'all')
  
  if (!canManage) {
    return <Unauthorized />
  }
  
  return <ProductManagementUI />
}

// Feature sections
function Dashboard() {
  const canViewSales = authStore.canAccess(['sales:read'], 'any')
  const canViewReports = authStore.canAccess(['reports:read'], 'any')
  
  return (
    <>
      {canViewSales && <SalesWidget />}
      {canViewReports && <ReportsWidget />}
    </>
  )
}
```

### Performance Considerations

| Consideration | Strategy |
|---------------|----------|
| Array Operations | Use every/some for clarity |
| Repeated Checks | Cache results if checks are frequent |
| Large Permission Sets | Optimize hasPermission first |
| Re-renders | Memoize results in components |

### Edge Case Handling

| Edge Case | Behavior |
|-----------|----------|
| Empty array | Return true (no requirements) |
| Null array | Return false |
| Invalid mode | Default to 'all' |
| Not authenticated | Return false |
| Duplicate permissions | Check each once |

### Expected Outcome
- canAccess selector defined in store
- Supports 'all' and 'any' modes
- Uses hasPermission for checks
- Returns boolean result
- Handles edge cases gracefully
- Ready for route guards and feature gates

### Verification Checklist
- [ ] canAccess method added to store
- [ ] Parameters: `string[]` and optional mode
- [ ] Returns `boolean`
- [ ] Implements 'all' mode (AND logic)
- [ ] Implements 'any' mode (OR logic)
- [ ] Default mode is 'all'
- [ ] Uses hasPermission internally
- [ ] Handles empty array
- [ ] Handles unauthenticated state

---

## Task 43: Persist Auth Store

### Overview
Configure state persistence for the auth store using Zustand's persist middleware. This ensures that authentication state is saved to localStorage and restored when the user returns to the application, maintaining login sessions across page refreshes and browser restarts.

### Dependencies
- Task 31: Create Auth Store
- All state and action definitions (Tasks 32-40)

### Instructions

1. **Import persist middleware**
   - Import from `zustand/middleware`
   - Verify TypeScript types included

2. **Wrap store with persist middleware**
   - Apply persist to create function
   - Configure persistence options
   - Maintain type safety

3. **Configure storage name**
   - Name: `'auth-store'` or similar
   - Used as localStorage key
   - Should be unique and descriptive

4. **Specify persisted state**
   - Include: user, tenant, permissions, isAuthenticated
   - Exclude: isLoading (derived on each load)
   - Use partialize option for selective persistence

5. **Configure storage type**
   - Default: localStorage (persistent across sessions)
   - Alternative: sessionStorage (cleared on browser close)
   - Consider security implications

6. **Add version for migrations**
   - Set version number for schema versioning
   - Enables future state migrations
   - Invalidates old state structures

7. **Implement state migration (optional)**
   - Handle changes to state structure
   - Migrate old persisted states
   - Prevent errors from schema changes

8. **Add serialization (optional)**
   - Custom serialize/deserialize functions
   - Handle Date objects, Sets, Maps
   - Transform data for storage

9. **Handle rehydration**
   - State automatically restored on load
   - May set isLoading during rehydration
   - Validate restored state

10. **Consider security**
    - Sensitive data in localStorage
    - Consider encryption for sensitive fields
    - Set appropriate expiration
    - Clear on logout

### Persist Configuration Structure

```
Persist Middleware Setup:

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State and actions here
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated
        // isLoading excluded
      }),
      version: 1
    }
  )
)
```

### Persisted vs Non-Persisted State

| State Property | Persist? | Reason |
|---------------|----------|--------|
| user | Yes | Restore user data |
| tenant | Yes | Maintain tenant context |
| permissions | Yes | Keep access rights |
| isAuthenticated | Yes | Maintain auth status |
| isLoading | No | Recalculated on load |

### localStorage Structure

```
localStorage Layout:

Key: 'auth-store'
Value: {
  state: {
    user: { id, email, firstName, lastName, role, avatar },
    tenant: { id, name, slug, plan, settings },
    permissions: ["products:read", "sales:create", ...],
    isAuthenticated: true
  },
  version: 1
}
```

### Partialize Option

```
Partialize Configuration:

// Include only specific fields
partialize: (state) => ({
  user: state.user,
  tenant: state.tenant,
  permissions: state.permissions,
  isAuthenticated: state.isAuthenticated
})

// Exclude specific fields
partialize: (state) => {
  const { isLoading, ...persisted } = state
  return persisted
}
```

### Version and Migration

```
State Migration Example:

// Version 1: Initial structure
{
  user: { id, email, name },
  isAuthenticated: boolean
}

// Version 2: Split name field
{
  user: { id, email, firstName, lastName },
  isAuthenticated: boolean
}

// Migration function
migrate: (persistedState: any, version: number) => {
  if (version === 1) {
    // Migrate from v1 to v2
    const [firstName, lastName] = persistedState.user.name.split(' ')
    return {
      ...persistedState,
      user: {
        ...persistedState.user,
        firstName,
        lastName
      }
    }
  }
  return persistedState
}
```

### Security Considerations

| Aspect | Consideration |
|--------|---------------|
| Sensitive Data | Avoid storing tokens directly |
| Encryption | Consider encrypting sensitive fields |
| Expiration | Add timestamp for auto-logout |
| XSS Protection | Sanitize stored data |
| Clear on Logout | Remove all auth data |

### Storage Options

| Storage Type | Persistence | Security | Use Case |
|-------------|-------------|----------|----------|
| localStorage | Permanent | Lower | Remember login |
| sessionStorage | Session only | Higher | Temporary login |
| Cookie | Configurable | Varies | Server interaction |
| IndexedDB | Permanent | Lower | Large data |

### Rehydration Flow

```
Rehydration Process:

1. App Starts
    │
    ▼
2. Persist middleware checks localStorage
    │
    ├─── Data Found ───┐
    │                  │
    │                  ▼
    │          Parse JSON data
    │                  │
    │                  ▼
    │          Validate structure
    │                  │
    │                  ▼
    │          Check version
    │                  │
    │                  ▼
    │          Run migrations if needed
    │                  │
    │                  ▼
    │          Restore state
    │                  │
    │                  ▼
    │          Set isAuthenticated: true
    │                  │
    │                  ▼
    │          Validate tokens (optional)
    │                  │
    │                  ├─── Valid ───> Set isLoading: false
    │                  │
    │                  └─── Invalid ─> Call logout()
    │
    └─── No Data ──────┐
                       │
                       ▼
               Initialize empty state
                       │
                       ▼
               Set isLoading: false
                       │
                       ▼
               Show login page
```

### Error Handling

| Error | Handling |
|-------|----------|
| Parse Error | Clear storage, start fresh |
| Version Mismatch | Run migration or reset |
| Invalid Data | Validate and filter |
| Storage Full | Clear old data |
| Access Denied | Fallback to memory |

### Testing Persistence

```
Testing Scenarios:

1. Save and Restore:
   - Login
   - Refresh page
   - Verify state restored

2. Logout Clears:
   - Login
   - Logout
   - Verify localStorage cleared

3. Expiration:
   - Login
   - Wait past expiration
   - Verify auto-logout

4. Invalid Data:
   - Manually corrupt localStorage
   - Refresh
   - Verify graceful handling

5. Version Migration:
   - Set old version data
   - Refresh
   - Verify migration applied
```

### Expected Outcome
- Auth store wrapped with persist middleware
- State saved to localStorage
- State restored on app load
- isLoading excluded from persistence
- Version set for future migrations
- Clear security strategy

### Verification Checklist
- [ ] persist middleware imported
- [ ] Store wrapped with persist
- [ ] Storage name configured
- [ ] partialize configured
- [ ] isLoading excluded
- [ ] Version set
- [ ] localStorage updated on state change
- [ ] State restored on refresh
- [ ] Logout clears storage
- [ ] Security considered

---

## Task 44: Create useAuth Hook

### Overview
Create a convenience hook that provides easy access to auth state and actions from any component. This hook wraps the auth store and exposes commonly used properties and methods, making it simple for components to interact with authentication state.

### Dependencies
- Task 43: Persist Auth Store (all auth store functionality complete)

### Instructions

1. **Create useAuth.ts file**
   - Location: `frontend/hooks/useAuth.ts`
   - Export custom hook function

2. **Import auth store**
   - Import the auth store
   - Access store's hook

3. **Define useAuth hook function**
   - Hook name: `useAuth`
   - No parameters
   - Returns object with auth state and methods

4. **Expose user state**
   - Return `user` from store
   - Type: `User | null`

5. **Expose tenant state**
   - Return `tenant` from store
   - Type: `Tenant | null`

6. **Expose permissions state**
   - Return `permissions` from store
   - Type: `string[]`

7. **Expose auth status**
   - Return `isAuthenticated` from store
   - Return `isLoading` from store

8. **Expose permission selectors**
   - Return `hasPermission` function
   - Return `canAccess` function

9. **Expose auth actions**
   - Return `login` function
   - Return `logout` function
   - Return `setUser`, `setTenant`, `setPermissions` if needed

10. **Add TypeScript types**
    - Define return type interface
    - Ensure type safety
    - Export types

### useAuth Hook Signature

```
Hook Signature:

function useAuth(): UseAuthReturn

Returns: {
  // State
  user: User | null
  tenant: Tenant | null
  permissions: string[]
  isAuthenticated: boolean
  isLoading: boolean
  
  // Selectors
  hasPermission: (permission: string) => boolean
  canAccess: (permissions: string[], mode?: 'all' | 'any') => boolean
  
  // Actions
  login: (user: User, tenant: Tenant, permissions: string[]) => void
  logout: () => void
}
```

### Implementation Pattern

```
useAuth Implementation:

import { authStore } from '@/store/authStore'

export function useAuth() {
  // Subscribe to store
  const user = authStore(state => state.user)
  const tenant = authStore(state => state.tenant)
  const permissions = authStore(state => state.permissions)
  const isAuthenticated = authStore(state => state.isAuthenticated)
  const isLoading = authStore(state => state.isLoading)
  
  // Get selectors
  const hasPermission = authStore(state => state.hasPermission)
  const canAccess = authStore(state => state.canAccess)
  
  // Get actions
  const login = authStore(state => state.login)
  const logout = authStore(state => state.logout)
  
  return {
    user,
    tenant,
    permissions,
    isAuthenticated,
    isLoading,
    hasPermission,
    canAccess,
    login,
    logout
  }
}
```

### Return Type Definition

```
TypeScript Interface:

export interface UseAuthReturn {
  // State
  user: User | null
  tenant: Tenant | null
  permissions: string[]
  isAuthenticated: boolean
  isLoading: boolean
  
  // Selectors
  hasPermission: (permission: string) => boolean
  canAccess: (
    permissions: string[], 
    mode?: 'all' | 'any'
  ) => boolean
  
  // Actions
  login: (
    user: User, 
    tenant: Tenant, 
    permissions: string[]
  ) => void
  logout: () => void
}
```

### Hook Usage Examples

```
Component Usage:

// Basic usage
function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginButton />
  }
  
  return (
    <div>
      <span>Welcome, {user?.firstName}</span>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

// Permission checking
function ProductActions() {
  const { hasPermission } = useAuth()
  
  return (
    <div>
      {hasPermission('products:create') && <CreateButton />}
      {hasPermission('products:update') && <EditButton />}
      {hasPermission('products:delete') && <DeleteButton />}
    </div>
  )
}

// Loading state
function App() {
  const { isLoading, isAuthenticated } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  return isAuthenticated ? <Dashboard /> : <LoginPage />
}

// Tenant context
function TenantInfo() {
  const { tenant } = useAuth()
  
  return (
    <div>
      <h1>{tenant?.name}</h1>
      <p>Plan: {tenant?.plan}</p>
    </div>
  )
}

// Complex access check
function AdminPanel() {
  const { canAccess } = useAuth()
  
  const hasAccess = canAccess([
    'settings:update',
    'users:manage',
    'system:configure'
  ], 'all')
  
  if (!hasAccess) {
    return <Unauthorized />
  }
  
  return <AdminInterface />
}
```

### Selective Subscription

```
Optimize Re-renders:

// Subscribe only to needed state
function UserDisplay() {
  // Only re-renders when user changes
  const user = authStore(state => state.user)
  
  return <span>{user?.firstName}</span>
}

// Subscribe to multiple properties
function AuthStatus() {
  const { isAuthenticated, isLoading } = authStore(
    state => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading
    })
  )
  
  return <StatusIndicator {...{ isAuthenticated, isLoading }} />
}
```

### Hook Benefits

| Benefit | Description |
|---------|-------------|
| Convenience | Single import for all auth needs |
| Consistency | Standardized access pattern |
| Type Safety | Full TypeScript support |
| Tree-Shaking | Import only what's needed |
| Readability | Clear, semantic API |
| Testability | Easy to mock in tests |

### Component Integration Patterns

| Pattern | Use Case |
|---------|----------|
| Header | Display user info, logout button |
| Login Form | Call login action on submit |
| Route Guards | Check isAuthenticated before render |
| Protected Routes | Use canAccess for authorization |
| Feature Flags | Check hasPermission for features |
| Tenant Display | Show tenant name and branding |

### Testing the Hook

```
Hook Testing:

// Mock hook for testing
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com', ... },
    tenant: { id: '1', name: 'Test Co', ... },
    permissions: ['products:read'],
    isAuthenticated: true,
    isLoading: false,
    hasPermission: jest.fn(),
    canAccess: jest.fn(),
    login: jest.fn(),
    logout: jest.fn()
  })
}))

// Test component using hook
function TestComponent() {
  const { user } = useAuth()
  return <div>{user?.email}</div>
}

test('displays user email', () => {
  render(<TestComponent />)
  expect(screen.getByText('test@example.com')).toBeInTheDocument()
})
```

### Performance Considerations

| Consideration | Strategy |
|---------------|----------|
| Re-renders | Subscribe to specific state slices |
| Selector Stability | Selectors don't cause re-renders |
| Action Stability | Actions are stable references |
| Derived State | Compute in component, not hook |

### Documentation

```
Hook Documentation:

/**
 * Custom hook for accessing authentication state and actions.
 * 
 * @returns {UseAuthReturn} Auth state and actions
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, hasPermission, logout } = useAuth()
 *   
 *   if (!user) return <LoginPrompt />
 *   
 *   return (
 *     <div>
 *       <h1>Welcome {user.firstName}</h1>
 *       {hasPermission('products:create') && <CreateButton />}
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  // Implementation
}
```

### Expected Outcome
- useAuth hook created in hooks directory
- Exposes all auth state and actions
- Type-safe with full TypeScript support
- Easy to use in any component
- Optimized for performance
- Well documented

### Verification Checklist
- [ ] `frontend/hooks/useAuth.ts` file created
- [ ] Hook exports all auth state
- [ ] Hook exports selectors
- [ ] Hook exports actions
- [ ] Return type defined
- [ ] TypeScript types correct
- [ ] Can be used in components
- [ ] Selective subscription works
- [ ] Documentation added

---

## Document Summary

This document completed the authentication state store with advanced features:

### Selectors Implemented
- hasPermission: Check specific permissions
- canAccess: Check multiple permissions with AND/OR logic

### Persistence Configured
- State saved to localStorage
- Automatic rehydration on load
- Selective persistence (exclude isLoading)
- Version management for migrations

### Hook Created
- useAuth: Convenient component access
- Exposes all state, selectors, and actions
- Type-safe and optimized

### Complete Feature Set
- Full authentication state management
- Permission checking system
- Persistent sessions
- Easy component integration
- Production-ready implementation

---

## Group C Complete

The Auth State Store is now fully implemented with:

### Core Features
✓ User state management  
✓ Tenant context management  
✓ RBAC permissions system  
✓ Authentication status tracking  
✓ State persistence  
✓ Permission checking selectors  
✓ Convenient component hook  

### Integration Points
- Login components use login action
- Protected routes use canAccess selector
- UI components use hasPermission
- Header uses user and tenant state
- Logout button uses logout action

### Next Steps
Proceed to [Group-D_TanStack-Query-Setup](../Group-D_TanStack-Query-Setup/) to implement:
- API query configuration
- Query client setup
- Authentication integration with queries
- Query hooks for API calls

---

## Cross-References

### Related Documents
- [SubPhase-04_Authentication-System](../../SubPhase-04_Authentication-System/) - Backend integration
- [SubPhase-06_Authentication-UI](../../SubPhase-06_Authentication-UI/) - Login UI
- [Group-A_Store-Setup](../Group-A_Store-Setup/) - Zustand configuration
- [Group-D_TanStack-Query-Setup](../Group-D_TanStack-Query-Setup/) - API queries

### Related Tasks
- Task 14: Configure Zustand (prerequisite)
- Task 31-40: Auth store foundation (previous document)
- Task 45+: API query hooks (next group)

### Usage Examples
- Components import useAuth hook
- Route guards use canAccess
- Feature flags use hasPermission
- API calls include auth context

---

## Implementation Checklist

- [ ] hasPermission selector implemented
- [ ] Wildcard permission handling working
- [ ] canAccess selector implemented
- [ ] 'all' and 'any' modes functional
- [ ] Persist middleware configured
- [ ] localStorage persistence working
- [ ] State rehydration tested
- [ ] useAuth hook created
- [ ] Hook exports all needed items
- [ ] Components can use hook successfully
- [ ] Permission checks work in UI
- [ ] Login/logout flow complete
- [ ] Documentation complete

---

*Document Version: 1.0*  
*Last Updated: 2026-01-25*
