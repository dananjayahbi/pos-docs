# Tasks 01-07: Layout Shell and Announcement Bar

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** A - Layout Shell & Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Content-Scroll-Verify.md](02_Tasks-08-14_Content-Scroll-Verify.md)

---

## Document Overview

This document covers the creation of the store layout shell with announcement bar functionality. It establishes the foundational structure for the storefront, including the main layout component, TypeScript type definitions, layout container, announcement bar with dismissible state and configuration, and header placeholder slot.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Store Layout Shell | Medium | 30 min |
| 02 | Create Layout Types | Low | 15 min |
| 03 | Create Layout Container | Low | 20 min |
| 04 | Create Announcement Bar Component | Medium | 30 min |
| 05 | Create Announcement Bar State | Low | 20 min |
| 06 | Create Announcement Bar Config | Low | 15 min |
| 07 | Create Header Placeholder | Low | 20 min |

---

## Task 01: Create Store Layout Shell

### Overview
Create the main store layout shell component that serves as the structural foundation for the entire webstore. This layout orchestrates all major sections including announcement bar, header, main content, and footer. It provides the consistent structural framework that all storefront pages will inherit.

### Dependencies
- SubPhase-01 (Store Routes & App Structure) must be complete
- Next.js App Router structure is established
- Frontend project is initialized with Tailwind CSS

### Instructions

1. **Create storefront components directory structure**
   - Navigate to `frontend/components/` directory
   - Create new directory named `storefront`
   - Create subdirectory `storefront/layout` for layout components

2. **Create StoreLayout component file**
   - Create `StoreLayout.tsx` in `components/storefront/layout/` directory
   - Set up TypeScript React functional component structure
   - Prepare for import of sub-components

3. **Define component props interface**
   - Accept `children` prop of type `ReactNode`
   - Include optional `className` prop for additional styling
   - Include optional `showAnnouncementBar` boolean prop (default: true)

4. **Establish main layout structure**
   - Create five main sections in order: skip link, announcement bar, header, main content, footer
   - Use semantic HTML5 elements (header, main, footer)
   - Ensure proper nesting and accessibility

5. **Implement skip to content link**
   - Add accessibility skip link as first element
   - Position absolutely off-screen by default
   - Show on keyboard focus for accessibility

6. **Add announcement bar section**
   - Include conditional rendering based on `showAnnouncementBar` prop
   - Prepare slot for AnnouncementBar component (Task 04)
   - Position at top of layout before header

7. **Add header section**
   - Create header placeholder slot
   - Use semantic `<header>` element
   - Prepare for sticky positioning (Task 12)

8. **Add main content section**
   - Use semantic `<main>` element
   - Add id="main-content" for skip link target
   - Apply min-height for full viewport coverage

9. **Add footer section**
   - Create footer placeholder slot
   - Use semantic `<footer>` element
   - Position at bottom of content flow

10. **Apply base layout styling**
    - Set up flex column layout for full height
    - Apply Tailwind classes for consistent spacing
    - Prepare for background and theme styling

### Layout Structure Diagram

