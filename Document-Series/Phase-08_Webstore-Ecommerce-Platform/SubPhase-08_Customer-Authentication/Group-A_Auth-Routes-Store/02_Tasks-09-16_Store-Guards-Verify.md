# Tasks 09-16: Store Actions, Guards, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** A - Auth Routes & Store  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Routes-Types.md](01_Tasks-01-08_Routes-Types.md)

---

## Document Overview

This document covers the creation of Zustand store actions, authentication state management, route guards, and verification. It builds upon the foundational auth store and types created in the previous document. These tasks implement the core authentication logic, including login/logout actions, context provider for SSR hydration, auth/guest guards for route protection, and final verification of the authentication flow.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create Auth State Type | Low | 15 min |
| 10 | Create Login Action | Low | 25 min |
| 11 | Create Logout Action | Low | 20 min |
| 12 | Create Set User Action | Low | 15 min |
| 13 | Create Auth Context Provider | Medium | 40 min |
| 14 | Create Auth Guard Component | Medium | 35 min |
| 15 | Create Guest Guard Component | Medium | 30 min |
| 16 | Verify Auth Routes | Low | 25 min |

---

## Task 09: Create Auth State Type

### Overview
Create the TypeScript type definition for the complete authentication state in the Zustand store. This type extends beyond just the User type to include authentication status, loading states, error handling, and all store actions (login, logout, setUser). It provides comprehensive type safety for the entire auth store interface.

### Dependencies
- Task 08: Create User Type

### Instructions

1. **Navigate to the types directory**
   - Open `frontend/src/types/auth.ts`
   - This file already contains the User type from Task 08
   - Add the AuthState interface to the same file

2. **Define the AuthState interface**
   - Export a TypeScript interface named `AuthState`
   - Include properties for state data
   - Include properties for loading/error states
   - Include methods for all store actions

3. **Add state properties**
   - `user`: nullable User type (null when not authenticated)
   - `isAuthenticated`: boolean flag for quick auth checks
   - `isLoading`: boolean for loading state during initialization
   - `error`: nullable string for error messages

4. **Add action methods**
   - `login`: async function for user login
   - `logout`: async function for user logout
   - `setUser`: function to update user state
   - `clearError`: optional function to clear error state

5. **Define method signatures**
   - Login method accepts credentials (email, password)
   - Login returns Promise that resolves to void
   - Logout returns Promise that resolves to void
   - SetUser accepts User object or null

6. **Document the interface**
   - Add JSDoc comments explaining purpose
   - Document each property and method
   - Include examples for complex types

### Auth State Structure

```
AuthState Interface
├── State Properties
│   ├── user: User | null
│   ├── isAuthenticated: boolean
│   ├── isLoading: boolean
│   └── error: string | null
└── Actions
    ├── login(email, password): Promise<void>
    ├── logout(): Promise<void>
    ├── setUser(user): void
    └── clearError?(): void
```

### State Flow Diagram

```
Initial State                Login Success              Logout
┌──────────────┐            ┌──────────────┐         ┌──────────────┐
│ user: null   │   login()  │ user: {...}  │logout() │ user: null   │
│ isAuth: false│ ────────>  │ isAuth: true │ ──────> │ isAuth: false│
│ isLoading: ? │            │ isLoading: f │         │ isLoading: f │
│ error: null  │            │ error: null  │         │ error: null  │
└──────────────┘            └──────────────┘         └──────────────┘
```

### Type Safety Benefits

| Benefit | Description |
|---------|-------------|
| Autocomplete | IDE suggests available properties and methods |
| Type Checking | Prevents incorrect parameter types |
| Refactoring | Easy to find all usages when changing structure |
| Documentation | Self-documenting interface for developers |

### Expected Outcome
- Complete AuthState interface exported
- All properties properly typed
- All methods with correct signatures
- Comprehensive type safety for store

### Verification Checklist
- [ ] AuthState interface defined in `auth.ts`
- [ ] All state properties included with correct types
- [ ] All action methods defined with proper signatures
- [ ] JSDoc comments added for documentation
- [ ] No TypeScript errors in the file

---

## Task 10: Create Login Action

### Overview
Implement the login action in the Zustand auth store. This action handles customer authentication by calling the backend API with credentials, storing the authentication result, and updating the store state. The backend uses httpOnly cookies for session management, so the action doesn't store tokens in localStorage.

