# Phase-08 SubPhase-04 Group-A: Product Detail Page - Route, Layout & Metadata

**Phase:** 08 - Webstore & E-Commerce Platform  
**SubPhase:** 04 - Product Detail Page  
**Group:** A - Route & Page Structure  
**Document:** 01 of 02  
**Tasks Covered:** 01-08  
**Complexity:** Low to Medium  
**Estimated Total:** 8-12 hours

---

## Navigation

**Parent:** [SubPhase-04 Product Detail Page](../00_GROUP_SUMMARY.md)  
**Previous:** None (First Document)  
**Next:** [02_Tasks-09-16_Container-Data-Verify.md](./02_Tasks-09-16_Container-Data-Verify.md)

---

## Document Overview

This document covers the foundational setup for the product detail page route structure, including directory creation, page components, layout structure, loading states, error handling, and SEO optimization through static generation and metadata configuration.

### Tasks Covered in This Document

| Task # | Task Name | Complexity | Est. Time | Dependencies |
|--------|-----------|------------|-----------|--------------|
| 01 | Create Product Detail Directory | Low | 0.5h | None |
| 02 | Create Product Page Route | Low | 1h | Task 01 |
| 03 | Create Product Page Layout | Low | 1.5h | Task 02 |
| 04 | Create Product Loading State | Low | 1h | Task 02 |
| 05 | Create Product Error State | Low | 1h | Task 02 |
| 06 | Create Product Not Found Page | Low | 1.5h | Task 02 |
| 07 | Create generateStaticParams | Medium | 2h | Task 02 |
| 08 | Create generateMetadata | Medium | 2h | Task 02 |

### Group Goals

- Establish the product detail route with proper Next.js 14 App Router conventions
- Create proper layout structure with loading and error boundaries
- Implement SEO optimization through static generation and dynamic metadata
- Set up proper error handling and not-found states
- Prepare the foundation for product content components (Group B)

---

## Task 01: Create Product Detail Directory

### Overview

Initialize the directory structure for the product detail page following Next.js 14 App Router conventions. This structure will support dynamic routing with product slugs and proper file organization for all related components and utilities.

### Dependencies

- **Prerequisites:**
  - Webstore frontend project initialized (Phase-08 SubPhase-01)
  - App Router directory structure in place
  - TypeScript configuration completed

### Instructions

#### Step 1: Create Main Product Detail Directory

1. Navigate to the webstore frontend application directory
2. Locate the app directory (should be at root of Next.js project)
3. Create the following directory path: `app/products/[slug]`
4. This creates a dynamic route where `[slug]` is the dynamic segment

#### Step 2: Create Supporting Directories

1. Within the `app/products/[slug]` directory, create:
   - `_components/` - For page-specific components
   - `_lib/` - For page-specific utilities and helpers
   - `_types/` - For page-specific TypeScript types and interfaces

2. The underscore prefix prevents these directories from becoming routes

#### Step 3: Verify Directory Structure

Create a visual reference of the expected structure:

```
app/
  products/
    [slug]/
      _components/
      _lib/
      _types/
      page.tsx          (to be created in Task 02)
      layout.tsx        (to be created in Task 03)
      loading.tsx       (to be created in Task 04)
      error.tsx         (to be created in Task 05)
      not-found.tsx     (to be created in Task 06)
```

#### Step 4: Create Index Files

1. In each subdirectory (`_components`, `_lib`, `_types`), create an `index.ts` file
2. These files will serve as barrel exports for cleaner imports
3. Leave them empty for now - they'll be populated as components are created

### Directory Organization Table

| Directory/File | Purpose | Route Impact |
|----------------|---------|--------------|
| `[slug]/` | Dynamic route segment | Creates `/products/:slug` route |
| `_components/` | Page-specific React components | None (underscore prefix) |
| `_lib/` | Utilities, helpers, fetchers | None (underscore prefix) |
| `_types/` | TypeScript definitions | None (underscore prefix) |
| `page.tsx` | Main page component | Renders at `/products/:slug` |
| `layout.tsx` | Shared layout wrapper | Wraps page content |
| `loading.tsx` | Loading UI | Shown during Suspense |
| `error.tsx` | Error boundary UI | Shown on errors |
| `not-found.tsx` | 404 UI | Shown when notFound() called |

### Expected Outcome

- Clean directory structure ready for product detail implementation
- Proper separation of components, utilities, and types
- Next.js App Router conventions properly followed
- Foundation for dynamic product routing established

### Verification Checklist

- [ ] Directory `app/products/[slug]` exists
- [ ] Subdirectories `_components`, `_lib`, `_types` created with underscore prefix
- [ ] Each subdirectory contains an empty `index.ts` file
- [ ] Directory structure matches Next.js App Router conventions
- [ ] No syntax errors in file system structure
- [ ] Git tracking confirms all directories (with placeholder files if needed)

---

## Task 02: Create Product Page Route

### Overview

