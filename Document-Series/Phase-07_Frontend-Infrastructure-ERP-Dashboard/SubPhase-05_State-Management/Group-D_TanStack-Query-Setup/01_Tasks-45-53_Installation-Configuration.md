# Tasks 45-53: Installation and Configuration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** D - TanStack Query Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52, 53

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-54-60_Query-Key-Factory.md](02_Tasks-54-60_Query-Key-Factory.md)

---

## Document Overview

This document covers the installation and configuration of TanStack Query (React Query v5) for server state management in the frontend application. It includes package installation, QueryClient configuration with default options for caching and refetching, provider setup, and DevTools integration. These elements establish the foundation for efficient server state management across all ERP modules.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Install TanStack Query | Low | 5 min |
| 46 | Install DevTools | Low | 5 min |
| 47 | Create QueryClient Configuration | Medium | 20 min |
| 48 | Set Default Stale Time | Low | 10 min |
| 49 | Set Default Cache Time | Low | 10 min |
| 50 | Set Default Retry Config | Low | 15 min |
| 51 | Configure Refetch on Window Focus | Low | 10 min |
| 52 | Create QueryClientProvider | Low | 15 min |
| 53 | Add ReactQueryDevtools | Low | 10 min |

---

## Task 45: Install TanStack Query

### Overview
Install the core TanStack Query (React Query) package which provides the foundation for server state management. This library handles data fetching, caching, synchronization, and updates for server state in React applications.

### Dependencies
- SubPhase-04 (Zustand Setup) must be completed
- Next.js frontend project must be initialized
- Node.js and npm/yarn/pnpm must be available

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in frontend project root
   - Verify package.json exists
   - Check current React version (must be 18+)

2. **Install TanStack Query package**
   - Use npm, yarn, or pnpm to install
   - Install version 5.x (latest stable)
   - Verify installation in package.json dependencies

3. **Verify package installation**
   - Check that @tanstack/react-query appears in package.json
   - Confirm version is 5.x or higher
   - Run build to ensure no conflicts

4. **Check peer dependencies**
   - Verify React version compatibility (18.0.0+)
   - Ensure no conflicting packages
   - Resolve any peer dependency warnings

### Package Details

| Package | Version | Purpose |
|---------|---------|---------|
| @tanstack/react-query | ^5.0.0 | Core server state management |
| react | ^18.0.0 | Required peer dependency |
| react-dom | ^18.0.0 | Required peer dependency |

### TanStack Query Features

TanStack Query provides powerful features out of the box:

- **Automatic Caching:** Query results cached by default
- **Background Updates:** Automatic data refetching
- **Request Deduplication:** Multiple identical requests merged
- **Optimistic Updates:** UI updates before server confirmation
- **Infinite Queries:** Pagination and infinite scroll support
- **Prefetching:** Preload data before needed
- **Query Cancellation:** Cancel in-flight requests
- **Retry Logic:** Automatic retry on failure
- **Garbage Collection:** Automatic cleanup of unused cache

### Installation Command Reference

**Using npm:**
```
npm install @tanstack/react-query
```

**Using yarn:**
```
yarn add @tanstack/react-query
```

**Using pnpm:**
```
pnpm add @tanstack/react-query
```

### Expected Outcome
- @tanstack/react-query package added to dependencies
- Package successfully installed in node_modules
- No installation errors or warnings
- Ready to import QueryClient and other utilities

### Verification Checklist
- [ ] @tanstack/react-query appears in package.json
- [ ] Version is 5.x or higher
- [ ] Package installed in node_modules
- [ ] No peer dependency errors
- [ ] Frontend build runs without errors
- [ ] Can import from '@tanstack/react-query'

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Peer dependency mismatch | Update React to 18.0.0+ |
| Installation fails | Clear node_modules and reinstall |
| Version conflict | Check for existing react-query v4 |
| TypeScript errors | Ensure TypeScript 4.7+ |

---

## Task 46: Install DevTools

### Overview
Install the TanStack Query DevTools package which provides an in-browser debugging interface for inspecting queries, mutations, cache state, and query lifecycle. The DevTools are essential for development and debugging but excluded from production builds.

### Dependencies
- Task 45: Install TanStack Query

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in frontend project root
   - Verify TanStack Query is already installed
   - Confirm package.json exists

2. **Install DevTools package**
   - Use npm, yarn, or pnpm to install
   - Install version matching TanStack Query (5.x)
   - Verify installation in package.json

3. **Verify installation**
   - Check that @tanstack/react-query-devtools appears
   - Confirm version matches core package version
   - Run build to ensure no conflicts

4. **Understand DevTools scope**
   - DevTools only active in development mode
   - Automatically tree-shaken in production builds
   - No manual conditional imports needed

### Package Details

| Package | Version | Purpose |
|---------|---------|---------|
| @tanstack/react-query-devtools | ^5.0.0 | Development debugging tools |
| @tanstack/react-query | ^5.0.0 | Required peer dependency |

### DevTools Features

The DevTools package provides comprehensive debugging capabilities:

- **Query Inspector:** View all active queries and their state
- **Mutation Inspector:** Monitor mutations in real-time
- **Cache Explorer:** Browse entire query cache
- **Query Timeline:** Visualize query lifecycle events
- **Network Activity:** See fetch/refetch operations
- **Cache Time Tracking:** Monitor stale/fresh status
- **Manual Actions:** Trigger refetch, invalidate, or reset
- **Query Details:** View query data, status, timestamps
- **Offline Indicator:** Visual offline state detection
- **Performance Metrics:** Query timing and optimization insights

### Installation Command Reference

**Using npm:**
```
npm install @tanstack/react-query-devtools
```

