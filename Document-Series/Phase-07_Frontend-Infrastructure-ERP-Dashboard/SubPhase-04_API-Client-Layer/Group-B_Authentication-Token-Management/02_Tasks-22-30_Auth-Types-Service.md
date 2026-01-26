# Tasks 22-30: Auth Types and Authentication Service

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** B - Authentication & Token Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 22, 23, 24, 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-21_Token-Storage-Module.md](01_Tasks-15-21_Token-Storage-Module.md)

---

## Document Overview

This document covers the authentication types and service layer implementation for the frontend application. It defines TypeScript interfaces for authentication requests/responses, creates the authentication service module, and implements all authentication-related API functions including login, logout, token refresh, user retrieval, and password management operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 22 | Create Auth Types | Low | 15 min |
| 23 | Create Auth Service | Low | 10 min |
| 24 | Implement login Function | Medium | 30 min |
| 25 | Implement logout Function | Low | 15 min |
| 26 | Implement refreshToken Function | Medium | 25 min |
| 27 | Implement getCurrentUser Function | Low | 15 min |
| 28 | Implement forgotPassword Function | Low | 15 min |
| 29 | Implement resetPassword Function | Low | 15 min |
| 30 | Implement changePassword Function | Low | 20 min |

---

## Task 22: Create Auth Types

### Overview
Define TypeScript interfaces and types for authentication operations. These types ensure type safety across the authentication flow, including login requests/responses, user data structures, password operations, and related authentication types.

### Dependencies
- Task 08: Create types directory structure
- TypeScript configured in project

### Instructions

1. **Create auth types file**
   - Navigate to `frontend/types/` directory
   - Create file named `auth.ts`
   - This file will contain all authentication-related types

2. **Add file header documentation**
   - Add comprehensive file-level comment
   - Describe purpose: authentication types and interfaces
   - List main types exported from this file
   - Note usage context (authService, components, hooks)

3. **Define User interface**
   - Create interface representing authenticated user
   - Include id field (string or number)
   - Include email field (string)
   - Include firstName field (string)
   - Include lastName field (string)
   - Include role field (string) for authorization
   - Include permissions array (string[]) for granular access
   - Add optional fields: avatar, phone, lastLogin
   - Add optional tenantId if multi-tenant system

4. **Define LoginRequest interface**
   - Create interface for login credentials
   - Include email field (string, required)
   - Include password field (string, required)
   - Include rememberMe field (boolean, optional)
   - Purpose: type-safe login form submission

5. **Define LoginResponse interface**
   - Create interface for login API response
   - Include accessToken field (string)
   - Include refreshToken field (string)
   - Include user field (User type)
   - Include expiresIn field (number, optional, seconds)
   - Purpose: type-safe login response handling

6. **Define RefreshTokenRequest interface**
   - Create interface for token refresh request
   - Include refreshToken field (string)
   - Purpose: type-safe token refresh operation

7. **Define RefreshTokenResponse interface**
   - Create interface for token refresh response
   - Include accessToken field (string)
   - Include expiresIn field (number, optional)
   - Purpose: type-safe refresh response handling

8. **Define ForgotPasswordRequest interface**
   - Create interface for password reset request
   - Include email field (string)
   - Purpose: initiate password reset flow

9. **Define ResetPasswordRequest interface**
   - Create interface for password reset submission
   - Include token field (string, from email link)
   - Include newPassword field (string)
   - Include confirmPassword field (string)
   - Purpose: complete password reset

10. **Define ChangePasswordRequest interface**
    - Create interface for password change
    - Include currentPassword field (string)
    - Include newPassword field (string)
    - Include confirmPassword field (string)
    - Purpose: authenticated user password change

11. **Define AuthResponse generic type**
    - Create generic success/error response wrapper
    - Include success field (boolean)
    - Include message field (string, optional)
    - Include data field (generic type T, optional)
    - Purpose: standardized API response format

12. **Export all types**
    - Use named exports for all interfaces
    - Ensure proper TypeScript module structure
    - Add export statements if not using inline export

### Type Structure Overview

```
User Interface
├── id: string | number
├── email: string
├── firstName: string
├── lastName: string
├── role: string
├── permissions: string[]
├── avatar?: string
├── phone?: string
├── lastLogin?: Date
└── tenantId?: string

LoginRequest
├── email: string
├── password: string
└── rememberMe?: boolean

LoginResponse
├── accessToken: string
├── refreshToken: string
├── user: User
└── expiresIn?: number

Password Management Types
├── ForgotPasswordRequest: { email }
├── ResetPasswordRequest: { token, newPassword, confirmPassword }
└── ChangePasswordRequest: { currentPassword, newPassword, confirmPassword }
```

### Type Relationships Diagram

```
┌─────────────────┐
│  LoginRequest   │
│  ┌────────────┐ │
│  │ email      │ │──────┐
│  │ password   │ │      │
│  └────────────┘ │      │
└─────────────────┘      │
                         │ API Call
                         ▼
                  ┌──────────────┐
                  │ Auth Service │
                  └──────────────┘
                         │
                         │ Returns
                         ▼
┌─────────────────────────────────┐
│      LoginResponse              │
│  ┌────────────────────────────┐ │
│  │ accessToken: string        │ │
│  │ refreshToken: string       │ │
│  │ user: User ──────┐         │ │
│  │                  │         │ │
│  └──────────────────│─────────┘ │
└───────────────────────┼─────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   User Interface │
              │  ┌─────────────┐ │
              │  │ id          │ │
              │  │ email       │ │
              │  │ firstName   │ │
              │  │ lastName    │ │
              │  │ role        │ │
              │  │ permissions │ │
              │  └─────────────┘ │
              └──────────────────┘
```

### Type Usage Context

| Type | Used In | Purpose |
|------|---------|---------|
| User | State management, UI components | Display user info, check permissions |
| LoginRequest | Login form, authService.login | Submit credentials |
| LoginResponse | authService.login handler | Process login result |
| RefreshTokenRequest | Token refresh logic | Request new access token |
| RefreshTokenResponse | Token refresh handler | Store new token |
| ForgotPasswordRequest | Forgot password form | Initiate reset |
| ResetPasswordRequest | Reset password form | Complete reset |
| ChangePasswordRequest | Change password form | Update password |

### Expected Outcome
- Complete TypeScript type definitions for auth
- Type-safe authentication operations
- Reusable across entire frontend application
- Clear contract between frontend and backend API

### Verification Checklist
- [ ] `frontend/types/auth.ts` file created
- [ ] User interface defined with all required fields
- [ ] LoginRequest interface defined
- [ ] LoginResponse interface defined
- [ ] RefreshTokenRequest interface defined
- [ ] RefreshTokenResponse interface defined
- [ ] ForgotPasswordRequest interface defined
- [ ] ResetPasswordRequest interface defined
- [ ] ChangePasswordRequest interface defined
- [ ] AuthResponse generic type defined
- [ ] All types properly exported
- [ ] File has proper documentation

