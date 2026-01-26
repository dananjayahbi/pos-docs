# Tasks 55-63: Toolbar, Sort & View Toggle

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** D - Sort & Pagination  
> **Document:** 01 of 02  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60, 61, 62, 63

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-64-70_Mobile-Pagination-URL.md](02_Tasks-64-70_Mobile-Pagination-URL.md)

---

## Document Overview

This document covers the creation of the catalog toolbar with active filters display, sorting functionality, and view toggle between grid and list layouts. It establishes the toolbar structure with filter tags that can be removed, a dropdown for sorting products, and a toggle for switching between grid and list views.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 55 | Create Toolbar Component | Medium | 30 min |
| 56 | Create Active Filters Display | Low | 20 min |
| 57 | Create Active Filter Tag | Low | 20 min |
| 58 | Create Remove Filter Action | Low | 15 min |
| 59 | Create Sort Dropdown | Low | 25 min |
| 60 | Define Sort Options | Low | 15 min |
| 61 | Create Sort Change Handler | Low | 20 min |
| 62 | Create View Toggle | Low | 20 min |
| 63 | Create List View Layout | Medium | 35 min |

---

## Task 55: Create Toolbar Component

### Overview
Create the CatalogToolbar component that serves as the main container for sorting controls, view toggle, and active filters display. This component appears above the product grid and provides users with tools to refine and organize their product browsing experience.

### Dependencies
- Task 16: ProductGrid component must exist
- SubPhase-02 (Product State Management) must be complete
- FilterSidebar component from Group C

### Instructions

1. **Create toolbar directory structure**
   - Navigate to `frontend/components/storefront/catalog/` directory
   - Create new directory named `Toolbar`
   - This will house all toolbar-related components

2. **Create CatalogToolbar component file**
   - Create `CatalogToolbar.tsx` in `Toolbar/` directory
   - Set up TypeScript React functional component structure
   - Import necessary dependencies and types

3. **Define component props interface**
   - Create `CatalogToolbarProps` interface
   - Include `totalProducts` prop (number) for count display
   - Include `activeFilters` prop (array of filter objects)
   - Include optional `className` prop for styling

4. **Implement toolbar container**
   - Create main toolbar div with flex layout
   - Apply responsive styling for mobile and desktop
   - Set background color and border styling

5. **Create left section (results and filters)**
   - Display product count: "X Products"
   - Add placeholder for ActiveFilters component
   - Apply flex layout with proper spacing

6. **Create right section (controls)**
   - Add placeholder for SortDropdown component
   - Add placeholder for ViewToggle component
   - Add placeholder for Mobile Filter Button (Task 64)
   - Use flex layout with gap spacing

7. **Implement responsive layout**
   - Stack vertically on mobile (< 768px)
   - Display horizontally on tablet and desktop
   - Adjust spacing and padding for each breakpoint

8. **Add conditional rendering**
   - Show filter count only when filters active
   - Hide certain controls on mobile
   - Adjust layout based on screen size

### Toolbar Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│  Left Section              |        Right Section          │
│  ┌──────────────────────┐  |  ┌────┐ ┌────┐ ┌──────────┐ │
│  │ 245 Products          │  |  │Sort│ │View│ │Filter(M) │ │
│  │ [Active Filters]      │  |  └────┘ └────┘ └──────────┘ │
│  └──────────────────────┘  |                               │
└────────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| totalProducts | number | Yes | - | Total product count |
| activeFilters | Filter[] | Yes | [] | Array of active filters |
| className | string | No | "" | Additional CSS classes |

### Layout Sections

| Section | Content | Position | Responsive |
|---------|---------|----------|------------|
| Left | Product count, Active filters | Left | Full width on mobile |
| Right | Sort, View, Mobile Filter | Right | Below left on mobile |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `bg-white border-b border-gray-200 px-4 py-3` | Base styling |
| Wrapper | `flex flex-col md:flex-row md:items-center md:justify-between` | Layout |
| Left Section | `flex flex-col gap-2 mb-3 md:mb-0` | Results and filters |
| Right Section | `flex items-center gap-3` | Controls |

### Responsive Behavior

```
Mobile (< 768px)
├── Stack: Vertical
├── Left: Full width
├── Right: Full width
└── Spacing: gap-3

Tablet/Desktop (≥ 768px)
├── Direction: Horizontal
├── Left: flex-1
├── Right: flex-shrink-0
└── Spacing: gap-4
```

### Product Count Display

| State | Display Text | Styling |
|-------|-------------|---------|
| Results | "245 Products" | `text-sm font-medium text-gray-900` |
| No Results | "No products found" | `text-sm text-gray-500` |
| Loading | "Loading..." | `text-sm text-gray-400` |

