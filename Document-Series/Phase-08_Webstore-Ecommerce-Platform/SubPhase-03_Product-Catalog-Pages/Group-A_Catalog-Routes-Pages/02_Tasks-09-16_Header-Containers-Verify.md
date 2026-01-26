# Tasks 09-16: Catalog Header, Containers & Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** A - Catalog Routes & Pages  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Routes-Layout-Page.md](01_Tasks-01-08_Routes-Layout-Page.md)

---

## Document Overview

This document covers the creation of catalog header components including breadcrumbs, title, and product count display, along with the main content containers (sidebar and grid). It concludes with comprehensive verification of the complete route structure. These components establish the visual hierarchy and layout structure for all product catalog pages.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create Catalog Header | Low | 20 min |
| 10 | Create Breadcrumb Component | Low | 25 min |
| 11 | Create Catalog Title | Low | 15 min |
| 12 | Create Product Count Display | Low | 15 min |
| 13 | Create Catalog Main Content | Low | 20 min |
| 14 | Create Sidebar Container | Low | 20 min |
| 15 | Create Grid Container | Low | 20 min |
| 16 | Verify Route Structure | Low | 25 min |

---

## Task 09: Create Catalog Header

### Overview
Create the CatalogHeader component that serves as the top section of all catalog pages. This component wraps the breadcrumb navigation, page title, and product count display in a cohesive header structure with proper spacing and hierarchy.

### Dependencies
- Task 08: Create Catalog Page Component

### Instructions

1. **Create CatalogHeader component file**
   - Navigate to `frontend/components/storefront/catalog/` directory
   - Create new file named `CatalogHeader.tsx`
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CatalogHeaderProps` interface
   - Include breadcrumb data (crumbs array)
   - Include title (string)
   - Include productCount (number or undefined)
   - Include optional className prop

3. **Import required dependencies**
   - Import React and ReactNode types
   - Import child components (Breadcrumb, CatalogTitle, ProductCount)
   - Import utility functions (cn for class merging)

4. **Create header container structure**
   - Create main container div with proper spacing
   - Use semantic HTML (header or section element)
   - Apply responsive padding and margins

5. **Arrange header sections**
   - Top section: Breadcrumb navigation
   - Middle section: Page title with CatalogTitle
   - Bottom section: ProductCount display (conditional)

6. **Apply header styling**
   - Add bottom border for visual separation
   - Set background color (bg-white or transparent)
   - Apply padding (py-6 md:py-8)
   - Set proper spacing between sections

7. **Implement responsive behavior**
   - Adjust padding for mobile vs desktop
   - Stack elements vertically on small screens
   - Consider horizontal layout on larger screens for title/count

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| breadcrumbs | Breadcrumb[] | Yes | - | Navigation path items |
| title | string | Yes | - | Page heading text |
| productCount | number \| undefined | No | undefined | Total product count |
| className | string | No | "" | Additional CSS classes |

### Breadcrumb Interface

| Field | Type | Description |
|-------|------|-------------|
| label | string | Display text |
| href | string \| undefined | Link destination |
| current | boolean | Is current page |

### Header Structure

```
┌─────────────────────────────────────────┐
│ Home > Products > Category              │ ← Breadcrumb
│                                         │
│ Electronic Accessories                  │ ← Title
│ 124 products found                      │ ← Count
└─────────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `border-b pb-6 mb-8` | Separation from content |
| Breadcrumb Section | `mb-4` | Spacing below breadcrumb |
| Title Section | `mb-2` | Spacing below title |
| Count Section | `text-gray-600` | Visual hierarchy |

### Responsive Layout

```
Mobile (< 768px)
├── Padding: py-4 px-4
├── Breadcrumb: Full width
├── Title: Full width, text-2xl
└── Count: Full width, text-sm

Desktop (≥ 768px)
├── Padding: py-6 px-0
├── Breadcrumb: Full width
├── Title + Count: Flex row with space-between
└── Font sizes: Larger
```

