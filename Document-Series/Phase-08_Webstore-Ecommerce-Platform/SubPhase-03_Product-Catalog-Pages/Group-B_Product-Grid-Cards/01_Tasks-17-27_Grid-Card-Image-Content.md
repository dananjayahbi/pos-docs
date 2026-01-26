# Tasks 17-27: Product Grid, Card Structure, Image & Content

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** B - Product Grid & Cards  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-28-36_Rating-Price-Cart-Skeleton.md](02_Tasks-28-36_Rating-Price-Cart-Skeleton.md)

---

## Document Overview

This document covers the creation of the product grid system and product card components with image section and content section. It establishes the foundational structure for displaying products in a responsive grid layout with rich, interactive product cards featuring images with hover effects, badges, quick actions, and essential product information.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create Product Grid Component | Medium | 30 min |
| 18 | Create Grid Layout Config | Low | 20 min |
| 19 | Create Product Card Component | Medium | 35 min |
| 20 | Create Card Image Section | Low | 25 min |
| 21 | Create Card Image Component | Low | 30 min |
| 22 | Create Card Image Hover | Low | 25 min |
| 23 | Create Card Badge | Low | 20 min |
| 24 | Create Card Quick Actions | Medium | 35 min |
| 25 | Create Card Content Section | Low | 20 min |
| 26 | Create Card Category | Low | 15 min |
| 27 | Create Card Title | Low | 15 min |

---

## Task 17: Create Product Grid Component

### Overview
Create the main ProductGrid component that displays products in a responsive grid layout. This component accepts an array of products and renders them using ProductCard components with configurable grid columns based on viewport size.

### Dependencies
- Task 16: Verify Catalog Pages (from Group A)
- SubPhase-02 components must be complete
- Product types defined

### Instructions

1. **Create ProductGrid directory structure**
   - Navigate to `frontend/components/storefront/catalog/` directory
   - Create new directory named `ProductGrid`
   - This organizes all grid-related components

2. **Create ProductGrid.tsx component file**
   - Create new file `ProductGrid.tsx` in the ProductGrid directory
   - This is the main grid container component
   - Will render products in responsive grid layout

3. **Define ProductGrid component props interface**
   - Create interface for component props
   - Include products array of Product type
   - Include optional loading state boolean
   - Include optional gridColumns configuration

4. **Import required dependencies**
   - Import React types and hooks
   - Import ProductCard component (created in Task 19)
   - Import grid configuration (created in Task 18)
   - Import Tailwind utilities

5. **Implement grid container structure**
   - Create main container div with grid display
   - Apply responsive grid columns using Tailwind
   - Add proper gap spacing between items
   - Ensure mobile-first responsive design

6. **Handle empty state**
   - Check if products array is empty
   - Display "No products found" message
   - Include helpful icon or illustration
   - Style with proper spacing and typography

7. **Map products to ProductCard components**
   - Iterate over products array
   - Render ProductCard for each product
   - Pass product data as props
   - Include unique key prop for React list

8. **Add loading state handling**
   - Check loading prop value
   - Render skeleton cards when loading
   - Match skeleton count to typical grid size

### Grid Layout Structure

