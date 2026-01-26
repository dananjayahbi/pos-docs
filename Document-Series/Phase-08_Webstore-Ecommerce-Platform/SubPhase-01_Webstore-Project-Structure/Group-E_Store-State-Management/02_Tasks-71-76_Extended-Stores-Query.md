# Phase-08 SubPhase-01 Group-E Document 02: Extended Stores & Query Integration

**Phase:** 08 - Webstore & E-Commerce Platform  
**SubPhase:** 01 - Webstore Project Structure  
**Group:** E - Store State Management  
**Document:** 02 of 02  
**Tasks Covered:** 71-76  
**Estimated Total Duration:** 5 hours 15 minutes  
**Complexity:** Medium  

---

## Navigation

- **Parent:** [Group-E Overview](00_GROUP_OVERVIEW.md)
- **Previous:** [Group-E Doc 01 - Store Setup & Core Stores](01_Tasks-61-70_Store-Setup-Core-Stores.md)
- **Next:** [Group-F Doc 01 - Utility Functions](../Group-F_Store-Utilities-Testing/01_Tasks-77-84_Utility-Functions.md)

---

## Document Overview

This document covers the implementation of extended state management features and integration with TanStack Query (React Query) for the LCC Webstore. Tasks 71-76 focus on specialized stores for recently viewed products and product comparison, server state management configuration, and comprehensive verification of the complete state management architecture.

Building upon the core stores established in Tasks 61-70, this phase enhances the shopping experience with persistent browsing history, product comparison capabilities, and optimized server-side data fetching. The integration of TanStack Query provides robust caching, background updates, and automatic retry logic for all API interactions.

**Key Focus Areas:**
- Recently viewed products tracking with FIFO queue management
- Product comparison store with maximum capacity controls
- TanStack Query client configuration for optimal caching
- Custom React Query hooks for products and categories
- Complete state management verification and testing
- Cross-store coordination and data synchronization

**Sri Lankan Localization Requirements:**
- All monetary values in LKR (රු symbol)
- Date/time using Asia/Colombo timezone
- Locale set to en-LK for formatting
- Phone numbers in +94 format throughout

---

## State Management Architecture Extension

```
┌──────────────────────────────────────────────────────────────────┐
│              Extended State Management Architecture              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Core Stores (Tasks 61-70)          Extended Stores (71-76)     │
│  ┌──────────────────────┐           ┌──────────────────────┐   │
│  │  Cart Store          │           │  Recently Viewed     │   │
│  │  Wishlist Store      │           │  - FIFO Queue        │   │
│  │  Customer Store      │           │  - Max 10 items      │   │
│  │  UI Store            │           │  - localStorage      │   │
│  └──────────────────────┘           └──────────────────────┘   │
│                                                                  │
│                                     ┌──────────────────────┐   │
│                                     │  Comparison Store    │   │
│                                     │  - Max 4 products    │   │
│                                     │  - Same category     │   │
│                                     │  - localStorage      │   │
│                                     └──────────────────────┘   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                  TanStack Query Integration                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Query Client Configuration                              │  │
│  │  - staleTime: 5 minutes                                 │  │
│  │  - cacheTime: 30 minutes                                │  │
│  │  - retry: 3 attempts                                    │  │
│  │  - refetchOnWindowFocus: true                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────┐    ┌────────────────────────────┐    │
│  │  Product Hooks      │    │  Category Hooks            │    │
│  │  - useProducts      │    │  - useCategories           │    │
│  │  - useProduct       │    │  - useCategory             │    │
│  │  - useFeatured      │    │  - useCategoryProducts     │    │
│  │  - useSale          │    └────────────────────────────┘    │
│  │  - useRelated       │                                       │
│  └─────────────────────┘                                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                    Persistence Layer                             │
│  localStorage | sessionStorage | IndexedDB | Server Sync        │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tasks Summary

| Task | Name | Dependencies | Est. Time | Complexity |
|------|------|--------------|-----------|------------|
| 71 | Create Recently Viewed Store | Tasks 61-70 | 1 hour | Medium |
| 72 | Create Comparison Store | Tasks 61-70 | 1 hour | Medium |
| 73 | Configure TanStack Query Client | Tasks 60, 61 | 45 minutes | Medium |
| 74 | Create Product Query Hooks | Task 73 | 1 hour | Medium |
| 75 | Create Category Query Hooks | Task 73 | 1 hour | Low |
| 76 | Verify State Management | Tasks 71-75 | 30 minutes | Low |

---

## Task 71: Create Recently Viewed Store

**Estimated Duration:** 1 hour  
**Complexity:** Medium  
**Dependencies:** Tasks 61-70 (Core store setup)

### Overview

Implement a specialized Zustand store to track user browsing history, maintaining a list of recently viewed products. This store enhances the shopping experience by allowing customers to quickly revisit products they've shown interest in, implementing a FIFO (First-In-First-Out) queue with a maximum capacity of 10 items. Data persistence ensures browsing history survives page refreshes and browser sessions.

### Dependencies

- Task 61 completed (Zustand configuration)
- Core store infrastructure operational
- localStorage access available
- Product type definitions from API client

### Instructions

1. Create a new store file at src/store/recentlyViewedStore.ts following the established naming convention and structure patterns from core stores

2. Define TypeScript interfaces for the recently viewed state, including an array of product summary objects containing essential fields: productId, name, slug, primaryImage, currentPrice (in LKR), and viewedAt timestamp

3. Implement the store state structure with an items array initialized as empty, maintaining chronological order with most recently viewed items at the end of the array

4. Create an addProduct action that accepts a product object, checks if the product already exists in the history (by productId), and handles the following scenarios appropriately:
   - If product exists: remove it from current position and add to end (move to most recent)
   - If array is at maximum capacity (10 items): remove oldest item (index 0) before adding new one
   - If array has space: simply append to end
   - Always update the viewedAt timestamp to current time

5. Implement a removeProduct action that accepts a productId and filters it out from the items array, maintaining the order of remaining items

6. Create a clearAll action that resets the items array to empty, providing users ability to clear their browsing history

7. Add a getProducts selector that returns the items array in reverse chronological order (most recent first) for display purposes while keeping internal storage in chronological order

8. Implement localStorage persistence middleware using Zustand's persist middleware, storing data under the key 'lcc-recently-viewed' with proper serialization and deserialization

9. Configure the persistence with a version number (start at 1) and create a migrate function that can handle future state shape changes without losing user data

10. Add cross-tab synchronization by listening to localStorage storage events, ensuring that recently viewed history updates across multiple open tabs or windows

11. Implement a maximum age policy where products viewed more than 30 days ago are automatically pruned when the store hydrates from localStorage

12. Create helper functions to format the viewedAt timestamps for display using Asia/Colombo timezone and en-LK locale formatting

13. Add validation to ensure product data completeness before adding to history, checking for required fields and proper LKR price formatting

14. Export the store hook (useRecentlyViewedStore) and TypeScript types for consumption by React components

### Expected Outcome

- Recently viewed store operational with proper state management
- FIFO queue logic correctly implemented with 10-item maximum
- Products automatically added when user views product detail pages
- Duplicate products handled by moving to most recent position
- Data persists across browser sessions via localStorage
- Cross-tab synchronization working for multi-tab scenarios
- Automatic pruning of old entries (30+ days)
- Timestamps formatted for Sri Lankan timezone
- Type-safe interfaces for all state and actions
- Store hook ready for component integration

### Verification Checklist

- [ ] recentlyViewedStore.ts file created in src/store/
- [ ] TypeScript interfaces defined for product summary and state shape
- [ ] FIFO queue maintains maximum 10 items correctly
- [ ] addProduct handles duplicates by moving to end
- [ ] removeProduct filters out specified product
- [ ] clearAll resets items array to empty
- [ ] getProducts returns reverse chronological order
- [ ] localStorage persistence works under 'lcc-recently-viewed' key
- [ ] State persists across page refreshes
- [ ] Cross-tab synchronization functional
- [ ] Products older than 30 days automatically removed on hydration
- [ ] Timestamps use Asia/Colombo timezone and en-LK formatting
- [ ] Validation ensures complete product data before adding
- [ ] useRecentlyViewedStore hook exported and functional

---

## Task 72: Create Comparison Store

**Estimated Duration:** 1 hour  
**Complexity:** Medium  
**Dependencies:** Tasks 61-70 (Core store setup)

### Overview

Develop a dedicated Zustand store for product comparison functionality, allowing customers to select multiple products (up to 4) for side-by-side feature and specification comparison. This store enforces business rules ensuring compared products belong to the same category, maintains localStorage persistence, and provides clear user feedback when capacity or category constraints are reached.

### Dependencies

- Task 61 completed (Zustand configuration)
- Core store infrastructure operational
- localStorage access available
- Product and category type definitions available

### Product Comparison Flow

```
User Adds Product to Compare
         ↓
