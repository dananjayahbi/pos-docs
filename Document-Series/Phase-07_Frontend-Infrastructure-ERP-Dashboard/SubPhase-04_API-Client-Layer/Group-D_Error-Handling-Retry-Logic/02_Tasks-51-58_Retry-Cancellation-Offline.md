# Tasks 51-58: Retry, Cancellation, and Offline Handling

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** D - Error Handling & Retry Logic  
> **Document:** 02 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-45-50_Error-Handling-Module.md](01_Tasks-45-50_Error-Handling-Module.md)

---

## Document Overview

This document completes the error handling and retry infrastructure by implementing automatic retry logic with exponential backoff, request cancellation using AbortController, offline detection, and React error boundary integration. These components ensure resilient API communication with graceful degradation under adverse network conditions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create Retry Configuration | Low | 15 min |
| 52 | Implement Retry Logic | Medium | 40 min |
| 53 | Implement Exponential Backoff | Low | 20 min |
| 54 | Create isRetryable Function | Low | 20 min |
| 55 | Create Request Cancellation | Medium | 30 min |
| 56 | Create useAbortController Hook | Low | 25 min |
| 57 | Implement Offline Detection | Medium | 35 min |
| 58 | Create Error Boundary Integration | Low | 20 min |

---

## Task 51: Create Retry Configuration

### Overview
Define the retry configuration interface and default values for automatic retry behavior. This configuration controls how many times requests should be retried, the delays between attempts, maximum delay caps, and exponential backoff factors.

### Dependencies
- Task 45: Error handling module structure exists
- TypeScript configuration established

### Instructions

1. **Add retry configuration to apiError.ts**
   - Open `frontend/lib/apiError.ts` file
   - Locate type definitions section
   - Add retry-related interfaces here

2. **Define RetryConfig interface**
   - Create interface with retry parameters
   - Include maxRetries property (number)
   - Include initialDelay property (number, milliseconds)
   - Include maxDelay property (number, milliseconds)
   - Include backoffFactor property (number, multiplier)
   - Include retryCondition optional function
   - Add JSDoc documentation for each property

3. **Define DEFAULT_RETRY_CONFIG constant**
   - Create exported constant with default values
   - Set maxRetries to 3 attempts
   - Set initialDelay to 1000 milliseconds (1 second)
   - Set maxDelay to 10000 milliseconds (10 seconds)
   - Set backoffFactor to 2 (doubles each time)
   - Leave retryCondition undefined (uses default logic)

4. **Define RetryState interface**
   - Create interface to track retry attempt state
   - Include attemptNumber property (current attempt count)
   - Include lastError property (last ApiException)
   - Include nextDelay property (calculated delay for next attempt)
   - Used internally by retry logic

5. **Add configuration documentation**
   - Document recommended values for different scenarios
   - Note: aggressive retry (higher maxRetries)
   - Note: conservative retry (lower maxRetries)
   - Note: backoff factor effects on retry timing

6. **Create configuration validation notes**
   - Document reasonable ranges for each property
   - Note: maxRetries typically 1-5
   - Note: initialDelay typically 500-2000ms
   - Note: maxDelay typically 5000-30000ms
   - Note: backoffFactor typically 1.5-3

### RetryConfig Properties

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| maxRetries | number | Maximum retry attempts | 3 |
| initialDelay | number | First retry delay (ms) | 1000 |
| maxDelay | number | Maximum delay cap (ms) | 10000 |
| backoffFactor | number | Exponential multiplier | 2 |
| retryCondition | function? | Custom retry logic | undefined |

### Default Configuration Rationale

| Setting | Value | Reasoning |
|---------|-------|-----------|
| maxRetries: 3 | 3 attempts | Balance resilience and user wait time |
| initialDelay: 1000 | 1 second | Not too aggressive, allows transient issues to resolve |
| maxDelay: 10000 | 10 seconds | Prevents excessive waiting on persistent failures |
| backoffFactor: 2 | Doubles | Standard exponential backoff |

### Retry Timing Example with Defaults

| Attempt | Delay Calculation | Actual Delay | Cumulative Time |
|---------|------------------|--------------|-----------------|
| 1 (initial) | - | 0 ms | 0 ms |
| 2 | 1000 × 2^0 | 1000 ms | 1000 ms |
| 3 | 1000 × 2^1 | 2000 ms | 3000 ms |
| 4 | 1000 × 2^2 | 4000 ms | 7000 ms |
| Give up | - | - | 7000 ms total |

### Configuration Scenarios

**Fast Retry (impatient user):**
```
maxRetries: 2
initialDelay: 500
maxDelay: 3000
backoffFactor: 1.5
```

**Aggressive Retry (critical operation):**
```
maxRetries: 5
initialDelay: 1000
maxDelay: 15000
backoffFactor: 2
```

**Conservative Retry (background task):**
```
maxRetries: 3
initialDelay: 2000
maxDelay: 30000
backoffFactor: 2.5
```

### Expected Outcome
- RetryConfig interface defined with all parameters
- DEFAULT_RETRY_CONFIG constant with sensible values
- RetryState interface for internal tracking
- Documentation for configuration tuning
- Foundation for retry logic implementation

### Verification Checklist
- [ ] RetryConfig interface defined
- [ ] maxRetries property documented
- [ ] initialDelay property documented
- [ ] maxDelay property documented
- [ ] backoffFactor property documented
- [ ] retryCondition optional property defined
- [ ] DEFAULT_RETRY_CONFIG constant created
- [ ] Default values set appropriately
- [ ] RetryState interface defined
- [ ] Configuration documentation added

---

## Task 52: Implement Retry Logic

### Overview
Implement the core retry logic that automatically retries failed API requests based on the retry configuration. This function wraps request execution, catches failures, determines if retry is appropriate, calculates delays, and manages retry state.

### Dependencies
- Task 51: Retry configuration defined
- Task 47: parseApiError function available
- Task 54: isRetryable function (may implement in parallel)

### Instructions

