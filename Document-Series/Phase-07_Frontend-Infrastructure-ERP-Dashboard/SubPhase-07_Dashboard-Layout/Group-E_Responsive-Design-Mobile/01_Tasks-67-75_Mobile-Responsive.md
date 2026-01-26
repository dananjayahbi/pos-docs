# Tasks 67-75: Mobile Responsive Design

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout  
> **Group:** E - Responsive Design & Mobile  
> **Document:** 01 of 01  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Navigation-Breadcrumbs/02_Tasks-59-66_PageComponents-Shortcuts.md](../Group-D_Navigation-Breadcrumbs/02_Tasks-59-66_PageComponents-Shortcuts.md)
- **→ Next Group:** [../Group-F_Dashboard-Home-Page](../Group-F_Dashboard-Home-Page/)

---

## Document Overview

This document covers the implementation of responsive design and mobile optimization for the ERP dashboard layout. The implementation transforms the desktop-first dashboard into a fully responsive interface that adapts seamlessly to tablets and mobile devices. Key features include a mobile sidebar drawer with touch gestures, responsive header adjustments, adaptive component visibility, and optimized spacing for smaller screens. The implementation leverages Tailwind CSS breakpoints and custom React hooks to create an intuitive mobile experience without compromising desktop functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Define Responsive Breakpoints | Low | 30 min |
| 68 | Create Mobile Sidebar Drawer | High | 60 min |
| 69 | Create Sidebar Overlay | Medium | 35 min |
| 70 | Implement Sidebar Swipe Gesture | High | 55 min |
| 71 | Hide Sidebar on Mobile | Medium | 30 min |
| 72 | Show Mobile Header Toggle | Medium | 35 min |
| 73 | Create Responsive Header | Medium | 45 min |
| 74 | Hide Search on Small Screens | Low | 25 min |
| 75 | Adjust Content Padding | Low | 25 min |

---

## Responsive Design Architecture

### Breakpoint Strategy

```
Mobile-First Approach:

┌─────────────────────────────────────────────────────────────┐
│ Base (Default)     │ Mobile        │ < 640px              │
├─────────────────────────────────────────────────────────────┤
│ sm                 │ Small         │ ≥ 640px              │
├─────────────────────────────────────────────────────────────┤
│ md                 │ Tablet        │ ≥ 768px              │
├─────────────────────────────────────────────────────────────┤
│ lg                 │ Desktop       │ ≥ 1024px (Sidebar)   │
├─────────────────────────────────────────────────────────────┤
│ xl                 │ Large Desktop │ ≥ 1280px             │
├─────────────────────────────────────────────────────────────┤
│ 2xl                │ Extra Large   │ ≥ 1536px             │
└─────────────────────────────────────────────────────────────┘
```

### Layout Behavior Across Breakpoints

```
Mobile (< 1024px):                    Desktop (≥ 1024px):
┌─────────────────────────┐           ┌────────┬──────────────────┐
│  ☰  [Logo]    [Icons]   │           │        │  [Logo]  [Search]│
├─────────────────────────┤           │        ├──────────────────┤
│                         │           │ Side   │                  │
│                         │           │ bar    │                  │
│   Main Content          │           │        │  Main Content    │
│   (Full Width)          │           │ Always │  (With Sidebar)  │
│                         │           │ Visible│                  │
│                         │           │        │                  │
└─────────────────────────┘           └────────┴──────────────────┘

Mobile with Drawer Open:
┌───────────┬─────────────┐
│           │☰ [Logo] [X] │ <- Overlay visible
│  Sidebar  ├─────────────┤
│  Drawer   │█████████████│ <- Content dimmed
│  (280px)  │█████████████│
│           │█████████████│
│           │█████████████│
└───────────┴─────────────┘
```

---

## Task 67: Define Responsive Breakpoints

### Overview
Define and configure the responsive breakpoint system using Tailwind CSS's built-in breakpoint utilities. This task establishes the foundation for all responsive behavior across the dashboard, ensuring consistent breakpoint usage and creating utility hooks for breakpoint detection in React components. The implementation uses Tailwind's standard breakpoints with a focus on the lg breakpoint as the primary desktop threshold where the sidebar becomes permanently visible.

### Dependencies
- SubPhase-02: Tailwind Design System (configuration)
- SubPhase-03: Component Library Setup (utilities)

### Instructions

1. **Review Tailwind breakpoint configuration**
   - Open `tailwind.config.ts` in project root
   - Verify default breakpoints are available
   - Ensure sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px) are configured
   - These are Tailwind's default values and should not be modified
   - Note that lg (1024px) is the critical sidebar visibility threshold

2. **Document breakpoint usage strategy**
   - Create documentation in frontend README
   - Define mobile as base to lg-1 (< 1024px)
   - Define tablet as md to lg-1 (768px - 1023px)
   - Define desktop as lg+ (≥ 1024px)
   - Document that sidebar is hidden below lg breakpoint
   - Note that all responsive classes should be mobile-first

3. **Create media query utility hook**
   - Create `frontend/hooks/useMediaQuery.ts`
   - This hook detects current breakpoint in React components
   - Enables JavaScript-based responsive behavior
   - Complements Tailwind's CSS-only responsive classes

4. **Define hook interface**
   - Create useMediaQuery function that accepts query string
   - Query should be standard CSS media query format
   - Return boolean indicating whether query matches
   - Update return value when window resizes
   - Use window.matchMedia API for detection

5. **Implement resize listener**
   - Use useEffect to add resize listener on mount
   - Use window.matchMedia(query).addEventListener for modern browsers
   - Include fallback for older browsers if needed
   - Remove listener on component unmount
   - Use useCallback to memoize handler function

6. **Create breakpoint preset hooks**
   - Create `frontend/hooks/useBreakpoint.ts`
   - Export named hooks for each breakpoint
   - Include useIsMobile (< lg), useIsTablet (md to lg), useIsDesktop (≥ lg)
   - Include useIsSm, useIsMd, useIsLg, useIsXl, useIs2xl
   - These wrap useMediaQuery with preset queries

7. **Define preset hook implementations**
   - useIsMobile returns true when width < 1024px
   - useIsTablet returns true when 768px ≤ width < 1024px
   - useIsDesktop returns true when width ≥ 1024px
   - Each hook uses useMediaQuery with appropriate query string
   - Consider server-side rendering compatibility

8. **Handle server-side rendering**
   - Check if window is undefined (SSR context)
   - Return false or default value during SSR
   - Use useEffect to update value after hydration
   - Prevent hydration mismatches between server and client
   - Consider adding useIsClient helper hook

9. **Test breakpoint detection**
   - Create simple test component using breakpoint hooks
   - Display current breakpoint in console or UI
   - Manually resize browser window to test transitions
   - Verify correct breakpoint detection at each threshold
   - Test in both development and production builds

### Breakpoint Hook Usage Pattern

```
Component Responsive Behavior:

┌────────────────────────────────────────────────────┐
│ useMediaQuery                                      │
│   ↓ (Base Hook)                                    │
│   ├── useIsMobile    → < 1024px  (sidebar hidden) │
│   ├── useIsTablet    → 768-1023px                 │
│   ├── useIsDesktop   → ≥ 1024px  (sidebar shown)  │
│   ├── useIsSm        → ≥ 640px                    │
│   └── useIsLg        → ≥ 1024px                   │
└────────────────────────────────────────────────────┘

Usage in Components:
- Use hooks when JavaScript logic depends on screen size
- Use Tailwind classes for CSS-only responsive behavior
- Combine both approaches for complex responsive features
```