### Dependencies
- Task 07: Create Auth Store
- Task 09: Create Auth State Type

### Instructions

1. **Open the auth store file**
   - Navigate to `frontend/src/stores/authStore.ts`
   - Locate the store definition created in Task 07
   - Add the login action to the store object

2. **Import required dependencies**
   - Import axios or the configured API client
   - Import necessary types (AuthState, User)
   - Import any error handling utilities

3. **Define the login action**
   - Add `login` property to the store object
   - Make it an async function
   - Accept email and password parameters
   - Type the parameters properly (string)

4. **Implement loading state management**
   - Set `isLoading: true` at the start
   - Set `error: null` to clear previous errors
   - Ensure loading state is reset in finally block

5. **Make API request**
   - POST to `/api/storefront/auth/login` endpoint
   - Send email and password in request body
   - Include credentials for cookie handling
   - Expect User object in response

6. **Handle successful response**
   - Extract user data from response
   - Update store state with `user` data
   - Set `isAuthenticated: true`
   - Set `isLoading: false`

7. **Handle error cases**
   - Catch any API errors
   - Extract error message from response
   - Update `error` state with message
   - Keep user as null and isAuthenticated as false

8. **Implement try-catch-finally pattern**
   - Use try block for API call and state updates
   - Use catch block for error handling
   - Use finally block to ensure isLoading is reset

9. **Add credential handling**
   - Ensure API client sends credentials: 'include'
   - This allows httpOnly cookies to be stored
   - Backend will set session cookie on success

### Login Flow Diagram

```
User Submits         API Request           Success               State Update
Credentials          to Backend            Response              Complete
┌──────────┐        ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Email    │        │ POST     │         │ User     │         │ Store    │
│ Password │ ────>  │ /login   │ ─────>  │ Data     │ ─────>  │ Updated  │
│          │        │ + Creds  │         │ + Cookie │         │          │
└──────────┘        └──────────┘         └──────────┘         └──────────┘
    │                    │                    │                     │
    │                    │ Error              │                     │
    │                    └────────────────────┴─────────────────────┘
    │                         Set error state, keep user null
    └────────────────────────────────────────────────────────────────>
```

### State Updates During Login

| Stage | isLoading | user | isAuthenticated | error |
|-------|-----------|------|-----------------|-------|
| Initial | false | null | false | null |
| Start Login | true | null | false | null |
| Success | false | {...} | true | null |
| Error | false | null | false | "..." |

### Error Handling Strategy

| Error Type | Action |
|------------|--------|
| Network Error | Set generic network error message |
| 401 Unauthorized | Set "Invalid credentials" message |
| 422 Validation | Extract and set validation error |
| 500 Server Error | Set "Server error" message |
| Unknown Error | Set "An error occurred" message |

### Expected Outcome
- Login action fully implemented in store
- Proper loading and error state management
- API call with correct endpoint and credentials
- Store state updated on success and failure

### Verification Checklist
- [ ] Login action added to authStore.ts
- [ ] Async function with email and password parameters
- [ ] Loading state set to true at start
- [ ] API POST request to correct endpoint
- [ ] credentials: 'include' in request config
- [ ] User state updated on success
- [ ] Error state updated on failure
- [ ] isLoading reset in finally block
- [ ] TypeScript types are correct

---

## Task 11: Create Logout Action

### Overview
Implement the logout action in the Zustand auth store. This action calls the backend logout endpoint to invalidate the session cookie, then clears the local authentication state. The logout process is simpler than login since it primarily clears data rather than setting it.

### Dependencies
- Task 07: Create Auth Store
- Task 09: Create Auth State Type

### Instructions

1. **Open the auth store file**
   - Navigate to `frontend/src/stores/authStore.ts`
   - Locate the store definition with login action
   - Add the logout action to the store object

2. **Import required dependencies**
   - Use same API client as login action
   - Ensure types are imported
   - No additional imports needed

3. **Define the logout action**
   - Add `logout` property to the store object
   - Make it an async function
   - No parameters required
   - Returns Promise that resolves to void

4. **Implement loading state management**
   - Set `isLoading: true` at the start
   - Clear any existing errors
   - Reset loading in finally block

5. **Make API request**
   - POST to `/api/storefront/auth/logout` endpoint
   - No request body needed
   - Include credentials for cookie handling
   - Backend will invalidate httpOnly cookie

