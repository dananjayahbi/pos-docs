# Tasks 15-21: Token Storage and Management Module

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** B - Authentication & Token Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-22-30_Auth-Types-Service.md](02_Tasks-22-30_Auth-Types-Service.md)

---

## Document Overview

This document implements the token storage layer for JWT authentication. It covers creating the token storage module with functions for getting, setting, and clearing access and refresh tokens, as well as implementing token expiration checking to support automatic token refresh mechanisms.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create Token Storage Module | Low | 10 min |
| 16 | Implement getAccessToken | Low | 5 min |
| 17 | Implement setAccessToken | Low | 5 min |
| 18 | Implement getRefreshToken | Low | 5 min |
| 19 | Implement setRefreshToken | Low | 5 min |
| 20 | Implement clearTokens | Low | 5 min |
| 21 | Implement isTokenExpired | Medium | 20 min |

---

## Task 15: Create Token Storage Module

### Overview
Create a dedicated module (lib/tokenStorage.ts) that centralizes all token storage operations. This module abstracts the storage mechanism (localStorage, sessionStorage, or cookies) and provides a consistent interface for token management throughout the application.

### Dependencies
- Task 02: Frontend directory structure established

### Instructions

1. **Create lib directory**
   - Navigate to frontend/ root
   - Create lib/ directory if not exists
   - This houses utility modules and helpers

2. **Create tokenStorage.ts file**
   - Inside lib/, create tokenStorage.ts
   - This module handles all token operations
   - Provides abstraction over storage mechanism

3. **Add module documentation**
   - Add comprehensive file header comment
   - Document token storage strategy
   - Note security considerations

4. **Define storage keys as constants**
   - Create constants for token keys
   - Use descriptive, prefixed names
   - Prevents typos and enables easy changes

### Token Storage Module Structure

```
frontend/lib/tokenStorage.ts

Purpose:
- Centralized token management
- Abstract storage mechanism
- Consistent token operations
- Security-focused implementation
```

### Storage Key Constants

```
Constants to Define:
const ACCESS_TOKEN_KEY = 'lcc_access_token'
const REFRESH_TOKEN_KEY = 'lcc_refresh_token'

Benefits:
- Consistent key usage
- Easy to change keys
- Prevents typo errors
- Clear naming convention
```

### Storage Mechanism Options

| Mechanism | Security | Persistence | XSS Vulnerable | CSRF Vulnerable |
|-----------|----------|-------------|----------------|-----------------|
| localStorage | Medium | Yes (permanent) | Yes | No |
| sessionStorage | Medium | No (tab session) | Yes | No |
| HTTP-only cookies | High | Configurable | No | Yes (mitigated) |
| Memory only | High | No (runtime only) | No | No |

### Recommended Approach: localStorage with XSS Protection

```
Strategy:
- Use localStorage for simplicity and persistence
- Implement Content Security Policy (CSP)
- Sanitize all user inputs
- Use HTTPs in production
- Consider HTTP-only cookies for production

Development: localStorage (easy debugging)
Production: Consider HTTP-only cookies (more secure)
```

### Security Considerations

#### XSS (Cross-Site Scripting) Protection
```
Risk: Malicious scripts access tokens
Mitigation:
- Implement strict CSP
- Sanitize user inputs
- Escape rendered content
- Use trusted libraries
- Regular security audits
```

#### CSRF (Cross-Site Request Forgery) Protection
```
Risk: Unauthorized requests using valid tokens
Mitigation:
- Include CSRF tokens in state-changing requests
- Verify Origin/Referer headers
- Use SameSite cookie attribute
- Implement double-submit cookie pattern
```

### Module Structure Pattern

```
File Organization:
1. Imports (if needed)
2. Constants (storage keys)
3. Access token functions
4. Refresh token functions
5. Utility functions (clear, check expiration)
6. Exports (all functions)
```

### Expected Outcome
- lib/tokenStorage.ts created
- Storage keys defined
- Module documented
- Foundation for token functions

