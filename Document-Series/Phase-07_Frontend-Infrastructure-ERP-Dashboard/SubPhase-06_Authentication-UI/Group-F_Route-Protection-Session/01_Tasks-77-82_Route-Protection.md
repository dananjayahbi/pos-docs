# Tasks 77-82: Route Protection

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** F - Route Protection & Session  
> **Document:** 01 of 02  
> **Tasks Covered:** 77, 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-83-86_Session-Management.md](02_Tasks-83-86_Session-Management.md)

---

## Document Overview

This document covers the implementation of route protection mechanisms for the LankaCommerce Cloud ERP system. It includes creating a ProtectedRoute component that wraps authenticated pages, implementing authentication checking logic, handling redirects to login for unauthenticated users, storing intended URLs for post-login navigation, creating permission-based access control, and building an unauthorized (403) page for users lacking required permissions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create ProtectedRoute Component | Medium | 35 min |
| 78 | Implement Auth Check Logic | Low | 20 min |
| 79 | Implement Redirect to Login | Low | 15 min |
| 80 | Store Intended URL | Low | 15 min |
| 81 | Create Permission Check | Medium | 30 min |
| 82 | Create Unauthorized Page | Low | 25 min |

---

## Task 77: Create ProtectedRoute Component

### Overview
Create the ProtectedRoute component that serves as a Higher-Order Component (HOC) or wrapper to protect authenticated routes. This component checks if users are authenticated and have the required permissions before rendering protected content. It acts as a security boundary for all authenticated pages in the ERP system.

### Dependencies
- Task 30: Update Login Submission (from Group B)
- Auth store from SubPhase-05 (Authentication State Management)

### Instructions

1. **Create component directory**
   - Navigate to `frontend/components/auth/` directory
   - Create new file named `ProtectedRoute.tsx`
   - This will be a client component

2. **Define component props interface**
   - Create TypeScript interface for component props
   - Include children prop for wrapped content
   - Add optional requiredPermissions prop (array of permission strings)
   - Add optional requireAll prop (boolean) for permission logic
   - Add optional fallback prop for custom loading component

3. **Import required dependencies**
   - Import React and ReactNode types
   - Import useRouter and usePathname from Next.js navigation
   - Import useEffect and useState hooks
   - Import auth store (useAuthStore)
   - Import loading component or spinner

4. **Create component structure**
   - Define functional component with props
   - Mark as 'use client' directive at top
   - Set up component return structure

5. **Initialize component state**
   - Create isChecking state to track auth verification
   - Initialize router instance for redirects
   - Get current pathname for URL storage
   - Access auth store for user data

6. **Set up component mounting logic**
   - Add useEffect hook that runs on mount
   - This will trigger auth check process
   - Dependency array should include auth state

7. **Implement component return logic**
   - If isChecking is true, show loading state
   - If authenticated and authorized, render children
   - If not authenticated, show loading (redirect in Task 78-79)
   - If not authorized, show loading (redirect in Task 81-82)

### Component Structure

```
ProtectedRoute Component:
├── Props Interface
│   ├── children: ReactNode
│   ├── requiredPermissions?: string[]
│   ├── requireAll?: boolean
│   └── fallback?: ReactNode
│
├── Component Logic
│   ├── Auth state access
│   ├── Router for navigation
│   ├── Pathname for URL storage
│   └── Checking state
│
└── Render Logic
    ├── Loading State (checking)
    ├── Authenticated + Authorized → Render children
    ├── Not Authenticated → Redirect to login
    └── Not Authorized → Redirect to unauthorized
```

### Props Interface

| Prop | Type | Required | Default | Purpose |
|------|------|----------|---------|---------|
| children | ReactNode | Yes | - | Content to protect |
| requiredPermissions | string[] | No | [] | Required permission codes |
| requireAll | boolean | No | false | Require all perms vs any |
| fallback | ReactNode | No | default spinner | Custom loading component |

### Permission Logic Modes

| Mode | Logic | Example |
|------|-------|---------|
| requireAll: false | User needs ANY permission from list | ["view_products", "edit_products"] → needs either |
| requireAll: true | User needs ALL permissions from list | ["view_reports", "export_data"] → needs both |

### Component States

