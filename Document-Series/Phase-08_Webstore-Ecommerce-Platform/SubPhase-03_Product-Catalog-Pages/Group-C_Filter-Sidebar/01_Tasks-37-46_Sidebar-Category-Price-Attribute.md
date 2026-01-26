# Tasks 37-46: Sidebar, Category, Price, and Attribute Filters

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** C - Filter Sidebar  
> **Document:** 01 of 02  
> **Tasks Covered:** 37, 38, 39, 40, 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-47-54_Color-Size-Brand-Availability.md](02_Tasks-47-54_Color-Size-Brand-Availability.md)

---

## Document Overview

This document covers the creation of the filter sidebar foundation with category, price range, and attribute filter sections. It establishes the main filter sidebar component, collapsible filter sections with headers and content areas, category filter with hierarchical checkboxes, price range filter with dual-handle slider and input fields, and the base structure for attribute filters that will be expanded in the next document.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Create Filter Sidebar Component | Medium | 45 min |
| 38 | Create Filter Section Component | Low | 25 min |
| 39 | Create Filter Section Header | Low | 20 min |
| 40 | Create Filter Section Content | Low | 15 min |
| 41 | Create Category Filter | Medium | 40 min |
| 42 | Create Category Checkbox | Low | 20 min |
| 43 | Create Price Range Filter | Medium | 45 min |
| 44 | Create Price Range Slider | Medium | 50 min |
| 45 | Create Price Input Fields | Low | 25 min |
| 46 | Create Attribute Filters | Medium | 35 min |

---

## Task 37: Create Filter Sidebar Component

### Overview
Create the main FilterSidebar component that serves as the container for all product filtering functionality. This sidebar includes a header with "Filters" title and "Clear All" link, collapsible filter sections, and on mobile devices transforms into a drawer. The component manages filter state through URL search parameters for shareable filtered URLs.

### Dependencies
- Task 16: Create Catalog Page Layout
- SubPhase-02 (Product List State Management)
- Phase-07 SubPhase-03 (Base UI Components)

### Instructions

1. **Create filters directory structure**
   - Navigate to `frontend/components/storefront/catalog/` directory
   - Create new directory named `Filters`
   - This will house all filter-related components

2. **Create FilterSidebar component file**
   - Create `FilterSidebar.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure
   - Import necessary dependencies (React, Next.js router, state hooks)

3. **Define component props interface**
   - Create `FilterSidebarProps` interface
   - Include `categories` prop (array of category objects with hierarchy)
   - Include `priceRange` prop (object with min and max values)
   - Include `availableFilters` prop (object containing all filterable attributes)
   - Include optional `isMobile` prop for responsive behavior

4. **Set up filter state management**
   - Use URL search parameters for filter persistence
   - Import and use `useSearchParams` from Next.js
   - Create state for temporary filter selections before apply
   - Track which filter sections are expanded/collapsed

5. **Implement sidebar container structure**
   - Create main container div with proper dimensions
   - Set width for desktop (w-64 to w-80)
   - Add sticky positioning for scroll behavior
   - Prepare for mobile drawer transformation

6. **Create sidebar header section**
   - Add "Filters" heading with proper typography
   - Include "Clear All" button/link aligned to right
   - Implement clear all functionality to reset URL params
   - Style header with border bottom separator

7. **Add filter sections container**
   - Create scrollable container for filter sections
   - Set max-height for scroll behavior
   - Add padding for internal spacing
   - Prepare slots for filter section components

8. **Implement mobile drawer logic**
   - Detect mobile viewport using media query or prop
   - Transform sidebar into overlay drawer on mobile
   - Add slide-in animation from left or bottom
   - Include close button for mobile drawer
   - Add backdrop overlay when drawer is open

9. **Create apply filters button (mobile)**
   - Add sticky footer button for mobile view
   - Button triggers URL parameter update
   - Style as primary CTA button
   - Include loading state during filter application

10. **Add responsive behavior**
    - Hide sidebar on mobile by default
    - Show via drawer when filter button clicked
    - Always visible on tablet and desktop
    - Adjust spacing for different screen sizes

### Sidebar Layout Structure

```
┌─────────────────────────────┐
│ Filters          Clear All  │ ← Header
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐│
│ │  Category Filter        ││
│ └─────────────────────────┘│
│                             │
│ ┌─────────────────────────┐│
│ │  Price Range Filter     ││ ← Scrollable
│ └─────────────────────────┘│   Section
│                             │
│ ┌─────────────────────────┐│
│ │  Attribute Filters      ││
│ └─────────────────────────┘│
│                             │
├─────────────────────────────┤
│     [Apply Filters]         │ ← Mobile Footer
└─────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| categories | Category[] | Yes | Hierarchical category structure |
| priceRange | {min: number, max: number} | Yes | Available price range |
| availableFilters | FilterOptions | Yes | All filterable attributes |
| isMobile | boolean | No | Mobile drawer mode |
| onClose | () => void | No | Close handler for mobile |

### Sidebar Sections

| Section | Component | Collapsible | Default State |
|---------|-----------|-------------|---------------|
| Category | CategoryFilter | Yes | Expanded |
| Price Range | PriceRangeFilter | Yes | Expanded |
| Color | ColorFilter | Yes | Expanded |
| Size | SizeFilter | Yes | Collapsed |
| Brand | BrandFilter | Yes | Collapsed |
| Availability | AvailabilityFilter | Yes | Collapsed |

### Mobile Drawer Behavior

```
Desktop/Tablet (≥768px)        Mobile (<768px)
┌──────────┬─────────────┐     ┌─────────────────┐
│ Sidebar  │   Content   │     │    Content      │
│ (Always  │   (Grid)    │     │    (Grid)       │
│ Visible) │             │     │                 │
└──────────┴─────────────┘     └─────────────────┘
                                [Filter Button] ← Opens Drawer
                                
                                When Opened:
                                ┌─────────────────┐
                                │▓▓▓▓ Backdrop ▓▓▓│
                                │▓┌─────────────┐▓│
                                │▓│   Drawer    │▓│
                                │▓│  (Sidebar)  │▓│
                                │▓│             │▓│
                                │▓│ [Apply]     │▓│
                                │▓└─────────────┘▓│
                                └─────────────────┘
```

### URL Parameter Structure

| Filter Type | Parameter Name | Format | Example |
|-------------|----------------|--------|---------|
| Category | `category` | String or ID | `?category=electronics` |
| Price Min | `price_min` | Number | `?price_min=1000` |
| Price Max | `price_max` | Number | `?price_max=5000` |
| Color | `color` | Comma-separated | `?color=red,blue` |
| Size | `size` | Comma-separated | `?size=M,L,XL` |
| Brand | `brand` | Comma-separated | `?brand=nike,adidas` |
| In Stock | `in_stock` | Boolean | `?in_stock=true` |
| On Sale | `on_sale` | Boolean | `?on_sale=true` |

### State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| searchParams | URLSearchParams | Current filter values |
| expandedSections | Set<string> | Track expanded sections |
| tempFilters | Object | Filters before apply (mobile) |
| isApplying | boolean | Loading state for filter update |

