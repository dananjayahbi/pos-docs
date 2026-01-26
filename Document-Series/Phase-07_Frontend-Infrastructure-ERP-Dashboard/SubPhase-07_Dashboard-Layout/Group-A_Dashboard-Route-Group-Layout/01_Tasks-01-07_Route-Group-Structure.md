# Tasks 01-07: Dashboard Route Group Structure

> **Phase:** 07 - Frontend Infrastructure ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout Structure  
> **Group:** A - Dashboard Route Group Layout  
> **Document:** 01 of 01  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** None (Final document in group)

---

## Document Overview

This document covers the foundational implementation of the dashboard route group structure using Next.js App Router conventions. The dashboard route group establishes the main layout architecture for the entire ERP dashboard interface, including grid-based layout systems, loading states, and error boundaries. This implementation creates the structural foundation upon which all dashboard features will be built.

### Key Features
- **Next.js Route Groups:** Utilize parentheses-based route groups for layout organization without URL path segments
- **CSS Grid Architecture:** Implement responsive grid layout with fixed header, collapsible sidebar, and flexible content area
- **State Management Integration:** Connect Zustand UI store for centralized layout state control
- **Loading States:** Provide skeleton UI during page transitions and data fetching
- **Error Boundaries:** Implement graceful error handling with recovery mechanisms

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create (dashboard) Route Group | Low | 15 min |
| 02 | Create Dashboard Layout Component | Medium | 45 min |
| 03 | Define Layout Grid Structure | Medium | 40 min |
| 04 | Create Main Content Container | Medium | 35 min |
| 05 | Add Layout State Provider | Medium | 30 min |
| 06 | Create Layout Loading State | Low | 25 min |
| 07 | Create Layout Error Boundary | Medium | 35 min |

---

## Dashboard Architecture Overview

### Route Group Structure

```
app/
├── (dashboard)/                    ← Route group (excluded from URL)
│   ├── layout.tsx                 ← Dashboard-wide layout
│   ├── loading.tsx                ← Loading state
│   ├── error.tsx                  ← Error boundary
│   │
│   ├── page.tsx                   ← Dashboard home (/dashboard)
│   ├── products/                  ← Product pages
│   │   ├── page.tsx               ← /dashboard/products
│   │   └── [id]/page.tsx          ← /dashboard/products/:id
│   │
│   ├── inventory/                 ← Inventory pages
│   ├── sales/                     ← Sales pages
│   └── ...                        ← Other dashboard sections
│
└── layout.tsx                     ← Root layout
```

### Layout Grid Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Header (64px fixed height)                                 │
│  - Logo, Navigation, User Menu, Notifications               │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ Sidebar  │  Main Content Area (scrollable)                  │
│ (240px   │  ┌─────────────────────────────────────────┐    │
│  wide,   │  │ Page Header                              │    │
│  or 72px │  ├─────────────────────────────────────────┤    │
│  when    │  │                                          │    │
│  collap- │  │ Content Container                        │    │
│  sed)    │  │ - Cards, Tables, Forms                   │    │
│          │  │ - Scrollable region                      │    │
│  - Nav   │  │                                          │    │
│  - Links │  │                                          │    │
│  - Icons │  │                                          │    │
│          │  └─────────────────────────────────────────┘    │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

### State Management Flow

```
UI Store (Zustand)
    ↓
Layout State
    ├── sidebarCollapsed: boolean
    ├── sidebarMobileOpen: boolean
    ├── headerHeight: number
    └── contentPadding: string
    ↓
Layout Components
    ├── DashboardLayout
    ├── Sidebar
    ├── Header
    └── MainContent
    ↓
Responsive Behavior
    ├── Desktop: Toggle sidebar collapse
    ├── Tablet: Collapsible sidebar
    └── Mobile: Overlay sidebar
```

### Component Hierarchy

```
layout.tsx (Server Component)
    └── UIStoreProvider (Client Component)
        └── DashboardLayout (Client Component)
            ├── Sidebar (Client Component)
            ├── Header (Client Component)
            └── MainContent (Server Component)
                └── {children} (Page content)
```

---

## Task 01: Create (dashboard) Route Group

### Overview
Create the (dashboard) route group directory that will contain all dashboard-related pages and layouts. Route groups in Next.js App Router use parentheses to organize routes without adding path segments to the URL structure, allowing for logical grouping and shared layouts without affecting the routing hierarchy.

### Dependencies
- Next.js project initialized (Phase 07, SubPhase 01)
- App directory structure exists

### Instructions

1. **Navigate to frontend app directory**
   - Open terminal in frontend project root
   - Navigate to the `app/` directory
   - Verify the directory structure is ready

2. **Create route group directory**
   - Create new directory named `(dashboard)` with parentheses
   - Ensure exact naming with lowercase and parentheses
   - The parentheses syntax excludes this segment from URLs

3. **Understand route group behavior**
   - Routes inside `(dashboard)` don't include "dashboard" in URL
   - Example: `(dashboard)/products/page.tsx` → `/products` not `/dashboard/products`
   - Shared layouts apply to all nested routes
   - Multiple route groups can exist at same level