| State | Condition | Render |
|-------|-----------|--------|
| Checking | isChecking === true | Loading spinner |
| Authenticated | isAuthenticated && hasPermission | Children (protected content) |
| Unauthenticated | !isAuthenticated | Redirect to login |
| Unauthorized | isAuthenticated && !hasPermission | Redirect to 403 page |

### Usage Examples

```
Example 1 - Basic Protection (Auth Only):
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

Example 2 - With Single Permission:
<ProtectedRoute requiredPermissions={["view_products"]}>
  <ProductsPage />
</ProtectedRoute>

Example 3 - Multiple Permissions (Any):
<ProtectedRoute 
  requiredPermissions={["view_orders", "manage_orders"]}
  requireAll={false}
>
  <OrdersPage />
</ProtectedRoute>

Example 4 - Multiple Permissions (All):
<ProtectedRoute 
  requiredPermissions={["view_reports", "export_data"]}
  requireAll={true}
>
  <AdvancedReportsPage />
</ProtectedRoute>

Example 5 - Custom Loading Fallback:
<ProtectedRoute fallback={<CustomSpinner />}>
  <SettingsPage />
</ProtectedRoute>
```

### Loading State Component

| Element | Purpose |
|---------|---------|
| Container | Centered full-screen container |
| Spinner | Loading animation |
| Text | "Verifying access..." (optional) |
| Min Height | Full viewport height |

### Expected Outcome
- Functional ProtectedRoute component
- TypeScript interface for type safety
- Props for flexible permission checking
- Clean loading states
- Ready for auth check implementation

### Verification Checklist
- [ ] ProtectedRoute.tsx file created
- [ ] Component marked as 'use client'
- [ ] Props interface defined with all properties
- [ ] children, requiredPermissions, requireAll props supported
- [ ] Auth store imported and accessed
- [ ] Router and pathname hooks imported
- [ ] isChecking state initialized
- [ ] Component returns loading state when checking
- [ ] Component structure ready for auth logic

---

## Task 78: Implement Auth Check Logic

### Overview
Implement the authentication checking logic within the ProtectedRoute component. This logic verifies whether the current user is authenticated by checking the auth store state and validates that the authentication token exists and is not expired before allowing access to protected content.

### Dependencies
- Task 77: Create ProtectedRoute Component

### Instructions

1. **Access auth store state**
   - Use useAuthStore to get authentication state
   - Extract isAuthenticated boolean
   - Extract isLoading state from auth store
   - Extract user object if available

2. **Create auth check effect**
   - Add useEffect hook for authentication verification
   - Run effect when component mounts or auth state changes
   - Set dependency array to include isAuthenticated and isLoading

3. **Implement check sequence**
   - First check if auth store is still loading
   - If loading, keep isChecking as true
   - If not loading, proceed with authentication check

4. **Check authentication status**
   - Verify isAuthenticated flag is true
   - Check if user object exists and has valid data
   - Verify accessToken exists in store or storage

5. **Validate token expiry**
   - Check if token has expiry information
   - Compare expiry time with current time
   - Mark as unauthenticated if token expired

6. **Handle authentication success**
   - If all checks pass, user is authenticated
   - Set isChecking to false
   - Allow component to proceed to permission check

7. **Handle authentication failure**
   - If any check fails, user is not authenticated
   - Set isChecking to false
   - Trigger redirect logic (Task 79)

8. **Add cleanup logic**
   - Return cleanup function from useEffect
   - Cancel any pending verification requests
   - Reset component state if unmounting

### Auth Check Flow Diagram

```
Component Mounts
    ↓
Check Auth Store Loading
    ↓
Is store loading?
    ├─ Yes → Keep isChecking = true → Wait
    └─ No → Proceed
        ↓
    Check isAuthenticated
        ↓
    Is authenticated?
        ├─ No → Set isChecking = false → Redirect to Login
        └─ Yes → Check User Object
            ↓
        User exists?
            ├─ No → Set isChecking = false → Redirect to Login
            └─ Yes → Check Access Token
                ↓
            Token exists?
                ├─ No → Set isChecking = false → Redirect to Login
                └─ Yes → Check Token Expiry
                    ↓
                Token valid?
                    ├─ No → Set isChecking = false → Redirect to Login
                    └─ Yes → Set isChecking = false → Proceed to Permission Check
```