1. **Create retryRequest function**
   - Define in apiError.ts module
   - Accept requestFn parameter (function that returns Promise)
   - Accept optional config parameter (RetryConfig)
   - Return Promise of same type as requestFn
   - Make function generic to work with any request

2. **Add function documentation**
   - Add JSDoc comment describing retry wrapper
   - Document parameters: requestFn, config
   - Document return: Promise with same type
   - Note: automatically retries on retryable errors
   - Include usage example

3. **Initialize retry state**
   - Create RetryState object
   - Set attemptNumber to 0
   - Set lastError to null
   - Set nextDelay to initialDelay
   - Use provided config or DEFAULT_RETRY_CONFIG

4. **Create main retry loop**
   - Use while loop or recursive approach
   - Continue while attemptNumber < maxRetries
   - Try executing requestFn
   - If successful, return result immediately
   - If fails, proceed to error handling

5. **Catch and parse errors**
   - Catch any error from requestFn execution
   - Use parseApiError to convert to ApiException
   - Store in lastError property
   - Log retry attempt information

6. **Check if error is retryable**
   - Call isRetryable function (Task 54)
   - If not retryable, throw error immediately
   - Don't waste time retrying client errors
   - Custom retryCondition overrides if provided

7. **Calculate next delay**
   - Call calculateBackoffDelay function (Task 53)
   - Pass attemptNumber and config
   - Store calculated delay in nextDelay
   - Ensure delay doesn't exceed maxDelay

8. **Implement delay**
   - Create Promise that resolves after nextDelay
   - Use setTimeout for delay
   - Allow delay to be interruptible if needed
   - Consider using AbortSignal (Task 55)

9. **Increment attempt counter**
   - Increase attemptNumber by 1
   - Update retry state
   - Continue to next iteration

10. **Handle max retries reached**
    - After loop completes without success
    - Throw the last error encountered
    - Ensure error contains retry context
    - Log that max retries were exhausted

11. **Add logging for observability**
    - Log each retry attempt with attempt number
    - Log error details (type, status, message)
    - Log calculated delay before waiting
    - Log when giving up after max retries
    - Use console.warn or proper logging utility

### Retry Loop Flow Diagram

```
                 retryRequest(requestFn, config)
                            │
                            ▼
                  Initialize retry state
                  attemptNumber = 0
                            │
                            ▼
              ┌─────────────────────────┐
              │  Attempt < maxRetries?  │
              └─────────┬───────────────┘
                       │ Yes
                       ▼
              ┌─────────────────────┐
              │  Execute requestFn  │
              └─────────┬───────────┘
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
       Succeeds               Fails
            │                     │
            ▼                     ▼
       Return              Parse error
       result              to ApiException
                                 │
                                 ▼
                        Is retryable?
                          /          \
                        Yes           No
                         │             │
                         ▼             ▼
                 Calculate delay    Throw
                 Wait nextDelay     error
                 Increment attempt
                         │
                         └─────────┐
                                   │
              ┌────────────────────┘
              │
              └─────────────────────────┐
                                        │
                          No            │
              ┌─────────────────────┐   │
              │  Max retries reached│◄──┘
              └─────────┬───────────┘
                        │
                        ▼
                   Throw last
                     error
```

### Retry State Management

| State Property | Initial Value | Updates During Loop |
|---------------|---------------|---------------------|
| attemptNumber | 0 | Incremented after each failure |
| lastError | null | Set to current ApiException |
| nextDelay | initialDelay | Recalculated using backoff |

### Error Handling in Retry Loop

| Error Scenario | Action |
|----------------|--------|
| Retryable error, attempts remain | Wait and retry |
| Non-retryable error | Throw immediately |
| Max retries reached | Throw last error |
| Request succeeds | Return result |

### Logging Best Practices

**Log at retry attempt:**
```
Format: "Retrying request (attempt X/Y) after Zms delay. Reason: [error]"
Level: warn
Include: attempt number, max retries, delay, error type
```

**Log at max retries:**
```
Format: "Max retries (X) reached. Giving up. Last error: [error]"
Level: error
Include: max retries, error details
```

### Expected Outcome
- retryRequest function fully implemented
- Automatic retry on retryable errors
- Respects maxRetries configuration
- Integrates with backoff calculation
- Proper error handling and propagation
- Observable through logging

### Verification Checklist
- [ ] retryRequest function defined with generics
- [ ] JSDoc documentation added
- [ ] RetryState initialized properly
- [ ] Main retry loop implemented
- [ ] requestFn executed in try block
- [ ] Errors caught and parsed
- [ ] isRetryable check implemented
- [ ] Delay calculation integrated
- [ ] setTimeout for waiting implemented
- [ ] attemptNumber incremented
- [ ] Max retries check implemented
- [ ] Last error thrown when exhausted
- [ ] Logging added for observability

---

## Task 53: Implement Exponential Backoff

### Overview
Implement the exponential backoff calculation function that determines the delay before each retry attempt. This function applies the exponential backoff formula, respects the maximum delay cap, and optionally adds jitter to prevent thundering herd problems.

### Dependencies
- Task 51: RetryConfig interface defined
- Understanding of exponential backoff algorithms

### Instructions

1. **Create calculateBackoffDelay function**
   - Define in apiError.ts module
   - Accept attemptNumber parameter (number, 0-indexed)
   - Accept config parameter (RetryConfig)
   - Return delay in milliseconds (number)
   - Make function exported for testing

2. **Add function documentation**
   - Add JSDoc comment describing backoff calculation
   - Document exponential backoff formula
   - Note the max delay cap behavior
   - Include example calculations

3. **Implement exponential backoff formula**
   - Formula: `delay = initialDelay * (backoffFactor ^ attemptNumber)`
   - Use Math.pow for exponentiation
   - Extract config values: initialDelay, backoffFactor
   - Calculate base delay without cap

4. **Apply maximum delay cap**
   - Compare calculated delay with config.maxDelay
   - Use Math.min to enforce cap
   - Prevents indefinitely long waits
   - Return capped value