### Expected Outcome
Tailwind breakpoints configured and documented. useMediaQuery and useBreakpoint hooks created and tested. Breakpoint detection working consistently across all components. Clear documentation of breakpoint usage strategy with mobile-first approach and lg breakpoint as primary sidebar threshold.

### Verification Checklist
- [ ] Tailwind config includes all standard breakpoints
- [ ] Breakpoint documentation added to frontend README
- [ ] useMediaQuery hook created and handles window resize
- [ ] useBreakpoint preset hooks created for all breakpoints
- [ ] Server-side rendering compatibility implemented
- [ ] Hooks return correct boolean values at each breakpoint
- [ ] Test component verifies breakpoint detection accuracy
- [ ] No hydration warnings in browser console
- [ ] Hooks perform efficiently without excessive re-renders

---

## Task 68: Create Mobile Sidebar Drawer

### Overview
Create a mobile-optimized sidebar drawer component that slides in from the left edge of the screen when opened. The drawer provides full sidebar functionality on mobile devices while maximizing screen real estate when closed. The drawer is fixed position, covers most of the viewport width (up to 320px), appears above all content with high z-index, and includes smooth slide-in/slide-out animations. This component only renders on mobile (< lg breakpoint) and is replaced by the standard sidebar on desktop.

### Dependencies
- Task 67: Define Responsive Breakpoints (useIsMobile hook)
- Group-B: Sidebar Component (sidebar structure and content)
- SubPhase-02: Tailwind Design System (animation utilities)

### Instructions

1. **Create mobile sidebar component file**
   - Create `frontend/components/layout/MobileSidebar.tsx`
   - This is separate from desktop Sidebar component
   - Renders only on mobile devices
   - Reuses sidebar content but with drawer behavior

2. **Define component props interface**
   - Create MobileSidebarProps interface
   - Include isOpen boolean prop for drawer state
   - Include onClose callback prop for closing drawer
   - Include children prop for sidebar content
   - Add optional className for customization

3. **Implement conditional rendering**
   - Use useIsMobile hook to detect mobile viewport
   - Return null if not mobile (≥ lg breakpoint)
   - This ensures drawer only renders on mobile
   - Desktop uses standard sidebar instead

4. **Create drawer container structure**
   - Use div as outer portal container
   - Apply fixed positioning to anchor to viewport
   - Position at top: 0, left: 0 for full height from edge
   - Apply h-screen for full viewport height
   - Use z-50 for high stacking order above content

5. **Implement drawer width constraints**
   - Apply w-4/5 for 80% viewport width on small screens
   - Add max-w-[320px] to cap maximum width
   - This provides comfortable width without overwhelming screen
   - Ensures usability on very small devices
   - Prevents drawer from being too wide on larger mobiles

6. **Apply drawer background and styling**
   - Use bg-background for theme-aware background color
   - Apply border-r border-border for right edge separation
   - Include shadow-2xl for elevation and depth
   - Ensures drawer appears above content visually
   - Maintains consistent theme appearance

7. **Implement slide animation**
   - Use transition-transform for smooth animation
   - Set duration-300 for quick but smooth transition
   - Use ease-in-out for natural motion
   - Apply translate-x-0 when isOpen is true
   - Apply -translate-x-full when isOpen is false (off-screen)

8. **Create drawer header section**
   - Add header div at top of drawer
   - Include close button aligned to right
   - Use X icon or close icon
   - Apply padding for touch-friendly target size
   - Trigger onClose callback when clicked

9. **Render sidebar content**
   - Render children prop in main drawer body
   - This will contain the same nav items as desktop sidebar
   - Apply overflow-y-auto for scrollable content
   - Set flex-1 to fill available space
   - Ensure proper padding for touch interactions

10. **Handle open/close states**
    - Drawer starts off-screen with -translate-x-full
    - When isOpen becomes true, translates to translate-x-0
    - Animation automatically handles transition
    - Close button sets isOpen to false via onClose
    - Parent component manages isOpen state

11. **Add accessibility attributes**
    - Add role="dialog" to drawer container
    - Include aria-modal="true" attribute
    - Add aria-labelledby pointing to drawer title
    - Include aria-hidden based on isOpen state
    - Ensure keyboard focus management

12. **Implement focus trap**
    - Trap keyboard focus within drawer when open
    - Tab should cycle through drawer elements only
    - Escape key should close drawer
    - Focus should return to trigger element when closed
    - Consider using focus-trap-react library

### Mobile Drawer Animation Flow

```
Closed State:                Open State:
┌──┐                        ┌─────────┬─────┐
│  │←─────────────────────→ │ Sidebar │     │
│  │ -translate-x-full      │ Content │ [X] │
│  │ (Off-screen left)      │         │     │
│  │                        │ Nav     │     │
│  │                        │ Items   │     │
└──┘                        └─────────┴─────┘
                            translate-x-0
                            (On-screen)

Animation Timing:
Open:  0ms ──→ 300ms (ease-in-out)
Close: 0ms ──→ 300ms (ease-in-out)
```

### Drawer Touch Interaction Pattern

```
┌─────────────────────────────────────────┐
│ Mobile Viewport (< 1024px)              │
│                                          │
│ Closed:                                  │
│ ┌──┐                                     │
│ │  │ Main Content (Full Width)           │
│ │  │                                     │
│ └──┘                                     │
│                                          │
│ Open (via toggle or swipe):              │
│ ┌──────────┬──────────────────┐          │
│ │ Sidebar  │ Main (dimmed)    │          │
│ │ (320px)  │                  │          │
│ │          │                  │          │
│ └──────────┴──────────────────┘          │
└─────────────────────────────────────────┘
```

### Expected Outcome
MobileSidebar component created with smooth slide-in animation from left edge. Drawer renders at 80% width up to 320px maximum, fixed position with z-50 stacking. Component only renders on mobile viewports (< lg breakpoint) and includes close button in header. Drawer accepts children prop for sidebar content and manages open/close state through props.

### Verification Checklist
- [ ] MobileSidebar component file created
- [ ] Component only renders on mobile (< 1024px)
- [ ] Drawer slides in from left with smooth animation
- [ ] Drawer width is 80% of viewport up to 320px max
- [ ] Fixed positioning with z-50 keeps drawer above content
- [ ] Close button in header triggers onClose callback
- [ ] isOpen prop controls drawer visibility
- [ ] Drawer is completely off-screen when closed
- [ ] Smooth 300ms transition between states
- [ ] Sidebar content scrolls if it exceeds viewport height

---

## Task 69: Create Sidebar Overlay

### Overview
Create a backdrop overlay component that appears behind the mobile sidebar drawer when it is open. The overlay provides visual separation between the drawer and dimmed main content, clearly indicating the drawer is active. It uses a semi-transparent black background, covers the entire viewport, sits below the drawer but above page content, and closes the drawer when clicked. This pattern is standard for mobile drawer implementations and improves usability by making the drawer's modal nature clear.

### Dependencies
- Task 67: Define Responsive Breakpoints (useIsMobile hook)
- Task 68: Create Mobile Sidebar Drawer (drawer component)

### Instructions

1. **Create overlay component file**
   - Create `frontend/components/layout/SidebarOverlay.tsx`
   - This component renders the drawer backdrop
   - Provides click-to-close functionality
   - Visually separates drawer from content