### Verification Checklist
- [ ] lib/ directory exists
- [ ] tokenStorage.ts file created
- [ ] Module header comment added
- [ ] Storage key constants defined
- [ ] File compiles without errors

---

## Task 16: Implement getAccessToken

### Overview
Implement the getAccessToken function that retrieves the stored access token from localStorage. This function is called before making authenticated API requests to attach the token to request headers.

### Dependencies
- Task 15: Create Token Storage Module

### Instructions

1. **Define getAccessToken function**
   - Function name: getAccessToken
   - Parameters: none
   - Return type: string | null

2. **Implement token retrieval**
   - Access localStorage
   - Use ACCESS_TOKEN_KEY constant
   - Return token if exists, null otherwise

3. **Add error handling**
   - Wrap in try-catch block
   - Handle localStorage access errors
   - Return null on error

4. **Add function documentation**
   - Document return values
   - Explain when function is called
   - Note error handling behavior

### Function Signature

```
Function:
export function getAccessToken(): string | null

Purpose:
- Retrieve access token from storage
- Used before authenticated requests
- Returns null if not found or error
```

### Implementation Logic

```
Flow:
1. Try to access localStorage
2. Get item using ACCESS_TOKEN_KEY
3. Return value (string or null)
4. Catch any errors
5. Return null on error
```

### Return Value Scenarios

| Scenario | Return Value | Explanation |
|----------|-------------|-------------|
| Token exists | string | Valid token retrieved |
| No token stored | null | User not logged in |
| localStorage disabled | null | Browser settings/private mode |
| Access error | null | Permission/security error |

### Usage Context

```
When Called:
- Before authenticated API requests
- In authentication interceptor
- During token refresh check
- On app initialization (check auth state)

Usage Pattern:
const token = getAccessToken();
if (token) {
  // Attach to request header
  headers['Authorization'] = `Bearer ${token}`;
} else {
  // User not authenticated
  // Redirect to login or skip auth
}
```

### Error Scenarios

#### Browser Private Mode
```
Issue: localStorage may throw error
Cause: Privacy settings disable storage
Handling: Catch error, return null
User Experience: Show login required
```

#### Storage Quota Exceeded
```
Issue: localStorage full (rare)
Cause: Other apps using storage
Handling: Catch error, return null
Alternative: Clear old data
```

### Security Notes

```
Token Exposure:
- Token stored in plain text in localStorage
- JavaScript code can access token
- XSS vulnerabilities can steal token

Protection Measures:
- Implement CSP to prevent XSS
- Use short-lived access tokens (15 min)
- Refresh token rotation
- HTTPS only in production
```

### Expected Outcome
- getAccessToken function implemented
- Returns token or null
- Error handling included
- Function documented

### Verification Checklist
- [ ] getAccessToken function defined
- [ ] Return type: string | null
- [ ] Uses ACCESS_TOKEN_KEY constant
- [ ] Try-catch block implemented
- [ ] Function documented
- [ ] Function exported
- [ ] Test retrieval works

---

## Task 17: Implement setAccessToken

### Overview
Implement the setAccessToken function that stores the access token in localStorage. This function is called after successful login or token refresh to persist the new access token.

### Dependencies
- Task 15: Create Token Storage Module

### Instructions

1. **Define setAccessToken function**
   - Function name: setAccessToken
   - Parameters: token (string)
   - Return type: void

2. **Implement token storage**
   - Access localStorage
   - Use ACCESS_TOKEN_KEY constant
   - Store token value

3. **Add error handling**
   - Wrap in try-catch block
   - Handle storage quota errors
   - Log errors for debugging

4. **Add function documentation**
   - Document parameter
   - Explain when function is called
   - Note error handling

### Function Signature

```
Function:
export function setAccessToken(token: string): void

Purpose:
- Store access token in localStorage
- Called after login or token refresh
- Overwrites existing token
```

### Implementation Logic

