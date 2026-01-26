# Phase-08 SubPhase-01 Group-D Document 01
**Tasks 47-53: API Client, Base URL, Auth, Error Handler, Products, Categories, Cart**

---

## Document Metadata
- **Phase:** 08 - Webstore & E-Commerce Platform
- **SubPhase:** 01 - Webstore Project Structure
- **Group:** D - Store API Client
- **Document:** 01 of 02
- **Tasks Covered:** 47-53
- **Focus:** API Client Foundation & Core Modules

## Navigation
- **Parent:** [Group-D Overview](00_GROUP_OVERVIEW.md)
- **Previous Document:** [Group-C Doc 02](../Group-C_Store-Configuration/02_Tasks-41-46_Business-SEO-Verify.md)
- **Next Document:** [Group-D Doc 02](02_Tasks-54-60_Extended-Modules-Verify.md)

---

## Document Overview

This document establishes the API client infrastructure for the webstore, creating the foundation for all backend communications including authentication, error handling, and core data modules (products, categories, cart).

### Tasks Summary

| Task | Name | Dependencies | Est. Time | Complexity |
|------|------|--------------|-----------|------------|
| 47 | Create Store API Client | Task 46 | 2 hrs | Medium |
| 48 | Configure Store Base URL | Task 47 | 30 min | Low |
| 49 | Auth Token Interceptor | Tasks 47-48 | 2 hrs | Medium |
| 50 | Error Handler & Retry | Tasks 47-49 | 2 hrs | Medium |
| 51 | Products API Module | Tasks 47-50 | 2.5 hrs | Medium |
| 52 | Categories API Module | Tasks 47-50 | 1.5 hrs | Low |
| 53 | Cart API Module | Tasks 47-50 | 2.5 hrs | Medium |

---

## Task 47: Create Store API Client

### Overview
Establish the foundational API client using Axios for HTTP communications with the Django backend, providing centralized configuration and type-safe request/response handling.

### Dependencies
- Task 46 (Configuration verification completed)
- Axios library
- TypeScript configured

### Instructions

1. **Install Required Dependencies**
   - Navigate to webstore project root
   - Install Axios (^1.6.0 or later)
   - Install axios-retry for automatic retry logic
   - Verify installations in package.json

2. **Create API Client Directory Structure**
   - Create lib/api/ directory under src/
   - Create client.ts for main Axios instance
   - Create config.ts for configuration constants
   - Create interceptors/ subdirectory
   - Create modules/ subdirectory for endpoint groups
   - Create types/ subdirectory for TypeScript definitions
   - Create utils/ subdirectory for helpers

3. **Define Base Configuration Interface**
   - Create TypeScript interface for API configuration
   - Include baseURL, timeout, headers properties
   - Define withCredentials flag
   - Add maxRetries and retryDelay settings
   - Define default headers structure

4. **Create Base Axios Instance**
   - Import Axios in client.ts
   - Create Axios instance with base configuration
   - Set Content-Type: application/json header
   - Set Accept: application/json header
   - Configure 30-second timeout
   - Enable withCredentials for cookies
   - Export instance for use across application

5. **Define TypeScript Response Types**
   - Create types/responses.ts file
   - Define ApiResponse<T> generic interface (success, status, message, data)
   - Define PaginatedResponse<T> interface (count, next, previous, results)
   - Define ApiError interface (statusCode, message, errors array)
   - Define ValidationError interface (field, messages)

6. **Define TypeScript Request Types**
   - Create types/requests.ts file
   - Define PaginationParams interface (page, page_size, ordering)
   - Define FilterParams generic interface
   - Define SearchParams interface (q, fields)

7. **Create API Client Wrapper Class**
   - Design StoreApiClient class in client.ts
   - Implement get<T>() method with typed response
   - Implement post<T>() method
   - Implement put<T>() method
   - Implement patch<T>() method
   - Implement delete<T>() method
   - Add generic request<T>() method for custom configs

