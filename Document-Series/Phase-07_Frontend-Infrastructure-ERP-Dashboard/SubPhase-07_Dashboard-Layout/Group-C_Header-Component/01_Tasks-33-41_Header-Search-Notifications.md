# Phase 07 → SubPhase 07 → Group C → Document 01
# Tasks 33-41: Header, Search, and Notifications

**Phase**: 07 - Frontend Infrastructure & ERP Dashboard  
**SubPhase**: 07 - Dashboard Layout  
**Group**: C - Header Component  
**Document**: 01 - Header, Search, and Notifications  
**Tasks Covered**: 33-41  

---

## Navigation

**Parent**: [Group C Overview](00_GROUP_OVERVIEW.md)  
**Previous**: [Group B - Tasks 24-32: States & Features](../Group-B_Sidebar-Component/02_Tasks-24-32_States-Features.md)  
**Next**: [Group D Overview](../Group-D_Navigation-Breadcrumbs/00_GROUP_OVERVIEW.md)  

---

## Document Overview

This document covers the implementation of the main Header component, Global Search functionality, and Notifications system for the ERP dashboard. The Header serves as the primary navigation and utility bar, providing quick access to search, notifications, and user actions.

### Tasks Covered

| Task | Title | Component | Priority |
|------|-------|-----------|----------|
| 33 | Create Header Component | Header.tsx | High |
| 34 | Create Mobile Menu Toggle | Header.tsx | High |
| 35 | Create Header Logo (Mobile) | Header.tsx | Medium |
| 36 | Create Global Search Input | GlobalSearch.tsx | High |
| 37 | Implement Search Functionality | GlobalSearch.tsx | High |
| 38 | Create Notifications Bell | NotificationBell.tsx | Medium |
| 39 | Create Notifications Dropdown | NotificationDropdown.tsx | Medium |
| 40 | Create Notification Item | NotificationItem.tsx | Medium |
| 41 | Mark Notifications as Read | NotificationItem.tsx | Medium |

### Header Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  [☰]  [Logo]          [🔍 Search... Ctrl+K]         [🔔²] [👤] [⚙]  │
│                                                                       │
│  Mobile Toggle (< 1024px)                          Notifications     │
│  Company Logo                                       User Menu         │
│  Global Search (240px width)                        Settings          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Task 33: Create Header Component

### Overview

Create the main Header component that serves as the fixed top navigation bar for the entire dashboard. The Header provides a consistent navigation experience across all pages and contains the mobile menu toggle, logo, search, notifications, and user menu.

### Header Layout Specifications

```
Desktop (≥ 1024px):
┌────────────────────────────────────────────────────────────┐
│ [Logo Space]  [Search Input]         [Notifications] [User] │
│    120px         240px                   Right Aligned       │
└────────────────────────────────────────────────────────────┘

Mobile (< 1024px):
┌────────────────────────────────────────────────────────────┐
│ [☰] [Logo]                        [🔔] [👤]                │
│ 48px  Auto                         Right Aligned            │
└────────────────────────────────────────────────────────────┘
```

### Dependencies

**Technical Dependencies**:
- React 18.x
- Tailwind CSS configured
- Layout structure from SubPhase-07 Group-A

**Component Dependencies**:
- GlobalSearch component (Task 36-37)
- NotificationBell component (Task 38)
- UserMenu component (created separately)

**State Dependencies**:
- Sidebar state for mobile toggle
- Authentication state for user info

### Instructions

1. **Create Header Component File**
   - Create file at `frontend/components/layout/Header/Header.tsx`
   - Import necessary dependencies from React
   - Import Tailwind utilities and icon library

2. **Define Header Structure**
   - Create functional component with proper TypeScript types
   - Set up fixed positioning with z-index for proper layering
   - Define height as 64px (h-16 in Tailwind)
   - Add white background with bottom border

3. **Implement Desktop Layout**
   - Use flex container with items centered
   - Add horizontal padding: px-6
   - Create three sections: left, center, right
   - Left section: Logo area (only visible on desktop)
   - Center section: Global Search component
   - Right section: Notifications, User Menu, Settings

4. **Implement Mobile Layout**
   - Add responsive breakpoints using Tailwind
   - Show mobile toggle button below 1024px (lg:hidden)
   - Hide desktop logo on mobile, show mobile variant
   - Hide search input on very small screens
   - Maintain notifications and user menu visibility

5. **Add Mobile Menu Toggle**
   - Create button for mobile menu toggle (handled in Task 34)
   - Position at far left on mobile
   - Connect to sidebar state management
   - Add appropriate ARIA labels for accessibility

6. **Integrate Child Components**
   - Import and render GlobalSearch component
   - Import and render NotificationBell component
   - Import and render UserMenu component (if available)
   - Ensure proper spacing between elements

7. **Add Styling and Polish**
   - Apply shadow for depth: shadow-sm
   - Ensure smooth transitions for responsive changes
   - Add focus states for keyboard navigation
   - Test color contrast for accessibility

8. **Configure Positioning**
   - Set position to fixed
   - Set top-0 and left-0 for full width
   - Set right-0 or w-full for stretching
   - Adjust z-index to be above content but below modals

### Expected Outcome

A fully functional Header component that:
- Displays consistently across all dashboard pages
- Adapts responsively from mobile to desktop viewports
- Contains all primary navigation utilities
- Maintains 64px height with proper spacing
- Integrates seamlessly with sidebar and main content
- Provides accessible keyboard navigation

### Verification Checklist

- [ ] Header renders with fixed positioning at top of viewport
- [ ] Height remains consistent at 64px across all screen sizes
- [ ] Desktop layout shows logo, search, notifications, and user menu
- [ ] Mobile layout shows toggle, logo, notifications, and user menu
- [ ] Background color is white with subtle bottom border
- [ ] Shadow effect provides visual separation from content
- [ ] Component accepts and renders child components properly
- [ ] Responsive breakpoints work correctly at 1024px
- [ ] Z-index ensures header stays above scrolling content
- [ ] No horizontal overflow on any screen size
- [ ] Keyboard navigation works for all interactive elements
- [ ] ARIA labels present for screen readers

---

## Task 34: Create Mobile Menu Toggle

### Overview

Implement the hamburger menu button that toggles the sidebar visibility on mobile and tablet devices. This button appears only on screens smaller than 1024px and provides the primary navigation access on mobile devices.

### Mobile Toggle Specifications

