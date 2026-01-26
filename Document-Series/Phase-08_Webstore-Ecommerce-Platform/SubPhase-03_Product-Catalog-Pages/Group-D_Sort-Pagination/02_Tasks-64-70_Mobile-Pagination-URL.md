# Tasks 64-70: Mobile Drawer, Pagination & URL State

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** D - Sort & Pagination  
> **Document:** 02 of 02  
> **Tasks Covered:** 64, 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-55-63_Toolbar-Sort-View.md](01_Tasks-55-63_Toolbar-Sort-View.md)

---

## Document Overview

This document covers the creation of the mobile filter drawer for small screens, pagination components for navigating through product pages, and URL state synchronization for shareable filter links. It provides mobile users with full filter access through a drawer interface and implements both traditional pagination and load more functionality with URL-based state management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 64 | Create Mobile Filter Button | Low | 15 min |
| 65 | Create Mobile Filter Drawer | Medium | 40 min |
| 66 | Create Pagination Component | Medium | 35 min |
| 67 | Create Page Numbers | Low | 20 min |
| 68 | Create Previous/Next Buttons | Low | 20 min |
| 69 | Create Load More Button | Low | 25 min |
| 70 | Create URL State Sync | Medium | 40 min |

---

## Task 64: Create Mobile Filter Button

### Overview
Create the MobileFilterButton component that displays in the toolbar on mobile devices to open the filter drawer. This button shows a filter icon with a badge indicating the number of active filters, providing mobile users with easy access to filtering options.

### Dependencies
- Task 55: Create Toolbar Component
- FilterSidebar component from Group C

### Instructions

1. **Create MobileFilterButton component file**
   - Create file in `components/storefront/catalog/Toolbar/` directory
   - Name file `MobileFilterButton.tsx`
   - Set up React functional component structure

2. **Define component props interface**
   - Create `MobileFilterButtonProps` interface
   - Include `activeFilterCount` prop (number)
   - Include `onClick` prop (callback function)
   - Include optional `className` prop

3. **Implement button element**
   - Create button with proper touch target size (min 44x44px)
   - Add filter icon from icon library (Lucide, Heroicons)
   - Apply mobile-friendly styling

4. **Add filter count badge**
   - Display only when activeFilterCount > 0
   - Position badge on top-right of icon
   - Use small circular badge with count
   - Apply primary color for visibility

5. **Add button label**
   - Text: "Filters" or icon-only
   - Consider space constraints on mobile
   - Use flex layout for icon + text

6. **Implement responsive visibility**
   - Show only on screens < 1024px (lg breakpoint)
   - Hide on desktop where sidebar is visible
   - Use Tailwind responsive classes (lg:hidden)

7. **Add accessibility features**
   - Use semantic button element
   - Add aria-label: "Open filters"
   - Include aria-describedby for filter count
   - Ensure proper focus styles

8. **Style button states**
   - Default: Border with icon color
   - Hover: Background color change
   - Active: Pressed state styling
   - Focus: Visible focus ring

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| activeFilterCount | number | Yes | 0 | Number of active filters |
| onClick | () => void | Yes | - | Button click handler |
| className | string | No | "" | Additional CSS classes |

### Button Structure

```
┌─────────────────┐
│  [Filter] (3)   │  ← Button with badge
└─────────────────┘
    ↑      ↑
   Icon   Badge (count)
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Button | `flex items-center gap-2 px-3 py-2 border rounded-md lg:hidden` | Mobile-only button |
| Icon | `w-5 h-5` | Standard icon size |
| Badge | `absolute -top-1 -right-1 bg-blue-600 text-white text-xs` | Count indicator |
| Badge Container | `w-5 h-5 rounded-full flex items-center justify-center` | Badge shape |

### Badge Display Logic

| Active Filter Count | Badge Display | Badge Content |
|---------------------|---------------|---------------|
| 0 | Hidden | - |
| 1-9 | Visible | Number (1, 2, 3...) |
| 10+ | Visible | "9+" or actual number |

### Responsive Visibility

| Breakpoint | Display | Reason |
|------------|---------|--------|
| Mobile (< 1024px) | Visible | Sidebar hidden, need button |
| Desktop (≥ 1024px) | Hidden | Sidebar visible, button redundant |

### Button Variations

```
No Active Filters
┌──────────────┐
│ [Filter] ▼   │
└──────────────┘

With Active Filters
┌──────────────┐
│ [Filter] ③   │  ← Badge shows count
└──────────────┘
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Button Type | `<button type="button">` |
| Aria-Label | "Open filters" or "Filters (3 active)" |
| Touch Target | Minimum 44x44px |
| Focus Visible | `focus-visible:ring-2 ring-blue-500` |

### Icon Options

| Icon Library | Icon Name | Visual |
|--------------|-----------|--------|
| Lucide React | Filter or SlidersHorizontal | Funnel shape |
| Heroicons | FunnelIcon or AdjustmentsHorizontalIcon | Filter icon |
| Custom SVG | FilterIcon | Brand-specific |

### Button States

| State | Styling | Behavior |
|-------|---------|----------|
| Default | `border-gray-300 text-gray-700` | Neutral appearance |
| Hover | `hover:bg-gray-50` | Light background |
| Active | `active:bg-gray-100` | Pressed effect |
| Focus | `focus-visible:ring-2` | Keyboard focus |

### Integration with Toolbar

```
Toolbar on Mobile
┌────────────────────────────────────┐
│  245 Products                      │
│  [Active Filter Tags...]           │
│                                    │
│  [Sort ▼]  [View]  [Filters (3)]  │
└────────────────────────────────────┘
                         ↑
                Mobile Filter Button
```

