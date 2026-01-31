# Tasks 17-26: Workbox and Caching

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** B - Service Worker  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-A_IndexedDB-Setup/02_Tasks-10-16_Indexes-Compression.md](../Group-A_IndexedDB-Setup/02_Tasks-10-16_Indexes-Compression.md)
- **→ Next Document:** [02_Tasks-27-32_Versioning-Sync.md](02_Tasks-27-32_Versioning-Sync.md)

---

## Document Overview

This document covers the implementation of Service Worker with Workbox toolkit for offline caching capabilities. It establishes the foundational Service Worker infrastructure, including installation, registration, lifecycle handlers (install, activate, fetch), cache strategies, and specialized caches for different resource types (API responses, static assets, images). The offline fallback mechanism is also implemented to ensure graceful degradation when network is unavailable.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Install Workbox | Low | 15 min |
| 18 | Create SW Registration | Low | 25 min |
| 19 | Create Install Handler | Medium | 35 min |
| 20 | Create Activate Handler | Low | 25 min |
| 21 | Create Fetch Handler | Medium | 40 min |
| 22 | Create Cache Strategies | Medium | 45 min |
| 23 | Create API Cache | Medium | 35 min |
| 24 | Create Static Cache | Low | 25 min |
| 25 | Create Image Cache | Low | 25 min |
| 26 | Create Offline Fallback | Low | 30 min |

---

## Task 17: Install Workbox

### Overview
Install Workbox, a comprehensive library of Service Worker tools developed by Google. Workbox provides production-ready caching strategies, precaching, routing, and background sync capabilities. This task installs both the webpack plugin for build-time configuration and the window package for runtime registration.

### Dependencies
- Task 16: Configure IndexedDB Compression (Group A)
- Next.js project is initialized
- Node.js and npm are available

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in frontend project root
   - Ensure package.json exists

2. **Install workbox-webpack-plugin**
   - Install as dev dependency for build process
   - Use npm install command
   - Save to devDependencies

3. **Install workbox-window**
   - Install as regular dependency for runtime
   - Use npm install command
   - Save to dependencies

4. **Verify installation**
   - Check package.json for workbox entries
   - Confirm versions are compatible with Next.js
   - Check node_modules for workbox packages

5. **Review Workbox documentation**
   - Understand Workbox architecture
   - Review available strategies
   - Check Next.js integration patterns

### Workbox Packages

| Package | Type | Purpose |
|---------|------|---------|
| workbox-webpack-plugin | DevDependency | Build-time SW generation |
| workbox-window | Dependency | Runtime SW registration |

### Package Versions

| Package | Recommended Version |
|---------|---------------------|
| workbox-webpack-plugin | ^7.0.0 or latest |
| workbox-window | ^7.0.0 or latest |

### Installation Commands Reference

```
npm install --save-dev workbox-webpack-plugin
npm install workbox-window
```

### Expected Outcome
- Workbox packages installed successfully
- Package.json updated with dependencies
- Node_modules contains workbox packages
- Ready for Service Worker configuration

### Verification Checklist
- [ ] workbox-webpack-plugin in devDependencies
- [ ] workbox-window in dependencies
- [ ] Both packages in node_modules
- [ ] No installation errors in console

---

## Task 18: Create SW Registration

### Overview
Create the Service Worker registration logic that runs in the browser. This registration checks for Service Worker support, registers the Service Worker file, handles installation and update events, and manages the Service Worker lifecycle from the main application context.

### Dependencies
- Task 17: Install Workbox

### Instructions

1. **Create service-worker.ts file**
   - Navigate to frontend/lib/offline directory
   - Create new TypeScript file for SW registration
   - This file will run in the browser context (not in SW)

2. **Import Workbox Window**
   - Import Workbox class from workbox-window
   - This provides typed registration interface
   - Handles SW lifecycle events

3. **Check Service Worker support**
   - Add browser compatibility check
   - Verify 'serviceWorker' in navigator
   - Return early if not supported

4. **Create registration function**
   - Define async function for registration
   - Name it registerServiceWorker or similar
   - Export function for app initialization

5. **Initialize Workbox instance**
   - Create new Workbox instance
   - Point to SW file path (public/sw.js)
   - Configure scope and options

6. **Configure registration options**
   - Set scope to root ('/')
   - Set updateViaCache to 'none' for immediate updates
   - Configure update check on navigation

7. **Add waiting event handler**
   - Listen for SW waiting state
   - Show update prompt to user
   - Allow user to skip waiting

8. **Add controlling event handler**
   - Listen for SW taking control
   - Reload page when new SW activates
   - Ensure fresh content loads

9. **Add activated event handler**
   - Listen for SW activation
   - Log successful activation
   - Update application state

10. **Register the Service Worker**
    - Call register method on Workbox instance
    - Handle registration promise
    - Log success or error

11. **Handle registration errors**
    - Wrap registration in try-catch
    - Log errors for debugging
    - Provide fallback behavior

12. **Export registration function**
    - Export function as default or named export
    - Add TypeScript types
    - Document function purpose

### Service Worker Lifecycle

