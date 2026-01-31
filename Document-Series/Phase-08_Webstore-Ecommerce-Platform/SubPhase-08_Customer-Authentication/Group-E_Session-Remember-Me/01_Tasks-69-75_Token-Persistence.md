# Tasks 69-75: Token Persistence and Session Management

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** E - Session & Remember Me  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-76-82_Cart-Merge-Verification.md](02_Tasks-76-82_Cart-Merge-Verification.md)

---

## Document Overview

This document covers the implementation of secure token management, storage, and refresh mechanisms for the webstore authentication system. It establishes JWT-based session management using httpOnly cookies for maximum security, automatic token refresh logic to maintain seamless user experience, and Axios interceptor integration for authenticated API requests. This creates the foundation for persistent, secure user sessions with proper token lifecycle management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create Access Token Storage | Medium | 30 min |
| 70 | Create Refresh Token Storage | Medium | 25 min |
| 71 | Create Token Auto Refresh Logic | High | 45 min |
| 72 | Create Token Expiry Detection | Medium | 30 min |
| 73 | Create Refresh Token API Call | Medium | 25 min |
| 74 | Create Logout Token Cleanup | Low | 20 min |
| 75 | Create Silent Token Refresh | High | 40 min |

---

## Task 69: Create Access Token Storage

### Overview
Create a secure token storage service that manages JWT access and refresh tokens using httpOnly cookies. This service provides methods for setting, retrieving, and clearing tokens while ensuring XSS protection through cookie-based storage instead of localStorage. The service abstracts token management operations and provides a consistent interface for all authentication-related token operations.

### Dependencies
- Task 68 (Login Submission Logic)
- Cookie management library (js-cookie)
- TypeScript configuration

### Instructions

1. **Install cookie management library**
   - Install `js-cookie` package: `npm install js-cookie`
   - Install types: `npm install -D @types/js-cookie`
   - This provides secure cookie operations in the browser

2. **Create token service directory structure**
   - Navigate to `frontend/services/storefront/auth/`
   - Create new file `tokenService.ts`
   - This centralizes all token-related operations

3. **Define token interface**
   - Create `TokenPair` interface with access and refresh tokens
   - Include optional expiry timestamps
   - Add token metadata (issued at, expires at)

4. **Implement setTokens method**
   - Accept access token and refresh token
   - Store tokens in httpOnly cookies (server-side set)
   - Return success/failure status
   - Handle remember me duration

5. **Implement getAccessToken method**
   - Retrieve access token from cookie
   - Return null if not found or expired
   - Handle cookie parsing errors gracefully

6. **Implement getRefreshToken method**
   - Retrieve refresh token from cookie
   - Return null if not found or expired
   - Validate token format before returning

7. **Implement clearTokens method**
   - Remove all authentication cookies
   - Clear any cached token data
   - Ensure complete cleanup

8. **Add token validation helper**
   - Check if token is valid (not expired)
   - Decode JWT payload (without verification)
   - Extract expiry time from token
   - Return boolean validity status

### Token Service Interface

```typescript
interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
}

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  // Additional JWT claims
}
```

### Cookie Configuration

| Cookie Name | Purpose | Expiry | HttpOnly | Secure | SameSite |
|-------------|---------|--------|----------|--------|----------|
| access_token | API authentication | 15 min | Yes | Yes (prod) | Strict |
| refresh_token | Token refresh | 7 days | Yes | Yes (prod) | Strict |

### Security Considerations

| Threat | Mitigation |
|--------|------------|
| XSS Attacks | httpOnly cookies (no JS access) |
| CSRF Attacks | SameSite=Strict policy |
| Token Theft | Secure flag (HTTPS only) |
| Token Exposure | Short expiry times |

### Service Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| setTokens | tokens, rememberMe | void | Store token pair in cookies |
| getAccessToken | - | string \| null | Retrieve access token |
| getRefreshToken | - | string \| null | Retrieve refresh token |
| clearTokens | - | void | Remove all auth cookies |
| isTokenValid | token | boolean | Check token expiry |
| decodeToken | token | DecodedToken \| null | Decode JWT payload |

### Code Structure

```typescript
// frontend/services/storefront/auth/tokenService.ts
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenService = {
  setTokens(tokens: TokenPair, rememberMe: boolean = false) {
    // Implementation
  },
  
  getAccessToken(): string | null {
    // Implementation
  },
  
  getRefreshToken(): string | null {
    // Implementation
  },
  
  clearTokens(): void {
    // Implementation
  },
  
  isTokenValid(token: string): boolean {
    // Implementation
  },
  
  decodeToken<T = DecodedToken>(token: string): T | null {
    // Implementation
  }
};
```

### Expected Outcome
- Token service module with complete CRUD operations
- Secure cookie-based storage implementation
- Token validation and decoding utilities
- Ready for integration with authentication flow

### Verification Checklist
- [ ] `tokenService.ts` file created in correct directory
- [ ] All methods implemented with proper types
- [ ] Cookie configuration matches security requirements
- [ ] Token validation works correctly
- [ ] JWT decoding handles errors gracefully
- [ ] Service exports all necessary methods

---

## Task 70: Create Refresh Token Storage

### Overview
Implement specialized storage and management for refresh tokens with extended expiry times. Refresh tokens are long-lived credentials that allow obtaining new access tokens without requiring the user to re-authenticate. This task creates secure storage mechanisms with different expiry durations based on "remember me" preference, and ensures proper rotation and revocation strategies.

### Dependencies
- Task 69 (Access Token Storage)
- Server-side refresh token endpoint

### Instructions

