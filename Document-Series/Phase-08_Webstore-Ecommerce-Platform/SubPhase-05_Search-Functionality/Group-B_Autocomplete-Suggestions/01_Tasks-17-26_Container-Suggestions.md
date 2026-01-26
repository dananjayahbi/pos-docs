# Tasks 17-26: Autocomplete Container & Suggestions

**Document Version:** 1.0  
**Last Updated:** 2026-01-26  
**Phase:** 08 - Webstore E-commerce Platform  
**SubPhase:** 05 - Search Functionality  
**Group:** B - Autocomplete Suggestions  
**Tasks Covered:** 17-26

---

## Navigation

- **Parent:** [00_GROUP_OVERVIEW.md](../00_GROUP_OVERVIEW.md)
- **Previous:** [Group A - Search Input & State](../Group-A_Search-Input-State/02_Tasks-09-16_Validation-Submit-Clear.md)
- **Next:** [02_Tasks-27-34_Keyboard-API-Verify.md](./02_Tasks-27-34_Keyboard-API-Verify.md)
- **Related:**
  - [SubPhase Overview](../00_SUBPHASE_OVERVIEW.md)
  - [Phase 08 Overview](../../00_PHASE_OVERVIEW.md)

---

## Document Overview

This document covers the implementation of the autocomplete dropdown container and suggestion rendering system. The autocomplete component displays below the search input, showing product and category suggestions based on user input. It provides real-time feedback with highlighted matching text and organized suggestion sections.

### Tasks Covered

| Task | Title | Type | Dependencies | Estimated Effort |
|------|-------|------|--------------|------------------|
| 17 | Create Autocomplete Container | Component | Task 01 | 2 hours |
| 18 | Create Autocomplete Position | Styling | Task 17 | 1.5 hours |
| 19 | Create Autocomplete Visibility | Logic | Task 17, 18 | 2 hours |
| 20 | Create Product Suggestions Section | Component | Task 17 | 2 hours |
| 21 | Create Product Suggestion Item | Component | Task 20 | 2.5 hours |
| 22 | Create Product Suggestion Image | Component | Task 21 | 1.5 hours |
| 23 | Create Product Suggestion Info | Component | Task 21 | 2 hours |
| 24 | Create Category Suggestions Section | Component | Task 17 | 2 hours |
| 25 | Create Category Suggestion Item | Component | Task 24 | 2 hours |
| 26 | Create Highlighted Match | Component | Task 21, 25 | 2.5 hours |

**Total Estimated Effort:** 20 hours

### Key Features Implemented

1. **Autocomplete Container**
   - Dropdown positioning system
   - Visibility control logic
   - Z-index management
   - Click-outside detection

2. **Product Suggestions**
   - Product listing section
   - Individual product items
   - Product images with placeholders
   - Product information display
   - Price formatting

3. **Category Suggestions**
   - Category listing section
   - Category items with icons
   - Product count display
   - Category navigation links

4. **Text Highlighting**
   - Match highlighting component
   - Case-insensitive matching
   - Multiple match support
   - Styled matched text