6. **Handle successful response**
   - Clear `user` state (set to null)
   - Set `isAuthenticated: false`
   - Clear any error messages
   - Set `isLoading: false`

7. **Handle error cases**
   - Still clear local state even if API fails
   - Log error for debugging purposes
   - Don't show error to user for logout
   - Ensure user is logged out locally regardless

8. **Implement graceful error handling**
   - Use try-catch-finally pattern
   - Always clear local auth state
   - API failure shouldn't prevent logout
   - Cookie might already be expired

### Logout Flow Diagram

```
User Clicks         Clear Local           API Request           Complete
Logout              State First           (Best Effort)         Logout
┌──────────┐       ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Logout   │       │ user =   │         │ POST     │         │ Redirect │
│ Button   │ ───>  │ null     │ ─────>  │ /logout  │ ─────>  │ to Login │
│          │       │ isAuth=f │         │ (Cookie) │         │          │
└──────────┘       └──────────┘         └──────────┘         └──────────┘
                         │                    │
                         │                    │ (Even if API fails,
                         │                    │  user is logged out locally)
                         └────────────────────┘
```

### Logout State Transitions

| Stage | isLoading | user | isAuthenticated | error |
|-------|-----------|------|-----------------|-------|
| Before Logout | false | {...} | true | null |
| Start Logout | true | {...} | true | null |
| After Logout | false | null | false | null |

### Logout vs Login Differences

| Aspect | Login | Logout |
|--------|-------|--------|
| Parameters | email, password | none |
| Response Handling | Store user data | Clear all data |
| Error Handling | Show error to user | Silent, still logout |
| Local State | Set on success | Always clear |

### Best Practices

| Practice | Reason |
|----------|--------|
| Clear local state first | Immediate user feedback |
| API call is best-effort | Cookie might be expired |
| Don't block on API error | User should always be able to logout |
| Log API errors | Debugging purposes |

### Expected Outcome
- Logout action fully implemented in store
- Local state cleared regardless of API result
- API call made to invalidate cookie
- Graceful error handling

### Verification Checklist
- [ ] Logout action added to authStore.ts
- [ ] Async function with no parameters
- [ ] API POST request to correct endpoint
- [ ] credentials: 'include' in request config
- [ ] User state set to null
- [ ] isAuthenticated set to false
- [ ] Local state cleared even on API failure
- [ ] No error shown to user for logout failure

---

## Task 12: Create Set User Action

### Overview
Implement the setUser action in the Zustand auth store. This action updates the user state directly without making an API call. It's used for scenarios like SSR hydration where user data is already available, or when user profile information is updated from other actions.

### Dependencies
- Task 07: Create Auth Store
- Task 08: Create User Type

### Instructions

1. **Open the auth store file**
   - Navigate to `frontend/src/stores/authStore.ts`
   - Locate the store definition with login and logout actions
   - Add the setUser action to the store object

2. **Define the setUser action**
   - Add `setUser` property to the store object
   - Make it a synchronous function (not async)
   - Accept user parameter of type `User | null`
   - No return value (void)

3. **Implement state updates**
   - Update `user` state with provided value
   - Update `isAuthenticated` based on user value
   - If user is not null, set isAuthenticated to true
   - If user is null, set isAuthenticated to false

4. **Add derived state logic**
   - Use the set function from Zustand
   - Update both user and isAuthenticated together
   - Ensure state consistency

5. **Consider use cases**
   - SSR hydration: Set user from server data
   - Profile updates: Update user after edit
   - Session validation: Set user from cookie check
   - Manual state management: Direct state control

6. **Keep it simple**
   - No API calls in this action
   - No loading state management
   - No error handling needed
   - Pure state update only

### SetUser Flow Diagram

```
Action Called        Validate Input       Update State         State Consistent
with User Data       (User | null)        (Multiple Props)     (Ready to Use)
┌──────────┐        ┌──────────┐         ┌──────────┐         ┌──────────┐
│ setUser( │        │ Is user  │         │ user =   │         │ Store    │
│ userData │ ────>  │ null?    │ ─────>  │ value    │ ─────>  │ Updated  │
│ )        │        │          │         │ isAuth=? │         │          │
└──────────┘        └──────────┘         └──────────┘         └──────────┘
                         │                     │
                    Yes  │  No                 │
                         v    v                v
                    isAuth=F  T           Both updated
```

### State Logic Table

