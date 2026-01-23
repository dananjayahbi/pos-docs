# Tasks 31-34: Service Worker Cache

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** B - Local Data Caching  
> **Document:** 03 of 03  
> **Tasks Covered:** 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-25-30_Versioning-Cache-Service.md](02_Tasks-25-30_Versioning-Cache-Service.md)
- **→ Next Group:** [../Group-C_Transaction-Queue-Management/](../Group-C_Transaction-Queue-Management/)

---

## Document Overview

This document covers the implementation of Service Worker for offline asset caching, cache strategies for different resource types, Background Sync API integration, and cache warmup on user login.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create Service Worker Setup | High |
| 32 | Define Cache Strategies | Medium |
| 33 | Implement Background Sync Registration | Medium |
| 34 | Create Cache Warmup on Login | Medium |

---

## Task 31: Create Service Worker Setup

### Overview
Set up a Service Worker using Workbox to cache static assets, handle offline requests, and manage application shell caching for the POS frontend.

### Dependencies
- None (foundational task)

### Instructions

1. **Install Workbox dependencies**
   - Add workbox-webpack-plugin to project
   - Add workbox-window for registration
   - Configure in Next.js build pipeline

2. **Create Service Worker entry file**
   - Create `public/sw.js` file
   - Import Workbox core and strategies
   - Configure Workbox options

3. **Configure Workbox in build**
   - Update `next.config.js` to generate Service Worker
   - Configure source maps for debugging
   - Set output path to `public/sw.js`
   - Include runtime caching rules

4. **Create Service Worker registration module**
   - Create `frontend/lib/offline/service-worker.ts`
   - Use Workbox Window for registration
   - Handle registration lifecycle events
   - Export registration utilities

5. **Implement register method**
   - Check if Service Worker supported
   - Check if running in production
   - Register `/sw.js` on page load
   - Handle registration success/failure

6. **Implement update detection**
   - Listen for Service Worker updates
   - Detect when new version available
   - Notify user of available update
   - Provide update mechanism

7. **Add skip waiting handler**
   - Send skipWaiting message to Service Worker
   - Activate new Service Worker immediately
   - Reload page after activation
   - Ensure smooth update experience

8. **Implement registration logging**
   - Log successful registration
   - Log update detection
   - Log activation events
   - Log errors for debugging

9. **Create unregister method**
   - Unregister Service Worker if needed
   - Clear all caches
   - Useful for debugging and testing

10. **Add precache manifest generation**
    - Configure Workbox to generate precache manifest
    - Include critical assets (JS, CSS, fonts)
    - Include app shell HTML
    - Exclude large files and API responses

11. **Configure Service Worker scope**
    - Set scope to root path '/'
    - Ensure Service Worker intercepts all requests
    - Document scope limitations

12. **Add development mode handling**
    - Disable Service Worker in development
    - Or use different Service Worker for dev
    - Provide clear logging of SW status

13. **Export Service Worker utilities**
    - Export registration function
    - Export update checking function
    - Export TypeScript interfaces

### Service Worker Registration Flow
```
Page Load
    ↓
Check SW Support?
    ↓ Yes
Check Production Mode?
    ↓ Yes
Register /sw.js
    ↓
Registration Successful
    ↓
Listen for Updates
    ↓
New Version Available?
    ↓ Yes
Show Update Notification
    ↓
User Accepts Update
    ↓
Skip Waiting
    ↓
Activate New SW
    ↓
Reload Page
```

### Workbox Configuration
```javascript
// next.config.js
{
  workbox: {
    swDest: 'public/sw.js',
    swSrc: 'service-worker/sw.js',
    runtimeCaching: [
      // Defined in Task 32
    ],
    exclude: [
      /\.map$/,
      /^manifest.*\.js$/,
      /api\//
    ]
  }
}
```

### Service Worker Lifecycle Events

| Event | When | Action |
|-------|------|--------|
| install | SW script first loaded | Cache critical assets |
| activate | SW takes control | Clean old caches |
| fetch | Network request made | Apply cache strategy |
| message | Message from client | Handle commands |
| sync | Background sync triggered | Sync pending data |

### Expected Outcome
```
frontend/
├── lib/
│   └── offline/
│       └── service-worker.ts  # SW registration utilities
├── public/
│   └── sw.js                  # Generated Service Worker
└── service-worker/
    └── sw.js                  # SW source file
```

