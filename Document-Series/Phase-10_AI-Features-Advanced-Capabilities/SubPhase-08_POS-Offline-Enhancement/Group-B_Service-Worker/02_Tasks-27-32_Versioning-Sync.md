# Tasks 27-32: Versioning and Sync

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** B - Service Worker  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-26_Workbox-Caching.md](01_Tasks-17-26_Workbox-Caching.md)
- **→ Next Group:** [Group-C_Offline-Manager](../Group-C_Offline-Manager/)

---

## Document Overview

This document covers advanced Service Worker features including cache versioning strategies, expiration policies, size limits, background synchronization for offline actions, and push notification handling. These features ensure efficient cache management, data synchronization when connectivity is restored, and real-time updates via push notifications.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create Cache Versioning | Low | 25 min |
| 28 | Create Cache Expiry | Low | 30 min |
| 29 | Create Cache Size Limit | Low | 25 min |
| 30 | Create Background Sync | Medium | 45 min |
| 31 | Create Push Handler | Medium | 40 min |
| 32 | Verify Service Worker | Low | 30 min |

---

## Task 27: Create Cache Versioning

### Overview
Implement a cache versioning system that allows controlled updates and migration of cached resources. Cache versioning ensures that when the application is updated, old cached resources are properly removed and new versions are cached, preventing stale content from being served.

### Dependencies
- Task 26: Create Offline Fallback

### Instructions

1. **Define version constant**
   - Create CACHE_VERSION constant in sw.js
   - Use semantic versioning (e.g., 'v1', 'v2')
   - Or use build timestamp
   - This drives all cache names

2. **Create cache name generator function**
   - Define function to build cache names
   - Append version to base name
   - Example: cacheName('api') → 'api-cache-v1'

3. **Update all cache names to use version**
   - Precache: `precache-v${CACHE_VERSION}`
   - API cache: `api-cache-v${CACHE_VERSION}`
   - Static cache: `static-cache-v${CACHE_VERSION}`
   - Image cache: `image-cache-v${CACHE_VERSION}`

4. **Implement version comparison logic**
   - Compare old and new versions in activate handler
   - Identify outdated caches by version suffix
   - Delete only old versions, keep current

5. **Create cache migration helper**
   - Optional: migrate important data between versions
   - Copy critical entries from old to new cache
   - Useful for API responses

6. **Update activate handler for versioning**
   - Get all cache names
   - Parse version from each name
   - Delete caches with old versions

7. **Document version update process**
   - When to increment version
   - How to test version updates
   - Rollback considerations

8. **Handle version in registration**
   - Consider updateViaCache: 'none'
   - Force check for new SW on page load
   - Prompt user about updates

9. **Add version to SW file comment**
   - Include version number in sw.js header
   - Helps with debugging
   - Visible in DevTools

10. **Test version update flow**
    - Deploy v1
    - Deploy v2
    - Verify old caches deleted
    - Verify new caches created

### Cache Versioning Flow

```
Deploy New Version (v1 → v2)
           │
           ▼
┌─────────────────────────┐
│  New SW Installs        │
│  • Install handler runs │
│  • Caches with v2       │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  New SW Activates       │
│  • Activate handler runs│
│  • Checks cache versions│
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Delete Old Caches      │
│  • precache-v1 → DELETE │
│  • api-cache-v1 → DELETE│
│  • static-v1 → DELETE   │
│  • image-v1 → DELETE    │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Keep New Caches        │
│  • precache-v2 → KEEP   │
│  • api-cache-v2 → KEEP  │
│  • static-v2 → KEEP     │
│  • image-v2 → KEEP      │
└─────────────────────────┘
           │
           ▼
    Version Update Complete
```

### Version Naming Strategies

| Strategy | Format | Example | Use Case |
|----------|--------|---------|----------|
| Simple Counter | v{n} | v1, v2, v3 | Manual increments |
| Semantic | v{major}.{minor} | v1.0, v1.1 | Feature versions |
| Timestamp | v{timestamp} | v20260131 | Automated builds |
| Git Hash | v{hash} | v1a2b3c4 | CI/CD pipelines |

### Cache Version Mapping

| Cache Type | Base Name | Versioned Name |
|------------|-----------|----------------|
| Precache | precache | precache-v1 |
| API | api-cache | api-cache-v1 |
| Static | static-cache | static-cache-v1 |
| Images | image-cache | image-cache-v1 |

### Version Update Triggers

| Event | Action | Reason |
|-------|--------|--------|
| Code deploy | Increment version | New features |
| Bug fix | Increment version | Fix cached bugs |
| Schema change | Increment version | API changes |
| Asset update | Increment version | New static files |

