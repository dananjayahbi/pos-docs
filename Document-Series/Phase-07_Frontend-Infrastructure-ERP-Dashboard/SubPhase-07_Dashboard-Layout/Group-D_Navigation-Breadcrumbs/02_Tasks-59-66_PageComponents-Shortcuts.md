# Tasks 59-66: Page Components & Keyboard Shortcuts

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout  
> **Group:** D - Navigation & Breadcrumbs  
> **Document:** 02 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-58_Breadcrumbs-PageHeader.md](01_Tasks-51-58_Breadcrumbs-PageHeader.md)
- **→ Next Group:** [../Group-E_Responsive-Design-Mobile](../Group-E_Responsive-Design-Mobile/)

---

## Document Overview

This document covers the implementation of reusable page components and a global keyboard shortcuts system. Page components provide consistent UI building blocks including page titles, action buttons, back navigation, tab navigation, and collapsible sections. The keyboard shortcuts system enables power users to navigate and perform actions quickly using keyboard combinations, with a discoverable help modal showing all available shortcuts. These components create a professional, efficient user experience across the ERP dashboard.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create Page Title Component | Low | 25 min |
| 60 | Create Page Actions Slot | Low | 25 min |
| 61 | Create Back Button Component | Low | 25 min |
| 62 | Create Tab Navigation Component | Medium | 40 min |
| 63 | Create Page Section Component | Medium | 35 min |
| 64 | Create Keyboard Shortcuts System | High | 50 min |
| 65 | Create Shortcuts Help Modal | Medium | 40 min |
| 66 | Test Navigation Components | High | 45 min |

---

## Task 59: Create Page Title Component

### Overview
Create a PageTitle component that displays consistent page headings across the application. The component renders an h1 heading with proper semantic markup, supports an optional subtitle or description text, and includes responsive text sizing for different screen sizes. This component standardizes page headers and ensures proper document structure with exactly one h1 per page.

### Dependencies
- SubPhase-02: Tailwind Design System (typography utilities)
- SubPhase-03: Component Library Setup (base components)

### Instructions

1. **Create Page component directory structure**
   - Navigate to `frontend/components/layout/` directory
   - Create new directory named `Page`
   - This directory will contain all page-level components
   - Keeps page composition components organized together

2. **Create PageTitle component file**
   - Create `PageTitle.tsx` in the Page directory
   - This component renders semantic page headings
   - Uses TypeScript for type safety

3. **Define component props interface**
   - Create PageTitleProps interface
   - Include required title prop as string
   - Include optional description prop as string or ReactNode
   - Add optional className for style customization
   - Add optional actions prop for right-aligned actions

4. **Create component structure**
   - Use div as outer container with flex layout
   - First child is div containing title and description
   - Second child is actions container (if provided)
   - Enables title on left, actions on right layout

5. **Implement title rendering**
   - Render h1 element with title text
   - Apply text-3xl on mobile, text-4xl on desktop
   - Use font-bold for emphasis
   - Apply tracking-tight for improved readability
   - Use text-foreground for primary text color

6. **Implement description rendering**
   - Check if description prop is provided
   - Render description in paragraph element below title
   - Apply text-muted-foreground for subtle appearance
   - Use text-base or text-lg for appropriate sizing
   - Add margin-top for spacing from title

7. **Apply responsive layout**
   - Use flex-col on mobile for vertical stacking
   - Switch to flex-row on md breakpoint for horizontal layout
   - Use items-start for top alignment
   - Use justify-between to push actions to right
   - Add gap for spacing between elements

8. **Handle actions slot**
   - Render actions prop in separate div if provided
   - Apply flex and gap for multiple actions
   - Use items-center for vertical centering
   - Ensure actions stay right-aligned on all screens

### PageTitle Layout Structure

```
┌───────────────────────────────────────────────────────────────┐
│ Desktop Layout (≥768px)                                        │
│                                                                │
│  ┌─────────────────────────────────────┐  ┌────────────────┐ │
│  │ Product Management                  │  │ [Add Product]  │ │
│  │ Manage your product catalog         │  │ [Export]       │ │
│  └─────────────────────────────────────┘  └────────────────┘ │
│   Title + Description (Left)               Actions (Right)    │
└───────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐
│ Mobile Layout (<768px)      │
│                             │
│  Product Management         │
│  Manage your product        │
│  catalog and inventory      │
│                             │
│  ┌──────────┐ ┌─────────┐  │
│  │ [Add]    │ │ [Export]│  │
│  └──────────┘ └─────────┘  │
│                             │
│  Title, Description, Actions│
│  stacked vertically         │
└─────────────────────────────┘
```

### Expected Outcome
- PageTitle component created in components/layout/Page directory
- Component accepts title, description, actions, and className props
- Renders semantic h1 element with proper styling
- Displays optional description with muted styling
- Supports right-aligned actions slot for buttons
- Implements responsive layout for mobile and desktop
- Component is reusable across all pages requiring titles

### Verification Checklist
- [ ] PageTitle component file created
- [ ] TypeScript interface defines all props
- [ ] Component renders h1 with proper semantics
- [ ] Title uses responsive text sizing (3xl/4xl)
- [ ] Description renders when provided
- [ ] Actions slot renders in correct position
- [ ] Responsive layout works on mobile and desktop
- [ ] Component is exported for use in pages

---

## Task 60: Create Page Actions Slot

### Overview
Create a PageActions component that provides a consistent container for page-level action buttons. The component uses flex layout to arrange buttons horizontally, aligns them to the right, emphasizes primary actions with appropriate button variants, and handles responsive behavior for mobile screens. This component standardizes the placement and styling of action buttons across all pages.

### Dependencies
- SubPhase-03: Component Library Setup (Button component)
- Task 59: Create Page Title Component (often used together)

### Instructions

1. **Create PageActions component file**
   - Create `PageActions.tsx` in components/layout/Page directory
   - This component wraps action buttons
   - Provides consistent spacing and alignment

2. **Define component props interface**
   - Create PageActionsProps interface
   - Include children prop as ReactNode
   - Add optional className for customization
   - Add optional align prop (left, right, center) defaulting to right

3. **Create flex container structure**
   - Use div element as container
   - Apply flex display with gap-2 or gap-3
   - Use flex-wrap for responsive wrapping on narrow screens
   - Add items-center for vertical alignment

4. **Implement alignment logic**
   - Use justify-end for right alignment (default)
   - Use justify-start for left alignment
   - Use justify-center for center alignment
   - Apply based on align prop value

5. **Add responsive behavior**
   - Use flex-col on mobile to stack buttons vertically
   - Switch to flex-row on sm or md breakpoint
   - Ensure buttons remain accessible on small screens
   - Consider full-width buttons on mobile if appropriate

