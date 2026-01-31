# Tasks 35-44: Types, Timer, and Section

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** C - Flash Sales System  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-45-52_Cards-Page-Verify.md](02_Tasks-45-52_Cards-Page-Verify.md)

---

## Document Overview

This document covers the foundational setup of the flash sales system, including type definitions, API client configuration, state management, and the countdown timer implementation. It establishes the core infrastructure for displaying flash sales with real-time countdowns and creates the primary section components for homepage integration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create Flash Sale Types | Medium | 30 min |
| 36 | Create Flash Sale API | Medium | 45 min |
| 37 | Create Active Sales Query | Medium | 30 min |
| 38 | Create Flash Sale Store | Medium | 40 min |
| 39 | Create Countdown Timer Hook | High | 60 min |
| 40 | Create CountdownTimer Component | Medium | 45 min |
| 41 | Create CountdownTimer Digits | Medium | 50 min |
| 42 | Create CountdownTimer Expired | Low | 20 min |
| 43 | Create Flash Sale Banner | Medium | 40 min |
| 44 | Create Flash Sale Section | Medium | 50 min |

---

## Task 35: Create Flash Sale Types

### Overview
Define comprehensive TypeScript types and interfaces for the flash sales system. These types establish the data structure for flash sales, products, discounts, and related entities. Proper typing ensures type safety throughout the application and provides clear documentation of the flash sale data model.

### Dependencies
- Task 34 (Loyalty Points API) from Group B
- TypeScript configuration in frontend project
- Product types from catalog module

### Instructions

1. **Create flash sale types directory**
   - Navigate to `frontend/lib/marketing/` directory
   - Create `types` subdirectory if it doesn't exist
   - This directory will house marketing-related type definitions

2. **Create flash sale types file**
   - Create `flash-sale.types.ts` in `lib/marketing/types/` directory
   - Set up proper TypeScript imports and exports

3. **Define FlashSale base interface**
   - Include unique identifier (id: string)
   - Add sale name/title (name: string)
   - Add description field (description: string)
   - Include start time (startTime: Date | string)
   - Include end time (endTime: Date | string)
   - Add status enum (status: FlashSaleStatus)
   - Include featured flag (featured: boolean)

4. **Define FlashSaleStatus enum**
   - SCHEDULED: Sale not yet started
   - ACTIVE: Sale currently running
   - ENDING_SOON: Sale ending within 1 hour
   - EXPIRED: Sale has ended
   - CANCELLED: Sale cancelled by admin

5. **Define FlashSaleProduct interface**
   - Include product ID reference
   - Add original price (originalPrice: number)
   - Add sale price (salePrice: number)
   - Calculate discount percentage
   - Include stock information (stockAvailable: number)
   - Add sales limit per user (maxPerUser: number)
   - Include purchase count (soldCount: number)

6. **Define discount type structures**
   - DiscountType enum (PERCENTAGE, FIXED_AMOUNT, BUY_X_GET_Y)
   - DiscountConfig interface with type-specific fields
   - Validation rules for discount application

7. **Define display configuration types**
   - Banner configuration (image, text, CTA)
   - Badge styling options (color, position)
   - Timer display preferences

8. **Define API response types**
   - FlashSaleListResponse with pagination
   - FlashSaleDetailResponse with full data
   - ActiveFlashSalesResponse for current sales
   - FlashSaleProductResponse for product details

9. **Add utility types**
   - FlashSaleFilter for filtering criteria
   - FlashSaleSortOption for sorting options
   - TimeRemaining for countdown display
   - StockStatus enum for inventory states

10. **Add Sri Lanka specific types**
    - SeasonalSaleType (Avurudu, Vesak, Christmas)
    - RegionalDiscount for location-based sales
    - LKRPriceDisplay for currency formatting

### Flash Sale Type Structure

| Type | Purpose | Key Fields |
|------|---------|------------|
| FlashSale | Main sale entity | id, name, startTime, endTime, status |
| FlashSaleProduct | Product in sale | productId, originalPrice, salePrice, stock |
| FlashSaleStatus | Sale state | SCHEDULED, ACTIVE, ENDING_SOON, EXPIRED |
| DiscountConfig | Discount rules | type, value, conditions |
| TimeRemaining | Countdown data | days, hours, minutes, seconds |

### Status Transition Flow

```
┌─────────────┐
│  SCHEDULED  │ (Future sale)
└──────┬──────┘
       │ Start time reached
       ▼
┌─────────────┐
│   ACTIVE    │ (Sale running)
└──────┬──────┘
       │ < 1 hour remaining
       ▼
┌─────────────┐
│ENDING_SOON  │ (Urgent state)
└──────┬──────┘
       │ End time reached
       ▼
┌─────────────┐
│   EXPIRED   │ (Sale ended)
└─────────────┘
```

### Discount Type Options

| Type | Description | Example |
|------|-------------|---------|
| PERCENTAGE | Percentage off original price | 20% off |
| FIXED_AMOUNT | Fixed amount discount | ₨500 off |
| BUY_X_GET_Y | Buy X get Y free | Buy 2 Get 1 Free |

### Price Calculation Types

| Field | Type | Formula |
|-------|------|---------|
| originalPrice | number | Base product price |
| salePrice | number | Discounted price |
| discountAmount | number | originalPrice - salePrice |
| discountPercentage | number | (discountAmount / originalPrice) × 100 |
| savings | number | discountAmount |

### Sri Lanka Seasonal Sales

| Season | Typical Period | Cultural Context |
|--------|----------------|------------------|
| Avurudu | Mid-April | Sinhala & Tamil New Year |
| Vesak | May Full Moon | Buddhist festival |
| Christmas | December | Christian celebration |
| Deepavali | October/November | Hindu festival of lights |

### Expected Outcome
- Comprehensive type definitions for flash sales
- Type-safe data structures throughout the application
- Clear documentation through TypeScript interfaces
- Support for complex discount scenarios
- Sri Lanka localization support

### Verification Checklist
- [ ] `frontend/lib/marketing/types/flash-sale.types.ts` file created
- [ ] FlashSale interface defined with all required fields
- [ ] FlashSaleStatus enum defined
- [ ] FlashSaleProduct interface defined
- [ ] DiscountType enum and DiscountConfig interface defined
- [ ] TimeRemaining type defined
- [ ] API response types defined
- [ ] Seasonal sale types for Sri Lanka included
- [ ] All types properly exported

---

## Task 36: Create Flash Sale API

### Overview
Implement the API client for flash sales, providing methods to fetch active sales, retrieve sale details, and query sale products. This client handles communication with the backend, error handling, and data transformation.

### Dependencies
- Task 35: Create Flash Sale Types

### Instructions

1. **Create flash sale API file**
   - Navigate to `frontend/lib/marketing/` directory
   - Create `flash-sale-api.ts` file
   - Set up API client imports and configuration

2. **Import required dependencies**
   - Import Axios or fetch client
   - Import flash sale types from Task 35
   - Import API utilities (error handling, transformers)
   - Import base API configuration

