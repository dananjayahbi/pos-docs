# Tasks 63-68: Prefetch, Cache, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** D - Static Generation & ISR  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-62_Static-ISR-Params.md](01_Tasks-53-62_Static-ISR-Params.md)

---

## Document Overview

This document covers the implementation of prefetch optimization, hover-based prefetching, build-time data caching, and comprehensive verification of ISR functionality. These final optimizations ensure that users experience instant navigation and that the static generation infrastructure works correctly and efficiently.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create Preload Links | Medium | 35 min |
| 64 | Create Link Prefetch | Low | 25 min |
| 65 | Create Hover Prefetch | Medium | 40 min |
| 66 | Create Build-time Data | Medium | 45 min |
| 67 | Create Static Props Cache | Medium | 40 min |
| 68 | Verify ISR Working | Low | 30 min |

---

## Task 63: Create Preload Links

### Overview
Implement strategic preload hints for critical resources to optimize initial page load and navigation. Preload links instruct the browser to fetch resources early, reducing wait times for subsequent navigation. This task focuses on preloading key pages and assets that users are likely to visit.

### Dependencies
- Task 53: Create Static Pages List

### Instructions

1. **Identify critical navigation paths**
   - Analyze user flow from analytics
   - Identify high-probability next pages
   - Map common navigation patterns
   - Prioritize homepage, category pages, popular products

2. **Add preload hints to homepage**
   - Navigate to `frontend/app/(storefront)/page.tsx`
   - Add Link headers or head elements for preload
   - Preload top category pages
   - Preload critical product images

3. **Implement Link header approach**
   - Use Next.js headers() API
   - Add Link headers with rel="preload" or rel="prefetch"
   - Specify resource type and priority
   - Apply to layout or page components

4. **Create priority levels**
   - Critical: Homepage navigation links
   - High: Popular categories, featured products
   - Medium: Secondary navigation, blog
   - Low: Footer links, utility pages

5. **Preload critical assets**
   - Hero images on homepage
   - Category banner images
   - Product placeholder images
   - Brand logos and icons

6. **Implement dynamic preload**
   - Based on user context (location, history)
   - Preload related categories
   - Preload complementary products
   - Use JavaScript for dynamic hints

7. **Monitor and optimize**
   - Track preload hit rate
   - Measure navigation speed improvement
   - Avoid over-preloading (bandwidth waste)
   - Test on mobile networks

### Preload Strategy

```
Navigation Flow Preloading:
├── Homepage
│   ├── Preload: Top 3 categories
│   ├── Preload: Featured product images
│   └── Preload: Common navigation targets
├── Category Page
│   ├── Preload: Related categories
│   ├── Preload: Top product images (first 6)
│   └── Preload: Category navigation
└── Product Page
    ├── Preload: Related products
    ├── Preload: Product images (gallery)
    └── Preload: Cart page (likely next step)
```

### Priority Matrix

| Resource | Priority | Trigger | Example |
|----------|----------|---------|---------|
| Hero image | Critical | Page load | Homepage banner |
| Category images | High | Above fold | Category cards |
| Product images | Medium | User intent | Hover on product |
| Related products | Low | Scroll proximity | Below fold content |

### Implementation Methods

| Method | Use Case | Syntax |
|--------|----------|--------|
| Link Header | Server-side | Link: </path>; rel=prefetch |
| HTML Link Tag | Head element | `<link rel="prefetch" href="...">` |
| JavaScript API | Dynamic | `document.createElement('link')` |
| next/link | Automatic | prefetch prop |

### Preload vs Prefetch

| Type | Behavior | Use Case |
|------|----------|----------|
| Preload | High priority, immediate | Critical resources |
| Prefetch | Low priority, idle time | Future navigation |
| Preconnect | DNS + TLS | External domains |
| DNS-Prefetch | DNS only | Multiple external resources |

### Resource Prioritization

```
Browser Priority Queue:
1. Critical: Current page HTML, CSS
2. High: Above-fold images, fonts
3. Medium: Preloaded resources
4. Low: Prefetched resources
5. Idle: Background prefetch

Preload Timing:
├── Synchronous: <link> in <head>
├── Early: Server Link headers
├── Async: JavaScript insertion
└── Lazy: On user interaction
```

### Dynamic Preload Example

```
Context-aware Preloading:
1. User on category "Electronics"
2. Preload related categories:
   - "Computers"
   - "Mobile Phones"
   - "Accessories"
3. User hovers on product
4. Preload that product page
5. User clicks
6. Page loads instantly (cached)

Implementation Levels:
├── Static: Always preload (homepage links)
├── Contextual: Based on current page
├── Behavioral: Based on user actions
└── Predictive: ML-based prediction (advanced)
```

### Performance Metrics

| Metric | Before | Target | Measurement |
|--------|--------|--------|-------------|
| Navigation Time | 800ms | < 200ms | Time to FCP |
| Cache Hit Rate | 60% | > 85% | Analytics |
| Bandwidth Usage | Baseline | +10-20% | Network tab |
| User Perceived Speed | N/A | Instant | User testing |

### Best Practices

| Practice | Rationale |
|----------|-----------|
| Limit preloads | Max 3-5 per page to avoid waste |
| Prioritize above-fold | Resources user sees first |
| Test on slow networks | Ensure no negative impact |
| Monitor cache hit rate | Validate preloads are used |
| Avoid over-fetching | Balance performance vs bandwidth |