```
┌─────────────────────────────────────────┐
│  Skip to Content (hidden, focus only)  │
├─────────────────────────────────────────┤
│     Announcement Bar (dismissible)      │
├─────────────────────────────────────────┤
│       Header (sticky, placeholder)       │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│          Main Content Area              │
│              {children}                 │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│         Footer (placeholder)            │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Page content to render |
| className | string | No | "" | Additional CSS classes |
| showAnnouncementBar | boolean | No | true | Show/hide announcement bar |

### Layout Sections Specification

| Section | Element | Purpose | Features |
|---------|---------|---------|----------|
| Skip Link | `<a>` | Accessibility | Hidden, focus-visible |
| Announcement | `<div>` | Promotional banner | Dismissible, configurable |
| Header | `<header>` | Navigation, branding | Sticky, responsive |
| Main | `<main>` | Page content | Full height, scrollable |
| Footer | `<footer>` | Links, info | Static at bottom |

### Accessibility Requirements

| Feature | Implementation |
|---------|----------------|
| Skip Link | First focusable element, jumps to #main-content |
| Semantic HTML | header, main, footer elements |
| Landmarks | ARIA landmarks for screen readers |
| Focus Management | Proper tab order throughout layout |
| Keyboard Nav | All interactive elements keyboard accessible |

### Layout Styling Approach

| Property | Value | Purpose |
|----------|-------|---------|
| Display | flex, flex-col | Vertical stacking |
| Min Height | min-h-screen | Full viewport coverage |
| Background | bg-gray-50 | Subtle background |
| Font | font-sans | Consistent typography |

### Expected Outcome
- Functional store layout shell component
- Proper semantic HTML structure
- Five-section layout (skip, announcement, header, main, footer)
- Ready to receive child page content
- Accessible with skip link

### Verification Checklist
- [ ] `frontend/components/storefront/layout/StoreLayout.tsx` file created
- [ ] Component exports properly as default
- [ ] Accepts children, className, showAnnouncementBar props
- [ ] Five sections defined (skip link, announcement, header, main, footer)
- [ ] Semantic HTML elements used (header, main, footer)
- [ ] Skip to content link included
- [ ] Main content has id="main-content"
- [ ] TypeScript types defined correctly

---

## Task 02: Create Layout Types

### Overview
Define comprehensive TypeScript type definitions for the store layout system. These types ensure type safety across layout components, establish consistent interfaces for layout props, and provide clear contracts for announcement bar configuration and layout state.

### Dependencies
- Task 01: Create Store Layout Shell

### Instructions

1. **Create types directory structure**
   - Navigate to `frontend/types/` directory
   - Create subdirectory named `store` if it doesn't exist
   - Prepare for layout-specific type definitions

2. **Create layout types file**
   - Create `layout.ts` in `types/store/` directory
   - Set up TypeScript type definition structure
   - Prepare for export of multiple type definitions

3. **Define StoreLayoutProps interface**
   - Include `children` prop of type `ReactNode`
   - Include optional `className` string prop
   - Include optional `showAnnouncementBar` boolean prop
   - Include optional metadata props if needed

4. **Define AnnouncementBarConfig interface**
   - Include `enabled` boolean field (is announcement active)
   - Include `message` string field (announcement text)
   - Include optional `link` string field (CTA destination)
   - Include optional `linkText` string field (CTA label)
   - Include `backgroundColor` string field (Tailwind class)
   - Include `textColor` string field (Tailwind class)
   - Include optional `icon` ReactNode field

5. **Define AnnouncementBarState interface**
   - Include `isDismissed` boolean field
   - Include `dismissedAt` optional Date field
   - Include methods: `dismiss()`, `reset()`, `shouldShow()`

6. **Define LayoutScrollState interface**
   - Include `scrollY` number field (current scroll position)
   - Include `scrollDirection` union type ('up' | 'down' | 'none')
   - Include `isScrolled` boolean field (past threshold)
   - Include `threshold` number field (scroll threshold value)

7. **Define HeaderBehavior type**
   - Create union type: 'always-visible' | 'hide-on-scroll-down' | 'sticky'
   - Document each behavior option
   - Use for header display logic

8. **Define LayoutAnimation interface**
   - Include `enabled` boolean field
   - Include `enterAnimation` string field
   - Include `exitAnimation` string field
   - Include `duration` number field (milliseconds)

9. **Create utility types**
   - Define `LayoutSection` union: 'header' | 'main' | 'footer' | 'announcement'
   - Define `LayoutTheme` interface for theme customization
   - Export all types properly

### Type Definitions Structure

```
layout.ts
├── StoreLayoutProps
├── AnnouncementBarConfig
├── AnnouncementBarState
├── LayoutScrollState
├── HeaderBehavior
├── LayoutAnimation
├── LayoutSection (union type)
└── LayoutTheme
```

### StoreLayoutProps Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| children | ReactNode | Yes | Page content |
| className | string | No | Additional styles |
| showAnnouncementBar | boolean | No | Toggle announcement |
| metadata | object | No | SEO metadata |

### AnnouncementBarConfig Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| enabled | boolean | Yes | Active status |
| message | string | Yes | Announcement text |
| link | string | No | CTA URL |
| linkText | string | No | CTA label |
| backgroundColor | string | Yes | Tailwind bg class |
| textColor | string | Yes | Tailwind text class |
| icon | ReactNode | No | Optional icon |

### LayoutScrollState Interface

| Property | Type | Description |
|----------|------|-------------|
| scrollY | number | Current vertical scroll position |
| scrollDirection | 'up' \| 'down' \| 'none' | Scroll direction |
| isScrolled | boolean | Past threshold (default 50px) |
| threshold | number | Scroll threshold value |

### HeaderBehavior Options

| Value | Description | Use Case |
|-------|-------------|----------|
| always-visible | Header always shown | Default behavior |
| hide-on-scroll-down | Hide when scrolling down | Save screen space |
| sticky | Fixed at top | Persistent navigation |

### Export Strategy

```
Export all interfaces and types
├── Named exports for each interface
├── Type-only exports where appropriate
└── JSDoc comments for documentation
```

### Expected Outcome
- Comprehensive TypeScript type definitions for layout system
- Type safety across all layout components
- Clear interfaces for configuration objects
- Reusable types for state management
- Proper exports for consumption

### Verification Checklist
- [ ] `frontend/types/store/layout.ts` file created
- [ ] StoreLayoutProps interface defined
- [ ] AnnouncementBarConfig interface defined
- [ ] AnnouncementBarState interface defined
- [ ] LayoutScrollState interface defined
- [ ] HeaderBehavior type defined
- [ ] LayoutAnimation interface defined
- [ ] Utility types created (LayoutSection, LayoutTheme)
- [ ] All types exported properly
- [ ] JSDoc comments added for clarity

---

## Task 03: Create Layout Container

### Overview
Create a LayoutContainer component that provides consistent width constraints, padding, and responsive behavior for content within the store layout. This component wraps content sections to ensure proper spacing and maximum width across different screen sizes.

### Dependencies
- Task 01: Create Store Layout Shell
- Task 02: Create Layout Types

### Instructions

1. **Create LayoutContainer component file**
   - Create `LayoutContainer.tsx` in `components/storefront/layout/` directory
   - Set up TypeScript React functional component
   - Import ReactNode type

2. **Define component props interface**
   - Accept `children` prop of type `ReactNode`
   - Include optional `className` string prop for custom styles
   - Include optional `maxWidth` prop ('sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full')
   - Include optional `padding` boolean prop (default: true)

3. **Implement container component**
   - Create container div wrapper
   - Apply Tailwind container class or custom max-width
   - Center content with mx-auto (margin-x-auto)

4. **Apply responsive padding**
   - Add horizontal padding based on screen size
   - Mobile: px-4 (1rem padding)
   - Tablet: px-6 (1.5rem padding)
   - Desktop: px-8 (2rem padding)
   - Allow disabling via `padding` prop

5. **Configure max-width options**
   - Small: max-w-screen-sm (640px)
   - Medium: max-w-screen-md (768px)
   - Large: max-w-screen-lg (1024px)
   - XL: max-w-screen-xl (1280px)
   - 2XL: max-w-screen-2xl (1536px)
   - Full: w-full (no constraint)

6. **Implement className merging**
   - Use cn() utility or classnames library
   - Merge default classes with custom className prop
   - Ensure proper class precedence

7. **Add width transition**
   - Apply smooth width transition for responsive changes
   - Use transition-all duration-200 or similar
   - Ensure smooth user experience

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Content to wrap |
| className | string | No | "" | Additional classes |
| maxWidth | Width option | No | "2xl" | Maximum width |
| padding | boolean | No | true | Apply responsive padding |

### Max Width Options

| Value | Tailwind Class | Max Width | Use Case |
|-------|----------------|-----------|----------|
| sm | max-w-screen-sm | 640px | Narrow content |
| md | max-w-screen-md | 768px | Articles |
| lg | max-w-screen-lg | 1024px | Standard layout |
| xl | max-w-screen-xl | 1280px | Wide layout |
| 2xl | max-w-screen-2xl | 1536px | Extra wide (default) |
| full | w-full | 100% | Full width |

### Responsive Padding Breakdown

```
Mobile (< 640px)
├── Padding: px-4 (16px)
└── Comfortable on small screens

