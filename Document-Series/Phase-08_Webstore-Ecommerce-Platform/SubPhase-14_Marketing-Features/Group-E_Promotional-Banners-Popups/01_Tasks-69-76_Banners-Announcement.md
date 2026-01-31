# Tasks 69-76: Promotional Banners and Announcement Bar

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** E - Promotional Banners & Popups  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-77-82_Popups-Verify.md](02_Tasks-77-82_Popups-Verify.md)

---

## Document Overview

This document covers the implementation of promotional banners and announcement bars for the webstore. It establishes banner type definitions, API integration for fetching active banners, React hooks for banner management, reusable banner components with carousel functionality, CTA buttons, and dismissible announcement bars. These features enable dynamic marketing content display across the webstore with proper scheduling and user preferences.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create Banner Types | Medium | 30 min |
| 70 | Create Banner API | Medium | 40 min |
| 71 | Create Banner Query Hook | Medium | 35 min |
| 72 | Create PromoBanner Component | Medium | 45 min |
| 73 | Create Banner Carousel | Medium | 50 min |
| 74 | Create Banner CTA | Low | 25 min |
| 75 | Create Announcement Bar | Medium | 40 min |
| 76 | Create Announcement Dismiss | Low | 30 min |

---

## Task 69: Create Banner Types

### Overview
Define TypeScript interfaces and types for promotional banners. This establishes the data structure for banner objects, including banner metadata, display properties, positioning options, scheduling information, and targeting rules. Proper typing ensures type safety throughout the banner system and provides clear contracts for API responses and component props.

### Dependencies
- SubPhase-13 (Product Features) must be complete
- TypeScript configuration established
- Frontend project types directory structure exists

### Instructions

1. **Create marketing types directory**
   - Navigate to `frontend/types/` directory
   - Create new directory named `marketing`
   - This houses all marketing-related type definitions

2. **Create banner types file**
   - Create `banner.types.ts` in `types/marketing/` directory
   - Import necessary base types (dates, images)
   - Set up file structure with organized sections

3. **Define BannerPosition enum**
   - Create enum for banner placement options
   - Include: HERO, SIDEBAR, INLINE, FOOTER
   - Use uppercase naming convention for enum values

4. **Define BannerType enum**
   - Create enum for banner categories
   - Include: PROMOTION, SEASONAL, NEW_PRODUCT, SALE, ANNOUNCEMENT
   - Helps filter and organize banners by purpose

5. **Define BannerStatus enum**
   - Create enum for banner lifecycle states
   - Include: DRAFT, SCHEDULED, ACTIVE, PAUSED, EXPIRED
   - Controls banner visibility and management

6. **Create BannerImage interface**
   - Define image property structure
   - Include: url, alt, width, height
   - Add optional mobile and desktop variants

7. **Create BannerCTA interface**
   - Define call-to-action button structure
   - Include: text, url, style (primary/secondary)
   - Add optional icon and target properties

8. **Create BannerSchedule interface**
   - Define scheduling properties
   - Include: startDate, endDate, timezone
   - Add optional days of week and time ranges

9. **Create BannerTargeting interface**
   - Define audience targeting rules
   - Include: userType, location, category
   - Add optional minimum cart value and product tags

10. **Create main Banner interface**
    - Define complete banner object structure
    - Include all properties: id, title, description, image
    - Add: position, type, status, schedule, cta, targeting
    - Include: priority, impressions, clicks, created/updated dates

11. **Create BannerResponse interface**
    - Define API response structure for banner lists
    - Include: banners array, total count, pagination
    - Add metadata for filtering and sorting

12. **Create BannerFilters interface**
    - Define query parameters for fetching banners
    - Include: position, type, status, limit, offset
    - Add optional date range and sorting options

13. **Export all types**
    - Export all interfaces and enums
    - Create type aliases for common combinations
    - Add JSDoc comments for documentation

### Banner Type Structure

```
Banner System Types
├── Enums
│   ├── BannerPosition (HERO, SIDEBAR, INLINE, FOOTER)
│   ├── BannerType (PROMOTION, SEASONAL, NEW_PRODUCT, SALE)
│   └── BannerStatus (DRAFT, SCHEDULED, ACTIVE, PAUSED, EXPIRED)
├── Interfaces
│   ├── BannerImage (url, alt, dimensions)
│   ├── BannerCTA (text, url, style)
│   ├── BannerSchedule (dates, timezone)
│   ├── BannerTargeting (audience rules)
│   ├── Banner (complete banner object)
│   ├── BannerResponse (API response)
│   └── BannerFilters (query parameters)
```

### Banner Interface Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique banner identifier |
| title | string | Yes | Banner title (admin reference) |
| description | string | No | Banner description text |
| image | BannerImage | Yes | Banner image data |
| position | BannerPosition | Yes | Display position |
| type | BannerType | Yes | Banner category |
| status | BannerStatus | Yes | Current status |
| cta | BannerCTA | No | Call-to-action button |
| schedule | BannerSchedule | No | Display schedule |
| targeting | BannerTargeting | No | Audience targeting |
| priority | number | Yes | Display order (higher first) |
| impressions | number | No | View count |
| clicks | number | No | Click count |

### Position Options

| Position | Usage | Display Area |
|----------|-------|--------------|
| HERO | Main hero section | Top of homepage |
| SIDEBAR | Side panel | Product listing pages |
| INLINE | Content area | Between product rows |
| FOOTER | Bottom section | Above footer |

### Schedule Properties

| Property | Type | Description |
|----------|------|-------------|
| startDate | ISO string | Banner start date/time |
| endDate | ISO string | Banner end date/time |
| timezone | string | Timezone (e.g., "Asia/Colombo") |
| daysOfWeek | number[] | Optional: 0-6 (Sunday-Saturday) |
| timeRanges | TimeRange[] | Optional: Daily time windows |

### Targeting Properties

| Property | Type | Description |
|----------|------|-------------|
| userType | "guest" \| "registered" \| "vip" | Target audience |
| locations | string[] | Target regions/cities |
| categories | string[] | Product categories |
| minCartValue | number | Minimum cart (₨) |
| productTags | string[] | Required product tags |

### Expected Outcome
- Complete TypeScript type definitions for banner system
- Type safety for banner data throughout application
- Clear contracts for API integration
- Well-documented interfaces with JSDoc comments