### Expected Outcome
- Strategic preload hints for critical navigation paths
- Faster perceived navigation speed
- Improved cache hit rates for common paths
- Reduced time to first content for subsequent pages
- Optimized resource loading priority
- Better user experience with instant navigation

### Verification Checklist
- [ ] Critical navigation paths identified
- [ ] Preload hints added to homepage
- [ ] Category pages preload related content
- [ ] Product pages preload related products
- [ ] Priority levels assigned correctly
- [ ] Implementation method chosen (headers/tags/JS)
- [ ] Test navigation from homepage to category
- [ ] Network tab shows prefetched resources
- [ ] Subsequent navigation faster (<200ms)
- [ ] Mobile network testing completed
- [ ] No excessive bandwidth usage
- [ ] Cache hit rate improved

---

## Task 64: Create Link Prefetch

### Overview
Configure Next.js Link component prefetch behavior to automatically prefetch linked pages when they enter the viewport. Next.js Link components have built-in prefetch capabilities that can dramatically improve navigation performance when properly configured.

### Dependencies
- Task 63: Create Preload Links

### Instructions

1. **Understand default prefetch behavior**
   - next/link prefetches by default in production
   - Prefetch occurs when link enters viewport
   - Uses Intersection Observer API
   - Automatic for static and dynamic routes

2. **Audit existing Link components**
   - Search codebase for next/link usage
   - Identify links that should/shouldn't prefetch
   - Review prefetch prop usage
   - Document current state

3. **Configure prefetch for navigation**
   - Keep default prefetch=true for main navigation
   - Header navigation links (always visible)
   - Category cards on homepage
   - Product cards in listings

4. **Disable prefetch where inappropriate**
   - Add prefetch={false} to low-priority links
   - Footer links (below fold, low priority)
   - Utility links (contact, help)
   - External links (no benefit)
   - User-specific links (cart, account)

5. **Implement custom prefetch logic**
   - Create wrapper component if needed
   - Add conditional prefetch based on context
   - Consider user connection speed
   - Respect data-saver mode

6. **Optimize prefetch for lists**
   - Prefetch first 6-10 items only
   - Lazy load and prefetch on scroll
   - Balance coverage with bandwidth
   - Use priority thresholds

7. **Test and validate**
   - Verify prefetch in Network tab
   - Check prefetch respects revalidate times
   - Test on slow connections
   - Measure performance improvement

### Next.js Link Prefetch Behavior

```
Default Behavior (Production):
├── Link with href enters viewport
├── Intersection Observer triggers
├── Prefetch request initiated
├── Route data fetched and cached
└── Click navigation instant

Development Behavior:
├── Prefetch disabled by default
├── Enable with prefetch={true}
└── Helps avoid excessive dev requests

Prefetch Props:
- prefetch={true} (default production)
- prefetch={false} (opt-out)
- No prop = default behavior
```

### Prefetch Configuration Strategy

| Link Type | Prefetch | Rationale |
|-----------|----------|-----------|
| Header Navigation | true (default) | Always visible, high priority |
| Category Cards | true (default) | Above fold, likely clicks |
| Product Cards | true (default) | High navigation probability |
| Footer Links | false | Low priority, below fold |
| Related Products | true | Good chance of click |
| External Links | false | No benefit |
| User Account | false | User-specific, SSR |

### Link Component Usage

```
Standard Link (Prefetch Enabled):
import Link from 'next/link'

<Link href="/categories/electronics">
  Electronics
</Link>
// Prefetch: true (default)

Disable Prefetch:
<Link href="/contact" prefetch={false}>
  Contact Us
</Link>
// Prefetch: disabled

Conditional Prefetch:
<Link 
  href="/products/expensive-item"
  prefetch={!isSlowConnection}
>
  Product Name
</Link>
// Prefetch: based on connection
```

### Product List Prefetch Strategy

```
Product Grid Optimization:
├── First 6 products: Prefetch enabled
│   └── High probability of interaction
├── Products 7-12: Prefetch on scroll
│   └── Lazy prefetch as user scrolls
├── Products 13+: No prefetch
│   └── Too far down, unlikely to click
└── Hover: Immediate prefetch
    └── Override for any product on hover

Implementation:
- Use Intersection Observer for scroll tracking
- Conditionally render prefetch prop
- Balance performance with bandwidth
```

### Connection-Aware Prefetching

| Connection Type | Strategy | Behavior |
|-----------------|----------|----------|
| Fast (4G, WiFi) | Aggressive | Prefetch all links |
| Medium (3G) | Selective | Top links only |
| Slow (2G) | Conservative | Disable prefetch |
| Save-Data Mode | Disabled | Respect user preference |

### Intersection Observer Configuration

```
Prefetch Trigger Settings:
├── Root Margin: 50px
│   └── Prefetch slightly before entering viewport
├── Threshold: 0.1
│   └── Trigger when 10% visible
└── Once: true
    └── Only prefetch once per link

Custom Implementation (if needed):
1. Wrap Link in observer
2. Track viewport intersection
3. Dynamically set prefetch prop
4. Clean up observers
```

### Performance Monitoring