4. **Verify directory creation**
   - Check that `app/(dashboard)/` exists
   - Ensure proper naming convention (lowercase, parentheses)
   - Confirm directory is tracked by Git

5. **Create placeholder .gitkeep (optional)**
   - Add `.gitkeep` file if needed for version control
   - Ensures empty directory is tracked by Git
   - Can be removed once actual files are added

### Expected Outcome
- Directory `app/(dashboard)/` exists and is properly named
- Ready to receive layout, loading, and error files
- Route group established for dashboard organization
- Version control tracking configured

### Verification Checklist
- [ ] Directory `app/(dashboard)/` created with correct naming
- [ ] Parentheses included in directory name
- [ ] Directory accessible in file system
- [ ] No build errors from Next.js
- [ ] Directory structure follows App Router conventions

---

## Task 02: Create Dashboard Layout Component

### Overview
Create the main dashboard layout component that defines the structural organization of the entire dashboard interface. This layout implements the grid-based architecture with sidebar, header, and content areas, and will be applied to all pages within the (dashboard) route group automatically through Next.js layout conventions.

### Dependencies
- (dashboard) route group created (Task 01)
- Tailwind CSS configured (Phase 07, SubPhase 02)
- Component library structure exists (Phase 07, SubPhase 03)

### Instructions

1. **Create layout file**
   - Navigate to `app/(dashboard)/` directory
   - Create `layout.tsx` file
   - This file automatically wraps all nested routes

2. **Import required dependencies**
   - Import React types (ReactNode, FC)
   - Import Next.js Metadata type
   - Import UIStoreProvider from state management
   - Import DashboardLayout component
   - Import global styles if needed

3. **Define metadata export**
   - Export metadata object with dashboard-specific values
   - Set title template: `%s | ERP Dashboard`
   - Set default title: `Dashboard`
   - Add description for SEO
   - Configure viewport settings

4. **Define layout props interface**
   - Create interface with `children` prop of type ReactNode
   - Add proper TypeScript typing
   - Keep interface simple and focused

5. **Create layout component structure**
   - Define async Server Component function
   - Accept children prop
   - Wrap with UIStoreProvider for state access
   - Nest DashboardLayout component inside
   - Pass children to DashboardLayout

6. **Configure component hierarchy**
   - Ensure proper nesting: Provider → Layout → Children
   - UIStoreProvider enables client-side state
   - DashboardLayout contains visual structure
   - Children render in main content area

7. **Add component documentation**
   - Include JSDoc comment explaining layout purpose
   - Document the rendering hierarchy
   - Note that layout applies to all nested routes
   - Explain state provider wrapping

8. **Handle server/client boundary**
   - Keep layout as Server Component
   - Use 'use client' directive only in necessary components
   - UIStoreProvider and DashboardLayout are client components
   - Children can be Server or Client Components

9. **Configure layout behavior**
   - Layout persists across page navigations
   - Shared state maintained via UIStoreProvider
   - Only children rerender on route changes
   - Layout mounts once per session

10. **Export layout component**
    - Use default export for Next.js convention
    - Name function descriptively: `DashboardRootLayout`
    - Follow Next.js layout file requirements

### Expected Outcome
- File `app/(dashboard)/layout.tsx` created and properly structured
- Layout automatically applies to all dashboard routes
- State provider wraps entire dashboard for shared state
- Server and client boundaries correctly managed
- Metadata configured for SEO and browser display
- Component properly documented with JSDoc comments

### Verification Checklist
- [ ] Layout file exists at correct path
- [ ] Metadata export configured with title template
- [ ] UIStoreProvider wraps DashboardLayout
- [ ] Children prop properly typed and passed
- [ ] Component hierarchy correctly structured
- [ ] Server/client boundaries properly set
- [ ] JSDoc documentation added
- [ ] No TypeScript errors
- [ ] Layout renders without console errors
- [ ] Navigation between dashboard pages works

---

## Task 03: Define Layout Grid Structure

### Overview
Implement the CSS Grid-based layout structure within the DashboardLayout component. This grid system creates responsive areas for the header, sidebar, and main content, with precise sizing and positioning. The grid adapts to sidebar collapse states and responsive breakpoints for optimal display across devices.

### Dependencies
- DashboardLayout component file created (Phase 07, SubPhase 07, related to Task 02)
- Tailwind CSS configured with Grid utilities
- UI store with layout state management exists

### Instructions

1. **Create DashboardLayout component file**
   - Navigate to `components/layout/` directory
   - Create `DashboardLayout.tsx` file
   - Add 'use client' directive at top (required for state access)

2. **Import required dependencies**
   - Import React and hooks (useEffect, useState)
   - Import useUIStore hook from store
   - Import Sidebar component
   - Import Header component
   - Import MainContent component
   - Import cn utility for className merging

