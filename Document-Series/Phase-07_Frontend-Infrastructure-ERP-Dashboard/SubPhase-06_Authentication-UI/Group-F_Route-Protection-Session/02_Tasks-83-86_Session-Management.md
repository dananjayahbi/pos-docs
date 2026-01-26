# Tasks 83-86: Session Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** F - Route Protection & Session  
> **Document:** 02 of 02  
> **Tasks Covered:** 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-77-82_Route-Protection.md](01_Tasks-77-82_Route-Protection.md)

---

## Document Overview

This document covers session management, session expiry handling, and final comprehensive testing of all authentication flows. It includes detecting session expiry through token monitoring and API responses, creating a modal to notify users of expired sessions, implementing automatic logout when sessions expire, and performing thorough end-to-end testing of all authentication features to ensure system reliability and security.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Implement Session Expiry Handling | Medium | 40 min |
| 84 | Create Session Expiry Modal | Low | 25 min |
| 85 | Implement Auto Logout | Low | 20 min |
| 86 | Final Verification & Testing | Low | 45 min |

---

## Task 83: Implement Session Expiry Handling

### Overview
Implement comprehensive session expiry detection and handling mechanisms to monitor token expiration, detect expired sessions through API responses, and trigger appropriate actions when sessions expire. This ensures users are promptly notified when their authentication expires and prevents security issues from stale sessions.

### Dependencies
- Task 77: Create ProtectedRoute Component
- Auth service from SubPhase-05

### Instructions

1. **Create session monitor utility**
   - Navigate to `frontend/lib/utils/` directory
   - Create `sessionMonitor.ts` file
   - This will contain session monitoring logic

2. **Implement token expiry checker**
   - Create function: checkTokenExpiry()
   - Get token expiry from auth store
   - Compare with current timestamp
   - Return expiry status (valid, expired, expiring soon)

3. **Calculate time until expiry**
   - Create function: getTimeUntilExpiry()
   - Return milliseconds until token expires
   - Use for scheduling checks and warnings

4. **Set up periodic expiry checks**
   - Use setInterval to check token expiry
   - Run check every 1 minute
   - Clear interval on component unmount

5. **Detect expiry warning threshold**
   - Check if token expires in < 5 minutes
   - Trigger warning state
   - Show modal prompting refresh (Task 84)

6. **Implement API interceptor for 401 responses**
   - Add response interceptor to API client
   - Detect 401 Unauthorized responses
   - Trigger session expiry handling
   - Attempt token refresh if refresh token valid

7. **Create session expiry event**
   - Define custom event: 'session-expired'
   - Dispatch when expiry detected
   - Listen for event in app layout or provider

8. **Implement token refresh logic**
   - Check if refresh token exists and is valid
   - Call refresh token API endpoint
   - Update auth store with new tokens
   - If refresh fails, trigger logout

9. **Add expiry state to auth store**
   - Add isSessionExpired flag
   - Add sessionExpiryDetected action
   - Update state when expiry detected

10. **Create useSessionMonitor hook**
    - Custom hook for session monitoring
    - Use in main layout or app wrapper
    - Return session status and actions

### Session Expiry Detection Flow

```
Session Monitoring Active
    │
    ├─ Periodic Check (Every 1 min)
    │   ↓
    │   Check Token Expiry Time
    │   ↓
    │   Time Until Expiry?
    │   ├─ > 5 min → Continue monitoring
    │   ├─ < 5 min → Show warning modal
    │   └─ Expired → Trigger session expired
    │
    └─ API Response Interceptor
        ↓
        Response Status = 401?
        ↓
        Yes → Session Expired Detected
        ↓
        Has Refresh Token?
        ├─ Yes → Attempt Token Refresh
        │   ↓
        │   Refresh Success?
        │   ├─ Yes → Update tokens, continue
        │   └─ No → Trigger logout
        │
        └─ No → Trigger logout
            ↓
        Show Session Expiry Modal
            ↓
        Auto Logout (Task 85)
```

### Session States

| State | Condition | Action |
|-------|-----------|--------|
| Active | Token valid, > 5 min remaining | Normal operation |
| Expiring Soon | Token valid, < 5 min remaining | Show warning modal |
| Expired | Token expiry time passed | Show expiry modal, logout |
| Refresh in Progress | Attempting token refresh | Show loading |
| Refresh Failed | Token refresh failed | Trigger logout |

### Token Expiry Calculation

```
Token Expiry Check:

Given:
- tokenExpiry: 1706184000000 (Unix timestamp in ms)
- currentTime: 1706180400000 (Current Unix timestamp)

Calculate:
- timeUntilExpiry = tokenExpiry - currentTime
- timeUntilExpiry = 3600000 ms (1 hour)

Status:
- If timeUntilExpiry > 300000 (5 min): Active
- If 0 < timeUntilExpiry <= 300000: Expiring Soon
- If timeUntilExpiry <= 0: Expired
```

