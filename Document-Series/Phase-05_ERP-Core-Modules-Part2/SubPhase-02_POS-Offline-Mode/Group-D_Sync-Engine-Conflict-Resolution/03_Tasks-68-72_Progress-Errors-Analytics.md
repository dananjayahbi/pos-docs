# Tasks 68-72: Progress, Errors & Analytics

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** D - Sync Engine & Conflict Resolution  
> **Document:** 03 of 03  
> **Tasks Covered:** 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-60-67_Pull-Conflict-Resolution.md](02_Tasks-60-67_Pull-Conflict-Resolution.md)
- **→ Next Group:** [../Group-E_Frontend-Offline-Components/](../Group-E_Frontend-Offline-Components/)

---

## Document Overview

This document covers sync progress tracking, comprehensive error handling, retry strategies, completion callbacks, and analytics. These components ensure reliable synchronization with proper monitoring and reporting.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 68 | Implement sync progress tracking | Medium | 25 min |
| 69 | Create sync error handling | High | 30 min |
| 70 | Implement exponential backoff | Medium | 20 min |
| 71 | Create sync completion callbacks | Medium | 20 min |
| 72 | Add sync analytics | Medium | 25 min |

---

## Task 68: Implement Sync Progress Tracking

### Overview
Implement comprehensive progress tracking for sync operations. This enables the UI to display real-time progress to users and provides visibility into the sync process.

### Dependencies
- Task 53: Create SyncEngine class
- Task 58: Implement push_transactions method
- Task 60: Implement pull_updates method

### Instructions

1. **Create SyncProgress interface**
   - Define progress data structure
   - Include: phase, percentage, current, total, message
   - Include: start time, estimated completion
   - Type-safe interface

2. **Define sync phases**
   - INITIALIZING - Starting sync process
   - PUSHING - Uploading local changes
   - PULLING - Downloading server updates
   - RESOLVING - Resolving conflicts
   - FINALIZING - Completing sync
   - COMPLETED - Sync finished

3. **Implement progress tracking state**
   - Current phase
   - Items processed
   - Total items to process
   - Start timestamp
   - Current operation description

4. **Create updateProgress method**
   - Method: `updateProgress(phase, current, total, message)`
   - Calculate percentage completion
   - Update internal state
   - Emit progress event

5. **Track push progress**
   - Count transactions to push
   - Update after each batch
   - Calculate percentage: (pushed / total) * 100
   - Include in PUSHING phase

6. **Track pull progress**
   - Count entities to pull
   - Update after each entity type
   - May not know total upfront (use spinner)
   - Include in PULLING phase

7. **Track conflict resolution progress**
   - Count detected conflicts
   - Update after each resolution
   - Show resolution type
   - Include in RESOLVING phase

8. **Calculate estimated time remaining**
   - Based on progress rate
   - Items processed per second
   - Remaining items / rate = ETA
   - Update dynamically

9. **Emit progress events**
   - Event: `sync:progress`
   - Frequency: every second or significant change
   - Include all progress data
   - Don't spam events (throttle)

10. **Create progress snapshots**
    - Capture progress at intervals
    - Useful for performance analysis
    - Store in sync history
    - Enable replay/debugging

11. **Handle indeterminate progress**
    - When total unknown
    - Show spinner/indeterminate
    - Display current operation
    - Provide feedback without percentage

12. **Add progress persistence**
    - Save progress state
    - Resume if app crashes
    - Show last known state on restart
    - Clear on successful completion

### SyncProgress Interface

```typescript
interface SyncProgress {
  phase: SyncPhase;
  phaseDescription: string;
  percentage: number;           // 0-100, or -1 for indeterminate
  current: number;              // Items processed
  total: number;                // Total items, or -1 if unknown
  currentOperation: string;     // E.g., "Pushing batch 2 of 5"
  startTime: string;
  elapsedTime: number;          // Milliseconds
  estimatedTimeRemaining?: number; // Milliseconds, if calculable
  itemsPerSecond?: number;
}
```

### Sync Phases

| Phase | Description | Progress Type | Typical Duration |
|-------|-------------|---------------|------------------|
| INITIALIZING | Starting sync | Indeterminate | < 1s |
| PUSHING | Uploading changes | Determinate | 5-30s |
| PULLING | Downloading updates | Semi-determinate | 10-60s |
| RESOLVING | Resolving conflicts | Determinate | 5-20s |
| FINALIZING | Cleanup and commit | Indeterminate | < 2s |
| COMPLETED | Sync finished | 100% | N/A |

### Progress Tracking Flow

```
Sync Starts
    ↓
Phase: INITIALIZING (0%)
    ↓
Phase: PUSHING
    ↓ Batch 1/3 pushed → 33%
    ↓ Batch 2/3 pushed → 66%
    ↓ Batch 3/3 pushed → 100%
    ↓
Phase: PULLING
    ↓ Products fetched → 25%
    ↓ Prices fetched → 50%
    ↓ Stock fetched → 75%
    ↓ Customers fetched → 100%
    ↓
Phase: RESOLVING (if conflicts)
    ↓ Conflict 1/5 resolved → 20%
    ↓ Conflict 2/5 resolved → 40%
    ↓ ... → ...
    ↓
Phase: FINALIZING (indeterminate)
    ↓
Phase: COMPLETED (100%)
```

### Progress Calculation Examples

```typescript
// Determinate progress (push)
const pushProgress = (batchesPushed: number, totalBatches: number): number => {
  return Math.round((batchesPushed / totalBatches) * 100);
};

// Semi-determinate progress (pull)
const pullProgress = (entitiesPulled: number, totalEntityTypes: number): number => {
  // If we know there are 4 entity types to pull
  return Math.round((entitiesPulled / totalEntityTypes) * 100);
};

// Weighted progress across phases
const overallProgress = (phase: SyncPhase, phaseProgress: number): number => {
  const phaseWeights = {
    INITIALIZING: { start: 0, weight: 5 },
    PUSHING: { start: 5, weight: 30 },
    PULLING: { start: 35, weight: 40 },
    RESOLVING: { start: 75, weight: 15 },
    FINALIZING: { start: 90, weight: 10 }
  };
  
  const { start, weight } = phaseWeights[phase];
  return start + (phaseProgress / 100) * weight;
};
```