8. **Add Request/Response Type Guards**
   - Create utils/validators.ts file
   - Implement isApiResponse<T>() type guard
   - Implement isPaginatedResponse<T>() type guard
   - Implement isApiError() type guard
   - Implement isValidationError() type guard

9. **Export Public API Interface**
   - Create api/index.ts file
   - Export singleton API client instance
   - Export all type definitions
   - Export utility functions
   - Re-export module interfaces

### Expected Outcome
- Base API client structure established
- Axios instance configured with defaults
- TypeScript types for requests/responses defined
- Wrapper class providing type-safe HTTP methods
- Type guards for runtime validation
- Clean import structure for components

### Verification Checklist
- [ ] package.json includes axios dependency
- [ ] Directory structure created (client, config, interceptors, modules, types, utils)
- [ ] client.ts compiles without errors
- [ ] Axios instance creates successfully
- [ ] TypeScript interfaces defined for all response types
- [ ] StoreApiClient class methods properly typed
- [ ] Type guards return correct boolean values
- [ ] api/index.ts exports all necessary interfaces
- [ ] No circular dependencies exist
- [ ] Imports work from components

---

## Task 48: Configure Store Base URL

### Overview
Implement environment-aware API base URL configuration supporting development, staging, and production environments with validation and URL construction utilities.

### Dependencies
- Task 47 (API Client created)
- Task 31 (Environment variables configured)

### Instructions

1. **Create Environment Variable Files**
   - Add NEXT_PUBLIC_API_BASE_URL to .env.local
   - Add NEXT_PUBLIC_API_TIMEOUT to .env.local
   - Add NEXT_PUBLIC_ENABLE_API_LOGGING for debug
   - Create .env.example template with documentation
   - Ensure .env files in .gitignore

2. **Define Environment Configuration Schema**
   - Create config/environment.ts file
   - Define EnvironmentConfig interface
   - Include API settings (baseURL, timeout, retryAttempts)
   - Include feature flags (enableLogging, enableRetry)
   - Include environment info (environment, version)

3. **Implement Environment Variable Loader**
   - Create loadEnvironmentConfig() function
   - Read NEXT_PUBLIC_API_BASE_URL from process.env
   - Validate URL format (must be valid HTTP/HTTPS)
   - Apply default values for missing optional variables
   - Throw errors if required variables missing
   - Return typed configuration object

4. **Create URL Builder Utility**
   - Create utils/url-builder.ts file
   - Implement buildApiUrl(path, params) function
   - Combine base URL with path
   - Normalize slashes (remove doubles)
   - Append and encode query parameters
   - Validate final URL format
   - Return complete API endpoint URL

5. **Implement Environment Detection**
   - Create utils/environment.ts file
   - Implement isDevelopment() function
   - Implement isProduction() function
   - Implement isStaging() function
   - Implement isBrowser() function
   - Implement isServer() function
   - Use NODE_ENV and custom variables

6. **Configure Base URL in API Client**
   - Import environment configuration in client.ts
   - Replace hardcoded baseURL with config value
   - Apply environment-specific settings
   - Add environment info to request headers
   - Log configuration in development mode

7. **Add Configuration Debugging**
   - Create debug utility functions
   - Implement printConfig() to log config (mask secrets)
   - Implement validateConfig() to check validity
   - Implement getConfigHealth() to return status
   - Create debug endpoint for development showing active config

8. **Handle Multi-Tenant Base URLs (if applicable)**
   - Accept tenant identifier in configuration
   - Construct tenant-specific API URLs
   - Store tenant context in configuration
   - Apply tenant header to all requests

### Expected Outcome
- Environment variables loaded and validated
- API base URL configured per environment
- URL construction utilities working correctly
- Environment detection functions operational
- Configuration validation in place
- Debug tools available in development

### Verification Checklist
- [ ] .env.local created with API_BASE_URL
- [ ] .env.example template documented
- [ ] Environment variables load at startup
- [ ] Missing required variables throw errors
- [ ] buildApiUrl() constructs valid URLs
- [ ] Query parameters properly encoded
- [ ] isDevelopment/isProduction work correctly
- [ ] API client uses environment base URL
- [ ] Configuration validation runs successfully
- [ ] Debug tools display config safely