Create the main page component that serves as the entry point for the product detail route. This component will be responsible for receiving the slug parameter, orchestrating data fetching, and rendering the product content layout.

### Dependencies

- **Prerequisites:**
  - Task 01 completed (directory structure)
  - Understanding of Next.js 14 App Router conventions
  - TypeScript configuration

- **Related Tasks:**
  - Task 03 (Layout will wrap this page)
  - Task 04 (Loading state during data fetch)
  - Task 05 (Error boundary for failures)

### Instructions

#### Step 1: Create Page Component File

1. In the `app/products/[slug]` directory, create `page.tsx`
2. This file must be named exactly `page.tsx` to be recognized by Next.js
3. Mark it as an async Server Component (default in App Router)

#### Step 2: Define Page Props Interface

1. Create an interface for the page props that includes:
   - `params` object with `slug` property (string)
   - `searchParams` object for query parameters (optional)
2. Use proper TypeScript typing with Promise wrappers for async params (Next.js 15+)

#### Step 3: Define the Page Component Function

1. Create an async function component named according to convention (e.g., `ProductDetailPage`)
2. Accept props with the defined interface
3. Extract the slug from params (await if using Next.js 15+ async params)
4. Export the component as default

#### Step 4: Plan Component Structure

The page component should:
1. Receive the product slug from route parameters
2. Be marked as an async component for server-side data fetching
3. Import and render the main product container (to be created in next document)
4. Handle data fetching orchestration at the page level

#### Step 5: Set Up Error Handling Strategy

1. Plan for try-catch blocks around data fetching
2. Use Next.js `notFound()` function for 404 cases
3. Allow other errors to bubble to error boundary (Task 05)

#### Step 6: Document Component Purpose

Add JSDoc comments explaining:
- Component purpose and responsibilities
- Route pattern and parameters
- Data fetching strategy
- Related components

### Page Component Architecture Table

| Aspect | Implementation Detail |
|--------|----------------------|
| **File Location** | `app/products/[slug]/page.tsx` |
| **Component Type** | Async Server Component |
| **Export Type** | Default export |
| **Params** | `{ slug: string }` from route |
| **Search Params** | Optional query parameters |
| **Data Fetching** | Server-side async/await |
| **Error Handling** | Try-catch + notFound() |
| **Rendering** | Server-rendered HTML |

### Route Parameter Flow Diagram

```
Request: /products/wireless-mouse-pro
         ↓
Next.js Router
         ↓
Matches: /products/[slug]
         ↓
Extracts: slug = "wireless-mouse-pro"
         ↓
Passes to: page.tsx as params.slug
         ↓
Component: ProductDetailPage({ params })
         ↓
Fetches: Product data by slug
         ↓
Renders: Product detail UI
```

### Expected Outcome

- Functional page component at the correct location
- Proper TypeScript typing for props and params
- Async component ready for server-side data fetching
- Clean structure prepared for container component integration
- Proper default export for Next.js route recognition

### Verification Checklist

- [ ] File `page.tsx` created in `app/products/[slug]/` directory
- [ ] Component is async Server Component
- [ ] Props interface includes params with slug
- [ ] Component properly typed with TypeScript
- [ ] Default export present
- [ ] JSDoc documentation added
- [ ] No TypeScript errors in file
- [ ] Route accessible at `/products/test-slug` (returns placeholder or error expected)

---

## Task 03: Create Product Page Layout

### Overview

Create a layout component that wraps the product detail page, providing consistent structure, styling, and shared UI elements. This layout will be specific to the product detail route and can include product-specific navigation, breadcrumbs placeholder, and structured content areas.

### Dependencies

- **Prerequisites:**
  - Task 01 completed (directory structure)
  - Task 02 completed (page component)
  - Understanding of Next.js layout composition

- **Related Tasks:**
  - Task 10 (Breadcrumb will be added to this layout)
  - Layout inherits from parent layouts in app structure

### Instructions

#### Step 1: Create Layout Component File

1. In the `app/products/[slug]` directory, create `layout.tsx`
2. This file must be named exactly `layout.tsx` to be recognized by Next.js
3. This layout will wrap the page.tsx component automatically

#### Step 2: Define Layout Props Interface

1. Create an interface for layout props:
   - `children` prop (React.ReactNode) - required
   - `params` object with slug (for context, if needed)
2. Type the props properly with TypeScript

#### Step 3: Create Layout Component Structure

The layout should include:
1. Main wrapper container with proper semantic HTML
2. Placeholder for breadcrumb navigation (top section)
3. Main content area that renders children
4. Proper CSS classes for responsive layout
5. Accessibility attributes (ARIA labels, semantic tags)

#### Step 4: Set Up Layout Container

1. Create a container with maximum width constraints
2. Apply responsive padding and spacing
3. Use Tailwind CSS utility classes for styling
4. Ensure proper nesting of semantic HTML elements

#### Step 5: Plan Layout Regions