3. **Define API endpoints constants**
   - Base URL: `/api/marketing/flash-sales`
   - Active sales: `/api/marketing/flash-sales/active`
   - Sale details: `/api/marketing/flash-sales/:id`
   - Sale products: `/api/marketing/flash-sales/:id/products`
   - Product details: `/api/marketing/flash-sales/products/:productId`

4. **Implement getActiveFlashSales method**
   - Fetch currently active sales from server
   - Accept optional filters (featured, category)
   - Return array of FlashSale objects
   - Handle empty results gracefully

5. **Implement getFlashSaleById method**
   - Fetch detailed sale information by ID
   - Include all sale products
   - Return complete FlashSale object with products
   - Handle not found errors

6. **Implement getFlashSaleProducts method**
   - Fetch products for specific sale
   - Support pagination parameters
   - Support filtering by category, price range
   - Return paginated product list

7. **Implement getUpcomingSales method**
   - Fetch scheduled sales (status: SCHEDULED)
   - Sort by start time ascending
   - Return list of upcoming sales
   - Useful for "Coming Soon" sections

8. **Add response transformation**
   - Convert date strings to Date objects
   - Calculate derived fields (discount percentage)
   - Format prices for LKR currency
   - Normalize data structure

9. **Implement error handling**
   - Catch network errors
   - Handle 404 (sale not found)
   - Handle 403 (access denied)
   - Return user-friendly error messages

10. **Add request caching strategy**
    - Cache active sales for 1 minute
    - Cache sale details for 2 minutes
    - Invalidate cache on sale state change
    - Implement cache key generation

11. **Add Sri Lanka specific methods**
    - getSeasonalSales(season: string)
    - getLocationBasedSales(region: string)
    - Support LKR currency formatting

### API Client Structure

| Method | Endpoint | Purpose |
|--------|----------|---------|
| getActiveFlashSales | GET /active | Fetch current sales |
| getFlashSaleById | GET /:id | Fetch sale details |
| getFlashSaleProducts | GET /:id/products | Fetch sale products |
| getUpcomingSales | GET /upcoming | Fetch scheduled sales |
| getSeasonalSales | GET /seasonal/:season | Fetch seasonal sales |

### Request Parameters

| Method | Parameters | Description |
|--------|------------|-------------|
| getActiveFlashSales | featured?: boolean | Filter featured sales |
| getFlashSaleProducts | page?: number, limit?: number | Pagination |
| getSeasonalSales | season: string | Season identifier |

### Response Transformation

```
API Response          Transform           Client Data
─────────────────────────────────────────────────────
{                     ────────►           {
  startTime: string                        startTime: Date
  endTime: string                          endTime: Date
  originalPrice: 2500                      formattedPrice: "₨2,500"
}                                          discountPercentage: 20
                                           savings: "₨500"
                                         }
```

### Error Handling Strategy

| Error Type | HTTP Code | Action |
|------------|-----------|--------|
| Network Error | - | Show retry option |
| Not Found | 404 | Redirect or show message |
| Unauthorized | 401 | Redirect to login |
| Server Error | 500 | Show error message |

### Caching Strategy

| Data Type | Cache Duration | Invalidation |
|-----------|----------------|--------------|
| Active Sales | 60 seconds | On timer expiry |
| Sale Details | 120 seconds | Manual refresh |
| Products | 180 seconds | Stock change |

### Expected Outcome
- Functional API client for flash sales
- Type-safe method signatures
- Proper error handling and recovery
- Response caching for performance
- Sri Lanka localization support

### Verification Checklist
- [ ] `frontend/lib/marketing/flash-sale-api.ts` file created
- [ ] getActiveFlashSales method implemented
- [ ] getFlashSaleById method implemented
- [ ] getFlashSaleProducts method implemented
- [ ] Error handling implemented
- [ ] Response transformation implemented
- [ ] Date strings converted to Date objects
- [ ] LKR currency formatting supported
- [ ] Caching strategy implemented
- [ ] All methods properly exported

---

## Task 37: Create Active Sales Query

### Overview
Create a React Query hook (useActiveFlashSales) that fetches and manages active flash sales data. This hook provides automatic refetching, caching, and state management for active sales, with support for real-time updates when sales expire.

### Dependencies
- Task 36: Create Flash Sale API

### Instructions

1. **Create flash sale hooks directory**
   - Navigate to `frontend/hooks/marketing/` directory
   - Create directory if it doesn't exist
   - This will house marketing-related custom hooks

2. **Create useFlashSale hooks file**
   - Create `useFlashSale.ts` in `hooks/marketing/` directory
   - Set up React Query imports

3. **Import required dependencies**
   - Import useQuery from @tanstack/react-query
   - Import flash sale API methods
   - Import flash sale types

4. **Define useActiveFlashSales hook**
   - Create custom hook with React Query
   - Use unique query key: ['flash-sales', 'active']
   - Call getActiveFlashSales from API client
   - Return query result with data, loading, error states

5. **Configure refetch strategy**
   - Set refetchInterval to 60000 (1 minute)
   - Enable refetchOnWindowFocus
   - Enable refetchOnReconnect
   - Disable refetch when no active sales

6. **Add filter parameters**
   - Accept featured filter (featured?: boolean)
   - Accept category filter (category?: string)
   - Include filters in query key for proper caching
   - Pass filters to API method

7. **Implement automatic refetch on timer expiry**
   - Calculate time until next sale expiry
   - Set dynamic refetch interval
   - Trigger refetch when sale ends
   - Update query cache accordingly

8. **Add error handling**
   - Handle network errors gracefully
   - Provide retry mechanism (retry: 3)
   - Return fallback empty array on error
   - Show error state to user

9. **Add derived data calculation**
   - Calculate time remaining for each sale
   - Determine sale status (active, ending soon)
   - Sort sales by priority (ending soon first)
   - Filter expired sales automatically

10. **Optimize performance**
    - Enable cacheTime (5 minutes)
    - Enable staleTime (1 minute)
    - Implement query key factory
    - Add select option to transform data

11. **Add related hooks**
    - useFlashSaleById(id: string)
    - useUpcomingSales()
    - useSeasonalSales(season: string)

### Hook Structure

| Hook | Purpose | Query Key |
|------|---------|-----------|
| useActiveFlashSales | Fetch active sales | ['flash-sales', 'active'] |
| useFlashSaleById | Fetch sale details | ['flash-sales', id] |
| useUpcomingSales | Fetch upcoming sales | ['flash-sales', 'upcoming'] |
| useSeasonalSales | Fetch seasonal sales | ['flash-sales', 'seasonal', season] |

### React Query Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| refetchInterval | 60000 | Auto-refresh every minute |
| refetchOnWindowFocus | true | Refresh on tab focus |
| staleTime | 60000 | Data fresh for 1 minute |
| cacheTime | 300000 | Cache for 5 minutes |
| retry | 3 | Retry failed requests 3 times |

### Query Key Strategy

