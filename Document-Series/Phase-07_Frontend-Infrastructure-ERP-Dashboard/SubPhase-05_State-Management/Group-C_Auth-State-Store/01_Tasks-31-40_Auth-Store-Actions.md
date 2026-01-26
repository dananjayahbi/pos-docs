# Tasks 31-40: Auth Store and Actions

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** C - Auth State Store  
> **Document:** 01 of 02  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-44_Selectors-Persistence-Hook.md](02_Tasks-41-44_Selectors-Persistence-Hook.md)

---

## Document Overview

This document covers the creation of the authentication state store using Zustand, including all core state definitions (user, tenant, permissions, auth status) and their associated actions. This establishes the foundation for managing authentication, multi-tenancy, and role-based access control in the frontend application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Create Auth Store | Low | 15 min |
| 32 | Define User State | Low | 10 min |
| 33 | Define Tenant State | Low | 10 min |
| 34 | Define Permissions State | Low | 10 min |
| 35 | Define Auth Status State | Low | 10 min |
| 36 | Create setUser Action | Low | 10 min |
| 37 | Create setTenant Action | Low | 10 min |
| 38 | Create setPermissions Action | Low | 10 min |
| 39 | Create login Action | Medium | 20 min |
| 40 | Create logout Action | Low | 15 min |

---

## Task 31: Create Auth Store

### Overview
Create the authentication store file using Zustand. This store will be the central state management solution for all authentication-related data including user information, tenant context, permissions, and authentication status. This is the foundation for the entire auth state management system.

### Dependencies
- Task 14: Configure Zustand must be completed
- Zustand library installed and configured
- TypeScript types for state management defined

### Instructions

1. **Create authStore.ts file**
   - Navigate to `frontend/store/` directory
   - Create new file named `authStore.ts`
   - This will be the main authentication state store

2. **Import Zustand dependencies**
   - Import `create` from `zustand`
   - Import `persist` middleware from `zustand/middleware`
   - Import type definitions for type safety

3. **Define AuthStore interface**
   - Create TypeScript interface for the complete store shape
   - Include all state properties (user, tenant, permissions, status)
   - Include all action method signatures
   - Include all selector method signatures

4. **Initialize store with create function**
   - Use Zustand's `create` function
   - Apply TypeScript generic with AuthStore interface
   - Set up proper typing for state and actions

5. **Prepare for state definitions**
   - Structure store to accept state slices
   - Plan for user, tenant, permissions, and status states
   - Ensure clean separation of concerns

6. **Set up initial empty state**
   - All object states should be null initially
   - Arrays should be empty
   - Booleans should have proper defaults

### Store Structure

```
authStore.ts Structure:
├── Imports (zustand, types)
├── Type Definitions
│   ├── User interface
│   ├── Tenant interface
│   ├── AuthStore interface
├── Store Creation
│   ├── State properties
│   ├── Action methods
│   └── Selector methods
└── Export default store
```

### AuthStore Interface Overview

| Category | Properties | Purpose |
|----------|-----------|---------|
| User State | user | Current authenticated user |
| Tenant State | tenant | Current tenant context |
| Permissions | permissions | RBAC permissions array |
| Auth Status | isAuthenticated, isLoading | Auth state flags |
| Actions | setUser, setTenant, setPermissions, login, logout | State mutations |
| Selectors | hasPermission, canAccess | Permission checks |

### Expected Outcome
- authStore.ts file created in store directory
- Zustand store initialized with proper typing
- Foundation ready for state and action definitions
- Clean interface for auth state management

### Verification Checklist
- [ ] `frontend/store/authStore.ts` file exists
- [ ] Zustand imports are correct
- [ ] AuthStore interface defined
- [ ] Store created with proper typing
- [ ] File structure follows conventions
- [ ] TypeScript compilation succeeds

---

## Task 32: Define User State

### Overview
Define the user state slice within the auth store. This represents the currently authenticated user's profile data, including identification, contact information, role assignment, and optional avatar. The user object is the primary entity in authentication state.

### Dependencies
- Task 31: Create Auth Store

### Instructions

1. **Define User interface**
   - Create TypeScript interface for User type
   - Include all user properties with proper types
   - Export interface for reuse across application

2. **Add id property**
   - Type: `string`
   - Purpose: Unique user identifier
   - Source: Backend authentication response
   - Required for all user operations

3. **Add email property**
   - Type: `string`
   - Purpose: User's email address
   - Used for identification and communication
   - Must be unique across system

4. **Add firstName property**
   - Type: `string`
   - Purpose: User's first/given name
   - Used in UI for personalization
   - Display in greeting messages

5. **Add lastName property**
   - Type: `string`
   - Purpose: User's last/family name
   - Combined with firstName for full name display
   - Used in formal contexts

6. **Add role property**
   - Type: `string`
   - Purpose: User's assigned role in system
   - Examples: 'admin', 'manager', 'cashier'
   - Determines base permissions set

7. **Add avatar property**
   - Type: `string | null` (optional)
   - Purpose: URL to user's avatar image
   - Display in UI header and profile
   - Null if no avatar uploaded

8. **Add user state to store**
   - Property name: `user`
   - Type: `User | null`
   - Initial value: `null`
   - Null represents unauthenticated state

### User State Structure

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique user ID |
| email | string | Yes | Email address |
| firstName | string | Yes | First name |
| lastName | string | Yes | Last name |
| role | string | Yes | User role |
| avatar | string &#124; null | No | Avatar URL |

