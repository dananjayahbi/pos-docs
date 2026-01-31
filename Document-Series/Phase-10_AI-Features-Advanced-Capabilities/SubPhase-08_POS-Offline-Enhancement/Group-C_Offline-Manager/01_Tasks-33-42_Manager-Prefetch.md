# Tasks 33-42: Offline Manager and Data Prefetch

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** C - Offline Manager  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-B_Service-Worker/02_Tasks-27-32_Versioning-Sync.md](../Group-B_Service-Worker/02_Tasks-27-32_Versioning-Sync.md)
- **→ Next Document:** [02_Tasks-43-50_Sale-Receipt-Shift.md](02_Tasks-43-50_Sale-Receipt-Shift.md)

---

## Document Overview

This document covers the creation of the offline manager system and data prefetching capabilities for POS operations. It establishes the core infrastructure for detecting and managing online/offline states, implementing data prefetch mechanisms for products, customers, and inventory, and providing progress tracking during prefetch operations. The offline manager enables the POS system to function seamlessly even without internet connectivity by maintaining synchronized local data.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create OfflineManager Class | Medium | 45 min |
| 34 | Create Online Detection | Low | 20 min |
| 35 | Create Offline Event | Low | 15 min |
| 36 | Create Online Event | Low | 15 min |
| 37 | Create Mode Toggle | Low | 20 min |
| 38 | Create Data Prefetch | High | 90 min |
| 39 | Create Product Prefetch | Medium | 40 min |
| 40 | Create Customer Prefetch | Medium | 35 min |
| 41 | Create Inventory Prefetch | Medium | 35 min |
| 42 | Create Prefetch Progress | Low | 25 min |

---

## Task 33: Create OfflineManager Class

### Overview
Create the singleton OfflineManager class that serves as the central orchestrator for all offline operations in the POS system. This class manages network state detection, event dispatching, data prefetching, offline sale processing, and synchronization queue management. The singleton pattern ensures a single source of truth for offline state throughout the application.

### Dependencies
- Task 32 (Service Worker Sync) from Group B must be complete
- IndexedDB setup must be complete
- Service Worker registration must be active

### Instructions

1. **Create the offline manager file structure**
   - Navigate to `frontend/lib/offline/` directory
   - Create new file named `manager.ts`
   - This will contain the main OfflineManager class

2. **Define the OfflineManager class**
   - Implement as a singleton pattern with private constructor
   - Create static `getInstance()` method
   - Store single instance in private static property
   - Prevent direct instantiation

3. **Define class properties**
   - Add `isOnline` boolean property for current network state
   - Add `isForceOffline` boolean for testing/demo mode
   - Add `prefetchInProgress` boolean flag
   - Add `prefetchProgress` object with loaded/total counters
   - Add event listener arrays for custom events

4. **Implement initialization method**
   - Create `initialize()` async method
   - Call from application startup (main.tsx or App.tsx)
   - Setup network detection listeners
   - Initialize IndexedDB connection
   - Load saved state from localStorage
   - Dispatch initial state event

5. **Define core state management**
   - Create `getOnlineStatus()` method returning current state
   - Create `getForceOfflineStatus()` method
   - Combine both states for effective offline status
   - Return true for offline if either condition is true

6. **Implement event emitter pattern**
   - Create `addEventListener(type, callback)` method
   - Create `removeEventListener(type, callback)` method
   - Create private `dispatchEvent(type, data)` method
   - Support custom event types for app-wide notifications

7. **Add cleanup method**
   - Create `cleanup()` method
   - Remove all event listeners
   - Clear timers and intervals
   - Save state to localStorage
   - Close IndexedDB connections

### Singleton Pattern Structure

```
┌──────────────────────────────────────┐
│      OfflineManager                  │
│      (Singleton Instance)            │
├──────────────────────────────────────┤
│ - instance: OfflineManager (static)  │
│ - isOnline: boolean                  │
│ - isForceOffline: boolean            │
│ - prefetchInProgress: boolean        │
│ - prefetchProgress: object           │
├──────────────────────────────────────┤
│ + getInstance(): OfflineManager      │
│ + initialize(): Promise<void>        │
│ + getOnlineStatus(): boolean         │
│ + addEventListener(type, cb): void   │
│ + removeEventListener(type, cb)      │
│ + cleanup(): void                    │
└──────────────────────────────────────┘
```

### Class Usage Pattern

| Scenario | Implementation |
|----------|----------------|
| Get instance | `const manager = OfflineManager.getInstance()` |
| Initialize | `await manager.initialize()` |
| Check status | `const online = manager.getOnlineStatus()` |
| Listen events | `manager.addEventListener('offline', handler)` |

### State Properties

| Property | Type | Purpose |
|----------|------|---------|
| `isOnline` | boolean | True network state from navigator |
| `isForceOffline` | boolean | Manual offline mode for testing |
| `prefetchInProgress` | boolean | Indicates ongoing prefetch |
| `prefetchProgress` | object | Tracks loaded vs total items |

### Expected Outcome
- Singleton OfflineManager class created
- Proper initialization and cleanup methods
- Event emitter pattern implemented
- Core state management in place
- Foundation for all offline features

### Verification Checklist
- [ ] `frontend/lib/offline/manager.ts` file created
- [ ] Singleton pattern implemented correctly
- [ ] getInstance() returns same instance each call
- [ ] Initialize method sets up core functionality
- [ ] Event emitter methods work correctly
- [ ] State properties defined and accessible
- [ ] Cleanup method removes all listeners

---

## Task 34: Create Online Detection

### Overview
Implement network connectivity detection using the browser's Navigator API and network events. This task establishes the foundation for monitoring online/offline state changes in real-time, enabling the POS system to react appropriately when connectivity is gained or lost. The detection combines multiple strategies for accurate and responsive state monitoring.

### Dependencies
- Task 33: Create OfflineManager Class

### Instructions

1. **Implement initial online detection**
   - Read `navigator.onLine` property on initialization
   - Store value in `isOnline` class property
   - This provides initial state before any events fire
   - Note: navigator.onLine can have false positives

2. **Setup window event listeners**
   - Add listener for `online` event on window object
   - Add listener for `offline` event on window object
   - Bind listeners in initialize() method
   - Store listener references for cleanup