### Expected Outcome
- Functional header component for catalog pages
- Clean visual hierarchy (breadcrumb → title → count)
- Proper spacing and responsive behavior
- Ready to receive breadcrumb and title data

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/CatalogHeader.tsx` file created
- [ ] Component accepts all required props
- [ ] Breadcrumb, title, and count sections rendered
- [ ] Proper spacing between sections
- [ ] Border separation from content below
- [ ] Responsive on mobile and desktop
- [ ] TypeScript types defined correctly
- [ ] Component exports properly

---

## Task 10: Create Breadcrumb Component

### Overview
Create the Breadcrumb component that displays hierarchical navigation showing the user's current location within the site structure. This component renders a trail of links from the homepage to the current page, improving navigation and user orientation.

### Dependencies
- Task 09: Create Catalog Header

### Instructions

1. **Create Breadcrumb component file**
   - Create `Breadcrumb.tsx` in `components/storefront/catalog/` directory
   - Set up React functional component structure

2. **Define breadcrumb data interface**
   - Create `BreadcrumbItem` interface
   - Include label (string)
   - Include href (string or undefined for current page)
   - Include current (boolean) to mark active item

3. **Define component props**
   - Create `BreadcrumbProps` interface
   - Accept items array of BreadcrumbItem
   - Include optional className prop
   - Include optional separator prop (custom separator character)

4. **Import required dependencies**
   - Import Next.js Link component
   - Import icon library (ChevronRight or similar)
   - Import cn utility for class merging

5. **Implement breadcrumb list structure**
   - Use semantic HTML (nav with aria-label="Breadcrumb")
   - Create ordered list (ol) for items
   - Each item in list item (li) element

6. **Render breadcrumb items**
   - Map through items array
   - For non-current items: render as Link
   - For current item: render as plain text (no link)
   - Add separator between items (not after last)

7. **Apply styling**
   - Use text-sm for readable size
   - Apply text-gray-600 for links
   - Apply text-gray-900 for current item
   - Add hover effects (hover:text-blue-600)

8. **Add accessibility features**
   - Use aria-current="page" for current item
   - Ensure proper semantic structure
   - Add sr-only text for separators

9. **Implement separator logic**
   - Use ChevronRight icon or "/" character
   - Display separator between items only
   - Style separator with text-gray-400

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| items | BreadcrumbItem[] | Yes | - | Navigation items |
| separator | ReactNode | No | ChevronRight | Custom separator |
| className | string | No | "" | Additional classes |

### BreadcrumbItem Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| label | string | Yes | Display text |
| href | string \| undefined | No | Link destination |
| current | boolean | Yes | Current page marker |

### Breadcrumb Examples

```
All Products Page:
Home > Products

Category Page:
Home > Products > Electronics

Subcategory Page:
Home > Products > Electronics > Laptops

Collection Page:
Home > Products > Summer Collection
```

### Breadcrumb Structure

```
┌──────────────────────────────────────────┐
│ Home > Products > Category > Item        │
│  ^      ^          ^          ^          │
│ Link   Link       Link      Current      │
└──────────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Nav | `text-sm` | Readable size |
| List | `flex flex-wrap items-center gap-2` | Horizontal layout |
| Link | `text-gray-600 hover:text-blue-600 transition` | Interactive |
| Current | `text-gray-900 font-medium` | Emphasis |
| Separator | `text-gray-400` | Subtle division |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Semantic Nav | `<nav aria-label="Breadcrumb">` |
| Ordered List | `<ol>` for sequence |
| Current Page | `aria-current="page"` |
| Screen Reader | Descriptive link text |

### Breadcrumb Data Generation

| Page Type | Breadcrumb Structure |
|-----------|---------------------|
| All Products | Home → Products |
| Category | Home → Products → Category Name |
| Subcategory | Home → Products → Parent → Child |
| Collection | Home → Products → Collection Name |
| Search | Home → Products → Search Results |

