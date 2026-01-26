# Tasks 01-08: Routes, Layout, and Page Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** A - Catalog Routes & Pages  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Header-Containers-Verify.md](02_Tasks-09-16_Header-Containers-Verify.md)

---

## Document Overview

This document covers the creation of the product catalog route structure and core page components. It establishes the foundational structure for all product catalog pages, including the products directory setup, route creation for all products/category/collection pages, layout component configuration, loading and error states, and the main catalog page component wrapper.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Products Directory | Low | 10 min |
| 02 | Create All Products Page Route | Low | 20 min |
| 03 | Create Category Page Route | Low | 25 min |
| 04 | Create Collection Page Route | Low | 25 min |
| 05 | Create Products Layout | Medium | 30 min |
| 06 | Create Products Loading State | Low | 20 min |
| 07 | Create Products Error State | Low | 20 min |
| 08 | Create Catalog Page Component | Medium | 30 min |

---

## Task 01: Create Products Directory

### Overview
Create the `products` directory within the `(storefront)` route group in the Next.js App Router. This directory serves as the parent route for all product catalog pages, including all products listing, category-specific pages, and collection pages. The directory structure enables organized routing while maintaining clean URLs.

### Dependencies
- SubPhase-02 (Storefront Route Structure) must be complete
- (storefront) route group must exist
- Next.js App Router structure is established

### Instructions

1. **Navigate to the storefront route group**
   - Go to `frontend/app/(storefront)/` directory
   - Verify the (storefront) route group exists
   - This is where customer-facing pages are organized

2. **Create the products directory**
   - Create a new directory named `products`
   - This directory will contain all product catalog routes
   - Maintains clean URL structure: `/products`, `/products/category/...`, etc.

3. **Understand directory routing behavior**
   - `app/(storefront)/products/page.tsx` → `/products` (all products)
   - `app/(storefront)/products/category/[slug]/page.tsx` → `/products/category/electronics`
   - `app/(storefront)/products/collection/[slug]/page.tsx` → `/products/collection/summer-sale`
   - Parent directory allows shared layout for all product pages

4. **Plan subdirectory structure**
   - Prepare for `category/` and `collection/` subdirectories (Tasks 03-04)
   - Consider future expansion (search, filters, etc.)
   - Maintain organized hierarchy

### Directory Purpose

| Feature | Benefit |
|---------|---------|
| Shared Layout | All product pages use consistent layout |
| Clean URLs | Logical URL structure for SEO |
| Organization | Groups related product routes |
| Scalability | Easy to add new product page types |

### Directory Structure
```
frontend/app/
├── (storefront)/
│   ├── products/              # Product catalog root
│   │   ├── page.tsx           # (Created in Task 02)
│   │   ├── layout.tsx         # (Created in Task 05)
│   │   ├── loading.tsx        # (Created in Task 06)
│   │   ├── error.tsx          # (Created in Task 07)
│   │   ├── category/          # (Created in Task 03)
│   │   └── collection/        # (Created in Task 04)
│   ├── layout.tsx             # Storefront layout
│   └── page.tsx               # Homepage
└── layout.tsx                 # Root layout
```

### URL Structure Overview

| Directory Path | URL Path | Purpose |
|----------------|----------|---------|
| `products/page.tsx` | `/products` | All products listing |
| `products/category/[slug]/page.tsx` | `/products/category/{slug}` | Category products |
| `products/collection/[slug]/page.tsx` | `/products/collection/{slug}` | Collection products |

### Expected Outcome
- Products directory created with proper naming
- Foundation for product catalog route structure
- Organized location for all product-related pages
- Ready for route and layout creation

### Verification Checklist
- [ ] `frontend/app/(storefront)/products/` directory exists
- [ ] Directory located under (storefront) route group
- [ ] Directory name is lowercase `products`
- [ ] Path structure follows Next.js conventions

---

## Task 02: Create All Products Page Route

### Overview
Create the main products page route (`page.tsx`) that displays all available products in the catalog. This page serves as the primary product listing, showing all products with filtering, sorting, and search capabilities. It uses Next.js Server Components for optimal performance and SEO.

### Dependencies
- Task 01: Create Products Directory

### Instructions

1. **Create page.tsx file**
   - Navigate to `frontend/app/(storefront)/products/` directory
   - Create new file named `page.tsx`
   - This becomes the route for `/products` URL

