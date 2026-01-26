# Tasks 71-77: Category Page Component and Data

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** E - Category & Collection Pages  
> **Document:** 01 of 02  
> **Tasks Covered:** 71, 72, 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-78-84_Collection-Page-Verify.md](02_Tasks-78-84_Collection-Page-Verify.md)

---

## Document Overview

This document covers the creation of the category page component with its header elements, including banner images, descriptions, subcategory navigation, data fetching utilities, and SEO metadata. The category page provides a dedicated view for browsing products within a specific category, complete with filtering capabilities and subcategory navigation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 71 | Create Category Page Component | Medium | 45 min |
| 72 | Create Category Header | Medium | 40 min |
| 73 | Create Category Banner Image | Low | 25 min |
| 74 | Create Category Description | Low | 20 min |
| 75 | Create Subcategory Navigation | Medium | 40 min |
| 76 | Create Category Data Fetcher | Medium | 45 min |
| 77 | Create Category SEO Meta | Low | 25 min |

---

## Task 71: Create Category Page Component

### Overview
Create the main CategoryPage component that serves as the container for the category browsing experience. This component integrates the category header, subcategory navigation, product grid with filters, and handles the overall layout and state management for the category view.

### Dependencies
- Task 70: Product pagination completed
- Product grid component exists
- Filter components exist
- Next.js App Router structure established

### Instructions

1. **Create category component directory**
   - Navigate to `frontend/components/storefront/catalog/` directory
   - Create new directory named `Category`
   - Create `CategoryPage.tsx` file in this directory

2. **Define TypeScript interfaces**
   - Create `CategoryPageProps` interface with category, products, filters
   - Create `CategoryData` type for category information
   - Include properties: id, name, slug, description, bannerUrl, parentId, childCategories
   - Create `CategoryProduct` type extending base Product

3. **Import required dependencies**
   - Import React hooks (useState, useEffect)
   - Import Next.js components (Image, Link)
   - Import ProductGrid component from Group-B
   - Import FilterSidebar from Group-C
   - Import components from upcoming tasks (CategoryHeader, SubcategoryNav)

4. **Create component structure**
   - Define CategoryPage functional component
   - Accept props: category, products, pagination, filters
   - Set up state for filter selections and view mode

5. **Implement layout structure**
   - Create main container with proper spacing
   - Add CategoryHeader at top (Task 72)
   - Add SubcategoryNav below header (Task 75)
   - Create two-column layout: filters sidebar + product grid

6. **Implement responsive layout**
   - Hide filter sidebar on mobile (show in modal/drawer)
   - Stack elements vertically on small screens
   - Use grid layout for desktop: 1/4 filters, 3/4 products

7. **Add breadcrumb navigation**
   - Display breadcrumb path: Home > Category > Subcategory
   - Use category hierarchy for breadcrumb construction
   - Link each breadcrumb segment to appropriate page

8. **Integrate filter functionality**
   - Pass filter options to FilterSidebar
   - Handle filter changes via callback props
   - Update URL parameters when filters change
   - Maintain filter state across navigation

9. **Add product count display**
   - Show total product count for category
   - Display filtered count when filters applied
   - Format: "Showing 24 of 156 products"

10. **Implement view mode toggle**
    - Support grid and list view modes
    - Persist view preference in localStorage
    - Pass view mode to ProductGrid component

11. **Add loading states**
    - Show skeleton loaders while fetching data
    - Display loading indicators during filter changes
    - Ensure smooth transitions between states

12. **Handle empty states**
    - Display message when category has no products
    - Show different message when filters yield no results
    - Provide action buttons (clear filters, view all categories)

### Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Electronics > Smartphones               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ╔═══════════════════════════════════════════════════════╗  │
│ ║          Category Header (Banner + Title)            ║  │
│ ╚═══════════════════════════════════════════════════════╝  │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │       Subcategory Navigation (Horizontal Scroll)     │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌──────────┬───────────────────────────────────────────┐  │
│ │ Filters  │  Products                                 │  │
│ │          │  ┌───────┬───────┬───────┬───────┐       │  │
│ │ • Price  │  │ Prod1 │ Prod2 │ Prod3 │ Prod4 │       │  │
│ │ • Brand  │  └───────┴───────┴───────┴───────┘       │  │
│ │ • Rating │  ┌───────┬───────┬───────┬───────┐       │  │
│ │ • Color  │  │ Prod5 │ Prod6 │ Prod7 │ Prod8 │       │  │
│ │          │  └───────┴───────┴───────┴───────┘       │  │
│ └──────────┴───────────────────────────────────────────┘  │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │                  Pagination Controls                  │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| category | CategoryData | Yes | Category information |
| products | CategoryProduct[] | Yes | Products in category |
| pagination | PaginationData | Yes | Pagination metadata |
| filters | FilterOptions | Yes | Available filter options |
| initialFilters | FilterState | No | Pre-applied filters |