3. **Define component props interface**
   - Create DashboardLayoutProps interface
   - Include `children` prop of type ReactNode
   - Add optional className prop for customization

4. **Setup state and store access**
   - Access UI store via useUIStore hook
   - Destructure sidebarCollapsed state
   - Destructure sidebar toggle functions
   - Setup any local component state if needed

5. **Define grid template structure**
   - Use CSS Grid with explicit template areas
   - Define rows: header (64px fixed) + content (1fr remaining)
   - Define columns: sidebar (dynamic width) + content (1fr remaining)
   - Sidebar width: 240px expanded, 72px collapsed

6. **Create grid area mapping**
   - Header spans full width: grid-column: 1 / -1
   - Sidebar occupies left column: grid-column: 1
   - Main content occupies right column: grid-column: 2
   - Ensure no overlapping areas

7. **Implement responsive grid classes**
   - Desktop (1024px+): Full grid with collapsible sidebar
   - Tablet (768px-1023px): Collapsed sidebar by default
   - Mobile (<768px): Overlay sidebar, full-width content

8. **Setup container element**
   - Use `<div>` as root container
   - Apply `h-screen w-full` for full viewport
   - Set `overflow-hidden` to prevent body scroll
   - Add `grid` class for CSS Grid layout

9. **Configure grid template classes**
   - Use Tailwind grid utilities: `grid-rows-[64px_1fr]`
   - Dynamic columns with transition: `transition-all duration-300`
   - Conditional column width based on sidebar state
   - Use template literal for dynamic grid-template-columns

10. **Add sidebar width transitions**
    - Animate sidebar width changes smoothly
    - Apply transition to grid column changes
    - Use ease-in-out timing function
    - Duration: 300ms for smooth animation

11. **Implement conditional styling**
    - Apply different grid templates based on collapsed state
    - Expanded: `grid-cols-[240px_1fr]`
    - Collapsed: `grid-cols-[72px_1fr]`
    - Mobile: `grid-cols-[0px_1fr]` (sidebar hidden)

12. **Add responsive breakpoints**
    - Use Tailwind responsive prefixes: sm:, md:, lg:, xl:
    - Adjust grid columns at each breakpoint
    - Handle mobile sidebar overlay separately
    - Maintain grid structure across breakpoints

13. **Render grid children**
    - Render Header component in header area
    - Render Sidebar component in sidebar area
    - Render MainContent with children in content area
    - Apply grid-area assignments to each

14. **Handle edge cases**
    - Prevent layout shift during transitions
    - Ensure minimum widths are respected
    - Handle mobile viewport height (vh vs dvh)
    - Account for touch device differences

15. **Add accessibility attributes**
    - Set appropriate ARIA labels
    - Ensure keyboard navigation works
    - Maintain focus management during transitions
    - Add role attributes where needed

### Expected Outcome
- DashboardLayout component implements full grid structure
- Three distinct areas: header, sidebar, main content
- Smooth transitions between collapsed/expanded states
- Responsive behavior across all device sizes
- No layout shift or overflow issues
- Accessible and keyboard-navigable interface

### Verification Checklist
- [ ] Grid layout renders with three distinct areas
- [ ] Header fixed at 64px height across full width
- [ ] Sidebar transitions smoothly between 240px and 72px
- [ ] Main content fills remaining space
- [ ] No horizontal scrollbar on any viewport size
- [ ] Transitions animate smoothly (300ms)
- [ ] Mobile viewport shows overlay sidebar
- [ ] Tablet viewport shows collapsed sidebar
- [ ] Desktop viewport shows full sidebar
- [ ] No layout shift during state changes
- [ ] Grid structure maintains proportions
- [ ] Accessibility attributes present

### Layout Grid CSS Visualization

```
Grid Template Areas (Expanded Sidebar):

grid-template-columns: 240px 1fr;
grid-template-rows: 64px 1fr;

┌─────────────────────────────────────────┐
│  Header Area (span 2 columns)          │  64px
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Main Content                │
│ (240px)  │  (remaining width)           │  1fr
│          │                              │
└──────────┴──────────────────────────────┘

Grid Template Areas (Collapsed Sidebar):

grid-template-columns: 72px 1fr;
grid-template-rows: 64px 1fr;

┌─────────────────────────────────────────┐
│  Header Area (span 2 columns)          │  64px
├────┬────────────────────────────────────┤
│    │                                    │
│ S  │  Main Content                      │
│ B  │  (more width available)            │  1fr
│    │                                    │
└────┴────────────────────────────────────┘
```

---

## Task 04: Create Main Content Container

### Overview
Create the MainContent component that serves as the scrollable container for dashboard page content. This component manages the content area's scroll behavior, padding, and responsive spacing, ensuring consistent presentation across all dashboard pages. It acts as the wrapper for the children passed from page components.

### Dependencies
- DashboardLayout grid structure defined (Task 03)
- Tailwind CSS spacing utilities configured
- UI store for accessing layout state

### Instructions

1. **Create MainContent component file**
   - Navigate to `components/layout/` directory
   - Create `MainContent.tsx` file
   - Keep as Server Component (no 'use client' needed)