| Metric | Measurement | Target |
|--------|-------------|--------|
| Prefetch Rate | % links prefetched | 70-80% |
| Cache Hit on Click | % instant navigations | > 90% |
| Bandwidth Overhead | Prefetch vs actual | < 30% waste |
| Navigation Speed | Time to page interactive | < 300ms |

### Best Practices

| Practice | Implementation |
|----------|----------------|
| Prioritize visible links | Above fold gets prefetch |
| Limit aggressive prefetch | Max 10-15 at once |
| Respect user preferences | Check data-saver mode |
| Test on mobile | Verify mobile performance |
| Monitor cache hits | Ensure prefetches are used |
| Avoid over-prefetching | Balance speed vs bandwidth |

### Expected Outcome
- Optimized next/link prefetch configuration
- Intelligent prefetch based on link priority
- Faster navigation for high-probability links
- Reduced bandwidth waste from unnecessary prefetch
- Improved user experience with instant navigation
- Connection-aware prefetching for mobile users

### Verification Checklist
- [ ] All Link components audited
- [ ] Main navigation links use default prefetch
- [ ] Footer links have prefetch={false}
- [ ] Product cards prefetch first 6-10
- [ ] External links have prefetch={false}
- [ ] User-specific links have prefetch={false}
- [ ] Network tab shows prefetch requests
- [ ] Prefetch respects ISR revalidate times
- [ ] Click navigation instant for prefetched pages
- [ ] No excessive bandwidth usage
- [ ] Mobile network testing completed

---

## Task 65: Create Hover Prefetch

### Overview
Implement hover-based prefetching that predicts user navigation intent and prefetches pages when users hover over links. This advanced optimization provides near-instant navigation by fetching pages just before the user clicks, with minimal bandwidth waste.

### Dependencies
- Task 64: Create Link Prefetch

### Instructions

1. **Create prefetch utility function**
   - Navigate to `frontend/lib/performance/` directory
   - Create `prefetch.ts` utility file
   - Implement prefetch helper using Next.js router
   - Handle debouncing and deduplication

2. **Implement hover listener**
   - Create custom Link wrapper component
   - Add onMouseEnter event listener
   - Trigger prefetch on hover with delay
   - Use 100-200ms debounce to avoid false triggers

3. **Use Next.js router.prefetch()**
   - Import useRouter from next/navigation
   - Call router.prefetch(href) on hover
   - Prefetch occurs in background
   - Cached for instant click navigation

4. **Add touch device handling**
   - Detect touch devices
   - Skip hover prefetch on mobile (use viewport prefetch)
   - Or use touchstart with longer delay
   - Avoid wasting mobile bandwidth

5. **Implement prefetch tracking**
   - Track which links are hovered
   - Deduplicate prefetch requests
   - Cache prefetch promises
   - Prevent redundant fetches

6. **Apply to key components**
   - Product cards in listing pages
   - Category navigation links
   - Search result items
   - Related product links

7. **Add configuration options**
   - Enable/disable hover prefetch globally
   - Set delay time (default 100ms)
   - Configure for specific link types
   - Respect slow connections

### Hover Prefetch Architecture

```
User Interaction Flow:
1. User hovers over product link
2. onMouseEnter event fires
3. Debounce timer starts (100ms)
4. If still hovering after delay:
   ├── Call router.prefetch(url)
   ├── Fetch route data in background
   ├── Cache in client-side router
   └── Ready for instant navigation
5. User clicks (within seconds)
6. Navigation instant (data already fetched)

Timing Considerations:
├── Too short delay (< 50ms): Many false triggers
├── Optimal delay (100-200ms): Good balance
├── Too long delay (> 500ms): Miss opportunities
└── Average hover before click: 300-500ms
```

### Prefetch Utility Implementation

```
Utility Function Structure:

// lib/performance/prefetch.ts
import { useRouter } from 'next/navigation'

Key Features:
├── Debouncing (prevent rapid triggers)
├── Deduplication (track prefetched URLs)
├── Connection check (respect slow networks)
├── Touch detection (skip on mobile)
└── Error handling (graceful failures)

Usage:
const { handleHover } = usePrefetchOnHover()

<a 
  href="/products/item"
  onMouseEnter={() => handleHover('/products/item')}
>
  Product
</a>
```

### Debounce Configuration

| Delay | Use Case | Pros | Cons |
|-------|----------|------|------|
| 50ms | Aggressive | Max coverage | Many false triggers |
| 100ms | Balanced | Good coverage | Some waste |
| 200ms | Conservative | Minimal waste | Miss some hovers |
| 300ms | Very conservative | Almost no waste | Limited benefit |

### Device-Specific Strategy

```
Desktop (Pointer Device):
├── Enable hover prefetch
├── 100-150ms debounce
├── High confidence in intent
└── Good bandwidth availability

Mobile (Touch Device):
├── Disable hover prefetch
├── Use viewport-based prefetch instead
├── Touch != hover intent
└── Preserve bandwidth

Detection:
- Use matchMedia('(hover: hover)')
- Or check navigator.maxTouchPoints
- Or detect first interaction type
```

### Hover Prefetch Optimization

