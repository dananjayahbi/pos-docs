# Tasks 85-91: Empty States and Quick View Modal

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** F - Empty States & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 85, 86, 87, 88, 89, 90, 91

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-92-96_Content-Hooks-Testing.md](02_Tasks-92-96_Content-Hooks-Testing.md)

---

## Document Overview

This document covers the creation of empty state components for various catalog scenarios (no search results, empty filters, empty categories), loading skeleton components for the product grid and filters, and a quick view modal that allows customers to preview product details without navigating away from the catalog page.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Create No Results State | Low | 20 min |
| 86 | Create No Results Illustration | Low | 25 min |
| 87 | Create No Results Message | Low | 20 min |
| 88 | Create Suggestion Links | Low | 25 min |
| 89 | Create Loading Grid Skeleton | Low | 30 min |
| 90 | Create Filter Skeleton | Low | 25 min |
| 91 | Create Quick View Modal | Medium | 45 min |

---

## Task 85: Create No Results State

### Overview
Create the NoResults component that displays a friendly, helpful message when no products match the customer's search query, applied filters, or when viewing an empty category. This component provides visual feedback and actionable suggestions to guide customers back to browsing products.

### Dependencies
- Task 84: Category/Collection pages verified
- Product grid component exists
- Filter components completed

### Instructions

1. **Create empty state directory**
   - Navigate to `frontend/components/storefront/catalog/` directory
   - Create new directory named `EmptyState`
   - Create `NoResults.tsx` file in this directory

2. **Define TypeScript interfaces**
   - Create `NoResultsProps` interface
   - Include: variant ('search' | 'filter' | 'category')
   - Include: searchQuery (optional string)
   - Include: activeFilters (optional filter object)
   - Include: onClearFilters callback function

3. **Import required dependencies**
   - Import React components
   - Import NoResultsIllustration component (Task 86)
   - Import Button component from UI library
   - Import Link from Next.js

4. **Create component structure**
   - Define NoResults functional component
   - Accept props based on variant
   - Determine display content based on variant type

5. **Implement conditional rendering logic**
   - Check variant prop to determine scenario
   - Render appropriate illustration for each variant
   - Display context-specific message (Task 87)
   - Show relevant action buttons

6. **Add container layout**
   - Create centered container (flex column)
   - Set appropriate padding and spacing
   - Use minimum height to fill available space
   - Apply responsive design principles

7. **Display illustration component**
   - Include NoResultsIllustration at top (Task 86)
   - Set appropriate size (200x200px default)
   - Center illustration above content
   - Add margin below illustration

8. **Add heading and message**
   - Display context-specific heading (text-xl or text-2xl)
   - Show detailed message below heading (text-base)
   - Use neutral but friendly tone
   - Apply proper text color and spacing

9. **Include search query in message (if applicable)**
   - If variant is 'search', display search query
   - Format: "No products found for '{searchQuery}'"
   - Highlight search query with different styling
   - Truncate long search queries

10. **Display active filter count (if applicable)**
    - If variant is 'filter', show filter count
    - Format: "No products match your X filters"
    - Make filters clickable to review
    - Provide visual indication of filter state

11. **Add action buttons**
    - Include "Clear Filters" button for filter variant
    - Include "View All Products" button for all variants
    - Use primary button styling for main action
    - Use secondary styling for alternate actions

12. **Integrate suggestion links**
    - Include SuggestionLinks component below actions (Task 88)
    - Pass relevant suggestions based on context
    - Provide helpful navigation options
    - Use consistent styling

### Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ┌───────────────┐                        │
│                    │               │                        │
│                    │ Illustration  │                        │
│                    │   (200x200)   │                        │
│                    │               │                        │
│                    └───────────────┘                        │
│                                                             │
│              No Products Found for "Summer Dress"          │
│                                                             │
│   We couldn't find any products matching your search.      │
│   Try adjusting your search or browse our categories.      │
│                                                             │
│       ┌─────────────────┐    ┌─────────────────┐          │
│       │  View All       │    │  Clear Search   │          │
│       │  Products       │    │                 │          │
│       └─────────────────┘    └─────────────────┘          │
│                                                             │
│   You might also be interested in:                         │
│   • New Arrivals  • Sale Items  • Popular Products        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variant | 'search' \| 'filter' \| 'category' | Yes | - | Display scenario |
| searchQuery | string | No | - | Active search query |
| activeFilters | Record<string, any> | No | {} | Active filter state |
| onClearFilters | () => void | No | - | Clear filters callback |

### Variant Configurations

| Variant | Heading | Primary Action | Icon Type |
|---------|---------|----------------|-----------|
| search | "No products found" | View All Products | Search with X |
| filter | "No matches" | Clear Filters | Filter icon |
| category | "Coming soon" | Browse Categories | Empty box |

### Message Templates

| Scenario | Message |
|----------|---------|
| Empty Search | "We couldn't find any products matching '{query}'. Try different keywords or browse our categories." |
| Empty Filter | "No products match your current filters. Try removing some filters or browse all products." |
| Empty Category | "This category is currently being stocked. Check back soon or explore our other categories." |

