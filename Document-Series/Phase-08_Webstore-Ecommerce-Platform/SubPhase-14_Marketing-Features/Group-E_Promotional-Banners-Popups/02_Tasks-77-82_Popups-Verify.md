# Tasks 77-82: Marketing Popups and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** E - Promotional Banners & Popups  
> **Document:** 02 of 02  
> **Tasks Covered:** 77, 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-76_Banners-Announcement.md](01_Tasks-69-76_Banners-Announcement.md)

---

## Document Overview

This document covers the implementation of promotional popups with various triggers and verification of all marketing features. It establishes popup type definitions, reusable popup components with modal functionality, timing triggers (entry, exit, scroll), frequency control to prevent popup fatigue, exit-intent detection for desktop users, and comprehensive testing procedures to ensure all banners and popups work correctly across devices.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create Popup Types | Medium | 30 min |
| 78 | Create PromoPopup Component | Medium | 50 min |
| 79 | Create Popup Timing | Medium | 45 min |
| 80 | Create Popup Frequency | Medium | 40 min |
| 81 | Create Exit Intent Popup | High | 60 min |
| 82 | Verify Banners & Popups | Low | 45 min |

---

## Task 77: Create Popup Types

### Overview
Define TypeScript interfaces and types for promotional popups. This establishes the data structure for popup objects, including popup content, trigger configurations, frequency rules, display styles, and targeting options. Proper typing ensures type safety throughout the popup system and provides clear contracts for API responses and component props.

### Dependencies
- Task 76: Create Announcement Dismiss (storage patterns established)
- Frontend project types directory structure exists

### Instructions

1. **Create popup types file**
   - Navigate to `frontend/types/marketing/` directory
   - Create `popup.types.ts` file
   - Import necessary base types and banner types

2. **Define PopupTrigger enum**
   - Create enum for popup trigger types
   - Include: ENTRY, EXIT, SCROLL, TIMER, MANUAL
   - ENTRY: Shows after page loads
   - EXIT: Shows on exit intent
   - SCROLL: Shows at scroll percentage
   - TIMER: Shows after X seconds
   - MANUAL: Programmatically triggered

3. **Define PopupFrequency enum**
   - Create enum for display frequency
   - Include: ONCE, SESSION, DAILY, ALWAYS
   - ONCE: Show once per user (permanent)
   - SESSION: Show once per browser session
   - DAILY: Show once per 24 hours
   - ALWAYS: Show on every trigger

4. **Define PopupSize enum**
   - Create enum for popup dimensions
   - Include: SMALL, MEDIUM, LARGE, FULLSCREEN
   - SMALL: 400px width modal
   - MEDIUM: 600px width modal
   - LARGE: 800px width modal
   - FULLSCREEN: Full viewport overlay

5. **Define PopupPosition enum**
   - Create enum for popup placement
   - Include: CENTER, TOP, BOTTOM, BOTTOM_RIGHT
   - CENTER: Centered modal
   - BOTTOM_RIGHT: Corner notification style

6. **Define PopupType enum**
   - Create enum for popup categories
   - Include: PROMOTION, NEWSLETTER, EXIT_OFFER, ANNOUNCEMENT, SURVEY
   - Helps organize and filter popups

7. **Create PopupImage interface**
   - Define image property structure
   - Include: url, alt, position (left/right/top/background)
   - Add optional dimensions

8. **Create PopupButton interface**
   - Define button structure for CTAs
   - Include: text, url, style (primary/secondary)
   - Add action type (navigate/close/submit)

9. **Create PopupTriggerConfig interface**
   - Define trigger-specific settings
   - For ENTRY: delay in seconds
   - For EXIT: sensitivity threshold
   - For SCROLL: percentage (0-100)
   - For TIMER: delay in seconds

10. **Create PopupFrequencyConfig interface**
    - Define frequency control settings
    - Include: type (from PopupFrequency enum)
    - Add cooldown period in hours
    - Add maximum impressions per period

11. **Create PopupTargeting interface**
    - Define audience targeting rules
    - Include: pages (URL patterns)
    - Add: userType, deviceType (mobile/desktop)
    - Add: firstVisit, returningVisitor flags

12. **Create main Popup interface**
    - Define complete popup object structure
    - Include: id, title, content (HTML or text)
    - Add: image, buttons array, trigger, frequency
    - Include: size, position, type, targeting
    - Add: priority, impressions, conversions
    - Include: created/updated timestamps

13. **Create PopupResponse interface**
    - Define API response for popup lists
    - Include: popups array, metadata
    - Add pagination and filtering info

14. **Create PopupFilters interface**
    - Define query parameters
    - Include: trigger, frequency, type filters
    - Add: page filter, active status

15. **Export all types**
    - Export all interfaces and enums
    - Create type aliases for common uses
    - Add JSDoc documentation

### Popup Type Structure

```
Popup System Types
├── Enums
│   ├── PopupTrigger (ENTRY, EXIT, SCROLL, TIMER, MANUAL)
│   ├── PopupFrequency (ONCE, SESSION, DAILY, ALWAYS)
│   ├── PopupSize (SMALL, MEDIUM, LARGE, FULLSCREEN)
│   ├── PopupPosition (CENTER, TOP, BOTTOM, BOTTOM_RIGHT)
│   └── PopupType (PROMOTION, NEWSLETTER, EXIT_OFFER, etc.)
├── Interfaces
│   ├── PopupImage (url, alt, position)
│   ├── PopupButton (text, url, action)
│   ├── PopupTriggerConfig (trigger-specific settings)
│   ├── PopupFrequencyConfig (display rules)
│   ├── PopupTargeting (audience rules)
│   ├── Popup (complete popup object)
│   ├── PopupResponse (API response)
│   └── PopupFilters (query parameters)
```

### Popup Interface Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique popup identifier |
| title | string | Yes | Popup title |
| content | string | Yes | HTML or text content |
| image | PopupImage | No | Optional image |
| buttons | PopupButton[] | Yes | CTA buttons (1-2) |
| trigger | PopupTriggerConfig | Yes | Trigger configuration |
| frequency | PopupFrequencyConfig | Yes | Display frequency |
| size | PopupSize | Yes | Popup size |
| position | PopupPosition | Yes | Screen position |
| type | PopupType | Yes | Popup category |
| targeting | PopupTargeting | No | Audience rules |
| priority | number | Yes | Display priority |

### Trigger Configurations

| Trigger | Config Properties | Example |
|---------|------------------|---------|
| ENTRY | delay: number | { trigger: 'ENTRY', delay: 3 } |
| EXIT | sensitivity: number | { trigger: 'EXIT', sensitivity: 50 } |
| SCROLL | percentage: number | { trigger: 'SCROLL', percentage: 50 } |
| TIMER | delay: number | { trigger: 'TIMER', delay: 10 } |
| MANUAL | - | { trigger: 'MANUAL' } |

### Frequency Options