```
Button State: Closed                Button State: Open
┌──────┐                           ┌──────┐
│  ══  │                           │  ✕   │
│  ══  │  →  (Click)  →            │      │
│  ══  │                           │      │
└──────┘                           └──────┘
   48x48px                            48x48px
   Hamburger Icon                     Close Icon
```

### Dependencies

**Technical Dependencies**:
- React hooks (useState, useCallback)
- Tailwind CSS responsive utilities
- Icon library (Lucide React or similar)

**State Dependencies**:
- Sidebar open/closed state from layout state management
- Global state or context for sidebar control

**Component Dependencies**:
- Parent Header component (Task 33)
- Sidebar component state connection

### Instructions

1. **Set Up Toggle Button Structure**
   - Create button element within Header component
   - Add Tailwind classes for size: w-12 h-12
   - Apply flex centering: flex items-center justify-center
   - Set visibility: visible on mobile, hidden on desktop (lg:hidden)

2. **Connect to Sidebar State**
   - Import sidebar state hook or context
   - Access current sidebar open/closed state
   - Get toggle function to update sidebar state
   - Ensure state persists across component renders

3. **Implement Click Handler**
   - Create onClick handler function
   - Call sidebar toggle function on click
   - Add haptic feedback for mobile devices (if available)
   - Prevent event bubbling if needed

4. **Add Icons**
   - Import hamburger icon (Menu icon: three horizontal lines)
   - Import close icon (X icon for opened state)
   - Conditionally render icon based on sidebar state
   - Ensure icons are properly sized (20x20px or w-5 h-5)

5. **Apply Styling**
   - Add hover state: hover:bg-gray-100
   - Add active state: active:bg-gray-200
   - Apply rounded corners: rounded-md or rounded-lg
   - Add transition for smooth hover effect

6. **Implement Accessibility**
   - Add aria-label: "Toggle navigation menu" or "Close navigation menu"
   - Add aria-expanded attribute based on sidebar state
   - Add aria-controls linking to sidebar element ID
   - Ensure button is keyboard accessible (tab navigation)

7. **Handle Touch Interactions**
   - Ensure button has sufficient touch target size (minimum 44x44px)
   - Add touch feedback for mobile devices
   - Prevent double-tap zoom on mobile
   - Test on various mobile devices

8. **Position Within Header**
   - Place at far left of header on mobile
   - Add margin-right for spacing from logo (mr-2 or mr-3)
   - Align vertically centered within header
   - Ensure it doesn't overlap with other elements

### Expected Outcome

A fully functional mobile menu toggle button that:
- Appears only on screens smaller than 1024px
- Toggles sidebar visibility when clicked
- Shows appropriate icon based on sidebar state
- Provides smooth hover and active states
- Meets accessibility standards for mobile navigation
- Has proper touch target size for mobile interaction

### Verification Checklist

- [ ] Button visible on screens < 1024px
- [ ] Button hidden on screens ≥ 1024px
- [ ] Clicking button toggles sidebar state
- [ ] Hamburger icon shows when sidebar is closed
- [ ] Close icon shows when sidebar is open
- [ ] Button has 48x48px minimum size
- [ ] Hover effect displays correctly
- [ ] Active/pressed state provides visual feedback
- [ ] aria-label describes current state
- [ ] aria-expanded attribute updates correctly
- [ ] Keyboard navigation works (Enter and Space keys)
- [ ] Button is positioned at far left of header
- [ ] Touch target is large enough for mobile use
- [ ] No layout shift when icon changes

---

## Task 35: Create Header Logo (Mobile)

### Overview

Implement the company logo display for the header, optimized for both mobile and desktop views. The logo provides brand identity and typically links back to the dashboard home page.

### Logo Layout Specifications

```
Desktop (≥ 1024px):
┌──────────────────────┐
│  [Company Logo]      │
│  Width: Auto         │
│  Height: 40px        │
│  Max-Width: 160px    │
└──────────────────────┘

Mobile (< 1024px):
┌──────────────┐
│  [Logo Icon] │
│  or Compact  │
│  40x40px     │
└──────────────┘
```

### Dependencies

**Technical Dependencies**:
- Next.js Image component for optimization
- Logo image files (SVG preferred)
- Tailwind CSS responsive utilities

**Asset Dependencies**:
- Full logo image (for desktop): logo-full.svg
- Icon/compact logo (for mobile): logo-icon.svg
- Logo should be in public/assets/logo/ directory

**Component Dependencies**:
- Parent Header component (Task 33)
- Next.js Link component for navigation

### Instructions

1. **Prepare Logo Assets**
   - Ensure full logo exists in SVG format for best scaling
   - Create or obtain compact logo icon for mobile view
   - Verify logo files are in public/assets/logo/ directory
   - Optimize file sizes for fast loading

2. **Create Logo Container**
   - Create clickable container using Next.js Link component
   - Set href to "/" or "/dashboard" for home navigation
   - Apply flex properties for alignment
   - Add appropriate padding and margins

3. **Implement Desktop Logo**
   - Use Next.js Image component for optimization
   - Set src to full logo path
   - Configure height: 40px (h-10)
   - Set max-width: 160px
   - Enable priority loading for above-fold content
   - Apply object-fit: contain to preserve aspect ratio

4. **Implement Mobile Logo**
   - Use separate Image component for mobile variant
   - Set src to compact logo/icon path
   - Configure dimensions: 40x40px
   - Apply responsive display: block on mobile, hidden on desktop
   - Ensure proper centering within container

5. **Add Responsive Behavior**
   - Hide full logo on screens < 1024px (hidden lg:block)
   - Show mobile logo on screens < 1024px (block lg:hidden)
   - Ensure smooth transition between breakpoints
   - Test at various viewport widths

6. **Apply Styling**
   - Add hover effect: slight opacity change or scale
   - Ensure logo has proper contrast with header background
   - Add transition for smooth hover effect
   - Consider dark mode compatibility if applicable

7. **Implement Accessibility**
   - Add alt text to images: "Company Name Logo"
   - Ensure Link has proper focus states
   - Add aria-label if logo doesn't have descriptive text
   - Test with screen readers

8. **Position in Header**
   - Place after mobile toggle on mobile
   - Place at left edge on desktop (or after small margin)
   - Add margin-right for spacing from next element
   - Ensure vertical centering within header

### Expected Outcome

A responsive logo implementation that:
- Displays full logo on desktop screens
- Shows compact logo on mobile screens
- Links to dashboard home page
- Provides proper hover states
- Loads efficiently with Next.js Image optimization
- Maintains brand consistency across viewports