---

## Task 23: Create Auth Service

### Overview
Create the authentication service module that centralizes all authentication-related API calls. This service acts as the interface between the frontend application and the backend authentication endpoints, providing a clean API for components and state management to interact with.

### Dependencies
- Task 02: HTTP client setup (apiClient)
- Task 22: Auth types defined
- Task 15: Token storage module created

### Instructions

1. **Create auth service file**
   - Navigate to `frontend/services/api/` directory
   - Create file named `authService.ts`
   - This service handles all authentication operations

2. **Add file header documentation**
   - Add comprehensive file-level comment
   - Describe purpose: authentication API service
   - List all functions exported
   - Note usage of apiClient and tokenStorage
   - Document authentication flow overview

3. **Import required dependencies**
   - Import apiClient from lib/apiClient
   - Import token storage functions from lib/tokenStorage
   - Import all auth types from types/auth
   - Import AxiosResponse type if needed

4. **Define API endpoint constants**
   - Create constant AUTH_ENDPOINTS object
   - Define LOGIN: '/auth/login'
   - Define LOGOUT: '/auth/logout'
   - Define REFRESH: '/auth/refresh'
   - Define ME: '/auth/me'
   - Define FORGOT_PASSWORD: '/auth/forgot-password'
   - Define RESET_PASSWORD: '/auth/reset-password'
   - Define CHANGE_PASSWORD: '/auth/change-password'
   - Purpose: centralized endpoint management

5. **Create authService object structure**
   - Define const authService with object literal
   - Will contain all authentication functions
   - Use consistent naming convention
   - Export as default or named export

6. **Prepare for function implementations**
   - Each function will be added in subsequent tasks
   - Functions will use apiClient for HTTP requests
   - Functions will integrate with tokenStorage
   - Functions will return typed responses

7. **Add JSDoc comments for service**
   - Document each function signature
   - Include @param tags for parameters
   - Include @returns tags for return values
   - Include @throws tags for error cases

### Service Structure

```
authService
├── login(credentials) → Promise<LoginResponse>
├── logout() → Promise<void>
├── refreshToken() → Promise<RefreshTokenResponse>
├── getCurrentUser() → Promise<User>
├── forgotPassword(email) → Promise<void>
├── resetPassword(data) → Promise<void>
└── changePassword(data) → Promise<void>
```

### Service Architecture

```
┌────────────────────────────────────────┐
│         Frontend Components            │
│  (Login Form, Profile, Nav, etc.)      │
└──────────────┬─────────────────────────┘
               │
               │ Calls auth methods
               ▼
┌────────────────────────────────────────┐
│          authService.ts                │
│  ┌──────────────────────────────────┐  │
│  │  login()                         │  │
│  │  logout()                        │  │
│  │  refreshToken()                  │  │
│  │  getCurrentUser()                │  │
│  │  forgotPassword()                │  │
│  │  resetPassword()                 │  │
│  │  changePassword()                │  │
│  └──────────────────────────────────┘  │
└──────────┬────────────┬────────────────┘
           │            │
           │            │ Uses
           ▼            ▼
    ┌───────────┐  ┌──────────────┐
    │ apiClient │  │ tokenStorage │
    └─────┬─────┘  └──────────────┘
          │
          │ HTTP Requests
          ▼
    ┌─────────────┐
    │   Backend   │
    │   API       │
    └─────────────┘
```

### Function Signatures

| Function | Parameters | Return Type | HTTP Method |
|----------|------------|-------------|-------------|
| login | LoginRequest | Promise<LoginResponse> | POST |
| logout | none | Promise<void> | POST |
| refreshToken | none | Promise<RefreshTokenResponse> | POST |
| getCurrentUser | none | Promise<User> | GET |
| forgotPassword | ForgotPasswordRequest | Promise<void> | POST |
| resetPassword | ResetPasswordRequest | Promise<void> | POST |
| changePassword | ChangePasswordRequest | Promise<void> | POST |

### Expected Outcome
- Central authentication service module created
- Clear structure for all auth functions
- Foundation for API integration
- Ready for function implementations

### Verification Checklist
- [ ] `frontend/services/api/authService.ts` file created
- [ ] File has proper header documentation
- [ ] Required dependencies imported
- [ ] API endpoint constants defined
- [ ] authService object structure created
- [ ] Function signatures defined (can be empty initially)
- [ ] JSDoc comments added for each function
- [ ] Service exported properly

---

## Task 24: Implement login Function

### Overview
Implement the login function that authenticates users by sending credentials to the backend, receiving JWT tokens, storing them securely, and returning the authenticated user data. This is the primary entry point for user authentication in the application.

### Dependencies
- Task 23: Auth service created
- Task 17: setAccessToken function
- Task 19: setRefreshToken function

### Instructions

1. **Open authService.ts file**
   - Navigate to `frontend/services/api/authService.ts`
   - Locate the login function stub

2. **Define function signature**
   - Function name: login
   - Parameter: credentials (type: LoginRequest)
   - Return type: Promise<LoginResponse>
   - Use async/await syntax

3. **Add function documentation**
   - Add JSDoc comment block
   - Describe: authenticates user with email and password
   - Document credentials parameter
   - Document return value: access token, refresh token, user data
   - Note side effect: stores tokens in storage
   - Document possible errors: invalid credentials, network error

4. **Implement API request**
   - Use apiClient.post method
   - Endpoint: AUTH_ENDPOINTS.LOGIN
   - Pass credentials object as request body
   - Store response in typed variable

5. **Extract response data**
   - Destructure response.data
   - Extract accessToken, refreshToken, user
   - Validate that required fields exist
   - Handle missing data appropriately

6. **Store tokens**
   - Call setAccessToken with accessToken
   - Call setRefreshToken with refreshToken
   - Ensure tokens are stored before returning
   - Consider rememberMe flag for storage strategy

7. **Return login response**
   - Return object with accessToken, refreshToken, user
   - Maintain LoginResponse interface structure
   - Include any additional metadata (expiresIn)

8. **Add error handling**
   - Wrap in try-catch block
   - Handle network errors
   - Handle authentication errors (401)
   - Handle validation errors (400)
   - Transform backend errors to user-friendly messages
   - Re-throw with context information

9. **Handle rememberMe flag (optional)**
   - If rememberMe is true, use persistent storage
   - If rememberMe is false, use session storage
   - Adjust token storage strategy accordingly

10. **Add logging (optional)**
    - Log successful login (without sensitive data)
    - Log authentication errors
    - Use conditional logging based on environment

### Login Flow Diagram

