# Tasks 17-28: Search & Quick Buttons

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** B - Product Search & Quick Buttons  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_POS-Routes-Layout-Structure/](../Group-A_POS-Routes-Layout-Structure/)
- **→ Next Document:** [02_Tasks-29-34_Display-Modal-API.md](02_Tasks-29-34_Display-Modal-API.md)

---

## Document Overview

This document covers the complete product search interface with barcode scanning support and the quick buttons grid for fast product selection in the POS terminal.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Create Product Search Bar | Medium |
| 18 | Create Search Input Component | Low |
| 19 | Create Barcode Scanner Handler | Medium |
| 20 | Create Search Results Dropdown | Medium |
| 21 | Create Search Result Item | Low |
| 22 | Create Add from Search | Low |
| 23 | Create Quick Buttons Container | Low |
| 24 | Create Quick Button Component | Medium |
| 25 | Create Quick Button Grid | Low |
| 26 | Create Category Tabs | Low |
| 27 | Create Category Tab Item | Low |
| 28 | Create Quick Button Action | Low |

---

## Task 17: Create Product Search Bar

### Overview
Create the main product search bar component that serves as the primary method for finding and adding products to the cart, integrating search input and results display.

### Dependencies
- Group A, Task 10: Create Product Panel

### Instructions

1. **Create search bar component**
   - Create `ProductSearch.tsx` in `components/modules/pos/ProductPanel/`
   - Container for search input and results
   - Top section of Product Panel

2. **Define component structure**
   - Search input field (Task 18)
   - Results dropdown (Task 20)
   - Loading indicator
   - Clear button

3. **Add search state management**
   - Search query state
   - Results state
   - Loading state
   - Selected result index (keyboard navigation)

4. **Implement search behavior**
   - Debounce search input (300ms)
   - Trigger API call on input change
   - Handle empty query (clear results)
   - Show loading during search

5. **Add container styling**
   - Full width of panel
   - Fixed at top or scrollable with panel
   - Adequate padding
   - Z-index for results dropdown

6. **Handle search focus**
   - Auto-focus on page load (F2 shortcut)
   - Focus on keyboard shortcut
   - Clear on Escape key
   - Maintain focus during typing

### Search Bar Structure
```
┌─────────────────────────────────────┐
│ ProductSearch Container             │
│ ┌─────────────────────────────────┐ │
│ │ [🔍] Search or scan... [×]      │ │ ← Search Input
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Product 1          LKR 100.00   │ │
│ │ Product 2          LKR 250.00   │ │ ← Results Dropdown
│ │ Product 3          LKR 150.00   │ │   (When active)
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Search States

| State | Condition | Display |
|-------|-----------|---------|
| Empty | No query | Input only |
| Typing | Query entered | Input + loading |
| Results | Data returned | Input + dropdown |
| No Results | Empty data | Input + "No results" |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/ProductSearch.tsx

// 'use client' directive
// Imports
// ProductSearch component
//   - Search state
//   - Debounced search handler
//   - SearchInput component
//   - SearchResults dropdown
```

### Verification Checklist
- [ ] `ProductSearch.tsx` created
- [ ] Search state managed
- [ ] Debounce implemented
- [ ] Search input rendered
- [ ] Results dropdown conditional
- [ ] Loading indicator shown
- [ ] Auto-focus works
- [ ] Clear functionality present

---

## Task 18: Create Search Input Component

### Overview
Create the search input field component with auto-focus, placeholder text, icons, and clear button for entering product search queries.

### Dependencies
- Task 17: Create Product Search Bar

### Instructions

1. **Create input component**
   - Create `SearchInput.tsx` in ProductPanel directory
   - Controlled input component
   - Accept value and onChange props

2. **Add input field**
   - Type: text
   - Placeholder: "Search or scan barcode..."
   - Auto-complete: off (prevent browser suggestions)
   - Name and ID attributes

3. **Add search icon**
   - Position: Left side of input
   - Icon: Magnifying glass
   - Visual indicator of search function
   - Fixed position within input

4. **Add barcode icon**
   - Position: Near search icon or right side
   - Icon: Barcode symbol
   - Indicates barcode scanning support
   - Tooltip: "Supports barcode scanning"

5. **Add clear button**
   - Position: Right side of input
   - Icon: X or close icon
   - Visible only when input has value
   - Click to clear input and results