### Verification Checklist

- [ ] Full logo displays on screens ≥ 1024px
- [ ] Compact logo displays on screens < 1024px
- [ ] Logo height is 40px on all screen sizes
- [ ] Logo is properly centered vertically in header
- [ ] Clicking logo navigates to home/dashboard
- [ ] Hover effect displays smoothly
- [ ] Image loads with priority flag
- [ ] Alt text is descriptive and meaningful
- [ ] No layout shift during logo loading
- [ ] Logo scales appropriately without distortion
- [ ] Link has visible focus state for keyboard navigation
- [ ] Logo has sufficient spacing from adjacent elements
- [ ] Logo maintains quality at different zoom levels
- [ ] Dark mode compatibility tested (if applicable)

---

## Task 36: Create Global Search Input

### Overview

Implement the global search input field that provides quick access to search functionality across the entire application. The search input should be visually prominent, include a keyboard shortcut indicator, and prepare for integration with a command palette.

### Search Input Design

```
Desktop Layout:
┌─────────────────────────────────────────────┐
│  🔍  Search anything...          Ctrl+K     │
│       Placeholder Text            Badge     │
└─────────────────────────────────────────────┘
Width: 240px (default) → 400px (focused)
Height: 40px
Border-radius: 8px

Mobile Layout (< 768px):
┌──────────┐
│    🔍    │  (Icon only, opens modal on click)
└──────────┘
```

### Dependencies

**Technical Dependencies**:
- React hooks (useState, useEffect, useCallback)
- Tailwind CSS for styling
- Icon library for search icon
- Keyboard event handling

**Component Dependencies**:
- Parent Header component (Task 33)
- Command palette component (Task 37)

**State Dependencies**:
- Search query state (local or global)
- Command palette open/closed state

### Instructions

1. **Create GlobalSearch Component File**
   - Create file at `frontend/components/layout/Header/GlobalSearch.tsx`
   - Set up functional component with TypeScript interface
   - Define props interface for any customization options
   - Import necessary React hooks

2. **Create Input Container**
   - Create outer div with relative positioning
   - Set initial width: 240px (w-60)
   - Add transition for width expansion on focus
   - Apply background: light gray (bg-gray-50 or bg-gray-100)
   - Add border: subtle gray border (border border-gray-300)
   - Apply border-radius: rounded-lg

3. **Implement Search Input Field**
   - Create input element with type="text"
   - Set placeholder: "Search anything..."
   - Apply padding: pl-10 pr-16 py-2 (space for icon and badge)
   - Make text color appropriate: text-gray-900
   - Set placeholder color: placeholder:text-gray-500
   - Remove default browser styling: outline-none

4. **Add Search Icon**
   - Import search icon from icon library
   - Position icon absolutely at left side
   - Apply left and top positioning for vertical centering
   - Size icon appropriately: 18-20px
   - Color icon: text-gray-400 or text-gray-500

5. **Add Keyboard Shortcut Badge**
   - Create badge element showing "Ctrl+K" (Windows/Linux) or "⌘K" (Mac)
   - Position absolutely at right side of input
   - Apply padding: px-2 py-1
   - Set background: gray-200 or gray-300
   - Add border-radius: rounded
   - Set text size: text-xs
   - Make text color: text-gray-600

6. **Implement Focus State**
   - Add focus styling: focus:ring-2 focus:ring-blue-500
   - Expand width on focus: focus:w-96 (400px)
   - Change background on focus: focus:bg-white
   - Add transition: transition-all duration-200
   - Ensure smooth animation for width change

7. **Add Responsive Behavior**
   - On mobile (< 768px), show only search icon button
   - Hide full input on very small screens
   - Open command palette modal when icon clicked on mobile
   - Maintain full input visibility on tablet and desktop

8. **Implement Click Handler**
   - Create onClick handler for input
   - Handler should open command palette (implemented in Task 37)
   - Prevent default input behavior (input becomes trigger)
   - Add cursor-pointer to indicate clickability

### Expected Outcome

A functional global search input that:
- Displays prominently in header with clean design
- Shows search icon and keyboard shortcut indicator
- Expands smoothly when focused on desktop
- Adapts to mobile with icon-only view
- Prepares foundation for command palette integration
- Provides excellent visual feedback for user interaction

### Verification Checklist

- [ ] Search input renders in header center area
- [ ] Initial width is 240px on desktop
- [ ] Search icon displays on left side of input
- [ ] Keyboard shortcut badge displays on right side
- [ ] Badge shows correct shortcut for user's OS
- [ ] Placeholder text is visible and readable
- [ ] Focus state expands input to 400px smoothly
- [ ] Focus ring appears with appropriate color
- [ ] Background changes from gray to white on focus
- [ ] Transition animation is smooth and performant
- [ ] Mobile view shows icon-only button < 768px
- [ ] Input is vertically centered in header
- [ ] Text input has proper contrast ratio
- [ ] Component is keyboard accessible
- [ ] No layout shift occurs during focus/blur

---

## Task 37: Implement Search Functionality

### Overview

Implement the command palette functionality that provides powerful, keyboard-driven search across the entire application. This feature allows users to quickly navigate to pages, execute actions, and search for content using a modal interface powered by the cmdk library.

### Command Palette Architecture

```
Search Flow:
┌──────────────────────────────────────────────────────────┐
│  User Input                                              │
│    ↓                                                     │
│  Filter Logic                                            │
│    ↓                                                     │
│  Display Grouped Results:                               │
│    - Navigation Items (Pages, Modules)                  │
│    - Recent Items (Recently Visited)                    │
│    - Quick Actions (Create, Export, etc.)               │
│    - Search Results (Products, Orders, Customers)       │
│    ↓                                                     │
│  User Selection → Execute Action or Navigate            │
└──────────────────────────────────────────────────────────┘

Keyboard Shortcuts:
- Ctrl/Cmd+K: Open command palette
- Esc: Close command palette
- Arrow Up/Down: Navigate results
- Enter: Execute selected action
- Ctrl/Cmd+Backspace: Clear input
```

### Dependencies

**Technical Dependencies**:
- cmdk library: npm install cmdk
- React hooks (useState, useEffect, useCallback, useMemo)
- Next.js router for navigation
- Keyboard event listeners

**API Dependencies**:
- Search API endpoint for global search
- Navigation structure from routing configuration
- Recent items from local storage or user preferences

