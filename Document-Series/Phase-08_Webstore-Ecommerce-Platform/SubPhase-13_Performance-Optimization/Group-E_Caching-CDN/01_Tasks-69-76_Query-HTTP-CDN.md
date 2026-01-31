# Tasks 69-76: Query and HTTP Caching

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** E - Caching & CDN  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-77-82_Edge-Storage-Verify.md](02_Tasks-77-82_Edge-Storage-Verify.md)

---

## Document Overview

This document covers the implementation of client-side and server-side caching strategies for the webstore. It includes TanStack Query cache configuration with stale time and cache time settings, query invalidation on mutations, HTTP cache headers for API responses, browser caching with Cache-Control and ETag support, and CDN configuration for asset delivery.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create TanStack Query Cache | Medium | 45 min |
| 70 | Create Stale Time Config | Low | 30 min |
| 71 | Create Cache Time Config | Low | 30 min |
| 72 | Create Query Invalidation | Medium | 40 min |
| 73 | Create HTTP Cache Headers | Medium | 45 min |
| 74 | Create Browser Caching | Medium | 40 min |
| 75 | Create ETag Support | Medium | 50 min |
| 76 | Create CDN Configuration | Medium | 45 min |

---

## Task 69: Create TanStack Query Cache

### Overview
Implement TanStack Query (React Query) cache configuration with QueryClient setup and default options. Configure global cache behavior including retry logic, refetch settings, and error handling. This establishes the foundation for client-side data caching throughout the webstore.

### Dependencies
- Task 68: Create Pagination Component (from Group D)
- TanStack Query library installed
- Frontend project structure established

### Instructions

1. **Install TanStack Query dependencies**
   - Install `@tanstack/react-query` package
   - Install `@tanstack/react-query-devtools` for development
   - Verify installation in package.json

2. **Create query client configuration file**
   - Navigate to `frontend/lib/query/` directory
   - Create new file named `queryClient.ts`
   - This centralizes query client configuration

3. **Import required dependencies**
   - Import `QueryClient` from `@tanstack/react-query`
   - Import types for configuration options
   - Import any error handling utilities

4. **Configure QueryClient default options**
   - Define `defaultOptions` object for queries
   - Set retry logic (retry: 1 for failed requests)
   - Configure refetch behavior (refetchOnWindowFocus: false)
   - Set default staleTime and cacheTime (to be refined in Tasks 70-71)

5. **Create QueryClient instance**
   - Instantiate new QueryClient with default options
   - Export as singleton instance
   - Ensure single instance across application

6. **Configure query cache persistence (optional)**
   - Consider persisting query cache to localStorage
   - Configure which queries should persist
   - Set persistence key and expiration

7. **Set up error handling**
   - Define default error handler for all queries
   - Log errors appropriately for debugging
   - Handle network errors gracefully

8. **Create QueryClientProvider wrapper**
   - Create provider component to wrap application
   - Integrate with root layout or app component
   - Add React Query DevTools in development mode

### QueryClient Configuration Structure

| Option | Value | Purpose |
|--------|-------|---------|
| retry | 1 | Retry failed requests once |
| refetchOnWindowFocus | false | Don't refetch on tab focus |
| refetchOnMount | true | Refetch on component mount if stale |
| staleTime | Varies (Task 70) | Data freshness duration |
| cacheTime | Varies (Task 71) | Cache retention duration |

### Default Options Breakdown

```
queries:
  ├── retry: 1
  ├── refetchOnWindowFocus: false
  ├── refetchOnMount: true
  ├── refetchOnReconnect: true
  ├── staleTime: 0 (default, refined later)
  ├── cacheTime: 5 minutes (default)
  └── onError: globalErrorHandler

mutations:
  ├── retry: 0
  └── onError: globalErrorHandler
```

### Query Cache Layers

```
Component Request
       ↓
TanStack Query Cache (Memory)
       ↓
HTTP Request (if stale/missing)
       ↓
API Response
       ↓
Cache Updated
       ↓
Component Re-renders
```

### DevTools Integration

| Environment | DevTools | Purpose |
|-------------|----------|---------|
| Development | Enabled | Debug queries and cache |
| Staging | Enabled (optional) | Test cache behavior |
| Production | Disabled | Performance and security |

### Error Handling Strategy

| Error Type | Action | User Feedback |
|------------|--------|---------------|
| Network Error | Retry once | "Connection issue, retrying..." |
| 404 Not Found | No retry | Show error message |
| 500 Server Error | Retry once | "Server error, please try again" |
| Timeout | Retry once | "Request timeout, retrying..." |

### Expected Outcome
- QueryClient instance configured with default options
- Provider wrapping application root
- DevTools available in development
- Global error handling in place
- Foundation for granular cache configuration

### Verification Checklist
- [ ] `frontend/lib/query/queryClient.ts` file created
- [ ] QueryClient instantiated with default options
- [ ] Retry logic configured
- [ ] Refetch behavior set appropriately
- [ ] Error handling implemented
- [ ] Provider wraps application
- [ ] DevTools visible in development mode
- [ ] No console errors on initialization

---

## Task 70: Create Stale Time Config

### Overview
Configure stale time settings for different query types based on data volatility. Stale time determines how long cached data is considered fresh before triggering a background refetch. Optimize stale times to balance data freshness with reduced network requests.

### Dependencies
- Task 69: Create TanStack Query Cache

### Instructions

1. **Create cache configuration file**
   - Navigate to `frontend/lib/query/` directory
   - Create new file named `cacheConfig.ts`
   - This houses all cache timing configurations

2. **Analyze data volatility by query type**
   - Identify highly volatile data (cart, live inventory)
   - Identify moderately volatile data (products, categories)
   - Identify stable data (static content, user profile)

3. **Define stale time constants**
   - Create constant for each query type
   - Use milliseconds for precision
   - Group by data volatility category

4. **Configure stale time for products**
   - Set to 5 minutes (300000ms)
   - Products change moderately frequently
   - Balance freshness with performance