### Version Comparison Logic

```
Activate Handler:
├── Get all cache names: ['precache-v1', 'api-cache-v1', 'api-cache-v2']
├── Current version: 'v2'
├── Filter old versions:
│   ├── precache-v1 → OLD (delete)
│   ├── api-cache-v1 → OLD (delete)
│   └── api-cache-v2 → CURRENT (keep)
└── Delete old caches
```

### Expected Outcome
- Cache version constant defined
- All cache names include version
- Activate handler deletes old versions
- Smooth version transition process

### Verification Checklist
- [ ] CACHE_VERSION constant defined
- [ ] Cache name generator function created
- [ ] All caches use versioned names
- [ ] Activate handler checks versions
- [ ] Old caches deleted on activate
- [ ] Version documented in SW file
- [ ] Version update tested
- [ ] No stale caches remain

---

## Task 28: Create Cache Expiry

### Overview
Implement cache expiration policies using Workbox ExpirationPlugin to automatically remove stale entries based on time-to-live (TTL) values. Different resource types have different freshness requirements, so each cache needs appropriate expiry settings.

### Dependencies
- Task 27: Create Cache Versioning

### Instructions

1. **Import ExpirationPlugin**
   - Import from workbox-expiration
   - Already imported in Task 22
   - Verify import exists

2. **Define expiry policies per cache type**
   - API cache: 1 hour (3600 seconds)
   - Static cache: 30 days (2592000 seconds)
   - Image cache: 7 days (604800 seconds)
   - Precache: No expiry (permanent)

3. **Update API cache strategy with expiry**
   - Add ExpirationPlugin to API strategy
   - Set maxAgeSeconds to 3600
   - API data expires quickly

4. **Update static cache strategy with expiry**
   - Add ExpirationPlugin to static strategy
   - Set maxAgeSeconds to 2592000
   - Static assets rarely change

5. **Update image cache strategy with expiry**
   - Add ExpirationPlugin to image strategy
   - Set maxAgeSeconds to 604800
   - Images update occasionally

6. **Implement purge on quota exceeded**
   - ExpirationPlugin auto-purges when quota exceeded
   - Oldest entries deleted first
   - Prevents storage errors

7. **Add manual purge function**
   - Create function to manually clear expired entries
   - Useful for testing and maintenance
   - Call from message handler

8. **Monitor expiry effectiveness**
   - Track cache hit rates
   - Adjust TTLs based on usage
   - Balance freshness vs performance

9. **Handle clock skew**
   - Use maxAgeSeconds, not absolute dates
   - Relative time more reliable
   - Handles user clock changes

10. **Document expiry policies**
    - Document TTL for each cache
    - Explain rationale
    - Note how to adjust

### Cache Expiry Timeline

```
Cache Entry Lifecycle
       │
       ▼
┌──────────────┐
│ Entry Added  │ ← Timestamp recorded
│ to Cache     │
└──────────────┘
       │
       ▼
    Time Passes
       │
  ┌────┴─────┬──────────┬────────┐
  │          │          │        │
  ▼          ▼          ▼        ▼
1 hour     7 days    30 days   Forever
  │          │          │        │
  ▼          ▼          ▼        ▼
API        Images    Static   Precache
Expires    Expire    Expires   (Never)
  │          │          │
  ▼          ▼          ▼
Entry      Entry     Entry
Deleted    Deleted   Deleted
```

### Expiry Policy Matrix

| Cache Type | TTL | Seconds | Rationale |
|------------|-----|---------|-----------|
| API | 1 hour | 3600 | Data changes frequently |
| Static | 30 days | 2592000 | Versioned, immutable |
| Images | 7 days | 604800 | Update occasionally |
| Precache | Never | - | Critical for offline |

### ExpirationPlugin Configuration

| Cache | maxAgeSeconds | maxEntries | Purge Order |
|-------|---------------|------------|-------------|
| API | 3600 | 100 | LRU (Least Recently Used) |
| Static | 2592000 | 60 | LRU |
| Images | 604800 | 500 | LRU |

### Expiry Check Timing

| Trigger | Action | Purpose |
|---------|--------|---------|
| On cache read | Check age | Serve fresh data |
| On cache write | Cleanup old | Prevent bloat |
| On quota exceeded | Purge oldest | Free space |
| Manual call | Full cleanup | Maintenance |

### Time Calculations