2. **Import required dependencies**
   - Import React types if needed
   - Import Metadata type from Next.js for SEO
   - Import CatalogPage component (created in Task 08)
   - Import product data fetching utilities (from libs or services)

3. **Define page metadata**
   - Export metadata object with page title
   - Set title to "All Products | LankaCommerce Cloud"
   - Add description for SEO: "Browse our complete product catalog"
   - Include Open Graph and Twitter card metadata

4. **Configure searchParams**
   - Accept searchParams prop for URL query handling
   - Support filter parameters (category, price, etc.)
   - Support sort parameter (newest, price-asc, price-desc)
   - Support pagination parameters (page, limit)

5. **Implement server-side data fetching**
   - Use async function component (Server Component)
   - Fetch products based on searchParams
   - Apply filters, sorting, and pagination server-side
   - Handle empty states gracefully

6. **Pass data to CatalogPage component**
   - Render CatalogPage component with fetched products
   - Pass filter state and sort options
   - Pass pagination information
   - Pass page-specific metadata (title, breadcrumb)

7. **Implement error handling**
   - Wrap data fetching in try-catch
   - Handle API errors gracefully
   - Return appropriate error boundaries
   - Log errors for debugging

### Page Component Props

| Prop | Type | Description |
|------|------|-------------|
| searchParams | Promise<Record<string, string \| string[]>> | URL query parameters |

### Metadata Configuration

| Field | Value | Purpose |
|-------|-------|---------|
| title | "All Products \| LCC" | Browser tab title |
| description | "Browse our complete catalog" | SEO description |
| openGraph | { title, description, type } | Social sharing |
| robots | "index, follow" | Search engine directives |

### Search Parameters

| Parameter | Type | Example | Purpose |
|-----------|------|---------|---------|
| category | string | "electronics" | Filter by category |
| collection | string | "summer-sale" | Filter by collection |
| sort | string | "price-asc" | Sort products |
| page | number | "2" | Pagination page |
| limit | number | "24" | Items per page |
| minPrice | number | "100" | Price range min |
| maxPrice | number | "1000" | Price range max |

### Data Flow

```
URL: /products?sort=price-asc&category=electronics
         ↓
searchParams extracted by Next.js
         ↓
Server Component receives searchParams
         ↓
Fetch products with filters applied
         ↓
Pass data to CatalogPage component
         ↓
Render catalog with filtered products
```

### Server Component Benefits

| Benefit | Description |
|---------|-------------|
| SEO | Fully rendered HTML for search engines |
| Performance | No client-side data fetching delay |
| Security | API keys stay on server |
| Bundle Size | Less JavaScript shipped to client |

### Expected Outcome
- Functional all products page route at `/products`
- Server-side data fetching with filtering and sorting
- Proper SEO metadata configuration
- Clean integration with CatalogPage component

### Verification Checklist
- [ ] `frontend/app/(storefront)/products/page.tsx` file created
- [ ] Metadata exported for SEO
- [ ] searchParams prop configured correctly
- [ ] Server-side data fetching implemented
- [ ] CatalogPage component integrated
- [ ] Error handling in place
- [ ] TypeScript types defined correctly

---

## Task 03: Create Category Page Route

### Overview
Create the dynamic category page route using Next.js dynamic segments `[slug]`. This route displays products filtered by a specific category, with the category determined by the URL slug parameter. Supports dynamic metadata generation for SEO and proper category-specific content rendering.

### Dependencies
- Task 01: Create Products Directory

### Instructions

1. **Create category directory structure**
   - Navigate to `frontend/app/(storefront)/products/` directory
   - Create new directory named `category`
   - Inside `category/`, create directory named `[slug]`
   - Brackets indicate a dynamic route segment

2. **Create category page file**
   - Inside `[slug]/` directory, create `page.tsx`
   - This route matches `/products/category/{any-slug}`
   - Examples: `/products/category/electronics`, `/products/category/clothing`

3. **Define page params interface**
   - Create TypeScript interface for params
   - Include slug parameter (string)
   - Include searchParams for additional filters

4. **Implement generateMetadata function**
   - Export async function `generateMetadata`
   - Receives params with slug
   - Fetch category data by slug
   - Return dynamic metadata (title, description)
   - Format: "{Category Name} | Products | LCC"

5. **Fetch category data**
   - Use async function component
   - Extract slug from params.slug
   - Fetch category information (name, description, image)
   - Fetch products belonging to this category
   - Apply additional filters from searchParams