5. **Configure stale time for categories**
   - Set to 30 minutes (1800000ms)
   - Categories change infrequently
   - Longer stale time reduces requests

6. **Configure stale time for cart**
   - Set to 0 (always stale)
   - Cart requires real-time accuracy
   - Always fetch fresh data

7. **Configure stale time for user data**
   - Set to 10 minutes (600000ms)
   - User profile changes infrequently during session
   - Reasonable freshness with good caching

8. **Configure stale time for static content**
   - Set to 1 hour (3600000ms) or longer
   - Static pages, FAQs, policies rarely change
   - Maximum cache efficiency

9. **Create helper function for query-specific stale time**
   - Function accepts query type/key
   - Returns appropriate stale time value
   - Allows easy centralized updates

10. **Export stale time configuration**
    - Export all constants for use in queries
    - Export helper function
    - Document each configuration choice

### Stale Time Categories

| Category | Volatility | Typical Stale Time | Examples |
|----------|------------|-------------------|----------|
| Real-time | Very High | 0 (always stale) | Cart, live inventory |
| Frequent | High | 1-5 minutes | Products, prices |
| Moderate | Medium | 10-30 minutes | Categories, user profile |
| Stable | Low | 1+ hours | Static content, settings |

### Stale Time Configuration Table

| Query Type | Stale Time | Milliseconds | Rationale |
|------------|-----------|--------------|-----------|
| Products | 5 minutes | 300000 | Balance freshness/performance |
| Categories | 30 minutes | 1800000 | Infrequent changes |
| Cart | 0 (always) | 0 | Real-time accuracy required |
| User Profile | 10 minutes | 600000 | Session-stable data |
| Wishlist | 5 minutes | 300000 | User-modified data |
| Orders | 2 minutes | 120000 | Important transactional data |
| Static Pages | 1 hour | 3600000 | Rarely change |
| Product Reviews | 15 minutes | 900000 | Moderate volatility |
| Search Results | 5 minutes | 300000 | Dynamic but cacheable |

### Stale Time Impact Diagram

```
Stale Time = 0 (Cart)
Request → Always Fetch → Fresh Data
          (High Network)

Stale Time = 5 min (Products)
Request → Check Cache → Fresh? → Use Cache
                      → Stale? → Fetch + Update
          (Balanced)

Stale Time = 1 hour (Static)
Request → Check Cache → Fresh? → Use Cache
                      → Stale? → Fetch + Update
          (Low Network)
```

### Cache Freshness Flow

```
User navigates to Product Page
       ↓
Query checks cache
       ↓
Last fetch < 5 min? ──Yes──→ Use cached data
       │                     (No network request)
       No
       ↓
Fetch from API
       ↓
Update cache
       ↓
Render fresh data
```

### Stale Time vs Cache Time

| Aspect | Stale Time | Cache Time |
|--------|-----------|------------|
| Purpose | Data freshness | Memory retention |
| Effect | When to refetch | When to garbage collect |
| User Impact | Data accuracy | Memory usage |
| Network | Triggers requests | No network impact |

### Query-Specific Configuration Example

```
useQuery Configuration:
  queryKey: ['products', filters]
  staleTime: STALE_TIME.PRODUCTS (5 min)
  
Flow:
  First request → Fetch from API → Cache
  Within 5 min → Use cache (fresh)
  After 5 min → Background refetch (stale)
```

### Expected Outcome
- Stale time constants defined for all query types
- Configuration balances freshness and performance
- Helper function for easy stale time lookup
- Documentation explaining each choice
- Centralized configuration file

### Verification Checklist
- [ ] `frontend/lib/query/cacheConfig.ts` file created
- [ ] Stale time constants defined for all query types
- [ ] Cart set to 0 (always stale)
- [ ] Products set to 5 minutes
- [ ] Categories set to 30 minutes
- [ ] User data set to 10 minutes
- [ ] Static content set to 1+ hours
- [ ] Helper function implemented
- [ ] Constants exported properly
- [ ] Configuration documented

---

## Task 71: Create Cache Time Config

### Overview
Configure cache time (garbage collection time) for different query types. Cache time determines how long inactive cached data remains in memory before being garbage collected. Optimize cache times to balance memory usage with cache hit rates.

### Dependencies
- Task 69: Create TanStack Query Cache

### Instructions

1. **Understand cache time vs stale time**
   - Cache time: How long to keep unused data in memory
   - Stale time: How long data is considered fresh
   - Cache time should generally be longer than stale time

2. **Add cache time constants to cacheConfig.ts**
   - Extend existing configuration file
   - Create separate section for cache time settings
   - Use clear naming convention

3. **Configure cache time for products**
   - Set to 30 minutes (1800000ms)
   - Keep in memory longer than stale time
   - Improves cache hit rate for browsing

4. **Configure cache time for categories**
   - Set to 1 hour (3600000ms)
   - Categories accessed repeatedly across session
   - Long retention improves performance

5. **Configure cache time for cart**
   - Set to 10 minutes (600000ms)
   - Keep recent cart data available
   - Balance between freshness and availability

6. **Configure cache time for user data**
   - Set to 30 minutes (1800000ms)
   - User data accessed throughout session
   - Reasonable memory footprint

7. **Configure cache time for static content**
   - Set to 24 hours (86400000ms)
   - Static content rarely changes
   - Maximum memory efficiency

8. **Configure cache time for search results**
   - Set to 15 minutes (900000ms)
   - Users may revisit search results
   - Balance memory with usability

9. **Create helper function for cache time lookup**
   - Accept query type as parameter
   - Return appropriate cache time
   - Provide default fallback value

10. **Document cache time decisions**
    - Add comments explaining each choice
    - Reference memory usage considerations
    - Note relationship to stale time

### Cache Time Guidelines

| Data Access Pattern | Cache Time | Rationale |
|---------------------|------------|-----------|
| Frequently accessed | Long (1+ hours) | High cache hit rate |
| Moderate access | Medium (15-30 min) | Balance memory/hits |
| Infrequent access | Short (5-10 min) | Minimize memory usage |
| Session-critical | Session length | Keep while user active |