2. **Import required dependencies**
   - Import React and ReactNode type
   - Import cn utility for className merging
   - No need for hooks (Server Component)

3. **Define component props interface**
   - Create MainContentProps interface
   - Include `children` prop of type ReactNode
   - Add optional `className` prop for custom styles
   - Add optional `noPadding` boolean for full-width content

4. **Setup component structure**
   - Define functional component accepting props
   - Destructure children, className, noPadding
   - Keep component simple and performant

5. **Create scroll container element**
   - Use `<main>` semantic HTML element
   - Apply `relative` positioning for absolute children
   - Set `overflow-y-auto` for vertical scrolling
   - Set `overflow-x-hidden` to prevent horizontal scroll

6. **Configure height calculation**
   - Use `h-[calc(100vh-64px)]` for full height minus header
   - Accounts for fixed 64px header height
   - Ensures no double scrollbars
   - Works with grid layout parent

7. **Add scrolling styles**
   - Apply smooth scrolling behavior
   - Use custom scrollbar styles (Tailwind plugin)
   - Set scrollbar width and colors
   - Hide scrollbar on mobile if desired

8. **Implement padding system**
   - Default padding: `p-6` (24px on all sides)
   - Responsive padding: `md:p-8` (32px on medium+)
   - Conditional: Remove padding if noPadding prop is true
   - Use cn utility to merge classes conditionally

9. **Add background styling**
   - Set background color: `bg-gray-50 dark:bg-gray-900`
   - Support light and dark modes
   - Ensure contrast with cards/components
   - Apply consistent theming

10. **Configure content width constraints**
    - Use `max-w-screen-2xl` for very wide screens
    - Center content with `mx-auto` on wide displays
    - Allow full width on smaller screens
    - Make constraint optional via props if needed

11. **Handle mobile viewport**
    - Adjust padding for mobile: `p-4` (16px)
    - Account for safe area insets on iOS
    - Consider mobile browser chrome
    - Test with different mobile browsers

12. **Add animation/transition**
    - Apply subtle fade-in for new content
    - Use transition classes for smooth navigation
    - Keep animations minimal (avoid janky scroll)
    - Consider reduced motion preferences

13. **Implement ARIA attributes**
    - Add `role="main"` (already implicit with main tag)
    - Set `aria-label="Dashboard content"`
    - Ensure semantic structure
    - Support screen readers

14. **Add scroll restoration behavior**
    - Allow browser scroll restoration
    - Consider scroll-to-top on route change
    - Preserve scroll for back navigation
    - Handle edge cases

15. **Create index export**
    - Export MainContent from layout index file
    - Include in component barrel export
    - Maintain clean import paths

### Expected Outcome
- MainContent component provides scrollable content area
- Height calculated correctly to fill available space
- Padding applied consistently across responsive breakpoints
- Smooth scrolling with customized scrollbar
- Background colors support light/dark modes
- Component accepts children and renders page content
- No scroll issues or layout shifts

### Verification Checklist
- [ ] MainContent component created as Server Component
- [ ] Scroll container works smoothly
- [ ] Height calculation correct (viewport minus header)
- [ ] No horizontal scroll at any viewport size
- [ ] Padding responsive across breakpoints
- [ ] noPadding prop works when enabled
- [ ] Background colors correct in both themes
- [ ] Content centered on ultra-wide screens
- [ ] Mobile padding appropriate
- [ ] Scrollbar styled consistently
- [ ] ARIA attributes present
- [ ] Component exported from index

### Content Container Scroll Behavior

```
Viewport Height: 100vh (1080px example)
Header Height: 64px (fixed)
Available Content Height: calc(100vh - 64px) = 1016px

┌─────────────────────────────────────────┐
│  Header (64px) - Fixed Position         │ ← Not scrollable
├─────────────────────────────────────────┤
│  Main Content Area (1016px)             │
│  ┌───────────────────────────────────┐  │ ← Scrollable
│  │ Padding: 24px                     │  │
│  │                                   │  │
│  │ Content (unlimited height)        │  │
│  │ ├─ Page Header                    │  │
│  │ ├─ Cards                          │  │
│  │ ├─ Tables                         │  │
│  │ ├─ Forms                          │  │
│  │ └─ ...more content...             │  │
│  │                                   │  │
│  │ [Scrollbar]                       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

Overflow Behavior:
- If content < 1016px: No scrollbar
- If content > 1016px: Scrollbar appears
- Horizontal scroll: Always hidden
```

---

## Task 05: Add Layout State Provider

### Overview
Integrate the UI state management provider that wraps the dashboard layout, enabling shared state across all layout components. The UIStoreProvider makes layout state (sidebar collapse, mobile menu, etc.) available to all child components through Zustand store access, allowing synchronized state updates across the header, sidebar, and content areas.

### Dependencies
- Zustand UI store configured (Phase 07, SubPhase 05)
- DashboardLayout component created (Task 02)
- UI store hooks exported and available