5. **Add optional jitter (advanced)**
   - Consider adding random jitter to delay
   - Jitter prevents synchronized retry attempts
   - Formula: `delay * (0.5 + Math.random() * 0.5)`
   - Results in 50-100% of calculated delay
   - Makes jitter optional via config flag

6. **Handle edge cases**
   - Handle attemptNumber = 0 (should return initialDelay)
   - Handle negative attemptNumber (treat as 0)
   - Handle invalid config values (use defaults)
   - Handle overflow for large attempt numbers

7. **Add calculation examples in documentation**
   - Show delay for attempts 1-5 with default config
   - Show effect of different backoffFactor values
   - Show effect of maxDelay cap
   - Demonstrate jitter variation

### Exponential Backoff Formula

```
delay = min(
  initialDelay × (backoffFactor ^ attemptNumber),
  maxDelay
)

With jitter (optional):
delay = delay × (0.5 + Math.random() × 0.5)
```

### Calculation Examples (Default Config)

| Attempt | Formula | Calculated | Capped | With Jitter |
|---------|---------|------------|--------|-------------|
| 0 | 1000 × 2^0 | 1000 ms | 1000 ms | 500-1000 ms |
| 1 | 1000 × 2^1 | 2000 ms | 2000 ms | 1000-2000 ms |
| 2 | 1000 × 2^2 | 4000 ms | 4000 ms | 2000-4000 ms |
| 3 | 1000 × 2^3 | 8000 ms | 8000 ms | 4000-8000 ms |
| 4 | 1000 × 2^4 | 16000 ms | 10000 ms | 5000-10000 ms |
| 5 | 1000 × 2^5 | 32000 ms | 10000 ms | 5000-10000 ms |

### Backoff Factor Comparison

**With backoffFactor = 1.5 (gentler):**
| Attempt | Delay |
|---------|-------|
| 0 | 1000 ms |
| 1 | 1500 ms |
| 2 | 2250 ms |
| 3 | 3375 ms |
| 4 | 5063 ms |

**With backoffFactor = 2 (standard):**
| Attempt | Delay |
|---------|-------|
| 0 | 1000 ms |
| 1 | 2000 ms |
| 2 | 4000 ms |
| 3 | 8000 ms |
| 4 | 10000 ms (capped) |

**With backoffFactor = 3 (aggressive):**
| Attempt | Delay |
|---------|-------|
| 0 | 1000 ms |
| 1 | 3000 ms |
| 2 | 9000 ms |
| 3 | 10000 ms (capped) |
| 4 | 10000 ms (capped) |

### Jitter Benefits

| Scenario | Without Jitter | With Jitter |
|----------|----------------|-------------|
| 100 clients retry | All retry at same time | Spread across time window |
| Server recovers | Immediate overload | Gradual load increase |
| Retry storm | Synchronized retries | Randomized retries |

### Edge Case Handling

| Input | Expected Output | Reason |
|-------|-----------------|--------|
| attemptNumber = 0 | initialDelay | First retry |
| attemptNumber = -1 | initialDelay | Invalid, treat as 0 |
| attemptNumber = 10 | maxDelay | Would overflow, cap applied |
| initialDelay = 0 | 0 | No delay configured |
| backoffFactor = 1 | initialDelay | Linear, no growth |

### Expected Outcome
- calculateBackoffDelay function implemented
- Correct exponential backoff calculation
- Maximum delay cap enforced
- Optional jitter for distribution
- Edge cases handled gracefully
- Ready for use in retry logic

### Verification Checklist
- [ ] calculateBackoffDelay function defined
- [ ] JSDoc documentation added with examples
- [ ] Exponential formula implemented
- [ ] Math.pow used for exponentiation
- [ ] config.maxDelay cap applied with Math.min
- [ ] attemptNumber = 0 returns initialDelay
- [ ] Negative attemptNumber handled
- [ ] Optional jitter logic implemented
- [ ] Edge cases documented and handled
- [ ] Function exported from module

---

## Task 54: Create isRetryable Function

### Overview
Create a function that determines whether a specific error should trigger an automatic retry. This function examines error types, HTTP status codes, and error characteristics to make intelligent retry decisions, avoiding wasted attempts on errors that won't succeed upon retry.

### Dependencies
- Task 46: ApiException class available
- Task 49: isNetworkError function available
- Task 50: isTimeoutError function available

### Instructions

1. **Create isRetryable function**
   - Define in apiError.ts module
   - Accept error parameter (ApiException | Error | unknown)
   - Return boolean (true if should retry)
   - Make function exported

2. **Add function documentation**
   - Add JSDoc comment describing retry decision logic
   - Document what errors are retryable
   - Document what errors are not retryable
   - Note: prevents wasting retries on permanent failures

3. **Check for network errors**
   - Call isNetworkError function
   - If true, return true (retryable)
   - Network issues are often transient
   - Retry may succeed when connection restored

4. **Check for timeout errors**
   - Call isTimeoutError function
   - If true, return true (retryable)
   - Timeout might succeed with more time or lighter load
   - Retrying is appropriate

5. **Parse error to ApiException**
   - If not already ApiException, use parseApiError
   - Ensures consistent error structure
   - Allows status code checks

6. **Check HTTP status codes**
   - Extract status code from ApiException
   - Apply retry rules based on status
   - Different status codes have different retry appropriateness