```
Current Time: 2026-01-31 10:00:00
Entry Cached: 2026-01-31 09:00:00
Age: 1 hour (3600 seconds)

API Cache (TTL: 1 hour):
  Age (3600) >= maxAge (3600) → EXPIRED ✓

Image Cache (TTL: 7 days):
  Age (3600) < maxAge (604800) → FRESH ✓

Static Cache (TTL: 30 days):
  Age (3600) < maxAge (2592000) → FRESH ✓
```

### Manual Purge Function

```
Message Handler in SW:
├── Receive message: { type: 'PURGE_EXPIRED' }
├── Iterate all caches
├── For each cache:
│   ├── Get all entries
│   ├── Check age
│   └── Delete if expired
└── Send response: { purged: 15 entries }
```

### Expected Outcome
- Expiry policies configured for all caches
- Old entries automatically deleted
- Cache storage stays within limits
- Fresh data served when possible

### Verification Checklist
- [ ] ExpirationPlugin imported
- [ ] API cache has 1-hour expiry
- [ ] Static cache has 30-day expiry
- [ ] Image cache has 7-day expiry
- [ ] maxAgeSeconds set for each cache
- [ ] Expiry policies documented
- [ ] Manual purge function created (optional)
- [ ] Expiry tested with old entries

---

## Task 29: Create Cache Size Limit

### Overview
Implement cache size limits to prevent excessive storage usage using Workbox ExpirationPlugin's maxEntries option. Size limits ensure the application doesn't consume too much storage, which could impact device performance or cause quota errors.

### Dependencies
- Task 28: Create Cache Expiry

### Instructions

1. **Review ExpirationPlugin maxEntries**
   - Already imported and used
   - Verify maxEntries set for each cache
   - This is the primary size limiting mechanism

2. **Set API cache entry limit**
   - Configure maxEntries to 100
   - Limits cached API responses
   - Oldest entries auto-deleted

3. **Set static cache entry limit**
   - Configure maxEntries to 60
   - Limits JavaScript/CSS files
   - Enough for typical app

4. **Set image cache entry limit**
   - Configure maxEntries to 500
   - Limits product images
   - Balances offline capability vs storage

5. **Calculate estimated storage usage**
   - API: 100 entries × ~10KB = ~1MB
   - Static: 60 entries × ~100KB = ~6MB
   - Images: 500 entries × ~50KB = ~25MB
   - Total: ~32MB estimate

6. **Monitor actual storage usage**
   - Use StorageManager API to check usage
   - Implement storage monitoring function
   - Log storage metrics

7. **Implement quota exceeded handler**
   - Catch QuotaExceededError
   - Trigger cache cleanup
   - Alert user if persistent

8. **Create storage status function**
   - Query navigator.storage.estimate()
   - Calculate percentage used
   - Return storage info

9. **Add storage warning threshold**
   - Warn when 80% storage used
   - Suggest cache cleanup
   - Prevent quota errors

10. **Implement emergency cleanup**
    - When quota exceeded:
    - Reduce maxEntries temporarily
    - Purge oldest entries aggressively
    - Restore normal limits when space available

### Storage Limit Architecture

```
┌──────────────────────────────────────────┐
│         Browser Storage Quota            │
│         (e.g., 500MB available)          │
├──────────────────────────────────────────┤
│                                          │
│  Service Worker Caches (Target: 32MB)   │
│  ┌────────────────────────────────────┐ │
│  │  API Cache (max 100 entries)      │ │
│  │  ≈ 1MB                             │ │
│  ├────────────────────────────────────┤ │
│  │  Static Cache (max 60 entries)    │ │
│  │  ≈ 6MB                             │ │
│  ├────────────────────────────────────┤ │
│  │  Image Cache (max 500 entries)    │ │
│  │  ≈ 25MB                            │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Other Storage (IndexedDB, localStorage) │
│                                          │
└──────────────────────────────────────────┘
```

### Cache Size Limits

| Cache Type | maxEntries | Avg Entry Size | Total Size |
|------------|------------|----------------|------------|
| API | 100 | 10 KB | ~1 MB |
| Static | 60 | 100 KB | ~6 MB |
| Images | 500 | 50 KB | ~25 MB |
| **Total** | **660** | - | **~32 MB** |

### Storage Monitoring

| Metric | Source | Purpose |
|--------|--------|---------|
| Total quota | navigator.storage.estimate() | Max available |
| Used | navigator.storage.estimate() | Current usage |
| Percentage | (used / quota) × 100 | Warning trigger |
| Cache count | caches.keys().length | Number of caches |

### Entry Eviction Policy

```
Cache Full (maxEntries reached)
           │
           ▼
┌─────────────────────────┐
│  New Entry Added        │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Sort by Last Used      │
│  (LRU - Least Recently) │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Delete Oldest Entry    │
│  Make room for new      │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Add New Entry          │
│  Cache stays at limit   │
└─────────────────────────┘
```