### Expected Outcome
- Functional filter sidebar with header and sections container
- Responsive behavior: static on desktop, drawer on mobile
- URL parameter-based filter state management
- Clear all functionality implemented
- Mobile apply button with loading state
- Smooth animations for drawer open/close

### Verification Checklist
- [ ] `FilterSidebar.tsx` file created in correct directory
- [ ] Component accepts all required props
- [ ] Sidebar header with "Filters" title and "Clear All" link
- [ ] Scrollable sections container implemented
- [ ] Mobile drawer transformation working
- [ ] URL search parameters integrated
- [ ] Clear all functionality resets all filters
- [ ] Apply button visible only on mobile
- [ ] Responsive styling for all screen sizes
- [ ] TypeScript types defined correctly

---

## Task 38: Create Filter Section Component

### Overview
Create the FilterSection component that serves as a collapsible container for individual filter groups (category, price, color, etc.). This component provides consistent expand/collapse functionality, section structure, and styling across all filter types. Each section includes a header (created in Task 39) and content area (created in Task 40).

### Dependencies
- Task 37: Create Filter Sidebar Component

### Instructions

1. **Create FilterSection component file**
   - Create `FilterSection.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `FilterSectionProps` interface
   - Include `title` prop (string) for section heading
   - Include `isExpanded` prop (boolean) for expand/collapse state
   - Include `onToggle` prop (function) for expand/collapse handler
   - Include `children` prop (ReactNode) for section content
   - Include optional `count` prop (number) for active filter count badge

3. **Set up internal component state**
   - Manage expanded state if not controlled by parent
   - Default to expanded for first 3 sections
   - Track animation state for smooth transitions

4. **Implement section container structure**
   - Create main section wrapper with proper spacing
   - Add border bottom separator between sections
   - Set padding for internal spacing

5. **Integrate FilterSectionHeader component**
   - Pass title, isExpanded, onToggle, and count to header
   - Header handles click to toggle expand/collapse
   - Display chevron icon indicating state

6. **Integrate FilterSectionContent component**
   - Wrap children in FilterSectionContent component
   - Pass isExpanded prop for conditional rendering
   - Content animates in/out smoothly

7. **Implement expand/collapse animation**
   - Use CSS transitions or Framer Motion
   - Animate max-height for smooth expansion
   - Fade content in/out during transition
   - Set reasonable animation duration (200-300ms)

8. **Add keyboard accessibility**
   - Ensure header is keyboard focusable
   - Support Enter and Space keys for toggle
   - Add proper ARIA attributes for screen readers

### Section Structure

```
┌─────────────────────────────────┐
│ ▼ Category         (3) ─────────│ ← Header (Task 39)
│                                  │
│  □ Electronics (234)             │
│  □ Fashion (189)                 │ ← Content (Task 40)
│  □ Home & Garden (156)           │
│                                  │
└─────────────────────────────────┘
│
└─────────────────────────────────┐
│ ▶ Price Range      ─────────────│ ← Collapsed State
└─────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | Yes | - | Section heading text |
| isExpanded | boolean | Yes | - | Expansion state |
| onToggle | () => void | Yes | - | Toggle handler |
| children | ReactNode | Yes | - | Filter controls |
| count | number | No | undefined | Active filter count |
| defaultExpanded | boolean | No | false | Initial state |

### Expand/Collapse States

| State | Chevron | Content | Max Height |
|-------|---------|---------|------------|
| Expanded | Down (▼) | Visible | auto |
| Collapsed | Right (▶) | Hidden | 0 |
| Animating | Rotating | Transitioning | Animating |

### Animation Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Duration | 250ms | Smooth but quick |
| Easing | ease-in-out | Natural motion |
| Properties | max-height, opacity | Height and fade |
| Transform | rotate(90deg) | Chevron rotation |

### Accessibility Features

```
Section Element
├── role="region"
├── aria-labelledby="section-header-id"
└── aria-expanded={isExpanded}

Header Element
├── role="button"
├── tabIndex={0}
├── aria-controls="section-content-id"
└── onClick/onKeyDown handlers
```

### Section Spacing

| Element | Spacing | Purpose |
|---------|---------|---------|
| Section Container | py-4 | Vertical padding |
| Border | border-b border-gray-200 | Visual separation |
| Last Section | border-b-0 | No border on last |

### Expected Outcome
- Reusable collapsible section component
- Smooth expand/collapse animation
- Consistent styling across all filter types
- Keyboard and screen reader accessible
- Active filter count badge support

### Verification Checklist
- [ ] `FilterSection.tsx` file created
- [ ] Component accepts all required props
- [ ] Expand/collapse functionality working
- [ ] Smooth animation on state change
- [ ] Chevron icon rotates appropriately
- [ ] Header and content integration correct
- [ ] Keyboard navigation functional
- [ ] ARIA attributes properly set
- [ ] Count badge displays when provided
- [ ] TypeScript types defined correctly

---

## Task 39: Create Filter Section Header

### Overview
Create the FilterSectionHeader component that displays the section title, active filter count badge, and expand/collapse chevron icon. This header is clickable to toggle the section's expanded state and provides visual feedback through hover and focus states.

### Dependencies
- Task 38: Create Filter Section Component

### Instructions

1. **Create FilterSectionHeader component file**
   - Create `FilterSectionHeader.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `FilterSectionHeaderProps` interface
   - Include `title` prop (string) for section name
   - Include `isExpanded` prop (boolean) for chevron state
   - Include `onToggle` prop (function) for click handler
   - Include optional `count` prop (number) for active filters
   - Include optional `id` prop (string) for ARIA attributes

3. **Implement header container**
   - Create button element for clickable header
   - Set full width with proper padding
   - Add flex layout for content arrangement
   - Ensure proper cursor and interaction states

4. **Add title text**
   - Display title prop with appropriate typography
   - Use font-medium or font-semibold for emphasis
   - Set text color to dark gray or black
   - Ensure text doesn't wrap unnecessarily

5. **Create active filter count badge**
   - Display count in small circular badge
   - Show only when count is greater than 0
   - Position after title text with spacing
   - Style with background color and white text

6. **Add chevron icon**
   - Import and use ChevronDown or ChevronRight icon
   - Position at far right of header
   - Rotate based on isExpanded state
   - Add transition for smooth rotation

7. **Implement hover and focus states**
   - Add background color change on hover
   - Add focus ring for keyboard navigation
   - Ensure sufficient contrast for accessibility
   - Smooth transition for state changes

8. **Add click and keyboard handlers**
   - Call onToggle on button click
   - Support Enter and Space key for keyboard users
   - Prevent default behaviors if necessary

### Header Layout Structure

```
┌─────────────────────────────────────┐
│  Category  (3)               ▼     │
│  └─title   └─count badge    └─icon │
└─────────────────────────────────────┘

Hover/Focus State:
┌─────────────────────────────────────┐
│░ Category  (3)               ▼    ░│ ← Background highlight
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | Yes | - | Section heading |
| isExpanded | boolean | Yes | - | Expanded state |
| onToggle | () => void | Yes | - | Toggle handler |
| count | number | No | 0 | Active filter count |
| id | string | No | auto-generated | For ARIA linking |