| Optimization | Description | Benefit |
|--------------|-------------|---------|
| Debouncing | Wait 100ms before prefetch | Avoid false triggers |
| Deduplication | Track prefetched URLs | Prevent redundant requests |
| Cache Reuse | Check if already cached | Save bandwidth |
| Priority Links | Only important links | Focus on high-value |
| Connection Check | Skip on slow connections | Respect bandwidth |

### Component Integration

```
Product Card with Hover Prefetch:

<div className="product-card">
  <Link
    href={`/products/${product.slug}`}
    onMouseEnter={handleHoverPrefetch}
  >
    <Image src={product.image} alt={product.name} />
    <h3>{product.name}</h3>
    <Price amount={product.price} />
  </Link>
</div>

Benefits per Product:
├── Hover: Prefetch in background (100ms delay)
├── Click: Instant navigation (< 50ms)
└── User Experience: Feels instantaneous
```

### Performance Impact

| Metric | Without Hover Prefetch | With Hover Prefetch | Improvement |
|--------|------------------------|---------------------|-------------|
| Click to FCP | 600-800ms | 50-100ms | 85% faster |
| Click to LCP | 1200-1500ms | 200-400ms | 75% faster |
| False Prefetches | 0% | 10-20% | Acceptable waste |
| Navigation Feel | Noticeable delay | Instant | Significant |

### Best Practices

| Practice | Rationale |
|----------|-----------|
| Use debouncing | Prevent accidental triggers |
| Check device type | Skip on touch devices |
| Deduplicate requests | Avoid redundant fetches |
| Monitor prefetch rate | Track waste vs benefit |
| Respect user settings | Honor data-saver mode |
| Test hover timing | Find optimal delay |

### Expected Outcome
- Hover-based prefetching for product and category links
- Near-instant navigation after hover (50-100ms)
- Minimal bandwidth waste through debouncing
- Device-aware prefetching (desktop only)
- Improved perceived performance
- Better user experience with predictive loading

### Verification Checklist
- [ ] Prefetch utility created in lib/performance/
- [ ] Debounce implemented (100-150ms)
- [ ] Deduplication logic in place
- [ ] Device detection (skip mobile)
- [ ] Applied to product cards
- [ ] Applied to category links
- [ ] Applied to navigation items
- [ ] Test hover → navigation speed
- [ ] Network tab shows prefetch on hover
- [ ] Click navigation instant (< 100ms)
- [ ] No prefetch on mobile touch
- [ ] Prefetch tracking/logging works
- [ ] Connection check respects slow networks

---

## Task 66: Create Build-time Data

### Overview
Implement comprehensive build-time data fetching to ensure all necessary data is fetched once during the build process and reused across pages. This eliminates redundant API calls at runtime and improves build efficiency and consistency.

### Dependencies
- Task 53: Create Static Pages List

### Instructions

1. **Identify reusable data sets**
   - Categories (used across multiple pages)
   - Site configuration (footer, header)
   - Menu structure (navigation)
   - Global settings (currency, language)
   - Popular products (featured in multiple places)

2. **Create build-time data fetching module**
   - Navigate to `frontend/lib/data/` directory
   - Create `build-data.ts` module
   - Implement functions to fetch and cache data
   - Export for use in generateStaticParams and pages

3. **Fetch categories at build time**
   - Implement getCategoriesAtBuild() function
   - Fetch all active categories once
   - Cache in memory during build
   - Reuse across all pages needing categories

4. **Fetch site configuration**
   - Fetch global settings from API/CMS
   - Include footer content, navigation menus
   - Store in build-time cache
   - Use in layout components

5. **Implement caching mechanism**
   - Use Map or object to cache fetched data
   - Key by data type (categories, config, etc.)
   - Ensure data fetched only once per build
   - Provide cache invalidation if needed

6. **Create helper functions**
   - getCachedCategories(): Returns cached categories
   - getCachedConfig(): Returns cached config
   - fetchAndCache(key, fetcher): Generic caching
   - clearBuildCache(): For testing

7. **Integrate with generateStaticParams**
   - Use cached data in generateStaticParams functions
   - Avoid re-fetching categories for each route
   - Improve build time efficiency
   - Ensure data consistency

8. **Document build data flow**
   - Create documentation for build-time data
   - Explain what data is cached and why
   - Provide usage examples
   - Note limitations and constraints

### Build-time Data Architecture

```
Build Process Data Flow:
├── Build Starts
│   ├── Initialize empty cache
│   └── Clear previous state
├── First Data Request (e.g., categories)
│   ├── Check cache (empty)
│   ├── Fetch from API
│   ├── Store in cache
│   └── Return data
├── Subsequent Requests
│   ├── Check cache (hit)
│   ├── Return cached data
│   └── No API call
└── Build Completes
    └── Cache discarded

Benefits:
├── Single API call per data type
├── Faster build times
├── Data consistency across pages
└── Reduced API load
```

### Reusable Data Sets

| Data Type | Usage | Fetch Frequency | Cache Key |
|-----------|-------|-----------------|-----------|
| Categories | Navigation, generateStaticParams | Once | 'categories' |
| Site Config | Layout, footer, header | Once | 'site-config' |
| Menu Structure | Navigation component | Once | 'menus' |
| Popular Products | Homepage, recommendations | Once | 'popular-products' |
| Global Settings | Currency, locale, theme | Once | 'settings' |

### Caching Implementation