6. **Handle button order and hierarchy**
   - Primary action should be visually emphasized
   - Most important action placed last in flex order
   - Use button variant (default, outline, ghost) to show hierarchy
   - Secondary actions use outline or ghost variants

7. **Apply consistent spacing**
   - Use gap-2 for compact spacing between buttons
   - Add padding if needed for visual breathing room
   - Ensure spacing is consistent across all pages

8. **Create usage documentation**
   - Document expected button order (secondary first, primary last)
   - Provide examples of variant usage
   - Explain responsive behavior for different screen sizes

### PageActions Layout Pattern

```
Desktop Layout (Actions Right-Aligned):
┌────────────────────────────────────────────────────────────┐
│                                                             │
│                         [Secondary] [Outline] [Primary]    │
│                          Ghost       Outline   Default     │
└────────────────────────────────────────────────────────────┘
    Less Important ────────────────────────────> Primary Action

Mobile Layout (Stacked or Scrollable):
┌───────────────────────┐      ┌───────────────────────┐
│                       │      │                       │
│   [Export]            │  or  │ [Exp] [Del] [Primary] │
│   [Delete]            │      │  ← Horizontal scroll  │
│   [Create Product]    │      │                       │
│                       │      │                       │
└───────────────────────┘      └───────────────────────┘
   Vertical Stack              Horizontal Scroll
```

### Expected Outcome
- PageActions component created in components/layout/Page directory
- Component provides flex container for action buttons
- Right-aligns actions by default with optional left/center
- Implements responsive layout for mobile devices
- Maintains visual hierarchy with button variants
- Consistent spacing between multiple buttons
- Component is reusable across all pages

### Verification Checklist
- [ ] PageActions component file created
- [ ] Props interface includes children and align
- [ ] Flex container with gap spacing implemented
- [ ] Right alignment works correctly by default
- [ ] Left and center alignment options work
- [ ] Responsive behavior tested on mobile
- [ ] Button hierarchy is visually clear
- [ ] Component exported and documented

---

## Task 61: Create Back Button Component

### Overview
Create a BackButton component that provides consistent navigation back to previous pages or parent routes. The component uses Next.js router for programmatic navigation, displays a left-pointing chevron icon with "Back" text, supports both automatic back navigation and explicit href routing, and includes hover and focus states for accessibility. This component provides a familiar navigation pattern found in most applications.

### Dependencies
- SubPhase-01: Next.js Project Setup (useRouter hook)
- SubPhase-03: Component Library Setup (Button, ChevronLeft icon)

### Instructions

1. **Create BackButton component file**
   - Create `BackButton.tsx` in components/layout/Page directory
   - This component handles backward navigation
   - Uses Next.js router or Link component

2. **Define component props interface**
   - Create BackButtonProps interface
   - Include optional href prop for explicit navigation target
   - Include optional onClick prop for custom behavior
   - Add optional label prop defaulting to "Back"
   - Add optional variant prop for button styling
   - Add optional className for customization

3. **Import required dependencies**
   - Import useRouter from next/navigation
   - Import ChevronLeft icon from lucide-react or icon library
   - Import Button component from shadcn/ui
   - Import Link from next/link if using href prop

4. **Implement navigation logic**
   - If href prop provided, use Link component for navigation
   - If no href, use router.back() for browser history navigation
   - If onClick provided, call it before navigation
   - Combine onClick with navigation when both exist

5. **Create button structure**
   - Render Button component with variant prop (default to ghost)
   - Add ChevronLeft icon as first child
   - Render label text after icon
   - Apply size prop for compact button (size="sm")

6. **Style the button**
   - Use ghost variant for subtle appearance
   - Apply hover:bg-accent for visual feedback
   - Use text-muted-foreground for subtle text color
   - Add transition for smooth hover effect
   - Icon should have slight margin-right from text

7. **Handle keyboard accessibility**
   - Button component handles Enter and Space keys automatically
   - Ensure proper focus visible styling
   - Tab order should be logical in page flow

8. **Add loading state consideration**
   - Consider disabled state during navigation
   - Optional loading indicator for async operations
   - Prevent double-clicks with proper state management

### BackButton Visual States

```
Normal State:
┌──────────────┐
│ ← Back       │  ← ChevronLeft icon + Text
└──────────────┘
   Ghost variant, muted text

Hover State:
┌──────────────┐
│ ← Back       │  ← Background highlight
└──────────────┘
   bg-accent applied

Focus State:
┌──────────────┐
│ ← Back       │  ← Focus ring visible
└──────────────┘
   Keyboard focus outline

Disabled State:
┌──────────────┐
│ ← Back       │  ← Grayed out, not interactive
└──────────────┘
   opacity-50, cursor-not-allowed
```

### BackButton Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User Interaction                                             │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
       ┌────────────────────┐
       │ BackButton Clicked │
       └────────┬───────────┘
                │
                ├──── href provided? ───► Navigate to specific route
                │                         (using Next.js Link)
                │
                └──── No href? ─────────► router.back()
                                          (browser history back)