### Storage Monitoring Function Structure

```
checkStorageStatus()
├── navigator.storage.estimate()
├── Calculate:
│   ├── quota (total available)
│   ├── usage (currently used)
│   └── percentage (usage/quota × 100)
├── Check thresholds:
│   ├── < 50%: OK
│   ├── 50-80%: Warning
│   └── > 80%: Critical
└── Return status object
```

### Quota Exceeded Handling

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Catch QuotaExceededError | Detect issue |
| 2 | Reduce maxEntries by 50% | Free space |
| 3 | Trigger expiration cleanup | Remove old entries |
| 4 | Retry operation | Complete original request |
| 5 | Monitor storage | Check if resolved |
| 6 | Restore normal limits | When space available |

### Storage Warning Levels

| Level | Usage | Action | Message |
|-------|-------|--------|---------|
| Normal | 0-50% | None | - |
| Warning | 50-80% | Log warning | "Cache storage: 65% used" |
| Critical | 80-95% | Reduce caching | "Cache storage critical" |
| Error | >95% | Emergency cleanup | "Storage quota exceeded" |

### Expected Outcome
- Cache size limits configured for all caches
- Oldest entries auto-deleted when limit reached
- Storage usage monitored
- Quota errors handled gracefully

### Verification Checklist
- [ ] maxEntries set for API cache (100)
- [ ] maxEntries set for static cache (60)
- [ ] maxEntries set for image cache (500)
- [ ] Storage monitoring function created
- [ ] Storage usage calculation correct
- [ ] Quota exceeded handler implemented
- [ ] Warning thresholds defined
- [ ] Emergency cleanup function created

---

## Task 30: Create Background Sync

### Overview
Implement Background Sync API using Workbox BackgroundSyncPlugin to queue failed requests and automatically retry them when network connectivity is restored. This is critical for POS offline functionality, ensuring sales and transactions created offline are eventually synced to the server.

### Dependencies
- Task 29: Create Cache Size Limit

### Instructions

1. **Install workbox-background-sync**
   - May already be included in Workbox
   - Verify package.json
   - Install if needed

2. **Import BackgroundSyncPlugin**
   - Import from workbox-background-sync
   - Import in sw.js
   - Import Queue class

3. **Create sync queue for POST requests**
   - Instantiate Queue with name 'post-queue'
   - Configure maxRetentionTime to 24 hours
   - Failed POSTs go here

4. **Add BackgroundSyncPlugin to API strategy**
   - Add to NetworkFirst strategy for API
   - Specify queue name
   - Only applies to failed requests

5. **Configure sync options**
   - Set maxRetentionTime: 24 * 60 * 60 * 1000 (24 hours)
   - After 24 hours, request dropped
   - Prevents stale transaction attempts

6. **Implement sync event handler**
   - Listen for 'sync' event
   - Check event.tag matches queue name
   - Replay queued requests

7. **Handle successful sync**
   - Process each queued request
   - Mark as synced in IndexedDB
   - Update UI via postMessage

8. **Handle failed sync**
   - Retry on next sync event
   - Limit retry attempts (optional)
   - Log persistent failures

9. **Add sync queue monitoring**
   - Create function to check queue size
   - Expose via message handler
   - Show sync status in UI

10. **Register sync for specific events**
    - Queue offline sales
    - Queue offline inventory updates
    - Queue offline order modifications

11. **Implement manual sync trigger**
    - Allow user to trigger sync
    - Use registration.sync.register()
    - Useful after connectivity restored

12. **Add sync status notifications**
    - Show notification when sync starts
    - Show success/failure notifications
    - Update badge count

### Background Sync Flow

```
User Creates Sale (Offline)
           │
           ▼
┌─────────────────────────┐
│  POST /api/sales        │
│  Network fails          │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  BackgroundSyncPlugin   │
│  Captures failed request│
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Add to Sync Queue      │
│  Queue: 'post-queue'    │
│  Retry: in background   │
└─────────────────────────┘
           │
           ▼
    Wait for connectivity
           │
           ▼
┌─────────────────────────┐
│  Network Restored       │
│  'sync' event fires     │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Replay Queued Requests │
│  POST /api/sales        │
│  Status: 201 Created    │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Remove from Queue      │
│  Notify UI: Success     │
│  Update IndexedDB       │
└─────────────────────────┘
```

### Sync Queue Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| name | 'post-queue' | Queue identifier |
| maxRetentionTime | 24 hours | Drop after 24h |
| onSync | Replay handler | Process queue |
| forceSyncFallback | true | Fallback for unsupported browsers |