---

## Task 49: Auth Token Interceptor

### Overview
Implement request interceptor to automatically attach authentication tokens (JWT) to API requests, handle token refresh logic, and manage token expiration.

### Dependencies
- Tasks 47-48 (API Client and base URL configured)
- Authentication system defined

### Instructions

1. **Define Token Storage Strategy**
   - Determine storage approach (localStorage, cookies, memory)
   - For access token: Use memory storage (short-lived, 15 min)
   - For refresh token: Use HttpOnly cookie (long-lived, 7 days)
   - Implement token storage interface with get/set/remove methods

2. **Create Token Management Service**
   - Create interceptors/auth.ts file
   - Implement setAccessToken(token) method
   - Implement getAccessToken() method
   - Implement setRefreshToken(token) method
   - Implement getRefreshToken() method
   - Implement isTokenExpired(token) method
   - Implement clearTokens() method
   - Implement refreshAccessToken() method

3. **Implement JWT Token Decoder**
   - Create decodeToken(token) utility function
   - Extract JWT payload without verification
   - Implement getTokenExpiration(token) to extract exp claim
   - Implement isTokenValid(token) to check structure
   - Implement getTokenClaims(token) to extract user info

4. **Create Request Interceptor**
   - Register interceptor on Axios instance
   - Check if request requires authentication
   - Retrieve access token from storage
   - Validate token expiration before request
   - Refresh if expired (within refresh window)
   - Attach token to Authorization header (Bearer format)
   - Handle refresh failures (clear tokens, redirect)

5. **Implement Token Refresh Logic**
   - Detect token expiration before request sends
   - Check if refresh token available
   - Send refresh request to /api/auth/refresh/
   - Receive new access token in response
   - Update stored access token
   - Retry original request with new token
   - Handle refresh token expiration

6. **Implement Concurrent Refresh Handling**
   - Set refresh-in-progress flag during refresh
   - Queue requests during refresh operation
   - Apply new token to all queued requests
   - Process queued requests after refresh completes

7. **Define Public vs Protected Routes**
   - Create route configuration file
   - List public routes (login, register, browsing)
   - List protected routes (cart, orders, profile)
   - Implement route matcher to determine auth requirement

8. **Add Token Security Headers**
   - Add Authorization header (Bearer token)
   - Add X-CSRF-Token header for CSRF protection
   - Add X-Request-ID header (UUID per request)
   - Add X-Client-Version header

9. **Handle Authentication Errors**
   - Catch 401 Unauthorized (attempt refresh)
   - Catch 403 Forbidden (show permission error)
   - Handle token refresh failures (redirect to login)
   - Handle network errors during refresh (queue retry)

### Expected Outcome
- Authentication tokens automatically attached to requests
- Token refresh logic working seamlessly
- Public vs protected routes properly configured
- Token expiration handled gracefully
- Security headers included
- Authentication errors handled appropriately

### Verification Checklist
- [ ] Token storage interface implemented
- [ ] Access tokens stored securely
- [ ] Refresh tokens stored in HttpOnly cookies
- [ ] JWT decoder extracts claims correctly
- [ ] Request interceptor registered
- [ ] Authorization header attached to protected routes
- [ ] Expired tokens trigger refresh automatically
- [ ] Refresh endpoint called correctly
- [ ] Original request retried after refresh
- [ ] Concurrent refreshes handled properly
- [ ] Public routes skip authentication
- [ ] 401 errors trigger refresh attempt
- [ ] Failed refresh redirects to login
- [ ] Security headers present in requests

---

## Task 50: Error Handler & Retry Logic

### Overview
Implement comprehensive error handling with automatic retry logic, error classification, transformation to user-friendly messages, and error logging.

### Dependencies
- Tasks 47-49 (API Client, base URL, auth configured)