```
┌──────────────┐
│  User enters │
│  credentials │
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│ authService.login()    │
│ ┌────────────────────┐ │
│ │ Validate input     │ │
│ └────────┬───────────┘ │
└──────────┼─────────────┘
           │
           ▼
┌──────────────────────────┐
│ POST /auth/login         │
│ { email, password }      │
└──────────┬───────────────┘
           │
           ▼
    ┌──────┴──────┐
    │   Backend   │
    │  validates  │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────┐
    │ Generate tokens │
    └──────┬──────────┘
           │
           ▼
┌──────────────────────────┐
│ Return LoginResponse     │
│ {                        │
│   accessToken: "jwt...", │
│   refreshToken: "jwt..", │
│   user: { ... }          │
│ }                        │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────┐
│ Store tokens           │
│ ┌────────────────────┐ │
│ │ setAccessToken()   │ │
│ │ setRefreshToken()  │ │
│ └────────────────────┘ │
└──────────┬─────────────┘
           │
           ▼
┌──────────────────────┐
│ Return user data     │
│ to calling component │
└──────────────────────┘
```

### Error Handling Strategy

| Error Type | Status Code | Handling Strategy |
|------------|-------------|-------------------|
| Invalid credentials | 401 | Show "Invalid email or password" |
| Validation error | 400 | Show field-specific errors |
| Account locked | 423 | Show "Account locked" message |
| Network error | - | Show "Connection failed" |
| Server error | 500 | Show "Server error, try again" |

### Usage Example Context

```
Component calls:
authService.login({ email, password, rememberMe })

Service performs:
1. POST request to /auth/login
2. Receive { accessToken, refreshToken, user }
3. Store accessToken via setAccessToken()
4. Store refreshToken via setRefreshToken()
5. Return LoginResponse to component

Component receives:
{ accessToken, refreshToken, user }

Component then:
- Updates auth state
- Redirects to dashboard
- Shows success message
```

### Security Considerations

| Concern | Implementation |
|---------|----------------|
| Token storage | Use secure storage mechanism |
| Password handling | Never log password values |
| HTTPS only | Ensure API uses HTTPS |
| Token expiration | Include expiresIn if available |
| Remember me | Adjust storage persistence |

### Expected Outcome
- Fully functional login authentication
- Secure token storage
- Proper error handling
- Type-safe implementation
- Integration with apiClient

### Verification Checklist
- [ ] login function implemented in authService
- [ ] Function accepts LoginRequest parameter
- [ ] Function returns Promise<LoginResponse>
- [ ] API request sent to correct endpoint
- [ ] Response data properly extracted
- [ ] Tokens stored via tokenStorage functions
- [ ] Error handling implemented
- [ ] JSDoc documentation added
- [ ] Type safety maintained throughout
- [ ] No sensitive data logged

---

## Task 25: Implement logout Function

### Overview
Implement the logout function that ends the user session by notifying the backend, clearing stored tokens, and cleaning up any authentication state. This ensures proper session termination and security.

### Dependencies
- Task 23: Auth service created
- Task 20: clearTokens function

### Instructions

1. **Open authService.ts file**
   - Navigate to `frontend/services/api/authService.ts`
   - Locate the logout function stub

2. **Define function signature**
   - Function name: logout
   - No parameters required
   - Return type: Promise<void>
   - Use async/await syntax

3. **Add function documentation**
   - Add JSDoc comment block
   - Describe: logs out current user and clears tokens
   - Note: calls backend logout endpoint
   - Note side effect: clears all authentication data
   - Document possible errors: network error

4. **Get refresh token for logout request**
   - Import getRefreshToken function
   - Call getRefreshToken to retrieve current token
   - May be needed for backend to invalidate token
   - Handle case where token doesn't exist

5. **Implement API request**
   - Use apiClient.post method
   - Endpoint: AUTH_ENDPOINTS.LOGOUT
   - Optionally send refresh token in request body
   - Backend may invalidate token or add to blacklist

6. **Clear stored tokens**
   - Call clearTokens function
   - This removes both access and refresh tokens
   - Should be called even if API request fails
   - Ensures user is logged out locally

7. **Add error handling**
   - Wrap in try-catch block
   - If API call fails, still clear tokens
   - Log error but don't block logout
   - Prioritize local state cleanup

8. **Handle edge cases**
   - No tokens exist: still succeed
   - Network offline: clear tokens anyway
   - Backend error: clear tokens anyway
   - Logout should always succeed from user perspective

9. **Add cleanup operations**
   - Consider clearing other user-related state
   - May need to reset API client state
   - May need to clear local caches
   - Document any additional cleanup needed

### Logout Flow Diagram

```
┌──────────────┐
│ User clicks  │
│   logout     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ authService.logout() │
└──────────┬───────────┘
           │
           ├─────────────────────┐
           │                     │
           ▼                     ▼
    ┌────────────┐      ┌─────────────────┐
    │ Get refresh│      │ Clear tokens    │
    │   token    │      │ (guaranteed)    │
    └─────┬──────┘      └────────┬────────┘
          │                      │
          ▼                      │
    ┌───────────────────┐        │
    │ POST /auth/logout │        │
    │ { refreshToken }  │        │
    └─────┬─────────────┘        │
          │                      │
          ▼                      │
    ┌──────────────┐             │
    │   Backend    │             │
    │  invalidates │             │
    │    token     │             │
    └──────┬───────┘             │
           │                     │
           └─────────┬───────────┘
                     │
                     ▼
           ┌──────────────────┐
           │ Logout complete  │
           │ (tokens cleared) │
           └──────────────────┘
```

### Logout Strategy

| Step | Action | Critical | Fallback |
|------|--------|----------|----------|
| 1 | Get refresh token | No | Continue without |
| 2 | Call logout API | No | Clear tokens anyway |
| 3 | Clear tokens | Yes | Must succeed |
| 4 | Clear state | Optional | Best effort |

### Error Handling

| Scenario | Response |
|----------|----------|
| API succeeds | Clear tokens, return success |
| API fails (network) | Clear tokens anyway, return success |
| API fails (error) | Clear tokens anyway, return success |
| No tokens exist | Return success immediately |

### Usage Example Context

```
Component calls:
await authService.logout()

Service performs:
1. Retrieve refresh token (if exists)
2. POST to /auth/logout with token
3. Backend invalidates token
4. Call clearTokens() regardless of API result
5. Return void

Component then:
- Updates auth state to logged out
- Redirects to login page
- Shows logout confirmation
```

### Security Considerations

| Concern | Implementation |
|---------|----------------|
| Token invalidation | Backend should blacklist token |
| Local cleanup | Always clear all tokens |
| Failed logout | Still clear tokens locally |
| Concurrent sessions | Backend handles per-token invalidation |

### Expected Outcome
- Successful logout regardless of network state
- All tokens cleared from storage
- Backend notified to invalidate tokens
- Graceful error handling
- Type-safe implementation

### Verification Checklist
- [ ] logout function implemented in authService
- [ ] Function returns Promise<void>
- [ ] Refresh token retrieved before API call
- [ ] API request sent to logout endpoint
- [ ] clearTokens called in all scenarios
- [ ] Error handling implemented
- [ ] Logout always succeeds from user perspective
- [ ] JSDoc documentation added
- [ ] Type safety maintained