**Component Dependencies**:
- GlobalSearch input component (Task 36)
- Dialog/Modal component (Radix or Headless UI)

### Instructions

1. **Install and Set Up cmdk Library**
   - Install cmdk package via npm or yarn
   - Import Command components from cmdk
   - Review cmdk documentation for API reference
   - Set up basic command palette structure

2. **Create Command Palette Component**
   - Create file: `frontend/components/layout/Header/CommandPalette.tsx`
   - Set up functional component with TypeScript
   - Define state for open/closed status
   - Define state for search query input

3. **Implement Keyboard Shortcut Listener**
   - Use useEffect to add keyboard event listener
   - Listen for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
   - Prevent default browser behavior for these shortcuts
   - Toggle command palette visibility when triggered
   - Handle Escape key to close palette
   - Clean up event listener on component unmount

4. **Create Command Palette Modal**
   - Use Command component from cmdk as root
   - Wrap with Dialog/Modal component for overlay
   - Set modal backdrop: semi-transparent dark (bg-black/50)
   - Position command palette: centered vertically and horizontally
   - Set max-width: 640px
   - Set max-height: 60vh with scrollable content
   - Apply styling: rounded-lg, shadow-2xl, bg-white

5. **Implement Command Input**
   - Use Command.Input component from cmdk
   - Apply styling to match design system
   - Set placeholder: "Type a command or search..."
   - Add padding and border styling
   - Connect to search query state
   - Implement debounced search for API calls

6. **Define Command Groups**
   - Create Command.List component for results container
   - Create Command.Group components for each category:
     - Navigation (Dashboard, Products, Orders, etc.)
     - Recent Items (Last visited pages)
     - Quick Actions (Create New Product, Export Report, etc.)
     - Search Results (Dynamic based on query)
   - Add separators between groups for visual clarity
   - Include group labels for each category

7. **Implement Navigation Items**
   - Define array of navigation items with:
     - Icon component
     - Label text
     - Route path
     - Optional keyboard shortcut
     - Keywords for search matching
   - Create Command.Item for each navigation item
   - Implement onSelect handler that navigates to route
   - Close command palette after navigation

8. **Implement Quick Actions**
   - Define array of quick action items with:
     - Icon component
     - Label text
     - Action function
     - Keywords for search matching
   - Create Command.Item for each action
   - Implement onSelect handler that executes action
   - Examples: "Create New Product", "Export Sales Report", "View Settings"

9. **Implement Dynamic Search**
   - Create useEffect that triggers API search when query changes
   - Debounce search requests (300-500ms delay)
   - Call global search API with query parameter
   - Parse response into searchable items
   - Display results in Search Results group
   - Show loading state while searching
   - Show empty state when no results found

10. **Add Recent Items**
    - Track recently visited pages in local storage or state
    - Load recent items when palette opens
    - Display up to 5 most recent items
    - Include timestamp or "visited X ago" information
    - Implement click to revisit recent page

11. **Implement Keyboard Navigation**
    - Ensure Arrow Up/Down navigate through items
    - Ensure Enter key executes selected item
    - Implement Home/End keys for first/last item
    - Test keyboard-only navigation flow
    - Add visual indicator for selected item

12. **Add Empty and Loading States**
    - Create Command.Empty component for no results
    - Display helpful message: "No results found. Try different keywords."
    - Create loading indicator for API search in progress
    - Show skeleton loaders or spinner during search
    - Ensure smooth transition between states

13. **Optimize Performance**
    - Memoize command items arrays to prevent re-renders
    - Implement virtual scrolling for large result sets
    - Debounce API calls appropriately
    - Lazy load command palette component if needed
    - Test performance with large datasets

14. **Connect to GlobalSearch Input**
    - Import and use command palette in GlobalSearch component
    - Update GlobalSearch onClick to open command palette
    - Ensure clicking input field triggers palette
    - Synchronize search query between input and palette

### Expected Outcome

A fully functional command palette that:
- Opens instantly with Ctrl/Cmd+K keyboard shortcut
- Provides fast, keyboard-driven navigation
- Searches across multiple data types and categories
- Displays grouped, organized results
- Executes actions and navigation seamlessly
- Enhances user productivity significantly
- Follows cmdk best practices and patterns

### Verification Checklist

- [ ] cmdk library installed and imported correctly
- [ ] Ctrl/Cmd+K opens command palette from anywhere
- [ ] Escape key closes command palette
- [ ] Modal backdrop dims background appropriately
- [ ] Command palette is centered and properly sized
- [ ] Search input accepts text and updates query state
- [ ] Navigation group displays all main routes
- [ ] Quick Actions group displays common actions
- [ ] Recent Items group shows last visited pages
- [ ] Search Results display dynamic API results
- [ ] Arrow keys navigate through items
- [ ] Enter key executes selected item
- [ ] Selected item has clear visual indication
- [ ] Navigation works and closes palette after selection
- [ ] Quick actions execute and close palette
- [ ] Loading state displays during API search
- [ ] Empty state displays when no results found
- [ ] Search is debounced to prevent excessive API calls
- [ ] Performance is smooth with many results
- [ ] Clicking outside palette closes it
- [ ] Keyboard-only usage is fully functional

---

## Task 38: Create Notifications Bell

### Overview

Implement the notifications bell icon button that serves as the trigger for the notifications dropdown. The bell displays an unread count badge when there are new notifications and provides visual feedback for user interaction.

### Notification Bell Design

```
Bell States:

No Unread:                    With Unread Count:
┌─────┐                       ┌─────┐
│  🔔 │                       │  🔔 │
│     │                       │   ② │ (Red badge)
└─────┘                       └─────┘

Hovered:                      Active/Open:
┌─────┐                       ┌─────┐
│  🔔 │                       │  🔔 │
│   ② │ (Background gray)     │   ② │ (Blue highlight)
└─────┘                       └─────┘
```

### Dependencies

**Technical Dependencies**:
- React hooks (useState, useEffect)
- Radix UI DropdownMenu (for dropdown trigger)
- Icon library (Lucide React or similar)
- Tailwind CSS for styling

**State Dependencies**:
- Notifications array from global state
- Unread count from notifications state
- Real-time notification updates (WebSocket or polling)

**Component Dependencies**:
- Parent Header component (Task 33)
- NotificationDropdown component (Task 39)

### Instructions

1. **Create NotificationBell Component File**
   - Create file at `frontend/components/layout/Header/NotificationBell.tsx`
   - Set up functional component with TypeScript
   - Define props interface if needed
   - Import necessary dependencies