### Authentication Checks

| Check | Purpose | Failure Action |
|-------|---------|----------------|
| Auth Store Loading | Wait for store initialization | Keep loading |
| isAuthenticated Flag | Verify auth state | Redirect to login |
| User Object Exists | Confirm user data loaded | Redirect to login |
| Access Token Exists | Verify token present | Redirect to login |
| Token Not Expired | Validate token freshness | Redirect to login |

### Auth Store State

| Property | Type | Purpose |
|----------|------|---------|
| isAuthenticated | boolean | Primary auth flag |
| isLoading | boolean | Store initialization state |
| user | User \| null | Current user data |
| accessToken | string \| null | JWT access token |
| tokenExpiry | number \| null | Token expiration timestamp |

### Token Expiry Validation

```
Token Expiry Check:
1. Get tokenExpiry from auth store
2. Get current timestamp: Date.now()
3. Compare: currentTime < tokenExpiry
4. If true → Token valid
5. If false → Token expired
6. If no expiry → Check token structure/decode JWT
```

### Edge Cases to Handle

| Scenario | Detection | Action |
|----------|-----------|--------|
| Store not initialized | isLoading === true | Show loading |
| No auth data | !user && !accessToken | Redirect to login |
| Token expired | currentTime >= tokenExpiry | Redirect to login |
| User logged out | isAuthenticated === false | Redirect to login |
| Concurrent logout | User changes during check | Re-run check |

### State Management

| State | Condition | Component State |
|-------|-----------|-----------------|
| Initial Load | Auth store loading | isChecking: true |
| Checking | Running verification | isChecking: true |
| Authenticated | All checks pass | isChecking: false, proceed |
| Not Authenticated | Any check fails | isChecking: false, redirect |

### UseEffect Dependencies

| Dependency | Reason |
|------------|--------|
| isAuthenticated | Re-check when auth state changes |
| isLoading | Re-check when loading completes |
| user | Re-check when user data updates |

### Expected Outcome
- Complete authentication verification logic
- Proper handling of loading states
- Token expiry validation
- Smooth transitions between states
- Reliable auth checking

### Verification Checklist
- [ ] useEffect for auth check implemented
- [ ] Auth store state accessed correctly
- [ ] isAuthenticated flag checked
- [ ] User object existence verified
- [ ] Access token existence verified
- [ ] Token expiry validation implemented
- [ ] isChecking state updated correctly
- [ ] Dependencies array includes all relevant state
- [ ] Loading state shown during check
- [ ] Edge cases handled properly

---

## Task 79: Implement Redirect to Login

### Overview
Implement the redirect logic that sends unauthenticated users to the login page when they attempt to access protected routes. This ensures that users must authenticate before accessing restricted areas of the application while providing a seamless user experience.

### Dependencies
- Task 78: Implement Auth Check Logic

### Instructions

1. **Import redirect utilities**
   - Import useRouter from 'next/navigation'
   - Import router.push method for navigation
   - Ensure Next.js Link component available if needed

2. **Add redirect logic to auth check**
   - In the useEffect auth check (Task 78)
   - After determining user is not authenticated
   - Before setting isChecking to false

3. **Prepare redirect URL**
   - Define login route: '/login'
   - Prepare query parameters if needed
   - Consider adding redirect parameter (Task 80)

4. **Implement redirect action**
   - Call router.push() with login URL
   - Pass replace option to prevent back button issues
   - Consider using router.replace() instead of push

5. **Add redirect delay (optional)**
   - Small delay before redirect (100-200ms)
   - Allows state updates to complete
   - Prevents race conditions

6. **Handle redirect feedback**
   - Keep loading state visible during redirect
   - Show brief message: "Redirecting to login..."
   - Prevent flash of unauthorized content

7. **Prevent component render**
   - Return null or loading component
   - Don't render children during redirect
   - Avoid showing protected content briefly

8. **Add redirect logging**
   - Log redirect action in development
   - Include current path for debugging
   - Don't log in production

### Redirect Flow

```
Auth Check Fails
    ↓
User Not Authenticated
    ↓
Prepare Login URL
    ↓
Add Current Path as Query Param (Task 80)
    ↓
Execute router.push() or router.replace()
    ↓
Show Loading State
    ↓
Navigate to Login Page
    ↓
User Sees Login Form
```