```
['flash-sales', 'active'] ─────────► All active sales
['flash-sales', 'active', { featured: true }] ──► Featured sales only
['flash-sales', 'sale123'] ────────► Specific sale details
['flash-sales', 'upcoming'] ───────► Upcoming sales
['flash-sales', 'seasonal', 'avurudu'] ──► Seasonal sales
```

### Refetch Timing Logic

```
Current Time: 10:00 AM
Sale End Time: 10:05 AM
Time Remaining: 5 minutes

Refetch Strategy:
├── If remaining > 60 min: Refetch every 60 seconds
├── If remaining > 10 min: Refetch every 30 seconds
├── If remaining > 1 min: Refetch every 10 seconds
└── If remaining < 1 min: Refetch every 1 second
```

### Hook Return Value

| Property | Type | Description |
|----------|------|-------------|
| data | FlashSale[] | Array of active sales |
| isLoading | boolean | Initial loading state |
| isError | boolean | Error state |
| error | Error | null | Error object |
| refetch | () => void | Manual refetch function |
| isFetching | boolean | Background fetching state |

### Expected Outcome
- Functional React Query hook for active sales
- Automatic refetching and caching
- Dynamic refetch based on sale timing
- Type-safe hook return values
- Optimized performance

### Verification Checklist
- [ ] `frontend/hooks/marketing/useFlashSale.ts` file created
- [ ] useActiveFlashSales hook implemented
- [ ] React Query configured with proper options
- [ ] Refetch interval set appropriately
- [ ] Query key strategy implemented
- [ ] Error handling implemented
- [ ] Filter parameters supported
- [ ] Automatic refetch on sale expiry
- [ ] Hook properly typed
- [ ] Hook exports correctly

---

## Task 38: Create Flash Sale Store

### Overview
Implement a Zustand store for managing flash sale state across the application. This store provides centralized state management for active sales, selected sale, countdown timers, and user interactions with flash sales.

### Dependencies
- Task 35: Create Flash Sale Types

### Instructions

1. **Create flash sale store file**
   - Navigate to `frontend/store/` directory
   - Create `flash-sale-store.ts` file
   - Set up Zustand imports and configuration

2. **Import required dependencies**
   - Import create from zustand
   - Import persist middleware for persistence
   - Import flash sale types from Task 35

3. **Define store state interface**
   - activeSales: Array of active flash sales
   - currentSale: Currently selected/viewed sale
   - timeRemaining: Map of sale ID to remaining time
   - isTimerActive: Boolean for timer state
   - lastRefresh: Timestamp of last data refresh

4. **Define store actions**
   - setActiveSales: Update active sales list
   - setCurrentSale: Set currently viewed sale
   - updateTimeRemaining: Update countdown for sale
   - clearCurrentSale: Reset current sale selection
   - refreshSales: Trigger data refresh

5. **Implement timer management**
   - Store timer references for each active sale
   - Update countdown every second
   - Trigger notifications at milestones
   - Stop timers when sales expire

6. **Add user interaction tracking**
   - viewedSales: Array of sale IDs user has viewed
   - clickedProducts: Map of product interactions
   - notificationPreferences: User preferences for alerts

7. **Implement sale selection logic**
   - Method to select featured sale
   - Method to select next ending sale
   - Method to filter by category
   - Priority sorting (ending soon first)

8. **Add persistence configuration**
   - Persist activeSales to localStorage
   - Persist viewed sales history
   - Persist notification preferences
   - Set storage key: 'flash-sale-store'

9. **Implement derived state selectors**
   - getActiveSalesCount: Count of active sales
   - getEndingSoonSales: Sales ending within 1 hour
   - getFeaturedSale: Primary featured sale
   - getSalesByCategory: Group sales by category

10. **Add state update optimization**
    - Use immer for immutable updates
    - Batch updates when possible
    - Prevent unnecessary re-renders
    - Implement shallow comparison

11. **Add development tools integration**
    - Enable Redux DevTools integration
    - Add state logging in development
    - Implement state reset for testing

### Store State Structure

| State | Type | Purpose |
|-------|------|---------|
| activeSales | FlashSale[] | All active sales |
| currentSale | FlashSale or null | Selected sale |
| timeRemaining | Map<string, number> | Sale ID to milliseconds |
| isTimerActive | boolean | Global timer state |
| viewedSales | string[] | User view history |

### Store Actions

| Action | Parameters | Description |
|--------|------------|-------------|
| setActiveSales | sales: FlashSale[] | Update active sales |
| setCurrentSale | sale: FlashSale or null | Select sale |
| updateTimeRemaining | saleId, ms | Update countdown |
| refreshSales | - | Trigger refresh |
| clearStore | - | Reset all state |

### Timer Management Flow

```
Store Initialization
        │
        ▼
Start Timers for Active Sales
        │
        ├──► Update timeRemaining every second
        │
        ├──► Check if sale expired
        │    └──► Remove from activeSales
        │
        └──► Trigger notifications at:
             ├─ 1 hour remaining
             ├─ 10 minutes remaining
             └─ Sale ended
```

### Persistence Strategy

| Data | Persist | Duration | Key |
|------|---------|----------|-----|
| activeSales | Yes | Session | flash-sale-store.activeSales |
| viewedSales | Yes | 7 days | flash-sale-store.viewedSales |
| currentSale | No | - | Not persisted |
| timeRemaining | No | - | Calculated on load |

### Selector Functions

| Selector | Return Type | Description |
|----------|-------------|-------------|
| getActiveSalesCount | number | Count of active sales |
| getEndingSoonSales | FlashSale[] | Sales ending < 1 hour |
| getFeaturedSale | FlashSale or null | Primary featured sale |
| getSalesByCategory | Map<string, FlashSale[]> | Grouped by category |

### Store Usage Pattern

```
Component Level          Zustand Store          Backend API
───────────────────────────────────────────────────────────
useFlashSaleStore()  ──►  activeSales      ◄──  API Fetch
        │                 currentSale
        │                 timeRemaining
        ▼
Update UI with
countdown and
sale information
```

### Expected Outcome
- Centralized flash sale state management
- Real-time countdown tracking
- Persistent user preferences
- Optimized performance with selectors
- Easy integration with components

### Verification Checklist
- [ ] `frontend/store/flash-sale-store.ts` file created
- [ ] Store state interface defined
- [ ] Store actions implemented
- [ ] Timer management logic implemented
- [ ] Persistence middleware configured
- [ ] Selector functions created
- [ ] State update optimization implemented
- [ ] DevTools integration enabled
- [ ] Store properly typed
- [ ] Store exports correctly

---

## Task 39: Create Countdown Timer Hook

### Overview
Implement a high-precision useCountdown hook that calculates and updates time remaining for flash sales. This hook uses requestAnimationFrame for smooth updates and provides days, hours, minutes, and seconds. Critical for accurate countdown display across the application.

### Dependencies
- Task 35: Create Flash Sale Types

### Instructions

1. **Create countdown hook file**
   - Navigate to `frontend/hooks/marketing/` directory
   - Create `useCountdown.ts` file
   - Set up React imports (useState, useEffect, useRef)