### Layout Specifications

| Element | CSS Classes | Purpose |
|---------|-------------|---------|
| Container | `flex flex-col items-center justify-center min-h-[500px] px-4` | Centered layout |
| Illustration | `mb-6 md:mb-8` | Spacing below image |
| Heading | `text-xl md:text-2xl font-semibold text-gray-900 mb-3` | Prominent title |
| Message | `text-base text-gray-600 mb-6 text-center max-w-md` | Body text |
| Button Group | `flex gap-3 mb-6` | Action buttons |

### Expected Outcome
- Functional empty state component for all scenarios
- Context-aware messaging based on variant
- Clear visual hierarchy with illustration and text
- Actionable buttons to guide customers
- Responsive design for all screen sizes

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/EmptyState/NoResults.tsx` created
- [ ] All three variants (search, filter, category) render correctly
- [ ] Props interface includes all required and optional props
- [ ] Search query displays correctly when provided
- [ ] Active filter count displays accurately
- [ ] Clear filters button works when clicked
- [ ] Action buttons navigate to correct destinations
- [ ] Component centers properly on page
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Text is readable with proper contrast
- [ ] Illustration integrates seamlessly (Task 86)
- [ ] Suggestion links display below actions (Task 88)

---

## Task 86: Create No Results Illustration

### Overview
Create the NoResultsIllustration component that displays a friendly, brand-consistent SVG illustration for empty state scenarios. The illustration provides visual interest and softens the message when no products are found, enhancing the user experience with delightful visual feedback.

### Dependencies
- Task 85: No Results State component structure

### Instructions

1. **Create illustration component file**
   - Navigate to `frontend/components/storefront/catalog/EmptyState/` directory
   - Create `NoResultsIllustration.tsx` file
   - Set up TypeScript React functional component

2. **Define TypeScript interfaces**
   - Create `NoResultsIllustrationProps` interface
   - Include: variant ('search' | 'filter' | 'empty')
   - Include: size (number, default 200)
   - Include: className (optional string)

3. **Import required dependencies**
   - Import React
   - No external dependencies needed for SVG
   - Import any animation libraries if adding motion

4. **Create component structure**
   - Define functional component with props
   - Return SVG element based on variant
   - Apply size and className props

5. **Design search variant illustration**
   - Create SVG with magnifying glass icon
   - Add "no results" indicator (empty circle or X)
   - Use brand colors with muted tones
   - Size viewBox to maintain aspect ratio

6. **Design filter variant illustration**
   - Create SVG with filter/funnel icon
   - Add empty state indicator
   - Use similar style to search variant
   - Maintain visual consistency

7. **Design empty variant illustration**
   - Create SVG with empty box or folder icon
   - Add friendly, approachable styling
   - Consider adding subtle details (sparkles, lines)
   - Keep it simple and clean

8. **Apply brand colors**
   - Use LCC primary blue for main elements
   - Use gray tones for secondary elements
   - Use light backgrounds for depth
   - Ensure colors work on white background

9. **Set up SVG structure**
   - Set viewBox attribute for scalability
   - Use fill and stroke properties appropriately
   - Group related elements with `<g>` tags
   - Add title and desc for accessibility

10. **Implement size scaling**
    - Accept size prop for width and height
    - Maintain aspect ratio (1:1 square)
    - Allow custom sizes while defaulting to 200px
    - Ensure SVG scales cleanly

11. **Add optional animation (subtle)**
    - Consider pulse or fade-in animation
    - Keep animation minimal and tasteful
    - Use CSS animations or Framer Motion
    - Make animation optional via prop

12. **Create index export**
    - Export NoResultsIllustration as default
    - Include in EmptyState index.ts
    - Ensure proper tree-shaking

### SVG Structure Examples

```
Search Variant:
┌─────────────────────┐
│                     │
│    ╭───────╮       │
│    │ 🔍    │       │
│    │   ╱   │       │
│    ╰───────╯       │
│         ✗          │
│                     │
│   No Results       │
└─────────────────────┘

Filter Variant:
┌─────────────────────┐
│                     │
│       ▽             │
│      ▕ ▏           │
│       ▏            │
│       ∅            │
│                     │
│   Empty Filter     │
└─────────────────────┘

Empty Variant:
┌─────────────────────┐
│                     │
│    ┌────────┐       │
│    │        │       │
│    │        │       │
│    │   ∅    │       │
│    └────────┘       │
│                     │
│   Empty Box        │
└─────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variant | 'search' \| 'filter' \| 'empty' | No | 'empty' | Illustration type |
| size | number | No | 200 | Width/height in pixels |
| className | string | No | "" | Additional CSS classes |

### SVG Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| viewBox | "0 0 200 200" | Scalable coordinate system |
| width | {size}px | Responsive sizing |
| height | {size}px | Maintain aspect ratio |
| fill | "none" | Default fill |
| stroke | Brand colors | Line styling |

### Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary | Blue | #0066CC |
| Secondary | Light Blue | #E6F2FF |
| Border | Gray | #D1D5DB |
| Background | Light Gray | #F3F4F6 |

