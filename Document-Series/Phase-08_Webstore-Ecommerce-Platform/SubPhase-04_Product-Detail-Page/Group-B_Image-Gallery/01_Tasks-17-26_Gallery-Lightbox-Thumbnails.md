# Tasks 17-26: Gallery, Lightbox & Thumbnails

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** B - Image Gallery  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Mobile-States-Verify.md](02_Tasks-27-34_Mobile-States-Verify.md)

---

## Document Overview

This document covers implementation of the product image gallery system including main image display, zoom functionality, full-screen lightbox modal, and thumbnail navigation. These components provide users with comprehensive product image browsing capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create Gallery Component | Medium | 30 min |
| 18 | Create Main Image Display | Low | 20 min |
| 19 | Create Image Zoom Feature | Medium | 35 min |
| 20 | Create Lightbox Modal | Medium | 40 min |
| 21 | Create Lightbox Navigation | Low | 20 min |
| 22 | Create Lightbox Controls | Low | 25 min |
| 23 | Create Thumbnail Strip | Low | 25 min |
| 24 | Create Thumbnail Item | Low | 20 min |
| 25 | Create Thumbnail Active State | Low | 15 min |
| 26 | Create Thumbnail Navigation | Low | 25 min |

---

## Task 17: Create Gallery Component

### Overview
Build the main container component that houses the product image gallery, managing state and coordinating between child components for image display, zoom, lightbox, and thumbnail interactions.

### Dependencies
- Group-A completed (Product page structure)
- Next.js Image component configured
- Product data types defined

### Instructions

1. **Create gallery component file**
   - Navigate to `frontend/components/storefront/product/Gallery/` directory
   - Create `Gallery.tsx` file
   - Set up component with TypeScript interfaces

2. **Define TypeScript interfaces**
   - Create `GalleryProps` interface with image array, product name
   - Define `ProductImage` type with URL, alt text, dimensions
   - Add optional callbacks for state changes
   - Include loading state props

3. **Implement state management**
   - Add state for selected image index (useState)
   - Add state for lightbox open/closed (useState)
   - Add state for zoom active (useState)
   - Add state for touch gesture tracking

4. **Create gallery container structure**
   - Use semantic HTML (article or section element)
   - Add proper ARIA labels for accessibility
   - Implement responsive grid layout
   - Apply consistent spacing from design system

5. **Integrate child component slots**
   - Main image display area at top
   - Thumbnail strip below main image
   - Conditional lightbox modal overlay
   - Proper component composition

6. **Implement image selection handlers**
   - Create function to handle thumbnail clicks
   - Update selected index state
   - Sync main image with selection
   - Handle keyboard navigation (arrow keys)

7. **Add responsive behavior**
   - Desktop: Large image with thumbnails below
   - Tablet: Adjusted spacing and sizing
   - Mobile: Full-width with swipe capability
   - Configure breakpoints

### Gallery Structure

```
Gallery Component
├── State Management
│   ├── selectedIndex (current image)
│   ├── isLightboxOpen (modal state)
│   ├── isZoomActive (zoom state)
│   └── images (product images array)
├── Main Image Section
│   └── MainImage component slot
├── Thumbnail Section
│   └── ThumbnailStrip component slot
└── Lightbox Section (conditional)
    └── Lightbox modal component slot
```

### State Configuration

| State Variable | Type | Initial Value | Purpose |
|----------------|------|---------------|---------|
| selectedIndex | number | 0 | Currently displayed image |
| isLightboxOpen | boolean | false | Lightbox modal visibility |
| isZoomActive | boolean | false | Zoom feature activation |
| images | ProductImage[] | props.images | Product image collection |

### Expected Outcome
- Functional gallery container managing image state
- Proper integration points for child components
- Responsive layout across devices
- Keyboard navigation support
- Accessibility compliant structure
- Smooth state transitions

### Verification Checklist
- [ ] Component renders with valid image data
- [ ] State updates correctly on interactions
- [ ] Child components receive proper props
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Responsive on all breakpoints
- [ ] TypeScript compiles without errors