### Expected Outcome
- Button visible only on mobile devices
- Filter icon with optional count badge
- Badge shows number of active filters
- Clicking button opens filter drawer
- Proper touch target size for mobile use

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Toolbar/MobileFilterButton.tsx` file created
- [ ] Component displays filter icon
- [ ] Badge appears when filters are active
- [ ] Badge shows correct filter count
- [ ] Button visible only on mobile (< 1024px)
- [ ] onClick handler fires correctly
- [ ] Proper touch target size (44x44px min)
- [ ] Accessibility features implemented
- [ ] Component exports correctly

---

## Task 65: Create Mobile Filter Drawer

### Overview
Create the MobileFilterDrawer component that slides in from the right side on mobile devices, providing full access to all filter options. This drawer contains the FilterSidebar component, a header with close button, and footer with apply/clear actions, ensuring mobile users have the same filtering capabilities as desktop users.

### Dependencies
- Task 64: Create Mobile Filter Button
- FilterSidebar component from Group C

### Instructions

1. **Choose drawer implementation**
   - Option A: Use headlessui Dialog component
   - Option B: Use Radix UI Sheet component
   - Option C: Custom drawer with CSS transitions
   - Consider accessibility and animation needs

2. **Create MobileFilterDrawer component file**
   - Create file in `components/storefront/catalog/Filters/` directory
   - Name file `MobileFilterDrawer.tsx`
   - Set up React functional component structure

3. **Define component props interface**
   - Create `MobileFilterDrawerProps` interface
   - Include `isOpen` prop (boolean)
   - Include `onClose` prop (callback function)
   - Include filter-related props (filters, handlers)

4. **Implement drawer overlay**
   - Create semi-transparent backdrop
   - Cover entire screen when drawer open
   - Click backdrop to close drawer
   - Fade in/out animation

5. **Create drawer panel**
   - Slide in from right side of screen
   - Full height, 80-100% width on mobile
   - White background with shadow
   - Smooth slide animation (300-400ms)

6. **Design drawer header**
   - Title: "Filters"
   - Close button (X icon) on right
   - Fixed at top of drawer
   - Border bottom for separation

7. **Add drawer content area**
   - Scrollable middle section
   - Contains FilterSidebar component
   - Proper padding for readability
   - Prevent body scroll when open

8. **Create drawer footer**
   - Fixed at bottom of drawer
   - "Clear All" button (secondary)
   - "Apply Filters" button (primary)
   - Optional: Show result count

9. **Implement body scroll lock**
   - Prevent background scrolling when drawer open
   - Use CSS or JavaScript solution
   - Restore scroll on close

10. **Add animations and transitions**
    - Drawer slide-in/out animation
    - Overlay fade in/out
    - Smooth, performant transitions
    - Consider reduced motion preferences

11. **Handle responsive behavior**
    - Full screen on very small devices (< 480px)
    - 80% width on larger phones
    - Max width constraint (400-500px)
    - Hide on desktop (use sidebar instead)

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| isOpen | boolean | Yes | false | Drawer open state |
| onClose | () => void | Yes | - | Close drawer callback |
| filters | FilterState | Yes | - | Current filter state |
| onApply | () => void | Yes | - | Apply filters callback |
| onClearAll | () => void | Yes | - | Clear all filters |

### Drawer Structure

```
┌─────────────────────────────┐
│ Filters              [X]    │ ← Header (fixed)
├─────────────────────────────┤
│                             │
│   [FilterSidebar Content]   │
│   - Categories              │ ← Scrollable Content
│   - Price Range             │
│   - Colors                  │
│   - Brands                  │
│   - Ratings                 │
│                             │
│   (scrollable area)         │
│                             │
├─────────────────────────────┤
│ [Clear All]  [Apply (245)]  │ ← Footer (fixed)
└─────────────────────────────┘
```

### Drawer Dimensions

| Breakpoint | Width | Height | Position |
|------------|-------|--------|----------|
| Mobile (< 480px) | 100% | 100% | Right |
| Phone (480-767px) | 85% | 100% | Right |
| Tablet (768-1023px) | 400px | 100% | Right |
| Desktop (≥ 1024px) | Hidden | - | - |

### Overlay Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Background | `bg-black/50` | Semi-transparent backdrop |
| Z-Index | `z-40` | Above content, below drawer |
| Animation | Fade in/out | Smooth appearance |
| Click | Close drawer | Dismiss action |

### Panel Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Panel | `fixed right-0 top-0 h-full bg-white shadow-xl z-50` | Drawer container |
| Width | `w-full max-w-md` | Responsive sizing |
| Transform | `transform transition-transform duration-300` | Slide animation |
| Closed | `translate-x-full` | Hidden off-screen |
| Open | `translate-x-0` | Visible on-screen |

### Header Section

| Element | Content | Styling |
|---------|---------|---------|
| Container | Fixed header | `sticky top-0 bg-white z-10 border-b` |
| Title | "Filters" | `text-lg font-semibold` |
| Close Button | X icon | `absolute top-4 right-4` |

### Content Section

| Element | Styling | Behavior |
|---------|---------|----------|
| Container | `flex-1 overflow-y-auto p-4` | Scrollable area |
| Content | FilterSidebar component | All filter options |
| Padding | `px-4 py-6` | Comfortable spacing |

### Footer Section

| Element | Content | Styling |
|---------|---------|---------|
| Container | Fixed footer | `sticky bottom-0 bg-white border-t p-4` |
| Clear Button | "Clear All" | `flex-1 py-2 border rounded-md` |
| Apply Button | "Apply Filters (245)" | `flex-1 py-2 bg-blue-600 text-white rounded-md` |
| Layout | Flex row with gap | `flex gap-3` |

### Animation Specifications

```
Opening Animation
├── Overlay: opacity 0 → 50% (200ms)
└── Panel: translateX(100%) → 0 (300ms)