### Expiry Thresholds

| Threshold | Time Remaining | Action |
|-----------|----------------|--------|
| Warning | < 5 minutes | Show warning modal with "Extend Session" option |
| Critical | < 1 minute | Show urgent modal |
| Expired | 0 or negative | Immediate logout |

### API Interceptor Setup

```
API Response Flow:

Request → Backend API
    ↓
Response Received
    ↓
Status Code Check
    ↓
401 Unauthorized?
    ├─ Yes → Intercept Response
    │   ↓
    │   Extract Error Details
    │   ↓
    │   Error Code = "token_expired"?
    │   ↓
    │   Attempt Token Refresh
    │   ↓
    │   Refresh Success?
    │   ├─ Yes → Retry Original Request
    │   └─ No → Trigger Session Expired
    │
    └─ No → Pass Response Through
```

### Session Monitoring Hook Structure

```
useSessionMonitor Hook:

Returns:
├── sessionStatus: 'active' | 'expiring' | 'expired'
├── timeUntilExpiry: number (milliseconds)
├── isRefreshing: boolean
└── actions:
    ├── refreshSession()
    ├── extendSession()
    └── handleExpiry()

Usage in App:
- Mount in root layout or app wrapper
- Listens for expiry events
- Triggers modals and logout
```

### Periodic Check Implementation

| Aspect | Value | Purpose |
|--------|-------|---------|
| Check Interval | 60000ms (1 min) | Regular monitoring |
| Warning Threshold | 300000ms (5 min) | Early warning |
| Cleanup | On unmount | Prevent memory leaks |

### Token Refresh Flow

```
Token Refresh Attempt:
1. Check if refresh token exists
2. Validate refresh token not expired
3. Call POST /api/auth/refresh with refresh token
4. Receive new access token and refresh token
5. Update auth store with new tokens
6. Update localStorage/cookies
7. Retry failed request
8. If refresh fails → Trigger logout
```

### Refresh Token API

| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| /api/auth/refresh | POST | { refreshToken: string } | { accessToken: string, refreshToken: string, expiresIn: number } |

### Event Handling

| Event | Trigger | Handler Action |
|-------|---------|----------------|
| session-expired | Token expired or 401 | Show expiry modal, logout |
| session-expiring | < 5 min remaining | Show warning modal |
| token-refreshed | Successful refresh | Update UI, continue |
| refresh-failed | Failed refresh | Logout immediately |

### Auth Store Updates

```
New Auth Store Properties:

State:
├── isSessionExpired: boolean
├── sessionExpiryTime: number | null
├── isRefreshingToken: boolean
└── lastActivityTime: number

Actions:
├── setSessionExpired(expired: boolean)
├── updateSessionExpiry(time: number)
├── setRefreshingToken(refreshing: boolean)
└── updateLastActivity()
```

### Session Activity Tracking

| Activity | Update Last Activity | Purpose |
|----------|---------------------|---------|
| Route navigation | Yes | Track user engagement |
| API calls | Yes | Active usage |
| User interaction | Yes | Form inputs, clicks |
| Idle time | No | Inactivity detection |

### Error Codes to Handle

| Error Code | Meaning | Action |
|------------|---------|--------|
| token_expired | Access token expired | Attempt refresh |
| refresh_token_expired | Refresh token expired | Immediate logout |
| invalid_token | Token malformed | Logout |
| token_revoked | Token revoked by admin | Logout |

### Expected Outcome
- Continuous session monitoring
- Automatic expiry detection
- Token refresh on 401 responses
- Event-based expiry handling
- Smooth user experience

### Verification Checklist
- [ ] sessionMonitor.ts utility created
- [ ] checkTokenExpiry() function implemented
- [ ] getTimeUntilExpiry() function implemented
- [ ] setInterval for periodic checks set up
- [ ] Warning threshold (5 min) implemented
- [ ] API response interceptor added
- [ ] 401 status code detection works
- [ ] Token refresh logic implemented
- [ ] Custom 'session-expired' event created
- [ ] Auth store updated with expiry state
- [ ] useSessionMonitor hook created
- [ ] Hook mounted in app layout
- [ ] Cleanup on unmount implemented
- [ ] Refresh token API call functional

---

## Task 84: Create Session Expiry Modal

### Overview
Create a modal component that displays when the user's session is about to expire or has expired. This modal informs users of the situation, provides options to extend their session or log in again, and maintains a professional, non-disruptive user experience during session management.

### Dependencies
- Task 83: Implement Session Expiry Handling

### Instructions

1. **Create modal component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `SessionExpiryModal.tsx` file
   - Mark as client component

2. **Import required dependencies**
   - Import Dialog components from Shadcn/UI
   - Import Button component
   - Import icon (Clock, AlertCircle, or Timer)
   - Import auth store for actions

3. **Define component props interface**
   - isOpen: boolean (controls visibility)
   - expiryType: 'warning' | 'expired'
   - timeRemaining: number (seconds)
   - onExtendSession: callback function
   - onLogout: callback function