```
Flow:
1. Receive token as parameter
2. Try to access localStorage
3. Set item using ACCESS_TOKEN_KEY and token value
4. Catch any errors
5. Log error for debugging
```

### When Function Called

| Event | Trigger | Action |
|-------|---------|--------|
| User login | Login success response | Store access token |
| Token refresh | Refresh success response | Update access token |
| SSO authentication | External auth success | Store received token |
| Token update | Admin token reset | Replace existing token |

### Storage Operation

```
Operation:
localStorage.setItem(ACCESS_TOKEN_KEY, token)

Effect:
- Creates new entry if not exists
- Overwrites existing entry
- Persists across browser sessions
- Available to all tabs/windows (same origin)
```

### Error Scenarios

#### Storage Quota Exceeded
```
Error: QuotaExceededError
Cause: localStorage full (5-10MB limit)
Handling:
- Catch error
- Log warning
- Optionally clear old data
- Notify user if critical
```

#### localStorage Disabled
```
Error: SecurityError or null localStorage
Cause: Browser privacy settings
Handling:
- Catch error
- Fall back to memory storage
- Warn user about session-only auth
```

### Token Overwrite Behavior

```
Scenario 1: No existing token
- setAccessToken stores new token
- User now authenticated

Scenario 2: Existing token present
- setAccessToken overwrites old token
- Happens during token refresh
- Old token becomes invalid

Scenario 3: Empty string passed
- Stores empty string (not recommended)
- Use clearTokens() instead for logout
```

### Security Considerations

```
Token Transmission:
- Tokens received over HTTPS
- Stored immediately after receipt
- Not logged or exposed in console

Token Lifecycle:
1. Receive from backend
2. Store in localStorage
3. Use for API requests
4. Refresh when expired
5. Clear on logout
```

### Expected Outcome
- setAccessToken function implemented
- Stores token in localStorage
- Error handling included
- Function documented

### Verification Checklist
- [ ] setAccessToken function defined
- [ ] Parameter: token (string)
- [ ] Uses ACCESS_TOKEN_KEY constant
- [ ] localStorage.setItem() called
- [ ] Try-catch block implemented
- [ ] Function documented
- [ ] Function exported
- [ ] Test storage works

---

## Task 18: Implement getRefreshToken

### Overview
Implement the getRefreshToken function that retrieves the stored refresh token from localStorage. Refresh tokens are used to obtain new access tokens when the current access token expires, enabling seamless authentication without requiring user re-login.

### Dependencies
- Task 15: Create Token Storage Module

### Instructions

1. **Define getRefreshToken function**
   - Function name: getRefreshToken
   - Parameters: none
   - Return type: string | null

2. **Implement token retrieval**
   - Access localStorage
   - Use REFRESH_TOKEN_KEY constant
   - Return token if exists, null otherwise

3. **Add error handling**
   - Wrap in try-catch block
   - Handle localStorage access errors
   - Return null on error

4. **Add function documentation**
   - Document return values
   - Explain refresh token purpose
   - Note usage in token refresh flow

### Function Signature

```
Function:
export function getRefreshToken(): string | null

Purpose:
- Retrieve refresh token from storage
- Used for obtaining new access tokens
- Returns null if not found or error
```

### Implementation Logic

```
Flow:
1. Try to access localStorage
2. Get item using REFRESH_TOKEN_KEY
3. Return value (string or null)
4. Catch any errors
5. Return null on error

(Identical to getAccessToken but with different key)
```

### Refresh Token vs Access Token

| Aspect | Access Token | Refresh Token |
|--------|-------------|---------------|
| Lifespan | Short (15 min) | Long (7-30 days) |
| Purpose | API authentication | Get new access token |
| Usage frequency | Every API call | Only when access expires |
| Exposure | High (many requests) | Low (refresh only) |
| Revocation | Expires naturally | Can be revoked |

### Usage Context