6. **Implement auto-focus**
   - Focus on component mount
   - Use useEffect with ref
   - Focus on keyboard shortcut (F2)
   - Select all text on focus (optional)

7. **Style input appropriately**
   - Large, touch-friendly size
   - Clear typography
   - Sufficient padding for icons
   - Border and focus states

### Input Layout
```
┌─────────────────────────────────────────┐
│ [🔍] [▯] Search or scan barcode... [×] │
│  ↑    ↑                            ↑    │
│  │    │                            │    │
│  │    └─ Barcode Icon              │    │
│  └────── Search Icon         Clear ─┘   │
└─────────────────────────────────────────┘
```

### Input States

| State | Border | Icon |
|-------|--------|------|
| Empty | Normal | Search |
| Focus | Highlighted | Search + Barcode |
| Has Value | Normal | Search + Clear |
| Disabled | Grayed | Search only |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/SearchInput.tsx

// Imports
// SearchInput component props
// SearchInput component
//   - Input field with ref
//   - Icons
//   - Clear button
//   - Auto-focus effect
```

### Verification Checklist
- [ ] `SearchInput.tsx` created
- [ ] Input field rendered
- [ ] Placeholder text clear
- [ ] Search icon displayed
- [ ] Barcode icon shown
- [ ] Clear button appears with value
- [ ] Auto-focus works
- [ ] Styling touch-friendly

---

## Task 19: Create Barcode Scanner Handler

### Overview
Implement barcode scanner detection logic that captures rapid keystroke input from barcode scanners and automatically searches for products by barcode.

### Dependencies
- Task 17: Create Product Search Bar

### Instructions

1. **Create barcode handler hook**
   - Create `useBarcodeScanner.ts` in `hooks/` directory
   - Custom hook for barcode detection
   - Return detected barcode value

2. **Implement keystroke detection**
   - Listen to keydown events
   - Track time between keystrokes
   - Barcode scanner types fast (< 50ms between keys)
   - Human typing is slower (> 100ms typically)

3. **Define barcode pattern**
   - Typical length: 8-13 characters
   - Characters: Numeric or alphanumeric
   - Ends with Enter key (scanner sends Enter)
   - Validate format before processing

4. **Build barcode buffer**
   - Accumulate characters in buffer
   - Clear buffer after timeout (100ms)
   - Trigger search on Enter key
   - Reset buffer after processing

5. **Add barcode validation**
   - Check length (min 8, max 13)
   - Validate character pattern
   - Verify checksum (if applicable)
   - Ignore invalid sequences

6. **Integrate with search**
   - Set search input value to barcode
   - Trigger search API call
   - Highlight matched product
   - Auto-add if single result

7. **Handle edge cases**
   - Prevent normal typing interference
   - Disable during modal dialogs
   - Clear buffer on focus loss
   - Log failed scans for debugging

### Barcode Detection Flow
```
Keydown Event
    │
    ▼
Check Time Since Last Key
    │
    ├─── < 50ms ──────► Likely Scanner
    │                       │
    │                       ▼
    │              Add to Buffer
    │                       │
    │                       ▼
    │              Wait for Enter
    │                       │
    │                       ▼
    │              Validate Barcode
    │                       │
    │                       ▼
    │              Trigger Search
    │
    └─── > 100ms ─────► Human Typing
                            │
                            ▼
                    Clear Buffer / Ignore
```

### Barcode Characteristics

| Feature | Scanner | Human |
|---------|---------|-------|
| Speed | < 50ms | > 100ms |
| Pattern | Consistent | Variable |
| End | Enter key | No Enter |
| Length | 8-13 chars | Variable |

### Expected Hook Structure
```typescript
// File: frontend/components/modules/pos/hooks/useBarcodeScanner.ts