### Expected Outcome
- Functional toolbar container with proper layout
- Responsive design for mobile and desktop
- Product count display implemented
- Placeholders for child components ready
- Proper spacing and visual hierarchy

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Toolbar/CatalogToolbar.tsx` file created
- [ ] Component accepts all required props
- [ ] Left section displays product count
- [ ] Right section has placeholders for controls
- [ ] Responsive layout works on mobile and desktop
- [ ] Proper TypeScript types defined
- [ ] Component exports properly

---

## Task 56: Create Active Filters Display

### Overview
Create the ActiveFilters component that displays all currently applied filters in the toolbar. This component shows a list of FilterTag components (created in Task 57) and provides visual feedback about active filter selections, helping users understand what filters are currently narrowing their product results.

### Dependencies
- Task 55: Create Toolbar Component

### Instructions

1. **Create ActiveFilters component file**
   - Create `ActiveFilters.tsx` in `Toolbar/` directory
   - Set up React functional component structure
   - Import necessary types and dependencies

2. **Define component props interface**
   - Create `ActiveFiltersProps` interface
   - Include `filters` prop (array of filter objects)
   - Include `onRemove` prop (callback function)
   - Include optional `onClearAll` prop

3. **Define filter object structure**
   - Create `ActiveFilter` type/interface
   - Include `id` (string) for unique identification
   - Include `type` (string) for filter category
   - Include `label` (string) for display text
   - Include `value` (string/number) for filter value

4. **Implement component container**
   - Create wrapper div with flex layout
   - Show only when filters array has items
   - Add proper spacing and alignment

5. **Add "Clear All" button**
   - Display when 2+ filters active
   - Position at end of filter tags
   - Use button element with proper styling
   - Call `onClearAll` prop on click

6. **Map through filters array**
   - Render FilterTag component for each filter
   - Pass filter data and remove handler as props
   - Add proper key prop for React list rendering

7. **Handle empty state**
   - Return null when no filters active
   - Component should not render anything
   - Keep logic simple and clean

8. **Implement responsive layout**
   - Wrap filter tags to new lines as needed
   - Adjust spacing for mobile vs desktop
   - Ensure tags remain readable

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| filters | ActiveFilter[] | Yes | - | Array of active filters |
| onRemove | (filterId: string) => void | Yes | - | Remove filter callback |
| onClearAll | () => void | No | - | Clear all filters callback |
| className | string | No | "" | Additional CSS classes |

### Filter Object Structure

| Property | Type | Example | Description |
|----------|------|---------|-------------|
| id | string | "category-electronics" | Unique filter identifier |
| type | string | "category" | Filter type/category |
| label | string | "Category" | Display label for filter type |
| value | string | "Electronics" | Selected filter value |

### Layout Structure

```
┌──────────────────────────────────────────────────────┐
│  Active Filters:                                     │
│  ┌──────────────┐ ┌────────────┐ ┌──────────────┐   │
│  │ Category:    │ │ Price:     │ │ Color: Red   │   │
│  │ Electronics X│ │ $100-500 X │ └──────────────┘   │
│  └──────────────┘ └────────────┘                     │
│                              [Clear All]             │
└──────────────────────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex flex-wrap items-center gap-2` | Tag layout |
| Label Text | `text-xs text-gray-600 mr-2` | "Active Filters:" |
| Clear Button | `text-xs text-blue-600 hover:underline ml-2` | Clear all action |

### Filter Display Examples

| Filter Type | Display Format |
|-------------|----------------|
| Category | "Category: Electronics" |
| Price Range | "Price: $100 - $500" |
| Color | "Color: Red" |
| Brand | "Brand: Samsung" |
| Size | "Size: Large" |
| Rating | "Rating: 4+ stars" |

### Clear All Button

| State | Visibility | Text | Action |
|-------|-----------|------|--------|
| 0-1 filters | Hidden | - | - |
| 2+ filters | Visible | "Clear All" | Remove all filters |

### Empty State Behavior

```
No Active Filters
└── Component returns null
    └── Nothing rendered
        └── No space taken in DOM
```

### Expected Outcome
- Component displays active filters when present
- Renders FilterTag for each filter
- Clear All button appears when multiple filters active
- Returns null when no filters applied
- Proper spacing and wrapping on all screen sizes

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Toolbar/ActiveFilters.tsx` file created
- [ ] Component accepts filters array and callbacks
- [ ] Renders FilterTag for each active filter
- [ ] Clear All button shows for 2+ filters
- [ ] Returns null when no filters active
- [ ] Responsive wrapping implemented
- [ ] TypeScript types properly defined
- [ ] Component exports correctly

---

## Task 57: Create Active Filter Tag

### Overview
Create the FilterTag component that represents a single active filter as a removable chip/pill. This component displays the filter label and value in a compact, styled container with an X button for removal, providing clear visual feedback about applied filters.

### Dependencies
- Task 56: Create Active Filters Display

### Instructions

1. **Create FilterTag component file**
   - Create `FilterTag.tsx` in `Toolbar/` directory
   - Set up React functional component structure
   - Import Icon component for X button

2. **Define component props interface**
   - Create `FilterTagProps` interface
   - Include `filter` prop (ActiveFilter object)
   - Include `onRemove` prop (callback function)
   - Include optional `className` prop

3. **Implement tag container**
   - Create styled div as tag wrapper
   - Apply pill/chip styling with rounded edges
   - Use background color to differentiate from page

4. **Add filter label and value**
   - Display in format: "Label: Value"
   - Use proper text sizing and weight
   - Ensure readability with contrast

5. **Implement remove button**
   - Add button element with X icon
   - Position at right side of tag
   - Include hover effects for interactivity
   - Call `onRemove` prop with filter ID on click

6. **Add accessibility features**
   - Use semantic button element
   - Add aria-label for screen readers
   - Include keyboard navigation support
   - Ensure proper focus indicators

