# Phase-07: Frontend Infrastructure & ERP Dashboard
## SubPhase-07: Dashboard Layout
## Group-A: Dashboard Route Group Layout
## Document 02: Tasks 08-14 - Layout Features & Accessibility

**Tasks Covered**: 08-14  
**Document Version**: 1.0  
**Last Updated**: January 2026

---

## Navigation

**Parent**: [SubPhase-07: Dashboard Layout](../00_TASKS_SUMMARY.md)  
**Previous**: [01_Tasks-01-07: Route Group Structure](./01_Tasks-01-07_Route-Group-Structure.md)  
**Next**: [Group-B: Sidebar Component](../Group-B_Sidebar-Component/01_Tasks-15-21_Sidebar-Structure.md)

---

## Document Overview

This document covers the configuration of layout metadata, authentication guards, transitions, CSS variables, custom hooks, and accessibility features for the dashboard layout. These tasks enhance the user experience, ensure security, and meet accessibility standards.

### Tasks Summary

| Task | Title | Priority | Dependencies | Estimated Time |
|------|-------|----------|--------------|----------------|
| 08 | Configure Layout Metadata | High | Tasks 01-03 | 45 min |
| 09 | Add Auth Guard to Layout | Critical | Tasks 01-04 | 1 hour |
| 10 | Create Layout Transition Animation | Medium | Tasks 01-07 | 1.5 hours |
| 11 | Define Layout CSS Variables | High | Tasks 01-05 | 45 min |
| 12 | Create Layout Hooks | High | Tasks 01-07, 11 | 1.5 hours |
| 13 | Add Skip Navigation Link | High | Tasks 01-03 | 45 min |
| 14 | Verify Layout Structure | Critical | Tasks 01-13 | 1 hour |

**Total Estimated Time**: 7 hours

---

## Task 08: Configure Layout Metadata

### Overview

Configure default SEO metadata for all dashboard pages using Next.js Metadata API. This ensures proper search engine indexing, social media sharing, and browser tab information for the ERP dashboard.

### Dependencies

- **Prerequisites**: Tasks 01-03 (Dashboard layout file created)
- **Knowledge Requirements**: Next.js 14 Metadata API, SEO best practices
- **Technical Stack**: Next.js App Router, TypeScript

### Instructions

#### Step 1: Define Default Dashboard Metadata

1. Open the dashboard layout file at `app/(dashboard)/layout.tsx`
2. Import the Metadata type from Next.js at the top of the file
3. Export a metadata object with the following properties:
   - Title template pattern for all dashboard pages
   - Default title fallback
   - Description for dashboard section
   - Robots directives (noindex for authenticated areas)
   - Viewport configuration for responsive design
4. Set the title template to include the application name suffix
5. Configure robots to prevent indexing of authenticated content

#### Step 2: Configure Viewport Settings

1. Add viewport metadata for responsive behavior
2. Set initial scale to 1.0
3. Configure width to device-width
4. Set maximum scale for accessibility
5. Enable user scalability for accessibility compliance

#### Step 3: Add Application Metadata

1. Define applicationName in metadata
2. Set generator field to Next.js
3. Add keywords relevant to ERP dashboard
4. Configure referrer policy for security
5. Set color scheme preference (light/dark support)

#### Step 4: Configure Icons and Manifest

1. Add favicon references in metadata
2. Configure apple-touch-icon for iOS devices
3. Reference manifest.json for PWA capabilities
4. Set theme color for mobile browsers
5. Add og:image for social sharing (dashboard preview)

#### Step 5: Test Metadata Rendering

1. Start the development server
2. Navigate to any dashboard route
3. Inspect the page source HTML
4. Verify all meta tags are present in the head section
5. Test title updates when navigating between pages

### Expected Outcome

```
Metadata Structure:
===================

<head>
  <title>Dashboard | POS-ERP System</title>
  <meta name="description" content="..." />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
  <meta name="application-name" content="POS-ERP" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="manifest" href="/manifest.json" />
</head>
```

All dashboard pages inherit this metadata configuration with customizable page-specific titles.

### Verification Checklist

- [ ] Metadata object exported from layout file
- [ ] Title template includes application name
- [ ] Robots meta prevents indexing of authenticated pages
- [ ] Viewport configured for responsive design with accessibility
- [ ] Application name and description set
- [ ] Favicon and icons configured
- [ ] Browser tab shows correct title format
- [ ] Page source contains all expected meta tags

---

## Task 09: Add Auth Guard to Layout

### Overview

Implement authentication protection for the entire dashboard layout using a ProtectedRoute wrapper component. This ensures that only authenticated users can access dashboard pages, with automatic redirection to login for unauthenticated visitors.