6. **Handle category not found**
   - Check if category exists
   - Return 404 or redirect if category not found
   - Use notFound() from Next.js navigation

7. **Render CatalogPage with category context**
   - Pass category information to CatalogPage
   - Pass filtered products
   - Pass breadcrumb data (Home > Products > Category Name)
   - Pass category-specific filters

8. **Implement static params generation (optional)**
   - Export generateStaticParams for pre-rendering
   - Fetch all category slugs
   - Return array of params for static generation
   - Improves performance at build time

### Dynamic Route Structure

```
products/
└── category/
    └── [slug]/
        └── page.tsx
             ↓
URL: /products/category/electronics
      ↑                  ↑
      Static            Dynamic (slug)
```

### Page Component Props

| Prop | Type | Description |
|------|------|-------------|
| params | Promise<{ slug: string }> | URL path parameters |
| searchParams | Promise<Record<string, string \| string[]>> | URL query parameters |

### Dynamic Metadata Example

| Category Slug | Generated Title | Generated Description |
|---------------|----------------|----------------------|
| electronics | "Electronics \| Products \| LCC" | "Shop electronics products" |
| clothing | "Clothing \| Products \| LCC" | "Shop clothing products" |
| home-decor | "Home Decor \| Products \| LCC" | "Shop home decor products" |

### Category Data Structure

| Field | Type | Description |
|-------|------|-------------|
| slug | string | URL-friendly identifier |
| name | string | Display name |
| description | string | Category description |
| image | string | Category header image |
| productCount | number | Total products in category |
| parentCategory | string \| null | Parent category slug |

### Static Generation Flow

```
Build Time
    ↓
generateStaticParams() called
    ↓
Fetch all category slugs
    ↓
Return: [{ slug: "electronics" }, { slug: "clothing" }, ...]
    ↓
Next.js pre-renders each category page
    ↓
Pages served instantly at runtime
```

### Expected Outcome
- Dynamic category route working at `/products/category/[slug]`
- Dynamic metadata generation per category
- Category-specific product filtering
- Proper 404 handling for invalid categories
- Optional static generation for popular categories

### Verification Checklist
- [ ] `frontend/app/(storefront)/products/category/[slug]/page.tsx` created
- [ ] Dynamic slug parameter configured
- [ ] generateMetadata function implemented
- [ ] Category data fetching working
- [ ] Products filtered by category
- [ ] notFound() handling for invalid slugs
- [ ] CatalogPage integration complete
- [ ] Breadcrumbs show category name

---

## Task 04: Create Collection Page Route

### Overview
Create the dynamic collection page route using Next.js dynamic segments `[slug]`. Collections are curated product groups (e.g., "Summer Sale", "New Arrivals", "Staff Picks") that can span multiple categories. This route displays products belonging to a specific collection with appropriate filtering and metadata.

### Dependencies
- Task 01: Create Products Directory

### Instructions

1. **Create collection directory structure**
   - Navigate to `frontend/app/(storefront)/products/` directory
   - Create new directory named `collection`
   - Inside `collection/`, create directory named `[slug]`
   - Follows same dynamic routing pattern as categories

2. **Create collection page file**
   - Inside `[slug]/` directory, create `page.tsx`
   - This route matches `/products/collection/{any-slug}`
   - Examples: `/products/collection/summer-sale`, `/products/collection/new-arrivals`

3. **Define page params interface**
   - Create TypeScript interface for params
   - Include slug parameter (string)
   - Include searchParams for additional filters
   - Similar structure to category page

4. **Implement generateMetadata function**
   - Export async function `generateMetadata`
   - Receives params with collection slug
   - Fetch collection data by slug
   - Return dynamic metadata (title, description, image)
   - Format: "{Collection Name} | Products | LCC"

5. **Fetch collection data**
   - Use async function component
   - Extract slug from params.slug
   - Fetch collection information (name, description, banner)
   - Fetch products assigned to this collection
   - Collections may include cross-category products

6. **Handle collection not found**
   - Check if collection exists
   - Return 404 or redirect if collection not found
   - Use notFound() from Next.js navigation
   - Provide helpful error message

7. **Render CatalogPage with collection context**
   - Pass collection information to CatalogPage
   - Pass collection-specific products
   - Pass breadcrumb data (Home > Products > Collection Name)
   - Pass collection banner or promotional content

8. **Support time-based collections**
   - Handle collections with start/end dates
   - Show "Coming Soon" or "Ended" states
   - Filter products based on collection availability
   - Redirect expired collections appropriately