1. **Extend tokenService for refresh token specifics**
   - Open `frontend/services/storefront/auth/tokenService.ts`
   - Add refresh token specific configuration
   - Define expiry duration constants

2. **Define refresh token expiry durations**
   - Standard session: 7 days
   - Remember me session: 30 days
   - Store in environment variables for flexibility

3. **Implement setRefreshToken method**
   - Store refresh token with appropriate expiry
   - Apply remember me duration if flag is true
   - Use httpOnly, secure, and SameSite flags
   - Handle cookie options dynamically

4. **Add refresh token rotation logic**
   - Clear old refresh token before storing new one
   - Prevent token reuse vulnerabilities
   - Log rotation for security audit trail

5. **Implement refresh token validation**
   - Check token expiry before use
   - Validate token structure and signature (basic)
   - Return validation status

6. **Create refresh token metadata storage**
   - Store token issued timestamp
   - Track last refresh time
   - Monitor refresh frequency for suspicious activity

7. **Add refresh token revocation support**
   - Method to invalidate refresh token
   - Clear token from storage immediately
   - Trigger server-side revocation call

### Refresh Token Configuration

| Setting | Standard Session | Remember Me |
|---------|------------------|-------------|
| Expiry Duration | 7 days | 30 days |
| Cookie Name | refresh_token | refresh_token |
| HttpOnly | Yes | Yes |
| Secure | Yes (production) | Yes (production) |
| SameSite | Strict | Strict |
| Path | / | / |

### Token Rotation Strategy

```
Login/Register
    │
    ▼
Issue Refresh Token (RT1)
    │
    ▼
Access Token Expires
    │
    ▼
Use RT1 → Get New Access Token + RT2
    │
    ▼
Invalidate RT1 (one-time use)
    │
    ▼
Store RT2 for next refresh
```

### Refresh Token Lifecycle

| Stage | Action | Token State |
|-------|--------|-------------|
| Issue | Create and store | Active |
| Refresh | Use once, get new | Rotated |
| Expiry | Auto-invalidate | Expired |
| Logout | Explicitly revoke | Revoked |
| Theft Detection | Force revoke all | Compromised |

### Extended Service Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| setRefreshToken | token, rememberMe | void | Store refresh token with duration |
| rotateRefreshToken | oldToken, newToken | void | Replace old with new token |
| validateRefreshToken | - | boolean | Check if refresh token is valid |
| revokeRefreshToken | - | Promise<void> | Server-side revocation |
| getRefreshTokenMetadata | - | TokenMetadata \| null | Get token info |

### Security Best Practices

| Practice | Implementation |
|----------|----------------|
| Token Rotation | New refresh token on each use |
| One-Time Use | Invalidate old token after refresh |
| Expiry Limits | Maximum 30 days lifetime |
| Secure Storage | httpOnly cookies only |
| Revocation | Server-side token blacklist |

### Code Extension

```typescript
// Additional methods in tokenService.ts
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const REFRESH_TOKEN_REMEMBER_DAYS = 30;

export const tokenService = {
  // ... existing methods ...
  
  setRefreshToken(token: string, rememberMe: boolean = false): void {
    const expiryDays = rememberMe 
      ? REFRESH_TOKEN_REMEMBER_DAYS 
      : REFRESH_TOKEN_EXPIRY_DAYS;
    
    Cookies.set(REFRESH_TOKEN_KEY, token, {
      expires: expiryDays,
      httpOnly: true, // Note: httpOnly only works server-side
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },
  
  rotateRefreshToken(newToken: string, rememberMe: boolean = false): void {
    this.clearRefreshToken();
    this.setRefreshToken(newToken, rememberMe);
  },
  
  clearRefreshToken(): void {
    Cookies.remove(REFRESH_TOKEN_KEY);
  },
  
  validateRefreshToken(): boolean {
    const token = this.getRefreshToken();
    if (!token) return false;
    return this.isTokenValid(token);
  }
};
```

### Expected Outcome
- Refresh token storage with configurable expiry
- Token rotation mechanism implemented
- Validation and revocation capabilities
- Support for remember me functionality

### Verification Checklist
- [ ] Refresh token storage methods added
- [ ] Expiry duration properly configured
- [ ] Token rotation logic implemented
- [ ] Remember me duration supported
- [ ] Validation methods working correctly
- [ ] Security flags properly set on cookies

---

## Task 71: Create Token Auto Refresh Logic

### Overview
Implement automatic token refresh mechanism that proactively refreshes access tokens before they expire. This creates a seamless user experience by preventing authentication interruptions during active sessions. The logic monitors token expiry, triggers refresh operations at appropriate times, and handles edge cases like concurrent requests and network failures.

### Dependencies
- Task 70 (Refresh Token Storage)
- Refresh token API endpoint on backend
- React hooks for lifecycle management

### Instructions

1. **Create token refresh hook directory**
   - Navigate to `frontend/hooks/storefront/`
   - Create new file `useTokenRefresh.ts`
   - This hook manages automatic refresh lifecycle

2. **Define refresh timing constants**
   - Set refresh threshold: 2 minutes before expiry
   - Define minimum refresh interval: 1 minute
   - Configure retry attempts and backoff strategy

3. **Implement token expiry calculation**
   - Decode access token to get expiry time
   - Calculate time remaining until expiry
   - Determine if refresh is needed

4. **Create refresh timer logic**
   - Set up timer to check token expiry
   - Trigger refresh when threshold reached
   - Clear timer on component unmount

5. **Implement refresh request handler**
   - Call refresh token API endpoint
   - Handle successful refresh (store new tokens)
   - Handle failed refresh (logout user)
   - Queue pending requests during refresh