### Instructions

1. **Define Error Classification System**
   - Create types/errors.ts file
   - Define error categories (Network, Client 4xx, Server 5xx, Application)
   - Create TypeScript types for each category
   - Map HTTP status codes to error types

2. **Create Custom Error Classes**
   - Implement base ApiError class
   - Include properties: message, statusCode, errorCode, details, originalError, timestamp, requestId
   - Create NetworkError class extending ApiError
   - Create ValidationError class extending ApiError
   - Create AuthenticationError class
   - Create AuthorizationError class
   - Create RateLimitError class
   - Create ServerError class
   - Create TimeoutError class

3. **Implement Error Response Transformer**
   - Register response error interceptor on Axios
   - Extract status code and response data
   - Classify error type based on status code
   - Create appropriate custom error instance
   - Preserve original error information
   - Add debugging context (URL, method, timestamp, requestId)
   - Return rejected promise with custom error

4. **Configure Retry Logic**
   - Install and configure axios-retry library
   - Set retry conditions (network errors, 5xx, timeouts)
   - Configure max retry attempts per error type
   - Implement exponential backoff strategy
   - Implement linear delay for rate limits
   - Honor Retry-After header for 429 responses

5. **Implement Retry Conditions**
   - Create isRetryableError(error) function
   - Retry: Network errors, 5xx, 429, 408, 503
   - Do not retry: 4xx (except 429), auth errors, validation errors
   - Create isIdempotentRequest(config) function
   - Safe to retry: GET, HEAD, OPTIONS
   - Check idempotency key for POST/PUT/PATCH

6. **Add Idempotency Key Support**
   - Generate UUID for each request
   - Attach as X-Idempotency-Key header
   - Backend uses key to detect duplicates
   - Reuse same key for retry attempts
   - Clear key after successful response

7. **Create User-Friendly Error Messages**
   - Map technical errors to user messages
   - Example: ECONNREFUSED → "Unable to connect. Check your connection."
   - Example: 500 → "Something went wrong on our end."
   - Example: 404 → "Resource not found."
   - Example: 422 → "Please check your input."
   - Example: 429 → "Too many requests. Please wait."
   - Implement message localization (English, Sinhala, Tamil)

8. **Add Error Logging and Monitoring**
   - Implement error logging with levels (ERROR, WARN, INFO, DEBUG)
   - Log structure: level, timestamp, message, error details, request info, context
   - Log to console in development
   - Send to monitoring service in production (e.g., Sentry)
   - Sanitize sensitive data in logs

### Expected Outcome
- Comprehensive error classification system
- Custom error classes for all error types
- Error transformation providing consistent structure
- Automatic retry with intelligent backoff
- Idempotency support for safe retries
- User-friendly error messages
- Error logging and monitoring integrated

### Verification Checklist
- [ ] Error types classified correctly
- [ ] Custom error classes compile successfully
- [ ] Response interceptor catches all errors
- [ ] Errors transformed to custom instances
- [ ] axios-retry integrated and configured
- [ ] Retry logic respects max attempts
- [ ] Exponential backoff working
- [ ] Network errors trigger retry
- [ ] 4xx errors do not retry
- [ ] Idempotency keys generated and attached
- [ ] Same key reused for retries
- [ ] User messages clear and actionable
- [ ] Error logging captures all details
- [ ] Sensitive data sanitized in logs
- [ ] Production errors sent to monitoring

---

## Task 51: Products API Module

### Overview
Create dedicated API module for product-related endpoints enabling listing, searching, filtering, and retrieving product details with full TypeScript typing.

### Dependencies
- Tasks 47-50 (API Client infrastructure complete)

### Instructions