### Animation Options

| Animation | Type | Duration | Usage |
|-----------|------|----------|-------|
| Fade In | Opacity 0→1 | 300ms | Component mount |
| Pulse | Scale 1→1.05→1 | 2s infinite | Subtle attention |
| Float | TranslateY ±5px | 3s infinite | Gentle motion |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Title | `<title>No results illustration</title>` |
| Description | `<desc>Visual indicator for empty state</desc>` |
| ARIA Label | `aria-label="No results found"` |
| Role | `role="img"` |

### Expected Outcome
- Clean, scalable SVG illustration component
- Three variant designs for different scenarios
- Brand-consistent colors and styling
- Optional subtle animation
- Accessible with proper ARIA attributes
- Responsive sizing via props

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/EmptyState/NoResultsIllustration.tsx` created
- [ ] All three variants render correctly
- [ ] Size prop scales illustration properly
- [ ] Maintains aspect ratio at different sizes
- [ ] Colors match brand guidelines
- [ ] SVG is optimized (no unnecessary elements)
- [ ] Accessible with title and description
- [ ] Animation (if implemented) is subtle
- [ ] Works in NoResults component (Task 85)
- [ ] Displays clearly on light backgrounds
- [ ] No console warnings or errors

---

## Task 87: Create No Results Message

### Overview
Create helper functions and message templates that generate context-aware, friendly messages for empty state scenarios. These messages guide customers with helpful suggestions based on what they were trying to do (search, filter, browse category).

### Dependencies
- Task 85: No Results State component
- Understanding of search and filter functionality

### Instructions

1. **Create message utilities file**
   - Navigate to `frontend/lib/utils/` or `frontend/utils/` directory
   - Create `emptyStateMessages.ts` file
   - Set up TypeScript type definitions

2. **Define message types**
   - Create `EmptyStateVariant` type ('search' | 'filter' | 'category' | 'collection')
   - Create `EmptyStateMessage` interface with: heading, message, suggestions
   - Create `MessageContext` type with query and filter info

3. **Create message generator function**
   - Define `getEmptyStateMessage(variant, context)` function
   - Accept variant and optional context object
   - Return heading, message, and suggestion array
   - Use switch statement for different variants

4. **Implement search message logic**
   - For search variant with query, include query in message
   - Sanitize and truncate long queries
   - Provide spelling/keyword suggestions
   - Message: "No products found for '{query}'"

5. **Implement filter message logic**
   - For filter variant, mention active filter count
   - List filter types if count is low (≤3)
   - Suggest removing filters or broadening search
   - Message: "No products match your X filters"

6. **Implement category message logic**
   - For empty category, provide coming soon message
   - Mention category name if available
   - Suggest browsing other categories
   - Message: "This category is being stocked"

7. **Implement collection message logic**
   - For empty collection, explain curation process
   - Provide timeline if available
   - Link to similar collections
   - Message: "This collection is being curated"

8. **Create suggestion generator**
   - Define `getSuggestions(variant, context)` function
   - Return array of suggestion objects with text and link
   - Tailor suggestions to variant type
   - Include fallback suggestions

9. **Add search suggestions**
   - For search: suggest "View All Products", "Sale Items", "New Arrivals"
   - Include popular category links
   - Add "Clear Search" suggestion
   - Limit to 3-4 suggestions

10. **Add filter suggestions**
    - For filters: suggest "Clear All Filters", "Reset Search"
    - Include popular filter combinations
    - Add category navigation
    - Prioritize by likelihood to have results

11. **Add category/collection suggestions**
    - Suggest related categories or collections
    - Include "Shop All" link
    - Add "Popular Products" link
    - Show seasonal or trending categories

12. **Implement message formatting**
    - Create helper for inserting query into message
    - Escape HTML/special characters
    - Truncate long strings with ellipsis
    - Format filter lists as readable text

### Message Templates

```
Search Variant Templates:

No Query:
  Heading: "Start Your Search"
  Message: "Enter keywords to find products you'll love."
  
With Query:
  Heading: "No Products Found"
  Message: "We couldn't find any products matching '{query}'. Try different keywords or browse our categories."
  
With Typo Detected:
  Heading: "No Products Found"
  Message: "Did you mean '{suggestion}'? We couldn't find '{query}'."

Filter Variant Templates:

Single Filter:
  Heading: "No Matches"
  Message: "No products match your {filterType} filter. Try adjusting your selection."
  
Multiple Filters:
  Heading: "No Matches Found"
  Message: "No products match your {count} filters ({filterList}). Try removing some filters."
  
All Filters:
  Heading: "Too Specific"
  Message: "Your current filter combination has no matches. Try broadening your selection."

Category Variant Templates:

Empty Category:
  Heading: "Coming Soon"
  Message: "We're stocking this category with great products. Check back soon or explore our other categories."
  
New Category:
  Heading: "Just Added"
  Message: "This is a new category. Products will be added shortly."

Collection Variant Templates:

Empty Collection:
  Heading: "Collection In Progress"
  Message: "Our team is carefully curating this collection. Check back soon for handpicked products."
  