Define distinct regions:
1. **Breadcrumb Area**: Top section for navigation breadcrumbs
2. **Content Area**: Main region where page.tsx renders
3. **Optional Sidebar**: Space for future sticky elements (related products, etc.)

#### Step 6: Add Metadata and Viewport Configuration

1. Though generateMetadata is in Task 08, layout can set defaults
2. Consider viewport settings specific to product pages
3. Add appropriate meta tags for optimal mobile display

### Layout Structure Table

| Region | Purpose | Semantic Tag | Styling Notes |
|--------|---------|--------------|---------------|
| Root Container | Top-level wrapper | `<div>` | Max width, centered, padding |
| Breadcrumb Area | Navigation context | `<nav>` | Top margin, responsive |
| Main Content | Product details | `<main>` | Flex/grid layout, full width |
| Children Slot | Page component renders here | `{children}` | Inherits parent styling |

### Layout Composition Diagram

```
App Root Layout
    ↓
Products Section Layout (if exists)
    ↓
[slug] Layout (this component)
    ├── Breadcrumb Area (nav)
    │   └── Placeholder for Task 10
    │
    └── Main Content Area (main)
        └── {children} → page.tsx renders here
            ↓
        Product Container (Task 09)
            ↓
        Product Components (Group B, C, etc.)
```

### Responsive Behavior Table

| Breakpoint | Layout Behavior | Container Width | Padding |
|------------|-----------------|-----------------|---------|
| Mobile (<640px) | Single column, stack | 100% | px-4 |
| Tablet (640-1024px) | Single column, wider | 100% | px-6 |
| Desktop (>1024px) | Potential two-column | Max 1280px | px-8 |
| Wide (>1536px) | Centered with max width | Max 1536px | px-12 |

### Expected Outcome

- Functional layout component wrapping product pages
- Clean, semantic HTML structure
- Responsive container with proper width constraints
- Placeholder regions for breadcrumbs and future enhancements
- Proper TypeScript typing and export

### Verification Checklist

- [ ] File `layout.tsx` created in `app/products/[slug]/` directory
- [ ] Layout accepts children prop with correct typing
- [ ] Semantic HTML elements used (nav, main)
- [ ] Container has responsive width and padding
- [ ] Breadcrumb placeholder area defined
- [ ] Default export present
- [ ] No TypeScript or ESLint errors
- [ ] Layout properly wraps page content when route accessed
- [ ] Responsive behavior works across breakpoints

---

## Task 04: Create Product Loading State

### Overview

Implement a loading UI component that displays while product data is being fetched on the server. This component leverages Next.js Suspense boundaries and provides visual feedback during asynchronous operations.

### Dependencies

- **Prerequisites:**
  - Task 01 completed (directory structure)
  - Task 02 completed (page component with async fetching)
  - Understanding of React Suspense and Next.js streaming

### Instructions

#### Step 1: Create Loading Component File

1. In the `app/products/[slug]` directory, create `loading.tsx`
2. This file must be named exactly `loading.tsx` to be recognized by Next.js
3. It will automatically wrap page.tsx in a Suspense boundary

#### Step 2: Design Loading State Visual

Plan the loading UI elements:
1. Skeleton structure matching the actual product layout
2. Animated placeholders for product images
3. Placeholder blocks for product title, price, description
4. Loading indicators for action buttons
5. Consistent spacing matching the actual layout

#### Step 3: Create Skeleton Components

Build skeleton elements for:
1. **Image Skeleton**: Large rectangular placeholder with shimmer animation
2. **Text Skeleton**: Multiple line placeholders of varying widths
3. **Button Skeleton**: Pill-shaped placeholders for action buttons
4. **Info Skeleton**: Smaller blocks for metadata (SKU, category, etc.)

#### Step 4: Implement Shimmer Animation

1. Use Tailwind CSS or CSS animations for shimmer effect
2. Create a subtle, non-distracting animation
3. Apply animation to skeleton elements
4. Ensure animation is performance-optimized

#### Step 5: Structure Loading Layout

Match the structure to the actual product layout:
1. Use same grid/flex layout as real product page
2. Match breakpoint behavior
3. Maintain aspect ratios for image placeholders
4. Align skeleton elements with real content positions

#### Step 6: Add Accessibility Features

1. Add aria-label="Loading product details"
2. Include sr-only text for screen readers
3. Use role="status" for loading indicators
4. Ensure keyboard users know page is loading

### Loading State Components Table

| Component | Purpose | Animation | Dimensions |
|-----------|---------|-----------|------------|
| Image Skeleton | Product image placeholder | Shimmer | Aspect ratio 1:1 or 4:3 |
| Title Skeleton | Product name placeholder | Shimmer | 2-3 lines, varying width |
| Price Skeleton | Price placeholder | Shimmer | Single line, short width |
| Description Skeleton | Description placeholder | Shimmer | 5-6 lines, full width |
| Button Skeleton | CTA placeholders | Shimmer | Button-sized blocks |
| Badge Skeleton | Tag/badge placeholders | Shimmer | Small pill shapes |