4. **Create component structure**
   - Use Dialog component as wrapper
   - Add DialogContent for modal content
   - Add DialogHeader for title and icon
   - Add DialogDescription for message
   - Add DialogFooter for action buttons

5. **Design modal header**
   - Add appropriate icon based on expiry type
   - Warning: Clock icon (orange/yellow)
   - Expired: AlertCircle icon (red)
   - Add title text

6. **Create message content**
   - For warning: "Your session is about to expire"
   - Show remaining time countdown
   - Explain what will happen
   - For expired: "Your session has expired"

7. **Implement countdown timer**
   - Show remaining time in human-readable format
   - Update every second using useEffect
   - Format as "X minutes Y seconds" or "X seconds"
   - Only show for warning type

8. **Add action buttons**
   - Warning state: "Extend Session" (primary) and "Logout" (secondary)
   - Expired state: "Login Again" (primary)
   - Configure onClick handlers

9. **Implement extend session logic**
   - Call auth service to refresh token
   - Update auth store with new tokens
   - Close modal on success
   - Show error if extension fails

10. **Add modal styling**
    - Warning state: Yellow/orange accent color
    - Expired state: Red accent color
    - Ensure modal is not dismissible by clicking outside
    - Disable escape key to close (for expired state)

11. **Implement auto-logout countdown**
    - For expired state, show countdown to auto-logout
    - Default: 30 seconds before forced logout
    - Show in footer text

12. **Add accessibility features**
    - Proper ARIA labels
    - Focus trap in modal
    - Keyboard navigation support
    - Screen reader announcements

### Modal Structure - Warning State

```
┌──────────────────────────────────────┐
│  [Clock Icon]  Session Expiring      │
│                                      │
│  Your session is about to expire     │
│  in 4 minutes 32 seconds.            │
│                                      │
│  Please extend your session or       │
│  you will be automatically logged    │
│  out to protect your account.        │
│                                      │
│  ┌────────────────┐  ┌──────────┐  │
│  │ Extend Session │  │  Logout  │  │
│  └────────────────┘  └──────────┘  │
└──────────────────────────────────────┘
```

### Modal Structure - Expired State

```
┌──────────────────────────────────────┐
│  [Alert Icon]  Session Expired       │
│                                      │
│  Your session has expired for        │
│  security reasons.                   │
│                                      │
│  Please log in again to continue     │
│  using the application.              │
│                                      │
│  Auto logout in 25 seconds...        │
│                                      │
│      ┌──────────────────┐           │
│      │  Login Again     │           │
│      └──────────────────┘           │
└──────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Purpose |
|------|------|----------|---------|
| isOpen | boolean | Yes | Control modal visibility |
| expiryType | 'warning' \| 'expired' | Yes | Determine modal type |
| timeRemaining | number | No | Seconds until expiry |
| onExtendSession | () => void | Yes | Extend session handler |
| onLogout | () => void | Yes | Logout handler |

### Modal States

| State | Icon | Color | Title | Actions |
|-------|------|-------|-------|---------|
| Warning | Clock | Orange | "Session Expiring" | Extend Session, Logout |
| Expired | AlertCircle | Red | "Session Expired" | Login Again |

### Content Text Variants

| State | Message |
|-------|---------|
| Warning (>1 min) | "Your session is about to expire in X minutes Y seconds. Please extend your session or you will be automatically logged out." |
| Warning (<1 min) | "Your session is expiring in X seconds! Please extend your session immediately." |
| Expired | "Your session has expired for security reasons. Please log in again to continue using the application." |

### Countdown Timer Format

| Time Remaining | Format |
|----------------|--------|
| > 60 seconds | "X minutes Y seconds" |
| 10-60 seconds | "X seconds" |
| < 10 seconds | "X seconds" (red color) |

### Button Configuration

#### Warning State

| Button | Variant | Color | Action |
|--------|---------|-------|--------|
| Extend Session | Primary | Default (blue) | Call onExtendSession() |
| Logout | Secondary | Destructive (red) | Call onLogout() |

#### Expired State

| Button | Variant | Color | Action |
|--------|---------|-------|--------|
| Login Again | Primary | Default (blue) | Navigate to /login |

### Modal Behavior

| Aspect | Configuration | Reason |
|--------|---------------|--------|
| Close on Outside Click | Disabled for expired, enabled for warning | Prevent accidental dismissal |
| Close on Escape | Disabled for expired, enabled for warning | Force acknowledgment |
| Modal Priority | High z-index | Always visible |
| Animation | Smooth fade-in | Professional appearance |

### Styling Specifications

| Element | Warning State | Expired State |
|---------|---------------|---------------|
| Icon Color | `text-orange-500` | `text-red-500` |
| Icon Size | `w-6 h-6` | `w-6 h-6` |
| Title Size | `text-xl font-semibold` | `text-xl font-semibold` |
| Message Size | `text-base` | `text-base` |
| Message Color | `text-gray-700` | `text-gray-700` |
| Countdown Color | `text-orange-600` (warning) | `text-red-600` (expired) |

### Timer Implementation

```
Countdown Timer Logic:
1. Initialize with timeRemaining prop
2. Use useEffect with 1-second interval
3. Decrement timeRemaining every second
4. Format time display
5. When reaches 0 → Trigger auto-logout
6. Clear interval on unmount
```

### Auto-Logout Countdown

```
For Expired State:
- Show countdown: "Auto logout in X seconds..."
- Default duration: 30 seconds
- When countdown reaches 0:
  → Call onLogout() automatically
  → Redirect to login page
