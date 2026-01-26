# Tasks 35-44: Product Info Container, Rating & Price Display

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** C - Product Information  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-B_Image-Gallery](../Group-B_Image-Gallery/)
- **→ Next Document:** [02_Tasks-45-52_Description-Stock-Share.md](02_Tasks-45-52_Description-Stock-Share.md)

---

## Document Overview

This document covers implementation of the product information container, product title and SKU display, rating summary with star visualization, and comprehensive price display including original price, discount badges, and tax information. All pricing uses Sri Lankan Rupees (LKR) with the ₨ symbol.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create Product Info Container | Low | 25 min |
| 36 | Create Product Title | Low | 20 min |
| 37 | Create Product SKU | Low | 15 min |
| 38 | Create Rating Summary | Low | 25 min |
| 39 | Create Star Rating Display | Low | 30 min |
| 40 | Create Review Count Link | Low | 15 min |
| 41 | Create Price Display | Medium | 35 min |
| 42 | Create Original Price | Low | 15 min |
| 43 | Create Discount Badge | Low | 20 min |
| 44 | Create Tax Info | Low | 10 min |

---

## Task 35: Create Product Info Container

### Overview
Build the main container component that houses all product information elements on the right side of the gallery. This container manages layout structure, responsive behavior, and coordinates child components for title, rating, price, description, stock, and actions.

### Dependencies
- Group-A completed (Product page structure)
- Group-B completed (Gallery implemented)
- Product data types defined
- Responsive layout system configured

### Instructions

1. **Create info container component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `ProductInfo.tsx` file
   - Set up component with TypeScript interfaces

2. **Define TypeScript interfaces**
   - Create `ProductInfoProps` interface with product object
   - Include product name, SKU, price, rating, stock status
   - Add optional variant data
   - Include loading state props

3. **Implement container structure**
   - Use semantic HTML (section or article element)
   - Add proper ARIA labels for accessibility
   - Implement vertical stack layout
   - Apply consistent spacing between sections

4. **Create section organization**
   - Header section (title, SKU)
   - Rating section (stars, reviews)
   - Pricing section (current, original, discount, tax)
   - Description section
   - Stock and delivery section
   - Variant selection section (Group D)
   - Action buttons section (Group D)
   - Share section

5. **Implement responsive behavior**
   - Desktop: Right column beside gallery, fixed width
   - Tablet: Below gallery, full width with padding
   - Mobile: Full width stack, optimized spacing
   - Configure breakpoints (sm, md, lg, xl)

6. **Add conditional rendering logic**
   - Show/hide sections based on data availability
   - Handle loading states for async data
   - Display empty states gracefully
   - Manage variant-specific information

7. **Set up sticky behavior (desktop)**
   - Position sticky on desktop viewports
   - Set appropriate top offset for fixed headers
   - Limit maximum scroll distance
   - Ensure proper z-index layering

### Container Structure

```
ProductInfo Container
├── Header Section
│   ├── Product Title (Task 36)
│   └── Product SKU (Task 37)
├── Rating Section
│   ├── Star Rating Display (Task 39)
│   └── Review Count Link (Task 40)
├── Pricing Section
│   ├── Price Display (Task 41)
│   ├── Original Price (Task 42)
│   ├── Discount Badge (Task 43)
│   └── Tax Info (Task 44)
├── Description Section (Task 45)
├── Stock Section
│   ├── Stock Status (Task 46)
│   └── Low Stock Warning (Task 47)
├── Delivery Section
│   ├── Delivery Estimate (Task 48)
│   └── Free Shipping Note (Task 49)
├── Variant Section (Group D)
├── Actions Section (Group D)
└── Share Section
    ├── WhatsApp Share (Task 51)
    └── Facebook Share (Task 52)
```

### Layout Configuration

| Breakpoint | Width | Position | Padding | Gap |
|------------|-------|----------|---------|-----|
| Mobile (<640px) | 100% | Static | 16px | 16px |
| Tablet (640-1024px) | 100% | Static | 24px | 20px |
| Desktop (>1024px) | 480px | Sticky | 32px | 24px |
| Wide (>1536px) | 540px | Sticky | 32px | 28px |

### Expected Outcome
- Functional container managing product information layout
- Proper vertical spacing and organization
- Responsive behavior across all devices
- Sticky positioning on desktop viewports
- Accessibility compliant structure
- Clean component composition pattern