### Redirect Methods

| Method | Usage | Behavior |
|--------|-------|----------|
| router.push() | Standard navigation | Adds to history |
| router.replace() | Cleaner navigation | Replaces history entry |

### Recommended Method
Use `router.replace()` to prevent users from using the back button to return to a protected page without authentication.

### Redirect URL Structure

```
Basic Redirect:
/login

With Return URL (Task 80):
/login?returnUrl=/dashboard/products

With Multiple Params:
/login?returnUrl=/dashboard/products&reason=session_expired
```

### Redirect Timing

| Timing | Purpose |
|--------|---------|
| Immediate | Quick response |
| 100ms delay | Smooth state transition |
| With message | User feedback |

### Component Render During Redirect

```
During Redirect State:
┌─────────────────────────────────┐
│                                 │
│      [Loading Spinner]          │
│                                 │
│   Redirecting to login...       │
│                                 │
└─────────────────────────────────┘

OR

Show nothing (return null)
```

### Redirect Edge Cases

| Case | Handling |
|------|----------|
| Already on login page | Skip redirect |
| Redirect loop | Check for infinite redirects |
| Component unmounted | Cancel redirect |
| Network delay | Show loading until complete |

### Browser History Handling

```
With router.push():
User history: [Home] → [Dashboard] → [Login]
Back button: Returns to Dashboard (protected) ❌

With router.replace():
User history: [Home] → [Login]
Back button: Returns to Home ✓
```

### Expected Outcome
- Smooth redirect to login page
- No flash of protected content
- Clean browser history
- Proper loading state during transition
- Ready for returnUrl implementation

### Verification Checklist
- [ ] router imported from next/navigation
- [ ] Redirect logic added to auth check
- [ ] router.replace() used for cleaner history
- [ ] Redirect URL points to '/login'
- [ ] Loading state maintained during redirect
- [ ] No protected content visible during redirect
- [ ] Redirect works when accessing protected route directly
- [ ] Redirect works when session expires
- [ ] No redirect loop occurs
- [ ] Logging added for development

---

## Task 80: Store Intended URL

### Overview
Implement functionality to store the originally requested URL before redirecting unauthenticated users to the login page. After successful login, users will be redirected back to their intended destination, providing a seamless user experience and maintaining their workflow context.

### Dependencies
- Task 79: Implement Redirect to Login

### Instructions

1. **Choose storage mechanism**
   - Use sessionStorage for temporary storage
   - Preferred over localStorage for security
   - Automatically clears on browser/tab close
   - Scoped to current session

2. **Get current pathname**
   - Use usePathname hook from Next.js
   - Capture full current route path
   - Include dynamic route segments if present

3. **Capture query parameters**
   - Get current URL search params
   - Use useSearchParams hook or window.location.search
   - Preserve query string for complete URL

4. **Build complete URL**
   - Combine pathname and query parameters
   - Format as: pathname + search
   - Example: '/dashboard/products?category=electronics'

5. **Store intended URL**
   - Save to sessionStorage before redirect
   - Use key: 'intendedUrl' or 'returnUrl'
   - Store in redirect logic (Task 79)

6. **Add storage validation**
   - Check if URL is valid before storing
   - Exclude login/register routes from storage
   - Don't store public routes

7. **Implement URL retrieval**
   - Prepare for retrieval after login (in auth store)
   - Clear stored URL after successful redirect
   - Handle missing/invalid stored URLs

8. **Add fallback URL**
   - Define default redirect if no stored URL
   - Typically: '/dashboard' or '/home'
   - Use when returnUrl is invalid or missing

### URL Storage Flow

```
User Accesses Protected Route
    ↓
Auth Check Fails
    ↓
Capture Current Pathname
    ↓
Capture Query Parameters
    ↓
Build Complete URL
    ↓
Validate URL (not login/register)
    ↓
Store in sessionStorage
    ↓
Redirect to Login
    ↓
[User Logs In]
    ↓
Retrieve Stored URL
    ↓
Redirect to Intended URL
    ↓
Clear Stored URL
```

### Storage Implementation