```

### Extend Session Flow

```
User Clicks "Extend Session"
    ↓
Show loading state on button
    ↓
Call authService.refreshToken()
    ↓
Success?
    ├─ Yes → Update auth store
    │   ↓
    │   Close modal
    │   ↓
    │   Show success toast (optional)
    │
    └─ No → Show error message
        ↓
        Keep modal open
        ↓
        Convert to "Expired" state
        ↓
        Trigger auto-logout
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | dialog |
| ARIA Label | "Session expiry notification" |
| ARIA Describedby | Message text ID |
| Focus Management | Auto-focus primary button |
| Keyboard Nav | Tab through buttons |
| Screen Reader | Announce modal opening |

### Event Triggers

| Trigger | Modal Type | Source |
|---------|-----------|--------|
| timeUntilExpiry < 5 min | Warning | Periodic check (Task 83) |
| 401 API response | Expired | API interceptor (Task 83) |
| Token expiry detected | Expired | Token validation (Task 83) |

### Expected Outcome
- Professional session expiry modal
- Clear warning before expiry
- Easy session extension
- Forced action on expiry
- Smooth user experience

### Verification Checklist
- [ ] SessionExpiryModal.tsx created
- [ ] Component marked as 'use client'
- [ ] Props interface defined
- [ ] Dialog component used from Shadcn/UI
- [ ] Warning state shows clock icon
- [ ] Expired state shows alert icon
- [ ] Countdown timer implemented
- [ ] Timer updates every second
- [ ] "Extend Session" button functional
- [ ] "Logout" button functional
- [ ] "Login Again" button redirects correctly
- [ ] Modal not dismissible on outside click (expired)
- [ ] Escape key disabled for expired state
- [ ] Auto-logout countdown shown
- [ ] Auto-logout triggers after countdown
- [ ] Proper ARIA attributes added
- [ ] Focus management works correctly
- [ ] Mobile responsive layout

---

## Task 85: Implement Auto Logout

### Overview
Implement automatic logout functionality that executes when a user's session expires. This ensures security by clearing all authentication data, resetting application state, and redirecting users to the login page with appropriate messaging. Auto-logout prevents security vulnerabilities from expired sessions remaining active.

### Dependencies
- Task 83: Implement Session Expiry Handling

### Instructions

1. **Create auto-logout function**
   - Add to auth store or session monitor utility
   - Define function: handleAutoLogout()
   - Accept optional reason parameter

2. **Clear authentication tokens**
   - Remove access token from auth store
   - Remove refresh token from auth store
   - Clear tokens from localStorage if stored
   - Clear cookies if using cookie-based auth

3. **Reset auth store state**
   - Set isAuthenticated to false
   - Clear user object
   - Clear permissions array
   - Reset all auth-related state

4. **Clear React Query cache**
   - Import queryClient instance
   - Call queryClient.clear() to remove cached data
   - Prevents stale data after re-login
   - Clears all user-specific cached data

5. **Clear sessionStorage data**
   - Remove intendedUrl if stored
   - Clear any session-specific data
   - Remove temporary auth data

6. **Clear localStorage data**
   - Remove persisted auth state if stored
   - Clear user preferences tied to session
   - Keep non-auth related preferences

7. **Reset application state**
   - Clear any global state stores
   - Reset navigation history if needed
   - Clear pending API requests

8. **Prepare logout message**
   - Set logout reason in state or URL param
   - Reasons: 'session_expired', 'manual_logout', 'forced_logout'
   - Use for displaying appropriate message on login page

9. **Navigate to login page**
   - Use Next.js router for navigation
   - Include reason query parameter
   - Example: '/login?reason=session_expired'
   - Use router.replace() to prevent back navigation

10. **Show logout notification**
    - Display toast or message on login page
    - Text: "Your session has expired. Please log in again."
    - Use query parameter to show message

11. **Log logout event**
    - Log auto-logout in console (development)
    - Send analytics event (optional)
    - Track logout reason for monitoring

12. **Handle concurrent requests**
    - Cancel any pending API requests
    - Abort ongoing fetch operations
    - Prevent errors from completing after logout

### Auto Logout Flow