### User Object Example Structure

```
User Object Representation:
{
  id: string (UUID format)
  email: string (valid email)
  firstName: string
  lastName: string
  role: string (role key)
  avatar: string | null (URL or null)
}
```

### Usage Contexts

| Context | Usage |
|---------|-------|
| Header | Display user name and avatar |
| Profile Page | Show and edit user information |
| Audit Logs | Track who performed actions |
| Authorization | Check user role and permissions |
| API Requests | Include user context in requests |

### State Management Considerations

- **Null State:** User is `null` when not authenticated
- **Immutability:** Update entire user object, not individual properties
- **Type Safety:** TypeScript ensures all required properties present
- **Validation:** Backend validates user data before sending
- **Persistence:** User persisted to localStorage via persist middleware

### Expected Outcome
- User interface fully defined
- User state property added to store
- All user properties properly typed
- User state initialized to null
- Ready for setUser action implementation

### Verification Checklist
- [ ] User interface defined with all properties
- [ ] user property added to AuthStore
- [ ] Type is `User | null`
- [ ] Initial value is `null`
- [ ] All properties have correct types
- [ ] Interface exported for reuse

---

## Task 33: Define Tenant State

### Overview
Define the tenant state slice within the auth store. This represents the current tenant context for multi-tenancy support, including tenant identification, business information, subscription details, and tenant-specific settings. The tenant determines which data the user can access and what features are available.

### Dependencies
- Task 31: Create Auth Store

### Instructions

1. **Define Tenant interface**
   - Create TypeScript interface for Tenant type
   - Include all tenant properties with proper types
   - Export interface for system-wide usage

2. **Add id property**
   - Type: `string`
   - Purpose: Unique tenant identifier
   - Used for data isolation in multi-tenant architecture
   - Critical for security and data segregation

3. **Add name property**
   - Type: `string`
   - Purpose: Business or organization name
   - Display in UI header and branding
   - Used for tenant identification

4. **Add slug property**
   - Type: `string`
   - Purpose: URL-friendly tenant identifier
   - Used in subdomain or path routing
   - Example: `acme-corp` for `acme-corp.example.com`

5. **Add plan property**
   - Type: `string`
   - Purpose: Current subscription plan
   - Examples: 'free', 'basic', 'professional', 'enterprise'
   - Determines feature availability and limits

6. **Add settings property**
   - Type: `object` (or specific interface)
   - Purpose: Tenant-specific configuration
   - Contains branding, preferences, feature flags
   - Customizes application behavior per tenant

7. **Add tenant state to store**
   - Property name: `tenant`
   - Type: `Tenant | null`
   - Initial value: `null`
   - Null when no tenant context loaded

### Tenant State Structure

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique tenant ID |
| name | string | Yes | Business name |
| slug | string | Yes | URL-friendly identifier |
| plan | string | Yes | Subscription plan |
| settings | object | Yes | Tenant configuration |

### Tenant Settings Structure

```
Tenant Settings Properties:
├── Branding
│   ├── logo: string (URL)
│   ├── primaryColor: string (hex)
│   ├── secondaryColor: string (hex)
├── Features
│   ├── enabledModules: string[]
│   ├── featureFlags: Record<string, boolean>
├── Limits
│   ├── maxUsers: number
│   ├── maxProducts: number
│   ├── storageLimit: number
└── Preferences
    ├── timezone: string
    ├── currency: string
    └── language: string
```

### Multi-Tenancy Context

| Aspect | Description |
|--------|-------------|
| Data Isolation | Tenant ID filters all database queries |
| Feature Access | Plan determines available features |
| Customization | Settings control UI and behavior |
| Subdomain Routing | Slug used for tenant identification |
| Billing | Plan tracks subscription and billing |

### Usage Contexts

| Context | Usage |
|---------|-------|
| UI Header | Display tenant name and logo |
| Feature Gates | Check plan for feature availability |
| API Requests | Include tenant context in requests |
| Routing | Use slug for subdomain routing |
| Branding | Apply tenant colors and logo |

### State Management Considerations

- **Null State:** Tenant is `null` when not loaded or in public context
- **Single Tenant:** User typically belongs to one tenant at a time
- **Switching:** Some users may switch between multiple tenants
- **Validation:** Backend validates tenant access for security
- **Persistence:** Tenant persisted to maintain context across sessions

### Expected Outcome
- Tenant interface fully defined
- Tenant state property added to store
- All tenant properties properly typed
- Settings structure planned
- Ready for setTenant action implementation

### Verification Checklist
- [ ] Tenant interface defined with all properties
- [ ] tenant property added to AuthStore
- [ ] Type is `Tenant | null`
- [ ] Initial value is `null`
- [ ] Settings object structure defined
- [ ] Interface exported for reuse

---

## Task 34: Define Permissions State

### Overview
Define the permissions state slice within the auth store. This is an array of permission strings that define what actions the current user is allowed to perform. Permissions follow a "module:action" format and form the foundation of the Role-Based Access Control (RBAC) system.

### Dependencies
- Task 31: Create Auth Store

### Instructions

1. **Define permission string format**
   - Format: `"module:action"`
   - Module: System module or feature area
   - Action: Specific operation (create, read, update, delete, etc.)
   - Example: `"products:create"`, `"invoices:read"`

2. **Create Permission type alias**
   - Type: `string` (with format documentation)
   - Consider branded type for type safety
   - Export type for use across application