### Dependencies

- **Prerequisites**: Tasks 01-04 (Layout structure created)
- **Knowledge Requirements**: Next.js authentication patterns, redirect handling
- **Technical Stack**: Next.js Server Components, Authentication context

### Instructions

#### Step 1: Create ProtectedRoute Component

1. Create new file `components/auth/ProtectedRoute.tsx`
2. Define component that accepts children as props
3. Mark component as async to support server-side auth checks
4. Import redirect function from next/navigation
5. Define TypeScript interface for component props

#### Step 2: Implement Authentication Check

1. Inside ProtectedRoute, check authentication status
2. Use server-side session validation (cookies or headers)
3. Retrieve current user information if authenticated
4. Handle both authenticated and unauthenticated states
5. Prepare redirect URL for unauthenticated users

#### Step 3: Handle Unauthenticated State

1. If user is not authenticated, construct redirect URL
2. Include return URL query parameter for post-login redirect
3. Use redirect function to send user to login page
4. Ensure redirect includes current path for seamless return
5. Return null or empty fragment after redirect call

#### Step 4: Handle Authenticated State

1. If user is authenticated, render children components
2. Optionally pass user data through context or props
3. Ensure layout and page components receive auth status
4. Handle loading states during auth check
5. Provide error boundaries for auth failures

#### Step 5: Wrap Dashboard Layout

1. Open dashboard layout file `app/(dashboard)/layout.tsx`
2. Import the ProtectedRoute component
3. Wrap the existing layout structure with ProtectedRoute
4. Ensure children are passed through correctly
5. Test authentication flow with authenticated and unauthenticated states

### Expected Outcome

```
Authentication Flow:
====================

User Access Request
        |
        v
    Is Authenticated?
        |
        +-- No --> Redirect to Login
        |         (with returnUrl)
        |
        +-- Yes --> Render Dashboard
                    (with user context)


Protected Route Hierarchy:
==========================

app/(dashboard)/layout.tsx
    |
    └── ProtectedRoute
            |
            └── DashboardLayout
                    |
                    ├── Sidebar
                    ├── Header
                    └── {children}
```

All routes under the dashboard group are automatically protected without additional configuration.

### Verification Checklist

- [ ] ProtectedRoute component created in auth folder
- [ ] Server-side authentication check implemented
- [ ] Redirect to login configured with return URL
- [ ] Dashboard layout wrapped with ProtectedRoute
- [ ] Authenticated users can access dashboard
- [ ] Unauthenticated users redirected to login
- [ ] Return URL preserved for post-login redirect
- [ ] No flash of unauthenticated content (FOUC)

---

## Task 10: Create Layout Transition Animation

### Overview

Implement smooth page transitions within the dashboard layout using CSS animations and Framer Motion. This enhances user experience by providing visual feedback during navigation and creating a polished, professional interface.

### Dependencies

- **Prerequisites**: Tasks 01-07 (Complete layout structure)
- **Knowledge Requirements**: CSS animations, Framer Motion API, Next.js transitions
- **Technical Stack**: Framer Motion, CSS Variables, Next.js App Router

### Instructions

#### Step 1: Install Framer Motion

1. Open terminal in the frontend directory
2. Install framer-motion package using npm or yarn
3. Verify installation in package.json
4. Restart development server if running
5. Check for any peer dependency warnings

#### Step 2: Create Transition Component

1. Create new file `components/layout/PageTransition.tsx`
2. Import motion components from framer-motion
3. Define transition variants for enter and exit animations
4. Create component that wraps page content
5. Export component with TypeScript props interface

#### Step 3: Define Animation Variants

1. Create initial variant (page load state):
   - Opacity: 0
   - Transform: translateY(10px)
   - Duration: 0ms
2. Create animate variant (visible state):
   - Opacity: 1
   - Transform: translateY(0)
   - Duration: 200ms
   - Easing: ease-out
3. Create exit variant (page unload state):
   - Opacity: 0
   - Transform: translateY(-10px)
   - Duration: 150ms
   - Easing: ease-in
4. Configure stagger for multiple elements if needed
5. Set layout transition for responsive changes

#### Step 4: Apply Transition to Main Content

1. Open dashboard layout file `app/(dashboard)/layout.tsx`
2. Import PageTransition component
3. Wrap the main content area (children) with PageTransition
4. Ensure transition doesn't affect sidebar or header
5. Add unique key based on pathname for re-mounting

#### Step 5: Add CSS Transition Support