3. **Create online state handler**
   - Define `handleOnlineEvent()` private method
   - Update `isOnline` property to true
   - Dispatch custom app:online event
   - Trigger pending sync operations
   - Log state change for debugging

4. **Create offline state handler**
   - Define `handleOfflineEvent()` private method
   - Update `isOnline` property to false
   - Dispatch custom app:offline event
   - Pause background sync attempts
   - Log state change for debugging

5. **Implement optional health check ping**
   - Create `verifyConnection()` async method
   - Attempt fetch to known endpoint (e.g., /api/health)
   - Use short timeout (2-3 seconds)
   - Update state based on actual connectivity
   - Call periodically in background

6. **Add state change debouncing**
   - Implement short delay before state changes
   - Prevents rapid state flipping
   - Wait 500ms before confirming offline
   - Wait 200ms before confirming online
   - Clear timeout on opposite event

7. **Store listener references**
   - Save bound event handlers as class properties
   - Enable proper cleanup on unmount
   - Use arrow functions or bind() for correct context
   - Remove listeners in cleanup() method

### Detection Strategy Flow

```
Application Start
       │
       ▼
Read navigator.onLine
       │
       ▼
Setup Event Listeners
       │
   ┌───┴────┐
   ▼        ▼
Online   Offline
Event    Event
   │        │
   ▼        ▼
Update   Update
State    State
   │        │
   ▼        ▼
Dispatch Dispatch
Custom   Custom
Event    Event
   │        │
   └────┬───┘
        │
        ▼
Optional Health Check
        │
        ▼
Verify Actual Connectivity
```

### Detection Methods

| Method | Reliability | Response Time | Use Case |
|--------|-------------|---------------|----------|
| navigator.onLine | Medium | Immediate | Initial state |
| online event | High | Fast | Network restore |
| offline event | High | Fast | Network loss |
| Health check ping | Very High | Slow | Verification |

### Event Handling

| Browser Event | Handler Method | Action |
|---------------|----------------|--------|
| `window: online` | `handleOnlineEvent()` | Set online, trigger sync |
| `window: offline` | `handleOfflineEvent()` | Set offline, pause sync |

### State Update Logic

```
┌───────────────────────────────────────┐
│ Event: online                         │
│   │                                   │
│   ▼                                   │
│ Wait 200ms                            │
│   │                                   │
│   ▼                                   │
│ Check if still online                 │
│   │                                   │
│   ▼                                   │
│ Update isOnline = true                │
│   │                                   │
│   ▼                                   │
│ Dispatch app:online                   │
│   │                                   │
│   ▼                                   │
│ Trigger sync queue                    │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│ Event: offline                        │
│   │                                   │
│   ▼                                   │
│ Wait 500ms                            │
│   │                                   │
│   ▼                                   │
│ Verify with health check              │
│   │                                   │
│   ▼                                   │
│ Update isOnline = false               │
│   │                                   │
│   ▼                                   │
│ Dispatch app:offline                  │
│   │                                   │
│   ▼                                   │
│ Pause sync attempts                   │
└───────────────────────────────────────┘
```

### Expected Outcome
- Real-time network state detection working
- Online/offline events properly handled
- State changes dispatched to application
- Optional health check implemented
- Debouncing prevents false positives

### Verification Checklist
- [ ] navigator.onLine read on initialization
- [ ] Window online event listener added
- [ ] Window offline event listener added
- [ ] State updates correctly on events
- [ ] Custom events dispatched on state change
- [ ] Optional health check implemented
- [ ] Debouncing delays prevent rapid flipping
- [ ] Listeners properly cleaned up
- [ ] State persists across page refreshes

---

## Task 35: Create Offline Event

### Overview
Implement custom offline event dispatching that notifies the entire application when the POS system transitions to offline mode. This event allows different components to react appropriately, such as showing offline indicators, disabling online-only features, and switching to local data sources. The event provides a centralized notification system for offline state changes.

### Dependencies
- Task 34: Create Online Detection

### Instructions

1. **Define offline event structure**
   - Create event type constant `APP_OFFLINE_EVENT = 'app:offline'`
   - Define event payload interface with timestamp
   - Include reason field (network loss, forced, etc.)
   - Add previous state for comparison

2. **Implement event dispatch method**
   - Create `dispatchOfflineEvent()` private method
   - Call when `isOnline` changes to false
   - Include relevant context in event data
   - Dispatch through event emitter system

3. **Create event payload**
   - Add `timestamp` field with current time
   - Add `reason` field (e.g., 'network_loss', 'forced')
   - Add `wasOnline` field with previous state
   - Add `forceOffline` field indicating manual mode

4. **Integrate with state changes**
   - Call from `handleOfflineEvent()` method
   - Call when `setForceOffline(true)` is invoked
   - Ensure event fires after state is updated
   - Prevent duplicate events for same state

5. **Setup event listeners in components**
   - Listen for `app:offline` event
   - Show offline indicator in UI
   - Disable online-only features
   - Switch to local data mode
   - Display user notification

6. **Add event persistence**
   - Store last offline event in localStorage
   - Include timestamp and reason
   - Restore on page reload if still offline
   - Clear when returning online

7. **Implement logging**
   - Log offline event to console in development
   - Send to analytics in production
   - Include context like time, location, user
   - Track offline session duration

### Event Dispatch Flow

```
Network Loss Detected
       │
       ▼
Update isOnline = false
       │
       ▼
Create Event Payload
       │
   ┌───┴──────────────────┐
   │ timestamp: Date.now()│
   │ reason: 'network_loss'
   │ wasOnline: true      │
   │ forceOffline: false  │
   └───┬──────────────────┘
       │
       ▼
Dispatch app:offline Event
       │
    ┌──┴───┬───────┬────────┐
    ▼      ▼       ▼        ▼
  UI     Features Data   Analytics
Update  Disable  Switch  Track
```

### Event Payload Structure

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | number | Time of event (Date.now()) |
| `reason` | string | Cause of offline state |
| `wasOnline` | boolean | Previous online state |
| `forceOffline` | boolean | Manual offline mode active |

### Reason Values

| Reason | Trigger |
|--------|---------|
| `network_loss` | Browser offline event fired |
| `forced` | Manual offline mode enabled |
| `health_check_fail` | Health check endpoint unreachable |
| `service_worker_error` | SW failed to respond |

### Component Reactions