### Count Badge Styling

| State | Background | Text | Size | Display |
|-------|------------|------|------|---------|
| No Filters | - | - | - | hidden |
| 1-9 Filters | bg-blue-600 | white | h-5 w-5 | inline-flex |
| 10+ Filters | bg-blue-600 | white | h-5 w-auto | inline-flex |

### Chevron Icon States

| State | Rotation | Transition | Color |
|-------|----------|------------|-------|
| Collapsed | 0deg (→) | 200ms | gray-500 |
| Expanded | 90deg (↓) | 200ms | gray-500 |
| Hover | Same | - | gray-700 |

### Typography Specifications

| Element | Class | Size | Weight | Color |
|---------|-------|------|--------|-------|
| Title | text-sm md:text-base | 14-16px | font-medium | text-gray-900 |
| Badge | text-xs | 12px | font-medium | text-white |

### Interactive States

```
Default:
[Category         ▶]

Hover:
[Category         ▶] ← Subtle background
 ^^^^^^^^^^^^^^^^ 
 hover:bg-gray-50

Focus:
[Category         ▶]
 ╔═══════════════╗ ← Focus ring
 ║ focus:ring-2  ║
 ╚═══════════════╝

Active (Expanded):
[Category    (3) ▼]
```

### Accessibility Implementation

| Attribute | Value | Purpose |
|-----------|-------|---------|
| role | button | Semantic button role |
| aria-expanded | {isExpanded} | Screen reader state |
| aria-controls | section-content-{id} | Links to content |
| tabIndex | 0 | Keyboard focusable |
| id | section-header-{id} | Unique identifier |

### Expected Outcome
- Clickable header component with title and icon
- Active filter count badge when applicable
- Smooth chevron rotation on expand/collapse
- Hover and focus states for interactivity
- Full keyboard and screen reader support

### Verification Checklist
- [ ] `FilterSectionHeader.tsx` file created
- [ ] Title displays correctly from prop
- [ ] Count badge shows when count > 0
- [ ] Chevron icon rotates based on isExpanded
- [ ] Click handler calls onToggle function
- [ ] Hover state applies background color
- [ ] Focus ring visible for keyboard navigation
- [ ] ARIA attributes properly configured
- [ ] Keyboard Enter/Space keys work
- [ ] Component exports properly

---

## Task 40: Create Filter Section Content

### Overview
Create the FilterSectionContent component that wraps the actual filter controls (checkboxes, sliders, etc.) and handles the expand/collapse animation. This component provides smooth height transitions and manages the visibility of filter content based on the section's expanded state.

### Dependencies
- Task 38: Create Filter Section Component

### Instructions

1. **Create FilterSectionContent component file**
   - Create `FilterSectionContent.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `FilterSectionContentProps` interface
   - Include `children` prop (ReactNode) for filter controls
   - Include `isExpanded` prop (boolean) for visibility state
   - Include optional `id` prop (string) for ARIA attributes

3. **Set up animation approach**
   - Decide between CSS transitions or animation library
   - Consider using Framer Motion for advanced animations
   - Or use Tailwind CSS with max-height transitions

4. **Implement content container**
   - Create main div wrapper for children
   - Add overflow-hidden for animation containment
   - Set transition properties for smooth animation

5. **Add conditional rendering logic**
   - Show content when isExpanded is true
   - Apply appropriate max-height values
   - Transition between 0 and auto height

6. **Style content padding and spacing**
   - Add top padding after expansion (pt-3 or pt-4)
   - Add bottom padding for spacing (pb-2 or pb-3)
   - Ensure proper spacing from header

7. **Implement height animation**
   - Animate max-height from 0 to auto
   - Use grid-rows or specific pixel value for auto
   - Add opacity transition for smooth fade
   - Set reasonable duration (200-300ms)

8. **Add accessibility attributes**
   - Set aria-hidden based on isExpanded
   - Link to header via aria-labelledby
   - Ensure smooth screen reader experience

### Content Animation Structure

```
Collapsed (max-height: 0):
┌─────────────────────────┐
│ ▶ Price Range          │
└─────────────────────────┘
  (Content hidden)

Expanding (transitioning):
┌─────────────────────────┐
│ ▼ Price Range          │
├─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░  │ ← Animating
│ ░░░░░░░░░░░░░░░░░░░░░  │

Expanded (max-height: auto):
┌─────────────────────────┐
│ ▼ Price Range          │
├─────────────────────────┤
│  Min: [____] LKR       │
│  ═════⊙══════⊙═════    │ ← Fully visible
│  Max: [____] LKR       │
└─────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Filter controls |
| isExpanded | boolean | Yes | - | Visibility state |
| id | string | No | auto | ARIA identifier |

### Animation Specifications

| Property | Collapsed | Expanded | Transition |
|----------|-----------|----------|------------|
| max-height | 0 | 500px or auto | 250ms ease-in-out |
| opacity | 0 | 1 | 250ms ease-in-out |
| overflow | hidden | hidden | - |
| padding-top | 0 | 1rem | 250ms ease-in-out |

### CSS Transition Approach

| Method | Pros | Cons |
|--------|------|------|
| max-height | Simple, performant | Fixed max value needed |
| grid-template-rows | True auto height | More complex CSS |
| Framer Motion | Smooth, auto height | Extra dependency |

### Content Spacing

| Element | Class | Purpose |
|---------|-------|---------|
| Container | overflow-hidden | Clip animated content |
| Content | pt-4 pb-2 | Internal padding |
| Children | space-y-2 or gap-2 | Spacing between items |

### Framer Motion Example Structure

```
<motion.div
  initial={false}
  animate={{
    height: isExpanded ? "auto" : 0,
    opacity: isExpanded ? 1 : 0
  }}
  transition={{
    duration: 0.25,
    ease: "easeInOut"
  }}
>
  <div className="pt-4 pb-2">
    {children}
  </div>
</motion.div>
```

### Accessibility Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| id | content-{id} | Unique identifier |
| role | region | Semantic meaning |
| aria-labelledby | header-{id} | Links to header |
| aria-hidden | !isExpanded | Visibility state |

### Expected Outcome
- Smooth height animation on expand/collapse
- Content fades in/out gracefully
- No content overflow during animation
- Proper spacing around filter controls
- Accessible to screen readers

### Verification Checklist
- [ ] `FilterSectionContent.tsx` file created
- [ ] Component accepts children and isExpanded props
- [ ] Content hidden when isExpanded is false
- [ ] Smooth animation on state change
- [ ] No content overflow visible
- [ ] Proper padding applied when expanded
- [ ] Opacity transition working
- [ ] ARIA attributes configured
- [ ] Works with various content heights
- [ ] Component exports properly

---

## Task 41: Create Category Filter

### Overview
Create the CategoryFilter component that displays a hierarchical list of product categories with checkboxes for filtering. This component supports nested subcategories with indentation, displays product counts for each category, and manages category selection state through URL parameters. Includes optional search functionality for large category lists.

### Dependencies
- Task 37: Create Filter Sidebar Component
- Task 38: Create Filter Section Component

### Instructions