Closing Animation
├── Overlay: opacity 50% → 0 (200ms)
└── Panel: translateX(0) → 100% (300ms)
```

### Body Scroll Lock

| Method | Implementation |
|--------|----------------|
| CSS | `overflow: hidden` on body when open |
| JavaScript | Disable scroll events |
| Library | react-remove-scroll or similar |
| Restore | Remove lock on drawer close |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Focus Trap | Keep focus within drawer when open |
| Escape Key | Close drawer on Escape press |
| Initial Focus | Focus close button or first filter |
| Aria-Modal | `aria-modal="true"` on panel |
| Aria-Label | `aria-label="Filter options"` |

### Apply Button Logic

| State | Button Text | Action |
|-------|-------------|--------|
| No Changes | "Apply Filters" | Close drawer (no refetch) |
| With Changes | "Apply Filters (245)" | Close drawer, refetch products |
| Loading | "Applying..." | Disabled, show spinner |

### Clear All Button

| State | Visibility | Action |
|-------|-----------|--------|
| No Filters | Visible | No action (disabled) |
| Has Filters | Visible | Clear all filters |

### Drawer State Management

```
User Clicks Mobile Filter Button
         │
         ▼
setIsOpen(true)
         │
         ▼
Drawer Slides In
         │
         ├─────────────────────────┐
         ▼                         ▼
   User Adjusts Filters     User Clicks Close
         │                         │
         ▼                         ▼
   Clicks Apply              setIsOpen(false)
         │                         │
         ▼                         ▼
   onApply() Called          Drawer Slides Out
         │
         ▼
   Refetch Products
         │
         ▼
   Close Drawer
```

### Expected Outcome
- Drawer slides in from right on mobile
- Contains full FilterSidebar functionality
- Fixed header with close button
- Fixed footer with action buttons
- Smooth animations and transitions
- Body scroll locked when drawer open
- Accessible to keyboard and screen readers

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Filters/MobileFilterDrawer.tsx` file created
- [ ] Drawer opens when isOpen is true
- [ ] Drawer slides in from right with animation
- [ ] Overlay covers screen with backdrop
- [ ] Clicking overlay closes drawer
- [ ] Header with title and close button
- [ ] FilterSidebar renders in content area
- [ ] Footer with Clear All and Apply buttons
- [ ] Body scroll locked when drawer open
- [ ] Escape key closes drawer
- [ ] Focus trapped within drawer
- [ ] Proper ARIA attributes set
- [ ] Component exports correctly

---

## Task 66: Create Pagination Component

### Overview
Create the Pagination component that allows users to navigate through multiple pages of products. This component displays page numbers, previous/next buttons, and current page information, providing clear navigation for large product sets while maintaining URL synchronization.

### Dependencies
- Task 16: ProductGrid component must exist
- SubPhase-02 (Product State Management) pagination state

### Instructions

1. **Create Pagination component file**
   - Create file in `components/storefront/catalog/Pagination/` directory
   - Name file `Pagination.tsx`
   - Set up React functional component structure

2. **Define component props interface**
   - Create `PaginationProps` interface
   - Include `currentPage` prop (number)
   - Include `totalPages` prop (number)
   - Include `onPageChange` prop (callback function)
   - Include optional `pageSize` and `totalItems` props

3. **Implement pagination container**
   - Create wrapper div with proper spacing
   - Center horizontally on page
   - Add padding for breathing room

4. **Add pagination info display**
   - Show current page and total pages
   - Format: "Page 2 of 10"
   - Position above or beside controls

5. **Create pagination controls container**
   - Flex layout for horizontal alignment
   - Include placeholders for PrevNextButtons
   - Include placeholder for PageNumbers
   - Add proper spacing between elements

6. **Implement basic navigation logic**
   - Calculate page range to display
   - Determine if prev/next should be enabled
   - Handle edge cases (first page, last page)

7. **Add results information (optional)**
   - Show range of results: "Showing 25-48 of 245"
   - Calculate based on page size and current page
   - Display below or above pagination controls

8. **Handle loading and disabled states**
   - Disable all buttons during loading
   - Show loading indicator if needed
   - Apply disabled styling appropriately

9. **Implement responsive layout**
   - Compact layout on mobile
   - Full controls on desktop
   - Adjust spacing and sizing

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| currentPage | number | Yes | 1 | Current active page (1-indexed) |
| totalPages | number | Yes | - | Total number of pages |
| onPageChange | (page: number) => void | Yes | - | Page change callback |
| pageSize | number | No | 24 | Items per page |
| totalItems | number | No | - | Total number of items |
| isLoading | boolean | No | false | Loading state |

### Pagination Structure

```
┌─────────────────────────────────────────────────┐
│         Showing 25-48 of 245 products           │
├─────────────────────────────────────────────────┤
│  [← Prev]  [1] ... [5] [6] [7] ... [15]  [Next →]│
│                        ↑                        │
│                   Current Page                  │
└─────────────────────────────────────────────────┘
```

### Page Display Logic

| Total Pages | Display Pattern | Example |
|-------------|-----------------|---------|
| ≤ 7 | All pages | [1] [2] [3] [4] [5] [6] [7] |
| > 7, near start | Start + ellipsis + end | [1] [2] [3] [4] ... [15] |
| > 7, middle | Start + middle + end | [1] ... [5] [6] [7] ... [15] |
| > 7, near end | Start + ellipsis + end | [1] ... [12] [13] [14] [15] |

### Pagination Algorithm

```
Total Pages: 15
Current Page: 7

Display:
[1] ... [5] [6] [7] [8] [9] ... [15]
        ↑   ↑   ↑   ↑   ↑
    Current ± 2 pages
```