Seasonal Collection:
  Heading: "Collection Ended"
  Message: "This seasonal collection has ended. Explore our current collections."
```

### Function Signatures

| Function | Parameters | Returns |
|----------|------------|---------|
| getEmptyStateMessage | variant, context | { heading, message, suggestions } |
| getSuggestions | variant, context | Array<{ text, link }> |
| formatSearchQuery | query, maxLength | string |
| formatFilterList | filters, maxItems | string |

### Context Object Structure

| Field | Type | Description |
|-------|------|-------------|
| searchQuery | string | Current search query |
| activeFilters | Record<string, any> | Active filter state |
| filterCount | number | Number of active filters |
| categoryName | string | Current category name |
| collectionName | string | Current collection name |

### Suggestion Link Structure

| Field | Type | Description |
|-------|------|-------------|
| text | string | Display text for link |
| href | string | Destination URL |
| icon | string (optional) | Icon name |
| variant | 'primary' \| 'secondary' | Button styling |

### Expected Outcome
- Utility file with message generation functions
- Context-aware messages for all variants
- Friendly, helpful tone throughout
- Proper query and filter formatting
- Relevant suggestion links for each scenario
- Type-safe TypeScript implementation

### Verification Checklist
- [ ] `frontend/lib/utils/emptyStateMessages.ts` created
- [ ] All message templates defined
- [ ] getEmptyStateMessage function works for all variants
- [ ] Search query displays correctly in messages
- [ ] Filter count and types display accurately
- [ ] Messages are friendly and helpful
- [ ] Long queries truncate properly
- [ ] Special characters are escaped
- [ ] Suggestions are relevant to context
- [ ] TypeScript types are properly defined
- [ ] No grammar or spelling errors
- [ ] Functions handle edge cases (empty strings, null values)

---

## Task 88: Create Suggestion Links

### Overview
Create the SuggestionLinks component that displays helpful navigation options below the empty state message. These links guide customers to relevant product pages, categories, or actions based on the empty state context, improving the user experience and reducing bounce rates.

### Dependencies
- Task 87: Message templates and suggestion logic defined
- Task 85: No Results State component structure

### Instructions

1. **Create suggestion links component**
   - Navigate to `frontend/components/storefront/catalog/EmptyState/` directory
   - Create `SuggestionLinks.tsx` file
   - Set up TypeScript React functional component

2. **Define TypeScript interfaces**
   - Create `SuggestionLink` interface with: text, href, icon (optional)
   - Create `SuggestionLinksProps` interface
   - Include: suggestions array
   - Include: variant for styling context
   - Include: onLinkClick callback (optional)

3. **Import required dependencies**
   - Import React components
   - Import Link from Next.js
   - Import Icon component if using icons
   - Import message utilities (Task 87)

4. **Create component structure**
   - Define SuggestionLinks functional component
   - Accept suggestions array via props
   - Render list of clickable links
   - Handle empty suggestions gracefully

5. **Implement container layout**
   - Create wrapper div with proper spacing
   - Add heading "You might also be interested in:"
   - Use flex or grid layout for links
   - Apply responsive design principles

6. **Render suggestion list**
   - Map through suggestions array
   - Render each suggestion as Link component
   - Add appropriate spacing between links
   - Use semantic HTML (ul/li or nav)

7. **Style suggestion links**
   - Use text link style (no button background)
   - Apply hover state (underline, color change)
   - Add icon before text if provided
   - Use consistent font size and weight

8. **Add icons to suggestions (optional)**
   - Include icon before link text
   - Use relevant icons: ChevronRight, ArrowRight, Star
   - Size icons appropriately (16-20px)
   - Ensure icons align with text

9. **Implement responsive layout**
   - Stack links vertically on mobile
   - Use inline or grid layout on desktop
   - Adjust spacing for different screen sizes
   - Ensure links are easily tappable on mobile

10. **Add analytics tracking**
    - Track suggestion link clicks
    - Include source context (search, filter, category)
    - Log which suggestions are most clicked
    - Use onLinkClick callback for custom tracking

11. **Handle suggestion variants**
    - Render primary actions prominently (first item)
    - Distinguish between category links and actions
    - Group similar suggestions together
    - Limit total suggestions to 3-5 items

12. **Create index export**
    - Export SuggestionLinks component
    - Add to EmptyState index.ts
    - Ensure proper tree-shaking

### Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   You might also be interested in:                         │
│                                                             │
│   • View All Products                                      │
│   • New Arrivals                                           │
│   • Sale Items                                             │
│   • Popular Categories                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile Layout:
┌──────────────────┐
│ Suggestions:     │
│                  │
│ • All Products   │
│ • New Arrivals   │
│ • Sale Items     │
│                  │
└──────────────────┘

Desktop Layout:
┌─────────────────────────────────────────────────────────────┐
│ Suggestions:  • All Products  • New Arrivals  • Sale Items │
└─────────────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| suggestions | SuggestionLink[] | Yes | - | Links to display |
| variant | 'search' \| 'filter' \| 'category' | No | 'search' | Context variant |
| onLinkClick | (suggestion) => void | No | - | Click tracking callback |
| maxItems | number | No | 5 | Maximum links to show |

### Suggestion Link Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| text | string | Yes | Link display text |
| href | string | Yes | Destination URL |
| icon | string | No | Icon name/component |
| category | 'action' \| 'category' \| 'page' | No | Link type |

### Common Suggestions by Variant

| Variant | Suggestions |
|---------|-------------|
| Search | View All Products, New Arrivals, Sale Items, Clear Search |
| Filter | Clear Filters, All Products, Popular Items, Browse Categories |
| Category | Other Categories, Featured Products, New Arrivals, Shop All |
| Collection | All Collections, Featured Products, New Arrivals, Shop All |

### Link Styling

| State | CSS Classes | Description |
|-------|-------------|-------------|
| Default | `text-blue-600 hover:text-blue-800` | Brand blue |
| Hover | `underline` | Underline on hover |
| Visited | `visited:text-purple-600` | Distinct visited state |
| Focus | `focus:outline-2 focus:outline-blue-500` | Keyboard focus |

### Layout Options

| Layout | CSS Classes | Usage |
|--------|-------------|-------|
| Vertical List | `flex flex-col gap-2` | Mobile, long lists |
| Inline List | `flex flex-wrap gap-4` | Desktop, short lists |
| Grid | `grid grid-cols-2 gap-3` | Multiple categories |
| Bullet List | `list-disc list-inside` | Semantic list |

### Expected Outcome
- Reusable suggestion links component
- Clean list of helpful navigation options
- Responsive layout for all screen sizes
- Optional icon support for visual interest
- Analytics tracking capability
- Accessible with proper keyboard navigation

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/EmptyState/SuggestionLinks.tsx` created
- [ ] Component accepts suggestions array
- [ ] All links render correctly
- [ ] Links navigate to correct destinations
- [ ] Icons display correctly (if implemented)
- [ ] Hover states work properly
- [ ] Responsive on mobile and desktop
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Click tracking callback fires (if provided)
- [ ] Maximum items limit respected
- [ ] Accessible with screen readers
- [ ] Integrates with NoResults component (Task 85)