1. **Define Product Type Definitions**
   - Create types/products.ts file
   - Define Product interface with all fields
   - Include: id, sku, barcode, name, slug, description
   - Include: category, brand, tags
   - Include: price, sale_price, discount_percentage, currency (LKR), tax_rate
   - Include: stock_quantity, in_stock, backorder_allowed
   - Include: images array, featured_image, video_url
   - Include: has_variants, variants array
   - Include: meta fields (meta_title, meta_description, meta_keywords)
   - Include: status fields (is_active, is_featured, published_at)
   - Include: metadata (created_at, updated_at, view_count, rating_average, review_count)
   - Define ProductImage interface
   - Define ProductVariant interface
   - Define Category, Brand interfaces

2. **Define Product Query Parameters**
   - Create ProductQueryParams interface
   - Include pagination (page, page_size)
   - Include filtering (category, brand, tags, price_min, price_max, in_stock, is_featured)
   - Include search (search, search_fields)
   - Include sorting (ordering: price, -price, name, -created_at, popularity)
   - Include special filters (on_sale, new_arrivals, low_stock)
   - Include variant options (include_variants, variant_attributes)

3. **Create Products API Module**
   - Create modules/products.ts file
   - Implement listProducts(params?) method
   - Returns PaginatedResponse<Product>
   - Implement getProductById(productId) method
   - Returns ApiResponse<Product>
   - Implement getProductBySlug(slug) method
   - Returns ApiResponse<Product>
   - Implement searchProducts(query, filters?) method
   - Returns PaginatedResponse<Product>
   - Implement getFeaturedProducts(limit?) method
   - Returns ApiResponse<Product[]>
   - Implement getRelatedProducts(productId, limit?) method
   - Returns ApiResponse<Product[]>

4. **Implement Product Variant Handling**
   - Implement getProductVariants(productId) method
   - Returns array of ProductVariant objects
   - Implement getVariantByAttributes(productId, attributes) method
   - Find variant matching attribute combination (size, color, etc.)
   - Returns specific ProductVariant or null

5. **Add Product Filtering Helpers**
   - Create filterByPriceRange(min, max) utility
   - Create filterByCategory(categorySlug) utility
   - Create filterInStock() utility
   - Create filterOnSale() utility
   - Create filterNewArrivals(days?) utility
   - Create combineFilters(...filters) utility to merge filter objects

6. **Implement Product Image Handling**
   - Create getProductImageUrl(product, size?) utility
   - Support sizes: thumbnail (150x150), medium (300x300), large (800x800), full
   - Create getProductImageGallery(product) utility
   - Returns array of all images sorted by order
   - Create getFeaturedImageOrDefault(product) utility
   - Returns featured image or fallback placeholder

7. **Add Product Caching Strategy**
   - Cache product lists for 5 minutes
   - Cache product details for 10 minutes
   - Cache featured products for 15 minutes
   - Cache search results for 3 minutes
   - Check cache before API request
   - Store response in cache with TTL
   - Invalidate cache on relevant mutations

8. **Create Product URL Helpers**
   - Implement getProductUrl(product) function
   - Format: `/products/${product.slug}`
   - Implement getProductShareUrl(product) function
   - Full URL: `https://store.lcc.lk/products/${product.slug}`
   - Implement getCategoryUrl(category) function
   - Format: `/categories/${category.slug}`

### Expected Outcome
- Complete products API module with all endpoints
- Type-safe product operations
- Product variants handled correctly
- Filtering and search functional
- Image handling utilities available
- Caching strategy implemented
- URL helpers for routing

### Verification Checklist
- [ ] Product TypeScript interfaces defined
- [ ] ProductQueryParams interface comprehensive
- [ ] listProducts() returns paginated results
- [ ] getProductById() fetches single product
- [ ] getProductBySlug() works with slug parameter
- [ ] searchProducts() performs search correctly
- [ ] getFeaturedProducts() returns featured items
- [ ] getRelatedProducts() finds related products
- [ ] getProductVariants() returns all variants
- [ ] getVariantByAttributes() matches correctly
- [ ] Filtering helpers create correct params
- [ ] Image URL utilities return valid URLs
- [ ] Caching stores and retrieves responses
- [ ] URL helpers generate correct paths

---

## Task 52: Categories API Module