### Dynamic Route Structure

```
products/
└── collection/
    └── [slug]/
        └── page.tsx
             ↓
URL: /products/collection/summer-sale
      ↑                    ↑
      Static              Dynamic (slug)
```

### Page Component Props

| Prop | Type | Description |
|------|------|-------------|
| params | Promise<{ slug: string }> | URL path parameters |
| searchParams | Promise<Record<string, string \| string[]>> | URL query parameters |

### Collection vs Category

| Aspect | Category | Collection |
|--------|----------|------------|
| Structure | Hierarchical | Flat/Curated |
| Products | By classification | Hand-picked |
| Duration | Permanent | May be temporary |
| Examples | Electronics, Clothing | Summer Sale, New Arrivals |
| Cross-Category | No | Yes |

### Collection Data Structure

| Field | Type | Description |
|-------|------|-------------|
| slug | string | URL-friendly identifier |
| name | string | Display name |
| description | string | Collection description |
| banner | string | Hero banner image |
| startDate | Date \| null | Collection start date |
| endDate | Date \| null | Collection end date |
| productIds | string[] | Assigned product IDs |
| featured | boolean | Show on homepage |

### Collection Metadata Example

| Collection Slug | Generated Title | Description |
|-----------------|----------------|-------------|
| summer-sale | "Summer Sale \| Products \| LCC" | "Hot summer deals" |
| new-arrivals | "New Arrivals \| Products \| LCC" | "Latest products" |
| staff-picks | "Staff Picks \| Products \| LCC" | "Recommended by our team" |

### Time-Based Logic

```
Collection Query
    ↓
Check if collection has date constraints
    ↓
Current Date vs Start/End Date
    ↓
┌─────────┬─────────────┬──────────┐
│ Before  │  Active     │  After   │
│ Start   │  Period     │  End     │
├─────────┼─────────────┼──────────┤
│ Coming  │  Show       │  Ended   │
│ Soon    │  Products   │  Message │
└─────────┴─────────────┴──────────┘
```

### Expected Outcome
- Dynamic collection route working at `/products/collection/[slug]`
- Dynamic metadata generation per collection
- Collection-specific product display
- Time-based collection handling
- Proper 404 handling for invalid collections

### Verification Checklist
- [ ] `frontend/app/(storefront)/products/collection/[slug]/page.tsx` created
- [ ] Dynamic slug parameter configured
- [ ] generateMetadata function implemented
- [ ] Collection data fetching working
- [ ] Products filtered by collection
- [ ] notFound() handling for invalid slugs
- [ ] Time-based logic implemented (if applicable)
- [ ] CatalogPage integration complete
- [ ] Breadcrumbs show collection name

---

## Task 05: Create Products Layout

### Overview
Create the layout component for the products directory that wraps all product catalog pages. This layout provides consistent structure, navigation, and context for all products, categories, and collection pages. Unlike the auth layout, this layout is minimal and primarily serves as a wrapper for shared functionality.

### Dependencies
- Task 01: Create Products Directory

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(storefront)/products/` directory
   - Create new file named `layout.tsx`
   - This layout wraps all pages in the products directory
   - Applies to `/products`, `/products/category/...`, `/products/collection/...`

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import any shared context providers
   - Import analytics or tracking utilities
   - Import shared metadata configurations

3. **Define layout component structure**
   - Define default export function `ProductsLayout`
   - Accept `children` prop of type `ReactNode`
   - Return JSX structure with main wrapper

4. **Implement layout wrapper**
   - Create main container div
   - Apply max-width constraints (max-w-7xl)
   - Add responsive padding (px-4 sm:px-6 lg:px-8)
   - Ensure content is centered (mx-auto)

5. **Add product context provider (if needed)**
   - Wrap children with any necessary context providers
   - ProductFiltersProvider for shared filter state
   - ProductViewProvider for grid/list toggle
   - Keep client-side contexts minimal

6. **Configure page analytics**
   - Add page view tracking
   - Track catalog interactions
   - Monitor filter usage
   - Track product impressions

7. **Ensure server component compatibility**
   - Keep layout as Server Component if possible
   - Only add 'use client' if absolutely necessary
   - Minimize client-side JavaScript

### Layout Component Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Page content to render |

### Layout Structure

```
┌────────────────────────────────────────┐
│  Products Layout                       │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │        {children}                │ │
│  │      (Page Content)              │ │
│  │   - All Products Page            │ │
│  │   - Category Page                │ │
│  │   - Collection Page              │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### Layout Responsibilities