3. **Add permissions array to store**
   - Property name: `permissions`
   - Type: `string[]` or `Permission[]`
   - Initial value: `[]` (empty array)
   - Populated during login

4. **Document standard permission patterns**
   - CRUD operations: `:create`, `:read`, `:update`, `:delete`
   - Special operations: `:list`, `:export`, `:import`, `:approve`
   - Wildcard permissions: `module:*` for all actions
   - Admin permission: `*:*` for superuser access

### Permission Format Specification

| Component | Description | Examples |
|-----------|-------------|----------|
| Module | System module or feature | products, invoices, users, reports |
| Action | Specific operation | create, read, update, delete, list, export |
| Separator | Colon separator | `:` |
| Wildcard | All actions in module | `products:*` |
| Superuser | All permissions | `*:*` |

### Standard Permission Examples

| Permission | Description |
|------------|-------------|
| `products:create` | Create new products |
| `products:read` | View product details |
| `products:update` | Edit existing products |
| `products:delete` | Delete products |
| `products:list` | List/search products |
| `invoices:read` | View invoices |
| `invoices:create` | Create new invoices |
| `invoices:approve` | Approve invoices |
| `users:manage` | Manage user accounts |
| `reports:export` | Export reports |
| `settings:update` | Modify system settings |
| `*:*` | Superuser access |

### Module Categories

```
Permission Modules:
├── Core Modules
│   ├── products:*
│   ├── inventory:*
│   ├── sales:*
│   ├── customers:*
├── Financial
│   ├── invoices:*
│   ├── payments:*
│   ├── receipts:*
│   ├── refunds:*
├── Administration
│   ├── users:*
│   ├── roles:*
│   ├── settings:*
│   └── audit:*
├── Reporting
│   ├── reports:*
│   └── analytics:*
└── Integrations
    ├── imports:*
    └── exports:*
```

### Permission Loading Flow

```
Permission Loading Process:
1. User logs in successfully
2. Backend returns user's role
3. Backend includes permissions array for role
4. Frontend stores permissions in authStore
5. UI components check permissions before rendering
6. API calls include permissions for server-side validation
```

### RBAC Usage Patterns

| Pattern | Usage |
|---------|-------|
| Component Rendering | Show/hide UI elements based on permissions |
| Route Guards | Protect routes requiring specific permissions |
| Feature Flags | Enable/disable features by permission |
| Button States | Disable actions user cannot perform |
| Menu Items | Filter navigation based on permissions |

### State Management Considerations

- **Empty Array:** Permissions is `[]` when user not authenticated
- **Array Type:** Use array for efficient permission checks
- **Immutability:** Replace entire array on permission changes
- **Validation:** Backend is source of truth for permissions
- **Performance:** Consider Set for large permission lists
- **Caching:** Permissions cached to avoid repeated checks

### Expected Outcome
- Permission type defined or documented
- Permissions array added to store
- Permission format standardized
- Initial value set to empty array
- Ready for setPermissions action

### Verification Checklist
- [ ] Permission format documented
- [ ] permissions property added to AuthStore
- [ ] Type is `string[]`
- [ ] Initial value is `[]`
- [ ] Standard permissions documented
- [ ] Format examples provided

---

## Task 35: Define Auth Status State

### Overview
Define the authentication status state slice within the auth store. This includes boolean flags that track whether a user is currently authenticated and whether authentication operations are in progress. These flags control UI rendering, route guards, and loading states throughout the application.

### Dependencies
- Task 31: Create Auth Store

### Instructions

1. **Add isAuthenticated property**
   - Type: `boolean`
   - Purpose: Indicates if user is logged in
   - Initial value: `false`
   - True when user, tenant, and permissions loaded

2. **Add isLoading property**
   - Type: `boolean`
   - Purpose: Indicates authentication operations in progress
   - Initial value: `true`
   - True during login, logout, token refresh, etc.

3. **Document status state transitions**
   - Initial state: `isLoading: true, isAuthenticated: false`
   - After checking storage: Set isLoading based on result
   - During login: `isLoading: true`
   - Login success: `isLoading: false, isAuthenticated: true`
   - Login failure: `isLoading: false, isAuthenticated: false`
   - During logout: `isLoading: true`
   - After logout: `isLoading: false, isAuthenticated: false`

4. **Plan status-dependent behaviors**
   - Loading state: Show loading spinner
   - Authenticated: Show main application
   - Not authenticated: Redirect to login
   - Error state: Show error message

### Auth Status Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| isAuthenticated | boolean | false | User is logged in |
| isLoading | boolean | true | Auth operation in progress |

### Status State Combinations

| isAuthenticated | isLoading | UI State | Description |
|----------------|-----------|----------|-------------|
| false | true | Loading | Initial load, checking tokens |
| false | false | Login Page | Not authenticated, show login |
| true | false | Application | Authenticated, show app |
| true | true | Loading | Refreshing auth, show spinner |

### State Transition Diagram

```
Auth Status Flow:

Initial State
    │
    │ isLoading: true
    │ isAuthenticated: false
    │
    ▼
Check Stored Tokens
    │
    ├─── Tokens Valid ───┐
    │                    │
    │                    ▼
    │            Load User Data
    │                    │
    │                    ▼
    │            isAuthenticated: true
    │            isLoading: false
    │
    └─── No Tokens ─────┐
                        │
                        ▼
                isAuthenticated: false
                isLoading: false
                        │
                        ▼
                Show Login Page
                        │
        ┌───────────────┘
        │
        ▼
    User Logs In
        │
        │ isLoading: true
        │
        ▼
    API Call
        │
        ├─── Success ───┐
        │               │
        │               ▼
        │       Set User/Tenant/Perms
        │               │
        │               ▼
        │       isAuthenticated: true
        │       isLoading: false
        │
        └─── Failure ───┐
                        │
                        ▼
                isLoading: false
                Show Error
```