| Aspect | Implementation |
|--------|----------------|
| Storage Type | sessionStorage |
| Storage Key | 'intendedUrl' |
| Value Format | Full path + query string |
| Lifetime | Current session |
| Security | Validate before redirect |

### Storage Key

```javascript
Storage Key: 'intendedUrl'
Example Value: '/dashboard/products?view=grid&sort=name'
```

### URL Validation

| Check | Purpose |
|-------|---------|
| Not login page | Prevent redirect loop |
| Not register page | Prevent redirect loop |
| Not public route | Only store protected routes |
| Valid path format | Prevent injection |
| Relative path | Security check |

### Routes to Exclude from Storage

| Route Pattern | Reason |
|---------------|--------|
| /login | Already at auth page |
| /register | Already at auth page |
| /forgot-password | Auth flow page |
| /reset-password | Auth flow page |
| /verify-email | Auth flow page |
| / (root) | Public page |

### Storage API

```
Store URL:
sessionStorage.setItem('intendedUrl', pathname + search)

Retrieve URL:
const returnUrl = sessionStorage.getItem('intendedUrl')

Clear URL:
sessionStorage.removeItem('intendedUrl')

Check Existence:
const hasReturnUrl = sessionStorage.getItem('intendedUrl') !== null
```

### Post-Login Redirect Logic

```
User Logs In Successfully
    ↓
Check sessionStorage for 'intendedUrl'
    ↓
URL Found?
    ├─ Yes → Validate URL
    │   ↓
    │   Valid?
    │   ├─ Yes → Redirect to stored URL
    │   └─ No → Redirect to default (/dashboard)
    │
    └─ No → Redirect to default (/dashboard)
        ↓
    Clear 'intendedUrl' from sessionStorage
```

### Example Scenarios

| Scenario | Intended URL | Post-Login Redirect |
|----------|--------------|---------------------|
| Direct access to products | /dashboard/products | /dashboard/products |
| Products with filters | /dashboard/products?category=food | /dashboard/products?category=food |
| Deep nested route | /dashboard/orders/12345/edit | /dashboard/orders/12345/edit |
| From login page | /login | /dashboard (default) |
| From public page | / | /dashboard (default) |

### Security Considerations

| Concern | Mitigation |
|---------|------------|
| Open redirect vulnerability | Validate URL is relative path |
| XSS through URL | Sanitize stored URL |
| Unauthorized access | Re-check permissions after redirect |
| External URL injection | Reject absolute URLs |

### Fallback Default Routes

| User Type | Default Redirect |
|-----------|------------------|
| Admin | /dashboard |
| Manager | /dashboard |
| Cashier | /pos |
| Regular User | /dashboard |

### Expected Outcome
- Intended URL stored before redirect
- Seamless return after authentication
- Secure URL validation
- Clean sessionStorage usage
- Improved user experience

### Verification Checklist
- [ ] sessionStorage used for URL storage
- [ ] Current pathname captured correctly
- [ ] Query parameters included in stored URL
- [ ] URL stored before redirect to login
- [ ] Login/register routes excluded from storage
- [ ] URL validation implemented
- [ ] Retrieval logic prepared for auth store
- [ ] Clear URL after successful redirect
- [ ] Fallback default URL defined
- [ ] No open redirect vulnerability
- [ ] Works with direct route access
- [ ] Works with session expiry

---

## Task 81: Create Permission Check

### Overview
Implement permission checking logic within the ProtectedRoute component to verify if the authenticated user has the required permissions to access specific routes. This implements Role-Based Access Control (RBAC) by checking user permissions against route requirements and supporting both "require all" and "require any" permission modes.

### Dependencies
- Task 77: Create ProtectedRoute Component

### Instructions

1. **Access user permissions**
   - Get user object from auth store
   - Extract permissions array from user object
   - Handle cases where permissions might be undefined or null

2. **Create permission check function**
   - Define helper function: hasRequiredPermissions()
   - Accept parameters: userPermissions, requiredPermissions, requireAll
   - Return boolean indicating permission status

3. **Implement "require any" logic**
   - Default mode when requireAll is false
   - Check if user has ANY permission from required list
   - Use Array.some() method for checking

4. **Implement "require all" logic**
   - Active when requireAll prop is true
   - Check if user has ALL permissions from required list
   - Use Array.every() method for checking