```
Session Expiry Detected
    ↓
Call handleAutoLogout()
    ↓
Clear Access Token
    ↓
Clear Refresh Token
    ↓
Reset Auth Store State
    ├── isAuthenticated = false
    ├── user = null
    ├── permissions = []
    └── accessToken = null
    ↓
Clear React Query Cache
    ↓
Clear sessionStorage
    ├── Remove intendedUrl
    └── Remove session data
    ↓
Clear localStorage
    ├── Remove persisted auth
    └── Keep non-auth data
    ↓
Reset Global State
    ↓
Cancel Pending Requests
    ↓
Set Logout Reason
    ↓
Navigate to Login
    │
    └── /login?reason=session_expired
        ↓
    Show Expiry Message
        ↓
    User Sees Login Form
```

### Data Clearing Checklist

| Storage/State | Data to Clear | Method |
|---------------|---------------|--------|
| Auth Store | isAuthenticated, user, tokens | Reset to initial state |
| localStorage | Auth tokens, user data | removeItem() for each key |
| sessionStorage | intendedUrl, temp data | clear() or removeItem() |
| Cookies | Auth cookies (if used) | Set expiry to past date |
| React Query | All cached queries | queryClient.clear() |
| Global State | User-specific state | Reset to initial |

### Auth Store Reset

```
Reset Auth Store:

Before Logout:
{
  isAuthenticated: true,
  user: { id: "123", email: "user@example.com", ... },
  accessToken: "eyJhbGc...",
  refreshToken: "eyJhbGc...",
  permissions: ["view_products", "edit_orders"],
  tokenExpiry: 1706184000000
}

After Logout:
{
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  permissions: [],
  tokenExpiry: null
}
```

### Storage Clearing Implementation

#### localStorage Clearing

```
Keys to Remove:
- 'auth-storage' (Zustand persist)
- 'accessToken'
- 'refreshToken'
- 'user'
- Any other auth-related keys

Implementation:
1. localStorage.removeItem('auth-storage')
2. localStorage.removeItem('accessToken')
3. Or use localStorage.clear() if only auth data stored
```

#### sessionStorage Clearing

```
Keys to Remove:
- 'intendedUrl'
- 'sessionId'
- Any temporary session data

Implementation:
sessionStorage.clear() or selective removeItem()
```

### Logout Reasons

| Reason | Code | Message |
|--------|------|---------|
| Session Expired | 'session_expired' | "Your session has expired. Please log in again." |
| Token Expired | 'token_expired' | "Your login session has expired for security." |
| Manual Logout | 'manual_logout' | "You have been logged out successfully." |
| Forced Logout | 'forced_logout' | "You have been logged out by an administrator." |
| Inactivity | 'inactivity_timeout' | "You were logged out due to inactivity." |

### Login Page Message Display

```
Login Page Logic:

1. Check for 'reason' query parameter
2. Map reason to user-friendly message
3. Display message in alert or banner
4. Example URL: /login?reason=session_expired
5. Show: "Your session has expired. Please log in again."
6. Auto-dismiss after 5 seconds or on user interaction
```

### Navigation Configuration

| Aspect | Value | Reason |
|--------|-------|--------|
| Method | router.replace() | Prevent back button to protected page |
| URL | /login?reason=session_expired | Include logout reason |
| State Clearing | Before navigation | Clean state first |
| Loading State | Brief loading indicator | Smooth transition |

### Pending Request Handling

```
Cancel Pending Requests:

1. Axios: Use cancel tokens or AbortController
2. Fetch: Use AbortController.abort()
3. React Query: queryClient.cancelQueries()
4. Prevents:
   - Errors from completing after logout
   - State updates on unmounted components
   - Confusing error messages
```

### React Query Cleanup

```
Query Client Clearing:

// Clear all queries
queryClient.clear()

// Or selective clearing
queryClient.removeQueries({ queryKey: ['user'] })
queryClient.removeQueries({ queryKey: ['orders'] })
queryClient.removeQueries({ queryKey: ['products'] })

// Cancel in-flight queries
queryClient.cancelQueries()
```

### Analytics and Logging

| Event | Data | Purpose |
|-------|------|---------|
| auto_logout | reason, timestamp, userId | Track logout patterns |
| session_expired | timeRemaining, lastActivity | Monitor session lengths |
| logout_complete | duration, method | Performance tracking |

### Security Considerations

| Concern | Mitigation |
|---------|------------|
| Token remains valid | Backend invalidates on logout |
| Cached data visible | Clear all caches immediately |
| Browser back button | Use router.replace(), not push() |
| Concurrent sessions | Backend tracks session validity |

### Edge Cases

| Case | Handling |
|------|----------|
| Logout during API call | Cancel request, proceed with logout |
| Multiple tabs open | Use BroadcastChannel to sync logout |
| Logout during navigation | Complete logout, then navigate |
| Network offline | Clear local data, queue logout on backend |

### Multi-Tab Sync