---

## Task 26: Implement refreshToken Function

### Overview
Implement the token refresh function that obtains a new access token using the refresh token when the current access token expires. This enables seamless authentication without requiring the user to log in again.

### Dependencies
- Task 23: Auth service created
- Task 17: setAccessToken function
- Task 18: getRefreshToken function

### Instructions

1. **Open authService.ts file**
   - Navigate to `frontend/services/api/authService.ts`
   - Locate the refreshToken function stub

2. **Define function signature**
   - Function name: refreshToken
   - No parameters (uses stored refresh token)
   - Return type: Promise<RefreshTokenResponse>
   - Use async/await syntax

3. **Add function documentation**
   - Add JSDoc comment block
   - Describe: refreshes access token using refresh token
   - Note: automatically uses stored refresh token
   - Document return value: new access token
   - Note side effect: updates stored access token
   - Document errors: invalid refresh token, expired refresh token

4. **Retrieve stored refresh token**
   - Call getRefreshToken function
   - Store in variable
   - Check if token exists
   - Throw error if no refresh token available

5. **Validate refresh token exists**
   - If no refresh token, throw specific error
   - Error message: "No refresh token available"
   - This indicates user needs to log in again
   - Return or throw to prevent API call

6. **Implement API request**
   - Use apiClient.post method
   - Endpoint: AUTH_ENDPOINTS.REFRESH
   - Send refresh token in request body
   - Structure: { refreshToken: storedToken }
   - Store response in typed variable

7. **Extract new access token**
   - Destructure response.data
   - Extract accessToken
   - Optionally extract expiresIn
   - Validate that accessToken exists

8. **Update stored access token**
   - Call setAccessToken with new accessToken
   - Do not update refresh token (typically unchanged)
   - Ensure token stored before returning
   - New token ready for subsequent requests

9. **Return refresh response**
   - Return object with accessToken
   - Include expiresIn if provided
   - Maintain RefreshTokenResponse interface
   - Type-safe return

10. **Add error handling**
    - Wrap in try-catch block
    - Handle invalid refresh token (401)
    - Handle expired refresh token (401)
    - Handle network errors
    - If refresh fails, clear all tokens
    - Force user to log in again on refresh failure

11. **Handle token rotation (optional)**
    - Some backends return new refresh token too
    - If new refresh token provided, update it
    - Call setRefreshToken with new token
    - Document this behavior

### Token Refresh Flow

```
┌─────────────────┐
│ Access token    │
│   expired       │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Interceptor detects 401  │
│ OR manual refresh call   │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────┐
│ authService.refreshToken() │
│ ┌────────────────────────┐ │
│ │ Get stored refresh     │ │
│ │ token                  │ │
│ └────────┬───────────────┘ │
└──────────┼─────────────────┘
           │
           ▼
    ┌──────────────┐
    │ Refresh      │
    │ token exists?│
    └──────┬───────┘
           │
       Yes │        No
           │         │
           ▼         ▼
    ┌────────┐  ┌─────────┐
    │Continue│  │ Throw   │
    └────┬───┘  │ error   │
         │      └─────────┘
         ▼
┌─────────────────────────┐
│ POST /auth/refresh      │
│ { refreshToken }        │
└──────────┬──────────────┘
           │
           ▼
    ┌──────┴───────┐
    │   Backend    │
    │  validates   │
    │ refresh token│
    └──────┬───────┘
           │
      ┌────┴────┐
      │ Valid?  │
      └────┬────┘
           │
      Yes  │     No
           │      │
           ▼      ▼
    ┌────────┐ ┌────────────┐
    │Generate│ │Return 401  │
    │new     │ └──────┬─────┘
    │access  │        │
    │token   │        ▼
    └───┬────┘  ┌──────────┐
        │       │Clear all │
        │       │tokens &  │
        │       │logout    │
        │       └──────────┘
        ▼
┌────────────────────┐
│Return new token    │
│{ accessToken }     │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ setAccessToken()   │
│ (update storage)   │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ Retry original     │
│ request with new   │
│ access token       │
└────────────────────┘
```

### Token Refresh Scenarios

| Scenario | Action | Result |
|----------|--------|--------|
| Access expired, refresh valid | Refresh succeeds | New access token |
| Access expired, refresh expired | Refresh fails 401 | Force re-login |
| Access expired, no refresh | Skip refresh | Force re-login |
| Refresh fails (network) | Retry later | Keep trying |
| Refresh fails (server error) | Retry later | Keep trying |
| Refresh fails (401/403) | Clear tokens | Force re-login |

### Error Handling Strategy

| Error | Status | Action |
|-------|--------|--------|
| No refresh token | - | Throw error, redirect to login |
| Invalid refresh token | 401 | Clear tokens, redirect to login |
| Expired refresh token | 401 | Clear tokens, redirect to login |
| Network error | - | Throw error, allow retry |
| Server error | 500 | Throw error, allow retry |

### Usage Example Context

```
Scenario 1: Automatic refresh (via interceptor)
1. API request returns 401
2. Interceptor catches error
3. Calls authService.refreshToken()
4. Receives new access token
5. Retries original request

Scenario 2: Manual refresh
1. Component detects token near expiry
2. Calls authService.refreshToken()
3. Updates token proactively
4. Continues normal operation

Scenario 3: Refresh fails
1. Refresh returns 401
2. Service clears all tokens
3. Throws error to caller
4. App redirects to login
```

### Security Considerations

| Concern | Implementation |
|---------|----------------|
| Refresh token storage | Store securely (httpOnly cookie ideal) |
| Token rotation | Support if backend provides new refresh token |
| Expiry validation | Backend validates refresh token expiry |
| Token invalidation | Logout should invalidate refresh token |
| Concurrent requests | Use mutex to prevent multiple refresh calls |

### Expected Outcome
- Seamless token refresh
- Updated access token stored
- Proper error handling for expired refresh tokens
- Type-safe implementation
- Force re-login when refresh fails

### Verification Checklist
- [ ] refreshToken function implemented
- [ ] Function returns Promise<RefreshTokenResponse>
- [ ] Stored refresh token retrieved
- [ ] Validation for missing refresh token
- [ ] API request sent to refresh endpoint
- [ ] New access token extracted from response
- [ ] New access token stored via setAccessToken
- [ ] Error handling for invalid/expired refresh tokens
- [ ] Tokens cleared on refresh failure
- [ ] JSDoc documentation added
- [ ] Type safety maintained

---

## Task 27: Implement getCurrentUser Function

### Overview
Implement the function to retrieve the currently authenticated user's information from the backend. This function validates the current session and provides user data for displaying profile information, checking permissions, and maintaining application state.

### Dependencies
- Task 23: Auth service created
- Task 16: getAccessToken function (implicit via apiClient)

### Instructions