### Expected Outcome
- Functional breadcrumb navigation component
- Hierarchical path display from home to current page
- Proper link styling with hover effects
- Accessible markup with ARIA attributes

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Breadcrumb.tsx` file created
- [ ] Component accepts items array prop
- [ ] Breadcrumb items render correctly
- [ ] Links work for non-current items
- [ ] Current item displayed without link
- [ ] Separators displayed between items
- [ ] Hover effects on links
- [ ] Accessible markup (nav, aria-label, aria-current)
- [ ] Responsive text wrapping
- [ ] Component exports properly

---

## Task 11: Create Catalog Title

### Overview
Create the CatalogTitle component that displays the main heading for catalog pages. This component renders a prominent title with appropriate semantic HTML and styling, serving as the primary heading that describes the current catalog view (all products, category name, or collection name).

### Dependencies
- Task 09: Create Catalog Header

### Instructions

1. **Create CatalogTitle component file**
   - Create `CatalogTitle.tsx` in `components/storefront/catalog/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CatalogTitleProps` interface
   - Include title (string, required)
   - Include optional as prop for heading level (h1, h2)
   - Include optional className prop

3. **Import required dependencies**
   - Import React types
   - Import cn utility for class merging

4. **Implement dynamic heading element**
   - Accept heading level through props (h1 or h2)
   - Default to h1 for SEO optimization
   - Use React.createElement or conditional rendering

5. **Apply title styling**
   - Use large font size (text-3xl or text-4xl)
   - Apply font weight (font-bold)
   - Set text color (text-gray-900)
   - Add responsive sizing (smaller on mobile)

6. **Add responsive behavior**
   - Mobile: text-2xl
   - Tablet: text-3xl
   - Desktop: text-4xl

7. **Support className merging**
   - Allow custom classes via props
   - Merge with default classes using cn utility
   - Ensure custom classes don't override critical styles

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | Yes | - | Heading text content |
| as | "h1" \| "h2" | No | "h1" | Heading element type |
| className | string | No | "" | Additional CSS classes |

### Title Examples by Page Type

| Page Type | Title Example |
|-----------|---------------|
| All Products | "All Products" |
| Category | "Electronics" |
| Subcategory | "Laptop Computers" |
| Collection | "Summer Sale Collection" |
| Brand | "Apple Products" |
| Search | "Search Results for 'laptop'" |

### Typography Scale

| Screen Size | Font Size Class | Actual Size |
|-------------|----------------|-------------|
| Mobile | `text-2xl` | 24px |
| Tablet | `text-3xl` | 30px |
| Desktop | `text-4xl` | 36px |

### Title Styling

```
┌────────────────────────────────┐
│                                │
│  Electronic Accessories        │ ← text-3xl md:text-4xl
│                                │   font-bold text-gray-900
│                                │
└────────────────────────────────┘
```

### Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Font Size | `text-2xl md:text-3xl lg:text-4xl` | Responsive sizing |
| Font Weight | `font-bold` | Prominence |
| Text Color | `text-gray-900` | High contrast |
| Line Height | `leading-tight` | Compact spacing |

### Semantic HTML Usage

| Scenario | Element | Reason |
|----------|---------|--------|
| Main Page Title | `<h1>` | Primary heading, one per page |
| Section Title | `<h2>` | Secondary heading |
| SEO | `<h1>` preferred | Search engine optimization |

### Expected Outcome
- Clean, prominent title component
- Flexible heading level (h1 or h2)
- Responsive typography scaling
- Proper semantic HTML structure

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/CatalogTitle.tsx` file created
- [ ] Component accepts title prop
- [ ] Heading level configurable (h1 or h2)
- [ ] Default heading level is h1
- [ ] Responsive font sizing applied
- [ ] Bold font weight applied
- [ ] Proper text color (high contrast)
- [ ] className prop supported
- [ ] Component exports properly

---

## Task 12: Create Product Count Display

### Overview
Create the ProductCount component that displays the total number of products found in the current catalog view. This component provides users with quick feedback about result quantities, enhancing transparency and setting expectations for browsing.

### Dependencies
- Task 08: Create Catalog Page Component

### Instructions

1. **Create ProductCount component file**
   - Create `ProductCount.tsx` in `components/storefront/catalog/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `ProductCountProps` interface
   - Include count (number or undefined)
   - Include optional isLoading (boolean)
   - Include optional className prop

3. **Implement count display logic**
   - Check if count is defined
   - Handle singular vs plural ("product" vs "products")
   - Return null if count is undefined and not loading

4. **Format count display text**
   - Format: "{count} products found" or "{count} product found"
   - Use number formatting for large counts (e.g., 1,234)
   - Consider locale-specific formatting

5. **Add loading state**
   - Display skeleton or placeholder when loading
   - Show animated shimmer effect
   - Match width of expected count text

6. **Apply styling**
   - Use smaller text size (text-sm or text-base)
   - Apply gray color (text-gray-600)
   - Add subtle styling to differentiate from title

7. **Add optional filtering context**
   - Consider showing "Showing X of Y" when filters applied
   - Display "No products found" for zero count
   - Add clear filters option for zero results

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| count | number \| undefined | No | undefined | Product count |
| isLoading | boolean | No | false | Loading state |
| className | string | No | "" | Additional classes |

### Count Display Formats

| Scenario | Display Text |
|----------|-------------|
| Single product | "1 product found" |
| Multiple products | "124 products found" |
| Large count | "1,234 products found" |
| Zero products | "No products found" |
| Loading | "Loading..." or skeleton |
| Undefined | Component hidden |

### Count Display Examples

```
With Filters:
"Showing 23 of 124 products"

Without Filters:
"124 products found"