2. **Define hook parameters**
   - endTime: Date | string | number (sale end time)
   - onExpire?: () => void (callback when timer reaches zero)
   - autoStart?: boolean (start immediately, default true)
   - precision?: 'second' | 'millisecond' (update frequency)

3. **Define hook return value**
   - days: number (full days remaining)
   - hours: number (0-23 hours remaining)
   - minutes: number (0-59 minutes remaining)
   - seconds: number (0-59 seconds remaining)
   - milliseconds: number (0-999 milliseconds remaining)
   - totalMilliseconds: number (total time remaining)
   - isExpired: boolean (timer has reached zero)
   - isRunning: boolean (timer is actively counting)
   - start: () => void (start timer manually)
   - stop: () => void (stop timer manually)
   - reset: () => void (reset timer to original time)

4. **Implement time calculation logic**
   - Calculate total milliseconds remaining
   - Convert to days, hours, minutes, seconds
   - Handle negative values (expired state)
   - Ensure accurate calculations across time zones

5. **Implement timer with requestAnimationFrame**
   - Use requestAnimationFrame for smooth updates
   - Calculate time remaining on each frame
   - Update state only when values change
   - Cancel animation frame on unmount

6. **Add fallback to setInterval**
   - Use setInterval if requestAnimationFrame unavailable
   - Set interval to 1000ms for second precision
   - Set interval to 100ms for higher precision
   - Clear interval on unmount

7. **Implement expiration handling**
   - Detect when timer reaches zero
   - Call onExpire callback if provided
   - Set isExpired flag to true
   - Stop timer automatically

8. **Add pause and resume functionality**
   - Implement stop method to pause timer
   - Implement start method to resume timer
   - Track remaining time when paused
   - Maintain accuracy after resume

9. **Implement reset functionality**
   - Reset to original endTime
   - Clear isExpired flag
   - Restart timer if was running
   - Recalculate all values

10. **Add performance optimizations**
    - Memoize calculations when possible
    - Update state in batches
    - Avoid unnecessary re-renders
    - Clean up resources properly

11. **Handle edge cases**
    - Past end time (already expired)
    - Invalid dates or null values
    - Negative time values
    - Very large time values (years)

### Hook Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| endTime | Date or string or number | Yes | - | Timer end time |
| onExpire | () => void | No | undefined | Expiration callback |
| autoStart | boolean | No | true | Start immediately |
| precision | 'second' or 'millisecond' | No | 'second' | Update frequency |

### Hook Return Value

| Property | Type | Description |
|----------|------|-------------|
| days | number | Full days remaining |
| hours | number | Hours (0-23) |
| minutes | number | Minutes (0-59) |
| seconds | number | Seconds (0-59) |
| milliseconds | number | Milliseconds (0-999) |
| totalMilliseconds | number | Total time in ms |
| isExpired | boolean | Timer expired |
| isRunning | boolean | Timer active |
| start | () => void | Start timer |
| stop | () => void | Stop timer |
| reset | () => void | Reset timer |

### Time Calculation Logic

```
End Time: 2026-02-01 18:00:00
Current Time: 2026-02-01 14:30:45

Total MS: 12,555,000 milliseconds

Calculation:
├── Days: Math.floor(ms / (1000 * 60 * 60 * 24)) = 0
├── Hours: Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) = 3
├── Minutes: Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)) = 29
└── Seconds: Math.floor((ms % (1000 * 60)) / 1000) = 15

Result: 0d 3h 29m 15s
```

### Timer Update Strategy

| Precision | Update Method | Frequency | Use Case |
|-----------|---------------|-----------|----------|
| Second | requestAnimationFrame | ~16ms (checks) | Standard countdown |
| Millisecond | requestAnimationFrame | ~16ms (displays) | High-precision display |
| Fallback | setInterval | 1000ms | Browser compatibility |

### Animation Frame Logic

```
requestAnimationFrame Loop
        │
        ▼
Calculate Current Time
        │
        ▼
Calculate Time Remaining
        │
        ▼
Check if Values Changed
        │
    ┌───┴───┐
    │       │
   Yes      No
    │       │
    ▼       │
Update State │
    │       │
    └───┬───┘
        ▼
Check if Expired
        │
    ┌───┴───┐
    │       │
   Yes      No
    │       │
    ▼       ▼
Stop Timer  Continue Loop
Call onExpire
```

### Expiration Callback Use Cases

| Scenario | Callback Action |
|----------|-----------------|
| Flash Sale End | Refetch active sales |
| Limited Offer | Show "Expired" message |
| Countdown Banner | Remove banner |
| Notification | Trigger alert/toast |

### Performance Considerations

| Aspect | Implementation |
|--------|----------------|
| State Updates | Batch updates, update only when changed |
| Memory | Clean up timers on unmount |
| Accuracy | Use Date.now() for precision |
| Re-renders | Memoize return object |

### Expected Outcome
- High-precision countdown hook with accurate timing
- Smooth updates without performance issues
- Support for pause, resume, reset functionality
- Proper cleanup and resource management
- Flexible callback system

### Verification Checklist
- [ ] `frontend/hooks/marketing/useCountdown.ts` file created
- [ ] Hook parameters properly typed
- [ ] Time calculation logic implemented
- [ ] requestAnimationFrame loop implemented
- [ ] setInterval fallback implemented
- [ ] Expiration detection implemented
- [ ] onExpire callback integration
- [ ] Pause and resume functionality
- [ ] Reset functionality
- [ ] Proper cleanup on unmount
- [ ] Edge cases handled
- [ ] Hook exports correctly

---

## Task 40: Create CountdownTimer Component

### Overview
Create the CountdownTimer component that displays the countdown timer with visual styling. This component consumes the useCountdown hook and renders days, hours, minutes, and seconds in an attractive, easy-to-read format with proper spacing and styling.

### Dependencies
- Task 39: Create Countdown Timer Hook

### Instructions

1. **Create countdown timer component file**
   - Navigate to `frontend/components/marketing/flash-sales/` directory
   - Create `CountdownTimer.tsx` file
   - Set up React functional component structure

2. **Import required dependencies**
   - Import useCountdown hook from Task 39
   - Import React types
   - Import styling utilities (clsx or cn)

3. **Define component props interface**
   - endTime: Date | string | number (required)
   - onExpire?: () => void (optional callback)
   - size?: 'sm' | 'md' | 'lg' (timer size variant)
   - className?: string (additional styling)
   - showLabels?: boolean (show time unit labels)
   - showDays?: boolean (include days in display)
   - variant?: 'default' | 'compact' | 'card' (display style)

4. **Implement component structure**
   - Use useCountdown hook with endTime prop
   - Create container div with flex layout
   - Render time units (days, hours, minutes, seconds)
   - Apply styling based on size and variant props

5. **Create time unit display segments**
   - Create reusable TimeSegment sub-component
   - Display value (2-digit formatted)
   - Display label (Days, Hours, Mins, Secs)
   - Apply proper spacing and alignment