```
Sync Logout Across Tabs:

1. Use BroadcastChannel API
2. Channel name: 'auth-channel'
3. On logout in one tab:
   - Send 'logout' message to channel
   - All tabs receive message
   - All tabs execute logout
4. Ensures consistent state across tabs
```

### Expected Outcome
- Complete session cleanup on expiry
- All auth data cleared securely
- Smooth redirect to login page
- Appropriate logout message shown
- No lingering authenticated state

### Verification Checklist
- [ ] handleAutoLogout() function created
- [ ] Access token cleared from auth store
- [ ] Refresh token cleared from auth store
- [ ] localStorage auth data removed
- [ ] sessionStorage cleared
- [ ] Cookies cleared if used
- [ ] Auth store reset to initial state
- [ ] React Query cache cleared
- [ ] Pending API requests cancelled
- [ ] Logout reason set correctly
- [ ] Navigation uses router.replace()
- [ ] Login page receives reason parameter
- [ ] Logout message displayed on login page
- [ ] No flash of protected content
- [ ] Multi-tab logout sync works
- [ ] Analytics event sent
- [ ] Console logging in development

---

## Task 86: Final Verification & Testing

### Overview
Perform comprehensive end-to-end testing of all authentication flows implemented in SubPhase-06. This includes testing login, registration, password reset, email verification, 2FA, route protection, and session management. Verify that all features work correctly individually and in combination, ensuring a secure and seamless authentication experience.

### Dependencies
- Task 85: Implement Auto Logout
- All previous tasks in SubPhase-06

### Instructions

1. **Set up testing environment**
   - Ensure backend API is running
   - Clear all browser storage before tests
   - Use incognito/private window for clean state
   - Prepare test user accounts

2. **Create testing checklist document**
   - List all authentication flows to test
   - Include expected outcomes
   - Track test results (pass/fail)
   - Document any issues found

3. **Test login flow**
   - Test successful login with valid credentials
   - Test login with invalid credentials
   - Test login with non-existent user
   - Test "remember me" functionality
   - Test password visibility toggle
   - Test form validation errors
   - Verify token storage after login
   - Verify redirect to dashboard
   - Verify redirect to intended URL

4. **Test registration flow**
   - Test successful registration
   - Test duplicate email error
   - Test password strength validation
   - Test password confirmation mismatch
   - Test terms acceptance requirement
   - Verify email verification trigger
   - Verify new user in database

5. **Test forgot password flow**
   - Test with registered email
   - Test with non-existent email
   - Verify reset email sent
   - Verify email contains reset link
   - Test reset link expiration
   - Test invalid reset token

6. **Test password reset flow**
   - Test successful password reset
   - Test password validation
   - Test expired token handling
   - Test already-used token
   - Verify old password invalidated
   - Verify login with new password

7. **Test email verification flow**
   - Test successful verification
   - Test expired verification token
   - Test invalid token
   - Test resend verification email
   - Verify account activated after verification

8. **Test 2FA setup flow**
   - Test QR code generation
   - Test TOTP code entry
   - Test invalid code rejection
   - Test backup codes generation
   - Verify 2FA enabled in user profile

9. **Test 2FA verification flow**
   - Test successful 2FA login
   - Test invalid TOTP code
   - Test backup code usage
   - Test "trust this device" option
   - Verify backup code invalidated after use

10. **Test route protection**
    - Test access to protected route without auth
    - Verify redirect to login
    - Verify intended URL stored
    - Test successful redirect after login
    - Test access with valid authentication

11. **Test permission-based access**
    - Test route with required permissions
    - Test route without required permissions
    - Verify 403 page displays correctly
    - Test "require all" permission mode
    - Test "require any" permission mode

12. **Test session expiry warning**
    - Manually set token to expire soon
    - Verify warning modal appears
    - Test "Extend Session" functionality
    - Verify countdown accuracy
    - Test modal dismiss and re-trigger

13. **Test session expiry logout**
    - Let token expire completely
    - Verify expiry modal appears
    - Verify auto-logout countdown
    - Verify automatic logout execution
    - Verify redirect to login with message

14. **Test 401 response handling**
    - Make API call with expired token
    - Verify 401 interceptor triggers
    - Verify automatic token refresh attempt
    - Verify logout on refresh failure
    - Verify user sees appropriate message

15. **Test multi-tab synchronization**
    - Open app in two tabs
    - Login in one tab
    - Verify auth state syncs to other tab
    - Logout in one tab
    - Verify logout syncs to all tabs

16. **Test edge cases**
    - Test network errors during login
    - Test slow API responses
    - Test concurrent authentication attempts
    - Test rapid navigation during auth
    - Test browser back button behavior

17. **Test mobile responsiveness**
    - Test all auth pages on mobile viewport
    - Verify forms are usable on touch devices
    - Test keyboard appearance and behavior
    - Verify modals display correctly

18. **Test accessibility**
    - Navigate auth flows with keyboard only
    - Test with screen reader
    - Verify focus indicators visible
    - Verify ARIA labels present
    - Test color contrast ratios

