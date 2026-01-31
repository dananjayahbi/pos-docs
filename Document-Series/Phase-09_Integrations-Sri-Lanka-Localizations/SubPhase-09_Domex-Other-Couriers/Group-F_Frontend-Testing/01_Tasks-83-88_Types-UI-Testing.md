# Tasks 83-88: Courier Types, UI Components, and Integration Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** F - Frontend & Testing  
> **Document:** 01 of 01  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-E_Fallback-Reliability](../Group-E_Fallback-Reliability/)
- **→ Next SubPhase:** [SubPhase-10_Waybill-Generation](../../SubPhase-10_Waybill-Generation/)

---

## Document Overview

This document covers the creation of frontend TypeScript types, API client, UI components, and comprehensive integration tests for the multi-courier shipping system. It establishes the interface between the backend courier APIs and the frontend user experience, ensuring type safety, proper API communication, intuitive rate comparison, and reliable end-to-end functionality across all five courier providers (Koombiyo, Domex, Prompt X, Royal Express, Trance Express).

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create Courier TypeScript Types | Low | 30 min |
| 84 | Create Courier API Client | Medium | 45 min |
| 85 | Create Courier Selection UI | Medium | 60 min |
| 86 | Create Rate Comparison UI | Medium | 90 min |
| 87 | Create Integration Tests | Medium | 120 min |
| 88 | Create Multi-Courier Documentation | Medium | 60 min |

---

## Task 83: Create Courier TypeScript Types

### Overview
Create comprehensive TypeScript type definitions and interfaces for all courier-related data structures. These types ensure type safety across the frontend application when working with courier providers, rate comparisons, shipment tracking, and courier selections. The types mirror the backend API response structures while providing frontend-specific enhancements.

### Dependencies
- Group-E (Fallback & Reliability) must be complete
- Backend courier APIs implemented and tested
- Next.js frontend project structure established

### Instructions

1. **Create shipping types directory structure**
   - Navigate to `frontend/lib/` directory
   - Create `shipping/` directory for all shipping-related code
   - Create `shipping/courier/` subdirectory for courier-specific types
   - Create `types.ts` file in the courier directory

2. **Define base Courier interface**
   - Create `Courier` interface representing a shipping provider
   - Include id (string - unique identifier)
   - Include name (string - display name like "Koombiyo")
   - Include slug (string - URL-friendly identifier)
   - Include logo (string - URL or path to logo image)
   - Include description (string - provider description)
   - Include is_active (boolean - availability status)
   - Include supports_cod (boolean - cash on delivery support)
   - Include coverage_areas (string[] - service areas)
   - Include priority (number - display order priority)

3. **Define CourierRate interface**
   - Create interface for rate quote from a courier
   - Include courier (string - courier identifier)
   - Include courier_name (string - display name)
   - Include price (number - shipping cost in LKR)
   - Include currency (string - "LKR")
   - Include delivery_days (number - estimated delivery time)
   - Include delivery_estimate (string - human-readable estimate)
   - Include service_type (string - "standard", "express", "same-day")
   - Include available (boolean - availability for given destination)
   - Include error_message (string | null - error if unavailable)
   - Include last_updated (string - ISO timestamp)

4. **Define CourierComparison interface**
   - Create interface for rate comparison results
   - Include rates (CourierRate[] - all retrieved rates)
   - Include cheapest (CourierRate | null - lowest price option)
   - Include fastest (CourierRate | null - quickest delivery option)
   - Include recommended (CourierRate | null - system recommendation)
   - Include total_available (number - count of available couriers)
   - Include comparison_timestamp (string - ISO timestamp)

5. **Define ShipmentTracking interface**
   - Create interface for tracking information
   - Include tracking_number (string)
   - Include courier (string)
   - Include status (ShipmentStatus - enum or union type)
   - Include current_location (string | null)
   - Include estimated_delivery (string | null - ISO date)
   - Include events (TrackingEvent[] - status history)
   - Include last_updated (string - ISO timestamp)

6. **Define ShipmentStatus enum/type**
   - Create union type or enum for shipment statuses
   - Include statuses: "pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed", "returned"
   - Map to user-friendly display names

7. **Define TrackingEvent interface**
   - Create interface for individual tracking events
   - Include timestamp (string - ISO timestamp)
   - Include status (string)
   - Include location (string | null)
   - Include description (string)
   - Include updated_by (string - courier system identifier)

8. **Define CourierSelection interface**
   - Create interface for user courier selection
   - Include order_id (string)
   - Include courier (string)
   - Include rate (CourierRate)
   - Include selected_at (string - ISO timestamp)
   - Include selected_by (string - user identifier)

9. **Define RateComparisonRequest interface**
   - Create interface for rate comparison API request
   - Include origin (Address - pickup location)
   - Include destination (Address - delivery location)
   - Include weight (number - package weight in kg)
   - Include dimensions (Dimensions | null - package size)
   - Include cod_amount (number | null - COD value)
   - Include insurance_value (number | null - declared value)

10. **Define supporting interfaces**
    - Create Address interface (line1, line2, city, postal_code, country)
    - Create Dimensions interface (length, width, height, unit)
    - Export all types from types.ts

### Type Structure Overview

```
Types Hierarchy
├── Courier (Provider information)
├── CourierRate (Individual rate quote)
├── CourierComparison (Comparison results)
├── ShipmentTracking (Tracking information)
│   └── TrackingEvent
├── CourierSelection (User selection)
├── RateComparisonRequest
│   ├── Address
│   └── Dimensions
└── ShipmentStatus (Union type)
```

### Courier Interface Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique provider identifier |
| name | string | Yes | Display name (e.g., "Koombiyo") |
| slug | string | Yes | URL-friendly identifier |
| logo | string | Yes | Logo image URL/path |
| description | string | Yes | Provider description |
| is_active | boolean | Yes | Availability status |
| supports_cod | boolean | Yes | Cash on delivery support |
| coverage_areas | string[] | Yes | Service coverage areas |
| priority | number | Yes | Display order priority |

### CourierRate Interface Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| courier | string | Yes | Courier identifier |
| courier_name | string | Yes | Display name |
| price | number | Yes | Shipping cost (LKR) |
| currency | string | Yes | "LKR" |
| delivery_days | number | Yes | Estimated days |
| delivery_estimate | string | Yes | Human-readable estimate |
| service_type | string | Yes | Service level |
| available | boolean | Yes | Availability flag |
| error_message | string \| null | No | Error if unavailable |
| last_updated | string | Yes | ISO timestamp |

### ShipmentStatus Values

| Status | Description | User Display |
|--------|-------------|--------------|
| pending | Awaiting pickup | "Pending Pickup" |
| picked_up | Package collected | "Picked Up" |
| in_transit | En route | "In Transit" |
| out_for_delivery | Final delivery leg | "Out for Delivery" |
| delivered | Successfully delivered | "Delivered" |
| failed | Delivery failed | "Delivery Failed" |
| returned | Returned to sender | "Returned" |