```
Build-time Cache Structure:

// In-memory cache (simple)
const buildCache = new Map()

async function fetchAndCache<T>(
  key: string, 
  fetcher: () => Promise<T>
): Promise<T> {
  // Check cache
  if (buildCache.has(key)) {
    console.log(`[Build Cache] Hit: ${key}`)
    return buildCache.get(key)
  }
  
  // Fetch and cache
  console.log(`[Build Cache] Miss: ${key}, fetching...`)
  const data = await fetcher()
  buildCache.set(key, data)
  return data
}

Usage Examples:
- const categories = await fetchAndCache('categories', fetchCategories)
- const config = await fetchAndCache('site-config', fetchSiteConfig)
```

### Build Data Module Structure

```
frontend/lib/data/build-data.ts

Exports:
├── getCategoriesAtBuild()
│   └── Returns all categories (cached)
├── getSiteConfigAtBuild()
│   └── Returns site configuration (cached)
├── getPopularProductsAtBuild()
│   └── Returns popular products (cached)
├── getMenusAtBuild()
│   └── Returns menu structures (cached)
└── clearBuildCache()
    └── Clear cache (testing only)

Internal:
├── buildCache: Map<string, any>
├── fetchAndCache<T>(key, fetcher)
└── Cache invalidation logic
```

### Usage in generateStaticParams

```
Before (Multiple API Calls):
// products/[slug]/page.tsx
export async function generateStaticParams() {
  const products = await fetchProducts() // API call 1
  return products.map(p => ({ slug: p.slug }))
}

// categories/[slug]/page.tsx
export async function generateStaticParams() {
  const categories = await fetchCategories() // API call 2
  return categories.map(c => ({ slug: c.slug }))
}

// blog/[slug]/page.tsx
export async function generateStaticParams() {
  const categories = await fetchCategories() // API call 3 (redundant!)
  // ... use categories for blog organization
}

After (Single API Call with Cache):
// products/[slug]/page.tsx
import { getCategoriesAtBuild } from '@/lib/data/build-data'

export async function generateStaticParams() {
  const categories = await getCategoriesAtBuild() // Fetched once
  // ... generate params
}

// categories/[slug]/page.tsx
export async function generateStaticParams() {
  const categories = await getCategoriesAtBuild() // Cached, instant
  return categories.map(c => ({ slug: c.slug }))
}

// blog/[slug]/page.tsx
export async function generateStaticParams() {
  const categories = await getCategoriesAtBuild() // Cached, instant
  // ... use for blog
}

Result:
- Categories fetched once
- All functions use cached data
- Faster build times
- Data consistency guaranteed
```

### Build Time Optimization

| Metric | Without Caching | With Caching | Improvement |
|--------|-----------------|--------------|-------------|
| API Calls (Categories) | 10-20 | 1 | 90-95% reduction |
| Build Time | 8-10 min | 4-6 min | 40-50% faster |
| Data Consistency | Possible drift | Guaranteed | Perfect |
| API Load | High | Minimal | 95% reduction |

### Data Consistency Benefits

| Scenario | Risk Without Cache | Benefit With Cache |
|----------|-------------------|-------------------|
| Category changes during build | Different pages see different data | All pages consistent |
| Multiple route generation | Race conditions possible | Single source of truth |
| Long builds | Data may change mid-build | Snapshot at build start |

### Best Practices

| Practice | Implementation |
|----------|----------------|
| Cache early | Fetch global data first |
| Document cache | Explain what's cached |
| Type safety | Use TypeScript for cache |
| Error handling | Graceful cache failures |
| Testing | Clear cache between tests |
| Logging | Log cache hits/misses |

### Expected Outcome
- Centralized build-time data fetching
- In-memory caching during build process
- Single API call per data type
- Faster build times (40-50% improvement)
- Guaranteed data consistency across pages
- Reduced API load during builds
- Improved build reliability

### Verification Checklist
- [ ] Build data module created in lib/data/
- [ ] Caching mechanism implemented
- [ ] getCategoriesAtBuild() function created
- [ ] getSiteConfigAtBuild() function created
- [ ] Cache reuse verified (check logs)
- [ ] generateStaticParams functions updated
- [ ] Build time measured (before/after)
- [ ] Build logs show cache hits
- [ ] Data consistency across pages verified
- [ ] API call count reduced
- [ ] Documentation created

---

## Task 67: Create Static Props Cache

### Overview
Implement intelligent caching of static props data across pages to minimize redundant data fetching and improve build efficiency. This extends build-time caching to page-level data, ensuring that shared data is fetched once and reused intelligently across multiple page generations.

### Dependencies
- Task 66: Create Build-time Data

### Instructions

1. **Extend build-time cache for page data**
   - Build on Task 66's caching infrastructure
   - Add page-specific data caching
   - Cache product data, blog posts, etc.
   - Implement cache expiration within build

2. **Implement cache key strategy**
   - Create unique keys for cached data
   - Include data type, identifier, and version
   - Example: 'product:laptop-x123:v1'
   - Ensure no collisions

3. **Cache product data**
   - When fetching product for page generation
   - Cache full product object
   - Reuse if same product requested again
   - Common in related products scenarios

4. **Cache category data with products**
   - When generating category page
   - Cache category + associated products
   - Reuse when category referenced elsewhere
   - Avoid re-fetching category details