1. **Create CategoryFilter component file**
   - Create `CategoryFilter.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure

2. **Define category data structure**
   - Create `Category` interface with id, name, slug, count properties
   - Add optional `children` property for subcategories
   - Add optional `parent` reference for hierarchy

3. **Define component props interface**
   - Create `CategoryFilterProps` interface
   - Include `categories` prop (array of Category objects)
   - Include `selectedCategories` prop (array of category IDs)
   - Include `onChange` handler for selection changes

4. **Set up category selection state**
   - Extract selected categories from URL search params
   - Use `category` query parameter
   - Support multiple category selection
   - Provide callback to parent for state updates

5. **Implement category list rendering**
   - Map through categories array
   - Render CategoryCheckbox for each category
   - Handle nested categories recursively
   - Add indentation for subcategories

6. **Create hierarchy visualization**
   - Use padding-left for indentation levels
   - Show parent-child relationships clearly
   - Add connecting lines or icons (optional)
   - Limit nesting depth to 2-3 levels

7. **Display product counts**
   - Show count in parentheses after category name
   - Format large numbers with commas (1,234)
   - Gray out categories with 0 products
   - Update counts based on other active filters

8. **Add category search (optional)**
   - Include search input at top of filter
   - Filter categories by name in real-time
   - Highlight matching text
   - Show "No results" message when applicable

9. **Implement expand/collapse for parents**
   - Add chevron icon for categories with children
   - Toggle subcategory visibility on click
   - Remember expanded state in component
   - Default to expanding first level only

10. **Handle category selection logic**
    - Support single or multiple selection
    - Update URL parameters on change
    - Clear child selections when parent deselected
    - Auto-select parent when all children selected

### Category Hierarchy Structure

```
□ Electronics (234)
  □ Computers & Laptops (89)
    □ Laptops (45)
    □ Desktops (28)
    □ Accessories (16)
  □ Mobile Phones (67)
  □ Audio & Video (78)

□ Fashion (189)
  □ Men's Clothing (92)
  □ Women's Clothing (97)

□ Home & Garden (156)
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| categories | Category[] | Yes | Hierarchical category tree |
| selectedCategories | string[] | Yes | Selected category IDs/slugs |
| onChange | (ids: string[]) => void | Yes | Selection change handler |
| searchable | boolean | No | Enable search feature |
| maxDepth | number | No | Maximum nesting depth |

### Category Data Structure

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  children?: Category[];
  parent?: string;
  level: number;
}
```

### Indentation Levels

| Level | Padding Left | Visual Example |
|-------|--------------|----------------|
| 0 (Root) | pl-0 | `□ Electronics` |
| 1 (Child) | pl-4 | `  □ Computers` |
| 2 (Grandchild) | pl-8 | `    □ Laptops` |
| 3+ (Deep) | pl-12 | `      □ Gaming` |

### Category Item States

| State | Visual | Behavior |
|-------|--------|----------|
| Unselected | `□ Category (45)` | Click to select |
| Selected | `☑ Category (45)` | Click to deselect |
| Disabled | `□ Category (0)` | Grayed out, not clickable |
| Hover | Background highlight | Visual feedback |

### Search Feature Layout

```
┌─────────────────────────────┐
│ 🔍 Search categories...     │ ← Search input
├─────────────────────────────┤
│ □ Electronics (234)         │
│   □ Computers (89)          │
│ □ Fashion (189)             │
└─────────────────────────────┘

With Search "laptop":
┌─────────────────────────────┐
│ 🔍 laptop                   │
├─────────────────────────────┤
│ □ Electronics               │
│   □ Computers               │
│     □ Laptops (45) ← Match │
└─────────────────────────────┘
```

### Product Count Display

| Count | Display | Styling |
|-------|---------|---------|
| 0 | (0) | text-gray-400, disabled |
| 1-999 | (15) | text-gray-600 |
| 1,000-9,999 | (1,234) | text-gray-600 |
| 10,000+ | (10K+) | text-gray-600 |

### Selection Behavior Matrix

| Action | Parent | Children | Result |
|--------|--------|----------|--------|
| Select parent | Selected | Auto-select | All selected |
| Deselect parent | Deselected | Auto-deselect | All deselected |
| Select all children | Auto-select | Selected | Parent + children |
| Select some children | Indeterminate | Partial | Mixed state |

### Expected Outcome
- Hierarchical category list with checkboxes
- Product counts displayed for each category
- Nested categories with proper indentation
- Optional search functionality
- URL parameter integration for persistence
- Smooth interactions and visual feedback

### Verification Checklist
- [ ] `CategoryFilter.tsx` file created
- [ ] Category hierarchy renders correctly
- [ ] Indentation shows parent-child relationships
- [ ] Product counts display accurately
- [ ] Checkbox selection updates URL params
- [ ] Multiple categories can be selected
- [ ] Search feature filters categories (if enabled)
- [ ] Expand/collapse works for parent categories
- [ ] Parent selection affects children appropriately
- [ ] Zero-count categories are disabled
- [ ] Component exports properly

---

## Task 42: Create Category Checkbox

### Overview
Create the CategoryCheckbox component that represents a single category item with checkbox, label, and product count. This reusable component handles individual category selection, displays category information, supports indeterminate state for parent categories, and provides visual feedback for interactions.

### Dependencies
- Task 41: Create Category Filter

### Instructions

1. **Create CategoryCheckbox component file**
   - Create `CategoryCheckbox.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CategoryCheckboxProps` interface
   - Include `category` prop (Category object)
   - Include `checked` prop (boolean) for selection state
   - Include `indeterminate` prop (boolean) for partial selection
   - Include `onChange` handler for checkbox changes
   - Include `level` prop (number) for indentation depth
   - Include optional `disabled` prop for zero-count categories

3. **Implement checkbox container**
   - Create label element wrapping checkbox and text
   - Set cursor-pointer for clickability
   - Add flex layout for alignment
   - Apply padding based on nesting level

4. **Add checkbox input element**
   - Use native HTML checkbox or custom component
   - Bind checked state to prop
   - Handle indeterminate state (ref required)
   - Call onChange handler on change event

5. **Display category label**
   - Show category name from prop
   - Use appropriate text size and weight
   - Add truncate for long names
   - Ensure proper spacing from checkbox

6. **Add product count badge**
   - Display count in parentheses or badge
   - Style with gray color
   - Hide or gray out when count is 0
   - Format large numbers appropriately

7. **Implement indentation**
   - Calculate padding-left based on level prop
   - Level 0: no indent, Level 1: 1rem, Level 2: 2rem
   - Add visual indicators for hierarchy (optional)

8. **Style interaction states**
   - Add hover background color change
   - Show focus ring for keyboard navigation
   - Disabled state for zero-count categories
   - Checked state with different styling

9. **Handle indeterminate state**
   - Use useEffect to set indeterminate property
   - Show dash or minus icon instead of checkmark
   - Indicate partial selection of children
   - Apply distinct visual styling

### Checkbox Layout Structure

```
Normal:
□ Computers & Laptops (89)
└─checkbox  └─label  └─count

Nested (Level 1):
  □ Laptops (45)