### Container Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Wrapper | `flex flex-col items-center gap-4 py-8` | Overall container |
| Controls | `flex items-center gap-2` | Button row |
| Info Text | `text-sm text-gray-600` | Results display |

### Results Information Display

| Formula | Example | Display |
|---------|---------|---------|
| Start = (page - 1) × pageSize + 1 | (2 - 1) × 24 + 1 | 25 |
| End = min(page × pageSize, total) | min(2 × 24, 245) | 48 |
| Display | "Showing {start}-{end} of {total}" | "Showing 25-48 of 245" |

### Page Range Calculation

| Scenario | Algorithm |
|----------|-----------|
| Total ≤ 7 | Show all pages |
| Start (pages 1-4) | [1,2,3,4,5,...,last] |
| Middle | [1,...,curr-2,curr-1,curr,curr+1,curr+2,...,last] |
| End (last 4 pages) | [1,...,last-4,last-3,last-2,last-1,last] |

### Button States

| Button | Disabled When | Enabled When |
|--------|---------------|--------------|
| Previous | currentPage === 1 | currentPage > 1 |
| Next | currentPage === totalPages | currentPage < totalPages |
| Page Number | currentPage === pageNum | currentPage !== pageNum |

### Edge Cases

| Case | Handling |
|------|----------|
| totalPages = 0 | Hide pagination |
| totalPages = 1 | Show but disable all navigation |
| currentPage > totalPages | Reset to page 1 or last page |
| Invalid currentPage | Validate and correct |

### Responsive Behavior

```
Desktop (≥ 768px)
[← Previous]  [1] [2] [3] [4] [5] [6] [7]  [Next →]
              ↑ Show 5-7 page numbers

Mobile (< 768px)
[←] [1] ... [5] [6] [7] ... [15] [→]
     ↑ Show 3 page numbers, use ellipsis
```

### Loading State

| State | Pagination Display |
|-------|-------------------|
| Loading | Disabled buttons, optional spinner |
| Loaded | Enabled buttons (where applicable) |
| Error | Show error message, disable buttons |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Nav Element | Wrap in `<nav aria-label="Pagination">` |
| Current Page | `aria-current="page"` on active button |
| Page Labels | `aria-label="Go to page {num}"` |
| Disabled | `aria-disabled="true"` |

### Expected Outcome
- Functional pagination with page numbers
- Previous and next navigation buttons
- Clear indication of current page
- Disabled states for edge cases (first/last page)
- Results information display
- Responsive layout for mobile and desktop

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Pagination/Pagination.tsx` file created
- [ ] Component displays current and total pages
- [ ] Placeholders for PageNumbers and PrevNext components
- [ ] Page range calculation logic implemented
- [ ] Disabled states handled correctly
- [ ] Results information displays correctly
- [ ] Responsive layout works on mobile
- [ ] Accessibility features implemented
- [ ] Component exports correctly

---

## Task 67: Create Page Numbers

### Overview
Create the PageNumbers component that renders the clickable page number buttons for the pagination interface. This component displays the calculated page range with ellipsis for skipped pages, highlighting the current page and providing clickable buttons for quick navigation.

### Dependencies
- Task 66: Create Pagination Component

### Instructions

1. **Create PageNumbers component file**
   - Create file in `components/storefront/catalog/Pagination/` directory
   - Name file `PageNumbers.tsx`
   - Set up React functional component structure

2. **Define component props interface**
   - Create `PageNumbersProps` interface
   - Include `currentPage` prop (number)
   - Include `totalPages` prop (number)
   - Include `onPageClick` prop (callback function)
   - Include optional `maxDisplayed` prop (default 7)

3. **Implement page range calculation**
   - Create function to calculate visible pages
   - Return array of page numbers and ellipsis
   - Use algorithm from Task 66 documentation

4. **Create page number array**
   - Calculate start and end of visible range
   - Include first and last pages
   - Add ellipsis (null or special value) where needed

5. **Render page buttons**
   - Map through page number array
   - Render button for each page number
   - Render ellipsis span for gaps
   - Add key prop for React list rendering

6. **Style current page button**
   - Different background color (primary blue)
   - White text for contrast
   - Bold or different font weight
   - Indicate aria-current="page"

7. **Style inactive page buttons**
   - Light background or border
   - Gray text color
   - Hover effects for interactivity
   - Clickable cursor

8. **Style ellipsis**
   - Non-clickable span
   - Gray color to match disabled
   - Same height as buttons for alignment
   - No hover effects

9. **Implement button click handler**
   - Call onPageClick prop with page number
   - Prevent click on current page (optional)
   - Add loading state handling

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| currentPage | number | Yes | - | Current active page |
| totalPages | number | Yes | - | Total number of pages |
| onPageClick | (page: number) => void | Yes | - | Page click callback |
| maxDisplayed | number | No | 7 | Max page buttons to show |
| isLoading | boolean | No | false | Loading state |

### Page Range Examples

```
Scenario 1: Total 5 pages, Current 3
[1] [2] [3] [4] [5]
        ↑

Scenario 2: Total 15 pages, Current 3
[1] [2] [3] [4] [5] ... [15]
        ↑

Scenario 3: Total 15 pages, Current 8
[1] ... [6] [7] [8] [9] [10] ... [15]
                ↑

Scenario 4: Total 15 pages, Current 13
[1] ... [11] [12] [13] [14] [15]
                  ↑