| Frequency | Description | Storage Duration |
|-----------|-------------|------------------|
| ONCE | Show once, never again | Permanent (localStorage) |
| SESSION | Once per browser session | Session (sessionStorage) |
| DAILY | Once per 24 hours | Time-based (localStorage) |
| ALWAYS | Every time trigger fires | No storage |

### Size Specifications

| Size | Desktop Width | Mobile Width | Height |
|------|--------------|--------------|--------|
| SMALL | 400px | 90vw | Auto (max-vh-70) |
| MEDIUM | 600px | 95vw | Auto (max-vh-80) |
| LARGE | 800px | 95vw | Auto (max-vh-90) |
| FULLSCREEN | 100vw | 100vw | 100vh |

### Position Options

```
Screen Layout
┌─────────────────────────────────┐
│         TOP (centered)          │
│                                 │
│     CENTER (modal overlay)      │
│                                 │
│         BOTTOM (centered)       │
│                    BOTTOM_RIGHT │
└─────────────────────────────────┘
```

### Button Actions

| Action | Behavior | Example Use |
|--------|----------|-------------|
| NAVIGATE | Redirect to URL | "Shop Now" → product page |
| CLOSE | Close popup only | "No Thanks" |
| SUBMIT | Submit form + close | Newsletter signup |

### Targeting Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| pages | string[] | URL patterns | ["/", "/products/*"] |
| userType | "guest" \| "registered" | User status | "guest" |
| deviceType | "mobile" \| "desktop" \| "all" | Device filter | "desktop" |
| firstVisit | boolean | First-time visitors | true |
| returningVisitor | boolean | Return visitors | false |

### Popup Type Use Cases

| Type | Purpose | Typical Trigger |
|------|---------|-----------------|
| PROMOTION | Sales, discounts | ENTRY or SCROLL |
| NEWSLETTER | Email signup | EXIT or TIMER |
| EXIT_OFFER | Retain leaving users | EXIT |
| ANNOUNCEMENT | Important news | ENTRY |
| SURVEY | Feedback collection | SCROLL or TIMER |

### Priority System

| Priority | Description | Display Order |
|----------|-------------|---------------|
| 1 | Critical | First |
| 2 | High | Second |
| 3 | Medium | Third |
| 4 | Low | Fourth |

### Expected Outcome
- Complete TypeScript type definitions for popup system
- Type safety for popup data throughout application
- Clear contracts for API integration
- Well-documented interfaces for all popup features

### Verification Checklist
- [ ] `frontend/types/marketing/popup.types.ts` file created
- [ ] All enums defined (Trigger, Frequency, Size, Position, Type)
- [ ] PopupImage interface created
- [ ] PopupButton interface created
- [ ] PopupTriggerConfig interface created
- [ ] PopupFrequencyConfig interface created
- [ ] PopupTargeting interface created
- [ ] Main Popup interface created with all properties
- [ ] PopupResponse interface for API responses
- [ ] PopupFilters interface for queries
- [ ] All types exported properly
- [ ] JSDoc comments added for clarity

---

## Task 78: Create PromoPopup Component

### Overview
Create the PromoPopup component that displays promotional popups as modal overlays. This component handles popup rendering, overlay backdrop, close functionality, responsive design, animations, and integration with frequency control. It serves as the core visual component for all popup types and provides a consistent user experience across the webstore.

### Dependencies
- Task 77: Create Popup Types

### Instructions

1. **Create popups components directory**
   - Navigate to `frontend/components/marketing/` directory
   - Create subdirectory `popups` within marketing
   - This houses all popup-related components

2. **Create PromoPopup component file**
   - Create `PromoPopup.tsx` in `components/marketing/popups/` directory
   - Import React, hooks, and animation library
   - Import popup types and utilities

3. **Define component props interface**
   - Create PromoPopupProps interface
   - Include: popup object (required)
   - Add: isOpen boolean, onClose callback
   - Add: className, position override (optional)

4. **Set up component state**
   - Track internal open state
   - Track animation state (entering/exiting)
   - Track user interaction (clicked button)
   - Sync with isOpen prop

5. **Create modal portal**
   - Use React Portal to render at document root
   - Ensure popup renders above all other content
   - Create portal target div if not exists

6. **Create overlay backdrop**
   - Full-screen semi-transparent backdrop
   - Block interaction with page content
   - Click backdrop to close (optional)
   - Apply backdrop blur effect (optional)

7. **Create popup container**
   - Position based on popup.position prop
   - Apply sizing based on popup.size
   - Add white background and shadow
   - Round corners for modern appearance

8. **Add close button**
   - Position absolute in top-right corner
   - Use X icon or Close text
   - Style with hover effects
   - Call onClose callback on click

9. **Render popup image**
   - Display image if popup.image exists
   - Position based on image.position (top/left/right/background)
   - Use Next.js Image for optimization
   - Handle image load errors

10. **Render popup content**
    - Display popup title with prominent typography
    - Render popup content (support HTML)
    - Apply proper spacing and padding
    - Ensure readable text hierarchy

11. **Render action buttons**
    - Map over popup.buttons array
    - Render button for each action
    - Style primary vs secondary buttons
    - Handle button clicks based on action type

12. **Implement close functionality**
    - Create handleClose function
    - Trigger exit animation
    - Call onClose prop after animation
    - Record close event for analytics

13. **Add open/close animations**
    - Fade in backdrop on open
    - Scale and fade popup on open
    - Reverse animations on close
    - Use Framer Motion or CSS transitions

14. **Implement keyboard support**
    - Close on Escape key press
    - Focus trap within popup
    - Tab navigation through elements
    - Return focus to trigger on close

15. **Add responsive behavior**
    - Full-width with padding on mobile
    - Fixed width on desktop
    - Adjust text sizes by screen size
    - Stack buttons vertically on mobile

16. **Implement accessibility**
    - Add role="dialog" and aria-modal="true"
    - Add aria-labelledby for title
    - Proper focus management
    - Screen reader announcements

17. **Export component**
    - Export PromoPopup component
    - Add JSDoc comments
    - Include usage examples

### Component Structure

```
PromoPopup Component
├── Portal (document.body)
│   ├── Overlay Backdrop (click to close)
│   └── Popup Container (modal)
│       ├── Close Button (top-right)
│       ├── Image (optional, positioned)
│       ├── Content Section
│       │   ├── Title
│       │   └── Content (HTML/text)
│       └── Actions Section
│           └── Button × N (1-2 buttons)
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| popup | Popup | Yes | - | Popup data object |
| isOpen | boolean | Yes | - | Open/closed state |
| onClose | Function | Yes | - | Close callback |
| className | string | No | "" | Additional classes |

### Popup Sizing

| Size | Desktop | Mobile | Max Height |
|------|---------|--------|------------|
| SMALL | 400px | 90vw | 70vh |
| MEDIUM | 600px | 95vw | 80vh |
| LARGE | 800px | 95vw | 90vh |
| FULLSCREEN | 100vw | 100vw | 100vh |

### Popup Positioning

```
CENTER Position
┌─────────────────────────────────┐
│                                 │
│         ┌───────────┐          │
│         │  Popup    │          │
│         └───────────┘          │
│                                 │
└─────────────────────────────────┘