5. **Implement cache warming**
   - Pre-fetch and cache common data
   - Warm cache with popular products
   - Cache before parallel page generation
   - Improve overall build speed

6. **Add cache size management**
   - Monitor cache size during build
   - Implement LRU (Least Recently Used) eviction
   - Set reasonable size limits
   - Prevent memory issues

7. **Create cache statistics**
   - Track cache hits and misses
   - Calculate cache effectiveness
   - Log statistics at build end
   - Identify optimization opportunities

8. **Integrate with page components**
   - Update page data fetching to use cache
   - Check cache before API calls
   - Store fetched data in cache
   - Seamless integration

### Static Props Cache Architecture

```
Page Generation with Cache:
├── Page 1: Product A
│   ├── Check cache for Product A: Miss
│   ├── Fetch from API
│   ├── Store in cache
│   └── Generate page
├── Page 2: Product B
│   ├── Fetch (not in cache)
│   └── Generate page
├── Page 3: Related products (includes A, B)
│   ├── Check cache for Product A: Hit!
│   ├── Check cache for Product B: Hit!
│   ├── No API calls needed
│   └── Generate page instantly
└── Build Statistics
    ├── API Calls: 2 (instead of 4)
    ├── Cache Hits: 2
    └── Time Saved: 40%
```

### Cache Key Strategy

| Data Type | Key Format | Example |
|-----------|------------|---------|
| Product | `product:{slug}` | product:laptop-x123 |
| Category | `category:{slug}` | category:electronics |
| Blog Post | `blog:{slug}` | blog:guide-to-shopping |
| CMS Page | `cms:{slug}` | cms:about-us |
| Related Products | `related:{productId}` | related:p123 |

### Cache Implementation

```
Enhanced Build Cache:

const buildCache = new Map()
const cacheStats = {
  hits: 0,
  misses: 0,
  size: 0
}

async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions
): Promise<T> {
  // Check cache
  if (buildCache.has(key)) {
    cacheStats.hits++
    console.log(`[Cache HIT] ${key}`)
    return buildCache.get(key)
  }
  
  // Fetch and cache
  cacheStats.misses++
  console.log(`[Cache MISS] ${key}`)
  const data = await fetcher()
  
  // Store in cache
  buildCache.set(key, data)
  cacheStats.size = buildCache.size
  
  return data
}

function logCacheStats() {
  const hitRate = (cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100
  console.log(`
    Cache Statistics:
    - Hits: ${cacheStats.hits}
    - Misses: ${cacheStats.misses}
    - Hit Rate: ${hitRate.toFixed(1)}%
    - Cache Size: ${cacheStats.size} entries
  `)
}
```

### Cache Warming Strategy

```
Cache Warming Before Build:
1. Identify high-frequency data
2. Pre-fetch and cache:
   ├── All categories
   ├── Top 50 popular products
   ├── Site configuration
   └── Menu structures
3. Start page generation
4. Pages hit warm cache
5. Faster overall build

Implementation:
async function warmCache() {
  console.log('[Cache] Warming cache...')
  await Promise.all([
    getCachedData('all-categories', fetchCategories),
    getCachedData('popular-products', fetchPopularProducts),
    getCachedData('site-config', fetchSiteConfig),
    getCachedData('menus', fetchMenus)
  ])
  console.log('[Cache] Warm-up complete')
}

Call before generateStaticParams
```

### Cache Scenarios

| Scenario | Without Cache | With Cache | Benefit |
|----------|---------------|------------|---------|
| Product + Related | 4 API calls | 1 API call + 3 hits | 75% reduction |
| Category pages | 10 calls | 1 call + 9 hits | 90% reduction |
| Repeated data | N calls | 1 call + (N-1) hits | (N-1)/N reduction |
| Build time | 10 minutes | 6 minutes | 40% faster |

### Cache Size Management

```
LRU Cache Implementation:
├── Max entries: 1000 (configurable)
├── Eviction: Least recently used
├── Check before insert:
│   ├── If size < max: Insert
│   └── If size >= max: Evict oldest, insert
└── Memory efficient for large builds

Memory Estimates:
- Small build (500 pages): ~50 MB cache
- Medium build (2000 pages): ~200 MB cache
- Large build (10000 pages): ~500 MB cache
```

### Integration with Pages

```
Product Page with Cache:

// app/(storefront)/products/[slug]/page.tsx
async function Page({ params }) {
  const product = await getCachedData(
    `product:${params.slug}`,
    () => fetchProduct(params.slug)
  )
  
  const related = await getCachedData(
    `related:${product.id}`,
    () => fetchRelatedProducts(product.id)
  )
  // related products likely already cached!
  
  return <ProductDetail product={product} related={related} />
}

Benefits:
- First product page: Cache miss, fetch
- Related products: Likely cache hits
- Second occurrence: Instant from cache
```

### Cache Statistics

| Metric | Target | Purpose |
|--------|--------|---------|
| Hit Rate | > 60% | Measure effectiveness |
| Miss Rate | < 40% | Identify opportunities |
| Cache Size | 500-1000 entries | Balance memory |
| API Call Reduction | > 50% | Validate benefit |
| Build Time Reduction | > 30% | Overall improvement |