1. Create or update global styles for transitions
2. Add transition properties for common state changes:
   - Color transitions (200ms)
   - Background transitions (200ms)
   - Border transitions (200ms)
   - Transform transitions (300ms)
3. Use CSS custom properties for timing values
4. Add reduced-motion media query for accessibility
5. Test transitions across different pages

#### Step 6: Implement Loading State Transition

1. Create loading skeleton animation
2. Define fade-in transition for content appearance
3. Add shimmer effect for loading states
4. Configure suspense boundaries with transitions
5. Test with slow network throttling

### Expected Outcome

```
Transition Flow:
================

Page A (Current)
    |
    | User Clicks Link
    v
Exit Animation (150ms)
    |
    | - Fade out (opacity: 1 → 0)
    | - Slide up (translateY: 0 → -10px)
    v
Route Change
    |
    v
Enter Animation (200ms)
    |
    | - Fade in (opacity: 0 → 1)
    | - Slide down (translateY: 10px → 0)
    v
Page B (New)


Reduced Motion Support:
=======================

@media (prefers-reduced-motion: reduce) {
  - Disable translateY animations
  - Keep fade transitions
  - Reduce duration to 100ms
  - Remove complex keyframes
}
```

Navigation between dashboard pages includes smooth, subtle transitions that don't distract from content.

### Verification Checklist

- [ ] Framer Motion installed and configured
- [ ] PageTransition component created
- [ ] Animation variants defined (initial, animate, exit)
- [ ] Transitions applied to main content area
- [ ] Sidebar and header remain static during transitions
- [ ] Transitions respect prefers-reduced-motion
- [ ] No janky or stuttering animations
- [ ] Loading states include transition effects
- [ ] Transitions work on all dashboard routes
- [ ] Performance impact is minimal (no lag)

---

## Task 11: Define Layout CSS Variables

### Overview

Create a comprehensive set of CSS custom properties (variables) that define layout dimensions, spacing, timing, and other reusable values. This ensures consistency across the dashboard and enables easy theming and responsive adjustments.

### Dependencies

- **Prerequisites**: Tasks 01-05 (Layout structure with styling)
- **Knowledge Requirements**: CSS custom properties, design tokens, responsive design
- **Technical Stack**: CSS Variables, Tailwind CSS, CSS Modules

### Instructions

#### Step 1: Create Layout Variables File

1. Create new file `styles/layout-variables.css` in frontend directory
2. Define :root selector for global variable scope
3. Organize variables into logical groups with comments
4. Use kebab-case naming convention for all variables
5. Document each variable with inline comments

#### Step 2: Define Dimension Variables

1. Create sidebar width variables:
   - --sidebar-width: 240px (expanded state)
   - --sidebar-width-collapsed: 64px (collapsed state)
   - --sidebar-transition-duration: 300ms
2. Create header height variables:
   - --header-height: 64px (desktop)
   - --header-height-mobile: 56px (mobile)
3. Create footer height variable:
   - --footer-height: 48px
4. Create content padding variables:
   - --content-padding: 24px (desktop)
   - --content-padding-mobile: 16px (mobile)
5. Create max content width:
   - --content-max-width: 1440px

#### Step 3: Define Spacing Variables

1. Create layout gap variables:
   - --layout-gap: 24px
   - --layout-gap-sm: 16px
   - --layout-gap-lg: 32px
2. Create border radius variables:
   - --layout-border-radius: 8px
   - --layout-border-radius-sm: 4px
   - --layout-border-radius-lg: 12px
3. Create z-index layer variables:
   - --z-sidebar: 1000
   - --z-header: 1100
   - --z-modal: 1200
   - --z-dropdown: 1150
   - --z-tooltip: 1300

#### Step 4: Define Timing and Animation Variables

1. Create transition duration variables:
   - --transition-fast: 150ms
   - --transition-base: 200ms
   - --transition-slow: 300ms
2. Create easing function variables:
   - --ease-in: cubic-bezier(0.4, 0, 1, 1)
   - --ease-out: cubic-bezier(0, 0, 0.2, 1)
   - --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
3. Create animation delay variables:
   - --animation-delay: 50ms
   - --animation-stagger: 100ms

#### Step 5: Define Responsive Breakpoint References

1. Create breakpoint reference comments:
   - Breakpoint values (documented, not variables)
   - Mobile: 0-640px
   - Tablet: 641-1024px
   - Desktop: 1025px+
2. Create container query variables:
   - --container-sm: 640px
   - --container-md: 768px
   - --container-lg: 1024px
   - --container-xl: 1280px

#### Step 6: Import Variables into Global Styles