### ETA Calculation

```typescript
interface ProgressRate {
  itemsProcessed: number;
  timeElapsed: number; // ms
  rate: number;        // items per second
}

const calculateETA = (current: number, total: number, startTime: number): number => {
  const elapsed = Date.now() - startTime;
  const rate = current / (elapsed / 1000); // items per second
  const remaining = total - current;
  
  if (rate === 0) return -1; // Cannot calculate
  
  return (remaining / rate) * 1000; // milliseconds
};
```

### Progress Event Throttling

```typescript
class ProgressTracker {
  private lastEmitTime = 0;
  private readonly MIN_EMIT_INTERVAL = 1000; // 1 second
  
  emitProgress(progress: SyncProgress): void {
    const now = Date.now();
    
    // Always emit on phase change or completion
    if (
      progress.phase !== this.lastPhase ||
      progress.percentage === 100 ||
      now - this.lastEmitTime >= this.MIN_EMIT_INTERVAL
    ) {
      this.eventEmitter.emit('sync:progress', progress);
      this.lastEmitTime = now;
      this.lastPhase = progress.phase;
    }
  }
}
```

### Progress Persistence

```typescript
interface PersistedProgress {
  syncId: string;
  progress: SyncProgress;
  savedAt: string;
  canResume: boolean;
}

// Save progress
const saveProgress = async (progress: SyncProgress): Promise<void> => {
  await storage.set('sync_progress', {
    syncId: currentSyncId,
    progress,
    savedAt: new Date().toISOString(),
    canResume: progress.phase !== 'COMPLETED'
  });
};

// Resume progress
const resumeProgress = async (): Promise<SyncProgress | null> => {
  const saved = await storage.get('sync_progress');
  
  if (!saved || !saved.canResume) return null;
  
  // Check if too old (> 1 hour)
  const savedTime = new Date(saved.savedAt).getTime();
  if (Date.now() - savedTime > 3600000) return null;
  
  return saved.progress;
};
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes progress tracking (Task 68)
```

### Verification Checklist
- [ ] SyncProgress interface created
- [ ] Sync phases defined
- [ ] Progress tracking state implemented
- [ ] updateProgress method created
- [ ] Push progress tracked
- [ ] Pull progress tracked
- [ ] Conflict resolution progress tracked
- [ ] ETA calculation implemented
- [ ] Progress events emitted
- [ ] Progress snapshots created
- [ ] Indeterminate progress handled
- [ ] Progress persistence added

---

## Task 69: Create Sync Error Handling

### Overview
Implement comprehensive error handling for all sync operations. This includes error detection, classification, recovery strategies, and user notification.

### Dependencies
- Task 53: Create SyncEngine class
- Task 58: Implement push_transactions method
- Task 60: Implement pull_updates method

### Instructions

1. **Create SyncError class**
   - Extend Error class
   - Include error type/code
   - Include retry information
   - Include context data

2. **Define error categories**
   - NETWORK_ERROR - Connection issues
   - AUTH_ERROR - Authentication failures
   - VALIDATION_ERROR - Data validation failures
   - SERVER_ERROR - Server-side errors
   - DATA_ERROR - Data integrity issues
   - TIMEOUT_ERROR - Operation timeout
   - UNKNOWN_ERROR - Unclassified errors

3. **Create error code system**
   - Unique code for each error type
   - E.g., SYNC_001, SYNC_002, etc.
   - Include in error messages
   - Enable error lookup

4. **Implement error detection**
   - Try-catch around all async operations
   - Detect network failures
   - Detect HTTP errors
   - Detect validation failures

5. **Classify errors by severity**
   - FATAL - Cannot continue, manual intervention needed
   - ERROR - Serious but may retry
   - WARNING - Non-critical issue
   - INFO - Informational only

6. **Implement error recovery**
   - Automatic retry for transient errors
   - Fallback strategies
   - Graceful degradation
   - Clean state after error

7. **Create error context capture**
   - Capture operation being performed
   - Capture request/response data
   - Capture stack trace
   - Capture system state

8. **Handle specific error types**
   - Network timeout: retry with backoff
   - 401 Unauthorized: refresh token and retry
   - 409 Conflict: trigger conflict resolution
   - 500 Server Error: retry with backoff
   - 400 Bad Request: log and skip

9. **Implement error notification**
   - Emit sync:error event
   - Include full error details
   - Include recovery action
   - User-friendly error messages

10. **Create error logging**
    - Log all errors with context
    - Include timestamp and terminal ID
    - Store in local database
    - Enable remote error reporting

11. **Add error recovery callbacks**
    - Allow registering recovery handlers
    - Call appropriate handler for error type
    - Enable custom recovery logic
    - Return recovery result

12. **Handle partial failures**
    - Some operations succeed, others fail
    - Record successful operations
    - Retry only failed operations
    - Aggregate error information

### Error Categories and Codes

| Category | Code Range | Retry? | Examples |
|----------|------------|--------|----------|
| NETWORK_ERROR | SYNC_100-199 | Yes | Timeout, no connection |
| AUTH_ERROR | SYNC_200-299 | Yes (once) | Token expired, invalid credentials |
| VALIDATION_ERROR | SYNC_300-399 | No | Invalid data, missing fields |
| SERVER_ERROR | SYNC_400-499 | Yes | 500, 502, 503 errors |
| DATA_ERROR | SYNC_500-599 | No | Integrity violation, FK constraint |
| TIMEOUT_ERROR | SYNC_600-699 | Yes | Operation timeout |
| UNKNOWN_ERROR | SYNC_900-999 | Maybe | Unexpected errors |

### SyncError Class

```typescript
class SyncError extends Error {
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  retryable: boolean;
  context: ErrorContext;
  originalError?: Error;
  httpStatus?: number;
  
  constructor(params: {
    code: string;
    message: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    retryable: boolean;
    context: ErrorContext;
    originalError?: Error;
    httpStatus?: number;
  }) {
    super(params.message);
    this.name = 'SyncError';
    Object.assign(this, params);
  }
  
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      category: this.category,
      severity: this.severity,
      retryable: this.retryable,
      context: this.context,
      httpStatus: this.httpStatus,
      stack: this.stack
    };
  }
}
```