┌────────────────────────┐
│  Validation Checks:    │
│  1. Max 4 items?       │
│  2. Same category?     │
│  3. Already added?     │
└────────────────────────┘
         ↓
    ┌────┴────┐
    │  Valid? │
    └────┬────┘
         │
    Yes  │  No
    ↓    ↓   ↓
┌────────┐  ┌─────────────────┐
│  Add   │  │  Show Error:    │
│  to    │  │  - Capacity     │
│  Store │  │  - Category     │
└────────┘  │  - Duplicate    │
            └─────────────────┘
     ↓
┌────────────────────────┐
│  Update localStorage   │
└────────────────────────┘
     ↓
┌────────────────────────┐
│  Trigger UI Update     │
│  - Counter badge       │
│  - Compare button      │
└────────────────────────┘
```

### Instructions

1. Create a new store file at src/store/comparisonStore.ts following established patterns, ensuring consistent structure with other stores in the project

2. Define comprehensive TypeScript interfaces for comparison state including:
   - ComparisonProduct: productId, name, slug, categoryId, categoryName, currentPrice (LKR), specifications array, features array, primaryImage, and addedAt timestamp
   - ComparisonState: items array, currentCategory (string or null), and error message field

3. Initialize the store state with empty items array, currentCategory set to null, and error cleared, establishing a clean starting point

4. Implement the addProduct action with complete validation logic:
   - Check if items array has reached maximum capacity (4 products)
   - Verify product is not already in comparison list (by productId)
   - Ensure category matches currentCategory if items exist, or set currentCategory if first item
   - If validation passes: add product and clear error
   - If validation fails: set appropriate error message without adding product

5. Create a removeProduct action that accepts a productId, removes the matching item from array, and resets currentCategory to null if removing the last item

6. Implement a clearAll action that resets items to empty array, clears currentCategory, and removes any error messages, providing users a fresh start

7. Add a canAddProduct validation function that accepts a product and returns a boolean indicating if it can be added, along with an error reason if not (useful for UI disable states)

8. Create a getProductCount selector that returns the current number of items in comparison, used for badge display and capacity checks

9. Implement a getComparisonData selector that returns items organized for comparison table display, grouping specifications and features into aligned columns

10. Configure localStorage persistence using Zustand's persist middleware with the key 'lcc-product-comparison', ensuring proper serialization of the complete state including error messages

11. Add versioning and migration logic to handle future state shape changes, starting at version 1 with a migrate function that can transform old state structures

12. Implement cross-tab synchronization to keep comparison lists consistent across multiple browser tabs or windows using storage event listeners

13. Create a smart initialization that checks if persisted products are still available via API call (basic availability check), removing any products that return 404 or are discontinued

14. Add helper functions to format specification values according to Sri Lankan conventions (measurements, dates in Asia/Colombo timezone, currency in LKR)

15. Export the store hook (useComparisonStore), TypeScript interfaces, and utility functions for component integration

### Expected Outcome

- Comparison store operational with proper validation logic
- Maximum 4 products enforced with clear error messaging
- Same-category constraint validated on each add attempt
- Duplicate prevention working correctly
- Products persist across sessions via localStorage
- Cross-tab synchronization maintaining consistent state
- Stale product validation on store initialization
- Category automatically set/reset based on items
- Error messages provide clear user feedback
- Specifications formatted for Sri Lankan display standards
- Type-safe interfaces for all state and actions
- Store hook ready for comparison UI components

### Verification Checklist

- [ ] comparisonStore.ts file created in src/store/
- [ ] TypeScript interfaces defined for product and state
- [ ] Maximum 4 products enforced by validation
- [ ] Same-category constraint checked on addProduct
- [ ] Duplicate products prevented with error message
- [ ] removeProduct correctly filters out item
- [ ] clearAll resets all state fields to initial values
- [ ] canAddProduct returns validation result with reason
- [ ] getProductCount returns accurate item count
- [ ] getComparisonData organizes products for display
- [ ] localStorage persistence works under 'lcc-product-comparison' key
- [ ] State persists across page refreshes
- [ ] Cross-tab synchronization functional
- [ ] Stale products validated and removed on initialization
- [ ] Specification values formatted for Sri Lankan conventions
- [ ] Error messages clear and user-friendly
- [ ] useComparisonStore hook exported and functional

---

## Task 73: Configure TanStack Query Client

**Estimated Duration:** 45 minutes  
**Complexity:** Medium  
**Dependencies:** Tasks 60 (API client), 61 (Store config)

### Overview

Set up and configure TanStack Query (React Query) as the server state management solution for the webstore, providing powerful data synchronization, caching, and background updates for API-fetched data. This configuration establishes optimal defaults for stale time, cache duration, retry logic, and refetch behaviors tailored to e-commerce scenarios where product information, inventory, and pricing need reliable yet performant updates.

### TanStack Query Architecture

```
┌────────────────────────────────────────────────────────────┐
│                   React Components                         │
│  useProducts() | useProduct() | useCategories() etc.      │
└────────────────────┬───────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────────┐
│              TanStack Query Client                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Query Cache (30 min)                                │ │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │ │
│  │  │Product1│  │Product2│  │  Cat1  │  │  Cat2  │   │ │
│  │  │ Fresh  │  │ Stale  │  │ Fresh  │  │ Fresh  │   │ │
│  │  └────────┘  └────────┘  └────────┘  └────────┘   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Behaviors:                                                │
│  • Fresh data (0-5 min): Serve from cache                 │
│  • Stale data (5-30 min): Serve cache + background refetch│
│  • Expired (30+ min): Fetch new data                      │
│  • Failed request: Retry 3x with exponential backoff      │
│  • Window focus: Refetch stale queries                    │
└────────────────────┬───────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────────┐
│              API Client (Axios)                            │
│  GET /api/products | POST /api/cart | etc.                │
└────────────────────────────────────────────────────────────┘
```

### Dependencies

- Task 60 completed (API client setup)
- Task 61 completed (Store configuration)
- React and TypeScript configured
- Axios API client operational

### Instructions

1. Install TanStack Query version 5.x using your package manager, ensuring peer dependency compatibility with React 18.x, and install the TanStack Query DevTools package for development debugging

2. Create a query client configuration file at src/lib/queryClient.ts that will house the global QueryClient instance and configuration settings

3. Initialize a QueryClient instance with default options configured for e-commerce scenarios:
   - Set queries.staleTime to 5 minutes (300000ms) to consider product data fresh for short periods
   - Set queries.cacheTime to 30 minutes (1800000ms) to keep cached data in memory
   - Configure queries.refetchOnWindowFocus to true so data updates when users return to tab
   - Set queries.refetchOnReconnect to true to fetch fresh data after network reconnection

4. Configure retry behavior with queries.retry set to 3 attempts for failed requests, using exponential backoff (queries.retryDelay with attempt multiplier), but disable retries for 404 and 401 responses since those are client errors not worth retrying

5. Set up mutation default options with mutations.retry set to 1 (single retry for POST/PUT/DELETE operations), and configure onError handler to log mutation failures for debugging

6. Create query key factory functions that generate consistent, hierarchical query keys for different entity types:
   - Products: ['products', filters] for list, ['products', productId] for detail
   - Categories: ['categories'] for list, ['categories', categoryId] for detail
   - Featured products: ['products', 'featured']
   - Sale products: ['products', 'sale']

7. Implement a query client provider wrapper component that wraps the application with QueryClientProvider, making the query client available throughout the React component tree

8. Add TanStack Query DevTools component conditionally included only in development environment, positioning it with fixed placement in bottom-right corner of viewport for debugging queries and cache

9. Create utility functions for common query operations:
   - invalidateProductQueries: invalidate all product-related queries after mutations
   - invalidateCategoryQueries: invalidate category queries when categories change
   - prefetchProduct: prefetch product data before user navigates to detail page
   - setProductQueryData: directly update cache after mutations to avoid refetch

10. Configure error handling with a default onError callback that logs errors to console in development and sends to error tracking service in production (structured for future integration)

11. Set up query cancellation for queries that are unmounted before completion, preventing race conditions and unnecessary network requests using AbortController signals

12. Create TypeScript interfaces for query options and query key types, ensuring type safety for all query hooks that will be created in subsequent tasks

13. Document the configuration decisions in code comments, explaining staleness times, cache duration, and retry logic rationale for future developers maintaining the codebase

14. Export the configured QueryClient instance, provider component, DevTools component, utility functions, and TypeScript types for use throughout the application

### Expected Outcome

- TanStack Query version 5.x successfully installed
- QueryClient configured with e-commerce optimized defaults
- Stale time set to 5 minutes for fresh data window
- Cache time set to 30 minutes for in-memory retention
- Retry logic configured with exponential backoff
- Query key factories established for consistent keying
- QueryClientProvider wrapper component created
- DevTools available in development environment
- Utility functions ready for cache operations
- Error handling configured for development and production
- Query cancellation preventing race conditions
- TypeScript types ensuring type-safe query usage
- Documentation explaining configuration choices
- Foundation ready for custom query hooks (Tasks 74-75)

### Verification Checklist

- [ ] @tanstack/react-query and devtools packages installed
- [ ] queryClient.ts configuration file created in src/lib/
- [ ] QueryClient instantiated with configured defaults
- [ ] staleTime set to 5 minutes (300000ms)
- [ ] cacheTime set to 30 minutes (1800000ms)
- [ ] refetchOnWindowFocus and refetchOnReconnect enabled
- [ ] Retry logic configured: 3 attempts with exponential backoff
- [ ] 404 and 401 errors skip retry logic
- [ ] Query key factory functions created and exported
- [ ] QueryClientProvider wrapper component implemented
- [ ] DevTools component included conditionally for development
- [ ] Utility functions for cache invalidation created
- [ ] Error handling callbacks configured
- [ ] Query cancellation with AbortController implemented
- [ ] TypeScript interfaces for query options defined
- [ ] Code documentation explains configuration rationale
- [ ] All exports available for application-wide usage

---

## Task 74: Create Product Query Hooks

**Estimated Duration:** 1 hour  
**Complexity:** Medium  
**Dependencies:** Task 73 (TanStack Query configuration)

### Overview

Develop a comprehensive set of custom React Query hooks for fetching and managing product data throughout the webstore. These hooks abstract the complexity of data fetching, caching, and state management, providing a simple interface for components to access product information with automatic loading states, error handling, and background updates. Each hook leverages the QueryClient configuration from Task 73 and integrates with the API client from Task 60.

### Product Query Hooks Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Product Query Hooks (Task 74)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  useProducts(filters)                                       │
│  ├─ Query Key: ['products', filters]                       │
│  ├─ Fetcher: apiClient.products.list(filters)              │
│  ├─ Returns: { data, isLoading, error, refetch }           │
│  └─ Features: Pagination, filtering, sorting               │
│                                                             │
│  useProduct(productId, options)                             │
│  ├─ Query Key: ['products', productId]                     │
│  ├─ Fetcher: apiClient.products.get(productId)             │
│  ├─ Returns: { product, isLoading, error }                 │
│  └─ Features: Auto-refetch, enabled toggle                 │
│                                                             │
│  useFeaturedProducts(limit)                                 │
│  ├─ Query Key: ['products', 'featured', limit]             │
│  ├─ Fetcher: apiClient.products.getFeatured(limit)         │
│  ├─ Returns: { products, isLoading }                       │
│  └─ Features: Longer staleTime (10 min)                    │
│                                                             │
│  useSaleProducts(limit)                                     │
│  ├─ Query Key: ['products', 'sale', limit]                 │
│  ├─ Fetcher: apiClient.products.getSale(limit)             │
│  ├─ Returns: { products, isLoading }                       │
│  └─ Features: Frequent refetch (5 min)                     │
│                                                             │
│  useRelatedProducts(productId, limit)                       │
│  ├─ Query Key: ['products', productId, 'related', limit]   │
│  ├─ Fetcher: apiClient.products.getRelated(productId)      │
│  ├─ Returns: { products, isLoading }                       │
│  └─ Features: Conditional enabling                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Dependencies

- Task 73 completed (QueryClient configuration)
- Task 60 completed (API client with product endpoints)
- Query key factories available
- TypeScript product types defined

### Instructions

1. Create a new hooks file at src/hooks/queries/useProducts.ts to house all product-related query hooks, maintaining separation from component files

2. Implement the useProducts hook that accepts filter parameters (category, search, priceRange, sort, page, limit) and returns paginated product list:
   - Use useQuery with query key ['products', filters] for cache differentiation
   - Call apiClient.products.list(filters) as the query function
   - Return destructured query result including data, isLoading, isError, error, and refetch
   - Configure select option to transform API response, extracting products array and pagination metadata
   - Add enabled option defaulting to true but allow override for conditional fetching

3. Create the useProduct hook accepting productId and optional configuration options:
   - Use query key ['products', productId] for individual product caching
   - Fetch using apiClient.products.get(productId) with error handling for 404s
   - Configure enabled option to skip fetch if productId is null/undefined (useful for conditional rendering)
   - Add onSuccess callback option to trigger side effects like adding to recently viewed
   - Return product data, loading state, error, and refetch function

4. Implement useFeaturedProducts hook with optional limit parameter (default 8):
   - Use query key ['products', 'featured', limit] for separate cache entry
   - Call apiClient.products.getFeatured(limit) endpoint
   - Configure longer staleTime of 10 minutes (600000ms) since featured products change infrequently
   - Add select option to extract just products array from response
   - Return products array, isLoading, and error

5. Develop useSaleProducts hook with optional limit parameter (default 12):
   - Use query key ['products', 'sale', limit] for cache management
   - Fetch using apiClient.products.getSale(limit) to get discounted items
   - Configure shorter staleTime of 2 minutes (120000ms) for time-sensitive sale data
   - Add refetchInterval of 5 minutes (300000ms) to keep sale prices current
   - Transform data to include calculated discount percentage and savings in LKR
   - Return products with enriched sale data, loading state, error

6. Create useRelatedProducts hook accepting productId and optional limit (default 6):
   - Use query key ['products', productId, 'related', limit] for proper cache keying
   - Call apiClient.products.getRelated(productId, limit) to fetch recommendations
   - Set enabled option to false if productId is missing (conditional activation)
   - Configure to only refetch on window focus, not on mount, to reduce unnecessary requests
   - Return related products array, isLoading, and error

7. Implement useProductSearch hook for type-ahead search functionality:
   - Accept search query string and optional debounce time (default 300ms)
   - Use debounced query value to prevent excessive API calls on each keystroke
   - Build query key as ['products', 'search', debouncedQuery]
   - Only enable query if debounced query length is 3 or more characters
   - Configure staleTime to 1 minute since search results can change frequently
   - Return search results, isLoading, and query stats (total count, execution time)

8. Add useProductAvailability hook for real-time stock checking:
   - Accept productId or array of productIds for batch checking
   - Use query key ['products', 'availability', productIds] with proper serialization
   - Fetch using apiClient.products.checkAvailability(productIds)
   - Configure very short staleTime (30 seconds) for near-real-time stock data
   - Set refetchInterval to 60 seconds when component is visible
   - Return availability map (productId -> inStock boolean), loading state

9. Create helper hook useProductMutations for write operations (add/update/delete):
   - Implement addProduct mutation using useMutation with apiClient.products.create
   - Implement updateProduct mutation with apiClient.products.update
   - Implement deleteProduct mutation with apiClient.products.delete
   - Configure onSuccess callbacks to invalidate relevant queries using queryClient.invalidateQueries
   - Configure onError callbacks to provide user-friendly error messages
   - Return mutation functions and states (isLoading, isError, error, reset)

10. Add TypeScript interfaces for all hook parameters and return types:
    - ProductFilters interface for useProducts parameters
    - ProductQueryOptions extending UseQueryOptions with custom properties
    - ProductSearchResult with results array and metadata
    - ProductAvailability map type
    - Ensure all hooks have proper generic typing for type inference

11. Implement error transformation functions that convert API errors to user-friendly messages with Sri Lankan context (e.g., "Product not available in your location" for region-restricted items)

12. Add query prefetching utilities to improve perceived performance:
    - prefetchProduct function that can be called on hover/touch of product cards
    - prefetchRelatedProducts for anticipated navigation flows
    - Export prefetching utilities for use in components and route loaders

13. Create unit test helpers for mocking product queries in component tests, providing mock data generators with Sri Lankan localized content (LKR prices, local product names)

14. Export all hooks, types, utilities, and test helpers from src/hooks/queries/index.ts for convenient importing in components

### Expected Outcome

- Comprehensive set of product query hooks operational
- useProducts handles filtering, pagination, and sorting
- useProduct fetches individual product details with caching
- useFeaturedProducts retrieves featured product collections
- useSaleProducts fetches sale items with enriched discount data
- useRelatedProducts provides product recommendations
- useProductSearch enables type-ahead search functionality
- useProductAvailability checks real-time stock status
- useProductMutations handles create/update/delete operations
- All hooks properly typed with TypeScript interfaces
- Error handling provides user-friendly messages
- Prefetching utilities available for performance optimization
- Query cache properly invalidated after mutations
- Hooks integrate seamlessly with components
- Test helpers available for unit testing

### Verification Checklist

- [ ] useProducts.ts file created in src/hooks/queries/
- [ ] useProducts hook implemented with filter parameters
- [ ] useProduct hook fetches individual product by ID
- [ ] useFeaturedProducts configured with 10-minute staleTime
- [ ] useSaleProducts includes discount calculations in LKR
- [ ] useRelatedProducts conditionally enabled based on productId
- [ ] useProductSearch debounces input and validates minimum length
- [ ] useProductAvailability checks real-time stock with 30s staleTime
- [ ] useProductMutations provides add/update/delete operations
- [ ] Query cache invalidation working after mutations
- [ ] TypeScript interfaces defined for all parameters and returns
- [ ] Error messages localized for Sri Lankan context
- [ ] Prefetching utilities exported and functional
- [ ] Test helpers available for component testing
- [ ] All hooks exported from index.ts
- [ ] Hooks integrate successfully with QueryClient configuration
- [ ] Documentation comments explain each hook's purpose and usage

---

## Task 75: Create Category Query Hooks

**Estimated Duration:** 1 hour  
**Complexity:** Low  
**Dependencies:** Task 73 (TanStack Query configuration)

### Overview

Develop custom React Query hooks for fetching and managing category data in the webstore. These hooks provide simple interfaces for accessing category hierarchies, individual category details, and category-specific product listings. Categories typically change less frequently than products, so these hooks are configured with longer cache times and staleness windows to optimize performance while maintaining data freshness.

### Category Query Hooks Structure

```
┌────────────────────────────────────────────────────────────┐
│           Category Query Hooks (Task 75)                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  useCategories()                                           │
│  ├─ Query Key: ['categories']                             │
│  ├─ Fetcher: apiClient.categories.list()                  │
│  ├─ Returns: { categories, tree, isLoading }              │
│  ├─ Features: Hierarchical tree transformation            │
│  └─ StaleTime: 15 minutes (categories rarely change)      │
│                                                            │
│  useCategory(categoryId, options)                          │
│  ├─ Query Key: ['categories', categoryId]                 │
│  ├─ Fetcher: apiClient.categories.get(categoryId)         │
│  ├─ Returns: { category, breadcrumb, isLoading }          │
│  ├─ Features: Breadcrumb generation, parent traversal     │
│  └─ StaleTime: 15 minutes                                 │
│                                                            │
│  useCategoryProducts(categoryId, filters)                  │
│  ├─ Query Key: ['categories', categoryId, 'products']     │
│  ├─ Fetcher: apiClient.categories.getProducts()           │
│  ├─ Returns: { products, pagination, filters }            │
│  ├─ Features: Subcategory inclusion option                │
│  └─ StaleTime: 5 minutes (products change frequently)     │
│                                                            │
│  useCategoryTree()                                         │
│  ├─ Query Key: ['categories', 'tree']                     │
│  ├─ Fetcher: apiClient.categories.getTree()               │
│  ├─ Returns: { tree, flatList, isLoading }                │
│  ├─ Features: Nested structure + flat list                │
│  └─ StaleTime: 20 minutes (mega menu rarely changes)      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Category Hierarchy Example