2. **Define component props interface**
   - Create SidebarOverlayProps interface
   - Include isVisible boolean prop for overlay state
   - Include onClick callback prop for close action
   - Optional className for customization
   - Props control visibility and interaction

3. **Implement conditional rendering**
   - Use useIsMobile hook to detect mobile viewport
   - Return null if not mobile (≥ lg breakpoint)
   - Overlay only needed on mobile when drawer can be open
   - Also return null if isVisible is false
   - Prevents unnecessary DOM elements

4. **Create overlay container structure**
   - Use div as overlay element
   - Apply fixed positioning to cover entire viewport
   - Set inset-0 (top/right/bottom/left: 0) for full coverage
   - Use z-40 for stacking below drawer (z-50) but above content
   - This creates proper layering

5. **Apply overlay background styling**
   - Use bg-black for black backdrop
   - Apply opacity-50 or bg-black/50 for 50% transparency
   - This dims background content without hiding it
   - Creates clear visual hierarchy
   - Indicates modal interaction state

6. **Implement fade animation**
   - Use transition-opacity for smooth fade effect
   - Set duration-300 to match drawer animation timing
   - Use ease-in-out for natural motion
   - Apply opacity-0 initially, opacity-50 when visible
   - Synchronizes with drawer open/close animation

7. **Add click handler**
   - Attach onClick prop to overlay div
   - Handler triggers callback to close drawer
   - This provides intuitive click-outside-to-close behavior
   - Common pattern in mobile drawer interfaces
   - Improves user experience

8. **Handle touch events**
   - Prevent scroll on underlying content when overlay visible
   - Stop touch event propagation to prevent unintended interactions
   - Consider using touchstart and touchmove handlers
   - Prevents scrolling main content while drawer open
   - Enhances mobile usability

9. **Add accessibility attributes**
   - Add aria-hidden="true" since overlay is decorative
   - Include role="presentation" to indicate non-interactive backdrop
   - Ensure screen readers ignore overlay
   - Focus should remain on drawer content
   - Click handler provides interaction but visually

10. **Implement portal rendering**
    - Consider using React Portal to render overlay
    - Portal ensures overlay renders at document body level
    - Prevents z-index stacking context issues
    - Ensures overlay always covers entire viewport
    - Use ReactDOM.createPortal if needed

11. **Coordinate with drawer animation**
    - Overlay should fade in as drawer slides in
    - Overlay should fade out as drawer slides out
    - Both animations use same 300ms duration
    - Timing synchronization improves perceived performance
    - Creates cohesive animation experience

### Overlay Layering Structure

```
Z-Index Stacking Order:

┌─────────────────────────────────────────┐
│ Mobile Sidebar Drawer                   │ z-50 (Top)
├─────────────────────────────────────────┤
│ Sidebar Overlay (Backdrop)              │ z-40
├─────────────────────────────────────────┤
│ Page Content (Header, Main)             │ z-0 to z-10
└─────────────────────────────────────────┘ (Bottom)

When Drawer Closed:
- Overlay: opacity-0 and not rendered
- Content: Normal appearance, full interaction

When Drawer Open:
- Drawer: Slides in from left, z-50
- Overlay: Fades to 50% black, z-40, covers content
- Content: Dimmed, not scrollable, no interaction
```

### Overlay Interaction Flow

```
User Interaction:

1. User opens drawer (tap hamburger menu)
   ↓
2. Overlay fades in (300ms) + Drawer slides in (300ms)
   ↓
3. User sees dimmed content, focus on drawer
   ↓
4. User taps overlay (anywhere outside drawer)
   ↓
5. onClick callback fires
   ↓
6. Drawer slides out (300ms) + Overlay fades out (300ms)
   ↓
7. Content returns to normal state
```

### Expected Outcome
SidebarOverlay component created with semi-transparent black background covering entire viewport. Overlay renders only on mobile when drawer is open, uses z-40 to appear below drawer but above content. Clicking overlay triggers callback to close drawer. Fade animation synchronizes with drawer slide animation for cohesive visual experience.

### Verification Checklist
- [ ] SidebarOverlay component file created
- [ ] Component only renders on mobile (< 1024px)
- [ ] Overlay only renders when isVisible is true
- [ ] Fixed positioning with inset-0 covers entire viewport
- [ ] Black background at 50% opacity dims content
- [ ] z-40 stacking places overlay below drawer (z-50)
- [ ] Clicking overlay triggers onClick callback
- [ ] Fade animation duration is 300ms
- [ ] Animation synchronizes with drawer slide timing
- [ ] Overlay prevents scrolling of background content

---

## Task 70: Implement Sidebar Swipe Gesture

### Overview
Implement touch gesture detection that allows users to open and close the mobile sidebar drawer using intuitive swipe gestures. Swiping right from the left edge of the screen opens the drawer, and swiping left while the drawer is open closes it. This provides a native-app-like mobile experience that feels natural and responsive. The implementation uses either a gesture library or custom touch event handlers to detect swipe direction, velocity, and threshold for triggering drawer actions.

### Dependencies
- Task 67: Define Responsive Breakpoints (useIsMobile hook)
- Task 68: Create Mobile Sidebar Drawer (drawer component)
- Task 69: Create Sidebar Overlay (overlay component)

### Instructions

1. **Choose gesture detection approach**
   - Evaluate using react-use-gesture library for comprehensive gesture handling
   - Alternative: implement custom touch event handlers
   - Library provides robust gesture detection with minimal code
   - Custom implementation offers more control and fewer dependencies
   - Document chosen approach and rationale

2. **Create gesture detection hook**
   - Create `frontend/hooks/useSwipeGesture.ts`
   - Hook encapsulates gesture detection logic
   - Returns handlers to attach to target element
   - Provides callbacks for gesture events
   - Reusable across different components if needed

3. **Define hook interface**
   - Hook accepts configuration object with callbacks
   - Include onSwipeLeft callback for left swipe detection
   - Include onSwipeRight callback for right swipe detection
   - Include optional threshold for minimum swipe distance
   - Include optional velocity threshold for swipe speed

4. **Implement touch event handlers**
   - Use touchstart to capture initial touch position
   - Use touchmove to track touch movement
   - Use touchend to evaluate final swipe gesture
   - Calculate swipe distance (deltaX) and time (deltaTime)
   - Determine velocity (distance / time)

5. **Define swipe detection logic**
   - Store initial touch coordinates in state
   - Calculate horizontal distance traveled
   - Check if distance exceeds threshold (e.g., 50px)
   - Check if velocity exceeds threshold (e.g., 0.3px/ms)
   - Determine swipe direction (positive = right, negative = left)
   - Trigger appropriate callback based on direction

6. **Implement edge detection for opening drawer**
   - Swipe-to-open should only work from left edge
   - Define edge zone width (e.g., 20px from left)
   - Check if touchstart x-coordinate is within edge zone
   - Only process swipe if started from edge
   - This prevents accidentally opening drawer from content area

7. **Apply gesture handlers to drawer container**
   - Import useSwipeGesture hook in layout component
   - Configure hook with onSwipeLeft to close drawer
   - Configure hook with onSwipeRight to open drawer
   - Attach handlers to drawer or overlay element
   - For edge detection, attach to full viewport container

8. **Implement swipe-to-close on drawer**
   - Attach swipe handlers to MobileSidebar component
   - Detect left swipe gesture while drawer is open
   - Close drawer when left swipe detected
   - No edge detection needed for close gesture
   - Any left swipe on drawer should close it