### Error Context Interface

```typescript
interface ErrorContext {
  operation: string;           // E.g., "push_transactions"
  phase: SyncPhase;
  terminalId: string;
  timestamp: string;
  requestData?: any;           // Sanitized request data
  responseData?: any;          // Response data if available
  retryCount: number;
  maxRetries: number;
  additionalInfo?: Record<string, any>;
}
```

### Error Handling Flow

```
Operation Executed
    ↓
Error Occurs
    ↓
Catch Error
    ↓
Classify Error
    ↓
Capture Context
    ↓
Is Retryable? → YES → Apply Backoff → Retry
    ↓ NO                                 ↓
Log Error                          Success? → YES → Continue
    ↓                                  ↓ NO
Emit Error Event              Max Retries? → YES → Log & Emit Error
    ↓                                  ↓ NO
Notify User                           Loop Retry
    ↓
Cleanup State
    ↓
Return Error Result
```

### Specific Error Handling

```typescript
const handleSyncError = async (error: Error, context: ErrorContext): Promise<SyncError> => {
  // Network errors
  if (error.name === 'NetworkError' || error.message.includes('network')) {
    return new SyncError({
      code: 'SYNC_101',
      message: 'Network connection lost. Will retry when online.',
      category: 'NETWORK_ERROR',
      severity: 'ERROR',
      retryable: true,
      context
    });
  }
  
  // HTTP errors
  if ('status' in error) {
    const httpError = error as { status: number; statusText: string };
    
    switch (httpError.status) {
      case 401:
        return new SyncError({
          code: 'SYNC_201',
          message: 'Authentication expired. Refreshing token...',
          category: 'AUTH_ERROR',
          severity: 'ERROR',
          retryable: true,
          context,
          httpStatus: 401
        });
      
      case 409:
        return new SyncError({
          code: 'SYNC_301',
          message: 'Data conflict detected. Resolving...',
          category: 'VALIDATION_ERROR',
          severity: 'WARNING',
          retryable: false,
          context,
          httpStatus: 409
        });
      
      case 500:
      case 502:
      case 503:
        return new SyncError({
          code: 'SYNC_401',
          message: 'Server error. Will retry shortly.',
          category: 'SERVER_ERROR',
          severity: 'ERROR',
          retryable: true,
          context,
          httpStatus: httpError.status
        });
      
      default:
        // ... other cases
    }
  }
  
  // Unknown errors
  return new SyncError({
    code: 'SYNC_999',
    message: `Unexpected error: ${error.message}`,
    category: 'UNKNOWN_ERROR',
    severity: 'ERROR',
    retryable: false,
    context,
    originalError: error
  });
};
```

### Error Recovery Strategies

| Error Type | Strategy | Action |
|------------|----------|--------|
| Network timeout | Retry with backoff | Wait and retry |
| 401 Unauthorized | Refresh token | Get new token, retry once |
| 409 Conflict | Resolve conflict | Trigger conflict resolution |
| 500 Server Error | Retry with backoff | Wait and retry |
| 400 Bad Request | Skip and log | Mark as failed, continue |
| Data integrity | Manual review | Flag for admin |

### Error Notification

```typescript
interface ErrorNotification {
  errorCode: string;
  title: string;
  message: string;
  severity: ErrorSeverity;
  userAction?: string;          // What user should do
  retrying: boolean;
  retryIn?: number;             // Seconds until retry
  canDismiss: boolean;
  showDetails: boolean;
}

// Example
const notifyError = (error: SyncError): ErrorNotification => {
  return {
    errorCode: error.code,
    title: 'Sync Error',
    message: getUserFriendlyMessage(error),
    severity: error.severity,
    userAction: getRecommendedAction(error),
    retrying: error.retryable,
    retryIn: error.retryable ? getNextRetryDelay(error) : undefined,
    canDismiss: error.severity !== 'FATAL',
    showDetails: true
  };
};

const getUserFriendlyMessage = (error: SyncError): string => {
  switch (error.code) {
    case 'SYNC_101':
      return 'No internet connection. Sync will continue when connection is restored.';
    case 'SYNC_201':
      return 'Session expired. Logging in again...';
    case 'SYNC_401':
      return 'Server is temporarily unavailable. Retrying...';
    default:
      return error.message;
  }
};
```

### Error Logging

```typescript
interface ErrorLog {
  id: string;
  errorCode: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context: ErrorContext;
  stackTrace: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  resolutionNotes?: string;
}

const logError = async (error: SyncError): Promise<void> => {
  const errorLog: ErrorLog = {
    id: generateId(),
    errorCode: error.code,
    message: error.message,
    category: error.category,
    severity: error.severity,
    context: error.context,
    stackTrace: error.stack || '',
    timestamp: new Date().toISOString(),
    resolved: false
  };
  
  // Save to local database
  await db.errorLogs.add(errorLog);
  
  // Send to remote logging service (if online)
  if (navigator.onLine) {
    try {
      await remoteLogger.log(errorLog);
    } catch (e) {
      // Queue for later
      await db.pendingLogs.add(errorLog);
    }
  }
};
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes error handling (Task 69)
```

### Verification Checklist
- [ ] SyncError class created
- [ ] Error categories defined
- [ ] Error code system created
- [ ] Error detection implemented
- [ ] Error severity classification added
- [ ] Error recovery implemented
- [ ] Error context capture added
- [ ] Specific error handlers created
- [ ] Error notification implemented
- [ ] Error logging created
- [ ] Recovery callbacks added
- [ ] Partial failure handling added

---

## Task 70: Implement Exponential Backoff

### Overview
Implement exponential backoff strategy for retry logic. This prevents overwhelming the server with retry attempts and increases chances of success.

### Dependencies
- Task 69: Create sync error handling

### Instructions