```
Categories Tree Structure:

Electronics (electronics-001)
├── Computers (computers-001)
│   ├── Laptops (laptops-001)
│   ├── Desktops (desktops-001)
│   └── Accessories (accessories-001)
├── Mobile Devices (mobile-001)
│   ├── Smartphones (smartphones-001)
│   └── Tablets (tablets-001)
└── Home Appliances (appliances-001)
    ├── Kitchen (kitchen-001)
    └── Laundry (laundry-001)

Breadcrumb Generation:
Home > Electronics > Computers > Laptops
```

### Dependencies

- Task 73 completed (QueryClient configuration)
- Task 60 completed (API client with category endpoints)
- Query key factories available
- Category type definitions from API client

### Instructions

1. Create a new hooks file at src/hooks/queries/useCategories.ts to house all category-related query hooks, maintaining consistent organization with product hooks

2. Implement the useCategories hook that fetches the complete category list:
   - Use query key ['categories'] for simple, consistent cache key
   - Call apiClient.categories.list() to fetch all categories
   - Configure staleTime to 15 minutes (900000ms) since categories change infrequently
   - Add select option to transform flat category array into hierarchical tree structure using parent-child relationships
   - Create tree transformation logic that builds nested objects with children arrays, maintaining proper parent references
   - Return both categories array (flat) and tree structure (nested) for different UI needs
   - Include isLoading, error, and refetch in return object