9. **Implement swipe-to-open from edge**
   - Attach swipe handlers to main layout or body
   - Only detect swipe when drawer is closed
   - Check if touchstart is within left edge zone
   - Open drawer on right swipe from edge
   - Provide visual feedback during swipe if possible

10. **Add gesture feedback**
    - Consider showing drawer partially during swipe
    - Drawer follows finger position during gesture
    - Snap to open or closed based on release position
    - Provides direct manipulation feel
    - Enhances user experience with responsive feedback

11. **Handle gesture conflicts**
    - Prevent horizontal scrolling during vertical swipe
    - Use preventDefault carefully to avoid breaking scroll
    - Check swipe direction early to determine intent
    - Allow vertical scrolling if gesture is primarily vertical
    - Only capture horizontal gestures for drawer

12. **Optimize performance**
    - Throttle or debounce touchmove events
    - Avoid heavy calculations during gesture
    - Use requestAnimationFrame for smooth animations
    - Clean up event listeners on unmount
    - Minimize re-renders during gesture tracking

13. **Test gesture interactions**
    - Test swipe-to-open from left edge
    - Test swipe-to-close on open drawer
    - Verify threshold prevents accidental triggers
    - Test on various mobile devices and browsers
    - Ensure gestures feel natural and responsive

### Swipe Gesture Detection Flow

```
Opening Drawer (Swipe Right from Edge):

1. touchstart in edge zone (0-20px from left)
   ↓
2. touchmove tracks finger position
   ↓
3. Calculate deltaX (horizontal distance)
   ↓
4. touchend evaluates gesture
   ↓
5. If deltaX > 50px and velocity > 0.3px/ms
   ↓
6. Trigger onSwipeRight → Open drawer

Closing Drawer (Swipe Left):

1. touchstart on open drawer
   ↓
2. touchmove tracks finger position
   ↓
3. Calculate deltaX (negative for left)
   ↓
4. touchend evaluates gesture
   ↓
5. If deltaX < -50px and velocity > 0.3px/ms
   ↓
6. Trigger onSwipeLeft → Close drawer
```

### Gesture Zones and Behavior

```
Mobile Screen Layout:

┌───┬─────────────────────────────┐
│ E │                             │ E = Edge Zone (20px)
│ d │   Main Content Area         │     Swipe right → Open
│ g │                             │
│ e │                             │ Main = Content Area
│   │                             │     No open gesture
│ Z │                             │
│ o │                             │
│ n │                             │
│ e │                             │
└───┴─────────────────────────────┘

When Drawer Open:

┌────────────┬──────────────────┐
│            │                  │ Drawer = Swipe Zone
│  Drawer    │   Dimmed         │     Swipe left → Close
│  (Full)    │   Content        │
│            │                  │ Overlay = Click/Tap
│  Swipe     │   (No Gesture)   │     Tap → Close
│  Left      │                  │
│  To Close  │                  │
│            │                  │
└────────────┴──────────────────┘
```

### Expected Outcome
useSwipeGesture hook created with touch event handling and gesture detection logic. Swipe right from left edge opens drawer when closed. Swipe left on open drawer closes it. Gesture detection includes distance and velocity thresholds to prevent accidental triggers. Edge detection ensures drawer only opens from left screen edge.

### Verification Checklist
- [ ] useSwipeGesture hook created with touch handlers
- [ ] Hook detects horizontal swipe direction
- [ ] Swipe distance threshold prevents accidental triggers
- [ ] Velocity threshold ensures intentional gestures
- [ ] Swipe right from edge opens closed drawer
- [ ] Swipe left on drawer closes it
- [ ] Edge zone limited to ~20px from left
- [ ] Gestures don't interfere with vertical scrolling
- [ ] Performance is smooth without lag
- [ ] Works across different mobile browsers

---

## Task 71: Hide Sidebar on Mobile

### Overview
Configure the dashboard layout to automatically hide the desktop sidebar component on mobile devices and show it on desktop viewports. This ensures optimal use of screen space on smaller devices where a persistent sidebar would consume too much valuable area. The sidebar is completely hidden on mobile (< lg breakpoint) and replaced by the mobile drawer component. On desktop (≥ lg breakpoint), the standard sidebar is always visible. This task focuses on the responsive visibility logic and layout adjustments.

### Dependencies
- Task 67: Define Responsive Breakpoints (useIsMobile hook)
- Group-B: Sidebar Component (desktop sidebar)
- Task 68: Create Mobile Sidebar Drawer (mobile replacement)

### Instructions

1. **Locate main dashboard layout component**
   - Open dashboard layout file (typically in app/dashboard/layout.tsx)
   - This file defines the overall dashboard structure
   - Contains sidebar and main content arrangement
   - Handles responsive layout switching

2. **Add responsive visibility to desktop sidebar**
   - Find where Sidebar component is rendered
   - Add Tailwind hidden class by default
   - Add lg:block class to show on desktop
   - This hides sidebar on mobile, shows on ≥1024px
   - Results in sidebar being hidden when < lg breakpoint

3. **Create mobile sidebar state management**
   - Add useState hook for mobile drawer open state
   - Initialize as false (drawer closed by default)
   - Create toggle function to open/close drawer
   - Pass state and toggle to mobile components
   - State lives in layout component

4. **Add conditional mobile sidebar rendering**
   - Import MobileSidebar component
   - Render MobileSidebar below desktop Sidebar
   - Pass isOpen state to MobileSidebar
   - Pass close handler to MobileSidebar
   - MobileSidebar handles its own mobile-only rendering

5. **Add conditional overlay rendering**
   - Import SidebarOverlay component
   - Render overlay when mobile drawer is open
   - Pass isVisible state to overlay
   - Pass close handler to overlay click
   - Overlay handles its own mobile-only rendering

6. **Adjust main content area width**
   - Find main content container element
   - On mobile, should use full width (w-full)
   - On desktop with sidebar, use remaining width
   - Apply ml-64 or appropriate margin on lg+ breakpoint
   - This prevents content from being hidden under sidebar

7. **Update layout flex structure**
   - Use flex container for sidebar and content
   - Desktop sidebar uses fixed width (e.g., 256px)
   - Main content uses flex-1 to fill remaining space
   - On mobile, content uses full width since sidebar is hidden
   - Ensures proper layout at all breakpoints

8. **Handle sidebar content consistency**
   - Both desktop and mobile sidebars should show same navigation
   - Extract navigation items into shared component or data
   - Import and render in both Sidebar and MobileSidebar
   - Ensures consistent navigation across devices
   - Single source of truth for navigation structure

9. **Add transition classes**
   - Apply transition classes to content area
   - Smooth margin changes when breakpoint transitions
   - Use transition-[margin] duration-300
   - Creates smooth layout shift on resize
   - Improves perceived performance

10. **Test responsive behavior**
    - Verify sidebar hidden on mobile by default
    - Verify sidebar always visible on desktop
    - Check that mobile drawer can be opened
    - Confirm content area adjusts width properly
    - Test at exact breakpoint boundaries

### Desktop vs Mobile Layout Structure