2. **Set Up Dropdown Trigger**
   - Import DropdownMenu from Radix UI
   - Use DropdownMenu.Trigger as wrapper for bell button
   - Set asChild prop to true for proper composition
   - Connect to NotificationDropdown component

3. **Create Bell Button Element**
   - Create button element with relative positioning
   - Apply dimensions: w-10 h-10 (40x40px)
   - Add flex centering: flex items-center justify-center
   - Apply border-radius: rounded-lg
   - Set initial background: transparent

4. **Add Bell Icon**
   - Import bell icon from icon library
   - Set icon size: w-5 h-5 (20x20px)
   - Apply color: text-gray-700 or text-gray-600
   - Position icon centered within button

5. **Connect to Notifications State**
   - Import notifications state hook or context
   - Access unread notifications count
   - Set up listener for real-time updates
   - Calculate unread count from notifications array

6. **Implement Unread Badge**
   - Create badge element with absolute positioning
   - Position at top-right corner of bell: top-0 right-0
   - Apply transform: translate-x-1/4 -translate-y-1/4
   - Set background: bg-red-500 or bg-red-600
   - Set text color: text-white
   - Apply size: min-w-5 h-5 (minimum width for single digits)
   - Set text size: text-xs
   - Add padding: px-1.5
   - Apply border-radius: rounded-full
   - Center text: flex items-center justify-center

7. **Implement Badge Logic**
   - Show badge only when unread count is greater than zero
   - Display actual count for numbers 1-99
   - Display "99+" for counts over 99
   - Hide badge completely when count is zero
   - Update badge in real-time when notifications arrive

8. **Add Hover State**
   - Apply hover background: hover:bg-gray-100
   - Add transition: transition-colors duration-200
   - Ensure smooth color change on hover
   - Test hover state activation

9. **Add Active/Open State**
   - Apply different styling when dropdown is open
   - Use data-state attribute from Radix: data-[state=open]
   - Change background to blue tint: data-[state=open]:bg-blue-50
   - Optional: change icon color when open

10. **Implement Accessibility**
    - Add aria-label: "Notifications" with unread count
    - Example: "Notifications, 3 unread"
    - Update aria-label when count changes
    - Add aria-haspopup="menu"
    - Ensure button is keyboard accessible
    - Test with screen readers

11. **Add Animation for New Notifications**
    - Implement subtle animation when new notification arrives
    - Options: shake, pulse, or scale animation
    - Use CSS keyframes or Tailwind animate utilities
    - Trigger animation via state change
    - Keep animation subtle and non-intrusive

12. **Position in Header**
    - Place bell in right section of header
    - Add margin spacing from adjacent elements
    - Ensure proper alignment with other icons
    - Test positioning at different screen sizes

### Expected Outcome

A functional notification bell that:
- Displays clearly in header with recognizable bell icon
- Shows unread count badge when notifications are unread
- Updates badge in real-time as notifications arrive
- Provides smooth hover and active state feedback
- Triggers notifications dropdown when clicked
- Meets accessibility standards
- Animates subtly for new notification alerts

### Verification Checklist

- [ ] Bell icon renders properly in header
- [ ] Button has 40x40px dimensions
- [ ] Bell icon is centered within button
- [ ] Hover state changes background color
- [ ] Active/open state provides visual feedback
- [ ] Unread badge appears when count > 0
- [ ] Unread badge displays correct count
- [ ] Badge shows "99+" for counts over 99
- [ ] Badge is positioned at top-right of bell
- [ ] Badge has red background with white text
- [ ] Badge is clearly visible and readable
- [ ] Clicking bell opens notifications dropdown
- [ ] aria-label includes unread count
- [ ] Button is keyboard accessible (Tab key)
- [ ] Pressing Enter/Space opens dropdown
- [ ] Animation plays when new notification arrives
- [ ] Badge updates in real-time
- [ ] No layout shift when badge appears/disappears

---

## Task 39: Create Notifications Dropdown

### Overview

Implement the notifications dropdown panel that displays a list of recent notifications. The dropdown appears below the notification bell and provides a scrollable list of notifications, quick actions, and a link to view all notifications.

### Notifications Dropdown Layout

```
┌────────────────────────────────────────────┐
│  Notifications                    [✓ All]  │ ← Header
├────────────────────────────────────────────┤
│  [i] System Update Available          2m  │ ← Item
│      Click to view update details          │
├────────────────────────────────────────────┤
│  [✓] Order #12345 Completed          15m  │
│      Customer: John Doe                    │
├────────────────────────────────────────────┤
│  [⚠] Low Stock Alert                  1h  │
│      5 products below minimum stock        │
├────────────────────────────────────────────┤
│  [•] New message from Admin           2h  │
│      "Please review the latest report"     │
├────────────────────────────────────────────┤
│            View All Notifications →        │ ← Footer
└────────────────────────────────────────────┘

Width: 380px
Max-Height: 480px
Position: Dropdown below bell
```

### Dependencies

**Technical Dependencies**:
- Radix UI DropdownMenu for dropdown functionality
- React hooks (useState, useEffect, useCallback)
- Tailwind CSS for styling
- Date formatting library (date-fns or dayjs)

**State Dependencies**:
- Notifications array from global state
- Real-time notification updates
- Mark as read functionality

**Component Dependencies**:
- NotificationBell trigger (Task 38)
- NotificationItem component (Task 40)
- Link component for "View All" navigation

### Instructions

1. **Create NotificationDropdown Component File**
   - Create file at `frontend/components/layout/Header/NotificationDropdown.tsx`
   - Set up functional component with TypeScript
   - Define props interface for notifications data
   - Import necessary dependencies

2. **Set Up Radix DropdownMenu Structure**
   - Import DropdownMenu components from Radix UI
   - Use DropdownMenu.Root as container
   - Use DropdownMenu.Content for dropdown panel
   - Configure align: "end" to align with bell icon
   - Set sideOffset: 8 for spacing from trigger

3. **Create Dropdown Container**
   - Set width: 380px (w-96)
   - Set max-height: 480px with overflow-y-auto
   - Apply background: bg-white
   - Add border: border border-gray-200
   - Apply border-radius: rounded-lg
   - Add shadow: shadow-xl for depth
   - Set padding: 0 (individual sections will have padding)