No Results:
"No products found matching your criteria"
"Clear all filters"
```

### Component States

| State | Display | Styling |
|-------|---------|---------|
| Normal | "{count} products found" | text-gray-600 |
| Loading | Skeleton shimmer | bg-gray-200 animate-pulse |
| Zero | "No products found" | text-gray-500 |
| Error | Not displayed | - |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `text-sm md:text-base` | Readable size |
| Text | `text-gray-600` | Subtle hierarchy |
| Zero State | `text-gray-500 italic` | Differentiation |
| Loading | `h-5 w-32 bg-gray-200 rounded animate-pulse` | Skeleton |

### Number Formatting

| Count | Formatted | Method |
|-------|-----------|--------|
| 5 | "5" | Direct |
| 124 | "124" | Direct |
| 1234 | "1,234" | toLocaleString() |
| 10000 | "10,000" | toLocaleString() |

### Expected Outcome
- Clean product count display component
- Proper singular/plural handling
- Number formatting for readability
- Loading state with skeleton

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/ProductCount.tsx` file created
- [ ] Component accepts count prop
- [ ] Singular/plural handling implemented
- [ ] Number formatting applied for large counts
- [ ] Loading state with skeleton
- [ ] Returns null when count is undefined
- [ ] Proper text styling and size
- [ ] Component exports properly

---

## Task 13: Create Catalog Main Content

### Overview
Create the CatalogContent component that serves as the main container for catalog pages, organizing the layout into a two-column structure with a sidebar for filters and a grid area for product cards. This component manages the responsive layout behavior and children placement.

### Dependencies
- Task 08: Create Catalog Page Component

### Instructions

1. **Create CatalogContent component file**
   - Create `CatalogContent.tsx` in `components/storefront/catalog/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CatalogContentProps` interface
   - Include sidebar (ReactNode) for filter components
   - Include children (ReactNode) for product grid
   - Include optional className prop
   - Include optional hideSidebar (boolean) for mobile control

3. **Import required dependencies**
   - Import React and ReactNode types
   - Import cn utility for class merging

4. **Create two-column layout structure**
   - Use CSS Grid or Flexbox for layout
   - Define sidebar column (fixed or flexible width)
   - Define main content column (remaining space)

5. **Implement sidebar container**
   - Fixed width on desktop (e.g., 280px or 300px)
   - Hidden by default on mobile
   - Toggle visibility with mobile filter button

6. **Implement main content area**
   - Flexible width to fill remaining space
   - Contains product grid (passed as children)
   - Full width on mobile when sidebar hidden

7. **Add responsive behavior**
   - Mobile (< 1024px): Stack vertically or hide sidebar
   - Desktop (≥ 1024px): Two-column side-by-side layout
   - Consider sidebar toggle for mobile

8. **Apply spacing and gaps**
   - Add gap between sidebar and content (gap-6 or gap-8)
   - Apply padding to main container
   - Ensure proper alignment

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| sidebar | ReactNode | Yes | - | Filter components |
| children | ReactNode | Yes | - | Product grid |
| hideSidebar | boolean | No | false | Hide sidebar on mobile |
| className | string | No | "" | Additional classes |

### Layout Structure

```
Desktop (≥ 1024px):
┌──────────────────────────────────────┐
│ ┌─────────┐  ┌──────────────────┐   │
│ │         │  │                  │   │
│ │ Sidebar │  │   Product Grid   │   │
│ │ (280px) │  │   (Flexible)     │   │
│ │         │  │                  │   │
│ └─────────┘  └──────────────────┘   │
└──────────────────────────────────────┘

Mobile (< 1024px):
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │       Product Grid               │ │
│ │       (Full Width)               │ │
│ │                                  │ │
│ └──────────────────────────────────┘ │
│                                      │
│ (Sidebar in mobile drawer/modal)    │
└──────────────────────────────────────┘
```

### Grid Layout Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Display | `grid lg:grid-cols-[280px_1fr]` | Two-column layout |
| Gap | `gap-6 lg:gap-8` | Spacing between columns |
| Sidebar Width | `280px` (fixed on desktop) | Consistent filter area |
| Content Width | `1fr` (flexible) | Remaining space |

### Responsive Behavior

```
Mobile (< 768px)
├── Layout: Single column
├── Sidebar: Hidden (drawer/modal)
└── Content: Full width

Tablet (768px - 1023px)
├── Layout: Single column
├── Sidebar: Collapsible
└── Content: Full width

Desktop (≥ 1024px)
├── Layout: Two columns
├── Sidebar: Visible (280px)
└── Content: Flexible width
```

### Sidebar Visibility Options

| Approach | Description | Use Case |
|----------|-------------|----------|
| Hidden | Sidebar completely hidden on mobile | Clean mobile experience |
| Drawer | Sidebar in slide-out drawer | Access filters when needed |
| Collapsible | Accordion-style filters | Keep filters visible but compact |
| Modal | Full-screen filter overlay | Dedicated filtering experience |

