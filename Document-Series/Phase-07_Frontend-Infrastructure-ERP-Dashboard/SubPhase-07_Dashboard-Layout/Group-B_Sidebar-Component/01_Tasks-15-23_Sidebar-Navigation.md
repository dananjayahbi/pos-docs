# Tasks 15-23: Sidebar Navigation

> **Phase:** 07 - Frontend Infrastructure ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout Structure  
> **Group:** B - Sidebar Component  
> **Document:** 01 of 01  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Dashboard-Route-Group-Layout/](../Group-A_Dashboard-Route-Group-Layout/)
- **→ Next Group:** [../Group-C_Header-Component/](../Group-C_Header-Component/)

---

## Document Overview

This document covers the comprehensive implementation of the sidebar navigation component, including its expandable/collapsible behavior, hierarchical menu structure, and state management integration. The sidebar serves as the primary navigation interface for the ERP dashboard, providing access to all system modules and features through a structured menu hierarchy.

### Key Features
- **Fixed Sidebar Layout:** Fixed positioning with smooth width transitions between expanded (240px) and collapsed (72px) states
- **Zustand State Management:** Centralized UI store for sidebar collapse/expand state persistence
- **Hierarchical Navigation:** Support for nested menu items with expandable groups
- **Icon Integration:** Lucide React icons for visual consistency
- **Active State Tracking:** Automatic highlighting of current route and parent groups
- **Permission-Based Display:** Menu items conditionally rendered based on user permissions
- **Responsive Design:** Optimized for both desktop and mobile viewports

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create Sidebar Component | Medium | 35 min |
| 16 | Create Sidebar Header | Medium | 30 min |
| 17 | Create Logo Component | Medium | 25 min |
| 18 | Create Collapse Toggle Button | Low | 20 min |
| 19 | Connect Sidebar to UI Store | Medium | 30 min |
| 20 | Create Sidebar Navigation | Medium | 35 min |
| 21 | Define Navigation Menu Items | High | 40 min |
| 22 | Create NavItem Component | High | 45 min |
| 23 | Create NavGroup Component | High | 50 min |

---

## Sidebar Architecture Overview

### Component Hierarchy

```
Sidebar (Main Container)
├── SidebarHeader
│   ├── Logo (Expanded/Collapsed variants)
│   └── CollapseToggle (Expand/Collapse button)
│
├── SidebarNav (Navigation Container)
│   └── Menu Items (Dynamic rendering)
│       ├── NavItem (Single menu item)
│       │   ├── Icon (Lucide icon)
│       │   ├── Label (Text label)
│       │   └── Active Indicator
│       │
│       └── NavGroup (Collapsible group)
│           ├── Group Header (Clickable)
│           │   ├── Icon
│           │   ├── Label
│           │   └── Chevron (Expand/Collapse)
│           │
│           └── Children Container
│               └── NavItem(s) (Nested items)
```

### State Management Flow

```
┌─────────────────────────────────────────┐
│ Zustand UI Store                        │
│ (/stores/ui-store.ts)                   │
│                                         │
│ State:                                  │
│  - sidebarCollapsed: boolean            │
│                                         │
│ Actions:                                │
│  - toggleSidebar()                      │
│  - setSidebarCollapsed(value: boolean)  │
└──────────────────┬──────────────────────┘
                   │
                   │ Subscribe
                   ↓
         ┌─────────────────┐
         │ Sidebar         │
         │ Component       │
         └─────────────────┘
                   │
      ┌────────────┼────────────┐
      │            │            │
      ↓            ↓            ↓
  SidebarHeader  SidebarNav  CSS Classes
  (toggle btn)   (menu items) (width transition)
```

### Width States Diagram

```
Expanded State (240px)              Collapsed State (72px)
┌───────────────────────┐          ┌──────┐
│ [Logo] ERP System  [≡]│          │ [L] │
├───────────────────────┤          ├──────┤
│                       │          │      │
│ [📊] Dashboard        │          │ [📊] │
│ [📦] Inventory        │          │ [📦] │
│ [🛒] Sales        [▼] │          │ [🛒] │
│   ├─ Orders           │          │ [👤] │
│   ├─ Invoices         │          │ [⚙️]  │
│   └─ Quotes           │          │      │
│ [👤] Customers        │          │      │
│ [⚙️] Settings          │          │      │
│                       │          │      │
└───────────────────────┘          └──────┘
```

---

## Task 15: Create Sidebar Component

### Overview
Create the main Sidebar container component that serves as the structural foundation for the navigation system. This component manages the overall sidebar layout, width states, positioning, and provides the context for all nested navigation components.

### Dependencies
- Phase 07, SubPhase 07, Group A: Dashboard Layout Component (layout.tsx)
- Next.js App Router structure
- Tailwind CSS configuration
- TypeScript setup

### Instructions

1. **Create component directory structure**
   - Navigate to `frontend/components/layout/`
   - Create new directory named `Sidebar/`
   - Create file `Sidebar.tsx` in the Sidebar directory

2. **Define component props interface**
   - Create TypeScript interface `SidebarProps`
   - Include optional className prop for style overrides
   - Add optional children prop for extensibility
   - Consider future mobile props (isOpen, onClose for overlay mode)

3. **Implement component base structure**
   - Create functional component with TypeScript typing
   - Use semantic HTML5 aside element for accessibility
   - Structure component to accept SidebarHeader and SidebarNav as children
   - Include proper component naming and exports

4. **Define fixed positioning styles**
   - Apply fixed positioning to lock sidebar in viewport
   - Set top position to 0 for full height
   - Set left position to 0 for left-aligned placement
   - Define z-index for proper layering (z-10 or higher)
   - Set height to full viewport height (h-screen)

5. **Implement width state styles**
   - Define expanded width: 240px (w-60 in Tailwind)
   - Define collapsed width: 72px (w-18 in Tailwind)
   - Width should be controlled by state (will connect in Task 19)
   - Use conditional className based on collapsed state

6. **Add transition animations**
   - Apply CSS transition for width property
   - Use duration of 300ms for smooth animation
   - Apply cubic-bezier easing for natural feel (ease-in-out)
   - Transition should affect width only to prevent layout shift

7. **Define color and styling**
   - Background color: bg-white for light theme
   - Border: Add right border (border-r) with gray-200
   - Shadow: Subtle shadow for depth (shadow-sm)
   - Prepare for dark theme support (consider data-theme attribute)