---

## Task 18: Create Main Image Display

### Overview
Implement the primary product image display using Next.js Image component with optimized loading, responsive sizing, and proper accessibility features.

### Dependencies
- Task 17: Gallery Component
- Next.js Image configuration
- Image CDN setup

### Instructions

1. **Create main image component**
   - Navigate to `frontend/components/storefront/product/Gallery/` directory
   - Create `MainImage.tsx` file
   - Accept image data, click handler, loading state props

2. **Configure Next.js Image**
   - Use Next.js Image component
   - Set priority loading for first image
   - Configure responsive sizes attribute
   - Set quality settings (85 for main images)
   - Add blur placeholder

3. **Set up aspect ratio container**
   - Create container maintaining aspect ratio (1:1 or 4:3)
   - Use CSS aspect-ratio property
   - Prevent layout shift during load
   - Center image within container

4. **Add loading states**
   - Skeleton loader while fetching
   - Blur-up effect for progressive loading
   - Smooth fade-in when loaded
   - Loading spinner overlay

5. **Implement error handling**
   - Fallback placeholder image
   - Error message display
   - Retry mechanism option
   - Log errors for monitoring

6. **Add click functionality**
   - Make image clickable for lightbox
   - Add cursor pointer on hover
   - Attach onClick event handler
   - Include keyboard support (Enter/Space)
   - Show zoom icon overlay on hover

7. **Optimize performance**
   - Lazy load images below fold
   - Use WebP format with fallbacks
   - Proper sizing to prevent large downloads
   - CDN integration

### Image Configuration

| Setting | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Container Width | 600px | 500px | 100vw |
| Aspect Ratio | 1:1 | 1:1 | 1:1 |
| Priority Load | Yes | Yes | Yes |
| Quality | 85 | 80 | 75 |
| Sizes | 600px | 500px | 100vw |

### Loading Flow

```
Initial → Skeleton → Loading → (Error) → Loaded
                       │           │
                       │           └─→ Fallback
                       └─→ Blur-up → Fade-in
```

### Expected Outcome
- Optimized image display with Next.js
- Consistent aspect ratio without layout shift
- Appropriate loading states
- Graceful error handling
- Lightbox opens on click
- Sharp rendering on all devices
- Accessibility compliant

### Verification Checklist
- [ ] Image renders correctly
- [ ] Aspect ratio maintained
- [ ] Loading state displays
- [ ] Smooth fade-in transition
- [ ] Error fallback works
- [ ] Click opens lightbox
- [ ] Keyboard interaction works
- [ ] Alt text set properly
- [ ] Sharp on retina displays
- [ ] No layout shift

---

## Task 19: Create Image Zoom Feature

### Overview
Implement hover-based zoom functionality allowing users to see product details by zooming into the main image with cursor position tracking.

### Dependencies
- Task 18: Main Image Display
- CSS transform support
- Mouse event handling

### Instructions

1. **Add zoom state management**
   - Add zoom active state (boolean)
   - Add mouse position state (x, y coordinates)
   - Define zoom level (e.g., 2x or 2.5x)
   - Track mouse vs touch interaction

2. **Create zoom overlay container**
   - Position absolutely over main image
   - Same dimensions as main image
   - Transparent until hover
   - Contains zoomed image copy

3. **Implement mouse event handlers**
   - onMouseEnter: Activate zoom
   - onMouseMove: Track cursor position
   - onMouseLeave: Deactivate zoom
   - Calculate relative position within image

4. **Apply zoom transform**
   - Use CSS transform: scale() for zoom
   - Set transform-origin based on cursor
   - Calculate percentage position
   - Apply smooth transitions

5. **Create zoomed image view**
   - Render higher resolution image if available
   - Apply scale transform at calculated origin
   - Smooth position transitions
   - Clip to container bounds

6. **Add lens indicator (optional)**
   - Small overlay showing zoom area
   - Follows cursor position
   - Semi-transparent border
   - Visual feedback for zoom region