3. Create the useCategory hook accepting categoryId and optional configuration:
   - Use query key ['categories', categoryId] for individual category caching
   - Fetch using apiClient.categories.get(categoryId) with 404 error handling
   - Configure enabled option to skip fetch if categoryId is null/undefined
   - Configure same staleTime as useCategories (15 minutes)
   - Add select option to enhance category data with breadcrumb trail by traversing parent relationships
   - Generate breadcrumb array from root to current category with format: [{id, name, slug}, ...]
   - Return category data, breadcrumb array, parent category, isLoading, and error

4. Implement useCategoryProducts hook accepting categoryId and filter parameters:
   - Build query key as ['categories', categoryId, 'products', filters] for proper cache granularity
   - Call apiClient.categories.getProducts(categoryId, filters) to fetch category-specific products
   - Configure staleTime to 5 minutes (300000ms) since product listings change more frequently
   - Add includeSubcategories filter option (boolean) to fetch products from child categories too
   - Support standard product filters: sort, priceRange, page, limit
   - Transform response to include category context and applied filters
   - Calculate and include filter facets (price ranges, available attributes) for filter UI
   - Return products, pagination metadata, active filters, facets, isLoading, error

5. Develop useCategoryTree hook optimized for mega menu rendering:
   - Use query key ['categories', 'tree'] for dedicated cache entry
   - Fetch using apiClient.categories.getTree() or transform useCategories result
   - Configure longer staleTime of 20 minutes (1200000ms) for mega menu stability
   - Transform data into nested structure with depth levels (0=root, 1=main, 2=sub, 3=leaf)
   - Add utility properties to each node: hasChildren, childCount, depth, path (slug trail)
   - Create flat list version with depth indicators for alternative rendering approaches
   - Include featured categories flagging for special menu highlighting
   - Return tree structure, flat list, featured categories, isLoading, error