5. **Handle empty permission requirements**
   - If requiredPermissions is empty or undefined
   - Allow access (no specific permissions needed)
   - Only authentication is required

6. **Handle missing user permissions**
   - If user has no permissions array
   - Treat as empty permissions
   - Deny access to permission-protected routes

7. **Add permission check to component logic**
   - Call permission check after authentication check
   - Before rendering children
   - Set authorization state based on result

8. **Implement check caching**
   - Use useMemo to cache permission check result
   - Recompute only when dependencies change
   - Dependencies: user permissions, required permissions

### Permission Check Flow

```
User Authenticated
    ↓
Get Required Permissions
    ↓
Required Permissions Empty?
    ├─ Yes → Allow Access (Auth Only)
    └─ No → Check User Permissions
        ↓
    Get User Permissions Array
        ↓
    User Has Permissions?
        ├─ No → Deny Access → Redirect to 403
        └─ Yes → Check Mode
            ↓
        requireAll = true?
            ├─ Yes → Check ALL Permissions
            │   ↓
            │   Has All?
            │   ├─ Yes → Allow Access
            │   └─ No → Deny Access → Redirect to 403
            │
            └─ No → Check ANY Permission
                ↓
                Has Any?
                ├─ Yes → Allow Access
                └─ No → Deny Access → Redirect to 403
```

### Permission Check Logic

| Mode | Logic | Code Pattern |
|------|-------|--------------|
| Require Any | User needs at least one permission | requiredPermissions.some(p => userPermissions.includes(p)) |
| Require All | User needs all permissions | requiredPermissions.every(p => userPermissions.includes(p)) |

### Permission Scenarios

| Scenario | User Permissions | Required Permissions | requireAll | Result |
|----------|------------------|---------------------|------------|--------|
| Has one needed | ["view_products"] | ["view_products", "edit_products"] | false | ✓ Allow |
| Has all needed | ["view_products", "edit_products"] | ["view_products", "edit_products"] | true | ✓ Allow |
| Missing one | ["view_products"] | ["view_products", "edit_products"] | true | ✗ Deny |
| Has none | ["view_orders"] | ["view_products", "edit_products"] | false | ✗ Deny |
| Empty requirements | ["view_products"] | [] | - | ✓ Allow |
| Admin wildcard | ["*"] or ["admin"] | ["view_products"] | - | ✓ Allow |

### Permission Array Structure

```
User Object:
{
  id: "user_123",
  email: "user@example.com",
  name: "John Doe",
  permissions: [
    "view_products",
    "edit_products",
    "view_orders",
    "create_orders"
  ]
}
```

### Permission Check Function

```
Function Signature:
hasRequiredPermissions(
  userPermissions: string[],
  requiredPermissions: string[],
  requireAll: boolean = false
): boolean

Return Values:
- true: User has required permissions
- false: User lacks required permissions
```

### Permission Check Implementation Modes

#### Mode 1: Require Any (Default)
User needs at least ONE permission from the list.

| Use Case | Example |
|----------|---------|
| View OR Edit | ["view_products", "edit_products"] |
| Multiple roles | ["cashier", "manager", "admin"] |
| Flexible access | ["view_reports", "view_analytics"] |

#### Mode 2: Require All
User needs ALL permissions from the list.

| Use Case | Example |
|----------|---------|
| Complex operations | ["view_reports", "export_data"] |
| Multiple checks | ["manage_users", "view_audit_log"] |
| Restricted features | ["admin", "super_admin"] |

### Edge Cases

| Case | Handling |
|------|---------|
| No user permissions | Treat as empty array, fail permission check |
| Undefined permissions | Treat as empty array |
| Empty required permissions | Allow access (auth only) |
| Null required permissions | Allow access (auth only) |
| Wildcard permission (*) | Allow all access |
| Super admin role | Allow all access |

### Admin/Super Admin Handling

```
Check for Admin Privileges:
1. Check for "*" (wildcard) permission
2. Check for "admin" permission
3. Check for "super_admin" permission
4. If any found: Allow access to all routes
```

### Performance Optimization

| Technique | Purpose |
|-----------|---------|
| useMemo | Cache permission check result |
| Early return | Return true for empty requirements |
| Short-circuit | Use .some() and .every() efficiently |

