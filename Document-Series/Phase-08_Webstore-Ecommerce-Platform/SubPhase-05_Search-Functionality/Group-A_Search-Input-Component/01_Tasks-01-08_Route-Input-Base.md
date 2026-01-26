# Tasks 01-08: Search Route and Input Component Base

> **Phase:** 08 - Webstore & E-commerce Platform  
> **SubPhase:** 05 - Search Functionality  
> **Group:** A - Search Input Component  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-15_Search-Suggestions.md](02_Tasks-09-15_Search-Suggestions.md)

---

## Document Overview

This document covers the foundational setup for the webstore search functionality, including the search route structure, page layout, loading states, and the core SearchInput component with its icon button and input field sub-components. This establishes the base infrastructure for product search that will be enhanced with suggestions, filters, and results in subsequent documents.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Search Directory | Low | 10 min |
| 02 | Create Search Results Page Route | Low | 20 min |
| 03 | Create Search Page Layout | Medium | 30 min |
| 04 | Create Search Loading State | Low | 20 min |
| 05 | Create Search Component Directory | Low | 10 min |
| 06 | Create SearchInput Component | Medium | 35 min |
| 07 | Create Search Icon Button | Low | 25 min |
| 08 | Create Input Field | Low | 25 min |

---

## Task 01: Create Search Directory

### Overview
Create the dedicated search directory in the Next.js App Router structure. This directory will house the search page route and serve as the container for all search-related pages. The search functionality uses query parameters (`?q=query`) rather than dynamic segments, allowing users to bookmark and share search URLs easily.

### Dependencies
- SubPhase-04 (Product Display Pages) must be complete
- Next.js App Router structure is established
- Frontend webstore project is initialized

### Instructions

1. **Navigate to the webstore app directory**
   - Go to `frontend/app/(webstore)/` directory
   - This is where customer-facing pages are organized
   - Verify the (webstore) route group exists