Tablet (640px - 1024px)
├── Padding: px-6 (24px)
└── Balanced spacing

Desktop (> 1024px)
├── Padding: px-8 (32px)
└── Generous spacing
```

### Container Styling Structure

| Property | Tailwind Classes | Purpose |
|----------|------------------|---------|
| Max Width | max-w-screen-2xl | Content constraint |
| Centering | mx-auto | Horizontal centering |
| Padding | px-4 md:px-6 lg:px-8 | Responsive spacing |
| Transition | transition-all | Smooth resizing |

### Usage Examples

```
Default Container (2xl width with padding):
<LayoutContainer>
  <ProductGrid />
</LayoutContainer>

Full Width without Padding:
<LayoutContainer maxWidth="full" padding={false}>
  <HeroBanner />
</LayoutContainer>

Custom Width:
<LayoutContainer maxWidth="lg" className="py-8">
  <BlogPost />
</LayoutContainer>
```

### Container Behavior Diagram

```
┌─────────────────────────────────────────────┐
│               Browser Viewport               │
│   ┌─────────────────────────────────────┐  │
│   │  Padding    Content Area    Padding  │  │
│   │  ←─────   (max-w-2xl)    ─────→    │  │
│   │                                      │  │
│   │         {children}                   │  │
│   │                                      │  │
│   └─────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Reusable container component for consistent width
- Responsive padding across screen sizes
- Configurable max-width options
- Centered content with proper spacing
- Smooth transitions on resize