| Input (user parameter) | user state | isAuthenticated |
|------------------------|------------|-----------------|
| null | null | false |
| undefined | null | false |
| {...} (User object) | {...} | true |

### Common Use Cases

| Use Case | Caller | Purpose |
|----------|--------|---------|
| SSR Hydration | AuthProvider | Set initial user from server |
| Session Validation | useEffect hook | Restore user from cookie |
| Profile Update | Profile page | Update user after edit |
| Manual Override | Admin tools | Direct state manipulation |

### SetUser vs Login Differences

| Aspect | setUser | login |
|--------|---------|-------|
| API Call | No | Yes |
| Parameters | User object | email, password |
| Async | No | Yes |
| Loading State | Not needed | Managed |
| Error Handling | Not needed | Required |
| Use Case | Hydration, updates | Authentication |

### Implementation Pattern

The function should follow this pattern:
1. Receive user parameter (User or null)
2. Use Zustand set function
3. Update user state
4. Update isAuthenticated based on user
5. Return void (no return value)

### Expected Outcome
- setUser action implemented in store
- Simple synchronous state update
- Derived isAuthenticated state
- No API calls or side effects

### Verification Checklist
- [ ] setUser action added to authStore.ts
- [ ] Synchronous function (not async)
- [ ] Accepts user parameter (User | null)
- [ ] Updates user state
- [ ] Updates isAuthenticated correctly
- [ ] isAuthenticated true when user not null
- [ ] isAuthenticated false when user is null
- [ ] No API calls or side effects

---

## Task 13: Create Auth Context Provider

### Overview
Create a React context provider component that wraps the application and handles authentication state hydration on the server. This provider checks for valid authentication on initial page load, validates the session cookie, and initializes the Zustand store with user data if authenticated. It's essential for SSR and ensures auth state is consistent between server and client.

### Dependencies
- Task 07: Create Auth Store
- Task 12: Create Set User Action

### Instructions

1. **Create the provider file**
   - Navigate to `frontend/src/providers/` directory
   - Create new file `AuthProvider.tsx`
   - This will be a client component for Zustand

2. **Import required dependencies**
   - Import 'use client' directive at top
   - Import React and ReactNode type
   - Import useEffect and useState hooks
   - Import the auth store (useAuthStore)

3. **Define component props**
   - Create Props interface
   - Include children property (ReactNode)
   - Optionally include initialUser from server

4. **Create the AuthProvider component**
   - Export default function component
   - Accept children and optional initialUser
   - Use TypeScript for proper typing

5. **Add initialization state**
   - Create local state for initialization
   - `isInitialized` boolean state
   - Prevents rendering before auth check

6. **Implement useEffect for hydration**
   - Run effect on component mount
   - Check if initialUser was provided
   - Call setUser if user data exists
   - Set isInitialized to true when complete

7. **Add session validation**
   - Make API call to validate session
   - Call `/api/storefront/auth/me` endpoint
   - Include credentials for cookie validation
   - Update store with user data if valid

8. **Handle loading state**
   - Show loading indicator while initializing
   - Return null or loading component
   - Prevent flash of unauthenticated content

9. **Render children when ready**
   - Return children once initialized
   - Auth store is now hydrated
   - Components can access auth state

10. **Add error handling**
    - Catch session validation errors
    - Clear auth state if validation fails
    - Mark as initialized even on error
    - User will see logged out state

### Auth Provider Flow

```
App Starts          Check Initial         Validate Session      Render Children
                    User Prop             (API Call)            (Hydrated)
┌──────────┐       ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Provider │       │ Initial  │         │ GET      │         │ Children │
│ Mounts   │ ───>  │ User?    │ ─────>  │ /me      │ ─────>  │ Render   │
│          │       │ Present? │         │ Endpoint │         │          │
└──────────┘       └──────────┘         └──────────┘         └──────────┘
     │                  │ Yes                 │                    │
     │                  v                     │ Valid              │
     │             setUser(user)              v                    │
     │                  │              setUser(data)               │
     │                  │                     │                    │
     │                  v                     v                    │
     └──────────────> isInitialized = true ─────────────────────> │
                                                                   v
                                                           App ready
```

### Initialization States

| Stage | isInitialized | Store State | UI State |
|-------|---------------|-------------|----------|
| Mount | false | Empty | Loading |
| Checking | false | Empty | Loading |
| Valid Session | true | User set | Render app |
| Invalid Session | true | null | Render app |