### Cache Time Configuration Table

| Query Type | Cache Time | Milliseconds | Memory Priority |
|------------|-----------|--------------|-----------------|
| Products | 30 minutes | 1800000 | Medium |
| Categories | 1 hour | 3600000 | High |
| Cart | 10 minutes | 600000 | Low |
| User Profile | 30 minutes | 1800000 | Medium |
| Wishlist | 20 minutes | 1200000 | Medium |
| Orders | 15 minutes | 900000 | Low |
| Static Pages | 24 hours | 86400000 | High |
| Product Reviews | 30 minutes | 1800000 | Medium |
| Search Results | 15 minutes | 900000 | Low |

### Stale Time vs Cache Time Relationship

```
Cache Time > Stale Time (Recommended)
────────────────────────────────────

Products:
  Stale: 5 min ──────┐
  Cache: 30 min ─────┴──→ 25 min buffer
                          (Stale but cached)

Categories:
  Stale: 30 min ──────┐
  Cache: 1 hour ──────┴──→ 30 min buffer

Cart:
  Stale: 0 ───────────┐
  Cache: 10 min ──────┴──→ Recent data available
```

### Cache Memory Lifecycle

```
Query First Request
       ↓
Data cached (Active)
       ↓
[Within Stale Time] → Fresh, no refetch
       ↓
[Beyond Stale Time, Within Cache Time]
       ↓
Data marked stale → Background refetch → Cache updated
       ↓
[Beyond Cache Time + No observers]
       ↓
Garbage collected → Removed from memory
```

### Memory Management Strategy

| Scenario | Action | Memory Impact |
|----------|--------|---------------|
| Active queries | Keep in cache | Normal usage |
| Inactive < cache time | Retain | Moderate usage |
| Inactive > cache time | Garbage collect | Memory freed |
| Memory pressure | Aggressive GC | Performance trade-off |

### Cache Time Tuning Factors

| Factor | Impact on Cache Time | Adjustment |
|--------|---------------------|------------|
| Memory constraints | Reduce cache time | Lower values |
| High traffic | Increase cache time | Higher values |
| Slow API | Increase cache time | Higher values |
| Real-time needs | Reduce cache time | Lower values |

### Configuration Examples

```
useQuery with custom cache time:
  queryKey: ['product', productId]
  staleTime: STALE_TIME.PRODUCTS
  cacheTime: CACHE_TIME.PRODUCTS

Effect:
  Stale after 5 min → Background refetch
  Cached for 30 min → Stays in memory
  After 30 min inactive → Garbage collected
```

### Expected Outcome
- Cache time constants defined for all query types
- Values optimized for memory and performance
- Cache time longer than stale time for each type
- Helper function for cache time lookup
- Documentation explaining memory trade-offs

### Verification Checklist
- [ ] Cache time constants added to `cacheConfig.ts`
- [ ] All query types have cache time configuration
- [ ] Cache time > stale time for each query type
- [ ] Products set to 30 minutes
- [ ] Categories set to 1 hour
- [ ] Cart set to 10 minutes
- [ ] Static content set to 24 hours
- [ ] Helper function implemented
- [ ] Configuration documented with rationale
- [ ] Memory impact considered

---

## Task 72: Create Query Invalidation

### Overview
Implement query invalidation strategies for mutations to ensure cache consistency. When data changes through mutations (add to cart, update product, login), automatically invalidate related queries to trigger refetches and keep UI in sync with server state.

### Dependencies
- Task 69: Create TanStack Query Cache

### Instructions

1. **Create mutation configuration file**
   - Navigate to `frontend/lib/query/` directory
   - Create file named `mutations.ts` or extend `cacheConfig.ts`
   - Define mutation-to-query invalidation mappings

2. **Understand query invalidation patterns**
   - Exact match: Invalidate specific query key
   - Prefix match: Invalidate all queries with prefix
   - Predicate match: Custom logic for invalidation
   - Choose appropriate pattern per mutation

3. **Configure cart mutation invalidations**
   - Add to cart → Invalidate `['cart']` queries
   - Update cart item → Invalidate `['cart']` queries
   - Remove from cart → Invalidate `['cart']` queries
   - Clear cart → Invalidate `['cart']` and `['cart-count']`

4. **Configure product mutation invalidations**
   - Update product → Invalidate `['products']` and specific `['product', id]`
   - Delete product → Invalidate `['products']` list
   - Add product review → Invalidate `['product', id]` and `['reviews', id]`

5. **Configure user mutation invalidations**
   - Login → Invalidate `['user']`, `['cart']`, `['wishlist']`
   - Logout → Invalidate all queries (reset cache)
   - Update profile → Invalidate `['user']` queries

6. **Configure wishlist mutation invalidations**
   - Add to wishlist → Invalidate `['wishlist']`
   - Remove from wishlist → Invalidate `['wishlist']`
   - Clear wishlist → Invalidate `['wishlist']`

7. **Configure order mutation invalidations**
   - Place order → Invalidate `['cart']`, `['orders']`, add new `['order', id]`
   - Update order → Invalidate specific `['order', id]`
   - Cancel order → Invalidate `['orders']` and `['order', id]`

8. **Implement optimistic updates (optional)**
   - Update cache immediately before mutation
   - Rollback on mutation failure
   - Improves perceived performance

9. **Create helper functions**
   - `invalidateCartQueries()` - Invalidates all cart queries
   - `invalidateProductQueries(productId?)` - Invalidates product queries
   - `invalidateUserQueries()` - Invalidates user-related queries
   - Centralize invalidation logic

10. **Handle mutation errors**
    - Revert optimistic updates on failure
    - Show error messages to user
    - Optionally refetch to ensure consistency

### Query Invalidation Patterns

| Pattern | Syntax | Use Case |
|---------|--------|----------|
| Exact Match | `['cart']` | Invalidate specific query |
| Prefix Match | `['products']` | Invalidate all product queries |
| Nested Match | `['product', id]` | Invalidate specific product |
| All Queries | `queryClient.clear()` | Logout, reset state |