---

## Task 89: Create Loading Grid Skeleton

### Overview
Create the GridSkeleton component that displays animated placeholder elements while product data is loading. This skeleton loader improves perceived performance by showing content structure immediately, reducing the feeling of waiting and providing visual feedback that content is loading.

### Dependencies
- Task 36: Product card component exists
- Product grid layout established
- Understanding of grid column structure

### Instructions

1. **Create skeleton component directory**
   - Navigate to `frontend/components/storefront/catalog/` directory
   - Create new directory named `Skeleton`
   - Create `GridSkeleton.tsx` file

2. **Define TypeScript interfaces**
   - Create `GridSkeletonProps` interface
   - Include: count (number of skeleton cards, default 8)
   - Include: columns (grid column configuration, optional)
   - Include: showFilters (boolean, whether sidebar is visible)

3. **Import required dependencies**
   - Import React components
   - Import skeleton UI component from library (if using shadcn/ui)
   - Or create custom skeleton animation
   - Import grid layout utilities

4. **Create skeleton card component**
   - Define SkeletonProductCard subcomponent
   - Mimic structure of real ProductCard component
   - Include placeholders for: image, title, price, badge, button
   - Use same dimensions as real card

5. **Implement skeleton animations**
   - Use pulse animation (opacity 0.5 → 1 → 0.5)
   - Or shimmer/wave animation with gradient
   - Apply animation to all skeleton elements
   - Set animation duration (1.5-2 seconds)
   - Use infinite loop

6. **Create image placeholder**
   - Rectangle with aspect ratio matching product images
   - Typical ratio: 4:5 or 1:1 (square)
   - Use neutral background color (gray-200)
   - Apply rounded corners to match card style

7. **Create text placeholders**
   - Product name: 2 lines of varying widths
   - First line: 80-100% width
   - Second line: 40-60% width
   - Price: single line, 30-40% width
   - Use appropriate heights (h-4, h-5)

8. **Add badge placeholder**
   - Small rounded rectangle in top corner
   - Similar position to sale/new badges
   - Width: 50-60px, height: 20-24px
   - Optional: can randomize presence

9. **Add button placeholder**
   - Rectangle matching "Add to Cart" button
   - Full width or centered based on card style
   - Height matching button height (h-10 or h-11)
   - Rounded corners

10. **Implement grid layout**
    - Use same grid configuration as product grid
    - Responsive columns: 2 (mobile), 3 (tablet), 4 (desktop)
    - Match gap spacing between cards
    - Account for sidebar if showFilters is true

11. **Render multiple skeleton cards**
    - Map array of count length
    - Render SkeletonProductCard for each
    - Add unique keys for React rendering
    - Maintain consistent spacing

12. **Create skeleton wrapper**
    - Include skeleton grid in container
    - Match padding and margins of real grid
    - Optionally show filter skeleton alongside (Task 90)
    - Ensure full-width container on mobile