1. **Open authService.ts file**
   - Navigate to `frontend/services/api/authService.ts`
   - Locate the getCurrentUser function stub

2. **Define function signature**
   - Function name: getCurrentUser
   - No parameters (uses stored access token)
   - Return type: Promise<User>
   - Use async/await syntax

3. **Add function documentation**
   - Add JSDoc comment block
   - Describe: retrieves current authenticated user data
   - Note: requires valid access token
   - Document return value: User object with profile info
   - Document errors: unauthorized (401), network error

4. **Implement API request**
   - Use apiClient.get method
   - Endpoint: AUTH_ENDPOINTS.ME
   - No request body needed
   - Access token automatically attached by interceptor
   - Store response in typed variable

5. **Extract user data from response**
   - Access response.data
   - Should match User interface structure
   - Extract all user fields
   - Validate required fields exist

6. **Return user object**
   - Return response.data as User type
   - Ensure type matches User interface
   - Include all fields: id, email, firstName, lastName, role, permissions

7. **Add error handling**
   - Wrap in try-catch block
   - Handle unauthorized (401): may trigger token refresh
   - Handle forbidden (403): insufficient permissions
   - Handle network errors
   - Handle server errors (500)
   - Provide meaningful error messages

8. **Handle missing token case**
   - If no access token, request will fail with 401
   - Interceptor may trigger automatic refresh
   - Or throw error to force login
   - Document this behavior

9. **Consider caching (optional)**
   - User data doesn't change frequently
   - Could cache result to avoid repeated requests
   - Cache invalidation on logout or profile update
   - Document caching strategy if implemented

### Get Current User Flow

```
┌─────────────────┐
│  Component or   │
│  state manager  │
│  needs user     │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ authService.             │
│ getCurrentUser()         │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────┐
│ GET /auth/me           │
│ Headers:               │
│  Authorization:        │
│   Bearer <accessToken> │
└──────────┬─────────────┘
           │
           ▼
    ┌──────┴──────┐
    │   Backend   │
    │  validates  │
    │  JWT token  │
    └──────┬──────┘
           │
      ┌────┴────┐
      │ Valid?  │
      └────┬────┘
           │
      Yes  │     No
           │      │
           ▼      ▼
    ┌─────────┐ ┌──────────┐
    │ Return  │ │Return 401│
    │ user    │ └────┬─────┘
    │ data    │      │
    └────┬────┘      ▼
         │     ┌──────────────┐
         │     │ Interceptor  │
         │     │ refreshes    │
         │     │ token & retry│
         │     └──────────────┘
         │
         ▼
┌──────────────────────┐
│ Return User object   │
│ {                    │
│   id: "123",         │
│   email: "user@...", │
│   firstName: "John", │
│   lastName: "Doe",   │
│   role: "admin",     │
│   permissions: [...] │
│ }                    │
└──────────┬───────────┘
           │
           ▼
┌────────────────────┐
│ Component receives │
│ user data          │
└────────────────────┘
```

### Usage Scenarios

| Scenario | When | Purpose |
|----------|------|---------|
| App initialization | On app load | Restore user session |
| After login | Post-authentication | Get full user details |
| Profile page | Viewing profile | Display user information |
| Permission check | Before protected action | Verify current permissions |
| Token refresh | After token renewed | Ensure user still valid |

### Error Handling

| Error Type | Status | Handling |
|------------|--------|----------|
| Unauthorized | 401 | Trigger token refresh or login |
| Forbidden | 403 | Show "Access denied" |
| Not found | 404 | User deleted, force logout |
| Network error | - | Show retry option |
| Server error | 500 | Show error message |

### Response Structure

```
User object returned:
{
  id: string | number,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  permissions: string[],
  avatar?: string,
  phone?: string,
  lastLogin?: Date,
  tenantId?: string
}
```

### Usage Example Context

```
Scenario 1: App initialization
useEffect(() => {
  const initAuth = async () => {
    try {
      const user = await authService.getCurrentUser()
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
      // Redirect to login
    }
  }
  initAuth()
}, [])

Scenario 2: After login
const handleLogin = async (credentials) => {
  const { user } = await authService.login(credentials)
  // Could also call getCurrentUser for fresh data
  setCurrentUser(user)
}

Scenario 3: Verify permissions
const user = await authService.getCurrentUser()
if (user.permissions.includes('delete:products')) {
  // Allow delete action
}
```

### Security Considerations

| Concern | Implementation |
|---------|----------------|
| Token validation | Backend verifies JWT signature |
| Session validity | Backend checks token expiry |
| Permissions | Backend returns current permissions |
| Data freshness | Call when permissions may have changed |

### Expected Outcome
- Function retrieves current user data
- Proper authentication via access token
- Type-safe User object returned
- Error handling for auth failures
- Integration with token refresh flow

### Verification Checklist
- [ ] getCurrentUser function implemented
- [ ] Function returns Promise<User>
- [ ] GET request sent to /auth/me
- [ ] Access token automatically included
- [ ] User data extracted from response
- [ ] Return type matches User interface
- [ ] Error handling for 401/403
- [ ] Error handling for network issues
- [ ] JSDoc documentation added
- [ ] Type safety maintained

---

## Task 28: Implement forgotPassword Function

### Overview
Implement the forgot password function that initiates the password reset process by sending a reset email to the user. This function handles the first step of the password recovery flow when users can't access their account.

### Dependencies
- Task 23: Auth service created

### Instructions

1. **Open authService.ts file**
   - Navigate to `frontend/services/api/authService.ts`
   - Locate the forgotPassword function stub

2. **Define function signature**
   - Function name: forgotPassword
   - Parameter: data (type: ForgotPasswordRequest)
   - Return type: Promise<void>
   - Use async/await syntax

3. **Add function documentation**
   - Add JSDoc comment block
   - Describe: initiates password reset process
   - Document data parameter: contains email address
   - Note: sends reset link to user's email
   - Document return: void (success/failure via exceptions)
   - Document errors: email not found, network error

4. **Validate email parameter**
   - Extract email from data parameter
   - Validate email is provided
   - Validate email format (optional, can rely on backend)
   - Throw error if invalid

5. **Implement API request**
   - Use apiClient.post method
   - Endpoint: AUTH_ENDPOINTS.FORGOT_PASSWORD
   - Send request body: { email: data.email }
   - No authentication required (public endpoint)
   - Store response if needed

6. **Handle success response**
   - Backend sends email with reset link
   - Return void on success
   - No data needs to be returned to caller
   - Caller shows success message to user

7. **Add error handling**
   - Wrap in try-catch block
   - Handle email not found (404 or 400)
   - Consider security: don't reveal if email exists
   - Handle rate limiting (429)
   - Handle network errors
   - Handle server errors

8. **Security considerations**
   - Don't reveal whether email exists
   - Show same success message regardless
   - Backend should handle rate limiting
   - Backend generates secure reset token
   - Token should expire (e.g., 1 hour)