### Instructions

1. **Locate or create store provider file**
   - Navigate to `store/` or `lib/store/` directory
   - Open or create `providers.tsx` file
   - Add 'use client' directive (providers must be client components)

2. **Import Zustand store**
   - Import createContext and useContext from React
   - Import useRef and useEffect hooks
   - Import createStore from Zustand
   - Import store creation function

3. **Create store context**
   - Define UIStoreContext using createContext
   - Set initial value to null or undefined
   - Export context for hook usage
   - Add TypeScript types for context value

4. **Define provider props interface**
   - Create UIStoreProviderProps interface
   - Include `children` prop of type ReactNode
   - Add optional `initialState` for SSR compatibility
   - Keep interface flexible for future expansion

5. **Create provider component**
   - Define UIStoreProvider functional component
   - Accept children and optional initial state
   - Use useRef to store Zustand store instance
   - Initialize store on first render only

6. **Initialize store instance**
   - Create store instance in useRef (runs once)
   - Use useRef to prevent recreation on rerenders
   - Apply initial state if provided
   - Keep store reference stable across renders

7. **Handle store initialization**
   - Check if store already exists in ref
   - Create new store instance if needed
   - Apply default initial state values
   - Merge initial state with defaults

8. **Setup context provider value**
   - Pass store instance as context value
   - Ensure type safety with TypeScript
   - Keep value stable (memoization not needed with ref)

9. **Render provider structure**
   - Wrap children with UIStoreContext.Provider
   - Pass store instance as value prop
   - Ensure provider wraps all components needing state
   - Return children wrapped in provider

10. **Create useUIStore hook**
    - Define custom hook for accessing store
    - Use useContext to get store from context
    - Throw error if used outside provider
    - Return store with proper typing

11. **Add error handling**
    - Check if store exists in useUIStore
    - Throw descriptive error if provider missing
    - Provide helpful error message
    - Guide developers to wrap with provider

12. **Export provider and hook**
    - Export UIStoreProvider component
    - Export useUIStore hook
    - Export store types for TypeScript
    - Create barrel export in index file

13. **Integrate provider in layout**
    - Open `app/(dashboard)/layout.tsx`
    - Import UIStoreProvider
    - Wrap DashboardLayout with provider
    - Ensure proper component hierarchy

14. **Configure provider placement**
    - Provider should wrap all layout components
    - Place between layout root and DashboardLayout
    - Above Sidebar, Header, and MainContent
    - Below any auth or theme providers if present

15. **Test provider functionality**
    - Verify state accessible in all components
    - Test state updates propagate correctly
    - Check for hydration issues
    - Ensure no performance problems

### Expected Outcome
- UIStoreProvider wraps dashboard layout hierarchy
- All layout components can access shared state via useUIStore
- State updates propagate to all subscribed components
- No hydration mismatches between server and client
- Type-safe store access throughout application
- Error handling guides proper provider usage

### Verification Checklist
- [ ] UIStoreProvider component created with 'use client'
- [ ] UIStoreContext created and exported
- [ ] Store instance created with useRef
- [ ] useUIStore hook implemented with error handling
- [ ] Provider wraps DashboardLayout in layout.tsx
- [ ] Initial state can be provided optionally
- [ ] TypeScript types properly defined
- [ ] No hydration errors in console
- [ ] State accessible in Sidebar component
- [ ] State accessible in Header component
- [ ] State updates reflected across all components
- [ ] Error thrown when hook used outside provider

### State Provider Architecture

```
Layout Hierarchy with Provider:

app/(dashboard)/layout.tsx (Server Component)
    └── UIStoreProvider (Client Component)
            ↓ [Zustand Store Context]
            └── DashboardLayout (Client Component)
                    ├── Sidebar (Client Component)
                    │       └── useUIStore() → Access state
                    ├── Header (Client Component)
                    │       └── useUIStore() → Access state
                    └── MainContent (Server Component)
                            └── Page Content (Server/Client)

State Flow:

User Action (e.g., Click Sidebar Toggle)
    ↓
Component calls store action:
    const { toggleSidebar } = useUIStore()
    ↓
Zustand updates store state:
    sidebarCollapsed: false → true
    ↓
All subscribed components rerender:
    - Sidebar updates width
    - Header updates hamburger icon
    - DashboardLayout updates grid columns
    ↓
UI reflects new state (300ms transition)
```

### Store State Interface

```
UI Store State Structure:

interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  
  // Layout dimensions
  headerHeight: number;
  sidebarWidth: number;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

Default Initial State:
{
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  headerHeight: 64,
  sidebarWidth: 240
}
```

---

## Task 06: Create Layout Loading State

### Overview
Implement the loading.tsx file that provides a skeleton UI while dashboard pages and data are loading. Next.js automatically shows this loading state during page transitions and Suspense boundaries, creating a smooth user experience. The skeleton mimics the actual layout structure to minimize perceived layout shift.