└─indent

Checked:
☑ Mobile Phones (67)

Indeterminate (partial):
⊟ Electronics (234)
  ☑ Computers (89)
  □ Mobile Phones (67)
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| category | Category | Yes | - | Category data |
| checked | boolean | Yes | - | Selection state |
| indeterminate | boolean | No | false | Partial selection |
| onChange | (id: string) => void | Yes | - | Change handler |
| level | number | Yes | - | Nesting depth |
| disabled | boolean | No | false | Disabled state |

### Indentation Calculation

| Level | Padding Left | Use Case |
|-------|--------------|----------|
| 0 | 0rem | Root categories |
| 1 | 1rem (4 units) | Direct children |
| 2 | 2rem (8 units) | Grandchildren |
| 3+ | 3rem (12 units) | Deep nesting |

### Checkbox States

| State | Icon | Styling | Clickable |
|-------|------|---------|-----------|
| Unchecked | ☐ | border-gray-300 | Yes |
| Checked | ☑ | bg-blue-600, border-blue-600 | Yes |
| Indeterminate | ⊟ | bg-blue-600, border-blue-600 | Yes |
| Disabled | ☐ | opacity-50, cursor-not-allowed | No |

### Typography Specifications

| Element | Class | Size | Weight | Color |
|---------|-------|------|--------|-------|
| Label | text-sm | 14px | font-normal | text-gray-900 |
| Count | text-xs | 12px | font-normal | text-gray-500 |
| Disabled Label | text-sm | 14px | font-normal | text-gray-400 |

### Interactive States

```
Default:
□ Fashion (189)

Hover:
[□ Fashion (189)] ← Background highlight
 ^^^^^^^^^^^^^^^
 hover:bg-gray-50

Focus:
[□ Fashion (189)]
 ╔═════════════╗ ← Focus ring
 ║ Focused     ║
 ╚═════════════╝

Checked + Hover:
[☑ Fashion (189)]
 bg-blue-50

Disabled:
□ Category (0)
  ^^^^^^^^^^^^
  text-gray-400
  cursor-not-allowed
```

### Indeterminate State Implementation

```typescript
const checkboxRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (checkboxRef.current) {
    checkboxRef.current.indeterminate = indeterminate;
  }
}, [indeterminate]);
```

### Accessibility Features

| Attribute | Value | Purpose |
|-----------|-------|---------|
| role | checkbox | Semantic role |
| aria-checked | checked \| "mixed" | State for screen readers |
| aria-label | category.name | Descriptive label |
| aria-disabled | disabled | Disabled state |
| tabIndex | 0 or -1 | Keyboard navigation |

### Expected Outcome
- Functional checkbox component for categories
- Proper indentation based on hierarchy level
- Product count displayed next to label
- Indeterminate state for parent categories
- Visual feedback for hover, focus, and checked states
- Disabled state for zero-count categories
- Fully accessible to keyboard and screen readers

### Verification Checklist
- [ ] `CategoryCheckbox.tsx` file created
- [ ] Category name and count display correctly
- [ ] Checkbox toggles on click
- [ ] Indentation applied based on level prop
- [ ] Indeterminate state renders correctly
- [ ] Hover background color applies
- [ ] Focus ring visible for keyboard navigation
- [ ] Disabled state prevents interaction
- [ ] onChange handler called with category ID
- [ ] ARIA attributes properly configured
- [ ] Component exports properly

---

## Task 43: Create Price Range Filter

### Overview
Create the PriceRangeFilter component that allows users to filter products by price using a dual-handle slider and numeric input fields. This component displays the minimum and maximum price range, synchronizes slider and input values, and updates URL parameters with the selected price range. Supports currency formatting for Sri Lankan Rupees (LKR).

### Dependencies
- Task 37: Create Filter Sidebar Component
- Task 38: Create Filter Section Component

### Instructions

1. **Create PriceRangeFilter component file**
   - Create `PriceRangeFilter.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `PriceRangeFilterProps` interface
   - Include `minPrice` prop (number) for range minimum
   - Include `maxPrice` prop (number) for range maximum
   - Include `selectedMin` prop (number) for current min selection
   - Include `selectedMax` prop (number) for current max selection
   - Include `onChange` handler for range changes
   - Include optional `currency` prop (default: "LKR")

3. **Set up price state management**
   - Create local state for min and max values
   - Sync with URL search parameters
   - Use `price_min` and `price_max` query params
   - Handle debounced updates to prevent excessive URL changes

4. **Integrate PriceSlider component**
   - Pass min, max, and selected values to slider
   - Handle slider value changes
   - Sync slider with input fields bidirectionally
   - Display visual representation of range

5. **Integrate PriceInputs component**
   - Pass min and max values to input fields
   - Handle input value changes
   - Validate input values (min <= max)
   - Format and display currency symbol

6. **Implement value synchronization**
   - Keep slider and inputs in sync
   - Update both when either changes
   - Debounce input changes (300-500ms)
   - Validate ranges before updating

7. **Add currency formatting**
   - Display LKR symbol (₨) before amounts
   - Format numbers with commas (1,000)
   - Handle decimal places if needed
   - Support different currencies if required

8. **Implement validation logic**
   - Ensure min is not greater than max
   - Keep values within available range
   - Show error messages for invalid inputs
   - Prevent negative values

9. **Add reset functionality**
   - Include "Reset" or "Clear" button
   - Reset to full price range
   - Remove price params from URL
   - Update both slider and inputs

10. **Handle edge cases**
    - Empty price range (no products)
    - Single price point (min === max)
    - Very large price differences
    - Currency conversion if needed

### Price Range Layout Structure

```
┌─────────────────────────────────┐
│ Price Range                     │
├─────────────────────────────────┤
│                                 │
│ Min: ₨ 1,000    Max: ₨ 50,000 │ ← Current range
│                                 │
│  ═════⊙═════════════⊙═════     │ ← Slider (Task 44)
│                                 │
│  Min: [₨ 5,000]  Max: [₨ 25K] │ ← Inputs (Task 45)
│                                 │
│         [Reset Range]           │ ← Optional
└─────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| minPrice | number | Yes | - | Minimum available price |
| maxPrice | number | Yes | - | Maximum available price |
| selectedMin | number | Yes | - | Selected min value |
| selectedMax | number | Yes | - | Selected max value |
| onChange | (min, max) => void | Yes | - | Change handler |
| currency | string | No | "LKR" | Currency code |
| step | number | No | 100 | Slider step value |

### Price Range Data Flow

```
URL Params                Component State           UI Components
┌──────────┐             ┌───────────────┐        ┌────────────┐
│price_min │────────────▶│ selectedMin   │───────▶│  Slider    │
│price_max │             │ selectedMax   │        │  Inputs    │
└──────────┘             └───────────────┘        └────────────┘
     ▲                           │                       │
     │                           │                       │
     └───────────────────────────┴───────────────────────┘
              onChange handler (debounced)
```

### Currency Formatting

| Value | Formatted | Display |
|-------|-----------|---------|
| 1000 | 1,000 | ₨ 1,000 |
| 5000 | 5,000 | ₨ 5,000 |
| 50000 | 50,000 | ₨ 50,000 |
| 100000 | 100,000 | ₨ 100K |
| 1000000 | 1,000,000 | ₨ 1M |

### Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| Min <= Max | Min cannot exceed max | "Min must be less than max" |
| Within Range | Values within available range | "Value out of range" |
| Positive | No negative values | "Price must be positive" |
| Numeric | Only numbers allowed | "Please enter a valid number" |

### Debounce Strategy

| Event | Debounce | Reason |
|-------|----------|--------|
| Slider Drag | No debounce | Real-time feedback |
| Slider Release | 100ms | Finalize URL update |
| Input Typing | 500ms | Reduce URL changes |
| Input Blur | Immediate | User done typing |

### State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| localMin | number | Temporary min value |
| localMax | number | Temporary max value |
| isValidRange | boolean | Validation status |
| isDragging | boolean | Slider interaction state |

### Expected Outcome
- Functional price range filter with slider and inputs
- Bidirectional sync between slider and inputs
- Currency formatting with LKR symbol
- Value validation and error handling
- Debounced URL parameter updates
- Reset functionality to clear price filter

### Verification Checklist
- [ ] `PriceRangeFilter.tsx` file created
- [ ] Min and max price values accepted
- [ ] PriceSlider component integrated
- [ ] PriceInputs component integrated
- [ ] Slider and inputs stay synchronized
- [ ] Currency symbol (₨) displays correctly
- [ ] Number formatting with commas works
- [ ] Validation prevents invalid ranges
- [ ] URL params update with selected range
- [ ] Debouncing prevents excessive updates
- [ ] Reset button clears price filter
- [ ] Component exports properly

---

## Task 44: Create Price Range Slider

### Overview
Create the PriceSlider component that provides a visual dual-handle slider for selecting minimum and maximum price values. This component allows users to drag two handles to adjust the price range, displays the selected range visually with a filled track section, and provides immediate visual feedback during interaction.

### Dependencies
- Task 43: Create Price Range Filter

### Instructions

1. **Create PriceSlider component file**
   - Create `PriceSlider.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure

2. **Choose slider implementation**
   - Option A: Use existing library (react-slider, rc-slider)
   - Option B: Build custom HTML5 range inputs
   - Option C: Use Headless UI or Radix UI components
   - Consider accessibility and customization needs

3. **Define component props interface**
   - Create `PriceSliderProps` interface
   - Include `min` prop (number) for range minimum
   - Include `max` prop (number) for range maximum
   - Include `value` prop ([number, number]) for current selection
   - Include `onChange` handler for value changes
   - Include optional `step` prop (default: 100)
   - Include optional `formatLabel` function

4. **Set up slider container**
   - Create wrapper div with appropriate width
   - Add padding for handle overflow
   - Set height for comfortable touch targets
   - Position relative for absolute handle positioning

5. **Implement slider track**
   - Create background track (full range)
   - Create filled track (selected range)
   - Style with brand colors
   - Add smooth transitions for visual feedback

6. **Create slider handles**
   - Add two draggable handle elements
   - Position based on current values
   - Style as circles or custom shapes
   - Ensure minimum 44x44px touch target

7. **Implement drag functionality**
   - Add mouse and touch event listeners
   - Calculate value from handle position
   - Update values during drag
   - Prevent handles from crossing

8. **Add value labels (optional)**
   - Display current values above handles
   - Show formatted currency amounts
   - Update in real-time during drag
   - Position to avoid overlap

9. **Style interaction states**
   - Add hover effects on handles
   - Enlarge handle on active/drag state
   - Change cursor to grab/grabbing
   - Add focus ring for keyboard navigation

10. **Implement keyboard support**
    - Support arrow keys to adjust values
    - Support Page Up/Down for larger jumps
    - Support Home/End for min/max values
    - Ensure proper focus management

11. **Add touch support**
    - Handle touch events for mobile
    - Prevent scrolling during drag
    - Ensure smooth touch interactions
    - Test on various mobile devices

### Slider Visual Structure

```
Track:
═══════════════════════════════
└─────────────────────────────┘
  Background (gray)

With Selection:
═════⊙═════════════⊙═════════
     ^             ^
     Min Handle    Max Handle
     
     ╔═══════════╗
     ║  Filled   ║ ← Selected range (blue)
     ╚═══════════╝

With Labels:
  ₨5K           ₨25K
   │             │
═══⊙═════════════⊙═════════
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| min | number | Yes | - | Minimum value |
| max | number | Yes | - | Maximum value |
| value | [number, number] | Yes | - | Current [min, max] |
| onChange | (value) => void | Yes | - | Change handler |
| step | number | No | 100 | Value increment |
| showLabels | boolean | No | false | Show value labels |
| formatLabel | (value) => string | No | - | Format function |

### Slider Dimensions

| Element | Size | Purpose |
|---------|------|---------|
| Track Height | 4-6px | Visual prominence |
| Handle Size | 16-20px | Easy to grab |
| Touch Target | 44x44px | Accessibility |
| Container Padding | 10-12px | Handle overflow |

### Color Specifications

| Element | State | Color |
|---------|-------|-------|
| Track Background | Default | bg-gray-200 |
| Track Filled | Selected | bg-blue-600 |
| Handle | Default | bg-white, border-blue-600 |
| Handle | Hover | bg-blue-50 |
| Handle | Active | bg-blue-100, scale-110 |
| Handle | Focus | ring-2, ring-blue-600 |

### Handle Positioning Calculation

```
Position Percentage = (value - min) / (max - min) * 100

Example:
min = 1000, max = 50000, value = 10000
position = (10000 - 1000) / (50000 - 1000) * 100 = 18.37%

CSS: left: 18.37%
```

### Interaction States

| State | Handle Size | Cursor | Shadow |
|-------|-------------|--------|--------|
| Default | 16px | pointer | shadow-sm |
| Hover | 16px | grab | shadow-md |
| Active (dragging) | 18px | grabbing | shadow-lg |
| Focus | 16px | pointer | ring-2 |

### Keyboard Navigation

| Key | Action | Step Size |
|-----|--------|-----------|
| Arrow Left/Down | Decrease | 1 × step |
| Arrow Right/Up | Increase | 1 × step |
| Page Down | Decrease | 10 × step |
| Page Up | Increase | 10 × step |
| Home | Set to min | - |
| End | Set to max | - |

### Handle Collision Prevention