### Layout Breakpoints

| Breakpoint | Layout | Filters | Grid Columns |
|------------|--------|---------|--------------|
| Mobile (<640px) | Stack | Hidden (modal) | 2 |
| Tablet (640-1024px) | Two-column | Visible | 3 |
| Desktop (>1024px) | Two-column | Visible | 4 |

### State Management

| State | Type | Purpose |
|-------|------|---------|
| selectedFilters | FilterState | Active filter selections |
| viewMode | 'grid' \| 'list' | Product display mode |
| isFilterOpen | boolean | Mobile filter modal state |
| sortOption | SortOption | Current sort selection |

### Expected Outcome
- Fully functional category page component
- Responsive layout with filter sidebar and product grid
- Integrated breadcrumb navigation
- Filter and sort functionality
- Proper loading and empty states

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Category/CategoryPage.tsx` created
- [ ] Component accepts all required props
- [ ] Breadcrumb navigation displays correctly
- [ ] CategoryHeader integrated and displays properly
- [ ] SubcategoryNav integrated and displays properly
- [ ] Filter sidebar works on desktop, modal on mobile
- [ ] Product grid displays with correct columns per breakpoint
- [ ] Product count displays accurately
- [ ] View mode toggle functions correctly
- [ ] Loading states implemented
- [ ] Empty states handled appropriately
- [ ] TypeScript types properly defined

---

## Task 72: Create Category Header

### Overview
Create the CategoryHeader component that displays the category banner, title, breadcrumb, and description at the top of the category page. This component provides visual context and navigation cues for users browsing a specific category.

### Dependencies
- Task 71: Create Category Page Component

### Instructions

1. **Create CategoryHeader component file**
   - Create `CategoryHeader.tsx` in `components/storefront/catalog/Category/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CategoryHeaderProps` interface
   - Include: category (name, description, bannerUrl), breadcrumbs array
   - Add optional className for styling flexibility

3. **Import required dependencies**
   - Import Next.js Image component
   - Import CategoryBanner component (Task 73)
   - Import CategoryDescription component (Task 74)
   - Import Breadcrumb component if separate

4. **Create header structure**
   - Create main container with proper spacing
   - Add banner section at top (full-width or constrained)
   - Add content overlay section for title and breadcrumb
   - Add description section below banner

5. **Implement banner section**
   - Use CategoryBanner component (Task 73)
   - Position banner as background or top element
   - Add overlay gradient for text readability
   - Handle banner image loading and fallback

6. **Add breadcrumb navigation**
   - Display breadcrumb above or within banner
   - Use array of breadcrumb items: {label, href}
   - Style with separators (chevron or slash)
   - Ensure last item is current category (non-clickable)

7. **Display category title**
   - Position title prominently (H1 semantic tag)
   - Use large font size (text-3xl to text-5xl)
   - Apply white color if over dark banner, dark if separate
   - Ensure proper contrast for accessibility

8. **Add product count indicator**
   - Display total products in category
   - Format: "156 products" or "1 product"
   - Position near title or in subtitle area
   - Use secondary text color

9. **Integrate description**
   - Use CategoryDescription component (Task 74)
   - Position below banner or within content area
   - Ensure proper spacing and typography

10. **Implement responsive design**
    - Adjust title size for mobile vs desktop
    - Stack elements vertically on small screens
    - Reduce banner height on mobile
    - Adjust padding and margins for each breakpoint

11. **Add animation/transitions**
    - Fade in banner image on load
    - Animate title entrance with subtle effect
    - Use CSS transitions for smooth appearance

### Header Layout Options

**Option A: Banner with Overlay**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     ╔═══════════════════════════════════╗          │
│     ║    Banner Image (Full Width)     ║          │
│     ║                                   ║          │
│     ║  ┌─────────────────────────────┐ ║          │
│     ║  │ Breadcrumb                  │ ║          │
│     ║  │ Category Title (H1)         │ ║          │
│     ║  │ 156 products                │ ║          │
│     ║  └─────────────────────────────┘ ║          │
│     ║      ↑ Text overlay with        ║          │
│     ║        gradient background      ║          │
│     ╚═══════════════════════════════════╝          │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Category Description                        │   │
│ │ (Below banner, no overlay)                  │   │
│ └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Option B: Separate Banner and Content**
```
┌─────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════╗  │
│ ║        Banner Image (Decorative Only)        ║  │
│ ╚═══════════════════════════════════════════════╝  │
│                                                     │
│ Home > Electronics > Smartphones                   │
│                                                     │
│ Smartphones                                         │
│ 156 products                                        │
│                                                     │
│ Browse our collection of latest smartphones...     │
└─────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| category | CategoryData | Yes | Category details |
| breadcrumbs | Breadcrumb[] | Yes | Navigation path |
| productCount | number | Yes | Total products |
| className | string | No | Additional styling |