```
When Called:
- Access token expired (401 response)
- Token refresh function triggered
- App initialization (check if user logged in)
- Silent authentication check

Not Called:
- During normal API requests (use access token)
- On every page load (only when needed)
```

### Token Refresh Flow

```
Access Token Expiration Flow:
1. API request made with access token
2. Backend returns 401 (token expired)
3. Interceptor catches 401 error
4. getRefreshToken() called
5. If refresh token exists:
   a. Send refresh request to backend
   b. Receive new access token
   c. Store new access token
   d. Retry original request
6. If no refresh token:
   a. User session expired
   b. Redirect to login page
```

### Return Value Scenarios

| Scenario | Return Value | Action |
|----------|-------------|--------|
| Valid refresh token | string | Proceed with refresh |
| No refresh token | null | Redirect to login |
| Expired refresh token | string (but invalid) | Attempt refresh (will fail) |
| localStorage error | null | Treat as not logged in |

### Security Considerations

```
Refresh Token Security:
- Longer lifespan = higher security risk
- Must be rotated on refresh (best practice)
- Should be revoked on logout
- Can be revoked server-side

Protection Measures:
- Short access token lifespan
- Refresh token rotation
- Secure storage (consider HttpOnly cookies)
- Logout clears both tokens
```

### Expected Outcome
- getRefreshToken function implemented
- Returns refresh token or null
- Error handling included
- Function documented

### Verification Checklist
- [ ] getRefreshToken function defined
- [ ] Return type: string | null
- [ ] Uses REFRESH_TOKEN_KEY constant
- [ ] Try-catch block implemented
- [ ] Function documented
- [ ] Function exported
- [ ] Test retrieval works

---

## Task 19: Implement setRefreshToken

### Overview
Implement the setRefreshToken function that stores the refresh token in localStorage. This function is called after successful login to persist the refresh token, enabling token refresh without re-authentication.

### Dependencies
- Task 15: Create Token Storage Module

### Instructions

1. **Define setRefreshToken function**
   - Function name: setRefreshToken
   - Parameters: token (string)
   - Return type: void

2. **Implement token storage**
   - Access localStorage
   - Use REFRESH_TOKEN_KEY constant
   - Store token value

3. **Add error handling**
   - Wrap in try-catch block
   - Handle storage errors
   - Log errors for debugging

4. **Add function documentation**
   - Document parameter
   - Explain refresh token purpose
   - Note when function is called

### Function Signature

```
Function:
export function setRefreshToken(token: string): void

Purpose:
- Store refresh token in localStorage
- Called after successful login
- Enables token refresh mechanism
```

### Implementation Logic

```
Flow:
1. Receive refresh token as parameter
2. Try to access localStorage
3. Set item using REFRESH_TOKEN_KEY and token value
4. Catch any errors
5. Log error for debugging

(Identical to setAccessToken but with different key)
```

### When Function Called

| Event | Trigger | Tokens Stored |
|-------|---------|---------------|
| Initial login | Login success | Access + Refresh both |
| Token refresh | Refresh success | New access + New refresh |
| SSO login | External auth | Access + Refresh both |

### Token Pair Storage

```
Login Response:
{
  accessToken: "eyJhbGc...",   ← Store with setAccessToken()
  refreshToken: "eyJhbGc...",  ← Store with setRefreshToken()
  user: { ... }
}

Storage Operations:
setAccessToken(response.accessToken)
setRefreshToken(response.refreshToken)

Result:
localStorage['lcc_access_token'] = "eyJhbGc..."
localStorage['lcc_refresh_token'] = "eyJhbGc..."
```

### Refresh Token Rotation

```
Security Best Practice:
- Issue new refresh token on each refresh
- Invalidate old refresh token
- Prevents token theft exploitation

Rotation Flow:
1. Client sends old refresh token
2. Backend validates token
3. Backend generates new access + refresh tokens
4. Backend invalidates old refresh token
5. Client stores new tokens
6. Old refresh token no longer valid
```

### Token Storage Timing