### Verification Checklist
- [ ] Workbox dependencies installed
- [ ] Service Worker entry file created
- [ ] Workbox configured in build pipeline
- [ ] Registration module created
- [ ] Registration on page load implemented
- [ ] Update detection implemented
- [ ] Skip waiting handler implemented
- [ ] Precache manifest generation configured
- [ ] Development mode handling implemented
- [ ] Service Worker scope configured
- [ ] Registration logging implemented
- [ ] Unregister method implemented

---

## Task 32: Define Cache Strategies

### Overview
Configure cache-first, network-first, and stale-while-revalidate strategies for different resource types to optimize offline functionality and performance.

### Dependencies
- Task 31: Create Service Worker Setup

### Instructions

1. **Update Service Worker source file**
   - Open `service-worker/sw.js`
   - Import Workbox strategies and routing

2. **Configure static asset caching (Cache First)**
   - Apply to: JS, CSS, fonts, images
   - Cache name: 'static-assets-v1'
   - Max entries: 200
   - Max age: 30 days
   - Update only on asset change

3. **Implement Cache First strategy**
   - Check cache first
   - Return cached response if available
   - Fetch from network only if not cached
   - Cache the network response for future use

4. **Configure API caching (Network First)**
   - Apply to: Most API endpoints
   - Cache name: 'api-responses-v1'
   - Network timeout: 3 seconds
   - Fallback to cache on timeout
   - Max entries: 100

5. **Implement Network First strategy**
   - Try network request first
   - If network succeeds, cache response
   - If network fails/timeouts, return cached response
   - Ensure fresh data when online

6. **Configure product data caching (Stale While Revalidate)**
   - Apply to: Product images, categories
   - Cache name: 'product-data-v1'
   - Return cached immediately
   - Fetch fresh copy in background
   - Update cache with fresh data

7. **Implement Stale While Revalidate strategy**
   - Return cached response immediately
   - Fetch from network in background
   - Update cache when network response arrives
   - Best for non-critical, frequently updated data

8. **Configure offline fallback**
   - Create offline page HTML
   - Cache offline page during install
   - Serve offline page when all strategies fail
   - Show user-friendly offline message

9. **Add route matching rules**
   - Match static assets: `/static/**`, `/_next/**`
   - Match API routes: `/api/pos/**`
   - Match product images: `/media/products/**`
   - Use RegExp for flexible matching

10. **Configure cache expiration**
    - Set maxEntries per cache
    - Set maxAgeSeconds per cache
    - Purge oldest entries when limit reached
    - Prevent unlimited cache growth

11. **Add cache versioning**
    - Version each cache name
    - Clear old cache versions on SW activation
    - Prevent stale data from old versions

12. **Implement cache warmup for critical routes**
    - Pre-cache app shell routes
    - Pre-cache POS main page
    - Pre-cache login page
    - Pre-cache critical API endpoints

13. **Configure cross-origin caching**
    - Handle CORS for external resources
    - Cache external fonts (Google Fonts)
    - Cache CDN resources (if any)
    - Set appropriate cache options

### Cache Strategies by Resource Type

| Resource Type | Strategy | Cache Name | Max Age | Max Entries |
|---------------|----------|------------|---------|-------------|
| JavaScript | Cache First | static-assets-v1 | 30 days | 200 |
| CSS | Cache First | static-assets-v1 | 30 days | 200 |
| Fonts | Cache First | fonts-v1 | 365 days | 50 |
| App Images | Cache First | app-images-v1 | 30 days | 100 |
| Product Images | Stale While Revalidate | product-images-v1 | 7 days | 500 |
| API Responses | Network First (3s) | api-responses-v1 | 5 min | 100 |
| Product API | Stale While Revalidate | product-api-v1 | 30 min | 200 |

### Workbox Runtime Caching Configuration
```javascript
runtimeCaching: [
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts-v1',
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
      }
    }
  },
  {
    urlPattern: /\.(?:js|css)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-assets-v1',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      }
    }
  },
  {
    urlPattern: /^https?:\/\/.*\/api\/pos\/.*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-responses-v1',
      networkTimeoutSeconds: 3,
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 5 * 60 // 5 minutes
      }
    }
  },
  {
    urlPattern: /^https?:\/\/.*\/media\/products\/.*/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'product-images-v1',
      expiration: {
        maxEntries: 500,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      }
    }
  }
]
```

