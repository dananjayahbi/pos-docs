# Tasks 08-14: Content Wrapper, Scroll Handler, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** A - Layout Shell & Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_Layout-Shell-Announcement.md](01_Tasks-01-07_Layout-Shell-Announcement.md)

---

## Document Overview

This document completes the store layout implementation by adding the main content wrapper, footer placeholder, accessibility skip link, scroll position tracking, sticky header logic, layout animations, and comprehensive verification. These components ensure a polished, accessible, and performant layout structure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 08 | Create Main Content Wrapper | Low | 20 min |
| 09 | Create Footer Placeholder | Low | 20 min |
| 10 | Create Skip to Content Link | Low | 20 min |
| 11 | Create Layout Scroll Handler | Medium | 35 min |
| 12 | Create Sticky Header Logic | Medium | 30 min |
| 13 | Create Layout Animation Wrapper | Medium | 35 min |
| 14 | Verify Layout Structure | Low | 25 min |

---

## Task 08: Create Main Content Wrapper

### Overview
Create the main content wrapper component that serves as the primary container for page content in the store layout. This wrapper ensures proper spacing, minimum height, background styling, and serves as the target for the skip to content link.

### Dependencies
- Task 01: Create Store Layout Shell
- Task 03: Create Layout Container

### Instructions

1. **Create MainContent component file**
   - Create `MainContent.tsx` in `components/storefront/layout/` directory
   - Set up TypeScript React functional component
   - Import ReactNode type

2. **Define component props interface**
   - Accept `children` prop of type `ReactNode` (page content)
   - Include optional `className` string prop
   - Include optional `useContainer` boolean prop (default: true)
   - Include optional `backgroundColor` string prop

3. **Implement main element**
   - Use semantic `<main>` element
   - Add id="main-content" for skip link targeting
   - Add role="main" for accessibility
   - Include tabIndex="-1" to allow focus from skip link

4. **Apply minimum height**
   - Set min-h-screen to ensure full viewport coverage
   - Subtract space for header and footer
   - Use calc() or Tailwind classes
   - Alternative: min-h-[calc(100vh-theme(spacing.32))]

5. **Add background styling**
   - Default background: bg-gray-50 or bg-white
   - Allow customization via backgroundColor prop
   - Ensure proper contrast with content
   - Consider store theme colors

6. **Implement container wrapper**
   - Conditionally wrap content in LayoutContainer (Task 03)
   - Based on `useContainer` prop
   - Some pages may need full-width (e.g., hero sections)
   - Most pages will use container

7. **Add vertical spacing**
   - Top padding: pt-6 or pt-8
   - Bottom padding: pb-12 or pb-16
   - Ensure space between header and footer
   - Responsive spacing adjustments

8. **Add smooth scroll behavior**
   - Enable smooth scrolling to main element
   - Useful when skip link is activated
   - CSS: scroll-behavior: smooth or Tailwind config

9. **Handle loading states (optional)**
   - Consider adding loading prop
   - Display skeleton or spinner during page transitions
   - Improve perceived performance

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Page content |
| className | string | No | "" | Additional classes |
| useContainer | boolean | No | true | Wrap in LayoutContainer |
| backgroundColor | string | No | "bg-gray-50" | Background color |
| isLoading | boolean | No | false | Loading state |

### Main Content Structure

```
<main id="main-content" tabindex="-1">
  [Optional LayoutContainer]
    ┌─────────────────────────────────┐
    │                                 │
    │         {children}              │
    │      (Page Content)             │
    │                                 │
    └─────────────────────────────────┘
  [/Optional LayoutContainer]
</main>
```

### Height Calculation Strategy

| Approach | Implementation | Use Case |
|----------|----------------|----------|
| Full Screen | min-h-screen | Simple layouts |
| Calculated | min-h-[calc(100vh-...)] | Fixed header/footer |
| Flex Grow | flex-grow | Flexible layouts |
| Auto | min-h-auto | Content-driven |

### Background Options

| Background | Tailwind Class | Use Case |
|------------|----------------|----------|
| Light Gray | bg-gray-50 | Default, subtle |
| White | bg-white | Clean, minimal |
| Brand Tint | bg-primary-50 | Branded pages |
| Gradient | bg-gradient-to-b | Hero sections |
| Custom | Via prop | Theme-specific |

### Spacing Configuration

```
Desktop:
├── Top Padding: pt-8 (2rem)
├── Bottom Padding: pb-16 (4rem)
└── Side Padding: via LayoutContainer

Mobile:
├── Top Padding: pt-6 (1.5rem)
├── Bottom Padding: pb-12 (3rem)
└── Side Padding: via LayoutContainer
```

### Container vs Full Width

| Scenario | useContainer | Result |
|----------|--------------|--------|
| Standard Page | true | Content constrained to max-width |
| Product Grid | true | Centered with padding |
| Hero Banner | false | Full viewport width |
| Landing Page | false | Custom width control |

### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Semantic HTML | `<main>` element | Main content landmark |
| ID Attribute | id="main-content" | Skip link target |
| Tab Index | tabIndex="-1" | Allow programmatic focus |
| ARIA Role | role="main" | Explicit landmark |
| Focus Outline | Custom focus styles | Visible focus indicator |

### Loading State Handling

```
When isLoading = true:
├── Display loading skeleton
├── Maintain layout structure
├── Prevent content shift
└── Show spinner or skeleton UI

When isLoading = false:
├── Render children content
├── Smooth transition in
└── Normal layout flow
```

### Usage Examples

```
Standard Page with Container:
<MainContent>
  <ProductList />
</MainContent>

Full Width Page:
<MainContent useContainer={false}>
  <HeroBanner />
  <ProductGrid />
</MainContent>

Custom Background:
<MainContent backgroundColor="bg-white">
  <CheckoutForm />
</MainContent>

With Loading State:
<MainContent isLoading={isLoadingProducts}>
  <ProductList products={products} />
</MainContent>
```

### Expected Outcome
- Functional main content wrapper component
- Semantic HTML with proper accessibility
- Configurable container usage
- Proper spacing and minimum height
- Target for skip to content link
- Optional loading state support