```
┌────────────────────────────────────────┐
│         Browser Context                │
│                                        │
│  1. Check SW support                  │
│  2. Create Workbox instance           │
│  3. Register SW file                  │
│         │                             │
│         ▼                             │
│  ┌──────────────────┐                │
│  │  Service Worker  │                │
│  │  Registration    │                │
│  └──────────────────┘                │
│         │                             │
│    ┌────┴────┬────────────┐         │
│    ▼         ▼            ▼         │
│ Installing Waiting   Activated      │
│                                        │
│  Events:                              │
│  • waiting → prompt user              │
│  • controlling → reload page          │
│  • activated → update state           │
└────────────────────────────────────────┘
```

### Registration Options

| Option | Value | Purpose |
|--------|-------|---------|
| scope | '/' | Control entire app |
| updateViaCache | 'none' | Always check for updates |
| type | 'module' | Use ES modules (optional) |

### Lifecycle Events to Handle

| Event | Action | Purpose |
|-------|--------|---------|
| waiting | Show prompt | Notify update available |
| controlling | Reload page | Apply new SW |
| activated | Update UI | Confirm activation |

### Expected Outcome
- Service Worker registration logic created
- Browser compatibility check implemented
- Lifecycle events properly handled
- Registration function exported and ready

### Verification Checklist
- [ ] service-worker.ts file created in lib/offline
- [ ] Workbox class imported and used
- [ ] Service Worker support check implemented
- [ ] Registration options configured correctly
- [ ] Waiting event handler implemented
- [ ] Controlling event handler implemented
- [ ] Error handling in place
- [ ] Function exported properly

---

## Task 19: Create Install Handler

### Overview
Implement the install event handler in the Service Worker. This handler runs when the Service Worker is first installed and is responsible for precaching critical assets that must be available offline. The handler ensures essential resources are cached immediately upon installation.

### Dependencies
- Task 18: Create SW Registration

### Instructions

1. **Create sw.js file**
   - Navigate to frontend/public directory
   - Create new JavaScript file named sw.js
   - This is the actual Service Worker code

2. **Import Workbox modules**
   - Import precacheAndRoute from workbox-precaching
   - Import necessary cache utilities
   - Import lifecycle helpers

3. **Define precache manifest**
   - List critical assets to cache on install
   - Include index.html or app entry point
   - Include main JavaScript bundle
   - Include main CSS file
   - Include offline fallback page

4. **Add install event listener**
   - Listen for 'install' event
   - Use self.addEventListener for SW context
   - Prevent default behavior if needed

5. **Implement waitUntil pattern**
   - Use event.waitUntil to extend install lifetime
   - Ensures caching completes before installation finishes
   - Prevents installation from completing prematurely

6. **Open cache storage**
   - Define cache name with version
   - Use caches.open() API
   - Store cache reference for adding resources

7. **Add resources to cache**
   - Use cache.addAll() for batch adding
   - Include all precache manifest items
   - Handle partial failures

8. **Configure Workbox precaching**
   - Use precacheAndRoute for automatic management
   - Let Workbox handle revision management
   - Configure ignore patterns if needed

9. **Handle install errors**
   - Add error handling for cache failures
   - Log errors for debugging
   - Decide on failure strategy (fail or continue)

10. **Force skip waiting (optional)**
    - Call self.skipWaiting() if immediate activation needed
    - Consider user experience implications
    - Document decision in comments

### Install Event Flow

```
Service Worker Install Event Triggered
           │
           ▼
┌─────────────────────────┐
│  Open Cache Storage     │
│  (precache-v1)         │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Precache Assets:       │
│  • index.html          │
│  • app.js              │
│  • styles.css          │
│  • offline.html        │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Installation Complete  │
│  SW enters "installed"  │
│  state                 │
└─────────────────────────┘
```

### Critical Assets to Precache

| Asset | Priority | Size Estimate | Reason |
|-------|----------|---------------|--------|
| index.html | Critical | < 10KB | App entry point |
| app.js | Critical | Varies | Main application bundle |
| styles.css | High | Varies | Core styles |
| offline.html | Critical | < 5KB | Offline fallback |
| icons/icon-192.png | Medium | < 20KB | App icon |

### Cache Naming Convention

| Cache Type | Name Pattern | Example |
|------------|--------------|---------|
| Precache | precache-v{version} | precache-v1 |
| Runtime | runtime-v{version} | runtime-v1 |

### Install Options

| Option | Value | Purpose |
|--------|-------|---------|
| ignoreURLParametersMatching | [/^utm_/] | Ignore tracking params |
| cleanupOutdatedCaches | true | Remove old caches |

### Expected Outcome
- Install event handler implemented
- Critical assets precached on installation
- Cache storage properly initialized
- Error handling for cache failures

### Verification Checklist
- [ ] sw.js file created in public directory
- [ ] Install event listener added
- [ ] Precache manifest defined
- [ ] waitUntil pattern used correctly
- [ ] Critical assets included in manifest
- [ ] Cache naming follows convention
- [ ] Error handling implemented
- [ ] Workbox precaching configured

---

## Task 20: Create Activate Handler

### Overview
Implement the activate event handler in the Service Worker. This handler runs when a new Service Worker version activates and is responsible for cleaning up old caches, removing outdated resources, and preparing the SW for controlling pages. This ensures users don't accumulate stale caches over time.

### Dependencies
- Task 19: Create Install Handler

### Instructions

1. **Add activate event listener**
   - Listen for 'activate' event in sw.js
   - Use self.addEventListener
   - This runs after installation completes

