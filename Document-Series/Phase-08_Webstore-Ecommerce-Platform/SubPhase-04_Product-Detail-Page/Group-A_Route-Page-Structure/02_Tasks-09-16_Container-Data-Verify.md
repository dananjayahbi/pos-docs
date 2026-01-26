# Phase-08 SubPhase-04 Group-A: Product Detail Page - Container, Data & Verification

**Phase:** 08 - Webstore & E-Commerce Platform  
**SubPhase:** 04 - Product Detail Page  
**Group:** A - Route & Page Structure  
**Document:** 02 of 02  
**Tasks Covered:** 09-16  
**Complexity:** Low to Medium  
**Estimated Total:** 10-14 hours

---

## Navigation

**Parent:** [SubPhase-04 Product Detail Page](../00_GROUP_SUMMARY.md)  
**Previous:** [01_Tasks-01-08_Route-Layout-Meta.md](./01_Tasks-01-08_Route-Layout-Meta.md)  
**Next:** Group-B Product Media Gallery

---

## Document Overview

This document covers the implementation of the product page container, breadcrumb navigation, responsive layout structure, data fetching infrastructure, TypeScript types, API service integration, and comprehensive verification of the route and data flow.

### Tasks Covered in This Document

| Task # | Task Name | Complexity | Est. Time | Dependencies |
|--------|-----------|------------|-----------|--------------|
| 09 | Create Product Page Container | Medium | 2h | Tasks 02-03 |
| 10 | Create Product Breadcrumb | Low | 1.5h | Task 09 |
| 11 | Create Two-Column Layout | Low | 1.5h | Task 09 |
| 12 | Create Mobile Stack Layout | Low | 1.5h | Task 11 |
| 13 | Create Product Data Fetcher | Medium | 2h | Task 09 |
| 14 | Create Product Types | Low | 1.5h | Task 13 |
| 15 | Create Product API Service | Medium | 2h | Tasks 13-14 |
| 16 | Verify Route and Data Flow | Low | 2h | All previous |

### Group Goals

- Implement main product container with proper component structure
- Create responsive two-column and mobile stack layouts
- Build comprehensive data fetching infrastructure
- Define complete TypeScript types for product data
- Establish API service layer for product operations
- Verify complete route functionality and data flow

---

## Task 09: Create Product Page Container

### Overview

Create the main container component that orchestrates the product detail page layout, manages data flow, and renders child components. This container serves as the composition layer between the page route and individual product components.

### Dependencies

- **Prerequisites:**
  - Tasks 02-03 completed (page and layout)
  - Understanding of React Server Components
  - Component composition patterns

- **Related Tasks:**
  - Task 10 (Breadcrumb will be rendered here)
  - Task 11-12 (Layout structures)
  - Task 13 (Data fetching integration)

### Instructions

#### Step 1: Create Container Component File

1. Navigate to `app/products/[slug]/_components/` directory
2. Create file: `ProductDetailContainer.tsx`
3. This is a Server Component (no 'use client' directive)
4. Will receive product data as props from page.tsx

#### Step 2: Define Container Props Interface

Create interface for container props:
1. `product` object containing full product data
2. Optional: `userSession` for personalization
3. Optional: `relatedProducts` array
4. Type all props with Product interface (Task 14)

#### Step 3: Structure Container Layout

Plan the container structure with distinct regions:
1. **Breadcrumb Section**: Navigation context at top
2. **Main Content Area**: Two-column layout (desktop) or stack (mobile)
3. **Related Products Section**: Below main content
4. **Recently Viewed Section**: Optional, at bottom

#### Step 4: Implement Component Composition

The container should compose:
1. Breadcrumb component (Task 10)
2. Product media gallery (Group B)
3. Product information panel (Group C)
4. Product actions (Group D)
5. Product tabs (Group E)
6. Related products (Group F)

#### Step 5: Handle Responsive Layout

1. Use Tailwind CSS responsive utilities
2. Grid layout for desktop (two columns)
3. Flex stack for mobile (single column)
4. Pass layout context to child components via props or context

#### Step 6: Manage Component State (If Needed)

While Server Component, plan for:
1. Client component boundaries (interactive elements)
2. State management for quantity, variants, etc.
3. Props drilling vs. context usage decisions
4. Server Actions for form submissions

#### Step 7: Add Error Boundaries (Optional)

1. Wrap risky sections in error boundaries
2. Graceful degradation if sections fail
3. Log partial failures without breaking page

#### Step 8: Export Container

1. Export as named export (ProductDetailContainer)
2. Also add to `_components/index.ts` barrel export
3. Ensure proper TypeScript typing

### Container Responsibility Table

| Responsibility | Description | Implementation |
|----------------|-------------|----------------|
| Layout Orchestration | Position child components | Grid/flex layout |
| Data Distribution | Pass product data to children | Props drilling |
| Responsive Behavior | Adapt layout to screen size | Tailwind breakpoints |
| Component Composition | Render all product sections | Import & render children |
| Error Handling | Graceful degradation | Try-catch, error boundaries |
| Performance | Optimize rendering | Server Component benefits |

### Container Structure Diagram

```
ProductDetailContainer
│
├── Breadcrumb Section (Task 10)
│   └── ProductBreadcrumb
│
├── Main Content Section (Two-column Task 11 / Stack Task 12)
│   ├── Left Column (Media)
│   │   └── ProductMediaGallery (Group B)
│   │
│   └── Right Column (Info & Actions)
│       ├── ProductHeader (Group C)
│       ├── ProductPrice (Group C)
│       ├── ProductOptions (Group C)
│       └── ProductActions (Group D)
│
├── Product Details Section
│   └── ProductTabs (Group E)
│       ├── Description Tab
│       ├── Specifications Tab
│       └── Reviews Tab
│
└── Related Products Section (Group F)
    └── RelatedProductsCarousel
```

### Component Props Flow

```
page.tsx
    ├── Fetches: Product data
    └── Passes to: ProductDetailContainer
        │
        ProductDetailContainer
        ├── Receives: product data
        └── Distributes to Children:
            │
            ├── ProductBreadcrumb
            │   └── Gets: product.category, product.name
            │
            ├── ProductMediaGallery
            │   └── Gets: product.images
            │
            ├── ProductHeader
            │   └── Gets: product.name, product.brand, product.rating
            │
            ├── ProductPrice
            │   └── Gets: product.price, product.discount
            │
            ├── ProductOptions
            │   └── Gets: product.variants, product.options
            │
            ├── ProductActions
            │   └── Gets: product.id, product.stock
            │
            └── ProductTabs
                └── Gets: product.description, product.specs, product.reviews
```

### Responsive Layout Breakpoints

| Breakpoint | Layout | Columns | Spacing | Notes |
|------------|--------|---------|---------|-------|
| < 640px | Stack | 1 | p-4 | Mobile: vertical stack |
| 640-1024px | Stack | 1 | p-6 | Tablet: still stacked |
| 1024-1280px | Two-column | 2 (50/50) | gap-8 | Desktop: side-by-side |
| > 1280px | Two-column | 2 (60/40) | gap-12 | Wide: more space for media |

### Expected Outcome

- Functional container component orchestrating product layout
- Clean component composition with proper props distribution
- Responsive layout ready for all screen sizes
- Proper TypeScript typing for all props
- Exported and ready for use in page.tsx
- Foundation for adding child components from other groups

### Verification Checklist

- [ ] File `ProductDetailContainer.tsx` created in `_components/`
- [ ] Component is Server Component (no 'use client')
- [ ] Props interface includes product data
- [ ] Container structure organized into logical sections
- [ ] Responsive layout classes applied (Tailwind)
- [ ] Component exported as named export
- [ ] Added to `_components/index.ts` barrel export
- [ ] TypeScript types correct and no errors
- [ ] Container renders in page.tsx successfully
- [ ] Layout responds to screen size changes

---

## Task 10: Create Product Breadcrumb

### Overview