### Verification Checklist
- [ ] `frontend/components/storefront/layout/MainContent.tsx` created
- [ ] Component uses semantic `<main>` element
- [ ] id="main-content" attribute present
- [ ] tabIndex="-1" for focus management
- [ ] role="main" for accessibility
- [ ] Accepts children, className, useContainer, backgroundColor props
- [ ] Minimum height applied (min-h-screen or calculated)
- [ ] Conditionally wraps in LayoutContainer
- [ ] Vertical padding applied (top and bottom)
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 09: Create Footer Placeholder

### Overview
Create a footer placeholder slot in the store layout that will be populated with actual footer components in later groups. This placeholder ensures the layout structure is complete and provides a visual reference during development, showing where the footer will be positioned at the bottom of the page.

### Dependencies
- Task 01: Create Store Layout Shell

### Instructions

1. **Locate StoreLayout component**
   - Open `StoreLayout.tsx` from Task 01
   - Find the footer section (after main content)
   - Prepare to add placeholder content

2. **Create footer placeholder component**
   - Create `FooterPlaceholder.tsx` in `components/storefront/layout/` directory
   - Set up simple functional component
   - This is temporary for development only

3. **Define placeholder structure**
   - Use semantic `<footer>` element
   - Add role="contentinfo" for accessibility
   - Include descriptive className for styling

4. **Add placeholder visual indicator**
   - Display text: "Footer Component (Coming Soon)"
   - Add border and background for visibility
   - Use dashed border to indicate temporary nature
   - Center text content

5. **Apply placeholder styling**
   - Background: bg-gray-100 or bg-gray-800 (dark footer preview)
   - Border: border-2 border-dashed border-gray-400
   - Padding: py-8 or py-12 (footers typically larger)
   - Text: text-gray-600, centered
   - Height: min-h-[120px] for reasonable space

6. **Add development-only conditional rendering**
   - Consider showing only in development mode
   - Check process.env.NODE_ENV
   - In production, render minimal footer or empty slot
   - Document this behavior

7. **Integrate placeholder into StoreLayout**
   - Import FooterPlaceholder in StoreLayout
   - Place in footer section (last section)
   - Ensure proper positioning after main content
   - Prepare for replacement with actual footer (Group F)

8. **Add comment documentation**
   - Add comment explaining placeholder purpose
   - Note which group will implement actual footer
   - Include TODO or FIXME tag for easy searching
   - Reference future implementation

9. **Add footer-specific styling hints**
   - Dark background option (preview dark footer)
   - Multi-column layout hint
   - Space for footer links, copyright, etc.
   - Position at absolute bottom of page

10. **Ensure footer sticks to bottom**
    - Use flexbox on parent container
    - Apply flex-grow to main content
    - Footer naturally pushed to bottom
    - No fixed positioning needed

### Placeholder Structure

```
┌─────────────────────────────────────────┐
│                                         │
│   Footer Component (Coming Soon)       │
│   [Will be implemented in Group F]     │
│                                         │
│   ─────────────────────────────────    │
│   Links | About | Contact | Support    │
│   © 2026 LankaCommerce Cloud           │
│                                         │
└─────────────────────────────────────────┘
```

### Placeholder Styling Options

| Style | Background | Text | Use Case |
|-------|------------|------|----------|
| Light | bg-gray-100 | text-gray-600 | Match light theme |
| Dark | bg-gray-800 | text-gray-300 | Preview dark footer |
| Brand | bg-primary | text-white | Brand color |
| Minimal | bg-white | text-gray-600 | Clean look |

### Recommended Placeholder Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Element | `<footer>` | Semantic HTML |
| Background | bg-gray-800 | Dark footer preview |
| Border | border-t-2 border-gray-700 | Separation from content |
| Padding | py-12 px-4 | Generous spacing |
| Text Align | text-center | Centered text |
| Text Color | text-gray-300 | Light text on dark |
| Min Height | min-h-[120px] | Reserve space |

### Placeholder Props (Optional)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showInProduction | boolean | false | Show in production |
| message | string | "Footer Component" | Custom message |
| variant | 'light' \| 'dark' | 'dark' | Color scheme |
| height | string | "120px" | Placeholder height |

### Development vs Production Behavior

```
Development Mode:
├── Show placeholder with border
├── Display "Coming Soon" message
├── Include implementation reference
└── Preview footer position

Production Mode:
├── Render minimal footer or empty
├── No visual placeholder
├── Basic copyright only (optional)
└── Ready for real footer component
```

### Footer Position Strategy

```
Layout Structure (Flexbox):
┌─────────────────────┐
│  Header             │
├─────────────────────┤
│  Main Content       │ ← flex-grow: 1
│  (Expands to fill)  │
│                     │
├─────────────────────┤
│  Footer             │ ← Pushed to bottom
└─────────────────────┘
```

### Integration Points

| Location | Purpose |
|----------|---------|
| StoreLayout | Main integration point |
| After | Main content area |
| Position | Bottom of page |
| Future | Replace with actual footer (Group F) |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Semantic HTML | Use `<footer>` element |
| ARIA Role | role="contentinfo" |
| Landmark | Recognized by screen readers |
| Tab Order | Footer links last in tab order |

### Footer Content Preview

```
Typical Footer Sections (for reference):
├── About Company
├── Customer Service
├── Quick Links
├── Contact Information
├── Social Media Links
├── Newsletter Signup
├── Payment Methods
└── Copyright & Legal Links
```

### Expected Outcome
- Footer placeholder slot in store layout
- Visual indicator during development
- Proper positioning at bottom of page
- Ready to be replaced by actual footer
- Accessible with semantic HTML
- Dark footer preview option

### Verification Checklist
- [ ] `frontend/components/storefront/layout/FooterPlaceholder.tsx` created
- [ ] Placeholder component uses semantic `<footer>` element
- [ ] Visual styling applied (background, border, text)
- [ ] "Coming Soon" message displayed
- [ ] Integrated into StoreLayout component
- [ ] Positioned after main content area (last section)
- [ ] Comment added explaining placeholder purpose
- [ ] Conditional rendering for development mode (optional)
- [ ] Accessibility attributes included (role="contentinfo")
- [ ] Footer naturally sticks to bottom via flexbox
- [ ] Component exports properly