6. **Add concurrent refresh prevention**
   - Use lock/flag to prevent multiple simultaneous refreshes
   - Queue subsequent refresh attempts
   - Release lock after completion or failure

7. **Implement retry logic with exponential backoff**
   - Retry failed refresh attempts (max 3 times)
   - Increase wait time between retries
   - Force logout after max retries exceeded

8. **Add refresh event broadcasting**
   - Emit event when refresh succeeds
   - Notify components to retry failed requests
   - Update global auth state

### Token Refresh Timing

```
Access Token Lifecycle (15 min)
├─────────────┬─────────────┬──────┤
0 min         13 min        15 min
              ▲              ▲
              │              │
         Refresh Triggered   Expired
         (2 min before)      
```

### Refresh Decision Logic

| Time Remaining | Action | Reason |
|----------------|--------|--------|
| > 2 minutes | No action | Token still valid |
| ≤ 2 minutes | Trigger refresh | Proactive renewal |
| Expired | Force logout | Token invalid |
| No token | Skip | Not authenticated |

### Refresh Process Flow

```
Check Token Expiry
    │
    ├─ Valid & Fresh → Continue
    │
    ├─ Valid & Near Expiry (≤2 min)
    │   │
    │   ▼
    │   Acquire Refresh Lock
    │   │
    │   ├─ Lock Acquired
    │   │   ├─ Call Refresh API
    │   │   │   ├─ Success → Store New Tokens → Release Lock
    │   │   │   └─ Failure → Retry → Max Retries → Logout
    │   │   
    │   └─ Lock Busy → Wait for Completion
    │
    └─ Expired → Force Logout
```

### Hook Interface

```typescript
interface UseTokenRefreshReturn {
  isRefreshing: boolean;
  lastRefresh: Date | null;
  refreshToken: () => Promise<void>;
  scheduleRefresh: () => void;
  cancelRefresh: () => void;
}

interface RefreshConfig {
  refreshThreshold: number; // seconds before expiry
  retryAttempts: number;
  retryDelay: number; // milliseconds
}
```

### Refresh Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Refresh Threshold | 120 seconds | Trigger refresh 2 min before expiry |
| Check Interval | 30 seconds | How often to check expiry |
| Max Retry Attempts | 3 | Failed refresh retry limit |
| Retry Delay | 1000ms → 2000ms → 4000ms | Exponential backoff |
| Minimum Interval | 60 seconds | Prevent excessive refreshes |

### Concurrent Request Handling

| Scenario | Handling Strategy |
|----------|-------------------|
| Refresh in progress | Queue new requests |
| Refresh completes | Retry queued requests with new token |
| Refresh fails | Reject queued requests, logout |
| Multiple tabs | Use localStorage event for sync |

### Code Structure

```typescript
// frontend/hooks/storefront/useTokenRefresh.ts
import { useEffect, useRef, useState } from 'react';
import { tokenService } from '@/services/storefront/auth/tokenService';
import { refreshTokenAPI } from '@/services/storefront/auth/authAPI';

const REFRESH_THRESHOLD = 120; // seconds
const CHECK_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;

export function useTokenRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const refreshLockRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const refreshToken = async (): Promise<void> => {
    // Implementation
  };

  const scheduleRefresh = (): void => {
    // Implementation
  };

  const cancelRefresh = (): void => {
    // Implementation
  };

  useEffect(() => {
    scheduleRefresh();
    return () => cancelRefresh();
  }, []);

  return {
    isRefreshing,
    lastRefresh,
    refreshToken,
    scheduleRefresh,
    cancelRefresh
  };
}
```

### Expected Outcome
- Automatic token refresh before expiry
- Seamless user experience without interruptions
- Proper handling of edge cases and failures
- Concurrent request prevention

### Verification Checklist
- [ ] Token refresh hook created
- [ ] Expiry calculation implemented correctly
- [ ] Timer logic working as expected
- [ ] Concurrent refresh prevented
- [ ] Retry logic with backoff implemented
- [ ] Failed refresh triggers logout
- [ ] Refresh events broadcast properly

---

## Task 72: Create Token Expiry Detection

### Overview
Implement comprehensive token expiry detection system that monitors access token validity and triggers appropriate actions based on token state. This system continuously checks token expiry, provides early warnings for upcoming expirations, and coordinates with the refresh mechanism to maintain uninterrupted user sessions. It serves as the central monitoring component for token lifecycle management.

### Dependencies
- Task 71 (Token Auto Refresh Logic)
- JWT decoding library (jwt-decode)

### Instructions

1. **Create expiry detection utility**
   - Navigate to `frontend/lib/utils/`
   - Create new file `tokenExpiry.ts`
   - Implement token expiry calculation functions

2. **Implement getTokenExpiry function**
   - Decode JWT token payload
   - Extract 'exp' claim (expiry timestamp)
   - Convert to JavaScript Date object
   - Handle invalid tokens gracefully

3. **Create getTimeUntilExpiry function**
   - Calculate difference between now and expiry
   - Return time remaining in seconds
   - Return 0 if token already expired
   - Handle timezone considerations

4. **Implement isTokenExpired function**
   - Check if current time > expiry time
   - Add small buffer (5 seconds) for clock skew
   - Return boolean expired status

5. **Create shouldRefreshToken function**
   - Check if time remaining ≤ refresh threshold
   - Consider token as "expiring soon"
   - Return boolean refresh recommendation

6. **Add token validity window check**
   - Verify token not expired
   - Verify token issued in past (not future)
   - Detect suspicious tokens

7. **Implement expiry event emitter**
   - Create custom event for expiry warnings
   - Emit event at specific time intervals
   - Allow components to subscribe to events