### Request Types to Sync

| Request Type | Queue | Priority | Retention |
|--------------|-------|----------|-----------|
| POST /api/sales | post-queue | High | 24 hours |
| PUT /api/inventory | post-queue | High | 24 hours |
| POST /api/orders | post-queue | High | 24 hours |
| DELETE /api/items | post-queue | Medium | 12 hours |

### Sync Event Handler Structure

```
'sync' event received
├── Check event.tag === 'post-queue'
├── Get queue: Queue.get('post-queue')
├── Replay all queued requests:
│   ├── Request 1: POST /api/sales
│   │   ├── Replay → Success (201)
│   │   └── Remove from queue
│   ├── Request 2: POST /api/sales
│   │   ├── Replay → Success (201)
│   │   └── Remove from queue
│   └── Request 3: PUT /api/inventory
│       ├── Replay → Fail (500)
│       └── Keep in queue, retry later
└── Event complete
```

### Sync Queue States

| State | Description | Action |
|-------|-------------|--------|
| Pending | In queue, waiting | Wait for sync |
| Syncing | Currently replaying | Show progress |
| Success | Synced to server | Remove from queue |
| Failed | Replay failed | Retry later |
| Expired | > 24 hours old | Drop from queue |

### Manual Sync Trigger

```
User clicks "Sync Now" button
           │
           ▼
App calls: registration.sync.register('post-queue')
           │
           ▼
Browser triggers 'sync' event
           │
           ▼
Service Worker replays queue
           │
           ▼
UI updated with results
```

### Sync Status Monitoring

| Metric | Source | Display |
|--------|--------|---------|
| Queue size | Queue.size() | "3 items pending" |
| Last sync | localStorage | "Synced 5 min ago" |
| Sync status | SW message | Badge/indicator |
| Failed count | Queue failed items | "2 items failed" |

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Fallback |
|---------|--------|---------|--------|----------|
| Background Sync | Yes | No | No | Force sync on online |
| Sync event | Yes | No | No | Manual trigger |
| Queue API | Yes | Yes | Yes | Workbox Queue |

### Expected Outcome
- Background sync configured
- Failed requests queued automatically
- Requests replay when online
- Sync status visible to user

### Verification Checklist
- [ ] workbox-background-sync installed
- [ ] BackgroundSyncPlugin imported
- [ ] Sync queue created (post-queue)
- [ ] BackgroundSyncPlugin added to API strategy
- [ ] maxRetentionTime set to 24 hours
- [ ] Sync event handler implemented
- [ ] Queue monitoring function created
- [ ] Manual sync trigger implemented
- [ ] Sync notifications implemented
- [ ] Fallback for unsupported browsers

---

## Task 31: Create Push Handler

### Overview
Implement push notification handling in the Service Worker to receive and display server-sent notifications. Push notifications enable real-time updates like order confirmations, low stock alerts, and system messages even when the app is not open.

### Dependencies
- Task 30: Create Background Sync

### Instructions

1. **Add push event listener**
   - Listen for 'push' event in sw.js
   - Fires when push notification received
   - Even if browser closed

2. **Parse push event data**
   - Extract data from event.data
   - Use event.data.json() for JSON payload
   - Use event.data.text() for text payload

3. **Define notification payload structure**
   - Title: notification headline
   - Body: notification message
   - Icon: app icon path
   - Badge: small monochrome icon
   - Data: custom data payload

4. **Implement showNotification**
   - Use self.registration.showNotification()
   - Pass title and options
   - Returns promise

5. **Configure notification options**
   - icon: '/icons/icon-192.png'
   - badge: '/icons/badge-72.png'
   - vibrate: [200, 100, 200] for mobile
   - tag: for notification grouping
   - requireInteraction: for important alerts

6. **Add notification actions**
   - Define action buttons (View, Dismiss)
   - Each action has action ID and title
   - User can click action

7. **Implement notificationclick handler**
   - Listen for 'notificationclick' event
   - Check which action clicked
   - Open URL or perform action

8. **Handle notification close**
   - Listen for 'notificationclose' event
   - Track dismissals
   - Update analytics (optional)

9. **Implement notification types**
   - Order notification: opens order page
   - Alert notification: opens alerts page
   - Message notification: opens messages

10. **Add notification permission check**
    - Not in SW, but coordinate with app
    - App must request permission first
    - Check Notification.permission

11. **Implement notification badge count**
    - Use Badge API if available
    - Update badge on push
    - Clear on notification click