BOTTOM_RIGHT Position
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│                   ┌──────────┐ │
│                   │  Popup   │ │
└───────────────────└──────────┘─┘
```

### Overlay Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Background | rgba(0,0,0,0.5) | Semi-transparent |
| Backdrop Filter | blur(4px) | Background blur (optional) |
| Z-Index | 1000 | Above all content |
| Click | Close popup | Dismiss on backdrop click |

### Close Button Styling

| Property | Value |
|----------|-------|
| Position | absolute top-4 right-4 |
| Size | 32px × 32px |
| Icon | X or Close icon |
| Hover | Background color change |
| Focus | Visible focus ring |

### Image Positioning

| Position | Layout | Description |
|----------|--------|-------------|
| TOP | Above content | Full-width header image |
| LEFT | Left sidebar | 40% width, content on right |
| RIGHT | Right sidebar | 40% width, content on left |
| BACKGROUND | Behind content | Full coverage with overlay |

### Content Layout

```
Popup Content Structure
┌────────────────────────────────┐
│ [X]                            │ ← Close button
│                                │
│ [Image - Optional]             │
│                                │
│ Title Text                     │
│                                │
│ Content paragraph text here... │
│ More content...                │
│                                │
│ [Primary Button] [Secondary]   │
└────────────────────────────────┘
```

### Animation Timing

| Animation | Duration | Easing | Delay |
|-----------|----------|--------|-------|
| Backdrop Fade In | 200ms | ease-out | 0ms |
| Popup Scale In | 300ms | ease-out | 50ms |
| Backdrop Fade Out | 200ms | ease-in | 0ms |
| Popup Scale Out | 250ms | ease-in | 0ms |

### Keyboard Support

| Key | Action |
|-----|--------|
| Escape | Close popup |
| Tab | Navigate forward |
| Shift+Tab | Navigate backward |
| Enter/Space | Activate focused button |

### Button Actions Implementation

```
Button Click → handleButtonClick(button)
    │
    ├── If action === 'NAVIGATE'
    │   ├── Close popup
    │   └── Navigate to button.url
    │
    ├── If action === 'CLOSE'
    │   └── Close popup
    │
    └── If action === 'SUBMIT'
        ├── Submit form data
        ├── Show success message
        └── Close popup
```

### Responsive Behavior

| Breakpoint | Container | Padding | Buttons |
|------------|-----------|---------|---------|
| Mobile | 90vw | p-4 | Stacked |
| Tablet | 600px | p-6 | Inline |
| Desktop | size-based | p-8 | Inline |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA Role | role="dialog" aria-modal="true" |
| ARIA Label | aria-labelledby={titleId} |
| Focus Trap | Trap focus within popup |
| Focus Return | Return to trigger on close |
| Screen Reader | Announce popup opening |
| Keyboard | Full keyboard navigation |

### Expected Outcome
- Reusable popup component for all popup types
- Modal overlay with backdrop
- Smooth animations for open/close
- Full keyboard and accessibility support

### Verification Checklist
- [ ] `frontend/components/marketing/popups/PromoPopup.tsx` created
- [ ] PromoPopupProps interface defined
- [ ] React Portal implemented for rendering
- [ ] Overlay backdrop created
- [ ] Popup container with sizing and positioning
- [ ] Close button functional
- [ ] Image rendering with position support
- [ ] Title and content display
- [ ] Action buttons render and handle clicks
- [ ] Open/close animations working
- [ ] Keyboard support (Escape to close)
- [ ] Focus trap implemented
- [ ] Responsive design for mobile and desktop
- [ ] Accessibility features implemented
- [ ] Component exported properly

---

## Task 79: Create Popup Timing

### Overview
Implement timing and trigger logic for promotional popups. This includes entry delay triggers, scroll-based triggers, timer-based triggers, and coordination with the popup display system. The timing system ensures popups appear at the right moment to maximize engagement without disrupting the user experience.

### Dependencies
- Task 78: Create PromoPopup Component

### Instructions

1. **Create popup hooks directory**
   - Navigate to `frontend/hooks/marketing/` directory
   - Prepare to create timing-related hooks

2. **Create usePopupTrigger hook file**
   - Create `usePopupTrigger.ts` in `hooks/marketing/` directory
   - Import React hooks (useState, useEffect)
   - Import popup types

3. **Define hook props interface**
   - Create UsePopupTriggerProps interface
   - Include: popup object, enabled flag
   - Add: onTrigger callback

4. **Implement ENTRY trigger**
   - Check if trigger type is ENTRY
   - Set timeout based on trigger.delay
   - Fire onTrigger after delay
   - Clear timeout on unmount
   - Only trigger once per component mount

5. **Implement TIMER trigger**
   - Similar to ENTRY but configurable delay
   - Use setTimeout with delay from config
   - Fire onTrigger callback
   - Clear timer on unmount or component update

6. **Create useScrollTrigger hook**
   - Create separate hook for scroll detection
   - Track scroll percentage using scroll event
   - Calculate: (scrollTop / (scrollHeight - clientHeight)) × 100
   - Trigger when percentage exceeds threshold

7. **Implement SCROLL trigger**
   - Use useScrollTrigger hook
   - Get scroll percentage from config
   - Fire onTrigger when threshold reached
   - Trigger only once (use flag)

8. **Add scroll throttling**
   - Throttle scroll event to improve performance
   - Use throttle interval of 200-300ms
   - Update scroll percentage state
   - Remove listener on unmount

9. **Create usePageVisibilityTrigger hook**
   - Track page visibility changes
   - Pause timers when tab is hidden
   - Resume timers when tab is visible
   - Adjust remaining time appropriately

10. **Combine multiple triggers (optional)**
    - Support OR logic (trigger on any condition)
    - Support AND logic (trigger on all conditions)
    - Track which trigger fired first
    - Prevent duplicate triggers

11. **Add trigger debugging mode**
    - Log trigger events in development
    - Show which trigger activated
    - Display timing information
    - Useful for testing and optimization

12. **Implement trigger cooldown**
    - Prevent trigger spam
    - Add minimum time between triggers (5-10 seconds)
    - Use cooldown state
    - Reset cooldown after popup closes

13. **Create usePopupManager hook**
    - Combine trigger logic with popup display
    - Manage multiple popups with priorities
    - Queue popups if multiple triggered
    - Show highest priority first

14. **Handle page navigation**
    - Reset triggers on route change
    - Clear timers on navigation
    - Re-initialize on new page load
    - Consider single-page app behavior

15. **Export all hooks**
    - Export usePopupTrigger
    - Export useScrollTrigger
    - Export usePageVisibilityTrigger
    - Export usePopupManager
    - Add JSDoc documentation

### Trigger Timing Structure

```
Popup Trigger System
├── usePopupTrigger (main hook)
│   ├── ENTRY → setTimeout(delay)
│   ├── TIMER → setTimeout(delay)
│   ├── SCROLL → useScrollTrigger(percentage)
│   ├── EXIT → (handled in Task 81)
│   └── MANUAL → Direct call
├── useScrollTrigger (scroll detection)
│   ├── Scroll event listener
│   ├── Percentage calculation
│   └── Throttling
├── usePageVisibilityTrigger (pause/resume)
│   └── Page visibility API
└── usePopupManager (orchestration)
    ├── Trigger coordination
    ├── Priority queue
    └── Display control