| Component | Action on app:offline |
|-----------|----------------------|
| Header | Show offline indicator badge |
| Navigation | Hide online-only menu items |
| Product List | Switch to IndexedDB source |
| Cart | Enable offline sale mode |
| Sync Indicator | Show "Working Offline" |
| Settings | Enable offline mode toggle |

### Event Listener Example Pattern

| Stage | Implementation |
|-------|----------------|
| Subscribe | `manager.addEventListener('app:offline', handler)` |
| Handle | `(event) => { showOfflineUI(); switchToLocal(); }` |
| Unsubscribe | `manager.removeEventListener('app:offline', handler)` |

### Expected Outcome
- Custom offline event properly defined
- Event dispatched on offline transitions
- Event payload includes relevant context
- Components can subscribe and react
- Event logged and tracked

### Verification Checklist
- [ ] Event constant defined (app:offline)
- [ ] Event payload interface created
- [ ] Dispatch method implemented
- [ ] Event fires on network loss
- [ ] Event fires on forced offline
- [ ] Payload includes timestamp and reason
- [ ] Components can subscribe to event
- [ ] Event logged to console
- [ ] Duplicate events prevented
- [ ] Event persisted in localStorage

---

## Task 36: Create Online Event

### Overview
Implement custom online event dispatching that notifies the application when network connectivity is restored. This event triggers synchronization of offline data, re-enables online features, and updates the UI to reflect the connected state. The online event is critical for resuming normal operations and ensuring data consistency after an offline period.

### Dependencies
- Task 34: Create Online Detection

### Instructions

1. **Define online event structure**
   - Create event type constant `APP_ONLINE_EVENT = 'app:online'`
   - Define event payload interface
   - Include timestamp and offline duration
   - Add pending sync count

2. **Implement event dispatch method**
   - Create `dispatchOnlineEvent()` private method
   - Call when `isOnline` changes to true
   - Calculate duration of offline period
   - Include sync queue information

3. **Create event payload**
   - Add `timestamp` field with reconnection time
   - Add `offlineDuration` in milliseconds
   - Add `pendingSyncCount` from sync queue
   - Add `hadOfflineData` boolean flag

4. **Integrate with state changes**
   - Call from `handleOnlineEvent()` method
   - Call when `setForceOffline(false)` after forced mode
   - Trigger before starting sync operations
   - Ensure state is updated first

5. **Trigger automatic sync**
   - Check if sync queue has pending items
   - Start background sync after event dispatched
   - Show sync progress in UI
   - Retry failed sync operations

6. **Setup event listeners in components**
   - Listen for `app:online` event
   - Hide offline indicator in UI
   - Re-enable online features
   - Switch back to server data
   - Show sync status notification

7. **Implement sync trigger logic**
   - Queue sync operations after dispatch
   - Process sales, receipts, and cash movements
   - Update inventory levels from server
   - Reconcile local and server data
   - Show success/failure notifications

### Event Dispatch Flow

```
Network Restored
       │
       ▼
Update isOnline = true
       │
       ▼
Calculate Offline Duration
       │
       ▼
Count Pending Sync Items
       │
       ▼
Create Event Payload
       │
   ┌───┴──────────────────┐
   │ timestamp: Date.now()│
   │ offlineDuration: 3600000
   │ pendingSyncCount: 5  │
   │ hadOfflineData: true │
   └───┬──────────────────┘
       │
       ▼
Dispatch app:online Event
       │
    ┌──┴───┬────────┬────────┐
    ▼      ▼        ▼        ▼
  UI     Features  Data    Sync
Update  Enable   Switch   Start
```

### Event Payload Structure

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | number | Time of reconnection |
| `offlineDuration` | number | Milliseconds offline |
| `pendingSyncCount` | number | Items in sync queue |
| `hadOfflineData` | boolean | Local changes exist |

### Sync Trigger Priority

| Priority | Data Type | Sync Order |
|----------|-----------|------------|
| High | Sales/transactions | First |
| High | Cash movements | Second |
| Medium | Receipts | Third |
| Medium | Inventory updates | Fourth |
| Low | Customer data | Fifth |

### Component Reactions

| Component | Action on app:online |
|-----------|---------------------|
| Header | Hide offline indicator |
| Navigation | Show all menu items |
| Product List | Refresh from server |
| Sync Indicator | Show "Syncing..." |
| Cart | Resume normal operation |
| Notifications | Show "Back Online" |

### Sync Workflow

```
app:online Event
       │
       ▼
Check Sync Queue
       │
   ┌───┴───┐
   ▼       ▼
Empty    Has Items
   │       │
   │       ▼
   │   Show Progress
   │       │
   │       ▼
   │   Process Queue
   │       │
   │   ┌───┴───┬───────┐
   │   ▼       ▼       ▼
   │ Sales  Cash   Receipts
   │   │       │       │
   │   └───┬───┴───┬───┘
   │       │       │
   │       ▼       ▼
   │   Success  Retry Failed
   │       │       │
   └───────┴───────┘
           │
           ▼
    Sync Complete
           │
           ▼
    Refresh Data
```

### Expected Outcome
- Custom online event properly defined
- Event dispatched on connectivity restore
- Automatic sync triggered after dispatch
- Offline duration calculated and tracked
- UI updated to reflect online state

### Verification Checklist
- [ ] Event constant defined (app:online)
- [ ] Event payload interface created
- [ ] Dispatch method implemented
- [ ] Event fires on network restore
- [ ] Offline duration calculated correctly
- [ ] Pending sync count included
- [ ] Sync queue triggered after event
- [ ] Components can subscribe to event
- [ ] UI updates to online state
- [ ] Event logged and tracked

---

## Task 37: Create Mode Toggle

### Overview
Implement a manual offline mode toggle that allows developers and users to force the POS system into offline mode for testing, demonstrations, or deliberate offline operation. This feature is essential for testing offline functionality without actually disconnecting from the network and for scenarios where users want to work offline even with connectivity available.

### Dependencies
- Task 36: Create Online Event

### Instructions

1. **Add force offline property**
   - Add `isForceOffline` boolean to OfflineManager class
   - Initialize to false by default
   - Persist state in localStorage
   - Restore on application restart

2. **Create setForceOffline method**
   - Define `setForceOffline(value: boolean)` public method
   - Update `isForceOffline` property
   - Save to localStorage immediately
   - Dispatch appropriate event (online/offline)