### Expected Outcome
- Intelligent caching of page-level data
- Reduced API calls during build (50%+ reduction)
- Faster build times (30-40% improvement)
- Memory-efficient cache management
- Cache statistics for monitoring
- Seamless integration with page generation
- Improved build reliability

### Verification Checklist
- [ ] Static props cache module created
- [ ] Cache key strategy implemented
- [ ] getCachedData() helper function works
- [ ] Product data caching implemented
- [ ] Category data caching implemented
- [ ] Cache warming strategy in place
- [ ] Cache size management implemented
- [ ] Cache statistics logging implemented
- [ ] Build logs show cache hits/misses
- [ ] Cache hit rate > 60%
- [ ] API calls reduced significantly
- [ ] Build time improved by 30%+
- [ ] No memory issues during build

---

## Task 68: Verify ISR Working

### Overview
Conduct comprehensive testing and verification of the entire ISR (Incremental Static Regeneration) implementation to ensure static generation, revalidation, on-demand updates, and caching all work correctly. This final task validates that the performance optimizations deliver the expected benefits.

### Dependencies
- Task 67: Create Static Props Cache

### Instructions

1. **Create verification test plan**
   - Document all ISR features to test
   - Define success criteria for each
   - Create checklist of verification steps
   - Assign priorities (critical, high, medium)

2. **Test static page generation**
   - Run production build (`npm run build`)
   - Verify static pages generated
   - Check `.next/server/app/` directory
   - Confirm HTML files exist for static routes

3. **Test ISR revalidation**
   - Start production server
   - Request page multiple times within revalidate period
   - Verify same content served (cache hit)
   - Wait for revalidation period to expire
   - Request again and verify background revalidation

4. **Test on-demand revalidation**
   - Make content change in CMS/database
   - Call revalidation API endpoint
   - Verify immediate cache invalidation
   - Check next request serves updated content
   - Confirm no need to wait for timed revalidation

5. **Verify cache headers**
   - Inspect HTTP response headers
   - Check for x-nextjs-cache header
   - Values: HIT, MISS, STALE
   - Verify cache-control headers
   - Confirm CDN caching behavior

6. **Test generateStaticParams**
   - Verify pre-generated pages exist at build
   - Test URL for pre-generated page (should be instant)
   - Test URL for non-generated but valid page
   - Verify fallback behavior works correctly

7. **Test prefetch functionality**
   - Open homepage in browser
   - Observe Network tab in DevTools
   - Verify prefetch requests triggered
   - Hover over links and check hover prefetch
   - Confirm prefetched pages load instantly

8. **Measure performance improvements**
   - Use Lighthouse to audit pages
   - Record Core Web Vitals (LCP, FID, CLS)
   - Compare against baseline (before ISR)
   - Verify TTFB < 100ms for static pages
   - Confirm LCP < 2.5s

9. **Test different page types**
   - Homepage (static + ISR)
   - Category pages (static + ISR)
   - Product pages (ISR)
   - Blog posts (static + ISR)
   - CMS pages (static)

10. **Verify error handling**
    - Test with API down during revalidation
    - Verify stale content served
    - Test invalid page slugs (should 404)
    - Verify not-found.tsx displays correctly
    - Check error logging works

11. **Load testing**
    - Simulate high traffic to static pages
    - Verify CDN serves without origin requests
    - Monitor cache hit rate (should be > 95%)
    - Confirm server load minimal

12. **Document results**
    - Create verification report
    - Include performance metrics
    - Document any issues found
    - Provide recommendations

### Verification Test Matrix

| Feature | Test | Success Criteria | Priority |
|---------|------|------------------|----------|
| Static Generation | Build produces HTML | Files in .next/server/ | Critical |
| ISR Revalidation | Time-based updates | Content updates after revalidate period | Critical |
| On-demand Revalidation | API triggers update | Immediate cache clear | High |
| Cache Headers | Response headers correct | x-nextjs-cache present | Medium |
| generateStaticParams | Pages pre-generated | Popular pages instant | High |
| Link Prefetch | Auto-prefetch works | Network shows prefetch | Medium |
| Hover Prefetch | Hover triggers fetch | Network shows fetch | Medium |
| Fallback | Non-generated pages work | On-demand generation | High |
| 404 Handling | Invalid slugs show 404 | not-found.tsx displays | Medium |
| Performance | Core Web Vitals | LCP < 2.5s, TTFB < 100ms | Critical |

### Testing Commands

```
Build and Verify:
1. npm run build
   - Check output for static pages generated
   - Look for "○" (static) and "ISR" indicators

2. npm run start
   - Start production server
   - Test on localhost:3000

3. Inspect build output:
   - .next/server/app/(storefront)/page.html (homepage)
   - .next/server/app/(storefront)/categories/[slug]/ (categories)
   - .next/server/app/(storefront)/products/[slug]/ (products)

4. Test revalidation API:
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret":"your-secret","path":"/products/test"}'
```

### Cache Header Verification

```
Expected Headers:

Static Page (First Request):
x-nextjs-cache: MISS
age: 0

Static Page (Subsequent):
x-nextjs-cache: HIT
age: 300 (seconds since generation)
cache-control: s-maxage=3600, stale-while-revalidate

ISR Page (Fresh):
x-nextjs-cache: HIT
age: 100

ISR Page (Revalidating):
x-nextjs-cache: STALE
(serving stale while regenerating)

Check with:
curl -I https://yourdomain.com/products/item
```