### Type Safety Benefits

| Benefit | Impact |
|---------|--------|
| Compile-time checks | Catch errors before runtime |
| IDE autocomplete | Faster development |
| API contract enforcement | Consistent data structures |
| Refactoring safety | Safe code changes |
| Documentation | Self-documenting code |

### Expected Outcome
- Complete TypeScript type definitions for courier system
- Type-safe data structures across frontend
- Clear API contract between frontend and backend
- Foundation for type-safe API client and components

### Verification Checklist
- [ ] `frontend/lib/shipping/courier/types.ts` file created
- [ ] Courier interface defined with all required fields
- [ ] CourierRate interface defined with pricing and delivery info
- [ ] CourierComparison interface defined with comparison logic
- [ ] ShipmentTracking and TrackingEvent interfaces defined
- [ ] ShipmentStatus type/enum defined with all statuses
- [ ] CourierSelection interface defined
- [ ] RateComparisonRequest interface defined
- [ ] Supporting interfaces (Address, Dimensions) defined
- [ ] All types exported properly
- [ ] TypeScript compiles without errors
- [ ] Type definitions match backend API structures

---

## Task 84: Create Courier API Client

### Overview
Create a comprehensive TypeScript API client for all courier-related operations. This client provides a clean, type-safe interface for interacting with backend courier endpoints, handling authentication, error handling, request formatting, and response parsing. The client supports fetching available providers, comparing rates across couriers, selecting couriers for orders, tracking shipments, and managing webhook subscriptions.

### Dependencies
- Task 83: Create Courier TypeScript Types
- Authentication system and token management implemented
- Backend courier API endpoints deployed and accessible

### Instructions

1. **Create API client file**
   - Navigate to `frontend/lib/shipping/courier/` directory
   - Create `client.ts` file for the API client
   - Import all necessary types from types.ts

2. **Define base API configuration**
   - Create constant for base API URL (from environment variable)
   - Create constant for API version path ("/api/v1/shipping")
   - Define request timeout (30 seconds default)
   - Define retry configuration (max retries, backoff strategy)

3. **Create base HTTP utility functions**
   - Implement `makeRequest()` function for HTTP calls
   - Handle authentication token injection (Bearer token)
   - Handle response parsing (JSON)
   - Handle error responses (throw typed errors)
   - Implement retry logic for transient failures
   - Add request logging for debugging

4. **Implement getProviders() method**
   - Create function to fetch all available courier providers
   - Endpoint: GET /api/shipping/providers/
   - Query parameters: is_active (boolean, optional)
   - Return type: Promise<Courier[]>
   - Handle empty results
   - Cache results for performance (5 minutes TTL)

5. **Implement compareRates() method**
   - Create function to compare rates across all couriers
   - Endpoint: GET /api/shipping/compare/
   - Request body: RateComparisonRequest
   - Return type: Promise<CourierComparison>
   - Handle partial failures (some couriers unavailable)
   - Include timeout handling (some couriers may be slow)
   - Transform response to include cheapest/fastest logic

6. **Implement getCourierRate() method**
   - Create function to get rate from specific courier
   - Endpoint: GET /api/shipping/rate/{courier}/
   - Request body: RateComparisonRequest
   - Return type: Promise<CourierRate>
   - Handle courier-specific errors
   - Validate courier exists before calling

7. **Implement selectCourier() method**
   - Create function to select courier for an order
   - Endpoint: POST /api/orders/{order_id}/courier/
   - Request body: { courier: string, rate: CourierRate }
   - Return type: Promise<CourierSelection>
   - Validate order exists and is in correct state
   - Handle selection conflicts (courier no longer available)

8. **Implement trackShipment() method**
   - Create function to track shipment status
   - Endpoint: GET /api/shipping/track/{tracking_number}/
   - Query parameters: courier (string, optional for auto-detection)
   - Return type: Promise<ShipmentTracking>
   - Handle invalid tracking numbers
   - Cache tracking results (5 minutes TTL)

9. **Implement refreshTracking() method**
   - Create function to force refresh tracking from courier
   - Endpoint: POST /api/shipping/track/{tracking_number}/refresh/
   - Return type: Promise<ShipmentTracking>
   - Handle rate limiting from courier APIs
   - Update cache with fresh data

10. **Implement error handling utilities**
    - Create custom error classes (CourierAPIError, RateLimitError, CourierUnavailableError)
    - Map HTTP status codes to specific errors
    - Include retry-able error detection
    - Add error logging and monitoring integration

11. **Add request/response interceptors**
    - Implement request interceptor for auth token
    - Implement request interceptor for tenant context
    - Implement response interceptor for error transformation
    - Add logging interceptor for debugging

12. **Export client instance and types**
    - Create singleton client instance
    - Export individual functions for tree-shaking
    - Export error classes
    - Export client configuration interface

### API Client Structure

```
CourierAPIClient
├── Configuration
│   ├── Base URL
│   ├── Timeout
│   └── Retry Policy
├── Provider Methods
│   └── getProviders()
├── Rate Methods
│   ├── compareRates()
│   └── getCourierRate()
├── Selection Methods
│   └── selectCourier()
├── Tracking Methods
│   ├── trackShipment()
│   └── refreshTracking()
└── Error Handling
    ├── Custom Errors
    └── Retry Logic
```

### API Endpoint Mapping

| Method | Endpoint | HTTP Method | Purpose |
|--------|----------|-------------|---------|
| getProviders() | /api/shipping/providers/ | GET | List couriers |
| compareRates() | /api/shipping/compare/ | POST | Compare rates |
| getCourierRate() | /api/shipping/rate/{courier}/ | POST | Single rate |
| selectCourier() | /api/orders/{id}/courier/ | POST | Select courier |
| trackShipment() | /api/shipping/track/{number}/ | GET | Get tracking |
| refreshTracking() | /api/shipping/track/{number}/refresh/ | POST | Force refresh |

### Error Classes

| Error Class | HTTP Status | Retry-able | Description |
|-------------|-------------|------------|-------------|
| CourierAPIError | Any | No | Base error class |
| RateLimitError | 429 | Yes | Rate limit hit |
| CourierUnavailableError | 503 | Yes | Courier API down |
| ValidationError | 400 | No | Invalid request |
| NotFoundError | 404 | No | Resource not found |
| AuthenticationError | 401 | No | Auth failed |

### Request/Response Flow

```
Client Method Call
    ↓
Request Interceptor
    ├── Add auth token
    ├── Add tenant context
    └── Add request ID
    ↓
HTTP Request
    ↓
Response Interceptor
    ├── Parse JSON
    ├── Transform data
    └── Handle errors
    ↓
Error Handler (if error)
    ├── Retry if retry-able
    ├── Transform error
    └── Log error
    ↓
Return Result/Throw Error
```

### Caching Strategy