### Skeleton Card Structure

```
┌───────────────────────┐
│ ╔═══════════════════╗ │  ← Image placeholder (pulse animation)
│ ║                   ║ │
│ ║   [Badge]         ║ │
│ ║                   ║ │
│ ║                   ║ │
│ ╚═══════════════════╝ │
│                       │
│ ████████████████      │  ← Title line 1
│ ██████████            │  ← Title line 2
│                       │
│ █████                 │  ← Price
│                       │
│ ┌───────────────────┐ │  ← Button placeholder
│ │                   │ │
│ └───────────────────┘ │
└───────────────────────┘

Grid Layout (4 columns on desktop):
┌─────┬─────┬─────┬─────┐
│ [1] │ [2] │ [3] │ [4] │
├─────┼─────┼─────┼─────┤
│ [5] │ [6] │ [7] │ [8] │
└─────┴─────┴─────┴─────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| count | number | No | 8 | Number of skeleton cards |
| columns | { sm: 2, md: 3, lg: 4 } | No | Default grid | Grid configuration |
| showFilters | boolean | No | false | Whether sidebar is shown |

### Skeleton Element Specifications

| Element | Width | Height | Animation |
|---------|-------|--------|-----------|
| Image | 100% | aspect-[4/5] | Pulse |
| Title Line 1 | 90% | h-4 | Pulse |
| Title Line 2 | 50% | h-4 | Pulse |
| Price | 40% | h-5 | Pulse |
| Badge | 60px | 24px | Pulse |
| Button | 100% | h-10 | Pulse |

### Animation Styles

```
Pulse Animation (CSS):
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

Shimmer Animation (CSS):
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
.animate-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### Grid Column Configuration

| Breakpoint | Columns | Width | Usage |
|------------|---------|-------|-------|
| sm (< 640px) | 2 | 50% each | Mobile |
| md (640-1024px) | 3 | 33.33% each | Tablet |
| lg (> 1024px) | 4 | 25% each | Desktop |
| with sidebar | -1 column | Adjust | Filter sidebar shown |

### Randomization Options

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Line Width | Vary 80-100% for line 1 | Natural variation |
| Badge Presence | Show on 30% of cards | Realistic distribution |
| Second Title Line | Optional on some cards | Varied content |

### Expected Outcome
- Smooth, animated loading skeleton for product grid
- Matches real product card layout
- Responsive grid configuration
- Pleasant pulse or shimmer animation
- Configurable number of skeleton cards
- Accounts for sidebar presence

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Skeleton/GridSkeleton.tsx` created
- [ ] Skeleton cards match real card dimensions
- [ ] Animation plays smoothly (no jank)
- [ ] Grid layout matches product grid
- [ ] Responsive on all screen sizes
- [ ] Correct number of columns per breakpoint
- [ ] Skeleton shows when loading products
- [ ] Transitions smoothly to real content
- [ ] No console warnings or errors
- [ ] Accessible (screen reader announces loading)
- [ ] Performance is good (60fps animation)
- [ ] Works with and without filter sidebar

---

## Task 90: Create Filter Skeleton

### Overview
Create the FilterSkeleton component that displays animated placeholders for the filter sidebar while filter options are loading. This skeleton loader maintains layout stability and provides visual feedback during data fetching, ensuring a seamless user experience.

### Dependencies
- Task 54: Filter sidebar component exists
- Filter accordion structure established
- Understanding of filter categories and options

### Instructions

1. **Create filter skeleton component**
   - Navigate to `frontend/components/storefront/catalog/Skeleton/` directory
   - Create `FilterSkeleton.tsx` file
   - Set up TypeScript React functional component

2. **Define TypeScript interfaces**
   - Create `FilterSkeletonProps` interface
   - Include: sections (number of filter sections, default 5)
   - Include: itemsPerSection (number of items per section, default 6)
   - Include: showSearch (boolean for search box skeleton)

3. **Import required dependencies**
   - Import React components
   - Import skeleton components or create custom
   - Match styling of real filter components

4. **Create skeleton filter section**
   - Define SkeletonFilterSection subcomponent
   - Include section header placeholder
   - Include list of option placeholders
   - Mimic accordion structure

5. **Implement section header skeleton**
   - Rectangle for section title
   - Width: 60-80% of container
   - Height: h-5 or h-6
   - Add pulse animation
   - Include chevron placeholder (optional)

6. **Create filter option skeletons**
   - Checkbox + label structure
   - Checkbox: 16x16px square
   - Label: varying widths (50-90%)
   - Height: h-4 for labels
   - Proper spacing between options

7. **Add search box skeleton (optional)**
   - Rectangle for search input
   - Full width with padding
   - Height: h-10 or h-11
   - Rounded corners
   - Search icon placeholder

8. **Implement filter section layout**
   - Stack sections vertically
   - Add border between sections
   - Match padding of real filter sections
   - Use accordion-like spacing

9. **Render multiple sections**
   - Map array of sections count
   - Render SkeletonFilterSection for each
   - Vary itemsPerSection slightly for realism
   - Add unique keys for React

10. **Add animation**
    - Use same pulse animation as grid skeleton
    - Synchronize timing across all elements
    - Ensure smooth, non-distracting animation
    - Consider staggered animation start

11. **Match real filter sidebar width**
    - Use same width as filter sidebar component
    - Typically: w-64 or w-72 on desktop
    - Full width on mobile when sidebar is modal
    - Apply same padding and margins

12. **Create container wrapper**
    - Match filter sidebar container styling
    - Include sticky positioning if applicable
    - Add background color if used
    - Ensure proper spacing from grid

### Filter Skeleton Structure

```
┌───────────────────────────┐
│                           │
│ Search                    │
│ ┌───────────────────────┐ │  ← Search skeleton (optional)
│ │ 🔍 ████████████       │ │
│ └───────────────────────┘ │
│                           │
├───────────────────────────┤
│                           │
│ ████████     [▼]         │  ← Section 1 header
│                           │
│  ☐ ██████████            │  ← Option 1
│  ☐ ███████               │  ← Option 2
│  ☐ ████████████          │  ← Option 3
│  ☐ █████                 │  ← Option 4
│                           │
├───────────────────────────┤
│                           │
│ ██████       [▼]         │  ← Section 2 header
│                           │
│  ☐ █████████             │  ← Option 1
│  ☐ ████████              │  ← Option 2
│  ☐ ███████████           │  ← Option 3
│                           │
├───────────────────────────┤
│                           │
│ ████████     [▼]         │  ← Section 3 header
│  ☐ ██████                │
│  ☐ ████████              │
│                           │
└───────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| sections | number | No | 5 | Number of filter sections |
| itemsPerSection | number | No | 6 | Options per section |
| showSearch | boolean | No | true | Show search skeleton |