**Using yarn:**
```
yarn add @tanstack/react-query-devtools
```

**Using pnpm:**
```
pnpm add @tanstack/react-query-devtools
```

### Development vs Production

| Environment | Behavior |
|-------------|----------|
| Development | DevTools active and visible |
| Production | DevTools code tree-shaken (removed) |
| Test | DevTools available if NODE_ENV=development |

### Expected Outcome
- DevTools package added to dependencies
- Package successfully installed in node_modules
- Ready to import ReactQueryDevtools component
- No build size impact in production

### Verification Checklist
- [ ] @tanstack/react-query-devtools in package.json
- [ ] Version matches core TanStack Query version
- [ ] Package installed in node_modules
- [ ] No installation errors
- [ ] Can import from '@tanstack/react-query-devtools'
- [ ] Frontend build runs successfully

### DevTools Best Practices

**Import Location:**
- Import in root layout or app component
- Place near QueryClientProvider
- Only render in development

**Configuration Options:**
- Position (top/bottom, left/right)
- Initial open/closed state
- Button position
- Panel props

**Performance Considerations:**
- DevTools add minimal overhead
- Only active when panel is open
- Automatically optimized for production
- No manual conditional logic needed

---

## Task 47: Create QueryClient Configuration

### Overview
Create a centralized QueryClient configuration file that defines the QueryClient instance with default options. This configuration serves as the single source of truth for all TanStack Query behavior across the application, including cache timing, retry logic, and refetch behavior.

### Dependencies
- Task 45: Install TanStack Query

### Instructions

1. **Create lib directory structure**
   - Navigate to frontend/src or frontend/app
   - Create lib/ directory if not exists
   - This directory houses utility configurations

2. **Create queryClient.ts file**
   - Create new file: lib/queryClient.ts
   - This will contain QueryClient configuration
   - Use TypeScript for type safety

3. **Import QueryClient class**
   - Import QueryClient from @tanstack/react-query
   - Import QueryClientConfig type for typing
   - Import any needed types for default options

4. **Define default query options**
   - Create object for default query configuration
   - Will be populated in subsequent tasks
   - Structure for queries property

5. **Define default mutation options**
   - Create object for default mutation configuration
   - Set basic error handling defaults
   - Structure for mutations property

6. **Create QueryClient instance**
   - Instantiate new QueryClient
   - Pass default options object
   - Export as named export

7. **Export QueryClient instance**
   - Use named export for queryClient
   - Allows single import point across app
   - Ensures single QueryClient instance

8. **Add configuration documentation**
   - Document purpose of each default option
   - Explain timing values and their impact
   - Note modification guidelines

### File Structure

```
frontend/
├── lib/
│   └── queryClient.ts    # QueryClient configuration
└── providers/            # To be created in Task 52
    └── QueryProvider.tsx
```

### QueryClient Architecture

```
┌─────────────────────────────────────┐
│       QueryClient Instance          │
├─────────────────────────────────────┤
│  Default Query Options              │
│  ├── Stale Time (Task 48)          │
│  ├── Cache Time/GC Time (Task 49)  │
│  ├── Retry Config (Task 50)        │
│  └── Refetch Behavior (Task 51)    │
├─────────────────────────────────────┤
│  Default Mutation Options           │
│  └── Error Handling                 │
└─────────────────────────────────────┘
```

### Configuration Options Overview

| Option Category | Purpose |
|----------------|---------|
| Stale Time | When data considered outdated |
| Cache Time (GC Time) | How long cache retained |
| Retry | Failed request retry logic |
| Refetch | Background update triggers |
| Network Mode | Online/offline behavior |

### Default Options Structure

The defaultOptions object contains two main sections:

**queries:** Configuration applied to all useQuery hooks
- staleTime: When data becomes stale
- gcTime (formerly cacheTime): Cache garbage collection
- retry: Retry failed requests
- retryDelay: Delay between retries
- refetchOnWindowFocus: Refetch when window focused
- refetchOnReconnect: Refetch when reconnected
- refetchOnMount: Refetch on component mount

**mutations:** Configuration applied to all useMutation hooks
- retry: Retry failed mutations
- retryDelay: Delay between mutation retries
- networkMode: Online/offline behavior

### QueryClient Methods

| Method | Purpose |
|--------|---------|
| getQueryData | Get cached data for query |
| setQueryData | Manually update cache |
| invalidateQueries | Mark queries as stale |
| refetchQueries | Refetch queries immediately |
| cancelQueries | Cancel in-flight queries |
| removeQueries | Remove queries from cache |
| clear | Clear entire cache |

### Expected Outcome
- lib/queryClient.ts file created
- QueryClient instance exported
- Default options object structure defined
- Ready for option configuration in Tasks 48-51
- Single source of truth for query configuration

### Verification Checklist
- [ ] lib/ directory exists
- [ ] queryClient.ts file created
- [ ] QueryClient imported from @tanstack/react-query
- [ ] Default options object structure defined
- [ ] QueryClient instance created
- [ ] Instance exported as named export
- [ ] File includes documentation comments
- [ ] TypeScript types properly applied

### Configuration Best Practices

**Single Instance:**
- Create one QueryClient instance
- Export and reuse across application
- Don't create multiple instances

**Default Options:**
- Set sensible defaults for all queries
- Override in specific queries if needed
- Document reasons for custom values

**Type Safety:**
- Use TypeScript for configuration
- Import proper types from library
- Define custom types for query keys

**Organization:**
- Keep configuration in dedicated file
- Separate from provider components
- Co-locate with query utilities

---

## Task 48: Set Default Stale Time