| Responsibility | Implementation |
|----------------|----------------|
| Container | Max-width and padding |
| Context | Shared state providers |
| Analytics | Page view tracking |
| SEO | Structured data markup |

### Container Styling

| Property | Tailwind Class | Purpose |
|----------|---------------|---------|
| Max Width | `max-w-7xl` | Limit content width |
| Padding | `px-4 sm:px-6 lg:px-8` | Responsive spacing |
| Center | `mx-auto` | Horizontal centering |
| Background | `bg-white` | Clean background |

### Server vs Client Considerations

| Feature | Component Type | Reason |
|---------|---------------|---------|
| Container Wrapper | Server | No interactivity needed |
| Filter Context | Client | Requires state management |
| View Toggle | Client | User interaction |
| Analytics | Client | Browser APIs required |

### Context Providers (Optional)

| Provider | Purpose | Type |
|----------|---------|------|
| ProductFiltersProvider | Shared filter state | Client |
| ProductViewProvider | Grid/list view toggle | Client |
| CompareProvider | Product comparison | Client |

### Expected Outcome
- Functional layout component for products directory
- Consistent max-width and padding across pages
- Optional context providers for shared state
- Clean, minimal wrapper that doesn't interfere with pages

### Verification Checklist
- [ ] `frontend/app/(storefront)/products/layout.tsx` file created
- [ ] Layout component exports properly
- [ ] Accepts children prop correctly
- [ ] Container styling applied (max-w, padding)
- [ ] Layout applies to all product pages
- [ ] Server Component unless client features needed
- [ ] TypeScript types defined correctly

---

## Task 06: Create Products Loading State

### Overview
Create the loading.tsx file that displays a skeleton loading state while product data is being fetched. This provides immediate visual feedback to users and improves perceived performance. The loading state should mirror the structure of the actual catalog page with skeleton placeholders.

### Dependencies
- Task 02: Create All Products Page Route

### Instructions

1. **Create loading.tsx file**
   - Navigate to `frontend/app/(storefront)/products/` directory
   - Create new file named `loading.tsx`
   - This file automatically triggers during Suspense boundaries
   - Shows while page data is loading

2. **Import skeleton components**
   - Import Skeleton component from UI library
   - Import any custom skeleton components
   - Ensure components are styled appropriately

3. **Design loading layout structure**
   - Mirror the actual catalog page structure
   - Include header skeleton (title, breadcrumbs)
   - Include filters sidebar skeleton
   - Include product grid skeleton

4. **Create header skeleton**
   - Skeleton for breadcrumb navigation
   - Skeleton for page title (large width)
   - Skeleton for product count (small width)
   - Match spacing of actual header

5. **Create filters skeleton**
   - Skeleton for filter sections
   - Multiple skeleton lines for filter options
   - Match sidebar width and height
   - Include section headers skeleton

6. **Create product grid skeleton**
   - Grid layout matching actual products
   - Multiple product card skeletons (12-24 items)
   - Each card has: image, title, price, button skeletons
   - Responsive grid (1 col mobile, 3-4 cols desktop)

7. **Add animation effects**
   - Use pulse or shimmer animation
   - Tailwind: `animate-pulse`
   - Keep animation subtle and smooth
   - Consistent animation across all skeletons

### Loading State Structure

```
┌────────────────────────────────────────┐
│ ▓▓▓▓▓ > ▓▓▓▓▓ > ▓▓▓▓▓  (Breadcrumb)  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         (Title)      │
│ ▓▓▓▓▓ products          (Count)       │
├────────────────────────────────────────┤
│ ┌────────┐  ┌─────────────────────┐  │
│ │ Filters│  │  Product Grid       │  │
│ │ ▓▓▓▓▓▓ │  │  ┌───┐ ┌───┐ ┌───┐ │  │
│ │ ▓▓▓▓   │  │  │▓▓▓│ │▓▓▓│ │▓▓▓│ │  │
│ │ ▓▓▓▓▓▓ │  │  │▓▓▓│ │▓▓▓│ │▓▓▓│ │  │
│ │ ▓▓▓▓   │  │  └───┘ └───┘ └───┘ │  │
│ └────────┘  │  ┌───┐ ┌───┐ ┌───┐ │  │
│             │  │▓▓▓│ │▓▓▓│ │▓▓▓│ │  │
│             │  └───┘ └───┘ └───┘ │  │
│             └─────────────────────┘  │
└────────────────────────────────────────┘
```