```

### ENTRY Trigger Implementation

```
Page Load → useEffect
    │
    ├── Check trigger === 'ENTRY'
    │
    ├── setTimeout(delay × 1000)
    │   └── Wait for configured delay
    │
    ├── Fire onTrigger()
    │
    └── Cleanup: clearTimeout on unmount
```

### SCROLL Trigger Implementation

```
Scroll Event → Throttled Handler
    │
    ├── Calculate scroll percentage
    │   scrollPercent = (scrollTop / (scrollHeight - clientHeight)) × 100
    │
    ├── Check if scrollPercent >= threshold
    │
    ├── If true and not triggered
    │   ├── Set triggered flag
    │   └── Fire onTrigger()
    │
    └── Cleanup: Remove listener on unmount
```

### Timing Configurations

| Trigger | Config | Default | Range |
|---------|--------|---------|-------|
| ENTRY | delay (seconds) | 3 | 0-30 |
| TIMER | delay (seconds) | 10 | 5-60 |
| SCROLL | percentage | 50 | 0-100 |
| EXIT | sensitivity | 50 | 0-100 |

### Scroll Percentage Calculation

| Scroll Position | Percentage | Trigger Point |
|-----------------|------------|---------------|
| Top of page | 0% | Not triggered |
| Middle | 50% | Triggers at 50% threshold |
| Bottom | 100% | Triggers at any threshold |

### Throttle Strategy

```
Scroll Events → Throttle (200ms)
    │
    ├── Event 1: Process
    ├── Event 2: Ignore (within 200ms)
    ├── Event 3: Ignore
    ├── Event 4: Process (after 200ms)
    └── Continue...
```

### Page Visibility Handling

| Event | Action |
|-------|--------|
| Tab Hidden | Pause active timers, record remaining time |
| Tab Visible | Resume timers with remaining time |
| Tab Closed | Clean up all timers |

### Multiple Triggers Example

```
Popup Config: { triggers: ['ENTRY:3', 'SCROLL:50'] }

Logic:
├── Start ENTRY timer (3 seconds)
├── Start SCROLL listener (50%)
├── Whichever triggers first → Show popup
└── Cancel other triggers
```

### Trigger Priority

| Trigger | Priority | Reason |
|---------|----------|--------|
| MANUAL | Highest | Developer control |
| EXIT | High | Time-sensitive |
| SCROLL | Medium | User engaged |
| ENTRY | Medium | Timed entry |
| TIMER | Low | Background timer |

### Cooldown Management

```
Popup Shown → Start Cooldown (10 seconds)
    │
    ├── Block new triggers during cooldown
    │
    ├── After cooldown expires
    │   └── Allow triggers again
    │
    └── User closes popup → Reset cooldown
```

### Performance Optimization

| Technique | Implementation |
|-----------|----------------|
| Throttling | Throttle scroll events (200ms) |
| Debouncing | Debounce resize events (300ms) |
| Cleanup | Remove all listeners on unmount |
| Single Trigger | Trigger only once per session |

### Expected Outcome
- Functional trigger system for all trigger types
- Accurate timing for entry and timer triggers
- Scroll-based triggers at configured percentages
- Performance-optimized with throttling

### Verification Checklist
- [ ] `frontend/hooks/marketing/usePopupTrigger.ts` file created
- [ ] UsePopupTriggerProps interface defined
- [ ] ENTRY trigger implemented with setTimeout
- [ ] TIMER trigger implemented
- [ ] useScrollTrigger hook created
- [ ] SCROLL trigger implemented with percentage calculation
- [ ] Scroll throttling applied (200ms)
- [ ] usePageVisibilityTrigger hook created
- [ ] Page visibility handling implemented
- [ ] Trigger cooldown added
- [ ] Multiple triggers support (optional)
- [ ] usePopupManager hook created
- [ ] All hooks exported properly
- [ ] JSDoc comments added

---

## Task 80: Create Popup Frequency

### Overview
Implement frequency control for promotional popups to prevent popup fatigue and respect user preferences. This includes storing popup view history in localStorage, implementing different frequency types (once, session, daily), respecting user dismissals, and providing options for popup management. The frequency system ensures popups enhance rather than detract from the user experience.

### Dependencies
- Task 79: Create Popup Timing

### Instructions

1. **Create popup storage utility**
   - Create `popupStorage.ts` in `lib/marketing/` directory
   - Define localStorage key structure
   - Create helper functions for storage operations

2. **Define popup view record interface**
   - Create PopupViewRecord interface
   - Include: popupId, viewedAt timestamp
   - Add: dismissed flag, dismissedAt timestamp
   - Add: conversions count, lastConversion timestamp

3. **Create getPopupHistory function**
   - Read popup history from localStorage
   - Parse stored JSON data
   - Return array of view records
   - Handle storage errors gracefully

4. **Create recordPopupView function**
   - Accept popup ID
   - Create view record with current timestamp
   - Update existing record or add new one
   - Save to localStorage
   - Handle storage quota errors

5. **Create recordPopupDismissal function**
   - Accept popup ID
   - Update record with dismissal flag
   - Set dismissedAt timestamp
   - Save to localStorage

6. **Create recordPopupConversion function**
   - Accept popup ID
   - Increment conversions count
   - Update lastConversion timestamp
   - Track successful interactions

7. **Create shouldShowPopup function**
   - Accept popup object and current timestamp
   - Check frequency configuration
   - Check view history
   - Return boolean indicating if popup should show

8. **Implement ONCE frequency logic**
   - Check if popup was ever viewed
   - If viewed, return false (don't show)
   - If not viewed, return true (show)
   - Store view permanently

9. **Implement SESSION frequency logic**
   - Use sessionStorage instead of localStorage
   - Check if popup viewed in current session
   - Clear on browser/tab close
   - Allow showing in new sessions

10. **Implement DAILY frequency logic**
    - Check last view timestamp
    - Calculate time difference
    - If < 24 hours, return false
    - If ≥ 24 hours, return true and update

11. **Implement ALWAYS frequency logic**
    - Always return true (show every time)
    - No storage needed
    - Still respect trigger conditions
    - Use for testing or critical announcements

12. **Add cooldown period support**
    - Additional time buffer between shows
    - Even if frequency allows, respect cooldown
    - Example: Show daily but min 2 hours apart
    - Configurable per popup

13. **Implement maximum impressions limit**
    - Track total view count per popup
    - Set maximum impressions (e.g., 10 times)
    - After max reached, don't show again
    - Override for critical popups

14. **Create cleanup function**
    - Remove old popup records (> 30 days)
    - Clear dismissed popups after expiration
    - Optimize storage usage
    - Run on app initialization

15. **Create usePopupFrequency hook**
    - Combine storage logic with React state
    - Check frequency on trigger
    - Update view history automatically
    - Provide manual control functions

16. **Handle storage edge cases**
    - Check localStorage availability
    - Fallback to sessionStorage
    - Fallback to in-memory if both disabled
    - Handle JSON parse errors

17. **Add developer override**
    - Support URL parameter to force show
    - Example: ?showPopup=popup-id
    - Bypass frequency checks for testing
    - Clear history option

18. **Export all functions and hooks**
    - Export storage utilities
    - Export usePopupFrequency hook
    - Add comprehensive JSDoc comments

### Frequency Control Structure

```
Popup Frequency System
├── Storage Utilities (popupStorage.ts)
│   ├── getPopupHistory()
│   ├── recordPopupView(id)
│   ├── recordPopupDismissal(id)
│   ├── recordPopupConversion(id)
│   └── shouldShowPopup(popup)
├── Frequency Logic
│   ├── ONCE → Permanent storage
│   ├── SESSION → Session storage
│   ├── DAILY → 24-hour check
│   └── ALWAYS → No restriction
└── usePopupFrequency Hook
    ├── Check frequency on trigger
    ├── Record views automatically
    └── Provide control functions