```
Login Sequence:
1. User submits credentials
2. Backend validates credentials
3. Backend generates access + refresh tokens
4. Backend returns tokens in response
5. Frontend calls setAccessToken()
6. Frontend calls setRefreshToken()
7. Frontend stores user data
8. Redirect to dashboard

Timing: Synchronous, immediate after login response
```

### Error Handling

```
Storage Errors:
- QuotaExceededError: localStorage full
- SecurityError: Storage disabled
- General errors: Browser issues

Handling Strategy:
- Catch all errors
- Log for debugging
- Continue application flow
- Optionally notify user
```

### Security Notes

```
Refresh Token Risk:
- Long lifespan (days/weeks)
- If stolen, attacker can get access tokens
- More sensitive than access token

Mitigation:
- Rotate on every refresh
- Revoke on logout
- Detect suspicious usage patterns
- Consider HttpOnly cookies for production
```

### Expected Outcome
- setRefreshToken function implemented
- Stores refresh token in localStorage
- Error handling included
- Function documented

### Verification Checklist
- [ ] setRefreshToken function defined
- [ ] Parameter: token (string)
- [ ] Uses REFRESH_TOKEN_KEY constant
- [ ] localStorage.setItem() called
- [ ] Try-catch block implemented
- [ ] Function documented
- [ ] Function exported
- [ ] Test storage works

---

## Task 20: Implement clearTokens

### Overview
Implement the clearTokens function that removes both access and refresh tokens from localStorage. This function is called during logout to ensure the user session is completely terminated and tokens cannot be reused.

### Dependencies
- Task 15: Create Token Storage Module

### Instructions

1. **Define clearTokens function**
   - Function name: clearTokens
   - Parameters: none
   - Return type: void

2. **Remove access token**
   - Access localStorage
   - Remove item using ACCESS_TOKEN_KEY
   - Token no longer available

3. **Remove refresh token**
   - Access localStorage
   - Remove item using REFRESH_TOKEN_KEY
   - Prevents token refresh

4. **Add error handling**
   - Wrap in try-catch block
   - Handle storage access errors
   - Log errors for debugging

5. **Add function documentation**
   - Document function purpose
   - List tokens cleared
   - Note when function is called

### Function Signature

```
Function:
export function clearTokens(): void

Purpose:
- Remove access and refresh tokens
- Called during logout
- Terminates user session
```

### Implementation Logic

```
Flow:
1. Try to access localStorage
2. Remove item: ACCESS_TOKEN_KEY
3. Remove item: REFRESH_TOKEN_KEY
4. Catch any errors
5. Log error for debugging
6. Continue (best effort cleanup)
```

### Tokens Removed

```
Operation:
localStorage.removeItem(ACCESS_TOKEN_KEY)
localStorage.removeItem(REFRESH_TOKEN_KEY)

Effect:
- Access token deleted
- Refresh token deleted
- Future API requests unauthorized
- Token refresh not possible
- User must re-authenticate
```

### When Function Called

| Event | Trigger | Action |
|-------|---------|--------|
| User logout | Logout button clicked | Clear tokens, redirect to login |
| Session timeout | Inactivity timer expires | Clear tokens, show timeout message |
| Token revocation | Backend revokes token | Clear tokens on 401 response |
| Account deletion | User deletes account | Clear tokens, close session |
| Forced logout | Admin action | Clear tokens immediately |

### Logout Flow Integration

```
Complete Logout Sequence:
1. User clicks logout button
2. Call logout API endpoint (optional)
3. Backend invalidates refresh token (server-side)
4. Call clearTokens() (client-side)
5. Clear user data from state/context
6. Redirect to login page
7. Show logout success message

Timing: Synchronous, immediate
```

### Error Handling Considerations

```
Potential Errors:
- localStorage access denied
- Storage API not available
- Browser in private mode

Handling Strategy:
- Best effort cleanup
- Continue logout flow regardless
- Log error for debugging
- Don't block logout process
```