4. **Implement Dropdown Header**
   - Create header section with flex layout
   - Add title: "Notifications" (text-lg font-semibold)
   - Add "Mark All as Read" button on right side
   - Apply padding: p-4
   - Add bottom border: border-b border-gray-200
   - Style button: text-sm text-blue-600 hover:text-blue-700

5. **Connect to Notifications State**
   - Import notifications state hook or context
   - Fetch recent notifications (last 10-20)
   - Sort notifications by timestamp (newest first)
   - Filter out dismissed notifications if applicable
   - Set up listener for real-time updates

6. **Implement Notifications List**
   - Create scrollable container for notification items
   - Map through notifications array
   - Render NotificationItem component for each notification
   - Pass notification data as props to each item
   - Apply divide-y divider between items
   - Limit visible items to reasonable number

7. **Handle Empty State**
   - Check if notifications array is empty
   - Display empty state message when no notifications
   - Show icon (checkmark or bell with slash)
   - Display text: "No new notifications"
   - Apply padding and centering: p-8 text-center
   - Use muted text color: text-gray-500

8. **Implement Mark All as Read**
   - Create handler function for "Mark All as Read" button
   - Call API endpoint or state action to mark all as read
   - Update local state immediately for optimistic UI
   - Show loading state or disabled state during API call
   - Handle errors gracefully with error message

9. **Create Dropdown Footer**
   - Create footer section at bottom of dropdown
   - Add "View All Notifications" link
   - Apply padding: p-4
   - Add top border: border-t border-gray-200
   - Center link text: text-center
   - Style link: text-sm text-blue-600 hover:text-blue-700
   - Add arrow or chevron icon: →

10. **Implement Navigation to Full Page**
    - Import Next.js Link component
    - Wrap "View All" text in Link component
    - Set href to notifications page route
    - Close dropdown after navigation
    - Handle click event properly

11. **Add Loading State**
    - Create loading state for initial fetch
    - Display skeleton loaders or spinner
    - Match skeleton structure to notification items
    - Show 3-5 skeleton items
    - Transition smoothly from loading to loaded

12. **Implement Scroll Behavior**
    - Ensure smooth scrolling within container
    - Add custom scrollbar styling if desired
    - Test scroll performance with many notifications
    - Consider virtual scrolling for large lists
    - Ensure scroll position resets when reopened

13. **Add Animations**
    - Use Radix DropdownMenu built-in animations
    - Configure animation duration and easing
    - Test enter and exit animations
    - Ensure animations are smooth and performant
    - Consider reduced motion preferences

14. **Handle Dropdown Interactions**
    - Implement click outside to close dropdown
    - Handle Escape key to close dropdown
    - Prevent dropdown from closing when interacting with items
    - Test keyboard navigation within dropdown
    - Ensure focus management is correct

### Expected Outcome

A fully functional notifications dropdown that:
- Displays recent notifications in organized list
- Shows notification details with icons and timestamps
- Provides "Mark All as Read" quick action
- Links to full notifications page
- Updates in real-time as notifications arrive
- Handles empty state gracefully
- Scrolls smoothly for long lists
- Closes appropriately on outside click or Escape

### Verification Checklist

- [ ] Dropdown appears below notification bell when clicked
- [ ] Dropdown width is 380px
- [ ] Dropdown has max-height with scrollable content
- [ ] Header displays "Notifications" title
- [ ] "Mark All as Read" button is functional
- [ ] Notifications list displays recent notifications
- [ ] Each notification shows icon, title, message, and timestamp
- [ ] Unread notifications have distinct visual styling
- [ ] Empty state displays when no notifications exist
- [ ] Footer displays "View All Notifications" link
- [ ] Clicking "View All" navigates to notifications page
- [ ] Dropdown closes when clicking outside
- [ ] Escape key closes dropdown
- [ ] Animations are smooth for open/close
- [ ] Scrolling works properly with many notifications
- [ ] Real-time updates add new notifications
- [ ] Loading state displays during initial fetch
- [ ] Mark all as read updates all notifications
- [ ] Keyboard navigation works within dropdown
- [ ] Focus is trapped within dropdown when open

---

## Task 40: Create Notification Item

### Overview

Implement the individual notification item component that displays a single notification within the dropdown or notifications page. Each item shows the notification type icon, title, message, timestamp, and read/unread status.

### Notification Item Design

```
Unread Notification:
┌────────────────────────────────────────────┐
│ [i] System Update Available          2m   │ ← Icon, Title, Time
│     Click to view update details          │ ← Message
│ [•]                                        │ ← Unread indicator
└────────────────────────────────────────────┘
Background: bg-blue-50 (light blue tint)

Read Notification:
┌────────────────────────────────────────────┐
│ [✓] Order #12345 Completed          15m  │
│     Customer: John Doe                     │
└────────────────────────────────────────────┘
Background: bg-white

Notification Types:
- Info:    [i]  Blue icon
- Success: [✓]  Green icon
- Warning: [⚠]  Yellow/Orange icon
- Error:   [✕]  Red icon
```

### Dependencies

**Technical Dependencies**:
- React hooks (useCallback)
- Icon library with multiple icon types
- Tailwind CSS for styling
- Date formatting library (date-fns or dayjs)

**State Dependencies**:
- Individual notification object data
- Mark as read function from parent or context

**Component Dependencies**:
- Parent NotificationDropdown (Task 39)
- Optional: Link component if notification is clickable

### Instructions

1. **Create NotificationItem Component File**
   - Create file at `frontend/components/layout/Header/NotificationItem.tsx`
   - Set up functional component with TypeScript
   - Define props interface for notification data
   - Define notification data structure

2. **Define Notification Type Interface**
   - Create TypeScript interface for notification object:
     - id: string (unique identifier)
     - type: 'info' | 'success' | 'warning' | 'error'
     - title: string (notification title)
     - message: string (notification message)
     - timestamp: Date or string (when notification was created)
     - isRead: boolean (read status)
     - actionUrl: string (optional link to related page)
   - Export interface for use in other components

3. **Create Item Container**
   - Create clickable container (button or div)
   - Apply padding: p-4
   - Set width: full
   - Add transition: transition-colors duration-200
   - Enable hover state: hover:bg-gray-50
   - Set cursor: cursor-pointer when clickable

4. **Implement Conditional Background**
   - Apply light background tint for unread notifications
   - Use conditional class based on isRead prop
   - Unread: bg-blue-50 (light blue)
   - Read: bg-white
   - Ensure color contrast meets accessibility standards