8. **Implement responsive behavior**
   - Desktop: Fixed sidebar always visible
   - Tablet: Consider collapsing by default below lg breakpoint
   - Mobile: Plan for overlay mode (will implement in Group E)
   - Add breakpoint classes for responsive width

9. **Add accessibility attributes**
   - Set role="navigation" on aside element
   - Add aria-label="Main navigation"
   - Include aria-expanded attribute for collapsed state
   - Ensure keyboard navigation support

10. **Create component composition structure**
    - Define slots for SidebarHeader component
    - Define slots for SidebarNav component
    - Ensure proper vertical layout (flex-col)
    - Provide consistent spacing between sections

11. **Implement overflow handling**
    - Set overflow-y to auto for scrollable content
    - Hide horizontal overflow (overflow-x-hidden)
    - Ensure scroll area excludes header (header sticky)
    - Add custom scrollbar styling (webkit-scrollbar)

12. **Create index barrel export**
    - Create `index.ts` in Sidebar directory
    - Export Sidebar component as named export
    - Prepare for exporting other sidebar components
    - Set up for clean imports from parent components

### Sidebar State Visualization

```
┌────────────────────────────────────────┐
│ Sidebar States                         │
├────────────────────────────────────────┤
│                                        │
│  State: Expanded (default)             │
│  Width: 240px (w-60)                   │
│  Shows: Icons + Full text labels       │
│  Transition: 300ms ease-in-out         │
│                                        │
│  ────────────────────────────────      │
│                                        │
│  State: Collapsed                      │
│  Width: 72px (w-18)                    │
│  Shows: Icons only (centered)          │
│  Transition: 300ms ease-in-out         │
│                                        │
└────────────────────────────────────────┘
```

### Expected Outcome
```
frontend/
└── components/
    └── layout/
        └── Sidebar/
            ├── Sidebar.tsx     # Main container component
            └── index.ts        # Barrel export
```

### Verification Checklist
- [ ] Sidebar directory created in correct location
- [ ] Sidebar.tsx component file created
- [ ] TypeScript interfaces defined for props
- [ ] Fixed positioning applied correctly
- [ ] Width states defined (240px/72px)
- [ ] Smooth transitions implemented (300ms)
- [ ] Accessibility attributes included (role, aria-label)
- [ ] Responsive classes added for breakpoints
- [ ] Overflow handling implemented
- [ ] Index barrel export created
- [ ] Component accepts children properly
- [ ] Border and shadow styling applied

---

## Task 16: Create Sidebar Header

### Overview
Create the SidebarHeader component that contains the company logo and the collapse toggle button. This header section remains fixed at the top of the sidebar and provides the primary interaction point for expanding/collapsing the sidebar.

### Dependencies
- Task 15: Create Sidebar Component (parent container)
- Task 17: Create Logo Component (will be nested)
- Task 18: Create Collapse Toggle Button (will be nested)

### Instructions

1. **Create component file**
   - Create file `SidebarHeader.tsx` in the Sidebar directory
   - Set up functional component with TypeScript
   - Define proper imports and exports

2. **Define component props interface**
   - Create `SidebarHeaderProps` interface
   - Include collapsed state prop (boolean)
   - Include onToggle callback prop (optional, for toggle button)
   - Add optional className for customization

3. **Implement header container structure**
   - Use semantic header element
   - Apply flexbox layout for horizontal arrangement
   - Set items-center for vertical alignment
   - Add justify-between for space distribution

4. **Define header dimensions and spacing**
   - Set fixed height: h-16 (64px) for consistency
   - Apply horizontal padding: px-4 in expanded, px-2 in collapsed
   - Ensure height matches dashboard header for alignment
   - Add shrink-0 to prevent flex shrinking

5. **Add visual styling**
   - Border bottom: border-b with gray-200
   - Background: bg-white (or transparent)
   - Maintain consistent spacing with sidebar body
   - Prepare for theme variations

6. **Create Logo slot**
   - Define slot for Logo component (Task 17)
   - Logo should receive collapsed state as prop
   - Logo should occupy left side of header
   - Include proper spacing around logo

7. **Create Toggle Button slot**
   - Define slot for CollapseToggle component (Task 18)
   - Button should receive collapsed state as prop
   - Button should receive onToggle callback
   - Position on right side of header in expanded state

8. **Implement collapsed state behavior**
   - In collapsed state: Center logo, hide text
   - In collapsed state: Show toggle button on hover
   - Adjust padding based on collapsed state
   - Ensure smooth visual transition

9. **Add responsive behavior**
   - Desktop: Always show header with toggle
   - Tablet/Mobile: Adapt spacing for smaller screens
   - Mobile overlay mode: Include close button (future)
   - Maintain touch-friendly target sizes

10. **Implement accessibility features**
    - Use semantic header element
    - Ensure toggle button is keyboard accessible
    - Add aria-label for header section
    - Support focus management

11. **Update index barrel export**
    - Add SidebarHeader to index.ts exports
    - Maintain clean import structure
    - Export with proper naming

### Header Layout Diagram

```
Expanded Header (240px)
┌──────────────────────────────────────┐
│ [Logo+Text]                    [≡]   │  ← Height: 64px
└──────────────────────────────────────┘
 ↑                                 ↑
 Logo Component              Toggle Button


Collapsed Header (72px)
┌──────────┐
│   [L]    │  ← Height: 64px, Logo centered
└──────────┘
     ↑
  Logo only
  (Toggle on hover)
```

### Expected Outcome
```
frontend/
└── components/
    └── layout/
        └── Sidebar/
            ├── Sidebar.tsx
            ├── SidebarHeader.tsx    # Header component
            └── index.ts             # Updated exports
```

### Verification Checklist
- [ ] SidebarHeader.tsx file created
- [ ] TypeScript interface defined for props
- [ ] Flexbox layout implemented correctly
- [ ] Fixed height (64px) applied
- [ ] Border bottom added
- [ ] Logo slot properly defined
- [ ] Toggle button slot properly defined
- [ ] Collapsed state behavior implemented
- [ ] Padding adjusts based on collapsed state
- [ ] Responsive behavior considered
- [ ] Accessibility attributes included
- [ ] Component exported in index.ts

---

## Task 17: Create Logo Component

### Overview
Create a Logo component that displays the company branding with two distinct variants: expanded (showing full logo and text) and collapsed (showing icon or abbreviated logo only). The component should smoothly transition between these states.