```
┌────────────────────────────────────────────────────────┐
│                    Product Grid                        │
│                                                        │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐             │
│  │ Card │  │ Card │  │ Card │  │ Card │  Desktop    │
│  │  1   │  │  2   │  │  3   │  │  4   │  (4 cols)   │
│  └──────┘  └──────┘  └──────┘  └──────┘             │
│                                                        │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐             │
│  │ Card │  │ Card │  │ Card │  │ Card │             │
│  │  5   │  │  6   │  │  7   │  │  8   │             │
│  └──────┘  └──────┘  └──────┘  └──────┘             │
└────────────────────────────────────────────────────────┘

Mobile (2 cols)    Tablet (3 cols)    Desktop (4 cols)
┌────┬────┐       ┌────┬────┬────┐   ┌────┬────┬────┬────┐
│ 1  │ 2  │       │ 1  │ 2  │ 3  │   │ 1  │ 2  │ 3  │ 4  │
├────┼────┤       ├────┼────┼────┤   ├────┼────┼────┼────┤
│ 3  │ 4  │       │ 4  │ 5  │ 6  │   │ 5  │ 6  │ 7  │ 8  │
└────┴────┘       └────┴────┴────┘   └────┴────┴────┴────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| products | Product[] | Yes | Array of product objects |
| loading | boolean | No | Show loading skeletons |
| gridColumns | GridConfig | No | Override default columns |

### Grid Responsive Behavior

| Breakpoint | Screen Size | Columns | Gap |
|------------|-------------|---------|-----|
| Mobile | < 640px | 2 | 12px |
| Tablet | 640px - 1024px | 3 | 16px |
| Desktop | > 1024px | 4 | 20px |

### Expected Outcome
- Functional ProductGrid component
- Responsive grid layout with proper columns
- Empty state handling
- Loading state with skeletons
- Products mapped to ProductCard components

### Verification Checklist
- [ ] ProductGrid.tsx file created
- [ ] Component accepts products array
- [ ] Responsive grid layout implemented
- [ ] Empty state displays properly
- [ ] Loading skeletons render correctly
- [ ] Products render in grid format

---

## Task 18: Create Grid Layout Config

### Overview
Create a configuration file that defines responsive grid layout settings including column counts, gap spacing, and breakpoints. This ensures consistent grid behavior across the application and makes it easy to adjust grid settings from a central location.

### Dependencies
- Task 17: Create Product Grid Component

### Instructions

1. **Create GridConfig.ts file**
   - Navigate to `ProductGrid` directory
   - Create new file named `GridConfig.ts`
   - This file exports grid configuration constants

2. **Define breakpoint constants**
   - Create constants for responsive breakpoints
   - Define mobile, tablet, desktop breakpoint values
   - Match Tailwind's default breakpoint system
   - Use standard pixel values (640, 768, 1024, 1280)

3. **Define grid column configuration**
   - Create configuration object for grid columns
   - Define columns for each breakpoint
   - Mobile: 2 columns
   - Tablet: 3 columns
   - Desktop: 4 columns

4. **Define gap spacing configuration**
   - Create configuration for grid gap spacing
   - Define gap for each breakpoint
   - Mobile: 12px (0.75rem)
   - Tablet: 16px (1rem)
   - Desktop: 20px (1.25rem)

5. **Create Tailwind class helper**
   - Create function to generate Tailwind grid classes
   - Accept breakpoint and column count parameters
   - Return appropriate Tailwind class string
   - Support dynamic column configuration

6. **Export configuration objects**
   - Export breakpoint constants
   - Export grid columns configuration
   - Export gap spacing configuration
   - Export helper functions

7. **Add TypeScript types**
   - Define types for breakpoint values
   - Define interface for grid configuration
   - Define types for helper function parameters
   - Ensure type safety

### Configuration Structure

| Setting | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Breakpoint | < 640px | 640px - 1024px | > 1024px |
| Columns | 2 | 3 | 4 |
| Gap | 12px | 16px | 20px |
| Class | grid-cols-2 | sm:grid-cols-3 | lg:grid-cols-4 |

### Tailwind Grid Classes

```
Base:     grid grid-cols-2 gap-3
Tablet:   sm:grid-cols-3 sm:gap-4
Desktop:  lg:grid-cols-4 lg:gap-5
```

### Grid Calculation Examples

| Viewport | Columns | Gap | Card Width (1280px) |
|----------|---------|-----|---------------------|
| 320px | 2 | 12px | 154px |
| 768px | 3 | 16px | 240px |
| 1280px | 4 | 20px | 300px |

### Expected Outcome
- Grid configuration file created
- Responsive breakpoints defined
- Column counts configured per breakpoint
- Gap spacing configured per breakpoint
- Helper functions for Tailwind classes
- TypeScript types defined

### Verification Checklist
- [ ] GridConfig.ts file created
- [ ] Breakpoint constants defined
- [ ] Column configuration exported
- [ ] Gap spacing configuration exported
- [ ] Helper functions implemented
- [ ] TypeScript types added

---

## Task 19: Create Product Card Component

### Overview
Create the ProductCard component that displays individual product information in a card format. This component serves as the main container for product image, details, pricing, and actions. It's designed to be reusable across product grids, sliders, and related product sections.

### Dependencies
- Task 17: Create Product Grid Component
- Product types defined

### Instructions

1. **Create ProductCard.tsx file**
   - Navigate to `ProductGrid` directory
   - Create new file named `ProductCard.tsx`
   - This is the main product card component

2. **Define ProductCard props interface**
   - Create interface for component props
   - Include product object of Product type
   - Include optional onAddToCart callback
   - Include optional onQuickView callback
   - Include optional showQuickActions boolean

3. **Import required dependencies**
   - Import React and necessary hooks
   - Import child components (CardImage, CardContent, etc.)
   - Import icons from icon library
   - Import Tailwind utilities

4. **Create card container structure**
   - Create main article element with card styling
   - Apply border and shadow styling
   - Add hover effects for interactivity
   - Ensure proper spacing and padding

5. **Integrate card sections**
   - Add CardImage section at top (Task 20)
   - Add CardContent section below image (Task 25)
   - Add CardAddToCart button at bottom (Task 33)
   - Maintain proper spacing between sections

6. **Add accessibility attributes**
   - Use semantic HTML elements (article, heading)
   - Add ARIA labels for interactive elements
   - Ensure keyboard navigation support
   - Include focus states for all interactive elements

7. **Implement hover state**
   - Add hover effect to entire card
   - Elevate card on hover with shadow
   - Trigger image hover effects
   - Show/hide quick action buttons

8. **Handle card click behavior**
   - Make card clickable to product detail page
   - Use Next.js Link for navigation
   - Prevent click propagation on action buttons
   - Maintain proper cursor states

### Card Structure

```
┌─────────────────────────┐
│ ┌─────────────────────┐ │
│ │                     │ │
│ │   Product Image     │ │  ← CardImage (Task 20)
│ │   with Badge &      │ │
│ │   Quick Actions     │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Category                │  ← CardCategory (Task 26)
│ Product Title           │  ← CardTitle (Task 27)
│ ★★★★☆ (123)           │  ← CardRating (Task 28)
│                         │
│ ₨ 2,500.00             │  ← CardPrice (Task 29)
│ ~~₨ 3,000~~ -17%       │
│                         │
│ ┌─────────────────────┐ │
│ │   Add to Cart       │ │  ← CardAddToCart (Task 33)
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| product | Product | Yes | Product data object |
| onAddToCart | function | No | Add to cart callback |
| onQuickView | function | No | Quick view callback |
| showQuickActions | boolean | No | Show wishlist/compare |