3. **Update effective online status**
   - Modify `getOnlineStatus()` to check both flags
   - Return false if `isForceOffline` is true
   - Override actual network state when forced
   - Provide `getActualNetworkState()` for debugging

4. **Implement toggle UI control**
   - Add toggle switch in settings or developer menu
   - Show current mode status clearly
   - Display warning when in forced offline mode
   - Indicate actual network state separately

5. **Handle mode transitions**
   - When enabling force offline (true):
     - Dispatch app:offline event
     - Pause sync operations
     - Show offline UI indicators
   - When disabling force offline (false):
     - Check actual network state
     - Dispatch appropriate event
     - Resume sync if actually online

6. **Add debugging information**
   - Create `getDebugInfo()` method
   - Return object with all states
   - Include: isOnline, isForceOffline, actualNetwork
   - Show in console or debug panel

7. **Implement safety checks**
   - Warn when toggling during sync
   - Prevent toggle during critical operations
   - Show confirmation dialog before enabling
   - Log mode changes for debugging

### Mode Toggle Flow

```
User Toggles Offline Mode
         │
         ▼
    Set to true?
    ┌────┴─────┐
    ▼          ▼
  Yes         No
    │          │
    ▼          ▼
Update      Update
isForce     isForce
Offline     Offline
= true      = false
    │          │
    ▼          ▼
Save to     Save to
Local       Local
Storage     Storage
    │          │
    ▼          ▼
Dispatch    Check Actual
app:off     Network State
line            │
    │       ┌───┴────┐
    ▼       ▼        ▼
  Show    Online   Offline
Offline    │        │
 Mode      ▼        ▼
        Dispatch Dispatch
        app:     app:
        online   offline
```

### State Determination Logic

| Actual Network | Force Offline | Effective State | Reason |
|----------------|---------------|-----------------|--------|
| Online | false | Online | Normal operation |
| Online | true | Offline | Forced offline testing |
| Offline | false | Offline | No network connection |
| Offline | true | Offline | Both offline |

### Method Implementation

| Method | Returns | Description |
|--------|---------|-------------|
| `setForceOffline(value)` | void | Toggle forced mode |
| `getOnlineStatus()` | boolean | Effective online state |
| `getActualNetworkState()` | boolean | Real network state |
| `getForceOfflineStatus()` | boolean | Forced mode status |

### UI Indicators

```
┌──────────────────────────────────┐
│  Status Bar                      │
├──────────────────────────────────┤
│  ⚠️  FORCED OFFLINE MODE         │
│                                  │
│  Actual Network: ✅ Connected   │
│  Operating Mode: 📴 Offline     │
│                                  │
│  [Exit Offline Mode]            │
└──────────────────────────────────┘
```

### Settings Toggle Pattern

```
┌──────────────────────────────────┐
│  Developer Settings              │
├──────────────────────────────────┤
│                                  │
│  Offline Mode Testing            │
│                                  │
│  Force Offline Mode    [Toggle]  │
│  │ Enable offline mode for      │
│  │ testing without disconnecting│
│                                  │
│  Current State:                  │
│  • Network: Connected           │
│  • Mode: Normal                 │
│                                  │
└──────────────────────────────────┘
```

### Use Cases

| Scenario | Use Force Offline |
|----------|------------------|
| Testing offline sales | Yes |
| Demonstrating offline features | Yes |
| Developing offline functionality | Yes |
| Simulating network issues | Yes |
| Working with unreliable connection | Yes |
| Normal operation | No |

### Expected Outcome
- Manual offline mode toggle implemented
- State persists across page reloads
- UI clearly indicates forced mode
- Both actual and effective states available
- Proper event dispatching on toggle

### Verification Checklist
- [ ] isForceOffline property added
- [ ] setForceOffline() method implemented
- [ ] State saved to localStorage
- [ ] getOnlineStatus() considers both flags
- [ ] Toggle UI control created
- [ ] Warning shown in forced mode
- [ ] Events dispatched on toggle
- [ ] Debug info available
- [ ] Mode persists on refresh
- [ ] Safety checks implemented

---

## Task 38: Create Data Prefetch

### Overview
Implement the core data prefetch system that downloads and stores essential POS data locally for offline operation. This system orchestrates batch downloads of products, customers, and inventory data into IndexedDB, ensuring the POS can function without network connectivity. The prefetch system includes progress tracking, error handling, and incremental updates.

### Dependencies
- Task 37: Create Mode Toggle

### Instructions

1. **Create prefetch service file**
   - Navigate to `frontend/lib/offline/` directory
   - Create new file named `prefetch.ts`
   - Export prefetch functions and types
   - Import IndexedDB utilities and API clients

2. **Define prefetch configuration**
   - Create interface for prefetch settings
   - Set batch size for API requests (100-500 items)
   - Set max retries for failed requests (3)
   - Set timeout for each request (30 seconds)
   - Define data limits per entity type

3. **Implement prefetchAll method**
   - Create main `prefetchAll()` async method
   - Call individual prefetch methods sequentially
   - Track overall progress across all data types
   - Handle errors gracefully without stopping
   - Return summary of prefetched items

4. **Setup progress tracking**
   - Initialize progress object with totals
   - Update after each batch completes
   - Emit progress events for UI updates
   - Calculate percentage completed
   - Estimate time remaining

5. **Implement batch download logic**
   - Create generic `fetchBatch(endpoint, offset, limit)` function
   - Use pagination for large datasets
   - Process responses in chunks
   - Store batches in IndexedDB immediately
   - Continue on individual item errors

6. **Add error handling**
   - Catch network errors per batch
   - Retry failed batches with exponential backoff
   - Log errors without stopping prefetch
   - Track failed items for later retry
   - Show error summary at completion

7. **Implement incremental updates**
   - Store timestamp of last successful prefetch
   - On subsequent runs, fetch only changed data
   - Use `modified_since` query parameter
   - Merge updates with existing data
   - Track update timestamp per entity type

8. **Add prefetch scheduling**
   - Create `schedulePrefetch()` method
   - Run on application startup
   - Run daily in background
   - Run manually from settings
   - Skip if already in progress

### Prefetch Architecture

