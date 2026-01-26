# Group D - Document 01: Search Results Container, Grid, and API Integration

## Document Metadata

- **Document ID:** Phase-08_SubPhase-05_Group-D_Doc-01
- **Tasks Covered:** Tasks 49-58
- **Prerequisites:** 
  - SubPhase-03 Product Catalog (Product Cards)
  - Group-A Search Bar Component
  - API endpoints configured
- **Estimated Completion Time:** 10-12 hours
- **Complexity Level:** Medium-High

---

## Navigation

- **Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **Previous:** Group-C_Search-Filters-State (completed)
- **Next:** [02_Tasks-59-66_Pagination-Meta-Verify.md](./02_Tasks-59-66_Pagination-Meta-Verify.md)
- **Related Documents:**
  - [SubPhase-03 Product Catalog](../../SubPhase-03_Product-Catalog-Listings/)
  - [Group-A Search Bar](../Group-A_Search-Bar-Component/)
  - [Group-C Search Filters](../Group-C_Search-Filters-State/)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Summary](#architecture-summary)
3. [Task 49: Create Search Results Container](#task-49-create-search-results-container)
4. [Task 50: Create Results Header](#task-50-create-results-header)
5. [Task 51: Create Results Count](#task-51-create-results-count)
6. [Task 52: Create Results Grid](#task-52-create-results-grid)
7. [Task 53: Create Results Product Card](#task-53-create-results-product-card)
8. [Task 54: Create Results Sidebar](#task-54-create-results-sidebar)
9. [Task 55: Create Search Query Param Handler](#task-55-create-search-query-param-handler)
10. [Task 56: Create Search API Call](#task-56-create-search-api-call)
11. [Task 57: Create Results Loading States](#task-57-create-results-loading-states)
12. [Task 58: Create Results Pagination](#task-58-create-results-pagination)
13. [Component Integration](#component-integration)
14. [State Management](#state-management)
15. [Testing Requirements](#testing-requirements)
16. [Validation Checklist](#validation-checklist)

---

## Overview

### Purpose

This document provides comprehensive instructions for building the Search Results Page, which displays filtered and sorted product results based on user search queries. This is the primary interface users interact with after submitting a search, and it must provide excellent performance, usability, and visual clarity.

### Scope

Group-D (Document 01) covers:
- Search results page container and layout structure
- Results header displaying query information and result counts
- Responsive product grid displaying search results
- Sidebar for filters and refinements
- URL query parameter management for search state
- API integration with search backend
- Loading states and skeleton screens
- Pagination controls and navigation

### Key Objectives

1. **Create Responsive Layout:** Build a flexible container that works across all device sizes
2. **Display Search Context:** Show users what they searched for and how many results were found
3. **Present Results Effectively:** Use a grid layout that adapts to screen size
4. **Enable Filtering:** Provide sidebar controls for refining search results
5. **Handle URL State:** Maintain search parameters in URL for bookmarking and sharing
6. **Integrate with API:** Connect to backend search endpoints efficiently
7. **Provide Feedback:** Show loading states and handle empty results gracefully
8. **Enable Navigation:** Implement pagination for large result sets

### Technology Stack

- **Frontend Framework:** Next.js 14+ (App Router)
- **State Management:** URL-based state with React Query for server state
- **Styling:** Tailwind CSS with responsive utilities
- **API Client:** Fetch/Axios with React Query hooks
- **URL Management:** Next.js useSearchParams and useRouter hooks
- **Component Library:** Reuse from SubPhase-03 Product Catalog

---

## Architecture Summary

### Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Search Results Page                      │
│  /search?q=laptop&category=electronics&sort=price_asc      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │           Results Header Component                  │   │
│  │  • Query Display: "laptop"                          │   │
│  │  • Results Count: "234 products found"              │   │
│  │  • Sort Controls                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐  ┌────────────────────────────────────┐     │
│  │          │  │                                     │     │
│  │ Sidebar  │  │      Product Grid                   │     │
│  │          │  │                                     │     │
│  │ • Cats   │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │     │
│  │ • Price  │  │  │ P1 │ │ P2 │ │ P3 │ │ P4 │      │     │
│  │ • Brand  │  │  └────┘ └────┘ └────┘ └────┘      │     │
│  │ • Rating │  │                                     │     │
│  │ • Filters│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │     │
│  │          │  │  │ P5 │ │ P6 │ │ P7 │ │ P8 │      │     │
│  │          │  │  └────┘ └────┘ └────┘ └────┘      │     │
│  │          │  │                                     │     │
│  └──────────┘  └────────────────────────────────────┘     │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │              Pagination Component                   │   │
│  │         ◄ Previous  1 2 3 4 5  Next ►               │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
SearchResultsPage
├── SearchResultsContainer
│   ├── ResultsHeader
│   │   ├── QueryDisplay
│   │   ├── ResultsCount
│   │   └── SortControls
│   ├── MainLayout
│   │   ├── ResultsSidebar
│   │   │   ├── CategoryFilter
│   │   │   ├── PriceFilter
│   │   │   ├── BrandFilter
│   │   │   ├── RatingFilter
│   │   │   └── ActiveFilters
│   │   └── ResultsGrid
│   │       └── ProductCard[] (reused from SubPhase-03)
│   └── ResultsPagination
│       ├── PreviousButton
│       ├── PageNumbers
│       └── NextButton
└── LoadingState (conditional)
```

### Data Flow

```
User Action
    ↓
URL Parameters Update (?q=laptop&category=electronics)
    ↓
useSearchParams Hook Detects Change
    ↓
React Query Triggers API Call
    ↓
Backend Search API (/api/products/search)
    ↓
Response with Products & Metadata
    ↓
Update UI Components
    ↓
Render Results Grid & Pagination
```

### URL Structure

```
Base: /search

Query Parameters:
- q: search query (string)
- category: category ID or slug (string)
- minPrice: minimum price filter (number)
- maxPrice: maximum price filter (number)
- brand: brand filter (string or array)
- rating: minimum rating (number)
- sort: sort order (string: price_asc, price_desc, name_asc, rating_desc, newest)
- page: current page number (number, default: 1)
- limit: results per page (number, default: 24)

Example:
/search?q=laptop&category=electronics&minPrice=500&maxPrice=2000&brand=dell&brand=hp&sort=price_asc&page=1&limit=24
```

---

## Task 49: Create Search Results Container

### Objective

Build the main container component that serves as the wrapper for the entire search results page, handling responsive layout, loading states, and overall page structure.

### File Location

Create new file:
- Path: `/apps/webstore/src/components/search/SearchResultsContainer.tsx`

### Container Responsibilities

1. **Layout Management:** Control overall page structure and spacing
2. **State Orchestration:** Coordinate between child components
3. **Loading Coordination:** Manage loading states across all sections
4. **Error Boundary:** Handle and display errors gracefully
5. **Responsive Behavior:** Adapt layout for mobile, tablet, and desktop

### Component Structure

#### Props Interface

Define props that the container accepts:
- Initial search query (optional for SSR)
- Initial filters (optional for SSR)
- Default sort order
- Items per page configuration
- Layout variant (sidebar-left, sidebar-right, no-sidebar)

#### Layout Variants

Create three layout configurations:
1. **Desktop Layout:** Sidebar on left, main content on right (sidebar: 25%, content: 75%)
2. **Tablet Layout:** Collapsible sidebar that slides in from left
3. **Mobile Layout:** Full-width content with bottom sheet filter panel

### Responsive Breakpoints

Define breakpoint behavior:
- **Mobile (< 768px):** Single column, no sidebar visible by default
- **Tablet (768px - 1024px):** Two-column with collapsible sidebar
- **Desktop (> 1024px):** Fixed sidebar + main content area
- **Large Desktop (> 1440px):** Wider content area with max-width constraint

### Container Layout Implementation

#### Main Wrapper

Create outer container with:
- Full width with max-width constraint (e.g., 1536px)
- Centered horizontally with auto margins
- Appropriate padding (responsive: mobile 1rem, desktop 2rem)
- Background color for the page
- Minimum height to avoid layout shift

#### Content Grid

Implement grid layout:
- Grid columns: 12-column system
- Sidebar span: 3 columns on desktop, hidden on mobile
- Main content span: 9 columns on desktop, 12 on mobile
- Gap between columns: 1.5rem to 2rem
- Vertical rhythm spacing between sections

### State Management Setup

#### Local State Requirements

Define local state for:
- Sidebar visibility toggle (mobile/tablet)
- Applied filters collection
- Active sort option
- Current page number
- View mode (grid/list toggle if supported)

#### URL State Synchronization

Implement URL parameter reading:
- Read search query from URL on mount
- Parse all filter parameters
- Extract pagination state
- Monitor URL changes and update local state
- Preserve URL state on page refresh

### Loading State Handling

#### Initial Load

When page first loads:
- Show skeleton for header
- Display sidebar skeleton (desktop) or placeholder
- Render grid skeleton with correct number of placeholders
- Hide pagination during initial load

#### Filter Changes

When filters update:
- Keep header visible
- Show loading overlay on grid area
- Maintain sidebar visibility
- Update pagination to disabled state

#### Page Changes

When navigating between pages:
- Keep all UI elements visible
- Show subtle loading indicator (spinner or progress bar)
- Scroll to top of results smoothly
- Disable pagination controls temporarily

### Error Handling

#### Error States to Handle

1. **Network Error:** API request fails
2. **Invalid Query:** Malformed search parameters
3. **No Results:** Valid query but zero results
4. **Timeout Error:** Request takes too long
5. **Server Error:** 500-level response from API

#### Error Display Strategy

For each error type, provide:
- Clear error message explaining what went wrong
- Suggested actions (retry, modify search, clear filters)
- Visual indicator (icon, color)
- Retry button for network errors
- Link to help/support if needed

### Empty State Handling

When no results found:
- Display friendly "no results" message
- Show the search query user entered
- Suggest actions: modify search, clear filters, browse categories
- Display popular products or recommendations
- Keep search bar accessible to try new query

### Accessibility Requirements

#### Semantic HTML

Use appropriate elements:
- Main container: `<main>` element
- Sidebar: `<aside>` with proper label
- Results area: `<section>` with heading
- Pagination: `<nav>` with aria-label

#### ARIA Attributes

Add ARIA attributes for:
- Live region for result count updates
- Loading announcements
- Filter state changes
- Page navigation announcements

#### Keyboard Navigation

Ensure keyboard users can:
- Tab through all interactive elements in logical order
- Open/close mobile sidebar with keyboard
- Navigate pagination with arrow keys
- Access skip links to jump to results

### Performance Considerations

#### Rendering Optimization

Implement optimizations:
- Memoize static sections (header, sidebar structure)
- Virtualize product grid for large result sets (optional)
- Lazy load images below the fold
- Debounce filter changes before API calls
- Use React Query for automatic caching

#### Layout Shift Prevention

Prevent cumulative layout shift:
- Reserve space for loading skeletons
- Set explicit dimensions on containers
- Use aspect ratios for image placeholders
- Avoid dynamic content injection above fold

### Testing Requirements

Create tests for:
- Container renders with all child components
- Responsive layout changes at breakpoints
- Loading states display correctly
- Error states show appropriate messages
- URL parameters update local state
- Sidebar toggle works on mobile/tablet
- Accessibility attributes present and correct

---

## Task 50: Create Results Header

### Objective

Build the header section that appears above the search results, displaying the search query, result count, active filters summary, and sort controls.

### File Location

Create new file:
- Path: `/apps/webstore/src/components/search/ResultsHeader.tsx`

### Header Responsibilities

1. **Display Context:** Show what user searched for
2. **Show Metrics:** Display result count and pagination info
3. **Provide Controls:** Sort options and view toggles
4. **Filter Summary:** Show active filters with clear buttons
5. **Responsive Layout:** Adapt to different screen sizes

### Component Sections

#### Primary Header Row

Top row contains:
- Search query display (left side)
- Result count (left side, below or next to query)
- Sort dropdown (right side)
- View toggle buttons (right side, optional)

#### Secondary Header Row

Bottom row contains:
- Active filters display as chips/tags
- "Clear all filters" button (if any filters active)
- Applied filter count indicator

### Header Layout Structure

#### Desktop Layout (> 1024px)

Structure as single row with:
- Left section: Query + count (60% width)
- Right section: Sort + view controls (40% width)
- Active filters row below if any filters applied
- Align items to center vertically
- Padding: 1.5rem to 2rem

#### Tablet Layout (768px - 1024px)

Adjust to:
- Two-row layout
- Row 1: Query and count (full width)
- Row 2: Sort controls (left), view toggle (right)
- Active filters as separate third row
- Reduced padding: 1rem to 1.5rem

#### Mobile Layout (< 768px)

Stack vertically:
- Query display (full width)
- Result count below query
- Sort button (opens bottom sheet)
- Active filters list below
- Compact padding: 0.75rem to 1rem

### Query Display Section

#### Query Text Rendering

Display search query:
- Wrap query text in quotation marks visually
- Truncate very long queries with ellipsis
- Max length: 80 characters on desktop, 40 on mobile
- Font: Medium weight, slightly larger than body text
- Color: Accent or primary brand color

#### Query with Context

If search has context beyond query:
- Show: "Search results for [query]"
- If category filter: "Search results for [query] in [category]"
- If brand filter: "Search results for [query] by [brand]"
- Combine multiple contexts clearly

#### No Query State

When no explicit query (only filters):
- Display: "Filtered products" or "Search results"
- Emphasize the filters instead
- Show category name if browsing specific category

### Result Count Display

#### Count Formatting

Display result information:
- Total results: "234 products found"
- No results: "No products found"
- Single result: "1 product found"
- Large numbers: Format with commas (e.g., "1,234 products")
- Loading state: Show skeleton or "Searching..."

#### Pagination Context

Include page context:
- "Showing 1-24 of 234 products"
- "Results 25-48 of 234"
- Responsive: Shorter format on mobile ("1-24 of 234")

#### Update Animation

When count changes:
- Subtle fade or slide animation
- ARIA live region announcement for screen readers
- Highlight briefly to draw attention
- Duration: 200-300ms

### Sort Controls Section

#### Sort Dropdown

Implement sort selector:
- Dropdown or select menu
- Label: "Sort by:" or icon
- Default option visible (e.g., "Relevance")
- Opens menu with all sort options
- Selected option highlighted

#### Sort Options

Provide sort choices:
- Relevance (default for search queries)
- Price: Low to High
- Price: High to Low
- Name: A to Z
- Customer Rating
- Newest First
- Best Selling (if data available)

#### Sort State Management

Handle sort changes:
- Update URL parameter immediately
- Trigger new API call
- Show loading indicator on results
- Maintain scroll position
- Announce change to screen readers

#### Mobile Sort Button

On mobile devices:
- Show button: "Sort" with icon
- Open bottom sheet or modal
- Display sort options as large tap targets
- Include "Apply" and "Cancel" buttons
- Close sheet after selection

### View Toggle Controls (Optional)

#### View Modes

If implementing multiple views:
- Grid view (default): 2-4 columns
- List view: Single column with more details
- Compact view: Smaller cards, more per row

#### Toggle Buttons

Create view toggle:
- Icon buttons for each view type
- Active view highlighted
- Tooltip on hover explaining view
- Position next to sort controls
- Hide on mobile if not essential

### Active Filters Display

#### Filter Chips

Display active filters as chips:
- Each filter as removable tag
- Format: "[Filter Type]: [Value]"
- Close/remove button on each chip
- Color coding by filter type (optional)
- Max visible: 5-6, then "+X more" indicator

#### Chip Behavior

Make chips interactive:
- Click X to remove individual filter
- Hover highlights chip
- Keyboard accessible (focusable, Enter to remove)
- Animate removal (fade out)
- Update URL and trigger new search

#### Clear All Button

Add clear all functionality:
- Button: "Clear all filters"
- Only visible when filters active
- Position at end of filter chips
- Removes all filters at once
- Confirm if many filters active (optional)

### Responsive Behavior

#### Mobile Optimization

Adjust for mobile:
- Stack elements vertically
- Increase touch target sizes (min 44x44px)
- Hide less important information
- Use icons with labels
- Collapsible sections if many filters

#### Tablet Optimization

Adjust for tablet:
- Two-column layout for controls
- Maintain comfortable spacing
- Ensure text remains readable
- Balance horizontal and vertical space

### Loading States

#### Initial Load

While first results load:
- Show skeleton for query text
- Skeleton for count
- Disabled sort dropdown
- No active filters displayed

#### Filter Update Load

When filters change:
- Keep query visible
- Show loading spinner on count
- Disable sort temporarily
- Keep filter chips visible

### Empty States

#### No Results

When search returns nothing:
- Keep query display visible
- Show "0 products found"
- Suggestion text: "Try different keywords or filters"
- Keep sort hidden or disabled
- Show active filters to help user identify issue

### Accessibility Requirements

#### Screen Reader Support

Implement ARIA for:
- Results count as live region (polite)
- Sort controls with label
- Active filters list with role
- Each filter chip with remove button label
- Sort change announcements

#### Keyboard Navigation

Enable keyboard control:
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys in sort dropdown
- Focus management after chip removal
- Escape to close sort dropdown

### Animation and Transitions

Apply subtle animations:
- Count update: fade transition (200ms)
- Filter chip removal: slide and fade (250ms)
- Sort dropdown open: slide down (150ms)
- New results loading: pulse or spinner
- Avoid distracting or excessive motion

### Testing Requirements

Create tests for:
- Header renders with query and count
- Sort options display and trigger API calls
- Filter chips render for active filters
- Remove filter chip updates URL and state
- Clear all removes all filters
- Responsive layouts at all breakpoints
- Loading states display correctly
- Accessibility attributes present

---

## Task 51: Create Results Count

### Objective

Build a dedicated component for displaying the product result count with proper formatting, real-time updates, and contextual information about the current page and total results.

### File Location

Create new file:
- Path: `/apps/webstore/src/components/search/ResultsCount.tsx`

### Component Purpose

This component is specifically focused on displaying numerical information about search results, separate from the query display or other header elements. While it may be integrated into the Results Header (Task 50), it's designed as a reusable, standalone component.

### Count Display Variations

#### Simple Count

Basic result count:
- Format: "[X] products found"
- Singular handling: "1 product found"
- Zero state: "No products found"
- Large numbers: "1,234 products found" (with commas)

#### Count with Pagination

Include page context:
- Format: "Showing [start]-[end] of [total] products"
- Example: "Showing 1-24 of 234 products"
- Last page: "Showing 209-234 of 234 products"
- Single page: Show simple count

#### Count with Category Context

When filtered by category:
- Format: "[X] products in [Category Name]"
- Example: "156 products in Electronics"
- With subcategory: "45 products in Laptops"

#### Count with Filter Context

When filters applied:
- Format: "[X] products match your filters"
- Or: "[X] results (filtered from [total] total)"
- Example: "45 products match your filters"

### Number Formatting

#### Localization Support

Format numbers appropriately:
- Use locale-specific number formatting
- Commas for English (1,234)
- Periods for some European locales (1.234)
- Respect user's locale settings
- Use browser Intl.NumberFormat API

#### Large Number Handling

For very large counts:
- Thousands: Display full number with separator (1,234)
- Tens of thousands: Consider abbreviation (12.5K) or full
- Hundreds of thousands: Abbreviate if space limited (150K)
- Consistent format across application

### Real-Time Updates

#### Update Triggers

Count should update when:
- Search query changes
- Any filter applied or removed
- Sort order changes
- Category navigation
- Price range adjustment
- Brand selection

#### Update Animation

Animate count changes:
- Fade out old count (100ms)
- Update number
- Fade in new count (100ms)
- Total duration: 200ms
- Smooth, non-jarring transition

#### Loading State Animation

While fetching new results:
- Show skeleton loader (pulsing gray bar)
- Or keep previous count with loading indicator
- Or show "Searching..." text
- Duration matches API response time

### Layout and Positioning

#### Within Header Component

Position relative to other elements:
- Desktop: Next to or below search query
- Tablet: Below query, full width
- Mobile: Separate line, center or left-aligned
- Spacing: 0.5rem to 1rem from adjacent elements

#### Standalone Usage

If used independently:
- Self-contained with proper margins
- Responsive to container width
- Works in different contexts (sidebar, footer, etc.)

### Styling Specifications

#### Typography

Text styling:
- Font size: Slightly smaller than main headings (0.875rem - 1rem)
- Font weight: Normal (400) or medium (500)
- Color: Secondary text color (gray-600 to gray-700)
- Line height: Comfortable for readability

#### Emphasis on Numbers

Highlight the count:
- Make number bold or different color
- Keep surrounding text normal weight
- Or use accent color for entire count
- Ensure sufficient contrast

#### Responsive Text

Adjust for screen size:
- Desktop: Full text with context
- Tablet: Abbreviated if needed
- Mobile: Minimal text, focus on number

### State Variations

#### Loading State

Display while fetching:
- Option 1: Skeleton placeholder matching text width
- Option 2: Spinner icon with "Loading..." text
- Option 3: Previous count with subtle loading indicator
- Choose based on design system

#### Error State

If count fetch fails:
- Don't show count
- Or show fallback text: "Results found"
- Log error for debugging
- Don't disrupt user experience

#### Zero Results State

When no products match:
- Clear message: "No products found"
- Different styling (warning color optional)
- Accompanied by suggestions elsewhere
- Keep count component visible

### Accessibility Requirements

#### ARIA Live Region

Implement dynamic announcements:
- Use aria-live="polite" for count updates
- Screen reader announces: "234 products found"
- Don't interrupt user's current activity
- Avoid announcing during rapid changes

#### Semantic HTML

Use appropriate markup:
- Wrap in `<p>` or `<span>` element
- Add role="status" for live updates
- Include visible text (no hidden counts)

### Performance Considerations

#### Render Optimization

Optimize component rendering:
- Memoize component if used in frequently updating parent
- Avoid unnecessary re-renders
- Only update when count actually changes
- Use React.memo with proper comparison

#### Format Caching

Cache formatted strings:
- Format number once, reuse until count changes
- Memoize formatting function
- Reduce computation on every render

### Integration Points

#### With Results Header

When integrated in header:
- Pass count as prop
- Handle loading state from parent
- Align with other header elements
- Responsive behavior coordinated

#### With Pagination

Coordinate with pagination component:
- Calculate "showing X-Y of Z" from pagination data
- Pass page number and items per page
- Handle last page correctly
- Update when page changes

#### With API Response

Extract from API data:
- Total count from response metadata
- Current page results count
- Handle missing count gracefully
- Validate count is number

### Internationalization (i18n)

#### Translatable Strings

Make text translatable:
- "products found" → translatable key
- "product found" (singular) → separate key
- "Showing X-Y of Z products" → dynamic translation
- "No products found" → translatable key

#### Pluralization Rules

Handle plural forms:
- English: "1 product" vs "2 products"
- Other languages: Different plural rules
- Use i18n library's pluralization
- Test with multiple locales

### Testing Requirements

Create tests for:
- Count displays correct number
- Singular vs plural text
- Number formatting with locales
- Loading state renders skeleton
- Zero results shows appropriate message
- Pagination context calculates correctly
- Updates when props change
- Accessibility attributes present
- ARIA live region announces changes

---

## Task 52: Create Results Grid

### Objective

Build the responsive grid layout that displays search results as product cards, adapting to different screen sizes and handling various states (loading, empty, error).

### File Location

Create new file:
- Path: `/apps/webstore/src/components/search/ResultsGrid.tsx`

### Grid Responsibilities

1. **Layout Products:** Arrange product cards in responsive grid
2. **Handle States:** Display loading, empty, and error states
3. **Optimize Performance:** Lazy load images and virtualize if needed
4. **Maintain Consistency:** Ensure uniform card sizes
5. **Provide Flexibility:** Support different grid densities

### Grid Layout Structure

#### Responsive Column System

Define column counts by breakpoint:
- **Mobile (< 640px):** 1 column (full width)
- **Large Mobile (640px - 768px):** 2 columns
- **Tablet (768px - 1024px):** 2-3 columns
- **Desktop (1024px - 1280px):** 3 columns
- **Large Desktop (> 1280px):** 4 columns
- **Extra Large (> 1536px):** 4-5 columns (optional)

#### Grid Configuration

Set up CSS Grid properties:
- Grid template columns: Use responsive values
- Gap: 1rem to 1.5rem between cards
- Auto-rows: Ensure equal heights
- Align items: Stretch for uniform card heights
- Justify items: Center or stretch based on design

### Container Setup

#### Outer Wrapper

Create main grid container:
- Use CSS Grid or Flexbox with wrapping
- Full width within parent container
- Padding: Match overall page padding
- Background: Transparent or subtle background
- Min-height: Prevent layout shift

#### Grid Modifiers

Support grid variations:
- Dense grid: More columns, smaller cards
- Comfortable grid: Standard spacing
- Spacious grid: Fewer columns, larger cards
- List view: Single column with horizontal cards (optional)

### Product Card Integration

#### Import and Reuse

Reuse ProductCard from SubPhase-03:
- Import existing ProductCard component
- Pass product data as props
- Maintain consistent styling
- Handle card interactions (click, hover)

#### Data Mapping

Map API response to cards:
- Iterate through products array
- Extract product data for each card
- Pass required props (id, name, price, image, etc.)
- Include key prop for React reconciliation

#### Card Props Structure

Ensure cards receive:
- Product ID
- Product name
- Primary image URL
- Price (current and original if on sale)
- Rating and review count
- Stock status
- Quick action buttons (add to cart, wishlist)
- Link to product detail page

### Loading State

#### Skeleton Grid

Display while results load:
- Render skeleton cards matching expected count
- Default: 12 or 24 skeleton cards (one page)
- Match grid layout of actual results
- Same column count as normal view
- Pulsing animation on skeletons

#### Skeleton Card Design

Create skeleton card structure:
- Image placeholder: Aspect ratio matching product images
- Title placeholder: 2-3 lines of gray bars
- Price placeholder: Single line
- Rating placeholder: Star icons or bar
- Button placeholders: 1-2 button shapes
- Animate with shimmer or pulse effect

#### Progressive Loading

Optional progressive enhancement:
- Load first row of results immediately
- Show loading for remaining rows
- Reduce perceived loading time
- Prioritize above-the-fold content

### Empty State

#### No Results Display

When search returns zero results:
- Replace grid with centered empty state message
- Icon: Magnifying glass with X or empty box
- Primary message: "No products found"
- Secondary message: "Try adjusting your search or filters"
- Suggestions: Popular categories or products

#### Empty State Actions

Provide user actions:
- Clear all filters button
- "Browse all products" link
- Search suggestions based on query
- Link to customer support
- Popular categories list

#### Empty State Layout

Center empty state:
- Full width of grid area
- Vertically centered if space available
- Horizontal centering with auto margins
- Adequate padding around content
- Responsive text sizing

### Error State

#### Error Display

When API call fails:
- Replace grid with error message
- Icon: Alert or warning symbol
- Primary message: "We couldn't load products"
- Secondary message: Explain possible issue
- Technical info: Minimal (for debugging only)

#### Error Actions

Provide recovery options:
- "Try again" button to retry request
- "Go back" or "Return home" link
- Report issue link (optional)
- Show cached results if available
- Contact support information

### Grid Behavior

#### Equal Height Cards

Ensure consistent card heights:
- Use CSS Grid auto-rows
- Or Flexbox with stretch
- All cards in same row have same height
- Cards contain their content properly
- Avoid breaking layout with overflow

#### Gap and Spacing

Maintain consistent spacing:
- Gap between cards: 1rem on mobile, 1.5rem on desktop
- Margin around grid: Match page margins
- Padding within cards: Defined in ProductCard component
- Responsive gaps: Smaller on mobile

#### Grid Alignment

Align grid properly:
- Center grid if max-width applied
- Left-align within available space
- Handle partial rows gracefully
- Last row: Left-align or distribute evenly

### Scroll Behavior

#### Scroll Position Management

Handle scroll on updates:
- Reset scroll to top when new search performed
- Maintain scroll position on filter updates (debatable)
- Smooth scroll to top on page changes
- Avoid jarring scroll jumps

#### Scroll to Load (Optional)

If implementing infinite scroll:
- Detect when user scrolls near bottom
- Trigger loading of next page
- Append new results to grid
- Show loading indicator at bottom
- Handle end of results gracefully

### Performance Optimization

#### Image Lazy Loading

Optimize image loading:
- Use native lazy loading attribute
- Or implement intersection observer
- Load images as they enter viewport
- Prioritize above-the-fold images
- Use blur-up technique (optional)

#### Virtualization (Optional)

For very large result sets:
- Consider virtual scrolling library
- Only render visible cards
- Dramatically improves performance
- Requires fixed card heights
- More complex implementation

#### Memoization

Optimize rendering:
- Memoize grid container
- Memoize product cards
- Only re-render on data changes
- Use React.memo with proper comparison
- Profile performance in dev tools

### Responsive Behavior

#### Mobile Adaptations

Optimize for mobile:
- Larger touch targets on cards
- Simplified card information
- Single column for better readability
- Consider list view on small screens
- Reduce decorative elements

#### Tablet Adaptations

Adjust for tablet:
- 2-3 column layout
- Balance information density
- Comfortable touch targets
- Landscape vs portrait orientations
- Utilize available screen real estate

### Accessibility Requirements

#### Keyboard Navigation

Enable keyboard access:
- All cards focusable with Tab
- Logical tab order (left to right, top to bottom)
- Enter/Space to activate card
- Skip links to jump sections

#### Screen Reader Support

Implement ARIA:
- Grid role or list role
- Item count announcement
- Loading state announced
- Empty state clearly communicated
- Card content properly labeled

#### Focus Management

Handle focus correctly:
- Visible focus indicators
- Maintain focus on page changes
- Return focus after modal interactions
- Skip navigation for power users

### Animation and Transitions

#### Grid Transitions

Animate grid changes:
- Fade in new results (200-300ms)
- Stagger card entrance (optional)
- Smooth layout transitions
- Avoid excessive motion
- Respect prefers-reduced-motion

#### Card Hover Effects

Implement hover states:
- Subtle scale or lift on hover
- Shadow intensifies
- Quick action buttons appear
- Smooth transition (150-200ms)
- Clear affordance for interaction

### Testing Requirements

Create tests for:
- Grid renders correct number of columns at each breakpoint
- Product cards display with proper data
- Loading state shows skeleton cards
- Empty state displays message and actions
- Error state shows error message and retry
- Cards maintain equal heights
- Lazy loading triggers correctly
- Responsive layout changes work
- Keyboard navigation functional
- Accessibility attributes present

---

## Task 53: Create Results Product Card

### Objective

Adapt the existing ProductCard component from SubPhase-03 for use in search results, or create a search-specific variant that displays essential product information in a compact, scannable format.

### File Location

Reference existing:
- Path: `/apps/webstore/src/components/products/ProductCard.tsx` (from SubPhase-03)

Create search variant (if needed):
- Path: `/apps/webstore/src/components/search/SearchProductCard.tsx`

### Decision: Reuse vs New Component

#### When to Reuse Existing

Reuse SubPhase-03 ProductCard if:
- Design is consistent across catalog and search
- All needed features already exist
- No performance issues
- Same interaction patterns
- Maintains brand consistency

#### When to Create Variant

Create search-specific card if:
- Need different layout for search context
- Want to emphasize different information
- Performance optimization required
- Different interaction patterns needed
- Search relevance score display needed

### Search Product Card Requirements

#### Essential Information Display

Display critical product data:
- Product name (truncated if too long)
- Primary product image
- Current price
- Original price if on sale (with strikethrough)
- Discount percentage (if applicable)
- Average rating (stars)
- Number of reviews
- Stock status indicator

#### Secondary Information

Include additional context:
- Brand or vendor name
- Key product features or tags
- Shipping information (free shipping badge)
- Availability (in stock, low stock, out of stock)
- Relevance score or "Best match" badge
- New arrival badge

#### Visual Hierarchy

Prioritize information display:
1. Product image (largest element)
2. Product name (prominent)
3. Price (very visible)
4. Rating and reviews (supporting info)
5. Stock status (if critical)
6. Other badges and tags

### Card Layout Structure

#### Vertical Card Layout (Recommended)

Structure from top to bottom:
- Image container (aspect ratio 1:1 or 4:3)
- Product name (2 lines max, truncated)
- Rating and review count
- Price section (current and original)
- Action buttons (add to cart, wishlist)

#### Horizontal Card Layout (List View)

If supporting list view:
- Image on left (smaller, square)
- Content on right (name, price, rating)
- Action buttons far right
- Better for mobile or detailed comparison

### Image Handling

#### Image Container

Set up image section:
- Fixed aspect ratio (prevents layout shift)
- Responsive width (100% of card width)
- Height calculated from aspect ratio
- Background color while loading
- Rounded corners matching card style

#### Image Optimization

Implement image best practices:
- Use Next.js Image component for optimization
- Lazy load images below fold
- Blur placeholder or color placeholder
- Srcset for responsive images
- Alt text from product name
- Handle missing images gracefully

#### Image Interactions

Add image interactivity:
- Hover: Slight zoom or second image preview
- Click: Navigate to product detail page
- Loading state: Skeleton or blur
- Error state: Fallback placeholder image

### Product Name Display

#### Text Handling

Display product name:
- Font size: 0.875rem to 1rem
- Font weight: Medium (500) or semi-bold (600)
- Line clamp: 2 lines maximum
- Overflow: Ellipsis on truncation
- Letter spacing: Tight to normal

#### Name Interactions

Make name interactive:
- Clickable to product page
- Hover underline or color change
- Tooltip showing full name if truncated
- Accessible label for screen readers

### Price Display

#### Price Formatting

Format prices correctly:
- Currency symbol appropriate to locale
- Two decimal places for cents
- Thousands separator for large amounts
- Right-align or left-align consistently
- Font size larger than surrounding text

#### Sale Price Display

When product on sale:
- Current price: Prominent, colored (e.g., red/green)
- Original price: Strikethrough, gray, smaller
- Discount badge: Percentage off in badge
- Layout: Current price large, original smaller alongside

#### Price Range

For variable products:
- Format: "$19.99 - $49.99"
- Or: "From $19.99"
- Clear indication of range
- Consistent with pricing strategy

### Rating and Reviews

#### Star Rating Display

Show rating visually:
- 5-star system (filled/empty stars)
- Filled stars for rating value
- Half-star support for .5 ratings
- Color: Gold/yellow for filled stars
- Size: Small to medium (0.75rem - 1rem)

#### Review Count

Display number of reviews:
- Format: "(234 reviews)" or "(234)"
- Link to reviews section on product page
- Smaller, secondary text color
- Only show if reviews exist
- Hide if zero reviews (or show "No reviews yet")

### Stock Status Indicator

#### Status Badges

Display stock information:
- In Stock: Green badge or checkmark
- Low Stock: Orange/yellow badge, "Only X left"
- Out of Stock: Red badge or gray text
- Preorder: Blue badge, "Available [date]"
- Position: Near price or bottom of card

#### Status Behavior

Handle status dynamically:
- Update in real-time if inventory changes
- Disable add to cart if out of stock
- Show notification options if unavailable
- Clear visual distinction between states

### Action Buttons

#### Add to Cart Button

Primary action button:
- Text: "Add to Cart" or cart icon
- Color: Primary brand color (prominent)
- Position: Bottom of card or on hover
- Size: Full width or standard button
- Disabled if out of stock

#### Quick Actions

Secondary actions:
- Wishlist/favorite icon button
- Quick view icon/button
- Compare button (if feature exists)
- Share button (optional)
- Position: Top corner or bottom row

#### Button Interactions

Handle button clicks:
- Add to cart: Add product, show confirmation
- Wishlist: Toggle favorite state
- Quick view: Open modal with product details
- Prevent navigation to product page
- Show loading state during actions

### Badges and Tags

#### Badge Types

Display relevant badges:
- Sale badge: Red "SALE" or percentage off
- New arrival: "NEW" in accent color
- Best seller: "Bestseller" badge
- Low stock: "Low Stock" warning
- Free shipping: "Free Ship" indicator

#### Badge Positioning

Place badges strategically:
- Top-left corner of image (most prominent)
- Multiple badges: Stack or side by side
- Max 2-3 badges to avoid clutter
- Z-index above image
- Responsive sizing

### Hover Effects

#### Card Hover State

On mouse hover:
- Subtle shadow increase or lift effect
- Border color change (if using borders)
- Transform scale (1.02) slight zoom
- Transition duration: 200-300ms
- Show hidden elements (quick actions)

#### Button Reveal

Show buttons on hover:
- Quick actions fade in
- Add to cart becomes prominent
- Smooth opacity transition
- Maintain card layout (no shift)
- Touch devices: Always show buttons

### Responsive Behavior

#### Mobile Optimizations

Adapt for mobile:
- Simpler layout, less information
- Larger touch targets for buttons
- No hover states (use always-visible buttons)
- Single column in grid
- Larger text for readability

#### Tablet Optimizations

Adjust for tablet:
- Balance between mobile and desktop
- 2-3 columns in grid
- Moderate information density
- Support both touch and hover
- Comfortable spacing

### Accessibility Requirements

#### Semantic HTML

Use proper elements:
- Card wrapper: `<article>` element
- Product link: `<a>` wrapping card content
- Buttons: `<button>` elements
- Image: `<img>` with alt text
- Headings: Product name in `<h3>` or `<h4>`

#### ARIA Attributes

Add necessary ARIA:
- Card: aria-label with product name and price
- Buttons: aria-label for icon-only buttons
- Rating: aria-label describing rating value
- Stock status: aria-label for status indicator

#### Keyboard Support

Enable keyboard access:
- Entire card focusable (single tab stop)
- Enter/Space opens product page
- Buttons separately focusable
- Visible focus indicator
- Logical tab order

### Performance Considerations

#### Component Memoization

Optimize rendering:
- Memoize card component with React.memo
- Compare props carefully
- Only re-render when product data changes
- Avoid passing new object references

#### Image Loading

Optimize images:
- Lazy load below the fold
- Use appropriate image sizes
- Compress images properly
- Cache images effectively
- Preload critical images

### Testing Requirements

Create tests for:
- Card renders with product data
- Image displays correctly
- Product name truncates when too long
- Price formats correctly
- Sale price displays with strikethrough
- Rating displays correct stars
- Add to cart button works
- Wishlist toggle functions
- Hover effects apply
- Out of stock state disables buttons
- Badges display correctly
- Responsive layout at breakpoints
- Accessibility attributes present
- Keyboard navigation works

---

## Task 54: Create Results Sidebar

### Objective

Build the sidebar component that houses filter controls, allowing users to refine search results by category, price, brand, rating, and other attributes.

### File Location

Create new file:
- Path: `/apps/webstore/src/components/search/ResultsSidebar.tsx`

### Sidebar Responsibilities

1. **Display Filters:** Show all available filter options
2. **Manage State:** Track selected filters
3. **Update URL:** Sync filter state with URL parameters
4. **Show Active Filters:** Display currently applied filters
5. **Responsive Behavior:** Adapt for mobile as drawer/sheet

### Sidebar Layout Structure

#### Desktop Layout (> 1024px)

Fixed sidebar structure:
- Width: 250px to 280px (fixed or fluid)
- Position: Left side of page (or right based on design)
- Sticky positioning: Stick to top when scrolling
- Max height: Viewport height minus header
- Overflow: Scroll if content exceeds height

#### Tablet Layout (768px - 1024px)

Collapsible sidebar:
- Default: Hidden or collapsed
- Toggle button: "Filters" button to open
- Slide-in drawer from left
- Overlay background when open
- Close button inside drawer

#### Mobile Layout (< 768px)

Bottom sheet or full-screen modal:
- Triggered by "Filters" button
- Slides up from bottom or full-screen
- Header with title and close button
- Scrollable content area
- "Apply Filters" button at bottom

### Sidebar Sections

#### Section 1: Active Filters

Display applied filters:
- Title: "Active Filters" or "Applied"
- List of active filter chips
- Each chip removable
- "Clear all" button
- Count of active filters in header

#### Section 2: Categories

Category filter options:
- Collapsible section
- List of categories with counts
- Hierarchical if subcategories exist
- Checkbox or radio selection
- "Show more" if many categories

#### Section 3: Price Range

Price filter controls:
- Collapsible section
- Min and max input fields
- Slider for range selection (optional)
- Preset price ranges (optional)
- "Apply" button or auto-update

#### Section 4: Brand

Brand selection:
- Collapsible section
- Checkbox list of brands
- Search box if many brands
- Show product count per brand
- "Show more" to expand list

#### Section 5: Rating

Rating filter:
- Collapsible section
- Star rating options (4+, 3+, 2+, 1+)
- Radio buttons or clickable stars
- Show product count per rating range
- Visual star representation

#### Section 6: Availability

Stock status filter:
- Collapsible section
- In stock checkbox
- Include out of stock checkbox
- Free shipping checkbox
- On sale checkbox

#### Section 7: Additional Filters

Custom filters based on product type:
- Size options (clothing)
- Color options (visual swatches)
- Material or features
- Condition (new, used, refurbished)
- Collapsible sections for each

### Filter Section Component Structure

Each filter section should have:
- Section header with title
- Expand/collapse icon
- Content area with filter controls
- Product count update when filters change
- Loading state during filter application

### Active Filters Display

#### Filter Chips

Display active filters within sidebar:
- Chip format: "[Type]: [Value]"
- Remove X button on each chip
- Color coded by type (optional)
- Wrap to multiple lines if many
- Max height with scroll

#### Clear All Functionality

Clear all filters at once:
- Button: "Clear All Filters"
- Position: Top or bottom of active filters
- Confirmation if many filters (optional)
- Updates URL and triggers new search
- Resets all filter sections

### Filter Controls

#### Checkbox Filters

For multi-select filters:
- Standard checkbox with label
- Indeterminate state for parent categories
- Product count in parentheses
- Change triggers URL update
- Debounce if auto-applying

#### Radio Button Filters

For single-select filters:
- Radio group with labels
- One option selected at a time
- Update immediately on selection
- Clear option to deselect

#### Range Slider

For price or numeric ranges:
- Dual thumb slider
- Min and max input fields
- Real-time preview (optional)
- "Apply" button to commit
- Reset to default range option

#### Search Input

For searchable filters (brands):
- Input field at top of filter section
- Live filtering of options as user types
- Clear button to reset search
- Highlight matched text
- Show "No results" if no matches

### Collapsible Sections

#### Section Toggle

Each filter section can collapse:
- Expand/collapse icon (chevron)
- Click header to toggle
- Smooth animation (200-300ms)
- Remember state in local storage (optional)
- Default state: Popular sections expanded

#### Animation

Smooth expand/collapse:
- Height transition with auto
- Fade content in/out
- Rotate chevron icon
- Avoid layout shift
- Accessible with keyboard (Enter/Space)

### Filter Application Strategy

#### Auto-Apply

Filters update immediately:
- Change triggers URL update
- API call fires on change
- Debounce rapid changes (300-500ms)
- Show loading indicator on results
- Best for single-select filters

#### Apply Button

Filters staged then applied:
- Change updates local state
- "Apply Filters" button at bottom
- Click button to update URL and fetch
- "Reset" or "Cancel" button to revert
- Best for multiple filter changes

### URL Parameter Sync

#### Read from URL

On component mount:
- Read all filter parameters from URL
- Parse parameter values
- Set initial filter state
- Display active filters
- Trigger API call if needed

#### Update URL

When filters change:
- Update relevant URL parameters
- Remove parameter if filter cleared
- Maintain other parameters (query, sort)
- Use router.push or replaceState
- Preserve browsing history

### Responsive Behavior

#### Mobile Drawer/Sheet

Implement mobile filter panel:
- Trigger: "Filters" button in header or floating
- Slide up from bottom or side
- Full-screen or partial height
- Header: Title + close button
- Footer: Apply and Clear buttons
- Scrollable content between header and footer

#### Drawer Controls

Control drawer behavior:
- Open/close animation (300ms)
- Backdrop overlay (semi-transparent black)
- Click backdrop to close
- Swipe down to close (optional)
- Trap focus inside drawer
- Escape key to close

#### Filter Count Badge

Show active filter count:
- Badge on "Filters" button
- Number of active filters
- Prominent color (brand accent)
- Position: Top-right of button
- Update dynamically

### Loading States

#### Initial Load

While filters load:
- Show skeleton for filter sections
- Placeholder for categories and brands
- Disable interaction
- Match structure of actual filters

#### Filter Update Load

When applying filters:
- Disable filter controls temporarily
- Show loading spinner in section
- Or loading overlay on entire sidebar
- Results area shows loading
- Re-enable after response

### Empty States

#### No Filter Options

If no filters available:
- Hide empty sections
- Show message: "No filters available"
- Explain why (category has no filters)
- Provide alternative actions

#### No Results from Filters

If filters exclude all products:
- Keep filters visible
- Highlight potential issue
- Suggest removing some filters
- Show count dropping to zero

### Accessibility Requirements

#### Keyboard Navigation

Enable keyboard control:
- Tab through all filter controls
- Enter/Space to toggle checkboxes
- Arrow keys for radio groups
- Expand/collapse with Enter/Space
- Focus management in drawer

#### Screen Reader Support

Implement ARIA:
- Role="complementary" for sidebar
- Section headings as `<h3>` or `<h4>`
- Checkbox labels associated
- Live region announcing filter changes
- Drawer announced when opened

#### Focus Management

Handle focus properly:
- Trap focus in mobile drawer
- Return focus to trigger when closed
- Visible focus indicators
- Skip links available
- Logical tab order

### Performance Considerations

#### Filter Option Virtualization

For long filter lists:
- Virtualize brand or category lists
- Only render visible options
- Maintain scroll position
- Improve performance with 100+ options

#### Debouncing

Debounce filter changes:
- Wait 300-500ms after last change
- Prevent excessive API calls
- Show pending state
- Cancel previous requests
- Apply batched changes

### Testing Requirements

Create tests for:
- Sidebar renders with all filter sections
- Filter sections expand and collapse
- Checkbox filters update state and URL
- Price range updates correctly
- Active filters display as chips
- Remove filter chip works
- Clear all removes all filters
- Mobile drawer opens and closes
- Filter changes trigger API calls
- URL parameters sync correctly
- Keyboard navigation works
- Screen reader announcements
- Loading states display
- Responsive layouts at breakpoints

---

## Task 55: Create Search Query Param Handler

### Objective

Build a utility module and React hook for managing URL query parameters related to search, filters, sorting, and pagination. This ensures consistent state synchronization between the URL and component state.

### File Locations

Create new files:
- Path: `/apps/webstore/src/lib/search/searchParams.ts` (utility functions)
- Path: `/apps/webstore/src/hooks/useSearchParams.ts` (React hook)

### Purpose and Scope

#### URL as Source of Truth

URL parameters serve as the single source of truth for:
- Search query text
- Selected categories
- Applied filters (price, brand, rating, etc.)
- Sort order
- Current page number
- Items per page

#### Benefits of URL State

URL-based state provides:
- Bookmarkable search results
- Shareable search links
- Browser back/forward navigation
- Deep linking support
- SSR-friendly state management
- Analytics tracking capability

### URL Structure Design

#### Parameter Naming Convention

Define consistent parameter names:
- `q`: Search query string
- `category`: Category ID or slug
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `brands`: Brand filter (can be array)
- `rating`: Minimum rating
- `inStock`: Boolean for stock filter
- `onSale`: Boolean for sale items
- `sort`: Sort order
- `page`: Current page number
- `limit`: Results per page

#### Parameter Value Formats

Format values appropriately:
- Strings: URL-encoded text
- Numbers: Plain numeric values
- Booleans: "true" or "false" strings
- Arrays: Comma-separated or repeated params
- Dates: ISO format (if needed)

#### Example URLs

```
/search?q=laptop&category=electronics&minPrice=500&maxPrice=2000&brands=dell,hp&rating=4&sort=price_asc&page=1&limit=24

/search?q=laptop&brands=dell&brands=hp&inStock=true&page=2

/search?category=electronics&sort=newest&page=1
```

### Utility Functions

#### Parse URL Parameters

Create function to extract params:
- Function name: `parseSearchParams`
- Input: URLSearchParams object or URL string
- Output: Typed object with all search parameters
- Handle missing parameters with defaults
- Parse types correctly (numbers, booleans)
- Validate parameter values

#### Build URL Parameters

Create function to construct params:
- Function name: `buildSearchParams`
- Input: Search state object
- Output: URLSearchParams object or query string
- Omit default values (reduce URL length)
- Encode special characters
- Handle array parameters
- Sort parameters for consistency (optional)

#### Merge Parameters

Create function to update params:
- Function name: `mergeSearchParams`
- Input: Current params + updates
- Output: New merged params object
- Preserve existing parameters
- Override with new values
- Remove parameters with null/undefined
- Handle page reset when filters change

#### Validate Parameters

Create validation function:
- Function name: `validateSearchParams`
- Input: Raw parameter object
- Output: Validated and sanitized object
- Check parameter types
- Validate ranges (price, rating)
- Sanitize query string
- Remove invalid parameters

### React Hook: useSearchParams

#### Hook Purpose

Create custom hook that:
- Reads URL parameters on mount
- Provides current search state
- Updates URL when state changes
- Syncs with browser history
- Handles navigation events

#### Hook API

Define hook interface:
- Return value: Object with state and updater functions
- `searchParams`: Current search parameters object
- `updateParam`: Function to update single parameter
- `updateParams`: Function to update multiple parameters
- `clearParams`: Function to clear all or specific parameters
- `resetFilters`: Function to reset filters only

#### Implementation Details

Hook should:
- Use Next.js `useSearchParams` and `useRouter`
- Read params on mount and URL changes
- Provide memoized state object
- Provide stable updater functions
- Handle SSR gracefully (no window access)

### State Synchronization

#### Component State to URL

When component state changes:
- Call update function with new state
- Construct new URL parameters
- Update URL using router.push or router.replace
- Choose push vs replace based on context
- Preserve unrelated URL parts

#### URL to Component State

When URL changes (back/forward):
- Listen for URL change events
- Parse new URL parameters
- Update component state
- Trigger effects (API calls, UI updates)
- Prevent infinite update loops

### Update Strategies

#### Push vs Replace

Decide when to use each:
- **Push (add to history):** Initial search, page changes, sort changes
- **Replace (replace current):** Filter updates, rapid changes, intermediate states
- Consider user expectation for back button behavior
- Balance history pollution vs navigation ability

#### Debouncing Updates

Debounce rapid changes:
- Wait for user to finish typing
- Batch multiple filter changes
- 300-500ms delay after last change
- Cancel pending updates on new change
- Show pending state in UI

### Default Values

#### Define Defaults

Set sensible defaults:
- Query: Empty string
- Sort: "relevance" or "popular"
- Page: 1
- Limit: 24 or 36
- Filters: None applied
- Category: All categories

#### Apply Defaults

Handle missing parameters:
- Don't include defaults in URL (cleaner URLs)
- Apply defaults when parsing parameters
- Reset to defaults when clearing
- Document defaults in code comments

### Array Parameters

#### Multiple Values

Handle array parameters:
- Brands: Allow multiple selections
- Colors: Allow multiple selections
- Sizes: Allow multiple selections

#### Format Options

Choose array format:
- **Option 1:** Comma-separated: `brands=dell,hp,lenovo`
- **Option 2:** Repeated params: `brands=dell&brands=hp&brands=lenovo`
- **Option 3:** JSON array (encoded): `brands=%5B%22dell%22%2C%22hp%22%5D`

Recommendation: Use comma-separated for simplicity

### Special Parameter Handling

#### Query String

Handle search query:
- Trim whitespace
- Encode special characters
- Preserve spaces (use + or %20)
- Limit length (prevent abuse)
- Sanitize for XSS protection

#### Price Range

Handle price parameters:
- Validate numbers
- Ensure min < max
- Enforce reasonable ranges
- Round to appropriate precision
- Handle currency formatting (client-side)

#### Page Parameter

Handle pagination:
- Validate page is positive integer
- Reset to 1 when filters change
- Handle out-of-range pages (404 or redirect)
- Update when results change

### Error Handling

#### Invalid Parameters

Handle malformed params:
- Ignore invalid parameters
- Log errors for debugging
- Use default values
- Don't break application
- Provide user feedback if critical

#### Type Coercion Errors

When type conversion fails:
- Return default value
- Log warning
- Continue gracefully
- Validate on server side too

### SSR Considerations

#### Server-Side Rendering

Handle SSR properly:
- Read params from request URL
- Pass to component as props
- Hydrate client state correctly
- Avoid useEffect dependency on mount
- Use Next.js searchParams prop

#### Hydration Issues

Prevent hydration mismatches:
- Ensure server and client render same initial state
- Don't access window during render
- Use useEffect for client-only logic
- Match param parsing logic exactly

### Testing Requirements

Create tests for:
- Parse URL parameters correctly
- Build URL from state object
- Merge parameters without losing existing
- Validate and sanitize parameters
- Hook reads params on mount
- Hook updates URL when state changes
- Handle array parameters correctly
- Apply default values when missing
- Reset page when filters change
- Debounce rapid updates
- Handle invalid parameters gracefully
- SSR compatibility
- Browser back/forward navigation

---

## Task 56: Create Search API Call

### Objective

Implement the API integration layer for searching products, including the API client function, React Query hook for data fetching, request/response type definitions, and error handling.

### File Locations

Create new files:
- Path: `/apps/webstore/src/lib/api/search.ts` (API client functions)
- Path: `/apps/webstore/src/hooks/useSearchProducts.ts` (React Query hook)
- Path: `/apps/webstore/src/types/search.ts` (TypeScript types)

### API Endpoint Specification

#### Endpoint Details

Define search API endpoint:
- **URL:** `/api/products/search`
- **Method:** GET
- **Authentication:** Optional (show personalized results if logged in)
- **Rate Limiting:** Implement reasonable limits
- **Cache Headers:** Short cache time (5-10 minutes)

#### Request Parameters

API accepts query parameters:
- `q`: Search query string
- `category`: Category filter
- `minPrice`, `maxPrice`: Price range
- `brands`: Array of brand filters
- `rating`: Minimum rating
- `inStock`: Boolean for stock filter
- `onSale`: Boolean for sale filter
- `sort`: Sort order
- `page`: Page number (1-indexed)
- `limit`: Results per page (default: 24)

### TypeScript Type Definitions

#### Search Request Type

Define request parameters type:
```
SearchRequestParams interface includes:
- q: string (optional)
- category: string (optional)
- minPrice: number (optional)
- maxPrice: number (optional)
- brands: string[] (optional)
- rating: number (optional)
- inStock: boolean (optional)
- onSale: boolean (optional)
- sort: SortOption (enum or union type)
- page: number
- limit: number
```

#### Sort Options Type

Define available sort options:
```
SortOption = 
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'rating_desc'
  | 'newest'
  | 'popular'
```

#### Search Response Type

Define response structure:
```
SearchResponse interface includes:
- products: Product[] (array of product objects)
- pagination: PaginationMeta
- filters: FilterMeta (available filters with counts)
- query: string (echoed back)
- totalResults: number
- searchId: string (for analytics)
```

#### Product Type

Define product object:
```
Product interface includes:
- id: string
- name: string
- slug: string
- description: string (optional)
- price: number
- originalPrice: number (optional)
- currency: string
- images: ProductImage[]
- thumbnail: string (URL)
- category: Category
- brand: string (optional)
- rating: number
- reviewCount: number
- inStock: boolean
- stockCount: number (optional)
- tags: string[]
- relevanceScore: number (optional)
```

#### Pagination Meta Type

Define pagination metadata:
```
PaginationMeta interface includes:
- currentPage: number
- totalPages: number
- totalResults: number
- limit: number
- hasNextPage: boolean
- hasPrevPage: boolean
- startIndex: number
- endIndex: number
```

#### Filter Meta Type

Define filter metadata:
```
FilterMeta interface includes:
- categories: CategoryFilter[] (with counts)
- brands: BrandFilter[] (with counts)
- priceRange: { min: number, max: number }
- ratingCounts: { [rating: number]: number }
```

### API Client Function

#### searchProducts Function

Implement async function:
- Function name: `searchProducts`
- Parameters: `SearchRequestParams`
- Return type: `Promise<SearchResponse>`
- HTTP client: Fetch or Axios
- Base URL: From environment variable
- Headers: Content-Type, Accept, Authorization (if needed)

#### Request Construction

Build API request:
- Construct URL with base path
- Append query parameters using URLSearchParams
- Handle array parameters (brands)
- Encode special characters
- Set appropriate headers
- Include credentials if needed

#### Response Handling

Process API response:
- Parse JSON response
- Validate response structure
- Transform data if needed (camelCase conversion)
- Extract pagination metadata
- Handle empty results
- Return typed response object

#### Error Handling

Handle various error scenarios:
- Network errors (no connection)
- HTTP errors (4xx, 5xx)
- Timeout errors
- Parse errors (invalid JSON)
- Transform errors to user-friendly messages
- Log errors for monitoring
- Throw typed errors

### React Query Hook

#### useSearchProducts Hook

Create custom hook using React Query:
- Hook name: `useSearchProducts`
- Parameters: `SearchRequestParams`
- Return type: React Query result with SearchResponse
- Query key: Array including 'search' and all relevant params
- Query function: Calls searchProducts API function
- Enabled: Conditionally enable (e.g., only if query provided)

#### Query Key Strategy

Define query key structure:
- Base: `['search']`
- Include all parameters that affect results
- Example: `['search', { q: 'laptop', category: 'electronics', page: 1 }]`
- Stable key ordering for cache hits
- Exclude transient UI state

#### Caching Strategy

Configure React Query caching:
- **staleTime:** 5 minutes (results stay fresh)
- **cacheTime:** 30 minutes (keep in cache)
- **refetchOnWindowFocus:** false (avoid unnecessary refetches)
- **refetchOnMount:** true (get fresh data on component mount)
- **keepPreviousData:** true (show old data while fetching new)

#### Loading and Error States

Hook provides states:
- `isLoading`: Initial load state
- `isFetching`: Background fetching
- `isError`: Error occurred
- `error`: Error object with details
- `data`: Search response data
- `refetch`: Manual refetch function

### Optimistic Updates

#### Placeholder Results

While loading first page:
- Show skeleton grid (handled in component)
- Hook provides `isLoading` state
- No optimistic products displayed

#### Keep Previous Data

When changing filters:
- Use `keepPreviousData: true` in React Query
- Show previous results while loading new
- Apply loading overlay or indicator
- Prevent jarring empty state

### Request Cancellation

#### Cancel In-Flight Requests

Implement cancellation:
- Use AbortController for fetch
- Cancel previous request when new one starts
- React Query handles this automatically
- Avoid race conditions
- Clean up on unmount

### Retry Logic

#### Failed Request Retry

Configure retry behavior:
- **retry:** 2 attempts for failed requests
- **retryDelay:** Exponential backoff (1s, 2s, 4s)
- **shouldRetry:** Don't retry on 4xx errors
- Retry on network errors and 5xx
- Show retry button in UI for manual retry

### Pagination Handling

#### Page Data Management

Handle paginated requests:
- Each page is separate query
- Cache each page independently
- Prefetch next page on hover or scroll
- Clear cache when filters change
- Maintain current page in URL

#### Prefetching Next Page

Implement prefetching:
- Use React Query `prefetchQuery`
- Trigger on pagination hover or scroll proximity
- Reduce perceived loading time
- Silent background fetch
- Store in cache for instant access

### Search Analytics

#### Track Search Events

Send analytics data:
- Search performed (query, filters)
- Results count
- Items clicked from results
- Search ID from API (for correlation)
- User journey through search
- Integration with analytics service

### Error Response Handling

#### Standard Error Format

Expect error response:
```
ErrorResponse interface:
- statusCode: number
- message: string
- errors: string[] (validation errors)
- timestamp: string
```

#### Error Transformation

Transform API errors to user messages:
- Network error: "Unable to connect. Check your internet."
- 404: "Search service not found."
- 500: "Something went wrong. Please try again."
- Validation errors: Display specific field errors
- Timeout: "Request took too long. Please try again."

### Request Deduplication

React Query automatically:
- Deduplicates identical requests
- Returns existing query if in-flight
- Shares loading state across components
- Prevents redundant network calls

### Testing Requirements

Create tests for:
- searchProducts function constructs correct URL
- Request parameters serialized correctly
- Response parsed and typed correctly
- Error handling for network errors
- Error handling for HTTP errors
- Hook returns data on successful request
- Hook provides loading state
- Hook provides error state
- Query key changes trigger new request
- Cache retains previous results
- Prefetching works correctly
- Request cancellation prevents stale results
- Retry logic attempts on failure
- SSR compatibility (if using SSR)

---

## Task 57: Create Results Loading States

### Objective

Implement comprehensive loading state UI components and patterns for the search results page, including skeletons, spinners, and progressive loading indicators to provide excellent user feedback during data fetching.

### File Locations

Create new files:
- Path: `/apps/webstore/src/components/search/loading/ResultsSkeleton.tsx`
- Path: `/apps/webstore/src/components/search/loading/ProductCardSkeleton.tsx`
- Path: `/apps/webstore/src/components/search/loading/HeaderSkeleton.tsx`
- Path: `/apps/webstore/src/components/search/loading/SidebarSkeleton.tsx`
- Path: `/apps/webstore/src/components/search/loading/LoadingOverlay.tsx`

### Loading State Categories

#### Initial Page Load

When page first loads:
- Full page skeleton
- Header skeleton
- Sidebar skeleton (desktop)
- Grid skeleton with multiple cards
- No pagination visible
- Duration: Until first API response

#### Filter Change Load

When filters update:
- Keep header visible
- Keep sidebar visible
- Replace grid with loading state
- Show loading overlay on grid
- Disable interactive elements
- Duration: Until filtered results load

#### Page Navigation Load

When changing pages:
- Keep all UI elements visible
- Subtle loading indicator
- Disable pagination buttons
- Optional: Scroll to top
- Duration: Until new page loads

#### Infinite Scroll Load

If implementing infinite scroll:
- Show loading indicator at bottom
- Keep existing results visible
- Append new results when loaded
- Handle end of results

### Skeleton Component Design Principles

#### Visual Similarity

Skeletons should:
- Match layout of actual content
- Same dimensions as real elements
- Preserve aspect ratios
- Maintain spacing and alignment
- Use neutral gray tones

#### Animation

Apply subtle animation:
- Pulse effect (opacity fade in/out)
- Or shimmer effect (moving gradient)
- Duration: 1.5s to 2s loop
- Ease-in-out timing
- Reduce motion for accessibility

### Product Card Skeleton

#### Structure

Create skeleton matching product card:
- Image placeholder: Rectangle with aspect ratio
- Title placeholder: 2-3 lines of bars
- Price placeholder: Single line bar
- Rating placeholder: Star shapes or bar
- Button placeholder: Button-shaped bar

#### Skeleton Elements

Each element as gray rectangle:
- Image: Background color, no border
- Title: 2 lines, different widths (90%, 70%)
- Price: Single line, narrow width (30-40%)
- Rating: Horizontal bar or star outlines
- Button: Full width or fixed width button shape

#### Responsive Skeletons

Adjust for screen size:
- Mobile: Simplified skeleton, fewer details
- Tablet: Standard skeleton
- Desktop: Full skeleton with all elements
- Match breakpoints of actual cards

### Results Grid Skeleton

#### Grid Structure

Display skeleton grid:
- Same column count as actual grid
- Match responsive breakpoints
- Show 12-24 skeleton cards (one page worth)
- Same gap spacing as actual grid
- Maintain grid alignment

#### Progressive Reveal

Optional progressive loading:
- Show first row of skeletons immediately
- Fade in additional rows with slight delay
- Stagger timing for visual interest
- Maximum 3-4 rows visible initially

### Header Skeleton

#### Header Elements

Create skeleton for header:
- Query text: Bar matching query width
- Result count: Bar for "X products found"
- Sort dropdown: Rectangular button shape
- Filter chips area: Empty or bar placeholders

#### Skeleton Behavior

Header skeleton should:
- Match header layout exactly
- Same height as actual header
- Preserve vertical spacing
- Fade out when actual header loads

### Sidebar Skeleton

#### Sidebar Structure

Create skeleton for filters:
- Section headers: Bold bars
- Filter options: List of checkbox + label bars
- Price range: Slider placeholder
- Spacing between sections
- Scrollable if tall

#### Skeleton Sections

Include skeletons for:
- Active filters section: Empty or 1-2 chip placeholders
- Category section: 5-7 item bars
- Price section: Range slider outline
- Brand section: 5-7 item bars
- Rating section: Star and label bars

### Loading Overlay

#### Overlay Component

For in-place loading (filter changes):
- Semi-transparent overlay (white or gray)
- Positioned over grid area
- Spinner or loading animation centered
- Prevents interaction with content below
- Fade in/out transition (200ms)

#### Overlay Behavior

Overlay should:
- Cover only results grid (not sidebar/header)
- Show spinner or progress indicator
- Optional: "Loading results..." text
- Fade in after 300ms delay (avoid flash)
- Fade out smoothly when results load

### Loading Indicators

#### Spinner Component

Create spinner for loading:
- Circular spinner (rotating circle)
- Brand color for primary element
- Size: Medium (40-60px)
- Smooth rotation animation
- Centered in container

#### Progress Bar

Alternative: Linear progress bar:
- Horizontal bar at top of grid
- Indeterminate animation (moving segment)
- Thin (2-4px height)
- Brand color
- Subtle, non-distracting

### Inline Loading States

#### Loading Text

Simple text indicators:
- "Loading results..."
- "Searching..."
- "Fetching products..."
- Use for quick loads (< 1s expected)
- Minimal visual weight

#### Icon + Text

Combine icon and text:
- Small spinner icon next to text
- Magnifying glass icon with animation
- Position inline where appropriate
- Use in compact spaces

### Error State Loading Recovery

#### Retry Loading

After error with retry:
- Show loading state during retry
- Same loading UI as initial load
- Indicate this is a retry attempt (optional)
- "Retrying..." text if multiple attempts

### Empty State After Loading

#### Transition to Empty

When load completes with no results:
- Fade out loading state
- Fade in empty state message
- Smooth transition (300ms)
- Avoid abrupt change

### Accessibility Requirements

#### Screen Reader Announcements

Implement ARIA live regions:
- Announce when loading starts: "Loading search results"
- Announce when loading completes: "Search results loaded, X products found"
- Use aria-live="polite" or "assertive"
- Don't over-announce rapid changes

#### ARIA Attributes for Skeletons

Add appropriate ARIA:
- `aria-busy="true"` on loading containers
- `aria-label="Loading"` on spinner
- `role="status"` on loading text
- Hide decorative skeletons from screen readers with `aria-hidden="true"`

#### Keyboard and Focus

During loading:
- Disable focusable elements in loading area
- Maintain focus on trigger element (if applicable)
- Don't trap focus in loading state
- Restore focus after loading completes

### Performance Considerations

#### Skeleton Rendering

Optimize skeletons:
- Use CSS for animations (not JS)
- Minimize DOM nodes
- Reuse skeleton components
- Avoid complex shapes
- Use transform for animations

#### Loading State Transitions

Smooth transitions:
- CSS transitions for fade effects
- Avoid layout shifts
- Maintain container dimensions
- Use will-change for animated properties
- Clean up animations on unmount

### Loading State Timing

#### Delay Before Showing

Implement loading delays:
- Very fast loads (< 300ms): No loading state
- Medium loads (300ms - 1s): Show loading state
- Slow loads (> 1s): Show detailed loading state
- Avoid "flash of loading content"

#### Minimum Display Time

Ensure visibility:
- Show loading state for minimum 500ms
- Prevent flash if load completes quickly
- Smooth user experience
- Balance immediacy and polish

### Conditional Loading States

#### Different States for Different Scenarios

Choose appropriate loading UI:
- **Initial page load:** Full page skeleton
- **Filter change:** Overlay or replace grid
- **Pagination:** Subtle indicator, keep content
- **Background refetch:** No loading UI (silent update)
- **Infinite scroll:** Bottom loading indicator

### Testing Requirements

Create tests for:
- Product card skeleton renders correctly
- Grid skeleton shows correct number of cards
- Header skeleton matches header layout
- Sidebar skeleton matches sidebar layout
- Loading overlay appears on filter change
- Spinner renders and animates
- Transitions smooth between loading and content
- Accessibility attributes present
- Screen reader announcements work
- Loading states respect reduced motion preference
- Skeleton responsive at all breakpoints
- Loading delay prevents flash
- Minimum display time enforced

---

## Task 58: Create Results Pagination

### Objective

Build the pagination component that allows users to navigate through multiple pages of search results, with support for page numbers, previous/next buttons, and responsive design.

### File Location

Create new file:
- Path: `/apps/webstore/src/components/search/ResultsPagination.tsx`

### Pagination Responsibilities

1. **Display Page Numbers:** Show current and nearby pages
2. **Navigation Controls:** Previous and Next buttons
3. **Update URL:** Change page parameter on navigation
4. **Scroll Management:** Scroll to top on page change
5. **Responsive Design:** Adapt for mobile devices
6. **Accessibility:** Keyboard and screen reader support

### Pagination Strategy

#### Offset-Based Pagination

Use traditional page number pagination:
- Page parameter in URL (1-indexed)
- Limit parameter for items per page
- Calculate offset: `(page - 1) * limit`
- Total pages: `Math.ceil(totalResults / limit)`

### Component Structure

#### Main Container

Pagination wrapper:
- Semantic `<nav>` element
- ARIA label: "Search results pagination"
- Centered horizontally
- Appropriate spacing above/below
- Responsive padding

#### Child Elements

Pagination contains:
- Previous button (left)
- Page number buttons (center)
- Next button (right)
- Optional: Page info text
- Optional: Items per page selector

### Page Number Display

#### Desktop Layout (> 768px)

Show multiple page numbers:
- Always show: First page, last page, current page
- Show: Current page ± 2 pages (total 5 pages visible)
- Use ellipsis (...) for gaps
- Example: `1 ... 8 9 [10] 11 12 ... 50`

#### Tablet Layout (640px - 768px)

Reduce page numbers:
- Show: Current page ± 1 page (total 3 pages visible)
- First and last pages
- Ellipsis for gaps
- Example: `1 ... 9 [10] 11 ... 50`

#### Mobile Layout (< 640px)

Minimal page display:
- Show only current page
- Optional: Total pages (e.g., "Page 10 of 50")
- Focus on Previous/Next buttons
- Hide individual page numbers

### Page Number Logic

#### Calculate Visible Pages

Algorithm for page numbers:
- If total pages ≤ 7: Show all pages
- Always include: 1, current - 2, current - 1, current, current + 1, current + 2, last
- Fill gaps with ellipsis
- Handle edge cases (near start or end)

#### Ellipsis Handling

Display ellipsis:
- Use "..." or "…" character
- Not clickable
- Indicates hidden pages
- Position between first/last and current range
- Avoid double ellipsis if range is continuous

### Previous/Next Buttons

#### Button Design

Previous and Next buttons:
- Text: "Previous" and "Next" or just icons
- Icons: Chevron left/right
- Position: Left and right of page numbers
- Size: Larger touch target on mobile (min 44px)
- Styling: Secondary button style

#### Button States

Handle button states:
- **Disabled:** First page (Previous disabled), Last page (Next disabled)
- **Hover:** Highlight on hover
- **Active:** Style on click
- **Focus:** Visible focus indicator

#### Button Behavior

Button interactions:
- Click: Navigate to previous/next page
- Update URL parameter
- Trigger new API call
- Scroll to top of results
- Show loading state

### Current Page Indicator

#### Highlighted Current Page

Visual distinction:
- Background: Primary color
- Text color: White or contrast color
- Font weight: Bold
- Border: Optional border or shadow
- Size: Same as other page buttons

#### Non-Clickable

Current page button:
- Not clickable (disabled state)
- Cursor: Default (not pointer)
- ARIA attribute: `aria-current="page"`
- Clearly indicates current location

### Page Button Design

#### Button Styling

Each page number button:
- Shape: Square or circular
- Size: 36px - 44px (consistent)
- Padding: Even padding around number
- Border: Optional subtle border
- Background: Light gray or transparent

#### Button States

Interactive states:
- **Default:** Light gray background
- **Hover:** Darker gray background
- **Active:** Primary color
- **Focus:** Visible focus ring
- **Current:** Primary color, distinct

### Navigation Behavior

#### Page Change Actions

When user clicks page:
- Update URL parameter: `page=X`
- Trigger new search API call
- Show loading state on grid
- Scroll to top of results smoothly
- Update pagination component state

#### URL Update Strategy

Choose update method:
- Use `router.push()` for new history entry
- Allow back button to navigate pages
- Preserve other URL parameters (query, filters)
- Update only page parameter

### Scroll Management

#### Scroll to Top

On page change:
- Smooth scroll to top of results container
- Or scroll to top of page
- Offset for fixed header if applicable
- Duration: 300-500ms
- Respect reduced motion preference

#### Scroll Position Restoration

Handle browser back/forward:
- Browser may restore scroll position
- Override if desired (scroll to top)
- Or allow native scroll restoration

### Items Per Page Selector (Optional)

#### Selector Component

If including items per page:
- Dropdown or button group
- Options: 12, 24, 36, 48 items
- Position: Near pagination or header
- Label: "Show:" or "Per page:"
- Updates URL and refreshes results

#### Selector Behavior

When changed:
- Update `limit` URL parameter
- Reset to page 1
- Trigger new API call
- Recalculate total pages

### First/Last Page Buttons (Optional)

#### Jump to First/Last

Additional navigation:
- "First" button to jump to page 1
- "Last" button to jump to final page
- Position: Before Previous and after Next
- Icons: Double chevron (« and »)
- Only show if many pages (> 10)

### Page Info Display

#### Text Summary

Show pagination info:
- Format: "Page X of Y"
- Or: "Showing 1-24 of 234 results"
- Position: Above, below, or within pagination
- Responsive: Hide on mobile if space limited
- Update dynamically

### Responsive Behavior

#### Mobile Optimizations

Adapt for mobile:
- Larger touch targets (44px minimum)
- Previous/Next as primary navigation
- Hide or minimize page number buttons
- Use icons to save space
- Full-width pagination bar (optional)

#### Tablet Optimizations

Adjust for tablet:
- Show fewer page numbers (3-5)
- Comfortable spacing between buttons
- Balance between mobile and desktop

### Loading State

#### During Page Change

While loading new page:
- Disable all pagination buttons
- Show loading spinner or indicator
- Keep pagination visible
- Prevent duplicate clicks
- Re-enable after data loads

### Error Handling

#### Invalid Page Number

If user navigates to invalid page:
- Redirect to page 1
- Or show 404 page
- Or show last valid page
- Display error message
- Log for monitoring

#### Out of Range

If page exceeds total pages:
- Redirect to last page
- Show message: "Page not found, showing last page"
- Update URL to correct page
- Handle gracefully

### Accessibility Requirements

#### Semantic HTML

Use appropriate elements:
- Pagination wrapper: `<nav>` with `aria-label`
- Page buttons: `<button>` elements
- Current page: `aria-current="page"`
- Disabled buttons: `disabled` attribute

#### ARIA Attributes

Add necessary ARIA:
- `aria-label="Pagination"` on nav
- `aria-label="Go to page X"` on page buttons
- `aria-label="Previous page"` on Previous button
- `aria-label="Next page"` on Next button
- `aria-disabled="true"` for disabled buttons

#### Keyboard Navigation

Enable keyboard control:
- Tab through all pagination buttons
- Enter/Space to activate
- Arrow keys for Previous/Next (optional)
- Focus visible indicators
- Skip links available

#### Screen Reader Support

Announce pagination:
- Announce current page
- Announce total pages
- Announce page changes (live region)
- Context for navigation

### Animation and Transitions

#### Button Interactions

Subtle animations:
- Hover: Background color transition (150ms)
- Active: Slight scale down (0.95)
- Focus: Fade in focus ring
- Disable: Fade opacity to 0.5

#### Page Transition

When changing pages:
- Results fade out and new fade in
- Or slide transition (optional)
- Smooth, not distracting
- Respect reduced motion

### Testing Requirements

Create tests for:
- Pagination renders with correct page numbers
- Current page highlighted correctly
- Previous button disabled on first page
- Next button disabled on last page
- Clicking page number updates URL
- Previous/Next buttons navigate correctly
- Ellipsis displayed when pages hidden
- Responsive layouts at breakpoints
- Mobile shows minimal pagination
- Desktop shows full pagination
- Loading state disables buttons
- Invalid page redirects correctly
- Accessibility attributes present
- Keyboard navigation works
- Screen reader announcements
- Scroll to top on page change

---

## Component Integration

### Integration Overview

This section describes how all components in Group-D work together to create a cohesive search results page experience.

### Component Relationships

#### Parent-Child Hierarchy

```
SearchResultsPage (page component)
  └── SearchResultsContainer
      ├── ResultsHeader
      │   ├── QueryDisplay
      │   ├── ResultsCount
      │   ├── SortControls
      │   └── ActiveFilters
      ├── MainLayout
      │   ├── ResultsSidebar
      │   │   ├── ActiveFiltersSection
      │   │   ├── CategoryFilter
      │   │   ├── PriceFilter
      │   │   ├── BrandFilter
      │   │   └── RatingFilter
      │   └── ResultsGrid
      │       └── ProductCard[] (from SubPhase-03)
      └── ResultsPagination
```

### Data Flow Between Components

#### URL → State → Components

1. URL parameters change (user action or navigation)
2. useSearchParams hook detects change
3. React Query triggers API call with new parameters
4. API returns search results and metadata
5. Components receive data via props or context
6. UI updates to reflect new state

#### User Action → State Update → URL

1. User interacts with component (filter, sort, page)
2. Component calls update function
3. URL parameters updated
4. Cycle repeats from URL → State

### Shared State Management

#### URL as Single Source of Truth

URL contains:
- Search query
- All active filters
- Sort order
- Current page number

#### React Query for Server State

React Query manages:
- Fetched search results
- Loading and error states
- Caching and refetching
- Background updates

#### Local Component State

Components manage:
- UI-only state (sidebar open/closed)
- Transient state (hover effects)
- Form input state (before applying)

### Props and Context

#### Props Passing

Pass data down component tree:
- SearchResults → ProductCard: Product data
- ResultsHeader → ResultsCount: Count and pagination info
- ResultsSidebar → Filters: Filter options and active state

#### Context Usage (Optional)

If needed, use context for:
- Search state accessible by many components
- Theme or styling configuration
- User preferences (view mode, items per page)
- Avoid prop drilling

### Event Handling

#### Filter Changes

When filter applied:
1. Sidebar filter component calls update function
2. URL updated with new filter parameter
3. Page reset to 1 (new search)
4. API call triggered
5. Results grid shows loading state
6. New results rendered
7. Header updates count and active filters

#### Sort Changes

When sort order changed:
1. Sort dropdown calls update function
2. URL updated with sort parameter
3. Page reset to 1
4. API call with new sort order
5. Results re-rendered in new order
6. Maintain scroll position or scroll to top

#### Pagination

When page changed:
1. Pagination button clicked
2. URL updated with new page number
3. API call for new page
4. Results grid shows loading/overlay
5. Scroll to top of results
6. New page of results rendered
7. Pagination updates current page

### Loading State Coordination

#### Initial Load

On first page load:
- All components show skeleton states
- Coordinated timing (fade in together)
- Header, sidebar, and grid all loading
- Pagination hidden

#### Filter Update Load

When filters change:
- Header and sidebar remain visible
- Grid shows loading overlay or skeletons
- Pagination disabled
- Count shows loading indicator

#### Page Change Load

When navigating pages:
- Minimal loading indicator
- All components visible
- Subtle spinner or progress bar
- Pagination buttons disabled

### Error Handling Coordination

#### API Error

When search API fails:
- Results grid shows error message
- Header shows last successful count (or error)
- Sidebar remains functional
- Retry action available
- Other parts of page unaffected

#### Partial Failures

If some data fails to load:
- Show what's available
- Indicate what failed
- Provide retry for failed parts
- Don't block entire page

### Responsive Coordination

#### Desktop Layout

All components visible:
- Sidebar fixed on left
- Main content on right
- Header spanning full width
- Pagination below grid

#### Tablet Layout

Adjusted layout:
- Sidebar collapsible
- Main content expands when sidebar closed
- Header two-row layout
- Pagination condensed

#### Mobile Layout

Stacked vertically:
- Header at top (compact)
- Sidebar as drawer/sheet
- Grid full width, single column
- Pagination minimal at bottom

### Performance Optimization

#### Code Splitting

Split components:
- Lazy load sidebar filters
- Lazy load pagination if below fold
- Dynamic import for filter modals
- Reduce initial bundle size

#### Memoization

Memoize components:
- Memoize product cards
- Memoize filter sections
- Prevent unnecessary re-renders
- Use React.memo strategically

#### Virtualization

For large lists:
- Virtualize product grid if many results
- Virtualize filter option lists
- Render only visible items

---

## State Management

### State Architecture

This section defines the complete state management strategy for the search results page.

### State Categories

#### 1. URL State (Persistent)

Stored in URL parameters:
- Search query (`q`)
- Category filter
- Price range (min/max)
- Brand filters
- Rating filter
- Stock filters
- Sort order
- Current page
- Items per page

**Management:** useSearchParams hook

#### 2. Server State (Cached)

Fetched from API:
- Product results
- Result metadata (count, filters available)
- Pagination info

**Management:** React Query (useSearchProducts hook)

#### 3. UI State (Transient)

Component-only state:
- Sidebar open/closed (mobile)
- Filter section expanded/collapsed
- Hover states
- Loading overlays
- Modals open/closed

**Management:** Local component useState

#### 4. User Preferences (Persisted)

Optional persistent state:
- View mode (grid/list)
- Items per page preference
- Default sort order

**Management:** localStorage or cookies

### State Update Flows

#### Filter Application Flow

```
User selects filter
    ↓
Component state updates (checkbox checked)
    ↓
Update function called with new filter value
    ↓
URL parameter updated (page reset to 1)
    ↓
URL change detected
    ↓
React Query refetches with new parameters
    ↓
New results returned
    ↓
UI components re-render with new data
```

#### Page Navigation Flow

```
User clicks page number
    ↓
URL parameter updated (page=X)
    ↓
React Query fetches new page
    ↓
Loading state shown
    ↓
Scroll to top triggered
    ↓
New results rendered
    ↓
Pagination updates to new current page
```

### Synchronization Strategy

#### URL ↔ Component State

On component mount:
- Read URL parameters
- Initialize local state from URL
- Display UI reflecting URL state

On state change:
- Update URL parameters
- URL change triggers re-render
- Components reflect new state

#### React Query ↔ URL

Query key includes URL parameters:
- Parameters change → new query key → new fetch
- React Query caches by query key
- Same parameters → cached result
- Different parameters → new fetch

### State Reset Scenarios

#### Clear All Filters

When user clears filters:
- Remove all filter parameters from URL
- Keep search query (if present)
- Reset page to 1
- Trigger new API call
- Show all results

#### New Search

When user submits new search query:
- Update query parameter
- Clear all filters
- Reset page to 1
- Reset sort to default
- Fetch results for new query

#### Browser Back/Forward

When user navigates history:
- URL changes to previous/next state
- React Query fetches for that state (or uses cache)
- Components update to match URL
- No manual state management needed

### Caching Strategy

#### React Query Cache

Configure caching:
- **Cache key:** `['search', searchParams]`
- **Cache time:** 30 minutes
- **Stale time:** 5 minutes
- **Revalidate:** On window focus (optional)

#### Cache Invalidation

Invalidate cache when:
- Product data changes (admin updates)
- User adds/removes from cart (stock changes)
- Price updates occur
- Use mutation events to invalidate

### State Debugging

#### URL Inspection

Debug via URL:
- All search state visible in URL
- Copy/paste URL to reproduce state
- Share URL for bug reports
- Analytics track URL parameters

#### React Query DevTools

Use DevTools to:
- Inspect cached queries
- View query states (loading, error, success)
- Manually refetch queries
- Debug stale/fresh state

---

## Testing Requirements

### Unit Tests

#### Component Tests

Test each component:
- Renders correctly with props
- Handles user interactions
- Displays loading states
- Shows error states
- Responsive behavior

#### Hook Tests

Test custom hooks:
- useSearchParams reads/updates URL
- useSearchProducts fetches data
- Returns correct loading/error states
- Caching works correctly

#### Utility Tests

Test utility functions:
- parseSearchParams parses correctly
- buildSearchParams constructs URLs
- Validation functions work
- Type conversions correct

### Integration Tests

#### Component Integration

Test component combinations:
- Container renders all children
- Filter changes update grid
- Pagination changes update URL and grid
- Sort changes update results

#### State Flow

Test data flow:
- URL → state → API → UI
- User action → state → URL → API
- Browser navigation → state update

### End-to-End Tests

#### User Flows

Test complete scenarios:
1. User lands on search page
2. User enters search query
3. User applies filters
4. User changes sort order
5. User navigates pages
6. User clears filters
7. User sees updated results

#### Cross-Browser Testing

Test in browsers:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers

### Accessibility Testing

#### Automated Tests

Run automated tools:
- axe DevTools
- Lighthouse accessibility audit
- WAVE accessibility checker

#### Manual Testing

Test manually:
- Keyboard navigation
- Screen reader (NVDA, JAWS, VoiceOver)
- Focus management
- ARIA announcements

### Performance Testing

#### Load Testing

Test performance:
- Measure time to first render
- Measure time to interactive
- Monitor bundle size
- Check for memory leaks

#### Lighthouse Audit

Run Lighthouse:
- Performance score
- Best practices
- Accessibility score
- SEO score

---

## Validation Checklist

### Feature Completeness

- [ ] Search results container implemented
- [ ] Results header displays query and count
- [ ] Results count updates dynamically
- [ ] Results grid displays product cards
- [ ] Product cards show all required info
- [ ] Results sidebar shows filters
- [ ] URL query parameters managed correctly
- [ ] Search API integration working
- [ ] Loading states display appropriately
- [ ] Pagination navigation functional

### User Experience

- [ ] Search results load quickly (< 2s)
- [ ] Filters apply smoothly
- [ ] Sort changes work correctly
- [ ] Pagination navigates properly
- [ ] Loading states don't flash too quickly
- [ ] Error messages are clear and helpful
- [ ] Empty states provide guidance
- [ ] Mobile experience is smooth
- [ ] Hover states provide feedback
- [ ] Animations are subtle and smooth

### Responsive Design

- [ ] Desktop layout (> 1024px) works correctly
- [ ] Tablet layout (768px - 1024px) adapts properly
- [ ] Mobile layout (< 768px) is usable
- [ ] Sidebar collapses on mobile
- [ ] Pagination adapts to screen size
- [ ] Touch targets are large enough (44px min)
- [ ] Text remains readable at all sizes
- [ ] Images scale appropriately

### Accessibility

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels and roles present
- [ ] Screen reader announcements work
- [ ] Color contrast meets WCAG AA standards
- [ ] Semantic HTML used throughout
- [ ] Skip links available
- [ ] No keyboard traps

### Performance

- [ ] Initial load time < 2 seconds
- [ ] Time to interactive < 3 seconds
- [ ] Images lazy load properly
- [ ] API responses cached effectively
- [ ] No unnecessary re-renders
- [ ] Bundle size optimized
- [ ] No console errors
- [ ] Memory usage stable

### Code Quality

- [ ] TypeScript types defined
- [ ] Components properly documented
- [ ] Code follows project conventions
- [ ] No linting errors
- [ ] Tests written and passing
- [ ] Reusable components extracted
- [ ] Props validated
- [ ] Error boundaries in place

### Browser Compatibility

- [ ] Chrome (latest) works
- [ ] Firefox (latest) works
- [ ] Safari (latest) works
- [ ] Edge (latest) works
- [ ] iOS Safari works
- [ ] Android Chrome works

### Integration

- [ ] Integrates with SubPhase-03 product cards
- [ ] Integrates with Group-A search bar
- [ ] Integrates with Group-C filters
- [ ] API contract matches backend
- [ ] URL structure documented
- [ ] Analytics events firing

### Edge Cases

- [ ] Zero results handled gracefully
- [ ] Invalid query parameters handled
- [ ] Very long search queries handled
- [ ] Large number of filters handled
- [ ] Network errors handled
- [ ] Timeout errors handled
- [ ] Out of stock products displayed correctly
- [ ] Price edge cases (free, very high prices)

### Documentation

- [ ] Component usage documented
- [ ] API endpoints documented
- [ ] State management documented
- [ ] Testing strategy documented
- [ ] Accessibility features documented
- [ ] Known limitations documented

---

## Summary

### What Was Built

Group-D (Document 01) covered the implementation of:

1. **Search Results Container:** Main wrapper managing layout and state orchestration
2. **Results Header:** Displays query, count, sort controls, and active filters
3. **Results Count:** Shows total results and pagination context
4. **Results Grid:** Responsive grid displaying product cards
5. **Results Product Card:** Reused or adapted card component for search context
6. **Results Sidebar:** Filter controls for refining search results
7. **Query Parameter Handler:** URL state management utilities and hooks
8. **Search API Integration:** API client and React Query hooks for data fetching
9. **Loading States:** Comprehensive skeleton and loading indicators
10. **Results Pagination:** Page navigation with previous/next and page numbers

### Key Achievements

- Complete search results page with all core functionality
- Responsive design working across all device sizes
- URL-based state management for bookmarking and sharing
- Efficient API integration with caching and error handling
- Excellent loading states providing user feedback
- Accessible components meeting WCAG standards
- Reusable product cards from catalog
- Comprehensive filter system in sidebar
- Smooth pagination for large result sets

### Next Steps

Proceed to **Document 02** (Tasks 59-66) covering:
- Advanced pagination features
- SEO meta tags for search pages
- Analytics integration
- Search results testing
- Performance optimization
- Verification and validation

---

## Navigation

- **Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **Next:** [02_Tasks-59-66_Pagination-Meta-Verify.md](./02_Tasks-59-66_Pagination-Meta-Verify.md)
- **Phase:** [Phase-08 Webstore](../../)
- **SubPhase:** [SubPhase-05 Search Functionality](../)

---

**Document Complete** | Tasks 49-58 | Group-D Search Results Page | Container, Grid, and API Integration