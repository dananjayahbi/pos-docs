# Group-E Document 02: Sort Options & Mobile Filter Interface

**Phase:** 08 - Webstore E-commerce Platform  
**SubPhase:** 05 - Search Functionality  
**Group:** E - Results Filtering and Sorting  
**Tasks Covered:** 74-80  
**Document Type:** Implementation Instructions  
**Status:** Active Development  
**Last Updated:** January 26, 2026

---

## Navigation

- **Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **Previous:** [01_Tasks-67-73_Filters-URL-Sync.md](01_Tasks-67-73_Filters-URL-Sync.md)
- **Current:** 02_Tasks-74-80_Sort-Mobile.md
- **Related:**
  - Phase-08 Overview
  - SubPhase-05 Overview
  - Group-D: Search Results Display

---

## Document Overview

### Purpose
This document provides comprehensive instructions for implementing sort functionality and mobile filter interface for the webstore search results. It covers the creation of a sort dropdown with five different sorting algorithms, and a mobile-optimized filter interface with a slide-out drawer.

### Scope
- **Sort Dropdown Component** - Desktop UI for sorting options
- **Sort Algorithms** - Five sorting methods (Relevance, Price, Newest, Popular)
- **Mobile Filter Button** - Compact button with active filter badge
- **Mobile Filter Drawer** - Slide-out panel for mobile filter interface
- **URL State Management** - Sort parameter synchronization
- **Responsive Behavior** - Adaptive UI for different screen sizes

### Tasks Breakdown

#### Task 74: Create Sort Dropdown
Create the desktop sort dropdown component with proper styling and interaction.

#### Task 75: Create Sort by Relevance (default)
Implement relevance-based sorting algorithm and set as default.

#### Task 76: Create Sort by Price (low-high, high-low)
Implement price-based sorting with ascending and descending options.

#### Task 77: Create Sort by Newest
Implement date-based sorting for newest products first.

#### Task 78: Create Sort by Popular
Implement popularity-based sorting using sales/view metrics.

#### Task 79: Create Mobile Filter Button
Create compact button for mobile view with active filter count badge.

#### Task 80: Create Mobile Filter Drawer
Implement slide-out drawer containing all filter controls for mobile.

---

## Technical Context

### Sort Options Overview

**Available Sort Methods:**
1. **Relevance (Default)** - Search query match score
2. **Price: Low to High** - Ascending price order
3. **Price: High to Low** - Descending price order
4. **Newest First** - Most recently added products
5. **Most Popular** - Based on sales volume and views

### Technology Stack

**UI Components:**
- Shadcn/UI Select component for dropdown
- Shadcn/UI Sheet component for mobile drawer
- Shadcn/UI Badge component for filter count
- Tailwind CSS for responsive styling

**State Management:**
- URL query parameters for sort state
- React state for drawer open/close
- Zustand store for filter state
- React Query for sorted data fetching

**Mobile Considerations:**
- Responsive breakpoint: 768px (md)
- Touch-friendly tap targets (44px minimum)
- Slide animation for drawer (left or bottom)
- Body scroll lock when drawer open

---

## Architecture Diagrams

### Sort Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SORT FUNCTIONALITY FLOW                      │
└─────────────────────────────────────────────────────────────────┘

User Interaction
       │
       ├─── Desktop: Click Sort Dropdown
       │         │
       │         ├─── Show Sort Options
       │         │         │
       │         │         ├─── Relevance (Default)
       │         │         ├─── Price: Low to High
       │         │         ├─── Price: High to Low
       │         │         ├─── Newest First
       │         │         └─── Most Popular
       │         │
       │         └─── User Selects Option
       │                   │
       │                   └─── Update State
       │
       └─── Mobile: Click Sort in Drawer
                 │
                 └─── Same Options as Desktop
                           │
                           └─── Update State

State Update
       │
       ├─── Update URL Query Parameter (?sort=price_asc)
       │
       ├─── Update Zustand Store
       │
       ├─── Trigger React Query Refetch
       │
       └─── Apply Sort Algorithm

Sort Algorithm
       │
       ├─── Fetch Sorted Data from API
       │         │
       │         └─── Backend applies sort logic
       │
       ├─── OR Client-Side Sort (if cached)
       │         │
       │         └─── Apply JavaScript sort
       │
       └─── Update Results Display

Results Update
       │
       └─── Re-render ProductGrid with sorted data
```

### Mobile Filter Interface Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                  MOBILE FILTER INTERFACE                         │
└─────────────────────────────────────────────────────────────────┘

┌────────────────── Mobile View (< 768px) ──────────────────────┐
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Header: "Search: leather jackets"              [X]     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  │
│  │  [≡] Filters (3)         │  │  Sort by: Price ↓        │  │
│  │  (Mobile Filter Button)  │  │  (Sort Selector)         │  │
│  └──────────────────────────┘  └──────────────────────────┘  │
│                                                                 │
│  Results Grid Below...                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

When Filter Button Clicked:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌────────────── Filter Drawer (Overlay) ─────────────────┐   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  Filters                                  [X]   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  Category                                   ▼   │   │   │
│  │  │  • All Categories                              │   │   │
│  │  │  • Outerwear (3)                               │   │   │
│  │  │  • Footwear (1)                                │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  Price Range                                    │   │   │
│  │  │  Rs 2,000 ─────────●─────── Rs 50,000         │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  Brand                                      ▼   │   │   │
│  │  │  ☑ Nike (2)                                    │   │   │
│  │  │  ☐ Adidas                                      │   │   │
│  │  │  ☑ Puma (1)                                    │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  Size                                           │   │   │
│  │  │  [M] [L] [XL]                                  │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  In Stock Only            [Toggle ON]          │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌──────────────────┐  ┌─────────────────────────┐   │   │
│  │  │  Clear All       │  │  Apply Filters (3)      │   │   │
│  │  └──────────────────┘  └─────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│      [Dark Overlay - Dismisses Drawer]                         │
└─────────────────────────────────────────────────────────────────┘
```

### Sort Parameter URL Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                   URL PARAMETER STRUCTURE                        │
└─────────────────────────────────────────────────────────────────┘

Base Search URL:
/search?q=leather+jackets

With Sort Parameter:
/search?q=leather+jackets&sort=price_asc

Sort Parameter Values:
├─── relevance       (Default, can be omitted)
├─── price_asc       (Price: Low to High)
├─── price_desc      (Price: High to Low)
├─── date_desc       (Newest First)
└─── popularity_desc (Most Popular)

Complete URL Examples:

1. Default Search (Relevance):
   /search?q=shoes

2. Price Low to High:
   /search?q=shoes&sort=price_asc

3. Price High to Low:
   /search?q=shoes&sort=price_desc&category=footwear

4. Newest First with Filters:
   /search?q=shoes&sort=date_desc&brand=nike&inStock=true

5. Most Popular with Multiple Filters:
   /search?q=shoes&sort=popularity_desc&brand=nike,adidas&size=M,L