### Cache Strategy Decision Tree
```
Request Received
    ↓
What Type?
    ↓
┌───────┼───────┬───────────┐
│       │       │           │
Static  API     Product     Other
Asset   Call    Image
│       │       │           │
Cache   Network Stale       Network
First   First   While       Only
        (3s)    Revalidate
```

### Offline Fallback Page
```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Offline - LankaCommerce POS</title>
</head>
<body>
  <h1>You are currently offline</h1>
  <p>Your POS terminal can still process sales using cached data.</p>
  <p>Transactions will sync automatically when connection is restored.</p>
</body>
</html>
```

### Expected Outcome
```
frontend/
├── lib/
│   └── offline/
│       └── service-worker.ts
├── public/
│   ├── sw.js                  # Generated with strategies
│   └── offline.html           # Offline fallback page
└── service-worker/
    └── sw.js                  # Updated with strategies
```

### Verification Checklist
- [ ] Cache First strategy configured for static assets
- [ ] Network First strategy configured for APIs
- [ ] Stale While Revalidate configured for product data
- [ ] Route matching rules defined
- [ ] Cache expiration configured
- [ ] Cache versioning implemented
- [ ] Offline fallback page created
- [ ] Cross-origin caching configured
- [ ] Critical routes pre-cached
- [ ] Cache size limits set
- [ ] All resource types covered
- [ ] Strategy tested for each type

---

## Task 33: Implement Background Sync Registration

### Overview
Integrate Background Sync API to queue sync operations when offline and automatically retry when network connectivity is restored.

### Dependencies
- Task 31: Create Service Worker Setup
- Task 24: Create Transactions Object Store

### Instructions

1. **Update Service Worker with Background Sync**
   - Import Workbox Background Sync module
   - Configure sync queue
   - Handle sync events

2. **Create sync queue configuration**
   - Queue name: 'pos-sync-queue'
   - Max retry attempts: 5
   - Retry delay: Exponential backoff
   - Broadcast channel for status updates

3. **Implement transaction sync registration**
   - Register sync event when transaction created offline
   - Tag: 'sync-transactions'
   - Store pending transactions count
   - Notify user of queued transactions

4. **Create registerBackgroundSync method**
   - Accept tag parameter (e.g., 'sync-transactions')
   - Check if Background Sync API supported
   - Register sync event with Service Worker
   - Handle registration failure gracefully

5. **Implement Service Worker sync event handler**
   - Listen for 'sync' event in Service Worker
   - Check event tag
   - Retrieve pending transactions from IndexedDB
   - Send transactions to server API
   - Update sync status based on response

6. **Add sync success handling**
   - Mark transaction as synced
   - Store server_id
   - Update synced_at timestamp
   - Remove from sync queue
   - Broadcast success event to clients

7. **Add sync failure handling**
   - Increment sync_attempts counter
   - Store error message
   - Mark as failed if max attempts exceeded
   - Schedule retry for transient failures
   - Broadcast failure event to clients

8. **Implement sync status broadcasting**
   - Use Broadcast Channel API
   - Send sync progress updates
   - Send success/failure notifications
   - Update UI based on sync status

9. **Create manual sync trigger**
   - Allow user to manually trigger sync
   - Check for pending transactions
   - Register Background Sync if supported
   - Fallback to immediate sync if not supported

10. **Add periodic background sync (optional)**
    - Register for periodic sync (if supported)
    - Interval: 12 hours
    - Sync cache data in background
    - Only when on WiFi and charging

11. **Implement sync queue visualization**
    - Show pending sync count in UI
    - Show last sync attempt time
    - Show sync errors if any
    - Provide retry button

12. **Add network status detection**
    - Listen for online/offline events
    - Trigger sync when coming back online
    - Update UI to show connectivity status
    - Provide fallback for unsupported browsers

13. **Export Background Sync utilities**
    - Export registration functions
    - Export status checking functions
    - Export TypeScript interfaces

### Background Sync API Feature Detection
```typescript
const isBackgroundSyncSupported = () => {
  return 'serviceWorker' in navigator && 
         'sync' in ServiceWorkerRegistration.prototype;
};

const isPeriodicSyncSupported = () => {
  return 'serviceWorker' in navigator && 
         'periodicSync' in ServiceWorkerRegistration.prototype;
};
```