```

### Page Range Algorithm

```typescript
function calculatePageRange(
  currentPage: number,
  totalPages: number,
  maxDisplayed: number = 7
): (number | null)[] {
  if (totalPages <= maxDisplayed) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const pages: (number | null)[] = [];
  const halfMax = Math.floor((maxDisplayed - 2) / 2);
  
  // Always include first page
  pages.push(1);
  
  // Calculate middle range
  let start = Math.max(2, currentPage - halfMax);
  let end = Math.min(totalPages - 1, currentPage + halfMax);
  
  // Adjust if near edges
  if (currentPage <= halfMax + 2) {
    end = maxDisplayed - 1;
  } else if (currentPage >= totalPages - halfMax - 1) {
    start = totalPages - maxDisplayed + 2;
  }
  
  // Add ellipsis or pages after first
  if (start > 2) {
    pages.push(null); // ellipsis
  }
  
  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  // Add ellipsis or pages before last
  if (end < totalPages - 1) {
    pages.push(null); // ellipsis
  }
  
  // Always include last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
}
```

### Button Styling

| State | Tailwind Classes | Purpose |
|-------|------------------|---------|
| Base | `px-3 py-2 border rounded-md transition-colors` | Button structure |
| Current | `bg-blue-600 text-white border-blue-600 font-medium` | Active page |
| Inactive | `bg-white text-gray-700 border-gray-300 hover:bg-gray-50` | Other pages |
| Disabled | `opacity-50 cursor-not-allowed` | Loading state |
| Ellipsis | `px-3 py-2 text-gray-400` | Non-clickable |

### Page Button Sizes

| Breakpoint | Size | Padding |
|------------|------|---------|
| Mobile | Compact | `px-2 py-1 text-sm` |
| Tablet | Standard | `px-3 py-2 text-base` |
| Desktop | Standard | `px-3 py-2 text-base` |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Current Page | `aria-current="page"` on active button |
| Page Label | `aria-label="Page {number}"` |
| Button Type | `<button type="button">` |
| Disabled | `disabled` attribute during loading |

### Click Handler Logic

```
User Clicks Page Button
         │
         ▼
Is it current page?
    │        │
   Yes       No
    │        │
    ▼        ▼
 No-op   onPageClick(pageNum)
              │
              ▼
    Parent handles page change
              │
              ▼
       Update URL & Refetch