// Imports
// Interface for hook return
// useBarcodeScanner hook
//   - Buffer state
//   - Timestamp tracking
//   - Keydown listener
//   - Validation logic
//   - Return barcode and reset
```

### Verification Checklist
- [ ] `useBarcodeScanner.ts` created
- [ ] Keystroke timing measured
- [ ] Buffer accumulates characters
- [ ] Enter key triggers processing
- [ ] Barcode validated
- [ ] Search triggered on valid barcode
- [ ] Buffer clears appropriately
- [ ] Edge cases handled

---

## Task 20: Create Search Results Dropdown

### Overview
Create the search results dropdown component that displays matching products below the search input, supporting keyboard navigation and mouse selection.

### Dependencies
- Task 18: Create Search Input Component

### Instructions

1. **Create results component**
   - Create `SearchResults.tsx` in ProductPanel directory
   - Dropdown positioned below search input
   - Accept results array prop

2. **Define dropdown positioning**
   - Absolute or relative positioning
   - Full width of search input
   - Below input with small gap
   - High z-index (above other content)

3. **Add dropdown styling**
   - Background with border/shadow
   - Max height with scroll (10 items)
   - List appearance
   - Smooth transitions on open/close

4. **Implement results list**
   - Map over results array
   - Render SearchResultItem for each
   - Pass item data and handlers
   - Handle empty results state

5. **Add keyboard navigation**
   - Arrow Up/Down to navigate
   - Highlight selected item
   - Enter to select highlighted item
   - Escape to close dropdown

6. **Handle empty states**
   - No results: "No products found"
   - Loading: "Searching..."
   - Error: "Search failed, try again"
   - Clear message styling

7. **Add click outside handler**
   - Close dropdown on outside click
   - Use ref and event listener
   - Don't close on input click
   - Clean up listeners on unmount

### Results Dropdown Layout
```
┌─────────────────────────────────────┐
│ Search Input                        │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Results Dropdown                    │
│ ┌─────────────────────────────────┐ │
│ │ [img] Product 1    LKR 100.00   │ │ ← Result Item
│ │       SKU: 001 | Stock: 25      │ │
│ ├─────────────────────────────────┤ │
│ │ [img] Product 2    LKR 250.00   │ │
│ │       SKU: 002 | Stock: 10      │ │ ← Highlighted
│ ├─────────────────────────────────┤ │
│ │ [img] Product 3    LKR 150.00   │ │
│ │       SKU: 003 | Stock: 0       │ │ ← Out of Stock
│ └─────────────────────────────────┘ │
│                                     │
│ [Showing 3 of 15 results]           │
└─────────────────────────────────────┘
```

### Dropdown States

| State | Display |
|-------|---------|
| Hidden | Not rendered |
| Loading | Spinner + "Searching..." |
| Results | List of items |
| Empty | "No products found" |
| Error | Error message |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/SearchResults.tsx

// Imports
// SearchResults props
// SearchResults component
//   - Dropdown container
//   - Results list
//   - Empty states
//   - Keyboard navigation
//   - Click outside handler
```

### Verification Checklist
- [ ] `SearchResults.tsx` created
- [ ] Dropdown positioned correctly
- [ ] Results list renders
- [ ] Max height with scroll
- [ ] Keyboard navigation works
- [ ] Empty states display
- [ ] Click outside closes
- [ ] Transitions smooth

---

## Task 21: Create Search Result Item

### Overview
Create the individual search result item component that displays product information including image, name, SKU, price, and stock availability.

### Dependencies
- Task 20: Create Search Results Dropdown

### Instructions

1. **Create result item component**
   - Create `SearchResultItem.tsx` in ProductPanel directory
   - Single product result display
   - Accept product data prop

2. **Define item layout**
   - Horizontal layout
   - Product image on left
   - Product info in middle
   - Price on right
   - Two-line design

3. **Add product image**
   - Small thumbnail (40x40px or 50x50px)
   - Rounded corners
   - Placeholder if no image
   - Alt text for accessibility

4. **Display product information**
   - Line 1: Product name (bold)
   - Line 2: SKU and stock status
   - Truncate long names with ellipsis
   - Clear typography

5. **Show price display**
   - Right-aligned
   - LKR currency format
   - Larger, bold font
   - Consider variant pricing note

6. **Add stock indicator**
   - Text: "Stock: X units"
   - Color coding:
     - Green: In stock (> reorder point)
     - Yellow: Low stock (<= reorder point)
     - Red: Out of stock (0)

7. **Implement hover state**
   - Background color change on hover
   - Cursor pointer
   - Smooth transition
   - Clear visual feedback

8. **Add click handler**
   - Call parent's onSelect function
   - Pass product data
   - Close dropdown after selection
   - Add to cart (Task 22)