### Loading State Architecture Diagram

```
loading.tsx
    ↓
Suspense Boundary (automatic)
    ↓
Loading UI Structure
    ├── Image Column (left/top)
    │   └── Large Image Skeleton
    │       └── Shimmer Animation
    │
    └── Details Column (right/bottom)
        ├── Title Skeleton (2-3 lines)
        ├── Price Skeleton (1 line)
        ├── Rating Skeleton (stars)
        ├── Description Skeleton (6 lines)
        ├── Options Skeleton (if applicable)
        └── Button Skeletons (Add to Cart, etc.)
```

### Animation Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Duration | 1.5s | Smooth, not too fast |
| Timing Function | ease-in-out | Natural feel |
| Iteration | infinite | Continuous while loading |
| Direction | normal | Left to right shimmer |
| Opacity Range | 0.1 to 0.3 | Subtle effect |

### Expected Outcome

- Functional loading component that displays during data fetching
- Skeleton UI matching product layout structure
- Smooth shimmer animation providing visual feedback
- Responsive design matching actual product page
- Accessible to screen readers and keyboard users

### Verification Checklist

- [ ] File `loading.tsx` created in correct directory
- [ ] Skeleton structure matches product layout
- [ ] Shimmer animation implemented and smooth
- [ ] Responsive behavior across all breakpoints
- [ ] Accessibility attributes present (aria-label, role)
- [ ] Component exports correctly (default export)
- [ ] Loading state visible when navigating to product pages
- [ ] Transition from loading to loaded content is smooth
- [ ] No TypeScript or ESLint errors

---

## Task 05: Create Product Error State

### Overview

Implement an error boundary component that handles and displays errors occurring during product data fetching or rendering. This component provides user-friendly error messages and recovery options while logging errors for debugging.

### Dependencies

- **Prerequisites:**
  - Task 01 completed (directory structure)
  - Task 02 completed (page component)
  - Understanding of React Error Boundaries in Next.js

### Instructions

#### Step 1: Create Error Component File

1. In the `app/products/[slug]` directory, create `error.tsx`
2. This file must be named exactly `error.tsx` to be recognized
3. Mark as a Client Component with 'use client' directive (required for error boundaries)

#### Step 2: Define Error Component Props

Error components receive specific props:
1. `error` object containing error message and metadata
2. `reset` function to retry the failed operation
3. Type these props according to Next.js error boundary conventions

#### Step 3: Design Error UI Structure

Create user-friendly error display:
1. Error icon or illustration
2. Error heading (user-friendly title)
3. Error description (non-technical explanation)
4. Error details (technical info, collapsible)
5. Action buttons (Try Again, Go Back, Home)

#### Step 4: Implement Error Types Handling

Handle different error scenarios:
1. **Network Errors**: Connection issues, timeouts
2. **404 Errors**: Product not found (should redirect to not-found.tsx)
3. **Server Errors**: 500 errors, database issues
4. **Permission Errors**: Access denied scenarios
5. **Unknown Errors**: Generic fallback message

#### Step 5: Create Reset/Retry Functionality

1. Wire up the `reset` function to a "Try Again" button
2. Add navigation options (Back, Home)
3. Consider exponential backoff for automatic retries
4. Clear any error state before retry

#### Step 6: Add Error Logging

1. Log errors to console in development
2. Prepare error logging structure for production monitoring
3. Include error context (slug, timestamp, user agent)
4. Avoid logging sensitive information

#### Step 7: Implement Accessibility Features

1. Add appropriate ARIA roles (role="alert")
2. Ensure keyboard navigation for action buttons
3. Provide clear, actionable error messages
4. Use semantic HTML for error structure

### Error Types and Responses Table

| Error Type | User Message | Actions Available | Logging Priority |
|------------|--------------|-------------------|------------------|
| Network Error | "Connection lost. Please check your internet." | Try Again, Go Back | Medium |
| 404 Error | "Product not found." | Browse Products, Home | Low |
| Server Error | "Something went wrong. We're working on it." | Try Again, Home | High |
| Timeout | "Request took too long. Try again?" | Try Again, Go Back | Medium |
| Unknown | "Unexpected error occurred." | Try Again, Report | High |

### Error Boundary Flow Diagram

```
Product Page Renders
    ↓
Error Occurs (fetch, render, etc.)
    ↓
Next.js Catches Error
    ↓
error.tsx Activated
    ↓
Error Component Renders
    ├── Display Error UI
    ├── Log Error Details
    └── Show Recovery Options
        │
        ├── Reset Button → Calls reset()
        │   └── Retries page render
        │
        ├── Back Button → router.back()
        │   └── Returns to previous page
        │
        └── Home Button → router.push('/')
            └── Navigates to homepage
```

### Error UI Component Structure