### Verification Checklist
- [ ] Component renders with valid product data
- [ ] All child sections display correctly
- [ ] Responsive layout works on mobile, tablet, desktop
- [ ] Sticky behavior functions on desktop
- [ ] Conditional rendering handles missing data
- [ ] ARIA labels present for accessibility
- [ ] TypeScript compiles without errors
- [ ] Visual spacing matches design system

---

## Task 36: Create Product Title

### Overview
Implement the product title component displaying the product name as a prominent heading. This component uses proper semantic HTML (H1), implements truncation for long titles, and ensures accessibility and SEO optimization.

### Dependencies
- Task 35: Product Info Container
- Product data types defined
- Typography system configured

### Instructions

1. **Create title component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `ProductTitle.tsx` file
   - Accept product title string as prop

2. **Define TypeScript interfaces**
   - Create `ProductTitleProps` interface
   - Include title string (required)
   - Add optional className for customization
   - Include loading state boolean

3. **Implement semantic HTML structure**
   - Use H1 element (primary page heading)
   - Ensure only one H1 per page
   - Add proper text hierarchy
   - Apply semantic markup for SEO

4. **Set up typography styling**
   - Font size: 24-32px (responsive)
   - Font weight: Bold (600-700)
   - Line height: 1.3-1.4
   - Color: Primary text color from theme
   - Letter spacing: Tight (-0.02em)

5. **Implement responsive sizing**
   - Mobile: 24px (1.5rem)
   - Tablet: 28px (1.75rem)
   - Desktop: 32px (2rem)
   - Use Tailwind responsive classes

6. **Add loading state**
   - Display skeleton loader when loading
   - Match dimensions of actual title
   - Shimmer animation effect
   - Smooth transition when loaded

7. **Handle long titles**
   - Set maximum lines (2-3 lines)
   - Implement ellipsis for overflow
   - Add title attribute for full text on hover
   - Ensure readability on all devices

### Typography Specifications

| Property | Mobile | Tablet | Desktop | Notes |
|----------|--------|--------|---------|-------|
| Font Size | 24px | 28px | 32px | Responsive scaling |
| Font Weight | 700 | 700 | 700 | Bold throughout |
| Line Height | 1.3 | 1.35 | 1.4 | Tighter on mobile |
| Max Lines | 2 | 3 | 3 | Prevent excessive height |
| Color | gray-900 | gray-900 | gray-900 | Primary text |

### Expected Outcome
- Prominent product title displayed as H1
- Responsive typography scaling
- Proper truncation for long titles
- Loading state with skeleton
- SEO-optimized semantic markup
- Accessible to screen readers

### Verification Checklist
- [ ] Component renders product title correctly
- [ ] H1 element used (only one on page)
- [ ] Responsive font sizes work across breakpoints
- [ ] Long titles truncate with ellipsis
- [ ] Hover shows full title if truncated
- [ ] Loading skeleton displays during data fetch
- [ ] Typography follows design system
- [ ] TypeScript types correct

---

## Task 37: Create Product SKU

### Overview
Implement the SKU (Stock Keeping Unit) display component showing the product's unique identifier. This component displays the SKU label and value with appropriate styling, handles missing SKUs gracefully, and includes copy-to-clipboard functionality.

### Dependencies
- Task 35: Product Info Container
- Task 36: Product Title (appears after)
- Product data types defined

### Instructions

1. **Create SKU component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `ProductSKU.tsx` file
   - Accept SKU string as prop

2. **Define TypeScript interfaces**
   - Create `ProductSKUProps` interface
   - Include sku string (optional)
   - Add showLabel boolean (default true)
   - Include copyable boolean (default true)

3. **Implement component structure**
   - Container div with flex layout
   - Label text ("SKU:")
   - SKU value text
   - Optional copy button icon
   - Conditional rendering if SKU missing

4. **Set up typography styling**
   - Font size: 14px (small)
   - Font weight: Normal (400)
   - Label color: Muted text (gray-500)
   - Value color: Medium text (gray-700)
   - Monospace font for SKU value

5. **Add copy-to-clipboard functionality**
   - Include copy icon button
   - Implement clipboard API
   - Show success tooltip after copy
   - Handle clipboard API not available
   - Fallback to manual selection

6. **Implement conditional rendering**
   - Hide component if no SKU provided
   - Show placeholder in admin/preview mode
   - Handle empty string vs undefined
   - Graceful degradation

7. **Add accessibility features**
   - Label element properly associated
   - Button has aria-label "Copy SKU"
   - Tooltip has role="status"
   - Keyboard accessible copy function

### SKU Display Configuration