2. **Create the search directory**
   - Create a new directory named `search`
   - This directory will contain the search page route
   - Do not use parentheses (it's a real URL path)

3. **Understand URL structure**
   - The search page will be accessible at `/search`
   - Query parameters will be used: `/search?q=laptop`
   - This allows clean, shareable search URLs
   - Users can bookmark specific searches

4. **Plan directory contents**
   - This directory will contain:
     - `page.tsx` - Main search results page (Task 02)
     - `layout.tsx` - Optional search-specific layout (Task 03)
     - `loading.tsx` - Loading state (Task 04)
     - Component imports from shared components directory

### Directory Purpose

| Feature | Benefit |
|---------|---------|
| Dedicated Route | Clean `/search` URL path |
| Query Parameters | Bookmarkable search results |
| Isolated Structure | Separate from product pages |
| Organization | Central location for search features |

### Directory Structure
```
frontend/app/(webstore)/
├── search/                  # Search directory
│   ├── page.tsx            # (Created in Task 02)
│   ├── layout.tsx          # (Created in Task 03)
│   └── loading.tsx         # (Created in Task 04)
├── products/               # (From SubPhase-04)
├── cart/                   # (From other SubPhases)
└── layout.tsx              # Webstore layout
```

### URL Structure Comparison

| Approach | URL Example | Bookmarkable | SEO |
|----------|-------------|--------------|-----|
| Query Params (Used) | `/search?q=laptop&category=electronics` | ✓ Yes | ✓ Good |
| Dynamic Segment | `/search/laptop` | ✓ Yes | ✓ Excellent |
| Mixed Approach | `/search/laptop?filter=price` | ✓ Yes | ✓ Excellent |

Note: We use query parameters for flexibility with multiple filters.

### Search URL Examples

| URL | Description |
|-----|-------------|
| `/search` | Empty search page |
| `/search?q=laptop` | Search for "laptop" |
| `/search?q=laptop&category=electronics` | Filtered search |
| `/search?q=phone&sort=price_asc` | Sorted search |

### Expected Outcome
- Search directory created in correct location
- Foundation for search page route
- Organized structure for search features

### Verification Checklist
- [ ] `frontend/app/(webstore)/search/` directory exists
- [ ] Directory is directly under `(webstore)/` route group
- [ ] Directory name is lowercase `search` (not Search)
- [ ] Directory structure ready for page components

---

## Task 02: Create Search Results Page Route

### Overview
Create the main search results page component that displays search results based on query parameters. This page handles URL query extraction, fetches matching products from the API, and displays them in a grid layout with filters and sorting options.

### Dependencies
- Task 01: Create Search Directory

### Instructions

1. **Create page.tsx file**
   - Navigate to `frontend/app/(webstore)/search/` directory
   - Create new file named `page.tsx`
   - This is the main search results page component

2. **Define page component as async server component**
   - Export default async function `SearchPage`
   - Accept `searchParams` prop from Next.js
   - This enables server-side rendering of search results

3. **Extract search parameters**
   - Get query parameter `q` from searchParams
   - Get optional `category` filter from searchParams
   - Get optional `sort` parameter from searchParams
   - Get optional `page` parameter for pagination

4. **Define TypeScript interface for searchParams**
   - Create interface with optional string properties
   - Include `q`, `category`, `sort`, `page` parameters
   - Handle array values (Next.js can pass string[])

5. **Implement search logic structure**
   - Check if query parameter exists
   - Fetch products from API based on search query
   - Handle empty search state
   - Handle no results state

6. **Structure page layout sections**
   - Search header with query display
   - SearchInput component for new searches
   - Filters sidebar (placeholder for now)
   - Results grid with product cards
   - Pagination controls

7. **Set up metadata generation**
   - Export generateMetadata async function
   - Set dynamic page title based on search query
   - Include query in meta description
   - Configure Open Graph tags for sharing

8. **Handle error states**
   - API failure handling
   - Invalid query handling
   - Network error handling
   - Display user-friendly error messages

### Page Component Props

| Prop | Type | Description |
|------|------|-------------|
| searchParams | Promise<SearchParams> | URL query parameters |

### SearchParams Interface

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| q | string | No | "" | Search query text |
| category | string | No | "all" | Category filter |
| sort | string | No | "relevance" | Sort order |
| page | string | No | "1" | Current page |

### Page Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Search for "laptop"               [SearchBox]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────┐  ┌──────────────────────────────┐ │
│  │ Filters │  │  Results: 24 products found  │ │
│  │         │  │                              │ │
│  │ Category│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐│ │
│  │ Price   │  │  │ P1 │ │ P2 │ │ P3 │ │ P4 ││ │
│  │ Brand   │  │  └────┘ └────┘ └────┘ └────┘│ │
│  │ Rating  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐│ │
│  │         │  │  │ P5 │ │ P6 │ │ P7 │ │ P8 ││ │
│  │         │  │  └────┘ └────┘ └────┘ └────┘│ │
│  │         │  │                              │ │
│  └─────────┘  │  [Pagination]                │ │
│               └──────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Search Flow Diagram

```
User enters URL with ?q=laptop
         ↓
SearchPage component receives searchParams
         ↓
Extract query, filters, sort parameters
         ↓
Fetch products from API (/api/products/search)
         ↓
    ┌─── Success ───┐
    │               │
    ↓               ↓
Display results   Handle errors
with filters      Show message
and pagination
```

### API Integration Points

| API Endpoint | Method | Purpose |
|--------------|--------|---------|
| `/api/products/search` | GET | Search products |
| `/api/products/categories` | GET | Get filter options |
| `/api/products/brands` | GET | Get brand filters |

### Search States to Handle

| State | Condition | Display |
|-------|-----------|---------|
| Empty Search | No `q` parameter | Show popular products / categories |
| Loading | Fetching data | Show loading skeleton |
| Results Found | Products returned | Show product grid |
| No Results | Empty array | Show "No products found" message |
| Error | API failure | Show error message with retry |

### Metadata Configuration

| Field | Value | Purpose |
|-------|-------|---------|
| Title | `Search: {query} \| LCC Webstore` | Browser tab title |
| Description | `Search results for {query}` | SEO description |
| Robots | `noindex, follow` | Prevent search result indexing |
| OpenGraph | Include query and image | Social sharing |

### Expected Outcome
- Functional search results page
- Server-side rendering of search results
- Query parameter extraction working
- Basic page structure ready for components
- Metadata generation configured

### Verification Checklist
- [ ] `frontend/app/(webstore)/search/page.tsx` file created
- [ ] Page component exports as default
- [ ] searchParams prop accepted and typed
- [ ] Query parameter extraction implemented
- [ ] Page structure with header, results, filters defined
- [ ] Metadata generation function exported
- [ ] Error states planned and structured
- [ ] Page accessible at `/search` route

---

## Task 03: Create Search Page Layout

### Overview
Create a dedicated layout component for the search page that provides consistent structure, including a sticky search input bar, responsive grid system for filters and results, and optimized spacing. This layout ensures the search experience is cohesive and user-friendly across all device sizes.

### Dependencies
- Task 02: Create Search Results Page Route

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(webstore)/search/` directory
   - Create new file named `layout.tsx`
   - This layout wraps the search page content

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import any layout-specific components
   - Import Tailwind CSS utilities if needed

3. **Define layout component structure**
   - Export default function `SearchLayout`
   - Accept `children` prop of type ReactNode
   - Return JSX with structured sections

4. **Implement sticky search header**
   - Create header section for search input
   - Apply sticky positioning for scroll persistence
   - Set z-index to keep above content
   - Add background and shadow on scroll

5. **Create main content area structure**
   - Use two-column layout with sidebar and main
   - Left column: Filters (desktop) / Drawer (mobile)
   - Right column: Search results and pagination
   - Implement responsive breakpoints

6. **Configure responsive behavior**
   - Mobile (<768px): Single column, collapsible filters
   - Tablet (768px-1024px): Two columns, narrow sidebar
   - Desktop (>1024px): Two columns, full sidebar

7. **Add scroll behavior handling**
   - Implement smooth scrolling
   - Handle sticky header on scroll
   - Preserve scroll position on filter changes
   - Restore scroll on back navigation

8. **Set up grid system**
   - Define product grid responsive columns
   - Mobile: 1-2 columns
   - Tablet: 2-3 columns
   - Desktop: 3-4 columns

### Layout Component Structure

```
┌─────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────┐ │
│  │   Sticky Search Header (SearchInput)     │ │ ← Sticky
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌────────────┬──────────────────────────────┐ │
│  │            │                              │ │
│  │  Filters   │      {children}              │ │
│  │  Sidebar   │   (Search Results Page)      │ │
│  │            │                              │ │
│  │  - Category│                              │ │
│  │  - Price   │                              │ │
│  │  - Brand   │                              │ │
│  │  - Rating  │                              │ │
│  │            │                              │ │
│  └────────────┴──────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Layout Sections

| Section | Component | Position | Purpose |
|---------|-----------|----------|---------|
| Header | SearchInput (sticky) | Top | Always accessible search |
| Sidebar | Filters | Left (desktop) | Filter options |
| Main | children (results) | Right/Center | Search results |
| Footer | Pagination | Bottom | Page navigation |

### Responsive Layout Grid

```
Mobile (< 768px)
┌─────────────────────┐
│  Sticky SearchBar   │
├─────────────────────┤
│  [Filters Button]   │ ← Opens drawer
├─────────────────────┤
│  Product Grid       │
│  (1-2 columns)      │
└─────────────────────┘

Tablet (768px - 1024px)
┌──────┬──────────────┐
│      │ SearchBar    │
├──────┼──────────────┤
│Filter│ Results      │
│(25%) │ (3 cols)     │
│      │              │
└──────┴──────────────┘

Desktop (> 1024px)
┌────────┬──────────────────┐
│        │   SearchBar      │
├────────┼──────────────────┤
│ Filter │  Results Grid    │
│ (20%)  │  (4 columns)     │
│        │                  │
└────────┴──────────────────┘
```

### Sticky Header Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Position | `sticky top-0` | Stick to top on scroll |
| Z-Index | `z-40` | Above content, below modals |
| Background | `bg-white` | Solid background |
| Shadow | `shadow-md` (on scroll) | Visual separation |
| Padding | `py-4 px-6` | Breathing room |

### Grid System Specifications

| Breakpoint | Sidebar Width | Grid Columns | Gap |
|------------|---------------|--------------|-----|
| Mobile | Hidden (drawer) | 1-2 | 4 |
| Tablet | 25% (200px) | 2-3 | 6 |
| Desktop | 20% (250px) | 3-4 | 6 |
| Wide | 15% (280px) | 4-5 | 8 |

### Tailwind Layout Classes

| Element | Classes | Purpose |
|---------|---------|---------|
| Container | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` | Responsive container |
| Grid Wrapper | `grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8` | Two-column layout |
| Sidebar | `hidden lg:block` | Desktop only |
| Main Content | `w-full` | Full width content |

### Scroll Behavior

```
Initial State (top)
└── Header: No shadow, normal padding

Scrolled State (>50px)
└── Header: Shadow added, sticky active

Filter Change
└── Maintain scroll position
└── Smooth transition

Back Navigation
└── Restore previous scroll position
```

### Filter Sidebar Content

| Filter Type | Mobile | Desktop |
|-------------|--------|---------|
| Categories | In drawer | In sidebar |
| Price Range | In drawer | In sidebar |
| Brands | In drawer | In sidebar |
| Ratings | In drawer | In sidebar |
| Availability | In drawer | In sidebar |

### Mobile Filter Drawer

| Feature | Implementation |
|---------|----------------|
| Trigger | "Filters" button with count badge |
| Position | Right slide-in drawer |
| Background | Overlay with blur |
| Animation | Slide transition (300ms) |
| Close | X button, overlay click, or apply |

### Expected Outcome
- Functional search layout with sticky header
- Responsive sidebar and main content areas
- Proper grid system for product display
- Smooth scroll behavior
- Mobile-optimized filter drawer

### Verification Checklist
- [ ] `frontend/app/(webstore)/search/layout.tsx` file created
- [ ] Layout accepts children prop
- [ ] Sticky search header implemented
- [ ] Two-column layout on desktop
- [ ] Single-column layout on mobile
- [ ] Filter sidebar visible on desktop
- [ ] Filter drawer accessible on mobile
- [ ] Product grid responsive breakpoints defined
- [ ] Scroll behavior configured
- [ ] Z-index stacking correct

---

## Task 04: Create Search Loading State

### Overview
Create a loading state component for the search page that displays skeleton loaders while search results are being fetched. This improves perceived performance and provides visual feedback to users during data loading, following Next.js App Router loading UI patterns.

### Dependencies
- Task 02: Create Search Results Page Route

### Instructions

1. **Create loading.tsx file**
   - Navigate to `frontend/app/(webstore)/search/` directory
   - Create new file named `loading.tsx`
   - Next.js automatically displays this during async operations

2. **Design skeleton structure**
   - Match the actual search results page layout
   - Include skeleton for search header
   - Include skeleton for filters sidebar
   - Include skeleton for product grid

3. **Create reusable skeleton components**
   - Create `ProductCardSkeleton` component
   - Create `FilterSkeleton` component
   - Use consistent skeleton styling
   - Apply shimmer animation effect

4. **Implement shimmer animation**
   - Create CSS keyframe animation
   - Apply gradient background
   - Use `animate-pulse` Tailwind utility
   - Set appropriate animation duration (1.5s-2s)

5. **Match actual page layout**
   - Use same grid structure as results page
   - Same number of columns per breakpoint
   - Same spacing and gaps
   - Same sidebar width and positioning

6. **Create multiple skeleton items**
   - Display 8-12 product card skeletons
   - Display 4-6 filter group skeletons
   - Show loading state for search input area
   - Match expected content density

7. **Add accessibility attributes**
   - Add `aria-busy="true"` to loading container
   - Add `aria-label="Loading search results"`
   - Include screen reader text
   - Ensure keyboard navigation doesn't break

8. **Optimize for performance**
   - Keep skeleton DOM lightweight
   - Avoid unnecessary animations
   - Use CSS transforms for shimmer
   - Test on low-end devices

### Loading Component Structure

```
┌─────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────┐ │
│  │   [Skeleton: Search Input Bar]           │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌────────────┬──────────────────────────────┐ │
│  │ [Skeleton] │  ┌────┐ ┌────┐ ┌────┐ ┌────┐│ │
│  │ [Filter  ] │  │░░░░│ │░░░░│ │░░░░│ │░░░░││ │
│  │ [Groups  ] │  │░░░░│ │░░░░│ │░░░░│ │░░░░││ │
│  │ [Skeleton] │  └────┘ └────┘ └────┘ └────┘│ │
│  │ [Skeleton] │  ┌────┐ ┌────┐ ┌────┐ ┌────┐│ │
│  │ [Skeleton] │  │░░░░│ │░░░░│ │░░░░│ │░░░░││ │
│  │            │  │░░░░│ │░░░░│ │░░░░│ │░░░░││ │
│  └────────────┘  └────┘ └────┘ └────┘ └────┘│ │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Skeleton Components

| Component | Elements | Purpose |
|-----------|----------|---------|
| SearchHeaderSkeleton | Input bar, button | Search UI placeholder |
| FilterSkeleton | 4-6 filter groups | Sidebar placeholder |
| ProductCardSkeleton | Image, title, price, rating | Product placeholder |
| PaginationSkeleton | Page numbers | Pagination placeholder |

### ProductCardSkeleton Elements

```
┌────────────────────┐
│                    │
│   [Image Block]    │ ← 150px height
│   [Shimmer]        │
│                    │
├────────────────────┤
│ [Title Line]       │ ← 16px height
│ [Title Line Short] │ ← 16px height
├────────────────────┤
│ [Rating Stars]     │ ← 20px height
├────────────────────┤
│ [Price Block]      │ ← 24px height
├────────────────────┤
│ [Button Block]     │ ← 40px height
└────────────────────┘
```

### Shimmer Animation

| Property | Value | Purpose |
|----------|-------|---------|
| Animation | `animate-pulse` | Pulsing effect |
| Duration | `1.5s` | Smooth rhythm |
| Timing | `ease-in-out` | Natural feel |
| Iteration | `infinite` | Continuous |
| Background | `linear-gradient(90deg, ...)` | Moving shimmer |

### Skeleton Color Scheme

| Element | Color Class | Purpose |
|---------|-------------|---------|
| Base | `bg-gray-200` | Light background |
| Shimmer | `bg-gray-300` | Lighter highlight |
| Border | `border-gray-200` | Subtle definition |
| Text Lines | `bg-gray-300` | Text placeholder |

### Grid Layout Matching

```
Mobile
└── 1-2 column grid
    └── 4-6 skeleton cards

Tablet
└── 2-3 column grid
    └── 6-9 skeleton cards

Desktop
└── 3-4 column grid
    └── 8-12 skeleton cards
```

### Accessibility Attributes

| Attribute | Value | Element |
|-----------|-------|---------|
| role | `status` | Loading container |
| aria-live | `polite` | Loading container |
| aria-busy | `true` | Loading container |
| aria-label | `Loading search results` | Main container |

### Performance Considerations

| Aspect | Implementation |
|--------|----------------|
| DOM Size | Keep skeleton count reasonable |
| Animation | Use CSS transforms (GPU-accelerated) |
| Repaints | Minimize layout shifts |
| Rendering | Use simple shapes, avoid complexity |

### Loading States by Scenario

| Scenario | Duration | Display |
|----------|----------|---------|
| Initial Page Load | 1-3s | Full skeleton |
| Filter Change | 0.5-1s | Results skeleton only |
| Pagination | 0.5-1s | Results skeleton only |
| Sort Change | 0.5-1s | Results skeleton only |

### Expected Outcome
- Functional loading UI that matches page layout
- Smooth shimmer animation on skeleton elements
- Proper grid structure matching results page
- Accessible loading state with ARIA attributes
- Optimized performance

### Verification Checklist
- [ ] `frontend/app/(webstore)/search/loading.tsx` file created
- [ ] Loading component exports as default
- [ ] Skeleton structure matches page layout
- [ ] Product card skeletons displayed (8-12)
- [ ] Filter sidebar skeletons displayed
- [ ] Shimmer animation working
- [ ] Responsive grid breakpoints match results page
- [ ] ARIA attributes for accessibility
- [ ] Performance tested on slow connections
- [ ] Loading state auto-displays during async operations

---

## Task 05: Create Search Component Directory

### Overview
Create a dedicated directory for search-specific components that will house reusable search UI elements. This organizational structure separates search components from general webstore components, making the codebase more maintainable and modular.

### Dependencies
- Frontend component structure established
- SubPhase-04 component patterns defined

### Instructions

1. **Navigate to components directory**
   - Go to `frontend/components/` directory
   - This is the central location for all reusable components
   - Verify the directory structure exists

2. **Create webstore components subdirectory (if needed)**
   - Check if `frontend/components/webstore/` exists
   - If not, create it for webstore-specific components
   - This separates webstore from ERP components

3. **Create search subdirectory**
   - Inside `webstore/`, create `search/` directory
   - Full path: `frontend/components/webstore/search/`
   - This will house all search-related components

4. **Plan component organization**
   - Input components (SearchInput, SearchIconButton)
   - Suggestion components (SearchSuggestions, RecentSearches)
   - Filter components (SearchFilters, FilterGroup)
   - Result components (SearchResults, NoResults)

5. **Create index.ts for exports**
   - Create `index.ts` in search directory
   - This will export all search components
   - Simplifies imports in page components

6. **Establish naming conventions**
   - Use PascalCase for component files
   - Prefix with "Search" for clarity (SearchInput, SearchFilters)
   - Use descriptive names (SearchSuggestionItem, not Item)

### Directory Structure
```
frontend/components/
├── webstore/                    # Webstore components
│   ├── search/                  # Search components (NEW)
│   │   ├── SearchInput.tsx      # (Created in Task 06)
│   │   ├── SearchIconButton.tsx # (Created in Task 07)
│   │   ├── SearchInputField.tsx # (Created in Task 08)
│   │   ├── SearchSuggestions.tsx # (Future)
│   │   ├── SearchFilters.tsx    # (Future)
│   │   └── index.ts             # Exports
│   ├── products/                # (From SubPhase-04)
│   ├── cart/                    # (From other SubPhases)
│   └── index.ts
├── ui/                          # Shadcn/UI components
└── shared/                      # Cross-app components
```

### Component Organization Strategy

| Category | Components | Purpose |
|----------|------------|---------|
| Input | SearchInput, SearchIconButton, InputField | User input |
| Suggestions | SearchSuggestions, RecentSearches | Autocomplete |
| Filters | SearchFilters, FilterGroup, FilterItem | Result filtering |
| Results | SearchResults, ProductList, NoResults | Display results |
| Layout | SearchLayout, SearchHeader | Page structure |

### Component Naming Patterns

| Pattern | Example | Use Case |
|---------|---------|----------|
| Search + Function | SearchInput | Main components |
| Search + UI Element | SearchButton | Specific UI parts |
| Search + State | SearchLoading | State components |
| Search + Feature | SearchSuggestions | Feature groups |

### Index.ts Export Structure

```
Export pattern:
├── Main components (SearchInput, SearchFilters)
├── Sub-components (SearchIconButton, SearchInputField)
├── Utility components (SearchLoading, SearchEmpty)
└── Type definitions (SearchProps, FilterProps)
```

### Import Path Examples

| From | Import Statement |
|------|------------------|
| Page Component | `import { SearchInput } from '@/components/webstore/search'` |
| Direct Import | `import SearchInput from '@/components/webstore/search/SearchInput'` |
| Multiple Imports | `import { SearchInput, SearchFilters } from '@/components/webstore/search'` |

### Component File Structure

| File | Purpose |
|------|---------|
| `SearchInput.tsx` | Main search input component |
| `SearchInput.types.ts` | TypeScript interfaces |
| `SearchInput.test.tsx` | Unit tests |
| `SearchInput.stories.tsx` | Storybook stories |
| `index.ts` | Re-exports |

### Future Component Additions

| Component | Description | Document |
|-----------|-------------|----------|
| SearchSuggestions | Autocomplete dropdown | Doc 02 |
| RecentSearches | User search history | Doc 02 |
| SearchFilters | Filter sidebar | Doc 03 |
| FilterGroup | Individual filter section | Doc 03 |
| SearchResults | Results grid wrapper | Doc 03 |

### Expected Outcome
- Organized directory for search components
- Clear separation from other component types
- Foundation for modular component development
- Easy import paths for page components

### Verification Checklist
- [ ] `frontend/components/webstore/` directory exists
- [ ] `frontend/components/webstore/search/` directory created
- [ ] `index.ts` file created in search directory
- [ ] Directory structure documented
- [ ] Naming conventions established
- [ ] Ready for component creation

---

## Task 06: Create SearchInput Component

### Overview
Create the main SearchInput component that serves as the primary search interface for the webstore. This component combines the search icon button and input field into a cohesive, accessible search bar with features like real-time suggestions, keyboard navigation, and submit handling. It's designed to be reusable across different locations (header, search page, mobile menu).

### Dependencies
- Task 05: Create Search Component Directory
- SubPhase-04 form component patterns established

### Instructions

1. **Create SearchInput.tsx file**
   - Navigate to `frontend/components/webstore/search/` directory
   - Create new file named `SearchInput.tsx`
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `SearchInputProps` interface
   - Include `placeholder` (string, optional)
   - Include `defaultValue` (string, optional)
   - Include `onSearch` callback (function)
   - Include `className` (string, optional)
   - Include `showSuggestions` (boolean, optional)
   - Include `variant` ('header' | 'page' | 'mobile')

3. **Set up component state management**
   - Create state for search query (input value)
   - Create state for suggestions visibility
   - Create state for selected suggestion index
   - Create state for loading indicator
   - Use React useState hooks

4. **Implement search query handling**
   - Handle input change events
   - Debounce input for API calls (300ms delay)
   - Trigger suggestions fetch on input change
   - Update URL query parameter on submit

5. **Create form structure**
   - Wrap input in form element
   - Handle form submit event
   - Prevent default form submission
   - Navigate to search page with query

6. **Compose sub-components**
   - Import SearchIconButton (Task 07)
   - Import SearchInputField (Task 08)
   - Arrange in logical order (icon, input, submit)
   - Apply proper spacing and alignment

7. **Implement keyboard navigation**
   - Handle Arrow Up/Down for suggestions
   - Handle Enter to submit or select suggestion
   - Handle Escape to close suggestions
   - Handle Tab for accessibility

8. **Add ARIA attributes for accessibility**
   - Set `role="search"` on form
   - Set `aria-label="Search products"`
   - Add `aria-expanded` for suggestions
   - Add `aria-activedescendant` for selected item

9. **Implement responsive variants**
   - Header variant: Compact, inline layout
   - Page variant: Full width, prominent
   - Mobile variant: Full screen on focus
   - Apply different styles per variant

10. **Handle search submission**
    - Extract trimmed query value
    - Validate query (minimum length)
    - Navigate to `/search?q={query}`
    - Call optional onSearch callback
    - Track analytics event

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| placeholder | string | No | "Search products..." | Input placeholder text |
| defaultValue | string | No | "" | Initial search value |
| onSearch | (query: string) => void | No | undefined | Search callback |
| className | string | No | "" | Additional CSS classes |
| showSuggestions | boolean | No | true | Enable autocomplete |
| variant | 'header' \| 'page' \| 'mobile' | No | 'header' | Display variant |
| autoFocus | boolean | No | false | Auto-focus on mount |

### Component State

| State Variable | Type | Purpose |
|----------------|------|---------|
| query | string | Current input value |
| showSuggestions | boolean | Suggestions dropdown visibility |
| selectedIndex | number | Keyboard-selected suggestion |
| isLoading | boolean | Loading indicator |
| suggestions | string[] | Suggestion items |

### Component Structure

```
<form role="search">
  ┌────────────────────────────────────────┐
  │  🔍  [Search products...]    [Submit]  │
  │  ↑    ↑                      ↑         │
  │  Icon Input Field            Button    │
  └────────────────────────────────────────┘
       ↓ (When typing)
  ┌────────────────────────────────────────┐
  │  Suggestions Dropdown                  │
  │  • laptop                              │
  │  • laptop stand                        │
  │  • laptop bag                          │
  └────────────────────────────────────────┘
</form>
```

### Search Flow Diagram

```
User types in input
       ↓
Debounce (300ms)
       ↓
Fetch suggestions from API
       ↓
Display suggestions dropdown
       ↓
User selects or submits
       ↓
Navigate to /search?q={query}
       ↓
Display search results
```

### Keyboard Navigation Map

| Key | Action |
|-----|--------|
| Arrow Down | Move to next suggestion |
| Arrow Up | Move to previous suggestion |
| Enter | Submit search or select suggestion |
| Escape | Close suggestions dropdown |
| Tab | Navigate to next element |

### Variant Styling Differences

| Variant | Width | Height | Border | Shadow |
|---------|-------|--------|--------|--------|
| header | Fixed 300px | 40px | Rounded full | sm |
| page | Full width | 48px | Rounded lg | md |
| mobile | 100vw | 56px | Rounded none | lg |

### Debounce Implementation

```
Purpose: Reduce API calls during typing
Delay: 300ms
Behavior:
  ├── User types "l" → Wait
  ├── User types "la" → Wait
  ├── User types "lap" → Wait
  └── 300ms after last keystroke → Fetch suggestions
```

### Search Validation Rules

| Rule | Condition | Action |
|------|-----------|--------|
| Minimum Length | < 2 characters | Don't show suggestions |
| Maximum Length | > 100 characters | Truncate and warn |
| Empty Query | query.trim() === "" | Don't submit |
| Special Characters | Contains <, >, etc. | Sanitize |

### ARIA Attributes

| Attribute | Value | Element | Purpose |
|-----------|-------|---------|---------|
| role | "search" | form | Identify search region |
| aria-label | "Search products" | form | Screen reader label |
| aria-expanded | {showSuggestions} | input | Dropdown state |
| aria-controls | "suggestions-list" | input | Associated listbox |
| aria-activedescendant | "suggestion-{index}" | input | Selected item |

### Analytics Events

| Event | Trigger | Data |
|-------|---------|------|
| search_input_focus | Input focused | timestamp, page |
| search_query_typed | Query changed | query, length |
| search_submitted | Form submitted | query, source |
| search_suggestion_selected | Suggestion clicked | query, position |

### Expected Outcome
- Functional search input component with icon and field
- Real-time suggestion support (wired up)
- Keyboard navigation working
- Form submission navigating to search page
- Accessible with proper ARIA attributes
- Responsive variants for different contexts

### Verification Checklist
- [ ] `SearchInput.tsx` file created in search directory
- [ ] Component accepts all defined props
- [ ] SearchIconButton and SearchInputField composed
- [ ] Form submit handler navigates to search page
- [ ] Input change handler updates state
- [ ] Debounce implemented for API calls
- [ ] Keyboard navigation (arrows, enter, escape) works
- [ ] ARIA attributes applied correctly
- [ ] Responsive variants styled appropriately
- [ ] Component exports properly
- [ ] TypeScript types defined
- [ ] Query validation implemented

---

## Task 07: Create Search Icon Button

### Overview
Create the SearchIconButton component that displays the search icon (magnifying glass) inside the search input. This component serves as both a visual indicator and a clickable button to submit the search. It should be reusable, accessible, and support different sizes and variants.

### Dependencies
- Task 05: Create Search Component Directory
- Shadcn/UI Button component available

### Instructions

1. **Create SearchIconButton.tsx file**
   - Navigate to `frontend/components/webstore/search/` directory
   - Create new file named `SearchIconButton.tsx`
   - Set up React functional component structure

2. **Import required dependencies**
   - Import React types
   - Import Button component from Shadcn/UI or custom
   - Import Search icon from Lucide React or icon library
   - Import className utility (cn) if needed

3. **Define component props interface**
   - Create `SearchIconButtonProps` interface
   - Include `onClick` callback (optional)
   - Include `isLoading` boolean (optional)
   - Include `size` variant ('sm' | 'md' | 'lg')
   - Include `disabled` boolean (optional)
   - Include `className` (optional)

4. **Implement icon button structure**
   - Use Button component as wrapper
   - Set button type to "submit" for form submission
   - Add Search icon inside button
   - Configure button as icon-only (no text)

5. **Configure button styling**
   - Remove default button padding
   - Set equal width and height for square shape
   - Apply hover and focus states
   - Use brand colors for icon

6. **Implement size variants**
   - Small: 32px × 32px (icon: 16px)
   - Medium: 40px × 40px (icon: 20px)
   - Large: 48px × 48px (icon: 24px)
   - Apply appropriate padding per size

7. **Add loading state**
   - Show spinner when isLoading is true
   - Replace search icon with spinner
   - Disable button interactions
   - Maintain button dimensions

8. **Configure accessibility**
   - Add aria-label: "Search" or "Submit search"
   - Set button type="submit" for form
   - Add title attribute for tooltip
   - Ensure keyboard focusable

9. **Handle click events**
   - Call onClick prop if provided
   - Allow form submission by default
   - Don't prevent default unless needed
   - Provide visual feedback on click

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onClick | () => void | No | undefined | Click handler |
| isLoading | boolean | No | false | Show loading spinner |
| size | 'sm' \| 'md' \| 'lg' | No | 'md' | Button size |
| disabled | boolean | No | false | Disable button |
| className | string | No | "" | Additional classes |
| type | 'button' \| 'submit' | No | 'submit' | Button type |

### Size Variants

| Size | Button Dimensions | Icon Size | Use Case |
|------|-------------------|-----------|----------|
| sm | 32px × 32px | 16px | Compact header |
| md | 40px × 40px | 20px | Standard input |
| lg | 48px × 48px | 24px | Prominent search |

### Icon Button Structure

```
┌──────┐
│      │
│  🔍  │  ← Search icon (centered)
│      │
└──────┘
  40×40px (medium)

States:
Normal:  Blue icon, white background
Hover:   Darker blue, light blue background
Focus:   Focus ring, blue icon
Loading: Spinner icon, disabled state
```

### Button State Styling

| State | Icon Color | Background | Border | Cursor |
|-------|------------|------------|--------|--------|
| Default | `text-blue-600` | `transparent` | None | pointer |
| Hover | `text-blue-700` | `bg-blue-50` | None | pointer |
| Focus | `text-blue-600` | `transparent` | `ring-2` | pointer |
| Active | `text-blue-800` | `bg-blue-100` | None | pointer |
| Disabled | `text-gray-400` | `transparent` | None | not-allowed |
| Loading | `text-blue-600` | `transparent` | None | wait |

### Icon Options

| Icon Library | Icon Name | Import |
|--------------|-----------|--------|
| Lucide React | Search | `lucide-react` |
| Heroicons | MagnifyingGlassIcon | `@heroicons/react/24/outline` |
| React Icons | FiSearch | `react-icons/fi` |

### Loading Spinner

```
When isLoading = true:
┌──────┐
│      │
│  ⟳  │  ← Spinner (animated)
│      │
└──────┘

Spinner Properties:
├── Animation: spin
├── Duration: 1s
├── Iteration: infinite
└── Size: Same as icon
```

### Accessibility Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | "submit" | Form submission |
| aria-label | "Search" | Screen reader label |
| title | "Search" | Hover tooltip |
| disabled | {disabled \|\| isLoading} | Prevent interaction |
| aria-busy | {isLoading} | Loading indicator |

### Click Behavior

```
User clicks button
       ↓
Fire onClick callback (if provided)
       ↓
Allow form submission (default)
       ↓
Parent SearchInput handles submission
       ↓
Navigate to search results
```

### Hover Interaction

| Action | Visual Feedback |
|--------|-----------------|
| Hover | Background color change, scale effect |
| Focus | Focus ring visible |
| Click | Brief scale down animation |
| Touch | Touch highlight, no hover state |

### Tailwind Classes by Variant

| Variant | Classes |
|---------|---------|
| Base | `inline-flex items-center justify-center rounded-full transition-colors` |
| Small | `h-8 w-8 p-2` |
| Medium | `h-10 w-10 p-2.5` |
| Large | `h-12 w-12 p-3` |
| Hover | `hover:bg-blue-50 hover:text-blue-700` |
| Focus | `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |

### Expected Outcome
- Reusable icon button component with search icon
- Proper sizing variants (sm, md, lg)
- Hover and focus states working
- Loading state with spinner
- Accessible with ARIA labels
- Form submission support

### Verification Checklist
- [ ] `SearchIconButton.tsx` file created
- [ ] Component accepts all defined props
- [ ] Search icon displays correctly
- [ ] Size variants work (sm, md, lg)
- [ ] Button type set to "submit"
- [ ] Hover state shows background color
- [ ] Focus ring visible on keyboard focus
- [ ] Loading state shows spinner
- [ ] Disabled state prevents interaction
- [ ] aria-label set for accessibility
- [ ] Click handler fires correctly
- [ ] Component exports properly

---

## Task 08: Create Input Field

### Overview
Create the SearchInputField component that renders the actual text input element within the SearchInput component. This component handles user text input, applies proper styling, manages focus states, and integrates with the parent SearchInput component for a seamless search experience.

### Dependencies
- Task 05: Create Search Component Directory
- Shadcn/UI Input component patterns

### Instructions

1. **Create SearchInputField.tsx file**
   - Navigate to `frontend/components/webstore/search/` directory
   - Create new file named `SearchInputField.tsx`
   - Set up React functional component with forwardRef

2. **Define component props interface**
   - Create `SearchInputFieldProps` interface extending InputHTMLAttributes
   - Include `value` (string)
   - Include `onChange` (ChangeEventHandler)
   - Include `placeholder` (string, optional)
   - Include `isLoading` (boolean, optional)
   - Include `variant` ('header' | 'page' | 'mobile')
   - Include `className` (string, optional)

3. **Implement forwardRef for input element**
   - Use React.forwardRef to expose input ref
   - Allow parent component to control focus
   - Enable imperative ref methods (focus, blur, select)

4. **Create input element structure**
   - Render native HTML input element
   - Set type="text" for text input
   - Apply all passed props via spread operator
   - Set ref to forwarded ref

5. **Configure input attributes**
   - Set `name="search"` or `name="q"`
   - Set `autoComplete="off"` to disable browser suggestions
   - Set `autoCorrect="off"` for mobile devices
   - Set `spellCheck="false"` to prevent spell check underlines
   - Set `maxLength={100}` to limit input length

6. **Apply base styling**
   - Remove default browser input styles
   - Apply font family and size
   - Set text color and background
   - Remove outline (use focus ring instead)

7. **Implement variant-specific styling**
   - Header variant: Compact height (40px)
   - Page variant: Larger height (48px)
   - Mobile variant: Extra large height (56px)
   - Adjust font size per variant

8. **Add focus and hover states**
   - Apply focus ring on focus (blue)
   - Change border color on hover
   - Scale effect on focus (optional)
   - Smooth transitions between states

9. **Implement placeholder styling**
   - Set placeholder color (gray)
   - Use appropriate opacity
   - Ensure contrast for accessibility
   - Handle RTL languages

10. **Add loading indicator integration**
    - Add padding-right when loading
    - Make space for spinner (if shown)
    - Adjust input width accordingly
    - Maintain alignment

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Input value |
| onChange | ChangeEventHandler | Yes | - | Change handler |
| placeholder | string | No | "Search products..." | Placeholder text |
| isLoading | boolean | No | false | Show loading state |
| variant | 'header' \| 'page' \| 'mobile' | No | 'header' | Display variant |
| className | string | No | "" | Additional classes |
| autoFocus | boolean | No | false | Auto-focus on mount |

### Input Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| type | "text" | Text input |
| name | "q" | Query parameter name |
| autoComplete | "off" | Disable browser autocomplete |
| autoCorrect | "off" | Disable mobile autocorrect |
| spellCheck | "false" | Disable spell checking |
| maxLength | 100 | Limit input length |
| required | false | Not required (can be empty) |

### Variant Styling Specifications

| Variant | Height | Font Size | Padding | Border Radius |
|---------|--------|-----------|---------|---------------|
| header | 40px | 14px | px-4 | rounded-full |
| page | 48px | 16px | px-5 | rounded-lg |
| mobile | 56px | 18px | px-6 | rounded-xl |

### Input Field Structure

```
┌─────────────────────────────────────┐
│  [Placeholder or typed text...]     │
│                                     │
│  ← Focus ring on focus              │
└─────────────────────────────────────┘
       Full width, flexible
```

### State-Based Styling

| State | Border | Background | Text Color | Outline |
|-------|--------|------------|------------|---------|
| Default | `border-gray-300` | `bg-white` | `text-gray-900` | None |
| Hover | `border-gray-400` | `bg-white` | `text-gray-900` | None |
| Focus | `border-blue-500` | `bg-white` | `text-gray-900` | `ring-2 ring-blue-200` |
| Disabled | `border-gray-200` | `bg-gray-100` | `text-gray-400` | None |
| Error | `border-red-500` | `bg-white` | `text-gray-900` | `ring-2 ring-red-200` |

### Placeholder Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Color | `placeholder:text-gray-400` | Sufficient contrast |
| Opacity | `placeholder:opacity-100` | Consistent appearance |
| Font Style | `placeholder:text-base` | Match input text |

### Focus Ring Configuration

```
Focus Ring Properties:
├── Ring Width: 2px
├── Ring Color: Blue (blue-200)
├── Ring Offset: 2px
├── Transition: 150ms ease-in-out
└── Visible On: Keyboard focus only
```

### Responsive Behavior

```
Mobile (< 640px)
└── Full width
    ├── Large touch target (56px)
    └── Larger font (18px) to prevent zoom

Tablet (640px - 1024px)
└── Flexible width
    ├── Medium height (48px)
    └── Standard font (16px)

Desktop (> 1024px)
└── Fixed or flexible width
    ├── Standard height (40px)
    └── Standard font (14px-16px)
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Focus Indicator | Visible focus ring (blue) |
| Color Contrast | Text vs background ≥ 4.5:1 |
| Touch Target | Minimum 44px height on mobile |
| Screen Readers | Descriptive placeholder |
| Keyboard Access | Fully keyboard navigable |

### Text Input Behavior

| Action | Behavior |
|--------|----------|
| Type Character | Update value, trigger onChange |
| Paste | Accept paste, trigger onChange |
| Clear | Clear value via parent control |
| Autocomplete | Disabled (handled by custom suggestions) |
| Max Length | Stop input at 100 characters |

### forwardRef Implementation Purpose

| Use Case | Benefit |
|----------|---------|
| Focus Control | Parent can call inputRef.current.focus() |
| Selection | Parent can select text programmatically |
| Blur | Parent can blur input |
| Value Access | Direct access to input element |

### Tailwind Base Classes

```
Base Input Classes:
├── Layout: w-full flex-1
├── Typography: text-base font-normal
├── Colors: text-gray-900 bg-white
├── Border: border border-gray-300 rounded-lg
├── Spacing: px-4 py-2
├── Transitions: transition-colors duration-150
├── Focus: focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
├── Hover: hover:border-gray-400
└── Disabled: disabled:bg-gray-100 disabled:text-gray-400
```

### Integration with SearchInput

```
SearchInput Component
       ↓
  ┌────────────────────────────┐
  │ <form>                     │
  │   <SearchIconButton />     │
  │   <SearchInputField        │
  │      ref={inputRef}        │ ← Ref passed from parent
  │      value={query}         │ ← Controlled value
  │      onChange={handleChange}│ ← Handler from parent
  │   />                       │
  │   <SubmitButton />         │
  │ </form>                    │
  └────────────────────────────┘
```

### Expected Outcome
- Reusable text input component with proper styling
- Variant support for different contexts
- Focus and hover states working correctly
- forwardRef implementation for parent control
- Accessible with proper attributes
- Integrated with parent SearchInput component

### Verification Checklist
- [ ] `SearchInputField.tsx` file created
- [ ] Component uses forwardRef
- [ ] All props accepted and typed
- [ ] Input element renders correctly
- [ ] Variant styling applied (header, page, mobile)
- [ ] Focus ring visible on focus
- [ ] Hover state changes border color
- [ ] Placeholder styling correct
- [ ] Input attributes configured (autocomplete, spellcheck)
- [ ] maxLength set to 100 characters
- [ ] onChange handler fires on input
- [ ] value prop controls input
- [ ] Responsive height on mobile devices
- [ ] Component exports properly

---

## Summary

This document established the foundational infrastructure for the webstore search functionality, including the search route structure, page layout with sticky header and responsive grid, loading states with skeleton loaders, and the core SearchInput component with its icon button and input field sub-components. These elements provide the base for implementing search suggestions, filters, and results in subsequent documents.

### Completed Tasks
1. ✓ Created search directory in webstore route group
2. ✓ Created search results page route with metadata
3. ✓ Created search page layout with sticky header and grid
4. ✓ Created search loading state with skeleton components
5. ✓ Created search component directory structure
6. ✓ Created SearchInput component with state management
7. ✓ Created SearchIconButton component with variants
8. ✓ Created SearchInputField component with forwardRef

### Component Hierarchy
```
SearchInput (Main Component)
├── SearchIconButton (Icon + Submit)
└── SearchInputField (Text Input)
```

### Search Flow Overview
```
User Journey:
1. User navigates to /search or types in SearchInput
2. SearchInput component captures query
3. On submit: Navigate to /search?q={query}
4. SearchPage loads with loading.tsx skeleton
5. Server fetches results, renders page
6. Results displayed with filters and pagination
```

### Key Technical Decisions
- **Route Structure:** Query parameters (`?q=query`) for flexibility and shareability
- **Layout:** Sticky header with two-column grid (filters + results)
- **Component Structure:** Modular sub-components (icon button, input field)
- **Loading UX:** Skeleton loaders matching actual layout
- **Accessibility:** Proper ARIA attributes and keyboard navigation
- **Responsive Design:** Mobile-first with collapsible filters

### Next Steps
Proceed to [02_Tasks-09-15_Search-Suggestions.md](02_Tasks-09-15_Search-Suggestions.md) to implement:
- Search suggestions dropdown with autocomplete
- Recent searches functionality
- Popular/trending searches display
- Suggestion selection and navigation
- Keyboard navigation enhancements
- Debounced API integration for suggestions

### Files Created
| File Path | Purpose |
|-----------|---------|
| `app/(webstore)/search/page.tsx` | Search results page |
| `app/(webstore)/search/layout.tsx` | Search page layout |
| `app/(webstore)/search/loading.tsx` | Loading state |
| `components/webstore/search/SearchInput.tsx` | Main search component |
| `components/webstore/search/SearchIconButton.tsx` | Icon button |
| `components/webstore/search/SearchInputField.tsx` | Input field |
| `components/webstore/search/index.ts` | Component exports |

---

**Document Status:** Complete  
**Last Updated:** Phase 08, SubPhase 05, Group A  
**Next Document:** [02_Tasks-09-15_Search-Suggestions.md](02_Tasks-09-15_Search-Suggestions.md)