### Overview
Implement API module for product categories with hierarchy support, breadcrumb generation, category tree navigation, and category-product integration.

### Dependencies
- Tasks 47-50 (API Client infrastructure)

### Instructions

1. **Define Category Type Definitions**
   - Create types/categories.ts file
   - Define Category interface
   - Include: id, slug, name, description
   - Include: parent (parent category ID), parent_category (nested object)
   - Include: level (0 = root, 1+ = nested), path (full hierarchy path)
   - Include: icon, image, banner_image, display_order, color
   - Include: product_count, subcategory_count
   - Include: meta_title, meta_description
   - Include: is_active, is_featured
   - Include: created_at, updated_at
   - Define CategoryTree interface (category, children array, product_count_recursive)

2. **Create Category Query Parameters**
   - Define CategoryQueryParams interface
   - Include: parent (filter by parent ID), level, is_active, is_featured
   - Include: include_products, include_subcategories, include_counts
   - Include: page, page_size, ordering

3. **Implement Categories API Methods**
   - Create modules/categories.ts file
   - Implement listCategories(params?) method
   - Returns PaginatedResponse<Category>
   - Implement getCategoryById(categoryId) method
   - Returns ApiResponse<Category>
   - Implement getCategoryBySlug(slug) method
   - Returns ApiResponse<Category>
   - Implement getRootCategories() method
   - Returns ApiResponse<Category[]> (level 0 only)
   - Implement getSubcategories(parentId) method
   - Returns ApiResponse<Category[]>
   - Implement getCategoryTree() method
   - Returns ApiResponse<CategoryTree[]> (nested structure)

4. **Implement Category Hierarchy Navigation**
   - Create getBreadcrumbs(category) utility
   - Parse category.path and generate breadcrumb array
   - Returns: [{ name: "Home", url: "/" }, { name: "Electronics", url: "/categories/electronics" }, ...]
   - Create getCategoryAncestors(category) utility
   - Returns array of parent categories to root
   - Create getCategoryDescendants(categoryId) utility
   - Returns all subcategories recursively

5. **Create Category Tree Utilities**
   - Implement flattenCategoryTree(tree) function
   - Convert nested tree to flat array
   - Implement findCategoryInTree(tree, categoryId) function
   - Search tree for specific category node
   - Implement buildCategoryTree(flatCategories) function
   - Construct tree from flat category list
   - Implement getCategoryLevel(category) function
   - Return hierarchy depth level
   - Implement getCategoryChildren(tree, categoryId) function
   - Get immediate children of category

6. **Implement Category-Product Integration**
   - Create getProductsByCategory(categoryId, params?) method
   - Call products API with category filter
   - Returns PaginatedResponse<Product>
   - Create getCategoryProductCount(categoryId, includeSubcategories?) method
   - Returns product count for category
   - Create getFeaturedProductsByCategory(categoryId, limit?) method
   - Returns featured products for category page

7. **Add Category Display Utilities**
   - Create getCategoryIcon(category) utility
   - Returns icon name/URL with fallback
   - Create getCategoryImage(category, size?) utility
   - Returns category image URL
   - Create getCategoryColor(category) utility
   - Returns category color for UI theming
   - Create formatCategoryPath(category) utility
   - Format: "Electronics > Computers > Laptops"
   - Create getCategoryUrl(category) utility
   - Format: `/categories/${category.slug}`

8. **Implement Navigation Menu Builder**
   - Create buildNavigationMenu(options?) utility
   - Options: maxDepth, includeProductCounts, featuredOnly, limit
   - Generate structured menu from categories
   - Returns NavigationMenu object with items array
   - Each item includes: category, label, url, icon, badge, children, isFeatured, isActive

### Expected Outcome
- Complete categories API module
- Category hierarchy navigation working
- Tree utilities functional
- Integration with products API
- Navigation menu builder ready for UI
- Display utilities available