### Usage Contexts

| Context | Condition | Action |
|---------|-----------|--------|
| App Initialization | isLoading: true | Show splash screen |
| Route Guard | isAuthenticated: false | Redirect to login |
| Header Display | isAuthenticated: true | Show user menu |
| Login Form | isLoading: true | Disable submit button |
| Protected Component | isAuthenticated: false | Show unauthorized |

### Loading State Best Practices

| Practice | Description |
|----------|-------------|
| Immediate Feedback | Set isLoading: true before async operations |
| Error Handling | Set isLoading: false in catch blocks |
| Optimistic Updates | Update UI before API confirms |
| Loading Indicators | Show spinners during isLoading: true |
| Timeout Handling | Set reasonable timeouts for auth operations |

### State Management Considerations

- **Initial Loading:** App starts with isLoading: true to check stored auth
- **Optimistic Updates:** May set isAuthenticated before API confirms
- **Error Recovery:** Always set isLoading: false in error cases
- **Multiple Operations:** Track loading per operation if needed
- **Race Conditions:** Handle concurrent auth operations carefully

### Expected Outcome
- isAuthenticated boolean added to store
- isLoading boolean added to store
- Default values set appropriately
- State transitions documented
- Ready for action implementations

### Verification Checklist
- [ ] isAuthenticated property added
- [ ] Initial value is `false`
- [ ] isLoading property added
- [ ] Initial value is `true`
- [ ] State transitions documented
- [ ] Usage patterns defined

---

## Task 36: Create setUser Action

### Overview
Create the setUser action that updates the user state in the auth store. This action receives a user object (or null) and updates the store state. It's used during login to set the authenticated user, during profile updates to refresh user data, and during logout to clear the user.

### Dependencies
- Task 32: Define User State

### Instructions

1. **Define setUser method in store**
   - Method name: `setUser`
   - Parameter: `user: User | null`
   - Return type: `void`
   - Add to AuthStore interface

2. **Implement user state update**
   - Use Zustand's set function
   - Update only the user property
   - Preserve other state properties

3. **Handle null case**
   - Accept null to clear user state
   - Used during logout
   - Represents unauthenticated state

4. **Ensure immutability**
   - Replace entire user object
   - Do not mutate existing user object
   - Create new state reference

5. **Consider side effects**
   - May trigger derived state updates
   - May affect isAuthenticated flag
   - May trigger persistence

### setUser Action Signature

```
Method Signature:
setUser: (user: User | null) => void

Parameters:
- user: User object with all properties or null

Returns: void (updates state)
```

### Usage Scenarios

| Scenario | Parameter | Effect |
|----------|-----------|--------|
| Login Success | User object | Sets authenticated user |
| Profile Update | Updated User object | Refreshes user data |
| Logout | null | Clears user state |
| Token Refresh | Same User object | Maintains user state |

### Implementation Pattern

```
Implementation Approach:
1. Receive user parameter (User | null)
2. Call set function with state updater
3. Return new state with updated user property
4. Preserve all other state properties
5. Trigger any registered listeners
```

### Action Flow

```
setUser Action Flow:

Call setUser(user)
    │
    ▼
Validate Input
    │
    ├─── Valid User Object ───┐
    │                         │
    │                         ▼
    │                Update State
    │                user = userObj
    │                         │
    │                         ▼
    │                Trigger Persistence
    │                         │
    │                         ▼
    │                Update Derived State
    │
    └─── Null ───────────────┐
                             │
                             ▼
                    Update State
                    user = null
                             │
                             ▼
                    Clear Related State
```

### Immutability Considerations

| Aspect | Implementation |
|--------|----------------|
| Object Reference | Create new object reference |
| Nested Properties | Replace entire object, not properties |
| Array Properties | Not applicable for user object |
| State Merging | Merge with existing state |

### Integration Points

| Integration | Description |
|-------------|-------------|
| Login Action | Called after successful authentication |
| Profile API | Called after profile updates |
| Token Refresh | May refresh user data |
| Logout Action | Called with null to clear user |
| Persistence | Triggers state save to storage |

### State Update Pattern

```
State Update Example:

Before setUser:
{
  user: null,
  tenant: { ... },
  permissions: [...],
  isAuthenticated: false
}

Call setUser(userData)

After setUser:
{
  user: { id, email, firstName, lastName, role, avatar },
  tenant: { ... },
  permissions: [...],
  isAuthenticated: false  // May be updated separately
}
```

### Expected Outcome
- setUser action defined in store
- Accepts User object or null
- Updates user state immutably
- Preserves other state properties
- Ready for use in login/logout flows

### Verification Checklist
- [ ] setUser method added to store
- [ ] Parameter type is `User | null`
- [ ] Returns void
- [ ] Updates user state correctly
- [ ] Preserves other state
- [ ] Handles null case

---

## Task 37: Create setTenant Action

### Overview
Create the setTenant action that updates the tenant state in the auth store. This action receives a tenant object (or null) and updates the store state. It's used during login to set the tenant context, when switching between tenants, and during logout to clear tenant information.