### Dependencies
- Task 16: Create Sidebar Header (parent component)
- SVG logo assets or icon library
- Next.js Image component (if using image assets)

### Instructions

1. **Create component file**
   - Create file `Logo.tsx` in the Sidebar directory
   - Set up functional component with TypeScript
   - Import necessary dependencies (Image, Link, icons)

2. **Define component props interface**
   - Create `LogoProps` interface
   - Include collapsed state prop (boolean)
   - Add optional href prop for navigation (default: "/dashboard")
   - Include optional className for customization

3. **Choose logo implementation approach**
   - Option A: SVG component for logo icon
   - Option B: Next.js Image component for logo file
   - Option C: Icon from Lucide library (for prototyping)
   - Ensure approach supports both expanded and collapsed variants

4. **Implement expanded state display**
   - Show full logo/icon (32x32px or similar size)
   - Display company name text: "ERP System" or actual name
   - Use medium font weight (font-medium)
   - Apply primary text color (text-gray-900)
   - Ensure proper spacing between icon and text (space-x-2 or space-x-3)

5. **Implement collapsed state display**
   - Show only logo icon or monogram
   - Center the icon horizontally
   - Use same icon size for consistency
   - Hide text label with CSS (opacity-0 or hidden)
   - Optionally enlarge icon slightly for prominence

6. **Create clickable link wrapper**
   - Wrap logo in Next.js Link component
   - Default href to "/dashboard" or home route
   - Apply flexbox for icon and text alignment
   - Add items-center for vertical centering

7. **Add hover and focus states**
   - Hover: Slight opacity change (hover:opacity-80)
   - Focus: Outline ring for keyboard navigation (focus:ring-2)
   - Active: Slight scale effect (active:scale-95)
   - Transition: Smooth transitions for all states

8. **Implement smooth transitions**
   - Transition for opacity changes
   - Transition for width/spacing changes
   - Use 200-300ms duration
   - Apply ease-in-out easing

9. **Define logo dimensions and spacing**
   - Icon container: w-8 h-8 (32x32px)
   - Text size: text-lg (18px) in expanded state
   - Spacing between icon and text: gap-2 or gap-3
   - Ensure proportions work in both states

10. **Add accessibility features**
    - Include alt text for logo image/icon
    - Add aria-label: "Navigate to dashboard"
    - Ensure sufficient color contrast
    - Support keyboard navigation (focusable link)

11. **Consider branding variations**
    - Support for custom logo upload (future enhancement)
    - Tenant-specific branding (for multi-tenancy)
    - Dark mode logo variant (prepare attributes)
    - SVG ensures scalability across resolutions

12. **Update index barrel export**
    - Add Logo to index.ts exports
    - Maintain clean export structure

### Logo State Diagram

```
Expanded State
┌─────────────────────────────┐
│  [📊]  ERP System           │  ← Icon (32x32) + Text
└─────────────────────────────┘
   ↑      ↑
  Icon   Text (visible)


Collapsed State
┌──────────┐
│   [📊]   │  ← Icon only (32x32, centered)
└──────────┘
     ↑
  Icon (text hidden)
```

### Expected Outcome
```
frontend/
└── components/
    └── layout/
        └── Sidebar/
            ├── Sidebar.tsx
            ├── SidebarHeader.tsx
            ├── Logo.tsx              # Logo component
            └── index.ts              # Updated exports
```

### Verification Checklist
- [ ] Logo.tsx file created
- [ ] TypeScript interface defined for props
- [ ] Both expanded and collapsed states implemented
- [ ] Next.js Link wrapper applied
- [ ] Icon/logo displayed correctly
- [ ] Text label shows in expanded state only
- [ ] Smooth transitions between states
- [ ] Hover and focus states implemented
- [ ] Proper dimensions and spacing applied
- [ ] Accessibility attributes included (alt, aria-label)
- [ ] Component is clickable and navigates correctly
- [ ] Component exported in index.ts

---

## Task 18: Create Collapse Toggle Button

### Overview
Create a toggle button component that allows users to expand or collapse the sidebar. The button should display appropriate icons for each state and be positioned consistently within the sidebar header.

### Dependencies
- Task 16: Create Sidebar Header (parent component)
- Lucide React icons library
- Task 19: Connect Sidebar to UI Store (for state management)

### Instructions

1. **Create component file**
   - Create file `CollapseToggle.tsx` in the Sidebar directory
   - Set up functional component with TypeScript
   - Import Lucide icons (ChevronLeft, ChevronRight, Menu)

2. **Define component props interface**
   - Create `CollapseToggleProps` interface
   - Include collapsed state prop (boolean)
   - Include onClick callback prop (function)
   - Add optional className for customization
   - Optional icon size prop

3. **Select appropriate icons**
   - Expanded state: ChevronLeft icon (indicates collapse action)
   - Collapsed state: ChevronRight icon (indicates expand action)
   - Alternative: Menu icon for collapsed state
   - Ensure icons are from Lucide React library

4. **Implement button base structure**
   - Use semantic button element
   - Apply type="button" to prevent form submission
   - Set up conditional icon rendering based on collapsed state
   - Include proper onClick handler

5. **Define button styling**
   - Size: w-8 h-8 (32x32px) for touch-friendly target
   - Shape: Rounded (rounded or rounded-md)
   - Background: Transparent default, hover background
   - Border: None or subtle border on hover
   - Icon color: text-gray-600 default

6. **Implement hover and focus states**
   - Hover: bg-gray-100 or bg-gray-200
   - Focus: ring-2 ring-primary-500 for keyboard navigation
   - Active: bg-gray-200 or slight scale effect
   - Transition: 150ms for smooth interaction

7. **Add visual feedback**
   - Hover cursor: cursor-pointer
   - Disabled state: cursor-not-allowed, opacity-50 (if applicable)
   - Ripple or scale effect on click (optional)
   - Smooth icon transitions

8. **Implement icon transitions**
   - Transition between ChevronLeft and ChevronRight
   - Use fade or rotate animation (optional)
   - Duration: 200ms
   - Easing: ease-in-out

9. **Define button positioning**
   - In expanded state: Right side of header (ml-auto)
   - In collapsed state: Hidden or centered on hover
   - Ensure consistent vertical centering
   - Maintain proper spacing from other elements