```
Min Handle Position:
- Can move from min to (maxValue - step)
- Cannot cross or exceed max handle

Max Handle Position:
- Can move from (minValue + step) to max
- Cannot cross or go below min handle
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA Role | slider or range |
| ARIA Label | "Minimum price" / "Maximum price" |
| ARIA ValueNow | Current value |
| ARIA ValueMin | Minimum value |
| ARIA ValueMax | Maximum value |
| Tab Index | 0 (both handles) |

### Expected Outcome
- Functional dual-handle range slider
- Smooth dragging interaction for both handles
- Visual feedback with filled track section
- Handles cannot cross each other
- Keyboard navigation support
- Touch-friendly on mobile devices
- Accessible to screen readers

### Verification Checklist
- [ ] `PriceSlider.tsx` file created
- [ ] Dual handles render and position correctly
- [ ] Dragging updates values smoothly
- [ ] Filled track displays selected range
- [ ] Handles cannot cross each other
- [ ] Min and max constraints enforced
- [ ] Step value applied correctly
- [ ] Hover and active states work
- [ ] Keyboard navigation functional
- [ ] Touch events work on mobile
- [ ] ARIA attributes properly set
- [ ] Component exports properly

---

## Task 45: Create Price Input Fields

### Overview
Create the PriceInputs component that provides text input fields for manually entering minimum and maximum price values. This component allows users to type exact amounts, validates input values, formats currency display, and synchronizes with the price slider component for bidirectional updates.

### Dependencies
- Task 43: Create Price Range Filter

### Instructions

1. **Create PriceInputs component file**
   - Create `PriceInputs.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `PriceInputsProps` interface
   - Include `min` prop (number) for range minimum
   - Include `max` prop (number) for range maximum
   - Include `minValue` prop (number) for current min input
   - Include `maxValue` prop (number) for current max input
   - Include `onChange` handler for value changes
   - Include optional `currency` prop (default: "LKR")

3. **Create inputs container layout**
   - Use flexbox or grid for input arrangement
   - Position inputs side-by-side with gap
   - Add labels for "Min" and "Max"
   - Ensure responsive layout for mobile

4. **Implement minimum price input**
   - Create input field for minimum value
   - Set type="number" or type="text" with validation
   - Add currency symbol prefix (₨)
   - Apply appropriate styling and sizing

5. **Implement maximum price input**
   - Create input field for maximum value
   - Mirror minimum input structure
   - Add currency symbol prefix (₨)
   - Maintain consistent styling

6. **Add input validation**
   - Validate numeric input only
   - Ensure min value doesn't exceed max
   - Ensure max value doesn't go below min
   - Check values are within available range
   - Show error states for invalid input

7. **Implement currency formatting**
   - Display LKR symbol (₨) before input
   - Format numbers with commas on blur
   - Remove formatting during editing
   - Handle decimal places if needed

8. **Add change handlers**
   - Debounce onChange calls (300-500ms)
   - Parse string input to numbers
   - Validate before calling onChange
   - Handle empty input gracefully

9. **Style input states**
   - Default state with border
   - Focus state with ring
   - Error state with red border
   - Disabled state if needed

10. **Add input enhancement features**
    - Placeholder text with example values
    - Clear button for each input (optional)
    - Input masks for currency format
    - Auto-select on focus for easy editing

### Input Layout Structure

```
Side-by-Side Layout:
┌───────────────────────────────┐
│ Min Price      Max Price      │
│ ┌──────────┐  ┌──────────┐  │
│ │₨ 1,000  │  │₨ 50,000 │  │
│ └──────────┘  └──────────┘  │
└───────────────────────────────┘

Stacked Layout (Mobile):
┌───────────────────┐
│ Min Price         │
│ ┌───────────────┐│
│ │₨ 1,000       ││
│ └───────────────┘│
│ Max Price         │
│ ┌───────────────┐│
│ │₨ 50,000      ││
│ └───────────────┘│
└───────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| min | number | Yes | - | Available minimum |
| max | number | Yes | - | Available maximum |
| minValue | number | Yes | - | Current min value |
| maxValue | number | Yes | - | Current max value |
| onChange | (min, max) => void | Yes | - | Change handler |
| currency | string | No | "LKR" | Currency code |

### Input Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Width | 100% or fixed | Responsive sizing |
| Height | 40-44px | Comfortable input |
| Padding | px-3 py-2 | Internal spacing |
| Font Size | text-sm | Readable text |
| Border | border border-gray-300 | Visual definition |

### Validation Rules

| Rule | Check | Error State |
|------|-------|-------------|
| Numeric | Only numbers | Red border, error message |
| Min <= Max | minValue <= maxValue | Red border on both |
| Within Range | min <= value <= max | Red border, error message |
| Not Empty | value !== '' | Use placeholder or default |

### Input States

```
Default:
┌──────────┐
│₨ 5,000  │
└──────────┘

Focus:
╔══════════╗ ← Focus ring (blue)
║₨ 5,000  ║
╚══════════╝

Error:
┌──────────┐ ← Red border
│₨ 60,000 │
└──────────┘
Min must be less than max

Disabled:
┌──────────┐ ← Gray background
│₨ 5,000  │ opacity-50
└──────────┘
```

### Currency Symbol Positioning

| Method | HTML Structure | Visual |
|--------|----------------|--------|
| Prefix Text | `<div>₨ <input /></div>` | `₨ 5000` |
| Input Prefix | `<input placeholder="₨" />` | `₨5000` |
| Absolute Position | `<div><span>₨</span><input /></div>` | `₨ 5000` |

### Formatting Logic

```
On Input (typing):
- Allow only numbers and comma
- No formatting applied
- Raw value: "5000"

On Blur (lost focus):
- Apply number formatting
- Add thousand separators
- Formatted: "5,000"