12. **Test push notifications**
    - Use browser DevTools to trigger push
    - Test with actual push server
    - Test on mobile devices

### Push Notification Flow

```
Server Sends Push
           │
           ▼
┌─────────────────────────┐
│  Push Service           │
│  (Browser provider)     │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Service Worker         │
│  'push' event fires     │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Parse Payload          │
│  { title, body, data }  │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Show Notification      │
│  Display to user        │
└─────────────────────────┘
           │
           ▼
     User Action?
      ┌────┴────┐
      │         │
    Click    Dismiss
      │         │
      ▼         ▼
   Open URL   Close
    (App)   (Track)
```

### Push Payload Structure

| Field | Type | Required | Example |
|-------|------|----------|---------|
| title | string | Yes | "New Order #1234" |
| body | string | Yes | "Order received from Customer" |
| icon | string | No | "/icons/icon-192.png" |
| badge | string | No | "/icons/badge-72.png" |
| data | object | No | { orderId: 1234, type: 'order' } |
| tag | string | No | "order-1234" |

### Notification Options

| Option | Type | Purpose | Example |
|--------|------|---------|---------|
| icon | string | Large icon | '/icons/icon-192.png' |
| badge | string | Small icon | '/icons/badge-72.png' |
| vibrate | number[] | Vibration pattern | [200, 100, 200] |
| tag | string | Grouping | 'order-notifications' |
| requireInteraction | boolean | Stay visible | true (for critical) |
| actions | array | Button actions | [{ action: 'view', title: 'View' }] |
| silent | boolean | No sound | false |
| renotify | boolean | Notify again | true |

### Notification Actions

| Action | Title | Purpose |
|--------|-------|---------|
| view | "View" | Open related page |
| dismiss | "Dismiss" | Close notification |
| reply | "Reply" | Open reply form (if applicable) |

### Notification Types and Handlers

| Type | Icon | Action | Target URL |
|------|------|--------|------------|
| order | 🛒 | View Order | /orders/{id} |
| alert | ⚠️ | View Alert | /alerts/{id} |
| message | 💬 | View Message | /messages/{id} |
| inventory | 📦 | View Item | /inventory/{id} |

### Notification Click Handler

```
'notificationclick' event received
           │
           ▼
┌─────────────────────────┐
│  Get notification data  │
│  { type, id, url }      │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Close notification     │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Check action clicked   │
│  'view' or 'dismiss'?   │
└─────────────────────────┘
           │
      ┌────┴────┐
      │         │
    view     dismiss
      │         │
      ▼         ▼
 Open URL     Log
 in client  dismissal
      │
      ▼
┌─────────────────────────┐
│  Focus or open window   │
│  clients.openWindow()   │
└─────────────────────────┘
```

### Push Notification Categories

| Category | Priority | Persist | Examples |
|----------|----------|---------|----------|
| Critical | High | Yes | Payment failures, system down |
| Important | Medium | Yes | New orders, low stock |
| Informational | Low | No | Tips, updates |
| Marketing | Low | No | Promotions, news |

### Expected Outcome
- Push event handler implemented
- Notifications displayed with proper formatting
- Click actions open relevant pages
- Notification types properly handled

### Verification Checklist
- [ ] Push event listener added
- [ ] Push data parsing implemented
- [ ] showNotification configured
- [ ] Notification options set
- [ ] Icon and badge paths correct
- [ ] Notification actions defined
- [ ] notificationclick handler implemented
- [ ] Notification types handled
- [ ] URL opening logic correct
- [ ] Tested with DevTools push simulator

---

## Task 32: Verify Service Worker

### Overview
Perform comprehensive verification and testing of the Service Worker implementation. This includes functional testing, performance testing, offline testing, and debugging. Verification ensures the SW works correctly across scenarios and browsers.

### Dependencies
- Task 31: Create Push Handler

### Instructions

1. **Open Chrome DevTools**
   - Open Application tab
   - Navigate to Service Workers section
   - Verify SW registered and activated

2. **Check Service Worker status**
   - Verify status is "activated and running"
   - Check SW source file path
   - Verify scope is correct ('/')

3. **Inspect cache storage**
   - Open Cache Storage in Application tab
   - Verify all caches present:
     - precache-v1
     - api-cache-v1
     - static-cache-v1
     - image-cache-v1
   - Check each cache has entries

4. **Test offline functionality**
   - Enable "Offline" in Network tab
   - Refresh page
   - Verify page loads from cache
   - Check console for SW logs

5. **Test cache strategies**
   - Test API requests offline (should serve cached)
   - Test static assets (should load from cache)
   - Test images (should load from cache)
   - Verify fallback for uncached resources