1. **Create BackoffStrategy class**
   - Manage retry timing
   - Calculate backoff delays
   - Track retry attempts
   - Reset on success

2. **Define backoff configuration**
   - Initial delay (e.g., 1 second)
   - Maximum delay (e.g., 60 seconds)
   - Backoff multiplier (e.g., 2)
   - Maximum retry attempts (e.g., 5)
   - Add jitter option

3. **Implement basic exponential backoff**
   - Formula: delay = min(initialDelay * (multiplier ^ attempt), maxDelay)
   - Attempt 1: 1s, Attempt 2: 2s, Attempt 3: 4s, etc.
   - Cap at maximum delay

4. **Add jitter to backoff**
   - Randomize delay slightly
   - Prevents thundering herd
   - Jitter: delay ± (delay * jitterFactor)
   - Default jitter: 10%

5. **Create retry attempt counter**
   - Track current attempt number
   - Reset to 0 on success
   - Increment on each retry
   - Stop at max attempts

6. **Implement shouldRetry method**
   - Check if more retries allowed
   - Check if error is retryable
   - Check if backoff not exhausted
   - Return boolean

7. **Create getNextDelay method**
   - Calculate next retry delay
   - Apply exponential formula
   - Add jitter
   - Return delay in milliseconds

8. **Implement wait function**
   - Async function to wait for delay
   - Uses setTimeout with Promise
   - Cancellable if needed
   - Returns when delay complete

9. **Add backoff reset logic**
   - Reset on successful operation
   - Reset on manual sync
   - Reset after long idle period
   - Clear retry counter

10. **Implement adaptive backoff**
    - Adjust based on error type
    - Network errors: standard backoff
    - Server errors: longer backoff
    - Auth errors: immediate retry once
    - Customize per error category

11. **Add circuit breaker pattern**
    - Stop retrying after consecutive failures
    - Wait longer before trying again
    - Prevent unnecessary load
    - Reset after successful operation

12. **Create backoff metrics**
    - Track total retry attempts
    - Track total backoff time
    - Calculate success rate after retries
    - Enable backoff tuning

### Backoff Configuration

```typescript
interface BackoffConfig {
  initialDelay: number;         // milliseconds
  maxDelay: number;             // milliseconds
  multiplier: number;           // exponential factor
  maxAttempts: number;
  jitterFactor: number;         // 0-1, percentage of delay
  resetOnSuccess: boolean;
}

const defaultBackoffConfig: BackoffConfig = {
  initialDelay: 1000,           // 1 second
  maxDelay: 60000,              // 60 seconds
  multiplier: 2,
  maxAttempts: 5,
  jitterFactor: 0.1,            // 10% jitter
  resetOnSuccess: true
};
```

### Exponential Backoff Formula

```
Attempt | Formula | Delay (no jitter) | With 10% Jitter Range
--------|---------|-------------------|----------------------
   1    | 1 * 2^0 | 1s                | 0.9s - 1.1s
   2    | 1 * 2^1 | 2s                | 1.8s - 2.2s
   3    | 1 * 2^2 | 4s                | 3.6s - 4.4s
   4    | 1 * 2^3 | 8s                | 7.2s - 8.8s
   5    | 1 * 2^4 | 16s               | 14.4s - 17.6s
   6    | 1 * 2^5 | 32s               | 28.8s - 35.2s
   7+   | capped  | 60s               | 54s - 66s
```

### BackoffStrategy Implementation

```typescript
class BackoffStrategy {
  private config: BackoffConfig;
  private currentAttempt: number = 0;
  private lastAttemptTime: number = 0;
  
  constructor(config: Partial<BackoffConfig> = {}) {
    this.config = { ...defaultBackoffConfig, ...config };
  }
  
  shouldRetry(error: SyncError): boolean {
    return (
      error.retryable &&
      this.currentAttempt < this.config.maxAttempts
    );
  }
  
  getNextDelay(): number {
    const baseDelay = Math.min(
      this.config.initialDelay * Math.pow(this.config.multiplier, this.currentAttempt),
      this.config.maxDelay
    );
    
    // Add jitter
    const jitter = baseDelay * this.config.jitterFactor;
    const jitterAmount = (Math.random() * 2 - 1) * jitter; // -jitter to +jitter
    
    return Math.max(0, Math.round(baseDelay + jitterAmount));
  }
  
  async wait(): Promise<void> {
    const delay = this.getNextDelay();
    this.currentAttempt++;
    this.lastAttemptTime = Date.now();
    
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  
  reset(): void {
    this.currentAttempt = 0;
    this.lastAttemptTime = 0;
  }
  
  getCurrentAttempt(): number {
    return this.currentAttempt;
  }
  
  getMaxAttempts(): number {
    return this.config.maxAttempts;
  }
}
```

### Retry with Backoff

```typescript
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  backoff: BackoffStrategy,
  errorHandler: (error: Error) => SyncError
): Promise<T> => {
  let lastError: SyncError;
  
  while (true) {
    try {
      const result = await operation();
      backoff.reset(); // Success, reset backoff
      return result;
    } catch (error) {
      lastError = errorHandler(error as Error);
      
      if (!backoff.shouldRetry(lastError)) {
        throw lastError;
      }
      
      // Log retry attempt
      console.log(
        `Retry attempt ${backoff.getCurrentAttempt() + 1}/${backoff.getMaxAttempts()}`,
        `Next retry in ${backoff.getNextDelay()}ms`
      );
      
      // Emit retry event
      eventEmitter.emit('sync:retrying', {
        error: lastError,
        attempt: backoff.getCurrentAttempt() + 1,
        maxAttempts: backoff.getMaxAttempts(),
        nextRetryDelay: backoff.getNextDelay()
      });
      
      // Wait before retry
      await backoff.wait();
    }
  }
};

// Usage
const pushTransactions = async () => {
  return retryWithBackoff(
    () => api.post('/sync/push', transactions),
    new BackoffStrategy(),
    handleSyncError
  );
};
```

### Adaptive Backoff

