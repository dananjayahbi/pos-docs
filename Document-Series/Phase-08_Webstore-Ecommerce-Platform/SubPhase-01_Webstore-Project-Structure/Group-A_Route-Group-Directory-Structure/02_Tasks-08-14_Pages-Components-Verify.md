# Tasks 08-14: Pages, Components, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** A - Route Group & Directory Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_Route-Group-Directories.md](01_Tasks-01-07_Route-Group-Directories.md)

---

## Document Overview

This document covers the creation of essential pages (search, loading, error, not-found), component directory structure, and verification of the complete storefront route architecture. It establishes the foundational UI patterns for the e-commerce platform and ensures all routes are properly configured.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 08 | Create Search Page Route | Low | 20 min |
| 09 | Create Store Loading State | Low | 25 min |
| 10 | Create Store Error Boundary | Low | 30 min |
| 11 | Create Store Not Found Page | Low | 25 min |
| 12 | Create Store Components Directory | Low | 10 min |
| 13 | Create Shared Components Directory | Low | 10 min |
| 14 | Verify Directory Structure | Low | 20 min |

---

## Task 08: Create Search Page Route

### Overview
Create a dedicated search page route for the storefront. This page will display search results for products, collections, and content. Unlike other feature directories (products, cart, etc.), the search functionality is implemented as a single page route rather than a directory with multiple sub-pages.

### Dependencies
- Task 01: Create Storefront Route Group
- Phase-07 Frontend Infrastructure complete

### Instructions

1. **Create search directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `search`
   - This directory will contain only a page component

2. **Create page.tsx file**
   - Inside `frontend/app/(storefront)/search/` directory
   - Create new file named `page.tsx`
   - This will be accessible at `/search` URL

3. **Define page metadata**
   - Export metadata object with title
   - Set title to "Search | LankaCommerce Cloud"
   - Add description for SEO optimization
   - Include keywords relevant to product search

4. **Create SearchParams type interface**
   - Define TypeScript interface for URL search parameters
   - Include `q` parameter for search query string
   - Include `category` parameter for category filtering (optional)
   - Include `sort` parameter for sorting options (optional)
   - Include `page` parameter for pagination (optional)

5. **Create page component structure**
   - Define async server component function
   - Accept searchParams prop from Next.js
   - Extract query parameters for search logic

6. **Plan component sections**
   - Search input and filters section (to be implemented later)
   - Search results grid (to be implemented later)
   - Pagination controls (to be implemented later)
   - Empty state when no results found

7. **Add placeholder content**
   - Create temporary heading with "Search Results"
   - Add paragraph indicating implementation in later SubPhases
   - Display current search query from URL parameters
   - Include breadcrumb navigation back to homepage

### Search Page URL Structure

```
Base URL: /search

Query Parameters:
/search?q=laptop                     → Search for "laptop"
/search?q=laptop&category=electronics → Filter by category
/search?q=laptop&sort=price_asc      → Sort by price
/search?q=laptop&page=2              → Pagination
```

### Search Parameter Options

| Parameter | Type | Description | Example Values |
|-----------|------|-------------|----------------|
| q | string | Search query | "laptop", "office chair" |
| category | string | Category filter | "electronics", "furniture" |
| sort | string | Sort option | "price_asc", "price_desc", "name" |
| page | number | Page number | 1, 2, 3 |
| min_price | number | Minimum price | 1000, 5000 |
| max_price | number | Maximum price | 50000, 100000 |

### Directory Structure
```
frontend/app/(storefront)/
├── search/
│   └── page.tsx         # Search results page
├── products/
├── cart/
└── checkout/
```

### URL Routing Example

| File Path | URL Path | Purpose |
|-----------|----------|---------|
| `app/(storefront)/search/page.tsx` | `/search` | Search results page |
| `app/(storefront)/page.tsx` | `/` | Store homepage |
| `app/(storefront)/products/page.tsx` | `/products` | Products listing |

### Expected Outcome
- Search page route created and accessible at `/search`
- Page component properly typed with SearchParams interface
- Metadata configured for SEO
- Placeholder content ready for future implementation
- URL parameter handling structure in place

### Verification Checklist
- [ ] `frontend/app/(storefront)/search/` directory created
- [ ] `frontend/app/(storefront)/search/page.tsx` file created
- [ ] Page component is async server component
- [ ] SearchParams interface defined
- [ ] Metadata exported with proper title
- [ ] Placeholder content renders correctly
- [ ] URL accessible at `/search` route

---

## Task 09: Create Store Loading State

### Overview
Create a loading state component for the storefront route group using Next.js App Router's loading.tsx convention. This file displays a loading skeleton while pages within the (storefront) route group are being loaded, providing immediate feedback to users and improving perceived performance.