1. Open or create `styles/globals.css`
2. Import layout-variables.css at the top
3. Ensure variables are available throughout the application
4. Test variable access in component styles
5. Create fallback values where appropriate

#### Step 7: Create Responsive Variable Overrides

1. Add media query for mobile devices
2. Override dimension variables for mobile:
   - Reduce header height
   - Adjust content padding
   - Modify spacing values
3. Add media query for tablet devices
4. Add media query for large desktop screens
5. Test responsive behavior across breakpoints

### Expected Outcome

```
CSS Variables Structure:
========================

:root {
  /* Dimensions */
  --sidebar-width: 240px
  --header-height: 64px
  --content-padding: 24px
  
  /* Spacing */
  --layout-gap: 24px
  --layout-border-radius: 8px
  
  /* Z-Index */
  --z-sidebar: 1000
  --z-header: 1100
  
  /* Timing */
  --transition-base: 200ms
  --ease-out: cubic-bezier(...)
}

@media (max-width: 640px) {
  :root {
    --header-height: 56px
    --content-padding: 16px
  }
}


Usage in Components:
====================

.sidebar {
  width: var(--sidebar-width);
  transition: width var(--transition-base) var(--ease-out);
}

.header {
  height: var(--header-height);
  z-index: var(--z-header);
}
```

All layout components use consistent values through CSS variables, enabling easy theming and maintenance.

### Verification Checklist

- [ ] layout-variables.css file created
- [ ] All dimension variables defined with appropriate values
- [ ] Spacing and border radius variables defined
- [ ] Z-index layer system established
- [ ] Timing and easing variables configured
- [ ] Variables imported into global styles
- [ ] Responsive overrides configured for mobile/tablet
- [ ] Variables accessible in all component styles
- [ ] Naming convention consistent across all variables
- [ ] Documentation comments provided for each group

---

## Task 12: Create Layout Hooks

### Overview

Develop custom React hooks that provide layout state management and utility functions. These hooks enable components to access layout dimensions, toggle sidebar state, and respond to layout changes consistently across the dashboard.

### Dependencies

- **Prerequisites**: Tasks 01-07, 11 (Layout structure and CSS variables)
- **Knowledge Requirements**: React Hooks API, Context API, TypeScript
- **Technical Stack**: React 18, Next.js 14, TypeScript, CSS Variables

### Instructions

#### Step 1: Create Layout Context

1. Create new file `context/LayoutContext.tsx`
2. Define LayoutContext interface with TypeScript:
   - sidebarOpen: boolean
   - sidebarCollapsed: boolean
   - toggleSidebar: function
   - setSidebarCollapsed: function
3. Create LayoutContext using React.createContext
4. Define default values for context
5. Export context for use in hooks

#### Step 2: Create Layout Provider Component

1. In the same file, create LayoutProvider component
2. Use useState to manage sidebar state:
   - sidebarOpen (mobile toggle)
   - sidebarCollapsed (desktop collapse)
3. Create toggle functions for state management
4. Implement useEffect to handle responsive behavior
5. Provide context value to children components

#### Step 3: Create useLayout Hook

1. Create new file `hooks/useLayout.ts`
2. Define useLayout hook function
3. Use useContext to access LayoutContext
4. Throw error if hook is used outside provider
5. Return layout state and utility functions
6. Export hook with TypeScript return type

#### Step 4: Create useSidebarState Hook

1. In the same hooks file, define useSidebarState hook
2. Access sidebar-specific state from context
3. Return only sidebar-related state and functions:
   - isOpen: boolean (current open state)
   - isCollapsed: boolean (collapsed state)
   - toggle: function (toggle open/closed)
   - collapse: function (set collapsed)
   - expand: function (set expanded)
4. Add TypeScript return interface
5. Export hook for component use

#### Step 5: Create useLayoutDimensions Hook

1. Define useLayoutDimensions hook in hooks file
2. Use useState to store current dimensions
3. Use useEffect to read CSS variables:
   - Read --sidebar-width from computed styles
   - Read --header-height from computed styles
   - Read --content-padding from computed styles
4. Update dimensions on window resize with debounce
5. Return dimensions object with TypeScript interface
6. Clean up event listeners on unmount

#### Step 6: Add Responsive Detection Hook

1. Create useMediaQuery helper hook
2. Accept breakpoint parameter (mobile, tablet, desktop)
3. Use window.matchMedia to detect screen size
4. Return boolean indicating if query matches
5. Update on window resize events
6. Use in layout components for responsive behavior

#### Step 7: Integrate Hooks into Layout

1. Open dashboard layout file `app/(dashboard)/layout.tsx`
2. Wrap layout with LayoutProvider at the root
3. Update Sidebar component to use useSidebarState
4. Update Header component to use useLayout
5. Test hook functionality across different components
6. Verify state synchronization between components