### Dependencies
- Dashboard layout structure established (Tasks 01-05)
- Tailwind CSS animation utilities available
- Understanding of Next.js loading.tsx convention

### Instructions

1. **Create loading file**
   - Navigate to `app/(dashboard)/` directory
   - Create `loading.tsx` file (exact naming required)
   - Next.js automatically uses this during loading states

2. **Import required dependencies**
   - Import React (for JSX)
   - No hooks needed (static component)
   - Import skeleton components if created
   - Import cn utility if needed

3. **Define loading component structure**
   - Create default export function named `DashboardLoading`
   - Return skeleton UI matching dashboard layout
   - Keep component simple (no state or effects)

4. **Create header skeleton**
   - Replicate header dimensions: 64px height
   - Add animated pulse effect
   - Include placeholder shapes for logo, nav, user menu
   - Use gray backgrounds with shimmer animation

5. **Build sidebar skeleton**
   - Match sidebar dimensions: 240px width
   - Create skeleton for navigation items
   - Use rectangles for nav icons and labels
   - Apply pulse animation for loading effect

6. **Design content area skeleton**
   - Fill remaining space after header and sidebar
   - Create placeholder cards or blocks
   - Represent typical page content structure
   - Include skeleton for page header and content cards

7. **Implement pulse animation**
   - Use Tailwind's `animate-pulse` utility
   - Apply to all skeleton elements
   - Creates breathing/pulsing effect
   - Indicates active loading state

8. **Create skeleton card components**
   - Design reusable skeleton cards
   - Include header bar, content lines, action buttons
   - Vary heights for visual interest
   - Space cards with gaps matching actual layout

9. **Add gradient shimmer effect (optional)**
   - Create CSS gradient animation
   - Sweep across skeleton elements
   - More sophisticated than pulse
   - Configure with Tailwind config if used

10. **Match actual layout proportions**
    - Use same grid structure as DashboardLayout
    - Maintain header height (64px)
    - Match sidebar width (240px)
    - Ensure content area fills remaining space

11. **Create responsive skeleton**
    - Adjust for mobile: hide sidebar skeleton
    - Tablet: show collapsed sidebar skeleton
    - Desktop: show full sidebar skeleton
    - Use same breakpoints as actual layout

12. **Add accessibility attributes**
    - Set `aria-busy="true"` on container
    - Add `aria-label="Loading dashboard content"`
    - Include `role="status"` for screen readers
    - Ensure loading state is announced

13. **Optimize skeleton performance**
    - Keep DOM nodes minimal
    - Use CSS for animations (not JS)
    - Avoid complex calculations
    - Ensure fast render times

14. **Test loading behavior**
    - Verify appears during navigation
    - Check smooth transition to actual content
    - Test with slow network throttling
    - Ensure no layout shift on load complete

15. **Handle loading duration**
    - Skeleton should match expected load time perception
    - Not too simple (looks broken)
    - Not too complex (too much work)
    - Balance between information and simplicity

### Expected Outcome
- File `app/(dashboard)/loading.tsx` created
- Loading skeleton matches dashboard layout structure
- Animated pulse effect provides visual feedback
- Automatically shown during page transitions
- Minimal layout shift when actual content loads
- Responsive across all device sizes
- Accessible to screen readers

### Verification Checklist
- [ ] Loading file created in correct location
- [ ] Skeleton matches layout grid structure
- [ ] Header skeleton 64px height
- [ ] Sidebar skeleton 240px width (desktop)
- [ ] Content area skeleton fills remaining space
- [ ] Pulse animation applied to all elements
- [ ] Responsive skeleton for mobile/tablet
- [ ] ARIA attributes for accessibility
- [ ] Loading state appears during navigation
- [ ] Smooth transition to actual content
- [ ] No console errors
- [ ] Minimal layout shift on load complete

### Loading Skeleton Structure

```
Loading UI Hierarchy:

<div aria-busy="true" role="status">
  ┌─────────────────────────────────────────────────────┐
  │  Header Skeleton (64px)                             │
  │  ┌────┐  ┌─────────────┐  ┌────────┐              │
  │  │Logo│  │Nav Items... │  │ User   │  [Pulse]     │
  │  └────┘  └─────────────┘  └────────┘              │
  ├──────────┬──────────────────────────────────────────┤
  │          │                                          │
  │ Sidebar  │  Content Skeleton                        │
  │ (240px)  │  ┌────────────────────────────────┐    │
  │          │  │ Page Header Bar [Pulse]        │    │
  │ ┌──────┐ │  ├────────────────────────────────┤    │
  │ │ Nav  │ │  │ ┌──────────────┐  ┌──────────┐ │    │
  │ │ Item │ │  │ │ Card Skeleton│  │  Card    │ │    │
  │ ├──────┤ │  │ │  [Pulse]     │  │ Skeleton │ │    │
  │ │ Nav  │ │  │ │ ┌──────────┐ │  │ [Pulse]  │ │    │
  │ │ Item │ │  │ │ │ Lines... │ │  └──────────┘ │    │
  │ ├──────┤ │  │ │ └──────────┘ │               │    │
  │ │ Nav  │ │  │ └──────────────┘               │    │
  │ │ Item │ │  │                                 │    │
  │ └──────┘ │  └────────────────────────────────┘    │
  │          │                                          │
  │ [Pulse]  │                                          │
  └──────────┴──────────────────────────────────────────┘
</div>

Animation Timing:
- Pulse duration: 2s
- Iteration: infinite
- Timing function: cubic-bezier(0.4, 0, 0.6, 1)
- Opacity range: 1 → 0.5 → 1
```