### Overview
Configure the default staleTime option in the QueryClient, which determines how long query data is considered fresh before it becomes stale. Setting this to 5 minutes (300,000ms) prevents unnecessary refetches while ensuring data freshness for typical ERP use cases.

### Dependencies
- Task 47: Create QueryClient Configuration

### Instructions

1. **Open queryClient.ts file**
   - Navigate to lib/queryClient.ts
   - Locate defaultOptions object
   - Find queries property

2. **Add staleTime property**
   - Add staleTime to queries.defaultOptions
   - Set value to 5 minutes in milliseconds
   - Use calculation for clarity: 5 * 60 * 1000

3. **Add documentation comment**
   - Explain what staleTime means
   - Document the 5-minute value rationale
   - Note impact on refetch behavior

4. **Understand stale vs fresh data**
   - Fresh data: Within staleTime, no refetch
   - Stale data: Beyond staleTime, refetch on trigger
   - Does not mean data is deleted

5. **Consider use case implications**
   - ERP data changes relatively slowly
   - 5 minutes balances freshness and performance
   - Can override per query if needed

### Stale Time Concept

```
┌────────────────────────────────────────────────┐
│              Query Lifecycle                   │
├────────────────────────────────────────────────┤
│  Fetch ──> Fresh (5 min) ──> Stale ──> GC     │
│             │                   │               │
│             └─ No Refetch      └─ Refetch     │
│                                  on Trigger    │
└────────────────────────────────────────────────┘
```

### Stale Time Values Comparison

| Value | Duration | Use Case |
|-------|----------|----------|
| 0 | Instant | Always refetch (default) |
| 30000 | 30 sec | Real-time data |
| 60000 | 1 min | Frequently changing |
| 300000 | 5 min | ERP modules (chosen) |
| 600000 | 10 min | Static reference data |
| Infinity | Never | Immutable data |

### Stale Time Behavior

**When Data is Fresh (< 5 min):**
- Returned from cache immediately
- No network request made
- Component renders with cached data
- Background refetch NOT triggered

**When Data is Stale (> 5 min):**
- Returned from cache immediately
- Background refetch triggered
- Component updates when refetch completes
- User sees old data then new data

**Stale Time Zero (Default):**
- Data always considered stale
- Refetch on every mount, focus, reconnect
- Useful for real-time data
- Higher network usage

### Refetch Triggers for Stale Data

| Trigger | Description |
|---------|-------------|
| Mount | Component mounts |
| Window Focus | User returns to tab |
| Reconnect | Network reconnects |
| Interval | Time-based polling |
| Manual | Explicit refetch call |

### Why 5 Minutes for ERP?

**Considerations:**
- ERP data doesn't change frequently
- Users work on tasks for several minutes
- Balance between freshness and performance
- Reduces unnecessary API calls
- Still responsive to user navigation

**Module-Specific Behavior:**
- Product catalog: Can be stale longer
- Inventory levels: Needs shorter staleTime
- Customer data: 5 minutes appropriate
- Order status: May need override to shorter

### Overriding Stale Time

Individual queries can override the default:

**At Hook Level:**
- Pass staleTime option to useQuery
- Overrides global default
- Useful for specific requirements

**Examples of Overrides:**
- Inventory count: staleTime: 60000 (1 min)
- Product list: staleTime: 600000 (10 min)
- Dashboard stats: staleTime: 30000 (30 sec)

### Expected Outcome
- staleTime set to 5 minutes (300000ms)
- Applied to all queries by default
- Data considered fresh for 5 minutes
- Reduces unnecessary refetches
- Can be overridden per query

### Verification Checklist
- [ ] queryClient.ts file updated
- [ ] staleTime added to queries defaultOptions
- [ ] Value set to 300000 (5 * 60 * 1000)
- [ ] Documentation comment added
- [ ] Value calculation clear and readable
- [ ] Consistent with ERP requirements

### Stale Time Best Practices

**Default Value:**
- Choose based on data change frequency
- Balance freshness vs performance
- Consider user workflows
- Document reasoning

**Per-Query Overrides:**
- Override for critical data
- Shorter for real-time needs
- Longer for static data
- Document why overridden

**Testing Implications:**
- Mock data stays fresh during tests
- May need to advance time in tests
- Consider staleTime in test setup
- Use waitFor for updates

---

## Task 49: Set Default Cache Time

### Overview
Configure the default gcTime (garbage collection time, formerly cacheTime) option in the QueryClient, which determines how long inactive query data remains in the cache before being garbage collected. Setting this to 10 minutes (600,000ms) ensures data persists for reasonable navigation patterns while preventing unlimited cache growth.

### Dependencies
- Task 47: Create QueryClient Configuration

### Instructions

1. **Open queryClient.ts file**
   - Navigate to lib/queryClient.ts
   - Locate defaultOptions.queries object
   - Prepare to add gcTime property

2. **Add gcTime property**
   - Add gcTime to queries.defaultOptions
   - Set value to 10 minutes in milliseconds
   - Use calculation: 10 * 60 * 1000

3. **Add documentation comment**
   - Explain gcTime (garbage collection time)
   - Note it was called cacheTime in v4
   - Document 10-minute retention rationale

4. **Understand active vs inactive queries**
   - Active: Has mounted observers (components using it)
   - Inactive: No observers, but cached
   - GC timer starts when query becomes inactive

5. **Consider memory management**
   - Longer gcTime = more memory usage
   - Shorter gcTime = more refetches
   - 10 minutes balances both concerns

### Cache Time (GC Time) Concept

```
┌──────────────────────────────────────────────────┐
│            Query Cache Lifecycle                 │
├──────────────────────────────────────────────────┤
│  Active ──> Inactive ──> GC Timer ──> Deleted   │
│   (Used)     (Cached)     (10 min)               │
│                │              │                   │
│                └─ Instant    └─ Memory           │
│                   Return       Freed              │
└──────────────────────────────────────────────────┘
```