### Mutation to Query Invalidation Map

| Mutation | Invalidated Queries | Reason |
|----------|-------------------|--------|
| Add to Cart | `['cart']`, `['cart-count']` | Cart state changed |
| Update Cart | `['cart']` | Item quantity/options changed |
| Remove from Cart | `['cart']`, `['cart-count']` | Item removed |
| Add to Wishlist | `['wishlist']` | Wishlist updated |
| Place Order | `['cart']`, `['orders']`, `['order', id]` | Cart cleared, new order |
| Login | `['user']`, `['cart']`, `['wishlist']` | User context changed |
| Logout | ALL | Clear user data |
| Update Profile | `['user']` | User data changed |
| Add Review | `['product', id]`, `['reviews', id]` | Product reviews changed |
| Update Product | `['products']`, `['product', id]` | Product data changed |

### Invalidation Flow Diagram

```
User Action (e.g., Add to Cart)
       ↓
Mutation Triggered
       ↓
API Request Sent
       ↓
Response Received
       ↓
onSuccess Callback
       ↓
Invalidate Queries: ['cart']
       ↓
TanStack Query marks cache stale
       ↓
Components using cart query
       ↓
Automatic Background Refetch
       ↓
UI Updates with Fresh Data
```

### Optimistic Update Pattern

```
Mutation Start
       ↓
Cancel outgoing queries (avoid overwrite)
       ↓
Snapshot current cache
       ↓
Optimistically update cache
       ↓
UI updates immediately
       ↓
Send API request
       ↓
Success → Keep optimistic update
       │
       └─ Failure → Rollback to snapshot
                 → Show error
                 → Refetch from server
```

### Helper Functions Structure

```
invalidateCartQueries()
  ├── Invalidates: ['cart']
  ├── Invalidates: ['cart-count']
  └── Refetches active cart queries

invalidateProductQueries(productId?)
  ├── If productId → ['product', productId]
  └── Else → All ['products'] queries

invalidateUserQueries()
  ├── Invalidates: ['user']
  ├── Invalidates: ['orders']
  └── Invalidates: ['wishlist']

invalidateAllQueries()
  └── queryClient.clear() (logout)
```

### Mutation Configuration Example

```
useMutation: addToCart
  onSuccess:
    1. Invalidate: ['cart']
    2. Invalidate: ['cart-count']
    3. Show success message
    4. Optional: Navigate to cart

useMutation: login
  onSuccess:
    1. Invalidate all queries
    2. Fetch fresh user data
    3. Fetch fresh cart
    4. Redirect to dashboard

useMutation: placeOrder
  onSuccess:
    1. Invalidate: ['cart']
    2. Invalidate: ['orders']
    3. Add: ['order', newOrderId]
    4. Navigate to order confirmation
```

### Cache Consistency Strategies

| Strategy | When to Use | Performance Impact |
|----------|-------------|-------------------|
| Immediate Invalidation | Critical data (cart, user) | High (refetch triggered) |
| Delayed Invalidation | Less critical | Medium (refetch on next mount) |
| Optimistic Update | Predictable changes | Low (immediate UI update) |
| No Invalidation | Independent data | None (eventual consistency) |

### Expected Outcome
- Comprehensive mutation invalidation mappings
- Helper functions for common invalidations
- Cache remains consistent with server state
- Optimistic updates for better UX (optional)
- Error handling with rollback capability

### Verification Checklist
- [ ] Mutation invalidation mappings defined
- [ ] Cart mutations invalidate cart queries
- [ ] Product mutations invalidate product queries
- [ ] User mutations invalidate user queries
- [ ] Login invalidates all user-related queries
- [ ] Logout clears entire cache
- [ ] Helper functions created
- [ ] Optimistic updates implemented (if applicable)
- [ ] Error handling with rollback
- [ ] UI updates automatically after mutations

---

## Task 73: Create HTTP Cache Headers

### Overview
Implement HTTP cache headers on the backend API to enable browser and CDN caching. Configure Cache-Control, Vary, and other HTTP caching directives to optimize repeated requests and reduce server load while ensuring data freshness.

### Dependencies
- Task 68: Create Pagination Component (API integration exists)
- Backend API endpoints established

### Instructions

1. **Create cache headers middleware**
   - Navigate to backend middleware directory
   - Create file named `cache_headers.py` or similar
   - Implement middleware to add cache headers to responses

2. **Understand HTTP cache directives**
   - `public`: Response can be cached by any cache
   - `private`: Response cached only by browser, not CDN
   - `max-age`: Time in seconds until cache expires
   - `s-maxage`: CDN-specific max age
   - `no-cache`: Must revalidate with server before use
   - `no-store`: Do not cache at all

3. **Configure cache headers for static endpoints**
   - Static content (images, CSS, JS): `Cache-Control: public, max-age=31536000`
   - Immutable assets: Add `immutable` directive
   - Long cache time since content-hashed

4. **Configure cache headers for product endpoints**
   - Product list: `Cache-Control: public, max-age=300, s-maxage=600`
   - 5 minutes browser, 10 minutes CDN
   - Balance freshness with caching benefits

5. **Configure cache headers for category endpoints**
   - Categories: `Cache-Control: public, max-age=1800, s-maxage=3600`
   - 30 minutes browser, 1 hour CDN
   - Categories change infrequently

6. **Configure cache headers for user-specific endpoints**
   - Cart, profile, orders: `Cache-Control: private, max-age=0, must-revalidate`
   - No CDN caching (private data)
   - Browser can cache temporarily with validation

7. **Configure cache headers for search endpoints**
   - Search results: `Cache-Control: public, max-age=300`
   - 5 minutes cache for common searches
   - Reduces load on search functionality

8. **Add Vary header for content negotiation**
   - Add `Vary: Accept-Encoding` for compressed responses
   - Add `Vary: Accept-Language` if multi-language
   - Ensures correct cached version served

9. **Implement cache busting for dynamic content**
   - Use ETags (Task 75) for validation
   - Include version or timestamp in query params
   - Invalidate cache when content updates