9. **Add rate limiting handling**
   - If backend returns 429 (too many requests)
   - Show appropriate error message
   - Suggest waiting before retry
   - Prevent abuse of forgot password endpoint

### Forgot Password Flow

```
┌─────────────────┐
│ User enters     │
│ email address   │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ authService.             │
│ forgotPassword({ email })│
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────┐
│ POST                   │
│ /auth/forgot-password  │
│ { email: "user@..." }  │
└──────────┬─────────────┘
           │
           ▼
    ┌──────┴──────┐
    │   Backend   │
    │  validates  │
    │    email    │
    └──────┬──────┘
           │
      ┌────┴────┐
      │ Email   │
      │ exists? │
      └────┬────┘
           │
      Yes  │     No (same response
           │         for security)
           ▼
    ┌─────────────────┐
    │ Generate reset  │
    │ token (UUID)    │
    │ Expires: 1 hour │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Store token in  │
    │ database with   │
    │ user & expiry   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Send email with │
    │ reset link:     │
    │ /reset-password │
    │ ?token=xxx      │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Return success  │
    │ (200 OK)        │
    └────────┬────────┘
             │
             ▼
┌──────────────────────┐
│ Show success message │
│ "Check your email"   │
└──────────────────────┘
```

### Security Best Practices

| Practice | Reason | Implementation |
|----------|--------|----------------|
| Don't reveal email exists | Prevent email enumeration | Same response for all emails |
| Rate limit requests | Prevent abuse | Backend enforces limit |
| Secure token generation | Prevent guessing | Use cryptographic random |
| Token expiration | Limit attack window | 1 hour expiry |
| One-time use | Prevent replay | Invalidate after use |

### Error Handling Strategy

| Error Type | Status | User Message |
|------------|--------|--------------|
| Email not found | 404 | "If email exists, reset link sent" |
| Rate limited | 429 | "Too many requests, try later" |
| Invalid email format | 400 | "Please enter valid email" |
| Network error | - | "Connection failed, try again" |
| Server error | 500 | "Error occurred, try again" |

### Email Content Structure

```
Reset email should contain:
- Greeting with user name (if email exists)
- Explanation: password reset requested
- Reset link with token
- Link expiry time (e.g., "Valid for 1 hour")
- Security note: ignore if didn't request
- Support contact
```

### Usage Example Context

```
Component calls:
await authService.forgotPassword({ email: "user@example.com" })

Service performs:
1. POST to /auth/forgot-password with email
2. Backend validates email
3. Backend generates reset token
4. Backend sends email with reset link
5. Return void (success)

Component shows:
"If that email exists, we've sent password reset instructions"

User receives email:
Subject: Password Reset Request
Body:
  Click link to reset password:
  https://app.example.com/reset-password?token=abc123xyz
  Link expires in 1 hour.
```

### Expected Outcome
- Password reset email sent
- Secure token generated
- Email delivery confirmed
- Consistent response for security
- Proper error handling

### Verification Checklist
- [ ] forgotPassword function implemented
- [ ] Function accepts ForgotPasswordRequest parameter
- [ ] Function returns Promise<void>
- [ ] POST request sent to forgot-password endpoint
- [ ] Email address passed in request body
- [ ] Error handling implemented
- [ ] Security considerations documented
- [ ] Rate limiting handled
- [ ] JSDoc documentation added
- [ ] Type safety maintained

---

## Task 29: Implement resetPassword Function

### Overview
Implement the reset password function that completes the password recovery process by setting a new password using the reset token received via email. This is the second step of the password reset flow.

### Dependencies
- Task 23: Auth service created
- Task 28: forgotPassword function (conceptually related)

### Instructions

1. **Open authService.ts file**
   - Navigate to `frontend/services/api/authService.ts`
   - Locate the resetPassword function stub

2. **Define function signature**
   - Function name: resetPassword
   - Parameter: data (type: ResetPasswordRequest)
   - Return type: Promise<void>
   - Use async/await syntax

3. **Add function documentation**
   - Add JSDoc comment block
   - Describe: resets password using token from email
   - Document data parameter: token, newPassword, confirmPassword
   - Note: completes password reset flow
   - Document return: void on success
   - Document errors: invalid token, expired token, password validation

4. **Validate input parameters**
   - Extract token, newPassword, confirmPassword from data
   - Validate all fields are provided
   - Validate passwords match
   - Optionally validate password strength
   - Throw error if validation fails

5. **Implement password matching validation**
   - Compare newPassword with confirmPassword
   - If they don't match, throw error
   - Error message: "Passwords do not match"
   - Prevent API call if validation fails

6. **Implement API request**
   - Use apiClient.post method
   - Endpoint: AUTH_ENDPOINTS.RESET_PASSWORD
   - Send request body with token and newPassword
   - May include confirmPassword for backend validation
   - No authentication required (token-based)

7. **Handle success response**
   - Password successfully reset
   - Return void on success
   - Caller redirects to login page
   - Show success message

8. **Add error handling**
   - Wrap in try-catch block
   - Handle invalid token (400)
   - Handle expired token (400 or 410)
   - Handle password validation errors (400)
   - Handle already used token (400)
   - Handle network errors
   - Provide user-friendly error messages

9. **Handle token expiration**
   - If token expired, show specific message
   - Direct user to request new reset link
   - Clear any form data
   - Provide link to forgot password page

10. **Add password strength validation (optional)**
    - Can be done on frontend or backend
    - Check minimum length
    - Check complexity requirements
    - Show requirements to user
    - Prevent weak passwords

### Reset Password Flow

```
┌─────────────────────┐
│ User clicks link    │
│ from email with     │
│ token parameter     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Reset password form │
│ - New password      │
│ - Confirm password  │
│ - Token (hidden)    │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────┐
│ Validate passwords match │
└──────────┬───────────────┘
           │
       Yes │        No
           │         │
           ▼         ▼
    ┌────────┐  ┌─────────┐
    │Continue│  │ Show    │
    └────┬───┘  │ error   │
         │      └─────────┘
         ▼
┌──────────────────────────┐
│ authService.             │
│ resetPassword({          │
│   token,                 │
│   newPassword,           │
│   confirmPassword        │
│ })                       │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────┐
│ POST                   │
│ /auth/reset-password   │
│ {                      │
│   token: "abc123",     │
│   newPassword: "..."   │
│ }                      │
└──────────┬─────────────┘
           │
           ▼
    ┌──────┴──────┐
    │   Backend   │
    │  validates  │
    │    token    │
    └──────┬──────┘
           │
      ┌────┴────┐
      │ Valid & │
      │ not     │
      │ expired?│
      └────┬────┘
           │
      Yes  │     No
           │      │
           ▼      ▼
    ┌─────────┐ ┌──────────┐
    │Validate │ │Return 400│
    │password │ │"Invalid  │
    │strength │ │or expired│
    └────┬────┘ │ token"   │
         │      └──────────┘
    ┌────┴────┐
    │ Valid?  │
    └────┬────┘
         │
    Yes  │     No
         │      │
         ▼      ▼
    ┌─────────────┐ ┌──────────┐
    │Hash password│ │Return 400│
    │Update user  │ │"Password │
    │Invalidate   │ │too weak" │
    │token        │ └──────────┘
    └──────┬──────┘
           │
           ▼
    ┌─────────────────┐
    │ Return success  │
    └────────┬────────┘
             │
             ▼
┌──────────────────────┐
│ Redirect to login    │
│ "Password reset,     │
│  please log in"      │
└──────────────────────┘
```