Implement a breadcrumb navigation component that displays the product's hierarchical position within the catalog structure (Home > Category > Subcategory > Product). This improves navigation, user experience, and SEO through structured breadcrumb markup.

### Dependencies

- **Prerequisites:**
  - Task 09 completed (container component)
  - Product category structure defined
  - Understanding of structured data for breadcrumbs

- **Related Tasks:**
  - Task 03 (Breadcrumb renders in layout's nav area)
  - Task 08 (Can add BreadcrumbList JSON-LD)

### Instructions

#### Step 1: Create Breadcrumb Component File

1. In `app/products/[slug]/_components/` directory
2. Create file: `ProductBreadcrumb.tsx`
3. Can be Server Component (unless interactive features needed)
4. Will receive breadcrumb data as props

#### Step 2: Define Breadcrumb Props Interface

Create interface for breadcrumb props:
1. `breadcrumbs` array containing breadcrumb items
2. Each item: `{ label: string, href: string }`
3. Optional: `currentPage` string for last item
4. Type with TypeScript interface

#### Step 3: Design Breadcrumb Structure

Plan the breadcrumb UI:
1. Horizontal list of links separated by separators
2. Each item is a clickable link (except last)
3. Last item (current page) is not clickable
4. Visual separators (/, >, chevron icon)
5. Responsive: show all on desktop, truncate on mobile

#### Step 4: Implement Breadcrumb Rendering

Render logic:
1. Map over breadcrumbs array
2. Render each item as Link (next/link)
3. Add separator between items (not after last)
4. Style current page differently (bold, not clickable)
5. Use semantic HTML (nav, ol, li)

#### Step 5: Add Breadcrumb Separators

Choose separator style:
1. Text: "/" or ">"
2. Icon: Chevron right (from icon library)
3. Style: Color, size, spacing
4. Accessibility: aria-hidden for decorative separators

#### Step 6: Implement Mobile Responsiveness

Mobile behavior:
1. Show "< Back" button instead of full breadcrumb (optional)
2. Or show truncated breadcrumb: "Home > ... > Product"
3. Or horizontal scroll for long breadcrumbs
4. Ensure touch targets are adequate (min 44x44px)

#### Step 7: Add Structured Data (JSON-LD)

Implement BreadcrumbList schema:
1. @type: "BreadcrumbList"
2. itemListElement: Array of ListItem objects
3. Each item: position, name, item (URL)
4. Helps search engines understand site structure
5. Can be added in generateMetadata or component

#### Step 8: Style Breadcrumb Component

Styling considerations:
1. Text size: small (text-sm)
2. Colors: Gray for links, darker for current
3. Hover effects on links
4. Spacing between items
5. Vertical alignment with separators

### Breadcrumb Structure Table

| Element | HTML Tag | Purpose | Styling |
|---------|----------|---------|---------|
| Container | `<nav>` | Semantic navigation | py-4, text-sm |
| List | `<ol>` | Ordered list of links | flex, items-center |
| Item | `<li>` | Individual breadcrumb | flex, items-center |
| Link | `<Link>` (Next.js) | Clickable navigation | text-gray-600, hover |
| Current | `<span>` | Non-clickable current page | text-gray-900, font-medium |
| Separator | `<span>` or icon | Visual divider | text-gray-400, mx-2 |

### Breadcrumb Data Flow

```
Product Data (from parent)
    ├── category: "Electronics"
    ├── subcategory: "Computer Accessories"
    ├── subSubcategory: "Mice" (optional)
    └── productName: "Wireless Mouse Pro"
    ↓
Container Component
    ↓
Builds Breadcrumb Array:
[
  { label: "Home", href: "/" },
  { label: "Electronics", href: "/products/electronics" },
  { label: "Computer Accessories", href: "/products/electronics/accessories" },
  { label: "Mice", href: "/products/electronics/accessories/mice" },
  { label: "Wireless Mouse Pro", href: null } // current page
]
    ↓
ProductBreadcrumb Component
    ↓
Renders: Home > Electronics > Computer Accessories > Mice > Wireless Mouse Pro
```

### Structured Data Schema

```
BreadcrumbList Schema:
├── @context: "https://schema.org"
├── @type: "BreadcrumbList"
└── itemListElement: [
    {
      @type: "ListItem",
      position: 1,
      name: "Home",
      item: "https://site.com/"
    },
    {
      @type: "ListItem",
      position: 2,
      name: "Electronics",
      item: "https://site.com/products/electronics"
    },
    {
      @type: "ListItem",
      position: 3,
      name: "Computer Accessories",
      item: "https://site.com/products/electronics/accessories"
    },
    {
      @type: "ListItem",
      position: 4,
      name: "Wireless Mouse Pro",
      item: "https://site.com/products/wireless-mouse-pro"
    }
  ]
```

### Mobile Responsiveness Options

| Approach | Display | Pros | Cons |
|----------|---------|------|------|
| Full Breadcrumb | All items visible | Complete context | May overflow |
| Truncated | "Home > ... > Product" | Saves space | Lost hierarchy |
| Back Button | "< Back to Category" | Simple, clean | One-level only |
| Horizontal Scroll | Scrollable breadcrumb | All items accessible | Less obvious |
| Dropdown | Expandable menu | Space-efficient | Extra click needed |

### Separator Options

| Type | Character/Icon | Accessibility | Notes |
|------|----------------|---------------|-------|
| Slash | "/" | aria-hidden="true" | Simple, universal |
| Greater Than | ">" | aria-hidden="true" | Clear direction |
| Chevron Icon | "›" or icon | aria-hidden="true" | Modern look |
| Vertical Bar | "\|" | aria-hidden="true" | Less common |

### Expected Outcome

- Functional breadcrumb component showing product hierarchy
- Proper semantic HTML for accessibility and SEO
- Responsive design working on mobile and desktop
- Structured data (JSON-LD) for search engines
- Clean visual design with appropriate styling
- All links functional except current page

### Verification Checklist

- [ ] File `ProductBreadcrumb.tsx` created
- [ ] Component receives breadcrumb data as props
- [ ] Renders as semantic HTML (nav, ol, li)
- [ ] All links (except last) are clickable
- [ ] Current page styled differently
- [ ] Separators between items (not after last)
- [ ] Responsive on mobile (truncated or scrollable)
- [ ] Structured data (BreadcrumbList) implemented
- [ ] Added to barrel export
- [ ] Component renders in container
- [ ] TypeScript types correct
- [ ] No accessibility warnings

---

## Task 11: Create Two-Column Layout

### Overview

Implement a responsive two-column layout structure for desktop and larger screens, with the product media gallery on the left and product information/actions on the right. This layout maximizes screen real estate and provides optimal viewing experience.

### Dependencies

- **Prerequisites:**
  - Task 09 completed (container component)
  - Understanding of CSS Grid or Flexbox
  - Tailwind CSS responsive utilities

- **Related Tasks:**
  - Task 12 (Mobile stack layout)
  - Group B (Media gallery for left column)
  - Groups C-E (Content for right column)

### Instructions

#### Step 1: Define Layout Breakpoint Strategy

Plan responsive breakpoints:
1. Mobile (< 1024px): Single column (Task 12)
2. Desktop (≥ 1024px): Two columns (this task)
3. Wide (≥ 1280px): Two columns with more space

#### Step 2: Implement Grid Layout

Using CSS Grid:
1. Container: `grid grid-cols-1 lg:grid-cols-2`
2. Gap: `gap-8 lg:gap-12 xl:gap-16`
3. Equal columns: `grid-cols-2` (50/50)
4. Or custom: `grid-cols-[60%_40%]` (60/40 media/info)

Alternative - Using Flexbox:
1. Container: `flex flex-col lg:flex-row`
2. Gap: `gap-8 lg:gap-12`
3. Left: `lg:flex-1` or `lg:w-1/2`
4. Right: `lg:flex-1` or `lg:w-1/2`

#### Step 3: Configure Left Column (Media)

Left column specifications:
1. Contains: Product media gallery
2. Width: 50-60% of container
3. Sticky behavior (optional): Stick to top on scroll
4. Max height considerations for long pages
5. Aspect ratio maintenance for images

#### Step 4: Configure Right Column (Information)

Right column specifications:
1. Contains: Product info, price, options, actions
2. Width: 40-50% of container
3. Scrollable if content exceeds viewport
4. Proper spacing between sections
5. Sticky add-to-cart bar (optional)

#### Step 5: Implement Column Ordering

Ensure proper order:
1. Media gallery first (left)
2. Product information second (right)
3. Use `order-` utilities if needed for specific layouts
4. Consider reading direction (LTR)

#### Step 6: Add Sticky Behavior (Optional Enhancement)

Optional sticky gallery:
1. Left column: `lg:sticky lg:top-24` (accounts for header height)
2. Keeps images visible while scrolling info
3. Test with various content heights
4. Disable on mobile (stack layout)

#### Step 7: Handle Content Overflow

Manage long content:
1. Right column may be scrollable
2. Left column maintains fixed height with sticky
3. Or both columns scroll naturally
4. Ensure footer is reachable

#### Step 8: Test Layout Responsiveness

Verify across breakpoints:
1. Below 1024px: Single column (Task 12)
2. 1024px+: Two columns side-by-side
3. 1280px+: Increased spacing
4. 1536px+: Max width container

### Layout Configuration Table

| Screen Size | Columns | Grid Class | Gap | Column Ratio |
|-------------|---------|------------|-----|--------------|
| < 1024px | 1 | grid-cols-1 | gap-6 | 100% |
| 1024-1280px | 2 | grid-cols-2 | gap-8 | 50/50 |
| 1280-1536px | 2 | grid-cols-2 | gap-12 | 50/50 or 60/40 |
| > 1536px | 2 | grid-cols-2 | gap-16 | 60/40 |

### Two-Column Layout Diagram

```
Desktop Layout (≥ 1024px)
┌─────────────────────────────────────────────────┐
│  Breadcrumb                                     │
├─────────────────────┬───────────────────────────┤
│                     │                           │
│  Media Gallery      │  Product Header           │
│  (Left Column)      │  ├── Name                 │
│  ├── Main Image     │  ├── Brand                │
│  ├── Thumbnails     │  └── Rating               │
│  └── Zoom           │                           │
│     (60% width)     │  Product Price            │
│                     │  ├── Current Price        │
│                     │  └── Discount Info        │
│     Sticky          │                           │
│     (Optional)      │  Product Options          │
│                     │  ├── Size/Color           │
│                     │  └── Quantity             │
│                     │                           │
│                     │  Product Actions          │
│                     │  ├── Add to Cart          │
│                     │  ├── Buy Now              │
│                     │  └── Wishlist             │
│                     │                           │
│                     │  (40% width)              │
│                     │  Scrollable               │
└─────────────────────┴───────────────────────────┘
│  Product Tabs (Full Width)                     │
│  ├── Description                                │
│  ├── Specifications                             │
│  └── Reviews                                    │
└─────────────────────────────────────────────────┘
```

### Sticky Gallery Implementation

| Aspect | Configuration | Notes |
|--------|---------------|-------|
| Position | `lg:sticky` | Only on desktop |
| Top Offset | `lg:top-24` | Accounts for header (e.g., 96px) |
| Height | `lg:h-fit` or `lg:max-h-screen` | Prevents overflow |
| Z-Index | `lg:z-10` | If overlapping needed |
| Scroll Margin | `lg:scroll-mt-24` | For anchor links |

### Content Distribution

| Column | Content | Percentage | Scrollable |
|--------|---------|------------|------------|
| Left (Media) | Gallery, zoom, thumbnails | 60% | No (sticky) |
| Right (Info) | Header, price, options, actions, short details | 40% | Yes |
| Full Width | Tabs (description, specs, reviews) | 100% | Yes |

### Grid vs Flexbox Comparison

| Layout Method | Pros | Cons | Use Case |
|---------------|------|------|----------|
| CSS Grid | Equal heights, precise control | Slightly complex | Recommended for product pages |
| Flexbox | Simple, flexible | Height matching harder | Good for simpler layouts |
| Combination | Best of both | More code | Complex responsive needs |

### Expected Outcome

- Responsive two-column layout on desktop (≥1024px)
- Media gallery on left, info on right
- Proper spacing and gaps between columns
- Optional sticky behavior for gallery
- Smooth transition from mobile stack to two columns
- Clean, professional appearance

### Verification Checklist

- [ ] Two-column layout applied with grid or flex
- [ ] Left column contains media gallery placeholder
- [ ] Right column contains info/actions placeholder
- [ ] Proper gap spacing between columns
- [ ] Layout activates at 1024px breakpoint
- [ ] Sticky behavior works (if implemented)
- [ ] Content doesn't overflow unexpectedly
- [ ] Smooth responsive transition
- [ ] TypeScript/CSS no errors
- [ ] Test across multiple screen sizes

---

## Task 12: Create Mobile Stack Layout

### Overview

Implement a single-column stacked layout for mobile and tablet devices, where product media and information are arranged vertically for optimal touch interaction and readability on smaller screens.

### Dependencies

- **Prerequisites:**
  - Task 09 completed (container component)
  - Task 11 completed (two-column layout)
  - Understanding of mobile-first responsive design

### Instructions

#### Step 1: Set Mobile-First Approach

Default to mobile layout:
1. Base styles apply to mobile (no breakpoint prefix)
2. Use Tailwind's mobile-first methodology
3. Stack layout is the default
4. Two-column applied at `lg:` breakpoint and above

#### Step 2: Implement Stack Layout

Stacking structure:
1. Container: `flex flex-col` (default, single column)
2. Items stack vertically in source order
3. Gap: `gap-6` (24px between sections)
4. Full width: Each section takes 100% width

#### Step 3: Define Stacking Order

Optimal mobile order:
1. **First**: Breadcrumb navigation
2. **Second**: Product media gallery (primary focus)
3. **Third**: Product header (name, brand, rating)
4. **Fourth**: Product price and discount
5. **Fifth**: Product options (variants, quantity)
6. **Sixth**: Product actions (add to cart buttons)
7. **Seventh**: Product tabs (description, specs, reviews)

#### Step 4: Optimize Media Gallery for Mobile

Mobile gallery considerations:
1. Single main image with swipe/carousel
2. Thumbnail strip below (horizontal scroll)
3. Full-width images
4. Touch gestures: swipe, pinch-to-zoom
5. Aspect ratio: Square (1:1) or standard (4:3)

#### Step 5: Optimize Information Panel for Mobile

Mobile info panel:
1. Larger text for readability
2. Touch-friendly buttons (min 44x44px)
3. Collapsed/expandable sections for long content
4. Sticky add-to-cart bar at bottom (optional)

#### Step 6: Handle Tablet Breakpoint (640-1024px)

Tablet considerations:
1. Still use stack layout (not two-column yet)
2. Increase spacing: `sm:gap-8`
3. Potentially wider max-width container
4. Larger touch targets maintained

#### Step 7: Implement Sticky Action Bar (Mobile Enhancement)

Optional sticky bar:
1. Position: Fixed at bottom of viewport
2. Contains: Quantity selector, Add to Cart, Price
3. Appears after scrolling past product options
4. Z-index: Above content
5. Shadow/border for visual separation

#### Step 8: Test Touch Interactions

Mobile interaction testing:
1. Image swiping smooth
2. Buttons easily tappable
3. Dropdowns/selects touch-friendly
4. No accidental clicks
5. Scrolling performance optimized

### Mobile Layout Stacking Order

| Order | Section | Component | Spacing |
|-------|---------|-----------|---------|
| 1 | Navigation | Breadcrumb | mb-4 |
| 2 | Media | Product Gallery | mb-6 |
| 3 | Header | Product Name/Brand/Rating | mb-4 |
| 4 | Pricing | Price/Discount | mb-4 |
| 5 | Options | Size/Color/Quantity | mb-6 |
| 6 | Actions | Add to Cart/Buy Now | mb-8 |
| 7 | Details | Tabs (Description/Specs/Reviews) | - |

### Mobile Stack Layout Diagram

```
Mobile Layout (< 1024px)
┌─────────────────────────────────┐
│  Breadcrumb                     │
├─────────────────────────────────┤
│  Product Media Gallery          │
│  ┌─────────────────────────┐   │
│  │   Main Image            │   │
│  │   (Full Width)          │   │
│  └─────────────────────────┘   │
│  [Thumb] [Thumb] [Thumb] ...   │
├─────────────────────────────────┤
│  Product Header                 │
│  • Product Name                 │
│  • Brand                        │
│  • Rating ★★★★☆               │
├─────────────────────────────────┤
│  Product Price                  │
│  • LKR 2,500.00                │
│  • 20% OFF                     │
├─────────────────────────────────┤
│  Product Options                │
│  • Size: [Select Size]         │
│  • Color: [Color Swatches]     │
│  • Quantity: [- 1 +]           │
├─────────────────────────────────┤
│  Product Actions                │
│  [   Add to Cart   ]           │
│  [     Buy Now      ]           │
│  ♡ Add to Wishlist             │
├─────────────────────────────────┤
│  Product Tabs                   │
│  [Description] [Specs] [Reviews]│
│  Tab content here...            │
└─────────────────────────────────┘
│  Sticky Action Bar (Optional)  │
│  [- 1 +]  [Add to Cart] LKR... │
└─────────────────────────────────┘
```

### Responsive Spacing Table

| Breakpoint | Gap | Padding | Container Width |
|------------|-----|---------|-----------------|
| < 640px | gap-6 (24px) | px-4 (16px) | 100% |
| 640-1024px | gap-8 (32px) | px-6 (24px) | 100% |
| ≥ 1024px | (Two-column Task 11) | px-8 (32px) | Max 1280px |

### Sticky Action Bar Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Position | `fixed bottom-0` | Stick to bottom |
| Width | `w-full` | Full width |
| Padding | `p-4` | Inner spacing |
| Background | `bg-white` | Solid background |
| Shadow | `shadow-lg` | Visual elevation |
| Z-Index | `z-40` | Above content |
| Border | `border-t` | Subtle separation |

### Touch Target Sizing

| Element | Minimum Size | Recommended | Spacing |
|---------|--------------|-------------|---------|
| Buttons | 44x44px | 48x48px | 8px between |
| Links | 44x44px | 48x48px | 8px between |
| Form Inputs | 44px height | 48px height | 16px between |
| Icon Buttons | 44x44px | 44x44px | 12px between |
| Thumbnails | 60x60px | 80x80px | 8px gap |

### Mobile Performance Optimizations

| Optimization | Implementation | Benefit |
|--------------|----------------|---------|
| Lazy Load Images | `loading="lazy"` | Faster initial load |
| Image Optimization | Next.js Image component | Smaller file sizes |
| Touch Gestures | Native browser or library | Smooth interactions |
| Minimize Animations | Reduce motion on mobile | Better performance |
| Code Splitting | Dynamic imports | Smaller bundles |

### Expected Outcome

- Single-column stacked layout on mobile (<1024px)
- Optimal stacking order for mobile UX
- Full-width sections with appropriate spacing
- Touch-friendly buttons and interactions
- Optional sticky action bar for easy cart addition
- Smooth transition to two-column at desktop breakpoint

### Verification Checklist

- [ ] Stack layout applied on mobile (<1024px)
- [ ] Correct stacking order (media → info → actions)
- [ ] Proper spacing between stacked sections
- [ ] All buttons meet minimum touch target size (44x44px)
- [ ] Images full-width and properly scaled
- [ ] Sticky action bar implemented (if desired)
- [ ] Test on actual mobile devices (iOS, Android)
- [ ] Swipe gestures work in image gallery
- [ ] No horizontal scroll issues
- [ ] Smooth transition to desktop layout at 1024px
- [ ] TypeScript/CSS no errors

---

## Task 13: Create Product Data Fetcher

### Overview

Implement a server-side data fetching utility that retrieves complete product information from the API or database. This fetcher handles API calls, error handling, caching, and data transformation for optimal performance.

### Dependencies

- **Prerequisites:**
  - Task 02 completed (page component)
  - Product API endpoints defined
  - Understanding of Next.js data fetching patterns

- **Related Tasks:**
  - Task 14 (Product types for type safety)
  - Task 15 (API service layer)

### Instructions

#### Step 1: Create Fetcher File

1. Navigate to `app/products/[slug]/_lib/` directory
2. Create file: `fetchProduct.ts`
3. This will be a Server Component utility (Node.js environment)
4. Uses fetch API or database client

#### Step 2: Define Fetcher Function Signature

Create function signature:
1. Function name: `fetchProduct` or `getProductBySlug`
2. Parameter: `slug: string`
3. Return type: `Promise<Product>` or `Promise<Product | null>`
4. Async function
5. Export as named export

#### Step 3: Implement API/Database Call

Fetching logic:
1. Construct API URL with slug parameter
2. Use Next.js fetch with caching options
3. Or use database ORM (Prisma, etc.) if backend
4. Include authentication headers if required
5. Set timeout for requests

#### Step 4: Configure Next.js Fetch Caching

Optimize with caching:
1. `cache: 'force-cache'` - Static, revalidate with ISR
2. `cache: 'no-store'` - Always fresh, no caching
3. `next: { revalidate: 3600 }` - ISR with 1-hour revalidation
4. Choose based on data freshness requirements

#### Step 5: Handle Response Parsing

Parse and validate response:
1. Check response status (200, 404, 500)
2. Parse JSON: `await response.json()`
3. Validate response structure matches Product type
4. Transform data if API format differs from frontend needs
5. Handle missing or malformed data

#### Step 6: Implement Error Handling

Robust error handling:
1. Try-catch block around fetch
2. Handle 404: return null (trigger not-found.tsx)
3. Handle 500: throw error (trigger error.tsx)
4. Handle network errors: retry logic or throw
5. Log errors for debugging

#### Step 7: Add Data Transformation

Transform API data to frontend format:
1. Normalize field names (snake_case to camelCase)
2. Parse dates to Date objects
3. Format prices (convert cents to dollars)
4. Structure nested objects (variants, images)
5. Add computed fields if needed

#### Step 8: Implement Related Data Fetching

Optionally fetch related data:
1. Product variants
2. Related products
3. Product reviews
4. Product availability (inventory)
5. Consider parallel fetching for performance

#### Step 9: Add TypeScript Typing

Strong type safety:
1. Import Product type from Task 14
2. Type function parameters and return
3. Type API response
4. Use generics if fetcher is reusable

### Fetcher Function Structure

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Function Signature | Define API | `async function fetchProduct(slug: string)` |
| API Call | Retrieve data | `fetch(\`/api/products/\${slug}\`)` |
| Response Handling | Parse JSON | `await response.json()` |
| Error Handling | Catch failures | Try-catch, status checks |
| Data Transformation | Format data | Normalize, parse, compute |
| Return | Provide data | Return Product or null |

### Fetch Caching Strategies

| Strategy | Configuration | Use Case | Revalidation |
|----------|---------------|----------|--------------|
| Static | `cache: 'force-cache'` | Unchanging products | Build time only |
| ISR (1 hour) | `revalidate: 3600` | Frequent updates | Every hour |
| ISR (1 day) | `revalidate: 86400` | Daily updates | Daily |
| Dynamic | `cache: 'no-store'` | Real-time data (stock) | Every request |
| Default | No config | Next.js default | Automatic |

### Data Fetching Flow Diagram

```
fetchProduct(slug: "wireless-mouse-pro")
    ↓
Construct API URL
    ↓
Next.js Fetch with Caching
    ├── Check Cache (if enabled)
    │   ├── Hit: Return cached data
    │   └── Miss: Continue to API
    ↓
API Call: GET /api/products/wireless-mouse-pro
    ↓
Response Received
    ├── Status 200: Success
    ├── Status 404: Product not found → return null
    └── Status 500: Server error → throw error
    ↓
Parse JSON Response
    ↓
Validate & Transform Data
    ├── Normalize field names
    ├── Parse dates
    ├── Format prices
    └── Structure nested objects
    ↓
Return: Product object
    ↓
Page Component renders with data
```

### Error Handling Strategy

| Error Type | Response Status | Action | User Impact |
|------------|-----------------|--------|-------------|
| Not Found | 404 | Return null | Show not-found.tsx |
| Server Error | 500 | Throw error | Show error.tsx |
| Network Error | - | Throw error | Show error.tsx |
| Timeout | - | Throw error with retry | Show error with retry button |
| Invalid Data | 200 (bad data) | Throw error | Show error.tsx |

### Data Transformation Examples

| API Field | Frontend Field | Transformation |
|-----------|----------------|----------------|
| `product_name` | `name` | Rename to camelCase |
| `price_cents` | `price` | Convert: `priceCents / 100` |
| `created_at` | `createdAt` | Parse: `new Date(createdAt)` |
| `image_urls` | `images` | Map to image objects with alt text |
| `variant_options` | `variants` | Structure into nested array |
| `average_rating` | `rating` | Round to 1 decimal |

### API Response Structure Example

```
API Response Structure:
{
  "id": "uuid",
  "product_name": "Wireless Mouse Pro",
  "slug": "wireless-mouse-pro",
  "description": "...",
  "price_cents": 250000,
  "discount_percentage": 20,
  "image_urls": ["url1", "url2"],
  "category": { "id": "...", "name": "..." },
  "variants": [...],
  "average_rating": 4.5,
  "review_count": 28,
  "stock_quantity": 50,
  "created_at": "2026-01-01T00:00:00Z"
}
    ↓ Transform to ↓
Frontend Product Type:
{
  id: string,
  name: string,
  slug: string,
  description: string,
  price: number,
  discountPercentage: number,
  images: Image[],
  category: Category,
  variants: Variant[],
  rating: number,
  reviewCount: number,
  stock: number,
  createdAt: Date
}
```

### Expected Outcome

- Functional data fetcher retrieving product information
- Proper error handling for all error scenarios
- Caching configured for optimal performance
- Data transformation from API to frontend format
- Strong TypeScript typing throughout
- Reusable fetcher for other product-related pages

### Verification Checklist

- [ ] File `fetchProduct.ts` created in `_lib/` directory
- [ ] Function signature properly defined with types
- [ ] API call implemented with fetch
- [ ] Caching strategy configured
- [ ] Response parsing and validation implemented
- [ ] Error handling covers all scenarios (404, 500, network)
- [ ] Data transformation applied
- [ ] TypeScript types imported and used
- [ ] Function exported and imported in page.tsx
- [ ] Fetcher successfully retrieves product data
- [ ] 404 cases handled (return null)
- [ ] Errors properly thrown and caught
- [ ] No TypeScript errors

---

## Task 14: Create Product Types

### Overview

Define comprehensive TypeScript types and interfaces for all product-related data structures. This ensures type safety throughout the product detail page, improves developer experience, and catches errors at compile time.

### Dependencies

- **Prerequisites:**
  - TypeScript configuration completed
  - Understanding of product data structure
  - API response format documented

- **Related Tasks:**
  - Task 13 (Fetcher uses these types)
  - Task 15 (API service uses these types)
  - All Groups (Components use these types)

### Instructions

#### Step 1: Create Types File

1. Navigate to `app/products/[slug]/_types/` directory
2. Create file: `product.types.ts`
3. This will contain all product-related types and interfaces
4. Export all types for use across components

#### Step 2: Define Base Product Interface

Create main Product interface:
1. Core fields: id, name, slug, description
2. Pricing: price, discountPrice, discountPercentage, currency
3. Media: images array
4. Metadata: createdAt, updatedAt
5. Relationships: category, brand, variants

#### Step 3: Define Nested Type Structures

Create supporting interfaces:
1. **Image**: { id, url, alt, order, type }
2. **Category**: { id, name, slug, parent }
3. **Brand**: { id, name, logo, slug }
4. **Variant**: { id, name, options, price, sku, stock }
5. **VariantOption**: { type, value, surcharge }
6. **Price**: { amount, currency, formatted }

#### Step 4: Define Review and Rating Types

Review-related interfaces:
1. **Rating**: { average, count, distribution }
2. **Review**: { id, author, rating, title, content, date, verified, helpful }
3. **ReviewAuthor**: { name, avatar, verified }
4. **RatingDistribution**: { 5: count, 4: count, ... }

#### Step 5: Define Inventory and Availability Types

Stock management types:
1. **Stock**: { quantity, available, status, warehouse }
2. **Availability**: { inStock, backorder, discontinued }
3. **DeliveryEstimate**: { min, max, unit }

#### Step 6: Define SEO and Metadata Types

SEO-related types:
1. **SEO**: { title, description, keywords, canonicalUrl }
2. **OpenGraph**: { title, description, image, url, type }
3. **StructuredData**: JSON-LD product schema

#### Step 7: Create Utility Types

Helper types:
1. **ProductStatus**: Union type ('active' | 'draft' | 'archived')
2. **StockStatus**: Union type ('in_stock' | 'out_of_stock' | 'backorder')
3. **VariantType**: Union type ('size' | 'color' | 'material')
4. **Nullable<T>**: Generic for optional fields

#### Step 8: Define API Response Types

Types for API responses:
1. **ProductResponse**: Raw API response structure
2. **ProductListResponse**: Paginated list response
3. **ApiError**: Error response structure

#### Step 9: Create Type Guards

Type guard functions:
1. `isProduct(obj: any): obj is Product`
2. `hasVariants(product: Product): boolean`
3. `isInStock(product: Product): boolean`
4. Add validation logic to guards

#### Step 10: Document Types with JSDoc

Add documentation:
1. JSDoc comments for each interface
2. Explain field purposes
3. Note required vs optional fields
4. Provide examples where helpful

### Core Product Type Structure

```
Product Interface Fields:
├── Core Identification
│   ├── id: string
│   ├── sku: string
│   ├── slug: string
│   └── barcode?: string
│
├── Basic Information
│   ├── name: string
│   ├── shortDescription: string
│   ├── description: string
│   └── specifications: Record<string, string>
│
├── Pricing
│   ├── price: number
│   ├── discountPrice?: number
│   ├── discountPercentage?: number
│   ├── currency: string
│   └── taxIncluded: boolean
│
├── Media
│   ├── images: Image[]
│   ├── videos?: Video[]
│   └── documents?: Document[]
│
├── Categorization
│   ├── category: Category
│   ├── subcategory?: Category
│   ├── brand: Brand
│   └── tags: string[]
│
├── Variants & Options
│   ├── variants: Variant[]
│   ├── hasVariants: boolean
│   └── variantTypes: VariantType[]
│
├── Inventory
│   ├── stock: Stock
│   ├── availability: Availability
│   └── deliveryEstimate: DeliveryEstimate
│
├── Reviews & Ratings
│   ├── rating: Rating
│   └── reviews: Review[]
│
├── SEO & Metadata
│   ├── seo: SEO
│   ├── metadata: Record<string, any>
│   └── createdAt: Date
│   └── updatedAt: Date
│
└── Status
    ├── status: ProductStatus
    └── featured: boolean
```

### Type Definition Examples Table

| Type | Purpose | Example Fields |
|------|---------|----------------|
| Product | Main product entity | id, name, price, images, variants |
| Image | Product image | id, url, alt, order, type |
| Variant | Product variant | id, name, options, price, sku |
| VariantOption | Single variant option | type, value, surcharge |
| Review | Customer review | id, author, rating, content, date |
| Stock | Inventory info | quantity, available, status |
| Category | Product category | id, name, slug, parent |
| Brand | Product brand | id, name, logo, slug |

### Union Types for Product Domain

| Union Type | Values | Usage |
|------------|--------|-------|
| ProductStatus | 'active' \| 'draft' \| 'archived' | Product visibility |
| StockStatus | 'in_stock' \| 'out_of_stock' \| 'backorder' | Availability |
| VariantType | 'size' \| 'color' \| 'material' \| 'style' | Variant categorization |
| ImageType | 'main' \| 'thumbnail' \| 'gallery' \| 'lifestyle' | Image purpose |
| CurrencyCode | 'LKR' \| 'USD' \| 'EUR' | Pricing currency |

### Variant Structure Example

```
Variant Interface:
├── id: string
├── productId: string
├── sku: string
├── name: string
├── options: VariantOption[]
│   └── VariantOption:
│       ├── type: 'size' | 'color' | etc.
│       ├── value: string (e.g., "Large", "Red")
│       └── surcharge?: number
├── price: number
├── stock: number
├── image?: string
└── available: boolean

Example:
{
  id: "var123",
  productId: "prod456",
  sku: "MOUSE-PRO-BLK-L",
  name: "Wireless Mouse Pro - Black, Large",
  options: [
    { type: "color", value: "Black", surcharge: 0 },
    { type: "size", value: "Large", surcharge: 500 }
  ],
  price: 2500,
  stock: 15,
  image: "https://...",
  available: true
}
```

### Optional vs Required Fields

| Field Category | Required | Optional | Reasoning |
|----------------|----------|----------|-----------|
| Core ID | id, slug, name | sku, barcode | ID always needed |
| Pricing | price, currency | discountPrice, tax | Price required |
| Media | images (at least 1) | videos, documents | Visual needed |
| Category | category | subcategory, tags | Organization |
| Inventory | stock | availability, delivery | Stock critical |
| Reviews | rating.count | reviews array | May have no reviews yet |

### Type Guard Implementations

| Function | Purpose | Logic |
|----------|---------|-------|
| `isProduct(obj)` | Validate Product type | Check required fields exist |
| `hasVariants(product)` | Check if variants exist | `product.variants.length > 0` |
| `isInStock(product)` | Check availability | `product.stock.quantity > 0` |
| `isDiscounted(product)` | Check if on sale | `product.discountPrice != null` |
| `hasReviews(product)` | Check if reviewed | `product.rating.count > 0` |

### Expected Outcome

- Comprehensive TypeScript types for all product data
- Nested interfaces for complex structures
- Union types for constrained values
- Type guards for runtime validation
- Full JSDoc documentation
- Type safety throughout product page codebase

### Verification Checklist

- [ ] File `product.types.ts` created in `_types/` directory
- [ ] Main Product interface defined with all core fields
- [ ] Nested types defined (Image, Variant, Review, etc.)
- [ ] Union types created for constrained values
- [ ] Optional vs required fields properly marked
- [ ] Type guards implemented for validation
- [ ] JSDoc comments added to all types
- [ ] Types exported for use in other files
- [ ] Added to barrel export `_types/index.ts`
- [ ] No TypeScript errors in types file
- [ ] Types imported and used in fetcher (Task 13)
- [ ] Types compile correctly with strict mode

---

## Task 15: Create Product API Service

### Overview

Implement a comprehensive API service layer that encapsulates all product-related API calls, providing a clean interface for data operations. This service includes methods for fetching products, related items, reviews, and handling various query parameters.

### Dependencies

- **Prerequisites:**
  - Task 13 completed (data fetcher)
  - Task 14 completed (product types)
  - API endpoints documented and accessible

- **Related Tasks:**
  - Used by Task 13 fetcher
  - Used by future components needing product data

### Instructions

#### Step 1: Create API Service File

1. Navigate to `app/products/[slug]/_lib/` directory
2. Create file: `productApi.ts` or `api/productService.ts`
3. This will be a service class or module
4. Exports all product-related API functions

#### Step 2: Define API Service Structure

Choose architecture:
1. **Module approach**: Export individual functions
2. **Class approach**: ProductApiService class with methods
3. **Singleton**: Single instance exported
4. Recommended: Module with named exports (simpler for Server Components)

#### Step 3: Implement Base API Configuration

Set up API configuration:
1. Base URL: `const API_BASE_URL = process.env.API_URL || '/api'`
2. Default headers: Content-Type, Authorization (if needed)
3. Timeout configuration
4. Retry logic (optional)
5. Error interceptors

#### Step 4: Create Core Product Methods

Implement main methods:
1. **getProductBySlug(slug)**: Fetch single product (used in Task 13)
2. **getProductById(id)**: Fetch by ID
3. **getProducts(filters)**: List products with filters
4. **searchProducts(query)**: Search products

#### Step 5: Create Related Product Methods

Additional fetchers:
1. **getRelatedProducts(productId)**: Fetch related items
2. **getSimilarProducts(productId)**: Fetch similar items
3. **getRecentlyViewed(userSession)**: User's recent products
4. **getCrossSellProducts(productId)**: Cross-sell suggestions

#### Step 6: Create Review Methods

Review operations:
1. **getProductReviews(productId, pagination)**: Fetch reviews
2. **submitReview(productId, reviewData)**: Post review (Server Action)
3. **rateProduct(productId, rating)**: Submit rating
4. **reportReview(reviewId)**: Report inappropriate review

#### Step 7: Create Inventory Methods

Stock operations:
1. **checkAvailability(productId, quantity)**: Check stock
2. **getDeliveryEstimate(productId, location)**: Estimate delivery
3. **subscribeToStockAlert(productId, email)**: Notify when back in stock

#### Step 8: Implement Error Handling

Centralized error handling:
1. Try-catch in all methods
2. Transform API errors to user-friendly messages
3. Log errors for debugging
4. Return consistent error format
5. Handle specific error codes (404, 401, 500)

#### Step 9: Add Request/Response Interceptors

Middleware functions:
1. Request interceptor: Add auth token, modify headers
2. Response interceptor: Transform data, handle errors
3. Logging: Log requests in development
4. Caching: Add cache headers

#### Step 10: Type All Methods

Strong typing:
1. Import types from Task 14
2. Type all function parameters
3. Type all return values (Promise<Product>, etc.)
4. Type error objects
5. Use generics for reusable methods

### API Service Architecture

```
productApi.ts
├── Configuration
│   ├── API_BASE_URL
│   ├── DEFAULT_HEADERS
│   └── TIMEOUT
│
├── Core Methods
│   ├── getProductBySlug(slug: string): Promise<Product>
│   ├── getProductById(id: string): Promise<Product>
│   ├── getProducts(filters: ProductFilters): Promise<Product[]>
│   └── searchProducts(query: string): Promise<Product[]>
│
├── Related Products
│   ├── getRelatedProducts(id: string): Promise<Product[]>
│   ├── getSimilarProducts(id: string): Promise<Product[]>
│   └── getCrossSellProducts(id: string): Promise<Product[]>
│
├── Reviews
│   ├── getProductReviews(id: string): Promise<Review[]>
│   ├── submitReview(data: ReviewData): Promise<Review>
│   └── reportReview(id: string): Promise<void>
│
├── Inventory
│   ├── checkAvailability(id: string): Promise<Stock>
│   └── getDeliveryEstimate(id: string): Promise<DeliveryEstimate>
│
└── Utilities
    ├── handleApiError(error: Error): never
    ├── transformResponse(data: any): Product
    └── buildQueryString(params: object): string
```

### API Methods Table

| Method | Endpoint | Parameters | Return Type | Cache |
|--------|----------|------------|-------------|-------|
| getProductBySlug | GET /products/{slug} | slug: string | Promise<Product> | ISR 1hr |
| getProductById | GET /products/{id} | id: string | Promise<Product> | ISR 1hr |
| getProducts | GET /products | filters: object | Promise<Product[]> | ISR 1hr |
| searchProducts | GET /products/search | query: string | Promise<Product[]> | No cache |
| getRelatedProducts | GET /products/{id}/related | id: string | Promise<Product[]> | ISR 1hr |
| getProductReviews | GET /products/{id}/reviews | id, pagination | Promise<Review[]> | ISR 10min |
| checkAvailability | GET /products/{id}/stock | id: string | Promise<Stock> | No cache |

### Error Handling Strategy

| Error Type | HTTP Status | Action | User Message |
|------------|-------------|--------|--------------|
| Product Not Found | 404 | Return null | "Product not found" |
| Unauthorized | 401 | Redirect to login | "Please log in" |
| Server Error | 500 | Throw error | "Something went wrong" |
| Network Error | - | Retry then throw | "Connection issue" |
| Validation Error | 400 | Return error details | Field-specific messages |
| Rate Limited | 429 | Delay and retry | "Too many requests" |

### API Configuration Example

```
API Service Configuration:
├── Base URL
│   ├── Production: process.env.NEXT_PUBLIC_API_URL
│   ├── Development: 'http://localhost:8000/api'
│   └── Staging: process.env.STAGING_API_URL
│
├── Headers
│   ├── Content-Type: 'application/json'
│   ├── Authorization: `Bearer ${token}` (if authenticated)
│   └── Accept-Language: user's locale
│
├── Timeout
│   ├── Default: 30 seconds
│   └── Long operations: 60 seconds
│
├── Retry Logic
│   ├── Retry count: 3
│   ├── Backoff: Exponential
│   └── Retryable: Network errors, 5xx errors
│
└── Caching
    ├── GET requests: Cache based on endpoint
    ├── POST/PUT/DELETE: No cache
    └── Revalidation: Tag-based or time-based
```

### Request/Response Flow

```
Component Calls API Method
    ↓
productApi.getProductBySlug(slug)
    ↓
Request Interceptor
    ├── Add authentication token
    ├── Add request headers
    └── Log request (dev only)
    ↓
Fetch API Call
    ↓
Await Response
    ↓
Response Interceptor
    ├── Check status code
    ├── Parse JSON
    ├── Transform data to frontend format
    └── Log response (dev only)
    ↓
Error Handling (if error)
    ├── Classify error type
    ├── Log error details
    ├── Transform to user-friendly message
    └── Throw or return null
    ↓
Return: Product object or null
    ↓
Component receives data
```

### Service Method Signatures

```typescript
// Core methods
getProductBySlug(slug: string): Promise<Product | null>
getProductById(id: string): Promise<Product | null>
getProducts(filters?: ProductFilters): Promise<Product[]>
searchProducts(query: string, options?: SearchOptions): Promise<Product[]>

// Related products
getRelatedProducts(productId: string, limit?: number): Promise<Product[]>
getSimilarProducts(productId: string, limit?: number): Promise<Product[]>

// Reviews
getProductReviews(
  productId: string, 
  pagination?: PaginationOptions
): Promise<PaginatedReviews>

// Inventory
checkAvailability(productId: string, variantId?: string): Promise<Stock>
getDeliveryEstimate(productId: string, zipCode?: string): Promise<DeliveryEstimate>
```

### Expected Outcome

- Comprehensive API service for all product operations
- Clean, typed interfaces for all methods
- Centralized error handling and logging
- Reusable across product page and other pages
- Proper caching configuration
- Strong TypeScript typing throughout

### Verification Checklist

- [ ] File `productApi.ts` created in `_lib/` directory
- [ ] All core methods implemented (getProductBySlug, etc.)
- [ ] Related product methods implemented
- [ ] Review methods implemented
- [ ] Inventory methods implemented
- [ ] Error handling in all methods
- [ ] TypeScript types applied to all methods
- [ ] API base URL configured from environment
- [ ] Request/response interceptors added (if needed)
- [ ] Methods exported and imported in fetcher
- [ ] Test API calls successfully retrieve data
- [ ] Error scenarios properly handled
- [ ] No TypeScript errors

---

## Task 16: Verify Route and Data Flow

### Overview

Perform comprehensive verification and testing of the entire product detail route, including routing functionality, data fetching, error handling, loading states, responsive layouts, and component integration. This ensures all Tasks 01-15 work together seamlessly.

### Dependencies

- **Prerequisites:**
  - All Tasks 01-15 completed
  - Product detail page accessible
  - Test data available (products in database/API)

### Instructions

#### Step 1: Verify Route Functionality

Test dynamic routing:
1. Navigate to valid product slug: `/products/valid-slug`
2. Verify page loads successfully
3. Check URL parameter extraction (slug passed to page)
4. Test with multiple different product slugs
5. Verify route responds with correct status codes

#### Step 2: Verify Page Structure

Check page composition:
1. Breadcrumb renders at top
2. Layout structure correct (two-column on desktop, stack on mobile)
3. All product sections present (media, info, tabs)
4. Container component renders without errors
5. No missing components or placeholders

#### Step 3: Verify Data Fetching

Test data flow:
1. Product data fetched successfully from API
2. Data displayed correctly in UI
3. All product fields populated (name, price, images, etc.)
4. Related data loaded (reviews, related products)
5. Check browser Network tab for API calls

#### Step 4: Verify Loading States

Test loading UI:
1. Navigate to product page (with slow network if possible)
2. Loading skeleton displays during fetch
3. Loading state matches product layout
4. Smooth transition from loading to loaded
5. No layout shift (CLS) during transition

#### Step 5: Verify Error Handling

Test error scenarios:
1. **404 Test**: Navigate to non-existent slug `/products/fake-slug`
   - Verify not-found.tsx displays
   - Check proper messaging
2. **500 Test**: Simulate API error (mock or temporary API issue)
   - Verify error.tsx displays
   - Check recovery options (Try Again button)
3. **Network Error**: Disconnect network, navigate
   - Verify error boundary catches error

#### Step 6: Verify Responsive Layouts

Test across breakpoints:
1. **Mobile (<640px)**: Verify stack layout, full-width sections
2. **Tablet (640-1024px)**: Verify still stacked, larger spacing
3. **Desktop (≥1024px)**: Verify two-column layout activates
4. **Wide (≥1280px)**: Verify increased spacing and max-width
5. Use browser dev tools responsive mode

#### Step 7: Verify SEO and Metadata

Check metadata generation:
1. Inspect page HTML `<head>` section
2. Verify title tag present and correct format
3. Verify meta description present
4. Check Open Graph tags (og:title, og:image, etc.)
5. Check Twitter Card tags
6. Verify structured data (JSON-LD) in page source

#### Step 8: Verify Static Generation (ISR)

Test build and static generation:
1. Run production build: `npm run build`
2. Check build output for generated pages
3. Verify static pages in `.next/server` directory
4. Test ISR revalidation (if configured)
5. Verify dynamic params work for non-static products

#### Step 9: Performance Testing

Check performance metrics:
1. Run Lighthouse audit (Performance, SEO, Accessibility)
2. Check Time to First Byte (TTFB)
3. Check Largest Contentful Paint (LCP)
4. Check Cumulative Layout Shift (CLS)
5. Check First Input Delay (FID) or Interaction to Next Paint (INP)
6. Aim for scores: Performance >90, SEO 100, Accessibility >90

#### Step 10: Verify TypeScript and Linting

Code quality checks:
1. Run TypeScript check: `npm run type-check` or `tsc --noEmit`
2. Verify no TypeScript errors in product page files
3. Run linter: `npm run lint`
4. Fix any linting issues
5. Verify all types properly imported and used

#### Step 11: Test User Flows

End-to-end scenarios:
1. **Browse to Product**: Home → Category → Product
2. **Direct Link**: Share URL, open in new tab
3. **Search to Product**: Search → Product
4. **Back Navigation**: Navigate back from product page
5. **Refresh Page**: Hard refresh (Cmd+Shift+R), verify data persists

#### Step 12: Browser Compatibility

Test across browsers:
1. Chrome/Edge (Chromium)
2. Firefox
3. Safari (if on Mac)
4. Mobile Safari (iOS)
5. Chrome Mobile (Android)
6. Check for browser-specific issues

#### Step 13: Document Findings

Create verification report:
1. List all tests performed
2. Mark pass/fail for each test
3. Note any issues found
4. Document browser-specific bugs
5. Create tickets for any failures

### Verification Checklist - Route & Structure

| Test Case | Expected Result | Status | Notes |
|-----------|-----------------|--------|-------|
| Valid product slug | Page loads successfully | ☐ | `/products/test-product` |
| Invalid product slug | Not-found page displays | ☐ | `/products/fake-slug` |
| Page structure | All sections present | ☐ | Breadcrumb, media, info, tabs |
| URL parameters | Slug extracted correctly | ☐ | Check page props |
| Route status codes | 200 for valid, 404 for invalid | ☐ | Check Network tab |

### Verification Checklist - Data & State

| Test Case | Expected Result | Status | Notes |
|-----------|-----------------|--------|-------|
| Product data fetched | Data loads from API | ☐ | Check Network tab |
| All fields populated | Name, price, images, etc. | ☐ | No missing data |
| Loading state | Skeleton displays during fetch | ☐ | Throttle network to test |
| Error state (404) | not-found.tsx shows | ☐ | Invalid slug |
| Error state (500) | error.tsx shows with retry | ☐ | Mock API error |
| Related data | Reviews, related products load | ☐ | If applicable |

### Verification Checklist - Responsive Design

| Breakpoint | Layout | Status | Notes |
|------------|--------|--------|-------|
| Mobile (<640px) | Single column stack | ☐ | Test on phone or DevTools |
| Tablet (640-1024px) | Still stacked | ☐ | iPad size |
| Desktop (≥1024px) | Two-column layout | ☐ | Standard laptop |
| Wide (≥1280px) | Two-column with increased spacing | ☐ | Large monitor |
| Transitions | Smooth between breakpoints | ☐ | Resize browser |

### Verification Checklist - SEO & Metadata

| Element | Expected | Status | Tool |
|---------|----------|--------|------|
| Title tag | "Product Name \| LankaCommerce" | ☐ | View page source |
| Meta description | Product description (150-160 chars) | ☐ | View source |
| Open Graph tags | og:title, og:image, og:description | ☐ | Facebook Debugger |
| Twitter Card | twitter:card, twitter:image | ☐ | Twitter Validator |
| Structured data | Product JSON-LD schema | ☐ | Google Rich Results Test |
| Canonical URL | Correct canonical set | ☐ | View source |

### Verification Checklist - Performance

| Metric | Target | Actual | Status | Notes |
|--------|--------|--------|--------|-------|
| Lighthouse Performance | >90 | ___ | ☐ | Run in incognito mode |
| TTFB | <800ms | ___ ms | ☐ | Time to First Byte |
| LCP | <2.5s | ___ s | ☐ | Largest Contentful Paint |
| CLS | <0.1 | ___ | ☐ | Cumulative Layout Shift |
| FID/INP | <100ms | ___ ms | ☐ | First Input Delay / INP |
| Lighthouse SEO | 100 | ___ | ☐ | Perfect SEO score |
| Lighthouse Accessibility | >90 | ___ | ☐ | Accessibility score |

### Verification Checklist - Code Quality

| Check | Status | Command | Notes |
|-------|--------|---------|-------|
| TypeScript compilation | ☐ | `tsc --noEmit` | No errors |
| ESLint | ☐ | `npm run lint` | No errors/warnings |
| Type imports | ☐ | Manual check | All types from Task 14 |
| Barrel exports | ☐ | Manual check | index.ts files updated |
| No console.logs | ☐ | Search codebase | Remove debug logs |

### Browser Compatibility Matrix

| Browser | Version | Desktop | Mobile | Status | Issues |
|---------|---------|---------|--------|--------|--------|
| Chrome | Latest | ☐ | ☐ | | |
| Firefox | Latest | ☐ | - | | |
| Safari | Latest | ☐ | ☐ | | |
| Edge | Latest | ☐ | - | | |
| Samsung Internet | Latest | - | ☐ | | |

### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Data not loading | API URL incorrect | Check .env and API_BASE_URL |
| 404 for valid products | generateStaticParams not working | Check build output, verify function |
| Layout shift | Images load without dimensions | Add width/height or aspect-ratio |
| TypeScript errors | Types not imported | Import from Task 14 types file |
| Slow loading | No caching | Configure fetch cache in Task 13 |
| Metadata not showing | generateMetadata not exporting | Check export in page.tsx |

### Expected Outcome

- All product detail routes functioning correctly
- Data fetching reliable and performant
- Loading and error states working as designed
- Responsive layouts adapting to all screen sizes
- SEO metadata properly generated
- High performance scores (Lighthouse >90)
- No TypeScript or linting errors
- Cross-browser compatibility verified

### Final Verification Checklist

- [ ] All route tests passed
- [ ] Data fetching verified for multiple products
- [ ] Loading states display correctly
- [ ] Error handling works for 404 and 500
- [ ] Not-found page displays for invalid slugs
- [ ] Responsive layouts work at all breakpoints
- [ ] SEO metadata present and correct
- [ ] Open Graph tags validated
- [ ] Structured data validated
- [ ] Performance scores meet targets (>90)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] Cross-browser testing completed
- [ ] All Tasks 01-15 integration verified
- [ ] Documentation updated with findings
- [ ] Ready to proceed to Group B (Product Media Gallery)