```
┌─────────────────────────────────────────┐
│          Prefetch Orchestrator          │
├─────────────────────────────────────────┤
│  prefetchAll()                          │
│    │                                    │
│    ├──> prefetchProducts()             │
│    │      └─> Batch 1, 2, 3...         │
│    │                                    │
│    ├──> prefetchCustomers()            │
│    │      └─> Batch 1, 2, 3...         │
│    │                                    │
│    └──> prefetchInventory()            │
│         └─> Batch 1, 2, 3...           │
│                                         │
│  Progress Events ━━━━━━━> UI           │
└─────────────────────────────────────────┘
```

### Prefetch Flow

```
Start Prefetch
       │
       ▼
Check if In Progress
       │
    ┌──┴──┐
    ▼     ▼
  Yes    No
   │      │
   │      ▼
   │  Set prefetchInProgress = true
   │      │
   │      ▼
   │  Initialize Progress
   │      │
   │      ▼
   │  Prefetch Products
   │      │
   └──────┤
          ▼
      Update Progress
          │
          ▼
    Prefetch Customers
          │
          ▼
      Update Progress
          │
          ▼
    Prefetch Inventory
          │
          ▼
      Update Progress
          │
          ▼
   Set prefetchInProgress = false
          │
          ▼
   Dispatch Complete Event
```

### Batch Processing Pattern

```
┌─────────────────────────────────────┐
│  Fetch Batch 1 (offset: 0, limit: 500)
│         │
│         ▼
│     Success?
│    ┌────┴─────┐
│    ▼          ▼
│  Yes         No
│    │          │
│    ▼          ▼
│  Store     Retry
│  in DB     (3x)
│    │          │
│    └────┬─────┘
│         │
│         ▼
│  More Pages?
│    ┌────┴─────┐
│    ▼          ▼
│  Yes         No
│    │          │
│    ▼          ▼
│  Batch 2   Complete
│    │
│    └─> (repeat)
└─────────────────────────────────────┘
```

### Configuration Options

| Setting | Value | Purpose |
|---------|-------|---------|
| `batchSize` | 500 | Items per API request |
| `maxRetries` | 3 | Failed request retries |
| `timeout` | 30000ms | Request timeout |
| `maxProducts` | 10000 | Product limit |
| `maxCustomers` | 5000 | Customer limit |
| `maxInventory` | 10000 | Inventory limit |

### Progress Object Structure

| Field | Type | Description |
|-------|------|-------------|
| `productsLoaded` | number | Products downloaded |
| `productsTotal` | number | Total products |
| `customersLoaded` | number | Customers downloaded |
| `customersTotal` | number | Total customers |
| `inventoryLoaded` | number | Inventory items downloaded |
| `inventoryTotal` | number | Total inventory items |
| `overallPercent` | number | Total completion percentage |

### Prefetch Triggers

| Trigger | When | Purpose |
|---------|------|---------|
| App startup | First load | Initial data download |
| Manual button | User action | Force refresh |
| Daily schedule | Background | Keep data current |
| After major update | Post-sync | Refresh changed data |

### Expected Outcome
- Core prefetch orchestration implemented
- Batch downloading with progress tracking
- Error handling with retry logic
- Incremental updates supported
- Scheduling mechanism in place

### Verification Checklist
- [ ] prefetch.ts file created
- [ ] prefetchAll() method implemented
- [ ] Batch download logic working
- [ ] Progress tracking functional
- [ ] Error handling with retries
- [ ] Data stored in IndexedDB
- [ ] Incremental updates supported
- [ ] Prefetch scheduling implemented
- [ ] Progress events emitted
- [ ] Summary returned on completion

---

## Task 39: Create Product Prefetch

### Overview
Implement the product data prefetch functionality that downloads and stores product information locally for offline POS operations. This includes product details, pricing, SKUs, stock levels, and metadata needed for sale processing. The product prefetch ensures cashiers can search, view, and sell products even without network connectivity.

### Dependencies
- Task 38: Create Data Prefetch

### Instructions

1. **Define product data structure**
   - Create interface for prefetched product data
   - Include essential fields: id, sku, name, price
   - Add stock level and location information
   - Include category, brand, and supplier fields
   - Add tax rate and discount eligibility

2. **Create prefetchProducts method**
   - Define `prefetchProducts()` async function
   - Export from prefetch.ts file
   - Call from prefetchAll() orchestrator
   - Return count of products downloaded

3. **Implement API endpoint call**
   - Call GET `/api/pos/products/prefetch` endpoint
   - Include pagination parameters (offset, limit)
   - Add `fields` parameter to limit response size
   - Include active products only filter
   - Sort by SKU or name for consistency

4. **Define batch processing**
   - Set batch size to 500 products
   - Calculate total pages from response headers
   - Loop through all pages sequentially
   - Handle partial batch failures
   - Track progress after each batch

5. **Store products in IndexedDB**
   - Open IndexedDB `products` object store
   - Use product ID as key
   - Store complete product object as value
   - Create index on SKU for search
   - Create index on name for autocomplete

6. **Implement data transformation**
   - Parse API response to local format
   - Calculate display prices with tax
   - Format currency values
   - Normalize text fields for search
   - Generate search keywords

7. **Handle product images**
   - Download thumbnail images only (not full size)
   - Store image URLs, not binary data
   - Use cached images from service worker
   - Fallback to placeholder for missing images
   - Lazy load images in UI

8. **Implement product limits**
   - Respect 10,000 product limit
   - Prioritize high-turnover products
   - Use `top_sellers` flag in API
   - Allow configuration of limit
   - Warn when limit exceeded

### Product Prefetch Flow

```
Start Product Prefetch
        │
        ▼
Call API /api/pos/products/prefetch
        │
        ▼
    Get Total Count
        │
        ▼
Calculate Number of Batches
        │
        ▼
    ┌───┴───┐
    ▼       │
Batch 1     │
 (500)      │
    │       │
    ▼       │
  Store     │
  in DB     │
    │       │
    ▼       │
 Update     │
Progress    │
    │       │
    └───────┘
        │
        ▼
   More Batches?
    ┌───┴────┐
    ▼        ▼
  Yes       No
    │        │
    └────┐   │
         │   ▼
    Next    Complete
    Batch   Return Count
```

### Product Data Fields

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `id` | string | Yes | Unique identifier |
| `sku` | string | Yes | Stock keeping unit |
| `name` | string | Yes | Product name |
| `price` | number | Yes | Sale price |
| `stock` | number | Yes | Available quantity |
| `category` | string | No | Product category |
| `brand` | string | No | Brand name |
| `taxRate` | number | Yes | Tax percentage |
| `imageUrl` | string | No | Thumbnail URL |