7. **Apply tag styling**
   - Set background color (light gray or brand tint)
   - Add border for definition
   - Use proper padding and spacing
   - Add transition effects for hover states

8. **Handle long filter values**
   - Apply max-width if needed
   - Use text-overflow: ellipsis for long text
   - Consider tooltip for full value display

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| filter | ActiveFilter | Yes | - | Filter object to display |
| onRemove | (filterId: string) => void | Yes | - | Remove callback |
| className | string | No | "" | Additional CSS classes |

### Tag Structure

```
┌───────────────────────┐
│ Category: Electronics │ [X]
└───────────────────────┘
 ↑          ↑           ↑
Label    Value     Remove
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `inline-flex items-center gap-1 px-3 py-1.5 rounded-full` | Tag shape |
| Background | `bg-gray-100 border border-gray-300` | Visual style |
| Text | `text-sm text-gray-700` | Readability |
| Button | `text-gray-500 hover:text-gray-700` | Remove action |

### Filter Tag Examples

| Filter Type | Display | Removal Action |
|-------------|---------|----------------|
| Category | "Category: Electronics" [X] | Remove category filter |
| Price | "Price: $100-$500" [X] | Remove price range |
| Color | "Color: Red" [X] | Remove color filter |
| Brand | "Brand: Samsung" [X] | Remove brand filter |

### Remove Button Specs

| Element | Implementation |
|---------|----------------|
| Icon | X or Close icon (Lucide) |
| Size | 14-16px |
| Hover | Darker color, scale effect |
| Aria-Label | "Remove {label}: {value} filter" |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | `role="button"` on remove button |
| Aria-Label | Descriptive label for filter removal |
| Keyboard | Enter/Space to remove filter |
| Focus | Visible focus ring on button |

### Hover States

```
Default State
┌───────────────────────┐
│ Category: Electronics │ [X]
└───────────────────────┘

Hover State
┌───────────────────────┐
│ Category: Electronics │ [X] ← Darker, cursor pointer
└───────────────────────┘
         ↑ No background change
```

### Responsive Considerations

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full padding, readable text |
| Tablet | Same as mobile |
| Desktop | Same, may show more per row |

### Expected Outcome
- Styled pill/chip component for filter display
- Clear label and value presentation
- Functional remove button with icon
- Hover and focus states implemented
- Accessible to keyboard and screen reader users

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Toolbar/FilterTag.tsx` file created
- [ ] Component displays filter label and value
- [ ] Remove button with X icon implemented
- [ ] onRemove callback fires with correct filter ID
- [ ] Hover effects applied to remove button
- [ ] Accessibility features implemented
- [ ] Proper styling with pill/chip appearance
- [ ] Component exports correctly

---

## Task 58: Create Remove Filter Action

### Overview
Implement the filter removal logic that handles removing individual filters when the X button on a FilterTag is clicked. This task connects the FilterTag click event to the filter state management, updating both the UI and URL parameters to reflect the removed filter.

### Dependencies
- Task 57: Create Active Filter Tag
- SubPhase-02 (Product State Management) filter state

### Instructions

1. **Locate filter state management**
   - Find the hook managing filter state (useFilters or similar)
   - Identify the filter removal function
   - Understand current filter data structure

2. **Create removeFilter function**
   - Define function in parent component or hook
   - Accept filterId parameter (string)
   - Handle filter removal from state

3. **Implement filter removal logic**
   - Find filter by ID in state array
   - Remove filter from active filters array
   - Update state with new filtered array

4. **Update URL parameters**
   - Remove corresponding query parameter from URL
   - Use Next.js router or URL state hook
   - Maintain other active filters in URL

5. **Trigger product refetch**
   - Call API with updated filter parameters
   - Show loading state during refetch
   - Update product grid with new results

6. **Handle different filter types**
   - Category filters: Remove category param
   - Price range: Remove min/max price params
   - Multi-select: Remove single value from array
   - Single-select: Remove entire param

7. **Pass removeFilter to components**
   - Pass function to ActiveFilters component
   - ActiveFilters passes to each FilterTag
   - Ensure proper function binding and scope

8. **Add error handling**
   - Catch any errors during removal
   - Show error toast/message if needed
   - Gracefully handle edge cases

### Filter Removal Flow

```
User Clicks Remove Button
         │
         ▼
FilterTag Fires onRemove(filterId)
         │
         ▼
Parent Component Receives Event
         │
         ▼
removeFilter Function Executes
         │
         ├─────────────────────┐
         ▼                     ▼
   Update State          Update URL
         │                     │
         └──────────┬──────────┘
                    ▼
            Refetch Products
                    │
                    ▼
          Update Product Grid
```

### Function Signature

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| removeFilter | filterId: string | void | Removes filter by ID |
| clearAllFilters | - | void | Removes all active filters |

### Filter Type Handling

| Filter Type | State Update | URL Update |
|-------------|--------------|------------|
| Category | Remove from categories array | Remove ?category=value |
| Price Range | Set min/max to undefined | Remove ?min_price and ?max_price |
| Color | Remove from colors array | Update ?colors=red,blue |
| Brand | Remove from brands array | Update ?brands=samsung,lg |
| Single Value | Set to undefined/null | Remove query parameter |

### State Update Example