7. **Implement mobile alternative**
   - Disable hover zoom on touch devices
   - Use double-tap to toggle zoom
   - Pinch gesture for zoom control
   - Or direct to lightbox instead

### Zoom Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Zoom Level | 2x - 2.5x | Magnification factor |
| Transform Origin | Cursor position (%) | Zoom focal point |
| Transition | 150ms ease | Smooth activation |
| Mobile Behavior | Disabled or double-tap | Touch alternative |

### Zoom Calculation

```
Mouse X % = (mouseX / imageWidth) × 100
Mouse Y % = (mouseY / imageHeight) × 100
Transform Origin = `${X%} ${Y%}`
Scale = 2.0 or 2.5
```

### Expected Outcome
- Smooth zoom on mouse hover
- Zoom follows cursor in real-time
- Clear visual feedback
- Performant without lag
- Works across image sizes
- Graceful mobile degradation
- Enhanced detail visibility

### Verification Checklist
- [ ] Zoom activates on hover
- [ ] Zoom follows cursor smoothly
- [ ] Transform-origin updates correctly
- [ ] Zoom deactivates on mouse leave
- [ ] No performance lag
- [ ] Appropriate zoom level
- [ ] Higher-res image loads (if available)
- [ ] Disabled on touch devices
- [ ] No visual glitches

---

## Task 20: Create Lightbox Modal

### Overview
Build a full-screen modal dialog displaying product images in a lightbox overlay with dark background for detailed viewing.

### Dependencies
- Task 17: Gallery Component
- Task 18: Main Image Display
- Dialog/Modal component available

### Instructions

1. **Set up dialog component**
   - Use Dialog component or modal library
   - Full-screen overlay backdrop
   - Dark semi-transparent background (rgba(0,0,0,0.9))
   - Centered content area
   - Z-index above all content
   - Portal to document body

2. **Configure modal state**
   - Connect to isLightboxOpen state from gallery
   - Accept onClose callback handler
   - Sync current image index
   - Preserve state when closing

3. **Build modal content structure**
   - Full-height flex container
   - Large image display area (maximum viewport usage)
   - Navigation controls slots (arrows)
   - Close button and controls slots
   - Image counter display (e.g., "3 / 8")

4. **Implement accessibility features**
   - ARIA role="dialog"
   - ARIA-label describing dialog
   - Focus trap within modal
   - Return focus on close
   - ESC key closes modal

5. **Handle body scroll lock**
   - Lock body scroll when open
   - Restore scroll when closed
   - Handle iOS scroll issues
   - Maintain scroll position

6. **Add open/close animations**
   - Fade in backdrop
   - Scale or fade in content
   - Reverse on close
   - CSS transitions (300ms)

7. **Configure responsive behavior**
   - Desktop: Large centered with controls
   - Tablet: Adjusted sizing with touch
   - Mobile: Full viewport with swipe
   - Landscape: Optimize aspect ratio

### Lightbox Structure

```
┌─────────────────────────────────────┐
│  Lightbox Modal (Dark Backdrop)     │
│                                     │
│  [X] Close            3 / 8        │
│                                     │
│  ◄     [Large Product Image]    ►  │
│                                     │
│        [Zoom Controls]              │
└─────────────────────────────────────┘
```

### Lightbox Configuration

| Property | Desktop | Mobile |
|----------|---------|--------|
| Backdrop Opacity | 0.9 | 0.95 |
| Max Image Width | 90vw | 95vw |
| Max Image Height | 85vh | 80vh |
| Animation Duration | 300ms | 250ms |
| Close on Backdrop | Yes | Yes |

### Expected Outcome
- Full-screen lightbox modal
- Smooth open/close animations
- Focus trapped for accessibility
- Body scroll locked when open
- Closes via ESC, close button, backdrop
- Shows image counter
- Responsive across devices
- Navigation integration ready