```
Error Container
├── Icon/Illustration Section
│   └── Error icon or graphic
│
├── Message Section
│   ├── Error Title (h1/h2)
│   ├── User-Friendly Description
│   └── Details (collapsible)
│       ├── Error message
│       ├── Error code
│       └── Timestamp
│
└── Action Section
    ├── Primary: Try Again Button
    ├── Secondary: Go Back Button
    └── Tertiary: Home Link
```

### Expected Outcome

- Functional error boundary catching product page errors
- User-friendly error UI with clear messaging
- Recovery options (retry, back, home)
- Error logging for debugging and monitoring
- Accessible error presentation
- Graceful degradation of functionality

### Verification Checklist

- [ ] File `error.tsx` created as Client Component ('use client')
- [ ] Component receives error and reset props
- [ ] Error UI is user-friendly and clear
- [ ] Try Again button wired to reset function
- [ ] Navigation buttons functional (Back, Home)
- [ ] Different error types handled appropriately
- [ ] Error logging implemented
- [ ] ARIA attributes for accessibility
- [ ] Test by throwing errors in page.tsx
- [ ] Error boundary catches and displays errors
- [ ] Reset functionality works correctly
- [ ] No TypeScript or ESLint errors

---

## Task 06: Create Product Not Found Page

### Overview

Create a dedicated not-found component that displays when a requested product slug doesn't exist in the database. This provides a better user experience than a generic 404 error and offers navigation options to help users find what they're looking for.

### Dependencies

- **Prerequisites:**
  - Task 01 completed (directory structure)
  - Task 02 completed (page component)
  - Understanding of Next.js notFound() function

### Instructions

#### Step 1: Create Not Found Component File

1. In the `app/products/[slug]` directory, create `not-found.tsx`
2. This file must be named exactly `not-found.tsx` to be recognized
3. This component is triggered when `notFound()` is called in page.tsx

#### Step 2: Design Not Found UI

Create an informative and helpful 404 page:
1. "Product Not Found" heading
2. Friendly message explaining the situation
3. Possible reasons (removed, never existed, typo in URL)
4. Visual element (illustration or icon)
5. Call-to-action buttons

#### Step 3: Add Navigation Options

Provide helpful navigation paths:
1. **Search Button**: Link to product search page
2. **Browse Categories**: Link to category listing
3. **Home Button**: Return to homepage
4. **Recently Viewed**: Show user's recent products (if available)
5. **Popular Products**: Link to trending/popular section

#### Step 4: Implement Related Product Suggestions

Plan for dynamic suggestions:
1. Show similar products based on failed search term
2. Display popular products in similar category
3. Use the slug to infer product type/category
4. Fetch suggestions server-side if possible

#### Step 5: Add Search Functionality

Include a search box:
1. Pre-populate with the attempted product slug (cleaned)
2. Allow users to refine their search
3. Link to search results page
4. Provide autocomplete suggestions if available

#### Step 6: Configure SEO for 404

1. Set proper HTTP status code (Next.js handles this)
2. Add appropriate meta tags
3. Include canonical URL pointing to product listing
4. Prevent indexing of 404 pages (noindex)

#### Step 7: Add Analytics Tracking

1. Log 404 events for analysis
2. Track which slugs are commonly returning 404
3. Include referrer information
4. Help identify broken links or data issues

### Not Found Component Structure Table

| Section | Content | Action |
|---------|---------|--------|
| Header | "Product Not Found" title | Visual hierarchy |
| Illustration | 404 or empty state graphic | Brand-appropriate image |
| Message | Friendly explanation | Clear, helpful tone |
| Search Box | Pre-filled search input | Submit to search page |
| Quick Links | Category links, Home | Easy navigation |
| Suggestions | Related/popular products | Discover alternatives |

### User Flow Diagram

```
User Request: /products/non-existent-slug
    ↓
page.tsx Attempts Fetch
    ↓
Product Not Found in Database
    ↓
Code Calls: notFound()
    ↓
Next.js Routes to: not-found.tsx
    ↓
Not Found Component Renders
    ├── Display 404 UI
    ├── Log 404 Event
    └── Show Recovery Options
        │
        ├── Search Box → /search?q=slug
        ├── Categories → /products
        ├── Popular → /products/popular
        └── Home → /
```

### Navigation Options Table

| Option | Destination | Priority | Description |
|--------|-------------|----------|-------------|
| Search Products | `/search` | High | Let user search again |
| Browse Categories | `/products` or `/categories` | High | Explore product catalog |
| Popular Products | `/products/popular` | Medium | Show trending items |
| Home Page | `/` | Medium | Return to site root |
| Recently Viewed | `/products/recent` | Low | Personal history |
| Contact Support | `/support` | Low | Report issue |

### Expected Outcome

- Dedicated not-found page for missing products
- User-friendly messaging explaining the situation
- Multiple navigation options to help users
- Search functionality to find alternative products
- Related product suggestions (if applicable)
- Proper HTTP status and SEO configuration
- Analytics tracking for 404 patterns

### Verification Checklist