| Method | Cache TTL | Cache Key | Invalidation |
|--------|-----------|-----------|--------------|
| getProviders() | 5 minutes | "providers:{is_active}" | On provider update |
| trackShipment() | 5 minutes | "tracking:{number}" | On refresh |

### Authentication Handling

| Aspect | Implementation |
|--------|----------------|
| Token Source | Next.js cookies or localStorage |
| Token Format | Bearer {token} |
| Token Refresh | Automatic with interceptor |
| Token Expiry | Handle 401 and redirect to login |

### Retry Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Max Retries | 3 | Balance reliability and speed |
| Initial Delay | 1 second | Avoid immediate retry |
| Backoff Factor | 2 | Exponential backoff |
| Retry Statuses | 429, 500, 502, 503, 504 | Transient errors |

### Expected Outcome
- Complete type-safe API client for courier operations
- Proper error handling and retry logic
- Authentication and tenant context management
- Caching for performance optimization
- Foundation for building UI components

### Verification Checklist
- [ ] `frontend/lib/shipping/courier/client.ts` file created
- [ ] Base HTTP utility functions implemented
- [ ] getProviders() method implemented and tested
- [ ] compareRates() method implemented and tested
- [ ] getCourierRate() method implemented and tested
- [ ] selectCourier() method implemented and tested
- [ ] trackShipment() method implemented and tested
- [ ] refreshTracking() method implemented and tested
- [ ] Custom error classes defined
- [ ] Request/response interceptors implemented
- [ ] Authentication token handling works
- [ ] Retry logic functions correctly
- [ ] Caching implemented for appropriate methods
- [ ] TypeScript types used throughout
- [ ] Client exports properly
- [ ] All methods return correct types

---

## Task 85: Create Courier Selection UI Component

### Overview
Create an interactive CourierSelection component that allows users to choose a shipping courier from available providers. This component displays courier options in a dropdown or card-based selection UI, showing courier logos, names, estimated costs, delivery times, and highlighting recommended options. The component integrates with the courier API client to fetch available providers and handles user selection with proper validation.

### Dependencies
- Task 84: Create Courier API Client
- Task 83: Create Courier TypeScript Types
- Shadcn/UI Select component installed
- Form handling library (React Hook Form) configured

### Instructions

1. **Create component file structure**
   - Navigate to `frontend/components/` directory
   - Create `checkout/` subdirectory for checkout-related components
   - Create `CourierSelection.tsx` in the checkout directory

2. **Define component props interface**
   - Create `CourierSelectionProps` interface
   - Include value (string | null - selected courier ID)
   - Include onChange ((courier: string) => void - selection callback)
   - Include destination (Address - delivery destination)
   - Include weight (number - package weight)
   - Include disabled (boolean - disable selection)
   - Include error (string | null - validation error)
   - Include className (string - additional classes)

3. **Implement data fetching logic**
   - Use React Query or SWR to fetch available providers
   - Call getProviders(true) to get active couriers only
   - Handle loading state with skeleton UI
   - Handle error state with error message
   - Implement automatic refetch on mount
   - Filter couriers based on destination coverage

4. **Implement rate fetching for preview**
   - Fetch estimated rates for all couriers on mount
   - Use compareRates() API method with destination and weight
   - Display rates alongside courier names
   - Handle cases where rates are unavailable
   - Show loading indicator while fetching rates

5. **Create dropdown/select UI structure**
   - Use Shadcn/UI Select component as base
   - Create trigger button showing selected courier or placeholder
   - Display selected courier logo and name in trigger
   - Implement dropdown content with courier list

6. **Design courier option items**
   - Each option shows courier logo (small icon)
   - Display courier name prominently
   - Show estimated price if available (₨ X,XXX)
   - Show estimated delivery time (X-Y days)
   - Add "Recommended" badge for cheapest or fastest
   - Use icons for COD support indication
   - Show unavailable status if courier doesn't serve destination

7. **Implement selection logic**
   - Handle option click/selection
   - Update internal state
   - Trigger onChange callback with courier ID
   - Validate selection (ensure courier is available)
   - Close dropdown after selection

8. **Add visual indicators**
   - Highlight currently selected option
   - Add checkmark icon to selected option
   - Use different styling for disabled options
   - Add hover effects for better UX
   - Show loading spinner in trigger during rate fetch

9. **Implement error handling UI**
   - Display error message below select if error prop provided
   - Show inline errors (e.g., "Courier unavailable for destination")
   - Handle API errors gracefully with retry option
   - Show fallback UI if no couriers available

10. **Add accessibility features**
    - Ensure keyboard navigation works (arrow keys, enter)
    - Add proper ARIA labels and roles
    - Ensure screen reader announces options correctly
    - Maintain focus management

11. **Implement responsive design**
    - Adjust dropdown width for mobile vs desktop
    - Stack option content vertically on mobile
    - Ensure touch targets are large enough (min 44px)
    - Test on various screen sizes

12. **Add recommended logic**
    - Mark cheapest option with "Best Price" badge
    - Mark fastest option with "Fastest" badge
    - Use system recommendation if provided by API
    - Apply distinct visual styling to recommendations

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string \| null | Yes | null | Selected courier ID |
| onChange | (courier: string) => void | Yes | - | Selection handler |
| destination | Address | Yes | - | Delivery address |
| weight | number | Yes | - | Package weight (kg) |
| disabled | boolean | No | false | Disable selection |
| error | string \| null | No | null | Validation error |
| className | string | No | "" | Additional classes |

### Component State

| State Variable | Type | Purpose |
|----------------|------|---------|
| couriers | Courier[] | Available providers |
| rates | CourierRate[] | Estimated rates |
| isLoadingCouriers | boolean | Couriers loading state |
| isLoadingRates | boolean | Rates loading state |
| internalError | string \| null | Internal error state |

### Option Display Layout

```
┌─────────────────────────────────────────┐
│ [Logo] Koombiyo                    ✓   │
│        ₨ 450 · 2-3 days                │
│        [Best Price]                     │
├─────────────────────────────────────────┤
│ [Logo] Domex                            │
│        ₨ 380 · 3-5 days                │
├─────────────────────────────────────────┤
│ [Logo] Prompt X                         │
│        ₨ 850 · Same day                │
│        [Fastest]                        │
└─────────────────────────────────────────┘
```

### Badge Types

| Badge | Color | Condition |
|-------|-------|-----------|
| Best Price | Green | Cheapest option |
| Fastest | Blue | Shortest delivery time |
| Recommended | Purple | System recommendation |
| COD Available | Gray | Supports cash on delivery |

### Selection Flow

```
Component Mount
    ↓
Fetch Available Couriers
    ├── Loading state
    └── Display skeleton
    ↓
Fetch Estimated Rates
    ├── Loading state
    └── Show spinners
    ↓
Display Couriers with Rates
    ├── Apply recommendations
    └── Filter by coverage
    ↓
User Selects Courier
    ↓
Validate Selection
    ↓
Trigger onChange Callback
    ↓
Update Parent Form State
```