### Dependencies
- Task 33: Define Tenant State

### Instructions

1. **Define setTenant method in store**
   - Method name: `setTenant`
   - Parameter: `tenant: Tenant | null`
   - Return type: `void`
   - Add to AuthStore interface

2. **Implement tenant state update**
   - Use Zustand's set function
   - Update only the tenant property
   - Preserve other state properties

3. **Handle null case**
   - Accept null to clear tenant state
   - Used during logout or tenant switch
   - Represents no tenant context

4. **Ensure immutability**
   - Replace entire tenant object
   - Do not mutate existing tenant object
   - Create new state reference

5. **Consider multi-tenancy implications**
   - Changing tenant may require data refresh
   - May need to clear cached data
   - May affect available features based on plan

### setTenant Action Signature

```
Method Signature:
setTenant: (tenant: Tenant | null) => void

Parameters:
- tenant: Tenant object with all properties or null

Returns: void (updates state)
```

### Usage Scenarios

| Scenario | Parameter | Effect |
|----------|-----------|--------|
| Login Success | Tenant object | Sets tenant context |
| Tenant Switch | New Tenant object | Changes active tenant |
| Tenant Update | Updated Tenant | Refreshes tenant data |
| Logout | null | Clears tenant context |
| Public Pages | null | No tenant context |

### Implementation Pattern

```
Implementation Approach:
1. Receive tenant parameter (Tenant | null)
2. Call set function with state updater
3. Return new state with updated tenant property
4. Preserve all other state properties
5. Trigger any registered listeners
6. May trigger data refresh based on new tenant
```

### Action Flow

```
setTenant Action Flow:

Call setTenant(tenant)
    │
    ▼
Validate Input
    │
    ├─── Valid Tenant Object ───┐
    │                           │
    │                           ▼
    │                  Update State
    │                  tenant = tenantObj
    │                           │
    │                           ▼
    │                  Trigger Persistence
    │                           │
    │                           ▼
    │                  Apply Tenant Settings
    │                           │
    │                           ▼
    │                  Update Feature Flags
    │
    └─── Null ─────────────────┐
                               │
                               ▼
                      Update State
                      tenant = null
                               │
                               ▼
                      Clear Tenant Context
```

### Tenant Switching Considerations

| Aspect | Consideration |
|--------|---------------|
| Data Isolation | Ensure data from previous tenant cleared |
| API Context | Update API client with new tenant ID |
| UI Updates | Re-render components with new tenant |
| Cache Clearing | Invalidate queries for old tenant |
| Permission Reset | May need to reload permissions |

### Integration Points

| Integration | Description |
|-------------|-------------|
| Login Action | Called after authentication |
| Tenant Switcher | Called when user changes tenant |
| Tenant API | Called after tenant updates |
| Logout Action | Called with null to clear |
| Feature Gates | Tenant plan affects features |

### Multi-Tenant Patterns

```
Multi-Tenant State Flow:

User with Multiple Tenants:
1. Login → setTenant(defaultTenant)
2. User selects different tenant
3. Call setTenant(newTenant)
4. Clear cached data for old tenant
5. Fetch data for new tenant
6. Update UI with new tenant context

Single Tenant Users:
1. Login → setTenant(onlyTenant)
2. Tenant remains constant
3. Only cleared on logout
```

### State Update Pattern

```
State Update Example:

Before setTenant:
{
  user: { ... },
  tenant: null,
  permissions: [...],
  isAuthenticated: true
}

Call setTenant(tenantData)

After setTenant:
{
  user: { ... },
  tenant: { id, name, slug, plan, settings },
  permissions: [...],
  isAuthenticated: true
}
```

### Expected Outcome
- setTenant action defined in store
- Accepts Tenant object or null
- Updates tenant state immutably
- Preserves other state properties
- Supports tenant switching workflow

### Verification Checklist
- [ ] setTenant method added to store
- [ ] Parameter type is `Tenant | null`
- [ ] Returns void
- [ ] Updates tenant state correctly
- [ ] Preserves other state
- [ ] Handles null case

---

## Task 38: Create setPermissions Action

### Overview
Create the setPermissions action that updates the permissions array in the auth store. This action receives an array of permission strings and updates the store state. It's used during login to set user permissions, when permissions change due to role updates, and during logout to clear permissions.

### Dependencies
- Task 34: Define Permissions State

### Instructions

1. **Define setPermissions method in store**
   - Method name: `setPermissions`
   - Parameter: `permissions: string[]`
   - Return type: `void`
   - Add to AuthStore interface

2. **Implement permissions state update**
   - Use Zustand's set function
   - Update only the permissions property
   - Preserve other state properties

3. **Handle empty array**
   - Accept empty array to clear permissions
   - Used during logout
   - Represents no access rights

4. **Ensure immutability**
   - Replace entire permissions array
   - Do not mutate existing array
   - Create new array reference

5. **Consider validation**
   - May validate permission format
   - May deduplicate permissions
   - Backend is source of truth

### setPermissions Action Signature

```
Method Signature:
setPermissions: (permissions: string[]) => void

Parameters:
- permissions: Array of permission strings

Returns: void (updates state)
```

### Usage Scenarios

| Scenario | Parameter | Effect |
|----------|-----------|--------|
| Login Success | Permissions array | Sets user permissions |
| Role Update | New permissions array | Updates access rights |
| Permission Grant | Updated array | Adds new permissions |
| Logout | Empty array `[]` | Clears all permissions |