### Expected Outcome
- Responsive two-column layout component
- Sidebar for filters (280px on desktop)
- Main content area for product grid
- Mobile-friendly stacking or drawer behavior

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/CatalogContent.tsx` file created
- [ ] Component accepts sidebar and children props
- [ ] Two-column layout on desktop
- [ ] Single-column layout on mobile
- [ ] Proper gap between columns
- [ ] Sidebar width fixed at 280px on desktop
- [ ] Content area fills remaining space
- [ ] Component exports properly

---

## Task 14: Create Sidebar Container

### Overview
Create the SidebarContainer component that wraps filter components in the catalog sidebar. This component provides consistent styling, spacing, and structure for filter groups, search inputs, and other sidebar content, with support for collapsible sections.

### Dependencies
- Task 13: Create Catalog Main Content

### Instructions

1. **Create SidebarContainer component file**
   - Create `SidebarContainer.tsx` in `components/storefront/catalog/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `SidebarContainerProps` interface
   - Include children (ReactNode) for filter content
   - Include optional title (string) for section heading
   - Include optional className prop
   - Include optional collapsible (boolean)

3. **Implement container structure**
   - Create main wrapper div with proper styling
   - Add optional title/heading section
   - Include content area for children

4. **Apply sidebar styling**
   - Set background color (bg-white or bg-gray-50)
   - Add border or shadow for definition
   - Apply padding (p-4 or p-6)
   - Add border radius (rounded-lg)

5. **Add sticky positioning (optional)**
   - Consider sticky positioning for desktop
   - Set top offset for header clearance
   - Ensure sidebar stays visible during scroll

6. **Implement collapsible behavior (optional)**
   - Add collapse/expand toggle button
   - Manage collapsed state with useState
   - Animate height transition

7. **Add mobile drawer support**
   - Prepare for drawer/modal integration
   - Add close button for mobile view
   - Ensure proper z-index layering

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Filter components |
| title | string | No | undefined | Section heading |
| collapsible | boolean | No | false | Enable collapse |
| className | string | No | "" | Additional classes |

### Sidebar Sections

| Section | Content | Typical Components |
|---------|---------|-------------------|
| Search | Product search input | SearchInput |
| Categories | Category filter checkboxes | FilterGroup |
| Price Range | Price slider/inputs | PriceRange |
| Brands | Brand filter checkboxes | FilterGroup |
| Attributes | Product attribute filters | FilterGroup |

### Container Structure

```
┌─────────────────────────┐
│  Filters                │ ← Optional title
│  ─────────────────────  │
│                         │
│  ┌───────────────────┐ │
│  │   Filter Group 1  │ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │   Filter Group 2  │ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │   Filter Group 3  │ │
│  └───────────────────┘ │
│                         │
└─────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `bg-white border rounded-lg` | Card appearance |
| Padding | `p-4 lg:p-6` | Internal spacing |
| Title | `text-lg font-semibold mb-4` | Section heading |
| Content | `space-y-6` | Spacing between groups |
| Mobile | `fixed inset-0 z-50 lg:relative` | Drawer on mobile |

### Sticky Positioning

| Property | Value | Purpose |
|----------|-------|---------|
| Position | `lg:sticky` | Stick on desktop only |
| Top | `top-24` | Below header |
| Max Height | `max-h-[calc(100vh-120px)]` | Prevent overflow |
| Overflow | `overflow-y-auto` | Scrollable content |

### Mobile Drawer Behavior

```
Mobile View:
┌────────────────────────────────┐
│ [×]  Filters                   │ ← Close button
│ ────────────────────────────── │
│                                │
│ Filter Groups...               │
│                                │
│ ────────────────────────────── │
│ [Apply Filters] [Clear All]    │ ← Actions
└────────────────────────────────┘
    ↑ Overlay background
```

### Expected Outcome
- Consistent sidebar container for filters
- Optional section title/heading
- Proper spacing and styling
- Optional sticky positioning on desktop
- Mobile-ready structure

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/SidebarContainer.tsx` file created
- [ ] Component accepts children prop
- [ ] Optional title prop supported
- [ ] Proper padding and spacing applied
- [ ] Border or shadow for definition
- [ ] Background color applied
- [ ] Sticky positioning on desktop (optional)
- [ ] Mobile-friendly structure
- [ ] Component exports properly

---

## Task 15: Create Grid Container

### Overview
Create the GridContainer component that wraps the product card grid in the catalog content area. This component provides responsive grid layout, handles empty states, manages grid density, and ensures optimal card arrangement across different screen sizes.