### Verification Checklist
- [ ] `frontend/components/storefront/layout/LayoutContainer.tsx` created
- [ ] Component accepts children, className, maxWidth, padding props
- [ ] Default max-width set to 2xl
- [ ] Responsive padding implemented (px-4, px-6, px-8)
- [ ] Content centered with mx-auto
- [ ] All max-width options supported
- [ ] Padding can be disabled via prop
- [ ] className merging works correctly
- [ ] Component exports properly

---

## Task 04: Create Announcement Bar Component

### Overview
Create an AnnouncementBar component that displays promotional messages, special offers, or important notices at the top of the storefront. The component features dismissible functionality with state persistence, configurable styling, optional call-to-action links, and full responsiveness.

### Dependencies
- Task 01: Create Store Layout Shell
- Task 02: Create Layout Types

### Instructions

1. **Create announcement bar directory**
   - Navigate to `components/storefront/layout/` directory
   - Create subdirectory named `AnnouncementBar`
   - Prepare for component and related files

2. **Create AnnouncementBar component file**
   - Create `AnnouncementBar.tsx` in `AnnouncementBar/` directory
   - Set up TypeScript React functional component
   - Import necessary dependencies (Link, icons)

3. **Define component props interface**
   - Accept `config` prop of type `AnnouncementBarConfig` (from Task 02)
   - Include optional `onDismiss` callback function
   - Include optional `className` string prop

4. **Import state management**
   - Prepare for state hook from Task 05
   - Set up local state for visibility
   - Handle dismiss functionality

5. **Implement conditional rendering**
   - Check if announcement is enabled via config
   - Check if announcement was previously dismissed
   - Return null if should not show

6. **Create announcement bar structure**
   - Use LayoutContainer for width constraint (Task 03)
   - Create flex container for content alignment
   - Structure: icon (optional) | message | link (optional) | dismiss button

7. **Add message display**
   - Render config.message text
   - Apply text styling from config.textColor
   - Ensure text is readable and centered

8. **Add optional CTA link**
   - Conditionally render if config.link exists
   - Use Next.js Link component
   - Display config.linkText with underline on hover
   - Position to the right of message

9. **Add dismiss button**
   - Create X button on far right
   - Use icon library (Lucide React or similar)
   - Add click handler to dismiss announcement
   - Apply hover effect for interactivity

10. **Implement dismiss functionality**
    - Call onDismiss callback when clicked
    - Update local state to hide component
    - Prepare for state persistence (Task 05)

11. **Apply background and styling**
    - Use config.backgroundColor for background
    - Apply config.textColor for text
    - Add padding: py-2 or py-3
    - Ensure proper contrast ratios

12. **Add responsive behavior**
    - Stack vertically on mobile if needed
    - Adjust spacing between elements
    - Ensure dismiss button always visible
    - Truncate long messages appropriately

13. **Add animation**
    - Slide down animation on mount
    - Slide up animation on dismiss
    - Use Framer Motion or CSS transitions
    - Duration: 200-300ms

### Component Structure Diagram