On Focus (click):
- Remove formatting
- Select all text
- Raw value: "5000"
```

### Debounce Implementation

| Event | Debounce Delay | Reason |
|-------|----------------|--------|
| onChange | 500ms | Wait for user to finish typing |
| onBlur | Immediate | User done editing |
| Slider sync | 100ms | Quick response to slider |

### Accessibility Features

| Attribute | Value | Purpose |
|-----------|-------|---------|
| label | "Minimum Price" / "Maximum Price" | Screen reader label |
| aria-label | If no visible label | Accessible name |
| aria-invalid | true/false | Error state |
| aria-describedby | error-message-id | Link to error |
| inputMode | numeric | Mobile keyboard |

### Expected Outcome
- Two text input fields for min and max prices
- Currency symbol (₨) prefix displayed
- Number formatting with commas on blur
- Input validation with error states
- Debounced onChange handler
- Synchronization with price slider
- Accessible to keyboard and screen readers

### Verification Checklist
- [ ] `PriceInputs.tsx` file created
- [ ] Min and max input fields render correctly
- [ ] Currency symbol (₨) displays before values
- [ ] Numeric validation prevents non-numbers
- [ ] Min/max relationship validated
- [ ] Values stay within available range
- [ ] Number formatting with commas on blur
- [ ] Focus state removes formatting
- [ ] Error states show with red border
- [ ] onChange handler debounced appropriately
- [ ] Placeholder text helpful
- [ ] ARIA attributes configured
- [ ] Component exports properly

---

## Task 46: Create Attribute Filters

### Overview
Create the AttributeFilters component that serves as a container for product attribute filtering sections including color, size, and brand filters. This component organizes attribute-specific filters into collapsible sections, manages their visibility and selection state, and provides a consistent structure for all attribute filter types that will be implemented in the next document.

### Dependencies
- Task 37: Create Filter Sidebar Component
- Task 38: Create Filter Section Component

### Instructions

1. **Create AttributeFilters component file**
   - Create `AttributeFilters.tsx` in `components/storefront/catalog/Filters/` directory
   - Set up TypeScript React functional component structure

2. **Define attribute data structure**
   - Create `AttributeOption` interface with id, name, value properties
   - Create `ProductAttribute` interface for attribute groups
   - Add count property for product count per attribute

3. **Define component props interface**
   - Create `AttributeFiltersProps` interface
   - Include `attributes` prop (object with color, size, brand arrays)
   - Include `selectedAttributes` prop (object with selected values)
   - Include `onChange` handler for attribute selection changes

4. **Set up attribute state management**
   - Extract selected attributes from URL search parameters
   - Use separate params: `color`, `size`, `brand`
   - Support multiple values per attribute (comma-separated)
   - Provide callback to parent for state updates

5. **Create filters container structure**
   - Wrap all attribute filter sections
   - Prepare slots for ColorFilter, SizeFilter, BrandFilter
   - Add proper spacing between sections
   - Use FilterSection components for collapsibility

6. **Integrate ColorFilter section (Task 47)**
   - Add FilterSection with title "Color"
   - Pass color options and selections
   - Handle color selection changes
   - Default to expanded state

7. **Integrate SizeFilter section (Task 48)**
   - Add FilterSection with title "Size"
   - Pass size options and selections
   - Handle size selection changes
   - Default to expanded state

8. **Integrate BrandFilter section (Task 49)**
   - Add FilterSection with title "Brand"
   - Pass brand options and selections
   - Handle brand selection changes
   - Default to collapsed state

9. **Implement selection logic**
   - Support multiple selections per attribute
   - Update URL parameters with selected values
   - Format as comma-separated strings in URL
   - Parse URL params back to array on mount

10. **Add active filter count badges**
    - Calculate count per attribute type
    - Pass count to FilterSection components
    - Display badge next to section title
    - Update dynamically as selections change

### Attribute Filters Structure

```
┌─────────────────────────────┐
│ ▼ Color          (2)        │
│   ● Red                     │
│   ● Blue                    │
│   ○ Green                   │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ▼ Size           (1)        │
│   □ S                       │
│   ☑ M                       │
│   □ L                       │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ▶ Brand                     │
│   (Collapsed)               │
└─────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| attributes | AttributeOptions | Yes | Available attribute options |
| selectedAttributes | SelectedAttributes | Yes | Current selections |
| onChange | (type, values) => void | Yes | Selection handler |

### Attribute Data Structures

```typescript
interface AttributeOption {
  id: string;
  name: string;
  value: string;
  count: number;
  color?: string; // For color swatches
}

interface ProductAttribute {
  type: 'color' | 'size' | 'brand';
  label: string;
  options: AttributeOption[];
}

interface AttributeOptions {
  colors: AttributeOption[];
  sizes: AttributeOption[];
  brands: AttributeOption[];
}

interface SelectedAttributes {
  color: string[];
  size: string[];
  brand: string[];
}
```

### URL Parameter Format

| Attribute | Parameter | Format | Example |
|-----------|-----------|--------|---------|
| Color | `color` | Comma-separated | `?color=red,blue` |
| Size | `size` | Comma-separated | `?size=M,L,XL` |
| Brand | `brand` | Comma-separated | `?brand=nike,adidas` |
| Combined | Multiple params | & separator | `?color=red&size=M,L&brand=nike` |

### Section Configuration

| Section | Title | Default State | Order |
|---------|-------|---------------|-------|
| Color | "Color" | Expanded | 1 |
| Size | "Size" | Expanded | 2 |
| Brand | "Brand" | Collapsed | 3 |

### Active Filter Count Calculation

```
Color Section:
- Selected: ["red", "blue"]
- Count: 2
- Display: "Color (2)"

Size Section:
- Selected: ["M", "L", "XL"]
- Count: 3
- Display: "Size (3)"

Brand Section:
- Selected: []
- Count: 0
- Display: "Brand" (no badge)
```

### Selection Change Handler

```typescript
const handleAttributeChange = (
  attributeType: 'color' | 'size' | 'brand',
  values: string[]
) => {
  // Update URL search params
  const params = new URLSearchParams(searchParams);
  
  if (values.length > 0) {
    params.set(attributeType, values.join(','));
  } else {
    params.delete(attributeType);
  }
  
  router.push(`?${params.toString()}`);
};
```

### State Management Flow

```
URL Params                    Component State              Child Components
┌──────────────┐             ┌─────────────────┐         ┌──────────────┐
│ ?color=red   │────────────▶│ selectedColor:  │────────▶│ ColorFilter  │
│ &size=M,L    │             │   ["red"]       │         │              │
│ &brand=nike  │             │ selectedSize:   │────────▶│ SizeFilter   │
└──────────────┘             │   ["M", "L"]    │         │              │
      ▲                      │ selectedBrand:  │────────▶│ BrandFilter  │
      │                      │   ["nike"]      │         │              │
      │                      └─────────────────┘         └──────────────┘
      │                              │                           │
      └──────────────────────────────┴───────────────────────────┘
                        onChange handler
```

### Container Layout

| Element | Styling | Purpose |
|---------|---------|---------|
| Container | space-y-0 | No spacing (sections have borders) |
| FilterSection | border-b | Section separator |
| Last Section | border-b-0 | No border on last |

### Expected Outcome
- Container component for color, size, and brand filters
- Proper integration with FilterSection for collapsibility
- URL parameter-based state management
- Active filter count badges on section headers
- Selection changes update URL and trigger product filtering
- Foundation for specific attribute filter components

### Verification Checklist
- [ ] `AttributeFilters.tsx` file created
- [ ] Component structure for three filter sections
- [ ] ColorFilter section placeholder/integration
- [ ] SizeFilter section placeholder/integration
- [ ] BrandFilter section placeholder/integration
- [ ] URL parameters read and parsed correctly
- [ ] Selection changes update URL params
- [ ] Active filter counts calculated accurately
- [ ] Count badges display on section headers
- [ ] Default expansion states configured
- [ ] onChange handler updates state properly
- [ ] Component exports properly

---

## Summary

This document established the filter sidebar foundation with collapsible sections, category filtering with hierarchical checkboxes, price range filtering with slider and inputs, and the base structure for attribute filters. These components provide the core filtering functionality for the product catalog.

### Completed Tasks
1. ✓ Created FilterSidebar component with header and mobile drawer
2. ✓ Created FilterSection component for collapsible sections
3. ✓ Created FilterSectionHeader with expand/collapse functionality
4. ✓ Created FilterSectionContent with smooth animations
5. ✓ Created CategoryFilter with hierarchical checkbox list
6. ✓ Created CategoryCheckbox with indentation and count display
7. ✓ Created PriceRangeFilter with slider and input integration
8. ✓ Created PriceSlider with dual handles and visual feedback
9. ✓ Created PriceInputs with validation and formatting
10. ✓ Created AttributeFilters container for color, size, and brand

### Next Steps
Proceed to [02_Tasks-47-54_Color-Size-Brand-Availability.md](02_Tasks-47-54_Color-Size-Brand-Availability.md) to implement the specific attribute filter components (ColorFilter, SizeFilter, BrandFilter), availability filters (in stock, on sale), filter action buttons (apply, clear), and verify the complete filter functionality.