### Authorization States

| State | Condition | Action |
|-------|-----------|--------|
| Authorized | Has required permissions | Render children |
| Unauthorized | Lacks required permissions | Redirect to 403 |
| No Requirements | requiredPermissions empty | Render children |
| Checking | Auth check in progress | Show loading |

### Expected Outcome
- Functional permission checking logic
- Support for "any" and "all" modes
- Proper handling of edge cases
- Efficient performance with caching
- Ready for unauthorized page redirect

### Verification Checklist
- [ ] Permission check function implemented
- [ ] User permissions extracted from auth store
- [ ] "Require any" logic implemented with .some()
- [ ] "Require all" logic implemented with .every()
- [ ] Empty permissions array handled correctly
- [ ] Undefined/null permissions handled
- [ ] Empty required permissions allow access
- [ ] useMemo used for performance optimization
- [ ] Admin/wildcard permissions handled
- [ ] Permission check integrated into component logic
- [ ] Unauthorized state triggers redirect

---

## Task 82: Create Unauthorized Page

### Overview
Create a dedicated unauthorized (403) page that displays when authenticated users attempt to access routes they don't have permissions for. This page provides clear feedback about access denial, explains why access was denied, and offers navigation options to return to accessible areas of the application.

### Dependencies
- Task 81: Create Permission Check

### Instructions

1. **Create unauthorized route**
   - Navigate to `frontend/app/(auth)/` directory
   - Create `unauthorized/` directory
   - Create `page.tsx` file inside

2. **Define page metadata**
   - Export metadata object with type Metadata
   - Set title: "Access Denied - 403"
   - Set description for clarity

3. **Import required components**
   - Import Link from Next.js
   - Import Button component from Shadcn/UI
   - Import icon library (ShieldX, Lock, or AlertTriangle)
   - Import auth layout components if needed

4. **Create page component**
   - Define UnauthorizedPage component
   - Mark as default export
   - Can be server component (no client state needed)

5. **Design page structure**
   - Create centered container
   - Add error status code display (403)
   - Add icon representing access denial
   - Add primary heading
   - Add descriptive message
   - Add action buttons

6. **Add status code display**
   - Show "403" prominently
   - Use large, bold typography
   - Muted color (gray)
   - Position above main heading

7. **Add access denied icon**
   - Use ShieldX, Lock, or similar icon
   - Large size (64x64px or similar)
   - Muted color to match design
   - Center aligned

8. **Create main heading**
   - Text: "Access Denied" or "Insufficient Permissions"
   - Large, bold typography
   - High contrast color
   - Center aligned

9. **Add descriptive message**
   - Explain why access was denied
   - Mention insufficient permissions
   - Suggest contacting administrator
   - Keep tone professional and helpful

10. **Add action buttons**
    - Primary button: "Go to Dashboard"
    - Secondary button: "Contact Support" (optional)
    - Link to accessible page
    - Center aligned

11. **Implement responsive design**
    - Mobile-friendly layout
    - Appropriate spacing on all screens
    - Readable text sizes
    - Touch-friendly button sizes

12. **Add page styling**
    - Full viewport height centering
    - Clean, minimal design
    - Consistent with auth pages
    - Subtle background or none

### Page Structure

```
┌────────────────────────────────────────┐
│                                        │
│                 403                    │
│                                        │
│          [Shield X Icon]               │
│                                        │
│          Access Denied                 │
│                                        │
│   You don't have permission to         │
│   access this resource. Please         │
│   contact your administrator if        │
│   you believe this is an error.        │
│                                        │
│      ┌──────────────────────┐          │
│      │  Go to Dashboard     │          │
│      └──────────────────────┘          │
│                                        │
│         Contact Support                │
│                                        │
└────────────────────────────────────────┘
```

### Page Metadata

| Field | Value |
|-------|-------|
| title | "Access Denied - 403" |
| description | "You don't have permission to access this resource" |

### Content Elements

| Element | Content | Purpose |
|---------|---------|---------|
| Status Code | "403" | HTTP status identifier |
| Icon | Shield with X or Lock | Visual representation |
| Heading | "Access Denied" | Clear error statement |
| Message | Explanation text | Context and guidance |
| Primary Action | "Go to Dashboard" | Return to safe area |
| Secondary Action | "Contact Support" | Get help |

### Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Status Code | 6xl | 700 | Muted gray |
| Icon | 64px | - | Muted gray |
| Heading | 3xl | 700 | High contrast |
| Message | base | 400 | Medium gray |
| Button Text | base | 500 | White (on primary) |

### Color Scheme

| Element | Tailwind Class | Purpose |
|---------|---------------|---------|
| Status Code | `text-gray-400` | De-emphasized |
| Icon | `text-gray-400` | Matches status |
| Heading | `text-gray-900` | High visibility |
| Message | `text-gray-600` | Readable secondary |
| Container | `bg-white` or transparent | Clean background |

### Button Configuration

| Button | Type | Link | Purpose |
|--------|------|------|---------|
| Go to Dashboard | Primary | /dashboard | Main action |
| Contact Support | Link/Secondary | /support or mailto | Optional help |

### Layout Specifications

| Aspect | Value | Purpose |
|--------|-------|---------|
| Container Height | min-h-screen | Full viewport |
| Content Max Width | max-w-md | Comfortable reading |
| Padding | px-4 py-8 | Breathing room |
| Gap Between Elements | space-y-6 | Visual hierarchy |
| Alignment | items-center text-center | Centered design |

### Message Variations

| User Type | Message |
|-----------|---------|
| Regular User | "You don't have permission to access this resource. Please contact your administrator if you believe this is an error." |
| After Logout | "You don't have permission to access this resource. Please log in with appropriate credentials." |
| Guest User | "This resource requires special permissions. Please contact your system administrator." |

### Action Button Routing

| User Type | Primary Button Destination |
|-----------|---------------------------|
| Admin | /dashboard |
| Manager | /dashboard |
| Cashier | /pos |
| Unknown | /dashboard |

### Responsive Breakpoints

| Screen Size | Adjustments |
|-------------|-------------|
| Mobile (< 640px) | Smaller text, compact spacing |
| Tablet (640-1024px) | Standard sizing |
| Desktop (> 1024px) | Standard sizing, max-width container |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Semantic HTML | Use proper heading hierarchy |
| Alt Text | Describe icon meaning |
| Color Contrast | WCAG AA minimum (4.5:1) |
| Focus Indicators | Visible button focus states |
| Screen Readers | Descriptive text for all elements |

### Expected Outcome
- Professional 403 error page
- Clear explanation of access denial
- Helpful navigation options
- Consistent with app design
- Mobile responsive layout

### Verification Checklist
- [ ] unauthorized/page.tsx created
- [ ] Page metadata defined
- [ ] 403 status code displayed prominently
- [ ] Access denied icon shown
- [ ] Clear "Access Denied" heading
- [ ] Descriptive message explaining issue
- [ ] "Go to Dashboard" button implemented
- [ ] Contact support option included
- [ ] Page is mobile responsive
- [ ] Typography follows design system
- [ ] Colors meet contrast requirements
- [ ] Button links to correct route
- [ ] Page accessible at /unauthorized
- [ ] Focus states visible
- [ ] Page renders correctly on all screen sizes

---

## Summary

This document established the complete route protection infrastructure for the LankaCommerce Cloud ERP system. The ProtectedRoute component serves as a security boundary for authenticated routes, implementing both authentication checks and permission-based access control. The system stores intended URLs for seamless post-login navigation and provides a professional unauthorized page for access denial scenarios.

### Completed Tasks
77. ✓ Created ProtectedRoute HOC component with props interface
78. ✓ Implemented comprehensive auth check logic with token validation
79. ✓ Implemented redirect to login for unauthenticated users
80. ✓ Implemented intended URL storage using sessionStorage
81. ✓ Created permission check with "require all" and "require any" modes
82. ✓ Created professional unauthorized (403) page with navigation

### Key Features Implemented
- HOC/wrapper pattern for route protection
- Authentication state verification
- Token expiry validation
- Seamless login redirects with return URL
- RBAC with flexible permission checking
- Professional error pages

### Next Steps
Proceed to [02_Tasks-83-86_Session-Management.md](02_Tasks-83-86_Session-Management.md) to implement session expiry detection, create session expiry modal, implement auto-logout functionality, and perform comprehensive final testing of all authentication flows.