```
┌─────────────────────────────────────────────────────┐
│  [Icon] Message text here    [Learn more →]    [×] │
└─────────────────────────────────────────────────────┘
   ↑       ↑                         ↑              ↑
Optional  Main message          Optional CTA    Dismiss
  icon    (required)               link          button
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| config | AnnouncementBarConfig | Yes | Announcement configuration |
| onDismiss | () => void | No | Dismiss callback |
| className | string | No | Additional classes |

### Announcement Bar Layout

| Element | Position | Purpose | Styling |
|---------|----------|---------|---------|
| Icon | Left | Visual indicator | mr-2, optional |
| Message | Center-left | Main content | flex-1, truncate |
| Link | Center-right | CTA | underline on hover |
| Dismiss | Far right | Close button | ml-4, hover effect |

### Background Color Options

| Use Case | Background Class | Text Class | Example |
|----------|------------------|------------|---------|
| Primary | bg-primary | text-white | Brand color |
| Success | bg-green-600 | text-white | Free shipping |
| Warning | bg-yellow-500 | text-black | Limited time |
| Info | bg-blue-600 | text-white | New feature |
| Sale | bg-red-600 | text-white | Sale announcement |

### Responsive Behavior

```
Desktop (> 768px)
├── Layout: Horizontal flex
├── Message: Truncate with ellipsis
├── All elements on one line
└── Dismiss button always visible

Mobile (< 768px)
├── Layout: May wrap if needed
├── Message: Wrap to multiple lines
├── Reduce padding slightly
└── Maintain dismiss button visibility
```

### Dismiss Animation Flow

```
User clicks dismiss button
    ↓
onDismiss callback fired
    ↓
Slide up animation (200ms)
    ↓
Component unmounted
    ↓
State persisted (Task 05)
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Dismiss Button | aria-label="Dismiss announcement" |
| Link | Clear link text, not just "Learn more" |
| Color Contrast | Ensure WCAG AA compliance |
| Keyboard Access | Tab to dismiss button |
| Screen Reader | Announce as banner/alert |

### Expected Outcome
- Functional announcement bar component
- Configurable message, colors, and link
- Dismissible with button
- Smooth animations on show/hide
- Responsive layout
- Accessible to all users

### Verification Checklist
- [ ] `frontend/components/storefront/layout/AnnouncementBar/AnnouncementBar.tsx` created
- [ ] Component accepts config, onDismiss, className props
- [ ] Message display implemented
- [ ] Optional icon support added
- [ ] Optional CTA link implemented
- [ ] Dismiss button with X icon created
- [ ] onClick handler for dismiss button
- [ ] Background and text colors from config applied
- [ ] Responsive layout works on mobile and desktop
- [ ] Animation on show/hide implemented
- [ ] Accessibility attributes added
- [ ] Component returns null when dismissed or disabled

---

## Task 05: Create Announcement Bar State

### Overview
Create state management for the announcement bar using Zustand to track dismissal state, persist dismissal across sessions using localStorage, and provide methods to dismiss, reset, and check visibility. This ensures users' preferences are remembered.

### Dependencies
- Task 04: Create Announcement Bar Component

### Instructions

1. **Install Zustand if not present**
   - Check if Zustand is in package.json dependencies
   - If not, install: `npm install zustand` or `pnpm add zustand`
   - Verify installation

2. **Create store directory structure**
   - Navigate to `frontend/store/` directory (create if needed)
   - Create subdirectory named `ui` for UI-related stores
   - Prepare for announcement store

3. **Create announcement store file**
   - Create `announcementStore.ts` in `store/ui/` directory
   - Import create from zustand
   - Import persist middleware from zustand/middleware

4. **Define store state interface**
   - Create `AnnouncementState` interface
   - Include `isDismissed` boolean field
   - Include `dismissedAt` Date | null field
   - Include action methods: dismiss(), reset(), shouldShow()

5. **Implement Zustand store**
   - Use `create` function with `persist` middleware
   - Set store name: 'announcement-bar'
   - Configure localStorage persistence
   - Initialize state with default values

6. **Implement dismiss method**
   - Set `isDismissed` to true
   - Record current timestamp in `dismissedAt`
   - Persist to localStorage automatically

7. **Implement reset method**
   - Set `isDismissed` to false
   - Clear `dismissedAt` (set to null)
   - Allow user to see announcement again

8. **Implement shouldShow method**
   - Accept optional `expiryDays` parameter (default: 30)
   - Return false if currently dismissed
   - Check if dismissedAt is within expiry period
   - Return true if should show, false otherwise

9. **Add timestamp expiry logic**
   - Calculate days since dismissal
   - If expiry period passed, automatically reset state
   - This allows showing announcement again after time period

10. **Export store hook**
    - Export `useAnnouncementStore` hook
    - Provide TypeScript typing
    - Document usage with JSDoc comments