6. **Implement size variants**
   - Small (sm): Compact display, smaller text
   - Medium (md): Default size for cards
   - Large (lg): Hero sections, prominent display

7. **Implement style variants**
   - Default: Basic timer with separators
   - Compact: Inline format (03:25:15)
   - Card: Individual cards for each unit

8. **Add separators between units**
   - Use colon (:) for compact variant
   - Use spacing for card variant
   - Animate pulse effect on separators

9. **Apply responsive styling**
   - Adjust font sizes for different screens
   - Stack vertically on very small screens
   - Maintain readability across devices

10. **Handle expired state**
    - Call onExpire callback when timer ends
    - Component should defer to parent for display
    - Task 42 will add expired state handling

11. **Add accessibility features**
    - Add ARIA labels for screen readers
    - Announce time remaining periodically
    - Ensure proper focus management

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| endTime | Date or string or number | Yes | - | Timer end time |
| onExpire | () => void | No | undefined | Expiration callback |
| size | 'sm' or 'md' or 'lg' | No | 'md' | Display size |
| className | string | No | '' | Additional classes |
| showLabels | boolean | No | true | Show unit labels |
| showDays | boolean | No | true | Include days |
| variant | 'default' or 'compact' or 'card' | No | 'default' | Style variant |

### Size Variants

| Size | Font Size | Padding | Use Case |
|------|-----------|---------|----------|
| sm | text-sm / text-base | p-1 | Product cards, compact areas |
| md | text-lg / text-xl | p-2 | Standard sections, banners |
| lg | text-2xl / text-4xl | p-3 | Hero sections, featured sales |

### Display Variants

**Default Variant:**
```
┌─────┬─────┬─────┬─────┐
│ 02  │ 15  │ 30  │ 45  │
│Days │Hours│Mins │Secs │
└─────┴─────┴─────┴─────┘
```

**Compact Variant:**
```
02:15:30:45
```

**Card Variant:**
```
┌───┐  ┌───┐  ┌───┐  ┌───┐
│02 │  │15 │  │30 │  │45 │
│ D │  │ H │  │ M │  │ S │
└───┘  └───┘  └───┘  └───┘
```

### Styling Structure

| Element | Purpose | Tailwind Classes |
|---------|---------|------------------|
| Container | Overall wrapper | `flex items-center gap-2 justify-center` |
| TimeSegment | Individual unit | `flex flex-col items-center` |
| Value | Number display | `font-bold tabular-nums` |
| Label | Unit label | `text-xs uppercase tracking-wide` |
| Separator | Colon between units | `font-bold opacity-50` |

### Responsive Breakpoints

| Screen Size | Layout | Font Scale |
|-------------|--------|------------|
| < 640px | Stack if too wide | 0.875x |
| 640px - 1024px | Horizontal | 1x |
| > 1024px | Horizontal | 1.125x |

### Time Unit Formatting

| Unit | Format | Example |
|------|--------|---------|
| Days | 1-2 digits | 0, 5, 12 |
| Hours | 2 digits | 00, 08, 23 |
| Minutes | 2 digits | 00, 05, 59 |
| Seconds | 2 digits | 00, 09, 59 |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA Label | "Flash sale countdown timer" |
| Live Region | aria-live="polite" for updates |
| Time Format | Announce "2 hours 30 minutes remaining" |
| Focus | Keyboard accessible if interactive |

### Expected Outcome
- Reusable countdown timer component
- Multiple size and style variants
- Clear, readable time display
- Responsive across devices
- Accessible to all users

### Verification Checklist
- [ ] `frontend/components/marketing/flash-sales/CountdownTimer.tsx` created
- [ ] Component accepts all required props
- [ ] useCountdown hook integrated
- [ ] Time units displayed correctly
- [ ] Size variants implemented
- [ ] Style variants implemented
- [ ] Responsive styling applied
- [ ] Accessibility features added
- [ ] Component properly typed
- [ ] Component exports correctly

---

## Task 41: Create CountdownTimer Digits

### Overview
Enhance the CountdownTimer component with animated digits that flip or slide when values change. This creates an engaging visual effect that draws attention and provides smooth transitions between numbers, improving the user experience.

### Dependencies
- Task 40: Create CountdownTimer Component

### Instructions

1. **Create digit animation component**
   - Create `CountdownDigit.tsx` sub-component
   - This component handles single digit display and animation
   - Will be used by CountdownTimer for each digit

2. **Define animation types**
   - Flip: 3D card flip animation (like airport displays)
   - Slide: Vertical slide up/down
   - Fade: Simple cross-fade between values
   - None: No animation (accessibility)

3. **Implement flip animation**
   - Create two-sided card (front and back)
   - Apply 3D transform on value change
   - Use CSS rotateX for flip effect
   - Set transition duration (300-500ms)

4. **Implement slide animation**
   - Create sliding container with overflow hidden
   - Position old and new values vertically
   - Slide from bottom to top on increment
   - Slide from top to bottom on decrement

5. **Implement fade animation**
   - Simple opacity transition
   - Cross-fade between old and new value
   - Fastest animation option
   - Best for accessibility

6. **Add animation trigger logic**
   - Detect when digit value changes
   - Trigger appropriate animation
   - Queue animations if rapid changes
   - Handle skip if user prefers reduced motion

7. **Create split digit display**
   - Separate tens and ones place (e.g., 45 → 4, 5)
   - Animate each digit independently
   - Align digits properly
   - Add separator between tens and ones if needed

8. **Apply 3D perspective styling**
   - Set perspective on container (1000px)
   - Apply transform-style: preserve-3d
   - Add backface-visibility: hidden
   - Create depth effect for flip

9. **Implement smooth transitions**
   - Use CSS transitions for performance
   - Set easing function (ease-in-out)
   - Coordinate timing across digits
   - Prevent layout shift during animation

10. **Add animation preferences**
    - Respect prefers-reduced-motion media query
    - Provide animation toggle prop
    - Fallback to no animation if needed
    - Ensure accessibility compliance

11. **Optimize animation performance**
    - Use transform instead of position
    - Use opacity instead of visibility
    - Enable hardware acceleration (translateZ(0))
    - Avoid animating layout properties

### Animation Types

| Type | Complexity | Performance | Visual Impact |
|------|------------|-------------|---------------|
| Flip | High | Good | Very engaging |
| Slide | Medium | Excellent | Smooth, modern |
| Fade | Low | Excellent | Subtle, accessible |
| None | None | Perfect | Accessibility fallback |

### Flip Animation Structure

```
Before Change (9)          During Flip          After Change (0)
─────────────────────────────────────────────────────────────────
┌─────┐                    ┌─────┐              ┌─────┐
│  9  │                    │  /  │              │  0  │
│     │  ──────────►      │ /   │  ──────────► │     │
└─────┘                    │/____│              └─────┘
  Front                    Rotating              Front
                           (shows back)
```

### Slide Animation Flow

```
Container (overflow: hidden)
┌─────────┐
│    9    │  ← Old value (moving up and out)
├─────────┤
│    0    │  ← New value (sliding in from bottom)
└─────────┘
```