- [ ] File `not-found.tsx` created in correct directory
- [ ] Component renders when notFound() is called
- [ ] UI is friendly and helpful, not generic
- [ ] Navigation buttons link to correct pages
- [ ] Search box functional and pre-populated
- [ ] Related product suggestions implemented (if applicable)
- [ ] 404 events logged for analytics
- [ ] Proper meta tags set (noindex)
- [ ] Test by accessing invalid product slug
- [ ] Verify proper HTTP 404 status returned
- [ ] No TypeScript or ESLint errors

---

## Task 07: Create generateStaticParams

### Overview

Implement the generateStaticParams function to enable static generation of product detail pages at build time. This improves performance by pre-rendering popular or all product pages, reducing server load and improving Time to First Byte (TTFB).

### Dependencies

- **Prerequisites:**
  - Task 02 completed (page component)
  - Product API or database access available
  - Understanding of Next.js Static Site Generation (SSG)

- **Related Tasks:**
  - Task 13 (Product data fetcher will be used here)
  - Task 15 (Product API service)

### Instructions

#### Step 1: Add generateStaticParams Function

1. Open the `page.tsx` file created in Task 02
2. Export an async function named exactly `generateStaticParams`
3. This function must return an array of param objects
4. Each object should have a `slug` property

#### Step 2: Determine Static Generation Strategy

Choose a strategy based on product catalog size:
1. **Full Static**: Generate all products (< 10,000 products)
2. **Partial Static**: Generate only popular/featured products
3. **Incremental Static Regeneration (ISR)**: Generate on-demand with revalidation
4. **Hybrid**: Static for popular, dynamic for others

#### Step 3: Fetch Product Slugs

Implement the fetching logic:
1. Query database or API for all product slugs
2. Apply filters if using partial static generation
3. Handle pagination if product list is large
4. Include error handling for fetch failures

#### Step 4: Filter Products for Static Generation

If using partial static:
1. Filter by popularity (view count, sales)
2. Filter by featured status
3. Filter by recent additions (last 30 days)
4. Limit to a reasonable number (e.g., top 1000)

#### Step 5: Return Params Array

Format the return value:
1. Map product slugs to param objects: `{ slug: 'product-slug' }`
2. Ensure slugs are URL-safe (already should be from database)
3. Remove duplicates if necessary
4. Validate slug format before returning

#### Step 6: Configure ISR (Optional)

If using Incremental Static Regeneration:
1. Export a `revalidate` constant (e.g., 3600 for 1 hour)
2. Or use `revalidate: false` for always static
3. Consider time-based revalidation for product pages
4. Balance freshness vs. build performance

#### Step 7: Implement Fallback Strategy

Plan for products not in static params:
1. Set `dynamicParams = true` to allow dynamic rendering
2. Or `dynamicParams = false` to return 404 for non-static
3. Consider using 'blocking' fallback behavior
4. Ensure consistency with static pages

### Static Generation Strategies Table

| Strategy | Use Case | Build Time | Runtime Load | Data Freshness |
|----------|----------|------------|--------------|----------------|
| Full Static | Small catalog (<5k) | High | Very Low | Build time |
| Partial Static | Large catalog | Medium | Low | Build time + dynamic |
| ISR (1 hour) | Medium catalog | Low | Medium | 1 hour stale |
| ISR (1 day) | Large catalog | Low | Medium | 1 day stale |
| Dynamic Only | Very large/real-time | Very Low | High | Real-time |

### generateStaticParams Flow Diagram

```
Build Process Starts
    ↓
Next.js Calls: generateStaticParams()
    ↓
Function Execution
    ├── Fetch Product Slugs from API/DB
    ├── Apply Filters (if partial)
    ├── Map to Param Objects
    └── Return Array: [{ slug: 'abc' }, { slug: 'xyz' }, ...]
    ↓
For Each Slug
    ├── Call page.tsx with params
    ├── Fetch Product Data
    ├── Render HTML
    └── Save to .next/server
    ↓
Static Files Ready
    ↓
Runtime: Serve Pre-rendered HTML
    ↓
ISR (if configured): Revalidate in Background
```

### Filter Criteria for Partial Static

| Filter Type | Criteria | SQL Example Pattern | Limit |
|-------------|----------|---------------------|-------|
| Popular | View count > 100 | ORDER BY views DESC | Top 500 |
| Featured | featured = true | WHERE featured = true | All |
| Recent | Created last 30 days | WHERE created > NOW() - 30 | Top 200 |
| High Revenue | Sales revenue high | ORDER BY revenue DESC | Top 300 |
| Combined | Multiple criteria | Complex WHERE + ORDER | Top 1000 |

### Revalidation Configuration

| Setting | Value | Behavior |
|---------|-------|----------|
| `revalidate: false` | No revalidation | Pure static, rebuild to update |
| `revalidate: 60` | 60 seconds | Revalidate every minute |
| `revalidate: 3600` | 1 hour | Revalidate every hour |
| `revalidate: 86400` | 1 day | Revalidate daily |
| No revalidate | Default | Revalidate based on fetch cache |