### Breadcrumb Structure

| Property | Type | Example |
|----------|------|---------|
| label | string | "Electronics" |
| href | string | "/products/category/electronics" |
| current | boolean | true (for last item) |

### Typography Hierarchy

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Category Title | text-3xl | text-4xl | text-5xl |
| Product Count | text-sm | text-base | text-base |
| Breadcrumb | text-xs | text-sm | text-sm |
| Description | text-sm | text-base | text-lg |

### Banner Overlay Gradient

| Position | Color Stops | Purpose |
|----------|-------------|---------|
| Bottom | rgba(0,0,0,0.8) to transparent | Text readability |
| Top | transparent to rgba(0,0,0,0.3) | Subtle darkening |

### Expected Outcome
- Professional category header with banner
- Clear category title and breadcrumb navigation
- Readable text with proper contrast
- Responsive design across all devices
- Smooth loading animations

### Verification Checklist
- [ ] `CategoryHeader.tsx` file created
- [ ] Component accepts category, breadcrumbs, productCount props
- [ ] Banner displays correctly (Task 73)
- [ ] Category title uses H1 semantic tag
- [ ] Breadcrumb navigation functional
- [ ] Product count displays properly
- [ ] Description integrated (Task 74)
- [ ] Responsive design on mobile, tablet, desktop
- [ ] Overlay gradient ensures text readability
- [ ] Proper TypeScript types defined
- [ ] Component exports correctly

---

## Task 73: Create Category Banner Image

### Overview
Create the CategoryBanner component that displays the category banner image with proper optimization, fallback handling, and responsive sizing. This component provides visual identity for each category and enhances the browsing experience.

### Dependencies
- Task 72: Create Category Header

### Instructions

1. **Create CategoryBanner component file**
   - Create `CategoryBanner.tsx` in `components/storefront/catalog/Category/` directory
   - Set up React functional component

2. **Define component props**
   - Create `CategoryBannerProps` interface
   - Include: bannerUrl (string), categoryName (string), alt text
   - Add optional: height, priority (for Next.js Image)

3. **Import Next.js Image component**
   - Use next/image for automatic optimization
   - Configure for external URLs if banners from CDN
   - Set up proper image loader if needed

4. **Implement image display**
   - Use Next.js Image with fill or fixed dimensions
   - Set object-fit to 'cover' for proper scaling
   - Add loading priority for above-fold images

5. **Configure image dimensions**
   - Set responsive height: 200px mobile, 300px desktop
   - Use full width (w-full)
   - Maintain aspect ratio with object-cover

6. **Add fallback image handling**
   - Detect when bannerUrl is null or empty
   - Show default gradient or pattern background
   - Use category-specific colors if available
   - Display subtle icon or pattern on fallback

7. **Implement error handling**
   - Catch image loading errors
   - Fall back to default banner on error
   - Log errors for debugging without breaking UI

8. **Add gradient overlay**
   - Create semi-transparent gradient overlay
   - Use CSS or pseudo-element for overlay
   - Ensure overlay doesn't obscure important image details
   - Make overlay configurable via props

9. **Apply rounded corners (optional)**
   - Add border radius if not full-width banner
   - Use rounded-lg or rounded-xl
   - Ensure consistent with overall design

10. **Optimize for performance**
    - Use appropriate image formats (WebP with fallback)
    - Set proper image sizes for responsive loading
    - Add blur placeholder while loading
    - Lazy load if banner is below fold

11. **Add accessibility attributes**
    - Provide meaningful alt text: "{categoryName} category banner"
    - Use aria-hidden if purely decorative
    - Ensure proper semantic structure

### Banner Display Modes

**Full Width Banner**
```
┌────────────────────────────────────────────────────────┐
│ ╔══════════════════════════════════════════════════╗  │
│ ║                                                  ║  │
│ ║           Category Banner Image                 ║  │
│ ║           (Full viewport width)                 ║  │
│ ║                                                  ║  │
│ ╚══════════════════════════════════════════════════╝  │
└────────────────────────────────────────────────────────┘
```

**Constrained Banner with Rounded Corners**
```
┌────────────────────────────────────────────────────────┐
│   ╔════════════════════════════════════════════════╗  │
│   ║                                                ║  │
│   ║       Category Banner Image (Contained)       ║  │
│   ║                                                ║  │
│   ╚════════════════════════════════════════════════╝  │
└────────────────────────────────────────────────────────┘
```