### CSS Transform Strategy

| Animation | Transform | Duration | Easing |
|-----------|-----------|----------|--------|
| Flip | rotateX(180deg) | 400ms | ease-in-out |
| Slide | translateY(-100%) | 300ms | cubic-bezier |
| Fade | opacity: 0 → 1 | 200ms | linear |

### Digit Component Props

| Prop | Type | Description |
|------|------|-------------|
| value | number | Current digit value (0-9) |
| animation | 'flip' or 'slide' or 'fade' or 'none' | Animation type |
| size | 'sm' or 'md' or 'lg' | Display size |
| className | string | Additional styling |

### Split Digit Display

| Value | Tens | Ones | Display |
|-------|------|------|---------|
| 45 | 4 | 5 | ┌─┐ ┌─┐ <br> │4│ │5│ <br> └─┘ └─┘ |
| 09 | 0 | 9 | ┌─┐ ┌─┐ <br> │0│ │9│ <br> └─┘ └─┘ |
| 5 | 0 | 5 | ┌─┐ ┌─┐ <br> │0│ │5│ <br> └─┘ └─┘ |

### Performance Optimizations

| Technique | Implementation | Benefit |
|-----------|----------------|---------|
| Hardware Acceleration | transform: translateZ(0) | GPU rendering |
| Will-change | will-change: transform | Browser optimization |
| Transform Only | Avoid width/height | No reflow |
| RAF | requestAnimationFrame | Smooth animations |

### Accessibility Considerations

| Aspect | Implementation |
|--------|----------------|
| Reduced Motion | Check prefers-reduced-motion |
| Screen Readers | Announce value changes |
| Focus | Maintain focus during animation |
| Performance | Disable on low-end devices |

### Animation Timing Coordination

```
Seconds Change (45 → 46)
        │
        ├── Ones digit: 5 → 6 (animate)
        └── Tens digit: 4 → 4 (no animation)

Seconds Change (59 → 00)
        │
        ├── Ones digit: 9 → 0 (animate)
        ├── Tens digit: 5 → 0 (animate)
        └── Minutes increase (cascade)
```

### Expected Outcome
- Animated digit transitions for countdown
- Multiple animation style options
- Smooth, performant animations
- Accessibility compliant
- Engaging visual experience

### Verification Checklist
- [ ] CountdownDigit sub-component created
- [ ] Flip animation implemented
- [ ] Slide animation implemented
- [ ] Fade animation implemented
- [ ] Animation triggers on value change
- [ ] Split digit display working
- [ ] 3D perspective styling applied
- [ ] Performance optimizations implemented
- [ ] Reduced motion support added
- [ ] Animations smooth and coordinated
- [ ] No layout shift during animation

---

## Task 42: Create CountdownTimer Expired

### Overview
Add expired state handling to the CountdownTimer component. When the timer reaches zero, display an appropriate message or state, trigger callbacks, and optionally hide or transform the component. This ensures users always see relevant information.

### Dependencies
- Task 40: Create CountdownTimer Component

### Instructions

1. **Update CountdownTimer component**
   - Open existing CountdownTimer.tsx file
   - Prepare to add expired state handling

2. **Add expired state props**
   - expiredMessage?: string (custom message)
   - expiredComponent?: ReactNode (custom component)
   - hideWhenExpired?: boolean (remove from DOM)
   - onExpired?: () => void (callback on expiration)
   - autoRefresh?: boolean (refetch sales on expiry)

3. **Implement expiration detection**
   - Check isExpired from useCountdown hook
   - Detect transition from active to expired
   - Trigger onExpired callback once
   - Prevent multiple callback invocations

4. **Create default expired message**
   - Display "Sale Ended" or "Expired"
   - Use same styling structure as timer
   - Apply distinct color (red or gray)
   - Center text in component area

5. **Implement custom message display**
   - If expiredMessage prop provided, display it
   - Allow HTML/React elements in message
   - Apply appropriate styling
   - Maintain component dimensions

6. **Implement custom component display**
   - If expiredComponent prop provided, render it
   - Replace entire timer with custom component
   - Useful for call-to-action or redirect
   - Examples: "View other sales", "Sign up for alerts"

7. **Implement hide behavior**
   - If hideWhenExpired is true, return null
   - Unmount component completely
   - Parent component handles layout adjustment
   - Clean up timers and listeners

8. **Add transition animation**
   - Fade out active timer
   - Fade in expired message
   - Smooth transition (200-300ms)
   - Prevent jarring changes

9. **Implement auto-refresh logic**
   - If autoRefresh is true, trigger data refetch
   - Remove expired sale from active list
   - Update UI automatically
   - Coordinate with React Query

10. **Add visual styling for expired state**
    - Gray out or red tint
    - Strike-through timer (optional)
    - Add "Ended" badge
    - Reduce opacity

11. **Handle notification integration**
    - Trigger toast/notification on expiry
    - Coordinate with notification system
    - Show "Sale has ended" message
    - Allow user to dismiss

### Expired State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| expiredMessage | string | "Sale Ended" | Custom message |
| expiredComponent | ReactNode | null | Custom component |
| hideWhenExpired | boolean | false | Hide component |
| onExpired | () => void | undefined | Expiration callback |
| autoRefresh | boolean | false | Refetch on expiry |

### Expiration Behavior Options

| Behavior | When to Use |
|----------|-------------|
| Show Message | Inform user sale has ended |
| Hide Component | Remove from product cards |
| Show Alternative | Display "View other sales" CTA |
| Trigger Refresh | Update active sales list |

### State Transition Flow

```
Timer Running              Timer Reaches Zero         Expired State
──────────────────────────────────────────────────────────────────
┌─────────────┐                                    ┌─────────────┐
│  02:15:30   │  ───── isExpired: true ──────►    │ Sale Ended  │
│             │                                    │             │
└─────────────┘         Call onExpired()          └─────────────┘
     Active                                          Expired
                     Optional: Hide or Transform
```

### Visual Styling Changes

| State | Opacity | Color | Additional |
|-------|---------|-------|------------|
| Active | 100% | Brand color | Normal |
| Ending Soon | 100% | Warning (orange) | Pulse animation |
| Expired | 60% | Gray or Red | Strike-through |

### Expired Message Examples

| Message | Use Case |
|---------|----------|
| "Sale Ended" | Default message |
| "This sale has expired" | Detailed message |
| "Check out our other sales!" | Call to action |
| "" (empty) | No message, hide component |

### Custom Component Example Usage

```
expiredComponent={
  <div className="text-center">
    <p>Sale Ended</p>
    <Button>View Other Sales</Button>
  </div>
}
```

### Transition Animation

| Phase | Duration | Effect |
|-------|----------|--------|
| Fade Out Timer | 200ms | opacity: 1 → 0 |
| Swap Content | Instant | Replace DOM |
| Fade In Message | 200ms | opacity: 0 → 1 |

### Callback Coordination