5. **Create Notification Icon**
   - Create icon container on left side
   - Use flex layout with items-start for top alignment
   - Apply margin-right: mr-3 for spacing
   - Select icon based on notification type:
     - Info: Info icon or circle-i
     - Success: Check icon or checkmark
     - Warning: Alert triangle or exclamation
     - Error: X-circle or error icon
   - Apply color based on type:
     - Info: text-blue-500
     - Success: text-green-500
     - Warning: text-yellow-500 or text-orange-500
     - Error: text-red-500
   - Set icon size: w-5 h-5 (20x20px)

6. **Implement Content Layout**
   - Create flex container for content area
   - Set flex: 1 to fill available space
   - Use vertical flex direction: flex-col
   - Add gap: gap-1 between title and message

7. **Create Title Section**
   - Create flex container for title row
   - Display notification title on left
   - Display timestamp on right
   - Apply font weight: font-medium for title
   - Use text size: text-sm
   - Apply color: text-gray-900 for title
   - Add font-semibold if unread

8. **Format and Display Timestamp**
   - Use date formatting library (date-fns or dayjs)
   - Format relative time: "2m", "15m", "1h", "2d"
   - For times < 1 minute: show "Just now"
   - For times < 60 minutes: show minutes "15m"
   - For times < 24 hours: show hours "2h"
   - For times ≥ 24 hours: show days "2d"
   - Apply text size: text-xs
   - Apply color: text-gray-500
   - Ensure timestamp updates periodically

9. **Display Notification Message**
   - Display message text below title
   - Apply text size: text-sm
   - Apply color: text-gray-600
   - Truncate long messages: line-clamp-2
   - Add ellipsis for overflow

10. **Add Unread Indicator**
    - Create small dot indicator for unread notifications
    - Position at left edge or near icon
    - Use absolute positioning if needed
    - Apply size: w-2 h-2
    - Apply background: bg-blue-500
    - Apply border-radius: rounded-full
    - Show only when isRead is false

11. **Implement Click Handler**
    - Create onClick handler function
    - Mark notification as read when clicked (Task 41)
    - Navigate to actionUrl if provided
    - Close dropdown after action
    - Handle both read/unread notifications

12. **Add Accessibility Features**
    - Add role="button" if using div as container
    - Add tabIndex={0} for keyboard accessibility
    - Add aria-label with full notification context
    - Include "unread" in aria-label if applicable
    - Add focus visible state: focus:ring-2 focus:ring-blue-500
    - Ensure sufficient color contrast

13. **Handle Long Content**
    - Implement text truncation for long titles
    - Implement line clamping for long messages
    - Add title attribute with full text on hover
    - Consider tooltip for truncated content
    - Ensure component height remains consistent

14. **Test Different Notification Types**
    - Create sample notifications of each type
    - Verify correct icon and color for each type
    - Test with various message lengths
    - Test with different timestamps
    - Ensure layout remains consistent

### Expected Outcome

A reusable notification item component that:
- Displays notification with appropriate icon and color
- Shows title, message, and relative timestamp
- Differentiates visually between read and unread states
- Provides smooth hover and focus states
- Handles click events to mark as read and navigate
- Truncates long content appropriately
- Maintains consistent layout and spacing
- Meets accessibility standards

### Verification Checklist

- [ ] Component renders with all required props
- [ ] Correct icon displays for each notification type
- [ ] Icon color matches notification type (blue/green/yellow/red)
- [ ] Title displays with correct styling
- [ ] Message displays below title with correct styling
- [ ] Timestamp displays in relative format (2m, 15m, 1h, etc.)
- [ ] Unread notifications have light blue background
- [ ] Read notifications have white background
- [ ] Unread indicator dot displays for unread notifications
- [ ] Unread indicator hidden for read notifications
- [ ] Hover state changes background color
- [ ] Focus state shows visible ring
- [ ] Clicking item marks notification as read
- [ ] Clicking item navigates to actionUrl if provided
- [ ] Long titles truncate with ellipsis
- [ ] Long messages truncate to 2 lines
- [ ] Component is keyboard accessible
- [ ] aria-label provides full context
- [ ] Component maintains consistent height
- [ ] Layout doesn't break with edge cases

---

## Task 41: Mark Notifications as Read

### Overview

Implement the functionality to mark notifications as read, both individually and in bulk. This includes updating the local state, making API calls to persist read status, and updating the UI to reflect changes.

### Mark as Read Flow

```
User Action Flow:
┌──────────────────────────────────────────────────────┐
│  User clicks notification item                       │
│          ↓                                           │
│  1. Update local state (optimistic update)          │
│          ↓                                           │
│  2. Update UI (remove blue background, hide badge)  │
│          ↓                                           │
│  3. Call API to persist read status                 │
│          ↓                                           │
│  4. Handle API response                             │
│     ├─ Success: Confirm state update                │
│     └─ Error: Revert state, show error message      │
│          ↓                                           │
│  5. Update unread count badge                       │
└──────────────────────────────────────────────────────┘

Mark All as Read Flow:
┌──────────────────────────────────────────────────────┐
│  User clicks "Mark All as Read" button               │
│          ↓                                           │
│  1. Update all notifications in state               │
│          ↓                                           │
│  2. Update UI (remove all backgrounds and badge)    │
│          ↓                                           │
│  3. Call API with notification IDs or "all" flag    │
│          ↓                                           │
│  4. Handle bulk update response                     │
└──────────────────────────────────────────────────────┘
```

### Dependencies

**Technical Dependencies**:
- React hooks (useCallback, useTransition)
- API client for HTTP requests
- State management (Context, Redux, or Zustand)

**API Dependencies**:
- PATCH /api/notifications/:id endpoint for single update
- PATCH /api/notifications/mark-all-read endpoint for bulk update
- API should return updated notification object(s)

**State Dependencies**:
- Notifications array in global state
- Unread count state
- Update functions for state management

### Instructions

1. **Define API Endpoints**
   - Review or define API endpoint for marking single notification as read
   - Endpoint: PATCH /api/notifications/:id/read
   - Request body: { isRead: true }
   - Response: Updated notification object
   - Review or define bulk endpoint: PATCH /api/notifications/mark-all-read
   - Response: Array of updated notification IDs

2. **Create Mark as Read Function**
   - Create utility function in notifications service or API client
   - Function signature: markNotificationAsRead(notificationId: string)
   - Implement HTTP request using fetch or axios
   - Set proper headers including authorization token
   - Handle response and return updated notification
   - Handle errors and throw appropriate exceptions