### Error States

| Error | Display | Action |
|-------|---------|--------|
| No couriers available | "No couriers available for your location" | Show contact support link |
| Rate fetch failed | Show couriers without rates | Allow selection anyway |
| API error | "Failed to load couriers" | Show retry button |
| Invalid selection | Error message below select | Highlight field in red |

### Accessibility Requirements

| Feature | Implementation |
|---------|----------------|
| Keyboard Navigation | Arrow keys to navigate options |
| Screen Reader | Announce option details |
| Focus Management | Return focus to trigger on close |
| ARIA Labels | Descriptive labels for all elements |

### Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| Mobile (< 640px) | Stack option info vertically, full-width |
| Tablet (640-1024px) | Compact layout with side-by-side info |
| Desktop (> 1024px) | Full details with all badges |

### Expected Outcome
- Functional courier selection dropdown component
- Integration with courier API for real-time data
- Visual indicators for recommended options
- Proper error handling and loading states
- Accessible and responsive design

### Verification Checklist
- [ ] `frontend/components/checkout/CourierSelection.tsx` file created
- [ ] Component props interface defined
- [ ] Data fetching with React Query/SWR implemented
- [ ] Courier list displays correctly
- [ ] Rate information shows alongside couriers
- [ ] Selection logic works and triggers onChange
- [ ] Recommended badges display correctly
- [ ] Loading states show skeleton UI
- [ ] Error states display appropriate messages
- [ ] Disabled state works correctly
- [ ] Keyboard navigation functions properly
- [ ] Screen reader accessibility verified
- [ ] Responsive design tested on mobile and desktop
- [ ] Component integrates with form validation
- [ ] TypeScript types used throughout

---

## Task 86: Create Rate Comparison UI Component

### Overview
Create a comprehensive RateComparison component that displays side-by-side comparison of shipping rates from all available couriers. This component presents rates in a table or card grid format, highlighting the cheapest and fastest options, showing delivery estimates, service levels, and allowing users to select their preferred courier directly from the comparison view. The component provides a clear visual comparison to help users make informed shipping decisions.

### Dependencies
- Task 84: Create Courier API Client
- Task 83: Create Courier TypeScript Types
- Shadcn/UI Table and Card components installed
- Badge and Button components available

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/checkout/` directory
   - Create `RateComparison.tsx` file

2. **Define component props interface**
   - Create `RateComparisonProps` interface
   - Include destination (Address - delivery destination)
   - Include weight (number - package weight in kg)
   - Include dimensions (Dimensions | null - package dimensions)
   - Include codAmount (number | null - COD value if applicable)
   - Include onSelect ((courier: string, rate: CourierRate) => void)
   - Include selectedCourier (string | null - currently selected)
   - Include className (string - additional classes)

3. **Implement rate fetching logic**
   - Use React Query or SWR to fetch rate comparison
   - Call compareRates() API method with all parameters
   - Handle loading state with skeleton table/cards
   - Handle error state with error message and retry button
   - Implement automatic refetch on prop changes (destination, weight)
   - Add manual refresh button

4. **Design table layout (desktop view)**
   - Create table with columns: Courier, Service, Price, Delivery, Actions
   - Courier column: Logo + Name
   - Service column: Service type (Standard, Express, etc.)
   - Price column: ₨ amount with "Cheapest" badge if applicable
   - Delivery column: Delivery days with "Fastest" badge if applicable
   - Actions column: "Select" button
   - Add table header with sortable columns
   - Implement sticky header for long lists

5. **Design card layout (mobile view)**
   - Create card grid for mobile devices
   - Each card represents one courier rate
   - Card header: Logo + Courier name
   - Card body: Price, delivery estimate, service type
   - Card footer: Select button
   - Highlight selected card with border/background
   - Add badges for cheapest/fastest to card header

6. **Implement courier logo display**
   - Display courier logo as image or icon
   - Fallback to courier name initial if logo unavailable
   - Size logos appropriately (32x32px for table, 48x48px for cards)
   - Add alt text for accessibility

7. **Implement price display**
   - Format prices with currency symbol (₨)
   - Add thousand separators (₨ 1,250)
   - Highlight cheapest price with green color
   - Add "Cheapest" badge to lowest price
   - Show original price with strikethrough if discount applied

8. **Implement delivery estimate display**
   - Show delivery days (2-3 days, 1-2 days, Same day)
   - Calculate estimated delivery date
   - Display in user-friendly format ("Arrives by Thursday")
   - Highlight fastest option with blue color
   - Add "Fastest" badge to quickest delivery

9. **Implement service type indicators**
   - Display service level (Standard, Express, Same-Day)
   - Use different colors for service types
   - Add icons for different service levels
   - Show additional service features (COD, Insurance)

10. **Implement selection functionality**
    - Add "Select" button to each row/card
    - Disable button if rate is unavailable
    - Change button to "Selected" when courier is chosen
    - Trigger onSelect callback with courier and rate
    - Show confirmation feedback on selection

11. **Add comparison highlights**
    - Mark cheapest option with green badge and icon
    - Mark fastest option with blue badge and icon
    - Mark recommended option (if different) with purple badge
    - Apply subtle background color to highlighted rows/cards
    - Add tooltip explaining recommendation logic

12. **Implement unavailable courier handling**
    - Display unavailable couriers in muted colors
    - Show reason for unavailability (out of coverage, etc.)
    - Disable select button for unavailable options
    - Add "Unavailable" badge
    - Provide alternative suggestions if available

13. **Add sorting functionality**
    - Implement sort by price (low to high, high to low)
    - Implement sort by delivery time (fast to slow, slow to fast)
    - Add sort indicators to table headers
    - Remember sort preference in state
    - Default sort: Recommended first, then price

14. **Implement filter options**
    - Add filter for COD support
    - Add filter for service type (Standard, Express)
    - Add filter for delivery time (same day, next day, 2+ days)
    - Show active filters with clear buttons
    - Update results dynamically

15. **Add loading and error states**
    - Show skeleton table/cards during loading
    - Display spinner in refresh button during refetch
    - Show error message if comparison fails
    - Add retry button for failed requests
    - Show individual rate errors if partial failure

16. **Implement responsive design**
    - Table view for desktop (≥1024px)
    - Card grid view for tablet (640-1023px)
    - Single column cards for mobile (<640px)
    - Adjust spacing and font sizes appropriately
    - Ensure touch targets are adequate (min 44px)

17. **Add additional information section**
    - Include collapsible "Details" for each courier
    - Show coverage areas in details
    - Show additional fees if applicable
    - Link to courier tracking page
    - Add courier rating/reviews if available

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| destination | Address | Yes | - | Delivery address |
| weight | number | Yes | - | Package weight (kg) |
| dimensions | Dimensions \| null | No | null | Package dimensions |
| codAmount | number \| null | No | null | COD value (LKR) |
| onSelect | (courier, rate) => void | Yes | - | Selection handler |
| selectedCourier | string \| null | No | null | Selected courier ID |
| className | string | No | "" | Additional classes |

### Component State

| State Variable | Type | Purpose |
|----------------|------|---------|
| comparison | CourierComparison | Rate comparison data |
| isLoading | boolean | Loading state |
| error | string \| null | Error state |
| sortBy | "price" \| "delivery" | Current sort column |
| sortOrder | "asc" \| "desc" | Sort direction |
| filters | FilterState | Active filters |

### Table Layout (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│ Courier       │ Service  │ Price       │ Delivery    │ Actions   │
├──────────────────────────────────────────────────────────────────┤
│ [Logo] Domex  │ Standard │ ₨ 380      │ 3-5 days    │ [Select]  │
│               │          │ [Cheapest] │             │           │
├──────────────────────────────────────────────────────────────────┤
│ [Logo]        │ Standard │ ₨ 450      │ 2-3 days    │ [Select]  │
│ Koombiyo      │          │            │ [Fastest]   │           │
├──────────────────────────────────────────────────────────────────┤
│ [Logo]        │ Same-Day │ ₨ 850      │ Same day    │ [Select]  │
│ Prompt X      │          │            │             │           │
└──────────────────────────────────────────────────────────────────┘
```