```
Desktop Layout (≥ 1024px):

┌──────────┬─────────────────────────────┐
│          │                             │
│ Desktop  │  Header                     │
│ Sidebar  ├─────────────────────────────┤
│          │                             │
│ (Always  │  Main Content               │
│ Visible) │  (Adjusted Width)           │
│          │                             │
│  Nav     │  Content fills remaining    │
│  Items   │  space (flex-1)             │
│          │                             │
└──────────┴─────────────────────────────┘
  256px        calc(100% - 256px)


Mobile Layout (< 1024px):

┌─────────────────────────────────────────┐
│  Header (Full Width)                    │
├─────────────────────────────────────────┤
│                                         │
│  Main Content                           │
│  (Full Width, No Sidebar)               │
│                                         │
│  Content uses entire viewport           │
│                                         │
│  Desktop sidebar: hidden                │
│  Mobile drawer: available via toggle    │
│                                         │
└─────────────────────────────────────────┘

Mobile with Drawer Open:

┌──────────┬──────────────────────────────┐
│  Mobile  │  Header (Dimmed)             │
│  Drawer  ├──────────────────────────────┤
│          │  Main Content (Dimmed)       │
│  Nav     │                              │
│  Items   │  Overlay covering content    │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Responsive Class Application

```
Component Class Patterns:

Desktop Sidebar:
<Sidebar className="hidden lg:block" />
- Hidden by default (mobile)
- Block display at lg+ (desktop)

Mobile Components:
<MobileSidebar /> (internal useIsMobile check)
<SidebarOverlay /> (internal useIsMobile check)
- Only render on mobile
- Return null on desktop

Main Content Area:
<main className="w-full lg:ml-64 transition-[margin]">
- Full width on mobile
- Left margin on desktop for sidebar space
- Smooth transition on resize
```

### Expected Outcome
Desktop sidebar hidden on mobile viewports (< 1024px) using Tailwind hidden and lg:block classes. Sidebar automatically appears on desktop (≥ 1024px). Mobile drawer and overlay components conditionally render only on mobile. Main content area adjusts width responsively with smooth transitions. Navigation content consistent between desktop and mobile sidebars.

### Verification Checklist
- [ ] Desktop Sidebar has hidden lg:block classes
- [ ] Sidebar completely hidden on mobile (< 1024px)
- [ ] Sidebar always visible on desktop (≥ 1024px)
- [ ] Mobile drawer state managed in layout component
- [ ] MobileSidebar renders only on mobile
- [ ] SidebarOverlay renders only on mobile when drawer open
- [ ] Main content uses full width on mobile
- [ ] Main content has appropriate margin on desktop
- [ ] Navigation items consistent across both sidebars
- [ ] Smooth transitions at breakpoint boundaries

---

## Task 72: Show Mobile Header Toggle

### Overview
Add a hamburger menu button to the header that appears only on mobile devices to control the mobile sidebar drawer. The toggle button is hidden on desktop where the sidebar is always visible, and prominently displayed on mobile where it's needed to access navigation. The button shows a hamburger icon (three horizontal lines), is positioned on the left side of the header, and triggers the mobile drawer to open when tapped. This provides clear, discoverable access to navigation on mobile devices.

### Dependencies
- Task 67: Define Responsive Breakpoints (useIsMobile hook)
- Task 68: Create Mobile Sidebar Drawer (drawer to control)
- Group-C: Header Component (header structure)

### Instructions

1. **Locate header component**
   - Open Header component file
   - Find where header content is rendered
   - Identify left section of header for toggle placement
   - Note existing header elements and layout

2. **Import menu icon component**
   - Import Menu icon from icon library (lucide-react or similar)
   - This provides the hamburger menu icon
   - Standard icon is three horizontal lines
   - Should be size 24x24 or similar for touch targets

3. **Add toggle button to header**
   - Create button element in left section of header
   - Apply lg:hidden class to hide on desktop
   - Use flex to show on mobile by default
   - Position before logo or as first element
   - Ensures button is easily discoverable

4. **Style toggle button**
   - Apply p-2 for adequate padding (touch target ≥ 44x44px)
   - Use rounded-md for subtle rounded corners
   - Apply hover:bg-muted for hover feedback
   - Use focus:outline-none focus:ring-2 for accessibility
   - Add transition for smooth hover effects

5. **Add onClick handler**
   - Attach onClick handler to button
   - Handler should call function to open mobile drawer
   - This function likely updates state in parent layout
   - Pass toggle function down as prop from layout
   - Button triggers drawer open action

6. **Update header component props**
   - Add onMobileMenuClick prop to Header interface
   - Type as () => void for callback
   - Mark as optional with ? if desktop doesn't need it
   - Document prop purpose in JSDoc comment
   - Pass function from layout component

7. **Handle toggle function in layout**
   - In dashboard layout, pass drawer toggle to Header
   - Create handler that sets mobile drawer state to true
   - Pass this handler as onMobileMenuClick prop
   - Ensures layout manages drawer state centrally
   - Header just triggers the action

8. **Adjust header layout spacing**
   - Add gap or spacing between toggle and logo
   - Use gap-2 or gap-3 for comfortable spacing
   - Ensure toggle doesn't crowd other header elements
   - Consider reducing logo size on small mobile if needed
   - Maintain balanced visual hierarchy

9. **Add accessibility attributes**
   - Add aria-label="Open navigation menu" to button
   - Include aria-expanded="false" since drawer is closed
   - Consider aria-controls pointing to drawer ID
   - Ensures screen readers announce purpose
   - Improves keyboard navigation experience

10. **Test toggle visibility and function**
    - Verify toggle appears on mobile (< lg)
    - Verify toggle hidden on desktop (≥ lg)
    - Confirm clicking toggle opens mobile drawer
    - Check touch target size is adequate (≥ 44x44px)
    - Test hover and focus states work correctly

### Mobile Toggle Button Placement

```
Mobile Header Layout:

┌──────────────────────────────────────────┐
│ ☰  [Logo]              [🔔] [👤]        │
│ ↑                       ↑    ↑           │
│ Toggle                  Icons            │
│ (Mobile Only)                            │
└──────────────────────────────────────────┘

Desktop Header Layout:

┌──────────────────────────────────────────┐
│ [Logo]    [Search...]      [🔔] [👤]    │
│                            ↑    ↑        │
│ (No Toggle - Sidebar Always Visible)    │
└──────────────────────────────────────────┘

Toggle Button Specs:
- Size: 44x44px minimum (touch target)
- Icon: Menu icon (☰) 24x24px
- Position: Left edge, before logo
- Padding: p-2 (8px all sides)
- Active area: Full 44x44px tappable
```

### Toggle Interaction Flow

```
User Interaction Sequence:

1. User on mobile sees header with ☰ button
   ↓
2. User taps ☰ button
   ↓
3. onClick handler fires
   ↓
4. Layout component updates drawer state
   ↓
5. Mobile drawer slides in from left
   ↓
6. Overlay fades in behind drawer
   ↓
7. User can now interact with navigation
   ↓
8. Close via overlay, close button, or swipe

State Flow:
Layout Component
  ├── Header (receives onMobileMenuClick prop)
  │     └── Toggle Button (onClick → onMobileMenuClick())
  │
  ├── MobileSidebar (receives isOpen state)
  └── SidebarOverlay (receives isVisible state)