### SSR Hydration Strategy

| Scenario | Initial User | API Call | Result |
|----------|--------------|----------|--------|
| Fresh Page Load | null | Yes | Validate cookie |
| SSR with User | {...} | No | Use provided data |
| Invalid Cookie | {...} | Yes | Clear if validation fails |
| No Cookie | null | Yes | Confirm not authenticated |

### Component Structure

```
AuthProvider
├── Props Interface
│   ├── children: ReactNode
│   └── initialUser?: User | null
├── State
│   └── isInitialized: boolean
├── useEffect (mount)
│   ├── Check initialUser
│   ├── Call validation API
│   └── Update store + initialized
└── Render Logic
    ├── If not initialized: Loading
    └── If initialized: children
```

### Expected Outcome
- AuthProvider component created
- Hydrates auth store on mount
- Validates session with backend
- Handles loading state gracefully
- Children render with valid auth state

### Verification Checklist
- [ ] AuthProvider.tsx created in providers directory
- [ ] 'use client' directive at top
- [ ] Accepts children and optional initialUser
- [ ] isInitialized state managed
- [ ] useEffect validates session on mount
- [ ] API call to /me endpoint with credentials
- [ ] Store updated with setUser action
- [ ] Loading state prevents premature render
- [ ] Error handling for validation failure
- [ ] TypeScript types are correct

---

## Task 14: Create Auth Guard Component

### Overview
Create an authentication guard component that protects routes requiring user authentication. This component checks if the user is logged in, redirects to login if not, and shows loading state during initialization. It wraps protected pages and ensures only authenticated customers can access them.

### Dependencies
- Task 13: Create Auth Context Provider

### Instructions

1. **Create the guard file**
   - Navigate to `frontend/src/components/guards/` directory
   - Create new file `AuthGuard.tsx`
   - This will be a client component

2. **Import required dependencies**
   - Import 'use client' directive
   - Import React and ReactNode
   - Import useRouter and usePathname from next/navigation
   - Import useEffect from React
   - Import auth store (useAuthStore)

3. **Define component props**
   - Create Props interface
   - Include children property (ReactNode)
   - Optional loading component prop

4. **Create the AuthGuard component**
   - Export default function component
   - Accept children and optional loading component
   - Use TypeScript for proper typing

5. **Access auth state from store**
   - Use useAuthStore hook
   - Destructure isAuthenticated
   - Destructure isLoading
   - Get current user if needed

6. **Set up routing hooks**
   - Use useRouter for programmatic navigation
   - Use usePathname to save return URL
   - These are Next.js App Router hooks

7. **Implement authentication check**
   - Create useEffect that runs when auth state changes
   - Check if not loading and not authenticated
   - Store current pathname as returnUrl
   - Redirect to login page with returnUrl query param

8. **Handle loading state**
   - While isLoading is true, show loading component
   - Return provided loading component or default
   - Prevent flash of content

9. **Handle unauthenticated state**
   - Show nothing during redirect
   - Return null to prevent content flash
   - Router will navigate to login

10. **Render children for authenticated users**
    - Only render children when authenticated
    - User can access protected content
    - Auth state is confirmed valid

### Auth Guard Flow

```
Component          Check Auth           Decision             Action
Renders            State                Point                Taken
┌──────────┐      ┌──────────┐        ┌──────────┐        ┌──────────┐
│ AuthGuard│      │ isLoading│        │ isAuth?  │        │ Redirect │
│ Mounts   │ ──>  │ isAuth?  │ ────>  │ Decision │ ────>  │ or Render│
│          │      │          │        │          │        │          │
└──────────┘      └──────────┘        └──────────┘        └──────────┘
                       │                    │                   │
                       │                    ├─> Yes ──> Render children
                       │                    │
                       │                    ├─> No ───> Redirect to login
                       │                    │
                       └─> Loading ─────────┴────────> Show loading
```

### Decision Tree

```
AuthGuard Logic
│
├─ Is Loading?
│  ├─ Yes → Show Loading Component
│  └─ No  → Continue
│
└─ Is Authenticated?
   ├─ Yes → Render Children (Allow Access)
   └─ No  → Redirect to Login with returnUrl
```

### State-Based Rendering

| isLoading | isAuthenticated | Action |
|-----------|-----------------|--------|
| true | - | Show loading |
| false | true | Render children |
| false | false | Redirect to login |

### Return URL Strategy