### Result Item Layout
```
┌──────────────────────────────────────────────┐
│ [img] Product Name Here          LKR 100.00 │
│       SKU: 12345 | Stock: 25 units          │
└──────────────────────────────────────────────┘
 ↑     ↑                           ↑
 │     │                           └─ Price
 │     └─ Name and details
 └─ Thumbnail
```

### Item Information Elements

| Element | Position | Content |
|---------|----------|---------|
| Image | Left | 40x40px thumbnail |
| Name | Top center | Product name |
| SKU | Bottom left | "SKU: XXXXX" |
| Stock | Bottom center | "Stock: XX units" |
| Price | Right | "LKR XX.XX" |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/SearchResultItem.tsx

// Imports
// SearchResultItem props
// SearchResultItem component
//   - Container with click handler
//   - Image section
//   - Info section (name, SKU, stock)
//   - Price section
//   - Hover styling
```

### Verification Checklist
- [ ] `SearchResultItem.tsx` created
- [ ] Layout structured correctly
- [ ] Product image displays
- [ ] Name and SKU shown
- [ ] Stock status displayed
- [ ] Price formatted
- [ ] Hover state works
- [ ] Click handler functional

---

## Task 22: Create Add from Search

### Overview
Implement the functionality to add products to the cart directly from search results, handling product variants and updating cart state.

### Dependencies
- Task 21: Create Search Result Item
- Group A, Task 12: POS Context Provider

### Instructions

1. **Create add from search function**
   - Implement in ProductSearch component
   - Use POS context cart actions
   - Handle in onSelect of SearchResultItem

2. **Check for product variants**
   - If product has variants: open variant modal
   - If no variants: add directly to cart
   - Pass product data to modal

3. **Add to cart logic**
   - Get cart state from context
   - Call addToCart action
   - Pass product ID, name, price
   - Default quantity: 1
   - Check for duplicates

4. **Handle duplicate items**
   - Check if product already in cart
   - If yes: increment quantity
   - If no: add new item
   - Show confirmation (optional)

5. **Update UI after add**
   - Clear search input
   - Close search results dropdown
   - Show brief success indication (optional)
   - Focus back to search input

6. **Show feedback**
   - Toast notification: "Added to cart"
   - Animate cart icon (optional)
   - Brief item highlight in cart
   - Sound effect (optional)

7. **Handle errors**
   - Out of stock: show warning
   - Product unavailable: show error
   - Cart full: show limit message
   - Log errors for debugging

### Add from Search Flow
```
Click Search Result
    │
    ▼
Check Product Variants
    │
    ├─── Has Variants ──────► Open Variant Modal
    │                              │
    │                              ▼
    │                         Select Variant
    │                              │
    └─── No Variants               │
              │                    │
              └────────┬───────────┘
                       │
                       ▼
              Check if in Cart
                       │
                ┌──────┴──────┐
                │             │
                ▼             ▼
         Already Exists   New Item
                │             │
                ▼             ▼
         Increment Qty   Add to Cart
                │             │
                └──────┬──────┘
                       │
                       ▼
            Clear Search & Close
                       │
                       ▼
            Show Success Feedback