### IndexedDB Storage Schema

```
ObjectStore: products
├── Key: product.id (string)
├── Value: Product object
└── Indexes:
    ├── sku (unique)
    ├── name (non-unique)
    └── category (non-unique)
```

### API Request Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `offset` | 0, 500, 1000... | Pagination offset |
| `limit` | 500 | Items per page |
| `fields` | Essential fields | Reduce response size |
| `active` | true | Active products only |
| `top_sellers` | true | Priority products |

### Storage Optimization

| Optimization | Implementation |
|--------------|----------------|
| Field selection | Request only needed fields |
| Image handling | Store URLs, not binary |
| Text compression | Use IndexedDB compression |
| Limit items | Cap at 10,000 products |
| Incremental updates | Download changes only |

### Progress Calculation

```
Current Product: 1500
Total Products: 5000
Products Progress: 30%

(currentLoaded / totalToLoad) * 100 = progress
(1500 / 5000) * 100 = 30%
```

### Expected Outcome
- Products downloaded and stored locally
- Product data searchable by SKU and name
- Stock levels accurate at prefetch time
- Images cached for offline viewing
- Progress tracked and reported

### Verification Checklist
- [ ] prefetchProducts() function created
- [ ] API endpoint called correctly
- [ ] Batch processing implemented
- [ ] Products stored in IndexedDB
- [ ] Indexes created for search
- [ ] Product limit respected
- [ ] Images handled efficiently
- [ ] Progress updates emitted
- [ ] Error handling implemented
- [ ] Count returned on completion

---

## Task 40: Create Customer Prefetch

### Overview
Implement customer data prefetch functionality that downloads and stores customer information locally for offline POS operations. This enables cashiers to search for customers, apply loyalty discounts, and record sales against customer accounts even without network connectivity. Customer data includes contact information, loyalty status, and purchase history summaries.

### Dependencies
- Task 38: Create Data Prefetch

### Instructions

1. **Define customer data structure**
   - Create interface for prefetched customer data
   - Include fields: id, name, phone, email
   - Add loyalty points and tier information
   - Include credit balance and limits
   - Add preferred payment method

2. **Create prefetchCustomers method**
   - Define `prefetchCustomers()` async function
   - Export from prefetch.ts file
   - Call from prefetchAll() orchestrator
   - Return count of customers downloaded

3. **Implement API endpoint call**
   - Call GET `/api/pos/customers/prefetch` endpoint
   - Include pagination parameters
   - Add fields parameter for optimization
   - Filter active customers only
   - Sort by name or ID

4. **Define batch processing**
   - Set batch size to 500 customers
   - Calculate total pages from headers
   - Process all pages sequentially
   - Handle individual customer errors
   - Update progress per batch

5. **Store customers in IndexedDB**
   - Open IndexedDB `customers` object store
   - Use customer ID as primary key
   - Store complete customer object
   - Create index on phone number
   - Create index on name for search

6. **Implement search optimization**
   - Normalize phone numbers (remove formatting)
   - Create searchable name field
   - Generate email domain index
   - Store loyalty tier separately
   - Build search keyword array

7. **Handle privacy considerations**
   - Encrypt sensitive customer data
   - Store minimal PII required for POS
   - Respect data retention policies
   - Clear expired customer data
   - Log data access for audit

8. **Implement customer limits**
   - Respect 5,000 customer limit
   - Prioritize recent customers
   - Use `recent_activity` flag in API
   - Allow configuration of limit
   - Archive inactive customers

### Customer Prefetch Flow

```
Start Customer Prefetch
        │
        ▼
Call API /api/pos/customers/prefetch
        │
        ▼
    Get Total Count
        │
        ▼
Calculate Batches (500 each)
        │
        ▼
    ┌───┴───┐
    ▼       │
Process     │
Batch 1     │
    │       │
    ▼       │
Normalize   │
Data        │
    │       │
    ▼       │
  Store     │
  in DB     │
    │       │
    ▼       │
 Emit       │
Progress    │
    │       │
    └───────┘
        │
        ▼
   More Batches?
    ┌───┴────┐
    ▼        ▼
  Yes       No
    │        │
    └────┐   │
         │   ▼
    Next    Complete
    Batch
```

### Customer Data Fields

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Customer name |
| `phone` | string | Yes | Contact number |
| `email` | string | No | Email address |
| `loyaltyPoints` | number | Yes | Current points |
| `loyaltyTier` | string | No | Membership tier |
| `creditBalance` | number | No | Account balance |
| `creditLimit` | number | No | Credit limit |

### IndexedDB Storage Schema

```
ObjectStore: customers
├── Key: customer.id (string)
├── Value: Customer object
└── Indexes:
    ├── phone (unique)
    ├── name (non-unique)
    ├── email (unique)
    └── loyaltyTier (non-unique)
```

### Search Capabilities

| Search Type | Index Used | Example |
|-------------|------------|---------|
| By phone | phone index | "077-123-4567" |
| By name | name index | "John Smith" |
| By email | email index | "john@example.com" |
| By tier | loyaltyTier index | "Gold" |

### Data Normalization

| Field | Normalization |
|-------|---------------|
| Phone | Remove spaces, dashes, parentheses |
| Name | Lowercase for search, title case for display |
| Email | Lowercase |
| Tier | Uppercase |

### Privacy & Security

| Aspect | Implementation |
|--------|----------------|
| Encryption | Encrypt PII fields in IndexedDB |
| Access logging | Log customer data access |
| Data minimization | Store only POS-required fields |
| Retention | Auto-delete after 90 days |
| Audit trail | Track data access and changes |

### Priority Customers

| Priority | Criteria | Purpose |
|----------|----------|---------|
| High | Active in last 30 days | Recent customers first |
| Medium | Loyalty members | VIP customers |
| Low | Inactive > 90 days | Lower priority |

### Expected Outcome
- Customers downloaded and stored locally
- Customer search working offline
- Loyalty information available
- Privacy and security maintained
- Progress tracked during prefetch