### Verification Checklist
- [ ] Modal opens on image click
- [ ] Dark backdrop covers viewport
- [ ] Image displays centered
- [ ] Close button works
- [ ] ESC key closes modal
- [ ] Backdrop click closes
- [ ] Focus trapped in modal
- [ ] Body scroll locked
- [ ] Focus returns on close
- [ ] Smooth animations
- [ ] ARIA attributes set
- [ ] Works on mobile/desktop

---

## Task 21: Create Lightbox Navigation

### Overview
Implement previous/next navigation controls within lightbox to browse product images without closing the modal.

### Dependencies
- Task 20: Lightbox Modal
- Icon library for arrows

### Instructions

1. **Create navigation buttons**
   - Previous (left arrow) button
   - Next (right arrow) button
   - Consistent styling and sizing
   - Arrow icon or SVG indicators
   - Accessible button labels

2. **Position navigation controls**
   - Absolute positioning on left/right edges
   - Vertically centered in viewport
   - Spacing from image
   - Semi-transparent background on hover
   - High z-index

3. **Implement navigation logic**
   - Previous: Decrement index
   - Next: Increment index
   - Wrapping (last to first, first to last)
   - Or disable at boundaries
   - Update selected image state

4. **Add keyboard navigation**
   - Left arrow key: Previous
   - Right arrow key: Next
   - Home key: First image (optional)
   - End key: Last image (optional)
   - Prevent default behavior

5. **Handle edge cases**
   - Single image: Hide arrows
   - First image: Disable previous (if no wrap)
   - Last image: Disable next (if no wrap)
   - Loading states during transition

6. **Add visual feedback**
   - Hover effects on buttons
   - Active/pressed states
   - Disabled state styling
   - Smooth transitions
   - Optional ripple effect

7. **Optimize for touch**
   - Larger touch targets (44x44px min)
   - Swipe gestures for navigation
   - Tap zones on image sides
   - Visual swipe indicators

### Navigation Controls

| Control | Keyboard | Mouse | Touch | Action |
|---------|----------|-------|-------|--------|
| Previous | ← | Left Button | Swipe → | Previous image |
| Next | → | Right Button | Swipe ← | Next image |
| First | Home | - | - | Jump to first |
| Last | End | - | - | Jump to last |

### Navigation Logic

```
Current Index: i, Total: n

Previous:
  if (i === 0) → Wrap to (n-1) OR Disable
  else → Go to (i-1)

Next:
  if (i === n-1) → Wrap to 0 OR Disable
  else → Go to (i+1)
```

### Expected Outcome
- Browse all images in lightbox
- Keyboard arrow key support
- Touch swipe gestures
- Appropriate disabled states
- Clear visual feedback
- Smooth image transitions
- Counter updates with navigation

### Verification Checklist
- [ ] Previous button works
- [ ] Next button works
- [ ] Left arrow key works
- [ ] Right arrow key works
- [ ] Boundaries handled correctly
- [ ] Wrapping works (if enabled)
- [ ] Swipe gestures work
- [ ] Single image handled
- [ ] Hover states display
- [ ] Counter updates
- [ ] Smooth transitions

---

## Task 22: Create Lightbox Controls

### Overview
Implement additional lightbox controls including close button, zoom controls, and optional download/share features.

### Dependencies
- Task 20: Lightbox Modal
- Task 21: Lightbox Navigation
- Icon library

### Instructions

1. **Create close button**
   - Position in top-right corner
   - Large enough for clicking (44x44px min)
   - Clear "X" icon or "Close" text
   - High contrast against backdrop
   - Calls onClose handler

2. **Add image counter display**
   - Current index and total count
   - Format: "3 / 8" or "3 of 8"
   - Position: Top center or bottom
   - Clear, readable typography
   - Updates with navigation

3. **Create zoom control buttons**
   - Zoom in button (+ icon)
   - Zoom out button (- icon)
   - Position near bottom
   - Increment/decrement zoom level
   - Apply CSS transform scale