### Card States

| State | Visual Change | Behavior |
|-------|---------------|----------|
| Default | Normal appearance | Static display |
| Hover | Elevated shadow | Show quick actions |
| Focus | Outline border | Keyboard accessible |
| Loading | Skeleton display | Show loading state |

### Expected Outcome
- Functional ProductCard component
- Proper card structure with sections
- Hover effects implemented
- Accessibility attributes added
- Click navigation working
- Clean, professional appearance

### Verification Checklist
- [ ] ProductCard.tsx file created
- [ ] Component accepts product prop
- [ ] Card sections integrated properly
- [ ] Hover effects working
- [ ] Accessibility attributes added
- [ ] Navigation to product page works
- [ ] Responsive on all screen sizes

---

## Task 20: Create Card Image Section

### Overview
Create the CardImage section component that displays the product image with overlay elements including badges (Sale, New, Out of Stock), quick action buttons (wishlist, quick view), and secondary image hover effect. This section is the visual focal point of the product card.

### Dependencies
- Task 19: Create Product Card Component

### Instructions

1. **Create CardImage.tsx file**
   - Navigate to `ProductGrid` directory
   - Create new file named `CardImage.tsx`
   - This component handles the image section of the card

2. **Define CardImage props interface**
   - Create interface for component props
   - Include primary image URL and alt text
   - Include optional secondary image URL
   - Include badges array (sale, new, out of stock)
   - Include product URL for linking

3. **Import required dependencies**
   - Import Next.js Image component
   - Import Next.js Link component
   - Import CardBadge component (Task 23)
   - Import CardQuickActions component (Task 24)
   - Import motion from framer-motion for animations

4. **Create image container structure**
   - Create container div with relative positioning
   - Set aspect ratio (1:1 or 3:4 for product cards)
   - Apply overflow hidden for image effects
   - Add rounded corners for card style

5. **Implement primary image display**
   - Render Next.js Image component
   - Set proper fill and object-fit properties
   - Add loading priority for above-fold images
   - Include proper alt text for accessibility

6. **Add Link wrapper**
   - Wrap image in Next.js Link component
   - Link to product detail page
   - Prevent default click on quick actions
   - Maintain proper click zones

7. **Position badge overlay**
   - Add CardBadge component to top-left corner
   - Use absolute positioning
   - Ensure badge is above image layer
   - Pass badge data from props

8. **Position quick actions overlay**
   - Add CardQuickActions component to top-right corner
   - Use absolute positioning with transition
   - Hide by default, show on parent hover
   - Ensure proper z-index layering

### Image Section Structure

```
┌─────────────────────────────┐
│ [Sale -20%]        [♡][👁] │  ← Badge (left) & Quick Actions (right)
│                             │
│                             │
│      Product Image          │  ← Next.js Image with lazy loading
│      (Primary/Secondary)    │
│                             │
│                             │
└─────────────────────────────┘
     ↑                    ↑
   Hover: Show          Absolute
   Secondary Image      Positioned
```

### Image Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Aspect Ratio | 1:1 or 3:4 | Consistent card size |
| Loading | lazy | Performance optimization |
| Object Fit | cover | Fill container properly |
| Quality | 80 | Balance quality and size |

### Overlay Elements

| Element | Position | Show On | Z-Index |
|---------|----------|---------|---------|
| Badge | Top-left | Always | 20 |
| Quick Actions | Top-right | Hover | 20 |
| Secondary Image | Full | Hover | 10 |

### Expected Outcome
- CardImage section component created
- Primary image displays with lazy loading
- Badge overlays positioned correctly
- Quick actions show on hover
- Proper aspect ratio maintained
- Link to product detail page works