```

### Expected Outcome
Hamburger menu toggle button added to header left section, visible only on mobile (< lg breakpoint). Button displays Menu icon with adequate touch target size and hover/focus states. Clicking button opens mobile sidebar drawer. Button hidden on desktop where sidebar is always visible. Proper accessibility attributes included for screen readers.

### Verification Checklist
- [ ] Toggle button added to header left section
- [ ] Button uses lg:hidden to hide on desktop
- [ ] Menu icon (hamburger) displays correctly
- [ ] Touch target meets 44x44px minimum size
- [ ] Hover state provides visual feedback
- [ ] Focus ring visible for keyboard navigation
- [ ] Clicking button opens mobile drawer
- [ ] onMobileMenuClick prop passed from layout
- [ ] aria-label describes button purpose
- [ ] Button does not appear on desktop (≥ 1024px)

---

## Task 73: Create Responsive Header

### Overview
Adapt the header component to provide an optimized layout across all screen sizes. The responsive header maintains core functionality while adjusting element visibility, sizing, and arrangement for different viewports. On mobile, the header shows essential elements (logo, icons) in a compact layout. On tablet, additional elements may appear. On desktop, the full header with search bar and all features is visible. This task ensures the header remains functional and visually balanced from the smallest mobile phones to large desktop monitors.

### Dependencies
- Task 67: Define Responsive Breakpoints
- Group-C: Header Component (base header structure)
- Task 72: Show Mobile Header Toggle (mobile toggle added)

### Instructions

1. **Review current header structure**
   - Open Header component file
   - Identify all header elements (logo, search, actions, user menu)
   - Note current layout and spacing
   - Plan responsive adjustments for each element
   - Consider element priority at each breakpoint

2. **Adjust header container layout**
   - Ensure header uses flex layout
   - Apply justify-between for left/right separation
   - Use items-center for vertical centering
   - Add responsive padding (px-4 on mobile, px-6 on desktop)
   - Apply h-16 for consistent height across all screens

3. **Optimize logo size responsively**
   - On mobile, use smaller logo or text-only variant
   - Apply w-auto h-8 on mobile for compact size
   - Increase to h-10 on md breakpoint for better visibility
   - Consider hiding logo text on very small screens
   - Maintain brand recognition while saving space

4. **Create responsive left section**
   - Group toggle button and logo in flex container
   - Use items-center and gap-2 or gap-3
   - Ensure toggle only shows on mobile (lg:hidden)
   - Logo should be visible at all breakpoints
   - Section should not overwhelm mobile header

5. **Create responsive right section**
   - Group action buttons, notifications, and user menu
   - Use flex with items-center and gap-2 or gap-3
   - Maintain consistent spacing at all breakpoints
   - Consider reducing icon sizes slightly on mobile
   - Keep critical actions visible at all sizes

6. **Adjust action button spacing**
   - Reduce gap between buttons on mobile
   - Use gap-1 on mobile, gap-2 on tablet, gap-3 on desktop
   - Ensure buttons remain tappable (≥ 44x44px)
   - Consider hiding less critical actions on mobile
   - Use responsive display classes (hidden md:flex)

7. **Handle notification badge visibility**
   - Notification icons should remain visible on all screens
   - Badge size might reduce slightly on mobile
   - Ensure badge remains readable and noticeable
   - Position consistently across breakpoints
   - Consider icon-only on mobile, icon+text on desktop

8. **Optimize user menu presentation**
   - On mobile, show only avatar or icon
   - On desktop, show avatar with username
   - Use hidden lg:block for username text
   - Ensure dropdown menu works at all sizes
   - Adjust menu position to stay on screen

9. **Add responsive height and padding**
   - Use h-14 on mobile, h-16 on desktop
   - Apply px-4 md:px-6 for responsive horizontal padding
   - Use py-3 for adequate vertical padding
   - Ensures header isn't too tall on mobile
   - Provides comfortable touch targets

10. **Test header at all breakpoints**
    - Test at mobile (< 640px)
    - Test at tablet (640px - 1023px)
    - Test at desktop (≥ 1024px)
    - Verify all elements visible and functional
    - Check touch targets and spacing
    - Confirm no overlap or crowding

### Responsive Header Layouts

```
Mobile Layout (< 640px):

┌────────────────────────────────────────┐
│ ☰ Logo            [🔔] [👤]           │ h-14, px-4
└────────────────────────────────────────┘
  ↑   ↑              ↑     ↑
  |   |              |     User Avatar
  |   |              Notifications
  |   Logo (Small)
  Mobile Toggle


Tablet Layout (640px - 1023px):

┌──────────────────────────────────────────┐
│ ☰ [Logo]        [Search?] [🔔] [👤]     │ h-16, px-6
└──────────────────────────────────────────┘
  ↑   ↑            ↑        ↑     ↑
  |   |            |        |     User Avatar
  |   |            |        Notifications
  |   Logo (Medium)|
  |                Optional Search
  Mobile Toggle


Desktop Layout (≥ 1024px):

┌────────────────────────────────────────────────────┐
│ [Logo]  [Search Input..........]  [🔔] [👤 User]  │ h-16, px-6
└────────────────────────────────────────────────────┘
  ↑       ↑                          ↑     ↑
  |       |                          |     Avatar + Name
  |       Full Search Bar            Notifications
  Logo (Full Size)
  (No Mobile Toggle)
```

### Responsive Element Priority

```
Element Visibility by Breakpoint:

Element              Mobile    Tablet    Desktop
─────────────────────────────────────────────────
Mobile Toggle        ✓         ✓         ✗
Logo (Compact)       ✓         -         -
Logo (Full)          -         ✓         ✓
Search Bar           ✗         Optional  ✓
Quick Actions        Hidden    Partial   ✓
Notifications        ✓         ✓         ✓
User Avatar          ✓         ✓         ✓
User Name            ✗         ✗         ✓
```

### Expected Outcome
Header component fully responsive with optimized layouts for mobile, tablet, and desktop viewports. Mobile header shows compact logo, toggle button, and essential icons. Desktop header shows full logo, search bar, and all actions with labels. Element sizing, spacing, and visibility adjust smoothly across breakpoints. Touch targets remain adequate on mobile.

### Verification Checklist
- [ ] Header height adjusts for mobile (h-14) and desktop (h-16)
- [ ] Horizontal padding responsive (px-4 mobile, px-6 desktop)
- [ ] Logo size adjusts for available space
- [ ] Mobile toggle visible only on mobile/tablet
- [ ] Search bar shows only on desktop (covered in Task 74)
- [ ] Action buttons maintain adequate spacing
- [ ] Notification icon visible at all breakpoints
- [ ] User menu shows avatar on all, name only on desktop
- [ ] No element overlap or crowding at any breakpoint
- [ ] Touch targets meet 44x44px minimum on mobile

---

## Task 74: Hide Search on Small Screens

### Overview
Implement responsive behavior for the header search functionality, hiding the full search input on small screens and showing only a search icon button instead. On mobile and tablet viewports where space is limited, the search input is replaced with a compact icon that can trigger a modal or slide-down search interface. On desktop, the full search bar with input field remains visible in the header. This approach balances functionality with space efficiency, ensuring search remains accessible without overwhelming the mobile header.

### Dependencies
- Task 67: Define Responsive Breakpoints
- Task 73: Create Responsive Header (responsive header structure)
- Group-C: Header Component (search implementation)

### Instructions

1. **Locate search component in header**
   - Open Header component file
   - Find where search input is rendered
   - Note current search implementation
   - Identify search container and input elements
   - Plan responsive modifications

2. **Create search icon button for mobile**
   - Import Search icon from icon library
   - Create button element to trigger search
   - Style as icon button with p-2 for padding
   - Apply hover:bg-muted for feedback
   - Include focus ring for accessibility

3. **Apply responsive visibility classes**
   - Add hidden lg:flex to full search input container
   - This hides search input on mobile/tablet
   - Shows search input on desktop (≥ lg breakpoint)
   - Add flex lg:hidden to search icon button
   - This shows icon on mobile, hides on desktop

4. **Style mobile search icon button**
   - Use rounded-md for corners
   - Apply text-muted-foreground for subtle appearance
   - Size icon 20x20 or 24x24 pixels
   - Ensure total button size is ≥ 44x44px
   - Match styling with other header buttons

5. **Position search icon appropriately**
   - Place search icon in header right section
   - Position before notifications and user menu
   - Use flex gap for consistent spacing
   - Ensure icon doesn't crowd other elements
   - Consider grouping with other action buttons

6. **Add search icon button handler**
   - Create onClick handler for search icon
   - Handler should open mobile search interface
   - Options: modal dialog, slide-down panel, full screen
   - For now, can show simple alert or placeholder
   - Plan for future mobile search implementation

7. **Implement mobile search modal (optional)**
   - Create SearchModal component for mobile search
   - Modal should cover full screen or slide down from header
   - Include large input field for easy typing
   - Add close button and recent searches if applicable
   - Render conditionally when search icon clicked

8. **Handle search state for mobile**
   - Add useState for mobile search open state
   - Initialize as false (modal closed)
   - Update state when search icon clicked
   - Pass state to SearchModal if implemented
   - Close modal on search submit or cancel

9. **Ensure desktop search remains functional**
   - Verify full search input visible on desktop
   - Confirm search functionality works as before
   - Ensure no regression in desktop experience
   - Desktop should not see mobile search icon
   - Search input should have adequate width

10. **Add accessibility attributes**
    - Add aria-label="Search" to mobile icon button
    - Include aria-expanded state if modal used
    - Ensure keyboard navigation works for both versions
    - Screen readers should announce search function
    - Consider aria-controls pointing to search modal

11. **Test responsive search behavior**
    - Verify full search shows only on desktop (≥ lg)
    - Verify icon shows only on mobile/tablet (< lg)
    - Test icon click triggers expected behavior
    - Confirm no visual glitches at breakpoints
    - Ensure search remains usable on all devices

### Responsive Search Layouts

```
Mobile Header (< 1024px):