```

### Expected Outcome
- BackButton component created in components/layout/Page directory
- Component supports both router.back() and explicit href navigation
- Renders ChevronLeft icon with "Back" label
- Uses ghost button variant for subtle appearance
- Implements hover and focus states for accessibility
- Handles onClick for custom behavior when needed
- Component is reusable across all pages requiring back navigation

### Verification Checklist
- [ ] BackButton component file created
- [ ] Props interface includes href, onClick, label, variant
- [ ] router.back() works when no href provided
- [ ] Link navigation works when href provided
- [ ] ChevronLeft icon renders before label
- [ ] Ghost variant styling applied correctly
- [ ] Hover and focus states work properly
- [ ] Component is accessible via keyboard
- [ ] Custom onClick handlers execute correctly
- [ ] Component exported and documented

---

## Task 62: Create Tab Navigation Component

### Overview
Create a TabNavigation component that provides page-level tab switching functionality. The component renders horizontal tabs with active state highlighting, supports keyboard navigation with arrow keys, uses Next.js routing for tab switching, and implements responsive behavior for mobile devices. Tabs enable organizing related content into separate views while maintaining context within the same page.

### Dependencies
- SubPhase-01: Next.js Project Setup (usePathname, Link)
- SubPhase-03: Component Library Setup (Tabs components)

### Instructions

1. **Create TabNavigation component file**
   - Create `TabNavigation.tsx` in components/layout/Page directory
   - This component handles page-level tab navigation
   - Uses Next.js routing for tab state persistence

2. **Define tab item interface**
   - Create TabItem interface
   - Include label as string for tab text
   - Include value as string for tab identifier
   - Include href as string for tab route
   - Include optional icon prop for tab icons
   - Include optional badge prop for notification counts

3. **Define component props interface**
   - Create TabNavigationProps interface
   - Include tabs array of TabItem objects
   - Include optional defaultValue for initial tab
   - Add optional className for customization
   - Add optional onTabChange callback function

4. **Import required dependencies**
   - Import usePathname and useRouter from next/navigation
   - Import Link from next/link
   - Import Tabs, TabsList, TabsTrigger from shadcn/ui
   - Import useMemo for active tab calculation

5. **Determine active tab from route**
   - Use usePathname hook to get current route
   - Match pathname against tab hrefs
   - Set active tab based on matching href
   - Default to first tab if no match found
   - Use useMemo to optimize calculation

6. **Create tabs structure**
   - Render Tabs component with value set to active tab
   - Render TabsList as horizontal container
   - Map through tabs array to render TabsTrigger for each
   - Wrap each TabsTrigger in Link component for navigation

7. **Implement tab trigger rendering**
   - Render icon if provided before label
   - Render label text
   - Render badge if provided after label
   - Apply data-state attribute for active styling
   - Use asChild prop on TabsTrigger with Link

8. **Style active tab state**
   - Active tab has border-bottom or background highlight
   - Use data-state="active" for CSS targeting
   - Apply color change for active text
   - Use animation for smooth state transitions

9. **Add keyboard navigation**
   - Tabs components handle arrow key navigation automatically
   - Left/Right arrows move between tabs
   - Enter/Space activates tab and triggers navigation
   - Home/End keys jump to first/last tab

10. **Implement responsive behavior**
    - Use horizontal scroll on mobile if many tabs
    - Consider dropdown menu for tab overflow on mobile
    - Reduce tab padding on small screens
    - Ensure touch targets are 44x44px minimum

11. **Handle tab change events**
    - Call onTabChange callback when tab switches
    - Pass new tab value to callback
    - Allow parent component to react to changes

### TabNavigation Layout Structure

```
Desktop Layout:
┌────────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│ │ Details │ │Variants │ │ Pricing │ │Inventory│          │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│     │           │           │           │                  │
│     └───────────┴───────────┴───────────┘                  │
│ ────────────────────────────────────────────────────────── │
│ Active tab has border or background highlight              │
└────────────────────────────────────────────────────────────┘

Mobile Layout (Scrollable):
┌──────────────────────────────┐
│ ┌──────┐┌──────┐┌──────┐┌───►│
│ │Detail││Varian││Pricin││    │
│ └──────┘└──────┘└──────┘└    │
│ ◄─── Horizontal Scroll ────► │
└──────────────────────────────┘

Tab with Badge:
┌─────────────────┐
│ Notifications 3 │  ← Badge shows count
└─────────────────┘

Tab with Icon:
┌─────────────────┐
│ 📦 Inventory    │  ← Icon before label
└─────────────────┘
```

### Tab State Management Flow

```
┌──────────────────────────────────────────────────────────┐
│ Component Mount                                           │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │ usePathname()      │ ──► Current route: /products/123/variants
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ Match href paths   │ ──► Find tab with matching href
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ Set active tab     │ ──► value="variants"
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ User clicks new tab│
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ Link navigates     │ ──► Navigate to new href
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ Route changes      │ ──► usePathname updates
    └────────┬───────────┘
             │
             └──► Cycle repeats
```

### Expected Outcome
- TabNavigation component created in components/layout/Page directory
- Component accepts array of tabs with labels, values, and hrefs
- Determines active tab from current route automatically
- Renders horizontal tabs with active state highlighting
- Supports icons and badges on tabs
- Implements keyboard navigation with arrow keys
- Uses Next.js Link for tab navigation
- Responsive layout with horizontal scroll on mobile
- Component is reusable for any page requiring tabs

### Verification Checklist
- [ ] TabNavigation component file created
- [ ] TabItem interface defines tab structure
- [ ] Component determines active tab from pathname
- [ ] Tabs render correctly with labels
- [ ] Active tab styling shows correctly
- [ ] Icons render when provided
- [ ] Badges render when provided
- [ ] Link navigation works on tab click
- [ ] Keyboard arrow navigation works
- [ ] Responsive layout tested on mobile
- [ ] onTabChange callback fires correctly
- [ ] Component exported and documented

---

## Task 63: Create Page Section Component

### Overview
Create a PageSection component that provides consistent content sections within pages. The component renders sections with optional headers, supports collapsible sections with expand/collapse animation, includes an optional actions slot in the section header, and maintains consistent spacing and borders between sections. This component standardizes content organization across all pages.

### Dependencies
- SubPhase-02: Tailwind Design System (spacing, borders)
- SubPhase-03: Component Library Setup (Collapsible components)

### Instructions

1. **Create PageSection component file**
   - Create `PageSection.tsx` in components/layout/Page directory
   - This component wraps page content sections
   - Provides consistent section structure

2. **Define component props interface**
   - Create PageSectionProps interface
   - Include optional title as string for section header
   - Include optional description as string for subheading
   - Include children as ReactNode for section content
   - Include optional actions as ReactNode for header actions
   - Include optional collapsible as boolean
   - Include optional defaultExpanded as boolean (default true)
   - Add optional className for customization

3. **Create section container structure**
   - Use section HTML element as semantic container
   - Apply border-b for separation between sections
   - Add py-6 or py-8 for vertical padding
   - Use first:pt-0 and last:border-b-0 for edge sections

4. **Implement section header**
   - Render header only if title is provided
   - Use div with flex layout for title and actions
   - Apply justify-between to space title and actions
   - Use items-center for vertical alignment

5. **Render section title**
   - Use h2 element for section titles
   - Apply text-xl or text-2xl for appropriate sizing
   - Use font-semibold for emphasis
   - Apply text-foreground for color

6. **Render optional description**
   - Display description below title if provided
   - Use text-sm or text-base for sizing
   - Apply text-muted-foreground for subtle appearance
   - Add margin-top for spacing from title

7. **Implement actions slot in header**
   - Render actions prop in separate div if provided
   - Apply flex and gap for multiple actions
   - Use items-center for alignment
   - Keep actions right-aligned with ml-auto

8. **Create collapsible functionality**
   - Import Collapsible, CollapsibleTrigger, CollapsibleContent from shadcn/ui
   - Wrap content in Collapsible when collapsible prop is true
   - Add ChevronDown icon to header when collapsible
   - Rotate icon 180deg when expanded
   - Use smooth animation for expand/collapse

9. **Implement content container**
   - Render children in div below header
   - Add mt-4 or mt-6 for spacing from header
   - No additional styling by default (let children control layout)
   - Wrap in CollapsibleContent if collapsible

10. **Handle expanded state**
    - Use useState to track expanded state if collapsible
    - Initialize with defaultExpanded prop value
    - Toggle state on header click when collapsible
    - Apply appropriate ARIA attributes for accessibility

### PageSection Layout Structure

```
Standard Section:
┌────────────────────────────────────────────────────────────┐
│ Section Title                              [Action Button] │  ← Header
│ Optional description text                                  │
│ ────────────────────────────────────────────────────────   │
│                                                             │
│ Section content goes here...                               │  ← Content
│ Can be any components or HTML                              │
│                                                             │
└────────────────────────────────────────────────────────────┘
│                                                              ← Border bottom
                                                                 (separator)