### Background Sync Registration Flow
```
Transaction Created Offline
    ↓
Store in IndexedDB
    ↓
Check Background Sync Support?
    ↓ Yes
Register Sync Event
    (tag: 'sync-transactions')
    ↓
User sees "Queued for Sync"
    ↓
Network Restored
    ↓
Browser triggers 'sync' event
    ↓
Service Worker handles sync
    ↓
Retrieve pending transactions
    ↓
Send to Server API
    ↓
Success? ─────No──────┐
    ↓ Yes               │
Mark as Synced      Increment retry count
    ↓                   │
Update UI           Failed? ─No─┐
                        │ Yes    │
                    Mark Failed │
                        │        │
                        └────────┘
                      Schedule Retry
```

### Service Worker Sync Handler
```javascript
// In service-worker/sw.js
self.addEventListener('sync', async (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncPendingTransactions());
  }
});

async function syncPendingTransactions() {
  // 1. Open IndexedDB
  // 2. Get pending transactions
  // 3. For each transaction:
  //    - Send to /api/pos/transactions/
  //    - On success: mark synced
  //    - On failure: increment attempts
  // 4. Broadcast results to clients
}
```

### Broadcast Channel Messages
```typescript
type SyncMessage = {
  type: 'sync-started' | 'sync-progress' | 'sync-complete' | 'sync-failed',
  entity: 'transactions' | 'data',
  progress?: number,
  total?: number,
  error?: string
};

// Sending from SW
const channel = new BroadcastChannel('pos-sync-channel');
channel.postMessage({
  type: 'sync-complete',
  entity: 'transactions',
  total: 5
});

// Receiving in app
const channel = new BroadcastChannel('pos-sync-channel');
channel.onmessage = (event) => {
  const msg = event.data as SyncMessage;
  // Update UI based on message
};
```

### Sync Queue Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Queue Name | pos-sync-queue | Workbox queue name |
| Max Retries | 5 | Maximum retry attempts |
| Initial Retry Delay | 1 minute | First retry delay |
| Max Retry Delay | 1 hour | Maximum retry delay |
| Backoff Multiplier | 2 | Exponential backoff factor |

### Expected Outcome
```
frontend/
├── lib/
│   └── offline/
│       ├── service-worker.ts  # Updated with sync registration
│       └── sync-manager.ts    # Background sync utilities
├── public/
│   └── sw.js                  # Updated with sync handlers
└── service-worker/
    └── sw.js                  # Updated with sync event listener
```

### Verification Checklist
- [ ] Background Sync API support detection
- [ ] Sync queue configuration implemented
- [ ] Transaction sync registration implemented
- [ ] Service Worker sync event handler implemented
- [ ] Sync success handling implemented
- [ ] Sync failure handling implemented
- [ ] Sync status broadcasting implemented
- [ ] Manual sync trigger implemented
- [ ] Sync queue visualization implemented
- [ ] Network status detection implemented
- [ ] Fallback for unsupported browsers
- [ ] Broadcast Channel for status updates

---

## Task 34: Create Cache Warmup on Login

### Overview
Implement automatic cache warmup when user logs into POS terminal, pre-loading critical data for optimal offline performance.

### Dependencies
- Task 26: Create Cache Population Service
- Task 31: Create Service Worker Setup
- Task 32: Define Cache Strategies

### Instructions

1. **Create cache warmup hook**
   - Create `frontend/hooks/useCacheWarmup.ts`
   - Use React hook for lifecycle management
   - Trigger warmup after successful login

2. **Define warmup priority tiers**
   - Tier 1 (Critical): Tax rates, terminal settings, payment methods
   - Tier 2 (High): Active products, categories, quick buttons
   - Tier 3 (Medium): Recent customers, price lists
   - Tier 4 (Low): Product images, category images

3. **Implement startWarmup method**
   - Accept terminal_id parameter
   - Show warmup progress indicator
   - Execute tiers sequentially
   - Report progress to user

4. **Create Tier 1 warmup (Critical Settings)**
   - Fetch and cache terminal settings
   - Fetch and cache tax rates
   - Fetch and cache payment methods
   - Must complete before allowing POS use

5. **Create Tier 2 warmup (Active Products)**
   - Fetch active products for terminal
   - Limit to frequently sold items
   - Fetch categories for navigation
   - Fetch quick button configurations
   - Allow POS use after tier 2