10. **Document caching strategy**
    - Create documentation explaining each endpoint's cache policy
    - Include rationale for cache duration choices
    - Provide examples of cache headers

### HTTP Cache Directives

| Directive | Effect | Use Case |
|-----------|--------|----------|
| public | Cacheable by anyone | Static resources, public APIs |
| private | Only browser caches | User-specific data |
| no-cache | Must revalidate | Dynamic content |
| no-store | Never cache | Sensitive data |
| max-age | Browser cache time | General caching |
| s-maxage | CDN cache time | CDN optimization |
| immutable | Never changes | Hashed assets |

### Cache Header Configuration by Endpoint

| Endpoint | Cache-Control | Rationale |
|----------|--------------|-----------|
| `/api/products` | `public, max-age=300, s-maxage=600` | Moderate freshness |
| `/api/products/{id}` | `public, max-age=300, s-maxage=600` | Individual product |
| `/api/categories` | `public, max-age=1800, s-maxage=3600` | Infrequent changes |
| `/api/cart` | `private, no-cache` | User-specific, real-time |
| `/api/user/profile` | `private, max-age=0, must-revalidate` | User data |
| `/api/orders` | `private, no-cache` | Transactional data |
| `/static/*` | `public, max-age=31536000, immutable` | Hashed assets |
| `/api/search` | `public, max-age=300` | Cacheable searches |

### Cache Header Structure

```
HTTP Response Headers:
  Cache-Control: public, max-age=300, s-maxage=600
  Vary: Accept-Encoding, Accept-Language
  ETag: "abc123def456"
  Last-Modified: Wed, 21 Oct 2026 07:28:00 GMT
```

### Cache Layer Flow

```
Browser Request
       ↓
Browser Cache Check
       ↓
Cache Hit (within max-age)?
  Yes → Return cached response
  No ↓
       ↓
CDN Cache Check
       ↓
Cache Hit (within s-maxage)?
  Yes → Return cached response
  No ↓
       ↓
Origin Server Request
       ↓
Server processes request
       ↓
Response with Cache-Control headers
       ↓
CDN caches (if public, within s-maxage)
       ↓
Browser caches (within max-age)
       ↓
Response to client
```

### Cache Time Recommendations

| Content Type | Browser Cache | CDN Cache | Reasoning |
|--------------|---------------|-----------|-----------|
| Static Assets | 1 year | 1 year | Immutable, content-hashed |
| Products | 5 minutes | 10 minutes | Moderate volatility |
| Categories | 30 minutes | 1 hour | Low volatility |
| User Data | 0 (validate) | 0 (no CDN) | Private, real-time |
| Search | 5 minutes | 5 minutes | Repeated queries |
| Static Pages | 1 hour | 1 hour | Infrequent updates |

### Vary Header Usage

| Vary Header | Purpose | When to Use |
|-------------|---------|-------------|
| Accept-Encoding | Different compression formats | All compressed responses |
| Accept-Language | Different languages | Multi-language sites |
| Authorization | Different auth states | Auth-dependent content |
| Accept | Different content types | API versioning |

### Middleware Implementation Pattern

```
Middleware Logic:
  1. Check request path/endpoint
  2. Determine if public or private
  3. Lookup cache duration for endpoint type
  4. Construct Cache-Control header
  5. Add Vary headers if needed
  6. Add to response headers
  7. Return response
```

### Expected Outcome
- HTTP cache headers applied to all API endpoints
- Appropriate cache durations per endpoint type
- Public vs private caching correctly configured
- Vary headers for content negotiation
- Reduced server load from repeated requests

### Verification Checklist
- [ ] Cache headers middleware created
- [ ] Static assets have long cache times
- [ ] Product endpoints have moderate cache times
- [ ] User-specific endpoints marked private
- [ ] Vary header added for compression
- [ ] Cache-Control header on all responses
- [ ] Documentation created for cache policy
- [ ] Browser DevTools show correct headers
- [ ] CDN respects cache directives (if applicable)
- [ ] No caching of sensitive data

---

## Task 74: Create Browser Caching

### Overview
Optimize browser caching behavior by configuring appropriate Cache-Control headers and meta tags. Implement caching strategies for different resource types to maximize cache hit rates while maintaining content freshness. Leverage browser cache to improve page load times and reduce bandwidth usage.

### Dependencies
- Task 73: Create HTTP Cache Headers

### Instructions

1. **Audit resource types in application**
   - Identify static assets (JS, CSS, images, fonts)
   - Identify HTML pages
   - Identify API responses
   - Categorize by volatility

2. **Configure static asset caching**
   - JS/CSS files: Long cache (1 year) with content hash
   - Images: Long cache (1 year) if properly versioned
   - Fonts: Long cache (1 year) with immutable directive
   - Ensure build process adds hashes to filenames

3. **Configure HTML page caching**
   - HTML: `no-cache` or short cache (5 min) with revalidation
   - Forces fresh check for page structure
   - Allows other resources to cache aggressively

4. **Configure API response caching**
   - Extend HTTP cache headers from Task 73
   - Ensure appropriate Cache-Control per endpoint
   - Coordinate with TanStack Query cache

5. **Implement cache busting strategies**
   - Use filename hashing for static assets
   - Add version query parameter for non-hashed files
   - Update references when content changes

6. **Configure service worker caching (prep for Task 79)**
   - Define caching strategies per resource type
   - Network-first, cache-first, or stale-while-revalidate
   - Prepare for offline support

7. **Add HTML meta tags for legacy support**
   - Add `<meta http-equiv="Cache-Control">` if needed
   - Primarily rely on HTTP headers
   - Meta tags as fallback for older browsers

8. **Test browser caching behavior**
   - Use browser DevTools Network tab
   - Verify cache status (from disk cache, from memory cache)
   - Check cache headers in response

9. **Monitor cache hit rates**
   - Track percentage of cached vs fresh requests
   - Analyze cache performance in analytics
   - Adjust cache times based on data

10. **Document caching strategy**
    - Create guide explaining caching per resource type
    - Include cache busting mechanisms
    - Provide troubleshooting tips