6. **Test update flow**
   - Modify sw.js (change version)
   - Refresh page
   - Verify "Update on reload" or prompt
   - Check old caches deleted

7. **Test background sync**
   - Go offline
   - Make POST request (create sale)
   - Go online
   - Verify request synced automatically
   - Check DevTools sync event

8. **Test push notifications**
   - Use DevTools push simulator
   - Send test notification
   - Verify notification displayed
   - Click notification, verify action

9. **Check performance metrics**
   - Run Lighthouse audit
   - Check PWA score
   - Verify installability
   - Check service worker metrics

10. **Test on multiple browsers**
    - Chrome: full support
    - Firefox: limited background sync
    - Safari: basic SW support
    - Edge: full support

11. **Test error scenarios**
    - Corrupt cache
    - Network timeout
    - Quota exceeded
    - Invalid push payload

12. **Verify security**
    - HTTPS required for SW
    - Check certificate
    - Verify scope limitations
    - Check CSP headers

13. **Document test results**
    - Create test report
    - List passing tests
    - List failing tests
    - Note browser differences

### Service Worker Verification Checklist

```
┌─────────────────────────────────────────┐
│      Service Worker Verification        │
├─────────────────────────────────────────┤
│                                         │
│ ✓ Registration                          │
│   ✓ SW registered                       │
│   ✓ SW activated                        │
│   ✓ Scope correct (/)                   │
│                                         │
│ ✓ Caching                               │
│   ✓ Precache created                    │
│   ✓ API cache works                     │
│   ✓ Static cache works                  │
│   ✓ Image cache works                   │
│                                         │
│ ✓ Strategies                            │
│   ✓ CacheFirst for static               │
│   ✓ NetworkFirst for API                │
│   ✓ StaleWhileRevalidate for images     │
│                                         │
│ ✓ Offline                               │
│   ✓ Page loads offline                  │
│   ✓ Cached data accessible              │
│   ✓ Offline fallback shown              │
│                                         │
│ ✓ Lifecycle                             │
│   ✓ Install handler runs                │
│   ✓ Activate handler cleans caches      │
│   ✓ Update flow works                   │
│                                         │
│ ✓ Advanced Features                     │
│   ✓ Background sync queues              │
│   ✓ Push notifications display          │
│   ✓ Cache expiry works                  │
│   ✓ Size limits enforced                │
│                                         │
└─────────────────────────────────────────┘
```

### DevTools Testing Guide

| Tool | Location | Purpose |
|------|----------|---------|
| Service Workers | Application > Service Workers | Status, update, unregister |
| Cache Storage | Application > Cache Storage | Inspect cached entries |
| Network | Network tab | Test offline, throttling |
| Console | Console tab | SW logs, errors |
| Lighthouse | Lighthouse tab | PWA audit |
| Push Simulator | Application > Service Workers | Test push |

### Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| First Install | Fresh browser, load app | SW installs, caches precached |
| Offline Load | Go offline, refresh | Page loads from cache |
| API Offline | Go offline, fetch API | Cached response served |
| Update | Change SW, reload | New SW installs, old cache deleted |
| Background Sync | POST offline, go online | Request syncs automatically |
| Push | Send push via DevTools | Notification appears |

### Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse |
| SW Registration | < 100ms | Performance API |
| Cache Hit Rate | > 80% | Custom logging |
| Offline Load Time | < 500ms | Custom timing |

### Browser Compatibility Testing

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Worker | ✓ | ✓ | ✓ | ✓ |
| CacheStorage | ✓ | ✓ | ✓ | ✓ |
| Background Sync | ✓ | ✗ | ✗ | ✓ |
| Push API | ✓ | ✓ | ✗ | ✓ |
| Badge API | ✓ | ✗ | ✗ | ✓ |

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| SW not updating | Aggressive caching | Use updateViaCache: 'none' |
| Cache not clearing | Version mismatch | Check activate handler |
| Offline page not showing | Not precached | Add to precache manifest |
| Push not working | No permission | Request notification permission |
| Quota exceeded | Too many caches | Reduce maxEntries |

### Debugging Commands

```
DevTools Console Commands:

// Check SW registration
navigator.serviceWorker.getRegistration()

// Update SW
registration.update()

// Unregister SW
registration.unregister()

// Check caches
caches.keys()

// Open specific cache
caches.open('api-cache-v1')

// Check storage usage
navigator.storage.estimate()

// Trigger sync
registration.sync.register('post-queue')

// Request notification permission
Notification.requestPermission()
```