6. **Create Tier 3 warmup (Customer Data)**
   - Fetch recent customers (last 90 days)
   - Fetch VIP customers (Gold/Silver tier)
   - Run in background while POS is usable

7. **Create Tier 4 warmup (Media Assets)**
   - Fetch product images for cached products
   - Fetch category images
   - Use Service Worker to cache images
   - Lowest priority, happens in background

8. **Implement progress tracking**
   - Track items completed per tier
   - Calculate overall percentage
   - Show progress bar in UI
   - Provide cancel option

9. **Add warmup state management**
   - Status: not-started, in-progress, completed, failed
   - Current tier being warmed
   - Items completed / total items
   - Errors encountered
   - Estimated time remaining

10. **Create warmup result storage**
    - Store warmup completion timestamp
    - Store items cached per tier
    - Store any errors or warnings
    - Use for diagnostics

11. **Implement smart warmup scheduling**
    - Full warmup on first login of day
    - Incremental warmup on subsequent logins
    - Check last warmup timestamp
    - Skip if warmup completed recently

12. **Add background warmup**
    - Continue warmup while user works
    - Pause warmup during active transactions
    - Resume warmup when idle
    - Use requestIdleCallback for scheduling

13. **Create warmup retry logic**
    - Retry failed items up to 3 times
    - Skip items that repeatedly fail
    - Continue warmup despite failures
    - Report failed items at end

14. **Implement warmup cancellation**
    - Allow user to cancel warmup
    - Continue with cached data available
    - Resume warmup later if needed

15. **Add warmup metrics**
    - Track warmup duration
    - Track items cached
    - Track data size downloaded
    - Send metrics to analytics

16. **Export warmup hook and utilities**
    - Export useCacheWarmup hook
    - Export warmup status types
    - Export TypeScript interfaces

### Warmup Priority Tiers

| Tier | Priority | Items | Blocking | Estimated Time |
|------|----------|-------|----------|----------------|
| 1 | Critical | Settings, tax rates, payment methods | Yes | 5 seconds |
| 2 | High | Products (500), categories (100), quick buttons | Yes | 15 seconds |
| 3 | Medium | Customers (1000), price lists | No | 20 seconds |
| 4 | Low | Product images (500), category images (50) | No | 60 seconds |

### Warmup State Machine
```
Not Started
    ↓
Start Warmup
    ↓
Tier 1 (Critical)
    ↓
Tier 1 Complete?
    ↓ Yes
Enable POS (Limited)
    ↓
Tier 2 (High)
    ↓
Tier 2 Complete?
    ↓ Yes
Enable POS (Full)
    ↓
Tier 3 (Medium) - Background
    ↓
Tier 4 (Low) - Background
    ↓
Warmup Complete
```

### Warmup Progress Structure
```typescript
type WarmupProgress = {
  status: 'not-started' | 'in-progress' | 'completed' | 'failed',
  current_tier: number,
  tiers: {
    tier: number,
    name: string,
    status: 'pending' | 'in-progress' | 'completed' | 'failed',
    items_total: number,
    items_completed: number,
    errors: string[]
  }[],
  overall_progress: number, // 0-100
  started_at?: string,
  completed_at?: string,
  duration_ms?: number
};
```

### Smart Warmup Logic
```typescript
async function shouldPerformFullWarmup(): Promise<boolean> {
  const lastWarmup = await getLastWarmupTimestamp();
  
  if (!lastWarmup) {
    return true; // Never warmed up
  }
  
  const hoursSinceWarmup = (Date.now() - lastWarmup) / (1000 * 60 * 60);
  
  if (hoursSinceWarmup > 8) {
    return true; // More than 8 hours ago
  }
  
  // Check if critical data is still fresh
  const settingsStale = await isEntityStale('settings');
  const productsStale = await isEntityStale('products');
  
  return settingsStale || productsStale;
}
```

### Expected Outcome
```
frontend/
├── hooks/
│   └── useCacheWarmup.ts      # Cache warmup React hook
├── lib/
│   └── offline/
│       ├── service-worker.ts
│       ├── cache-service.ts   # Used by warmup
│       └── warmup-manager.ts  # Warmup orchestration
└── components/
    └── pos/
        └── WarmupProgress.tsx # Warmup UI component
```