```

### Storage Structure

```
localStorage Key: "lcc_popup_history"

Value (JSON):
{
  "popup-1": {
    "viewedAt": "2026-01-31T12:00:00Z",
    "dismissed": false,
    "dismissedAt": null,
    "viewCount": 3,
    "conversions": 1,
    "lastConversion": "2026-01-31T12:05:00Z"
  },
  "popup-2": {
    "viewedAt": "2026-01-30T08:00:00Z",
    "dismissed": true,
    "dismissedAt": "2026-01-30T08:01:00Z",
    "viewCount": 1,
    "conversions": 0,
    "lastConversion": null
  }
}
```

### Frequency Types Implementation

| Frequency | Check Logic | Storage Type | Duration |
|-----------|-------------|--------------|----------|
| ONCE | viewCount > 0 ? false : true | localStorage | Permanent |
| SESSION | sessionViewed ? false : true | sessionStorage | Session |
| DAILY | now - viewedAt < 24h ? false : true | localStorage | 24 hours |
| ALWAYS | true | None | N/A |

### shouldShowPopup Function Logic

```
shouldShowPopup(popup) → boolean
    │
    ├── Get view history for popup.id
    │
    ├── If frequency === 'ONCE'
    │   └── Return !history.viewed
    │
    ├── If frequency === 'SESSION'
    │   └── Check sessionStorage
    │
    ├── If frequency === 'DAILY'
    │   ├── Calculate time since last view
    │   └── Return (timeDiff >= 24 hours)
    │
    ├── If frequency === 'ALWAYS'
    │   └── Return true
    │
    ├── Check cooldown period
    │   └── Return (timeSinceView >= cooldown)
    │
    └── Check max impressions
        └── Return (viewCount < maxImpressions)
```

### Cooldown Configuration

| Frequency | Default Cooldown | Min Cooldown | Max Cooldown |
|-----------|------------------|--------------|--------------|
| ONCE | N/A (single view) | N/A | N/A |
| SESSION | None | 5 min | 1 hour |
| DAILY | 24 hours | 12 hours | 7 days |
| ALWAYS | 5 min | 1 min | 1 hour |

### View Recording Flow

```
Popup Displayed → recordPopupView(id)
    │
    ├── Get current history
    │
    ├── Create/Update record
    │   ├── Set viewedAt timestamp
    │   ├── Increment viewCount
    │   └── Keep other fields
    │
    ├── Save to appropriate storage
    │   ├── localStorage (ONCE, DAILY)
    │   └── sessionStorage (SESSION)
    │
    └── Handle errors gracefully
```

### Maximum Impressions Limit

| Popup Priority | Max Impressions | Rationale |
|----------------|-----------------|-----------|
| Critical | Unlimited | Always show |
| High | 10 | Multiple chances |
| Medium | 5 | Limited exposure |
| Low | 3 | Minimal interruption |

### Cleanup Strategy

```
App Initialization → cleanupPopupHistory()
    │
    ├── Get all popup records
    │
    ├── For each record
    │   ├── If age > 30 days → Remove
    │   ├── If dismissed && age > 7 days → Remove
    │   └── If conversions > 0 → Keep (analytics)
    │
    └── Save cleaned history
```

### Storage Edge Cases

| Case | Handling |
|------|----------|
| localStorage disabled | Use sessionStorage |
| sessionStorage disabled | Use in-memory Map |
| Storage quota exceeded | Remove oldest records |
| Invalid JSON | Clear storage, start fresh |
| Missing data | Return default values |

### Developer Override

```
URL: /?showPopup=popup-id&ignoreFrequency=true