4. **Implement zoom functionality**
   - Define zoom levels (100%, 150%, 200%, 300%)
   - Scale image with transform
   - Enable pan/drag when zoomed
   - Reset zoom on image change
   - Double-click to toggle zoom

5. **Add pan/drag for zoomed images**
   - Cursor changes to grab/move
   - Track mouse drag movements
   - Apply translate transform
   - Constrain to image bounds
   - Touch: pinch and pan gestures

6. **Create control bar container**
   - Semi-transparent bar at bottom
   - Contains zoom and other controls
   - Fades in on mouse movement
   - Auto-hide after inactivity (optional)
   - Always visible on touch devices

7. **Add optional controls**
   - Download button to save image
   - Share button for social
   - Fullscreen toggle
   - Image info display
   - Print button

### Controls Layout

```
┌────────────────────────────────┐
│ [X] Close    3/8    [ℹ] Info  │ Top Bar
├────────────────────────────────┤
│  ◄  [Large Product Image]  ►  │ Image + Nav
├────────────────────────────────┤
│ [🔍-] [🔍+] [⬇] [⤢]          │ Control Bar
└────────────────────────────────┘
```

### Controls Specification

| Control | Icon | Action | Keyboard |
|---------|------|--------|----------|
| Close | ✕ | Close lightbox | ESC |
| Zoom In | + | Increase zoom | + or = |
| Zoom Out | - | Decrease zoom | - |
| Download | ⬇ | Save image | Ctrl+S |
| Fullscreen | ⤢ | Toggle fullscreen | F |
| Counter | 3/8 | Display only | - |

### Zoom Levels

```
Levels: [100%, 150%, 200%, 300%]

Zoom In: Increase to next level (max 300%)
Zoom Out: Decrease to previous level (min 100%)
Double-Click: Toggle between 100% and 200%
```

### Expected Outcome
- Close button closes lightbox
- Image counter displays correctly
- Zoom in/out controls work
- Pan enabled when zoomed
- Keyboard shortcuts function
- Optional download/share features
- Intuitive controls
- Cross-device compatibility

### Verification Checklist
- [ ] Close button closes lightbox
- [ ] Counter displays and updates
- [ ] Zoom in increases zoom
- [ ] Zoom out decreases zoom
- [ ] Controls disabled at limits
- [ ] Panning works when zoomed
- [ ] Double-click toggles zoom
- [ ] Keyboard shortcuts work
- [ ] Download works (if implemented)
- [ ] Controls visible/accessible
- [ ] Touch gestures work
- [ ] Zoom resets on image change

---

## Task 23: Create Thumbnail Strip

### Overview
Build a horizontal thumbnail strip displaying all product images as small previews below the main image.

### Dependencies
- Task 17: Gallery Component
- Flexbox/Grid layout
- Scroll container utilities

### Instructions

1. **Create thumbnail container**
   - Navigate to `frontend/components/storefront/product/Gallery/`
   - Create `ThumbnailStrip.tsx` file
   - Horizontal flexbox layout
   - Gap spacing between thumbnails
   - Responsive width constraints

2. **Implement scrollable container**
   - Overflow-x: auto for horizontal scroll
   - Hide or style scrollbar
   - Smooth scrolling behavior
   - Snap to thumbnail alignment (optional)
   - Touch-friendly scrolling

3. **Calculate thumbnail sizing**
   - Fixed dimensions (e.g., 80x80px desktop)
   - Maintain aspect ratio of main image
   - Consistent sizing across thumbnails
   - Responsive sizing at breakpoints
   - 4-6 visible at once

4. **Implement auto-scroll behavior**
   - Scroll to show active thumbnail
   - Center active thumbnail (optional)
   - Smooth scroll animation
   - Trigger on selection change

5. **Add thumbnail grid layout**
   - Single row horizontal (most common)
   - Or multi-row grid for many images
   - Even spacing with gap
   - Alignment configuration

6. **Integrate navigation arrows**
   - Left/right scroll arrows
   - Show/hide based on scroll position
   - Scroll by fixed amount
   - Position absolutely over container