### Dependencies
- Task 02: Create Store Root Layout
- Understanding of Next.js Suspense boundaries

### Instructions

1. **Create loading.tsx file**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new file named `loading.tsx`
   - This file is automatically used by Next.js during page transitions

2. **Understand loading.tsx behavior**
   - Automatically wraps pages in Suspense boundary
   - Shows during navigation between routes
   - Displays while server components are loading
   - Replaced by actual page content when ready

3. **Design loading skeleton structure**
   - Create skeleton for common storefront elements
   - Include navigation skeleton
   - Include hero section skeleton
   - Include product grid skeleton
   - Use consistent spacing with actual pages

4. **Implement loading component**
   - Export default function named `StorefrontLoading`
   - Return JSX with skeleton structure
   - Use Tailwind CSS for styling
   - Apply animation classes for smooth transitions

5. **Add skeleton components**
   - Create header skeleton (logo, navigation, cart icon)
   - Create hero banner skeleton (large rectangle with gradient)
   - Create product card skeletons (grid of 4-8 cards)
   - Add shimmer animation effect

6. **Apply accessibility attributes**
   - Add `role="status"` to container
   - Include `aria-label="Loading store content"`
   - Add `aria-busy="true"` to indicate loading state

7. **Optimize loading experience**
   - Keep skeleton simple and fast to render
   - Match skeleton layout to actual page structure
   - Use neutral colors (gray tones)
   - Add subtle pulse or shimmer animation

### Loading UI Pattern

```
┌────────────────────────────────────────┐
│  [████]  [████] [████] [████]    [🛒] │ ← Header Skeleton
├────────────────────────────────────────┤
│                                        │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       │ ← Hero Banner
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       │    Skeleton
│                                        │
├────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ ▓▓▓▓ │  │ ▓▓▓▓ │  │ ▓▓▓▓ │        │ ← Product Card
│  │ ████ │  │ ████ │  │ ████ │        │    Skeletons
│  │ ──── │  │ ──── │  │ ──── │        │
│  └──────┘  └──────┘  └──────┘        │
│                                        │
│  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ ▓▓▓▓ │  │ ▓▓▓▓ │  │ ▓▓▓▓ │        │
│  │ ████ │  │ ████ │  │ ████ │        │
│  │ ──── │  │ ──── │  │ ──── │        │
│  └──────┘  └──────┘  └──────┘        │
└────────────────────────────────────────┘
```

### Loading State Components

| Section | Skeleton Type | Purpose |
|---------|---------------|---------|
| Header | Navigation bars | Show header structure |
| Hero | Large rectangle | Show banner area |
| Products | Card grid | Show product layout |
| Sidebar | Narrow rectangles | Show filters layout |

### Loading.tsx Behavior

| Event | Behavior | User Experience |
|-------|----------|-----------------|
| Route Change | Shows immediately | Instant feedback |
| Data Fetching | Visible until complete | No blank screens |
| Navigation | Smooth transition | Professional feel |
| Error | Replaced by error.tsx | Proper error handling |

### Skeleton Animation

| Animation | CSS Classes | Effect |
|-----------|-------------|--------|
| Pulse | animate-pulse | Breathing effect |
| Shimmer | Custom gradient | Sliding shine |
| Fade | opacity-50 | Subtle indication |

### Expected Outcome
- Functional loading component for storefront
- Skeleton layout matching common page structure
- Smooth animations for better UX
- Proper accessibility attributes
- Automatic integration with Next.js routing

### Verification Checklist
- [ ] `frontend/app/(storefront)/loading.tsx` file created
- [ ] StorefrontLoading component exported
- [ ] Skeleton structure includes header, hero, products
- [ ] Animation classes applied (pulse or shimmer)
- [ ] Accessibility attributes added (role, aria-label)
- [ ] Loading state displays during navigation
- [ ] Layout matches actual page structure

---

## Task 10: Create Store Error Boundary

### Overview
Create an error boundary component for the storefront route group using Next.js App Router's error.tsx convention. This component catches and handles errors that occur within the (storefront) route group, providing a user-friendly error message and recovery options.

### Dependencies
- Task 02: Create Store Root Layout
- Understanding of Next.js error handling patterns

### Instructions

1. **Create error.tsx file**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new file named `error.tsx`
   - Must be a client component (use 'use client' directive)

2. **Understand error.tsx requirements**
   - Must be a client component
   - Receives error and reset props from Next.js
   - Catches errors in nested pages and components
   - Does not catch errors in layout.tsx (use global error.tsx)

3. **Define component props interface**
   - Create ErrorBoundaryProps interface
   - Include `error` prop of type Error & { digest?: string }
   - Include `reset` prop of type () => void
   - Document prop purposes with comments