19. **Test security features**
    - Verify passwords are masked
    - Verify no sensitive data in console logs
    - Verify tokens not visible in URL
    - Verify HTTPS used for all requests
    - Verify CSRF protection active

20. **Document test results**
    - Record all test outcomes
    - Note any bugs or issues
    - Create bug reports if needed
    - Document browser compatibility
    - Note performance observations

### Comprehensive Testing Checklist

#### A. Login Flow Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Valid credentials | Successful login, redirect to dashboard | ☐ |
| Invalid password | Error message: "Invalid credentials" | ☐ |
| Non-existent email | Error message: "Invalid credentials" | ☐ |
| Empty email field | Validation error: "Email required" | ☐ |
| Invalid email format | Validation error: "Invalid email" | ☐ |
| Empty password field | Validation error: "Password required" | ☐ |
| Show/hide password toggle | Password visibility toggles | ☐ |
| Remember me checked | Longer session duration | ☐ |
| Forgot password link | Navigate to forgot password page | ☐ |
| Register link | Navigate to register page | ☐ |
| Loading state | Button disabled, spinner shown | ☐ |
| Direct protected route access | Login, then redirect to intended URL | ☐ |

#### B. Registration Flow Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Valid registration data | Account created, verification email sent | ☐ |
| Duplicate email | Error: "Email already exists" | ☐ |
| Weak password | Error: "Password must be stronger" | ☐ |
| Password mismatch | Error: "Passwords don't match" | ☐ |
| Terms not accepted | Error: "Accept terms to continue" | ☐ |
| Invalid email format | Validation error | ☐ |
| All fields empty | Multiple validation errors | ☐ |
| Password requirements displayed | Checklist shows requirements | ☐ |
| Business registration toggle | Shows/hides business fields | ☐ |

#### C. Password Reset Flow Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Valid email submitted | Success message, email sent | ☐ |
| Non-existent email | Generic success message (security) | ☐ |
| Reset link clicked | Navigate to reset page | ☐ |
| Valid new password | Password reset successful | ☐ |
| Expired reset token | Error: "Link expired" | ☐ |
| Invalid reset token | Error: "Invalid link" | ☐ |
| Already-used token | Error: "Link already used" | ☐ |
| Login with new password | Successful authentication | ☐ |
| Login with old password | Error: "Invalid credentials" | ☐ |

#### D. Email Verification Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Click verification link | Email verified successfully | ☐ |
| Expired verification token | Error: "Link expired" | ☐ |
| Invalid token | Error: "Invalid verification link" | ☐ |
| Already verified email | Message: "Already verified" | ☐ |
| Resend verification email | New email sent | ☐ |
| Login before verification | Warning: "Verify email" | ☐ |

#### E. 2FA Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Enable 2FA | QR code displayed | ☐ |
| Scan QR with authenticator | Code generates successfully | ☐ |
| Enter valid TOTP code | 2FA enabled, backup codes shown | ☐ |
| Enter invalid TOTP code | Error: "Invalid code" | ☐ |
| Save backup codes | Download or copy successful | ☐ |
| Login with 2FA enabled | Prompted for TOTP code | ☐ |
| Enter valid TOTP on login | Login successful | ☐ |
| Enter invalid TOTP on login | Error: "Invalid code" | ☐ |
| Use backup code | Login successful, code invalidated | ☐ |
| Trust device checkbox | 2FA not required on same device | ☐ |
| Disable 2FA | 2FA removed from account | ☐ |

#### F. Route Protection Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Access protected route unauthenticated | Redirect to login | ☐ |
| Current URL stored | intendedUrl in sessionStorage | ☐ |
| Login after redirect | Return to intended URL | ☐ |
| Access protected route authenticated | Content renders | ☐ |
| Access without required permission | Redirect to 403 page | ☐ |
| Access with required permission | Content renders | ☐ |
| "Require all" mode | Only render if all perms present | ☐ |
| "Require any" mode | Render if any perm present | ☐ |
| 403 page "Go to Dashboard" | Navigate to dashboard | ☐ |

#### G. Session Management Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Session expiring soon (< 5 min) | Warning modal appears | ☐ |
| Countdown timer accuracy | Timer updates every second | ☐ |
| Click "Extend Session" | Token refreshed, modal closes | ☐ |
| Ignore warning, let expire | Expiry modal appears | ☐ |
| Session expired modal | Shows with auto-logout countdown | ☐ |
| Auto-logout executes | Redirect to login with message | ☐ |
| API 401 response | Session expiry detected | ☐ |
| Token refresh on 401 | New token acquired if possible | ☐ |
| Refresh fails | Logout triggered | ☐ |
| Manual logout clears session | All data cleared, redirected | ☐ |