### Skeleton Section Specifications

| Element | Width | Height | Spacing |
|---------|-------|--------|---------|
| Section Header | 70% | h-5 | mb-3 |
| Checkbox | 16px | 16px | mr-2 |
| Option Label | 50-90% | h-4 | mb-2 |
| Section Divider | 100% | 1px | my-4 |

### Section Configurations

| Section # | Header Width | Items | Variation |
|-----------|--------------|-------|-----------|
| 1 | 80% | 6 | Standard |
| 2 | 65% | 5 | Fewer items |
| 3 | 75% | 7 | More items |
| 4 | 70% | 4 | Fewer items |
| 5 | 85% | 6 | Standard |

### Animation Timing

| Element | Delay | Duration | Easing |
|---------|-------|----------|--------|
| Section 1 | 0ms | 2s | ease-in-out |
| Section 2 | 100ms | 2s | ease-in-out |
| Section 3 | 200ms | 2s | ease-in-out |
| All Options | 0ms | 2s | ease-in-out |

### Layout Specifications

| Property | Desktop | Mobile | Purpose |
|----------|---------|--------|---------|
| Width | w-64 | w-full | Sidebar width |
| Padding | p-4 | p-4 | Internal spacing |
| Background | bg-white | bg-white | Container background |
| Border | border-r | border-t | Section separator |