```

### Cart Addition Scenarios

| Scenario | Action |
|----------|--------|
| Simple product | Add directly |
| Product with variants | Open variant modal |
| Already in cart | Increment quantity |
| Out of stock | Show warning, don't add |

### Expected Implementation
```typescript
// In ProductSearch component:
// handleAddFromSearch function
//   - Check variants
//   - Add to cart or open modal
//   - Update UI
//   - Show feedback
```

### Verification Checklist
- [ ] Add function implemented
- [ ] Variant check works
- [ ] Direct add functional
- [ ] Duplicate handling correct
- [ ] UI updates after add
- [ ] Success feedback shown
- [ ] Errors handled gracefully
- [ ] Search clears after add

---

## Task 23: Create Quick Buttons Container

### Overview
Create the container component for quick access buttons that displays frequently used or popular products in a grid layout for one-click adding to cart.

### Dependencies
- Group A, Task 10: Create Product Panel

### Instructions

1. **Create quick buttons container**
   - Create `QuickButtons.tsx` in ProductPanel directory
   - Section below search bar
   - Container for button grid and tabs

2. **Define container structure**
   - Category tabs at top (Task 26)
   - Button grid below tabs (Task 25)
   - Loading state during data fetch
   - Empty state if no quick products

3. **Add section header**
   - Title: "Quick Add" or "Popular Items"
   - Optional: "View All" link
   - Simple, clear typography
   - Fixed or scrolls with panel

4. **Implement product loading**
   - Fetch quick products on mount
   - Show loading skeleton or spinner
   - Store in state or context
   - Error handling for failed fetch

5. **Add category filter state**
   - Selected category state
   - "All" as default category
   - Filter products by category
   - Update grid on category change

6. **Handle empty state**
   - Display when no products available
   - Message: "No quick products configured"
   - Icon or illustration
   - Link to settings (optional)

7. **Configure container styling**
   - Full width of panel
   - Adequate padding
   - Background distinct from search
   - Scroll if needed (or panel scrolls)

### Quick Buttons Container Layout
```
┌─────────────────────────────────────┐
│ Quick Add                           │ ← Header
├─────────────────────────────────────┤
│ [All] [Food] [Drinks] [Snacks]     │ ← Category Tabs
├─────────────────────────────────────┤
│ ┌───┬───┬───┬───┐                  │
│ │ □ │ □ │ □ │ □ │                  │
│ ├───┼───┼───┼───┤                  │ ← Button Grid
│ │ □ │ □ │ □ │ □ │                  │
│ └───┴───┴───┴───┘                  │
└─────────────────────────────────────┘
```

### Container Sections

| Section | Component | Purpose |
|---------|-----------|---------|
| Header | Title | Identify section |
| Tabs | Category Tabs | Filter products |
| Grid | Quick Button Grid | Display products |
| Empty | Empty State | No products message |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/QuickButtons.tsx

// 'use client' directive
// Imports
// QuickButtons component
//   - Products state
//   - Category filter state
//   - Section header
//   - CategoryTabs
//   - QuickButtonGrid
//   - Empty/Loading states
```

### Verification Checklist
- [ ] `QuickButtons.tsx` created
- [ ] Container structure defined
- [ ] Section header present
- [ ] Category tabs placeholder
- [ ] Button grid placeholder
- [ ] Loading state implemented
- [ ] Empty state designed
- [ ] Styling applied

---

## Task 24: Create Quick Button Component

### Overview
Create the individual quick button component that represents a single product with image, name, and price, enabling one-click addition to the cart.

### Dependencies
- Task 23: Create Quick Buttons Container

### Instructions

1. **Create quick button component**
   - Create `QuickButton.tsx` in ProductPanel directory
   - Single product button
   - Accept product prop

2. **Define button structure**
   - Square or rectangular shape
   - Product image at top (50-60%)
   - Product name below
   - Price at bottom
   - Touch-friendly size (min 100x120px)

3. **Add product image section**
   - Image fills top portion
   - Maintain aspect ratio
   - Placeholder if no image
   - Background color for missing images

4. **Display product name**
   - Below image
   - Truncate if too long (1-2 lines)
   - Ellipsis for overflow
   - Center-aligned or left-aligned

5. **Show price**
   - At bottom of button
   - LKR currency format
   - Bold, prominent font
   - Center-aligned

6. **Add stock indicator**
   - Overlay or badge
   - Show out of stock state
   - Low stock warning (optional)
   - Green/yellow/red color coding

7. **Implement click handler**
   - Add product to cart on click
   - Check for variants (open modal if needed)
   - Show brief feedback
   - Disabled if out of stock

8. **Style button appropriately**
   - Border and shadow
   - Hover state
   - Active/pressed state
   - Disabled state (out of stock)

### Quick Button Layout
```
┌───────────────┐
│               │
│   [Product    │ ← Image (60%)
│    Image]     │
│               │
├───────────────┤
│ Product Name  │ ← Name (truncated)
├───────────────┤
│ LKR 100.00    │ ← Price
└───────────────┘
  100-120px width
```

### Button States

| State | Appearance | Interaction |
|-------|------------|-------------|
| Normal | Full color | Clickable |
| Hover | Highlighted | Pointer cursor |
| Active | Pressed | Visual feedback |
| Disabled | Grayed out | Not clickable |
| Out of Stock | Red overlay | Not clickable |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/QuickButton.tsx