Logic:
if (urlParams.has('showPopup')) {
  const id = urlParams.get('showPopup');
  const ignore = urlParams.get('ignoreFrequency');
  if (ignore === 'true') {
    // Bypass frequency checks
    return true;
  }
}
```

### usePopupFrequency Hook

| Hook Method | Purpose | Parameters |
|-------------|---------|------------|
| canShow | Check if popup should display | popupId |
| recordView | Record popup view | popupId |
| recordDismiss | Record user dismissal | popupId |
| recordConversion | Record successful action | popupId |
| clearHistory | Clear popup history (testing) | popupId? |

### Expected Outcome
- Functional frequency control system
- Persistent storage of popup views
- Support for all frequency types
- Graceful handling of storage limitations

### Verification Checklist
- [ ] `frontend/lib/marketing/popupStorage.ts` file created
- [ ] PopupViewRecord interface defined
- [ ] getPopupHistory function implemented
- [ ] recordPopupView function implemented
- [ ] recordPopupDismissal function implemented
- [ ] recordPopupConversion function implemented
- [ ] shouldShowPopup function implemented
- [ ] ONCE frequency logic working
- [ ] SESSION frequency logic working
- [ ] DAILY frequency logic working
- [ ] ALWAYS frequency logic working
- [ ] Cooldown period support added
- [ ] Maximum impressions limit implemented
- [ ] Cleanup function created
- [ ] usePopupFrequency hook created
- [ ] Storage edge cases handled
- [ ] Developer override functional
- [ ] All functions exported properly

---

## Task 81: Create Exit Intent Popup

### Overview
Implement exit-intent detection for promotional popups that trigger when users show intent to leave the page. This sophisticated technique detects mouse movement toward the browser's top edge on desktop and provides an opportunity to retain users with special offers or compelling content. Exit-intent popups are a proven method for reducing bounce rates and increasing conversions.

### Dependencies
- Task 80: Create Popup Frequency

### Instructions

1. **Create useExitIntent hook file**
   - Create `useExitIntent.ts` in `hooks/marketing/` directory
   - Import React hooks (useState, useEffect, useCallback)
   - Import debounce utility

2. **Define hook props interface**
   - Create UseExitIntentProps interface
   - Include: onExitIntent callback
   - Add: enabled flag, sensitivity threshold
   - Add: delay before enabling (prevent immediate trigger)

3. **Set up exit intent state**
   - Track if exit intent has been triggered
   - Track if hook is currently enabled
   - Track mouse position
   - Prevent duplicate triggers

4. **Implement mouse move listener**
   - Add event listener for mousemove
   - Track mouse Y position
   - Check if mouse is moving upward
   - Calculate velocity for better detection

5. **Detect exit intent**
   - Trigger when mouse Y position < threshold (typically 10-20px)
   - Check if mouse is moving up (negative velocity)
   - Add debounce to prevent false positives
   - Only trigger on desktop (check screen width)

6. **Add sensitivity configuration**
   - Low sensitivity: Trigger at Y = 0 (strict)
   - Medium sensitivity: Trigger at Y < 10px
   - High sensitivity: Trigger at Y < 20px
   - Configurable via props

7. **Implement trigger delay**
   - Don't enable listener immediately on mount
   - Wait X seconds before enabling (default: 3-5 seconds)
   - Prevents triggering when user just arrived
   - Ensures user has seen some content

8. **Add device detection**
   - Only enable on desktop (screen width > 768px)
   - Mobile doesn't have exit intent (no cursor)
   - Disable on touch devices
   - Use user agent or screen size check

9. **Prevent immediate re-trigger**
   - After trigger, disable for cooldown period
   - Cooldown: 30-60 seconds recommended
   - Use session-based or time-based cooldown
   - Prevent popup spam

10. **Handle trigger event**
    - Call onExitIntent callback when detected
    - Pass event data (mouse position, velocity)
    - Set triggered flag
    - Disable listener after trigger

11. **Add trigger count limit**
    - Limit to once per session (recommended)
    - Or once per day (via frequency control)
    - Store in sessionStorage or localStorage
    - Check count before enabling

12. **Implement cleanup**
    - Remove mousemove listener on unmount
    - Clear all timers and intervals
    - Reset state appropriately
    - Prevent memory leaks

13. **Add debugging mode**
    - Log exit intent detections in dev mode
    - Show visual indicator on detection
    - Display sensitivity threshold
    - Useful for testing and tuning

14. **Create ExitIntentPopup component**
    - Create component wrapping PromoPopup
    - Integrate useExitIntent hook
    - Handle popup display on exit intent
    - Respect frequency and targeting rules

15. **Apply best practices**
    - Only show on pages with high bounce rates
    - Use compelling offers (discount, free shipping)
    - Keep content concise and valuable
    - Easy to dismiss (clear close button)

16. **Export hook and component**
    - Export useExitIntent hook
    - Export ExitIntentPopup component
    - Add comprehensive JSDoc comments

### Exit Intent System Structure

```
Exit Intent Detection
├── useExitIntent Hook
│   ├── Mouse move listener
│   ├── Y position tracking
│   ├── Velocity calculation
│   ├── Threshold detection
│   └── Trigger callback
├── Device Detection
│   ├── Desktop only (>768px)
│   └── Non-touch devices
├── Trigger Control
│   ├── Delay before enabling
│   ├── Cooldown after trigger
│   └── Session limit
└── ExitIntentPopup Component
    ├── useExitIntent integration
    ├── PromoPopup wrapper
    └── Frequency control
```

### Exit Intent Detection Logic

```
Mouse Movement → Event Handler
    │
    ├── Check if enabled (past initial delay)
    │
    ├── Check device (desktop only)
    │
    ├── Get mouse Y position
    │
    ├── Check if Y < threshold (10-20px)
    │
    ├── Check if moving upward
    │
    ├── Debounce (prevent false positives)
    │
    ├── If all conditions met
    │   ├── Fire onExitIntent callback
    │   ├── Set triggered flag
    │   └── Disable listener
    │
    └── Apply cooldown
```

### Sensitivity Levels

| Sensitivity | Y Threshold | Velocity Check | Use Case |
|-------------|-------------|----------------|----------|
| Low | 0px | Strict upward | Minimize false positives |
| Medium | 10px | Moderate upward | Balanced detection |
| High | 20px | Any upward | Maximize triggers |

### Visual Detection Zones

```
Browser Window
┌─────────────────────────────────┐
│ [10px threshold zone]           │ ← Exit intent triggers here
├─────────────────────────────────┤
│                                 │
│                                 │
│     Page Content                │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### Device Detection

| Device Type | Detection Method | Enable Exit Intent |
|-------------|------------------|-------------------|
| Desktop | Screen width > 768px | Yes |
| Tablet | 768px ≥ width > 640px | Optional |
| Mobile | Width ≤ 640px | No |
| Touch Device | Touch events detected | No |

### Timing Configuration

| Timing | Duration | Purpose |
|--------|----------|---------|
| Initial Delay | 3-5 seconds | Let user see content first |
| Debounce | 300-500ms | Prevent false positives |
| Cooldown | 30-60 seconds | Prevent re-trigger spam |
| Session Limit | Once per session | Respect user experience |

### Trigger Flow

```
Page Load
    │
    ├── Wait initial delay (5 seconds)
    │
    ├── Enable mouse listener
    │
    ├── User moves mouse to top
    │
    ├── Exit intent detected
    │
    ├── Fire onExitIntent callback
    │
    ├── Show ExitIntentPopup
    │
    ├── Disable listener
    │
    └── Start cooldown
```

### useExitIntent Hook Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onExitIntent | Function | - | Callback on detection |
| enabled | boolean | true | Enable/disable hook |
| sensitivity | "low" \| "medium" \| "high" | "medium" | Detection sensitivity |
| delay | number | 5000 | Initial delay (ms) |
| cooldown | number | 60000 | Cooldown period (ms) |

### ExitIntentPopup Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| popup | Popup | Yes | Popup data object |
| sensitivity | string | No | Detection sensitivity |
| delay | number | No | Initial delay |

### Common Exit Intent Offers

| Offer Type | Message | CTA | Conversion Rate |
|------------|---------|-----|-----------------|
| Discount | "Wait! Get 10% off your first order" | "Claim Offer" | High |
| Free Shipping | "Don't leave yet! Free shipping on all orders" | "Continue Shopping" | Medium |
| Newsletter | "Stay updated with exclusive deals" | "Subscribe" | Medium |
| Survey | "Help us improve - quick 2-min survey" | "Take Survey" | Low |