### Implementation Pattern

```
Implementation Approach:
1. Receive permissions parameter (string[])
2. Optional: Validate permission formats
3. Optional: Remove duplicates
4. Call set function with state updater
5. Return new state with updated permissions
6. Preserve all other state properties
7. Trigger permission-dependent UI updates
```

### Action Flow

```
setPermissions Action Flow:

Call setPermissions(permissions)
    │
    ▼
Receive Array
    │
    ├─── Non-empty Array ───┐
    │                       │
    │                       ▼
    │              Optional Validation
    │                       │
    │                       ▼
    │              Optional Deduplication
    │                       │
    │                       ▼
    │              Update State
    │              permissions = array
    │                       │
    │                       ▼
    │              Trigger Persistence
    │                       │
    │                       ▼
    │              Update UI Elements
    │
    └─── Empty Array ───────┐
                            │
                            ▼
                   Update State
                   permissions = []
                            │
                            ▼
                   Disable Protected Features
```

### Permission Management

| Aspect | Implementation |
|--------|----------------|
| Duplicate Handling | May filter duplicates |
| Format Validation | Optional format checking |
| Case Sensitivity | Maintain consistent case |
| Sorting | May sort for consistency |
| Caching | Store in Set for fast lookup |

### Integration Points

| Integration | Description |
|-------------|-------------|
| Login Action | Sets initial permissions |
| Role Change | Updates permissions for new role |
| hasPermission | Checks against this array |
| canAccess | Uses permissions for access checks |
| UI Components | Query permissions for rendering |

### Permission Update Patterns

```
Permission Update Scenarios:

Initial Login:
[] → ["products:read", "sales:create", ...]

Role Upgrade (Admin):
["products:read"] → ["products:*", "users:*", "*:*"]

Role Downgrade:
["products:*", "users:*"] → ["products:read"]

Logout:
["products:read", ...] → []

Permission Grant:
["products:read"] → ["products:read", "products:create"]
```

### State Update Pattern

```
State Update Example:

Before setPermissions:
{
  user: { ... },
  tenant: { ... },
  permissions: [],
  isAuthenticated: true
}

Call setPermissions(["products:read", "sales:create"])

After setPermissions:
{
  user: { ... },
  tenant: { ... },
  permissions: ["products:read", "sales:create"],
  isAuthenticated: true
}
```

### Performance Considerations

| Consideration | Strategy |
|---------------|----------|
| Array Size | Typically small (10-100 items) |
| Lookup Speed | Consider converting to Set |
| Update Frequency | Rare (only on auth changes) |
| Memory Impact | Minimal for string arrays |

### Expected Outcome
- setPermissions action defined in store
- Accepts array of permission strings
- Updates permissions state immutably
- Preserves other state properties
- Ready for permission checks

### Verification Checklist
- [ ] setPermissions method added to store
- [ ] Parameter type is `string[]`
- [ ] Returns void
- [ ] Updates permissions correctly
- [ ] Preserves other state
- [ ] Handles empty array

---

## Task 39: Create login Action

### Overview
Create the composite login action that orchestrates the complete login process. This action calls setUser, setTenant, and setPermissions in sequence, manages the isLoading state, and updates isAuthenticated. This is the primary action used when a user successfully authenticates.

### Dependencies
- Task 36: Create setUser Action
- Task 37: Create setTenant Action
- Task 38: Create setPermissions Action
- Task 35: Define Auth Status State

### Instructions

1. **Define login method in store**
   - Method name: `login`
   - Parameters: `user: User, tenant: Tenant, permissions: string[]`
   - Return type: `void` or `Promise<void>`
   - Add to AuthStore interface

2. **Set loading state at start**
   - Set `isLoading: true`
   - Indicates authentication in progress
   - Triggers loading UI

3. **Call setUser with user data**
   - Update user state
   - Store authenticated user information
   - First step in login sequence

4. **Call setTenant with tenant data**
   - Update tenant context
   - Establish multi-tenant context
   - Second step in login sequence

5. **Call setPermissions with permissions array**
   - Update permissions
   - Establish access rights
   - Third step in login sequence

6. **Set isAuthenticated to true**
   - Indicate successful authentication
   - Triggers authenticated UI
   - Enables protected routes

7. **Set loading state to false**
   - Clear loading indicator
   - Complete authentication flow
   - Final step in sequence

8. **Handle error cases**
   - Catch any errors in login process
   - Set isLoading: false on error
   - Keep isAuthenticated: false on error
   - May show error message

### login Action Signature

```
Method Signature:
login: (user: User, tenant: Tenant, permissions: string[]) => void

Parameters:
- user: Authenticated user object
- tenant: User's tenant context
- permissions: User's permission array

Returns: void (updates state)
```

### Login Flow Sequence

```
Login Action Flow:

1. Call login(user, tenant, permissions)
    │
    ▼
2. Set isLoading = true
    │
    ▼
3. Call setUser(user)
    │
    ▼
4. Call setTenant(tenant)
    │
    ▼
5. Call setPermissions(permissions)
    │
    ▼
6. Set isAuthenticated = true
    │
    ▼
7. Set isLoading = false
    │
    ▼
8. Login Complete
    │
    ▼
9. Redirect to Dashboard
```

### State Transitions