| Element | Style | Value |
|---------|-------|-------|
| Label | "SKU:" | Gray-500, 14px, medium weight |
| Value | Actual SKU | Gray-700, 14px, mono font |
| Spacing | Gap | 8px between label and value |
| Icon | Copy icon | 16px, gray-400, hover gray-600 |

### Copy Functionality Flow

```
User Clicks Copy Icon
    ↓
Check Clipboard API Available
    ↓
├── Yes: Use navigator.clipboard.writeText()
│   ├── Success: Show "Copied!" tooltip
│   └── Error: Fall back to manual selection
│
└── No: Select text programmatically
    └── Prompt user to copy manually
```

### Expected Outcome
- Clean SKU display with label
- Copy-to-clipboard functionality
- Visual feedback on successful copy
- Graceful handling of missing SKU
- Accessible to keyboard and screen readers
- Proper styling matching design system

### Verification Checklist
- [ ] Component displays SKU correctly
- [ ] Label and value properly styled
- [ ] Copy button icon visible and styled
- [ ] Click copy button copies SKU to clipboard
- [ ] Success tooltip shows after copying
- [ ] Component hidden if no SKU provided
- [ ] Keyboard navigation works
- [ ] Accessibility attributes present
- [ ] TypeScript types correct

---

## Task 38: Create Rating Summary

### Overview
Build the rating summary container that displays product rating information including star visualization and review count. This component orchestrates the star rating display and review count link, providing a comprehensive rating overview.

### Dependencies
- Task 35: Product Info Container
- Task 37: Product SKU (appears after)
- Rating data types defined

### Instructions

1. **Create rating summary component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `RatingSummary.tsx` file
   - Accept rating and review count props

2. **Define TypeScript interfaces**
   - Create `RatingSummaryProps` interface
   - Include averageRating number (0-5)
   - Include reviewCount number
   - Add optional showReviews boolean
   - Include loading state

3. **Implement container structure**
   - Flex container for horizontal layout
   - Star rating display on left
   - Review count link on right
   - Appropriate gap spacing
   - Mobile-responsive stacking option

4. **Set up layout composition**
   - Import StarRating component (Task 39)
   - Import ReviewCountLink component (Task 40)
   - Pass rating to StarRating
   - Pass count to ReviewCountLink
   - Handle missing rating data

5. **Add conditional rendering**
   - Show when rating exists
   - Hide if no ratings yet
   - Display "No reviews yet" placeholder
   - Handle zero reviews case

6. **Implement loading state**
   - Skeleton loader for both star and count
   - Maintain layout structure while loading
   - Smooth transition to loaded state
   - Match dimensions of loaded components

7. **Add accessibility features**
   - Semantic container element
   - ARIA label describing rating
   - Screen reader text for rating value
   - Keyboard navigable review link

### Rating Summary Layout

```
Rating Summary Container
├── Star Rating Display (Task 39)
│   └── 5 stars with fill based on rating
│
├── Rating Value Text (optional)
│   └── "4.5" displayed next to stars
│
└── Review Count Link (Task 40)
    └── "(123 reviews)" clickable link
```

### Component Configuration

| Element | Layout | Spacing | Responsive |
|---------|--------|---------|------------|
| Container | Flex row | gap-2 | Stack on mobile if needed |
| Stars | Inline | 4px gap | Always horizontal |
| Rating Value | Text | ml-2 | Optional display |
| Review Count | Link | ml-3 | Always visible |

### Rating Data States

| State | Display Behavior |
|-------|------------------|
| No ratings | "No reviews yet" text |
| 1-10 reviews | Stars + count, note "Limited reviews" |
| 10+ reviews | Standard display |
| Loading | Skeleton placeholders |
| Error | Hide component gracefully |

### Expected Outcome
- Functional rating summary displaying stars and count
- Proper horizontal layout with spacing
- Conditional rendering for no-rating state
- Loading skeleton during data fetch
- Accessible to screen readers
- Click review count scrolls to reviews section

### Verification Checklist
- [ ] Component renders rating and count
- [ ] Star rating displays correctly (Task 39)
- [ ] Review count link functional (Task 40)
- [ ] Layout horizontal with proper spacing
- [ ] No ratings state shows placeholder
- [ ] Loading skeleton displays during fetch
- [ ] Accessibility attributes present
- [ ] TypeScript types correct
- [ ] Responsive behavior works

---

## Task 39: Create Star Rating Display

### Overview
Implement the visual star rating component that displays filled, half-filled, and empty stars representing the product's average rating. This component supports fractional ratings, provides hover states, and ensures accessibility with ARIA attributes.

### Dependencies
- Task 38: Rating Summary Container
- Icon library configured (star icons)
- Theme colors defined