### Active vs Inactive Queries

| State | Description | Behavior |
|-------|-------------|----------|
| Active | Component mounted using query | No GC timer |
| Inactive | No components using query | GC timer starts |
| Deleted | GC timer expired | Removed from cache |

### GC Time Values Comparison

| Value | Duration | Use Case |
|-------|----------|----------|
| 0 | Instant | Delete immediately |
| 60000 | 1 min | Memory constrained |
| 300000 | 5 min | Minimal caching |
| 600000 | 10 min | ERP modules (chosen) |
| 900000 | 15 min | Heavy navigation |
| Infinity | Never | Permanent cache |

### Why 10 Minutes GC Time?

**Navigation Patterns:**
- Users navigate between pages frequently
- Typical task completion: 5-10 minutes
- Back navigation benefits from cache
- Forward navigation reuses cache

**Memory Considerations:**
- ERP data can be large (product lists, orders)
- 10 minutes prevents unlimited growth
- Reasonable memory footprint
- Automatic cleanup of old data

**User Experience:**
- Instant load on back navigation
- Smooth tab switching
- No loading states for recent data
- Feels responsive and fast

### Relationship with Stale Time

```
Timeline: 0 ──────── 5 min ────────── 10 min ──────>
          │           │                 │
          Fetch       Stale            Deleted
          │           │                 │
          └─ Fresh    └─ Background     └─ Refetch
             Data        Refetch           Required
```

**Both Together:**
- 0-5 min: Fresh, returned from cache
- 5-10 min: Stale, background refetch, return cached
- 10+ min: Deleted, full refetch required

### Cache Benefits

**Performance:**
- Instant component rendering
- No loading states
- Reduced API calls
- Lower server load

**User Experience:**
- Fast page transitions
- Seamless navigation
- No flicker or jumps
- Offline capability

### Memory Management

**Cache Growth:**
- More queries = more memory
- Larger data = more memory
- GC time controls growth
- Automatic cleanup

**Memory Monitoring:**
- Use DevTools to inspect cache
- Monitor query count
- Check cache size
- Adjust gcTime if needed

### Overriding GC Time

**Per-Query Override:**
Individual queries can override default gcTime

**Use Cases for Overrides:**
- Small data, long gcTime: Product categories
- Large data, short gcTime: Order history lists
- Critical data, Infinity: User profile
- Temporary data, 0: One-time fetches

### Expected Outcome
- gcTime set to 10 minutes (600000ms)
- Inactive query data cached for 10 minutes
- Automatic garbage collection after timeout
- Balances performance and memory usage
- Can be overridden per query

### Verification Checklist
- [ ] queryClient.ts file updated
- [ ] gcTime added to queries defaultOptions
- [ ] Value set to 600000 (10 * 60 * 1000)
- [ ] Documentation comment added
- [ ] Explains previous name (cacheTime)
- [ ] Value calculation clear
- [ ] Consistent with staleTime (10 > 5 min)

### GC Time Best Practices

**Default Selection:**
- Longer than staleTime
- Based on navigation patterns
- Consider data size
- Monitor memory usage

**Per-Query Tuning:**
- Large lists: shorter gcTime
- Small data: longer gcTime
- Critical data: very long or Infinity
- Temp data: very short

**Testing:**
- Mock data persists in tests
- May need to clear cache between tests
- Use queryClient.clear() in test cleanup
- Consider gcTime in async tests

---

## Task 50: Set Default Retry Config

### Overview
Configure the default retry behavior in the QueryClient, including the number of retry attempts and the delay strategy for failed requests. Setting retry to 3 attempts with an exponential backoff delay ensures resilient error handling while preventing excessive failed requests.

### Dependencies
- Task 47: Create QueryClient Configuration

### Instructions

1. **Open queryClient.ts file**
   - Navigate to lib/queryClient.ts
   - Locate defaultOptions.queries object
   - Prepare to add retry configuration

2. **Add retry property**
   - Add retry to queries.defaultOptions
   - Set value to 3 attempts
   - Means 1 initial + 3 retries = 4 total attempts

3. **Add retryDelay property**
   - Add retryDelay to queries.defaultOptions
   - Use built-in exponential backoff
   - Import or define retry delay function

4. **Add documentation comments**
   - Explain retry count rationale
   - Document exponential backoff strategy
   - Note when retries occur (network errors, 5xx)

5. **Understand retry behavior**
   - Only retries on retryable errors
   - Network errors: Always retry
   - 4xx errors: No retry (client errors)
   - 5xx errors: Retry (server errors)

6. **Configure retry delay**
   - Exponential backoff: 1s, 2s, 4s
   - Prevents server overload
   - Gives server time to recover

### Retry Mechanism

```
┌─────────────────────────────────────────────┐
│           Retry Flow                        │
├─────────────────────────────────────────────┤
│  Request ──> Error ──> Wait ──> Retry       │
│                │                  │          │
│                │                  └─ 3x     │
│                │                             │
│                └─> All Failed ──> Error     │
└─────────────────────────────────────────────┘
```

### Retry Attempt Timeline

| Attempt | Delay Before | Cumulative Wait |
|---------|--------------|-----------------|
| 1 (Initial) | 0ms | 0ms |
| 2 (Retry 1) | 1000ms | 1000ms |
| 3 (Retry 2) | 2000ms | 3000ms |
| 4 (Retry 3) | 4000ms | 7000ms |
| Failed | - | Total: 7s |

### Exponential Backoff Strategy