2. **Implement waitUntil pattern**
   - Use event.waitUntil to extend activation
   - Ensures cleanup completes before activation finishes
   - Prevents premature activation

3. **Get all cache names**
   - Use caches.keys() to list all caches
   - Returns array of cache name strings
   - Includes all caches in storage

4. **Define current cache names**
   - List cache names that should be kept
   - Include current version caches
   - Include precache and runtime caches

5. **Filter outdated caches**
   - Compare all cache names to current names
   - Identify caches from old versions
   - Create list of caches to delete

6. **Delete outdated caches**
   - Use caches.delete() for each outdated cache
   - Use Promise.all for batch deletion
   - Wait for all deletions to complete

7. **Implement cache whitelist pattern**
   - Define cache name patterns to keep
   - Use regex or string matching
   - Delete non-matching caches

8. **Claim clients immediately**
   - Call self.clients.claim()
   - Takes control of pages immediately
   - No need to wait for page reload

9. **Log activation success**
   - Log successful activation
   - Log number of caches deleted
   - Log cache names retained

10. **Handle activation errors**
    - Add try-catch for error handling
    - Log errors for debugging
    - Don't fail activation on cleanup errors

### Activate Event Flow

```
Service Worker Activate Event Triggered
           │
           ▼
┌─────────────────────────┐
│  Get All Cache Names    │
│  from Cache Storage     │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Filter Outdated Caches │
│  • precache-v0         │
│  • api-cache-v0        │
│  • (old versions)      │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Delete Old Caches      │
│  Keep Current:          │
│  • precache-v1         │
│  • api-cache-v1        │
│  • image-cache-v1      │
└─────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Claim All Clients      │
│  Take control of pages  │
└─────────────────────────┘
           │
           ▼
      Activation Complete
```

### Cache Lifecycle Management

| Action | Timing | Purpose |
|--------|--------|---------|
| Install | New SW installed | Cache new resources |
| Activate | New SW activated | Clean old caches |
| Fetch | Ongoing | Serve from cache |

### Cache Name Matching

| Pattern | Keeps | Deletes |
|---------|-------|---------|
| /-v1$/ | precache-v1, api-cache-v1 | precache-v0, api-cache-v0 |
| /^(precache\|api\|image)-/ | All named caches | Other caches |

### Expected Outcome
- Activate event handler implemented
- Old cache versions deleted automatically
- Current caches preserved
- Service Worker takes control immediately

### Verification Checklist
- [ ] Activate event listener added
- [ ] waitUntil pattern used
- [ ] Cache.keys() used to list caches
- [ ] Cache deletion logic implemented
- [ ] Cache whitelist defined
- [ ] clients.claim() called
- [ ] Error handling implemented
- [ ] Logging added for debugging

---

## Task 21: Create Fetch Handler

### Overview
Implement the fetch event handler, the core of the Service Worker. This handler intercepts all network requests made by the application and routes them to appropriate caching strategies. It acts as a programmable network proxy, enabling offline functionality and performance optimization.

### Dependencies
- Task 20: Create Activate Handler

### Instructions

1. **Add fetch event listener**
   - Listen for 'fetch' event in sw.js
   - This fires for every network request
   - Use self.addEventListener

2. **Implement respondWith pattern**
   - Use event.respondWith()
   - Provide Response or Promise<Response>
   - Must be called synchronously

3. **Get request details**
   - Extract request from event
   - Get URL, method, headers
   - Determine request type

4. **Implement request routing logic**
   - Check request URL patterns
   - Route to appropriate strategy
   - Handle different resource types

5. **Create URL matching helper**
   - Define function to match URL patterns
   - Support regex matching
   - Support string matching
   - Support origin checking