### Verification Checklist
- [ ] CardImage.tsx file created
- [ ] Next.js Image component used
- [ ] Link wrapper implemented
- [ ] Badge positioned top-left
- [ ] Quick actions positioned top-right
- [ ] Hover states working
- [ ] Aspect ratio maintained

---

## Task 21: Create Card Image Component

### Overview
Create the core image rendering component with Next.js Image optimization, lazy loading, and proper responsive image handling. This component handles the actual image display with performance optimizations and fallback behavior for missing images.

### Dependencies
- Task 20: Create Card Image Section

### Instructions

1. **Implement Next.js Image component usage**
   - Use Next.js Image component for optimization
   - Configure proper sizes attribute for responsive images
   - Set quality to 80 for balance of quality and size
   - Enable lazy loading for performance

2. **Configure image sizing**
   - Set fill property for container-based sizing
   - Configure object-fit to "cover" for proper cropping
   - Ensure images fill container without distortion
   - Handle various image aspect ratios

3. **Add responsive image configuration**
   - Define sizes attribute for different breakpoints
   - Mobile: 50vw (2 columns)
   - Tablet: 33vw (3 columns)
   - Desktop: 25vw (4 columns)
   - Optimize for actual render size

4. **Implement image loading states**
   - Add blur placeholder while loading
   - Use blurDataURL for preview
   - Show loading skeleton during fetch
   - Transition smoothly when loaded

5. **Add fallback image handling**
   - Detect image load errors
   - Replace with placeholder image
   - Use onError handler
   - Maintain proper alt text

6. **Set priority for above-fold images**
   - Accept priority prop from parent
   - Set priority for first row of products
   - Disable lazy loading for priority images
   - Optimize LCP (Largest Contentful Paint)

7. **Add accessibility attributes**
   - Include descriptive alt text
   - Use product name in alt attribute
   - Add loading attribute
   - Ensure screen reader compatibility

### Image Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Component | next/image | Automatic optimization |
| Fill | true | Container-based sizing |
| Object Fit | cover | Fill without distortion |
| Quality | 80 | Balance size and quality |
| Loading | lazy | Performance (except priority) |

### Responsive Sizes

```
Mobile:    (max-width: 640px) 50vw      → ~160px
Tablet:    (max-width: 1024px) 33vw     → ~256px
Desktop:   (min-width: 1025px) 25vw     → ~320px
```

### Loading States

| State | Display | Duration |
|-------|---------|----------|
| Loading | Blur placeholder | Until loaded |
| Error | Fallback image | Permanent |
| Loaded | Full image | Permanent |

### Expected Outcome
- Image component with Next.js optimization
- Lazy loading enabled for performance
- Responsive image sizing configured
- Fallback handling for errors
- Smooth loading transitions
- Proper accessibility attributes

### Verification Checklist
- [ ] Next.js Image component implemented
- [ ] Lazy loading working
- [ ] Responsive sizes configured
- [ ] Fallback image displays on error
- [ ] Loading placeholder shows
- [ ] Priority images load immediately
- [ ] Alt text properly set

---

## Task 22: Create Card Image Hover

### Overview
Create hover effect that displays a secondary product image when users hover over the card. This interactive feature provides a quick preview of the product from different angles, enhancing the shopping experience without requiring navigation to the product detail page.

### Dependencies
- Task 20: Create Card Image Section
- Task 21: Create Card Image Component

### Instructions

1. **Add hover state management**
   - Use React useState to track hover state
   - Set initial state to false (showing primary image)
   - Toggle state on mouse enter and leave events
   - Ensure smooth state transitions

2. **Implement secondary image component**
   - Duplicate primary image structure for secondary
   - Position secondary image absolutely over primary
   - Initially hide with opacity 0
   - Use same Next.js Image configuration

3. **Add mouse event handlers**
   - Add onMouseEnter event to container
   - Add onMouseLeave event to container
   - Update hover state on events
   - Handle touch devices appropriately

4. **Create fade transition effect**
   - Use CSS transitions or Framer Motion
   - Transition opacity from 0 to 1 on hover
   - Set transition duration to 300ms
   - Use ease-in-out timing function

5. **Handle missing secondary image**
   - Check if secondary image URL exists
   - Only enable hover if secondary image available
   - Fallback to showing only primary image
   - Avoid unnecessary hover effects

6. **Optimize image loading**
   - Preload secondary image on card hover
   - Use Image component's onLoadingComplete
   - Ensure smooth transition (no delay)
   - Handle loading errors gracefully

7. **Add touch device support**
   - Detect touch capability
   - Disable hover effect on touch devices
   - Alternative: toggle on tap for mobile
   - Ensure consistent experience

### Hover Effect Structure