**Formula:** delay = baseDelay * (2 ^ attemptIndex)

**Attempt 1:** 1000ms * (2^0) = 1000ms
**Attempt 2:** 1000ms * (2^1) = 2000ms
**Attempt 3:** 1000ms * (2^2) = 4000ms

**Benefits:**
- Gives server time to recover
- Prevents request storms
- Reduces load during incidents
- Standard industry practice

### Retryable vs Non-Retryable Errors

| Error Type | Retry? | Reason |
|------------|--------|--------|
| Network Error | Yes | Temporary connectivity issue |
| Timeout | Yes | May succeed on retry |
| 500 Server Error | Yes | Temporary server issue |
| 502 Bad Gateway | Yes | Upstream server issue |
| 503 Service Unavailable | Yes | Server overloaded |
| 400 Bad Request | No | Client error, won't change |
| 401 Unauthorized | No | Need to re-authenticate |
| 403 Forbidden | No | Permission issue |
| 404 Not Found | No | Resource doesn't exist |

### Why 3 Retries?

**Industry Standard:**
- Common default in many libraries
- Balances resilience and timeout
- Total wait time reasonable (7s)

**ERP Context:**
- Network hiccups happen
- Server may be temporarily busy
- 3 retries handle most transient errors
- 4 total attempts sufficient

**User Experience:**
- Brief delays not noticeable
- Success on retry feels instant
- Failure after 7s acceptable
- Error handling can take over

### Retry Configuration Options

| Option | Type | Purpose |
|--------|------|---------|
| retry | number | Number of retry attempts |
| retry | boolean | false disables retry |
| retry | function | Custom retry logic |
| retryDelay | number | Fixed delay in ms |
| retryDelay | function | Custom delay logic |

### Custom Retry Logic

**Conditional Retry:**
Can pass function to retry option for custom logic:

**Use Cases:**
- Retry only specific error codes
- Different retry counts per error type
- Skip retry for known permanent errors
- Implement custom backoff strategies

**Custom Retry Delay:**
Can pass function to retryDelay for custom delay:

**Use Cases:**
- Add jitter to prevent thundering herd
- Cap maximum delay
- Different delays per error type
- Integrate with rate limiting

### Overriding Retry Config

**Per-Query Override:**
Individual queries can override retry settings

**Examples:**
- Critical data: retry: 5 (more attempts)
- Non-critical: retry: 1 (fail fast)
- Mutations: retry: 0 (no retry, user action)
- Idempotent: retry: 3 (safe to retry)

### Expected Outcome
- retry set to 3 attempts
- retryDelay configured with exponential backoff
- Failed requests automatically retried
- Total attempt: 4 (initial + 3 retries)
- 7 seconds total wait time before final failure
- Resilient error handling

### Verification Checklist
- [ ] queryClient.ts file updated
- [ ] retry added to queries defaultOptions
- [ ] Value set to 3
- [ ] retryDelay configured for exponential backoff
- [ ] Documentation comments added
- [ ] Explains retry count and timing
- [ ] Notes which errors are retried

### Retry Best Practices

**Default Retry Count:**
- 3 retries common standard
- Balance resilience vs timeout
- Consider total wait time
- Document reasoning

**Exponential Backoff:**
- Always use for retry delay
- Prevents server overload
- Standard practice
- Add jitter for high scale

**Mutation Retries:**
- Generally don't retry mutations
- Risk of duplicate actions
- User should explicitly retry
- Unless idempotent

**Error Handling:**
- Retry is last resort
- Proper error handling still needed
- Show user-friendly messages
- Log all retry attempts

**Testing:**
- Mock retry behavior in tests
- Test retry exhaustion
- Verify exponential backoff
- Check error state after retries

---

## Task 51: Configure Refetch on Window Focus

### Overview
Configure the default refetchOnWindowFocus behavior in the QueryClient, which determines whether queries automatically refetch when the user returns to the browser tab or window. Enabling this ensures data freshness when users return to the application after working elsewhere.

### Dependencies
- Task 47: Create QueryClient Configuration

### Instructions

1. **Open queryClient.ts file**
   - Navigate to lib/queryClient.ts
   - Locate defaultOptions.queries object
   - Prepare to add refetch configuration

2. **Add refetchOnWindowFocus property**
   - Add to queries.defaultOptions
   - Set value to true (enable)
   - This is the default, but explicit is better

3. **Add documentation comment**
   - Explain when this triggers
   - Note only refetches stale queries
   - Document user benefit

4. **Understand window focus behavior**
   - Triggers when user returns to tab
   - Triggers when window regains focus
   - Only refetches if data is stale

5. **Consider related refetch options**
   - refetchOnReconnect: network reconnect
   - refetchOnMount: component mount
   - refetchInterval: time-based polling

6. **Add other refetch options**
   - refetchOnReconnect: true (good default)
   - refetchOnMount: true (default behavior)
   - Document each option

### Window Focus Refetch Behavior

```
┌──────────────────────────────────────────────┐
│        Window Focus Flow                     │
├──────────────────────────────────────────────┤
│  User Leaves Tab                             │
│       │                                       │
│       └──> Works Elsewhere (5+ min)         │
│             │                                 │
│             └──> Returns to Tab              │
│                   │                           │
│                   └──> Data Stale?           │
│                         │                     │
│                         ├──> Yes: Refetch    │
│                         └──> No: Use Cache   │
└──────────────────────────────────────────────┘
```

### Refetch Options Comparison

| Option | Trigger | Default | Recommended |
|--------|---------|---------|-------------|
| refetchOnWindowFocus | Tab/window focused | true | true |
| refetchOnReconnect | Network reconnects | true | true |
| refetchOnMount | Component mounts | true | true |
| refetchInterval | Time interval | false | false |
| refetchIntervalInBackground | Interval when hidden | false | false |