### State Structure

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| isDismissed | boolean | false | Current dismiss state |
| dismissedAt | Date \| null | null | Timestamp of dismissal |
| dismiss | () => void | - | Dismiss announcement |
| reset | () => void | - | Reset to show again |
| shouldShow | (days?) => boolean | - | Check if should display |

### Zustand Store Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Store Name | 'announcement-bar' | localStorage key |
| Middleware | persist | Save to localStorage |
| Storage | localStorage | Browser storage |
| Partialize | All state | Save complete state |

### State Flow Diagram

```
Initial State (not dismissed)
    ↓
User dismisses announcement
    ↓
dismiss() method called
    ↓
State updated: isDismissed = true, dismissedAt = now
    ↓
State persisted to localStorage
    ↓
On next visit: shouldShow() returns false
    ↓
After expiry period (30 days)
    ↓
shouldShow() returns true (auto-reset)
```

### shouldShow() Logic Flow

```
shouldShow(expiryDays = 30)
    ↓
Check isDismissed
    ├─ false → return true (show)
    └─ true → Check dismissedAt
         ├─ null → return false
         └─ Calculate days since dismissal
              ├─ > expiryDays → auto-reset, return true
              └─ ≤ expiryDays → return false
```

### Persistence Strategy

| Aspect | Implementation |
|--------|----------------|
| Storage | localStorage |
| Key | 'announcement-bar' |
| Format | JSON stringified state |
| Hydration | Auto on mount |
| SSR Safety | Check window exists |

### Store Usage Examples

```
Dismiss Announcement:
const { dismiss } = useAnnouncementStore();
dismiss();

Check Visibility:
const { shouldShow } = useAnnouncementStore();
const isVisible = shouldShow(30); // 30 days expiry

Reset to Show Again:
const { reset } = useAnnouncementStore();
reset();

Get Full State:
const { isDismissed, dismissedAt } = useAnnouncementStore();
```

### Expected Outcome
- Functional Zustand store for announcement state
- Persistent storage using localStorage
- Methods to dismiss, reset, and check visibility
- Auto-expiry after configurable time period
- Type-safe with TypeScript
- Reusable across application

### Verification Checklist
- [ ] Zustand installed in project
- [ ] `frontend/store/ui/announcementStore.ts` file created
- [ ] AnnouncementState interface defined
- [ ] Zustand store created with persist middleware
- [ ] dismiss() method implemented
- [ ] reset() method implemented
- [ ] shouldShow() method with expiry logic implemented
- [ ] Store persists to localStorage
- [ ] Store exports useAnnouncementStore hook
- [ ] TypeScript types correct
- [ ] JSDoc comments added for documentation

---

## Task 06: Create Announcement Bar Config

### Overview
Create a centralized configuration file for the announcement bar that defines default settings, color schemes, and announcement content. This configuration allows easy updates to announcement messages without modifying component code and supports multiple announcement types.

### Dependencies
- Task 04: Create Announcement Bar Component
- Task 02: Create Layout Types

### Instructions

1. **Create config directory structure**
   - Navigate to `frontend/config/` directory (create if needed)
   - Create subdirectory named `store` for store-related configs
   - Prepare for announcement configuration

2. **Create announcement config file**
   - Create `announcementBar.config.ts` in `config/store/` directory
   - Import `AnnouncementBarConfig` type from layout types
   - Set up TypeScript configuration structure

3. **Define default announcement config**
   - Create `defaultAnnouncementConfig` object
   - Set enabled status (true/false)
   - Define default message text
   - Set default background and text colors
   - Include optional link and linkText

4. **Create color preset configurations**
   - Define presets for common announcement types
   - Include: primary, success, warning, info, sale
   - Each preset has background and text color
   - Document use case for each preset

5. **Define announcement message templates**
   - Create templates for common announcements
   - Free shipping threshold
   - Sale announcements
   - New feature alerts
   - Seasonal promotions
   - Holiday notices

6. **Add multi-language support preparation**
   - Structure for English messages (default)
   - Prepare for Sinhala translations
   - Use object structure for easy translation

7. **Create announcement rotation config (optional)**
   - Define array of multiple announcements
   - Include priority/order field
   - Allow automatic rotation
   - Set rotation interval if needed

8. **Add environment-based config**
   - Different announcements for development/production
   - Use environment variables where appropriate
   - Document configuration options