```
Default State:              Hover State:
┌─────────────┐            ┌─────────────┐
│             │            │             │
│  Primary    │   Hover    │  Secondary  │
│  Image      │   ───→     │  Image      │
│  (Visible)  │            │  (Visible)  │
│             │            │             │
└─────────────┘            └─────────────┘
  opacity: 1                opacity: 1
                          (Primary opacity: 0)
```

### Transition Timing

| Event | Action | Duration | Effect |
|-------|--------|----------|--------|
| Mouse Enter | Show secondary | 300ms | Fade in |
| Mouse Leave | Show primary | 300ms | Fade out |
| Image Load | Display image | 0ms | Instant |

### Image Layers

```
Z-Index Stack (during hover):
┌─────────────────────┐
│ Quick Actions (30)  │  ← Top layer
├─────────────────────┤
│ Badge (20)          │
├─────────────────────┤
│ Secondary Image (2) │  ← Fades in on hover
├─────────────────────┤
│ Primary Image (1)   │  ← Fades out on hover
└─────────────────────┘
```

### Expected Outcome
- Smooth hover transition between images
- Secondary image displays on hover
- Primary image fades out seamlessly
- Works consistently across browsers
- Touch devices handled appropriately
- No layout shift during transition

### Verification Checklist
- [ ] Hover state management implemented
- [ ] Secondary image renders on hover
- [ ] Smooth fade transition working
- [ ] Primary image fades out correctly
- [ ] Missing secondary image handled
- [ ] Touch devices supported
- [ ] No performance issues

---

## Task 23: Create Card Badge

### Overview
Create badge component that displays product status indicators such as "Sale", "New", or "Out of Stock". Badges appear as colored labels in the top-left corner of the product image, providing immediate visual cues about product availability and promotional status.

### Dependencies
- Task 20: Create Card Image Section

### Instructions

1. **Create CardBadge.tsx file**
   - Navigate to `ProductGrid` directory
   - Create new file named `CardBadge.tsx`
   - This component renders status badges

2. **Define CardBadge props interface**
   - Create interface for component props
   - Include badge type (sale, new, out-of-stock)
   - Include optional discount percentage for sale badge
   - Include optional custom text

3. **Import required dependencies**
   - Import React and types
   - Import classnames utility for conditional classes
   - Import Tailwind utilities

4. **Create badge container structure**
   - Create span or div element for badge
   - Apply absolute positioning for overlay
   - Position in top-left corner (8px from edges)
   - Add proper z-index for visibility

5. **Define badge type configurations**
   - Create configuration object for badge types
   - Sale: Red background, white text, show discount %
   - New: Green background, white text
   - Out of Stock: Gray background, white text
   - Map badge types to styling

6. **Implement badge styling**
   - Add rounded corners (4px or 6px)
   - Apply padding (4px horizontal, 2px vertical)
   - Set font size to small (12px)
   - Use font weight medium or semibold
   - Add subtle shadow for depth

7. **Add conditional rendering**
   - Only render if badge type is provided
   - Show discount percentage for sale badges
   - Format percentage with minus sign
   - Handle multiple badges if needed

8. **Create badge text formatting**
   - Sale: "-20% OFF" or "-20%"
   - New: "NEW"
   - Out of Stock: "OUT OF STOCK"
   - Ensure uppercase text
   - Keep concise for small space

### Badge Styles