7. **Handle different image counts**
   - Few images (2-4): No scrolling
   - Many images (10+): Enable scrolling
   - Single image: Hide strip
   - Empty state: Placeholder

### Thumbnail Strip Layout

```
Desktop:
┌──────────────────────────────┐
│ [▪][▪][▪][▪][▪][▪][▪][▪]    │
└──────────────────────────────┘

With Scroll:
┌──────────────────────────────┐
│ ◄ [▪][▪][▪][▪][▪][▪] ►      │
└──────────────────────────────┘

Mobile:
┌──────────────┐
│ [▪][▪][▪][▪] ►
└──────────────┘
```

### Strip Configuration

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Thumbnail Size | 80x80px | 70x70px | 60x60px |
| Gap Between | 12px | 10px | 8px |
| Visible Count | 6-8 | 5-6 | 3-4 |
| Overflow | Scroll | Scroll | Scroll |
| Nav Arrows | Yes | Optional | No |

### Expected Outcome
- Horizontal thumbnail strip below main image
- Scrollable when needed
- Navigation arrows on desktop
- Auto-scroll to active thumbnail
- Touch gestures on mobile
- Handles various image counts
- Consistent spacing and sizing

### Verification Checklist
- [ ] Strip renders below main image
- [ ] All images display as thumbnails
- [ ] Container scrolls horizontally
- [ ] Consistent thumbnail sizing
- [ ] Even spacing
- [ ] Auto-scroll on selection change
- [ ] Arrows appear when needed
- [ ] Touch scrolling works
- [ ] Single image hides strip
- [ ] Empty state handled
- [ ] No overflow issues

---

## Task 24: Create Thumbnail Item

### Overview
Build individual thumbnail components displaying preview images with selection interactions.

### Dependencies
- Task 23: Thumbnail Strip
- Next.js Image component
- Active state styling

### Instructions

1. **Create thumbnail component**
   - Create `Thumbnail.tsx` in Gallery directory
   - Accept image data (URL, alt text)
   - Accept index/ID for identification
   - Accept isActive boolean prop
   - Accept onClick callback

2. **Implement thumbnail image**
   - Use Next.js Image component
   - Fixed width/height dimensions
   - Object-fit: cover for aspect ratio
   - Lower quality than main image (70-75)
   - Lazy loading for below-fold thumbnails

3. **Add container with border**
   - Fixed dimensions matching thumbnail size
   - Border with neutral color
   - Border-radius for rounded corners
   - Padding or spacing inside
   - Overflow hidden

4. **Implement click handler**
   - Add onClick event handler
   - Call parent callback with index
   - Update gallery selection
   - Keyboard support (Enter/Space)
   - Large enough touch target

5. **Add hover state**
   - Border color change on hover
   - Opacity adjustment
   - Slight scale transform
   - Cursor pointer
   - Smooth CSS transitions

6. **Add accessibility features**
   - Role="button" for clickable
   - Aria-label describing thumbnail
   - Tabindex for keyboard navigation
   - Focus visible styles
   - Alt text for images

7. **Optimize performance**
   - Lazy load off-screen thumbnails
   - Appropriate image sizes
   - Debounce clicks if needed
   - Memoize to prevent rerenders

### Thumbnail Structure

```
┌───────────┐  Default
│ ┌───────┐ │  - Neutral border
│ │ Image │ │  - Full opacity
│ └───────┘ │
└───────────┘

┌═══════════┐  Active (Task 25)
║ ┌───────┐ ║  - Primary color border
║ │ Image │ ║  - Highlighted
║ └───────┘ ║
└═══════════┘

┌ ─ ─ ─ ─ ─┐  Hover
│ ┌───────┐ │  - Border change
│ │ Image │ │  - Slight scale
│ └───────┘ │
└ ─ ─ ─ ─ ─┘
```

### Thumbnail Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| image | ImageData | Yes | Image URL and alt |
| index | number | Yes | Thumbnail index |
| isActive | boolean | Yes | Active state |
| onClick | Function | Yes | Click handler |
| size | number | No | Custom size |