// Imports
// QuickButton props
// QuickButton component
//   - Button container
//   - Image section
//   - Name section
//   - Price section
//   - Stock indicator
//   - Click handler
//   - State styling
```

### Verification Checklist
- [ ] `QuickButton.tsx` created
- [ ] Button structure defined
- [ ] Image section renders
- [ ] Name displays (truncated)
- [ ] Price formatted
- [ ] Stock indicator shown
- [ ] Click handler implemented
- [ ] States styled correctly
- [ ] Touch-friendly size

---

## Task 25: Create Quick Button Grid

### Overview
Create the responsive grid layout component that arranges quick buttons in columns, adapting to different screen sizes for optimal display.

### Dependencies
- Task 24: Create Quick Button Component

### Instructions

1. **Create grid component**
   - Create `QuickButtonGrid.tsx` in ProductPanel directory
   - Grid container for buttons
   - Accept products array prop

2. **Implement CSS Grid layout**
   - Use CSS Grid or Flexbox
   - Consistent gap between buttons
   - Equal-sized columns
   - Auto-fill or fixed columns

3. **Define responsive columns**
   - Large screens (>1200px): 6 columns
   - Medium screens (768-1200px): 4 columns
   - Small screens (<768px): 3 columns
   - Use media queries or Tailwind breakpoints

4. **Add grid styling**
   - Gap: 12-16px between items
   - Padding around grid
   - Justify items: center or stretch
   - Align items: start

5. **Map products to buttons**
   - Map over products array
   - Render QuickButton for each
   - Pass product data
   - Pass click handler

6. **Handle empty grid**
   - Show when no products
   - Empty state component
   - Message and icon
   - Center in grid area

7. **Add loading skeleton**
   - Show during data fetch
   - Placeholder buttons
   - Pulse animation
   - Maintain grid layout

### Grid Layout by Screen Size
```
Large (6 columns):
┌───┬───┬───┬───┬───┬───┐
│ □ │ □ │ □ │ □ │ □ │ □ │
├───┼───┼───┼───┼───┼───┤
│ □ │ □ │ □ │ □ │ □ │ □ │
└───┴───┴───┴───┴───┴───┘

Medium (4 columns):
┌───┬───┬───┬───┐
│ □ │ □ │ □ │ □ │
├───┼───┼───┼───┤
│ □ │ □ │ □ │ □ │
└───┴───┴───┴───┘

Small (3 columns):
┌───┬───┬───┐
│ □ │ □ │ □ │
├───┼───┼───┤
│ □ │ □ │ □ │
└───┴───┴───┘
```

### Responsive Configuration

| Screen Size | Columns | Gap | Button Size |
|-------------|---------|-----|-------------|
| > 1200px | 6 | 16px | 100px+ |
| 768-1200px | 4 | 12px | 100-120px |
| < 768px | 3 | 12px | 90-110px |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/QuickButtonGrid.tsx

// Imports
// QuickButtonGrid props
// QuickButtonGrid component
//   - Grid container
//   - Responsive classes
//   - Product mapping
//   - QuickButton rendering
//   - Empty/Loading states
```

### Verification Checklist
- [ ] `QuickButtonGrid.tsx` created
- [ ] Grid layout implemented
- [ ] Responsive columns work
- [ ] Gap and spacing correct
- [ ] Products map to buttons
- [ ] Empty state shows
- [ ] Loading skeleton displays
- [ ] Layout adapts to screen size

---

## Task 26: Create Category Tabs

### Overview
Create the category tabs component that allows filtering quick buttons by product category, displaying all available categories with an "All" option.

### Dependencies
- Task 23: Create Quick Buttons Container

### Instructions

1. **Create category tabs component**
   - Create `CategoryTabs.tsx` in ProductPanel directory
   - Horizontal tabs for categories
   - Above quick button grid

2. **Define tabs structure**
   - Horizontal scrollable container
   - Tab items in row
   - "All" tab always first
   - Category tabs follow

3. **Fetch categories**
   - Load from API or context
   - Extract unique categories from products
   - Sort alphabetically (after "All")
   - Handle loading state

4. **Add active tab state**
   - Track selected category
   - "All" selected by default
   - Update on tab click
   - Visual indicator for active

5. **Implement tab filtering**
   - Emit selected category to parent
   - Parent filters product list
   - Update grid display
   - Maintain selection on refresh

6. **Style tabs container**
   - Horizontal scroll if many tabs
   - Hide scrollbar or minimal styling
   - Touch-friendly tab size
   - Smooth scroll behavior

7. **Add tab styling**
   - Active: highlighted background
   - Inactive: subdued appearance
   - Hover: slight highlight
   - Transitions on state change