4. **Create error component structure**
   - Export default function named `StorefrontError`
   - Accept error and reset props
   - Use 'use client' directive at file top
   - Return user-friendly error UI

5. **Design error UI layout**
   - Container with centered content
   - Error icon or illustration (AlertCircle, AlertTriangle)
   - Error heading ("Something went wrong")
   - Friendly error message
   - Error details (in development mode only)
   - Action buttons (Try Again, Go Home)

6. **Implement retry functionality**
   - Use reset() function for "Try Again" button
   - Resets error boundary and re-renders
   - Provide navigation to homepage as alternative
   - Log error to console (or error tracking service)

7. **Add error logging**
   - Use useEffect to log error on mount
   - Include error message and stack trace
   - Prepare for future integration with error tracking
   - Only log once to avoid duplicates

8. **Style error component**
   - Use brand colors for consistency
   - Apply responsive design
   - Add subtle animations (fade-in)
   - Ensure buttons are clearly visible
   - Match storefront design language

9. **Handle different error types**
   - Network errors (API failures)
   - Data fetching errors
   - Rendering errors
   - Unknown errors (catch-all)

### Error Boundary Pattern

```
┌────────────────────────────────────────┐
│                                        │
│              ⚠️                        │
│                                        │
│      Something went wrong              │
│                                        │
│  We encountered an error while loading│
│  this page. Please try again.          │
│                                        │
│  [Development Only]                    │
│  Error: Failed to fetch products       │
│  at fetchProducts (store/api.ts:45)    │
│                                        │
│  ┌──────────────┐  ┌──────────────┐  │
│  │  Try Again   │  │   Go Home    │  │
│  └──────────────┘  └──────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

### Error Component Props

| Prop | Type | Description |
|------|------|-------------|
| error | Error & { digest?: string } | Error object with message and stack |
| reset | () => void | Function to reset error boundary |

### Error Recovery Options

| Action | Method | Use Case |
|--------|--------|----------|
| Try Again | reset() | Retry the operation |
| Go Home | navigate('/') | Return to safe page |
| Contact Support | Email/chat link | Persistent errors |
| Refresh Page | window.location.reload() | Full page reload |

### Error Types and Messages

| Error Type | User Message | Technical Action |
|------------|--------------|------------------|
| Network Error | "Connection issue. Please check your internet." | Log error, show retry |
| API Error | "Unable to load products. Please try again." | Log error, show retry |
| Not Found | "The page you're looking for doesn't exist." | Show 404 page |
| Server Error | "Our servers are having issues. Please try later." | Log error, notify team |
| Unknown | "Something unexpected happened. Please try again." | Log error, show retry |

### Error Boundary Scope

| File | Catches Errors In | Does Not Catch |
|------|-------------------|----------------|
| (storefront)/error.tsx | All nested pages and components | layout.tsx errors |
| (storefront)/products/error.tsx | Products section only | Parent route errors |
| app/error.tsx | Root-level errors | Root layout errors |
| app/global-error.tsx | All errors including layouts | None |

### Expected Outcome
- Functional error boundary for storefront
- User-friendly error messages
- Retry and navigation options
- Error logging capability
- Responsive and branded design
- Client component with proper typing

### Verification Checklist
- [ ] `frontend/app/(storefront)/error.tsx` file created
- [ ] 'use client' directive at top of file
- [ ] StorefrontError component exported
- [ ] Props interface defined (error, reset)
- [ ] User-friendly error message displayed
- [ ] "Try Again" button triggers reset()
- [ ] "Go Home" navigation implemented
- [ ] Error logged to console
- [ ] Responsive design applied
- [ ] Error boundary catches errors in nested routes

---

## Task 11: Create Store Not Found Page

### Overview
Create a custom 404 Not Found page for the storefront route group using Next.js App Router's not-found.tsx convention. This page displays when a user navigates to a non-existent route within the storefront, providing helpful navigation options and maintaining brand consistency.

### Dependencies
- Task 02: Create Store Root Layout
- Understanding of Next.js not-found handling

### Instructions

1. **Create not-found.tsx file**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new file named `not-found.tsx`
   - This file handles 404 errors within the route group

2. **Understand not-found.tsx behavior**
   - Triggered when notFound() function is called
   - Automatically shown for non-existent routes
   - Can be nested at different route levels
   - Does not require 'use client' directive

3. **Create component structure**
   - Export default function named `StorefrontNotFound`
   - Return JSX with 404 content
   - No props needed (unlike error.tsx)

4. **Design 404 page layout**
   - Container with centered content
   - Large "404" or illustration
   - Clear heading ("Page Not Found")
   - Friendly explanation message
   - List of helpful navigation suggestions
   - Primary action button (back to homepage)
   - Secondary actions (browse products, search)

5. **Add helpful navigation options**
   - Link to homepage (primary CTA)
   - Link to products page
   - Link to collections or categories
   - Search bar for finding products
   - Recently viewed products (if available)
   - Popular products or categories

6. **Implement metadata**
   - Export metadata object
   - Set title to "Page Not Found | LankaCommerce Cloud"
   - Set robots to "noindex, nofollow"
   - Prevent 404 pages from being indexed

7. **Style not-found component**
   - Use brand colors and typography
   - Apply responsive design for all devices
   - Add illustrations or icons (404, compass, map)
   - Use subtle animations (fade-in, float)
   - Maintain consistency with storefront design

8. **Add breadcrumb context**
   - Show breadcrumb trail
   - Display current (broken) URL
   - Help users understand their location
   - Provide clear path back to valid pages

9. **Consider SEO implications**
   - Return proper 404 status code
   - Provide alternative navigation
   - Don't redirect automatically (harms SEO)
   - Include sitemap link

### Not Found Page Layout

```
┌────────────────────────────────────────┐
│                                        │
│              404                       │
│           🔍🗺️🧭                      │
│                                        │
│        Page Not Found                  │
│                                        │
│  The page you're looking for doesn't  │
│  exist or has been moved.              │
│                                        │
│  You might be interested in:           │
│  • Browse our products                 │
│  • View popular categories             │
│  • Search for what you need            │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │   Return to Homepage             │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [View All Products]  [Contact Us]    │
│                                        │
└────────────────────────────────────────┘
```

### Not Found vs Error Differences

| Aspect | not-found.tsx | error.tsx |
|--------|---------------|-----------|
| Trigger | Non-existent route | Runtime error |
| Status Code | 404 | 500 |
| Component Type | Server or Client | Client only |
| Props | None | error, reset |
| Recovery | Navigation only | Can retry |

### Navigation Suggestions

| Link | URL | Priority | Purpose |
|------|-----|----------|---------|
| Homepage | / | Primary | Safe starting point |
| Products | /products | Primary | Browse catalog |
| Search | /search | Secondary | Find specific items |
| Categories | /products?category=... | Secondary | Browse by category |
| Contact | /contact | Tertiary | Get help |

### User Experience Considerations

| Element | Purpose | Best Practice |
|---------|---------|---------------|
| Friendly Message | Reduce frustration | Avoid technical jargon |
| Clear Navigation | Help user recover | Provide multiple options |
| Brand Consistency | Maintain trust | Use storefront theme |
| No Auto-Redirect | Respect user intent | Let user choose path |
| Search Option | Enable discovery | Allow finding products |

### SEO Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| HTTP Status | 404 | Proper error code |
| robots | noindex, nofollow | Prevent indexing |
| canonical | None | No canonical for 404s |
| sitemap | Excluded | Don't include in sitemap |

### Expected Outcome
- Custom 404 page for storefront
- Clear and friendly error message
- Multiple navigation options
- Consistent branding and design
- Proper SEO configuration
- Helpful user recovery path

### Verification Checklist
- [ ] `frontend/app/(storefront)/not-found.tsx` file created
- [ ] StorefrontNotFound component exported
- [ ] Metadata configured with noindex
- [ ] "404" or illustration displayed
- [ ] Friendly heading and message
- [ ] Primary CTA to homepage
- [ ] Secondary navigation options (products, search)
- [ ] Responsive design applied
- [ ] Accessible at non-existent routes (e.g., /abc123xyz)
- [ ] Proper 404 status code returned

---

## Task 12: Create Store Components Directory

### Overview
Create a dedicated components directory for storefront-specific components. This directory will house all React components that are unique to the e-commerce storefront, separate from dashboard components and shared components.

### Dependencies
- Task 01: Create Storefront Route Group
- Phase-07 component organization patterns

### Instructions

1. **Create storefront components directory**
   - Navigate to `frontend/components/` directory
   - Create new directory named `storefront`
   - This directory is separate from dashboard components

2. **Understand component organization**
   - Storefront components are customer-facing
   - Used exclusively in (storefront) route group
   - Include product displays, cart UI, checkout forms
   - Separate from admin/dashboard components

3. **Plan subdirectory structure**
   - Create logical groupings for component types
   - Organize by feature or functionality
   - Keep related components together
   - Maintain shallow directory hierarchy

4. **Create initial subdirectories**
   - Create `products/` subdirectory for product components
   - Create `cart/` subdirectory for shopping cart components
   - Create `checkout/` subdirectory for checkout components
   - Create `common/` subdirectory for storefront-wide components
   - Create `navigation/` subdirectory for storefront navigation

5. **Add README.md file**
   - Create README.md in storefront directory
   - Document purpose of directory
   - List planned component categories
   - Provide naming conventions
   - Include import path examples

6. **Define naming conventions**
   - Use PascalCase for component files
   - Prefix with feature when appropriate (ProductCard, CartItem)
   - Use descriptive names (not generic)
   - Keep names concise but clear

7. **Plan component categories**
   - Product components (cards, details, gallery)
   - Cart components (items, summary, actions)
   - Checkout components (forms, payment, confirmation)
   - Navigation components (header, menu, breadcrumb)
   - Common components (buttons, badges, ratings)

### Component Directory Structure

```
frontend/components/
├── storefront/              # Storefront-specific components
│   ├── README.md           # Directory documentation
│   ├── products/           # Product-related components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductDetails.tsx
│   ├── cart/               # Cart components
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx
│   ├── checkout/           # Checkout components
│   │   ├── CheckoutForm.tsx
│   │   ├── PaymentMethod.tsx
│   │   └── OrderSummary.tsx
│   ├── navigation/         # Navigation components
│   │   ├── StorefrontHeader.tsx
│   │   ├── MobileMenu.tsx
│   │   └── CategoryMenu.tsx
│   └── common/             # Common storefront components
│       ├── Rating.tsx
│       ├── PriceDisplay.tsx
│       └── StockBadge.tsx
├── shared/                 # (Created in Task 13)
└── dashboard/              # (From Phase-07)
```

### Component Organization Strategy

| Directory | Purpose | Example Components |
|-----------|---------|-------------------|
| products/ | Product display | ProductCard, ProductGrid, Gallery |
| cart/ | Shopping cart | CartItem, CartSummary, CartDrawer |
| checkout/ | Checkout process | CheckoutForm, PaymentMethod |
| navigation/ | Store navigation | Header, Menu, Breadcrumb |
| common/ | Storefront-wide | Rating, Price, Badge, Button |

### Component vs Route Organization

| Type | Location | Purpose |
|------|----------|---------|
| Page Component | app/(storefront)/ | Route pages |
| Reusable Component | components/storefront/ | Shared UI elements |
| Layout Component | app/(storefront)/layout.tsx | Route layouts |
| Server Component | Can be either | Data fetching |
| Client Component | Usually components/ | Interactive UI |

### Import Path Examples

```
From page to storefront component:
import { ProductCard } from '@/components/storefront/products/ProductCard'
import { CartDrawer } from '@/components/storefront/cart/CartDrawer'