Collapsible Section (Expanded):
┌────────────────────────────────────────────────────────────┐
│ ▼ Advanced Options                         [Reset Button] │  ← Chevron down
│ ────────────────────────────────────────────────────────   │
│                                                             │
│ Collapsible content visible...                             │
│                                                             │
└────────────────────────────────────────────────────────────┘

Collapsible Section (Collapsed):
┌────────────────────────────────────────────────────────────┐
│ ► Advanced Options                         [Reset Button] │  ← Chevron right
└────────────────────────────────────────────────────────────┘
   Content hidden
```

### PageSection Component Hierarchy

```
<PageSection>
  │
  ├── <section> (container)
  │     │
  │     ├── {collapsible ? <Collapsible> : <Fragment>}
  │     │     │
  │     │     ├── <CollapsibleTrigger> (if collapsible)
  │     │     │     └── Header (title, description, icon, actions)
  │     │     │
  │     │     ├── <CollapsibleContent> (if collapsible)
  │     │     │     └── Content (children)
  │     │     │
  │     │     └── {!collapsible && children}
  │     │
  │     └── </section>
  │
  └── Props: title, description, actions, collapsible, defaultExpanded
```

### Expected Outcome
- PageSection component created in components/layout/Page directory
- Component provides consistent section structure with header
- Renders optional title, description, and actions in header
- Supports collapsible functionality with smooth animation
- Implements proper spacing and borders between sections
- Uses semantic HTML with section and h2 elements
- Handles both expanded and collapsed states correctly
- Component is reusable across all pages requiring sections

### Verification Checklist
- [ ] PageSection component file created
- [ ] Props interface includes all required options
- [ ] Section container uses semantic section element
- [ ] Header renders with title and actions
- [ ] Description displays below title when provided
- [ ] Collapsible functionality works correctly
- [ ] Chevron icon rotates on expand/collapse
- [ ] Animation is smooth and performant
- [ ] Spacing and borders look consistent
- [ ] ARIA attributes applied for accessibility
- [ ] Component exported and documented

---

## Task 64: Create Keyboard Shortcuts System

### Overview
Create a global keyboard shortcuts system that enables power users to navigate and perform actions quickly using keyboard combinations. The system listens for keyboard events globally, handles common shortcuts like Cmd/Ctrl+K for search and Cmd/Ctrl+B for sidebar toggle, supports shortcut registration from any component, prevents conflicts with browser shortcuts, and provides a consistent API for defining and using shortcuts throughout the application.

### Dependencies
- SubPhase-01: Next.js Project Setup (React hooks)
- SubPhase-05: State Management (global state for shortcuts)

### Instructions

1. **Create hooks directory if needed**
   - Navigate to `frontend/hooks/` directory
   - Create directory if it doesn't exist
   - This organizes custom hooks separately

2. **Create keyboard shortcuts hook file**
   - Create `useKeyboardShortcuts.ts` in hooks directory
   - This hook manages global keyboard listeners
   - Provides API for registering shortcuts

3. **Define shortcut types and interfaces**
   - Create KeyboardShortcut interface with:
     - key: string (e.g., "k", "b", "/")
     - metaKey: boolean (Cmd on Mac, Ctrl on Windows)
     - ctrlKey: boolean
     - shiftKey: boolean
     - altKey: boolean
     - description: string (for help modal)
     - action: function to execute
     - category: string (for grouping in help modal)
   - Create ShortcutCategory type for grouping

4. **Create shortcuts registry**
   - Define object or Map to store registered shortcuts
   - Key is combination string like "meta+k" or "ctrl+shift+p"
   - Value is ShortcutHandler with action and metadata
   - Allow registration and deregistration of shortcuts

5. **Implement keyboard event listener**
   - Add event listener for keydown on window/document
   - Listen for keyboard events globally
   - Parse event to determine key combination pressed
   - Match combination against registered shortcuts
   - Execute matching shortcut's action function

6. **Handle modifier keys properly**
   - Detect metaKey (Cmd on Mac, Windows key on Windows)
   - Treat Cmd on Mac and Ctrl on Windows as equivalent
   - Use navigator.platform or navigator.userAgent to detect OS
   - Normalize modifiers for cross-platform compatibility

7. **Implement shortcut normalization**
   - Create function to normalize key combinations
   - Convert to lowercase for consistency
   - Sort modifiers in consistent order (meta, ctrl, shift, alt, key)
   - Handle key aliases (e.g., "Escape" vs "Esc")

8. **Prevent default browser behavior**
   - Call event.preventDefault() for matched shortcuts
   - Prevents browser actions like Ctrl+S (save page)
   - Only prevent default if shortcut is registered
   - Allow unregistered shortcuts to work normally

9. **Handle context-aware shortcuts**
   - Check if user is typing in input, textarea, or contenteditable
   - Skip certain shortcuts when user is in form fields
   - Allow escape key and navigation shortcuts even in inputs
   - Provide option to override this behavior per shortcut

10. **Create hook API**
    - Export useKeyboardShortcuts hook
    - Accept shortcuts array or object as parameter
    - Register shortcuts on component mount
    - Unregister shortcuts on component unmount
    - Return object with methods like registerShortcut, unregisterShortcut

11. **Define global shortcuts**
    - Create globalShortcuts configuration object
    - Define common shortcuts used across application:
      - Cmd/Ctrl+K: Open search modal
      - Cmd/Ctrl+B: Toggle sidebar
      - Cmd/Ctrl+/: Open shortcuts help modal
      - G then D: Go to dashboard (sequence)
      - G then P: Go to products
      - ?: Open shortcuts help
    - Export for use in root layout or provider

12. **Implement shortcut sequences**
    - Support multi-key sequences like "g d" (Gmail-style)
    - Track sequence state with timeout
    - Clear sequence after 1-2 seconds of inactivity
    - Show sequence indicator if needed

13. **Handle disabled state**
    - Provide way to temporarily disable shortcuts
    - Useful for modals or special UI states
    - Store disabled state in context or global state

### Keyboard Shortcut System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│ Application Root                                              │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Shortcuts Provider                                      │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ Global Keyboard Event Listener                   │  │  │
│  │  │  - Listen on window.keydown                      │  │  │
│  │  │  - Parse key combination                         │  │  │
│  │  │  - Match against registry                        │  │  │
│  │  │  - Execute action or preventDefault              │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ Shortcuts Registry                               │  │  │
│  │  │  {                                                │  │  │
│  │  │    "meta+k": { action, description, category }   │  │  │
│  │  │    "meta+b": { action, description, category }   │  │  │
│  │  │    "meta+/": { action, description, category }   │  │  │
│  │  │    "?": { action, description, category }        │  │  │
│  │  │  }                                                │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Component A     │  │ Component B     │  │ Component C  │ │
│  │ registerShortcut│  │ registerShortcut│  │ shortcuts=[] │ │
│  │ (Page-specific) │  │ (Page-specific) │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Shortcut Processing Flow

```
User Presses Keys (Cmd+K)
         │
         ▼