### Category Tabs Layout
```
┌───────────────────────────────────────────────┐
│ [ All ] [ Food ] [ Drinks ] [ Snacks ] ...    │
│   ↑                                           │
│   Active                                      │
└───────────────────────────────────────────────┘
                     ↓
         Scrollable if too many
```

### Tab States

| State | Appearance | Interaction |
|-------|------------|-------------|
| Active | Solid background | Selected category |
| Inactive | Transparent | Click to select |
| Hover | Light highlight | Pointer cursor |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/CategoryTabs.tsx

// Imports
// CategoryTabs props
// CategoryTabs component
//   - Tabs container
//   - Category state
//   - Tab items map
//   - Active tab handler
//   - Scrollable styling
```

### Verification Checklist
- [ ] `CategoryTabs.tsx` created
- [ ] Tabs container rendered
- [ ] "All" tab first
- [ ] Categories loaded
- [ ] Active state managed
- [ ] Click changes selection
- [ ] Parent receives updates
- [ ] Scrollable if needed
- [ ] Styling applied

---

## Task 27: Create Category Tab Item

### Overview
Create the individual category tab item component that represents a single category filter option with active/inactive states.

### Dependencies
- Task 26: Create Category Tabs

### Instructions

1. **Create tab item component**
   - Create `CategoryTab.tsx` in ProductPanel directory
   - Single tab button
   - Accept category and active props

2. **Define tab button**
   - Button element or styled div
   - Display category name
   - Click handler
   - Accessibility attributes

3. **Add active styling**
   - Accept isActive prop
   - Active: solid background, bold text
   - Inactive: transparent, normal text
   - Use conditional classes

4. **Implement click handler**
   - Call parent's onSelect function
   - Pass category value
   - Update active state in parent
   - Close dropdown if needed

5. **Add hover effect**
   - Slight background change
   - Cursor pointer
   - Smooth transition
   - Visual feedback

6. **Style appropriately**
   - Padding: 8-12px horizontal, 6-8px vertical
   - Border radius: 4-6px
   - Font: medium weight
   - Touch-friendly (min 44px height)

7. **Add accessibility**
   - Role: tab or button
   - Aria-selected for active
   - Keyboard navigation (handled by parent)
   - Focus indicator

### Tab Item States
```
Inactive:  [ Food ]       ← Light background
Active:    [ Food ]       ← Solid background, bold
Hover:     [ Food ]       ← Highlighted
```

### Tab Item Styling

| State | Background | Text | Border |
|-------|------------|------|--------|
| Active | Primary color | White/Bold | None |
| Inactive | Transparent | Gray | Optional |
| Hover | Light gray | Dark | None |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/CategoryTab.tsx

// Imports
// CategoryTab props
// CategoryTab component
//   - Button element
//   - Conditional styling
//   - Click handler
//   - Accessibility attributes
```

### Verification Checklist
- [ ] `CategoryTab.tsx` created
- [ ] Button renders
- [ ] Category name displays
- [ ] Active state styles correctly
- [ ] Inactive state distinct
- [ ] Hover effect works
- [ ] Click handler functional
- [ ] Accessibility attributes present
- [ ] Touch-friendly size

---

## Task 28: Create Quick Button Action

### Overview
Implement the action handler for quick button clicks that adds products to the cart, handling variants, stock validation, and UI updates.

### Dependencies
- Task 25: Create Quick Button Grid
- Group A, Task 12: POS Context Provider

### Instructions

1. **Create quick add function**
   - Implement in QuickButtons component
   - Use POS context cart actions
   - Handle in QuickButton onClick

2. **Validate stock availability**
   - Check product stock quantity
   - Block add if out of stock
   - Show warning for low stock
   - Allow add if in stock

3. **Check for variants**
   - If product has variants: open variant modal (Task 33)
   - If no variants: add directly
   - Pass product data to modal
   - Wait for variant selection

4. **Add to cart**
   - Get cart from context
   - Call addToCart action
   - Pass product ID, name, price, quantity (1)
   - Check for duplicates (increment if exists)

5. **Show visual feedback**
   - Brief button press animation
   - Toast notification (optional)
   - Cart badge update
   - Sound effect (optional)

6. **Handle errors**
   - Out of stock: show toast warning
   - Product unavailable: log error
   - Cart full: show limit message
   - Network error: show retry option