```typescript
const getBackoffConfigForError = (error: SyncError): BackoffConfig => {
  switch (error.category) {
    case 'NETWORK_ERROR':
      return {
        initialDelay: 2000,    // Start with 2s
        maxDelay: 60000,
        multiplier: 2,
        maxAttempts: 10,       // More attempts for network issues
        jitterFactor: 0.2,     // More jitter
        resetOnSuccess: true
      };
    
    case 'SERVER_ERROR':
      return {
        initialDelay: 5000,    // Start with 5s
        maxDelay: 120000,      // Up to 2 minutes
        multiplier: 2,
        maxAttempts: 5,
        jitterFactor: 0.1,
        resetOnSuccess: true
      };
    
    case 'AUTH_ERROR':
      return {
        initialDelay: 0,       // Immediate retry after token refresh
        maxDelay: 1000,
        multiplier: 1,
        maxAttempts: 1,        // Only retry once
        jitterFactor: 0,
        resetOnSuccess: true
      };
    
    default:
      return defaultBackoffConfig;
  }
};
```

### Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  private readonly failureThreshold = 5;
  private readonly timeout = 60000; // 1 minute
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes exponential backoff (Task 70)
```

### Verification Checklist
- [ ] BackoffStrategy class created
- [ ] Backoff configuration defined
- [ ] Basic exponential backoff implemented
- [ ] Jitter added to backoff
- [ ] Retry attempt counter created
- [ ] shouldRetry method implemented
- [ ] getNextDelay method created
- [ ] Wait function implemented
- [ ] Backoff reset logic added
- [ ] Adaptive backoff implemented
- [ ] Circuit breaker pattern added
- [ ] Backoff metrics created

---

## Task 71: Create Sync Completion Callbacks

### Overview
Implement callback system to notify components when sync operations complete. This enables coordinated updates across the application.

### Dependencies
- Task 53: Create SyncEngine class
- Task 68: Implement sync progress tracking

### Instructions

1. **Create callback registration system**
   - Method: `onSyncComplete(callback: SyncCallback)`
   - Store callbacks in array
   - Return unsubscribe function
   - Support multiple callbacks

2. **Define SyncResult interface**
   - Success/failure status
   - Duration
   - Items synced
   - Errors encountered
   - Conflicts resolved
   - Timestamp

3. **Implement callback invocation**
   - Call all registered callbacks on sync completion
   - Pass SyncResult to callbacks
   - Handle callback errors gracefully
   - Don't block on callback execution

4. **Add callback priorities**
   - HIGH priority callbacks execute first
   - NORMAL priority (default)
   - LOW priority callbacks execute last
   - Within same priority, FIFO order

5. **Create async callback support**
   - Callbacks can be async
   - Wait for all callbacks to complete
   - Timeout for slow callbacks
   - Log callback execution time

6. **Implement callback error handling**
   - Catch errors in callbacks
   - Log but don't propagate
   - Continue with other callbacks
   - Report callback failures

7. **Add callback filtering**
   - Filter by sync type (push, pull, full)
   - Filter by success/failure
   - Filter by entity types affected
   - Selective callback execution

8. **Create callback context**
   - Pass additional context to callbacks
   - Terminal ID
   - Sync type
   - Affected entities
   - User information

9. **Implement one-time callbacks**
   - Method: `onceSyncComplete(callback)`
   - Execute only once
   - Auto-unsubscribe after execution
   - Useful for awaiting specific sync

10. **Add callback cleanup**
    - Clear all callbacks on destroy
    - Prevent memory leaks
    - Remove invalid callbacks
    - Cleanup on sync engine reset

11. **Create callback events**
    - Emit events before/after callbacks
    - Allow observing callback execution
    - Enable debugging callback chain
    - Track callback performance

12. **Implement common callback patterns**
    - Refresh UI after sync
    - Update cache after sync
    - Notify user of sync completion
    - Trigger dependent syncs

### Callback Interfaces

```typescript
type SyncCallback = (result: SyncResult, context: SyncContext) => void | Promise<void>;

interface SyncResult {
  success: boolean;
  syncType: 'push' | 'pull' | 'full';
  duration: number;              // milliseconds
  startTime: string;
  endTime: string;
  stats: {
    transactionsPushed: number;
    transactionsFailed: number;
    entitiesPulled: number;
    conflictsDetected: number;
    conflictsResolved: number;
    conflictsManual: number;
  };
  errors: SyncError[];
  warnings: string[];
}

interface SyncContext {
  terminalId: string;
  syncId: string;
  triggeredBy: 'auto' | 'manual' | 'scheduled';
  affectedEntities: {
    type: string;
    ids: string[];
  }[];
  metadata?: Record<string, any>;
}

interface CallbackRegistration {
  id: string;
  callback: SyncCallback;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  filter?: CallbackFilter;
  once: boolean;
}

interface CallbackFilter {
  syncTypes?: ('push' | 'pull' | 'full')[];
  onSuccess?: boolean;
  onFailure?: boolean;
  entityTypes?: string[];
}
```

### Callback Registration System

```typescript
class CallbackManager {
  private callbacks: CallbackRegistration[] = [];
  private callbackIdCounter = 0;
  