10. **Add accessibility features**
    - Include aria-label: "Toggle sidebar" or "Collapse sidebar"/"Expand sidebar"
    - Ensure button is keyboard accessible (tab navigation)
    - Add aria-expanded attribute reflecting current state
    - Support Enter and Space key activation

11. **Implement tooltip (optional)**
    - Show tooltip on hover: "Collapse" or "Expand"
    - Use Tailwind tooltip utility or custom implementation
    - Position tooltip appropriately
    - Brief delay before showing (200ms)

12. **Update index barrel export**
    - Add CollapseToggle to index.ts exports
    - Maintain clean export structure

### Button State Diagram

```
Expanded State Button
┌────────────────────────────┐
│  [Logo+Text]           [◀] │  ← ChevronLeft icon
└────────────────────────────┘
                           ↑
                    Collapse action


Collapsed State Button
┌──────────┐
│   [L]    │  ← Button hidden or on hover
└──────────┘
     │
     └─ [▶]  ← ChevronRight (on hover)
```

### Expected Outcome
```
frontend/
└── components/
    └── layout/
        └── Sidebar/
            ├── Sidebar.tsx
            ├── SidebarHeader.tsx
            ├── Logo.tsx
            ├── CollapseToggle.tsx    # Toggle button component
            └── index.ts              # Updated exports
```

### Verification Checklist
- [ ] CollapseToggle.tsx file created
- [ ] TypeScript interface defined for props
- [ ] Button element with proper type attribute
- [ ] Icons from Lucide React imported
- [ ] Conditional icon rendering based on collapsed state
- [ ] Button styling applied (size, shape, colors)
- [ ] Hover and focus states implemented
- [ ] onClick handler properly wired
- [ ] Accessibility attributes included (aria-label, aria-expanded)
- [ ] Button is keyboard accessible
- [ ] Smooth transitions implemented
- [ ] Component exported in index.ts

---

## Task 19: Connect Sidebar to UI Store

### Overview
Integrate the Sidebar component with a Zustand state management store to persist the sidebar's collapsed/expanded state across page navigations and user sessions. This task establishes centralized state control for the sidebar's behavior.

### Dependencies
- Task 15: Create Sidebar Component (main container)
- Task 18: Create Collapse Toggle Button (triggers state changes)
- Zustand library installation
- TypeScript configuration

### Instructions

1. **Install Zustand library (if not already installed)**
   - Run: `npm install zustand`
   - Run: `npm install -D @types/zustand` (if types needed)
   - Verify installation in package.json
   - Restart TypeScript server if needed