### Token Validation

| Check | Error Response | User Action |
|-------|----------------|-------------|
| Token not found | "Invalid reset link" | Request new link |
| Token expired | "Reset link expired" | Request new link |
| Token already used | "Link already used" | Request new link |
| Token format invalid | "Invalid reset link" | Request new link |

### Password Validation

| Requirement | Min Value | Recommended |
|-------------|-----------|-------------|
| Minimum length | 8 characters | 12 characters |
| Uppercase letters | 1 | 2 |
| Lowercase letters | 1 | 2 |
| Numbers | 1 | 2 |
| Special characters | 0 | 1 |

### Error Handling

| Error Type | Status | User Message |
|------------|--------|--------------|
| Passwords don't match | - | "Passwords do not match" |
| Token invalid | 400 | "Invalid or expired reset link" |
| Token expired | 400/410 | "Reset link has expired" |
| Password too weak | 400 | "Password does not meet requirements" |
| Token already used | 400 | "This reset link has been used" |
| Network error | - | "Connection failed, try again" |

### Usage Example Context

```
URL from email:
https://app.example.com/reset-password?token=abc123xyz

Component calls:
await authService.resetPassword({
  token: "abc123xyz",
  newPassword: "NewSecure123!",
  confirmPassword: "NewSecure123!"
})

Service performs:
1. Validate passwords match
2. POST to /auth/reset-password
3. Backend validates token
4. Backend validates password strength
5. Backend hashes and updates password
6. Backend invalidates token
7. Return success

Component shows:
"Password reset successful. Please log in with your new password."

Redirects to login page.
```

### Security Considerations

| Concern | Implementation |
|---------|----------------|
| Token security | One-time use, expires in 1 hour |
| Password hashing | Backend uses bcrypt/argon2 |
| Token storage | Server-side, not in JWT |
| HTTPS only | All password operations over HTTPS |
| Password validation | Enforce strength requirements |
| Token invalidation | Mark as used after successful reset |

### Expected Outcome
- Password successfully reset
- Token validated and invalidated
- Strong password enforced
- User redirected to login
- Proper error handling

### Verification Checklist
- [ ] resetPassword function implemented
- [ ] Function accepts ResetPasswordRequest parameter
- [ ] Function returns Promise<void>
- [ ] Password match validation implemented
- [ ] POST request sent to reset-password endpoint
- [ ] Token included in request
- [ ] Error handling for invalid/expired token
- [ ] Error handling for password validation
- [ ] JSDoc documentation added
- [ ] Type safety maintained

---

## Task 30: Implement changePassword Function

### Overview
Implement the change password function that allows authenticated users to update their password. Unlike password reset, this requires the user to provide their current password for security verification, ensuring that only the account owner can change the password.

### Dependencies
- Task 23: Auth service created
- Task 16: getAccessToken function (implicit via apiClient)

### Instructions

1. **Open authService.ts file**
   - Navigate to `frontend/services/api/authService.ts`
   - Locate the changePassword function stub

2. **Define function signature**
   - Function name: changePassword
   - Parameter: data (type: ChangePasswordRequest)
   - Return type: Promise<void>
   - Use async/await syntax

3. **Add function documentation**
   - Add JSDoc comment block
   - Describe: changes password for authenticated user
   - Document data parameter: currentPassword, newPassword, confirmPassword
   - Note: requires authentication (access token)
   - Note: requires current password verification
   - Document return: void on success
   - Document errors: incorrect current password, validation errors

4. **Validate input parameters**
   - Extract currentPassword, newPassword, confirmPassword
   - Validate all fields are provided
   - Validate newPassword and confirmPassword match
   - Optionally validate password strength
   - Throw error if validation fails

5. **Implement password matching validation**
   - Compare newPassword with confirmPassword
   - If they don't match, throw error
   - Error message: "Passwords do not match"
   - Prevent API call if validation fails

6. **Validate new password different from current**
   - Compare newPassword with currentPassword
   - If same, show warning or error
   - Message: "New password must be different"
   - This is optional but recommended

7. **Implement API request**
   - Use apiClient.post or apiClient.put method
   - Endpoint: AUTH_ENDPOINTS.CHANGE_PASSWORD
   - Send request body with all password fields
   - Access token automatically attached by interceptor
   - Requires authentication

8. **Handle success response**
   - Password successfully changed
   - Return void on success
   - Caller shows success message
   - Consider logging user out (force re-login)
   - Or keep session active

9. **Add error handling**
   - Wrap in try-catch block
   - Handle incorrect current password (401 or 400)
   - Handle password validation errors (400)
   - Handle unauthorized (401): no valid session
   - Handle network errors
   - Provide user-friendly error messages

10. **Handle post-change actions**
    - Consider whether to logout user
    - May invalidate all other sessions
    - May send confirmation email
    - Document expected behavior

11. **Add password strength validation (optional)**
    - Same requirements as resetPassword
    - Check minimum length
    - Check complexity requirements
    - Prevent weak passwords

### Change Password Flow