### Expected Outcome
- Reusable thumbnail components
- Respond to click events
- Visual feedback on hover
- Active state integration
- Efficient loading
- Keyboard navigation support
- Consistent appearance
- Error handling

### Verification Checklist
- [ ] Thumbnail displays image
- [ ] Aspect ratio maintained
- [ ] Border displays correctly
- [ ] Click updates main image
- [ ] Hover state works
- [ ] Cursor changes to pointer
- [ ] Keyboard navigation works
- [ ] Focus styles visible
- [ ] Loading state shows
- [ ] Error fallback works
- [ ] Lazy loading functions
- [ ] No layout shifts

---

## Task 25: Create Thumbnail Active State

### Overview
Implement visual highlighting for the currently selected thumbnail indicating which image is displayed.

### Dependencies
- Task 24: Thumbnail Item
- Task 17: Gallery Component (state)
- Design system colors

### Instructions

1. **Define active state styling**
   - Border color using primary brand color
   - Thicker border width (2-3px)
   - Optional inner shadow or glow
   - High contrast for accessibility
   - Distinct from hover state

2. **Connect to gallery state**
   - Pass isActive prop based on selected index
   - Compare thumbnail index to selected index
   - Boolean true when matching
   - Update on state change

3. **Implement conditional styling**
   - Use className with conditional logic
   - Or CSS-in-JS conditional styles
   - Or CSS with data attribute
   - Only one active at a time

4. **Add smooth transitions**
   - Transition between states
   - Border color fade animation
   - Consistent timing
   - No jarring changes

5. **Ensure accessibility**
   - Aria-current="true" for active
   - Sufficient color contrast
   - Focus styles work with active
   - Screen reader announces

6. **Handle focus vs active**
   - Active: Currently displayed (border)
   - Focus: Keyboard focus (outline)
   - Both can occur together
   - Don't hide focus on active

7. **Test color contrast**
   - Test against backgrounds
   - Light and dark mode visibility
   - WCAG AA contrast ratios
   - Color blindness simulation

### Active State Styling

| Property | Default | Active | Hover |
|----------|---------|--------|-------|
| Border Color | Gray-300 | Primary-600 | Gray-400 |
| Border Width | 2px | 3px | 2px |
| Opacity | 100% | 100% | 90% |
| Box Shadow | None | 0 0 0 1px primary | None |

### State Flow

```
Render → Check (index === selectedIndex?)
           │
           ├─No → Default Styles
           │
           └─Yes → Active Styles
                   + aria-current="true"

Selection Changes → Update State → Transition
```

### Expected Outcome
- Clear visual highlighting of selected thumbnail
- Automatic updates on selection change
- Distinct from default and hover states
- Meets accessibility standards
- Smooth state transitions
- Keyboard navigation compatible
- Only one active at a time

### Verification Checklist
- [ ] Active thumbnail highlighted
- [ ] Primary brand color used
- [ ] Only one active at a time
- [ ] Updates on selection change
- [ ] Smooth transitions
- [ ] Aria-current set correctly
- [ ] Visible in light/dark modes
- [ ] WCAG AA contrast met
- [ ] Focus outline visible on active
- [ ] Distinguishable from hover

---

## Task 26: Create Thumbnail Navigation

### Overview
Implement arrow controls for scrolling the thumbnail strip when thumbnails exceed visible area.

### Dependencies
- Task 23: Thumbnail Strip
- Task 24: Thumbnail Item
- Icon library

### Instructions

1. **Create navigation buttons**
   - Build left/right arrow buttons
   - Simple button with arrow icon
   - Circular or square shape
   - Semi-transparent background
   - Position absolutely over strip
   - High z-index

2. **Position navigation arrows**
   - Left arrow on left edge
   - Right arrow on right edge
   - Vertically centered on strip
   - Slight offset from edges
   - Overlay on thumbnails