| Current Path | Login Redirect |
|--------------|----------------|
| /account/profile | /account/login?returnUrl=/account/profile |
| /account/orders | /account/login?returnUrl=/account/orders |
| /checkout | /account/login?returnUrl=/checkout |

After successful login, user is redirected back to returnUrl.

### Guard Usage Pattern

Wrap protected pages with AuthGuard:

Location: Individual page components that require authentication

The guard should be used in page.tsx files for protected routes.

### Expected Outcome
- AuthGuard component created
- Checks authentication before rendering
- Redirects to login if not authenticated
- Shows loading state during initialization
- Preserves return URL for post-login redirect

### Verification Checklist
- [ ] AuthGuard.tsx created in guards directory
- [ ] 'use client' directive at top
- [ ] Accepts children and optional loading component
- [ ] Uses useAuthStore to access auth state
- [ ] Uses useRouter and usePathname hooks
- [ ] useEffect monitors auth state changes
- [ ] Redirects to login when not authenticated
- [ ] Includes returnUrl query parameter
- [ ] Shows loading state while initializing
- [ ] Renders children only when authenticated
- [ ] TypeScript types are correct

---

## Task 15: Create Guest Guard Component

### Overview
Create a guest guard component that protects routes that should only be accessible to non-authenticated users. This is the inverse of AuthGuard - it redirects authenticated users away from pages like login and register. It prevents logged-in customers from accessing authentication pages unnecessarily.

### Dependencies
- Task 13: Create Auth Context Provider

### Instructions

1. **Create the guard file**
   - Navigate to `frontend/src/components/guards/` directory
   - Create new file `GuestGuard.tsx`
   - This will be a client component

2. **Import required dependencies**
   - Import 'use client' directive
   - Import React and ReactNode
   - Import useRouter from next/navigation
   - Import useEffect from React
   - Import auth store (useAuthStore)

3. **Define component props**
   - Create Props interface
   - Include children property (ReactNode)
   - Optional redirect path prop (default to '/')

4. **Create the GuestGuard component**
   - Export default function component
   - Accept children and optional redirectTo
   - Use TypeScript for proper typing
   - Default redirectTo to '/' (home page)

5. **Access auth state from store**
   - Use useAuthStore hook
   - Destructure isAuthenticated
   - Destructure isLoading
   - No need for user data

6. **Set up routing hooks**
   - Use useRouter for programmatic navigation
   - This is Next.js App Router hook
   - Will redirect authenticated users

7. **Implement authentication check**
   - Create useEffect that runs when auth state changes
   - Check if not loading and IS authenticated
   - Redirect to home or specified path
   - Logged in users shouldn't see login page

8. **Handle loading state**
   - While isLoading is true, show loading component
   - Return null or minimal loading indicator
   - Prevent flash of content

9. **Handle authenticated state**
   - Show nothing during redirect
   - Return null to prevent content flash
   - Router will navigate to home

10. **Render children for guest users**
    - Only render children when NOT authenticated
    - Guest can access authentication pages
    - Unauthenticated state is confirmed

### Guest Guard Flow

```
Component          Check Auth           Decision             Action
Renders            State                Point                Taken
┌──────────┐      ┌──────────┐        ┌──────────┐        ┌──────────┐
│GuestGuard│      │ isLoading│        │ isAuth?  │        │ Redirect │
│ Mounts   │ ──>  │ isAuth?  │ ────>  │ Decision │ ────>  │ or Render│
│          │      │          │        │          │        │          │
└──────────┘      └──────────┘        └──────────┘        └──────────┘
                       │                    │                   │
                       │                    ├─> No ───> Render children
                       │                    │
                       │                    ├─> Yes ──> Redirect to home
                       │                    │
                       └─> Loading ─────────┴────────> Show loading
```

### Decision Tree

```
GuestGuard Logic
│
├─ Is Loading?
│  ├─ Yes → Show Loading Component
│  └─ No  → Continue
│
└─ Is Authenticated?
   ├─ Yes → Redirect to Home (Prevent Access)
   └─ No  → Render Children (Allow Access)
```

### State-Based Rendering (Inverse of AuthGuard)

| isLoading | isAuthenticated | Action |
|-----------|-----------------|--------|
| true | - | Show loading |
| false | true | Redirect to home |
| false | false | Render children |

### Guard Comparison