### Card Layout (Mobile)

```
┌─────────────────────────────────────┐
│ [Logo] Domex         [Cheapest]    │
│                                     │
│ Price: ₨ 380                       │
│ Delivery: 3-5 days                 │
│ Service: Standard                   │
│                                     │
│            [Select Courier]         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [Logo] Koombiyo      [Fastest]     │
│                                     │
│ Price: ₨ 450                       │
│ Delivery: 2-3 days                 │
│ Service: Standard                   │
│                                     │
│            [Select Courier]         │
└─────────────────────────────────────┘
```

### Badge Types and Colors

| Badge | Color | Background | Icon | Condition |
|-------|-------|------------|------|-----------|
| Cheapest | Green (#10B981) | Green/50 | TrendingDown | Lowest price |
| Fastest | Blue (#3B82F6) | Blue/50 | Zap | Shortest delivery |
| Recommended | Purple (#8B5CF6) | Purple/50 | Star | System pick |
| COD | Gray (#6B7280) | Gray/100 | DollarSign | COD supported |
| Unavailable | Red (#EF4444) | Red/50 | XCircle | Not available |

### Sorting Options

| Sort Column | Ascending | Descending | Default |
|-------------|-----------|------------|---------|
| Price | Cheapest first | Most expensive first | Asc |
| Delivery | Fastest first | Slowest first | Asc |
| Recommended | Recommended first | - | Yes |

### Filter Options

| Filter | Type | Options |
|--------|------|---------|
| COD Support | Toggle | On/Off |
| Service Type | Multi-select | Standard, Express, Same-Day |
| Delivery Time | Multi-select | Same day, 1-2 days, 3-5 days, 5+ days |

### Comparison Data Flow

```
Component Mount
    ↓
Fetch Rate Comparison
    ├── Show loading skeleton
    └── Call compareRates() API
    ↓
Receive Comparison Results
    ├── Identify cheapest
    ├── Identify fastest
    └── Identify recommended
    ↓
Apply Sorting (default: recommended)
    ↓
Apply Active Filters
    ↓
Render Table/Cards
    ├── Highlight special options
    └── Show badges
    ↓
User Selects Courier
    ↓
Trigger onSelect Callback
    ↓
Update Selected State
    └── Highlight selected row/card
```

### Error Handling

| Error Type | Display | Action |
|------------|---------|--------|
| Complete failure | "Failed to fetch rates" | Show retry button |
| Partial failure | Show available rates | Note unavailable couriers |
| No rates available | "No couriers service this area" | Suggest alternatives |
| Network timeout | "Request timed out" | Auto-retry after 5s |

### Accessibility Requirements

| Feature | Implementation |
|---------|----------------|
| Table Semantics | Proper thead, tbody, th, td elements |
| Row Selection | Arrow keys to navigate rows |
| Screen Reader | Announce prices and delivery times |
| Focus Management | Focus on select button, maintain on selection |
| ARIA Labels | Descriptive labels for all interactive elements |
| Keyboard Actions | Enter/Space to select, Tab to navigate |

### Responsive Breakpoints

| Breakpoint | Layout | Changes |
|------------|--------|---------|
| Mobile (< 640px) | Single column cards | Stack all info vertically |
| Tablet (640-1023px) | 2-column card grid | Side-by-side cards |
| Desktop (≥ 1024px) | Table layout | Full comparison table |

### Expected Outcome
- Comprehensive rate comparison component
- Clear visual comparison of all options
- Highlighted cheapest and fastest options
- Functional sorting and filtering
- Responsive table/card layouts
- Integration with selection functionality

### Verification Checklist
- [ ] `frontend/components/checkout/RateComparison.tsx` file created
- [ ] Component props interface defined
- [ ] Rate comparison fetching implemented
- [ ] Table layout created for desktop
- [ ] Card layout created for mobile
- [ ] Courier logos display correctly
- [ ] Price formatting with currency symbol
- [ ] Delivery estimates show correctly
- [ ] Badges for cheapest/fastest display
- [ ] Selection functionality works
- [ ] Sorting by price and delivery works
- [ ] Filter options functional
- [ ] Loading states show skeleton UI
- [ ] Error states display with retry option
- [ ] Unavailable couriers handled appropriately
- [ ] Responsive design tested on all breakpoints
- [ ] Accessibility features implemented
- [ ] Component integrates with parent form
- [ ] TypeScript types used throughout

---

## Task 87: Create Integration Tests

### Overview
Create comprehensive integration tests that verify end-to-end functionality of the multi-courier shipping system. These tests cover shipment creation, rate comparison, tracking, webhook processing, and fallback mechanisms for all five courier providers (Koombiyo, Domex, Prompt X, Royal Express, Trance Express). Tests ensure reliable operation, proper error handling, and correct data flow between components.

### Dependencies
- All Groups A-E complete (all courier integrations)
- Task 82: Fallback coordinator operational
- pytest, pytest-django, and factory_boy installed
- Test database configured with django-tenants
- Mock courier API responses prepared

### Instructions

1. **Create test directory structure**
   - Navigate to `backend/tests/` directory
   - Create `shipping/` subdirectory if not exists
   - Create `test_couriers.py` for integration tests
   - Create `fixtures/` subdirectory for test data
   - Create `mocks/` subdirectory for API response mocks

2. **Set up test fixtures**
   - Create tenant fixture for multi-tenancy testing
   - Create user fixture with appropriate permissions
   - Create product fixtures for orders
   - Create address fixtures for shipping destinations
   - Create order fixtures with various states
   - Use factory_boy for dynamic fixture creation

3. **Create mock API responses**
   - Create JSON files with sample courier API responses
   - Include success responses for all couriers
   - Include error responses (rate limit, unavailable, invalid)
   - Include webhook payload examples
   - Include tracking status responses
   - Store in fixtures/ directory

4. **Implement test utilities**
   - Create helper function to mock external API calls
   - Create helper to generate test tracking numbers
   - Create helper to create orders with specific states
   - Create helper to verify webhook signatures
   - Create helper to wait for async tasks (Celery)

5. **Write Koombiyo integration tests**
   - Test create shipment with valid data
   - Test rate calculation with different weights
   - Test tracking number retrieval
   - Test status tracking with all status types
   - Test webhook processing for status updates
   - Test error handling (invalid data, API failure)
   - Test COD order handling
   - Test pickup request creation

6. **Write Domex integration tests**
   - Test create shipment with valid data
   - Test rate calculation for different zones
   - Test tracking number format validation
   - Test status tracking with Domex statuses
   - Test webhook processing
   - Test error handling
   - Test COD support
   - Test bulk shipment creation

7. **Write Prompt X integration tests**
   - Test same-day delivery shipment creation
   - Test rate calculation for metro areas
   - Test tracking with real-time updates
   - Test webhook processing for status changes
   - Test coverage area validation (Colombo only)
   - Test error handling for out-of-coverage
   - Test express pricing

8. **Write Royal Express integration tests**
   - Test standard shipment creation
   - Test rate calculation with weight tiers
   - Test tracking number parsing
   - Test webhook status updates
   - Test island-wide coverage
   - Test error handling
   - Test budget pricing verification

9. **Write Trance Express integration tests**
   - Test express shipment creation
   - Test rate calculation for major cities
   - Test tracking with express delivery statuses
   - Test webhook processing
   - Test coverage area validation
   - Test error handling
   - Test premium pricing

10. **Write rate comparison tests**
    - Test compareRates endpoint returns all couriers
    - Test comparison identifies cheapest option
    - Test comparison identifies fastest option
    - Test comparison with partial failures (some couriers down)
    - Test comparison with all failures
    - Test comparison respects courier priorities
    - Test caching of comparison results

11. **Write fallback mechanism tests**
    - Test fallback to next courier when primary fails
    - Test fallback order (priority-based)
    - Test exhaustion of all couriers
    - Test fallback with rate comparison (choose cheapest among available)
    - Test fallback logs proper error messages
    - Test manual retry after fallback

12. **Write webhook integration tests**
    - Test webhook signature verification for each courier
    - Test webhook payload parsing for each courier
    - Test status update from webhook
    - Test invalid webhook rejection
    - Test duplicate webhook handling (idempotency)
    - Test webhook triggers order status update
    - Test webhook sends customer notification

13. **Write multi-courier selection tests**
    - Test user selects courier for order
    - Test selection validates courier availability
    - Test selection creates shipment with chosen courier
    - Test selection updates order with tracking info
    - Test selection fails if courier no longer available
    - Test selection requires order in correct state

14. **Write tracking integration tests**
    - Test track shipment by tracking number
    - Test auto-detect courier from tracking number
    - Test refresh tracking from courier API
    - Test tracking caching (5-minute TTL)
    - Test tracking multiple shipments
    - Test invalid tracking number handling

15. **Write performance tests**
    - Test rate comparison completes within 10 seconds
    - Test simultaneous shipment creation (10 concurrent)
    - Test webhook processing handles burst (100 webhooks)
    - Test database query optimization (N+1 prevention)
    - Test API rate limit handling

16. **Write data integrity tests**
    - Test shipment creation atomic transaction
    - Test order status consistency
    - Test tracking history maintained correctly
    - Test concurrent updates don't cause race conditions
    - Test tenant isolation (multi-tenancy)

17. **Configure test database**
    - Set up separate test database
    - Configure django-tenants for test mode
    - Create test tenant schemas
    - Implement test data cleanup after each test
    - Use pytest fixtures for database state

18. **Implement continuous integration setup**
    - Create pytest.ini configuration file
    - Configure test runner for CI/CD pipeline
    - Set environment variables for test mode
    - Configure coverage reporting
    - Add test execution scripts

### Test Structure Overview

```
backend/tests/shipping/
├── __init__.py
├── test_couriers.py           # Main integration tests
├── test_fallback.py           # Fallback mechanism tests
├── test_webhooks.py           # Webhook processing tests
├── fixtures/
│   ├── courier_responses/
│   │   ├── koombiyo.json
│   │   ├── domex.json
│   │   ├── promptx.json
│   │   ├── royal.json
│   │   └── trance.json
│   └── webhook_payloads/
│       └── (similar structure)
└── mocks/
    └── api_mocks.py           # API mocking utilities
```

### Test Case Categories

| Category | Test Count | Focus |
|----------|-----------|-------|
| Shipment Creation | 10 | Create shipments with all couriers |
| Rate Calculation | 10 | Rate retrieval and comparison |
| Tracking | 8 | Status tracking and updates |
| Webhooks | 10 | Webhook processing and validation |
| Fallback | 6 | Fallback coordinator logic |
| Selection | 5 | User courier selection |
| Error Handling | 10 | Various error scenarios |
| Performance | 5 | Speed and concurrency |
| Data Integrity | 6 | Consistency and isolation |

### Test Naming Convention

```python
# Format: test_{courier}_{operation}_{scenario}

test_koombiyo_create_shipment_success()
test_koombiyo_create_shipment_invalid_address()
test_domex_rate_calculation_colombo()
test_promptx_tracking_same_day_delivery()
test_royal_webhook_status_delivered()
test_trance_error_out_of_coverage()
test_compare_rates_all_available()
test_fallback_primary_fails_uses_secondary()
```

### Mock API Setup

| Courier | Mock URL | Response File |
|---------|----------|---------------|
| Koombiyo | api.koombiyo.lk/* | koombiyo.json |
| Domex | api.domex.lk/* | domex.json |
| Prompt X | api.promptx.lk/* | promptx.json |
| Royal Express | api.royalexpress.lk/* | royal.json |
| Trance Express | api.tranceexpress.lk/* | trance.json |

### Test Data Requirements

| Data Type | Quantity | Purpose |
|-----------|----------|---------|
| Test Tenants | 3 | Multi-tenancy testing |
| Test Users | 5 | Different permission levels |
| Test Products | 10 | Various weights and dimensions |
| Test Addresses | 15 | Different cities and zones |
| Test Orders | 20 | Various states and configurations |

### Coverage Targets

| Component | Target Coverage | Priority |
|-----------|----------------|----------|
| Courier Adapters | 90% | High |
| Fallback Coordinator | 95% | Critical |
| API Endpoints | 85% | High |
| Webhook Handlers | 90% | High |
| Rate Comparison | 85% | Medium |

### Assertion Examples

```python
# Shipment creation
assert shipment.tracking_number is not None
assert shipment.courier == "koombiyo"
assert shipment.status == "pending"

# Rate comparison
assert comparison.total_available >= 1
assert comparison.cheapest is not None
assert comparison.cheapest.price <= all_prices

# Webhook processing
assert order.status == "delivered"
assert Notification.objects.filter(order=order).exists()
```

### Performance Benchmarks

| Operation | Max Duration | Metric |
|-----------|--------------|--------|
| Rate Comparison | 10 seconds | All 5 couriers |
| Shipment Creation | 3 seconds | Single courier |
| Tracking Refresh | 5 seconds | External API call |
| Webhook Processing | 1 second | Background task |

### Error Test Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| Courier API down | Fallback to next courier |
| Invalid tracking number | Return 404 with error message |
| Rate limit exceeded | Retry with exponential backoff |
| Invalid webhook signature | Reject with 401 |
| Duplicate webhook | Process idempotently |
| Unsupported destination | Return validation error |

### CI/CD Integration

| Step | Command | Purpose |
|------|---------|---------|
| Install deps | pip install -r requirements-test.txt | Test dependencies |
| Run tests | pytest tests/shipping/ -v | Execute tests |
| Coverage | pytest --cov=shipping --cov-report=html | Coverage report |
| Lint | flake8 shipping/ | Code quality |

### Expected Outcome
- Comprehensive test suite covering all courier integrations
- High code coverage (>85%) for shipping module
- Reliable CI/CD pipeline with automated testing
- Documented test scenarios and assertions
- Fast test execution (<5 minutes total)

### Verification Checklist
- [ ] Test directory structure created
- [ ] Test fixtures and factories implemented
- [ ] Mock API responses created for all couriers
- [ ] Koombiyo integration tests written (8+ tests)
- [ ] Domex integration tests written (8+ tests)
- [ ] Prompt X integration tests written (7+ tests)
- [ ] Royal Express integration tests written (7+ tests)
- [ ] Trance Express integration tests written (7+ tests)
- [ ] Rate comparison tests written (6+ tests)
- [ ] Fallback mechanism tests written (6+ tests)
- [ ] Webhook integration tests written (10+ tests)
- [ ] Multi-courier selection tests written (5+ tests)
- [ ] Tracking integration tests written (5+ tests)
- [ ] Performance tests written (5+ tests)
- [ ] Data integrity tests written (6+ tests)
- [ ] Test database configured with multi-tenancy
- [ ] All tests pass successfully
- [ ] Code coverage meets targets (>85%)
- [ ] CI/CD pipeline configured
- [ ] Test documentation updated

---

## Task 88: Create Multi-Courier Documentation

### Overview
Create comprehensive documentation for the multi-courier shipping system, covering architecture overview, individual courier configurations, API endpoints, webhook setup, rate comparison logic, fallback mechanisms, troubleshooting guides, and integration examples. This documentation serves as the primary reference for developers implementing or maintaining the courier integrations.

### Dependencies
- Task 87: Create Integration Tests (to document test results)
- All Groups A-E complete (all courier implementations)
- API documentation tool configured (e.g., Swagger/OpenAPI)

### Instructions

1. **Create documentation directory structure**
   - Navigate to `docs/` directory in project root
   - Create `shipping/` subdirectory
   - Create `multi-courier.md` as main documentation file
   - Create `couriers/` subdirectory for individual courier guides
   - Create `api/` subdirectory for API endpoint documentation

2. **Write architecture overview section**
   - Document multi-courier system architecture
   - Explain courier adapter pattern
   - Describe fallback coordinator logic
   - Illustrate data flow with diagrams
   - Explain rate comparison algorithm
   - Document webhook handling architecture
   - Include system architecture diagram

3. **Write courier providers overview**
   - Create comparison table for all five couriers
   - Include columns: Name, Coverage, Speed, Cost, COD, Features
   - Document strengths and weaknesses of each
   - Provide selection guidelines for tenants
   - Include pricing comparison
   - Document service level differences

4. **Create individual courier documentation**
   - Create separate document for each courier in `couriers/` directory
   - Include file naming: `koombiyo.md`, `domex.md`, `promptx.md`, `royal-express.md`, `trance-express.md`
   - For each courier document:
     - Overview and company background
     - Coverage areas and service levels
     - API authentication and credentials
     - Configuration settings
     - Rate calculation logic
     - Shipment creation process
     - Tracking implementation
     - Webhook setup and payload format
     - Error codes and handling
     - Testing and sandbox environment
     - Code examples

5. **Document API endpoints**
   - List all courier-related API endpoints
   - For each endpoint document:
     - HTTP method and path
     - Authentication requirements
     - Request parameters and body schema
     - Response body schema
     - Success and error status codes
     - Example requests and responses
     - Rate limits
     - Caching behavior
   - Endpoints to cover:
     - GET /api/shipping/providers/
     - POST /api/shipping/compare/
     - POST /api/shipping/rate/{courier}/
     - POST /api/orders/{id}/courier/
     - GET /api/shipping/track/{tracking_number}/
     - POST /api/shipping/track/{number}/refresh/
     - POST /api/webhooks/shipping/{courier}/

6. **Document webhook configuration**
   - Explain webhook purpose and benefits
   - Document webhook registration process for each courier
   - Provide webhook URL format
   - Document webhook signature verification
   - Explain payload structure for each courier
   - Document idempotency handling
   - Provide troubleshooting steps for webhook failures
   - Include example webhook payloads
   - Document webhook retry logic

7. **Document rate comparison logic**
   - Explain rate fetching process
   - Document how cheapest option is determined
   - Document how fastest option is identified
   - Explain recommendation algorithm
   - Document caching strategy
   - Explain timeout handling
   - Document partial failure handling (some couriers unavailable)

8. **Document fallback mechanism**
   - Explain fallback coordinator purpose
   - Document fallback priority order
   - Explain when fallback is triggered
   - Document fallback configuration
   - Provide fallback flow diagram
   - Explain exhaustion scenario (all couriers fail)
   - Document monitoring and alerting for fallbacks

9. **Create configuration guide**
   - Document environment variables for each courier
   - Document Django settings required
   - Explain how to enable/disable couriers
   - Document priority configuration
   - Explain rate limit configuration
   - Document timeout settings
   - Provide example configuration files

10. **Write integration guide**
    - Provide step-by-step integration instructions
    - Document frontend component usage
    - Provide code examples for common scenarios
    - Document error handling patterns
    - Provide testing recommendations
    - Include migration guide from single-courier system

11. **Create troubleshooting guide**
    - Document common issues and solutions
    - Provide debugging steps
    - Document log analysis
    - Explain how to test individual couriers
    - Provide courier API testing tools
    - Document webhook testing procedures
    - Include FAQ section

12. **Document performance considerations**
    - Document rate comparison timeout settings
    - Explain caching strategy and TTLs
    - Document concurrent request handling
    - Provide optimization tips
    - Document monitoring recommendations
    - Include performance benchmarks

13. **Create courier selection guide for tenants**
    - Explain how tenants choose preferred couriers
    - Document multi-courier vs single-courier modes
    - Provide cost-benefit analysis guidance
    - Document coverage area considerations
    - Provide recommendations by business type

14. **Document data models and schemas**
    - Document Shipment model
    - Document Courier model
    - Document CourierRate model
    - Document TrackingEvent model
    - Provide database schema diagrams
    - Document relationships between models

15. **Create API client documentation**
    - Document frontend API client usage
    - Provide TypeScript type definitions
    - Include React component examples
    - Document error handling patterns
    - Provide testing examples

16. **Write security and compliance section**
    - Document API key security practices
    - Explain webhook signature verification
    - Document data privacy considerations
    - Explain PCI compliance for COD
    - Document audit logging

17. **Generate OpenAPI/Swagger documentation**
    - Use drf-spectacular or similar tool
    - Generate OpenAPI spec for all endpoints
    - Configure Swagger UI
    - Deploy interactive API documentation
    - Link from main documentation

18. **Create change log and versioning**
    - Document version history
    - Track API changes and deprecations
    - Provide migration guides between versions
    - Document breaking changes

### Documentation Structure

```
docs/shipping/
├── multi-courier.md              # Main documentation
├── architecture.md               # System architecture
├── getting-started.md            # Quick start guide
├── api-reference.md              # API endpoints
├── configuration.md              # Setup and config
├── troubleshooting.md            # Common issues
├── couriers/
│   ├── koombiyo.md
│   ├── domex.md
│   ├── promptx.md
│   ├── royal-express.md
│   └── trance-express.md
└── diagrams/
    ├── architecture.png
    ├── fallback-flow.png
    └── webhook-flow.png
```

### Main Document Sections

| Section | Content | Pages |
|---------|---------|-------|
| Introduction | Overview, features, benefits | 2 |
| Architecture | System design, components | 3 |
| Courier Providers | Comparison and details | 4 |
| API Reference | Endpoints, schemas | 6 |
| Integration | Step-by-step integration | 4 |
| Configuration | Settings and environment | 3 |
| Webhooks | Setup and handling | 3 |
| Troubleshooting | Common issues, FAQ | 4 |
| Appendix | Additional resources | 2 |

### Individual Courier Document Template

```markdown
# {Courier Name} Integration Guide

## Overview
- Company background
- Service offerings
- Coverage areas

## Configuration
- API credentials
- Environment variables
- Django settings

## Rate Calculation
- Pricing structure
- Weight tiers
- Zone pricing

## Shipment Creation
- Required fields
- Optional parameters
- API endpoint

## Tracking
- Tracking number format
- Status mapping
- Refresh frequency

## Webhooks
- Registration process
- Payload format
- Signature verification

## Error Handling
- Common errors
- Error codes
- Recovery strategies

## Testing
- Sandbox environment
- Test credentials
- Sample data

## Code Examples
- Python
- JavaScript/TypeScript

## Troubleshooting
- Common issues
- Debug steps
```

### Courier Comparison Table

| Courier | Coverage | Speed | Cost | COD | Tracking | Webhooks |
|---------|----------|-------|------|-----|----------|----------|
| Koombiyo | Island-wide | Fast | Medium | Yes | Real-time | Yes |
| Domex | Island-wide | Medium | Low | Yes | Delayed | Yes |
| Prompt X | Colombo | Same-day | High | Yes | Real-time | Yes |
| Royal Express | Island-wide | Standard | Low | Yes | Delayed | Limited |
| Trance Express | Major cities | Express | High | Yes | Real-time | Yes |

### API Endpoint Documentation Format

```markdown
## POST /api/shipping/compare/

Compare rates across all available couriers.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "origin": { ... },
  "destination": { ... },
  "weight": 2.5,
  "dimensions": { ... }
}
```

**Response:**
```json
{
  "rates": [ ... ],
  "cheapest": { ... },
  "fastest": { ... }
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized
- 500: Server error
```

### Diagram Requirements

| Diagram | Type | Purpose |
|---------|------|---------|
| System Architecture | Component | Overall system structure |
| Rate Comparison Flow | Sequence | Rate fetching process |
| Fallback Flow | Flowchart | Fallback logic |
| Webhook Processing | Sequence | Webhook handling |
| Data Model | ERD | Database relationships |

### Code Example Topics

| Topic | Language | Purpose |
|-------|----------|---------|
| Create shipment | Python | Backend integration |
| Compare rates | Python | Backend usage |
| Frontend component | TypeScript/React | UI integration |
| Webhook handler | Python | Webhook processing |
| API client | TypeScript | Frontend API calls |

### Expected Outcome
- Comprehensive multi-courier documentation
- Individual guides for each courier provider
- Complete API reference documentation
- Troubleshooting and FAQ sections
- Integration examples and code samples
- Architecture diagrams and flowcharts

### Verification Checklist
- [ ] `docs/shipping/multi-courier.md` file created
- [ ] Architecture overview section written
- [ ] Courier providers comparison table created
- [ ] Individual courier documents created (5 files)
- [ ] API endpoint documentation written
- [ ] Webhook configuration guide written
- [ ] Rate comparison logic documented
- [ ] Fallback mechanism documented
- [ ] Configuration guide created
- [ ] Integration guide written
- [ ] Troubleshooting guide created
- [ ] Performance considerations documented
- [ ] Tenant selection guide created
- [ ] Data models and schemas documented
- [ ] API client documentation written
- [ ] Security and compliance section written
- [ ] OpenAPI/Swagger spec generated
- [ ] Architecture diagrams created
- [ ] Code examples provided
- [ ] Change log started
- [ ] Documentation reviewed for accuracy
- [ ] Documentation links tested
- [ ] Table of contents generated

---

## Summary

This document covered the complete frontend and testing implementation for the multi-courier shipping system. The work included creating TypeScript type definitions, building a comprehensive API client, developing intuitive UI components (CourierSelection and RateComparison), implementing extensive integration tests, and creating thorough documentation for the entire system.

### Completed Tasks
1. ✓ Created comprehensive TypeScript types for all courier data structures
2. ✓ Created type-safe API client with error handling and retry logic
3. ✓ Created CourierSelection dropdown component with rate preview
4. ✓ Created RateComparison table/card component with sorting and filtering
5. ✓ Created integration tests covering all five couriers and system features
6. ✓ Created comprehensive multi-courier documentation

### Key Deliverables
- **Frontend Types:** Complete type safety across courier operations
- **API Client:** Robust client with caching, retry, and error handling
- **UI Components:** Intuitive selection and comparison interfaces
- **Integration Tests:** 70+ tests covering all scenarios
- **Documentation:** Comprehensive guides for developers and tenants

### Next Steps
Proceed to **SubPhase-10: Waybill Generation** to implement automated waybill/label generation for all courier providers, including PDF generation, thermal printer support, and bulk printing capabilities.