### Verification Checklist
- [ ] prefetchCustomers() function created
- [ ] API endpoint called correctly
- [ ] Batch processing implemented
- [ ] Customers stored in IndexedDB
- [ ] Search indexes created
- [ ] Phone numbers normalized
- [ ] Customer limit respected
- [ ] Privacy measures implemented
- [ ] Progress updates emitted
- [ ] Count returned on completion

---

## Task 41: Create Inventory Prefetch

### Overview
Implement inventory data prefetch functionality that downloads and stores current stock levels and location information locally. This enables the POS system to check inventory availability, reserve stock, and update quantities during offline sales. Inventory data must be synchronized frequently to maintain accuracy.

### Dependencies
- Task 38: Create Data Prefetch

### Instructions

1. **Define inventory data structure**
   - Create interface for prefetched inventory
   - Include fields: product_id, quantity, location
   - Add reserved quantity and available quantity
   - Include warehouse/branch information
   - Add last update timestamp

2. **Create prefetchInventory method**
   - Define `prefetchInventory()` async function
   - Export from prefetch.ts file
   - Call from prefetchAll() orchestrator
   - Return count of inventory items downloaded

3. **Implement API endpoint call**
   - Call GET `/api/pos/inventory/prefetch` endpoint
   - Include current branch/location filter
   - Add pagination parameters
   - Filter only sellable stock
   - Sort by product ID

4. **Define batch processing**
   - Set batch size to 500 items
   - Calculate total pages
   - Process sequentially
   - Handle errors per item
   - Track progress

5. **Store inventory in IndexedDB**
   - Open IndexedDB `inventory` object store
   - Use product_id + location as composite key
   - Store complete inventory object
   - Create index on product_id
   - Create index on location

6. **Implement stock calculations**
   - Calculate available stock (quantity - reserved)
   - Track pending offline sales
   - Decrement on offline sale
   - Queue updates for sync
   - Prevent negative stock

7. **Handle multi-location inventory**
   - Store inventory per location/branch
   - Default to current POS location
   - Support stock transfers
   - Show other location availability
   - Enable stock lookup

8. **Implement inventory limits**
   - Respect 10,000 item limit
   - Prioritize current location stock
   - Include fast-moving items
   - Exclude out-of-stock items
   - Configure limit per location

### Inventory Prefetch Flow

```
Start Inventory Prefetch
        │
        ▼
Call API /api/pos/inventory/prefetch
        │
        ▼
Filter Current Location
        │
        ▼
    Get Total Count
        │
        ▼
Calculate Batches
        │
        ▼
    ┌───┴───┐
    ▼       │
Process     │
Batch       │
    │       │
    ▼       │
Calculate   │
Available   │
Stock       │
    │       │
    ▼       │
  Store     │
  in DB     │
    │       │
    ▼       │
 Update     │
Progress    │
    │       │
    └───────┘
        │
        ▼
   More Batches?
    ┌───┴────┐
    ▼        ▼
  Yes       No
    │        │
    └────┐   │
         │   ▼
    Next    Complete
    Batch
```

### Inventory Data Fields

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `product_id` | string | Yes | Product reference |
| `location` | string | Yes | Branch/warehouse |
| `quantity` | number | Yes | Total stock |
| `reserved` | number | Yes | Reserved quantity |
| `available` | number | Yes | Available to sell |
| `lastUpdated` | timestamp | Yes | Sync timestamp |

### IndexedDB Storage Schema

```
ObjectStore: inventory
├── Key: `${product_id}_${location}`
├── Value: Inventory object
└── Indexes:
    ├── product_id (non-unique)
    ├── location (non-unique)
    └── lastUpdated (non-unique)
```

### Stock Calculation Logic

```
Total Quantity: 100
Reserved Quantity: 20
Pending Offline Sales: 5

Available = Total - Reserved - PendingOffline
Available = 100 - 20 - 5
Available = 75

Can Sell: Yes (Available > 0)
```

### Multi-Location Support

| Scenario | Implementation |
|----------|----------------|
| Current location | Primary inventory source |
| Other locations | Show availability, no sale |
| Stock transfer | Request transfer, manual approval |
| Out of stock | Show alternatives from other locations |

### Stock Update on Offline Sale

```
Offline Sale Created
        │
        ▼
Get Current Inventory
        │
        ▼
Check Available Stock
        │
    ┌───┴────┐
    ▼        ▼
Available  Out of Stock
    │        │
    ▼        │
Decrement    │
Available    │
    │        │
    ▼        ▼
Update    Show Error
IndexedDB
    │
    ▼
Add to Sync Queue
    │
    ▼
Emit stock:updated Event
```

### Inventory Sync Priority

| Priority | When | Purpose |
|----------|------|---------|
| Immediate | Before each sale | Accurate availability |
| Frequent | Every 5 minutes | Current stock levels |
| On-demand | User refresh | Manual update |
| Full sync | Daily | Complete refresh |

### Expected Outcome
- Inventory downloaded and stored locally
- Stock levels accurate at prefetch time
- Multi-location support implemented
- Stock calculations working correctly
- Progress tracked during prefetch

### Verification Checklist
- [ ] prefetchInventory() function created
- [ ] API endpoint called correctly
- [ ] Batch processing implemented
- [ ] Inventory stored in IndexedDB
- [ ] Indexes created correctly
- [ ] Stock calculations implemented
- [ ] Multi-location support added
- [ ] Inventory limit respected
- [ ] Progress updates emitted
- [ ] Count returned on completion

---

## Task 42: Create Prefetch Progress

### Overview
Implement comprehensive progress tracking and reporting for the data prefetch operations. This task creates a system for monitoring prefetch status, displaying progress to users, and providing detailed feedback about what data is being downloaded. Progress tracking improves user experience during the potentially lengthy prefetch process.

### Dependencies
- Task 41: Create Inventory Prefetch

### Instructions

1. **Define progress event structure**
   - Create event type `prefetch:progress`
   - Define progress payload interface
   - Include loaded and total counts per entity
   - Add overall percentage completed
   - Include current operation description

2. **Create progress state object**
   - Initialize progress tracking object
   - Add counters for each entity type
   - Track start time and estimated completion
   - Store current operation name
   - Calculate overall progress percentage

3. **Implement progress calculation**
   - Calculate per-entity progress percentages
   - Compute weighted overall progress
   - Account for different entity counts
   - Update after each batch completion
   - Smooth progress updates to avoid jumps