### Window Focus Use Cases

**Scenario 1: Multi-Tab Workflow**
- User opens multiple tabs
- Data changes in another tab
- Switching tabs shows fresh data

**Scenario 2: Leaving Application**
- User checks email or other apps
- Data may change on server
- Returning refreshes data

**Scenario 3: System Sleep/Wake**
- Computer goes to sleep
- Hours pass with potential changes
- Waking up triggers refresh

### Stale Time Interaction

Window focus refetch respects staleTime:

```
┌────────────────────────────────────────┐
│  Focus Event                           │
│      │                                  │
│      └──> Check Stale Time             │
│            │                            │
│            ├──> Fresh: No Refetch      │
│            │    (within 5 min)          │
│            │                            │
│            └──> Stale: Refetch         │
│                 (beyond 5 min)          │
└────────────────────────────────────────┘
```

**Example Timeline:**
- User views product list at 10:00
- Leaves tab at 10:01
- Returns at 10:03 (2 min later)
- Data still fresh, no refetch

- Returns at 10:07 (6 min later)
- Data stale, background refetch

### Why Enable Window Focus Refetch?

**Data Freshness:**
- Ensures current data on return
- Prevents working with outdated info
- Improves data accuracy

**User Experience:**
- Seamless data updates
- No manual refresh needed
- Data "just works"

**ERP Context:**
- Orders may be added by others
- Inventory levels change
- Customer data updated
- Dashboard needs current stats

### Disabling Window Focus Refetch

**When to Disable:**
- Form inputs that shouldn't refresh
- In-progress edits
- Draft states
- Heavy queries that shouldn't run often

**Per-Query Override:**
Can disable for specific queries

### Refetch on Reconnect

**Purpose:**
Refetch when network connection restored

**Use Case:**
- User loses internet
- Works offline briefly
- Connection restored
- Data syncs automatically

**Configuration:**
Set refetchOnReconnect: true (default)

### Refetch on Mount

**Purpose:**
Refetch when component mounts

**Behavior:**
- Only if data is stale
- Respects staleTime
- Ensures fresh data on page load

**Configuration:**
Set refetchOnMount: true (default)

### Polling / Interval Refetch

**Not Recommended by Default:**
- Continuous background requests
- Unnecessary load
- Battery drain on mobile
- Use only when needed

**When to Use:**
- Real-time dashboards
- Live status monitors
- Auction or bidding systems
- Stock tickers

**Configuration:**
- refetchInterval: milliseconds
- refetchIntervalInBackground: boolean
- Override per query, not default

### Expected Outcome
- refetchOnWindowFocus set to true
- refetchOnReconnect set to true
- refetchOnMount set to true (default)
- Queries refetch on window focus if stale
- Automatic data freshness on user return
- No manual refresh needed

### Verification Checklist
- [ ] queryClient.ts file updated
- [ ] refetchOnWindowFocus set to true
- [ ] refetchOnReconnect set to true
- [ ] refetchOnMount documented (true is default)
- [ ] Documentation comments added
- [ ] Explains trigger conditions
- [ ] Notes staleTime interaction

### Window Focus Best Practices

**Default Setting:**
- Enable refetchOnWindowFocus
- Enable refetchOnReconnect
- Keep refetchOnMount default
- Don't enable refetchInterval by default

**Per-Query Overrides:**
- Disable for forms in progress
- Disable for draft states
- Enable interval for real-time needs
- Document why overridden

**User Experience:**
- Background refetch is seamless
- No loading states shown
- Old data displayed immediately
- Updates when refetch completes

**Testing:**
- Mock window focus events
- Test with stale vs fresh data
- Verify refetch triggered
- Check network request made

**Performance:**
- Focus refetch is efficient
- Only runs for active queries
- Respects staleTime
- Minimal overhead

---

## Task 52: Create QueryClientProvider

### Overview
Create a QueryClientProvider component that wraps the application and provides the QueryClient instance to all child components. This provider makes TanStack Query functionality available throughout the component tree and serves as the integration point for the QueryClient configuration.

### Dependencies
- Task 47: Create QueryClient Configuration
- Frontend layout structure exists

### Instructions

1. **Create providers directory**
   - Navigate to frontend/src or frontend/app
   - Create providers/ directory if not exists
   - This houses provider wrapper components

2. **Create QueryProvider.tsx file**
   - Create new file: providers/QueryProvider.tsx
   - This will wrap QueryClientProvider
   - Use TypeScript and 'use client' directive

3. **Import dependencies**
   - Import QueryClientProvider from @tanstack/react-query
   - Import queryClient from lib/queryClient
   - Import React types for children

4. **Define component props interface**
   - Create props interface with children
   - Use React.ReactNode type
   - Add JSDoc documentation

5. **Create QueryProvider component**
   - Export named function component
   - Accept children prop
   - Return QueryClientProvider with client and children

6. **Add 'use client' directive**
   - Add at top of file for Next.js
   - Required for client-side functionality
   - Ensures proper hydration

7. **Document component purpose**
   - Add file header comment
   - Explain QueryClient integration
   - Note usage in layout

### File Structure

```
frontend/
├── lib/
│   └── queryClient.ts          # QueryClient config (Task 47)
├── providers/
│   └── QueryProvider.tsx       # New provider wrapper
└── app/
    └── layout.tsx              # Will use QueryProvider
```

### QueryProvider Architecture