### Expected Outcome

- generateStaticParams function implemented in page.tsx
- Product pages pre-rendered at build time
- Improved performance for static pages (instant load)
- Proper handling of dynamic products (if any)
- ISR configuration for data freshness (if applicable)
- Reduced server load for popular products

### Verification Checklist

- [ ] generateStaticParams function exported from page.tsx
- [ ] Function returns array of param objects with slug
- [ ] Product slugs fetched from appropriate source
- [ ] Filter logic applied (if using partial static)
- [ ] Revalidate config set (if using ISR)
- [ ] dynamicParams setting configured
- [ ] Build process generates static pages: `npm run build`
- [ ] Verify .next/server contains generated pages
- [ ] Static pages load instantly without server request
- [ ] Dynamic products (if any) render correctly
- [ ] No build errors or warnings
- [ ] TypeScript types correct for function signature

---

## Task 08: Create generateMetadata

### Overview

Implement the generateMetadata function to dynamically generate SEO metadata for each product page. This includes title, description, Open Graph tags, Twitter Card tags, and structured data (JSON-LD) for enhanced search engine visibility and social media sharing.

### Dependencies

- **Prerequisites:**
  - Task 02 completed (page component)
  - Task 07 completed (generateStaticParams)
  - Product data structure defined

- **Related Tasks:**
  - Task 13 (Product data fetcher)
  - Task 14 (Product types)

### Instructions

#### Step 1: Add generateMetadata Function

1. Open the `page.tsx` file
2. Export an async function named exactly `generateMetadata`
3. Function receives same props as page component (params)
4. Must return a Metadata object (Next.js type)

#### Step 2: Fetch Product Data

1. Extract slug from params (await if async params)
2. Reuse product fetching logic from page component
3. Handle cases where product is not found
4. Return default/fallback metadata for errors

#### Step 3: Build Basic Metadata

Create core metadata fields:
1. **Title**: Product name + brand/site name (format: "Product Name | LankaCommerce")
2. **Description**: Product short description (150-160 characters)
3. **Keywords**: Relevant product keywords (optional, less important for SEO)

#### Step 4: Configure Open Graph Metadata

Add Open Graph tags for social sharing:
1. **og:title**: Product name
2. **og:description**: Product description
3. **og:image**: Product main image URL (absolute URL)
4. **og:url**: Canonical product page URL
5. **og:type**: "product"
6. **og:price:amount**: Product price
7. **og:price:currency**: Currency code (LKR)
8. **og:availability**: Stock status

#### Step 5: Configure Twitter Card Metadata

Add Twitter Card tags:
1. **twitter:card**: "summary_large_image"
2. **twitter:title**: Product name
3. **twitter:description**: Product description
4. **twitter:image**: Product image URL
5. **twitter:site**: Site Twitter handle (if any)

#### Step 6: Add Structured Data (JSON-LD)

Create Product schema for rich snippets:
1. @type: "Product"
2. name: Product name
3. image: Array of product images
4. description: Full product description
5. sku: Product SKU
6. brand: Brand information
7. offers: Price, currency, availability
8. aggregateRating: Average rating (if available)
9. review: Customer reviews (if available)

#### Step 7: Configure Additional Metadata

Add other important meta tags:
1. **robots**: "index, follow" (allow indexing)
2. **canonical**: Canonical URL (prevent duplicates)
3. **alternate**: Alternate language versions (if multilingual)
4. **viewport**: Already set globally, but can override

#### Step 8: Handle Image URLs

Ensure all image URLs are absolute:
1. Check if image URLs are relative
2. Prepend domain if necessary
3. Use primary product image for social sharing
4. Provide fallback image if product has no image
5. Optimize image dimensions for social platforms (1200x630 for OG)

### Metadata Structure Table

| Category | Fields | Purpose | Priority |
|----------|--------|---------|----------|
| Basic | title, description | Search results, browser tab | Critical |
| Open Graph | og:*, product:* | Facebook, LinkedIn sharing | High |
| Twitter | twitter:* | Twitter sharing | High |
| Structured Data | JSON-LD Product | Rich snippets, Google Shopping | High |
| Robots | robots, canonical | Indexing control | Medium |
| Icons | favicon, apple-touch-icon | Browser, bookmarks | Low |

### generateMetadata Flow Diagram

```
Page Render Request
    ↓
Next.js Calls: generateMetadata({ params })
    ↓
Extract: slug from params
    ↓
Fetch: Product data by slug
    ↓
Build Metadata Object
    ├── Title: "Product Name | LankaCommerce"
    ├── Description: Short description
    ├── Open Graph
    │   ├── Title, Description, Image
    │   ├── URL, Type: "product"
    │   └── Price, Currency, Availability
    ├── Twitter Card
    │   ├── Card: "summary_large_image"
    │   └── Title, Description, Image
    └── Structured Data (JSON-LD)
        └── Product schema with all details
    ↓
Return: Metadata object
    ↓
Next.js: Injects metadata into <head>
    ↓
HTML Rendered with SEO tags
```