| Event | Callback | Action |
|-------|----------|--------|
| Timer Expiry | onExpired | Trigger user-defined logic |
| Auto Refresh | refetch | Update sales list |
| Notification | showToast | Display notification |

### Expected Outcome
- Graceful handling of expired timers
- Customizable expired state display
- Smooth transitions and animations
- Integration with refresh logic
- Clear user communication

### Verification Checklist
- [ ] Expired state props added to CountdownTimer
- [ ] Expiration detection working
- [ ] Default expired message displays
- [ ] Custom message support implemented
- [ ] Custom component support implemented
- [ ] Hide behavior implemented
- [ ] Transition animation applied
- [ ] onExpired callback triggers correctly
- [ ] Auto-refresh logic integrated
- [ ] Visual styling for expired state
- [ ] No duplicate callback invocations

---

## Task 43: Create Flash Sale Banner

### Overview
Create the FlashSaleBanner component for prominent display of featured flash sales. This banner appears at the top of pages or sections, showcasing the most important active sale with countdown timer, attractive imagery, and call-to-action button.

### Dependencies
- Task 40: Create CountdownTimer Component

### Instructions

1. **Create flash sale banner component file**
   - Navigate to `frontend/components/marketing/flash-sales/` directory
   - Create `FlashSaleBanner.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - sale: FlashSale (required, sale data)
   - priority?: 'high' | 'normal' (banner prominence)
   - showImage?: boolean (display banner image)
   - ctaText?: string (call-to-action text)
   - onCtaClick?: () => void (CTA click handler)
   - className?: string (additional styling)

3. **Implement banner structure**
   - Create full-width container with padding
   - Apply background color or gradient
   - Add border and shadow for elevation
   - Ensure responsive layout

4. **Add banner background image**
   - Support optional background image from sale data
   - Apply image with overlay for text readability
   - Use Next.js Image for optimization
   - Fallback to gradient if no image

5. **Implement content layout**
   - Left section: Sale title and description
   - Center section: CountdownTimer component
   - Right section: Call-to-action button
   - Stack vertically on mobile

6. **Add sale title and description**
   - Display sale name prominently (large font)
   - Show brief description or tagline
   - Apply brand colors and styling
   - Ensure high contrast for readability

7. **Integrate countdown timer**
   - Use CountdownTimer component from Task 40
   - Set size to 'lg' for banner
   - Position centrally or right-aligned
   - Show days, hours, minutes, seconds

8. **Add call-to-action button**
   - "Shop Now" or custom text
   - Link to flash sale page or product grid
   - Apply prominent button styling
   - Add hover and focus states

9. **Implement responsive design**
   - Desktop: Horizontal layout (title | timer | CTA)
   - Tablet: Two rows (title + timer | CTA below)
   - Mobile: Stack vertically
   - Adjust font sizes appropriately

10. **Add urgency indicators**
    - "Limited Time" badge
    - "Ends Soon" text if < 1 hour remaining
    - Pulsing animation for urgency
    - Color coding (red for urgent)

11. **Implement accessibility**
    - Proper heading hierarchy
    - ARIA labels for screen readers
    - Keyboard navigation support
    - Focus indicators on CTA

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| sale | FlashSale | Yes | - | Sale data object |
| priority | 'high' or 'normal' | No | 'normal' | Banner prominence |
| showImage | boolean | No | true | Display background image |
| ctaText | string | No | "Shop Now" | CTA button text |
| onCtaClick | () => void | No | Navigate to sale | Click handler |
| className | string | No | '' | Additional classes |

### Banner Layout Structure

**Desktop Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════════╗   │
│  ║  [Background Image/Gradient]                         ║   │
│  ║                                                       ║   │
│  ║  Avurudu Flash Sale!          ┌────────────────┐    ║   │
│  ║  Up to 50% off on             │  02:15:30:45   │    ║   │
│  ║  selected items               │   DAYS HRS MIN │    ║   │
│  ║                               └────────────────┘    ║   │
│  ║                                                       ║   │
│  ║  [Shop Now Button] ──────────────────────────────►  ║   │
│  ║                                                       ║   │
│  ╚══════════════════════════════════════════════════════╝   │
└──────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌─────────────────────────┐
│  Avurudu Flash Sale!    │
│  Up to 50% off          │
│                         │
│  ┌─────────────────┐   │
│  │   02:15:30:45   │   │
│  │  DAYS HRS MIN   │   │
│  └─────────────────┘   │
│                         │
│  [ Shop Now Button ]    │
└─────────────────────────┘
```

### Priority Variants

| Priority | Height | Font Size | Animation | Use Case |
|----------|--------|-----------|-----------|----------|
| High | 200-250px | XL/2XL | Pulse | Main featured sale |
| Normal | 120-150px | LG/XL | None | Secondary sale |

### Background Image Overlay

| Layer | Purpose | Opacity |
|-------|---------|---------|
| Image | Visual appeal | 100% |
| Dark Overlay | Text contrast | 40-60% |
| Gradient | Enhance readability | Varies |

### Urgency States

| Time Remaining | Badge | Color | Animation |
|----------------|-------|-------|-----------|
| > 24 hours | "Limited Time" | Blue | None |
| 1-24 hours | "Ends Today" | Orange | Subtle pulse |
| < 1 hour | "Ends Soon" | Red | Strong pulse |
| Expired | "Ended" | Gray | None |

### Call-to-Action Button

| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | Primary blue | None | White |
| Hover | Darker blue | None | White |
| Focus | Primary blue | Focus ring | White |
| Active | Darkest blue | None | White |

### Responsive Breakpoints

| Breakpoint | Layout | Timer Size | CTA Position |
|------------|--------|------------|--------------|
| < 640px | Vertical stack | Medium | Below timer |
| 640px - 1024px | Hybrid | Large | Right side |
| > 1024px | Horizontal | Large | Far right |

### Sri Lanka Cultural Examples

| Festival | Sale Name | Typical Products |
|----------|-----------|------------------|
| Avurudu | "Avurudu Mega Sale" | Traditional sweets, clothes |
| Vesak | "Vesak Blessing Sale" | Lanterns, decorations |
| Christmas | "Christmas Bonanza" | Gifts, decorations |

### Expected Outcome
- Eye-catching banner for featured flash sales
- Integrated countdown timer
- Clear call-to-action
- Responsive across all devices
- Cultural relevance for Sri Lanka

### Verification Checklist
- [ ] `frontend/components/marketing/flash-sales/FlashSaleBanner.tsx` created
- [ ] Component accepts all required props
- [ ] Banner layout structure implemented
- [ ] Background image support added
- [ ] Sale title and description display
- [ ] CountdownTimer integrated
- [ ] Call-to-action button implemented
- [ ] Responsive design applied
- [ ] Urgency indicators added
- [ ] Accessibility features included
- [ ] Component properly typed
- [ ] Component exports correctly

---

## Task 44: Create Flash Sale Section

### Overview
Create the FlashSaleSection component for displaying a collection of flash sale products on the homepage or category pages. This section includes a header with title and countdown timer, a grid of product cards, and a "View All" link to the dedicated flash sale page.