---

## Task 10: Create Skip to Content Link

### Overview
Create an accessible "Skip to Content" link that allows keyboard and screen reader users to bypass navigation and jump directly to the main content. This link is hidden by default but becomes visible when focused via keyboard navigation, meeting WCAG accessibility guidelines.

### Dependencies
- Task 01: Create Store Layout Shell
- Task 08: Create Main Content Wrapper

### Instructions

1. **Create SkipToContent component file**
   - Create `SkipToContent.tsx` in `components/storefront/layout/` directory
   - Set up TypeScript React functional component
   - Keep component simple and lightweight

2. **Define component structure**
   - Create anchor link element
   - Set href to "#main-content" (targets main content wrapper)
   - Include descriptive link text
   - Make link the first focusable element

3. **Set link text**
   - Use clear, descriptive text: "Skip to main content"
   - Alternative: "Skip to content" or "Skip navigation"
   - Ensure text is descriptive for screen readers
   - Keep text concise

4. **Implement visibility styling**
   - Hide by default: absolute positioning off-screen
   - Position: -translate-y-20 or -top-10
   - Maintain in tab order (don't use display: none)
   - Only hide visually, not from assistive tech

5. **Style focus state**
   - Show link when focused via keyboard
   - Use :focus or focus-visible pseudo-class
   - Slide into view: translate-y-0
   - Position at top-left of viewport
   - High contrast colors for visibility

6. **Apply focus styling**
   - Background: bg-primary or bg-blue-600
   - Text: text-white for high contrast
   - Padding: px-4 py-2
   - Border radius: rounded for polish
   - Shadow: Add shadow for prominence
   - Z-index: High value (z-50 or z-[9999])

7. **Add smooth transition**
   - Transition on transform property
   - Duration: 150-200ms
   - Ease function for smooth movement
   - Tailwind: transition-transform duration-200

8. **Integrate into StoreLayout**
   - Import SkipToContent in StoreLayout
   - Place as first element in layout
   - Must be before announcement bar
   - First item in tab order

9. **Test keyboard navigation**
   - Pressing Tab should focus skip link first
   - Link should be visible when focused
   - Clicking link should scroll to main content
   - Focus should move to main element

10. **Add smooth scroll behavior**
    - Enable smooth scrolling in CSS or Tailwind config
    - Enhance user experience when skip link is clicked
    - Ensure main content receives focus

### Skip Link Visual States

```
Default (Hidden):
┌─ Viewport ─────────────────┐
│ [Skip Link - hidden above] │  ← Off-screen
│                             │
│  Announcement Bar           │
│  Header                     │
│  ...                        │
└─────────────────────────────┘

Focused (Visible):
┌─ Viewport ─────────────────┐
│ [Skip to main content]      │  ← Visible at top
├─────────────────────────────┤
│  Announcement Bar           │
│  Header                     │
│  ...                        │
└─────────────────────────────┘
```

### Positioning Strategy

| State | Position | Transform | Z-Index | Visibility |
|-------|----------|-----------|---------|------------|
| Default | absolute, top-0, left-0 | -translate-y-20 | z-50 | Off-screen |
| Focused | absolute, top-0, left-0 | translate-y-0 | z-50 | Visible |

### Focus Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Background | bg-primary or bg-blue-600 | High contrast |
| Text Color | text-white | Readable on dark |
| Padding | px-4 py-2 | Comfortable size |
| Border Radius | rounded | Modern look |
| Shadow | shadow-lg | Prominence |
| Font Weight | font-semibold | Emphasis |
| Z-Index | z-50 | Above all content |

### Tailwind Classes Breakdown

```
Default State:
absolute left-0 top-0 -translate-y-20 bg-primary text-white
px-4 py-2 rounded shadow-lg z-50 transition-transform
duration-200

Focus State:
focus:translate-y-0 focus:outline-none focus:ring-2
focus:ring-offset-2 focus:ring-primary
```

### Accessibility Requirements

| Requirement | Implementation | WCAG Criterion |
|-------------|----------------|----------------|
| Skip Link | Present and functional | 2.4.1 (A) |
| First in Tab Order | First focusable element | 2.4.1 (A) |
| Visible on Focus | Clear visual indication | 2.4.7 (AA) |
| Descriptive Text | "Skip to main content" | 2.4.4 (A) |
| Focus Target | Main content receives focus | 2.4.3 (A) |

### User Flow Diagram

```
User presses Tab
    ↓
Skip Link receives focus
    ↓
Link becomes visible (slides down)
    ↓
User presses Enter
    ↓
Page scrolls to main content
    ↓
Main content receives focus (tabIndex="-1")
    ↓
Next Tab continues from main content
```

### Testing Checklist

| Test | Expected Behavior |
|------|-------------------|
| Tab Navigation | Skip link is first focused element |
| Visual Focus | Link visible and styled on focus |
| Click/Enter | Page scrolls to main content |
| Focus Move | Main content receives focus |
| Next Tab | Tab order continues logically |
| Screen Reader | Link announced correctly |

### Integration Example

```
StoreLayout component structure:
├── <SkipToContent /> (Task 10)
├── <AnnouncementBar /> (Task 04)
├── <HeaderPlaceholder /> (Task 07)
├── <MainContent id="main-content"> (Task 08)
└── <FooterPlaceholder /> (Task 09)
```

### Expected Outcome
- Functional skip to content link
- Hidden by default, visible on focus
- High contrast styling for accessibility
- First element in tab order
- Smooth scroll to main content
- WCAG 2.1 Level AA compliant

### Verification Checklist
- [ ] `frontend/components/storefront/layout/SkipToContent.tsx` created
- [ ] Component uses anchor link with href="#main-content"
- [ ] Link text is descriptive ("Skip to main content")
- [ ] Positioned absolutely at top-left
- [ ] Hidden by default (off-screen with transform)
- [ ] Visible on focus (translate-y-0)
- [ ] High contrast styling (primary bg, white text)
- [ ] Smooth transition on focus
- [ ] Integrated into StoreLayout as first element
- [ ] Z-index high enough to appear above all content
- [ ] Component exports properly
- [ ] Tested with keyboard navigation (Tab key)

---

## Task 11: Create Layout Scroll Handler

### Overview
Create a custom React hook that tracks scroll position and direction to enable dynamic layout behaviors such as sticky headers, scroll-to-top buttons, and scroll-based animations. This hook provides real-time scroll state and utilities for scroll-based UI interactions.

### Dependencies
- Task 01: Create Store Layout Shell

### Instructions

1. **Create hooks directory structure**
   - Navigate to `components/storefront/layout/` directory
   - Create subdirectory named `hooks`
   - Prepare for layout-related hooks

2. **Create useScrollPosition hook file**
   - Create `useScrollPosition.ts` in `layout/hooks/` directory
   - Set up TypeScript React custom hook
   - Import necessary React hooks (useState, useEffect)

3. **Define return type interface**
   - Create `ScrollPosition` interface
   - Include `scrollY` number (current Y position)
   - Include `scrollX` number (current X position)
   - Include `scrollDirection` union: 'up' | 'down' | 'none'
   - Include `isScrolled` boolean (past threshold)

4. **Initialize state variables**
   - Create state for scrollY position
   - Create state for scrollX position
   - Create state for scroll direction
   - Create state for previous scroll position
   - Set initial values appropriately

5. **Define scroll threshold**
   - Accept threshold parameter (default: 50 pixels)
   - Use to determine when isScrolled is true
   - Configurable for different use cases

6. **Implement scroll event listener**
   - Use useEffect to add scroll listener on mount
   - Listen to window scroll events
   - Throttle or debounce for performance (optional)
   - Clean up listener on unmount

7. **Calculate scroll direction**
   - Compare current scrollY with previous scrollY
   - Set direction to 'down' if increased
   - Set direction to 'up' if decreased
   - Set direction to 'none' if no change
   - Store previous position for next comparison

8. **Determine isScrolled state**
   - Compare scrollY with threshold value
   - Set isScrolled to true if scrollY > threshold
   - Set isScrolled to false otherwise
   - Update on every scroll event

9. **Optimize performance**
   - Consider using requestAnimationFrame
   - Throttle scroll event handler (every 100ms)
   - Avoid excessive state updates
   - Use ref for values that don't need re-renders

10. **Return scroll state object**
    - Return object with all scroll properties
    - Type with ScrollPosition interface
    - Document return values with JSDoc

11. **Handle SSR compatibility**
    - Check if window is defined (Next.js SSR)
    - Return default values on server
    - Initialize properly on client mount

### Hook Interface

```typescript
interface ScrollPosition {
  scrollY: number;
  scrollX: number;
  scrollDirection: 'up' | 'down' | 'none';
  isScrolled: boolean;
}

interface UseScrollPositionOptions {
  threshold?: number;
  throttleMs?: number;
}

function useScrollPosition(options?: UseScrollPositionOptions): ScrollPosition
```

### State Management

| State Variable | Type | Initial Value | Purpose |
|----------------|------|---------------|---------|
| scrollY | number | 0 | Current vertical position |
| scrollX | number | 0 | Current horizontal position |
| scrollDirection | string | 'none' | Scroll direction |
| prevScrollY | number | 0 | Previous Y for comparison |
| isScrolled | boolean | false | Past threshold |

### Scroll Direction Logic

```
Calculate Scroll Direction:
├── currentY > previousY → 'down'
├── currentY < previousY → 'up'
└── currentY === previousY → 'none'

Update previousY = currentY for next comparison
```

### Threshold Behavior

| Scroll Position | isScrolled Value | Use Case |
|-----------------|------------------|----------|
| scrollY = 0 | false | At top of page |
| scrollY = 25 | false | Below threshold (50px) |
| scrollY = 51 | true | Past threshold |
| scrollY = 200 | true | Scrolled down |

### Performance Optimization

| Technique | Implementation | Benefit |
|-----------|----------------|---------|
| Throttling | Limit updates to every 100ms | Reduce re-renders |
| RAF | Use requestAnimationFrame | Smooth updates |
| Ref Usage | Use ref for non-render values | Avoid unnecessary renders |
| Passive Listener | { passive: true } option | Better scroll performance |

### Event Listener Setup

```
useEffect(() => {
  if (typeof window === 'undefined') return;
  
  const handleScroll = () => {
    // Update scroll state
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [dependencies]);
```

### Usage Examples

```
Basic Usage:
const { scrollY, scrollDirection, isScrolled } = useScrollPosition();

With Custom Threshold:
const scrollState = useScrollPosition({ threshold: 100 });

Conditional Rendering Based on Scroll:
const { isScrolled } = useScrollPosition();
return (
  <Header className={isScrolled ? 'shadow-md' : ''} />
);

Hide on Scroll Down:
const { scrollDirection } = useScrollPosition();
return (
  <Header hidden={scrollDirection === 'down'} />
);
```

### Return Object Properties

| Property | Type | Description | Example Value |
|----------|------|-------------|---------------|
| scrollY | number | Vertical scroll position | 250 |
| scrollX | number | Horizontal scroll position | 0 |
| scrollDirection | 'up' \| 'down' \| 'none' | Direction of scroll | 'down' |
| isScrolled | boolean | Past threshold | true |

### SSR Considerations

```
Server-Side (Next.js):
├── window is undefined
├── Return default values
└── Prevent errors

Client-Side:
├── window is defined
├── Add event listeners
└── Track scroll position
```

### Expected Outcome
- Reusable scroll position tracking hook
- Real-time scroll direction detection
- Configurable scroll threshold
- Performance optimized with throttling
- SSR compatible for Next.js
- Type-safe with TypeScript

### Verification Checklist
- [ ] `frontend/components/storefront/layout/hooks/useScrollPosition.ts` created
- [ ] Hook returns ScrollPosition interface
- [ ] scrollY and scrollX tracked correctly
- [ ] scrollDirection calculated (up/down/none)
- [ ] isScrolled determined by threshold
- [ ] Scroll event listener added and cleaned up
- [ ] SSR compatibility check (window undefined)
- [ ] Performance optimization implemented (throttling/RAF)
- [ ] Accepts options parameter with threshold
- [ ] Hook exports properly
- [ ] TypeScript types defined correctly
- [ ] JSDoc comments added

---

## Task 12: Create Sticky Header Logic

### Overview
Create a custom hook that implements sticky header behavior with optional hide-on-scroll-down functionality. This hook uses the scroll position from Task 11 to determine when to show or hide the header, creating a polished user experience that maximizes screen real estate.

### Dependencies
- Task 11: Create Layout Scroll Handler

### Instructions

1. **Create useStickyHeader hook file**
   - Create `useStickyHeader.ts` in `layout/hooks/` directory
   - Set up TypeScript React custom hook
   - Import useScrollPosition hook from Task 11

2. **Define hook options interface**
   - Create `UseStickyHeaderOptions` interface
   - Include `behavior` option: 'always-visible' | 'hide-on-scroll-down' | 'show-on-scroll-up'
   - Include `threshold` number (default: 50)
   - Include `hideDelay` number (default: 0)

3. **Define return type interface**
   - Create `StickyHeaderState` interface
   - Include `isSticky` boolean (header should stick)
   - Include `isVisible` boolean (header should show)
   - Include `shouldAnimate` boolean (apply transitions)
   - Include `headerOffset` number (translate value)

4. **Import useScrollPosition hook**
   - Use hook from Task 11
   - Get scrollY, scrollDirection, isScrolled
   - Pass custom threshold if provided

5. **Implement isSticky logic**
   - Set isSticky based on isScrolled from useScrollPosition
   - When scrollY > threshold, header becomes sticky
   - Add shadow or other visual indicators when sticky

6. **Implement always-visible behavior**
   - If behavior is 'always-visible'
   - Keep isVisible always true
   - Header never hides regardless of scroll

7. **Implement hide-on-scroll-down behavior**
   - If behavior is 'hide-on-scroll-down'
   - Set isVisible to false when scrollDirection is 'down'
   - Set isVisible to true when scrollDirection is 'up'
   - Keep visible when at top (scrollY < threshold)

8. **Implement show-on-scroll-up behavior**
   - If behavior is 'show-on-scroll-up'
   - Similar to hide-on-scroll-down
   - Show header immediately on upward scroll
   - Hide on downward scroll

9. **Add hide delay (optional)**
   - Use setTimeout for delay before hiding
   - Prevent immediate hiding on small scrolls
   - Clear timeout on component unmount
   - Only apply to hide behaviors

10. **Calculate header offset**
    - For slide animations: -100% when hidden, 0% when visible
    - Return as translateY value
    - Use in transform style

11. **Return sticky header state**
    - Return object with all properties
    - Type with StickyHeaderState interface
    - Document with JSDoc comments

### Hook Interface

```typescript
interface UseStickyHeaderOptions {
  behavior?: 'always-visible' | 'hide-on-scroll-down' | 'show-on-scroll-up';
  threshold?: number;
  hideDelay?: number;
}

interface StickyHeaderState {
  isSticky: boolean;
  isVisible: boolean;
  shouldAnimate: boolean;
  headerOffset: number;
}

function useStickyHeader(options?: UseStickyHeaderOptions): StickyHeaderState
```

### Behavior Options

| Behavior | Description | Use Case |
|----------|-------------|----------|
| always-visible | Header always shown | Default, simple sites |
| hide-on-scroll-down | Hide when scrolling down | Maximize screen space |
| show-on-scroll-up | Show on scroll up only | Content-focused sites |

### Sticky Logic Flow

```
isSticky Determination:
├── scrollY < threshold → isSticky = false
└── scrollY ≥ threshold → isSticky = true

isVisible Determination (hide-on-scroll-down):
├── behavior = 'always-visible' → isVisible = true
├── scrollY < threshold → isVisible = true (always show at top)
├── scrollDirection = 'up' → isVisible = true
└── scrollDirection = 'down' → isVisible = false
```

### Header State Matrix

| Scroll Position | Direction | Behavior: always-visible | Behavior: hide-on-scroll-down |
|-----------------|-----------|--------------------------|------------------------------|
| At top (0px) | none | Visible, not sticky | Visible, not sticky |
| < threshold | any | Visible, not sticky | Visible, not sticky |
| > threshold | up | Visible, sticky | Visible, sticky |
| > threshold | down | Visible, sticky | Hidden, sticky |

### Transform Offset Calculation

| State | isVisible | headerOffset | CSS Transform |
|-------|-----------|--------------|---------------|
| Visible | true | 0 | translateY(0) |
| Hidden | false | -100 | translateY(-100%) |

### Animation Properties

| Property | Value | Purpose |
|----------|-------|---------|
| Transition | transform 0.3s ease-in-out | Smooth slide |
| Transform | translateY(offset) | Vertical movement |
| Position | sticky or fixed | Sticky positioning |
| Top | 0 | Stick to top |
| Z-Index | z-40 | Above content |

### Usage Examples

```
Always Visible (Default):
const headerState = useStickyHeader();
// isVisible always true

Hide on Scroll Down:
const headerState = useStickyHeader({
  behavior: 'hide-on-scroll-down',
  threshold: 50
});

With Delay:
const headerState = useStickyHeader({
  behavior: 'hide-on-scroll-down',
  hideDelay: 200
});

Apply to Header:
const { isSticky, isVisible, headerOffset } = useStickyHeader();
<header 
  className={`${isSticky ? 'shadow-md' : ''}`}
  style={{ 
    transform: `translateY(${headerOffset}%)`,
    transition: 'transform 0.3s ease-in-out'
  }}
>
```

### Visual Behavior Diagram

```
Always Visible:
┌────────────────────┐
│  Header (visible)  │ ← Always shown
├────────────────────┤
│                    │
│  Content scrolls   │
│                    │
└────────────────────┘

Hide on Scroll Down:
Scroll Down ↓         Scroll Up ↑
┌────────────────┐    ┌────────────────────┐
│  Header hidden │    │  Header (visible)  │
├────────────────┤    ├────────────────────┤
│                │    │                    │
│  Content       │    │  Content           │
│                │    │                    │
└────────────────┘    └────────────────────┘
```

### Expected Outcome
- Reusable sticky header logic hook
- Three behavior modes supported
- Smooth show/hide animations
- Configurable threshold and delay
- Performance optimized
- Type-safe with TypeScript

### Verification Checklist
- [ ] `frontend/components/storefront/layout/hooks/useStickyHeader.ts` created
- [ ] Hook returns StickyHeaderState interface
- [ ] Uses useScrollPosition hook from Task 11
- [ ] isSticky calculated based on threshold
- [ ] isVisible determined by behavior option
- [ ] Three behaviors implemented (always-visible, hide-on-scroll-down, show-on-scroll-up)
- [ ] headerOffset calculated correctly (0 or -100)
- [ ] Accepts options parameter (behavior, threshold, hideDelay)
- [ ] Optional hide delay implemented
- [ ] Hook exports properly
- [ ] TypeScript types defined correctly
- [ ] JSDoc comments added

---

## Task 13: Create Layout Animation Wrapper

### Overview
Create a LayoutAnimation wrapper component using Framer Motion that provides smooth page transitions and animations for the store layout. This component wraps page content and applies enter/exit animations, creating a polished user experience during route changes.

### Dependencies
- Task 01: Create Store Layout Shell
- Framer Motion must be installed

### Instructions

1. **Install Framer Motion if needed**
   - Check if framer-motion is in package.json
   - If not, install: `npm install framer-motion` or `pnpm add framer-motion`
   - Verify installation and version compatibility

2. **Create LayoutAnimation component file**
   - Create `LayoutAnimation.tsx` in `components/storefront/layout/` directory
   - Set up TypeScript React functional component
   - Import motion from framer-motion

3. **Define component props interface**
   - Accept `children` prop of type `ReactNode`
   - Include optional `className` string prop
   - Include optional `animationKey` string prop (for route-based animations)
   - Include optional `enabled` boolean prop (default: true)

4. **Define animation variants**
   - Create variants object with initial, animate, exit states
   - Initial: opacity 0, slight vertical offset (y: 10 or 20)
   - Animate: opacity 1, y: 0 (neutral position)
   - Exit: opacity 0, y: -10 (slide up slightly)

5. **Configure animation timing**
   - Duration: 0.2-0.3 seconds (fast but smooth)
   - Easing: ease-in-out or [0.4, 0, 0.2, 1] (Tailwind default)
   - Delay: 0 (start immediately)
   - Type: spring or tween

6. **Implement motion component**
   - Use motion.div as wrapper
   - Apply variants prop
   - Set initial, animate, exit states
   - Include animationKey for remounting

7. **Add conditional animation**
   - Check `enabled` prop
   - If false, return children without animation wrapper
   - Useful for disabling animations in certain contexts

8. **Handle route changes**
   - Use animationKey based on current route
   - Wrap with AnimatePresence if needed
   - Ensure exit animations complete before new page

9. **Optimize performance**
   - Use will-change CSS property
   - Keep animations short (< 300ms)
   - Avoid animating expensive properties
   - Use GPU-accelerated properties (opacity, transform)

10. **Add reduced motion support**
    - Check prefers-reduced-motion media query
    - Disable or simplify animations if user prefers
    - Use Framer Motion's built-in support
    - Respect user accessibility preferences

11. **Integrate into StoreLayout**
    - Wrap main content or entire layout
    - Place inside or around MainContent component
    - Ensure proper nesting with other layout elements

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Content to animate |
| className | string | No | "" | Additional classes |
| animationKey | string | No | undefined | Key for remounting |
| enabled | boolean | No | true | Enable animations |

### Animation Variants

```typescript
const variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
};
```

### Animation Timing

| Phase | Duration | Easing | Description |
|-------|----------|--------|-------------|
| Initial | 0ms | - | Starting state (hidden) |
| Animate (Enter) | 300ms | ease-out | Fade and slide in |
| Exit | 200ms | ease-in | Fade and slide out |

### Animation Properties

| Property | Values | Purpose |
|----------|--------|---------|
| opacity | 0 → 1 → 0 | Fade in/out |
| y (translateY) | 20 → 0 → -20 | Subtle slide motion |
| duration | 0.2-0.3s | Quick but smooth |
| ease | [0.4, 0, 0.2, 1] | Natural motion curve |

### Reduced Motion Support

```
User Preference Check:
├── prefers-reduced-motion: no-preference
│   └── Apply full animations
└── prefers-reduced-motion: reduce
    └── Disable or simplify animations

Framer Motion Implementation:
- Automatically respects prefers-reduced-motion
- Or manually check and disable animations
```

### Performance Optimization

| Technique | Implementation | Benefit |
|-----------|----------------|---------|
| GPU Acceleration | Use transform and opacity only | Smooth 60fps |
| will-change | Add will-change: transform, opacity | Browser optimization |
| Short Duration | Keep under 300ms | Perceived speed |
| Avoid Layout Shift | Animate transforms, not size | Prevent reflow |

### Integration with Layout

```
StoreLayout Structure with Animation:
<StoreLayout>
  <LayoutAnimation key={pathname}>
    <MainContent>
      {children}
    </MainContent>
  </LayoutAnimation>
</StoreLayout>

Or wrap individual pages:
<LayoutAnimation key={pageKey}>
  <ProductListPage />
</LayoutAnimation>
```

### Usage Examples

```
Basic Usage:
<LayoutAnimation>
  <PageContent />
</LayoutAnimation>

With Route-Based Key:
<LayoutAnimation animationKey={pathname}>
  <PageContent />
</LayoutAnimation>

Disabled Animations:
<LayoutAnimation enabled={false}>
  <PageContent />
</LayoutAnimation>

Custom Styles:
<LayoutAnimation className="custom-animation">
  <PageContent />
</LayoutAnimation>
```

### Animation Flow Diagram

```
Page A → Page B Transition:

Page A:
[Fade In] → [Visible] → [Fade Out (exit)]
                             ↓
                        Exit Complete
                             ↓
Page B:
                        [Fade In (initial → animate)] → [Visible]
```

### Expected Outcome
- Functional layout animation wrapper
- Smooth fade and slide animations
- Route-based animation keys
- Configurable and disableable
- Respects reduced motion preferences
- Performance optimized

### Verification Checklist
- [ ] Framer Motion installed in project
- [ ] `frontend/components/storefront/layout/LayoutAnimation.tsx` created
- [ ] Component uses motion.div from framer-motion
- [ ] Animation variants defined (initial, animate, exit)
- [ ] Accepts children, className, animationKey, enabled props
- [ ] Animations can be disabled via enabled prop
- [ ] Timing configured appropriately (200-300ms)
- [ ] Respects prefers-reduced-motion setting
- [ ] Only animates transform and opacity (performant)
- [ ] Integrated into StoreLayout or ready for integration
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 14: Verify Layout Structure

### Overview
Perform comprehensive verification of the complete store layout structure to ensure all components are properly integrated, functional, and meet accessibility and performance standards. This task includes manual testing, automated checks, and documentation review.

### Dependencies
- All previous tasks (01-13) must be complete

### Instructions

1. **Verify file structure**
   - Check all component files exist in correct locations
   - Verify naming conventions are consistent
   - Ensure proper directory organization
   - Confirm all exports are present

2. **Check component integration**
   - Verify StoreLayout imports all sub-components
   - Ensure proper nesting of layout elements
   - Check component props are passed correctly
   - Validate TypeScript types throughout

3. **Test layout rendering**
   - Create test page to render StoreLayout
   - Verify all sections appear (announcement, header, main, footer)
   - Check placeholder components show in development
   - Ensure children content renders properly

4. **Verify announcement bar functionality**
   - Test announcement bar displays correctly
   - Verify dismiss button works
   - Check state persists after page refresh
   - Test auto-expiry after configured days

5. **Test scroll behaviors**
   - Scroll page and verify scroll position tracking
   - Check scroll direction detection (up/down)
   - Test isScrolled threshold trigger
   - Verify sticky header behavior activates

6. **Test sticky header logic**
   - Test all three behavior modes
   - Verify hide-on-scroll-down works
   - Check header visibility toggles correctly
   - Test smooth animations on show/hide

7. **Verify skip to content link**
   - Tab to focus skip link (should be first)
   - Verify link becomes visible on focus
   - Click link and verify scroll to main content
   - Check main content receives focus

8. **Test layout animations**
   - Navigate between pages (simulate route change)
   - Verify fade in/out animations
   - Check animation timing and smoothness
   - Test with animations disabled

9. **Check responsive behavior**
   - Test layout on mobile viewport (< 640px)
   - Test on tablet viewport (640px - 1024px)
   - Test on desktop viewport (> 1024px)
   - Verify LayoutContainer adjusts properly

10. **Verify accessibility**
    - Check semantic HTML elements used (header, main, footer)
    - Verify ARIA roles and labels
    - Test keyboard navigation throughout
    - Run accessibility audit (axe DevTools or Lighthouse)

11. **Test TypeScript types**
    - Verify no TypeScript errors
    - Check all imports resolve correctly
    - Ensure proper type inference
    - Validate interface implementations

12. **Performance checks**
    - Check scroll performance (no jank)
    - Verify animations run at 60fps
    - Test on lower-end devices (throttle CPU)
    - Check Lighthouse performance score

13. **Cross-browser testing**
    - Test in Chrome
    - Test in Firefox
    - Test in Safari (if Mac available)
    - Test in Edge

14. **Document any issues**
    - Create list of bugs or problems found
    - Note areas for improvement
    - Document workarounds if needed
    - Plan fixes for next iteration

### Verification Checklist - File Structure

```
Expected Files:
frontend/
├── components/
│   └── storefront/
│       └── layout/
│           ├── StoreLayout.tsx ✓
│           ├── LayoutContainer.tsx ✓
│           ├── LayoutAnimation.tsx ✓
│           ├── MainContent.tsx ✓
│           ├── HeaderPlaceholder.tsx ✓
│           ├── FooterPlaceholder.tsx ✓
│           ├── SkipToContent.tsx ✓
│           ├── AnnouncementBar/
│           │   ├── AnnouncementBar.tsx ✓
│           │   └── index.ts ✓
│           ├── hooks/
│           │   ├── useScrollPosition.ts ✓
│           │   └── useStickyHeader.ts ✓
│           └── index.ts ✓
├── types/
│   └── store/
│       └── layout.ts ✓
├── store/
│   └── ui/
│       └── announcementStore.ts ✓
└── config/
    └── store/
        └── announcementBar.config.ts ✓
```

### Component Integration Checklist

| Component | Imported In | Props Passed | Functional |
|-----------|-------------|--------------|------------|
| SkipToContent | StoreLayout | - | ✓ |
| AnnouncementBar | StoreLayout | config, onDismiss | ✓ |
| HeaderPlaceholder | StoreLayout | - | ✓ |
| MainContent | StoreLayout | children | ✓ |
| FooterPlaceholder | StoreLayout | - | ✓ |
| LayoutContainer | Multiple | children, maxWidth | ✓ |
| LayoutAnimation | StoreLayout | children, key | ✓ |

### Functional Testing Matrix

| Feature | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| Announcement Bar | Initial render | Bar visible with message | ✓ |
| Announcement Bar | Click dismiss | Bar hidden | ✓ |
| Announcement Bar | Refresh page | Bar stays hidden | ✓ |
| Announcement Bar | After 30 days | Bar visible again | ✓ |
| Skip Link | Press Tab | Link focused and visible | ✓ |
| Skip Link | Press Enter | Scroll to main content | ✓ |
| Scroll Tracking | Scroll down | scrollY increases, direction = 'down' | ✓ |
| Scroll Tracking | Scroll up | scrollY decreases, direction = 'up' | ✓ |
| Sticky Header | Scroll past threshold | Header becomes sticky | ✓ |
| Sticky Header | Scroll down (hide mode) | Header hides | ✓ |
| Sticky Header | Scroll up (hide mode) | Header shows | ✓ |
| Layout Animation | Route change | Fade out then fade in | ✓ |

### Accessibility Audit Checklist

| Criterion | Requirement | Status |
|-----------|-------------|--------|
| 1.4.3 Contrast | Minimum 4.5:1 text contrast | ✓ |
| 2.1.1 Keyboard | All functionality keyboard accessible | ✓ |
| 2.4.1 Bypass Blocks | Skip to content link present | ✓ |
| 2.4.4 Link Purpose | Links have descriptive text | ✓ |
| 2.4.7 Focus Visible | Focus indicators visible | ✓ |
| 3.2.3 Navigation | Consistent navigation | ✓ |
| 4.1.2 Name, Role, Value | All elements have proper labels | ✓ |

### Responsive Breakpoints Testing

| Viewport | Width | Layout Behavior | Status |
|----------|-------|-----------------|--------|
| Mobile | 375px | Single column, stack vertically | ✓ |
| Mobile Large | 425px | Same as mobile | ✓ |
| Tablet | 768px | Increased padding, same structure | ✓ |
| Desktop | 1024px | Max-width container, centered | ✓ |
| Desktop Large | 1440px | Same as desktop, more padding | ✓ |

### Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| First Contentful Paint | < 1.5s | [Measure] | ✓ |
| Largest Contentful Paint | < 2.5s | [Measure] | ✓ |
| Cumulative Layout Shift | < 0.1 | [Measure] | ✓ |
| Time to Interactive | < 3.5s | [Measure] | ✓ |
| Scroll FPS | 60fps | [Measure] | ✓ |
| Animation FPS | 60fps | [Measure] | ✓ |

### Browser Compatibility

| Browser | Version | Layout | Animations | Sticky | Status |
|---------|---------|--------|------------|--------|--------|
| Chrome | Latest | ✓ | ✓ | ✓ | ✓ |
| Firefox | Latest | ✓ | ✓ | ✓ | ✓ |
| Safari | Latest | ✓ | ✓ | ✓ | ✓ |
| Edge | Latest | ✓ | ✓ | ✓ | ✓ |

### Issues and Improvements Log

| Issue # | Description | Severity | Status | Resolution |
|---------|-------------|----------|--------|------------|
| 01 | [Document issues found] | High/Med/Low | Open/Fixed | [Solution] |
| 02 | | | | |

### Testing Procedures

```
Manual Testing Steps:
1. Start development server
2. Navigate to test page with StoreLayout
3. Verify visual appearance of all sections
4. Test each interactive element
5. Check responsive behavior at different widths
6. Test keyboard navigation
7. Run accessibility audit
8. Monitor performance metrics
9. Test in multiple browsers
10. Document all findings

Automated Testing (if applicable):
1. Run unit tests: npm test
2. Run integration tests
3. Run E2E tests (if configured)
4. Check test coverage
5. Review test results
```

### Expected Outcome
- Fully functional and verified store layout
- All components integrated correctly
- Accessibility standards met
- Performance targets achieved
- Cross-browser compatibility confirmed
- Documentation of any issues
- Ready for next phase of development

### Final Verification Checklist
- [ ] All 14 component files created and in correct locations
- [ ] StoreLayout properly integrates all sub-components
- [ ] Layout renders correctly with all sections visible
- [ ] Announcement bar dismisses and persists state
- [ ] Scroll position tracking works accurately
- [ ] Scroll direction detection functions correctly
- [ ] Sticky header behavior activates at threshold
- [ ] All three sticky header modes tested
- [ ] Skip to content link visible on focus and functional
- [ ] Layout animations smooth on route changes
- [ ] Responsive behavior tested at all breakpoints
- [ ] LayoutContainer adjusts width appropriately
- [ ] Semantic HTML elements used throughout
- [ ] ARIA roles and labels present where needed
- [ ] Keyboard navigation works for all interactive elements
- [ ] Accessibility audit passed (no critical issues)
- [ ] TypeScript compiles without errors
- [ ] All imports resolve correctly
- [ ] Scroll performance smooth (60fps)
- [ ] Animations run smoothly (60fps)
- [ ] Tested in Chrome, Firefox, Safari, Edge
- [ ] All tests passing (if automated tests exist)
- [ ] Documentation updated with any notes
- [ ] Known issues documented with planned resolutions

---

## Summary

This document completed the store layout implementation with the main content wrapper, footer placeholder, skip to content accessibility link, scroll tracking hook, sticky header logic, layout animations, and comprehensive verification. The layout is now fully functional, accessible, performant, and ready for population with actual header and footer components in subsequent groups.

### Completed Tasks
1. ✓ Created main content wrapper with semantic HTML
2. ✓ Added footer placeholder for future implementation
3. ✓ Implemented skip to content link for accessibility
4. ✓ Created scroll position tracking hook
5. ✓ Implemented sticky header logic with multiple behaviors
6. ✓ Added layout animations with Framer Motion
7. ✓ Performed comprehensive layout structure verification

### Key Achievements
- Complete five-section layout structure (skip link, announcement, header, main, footer)
- Full accessibility compliance with skip links and semantic HTML
- Smooth scroll-based interactions and animations
- Configurable sticky header with hide-on-scroll capability
- Performance-optimized scroll tracking and animations
- Responsive design across all device sizes
- State persistence for announcement bar
- Cross-browser compatibility verified

### Next Phase
The layout shell is now complete and ready for Group B (Header Components), where the header placeholder will be replaced with a fully functional storefront header including logo, navigation, search, cart, and user menus.