```
Before Removal:
{
  category: 'electronics',
  minPrice: 100,
  maxPrice: 500,
  colors: ['red', 'blue']
}

Remove Category Filter:
{
  category: undefined,  ← Removed
  minPrice: 100,
  maxPrice: 500,
  colors: ['red', 'blue']
}
```

### URL Update Example

```
Before:
/products?category=electronics&min_price=100&max_price=500&colors=red,blue

After Removing Category:
/products?min_price=100&max_price=500&colors=red,blue
                ↑ category parameter removed
```

### Error Handling

| Error Scenario | Handling |
|----------------|----------|
| Filter not found | Log warning, no-op |
| API call fails | Show error toast, keep filter |
| Invalid filter ID | Validate before removal |
| Network error | Retry or show error message |

### Performance Considerations

| Aspect | Implementation |
|--------|----------------|
| Debouncing | Not needed for single removal |
| State Updates | Batch with URL update if possible |
| API Calls | Immediate refetch on removal |
| Optimistic UI | Remove tag immediately |

### Expected Outcome
- Clicking X button removes filter immediately
- Filter disappears from active filters list
- URL parameters update to reflect change
- Product grid refetches with new filters
- Smooth user experience with no flicker

### Verification Checklist
- [ ] removeFilter function implemented
- [ ] Function removes filter from state correctly
- [ ] URL parameters update on removal
- [ ] Product grid refetches with updated filters
- [ ] All filter types handled correctly
- [ ] Error handling implemented
- [ ] Optimistic UI update works smoothly
- [ ] Clear All functionality works (if implemented)

---

## Task 59: Create Sort Dropdown

### Overview
Create the SortDropdown component that allows users to change the product sort order. This component displays the current sort option and opens a dropdown menu with all available sorting options, updating the product list when a new sort is selected.

### Dependencies
- Task 55: Create Toolbar Component

### Instructions

1. **Create SortDropdown component file**
   - Create `SortDropdown.tsx` in `Toolbar/` directory
   - Set up React functional component structure
   - Import necessary UI components (Select/Dropdown)

2. **Define component props interface**
   - Create `SortDropdownProps` interface
   - Include `value` prop (current sort value)
   - Include `onChange` prop (callback function)
   - Include `options` prop (array of sort options)

3. **Choose dropdown implementation**
   - Option A: Use headlessui Menu component
   - Option B: Use native HTML select element
   - Option C: Use shadcn/ui Select component
   - Consider accessibility and styling needs

4. **Implement dropdown trigger button**
   - Display current sort option label
   - Add down arrow icon to indicate dropdown
   - Apply button styling with hover states

5. **Create dropdown menu**
   - Position menu below trigger button
   - Set proper z-index for overlay
   - Add background and shadow styling

6. **Render sort options**
   - Map through options array
   - Create clickable items for each option
   - Highlight currently selected option
   - Add checkmark icon for active selection

7. **Handle sort change**
   - Call onChange prop with new sort value
   - Close dropdown after selection
   - Update trigger button to show new selection

8. **Add keyboard navigation**
   - Arrow keys to navigate options
   - Enter/Space to select option
   - Escape to close dropdown
   - Proper focus management

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Current sort value |
| onChange | (value: string) => void | Yes | - | Sort change callback |
| options | SortOption[] | Yes | - | Available sort options |
| className | string | No | "" | Additional CSS classes |

### Sort Option Interface

| Property | Type | Example | Description |
|----------|------|---------|-------------|
| value | string | "price_low" | Sort value for API |
| label | string | "Price: Low to High" | Display label |
| icon | string | "↑" | Optional sort direction icon |

### Dropdown Structure

```
┌─────────────────────────┐
│ Sort: Newest First   ▼  │  ← Trigger Button
└─────────────────────────┘
         │
         ▼ (Opens)
┌─────────────────────────┐
│ ✓ Newest First          │  ← Selected
│   Price: Low to High    │
│   Price: High to Low    │
│   Most Popular          │
│   Highest Rated         │
└─────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Trigger | `flex items-center gap-2 px-3 py-2 border rounded-md` | Button style |
| Menu | `absolute mt-1 w-48 bg-white border shadow-lg rounded-md` | Dropdown |
| Option | `px-3 py-2 hover:bg-gray-100 cursor-pointer` | Menu item |
| Selected | `bg-blue-50 text-blue-700 font-medium` | Active item |

### Dropdown Behavior

| Action | Result |
|--------|--------|
| Click trigger | Open/close dropdown |
| Click option | Select and close |
| Click outside | Close dropdown |
| Escape key | Close dropdown |
| Arrow keys | Navigate options |

### Mobile Considerations

| Aspect | Implementation |
|--------|----------------|
| Touch Target | Minimum 44x44px |
| Menu Position | Below trigger, within viewport |
| Overlay | Optional backdrop on mobile |
| Scrolling | Prevent body scroll when open |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | `role="button"` on trigger |
| ARIA | `aria-expanded`, `aria-haspopup` |
| Keyboard | Full keyboard navigation support |
| Focus | Trap focus within open menu |
| Announce | Screen reader announces selection |

### Sort Direction Icons

| Sort Type | Icon | Description |
|-----------|------|-------------|
| Ascending | ↑ | Low to high |
| Descending | ↓ | High to low |
| Default | - | No direction |

### Expected Outcome
- Functional dropdown for sort selection
- Current sort option clearly displayed
- All sort options accessible via dropdown
- Smooth open/close animations
- Full keyboard and screen reader support

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Toolbar/SortDropdown.tsx` file created
- [ ] Dropdown trigger shows current sort option
- [ ] Menu opens on trigger click
- [ ] All sort options rendered in menu
- [ ] Selected option highlighted
- [ ] onChange callback fires with correct value
- [ ] Keyboard navigation works
- [ ] Menu closes after selection
- [ ] Proper ARIA attributes set
- [ ] Component exports correctly