6. Create useCategoryBreadcrumb helper hook accepting categorySlug or categoryId:
   - Use query key ['categories', 'breadcrumb', identifier] for caching
   - Leverage useCategories data to build breadcrumb without additional API call
   - Generate full path from root to current category
   - Format breadcrumb items with proper linking: { label, slug, url }
   - Handle categories that are multiple levels deep (support unlimited nesting)
   - Return breadcrumb array, parent category, isLoading

7. Implement useCategoryFilters hook to fetch available filters for a category:
   - Accept categoryId and return available filter options for that category
   - Use query key ['categories', categoryId, 'filters']
   - Fetch from apiClient.categories.getFilters(categoryId)
   - Return price ranges, available attributes, brands in category, size options, color options
   - Transform data for immediate use in filter UI components
   - Configure staleTime to 10 minutes (filters don't change often)

8. Add useCategorySearch hook for category-specific search functionality:
   - Accept categoryId and search query string
   - Use debounced query value (300ms delay) to prevent excessive requests
   - Build query key as ['categories', categoryId, 'search', debouncedQuery]
   - Only enable if query length >= 2 characters
   - Fetch using apiClient.categories.search(categoryId, query)
   - Return search results limited to specified category, total count, isLoading

9. Create useFeaturedCategories hook for homepage/landing displays:
   - Use query key ['categories', 'featured']
   - Fetch using apiClient.categories.getFeatured()
   - Configure staleTime to 15 minutes
   - Return featured categories with associated metadata (icon, description, featured image)
   - Include product count for each featured category
   - Add isLoading, error handling

10. Implement category mutation hooks (admin/content management use):
    - useCategoryMutations providing createCategory, updateCategory, deleteCategory
    - Configure onSuccess callbacks to invalidate ['categories'] queries
    - Add optimistic updates for better perceived performance
    - Handle validation errors and provide user feedback
    - Return mutation functions, loading states, error states

11. Add TypeScript interfaces for all category-related types:
    - CategoryNode interface for tree structure with children array
    - CategoryBreadcrumb item interface
    - CategoryFilters interface with available filter options
    - CategoryProductFilters extending base product filters
    - Ensure proper generic typing for type inference and autocomplete

12. Create utility functions for category operations:
    - flattenCategoryTree: converts nested tree to flat array with depth indicators
    - buildCategoryTree: constructs nested tree from flat array
    - findCategoryById: searches tree structure for specific category
    - getCategoryPath: generates slug path from root to category
    - Export utilities for use in components and other hooks

13. Implement cache warming strategy that prefetches likely-needed categories:
    - prefetchCategory function for hover/anticipation prefetching
    - prefetchCategoryProducts for navigation preparation
    - Export prefetching utilities for route loaders and link components

14. Export all category hooks, types, utilities, and prefetch functions from src/hooks/queries/index.ts for convenient importing throughout the application

### Expected Outcome

- Comprehensive category query hooks operational
- useCategories fetches all categories with tree transformation
- useCategory retrieves individual category with breadcrumb
- useCategoryProducts fetches category-specific product listings
- useCategoryTree provides optimized structure for mega menus
- useCategoryBreadcrumb generates navigation breadcrumbs
- useCategoryFilters returns available filtering options
- useCategorySearch enables category-scoped search
- useFeaturedCategories fetches featured category collections
- Category mutations available for admin operations
- Tree transformation correctly builds parent-child relationships
- Breadcrumb generation handles multi-level nesting
- All hooks properly typed with TypeScript
- Utility functions available for category operations
- Prefetching utilities optimize navigation performance
- Cache invalidation working after mutations

### Verification Checklist

- [ ] useCategories.ts file created in src/hooks/queries/
- [ ] useCategories hook returns both flat and tree structures
- [ ] Tree transformation correctly nests parent-child relationships
- [ ] useCategory hook fetches individual category by ID
- [ ] Breadcrumb generation works for multi-level categories
- [ ] useCategoryProducts filters products by category
- [ ] includeSubcategories option fetches from child categories
- [ ] useCategoryTree optimized with 20-minute staleTime
- [ ] Depth levels calculated correctly in tree structure
- [ ] useCategoryBreadcrumb generates proper navigation trail
- [ ] useCategoryFilters returns available filter options
- [ ] useCategorySearch debounces and validates query length
- [ ] useFeaturedCategories fetches featured collections
- [ ] Category mutations invalidate cache appropriately
- [ ] TypeScript interfaces defined for all structures
- [ ] Utility functions (flatten, build tree, find) working
- [ ] Prefetching utilities exported and functional
- [ ] All hooks exported from index.ts
- [ ] Hooks integrate with QueryClient configuration
- [ ] Cache times optimized for category data stability

---

## Task 76: Verify State Management

**Estimated Duration:** 30 minutes  
**Complexity:** Low  
**Dependencies:** Tasks 71-75 (All state management implementation)

### Overview

Conduct comprehensive verification and testing of the complete state management architecture for the LCC Webstore. This task ensures all Zustand stores, TanStack Query hooks, persistence layers, and cross-store interactions function correctly and meet performance expectations. Verification includes functional testing, persistence validation, cross-tab synchronization, and performance profiling to confirm the system is production-ready.

### Verification Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              State Management Verification                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Individual Store Testing                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │ • Cart Store actions and state updates            │    │
│  │ • Wishlist Store CRUD operations                  │    │
│  │ • Customer Store authentication flow              │    │
│  │ • UI Store state toggles                          │    │
│  │ • Recently Viewed FIFO queue                      │    │
│  │ • Comparison Store validation logic               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Layer 2: Persistence Testing                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │ • localStorage persistence and hydration          │    │
│  │ • sessionStorage usage verification               │    │
│  │ • State restoration after page refresh            │    │
│  │ • Migration handling for version changes          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Layer 3: Query Integration Testing                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │ • Product hooks fetching and caching              │    │
│  │ • Category hooks tree transformation              │    │
│  │ • Query invalidation after mutations              │    │
│  │ • Stale time and cache time behaviors             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Layer 4: Cross-Store Coordination                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │ • Cart updates reflecting in UI store             │    │
│  │ • Customer logout clearing cart/wishlist          │    │
│  │ • Recently viewed adding from product detail      │    │
│  │ • Comparison affecting cart interactions          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Layer 5: Performance Validation                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │ • Store operation timing < 50ms                    │    │
│  │ • Query cache hit rates > 70%                      │    │
│  │ • Persistence operation latency < 100ms            │    │
│  │ • Component re-render optimization                │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Dependencies

- Tasks 61-70 completed (Core stores)
- Tasks 71-72 completed (Extended stores)
- Tasks 73-75 completed (Query integration)
- Browser DevTools access
- Test data preparation

### Instructions

1. Create a comprehensive verification checklist document at docs/verification/state-management-verification.md that will track all verification activities, results, and issues discovered

2. Set up a dedicated verification environment using the development build with DevTools enabled, preparing test data including sample products (with LKR pricing), categories (Sri Lankan relevant categories), and customer accounts

3. Test Cart Store functionality systematically:
   - Add multiple products to cart with varying quantities and prices
   - Verify subtotal, tax (15% VAT per Sri Lankan rates), and total calculations in LKR
   - Update product quantities and confirm recalculations
   - Remove individual items and verify state updates
   - Clear entire cart and confirm empty state
   - Test edge cases: maximum quantity limits, decimal price handling, zero quantity prevention
   - Verify error handling for invalid operations

4. Validate Wishlist Store operations:
   - Add products to wishlist from different pages
   - Verify duplicate prevention (same product cannot be added twice)
   - Remove items from wishlist and confirm state updates
   - Clear entire wishlist and verify reset
   - Move items from wishlist to cart and check both stores update correctly
   - Test maximum wishlist capacity if implemented
   - Verify persistence survives page refresh

5. Verify Customer Store authentication flows:
   - Perform login with valid credentials and confirm token storage
   - Verify customer data populated in store state
   - Check that token is included in API request headers
   - Test logout clearing token and customer data
   - Verify automatic logout on token expiration
   - Confirm protected routes redirect when not authenticated
   - Test "remember me" functionality if implemented

6. Test UI Store state management:
   - Toggle mobile menu open/close states
   - Open/close cart drawer and verify animations
   - Trigger search overlay and confirm state updates
   - Open product quick view modal
   - Test multiple overlays and ensure proper z-index stacking
   - Verify UI state doesn't persist (sessionStorage or non-persistent)
   - Confirm keyboard shortcuts interact with UI state correctly

7. Validate Recently Viewed Store FIFO queue logic:
   - View 5 products and verify all added to recently viewed
   - View 8 more products and confirm oldest 3 removed (10-item max)
   - View a product already in history and verify it moves to most recent position
   - Clear recently viewed and confirm empty state
   - Check timestamp formatting uses Asia/Colombo timezone
   - Verify 30-day age pruning by manipulating localStorage dates
   - Test persistence across browser sessions

8. Test Comparison Store validation and constraints:
   - Add first product and verify category is set
   - Add second product from same category and confirm success
   - Attempt to add product from different category and verify rejection with error message
   - Add third and fourth products to reach maximum capacity
   - Attempt to add fifth product and verify rejection with capacity error
   - Remove one product and confirm category remains set
   - Remove all products and verify category resets to null
   - Test persistence and restoration

9. Verify localStorage persistence for all persisted stores:
   - Add data to cart, wishlist, recently viewed, and comparison stores
   - Refresh the page and confirm all data restored correctly
   - Open browser DevTools and inspect localStorage keys:
     - 'lcc-cart-store'
     - 'lcc-wishlist-store'
     - 'lcc-recently-viewed'
     - 'lcc-product-comparison'
   - Verify JSON structure is valid and includes version numbers
   - Manually modify localStorage and confirm migration logic handles changes
   - Test quota exceeded scenarios by filling localStorage

10. Test cross-tab synchronization:
    - Open webstore in two browser tabs side-by-side
    - Add item to cart in Tab 1 and verify Tab 2 updates within 1-2 seconds
    - Add product to wishlist in Tab 2 and confirm Tab 1 reflects change
    - Update recently viewed in one tab and check other tab synchronizes
    - Clear comparison in one tab and verify other tab clears
    - Test with 3+ tabs open simultaneously

11. Verify TanStack Query integration and caching:
    - Open React Query DevTools in browser
    - Navigate to product listing and observe query key ['products', filters]
    - Check that query status shows "fresh" for first 5 minutes
    - Wait for staleTime expiration and observe status changes to "stale"
    - Navigate away and back to verify cache serves data instantly
    - Refocus browser window and confirm background refetch for stale queries
    - Test query invalidation by adding product to cart and checking product list refetch
    - Monitor network tab to confirm cache hits vs. network requests

12. Test product query hooks systematically:
    - useProducts: Test filtering, pagination, sorting combinations
    - useProduct: Fetch individual product and verify caching on repeated calls
    - useFeaturedProducts: Verify 10-minute staleTime with DevTools
    - useSaleProducts: Check discount calculations and LKR formatting
    - useRelatedProducts: Confirm conditional enabling based on productId
    - useProductSearch: Test debouncing by rapidly typing
    - useProductAvailability: Verify 30-second staleTime and refetch behavior

13. Validate category query hooks:
    - useCategories: Verify tree transformation creates proper parent-child structure
    - useCategory: Test breadcrumb generation for multi-level categories
    - useCategoryProducts: Confirm filtering works with includeSubcategories
    - useCategoryTree: Check depth level calculations and flat list generation
    - useFeaturedCategories: Verify featured flags and product counts

14. Test cross-store interactions and workflows:
    - Add product to recently viewed when viewing product detail page
    - Add product to cart from product detail and verify cart store updates
    - Move product from wishlist to cart and confirm both stores update
    - Login and verify cart/wishlist merge if anonymous cart exists
    - Logout and confirm sensitive data cleared but cart optionally persisted
    - Add product to comparison from listing and verify counter updates

15. Perform performance profiling using browser DevTools:
    - Record performance profile while adding item to cart
    - Verify cart operation completes in under 50ms
    - Check that localStorage write doesn't block UI (should be < 100ms)
    - Profile query hook performance during initial fetch vs. cache hit
    - Measure component re-render counts when store state updates (should only re-render components using changed state slices)
    - Check bundle size impact of Zustand and TanStack Query (should be < 50KB combined)
    - Verify no memory leaks by monitoring heap size over extended usage

16. Test error handling and edge cases:
    - Simulate network failure and verify query retry logic (3 attempts)
    - Test API 404 response and confirm query doesn't retry
    - Attempt to add invalid data to stores and verify validation
    - Fill cart with maximum allowed items and test capacity handling
    - Test concurrent modifications to same store state
    - Verify error messages are user-friendly and localized

17. Validate Sri Lankan localization throughout:
    - Confirm all prices display in LKR with රු symbol
    - Verify phone numbers format as +94 XXXXXXXXX
    - Check dates/times use Asia/Colombo timezone
    - Confirm currency formatting uses en-LK locale (e.g., "රු 1,250.00")
    - Test tax calculations at 15% VAT rate
    - Verify measurement units (kg, cm) appropriate for Sri Lankan market

18. Document all verification results:
    - Record passed tests in verification document
    - Document any issues discovered with severity level
    - Take screenshots of DevTools showing proper operation
    - Create issue tickets for bugs requiring fixes
    - Update README files with any discovered limitations or gotchas
    - Provide verification sign-off summary

### Expected Outcome

- All Zustand stores operational and tested
- Persistence working correctly with localStorage
- Cross-tab synchronization functional
- TanStack Query caching optimized
- Product and category hooks working as designed
- Cross-store interactions coordinated properly
- Performance meets defined thresholds
- Error handling robust and user-friendly
- Sri Lankan localization verified throughout
- Comprehensive verification documentation created
- All critical bugs identified and documented
- System ready for component integration (Groups F-H)

### Verification Checklist

- [ ] Verification document created in docs/verification/
- [ ] Test environment set up with sample data
- [ ] Cart Store: add, update, remove, clear operations tested
- [ ] Cart calculations (subtotal, tax, total) accurate in LKR
- [ ] Wishlist Store: add, remove, clear, move-to-cart tested
- [ ] Customer Store: login, logout, token management verified
- [ ] UI Store: all toggle states working correctly
- [ ] Recently Viewed: FIFO queue maintaining 10-item max
- [ ] Comparison Store: category validation and capacity limits enforced
- [ ] localStorage persistence working for all persisted stores
- [ ] State restoration after page refresh successful
- [ ] Cross-tab synchronization working within 1-2 seconds
- [ ] Query cache serving data correctly per staleTime configuration
- [ ] Query DevTools showing proper cache status
- [ ] Product hooks: all 8+ hooks tested and functional
- [ ] Category hooks: all 6+ hooks tested with tree transformation
- [ ] Cross-store workflows tested (recently viewed, cart integration)
- [ ] Performance profiling completed: operations < 50ms
- [ ] Query cache hit rate > 70% achieved
- [ ] No memory leaks detected over extended usage
- [ ] Error handling tested with network failures and 404s
- [ ] Query retry logic (3 attempts) working correctly
- [ ] Sri Lankan localization verified (LKR, +94, timezone)
- [ ] All verification results documented
- [ ] Screenshots captured of successful operations
- [ ] Issue tickets created for discovered bugs
- [ ] Verification sign-off summary completed

---

## Summary

### Tasks Completed

This document covered the implementation of extended state management features and server state integration for the LCC Webstore, completing Tasks 71-76:

**Task 71: Create Recently Viewed Store**
- Implemented FIFO queue for browsing history
- Maximum 10 products with automatic oldest-item removal
- localStorage persistence with 30-day aging policy
- Cross-tab synchronization for consistent history
- Timestamps formatted for Asia/Colombo timezone

**Task 72: Create Comparison Store**
- Product comparison functionality with 4-product maximum
- Same-category validation preventing incompatible comparisons
- localStorage persistence for comparison lists
- Clear error messaging for validation failures
- Automatic category tracking and reset logic

**Task 73: Configure TanStack Query Client**
- Global QueryClient setup with e-commerce optimized defaults
- Stale time: 5 minutes for product data freshness
- Cache time: 30 minutes for in-memory retention
- Retry logic: 3 attempts with exponential backoff (excluding 404/401)
- Query key factories for consistent cache keying
- DevTools integration for development debugging

**Task 74: Create Product Query Hooks**
- Comprehensive set of 8+ custom hooks for product data
- useProducts with filtering, pagination, sorting
- useProduct for individual product details with caching
- useFeaturedProducts with extended 10-minute stale time
- useSaleProducts with discount calculations in LKR
- useRelatedProducts for recommendations
- useProductSearch with debouncing for type-ahead
- useProductAvailability for real-time stock checking
- useProductMutations for write operations with cache invalidation

**Task 75: Create Category Query Hooks**
- 6+ custom hooks for category data management
- useCategories with hierarchical tree transformation
- useCategory with automatic breadcrumb generation
- useCategoryProducts with subcategory inclusion option
- useCategoryTree optimized for mega menu (20-min stale time)
- useCategoryBreadcrumb for navigation trails
- useCategoryFilters for available filtering options
- useCategorySearch for category-scoped search
- useFeaturedCategories for featured collections

**Task 76: Verify State Management**
- Comprehensive verification of all stores and hooks
- Persistence validation across page refreshes
- Cross-tab synchronization testing
- TanStack Query caching and invalidation verification
- Performance profiling meeting <50ms operation targets
- Error handling and edge case validation
- Sri Lankan localization verification (LKR, timezone, locale)
- Complete documentation of verification results

---

### Key Deliverables

#### Extended Stores
- Recently Viewed Store with FIFO queue management
- Comparison Store with validation and capacity limits
- Both stores with localStorage persistence and cross-tab sync

#### TanStack Query Infrastructure
- Configured QueryClient with optimized defaults
- Query key factory functions for consistent caching
- DevTools integration for debugging
- Utility functions for cache operations

#### Product Query Hooks
- useProducts, useProduct, useFeaturedProducts
- useSaleProducts, useRelatedProducts, useProductSearch
- useProductAvailability, useProductMutations
- All hooks with proper TypeScript typing

#### Category Query Hooks
- useCategories, useCategory, useCategoryProducts
- useCategoryTree, useCategoryBreadcrumb
- useCategoryFilters, useCategorySearch, useFeaturedCategories
- Tree transformation and breadcrumb utilities

#### Verification Artifacts
- Comprehensive verification documentation
- Performance profiling results
- Cross-store interaction testing results
- Localization verification for Sri Lankan context
- Issue tracking for discovered bugs

---

### Integration Points

**With Core Stores (Tasks 61-70):**
- Recently Viewed Store integrates with product detail pages
- Comparison Store interacts with cart for adding compared products
- Query hooks leverage Customer Store authentication tokens
- UI Store coordinates with query loading states

**With API Client (Task 60):**
- All query hooks use API client for data fetching
- Consistent error handling from API layer
- Authentication token injection from Customer Store
- Response transformation for Sri Lankan localization

**With Component Layer:**
- Store hooks provide clean interfaces for components
- Query hooks enable loading/error UI states
- Persistence ensures seamless user experience across sessions
- DevTools support debugging during development

**With Future Groups:**
- Group F utilities will enhance store selectors and helpers
- Group G components will consume all store hooks
- Group H routing will use prefetching utilities
- All stores ready for production deployment

---

### Next Steps

**Proceed to Group F: Store Utilities & Testing**

With state management fully implemented and verified, the next phase focuses on utility functions, helper libraries, and comprehensive testing:

1. **Task 77-80:** Implement store utility functions including selectors, formatters, validators, and performance helpers

2. **Task 81-84:** Create comprehensive test suites for all stores, hooks, and integrations with 80%+ coverage

3. **Task 85-88:** Develop store documentation, usage examples, and best practices guide

4. **Task 89-90:** Performance optimization and production readiness audit

**Navigation:**
- **Current:** [Group-E Doc 02 - Extended Stores & Query Integration]
- **Next:** [Group-F Doc 01 - Utility Functions](../Group-F_Store-Utilities-Testing/01_Tasks-77-84_Utility-Functions.md)

---

**Document End** | Tasks 71-76 Complete | Phase-08 SubPhase-01 Group-E Complete | Total Lines: ~985