┌────────────────────┐
│ Keydown Event      │
│ - key: "k"         │
│ - metaKey: true    │
│ - ctrlKey: false   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────────────┐
│ Normalize Combination      │
│ "k" + metaKey = "meta+k"   │
└─────────┬──────────────────┘
          │
          ▼
┌────────────────────────────┐
│ Check Input Context        │
│ Is user in form field?     │
└─────────┬──────────────────┘
          │
          ├── Yes ──► Skip (or allow if whitelisted)
          │
          └── No
              │
              ▼
┌────────────────────────────┐
│ Match Against Registry     │
│ Does "meta+k" exist?       │
└─────────┬──────────────────┘
          │
          ├── No ──► Allow default browser behavior
          │
          └── Yes
              │
              ▼
┌────────────────────────────┐
│ Prevent Default            │
│ event.preventDefault()     │
└─────────┬──────────────────┘
          │
          ▼
┌────────────────────────────┐
│ Execute Action             │
│ shortcut.action()          │
│ e.g., openSearchModal()    │
└────────────────────────────┘
```

### Global Shortcuts Definition

```
Navigation:
- Cmd/Ctrl + K         Open command palette / search
- Cmd/Ctrl + B         Toggle sidebar
- Cmd/Ctrl + /         Open shortcuts help modal
- G then D             Go to Dashboard
- G then P             Go to Products
- G then I             Go to Inventory
- G then O             Go to Orders

Actions:
- N                    New item (context-dependent)
- E                    Edit current item
- Delete               Delete current item (with confirmation)
- Cmd/Ctrl + S         Save current form
- Cmd/Ctrl + Enter     Submit current form
- Escape               Close modal / cancel action

Help:
- ?                    Show keyboard shortcuts help
```

### Expected Outcome
- useKeyboardShortcuts hook created in hooks directory
- Hook provides API for registering and unregistering shortcuts
- Global keyboard event listener captures key combinations
- Shortcuts registry stores all registered shortcuts
- Modifier keys handled correctly across Mac and Windows
- Context-aware shortcuts skip when user is typing in forms
- Prevents default browser behavior for registered shortcuts
- Supports both single key and key sequences
- Global shortcuts defined for common actions
- Shortcut system is performant and doesn't block UI

### Verification Checklist
- [ ] useKeyboardShortcuts hook file created
- [ ] KeyboardShortcut interface defines shortcut structure
- [ ] Shortcuts registry implemented
- [ ] Global keydown listener added
- [ ] Key combination normalization works
- [ ] Modifier keys detected correctly on Mac and Windows
- [ ] preventDefault called for registered shortcuts
- [ ] Context checking skips shortcuts in form fields
- [ ] registerShortcut and unregisterShortcut methods work
- [ ] Global shortcuts configuration defined
- [ ] Shortcut sequences supported (optional)
- [ ] No memory leaks from event listeners
- [ ] Hook exported and documented

---

## Task 65: Create Shortcuts Help Modal

### Overview
Create a ShortcutsModal component that displays all available keyboard shortcuts in an organized, searchable modal dialog. The component uses Radix Dialog for accessible modal behavior, groups shortcuts by category (Navigation, Actions, General), displays shortcuts with proper formatting showing modifier keys and key combinations, includes a search filter to find specific shortcuts, and shows OS-specific shortcuts (Cmd on Mac, Ctrl on Windows). This modal improves discoverability and helps users learn keyboard shortcuts.

### Dependencies
- SubPhase-03: Component Library Setup (Dialog, Input components)
- Task 64: Create Keyboard Shortcuts System (shortcuts data)

### Instructions

1. **Create ShortcutsModal component file**
   - Create `ShortcutsModal.tsx` in components/layout/Page directory
   - This component displays keyboard shortcuts help
   - Uses Radix Dialog for modal functionality

2. **Define component props interface**
   - Create ShortcutsModalProps interface
   - Include open as boolean for modal visibility
   - Include onOpenChange function to control open state
   - Add optional shortcuts prop to override default shortcuts

3. **Import required dependencies**
   - Import Dialog, DialogContent, DialogHeader, DialogTitle from shadcn/ui
   - Import Input component for search functionality
   - Import shortcuts registry from useKeyboardShortcuts hook
   - Import Command icon from lucide-react for visual display

4. **Create modal structure**
   - Use Dialog component with open and onOpenChange props
   - Render DialogContent with appropriate size (max-w-2xl)
   - Add DialogHeader with DialogTitle "Keyboard Shortcuts"
   - Include close button in dialog (usually automatic)

5. **Implement search functionality**
   - Add search input at top of modal
   - Use useState to track search query
   - Filter shortcuts based on query matching description or keys
   - Show "No shortcuts found" if no matches

6. **Group shortcuts by category**
   - Define categories: Navigation, Actions, Forms, General, Help
   - Group shortcuts array by category property
   - Use Object.groupBy or reduce to create groups
   - Sort categories in logical order

7. **Render shortcuts grouped by category**
   - Map through category groups
   - Render category heading (h3 or h4)
   - Render list of shortcuts in each category
   - Apply spacing between categories

8. **Create shortcut list item component**
   - For each shortcut, render:
     - Description text on left
     - Key combination badges on right
   - Use flex layout with justify-between
   - Apply hover background for interactive feel

9. **Display key combinations with proper formatting**
   - Render modifier keys as separate badges (⌘, Ctrl, Shift, Alt)
   - Use Command symbol (⌘) on Mac, "Ctrl" text on Windows
   - Detect OS using navigator.platform or userAgent
   - Render actual key (K, B, /) in separate badge
   - Use "+" or spacing between modifier badges

10. **Style keyboard key badges**
    - Use kbd HTML element for semantic meaning
    - Apply border and background for visual button appearance
    - Use monospace font for key text
    - Apply padding and rounded corners
    - Use muted colors for subtle appearance

11. **Add visual indicators for sequences**
    - For sequence shortcuts like "G then D"
    - Show "then" text between keys
    - Or use arrow symbol → between keys
    - Make it clear these are sequential presses

12. **Implement empty state**
    - Show message when search returns no results
    - Provide helpful text like "No shortcuts match your search"
    - Consider showing tip to clear search

13. **Add footer with tips**
    - Optional footer section with usage tips
    - Mention how to access help modal (? or Cmd+/)
    - Keep footer subtle and non-intrusive

### ShortcutsModal Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  Keyboard Shortcuts                                      [×]   │  ← Header
│ ────────────────────────────────────────────────────────────   │
│  🔍 [Search shortcuts...]                                      │  ← Search
│ ────────────────────────────────────────────────────────────   │
│                                                                │
│  Navigation                                                    │  ← Category
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Open search                              ⌘ K              │ │
│  │ Toggle sidebar                           ⌘ B              │ │
│  │ Go to Dashboard                          G then D         │ │
│  │ Go to Products                           G then P         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Actions                                                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Create new item                          N                │ │
│  │ Save form                                ⌘ S              │ │
│  │ Submit form                              ⌘ ↵              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  General                                                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Close modal                              Esc              │ │
│  │ Show this help                           ?                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│ ────────────────────────────────────────────────────────────   │
│  Press ? or ⌘ / to toggle this help anytime                   │  ← Footer
└────────────────────────────────────────────────────────────────┘
```