### Expected Outcome

```
Hook Architecture:
==================

LayoutProvider (Context)
    |
    ├── sidebarOpen: boolean
    ├── sidebarCollapsed: boolean
    ├── toggleSidebar()
    └── setSidebarCollapsed()
    
useLayout() Hook
    └── Returns full layout state + functions

useSidebarState() Hook
    └── Returns sidebar-specific state

useLayoutDimensions() Hook
    └── Returns computed layout dimensions

useMediaQuery(breakpoint) Hook
    └── Returns boolean for responsive queries


Usage Pattern:
==============

Component Level:
    |
    └── import { useLayout } from '@/hooks/useLayout'
        |
        └── const { sidebarOpen, toggleSidebar } = useLayout()
            |
            └── <button onClick={toggleSidebar}>Toggle</button>


State Flow:
===========

User Action (Toggle Button)
    |
    v
toggleSidebar() called
    |
    v
Context State Updated
    |
    v
All Consuming Components Re-render
    |
    v
Layout Adjusts (CSS transitions)
```

Components throughout the dashboard can access and modify layout state consistently through custom hooks.

### Verification Checklist

- [ ] LayoutContext created with proper TypeScript types
- [ ] LayoutProvider component wraps dashboard layout
- [ ] useLayout hook returns complete layout state
- [ ] useSidebarState hook returns sidebar-specific state
- [ ] useLayoutDimensions hook returns computed CSS values
- [ ] useMediaQuery hook detects responsive breakpoints
- [ ] Hooks throw errors when used outside provider
- [ ] Sidebar state synchronizes across all components
- [ ] Responsive behavior works correctly with hooks
- [ ] No unnecessary re-renders or performance issues

---

## Task 13: Add Skip Navigation Link

### Overview

Implement a skip navigation link for keyboard users and screen reader users to bypass repetitive navigation elements and jump directly to main content. This is a WCAG 2.1 Level A requirement and significantly improves accessibility for users with disabilities.

### Dependencies

- **Prerequisites**: Tasks 01-03 (Layout structure with main content)
- **Knowledge Requirements**: WCAG accessibility guidelines, keyboard navigation, ARIA
- **Technical Stack**: React, CSS, HTML5 semantics

### Instructions

#### Step 1: Create SkipNavigation Component

1. Create new file `components/layout/SkipNavigation.tsx`
2. Define functional component with no props
3. Create anchor link that targets main content ID
4. Set link text to "Skip to main content"
5. Export component with TypeScript types

#### Step 2: Style Skip Link with CSS

1. Create associated CSS module or styled component
2. Position link absolutely at top-left of viewport
3. Set initial state to be visually hidden but screen-reader accessible:
   - Position: absolute
   - Top: -40px (off-screen)
   - Left: 8px
   - Z-index: var(--z-tooltip) or 9999
4. Style focus state to be visible:
   - Top: 8px (on-screen)
   - Background: primary color with high contrast
   - Padding: 8px 16px
   - Border radius: 4px
   - Font weight: 600
5. Add focus ring with high contrast (3:1 minimum)
6. Add smooth transition for focus state appearance

#### Step 3: Add Main Content ID

1. Open dashboard layout file `app/(dashboard)/layout.tsx`
2. Locate the main content container element
3. Add id="main-content" to the main or article element
4. Ensure ID is unique and not duplicated
5. Verify main element has proper semantic role

#### Step 4: Integrate Skip Link into Layout

1. In dashboard layout file, import SkipNavigation component
2. Place component as the first child in the layout structure
3. Ensure it appears before header, sidebar, and all other content
4. Position it above ProtectedRoute if auth guard is present
5. Test that it's the first focusable element on the page

#### Step 5: Test Keyboard Navigation

1. Load dashboard page in browser
2. Press Tab key (first focus should be skip link)
3. Verify skip link becomes visible on focus
4. Press Enter to activate skip link
5. Verify focus moves to main content area
6. Test with keyboard navigation from start to finish
7. Ensure tab order is logical after skipping

#### Step 6: Test Screen Reader Compatibility

1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate to dashboard page
3. Verify skip link is announced as first interactive element
4. Activate skip link using screen reader commands
5. Verify focus moves to main content
6. Test with multiple screen readers if possible
7. Ensure no duplicate announcements or confusion

### Expected Outcome