### Dependencies
- Task 13: Create Catalog Main Content

### Instructions

1. **Create GridContainer component file**
   - Create `GridContainer.tsx` in `components/storefront/catalog/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `GridContainerProps` interface
   - Include children (ReactNode) for product cards
   - Include optional isEmpty (boolean) for empty state
   - Include optional emptyMessage (string)
   - Include optional className prop
   - Include optional columns (object) for column control

3. **Implement responsive grid layout**
   - Use CSS Grid for card arrangement
   - Define column counts per breakpoint
   - Set appropriate gap between cards

4. **Configure grid columns**
   - Mobile (< 640px): 1 or 2 columns
   - Tablet (640px - 1024px): 2 or 3 columns
   - Desktop (≥ 1024px): 3 or 4 columns
   - Large Desktop (≥ 1536px): 4 or 5 columns

5. **Handle empty state**
   - Check if isEmpty prop is true
   - Display empty message or illustration
   - Show "Browse all products" or "Clear filters" action
   - Return null if no message and empty

6. **Apply grid styling**
   - Set grid display (grid)
   - Configure columns (grid-cols-X)
   - Set gap (gap-4 to gap-6)
   - Ensure cards fill grid evenly

7. **Add loading state support**
   - Accept loading skeleton cards as children
   - Maintain grid layout during loading
   - Show appropriate number of skeleton cards

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Product cards |
| isEmpty | boolean | No | false | Empty state flag |
| emptyMessage | string | No | "No products found" | Empty message text |
| columns | ColumnConfig | No | Default grid | Custom column config |
| className | string | No | "" | Additional classes |

### Grid Column Configuration

| Screen Size | Breakpoint | Columns | Tailwind Class |
|-------------|-----------|---------|----------------|
| Mobile | < 640px | 1-2 | `grid-cols-1 sm:grid-cols-2` |
| Tablet | 640px - 1024px | 2-3 | `sm:grid-cols-2 md:grid-cols-3` |
| Desktop | 1024px - 1536px | 3-4 | `lg:grid-cols-3 xl:grid-cols-4` |
| Large Desktop | ≥ 1536px | 4-5 | `2xl:grid-cols-4` |

### Grid Layout Structure

```
Desktop (4 columns):
┌──────┬──────┬──────┬──────┐
│ Card │ Card │ Card │ Card │
├──────┼──────┼──────┼──────┤
│ Card │ Card │ Card │ Card │
├──────┼──────┼──────┼──────┤
│ Card │ Card │ Card │ Card │
└──────┴──────┴──────┴──────┘

Mobile (2 columns):
┌──────┬──────┐
│ Card │ Card │
├──────┼──────┤
│ Card │ Card │
├──────┼──────┤
│ Card │ Card │
└──────┴──────┘
```

### Grid Spacing

| Element | Spacing | Purpose |
|---------|---------|---------|
| Column Gap | `gap-x-4 lg:gap-x-6` | Horizontal spacing |
| Row Gap | `gap-y-6 lg:gap-y-8` | Vertical spacing |
| Combined | `gap-4 lg:gap-6` | Uniform spacing |

### Empty State Display

```
┌────────────────────────────────┐
│                                │
│         📦                     │
│    No products found           │
│                                │
│    The filters you selected    │
│    didn't match any products.  │
│                                │
│    [Clear All Filters]         │
│    [Browse All Products]       │
│                                │
└────────────────────────────────┘
```

### Empty State Variants

| Scenario | Message | Action |
|----------|---------|--------|
| No results | "No products found" | Clear filters |
| Filtered out | "No products match your filters" | Clear filters |
| Out of stock | "All items currently unavailable" | Notify me |
| Search | "No results for '{query}'" | Browse categories |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` | Responsive columns |
| Gap | `gap-4 lg:gap-6` | Card spacing |
| Empty State | `text-center py-12 px-4` | Centered message |
| Empty Icon | `text-6xl text-gray-400 mb-4` | Visual indicator |