### Keyboard Key Badge Styles

```
┌─────────────────────────────────────────────────────────┐
│ Key Badge Examples:                                      │
│                                                          │
│ Modifier + Key:                                          │
│  ┌───┐   ┌───┐      ⌘ + K                              │
│  │ ⌘ │ + │ K │      (Rounded badges with border)        │
│  └───┘   └───┘                                          │
│                                                          │
│ Multiple Modifiers:                                      │
│  ┌───┐   ┌─────┐   ┌───┐                               │
│  │ ⌘ │ + │Shift│ + │ P │   ⌘ Shift P                   │
│  └───┘   └─────┘   └───┘                               │
│                                                          │
│ Sequence:                                                │
│  ┌───┐      ┌───┐                                       │
│  │ G │ then │ D │       G then D                        │
│  └───┘      └───┘                                       │
│                                                          │
│ Single Key:                                              │
│  ┌───┐                                                  │
│  │ ? │                                                   │
│  └───┘                                                  │
└─────────────────────────────────────────────────────────┘
```

### Shortcuts Data Structure

```
shortcuts = [
  {
    category: "Navigation",
    items: [
      { keys: ["meta", "k"], description: "Open search" },
      { keys: ["meta", "b"], description: "Toggle sidebar" },
      { keys: ["g", "d"], description: "Go to Dashboard", sequence: true },
    ]
  },
  {
    category: "Actions",
    items: [
      { keys: ["n"], description: "Create new item" },
      { keys: ["meta", "s"], description: "Save form" },
      { keys: ["meta", "enter"], description: "Submit form" },
    ]
  },
  {
    category: "General",
    items: [
      { keys: ["escape"], description: "Close modal" },
      { keys: ["?"], description: "Show keyboard shortcuts" },
    ]
  }
]
```

### Expected Outcome
- ShortcutsModal component created in components/layout/Page directory
- Modal displays all keyboard shortcuts organized by category
- Search functionality filters shortcuts by description or keys
- Keyboard keys displayed as styled badges with proper formatting
- Shows OS-specific modifiers (⌘ on Mac, Ctrl on Windows)
- Sequences displayed with "then" separator
- Dialog is accessible with proper ARIA labels
- Modal can be opened programmatically or via shortcut
- Component is reusable and easy to integrate

### Verification Checklist
- [ ] ShortcutsModal component file created
- [ ] Props interface includes open and onOpenChange
- [ ] Radix Dialog implemented correctly
- [ ] Search input filters shortcuts
- [ ] Shortcuts grouped by category correctly
- [ ] Key badges render with proper styling
- [ ] OS detection works for Cmd vs Ctrl display
- [ ] Sequence shortcuts show "then" separator
- [ ] Empty state shows when no results
- [ ] Modal is keyboard accessible
- [ ] Close button and Escape key close modal
- [ ] Component exported and documented

---

## Task 66: Test Navigation Components

### Overview
Perform comprehensive testing of all page navigation components created in this document series. Testing includes unit tests for individual components, integration tests for component interactions, accessibility testing with screen readers and keyboard navigation, responsive testing across different screen sizes, and user acceptance testing of the complete navigation experience. Testing ensures components work correctly, are accessible, and provide a smooth user experience.

### Dependencies
- Tasks 59-65: All page components and shortcuts system created
- SubPhase-01: Next.js Project Setup (testing framework)
- SubPhase-03: Component Library Setup (testing utilities)

### Instructions

1. **Set up testing environment**
   - Ensure Jest and React Testing Library are installed
   - Install @testing-library/user-event for interaction testing
   - Install @testing-library/jest-dom for additional matchers
   - Configure test environment in jest.config.js
   - Set up test utilities and custom render functions

2. **Create test file structure**
   - Create `__tests__` directory in components/layout/Page
   - Create test file for each component:
     - PageTitle.test.tsx
     - PageActions.test.tsx
     - BackButton.test.tsx
     - TabNavigation.test.tsx
     - PageSection.test.tsx
     - ShortcutsModal.test.tsx
   - Create `__tests__` directory in hooks
   - Create useKeyboardShortcuts.test.ts

3. **Test PageTitle component**
   - Test rendering with title prop
   - Test rendering with title and description
   - Test rendering with actions slot
   - Test responsive layout changes
   - Test custom className application
   - Verify h1 element renders correctly
   - Verify semantic HTML structure

4. **Test PageActions component**
   - Test rendering children buttons
   - Test default right alignment
   - Test left and center alignment options
   - Test responsive flex direction changes
   - Test gap spacing between buttons
   - Verify flex container structure

5. **Test BackButton component**
   - Test rendering with default "Back" label
   - Test rendering with custom label
   - Test router.back() called when no href
   - Test Link navigation when href provided
   - Test onClick handler execution
   - Test keyboard interaction (Enter key)
   - Test focus visible styling
   - Mock Next.js router for testing

6. **Test TabNavigation component**
   - Test rendering all tabs from array
   - Test active tab determined from pathname
   - Test tab click triggers navigation
   - Test keyboard arrow navigation between tabs
   - Test icon rendering in tabs
   - Test badge rendering in tabs
   - Test onTabChange callback firing
   - Mock usePathname and useRouter hooks