From storefront to shared component:
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/forms/Input'

From storefront to dashboard (avoid):
❌ import { AdminButton } from '@/components/dashboard/...'
   (Storefront should not import dashboard components)
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component File | PascalCase | ProductCard.tsx |
| Directory | kebab-case | product-reviews/ |
| Feature Prefix | Feature + Name | ProductCard, CartItem |
| Avoid Generic | Be specific | Use ProductCard not Card |

### Expected Outcome
- Storefront components directory created
- Logical subdirectory structure established
- README.md documentation present
- Clear organization patterns defined
- Ready for component implementation

### Verification Checklist
- [ ] `frontend/components/storefront/` directory created
- [ ] Subdirectories created (products, cart, checkout, navigation, common)
- [ ] README.md file added with documentation
- [ ] Naming conventions documented
- [ ] Import path patterns established
- [ ] Directory structure matches planned organization

---

## Task 13: Create Shared Components Directory

### Overview
Create a shared components directory for components used across both the storefront and dashboard. This directory houses truly universal UI elements like buttons, inputs, modals, and utilities that have no feature-specific logic.

### Dependencies
- Task 12: Create Store Components Directory
- Phase-07 shared component patterns

### Instructions

1. **Create shared components directory**
   - Navigate to `frontend/components/` directory
   - Create new directory named `shared`
   - This directory is for cross-application components