### Best Practices

| Practice | Implementation |
|----------|----------------|
| Timing | Show after 5+ seconds on page |
| Frequency | Once per session maximum |
| Content | Compelling offer or value |
| Design | Clear, concise, easy to dismiss |
| Mobile | Don't use on mobile devices |
| Testing | A/B test offers and timing |

### Performance Considerations

| Concern | Solution |
|---------|----------|
| Mouse Event Spam | Debounce handler (300ms) |
| Memory Leaks | Clean up listeners on unmount |
| False Positives | Use velocity check + debounce |
| Device Detection | Cache result, check once |

### Analytics Tracking

| Event | Data to Track |
|-------|--------------|
| Exit Intent Triggered | Page URL, time on page |
| Popup Shown | Popup ID, offer type |
| Popup Dismissed | Time visible, no action |
| Conversion | Action taken, revenue |

### Expected Outcome
- Functional exit-intent detection for desktop
- Sophisticated mouse tracking and trigger logic
- Configurable sensitivity and timing
- Integrated with popup and frequency systems

### Verification Checklist
- [ ] `frontend/hooks/marketing/useExitIntent.ts` file created
- [ ] UseExitIntentProps interface defined
- [ ] Mouse move listener implemented
- [ ] Exit intent detection logic working
- [ ] Sensitivity levels configurable
- [ ] Initial delay before enabling
- [ ] Device detection (desktop only)
- [ ] Debounce applied to prevent false positives
- [ ] Cooldown period after trigger
- [ ] Trigger count limit (once per session)
- [ ] ExitIntentPopup component created
- [ ] useExitIntent integrated with popup
- [ ] Cleanup on unmount
- [ ] Debugging mode available
- [ ] All exports properly done

---

## Task 82: Verify Banners & Popups

### Overview
Conduct comprehensive verification and testing of all banner and popup features implemented in this group. This includes functional testing, visual testing, responsive testing, accessibility testing, performance testing, and user experience validation. Ensure all components work correctly across devices, browsers, and user scenarios before considering the feature complete.

### Dependencies
- Task 81: Create Exit Intent Popup (all features complete)

### Instructions

1. **Create test plan document**
   - Create `BANNER_POPUP_TEST_PLAN.md` in docs directory
   - List all test scenarios
   - Define success criteria
   - Document expected behaviors

2. **Test banner types and API**
   - Verify banner types are correctly defined
   - Test API endpoints for fetching banners
   - Verify filtering by position and type
   - Check error handling for failed requests

3. **Test useBanners hook**
   - Verify hook fetches active banners
   - Test position filtering
   - Check caching behavior
   - Verify refetching on window focus

4. **Test PromoBanner component**
   - Verify banner image displays correctly
   - Test text overlay readability
   - Check CTA button functionality
   - Test click tracking integration
   - Verify responsive behavior

5. **Test BannerCarousel component**
   - Verify carousel displays multiple banners
   - Test autoplay functionality (5 seconds)
   - Check pause on hover
   - Test navigation arrows
   - Test pagination dots
   - Verify touch/swipe gestures on mobile

6. **Test AnnouncementBar component**
   - Verify bar displays at top of page
   - Test message and link rendering
   - Check dismiss button functionality
   - Verify persistence after dismissal

7. **Test popup types**
   - Verify all popup types are defined
   - Check trigger configurations
   - Test frequency settings
   - Verify targeting options

8. **Test PromoPopup component**
   - Verify popup displays as modal overlay
   - Test backdrop click to close
   - Check close button functionality
   - Test content rendering (title, image, buttons)
   - Verify animations (fade in/out)
   - Test keyboard support (Escape to close)

9. **Test popup triggers**
   - Test ENTRY trigger (displays after delay)
   - Test TIMER trigger (displays after X seconds)
   - Test SCROLL trigger (displays at % threshold)
   - Verify triggers fire only once
   - Check page visibility handling

10. **Test popup frequency control**
    - Test ONCE frequency (shows once, never again)
    - Test SESSION frequency (once per session)
    - Test DAILY frequency (once per 24 hours)
    - Test ALWAYS frequency (shows every time)
    - Verify localStorage persistence
    - Test cleanup of old records

11. **Test exit intent detection**
    - Verify exit intent triggers on mouse leave
    - Test sensitivity levels (low, medium, high)
    - Check initial delay before enabling
    - Verify desktop-only behavior
    - Test cooldown after trigger
    - Check session limit (once per session)

12. **Test responsive design**
    - Mobile (< 640px): Test all components
    - Tablet (640-1024px): Verify layouts
    - Desktop (> 1024px): Check full features
    - Test landscape and portrait orientations

13. **Test accessibility**
    - Screen reader support (NVDA, JAWS)
    - Keyboard navigation (Tab, Enter, Escape)
    - Focus management (focus trap in popups)
    - Color contrast (WCAG AA compliance)
    - ARIA labels and roles
    - Touch target sizes (min 44px)

14. **Test performance**
    - Banner image loading times
    - Carousel animation smoothness
    - Popup open/close animation smoothness
    - Scroll event performance (throttling)
    - Memory usage (no leaks)
    - Bundle size impact

15. **Test cross-browser compatibility**
    - Chrome (latest)
    - Firefox (latest)
    - Safari (latest)
    - Edge (latest)
    - Test localStorage/sessionStorage support

16. **Test user scenarios**
    - New visitor journey
    - Returning visitor journey
    - User dismisses all popups
    - User interacts with CTA
    - User closes browser and returns

17. **Test edge cases**
    - localStorage disabled (private browsing)
    - Slow network (banner loading)
    - Multiple popups active (priority queue)
    - Banner/popup with missing images
    - Very long text content

18. **Document test results**
    - Record all test outcomes
    - List any bugs or issues found
    - Document browser-specific quirks
    - Create bug reports for failures

19. **Fix identified issues**
    - Prioritize critical bugs
    - Fix failing tests
    - Re-test after fixes
    - Update components as needed

20. **Create usage documentation**
    - Document how to create banners
    - Explain popup trigger configurations
    - Provide examples for common use cases
    - List best practices for marketers

### Test Categories

```
Verification Testing
├── Functional Testing
│   ├── Banner display
│   ├── Popup triggers
│   ├── Frequency control
│   └── Exit intent detection
├── Visual Testing
│   ├── Component styling
│   ├── Responsive layouts
│   └── Animation quality
├── Accessibility Testing
│   ├── Screen readers
│   ├── Keyboard navigation
│   └── ARIA compliance
├── Performance Testing
│   ├── Load times
│   ├── Animation smoothness
│   └── Memory usage
└── User Experience Testing
    ├── User journeys
    ├── Edge cases
    └── Cross-browser
```

### Functional Test Checklist