| Stage | isLoading | isAuthenticated | user | tenant | permissions |
|-------|-----------|----------------|------|--------|-------------|
| Before Login | false | false | null | null | [] |
| Start Login | true | false | null | null | [] |
| After setUser | true | false | User | null | [] |
| After setTenant | true | false | User | Tenant | [] |
| After setPerms | true | false | User | Tenant | string[] |
| Login Complete | false | true | User | Tenant | string[] |

### Implementation Pattern

```
Login Implementation Approach:

function login(user, tenant, permissions) {
  // Step 1: Start loading
  set({ isLoading: true })
  
  // Step 2: Update all auth data
  setUser(user)
  setTenant(tenant)
  setPermissions(permissions)
  
  // Step 3: Complete authentication
  set({ 
    isAuthenticated: true,
    isLoading: false 
  })
  
  // Optional: Trigger side effects
  // - Clear previous data
  // - Initialize features
  // - Redirect to dashboard
}
```

### Error Handling Pattern

```
Error Handling:

try {
  set({ isLoading: true })
  
  setUser(user)
  setTenant(tenant)
  setPermissions(permissions)
  
  set({ 
    isAuthenticated: true,
    isLoading: false 
  })
} catch (error) {
  // Ensure loading state cleared
  set({ isLoading: false })
  
  // Keep isAuthenticated false
  // May clear partial state
  // Log error
  // Show error message
}
```

### Integration with API

| Step | Description |
|------|-------------|
| 1. Login Form | User submits credentials |
| 2. API Call | Send credentials to backend |
| 3. API Response | Receive user, tenant, permissions |
| 4. Call login() | Pass data to login action |
| 5. State Update | Store updates all auth state |
| 6. UI Update | App shows authenticated view |
| 7. Redirect | Navigate to dashboard |

### Side Effects

| Side Effect | When | Description |
|-------------|------|-------------|
| Token Storage | After API call | Store access/refresh tokens |
| Data Clearing | Before login | Clear any previous user data |
| Query Invalidation | After login | Invalidate cached queries |
| Analytics | After login | Track login event |
| Feature Init | After login | Initialize tenant features |
| Redirect | After login | Navigate to dashboard |

### Usage Example

```
Login Usage Pattern:

// In login component or API service
const response = await authAPI.login(email, password)

// Extract data from response
const { user, tenant, permissions } = response.data

// Call login action
authStore.login(user, tenant, permissions)

// Login complete, state updated
// UI automatically updates via store subscription
```

### Expected Outcome
- login action defined in store
- Accepts user, tenant, and permissions
- Updates all auth state in sequence
- Manages loading state properly
- Sets isAuthenticated to true
- Complete authentication flow

### Verification Checklist
- [ ] login method added to store
- [ ] Parameters include user, tenant, permissions
- [ ] Returns void
- [ ] Sets isLoading true at start
- [ ] Calls setUser, setTenant, setPermissions
- [ ] Sets isAuthenticated to true
- [ ] Sets isLoading false at end
- [ ] Error handling implemented

---

## Task 40: Create logout Action

### Overview
Create the logout action that clears all authentication state and tokens. This action resets the user, tenant, and permissions to their initial states, sets isAuthenticated to false, and clears any stored tokens. This completely removes the user's authenticated session.

### Dependencies
- Task 31: Create Auth Store
- Token storage utility (from authentication infrastructure)

### Instructions

1. **Define logout method in store**
   - Method name: `logout`
   - Parameters: None
   - Return type: `void` or `Promise<void>`
   - Add to AuthStore interface

2. **Set loading state at start**
   - Set `isLoading: true`
   - Indicates logout in progress
   - May show loading indicator

3. **Clear user state**
   - Set `user: null`
   - Removes authenticated user data
   - First step in cleanup

4. **Clear tenant state**
   - Set `tenant: null`
   - Removes tenant context
   - Second step in cleanup

5. **Clear permissions state**
   - Set `permissions: []`
   - Removes all access rights
   - Third step in cleanup

6. **Set isAuthenticated to false**
   - Indicate no active authentication
   - Triggers unauthenticated UI
   - Disables protected routes

7. **Clear stored tokens**
   - Call `clearTokens()` from token storage utility
   - Remove access token
   - Remove refresh token
   - Clear from localStorage/sessionStorage

8. **Set loading state to false**
   - Clear loading indicator
   - Complete logout flow
   - Final step in sequence

9. **Clear other stores**
   - May reset other Zustand stores
   - Clear cached data
   - Prepare for next login

10. **Redirect to login**
    - Navigate to login page
    - Prevent access to protected routes
    - Show login form

### logout Action Signature

```
Method Signature:
logout: () => void

Parameters: None

Returns: void (updates state)
```

### Logout Flow Sequence

```
Logout Action Flow:

1. Call logout()
    │
    ▼
2. Set isLoading = true
    │
    ▼
3. Set user = null
    │
    ▼
4. Set tenant = null
    │
    ▼
5. Set permissions = []
    │
    ▼
6. Set isAuthenticated = false
    │
    ▼
7. Call clearTokens()
    │
    ▼
8. Reset other stores (optional)
    │
    ▼
9. Set isLoading = false
    │
    ▼
10. Redirect to login
    │
    ▼
11. Logout Complete
```

### State Transitions

| Stage | isLoading | isAuthenticated | user | tenant | permissions |
|-------|-----------|----------------|------|--------|-------------|
| Before Logout | false | true | User | Tenant | string[] |
| Start Logout | true | true | User | Tenant | string[] |
| After Clear | true | false | null | null | [] |
| Logout Complete | false | false | null | null | [] |