2. **Understand shared component criteria**
   - Used in both storefront and dashboard
   - No feature-specific business logic
   - Pure UI components (presentational)
   - Highly reusable and generic
   - Examples: Button, Input, Modal, Badge

3. **Create core subdirectories**
   - Create `ui/` subdirectory for basic UI elements
   - Create `forms/` subdirectory for form components
   - Create `layout/` subdirectory for layout components
   - Create `feedback/` subdirectory for alerts, toasts
   - Create `data-display/` subdirectory for tables, lists

4. **Plan component categories**
   - UI elements: Button, Badge, Card, Avatar
   - Form components: Input, Select, Checkbox, Radio
   - Layout components: Container, Grid, Stack, Divider
   - Feedback: Alert, Toast, Spinner, Progress
   - Data display: Table, List, Pagination

5. **Add README.md documentation**
   - Create README.md in shared directory
   - Document purpose and usage criteria
   - List component categories
   - Provide decision tree for component placement
   - Include import examples

6. **Define component design principles**
   - Components should be headless or minimally styled
   - Accept className prop for custom styling
   - Use composition over configuration
   - Follow accessibility best practices
   - Support both light and dark modes

7. **Create placeholder files (optional)**
   - Add index.ts files for organized exports
   - Create placeholder components if needed
   - Set up barrel exports for clean imports