3. **Create Mark All as Read Function**
   - Create function: markAllNotificationsAsRead()
   - Implement HTTP request to bulk endpoint
   - Pass array of notification IDs or use "all" flag
   - Handle response with updated notifications
   - Handle errors appropriately

4. **Implement Optimistic Update**
   - Use useTransition hook for React 18 concurrent features (optional)
   - Update local state immediately before API call
   - Create function to update notification in state
   - Set isRead property to true
   - Update unread count by decrementing by 1
   - Ensure UI updates instantly for better UX

5. **Handle Individual Notification Click**
   - In NotificationItem component, create handleClick function
   - Call optimistic update function first
   - Call markNotificationAsRead API function
   - Use try-catch block for error handling
   - On success: No additional action needed (already updated)
   - On error: Revert state change and show error toast/message

6. **Handle Mark All as Read Button**
   - In NotificationDropdown component, create handleMarkAllAsRead
   - Show loading state on button during API call
   - Update all notification objects in state optimistically
   - Call markAllNotificationsAsRead API function
   - Set unread count to 0 immediately
   - On error: Revert all changes and show error message

7. **Update Unread Count Badge**
   - Ensure unread count recalculates after marking as read
   - Count should be derived from notifications array
   - Filter notifications where isRead === false
   - Use length of filtered array as count
   - Badge should update automatically when state changes

8. **Implement Error Handling**
   - Create error handling function for failed API calls
   - Implement rollback mechanism to revert state changes
   - Display user-friendly error message
   - Use toast notification or alert for error display
   - Log errors to console for debugging
   - Consider retry mechanism for network failures

9. **Add Success Feedback**
   - Optionally show success message after marking as read
   - Use subtle animation for visual feedback
   - Consider toast notification: "Notification marked as read"
   - For bulk action: "All notifications marked as read"
   - Keep feedback non-intrusive

10. **Implement State Management Integration**
    - If using Context API: Update context value
    - If using Redux: Dispatch action to update store
    - If using Zustand: Call store update function
    - Ensure state updates trigger re-renders
    - Verify all components consuming state update correctly

11. **Handle Edge Cases**
    - Handle marking already-read notification (no-op or skip)
    - Handle marking notification that doesn't exist
    - Handle network errors and timeouts
    - Handle concurrent mark operations
    - Prevent double-clicking issues with debouncing

12. **Add Loading States**
    - Show loading indicator during API call if needed
    - Disable button during mark all operation
    - Optionally show skeleton or dimmed state
    - Ensure loading states don't block interaction unnecessarily

13. **Implement Persistence**
    - Ensure read status persists across page refreshes
    - Verify API stores read status in database
    - Check that fetching notifications returns correct read status
    - Test with browser refresh and tab close/reopen

14. **Test Mark as Read Functionality**
    - Test marking single notification as read
    - Test marking all notifications as read
    - Test with no notifications (edge case)
    - Test with network disconnected (error case)
    - Test with multiple rapid clicks (race condition)
    - Verify unread badge updates correctly
    - Verify UI updates reflect read status

### Expected Outcome

A robust mark as read system that:
- Marks individual notifications as read on click
- Marks all notifications as read with single action
- Updates UI instantly with optimistic updates
- Persists read status to backend API
- Handles errors gracefully with rollback
- Updates unread count badge accurately
- Provides feedback for user actions
- Prevents race conditions and double-clicks

### Verification Checklist

- [ ] Clicking notification item marks it as read
- [ ] Notification background changes from blue to white
- [ ] Unread indicator dot disappears
- [ ] Unread count badge decrements by 1
- [ ] API call successfully updates backend
- [ ] "Mark All as Read" button marks all notifications
- [ ] All notification backgrounds change to white
- [ ] Unread count badge changes to 0 and hides
- [ ] Bulk API call successfully updates all notifications
- [ ] Optimistic updates happen instantly
- [ ] UI doesn't flash or flicker during updates
- [ ] Error handling reverts state on API failure
- [ ] Error message displays for failed operations
- [ ] Already-read notifications don't cause errors
- [ ] Double-clicking doesn't cause duplicate API calls
- [ ] Read status persists after page refresh
- [ ] Read status syncs across browser tabs (if applicable)
- [ ] Loading states display during long operations
- [ ] Success feedback shows for bulk actions
- [ ] State management updates propagate to all components

---

## Appendix: Component File Structure

Final file structure for Header components:

```
frontend/
└── components/
    └── layout/
        └── Header/
            ├── index.ts                    # Barrel export file
            ├── Header.tsx                  # Main header container (Task 33)
            ├── GlobalSearch.tsx            # Search input component (Task 36)
            ├── CommandPalette.tsx          # Command palette modal (Task 37)
            ├── NotificationBell.tsx        # Bell icon with badge (Task 38)
            ├── NotificationDropdown.tsx    # Dropdown panel (Task 39)
            └── NotificationItem.tsx        # Individual item (Task 40)
```

---

## Appendix: State Management Integration

Example state structure for notifications:

```
NotificationsState:
{
  notifications: Notification[],
  unreadCount: number,
  isLoading: boolean,
  error: string | null,
  lastFetched: Date | null
}

Notification:
{
  id: string,
  type: 'info' | 'success' | 'warning' | 'error',
  title: string,
  message: string,
  timestamp: Date,
  isRead: boolean,
  actionUrl?: string,
  metadata?: Record<string, any>
}

State Actions:
- fetchNotifications()
- addNotification(notification)
- markAsRead(notificationId)
- markAllAsRead()
- deleteNotification(notificationId)
- clearAllNotifications()
```

---

## Document Summary

This document covered the complete implementation of the Header component system, including:

1. **Header Component** (Task 33): Fixed navigation bar with responsive layout
2. **Mobile Menu Toggle** (Task 34): Hamburger menu for mobile navigation
3. **Header Logo** (Task 35): Responsive logo display
4. **Global Search Input** (Task 36): Search field with keyboard shortcut
5. **Search Functionality** (Task 37): Command palette with cmdk integration
6. **Notifications Bell** (Task 38): Bell icon with unread count badge
7. **Notifications Dropdown** (Task 39): Dropdown panel with notifications list
8. **Notification Item** (Task 40): Individual notification display component
9. **Mark as Read** (Task 41): Read status management and API integration

The Header serves as a critical part of the dashboard layout, providing users with quick access to search, notifications, and navigation features. All components work together to create a cohesive and efficient user experience.

---

**End of Document**