┌────────────────────────────────────────┐
│ ☰ [Logo]           [🔍] [🔔] [👤]     │
│                     ↑                  │
│                Search Icon (Button)    │
│                (Triggers Modal)        │
└────────────────────────────────────────┘

Search Icon Click → Opens Modal:

┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │ [Search.....................] [X]  │ │
│ └────────────────────────────────────┘ │
│                                        │
│   Recent Searches:                     │
│   - Product ABC                        │
│   - Customer XYZ                       │
└────────────────────────────────────────┘


Desktop Header (≥ 1024px):

┌────────────────────────────────────────────────────┐
│ [Logo]  [Search Input..........]  [🔔] [👤 User]  │
│          ↑                                         │
│     Full Search Bar (Always Visible)              │
│     (No Icon, Direct Input)                       │
└────────────────────────────────────────────────────┘
```

### Search Visibility States

```
Component Structure:

<Header>
  <LeftSection>
    <MobileToggle /> (lg:hidden)
    <Logo />
  </LeftSection>
  
  <CenterSection>
    {/* Desktop Search - Visible ≥ lg */}
    <SearchInput className="hidden lg:flex" />
  </CenterSection>
  
  <RightSection>
    {/* Mobile Search Icon - Visible < lg */}
    <SearchIconButton className="flex lg:hidden" />
    
    <NotificationButton />
    <UserMenu />
  </RightSection>
</Header>
```

### Expected Outcome
Full search input hidden on mobile and tablet (< lg breakpoint) and replaced with compact search icon button. Search icon triggers modal or alternative search interface on mobile. Full search bar visible and functional on desktop (≥ lg breakpoint). Responsive transitions smooth at breakpoint boundaries. Search remains accessible and usable on all device sizes.

### Verification Checklist
- [ ] Full search input has hidden lg:flex classes
- [ ] Search input not visible on mobile/tablet (< 1024px)
- [ ] Search icon button has flex lg:hidden classes
- [ ] Search icon visible only on mobile/tablet (< 1024px)
- [ ] Icon button has adequate touch target (≥ 44x44px)
- [ ] Clicking icon triggers search action/modal
- [ ] Full search visible and functional on desktop
- [ ] aria-label on search icon describes function
- [ ] No layout shift or glitch at breakpoint transition
- [ ] Search usability maintained across all devices

---

## Task 75: Adjust Content Padding

### Overview
Optimize the spacing and padding of the main content area to provide appropriate breathing room at different screen sizes. Larger screens can afford generous padding for comfortable reading, while mobile devices need to maximize usable space while maintaining readability. This task implements responsive padding that scales from compact on mobile (12px) to comfortable on tablet (16px) to spacious on desktop (24px). The padding adjustments apply to page containers, card components, and content sections throughout the dashboard.

### Dependencies
- Task 67: Define Responsive Breakpoints
- SubPhase-02: Tailwind Design System (spacing utilities)
- Task 71: Hide Sidebar on Mobile (layout structure)

### Instructions

1. **Identify main content container**
   - Locate main content wrapper in dashboard layout
   - This is typically the main element or content div
   - Contains all page content that isn't header or sidebar
   - Review current padding values
   - Note which components need responsive padding

2. **Apply responsive padding to main container**
   - Add p-3 for mobile base padding (12px)
   - Add md:p-4 for tablet padding (16px)
   - Add lg:p-6 for desktop padding (24px)
   - This creates smooth scaling across breakpoints
   - Maintains proportional spacing

3. **Adjust page container padding**
   - Find page wrapper components (PageContainer, etc.)
   - Apply same responsive padding pattern
   - Use p-3 md:p-4 lg:p-6 or similar
   - Ensure inner content has adequate space
   - Consider max-width constraints for very large screens

4. **Update card component padding**
   - Open Card or similar container components
   - Adjust internal padding responsively
   - Use p-3 md:p-4 lg:p-6 for card bodies
   - Header and footer may use less padding
   - Maintain visual hierarchy with padding differences

5. **Adjust form padding and spacing**
   - Forms should have comfortable padding
   - Use space-y-3 md:space-y-4 for form field gaps
   - Apply responsive padding to form containers
   - Ensure touch targets remain adequate on mobile
   - Balance density with usability

6. **Update modal and dialog padding**
   - Modals should have responsive internal padding
   - Use p-4 md:p-6 lg:p-8 for larger padding range
   - Modals can afford more padding than page content
   - Ensure close button has adequate margin
   - Consider mobile viewport constraints

7. **Adjust table and list padding**
   - Table cells should have responsive padding
   - Use px-3 py-2 on mobile, px-4 py-3 on desktop
   - List items should have comfortable spacing
   - Balance density with touch targets
   - Consider horizontal scrolling on mobile if needed

8. **Update section spacing**
   - Sections should have responsive vertical spacing
   - Use space-y-4 md:space-y-6 lg:space-y-8
   - Creates clear visual separation
   - Scales appropriately with screen size
   - Maintains reading rhythm

9. **Adjust header and title margins**
   - Page titles should have responsive bottom margin
   - Use mb-3 md:mb-4 lg:mb-6
   - Section headings use mb-2 md:mb-3 lg:mb-4
   - Creates proportional heading hierarchy
   - Improves content organization

10. **Optimize grid and column gaps**
    - Grid layouts should have responsive gaps
    - Use gap-3 md:gap-4 lg:gap-6
    - Applies to both row and column gaps
    - Maintains proportional spacing
    - Adapts to available screen space

11. **Update button group spacing**
    - Button groups should have responsive gaps
    - Use gap-2 md:gap-3 for horizontal spacing
    - Ensure buttons don't crowd on mobile
    - Maintain adequate touch targets
    - Consider stacking buttons on very small screens

12. **Test padding at all breakpoints**
    - View pages at mobile, tablet, and desktop sizes
    - Verify content has adequate breathing room
    - Confirm no excessive padding wastes space
    - Check that touch targets remain accessible
    - Ensure visual balance maintained

### Responsive Padding Scale

```
Spacing Scale by Breakpoint:

