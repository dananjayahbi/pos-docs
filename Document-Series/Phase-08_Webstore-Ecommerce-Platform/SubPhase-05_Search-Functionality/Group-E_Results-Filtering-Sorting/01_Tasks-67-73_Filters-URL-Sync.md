# Group E - Document 01: Results Filtering & URL Sync (Tasks 67-73)

## Navigation
- **Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **Previous:** None (First document in Group E)
- **Next:** [02_Tasks-74-80_Sort-Mobile.md](./02_Tasks-74-80_Sort-Mobile.md)

---

## Overview

### Purpose
This document provides comprehensive instructions for implementing the search results filtering system with URL synchronization. This includes creating a filter sidebar with multiple filter types (category, price range, dynamic attributes), an active filters display bar, and complete URL synchronization for shareable filter states.

### Scope
- **Tasks Covered:** 67-73
- **Components:** 7 major filtering components
- **Estimated Effort:** 16-20 hours
- **Complexity:** High (URL sync, dynamic filters, state management)

### Task Breakdown

**Task 67: Create Results Filter Sidebar**
- Collapsible sidebar component
- Desktop/mobile responsive layout
- Filter group organization
- Loading states and skeletons

**Task 68: Create Category Filter**
- Hierarchical category checkboxes
- Result counts per category
- Parent-child relationships
- Expand/collapse functionality

**Task 69: Create Price Range Filter (min-max LKR)**
- Dual input fields (min/max)
- LKR currency formatting
- Range validation
- Quick preset buttons

**Task 70: Create Attribute Filters (dynamic)**
- Dynamic filter generation
- Color swatches
- Size selectors
- Brand checkboxes
- Custom attributes support

**Task 71: Create Active Filters Bar**
- Horizontal chips display
- Individual filter removal
- Visual grouping by type
- Mobile-optimized layout

**Task 72: Create Clear All Filters**
- Single-click clear button
- Confirmation dialog (optional)
- Reset to default state
- Preserve search query

**Task 73: Create Filter URL Sync**
- Query parameter encoding
- URL updates without page reload
- Shareable filter links
- Browser back/forward support

---

## Prerequisites

### Completed Dependencies
- SubPhase-03 Catalog Browsing (filter patterns)
- Group A: Search state store
- Group B: Search input component
- Group C: Results display
- Group D: Pagination system

### Required Knowledge
- Pinia store patterns
- Vue Router query params
- URL encoding/decoding
- Debouncing techniques
- CSS Grid/Flexbox

### Reusable Components
Leverage existing components from SubPhase-03:
- Filter sidebar layout structure
- Checkbox filter components
- Price range slider patterns
- Attribute filter components
- URL synchronization utilities

---

## Architecture Overview

### Component Hierarchy

```
SearchResultsPage
├── SearchFiltersPanel (Task 67)
│   ├── CategoryFilter (Task 68)
│   ├── PriceRangeFilter (Task 69)
│   └── AttributeFilters (Task 70)
│       ├── ColorFilter
│       ├── SizeFilter
│       ├── BrandFilter
│       └── CustomAttributeFilter
├── ActiveFiltersBar (Task 71)
│   ├── FilterChip (individual filter)
│   └── ClearAllButton (Task 72)
└── SearchResults
    └── ProductGrid
```

### State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Filter Interaction                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Update Search Store State                       │
│  (selectedCategories, priceRange, selectedAttributes)       │
└────────────────────────┬────────────────────────────────────┘
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
    ┌──────────────────┐  ┌──────────────────┐
    │  Update URL      │  │  Trigger API     │
    │  Query Params    │  │  Search Request  │
    └──────────────────┘  └──────────────────┘
                │                 │
                │                 ▼
                │        ┌──────────────────┐
                │        │  Update Results  │
                │        │  & Filter Counts │
                │        └──────────────────┘
                │                 │
                └────────┬────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │  Update Active Filters   │
            │  Bar & Filter Sidebar    │
            └──────────────────────────┘
```

### URL Structure Pattern

```
Base URL: /search

Query Parameters:
- q=search+term
- categories=cat1,cat2,cat3
- min_price=1000
- max_price=50000
- colors=red,blue
- sizes=M,L,XL
- brands=nike,adidas
- page=2
- sort=price_asc