---

## Task 60: Define Sort Options

### Overview
Define the complete list of sort options available to users for organizing product results. This task creates a structured array of sort options with labels, values, and API parameters that the SortDropdown component will use to populate its menu.

### Dependencies
- Task 59: Create Sort Dropdown

### Instructions

1. **Create sort options constant file**
   - Create file in `lib/constants/` or similar directory
   - Name file `sortOptions.ts` or `catalogConstants.ts`
   - Set up TypeScript types for sort options

2. **Define SortOption type**
   - Create TypeScript interface/type
   - Include `value` field (string for state/URL)
   - Include `label` field (string for display)
   - Include `apiParam` field (string for backend)
   - Include optional `icon` or `direction` field

3. **Create sort options array**
   - Define constant `PRODUCT_SORT_OPTIONS`
   - Export as const array for type safety
   - Include all common e-commerce sort options

4. **Define newest first option**
   - Value: "newest"
   - Label: "Newest First"
   - API Parameter: "-created_at"
   - Set as default sort option

5. **Define price sorting options**
   - Low to High: "price_low", "Price: Low to High", "price"
   - High to Low: "price_high", "Price: High to Low", "-price"
   - Include clear labels for user understanding

6. **Define popularity and rating options**
   - Most Popular: "popular", "Most Popular", "-sales_count"
   - Highest Rated: "rating", "Highest Rated", "-avg_rating"
   - Ensure backend supports these sort fields

7. **Add helper functions**
   - Create `getSortOptionByValue()` helper
   - Create `getDefaultSortOption()` helper
   - Create `formatSortForAPI()` helper if needed

8. **Document sort behavior**
   - Add comments explaining each option
   - Document backend field requirements
   - Note any special sorting logic

### SortOption Type Definition

```typescript
interface SortOption {
  value: string;        // For URL and state
  label: string;        // User-facing label
  apiParam: string;     // Backend sort parameter
  direction?: 'asc' | 'desc';  // Optional direction
}
```

### Complete Sort Options

| Value | Label | API Parameter | Direction |
|-------|-------|---------------|-----------|
| newest | Newest First | -created_at | desc |
| price_low | Price: Low to High | price | asc |
| price_high | Price: High to Low | -price | desc |
| popular | Most Popular | -sales_count | desc |
| rating | Highest Rated | -avg_rating | desc |
| name_asc | Name: A to Z | name | asc |
| name_desc | Name: Z to A | -name | desc |

### API Parameter Format

| Frontend Value | API Query | Description |
|----------------|-----------|-------------|
| price_low | ?ordering=price | Ascending price |
| price_high | ?ordering=-price | Descending price (- prefix) |
| newest | ?ordering=-created_at | Newest first |
| popular | ?ordering=-sales_count | Highest sales |

### Default Sort Option

| Property | Value | Reason |
|----------|-------|--------|
| Default | newest | Show newest products first |
| Fallback | If invalid value, reset to default |
| Persistence | Store in URL for shareable links |

### Sort Option Categories

```
Date-Based
├── Newest First
└── Oldest First (optional)

Price-Based
├── Price: Low to High
└── Price: High to Low

Performance-Based
├── Most Popular
└── Highest Rated

Alphabetical
├── Name: A to Z
└── Name: Z to A
```

### Helper Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| getSortOptionByValue(value) | Find option by value | SortOption or null |
| getDefaultSortOption() | Get default option | SortOption |
| isValidSortValue(value) | Validate sort value | boolean |
| formatSortLabel(option) | Format for display | string |

### Backend Field Requirements

| Sort Option | Required Backend Field | Index Needed |
|-------------|------------------------|--------------|
| newest | created_at (datetime) | Yes |
| price | price (decimal) | Yes |
| popular | sales_count (integer) | Yes |
| rating | avg_rating (decimal) | Yes |
| name | name or title (string) | Optional |

### Constants Export Structure

```typescript
export const PRODUCT_SORT_OPTIONS: readonly SortOption[] = [...]
export const DEFAULT_SORT_VALUE = 'newest'
export function getSortOptionByValue(value: string): SortOption | undefined
export function getDefaultSortOption(): SortOption
```

### Expected Outcome
- Complete array of sort options defined
- Clear labels for user understanding
- Correct API parameters for backend
- Helper functions for sort option handling
- Well-documented and type-safe constants

### Verification Checklist
- [ ] Sort options constant file created
- [ ] SortOption type/interface defined
- [ ] All sort options included with labels and API params
- [ ] Default sort option specified
- [ ] Helper functions implemented
- [ ] Backend field requirements documented
- [ ] Constant properly exported
- [ ] TypeScript types correct

---

## Task 61: Create Sort Change Handler

### Overview
Implement the sort change handler that processes sort selection changes from the SortDropdown component. This function updates the sort state, synchronizes with URL parameters, and triggers a product list refetch with the new sort order.