3. **Implement scroll logic**
   - Calculate scroll amount (thumbnail width + gap)
   - Use scrollTo with smooth behavior
   - Or scroll by viewport width
   - Handle boundaries
   - Prevent over-scrolling

4. **Show/hide arrows dynamically**
   - Hide left at start
   - Hide right at end
   - Or disable instead of hiding
   - Use scroll event listener
   - Or Intersection Observer

5. **Detect scroll position**
   - Monitor scroll events
   - Calculate if at start/end
   - Update button states
   - Debounce scroll events
   - Threshold detection

6. **Add visual feedback**
   - Hover effect on arrows
   - Active/pressed state
   - Disabled state styling
   - Smooth transitions
   - Optional ripple effect

7. **Handle edge cases**
   - Few thumbnails: Hide both arrows
   - Not scrollable: Hide arrows
   - Reached limit: Hide/disable arrow
   - Rapid clicking: Debounce
   - Window resize: Recalculate

### Navigation Positioning

```
┌──────────────────────────────┐
│ ◄ [▪][▪][▪][▪][▪][▪] ►      │
│ ↑                     ↑      │
│ Left               Right     │
└──────────────────────────────┘

States:
- At Start: [◄disabled] [...] ►
- Middle: ◄ [...] ►
- At End: ◄ [...] [►disabled]
```

### Scroll Calculation

| Calculation | Formula | Purpose |
|-------------|---------|---------|
| Scroll Amount | thumbnailWidth + gap | Distance to scroll |
| At Start | scrollLeft === 0 | Disable left |
| At End | scrollLeft + clientWidth >= scrollWidth | Disable right |

### Navigation Flow

```
Arrow Click
   ↓
Determine Direction
   ↓
Left → scrollLeft -= amount
Right → scrollLeft += amount
   ↓
Smooth Scroll Animation
   ↓
Update Arrow States
   ↓
At Start? → Hide/Disable Left
At End? → Hide/Disable Right
Middle? → Show Both
```

### Expected Outcome
- Arrows scroll thumbnail strip
- Show/hide based on scroll position
- Smooth scrolling on click
- Boundary handling
- Works with various counts
- Clear visual feedback
- Performant without lag

### Verification Checklist
- [ ] Left arrow scrolls left
- [ ] Right arrow scrolls right
- [ ] Smooth scrolling
- [ ] Left hidden/disabled at start
- [ ] Right hidden/disabled at end
- [ ] Both visible in middle
- [ ] Hidden when not scrollable
- [ ] Hover states display
- [ ] Rapid clicks handled
- [ ] Scroll position accurate
- [ ] Works with different counts
- [ ] No performance issues

---

## Summary

### Tasks Completed

This document covered Tasks 17-26, implementing the complete product image gallery system:

✓ **Task 17:** Gallery container component with state management  
✓ **Task 18:** Main image display with Next.js optimization  
✓ **Task 19:** Hover zoom feature for detail viewing  
✓ **Task 20:** Full-screen lightbox modal dialog  
✓ **Task 21:** Lightbox navigation (previous/next)  
✓ **Task 22:** Lightbox controls (close, zoom, etc.)  
✓ **Task 23:** Horizontal thumbnail strip container  
✓ **Task 24:** Individual thumbnail components  
✓ **Task 25:** Active state highlighting for thumbnails  
✓ **Task 26:** Navigation arrows for thumbnail strip  

### Key Achievements

- Professional image gallery with zoom and lightbox
- Optimized image loading with Next.js
- Intuitive navigation and controls
- Responsive across all devices
- Accessibility compliant
- Performance optimized
- Ready for mobile enhancements

### Next Steps

Continue to [02_Tasks-27-34_Mobile-States-Verify.md](02_Tasks-27-34_Mobile-States-Verify.md) to implement:
- Mobile image swipe functionality
- Image dot indicators
- Variant image switching
- Loading and error states
- Sale badges and overlays
- Complete gallery verification

---

**Document Status:** Complete  
**Last Updated:** 2026-01-26