  register(
    callback: SyncCallback,
    options: {
      priority?: 'HIGH' | 'NORMAL' | 'LOW';
      filter?: CallbackFilter;
      once?: boolean;
    } = {}
  ): () => void {
    const registration: CallbackRegistration = {
      id: `callback-${++this.callbackIdCounter}`,
      callback,
      priority: options.priority || 'NORMAL',
      filter: options.filter,
      once: options.once || false
    };
    
    this.callbacks.push(registration);
    
    // Return unsubscribe function
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb.id !== registration.id);
    };
  }
  
  async invoke(result: SyncResult, context: SyncContext): Promise<void> {
    // Sort by priority
    const sortedCallbacks = this.getSortedCallbacks();
    
    // Filter applicable callbacks
    const applicableCallbacks = sortedCallbacks.filter(cb =>
      this.shouldInvokeCallback(cb, result, context)
    );
    
    // Execute callbacks
    for (const registration of applicableCallbacks) {
      try {
        await this.executeCallback(registration, result, context);
        
        // Remove if once
        if (registration.once) {
          this.callbacks = this.callbacks.filter(cb => cb.id !== registration.id);
        }
      } catch (error) {
        console.error(`Callback ${registration.id} failed:`, error);
      }
    }
  }
  
  private getSortedCallbacks(): CallbackRegistration[] {
    const priorityOrder = { HIGH: 0, NORMAL: 1, LOW: 2 };
    
    return [...this.callbacks].sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
  
  private shouldInvokeCallback(
    registration: CallbackRegistration,
    result: SyncResult,
    context: SyncContext
  ): boolean {
    if (!registration.filter) return true;
    
    const filter = registration.filter;
    
    // Check sync type
    if (filter.syncTypes && !filter.syncTypes.includes(result.syncType)) {
      return false;
    }
    
    // Check success/failure
    if (filter.onSuccess !== undefined && filter.onSuccess !== result.success) {
      return false;
    }
    if (filter.onFailure !== undefined && filter.onFailure === result.success) {
      return false;
    }
    
    // Check entity types
    if (filter.entityTypes) {
      const affectedTypes = context.affectedEntities.map(e => e.type);
      const hasMatchingType = filter.entityTypes.some(type =>
        affectedTypes.includes(type)
      );
      if (!hasMatchingType) return false;
    }
    
    return true;
  }
  
  private async executeCallback(
    registration: CallbackRegistration,
    result: SyncResult,
    context: SyncContext
  ): Promise<void> {
    const timeout = 5000; // 5 second timeout
    
    const callbackPromise = registration.callback(result, context);
    
    if (callbackPromise instanceof Promise) {
      await Promise.race([
        callbackPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Callback timeout')), timeout)
        )
      ]);
    }
  }
  
  clear(): void {
    this.callbacks = [];
  }
}
```

### Usage Examples

```typescript
// Simple callback
syncEngine.onSyncComplete((result) => {
  console.log('Sync completed:', result.success);
  if (result.success) {
    showNotification('Sync successful!');
  }
});

// High priority callback with filter
syncEngine.onSyncComplete(
  (result, context) => {
    // Refresh product cache
    productCache.refresh();
  },
  {
    priority: 'HIGH',
    filter: {
      onSuccess: true,
      entityTypes: ['products', 'prices']
    }
  }
);

// One-time callback
const unsubscribe = syncEngine.onceSyncComplete((result) => {
  console.log('First sync after app start:', result);
});

// Async callback
syncEngine.onSyncComplete(async (result, context) => {
  if (result.success && result.stats.transactionsPushed > 0) {
    await updateDashboard();
    await notifyManager(`${result.stats.transactionsPushed} transactions synced`);
  }
});

// Cleanup
const unsubscribe = syncEngine.onSyncComplete(callback);
// Later...
unsubscribe();
```

### Common Callback Patterns

```typescript
// Pattern 1: Refresh UI data
const refreshUICallback = (result: SyncResult) => {
  if (result.success) {
    // Refresh all product displays
    eventBus.emit('data:refresh', { entities: ['products', 'prices'] });
  }
};

// Pattern 2: Update local cache
const updateCacheCallback = async (result: SyncResult, context: SyncContext) => {
  for (const entity of context.affectedEntities) {
    await cache.invalidate(entity.type, entity.ids);
  }
};

// Pattern 3: Show notification
const notificationCallback = (result: SyncResult) => {
  if (result.success) {
    showToast({
      message: `Synced ${result.stats.transactionsPushed} transactions`,
      type: 'success',
      duration: 3000
    });
  } else {
    showToast({
      message: 'Sync failed. Will retry automatically.',
      type: 'error',
      duration: 5000
    });
  }
};

// Pattern 4: Analytics tracking
const analyticsCallback = (result: SyncResult) => {
  analytics.track('sync_completed', {
    success: result.success,
    duration: result.duration,
    transactions_pushed: result.stats.transactionsPushed,
    conflicts_resolved: result.stats.conflictsResolved
  });
};

// Register all patterns
syncEngine.onSyncComplete(refreshUICallback, { priority: 'HIGH' });
syncEngine.onSyncComplete(updateCacheCallback);
syncEngine.onSyncComplete(notificationCallback, { priority: 'LOW' });
syncEngine.onSyncComplete(analyticsCallback, { priority: 'LOW' });
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes callbacks (Task 71)
```

### Verification Checklist
- [ ] Callback registration system created
- [ ] SyncResult interface defined
- [ ] Callback invocation implemented
- [ ] Callback priorities added
- [ ] Async callback support created
- [ ] Callback error handling implemented
- [ ] Callback filtering added
- [ ] Callback context created
- [ ] One-time callbacks implemented
- [ ] Callback cleanup added
- [ ] Callback events created
- [ ] Common patterns implemented

---

## Task 72: Add Sync Analytics

### Overview
Implement comprehensive analytics tracking for sync operations. Track performance metrics, success rates, error patterns, and usage statistics.

### Dependencies
- Task 53: Create SyncEngine class
- Task 71: Create sync completion callbacks

### Instructions

1. **Create SyncAnalytics class**
   - Create new file: `frontend/lib/offline/sync-analytics.ts`
   - Track all sync-related metrics
   - Store analytics data
   - Generate reports

2. **Define analytics metrics**
   - Sync frequency (syncs per day)
   - Success rate (successful syncs / total syncs)
   - Average sync duration
   - Data volume (bytes transferred)
   - Error rates by type
   - Conflict resolution rates

3. **Track sync operations**
   - Record each sync start
   - Record each sync completion
   - Track duration
   - Track outcome (success/failure)
   - Track data volumes

4. **Implement metrics collection**
   - Count total syncs
   - Count successful syncs
   - Count failed syncs
   - Calculate averages
   - Identify trends

5. **Track error patterns**
   - Group errors by type
   - Count occurrences
   - Track resolution success
   - Identify frequent errors

6. **Monitor performance metrics**
   - Track sync duration trends
   - Identify slow syncs
   - Track network performance
   - Monitor batch sizes

7. **Collect conflict statistics**
   - Count conflicts by type
   - Track resolution strategies used
   - Monitor manual resolution rate
   - Measure conflict impact

8. **Implement time-based analytics**
   - Metrics by hour of day
   - Metrics by day of week
   - Peak usage times
   - Usage patterns

9. **Create analytics dashboard data**
   - Prepare data for visualization
   - Calculate KPIs
   - Generate summaries
   - Create time series data

10. **Add analytics persistence**
    - Store analytics in local database
    - Aggregate over time periods
    - Purge old data
    - Export for analysis

11. **Implement analytics reporting**
    - Generate daily/weekly reports
    - Send to analytics service
    - Create manager summaries
    - Enable data export

12. **Add performance benchmarks**
    - Compare against baselines
    - Alert on degradation
    - Track improvements
    - Enable optimization

### Analytics Metrics

```typescript
interface SyncMetrics {
  // Frequency
  totalSyncs: number;
  syncsToday: number;
  syncsThisWeek: number;
  averageSyncsPerDay: number;
  