#### H. Multi-Tab Sync Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Login in tab 1 | Tab 2 syncs to authenticated | ☐ |
| Logout in tab 1 | Tab 2 syncs to logged out | ☐ |
| Session expire in tab 1 | Tab 2 shows expiry modal | ☐ |
| Permission change in tab 1 | Tab 2 reflects new permissions | ☐ |

#### I. Mobile Responsiveness Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Login form on mobile | Form is usable, fields accessible | ☐ |
| Registration form on mobile | All fields visible and functional | ☐ |
| Modals on mobile | Properly sized, readable | ☐ |
| Touch targets | Minimum 44x44px | ☐ |
| Keyboard behavior | Appears appropriately | ☐ |
| Orientation change | Layout adapts correctly | ☐ |

#### J. Accessibility Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Keyboard navigation | All interactive elements reachable | ☐ |
| Focus indicators | Visible on all focusable elements | ☐ |
| Screen reader labels | All elements properly labeled | ☐ |
| Form error announcements | Errors announced by screen reader | ☐ |
| Color contrast | Meets WCAG AA (4.5:1) | ☐ |
| Modal focus trap | Focus stays within modal | ☐ |

#### K. Security Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Password fields masked | Dots or asterisks shown | ☐ |
| No passwords in logs | Console free of sensitive data | ☐ |
| Tokens not in URLs | No tokens in query params | ☐ |
| HTTPS used | All requests use HTTPS | ☐ |
| CSRF protection | CSRF token included in requests | ☐ |
| XSS prevention | User input sanitized | ☐ |
| Open redirect prevention | Only relative URLs accepted | ☐ |

#### L. Performance Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Login response time | < 1 second | ☐ |
| Page load time | < 2 seconds | ☐ |
| Token refresh time | < 500ms | ☐ |
| Modal animation smooth | 60fps | ☐ |
| No memory leaks | Memory stable over time | ☐ |

### Bug Report Template

```
Bug Report:

Title: [Short description]

Severity: Critical | High | Medium | Low

Steps to Reproduce:
1.
2.
3.

Expected Result:


Actual Result:


Environment:
- Browser:
- OS:
- Screen Size:

Screenshots/Video:


Additional Notes:

```

### Test User Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@test.com | Admin@123456 | All permissions |
| Manager | manager@test.com | Manager@123 | Most permissions |
| Cashier | cashier@test.com | Cashier@123 | Limited permissions |
| Basic | user@test.com | User@123456 | Minimal permissions |

### Browser Compatibility Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

### Expected Outcome
- All authentication flows working correctly
- No critical bugs identified
- All test cases pass
- Documentation of any issues
- Confidence in system security and UX

### Verification Checklist
- [ ] Testing environment set up
- [ ] Test users created
- [ ] Login flow tested and passing
- [ ] Registration flow tested and passing
- [ ] Password reset flow tested and passing
- [ ] Email verification tested and passing
- [ ] 2FA setup tested and passing
- [ ] 2FA verification tested and passing
- [ ] Route protection tested and passing
- [ ] Permission checks tested and passing
- [ ] 403 page tested and working
- [ ] Session warning tested and working
- [ ] Session expiry tested and working
- [ ] Auto-logout tested and working
- [ ] 401 handling tested and working
- [ ] Token refresh tested and working
- [ ] Multi-tab sync tested and working
- [ ] Mobile responsiveness verified
- [ ] Accessibility tested with keyboard
- [ ] Screen reader compatibility tested
- [ ] Security features verified
- [ ] Performance acceptable
- [ ] All browsers tested
- [ ] Bug reports created for issues
- [ ] Test results documented

---

## Summary

This document completed the session management and final verification for the authentication system. Session expiry detection monitors token validity and API responses, providing users with timely warnings before automatic logout. The session expiry modal offers a professional interface for handling expired sessions with options to extend or re-authenticate. Auto-logout ensures complete cleanup of authentication data and secure transition back to the login page. Comprehensive testing validates all authentication flows work correctly together.

### Completed Tasks
83. ✓ Implemented session expiry handling with token monitoring and API interceptors
84. ✓ Created session expiry modal with warning and expired states
85. ✓ Implemented auto-logout with complete state cleanup
86. ✓ Created comprehensive testing checklist for all auth flows

### Key Features Implemented
- Continuous session monitoring with periodic checks
- Token refresh on 401 responses
- Session expiry warning modal with countdown
- Automatic logout on expiry
- Complete cleanup of auth state and caches
- Multi-tab synchronization
- Comprehensive end-to-end testing framework

### SubPhase-06 Complete
All authentication UI features have been successfully implemented and tested:
- ✓ Auth layout and routing structure
- ✓ Login page and form with validation
- ✓ Registration flow with business options
- ✓ Password reset workflow
- ✓ Email verification system
- ✓ 2FA setup and verification
- ✓ Route protection with permission checks
- ✓ Session management with expiry handling

### Next Steps
Proceed to **SubPhase-07: Dashboard Layout** to build the main ERP dashboard structure, including navigation, sidebar, header, breadcrumbs, and responsive layout components that will house all ERP modules.