7. **Update UI state**
   - Disable button briefly during add
   - Show loading indicator (optional)
   - Re-enable after success
   - Maintain button state

### Quick Add Flow
```
Click Quick Button
    │
    ▼
Validate Stock
    │
    ├─── Out of Stock ──► Show Warning → Block
    │
    └─── In Stock
            │
            ▼
    Check Variants
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
  Has Variants  No Variants
      │           │
      │           ▼
      │      Add to Cart
      │           │
      ▼           │
  Open Modal      │
      │           │
      ▼           │
  Select Variant  │
      │           │
      └─────┬─────┘
            │
            ▼
    Show Feedback
```

### Stock Validation

| Stock Status | Action | Feedback |
|--------------|--------|----------|
| In Stock | Add to cart | Success toast |
| Low Stock | Add with warning | Warning toast |
| Out of Stock | Block add | Error toast |

### Expected Implementation
```typescript
// In QuickButtons component:
// handleQuickAdd function
//   - Validate stock
//   - Check variants
//   - Add to cart
//   - Show feedback
//   - Handle errors
```

### Verification Checklist
- [ ] Quick add function implemented
- [ ] Stock validation works
- [ ] Variant check functional
- [ ] Direct add works
- [ ] Duplicate handling correct
- [ ] Visual feedback shown
- [ ] Errors handled
- [ ] UI state updated
- [ ] Button disabled during add

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Create Product Search Bar | Search container with debounce |
| 18 | Create Search Input Component | Input with icons and auto-focus |
| 19 | Create Barcode Scanner Handler | Rapid keystroke detection |
| 20 | Create Search Results Dropdown | Results with keyboard nav |
| 21 | Create Search Result Item | Product result display |
| 22 | Create Add from Search | Search to cart functionality |
| 23 | Create Quick Buttons Container | Quick buttons section |
| 24 | Create Quick Button Component | Single product button |
| 25 | Create Quick Button Grid | Responsive grid layout |
| 26 | Create Category Tabs | Category filter tabs |
| 27 | Create Category Tab Item | Single tab component |
| 28 | Create Quick Button Action | Add from quick button |

### Current Progress
```
frontend/components/modules/pos/ProductPanel/
├── ProductPanel.tsx                 # Group A
├── ProductSearch.tsx                # Task 17 ✓
├── SearchInput.tsx                  # Task 18 ✓
├── SearchResults.tsx                # Task 20 ✓
├── SearchResultItem.tsx             # Task 21 ✓
├── QuickButtons.tsx                 # Task 23 ✓
├── QuickButton.tsx                  # Task 24 ✓
├── QuickButtonGrid.tsx              # Task 25 ✓
├── CategoryTabs.tsx                 # Task 26 ✓
└── CategoryTab.tsx                  # Task 27 ✓

frontend/components/modules/pos/hooks/
├── useBarcodeScanner.ts             # Task 19 ✓
└── useKeyboardShortcuts.ts          # Group A
```

### Product Selection Features Status
✓ **Completed Components:**
- Search bar with debounce and barcode scanning
- Search results with keyboard navigation
- Add from search with variant support
- Quick buttons with category filtering
- Responsive grid layout
- Stock validation

⏳ **Pending (Next Document):**
- Product image display (Task 29)
- Out of stock indicator (Task 30)
- Price display in button (Task 31)
- Load quick products from API (Task 32)
- Variant selection modal (Task 33)
- Connect search to API (Task 34)

### Next Steps
Proceed to [02_Tasks-29-34_Display-Modal-API.md](02_Tasks-29-34_Display-Modal-API.md) to complete display elements, variant modal, and API integration.

---

## Notes for AI Agents

1. **Search Debounce:** Use 300ms debounce to prevent excessive API calls during typing
2. **Barcode Detection:** Scanner types at < 50ms between keys, humans at > 100ms
3. **Keyboard Navigation:** Arrow keys for result navigation, Enter to select, Escape to close
4. **Variant Handling:** Always check for variants before adding to cart, open modal if present
5. **Stock Validation:** Prevent adding out-of-stock items, warn on low stock
6. **Responsive Grid:** Adapt column count based on screen size (3-6 columns)
7. **Visual Feedback:** Provide immediate feedback on all user actions (toasts, animations)
8. **Next Document:** Focus on display refinements and backend integration