### Verification Checklist
- [ ] Category TypeScript interfaces defined
- [ ] CategoryTree supports nested structure
- [ ] listCategories() returns categories
- [ ] getCategoryById() fetches single category
- [ ] getCategoryBySlug() works with slugs
- [ ] getRootCategories() returns top-level only
- [ ] getSubcategories() filters by parent
- [ ] getCategoryTree() returns nested structure
- [ ] getBreadcrumbs() generates correct trail
- [ ] getCategoryAncestors() returns parents
- [ ] Tree flattening/building utilities work
- [ ] getProductsByCategory() filters correctly
- [ ] Navigation menu builder generates structure
- [ ] Display utilities return correct values

---

## Task 53: Cart API Module

### Overview
Implement shopping cart API module with add/remove/update operations, cart persistence, cart validation, coupon application, and cart summary calculations.

### Dependencies
- Tasks 47-50 (API Client infrastructure)
- Task 51 (Products API for product data)

### Instructions

1. **Define Cart Type Definitions**
   - Create types/cart.ts file
   - Define Cart interface
   - Include: id, session_id, user_id
   - Include: items (CartItem array), item_count
   - Include: subtotal, tax_total, shipping_total, discount_total, grand_total, currency (LKR)
   - Include: applied_coupons (Coupon array)
   - Include: is_active, is_merged
   - Include: created_at, updated_at, last_activity, expires_at
   - Define CartItem interface
   - Include: id, cart_id, product_id, variant_id
   - Include: product (full Product object), variant (ProductVariant object)
   - Include: quantity, unit_price, line_total, tax_amount, discount_amount
   - Include: in_stock, stock_available, max_quantity
   - Include: is_valid, validation_errors
   - Include: added_at, updated_at

2. **Define Cart Operation Parameters**
   - Create AddToCartParams interface (product_id, variant_id?, quantity, replace_quantity?)
   - Create UpdateCartItemParams interface (item_id, quantity)
   - Create RemoveFromCartParams interface (item_id)
   - Create ApplyCouponParams interface (coupon_code)

3. **Implement Core Cart API Methods**
   - Create modules/cart.ts file
   - Implement getCart() method
   - GET /api/v1/store/cart/
   - Returns ApiResponse<Cart>
   - Implement addToCart(params) method
   - POST /api/v1/store/cart/items/
   - Validate required parameters
   - Returns ApiResponse<Cart>
   - Implement updateCartItem(params) method
   - PATCH /api/v1/store/cart/items/{item_id}/
   - Returns ApiResponse<Cart>
   - Implement removeFromCart(params) method
   - DELETE /api/v1/store/cart/items/{item_id}/
   - Returns ApiResponse<Cart>
   - Implement clearCart() method
   - DELETE /api/v1/store/cart/clear/
   - Returns ApiResponse<Cart>

4. **Implement Cart Summary Calculations**
   - Create calculateSubtotal(cart) utility
   - Sum of all item line_total values
   - Create calculateTaxTotal(cart) utility
   - Sum of all item tax_amount values
   - Create calculateDiscountTotal(cart) utility
   - Total discount from coupons and promotions
   - Create calculateGrandTotal(cart) utility
   - subtotal + tax + shipping - discounts
   - Create getItemCount(cart) utility
   - Sum of all item quantities

5. **Add Cart Validation Methods**
   - Create validateCart(cart) function
   - Check: All items in stock
   - Check: Quantities within limits
   - Check: Prices up to date
   - Check: Items still active
   - Returns ValidationResult (is_valid, errors, warnings)
   - Create validateCartItem(item) function
   - Check: Product exists
   - Check: Variant available
   - Check: In stock
   - Check: Price unchanged
   - Returns ItemValidationResult

6. **Implement Coupon/Discount Operations**
   - Implement applyCoupon(params) method
   - POST /api/v1/store/cart/coupons/
   - Backend validates coupon
   - Returns Cart with discount applied
   - Implement removeCoupon(couponCode) method
   - DELETE /api/v1/store/cart/coupons/{couponCode}/
   - Returns Cart with recalculated totals
   - Create getCouponDiscount(cart, couponCode) utility
   - Returns discount amount from specific coupon