### Instructions

1. **Create star rating component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `StarRating.tsx` file
   - Accept rating value as prop

2. **Define TypeScript interfaces**
   - Create `StarRatingProps` interface
   - Include rating number (0-5, fractional allowed)
   - Add size prop (small, medium, large)
   - Include interactive boolean (default false)
   - Add color customization options

3. **Implement star rendering logic**
   - Calculate full stars (floor of rating)
   - Calculate half stars (if fraction >= 0.5)
   - Calculate empty stars (remaining to 5)
   - Create array of star states
   - Map array to render stars

4. **Create star icon components**
   - Full star: Completely filled
   - Half star: Left half filled
   - Empty star: Outline only
   - Use SVG icons or icon library
   - Implement proper icon sizing

5. **Set up color scheme**
   - Filled color: Gold/yellow (#FDB940 or theme primary)
   - Empty color: Light gray (#D1D5DB or gray-300)
   - Hover color: Slightly darker gold (if interactive)
   - Focus outline: Blue for accessibility

6. **Implement size variants**
   - Small: 16px (for compact displays)
   - Medium: 20px (default for product pages)
   - Large: 24px (for emphasis)
   - Maintain consistent spacing between stars

7. **Add accessibility features**
   - ARIA label with rating value ("Rated 4.5 out of 5 stars")
   - Role="img" for icon container
   - Screen reader only text with exact rating
   - Semantic HTML structure

8. **Implement interactive mode (optional)**
   - Hover highlights stars
   - Click sets rating (if editable)
   - Keyboard navigation support
   - Used for review submission

### Star Calculation Logic

```
Rating: 4.7
    ↓
Full Stars: floor(4.7) = 4
    ↓
Remainder: 4.7 - 4 = 0.7
    ↓
Half Star: 0.7 >= 0.5 ? Yes : No → 1 half star
    ↓
Empty Stars: 5 - 4 - 1 = 0
    ↓
Render: [Full, Full, Full, Full, Half]
```

### Size and Spacing Configuration

| Size | Star Width | Gap | Use Case |
|------|-----------|-----|----------|
| Small | 16px | 2px | Compact lists, thumbnails |
| Medium | 20px | 4px | Product detail, default |
| Large | 24px | 4px | Featured products, headers |

### Color Specifications

| State | Color | Hex | Tailwind |
|-------|-------|-----|----------|
| Filled | Gold | #FDB940 | yellow-400 |
| Empty | Light Gray | #D1D5DB | gray-300 |
| Hover | Dark Gold | #F59E0B | yellow-500 |
| Focus | Blue Outline | #3B82F6 | blue-500 |

### Expected Outcome
- Visual star rating display with proper fill
- Support for fractional ratings (half stars)
- Configurable sizes (small, medium, large)
- Accessible with ARIA labels
- Proper color scheme matching design
- Smooth rendering without flicker

### Verification Checklist
- [ ] Component renders correct number of stars
- [ ] Full, half, and empty stars display correctly
- [ ] Rating 4.5 shows 4 full + 1 half star
- [ ] Rating 3.0 shows 3 full + 2 empty
- [ ] Color scheme matches design (gold/gray)
- [ ] Size variants work (small, medium, large)
- [ ] ARIA label includes rating value
- [ ] Screen reader announces rating
- [ ] TypeScript types correct
- [ ] No console errors

---

## Task 40: Create Review Count Link

### Overview
Implement the review count link component that displays the number of product reviews and provides navigation to the reviews section. This component handles plural/singular text, implements smooth scrolling, and provides clear visual affordance as a clickable element.

### Dependencies
- Task 38: Rating Summary Container
- Task 39: Star Rating Display (appears together)
- Reviews section/tab exists (Group E)

### Instructions

1. **Create review count component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `ReviewCountLink.tsx` file
   - Accept review count as prop

2. **Define TypeScript interfaces**
   - Create `ReviewCountLinkProps` interface
   - Include reviewCount number
   - Add targetId string (scroll target)
   - Include onClick callback (optional)
   - Add loading state

3. **Implement text formatting**
   - Format count with proper pluralization
   - "1 review" vs "X reviews"
   - Use parentheses: "(25 reviews)"
   - Handle zero reviews: "(No reviews yet)"
   - Format large numbers: "1.2k reviews"

4. **Set up link/button element**
   - Use button element (for scroll action)
   - Style as text link (underline on hover)
   - Apply link color (blue or theme primary)
   - Cursor pointer on hover
   - Remove default button styling

5. **Implement scroll functionality**
   - Scroll to reviews tab/section on click
   - Use smooth scroll behavior
   - Set appropriate offset for fixed headers
   - Switch to reviews tab if using tabs
   - Focus review section after scroll

6. **Add visual styling**
   - Font size: 14px (matching SKU)
   - Color: Blue/primary (gray-600 default, blue-600 hover)
   - Text decoration: None default, underline on hover
   - Font weight: Medium (500)
   - Transition effects for hover

7. **Implement accessibility features**
   - Proper ARIA label
   - Keyboard accessible (Enter/Space)
   - Focus visible outline
   - Screen reader describes action
   - Button role with proper semantics

### Text Formatting Logic

```
reviewCount → Display Text
0 → "(No reviews yet)"
1 → "(1 review)"
2-999 → "(X reviews)"
1000-9999 → "(X.Xk reviews)"
10000+ → "(XXk reviews)"
```

### Scroll Behavior Configuration

| Aspect | Implementation |
|--------|----------------|
| Target | #reviews-section or #reviews-tab |
| Behavior | smooth |
| Block | start |
| Offset | -80px (for fixed header) |
| Tab Switch | If reviews in tabs, activate reviews tab |

### Styling Specifications

| State | Color | Text Decoration | Cursor |
|-------|-------|-----------------|--------|
| Default | gray-600 | none | pointer |
| Hover | blue-600 | underline | pointer |
| Active | blue-700 | underline | pointer |
| Focus | blue-600 | underline, outline | pointer |

### Expected Outcome
- Clickable link showing review count
- Proper text pluralization
- Smooth scroll to reviews section
- Hover effects indicating interactivity
- Keyboard accessible navigation
- Screen reader announces count and action

### Verification Checklist
- [ ] Component renders review count
- [ ] Text pluralization correct (1 review vs X reviews)
- [ ] Zero reviews shows "No reviews yet"
- [ ] Click scrolls to reviews section smoothly
- [ ] Hover shows underline decoration
- [ ] Keyboard navigation works (Enter/Space)
- [ ] Focus outline visible
- [ ] ARIA attributes present
- [ ] TypeScript types correct
- [ ] Reviews tab activates (if applicable)

---

## Task 41: Create Price Display

### Overview
Build the main price display component showing the current selling price in Sri Lankan Rupees (LKR). This component handles currency formatting, prominence styling, multiple price scenarios, and serves as the container for original price, discount badges, and tax information.

### Dependencies
- Task 35: Product Info Container
- Task 38: Rating Summary (appears after)
- Currency formatting utilities
- Price data types defined

### Instructions

1. **Create price display component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `PriceDisplay.tsx` file
   - Accept price data object as prop

2. **Define TypeScript interfaces**
   - Create `PriceDisplayProps` interface
   - Include currentPrice number (required)
   - Include originalPrice number (optional)
   - Add currency string (default "LKR")
   - Include discountPercentage number (calculated or provided)
   - Add loading state boolean

3. **Implement price container structure**
   - Main price prominently displayed
   - Original price shown if on sale (Task 42)
   - Discount badge if applicable (Task 43)
   - Tax info below prices (Task 44)
   - Flex layout for horizontal arrangement

4. **Set up currency formatting**
   - Use LKR currency symbol (₨)
   - Format with thousands separator: ₨ 2,500.00
   - Two decimal places for precision
   - Symbol position: Before amount with space
   - Use Intl.NumberFormat for formatting

5. **Implement prominent styling**
   - Font size: 28-32px (large and attention-grabbing)
   - Font weight: Bold (700)
   - Color: Primary text or accent color
   - Line height: 1.2
   - Maintain readability

6. **Handle price scenarios**
   - Regular price: Standard display
   - Sale price: Show with original crossed out
   - Price range: "₨ 1,500 - ₨ 3,500" (for variants)
   - Free: "Free" text instead of ₨ 0.00
   - Contact for price: "Contact for pricing"

7. **Add responsive sizing**
   - Mobile: 24px
   - Tablet: 28px
   - Desktop: 32px
   - Maintain proportion with other elements

8. **Implement loading state**
   - Skeleton loader matching price dimensions
   - Shimmer animation
   - Preserve layout height
   - Smooth transition when loaded

### Price Display Layout

```
Price Display Container
├── Current Price (Large, Bold)
│   └── ₨ 2,500.00
├── Original Price (if on sale) (Task 42)
│   └── ₨ 3,000.00 (strikethrough)
├── Discount Badge (if on sale) (Task 43)
│   └── -20% OFF
└── Tax Info (Task 44)
    └── "Inclusive of all taxes"
```

### Currency Formatting Configuration

| Element | Format | Example |
|---------|--------|---------|
| Symbol | ₨ | Before amount |
| Thousands Separator | , | ₨ 12,500.00 |
| Decimal Places | 2 | .00 |
| Spacing | 1 space | ₨ 2,500.00 |
| Zero Decimals | Optional | ₨ 2,500 or ₨ 2,500.00 |

### Price Scenarios

| Scenario | Display Example |
|----------|-----------------|
| Regular | ₨ 2,500.00 |
| On Sale | ~~₨ 3,000~~ ₨ 2,500 -20% OFF |
| Price Range | ₨ 1,500 - ₨ 3,500 |
| Free | Free |
| POA | Contact for Pricing |
| Out of Stock | ₨ 2,500 (Unavailable) |

### Typography Specifications

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Font Size | 24px | 28px | 32px |
| Font Weight | 700 | 700 | 700 |
| Line Height | 1.2 | 1.2 | 1.2 |
| Color | gray-900 or primary | gray-900 | gray-900 |

### Expected Outcome
- Prominent price display with LKR symbol
- Proper currency formatting with separators
- Responsive sizing across devices
- Sale price scenario with original crossed
- Loading skeleton during data fetch
- Clean layout with child components

### Verification Checklist
- [ ] Component renders current price correctly
- [ ] LKR symbol (₨) displays before amount
- [ ] Thousands separator formatting works
- [ ] Two decimal places shown
- [ ] Responsive font sizes work
- [ ] Sale price shows original crossed out
- [ ] Loading skeleton displays during fetch
- [ ] Typography matches design system
- [ ] TypeScript types correct
- [ ] No currency formatting errors

---

## Task 42: Create Original Price

### Overview
Implement the original price component that displays the pre-discount price with strikethrough styling. This component only shows when the product is on sale, provides visual context for the discount value, and enhances perceived value for customers.

### Dependencies
- Task 41: Price Display Container
- Currency formatting utilities
- Price comparison logic

### Instructions

1. **Create original price component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `OriginalPrice.tsx` file
   - Accept original price value as prop

2. **Define TypeScript interfaces**
   - Create `OriginalPriceProps` interface
   - Include originalPrice number
   - Include currentPrice number (for comparison)
   - Add currency string (default "LKR")
   - Include showOnlyIfDiscount boolean

3. **Implement conditional rendering**
   - Only show if originalPrice > currentPrice
   - Hide if prices are equal
   - Hide if no original price provided
   - Calculate and verify discount exists

4. **Set up strikethrough styling**
   - Text decoration: line-through
   - Color: Muted gray (gray-500 or gray-400)
   - Font size: Smaller than current price (16-18px)
   - Font weight: Normal or medium (400-500)
   - Opacity: Slight reduction (0.8)

5. **Implement currency formatting**
   - Use same LKR formatting as current price
   - Symbol: ₨
   - Thousands separator
   - Two decimal places optional (can show .00 or not)
   - Consistent formatting with current price

6. **Set up positioning**
   - Display inline with current price
   - Position before or after current price
   - Appropriate margin spacing (8-12px)
   - Align vertically with current price baseline

7. **Add accessibility features**
   - Screen reader text: "Original price"
   - ARIA label describing discount
   - Semantic markup
   - Don't confuse screen readers with strikethrough

### Strikethrough Styling

| Property | Value | Notes |
|----------|-------|-------|
| Text Decoration | line-through | Standard strikethrough |
| Color | gray-500 | Muted appearance |
| Font Size | 18px | Smaller than current (32px) |
| Font Weight | 400-500 | Medium weight |
| Opacity | 0.8 | Subtle de-emphasis |
| Margin Right | 12px | Space from current price |

### Display Logic

```
if (originalPrice && currentPrice) {
  if (originalPrice > currentPrice) {
    // Show original price with strikethrough
    const discount = calculateDiscount(original, current)
    return <OriginalPrice value={originalPrice} />
  } else {
    // Don't show (no discount)
    return null
  }
} else {
  // No original price data
  return null
}
```

### Position Options

| Layout Option | Visual Example |
|---------------|----------------|
| Before Current | ~~₨ 3,000~~ ₨ 2,500 |
| After Current | ₨ 2,500 ~~₨ 3,000~~ |
| Above Current (stacked) | ~~₨ 3,000~~<br>₨ 2,500 |
| Below Current (stacked) | ₨ 2,500<br>~~₨ 3,000~~ |

### Expected Outcome
- Original price with strikethrough styling
- Only visible when product on sale
- Muted appearance compared to current price
- Proper LKR currency formatting
- Appropriate spacing and alignment
- Accessible to screen readers

### Verification Checklist
- [ ] Component renders original price
- [ ] Strikethrough styling applied
- [ ] Only shows when originalPrice > currentPrice
- [ ] Hidden when prices equal or no discount
- [ ] LKR formatting correct
- [ ] Positioning and spacing proper
- [ ] Color muted (gray-500)
- [ ] Font size smaller than current price
- [ ] ARIA label present
- [ ] TypeScript types correct

---

## Task 43: Create Discount Badge

### Overview
Build the discount badge component that displays the percentage discount in a prominent, eye-catching format. This badge enhances perceived value, draws attention to sale items, and provides quick visual indication of savings.

### Dependencies
- Task 41: Price Display Container
- Task 42: Original Price (appears together)
- Badge styling system

### Instructions

1. **Create discount badge component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `DiscountBadge.tsx` file
   - Accept discount percentage as prop

2. **Define TypeScript interfaces**
   - Create `DiscountBadgeProps` interface
   - Include discountPercentage number (or calculate from prices)
   - Include originalPrice and currentPrice (for calculation)
   - Add format string (default "-XX% OFF")
   - Include variant (default, compact, prominent)

3. **Implement discount calculation**
   - Calculate: ((original - current) / original) * 100
   - Round to integer or one decimal place
   - Handle edge cases (negative, zero, > 100%)
   - Validate calculation accuracy

4. **Set up badge styling**
   - Background: Red or accent color (red-500, red-600)
   - Text: White color
   - Padding: Compact (px-2 py-1)
   - Border radius: Small rounded (4-6px)
   - Font size: 12-14px
   - Font weight: Bold (600-700)

5. **Implement text formatting**
   - Format: "-20% OFF"
   - Include minus sign
   - Include percentage symbol
   - Include "OFF" text
   - Alternative: "Save 20%"
   - Uppercase styling

6. **Set up positioning**
   - Display inline after current price
   - Vertical align: Middle or baseline
   - Margin: 8-12px from price
   - Can also be positioned as overlay on product images

7. **Add conditional rendering**
   - Only show if discount >= minimum threshold (e.g., 5%)
   - Hide for small discounts
   - Hide if no discount calculated
   - Show for valid discount scenarios only

8. **Implement animation (optional)**
   - Subtle pulse animation on load
   - Attention-grabbing entrance
   - Don't overdo animation (accessibility)
   - Can disable for reduced motion preference

### Badge Styling Configuration

| Property | Value | Tailwind Class |
|----------|-------|----------------|
| Background | Red | bg-red-600 |
| Text Color | White | text-white |
| Font Size | 12px | text-xs |
| Font Weight | Bold | font-bold |
| Padding X | 8px | px-2 |
| Padding Y | 4px | py-1 |
| Border Radius | 4px | rounded |
| Letter Spacing | Wide | tracking-wide |

### Discount Calculation

```
originalPrice = 3000
currentPrice = 2500

discount = ((3000 - 2500) / 3000) * 100
discount = (500 / 3000) * 100
discount = 0.1667 * 100
discount = 16.67%

Rounded: 17%
Display: "-17% OFF"
```

### Display Formats

| Format Option | Example | Use Case |
|---------------|---------|----------|
| Standard | -20% OFF | Default, prominent |
| Compact | -20% | Space-constrained |
| Save Format | SAVE 20% | Alternative wording |
| Amount | SAVE ₨ 500 | Show absolute value |

### Conditional Display Logic

| Discount % | Show Badge? | Reason |
|------------|-------------|--------|
| < 5% | No | Too small to highlight |
| 5-10% | Yes | Valid discount |
| 10-50% | Yes | Standard range |
| 50-75% | Yes | Large discount |
| > 75% | Yes (verify) | Unusual, may be error |

### Expected Outcome
- Prominent discount badge in red/accent color
- Percentage correctly calculated and displayed
- Only shown for valid discounts (> 5%)
- Proper formatting with minus and percentage
- Eye-catching but not distracting
- Positioned near current price

### Verification Checklist
- [ ] Component renders discount percentage
- [ ] Calculation correct: ((original - current) / original) * 100
- [ ] Badge only shows for discount >= 5%
- [ ] Red background with white text
- [ ] Format: "-20% OFF"
- [ ] Positioned after current price
- [ ] Font size and padding correct
- [ ] Accessible to screen readers
- [ ] TypeScript types correct
- [ ] No calculation errors

---

## Task 44: Create Tax Info

### Overview
Implement the tax information component that displays tax inclusion or exclusion messaging below the price. For Sri Lanka, this typically shows "Inclusive of all taxes" to clarify that the displayed price includes VAT and other applicable taxes.

### Dependencies
- Task 41: Price Display Container
- Tax configuration data
- Legal/compliance requirements

### Instructions

1. **Create tax info component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `TaxInfo.tsx` file
   - Accept tax configuration as prop

2. **Define TypeScript interfaces**
   - Create `TaxInfoProps` interface
   - Include taxIncluded boolean (default true)
   - Include customMessage string (optional)
   - Add showTaxDetails boolean
   - Include taxRate number (optional)

3. **Implement text messaging**
   - Default: "Inclusive of all taxes"
   - Alternative: "VAT included"
   - Exclusive: "Excluding taxes"
   - Custom: Use provided message
   - Localization support

4. **Set up styling**
   - Font size: Small (12-13px)
   - Color: Muted gray (gray-600 or gray-500)
   - Font weight: Normal (400)
   - Position: Below price display
   - Margin top: 4-8px

5. **Implement conditional rendering**
   - Always show by default (for clarity)
   - Hide if explicitly disabled
   - Show different message based on tax config
   - Handle multi-tax scenarios (if applicable)

6. **Add tax details (optional)**
   - Show tax breakdown on hover/click
   - Display tax rate if provided
   - Show component taxes (VAT, service tax, etc.)
   - Link to tax policy page

7. **Ensure compliance**
   - Meet legal requirements for price display
   - Accurate tax messaging
   - Clear and unambiguous wording
   - Follow local e-commerce regulations

### Tax Message Configuration

| Scenario | Message | When to Use |
|----------|---------|-------------|
| Tax Included (default) | "Inclusive of all taxes" | Standard for Sri Lanka |
| VAT Included | "Price includes VAT" | Explicit VAT mention |
| Tax Excluded | "Price excludes taxes" | B2B scenarios |
| No Tax | "No taxes applicable" | Exempt products |
| Custom | Custom message | Special cases |

### Styling Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Font Size | 12px | Small, secondary text |
| Color | gray-600 | Muted but readable |
| Font Weight | 400 | Normal weight |
| Margin Top | 8px | Space from price |
| Line Height | 1.4 | Readable spacing |

### Tax Details Display (Optional)

```
Hover/Click on Tax Info
    ↓
Show Tooltip/Modal
    ├── Price: ₨ 2,500.00
    ├── Base Price: ₨ 2,173.91
    ├── VAT (15%): ₨ 326.09
    └── Total: ₨ 2,500.00
```

### Expected Outcome
- Clear tax information displayed below price
- Standard message: "Inclusive of all taxes"
- Small, muted styling
- Always visible (unless explicitly disabled)
- Optional tax breakdown on interaction
- Compliance with local regulations

### Verification Checklist
- [ ] Component renders tax message
- [ ] Default message: "Inclusive of all taxes"
- [ ] Positioned below price display
- [ ] Font size small (12px)
- [ ] Color muted (gray-600)
- [ ] Margin spacing correct
- [ ] Always visible by default
- [ ] Accessible to screen readers
- [ ] TypeScript types correct
- [ ] Messaging clear and accurate

---

## End of Document

### Summary of Tasks Completed

This document covered 10 tasks related to product information container, rating display, and price presentation:

- ✅ Task 35: Product Info Container - Main layout structure
- ✅ Task 36: Product Title - H1 heading with truncation
- ✅ Task 37: Product SKU - SKU display with copy function
- ✅ Task 38: Rating Summary - Container for stars and count
- ✅ Task 39: Star Rating Display - 5-star visualization
- ✅ Task 40: Review Count Link - Clickable review count
- ✅ Task 41: Price Display - Main LKR price presentation
- ✅ Task 42: Original Price - Strikethrough pre-discount price
- ✅ Task 43: Discount Badge - Percentage savings badge
- ✅ Task 44: Tax Info - Tax inclusion messaging

### Next Steps

Continue to the next document to implement:
- Task 45: Short Description
- Task 46: Stock Status
- Task 47: Low Stock Warning
- Task 48: Delivery Estimate
- Task 49: Free Shipping Note
- Task 50: Share Buttons
- Task 51: WhatsApp Share
- Task 52: Facebook Share

**→ Next Document:** [02_Tasks-45-52_Description-Stock-Share.md](02_Tasks-45-52_Description-Stock-Share.md)