| Aspect | AuthGuard | GuestGuard |
|--------|-----------|------------|
| Purpose | Protect private routes | Protect guest-only routes |
| Redirect When | Not authenticated | IS authenticated |
| Redirect To | Login page | Home page |
| Use Cases | Profile, Orders, Checkout | Login, Register |

### Common Redirect Destinations

| From Page | Redirect To | Reason |
|-----------|-------------|--------|
| /account/login | / | Already logged in |
| /account/register | / | Already logged in |
| /account/forgot-password | / | Already logged in |

### Guard Usage Pattern

Wrap guest-only pages with GuestGuard:

Location: Authentication pages (login, register, forgot-password, reset-password)

The guard should be used in page.tsx files for authentication routes.

### Expected Outcome
- GuestGuard component created
- Checks authentication before rendering
- Redirects to home if authenticated
- Shows loading state during initialization
- Allows access only to non-authenticated users

### Verification Checklist
- [ ] GuestGuard.tsx created in guards directory
- [ ] 'use client' directive at top
- [ ] Accepts children and optional redirectTo prop
- [ ] Uses useAuthStore to access auth state
- [ ] Uses useRouter hook
- [ ] useEffect monitors auth state changes
- [ ] Redirects to home (or custom path) when authenticated
- [ ] Shows loading state while initializing
- [ ] Renders children only when NOT authenticated
- [ ] Default redirectTo is '/'
- [ ] TypeScript types are correct

---

## Task 16: Verify Auth Routes

### Overview
Verify the complete authentication system by testing all routes, guards, and state management. This final task ensures that all authentication flows work correctly, guards protect routes as expected, state persists across page loads, and the user experience is smooth. Perform manual testing and create a comprehensive test checklist.

### Dependencies
- Task 15: Create Guest Guard Component

### Instructions

1. **Set up test environment**
   - Ensure backend API is running
   - Frontend development server is running
   - Database has test tenant and user
   - Clear browser cookies and localStorage

2. **Test authentication routes**
   - Navigate to each auth route
   - Verify routes are accessible
   - Check layout renders correctly
   - Confirm navigation works

3. **Test login flow**
   - Navigate to /account/login
   - Enter valid credentials
   - Submit login form
   - Verify redirect to home or returnUrl
   - Check user is authenticated in store

4. **Test protected route access**
   - While logged in, navigate to protected route
   - Verify AuthGuard allows access
   - Confirm page content renders
   - Check no redirects occur

5. **Test guest guard behavior**
   - While logged in, try to access /account/login
   - Verify GuestGuard redirects to home
   - Confirm authentication pages are blocked
   - Test /account/register as well

6. **Test logout flow**
   - Click logout button or trigger logout
   - Verify redirect to login page
   - Check user is cleared from store
   - Confirm cookie is invalidated

7. **Test protected route protection**
   - After logout, try to access protected route
   - Verify AuthGuard redirects to login
   - Check returnUrl parameter is present
   - Confirm no access without authentication

8. **Test SSR hydration**
   - Login and refresh the page
   - Verify auth state persists
   - Check no flash of unauthenticated content
   - Confirm AuthProvider hydrates correctly

9. **Test session validation**
   - Login and wait or manually expire cookie
   - Navigate to protected route
   - Verify invalid session redirects to login
   - Check graceful error handling

10. **Test return URL flow**
    - Access protected route while logged out
    - Note the returnUrl parameter
    - Login with valid credentials
    - Verify redirect back to original route

11. **Test error states**
    - Try login with invalid credentials
    - Verify error message displays
    - Check store error state
    - Confirm user stays on login page

12. **Test loading states**
    - Observe loading indicators during login
    - Check guards show loading during init
    - Verify no content flash
    - Confirm smooth transitions

### Verification Test Checklist

#### Route Access Tests
- [ ] /account/login is accessible
- [ ] /account/register is accessible
- [ ] /account/forgot-password is accessible
- [ ] /account/reset-password is accessible
- [ ] Account layout renders on all routes

#### Login Flow Tests
- [ ] Login form accepts credentials
- [ ] Valid credentials authenticate user
- [ ] Invalid credentials show error
- [ ] Successful login redirects appropriately
- [ ] Auth store updated with user data
- [ ] Cookie is set by backend

#### AuthGuard Tests
- [ ] Protected routes require authentication
- [ ] Unauthenticated users redirected to login
- [ ] returnUrl parameter is set correctly
- [ ] Authenticated users can access protected routes
- [ ] No redirect for authenticated users
- [ ] Loading state shown during initialization