Example:
/search?q=running+shoes&categories=footwear&min_price=5000&max_price=20000&colors=red,blue&sizes=42,43&brands=nike&page=1&sort=price_asc
```

---

## Task 67: Create Results Filter Sidebar

### Objective
Implement a responsive filter sidebar that serves as the container for all filter types, with proper layout, collapsibility, and loading states.

### Component Structure

#### Main Sidebar Component
Create a dedicated filter sidebar component that:
- Renders on the left side of search results (desktop)
- Converts to bottom sheet or off-canvas panel (mobile)
- Contains all filter group sections
- Manages overall sidebar state (open/closed)
- Handles sticky positioning on scroll
- Shows loading skeleton during filter data fetch

#### Layout Requirements

**Desktop Layout:**
- Fixed width sidebar (280-320px)
- Sticky positioning after scroll threshold
- Always visible alongside results
- Smooth scroll within sidebar
- Maximum height with internal scroll

**Tablet Layout:**
- Collapsible sidebar with toggle button
- Overlay mode option
- Reduced width (240px)
- Touch-optimized controls

**Mobile Layout:**
- Bottom sheet modal presentation
- Full-width filter panel
- Slide-up animation
- Backdrop overlay
- Fixed "Apply Filters" button at bottom
- Show filter count in trigger button

### Sidebar Header

Create sidebar header with:
- "Filters" title text
- Filter count indicator (e.g., "3 active")
- Close button (mobile)
- Clear all filters link (desktop)
- Collapse/expand all sections toggle

### Filter Group Organization

Organize filters into logical sections:
1. **Categories** (always first)
2. **Price Range** (second)
3. **Dynamic Attributes** (sorted by relevance)
   - Color
   - Size
   - Brand
   - Material
   - Other custom attributes

#### Section Headers
Each filter group should have:
- Bold section title
- Expand/collapse icon
- Result count affected (optional)
- "Reset section" link (when filters applied)

### Collapsibility Logic

Implement expand/collapse for filter sections:
- Store expansion state in local component state
- Default: Categories expanded, others collapsed
- Persist expansion state in sessionStorage
- Smooth height transition animations
- Icon rotation animation (chevron)

### Loading States

#### Initial Load Skeleton
Show skeleton placeholders while fetching filter options:
- Shimmer effect on filter sections
- Placeholder checkboxes (3-5 per section)
- Placeholder text lines
- Disabled interaction during load

#### Filter Update Loading
When applying filters that trigger new results:
- Dim filter sidebar slightly
- Show small spinner in header
- Disable filter interactions
- Update result counts after load

### Empty States

Handle scenarios with no available filters:
- Display message "No filters available"
- Hide empty filter sections
- Show only search query clear option

### Sticky Behavior

Implement sticky sidebar for desktop:
- Calculate available viewport height
- Stick sidebar header when scrolling
- Keep filter groups scrollable
- Maintain position on filter changes
- Reset scroll position on new search

### Mobile Filter Trigger

Create filter button for mobile view:
- Fixed position button showing filter count
- "Filters (3)" text with icon
- Badge indicator for active filters
- Opens bottom sheet on click
- Maintains scroll position when closed

### Responsive Breakpoints

Define layout transitions:
- **Desktop:** >= 1024px (sidebar always visible)
- **Tablet:** 768px - 1023px (collapsible sidebar)
- **Mobile:** < 768px (bottom sheet modal)

### Accessibility Requirements

Ensure filter sidebar is accessible:
- ARIA labels for all interactive elements
- Keyboard navigation support (Tab, Enter, Space)
- Focus trap in mobile modal
- Screen reader announcements for filter counts
- Clear focus indicators
- Semantic HTML structure (nav, section, button)

### Implementation Steps

1. **Create Base Sidebar Component**
   - Set up component structure with props and emits
   - Define responsive layout classes
   - Implement mobile/desktop conditional rendering

2. **Add Sidebar Header**
   - Create header with title and controls
   - Implement active filter counter
   - Add close button for mobile

3. **Implement Section Container**
   - Create reusable filter section wrapper
   - Add expand/collapse functionality
   - Implement section header with controls

4. **Add Loading States**
   - Create skeleton component for loading
   - Implement loading overlay for updates
   - Add transition animations

5. **Implement Mobile Bottom Sheet**
   - Create modal overlay component
   - Add slide-up animation
   - Implement backdrop click to close
   - Add fixed "Apply" button footer

6. **Add Sticky Behavior**
   - Calculate sticky offset based on header height
   - Implement IntersectionObserver for scroll detection
   - Add smooth scrolling within sidebar

7. **Test Responsiveness**
   - Verify layout on all breakpoints
   - Test touch interactions on mobile
   - Validate keyboard navigation
   - Check accessibility with screen readers

### Integration Points

**Store Integration:**
- Read filter availability from search store
- Update filter selection in store
- Subscribe to loading states
- Sync with URL parameters

**Event Handling:**
- Emit filter change events to parent
- Handle "Apply Filters" action (mobile)
- Trigger filter clear events
- Update URL on filter changes

### Visual Design Guidance

**Colors:**
- Background: White or light gray (#FAFAFA)
- Borders: Light gray (#E0E0E0)
- Section headers: Dark gray text (#424242)
- Active filters: Primary color accent

**Spacing:**
- Section padding: 16px
- Section gap: 20px
- Filter item spacing: 12px
- Header padding: 20px

**Typography:**
- Sidebar title: 18px bold
- Section headers: 14px bold
- Filter labels: 14px regular
- Counts: 12px regular

### Performance Considerations

- Lazy load filter options for collapsed sections
- Debounce filter changes to reduce API calls
- Virtualize long filter lists (100+ items)
- Memoize filter counts calculations
- Use CSS transforms for animations (GPU acceleration)

---

## Task 68: Create Category Filter

### Objective
Implement a hierarchical category filter with checkboxes, result counts, parent-child relationships, and expand/collapse functionality for nested categories.

### Category Filter Structure

#### Hierarchical Display
Create a tree structure that:
- Shows top-level categories first
- Displays child categories indented beneath parents
- Supports up to 3-4 levels of nesting
- Shows category hierarchy breadcrumb style
- Maintains visual parent-child relationships

#### Category Data Structure

Expect category data in this format:
```
{
  id: "cat-123",
  name: "Men's Clothing",
  slug: "mens-clothing",
  count: 45,
  parent_id: null,
  children: [
    {
      id: "cat-124",
      name: "Shirts",
      slug: "mens-shirts",
      count: 15,
      parent_id: "cat-123",
      children: []
    }
  ]
}
```

### Checkbox Behavior

#### Individual Checkbox Logic
Each category checkbox should:
- Allow independent selection
- Show checked state when selected
- Display indeterminate state when some children selected
- Update result count immediately
- Trigger filter update on change

#### Parent-Child Selection Rules

**When Parent Selected:**
- Automatically select all child categories
- Show parent as checked
- Show children as checked
- Apply all category filters to search

**When All Children Selected:**
- Show parent as checked (not indeterminate)
- Individual children remain independently selectable

**When Some Children Selected:**
- Show parent as indeterminate (partial checkbox)
- Parent checkbox becomes tri-state control
- Clicking parent selects all remaining children

**When Parent Unselected:**
- Automatically unselect all child categories
- Clear all selections in that branch
- Update results to remove category filter

### Result Count Display

Show product counts for each category:
- Display count in parentheses: "Shirts (15)"
- Update counts based on current filters
- Gray out categories with 0 results
- Show "(0)" for unavailable categories
- Recalculate counts when other filters change

#### Count Update Logic
- Initial load: Show total counts for each category
- After filtering: Show counts within current result set
- Disable categories with 0 matching products
- Maintain counts for selected categories (show current selection)

### Expand/Collapse Functionality

#### Collapsible Category Groups
For categories with children:
- Show chevron icon (right-pointing when collapsed, down when expanded)
- Click chevron or category name to expand/collapse
- Checkbox remains independent of expand/collapse
- Smooth height transition animation
- Persist expansion state during session

#### Default Expansion State
- Top-level categories: Expanded by default
- Categories with selected children: Expanded
- Other nested categories: Collapsed by default
- Remember user's expansion preferences

### Visual Hierarchy

#### Indentation Levels
Use progressive indentation:
- Level 1 (top-level): No indentation
- Level 2: 20px left padding
- Level 3: 40px left padding
- Level 4: 60px left padding

#### Visual Cues
- Parent categories: Bold text
- Child categories: Regular weight
- Selected categories: Primary color text
- Disabled categories: Gray text with reduced opacity
- Hover state: Light background color

### Search Within Categories

Add category search input (optional):
- Filter category list by name
- Highlight matching text
- Preserve hierarchy in results
- Show parent categories of matches
- Clear search button

### Popular Categories Section

Consider showing popular categories:
- Display top 5-8 most searched categories
- Place above full category list
- Quick-select checkboxes
- "View All Categories" expand button

### Mobile Optimization

**Mobile-Specific Behavior:**
- Larger touch targets (44px minimum)
- Full-width category items
- Simplified hierarchy (limit nesting display)
- Swipe to close expanded categories
- Fixed section height with scroll

### Implementation Steps

1. **Create Category Filter Component**
   - Set up component with props for category data
   - Define state for selected categories
   - Implement expand/collapse state management

2. **Render Category Tree**
   - Create recursive category rendering function
   - Apply proper indentation levels
   - Add expand/collapse icons

3. **Implement Checkbox Logic**
   - Handle individual category selection
   - Implement parent-child selection cascade
   - Add indeterminate state calculation
   - Emit selection changes to parent

4. **Add Result Counts**
   - Display count beside each category
   - Implement count update logic
   - Disable categories with 0 results
   - Style disabled state appropriately

5. **Add Expand/Collapse Interaction**
   - Toggle category expansion on click
   - Animate height transitions
   - Rotate chevron icons
   - Persist expansion state

6. **Integrate with Search Store**
   - Update selectedCategories in store
   - Read available categories from store
   - Subscribe to category count updates
   - Sync with URL parameters

7. **Test Interactions**
   - Verify parent-child selection logic
   - Test expand/collapse animations
   - Validate result count updates
   - Check mobile touch interactions

### Accessibility Requirements

- Use proper ARIA roles (tree, treeitem)
- Implement keyboard navigation (Arrow keys, Space, Enter)
- Announce expansion state changes
- Provide clear labels for checkboxes
- Support screen reader navigation through hierarchy
- Add aria-expanded attributes

### Edge Cases to Handle

**No Categories Available:**
- Hide category filter section
- Show message if search expects categories

**Single Category:**
- Show without nesting UI
- Simple checkbox without hierarchy

**Deep Nesting (4+ levels):**
- Consider flattening display
- Use breadcrumb-style labels
- Limit visible nesting depth

**All Categories Selected:**
- Consider showing "All" as selected
- Optimize query (don't send category filter if all selected)

**Category Data Loading:**
- Show skeleton placeholders
- Handle loading errors gracefully
- Retry failed category fetches

---

## Task 69: Create Price Range Filter (min-max LKR)

### Objective
Implement a price range filter with min/max input fields, LKR currency formatting, validation, and optional preset range buttons for quick filtering.

### Price Range Component Structure

#### Dual Input Layout
Create two input fields:
- **Minimum Price:** Left input field
- **Maximum Price:** Right input field
- Separated by dash or "to" text
- Aligned horizontally
- Clear visual grouping

### Input Field Configuration

#### Number Input Setup
Each price input should:
- Use type="number" with step="100"
- Accept only positive integers
- Allow clearing the field (set to empty)
- Show LKR currency symbol or label
- Format on blur (add thousand separators)
- Remove formatting on focus (raw number)

#### LKR Currency Formatting

**Display Format:**
- Use Sri Lankan Rupee notation
- Add thousand separators (commas): "50,000"
- Prefix or suffix with "LKR" or "Rs."
- No decimal places (whole numbers only)
- Example: "LKR 5,000" or "Rs. 5,000"

**Input Format:**
- Allow typing without separators: "5000"
- Auto-format on blur: "5,000"
- Strip formatting on focus for editing
- Preserve cursor position during format

### Validation Logic

#### Range Validation Rules
Implement validation for:
- Minimum cannot exceed maximum
- Maximum cannot be less than minimum
- Both values must be positive or zero
- Values should be reasonable (max limit: 10,000,000)
- Empty fields treated as "no limit"

#### Error States
Show validation errors:
- Red border on invalid field
- Error message below inputs
- "Min price cannot exceed max price"
- Clear error on correction
- Prevent filter application when invalid

#### Real-time Validation
- Validate on blur (after user leaves field)
- Show warning icon for invalid state
- Allow typing before validation
- Validate before applying filter

### Preset Price Ranges

#### Quick Select Buttons
Create preset range buttons:
- Common price ranges for quick selection
- Radio button or chip style
- Deselect when custom values entered
- Optimized for local market (LKR)

#### Suggested Presets for Sri Lanka Market
- Under 1,000
- 1,000 - 5,000
- 5,000 - 10,000
- 10,000 - 25,000
- 25,000 - 50,000
- Above 50,000

#### Preset Behavior
- Single selection (radio button logic)
- Populate min/max inputs when clicked
- Highlight selected preset
- Clear preset when custom values entered
- Apply filter immediately on preset selection

### Dynamic Price Range Bounds

#### Determine Available Range
Calculate price bounds from search results:
- Fetch minimum product price in results
- Fetch maximum product price in results
- Display available range hint
- Disable values outside available range
- Update bounds when other filters change

#### Range Indicator
Show visual hint of available range:
- "Price range: LKR 500 - 50,000"
- Display below or above inputs
- Update dynamically with filters
- Help users understand available options

### Slider Alternative (Optional)

Consider dual-handle range slider:
- Visual representation of price range
- Drag handles to set min/max
- Show current values during drag
- Snap to price increments
- Sync with input fields
- Better for touch devices

**Slider Configuration:**
- Min: 0 or lowest product price
- Max: Highest product price or 100,000
- Step: 100 or 1,000 (based on range)
- Show tooltips with formatted values
- Logarithmic scale for large ranges

### Apply Filter Behavior

#### Filter Application Timing
Choose one approach:
- **Immediate:** Update on every input change (debounced)
- **On Blur:** Apply when user leaves input field
- **Manual Apply:** Require "Apply" button click (mobile)

#### Debouncing
If using immediate updates:
- Debounce input changes (500-800ms)
- Show loading indicator during debounce
- Cancel pending updates on new input
- Avoid excessive API calls

### Clear Price Range

Provide clear functionality:
- "X" button in each input field
- Clear icon to reset both fields
- Remove price range from active filters
- Reset to full price range
- Update results immediately

### Mobile Optimization

**Mobile-Specific Enhancements:**
- Larger input fields (44px height)
- Numeric keyboard on focus
- Preset buttons above inputs
- Simpler validation messages
- Full-width layout
- Slider preferred over dual inputs

### Implementation Steps

1. **Create Price Range Component**
   - Set up component structure with two input fields
   - Add LKR currency labels
   - Implement basic layout

2. **Add Number Formatting**
   - Create utility function for LKR formatting
   - Add thousand separators
   - Handle format/unformat on focus/blur
   - Implement cursor position preservation

3. **Implement Validation**
   - Add min/max validation logic
   - Show error states and messages
   - Prevent invalid range submission
   - Clear errors on correction

4. **Add Preset Buttons**
   - Create preset range buttons
   - Implement selection logic
   - Populate inputs on preset click
   - Style active preset

5. **Implement Dynamic Bounds**
   - Fetch price range from search results
   - Display available range hint
   - Update on filter changes

6. **Add Debouncing**
   - Implement debounce utility
   - Apply to input changes
   - Show loading state during debounce

7. **Integrate with Store**
   - Update priceRange in search store
   - Read current price range from store
   - Sync with URL parameters
   - Trigger search on change

8. **Add Clear Functionality**
   - Create clear button for each input
   - Implement reset logic
   - Update store and URL

9. **Test Validation and Formatting**
   - Test various input scenarios
   - Verify formatting consistency
   - Validate error handling
   - Check mobile keyboard behavior

### Accessibility Requirements

- Label inputs clearly ("Minimum Price", "Maximum Price")
- Announce validation errors to screen readers
- Support keyboard navigation (Tab, Enter)
- Provide clear focus indicators
- Add aria-invalid for error states
- Use aria-describedby for error messages

### Edge Cases to Handle

**Empty Results:**
- Hide price filter if no products
- Show appropriate message

**Single Price Point:**
- All products same price
- Disable or hide filter

**Very Large Price Ranges:**
- Use logarithmic slider scale
- Adjust preset ranges dynamically
- Format large numbers properly (lakhs notation)

**Currency Conversion:**
- Support USD/LKR toggle (future)
- Show converted values
- Maintain LKR in URL

**Invalid Input:**
- Non-numeric characters
- Negative numbers
- Decimal values
- Very large numbers

---

## Task 70: Create Attribute Filters (dynamic)

### Objective
Implement dynamic attribute filters that adapt based on available product attributes in search results, including color swatches, size selectors, brand checkboxes, and custom attribute filters.

### Dynamic Filter Generation

#### Attribute Detection
Automatically generate filters based on:
- Product attributes present in search results
- Attribute types (color, size, brand, material, etc.)
- Attribute value distribution
- Minimum threshold (e.g., hide if < 3 products)

#### Filter Priority Order
Display filters in logical order:
1. **Color** (visual, high priority)
2. **Size** (common filter)
3. **Brand** (popular filter)
4. **Material** (product dependent)
5. **Custom attributes** (alphabetically sorted)

### Color Filter

#### Visual Swatch Display
Create color filter with:
- Color swatches (circular or square)
- Actual color representation (hex codes)
- Color name on hover
- Checkmark on selected colors
- Support for 20+ colors
- Grid layout (4-5 per row)

#### Color Swatch Specifications

**Swatch Design:**
- Size: 36x36px (desktop), 44x44px (mobile)
- Border: 2px solid #E0E0E0
- Border radius: 50% (circular) or 4px (square)
- Selected: 3px border in primary color
- Hover: Scale up slightly (1.1x)
- Checkmark icon on selection (white or black contrast)

**Color Patterns:**
Handle special color types:
- Solid colors: Fill with hex color
- Multicolor: Show split or gradient
- Pattern: Show small pattern preview
- Metallic: Add shine effect
- White: Add visible border

#### Color Names
Display color name:
- Show on hover tooltip
- Include in accessibility label
- Support multi-language color names
- Group similar colors (e.g., "Blue shades")

#### Multiple Color Selection
- Allow selecting multiple colors (checkbox behavior)
- Show product count per color
- Filter products matching ANY selected color (OR logic)
- Clear individual colors or all at once

### Size Filter

#### Size Display Options

**Standard Sizes (Clothing):**
- Show as button grid: XS, S, M, L, XL, XXL
- Highlight selected sizes
- Show availability count
- Disable unavailable sizes
- Support international size standards (US, UK, EU)

**Numeric Sizes (Shoes):**
- Display as number grid
- Range from smallest to largest
- Half sizes included
- Show both US and UK sizes (optional)
- Example: 6, 6.5, 7, 7.5, 8...

**Custom Size Ranges:**
- For variable products (e.g., furniture)
- Show as dimension ranges
- Use appropriate units (cm, inches, etc.)

#### Size Selection UI

**Button Grid Layout:**
- Equal size buttons (48x48px)
- 4-6 buttons per row
- Active state: Primary color background
- Disabled state: Gray with strikethrough
- Hover state: Border highlight

**Multiple Selection:**
- Allow selecting multiple sizes
- Show product count per size
- Clear selection option
- Apply OR logic (products matching any size)

### Brand Filter

#### Brand Checkbox List
Create scrollable brand list:
- Alphabetically sorted
- Checkbox beside each brand
- Product count per brand
- Search/filter brand list (if 20+ brands)
- Brand logos (optional enhancement)

#### Brand Display Options

**Standard List:**
- Checkbox + brand name + count
- Example: "☐ Nike (23)"
- Maximum 10 visible, then scroll
- "Show more" expansion button

**Popular Brands:**
- Show top 5-8 brands first
- Sorted by product count
- "View all brands" expansion
- Quick access to common brands

#### Brand Search
For large brand lists (20+):
- Add search input at top
- Filter brands by name
- Highlight matching text
- Show match count
- Clear search button

### Material Filter

Similar to brand filter with:
- Checkbox list of materials
- Relevant to product category
- Examples: Cotton, Polyester, Leather, Wood, Metal
- Multiple selection allowed
- Product count per material

### Custom Attribute Filters

#### Generic Attribute Handler
Create reusable component for any attribute:
- Adapt UI based on attribute type
- Handle various data formats
- Support multiple selection
- Show product counts
- Consistent styling

#### Attribute Types

**Text Attributes:**
- Display as checkbox list
- Examples: Features, specifications
- Searchable if many options

**Boolean Attributes:**
- Single checkbox or toggle
- Examples: "In Stock", "On Sale", "Free Shipping"
- Binary yes/no filters

**Numeric Attributes:**
- Range slider or min/max inputs
- Examples: Weight, dimensions, ratings
- Show units appropriately

**Multi-value Attributes:**
- Multiple checkboxes
- Tag-style selection
- Examples: Compatible devices, included accessories

### Filter Availability Logic

#### Dynamic Show/Hide
- Only show filters with available options
- Hide empty attribute filters
- Show filters based on category
- Adjust filters when results change

#### Product Count Updates
For each attribute value:
- Show current product count
- Update counts when other filters change
- Gray out options with 0 products
- Maintain selected filters even if count=0

### Collapsible Attribute Sections

Each attribute filter should:
- Have expand/collapse functionality
- Start collapsed except color and size (initially expanded)
- Save expansion state in session
- Smooth animation on toggle
- Icon rotation (chevron)

### "Show More" Expansion

For filters with many options:
- Show top 5-8 initially
- "Show more" button to expand
- "Show less" to collapse back
- Remember expansion state
- Load additional options lazily

### Mobile Optimization

**Mobile Considerations:**
- Larger touch targets (44x44px minimum)
- Color swatches in 3-4 column grid
- Size buttons in 3 column grid
- Simplified brand list
- Drawer-style attribute panels
- Fixed "Apply" button at bottom

### Implementation Steps

1. **Create Base Attribute Filter Component**
   - Reusable component accepting attribute data
   - Props for attribute type, values, counts
   - Emit selection changes

2. **Implement Color Filter**
   - Create color swatch grid
   - Add selection logic
   - Display color names
   - Handle special color types

3. **Implement Size Filter**
   - Create size button grid
   - Handle different size types (text/numeric)
   - Add selection logic
   - Show availability states

4. **Implement Brand Filter**
   - Create checkbox list
   - Add alphabetical sorting
   - Implement search (if needed)
   - Show popular brands first

5. **Create Generic Attribute Handler**
   - Build reusable component
   - Support multiple attribute types
   - Handle various selection modes

6. **Add Dynamic Filter Generation**
   - Detect available attributes from results
   - Generate appropriate filter UI
   - Apply priority ordering
   - Handle empty states

7. **Implement Collapsible Sections**
   - Add expand/collapse for each filter
   - Save expansion state
   - Animate transitions

8. **Add "Show More" Logic**
   - Limit initial visible options
   - Create expand button
   - Load additional options

9. **Integrate with Store**
   - Update selectedAttributes in store
   - Read available attributes from API
   - Subscribe to count updates
   - Sync with URL parameters

10. **Test All Attribute Types**
    - Verify color swatch interactions
    - Test size selection logic
    - Validate brand filtering
    - Check custom attribute handling

### Accessibility Requirements

- Proper labels for all attribute options
- Keyboard navigation support
- Screen reader friendly labels
- Color contrast for swatches (WCAG AA)
- Focus indicators on all interactive elements
- ARIA attributes for checkboxes and toggles
- Announce selection changes

### Visual Design Guidance

**Color Swatches:**
- Size: 36x36px (desktop), 44x44px (mobile)
- Spacing: 8px gap between swatches
- Selected: 3px primary color border + checkmark
- Hover: 1.1x scale + shadow

**Size Buttons:**
- Size: 48x48px
- Font: 14px medium weight
- Active: Primary color background, white text
- Inactive: White background, border
- Disabled: Gray background, strikethrough

**Checkboxes:**
- Standard checkbox size: 20x20px
- Label: 14px regular
- Count: 12px gray text
- Spacing: 12px between items

---

## Task 71: Create Active Filters Bar

### Objective
Implement a horizontal bar that displays all currently active filters as removable chips, with visual grouping by filter type and mobile-optimized layout.

### Active Filters Bar Position

#### Desktop Placement
Position the active filters bar:
- Above search results grid
- Below search query and pagination
- Full width of results area
- Sticky position on scroll (optional)
- Clear separation from results

#### Mobile Placement
- Below search input
- Above results count
- Horizontal scroll if needed
- Compact chip design
- Fixed position option

### Filter Chip Design

#### Individual Chip Structure
Each filter chip should contain:
- Filter type prefix (optional): "Color:", "Size:"
- Filter value: "Red", "Large", "Nike"
- Remove button: "X" icon
- Clear visual grouping

#### Chip Visual Specifications

**Desktop Chips:**
- Height: 32px
- Padding: 8px 12px
- Border radius: 16px (pill shape)
- Background: Light gray (#F5F5F5)
- Border: 1px solid #E0E0E0
- Text: 14px regular
- Remove icon: 16x16px, right side

**Mobile Chips:**
- Height: 36px (larger touch target)
- Padding: 8px 14px
- Same styling as desktop
- Larger remove button (24x24px)

#### Chip States

**Default State:**
- Light gray background
- Dark text (#424242)
- Subtle border

**Hover State:**
- Slightly darker background
- Border color intensifies
- Cursor pointer on entire chip
- Remove icon highlights

**Focus State:**
- Primary color outline
- Clear keyboard focus indicator

### Filter Type Grouping

#### Visual Grouping Options

**Option 1: Type Prefix Labels**
- Show filter type: "Category: Electronics"
- Different prefix colors per type
- Easy to identify filter source

**Option 2: Separator Dividers**
- Group similar filters together
- Vertical divider between groups
- Example: [Red] [Blue] | [M] [L] | [Nike]

**Option 3: Type Icons**
- Icon before filter value
- Color palette icon for colors
- Tag icon for categories
- Dollar icon for price

### Chip Layout

#### Horizontal Layout
Arrange chips in horizontal flow:
- Wrap to multiple rows if needed
- 8px gap between chips
- 12px gap between rows
- Left-aligned by default
- Scroll horizontally on mobile (single row)

#### Group Organization
Order chips by filter type:
1. Search query (if applicable)
2. Categories
3. Price range
4. Colors
5. Sizes
6. Brands
7. Other attributes

### Price Range Chip

Special handling for price range:
- Combine min/max into single chip
- Format: "LKR 5,000 - 20,000"
- Remove clears entire price range
- Don't show if full range selected

### Search Query Chip

Display search query separately:
- Show as first chip if search query exists
- Format: 'Search: "running shoes"'
- Remove clears search but maintains filters
- Slightly different styling (bolder)

### Remove Individual Filters

#### Remove Button Behavior
Each chip's remove button should:
- Clear only that specific filter
- Update search results immediately
- Animate chip removal (fade out, collapse)
- Update URL parameters
- Maintain other active filters

#### Click Target
- Entire chip clickable to remove (optional)
- Dedicated "X" button for explicit removal
- Provide clear visual feedback
- Prevent accidental removal

### Empty State

When no filters active:
- Hide entire active filters bar
- OR show message: "No filters applied"
- Smooth height transition on show/hide

### Responsive Behavior

#### Desktop (>=1024px)
- Multi-row wrap layout
- All chips visible
- Clear spacing and grouping

#### Tablet (768-1023px)
- Wrap to 2-3 rows maximum
- Scroll if exceeds max rows
- Compact spacing

#### Mobile (<768px)
- Single row horizontal scroll
- Swipe left/right to see all chips
- Scroll indicators (shadows at edges)
- Snap to chips on scroll

### Clear All Integration

Position "Clear All Filters" button:
- At end of active filters bar
- OR as separate button to the right
- Different styling (outlined button)
- Slightly larger than chips
- Always visible when filters active

### Implementation Steps

1. **Create Active Filters Bar Component**
   - Set up component structure
   - Define layout container
   - Implement responsive styles

2. **Create Filter Chip Component**
   - Build reusable chip component
   - Add remove button
   - Implement hover/focus states
   - Add animation for removal

3. **Implement Filter Mapping**
   - Read active filters from store
   - Map filters to chip data
   - Format display values
   - Group by filter type

4. **Add Price Range Formatting**
   - Create special handler for price range
   - Format LKR currency
   - Handle min-only or max-only cases

5. **Add Search Query Chip**
   - Display search term as chip
   - Position first in list
   - Implement removal logic

6. **Implement Remove Logic**
   - Handle individual filter removal
   - Update store state
   - Update URL parameters
   - Trigger search refresh

7. **Add Group Separators**
   - Implement visual grouping
   - Add dividers or type labels
   - Apply group styling

8. **Implement Mobile Scrolling**
   - Add horizontal scroll container
   - Create scroll indicators
   - Implement snap scrolling

9. **Add Empty State**
   - Handle no active filters
   - Hide bar or show message
   - Smooth transition

10. **Test Interactions**
    - Verify chip removal
    - Test mobile scrolling
    - Validate responsive layout
    - Check animation smoothness

### Accessibility Requirements

- Proper labels for each chip and remove button
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements for removals
- ARIA labels: "Remove [filter name] filter"
- Clear focus indicators
- Announce filter count changes

### Visual Design Guidance

**Colors:**
- Chip background: #F5F5F5 (light gray)
- Chip border: #E0E0E0
- Chip text: #424242 (dark gray)
- Remove icon: #757575
- Hover background: #EEEEEE

**Typography:**
- Filter type (if shown): 12px medium, primary color
- Filter value: 14px regular
- Mobile: Same or slightly smaller (13px)

**Spacing:**
- Gap between chips: 8px
- Gap between rows: 12px
- Bar padding: 16px vertical, 0 horizontal
- Remove button padding: 4px

**Animation:**
- Chip removal: Fade out 200ms + collapse
- Chip appearance: Fade in 150ms
- Hover: Transition 100ms

---

## Task 72: Create Clear All Filters

### Objective
Implement a "Clear All Filters" button that resets all active filters to their default state, with optional confirmation dialog and preservation of the search query.

### Clear All Button Design

#### Button Placement Options

**Option 1: In Filter Sidebar**
- Position at top of sidebar header
- Text link or button style
- Always visible
- Next to "Filters" title

**Option 2: In Active Filters Bar**
- At the end of active filter chips
- Styled as outlined button
- Only visible when filters active
- Clear visual distinction from chips

**Option 3: Both Locations**
- Provide in both sidebar and active bar
- Consistent functionality
- Better discoverability

#### Button Styling

**Desktop Style:**
- Text: "Clear All Filters" or "Clear All"
- Button size: 32px height
- Outlined or text button style
- Primary color text
- Icon optional (X or reset icon)
- Hover: Background tint

**Mobile Style:**
- Same styling as desktop
- Slightly larger touch target (40px height)
- May use icon only with label

### Button States

#### Enabled State
When filters are active:
- Button fully visible and clickable
- Primary color text
- Clear hover/focus states
- Cursor pointer

#### Disabled State
When no filters active:
- Hide button entirely (preferred)
- OR show disabled (gray, no interaction)
- Cursor not-allowed if shown

### Clear All Behavior

#### What Gets Cleared
Clear all button should reset:
- All category selections
- Price range (min/max)
- All attribute filters (color, size, brand, etc.)
- Active filters bar
- URL query parameters (except search term)

#### What Gets Preserved
Do NOT clear:
- Search query text
- Pagination state (reset to page 1)
- Sort order (maintain current sort)
- View mode (grid/list)

### Confirmation Dialog (Optional)

#### When to Show Confirmation
Consider confirmation dialog if:
- Many filters are active (5+)
- User might lose complex filter state
- Preference set by user

#### Dialog Design
If implementing confirmation:
- Modal dialog with message
- "Are you sure you want to clear all filters?"
- "Clear All" and "Cancel" buttons
- Checkbox: "Don't ask again"
- Remember user preference

#### Skip Confirmation
Default behavior (no confirmation):
- Immediate clear on click
- Show undo option instead
- Toast notification: "Filters cleared"

### Undo Option

Implement undo functionality:
- Show toast/snackbar after clear
- "Filters cleared. Undo" message
- 5-second timeout
- Click "Undo" to restore filters
- Store previous filter state temporarily

### URL and State Updates

When clearing filters:
- Update search store (reset filter state)
- Update URL (remove filter parameters)
- Keep search query parameter
- Reset to page 1
- Trigger new search request

### Loading State

During filter clear and re-fetch:
- Show loading indicator in results area
- Disable clear button temporarily
- Gray out filter sidebar
- Display loading spinner

### Animation and Feedback

#### Visual Feedback
- Smooth fade out of active filter chips
- Quick collapse animation
- Results area refresh
- Toast notification (optional)

#### Timing
- Chip removal: 200ms stagger
- Results update: Immediate after API response
- Toast duration: 5 seconds

### Mobile Considerations

**Mobile Behavior:**
- Larger touch target (44x44px minimum)
- Position at bottom of filter drawer
- OR in sticky header of filter sheet
- Clear feedback (haptic optional)
- Close filter drawer after clear

### Integration with Filter Modal (Mobile)

In mobile filter bottom sheet:
- Position "Clear All" in header or footer
- Pair with "Apply Filters" button
- Clear and close option
- Maintain visual hierarchy

### Implementation Steps

1. **Create Clear All Button Component**
   - Build button with appropriate styling
   - Add to filter sidebar header
   - Add to active filters bar
   - Implement conditional visibility

2. **Implement Clear Logic**
   - Create action in search store
   - Reset all filter state properties
   - Preserve search query
   - Reset pagination to page 1

3. **Update URL Parameters**
   - Remove all filter query params
   - Keep search query parameter
   - Update browser history
   - Handle back button correctly

4. **Trigger Search Refresh**
   - Call search API with cleared filters
   - Update results display
   - Update filter counts
   - Show loading state during fetch

5. **Add Confirmation Dialog (Optional)**
   - Create modal component
   - Implement user preference storage
   - Handle confirm/cancel actions

6. **Implement Undo Functionality**
   - Store previous filter state
   - Create undo action
   - Show toast notification
   - Restore state on undo click
   - Clear stored state after timeout

7. **Add Animations**
   - Animate chip removal
   - Fade out active filters bar
   - Smooth results transition

8. **Handle Edge Cases**
   - No filters active (hide button)
   - Only search query (don't clear)
   - Loading state during clear
   - API errors on refetch

9. **Test Functionality**
   - Verify all filters cleared
   - Test search query preservation
   - Check URL updates
   - Validate undo functionality
   - Test mobile interactions

### Accessibility Requirements

- Clear button label: "Clear all active filters"
- Keyboard accessible (Tab, Enter)
- Screen reader announcement after clear
- Announce number of filters cleared
- Focus management (return to logical element)
- Confirmation dialog accessible if used

### Edge Cases to Handle

**No Active Filters:**
- Hide or disable clear button
- Don't show if only search query active

**Clear During Loading:**
- Queue clear action
- Cancel pending filter requests
- Show appropriate loading state

**Multiple Quick Clears:**
- Debounce button clicks
- Disable button after first click
- Prevent multiple API calls

**Undo After Navigation:**
- Clear undo state on new search
- Don't persist across sessions

---

## Task 73: Create Filter URL Sync

### Objective
Implement complete synchronization between filter state and URL query parameters, enabling shareable filter links, browser back/forward support, and bookmarkable search states.

### URL Structure Design

#### Query Parameter Schema

Define standard URL parameters:

**Search Query:**
- Parameter: `q`
- Example: `?q=running+shoes`
- Encoding: URL encode spaces and special chars

**Categories:**
- Parameter: `categories` or `cat`
- Format: Comma-separated slugs
- Example: `?categories=mens-clothing,footwear`
- Multiple: `?categories=cat1,cat2,cat3`

**Price Range:**
- Parameters: `min_price`, `max_price`
- Format: Integer values
- Example: `?min_price=5000&max_price=20000`
- Optional: Only include if set

**Colors:**
- Parameter: `colors` or `color`
- Format: Comma-separated values
- Example: `?colors=red,blue,black`

**Sizes:**
- Parameter: `sizes` or `size`
- Format: Comma-separated values
- Example: `?sizes=M,L,XL`
- Handle: URL encode special chars (e.g., 42.5)

**Brands:**
- Parameter: `brands` or `brand`
- Format: Comma-separated slugs
- Example: `?brands=nike,adidas,puma`

**Custom Attributes:**
- Parameter: `attr_[attribute_name]`
- Format: Comma-separated values
- Example: `?attr_material=cotton,polyester`

**Pagination:**
- Parameter: `page`
- Format: Integer
- Example: `?page=2`
- Default: page=1 (omit from URL)

**Sorting:**
- Parameter: `sort`
- Format: Sort key string
- Example: `?sort=price_asc`
- Values: `relevance`, `price_asc`, `price_desc`, `newest`, `rating`

#### Complete URL Example

```
/search?q=t-shirts&categories=mens-clothing&min_price=1000&max_price=5000&colors=blue,red&sizes=M,L&brands=nike&attr_material=cotton&page=1&sort=price_asc
```

### URL Encoding and Decoding

#### Encoding Rules

**URL Encoding:**
- Use `encodeURIComponent()` for all values
- Encode spaces as `+` or `%20`
- Encode special characters (&, =, ?, etc.)
- Maintain comma separators (don't encode)
- Lowercase parameter names

**Array Values:**
- Join with commas: `value1,value2,value3`
- No brackets or extra symbols
- Maintain order if relevant

#### Decoding Rules

**URL Decoding:**
- Use `decodeURIComponent()` for all values
- Split comma-separated values into arrays
- Parse numbers for price, page
- Handle missing parameters (use defaults)
- Validate decoded values

### Sync Timing and Updates

#### When to Update URL

Update URL on:
- Filter selection/deselection
- Price range change
- Category selection
- Attribute filter change
- Sort order change
- Pagination change

#### Debouncing URL Updates

For frequent changes (price input):
- Debounce URL updates (300-500ms)
- Batch multiple filter changes
- Update once when user stops typing
- Avoid excessive history entries

#### History Management

**Push vs Replace:**
- **Push state:** Filter changes (user can go back)
- **Replace state:** Price typing (continuous input)
- **Replace state:** Pagination within same filters
- **Push state:** New search query

Use `router.push()` or `router.replace()` appropriately.

### Browser Back/Forward Support

#### Handling Navigation

Listen for browser navigation events:
- Detect back/forward button usage
- Read URL parameters
- Update filter store state
- Trigger search with URL filters
- Update UI to match URL state

#### Implementation Approach

**Vue Router Integration:**
- Use route query watchers
- Listen to `$route.query` changes
- Update store on query change
- Trigger search when route changes

**Navigation Guards:**
- Validate URL parameters on navigation
- Handle invalid filter values
- Redirect to valid state if needed

### Initial Page Load from URL

#### URL-to-State Initialization

On component mount or route enter:
1. Read URL query parameters
2. Parse and validate each parameter
3. Populate search store with filter state
4. Trigger initial search with filters
5. Update UI to reflect active filters

#### Validation on Load

Validate URL parameters:
- Check category IDs exist
- Validate price range (min < max)
- Verify attribute values are valid
- Handle malformed parameters gracefully
- Fall back to defaults for invalid values

### Shareable URLs

#### Creating Shareable Links

Enable users to share filtered searches:
- Copy full URL with all parameters
- Share button to copy link
- Social media sharing (with proper encoding)
- Email link sharing
- QR code generation (advanced)

#### URL Shortening (Optional)

For very long URLs:
- Implement URL shortener service
- Create short alias for filter state
- Redirect short URL to full URL
- Track shared link usage

### Bookmarking Support

Ensure URLs are bookmarkable:
- Complete filter state in URL
- No reliance on session storage
- URL represents exact search state
- Bookmark restores full context
- Works across sessions and devices

### State-to-URL Synchronization

#### Bidirectional Sync

Maintain sync in both directions:
- **Store → URL:** Filter changes update URL
- **URL → Store:** URL changes update filters

#### Sync Algorithm

**Store to URL:**
1. Watch filter store for changes
2. Serialize filter state to query params
3. Update URL without page reload
4. Maintain other query params (if any)

**URL to Store:**
1. Watch route query for changes
2. Deserialize query params to filter state
3. Update store silently (don't trigger duplicate search)
4. Update UI components

### Handling Complex Filters

#### Nested Categories

For hierarchical categories:
- Include parent and child in URL
- OR include only leaf categories
- Reconstruct hierarchy on load
- Validate parent-child relationships

#### Multiple Attributes

For many attribute filters:
- Use consistent naming: `attr_[name]`
- Support unlimited attribute types
- Parse dynamically based on prefix
- Validate against available attributes

### URL Length Considerations

#### Managing Long URLs

Prevent URLs from becoming too long:
- Limit maximum selected filters (e.g., 20 total)
- Use abbreviations for parameter names
- Encode efficiently
- Consider URL shortening for complex filters

#### Browser Limits

Be aware of URL length limits:
- Maximum ~2000 characters (IE)
- Modern browsers support more
- Server may have limits
- Avoid exceeding reasonable length (500-1000 chars)

### Error Handling

#### Invalid URL Parameters

Handle invalid parameters gracefully:
- Ignore unrecognized parameters
- Validate filter values against available options
- Fall back to defaults for invalid values
- Log warnings for debugging
- Don't break page on bad URL

#### Missing Parameters

Handle missing or incomplete parameters:
- Use default values
- Don't require all parameters
- Treat missing as "not filtered"
- Allow partial filter state

### Testing Scenarios

#### URL Sync Tests

Test comprehensive scenarios:
1. Select filters → verify URL updates
2. Copy URL → paste in new tab → verify state restored
3. Modify URL manually → verify filters update
4. Use back button → verify previous state restored
5. Bookmark URL → open later → verify state persists
6. Share URL → open on different device → verify works
7. Change filters → verify URL updates incrementally
8. Clear filters → verify URL resets (except search query)

### Implementation Steps

1. **Define URL Parameter Schema**
   - Document all parameter names and formats
   - Create type definitions
   - Define encoding/decoding rules

2. **Create URL Serialization Utilities**
   - Build function to convert store state to query params
   - Handle arrays, numbers, special chars
   - Implement debouncing for frequent updates

3. **Create URL Deserialization Utilities**
   - Build function to parse query params to filter state
   - Validate all parameters
   - Handle missing or invalid values

4. **Implement Store-to-URL Sync**
   - Watch search store for filter changes
   - Serialize state to query params
   - Update URL using Vue Router
   - Debounce updates appropriately

5. **Implement URL-to-Store Sync**
   - Watch route query for changes
   - Deserialize query params
   - Update store state
   - Trigger search when needed

6. **Handle Initial Page Load**
   - Read URL on component mount
   - Populate store from URL
   - Trigger initial search
   - Update UI to match URL state

7. **Add Browser Navigation Support**
   - Implement back/forward handling
   - Update state on navigation
   - Test back button behavior

8. **Test Shareable URLs**
   - Verify URL copying works
   - Test URL in new tab/window
   - Validate state restoration
   - Check across devices

9. **Add Error Handling**
   - Validate all URL parameters
   - Handle invalid values gracefully
   - Log errors for debugging

10. **Optimize Performance**
    - Debounce URL updates
    - Batch multiple changes
    - Avoid redundant searches
    - Use replace vs push appropriately

### Accessibility Considerations

- Screen reader shouldn't announce URL changes
- Focus management during navigation
- Ensure back button works predictably
- Keyboard shortcuts for copying URL

### SEO Considerations

#### Search Engine Friendliness

Ensure URLs are SEO-friendly:
- Use descriptive parameter names
- Avoid unnecessary parameters
- Keep URLs reasonable length
- Use canonical URLs for similar searches
- Implement proper server-side rendering

#### Duplicate Content

Prevent duplicate content issues:
- Canonical tag for sorted/filtered versions
- Use same order for parameters
- Normalize URLs server-side

---

## Testing & Validation

### Functional Testing

#### Filter Functionality Tests

**Category Filter:**
- Select single category → verify results update
- Select multiple categories → verify OR logic
- Select parent category → verify children auto-select
- Deselect parent → verify children deselect
- Expand/collapse categories → verify state preserved

**Price Range Filter:**
- Enter min price → verify results filtered
- Enter max price → verify results filtered
- Enter invalid range (min > max) → verify error shown
- Clear price range → verify filter removed
- Use preset ranges → verify values populated

**Attribute Filters:**
- Select color → verify results update
- Select multiple sizes → verify OR logic
- Search brands → verify list filtered
- Select unavailable option → verify disabled
- Clear attribute → verify filter removed

**Active Filters Bar:**
- Apply filter → verify chip appears
- Remove chip → verify filter cleared
- Clear all → verify all chips removed
- View on mobile → verify horizontal scroll

**URL Sync:**
- Apply filters → verify URL updates
- Copy URL and open in new tab → verify state restored
- Use back button → verify previous state restored
- Manually edit URL → verify filters update
- Bookmark URL → verify works after reload

### UI/UX Testing

#### Visual Testing

**Desktop:**
- Filter sidebar visible and properly sized
- Filters render correctly in sidebar
- Active filters bar displays properly
- Results update smoothly
- Loading states show appropriately

**Tablet:**
- Filter sidebar adapts to medium screen
- Touch targets adequately sized
- Collapsible sidebar works correctly
- Layout doesn't break

**Mobile:**
- Filter button shows count
- Bottom sheet opens smoothly
- Filters usable with touch
- Active filters scroll horizontally
- Apply button fixed at bottom

#### Interaction Testing

- Hover states work on desktop
- Focus indicators visible
- Click targets adequate size
- Animations smooth and performant
- No layout shifts during updates

### Performance Testing

#### Load Performance

- Initial page load under 2 seconds
- Filter options load quickly
- Results update within 500ms
- No janky animations
- Smooth scrolling

#### Runtime Performance

- Filter changes don't cause lag
- Price input debounced appropriately
- URL updates don't block UI
- Large filter lists virtualized (if needed)
- Memory usage reasonable

### Accessibility Testing

#### Screen Reader Testing

- All filters announced correctly
- Filter counts readable
- Selection changes announced
- Error messages announced
- Navigation landmarks present

#### Keyboard Navigation

- Tab through all filters
- Space/Enter to toggle checkboxes
- Arrow keys in category tree (optional)
- Escape to close mobile filter sheet
- Focus visible on all elements

#### Color Contrast

- Text meets WCAG AA (4.5:1)
- Color swatches have borders
- Focus indicators visible
- Error states clear without color alone

### Cross-Browser Testing

Test in major browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

Verify:
- URL encoding/decoding works
- History API functions correctly
- Animations perform well
- Layout consistent across browsers

### Edge Case Testing

#### Data Edge Cases

- No filters available
- Single filter option
- Very long filter lists (100+ brands)
- All products same price
- Missing attribute data
- Zero results after filtering

#### User Edge Cases

- Rapid filter changes
- Back button spam
- Invalid URL parameters
- Extremely long URLs
- Concurrent filter updates
- Network failures during filter

### Integration Testing

#### API Integration

- Filter requests sent correctly
- Response parsed properly
- Error responses handled
- Loading states accurate
- Result counts updated

#### Store Integration

- Filter state syncs with store
- Multiple components read same state
- No stale data issues
- State resets properly

### Validation Checklist

**Functionality:**
- [ ] All 7 filter types implemented
- [ ] URL sync works bidirectionally
- [ ] Browser back/forward supported
- [ ] Shareable URLs work correctly
- [ ] Mobile bottom sheet functions
- [ ] Clear all resets properly
- [ ] Active filters display correctly

**UI/UX:**
- [ ] Responsive on all breakpoints
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Empty states shown
- [ ] Animations smooth
- [ ] Touch targets adequate (mobile)

**Performance:**
- [ ] Debouncing implemented
- [ ] No excessive API calls
- [ ] Smooth scrolling
- [ ] Fast filter updates
- [ ] Efficient rendering

**Accessibility:**
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Sufficient color contrast
- [ ] Focus indicators visible
- [ ] ARIA labels present

**SEO:**
- [ ] URLs are descriptive
- [ ] Parameters well-formed
- [ ] Canonical tags used
- [ ] Server-side rendering works

---

## Troubleshooting Guide

### Common Issues and Solutions

#### URL Not Updating

**Symptoms:**
- Filters change but URL stays same
- URL missing filter parameters

**Solutions:**
- Check Vue Router is properly configured
- Verify watch on store state is active
- Ensure serialization function is called
- Check for errors in browser console
- Verify router.push/replace calls executing

#### Filters Not Loading from URL

**Symptoms:**
- URL has parameters but filters not applied
- Page loads without selected filters
- Initial search ignores URL parameters

**Solutions:**
- Verify URL parsing on component mount
- Check deserialization function logic
- Ensure store is updated before search triggered
- Validate parameter names match expected
- Check for validation failures

#### Filter Counts Not Updating

**Symptoms:**
- Product counts don't change when filtering
- Counts show incorrect values
- Counts stay at 0 for available products

**Solutions:**
- Verify API returns facet counts
- Check filter response parsing
- Ensure counts update on filter change
- Validate count display logic
- Check for caching issues

#### Mobile Filter Sheet Issues

**Symptoms:**
- Bottom sheet doesn't open
- Sheet doesn't close on backdrop click
- Filters not applying on mobile

**Solutions:**
- Check z-index and positioning
- Verify click handlers on backdrop
- Ensure "Apply" button triggers action
- Test touch event handling
- Validate modal open state

#### Performance Problems

**Symptoms:**
- Lag when typing in price inputs
- Slow filter updates
- Janky animations
- High memory usage

**Solutions:**
- Implement debouncing on inputs
- Reduce API call frequency
- Optimize filter rendering
- Virtualize long lists
- Profile and optimize bottlenecks

---

## Best Practices Summary

### State Management

- Centralize all filter state in Pinia store
- Use computed properties for derived state
- Keep store actions focused and testable
- Avoid duplicate state between components
- Clear state appropriately on new searches

### URL Management

- Use consistent parameter naming
- Encode all values properly
- Debounce frequent updates
- Use replace for continuous changes
- Push for discrete filter selections
- Validate all URL parameters

### Performance

- Debounce text inputs (300-500ms)
- Batch multiple filter changes
- Virtualize long filter lists
- Use CSS transforms for animations
- Memoize expensive computations
- Lazy load collapsed filter sections

### Accessibility

- Use semantic HTML
- Provide clear labels
- Support keyboard navigation
- Announce dynamic changes
- Ensure sufficient contrast
- Test with screen readers

### User Experience

- Show loading states clearly
- Provide immediate feedback
- Display result counts
- Allow easy filter removal
- Support mobile gestures
- Maintain filter state appropriately

---

## Navigation

- **Previous:** None (First document in Group E)
- **Next:** [02_Tasks-74-80_Sort-Mobile.md](./02_Tasks-74-80_Sort-Mobile.md)
- **Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **Phase:** [Phase-08 Webstore](../../00_PHASE_OVERVIEW.md)
- **SubPhase:** [SubPhase-05 Search Functionality](../00_SUBPHASE_OVERVIEW.md)

---

**Document Status:** Complete
**Last Updated:** 2026-01-26
**Tasks Covered:** 67-73
**Estimated Implementation Time:** 16-20 hours