### Verification Checklist
- [ ] Cache warmup hook created
- [ ] Warmup priority tiers defined
- [ ] Tier 1 warmup (critical) implemented
- [ ] Tier 2 warmup (products) implemented
- [ ] Tier 3 warmup (customers) implemented
- [ ] Tier 4 warmup (images) implemented
- [ ] Progress tracking implemented
- [ ] Warmup state management implemented
- [ ] Smart warmup scheduling implemented
- [ ] Background warmup implemented
- [ ] Retry logic implemented
- [ ] Cancellation support implemented
- [ ] Warmup metrics tracking implemented
- [ ] UI progress indicator created
- [ ] Blocking vs non-blocking tiers respected

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 31 | Create Service Worker Setup | `service-worker.ts`, `sw.js` - SW registration |
| 32 | Define Cache Strategies | Cache strategies for all resource types |
| 33 | Implement Background Sync Registration | Background Sync for offline transactions |
| 34 | Create Cache Warmup on Login | `useCacheWarmup.ts` - Automatic cache population |

### Final Group B Directory Structure
```
frontend/
├── hooks/
│   └── useCacheWarmup.ts          # Cache warmup hook
├── lib/
│   └── offline/
│       ├── indexeddb.ts           # IndexedDB wrapper
│       ├── schema.ts              # Database schema
│       ├── versioning.ts          # Version tracking
│       ├── cache-service.ts       # Cache population
│       ├── cache-manager.ts       # Size management
│       ├── service-worker.ts      # SW registration
│       ├── sync-manager.ts        # Background sync
│       ├── warmup-manager.ts      # Warmup orchestration
│       ├── utils.ts               # Utilities
│       └── stores/
│           ├── products.ts        # Products store
│           ├── categories.ts      # Categories store
│           ├── customers.ts       # Customers store
│           ├── settings.ts        # Settings store
│           └── transactions.ts    # Transactions store
├── public/
│   ├── sw.js                      # Generated Service Worker
│   └── offline.html               # Offline fallback
└── service-worker/
    └── sw.js                      # SW source with strategies
```

### Cache Strategies Summary

| Resource | Strategy | Purpose |
|----------|----------|---------|
| Static Assets | Cache First | Fast load, rarely changes |
| API Responses | Network First (3s) | Fresh data when online |
| Product Images | Stale While Revalidate | Fast display, background update |
| Offline Fallback | Cache First | Always available |

### Background Sync Features

| Feature | Purpose |
|---------|---------|
| Automatic Retry | Sync when network restored |
| Exponential Backoff | Reduce server load |
| Status Broadcasting | Update UI in real-time |
| Manual Trigger | User-initiated sync |
| Queue Visualization | Show pending syncs |

### Cache Warmup Tiers

1. **Tier 1 (Blocking):** Settings, tax rates - 5 seconds
2. **Tier 2 (Blocking):** Products, categories - 15 seconds
3. **Tier 3 (Background):** Customers - 20 seconds
4. **Tier 4 (Background):** Images - 60 seconds

### Group B Completion Status
All 18 tasks (17-34) in Group B are now complete. Local data caching infrastructure is fully implemented with:
- ✅ IndexedDB service and all object stores
- ✅ Data versioning and incremental sync
- ✅ Cache size management and invalidation
- ✅ Service Worker with cache strategies
- ✅ Background Sync for offline transactions
- ✅ Automatic cache warmup on login

### Next Steps
Proceed to [../Group-C_Transaction-Queue-Management/](../Group-C_Transaction-Queue-Management/) to implement transaction queuing and conflict resolution for offline sales.

---

## Notes for AI Agents

1. **Execution Order:** Task 31 first, then 32, then 33 and 34 can be parallel
2. **No Code Generation:** These are instructions only; implementation is developer's responsibility
3. **Service Worker Scope:** Must be at root to intercept all requests
4. **Background Sync:** Feature detection required; provide fallback
5. **Cache Strategies:** Different strategies for different resource types
6. **Warmup Blocking:** Tiers 1-2 must complete before POS is usable
7. **Progress UX:** Show clear progress during warmup to manage expectations
8. **Browser Support:** Test on all target browsers (Chrome, Edge, Safari)
9. **Testing:** Test with DevTools offline mode and slow network
10. **Fallbacks:** Provide graceful degradation for unsupported features