### Open Graph Product Tags Table

| Property | Example Value | Required | Notes |
|----------|---------------|----------|-------|
| og:title | "Wireless Mouse Pro" | Yes | Product name |
| og:description | "Ergonomic wireless mouse..." | Yes | Short description |
| og:image | "https://site.com/img.jpg" | Yes | Absolute URL, 1200x630 |
| og:url | "https://site.com/products/mouse" | Yes | Canonical URL |
| og:type | "product" | Yes | Specifies product type |
| product:price:amount | "2500.00" | No | Numeric price |
| product:price:currency | "LKR" | No | ISO currency code |
| product:availability | "in stock" | No | Stock status |

### Structured Data (JSON-LD) Schema

```
Product Schema Elements:
├── @context: "https://schema.org/"
├── @type: "Product"
├── name: Product name
├── image: [Array of image URLs]
├── description: Full description
├── sku: Product SKU/ID
├── brand
│   ├── @type: "Brand"
│   └── name: Brand name
├── offers
│   ├── @type: "Offer"
│   ├── url: Product URL
│   ├── priceCurrency: "LKR"
│   ├── price: "2500.00"
│   ├── availability: "https://schema.org/InStock"
│   └── priceValidUntil: Date
├── aggregateRating (if available)
│   ├── @type: "AggregateRating"
│   ├── ratingValue: 4.5
│   ├── reviewCount: 28
│   └── bestRating: 5
└── review (if available)
    └── Array of Review objects
```

### Title Format Examples

| Product Type | Title Format | Character Length |
|--------------|--------------|------------------|
| Simple Product | "Product Name \| LankaCommerce" | 50-60 chars |
| With Brand | "Product Name - Brand \| LCC" | 50-60 chars |
| With Category | "Product \| Category \| LCC" | 50-60 chars |
| With Variant | "Product (Variant) \| LCC" | 50-60 chars |

### Expected Outcome

- generateMetadata function implemented in page.tsx
- Dynamic metadata generated for each product
- Comprehensive SEO tags (title, description)
- Social sharing optimization (OG, Twitter)
- Structured data for rich search results
- Proper handling of missing product data
- Improved search engine rankings and CTR

### Verification Checklist

- [ ] generateMetadata function exported from page.tsx
- [ ] Function receives params and extracts slug
- [ ] Product data fetched for metadata generation
- [ ] Title tag properly formatted (50-60 chars)
- [ ] Description tag compelling (150-160 chars)
- [ ] Open Graph tags present and correct
- [ ] Twitter Card tags present and correct
- [ ] Structured data (JSON-LD) implemented
- [ ] All image URLs are absolute
- [ ] Canonical URL set correctly
- [ ] Test metadata with browser dev tools
- [ ] Validate OG tags with Facebook Debugger
- [ ] Validate Twitter Card with Twitter Validator
- [ ] Validate structured data with Google Rich Results Test
- [ ] No TypeScript errors in metadata function

---

## Document Summary

This document covered Tasks 01-08 of Phase-08 SubPhase-04 Group-A, establishing the foundational route structure, layout, loading/error states, and SEO optimization for the product detail page.

### Tasks Completed

1. ✅ Created product detail directory structure
2. ✅ Created main page component with dynamic routing
3. ✅ Created layout wrapper with breadcrumb placeholder
4. ✅ Created loading state with skeleton UI
5. ✅ Created error boundary with recovery options
6. ✅ Created not-found page for missing products
7. ✅ Implemented generateStaticParams for static generation
8. ✅ Implemented generateMetadata for SEO optimization

### Next Steps

Proceed to [02_Tasks-09-16_Container-Data-Verify.md](./02_Tasks-09-16_Container-Data-Verify.md) to implement:
- Product page container component
- Breadcrumb navigation
- Responsive layout (two-column, mobile stack)
- Product data fetching and types
- API service integration
- Route and data flow verification

### Key Files Created

| File | Purpose | Task |
|------|---------|------|
| `app/products/[slug]/page.tsx` | Main route component | 02 |
| `app/products/[slug]/layout.tsx` | Layout wrapper | 03 |
| `app/products/[slug]/loading.tsx` | Loading state | 04 |
| `app/products/[slug]/error.tsx` | Error boundary | 05 |
| `app/products/[slug]/not-found.tsx` | 404 page | 06 |

### Architecture Established

- ✅ Dynamic routing with slug parameter
- ✅ Server-side data fetching structure
- ✅ Suspense boundaries for loading states
- ✅ Error handling with recovery
- ✅ Static generation for performance
- ✅ Comprehensive SEO metadata
- ✅ Responsive layout foundation

---

**Document Status:** Complete  
**Last Updated:** January 2026  
**Next Document:** [02_Tasks-09-16_Container-Data-Verify.md](./02_Tasks-09-16_Container-Data-Verify.md)