7. **Test PageSection component**
   - Test rendering with title
   - Test rendering without title
   - Test description rendering
   - Test actions slot in header
   - Test collapsible functionality
   - Test expand/collapse animation
   - Test chevron icon rotation
   - Test defaultExpanded prop
   - Test children rendering in content area

8. **Test useKeyboardShortcuts hook**
   - Test hook registration of shortcuts
   - Test keyboard event triggers correct action
   - Test modifier keys detected correctly
   - Test shortcut normalization
   - Test context-aware skipping in form fields
   - Test preventDefault called for registered shortcuts
   - Test unregistration on unmount
   - Test no memory leaks from listeners
   - Mock keyboard events for testing

9. **Test ShortcutsModal component**
   - Test modal opens when open prop is true
   - Test modal closes when onOpenChange called
   - Test search filtering shortcuts
   - Test shortcuts grouped by category
   - Test key badges render correctly
   - Test OS-specific modifier display
   - Test sequence shortcuts formatting
   - Test empty state with no results
   - Test keyboard Escape closes modal

10. **Perform integration testing**
    - Test PageTitle, PageActions, BackButton together in page layout
    - Test TabNavigation with actual route changes
    - Test keyboard shortcuts trigger modal opening
    - Test breadcrumbs (from previous tasks) with TabNavigation
    - Test complete page composition with all components
    - Verify components don't conflict with each other

11. **Perform accessibility testing**
    - Run automated accessibility tests with jest-axe
    - Test keyboard navigation through all components
    - Test screen reader announcements with testing-library
    - Verify ARIA labels and roles are correct
    - Test focus management in modals and collapsibles
    - Test color contrast meets WCAG AA standards
    - Test with keyboard-only navigation
    - Verify no focus traps exist

12. **Perform responsive testing**
    - Test components at mobile breakpoint (< 640px)
    - Test components at tablet breakpoint (768px - 1024px)
    - Test components at desktop breakpoint (> 1024px)
    - Test components at large desktop (> 1440px)
    - Verify layout changes at each breakpoint
    - Test touch targets are 44x44px minimum on mobile
    - Test horizontal scrolling on mobile where appropriate

13. **Test cross-browser compatibility**
    - Test in Chrome/Edge (Chromium)
    - Test in Firefox
    - Test in Safari (if available)
    - Verify keyboard shortcuts work in all browsers
    - Test modifier key detection on Mac and Windows
    - Document any browser-specific issues

14. **Perform user acceptance testing**
    - Have team members use navigation components
    - Collect feedback on usability and experience
    - Test complete user flows with navigation
    - Verify shortcuts are discoverable and learnable
    - Test with real content and data
    - Identify any pain points or confusion

15. **Performance testing**
    - Test keyboard event listener performance
    - Verify no jank or lag when using shortcuts
    - Test modal opening/closing animation performance
    - Profile component render times
    - Ensure no excessive re-renders

16. **Document test results**
    - Record test coverage percentage (aim for > 80%)
    - Document any failing tests and reasons
    - Create list of known issues or limitations
    - Document browser compatibility results
    - Report accessibility audit results
    - Note performance metrics

### Component Testing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│ Testing Pyramid                                              │
│                                                              │
│                    ▲                                         │
│                   ╱ ╲                                        │
│                  ╱   ╲                                       │
│                 ╱ E2E ╲    Manual, Full User Flows         │
│                ╱───────╲                                     │
│               ╱         ╲                                    │
│              ╱Integration╲  Component Interactions          │
│             ╱─────────────╲                                  │
│            ╱               ╲                                 │
│           ╱  Unit Tests     ╲  Individual Components        │
│          ╱___________________╲                               │
│                                                              │
│  Focus: 70% Unit, 20% Integration, 10% E2E/Manual           │
└─────────────────────────────────────────────────────────────┘
```

### Testing Checklist by Component

```
PageTitle:
  ✓ Renders h1 with title text
  ✓ Renders description when provided
  ✓ Renders actions slot when provided
  ✓ Responsive layout mobile vs desktop
  ✓ Custom className applied

PageActions:
  ✓ Renders children buttons
  ✓ Right alignment by default
  ✓ Left/center alignment works
  ✓ Responsive flex direction
  ✓ Gap spacing applied

BackButton:
  ✓ Renders with label
  ✓ router.back() called
  ✓ Link href navigation works
  ✓ onClick handler executes
  ✓ Keyboard accessible

TabNavigation:
  ✓ Renders all tabs
  ✓ Active tab matches route
  ✓ Tab click navigates
  ✓ Arrow keys work
  ✓ Icons and badges render

PageSection:
  ✓ Renders with title
  ✓ Collapsible works
  ✓ Chevron rotates
  ✓ Content shows/hides
  ✓ Actions slot renders

useKeyboardShortcuts:
  ✓ Registers shortcuts
  ✓ Triggers on keypress
  ✓ Modifiers detected
  ✓ Context-aware
  ✓ No memory leaks

ShortcutsModal:
  ✓ Opens/closes correctly
  ✓ Search filters results
  ✓ Categories grouped
  ✓ Keys formatted properly
  ✓ Accessible with keyboard
```

### Accessibility Testing Requirements

```
Keyboard Navigation:
  ✓ Tab reaches all interactive elements
  ✓ Enter/Space activate buttons
  ✓ Arrow keys navigate tabs
  ✓ Escape closes modals
  ✓ No focus traps
  ✓ Focus visible on all elements

Screen Reader:
  ✓ All images have alt text
  ✓ ARIA labels present
  ✓ Semantic HTML used
  ✓ Heading hierarchy correct
  ✓ Link purpose clear
  ✓ Button labels descriptive

Color & Contrast:
  ✓ Text contrast ratio ≥ 4.5:1
  ✓ Large text contrast ≥ 3:1
  ✓ Focus indicators visible
  ✓ Don't rely on color alone

Touch & Mobile:
  ✓ Touch targets ≥ 44x44px
  ✓ Gestures not required
  ✓ Orientation independent
  ✓ Text is readable without zoom