**Fallback Banner (No Image)**
```
┌────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────┐ │
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ │
│ │  ░░░░░░░░    Gradient Background    ░░░░░░░░░░░  │ │
│ │  ░░░░░░░░    or Pattern Fallback    ░░░░░░░░░░░  │ │
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| bannerUrl | string \| null | Yes | - | Banner image URL |
| categoryName | string | Yes | - | Category name for alt text |
| height | number | No | 300 | Banner height in pixels |
| priority | boolean | No | false | Next.js Image priority loading |
| withOverlay | boolean | No | true | Show gradient overlay |

### Responsive Heights

| Breakpoint | Height | Aspect Ratio |
|------------|--------|--------------|
| Mobile (<640px) | 200px | 16:9 or wider |
| Tablet (640-1024px) | 250px | 21:9 |
| Desktop (>1024px) | 300px | 21:9 |

### Fallback Gradient Options

| Category Type | Gradient |
|---------------|----------|
| Electronics | Blue to purple gradient |
| Fashion | Pink to orange gradient |
| Home & Garden | Green to teal gradient |
| Default | Gray to light gray |

### Image Optimization Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| Format | WebP + fallback | Smaller file size |
| Quality | 80 | Balance quality/size |
| Sizes | (max-width: 768px) 100vw, 1200px | Responsive loading |
| Loading | eager (priority) or lazy | Performance |

### Expected Outcome
- Optimized banner image component
- Graceful fallback for missing images
- Responsive height across devices
- Smooth loading with placeholder
- Proper accessibility attributes

### Verification Checklist
- [ ] `CategoryBanner.tsx` file created
- [ ] Next.js Image component used
- [ ] Banner displays with correct dimensions
- [ ] Responsive height on mobile, tablet, desktop
- [ ] Fallback gradient/pattern for missing images
- [ ] Error handling implemented
- [ ] Alt text provided for accessibility
- [ ] Gradient overlay applied (if enabled)
- [ ] Performance optimized (WebP, lazy loading)
- [ ] TypeScript interface defined
- [ ] Component exports properly

---

## Task 74: Create Category Description

### Overview
Create the CategoryDescription component that displays formatted category description text with expandable/collapsible functionality for long descriptions. This component provides context about the category and improves SEO through relevant content.

### Dependencies
- Task 72: Create Category Header

### Instructions

1. **Create CategoryDescription component file**
   - Create `CategoryDescription.tsx` in `components/storefront/catalog/Category/` directory
   - Set up functional component structure

2. **Define component props**
   - Create `CategoryDescriptionProps` interface
   - Include: description (string), maxLength (number, optional)
   - Add: expanded (boolean) for controlled state

3. **Implement description display**
   - Show full description if short (< maxLength)
   - Show truncated version with "Read more" for long text
   - Use proper typography and spacing

4. **Add expand/collapse functionality**
   - Create state for isExpanded (boolean)
   - Toggle state on "Read more" / "Read less" click
   - Animate height change with CSS transition

5. **Format description text**
   - Preserve line breaks if present in description
   - Convert markdown to HTML if descriptions use markdown
   - Sanitize HTML to prevent XSS if descriptions allow HTML
   - Apply proper paragraph spacing

6. **Style description text**
   - Use text-gray-700 or similar for readability
   - Set line-height to 1.6-1.8 for readability
   - Use text-base or text-lg font size
   - Add proper margins/padding

7. **Implement "Read more" button**
   - Display only when description exceeds maxLength
   - Style as text button (not prominent)
   - Position inline after truncated text or below
   - Add hover and focus states

8. **Add truncation logic**
   - Truncate at word boundary, not mid-word
   - Add ellipsis (...) after truncated text
   - Calculate based on character count or line count

9. **Handle empty descriptions**
   - Return null or display nothing if no description
   - Optionally show placeholder for admin users
   - Ensure proper spacing when hidden

10. **Add SEO optimization**
    - Ensure full description rendered in DOM for SEO
    - Use CSS to hide content if using display truncation
    - Alternatively use aria-hidden for collapsed content

11. **Implement responsive behavior**
    - Adjust maxLength for mobile vs desktop
    - Mobile: shorter initial display (150 chars)
    - Desktop: longer initial display (300 chars)

### Description Display States

**Short Description (No Truncation)**
```
┌──────────────────────────────────────────────────┐
│ Browse our collection of latest smartphones      │
│ from top brands. Find the perfect device with    │
│ advanced features and cutting-edge technology.   │
└──────────────────────────────────────────────────┘
```

**Long Description (Collapsed)**
```
┌──────────────────────────────────────────────────┐
│ Browse our extensive collection of smartphones   │
│ from top brands including Samsung, Apple, and    │
│ Xiaomi. Find the perfect device with advanced... │
│                                                  │
│ [Read more ↓]                                    │
└──────────────────────────────────────────────────┘
```

**Long Description (Expanded)**
```
┌──────────────────────────────────────────────────┐
│ Browse our extensive collection of smartphones   │
│ from top brands including Samsung, Apple, and    │
│ Xiaomi. Find the perfect device with advanced    │
│ features, high-resolution cameras, long battery  │
│ life, and cutting-edge technology. Whether       │
│ you're looking for flagship models or budget-    │
│ friendly options, we have something for everyone.│
│                                                  │
│ [Read less ↑]                                    │
└──────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| description | string | Yes | - | Category description text |
| maxLength | number | No | 250 | Max chars before truncation |
| className | string | No | "" | Additional CSS classes |