```
┌────────────────────────────────────────┐
│         Root Layout                    │
│  ┌──────────────────────────────────┐ │
│  │     QueryProvider                │ │
│  │  ┌────────────────────────────┐  │ │
│  │  │  QueryClientProvider       │  │ │
│  │  │  ├── queryClient instance  │  │ │
│  │  │  └── children              │  │ │
│  │  │       └── App Components   │  │ │
│  │  └────────────────────────────┘  │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### Provider Wrapper Purpose

**Why Custom Wrapper:**
- Abstraction layer over QueryClientProvider
- Centralizes provider configuration
- Easier to add additional setup later
- Cleaner integration point

**Future Enhancements:**
- Add error boundaries
- Add loading states
- Add persistence layer
- Integrate with other providers

### Next.js 'use client' Directive

**Purpose:**
- Marks component as Client Component
- Required for hooks and event handlers
- TanStack Query needs client-side execution
- Separate from server components

**Placement:**
- First line of file (before imports)
- Only in files that need it
- Child components inherit directive
- Don't overuse

### Provider Component Pattern

**Structure:**
- Simple wrapper component
- Passes props through
- Minimal logic
- Pure composition

**Props:**
- children: React.ReactNode
- No other props needed initially
- Can add more later if needed

### Integration with Layout

**Next.js App Router:**
Will be added to root layout in app/layout.tsx

**Layout Structure:**
```
RootLayout
└── QueryProvider
    └── {children}
        └── Page Components
```

**Provider Order:**
If multiple providers:
1. QueryProvider (outer)
2. Auth Provider
3. Theme Provider
4. Other app providers
5. Children (inner)

### Expected Outcome
- providers/QueryProvider.tsx file created
- Component exports QueryClientProvider wrapper
- 'use client' directive at top
- Accepts children prop
- Passes queryClient instance
- Ready to wrap app in layout
- TypeScript types properly defined

### Verification Checklist
- [ ] providers/ directory exists
- [ ] QueryProvider.tsx file created
- [ ] 'use client' directive at top of file
- [ ] QueryClientProvider imported
- [ ] queryClient imported from lib
- [ ] Props interface defined with children
- [ ] Component exports QueryProvider
- [ ] Children passed through correctly
- [ ] TypeScript types correct
- [ ] Documentation comments added

### Provider Best Practices

**File Organization:**
- Separate providers directory
- One provider per file
- Named exports preferred
- Co-locate related types

**Component Structure:**
- Keep providers simple
- Single responsibility
- Pass through props
- Document purpose

**Error Handling:**
- Provider handles errors internally
- Queries handle their own errors
- Can add error boundary wrapper
- Log provider errors

**Testing:**
- Wrap test components in provider
- Can create test QueryClient
- Mock query responses
- Test error states

**Performance:**
- Provider has no re-render issues
- Single QueryClient instance
- Children memo'd if needed
- No prop drilling

---

## Task 53: Add ReactQueryDevtools

### Overview
Integrate the ReactQueryDevtools component into the QueryProvider to enable in-browser debugging and inspection of TanStack Query state. The DevTools provide a visual interface for monitoring queries, mutations, cache state, and network activity during development.

### Dependencies
- Task 46: Install DevTools
- Task 52: Create QueryClientProvider

### Instructions

1. **Open QueryProvider.tsx file**
   - Navigate to providers/QueryProvider.tsx
   - Prepare to add DevTools import and component

2. **Import ReactQueryDevtools**
   - Import from @tanstack/react-query-devtools
   - Named import: ReactQueryDevtools
   - Add after QueryClientProvider import

3. **Add DevTools component**
   - Place inside QueryClientProvider, after children
   - Add as sibling to children
   - Configure with props

4. **Configure DevTools props**
   - initialIsOpen: false (start collapsed)
   - position: 'bottom-right' (default position)
   - Add buttonPosition if needed

5. **Add conditional rendering**
   - DevTools automatically hidden in production
   - No manual conditional needed
   - Tree-shaken in production builds

6. **Update documentation comments**
   - Note DevTools included
   - Explain development-only behavior
   - Document how to access

### QueryProvider with DevTools Structure

```
┌────────────────────────────────────────┐
│      QueryClientProvider               │
│  ┌──────────────────────────────────┐  │
│  │  {children}                      │  │
│  │  (App Components)                │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  ReactQueryDevtools              │  │
│  │  (Bottom-right overlay)          │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### DevTools Configuration Options

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| initialIsOpen | boolean | false | Start open/closed |
| position | string | 'bottom-right' | DevTools panel position |
| buttonPosition | string | 'bottom-right' | Toggle button position |
| panelPosition | string | - | Deprecated, use position |
| context | QueryClient | undefined | Specific client instance |

### DevTools Position Options

| Position | Description |
|----------|-------------|
| 'top-left' | Top-left corner |
| 'top-right' | Top-right corner |
| 'bottom-left' | Bottom-left corner |
| 'bottom-right' | Bottom-right corner (default) |

### DevTools Features

**Query Inspector:**
- View all active and inactive queries
- See query keys and state
- Check fetch status
- Monitor data and error
- View last updated timestamp
- Inspect observers count

**Actions:**
- Refetch query manually
- Invalidate query
- Reset query
- Remove query
- Trigger garbage collection

**Cache Explorer:**
- Browse entire query cache
- Hierarchical query key view
- Filter queries by state
- Search queries
- View cache size

**Network Activity:**
- Real-time fetch operations
- Request timing
- Success/error indication
- Retry attempts shown

**Mutations:**
- View active mutations
- See mutation state
- Check variables and data
- Monitor mutation status

### Development Workflow with DevTools

**Opening DevTools:**
- Click floating button (default bottom-right)
- Panel slides up from bottom
- Queries listed in sidebar
- Details shown in main panel