### Additional Cleanup

```
Beyond Tokens:
- Clear user data from React state
- Clear cached API responses
- Reset form data
- Clear any session-specific data
- Close WebSocket connections

Pattern:
clearTokens()  ← Clear auth tokens
clearUserState()  ← Clear application state
clearCache()  ← Clear cached data
redirectToLogin()  ← Navigate to login
```

### Security Considerations

```
Token Lifecycle Termination:
- Client-side: Tokens removed from localStorage
- Server-side: Refresh token revoked in database
- Both required for complete logout

Attack Scenario Prevention:
- Token theft before logout: Token still valid temporarily
- Mitigation: Backend refresh token revocation
- Access token expires naturally (short lifespan)
```

### Verification After Clear

```
Check Logout Complete:
const access = getAccessToken()   // Should return null
const refresh = getRefreshToken()  // Should return null

If tokens remain:
- Logout incomplete
- Review clearTokens implementation
- Check for storage errors
```

### Expected Outcome
- clearTokens function implemented
- Removes both access and refresh tokens
- Error handling included
- Function documented

### Verification Checklist
- [ ] clearTokens function defined
- [ ] Removes ACCESS_TOKEN_KEY
- [ ] Removes REFRESH_TOKEN_KEY
- [ ] Try-catch block implemented
- [ ] Function documented
- [ ] Function exported
- [ ] Test tokens cleared
- [ ] Test logout flow complete

---

## Task 21: Implement isTokenExpired

### Overview
Implement the isTokenExpired function that checks if a JWT token has expired by decoding the token and comparing the expiration timestamp with the current time. This function enables proactive token refresh before API requests fail.

### Dependencies
- Task 15: Create Token Storage Module

### Instructions

1. **Install jwt-decode library (optional)**
   - Run: pnpm add jwt-decode
   - Lightweight JWT decoder
   - Alternative: Manual Base64 decode

2. **Define isTokenExpired function**
   - Function name: isTokenExpired
   - Parameters: token (string | null)
   - Return type: boolean

3. **Handle null token**
   - If token is null, return true
   - Indicates no token present

4. **Decode JWT token**
   - Use jwt-decode library or manual decode
   - Extract payload from JWT
   - No signature verification needed

5. **Extract expiration claim**
   - Get 'exp' field from payload
   - Value is Unix timestamp (seconds)
   - Standard JWT expiration claim

6. **Compare with current time**
   - Get current timestamp
   - Convert to seconds (Date.now() / 1000)
   - Compare with exp value

7. **Return expiration status**
   - Return true if expired
   - Return true if no exp claim
   - Return false if still valid

8. **Add error handling**
   - Wrap in try-catch
   - Handle malformed tokens
   - Return true on error (safe default)

9. **Add function documentation**
   - Document parameters
   - Explain expiration logic
   - Note error handling behavior

### Function Signature

```
Function:
export function isTokenExpired(token: string | null): boolean

Purpose:
- Check if JWT token has expired
- Returns true if expired or invalid
- Returns false if valid and not expired
```

### JWT Structure Overview

```
JWT Format:
header.payload.signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNzA2MTk4NDAwfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Parts:
- Header: Algorithm and token type
- Payload: Claims (data), including exp
- Signature: Verification signature (not needed for expiration check)
```

### Payload Structure

```
Decoded Payload:
{
  "sub": "user123",              ← Subject (user ID)
  "email": "user@example.com",   ← User email
  "role": "admin",               ← User role
  "iat": 1706195200,             ← Issued at (Unix timestamp)
  "exp": 1706198400              ← Expiration (Unix timestamp)
}

Key Field: exp
- Unix timestamp in seconds
- Indicates when token expires
- Standard JWT claim
```

### Implementation Options

#### Option 1: Using jwt-decode Library
```
Advantages:
- Simple API
- Handles edge cases
- TypeScript support
- Widely used and tested

Usage:
import { jwtDecode } from 'jwt-decode';

const decoded = jwtDecode<{ exp: number }>(token);
const isExpired = decoded.exp < (Date.now() / 1000);
```