---

## Task 07: Create Layout Error Boundary

### Overview
Implement the error.tsx file that catches and handles errors occurring within the dashboard layout and its child pages. Next.js error boundaries provide graceful error handling with recovery mechanisms, preventing full application crashes. This component displays user-friendly error messages and provides options to recover from errors without losing application state.

### Dependencies
- Dashboard layout structure established (Tasks 01-06)
- Next.js App Router error boundary conventions
- Error logging infrastructure (optional)

### Instructions

1. **Create error boundary file**
   - Navigate to `app/(dashboard)/` directory
   - Create `error.tsx` file (exact naming required)
   - Add 'use client' directive (error boundaries must be client components)

2. **Import required dependencies**
   - Import React and useEffect hook
   - Import Next.js Error type if available
   - Import error logging service (Sentry, etc.) if configured
   - Import UI components (Button, Card, Alert)

3. **Define error props interface**
   - Create ErrorBoundaryProps interface
   - Include `error` prop of type Error
   - Include `reset` function prop: () => void
   - Add proper TypeScript types

4. **Create error boundary component**
   - Define functional component accepting error and reset props
   - Use descriptive name: `DashboardErrorBoundary`
   - Keep component focused on error display and recovery

5. **Log error on mount**
   - Use useEffect to log error when component mounts
   - Send to error tracking service (Sentry, LogRocket, etc.)
   - Include error message, stack trace, user context
   - Log to console in development mode

6. **Create error display container**
   - Use semantic HTML structure
   - Center content vertically and horizontally
   - Apply appropriate spacing and padding
   - Match dashboard styling theme

7. **Design error message UI**
   - Display user-friendly error title
   - Show generic error message (avoid technical details)
   - Use icon to indicate error state (alert triangle)
   - Apply appropriate color scheme (red/yellow)

8. **Add error details section**
   - Show error message in collapsible details (dev mode only)
   - Include stack trace for debugging (dev mode only)
   - Hide technical details in production
   - Use monospace font for error text

9. **Implement reset/retry button**
   - Create prominent "Try Again" button
   - Call reset function on click
   - Reset clears error and rerenders children
   - Style as primary action button

10. **Add navigation options**
    - Include "Go to Dashboard Home" button
    - Link to safe fallback route
    - Provide "Report Issue" option
    - Give users multiple recovery paths

11. **Handle different error types**
    - Check error message or code for specific errors
    - Customize message for common error scenarios
    - Handle network errors differently from logic errors
    - Provide specific guidance based on error type

12. **Create error state visualization**
    - Design layout that matches dashboard structure
    - Include header and sidebar (non-interactive)
    - Show error in main content area
    - Maintain consistent look and feel

13. **Add accessibility features**
    - Set `role="alert"` on error container
    - Use `aria-live="assertive"` for announcements
    - Ensure keyboard navigation works
    - Provide screen reader friendly messages

14. **Implement error recovery logic**
    - Reset function attempts to remount children
    - Clear any error state in stores
    - Optionally refresh data
    - Guide user through recovery steps

15. **Test error boundary behavior**
    - Throw test errors to verify boundary catches them
    - Test reset functionality
    - Verify logging works correctly
    - Ensure boundary doesn't catch its own errors

### Expected Outcome
- File `app/(dashboard)/error.tsx` created with 'use client' directive
- Errors within dashboard automatically caught and displayed
- User-friendly error UI with recovery options
- Errors logged to tracking service
- Reset functionality allows recovery without page reload
- Accessible error display with proper ARIA attributes
- Different error types handled appropriately

### Verification Checklist
- [ ] Error boundary file created in correct location
- [ ] 'use client' directive included at top
- [ ] Error and reset props properly typed
- [ ] useEffect logs error on mount
- [ ] User-friendly error message displayed
- [ ] Technical details hidden in production
- [ ] "Try Again" button calls reset function
- [ ] Navigation options provided
- [ ] ARIA attributes for accessibility
- [ ] Error boundary catches thrown errors
- [ ] Reset successfully rerenders children
- [ ] No infinite error loops
- [ ] Styling matches dashboard theme
- [ ] Works across different error scenarios

### Error Boundary Flow Diagram