```

---

## Task 74: Create Sort Dropdown

### Objective
Create a desktop-optimized sort dropdown component that allows users to select from five different sorting options. The component should be prominently placed above the search results and provide clear visual feedback for the selected sort method.

### Component Location
Place the sort dropdown component in the search results page header, aligned to the right side on desktop views. The component should be part of the results toolbar, positioned next to the filter summary or view toggle buttons.

### Component Structure

#### Dropdown Container
Create a container for the sort dropdown that includes:
- Label text "Sort by:" positioned before the dropdown
- Select/dropdown trigger button showing current selection
- Dropdown icon indicating expandable nature
- Proper spacing and alignment with other toolbar elements

#### Trigger Button Design
Design the trigger button with:
- Current sort option displayed as text
- Chevron down icon on the right
- Subtle border and background
- Hover state with slight color change
- Focus state with keyboard navigation support
- Active state when dropdown is open
- Minimum width to prevent layout shift

#### Visual Styling
Style the dropdown with:
- Clean, minimal design matching site theme
- Proper contrast for readability
- Subtle shadow for depth
- Rounded corners consistent with design system
- Height appropriate for content (44px minimum)

### Dropdown Menu

#### Menu Container
Create the dropdown menu with:
- Positioned below the trigger button
- Proper z-index to overlay other content
- Subtle shadow for elevation
- White or themed background
- Rounded corners matching design system
- Minimum width matching trigger button

#### Menu Options List
Structure the menu with five options:
1. Relevance (with "Default" indicator)
2. Price: Low to High
3. Price: High to Low
4. Newest First
5. Most Popular

#### Option Styling
Style each menu option with:
- Padding for comfortable clicking (12px vertical, 16px horizontal)
- Hover state with background color change
- Active/selected state with checkmark or highlight
- Clear text labels with appropriate font size
- Icon or indicator for currently selected option
- Keyboard navigation support (arrow keys)

### Interaction Behavior

#### Opening the Dropdown
Implement opening behavior:
- Click trigger button to open menu
- Focus trigger and press Enter/Space to open
- Arrow down key on trigger opens menu
- Only one dropdown open at a time
- Smooth animation for menu appearance

#### Selecting an Option
Implement selection behavior:
- Click option to select
- Press Enter on focused option to select
- Update trigger button text immediately
- Close dropdown after selection
- Update URL with sort parameter
- Trigger results refetch with new sort
- Maintain focus management for accessibility

#### Closing the Dropdown
Implement closing behavior:
- Click outside dropdown to close
- Press Escape key to close
- Click trigger again to close (toggle)
- Select option closes automatically
- Tab key moves focus and closes dropdown

### State Management

#### Local State
Maintain local state for:
- Dropdown open/closed status
- Currently focused option (keyboard navigation)
- Hover state for visual feedback

#### Global State
Connect to global state for:
- Currently selected sort option
- Update URL search parameters
- Trigger search results refetch
- Sync with mobile sort selection

#### Default State
Set default behavior:
- Show "Relevance" as default on page load
- If URL has sort parameter, show that option
- If no search query, show but disable dropdown
- Update when navigating back/forward (browser history)

### Accessibility Requirements

#### Keyboard Navigation
Implement full keyboard support:
- Tab to focus trigger button
- Enter/Space to open dropdown
- Arrow Up/Down to navigate options
- Enter to select focused option
- Escape to close dropdown
- Tab to move to next focusable element

#### Screen Reader Support
Add ARIA attributes:
- aria-label="Sort search results"
- aria-haspopup="listbox"
- aria-expanded="true/false"
- role="button" on trigger
- role="listbox" on menu
- role="option" on each menu item
- aria-selected="true" on current option

#### Focus Management
Ensure proper focus management:
- Visible focus indicators
- Focus trap within dropdown when open
- Return focus to trigger when closing
- Focus first option when opening with keyboard
- Clear focus ring styling

### Responsive Behavior

#### Desktop Display (≥768px)
On desktop screens:
- Show dropdown in results toolbar
- Position on right side of toolbar
- Full-width menu items with comfortable padding
- Hover states clearly visible

#### Tablet Display (768px - 1024px)
On tablet screens:
- Maintain desktop dropdown style
- Adjust spacing for narrower width
- Ensure dropdown doesn't overflow viewport
- Touch-friendly tap targets (44px minimum)

#### Mobile Display (<768px)
On mobile screens:
- Hide desktop dropdown (display: none)
- Show sort option in mobile filter drawer instead
- Use radio button group for sort options in drawer
- Larger tap targets for touch interaction

### Integration Points

#### Connect to URL State
Integrate with URL parameters:
- Read sort parameter from URL on mount
- Update URL when sort selection changes
- Use Next.js router.push with shallow routing
- Preserve other query parameters (filters, page)

#### Connect to Search Store
Integrate with Zustand search store:
- Read current sort from store
- Dispatch sort update action
- Store manages sort state persistence
- Sync between desktop dropdown and mobile drawer

#### Trigger Results Update
When sort changes:
- Invalidate React Query cache for search results
- Trigger refetch with new sort parameter
- Show loading state in results grid
- Scroll to top of results (optional)
- Maintain scroll position (alternative)

### Loading and Error States

#### Loading State
When results are being fetched:
- Disable dropdown (prevent additional changes)
- Show subtle loading indicator (optional)
- Keep current selection visible
- Re-enable when fetch completes

#### Error State
If sort operation fails:
- Show error message (toast notification)
- Revert to previous sort selection
- Allow user to retry
- Log error for debugging

#### Empty Results
When no results available:
- Show dropdown but disable it
- Display message about no results
- Keep visual consistency
- Allow changing sort (might find results)

---

## Task 75: Create Sort by Relevance (Default)

### Objective
Implement relevance-based sorting as the default sort method for search results. This sorting algorithm ranks products based on their match score with the search query, considering factors like title match, description match, category relevance, and other search signals.

### Relevance Algorithm Design

#### Match Score Components
Design the relevance scoring system with multiple weighted factors:
- **Title Match Score** - Highest weight (40-50%)
- **Description Match Score** - Medium weight (20-30%)
- **Category Relevance** - Medium weight (15-20%)
- **Tag/Attribute Match** - Low weight (5-10%)
- **Brand Match** - Low weight (5-10%)

#### Title Match Scoring
Calculate title match score based on:
- Exact phrase match (highest score)
- All search terms present (high score)
- Some search terms present (medium score)
- Partial word matches (lower score)
- Position of match (earlier = higher score)
- Case-insensitive matching

#### Description Match Scoring
Calculate description match score based on:
- Multiple occurrences of search terms
- Proximity of search terms to each other
- Position in description (earlier = higher score)
- Density of search terms relative to text length

#### Category Relevance Scoring
Calculate category relevance based on:
- Direct category name match
- Parent category match
- Related category match
- Category synonyms and aliases

#### Combined Score Calculation
Combine scores with weighted formula:
- Multiply each component score by its weight
- Sum all weighted scores
- Normalize to 0-100 range
- Apply any boosts (e.g., featured products)
- Sort results by final score (descending)

### Default Behavior

#### Initial Page Load
When search results page loads:
- Apply relevance sort automatically
- Do not add sort parameter to URL (keep clean)
- Display "Relevance" as selected in dropdown
- Show results in relevance order

#### Explicit Selection
When user explicitly selects "Relevance":
- Apply relevance sort
- Remove sort parameter from URL (if present)
- Update dropdown selection
- Refresh results if currently using different sort

#### URL Parameter Handling
Handle URL sort parameter:
- If no sort parameter present, use relevance
- If sort=relevance in URL, use relevance
- If other sort parameter present, override relevance
- Preserve relevance as fallback for invalid values

### Backend Integration

#### API Request Structure
Send relevance sort request to API:
- Include search query in request
- Omit sort parameter (default behavior) OR
- Include sort=relevance parameter explicitly
- Pass any active filters as additional parameters
- Request appropriate page size

#### API Response Handling
Process API response:
- Expect products in relevance order
- Response includes relevance scores (optional)
- Handle pagination with relevance maintained
- Cache results for performance
- Update React Query cache

#### Score Visibility (Optional)
Consider showing relevance scores:
- Display score in admin/debug mode
- Show as percentage match (e.g., "95% match")
- Use for testing and optimization
- Hide from regular users by default

### Frontend State Management

#### Store State
Maintain relevance sort state:
- Set as default in Zustand store
- Initialize on store creation
- Reset to relevance when search query changes
- Persist preference (optional)

#### URL State Synchronization
Keep URL in sync:
- Remove sort parameter when relevance selected
- Add parameter when other sort selected
- Handle browser back/forward buttons
- Update state when URL changes manually

### Visual Indicators

#### Dropdown Display
Show relevance as default:
- Display "Relevance" in trigger button
- Add "(Default)" label next to option in menu
- Highlight as selected in dropdown
- Position as first option in list

#### Results Display
Display relevance-sorted results:
- No special indicator needed
- Results feel "naturally ordered"
- Most relevant items appear first
- User expectation matched

### Optimization Considerations

#### Performance
Optimize relevance calculation:
- Perform scoring on backend (database level)
- Use full-text search capabilities (PostgreSQL)
- Cache common query results
- Implement search result scoring indexes
- Limit scoring complexity for speed

#### Accuracy
Improve relevance accuracy:
- Analyze user behavior (clicks, purchases)
- Adjust weights based on conversion data
- Use A/B testing for weight optimization
- Consider personalization factors
- Machine learning for score tuning (future)

### Testing Requirements

#### Test Case: Default Sort
Verify default behavior:
- Load search page without sort parameter
- Confirm relevance sort applied
- Verify results order makes sense
- Check dropdown shows "Relevance"

#### Test Case: Query Variations
Test with different queries:
- Single word query
- Multi-word phrase query
- Partial word matches
- Special characters in query
- Very common words (e.g., "the", "and")

#### Test Case: Score Accuracy
Validate scoring logic:
- Exact title match appears first
- Partial matches ranked appropriately
- Category matches included
- Irrelevant results filtered out

#### Test Case: Fallback Behavior
Test fallback scenarios:
- Invalid sort parameter defaults to relevance
- Missing search query shows error or empty
- Backend scoring error falls back to basic sort

---

## Task 76: Create Sort by Price (Low-High, High-Low)

### Objective
Implement two price-based sorting options that allow users to view products ordered by price in ascending (low to high) or descending (high to low) order. Handle price variations, discounts, and currency formatting appropriately.

### Sort Options Definition

#### Price: Low to High (Ascending)
Implement ascending price sort:
- Sort products by final price (after discounts)
- Lowest price products appear first
- Highest price products appear last
- URL parameter: sort=price_asc
- Label in dropdown: "Price: Low to High"

#### Price: High to Low (Descending)
Implement descending price sort:
- Sort products by final price (after discounts)
- Highest price products appear first
- Lowest price products appear last
- URL parameter: sort=price_desc
- Label in dropdown: "Price: High to Low"

### Price Calculation Logic

#### Base Price
Determine which price to use:
- Use selling price (not list price)
- Use current active price
- Handle products with no price (exclude or place at end)
- Consider price validity periods

#### Discount Handling
Calculate final price with discounts:
- Apply percentage discounts
- Apply fixed amount discounts
- Use lowest price from multiple discounts
- Consider promotional prices
- Use discount end date for validity

#### Variant Pricing
Handle products with variants:
- Use lowest variant price for "Low to High"
- Use highest variant price for "High to Low"
- OR use base product price
- Show price range in results (e.g., "Rs 1,000 - Rs 5,000")
- Consider showing "From Rs 1,000" label

#### Currency Considerations
Handle multi-currency scenarios (if applicable):
- Convert all prices to same currency for sorting
- Use user's selected currency or default
- Apply current exchange rates
- Store base currency in database

### Dropdown Integration

#### Menu Options
Add price options to dropdown:
- Position after "Relevance" option
- Group price options together
- Use clear, descriptive labels
- Add icons (optional): ↑ for low-high, ↓ for high-low
- Highlight selected option

#### Selection Behavior
When user selects price sort:
- Update dropdown button text
- Add sort parameter to URL
- Trigger results refetch
- Close dropdown
- Maintain filter state
- Scroll to top (optional)

### Backend Integration

#### API Request
Send price sort request:
- Include sort=price_asc or sort=price_desc parameter
- Pass all active filters
- Include pagination parameters
- Request page size

#### Database Query
Implement backend sorting:
- Order by final_price field (calculated)
- Use index on price field for performance
- Handle NULL prices (exclude or place at end)
- Apply to filtered result set
- Optimize query performance

#### Response Structure
Return sorted results:
- Products ordered by price
- Include price information in response
- Include discount information
- Paginate appropriately
- Include total count

### State Management

#### URL State
Manage price sort in URL:
- Add sort=price_asc or sort=price_desc parameter
- Replace existing sort parameter if present
- Preserve other parameters (filters, query)
- Handle browser navigation (back/forward)

#### Store State
Update Zustand store:
- Set current sort to price_asc or price_desc
- Trigger store listeners
- Update derived state
- Sync with URL

#### React Query Integration
Integrate with data fetching:
- Invalidate cache when sort changes
- Refetch with new sort parameter
- Show loading state during refetch
- Update cache with sorted results
- Handle refetch errors

### Visual Feedback

#### Dropdown Display
Show selected price sort:
- Update trigger button text
- Highlight selected option in menu
- Show icon for direction (↑ or ↓)
- Maintain visual consistency

#### Results Display
Display price-sorted results:
- Show price prominently on product cards
- Consider adding sort indicator above results
- Show "Sorted by: Price Low to High" text (optional)
- Ensure price is clearly visible

#### Loading State
During sort operation:
- Show loading spinner on results grid
- Fade out current results (optional)
- Keep dropdown accessible but disabled
- Show skeleton screens

### Edge Cases and Validation

#### Out of Stock Products
Handle out of stock items:
- Include in results but flag as unavailable
- Consider placing at end regardless of price
- Or maintain price order and show "Out of Stock"
- Respect "In Stock Only" filter if active

#### Products with No Price
Handle items without prices:
- Exclude from results (if appropriate)
- Place at end of results
- Show "Price Not Available" message
- Allow filtering these out

#### Sale Price Expiration
Handle expired discounts:
- Use regular price if discount expired
- Update sort order when prices change
- Cache invalidation strategy
- Real-time price updates (if applicable)

#### Price Range Products
For products with variants:
- Decide on single price for sorting
- Show price range in card (e.g., "Rs 1,000 - Rs 5,000")
- Consider "From Rs 1,000" label
- Sort by minimum price for low-high
- Sort by maximum price for high-low

### Performance Optimization

#### Database Indexing
Optimize database performance:
- Create index on final_price field
- Create composite index with other filter fields
- Analyze query performance
- Use explain plans to optimize
- Consider materialized views for complex pricing

#### Caching Strategy
Implement caching:
- Cache sorted results for common queries
- Set appropriate cache TTL
- Invalidate on price updates
- Use React Query cache effectively

### Testing Requirements

#### Test Case: Basic Price Sort
Verify basic functionality:
- Select "Price: Low to High"
- Verify products in ascending order
- Select "Price: High to Low"
- Verify products in descending order

#### Test Case: Discount Prices
Test with discounted products:
- Verify sort uses discounted price
- Check products with expired discounts
- Validate percentage vs fixed discounts

#### Test Case: Product Variants
Test variant pricing:
- Products with multiple variants
- Verify correct price used for sorting
- Check price range display

#### Test Case: Edge Cases
Test edge cases:
- Products with no price
- Out of stock products
- Zero-price products (free items)
- Very high prices (formatting)

#### Test Case: URL Parameters
Test URL integration:
- Verify sort=price_asc parameter added
- Check browser back/forward buttons
- Validate direct URL access with parameter

---

## Task 77: Create Sort by Newest

### Objective
Implement date-based sorting that displays the most recently added products first. This helps users discover new arrivals and latest additions to the product catalog.

### Sort Option Definition

#### Newest First Sort
Define the newest sort option:
- Sort products by creation date (descending)
- Most recent products appear first
- Oldest products appear last
- URL parameter: sort=date_desc
- Label in dropdown: "Newest First" or "New Arrivals"

### Date Field Selection

#### Primary Date Field
Determine which date to use:
- **Created Date** - When product added to catalog (primary)
- **Updated Date** - When product last modified (alternative)
- **Published Date** - When product made publicly available
- Choose most relevant for "newness" concept

#### Date Field Considerations
Consider various date scenarios:
- Products created in bulk imports
- Products updated frequently (don't always show as new)
- Draft products published later
- Products with future release dates

#### Recommended Approach
Use created date as primary field:
- Sort by product.created_at field
- Use published_at if available (when product went live)
- Ignore updated_at for "newest" sort
- Consider separate "Recently Updated" sort option (future)

### Dropdown Integration

#### Menu Option Addition
Add newest option to dropdown:
- Position after price options
- Use clear label: "Newest First" or "New Arrivals"
- Add icon (optional): calendar or star icon
- Highlight when selected

#### Selection Behavior
When user selects newest sort:
- Update dropdown trigger text
- Add sort=date_desc to URL
- Trigger results refetch
- Close dropdown
- Maintain other filters
- Consider scrolling to top

### Backend Implementation

#### API Request Structure
Send request with newest sort:
- Include sort=date_desc parameter
- Pass active filters
- Include pagination parameters
- Request appropriate page size

#### Database Query
Implement backend sorting:
- ORDER BY created_at DESC
- Use index on created_at field
- Filter by published status (only show published)
- Apply tenant filtering
- Optimize query performance

#### Response Structure
Return newest products:
- Products ordered by date (newest first)
- Include created_at or published_at in response
- Include "New" badge indicator (if recent)
- Paginate results
- Include total count

### State Management

#### URL State
Manage newest sort in URL:
- Add sort=date_desc parameter
- Replace existing sort parameter
- Preserve filter parameters
- Handle browser navigation

#### Store State
Update application state:
- Set current sort in Zustand store
- Trigger store listeners
- Sync with URL state
- Update UI accordingly

#### React Query Integration
Integrate with data fetching:
- Invalidate existing cache
- Refetch with date sort
- Show loading indicator
- Cache sorted results
- Handle errors

### Visual Enhancements

#### Dropdown Display
Show newest sort selection:
- Update trigger button
- Highlight in menu
- Show icon (optional)
- Clear visual feedback

#### Results Display
Display newest products:
- Consider adding "New" badge to recent items
- Show added date (optional): "Added 2 days ago"
- Highlight products added in last 7/14/30 days
- Use subtle visual indicator for newness

#### New Badge Logic
Implement "New" badge display:
- Show badge for products added in last 7 days (configurable)
- Calculate days since creation
- Display badge on product card
- Style badge prominently (color, position)
- Remove badge after threshold period

### Freshness Calculation

#### Define "New" Threshold
Set criteria for new products:
- Products added in last 7 days = "New"
- Products added 8-14 days ago = "Recent"
- Products older than 14 days = no badge
- Make threshold configurable

#### Dynamic Badge Display
Show appropriate badges:
- "NEW" badge for 0-7 days old
- "RECENT" badge for 8-14 days old (optional)
- No badge for older products
- Update badges based on current date

### Additional Features

#### Filter by Date Range (Future)
Consider adding date filters:
- Last 7 days
- Last 30 days
- Last 3 months
- Custom date range
- Combine with newest sort

#### Show Added Date (Optional)
Display when product was added:
- "Added 2 days ago"
- "Added March 15, 2026"
- Use relative time for recent items
- Use absolute date for older items
- Show in product card or details

### Performance Considerations

#### Database Optimization
Optimize date sorting:
- Create index on created_at field
- Create composite index with status field
- Use efficient date comparison
- Optimize pagination queries
- Monitor query performance

#### Caching Strategy
Implement caching:
- Cache newest products for short duration
- Invalidate cache when new products added
- Use React Query cache with staleTime
- Set appropriate cache TTL

### Testing Requirements

#### Test Case: Basic Newest Sort
Verify basic functionality:
- Select "Newest First" from dropdown
- Verify most recent products appear first
- Check URL has sort=date_desc parameter
- Confirm dropdown shows selection

#### Test Case: Date Order
Validate date ordering:
- Check products in correct chronological order
- Verify newest items at top
- Test with products added on same day
- Test with products spanning multiple dates

#### Test Case: New Badge Display
Test badge functionality:
- Verify badge shows for recent products
- Check badge doesn't show for old products
- Validate badge threshold (7 days)
- Test edge case: product added exactly 7 days ago

#### Test Case: Pagination
Test with pagination:
- Verify date order maintained across pages
- Check page 2 shows older products than page 1
- Validate date boundary handling

#### Test Case: Combined with Filters
Test with filters applied:
- Apply category filter + newest sort
- Apply price filter + newest sort
- Verify results match both criteria

---

## Task 78: Create Sort by Popular

### Objective
Implement popularity-based sorting that ranks products based on their sales performance, view count, and other engagement metrics. This helps users discover trending and best-selling products.

### Popularity Metrics Definition

#### Popularity Score Components
Define popularity calculation factors:
- **Sales Volume** - Total units sold (highest weight: 50%)
- **View Count** - Product page views (medium weight: 25%)
- **Add to Cart Rate** - How often added to cart (medium weight: 15%)
- **Wishlist Additions** - Times added to wishlist (low weight: 5%)
- **Rating** - Average customer rating (low weight: 5%)

#### Time Window Consideration
Determine time period for popularity:
- Last 30 days (recommended for freshness)
- Last 90 days (for broader trends)
- All time (for overall best sellers)
- Make configurable based on business needs

#### Score Calculation Method
Calculate combined popularity score:
- Normalize each metric to 0-100 scale
- Multiply by weight factor
- Sum all weighted scores
- Normalize final score to 0-100
- Sort by final score (descending)

### Sort Option Definition

#### Popular Sort Setting
Define the popular sort option:
- Sort products by popularity score (descending)
- Most popular products appear first
- Least popular products appear last
- URL parameter: sort=popularity_desc
- Label in dropdown: "Most Popular" or "Trending"

### Dropdown Integration

#### Menu Option Addition
Add popular option to dropdown:
- Position after "Newest First" option
- Use label: "Most Popular" or "Trending"
- Add icon (optional): fire, star, or trending icon
- Highlight when selected

#### Selection Behavior
When user selects popular sort:
- Update dropdown trigger text
- Add sort=popularity_desc to URL
- Trigger results refetch
- Close dropdown
- Maintain active filters

### Backend Implementation

#### Database Schema
Store popularity metrics:
- Create product_metrics table or fields
- Store sales_count, view_count, cart_additions
- Store wishlist_count, rating_average
- Store calculated popularity_score
- Index on popularity_score field

#### Popularity Score Calculation
Calculate scores in backend:
- Run periodic job (daily or hourly)
- Calculate scores for all products
- Update popularity_score field
- Use time window (last 30 days)
- Handle products with no data (score = 0)

#### API Request Structure
Send request with popular sort:
- Include sort=popularity_desc parameter
- Pass active filters
- Include pagination parameters
- Request appropriate page size

#### Database Query
Implement backend sorting:
- ORDER BY popularity_score DESC
- Use index on popularity_score field
- Apply filters before sorting
- Optimize query performance
- Handle NULL scores (place at end)

### Popularity Indicators

#### Visual Badges
Show popularity indicators:
- "BESTSELLER" badge for top 10% products
- "TRENDING" badge for rapidly growing popularity
- "HOT" badge for high recent activity
- Position badge on product card
- Style prominently with color/icon

#### Badge Logic
Define badge criteria:
- Bestseller: popularity_score >= 80
- Trending: score increased >50% in last week
- Hot: high view/cart rate in last 3 days
- Allow multiple badges per product

#### Popularity Display (Optional)
Consider showing metrics:
- "X people bought this"
- "Viewed by Y customers"
- "Top seller in [category]"
- Social proof text
- Display in product card or details

### State Management

#### URL State
Manage popular sort in URL:
- Add sort=popularity_desc parameter
- Replace existing sort parameter
- Preserve filter parameters
- Handle browser navigation

#### Store State
Update application state:
- Set current sort in Zustand store
- Trigger store listeners
- Sync with URL
- Update UI components

#### React Query Integration
Integrate with data fetching:
- Invalidate cache when sort changes
- Refetch with popularity sort
- Show loading state
- Cache sorted results
- Handle errors

### Popularity Calculation Service

#### Metrics Collection
Collect popularity data:
- Track product views (analytics)
- Count sales from orders table
- Count cart additions from events
- Count wishlist additions
- Calculate average ratings

#### Score Update Job
Implement background job:
- Run daily or hourly (based on traffic)
- Query metrics for each product
- Calculate popularity scores
- Update product_metrics table
- Log calculation for debugging

#### Real-time vs Batch
Choose update strategy:
- Batch: Calculate scores periodically (recommended)
- Real-time: Update on each event (resource intensive)
- Hybrid: Batch calculation + cache invalidation
- Balance freshness vs performance

### Edge Cases

#### New Products
Handle products with no history:
- Default score = 0 or base score (e.g., 10)
- Consider "new product boost" for first 7 days
- Gradually decay boost over time
- Avoid penalizing new products too heavily

#### Seasonal Products
Handle seasonal variations:
- Track seasonal patterns
- Apply seasonal adjustments to scores
- Consider year-over-year comparisons
- Identify trending products

#### Out of Stock Products
Handle unavailable products:
- Reduce popularity score or exclude
- Show but mark as unavailable
- Move to end of results
- Consider "restock notification" option

### Performance Optimization

#### Database Indexing
Optimize queries:
- Create index on popularity_score
- Create composite indexes with filters
- Use partial indexes for popular products
- Optimize score calculation queries

#### Caching Strategy
Implement caching:
- Cache popularity scores (update daily)
- Cache sorted results for common queries
- Use React Query cache with longer staleTime
- Set appropriate TTL based on update frequency

### Testing Requirements

#### Test Case: Basic Popular Sort
Verify basic functionality:
- Select "Most Popular" from dropdown
- Verify high-score products appear first
- Check URL has sort=popularity_desc
- Confirm dropdown shows selection

#### Test Case: Score Ordering
Validate score-based ordering:
- Check products ordered by popularity_score
- Verify scores calculated correctly
- Test with various score ranges
- Confirm descending order

#### Test Case: Popularity Badges
Test badge display:
- Verify "Bestseller" badge on top products
- Check "Trending" badge logic
- Validate badge thresholds
- Test multiple badges per product

#### Test Case: New Products
Test new product handling:
- New product with no sales/views
- Verify score calculation or default
- Check positioning in results

#### Test Case: Score Updates
Test score calculation:
- Add sales for a product
- Run score update job
- Verify score increased
- Check sort order updated

---

## Task 79: Create Mobile Filter Button

### Objective
Create a compact, touch-friendly filter button for mobile devices that opens the filter drawer. The button should display the number of active filters as a badge, providing quick visual feedback about applied filters.

### Button Design and Placement

#### Button Location
Position the filter button:
- Place in mobile results toolbar (top of page)
- Position on the left side of toolbar
- Align horizontally with sort dropdown
- Fixed position or scrolls with content (decide)
- Visible at all times on mobile view

#### Button Size and Shape
Design button dimensions:
- Minimum height: 44px (touch-friendly)
- Minimum width: 120px for text + icon
- Rounded corners (4-8px radius)
- Comfortable padding (12px horizontal, 10px vertical)
- Border: 1px solid border color
- Background: white or subtle color

#### Button Content Structure
Structure button content:
- Filter icon (hamburger lines or funnel icon)
- Text label: "Filters"
- Active count badge (if filters applied)
- Proper spacing between elements
- Center-aligned content

### Visual Design

#### Icon Selection
Choose appropriate icon:
- Funnel icon (common filter representation)
- Three horizontal lines (alternative)
- Adjustable sliders icon (alternative)
- Size: 20-24px
- Position: left of text
- Color: matches theme

#### Text Label
Design text label:
- Label: "Filters" or "Filter"
- Font size: 14-16px
- Font weight: medium (500)
- Color: text primary color
- Position: right of icon, left of badge

#### Badge Component
Design active filter badge:
- Position: top-right of button or right side
- Shape: small circle or rounded rectangle
- Background: accent color (blue, red)
- Text color: white
- Font size: 12px
- Font weight: bold
- Displays number: "3" for 3 active filters

### Badge Logic

#### Count Calculation
Calculate active filter count:
- Count selected category filters
- Count selected brand filters
- Count selected size/color/attribute filters
- Include price range (if not default)
- Include availability filter (if checked)
- Do NOT count search query as filter

#### Badge Display Conditions
Show badge when:
- One or more filters are active (count >= 1)
- Hide badge when count = 0
- Update count dynamically when filters change
- Animate badge when count changes

#### Badge Positioning
Position badge appropriately:
- Top-right corner of button (overlapping)
- OR right side inside button (inline)
- Use absolute positioning for overlap
- Ensure visible and not cut off
- Z-index above button content

### Interaction Behavior

#### Touch Target
Ensure touch-friendly interaction:
- Entire button is tappable (44x44px minimum)
- No nested clickable elements
- Clear tap feedback (ripple or color change)
- No delays or lag on tap

#### Tap Feedback
Provide visual feedback:
- Background color change on tap
- Scale animation (slight shrink)
- Ripple effect (Material Design style)
- Quick response time (<100ms)

#### Opening Drawer
When button is tapped:
- Open mobile filter drawer from left or bottom
- Smooth slide animation (300ms)
- Lock body scroll (prevent background scrolling)
- Darken background with overlay
- Focus management to drawer

### State Management

#### Button State
Maintain button state:
- Active filter count (from Zustand store)
- Drawer open/closed state
- Disabled state (if no results)
- Loading state (if applicable)

#### Connect to Filter Store
Integrate with global state:
- Subscribe to filter state changes
- Recalculate badge count on filter updates
- Update badge display reactively
- Sync with URL parameters

#### URL Synchronization
Keep in sync with URL:
- Read filters from URL on mount
- Calculate count from URL parameters
- Update when URL changes (back/forward)
- Maintain consistency

### Responsive Behavior

#### Visibility Rules
Control button visibility:
- Hidden on desktop (≥768px): display: none
- Visible on tablet and mobile (<768px): display: flex
- Use media queries or Tailwind responsive classes
- Smooth transition between breakpoints

#### Desktop Alternative
On desktop screens:
- Hide mobile filter button
- Show desktop filter sidebar or dropdowns
- Maintain separate filter UI
- Share same filter state

### Accessibility Requirements

#### Keyboard Support
Ensure keyboard accessibility:
- Button focusable with Tab key
- Enter or Space key opens drawer
- Visible focus indicator (outline/ring)
- Skip link to jump to filters (optional)

#### Screen Reader Support
Add ARIA attributes:
- aria-label="Open filters" or "Filters"
- aria-expanded="false" (updates when drawer opens)
- aria-controls="filter-drawer-id"
- Announce badge count: "3 active filters"
- Use aria-live for badge updates (optional)

#### Focus Management
Manage focus properly:
- Focus moves to drawer when opened
- Focus returns to button when drawer closed
- Focus trap within drawer (see Task 80)
- Clear focus indicators

### Integration with Drawer

#### Opening Trigger
Button triggers drawer:
- onClick handler opens drawer
- Update drawer state in store or local state
- Pass filter state to drawer
- Drawer displays current filters

#### Badge Updates from Drawer
Update badge when filters change:
- Listen to filter changes in drawer
- Recalculate count when filters applied
- Update badge immediately
- Animate count change

#### Closing from Drawer
When drawer closes:
- Badge reflects applied filters
- Button returns to normal state
- Focus returns to button
- Body scroll re-enabled

### Testing Requirements

#### Test Case: Button Display
Verify button appearance:
- Button visible on mobile
- Button hidden on desktop
- Correct icon, text, spacing
- Touch target size adequate

#### Test Case: Badge Count
Test badge logic:
- Badge hidden when no filters active
- Badge shows correct count (1, 2, 3...)
- Badge updates when filters change
- Badge animates on count change

#### Test Case: Opening Drawer
Test drawer opening:
- Tap button opens drawer
- Drawer slides in smoothly
- Background overlay appears
- Body scroll locked

#### Test Case: Accessibility
Test accessibility features:
- Button focusable with keyboard
- Enter key opens drawer
- Screen reader announces correctly
- ARIA attributes present

---

## Task 80: Create Mobile Filter Drawer

### Objective
Create a full-featured mobile filter drawer that slides in from the left side or bottom of the screen, containing all filter controls from the desktop sidebar. The drawer should be touch-optimized, provide a great mobile experience, and include Apply and Clear All buttons.

### Drawer Structure and Layout

#### Drawer Container
Create the main drawer container:
- Full height or partial height (bottom sheet)
- Width: 80-90% of screen (side drawer) OR full width (bottom)
- Slide-in animation from left or bottom
- Overlay backdrop (dark semi-transparent)
- Z-index above all other content
- Use Shadcn/UI Sheet component

#### Drawer Header
Design the header section:
- Title: "Filters"
- Close button (X icon) on right side
- Height: 60px
- Sticky position (stays visible when scrolling)
- Border bottom for separation
- Background: white or subtle color

#### Drawer Body
Design the main content area:
- Scrollable content area (filters)
- Padding: 16-20px
- All filter controls from desktop sidebar
- Organized in vertical stack
- Proper spacing between sections
- Touch-optimized controls

#### Drawer Footer
Design the footer section:
- "Clear All" button (left or secondary)
- "Apply Filters" button (right or primary)
- Height: 70-80px
- Sticky position (stays visible when scrolling)
- Border top for separation
- Padding: 16px
- Background: white or subtle color

### Filter Controls Content

#### Include All Desktop Filters
Port all filters to drawer:
- **Category Filter** - Collapsible list or dropdown
- **Price Range Slider** - Touch-friendly slider
- **Brand Checkboxes** - Scrollable checkbox list
- **Size Buttons** - Touch-friendly button group
- **Color Swatches** - Touch-friendly color grid
- **Availability Toggle** - In Stock Only switch
- **Sort Options** - Radio button group (optional)
- **Custom Attributes** - Any additional filters

#### Filter Section Organization
Organize filters logically:
- Each filter in its own section
- Collapsible sections (accordion style)
- Section headers with expand/collapse icon
- Initially: primary filters expanded, others collapsed
- Smooth expand/collapse animation

#### Touch-Optimized Controls
Adapt for touch:
- Larger tap targets (44x44px minimum)
- Checkbox size: 24x24px
- Button size: 48x48px height
- Slider thumb size: 32x32px
- Comfortable spacing: 12-16px between items
- No hover states (use active states)

### Animation and Transitions

#### Opening Animation
Animate drawer opening:
- Slide in from left (or bottom) - 300ms
- Ease-out timing function
- Overlay fades in simultaneously
- Body scroll locks immediately
- Smooth, performant animation

#### Closing Animation
Animate drawer closing:
- Slide out to left (or bottom) - 300ms
- Ease-in timing function
- Overlay fades out simultaneously
- Body scroll unlocks after animation
- Return focus to trigger button

#### Internal Animations
Animate internal elements:
- Section expand/collapse: 200ms
- Badge count updates: fade/scale
- Loading states: pulse or spinner
- Smooth transitions for better UX

### Interaction Behavior

#### Opening the Drawer
Drawer opens when:
- Mobile filter button tapped
- Filter chip/tag tapped (from results)
- Other trigger elements tapped

#### Closing the Drawer
Drawer closes when:
- Close (X) button tapped
- "Apply Filters" button tapped
- Background overlay tapped
- Swipe down gesture (bottom sheet)
- Escape key pressed (keyboard)
- Browser back button (optional)

#### Background Overlay
Implement overlay:
- Dark semi-transparent background (rgba(0,0,0,0.5))
- Covers entire screen behind drawer
- Tapping overlay closes drawer
- Prevents interaction with content behind
- Smooth fade in/out transition

#### Scroll Behavior
Handle scrolling:
- Lock body scroll when drawer open
- Enable scroll within drawer body
- Header and footer stay fixed
- Smooth scroll within content
- Prevent overscroll bounce (iOS)

### Apply and Clear Buttons

#### Apply Filters Button
Design primary action button:
- Label: "Apply Filters" or "Show Results (X)"
- Position: right side of footer
- Style: primary button (accent color)
- Full-width option on small screens
- Shows result count: "Show 24 Results"
- Closes drawer and applies filters

#### Clear All Button
Design secondary action button:
- Label: "Clear All" or "Reset"
- Position: left side of footer
- Style: secondary button (outline or ghost)
- Clears all active filters
- Closes drawer (optional) or stays open
- Resets URL parameters

#### Button Behavior

**Apply Button Action:**
- Update URL with filter parameters
- Close drawer with animation
- Trigger results refetch
- Show loading state in results
- Scroll to top of results
- Return focus to filter button

**Clear Button Action:**
- Remove all filter selections
- Reset to default state
- Update URL (remove filter params)
- Keep drawer open to allow reselection
- Optionally: prompt confirmation
- Update result count preview

#### Result Count Preview
Show count in Apply button:
- Calculate result count with current filters
- Display in button: "Show 24 Results"
- Update count as filters change
- Use debounced API call for count
- Show loading state while calculating
- Fallback: "Apply Filters" if count unavailable

### State Management

#### Drawer State
Manage drawer open/closed:
- Use local React state or Zustand store
- Boolean: isDrawerOpen
- Update when opening/closing
- Sync with body scroll lock
- Manage focus trap

#### Filter State
Manage filter selections:
- Read from Zustand filter store
- Display current filter values
- Update store when user changes filters
- Keep local state until "Apply" tapped
- OR update immediately (no apply button needed)

#### URL Synchronization
Sync with URL on apply:
- Update URL when Apply button tapped
- Add/update filter query parameters
- Preserve search query parameter
- Use Next.js router shallow routing
- Handle browser back/forward

### Body Scroll Lock

#### Prevent Background Scroll
Implement scroll lock:
- Lock body scroll when drawer opens
- Use CSS: overflow: hidden on body
- OR use scroll lock library (body-scroll-lock)
- Handle iOS quirks (position: fixed issues)
- Restore scroll position on close

#### Allow Drawer Scroll
Enable internal scrolling:
- Drawer body should scroll normally
- Use overflow-y: auto on drawer content
- Header and footer stay fixed
- Smooth scrolling experience
- Handle overscroll behavior

### Touch Gestures

#### Swipe to Close (Optional)
Implement swipe gesture:
- Swipe down to close (bottom sheet)
- Swipe left to close (side drawer)
- Threshold: 50-100px
- Velocity considered for quick swipes
- Smooth animation following finger
- Release snaps to closed or open

#### Pull-to-Close Indicator
Add visual indicator:
- Small handle at top (bottom sheet)
- Draggable header area
- Shows user they can swipe
- Follows finger during drag

### Responsive Behavior

#### Mobile Visibility
Control drawer visibility:
- Only shown on mobile/tablet (<768px)
- Desktop uses sidebar (≥768px)
- Use media queries for detection
- Consistent breakpoints with button

#### Orientation Handling
Handle device orientation:
- Portrait: full or 3/4 height
- Landscape: adjust height/width for visibility
- Ensure all content accessible
- Reflow content if needed

### Accessibility Requirements

#### Keyboard Navigation
Support keyboard interaction:
- Tab through all focusable elements
- Escape key closes drawer
- Enter/Space on buttons triggers action
- Arrow keys navigate options (radio/select)
- Focus trap within drawer when open

#### Screen Reader Support
Add ARIA attributes:
- role="dialog"
- aria-modal="true"
- aria-labelledby="drawer-title"
- aria-describedby (if description needed)
- Announce drawer open/close
- Announce filter count updates

#### Focus Management
Manage focus appropriately:
- Focus moves to drawer when opened (close button or first filter)
- Focus trap within drawer (no escape to background)
- Focus returns to trigger button when closed
- Clear focus indicators on all controls
- Skip link to footer buttons (optional)

### Performance Considerations

#### Lazy Rendering
Optimize rendering:
- Render drawer only when needed
- Use conditional rendering (isOpen && <Drawer>)
- Unmount when closed to free memory
- Pre-render in hidden state (alternative)

#### Animation Performance
Ensure smooth animations:
- Use transform and opacity (GPU accelerated)
- Avoid animating layout properties
- Use will-change: transform sparingly
- Test on low-end devices
- 60fps target

### Integration with Filter Store

#### Reading Filter State
Read current filters:
- Connect to Zustand filter store
- Display current selections in controls
- Show count of active filters in header
- Sync with URL parameters

#### Updating Filter State
Update filters when changed:
- Option 1: Update store immediately (live filtering)
- Option 2: Keep local state, update on Apply
- Recommended: Option 2 for better control
- Batch updates for performance

### Testing Requirements

#### Test Case: Drawer Opening
Verify drawer opens:
- Tap mobile filter button
- Drawer slides in smoothly
- Overlay appears
- Body scroll locked
- Focus moves to drawer

#### Test Case: Filter Interactions
Test filter controls:
- Select category filter
- Adjust price range slider
- Check brand checkboxes
- Select size buttons
- Toggle availability switch

#### Test Case: Apply Filters
Test apply functionality:
- Change filters in drawer
- Tap "Apply Filters" button
- Drawer closes
- URL updated with parameters
- Results refetch and update

#### Test Case: Clear All
Test clear functionality:
- Select multiple filters
- Tap "Clear All" button
- All filters reset
- URL parameters removed
- Result count updates

#### Test Case: Closing Behavior
Test all close methods:
- Tap close (X) button
- Tap background overlay
- Press Escape key
- Swipe down (if implemented)
- All methods close drawer properly

#### Test Case: Accessibility
Test accessibility features:
- Tab through all controls
- Escape closes drawer
- Focus trap works
- Screen reader announces correctly
- Focus returns on close

---

## Quality Assurance and Testing

### Comprehensive Testing Strategy

#### Unit Testing
Test individual components:
- Sort dropdown component
- Mobile filter button component
- Mobile drawer component
- Badge count calculation
- Sort algorithms
- Filter state management

#### Integration Testing
Test component interactions:
- Sort selection updates URL and results
- Filter button opens drawer
- Drawer filter changes update store
- Apply button closes drawer and updates results
- Clear button resets all filters

#### Responsive Testing
Test across devices:
- Desktop (≥1024px) - dropdown visible, drawer hidden
- Tablet (768-1023px) - mobile button visible
- Mobile (320-767px) - mobile button and drawer
- Test breakpoint transitions
- Test orientation changes

#### Cross-Browser Testing
Test browser compatibility:
- Chrome (desktop and mobile)
- Safari (desktop and mobile)
- Firefox (desktop and mobile)
- Edge (desktop)
- Test on actual devices, not just emulators

#### Performance Testing
Test performance metrics:
- Animation smoothness (60fps)
- Scroll performance in drawer
- API response time for sorted results
- Result count calculation speed
- Memory usage and leaks

### User Acceptance Testing

#### User Scenarios
Test complete user workflows:
1. User searches for "running shoes"
2. User sorts by "Price: Low to High"
3. User opens mobile filter drawer
4. User selects brand filter
5. User adjusts price range
6. User taps "Apply Filters"
7. User sees filtered, sorted results

#### Usability Testing
Evaluate user experience:
- Can users find sort options easily?
- Is mobile filter button obvious?
- Do users understand badge count?
- Is drawer easy to use?
- Are Apply/Clear buttons clear?
- Overall satisfaction score

---

## Implementation Best Practices

### Code Organization

#### Component Structure
Organize components:
- Sort dropdown: SearchSortDropdown.tsx
- Mobile button: MobileFilterButton.tsx
- Mobile drawer: MobileFilterDrawer.tsx
- Shared: FilterContent.tsx (used by desktop and mobile)
- Utils: sortUtils.ts, filterUtils.ts

#### State Management
Organize state:
- Zustand store: searchStore.ts
- Actions: setSort, toggleFilter, clearFilters
- Selectors: getSortOption, getActiveFilterCount
- Persist sort preference (optional)

#### Styling Approach
Organize styles:
- Use Tailwind CSS utility classes
- Create custom classes for complex styles
- Use CSS modules for component-specific styles
- Responsive utilities for breakpoints
- Dark mode support (if applicable)

### Performance Optimization

#### Lazy Loading
Implement lazy loading:
- Lazy load drawer component (React.lazy)
- Load only when user taps filter button
- Reduce initial bundle size
- Show loading state if needed

#### Debouncing
Use debouncing for:
- Result count calculation (300ms)
- Price range slider updates (500ms)
- Search input (if in drawer) (300ms)
- Prevent excessive API calls

#### Memoization
Use React memoization:
- Memoize sort options array
- Memoize filter count calculation
- Use React.memo for components
- Use useMemo for expensive calculations
- Use useCallback for event handlers

### Error Handling

#### API Errors
Handle sorting/filtering errors:
- Show error toast notification
- Fall back to previous sort/filter state
- Allow user to retry
- Log error for debugging
- Provide helpful error messages

#### Invalid States
Handle edge cases:
- Invalid sort parameter in URL
- Conflicting filter values
- No results for filters
- API timeout or network error
- Gracefully degrade functionality

---

## Documentation and Handoff

### Developer Documentation

#### Component API
Document component props:
- SortDropdown component props and usage
- MobileFilterButton props and customization
- MobileFilterDrawer props and configuration
- Event handlers and callbacks
- Example usage code

#### State Management
Document store structure:
- Sort state shape and types
- Filter state shape and types
- Actions and their parameters
- Selectors and their return types
- How to extend with new filters

#### Integration Guide
Provide integration instructions:
- How to add to search page
- How to connect to API
- How to customize sort options
- How to add new filters
- How to style components

### User Documentation

#### User Guide
Create user-facing guide:
- How to sort search results
- How to use mobile filters
- What each sort option does
- How to clear filters
- Tips for best results

#### Help Text
Add in-app help:
- Tooltips for sort options
- Help text in filter drawer
- Empty state messages
- Loading state messages
- Error messages

---

## Future Enhancements

### Potential Improvements

#### Advanced Sort Options
Consider adding:
- Sort by rating (if reviews implemented)
- Sort by discount percentage
- Sort by brand name
- Multiple sort criteria
- Custom sort order (saved preferences)

#### Filter Enhancements
Consider adding:
- Recently viewed filters
- Saved filter sets
- Smart filters (based on search query)
- Filter recommendations
- Quick filter chips above results

#### Mobile UX Improvements
Consider implementing:
- Swipe gestures for drawer
- Haptic feedback on interactions
- Voice search integration
- Filter history (recently used)
- Persistent filter bar (sticky)

#### Analytics Integration
Track user behavior:
- Which sort options most used
- Which filters most used
- Conversion rate by sort method
- Time to find product
- A/B test different layouts

---

## Conclusion

### Summary
This document provides comprehensive instructions for implementing sort functionality and mobile filter interface for the webstore search experience. The implementation includes five sort options (Relevance, Price Low/High, Newest, Popular), a desktop sort dropdown, a mobile filter button with active count badge, and a full-featured mobile filter drawer.

### Key Deliverables
1. ✅ Sort dropdown component with 5 options
2. ✅ Relevance sort algorithm (default)
3. ✅ Price sort (ascending and descending)
4. ✅ Newest first sort
5. ✅ Popular/trending sort
6. ✅ Mobile filter button with badge
7. ✅ Mobile filter drawer with Apply/Clear

### Success Criteria
- All sort options work correctly
- Mobile filter interface is intuitive and easy to use
- Performance is smooth (60fps animations)
- Accessibility requirements met (keyboard, screen reader)
- Cross-browser and cross-device compatibility
- URL state properly synchronized
- Results update correctly when sorting/filtering

### Next Steps
After completing these tasks:
1. Test thoroughly across devices and browsers
2. Conduct user testing for feedback
3. Optimize performance based on metrics
4. Implement analytics tracking
5. Document any issues or improvements
6. Plan for future enhancements

---

**Document End**

*For questions or clarifications, refer to the Group-E Overview document or contact the development team.*