```
Skip Navigation Flow:
=====================

Page Load
    |
    v
First Tab Press
    |
    v
Skip Link Receives Focus
    |
    | (Link becomes visible)
    v
User Presses Enter (Optional)
    |
    v
Focus Moves to #main-content
    |
    v
User bypasses Header + Sidebar
    |
    v
Direct interaction with page content


Visual State:
=============

Default (Hidden):
    ┌─────────────────────────┐
    │ (Skip link off-screen)  │ ← Not visible
    │─────────────────────────│
    │ Header                  │
    │─────────────────────────│
    │ S │ Main Content        │
    │ i │                     │
    │ d │                     │
    │ e │                     │

Focused (Visible):
    ┌─────────────────────────┐
    │ ╔═══════════════════╗   │
    │ ║ Skip to main      ║   │ ← Visible with focus
    │ ╚═══════════════════╝   │
    │─────────────────────────│
    │ Header                  │


Accessibility Tree:
===================

<body>
  <a href="#main-content">Skip to main content</a> ← First in tab order
  <ProtectedRoute>
    <header>...</header>
    <aside>...</aside>
    <main id="main-content" tabindex="-1"> ← Target for skip link
      {content}
    </main>
  </ProtectedRoute>
</body>
```

Keyboard and screen reader users can efficiently bypass navigation to access main content, meeting WCAG Level A requirements.

### Verification Checklist

- [ ] SkipNavigation component created
- [ ] Skip link is first focusable element on page
- [ ] Link is visually hidden by default
- [ ] Link becomes visible when focused
- [ ] Link has sufficient color contrast (4.5:1 minimum)
- [ ] Main content has id="main-content"
- [ ] Link successfully moves focus to main content
- [ ] Tab key shows skip link before any other element
- [ ] Screen reader announces skip link correctly
- [ ] Skip link works in all major browsers
- [ ] WCAG 2.1 Level A requirement met (2.4.1 Bypass Blocks)

---

## Task 14: Verify Layout Structure

### Overview

Perform comprehensive verification of the complete dashboard layout structure, ensuring all components work together correctly, accessibility standards are met, performance is optimized, and the layout is production-ready.

### Dependencies

- **Prerequisites**: Tasks 01-13 (All layout tasks completed)
- **Knowledge Requirements**: Testing methodologies, accessibility auditing, performance analysis
- **Technical Stack**: Browser DevTools, Lighthouse, accessibility tools

### Instructions

#### Step 1: Verify File Structure

1. Confirm all layout files exist in correct locations:
   - `app/(dashboard)/layout.tsx`
   - `components/layout/Sidebar.tsx`
   - `components/layout/Header.tsx`
   - `components/layout/Footer.tsx`
   - `components/layout/PageTransition.tsx`
   - `components/layout/SkipNavigation.tsx`
   - `components/auth/ProtectedRoute.tsx`
   - `hooks/useLayout.ts`
   - `context/LayoutContext.tsx`
   - `styles/layout-variables.css`
2. Check for proper directory organization
3. Verify naming conventions are consistent
4. Ensure no duplicate or conflicting files
5. Review import paths for correctness

#### Step 2: Test Layout Rendering

1. Start development server and load dashboard
2. Verify all layout components render correctly:
   - Header appears at top with correct height
   - Sidebar appears at left with correct width
   - Main content area positioned correctly
   - Footer appears at bottom if present
3. Check for any console errors or warnings
4. Verify no hydration mismatches (Next.js specific)
5. Test with browser DevTools React component inspector

#### Step 3: Test Responsive Behavior

1. Open browser DevTools responsive design mode
2. Test mobile viewport (320px - 640px):
   - Sidebar collapses to overlay mode
   - Header height adjusts appropriately
   - Content padding reduces for mobile
   - Touch targets are minimum 44x44px
3. Test tablet viewport (641px - 1024px):
   - Layout adapts smoothly
   - Sidebar remains visible or toggleable
   - Content width adjusts appropriately
4. Test desktop viewport (1025px+):
   - Full layout with expanded sidebar
   - Maximum content width respected
   - No horizontal overflow
5. Test responsive transitions between breakpoints
6. Verify no content clipping or overflow issues

#### Step 4: Test Interactive Features

1. Test sidebar toggle functionality:
   - Click toggle button in header
   - Verify sidebar opens/closes smoothly
   - Check transition animations
   - Test on mobile and desktop
2. Test sidebar collapse functionality (desktop):
   - Click collapse button in sidebar
   - Verify width changes from 240px to 64px
   - Check icon-only menu items appear
   - Test expand functionality
3. Test navigation between dashboard pages:
   - Click various navigation links
   - Verify page transitions work smoothly
   - Check content updates correctly
   - Ensure no flash of unstyled content