```
Error Occurrence Flow:

1. User navigates to /products
2. Page component throws error during render
        ↓
3. Error bubbles up to nearest error boundary
        ↓
4. error.tsx catches error
        ↓
5. useEffect logs error to service
        ↓
6. Error UI displays:
   ┌─────────────────────────────────────┐
   │  ⚠️  Something Went Wrong            │
   │                                      │
   │  We encountered an unexpected error. │
   │  Please try again.                   │
   │                                      │
   │  [Try Again] [Go to Dashboard]      │
   │                                      │
   │  (Error details in dev mode)         │
   └─────────────────────────────────────┘
        ↓
7. User clicks "Try Again"
        ↓
8. reset() function called
        ↓
9. Error cleared, children remount
        ↓
10. If successful: Normal page renders
    If fails again: Error boundary catches again
```

### Error Boundary Scope

```
Error Boundary Coverage:

app/(dashboard)/error.tsx catches errors in:
    ├── (dashboard)/layout.tsx children (not layout itself)
    ├── (dashboard)/page.tsx
    ├── (dashboard)/products/page.tsx
    ├── (dashboard)/products/[id]/page.tsx
    └── All other nested pages...

Does NOT catch errors in:
    ├── (dashboard)/layout.tsx (use parent error boundary)
    ├── Root layout.tsx (use global error boundary)
    └── Event handlers (use try-catch)

Multiple Error Boundaries:

app/
├── error.tsx (Global boundary)
├── (dashboard)/
│   ├── error.tsx (Dashboard boundary) ← This file
│   ├── products/
│   │   └── error.tsx (Products boundary - more specific)
│   └── ...

Closest boundary catches error first.
```

### Error UI Structure

```
Error Display Layout:

┌─────────────────────────────────────────────────────┐
│  Header (64px) - Visible but non-interactive        │
├──────────┬──────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │  Error Content Area (Centered)           │
│ (Visible │  ┌─────────────────────────────────┐    │
│  but     │  │ ┌─────────────────────────┐    │    │
│  non-    │  │ │   ⚠️ Error Icon          │    │    │
│  inter-  │  │ │                          │    │    │
│  active) │  │ │   Error Title            │    │    │
│          │  │ │   Error Message          │    │    │
│          │  │ │                          │    │    │
│          │  │ │   [Try Again Button]     │    │    │
│          │  │ │   [Go Home Button]       │    │    │
│          │  │ │                          │    │    │
│          │  │ │   <details> (Dev Only)   │    │    │
│          │  │ │     Error Stack Trace    │    │    │
│          │  │ │   </details>             │    │    │
│          │  │ └─────────────────────────┘    │    │
│          │  └─────────────────────────────────┘    │
│          │                                           │
└──────────┴──────────────────────────────────────────┘

Error Message Types:
- Generic: "Something went wrong"
- Network: "Unable to connect to server"
- Auth: "Session expired, please log in"
- Permission: "You don't have access to this resource"
- Not Found: "The requested resource was not found"
```

---

## Summary

This document covered the complete implementation of the dashboard route group structure, establishing the foundational layout architecture for the ERP dashboard. The seven tasks created:

1. **Route Group Directory** - Organized structure using Next.js conventions
2. **Layout Component** - Main wrapper with metadata and provider integration
3. **Grid Structure** - Responsive CSS Grid for header, sidebar, and content
4. **Content Container** - Scrollable main area with proper sizing
5. **State Provider** - Zustand integration for shared layout state
6. **Loading State** - Skeleton UI for smooth page transitions
7. **Error Boundary** - Graceful error handling with recovery options

### File Structure Created

```
frontend/
├── app/
│   └── (dashboard)/
│       ├── layout.tsx          (Task 02)
│       ├── loading.tsx         (Task 06)
│       └── error.tsx           (Task 07)
├── components/
│   └── layout/
│       ├── DashboardLayout.tsx (Task 03)
│       ├── MainContent.tsx     (Task 04)
│       └── index.ts
└── store/
    └── providers.tsx           (Task 05)
```

### Key Technical Decisions

- **Route Groups**: Parentheses notation excludes path segment from URLs
- **CSS Grid**: Three-area layout with fixed header, collapsible sidebar, dynamic content
- **State Management**: Zustand provider wraps layout for shared state access
- **Server/Client Split**: Strategic use of 'use client' directive only where needed
- **Error Handling**: Multiple layers of error boundaries for resilient UX
- **Loading States**: Skeleton UI matches actual layout to minimize perceived shift

### Integration Points

This layout structure integrates with:
- **SubPhase 02 (Tailwind)**: Grid utilities, responsive classes, animations
- **SubPhase 03 (Components)**: Sidebar, Header, Button, Card components
- **SubPhase 05 (State)**: Zustand UI store for layout state management
- **Future SubPhases**: All dashboard pages will inherit this layout automatically

### Next Steps

With the route group structure complete, subsequent tasks will implement:
- **Group B**: Sidebar component with navigation menu
- **Group C**: Header component with search, notifications, user menu
- **Group D**: Breadcrumb navigation system
- **Group E**: Responsive mobile optimizations
- **Group F**: Dashboard home page content

The foundation is now ready for building the complete dashboard interface on top of this robust layout architecture.