### Expected Outcome
- Responsive grid layout for product cards
- Configurable column counts per breakpoint
- Proper spacing between cards
- Empty state handling with message and actions

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/GridContainer.tsx` file created
- [ ] Component accepts children prop
- [ ] Responsive grid columns configured
- [ ] Proper gap spacing applied
- [ ] Empty state handling implemented
- [ ] Empty message displayed when isEmpty true
- [ ] Grid maintains layout with skeleton cards
- [ ] Works across all screen sizes
- [ ] Component exports properly

---

## Task 16: Verify Route Structure

### Overview
Perform comprehensive verification of the entire catalog route structure, ensuring all routes are properly configured, components are correctly integrated, layouts are functioning, and the complete catalog system is working end-to-end. This task validates all previous tasks in this group.

### Dependencies
- Task 01-15: All previous tasks in this group

### Instructions

1. **Verify directory structure**
   - Navigate to `frontend/app/(storefront)/products/` directory
   - Confirm all route files exist (page.tsx, layout.tsx, loading.tsx, error.tsx)
   - Verify nested routes (category/[slug], collection/[slug])
   - Check components directory structure

2. **Test all products page route**
   - Navigate to `/products` in browser
   - Verify page loads without errors
   - Check layout structure (header, sidebar, grid)
   - Verify breadcrumb shows: Home > Products
   - Confirm title displays: "All Products"

3. **Test category page route**
   - Navigate to `/products/category/[slug]` (e.g., /products/category/electronics)
   - Verify dynamic slug parameter works
   - Check breadcrumb shows: Home > Products > Category Name
   - Confirm title displays category name
   - Verify product count displays

4. **Test collection page route**
   - Navigate to `/products/collection/[slug]` (e.g., /products/collection/summer-sale)
   - Verify dynamic slug parameter works
   - Check breadcrumb shows: Home > Products > Collection Name
   - Confirm title displays collection name

5. **Verify layout hierarchy**
   - Confirm products layout wraps all pages
   - Check sidebar displays on all routes
   - Verify header appears consistently
   - Test responsive layout on mobile/desktop

6. **Test loading states**
   - Implement artificial delay to test loading.tsx
   - Verify skeleton/loading UI displays
   - Confirm smooth transition to loaded content

7. **Test error states**
   - Simulate error conditions (invalid slug, network error)
   - Verify error.tsx boundary catches errors
   - Check error message and retry functionality

8. **Verify component integration**
   - Check CatalogPage renders correctly
   - Verify CatalogHeader with breadcrumbs
   - Confirm CatalogTitle displays properly
   - Test ProductCount shows/hides appropriately
   - Verify CatalogContent two-column layout
   - Check SidebarContainer styling
   - Confirm GridContainer responsive grid

9. **Test responsive behavior**
   - Test on mobile (< 640px)
   - Test on tablet (640px - 1024px)
   - Test on desktop (≥ 1024px)
   - Verify layout adjusts properly
   - Check sidebar visibility/hiding
   - Confirm grid column changes

10. **Verify navigation**
    - Test breadcrumb links navigate correctly
    - Verify all internal links work
    - Check browser back/forward buttons
    - Test direct URL navigation

11. **Check TypeScript compilation**
    - Run TypeScript type checking
    - Verify no type errors in route files
    - Confirm component prop types correct

12. **Review accessibility**
    - Check semantic HTML structure
    - Verify ARIA attributes on breadcrumbs
    - Test keyboard navigation
    - Verify screen reader compatibility

### Verification Checklist

#### Route Structure
- [ ] `frontend/app/(storefront)/products/page.tsx` exists
- [ ] `frontend/app/(storefront)/products/layout.tsx` exists
- [ ] `frontend/app/(storefront)/products/loading.tsx` exists
- [ ] `frontend/app/(storefront)/products/error.tsx` exists
- [ ] `frontend/app/(storefront)/products/category/[slug]/page.tsx` exists
- [ ] `frontend/app/(storefront)/products/collection/[slug]/page.tsx` exists

#### Component Structure
- [ ] `frontend/components/storefront/catalog/CatalogPage.tsx` exists
- [ ] `frontend/components/storefront/catalog/CatalogHeader.tsx` exists
- [ ] `frontend/components/storefront/catalog/CatalogTitle.tsx` exists
- [ ] `frontend/components/storefront/catalog/ProductCount.tsx` exists
- [ ] `frontend/components/storefront/catalog/CatalogContent.tsx` exists
- [ ] `frontend/components/storefront/catalog/Breadcrumb.tsx` exists
- [ ] `frontend/components/storefront/catalog/SidebarContainer.tsx` exists
- [ ] `frontend/components/storefront/catalog/GridContainer.tsx` exists
- [ ] `frontend/components/storefront/catalog/index.ts` exports all components

#### Route Functionality
- [ ] `/products` route loads successfully
- [ ] `/products/category/[slug]` route works with dynamic slug
- [ ] `/products/collection/[slug]` route works with dynamic slug
- [ ] All routes render without errors
- [ ] Dynamic routes handle invalid slugs gracefully

#### Layout Verification
- [ ] Products layout wraps all catalog pages
- [ ] Layout structure consistent across routes
- [ ] Header section displays correctly
- [ ] Main content area renders properly
- [ ] Sidebar and grid layout working

#### Component Integration
- [ ] CatalogHeader renders with breadcrumbs, title, and count
- [ ] Breadcrumb displays correct navigation path
- [ ] CatalogTitle shows appropriate heading
- [ ] ProductCount displays when count provided
- [ ] CatalogContent creates two-column layout
- [ ] SidebarContainer styles sidebar properly
- [ ] GridContainer creates responsive grid

#### Responsive Design
- [ ] Mobile layout (< 640px) works correctly
- [ ] Tablet layout (640px - 1024px) works correctly
- [ ] Desktop layout (≥ 1024px) works correctly
- [ ] Sidebar hides on mobile or in drawer
- [ ] Grid columns adjust per breakpoint
- [ ] Typography scales responsively

#### Loading & Error States
- [ ] Loading.tsx displays during data fetch
- [ ] Loading UI matches layout structure
- [ ] Error.tsx catches and displays errors
- [ ] Error message is user-friendly
- [ ] Retry functionality works (if implemented)

#### Navigation
- [ ] Breadcrumb links navigate correctly
- [ ] Internal links work properly
- [ ] Browser back button works
- [ ] Direct URL navigation works
- [ ] 404 handling for invalid routes (if implemented)

#### TypeScript
- [ ] All files compile without errors
- [ ] Component prop types defined correctly
- [ ] No type warnings in console
- [ ] Imports resolve correctly

#### Accessibility
- [ ] Semantic HTML used (`<nav>`, `<header>`, `<main>`)
- [ ] Breadcrumb has `aria-label="Breadcrumb"`
- [ ] Current breadcrumb has `aria-current="page"`
- [ ] Heading hierarchy proper (h1 → h2 → h3)
- [ ] Focus indicators visible
- [ ] Keyboard navigation works

#### Performance
- [ ] No console errors
- [ ] No console warnings
- [ ] Components render efficiently
- [ ] Layout shift minimal
- [ ] Images optimized (if applicable)

### Route Testing Matrix

| Route | Breadcrumb | Title | Count | Layout |
|-------|------------|-------|-------|--------|
| /products | Home > Products | All Products | Yes | Two-column |
| /products/category/electronics | Home > Products > Electronics | Electronics | Yes | Two-column |
| /products/collection/summer | Home > Products > Summer Collection | Summer Collection | Yes | Two-column |

### Common Issues to Check

| Issue | Location | Solution |
|-------|----------|----------|
| 404 on route | Route file missing | Create page.tsx |
| Layout not applied | Layout.tsx incorrect | Check layout structure |
| Breadcrumb wrong | Breadcrumb data | Update breadcrumb items |
| Sidebar not visible | CSS/responsive | Check grid layout |
| Grid not responsive | GridContainer | Verify breakpoints |
| TypeScript error | Component props | Fix prop types |
| Import error | Export/import | Check index.ts exports |

### Expected Outcome
- All catalog routes functional and accessible
- Complete route structure verified
- Components integrated correctly
- Responsive layouts working across devices
- Loading and error states functioning
- Navigation working smoothly
- No TypeScript or runtime errors
- Accessibility standards met

### Final Verification
- [ ] All 16 tasks in Group A completed
- [ ] All components created and exported
- [ ] All routes tested and working
- [ ] Documentation reviewed
- [ ] Ready to proceed to Group B (Product Grid & Cards)

---

## Summary

This document completed the catalog header components and container structure, providing a comprehensive foundation for product catalog pages. The header system includes breadcrumb navigation, page titles, and product count display, while the content containers establish the two-column layout with sidebar filters and product grid.

### Completed Tasks
1. ✓ Created Catalog Header component with breadcrumb, title, and count sections
2. ✓ Created Breadcrumb component for hierarchical navigation
3. ✓ Created Catalog Title component for page headings
4. ✓ Created Product Count display component
5. ✓ Created Catalog Main Content with two-column layout
6. ✓ Created Sidebar Container for filter components
7. ✓ Created Grid Container for product cards
8. ✓ Verified complete route structure and component integration

### Component Architecture

```
CatalogPage
├── CatalogHeader
│   ├── Breadcrumb
│   ├── CatalogTitle
│   └── ProductCount
└── CatalogContent
    ├── SidebarContainer
    │   └── (Filter components - Group D)
    └── GridContainer
        └── (Product cards - Group B)
```

### Next Steps
Proceed to Group B (Product Grid & Cards) to create product card components, grid layout logic, image displays, pricing components, and interactive elements for the product catalog.