4. **Create progress event dispatcher**
   - Define `emitPrefetchProgress()` method
   - Call after each batch completes
   - Dispatch event with current state
   - Include entity name and progress
   - Throttle events to avoid spam (max 1/second)

5. **Implement UI progress display**
   - Create progress bar component
   - Show overall completion percentage
   - Display current operation text
   - Show individual entity progress
   - Estimate time remaining

6. **Add detailed progress breakdown**
   - Show products: X / Y loaded
   - Show customers: X / Y loaded
   - Show inventory: X / Y loaded
   - Display items per second rate
   - Show pause/cancel options

7. **Handle progress persistence**
   - Save progress state to localStorage
   - Restore on page reload
   - Continue from last position on resume
   - Clear progress on successful completion
   - Reset progress on error or cancel

8. **Implement completion notification**
   - Dispatch `prefetch:complete` event
   - Include summary statistics
   - Show success notification
   - Log completion time
   - Update last prefetch timestamp

### Progress Event Flow

```
Prefetch Starts
       │
       ▼
Initialize Progress
   { products: 0/10000,
     customers: 0/5000,
     inventory: 0/10000,
     overall: 0% }
       │
       ▼
┌──────┴───────┐
│ Products     │
│ Batch 1      │
│   │          │
│   ▼          │
│ Update:      │
│ 500/10000    │
│ 5%           │
│   │          │
│   ▼          │
│ Emit Event   │
└──────┬───────┘
       │
    (repeat)
       │
       ▼
┌──────┴───────┐
│ Customers    │
│ Batch 1      │
│   │          │
│   ▼          │
│ Update:      │
│ 500/5000     │
│ 35%          │
│   │          │
│   ▼          │
│ Emit Event   │
└──────┬───────┘
       │
    (continue)
       │
       ▼
Prefetch Complete
   100%
```

### Progress Payload Structure

| Field | Type | Description |
|-------|------|-------------|
| `currentOperation` | string | Current entity being loaded |
| `productsLoaded` | number | Products downloaded |
| `productsTotal` | number | Total products to download |
| `customersLoaded` | number | Customers downloaded |
| `customersTotal` | number | Total customers |
| `inventoryLoaded` | number | Inventory items downloaded |
| `inventoryTotal` | number | Total inventory items |
| `overallPercent` | number | Overall completion (0-100) |
| `itemsPerSecond` | number | Download rate |
| `estimatedRemaining` | number | Seconds until complete |

### Overall Progress Calculation

```
Weights:
  Products: 40%  (largest dataset)
  Customers: 30%
  Inventory: 30%

Progress Calculation:
  productsPercent = (productsLoaded / productsTotal) * 40
  customersPercent = (customersLoaded / customersTotal) * 30
  inventoryPercent = (inventoryLoaded / inventoryTotal) * 30
  
  overallPercent = productsPercent + 
                   customersPercent + 
                   inventoryPercent

Example:
  Products: 5000/10000 = 50% * 40 = 20%
  Customers: 5000/5000 = 100% * 30 = 30%
  Inventory: 0/10000 = 0% * 30 = 0%
  Overall: 20 + 30 + 0 = 50%
```

### UI Progress Display

```
┌────────────────────────────────────────┐
│  Data Prefetch in Progress            │
├────────────────────────────────────────┤
│                                        │
│  ████████████░░░░░░░░░░░░░░░░  52%   │
│                                        │
│  Current: Loading Customers            │
│                                        │
│  ✓ Products      10,000 / 10,000      │
│  ⟳ Customers      2,600 / 5,000       │
│  ○ Inventory          0 / 10,000      │
│                                        │
│  Speed: 450 items/sec                  │
│  Time Remaining: ~1 minute             │
│                                        │
│  [Pause]  [Cancel]                    │
└────────────────────────────────────────┘
```

### Progress States

| State | Icon | Description |
|-------|------|-------------|
| Pending | ○ | Not started |
| In Progress | ⟳ | Currently loading |
| Complete | ✓ | Finished successfully |
| Error | ✗ | Failed with error |
| Paused | ⏸ | Temporarily paused |

### Event Throttling

```
Progress Update Ready
       │
       ▼
Check Last Event Time
       │
    ┌──┴───┐
    ▼      ▼
 < 1s    > 1s
    │      │
    │      ▼
    │   Emit Event
    │      │
    │      ▼
    │   Update Last Time
    │      │
    └──────┘
       │
       ▼
   Continue
```

### Expected Outcome
- Progress events emitted during prefetch
- UI displays current progress clearly
- Overall percentage calculated correctly
- Time estimates provided to users
- Progress persists across page reloads

### Verification Checklist
- [ ] Progress event structure defined
- [ ] Progress state object created
- [ ] Progress calculation implemented
- [ ] Event dispatcher working
- [ ] Progress UI component created
- [ ] Detailed breakdown displayed
- [ ] Progress throttling implemented
- [ ] Persistence to localStorage
- [ ] Completion event dispatched
- [ ] Time estimates accurate

---

## Summary

This document covered the creation of the offline manager core and data prefetch system (Tasks 33-42):

**Completed Components:**
- OfflineManager singleton class
- Online/offline detection system
- Custom offline and online events
- Manual offline mode toggle
- Core data prefetch orchestration
- Product prefetch (10,000 limit)
- Customer prefetch (5,000 limit)
- Inventory prefetch (10,000 limit)
- Comprehensive progress tracking

**Key Features Implemented:**
- Real-time network state monitoring
- Event-driven architecture for state changes
- Batch downloading with progress tracking
- IndexedDB storage for all prefetched data
- Error handling with retry logic
- Incremental updates support
- Multi-location inventory support
- Privacy and security measures

**Next Steps:**
- Proceed to Task 43: Create Offline Sale
- Implement offline sale processing
- Create temp receipt ID generation
- Add local stock updates
- Implement offline receipt printing
- Create cash management and shift handling

The prefetch system provides the foundation for fully offline POS operations by ensuring all necessary data is available locally before connectivity is lost.

---

**Document Navigation:**
- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-B_Service-Worker/02_Tasks-27-32_Versioning-Sync.md](../Group-B_Service-Worker/02_Tasks-27-32_Versioning-Sync.md)
- **→ Next Document:** [02_Tasks-43-50_Sale-Receipt-Shift.md](02_Tasks-43-50_Sale-Receipt-Shift.md)