8. **Document decision criteria**
   - When to use shared vs feature components
   - How to migrate components between directories
   - Guidelines for component abstraction
   - Examples of appropriate shared components

### Shared Components Directory Structure

```
frontend/components/
├── shared/                  # Cross-application components
│   ├── README.md           # Documentation
│   ├── ui/                 # Basic UI elements
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   └── index.ts
│   ├── forms/              # Form components
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   ├── Textarea.tsx
│   │   └── index.ts
│   ├── layout/             # Layout components
│   │   ├── Container.tsx
│   │   ├── Grid.tsx
│   │   ├── Stack.tsx
│   │   ├── Divider.tsx
│   │   └── index.ts
│   ├── feedback/           # Feedback components
│   │   ├── Alert.tsx
│   │   ├── Toast.tsx
│   │   ├── Spinner.tsx
│   │   ├── Progress.tsx
│   │   └── index.ts
│   └── data-display/       # Data display components
│       ├── Table.tsx
│       ├── List.tsx
│       ├── Pagination.tsx
│       ├── EmptyState.tsx
│       └── index.ts
├── storefront/             # (From Task 12)
└── dashboard/              # (From Phase-07)
```

### Component Category Guidelines

| Category | Purpose | Example Components |
|----------|---------|-------------------|
| ui/ | Basic UI building blocks | Button, Badge, Card, Avatar |
| forms/ | Form inputs and controls | Input, Select, Checkbox, Radio |
| layout/ | Layout and spacing | Container, Grid, Stack, Divider |
| feedback/ | User feedback | Alert, Toast, Spinner, Progress |
| data-display/ | Data presentation | Table, List, Pagination |

### Shared vs Feature Components Decision Tree

```
Is this component used in both storefront and dashboard?
│
├─ YES ──> Does it contain feature-specific logic?
│          │
│          ├─ NO ──> ✅ Shared Component
│          │         (components/shared/)
│          │
│          └─ YES ──> ❌ Extract generic part to shared,
│                       keep feature logic in feature component
│
└─ NO ──> Is it only used in storefront?
          │
          ├─ YES ──> ✅ Storefront Component
          │          (components/storefront/)
          │
          └─ NO ──> ✅ Dashboard Component
                     (components/dashboard/)
```

### Component Design Principles

| Principle | Description | Example |
|-----------|-------------|---------|
| Headless | No styling or minimal base styles | Composable primitives |
| Composable | Can be combined with other components | Button accepts children |
| Accessible | ARIA attributes, keyboard navigation | Proper semantic HTML |
| Themeable | Supports light/dark modes | CSS variables |
| Flexible | Accepts className for customization | Tailwind-compatible |

### Import Path Examples

```
From storefront component:
import { Button } from '@/components/shared/ui/Button'
import { Input } from '@/components/shared/forms/Input'
import { Alert } from '@/components/shared/feedback/Alert'

From dashboard component:
import { Button } from '@/components/shared/ui/Button'
import { Table } from '@/components/shared/data-display/Table'

Using barrel exports:
import { Button, Badge, Card } from '@/components/shared/ui'
import { Input, Select, Checkbox } from '@/components/shared/forms'
```

### Component Abstraction Guidelines

| Scenario | Action | Example |
|----------|--------|---------|
| Component used in 2+ features | Extract to shared | Button, Input |
| Component has feature logic | Keep in feature directory | ProductCard, OrderForm |
| Generic UI element | Start in shared | Badge, Spinner |
| Feature-specific styling | Keep in feature directory | DashboardHeader |
| Common pattern emerging | Consider shared component | Modal, Drawer |

### Barrel Export Pattern

```
File: components/shared/ui/index.ts

Purpose: Simplify imports from category

Example:
export { Button } from './Button'
export { Badge } from './Badge'
export { Card } from './Card'
export { Avatar } from './Avatar'

Usage:
import { Button, Badge, Card } from '@/components/shared/ui'
```

### Expected Outcome
- Shared components directory created
- Logical subdirectory structure (ui, forms, layout, etc.)
- README.md with clear decision criteria
- Import patterns established
- Foundation for cross-application components