### Expected Outcome
- Animated filter sidebar skeleton
- Matches real filter sidebar structure
- Multiple sections with varying content
- Optional search box placeholder
- Smooth pulse animation
- Responsive layout for mobile and desktop

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Skeleton/FilterSkeleton.tsx` created
- [ ] Skeleton matches filter sidebar layout
- [ ] Section headers display correctly
- [ ] Checkbox + label structure matches real filters
- [ ] Search box skeleton renders (if enabled)
- [ ] Animation is smooth and synchronized
- [ ] Correct number of sections and items
- [ ] Responsive on mobile and desktop
- [ ] Width matches real filter sidebar
- [ ] Transitions smoothly to real filters
- [ ] No layout shift when loading completes
- [ ] Accessible (loading state announced)

---

## Task 91: Create Quick View Modal

### Overview
Create the QuickViewModal component that displays a modal overlay with product details when customers click the "Quick View" icon on a product card. This modal allows customers to preview product information, select variants, and add items to cart without navigating away from the catalog page, improving browsing efficiency.

### Dependencies
- Task 24: Product card with quick view trigger
- Modal/Dialog component from UI library
- Product detail components exist

### Instructions

1. **Create quick view directory**
   - Navigate to `frontend/components/storefront/catalog/` directory
   - Create new directory named `QuickView`
   - Create `QuickViewModal.tsx` file

2. **Define TypeScript interfaces**
   - Create `QuickViewModalProps` interface
   - Include: isOpen (boolean)
   - Include: onClose (callback function)
   - Include: productId (string)
   - Include: onAddToCart (optional callback)

3. **Import required dependencies**
   - Import React hooks (useState, useEffect)
   - Import Dialog/Modal from UI library (shadcn/ui)
   - Import product data fetching hook
   - Import QuickViewContent component (Task 92)
   - Import loading spinner or skeleton

4. **Create modal component structure**
   - Define QuickViewModal functional component
   - Accept isOpen, onClose, and productId props
   - Manage loading state for product data
   - Handle modal open/close transitions

5. **Implement product data fetching**
   - Use useEffect to fetch product data when modal opens
   - Fetch product details based on productId
   - Handle loading state during fetch
   - Handle error state if fetch fails

6. **Configure modal dialog**
   - Set modal size: medium to large (max-w-4xl or max-w-5xl)
   - Make modal scrollable if content is long
   - Enable close on backdrop click
   - Enable close on Escape key press

7. **Add modal header**
   - Include close button (X icon) in top-right corner
   - Make close button accessible (aria-label)
   - Style close button: hover effects, focus ring
   - Position close button absolutely or in header

8. **Implement modal content area**
   - Render QuickViewContent component when data loaded (Task 92)
   - Pass product data to QuickViewContent
   - Show loading spinner while fetching
   - Show error message if fetch fails

9. **Add loading state**
   - Display centered spinner or skeleton
   - Show loading text: "Loading product..."
   - Maintain modal open during loading
   - Smooth transition to content when loaded

10. **Add error state**
    - Display error message if product fetch fails
    - Include retry button
    - Provide fallback action: "View full details" link
    - Style error state appropriately

11. **Implement modal animations**
    - Fade in backdrop (opacity 0 → 1)
    - Scale up modal content (scale 0.95 → 1)
    - Smooth transitions (300ms duration)
    - Use easing for natural feel

12. **Add accessibility features**
    - Trap focus within modal when open
    - Return focus to trigger button on close
    - Add proper ARIA attributes (role, aria-modal, aria-labelledby)
    - Ensure keyboard navigation works (Tab, Escape)

### Modal Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Backdrop (Semi-transparent)                                 │
│                                                             │
│   ┌───────────────────────────────────────────────────┐   │
│   │  Quick View Modal                            [X]  │   │
│   ├───────────────────────────────────────────────────┤   │
│   │                                                   │   │
│   │  ┌─────────────┬──────────────────────────────┐  │   │
│   │  │             │                              │  │   │
│   │  │   Product   │   Product Details            │  │   │
│   │  │   Images    │   - Name                     │  │   │
│   │  │             │   - Price                    │  │   │
│   │  │   [Main]    │   - Variants                 │  │   │
│   │  │             │   - Quantity                 │  │   │
│   │  │  ┌───┬───┐  │   - Add to Cart Button       │  │   │
│   │  │  │Th1│Th2│  │   - View Full Details Link   │  │   │
│   │  │  └───┴───┘  │                              │  │   │
│   │  │             │                              │  │   │
│   │  └─────────────┴──────────────────────────────┘  │   │
│   │                                                   │   │
│   └───────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| isOpen | boolean | Yes | Modal visibility state |
| onClose | () => void | Yes | Close callback |
| productId | string | Yes | Product to display |
| onAddToCart | (product, qty) => void | No | Add to cart callback |

### Modal Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Max Width | max-w-4xl | Comfortable viewing size |
| Padding | p-6 md:p-8 | Internal spacing |
| Background | bg-white | Modal surface |
| Border Radius | rounded-lg | Modern appearance |
| Shadow | shadow-2xl | Strong elevation |
| Z-Index | z-50 | Above other content |

### Animation Specifications

| Element | Property | From | To | Duration |
|---------|----------|------|-----|----------|
| Backdrop | opacity | 0 | 1 | 300ms |
| Modal | scale | 0.95 | 1 | 300ms |
| Modal | opacity | 0 | 1 | 300ms |

### Loading State

```
┌─────────────────────────┐
│   Quick View       [X]  │
├─────────────────────────┤
│                         │
│       ⟳  Loading...     │
│                         │
│   Loading product       │
│   details...            │
│                         │
└─────────────────────────┘
```

### Error State

```
┌─────────────────────────┐
│   Quick View       [X]  │
├─────────────────────────┤
│                         │
│      ⚠️  Error          │
│                         │
│   Failed to load        │
│   product.              │
│                         │
│   [Retry] [View Full]   │
│                         │
└─────────────────────────┘
```

### Accessibility Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| role | "dialog" | Semantic role |
| aria-modal | "true" | Modal behavior |
| aria-labelledby | Header ID | Accessible name |
| aria-describedby | Content ID | Accessible description |

### Expected Outcome
- Functional quick view modal component
- Opens when triggered from product card
- Fetches and displays product data
- Smooth open/close animations
- Accessible with keyboard navigation
- Responsive on all screen sizes
- Loading and error states handled

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/QuickView/QuickViewModal.tsx` created
- [ ] Modal opens when isOpen is true
- [ ] Modal closes on backdrop click
- [ ] Modal closes on Escape key
- [ ] Close button works correctly
- [ ] Product data fetches when modal opens
- [ ] Loading spinner displays while fetching
- [ ] QuickViewContent renders when data loaded (Task 92)
- [ ] Error state displays if fetch fails
- [ ] Animations are smooth
- [ ] Focus is trapped within modal
- [ ] Focus returns to trigger on close
- [ ] Accessible with screen readers
- [ ] Responsive on mobile, tablet, desktop
- [ ] No console warnings or errors

---