#### Option 2: Manual Base64 Decode
```
Advantages:
- No dependencies
- Lightweight
- Full control

Process:
1. Split token by '.'
2. Get payload part (index 1)
3. Base64 decode payload
4. Parse JSON
5. Extract exp field
```

### Expiration Check Logic

```
Comparison:
current_time = Date.now() / 1000    ← Current time in seconds
exp_time = decoded.exp               ← Expiration from token

If current_time >= exp_time:
  Token expired (return true)
Else:
  Token valid (return false)

Buffer Zone (Optional):
- Check expiration with buffer (e.g., 5 minutes early)
- Prevents race conditions
- Example: current_time >= (exp_time - 300)
```

### Expiration Scenarios

#### Scenario 1: Valid Token
```
Current time: 1706195800 (Jan 25, 2026 10:30:00)
Token exp: 1706198400 (Jan 25, 2026 11:13:20)
Difference: +2600 seconds (43 minutes remaining)
Result: false (not expired)
```

#### Scenario 2: Expired Token
```
Current time: 1706199000 (Jan 25, 2026 11:23:20)
Token exp: 1706198400 (Jan 25, 2026 11:13:20)
Difference: -600 seconds (expired 10 minutes ago)
Result: true (expired)
```

#### Scenario 3: Token Expiring Soon (with buffer)
```
Current time: 1706198200 (Jan 25, 2026 11:10:00)
Token exp: 1706198400 (Jan 25, 2026 11:13:20)
Difference: +200 seconds (3 minutes remaining)
Buffer: 300 seconds (5 minutes)
Result: true (treat as expired, trigger refresh)
```

### Error Handling Cases

| Error Case | Cause | Return Value | Reason |
|------------|-------|--------------|--------|
| Null token | No token provided | true | Treat as expired |
| Malformed token | Invalid JWT format | true | Safe default |
| Missing exp | Token without exp claim | true | Can't verify |
| Decode error | Corrupted token | true | Assume invalid |

### Usage in Token Refresh Flow

```
Proactive Refresh Check:
1. Before making API request
2. Get access token from storage
3. Check if token expired: isTokenExpired(token)
4. If expired:
   a. Attempt refresh with refresh token
   b. Store new access token
   c. Proceed with original request
5. If not expired:
   a. Use existing token
   b. Make request

Prevents:
- Failed API requests due to expired tokens
- Unnecessary refresh attempts
- Poor user experience
```

### Integration with API Client

```
Request Interceptor Pattern:
1. Intercept outgoing request
2. Get access token
3. Check: isTokenExpired(accessToken)
4. If expired and refresh available:
   - Refresh token first
   - Then send request with new token
5. If not expired:
   - Attach token to request
   - Send immediately
```

### Expected Outcome
- isTokenExpired function implemented
- Accurately detects token expiration
- Handles edge cases and errors
- Function documented

### Verification Checklist
- [ ] jwt-decode installed (if using library)
- [ ] isTokenExpired function defined
- [ ] Parameter: token (string | null)
- [ ] Return type: boolean
- [ ] Null token returns true
- [ ] JWT decoding implemented
- [ ] exp claim extracted
- [ ] Timestamp comparison correct
- [ ] Error handling included
- [ ] Function documented
- [ ] Function exported
- [ ] Test with valid token
- [ ] Test with expired token
- [ ] Test with malformed token

---

## Summary

This document established the token storage foundation for JWT authentication by creating the token storage module and implementing all token management functions. The module now provides:

✅ lib/tokenStorage.ts created  
✅ getAccessToken function  
✅ setAccessToken function  
✅ getRefreshToken function  
✅ setRefreshToken function  
✅ clearTokens function  
✅ isTokenExpired function with expiration checking  

The next document will create authentication type definitions and implement the authentication service with login, logout, token refresh, and user management functions.