### Performance Metrics

| Metric | Baseline (SSR) | Target (ISR) | Actual | Pass/Fail |
|--------|----------------|--------------|--------|-----------|
| TTFB | 500-1000ms | < 100ms | ___ ms | ___ |
| LCP | 3-5s | < 2.5s | ___ s | ___ |
| FID | 100-200ms | < 100ms | ___ ms | ___ |
| CLS | 0.1-0.25 | < 0.1 | ___ | ___ |
| Cache Hit Rate | N/A | > 95% | ___ % | ___ |
| Server Load | 100% | < 10% | ___ % | ___ |

### Revalidation Testing

```
Time-based Revalidation Test:
1. Note revalidate time (e.g., 3600 = 1 hour)
2. Request page, note timestamp and content
3. Request again within period:
   - Should serve cached version
   - Headers: x-nextjs-cache: HIT
4. Wait for revalidate period + 1 minute
5. Request again:
   - Should serve stale immediately
   - Triggers background revalidation
   - Headers: x-nextjs-cache: STALE
6. Request after revalidation completes:
   - Should serve fresh content
   - Headers: x-nextjs-cache: HIT

On-demand Revalidation Test:
1. Update content in CMS
2. Call /api/revalidate with path
3. Immediately request page
4. Should see updated content
5. No need to wait for time-based revalidate
```

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Pages not static | Missing generateStaticParams | Add function to route |
| Revalidation not working | Incorrect revalidate value | Check export const revalidate |
| On-demand fails | Wrong secret | Verify REVALIDATION_SECRET env |
| Slow builds | Too many pages generated | Limit generateStaticParams |
| High miss rate | Short revalidate time | Increase revalidate value |
| Stale content | Revalidation failing | Check API availability |

### Verification Checklist

```
Build Verification:
- [ ] npm run build completes successfully
- [ ] Static pages generated in .next/server/
- [ ] Build output shows static (○) indicators
- [ ] No build errors or warnings

Static Generation:
- [ ] Homepage generated statically
- [ ] Category pages generated statically
- [ ] Popular products pre-generated
- [ ] Blog posts generated statically
- [ ] CMS pages generated statically

ISR Functionality:
- [ ] Product pages use ISR
- [ ] Revalidation time configured correctly
- [ ] Time-based revalidation works
- [ ] On-demand revalidation works
- [ ] Stale-while-revalidate behavior correct

Cache Behavior:
- [ ] Cache headers present and correct
- [ ] HIT/MISS/STALE statuses observed
- [ ] Cache hit rate > 95%
- [ ] CDN caching works (if applicable)

Prefetch:
- [ ] Link prefetch works (viewport)
- [ ] Hover prefetch works (desktop)
- [ ] No prefetch on mobile (touch)
- [ ] Prefetched pages load instantly

Performance:
- [ ] TTFB < 100ms for static pages
- [ ] LCP < 2.5s
- [ ] Core Web Vitals pass
- [ ] Lighthouse score > 90

Error Handling:
- [ ] Invalid URLs show 404
- [ ] not-found.tsx displays correctly
- [ ] API failures handled gracefully
- [ ] Stale content served during errors

Documentation:
- [ ] Verification report created
- [ ] Metrics documented
- [ ] Issues logged
- [ ] Recommendations provided
```

### Expected Outcome
- Complete verification of ISR implementation
- All static generation features working correctly
- Revalidation (time-based and on-demand) functioning
- Cache behavior as expected
- Prefetch optimizations active
- Performance targets met or exceeded
- Core Web Vitals in green zone
- Production-ready ISR infrastructure
- Documented test results and metrics

### Final Deliverables
- [ ] Verification test report
- [ ] Performance benchmark results
- [ ] Cache effectiveness metrics
- [ ] Issue log (if any)
- [ ] Recommendations for optimization
- [ ] Production deployment approval

---

## Summary

This document completed the static generation and ISR implementation with prefetch optimizations and comprehensive verification. It covered strategic preload links for critical resources, automatic link prefetch configuration, hover-based predictive prefetching, build-time data caching for efficiency, static props caching across pages, and thorough verification of the entire ISR system.

### Completed Tasks
1. ✓ Created strategic preload links for critical navigation
2. ✓ Configured next/link prefetch for optimal performance
3. ✓ Implemented hover prefetch for predictive loading
4. ✓ Created build-time data fetching and caching
5. ✓ Implemented static props cache for build efficiency
6. ✓ Verified complete ISR functionality and performance

### Performance Achievements
- Navigation Speed: < 200ms (instant feel)
- Prefetch Coverage: 70-80% of navigation
- Build Time: Improved by 30-40%
- Cache Hit Rate: > 95%
- API Call Reduction: 50%+ during builds
- All ISR features verified and working

### Production Readiness
With all tasks complete, the webstore now has:
- Full static generation for appropriate pages
- ISR for dynamic content with optimal revalidation
- On-demand revalidation for instant updates
- Intelligent prefetch for instant navigation
- Efficient build process with caching
- Verified performance improvements
- Production-ready optimization infrastructure

The static generation and ISR implementation is complete and ready for production deployment.