### Dependencies
- Task 59: Create Sort Dropdown
- Task 60: Define Sort Options

### Instructions

1. **Locate sort state management**
   - Find hook managing sort state (useFilters, useCatalog, etc.)
   - Identify current sort value in state
   - Understand state update mechanism

2. **Create handleSortChange function**
   - Define function in catalog page component
   - Accept sort value parameter (string)
   - Implement sort state update logic

3. **Validate sort value**
   - Check if value is valid sort option
   - Use helper function from Task 60
   - Fallback to default if invalid

4. **Update sort state**
   - Set new sort value in component state
   - Update any relevant context or global state
   - Ensure immediate UI update

5. **Synchronize with URL**
   - Add/update `sort` query parameter in URL
   - Use Next.js router or URL state hook
   - Maintain other query parameters (filters, page)

6. **Reset pagination**
   - Set page back to 1 when sort changes
   - Update page parameter in URL
   - Prevent showing empty pages with new sort

7. **Trigger product refetch**
   - Call API with new sort parameter
   - Show loading indicator during fetch
   - Update product grid with sorted results

8. **Add analytics tracking**
   - Track sort change events
   - Include sort value in analytics data
   - Help understand user behavior

### Function Flow

```
User Selects Sort Option
         │
         ▼
handleSortChange(value: string)
         │
         ├─────────────────┐
         ▼                 ▼
   Validate Value    Update State
         │                 │
         ▼                 ▼
   Update URL        Reset Page to 1
         │                 │
         └────────┬────────┘
                  ▼
         Refetch Products
                  │
                  ▼
       Update Product Grid
                  │
                  ▼
        Track Analytics
```

### Function Signature

```typescript
function handleSortChange(sortValue: string): void {
  // Validation
  // State update
  // URL sync
  // Page reset
  // API call
  // Analytics
}
```

### Sort State Update

| Step | Action | State Change |
|------|--------|--------------|
| 1 | Validate value | Check against PRODUCT_SORT_OPTIONS |
| 2 | Update sort state | `setSortValue(newValue)` |
| 3 | Reset pagination | `setCurrentPage(1)` |
| 4 | Update URL | Add `?sort=newValue&page=1` |

### URL Synchronization

| Before | After Sort Change | Page Reset |
|--------|-------------------|------------|
| /products?page=3 | /products?sort=price_low&page=1 | Yes |
| /products?category=electronics&page=2 | /products?category=electronics&sort=price_low&page=1 | Yes |
| /products?sort=newest | /products?sort=price_high&page=1 | Yes |

### API Request Update

```
Current Request:
GET /api/products?page=2&category=electronics

After Sort Change:
GET /api/products?page=1&category=electronics&ordering=price
                   ↑ Reset           ↑ New sort param
```

### State Management Approaches

| Approach | Implementation |
|----------|----------------|
| Local State | useState hook in page component |
| URL State | nuqs or custom useURLState hook |
| Context | React Context with reducer |
| Query Params | Sync state with router query |

### Validation Logic

```typescript
function handleSortChange(value: string) {
  // Validate sort value
  const sortOption = getSortOptionByValue(value);
  if (!sortOption) {
    console.warn('Invalid sort value:', value);
    return;
  }
  
  // Proceed with valid value
  updateSort(sortOption);
}
```

### Page Reset Rationale

| Scenario | Without Reset | With Reset |
|----------|---------------|------------|
| User on page 5, changes sort | May show empty page | Always shows results |
| Different product count with new sort | Inconsistent pagination | Consistent start point |
| User experience | Confusing | Predictable |

### Loading State Handling

| Phase | UI State | Indicator |
|-------|----------|-----------|
| Pre-Change | Normal | - |
| During Fetch | Loading | Spinner, skeleton, or overlay |
| Post-Fetch | Normal | Updated products displayed |

### Analytics Tracking

| Event | Data | Purpose |
|-------|------|---------|
| sort_changed | { sort_value, previous_value, product_count } | Track sorting preferences |
| products_sorted | { sort_type, category, user_id } | Understand user behavior |

### Expected Outcome
- Sort changes update state immediately
- URL reflects current sort selection
- Pagination resets to page 1
- Products refetch with new sort order
- Smooth user experience without errors

### Verification Checklist
- [ ] handleSortChange function implemented
- [ ] Sort value validation in place
- [ ] Sort state updates correctly
- [ ] URL parameter synchronization works
- [ ] Pagination resets to page 1
- [ ] Product refetch triggered with new sort
- [ ] Loading state shows during fetch
- [ ] Analytics tracking implemented (if applicable)
- [ ] Error handling for invalid values

---

## Task 62: Create View Toggle

### Overview
Create the ViewToggle component that allows users to switch between grid and list views for product display. This component provides two buttons with icons representing each view type, updating the display mode when clicked and persisting the preference.

### Dependencies
- Task 55: Create Toolbar Component

### Instructions

1. **Create ViewToggle component file**
   - Create `ViewToggle.tsx` in `Toolbar/` directory
   - Set up React functional component structure
   - Import icon components (Grid, List icons)

2. **Define component props interface**
   - Create `ViewToggleProps` interface
   - Include `value` prop ('grid' | 'list')
   - Include `onChange` prop (callback function)
   - Include optional `className` prop