### Browser Cache Behavior

| Status | Meaning | Performance |
|--------|---------|-------------|
| from memory cache | Retrieved from RAM | Fastest (< 1ms) |
| from disk cache | Retrieved from storage | Fast (< 10ms) |
| 200 OK | Fetched from network | Slow (100ms+) |
| 304 Not Modified | Validation successful, use cache | Medium (50ms) |

### Resource Type Caching Strategy

| Resource | Cache Duration | Cache-Control | Bust Strategy |
|----------|---------------|---------------|---------------|
| JS Files | 1 year | `public, max-age=31536000, immutable` | Filename hash |
| CSS Files | 1 year | `public, max-age=31536000, immutable` | Filename hash |
| Images | 1 year | `public, max-age=31536000` | Filename or versioning |
| Fonts | 1 year | `public, max-age=31536000, immutable` | Rarely change |
| HTML | 0 or 5 min | `no-cache` or `max-age=300, must-revalidate` | N/A |
| API (GET) | Varies | Per endpoint (Task 73) | Query params |

### Cache Busting Mechanisms

```
Method 1: Filename Hashing (Recommended)
  Before: app.js
  After: app.abc123.js
  
  ✓ Automatic cache invalidation
  ✓ Build tool integration
  ✓ Best practice for static assets

Method 2: Query Parameters
  Before: app.js
  After: app.js?v=1.2.3
  
  ✓ Simple to implement
  ✗ Some proxies ignore query params
  ✓ Good for non-build assets

Method 3: Path Versioning
  Before: /static/app.js
  After: /static/v1.2.3/app.js
  
  ✓ Clear versioning
  ✗ More complex routing
  ✓ CDN-friendly
```

### Browser Cache Layers

```
Request for resource
       ↓
Memory Cache (RAM)
  ├── Hit? → Return (fastest)
  └── Miss ↓
       ↓
Disk Cache (Storage)
  ├── Hit? → Return (fast)
  └── Miss ↓
       ↓
Network Request
  ├── 304 Not Modified? → Use disk cache
  └── 200 OK → Download → Cache → Return
```

### Cache Control Strategies

| Strategy | Directive | Use Case |
|----------|-----------|----------|
| Long-term | `max-age=31536000, immutable` | Versioned static assets |
| Short-term | `max-age=300, must-revalidate` | Frequently updated content |
| Validation | `no-cache` | Always validate before use |
| No caching | `no-store` | Sensitive data |
| Conditional | `max-age=3600, stale-while-revalidate=86400` | Balance performance/freshness |

### Browser Cache Testing

| Test | Method | Expected Result |
|------|--------|-----------------|
| Initial Load | Load page, check Network tab | All 200 OK |
| Second Load | Refresh (F5) | Most from cache |
| Hard Refresh | Ctrl+F5 | All 200 OK |
| Navigation | Click link to same site | From cache |
| After Update | Deploy new version | New hashed files |

### Cache Debugging

| Issue | Symptom | Solution |
|-------|---------|----------|
| Stale JS/CSS | Old code runs after deploy | Check filename hashing |
| API too slow | Slow repeat requests | Increase cache time |
| Stale data | Old data displayed | Reduce cache time or use ETag |
| No caching | All requests hit network | Verify Cache-Control headers |

### Expected Outcome
- Static assets cached for 1 year with immutable directive
- HTML pages revalidated on each navigation
- API responses cached per Task 73 configuration
- Cache busting via filename hashing
- High cache hit rate for repeat visitors

### Verification Checklist
- [ ] Static assets have long cache times
- [ ] Filename hashing implemented for JS/CSS
- [ ] HTML pages have short cache or no-cache
- [ ] API responses have appropriate cache headers
- [ ] Browser DevTools shows "from cache" for repeat resources
- [ ] Hard refresh clears cache and refetches
- [ ] No stale resources after deployment
- [ ] Cache hit rate monitored
- [ ] Documentation created
- [ ] Performance improvement measurable

---

## Task 75: Create ETag Support

### Overview
Implement ETag (Entity Tag) support for conditional HTTP requests. ETags enable efficient cache validation by allowing clients to check if cached content is still valid without re-downloading. Combine with Cache-Control headers to optimize bandwidth and reduce server load.

### Dependencies
- Task 73: Create HTTP Cache Headers

### Instructions

1. **Understand ETag mechanism**
   - ETag: Unique identifier for resource version
   - If-None-Match: Client sends ETag to validate cache
   - 304 Not Modified: Server response if content unchanged
   - 200 OK: Server sends new content if changed

2. **Implement ETag generation**
   - Generate ETag from content hash (MD5, SHA-256)
   - Or use last-modified timestamp
   - Or use version number/revision ID
   - Ensure consistency across server instances

3. **Create ETag middleware**
   - Navigate to backend middleware directory
   - Create `etag_middleware.py` or extend cache middleware
   - Generate ETag for appropriate responses

4. **Add ETag to response headers**
   - Calculate ETag for response body
   - Add `ETag: "hash-value"` header
   - Format: Weak (`W/"hash"`) or strong (`"hash"`)

5. **Handle If-None-Match requests**
   - Check request for `If-None-Match` header
   - Compare with current ETag
   - Return 304 if match, 200 with content if different

6. **Configure ETag for API endpoints**
   - Product endpoints: Strong ETag based on data hash
   - Category endpoints: Strong ETag based on data hash
   - Search results: ETag based on query and results

7. **Combine ETag with Cache-Control**
   - Use `no-cache` with ETag for validation
   - Or use `max-age` with ETag for stale cache revalidation
   - Provides both caching and freshness guarantee

8. **Handle range requests with ETag**
   - Support `If-Range` header for partial content
   - Ensures range request matches ETag
   - Improves download resume reliability

9. **Test ETag validation**
   - First request: Receive ETag in response
   - Second request: Send If-None-Match with ETag
   - Verify 304 response if content unchanged
   - Verify 200 response if content changed