```
┌─────────────────────┐
│ User navigates to   │
│ change password     │
│ (authenticated)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────┐
│ Change password form    │
│ - Current password      │
│ - New password          │
│ - Confirm new password  │
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────┐
│ Validate:                │
│ - All fields filled      │
│ - New passwords match    │
│ - New ≠ current          │
└──────────┬───────────────┘
           │
       Yes │        No
           │         │
           ▼         ▼
    ┌────────┐  ┌─────────┐
    │Continue│  │ Show    │
    └────┬───┘  │ errors  │
         │      └─────────┘
         ▼
┌──────────────────────────┐
│ authService.             │
│ changePassword({         │
│   currentPassword,       │
│   newPassword,           │
│   confirmPassword        │
│ })                       │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────┐
│ POST/PUT               │
│ /auth/change-password  │
│ Headers: Authorization │
│ {                      │
│   currentPassword,     │
│   newPassword          │
│ }                      │
└──────────┬─────────────┘
           │
           ▼
    ┌──────┴──────┐
    │   Backend   │
    │  verifies   │
    │  JWT token  │
    └──────┬──────┘
           │
      ┌────┴────┐
      │ Token   │
      │ valid?  │
      └────┬────┘
           │
      Yes  │     No
           │      │
           ▼      ▼
    ┌─────────┐ ┌──────────┐
    │ Verify  │ │Return 401│
    │ current │ │"Not      │
    │ password│ │ auth'd"  │
    └────┬────┘ └──────────┘
         │
    ┌────┴────┐
    │Current  │
    │password │
    │correct? │
    └────┬────┘
         │
    Yes  │     No
         │      │
         ▼      ▼
    ┌─────────┐ ┌──────────┐
    │Validate │ │Return 400│
    │new      │ │"Current  │
    │password │ │ password │
    └────┬────┘ │incorrect"│
         │      └──────────┘
    ┌────┴────┐
    │Password │
    │meets    │
    │rules?   │
    └────┬────┘
         │
    Yes  │     No
         │      │
         ▼      ▼
    ┌─────────────┐ ┌──────────┐
    │Hash password│ │Return 400│
    │Update user  │ │"Password │
    │Send email   │ │too weak" │
    │confirmation │ └──────────┘
    └──────┬──────┘
           │
           ▼
    ┌─────────────────┐
    │ Optional:       │
    │ Invalidate      │
    │ other sessions  │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Return success  │
    └────────┬────────┘
             │
             ▼
┌──────────────────────┐
│ Show success message │
│ "Password changed"   │
│ Stay logged in       │
│ OR force re-login    │
└──────────────────────┘
```

### Validation Checks

| Check | Error Message | Prevent Submit |
|-------|---------------|----------------|
| Current password empty | "Current password required" | Yes |
| New password empty | "New password required" | Yes |
| Confirm password empty | "Please confirm password" | Yes |
| Passwords don't match | "Passwords do not match" | Yes |
| New same as current | "New password must be different" | Yes |
| Password too weak | "Password does not meet requirements" | Yes |

### Error Handling

| Error Type | Status | User Message |
|------------|--------|--------------|
| Current password incorrect | 400/401 | "Current password is incorrect" |
| Passwords don't match | - | "Passwords do not match" |
| Password too weak | 400 | "Password does not meet requirements" |
| Not authenticated | 401 | "Please log in to change password" |
| Same as current | 400 | "New password must be different" |
| Network error | - | "Connection failed, try again" |

### Security Considerations

| Concern | Implementation |
|---------|----------------|
| Current password verification | Backend verifies before allowing change |
| Session validation | Requires valid access token |
| Password hashing | Backend hashes new password |
| Notification | Email sent about password change |
| Session invalidation | Optionally logout other sessions |
| Password history | Prevent reusing recent passwords |

### Post-Change Actions

| Action | Recommendation | Purpose |
|--------|----------------|---------|
| Send confirmation email | Yes | Notify user of change |
| Invalidate other sessions | Optional | Security: force re-login everywhere |
| Keep current session | Yes | Avoid logout friction |
| Log security event | Yes | Audit trail |

### Usage Example Context

```
Component calls:
await authService.changePassword({
  currentPassword: "OldPassword123",
  newPassword: "NewSecure456!",
  confirmPassword: "NewSecure456!"
})

Service performs:
1. Validate passwords match
2. Validate new ≠ current (optional)
3. POST/PUT to /auth/change-password
4. Backend verifies current password
5. Backend validates new password strength
6. Backend hashes and updates password
7. Backend sends confirmation email
8. Return success

Component shows:
"Password changed successfully"

User stays logged in (or forced to re-login depending on policy).
```

### Comparison: Change vs Reset

| Aspect | Change Password | Reset Password |
|--------|----------------|----------------|
| Authentication | Required | Not required |
| Current password | Required | Not required |
| Token | JWT access token | Email reset token |
| Trigger | User in settings | Forgot password |
| Email step | No (already authenticated) | Yes (receives token) |

### Expected Outcome
- Password successfully changed
- Current password verified
- Strong password enforced
- User stays authenticated (or re-logs in)
- Confirmation email sent
- Proper error handling

### Verification Checklist
- [ ] changePassword function implemented
- [ ] Function accepts ChangePasswordRequest parameter
- [ ] Function returns Promise<void>
- [ ] Password match validation implemented
- [ ] Validation: new password different from current
- [ ] POST/PUT request sent to change-password endpoint
- [ ] Current password included in request
- [ ] Authentication required (access token)
- [ ] Error handling for incorrect current password
- [ ] Error handling for password validation
- [ ] JSDoc documentation added
- [ ] Type safety maintained

---

## Summary

This document has covered Tasks 22-30, implementing the authentication types and service layer for the frontend application. The key accomplishments include:

### Types Defined (Task 22)
- User interface with all profile fields
- LoginRequest and LoginResponse interfaces
- Token refresh request/response types
- Password management types (forgot, reset, change)
- AuthResponse generic wrapper

### Authentication Service Created (Task 23)
- Central authService module established
- Clean API for all auth operations
- Integration with apiClient and tokenStorage
- Consistent error handling patterns

### Authentication Functions Implemented (Tasks 24-30)

| Function | Purpose | Key Features |
|----------|---------|--------------|
| login | User authentication | Stores tokens, returns user data |
| logout | End session | Clears tokens, notifies backend |
| refreshToken | Renew access token | Seamless token refresh |
| getCurrentUser | Get user profile | Validates session |
| forgotPassword | Initiate reset | Sends reset email |
| resetPassword | Complete reset | Token-based password update |
| changePassword | Update password | Requires current password |

### Authentication Flow Overview

```
User Journey:

1. Login
   └─> Enter credentials
       └─> authService.login()
           └─> Tokens stored
               └─> User data returned

2. Using Application
   └─> API requests include access token
       └─> Token expires
           └─> Interceptor calls refreshToken()
               └─> New token obtained
                   └─> Request retried

3. Forgot Password
   └─> Enter email
       └─> authService.forgotPassword()
           └─> Email sent with token
               └─> User clicks link
                   └─> authService.resetPassword()
                       └─> Password updated

4. Change Password
   └─> Enter current + new password
       └─> authService.changePassword()
           └─> Password updated
               └─> Confirmation sent

5. Logout
   └─> User clicks logout
       └─> authService.logout()
           └─> Tokens cleared
               └─> Redirect to login
```

### Security Features Implemented
- JWT token storage and management
- Automatic token refresh
- Current password verification for changes
- One-time use reset tokens
- Token expiration handling
- Rate limiting considerations
- Secure password requirements

### Error Handling
- Network error recovery
- Authentication failure handling
- Token expiration management
- Validation error feedback
- User-friendly error messages

### Integration Points
- apiClient for HTTP requests
- tokenStorage for token management
- Type-safe interfaces throughout
- Consistent async/await patterns

### Next Steps
The authentication service is now complete and ready for:
- Integration with request/response interceptors (Group C)
- Connection to state management (e.g., Redux, Zustand)
- Use in UI components (login forms, profile pages)
- Testing and validation

This completes Group B: Authentication & Token Management.