4. Test skip navigation link:
   - Tab to skip link
   - Activate with Enter key
   - Verify focus moves to main content

#### Step 5: Test Authentication Guard

1. Clear session/cookies to simulate logged-out state
2. Attempt to access dashboard route directly
3. Verify redirect to login page occurs immediately
4. Check that return URL is preserved in redirect
5. Log in with valid credentials
6. Verify redirect back to original dashboard route
7. Check that authenticated state persists across refreshes
8. Test logout functionality if implemented

#### Step 6: Verify CSS Variables

1. Open browser DevTools computed styles panel
2. Select layout elements (sidebar, header, main)
3. Verify CSS variables are applied correctly:
   - Check --sidebar-width value
   - Check --header-height value
   - Check --content-padding value
   - Verify z-index variables
4. Test responsive variable overrides:
   - Resize to mobile viewport
   - Verify variables update appropriately
5. Check for any hardcoded values that should use variables

#### Step 7: Run Accessibility Audit

1. Install and run Lighthouse audit in Chrome DevTools
2. Review accessibility score (target: 95+)
3. Check for critical accessibility issues:
   - Color contrast ratios (4.5:1 for text)
   - Keyboard navigation support
   - Screen reader compatibility
   - ARIA labels and roles
   - Semantic HTML structure
4. Test with keyboard navigation only:
   - Tab through all interactive elements
   - Verify logical tab order
   - Check focus indicators are visible
   - Ensure no keyboard traps
5. Test with screen reader (NVDA, JAWS, or VoiceOver):
   - Navigate through layout structure
   - Verify proper announcements
   - Check landmark regions (header, nav, main, footer)
   - Test skip navigation link
6. Address any accessibility violations found

#### Step 8: Run Performance Analysis

1. Run Lighthouse performance audit
2. Review performance score (target: 90+)
3. Check Core Web Vitals:
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1
4. Analyze bundle size and code splitting:
   - Check dashboard layout chunk size
   - Verify components are properly split
   - Review import efficiency
5. Test with slow network throttling:
   - Enable slow 3G throttling
   - Verify loading states appear appropriately
   - Check for layout shifts during loading
6. Optimize any performance bottlenecks found

#### Step 9: Cross-Browser Testing

1. Test in Google Chrome (latest version):
   - Verify all features work correctly
   - Check for any console errors
2. Test in Mozilla Firefox (latest version):
   - Verify layout renders identically
   - Test all interactive features
3. Test in Safari (latest version):
   - Check for webkit-specific issues
   - Test on macOS and iOS if possible
4. Test in Microsoft Edge (Chromium):
   - Verify compatibility
   - Test specific Edge features
5. Document any browser-specific issues
6. Implement fixes or polyfills as needed

#### Step 10: Verify Metadata Configuration

1. View page source in browser
2. Check head section for all metadata:
   - Title tag with correct format
   - Description meta tag
   - Robots meta tag (noindex for dashboard)
   - Viewport meta tag
   - Favicon and icon links
3. Navigate to different dashboard pages
4. Verify title updates correctly for each page
5. Test social sharing metadata with debugging tools
6. Verify manifest.json is accessible

#### Step 11: Test Layout Hooks

1. Create test component that uses layout hooks
2. Test useLayout hook:
   - Verify state values are correct
   - Test toggle functions work
   - Check for state synchronization
3. Test useSidebarState hook:
   - Verify sidebar state is accessible
   - Test toggle, collapse, expand functions
4. Test useLayoutDimensions hook:
   - Verify dimensions are computed correctly
   - Test responsive updates on resize
5. Test useMediaQuery hook:
   - Verify breakpoint detection
   - Test responsive behavior
6. Check for unnecessary re-renders using React DevTools Profiler

#### Step 12: Verify Production Build

1. Create production build with `npm run build`
2. Check build output for errors or warnings
3. Verify layout chunks are optimized
4. Check bundle size is reasonable (< 200kb for layout)
5. Start production server with `npm start`
6. Test production build in browser:
   - Verify all features work
   - Check for any production-specific issues
   - Test performance with production optimizations
7. Review build analytics if available

#### Step 13: Document Known Issues

1. Create list of any issues discovered during testing
2. Categorize issues by severity:
   - Critical: Must fix before next phase
   - High: Should fix soon
   - Medium: Fix when time allows
   - Low: Nice to have
3. Document workarounds for known issues
4. Create GitHub issues or task tickets for fixes
5. Update documentation with any caveats or limitations

#### Step 14: Create Verification Report

1. Compile all test results into a report document
2. Include screenshots of successful tests
3. Document accessibility score and improvements
4. Record performance metrics and benchmarks
5. List cross-browser compatibility results
6. Note any remaining tasks or improvements
7. Sign off on layout verification as complete