3. **Implement toggle container**
   - Create wrapper div with border styling
   - Group two buttons together
   - Apply segmented control styling

4. **Create grid view button**
   - Add button with grid icon
   - Label: "Grid View" (can be icon-only)
   - Active state when value is 'grid'
   - Click handler calls onChange('grid')

5. **Create list view button**
   - Add button with list icon
   - Label: "List View" (can be icon-only)
   - Active state when value is 'list'
   - Click handler calls onChange('list')

6. **Apply active/inactive styling**
   - Active button: Primary color background
   - Inactive button: Transparent/light background
   - Use Tailwind classes for state management

7. **Add accessibility features**
   - Use proper button elements
   - Add aria-label for icon-only buttons
   - Include aria-pressed for toggle state
   - Ensure keyboard navigation works

8. **Implement responsive behavior**
   - Show both options on desktop
   - Consider hiding on mobile (default to grid)
   - Or maintain compact toggle on mobile

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | 'grid' \| 'list' | Yes | 'grid' | Current view mode |
| onChange | (value: 'grid' \| 'list') => void | Yes | - | View change callback |
| className | string | No | "" | Additional CSS classes |

### Toggle Structure

```
┌───────────────────┐
│ [Grid] │ List    │  ← Grid active
└───────────────────┘

┌───────────────────┐
│  Grid  │ [List]  │  ← List active
└───────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `inline-flex border border-gray-300 rounded-md` | Toggle wrapper |
| Button Base | `px-3 py-2 text-sm font-medium transition-colors` | Button style |
| Active | `bg-gray-900 text-white` | Selected state |
| Inactive | `bg-white text-gray-700 hover:bg-gray-50` | Unselected state |

### View Mode Icons

| View | Icon | Icon Library | Description |
|------|------|--------------|-------------|
| Grid | Grid icon | Lucide: LayoutGrid | 3x3 grid squares |
| List | List icon | Lucide: List | Horizontal lines |

### Button States

| State | Background | Text Color | Border |
|-------|------------|------------|--------|
| Active Grid | `bg-gray-900` | `text-white` | Left rounded |
| Inactive Grid | `bg-white` | `text-gray-700` | Left rounded |
| Active List | `bg-gray-900` | `text-white` | Right rounded |
| Inactive List | `bg-white` | `text-gray-700` | Right rounded |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Button Type | `<button type="button">` |
| Aria-Label | "Switch to grid view" / "Switch to list view" |
| Aria-Pressed | `aria-pressed={value === 'grid'}` |
| Keyboard | Tab to focus, Enter/Space to toggle |

### Responsive Behavior

| Breakpoint | Display | Reason |
|------------|---------|--------|
| Mobile (< 768px) | Hidden or small | Save toolbar space |
| Tablet (≥ 768px) | Visible | Enough space |
| Desktop (≥ 1024px) | Visible | Full functionality |

### View Preference Persistence

| Method | Implementation |
|--------|----------------|
| URL Parameter | `?view=grid` or `?view=list` |
| Local Storage | `localStorage.setItem('productView', 'grid')` |
| Cookie | `document.cookie = 'view=grid'` |
| User Profile | Save to backend user preferences |

### Toggle Interaction

```
User Clicks List Icon
         │
         ▼
onChange('list') Called
         │
         ▼
Parent Updates View State
         │
         ▼
ViewToggle Re-renders
         │
         ├──────────────────┐
         ▼                  ▼
  Grid Button          List Button
  (Inactive)           (Active)
```

### Expected Outcome
- Functional toggle between grid and list views
- Clear visual indication of active view
- Icon-based buttons for compact design
- Smooth transitions between states
- Accessibility features implemented

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Toolbar/ViewToggle.tsx` file created
- [ ] Grid and list buttons rendered
- [ ] Icons display correctly for each view
- [ ] Active button has distinct styling
- [ ] onChange callback fires with correct value
- [ ] Aria attributes set properly
- [ ] Keyboard navigation works
- [ ] Responsive behavior implemented
- [ ] Component exports correctly

---

## Task 63: Create List View Layout

### Overview
Create the ListView component that displays products in a horizontal list layout as an alternative to the grid view. This layout shows product image on the left with details on the right, providing more space for product information and a different browsing experience.

### Dependencies
- Task 62: Create View Toggle
- ProductCard component from Group B

### Instructions

1. **Create ListView component file**
   - Create `ListView.tsx` in `catalog/` directory
   - Set up React functional component structure
   - Import ProductCard or create ListProductCard variant

2. **Define component props interface**
   - Create `ListViewProps` interface
   - Include `products` prop (array of product objects)
   - Include loading and error state props
   - Include optional `className` prop

3. **Implement list container**
   - Create wrapper div with proper spacing
   - Use flexbox for vertical stacking
   - Add dividers between items

4. **Create list item layout**
   - Horizontal flex layout (row direction)
   - Image section on left (30-40% width)
   - Content section on right (60-70% width)
   - Product actions on far right or bottom

5. **Design image section**
   - Product image with aspect ratio (4:3 or 1:1)
   - Clickable to product detail page
   - Hover effects for interactivity
   - Responsive sizing

6. **Design content section**
   - Product title (larger than grid view)
   - Product category or brand
   - Product description/excerpt (1-2 lines)
   - Price display (prominent)
   - Rating and review count
   - Stock status indicator