9. **Export configuration objects**
   - Export default config
   - Export color presets
   - Export message templates
   - Export utility functions if needed

### Default Configuration Structure

| Property | Type | Example Value | Description |
|----------|------|---------------|-------------|
| enabled | boolean | true | Active status |
| message | string | "Free shipping on orders over ₨5,000!" | Announcement text |
| link | string | "/shipping-policy" | Optional CTA URL |
| linkText | string | "Learn more" | CTA button text |
| backgroundColor | string | "bg-primary" | Tailwind bg class |
| textColor | string | "text-white" | Tailwind text class |
| icon | ReactNode | `<TruckIcon />` | Optional icon |

### Color Presets

| Preset Name | Background | Text Color | Use Case |
|-------------|------------|------------|----------|
| primary | bg-primary | text-white | Brand announcements |
| success | bg-green-600 | text-white | Free shipping, success |
| warning | bg-yellow-500 | text-black | Limited time offers |
| info | bg-blue-600 | text-white | General information |
| sale | bg-red-600 | text-white | Sales, discounts |
| dark | bg-gray-900 | text-white | Premium look |

### Message Templates

| Template | Message | Link | Use Case |
|----------|---------|------|----------|
| freeShipping | "Free shipping on orders over ₨{amount}!" | /shipping | Shipping promo |
| saleActive | "SALE: Up to {percent}% off storewide!" | /sale | Store sale |
| newArrival | "New arrivals just landed! Shop now →" | /new | New products |
| limitedTime | "Limited time: Get {discount} off with code {code}" | /offers | Flash sale |
| holiday | "Special {holiday} offers - Shop now!" | /seasonal | Seasonal |

### Configuration File Structure

```
announcementBar.config.ts
├── defaultAnnouncementConfig (single config)
├── colorPresets (object with presets)
├── messageTemplates (object with templates)
├── announcementRotation (array of configs)
└── Helper functions:
    ├── getActiveAnnouncement()
    ├── formatMessage(template, vars)
    └── getPresetColors(preset)
```

### Sri Lanka Specific Considerations

| Aspect | Implementation |
|--------|----------------|
| Currency | Use ₨ symbol (LKR) |
| Holidays | Sinhala/Tamil New Year, Vesak, etc. |
| Shipping | Local delivery messaging |
| Language | English + Sinhala messages |
| Phone | +94 format for support |

### Environment-Based Config Example

```
Development Environment:
├── Message: "🚧 Development mode - Test data shown"
├── Background: bg-yellow-500
└── Enabled: true

Production Environment:
├── Message: from config or CMS
├── Background: brand colors
└── Enabled: based on admin setting
```

### Utility Functions

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| getActiveAnnouncement | Get current announcement | - | AnnouncementBarConfig |
| formatMessage | Fill template variables | template, vars | string |
| getPresetColors | Get colors for preset | presetName | {bg, text} |
| shouldRotate | Check rotation logic | - | boolean |

### Expected Outcome
- Centralized announcement bar configuration
- Easily updatable announcement messages
- Color presets for different announcement types
- Message templates for common scenarios
- Preparation for multi-language support
- Environment-aware configuration

### Verification Checklist
- [ ] `frontend/config/store/announcementBar.config.ts` created
- [ ] defaultAnnouncementConfig object defined
- [ ] colorPresets object with 5+ presets created
- [ ] messageTemplates object with 5+ templates created
- [ ] All configurations use AnnouncementBarConfig type
- [ ] Sri Lanka specific values (₨ currency) included
- [ ] Comments and documentation added
- [ ] Configuration exports properly
- [ ] Utility functions implemented (if needed)
- [ ] TypeScript types correct throughout

---

## Task 07: Create Header Placeholder

### Overview
Create a header placeholder slot in the store layout that will be populated with actual header components in later groups. This placeholder ensures the layout structure is complete and provides a visual reference during development, showing where the header will be positioned.

### Dependencies
- Task 01: Create Store Layout Shell

### Instructions

1. **Locate StoreLayout component**
   - Open `StoreLayout.tsx` from Task 01
   - Find the header section (after announcement bar)
   - Prepare to add placeholder content

2. **Create header placeholder component**
   - Create `HeaderPlaceholder.tsx` in `components/storefront/layout/` directory
   - Set up simple functional component
   - This is temporary for development only

3. **Define placeholder structure**
   - Use semantic `<header>` element
   - Add role="banner" for accessibility
   - Include descriptive className for styling