**Inspecting Queries:**
1. Click query in sidebar
2. View query details
3. Check data payload
4. See fetch status
5. Review timestamps

**Manual Actions:**
1. Select query
2. Click action button (refetch, invalidate, etc.)
3. Watch query update
4. Verify behavior

**Debugging Issues:**
1. Find failing query
2. Check error details
3. Review query key
4. Test manual refetch
5. Verify data structure

### DevTools in Production

**Automatic Exclusion:**
- Tree-shaken in production builds
- Not included in bundle
- Zero runtime cost
- No conditional logic needed

**Bundle Impact:**
- Development: ~50KB added
- Production: 0KB added
- No performance impact
- No manual imports needed

### DevTools Best Practices

**Configuration:**
- Start with initialIsOpen: false
- Use default bottom-right position
- Don't override unless necessary
- Keep configuration simple

**Development Usage:**
- Open DevTools early in development
- Monitor query behavior
- Check cache state regularly
- Use for debugging issues

**Performance:**
- DevTools add minimal overhead
- Only active when panel open
- Close when not needed
- No impact on production

**Team Collaboration:**
- Share DevTools screenshots for issues
- Document unexpected behavior
- Use for code review
- Demo query patterns

### Expected Outcome
- ReactQueryDevtools added to QueryProvider
- Component placed inside QueryClientProvider
- Configured with initialIsOpen: false
- Position set to bottom-right
- Available in development mode only
- Accessible via floating button
- Provides query inspection capabilities

### Verification Checklist
- [ ] QueryProvider.tsx file updated
- [ ] ReactQueryDevtools imported
- [ ] Component added inside QueryClientProvider
- [ ] Placed after children
- [ ] initialIsOpen set to false
- [ ] position configured (optional)
- [ ] Documentation comments updated
- [ ] Development server shows DevTools button
- [ ] Clicking button opens panel
- [ ] Can inspect queries in DevTools

### DevTools Troubleshooting

| Issue | Solution |
|-------|----------|
| DevTools not visible | Check development mode |
| Button not showing | Verify import and placement |
| Panel not opening | Check for CSS conflicts |
| Queries not listed | Ensure QueryClient wrapped |
| Performance slow | Close DevTools panel |
| Production error | Tree-shaking failed, check build |

### Integration with Layout

**Next Step:**
After completing this task, the QueryProvider with DevTools is ready to be added to the root layout (app/layout.tsx):

**Layout Integration:**
1. Import QueryProvider
2. Wrap children in QueryProvider
3. QueryClient available to all components
4. DevTools accessible throughout app

---

## Summary and Verification

### Completed Configuration

After completing Tasks 45-53, the TanStack Query infrastructure is fully configured:

**Packages Installed:**
- @tanstack/react-query (core library)
- @tanstack/react-query-devtools (debugging tools)

**QueryClient Configured:**
- staleTime: 5 minutes (300000ms)
- gcTime: 10 minutes (600000ms)
- retry: 3 attempts with exponential backoff
- refetchOnWindowFocus: true
- refetchOnReconnect: true
- refetchOnMount: true (default)

**Provider Setup:**
- QueryClient instance created
- QueryProvider component created
- ReactQueryDevtools integrated
- Ready for layout integration

### Configuration Summary Table

| Setting | Value | Impact |
|---------|-------|--------|
| Stale Time | 5 min | Data fresh for 5 minutes |
| GC Time | 10 min | Cache retained 10 minutes |
| Retry Count | 3 | Up to 4 total attempts |
| Retry Delay | Exponential | 1s, 2s, 4s delays |
| Window Focus | Enabled | Refetch on return |
| Reconnect | Enabled | Refetch on reconnect |
| DevTools | Enabled | Dev mode only |

### File Structure Created

```
frontend/
├── lib/
│   └── queryClient.ts              # QueryClient configuration
└── providers/
    └── QueryProvider.tsx           # Provider with DevTools
```

### Next Steps

**Immediate:**
- Proceed to Task 54: Create Query Key Factory
- Document 02 will cover query key organization

**Integration:**
- Add QueryProvider to app/layout.tsx
- Wrap application children
- Verify DevTools accessible

**Usage:**
- Create query hooks in Group E
- Define mutations in Group F
- Implement module-specific queries

### Verification Commands

**Check Packages:**
```
npm list @tanstack/react-query
npm list @tanstack/react-query-devtools
```

**Verify Configuration:**
- Open lib/queryClient.ts
- Check all default options set
- Verify calculations correct

**Test Provider:**
- Start development server
- Check for console errors
- Look for DevTools button
- Open DevTools panel

### Configuration Best Practices Applied

✓ Single QueryClient instance
✓ Centralized configuration
✓ Sensible default options
✓ Type-safe with TypeScript
✓ Documented configuration values
✓ Development tools integrated
✓ Production-ready setup
✓ Follows React Query best practices

### Common Configuration Patterns

**Real-Time Data:**
- staleTime: 30000 (30 sec)
- refetchInterval: 60000 (1 min)

**Static Reference Data:**
- staleTime: 600000 (10 min)
- gcTime: Infinity

**Form Draft Data:**
- staleTime: Infinity
- refetchOnWindowFocus: false

**Critical Operations:**
- retry: 5
- retryDelay: exponentialBackoff

---

## Conclusion

The TanStack Query installation and configuration is complete. The QueryClient is configured with ERP-appropriate defaults that balance data freshness, performance, and resilience. The QueryProvider with integrated DevTools is ready to wrap the application, making server state management available throughout the component tree.

The next document covers the creation of a centralized query key factory that provides consistent, type-safe query keys for all ERP modules, enabling efficient cache management and query invalidation.