7. **Add action buttons**
   - Add to Cart button (primary)
   - Quick View button (optional)
   - Wishlist button (optional)
   - Position on right or below content

8. **Implement responsive layout**
   - Full horizontal layout on desktop
   - Stack vertically on mobile (like grid card)
   - Adjust image and content proportions
   - Maintain usability on all screen sizes

9. **Add loading and empty states**
   - Skeleton loaders for loading state
   - Empty state message when no products
   - Match overall list layout structure

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| products | Product[] | Yes | - | Array of products to display |
| isLoading | boolean | No | false | Loading state |
| error | Error \| null | No | null | Error state |
| className | string | No | "" | Additional CSS classes |

### List Item Layout

```
┌───────────────────────────────────────────────────────────┐
│  ┌─────────┐  Product Title                               │
│  │         │  Category: Electronics                       │
│  │  Image  │  Brief description of the product that shows │
│  │         │  a couple of lines of text...                │
│  │ 300x300 │                                              │
│  └─────────┘  ★★★★☆ (45 reviews)                         │
│               $199.99  [Add to Cart]  [♡]                 │
└───────────────────────────────────────────────────────────┘
```

### Layout Proportions

| Section | Desktop Width | Mobile Width | Content |
|---------|--------------|--------------|---------|
| Image | 25-30% | 100% | Product photo |
| Content | 50-60% | 100% | Details, price, rating |
| Actions | 15-20% | 100% | Buttons |

### Content Section Elements

| Element | Display | Priority |
|---------|---------|----------|
| Title | Large, bold (text-lg font-semibold) | High |
| Category/Brand | Small, muted (text-sm text-gray-600) | Medium |
| Description | 2-3 lines, truncated | Medium |
| Price | Large, prominent | High |
| Rating | Stars + count | Medium |
| Stock | Badge/indicator | Medium |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `space-y-4` | Vertical spacing between items |
| Item | `flex gap-4 p-4 bg-white border rounded-lg` | Item wrapper |
| Image Container | `w-1/4 flex-shrink-0` | Image section |
| Content | `flex-1 flex flex-col justify-between` | Main content |
| Actions | `flex flex-col gap-2 items-end` | Action buttons |

### Responsive Layout

```
Desktop (≥ 1024px)
┌─────────────────────────────────┐
│ [Img] │ Content │ Actions │
└─────────────────────────────────┘

Tablet (768px - 1023px)
┌─────────────────────────────────┐
│ [Img] │ Content + Actions       │
└─────────────────────────────────┘

Mobile (< 768px)
┌───────────┐
│  [Image]  │
│           │
│  Content  │
│           │
│  Actions  │
└───────────┘
```

### Product Information Display

| Field | Grid View | List View |
|-------|-----------|-----------|
| Image Size | Square (200x200) | Rectangle (300x250) |
| Title | 2 lines max | 1 line, full width |
| Description | Hidden | Visible, 2-3 lines |
| Price | Standard | Prominent, larger |
| Rating | Small | Standard size |
| Add to Cart | Icon or small button | Full button |

### List Item Actions

| Action | Position | Style |
|--------|----------|-------|
| Add to Cart | Right column | Primary button |
| Quick View | Right column | Secondary button |
| Wishlist | Top right corner | Icon button |

### Loading State

```
┌───────────────────────────────────────────────────────────┐
│  ┌─────────┐  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                           │
│  │░░░░░░░░░│  ▓▓▓▓▓▓▓▓▓                                   │
│  │░░░░░░░░░│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│  │░░░░░░░░░│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│  └─────────┘  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓                │
└───────────────────────────────────────────────────────────┘
↑ Skeleton loaders during fetch
```

### Empty State

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│              No products found                            │
│              Try adjusting your filters                   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Functional list view layout for products
- Horizontal layout with image and content sections
- More detailed product information than grid view
- Responsive design that adapts to mobile
- Smooth switching between grid and list views

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/ListView.tsx` file created
- [ ] Component displays products in list layout
- [ ] Image section on left with proper sizing
- [ ] Content section shows all required fields
- [ ] Action buttons positioned correctly
- [ ] Responsive layout works on mobile
- [ ] Loading state with skeleton loaders
- [ ] Empty state message displays correctly
- [ ] Smooth transition from grid view
- [ ] Component exports correctly

---

## Summary

This document established the catalog toolbar with active filters display, sorting functionality, and view toggle capability. The toolbar provides users with tools to refine their product browsing experience through removable filter tags, customizable sort order, and the ability to switch between grid and list layouts.

### Completed Tasks
1. ✓ Created CatalogToolbar component with responsive layout
2. ✓ Created ActiveFilters display for showing applied filters
3. ✓ Created FilterTag component as removable filter chips
4. ✓ Implemented filter removal logic with state and URL sync
5. ✓ Created SortDropdown for changing product sort order
6. ✓ Defined complete set of sort options with API parameters
7. ✓ Implemented sort change handler with pagination reset
8. ✓ Created ViewToggle for switching between grid and list
9. ✓ Created ListView layout as alternative product display

### Next Steps
Proceed to [02_Tasks-64-70_Mobile-Pagination-URL.md](02_Tasks-64-70_Mobile-Pagination-URL.md) to create mobile filter drawer, pagination components, and URL state synchronization.