8. **Create expiry monitoring hook**
   - New hook `useTokenExpiry` for components
   - Return expiry state (valid, expiring, expired)
   - Provide time remaining for UI display
   - Trigger callbacks at specific thresholds

### Token Expiry States

| State | Condition | Time Remaining | Action |
|-------|-----------|----------------|--------|
| Valid | Fresh token | > 2 minutes | Normal operation |
| Expiring | Near expiry | ≤ 2 minutes | Trigger refresh |
| Expired | Past expiry time | ≤ 0 | Force logout |
| Invalid | Malformed/missing | N/A | Logout |

### Expiry Detection Timeline

```
Token Issued (t=0)          Access Token (15 min)
│                           ├────────────────────────┤
│                           
├── Valid State             [0 min - 13 min]
│   └─ Normal API calls
│
├── Expiring State          [13 min - 15 min]
│   ├─ Trigger auto-refresh
│   └─ Show warning (optional)
│
└── Expired State           [> 15 min]
    └─ Force logout
```

### Utility Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| getTokenExpiry | token: string | Date \| null | Extract expiry date from JWT |
| getTimeUntilExpiry | token: string | number | Seconds until expiry (0 if expired) |
| isTokenExpired | token: string | boolean | Check if token is expired |
| shouldRefreshToken | token: string, threshold: number | boolean | Check if refresh needed |
| isTokenValid | token: string | boolean | Comprehensive validity check |
| getExpiryPercentage | token: string | number | 0-100% of token lifetime used |

### Expiry Thresholds

| Threshold | Value | Trigger |
|-----------|-------|---------|
| Refresh Threshold | 120 seconds | Auto-refresh starts |
| Warning Threshold | 300 seconds (5 min) | Show session expiry warning |
| Critical Threshold | 60 seconds | Urgent warning |
| Buffer | 5 seconds | Clock skew tolerance |

### Clock Skew Handling

| Scenario | Mitigation |
|----------|------------|
| Server ahead of client | Add 5-second buffer to expiry |
| Client ahead of server | Subtract 5 seconds from current time |
| Significant skew (>1 min) | Log warning, use server time |

### Code Structure

```typescript
// frontend/lib/utils/tokenExpiry.ts
import { jwtDecode } from 'jwt-decode';

const CLOCK_SKEW_BUFFER = 5; // seconds
const REFRESH_THRESHOLD = 120; // seconds

export interface TokenExpiryInfo {
  expiresAt: Date;
  issuedAt: Date;
  isExpired: boolean;
  shouldRefresh: boolean;
  timeRemaining: number; // seconds
  expiryPercentage: number; // 0-100
}

export const tokenExpiryUtils = {
  getTokenExpiry(token: string): Date | null {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  },

  getTimeUntilExpiry(token: string): number {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return 0;
    
    const now = Date.now();
    const timeRemaining = Math.floor((expiry.getTime() - now) / 1000);
    return Math.max(0, timeRemaining);
  },

  isTokenExpired(token: string): boolean {
    const timeRemaining = this.getTimeUntilExpiry(token);
    return timeRemaining <= CLOCK_SKEW_BUFFER;
  },

  shouldRefreshToken(token: string): boolean {
    const timeRemaining = this.getTimeUntilExpiry(token);
    return timeRemaining > 0 && timeRemaining <= REFRESH_THRESHOLD;
  },

  getTokenExpiryInfo(token: string): TokenExpiryInfo | null {
    // Implementation
  }
};
```

### Hook Interface

```typescript
// frontend/hooks/storefront/useTokenExpiry.ts
export interface UseTokenExpiryReturn {
  isExpired: boolean;
  isExpiring: boolean;
  timeRemaining: number;
  expiryDate: Date | null;
  expiryPercentage: number;
  refreshNeeded: boolean;
}

export function useTokenExpiry(): UseTokenExpiryReturn {
  // Implementation with polling
}
```

### Expiry Event System

| Event | Trigger | Payload | Purpose |
|-------|---------|---------|---------|
| token:expiring | 5 min before | { timeRemaining } | Show warning |
| token:refresh-needed | 2 min before | { token } | Trigger refresh |
| token:expired | On expiry | { reason } | Force logout |
| token:invalid | Bad token | { error } | Security alert |

### Expected Outcome
- Accurate token expiry detection
- Multiple expiry state monitoring
- Event-based expiry notifications
- React hook for component integration
- Clock skew tolerance

### Verification Checklist
- [ ] Token expiry utilities created
- [ ] JWT decoding working correctly
- [ ] Time calculations accurate
- [ ] Clock skew buffer applied
- [ ] Expiry states properly detected
- [ ] Hook returns correct values
- [ ] Events emitted at right times

---

## Task 73: Create Refresh Token API Call

### Overview
Implement the API call to the backend refresh token endpoint that exchanges a valid refresh token for a new access token (and optionally a new refresh token). This creates the communication layer between the frontend token refresh logic and the backend authentication service. The implementation includes error handling, retry logic, and proper token rotation to maintain security.

### Dependencies
- Task 72 (Token Expiry Detection)
- Backend refresh token endpoint: `POST /api/customer-auth/token/refresh`
- Axios instance configuration

### Instructions

1. **Create auth API service file**
   - Navigate to `frontend/services/storefront/auth/`
   - Create or extend `authAPI.ts`
   - Centralize all authentication API calls

2. **Define refresh token request interface**
   - Create `RefreshTokenRequest` type
   - Include refresh token field
   - Add device/client metadata (optional)

3. **Define refresh token response interface**
   - Create `RefreshTokenResponse` type
   - Include new access token
   - Include new refresh token (if rotated)
   - Add expiry information