### Truncation Settings

| Breakpoint | Max Length | Reason |
|------------|------------|--------|
| Mobile | 150 chars | Limited screen space |
| Tablet | 200 chars | More space available |
| Desktop | 300 chars | Full space available |

### Typography Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Font Size | text-base or text-lg | Readable size |
| Line Height | leading-relaxed (1.625) | Easy reading |
| Color | text-gray-700 | Subtle, readable |
| Max Width | max-w-4xl | Optimal line length |

### Animation

| State Change | Animation |
|--------------|-----------|
| Expand | max-height transition 300ms ease-in |
| Collapse | max-height transition 300ms ease-out |
| Button | opacity change on hover |

### Expected Outcome
- Clean description display component
- Expand/collapse for long descriptions
- Proper text formatting and typography
- Responsive truncation lengths
- SEO-friendly rendering

### Verification Checklist
- [ ] `CategoryDescription.tsx` file created
- [ ] Component accepts description and maxLength props
- [ ] Short descriptions display fully
- [ ] Long descriptions truncate with "Read more"
- [ ] Expand/collapse functionality works
- [ ] Animation smooth during state changes
- [ ] Truncation at word boundaries (no mid-word cuts)
- [ ] Empty descriptions handled gracefully
- [ ] Typography and spacing appropriate
- [ ] Responsive maxLength on different screens
- [ ] TypeScript types defined
- [ ] Component exports correctly

---

## Task 75: Create Subcategory Navigation

### Overview
Create the SubcategoryNav component that displays child categories in a horizontal scrollable navigation bar. This component allows users to quickly navigate between subcategories without leaving the current category context.

### Dependencies
- Task 71: Create Category Page Component

### Instructions

1. **Create SubcategoryNav component file**
   - Create `SubcategoryNav.tsx` in `components/storefront/catalog/Category/` directory
   - Set up functional component

2. **Define component props**
   - Create `SubcategoryNavProps` interface
   - Include: subcategories array (id, name, slug, productCount)
   - Add: currentSubcategory (optional) for active highlighting

3. **Import required dependencies**
   - Import Next.js Link component
   - Import icons (ChevronRight or similar) if needed
   - Import any scroll utility hooks

4. **Create navigation container**
   - Use horizontal flex container
   - Enable horizontal scrolling: overflow-x-auto
   - Hide scrollbar or style for consistency
   - Add proper padding and margins

5. **Render subcategory items**
   - Map over subcategories array
   - Create Link for each subcategory
   - Display subcategory name
   - Show product count badge (optional)

6. **Style navigation items**
   - Use pill-style buttons (rounded-full)
   - Apply border and background color
   - Add padding: px-4 py-2
   - Use hover effects (background color change)

7. **Implement active state**
   - Highlight current subcategory
   - Use different background/border color for active
   - Apply bold font weight for active item

8. **Add product count badges**
   - Display count in parentheses or badge: "Phones (24)"
   - Use smaller font size and muted color
   - Position inline with subcategory name

9. **Implement scroll behavior**
   - Smooth scrolling with snap points (optional)
   - Add subtle fade gradient at edges to indicate more items
   - Ensure scroll position preserves on navigation

10. **Add "View All" option**
    - Include link to parent category (all products)
    - Position at start or end of navigation
    - Style differently to distinguish from subcategories

11. **Handle empty subcategories**
    - Return null if no subcategories exist
    - Optionally show message to admin users

12. **Implement responsive design**
    - Horizontal scroll on all devices
    - Adjust item sizing for mobile vs desktop
    - Ensure touch-friendly tap targets (min 44x44px)

### Navigation Layout

**Desktop View**
```
┌─────────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌───│
│ │ All  │ │ Phones   │ │ Tablets  │ │ Smartwatch │ │...│
│ │      │ │ (24)     │ │ (18)     │ │ (12)       │ │   │
│ └──────┘ └──────────┘ └──────────┘ └────────────┘ └───│
│    ↑         ↑                                          │
│  Active   Subcategory                                   │
└─────────────────────────────────────────────────────────┘
```