  // Success Rate
  successfulSyncs: number;
  failedSyncs: number;
  successRate: number;              // percentage
  
  // Duration
  averageDuration: number;          // milliseconds
  minDuration: number;
  maxDuration: number;
  totalDuration: number;
  
  // Data Volume
  totalBytesPushed: number;
  totalBytesPulled: number;
  averageBytesPerSync: number;
  
  // Transactions
  totalTransactionsPushed: number;
  averageTransactionsPerSync: number;
  
  // Conflicts
  totalConflicts: number;
  conflictsAutoResolved: number;
  conflictsManualResolved: number;
  conflictRate: number;             // conflicts per sync
  
  // Errors
  totalErrors: number;
  errorsByType: Record<string, number>;
  mostCommonError: string;
  
  // Time Analysis
  lastSyncTime: string;
  averageTimeBetweenSyncs: number;  // milliseconds
  
  // Network
  averageNetworkLatency: number;    // milliseconds
  networkErrors: number;
}
```

### Analytics Tracking

```typescript
class SyncAnalytics {
  private db: Database;
  private metrics: SyncMetrics;
  
  constructor(db: Database) {
    this.db = db;
    this.metrics = this.initializeMetrics();
  }
  
  async trackSyncStart(syncId: string): Promise<void> {
    await this.db.syncEvents.add({
      syncId,
      event: 'START',
      timestamp: new Date().toISOString()
    });
  }
  
  async trackSyncComplete(
    syncId: string,
    result: SyncResult,
    context: SyncContext
  ): Promise<void> {
    // Record event
    await this.db.syncEvents.add({
      syncId,
      event: 'COMPLETE',
      timestamp: new Date().toISOString(),
      result,
      context
    });
    
    // Update metrics
    await this.updateMetrics(result);
    
    // Check for anomalies
    await this.detectAnomalies(result);
  }
  
  private async updateMetrics(result: SyncResult): Promise<void> {
    this.metrics.totalSyncs++;
    
    if (result.success) {
      this.metrics.successfulSyncs++;
    } else {
      this.metrics.failedSyncs++;
    }
    
    this.metrics.successRate =
      (this.metrics.successfulSyncs / this.metrics.totalSyncs) * 100;
    
    // Update duration metrics
    this.updateDurationMetrics(result.duration);
    
    // Update transaction metrics
    this.metrics.totalTransactionsPushed += result.stats.transactionsPushed;
    
    // Update conflict metrics
    this.updateConflictMetrics(result.stats);
    
    // Update error metrics
    this.updateErrorMetrics(result.errors);
    
    // Persist metrics
    await this.saveMetrics();
  }
  
  private updateDurationMetrics(duration: number): void {
    const total = this.metrics.totalDuration + duration;
    this.metrics.totalDuration = total;
    this.metrics.averageDuration = total / this.metrics.totalSyncs;
    
    if (!this.metrics.minDuration || duration < this.metrics.minDuration) {
      this.metrics.minDuration = duration;
    }
    
    if (duration > this.metrics.maxDuration) {
      this.metrics.maxDuration = duration;
    }
  }
  
  async generateReport(period: 'day' | 'week' | 'month'): Promise<SyncReport> {
    const events = await this.getEventsForPeriod(period);
    
    return {
      period,
      startDate: events[0]?.timestamp,
      endDate: events[events.length - 1]?.timestamp,
      summary: await this.calculateSummary(events),
      charts: await this.generateChartData(events),
      insights: await this.generateInsights(events)
    };
  }
}
```

### Analytics Storage Schema

```typescript
interface SyncEvent {
  id: string;
  syncId: string;
  event: 'START' | 'COMPLETE' | 'ERROR';
  timestamp: string;
  result?: SyncResult;
  context?: SyncContext;
}

interface SyncAnalyticsRecord {
  id: string;
  date: string;                    // YYYY-MM-DD
  metrics: SyncMetrics;
  hourly: {
    hour: number;                  // 0-23
    syncs: number;
    successRate: number;
  }[];
  errors: {
    type: string;
    count: number;
    samples: string[];             // Sample error messages
  }[];
}
```

### Performance Benchmarks

```typescript
interface PerformanceBenchmark {
  metric: string;
  baseline: number;
  current: number;
  threshold: number;
  status: 'GOOD' | 'WARNING' | 'CRITICAL';
}

const benchmarks: PerformanceBenchmark[] = [
  {
    metric: 'Average Sync Duration',
    baseline: 15000,               // 15 seconds
    current: getCurrentAverageDuration(),
    threshold: 30000,              // 30 seconds
    status: getCurrentAverageDuration() > 30000 ? 'CRITICAL' : 'GOOD'
  },
  {
    metric: 'Success Rate',
    baseline: 98,                  // 98%
    current: getSuccessRate(),
    threshold: 90,                 // 90%
    status: getSuccessRate() < 90 ? 'CRITICAL' : 'GOOD'
  },
  {
    metric: 'Network Error Rate',
    baseline: 2,                   // 2%
    current: getNetworkErrorRate(),
    threshold: 10,                 // 10%
    status: getNetworkErrorRate() > 10 ? 'WARNING' : 'GOOD'
  }
];
```

### Analytics Report Format

```typescript
interface SyncReport {
  period: 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
  