### Implementation Pattern

```
Logout Implementation Approach:

function logout() {
  // Step 1: Start loading
  set({ isLoading: true })
  
  // Step 2: Clear all auth state
  set({
    user: null,
    tenant: null,
    permissions: [],
    isAuthenticated: false
  })
  
  // Step 3: Clear tokens
  clearTokens()
  
  // Step 4: Reset other stores
  resetOtherStores()
  
  // Step 5: Complete logout
  set({ isLoading: false })
  
  // Step 6: Redirect
  navigateToLogin()
}
```

### Token Clearing

| Token Type | Storage Location | Clearing Method |
|------------|------------------|-----------------|
| Access Token | localStorage | removeItem('access_token') |
| Refresh Token | localStorage | removeItem('refresh_token') |
| Token Expiry | localStorage | removeItem('token_expiry') |
| User ID | localStorage | removeItem('user_id') |

### Store Reset Pattern

```
Store Reset Strategy:

// Clear auth store
authStore.logout()

// Optional: Clear other stores
uiStore.reset()
dataStore.reset()

// Optional: Clear React Query cache
queryClient.clear()

// Optional: Clear all localStorage except settings
clearUserSpecificStorage()
```

### Side Effects

| Side Effect | When | Description |
|-------------|------|-------------|
| Token Removal | During logout | Delete access/refresh tokens |
| Cache Clearing | During logout | Clear TanStack Query cache |
| Store Reset | During logout | Reset all Zustand stores |
| Cookie Removal | During logout | Clear auth cookies |
| API Notification | Before logout | Notify server of logout |
| Analytics | After logout | Track logout event |
| Redirect | After logout | Navigate to login page |

### API Integration

```
Logout with API:

async function logout() {
  set({ isLoading: true })
  
  try {
    // Optional: Notify server
    await authAPI.logout()
  } catch (error) {
    // Continue logout even if API fails
    console.error('Logout API error:', error)
  }
  
  // Always clear local state
  set({
    user: null,
    tenant: null,
    permissions: [],
    isAuthenticated: false,
    isLoading: false
  })
  
  clearTokens()
  navigateToLogin()
}
```

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Complete Cleanup | Ensure all auth data cleared |
| Token Invalidation | Clear tokens from all storage |
| Session End | Notify backend to end session |
| Cache Clearing | Remove sensitive cached data |
| State Reset | Reset all user-specific state |
| Memory Cleanup | Clear any in-memory auth data |

### Error Handling

```
Logout Error Handling:

function logout() {
  try {
    set({ isLoading: true })
    
    // Clear state (always succeeds)
    set({
      user: null,
      tenant: null,
      permissions: [],
      isAuthenticated: false
    })
    
    // Clear tokens (may fail)
    try {
      clearTokens()
    } catch (e) {
      console.error('Token clear error:', e)
    }
    
    set({ isLoading: false })
    navigateToLogin()
    
  } catch (error) {
    // Ensure logout completes
    set({ 
      isLoading: false,
      isAuthenticated: false 
    })
  }
}
```

### Usage Scenarios

| Scenario | Trigger | Action |
|----------|---------|--------|
| User Clicks Logout | User menu | Call logout() |
| Session Expired | Token refresh fails | Auto logout() |
| Unauthorized | 401 API response | Force logout() |
| Inactivity Timeout | Timer expires | Auto logout() |
| Security Event | Suspicious activity | Force logout() |

### Expected Outcome
- logout action defined in store
- Clears all authentication state
- Removes tokens from storage
- Sets isAuthenticated to false
- Manages loading state
- May reset other stores
- Redirects to login page

### Verification Checklist
- [ ] logout method added to store
- [ ] No parameters required
- [ ] Returns void
- [ ] Sets isLoading true at start
- [ ] Clears user, tenant, permissions
- [ ] Sets isAuthenticated to false
- [ ] Calls clearTokens()
- [ ] Sets isLoading false at end
- [ ] Handles errors gracefully
- [ ] Redirects to login

---

## Document Summary

This document established the complete foundation for authentication state management, including:

### State Definitions
- User state with profile information
- Tenant state with multi-tenancy support
- Permissions array for RBAC
- Auth status flags (isAuthenticated, isLoading)

### Actions Implemented
- setUser: Update user state
- setTenant: Update tenant context
- setPermissions: Update permissions array
- login: Composite action for authentication
- logout: Complete state cleanup

### Key Outcomes
- Complete auth store structure defined
- All core state slices implemented
- All state management actions created
- Ready for selector and persistence implementation
- Foundation for authentication flow complete

### Next Steps
Proceed to [02_Tasks-41-44_Selectors-Persistence-Hook.md](02_Tasks-41-44_Selectors-Persistence-Hook.md) to implement:
- Permission checking selectors
- State persistence configuration
- Convenience hooks for components

---

## Cross-References

### Related Documents
- [SubPhase-04_Authentication-System](../../SubPhase-04_Authentication-System/) - Backend auth integration
- [SubPhase-06_Authentication-UI](../../SubPhase-06_Authentication-UI/) - Login UI components
- [Group-D_TanStack-Query-Setup](../Group-D_TanStack-Query-Setup/) - API integration

### Related Tasks
- Task 14: Configure Zustand (prerequisite)
- Task 15-30: Other state stores (parallel development)
- Task 45+: API query hooks (uses auth store)

---

*Document Version: 1.0*  
*Last Updated: 2026-01-25*