### Verification Checklist
- [ ] `frontend/components/shared/` directory created
- [ ] Subdirectories created (ui, forms, layout, feedback, data-display)
- [ ] README.md file added with documentation
- [ ] Decision tree for component placement documented
- [ ] Import patterns and barrel exports planned
- [ ] Component design principles defined
- [ ] Directory ready for component implementation

---

## Task 14: Verify Directory Structure

### Overview
Perform comprehensive verification of the complete storefront directory structure. This task ensures all directories, files, and routes are properly created and accessible. It includes manual testing, automated checks, and documentation of the final structure.

### Dependencies
- All previous tasks (01-13) completed

### Instructions

1. **Verify route group structure**
   - Confirm (storefront) route group exists
   - Check layout.tsx is present
   - Verify page.tsx for homepage exists
   - Check parentheses naming is correct

2. **Verify page directories**
   - Confirm products/ directory exists
   - Confirm cart/ directory exists
   - Confirm checkout/ directory exists
   - Confirm account/ directory exists
   - Confirm search/ directory with page.tsx exists

3. **Verify essential page files**
   - Check loading.tsx exists in (storefront)
   - Check error.tsx exists in (storefront)
   - Check not-found.tsx exists in (storefront)
   - Verify all files have proper extensions (.tsx)

4. **Verify component directories**
   - Check components/storefront/ exists
   - Verify storefront subdirectories (products, cart, checkout, navigation, common)
   - Check components/shared/ exists
   - Verify shared subdirectories (ui, forms, layout, feedback, data-display)
   - Confirm README.md files are present

5. **Test route accessibility**
   - Start development server
   - Navigate to / (homepage)
   - Navigate to /products
   - Navigate to /cart
   - Navigate to /checkout
   - Navigate to /account
   - Navigate to /search
   - Test non-existent route (e.g., /xyz123) for 404 page

6. **Test loading and error states**
   - Trigger loading state by navigating between routes
   - Simulate error to test error boundary (optional)
   - Verify loading skeleton appears
   - Verify error page displays properly

7. **Document final structure**
   - Create visual tree of directory structure
   - List all created files with paths
   - Document any deviations from plan
   - Note any optional implementations

8. **Create verification checklist**
   - List all expected files and directories
   - Mark completed items
   - Identify any missing components
   - Plan remediation for gaps

9. **Run automated checks (optional)**
   - Use file system scripts to verify structure
   - Check for naming conventions compliance
   - Verify file extensions are correct
   - Validate TypeScript compilation

10. **Update documentation**
    - Update SubPhase task summary
    - Mark Group A as complete
    - Document any issues encountered
    - Prepare for Group B (Store Layout Foundation)

### Complete Directory Structure

```
frontend/
├── app/
│   └── (storefront)/                    # Route group for storefront
│       ├── layout.tsx                   # Store root layout
│       ├── page.tsx                     # Store homepage
│       ├── loading.tsx                  # Loading state
│       ├── error.tsx                    # Error boundary
│       ├── not-found.tsx                # 404 page
│       ├── products/                    # Products directory
│       ├── cart/                        # Cart directory
│       ├── checkout/                    # Checkout directory
│       ├── account/                     # Account directory
│       └── search/                      # Search directory
│           └── page.tsx                 # Search page
│
├── components/
│   ├── storefront/                      # Storefront components
│   │   ├── README.md
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── navigation/
│   │   └── common/
│   │
│   └── shared/                          # Shared components
│       ├── README.md
│       ├── ui/
│       ├── forms/
│       ├── layout/
│       ├── feedback/
│       └── data-display/
```

### Verification Checklist

#### Route Group Files
- [ ] `frontend/app/(storefront)/` directory exists
- [ ] `frontend/app/(storefront)/layout.tsx` exists
- [ ] `frontend/app/(storefront)/page.tsx` exists
- [ ] `frontend/app/(storefront)/loading.tsx` exists
- [ ] `frontend/app/(storefront)/error.tsx` exists
- [ ] `frontend/app/(storefront)/not-found.tsx` exists

#### Page Directories
- [ ] `frontend/app/(storefront)/products/` directory exists
- [ ] `frontend/app/(storefront)/cart/` directory exists
- [ ] `frontend/app/(storefront)/checkout/` directory exists
- [ ] `frontend/app/(storefront)/account/` directory exists
- [ ] `frontend/app/(storefront)/search/` directory exists
- [ ] `frontend/app/(storefront)/search/page.tsx` exists

#### Component Directories
- [ ] `frontend/components/storefront/` directory exists
- [ ] `frontend/components/storefront/README.md` exists
- [ ] `frontend/components/storefront/products/` subdirectory exists
- [ ] `frontend/components/storefront/cart/` subdirectory exists
- [ ] `frontend/components/storefront/checkout/` subdirectory exists
- [ ] `frontend/components/storefront/navigation/` subdirectory exists
- [ ] `frontend/components/storefront/common/` subdirectory exists