7. **Add Cart Persistence & Sync**
   - Implement saveCartLocally(cart) function
   - Save cart to localStorage
   - Implement loadCartLocally() function
   - Load cart from localStorage
   - Implement syncCart() function
   - Sync local cart with backend
   - Merge items (backend as source of truth)
   - Implement mergeGuestCart() function
   - Merge guest cart with user cart on login
   - Clear guest cart after merge

8. **Create Cart UI Helper Functions**
   - Create formatCartTotal(amount, currency) utility
   - Format: "රු 15,450.00" or "LKR 15,450.00"
   - Create getCartItemImage(item) utility
   - Return product/variant image URL
   - Create getCartItemName(item) utility
   - Full item name with variant details
   - Create isCartEmpty(cart) utility
   - Check if cart has items
   - Create canProceedToCheckout(cart) utility
   - Validate: has items, all valid, no stock issues, total > 0
   - Create getCartExpiry(cart) utility
   - Return expiration date for guest carts
   - Create getOutOfStockItems(cart) utility
   - Return items out of stock
   - Create getUpdatedPriceItems(cart) utility
   - Return items whose prices changed

### Expected Outcome
- Complete cart API module implemented
- All cart operations functional (add, update, remove, clear)
- Cart calculations accurate (subtotal, tax, grand total)
- Coupon application working
- Cart validation comprehensive
- Persistence and sync functional
- UI helper functions available

### Verification Checklist
- [ ] Cart TypeScript interfaces defined
- [ ] CartItem includes all necessary fields
- [ ] Operation parameter interfaces created
- [ ] getCart() retrieves current cart
- [ ] addToCart() adds items successfully
- [ ] updateCartItem() modifies quantities
- [ ] removeFromCart() deletes items
- [ ] clearCart() empties cart
- [ ] calculateSubtotal() sums correctly
- [ ] calculateGrandTotal() matches backend
- [ ] validateCart() checks all conditions
- [ ] applyCoupon() applies discounts correctly
- [ ] removeCoupon() recalculates totals
- [ ] Local storage saves/loads cart
- [ ] Cart sync keeps data consistent
- [ ] Guest cart merges on login
- [ ] formatCartTotal() formats in LKR (රු)
- [ ] UI helpers return correct values

---

## Summary

This document established the complete API client infrastructure for the webstore, covering Tasks 47-53.

### Completed Tasks Recap

1. **Task 47** - Store API Client: Axios-based client with TypeScript typing
2. **Task 48** - Base URL Config: Environment-aware URL configuration
3. **Task 49** - Auth Interceptor: Automatic token attachment and refresh
4. **Task 50** - Error Handler: Comprehensive error handling with retry logic
5. **Task 51** - Products API: Full product module with filtering, search, variants
6. **Task 52** - Categories API: Category hierarchy with tree navigation
7. **Task 53** - Cart API: Shopping cart operations with validation

### Key Infrastructure Created

**API Client Foundation:**
- Axios instance with interceptors
- Type-safe request/response handling
- Environment-based configuration
- Error classification and transformation
- Automatic retry with exponential backoff
- Idempotency support

**Authentication Layer:**
- JWT token management
- Automatic token refresh
- Public vs protected route handling
- Security headers (Authorization, CSRF, Request ID)

**Data Modules:**
- Products: Listing, search, filtering, variants, images
- Categories: Hierarchy, tree navigation, breadcrumbs
- Cart: Add/update/remove, validation, coupons, persistence

### Sri Lankan Localization

- Currency: LKR (රු) formatting in cart
- Price display: රු 15,450.00 format
- All API responses include LKR currency code

### Next Steps

**Proceed to Group-D Document 02** (Tasks 54-60) to implement:
- Checkout API module
- Customer/User API module
- Orders API module
- Reviews API module
- Wishlist API module
- Search API module
- API client verification

All API infrastructure is now in place and ready for extended modules and verification.

---

**End of Document 01**