4. **Implement refreshAccessToken function**
   - Create async function to call refresh endpoint
   - Use Axios POST request
   - Send refresh token in request body or cookie
   - Handle response data

5. **Add request configuration**
   - Set appropriate headers (Content-Type)
   - Include credentials for cookie-based auth
   - Set timeout (5 seconds)
   - Disable retry on 401 (to prevent loops)

6. **Implement success response handler**
   - Extract new tokens from response
   - Store tokens using tokenService
   - Update last refresh timestamp
   - Return success status

7. **Add error response handler**
   - Detect specific error types (expired, invalid, revoked)
   - Map backend errors to frontend states
   - Trigger logout on terminal errors
   - Throw custom errors for retry logic

8. **Create API call wrapper with retry**
   - Wrap refreshAccessToken with retry logic
   - Implement exponential backoff
   - Max 2 retries for network errors only
   - Skip retry for 401/403 errors

### API Endpoint Specification

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/api/customer-auth/token/refresh` |
| Content-Type | application/json |
| Credentials | include (for cookies) |
| Timeout | 5000ms |

### Request Format

```typescript
interface RefreshTokenRequest {
  refreshToken?: string; // If not using cookies
  deviceId?: string;     // Optional device tracking
  fingerprint?: string;  // Optional security fingerprint
}
```

### Response Format

```typescript
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string; // New refresh token if rotated
  expiresIn: number;     // Seconds until expiry
  tokenType: 'Bearer';
}
```

### Error Response Handling

| Status Code | Error Type | Action | Retry? |
|-------------|-----------|--------|--------|
| 200 | Success | Store tokens | N/A |
| 401 | Invalid/Expired | Logout user | No |
| 403 | Revoked/Blocked | Logout user | No |
| 429 | Rate Limited | Wait and retry | Yes |
| 500 | Server Error | Retry with backoff | Yes |
| Network | Timeout/Offline | Retry with backoff | Yes |

### Refresh Token Flow

```
Frontend                     Backend
   │                            │
   ├─── POST /token/refresh ───>│
   │    (with refresh token)    │
   │                            │
   │                            ├─ Validate refresh token
   │                            ├─ Check token not revoked
   │                            ├─ Verify token signature
   │                            │
   │                            ├─ Generate new access token
   │                            └─ Rotate refresh token (optional)
   │                            │
   │<─── 200 OK ─────────────────┤
   │    { accessToken,           │
   │      refreshToken,          │
   │      expiresIn }            │
   │                            │
   ├─ Store new tokens          │
   └─ Continue session          │
```

### Code Implementation

```typescript
// frontend/services/storefront/auth/authAPI.ts
import axios, { AxiosError } from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const REFRESH_ENDPOINT = '/api/customer-auth/token/refresh';
const REFRESH_TIMEOUT = 5000;

export interface RefreshTokenRequest {
  refreshToken?: string;
  deviceId?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export class RefreshTokenError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isTerminal: boolean = false
  ) {
    super(message);
    this.name = 'RefreshTokenError';
  }
}

export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  try {
    const refreshToken = tokenService.getRefreshToken();
    
    if (!refreshToken) {
      throw new RefreshTokenError('No refresh token available', 401, true);
    }

    const response = await axios.post<RefreshTokenResponse>(
      `${API_BASE_URL}${REFRESH_ENDPOINT}`,
      { refreshToken },
      {
        timeout: REFRESH_TIMEOUT,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Store new tokens
    if (response.data.accessToken) {
      tokenService.setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken || refreshToken
      });
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      
      if (axiosError.response) {
        const { status, data } = axiosError.response;
        const message = data?.message || 'Token refresh failed';
        
        // Terminal errors (should not retry)
        if (status === 401 || status === 403) {
          throw new RefreshTokenError(message, status, true);
        }
        
        // Retryable errors
        throw new RefreshTokenError(message, status, false);
      }
      
      // Network error (retryable)
      throw new RefreshTokenError('Network error during token refresh', undefined, false);
    }
    
    throw new RefreshTokenError('Unknown error during token refresh', undefined, false);
  }
}