**Mobile View with Scroll**
```
┌──────────────────────────────────────┐
│ ┌──────┐ ┌──────────┐ ┌──────── │►  │
│ │ All  │ │ Phones   │ │ Tablets │   │
│ │      │ │ (24)     │ │ (18)    │   │
│ └──────┘ └──────────┘ └──────── │   │
│            ↑                         │
│          Active                      │
│    ◄────── Swipe to scroll ──────►  │
└──────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| subcategories | Subcategory[] | Yes | Array of child categories |
| currentSlug | string | No | Active subcategory slug |
| showCounts | boolean | No (default: true) | Show product counts |
| parentSlug | string | Yes | Parent category slug for "All" link |

### Subcategory Object Structure

| Property | Type | Example |
|----------|------|---------|
| id | string | "cat_123" |
| name | string | "Smartphones" |
| slug | string | "smartphones" |
| productCount | number | 24 |

### Item Styling

| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default | bg-white | border-gray-300 | text-gray-700 |
| Hover | bg-gray-50 | border-gray-400 | text-gray-900 |
| Active | bg-blue-600 | border-blue-600 | text-white |

### Scroll Container Styles

| Property | Value | Purpose |
|----------|-------|---------|
| Display | flex | Horizontal layout |
| Gap | gap-2 or gap-3 | Spacing between items |
| Overflow | overflow-x-auto | Enable scrolling |
| Scrollbar | scrollbar-hide | Clean appearance |
| Padding | px-4 py-3 | Container padding |

### Edge Fade Gradient (Optional)

| Side | Gradient |
|------|----------|
| Left | linear-gradient(to right, white, transparent 20px) |
| Right | linear-gradient(to left, white, transparent 20px) |

### Expected Outcome
- Horizontal scrollable subcategory navigation
- Pill-style buttons with active state
- Product count badges for each subcategory
- Smooth scroll behavior
- Responsive on all devices

### Verification Checklist
- [ ] `SubcategoryNav.tsx` file created
- [ ] Component accepts subcategories and currentSlug props
- [ ] Subcategory items render correctly
- [ ] Each item links to correct subcategory page
- [ ] Active subcategory highlighted
- [ ] Product counts display (if showCounts true)
- [ ] "View All" link present and functional
- [ ] Horizontal scrolling works smoothly
- [ ] Responsive design on mobile and desktop
- [ ] Hover effects applied
- [ ] Empty state handled (no subcategories)
- [ ] TypeScript interfaces defined
- [ ] Component exports properly

---

## Task 76: Create Category Data Fetcher

### Overview
Create server-side data fetching utilities for category pages. These functions fetch category information, associated products, subcategories, and filter options from the backend API. Implements caching and error handling for optimal performance and reliability.

### Dependencies
- Task 71: Create Category Page Component
- Backend API endpoints for categories and products

### Instructions

1. **Create categories data file**
   - Navigate to `frontend/lib/store/` directory
   - Create `categories.ts` file for category utilities

2. **Define TypeScript interfaces**
   - Create `Category` interface with all category properties
   - Create `CategoryWithProducts` type extending Category
   - Create `CategoryFilters` interface for filter options
   - Create `CategoryParams` for query parameters

3. **Import dependencies**
   - Import fetch or API client utility
   - Import cache utilities (Next.js cache/revalidate)
   - Import type definitions

4. **Create getCategoryBySlug function**
   - Accept slug parameter (string)
   - Fetch category data from `/api/store/categories/{slug}`
   - Return Category object or null if not found
   - Implement error handling with try-catch

5. **Create getCategoryProducts function**
   - Accept categoryId, pagination params, filter params
   - Fetch products from `/api/store/products?category={id}`
   - Include query params: page, limit, sort, filters
   - Return products array and pagination metadata

6. **Create getSubcategories function**
   - Accept parentCategoryId parameter
   - Fetch child categories from `/api/store/categories/{id}/children`
   - Return array of subcategories with product counts
   - Handle empty results gracefully

7. **Create getCategoryFilters function**
   - Accept categoryId parameter
   - Fetch available filters from `/api/store/categories/{id}/filters`
   - Return filter options: price range, brands, attributes
   - Dynamically generate filters based on products

8. **Implement caching strategy**
   - Use Next.js cache() wrapper for data functions
   - Set appropriate revalidate times (e.g., 300 seconds)
   - Tag caches for on-demand revalidation
   - Consider ISR for static category pages

9. **Add error handling**
   - Wrap fetch calls in try-catch blocks
   - Return null or empty arrays on errors
   - Log errors for monitoring
   - Provide fallback data if needed

10. **Create getCategoryBreadcrumbs function**
    - Accept category object with parent hierarchy
    - Build breadcrumb array from category path
    - Include: Home, parent categories, current category
    - Return array of {label, href} objects

11. **Implement search params parsing**
    - Create utility to parse URL search params
    - Extract filters, sort, pagination from query string
    - Validate and sanitize inputs
    - Return typed object for use in fetch functions

12. **Add response type guards**
    - Validate API responses match expected types
    - Check for required fields before returning
    - Throw errors for malformed responses
    - Ensure type safety throughout

### Function Signatures

```typescript
// Get category by slug
getCategoryBySlug(slug: string): Promise<Category | null>