### Verification Checklist
- [ ] `frontend/types/marketing/banner.types.ts` file created
- [ ] All enums defined (Position, Type, Status)
- [ ] BannerImage interface created
- [ ] BannerCTA interface created
- [ ] BannerSchedule interface created
- [ ] BannerTargeting interface created
- [ ] Main Banner interface created with all properties
- [ ] BannerResponse interface for API responses
- [ ] BannerFilters interface for queries
- [ ] All types exported properly
- [ ] JSDoc comments added for clarity

---

## Task 70: Create Banner API

### Overview
Implement API client functions for fetching promotional banners from the backend. This creates a centralized service layer for all banner-related API calls, including fetching active banners, filtering by position and type, and retrieving individual banner details. The API client handles request formatting, error handling, and response transformation.

### Dependencies
- Task 69: Create Banner Types

### Instructions

1. **Create marketing lib directory**
   - Navigate to `frontend/lib/` directory
   - Create new directory named `marketing`
   - This houses marketing feature utilities

2. **Create banner API file**
   - Create `banner.ts` in `lib/marketing/` directory
   - Import banner types from types/marketing
   - Import API utilities (axios, fetch wrapper)

3. **Define API base configuration**
   - Set base URL for banner endpoints
   - Define common headers (Content-Type, Accept)
   - Set timeout values (30 seconds recommended)

4. **Create getActiveBanners function**
   - Define async function accepting filter parameters
   - Build query string from filter object
   - Make GET request to `/api/banners/active`
   - Return typed BannerResponse

5. **Create getBannersByPosition function**
   - Define async function accepting position and limit
   - Filter banners by specific position
   - Make GET request with position parameter
   - Return Banner[] array

6. **Create getBannerById function**
   - Define async function accepting banner ID
   - Make GET request to `/api/banners/{id}`
   - Return single Banner object
   - Handle not found errors