### Dependencies
- Task 43: Create Flash Sale Banner

### Instructions

1. **Create flash sale section component file**
   - Navigate to `frontend/components/marketing/flash-sales/` directory
   - Create `FlashSaleSection.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - sale: FlashSale (required, sale data)
   - products: Product[] (product list, limit to 8-12 for homepage)
   - maxProducts?: number (max products to display)
   - showHeader?: boolean (display section header)
   - showTimer?: boolean (display countdown)
   - columns?: number (grid column count)
   - viewAllUrl?: string (link to full sale page)
   - className?: string (additional styling)

3. **Implement section structure**
   - Create section container with padding
   - Add section header with title and timer
   - Create product grid layout
   - Add "View All" footer link

4. **Create section header**
   - Display sale name as heading
   - Show CountdownTimer component (Task 40)
   - Position timer on same line as title (desktop)
   - Stack on mobile for readability

5. **Implement product grid**
   - Use CSS Grid or Flexbox for layout
   - Default to 4 columns on desktop
   - Adjust to 2-3 columns on tablet
   - Single column on mobile
   - Apply consistent spacing (gap)

6. **Add product card placeholders**
   - Section will display FlashSaleProductCard (Task 45)
   - For now, render basic product information
   - Task 45 will create the actual card component
   - Map over products array

7. **Implement "View All" link**
   - Display at bottom of section
   - Link to full flash sale page
   - Show product count (e.g., "View all 45 products")
   - Add arrow icon for visual cue

8. **Apply responsive grid layout**
   - Define grid columns at breakpoints
   - Mobile (< 640px): 1 column
   - Tablet (640px - 1024px): 2-3 columns
   - Desktop (> 1024px): 4 columns
   - Large desktop (> 1280px): 4-5 columns

9. **Add loading state**
   - Show skeleton loaders while data fetches
   - Match product card dimensions
   - Pulse animation for loading effect

10. **Add empty state**
    - Display message if no products available
    - Suggest checking back later
    - Link to other sale pages

11. **Integrate with flash sale store**
    - Connect to useFlashSaleStore (Task 38)
    - Display active sale automatically
    - Update when sale changes
    - Handle sale expiration

12. **Add section visibility logic**
    - Only display if active sale exists
    - Hide section when sale expires
    - Show appropriate message during transition

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| sale | FlashSale | Yes | - | Sale data |
| products | Product[] | Yes | - | Product list |
| maxProducts | number | No | 8 | Max products shown |
| showHeader | boolean | No | true | Display header |
| showTimer | boolean | No | true | Display countdown |
| columns | number | No | 4 | Desktop columns |
| viewAllUrl | string | No | `/flash-sales/${sale.id}` | Full page URL |
| className | string | No | '' | Additional classes |

### Section Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Flash Sale Section                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Header                                                 │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │ Avurudu Sale         [02:15:30] Timer           │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │  Product 1  │  Product 2  │  Product 3  │  Product 4  │ │
│  │  Card       │  Card       │  Card       │  Card       │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │  Product 5  │  Product 6  │  Product 7  │  Product 8  │ │
│  │  Card       │  Card       │  Card       │  Card       │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
│                                                              │
│  [ View All Products (45 items) → ]                         │
└─────────────────────────────────────────────────────────────┘
```

### Header Layout

| Element | Position | Size | Responsive |
|---------|----------|------|------------|
| Sale Title | Left | text-2xl / text-3xl | text-xl mobile |
| Countdown | Right | Large | Below title mobile |
| Separator | Between | Optional | Hide mobile |

### Grid Configuration

| Breakpoint | Columns | Gap | Card Width |
|------------|---------|-----|------------|
| < 640px | 1 | gap-4 | 100% |
| 640px - 1024px | 2-3 | gap-4 | ~45% / ~30% |
| 1024px - 1280px | 4 | gap-6 | ~23% |
| > 1280px | 4-5 | gap-6 | ~23% / ~18% |

### "View All" Link Styling

| Element | Style | Purpose |
|---------|-------|---------|
| Container | Center-aligned | Prominence |
| Link Text | Primary color, underline on hover | Clickable indication |
| Icon | Arrow right | Visual direction |
| Count | Gray text | Information |

### Loading State

| Element | Placeholder |
|---------|-------------|
| Header | Skeleton bar (40px height) |
| Timer | Skeleton blocks (60px width) |
| Product Cards | 8 skeleton cards matching grid |
| View All | Skeleton bar (30px height) |

### Empty State

```
┌─────────────────────────────────────┐
│  No Active Flash Sales              │
│                                     │
│  Check back soon for exciting deals!│
│                                     │
│  [ Explore Other Promotions ]       │
└─────────────────────────────────────┘
```

### Integration Points

| Integration | Purpose |
|-------------|---------|
| useActiveFlashSales | Fetch active sale data |
| useFlashSaleStore | Global state management |
| FlashSaleProductCard | Display individual products |
| CountdownTimer | Show time remaining |

### Visibility Logic

| Condition | Display |
|-----------|---------|
| Active sale exists | Show section |
| Sale expired | Hide or show ended message |
| No products | Show empty state |
| Loading | Show skeleton |

### Expected Outcome
- Homepage section displaying flash sale products
- Clear header with countdown timer
- Responsive product grid
- Navigation to full sale page
- Loading and empty states

### Verification Checklist
- [ ] `frontend/components/marketing/flash-sales/FlashSaleSection.tsx` created
- [ ] Component accepts all required props
- [ ] Section header implemented with title and timer
- [ ] Product grid layout configured
- [ ] Responsive design for all breakpoints
- [ ] "View All" link implemented
- [ ] Loading state with skeletons
- [ ] Empty state handling
- [ ] Integration with flash sale store
- [ ] Visibility logic implemented
- [ ] Component properly typed
- [ ] Component exports correctly

---

## Summary

This document established the foundational infrastructure for the flash sales system, including comprehensive type definitions, API client, React Query integration, Zustand store for state management, and the high-precision countdown timer. The countdown timer features animated digits and graceful expired state handling. Additionally, the FlashSaleBanner and FlashSaleSection components provide attractive display options for featured sales and product collections on the homepage.

### Completed Tasks
1. ✓ Created flash sale types with Sri Lanka localization
2. ✓ Created flash sale API client with error handling
3. ✓ Created active sales query hook with React Query
4. ✓ Created flash sale Zustand store for state management
5. ✓ Created useCountdown hook with high precision timing
6. ✓ Created CountdownTimer component with multiple variants
7. ✓ Added animated digits with flip/slide effects
8. ✓ Implemented expired state handling
9. ✓ Created FlashSaleBanner for featured sales
10. ✓ Created FlashSaleSection for product grids

### Next Steps
Proceed to [02_Tasks-45-52_Cards-Page-Verify.md](02_Tasks-45-52_Cards-Page-Verify.md) to create the FlashSaleProductCard with price displays, discount badges, and stock counters, build the dedicated flash sales page with filtering, and verify the complete system.