2. **Create UI store directory structure**
   - Navigate to `frontend/stores/` (create if doesn't exist)
   - Create file `ui-store.ts` in the stores directory
   - Organize for potential multiple stores (auth, cart, etc.)

3. **Define store state interface**
   - Create `UIState` TypeScript interface
   - Include property: `sidebarCollapsed: boolean`
   - Add future UI state properties (theme, modal states, etc.)
   - Keep interface extensible

4. **Define store actions interface**
   - Create `UIActions` interface
   - Include action: `toggleSidebar: () => void`
   - Include action: `setSidebarCollapsed: (value: boolean) => void`
   - Plan for future UI actions

5. **Create Zustand store**
   - Use `create` function from Zustand
   - Combine `UIState` and `UIActions` types
   - Initialize `sidebarCollapsed` to `false` (expanded by default)
   - Implement `toggleSidebar` action to flip the boolean
   - Implement `setSidebarCollapsed` action to set explicit value

6. **Add localStorage persistence (optional but recommended)**
   - Import `persist` middleware from Zustand
   - Wrap store with persist middleware
   - Set storage key: "erp-ui-store" or similar
   - Persist `sidebarCollapsed` state
   - Configure whitelist to only persist specific fields

7. **Create custom hook for store access (optional)**
   - Create `useUIStore` hook wrapping the store
   - Provides cleaner API for components
   - Can add computed values or selectors
   - Export as default or named export

8. **Connect Sidebar component to store**
   - Import useUIStore or store hook in Sidebar.tsx
   - Subscribe to `sidebarCollapsed` state
   - Apply state to component className (width, padding)
   - Re-render on state changes

9. **Connect CollapseToggle to store**
   - Import useUIStore in CollapseToggle.tsx or pass via props
   - Wire onClick handler to `toggleSidebar` action
   - Pass `sidebarCollapsed` state as prop
   - Ensure toggle works bidirectionally

10. **Implement state-based styling**
    - In Sidebar: Apply conditional className based on `sidebarCollapsed`
    - Expanded: w-60 (240px)
    - Collapsed: w-18 (72px)
    - Add transition classes for smooth animation
    - Propagate state to child components (Header, Nav)

11. **Test state persistence**
    - Toggle sidebar state
    - Refresh page or navigate away
    - Verify state persists (if using localStorage)
    - Test in different browsers
    - Clear localStorage to reset state

12. **Add TypeScript strict typing**
    - Ensure all actions are properly typed
    - Avoid `any` types
    - Use proper return types for actions
    - Ensure state updates are type-safe

### Store Architecture Diagram

```
┌──────────────────────────────────────┐
│ Zustand UI Store                     │
│ (frontend/stores/ui-store.ts)        │
├──────────────────────────────────────┤
│                                      │
│ State:                               │
│   sidebarCollapsed: false (default)  │
│                                      │
│ Actions:                             │
│   toggleSidebar()                    │
│   setSidebarCollapsed(value)         │
│                                      │
│ Persistence (localStorage):          │
│   key: "erp-ui-store"                │
│   auto-save on state change          │
│   auto-load on mount                 │
└──────────────────┬───────────────────┘
                   │
        ┌──────────┼──────────┐
        │                     │
        ↓                     ↓
┌───────────────┐    ┌────────────────┐
│ Sidebar.tsx   │    │ Other          │
│               │    │ Components     │
│ Subscribes to │    │                │
│ collapsed     │    │ Future: theme, │
│ state         │    │ modals, etc.   │
└───────────────┘    └────────────────┘
```

### Expected Outcome
```
frontend/
├── stores/
│   └── ui-store.ts          # Zustand UI store
│
└── components/
    └── layout/
        └── Sidebar/
            ├── Sidebar.tsx          # Connected to store
            ├── CollapseToggle.tsx   # Triggers store actions
            └── ...
```

### Verification Checklist
- [ ] Zustand installed and verified in package.json
- [ ] ui-store.ts file created in stores directory
- [ ] State interface defined (UIState)
- [ ] Actions interface defined (UIActions)
- [ ] Store created with initial state
- [ ] toggleSidebar action implemented
- [ ] setSidebarCollapsed action implemented
- [ ] localStorage persistence added (optional)
- [ ] Sidebar component connected to store
- [ ] CollapseToggle triggers store actions
- [ ] State changes trigger re-renders
- [ ] Sidebar width changes based on state
- [ ] State persists across page refreshes (if using localStorage)
- [ ] TypeScript types are strict and accurate

---

## Task 20: Create Sidebar Navigation

### Overview
Create the SidebarNav component that serves as the container for the navigation menu items. This component renders the hierarchical menu structure and manages the scrollable navigation area within the sidebar.

### Dependencies
- Task 15: Create Sidebar Component (parent container)
- Task 19: Connect Sidebar to UI Store (for collapsed state)
- Task 21: Define Navigation Menu Items (menu data structure)
- Task 22: Create NavItem Component (will be children)
- Task 23: Create NavGroup Component (will be children)

### Instructions

1. **Create component file**
   - Create file `SidebarNav.tsx` in the Sidebar directory
   - Set up functional component with TypeScript
   - Import necessary dependencies and types

2. **Define component props interface**
   - Create `SidebarNavProps` interface
   - Include menuItems prop (array of menu item definitions)
   - Include collapsed state prop (boolean)
   - Add optional className for customization
   - Optional userPermissions prop for filtering (future)

3. **Implement navigation container structure**
   - Use semantic nav element for accessibility
   - Set role="navigation" attribute
   - Add aria-label="Main navigation"
   - Structure as flex column for vertical stacking

4. **Define container styling and layout**
   - Apply flex-1 to fill available space (grow to fill sidebar)
   - Set overflow-y-auto for scrollable content
   - Set overflow-x-hidden to prevent horizontal scroll
   - Add padding: py-4 for top/bottom spacing

5. **Implement scrollable area**
   - Enable vertical scrolling for long menus
   - Custom scrollbar styling (thin, subtle)
   - Webkit scrollbar customization for Chrome/Safari
   - Firefox scrollbar-width and scrollbar-color

6. **Create menu items rendering logic**
   - Map over menuItems array
   - Render NavItem for simple items
   - Render NavGroup for items with children
   - Apply conditional logic based on item type

7. **Implement spacing between menu items**
   - Add space-y-1 or space-y-2 for consistent gaps
   - Consider px-2 or px-3 for horizontal padding
   - Adjust padding based on collapsed state
   - Maintain visual hierarchy

8. **Add collapsed state handling**
   - Pass collapsed prop to NavItem and NavGroup components
   - Adjust padding when collapsed (px-1 or px-2)
   - Hide group labels in collapsed state
   - Show tooltips for items in collapsed state

9. **Implement permission-based filtering (prepare for future)**
   - Define filter function for menu items
   - Check user permissions against item permission property
   - Hide items user doesn't have access to
   - Maintain menu structure after filtering

10. **Add section dividers (optional)**
    - Define divider component or element
    - Place between logical menu sections
    - Use hr element with styling (my-2, border-gray-200)
    - Show only in expanded state

11. **Implement active route tracking**
    - Use Next.js usePathname hook
    - Pass current path to NavItem components
    - NavItem will highlight if path matches
    - Support parent group highlighting for nested items

12. **Update index barrel export**
    - Add SidebarNav to index.ts exports
    - Maintain clean export structure

### Navigation Container Diagram

```
┌────────────────────────────────────┐
│ SidebarNav Container               │
├────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │ NavItem: Dashboard             │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ NavItem: Inventory             │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ NavGroup: Sales                │ │ ← Collapsible
│ │   ├─ Orders                    │ │
│ │   ├─ Invoices                  │ │
│ │   └─ Quotes                    │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ NavItem: Customers             │ │
│ └────────────────────────────────┘ │
│                                    │
│ └───────── Scrollable ──────────┘  │
└────────────────────────────────────┘
```

### Expected Outcome
```
frontend/
└── components/
    └── layout/
        └── Sidebar/
            ├── Sidebar.tsx
            ├── SidebarHeader.tsx
            ├── SidebarNav.tsx       # Navigation container
            └── index.ts             # Updated exports
```

### Verification Checklist
- [ ] SidebarNav.tsx file created
- [ ] TypeScript interface defined for props
- [ ] Nav element with semantic HTML
- [ ] Accessibility attributes included (role, aria-label)
- [ ] Flex-1 applied to fill sidebar space
- [ ] Overflow-y-auto for scrolling
- [ ] Custom scrollbar styling implemented
- [ ] menuItems prop accepted and mapped
- [ ] Conditional rendering for NavItem vs NavGroup
- [ ] Spacing between items applied
- [ ] Collapsed state handling prepared
- [ ] Active route tracking prepared (usePathname)
- [ ] Component exported in index.ts

---

## Task 21: Define Navigation Menu Items

### Overview
Define the navigation menu structure as a TypeScript data structure containing all menu items, their hierarchies, icons, routes, and permissions. This centralized menu definition enables consistent navigation across the ERP system.

### Dependencies
- Task 20: Create Sidebar Navigation (consumer of menu data)
- Lucide React icons library
- Next.js routing structure
- User permission system (Phase 03, SubPhase 05)

### Instructions

1. **Create menu configuration file**
   - Create directory `frontend/config/` (if not exists)
   - Create file `navigation-menu.ts` or `sidebar-menu.ts`
   - Set up as exportable TypeScript module

2. **Define MenuItem interface**
   - Create `MenuItem` TypeScript interface
   - Properties:
     - `id`: string (unique identifier)
     - `label`: string (display text)
     - `icon`: LucideIcon component type
     - `path`: string (Next.js route path, optional if has children)
     - `children`: MenuItem[] (optional, for nested items)
     - `permission`: string (optional, required permission)
     - `badge`: string | number (optional, notification badge)
     - `divider`: boolean (optional, show divider after item)

3. **Import Lucide React icons**
   - Import all needed icons from "lucide-react"
   - Common icons:
     - LayoutDashboard (Dashboard)
     - Package (Inventory)
     - ShoppingCart (Sales)
     - FileText (Invoices)
     - Users (Customers, Employees)
     - Settings (Settings)
     - BarChart (Reports)
     - Plus others based on ERP modules

4. **Define Dashboard menu item**
   - id: "dashboard"
   - label: "Dashboard"
   - icon: LayoutDashboard
   - path: "/dashboard"
   - No children
   - No permission requirement (accessible to all)

5. **Define Inventory menu item**
   - id: "inventory"
   - label: "Inventory"
   - icon: Package
   - path: "/dashboard/inventory"
   - No children (or add if needed)
   - permission: "view_inventory" (example)

6. **Define Sales menu group**
   - id: "sales"
   - label: "Sales"
   - icon: ShoppingCart
   - No direct path (group has children)
   - Children:
     - Orders (id: "orders", path: "/dashboard/sales/orders")
     - Invoices (id: "invoices", path: "/dashboard/sales/invoices")
     - Quotes (id: "quotes", path: "/dashboard/sales/quotes")
     - Customers (id: "customers", path: "/dashboard/sales/customers")
   - permission: "view_sales"

7. **Define Purchasing menu group**
   - id: "purchasing"
   - label: "Purchasing"
   - icon: ShoppingBag or Truck
   - Children:
     - Purchase Orders
     - Suppliers
     - Receipts
   - permission: "view_purchasing"

8. **Define Finance/Accounting menu group**
   - id: "accounting"
   - label: "Accounting"
   - icon: DollarSign or Calculator
   - Children:
     - Chart of Accounts
     - Journal Entries
     - Bank Reconciliation
   - permission: "view_accounting"

9. **Define HR/Employees menu item or group**
   - id: "hr"
   - label: "Employees"
   - icon: Users
   - path or children based on HR module structure
   - permission: "view_hr"

10. **Define Reports menu item or group**
    - id: "reports"
    - label: "Reports"
    - icon: BarChart
    - Children: Various report types
    - permission: "view_reports"

11. **Define Settings menu item**
    - id: "settings"
    - label: "Settings"
    - icon: Settings
    - path: "/dashboard/settings"
    - Add divider: true to separate from main menu
    - permission: "manage_settings"

12. **Export menu items array**
    - Create constant: `navigationMenuItems`
    - Array of MenuItem objects
    - Export as named export
    - Type with MenuItem[] for type safety

13. **Add comments and documentation**
    - Document menu structure and hierarchy
    - Note permission requirements
    - Indicate which items correspond to ERP phases
    - Provide examples for adding new items

14. **Create helper functions (optional)**
    - Function to flatten menu for searching
    - Function to filter by permissions
    - Function to get item by id
    - Export helper functions if needed

### Menu Structure Example

```typescript
// Structure visualization (not actual code)

navigationMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    id: "sales",
    label: "Sales",
    icon: ShoppingCart,
    children: [
      { id: "orders", label: "Orders", path: "/dashboard/sales/orders" },
      { id: "invoices", label: "Invoices", path: "/dashboard/sales/invoices" },
      { id: "quotes", label: "Quotes", path: "/dashboard/sales/quotes" }
    ]
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    path: "/dashboard/inventory"
  },
  // ... more items
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
    divider: true  // Show divider before this item
  }
]
```

### Menu Hierarchy Diagram

```
navigationMenuItems
├─ Dashboard (single item)
├─ Inventory (single item)
├─ Sales (group)
│  ├─ Orders
│  ├─ Invoices
│  ├─ Quotes
│  └─ Customers
├─ Purchasing (group)
│  ├─ Purchase Orders
│  ├─ Suppliers
│  └─ Receipts
├─ Accounting (group)
│  ├─ Chart of Accounts
│  ├─ Journal Entries
│  └─ Bank Reconciliation
├─ Employees (single item or group)
├─ Reports (group)
│  ├─ Sales Reports
│  ├─ Inventory Reports
│  └─ Financial Reports
└─ Settings (single item)
   ─── divider ───
```

### Expected Outcome
```
frontend/
├── config/
│   └── navigation-menu.ts    # Menu items definition
│
└── components/
    └── layout/
        └── Sidebar/
            └── SidebarNav.tsx      # Consumes menu items
```

### Verification Checklist
- [ ] navigation-menu.ts file created in config directory
- [ ] MenuItem interface defined with all properties
- [ ] Lucide React icons imported
- [ ] Dashboard menu item defined
- [ ] Inventory menu item defined
- [ ] Sales menu group with children defined
- [ ] Purchasing menu group defined
- [ ] Accounting menu group defined
- [ ] HR/Employees menu defined
- [ ] Reports menu group defined
- [ ] Settings menu item defined with divider
- [ ] navigationMenuItems array exported
- [ ] All items have unique ids
- [ ] Icons assigned to all items
- [ ] Paths defined for leaf items
- [ ] Permission properties added where needed
- [ ] TypeScript types are strict

---

## Task 22: Create NavItem Component

### Overview
Create the NavItem component that represents a single, non-collapsible menu item in the sidebar navigation. This component handles rendering the icon, label, active state highlighting, and navigation to the specified route.

### Dependencies
- Task 20: Create Sidebar Navigation (parent component)
- Task 21: Define Navigation Menu Items (data structure)
- Next.js Link and usePathname
- Lucide React icons

### Instructions

1. **Create component file**
   - Create file `NavItem.tsx` in the Sidebar directory
   - Set up functional component with TypeScript
   - Import Next.js Link, usePathname
   - Import MenuItem type from navigation-menu.ts

2. **Define component props interface**
   - Create `NavItemProps` interface
   - Properties:
     - `item`: MenuItem (menu item data)
     - `collapsed`: boolean (sidebar collapsed state)
     - `depth`: number (optional, for nested items, default 0)
     - `onClick`: function (optional, callback on click)
   - Add optional className for customization

3. **Implement active route detection**
   - Use Next.js `usePathname()` hook to get current path
   - Compare current path with item.path
   - Set isActive to true if paths match
   - Consider partial matches for parent routes (startsWith)

4. **Create Link wrapper structure**
   - Use Next.js Link component with href={item.path}
   - Wrap in div or span for additional styling control
   - Apply flex layout for icon and label alignment
   - Ensure Link spans full width of sidebar item

5. **Implement icon rendering**
   - Render item.icon component from Lucide
   - Icon size: 20x20px (w-5 h-5) or configurable
   - Icon color: Default text-gray-600, active text-primary-600
   - Use flexShrink: 0 to prevent icon compression

6. **Implement label rendering**
   - Display item.label text
   - Font size: text-sm (14px)
   - Font weight: font-medium for default, font-semibold for active
   - Text color: text-gray-700 default, text-primary-700 active
   - Hide label in collapsed state (opacity-0 or hidden class)

7. **Define base styling**
   - Container: Rounded (rounded-md or rounded-lg)
   - Padding: px-3 py-2 in expanded, px-2 py-2 in collapsed
   - Flex layout: flex items-center gap-3
   - Width: Full width within sidebar (w-full)
   - Text alignment: text-left

8. **Implement active state styling**
   - Background: bg-primary-50 or bg-primary-100
   - Text color: text-primary-700 or text-primary-600
   - Icon color: text-primary-600
   - Optional: Border-left accent (border-l-4 border-primary-500)
   - Font weight: font-semibold

9. **Implement hover state styling**
   - Hover background: bg-gray-100 (if not active)
   - Hover text: text-gray-900
   - Smooth transition: transition-colors duration-200
   - Cursor: cursor-pointer

10. **Implement focus state styling**
    - Focus ring: ring-2 ring-primary-500 ring-offset-2
    - Ensure keyboard navigation is visible
    - Focus-visible for modern focus styling
    - Remove default outline if using custom ring

11. **Add collapsed state behavior**
    - In collapsed state: Center icon only
    - Justify content: justify-center when collapsed
    - Hide text label completely (not just opacity)
    - Show tooltip on hover with full label text

12. **Implement tooltip for collapsed state**
    - Show item.label in tooltip on hover
    - Position: Right side of sidebar
    - Use Radix UI Tooltip or custom solution
    - Delay: 300ms before showing
    - Background: bg-gray-900, text-white

13. **Add nested item indentation**
    - Use depth prop to calculate indentation
    - Formula: paddingLeft = baseLeft + (depth × indentSize)
    - Example: pl-8 for depth 1, pl-12 for depth 2
    - Only in expanded state

14. **Implement badge display (optional)**
    - If item.badge exists, show badge
    - Position: Right side of item (ml-auto)
    - Style: Small pill (text-xs, px-2, py-1, rounded-full)
    - Color: bg-red-500 for notifications, bg-blue-500 for count
    - Hide badge in collapsed state

15. **Add accessibility attributes**
    - aria-label with item.label
    - aria-current="page" if active
    - role="menuitem" for navigation context
    - Ensure keyboard navigable (focusable link)

16. **Update index barrel export**
    - Add NavItem to index.ts exports

### NavItem States Diagram

```
Default State
┌────────────────────────────┐
│ [📊]  Dashboard            │  ← Gray text, no background
└────────────────────────────┘


Active State
┌────────────────────────────┐
│ ▌[📊]  Dashboard           │  ← Primary color, accent border
└────────────────────────────┘
  ↑ Border accent


Hover State (not active)
┌────────────────────────────┐
│ [📊]  Dashboard            │  ← Light gray background
└────────────────────────────┘


Collapsed State
┌──────────┐
│   [📊]   │  ← Icon only, centered, tooltip on hover
└──────────┘
```

### Expected Outcome
```
frontend/
└── components/
    └── layout/
        └── Sidebar/
            ├── Sidebar.tsx
            ├── SidebarNav.tsx
            ├── NavItem.tsx          # Single menu item component
            └── index.ts             # Updated exports
```

### Verification Checklist
- [ ] NavItem.tsx file created
- [ ] TypeScript interface defined for props
- [ ] Next.js Link component used for navigation
- [ ] usePathname hook for active route detection
- [ ] Icon rendered from item.icon
- [ ] Label displayed in expanded state
- [ ] Active state styling implemented
- [ ] Hover state styling implemented
- [ ] Focus state styling implemented
- [ ] Collapsed state hides label, centers icon
- [ ] Tooltip shows in collapsed state
- [ ] Nested item indentation based on depth
- [ ] Badge display implemented (if item has badge)
- [ ] Accessibility attributes included
- [ ] Smooth transitions applied
- [ ] Component exported in index.ts

---

## Task 23: Create NavGroup Component

### Overview
Create the NavGroup component that represents a collapsible group of nested menu items in the sidebar navigation. This component manages its own expanded/collapsed state, renders a group header with a chevron indicator, and displays child NavItem components when expanded.

### Dependencies
- Task 20: Create Sidebar Navigation (parent component)
- Task 21: Define Navigation Menu Items (data structure)
- Task 22: Create NavItem Component (for children)
- Lucide React icons (ChevronDown, ChevronRight)
- React useState hook

### Instructions

1. **Create component file**
   - Create file `NavGroup.tsx` in the Sidebar directory
   - Set up functional component with TypeScript
   - Import NavItem component
   - Import MenuItem type and necessary hooks

2. **Define component props interface**
   - Create `NavGroupProps` interface
   - Properties:
     - `item`: MenuItem (group item with children)
     - `collapsed`: boolean (sidebar collapsed state)
     - `depth`: number (optional, for nested groups, default 0)
   - Add optional className for customization

3. **Implement group expanded state**
   - Use React useState hook for isExpanded state
   - Initialize to false (collapsed by default)
   - Store in component state (not global store)
   - Alternative: Store in localStorage with group id as key

4. **Implement active route detection for group**
   - Use Next.js usePathname hook
   - Check if any child item's path matches current path
   - Set isGroupActive to true if any child is active
   - Auto-expand group if a child is active

5. **Create group header button**
   - Use button element (type="button")
   - Full width: w-full
   - Flex layout: flex items-center gap-3
   - Text alignment: text-left
   - Clickable to toggle expansion

6. **Implement group header icon rendering**
   - Render item.icon component (group's main icon)
   - Icon size: 20x20px (w-5 h-5)
   - Icon color: text-gray-600 default, text-primary-600 if active
   - Position on left side

7. **Implement group header label rendering**
   - Display item.label text
   - Font size: text-sm (14px)
   - Font weight: font-medium default, font-semibold if active
   - Text color: text-gray-700 default, text-primary-700 if active
   - Hide in sidebar collapsed state

8. **Implement chevron indicator**
   - Use ChevronDown when group is expanded
   - Use ChevronRight when group is collapsed
   - Icon size: 16x16px (w-4 h-4)
   - Position: ml-auto (right side of header)
   - Transition: Rotate animation (transition-transform)

9. **Define group header styling**
   - Container: Rounded (rounded-md)
   - Padding: px-3 py-2 in expanded sidebar, px-2 in collapsed
   - Hover background: bg-gray-100
   - Active group: bg-primary-50 or bg-primary-100
   - Cursor: cursor-pointer

10. **Implement children container**
    - Wrapper div for child items
    - Animated height transition (max-height or height)
    - Overflow: hidden when collapsed
    - Padding: pt-1 for spacing
    - Conditional rendering based on isExpanded state

11. **Render child items**
    - Map over item.children array
    - Render NavItem for each child
    - Pass collapsed prop from parent
    - Pass depth + 1 for proper indentation
    - Apply spacing between children (space-y-1)

12. **Implement collapsed sidebar behavior**
    - Hide group header label and chevron
    - Center group icon only
    - Show tooltip with group label on hover
    - Expand children on hover or click (optional)
    - Alternative: Show children in a popover/flyout menu

13. **Add nested group indentation**
    - Use depth prop for indentation
    - Formula: paddingLeft = baseLeft + (depth × indentSize)
    - Example: pl-8 for depth 1
    - Apply to header, not individual children (they have own depth)

14. **Implement expand/collapse animation**
    - Smooth height transition for children container
    - Duration: 200-300ms
    - Easing: ease-in-out
    - Rotate animation for chevron (180deg)

15. **Add accessibility attributes**
    - aria-expanded attribute on header button
    - aria-controls pointing to children container id
    - role="button" on header
    - role="group" on children container
    - Keyboard support: Enter/Space to toggle, Arrow keys to navigate

16. **Handle group persistence (optional)**
    - Store isExpanded state in localStorage
    - Key: `sidebar-group-${item.id}`
    - Restore state on component mount
    - Clear on logout or reset

17. **Update index barrel export**
    - Add NavGroup to index.ts exports

### NavGroup States Diagram

```
Collapsed Group (not active)
┌────────────────────────────┐
│ [🛒]  Sales             [▶]│  ← Chevron right, children hidden
└────────────────────────────┘


Expanded Group (not active)
┌────────────────────────────┐
│ [🛒]  Sales             [▼]│  ← Chevron down, children visible
│    ├─ Orders               │
│    ├─ Invoices             │
│    └─ Quotes               │
└────────────────────────────┘


Active Group (child is active)
┌────────────────────────────┐
│ ▌[🛒]  Sales            [▼]│  ← Primary color, accent border
│    ├─ Orders               │
│    ├─▌Invoices (active)    │  ← Active child highlighted
│    └─ Quotes               │
└────────────────────────────┘


Sidebar Collapsed State
┌──────────┐
│   [🛒]   │  ← Icon only, tooltip on hover
└──────────┘    Flyout menu option →
```

### Expected Outcome
```
frontend/
└── components/
    └── layout/
        └── Sidebar/
            ├── Sidebar.tsx
            ├── SidebarHeader.tsx
            ├── Logo.tsx
            ├── CollapseToggle.tsx
            ├── SidebarNav.tsx
            ├── NavItem.tsx
            ├── NavGroup.tsx         # Collapsible group component
            └── index.ts             # Updated exports
```

### Verification Checklist
- [ ] NavGroup.tsx file created
- [ ] TypeScript interface defined for props
- [ ] useState hook for isExpanded state
- [ ] Active route detection for group (checks children)
- [ ] Group header button implemented
- [ ] Group icon rendered
- [ ] Group label displayed (hidden in collapsed sidebar)
- [ ] Chevron indicator with proper rotation
- [ ] Header styling (default, hover, active states)
- [ ] Children container with conditional rendering
- [ ] Child items mapped and rendered as NavItem
- [ ] Depth prop passed to children (depth + 1)
- [ ] Indentation applied to group based on depth
- [ ] Expand/collapse animation implemented
- [ ] Sidebar collapsed state behavior (tooltip, centered icon)
- [ ] Accessibility attributes included (aria-expanded, aria-controls)
- [ ] Keyboard navigation support
- [ ] Optional localStorage persistence implemented
- [ ] Component exported in index.ts

---

## Integration and Testing Notes

### Component Integration Order
1. Start with Sidebar container (Task 15)
2. Add SidebarHeader with Logo and Toggle (Tasks 16-18)
3. Connect to Zustand store (Task 19)
4. Add SidebarNav container (Task 20)
5. Define menu items (Task 21)
6. Implement NavItem for single items (Task 22)
7. Implement NavGroup for nested items (Task 23)

### State Flow
```
User clicks toggle button
        ↓
CollapseToggle calls toggleSidebar()
        ↓
Zustand store updates sidebarCollapsed state
        ↓
Sidebar component re-renders with new width
        ↓
All child components receive new collapsed prop
        ↓
UI updates with transitions
```

### Testing Considerations
- Verify smooth transitions between expanded/collapsed states
- Test keyboard navigation (Tab, Enter, Arrow keys)
- Verify active state highlighting on current route
- Test nested group expansion and collapse
- Verify menu item permissions filtering (when implemented)
- Test responsive behavior at different breakpoints
- Verify state persistence across page refreshes (localStorage)
- Test with different user roles and permissions
- Verify accessibility with screen readers
- Test tooltip display in collapsed state

### Performance Considerations
- Memoize menu items to prevent unnecessary re-renders
- Use React.memo for NavItem and NavGroup if needed
- Debounce resize events for responsive behavior
- Lazy load icons or use tree-shaking to reduce bundle size
- Optimize animation performance (use transform instead of width when possible)

---

## Summary

This document covered the complete implementation of the sidebar navigation system for the ERP dashboard. The sidebar provides a responsive, accessible, and performant navigation experience with support for hierarchical menus, collapsible groups, active state tracking, and persistent user preferences.

### Key Deliverables
- **Sidebar Container:** Fixed-position, responsive container with smooth collapse/expand behavior
- **Header Components:** Logo and toggle button for sidebar control
- **State Management:** Zustand store integration for centralized state with localStorage persistence
- **Navigation Container:** Scrollable menu area with proper overflow handling
- **Menu Structure:** Comprehensive menu item definitions with icons, routes, and permissions
- **NavItem Component:** Single menu item with active state, hover effects, and accessibility
- **NavGroup Component:** Collapsible groups for nested navigation with animation

### Next Steps
After completing these tasks, proceed to:
- **Group C:** Header Component (search, notifications, user menu)
- **Group D:** Navigation Breadcrumbs (breadcrumb trail display)
- **Group E:** Responsive Design & Mobile (mobile navigation, overlay mode)

The sidebar navigation is now ready for integration with the dashboard layout and subsequent feature development.