10. **Monitor ETag effectiveness**
    - Track 304 vs 200 response rates
    - Measure bandwidth savings
    - Analyze cache validation performance

### ETag Types

| Type | Format | When to Use |
|------|--------|-------------|
| Strong | `"abc123"` | Byte-for-byte identical |
| Weak | `W/"abc123"` | Semantically equivalent |

### ETag Generation Methods

| Method | Pros | Cons | Use Case |
|--------|------|------|----------|
| Content Hash | Accurate, stable | CPU overhead | Static files, API responses |
| Timestamp | Fast | Less precise | Frequently updated data |
| Version Number | Simple | Manual management | Versioned resources |
| Database Revision | Efficient | Requires DB field | CMS content |

### ETag Workflow

```
First Request (No Cache)
  Client → GET /api/products
  Server → Calculates content hash: "abc123"
         → 200 OK
         → Headers: ETag: "abc123"
                   Cache-Control: no-cache
         → Body: [products data]
  Client → Caches response with ETag

Second Request (Validate Cache)
  Client → GET /api/products
         → Headers: If-None-Match: "abc123"
  Server → Calculates current hash: "abc123"
         → Match! Content unchanged
         → 304 Not Modified
         → Headers: ETag: "abc123"
         → No body (saves bandwidth)
  Client → Uses cached data

Third Request (Content Changed)
  Client → GET /api/products
         → Headers: If-None-Match: "abc123"
  Server → Calculates current hash: "def456"
         → No match! Content changed
         → 200 OK
         → Headers: ETag: "def456"
         → Body: [updated products data]
  Client → Updates cache with new data and ETag
```

### HTTP Headers for ETag

| Header | Direction | Purpose |
|--------|-----------|---------|
| ETag | Response | Server sends current version ID |
| If-None-Match | Request | Client sends cached ETag for validation |
| If-Match | Request | Conditional update (optimistic locking) |
| If-Range | Request | Validate ETag before range request |

### ETag Configuration by Endpoint

| Endpoint | ETag Type | Generation Method | Cache-Control |
|----------|-----------|-------------------|---------------|
| `/api/products` | Strong | Data hash | `no-cache` |
| `/api/products/{id}` | Strong | Data + timestamp hash | `no-cache` |
| `/api/categories` | Strong | Data hash | `max-age=300, must-revalidate` |
| `/static/app.js` | Strong | File hash | `max-age=31536000, immutable` |
| `/api/search` | Weak | Query + results hash | `max-age=300` |

### ETag with Cache-Control Strategies

```
Strategy 1: Immediate Validation (no-cache)
  Cache-Control: no-cache
  ETag: "abc123"
  
  → Client always validates before using cache
  → Best for critical data
  → Minimal bandwidth if unchanged

Strategy 2: Timed Revalidation (max-age)
  Cache-Control: max-age=300, must-revalidate
  ETag: "abc123"
  
  → Client uses cache for 5 minutes
  → Then validates with ETag
  → Balance between freshness and performance

Strategy 3: Immutable with ETag (static assets)
  Cache-Control: max-age=31536000, immutable
  ETag: "abc123"
  
  → Client never revalidates (immutable)
  → ETag for debug/verification only
```

### Bandwidth Savings Calculation

```
Without ETag:
  Request 1: 200 OK (50 KB)
  Request 2: 200 OK (50 KB)
  Request 3: 200 OK (50 KB)
  Total: 150 KB

With ETag (unchanged content):
  Request 1: 200 OK (50 KB)
  Request 2: 304 Not Modified (~1 KB)
  Request 3: 304 Not Modified (~1 KB)
  Total: ~52 KB
  
  Savings: 65% bandwidth reduction
```

### ETag Middleware Implementation

```
Middleware Logic:
  1. Check if response should have ETag
  2. If If-None-Match header exists:
     a. Generate current ETag
     b. Compare with If-None-Match value
     c. If match → Return 304 (no body)
     d. If no match → Continue to step 3
  3. Generate response body
  4. Calculate ETag from body
  5. Add ETag header to response
  6. Return response
```

### Expected Outcome
- ETag header added to API responses
- If-None-Match validation implemented
- 304 Not Modified responses for unchanged content
- Bandwidth savings for repeat requests
- Combined with Cache-Control for optimal caching

### Verification Checklist
- [ ] ETag middleware created
- [ ] ETag generation implemented (hash or timestamp)
- [ ] ETag header added to responses
- [ ] If-None-Match request handling works
- [ ] 304 Not Modified returned for unchanged content
- [ ] 200 OK returned for changed content
- [ ] ETag combined with Cache-Control headers
- [ ] Browser DevTools shows ETag headers
- [ ] Bandwidth savings measurable
- [ ] Works across multiple API endpoints

---

## Task 76: Create CDN Configuration

### Overview
Configure Content Delivery Network (CDN) for the webstore to cache and serve static assets and cacheable API responses from edge locations. Implement CDN caching rules, optimize cache keys, and configure purge/invalidation mechanisms to reduce latency and improve global performance.

### Dependencies
- Task 68: Create Pagination Component (API structure exists)
- Deployment infrastructure (Vercel, Cloudflare, or custom CDN)

### Instructions

1. **Choose CDN provider**
   - Vercel: Automatic CDN for Next.js apps
   - Cloudflare: Configurable caching rules and Workers
   - AWS CloudFront: Custom configuration needed
   - Or other CDN provider

2. **Configure CDN for static assets**
   - Cache all files in `/static/`, `/_next/static/`
   - Set long cache times (1 year)
   - Enable compression (Gzip, Brotli)
   - Serve from nearest edge location

3. **Configure CDN caching rules**
   - Define which paths to cache
   - Set cache TTL per path pattern
   - Configure query string handling
   - Set cache key requirements

4. **Enable CDN for API responses (optional)**
   - Cache public API endpoints at edge
   - Respect `s-maxage` directive from Task 73
   - Configure cache keys (URL + query params)
   - Exclude user-specific endpoints

5. **Configure cache purging/invalidation**
   - Implement manual purge mechanism
   - Set up webhook for automatic invalidation
   - Purge on deployment or content update
   - Test purge functionality