### Skeleton Components

| Component | Skeleton Elements | Animation |
|-----------|------------------|-----------|
| Breadcrumb | 3-4 small rectangles | Pulse |
| Title | Wide rectangle (h-8) | Pulse |
| Count | Short rectangle (h-4) | Pulse |
| Filter Section | Multiple lines | Pulse |
| Product Card | Image + 3 lines + button | Pulse |

### Product Card Skeleton Structure

| Element | Skeleton Size | Tailwind Classes |
|---------|--------------|------------------|
| Image | Full width, aspect-square | `w-full aspect-square bg-gray-200` |
| Title | 75% width | `h-4 w-3/4 bg-gray-200` |
| Price | 40% width | `h-4 w-2/5 bg-gray-200` |
| Rating | 50% width | `h-3 w-1/2 bg-gray-200` |
| Button | Full width | `h-10 w-full bg-gray-200` |

### Grid Layout

| Screen Size | Columns | Gap |
|-------------|---------|-----|
| Mobile | 1 | gap-4 |
| Tablet | 2-3 | gap-6 |
| Desktop | 4 | gap-6 |
| Large Desktop | 4-5 | gap-8 |

### Animation Timing

| Property | Value | Purpose |
|----------|-------|---------|
| Duration | 1.5s | Smooth, not jarring |
| Iteration | Infinite | Continuous feedback |
| Timing Function | Ease-in-out | Natural motion |

### Expected Outcome
- Functional loading state that mirrors catalog layout
- Skeleton UI for header, filters, and product grid
- Smooth pulse animation
- Responsive layout matching actual page
- Improved perceived performance

### Verification Checklist
- [ ] `frontend/app/(storefront)/products/loading.tsx` file created
- [ ] Skeleton components imported and used
- [ ] Header skeleton implemented (breadcrumb, title, count)
- [ ] Filters sidebar skeleton implemented
- [ ] Product grid skeleton implemented (12+ cards)
- [ ] Pulse animation applied
- [ ] Responsive grid layout
- [ ] Matches actual page structure
- [ ] Shows during data loading

---

## Task 07: Create Products Error State

### Overview
Create the error.tsx file that displays when an error occurs during product data fetching or page rendering. This provides a user-friendly error message with options to retry or navigate back, improving the user experience when things go wrong.

### Dependencies
- Task 02: Create All Products Page Route

### Instructions

1. **Create error.tsx file**
   - Navigate to `frontend/app/(storefront)/products/` directory
   - Create new file named `error.tsx`
   - Add `'use client'` directive (required for error boundaries)
   - This file catches errors in products routes

2. **Define error component props**
   - Accept `error` prop (Error object)
   - Accept `reset` prop (function to retry)
   - TypeScript interface for prop types

3. **Design error layout structure**
   - Center content vertically and horizontally
   - Include error icon or illustration
   - Display error message
   - Provide action buttons (retry, home)

4. **Create error message display**
   - Main heading: "Failed to Load Products"
   - Subheading: User-friendly error explanation
   - Optional: Technical error details (dev mode)
   - Keep messaging clear and helpful

5. **Add error icon/illustration**
   - Use icon library (Lucide, Heroicons)
   - Show AlertTriangle or similar icon
   - Size appropriately (large, prominent)
   - Apply error color (red-500)

6. **Implement retry button**
   - Button to call `reset()` function
   - Label: "Try Again" or "Retry"
   - Primary button styling
   - Triggers component re-render

7. **Add navigation options**
   - Button to navigate back home
   - Link to support/help page
   - Option to view all categories
   - Provide users with alternatives

8. **Log errors for debugging**
   - Use console.error in development
   - Send to error tracking service (production)
   - Include error stack trace
   - Capture user context

### Error Component Props

| Prop | Type | Description |
|------|------|-------------|
| error | Error | Error object with message and stack |
| reset | () => void | Function to retry/re-render |

### Error State Layout

```
┌────────────────────────────────────────┐
│                                        │
│              ⚠️                        │
│                                        │
│      Failed to Load Products           │
│                                        │
│   We couldn't load the product         │
│   catalog. Please try again.           │
│                                        │
│   ┌──────────┐  ┌──────────┐         │
│   │ Try Again│  │   Home   │         │
│   └──────────┘  └──────────┘         │
│                                        │
└────────────────────────────────────────┘
```