```

### Expected Outcome
- All component unit tests passing
- Integration tests verify component interactions
- Accessibility audit shows no major issues
- Responsive behavior verified on all screen sizes
- Keyboard shortcuts work reliably across browsers
- Test coverage exceeds 80% for critical paths
- Documentation of test results and known issues
- Components ready for production use

### Verification Checklist
- [ ] Test files created for all components
- [ ] PageTitle unit tests passing
- [ ] PageActions unit tests passing
- [ ] BackButton unit tests passing
- [ ] TabNavigation unit tests passing
- [ ] PageSection unit tests passing
- [ ] useKeyboardShortcuts unit tests passing
- [ ] ShortcutsModal unit tests passing
- [ ] Integration tests passing
- [ ] Accessibility audit completed
- [ ] No axe violations found
- [ ] Keyboard navigation works for all components
- [ ] Screen reader testing completed
- [ ] Responsive testing on mobile completed
- [ ] Responsive testing on tablet completed
- [ ] Responsive testing on desktop completed
- [ ] Cross-browser testing completed
- [ ] User acceptance testing completed
- [ ] Test coverage reported
- [ ] Known issues documented
- [ ] All tests documented and maintained

---

## Component File Structure Summary

```
frontend/
├── components/
│   └── layout/
│       ├── Page/
│       │   ├── PageTitle.tsx           (Task 59)
│       │   ├── PageActions.tsx         (Task 60)
│       │   ├── BackButton.tsx          (Task 61)
│       │   ├── TabNavigation.tsx       (Task 62)
│       │   ├── PageSection.tsx         (Task 63)
│       │   ├── ShortcutsModal.tsx      (Task 65)
│       │   ├── index.ts                (Export all components)
│       │   └── __tests__/
│       │       ├── PageTitle.test.tsx
│       │       ├── PageActions.test.tsx
│       │       ├── BackButton.test.tsx
│       │       ├── TabNavigation.test.tsx
│       │       ├── PageSection.test.tsx
│       │       └── ShortcutsModal.test.tsx
│       └── Breadcrumb/
│           └── (from previous tasks)
└── hooks/
    ├── useKeyboardShortcuts.ts         (Task 64)
    └── __tests__/
        └── useKeyboardShortcuts.test.ts
```

---

## Integration with Existing Layout

The page components created in this document integrate seamlessly with the existing dashboard layout structure built in previous tasks:

```
┌─────────────────────────────────────────────────────────────────┐
│ Header (Group C)                                   [User Menu]  │
│ [Logo]  [Search]  [Notifications]                               │
└─────────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────────────┐
│              │  ┌──────────────────────────────────────────────┐ │
│   Sidebar    │  │ <Breadcrumb /> (Group D - Task 51-58)       │ │
│   (Group B)  │  └──────────────────────────────────────────────┘ │
│              │  ┌──────────────────────────────────────────────┐ │
│ [Dashboard]  │  │ <PageTitle                                   │ │
│ [Products]   │  │   title="Product Management"                 │ │
│ [Inventory]  │  │   description="Manage products..."           │ │
│ [Orders]     │  │   actions={<PageActions>...</PageActions>}   │ │
│              │  │ />                                           │ │
│              │  └──────────────────────────────────────────────┘ │
│              │  ┌──────────────────────────────────────────────┐ │
│              │  │ <BackButton href="/products" />              │ │
│              │  └──────────────────────────────────────────────┘ │
│              │  ┌──────────────────────────────────────────────┐ │
│              │  │ <TabNavigation tabs={[...]} />               │ │
│              │  │  [Details] [Variants] [Pricing] [Inventory]  │ │
│              │  └──────────────────────────────────────────────┘ │
│              │  ┌──────────────────────────────────────────────┐ │
│              │  │ <PageSection title="Basic Information">      │ │
│              │  │   <form>...</form>                           │ │
│              │  │ </PageSection>                               │ │
│              │  │                                              │ │
│              │  │ <PageSection title="Advanced Options"        │ │
│              │  │              collapsible>                    │ │
│              │  │   <form>...</form>                           │ │
│              │  │ </PageSection>                               │ │
│              │  └──────────────────────────────────────────────┘ │
│              │                                                   │
└──────────────┴───────────────────────────────────────────────────┘

Keyboard Shortcut (Cmd+/)
         │
         ▼
┌──────────────────────────────────────┐
│ <ShortcutsModal open={true} />       │
│ Displays all keyboard shortcuts      │
└──────────────────────────────────────┘
```

---

## Usage Examples (Conceptual)

### Example 1: Product Edit Page with All Components

A product edit page would compose all these components together:

1. Breadcrumb shows navigation path: Dashboard > Products > Edit Product
2. BackButton allows return to product list
3. PageTitle displays "Edit Product" with description and action buttons
4. TabNavigation provides tabs for Details, Variants, Pricing, Inventory
5. PageSection components organize form fields into logical sections
6. Keyboard shortcuts enable quick save (Cmd+S) and navigation

### Example 2: Dashboard Page with Sections

A dashboard home page would use:

1. PageTitle with "Dashboard" heading and optional description
2. No BackButton needed (top-level page)
3. Multiple PageSection components for different widgets:
   - Sales Overview section
   - Recent Orders section (collapsible)
   - Inventory Alerts section
   - Quick Actions section

### Example 3: Settings Page with Tabs

A settings page would combine:

1. PageTitle with "Settings" heading
2. TabNavigation for different settings categories:
   - General, Company, Users, Integrations, Billing
3. Each tab shows different PageSection components
4. Form actions in PageActions slot (Save, Reset)
5. Keyboard shortcut Cmd+S to save settings

---

## Best Practices and Guidelines

### Component Composition
- Use PageTitle at the top of every page for consistency
- Combine BackButton with Breadcrumb for redundant navigation options
- Place PageActions in PageTitle actions prop for alignment
- Wrap related content in PageSection for organization
- Use TabNavigation for pages with multiple related views

### Accessibility Considerations
- Always use semantic HTML (h1, section, nav, kbd)
- Provide ARIA labels for complex interactions
- Ensure keyboard navigation works for all components
- Test with screen readers regularly
- Maintain focus management in modals and collapsibles

### Performance Optimization
- Memoize tab items and shortcuts arrays to prevent re-renders
- Debounce search input in shortcuts modal
- Use CSS transitions instead of JavaScript for animations
- Lazy load modal content if heavy
- Clean up event listeners on unmount

### Keyboard Shortcuts Design
- Use familiar shortcuts when possible (Cmd+K for search)
- Avoid conflicts with browser shortcuts
- Provide escape hatches (Escape to close)
- Make shortcuts discoverable through help modal
- Group shortcuts logically by function
- Document all shortcuts in user guide

### Testing Strategy
- Write unit tests for each component's core functionality
- Test integration between related components
- Perform accessibility audits regularly
- Test responsive behavior at all breakpoints
- Verify keyboard shortcuts across browsers
- Include visual regression testing if possible

---

## Document Complete

This document has covered Tasks 59-66, implementing reusable page components and a comprehensive keyboard shortcuts system. These components provide the building blocks for consistent, accessible, and efficient page layouts throughout the ERP dashboard. Combined with the breadcrumbs and page header components from the previous document, the navigation infrastructure is now complete.

**Next Steps:** Proceed to Group E (Tasks 67-82) to implement responsive design and mobile optimizations for all dashboard components created so far.