7. **Implement 4xx status rules**
   - 400 Bad Request: NOT retryable (client error)
   - 401 Unauthorized: NOT retryable (need new token)
   - 403 Forbidden: NOT retryable (permission issue)
   - 404 Not Found: NOT retryable (resource doesn't exist)
   - 422 Unprocessable Entity: NOT retryable (validation error)
   - 429 Too Many Requests: RETRYABLE (rate limit, temporary)
   - Default 4xx: NOT retryable

8. **Implement 5xx status rules**
   - 500 Internal Server Error: RETRYABLE (temporary server issue)
   - 501 Not Implemented: NOT retryable (feature missing)
   - 502 Bad Gateway: RETRYABLE (gateway issue, temporary)
   - 503 Service Unavailable: RETRYABLE (temporary maintenance)
   - 504 Gateway Timeout: RETRYABLE (timeout at gateway)
   - Default 5xx: RETRYABLE (assume temporary)

9. **Handle unknown errors**
   - If status code is 0 or undefined
   - Conservative approach: return false
   - Avoid retrying mysterious errors
   - Log unknown error for investigation

10. **Add custom retry condition support**
    - Check if RetryConfig has custom retryCondition function
    - If present, call it with error
    - Allow override of default logic
    - Custom condition takes precedence

### Retry Decision Matrix

| Error Type | HTTP Status | Retryable? | Reason |
|------------|-------------|------------|---------|
| Network error | N/A | ✓ Yes | Transient connectivity issue |
| Timeout error | N/A | ✓ Yes | May succeed with more time |
| Client error | 400 | ✗ No | Invalid request won't change |
| Unauthorized | 401 | ✗ No | Need new authentication |
| Forbidden | 403 | ✗ No | Permission issue |
| Not Found | 404 | ✗ No | Resource doesn't exist |
| Validation error | 422 | ✗ No | Invalid data |
| Rate limited | 429 | ✓ Yes | Temporary restriction |
| Server error | 500 | ✓ Yes | Transient server issue |
| Not Implemented | 501 | ✗ No | Feature missing |
| Bad Gateway | 502 | ✓ Yes | Gateway issue |
| Service Unavailable | 503 | ✓ Yes | Temporary maintenance |
| Gateway Timeout | 504 | ✓ Yes | Gateway timeout |
| Other 5xx | 5xx | ✓ Yes | Assume transient |
| Unknown | 0 | ✗ No | Conservative approach |

### Status Code Categories

**Never Retry (Client Errors):**
```
400, 401, 403, 404, 405, 406, 407, 408, 410, 411, 412, 413, 414, 415, 416, 417, 422
```

**Always Retry (Server Errors):**
```
500, 502, 503, 504, 507, 508, 509, 510
```

**Exception in 5xx:**
```
501 (Not Implemented) - Not retryable
```

**Exception in 4xx:**
```
429 (Too Many Requests) - Retryable
```

### Custom Retry Condition

**Use case for custom condition:**
```
Scenario: Specific error codes should not retry
Custom logic: Check error.code !== 'BUSINESS_LOGIC_ERROR'
Implementation: Pass retryCondition in config
Override: Custom condition overrides default logic
```

### isRetryable Decision Flow

```
                    isRetryable(error)
                           │
                           ▼
                  isNetworkError(error)?
                      /          \
                    Yes           No
                     │             │
                     ▼             ▼
                 Return        isTimeoutError(error)?
                  true             /          \
                                 Yes           No
                                  │             │
                                  ▼             ▼
                              Return        Parse to
                               true        ApiException
                                               │
                                               ▼
                                      Check status code
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
               Status 429              Status 4xx               Status 5xx (not 501)
               (Rate Limit)            (Client Error)           (Server Error)
                    │                          │                          │
                    ▼                          ▼                          ▼
               Return true                Return false              Return true
                                               │
                                               ▼
                                          Status 501
                                          (Not Impl)
                                               │
                                               ▼
                                         Return false
```

### Expected Outcome
- isRetryable function fully implemented
- Intelligent retry decisions based on error type
- HTTP status code rules applied correctly
- Custom retry condition support
- Avoids wasting retries on permanent failures
- Ready for use in retry logic

### Verification Checklist
- [ ] isRetryable function defined
- [ ] JSDoc documentation added
- [ ] isNetworkError check implemented
- [ ] isTimeoutError check implemented
- [ ] Error parsed to ApiException
- [ ] 4xx status rules implemented
- [ ] 429 special case (retryable) handled
- [ ] 5xx status rules implemented
- [ ] 501 special case (not retryable) handled
- [ ] Unknown status handled conservatively
- [ ] Custom retryCondition support added
- [ ] Function exported from module

---

## Task 55: Create Request Cancellation

### Overview
Implement request cancellation using the AbortController API. This allows requests to be cancelled when components unmount, when new requests supersede old ones, or when users navigate away. Integrate AbortController with the Axios instance to enable proper cleanup.

### Dependencies
- Task 03: Axios instance created
- Understanding of AbortController API
- Browser support for AbortController

### Instructions

1. **Add AbortSignal support to Axios instance**
   - Open the Axios instance configuration file
   - Ensure request config can accept signal property
   - TypeScript typing should include signal?: AbortSignal
   - Axios natively supports AbortSignal

2. **Create createAbortController utility**
   - Define in a new utils file or in API client
   - Simple wrapper: `() => new AbortController()`
   - Returns AbortController instance
   - Used to create controller for each request

3. **Update API service methods**
   - Modify service function signatures
   - Add optional config parameter
   - Config should include signal?: AbortSignal
   - Pass signal to Axios request config

4. **Handle AbortError in interceptors**
   - Update error response interceptor
   - Check if error is AbortError
   - Don't log cancelled requests as failures
   - Don't retry cancelled requests
   - Return appropriate response or reject quietly

5. **Add cancellation to parseApiError**
   - Check if error is AbortError
   - Create specific ApiException property or code
   - Set isCancelled flag (add to ApiException)
   - User-friendly message: "Request was cancelled"

6. **Create request cancellation helper**
   - Function to attach AbortSignal to requests
   - Simplifies passing signal through service layers
   - Provides consistent cancellation interface
   - Example: `withCancellation(requestFn, signal)`

7. **Document cancellation patterns**
   - How to create AbortController
   - How to pass signal to API methods
   - How to call abort() to cancel
   - When to cancel (unmount, navigation, new request)

8. **Handle race conditions**
   - Prevent processing cancelled request responses
   - Check if signal is aborted before updating state
   - Ignore responses from cancelled requests
   - Use signal.aborted property

### AbortController API Usage

**Creating a controller:**
```
const controller = new AbortController()
const signal = controller.signal
```

**Passing to Axios:**
```
axios.get('/api/endpoint', { signal })
```

**Cancelling:**
```
controller.abort()
```

**Checking if aborted:**
```
if (signal.aborted) {
  // Request was cancelled
}
```

### Integration with API Services

**Service method signature update:**
```
Before: getUsers()
After: getUsers(config?: { signal?: AbortSignal })

Pass signal to Axios:
axios.get('/users', { signal: config?.signal })
```

### AbortError Handling

| Location | Action |
|----------|--------|
| Error interceptor | Detect AbortError, skip logging |
| parseApiError | Convert to ApiException with isCancelled flag |
| Retry logic | Skip retry if isCancelled |
| Component | Catch and ignore cancelled errors |

### Cancellation Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Component Lifecycle                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Component Mount                                         │
│      │                                                   │
│      ▼                                                   │
│  Create AbortController                                 │
│  controller = new AbortController()                     │
│      │                                                   │
│      ▼                                                   │
│  Make API Request                                       │
│  apiService.getUsers({ signal: controller.signal })    │
│      │                                                   │
│      ├────────────────────────────┐                     │
│      ▼                            ▼                     │
│  Component Unmount          Request Completes           │
│      │                            │                     │
│      ▼                            ▼                     │
│  controller.abort()          Process Response           │
│      │                            │                     │
│      ▼                            └─────────────────────┤
│  Request Cancelled                                      │
│  (AbortError thrown)                                    │
│      │                                                   │
│      ▼                                                   │
│  Catch in interceptor                                   │
│  Skip processing                                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Common Cancellation Scenarios

| Scenario | Implementation |
|----------|----------------|
| Component unmount | Create controller in useEffect, abort in cleanup |
| Navigation away | Abort on route change |
| New search | Abort previous search, start new one |
| User cancels | Button click calls abort() |
| Timeout alternative | Abort after X seconds |

### Expected Outcome
- AbortController integrated with Axios
- Request cancellation support in API services
- AbortError handled gracefully
- isCancelled flag in ApiException
- No false error reporting for cancelled requests
- Foundation for useAbortController hook

### Verification Checklist
- [ ] Axios instance supports signal property
- [ ] createAbortController utility created
- [ ] API service methods accept signal parameter
- [ ] signal passed to Axios request config
- [ ] Error interceptor detects AbortError
- [ ] parseApiError handles AbortError
- [ ] isCancelled property added to ApiException
- [ ] Retry logic skips cancelled requests
- [ ] Cancellation documentation added
- [ ] Race condition handling documented

---

## Task 56: Create useAbortController Hook

### Overview
Create a React hook that manages AbortController lifecycle automatically. This hook creates a controller, provides abort function and signal, and most importantly, aborts any pending requests when the component unmounts, preventing memory leaks and state updates on unmounted components.

### Dependencies
- Task 55: Request cancellation infrastructure
- React hooks (useState, useEffect, useRef)
- TypeScript typing for hooks

### Instructions

1. **Create useAbortController.ts file**
   - Navigate to `frontend/hooks/` directory
   - Create new file named `useAbortController.ts`
   - This will be a custom React hook

2. **Import required dependencies**
   - Import useEffect from 'react'
   - Import useRef from 'react'
   - Import useMemo from 'react' (optional optimization)

3. **Define hook return type**
   - Create interface UseAbortControllerReturn
   - Include controller property (AbortController)
   - Include signal property (AbortSignal)
   - Include abort function (() => void)
   - Include reset function (() => void) for reuse

4. **Create useAbortController hook function**
   - Export function useAbortController
   - No parameters needed for basic version
   - Return UseAbortControllerReturn

5. **Create controller with useRef**
   - Use useRef to persist controller across renders
   - Initialize with new AbortController()
   - Ref prevents recreation on every render
   - Maintains same controller instance

6. **Create abort function**
   - Define abort callback function
   - Calls controller.current.abort()
   - Safe to call multiple times
   - Does nothing if already aborted

7. **Create reset function**
   - Define reset callback function
   - Creates new AbortController
   - Assigns to controller.current
   - Useful for making multiple requests in same component

8. **Add cleanup effect**
   - Use useEffect with empty dependency array
   - Return cleanup function
   - Cleanup calls controller.current.abort()
   - Runs when component unmounts

9. **Return hook values**
   - Return object with controller, signal, abort, reset
   - Use useMemo to memoize returned object (optional)
   - Prevents unnecessary re-renders

10. **Add TypeScript documentation**
    - Add JSDoc comments describing hook purpose
    - Document return properties
    - Include usage example
    - Note automatic cleanup on unmount

11. **Create hook usage examples**
    - Show basic usage in functional component
    - Show passing signal to API calls
    - Show manual abort on button click
    - Show reset for multiple requests

### Hook Implementation Pattern

```
Structure:
1. useRef for controller persistence
2. abort callback function
3. reset callback function
4. useEffect cleanup for unmount
5. return object with controller, signal, abort, reset
```

### UseAbortController Return Interface

| Property | Type | Description |
|----------|------|-------------|
| controller | AbortController | The AbortController instance |
| signal | AbortSignal | The signal to pass to requests |
| abort | () => void | Function to manually abort |
| reset | () => void | Function to create new controller |

### Hook Lifecycle

```
┌─────────────────────────────────────────────────┐
│         Component Mount                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  useAbortController() called                    │
│         │                                        │
│         ▼                                        │
│  Create AbortController (useRef)               │
│         │                                        │
│         ▼                                        │
│  Return { controller, signal, abort, reset }   │
│         │                                        │
│         ▼                                        │
│  Component uses signal for requests            │
│         │                                        │
│    ┌────┴────┐                                  │
│    ▼         ▼                                  │
│  Unmount  Manual                                │
│    │      abort()                               │
│    │         │                                  │
│    └────┬────┘                                  │
│         ▼                                        │
│  controller.abort() called                      │
│         │                                        │
│         ▼                                        │
│  Pending requests cancelled                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Usage Examples

**Basic usage:**
```
Component:
  const { signal } = useAbortController()
  
  useEffect(() => {
    apiService.getUsers({ signal })
      .then(setUsers)
      .catch(handleError)
  }, [])
  
Benefit: Automatically cancelled on unmount
```

**Manual abort:**
```
Component:
  const { signal, abort } = useAbortController()
  
  const handleCancel = () => {
    abort()
    // User clicked cancel button
  }
  
  return <button onClick={handleCancel}>Cancel</button>
```

**Multiple requests with reset:**
```
Component:
  const { signal, reset } = useAbortController()
  
  const handleSearch = (query) => {
    reset() // Cancel previous, start fresh
    apiService.search(query, { signal })
      .then(setResults)
  }
```

### Advanced Variant (Optional)

**Hook with auto-reset option:**
```
Accept autoReset parameter
If true, automatically reset on each request
Useful for components making multiple sequential requests
Prevents signal from being in aborted state
```

### Expected Outcome
- useAbortController hook fully implemented
- Automatic cleanup on unmount
- Manual abort and reset capabilities
- Type-safe return interface
- Prevents memory leaks and state updates
- Ready for use in components making API calls

### Verification Checklist
- [ ] useAbortController.ts file created
- [ ] React hooks imported
- [ ] UseAbortControllerReturn interface defined
- [ ] useAbortController function exported
- [ ] useRef creates controller
- [ ] abort function implemented
- [ ] reset function implemented
- [ ] useEffect cleanup implemented
- [ ] Return object includes all properties
- [ ] JSDoc documentation added
- [ ] Usage examples documented
- [ ] Hook exported from hooks/index.ts

---

## Task 57: Implement Offline Detection

### Overview
Implement offline detection to handle scenarios where the user's device has no network connectivity. Use the navigator.onLine API and online/offline events to track network status. Queue requests when offline and replay them when connectivity is restored.

### Dependencies
- Task 49: isNetworkError function available
- Understanding of navigator.onLine API
- Understanding of window online/offline events

### Instructions

1. **Create useOnlineStatus hook**
   - Create `frontend/hooks/useOnlineStatus.ts` file
   - Hook tracks online/offline state
   - Returns boolean: true if online, false if offline
   - Updates in real-time with network changes

2. **Implement initial online check**
   - Use navigator.onLine to get initial state
   - Store in useState hook
   - Initialize as true if navigator.onLine undefined (SSR compatibility)

3. **Add event listeners for online/offline**
   - Use useEffect to add event listeners
   - Listen to 'online' event on window
   - Listen to 'offline' event on window
   - Update state when events fire

4. **Clean up event listeners**
   - Return cleanup function from useEffect
   - Remove event listeners on unmount
   - Prevents memory leaks

5. **Create OfflineQueue class**
   - Create `frontend/lib/offlineQueue.ts` file
   - Class manages queued requests
   - Stores requests when offline
   - Replays when online

6. **Implement queue storage**
   - Store requests in array
   - Each entry: request function, metadata
   - Use in-memory storage or localStorage
   - Include timestamp for each queued request

7. **Implement enqueue method**
   - Add request to queue
   - Store request function (thunk)
   - Store request metadata (URL, method, data)
   - Return promise for later resolution

8. **Implement dequeue and replay**
   - When online status changes to true
   - Dequeue all stored requests
   - Execute each request in order
   - Handle successes and failures

9. **Add offline interceptor**
   - Add request interceptor to Axios instance
   - Check navigator.onLine before sending
   - If offline, enqueue request instead
   - Return rejected promise with offline error

10. **Handle online event**
    - Listen for online event
    - Trigger queue replay
    - Update UI to indicate syncing
    - Show notifications of sync status

11. **Add UI feedback**
    - Create OfflineIndicator component
    - Show banner when offline
    - Show syncing status when replaying
    - Use useOnlineStatus hook

12. **Add configuration options**
    - Max queue size (prevent overflow)
    - Request timeout for queued items
    - Which requests to queue (POST/PUT/PATCH vs GET)
    - Storage strategy (memory vs localStorage)

### Online Status Detection

**navigator.onLine property:**
```
Returns true if online
Returns false if offline
May not be 100% accurate (depends on OS)
Best effort detection
```

**Online/Offline events:**
```
'online' event: Fired when connection restored
'offline' event: Fired when connection lost
Listen on window object
Update state immediately
```

### useOnlineStatus Hook Structure

```
useOnlineStatus() {
  Initialize state with navigator.onLine
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  return isOnline
}
```

### OfflineQueue Class Interface

| Method | Description |
|--------|-------------|
| enqueue(requestFn, metadata) | Add request to queue |
| dequeue() | Remove and return next request |
| replay() | Execute all queued requests |
| clear() | Remove all queued requests |
| size() | Get current queue size |

### Request Queueing Strategy

| Request Type | Queue When Offline? | Reasoning |
|--------------|---------------------|-----------|
| GET | No | Read-only, can fail fast |
| POST | Yes | Creates data, must succeed |
| PUT | Yes | Updates data, important |
| PATCH | Yes | Partial update, important |
| DELETE | Maybe | Depends on criticality |

### Offline Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                 Request Flow                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  API Request Made                                       │
│      │                                                   │
│      ▼                                                   │
│  Check navigator.onLine                                 │
│      │                                                   │
│      ├─────────────────┬────────────────┐               │
│      ▼                 ▼                ▼               │
│   Online            Offline        Uncertain            │
│      │                 │                │               │
│      ▼                 ▼                ▼               │
│  Send Request    Enqueue Request   Try Send             │
│      │                 │           (fallback)           │
│      ▼                 ▼                │               │
│  [Normal Flow]    Store in Queue       ▼               │
│                        │          Network Error?        │
│                        │           /        \           │
│                        │         Yes        No          │
│                        │          │          │          │
│                        │          ▼          ▼          │
│                        │    Enqueue      Success        │
│                        │      Request                   │
│                        ▼                                 │
│                  Wait for Online                        │
│                        │                                 │
│                        ▼                                 │
│                  'online' Event                         │
│                        │                                 │
│                        ▼                                 │
│                  Replay Queue                           │
│                        │                                 │
│                        ▼                                 │
│                  Process Each Request                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### UI Feedback Components

**OfflineIndicator:**
```
Shows banner at top of screen when offline
Message: "You're offline. Changes will sync when reconnected."
Style: Warning color (yellow/orange)
Dismissible or persistent
```

**SyncingIndicator:**
```
Shows when replaying queued requests
Message: "Syncing changes..."
Progress indicator if possible
Auto-dismisses when complete
```

### Expected Outcome
- useOnlineStatus hook tracking network status
- OfflineQueue class managing queued requests
- Axios interceptor checking online status
- Automatic queue replay on reconnection
- UI feedback for offline state
- Graceful degradation of functionality

### Verification Checklist
- [ ] useOnlineStatus.ts hook created
- [ ] navigator.onLine checked initially
- [ ] online/offline event listeners added
- [ ] Event listener cleanup implemented
- [ ] offlineQueue.ts class created
- [ ] enqueue method implemented
- [ ] replay method implemented
- [ ] Axios request interceptor checks online status
- [ ] Queue replay triggered on online event
- [ ] OfflineIndicator component created
- [ ] Configuration options defined
- [ ] Documentation for offline handling added

---

## Task 58: Create Error Boundary Integration

### Overview
Create integration between the error handling system and React Error Boundaries. This provides a safety net for rendering errors and allows graceful degradation of UI when errors occur. Ensures ApiException errors are properly displayed and logged.

### Dependencies
- Task 48: getErrorMessage function available
- React Error Boundary concept
- Understanding of componentDidCatch

### Instructions

1. **Create ErrorBoundary component**
   - Create `frontend/components/ErrorBoundary.tsx` file
   - Class component (required for error boundaries)
   - Catches errors in child component tree
   - Displays fallback UI

2. **Define ErrorBoundary state**
   - hasError boolean property
   - error object (Error | ApiException | null)
   - errorInfo object (React.ErrorInfo)
   - resetError function to recover

3. **Implement getDerivedStateFromError**
   - Static method to update state when error caught
   - Sets hasError to true
   - Stores error object
   - Triggers fallback UI render

4. **Implement componentDidCatch**
   - Lifecycle method for side effects
   - Log error to console
   - Log error to external service (Sentry, LogRocket)
   - Include component stack trace
   - Check if error is ApiException

5. **Extract error message**
   - Use getErrorMessage function (Task 48)
   - Works with both Error and ApiException
   - User-friendly message for display
   - Avoid showing stack traces to users

6. **Design fallback UI**
   - Error message display
   - Retry button (resets error state)
   - Report problem button (optional)
   - Navigation option (go to home)
   - Professional, non-alarming design

7. **Implement reset functionality**
   - Reset button clears error state
   - Sets hasError to false
   - Sets error to null
   - Attempts to re-render children
   - May succeed if transient error

8. **Add error logging utility**
   - Create logErrorToService function
   - Send error details to monitoring service
   - Include user context (user ID, session)
   - Include error metadata
   - Rate limit to prevent spam

9. **Create ApiErrorBoundary variant**
   - Specialized boundary for API errors
   - Additional handling for ApiException
   - Shows network/timeout specific messages
   - Suggests retry for retryable errors

10. **Add boundary to app root**
    - Wrap App component with ErrorBoundary
    - Catches errors from entire app
    - Prevents white screen of death
    - Provides recovery mechanism

11. **Add boundaries to critical sections**
    - Wrap major routes with boundaries
    - Wrap data-fetching components
    - Wrap third-party integrations
    - Allows partial app functionality on error

12. **Document error boundary usage**
    - When to use error boundaries
    - How to structure boundary hierarchy
    - How errors propagate to boundaries
    - Best practices for fallback UI

### ErrorBoundary Component Structure

```
ErrorBoundary Class Component:
├── State
│   ├── hasError: boolean
│   ├── error: Error | null
│   └── errorInfo: React.ErrorInfo | null
├── Static Methods
│   └── getDerivedStateFromError(error)
├── Lifecycle Methods
│   └── componentDidCatch(error, errorInfo)
├── Instance Methods
│   └── resetError()
└── Render Method
    ├── If hasError: Render fallback UI
    └── Else: Render children
```

### Error Boundary Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│          Error Boundary Lifecycle                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Normal Render                                          │
│  (no errors)                                            │
│      │                                                   │
│      ▼                                                   │
│  Render Children                                        │
│      │                                                   │
│      ▼                                                   │
│  Error Thrown in Child                                  │
│      │                                                   │
│      ▼                                                   │
│  getDerivedStateFromError(error)                       │
│  - Update state: hasError = true                       │
│      │                                                   │
│      ▼                                                   │
│  componentDidCatch(error, errorInfo)                   │
│  - Log error                                            │
│  - Send to monitoring service                          │
│      │                                                   │
│      ▼                                                   │
│  Re-render with Fallback UI                            │
│  - Show error message                                   │
│  - Show retry button                                    │
│      │                                                   │
│      ▼                                                   │
│  User Clicks Retry                                      │
│      │                                                   │
│      ▼                                                   │
│  resetError()                                           │
│  - Set hasError = false                                │
│  - Clear error                                          │
│      │                                                   │
│      ▼                                                   │
│  Re-render Children                                     │
│  (attempt recovery)                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Fallback UI Design

**Error message section:**
```
Title: "Something went wrong"
Message: Use getErrorMessage(error)
Avoid technical details
Professional tone
```

**Action buttons:**
```
Primary: "Try Again" (resets error)
Secondary: "Go to Home" (navigation)
Tertiary: "Report Problem" (optional)
```

**Visual design:**
```
Icon: Error or warning icon
Color: Red/orange for attention
Layout: Centered, clear hierarchy
Spacing: Adequate whitespace
```

### Error Logging Strategy

| Information | Purpose |
|-------------|---------|
| Error message | Quick identification |
| Error stack | Debugging |
| Component stack | Locate problem component |
| User ID | Reproduce issue |
| Browser info | Check compatibility |
| Timestamp | Track frequency |
| API error details | Diagnose backend issues |

### ErrorBoundary Props Interface

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Components to wrap |
| fallback | ReactNode | Custom fallback UI |
| onError | function | Error handler callback |
| resetKeys | any[] | Reset boundary when keys change |

### Error Boundary Placement Strategy

```
App Root (Top Level)
├── ErrorBoundary (catches all)
│   ├── Router
│   │   ├── Route: Dashboard
│   │   │   └── ErrorBoundary (route-specific)
│   │   │       └── DashboardContent
│   │   ├── Route: Settings
│   │   │   └── ErrorBoundary (route-specific)
│   │   │       └── SettingsContent
│   │   └── Route: Data Grid
│   │       └── ErrorBoundary (critical section)
│   │           └── DataGridComponent
│   └── Third-Party Widget
│       └── ErrorBoundary (isolate external code)
│           └── ExternalWidget
```

### Expected Outcome
- ErrorBoundary component implemented
- Catches rendering errors in component tree
- Displays user-friendly fallback UI
- Logs errors to monitoring service
- Integrates with getErrorMessage
- Reset functionality for recovery
- Multiple boundaries for isolation

### Verification Checklist
- [ ] ErrorBoundary.tsx component created
- [ ] Class component with proper structure
- [ ] State interface defined
- [ ] getDerivedStateFromError implemented
- [ ] componentDidCatch implemented
- [ ] getErrorMessage integration added
- [ ] Fallback UI designed and implemented
- [ ] Reset button functionality implemented
- [ ] Error logging to service implemented
- [ ] ErrorBoundary added to app root
- [ ] Documentation for usage added
- [ ] Testing instructions provided

---

## Appendix A: Retry Strategy Comparison

| Strategy | Delay Pattern | Use Case | Pros | Cons |
|----------|---------------|----------|------|------|
| Fixed Delay | Same delay each time | Simple scenarios | Predictable | Not adaptive |
| Linear Backoff | Increases linearly | Light traffic | Gradual increase | Slow for heavy load |
| Exponential Backoff | Doubles each time | Standard API requests | Proven effective | Can be aggressive |
| Exponential with Jitter | Doubles + randomization | High-traffic systems | Prevents thundering herd | More complex |
| Fibonacci Backoff | Fibonacci sequence | Alternative to exponential | Gentler growth | Less common |

---

## Appendix B: Request Cancellation Patterns

### Pattern 1: Component Unmount Cancellation

```
Use Case: Prevent state updates after unmount
Implementation: useAbortController hook
Cleanup: Automatic in useEffect

Component structure:
- Create controller on mount
- Pass signal to API calls
- Abort in useEffect cleanup
- Component unmounts safely
```

### Pattern 2: Superseding Request Cancellation

```
Use Case: Search-as-you-type, cancel old searches
Implementation: Reset controller on new input
Cleanup: Manual abort before new request

Flow:
1. User types in search box
2. API request initiated with signal
3. User types more characters
4. Abort previous request
5. New request with fresh signal
```

### Pattern 3: User-Initiated Cancellation

```
Use Case: Long-running operation with cancel button
Implementation: Expose abort function
Cleanup: User clicks cancel

UI elements:
- Cancel button visible during request
- Button calls abort function
- Request cancelled immediately
- UI shows cancellation feedback
```

### Pattern 4: Timeout-Based Cancellation

```
Use Case: Prevent indefinite hanging
Implementation: AbortController + setTimeout
Cleanup: Automatic after timeout

Mechanism:
- Create AbortController
- Set timeout to call abort after X seconds
- Pass signal to request
- Clear timeout if request completes
```

---

## Appendix C: Offline Handling Strategies

### Strategy 1: Optimistic UI

```
Approach: Assume success, rollback on failure
Best for: Create/Update operations
Implementation:
1. Update UI immediately
2. Queue request if offline
3. Show pending indicator
4. Confirm when synced
5. Rollback if failed
```

### Strategy 2: Pessimistic UI

```
Approach: Wait for confirmation before UI update
Best for: Critical operations
Implementation:
1. Show loading state
2. Queue request if offline
3. Wait for sync
4. Update UI on success
5. Show error on failure
```

### Strategy 3: Graceful Degradation

```
Approach: Provide read-only mode when offline
Best for: Content-heavy applications
Implementation:
1. Detect offline status
2. Disable write operations
3. Show cached data
4. Display offline banner
5. Re-enable when online
```

### Strategy 4: Request Queuing

```
Approach: Store operations, replay when online
Best for: Data entry applications
Implementation:
1. Queue write operations
2. Store in localStorage
3. Show queued count
4. Replay on reconnection
5. Handle conflicts
```

---

## Appendix D: Error Boundary Best Practices

### Boundary Placement Guidelines

| Location | Reasoning |
|----------|-----------|
| App root | Catch all uncaught errors |
| Route level | Isolate route errors |
| Feature module | Prevent cascade failures |
| Third-party widget | Isolate external code |
| Data grid/table | Protect critical UI |

### Fallback UI Considerations

| Aspect | Recommendation |
|--------|----------------|
| Message tone | Friendly, non-technical |
| Action buttons | Clear, actionable |
| Visual hierarchy | Error info prominent |
| Branding | Maintain app style |
| Accessibility | Screen reader friendly |

### Error Logging Checklist

- [ ] Error message and stack trace
- [ ] Component stack trace
- [ ] User ID and session ID
- [ ] Browser and OS information
- [ ] Timestamp and timezone
- [ ] App version or commit hash
- [ ] Previous user actions (breadcrumbs)
- [ ] API error details if applicable

---

## Summary

This document completed the error handling infrastructure with retry logic, exponential backoff, request cancellation, offline detection, and error boundary integration. The retry system automatically handles transient failures with intelligent backoff strategies. Request cancellation prevents memory leaks and race conditions. Offline detection provides graceful degradation. Error boundaries catch rendering errors and provide recovery mechanisms. Together, these components create a robust, resilient API client layer capable of handling adverse conditions gracefully.

**Project Status:**
- Error handling module complete
- Retry and backoff logic implemented
- Request cancellation with AbortController
- Offline queue and detection
- React error boundary integration
- API client layer resilient and production-ready