### Error Messages

| Error Type | User Message | Technical Action |
|------------|-------------|------------------|
| Network Error | "Connection problem. Please check your internet." | Retry fetch |
| API Error | "Failed to load products. Please try again." | Log error, retry |
| 404 Not Found | "Products not found." | Navigate home |
| Server Error | "Something went wrong. We're working on it." | Log error, alert team |

### Error Component Structure

| Section | Content | Styling |
|---------|---------|---------|
| Container | Full-height centered | `min-h-screen flex items-center` |
| Icon | Error icon | `text-red-500 w-16 h-16` |
| Heading | Error title | `text-2xl font-bold text-gray-900` |
| Message | Error description | `text-gray-600 text-center` |
| Actions | Buttons | `flex gap-4 mt-6` |

### Button Actions

| Button | Action | Styling |
|--------|--------|---------|
| Try Again | Call `reset()` | Primary button (blue) |
| Go Home | Navigate to `/` | Secondary button (gray) |
| View Categories | Navigate to categories | Link button |

### Error Logging Strategy

```
Error Occurs
    ↓
Log to Console (development)
    ↓
Send to Error Service (production)
    │
    ├─→ Include: error.message
    ├─→ Include: error.stack
    ├─→ Include: User context
    └─→ Include: Page URL
```

### Development vs Production

| Feature | Development | Production |
|---------|------------|------------|
| Stack Trace | Show on screen | Hide from user |
| Console Log | Detailed logging | Minimal logging |
| Error Service | Optional | Required (Sentry, etc.) |
| Error Details | Full details | User-friendly message |

### Expected Outcome
- Functional error boundary for products routes
- User-friendly error message
- Retry and navigation options
- Error logging for debugging
- Graceful error handling

### Verification Checklist
- [ ] `frontend/app/(storefront)/products/error.tsx` file created
- [ ] 'use client' directive added at top
- [ ] Error and reset props configured
- [ ] Error icon displayed
- [ ] Clear error message shown
- [ ] Try Again button calls reset()
- [ ] Go Home button navigates to homepage
- [ ] Error logged appropriately
- [ ] Layout centered and styled properly
- [ ] Component exports properly

---

## Task 08: Create Catalog Page Component

### Overview
Create the main CatalogPage component that serves as the primary wrapper for all product catalog pages. This component orchestrates the layout of the catalog header, filters, product grid, and pagination. It's used by all products, category, and collection pages to maintain consistent structure.

### Dependencies
- Task 02: Create All Products Page Route

### Instructions

1. **Create catalog components directory**
   - Navigate to `frontend/components/` directory
   - Create `storefront/catalog/` directory structure
   - This houses all catalog-related components
   - Maintains organized component structure

2. **Create CatalogPage component file**
   - Create `CatalogPage.tsx` in `components/storefront/catalog/`
   - Set up TypeScript React functional component
   - This is the main orchestrator component

3. **Define component props interface**
   - Products array (product data to display)
   - Page metadata (title, description, type)
   - Breadcrumb data (navigation path)
   - Filter configuration (available filters)
   - Sort options (sorting methods)
   - Pagination data (current page, total)
   - View type (grid/list)

4. **Implement main component structure**
   - Create container div with proper spacing
   - Section for CatalogHeader (Task 09)
   - Section for main content with two columns
   - Left column: Filters sidebar (Task 14)
   - Right column: Product grid (Task 15)

5. **Configure responsive layout**
   - Mobile: Single column (filters collapse/modal)
   - Tablet: Two columns (narrow sidebar, main grid)
   - Desktop: Two columns (wider sidebar, main grid)
   - Use CSS Grid or Flexbox

6. **Add catalog header integration**
   - Render CatalogHeader component at top
   - Pass breadcrumb data
   - Pass page title (dynamic based on route)
   - Pass product count

7. **Add main content container**
   - Create two-column layout
   - Sidebar: Filter controls (desktop visible, mobile hidden)
   - Main: Product grid and pagination
   - Proper spacing and gaps

8. **Implement empty state handling**
   - Check if products array is empty
   - Display "No products found" message
   - Show suggested actions (clear filters, browse categories)
   - Include illustration or icon