#### GuestGuard Tests
- [ ] Authenticated users redirected from login
- [ ] Authenticated users redirected from register
- [ ] Redirect goes to home page (or custom)
- [ ] Unauthenticated users can access auth pages
- [ ] Loading state shown during initialization

#### Logout Flow Tests
- [ ] Logout clears user from store
- [ ] Logout redirects to login page
- [ ] Backend session invalidated
- [ ] Accessing protected route after logout redirects
- [ ] No user data remains in state

#### State Persistence Tests
- [ ] Auth state persists on page refresh
- [ ] AuthProvider hydrates state on mount
- [ ] Session validation works correctly
- [ ] Invalid session clears auth state
- [ ] No flash of unauthenticated content

#### Return URL Tests
- [ ] returnUrl captured when accessing protected route
- [ ] Login redirects to returnUrl after success
- [ ] returnUrl works with deep nested routes
- [ ] No returnUrl for direct login access

#### Error Handling Tests
- [ ] Network errors handled gracefully
- [ ] Invalid credentials show clear error
- [ ] Server errors don't break application
- [ ] Error messages are user-friendly
- [ ] Errors clear on new login attempt

#### Loading States Tests
- [ ] Login shows loading during API call
- [ ] AuthGuard shows loading during init
- [ ] GuestGuard shows loading during init
- [ ] AuthProvider doesn't flash content
- [ ] Loading states have proper UI

### Test Scenarios Matrix

| Scenario | Expected Behavior | Verification |
|----------|-------------------|--------------|
| Guest → Login | Access granted | GuestGuard allows |
| Guest → Protected | Redirect to login | AuthGuard blocks |
| Auth → Login | Redirect to home | GuestGuard blocks |
| Auth → Protected | Access granted | AuthGuard allows |
| Auth → Logout → Protected | Redirect to login | AuthGuard blocks |
| Guest → Login → Protected | Access granted | Full flow works |

### Authentication Flow Diagram

```
Guest User          Login             Authenticated      Logout
Initial State       Success           State              Back to Guest
┌──────────┐       ┌──────────┐      ┌──────────┐      ┌──────────┐
│ Can:     │       │ API      │      │ Can:     │      │ Session  │
│ - Login  │ ───>  │ Success  │ ──>  │ - Profile│ ──>  │ Cleared  │
│ - Regist.│       │ Cookie   │      │ - Orders │      │          │
│          │       │ Set      │      │ - Logout │      │          │
│ Cannot:  │       └──────────┘      │          │      │ Cannot:  │
│ - Profile│            │            │ Cannot:  │      │ - Profile│
│ - Orders │            │            │ - Login  │      │ - Orders │
└──────────┘            v            │ - Regist.│      └──────────┘
                   Store Updated     └──────────┘           │
                   Redirect Applied       │                 v
                                          v            Store Cleared
                                   Guards Applied      Redirect to Login
```

### Expected Outcome
- All authentication flows verified working
- Guards correctly protect routes
- State management functions properly
- User experience is smooth and error-free
- Documentation of any issues found

### Verification Checklist
- [ ] All route access tests passed
- [ ] Login flow works correctly
- [ ] Logout flow works correctly
- [ ] AuthGuard protects routes
- [ ] GuestGuard redirects authenticated users
- [ ] State persists across page loads
- [ ] Return URL flow works
- [ ] Error states handled gracefully
- [ ] Loading states display properly
- [ ] No console errors or warnings
- [ ] Cookie handling works correctly
- [ ] Session validation functions
- [ ] Documentation updated with findings

---

## Summary

This document covered the implementation of Zustand store actions, authentication guards, and verification of the complete authentication system:

- **Task 09**: Created comprehensive AuthState type definition
- **Task 10**: Implemented login action with API integration
- **Task 11**: Implemented logout action with graceful error handling
- **Task 12**: Created simple setUser action for state updates
- **Task 13**: Built AuthProvider for SSR hydration
- **Task 14**: Created AuthGuard for route protection
- **Task 15**: Created GuestGuard for guest-only routes
- **Task 16**: Verified complete authentication system

The authentication system is now complete with proper state management, route protection, and user experience considerations. The next group will implement the UI components for login, registration, and password management forms.

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Next Review:** Phase 08 - SubPhase 08 - Group B