// Get products for category
getCategoryProducts(
  categoryId: string,
  params: {
    page?: number;
    limit?: number;
    sort?: SortOption;
    filters?: FilterState;
  }
): Promise<{
  products: Product[];
  pagination: PaginationData;
}>

// Get subcategories
getSubcategories(
  parentId: string
): Promise<Subcategory[]>

// Get filter options
getCategoryFilters(
  categoryId: string
): Promise<FilterOptions>

// Build breadcrumbs
getCategoryBreadcrumbs(
  category: Category
): Breadcrumb[]
```

### API Endpoints

| Function | Endpoint | Method |
|----------|----------|--------|
| getCategoryBySlug | `/api/store/categories/{slug}` | GET |
| getCategoryProducts | `/api/store/products?category={id}` | GET |
| getSubcategories | `/api/store/categories/{id}/children` | GET |
| getCategoryFilters | `/api/store/categories/{id}/filters` | GET |

### Query Parameters

| Parameter | Type | Example | Purpose |
|-----------|------|---------|---------|
| page | number | `?page=2` | Pagination |
| limit | number | `?limit=24` | Items per page |
| sort | string | `?sort=price_asc` | Sort order |
| filters | object | `?brand=apple&price_min=100` | Filtering |

### Caching Strategy

| Data Type | Revalidate | Strategy |
|-----------|------------|----------|
| Category Info | 600s (10 min) | ISR |
| Products | 300s (5 min) | ISR |
| Subcategories | 600s (10 min) | ISR |
| Filters | 300s (5 min) | On-demand |

### Error Handling

| Error Type | Response | User Impact |
|------------|----------|-------------|
| Network Error | Return null/empty | Show error message |
| 404 Not Found | Return null | Show 404 page |
| 500 Server Error | Return null | Show error message |
| Invalid Data | Throw error | Error boundary catches |

### Data Transformation

| Source Field | Transformed Field | Reason |
|--------------|-------------------|--------|
| created_at | createdAt | CamelCase convention |
| banner_url | bannerUrl | CamelCase convention |
| product_count | productCount | CamelCase convention |
| parent_id | parentId | CamelCase convention |

### Expected Outcome
- Complete data fetching utilities for categories
- Proper error handling and fallbacks
- Caching implemented for performance
- Type-safe functions with TypeScript
- Reusable across category pages

### Verification Checklist
- [ ] `frontend/lib/store/categories.ts` file created
- [ ] getCategoryBySlug function implemented
- [ ] getCategoryProducts function implemented
- [ ] getSubcategories function implemented
- [ ] getCategoryFilters function implemented
- [ ] getCategoryBreadcrumbs function implemented
- [ ] All functions have proper TypeScript types
- [ ] Error handling implemented with try-catch
- [ ] Caching strategy applied (Next.js cache/revalidate)
- [ ] Query parameter parsing utility created
- [ ] API response validation implemented
- [ ] Functions tested with valid category slugs
- [ ] Functions handle errors gracefully
- [ ] Data transformation applied (snake_case to camelCase)

---

## Task 77: Create Category SEO Meta

### Overview
Create dynamic SEO metadata for category pages including title tags, meta descriptions, Open Graph tags, and canonical URLs. Implement structured data (JSON-LD) for better search engine understanding and rich search results.

### Dependencies
- Task 71: Create Category Page Component
- Task 76: Create Category Data Fetcher

### Instructions

1. **Create category metadata function**
   - Add function in `frontend/app/(storefront)/products/category/[slug]/page.tsx`
   - Export async function `generateMetadata`
   - Accept params object with slug
   - Fetch category data using getCategoryBySlug

2. **Define metadata interface**
   - Create `CategoryMetadata` interface
   - Include: title, description, keywords, openGraph, twitter
   - Add structured data fields

3. **Generate page title**
   - Format: "{Category Name} | {Site Name}"
   - Example: "Smartphones | LankaCommerce"
   - Keep under 60 characters
   - Include product count if significant

4. **Generate meta description**
   - Use category description (first 155 characters)
   - Fallback: "Browse {category} products. {product count} items available."
   - Include key category attributes if applicable
   - Keep under 160 characters

5. **Create Open Graph meta tags**
   - og:title: Same as page title
   - og:description: Same as meta description
   - og:image: Category banner image URL
   - og:url: Canonical category page URL
   - og:type: "website"

6. **Create Twitter Card meta tags**
   - twitter:card: "summary_large_image"
   - twitter:title: Same as page title
   - twitter:description: Same as meta description
   - twitter:image: Category banner image URL

7. **Set canonical URL**
   - Generate canonical URL: `{site_url}/products/category/{slug}`
   - Remove query parameters for canonical
   - Ensure HTTPS in production

8. **Add keywords meta tag (optional)**
   - Generate from category name and attributes
   - Include: category name, parent category, product types
   - Comma-separated list

9. **Create structured data (JSON-LD)**
   - Use CollectionPage schema
   - Include: name, description, url, numberOfItems
   - Add breadcrumb structured data
   - Include in page HTML via script tag

10. **Generate breadcrumb structured data**
    - Use BreadcrumbList schema
    - Include all parent categories
    - Add position and item properties
    - Link to each level

11. **Add robots meta tag**
    - Set to "index, follow" for active categories
    - Set to "noindex" for empty or inactive categories
    - Respect site-wide robots.txt settings

12. **Implement alternate language tags (if multi-language)**
    - Add hreflang tags for each language
    - Link to translated category pages
    - Include x-default for fallback

### Metadata Function Structure

```typescript
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  // Fetch category data
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found'
    };
  }
  
  // Generate metadata
  return {
    title: `${category.name} | LankaCommerce`,
    description: category.description || `Browse ${category.name} products`,
    openGraph: { /* OG tags */ },
    twitter: { /* Twitter tags */ },
    // ... more metadata
  };
}
```

### Title Formats

| Category Type | Title Format | Example |
|---------------|--------------|---------|
| Top-Level | {Name} \| {Site} | "Electronics \| LankaCommerce" |
| Subcategory | {Name} - {Parent} \| {Site} | "Smartphones - Electronics \| LankaCommerce" |
| With Count | {Name} ({Count}) \| {Site} | "Smartphones (156) \| LankaCommerce" |

### Open Graph Properties

| Property | Source | Example |
|----------|--------|---------|
| og:title | Category name + site | "Smartphones \| LankaCommerce" |
| og:description | Category description | "Browse latest smartphones..." |
| og:image | Category banner | "https://cdn.../smartphones.jpg" |
| og:url | Canonical URL | "https://site.com/products/category/smartphones" |
| og:type | Static | "website" |

### Structured Data Schema (CollectionPage)

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Smartphones",
  "description": "Browse our collection of smartphones",
  "url": "https://site.com/products/category/smartphones",
  "numberOfItems": 156,
  "about": {
    "@type": "Thing",
    "name": "Smartphones"
  }
}
```