---

## Document Summary

This document covered Tasks 09-16 of Phase-08 SubPhase-04 Group-A, implementing the product page container, layouts, data infrastructure, and comprehensive verification of the complete route.

### Tasks Completed

9. ✅ Created product page container component
10. ✅ Created product breadcrumb navigation
11. ✅ Created two-column desktop layout
12. ✅ Created mobile stack layout
13. ✅ Created product data fetcher
14. ✅ Created comprehensive product types
15. ✅ Created product API service
16. ✅ Verified complete route and data flow

### Key Deliverables

- **Container Component**: ProductDetailContainer orchestrating all child components
- **Breadcrumb**: Navigation context with structured data
- **Responsive Layouts**: Two-column (desktop) and stack (mobile)
- **Data Layer**: Fetcher, types, and API service
- **Verification**: Complete testing of route functionality

### Files Created

| File | Purpose | Task |
|------|---------|------|
| `_components/ProductDetailContainer.tsx` | Main container | 09 |
| `_components/ProductBreadcrumb.tsx` | Breadcrumb navigation | 10 |
| `_lib/fetchProduct.ts` | Data fetcher | 13 |
| `_types/product.types.ts` | TypeScript types | 14 |
| `_lib/productApi.ts` | API service | 15 |

### Architecture Completed

- ✅ Product page container with component composition
- ✅ Breadcrumb navigation with SEO structured data
- ✅ Responsive two-column and mobile stack layouts
- ✅ Server-side data fetching with caching
- ✅ Comprehensive TypeScript type system
- ✅ Reusable API service layer
- ✅ Complete route verification

### Next Steps

With Group-A complete, the foundation for the product detail page is solid. Proceed to:

- **Group-B**: Product Media Gallery (image carousel, zoom, thumbnails)
- **Group-C**: Product Information Panel (header, pricing, options)
- **Group-D**: Product Actions (add to cart, wishlist, buy now)
- **Group-E**: Product Tabs (description, specifications, reviews)
- **Group-F**: Related Products (recommendations, cross-sells)

### Performance Baseline

Ensure the following targets are met before proceeding:

- Lighthouse Performance: >90
- Lighthouse SEO: 100
- Lighthouse Accessibility: >90
- TTFB: <800ms
- LCP: <2.5s
- CLS: <0.1

---

**Document Status:** Complete  
**Last Updated:** January 2026  
**Next Group:** Group-B Product Media Gallery  
**Phase Progress:** Group A of F Complete (16.7%)