### Expected Outcome

```
Verification Summary:
=====================

✓ File Structure
  ├── All layout components present
  ├── Proper directory organization
  └── Consistent naming conventions

✓ Rendering & Functionality
  ├── Layout renders correctly
  ├── All interactive features work
  ├── Responsive behavior verified
  └── No console errors

✓ Authentication
  ├── Unauthenticated users redirected
  ├── Return URL preserved
  └── Session persistence verified

✓ Accessibility (Score: 95+)
  ├── WCAG 2.1 Level AA compliance
  ├── Keyboard navigation support
  ├── Screen reader compatibility
  ├── Color contrast meets standards
  └── Skip navigation implemented

✓ Performance (Score: 90+)
  ├── LCP: < 2.5s
  ├── FID: < 100ms
  ├── CLS: < 0.1
  ├── Bundle size optimized
  └── Code splitting effective

✓ Cross-Browser Support
  ├── Chrome: ✓
  ├── Firefox: ✓
  ├── Safari: ✓
  └── Edge: ✓

✓ Production Ready
  ├── Build successful
  ├── No production errors
  └── Optimizations verified


Layout Structure Diagram:
=========================

app/(dashboard)/layout.tsx
├── Metadata (SEO)
├── ProtectedRoute (Auth Guard)
│   └── LayoutProvider (Context)
│       ├── SkipNavigation (A11y)
│       ├── Header (64px height)
│       │   └── Toggle Button
│       ├── Sidebar (240px width)
│       │   ├── Logo
│       │   ├── Navigation Menu
│       │   └── Collapse Toggle
│       ├── PageTransition (Animations)
│       │   └── Main Content
│       │       └── {children}
│       └── Footer (48px height)

Hooks Available:
├── useLayout() → Full layout state
├── useSidebarState() → Sidebar control
├── useLayoutDimensions() → Computed sizes
└── useMediaQuery() → Responsive queries

CSS Variables Defined:
├── --sidebar-width: 240px
├── --header-height: 64px
├── --content-padding: 24px
├── --transition-base: 200ms
└── [30+ more variables]
```

Dashboard layout is fully functional, accessible, performant, and ready for further development of dashboard pages and features.

### Verification Checklist

- [ ] All layout files present and organized correctly
- [ ] Layout renders correctly on all viewports
- [ ] Sidebar toggle works on mobile and desktop
- [ ] Sidebar collapse works on desktop
- [ ] Page transitions are smooth and non-disruptive
- [ ] Authentication guard redirects unauthenticated users
- [ ] Return URL preserved in authentication flow
- [ ] Skip navigation link functional and accessible
- [ ] All CSS variables defined and applied
- [ ] Layout hooks work correctly in components
- [ ] Metadata configured with proper SEO tags
- [ ] Accessibility score 95+ in Lighthouse
- [ ] Performance score 90+ in Lighthouse
- [ ] WCAG 2.1 Level AA compliance achieved
- [ ] Keyboard navigation works throughout layout
- [ ] Screen reader announces layout correctly
- [ ] Color contrast meets WCAG standards (4.5:1)
- [ ] No console errors or warnings
- [ ] Cross-browser testing passed (Chrome, Firefox, Safari, Edge)
- [ ] Responsive behavior verified across all breakpoints
- [ ] Production build successful with no errors
- [ ] Bundle size optimized (< 200kb for layout)
- [ ] Core Web Vitals meet targets (LCP, FID, CLS)
- [ ] No layout shift during loading
- [ ] All interactive features tested and working
- [ ] Documentation updated with any known issues
- [ ] Verification report created and signed off

---

## Summary

Tasks 08-14 complete the dashboard layout with essential features including SEO metadata, authentication protection, smooth transitions, CSS variables, custom hooks, and accessibility enhancements. The layout is now production-ready and provides a solid foundation for building dashboard pages and features.

### Key Achievements

1. **Metadata Configuration**: SEO-optimized metadata for all dashboard pages
2. **Authentication Guard**: Complete protection with redirect flow
3. **Smooth Transitions**: Professional page animations with reduced-motion support
4. **CSS Variables**: Comprehensive design token system for consistency
5. **Custom Hooks**: Reusable layout state management
6. **Accessibility**: WCAG 2.1 Level AA compliance with skip navigation
7. **Production Verified**: Comprehensive testing and verification complete

### Next Steps

Proceed to **Group-B: Sidebar Component** to implement the detailed sidebar structure, navigation menu, and sidebar-specific features.

---

**Document End**