### Breadcrumb Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://site.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Electronics",
      "item": "https://site.com/products/category/electronics"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Smartphones",
      "item": "https://site.com/products/category/smartphones"
    }
  ]
}
```

### Meta Tags Summary

| Tag | Purpose | Character Limit |
|-----|---------|-----------------|
| title | Browser tab, search results | 50-60 chars |
| description | Search result snippet | 150-160 chars |
| keywords | (Optional) Search hints | 10-15 keywords |
| og:title | Social media title | 60 chars |
| og:description | Social media description | 160 chars |
| og:image | Social media image | 1200x630px recommended |

### Robots Meta Values

| Scenario | Value | Reason |
|----------|-------|--------|
| Active category | index, follow | Allow indexing |
| Empty category | noindex, follow | Hide empty pages |
| Filtered view | noindex, follow | Avoid duplicate content |
| Private category | noindex, nofollow | Restricted access |

### Expected Outcome
- Complete SEO metadata for category pages
- Dynamic title and description generation
- Open Graph and Twitter Card tags
- Structured data for rich search results
- Proper canonical URLs

### Verification Checklist
- [ ] generateMetadata function created in category page
- [ ] Function fetches category data correctly
- [ ] Page title generated with proper format
- [ ] Meta description generated (under 160 chars)
- [ ] Open Graph tags included (title, description, image, url)
- [ ] Twitter Card tags included
- [ ] Canonical URL set correctly
- [ ] Structured data (CollectionPage) implemented
- [ ] Breadcrumb structured data implemented
- [ ] Robots meta tag configured appropriately
- [ ] Metadata validates in search console tools
- [ ] Social media preview shows correct image and text
- [ ] Rich results appear in search results (may take time)

---

## Summary

This document established the category page infrastructure, including the main page component, header with banner and description, subcategory navigation, data fetching utilities, and comprehensive SEO metadata. These elements provide a complete category browsing experience with proper organization, navigation, and discoverability.

### Completed Tasks
1. ✓ Created CategoryPage component with layout and filters
2. ✓ Created CategoryHeader with banner and breadcrumbs
3. ✓ Created CategoryBanner with image optimization and fallbacks
4. ✓ Created CategoryDescription with expand/collapse
5. ✓ Created SubcategoryNav with horizontal scroll
6. ✓ Created category data fetching utilities with caching
7. ✓ Created category SEO metadata with structured data

### Next Steps
Proceed to [02_Tasks-78-84_Collection-Page-Verify.md](02_Tasks-78-84_Collection-Page-Verify.md) to create collection pages, featured collections section, and verify the complete category/collection implementation.