  summary: {
    totalSyncs: number;
    successRate: number;
    averageDuration: number;
    totalDataTransferred: number;
    topErrors: {
      type: string;
      count: number;
      percentage: number;
    }[];
  };
  
  charts: {
    syncsOverTime: {
      labels: string[];
      successful: number[];
      failed: number[];
    };
    durationTrend: {
      labels: string[];
      average: number[];
      min: number[];
      max: number[];
    };
    errorDistribution: {
      labels: string[];
      values: number[];
    };
  };
  
  insights: {
    type: 'INFO' | 'WARNING' | 'SUCCESS';
    message: string;
    recommendation?: string;
  }[];
}
```

### Insight Generation

```typescript
const generateInsights = (metrics: SyncMetrics): Insight[] => {
  const insights: Insight[] = [];
  
  // Success rate insight
  if (metrics.successRate < 90) {
    insights.push({
      type: 'WARNING',
      message: `Success rate is ${metrics.successRate.toFixed(1)}%, below target of 90%`,
      recommendation: 'Review error logs and improve error handling'
    });
  } else if (metrics.successRate > 98) {
    insights.push({
      type: 'SUCCESS',
      message: `Excellent success rate of ${metrics.successRate.toFixed(1)}%`
    });
  }
  
  // Duration insight
  if (metrics.averageDuration > 30000) {
    insights.push({
      type: 'WARNING',
      message: `Average sync duration is ${(metrics.averageDuration / 1000).toFixed(1)}s`,
      recommendation: 'Consider optimizing batch sizes or improving network connection'
    });
  }
  
  // Conflict insight
  if (metrics.conflictRate > 0.5) {
    insights.push({
      type: 'INFO',
      message: `High conflict rate: ${metrics.conflictRate.toFixed(2)} conflicts per sync`,
      recommendation: 'Review offline usage patterns and sync frequency'
    });
  }
  
  // Error pattern insight
  if (metrics.networkErrors > metrics.totalSyncs * 0.1) {
    insights.push({
      type: 'WARNING',
      message: 'Frequent network errors detected',
      recommendation: 'Check internet connectivity stability'
    });
  }
  
  return insights;
};
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── sync-engine.ts
        └── sync-analytics.ts        # Sync analytics (Task 72)
```

### Verification Checklist
- [ ] SyncAnalytics class created
- [ ] Analytics metrics defined
- [ ] Sync operations tracked
- [ ] Metrics collection implemented
- [ ] Error patterns tracked
- [ ] Performance metrics monitored
- [ ] Conflict statistics collected
- [ ] Time-based analytics implemented
- [ ] Dashboard data created
- [ ] Analytics persistence added
- [ ] Analytics reporting implemented
- [ ] Performance benchmarks added

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 68 | Implement sync progress tracking | Real-time progress monitoring |
| 69 | Create sync error handling | Comprehensive error management |
| 70 | Implement exponential backoff | Intelligent retry strategy |
| 71 | Create sync completion callbacks | Component notification system |
| 72 | Add sync analytics | Performance and usage tracking |

### Files Created
```
frontend/
└── lib/
    └── offline/
        ├── sync-engine.ts          # Complete sync engine
        └── sync-analytics.ts       # Analytics tracking
```

### Key Concepts Implemented

#### Progress Tracking
- Multi-phase progress monitoring
- ETA calculation
- Progress event emission
- Indeterminate progress handling

#### Error Handling
- Comprehensive error classification
- Context capture
- Recovery strategies
- User-friendly notifications

#### Retry Strategy
- Exponential backoff with jitter
- Adaptive backoff per error type
- Circuit breaker pattern
- Retry exhaustion handling

#### Callbacks & Notifications
- Priority-based callback system
- Filtered callback execution
- Async callback support
- One-time callbacks

#### Analytics & Monitoring
- Performance metrics tracking
- Success rate monitoring
- Error pattern analysis
- Insight generation

### Group D Complete

All 20 tasks in Group D are now documented. The sync engine implementation includes:
- ✓ Connection detection and monitoring
- ✓ Automatic sync triggers
- ✓ Transaction push with batch optimization
- ✓ Server updates pull with delta sync
- ✓ Multi-strategy conflict resolution
- ✓ Specialized stock and price handlers
- ✓ Progress tracking and reporting
- ✓ Comprehensive error handling
- ✓ Intelligent retry logic
- ✓ Callback system
- ✓ Analytics and monitoring

### Next Steps
Proceed to [../Group-E_Frontend-Offline-Components/](../Group-E_Frontend-Offline-Components/) to implement:
1. Offline indicator UI
2. Sync status display
3. Manual sync button
4. Conflict resolution UI
5. Offline transaction list

---

## Notes for AI Agents

### Progress Tracking Best Practices
1. **Granularity:** Balance between too frequent and too sparse updates
2. **Performance:** Don't let progress tracking slow down the actual work
3. **User Experience:** Provide meaningful feedback at each phase
4. **ETA Accuracy:** Calculate conservatively to avoid disappointing users
5. **Indeterminate State:** Use when total is unknown instead of fake progress

### Error Handling Philosophy
1. **Fail Gracefully:** Never crash the app due to sync errors
2. **Be Specific:** Provide detailed error information for debugging
3. **User-Friendly:** Translate technical errors to user-understandable messages
4. **Recoverable:** Always attempt recovery before giving up
5. **Logged:** Log everything for post-mortem analysis

### Retry Strategy Considerations
1. **Don't Overwhelm:** Exponential backoff prevents server overload
2. **Jitter Matters:** Prevents thundering herd on reconnection
3. **Circuit Breaking:** Protect both client and server resources
4. **Adaptive:** Different errors need different strategies
5. **Give Up Eventually:** Don't retry forever

### Analytics Usage
1. **Optimize:** Use data to improve batch sizes and timing
2. **Debug:** Analytics help identify systematic issues
3. **Plan:** Usage patterns inform infrastructure decisions
4. **Alert:** Proactive monitoring prevents issues
5. **Privacy:** Never track sensitive business data