6. **Optimize cache keys**
   - Include only necessary query parameters
   - Normalize URL case and trailing slashes
   - Strip irrelevant tracking parameters
   - Improve cache hit rate

7. **Configure compression**
   - Enable Brotli compression (preferred)
   - Enable Gzip compression (fallback)
   - Compress HTML, JS, CSS, JSON
   - Set appropriate `Vary: Accept-Encoding`

8. **Set up edge redirects**
   - Configure redirects at CDN level
   - Reduce origin server load
   - Handle www vs non-www
   - Implement trailing slash normalization

9. **Configure security headers at edge**
   - Add security headers via CDN
   - HSTS, CSP, X-Frame-Options
   - Reduce origin server processing
   - Improve security posture

10. **Monitor CDN performance**
    - Track cache hit ratio
    - Monitor edge response times
    - Analyze bandwidth savings
    - Review CDN analytics dashboard

### CDN Provider Comparison

| Provider | Auto-Setup | Caching Control | Edge Locations | Cost |
|----------|------------|----------------|----------------|------|
| Vercel | Yes (Next.js) | Moderate | Global | Free tier + usage |
| Cloudflare | Requires config | High | 300+ locations | Free tier + Pro |
| AWS CloudFront | Manual setup | Very high | 400+ locations | Pay per usage |
| Fastly | Manual setup | Very high | 60+ locations | Enterprise |

### CDN Caching Rules

| Path Pattern | Cache Behavior | TTL | Rationale |
|--------------|---------------|-----|-----------|
| `/_next/static/*` | Cache | 1 year | Immutable Next.js assets |
| `/static/*` | Cache | 1 year | Public static files |
| `/images/*` | Cache | 1 year | Image assets |
| `/api/products*` | Cache | 10 min | Cacheable API (s-maxage) |
| `/api/categories*` | Cache | 1 hour | Infrequent changes |
| `/api/cart*` | No cache | 0 | User-specific data |
| `/*.html` | Cache | 5 min | HTML pages with revalidation |

### CDN Configuration Structure

```
CDN Edge Location (e.g., Singapore)
  ↓
Request: /static/app.abc123.js
  ↓
Cache Check:
  ├── Hit → Return from edge (< 10ms)
  └── Miss ↓
      ↓
  Request to Origin Server
      ↓
  Origin responds with Cache-Control headers
      ↓
  CDN caches at edge per headers
      ↓
  Return to client
      ↓
  Subsequent requests served from edge
```

### Cache Key Optimization

| Factor | Impact on Cache | Recommendation |
|--------|----------------|----------------|
| URL Path | Required | Always include |
| Query Parameters | Fragments cache | Include only necessary params |
| HTTP Method | Different resources | Always include |
| Headers (Vary) | Different versions | Only critical headers |
| Cookies | User-specific | Exclude for public content |

### Query Parameter Handling

```
Example URL:
  /api/products?category=shoes&sort=price&utm_source=email

Cache Key Strategy:
  Include: category, sort (functional)
  Exclude: utm_source (tracking)
  
  Cache Key: /api/products?category=shoes&sort=price
  
  Result: Higher cache hit rate
```

### CDN Purging Strategies

| Trigger | Method | Scope | Use Case |
|---------|--------|-------|----------|
| Deployment | Automatic | All | New version deployed |
| Content Update | API call | Specific path | Product data changed |
| Manual | Dashboard | Custom | Debugging, testing |
| Webhook | Event-driven | Targeted | CMS content updated |
| TTL Expiration | Automatic | Individual | Natural cache expiry |

### Vercel CDN Configuration (Example)

```
Configuration in vercel.json:
{
  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/products",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=600, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

### Cloudflare Page Rules (Example)

```
Rule 1: Cache Static Assets
  URL Pattern: example.com/_next/static/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month

Rule 2: Cache API Responses
  URL Pattern: example.com/api/products*
  Cache Level: Cache Everything
  Edge Cache TTL: 10 minutes
  
Rule 3: Bypass User Data
  URL Pattern: example.com/api/cart*
  Cache Level: Bypass
```

### CDN Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cache Hit Ratio | > 90% | Cached / Total requests |
| Edge Response Time | < 50ms | Time to first byte at edge |
| Origin Offload | > 80% | Requests not reaching origin |
| Bandwidth Savings | > 60% | Cached bandwidth vs total |

### Expected Outcome
- CDN configured and operational
- Static assets cached at edge locations
- API responses cached per s-maxage directive
- Cache purge mechanism in place
- Improved global performance and reduced latency

### Verification Checklist
- [ ] CDN provider configured (Vercel/Cloudflare/other)
- [ ] Static assets cached at edge
- [ ] Cache rules defined for different paths
- [ ] API responses cached per Cache-Control headers
- [ ] Compression enabled (Brotli/Gzip)
- [ ] Cache purge mechanism works
- [ ] Cache hit ratio > 80%
- [ ] Response times < 100ms for cached content
- [ ] CDN analytics dashboard accessible
- [ ] Security headers configured at edge

---

## Summary

This document established comprehensive caching strategies for the webstore, covering client-side caching with TanStack Query, server-side HTTP caching, and CDN integration. These implementations significantly improve performance, reduce server load, and enhance user experience through faster page loads and reduced bandwidth usage.

### Completed Tasks
1. ✓ Created TanStack Query cache with QueryClient configuration
2. ✓ Configured stale time settings per query type
3. ✓ Configured cache time settings for memory management
4. ✓ Implemented query invalidation on mutations
5. ✓ Created HTTP cache headers for API responses
6. ✓ Implemented browser caching with Cache-Control
7. ✓ Added ETag support for cache validation
8. ✓ Configured CDN for global content delivery

### Next Steps
Proceed to [02_Tasks-77-82_Edge-Storage-Verify.md](02_Tasks-77-82_Edge-Storage-Verify.md) to implement asset caching, API edge caching, service worker preparation, cache busting, localStorage caching, and verify the complete caching strategy.