7. **Create recordBannerImpression function**
   - Define async function accepting banner ID
   - Make POST request to `/api/banners/{id}/impression`
   - Track banner view for analytics
   - Handle silently (don't block UI)

8. **Create recordBannerClick function**
   - Define async function accepting banner ID
   - Make POST request to `/api/banners/{id}/click`
   - Track banner click for analytics
   - Handle silently (don't block UI)

9. **Implement error handling**
   - Add try-catch blocks for all functions
   - Log errors appropriately
   - Return empty arrays or null on errors
   - Add user-friendly error messages

10. **Add request caching (optional)**
    - Implement cache layer for banner responses
    - Set cache TTL (5-10 minutes recommended)
    - Clear cache when banners change
    - Reduce server load for frequently accessed banners

11. **Add type guards and validation**
    - Validate API response structure
    - Transform dates to Date objects
    - Ensure required fields are present
    - Handle missing or malformed data

12. **Export all functions**
    - Export individual functions
    - Create default export object with all functions
    - Add JSDoc comments with examples

### API Client Structure

```
Banner API Client
├── Configuration
│   ├── Base URL
│   ├── Headers
│   └── Timeout
├── Functions
│   ├── getActiveBanners(filters)
│   ├── getBannersByPosition(position, limit)
│   ├── getBannerById(id)
│   ├── recordBannerImpression(id)
│   └── recordBannerClick(id)
└── Utilities
    ├── Error handling
    ├── Response transformation
    └── Caching (optional)
```

### API Endpoints

| Function | Method | Endpoint | Parameters |
|----------|--------|----------|------------|
| getActiveBanners | GET | /api/banners/active | position, type, limit |
| getBannersByPosition | GET | /api/banners/active | position, limit |
| getBannerById | GET | /api/banners/:id | id |
| recordImpression | POST | /api/banners/:id/impression | id |
| recordClick | POST | /api/banners/:id/click | id |

### Filter Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| position | BannerPosition | Filter by position | "HERO" |
| type | BannerType | Filter by type | "PROMOTION" |
| limit | number | Maximum results | 10 |
| offset | number | Pagination offset | 0 |
| sortBy | string | Sort field | "priority" |
| sortOrder | "asc" \| "desc" | Sort direction | "desc" |

### Error Handling Strategy

| Error Type | Handling |
|------------|----------|
| Network Error | Return empty array, log error |
| 404 Not Found | Return null, log warning |
| 500 Server Error | Return empty array, log error |
| Timeout | Retry once, then return empty |
| Invalid Response | Validate and filter bad data |

### Response Transformation

```
API Response → Transformation → Application Data
├── Date strings → Date objects
├── Null values → Undefined (optional fields)
├── Missing fields → Default values
└── Nested objects → Proper interfaces
```

### Caching Strategy

| Cache Key | TTL | Invalidation |
|-----------|-----|--------------|
| active-banners:{position} | 5 min | On banner update |
| banner:{id} | 10 min | On banner update |
| No cache for impressions/clicks | - | - |

### Expected Outcome
- Functional API client for banner operations
- Type-safe functions with proper error handling
- Centralized banner data fetching logic
- Analytics tracking for impressions and clicks

### Verification Checklist
- [ ] `frontend/lib/marketing/banner.ts` file created
- [ ] All banner types imported correctly
- [ ] getActiveBanners function implemented
- [ ] getBannersByPosition function implemented
- [ ] getBannerById function implemented
- [ ] recordBannerImpression function implemented
- [ ] recordBannerClick function implemented
- [ ] Error handling added to all functions
- [ ] Response transformation implemented
- [ ] All functions exported properly
- [ ] JSDoc comments added

---

## Task 71: Create Banner Query Hook

### Overview
Create a custom React hook (useBanners) that manages banner data fetching, caching, and state management using React Query or SWR. This hook provides a clean interface for components to access banner data with automatic refetching, loading states, error handling, and optimistic updates. It simplifies banner consumption throughout the application.

### Dependencies
- Task 70: Create Banner API

### Instructions

1. **Create marketing hooks directory**
   - Navigate to `frontend/hooks/` directory
   - Create new directory named `marketing`
   - This houses marketing feature hooks

2. **Create useBanners hook file**
   - Create `useBanners.ts` in `hooks/marketing/` directory
   - Import React Query (useQuery) or SWR
   - Import banner API functions and types

3. **Define hook options interface**
   - Create UseBannersOptions interface
   - Include: position filter, type filter, limit
   - Add: enabled flag, refetch interval
   - Add: staleTime, cacheTime settings

4. **Create useBanners hook function**
   - Define hook accepting options parameter
   - Set default values for optional parameters
   - Return query result with data, loading, error

5. **Implement query key generation**
   - Create unique key based on filter parameters
   - Format: ['banners', position, type, limit]
   - Ensures proper caching and refetching

6. **Implement query function**
   - Call getActiveBanners or getBannersByPosition API
   - Pass filter parameters from options
   - Handle errors and return empty array on failure

7. **Configure query options**
   - Set staleTime (5 minutes recommended)
   - Set cacheTime (10 minutes recommended)
   - Enable automatic refetch on window focus
   - Set retry strategy (2 retries)

8. **Add data transformation**
   - Transform API response to component-friendly format
   - Filter out expired or invalid banners
   - Sort by priority if not sorted by backend
   - Add computed properties if needed

9. **Create useBannerById hook**
   - Define hook for fetching single banner
   - Accept banner ID parameter
   - Return single Banner object with loading state

10. **Create useRecordBannerImpression hook**
    - Define hook for tracking impressions
    - Use mutation hook for POST requests
    - Accept banner ID and trigger automatically
    - Use intersection observer for visibility

11. **Create useRecordBannerClick hook**
    - Define hook for tracking clicks
    - Use mutation hook for POST requests
    - Accept banner ID and manual trigger
    - Call on CTA button click

12. **Export all hooks**
    - Export useBanners as default
    - Export additional hooks (useBannerById, etc.)
    - Add JSDoc comments with usage examples

### Hook Structure

```
Banner Query Hooks
├── useBanners (main hook)
│   ├── Options (position, type, limit)
│   ├── Query function
│   ├── Cache configuration
│   └── Return (data, loading, error, refetch)
├── useBannerById (single banner)
│   └── Return (banner, loading, error)
├── useRecordBannerImpression (tracking)
│   └── Mutation (trigger impression)
└── useRecordBannerClick (tracking)
    └── Mutation (trigger click)
```

### UseBannersOptions Interface

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| position | BannerPosition | undefined | Filter by position |
| type | BannerType | undefined | Filter by type |
| limit | number | 10 | Maximum banners |
| enabled | boolean | true | Enable query |
| refetchInterval | number | undefined | Auto-refetch interval (ms) |
| staleTime | number | 300000 | Consider fresh time (5 min) |

### Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| banners | Banner[] | Array of banners |
| isLoading | boolean | Initial loading state |
| isFetching | boolean | Background refetch state |
| error | Error \| null | Error object if failed |
| refetch | Function | Manual refetch function |

### Query Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| staleTime | 5 minutes | Data freshness threshold |
| cacheTime | 10 minutes | Cache retention time |
| refetchOnWindowFocus | true | Refetch when tab focused |
| retry | 2 | Number of retries on failure |
| retryDelay | exponential | Delay between retries |

### Impression Tracking Strategy

```
Banner Visible → Intersection Observer
    │
    ├── 50% visible for 1 second
    │
    ├── Trigger useRecordBannerImpression
    │
    └── Track once per session
```

### Usage Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| Hero Banners | Fetch HERO position | `useBanners({ position: 'HERO' })` |
| Sidebar Banners | Fetch SIDEBAR position | `useBanners({ position: 'SIDEBAR' })` |
| Promotion Only | Filter by type | `useBanners({ type: 'PROMOTION' })` |
| Single Banner | Fetch by ID | `useBannerById(bannerId)` |

### Performance Optimization

| Technique | Implementation |
|-----------|----------------|
| Query Deduplication | React Query automatic |
| Background Refetch | Stale-while-revalidate |
| Request Cancellation | Abort controllers |
| Prefetching | Prefetch common positions |

### Expected Outcome
- Reusable hook for banner data management
- Automatic caching and refetching
- Loading and error states handled
- Analytics tracking integrated

### Verification Checklist
- [ ] `frontend/hooks/marketing/useBanners.ts` file created
- [ ] UseBannersOptions interface defined
- [ ] useBanners hook implemented
- [ ] Query key generation configured
- [ ] Query function calls banner API
- [ ] Query options configured (staleTime, cacheTime)
- [ ] useBannerById hook created
- [ ] useRecordBannerImpression hook created
- [ ] useRecordBannerClick hook created
- [ ] All hooks exported properly
- [ ] JSDoc comments added with examples

---

## Task 72: Create PromoBanner Component

### Overview
Create the PromoBanner component that displays individual promotional banners with images, text overlays, and CTA buttons. This component handles banner rendering, click tracking, responsive design, and various display styles based on banner position and type. It serves as the core visual component for all banner types across the webstore.

### Dependencies
- Task 71: Create Banner Query Hook

### Instructions

1. **Create marketing components directory**
   - Navigate to `frontend/components/` directory
   - Create new directory named `marketing`
   - Create subdirectory `banners` within marketing

2. **Create PromoBanner component file**
   - Create `PromoBanner.tsx` in `components/marketing/banners/` directory
   - Import React and necessary hooks
   - Import banner types and tracking hooks

3. **Define component props interface**
   - Create PromoBannerProps interface
   - Include: banner object (required)
   - Add: aspectRatio, className (optional)
   - Add: onBannerClick callback (optional)

4. **Set up component structure**
   - Create functional component accepting props
   - Use useRecordBannerClick hook for tracking
   - Set up state for image loading

5. **Create banner container**
   - Create wrapper div with relative positioning
   - Apply responsive width and height
   - Add overflow hidden for image containment
   - Include optional className for customization

6. **Implement banner image**
   - Use Next.js Image component for optimization
   - Set src from banner.image.url
   - Set alt text from banner.image.alt
   - Configure fill layout with object-fit cover
   - Add priority loading for hero banners

7. **Add image loading states**
   - Show skeleton loader while image loads
   - Fade in image when loaded
   - Handle image load errors gracefully
   - Display fallback on error

8. **Create text overlay section**
   - Add absolute positioned overlay div
   - Apply gradient background for text readability
   - Position based on banner configuration
   - Support multiple text positions (top, center, bottom)

9. **Render banner title**
   - Display banner title if provided
   - Style with appropriate typography
   - Ensure contrast against background
   - Truncate long titles appropriately

10. **Render banner description**
    - Display banner description if provided
    - Style with secondary text styling
    - Limit lines for readability (2-3 lines)
    - Add fade-out gradient for overflow

11. **Integrate CTA button**
    - Render CTA button if banner.cta exists
    - Position button prominently
    - Apply button styling based on cta.style
    - Add hover and focus states

12. **Implement click tracking**
    - Call recordBannerClick on banner/CTA click
    - Navigate to banner.cta.url on click
    - Support internal and external links
    - Handle target (_blank for external)

13. **Add responsive variants**
    - Create mobile variant (smaller text, compact CTA)
    - Create tablet variant (medium sizing)
    - Create desktop variant (full sizing)
    - Adjust text overlay position by screen size

14. **Apply position-specific styling**
    - HERO: Full-width, large aspect ratio
    - SIDEBAR: Vertical orientation, compact
    - INLINE: Horizontal, medium size
    - FOOTER: Wide, short aspect ratio

15. **Add accessibility features**
    - Proper alt text for images
    - Keyboard navigation support
    - Focus visible styling
    - ARIA labels for CTA buttons

16. **Export component**
    - Export PromoBanner component
    - Add JSDoc comments with props documentation
    - Include usage examples in comments

### Component Structure

```
PromoBanner Component
├── Container (relative positioning)
│   ├── Banner Image (Next.js Image)
│   │   ├── Loading state (skeleton)
│   │   └── Error state (fallback)
│   ├── Text Overlay (gradient background)
│   │   ├── Title
│   │   ├── Description
│   │   └── CTA Button
│   └── Click Handler (tracking + navigation)
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| banner | Banner | Yes | - | Banner data object |
| aspectRatio | string | No | "16/9" | Image aspect ratio |
| className | string | No | "" | Additional classes |
| onBannerClick | Function | No | - | Custom click handler |

### Aspect Ratios by Position

| Position | Aspect Ratio | Dimensions Example |
|----------|--------------|-------------------|
| HERO | 21:9 or 16:9 | 1920x820, 1920x1080 |
| SIDEBAR | 4:5 or 1:1 | 400x500, 400x400 |
| INLINE | 16:9 or 3:1 | 1200x675, 1200x400 |
| FOOTER | 5:1 or 4:1 | 1200x240, 1200x300 |

### Text Overlay Positions

| Position | Alignment | Use Case |
|----------|-----------|----------|
| Top Left | flex items-start justify-start | Header-style banners |
| Center | flex items-center justify-center | Focal point content |
| Bottom Left | flex items-end justify-start | Footer-style banners |
| Bottom Center | flex items-end justify-center | CTA-focused banners |

### Loading States

```
Banner Loading Sequence
├── Initial: Skeleton placeholder
├── Loading: Fade-in animation
├── Loaded: Full banner display
└── Error: Fallback image or message
```

### Click Tracking Flow

```
User Click → Event Handler
    │
    ├── Record Click (useRecordBannerClick)
    │
    ├── Navigate to URL (banner.cta.url)
    │   ├── Internal: Next.js Link
    │   └── External: window.location
    │
    └── Optional: onBannerClick callback
```

### Responsive Design

| Breakpoint | Title Size | Description | CTA Size |
|------------|------------|-------------|----------|
| Mobile | text-xl | 2 lines | Small |
| Tablet | text-2xl | 2-3 lines | Medium |
| Desktop | text-3xl | 3 lines | Large |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Alt Text | banner.image.alt |
| Keyboard Nav | Focusable container |
| Focus Visible | Ring on focus |
| ARIA Label | Descriptive button labels |
| Color Contrast | 4.5:1 minimum ratio |

### Expected Outcome
- Reusable banner component for all banner types
- Responsive design across all devices
- Click tracking integrated
- Optimized image loading with Next.js

### Verification Checklist
- [ ] `frontend/components/marketing/banners/PromoBanner.tsx` created
- [ ] PromoBannerProps interface defined
- [ ] Banner image rendered with Next.js Image
- [ ] Text overlay with title and description
- [ ] CTA button rendered conditionally
- [ ] Click tracking implemented
- [ ] Responsive styling for mobile, tablet, desktop
- [ ] Position-specific styling (HERO, SIDEBAR, etc.)
- [ ] Loading states for image
- [ ] Error handling for failed images
- [ ] Accessibility features implemented
- [ ] Component exported properly

---

## Task 73: Create Banner Carousel

### Overview
Create the BannerCarousel component that displays multiple promotional banners in a sliding carousel with autoplay, navigation controls, and touch/swipe gestures. This component wraps the PromoBanner component and adds carousel functionality using a carousel library (Embla Carousel or Swiper). It provides an engaging way to showcase multiple promotional banners in the same space.

### Dependencies
- Task 72: Create PromoBanner Component

### Instructions

1. **Choose carousel library**
   - Recommended: Embla Carousel (lightweight, performant)
   - Alternative: Swiper (feature-rich, heavier)
   - Install chosen library via package manager
   - Review library documentation

2. **Create BannerCarousel component file**
   - Create `BannerCarousel.tsx` in `components/marketing/banners/` directory
   - Import PromoBanner component
   - Import carousel library components
   - Import banner types

3. **Define component props interface**
   - Create BannerCarouselProps interface
   - Include: banners array (required)
   - Add: autoplay, interval, showDots, showArrows (optional)
   - Add: aspectRatio, className (optional)

4. **Set up carousel configuration**
   - Configure autoplay settings (5 seconds default)
   - Set loop to true for infinite scrolling
   - Enable touch/swipe gestures for mobile
   - Configure transition speed (300-500ms)

5. **Initialize carousel state**
   - Set up state for current slide index
   - Track autoplay state (playing/paused)
   - Track user interaction (pause on hover)
   - Track slides count

6. **Create carousel container**
   - Create wrapper div with relative positioning
   - Set dimensions based on position and aspect ratio
   - Apply overflow hidden for slide containment
   - Add className support for customization

7. **Implement carousel slides**
   - Map over banners array
   - Render PromoBanner for each banner
   - Apply slide styling and positioning
   - Ensure equal sizing for all slides

8. **Add autoplay functionality**
   - Implement timer using useEffect
   - Advance to next slide on interval
   - Pause on hover for better UX
   - Resume on mouse leave
   - Clear timer on component unmount

9. **Create navigation arrows**
   - Add previous and next arrow buttons
   - Position absolutely (left and right sides)
   - Style with hover effects
   - Show/hide based on showArrows prop
   - Handle edge cases (first/last slide)

10. **Create pagination dots**
    - Render dot indicators for each slide
    - Highlight current slide dot
    - Make dots clickable to jump to slides
    - Position at bottom of carousel
    - Show/hide based on showDots prop

11. **Implement keyboard navigation**
    - Add arrow key listeners (left/right)
    - Enable Home/End keys for first/last slide
    - Focus management for accessibility
    - Prevent default scroll behavior

12. **Add touch/swipe gestures**
    - Use carousel library's built-in gesture support
    - Configure swipe threshold
    - Add visual feedback during swipe
    - Support both mouse drag and touch

13. **Implement accessibility features**
    - Add ARIA roles (region, list, listitem)
    - Add ARIA labels for navigation buttons
    - Announce current slide to screen readers
    - Support keyboard navigation
    - Provide pause control for autoplay

14. **Add performance optimizations**
    - Lazy load non-visible slides
    - Preload adjacent slides only
    - Optimize re-renders with memoization
    - Cleanup event listeners properly

15. **Export component**
    - Export BannerCarousel component
    - Add JSDoc comments with usage examples
    - Document all props and behaviors

### Component Structure

```
BannerCarousel Component
├── Container (relative)
│   ├── Slides Container (flex/carousel)
│   │   └── PromoBanner × N (each banner)
│   ├── Navigation Arrows (prev/next)
│   │   ├── Previous Button
│   │   └── Next Button
│   ├── Pagination Dots
│   │   └── Dot × N (one per slide)
│   └── Autoplay Timer (invisible)
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| banners | Banner[] | Yes | - | Array of banners to display |
| autoplay | boolean | No | true | Enable autoplay |
| interval | number | No | 5000 | Autoplay interval (ms) |
| showDots | boolean | No | true | Show pagination dots |
| showArrows | boolean | No | true | Show navigation arrows |
| aspectRatio | string | No | "16/9" | Slides aspect ratio |
| className | string | No | "" | Additional classes |

### Carousel Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Loop | true | Infinite scrolling |
| Autoplay | 5 seconds | Automatic advancement |
| Transition | 300-500ms | Smooth slide animation |
| Swipe Threshold | 50px | Gesture sensitivity |
| Pause on Hover | true | Better user experience |

### Navigation Controls

```
Carousel Navigation
├── Arrow Buttons
│   ├── Previous (←) - Left side
│   └── Next (→) - Right side
├── Pagination Dots
│   ├── Active (filled circle)
│   └── Inactive (outline circle)
└── Keyboard
    ├── ← / → (prev/next)
    ├── Home (first slide)
    └── End (last slide)
```

### Autoplay Behavior

| Trigger | Action |
|---------|--------|
| Component Mount | Start autoplay timer |
| Mouse Enter | Pause autoplay |
| Mouse Leave | Resume autoplay |
| User Interaction | Pause, restart timer |
| Component Unmount | Clear timer |

### Responsive Behavior

| Screen Size | Arrows | Dots | Swipe |
|-------------|--------|------|-------|
| Mobile | Hide | Show | Enabled |
| Tablet | Show | Show | Enabled |
| Desktop | Show | Show | Optional |

### Pagination Dots Styling

| State | Style | Size |
|-------|-------|------|
| Active | Filled circle, primary color | 12px |
| Inactive | Outline circle, gray | 10px |
| Hover | Scale up, darker | 11px |

### Performance Considerations

| Optimization | Implementation |
|--------------|----------------|
| Lazy Loading | Load slides as needed |
| Memoization | Memo PromoBanner renders |
| Event Cleanup | Remove listeners on unmount |
| Debounce Resize | Throttle resize events |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA Role | role="region" aria-label="Banner carousel" |
| Slide Announce | aria-live="polite" |
| Button Labels | aria-label="Previous/Next slide" |
| Keyboard Nav | Arrow keys support |
| Pause Control | Pause button for autoplay |

### Expected Outcome
- Functional carousel displaying multiple banners
- Smooth transitions and autoplay
- Touch/swipe gesture support
- Accessible navigation controls

### Verification Checklist
- [ ] `frontend/components/marketing/banners/BannerCarousel.tsx` created
- [ ] Carousel library installed and configured
- [ ] BannerCarouselProps interface defined
- [ ] PromoBanner integrated for each slide
- [ ] Autoplay functionality implemented
- [ ] Navigation arrows created and functional
- [ ] Pagination dots created and clickable
- [ ] Touch/swipe gestures working
- [ ] Keyboard navigation implemented
- [ ] Pause on hover working
- [ ] Accessibility features implemented
- [ ] Performance optimizations applied
- [ ] Component exported properly

---

## Task 74: Create Banner CTA

### Overview
Enhance the PromoBanner component with a prominent call-to-action (CTA) button that drives user engagement. This task focuses on styling and positioning the CTA button within the banner, implementing various button styles (primary, secondary, outline), adding hover effects, and ensuring the CTA is responsive and accessible across all devices.

### Dependencies
- Task 72: Create PromoBanner Component

### Instructions

1. **Review PromoBanner component**
   - Open `PromoBanner.tsx` file
   - Locate CTA button rendering section
   - Review current implementation

2. **Create BannerCTA sub-component**
   - Create separate component for reusability (optional)
   - Or enhance inline CTA in PromoBanner
   - Import button utilities and icons

3. **Define CTA button styles**
   - Create primary style (solid background, high contrast)
   - Create secondary style (outlined, subtle)
   - Create ghost style (transparent, text only)
   - Use LCC brand colors (primary blue, etc.)

4. **Implement button size variants**
   - Small: Compact for mobile and sidebar banners
   - Medium: Standard for most banners
   - Large: Prominent for hero banners
   - Adjust padding, font size, and icon size

5. **Position CTA button**
   - Support multiple positions: bottom-left, bottom-center, bottom-right
   - Center position for most banners
   - Right position for text-heavy banners
   - Ensure proper spacing from edges

6. **Add CTA text**
   - Display banner.cta.text property
   - Truncate long text appropriately
   - Use strong, action-oriented text
   - Common examples: "Shop Now", "Learn More", "Get Offer"

7. **Add CTA icon (optional)**
   - Support optional icon in CTA
   - Position icon left or right of text
   - Use arrow icon for navigation CTAs
   - Use shopping cart for product CTAs

8. **Implement hover effects**
   - Scale up slightly on hover (scale-105)
   - Change background color/opacity
   - Add smooth transition (150-300ms)
   - Lift shadow for depth effect

9. **Implement focus states**
   - Add visible focus ring for keyboard navigation
   - Use brand color for focus indicator
   - Ensure 3px outline for visibility
   - Maintain focus visibility standards

10. **Add click animations**
    - Scale down on click (scale-95)
    - Ripple effect (optional)
    - Visual feedback for interaction
    - Smooth transition

11. **Implement responsive behavior**
    - Full-width button on mobile
    - Auto-width with padding on tablet/desktop
    - Adjust text size by screen size
    - Stack with other elements if needed

12. **Add loading state (optional)**
    - Show spinner while navigating
    - Disable button during loading
    - Maintain button dimensions
    - Provide feedback to user

13. **Ensure accessibility**
    - Proper button semantics (button or a tag)
    - Descriptive aria-label if needed
    - Sufficient color contrast (4.5:1)
    - Touch target size (44px minimum)

14. **Test with various banner types**
    - Test with different banner backgrounds
    - Ensure visibility on light and dark images
    - Adjust text shadow if needed
    - Test all button styles

### CTA Button Structure

```
CTA Button
├── Button/Link Element
│   ├── Icon (optional, left/right)
│   ├── Text (banner.cta.text)
│   └── States
│       ├── Default
│       ├── Hover
│       ├── Focus
│       ├── Active
│       └── Loading (optional)
```

### Button Styles

| Style | Background | Text | Border | Use Case |
|-------|------------|------|--------|----------|
| Primary | Brand blue | White | None | Main action |
| Secondary | White | Brand blue | Brand blue | Secondary action |
| Ghost | Transparent | White | White | Subtle action |
| Outline | Transparent | Brand blue | Brand blue | Alternative action |

### Button Sizes

| Size | Padding | Font Size | Icon Size | Height |
|------|---------|-----------|-----------|--------|
| Small | px-4 py-2 | text-sm | 16px | 36px |
| Medium | px-6 py-3 | text-base | 20px | 44px |
| Large | px-8 py-4 | text-lg | 24px | 56px |

### CTA Positioning

```
Banner Layout
┌─────────────────────────────────┐
│                                 │
│  Banner Image                   │
│                                 │
│  ┌───────────────────┐         │
│  │ Title             │         │
│  │ Description       │         │
│  │                   │         │
│  │ [    CTA Button   ]         │ ← Bottom positioning
│  └───────────────────┘         │
└─────────────────────────────────┘
```

### Position Options

| Position | Alignment | Tailwind Classes |
|----------|-----------|------------------|
| Bottom Left | flex items-end justify-start | `self-start` |
| Bottom Center | flex items-end justify-center | `self-center` |
| Bottom Right | flex items-end justify-end | `self-end` |

### Hover Effects

| Effect | Implementation | Duration |
|--------|----------------|----------|
| Scale Up | scale-105 | 150ms |
| Background | opacity-90 or darker shade | 200ms |
| Shadow | shadow-lg → shadow-xl | 200ms |
| Icon Move | translateX(2px) for arrow | 150ms |

### Responsive CTA

| Breakpoint | Width | Size | Icon |
|------------|-------|------|------|
| Mobile | Full width | Small | Hide complex icons |
| Tablet | Auto (min-w-[120px]) | Medium | Show |
| Desktop | Auto (min-w-[150px]) | Medium/Large | Show |

### Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Touch Target | min-h-[44px] min-w-[44px] |
| Color Contrast | 4.5:1 minimum |
| Focus Visible | 3px outline |
| ARIA Label | Descriptive label if icon-only |
| Keyboard Nav | Tab navigation support |

### Common CTA Text Examples

| Banner Type | CTA Text | URL |
|-------------|----------|-----|
| Product Sale | "Shop Now" | /sale |
| New Arrival | "View Collection" | /new-arrivals |
| Discount | "Get 20% Off" | /promo/20off |
| Category | "Explore Electronics" | /category/electronics |
| Brand | "Discover Brand" | /brand/xyz |

### Expected Outcome
- Visually prominent CTA button in banners
- Multiple style and size variants
- Smooth hover and focus effects
- Responsive across all devices
- Accessible to all users

### Verification Checklist
- [ ] CTA button styles defined (primary, secondary, ghost)
- [ ] Button sizes implemented (small, medium, large)
- [ ] CTA positioned correctly in banner
- [ ] Hover effects applied and smooth
- [ ] Focus states visible for accessibility
- [ ] Click animations implemented
- [ ] Responsive behavior working
- [ ] Icon support added (optional)
- [ ] Color contrast meets standards (4.5:1)
- [ ] Touch target size adequate (44px)
- [ ] CTA text displays from banner.cta.text
- [ ] Component works with various banner backgrounds

---

## Task 75: Create Announcement Bar

### Overview
Create the AnnouncementBar component that displays important announcements, promotions, or notices at the top of the webstore. This component shows a fixed or static bar with text content, optional icons, optional links, and a dismiss button. It provides a non-intrusive way to communicate time-sensitive information to all visitors.

### Dependencies
- Task 69: Create Banner Types

### Instructions

1. **Create AnnouncementBar component file**
   - Create `AnnouncementBar.tsx` in `components/marketing/banners/` directory
   - Import React and necessary hooks
   - Import banner types and icons

2. **Define component props interface**
   - Create AnnouncementBarProps interface
   - Include: message text (required)
   - Add: link URL, linkText (optional)
   - Add: icon, variant (info/warning/success), dismissible

3. **Set up component state**
   - Track visibility state (visible/hidden)
   - Check localStorage for previously dismissed announcements
   - Use announcement ID to track dismissal

4. **Create bar container**
   - Create full-width container div
   - Position fixed at top or static below header
   - Set z-index for proper layering (z-50)
   - Apply background color based on variant

5. **Implement bar variants**
   - Info variant: Blue background for general announcements
   - Warning variant: Yellow/orange for urgent messages
   - Success variant: Green for positive news (sales, etc.)
   - Error variant: Red for critical alerts (optional)

6. **Add announcement content**
   - Create centered content container
   - Set max-width for readability (max-w-7xl)
   - Add horizontal padding for mobile
   - Display message text prominently

7. **Add optional icon**
   - Display icon on left side if provided
   - Use appropriate icon for variant (info, warning, success)
   - Size icon appropriately (20-24px)
   - Color icon to match variant

8. **Render announcement text**
   - Display message text with proper typography
   - Truncate long text on mobile (1-2 lines)
   - Show full text on desktop
   - Center text horizontally

9. **Add optional link**
   - Display link text if URL provided
   - Use Next.js Link for internal navigation
   - Style as underlined or button-like
   - Position on right side on desktop, below text on mobile

10. **Create dismiss button**
    - Add X close button on right side
    - Use icon (X or Close icon)
    - Position absolutely on right edge
    - Show only if dismissible prop is true

11. **Implement responsive layout**
    - Mobile: Stack text and link vertically, smaller padding
    - Tablet: Horizontal layout, medium padding
    - Desktop: Horizontal with more spacing

12. **Add height management**
    - Set appropriate height (h-10 to h-12)
    - Adjust height based on content
    - Use min-h for dynamic content
    - Ensure consistent height across variants

13. **Apply animation**
    - Slide down animation on mount
    - Slide up animation on dismiss
    - Smooth transition (200-300ms)
    - Use CSS transitions or Framer Motion

14. **Implement accessibility**
    - Add role="banner" or role="alert" for announcements
    - Include aria-label for dismiss button
    - Ensure color contrast for text
    - Support keyboard dismissal (Escape key)

15. **Export component**
    - Export AnnouncementBar component
    - Add JSDoc comments
    - Include usage examples

### Component Structure

```
AnnouncementBar Component
├── Container (fixed/static, full-width)
│   ├── Content Wrapper (max-width, centered)
│   │   ├── Icon (optional, left)
│   │   ├── Message Text (center)
│   │   ├── Link (optional, right)
│   │   └── Dismiss Button (far right)
│   └── Animation (slide in/out)
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| message | string | Yes | - | Announcement text |
| link | string | No | - | Optional link URL |
| linkText | string | No | "Learn more" | Link text |
| icon | ReactNode | No | - | Optional icon |
| variant | "info" \| "warning" \| "success" | No | "info" | Bar style variant |
| dismissible | boolean | No | true | Show dismiss button |
| id | string | No | - | Unique ID for dismissal tracking |

### Variant Styles

| Variant | Background | Text Color | Icon | Border |
|---------|------------|------------|------|--------|
| Info | Blue (bg-blue-600) | White | Info icon | Optional |
| Warning | Orange (bg-orange-500) | White | Warning icon | Optional |
| Success | Green (bg-green-600) | White | Check icon | Optional |
| Error | Red (bg-red-600) | White | Alert icon | Optional |

### Bar Layout

```
Desktop Layout
┌─────────────────────────────────────────────────────────────┐
│ [Icon] Message text here...     [Learn More →]      [X]    │
└─────────────────────────────────────────────────────────────┘

Mobile Layout
┌────────────────────────────────────┐
│ [Icon] Message text...       [X]  │
│        [Learn More →]              │
└────────────────────────────────────┘
```

### Positioning Options

| Position | CSS | Use Case |
|----------|-----|----------|
| Fixed Top | fixed top-0 | Always visible |
| Static Top | static | Below header |
| Fixed Bottom | fixed bottom-0 | Cookie consent style |

### Height Specifications

| Content | Height | Padding |
|---------|--------|---------|
| Single Line | h-10 (40px) | py-2 |
| Single Line + Link | h-12 (48px) | py-3 |
| Multi-line (Mobile) | min-h-12 | py-3 |

### Responsive Behavior

| Breakpoint | Layout | Text | Link Position |
|------------|--------|------|---------------|
| Mobile | Vertical | Truncated | Below text |
| Tablet | Horizontal | Full | Inline right |
| Desktop | Horizontal | Full | Inline right |

### Animation Timing

| Animation | Duration | Easing |
|-----------|----------|--------|
| Slide In | 300ms | ease-out |
| Slide Out | 200ms | ease-in |
| Hover | 150ms | ease-in-out |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA Role | role="banner" or role="alert" |
| Dismiss Label | aria-label="Dismiss announcement" |
| Keyboard | Escape key to dismiss |
| Color Contrast | 4.5:1 minimum |
| Focus Visible | Clear focus ring on dismiss button |

### Common Announcement Examples

| Message | Link | Variant |
|---------|------|---------|
| "Free shipping on orders over ₨5,000!" | /shipping | info |
| "Flash Sale - 24 hours only!" | /sale | warning |
| "New arrivals now in stock" | /new | success |
| "Site maintenance on Sunday 2 AM" | /maintenance | warning |

### Expected Outcome
- Functional announcement bar component
- Multiple variant styles for different message types
- Optional link and dismiss functionality
- Smooth animations for appearance and dismissal

### Verification Checklist
- [ ] `frontend/components/marketing/banners/AnnouncementBar.tsx` created
- [ ] AnnouncementBarProps interface defined
- [ ] Bar container with full width
- [ ] Variant styles implemented (info, warning, success)
- [ ] Message text displays correctly
- [ ] Optional icon support added
- [ ] Optional link renders and navigates
- [ ] Dismiss button visible when dismissible=true
- [ ] Responsive layout for mobile and desktop
- [ ] Height management implemented
- [ ] Slide animations working
- [ ] Accessibility features implemented
- [ ] Component exported properly

---

## Task 76: Create Announcement Dismiss

### Overview
Implement the dismissal functionality for the AnnouncementBar component. This includes storing dismissed announcement IDs in localStorage, respecting user preferences, supporting different dismissal durations (session-based or time-based), and providing options for permanent dismissal or re-showing after a specified time period.

### Dependencies
- Task 75: Create Announcement Bar

### Instructions

1. **Create storage utility**
   - Create `announcementStorage.ts` in `lib/marketing/` directory
   - Define key format for localStorage
   - Create helper functions for storage operations

2. **Define dismissal options**
   - Session-based: Cleared when browser closes
   - Time-based: Auto-expire after X days (1, 7, 30 days)
   - Permanent: Never show again for this announcement
   - Create enum or type for dismissal types

3. **Create getDismissedAnnouncements function**
   - Read from localStorage
   - Parse stored JSON data
   - Return array of dismissed announcement IDs with metadata
   - Handle storage errors gracefully

4. **Create setAnnouncementDismissed function**
   - Accept announcement ID and dismissal type
   - Store dismissal with timestamp
   - Add expiration date if time-based
   - Handle storage quota errors

5. **Create isAnnouncementDismissed function**
   - Check if announcement ID exists in storage
   - Verify dismissal hasn't expired (for time-based)
   - Return boolean
   - Clean up expired entries

6. **Create clearExpiredDismissals function**
   - Run on app initialization
   - Remove expired dismissals from storage
   - Optimize storage usage
   - Run on each storage check (optional)

7. **Update AnnouncementBar component**
   - Import storage utility functions
   - Check dismissal status on component mount
   - Hide bar if announcement is dismissed
   - Don't render component if dismissed

8. **Implement dismiss handler**
   - Create handleDismiss function in component
   - Call setAnnouncementDismissed with announcement ID
   - Update component state to hide bar
   - Trigger slide-out animation before hiding

9. **Add animation on dismiss**
   - Animate bar sliding up/fading out
   - Use CSS transitions or Framer Motion
   - Duration: 200-300ms
   - Remove from DOM after animation

10. **Implement re-show logic**
    - Check expiration on each page load
    - Show announcement again after expiration
    - Clear expired entries from storage
    - Update UI automatically

11. **Add configuration options**
    - Allow dismissal type to be passed as prop
    - Default: Session-based
    - Support: permanent, session, days (1, 7, 30)
    - Pass to storage function

12. **Handle storage edge cases**
    - Check if localStorage is available
    - Handle disabled localStorage (private browsing)
    - Fallback to sessionStorage if needed
    - Fallback to memory (in-component state) as last resort

13. **Add admin override (optional)**
    - Support force-show parameter in URL
    - Bypass dismissal for testing
    - Example: ?showAnnouncement=true
    - Useful for debugging

14. **Implement multi-announcement support**
    - Support multiple announcements with unique IDs
    - Each dismissal tracked independently
    - Priority system for multiple active announcements
    - Show highest priority non-dismissed announcement

15. **Test dismissal persistence**
    - Test session-based dismissal (cleared on browser close)
    - Test time-based dismissal (re-appears after expiration)
    - Test permanent dismissal (never re-appears)
    - Test across page refreshes and navigations

### Storage Structure

```
localStorage Key: "lcc_dismissed_announcements"

Value (JSON):
{
  "announcement-1": {
    "dismissedAt": "2026-01-31T12:00:00Z",
    "expiresAt": "2026-02-07T12:00:00Z",
    "type": "time-based"
  },
  "announcement-2": {
    "dismissedAt": "2026-01-31T12:00:00Z",
    "expiresAt": null,
    "type": "permanent"
  }
}
```

### Dismissal Types

| Type | Duration | Storage | Use Case |
|------|----------|---------|----------|
| Session | Browser session | sessionStorage | Temporary announcements |
| Time-based (1 day) | 24 hours | localStorage | Daily promotions |
| Time-based (7 days) | 1 week | localStorage | Weekly updates |
| Time-based (30 days) | 1 month | localStorage | Monthly campaigns |
| Permanent | Forever | localStorage | One-time announcements |

### Storage Utility Functions

| Function | Parameters | Return | Description |
|----------|------------|--------|-------------|
| getDismissedAnnouncements | - | Object | Get all dismissals |
| isAnnouncementDismissed | id: string | boolean | Check if dismissed |
| setAnnouncementDismissed | id, type, days | void | Store dismissal |
| clearExpiredDismissals | - | void | Clean up expired |
| clearAllDismissals | - | void | Clear all (testing) |

### Dismissal Flow

```
User Click Dismiss → handleDismiss()
    │
    ├── Trigger slide-out animation
    │
    ├── setAnnouncementDismissed(id, type)
    │   ├── Get current storage
    │   ├── Add dismissal entry
    │   ├── Calculate expiration
    │   └── Save to localStorage
    │
    ├── Update component state (hidden)
    │
    └── Remove from DOM after animation
```

### Expiration Calculation

| Type | Calculation |
|------|-------------|
| Session | No expiration, use sessionStorage |
| 1 Day | dismissedAt + 86400000 ms |
| 7 Days | dismissedAt + 604800000 ms |
| 30 Days | dismissedAt + 2592000000 ms |
| Permanent | expiresAt = null |

### Re-show Logic

```
Page Load → Check Dismissals
    │
    ├── isAnnouncementDismissed(id)
    │   ├── Entry exists in storage?
    │   ├── Expired? (expiresAt < now)
    │   └── Return true/false
    │
    ├── If expired: Clear entry
    │
    └── Show/Hide announcement based on result
```

### Storage Edge Cases

| Case | Handling |
|------|----------|
| localStorage disabled | Use sessionStorage fallback |
| sessionStorage disabled | Use in-memory state |
| Storage quota exceeded | Clear old entries, retry |
| Invalid JSON | Clear storage, start fresh |

### Multi-Announcement Priority

| Priority | Type | Display Order |
|----------|------|---------------|
| Critical (1) | Error, urgent | First |
| High (2) | Warning, time-sensitive | Second |
| Medium (3) | Info, general | Third |
| Low (4) | Success, FYI | Fourth |

### Admin Override

```
URL: /?showAnnouncement=announcement-1

Logic:
if (urlParams.has('showAnnouncement')) {
  const id = urlParams.get('showAnnouncement');
  // Force show announcement, ignore dismissal
}
```

### Testing Scenarios

| Test | Expected Behavior |
|------|-------------------|
| Dismiss and refresh | Stays dismissed |
| Dismiss session-based, close browser | Reappears on next visit |
| Dismiss 1-day, wait 1 day | Reappears after 1 day |
| Dismiss permanent | Never reappears |
| Multiple announcements | Each tracked independently |

### Expected Outcome
- Functional dismissal system with localStorage persistence
- Support for multiple dismissal durations
- Automatic expiration and re-showing
- Graceful handling of storage limitations

### Verification Checklist
- [ ] `frontend/lib/marketing/announcementStorage.ts` file created
- [ ] Dismissal types defined (session, time-based, permanent)
- [ ] getDismissedAnnouncements function implemented
- [ ] isAnnouncementDismissed function implemented
- [ ] setAnnouncementDismissed function implemented
- [ ] clearExpiredDismissals function implemented
- [ ] AnnouncementBar updated with dismissal logic
- [ ] handleDismiss function implemented
- [ ] Slide-out animation on dismiss
- [ ] Dismissal persists across page refreshes
- [ ] Time-based re-showing works correctly
- [ ] Storage edge cases handled (disabled localStorage)
- [ ] Multi-announcement support working
- [ ] All dismissal types tested

---

## Summary

This document established the promotional banners and announcement bar system for the webstore. We created comprehensive type definitions, API integration, React hooks for data management, reusable banner components with carousel functionality, prominent CTA buttons, and a dismissible announcement bar with persistent storage. These features enable dynamic, engaging marketing content display across the webstore.

### Completed Tasks
1. ✓ Created banner types with comprehensive interfaces
2. ✓ Created banner API client with tracking
3. ✓ Created useBanners hook for data management
4. ✓ Created PromoBanner component with responsive design
5. ✓ Created BannerCarousel with autoplay and navigation
6. ✓ Enhanced banners with prominent CTA buttons
7. ✓ Created AnnouncementBar for top-of-page messages
8. ✓ Implemented dismissal functionality with localStorage

### Next Steps
Proceed to [02_Tasks-77-82_Popups-Verify.md](02_Tasks-77-82_Popups-Verify.md) to create promotional popup components with various triggers (entry, exit, scroll) and complete verification of all marketing features.