### Expected Outcome
- Service Worker fully functional
- All tests passing
- Offline functionality verified
- Performance targets met
- Cross-browser compatibility confirmed

### Verification Checklist
- [ ] SW registered and activated in DevTools
- [ ] All caches present and populated
- [ ] Offline page load works
- [ ] Cache strategies working correctly
- [ ] API requests cached/fetched appropriately
- [ ] Static assets cached
- [ ] Images cached
- [ ] Cache versioning works
- [ ] Old caches deleted on update
- [ ] Background sync queues requests
- [ ] Push notifications display
- [ ] Notification clicks work
- [ ] Performance metrics acceptable
- [ ] Lighthouse PWA score > 90
- [ ] Tested on multiple browsers
- [ ] Error scenarios handled
- [ ] Security requirements met (HTTPS)
- [ ] Documentation complete

---

## Summary

All tasks in this document have implemented advanced Service Worker features for production readiness. Cache versioning ensures clean updates, expiration policies keep data fresh, size limits prevent storage issues, background sync handles offline actions, and push notifications enable real-time updates. Comprehensive verification confirms everything works correctly.

### Completed Tasks
- ✅ Task 27: Cache versioning with automatic cleanup
- ✅ Task 28: Cache expiry policies per resource type
- ✅ Task 29: Cache size limits with LRU eviction
- ✅ Task 30: Background sync for offline requests
- ✅ Task 31: Push notification handling
- ✅ Task 32: Comprehensive verification complete

### Next Steps
Proceed to [Group-C_Offline-Manager](../Group-C_Offline-Manager/) to implement the offline state management system.

### Final Service Worker Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  Service Worker (sw.js)                   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Lifecycle Handlers:                                     │
│  ├─ Install: Precache critical assets                   │
│  ├─ Activate: Clean old caches (versioned)              │
│  └─ Fetch: Route requests to strategies                 │
│                                                           │
│  Cache Management:                                       │
│  ├─ Versioning: cache-name-v{n}                         │
│  ├─ Expiry: TTL per cache type                          │
│  └─ Size Limits: maxEntries per cache                   │
│                                                           │
│  Caching Strategies:                                     │
│  ├─ CacheFirst: Static assets                           │
│  ├─ NetworkFirst: API requests                          │
│  └─ StaleWhileRevalidate: Images                        │
│                                                           │
│  Advanced Features:                                      │
│  ├─ Background Sync: Queue failed requests              │
│  ├─ Push Notifications: Real-time updates               │
│  └─ Offline Fallback: Graceful degradation              │
│                                                           │
└──────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│                    Cache Storage                          │
├──────────────────────────────────────────────────────────┤
│  precache-v1     (Critical assets, no expiry)            │
│  api-cache-v1    (100 entries, 1hr TTL)                 │
│  static-cache-v1 (60 entries, 30 days TTL)              │
│  image-cache-v1  (500 entries, 7 days TTL)              │
└──────────────────────────────────────────────────────────┘
```

### Feature Matrix

| Feature | Status | Browsers | Notes |
|---------|--------|----------|-------|
| Service Worker | ✅ | All modern | Full support |
| CacheStorage | ✅ | All modern | Full support |
| Workbox | ✅ | All | Library-based |
| Cache Strategies | ✅ | All | Via Workbox |
| Versioning | ✅ | All | Custom implementation |
| Expiration | ✅ | All | Via ExpirationPlugin |
| Size Limits | ✅ | All | Via maxEntries |
| Background Sync | ✅ | Chrome, Edge | Fallback for others |
| Push API | ✅ | Chrome, Firefox, Edge | Not Safari |
| Offline Fallback | ✅ | All | Custom pages |

### Performance Characteristics

| Metric | First Visit | Cached Visit | Offline Visit |
|--------|-------------|--------------|---------------|
| Page Load | 2-3s | <500ms | <500ms |
| API Response | 100-500ms | <50ms | <50ms (cached) |
| Image Load | 50-200ms | <20ms | <20ms (cached) |
| Cache Hit Rate | 0% | 80-95% | 100% (cached only) |

### Storage Breakdown

```
Total Storage Usage: ~35MB

├─ Service Worker Caches: ~32MB
│  ├─ precache-v1: ~2MB (app shell)
│  ├─ api-cache-v1: ~1MB (100 responses)
│  ├─ static-cache-v1: ~6MB (JS/CSS bundles)
│  └─ image-cache-v1: ~25MB (500 images)
│
└─ IndexedDB (Group A): ~3MB
   ├─ Products: ~1MB
   ├─ Orders: ~1MB
   └─ Other: ~1MB
```

Group B: Service Worker implementation is complete and verified!