export async function refreshAccessTokenWithRetry(
  maxRetries: number = 2
): Promise<RefreshTokenResponse> {
  let lastError: RefreshTokenError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await refreshAccessToken();
    } catch (error) {
      if (error instanceof RefreshTokenError) {
        lastError = error;
        
        // Don't retry terminal errors
        if (error.isTerminal) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  
  throw lastError!;
}
```

### Retry Configuration

| Attempt | Delay | Total Wait |
|---------|-------|------------|
| 1st | Immediate | 0s |
| 2nd | 1 second | 1s |
| 3rd | 2 seconds | 3s |
| Max | 3 attempts | 3s total |

### Integration Points

| Component | Usage |
|-----------|-------|
| useTokenRefresh hook | Calls this API periodically |
| Axios interceptor | Calls on 401 response |
| Auth context | Calls during hydration |
| Session warning | Calls when user clicks "Stay Logged In" |

### Expected Outcome
- Working refresh token API call
- Proper error handling and retry logic
- Token rotation support
- Integration with token storage service

### Verification Checklist
- [ ] Auth API service file created
- [ ] Refresh endpoint configured correctly
- [ ] Request/response interfaces defined
- [ ] Error handling implemented
- [ ] Retry logic working with backoff
- [ ] Token storage integration complete
- [ ] Terminal vs retryable errors distinguished

---

## Task 74: Create Logout Token Cleanup

### Overview
Implement comprehensive token cleanup logic that securely removes all authentication tokens and related data during logout. This ensures complete session termination, prevents token reuse, and maintains security by clearing all client-side authentication state. The cleanup process coordinates with the backend to invalidate tokens server-side as well.

### Dependencies
- Task 73 (Refresh Token API Call)
- Token storage service (tokenService)
- Auth state management (useAuthStore)

### Instructions

1. **Create logout service function**
   - Navigate to `frontend/services/storefront/auth/`
   - Extend `authAPI.ts` with logout functions
   - Create separate client and server cleanup functions

2. **Implement clearClientTokens function**
   - Remove access token from storage
   - Remove refresh token from storage
   - Clear any cached token data
   - Remove token-related cookies
   - Clear auth state in Zustand store

3. **Add clearAuthCookies helper**
   - Remove all authentication cookies
   - Clear across all domains (if multi-domain)
   - Handle httpOnly cookies (cleared server-side)
   - Clear any session-related cookies

4. **Implement clearAuthState function**
   - Reset Zustand auth store to initial state
   - Clear user profile data
   - Reset authentication status
   - Clear any cached user permissions

5. **Create backend logout API call**
   - Call `/api/customer-auth/logout` endpoint
   - Send refresh token for server-side invalidation
   - Add to server-side token blacklist
   - Handle both success and error responses

6. **Implement complete logout flow**
   - Create `performLogout` function
   - Call backend logout API first
   - Then clear client-side tokens
   - Clear auth state
   - Emit logout event for other components

7. **Add cleanup verification**
   - After cleanup, verify no tokens remain
   - Check all storage locations cleared
   - Ensure auth state reset
   - Log cleanup completion for debugging

8. **Handle logout edge cases**
   - Offline logout (no backend call)
   - Partial cleanup on API failure
   - Force logout (skip backend call)
   - Cross-tab logout synchronization

### Token Cleanup Locations

| Location | Items to Clear | Method |
|----------|----------------|--------|
| Cookies | access_token, refresh_token | Cookies.remove() |
| Zustand Store | user, isAuthenticated, tokens | store.reset() |
| Memory Cache | Decoded token data | Variable reset |
| Local Storage | auth_state (if used) | localStorage.removeItem() |
| Session Storage | temp_auth_data (if used) | sessionStorage.clear() |

### Logout Flow Diagram

```
User Clicks Logout
    │
    ▼
Initiate Logout
    │
    ├─ Call Backend API
    │   ├─ Success: Token blacklisted
    │   └─ Failure: Continue anyway (offline)
    │
    ├─ Clear Client Tokens
    │   ├─ Remove access token cookie
    │   ├─ Remove refresh token cookie
    │   └─ Clear storage
    │
    ├─ Clear Auth State
    │   ├─ Reset Zustand store
    │   ├─ Clear user data
    │   └─ Set isAuthenticated = false
    │
    ├─ Emit Logout Event
    │   └─ Notify other tabs/components
    │
    └─ Redirect to Login
        └─ Navigate to /login
```

### Backend Logout API

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/api/customer-auth/logout` |
| Headers | Authorization: Bearer {accessToken} |
| Body | { refreshToken: string } |
| Response | { success: boolean, message: string } |

### Cleanup Verification Checklist

| Item | Check Method | Expected Result |
|------|--------------|-----------------|
| Access Token | tokenService.getAccessToken() | null |
| Refresh Token | tokenService.getRefreshToken() | null |
| User State | useAuthStore.getState().user | null |
| Auth Status | useAuthStore.getState().isAuthenticated | false |
| Auth Cookies | document.cookie | No auth cookies |

### Code Implementation

```typescript
// frontend/services/storefront/auth/authAPI.ts
import Cookies from 'js-cookie';
import { tokenService } from './tokenService';
import { useAuthStore } from '@/stores/storefront/authStore';

const LOGOUT_ENDPOINT = '/api/customer-auth/logout';

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export async function logoutBackend(): Promise<LogoutResponse> {
  try {
    const refreshToken = tokenService.getRefreshToken();
    const accessToken = tokenService.getAccessToken();
    
    const response = await axios.post<LogoutResponse>(
      `${API_BASE_URL}${LOGOUT_ENDPOINT}`,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Backend logout failed:', error);
    // Return success anyway to continue client cleanup
    return { success: false, message: 'Backend logout failed' };
  }
}

export function clearClientTokens(): void {
  // Clear tokens via service
  tokenService.clearTokens();
  
  // Extra cleanup for any remaining cookies
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('session_id');
  
  // Clear any localStorage items
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_state');
    sessionStorage.removeItem('temp_auth_data');
  }
}

export function clearAuthState(): void {
  const authStore = useAuthStore.getState();
  
  // Reset to initial state
  authStore.logout(); // Assuming logout action exists
  
  // Alternatively, manually reset
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    tokens: null
  });
}

export async function performLogout(
  options: {
    callBackend?: boolean;
    emitEvent?: boolean;
  } = {}
): Promise<void> {
  const {
    callBackend = true,
    emitEvent = true
  } = options;
  
  try {
    // Step 1: Call backend logout
    if (callBackend) {
      await logoutBackend();
    }
    
    // Step 2: Clear client tokens
    clearClientTokens();
    
    // Step 3: Clear auth state
    clearAuthState();
    
    // Step 4: Emit logout event for other tabs
    if (emitEvent && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:logout'));
      
      // Also use localStorage event for cross-tab sync
      localStorage.setItem('logout_event', Date.now().toString());
      localStorage.removeItem('logout_event');
    }
    
    console.log('Logout completed successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    // Continue cleanup even if error occurs
    clearClientTokens();
    clearAuthState();
  }
}

export function verifyCleanupComplete(): boolean {
  const hasAccessToken = tokenService.getAccessToken() !== null;
  const hasRefreshToken = tokenService.getRefreshToken() !== null;
  const { isAuthenticated } = useAuthStore.getState();
  
  const isClean = !hasAccessToken && !hasRefreshToken && !isAuthenticated;
  
  if (!isClean) {
    console.warn('Cleanup verification failed:', {
      hasAccessToken,
      hasRefreshToken,
      isAuthenticated
    });
  }
  
  return isClean;
}
```

### Edge Case Handling

| Scenario | Handling |
|----------|----------|
| Offline Logout | Skip backend call, clear client only |
| Backend API Error | Log error, continue with client cleanup |
| Partial Cleanup | Force complete cleanup on next attempt |
| Multiple Tabs | Use localStorage event for synchronization |
| Expired Tokens | Clear anyway, skip backend validation |

### Cross-Tab Logout Synchronization

```typescript
// Listen for logout events in other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'logout_event') {
      // Another tab triggered logout
      clearClientTokens();
      clearAuthState();
      // Redirect to login
      window.location.href = '/login';
    }
  });
  
  // Also listen for custom events in same tab
  window.addEventListener('auth:logout', () => {
    // Handle logout in current tab
  });
}
```

### Expected Outcome
- Complete token cleanup function
- Backend logout API integration
- Auth state reset logic
- Cross-tab logout synchronization
- Verification mechanism

### Verification Checklist
- [ ] clearClientTokens function implemented
- [ ] Backend logout API call working
- [ ] Auth state reset correctly
- [ ] All storage locations cleared
- [ ] Cross-tab synchronization working
- [ ] Edge cases handled properly
- [ ] Cleanup verification passing

---

## Task 75: Create Silent Token Refresh

### Overview
Implement silent token refresh mechanism that transparently refreshes expired access tokens without user interaction or visible UI disruption. This creates a seamless authentication experience by automatically recovering from token expiration, retrying failed API requests with new tokens, and maintaining active user sessions without interruption. The implementation uses Axios interceptors to catch 401 errors and handle refresh logic transparently.

### Dependencies
- Task 74 (Logout Token Cleanup)
- Axios instance with interceptors
- Token refresh hook (useTokenRefresh)

### Instructions

1. **Create Axios interceptor configuration file**
   - Navigate to `frontend/lib/axios/`
   - Create new file `axiosInterceptor.ts`
   - Configure request and response interceptors

2. **Implement request interceptor**
   - Attach access token to Authorization header
   - Get token from tokenService
   - Format as "Bearer {token}"
   - Skip for public endpoints (login, register)

3. **Create response success interceptor**
   - Pass through successful responses unchanged
   - No modifications needed for 2xx responses

4. **Implement response error interceptor**
   - Catch all response errors
   - Detect 401 Unauthorized errors
   - Distinguish between token expiry and other 401s
   - Initiate silent refresh for token expiry

5. **Add request queue during refresh**
   - Store failed requests in queue
   - Prevent multiple simultaneous refresh attempts
   - Wait for refresh to complete
   - Retry queued requests with new token

6. **Implement silent refresh flow**
   - Call refresh token API
   - Update stored tokens on success
   - Retry original failed request with new token
   - Return retried request response to caller

7. **Add refresh failure handling**
   - Detect refresh token expiry
   - Clear tokens and logout on refresh failure
   - Reject all queued requests
   - Redirect to login page

8. **Create refresh lock mechanism**
   - Use flag to track refresh in progress
   - Queue new 401 requests during refresh
   - Release lock after refresh completes/fails
   - Prevent refresh loops

9. **Add public endpoint exclusion**
   - Define list of public endpoints
   - Skip token attachment for these endpoints
   - Skip refresh retry for these endpoints
   - Allow anonymous access

### Silent Refresh Flow

```
API Request with Expired Token
    │
    ▼
Axios Request Interceptor
    │
    ├─ Attach access token
    └─ Send request
    │
    ▼
Server Returns 401
    │
    ▼
Axios Response Interceptor
    │
    ├─ Detect 401 error
    ├─ Check if refresh in progress
    │   ├─ Yes: Queue request, wait
    │   └─ No: Acquire lock, start refresh
    │
    ▼
Call Refresh Token API
    │
    ├─ Success
    │   ├─ Store new tokens
    │   ├─ Retry original request with new token
    │   ├─ Retry queued requests
    │   └─ Return success response
    │
    └─ Failure
        ├─ Clear tokens
        ├─ Logout user
        ├─ Reject queued requests
        └─ Redirect to login
```

### Request Queue Management

| State | Action | Queued Requests |
|-------|--------|-----------------|
| No Refresh | Normal operation | None |
| Refresh Started | Queue new 401s | Accumulating |
| Refresh Success | Retry all | Being retried |
| Refresh Failed | Reject all | All rejected |

### Axios Interceptor Configuration

```typescript
// frontend/lib/axios/axiosInterceptor.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { tokenService } from '@/services/storefront/auth/tokenService';
import { refreshAccessTokenWithRetry } from '@/services/storefront/auth/authAPI';
import { performLogout } from '@/services/storefront/auth/authAPI';

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/api/customer-auth/login',
  '/api/customer-auth/register',
  '/api/customer-auth/forgot-password',
  '/api/customer-auth/reset-password',
  '/api/customer-auth/token/refresh'
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

export function setupInterceptors(axiosInstance: AxiosInstance): void {
  // Request Interceptor: Attach access token
  axiosInstance.interceptors.request.use(
    (config) => {
      // Skip token attachment for public endpoints
      const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint =>
        config.url?.includes(endpoint)
      );
      
      if (!isPublicEndpoint) {
        const accessToken = tokenService.getAccessToken();
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Handle 401 and silent refresh
  axiosInstance.interceptors.response.use(
    (response) => {
      // Pass through successful responses
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Only handle 401 errors
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // Skip retry for public endpoints
      const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint =>
        originalRequest.url?.includes(endpoint)
      );
      
      if (isPublicEndpoint) {
        return Promise.reject(error);
      }

      // Prevent infinite retry loops
      if (originalRequest._retry) {
        // Already retried, force logout
        await performLogout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Refresh already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        const response = await refreshAccessTokenWithRetry();
        const newAccessToken = response.accessToken;

        // Store new tokens (done in refreshAccessTokenWithRetry)
        
        // Update original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError as Error, null);
        await performLogout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
```

### Integration with Axios Instance

```typescript
// frontend/lib/axios/axiosInstance.ts
import axios from 'axios';
import { setupInterceptors } from './axiosInterceptor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Setup interceptors
setupInterceptors(axiosInstance);

export default axiosInstance;
```

### Request Queue States

| State | Description | Queue Size | Lock Status |
|-------|-------------|------------|-------------|
| Idle | No refresh happening | 0 | Unlocked |
| Refreshing | Refresh in progress | Growing | Locked |
| Retrying | Processing queue | Shrinking | Locked |
| Failed | Refresh failed | Cleared | Unlocked |

### Interceptor Behavior Matrix

| Request Status | Token Valid | Interceptor Action |
|----------------|-------------|-------------------|
| Fresh Request | Yes | Attach token, send |
| Fresh Request | No/Missing | Send without token (or refresh first) |
| 401 Response | Yes (but expired) | Refresh + retry |
| 401 Response | No refresh token | Logout immediately |
| Public Endpoint | Any | Skip token, send |
| Retry Request | Yes | Use new token, send |

### Edge Cases and Handling

| Scenario | Detection | Action |
|----------|-----------|--------|
| Infinite Retry Loop | _retry flag = true | Force logout |
| Multiple 401s During Refresh | isRefreshing = true | Queue requests |
| Refresh Token Expired | 401 on refresh | Logout all queued |
| Network Error During Refresh | Axios error | Retry refresh (in authAPI) |
| Concurrent Tabs Refresh | localStorage sync | One tab refreshes |

### Expected Outcome
- Transparent token refresh on 401 errors
- Failed requests automatically retried
- No user-visible authentication interruptions
- Request queuing during refresh
- Proper logout on refresh failure

### Verification Checklist
- [ ] Axios interceptor file created
- [ ] Request interceptor attaches tokens
- [ ] Response interceptor catches 401 errors
- [ ] Silent refresh logic implemented
- [ ] Request queue working correctly
- [ ] Refresh lock prevents duplicates
- [ ] Public endpoints excluded
- [ ] Failed refresh triggers logout
- [ ] Infinite retry loop prevented

---

## Summary

This document covered the complete implementation of token persistence and session management for the webstore customer authentication system. The seven tasks create a robust, secure, and user-friendly authentication experience:

### Key Deliverables

| Task | Component | File Location |
|------|-----------|---------------|
| 69 | Token Storage Service | `services/storefront/auth/tokenService.ts` |
| 70 | Refresh Token Storage | Extended in `tokenService.ts` |
| 71 | Token Auto Refresh Hook | `hooks/storefront/useTokenRefresh.ts` |
| 72 | Token Expiry Detection | `lib/utils/tokenExpiry.ts` |
| 73 | Refresh Token API | `services/storefront/auth/authAPI.ts` |
| 74 | Logout Token Cleanup | Extended in `authAPI.ts` |
| 75 | Silent Token Refresh | `lib/axios/axiosInterceptor.ts` |

### Security Features Implemented

- **httpOnly Cookies:** Tokens stored in httpOnly cookies for XSS protection
- **Token Rotation:** Refresh tokens rotated on each use
- **Automatic Expiry:** Tokens expire after configured duration
- **Silent Refresh:** Transparent token renewal without user interaction
- **Cross-Tab Sync:** Logout synchronized across browser tabs
- **Secure Transmission:** HTTPS-only cookies in production

### User Experience Enhancements

- **Seamless Sessions:** Automatic token refresh prevents interruptions
- **Remember Me:** Extended session duration option
- **Error Recovery:** Failed requests automatically retried after refresh
- **Fast Logout:** Immediate cleanup across all tabs
- **No Interruptions:** Silent refresh happens in background

### Technical Architecture

```
Token Lifecycle Management
├─ Storage Layer (Task 69-70)
│  └─ httpOnly cookies with secure flags
│
├─ Monitoring Layer (Task 71-72)
│  ├─ Expiry detection
│  └─ Proactive refresh scheduling
│
├─ Refresh Layer (Task 73)
│  ├─ Backend API call
│  └─ Token rotation
│
├─ Cleanup Layer (Task 74)
│  ├─ Client-side cleanup
│  └─ Server-side invalidation
│
└─ Interception Layer (Task 75)
   ├─ Request token attachment
   ├─ 401 error detection
   └─ Silent refresh + retry
```

### Integration Points

This token management system integrates with:
- **Auth Store (Zustand):** Maintains authentication state
- **Login/Register:** Initial token acquisition
- **API Requests:** Automatic token attachment
- **Session Warning (Task 80):** Notify before expiry
- **Cart Merge (Task 81):** Preserve cart on login

### Next Steps

The next document will cover:
- Task 76: Auth State Hydration
- Task 77-79: Logout Flow
- Task 80: Session Expiry Warning
- Task 81: Cart Merge on Login
- Task 82: Session Management Verification

These tasks complete the session management system by adding state hydration, user-facing logout flow, expiry warnings, and cart preservation functionality.

---

**Document Complete** | Token Persistence and Session Management Implementation