### Autocomplete Structure Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Search Input Field                    │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              Autocomplete Container                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Product Suggestions Section               │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  [Img] Product Name          $99.99        │  │  │
│  │  │  40x40  (highlighted match)                │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  [Img] Another Product       $149.99       │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  [Img] Third Product         $79.99        │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Category Suggestions Section              │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  [Icon] Category Name            (25)      │  │  │
│  │  │         (highlighted match)                │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  [Icon] Another Category         (12)      │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
SearchAutocomplete
├── AutocompleteContainer (Task 17)
│   ├── Position Logic (Task 18)
│   ├── Visibility Logic (Task 19)
│   │
│   ├── ProductSuggestionsSection (Task 20)
│   │   ├── ProductSuggestionItem (Task 21)
│   │   │   ├── ProductImage (Task 22)
│   │   │   └── ProductInfo (Task 23)
│   │   │       ├── ProductName + HighlightedMatch (Task 26)
│   │   │       └── ProductPrice
│   │   │
│   │   └── [Repeat for each product]
│   │
│   └── CategorySuggestionsSection (Task 24)
│       └── CategorySuggestionItem (Task 25)
│           ├── CategoryIcon
│           └── CategoryName + HighlightedMatch (Task 26)
│           └── ProductCount
```

---

## Task 17: Create Autocomplete Container

### Overview

Create the main container component that wraps all autocomplete suggestions. This component manages the dropdown structure, handles click-outside events, and coordinates the display of product and category suggestions.

**Purpose:** Provide foundational structure for the autocomplete dropdown system.

**Scope:** Container component with basic structure and event handling.

### Dependencies

- **Required Completion:**
  - Task 01: Create Search Input Component

- **Component Imports:**
  - React hooks (useState, useEffect, useRef)
  - ProductSuggestionsSection component (Task 20)
  - CategorySuggestionsSection component (Task 24)

- **Integration Points:**
  - Search state from store
  - Suggestion data from API
  - Parent search component

### Instructions

#### 1. Create Container Component File

**Objective:** Set up the autocomplete container component.

**Steps:**
1. Create new component file in search components directory
2. Name the file appropriately for autocomplete container
3. Set up component structure with TypeScript interface
4. Import required React hooks and dependencies
5. Export component as default

**Configuration:**
- Component should accept suggestions data as props
- Include visibility control prop
- Include onClose callback prop
- Include search query for highlighting

#### 2. Define Component Props Interface

**Objective:** Create TypeScript interface for component props.

**Props to Include:**
1. **isVisible** - Boolean to control dropdown visibility
2. **productSuggestions** - Array of product suggestion objects
3. **categorySuggestions** - Array of category suggestion objects
4. **searchQuery** - Current search query string
5. **onClose** - Callback function to close dropdown
6. **onProductSelect** - Callback when product is selected
7. **onCategorySelect** - Callback when category is selected
8. **loading** - Boolean for loading state
9. **error** - Error message string (optional)

**Type Definitions:**
- Define ProductSuggestion interface with id, name, price, image, slug
- Define CategorySuggestion interface with id, name, slug, icon, productCount
- All callbacks should have proper function signatures

#### 3. Set Up Component State

**Objective:** Initialize necessary component state.

**State Variables:**
1. Create ref for container element (click-outside detection)
2. No internal state needed (controlled by parent)

**Notes:**
- Component should be fully controlled by parent
- State management handled in search store
- Local refs only for DOM interactions

#### 4. Implement Click-Outside Detection

**Objective:** Close dropdown when user clicks outside.

**Steps:**
1. Create ref for container div element
2. Set up useEffect for document click listener
3. Check if click target is outside container
4. Call onClose callback when clicking outside
5. Clean up event listener on unmount

**Behavior:**
- Only add listener when dropdown is visible
- Ignore clicks inside the container
- Properly remove listener on cleanup
- Handle edge cases (null refs, unmounted components)

#### 5. Create Base Container Structure

**Objective:** Build the HTML structure for the container.

**Structure:**
1. Outer div with ref and conditional rendering
2. Inner wrapper div for content
3. Loading state display area
4. Error state display area
5. Suggestions content area
6. Empty state display area

**Conditional Rendering:**
- Show loading indicator when loading is true
- Show error message when error exists
- Show empty state when no suggestions and not loading
- Show suggestions sections when data is available

#### 6. Render Product Suggestions Section

**Objective:** Include product suggestions when available.

**Steps:**
1. Check if productSuggestions array has items
2. Render ProductSuggestionsSection component
3. Pass product suggestions array as prop
4. Pass search query for highlighting
5. Pass onProductSelect callback
6. Handle section title/header

**Conditional Display:**
- Only show section when products exist
- Display "Products" header above section
- Show product count in header (optional)

#### 7. Render Category Suggestions Section

**Objective:** Include category suggestions when available.

**Steps:**
1. Check if categorySuggestions array has items
2. Render CategorySuggestionsSection component
3. Pass category suggestions array as prop
4. Pass search query for highlighting
5. Pass onCategorySelect callback
6. Handle section title/header

**Conditional Display:**
- Only show section when categories exist
- Display "Categories" header above section
- Show category count in header (optional)
- Separate from products with divider/spacing

#### 8. Add Loading State Display

**Objective:** Show loading indicator while fetching suggestions.

**Steps:**
1. Create loading indicator component or element
2. Show when loading prop is true
3. Display spinner or skeleton loaders
4. Include loading text message
5. Center content appropriately

**Design:**
- Use consistent loading indicator from design system
- Show "Searching..." or similar message
- Maintain container size to prevent layout shift
- Consider skeleton screens for better UX

#### 9. Add Error State Display

**Objective:** Show error message when API fails.

**Steps:**
1. Create error display element
2. Show when error prop has value
3. Display error message text
4. Include error icon
5. Style appropriately with error colors

**Error Handling:**
- Show user-friendly error message
- Include retry option if applicable
- Don't expose technical error details
- Match design system error styling

#### 10. Add Empty State Display

**Objective:** Show message when no suggestions found.

**Steps:**
1. Create empty state element
2. Show when no suggestions and not loading
3. Display helpful message
4. Include suggestion icon or illustration
5. Style appropriately

**Empty State Scenarios:**
- No results for search query
- Search query too short
- Initial state before searching
- Customize message based on scenario

#### 11. Add Accessibility Attributes

**Objective:** Make container accessible to screen readers.

**ARIA Attributes:**
1. Add role="listbox" to container
2. Add aria-label describing purpose
3. Add aria-live for dynamic updates
4. Add aria-busy during loading
5. Add aria-expanded based on visibility

**Keyboard Support:**
- Container should support keyboard navigation (handled in later tasks)
- Ensure proper focus management
- Support Escape key to close

#### 12. Apply Base Styling Classes

**Objective:** Add CSS classes for styling.

**Classes to Add:**
1. Main container class (autocomplete-container)
2. Conditional visible class
3. Loading state class
4. Error state class
5. Empty state class

**Styling Notes:**
- Detailed styling handled in Task 18
- Apply structural classes only
- Use consistent naming convention
- Ensure classes are specific enough

### Expected Outcome

**Component Behavior:**
- Container renders conditionally based on isVisible prop
- Click-outside detection closes dropdown
- Loading state displays during API calls
- Error state shows when API fails
- Empty state shows when no suggestions
- Product and category sections render when data available
- Proper accessibility attributes applied
- Component fully controlled by parent

**Integration:**
- Container integrates with search input component
- Receives suggestion data from parent
- Callbacks properly trigger parent actions
- Visibility controlled by parent state

### Verification Steps

**Functionality Checks:**
1. Container renders when isVisible is true
2. Container hidden when isVisible is false
3. Click outside closes container (onClose called)
4. Click inside does not close container
5. Loading state displays correctly
6. Error state displays correctly
7. Empty state displays correctly
8. Product section renders with data
9. Category section renders with data
10. Both sections can display simultaneously

**Accessibility Checks:**
1. Verify ARIA attributes are present
2. Check role="listbox" on container
3. Verify aria-live updates work
4. Test with screen reader
5. Verify keyboard support (basic)

**Integration Checks:**
1. Component receives props correctly
2. Callbacks trigger as expected
3. Data flows from parent properly
4. Re-renders on prop changes

**Console Verification:**
- No console errors or warnings
- Props validation passes
- Event handlers properly attached
- Cleanup functions execute on unmount

---

## Task 18: Create Autocomplete Position

### Overview

Implement positioning logic and styles for the autocomplete container. The dropdown should appear directly below the search input, span the full width of the input, and maintain proper z-index layering to appear above other content.

**Purpose:** Ensure autocomplete dropdown is positioned correctly relative to search input.

**Scope:** Positioning styles, z-index management, and responsive behavior.

### Dependencies

- **Required Completion:**
  - Task 17: Create Autocomplete Container

- **External Dependencies:**
  - CSS/styling system
  - Search input component dimensions

### Instructions

#### 1. Create Position Styling File

**Objective:** Set up dedicated stylesheet for positioning.

**Steps:**
1. Create CSS/SCSS file for autocomplete positioning
2. Import into autocomplete container component
3. Set up base positioning variables
4. Define responsive breakpoints
5. Document positioning approach

**Styling Approach:**
- Use CSS custom properties for flexibility
- Support responsive positioning
- Maintain consistent spacing

#### 2. Define Position Strategy

**Objective:** Determine how container positions relative to input.

**Strategy Options:**
1. **Absolute Positioning** - Position relative to parent
2. **Portal Rendering** - Render at document root
3. **Fixed Positioning** - Fix to viewport

**Recommended Approach:**
- Use absolute positioning within search component wrapper
- Position relative to search input parent
- Ensure parent has position: relative
- Calculate top offset from input height

**Considerations:**
- Avoid overlapping with input
- Account for input borders/padding
- Handle scrolling scenarios
- Support responsive layouts

#### 3. Set Container Width

**Objective:** Match autocomplete width to search input width.

**Steps:**
1. Set width to 100% of parent
2. Ensure parent wrapper matches input width
3. Add max-width constraint if needed
4. Handle responsive width changes
5. Test on various screen sizes

**Width Specifications:**
- Default: 100% of search input width
- Minimum width: Match input minimum
- Maximum width: Match input maximum or viewport constraint
- Responsive behavior: Adjust with input

#### 4. Set Vertical Position

**Objective:** Position dropdown below search input.

**Steps:**
1. Position absolute relative to parent
2. Calculate top offset (input height + gap)
3. Set left to 0 (align with input left edge)
4. Add small gap between input and dropdown (4-8px)
5. Ensure dropdown doesn't overlap input

**Vertical Positioning:**
- Top: 100% + gap value
- Gap: 4-8px recommended
- Account for input border
- Consider input focus styles

#### 5. Configure Z-Index Layering

**Objective:** Ensure dropdown appears above other content.

**Steps:**
1. Define z-index value for autocomplete
2. Ensure higher than typical content
3. Lower than modals/dialogs
4. Consider existing z-index hierarchy
5. Document z-index usage

**Z-Index Recommendations:**
- Autocomplete dropdown: z-index 1000
- Below modals: < 9000
- Above standard content: > 1
- Coordinate with design system z-index scale

#### 6. Add Shadow/Border Styling

**Objective:** Visually separate dropdown from background.

**Steps:**
1. Add box-shadow for depth
2. Add border for definition
3. Match design system shadow values
4. Ensure shadow doesn't interfere with position
5. Add border-radius if applicable

**Shadow Specifications:**
- Use subtle shadow for depth
- Example: box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
- Match existing dropdown shadows
- Consider dark mode adjustments

#### 7. Handle Overflow Behavior

**Objective:** Manage dropdown overflow scenarios.

**Steps:**
1. Set max-height for dropdown
2. Enable vertical scrolling if needed
3. Ensure horizontal overflow hidden
4. Handle long suggestion lists
5. Add scroll indicators if needed

**Overflow Configuration:**
- Max-height: 400-500px recommended
- Overflow-y: auto
- Overflow-x: hidden
- Smooth scrolling behavior
- Scrollbar styling (optional)

#### 8. Add Background and Borders

**Objective:** Style container background and edges.

**Steps:**
1. Set background color (typically white)
2. Add border with appropriate color
3. Add border-radius for rounded corners
4. Ensure contrast with page background
5. Support dark mode theming

**Background Styling:**
- Background: White or light gray
- Border: 1px solid light gray
- Border-radius: 4-8px
- Dark mode: Dark background, lighter border

#### 9. Implement Responsive Positioning

**Objective:** Adjust positioning for mobile devices.

**Steps:**
1. Define mobile breakpoints
2. Adjust width for small screens
3. Consider full-width on mobile
4. Handle viewport constraints
5. Test on mobile devices

**Mobile Adjustments:**
- Full width on screens < 640px
- Reduce max-height on small screens
- Consider fixed positioning on mobile
- Handle virtual keyboard appearance

#### 10. Add Position Transition

**Objective:** Smooth appearance/disappearance of dropdown.

**Steps:**
1. Add transition for opacity
2. Add transition for transform
3. Set appropriate duration (150-250ms)
4. Use easing function
5. Ensure performant animations

**Transition Properties:**
- Opacity: 0 to 1
- Transform: translateY(-8px) to translateY(0)
- Duration: 200ms
- Easing: ease-out
- Performance: Use transform over top/left

#### 11. Handle Parent Container Context

**Objective:** Ensure proper positioning within parent layout.

**Steps:**
1. Verify search component wrapper has position: relative
2. Ensure no conflicting positioning contexts
3. Handle flexbox/grid layouts
4. Test in various page layouts
5. Document parent requirements

**Parent Requirements:**
- Search wrapper: position: relative
- No overflow: hidden ancestors
- Appropriate stacking context
- Clear positioning hierarchy

#### 12. Test Edge Cases

**Objective:** Verify positioning in unusual scenarios.

**Scenarios to Test:**
1. Near bottom of viewport (dropdown extends beyond viewport)
2. Scrolled page position
3. Inside scrollable containers
4. Zoomed browser view
5. Different screen sizes/resolutions
6. With browser extensions/toolbars

**Edge Case Handling:**
- Consider flip positioning (above input) if insufficient space below
- Handle viewport boundaries
- Adjust for unusual layouts
- Ensure consistent behavior

### Expected Outcome

**Positioning Behavior:**
- Dropdown appears directly below search input
- Full width matching input width
- Consistent gap between input and dropdown
- Proper z-index layering above content
- Smooth transition when appearing
- Responsive across screen sizes
- No overlap with input or other elements

**Visual Quality:**
- Clear separation from page content
- Proper shadow/border styling
- Smooth animations
- Professional appearance
- Consistent with design system

### Verification Steps

**Visual Checks:**
1. Dropdown positioned directly below input
2. Width matches input width exactly
3. Consistent gap (4-8px) between input and dropdown
4. Shadow visible and appropriate
5. Border and border-radius applied
6. Smooth appearance transition

**Responsive Checks:**
1. Test on desktop (>1024px)
2. Test on tablet (768-1024px)
3. Test on mobile (<768px)
4. Verify full width on mobile
5. Check max-height adjustments

**Layout Checks:**
1. Works in centered layout
2. Works in full-width layout
3. Works in sidebar layout
4. No horizontal scroll caused
5. No overlap with adjacent elements

**Z-Index Checks:**
1. Appears above page content
2. Below modals/dialogs
3. No conflicts with navigation
4. Proper stacking in complex layouts

**Edge Case Checks:**
1. Near bottom of viewport
2. Inside scrollable container
3. With browser zoom at 125%, 150%
4. On small screen (320px width)
5. With long suggestion lists

---

## Task 19: Create Autocomplete Visibility

### Overview

Implement the visibility control logic for the autocomplete dropdown. The dropdown should appear when the user types in the search input, hide when clicking outside, and handle various show/hide scenarios based on user interaction and search state.

**Purpose:** Control when autocomplete dropdown is visible to users.

**Scope:** Visibility logic, show/hide conditions, and state management.

### Dependencies

- **Required Completion:**
  - Task 17: Create Autocomplete Container
  - Task 18: Create Autocomplete Position

- **State Dependencies:**
  - Search input focus state
  - Search query value
  - Suggestions availability

### Instructions

#### 1. Define Visibility Conditions

**Objective:** Establish when dropdown should show or hide.

**Show Conditions (ALL must be true):**
1. Search input has focus
2. Search query length meets minimum (e.g., 2+ characters)
3. Suggestions data exists OR loading state is true
4. User hasn't explicitly dismissed dropdown

**Hide Conditions (ANY can trigger):**
1. Search input loses focus (with delay)
2. User clicks outside dropdown
3. User presses Escape key
4. User selects a suggestion
5. User clears search input
6. User explicitly dismisses dropdown

**Notes:**
- Document these conditions clearly
- Consider edge cases
- Plan for delayed actions (focus loss)

#### 2. Add Visibility State to Store

**Objective:** Manage visibility in search state store.

**State to Add:**
1. **isDropdownVisible** - Boolean for visibility
2. **dropdownDismissed** - Boolean tracking explicit dismissal
3. Actions to update visibility state

**State Management:**
- Add to existing search store
- Include in TypeScript types
- Initialize to false
- Persist dismissal state temporarily

#### 3. Create Show Dropdown Logic

**Objective:** Implement logic to display dropdown.

**Steps:**
1. Create action/function to show dropdown
2. Check all show conditions
3. Set isDropdownVisible to true
4. Reset dropdownDismissed flag
5. Trigger any necessary side effects

**Show Triggers:**
- User types in search input (query length sufficient)
- Input receives focus (with existing valid query)
- Suggestions data loads successfully
- User re-focuses after dismissing

**Implementation Notes:**
- Validate conditions before showing
- Debounce if needed to prevent flickering
- Log visibility changes for debugging

#### 4. Create Hide Dropdown Logic

**Objective:** Implement logic to hide dropdown.

**Steps:**
1. Create action/function to hide dropdown
2. Set isDropdownVisible to false
3. Track reason for hiding (for analytics/debugging)
4. Handle cleanup if needed

**Hide Triggers:**
- Click outside handler triggers
- Escape key pressed
- Suggestion selected
- Input blur event
- Search cleared

**Implementation Notes:**
- Always safe to call (idempotent)
- Consider preserving some state
- Smooth transition out

#### 5. Implement Focus-Based Visibility

**Objective:** Show/hide based on input focus.

**Steps:**
1. Listen to input focus events
2. Show dropdown on focus (if conditions met)
3. Listen to input blur events
4. Hide dropdown on blur (with delay)
5. Cancel hide if refocusing within dropdown

**Focus Handling:**
- **onFocus**: Check if query is valid, show dropdown
- **onBlur**: Set timeout to hide (200-300ms delay)
- **Why delay**: Allow clicking dropdown items
- **Cancel delay**: If dropdown receives focus/interaction

**Edge Cases:**
- Rapid focus/blur cycles
- Focus moving between input and dropdown
- Tab key navigation

#### 6. Implement Query-Length-Based Visibility

**Objective:** Control visibility based on query length.

**Steps:**
1. Define minimum query length (2-3 characters recommended)
2. Show dropdown when query reaches minimum
3. Hide dropdown when query falls below minimum
4. Handle edge cases (empty query, single character)

**Query Rules:**
- Minimum length: 2 characters (configurable)
- Don't show for empty query
- Don't show for single character (too broad)
- Show immediately when threshold met

**Implementation:**
- Check query length in show condition
- Update on every query change
- Consider different minimums for different contexts

#### 7. Handle Explicit Dismissal

**Objective:** Allow user to dismiss dropdown intentionally.

**Steps:**
1. Track dismissal state (dropdownDismissed)
2. Set dismissal flag when Escape pressed
3. Set dismissal flag on explicit close action
4. Reset dismissal flag on new search
5. Respect dismissal until user indicates new intent

**Dismissal Behavior:**
- Escape key: Dismiss and blur input
- Close button: Dismiss but keep focus
- New typing: Reset dismissal (user trying again)
- Selection: Dismiss naturally

#### 8. Implement Click-Outside Integration

**Objective:** Hide dropdown when clicking outside.

**Steps:**
1. Use click-outside handler from Task 17
2. Call hide dropdown action
3. Set appropriate dismissal state
4. Handle edge cases (clicking input itself)

**Click-Outside Logic:**
- Detect clicks outside both input and dropdown
- Don't trigger on clicks within dropdown
- Don't trigger on clicks on input
- Use proper event bubbling/capturing

#### 9. Add Keyboard Dismissal

**Objective:** Support Escape key to close dropdown.

**Steps:**
1. Add keyboard event listener
2. Check for Escape key press
3. Hide dropdown and blur input
4. Set dismissal flag
5. Prevent default behavior if needed

**Keyboard Handling:**
- Listen on document or input
- Only handle when dropdown visible
- Escape: Close and blur
- Consider other keys (handled in later tasks)

#### 10. Handle Selection-Based Hiding

**Objective:** Hide dropdown when user selects item.

**Steps:**
1. Hide dropdown on product selection
2. Hide dropdown on category selection
3. Consider navigation happening
4. Clear input or keep query based on design
5. Blur input if navigating away

**Selection Behavior:**
- Product selected: Hide and navigate
- Category selected: Hide and navigate
- Option: Keep input focused for refinement
- Option: Clear input after selection

#### 11. Integrate with Loading State

**Objective:** Control visibility during loading.

**Steps:**
1. Keep dropdown visible during loading
2. Show loading indicator
3. Don't hide on query change while loading
4. Handle loading errors
5. Show dropdown when results arrive

**Loading Integration:**
- Loading state: Keep visible (show spinner)
- Results arrive: Keep visible (show results)
- Error occurs: Consider keeping visible (show error)
- Empty results: Keep visible (show empty state)

#### 12. Add Visibility Debugging

**Objective:** Make visibility state easy to debug.

**Steps:**
1. Log visibility changes (dev mode)
2. Log conditions that triggered change
3. Add data attributes to DOM for testing
4. Create debugging utility
5. Document visibility state machine

**Debugging Tools:**
- Console logs for state changes
- Data attribute: data-dropdown-visible="true/false"
- Redux DevTools showing visibility actions
- Clear documentation of state flow

### Expected Outcome

**Visibility Behavior:**
- Dropdown shows when user types 2+ characters
- Dropdown shows when input focused (if query valid)
- Dropdown hides when clicking outside
- Dropdown hides on Escape key
- Dropdown hides on blur (with delay)
- Dropdown hides on selection
- Dropdown respects explicit dismissal
- Loading state keeps dropdown visible
- Smooth transitions on show/hide

**User Experience:**
- Intuitive show/hide behavior
- No unexpected appearances/disappearances
- Smooth transitions
- Keyboard support
- Clear dismissal actions

### Verification Steps

**Show Conditions:**
1. Type 1 character - dropdown stays hidden
2. Type 2+ characters - dropdown appears
3. Focus with existing valid query - dropdown appears
4. Loading state - dropdown appears with spinner
5. Results arrive - dropdown shows suggestions

**Hide Conditions:**
1. Click outside - dropdown hides
2. Press Escape - dropdown hides
3. Blur input - dropdown hides (after delay)
4. Select product - dropdown hides
5. Select category - dropdown hides
6. Clear input - dropdown hides

**Edge Cases:**
1. Rapid typing - no flickering
2. Quick focus/blur - proper handling
3. Click dropdown during blur delay - stays visible
4. Escape while loading - hides immediately
5. Tab away - hides appropriately

**State Verification:**
1. Check isDropdownVisible in dev tools
2. Verify state updates on each trigger
3. Confirm dismissal flag works
4. Test state persistence/reset
5. Verify no memory leaks

**Integration Checks:**
1. Works with search input component
2. Integrates with store properly
3. Callbacks trigger correctly
4. No conflicting event handlers

---

## Task 20: Create Product Suggestions Section

### Overview

Create a component to display the product suggestions section within the autocomplete dropdown. This section shows a list of product items matching the search query, with a header and organized layout.

**Purpose:** Organize and display product search results in autocomplete.

**Scope:** Section container, header, list structure, and empty state handling.

### Dependencies

- **Required Completion:**
  - Task 17: Create Autocomplete Container

- **Child Components:**
  - Task 21: Product Suggestion Item (will be used)

### Instructions

#### 1. Create Product Section Component

**Objective:** Set up the product suggestions section component.

**Steps:**
1. Create component file in search components directory
2. Name appropriately for product suggestions section
3. Set up TypeScript interface for props
4. Import required dependencies
5. Export component

**Component Structure:**
- Functional component with TypeScript
- Accepts product array and callbacks
- Renders section header and list
- Handles empty state

#### 2. Define Component Props

**Objective:** Create TypeScript interface for props.

**Props to Include:**
1. **products** - Array of product suggestion objects
2. **searchQuery** - Current search query for highlighting
3. **onProductSelect** - Callback when product clicked
4. **loading** - Optional loading state boolean
5. **maxItems** - Optional max number of items to display

**Product Object Shape:**
- id: string or number
- name: string
- price: number
- image: string (URL)
- slug: string
- currency: string (optional)

#### 3. Implement Section Header

**Objective:** Create header showing "Products" title.

**Steps:**
1. Create header element above product list
2. Display "Products" text or translated equivalent
3. Optionally show count of products
4. Apply appropriate styling classes
5. Add semantic HTML element (h3 or similar)

**Header Variations:**
- Simple: "Products"
- With count: "Products (5)"
- With icon: Icon + "Products"
- Localization support

#### 4. Create Product List Structure

**Objective:** Build container for product items.

**Steps:**
1. Create list container element (ul or div)
2. Set appropriate role for accessibility
3. Map over products array
4. Render product item for each product
5. Add unique key for each item

**List Structure:**
- Use semantic list elements (ul/li)
- Add role="listbox" if not using ul
- Provide keys for React rendering
- Structure for easy styling

#### 5. Integrate Product Item Component

**Objective:** Render individual product items.

**Steps:**
1. Import ProductSuggestionItem component (Task 21)
2. Render for each product in array
3. Pass product data as props
4. Pass searchQuery for highlighting
5. Pass onProductSelect callback
6. Include unique key prop

**Integration:**
- Product item handles its own display
- Pass necessary data and callbacks
- Handle clicks at item level
- Section manages list only

#### 6. Implement Item Limit

**Objective:** Limit number of displayed products.

**Steps:**
1. Accept maxItems prop (default 5-8)
2. Slice products array to limit
3. Optionally show "View all results" link
4. Handle when more results available
5. Consider pagination or "load more"

**Limit Behavior:**
- Default limit: 5-8 products
- Show first N products
- Indicate if more exist
- Provide way to see all (link to search results page)

#### 7. Add Empty State

**Objective:** Handle case when no products match.

**Steps:**
1. Check if products array is empty
2. Render empty state message
3. Display helpful text
4. Include icon or illustration
5. Style appropriately

**Empty State Scenarios:**
- No products for query
- All suggestions are categories
- Error state
- Initial state

**Empty Message:**
- "No products found"
- "Try different keywords"
- Friendly and helpful tone

#### 8. Add Loading State

**Objective:** Show loading indicator if provided.

**Steps:**
1. Check loading prop
2. Render skeleton loaders for products
3. Show appropriate count of skeletons
4. Match product item layout
5. Smooth transition to actual content

**Loading Display:**
- Skeleton loaders preferred over spinner
- Show 3-5 skeleton items
- Match actual item dimensions
- Subtle animation

#### 9. Add Section Styling Classes

**Objective:** Apply CSS classes for styling.

**Classes to Add:**
1. Section container class
2. Header class
3. List container class
4. Empty state class
5. Loading state class

**Styling Notes:**
- Detailed styles in CSS file
- Use consistent naming convention
- Support theme variations
- Responsive considerations

#### 10. Add Accessibility Attributes

**Objective:** Make section accessible.

**ARIA Attributes:**
1. role="group" on section
2. aria-label="Product suggestions"
3. role="list" on list container
4. role="listitem" on items (if not using li)
5. aria-labelledby connecting header to list

**Keyboard Support:**
- Items should be focusable (handled in item component)
- Proper tab order
- Arrow key navigation (handled in later tasks)

#### 11. Implement "View All" Link

**Objective:** Add link to full search results page.

**Steps:**
1. Create link element below product list
2. Show only when more products exist
3. Calculate if more results available
4. Link to search results page with query
5. Include appropriate text ("View all 25 products")

**Link Behavior:**
- Show when products.length >= maxItems
- Navigate to /search?q=query
- Include total count if available
- Styled as subtle link

#### 12. Add Section Divider

**Objective:** Separate from other sections visually.

**Steps:**
1. Add divider element below section
2. Show only when other sections follow
3. Style as subtle line
4. Ensure proper spacing
5. Handle last section case (no divider)

**Divider Styling:**
- Subtle border or line
- Proper margins/padding
- Match design system
- Don't show on last section

### Expected Outcome

**Section Behavior:**
- Header displays "Products" title
- Product list renders all items up to limit
- Empty state shows when no products
- Loading state shows while fetching
- "View all" link shows when applicable
- Section is accessible and semantic
- Clean separation from other sections

**Visual Quality:**
- Clear hierarchy (header > list > items)
- Proper spacing and alignment
- Consistent styling
- Professional appearance

### Verification Steps

**Rendering Checks:**
1. Section renders with products data
2. Header displays correctly
3. Product items render for each product
4. Maximum 5-8 items displayed
5. Empty state appears with no products
6. Loading state shows during fetch

**Interaction Checks:**
1. Click product item triggers callback
2. "View all" link navigates correctly
3. Product items respond to hover
4. Keyboard navigation works

**Accessibility Checks:**
1. Proper ARIA roles applied
2. Header associated with list
3. Screen reader announces section
4. Keyboard accessible

**Edge Cases:**
1. Single product displays correctly
2. Many products (>20) limited properly
3. Empty array handled gracefully
4. Loading to results transition smooth
5. Long product names don't break layout

---

## Task 21: Create Product Suggestion Item

### Overview

Create the individual product suggestion item component that displays within the product suggestions section. Each item shows the product image, name, and price, with click handling and hover effects.

**Purpose:** Display individual product as clickable suggestion item.

**Scope:** Item container, layout, click handling, and styling.

### Dependencies

- **Required Completion:**
  - Task 20: Create Product Suggestions Section

- **Child Components:**
  - Task 22: Product Image (will be used)
  - Task 23: Product Info (will be used)

### Instructions

#### 1. Create Product Item Component

**Objective:** Set up the product item component.

**Steps:**
1. Create component file for product suggestion item
2. Define TypeScript interface for props
3. Set up component structure
4. Import required dependencies
5. Export component

#### 2. Define Component Props

**Objective:** Create props interface.

**Props to Include:**
1. **product** - Product object with full data
2. **searchQuery** - Query string for highlighting
3. **onClick** - Callback when item clicked
4. **isActive** - Boolean for keyboard navigation highlight
5. **onMouseEnter** - Optional hover callback
6. **index** - Item index for keyboard navigation

**Product Object Properties:**
- id: Unique identifier
- name: Product name
- price: Product price (number)
- image: Image URL
- slug: URL slug
- currency: Currency code (optional)
- availability: Stock status (optional)

#### 3. Create Item Container Structure

**Objective:** Build the HTML structure for item.

**Structure:**
1. Outer clickable container (button or div)
2. Image container section
3. Info container section
4. Hover effect wrapper
5. Active state indicator

**Element Choice:**
- Use button element for semantics
- OR div with role="option"
- Include all content in single clickable area
- Ensure proper cursor styling

#### 4. Integrate Product Image Component

**Objective:** Include product image in layout.

**Steps:**
1. Import ProductImage component (Task 22)
2. Render in left section of item
3. Pass image URL and alt text
4. Set image size (40x40px)
5. Handle missing images

**Image Placement:**
- Left side of item
- Fixed dimensions (40x40px)
- Consistent spacing
- Proper alignment with info

#### 5. Integrate Product Info Component

**Objective:** Include product information in layout.

**Steps:**
1. Import ProductInfo component (Task 23)
2. Render in right section of item
3. Pass product name and price
4. Pass search query for highlighting
5. Set proper text alignment

**Info Placement:**
- Right of image
- Flex grow to fill space
- Text left-aligned
- Proper spacing from image

#### 6. Implement Click Handler

**Objective:** Handle item selection.

**Steps:**
1. Attach onClick handler to container
2. Call props onClick callback with product
3. Prevent default if needed
4. Stop event propagation if needed
5. Log selection for analytics

**Click Behavior:**
- Trigger callback with product data
- Parent handles navigation
- Close dropdown (handled by parent)
- Track analytics event
- Smooth interaction

#### 7. Add Hover Effects

**Objective:** Provide visual feedback on hover.

**Steps:**
1. Add CSS class for hover state
2. Change background color on hover
3. Add smooth transition
4. Ensure good contrast
5. Match design system hover styles

**Hover Styling:**
- Background: Light gray or accent color
- Transition: 150ms ease
- Cursor: pointer
- Maintain text readability
- Subtle elevation (optional)

#### 8. Implement Active State

**Objective:** Highlight item during keyboard navigation.

**Steps:**
1. Accept isActive prop
2. Apply active class when true
3. Style similarly to hover
4. Ensure visible distinction
5. Support keyboard navigation

**Active State Styling:**
- Similar to hover state
- Clear visual indicator
- Different from default state
- Accessible contrast
- Smooth transition

#### 9. Add Item Layout Styling

**Objective:** Style item layout and spacing.

**Layout Properties:**
1. Display: flex
2. Align items: center
3. Padding: 8-12px
4. Gap between image and info
5. Full width of container

**Spacing:**
- Padding: 12px horizontal, 10px vertical
- Gap: 12px between image and info
- Consistent with other items
- Responsive considerations

#### 10. Add Accessibility Attributes

**Objective:** Make item accessible.

**ARIA Attributes:**
1. role="option" (if not button)
2. aria-label with full product description
3. aria-selected based on isActive
4. tabindex for keyboard navigation
5. aria-posinset and aria-setsize for position

**Keyboard Support:**
- Focusable with keyboard
- Proper tab order
- Enter/Space to select
- Arrow keys to navigate (handled by parent)

#### 11. Handle Missing Data

**Objective:** Gracefully handle incomplete product data.

**Steps:**
1. Provide default values for missing fields
2. Handle missing image URL
3. Handle missing price
4. Format price appropriately
5. Validate required fields

**Fallbacks:**
- Missing image: Use placeholder
- Missing price: Show "Price unavailable"
- Missing name: Use product ID
- Validation: Log warnings in dev mode

#### 12. Add Out-of-Stock Indicator

**Objective:** Show availability status if applicable.

**Steps:**
1. Check product availability field
2. Add visual indicator for out-of-stock
3. Adjust styling (reduced opacity, badge)
4. Update accessibility label
5. Consider disabling selection

**Out-of-Stock Display:**
- Reduced opacity (0.6)
- "Out of stock" badge
- Still clickable (view details)
- Clear visual indication

### Expected Outcome

**Item Behavior:**
- Displays product image, name, and price
- Clickable with proper feedback
- Hover effect shows on mouse over
- Active state shows during keyboard navigation
- Handles click and triggers callback
- Accessible via keyboard
- Gracefully handles missing data

**Visual Quality:**
- Clean, organized layout
- Proper spacing and alignment
- Professional hover effects
- Consistent with design system

### Verification Steps

**Rendering Checks:**
1. Item renders with product data
2. Image displays correctly
3. Name and price show
4. Layout is properly aligned
5. All spacing is consistent

**Interaction Checks:**
1. Click triggers onClick callback
2. Hover changes background
3. Active state applies correctly
4. Keyboard focus works
5. Enter key selects item

**Accessibility Checks:**
1. Role attribute present
2. ARIA label describes product
3. Keyboard focusable
4. Screen reader announces correctly
5. Proper tab order

**Edge Cases:**
1. Missing image handled
2. Missing price handled
3. Very long product name wraps/truncates
4. Out-of-stock items displayed correctly
5. Rapid clicks don't cause errors

---

## Task 22: Create Product Suggestion Image

### Overview

Create a component to display the product image within suggestion items. The component should handle image loading, provide placeholder for missing images, and maintain consistent dimensions.

**Purpose:** Display product thumbnails in autocomplete suggestions.

**Scope:** Image component with loading states, placeholders, and error handling.

### Dependencies

- **Required Completion:**
  - Task 21: Create Product Suggestion Item

- **Assets:**
  - Placeholder image or icon
  - Loading indicator (optional)

### Instructions

#### 1. Create Image Component

**Objective:** Set up product image component.

**Steps:**
1. Create component file for product image
2. Define TypeScript props interface
3. Set up component structure
4. Import dependencies
5. Export component

#### 2. Define Component Props

**Objective:** Create props interface.

**Props to Include:**
1. **src** - Image URL string
2. **alt** - Alt text for accessibility
3. **size** - Image dimensions (default 40)
4. **loading** - Optional loading state
5. **onError** - Optional error callback
6. **className** - Additional CSS classes

**Default Values:**
- size: 40 (40x40px)
- alt: Product name or "Product image"
- loading: "lazy"

#### 3. Set Up Component State

**Objective:** Manage image loading state.

**State Variables:**
1. **imageLoaded** - Boolean tracking if image loaded
2. **imageError** - Boolean tracking if image failed
3. **showPlaceholder** - Boolean to show placeholder

**Initial State:**
- imageLoaded: false
- imageError: false
- showPlaceholder: true if no src

#### 4. Implement Image Container

**Objective:** Create wrapper for image element.

**Steps:**
1. Create container div element
2. Set fixed width and height
3. Add styling classes
4. Ensure square aspect ratio
5. Add overflow hidden

**Container Styling:**
- Width: 40px
- Height: 40px
- Border-radius: 4px (optional)
- Background: Light gray (placeholder bg)
- Display: flex for centering

#### 5. Render Image Element

**Objective:** Display actual product image.

**Steps:**
1. Create img element
2. Set src from props
3. Set alt text for accessibility
4. Set width and height attributes
5. Add object-fit: cover
6. Enable lazy loading

**Image Attributes:**
- src: props.src
- alt: props.alt
- width: props.size
- height: props.size
- loading: "lazy"
- object-fit: cover (CSS)

#### 6. Implement onLoad Handler

**Objective:** Handle successful image load.

**Steps:**
1. Add onLoad event listener to img
2. Set imageLoaded state to true
3. Hide placeholder/loading state
4. Fade in image (optional animation)
5. Remove loading indicator

**Load Behavior:**
- Update state on successful load
- Transition from placeholder to image
- Smooth fade-in effect
- Remove loading class

#### 7. Implement onError Handler

**Objective:** Handle image load failures.

**Steps:**
1. Add onError event listener to img
2. Set imageError state to true
3. Show placeholder image/icon
4. Log error in dev mode
5. Call props.onError if provided

**Error Behavior:**
- Fallback to placeholder
- Don't show broken image
- Silent failure (user-friendly)
- Track errors for monitoring

#### 8. Create Placeholder Display

**Objective:** Show placeholder when image unavailable.

**Steps:**
1. Create placeholder element
2. Show when no src OR imageError
3. Use icon or default image
4. Style to match container size
5. Ensure good contrast

**Placeholder Options:**
- Generic product icon
- Camera icon
- Store logo
- Solid color background
- SVG icon

**Placeholder Styling:**
- Centered in container
- Gray color scheme
- Icon size: 20-24px
- Background: Light gray

#### 9. Add Loading State Display

**Objective:** Show loading indicator while image loads.

**Steps:**
1. Show while imageLoaded is false
2. Display spinner or skeleton
3. Match container dimensions
4. Subtle animation
5. Remove when image loads

**Loading Options:**
- Subtle spinner
- Skeleton loader (animated gray box)
- Pulsing animation
- No indicator (just background)

**Recommendation:**
- Skeleton loader preferred
- Simple gray box with pulse animation
- No spinner needed for small images

#### 10. Apply Image Styling

**Objective:** Style image for optimal display.

**CSS Properties:**
1. object-fit: cover (fill container)
2. object-position: center
3. display: block
4. width: 100%
5. height: 100%
6. border-radius: Match container

**Styling Notes:**
- Maintain aspect ratio
- Fill container completely
- Center image content
- Smooth edges with border-radius

#### 11. Add Optimization Attributes

**Objective:** Optimize image loading and performance.

**Optimizations:**
1. loading="lazy" for lazy loading
2. decoding="async" for async decoding
3. Consider srcset for responsive images
4. Consider WebP format support
5. Add appropriate dimensions

**Performance:**
- Lazy load images not in viewport
- Async decoding prevents blocking
- Use appropriate image sizes
- Consider CDN for images

#### 12. Add Accessibility Features

**Objective:** Make image accessible.

**Accessibility:**
1. Always provide meaningful alt text
2. Include product name in alt
3. Mark decorative images appropriately
4. Support high contrast mode
5. Ensure placeholder is perceivable

**Alt Text Guidelines:**
- Descriptive: "Product name"
- Not: "Image" or "Photo"
- Include key info if relevant
- Empty alt for decorative (rare)

### Expected Outcome

**Image Display:**
- Product image displays in 40x40px container
- Lazy loading for performance
- Placeholder shows for missing images
- Smooth loading transition
- Error handling prevents broken images
- Maintains square aspect ratio
- Properly styled with border-radius

**Performance:**
- Lazy loading reduces initial load
- Images optimized appropriately
- No layout shift during loading
- Smooth transitions

### Verification Steps

**Display Checks:**
1. Image renders at 40x40px
2. Image fills container (no gaps)
3. Border-radius applied (if design includes)
4. Placeholder shows for missing src
5. Loading state displays briefly

**Loading Checks:**
1. Images lazy load outside viewport
2. Smooth transition when image loads
3. No flicker during load
4. Placeholder visible until load complete

**Error Checks:**
1. Broken URL shows placeholder
2. Missing src shows placeholder
3. No broken image icon visible
4. Error logged in console (dev mode)

**Accessibility Checks:**
1. Alt text present and descriptive
2. Image accessible to screen readers
3. High contrast mode supported
4. Keyboard navigation works

**Performance Checks:**
1. Lazy loading verified in Network tab
2. Images load efficiently
3. No unnecessary reloads
4. Appropriate image sizes

---

## Task 23: Create Product Suggestion Info

### Overview

Create a component to display product information (name and price) within suggestion items. The component handles text display, highlighting of search matches, and proper formatting of product details.

**Purpose:** Display product name and price in autocomplete suggestions.

**Scope:** Text layout, highlighting, price formatting, and responsive text handling.

### Dependencies

- **Required Completion:**
  - Task 21: Create Product Suggestion Item

- **Related Components:**
  - Task 26: Highlighted Match (will be used)

### Instructions

#### 1. Create Product Info Component

**Objective:** Set up product info component.

**Steps:**
1. Create component file for product info
2. Define TypeScript props interface
3. Set up component structure
4. Import dependencies
5. Export component

#### 2. Define Component Props

**Objective:** Create props interface.

**Props to Include:**
1. **productName** - Product name string
2. **price** - Product price (number)
3. **currency** - Currency code (e.g., "LKR", "USD")
4. **searchQuery** - Query string for highlighting
5. **availability** - Optional stock status
6. **originalPrice** - Optional for sale items

**Optional Props:**
- discount: Discount percentage
- rating: Product rating
- badge: Special badge (new, sale, etc.)

#### 3. Create Container Structure

**Objective:** Build layout structure for info section.

**Structure:**
1. Outer container div
2. Product name section (top)
3. Price section (bottom)
4. Optional metadata section
5. Proper flex layout

**Layout:**
- Display: flex
- Flex-direction: column
- Justify-content: center
- Gap between name and price
- Flex: 1 (grow to fill space)

#### 4. Implement Product Name Display

**Objective:** Display product name with highlighting.

**Steps:**
1. Create div for product name
2. Integrate HighlightedMatch component (Task 26)
3. Pass product name and search query
4. Handle text overflow/truncation
5. Apply styling classes

**Name Display:**
- Font size: 14px
- Font weight: 500 (medium)
- Color: Dark gray or black
- Single line with ellipsis if too long
- Line-height: 1.4

**Truncation:**
- max-width: 100%
- overflow: hidden
- text-overflow: ellipsis
- white-space: nowrap

#### 5. Integrate Text Highlighting

**Objective:** Highlight matching text in product name.

**Steps:**
1. Import HighlightedMatch component (Task 26)
2. Pass productName as text
3. Pass searchQuery as query
4. Component handles highlighting logic
5. Ensure proper styling of highlights

**Highlighting:**
- Matches shown in bold
- Case-insensitive matching
- Multiple matches supported
- Smooth visual emphasis

#### 6. Implement Price Formatting

**Objective:** Display formatted price with currency.

**Steps:**
1. Create price formatting utility function
2. Format price with currency symbol
3. Handle different currencies (LKR, USD, etc.)
4. Format with proper decimals
5. Display in appropriate format

**Price Format Examples:**
- LKR 1,299.00
- $49.99
- Rs. 2,500

**Formatting Function:**
- Accept price (number) and currency (string)
- Return formatted string
- Use Intl.NumberFormat for localization
- Handle different decimal places by currency

#### 7. Display Price Information

**Objective:** Render formatted price.

**Steps:**
1. Create div for price display
2. Format price using utility
3. Display currency and amount
4. Apply styling classes
5. Ensure readability

**Price Styling:**
- Font size: 14px
- Font weight: 600 (semi-bold)
- Color: Accent color (e.g., primary blue)
- Margin-top: 4px from name

#### 8. Add Sale Price Display

**Objective:** Show original and sale prices for discounted items.

**Steps:**
1. Check if originalPrice exists
2. Display original price with strikethrough
3. Display sale price prominently
4. Show discount percentage badge
5. Style appropriately

**Sale Display:**
- Original price: Strikethrough, smaller, gray
- Sale price: Prominent, accent color
- Discount badge: Small pill (e.g., "-20%")
- Clear visual hierarchy

#### 9. Add Out-of-Stock Indicator

**Objective:** Show stock status if relevant.

**Steps:**
1. Check availability prop
2. Display "Out of stock" text if unavailable
3. Style in subtle red or gray
4. Position below price
5. Keep concise

**Stock Status Display:**
- Font size: 12px
- Color: Red (#dc2626) for out-of-stock
- Color: Green (#16a34a) for in-stock (optional)
- Display only if noteworthy

#### 10. Add Product Badge

**Objective:** Display special badges (New, Sale, etc.).

**Steps:**
1. Check for badge prop
2. Display badge near name or price
3. Style as small pill or tag
4. Use appropriate colors
5. Keep minimal

**Badge Types:**
- "New": Blue badge
- "Sale": Red badge
- "Featured": Gold badge
- Custom badges

**Badge Styling:**
- Small font (10-11px)
- Padding: 2px 6px
- Border-radius: 3px
- Bold text
- Positioned inline or above name

#### 11. Handle Long Product Names

**Objective:** Manage text overflow gracefully.

**Options:**
1. **Truncate with ellipsis** (Recommended)
   - Single line
   - Show ellipsis at end
   - Full name in tooltip on hover

2. **Wrap to two lines**
   - Allow two lines max
   - Ellipsis on second line
   - Line-clamp CSS

**Recommendation:**
- Use single line with ellipsis
- Add title attribute for full name
- Consider tooltip on hover

**Implementation:**
- white-space: nowrap
- overflow: hidden
- text-overflow: ellipsis
- title attribute with full name

#### 12. Add Responsive Styling

**Objective:** Ensure info displays well on all screen sizes.

**Steps:**
1. Test on mobile (320px+)
2. Adjust font sizes if needed
3. Ensure proper spacing
4. Handle very long names
5. Maintain readability

**Responsive Considerations:**
- Font sizes may reduce slightly on mobile
- Spacing remains consistent
- Truncation prevents overflow
- Touch-friendly sizing

### Expected Outcome

**Info Display:**
- Product name displays with highlighted matches
- Price shows in formatted currency
- Sale prices display with original price strikethrough
- Out-of-stock indicator shows when applicable
- Text truncates gracefully if too long
- Clean, readable layout
- Proper spacing and typography

**Visual Quality:**
- Clear hierarchy (name primary, price secondary)
- Highlighted text is visible
- Price is prominent and easy to read
- Consistent with design system

### Verification Steps

**Display Checks:**
1. Product name renders correctly
2. Price formats with currency
3. Text highlighting works
4. Sale price shows correctly
5. Out-of-stock indicator appears

**Truncation Checks:**
1. Long names truncate with ellipsis
2. Hover shows full name (tooltip)
3. No overflow outside container
4. Two lines maximum (if using wrap)

**Formatting Checks:**
1. Currency symbol correct for locale
2. Decimal places appropriate
3. Thousands separator used
4. Sale price strikes through original

**Responsive Checks:**
1. Displays well on mobile (320px)
2. Displays well on tablet (768px)
3. Displays well on desktop (1024px+)
4. Font sizes readable at all sizes

**Edge Cases:**
1. Very long product names (50+ chars)
2. Very high prices (7+ digits)
3. Missing price data
4. Missing currency data
5. Zero price (free items)

---

## Task 24: Create Category Suggestions Section

### Overview

Create a component to display category suggestions within the autocomplete dropdown. This section shows categories that match the search query, with icons, names, and product counts, providing an alternative navigation path.

**Purpose:** Display category results in autocomplete for broader search options.

**Scope:** Section container, header, category list, and integration with main dropdown.

### Dependencies

- **Required Completion:**
  - Task 17: Create Autocomplete Container

- **Child Components:**
  - Task 25: Category Suggestion Item (will be used)

### Instructions

#### 1. Create Category Section Component

**Objective:** Set up category suggestions section component.

**Steps:**
1. Create component file for category section
2. Define TypeScript props interface
3. Set up component structure
4. Import dependencies
5. Export component

**Component Purpose:**
- Display category matches
- Organize category items
- Provide section header
- Handle empty state

#### 2. Define Component Props

**Objective:** Create props interface.

**Props to Include:**
1. **categories** - Array of category objects
2. **searchQuery** - Query string for highlighting
3. **onCategorySelect** - Callback when category clicked
4. **maxItems** - Max categories to display (default 3-5)
5. **loading** - Optional loading state

**Category Object Shape:**
- id: Unique identifier
- name: Category name
- slug: URL slug
- icon: Icon name or component
- productCount: Number of products in category
- parentCategory: Parent category name (optional)

#### 3. Implement Section Header

**Objective:** Create header showing "Categories" title.

**Steps:**
1. Create header element above category list
2. Display "Categories" text
3. Optionally show count
4. Apply styling classes
5. Use semantic HTML (h3 or similar)

**Header Variations:**
- Simple: "Categories"
- With count: "Categories (3)"
- With icon: Icon + "Categories"
- Localization support

#### 4. Create Category List Structure

**Objective:** Build container for category items.

**Steps:**
1. Create list container (ul or div)
2. Set appropriate accessibility role
3. Map over categories array
4. Render category item for each
5. Add unique keys

**List Structure:**
- Semantic list elements (ul/li)
- Role="list" if needed
- Proper React keys
- Clean structure for styling

#### 5. Integrate Category Item Component

**Objective:** Render individual category items.

**Steps:**
1. Import CategorySuggestionItem component (Task 25)
2. Render for each category
3. Pass category data as props
4. Pass searchQuery for highlighting
5. Pass onCategorySelect callback
6. Include unique key

**Integration:**
- Item component handles display
- Pass necessary data and callbacks
- Handle clicks at item level
- Section manages list

#### 6. Implement Item Limit

**Objective:** Limit number of displayed categories.

**Steps:**
1. Accept maxItems prop (default 3-5)
2. Slice categories array to limit
3. Optionally show "View all categories" link
4. Indicate if more exist
5. Handle overflow gracefully

**Limit Behavior:**
- Default limit: 3-5 categories
- Show most relevant first
- Indicate if more results exist
- Link to categories page

#### 7. Add Empty State

**Objective:** Handle when no categories match.

**Steps:**
1. Check if categories array is empty
2. Render empty state message
3. Display helpful text
4. Include icon
5. Style appropriately

**Empty State Scenarios:**
- No categories for query
- All suggestions are products
- Error state

**Empty Message:**
- "No matching categories"
- "Try browsing all categories"
- Keep concise and helpful

#### 8. Add Loading State

**Objective:** Show loading indicator if provided.

**Steps:**
1. Check loading prop
2. Render skeleton loaders
3. Show 2-3 skeleton items
4. Match category item layout
5. Smooth transition

**Loading Display:**
- Skeleton loaders preferred
- Show 2-3 skeleton items
- Match item dimensions
- Subtle animation

#### 9. Add Section Divider

**Objective:** Separate from product section.

**Steps:**
1. Add divider element above section
2. Show only when products section exists above
3. Style as subtle line
4. Proper spacing
5. Conditional rendering

**Divider Styling:**
- Subtle border (1px)
- Light gray color
- Margin: 8px vertical
- Full width
- Don't show if first section

#### 10. Add Section Styling Classes

**Objective:** Apply CSS classes for styling.

**Classes to Add:**
1. Section container class
2. Header class
3. List container class
4. Empty state class
5. Loading state class
6. Divider class

**Styling Coordination:**
- Match product section styling
- Consistent spacing
- Theme support
- Responsive design

#### 11. Add Accessibility Attributes

**Objective:** Make section accessible.

**ARIA Attributes:**
1. role="group" on section
2. aria-label="Category suggestions"
3. role="list" on list container
4. aria-labelledby connecting header
5. Proper heading level

**Keyboard Support:**
- Items focusable (handled in item component)
- Proper tab order
- Arrow key navigation (later task)
- Screen reader announcements

#### 12. Implement "Browse All" Link

**Objective:** Add link to categories page.

**Steps:**
1. Create link element below list
2. Show when space available or many categories
3. Link to categories browse page
4. Include appropriate text
5. Styled as subtle link

**Link Details:**
- Text: "Browse all categories"
- Navigate to /categories or /shop
- Optional arrow icon
- Subtle styling

### Expected Outcome

**Section Behavior:**
- Header displays "Categories" title
- Category list renders items up to limit
- Empty state shows when no categories
- Loading state shows while fetching
- "Browse all" link shows when applicable
- Section is accessible
- Clean separation from products section

**Visual Quality:**
- Clear hierarchy
- Proper spacing
- Divider separates from products
- Consistent with design system

### Verification Steps

**Rendering Checks:**
1. Section renders with categories data
2. Header displays correctly
3. Category items render
4. Maximum 3-5 items displayed
5. Empty state appears when needed
6. Loading state shows correctly

**Interaction Checks:**
1. Click category triggers callback
2. "Browse all" link navigates
3. Items respond to hover
4. Keyboard navigation works

**Accessibility Checks:**
1. Proper ARIA roles
2. Header associated with list
3. Screen reader announces section
4. Keyboard accessible

**Layout Checks:**
1. Divider shows above section (if not first)
2. Spacing consistent with products
3. Items aligned properly
4. No overflow issues

**Edge Cases:**
1. Single category displays correctly
2. Many categories limited properly
3. Empty array handled
4. Long category names handled
5. Loading to results transition smooth

---

## Task 25: Create Category Suggestion Item

### Overview

Create the individual category suggestion item component that displays within the category suggestions section. Each item shows a category icon, name, and product count, with click handling and hover effects.

**Purpose:** Display individual category as clickable suggestion item.

**Scope:** Item container, icon display, text layout, click handling, and styling.

### Dependencies

- **Required Completion:**
  - Task 24: Create Category Suggestions Section

- **Related Components:**
  - Task 26: Highlighted Match (will be used)

### Instructions

#### 1. Create Category Item Component

**Objective:** Set up category item component.

**Steps:**
1. Create component file for category item
2. Define TypeScript props interface
3. Set up component structure
4. Import dependencies
5. Export component

#### 2. Define Component Props

**Objective:** Create props interface.

**Props to Include:**
1. **category** - Category object with full data
2. **searchQuery** - Query string for highlighting
3. **onClick** - Callback when item clicked
4. **isActive** - Boolean for keyboard navigation
5. **onMouseEnter** - Optional hover callback
6. **index** - Item index

**Category Object Properties:**
- id: Unique identifier
- name: Category name
- slug: URL slug
- icon: Icon name or React component
- productCount: Number of products
- parentCategory: Parent name (optional)

#### 3. Create Item Container Structure

**Objective:** Build HTML structure for item.

**Structure:**
1. Outer clickable container (button or div)
2. Icon container section (left)
3. Text container section (middle)
4. Count container section (right)
5. Hover effect wrapper

**Element Choice:**
- Use button element for semantics
- OR div with role="option"
- Single clickable area
- Proper cursor styling

#### 4. Implement Category Icon

**Objective:** Display icon representing category.

**Steps:**
1. Create icon container div
2. Render icon based on category.icon
3. Use icon library or SVG
4. Set consistent size (20-24px)
5. Apply icon styling

**Icon Options:**
- React Icons library
- Custom SVG icons
- Font icons (Font Awesome, etc.)
- Fallback generic icon

**Icon Display:**
- Size: 20-24px
- Color: Neutral (gray) or accent
- Centered in container
- Consistent across categories

**Icon Mapping:**
- Map category names to icons
- Electronics: Laptop icon
- Clothing: Shirt icon
- Food: Shopping bag icon
- Fallback: Folder icon

#### 5. Create Text Container

**Objective:** Layout for category name and highlighting.

**Steps:**
1. Create text container div
2. Flex grow to fill available space
3. Integrate HighlightedMatch component
4. Pass category name and query
5. Handle text overflow

**Text Layout:**
- Display: flex
- Flex-direction: column
- Justify-content: center
- Flex: 1 (grow)
- Align-items: flex-start

#### 6. Integrate Text Highlighting

**Objective:** Highlight matching text in category name.

**Steps:**
1. Import HighlightedMatch component (Task 26)
2. Pass category.name as text
3. Pass searchQuery as query
4. Component handles highlighting
5. Style highlighted portions

**Highlighting:**
- Bold for matched text
- Case-insensitive matching
- Multiple matches supported
- Clear visual emphasis

#### 7. Display Product Count

**Objective:** Show number of products in category.

**Steps:**
1. Create count container div
2. Format product count
3. Display count with label or just number
4. Position on right side
5. Style subtly

**Count Display Options:**
- Just number in parentheses: "(25)"
- With label: "25 products"
- Short form: "25 items"

**Count Styling:**
- Font size: 13px
- Color: Gray (subtle)
- Font weight: 400 (normal)
- Align right
- No wrap

#### 8. Implement Click Handler

**Objective:** Handle category selection.

**Steps:**
1. Attach onClick handler to container
2. Call props onClick with category
3. Prevent default if needed
4. Stop propagation if needed
5. Log selection for analytics

**Click Behavior:**
- Trigger callback with category data
- Parent handles navigation
- Navigate to category page
- Close dropdown (handled by parent)
- Track analytics

#### 9. Add Hover Effects

**Objective:** Provide visual feedback on hover.

**Steps:**
1. Add CSS class for hover state
2. Change background on hover
3. Add smooth transition
4. Ensure good contrast
5. Match product item hover

**Hover Styling:**
- Background: Light gray
- Transition: 150ms ease
- Cursor: pointer
- Maintain readability
- Consistent with product items

#### 10. Implement Active State

**Objective:** Highlight during keyboard navigation.

**Steps:**
1. Accept isActive prop
2. Apply active class when true
3. Style similar to hover
4. Ensure visible distinction
5. Support keyboard navigation

**Active State:**
- Similar to hover
- Clear indicator
- Accessible contrast
- Smooth transition

#### 11. Add Item Layout Styling

**Objective:** Style item layout and spacing.

**Layout Properties:**
1. Display: flex
2. Align-items: center
3. Padding: 10-12px
4. Gap: 12px between sections
5. Full width

**Spacing:**
- Padding: 12px horizontal, 10px vertical
- Gap: 12px between icon, text, count
- Consistent with product items
- Responsive considerations

#### 12. Add Accessibility Attributes

**Objective:** Make item accessible.

**ARIA Attributes:**
1. role="option" (if not button)
2. aria-label with full description
3. aria-selected based on isActive
4. tabindex for keyboard navigation
5. Position information

**Keyboard Support:**
- Focusable with keyboard
- Proper tab order
- Enter/Space to select
- Arrow keys (handled by parent)

**Accessible Label:**
- Example: "Electronics category, 25 products"
- Include all relevant info
- Clear and descriptive

### Expected Outcome

**Item Behavior:**
- Displays category icon, name, and product count
- Clickable with proper feedback
- Hover effect on mouse over
- Active state during keyboard navigation
- Click triggers callback with category data
- Accessible via keyboard
- Clean, organized layout

**Visual Quality:**
- Icon, text, and count well-aligned
- Proper spacing throughout
- Professional hover effects
- Consistent with product items

### Verification Steps

**Rendering Checks:**
1. Item renders with category data
2. Icon displays correctly
3. Name shows with highlighting
4. Product count displays
5. Layout aligned properly

**Interaction Checks:**
1. Click triggers onClick callback
2. Hover changes background
3. Active state applies correctly
4. Keyboard focus works
5. Enter key selects item

**Accessibility Checks:**
1. Role attribute present
2. ARIA label descriptive
3. Keyboard focusable
4. Screen reader announces correctly
5. Proper tab order

**Icon Checks:**
1. Icons display at correct size
2. Icons map correctly to categories
3. Fallback icon shows if needed
4. Icons centered properly

**Edge Cases:**
1. Very long category names
2. Large product counts (1000+)
3. Missing icon data
4. Zero products in category
5. Nested/sub-categories display

---

## Task 26: Create Highlighted Match

### Overview

Create a component to highlight matching text within suggestion items. This component takes a text string and search query, identifies matches, and renders the text with matched portions styled (typically bold) to draw user attention to query matches.

**Purpose:** Visually emphasize matching text in autocomplete suggestions.

**Scope:** Text matching logic, highlighting rendering, and styling of matched portions.

### Dependencies

- **Used By:**
  - Task 23: Product Suggestion Info
  - Task 25: Category Suggestion Item

### Instructions

#### 1. Create Highlighted Match Component

**Objective:** Set up text highlighting component.

**Steps:**
1. Create component file for highlighted match
2. Define TypeScript props interface
3. Set up component logic
4. Import dependencies
5. Export component

**Component Purpose:**
- Accept text and query
- Find matches in text
- Render with highlights
- Support case-insensitive matching

#### 2. Define Component Props

**Objective:** Create props interface.

**Props to Include:**
1. **text** - Full text string to display
2. **query** - Search query string to highlight
3. **highlightClassName** - Optional custom class for highlights
4. **caseSensitive** - Optional boolean (default false)
5. **highlightTag** - Optional HTML tag for highlight (default "strong")

**Default Values:**
- caseSensitive: false
- highlightTag: "strong"
- highlightClassName: "highlight" or "match"

#### 3. Implement Text Matching Logic

**Objective:** Find query matches within text.

**Steps:**
1. Escape special regex characters in query
2. Create regex pattern with global flag
3. Set case-insensitive flag if needed
4. Find all matches in text
5. Store match positions

**Matching Approach:**
- Use RegExp to find matches
- Support case-insensitive (default)
- Find all occurrences
- Handle special characters in query
- No partial word matching (optional enhancement)

**Edge Cases:**
- Empty query: Return text as-is
- Empty text: Return empty
- No matches: Return text as-is
- Query longer than text: No match

#### 4. Split Text by Matches

**Objective:** Break text into match and non-match segments.

**Steps:**
1. Split text at each match position
2. Create array of text segments
3. Track which segments are matches
4. Maintain original order
5. Handle consecutive matches

**Segment Structure:**
- Array of objects: { text: string, isMatch: boolean }
- Example: "Red Apple" with query "a"
  - [{ text: "Red ", isMatch: false }, { text: "A", isMatch: true }, { text: "pple", isMatch: false }]

**Splitting Algorithm:**
- Use String.split() with regex
- OR manually iterate and slice
- Preserve all characters
- Maintain order

#### 5. Implement Rendering Logic

**Objective:** Render text with highlights.

**Steps:**
1. Map over text segments
2. Render matched segments with highlight element
3. Render non-matched segments as plain text
4. Add React keys to elements
5. Return complete rendered text

**Rendering Approach:**
- Use array.map() to render segments
- Matched: Wrap in <strong> or custom tag
- Non-matched: Render as plain text
- Keys: Use segment index

#### 6. Create Highlight Element

**Objective:** Define how matched text is styled.

**Steps:**
1. Use provided highlightTag prop (default "strong")
2. Add highlightClassName for styling
3. Apply inline styles if needed
4. Ensure proper HTML semantics
5. Support custom elements

**Highlight Options:**
- `<strong>` - Semantic emphasis
- `<span>` with class - Flexible styling
- `<mark>` - HTML5 semantic highlight
- Custom component

**Recommendation:**
- Use `<strong>` for semantic boldness
- Add class for additional styling
- Support customization via props

#### 7. Add Highlight Styling

**Objective:** Style highlighted matches visually.

**Steps:**
1. Create CSS for highlight class
2. Set font-weight: bold
3. Optionally add background color
4. Ensure good contrast
5. Match design system

**Styling Options:**
1. **Bold only** (Recommended)
   - font-weight: 600 or 700
   - No background
   - Clean, subtle

2. **Bold with background**
   - font-weight: 600
   - background: Light yellow or accent color
   - padding: 2px
   - border-radius: 2px

**Recommendation:**
- Bold only for suggestions
- Background for search results page
- Keep subtle in autocomplete

#### 8. Handle Multiple Matches

**Objective:** Support multiple occurrences of query.

**Steps:**
1. Find all matches, not just first
2. Highlight each occurrence
3. Maintain proper spacing
4. Ensure no overlapping highlights
5. Test with repeated words

**Multiple Match Scenarios:**
- Query "le" in "Apple Peel"
- Query "at" in "Cat Hat Mat"
- All instances highlighted
- Proper separation

#### 9. Handle Case Insensitivity

**Objective:** Match regardless of case.

**Steps:**
1. Default to case-insensitive matching
2. Use regex 'i' flag
3. Preserve original text case in render
4. Query "app" matches "Apple"
5. Support case-sensitive option if needed

**Case Handling:**
- Search: Case-insensitive
- Display: Preserve original case
- "APP" query matches "Apple" renders "Apple" (not "APP")

#### 10. Optimize Performance

**Objective:** Ensure efficient rendering.

**Steps:**
1. Memoize component if possible
2. Avoid unnecessary re-renders
3. Cache regex compilation
4. Handle large text efficiently
5. Limit match complexity

**Performance Considerations:**
- Use React.memo for component
- Memoize matching logic
- Pre-compile regex if possible
- Limit text length if needed
- Debounce in parent (already done)

#### 11. Handle Empty/Invalid Input

**Objective:** Gracefully handle edge cases.

**Steps:**
1. Empty query: Return text without highlights
2. Empty text: Return empty string
3. Null/undefined: Return empty or null
4. Very long text: Optionally truncate
5. Invalid characters: Escape properly

**Fallbacks:**
- Always return valid React element
- Never throw errors
- Silent fallbacks
- Log warnings in dev mode

#### 12. Add Accessibility Considerations

**Objective:** Ensure highlights are accessible.

**Steps:**
1. Use semantic HTML (strong tag)
2. Ensure sufficient contrast
3. Don't rely only on color
4. Consider screen reader experience
5. Test with assistive technologies

**Accessibility:**
- `<strong>` provides semantic emphasis
- Bold is visible in high contrast mode
- Screen readers may emphasize
- Alternative: Use aria-label on parent

### Expected Outcome

**Component Behavior:**
- Accepts text and query props
- Finds all matches (case-insensitive)
- Renders text with highlighted matches
- Matched text displayed in bold
- Multiple matches all highlighted
- No errors on edge cases
- Efficient rendering

**Visual Quality:**
- Matched text clearly emphasized
- Bold styling clearly visible
- Maintains text readability
- Consistent with design

### Verification Steps

**Matching Checks:**
1. Single match highlighted correctly
2. Multiple matches all highlighted
3. Case-insensitive matching works
4. Query "app" matches "Apple"
5. No match: Text renders normally

**Rendering Checks:**
1. Matched text is bold
2. Non-matched text is normal
3. Original text case preserved
4. Spacing preserved correctly
5. Special characters handled

**Edge Cases:**
1. Empty query: No highlights, text displays
2. Empty text: Empty output
3. No matches: Text displays normally
4. Query longer than text: No matches
5. Special characters in query: Escaped properly

**Integration Checks:**
1. Works in product suggestion info
2. Works in category suggestion item
3. Re-renders on query change
4. Performance acceptable
5. No console errors

**Accessibility Checks:**
1. Uses semantic HTML
2. Screen reader compatible
3. Sufficient contrast
4. Bold visible in high contrast mode
5. No accessibility warnings

---

## Summary

This document has covered Tasks 17-26 for implementing the autocomplete suggestions system in the webstore search functionality. The implementation includes:

**Core Components Created:**
1. Autocomplete Container (Task 17)
2. Autocomplete Positioning (Task 18)
3. Visibility Logic (Task 19)
4. Product Suggestions Section (Task 20)
5. Product Suggestion Item (Task 21)
6. Product Image (Task 22)
7. Product Info (Task 23)
8. Category Suggestions Section (Task 24)
9. Category Suggestion Item (Task 25)
10. Highlighted Match (Task 26)

**Key Features Implemented:**
- Dropdown container with click-outside detection
- Proper positioning below search input
- Smart visibility control based on focus, query, and state
- Product suggestions with images and pricing
- Category suggestions with icons and counts
- Text highlighting for query matches
- Loading and error states
- Empty state handling
- Accessibility support
- Keyboard navigation foundation

**Integration Points:**
- Search input component
- Search state store
- API for fetching suggestions
- Navigation for product/category selection

**Next Steps:**
Proceed to document 02 covering Tasks 27-34, which will implement keyboard navigation, API integration, and verification of the complete search autocomplete system.

---

**End of Document**