6. **Route API requests**
   - Match requests to /api/* pattern
   - Route to API cache strategy
   - Handle authentication headers

7. **Route static asset requests**
   - Match .js, .css, .html extensions
   - Route to static cache strategy
   - Check cache first

8. **Route image requests**
   - Match /images/* and /products/* patterns
   - Match image file extensions
   - Route to image cache strategy

9. **Route font requests**
   - Match font file extensions
   - Use cache-first strategy
   - Fonts rarely change

10. **Handle navigation requests**
    - Check request.mode === 'navigate'
    - Serve index.html from cache
    - Fallback to offline.html if needed

11. **Implement default fallback**
    - For unmatched requests
    - Try network first
    - Catch errors gracefully

12. **Add request filtering**
    - Skip chrome-extension:// URLs
    - Skip non-HTTP protocols
    - Skip same-origin only (optional)

### Fetch Event Flow

```
Network Request Intercepted
           │
           ▼
    ┌─────────────┐
    │  Get Request │
    │  Details     │
    └─────────────┘
           │
           ▼
    Match Request Type?
           │
    ┌──────┴──────┬──────────┬─────────┐
    │             │          │         │
    ▼             ▼          ▼         ▼
  API        Static     Images    Navigation
 Request    Assets     Requests   Requests
    │             │          │         │
    ▼             ▼          ▼         ▼
Network    Cache     Stale      App Shell
 First      First    Revalidate  Cache
    │             │          │         │
    └──────┬──────┴──────────┴─────────┘
           │
           ▼
    Return Response
```

### Request Type Routing

| Request Type | URL Pattern | Strategy |
|--------------|-------------|----------|
| API | /api/* | NetworkFirst |
| Static | *.js, *.css, *.html | CacheFirst |
| Images | /images/*, *.png, *.jpg | StaleWhileRevalidate |
| Fonts | *.woff2, *.woff | CacheFirst |
| Navigation | mode: 'navigate' | AppShell |

### URL Matching Patterns

| Pattern Type | Example | Matches |
|--------------|---------|---------|
| Prefix | /api/ | /api/products, /api/orders |
| Suffix | .jpg | image.jpg, photo.jpg |
| Regex | /\/products\/\d+/ | /products/123 |
| Origin | https://example.com | Same origin only |

### Request Properties to Check

| Property | Purpose | Example Values |
|----------|---------|----------------|
| request.url | Match patterns | https://example.com/api/... |
| request.method | HTTP method | GET, POST, PUT |
| request.mode | Request type | navigate, cors, same-origin |
| request.destination | Resource type | document, script, image |

### Expected Outcome
- Fetch event handler implemented
- Requests routed to appropriate strategies
- Different resource types handled correctly
- Navigation and fallback logic in place

### Verification Checklist
- [ ] Fetch event listener added
- [ ] respondWith pattern used correctly
- [ ] URL matching logic implemented
- [ ] API requests routed appropriately
- [ ] Static assets routed appropriately
- [ ] Image requests routed appropriately
- [ ] Navigation requests handled
- [ ] Default fallback implemented
- [ ] Request filtering applied

---

## Task 22: Create Cache Strategies

### Overview
Implement the core caching strategies using Workbox. These strategies define how requests are handled in terms of cache and network interaction. The main strategies include CacheFirst (for static assets), NetworkFirst (for API calls), and StaleWhileRevalidate (for images). Each strategy balances performance, freshness, and offline capability differently.

### Dependencies
- Task 21: Create Fetch Handler

### Instructions

1. **Import Workbox strategies**
   - Import from workbox-strategies module
   - Include CacheFirst, NetworkFirst, StaleWhileRevalidate
   - Import ExpirationPlugin
   - Import CacheableResponsePlugin

2. **Import Workbox routing**
   - Import registerRoute from workbox-routing
   - Import route matching helpers
   - These tie strategies to URL patterns

3. **Understand CacheFirst strategy**
   - Checks cache first
   - Only goes to network if cache miss
   - Best for static, unchanging assets
   - Fastest response time

4. **Understand NetworkFirst strategy**
   - Tries network first
   - Falls back to cache on failure
   - Best for API calls and dynamic content
   - Always gets fresh data when online

5. **Understand StaleWhileRevalidate strategy**
   - Returns cached response immediately
   - Updates cache in background from network
   - Best balance of speed and freshness
   - Good for images and semi-static content

6. **Configure strategy plugins**
   - Add ExpirationPlugin for cache expiry
   - Add CacheableResponsePlugin for response filtering
   - Configure maxEntries limits
   - Configure maxAgeSeconds for TTL

7. **Create CacheFirst instance**
   - Instantiate CacheFirst strategy
   - Configure cache name
   - Add plugins array
   - Will be used for static assets

8. **Create NetworkFirst instance**
   - Instantiate NetworkFirst strategy
   - Configure cache name
   - Set network timeout
   - Add plugins for expiration
   - Will be used for API calls

9. **Create StaleWhileRevalidate instance**
   - Instantiate StaleWhileRevalidate strategy
   - Configure cache name
   - Add expiration plugin
   - Will be used for images

10. **Document strategy decisions**
    - Add comments explaining each choice
    - Document plugin configurations
    - Note performance implications

### Caching Strategy Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                    CACHE STRATEGIES                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CacheFirst:                NetworkFirst:                   │
│  ┌────────┐                ┌────────┐                       │
│  │ Cache  │──Hit──▶        │Network │──Success──▶           │
│  └────────┘                └────────┘                       │
│      │                         │                            │
│     Miss                      Fail                          │
│      │                         │                            │
│      ▼                         ▼                            │
│  ┌────────┐                ┌────────┐                       │
│  │Network │                │ Cache  │                       │
│  └────────┘                └────────┘                       │
│                                                              │
│  StaleWhileRevalidate:                                      │
│  ┌────────┐                                                 │
│  │ Cache  │──Return──▶ (Immediate response)                │
│  └────────┘                                                 │
│      │                                                      │
│      ├──────────▶ ┌────────┐                               │
│      │            │Network │ (Background update)           │
│      │            └────────┘                               │
│      │                │                                     │
│      │               Update                                │
│      └────────◀──────┘                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Strategy Selection Guide

| Resource Type | Strategy | Reason |
|---------------|----------|--------|
| JavaScript | CacheFirst | Versioned, immutable files |
| CSS | CacheFirst | Versioned, immutable files |
| HTML | NetworkFirst | Need fresh content |
| API Data | NetworkFirst | Need fresh data |
| Images | StaleWhileRevalidate | Balance speed/freshness |
| Fonts | CacheFirst | Never change |

### Strategy Configuration Options

| Option | Purpose | Typical Values |
|--------|---------|----------------|
| cacheName | Separate cache storage | 'api-cache-v1' |
| networkTimeoutSeconds | Network wait time | 3-5 seconds |
| plugins | Additional behaviors | [ExpirationPlugin, ...] |

### Plugin Configuration

| Plugin | Purpose | Options |
|--------|---------|---------|
| ExpirationPlugin | Cache expiry | maxEntries, maxAgeSeconds |
| CacheableResponsePlugin | Filter responses | statuses: [0, 200] |
| BackgroundSyncPlugin | Retry failed requests | name, options |

### Strategy Performance Characteristics

| Strategy | Speed | Freshness | Offline | Network Usage |
|----------|-------|-----------|---------|---------------|
| CacheFirst | Fast | Stale | Excellent | Minimal |
| NetworkFirst | Slow | Fresh | Good | High |
| StaleWhileRevalidate | Fast | Eventually fresh | Excellent | Moderate |

### Expected Outcome
- All three main strategies configured
- Appropriate plugins added to each
- Strategy instances ready for route registration
- Clear documentation of strategy choices

### Verification Checklist
- [ ] Workbox strategies imported
- [ ] CacheFirst strategy created
- [ ] NetworkFirst strategy created
- [ ] StaleWhileRevalidate strategy created
- [ ] ExpirationPlugin configured
- [ ] CacheableResponsePlugin configured
- [ ] Cache names defined
- [ ] Timeouts set appropriately
- [ ] Strategy choices documented

---

## Task 23: Create API Cache

### Overview
Implement specialized caching for API requests using the NetworkFirst strategy with Workbox routing. API caching ensures that when online, users always get fresh data, but when offline, they can still access previously cached responses. This is critical for POS offline functionality.

### Dependencies
- Task 22: Create Cache Strategies

### Instructions

1. **Import necessary Workbox modules**
   - Import registerRoute from workbox-routing
   - Import NetworkFirst strategy
   - Import ExpirationPlugin
   - Import CacheableResponsePlugin

2. **Define API route pattern**
   - Create regex to match /api/* URLs
   - Match all API endpoints
   - Consider subdomain variations

3. **Configure NetworkFirst strategy for API**
   - Set cacheName to 'api-cache-v1'
   - Set networkTimeoutSeconds to 3 (3 seconds)
   - Add plugins array

4. **Add ExpirationPlugin for API cache**
   - Set maxEntries to 100 responses
   - Set maxAgeSeconds to 3600 (1 hour)
   - Old entries auto-deleted

5. **Add CacheableResponsePlugin**
   - Cache only successful responses
   - Set statuses to [0, 200]
   - Status 0 for opaque responses
   - Status 200 for success

6. **Register API route**
   - Use registerRoute function
   - Pass URL pattern as first argument
   - Pass NetworkFirst instance as second
   - Route is now active

7. **Handle API request headers**
   - Ensure Authorization headers preserved
   - Consider cache key variations
   - Handle authenticated requests

8. **Configure cache expiration**
   - API data should expire quickly
   - 1 hour is reasonable default
   - Adjust based on data volatility

9. **Add request/response logging (optional)**
   - Log API cache hits
   - Log API cache misses
   - Useful for debugging

10. **Document API caching behavior**
    - When network available: fresh data
    - When network fails: cached data
    - When no cache: error handling

### API Cache Flow

```
API Request (e.g., /api/products)
           │
           ▼
┌─────────────────────────┐
│  NetworkFirst Strategy  │
│  Try Network (3s)       │
└─────────────────────────┘
           │
      ┌────┴────┐
      │         │
  Success     Timeout/Fail
      │         │
      ▼         ▼
 ┌────────┐  ┌────────┐
 │Network │  │ Cache  │
 │Response│  │Response│
 └────────┘  └────────┘
      │         │
      │    ┌────┴────┐
      │    │         │
      │   Hit       Miss
      │    │         │
      │    ▼         ▼
      │  Return    Error/
      │  Cached   Offline
      │           Fallback
      │
      ▼
 Update Cache
 (max 100 entries, 1hr TTL)
      │
      ▼
 Return Response
```

### API Route Patterns

| Pattern | Matches | Purpose |
|---------|---------|---------|
| /api/* | All API endpoints | General API caching |
| /api/products/* | Product endpoints | Product data |
| /api/orders/* | Order endpoints | Order data |
| /api/customers/* | Customer endpoints | Customer data |

### API Cache Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| cacheName | api-cache-v1 | Versioned, separate storage |
| networkTimeout | 3000ms | Quick timeout for offline |
| maxEntries | 100 | Limit cache size |
| maxAge | 1 hour | API data expires quickly |

### Response Caching Rules

| Status Code | Cache? | Reason |
|-------------|--------|--------|
| 200 | Yes | Successful response |
| 201 | No | Created, should refetch |
| 304 | No | Not modified |
| 404 | No | Not found, don't cache |
| 500 | No | Server error, temporary |

### Cache Key Considerations

| Factor | Impact | Solution |
|--------|--------|----------|
| Query params | Different cache keys | Include in key |
| Auth headers | User-specific data | Include user ID in key |
| Request method | GET vs POST | Only cache GET |

### Expected Outcome
- API requests use NetworkFirst strategy
- Online: fresh data always
- Offline: cached data served
- Cache auto-expires and limits size

### Verification Checklist
- [ ] API route pattern defined
- [ ] NetworkFirst strategy configured
- [ ] networkTimeoutSeconds set to 3
- [ ] ExpirationPlugin added
- [ ] maxEntries set to 100
- [ ] maxAgeSeconds set to 3600
- [ ] CacheableResponsePlugin configured
- [ ] registerRoute called for API pattern
- [ ] Cache name follows convention

---

## Task 24: Create Static Cache

### Overview
Implement caching for static assets (JavaScript, CSS, HTML) using the CacheFirst strategy. Static assets are typically versioned and immutable, making them ideal candidates for aggressive caching. This dramatically improves load performance and enables full offline functionality.

### Dependencies
- Task 22: Create Cache Strategies

### Instructions

1. **Define static asset patterns**
   - Create regex for .js files
   - Create regex for .css files
   - Create regex for .html files
   - Combine into single pattern or separate routes

2. **Configure CacheFirst strategy for static assets**
   - Set cacheName to 'static-cache-v1'
   - Add ExpirationPlugin
   - Add CacheableResponsePlugin

3. **Add ExpirationPlugin for static cache**
   - Set maxEntries to 60 files
   - Set maxAgeSeconds to 2592000 (30 days)
   - Static assets change rarely

4. **Add CacheableResponsePlugin**
   - Cache successful responses only
   - Set statuses to [0, 200]
   - Filter out errors

5. **Register JavaScript route**
   - Match .js and .mjs extensions
   - Use CacheFirst strategy
   - Cache minified bundles

6. **Register CSS route**
   - Match .css extension
   - Use CacheFirst strategy
   - Cache stylesheets

7. **Register HTML route**
   - Match .html extension
   - Consider NetworkFirst for HTML
   - Balance freshness vs performance

8. **Handle webpack chunked files**
   - Match chunk hash patterns
   - Webpack includes hash in filename
   - These are immutable, safe to cache

9. **Consider cache-busting**
   - Versioned files have unique URLs
   - Old versions auto-expire
   - No manual invalidation needed

10. **Configure long cache duration**
    - Static assets can cache for weeks
    - 30 days is reasonable
    - Files change via new versions

### Static Cache Flow

```
Static Asset Request (e.g., app.js)
           │
           ▼
┌─────────────────────────┐
│  CacheFirst Strategy    │
│  Check Cache First      │
└─────────────────────────┘
           │
      ┌────┴────┐
      │         │
   Hit        Miss
      │         │
      ▼         ▼
 ┌────────┐  ┌────────┐
 │Return  │  │Fetch   │
 │Cached  │  │Network │
 └────────┘  └────────┘
                  │
                  ▼
             Add to Cache
             (max 60 files, 30 days)
                  │
                  ▼
             Return Response
```

### Static Asset Types

| Asset Type | Extension | Strategy | TTL |
|------------|-----------|----------|-----|
| JavaScript | .js, .mjs | CacheFirst | 30 days |
| CSS | .css | CacheFirst | 30 days |
| HTML | .html | NetworkFirst | 1 day |
| JSON | .json | NetworkFirst | 1 hour |

### File Pattern Matching

| Pattern | Matches | Example |
|---------|---------|---------|
| /\.js$/ | JavaScript files | app.js, main.js |
| /\.css$/ | Stylesheets | styles.css, app.css |
| /\.html$/ | HTML documents | index.html, 404.html |
| /\.[a-f0-9]{8}\.js$/ | Chunked files | app.1a2b3c4d.js |

### Static Cache Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| cacheName | static-cache-v1 | Versioned cache |
| maxEntries | 60 | Reasonable file count |
| maxAge | 30 days | Static files rarely change |

### Cache Hierarchy

```
Static Cache (static-cache-v1)
├── app.js (Main bundle)
├── vendors.js (Dependencies)
├── chunk-1.js (Lazy loaded)
├── chunk-2.js (Lazy loaded)
├── styles.css (Main styles)
├── vendor.css (Library styles)
└── index.html (App shell)
```

### Expected Outcome
- Static assets cached aggressively
- Near-instant load from cache
- Network only fetched once per version
- Automatic cleanup of old files

### Verification Checklist
- [ ] Static asset patterns defined
- [ ] CacheFirst strategy configured
- [ ] JavaScript route registered
- [ ] CSS route registered
- [ ] HTML route registered (if applicable)
- [ ] ExpirationPlugin configured
- [ ] maxEntries set to 60
- [ ] maxAgeSeconds set to 30 days
- [ ] Cache name follows convention

---

## Task 25: Create Image Cache

### Overview
Implement specialized caching for images using the StaleWhileRevalidate strategy. This strategy provides immediate response from cache while updating in the background, perfect for images that need to be fast but should eventually reflect updates. Product images in POS are critical for offline functionality.

### Dependencies
- Task 24: Create Static Cache

### Instructions

1. **Define image route patterns**
   - Create regex for image extensions (.png, .jpg, .jpeg, .gif, .webp, .svg)
   - Match /images/* URL path
   - Match /products/* URL path for product images

2. **Configure StaleWhileRevalidate strategy for images**
   - Set cacheName to 'image-cache-v1'
   - Add ExpirationPlugin
   - Add CacheableResponsePlugin

3. **Add ExpirationPlugin for image cache**
   - Set maxEntries to 500 images
   - Set maxAgeSeconds to 604800 (7 days)
   - Balance storage vs freshness

4. **Add CacheableResponsePlugin**
   - Cache successful responses
   - Set statuses to [0, 200]
   - Don't cache error images

5. **Register image extension route**
   - Match common image formats
   - Use StaleWhileRevalidate strategy
   - Apply to all origins (consider CORS)

6. **Register image path routes**
   - Match /images/* path
   - Match /products/* path for product images
   - Match /uploads/* if applicable

7. **Handle large images**
   - Consider file size limits
   - Don't cache extremely large images
   - May need Range request support

8. **Configure appropriate expiry**
   - Images can cache for days
   - 7 days is reasonable
   - Product images change occasionally

9. **Consider responsive images**
   - Multiple sizes of same image
   - Each cached separately
   - Cache key includes dimensions

10. **Handle image optimization**
    - Next.js Image optimization generates URLs
    - Match optimized image patterns
    - Cache optimized versions

### Image Cache Flow

```
Image Request (e.g., product.jpg)
           │
           ▼
┌──────────────────────────────┐
│  StaleWhileRevalidate        │
│  Check Cache                 │
└──────────────────────────────┘
           │
      ┌────┴────┐
      │         │
   Hit        Miss
      │         │
      ▼         ▼
 ┌────────┐  ┌────────┐
 │Return  │  │Fetch   │
 │Cached  │  │Network │
 │Image   │  └────────┘
 └────────┘       │
      │           ▼
      │      Add to Cache
      │           │
      │           ▼
      │      Return Image
      │
      ├─────────────┐
      │             │
      ▼             ▼
 Return      Fetch Network
 Immediately  (Background)
                   │
                   ▼
             Update Cache
             (max 500 images, 7 days)
```

### Image Format Support

| Format | Extension | Use Case | Cache? |
|--------|-----------|----------|--------|
| PNG | .png | Graphics, transparency | Yes |
| JPEG | .jpg, .jpeg | Photos | Yes |
| WebP | .webp | Modern format | Yes |
| SVG | .svg | Vectors, icons | Yes |
| GIF | .gif | Animations | Yes |
| AVIF | .avif | Next-gen format | Yes |

### Image Route Patterns

| Pattern | Matches | Purpose |
|---------|---------|---------|
| /\.(png\|jpg\|jpeg\|gif\|webp\|svg)$/i | File extensions | All image types |
| /^https?:.*\/images\// | /images/ path | Image directory |
| /^https?:.*\/products\// | /products/ path | Product images |
| /_next/image/ | Next.js images | Optimized images |

### Image Cache Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| cacheName | image-cache-v1 | Separate from other caches |
| maxEntries | 500 | Many product images |
| maxAge | 7 days | Images update occasionally |
| strategy | StaleWhileRevalidate | Fast + fresh |

### Storage Considerations

| Factor | Impact | Recommendation |
|--------|--------|----------------|
| Cache size | 500 images × ~100KB | ~50MB total |
| Browser limit | Chrome: ~6% of disk | Monitor usage |
| Cleanup | Auto via maxEntries | Oldest deleted first |

### Expected Outcome
- Images cached for fast display
- Background updates keep images fresh
- Cache limited to 500 images
- Automatic cleanup of old images

### Verification Checklist
- [ ] Image route patterns defined
- [ ] StaleWhileRevalidate strategy configured
- [ ] Image extension route registered
- [ ] /images/* path route registered
- [ ] /products/* path route registered
- [ ] ExpirationPlugin configured
- [ ] maxEntries set to 500
- [ ] maxAgeSeconds set to 7 days
- [ ] Cache name follows convention

---

## Task 26: Create Offline Fallback

### Overview
Implement offline fallback mechanisms to provide a good user experience when the network is unavailable and no cached content exists. This includes creating a custom offline page, implementing catch handlers for failed requests, and providing meaningful error messages to users.

### Dependencies
- Task 25: Create Image Cache

### Instructions

1. **Create offline.html page**
   - Navigate to frontend/public directory
   - Create offline.html file
   - Design simple, friendly offline message

2. **Design offline page content**
   - Add company branding (logo, colors)
   - Clear message: "You're offline"
   - Explain offline functionality
   - List what works offline

3. **Style offline page inline**
   - Use inline CSS (no external files)
   - Keep styling simple and lightweight
   - Ensure good mobile appearance

4. **Add offline page to precache**
   - Include offline.html in precache manifest
   - Ensure it's available from install
   - High priority asset

5. **Implement navigation fallback**
   - Catch navigation request failures
   - Serve offline.html when no cache exists
   - Use setCatchHandler for navigation

6. **Implement API fallback**
   - Catch failed API requests
   - Return offline indicator response
   - Provide meaningful error data

7. **Create offline image placeholder**
   - Create simple SVG placeholder
   - Use data URL to embed inline
   - Show when image not cached

8. **Implement catch handler**
   - Use Workbox setCatchHandler
   - Check request destination type
   - Route to appropriate fallback

9. **Add offline indicator in UI**
   - Not in SW, but coordinate with app
   - Show banner when offline
   - Update when connection restored

10. **Test offline scenarios**
    - Test with DevTools offline mode
    - Test navigation when offline
    - Test API calls when offline
    - Test image loading when offline

### Offline Page Structure

```
┌─────────────────────────────────────┐
│          LCC Logo                   │
│                                     │
│     📡  You're Offline              │
│                                     │
│  No internet connection detected   │
│                                     │
│  What you can do:                  │
│  ✓ View cached products            │
│  ✓ Create offline sales            │
│  ✓ View order history              │
│  ✓ Manage inventory (cached)       │
│                                     │
│  Data will sync when online        │
│                                     │
│  [Try Again]                       │
└─────────────────────────────────────┘
```

### Fallback Strategy by Request Type

| Request Type | Fallback | Response |
|--------------|----------|----------|
| Navigation | offline.html | Branded offline page |
| API | Offline JSON | { offline: true, message: "..." } |
| Image | Placeholder SVG | Gray box with icon |
| Font | Skip | Browser default font |
| Script | From cache | Error if not cached |

### Offline JSON Response Structure

```
{
  "offline": true,
  "message": "You are currently offline",
  "cached": false,
  "timestamp": "2026-01-31T10:00:00Z",
  "retry": true
}
```

### Catch Handler Flow

```
Request Fails (Network + No Cache)
           │
           ▼
   Check Request Type
           │
    ┌──────┴──────┬──────────┐
    │             │          │
    ▼             ▼          ▼
Navigation     API       Image
  Request    Request   Request
    │             │          │
    ▼             ▼          ▼
offline.html  Offline   Placeholder
             JSON       SVG
    │             │          │
    └──────┬──────┴──────────┘
           │
           ▼
    Return Fallback Response
```

### Offline Page Requirements

| Element | Required | Purpose |
|---------|----------|---------|
| Branding | Yes | User recognition |
| Message | Yes | Clear communication |
| Capabilities | Yes | What works offline |
| Retry button | Yes | Check connection |
| Inline CSS | Yes | No external deps |
| Small size | Yes | Quick load |

### User Experience States

| State | UI Indicator | Functionality |
|-------|--------------|---------------|
| Online | Green badge | Full features |
| Offline (cached) | Yellow badge | Limited features |
| Offline (no cache) | Red + offline page | Minimal features |
| Syncing | Blue spinner | Background sync |

### Expected Outcome
- Professional offline page created
- Navigation fallback implemented
- API fallback provides offline response
- Image placeholder for missing images
- Users understand offline state

### Verification Checklist
- [ ] offline.html created in public/
- [ ] Offline page includes branding
- [ ] Offline page uses inline CSS
- [ ] offline.html in precache manifest
- [ ] Navigation catch handler implemented
- [ ] API catch handler implemented
- [ ] Image placeholder implemented
- [ ] setCatchHandler configured
- [ ] Fallback responses appropriate

---

## Summary

All tasks in this document have established the core Service Worker infrastructure with Workbox. The SW is installed and registered, lifecycle handlers manage cache cleanup, fetch handler routes requests to strategies, and specialized caches optimize different resource types. Offline fallback ensures good UX when network is unavailable.

### Completed Tasks
- ✅ Task 17: Workbox installed
- ✅ Task 18: SW registration created
- ✅ Task 19: Install handler caches critical assets
- ✅ Task 20: Activate handler cleans old caches
- ✅ Task 21: Fetch handler routes requests
- ✅ Task 22: Cache strategies configured
- ✅ Task 23: API cache with NetworkFirst
- ✅ Task 24: Static cache with CacheFirst
- ✅ Task 25: Image cache with StaleWhileRevalidate
- ✅ Task 26: Offline fallback pages created

### Next Steps
Proceed to [02_Tasks-27-32_Versioning-Sync.md](02_Tasks-27-32_Versioning-Sync.md) to implement cache versioning, expiry rules, size limits, background sync, and push notifications.

### Files Created/Modified
```
frontend/
├── public/
│   ├── sw.js (Service Worker)
│   └── offline.html (Offline fallback)
├── lib/
│   └── offline/
│       └── service-worker.ts (Registration)
└── package.json (Workbox dependencies)
```

### Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│              Browser Context                         │
│  ┌────────────────────────────────────────────┐     │
│  │  Application Code                          │     │
│  │  • Registers Service Worker                │     │
│  │  • Makes fetch requests                    │     │
│  └────────────────────────────────────────────┘     │
│                      │                              │
│                      │ Intercepts                   │
│                      ▼                              │
│  ┌────────────────────────────────────────────┐     │
│  │         Service Worker (sw.js)             │     │
│  │  ┌──────────────────────────────────┐     │     │
│  │  │  Install Handler                 │     │     │
│  │  │  • Precache critical assets      │     │     │
│  │  └──────────────────────────────────┘     │     │
│  │  ┌──────────────────────────────────┐     │     │
│  │  │  Activate Handler                │     │     │
│  │  │  • Clean old caches             │     │     │
│  │  └──────────────────────────────────┘     │     │
│  │  ┌──────────────────────────────────┐     │     │
│  │  │  Fetch Handler                   │     │     │
│  │  │  • Routes to strategies          │     │     │
│  │  └──────────────────────────────────┘     │     │
│  └────────────────────────────────────────────┘     │
│                      │                              │
│              ┌───────┴──────┐                       │
│              ▼              ▼                       │
│       ┌───────────┐   ┌──────────┐                 │
│       │   Cache   │   │ Network  │                 │
│       │  Storage  │   │          │                 │
│       └───────────┘   └──────────┘                 │
└──────────────────────────────────────────────────────┘

Cache Storage:
├── precache-v1 (Critical assets)
├── api-cache-v1 (API responses)
├── static-cache-v1 (JS, CSS, HTML)
└── image-cache-v1 (Product images)
```