| Badge Type | Background | Text Color | Text Content |
|------------|------------|------------|--------------|
| Sale | Red (#EF4444) | White | -20% or -20% OFF |
| New | Green (#10B981) | White | NEW |
| Out of Stock | Gray (#6B7280) | White | OUT OF STOCK |

### Badge Position

```
┌─────────────────────────────┐
│ ┏━━━━━━━┓                   │
│ ┃-20% OFF┃                   │  ← Badge in top-left
│ ┗━━━━━━━┛                   │     (8px from edges)
│                             │
│      Product Image          │
│                             │
│                             │
└─────────────────────────────┘
```

### Badge Sizing

| Property | Value | Purpose |
|----------|-------|---------|
| Font Size | 12px (0.75rem) | Readable but compact |
| Padding X | 8px (0.5rem) | Horizontal spacing |
| Padding Y | 4px (0.25rem) | Vertical spacing |
| Border Radius | 4px (0.25rem) | Rounded corners |

### Expected Outcome
- CardBadge component created
- Different badge types supported
- Correct colors for each type
- Positioned in top-left corner
- Discount percentage displays for sale
- Clean, professional appearance

### Verification Checklist
- [ ] CardBadge.tsx file created
- [ ] Component accepts badge type prop
- [ ] Sale badge shows discount percentage
- [ ] New badge displays correctly
- [ ] Out of stock badge displays correctly
- [ ] Positioned in top-left corner
- [ ] Colors match design specifications
- [ ] Text is uppercase and readable

---

## Task 24: Create Card Quick Actions

### Overview
Create quick action buttons component that displays interactive icons for wishlist, quick view, and compare actions. These buttons appear on hover in the top-right corner of the product image, allowing users to take quick actions without navigating to the product detail page.

### Dependencies
- Task 20: Create Card Image Section

### Instructions

1. **Create CardQuickActions.tsx file**
   - Navigate to `ProductGrid` directory
   - Create new file named `CardQuickActions.tsx`
   - This component renders action buttons

2. **Define CardQuickActions props interface**
   - Create interface for component props
   - Include product ID
   - Include onWishlistClick callback
   - Include onQuickViewClick callback
   - Include onCompareClick callback
   - Include optional isInWishlist boolean

3. **Import required dependencies**
   - Import React and hooks (useState)
   - Import icon components (Heart, Eye, Layers)
   - Import Tailwind utilities
   - Import framer-motion for animations

4. **Create actions container structure**
   - Create container div with vertical flex layout
   - Position absolutely in top-right corner
   - Add gap between action buttons
   - Initially hidden, show on parent card hover

5. **Create individual action buttons**
   - Wishlist button with Heart icon
   - Quick view button with Eye icon
   - Compare button with Layers icon
   - Each button is a circular icon button

6. **Implement button styling**
   - Circular shape (equal width and height)
   - White background with subtle shadow
   - Dark icon color
   - Hover effect: primary color background
   - Transition: smooth color changes

7. **Add hover animations**
   - Scale effect on button hover
   - Stagger animation for button group
   - Slide in from right on parent hover
   - Fade and slide out when hover ends

8. **Handle wishlist toggle state**
   - Track if product is in wishlist
   - Fill heart icon when in wishlist
   - Change icon color when active
   - Toggle on click

9. **Implement click handlers**
   - Call appropriate callback on button click
   - Stop event propagation to prevent card click
   - Handle loading states during actions
   - Show feedback on successful action

### Quick Actions Layout

```
┌─────────────────────────────┐
│                    ┏━━━┓    │
│                    ┃ ♡ ┃    │  ← Wishlist
│                    ┗━━━┛    │
│                    ┏━━━┓    │
│                    ┃ 👁 ┃    │  ← Quick View
│                    ┗━━━┛    │
│                    ┏━━━┓    │
│                    ┃ ⧉ ┃    │  ← Compare
│                    ┗━━━┛    │
│                             │
│      Product Image          │
└─────────────────────────────┘
  ↑
Position: absolute
Top: 8px, Right: 8px
Display: On hover
```

### Action Buttons

| Action | Icon | Description | State |
|--------|------|-------------|-------|
| Wishlist | Heart | Add to wishlist | Toggle (filled/outline) |
| Quick View | Eye | Open quick view modal | Click |
| Compare | Layers | Add to compare | Click |

### Button Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Size | 36px × 36px | Touch-friendly |
| Border Radius | 50% (circle) | Consistent shape |
| Background | White (rgba) | Subtle overlay |
| Shadow | sm | Depth and visibility |
| Icon Size | 18px | Clear and visible |

### Animation Sequence

```
Card Hover → Quick Actions Appear:

Button 1 (Wishlist):   Delay 0ms,   Slide + Fade
Button 2 (Quick View): Delay 50ms,  Slide + Fade
Button 3 (Compare):    Delay 100ms, Slide + Fade

Button Hover → Scale:
Scale from 1 to 1.1 (200ms)
```

### Expected Outcome
- CardQuickActions component created
- Three action buttons rendered
- Buttons hidden by default
- Show on parent card hover with animation
- Wishlist toggle state working
- Click handlers prevent event propagation
- Hover effects on individual buttons

### Verification Checklist
- [ ] CardQuickActions.tsx file created
- [ ] All three action buttons rendered
- [ ] Positioned in top-right corner
- [ ] Hidden by default, show on hover
- [ ] Stagger animation working
- [ ] Wishlist toggle state working
- [ ] Click handlers implemented
- [ ] Event propagation stopped
- [ ] Icons display correctly

---

## Task 25: Create Card Content Section

### Overview
Create the CardContent section component that contains product information below the image including category, title, rating, and price. This section provides essential product details in a well-organized, scannable format.

### Dependencies
- Task 19: Create Product Card Component

### Instructions

1. **Create CardContent.tsx file**
   - Navigate to `ProductGrid` directory
   - Create new file named `CardContent.tsx`
   - This component wraps the content section

2. **Define CardContent props interface**
   - Create interface for component props
   - Include product object
   - Include optional compact mode boolean
   - Pass through to child components

3. **Import required dependencies**
   - Import React and types
   - Import child components (CardCategory, CardTitle, etc.)
   - Import Tailwind utilities

4. **Create content container structure**
   - Create container div with proper spacing
   - Apply padding (12px to 16px)
   - Set background color (white)
   - Add vertical spacing between elements

5. **Integrate child components in order**
   - CardCategory component (Task 26)
   - CardTitle component (Task 27)
   - CardRating component (Task 28)
   - CardPrice component (Task 29)
   - Maintain consistent spacing between elements

6. **Apply responsive spacing**
   - Adjust padding for mobile vs desktop
   - Use Tailwind responsive utilities
   - Ensure touch-friendly spacing on mobile
   - Maintain visual hierarchy

7. **Add section semantics**
   - Use semantic HTML (section or div)
   - Add proper ARIA attributes if needed
   - Ensure logical reading order

### Content Section Structure

```
┌─────────────────────────────┐
│                             │
│      [Product Image]        │
│                             │
├─────────────────────────────┤
│                             │
│ Electronics                 │  ← CardCategory (Task 26)
│                             │
│ Wireless Bluetooth          │  ← CardTitle (Task 27)
│ Headphones Pro              │
│                             │
│ ★★★★☆ (123 reviews)        │  ← CardRating (Task 28)
│                             │
│ ₨ 2,500.00                  │  ← CardPrice (Task 29)
│ ~~₨ 3,000~~ -17%            │
│                             │
└─────────────────────────────┘
```

### Spacing Configuration

| Element | Margin Bottom | Purpose |
|---------|---------------|---------|
| Container | 12px padding | Overall spacing |
| Category | 4px | Minimal gap |
| Title | 8px | Clear separation |
| Rating | 8px | Group with price |
| Price | 12px | Space before button |

### Content Hierarchy

```
Container (p-3 space-y-2)
  ├─ Category (text-xs text-gray-600)
  ├─ Title (text-base font-medium)
  ├─ Rating (flex items-center)
  └─ Price (text-lg font-semibold)
```

### Expected Outcome
- CardContent section component created
- All child components integrated
- Proper spacing between elements
- Clean visual hierarchy
- Responsive padding
- Semantic HTML structure

### Verification Checklist
- [ ] CardContent.tsx file created
- [ ] Component accepts product prop
- [ ] All child components imported
- [ ] Elements render in correct order
- [ ] Spacing looks consistent
- [ ] Responsive on all screen sizes
- [ ] Semantic HTML used

---

## Task 26: Create Card Category

### Overview
Create the CardCategory component that displays the product's category as a clickable link. This appears above the product title and helps users understand the product type while providing quick navigation to the category page.

### Dependencies
- Task 25: Create Card Content Section

### Instructions

1. **Create CardCategory.tsx file**
   - Navigate to `ProductGrid` directory
   - Create new file named `CardCategory.tsx`
   - This component renders the category link

2. **Define CardCategory props interface**
   - Create interface for component props
   - Include category name string
   - Include category slug or URL
   - Include optional onClick handler

3. **Import required dependencies**
   - Import React and types
   - Import Next.js Link component
   - Import Tailwind utilities

4. **Create category link structure**
   - Use Next.js Link component
   - Link to category page URL
   - Use category slug for URL construction
   - Format URL as `/category/[slug]`

5. **Apply category styling**
   - Use small font size (12px or 0.75rem)
   - Apply muted text color (gray-600)
   - Add hover effect (primary color)
   - Use uppercase or normal case
   - Apply font weight (medium or normal)

6. **Handle click behavior**
   - Prevent event propagation to card
   - Navigate to category page
   - Optional: Call onClick callback
   - Track category click analytics

7. **Add accessibility attributes**
   - Include proper link semantics
   - Add descriptive aria-label if needed
   - Ensure keyboard navigation
   - Add focus styles

### Category Display

```
┌─────────────────────────────┐
│ Electronics                 │  ← Category link
│                             │     (small, muted color)
│ Wireless Bluetooth          │
│ Headphones Pro              │
└─────────────────────────────┘
```

### Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Font Size | 12px (0.75rem) | Small, secondary info |
| Font Weight | 500 (medium) | Readable but subtle |
| Color | Gray-600 | Muted, non-dominant |
| Hover Color | Primary brand color | Interactive feedback |
| Text Transform | None or Uppercase | Brand preference |

### URL Structure

| Category | Slug | URL |
|----------|------|-----|
| Electronics | electronics | /category/electronics |
| Clothing | clothing | /category/clothing |
| Home & Living | home-living | /category/home-living |

### Expected Outcome
- CardCategory component created
- Category name displays correctly
- Links to category page
- Hover effect working
- Click doesn't trigger card navigation
- Proper text styling applied

### Verification Checklist
- [ ] CardCategory.tsx file created
- [ ] Component accepts category props
- [ ] Next.js Link component used
- [ ] Correct URL format
- [ ] Styling matches design
- [ ] Hover effect working
- [ ] Click propagation stopped
- [ ] Accessible to keyboard users

---

## Task 27: Create Card Title

### Overview
Create the CardTitle component that displays the product name as a clickable heading. This is the primary identifier for the product and provides navigation to the product detail page. The title is truncated to 2 lines to maintain consistent card heights.

### Dependencies
- Task 25: Create Card Content Section

### Instructions

1. **Create CardTitle.tsx file**
   - Navigate to `ProductGrid` directory
   - Create new file named `CardTitle.tsx`
   - This component renders the product title

2. **Define CardTitle props interface**
   - Create interface for component props
   - Include product title string
   - Include product URL or slug
   - Include optional truncation line count

3. **Import required dependencies**
   - Import React and types
   - Import Next.js Link component
   - Import Tailwind utilities

4. **Create title link structure**
   - Wrap title in Next.js Link component
   - Use h3 or h4 heading element
   - Link to product detail page
   - Format URL as `/product/[slug]`

5. **Apply title styling**
   - Use medium font size (16px or 1rem)
   - Apply semibold font weight (600)
   - Use dark text color (gray-900)
   - Add line height for readability (1.5)

6. **Implement text truncation**
   - Apply line-clamp utility (2 lines)
   - Use overflow-hidden
   - Add text-ellipsis for overflow indication
   - Ensure consistent card height

7. **Add hover effect**
   - Change color to primary on hover
   - Add smooth transition (200ms)
   - Maintain proper cursor (pointer)
   - Provide visual feedback

8. **Handle accessibility**
   - Use semantic heading element
   - Ensure proper heading level
   - Add focus states for keyboard
   - Maintain readable contrast

### Title Display

```
┌─────────────────────────────┐
│ Electronics                 │
│                             │
│ Wireless Bluetooth          │  ← Product Title (H3)
│ Headphones with Active      │     (2 lines max, truncated)
│                             │
│ ★★★★☆ (123)                │
└─────────────────────────────┘
```

### Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Element | h3 or h4 | Semantic heading |
| Font Size | 16px (1rem) | Readable size |
| Font Weight | 600 (semibold) | Emphasize title |
| Color | Gray-900 | High contrast |
| Hover Color | Primary brand | Interactive feedback |
| Line Clamp | 2 lines | Consistent height |
| Line Height | 1.5 | Readability |

### Text Truncation

```
Full Title:
"Wireless Bluetooth Headphones with Active Noise Cancellation and Premium Sound Quality"

Truncated (2 lines):
"Wireless Bluetooth Headphones with Active
Noise Cancellation and..."
```

### Expected Outcome
- CardTitle component created
- Product title displays correctly
- Links to product detail page
- Text truncated to 2 lines
- Hover effect working
- Semantic heading element used
- Accessible and keyboard navigable

### Verification Checklist
- [ ] CardTitle.tsx file created
- [ ] Component accepts title and URL props
- [ ] Next.js Link component used
- [ ] Semantic heading element used
- [ ] Correct URL format
- [ ] Text truncated to 2 lines
- [ ] Hover effect working
- [ ] Color and font weight correct
- [ ] Focus states visible

---

## Expected Outcome for All Tasks 17-27

At the completion of these tasks, you will have:

1. **Product Grid System** - Responsive grid component with configurable columns
2. **Grid Configuration** - Centralized config for breakpoints, columns, and gaps
3. **Product Card Structure** - Complete card component with all sections
4. **Image Section** - Feature-rich image display with overlays
5. **Image Component** - Optimized Next.js images with lazy loading
6. **Image Hover Effect** - Secondary image reveal on hover
7. **Badge Component** - Status indicators (Sale, New, Out of Stock)
8. **Quick Actions** - Interactive buttons for wishlist, quick view, compare
9. **Content Section** - Organized product information container
10. **Category Link** - Clickable category navigation
11. **Product Title** - Truncated, linked product heading

### Files Created

```
frontend/components/storefront/catalog/ProductGrid/
├── ProductGrid.tsx            (Task 17)
├── GridConfig.ts             (Task 18)
├── ProductCard.tsx           (Task 19)
├── CardImage.tsx             (Task 20, 21, 22)
├── CardBadge.tsx             (Task 23)
├── CardQuickActions.tsx      (Task 24)
├── CardContent.tsx           (Task 25)
├── CardCategory.tsx          (Task 26)
└── CardTitle.tsx             (Task 27)
```

### Visual Result

Users will see a professional, responsive product grid with interactive cards featuring:
- Optimized images with hover effects
- Status badges and quick action buttons
- Category and title navigation
- Consistent spacing and layout
- Smooth animations and transitions

---

## Notes

- Continue to Document 02 for Tasks 28-36 (Rating, Price, Cart, Skeleton)
- All components use TypeScript for type safety
- All components follow Next.js 14 App Router patterns
- All components use Tailwind CSS for styling
- No actual code implementation in this document - only instructions