9. **Add client-side interactivity markers**
   - Mark component as Server Component if possible
   - Use 'use client' only for interactive parts
   - Separate interactive controls into client components

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| products | Product[] | Yes | Array of products to display |
| title | string | Yes | Page title |
| description | string | No | Page description |
| breadcrumbs | Breadcrumb[] | Yes | Navigation breadcrumbs |
| totalCount | number | Yes | Total product count |
| filters | FilterConfig | No | Available filter options |
| sort | SortOption[] | No | Sort options |
| pagination | PaginationData | No | Pagination info |
| showSidebar | boolean | No | Show/hide sidebar |

### Component Layout Structure

```
┌───────────────────────────────────────────────┐
│  CatalogHeader                                │
│  - Breadcrumbs                                │
│  - Title                                      │
│  - Product Count                              │
├───────────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────────────────┐│
│ │             │  │                         ││
│ │  Sidebar    │  │   Product Grid          ││
│ │  Container  │  │   Container             ││
│ │             │  │   - Sort Controls       ││
│ │  - Filters  │  │   - Product Cards       ││
│ │  - Price    │  │   - Pagination          ││
│ │  - Rating   │  │                         ││
│ │             │  │                         ││
│ └─────────────┘  └─────────────────────────┘│
└───────────────────────────────────────────────┘
```

### Layout Grid Configuration

| Screen Size | Layout | Sidebar Width | Grid Columns |
|-------------|--------|---------------|--------------|
| Mobile (< 768px) | Single Column | Hidden/Modal | 1 |
| Tablet (768-1024px) | Two Column | 256px (w-64) | 2-3 |
| Desktop (> 1024px) | Two Column | 320px (w-80) | 3-4 |

### Responsive Layout Classes

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `max-w-7xl mx-auto px-4` | Page container |
| Grid Wrapper | `lg:grid lg:grid-cols-[320px_1fr] lg:gap-8` | Two-column layout |
| Sidebar | `hidden lg:block` | Desktop only |
| Main | `w-full` | Full width mobile, grid column desktop |

### Empty State Structure

```
┌────────────────────────────────────────┐
│                                        │
│              🔍                        │
│                                        │
│        No Products Found               │
│                                        │
│   Try adjusting your filters or        │
│   browse our categories.               │
│                                        │
│   ┌──────────────┐                    │
│   │ Clear Filters│                    │
│   └──────────────┘                    │
│                                        │
└────────────────────────────────────────┘
```

### Data Flow

```
Parent Page Component
    ↓
Fetch Products Data
    ↓
Pass to CatalogPage Component
    ↓
├──→ CatalogHeader (breadcrumbs, title, count)
├──→ SidebarContainer (filters)
└──→ GridContainer (products, pagination)
```

### Server vs Client Components

| Component | Type | Reason |
|-----------|------|---------|
| CatalogPage | Server | No interactivity needed |
| CatalogHeader | Server | Static content |
| Filters (interactive) | Client | User interaction |
| Sort Dropdown | Client | User interaction |
| Product Grid (shell) | Server | Static structure |
| Pagination | Server | Link-based navigation |

### Expected Outcome
- Reusable CatalogPage component for all catalog pages
- Two-column responsive layout (sidebar + grid)
- Integration points for header, filters, and grid
- Empty state handling
- Proper TypeScript interfaces
- Clean component structure

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/CatalogPage.tsx` created
- [ ] Component props interface defined
- [ ] Main container with proper styling
- [ ] CatalogHeader integration point
- [ ] Two-column layout implemented (responsive)
- [ ] Sidebar container placeholder
- [ ] Grid container placeholder
- [ ] Empty state handling
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Summary

This document established the foundational route structure and core components for the product catalog, including the products directory setup, route creation for all products/categories/collections, layout component with proper wrapping, loading and error states for better UX, and the main CatalogPage component wrapper.

### Completed Tasks
1. ✓ Created products directory for catalog routes
2. ✓ Created all products page route with server-side rendering
3. ✓ Created category dynamic page route with slug handling
4. ✓ Created collection dynamic page route with slug handling
5. ✓ Created products layout for consistent wrapping
6. ✓ Created products loading state with skeleton UI
7. ✓ Created products error state with retry functionality
8. ✓ Created CatalogPage component as main wrapper

### Next Steps
Proceed to [02_Tasks-09-16_Header-Containers-Verify.md](02_Tasks-09-16_Header-Containers-Verify.md) to create the catalog header (with breadcrumbs, title, count), main content containers (sidebar and grid), and verify the complete route structure.

---