4. **Add placeholder visual indicator**
   - Display text: "Header Component (Coming Soon)"
   - Add border and background for visibility
   - Use dashed border to indicate temporary nature
   - Center text content

5. **Apply placeholder styling**
   - Background: bg-gray-100 or bg-gray-200
   - Border: border-2 border-dashed border-gray-400
   - Padding: py-4 or py-6
   - Text: text-gray-600, centered
   - Height: min-h-[80px] for reasonable space

6. **Add development-only conditional rendering**
   - Consider showing only in development mode
   - Check process.env.NODE_ENV
   - In production, render empty header slot
   - Document this behavior

7. **Integrate placeholder into StoreLayout**
   - Import HeaderPlaceholder in StoreLayout
   - Place in header section
   - Ensure proper positioning after announcement bar
   - Prepare for replacement with actual header (Group B)

8. **Add comment documentation**
   - Add comment explaining placeholder purpose
   - Note which group will implement actual header
   - Include TODO or FIXME tag for easy searching

9. **Style for sticky behavior preview**
   - Add position: sticky preparation
   - Set top: 0 for sticking to top
   - Add z-index for layering
   - This previews future header behavior

### Placeholder Structure

```
┌─────────────────────────────────────────┐
│                                         │
│   Header Component (Coming Soon)       │
│   [Will be implemented in Group B]     │
│                                         │
└─────────────────────────────────────────┘
```

### Placeholder Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Element | `<header>` | Semantic HTML |
| Background | bg-gray-100 | Visible placeholder |
| Border | border-2 border-dashed | Temporary indicator |
| Border Color | border-gray-400 | Subtle appearance |
| Padding | py-4 px-4 | Spacing |
| Text Align | text-center | Centered text |
| Text Color | text-gray-600 | Muted appearance |
| Min Height | min-h-[80px] | Reserve space |

### Placeholder Props (Optional)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showInProduction | boolean | false | Show in production |
| message | string | "Header Component" | Custom message |
| height | string | "80px" | Placeholder height |

### Development vs Production Behavior

```
Development Mode:
├── Show placeholder with border
├── Display "Coming Soon" message
└── Include group reference

Production Mode:
├── Render empty header slot
├── No visual placeholder
└── Ready for real header component
```

### Integration Points

| Location | Purpose |
|----------|---------|
| StoreLayout | Main integration point |
| After | AnnouncementBar |
| Before | Main content area |
| Future | Replace with actual header (Group B) |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Semantic HTML | Use `<header>` element |
| ARIA Role | role="banner" |
| Landmark | Recognized by screen readers |
| Skip Link | Skip link points to #main-content |

### Expected Outcome
- Header placeholder slot in store layout
- Visual indicator during development
- Proper positioning and structure
- Ready to be replaced by actual header
- Accessible with semantic HTML
- Prepared for sticky behavior

### Verification Checklist
- [ ] `frontend/components/storefront/layout/HeaderPlaceholder.tsx` created
- [ ] Placeholder component uses semantic `<header>` element
- [ ] Visual styling applied (background, border, text)
- [ ] "Coming Soon" message displayed
- [ ] Integrated into StoreLayout component
- [ ] Positioned after announcement bar, before main content
- [ ] Comment added explaining placeholder purpose
- [ ] Conditional rendering for development mode (optional)
- [ ] Accessibility attributes included (role="banner")
- [ ] Component exports properly

---

## Summary

This document established the foundational store layout structure with announcement bar functionality. The layout shell provides a consistent framework for all storefront pages, includes comprehensive TypeScript types, features a configurable dismissible announcement bar with state persistence, and prepares the header slot for future implementation.

### Completed Tasks
1. ✓ Created store layout shell with five-section structure
2. ✓ Defined comprehensive layout TypeScript types
3. ✓ Created responsive layout container component
4. ✓ Implemented announcement bar with dismiss functionality
5. ✓ Created announcement bar state management with Zustand
6. ✓ Configured announcement bar with presets and templates
7. ✓ Added header placeholder slot for future implementation

### Next Steps
Proceed to [02_Tasks-08-14_Content-Scroll-Verify.md](02_Tasks-08-14_Content-Scroll-Verify.md) to create the main content wrapper, footer placeholder, skip to content link, scroll handler with sticky header logic, layout animations, and complete verification of the layout structure.