Mobile (< 640px):        Tablet (640-1023px):    Desktop (≥ 1024px):
┌───────────────┐        ┌─────────────────┐     ┌───────────────────┐
│ ┌─────────┐ │          │ ┌───────────┐ │       │ ┌─────────────┐ │
│ │ Content │ │ p-3      │ │  Content  │ │ p-4   │ │   Content   │ │ p-6
│ │ (12px)  │ │          │ │  (16px)   │ │       │ │   (24px)    │ │
│ └─────────┘ │          │ └───────────┘ │       │ └─────────────┘ │
└───────────────┘        └─────────────────┘     └───────────────────┘

Tailwind Class Pattern:
p-3 md:p-4 lg:p-6
│   │      │
│   │      └─ Desktop: 24px (6 × 4px)
│   └──────── Tablet: 16px (4 × 4px)
└──────────── Mobile: 12px (3 × 4px)
```

### Component Padding Guidelines

```
Component Type          Mobile    Tablet    Desktop
──────────────────────────────────────────────────
Main Container          12px      16px      24px
Page Container          12px      16px      24px
Card Body               12px      16px      24px
Card Header/Footer      12px      12px      16px
Modal/Dialog            16px      24px      32px
Form Container          12px      16px      24px
Table Cell (H)          12px      16px      16px
Table Cell (V)          8px       12px      12px
List Item               12px      12px      16px
Button Group Gap        8px       12px      12px
Section Spacing         16px      24px      32px
```

### Padding Application Example

```
Main Content Area:

<main className="p-3 md:p-4 lg:p-6">
  <PageContainer className="space-y-4 md:space-y-6 lg:space-y-8">
    
    <PageHeader className="mb-3 md:mb-4 lg:mb-6">
      {/* Header content */}
    </PageHeader>
    
    <Card className="p-3 md:p-4 lg:p-6">
      {/* Card content */}
    </Card>
    
    <Grid className="gap-3 md:gap-4 lg:gap-6">
      {/* Grid items */}
    </Grid>
    
  </PageContainer>
</main>
```

### Expected Outcome
Main content area and components use responsive padding that scales from 12px on mobile to 24px on desktop. Cards, forms, modals, and other containers apply appropriate responsive spacing. Section gaps and element margins adjust proportionally across breakpoints. Content remains readable and accessible at all screen sizes with optimal use of available space.

### Verification Checklist
- [ ] Main container has p-3 md:p-4 lg:p-6 classes
- [ ] Page containers use responsive padding
- [ ] Cards and panels have scaled internal padding
- [ ] Forms use responsive field spacing
- [ ] Modals have comfortable padding at all sizes
- [ ] Tables and lists have appropriate cell padding
- [ ] Section spacing scales with breakpoints
- [ ] Grid and column gaps are responsive
- [ ] Button groups maintain adequate spacing
- [ ] Content readable and balanced at all breakpoints
- [ ] No wasted space on mobile or desktop
- [ ] Touch targets remain accessible (≥ 44x44px)

---

## Implementation Summary

### Component Checklist

**Hooks and Utilities:**
- [ ] useMediaQuery.ts - Base media query detection hook
- [ ] useBreakpoint.ts - Preset breakpoint hooks (useIsMobile, useIsDesktop, etc.)
- [ ] useSwipeGesture.ts - Touch gesture detection for drawer

**Layout Components:**
- [ ] MobileSidebar.tsx - Slide-out drawer for mobile navigation
- [ ] SidebarOverlay.tsx - Semi-transparent backdrop for mobile drawer
- [ ] Sidebar/ - Updated desktop sidebar with responsive visibility
- [ ] Header - Updated with mobile toggle and responsive layout

**Layout Updates:**
- [ ] Dashboard layout - State management for mobile drawer
- [ ] Dashboard layout - Responsive visibility classes
- [ ] Main content area - Responsive width and padding

### Responsive Breakpoint Reference

```
Breakpoint   Width      Use Case                    Sidebar State
────────────────────────────────────────────────────────────────────
(base)       0px        Mobile phones               Hidden (drawer)
sm           640px      Large phones                Hidden (drawer)
md           768px      Tablets                     Hidden (drawer)
lg           1024px     Small laptops/desktops      Always visible
xl           1280px     Desktops                    Always visible
2xl          1536px     Large desktops              Always visible
```

### Testing Matrix

| Feature | Mobile (< lg) | Desktop (≥ lg) | Test Status |
|---------|---------------|----------------|-------------|
| Desktop Sidebar | Hidden | Always visible | [ ] |
| Mobile Drawer | Available | Not rendered | [ ] |
| Drawer Overlay | When open | Not rendered | [ ] |
| Mobile Toggle | Visible | Hidden | [ ] |
| Search Input | Icon only | Full input | [ ] |
| Content Padding | 12px | 24px | [ ] |
| Header Height | 56px | 64px | [ ] |
| Swipe Gestures | Active | Not needed | [ ] |

### Key Integration Points

1. **Layout Component State:**
   - Manages mobile drawer open/close state
   - Passes state to MobileSidebar and SidebarOverlay
   - Provides toggle function to Header

2. **Breakpoint Detection:**
   - useIsMobile determines mobile vs desktop
   - Components conditionally render based on breakpoint
   - CSS classes handle visual responsiveness

3. **Touch Interaction:**
   - Swipe gestures open/close drawer
   - Overlay click closes drawer
   - Toggle button opens drawer
   - All methods update same state

4. **Responsive Patterns:**
   - Tailwind classes: hidden, lg:block, lg:hidden
   - Padding: p-3 md:p-4 lg:p-6
   - Gaps: gap-3 md:gap-4 lg:gap-6
   - Margins: mb-3 md:mb-4 lg:mb-6

---

## Document Metadata

**Total Tasks:** 9 (Tasks 67-75)  
**Estimated Total Time:** 5 hours 40 minutes  
**Complexity Distribution:**
- Low: 3 tasks (67, 74, 75)
- Medium: 4 tasks (69, 71, 72, 73)
- High: 2 tasks (68, 70)

**Key Dependencies:**
- SubPhase-02: Tailwind Design System
- SubPhase-03: Component Library Setup
- Group-B: Sidebar Component
- Group-C: Header Component

**Expected Deliverables:**
- 3 new hooks (useMediaQuery, useBreakpoint, useSwipeGesture)
- 2 new components (MobileSidebar, SidebarOverlay)
- Updated desktop Sidebar with responsive visibility
- Updated Header with mobile toggle and responsive layout
- Updated layout with drawer state management
- Responsive padding applied across all content areas

---

*This document provides comprehensive implementation guidance for mobile responsive design without code examples. Follow the numbered instructions for each task to create a fully responsive dashboard experience.*