| Component | Test | Expected Result |
|-----------|------|-----------------|
| Banner API | Fetch active banners | Returns array of banners |
| useBanners | Filter by position | Returns filtered banners |
| PromoBanner | Display banner | Shows image, title, CTA |
| BannerCarousel | Autoplay | Advances every 5 seconds |
| AnnouncementBar | Dismiss | Hides and stays hidden |
| PromoPopup | Display | Shows as modal overlay |
| ENTRY Trigger | Page load + delay | Popup appears after X seconds |
| SCROLL Trigger | Scroll to 50% | Popup appears at threshold |
| EXIT Trigger | Mouse to top | Popup appears on exit intent |
| ONCE Frequency | View popup | Never shows again |
| SESSION Frequency | View + close tab | Shows again on new session |

### Responsive Test Matrix

| Component | Mobile (< 640px) | Tablet (640-1024px) | Desktop (> 1024px) |
|-----------|------------------|---------------------|-------------------|
| PromoBanner | Full width, smaller text | Medium size | Full size |
| BannerCarousel | Swipe gestures | Arrows + swipe | Arrows + dots |
| AnnouncementBar | Stacked layout | Horizontal layout | Horizontal layout |
| PromoPopup | 90vw width | 600px width | Size-based width |
| Exit Intent | Disabled | Optional | Enabled |

### Accessibility Test Checklist

| Requirement | Test Method | Pass/Fail |
|-------------|-------------|-----------|
| Screen Reader | Navigate with NVDA | Content announced correctly |
| Keyboard Nav | Tab through elements | All interactive elements reachable |
| Focus Trap | Tab in open popup | Focus stays within popup |
| Escape Key | Press Escape in popup | Popup closes |
| Color Contrast | Use contrast checker | 4.5:1 minimum ratio |
| Touch Targets | Measure button sizes | Min 44px × 44px |
| ARIA Labels | Inspect with dev tools | Proper labels present |

### Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Banner Load Time | < 500ms | Network tab |
| Carousel FPS | 60 FPS | Performance monitor |
| Popup Animation | Smooth, no jank | Visual inspection |
| Scroll Handler | < 16ms execution | Performance profiler |
| Memory Usage | No leaks | Heap snapshots |
| Bundle Impact | < 50KB | Build analysis |

### Cross-Browser Test Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Banners | ✓ | ✓ | ✓ | ✓ |
| Carousel | ✓ | ✓ | ✓ | ✓ |
| Popups | ✓ | ✓ | ✓ | ✓ |
| Exit Intent | ✓ | ✓ | ✓ | ✓ |
| localStorage | ✓ | ✓ | ✓ | ✓ |

### User Journey Test Scenarios

| Scenario | Steps | Expected Outcome |
|----------|-------|------------------|
| New Visitor | 1. Land on homepage<br>2. Wait 5 seconds | Entry popup appears |
| | 3. Scroll to 50% | No additional popup (cooldown) |
| | 4. Move mouse to exit | Exit intent popup appears |
| Returning Visitor | 1. Return to site next day | No entry popup (seen once) |
| | 2. Daily popup should show | Daily frequency popup appears |
| Dismisses All | 1. Dismiss entry popup<br>2. Dismiss banner | All remain hidden on refresh |

### Edge Case Scenarios

| Edge Case | Test | Expected Behavior |
|-----------|------|-------------------|
| localStorage Disabled | Browse in private mode | Use sessionStorage fallback |
| Slow Network | Throttle to 3G | Show loading states, fallback images |
| Multiple Popups | Trigger entry + exit | Show highest priority only |
| Missing Image | Banner without image | Show placeholder or text only |
| Long Content | 500+ word popup | Scrollable content area |

### Bug Report Template

```markdown
## Bug Report

**Title:** [Brief description]

**Component:** [Banner/Popup/Carousel/etc.]

**Severity:** [Critical/High/Medium/Low]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:** [What should happen]

**Actual Result:** [What actually happens]

**Browser:** [Chrome 120, Safari 17, etc.]

**Device:** [Desktop/Mobile/Tablet]

**Screenshots:** [If applicable]
```

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Carousel not auto-playing | Timer not starting | Check autoplay prop and timer init |
| Popup not dismissing | onClose not called | Verify callback wiring |
| Exit intent too sensitive | Threshold too high | Lower Y threshold to 5-10px |
| Images not loading | Incorrect URL | Verify image paths and CORS |
| localStorage error | Private browsing | Implement fallback to sessionStorage |

### Documentation Deliverables

| Document | Content | Audience |
|----------|---------|----------|
| Test Plan | All test scenarios | QA Team |
| Test Results | Pass/fail outcomes | Development Team |
| Bug Reports | Issue details | Developers |
| Usage Guide | How to use features | Marketers/Content Creators |
| Technical Docs | API, props, configuration | Developers |

### Expected Outcome
- All banner and popup features verified and working
- Comprehensive test coverage across devices and browsers
- Accessibility compliance confirmed
- Performance targets met
- Documentation complete

### Verification Checklist
- [ ] Test plan document created
- [ ] Banner types and API tested
- [ ] useBanners hook tested
- [ ] PromoBanner component tested
- [ ] BannerCarousel component tested
- [ ] AnnouncementBar component tested
- [ ] Popup types tested
- [ ] PromoPopup component tested
- [ ] All trigger types tested (ENTRY, SCROLL, TIMER, EXIT)
- [ ] All frequency types tested (ONCE, SESSION, DAILY, ALWAYS)
- [ ] Exit intent detection tested on desktop
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Accessibility tested (screen readers, keyboard)
- [ ] Performance metrics measured
- [ ] Cross-browser compatibility confirmed
- [ ] User journeys tested
- [ ] Edge cases handled
- [ ] Bugs documented and fixed
- [ ] Usage documentation created
- [ ] Technical documentation updated

---

## Summary

This document completed the promotional popup system and comprehensive verification of all marketing features. We created popup type definitions, reusable popup components with modal overlays, sophisticated trigger systems (entry, timer, scroll, exit intent), frequency control to prevent popup fatigue, exit-intent detection for user retention, and thorough testing procedures. All banner and popup features are now verified and ready for production use.

### Completed Tasks
1. ✓ Created popup types with comprehensive interfaces
2. ✓ Created PromoPopup component with modal functionality
3. ✓ Implemented popup timing triggers (entry, timer, scroll)
4. ✓ Created frequency control system with persistent storage
5. ✓ Implemented exit-intent detection for desktop users
6. ✓ Verified all banners and popups across devices and browsers

### Group Completion
All 14 tasks in Group-E_Promotional-Banners-Popups have been documented and verified. The marketing features enable dynamic banner displays, announcement bars, and strategically timed popups to enhance user engagement, reduce bounce rates, and drive conversions while maintaining excellent user experience.

### Next Steps
Proceed to Group-F_Newsletter-Social-Sharing to implement newsletter subscription functionality and social media sharing features for the webstore.