```

### Rendering Logic

```typescript
{pageRange.map((page, index) => {
  if (page === null) {
    return <span key={`ellipsis-${index}`}>...</span>;
  }
  
  const isActive = page === currentPage;
  
  return (
    <button
      key={page}
      onClick={() => onPageClick(page)}
      disabled={isActive || isLoading}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Page ${page}`}
    >
      {page}
    </button>
  );
})}
```

### Ellipsis Styling

| Element | Content | Styling |
|---------|---------|---------|
| Span | "..." or "…" | `text-gray-400 px-2` |
| Alignment | Center | `flex items-center` |
| Height | Match buttons | Same line height |

### Expected Outcome
- Page number buttons render based on algorithm
- Current page highlighted with distinct styling
- Ellipsis displayed for skipped page ranges
- Clicking page number triggers navigation
- Responsive sizing on different devices

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Pagination/PageNumbers.tsx` file created
- [ ] Page range calculation algorithm implemented
- [ ] Page buttons render correctly for all scenarios
- [ ] Current page has distinct styling
- [ ] Ellipsis displays for skipped ranges
- [ ] onPageClick callback fires with correct page number
- [ ] Accessibility attributes set correctly
- [ ] Responsive styling on mobile
- [ ] Component exports correctly

---

## Task 68: Create Previous/Next Buttons

### Overview
Create the PrevNextButtons component that provides "Previous" and "Next" navigation buttons for moving between pages. These buttons flank the page numbers and provide an intuitive way to move through pages sequentially, with appropriate disabled states at pagination boundaries.

### Dependencies
- Task 66: Create Pagination Component

### Instructions

1. **Create PrevNextButtons component file**
   - Create file in `components/storefront/catalog/Pagination/` directory
   - Name file `PrevNextButtons.tsx`
   - Set up React functional component structure

2. **Define component props interface**
   - Create `PrevNextButtonsProps` interface
   - Include `currentPage` prop (number)
   - Include `totalPages` prop (number)
   - Include `onPrevious` prop (callback function)
   - Include `onNext` prop (callback function)
   - Include `isLoading` prop (boolean)

3. **Create button wrapper**
   - Return fragment or wrapper with two buttons
   - Or export as separate Previous and Next components
   - Decide based on usage pattern

4. **Implement Previous button**
   - Text: "Previous" or "← Previous"
   - Icon: Left arrow (optional)
   - Disabled when currentPage === 1
   - Click handler calls onPrevious

5. **Implement Next button**
   - Text: "Next" or "Next →"
   - Icon: Right arrow (optional)
   - Disabled when currentPage === totalPages
   - Click handler calls onNext

6. **Apply disabled styling**
   - Gray out button when disabled
   - Remove hover effects
   - Show not-allowed cursor
   - Maintain button size for layout

7. **Add loading state**
   - Disable both buttons during loading
   - Optional: Show spinner
   - Maintain consistent button appearance

8. **Implement accessibility features**
   - Use semantic button elements
   - Add aria-label for clarity
   - Include disabled attribute
   - Ensure keyboard navigation works

9. **Add responsive behavior**
   - Show full text on desktop
   - Use icon-only on mobile (optional)
   - Maintain minimum touch target size
   - Adjust padding as needed

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| currentPage | number | Yes | - | Current active page |
| totalPages | number | Yes | - | Total number of pages |
| onPrevious | () => void | Yes | - | Previous button callback |
| onNext | () => void | Yes | - | Next button callback |
| isLoading | boolean | No | false | Loading state |

### Button Structure

```
[← Previous]  ...page numbers...  [Next →]
     ↑                                ↑
   Icon + Text                   Text + Icon
```

### Button Text Variations

| Screen Size | Previous | Next |
|-------------|----------|------|
| Desktop | "Previous" or "← Previous" | "Next" or "Next →" |
| Tablet | "Previous" | "Next" |
| Mobile | "←" or "Prev" | "→" or "Next" |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Button Base | `flex items-center gap-2 px-4 py-2 border rounded-md` | Structure |
| Enabled | `bg-white text-gray-700 hover:bg-gray-50 border-gray-300` | Clickable |
| Disabled | `bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200` | Non-clickable |
| Icon | `w-4 h-4` | Arrow size |

### Button States

| State | Previous Disabled? | Next Disabled? |
|-------|-------------------|----------------|
| Page 1 of 10 | Yes | No |
| Page 5 of 10 | No | No |
| Page 10 of 10 | No | Yes |
| Loading | Yes | Yes |

### Disabled Logic

```typescript
const isPreviousDisabled = currentPage === 1 || isLoading;
const isNextDisabled = currentPage === totalPages || isLoading;
```

### Click Handlers

```typescript
function handlePrevious() {
  if (currentPage > 1 && !isLoading) {
    onPrevious();
  }
}

function handleNext() {
  if (currentPage < totalPages && !isLoading) {
    onNext();
  }
}
```

### Icon Options

| Icon Library | Previous Icon | Next Icon |
|--------------|---------------|-----------|
| Lucide React | ChevronLeft | ChevronRight |
| Heroicons | ChevronLeftIcon | ChevronRightIcon |
| Unicode | ← (U+2190) | → (U+2192) |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Button Type | `<button type="button">` |
| Aria-Label | "Go to previous page" / "Go to next page" |
| Disabled Attr | `disabled={isPreviousDisabled}` |
| Keyboard | Enter/Space to activate |

### Layout Integration

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [← Previous]  [1] [2] [3] [4] [5]  [Next →]   │
│       ↑                                ↑        │
│   Prev button                     Next button   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Responsive Variations

```
Desktop
[← Previous]  [1] [2] [3]  [Next →]

Tablet
[← Prev]  [1] [2] [3]  [Next →]

Mobile
[←]  [1] [2] [3]  [→]
```

### Loading State

| Element | Appearance |
|---------|------------|
| Previous Button | Disabled, gray |
| Next Button | Disabled, gray |
| Optional Spinner | In button or nearby |

### Expected Outcome
- Previous button navigates to prior page
- Next button navigates to next page
- Buttons disabled at pagination boundaries
- Clear visual indication of disabled state
- Accessible to keyboard and screen readers

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Pagination/PrevNextButtons.tsx` file created
- [ ] Previous button renders with correct text/icon
- [ ] Next button renders with correct text/icon
- [ ] Previous disabled on first page
- [ ] Next disabled on last page
- [ ] Both disabled during loading
- [ ] Click handlers fire correctly
- [ ] Accessibility attributes set properly
- [ ] Responsive text/icon variations work
- [ ] Component exports correctly

---

## Task 69: Create Load More Button

### Overview
Create the LoadMoreButton component as an alternative pagination approach that appends more products to the current view instead of replacing them. This "infinite scroll" style button appears at the bottom of the product grid, loading additional products when clicked until all products are displayed.

### Dependencies
- Task 66: Create Pagination Component
- ProductGrid component from Group B

### Instructions

1. **Create LoadMoreButton component file**
   - Create file in `components/storefront/catalog/Pagination/` directory
   - Name file `LoadMoreButton.tsx`
   - Set up React functional component structure

2. **Define component props interface**
   - Create `LoadMoreButtonProps` interface
   - Include `onLoadMore` prop (callback function)
   - Include `hasMore` prop (boolean)
   - Include `isLoading` prop (boolean)
   - Include optional `currentCount` and `totalCount` props

3. **Implement button element**
   - Create large, prominent button
   - Center horizontally below product grid
   - Use primary or secondary styling

4. **Add button text**
   - Default: "Load More Products"
   - Loading: "Loading..." with spinner
   - No more: "All products loaded" (disabled)
   - Optional: Show count "Load More (24 of 245)"

5. **Implement loading state**
   - Show spinner icon in button
   - Disable button during loading
   - Change text to "Loading..."
   - Maintain button size to prevent layout shift

6. **Handle "no more" state**
   - Show when hasMore is false
   - Disable button
   - Change text to completion message
   - Optional: Hide button completely

7. **Add progress indicator**
   - Show current vs total count
   - Format: "Showing 48 of 245 products"
   - Position above or within button
   - Update after each load

8. **Implement click handler**
   - Call onLoadMore prop
   - Button should remain disabled until loading completes
   - Handle errors gracefully

9. **Add accessibility features**
   - Use semantic button element
   - Add aria-label describing action
   - Include aria-busy during loading
   - Ensure keyboard accessibility

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onLoadMore | () => void | Yes | - | Load more callback |
| hasMore | boolean | Yes | - | More products available |
| isLoading | boolean | No | false | Loading state |
| currentCount | number | No | - | Current product count |
| totalCount | number | No | - | Total product count |
| pageSize | number | No | 24 | Products per load |

### Button States

```
Default State
┌───────────────────────────┐
│   Load More Products      │
└───────────────────────────┘

Loading State
┌───────────────────────────┐
│   ◌ Loading...            │
└───────────────────────────┘

No More State
┌───────────────────────────┐
│   All products loaded ✓   │
└───────────────────────────┘
```

### Button Text Variations

| State | hasMore | isLoading | Text |
|-------|---------|-----------|------|
| Default | true | false | "Load More Products" |
| Loading | true | true | "Loading..." |
| Complete | false | false | "All products loaded" |
| With Count | true | false | "Load More (24 remaining)" |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex flex-col items-center gap-3 py-8` | Wrapper |
| Button | `px-6 py-3 rounded-md font-medium transition-colors` | Button base |
| Default | `bg-white border-2 border-gray-300 hover:bg-gray-50` | Clickable |
| Loading | `bg-gray-100 text-gray-500 cursor-wait` | Processing |
| Complete | `bg-green-50 text-green-700 border-green-200` | Done |

### Progress Information

| Display | Format | Example |
|---------|--------|---------|
| Simple | "Showing X of Y" | "Showing 48 of 245" |
| With Count | "Showing X-Y of Z products" | "Showing 1-48 of 245 products" |
| Remaining | "X more products" | "197 more products" |

### Loading Indicator

| Element | Implementation |
|---------|----------------|
| Spinner | Rotating circle icon |
| Position | Left of text |
| Animation | CSS spin animation |
| Library | Lucide: Loader2 with animate-spin |

### Load More Flow

```
User Scrolls to Bottom
         │
         ▼
Sees Load More Button
         │
         ▼
Clicks Button
         │
         ▼
onLoadMore() Called
         │
         ▼
Set isLoading = true
         │
         ▼
Fetch Next Page
         │
         ▼
Append Products to Grid
         │
         ▼
Set isLoading = false
         │
         ▼
Check hasMore
    │        │
  True      False
    │        │
    ▼        ▼
 Enable   Show "All loaded"
  Button
```

### API Integration

| Aspect | Implementation |
|--------|----------------|
| Page Tracking | Track current page number |
| Request | Fetch page N + 1 |
| Response | Append to existing products |
| hasMore | Check if current < total pages |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Button Type | `<button type="button">` |
| Aria-Label | "Load more products" |
| Aria-Busy | `aria-busy={isLoading}` |
| Disabled | `disabled={!hasMore || isLoading}` |
| Live Region | `aria-live="polite"` for count updates |

### Automatic Loading (Optional)

| Feature | Implementation |
|---------|----------------|
| Intersection Observer | Detect when button in viewport |
| Auto-trigger | Call onLoadMore automatically |
| Threshold | Trigger when 100-200px before button |
| Disable | Allow user to disable auto-load |

### Error Handling

| Error Scenario | Handling |
|----------------|----------|
| API Failure | Show error message, re-enable button |
| Network Error | Show retry button |
| No Products | Handle empty response gracefully |
| Timeout | Show timeout message, allow retry |

### Expected Outcome
- Button displays below product grid
- Clicking loads more products
- Loading state shows spinner and disabled button
- Products append to grid smoothly
- Button hides or disables when all products loaded
- Progress indicator shows current count

### Verification Checklist
- [ ] `frontend/components/storefront/catalog/Pagination/LoadMoreButton.tsx` file created
- [ ] Button displays correct text for each state
- [ ] Loading state shows spinner and disables button
- [ ] onLoadMore callback fires on click
- [ ] Button disabled when hasMore is false
- [ ] Progress information displays correctly
- [ ] Smooth product appending to grid
- [ ] Accessibility features implemented
- [ ] Component exports correctly

---

## Task 70: Create URL State Sync

### Overview
Implement URL state synchronization that keeps filter, sort, pagination, and view mode state in sync with the browser URL. This creates shareable links that maintain the exact catalog state and enables browser back/forward navigation, improving the user experience and SEO.

### Dependencies
- Task 58: Remove Filter Action
- Task 61: Create Sort Change Handler
- Task 66: Create Pagination Component
- All filter components from Group C

### Instructions

1. **Choose URL state library**
   - Option A: nuqs (recommended for Next.js App Router)
   - Option B: next-router-query for type-safe params
   - Option C: Custom hook with Next.js useRouter and useSearchParams
   - Consider type safety and SSR compatibility

2. **Create useURLState hook**
   - Create file in `hooks/store/` directory
   - Name file `useURLState.ts`
   - Implement custom hook for URL synchronization

3. **Define URL parameter schema**
   - List all possible URL parameters
   - Define types for each parameter
   - Plan serialization format (especially for arrays)

4. **Implement parameter getters**
   - Create getter functions for each parameter
   - Parse URL params to typed values
   - Handle missing or invalid params with defaults

5. **Implement parameter setters**
   - Create setter functions for each parameter
   - Serialize values to URL-safe strings
   - Update URL without page reload
   - Maintain other parameters when updating

6. **Handle filter parameters**
   - Category: Single value (string)
   - Price: Two values (min and max numbers)
   - Colors: Array of strings (comma-separated)
   - Brands: Array of strings (comma-separated)
   - Rating: Single value (number)
   - In Stock: Boolean

7. **Handle sort and view parameters**
   - Sort: Single value (string)
   - View: Single value ('grid' | 'list')
   - Default values when not in URL

8. **Handle pagination parameters**
   - Page: Single value (number, default 1)
   - Page Size: Single value (number, default 24)
   - Validate page is within bounds

9. **Implement batch updates**
   - Allow updating multiple parameters at once
   - Prevent multiple URL updates in quick succession
   - Use single router.push for all changes

10. **Add initialization logic**
    - Read URL params on component mount
    - Initialize filter state from URL
    - Trigger product fetch with URL params

11. **Handle browser navigation**
    - Listen to browser back/forward events
    - Update component state from URL
    - Refetch products with new params

12. **Add URL validation**
    - Validate parameter values
    - Sanitize invalid inputs
    - Redirect to valid URL if needed

### URL Parameter Schema

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| category | string | `?category=electronics` | Selected category |
| min_price | number | `?min_price=100` | Minimum price |
| max_price | number | `?max_price=500` | Maximum price |
| colors | string[] | `?colors=red,blue` | Selected colors |
| brands | string[] | `?brands=samsung,lg` | Selected brands |
| rating | number | `?rating=4` | Minimum rating |
| in_stock | boolean | `?in_stock=true` | In stock only |
| sort | string | `?sort=price_low` | Sort option |
| view | string | `?view=list` | View mode |
| page | number | `?page=2` | Current page |

### URL Examples

```
Basic Category Filter:
/products?category=electronics

Multiple Filters:
/products?category=electronics&min_price=100&max_price=500&colors=red,blue

With Sort and Page:
/products?category=electronics&sort=price_low&page=2

Complete URL:
/products?category=electronics&min_price=100&max_price=500&colors=red,blue&brands=samsung,lg&rating=4&sort=price_low&view=list&page=1
```

### Hook Implementation (nuqs)

```typescript
import { useQueryState, useQueryStates } from 'nuqs';

export function useURLState() {
  // Single values
  const [category, setCategory] = useQueryState('category');
  const [sort, setSort] = useQueryState('sort', { defaultValue: 'newest' });
  const [page, setPage] = useQueryState('page', { defaultValue: 1, parse: parseInt });
  
  // Arrays
  const [colors, setColors] = useQueryState('colors', {
    parse: (value) => value?.split(',') || [],
    serialize: (value) => value.join(',')
  });
  
  // ... other parameters
  
  return {
    category,
    setCategory,
    sort,
    setSort,
    page,
    setPage,
    colors,
    setColors,
    // ... other getters/setters
  };
}
```

### Array Serialization

| Parameter | Array | URL Format |
|-----------|-------|------------|
| colors | ['red', 'blue', 'green'] | `colors=red,blue,green` |
| brands | ['samsung', 'lg'] | `brands=samsung,lg` |
| Empty | [] | Parameter omitted |

### Parameter Validation

| Parameter | Validation | Fallback |
|-----------|-----------|----------|
| page | > 0 and <= totalPages | 1 |
| min_price | >= 0 | undefined |
| max_price | >= min_price | undefined |
| rating | 1-5 | undefined |
| sort | Valid sort option | 'newest' |
| view | 'grid' or 'list' | 'grid' |

### State Synchronization Flow

```
User Changes Filter
         │
         ▼
Update Component State
         │
         ▼
Update URL Parameters
         │
         ├──────────────────┐
         ▼                  ▼
   URL Changes      Router Updates
         │                  │
         ▼                  ▼
   Shareable Link   Back/Forward Works
         │
         ▼
   Fetch Products with URL Params
```

### Browser Navigation Handling

```
User Clicks Back Button
         │
         ▼
URL Changes (browser)
         │
         ▼
useEffect Detects URL Change
         │
         ▼
Parse New URL Parameters
         │
         ▼
Update Component State
         │
         ▼
Refetch Products
```

### Initialization Flow

```
Page Loads
    │
    ▼
Read URL Params
    │
    ▼
Parse to State Values
    │
    ▼
Validate Parameters
    │
    ├─────────────┐
   Valid       Invalid
    │             │
    ▼             ▼
Use Values   Use Defaults
    │             │
    └──────┬──────┘
           ▼
    Initialize State
           │
           ▼
    Fetch Products
```

### Batch Update Function

```typescript
function updateFilters(updates: Partial<FilterState>) {
  const searchParams = new URLSearchParams(window.location.search);
  
  // Apply all updates
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      searchParams.delete(key);
    } else if (Array.isArray(value)) {
      searchParams.set(key, value.join(','));
    } else {
      searchParams.set(key, String(value));
    }
  });
  
  // Single router update
  router.push(`${pathname}?${searchParams.toString()}`);
}
```

### SEO Benefits

| Benefit | Description |
|---------|-------------|
| Crawlable URLs | Search engines can index filtered pages |
| Unique URLs | Each filter combination has unique URL |
| Shareable | Users can share specific filtered views |
| Bookmarkable | Users can bookmark filtered pages |

### Performance Considerations

| Aspect | Implementation |
|--------|----------------|
| Debouncing | Debounce URL updates for range inputs |
| Shallow Routing | Use shallow routing to prevent full reload |
| State Batching | Batch multiple state updates |
| Cache | Cache API responses based on URL params |

### Expected Outcome
- All filter, sort, and pagination state in URL
- URL updates reflect state changes immediately
- Shareable links maintain exact page state
- Browser back/forward navigation works
- URL parameters validated and sanitized
- Smooth user experience without page reloads

### Verification Checklist
- [ ] `frontend/hooks/store/useURLState.ts` file created
- [ ] All filter parameters sync to URL
- [ ] Sort and view mode sync to URL
- [ ] Pagination syncs to URL
- [ ] URL updates on state changes
- [ ] State initializes from URL on page load
- [ ] Browser back/forward navigation works
- [ ] Invalid parameters handled gracefully
- [ ] Array parameters serialize correctly
- [ ] Shareable URLs work correctly
- [ ] No page reloads during URL updates

---

## Summary

This document completed the mobile filter interface, pagination functionality, and URL state management for the product catalog. The mobile drawer provides full filtering access on small screens, pagination offers multiple navigation options, and URL synchronization enables shareable links and browser navigation support.

### Completed Tasks
1. ✓ Created MobileFilterButton for opening filter drawer on mobile
2. ✓ Created MobileFilterDrawer with slide-in panel and full filter access
3. ✓ Created Pagination component with page navigation structure
4. ✓ Created PageNumbers component with intelligent page range display
5. ✓ Created PrevNextButtons for sequential page navigation
6. ✓ Created LoadMoreButton for infinite scroll alternative
7. ✓ Implemented URL state synchronization for shareable links

### Group D Complete
All tasks in Group D (Sort & Pagination) are now complete. The catalog toolbar, mobile filter access, pagination controls, and URL state management provide a comprehensive product browsing experience across all device sizes with shareable, SEO-friendly URLs.

### Next Steps
Proceed to Group E (Category & Collection Pages) to create dedicated pages for category browsing and product collections.