#### Shared Component Directories
- [ ] `frontend/components/shared/` directory exists
- [ ] `frontend/components/shared/README.md` exists
- [ ] `frontend/components/shared/ui/` subdirectory exists
- [ ] `frontend/components/shared/forms/` subdirectory exists
- [ ] `frontend/components/shared/layout/` subdirectory exists
- [ ] `frontend/components/shared/feedback/` subdirectory exists
- [ ] `frontend/components/shared/data-display/` subdirectory exists

#### Route Accessibility
- [ ] `/` route accessible (homepage)
- [ ] `/products` route accessible
- [ ] `/cart` route accessible
- [ ] `/checkout` route accessible
- [ ] `/account` route accessible
- [ ] `/search` route accessible
- [ ] Non-existent route shows 404 page
- [ ] Loading state displays during navigation
- [ ] Error boundary catches and displays errors

### Testing Commands

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Open browser to test routes
# http://localhost:3000/
# http://localhost:3000/products
# http://localhost:3000/cart
# http://localhost:3000/checkout
# http://localhost:3000/account
# http://localhost:3000/search
# http://localhost:3000/invalid-route-for-404
```

### File Count Summary

| Category | Count | Examples |
|----------|-------|----------|
| Route Pages | 2 | layout.tsx, page.tsx (homepage) |
| Special Pages | 3 | loading.tsx, error.tsx, not-found.tsx |
| Page Routes | 1 | search/page.tsx |
| Page Directories | 4 | products/, cart/, checkout/, account/ |
| Component Categories | 10 | 5 storefront + 5 shared subdirectories |
| Documentation | 2 | README.md files |

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| 404 on all routes | Check route group parentheses naming |
| Loading state not showing | Verify loading.tsx placement |
| Error boundary not catching | Ensure error.tsx is client component |
| Components not found | Check import paths and aliases |
| TypeScript errors | Verify tsconfig.json paths configuration |

### Success Criteria

| Criterion | Expected Result |
|-----------|-----------------|
| Structure Complete | All directories and files created |
| Routes Accessible | All routes return 200 or render |
| Loading Works | Loading skeleton displays during navigation |
| Error Handling | Error boundary catches and displays errors |
| 404 Handling | Not-found page displays for invalid routes |
| Components Organized | Clear separation: storefront, shared |
| Documentation Present | README.md files explain structure |

### Expected Outcome
- Complete storefront directory structure verified
- All routes tested and accessible
- Loading and error states functioning
- Component directories properly organized
- Documentation complete and accurate
- Group A tasks fully completed and validated

### Verification Checklist Summary
- [ ] All 13 previous tasks completed
- [ ] Directory structure matches specification
- [ ] All required files present
- [ ] Routes accessible via development server
- [ ] Loading state displays correctly
- [ ] Error boundary functions properly
- [ ] 404 page displays for invalid routes
- [ ] Component directories organized
- [ ] Documentation files present
- [ ] No naming convention violations
- [ ] TypeScript compiles without errors
- [ ] Ready to proceed to Group B

---

## Group Completion Summary

Upon completing all tasks in this document:

### Created Structure
```
Frontend Additions:
- 1 Route Group: (storefront)
- 6 Route Files: layout, page, loading, error, not-found, search/page
- 4 Page Directories: products, cart, checkout, account
- 10 Component Subdirectories: 5 storefront + 5 shared
- 2 README Files: Documentation for components
```

### Next Steps
1. Proceed to Group B: Store Layout Foundation
2. Implement store header and navigation
3. Create footer component
4. Build category menu
5. Add search functionality

### Documentation Updates
- Mark Group A as complete in SubPhase-01 summary
- Update Phase-08 progress tracker
- Document any deviations or optional implementations
- Prepare for Group B kickoff

---

## Notes for AI Agents

### Key Architectural Decisions
- Storefront and dashboard are separate route groups
- Loading/error boundaries at route group level
- Component separation: storefront vs shared vs dashboard
- Search is single page, not directory with sub-routes

### Important Patterns
- Route groups use parentheses: (storefront)
- Special files: loading.tsx, error.tsx, not-found.tsx
- Error boundaries must be client components
- Loading states work with React Suspense

### Common Pitfalls
- Forgetting parentheses in route group name
- Not using 'use client' in error.tsx
- Incorrect import paths for components
- Missing TypeScript types for Next.js props

### Testing Approach
- Manual testing via browser for routes
- Check loading states during navigation
- Trigger errors to test error boundary
- Test 404 page with invalid URLs
- Verify component imports resolve correctly
