# Tasks 45-52: Cards, Page, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** C - Flash Sales System  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-44_Types-Timer-Section.md](01_Tasks-35-44_Types-Timer-Section.md)

---

## Document Overview

This document covers the creation of product display components for flash sales, including the specialized product card with price displays, discount badges, and stock counters. It also details the implementation of the dedicated flash sales page with category filtering and sale end notifications. Finally, it provides comprehensive verification procedures to ensure the entire flash sales system functions correctly.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create Flash Sale ProductCard | Medium | 50 min |
| 46 | Create Sale Price Display | Low | 25 min |
| 47 | Create Discount Badge | Low | 20 min |
| 48 | Create Stock Counter | Medium | 35 min |
| 49 | Create Flash Sale Page | Medium | 60 min |
| 50 | Create Sale Category Filter | Medium | 40 min |
| 51 | Create Sale End Notification | Medium | 35 min |
| 52 | Verify Flash Sales | Low | 45 min |

---

## Task 45: Create Flash Sale ProductCard

### Overview
Create the FlashSaleProductCard component that displays products within flash sales with specialized styling and information. This card extends the standard product card with flash-sale-specific elements including countdown timer, discount badges, stock indicators, and urgent purchase prompts.

### Dependencies
- Task 44: Create Flash Sale Section

### Instructions

1. **Create flash sale product card component file**
   - Navigate to `frontend/components/marketing/flash-sales/` directory
   - Create `FlashSaleProductCard.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - product: FlashSaleProduct (required, includes sale pricing)
   - sale: FlashSale (required, sale context)
   - variant?: 'default' | 'compact' | 'featured' (display style)
   - showTimer?: boolean (show individual countdown)
   - showStock?: boolean (show stock counter)
   - showBadge?: boolean (show discount badge)
   - onAddToCart?: (product) => void (add to cart handler)
   - onQuickView?: (product) => void (quick view handler)
   - className?: string (additional styling)

3. **Implement card structure**
   - Create card container with border and shadow
   - Add product image section
   - Create content section for details
   - Add action section for buttons

4. **Add product image with overlay**
   - Use Next.js Image component
   - Apply aspect ratio (1:1 or 4:3)
   - Add hover effect (zoom or overlay)
   - Position discount badge on top-right

5. **Display product information**
   - Product name/title (2 lines max, ellipsis)
   - Product category or brand (small text)
   - Short description (optional, 1 line)
   - SKU or product code (optional)

6. **Integrate price display component**
   - Use SalePriceDisplay component (Task 46)
   - Show original and sale price
   - Display savings amount
   - Highlight deal prominence

7. **Add discount badge component**
   - Use DiscountBadge component (Task 47)
   - Position on top-right of image
   - Show percentage or "₨ OFF"
   - Apply urgent styling if ending soon

8. **Add stock counter component**
   - Use StockCounter component (Task 48)
   - Display remaining stock
   - Apply urgency styling when low
   - Hide if sufficient stock

9. **Add individual countdown timer (optional)**
   - Show mini CountdownTimer if showTimer prop
   - Display in compact format
   - Position at bottom of card
   - Use 'sm' size variant

10. **Implement add to cart button**
    - Prominent "Add to Cart" button
    - Handle click with onAddToCart callback
    - Show loading state during add
    - Display success feedback

11. **Add quick view functionality**
    - "Quick View" button or icon on hover
    - Trigger modal with product details
    - Allow adding to cart from modal
    - Display full product information

12. **Apply card styling variants**
    - Default: Standard card with all features
    - Compact: Smaller card, minimal info
    - Featured: Larger card, prominent display

13. **Implement responsive design**
    - Adjust card size for screen width
    - Stack elements appropriately on mobile
    - Maintain readability across devices

14. **Add hover effects and interactions**
    - Elevation change on hover
    - Image zoom effect
    - Button state changes
    - Smooth transitions

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| product | FlashSaleProduct | Yes | - | Product with sale pricing |
| sale | FlashSale | Yes | - | Sale context |
| variant | 'default' or 'compact' or 'featured' | No | 'default' | Display style |
| showTimer | boolean | No | false | Show countdown |
| showStock | boolean | No | true | Show stock counter |
| showBadge | boolean | No | true | Show discount badge |
| onAddToCart | (product) => void | No | - | Cart handler |
| onQuickView | (product) => void | No | - | Quick view handler |
| className | string | No | '' | Additional classes |

### Card Layout Structure

```
┌────────────────────────────────┐
│  ┌──────────────────────────┐  │ ← Image Container
│  │  [Product Image]         │  │
│  │                          │  │
│  │                  [Badge] │  │ ← Discount Badge (top-right)
│  │                          │  │
│  │  [Quick View on Hover]   │  │
│  └──────────────────────────┘  │
│                                │
│  Product Name (2 lines max)    │ ← Product Info
│  Category or Brand             │
│                                │
│  ₨2,500  ₨1,999               │ ← Price Display
│  You save ₨501                 │
│                                │
│  ⚠ Only 5 left in stock!      │ ← Stock Counter
│                                │
│  ⏱ 02:15:30 remaining          │ ← Mini Timer (optional)
│                                │
│  [ Add to Cart Button ]        │ ← Action Button
└────────────────────────────────┘
```

### Card Variant Dimensions

| Variant | Width | Height | Image Size | Font Size |
|---------|-------|--------|------------|-----------|
| Compact | 200px | 320px | 200x200 | text-sm |
| Default | 280px | 420px | 280x280 | text-base |
| Featured | 360px | 520px | 360x360 | text-lg |

### Image Overlay States

| State | Overlay | Buttons | Effect |
|-------|---------|---------|--------|
| Default | None | Hidden | Clean view |
| Hover | Dark (30%) | Visible | Interactive |
| Clicked | Dark (50%) | Loading | Feedback |

### Card Element Positioning

| Element | Position | Alignment | Spacing |
|---------|----------|-----------|---------|
| Discount Badge | Absolute top-right | Top-2 right-2 | z-10 |
| Product Name | Below image | Left | mt-3 |
| Price Display | Below name | Left | mt-2 |
| Stock Counter | Below price | Left | mt-2 |
| Timer | Below stock | Center | mt-2 |
| Add to Cart | Bottom | Full width | mt-auto |

### Hover Effect Sequence

```
User Hovers on Card
        │
        ▼
Elevation Increase (shadow-lg → shadow-xl)
        │
        ▼
Image Zoom Effect (scale-100 → scale-105)
        │
        ▼
Quick View Button Fades In (opacity-0 → opacity-100)
        │
        ▼
Cursor Changes to Pointer
```

### Add to Cart Flow

```
User Clicks "Add to Cart"
        │
        ▼
Button Shows Loading State
        │
        ▼
Call onAddToCart(product)
        │
    ┌───┴───┐
    │       │
Success    Error
    │       │
    ▼       ▼
Show ✓   Show ✗
Toast    Toast
    │       │
    └───┬───┘
        ▼
Button Returns to Normal
```

### Responsive Behavior

| Breakpoint | Card Width | Layout | Elements |
|------------|------------|--------|----------|
| < 640px | 100% (single) | Vertical stack | All visible |
| 640px - 1024px | 45% (2 cols) | Vertical stack | All visible |
| 1024px - 1280px | 23% (4 cols) | Vertical stack | All visible |
| > 1280px | 23% (4 cols) | Vertical stack | All visible |

### Urgency Indicators

| Condition | Visual Treatment |
|-----------|------------------|
| Low Stock (< 5) | Red stock counter, pulse |
| Ending Soon (< 1hr) | Red badge, urgent text |
| High Demand | "Popular" badge |
| Limited Quantity | "Limited" badge |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Alt Text | Descriptive product image alt |
| ARIA Labels | Button purposes clear |
| Keyboard Nav | Tab through interactive elements |
| Focus States | Visible focus indicators |
| Screen Readers | Announce price, stock, time |

### Expected Outcome
- Specialized product card for flash sales
- All relevant sale information displayed
- Interactive elements for cart and quick view
- Responsive and accessible design
- Urgency and scarcity communicated effectively

### Verification Checklist
- [ ] `frontend/components/marketing/flash-sales/FlashSaleProductCard.tsx` created
- [ ] Component accepts all required props
- [ ] Card structure implemented with image, info, actions
- [ ] Product image with hover effects
- [ ] Product name and details displayed
- [ ] Price display integrated (Task 46)
- [ ] Discount badge integrated (Task 47)
- [ ] Stock counter integrated (Task 48)
- [ ] Optional countdown timer integrated
- [ ] Add to cart button functional
- [ ] Quick view functionality added
- [ ] Card variants implemented
- [ ] Responsive design applied
- [ ] Hover effects working
- [ ] Accessibility features included
- [ ] Component properly typed
- [ ] Component exports correctly

---

## Task 46: Create Sale Price Display

### Overview
Create the SalePriceDisplay component that shows both original and sale prices with clear visual distinction. This component highlights the discount by striking through the original price, displaying the sale price prominently, and calculating savings, all formatted in Sri Lankan Rupees (₨).

### Dependencies
- Task 45: Create Flash Sale ProductCard

### Instructions

1. **Create sale price display component file**
   - Navigate to `frontend/components/marketing/flash-sales/` directory
   - Create `SalePriceDisplay.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - originalPrice: number (required, base price)
   - salePrice: number (required, discounted price)
   - showSavings?: boolean (display savings amount)
   - showPercentage?: boolean (display percentage saved)
   - size?: 'sm' | 'md' | 'lg' (text size variant)
   - layout?: 'horizontal' | 'vertical' (price arrangement)
   - currency?: string (default: 'LKR')
   - className?: string (additional styling)

3. **Calculate discount values**
   - Calculate savings: originalPrice - salePrice
   - Calculate percentage: (savings / originalPrice) × 100
   - Round percentage to whole number
   - Format for display

4. **Implement price formatting**
   - Format prices with thousands separator (₨2,500)
   - Add currency symbol (₨)
   - Handle decimal places (2 places for LKR)
   - Create reusable formatting function

5. **Display original price**
   - Show with strikethrough styling (line-through)
   - Apply muted color (text-gray-500)
   - Use smaller font size than sale price
   - Position based on layout prop

6. **Display sale price**
   - Show prominently in large, bold text
   - Apply accent color (text-red-600 or text-blue-600)
   - Larger font than original price
   - Include currency symbol

7. **Display savings amount (optional)**
   - Show "You save ₨XXX" text
   - Apply success color (text-green-600)
   - Use smaller font size
   - Position below prices

8. **Display discount percentage (optional)**
   - Show "Save XX%" text
   - Apply same success color
   - Can combine with savings amount
   - Show most relevant information

9. **Implement layout variants**
   - Horizontal: Original | Sale (side by side)
   - Vertical: Original above Sale (stacked)
   - Adjust spacing and alignment

10. **Implement size variants**
    - Small: Compact cards, list items
    - Medium: Standard product cards
    - Large: Featured products, hero sections

11. **Add Sri Lanka currency formatting**
    - Use ₨ symbol (Rupee sign)
    - Proper thousands separators (₨1,000,000)
    - Handle large numbers (lakhs format optional)
    - Support decimal places

12. **Apply accessibility**
    - Add ARIA labels for prices
    - Announce savings to screen readers
    - Use semantic HTML

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| originalPrice | number | Yes | - | Base product price |
| salePrice | number | Yes | - | Discounted price |
| showSavings | boolean | No | true | Display savings amount |
| showPercentage | boolean | No | false | Display percentage saved |
| size | 'sm' or 'md' or 'lg' | No | 'md' | Text size |
| layout | 'horizontal' or 'vertical' | No | 'horizontal' | Price arrangement |
| currency | string | No | 'LKR' | Currency code |
| className | string | No | '' | Additional classes |

### Price Display Layouts

**Horizontal Layout:**
```
₨2,500  ₨1,999
You save ₨501 (20% off)
```

**Vertical Layout:**
```
₨2,500
₨1,999
You save ₨501
```

### Size Variants

| Size | Original Font | Sale Font | Savings Font |
|------|---------------|-----------|--------------|
| Small | text-xs | text-sm | text-xs |
| Medium | text-sm | text-lg | text-xs |
| Large | text-base | text-2xl | text-sm |

### Color Scheme

| Element | Color | Tailwind Class | Purpose |
|---------|-------|----------------|---------|
| Original Price | Gray | text-gray-500 | Deemphasize |
| Sale Price | Red/Blue | text-red-600 | Emphasize deal |
| Savings | Green | text-green-600 | Positive feeling |
| Percentage | Green | text-green-600 | Additional emphasis |

### Price Formatting Examples

| Value | Formatted | Notes |
|-------|-----------|-------|
| 2500 | ₨2,500 | Thousands separator |
| 125000 | ₨125,000 | Multiple separators |
| 1999.99 | ₨1,999.99 | Decimal places |
| 50 | ₨50 | Small amount |
| 5000000 | ₨5,000,000 | Millions |

### Savings Display Options

| Option | Display | Use Case |
|--------|---------|----------|
| Amount Only | "You save ₨501" | Focus on absolute savings |
| Percentage Only | "Save 20%" | Focus on discount rate |
| Both | "Save ₨501 (20%)" | Complete information |
| None | Hide savings | Minimal display |

### Calculation Examples

| Original | Sale | Savings | Percentage | Formula |
|----------|------|---------|------------|---------|
| ₨2,500 | ₨1,999 | ₨501 | 20% | (501 / 2500) × 100 |
| ₨10,000 | ₨7,500 | ₨2,500 | 25% | (2500 / 10000) × 100 |
| ₨599 | ₨499 | ₨100 | 17% | (100 / 599) × 100 |

### Component Structure

```
<div className="price-display">
  <span className="original-price line-through text-gray-500">
    ₨2,500
  </span>
  <span className="sale-price text-red-600 font-bold text-lg">
    ₨1,999
  </span>
  {showSavings && (
    <div className="savings text-green-600 text-xs">
      You save ₨501 {showPercentage && "(20% off)"}
    </div>
  )}
</div>
```

### Responsive Behavior

| Breakpoint | Layout | Font Scale | Spacing |
|------------|--------|------------|---------|
| < 640px | Vertical | 0.875x | gap-1 |
| 640px - 1024px | Horizontal | 1x | gap-2 |
| > 1024px | Horizontal | 1x | gap-2 |

### Sri Lanka Lakhs Format (Optional)

| Standard | Lakhs Format | Notes |
|----------|--------------|-------|
| ₨1,000,000 | ₨10,00,000 | 10 lakhs |
| ₨250,000 | ₨2,50,000 | 2.5 lakhs |
| ₨5,000,000 | ₨50,00,000 | 50 lakhs |

### Expected Outcome
- Clear display of original and sale prices
- Visual emphasis on savings
- Proper LKR currency formatting
- Flexible layout and size options
- Accessible price information

### Verification Checklist
- [ ] `frontend/components/marketing/flash-sales/SalePriceDisplay.tsx` created
- [ ] Component accepts all required props
- [ ] Original price displayed with strikethrough
- [ ] Sale price displayed prominently
- [ ] Discount calculation correct
- [ ] Savings amount displayed (optional)
- [ ] Percentage displayed (optional)
- [ ] Currency formatting with ₨ symbol
- [ ] Thousands separator applied
- [ ] Layout variants implemented
- [ ] Size variants implemented
- [ ] Responsive behavior applied
- [ ] Accessibility features included
- [ ] Component properly typed
- [ ] Component exports correctly

---

## Task 47: Create Discount Badge

### Overview
Create the DiscountBadge component that displays the discount percentage or amount prominently on product images or cards. This badge uses eye-catching colors and positioning to immediately communicate the deal value to customers, encouraging them to explore the offer.

### Dependencies
- Task 45: Create Flash Sale ProductCard

### Instructions

1. **Create discount badge component file**
   - Navigate to `frontend/components/marketing/flash-sales/` directory
   - Create `DiscountBadge.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - discount: number (required, percentage or amount)
   - type: 'percentage' | 'amount' (discount type)
   - position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
   - variant?: 'default' | 'urgent' | 'featured' (styling intensity)
   - size?: 'sm' | 'md' | 'lg' (badge size)
   - shape?: 'rounded' | 'circle' | 'square' (badge shape)
   - animate?: boolean (pulse animation)
   - className?: string (additional styling)

3. **Calculate display text**
   - For percentage: "-20%" or "20% OFF"
   - For amount: "-₨500" or "₨500 OFF"
   - Format numbers appropriately
   - Keep text concise

4. **Implement badge container**
   - Create absolute positioned div
   - Apply z-index for overlay
   - Set dimensions based on size prop
   - Position based on position prop

5. **Apply badge styling**
   - Use vibrant colors (red, orange, or yellow)
   - Add high contrast for readability
   - Apply bold font weight
   - Set appropriate padding

6. **Implement position variants**
   - Top-left: top-2 left-2
   - Top-right: top-2 right-2 (default)
   - Bottom-left: bottom-2 left-2
   - Bottom-right: bottom-2 right-2

7. **Implement style variants**
   - Default: Red background, white text
   - Urgent: Animated red with pulse effect
   - Featured: Gradient background, shadow

8. **Implement shape variants**
   - Rounded: Rounded corners (rounded-md)
   - Circle: Full circular badge
   - Square: Sharp corners

9. **Implement size variants**
   - Small: Compact, minimal padding
   - Medium: Standard size
   - Large: Prominent, more padding

10. **Add animation (optional)**
    - Pulse animation for urgency
    - Trigger on urgent variant or animate prop
    - Subtle scale effect (scale-100 to scale-105)
    - Infinite loop

11. **Add shadow and depth**
    - Apply box shadow for elevation
    - Add text shadow for readability
    - Enhance visual prominence

12. **Handle edge cases**
    - Very small discounts (< 5%)
    - Very large discounts (> 80%)
    - Zero discount (hide badge)
    - Negative values (validation)

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| discount | number | Yes | - | Discount value |
| type | 'percentage' or 'amount' | Yes | - | Discount type |
| position | 'top-left' or 'top-right' or 'bottom-left' or 'bottom-right' | No | 'top-right' | Badge position |
| variant | 'default' or 'urgent' or 'featured' | No | 'default' | Style intensity |
| size | 'sm' or 'md' or 'lg' | No | 'md' | Badge size |
| shape | 'rounded' or 'circle' or 'square' | No | 'rounded' | Badge shape |
| animate | boolean | No | false | Pulse animation |
| className | string | No | '' | Additional classes |

### Badge Display Formats

| Discount | Type | Display |
|----------|------|---------|
| 20 | percentage | "-20%" or "20% OFF" |
| 500 | amount | "-₨500" or "₨500 OFF" |
| 15.5 | percentage | "-16%" (rounded) |
| 1250 | amount | "-₨1,250" |

### Position Examples

```
Top-Left              Top-Right
┌──────┐             ┌──────────┐
│-20% │             │      -20%│
│      │             │          │
└──────┘             └──────────┘

Bottom-Left          Bottom-Right
┌──────┐             ┌──────────┐
│      │             │          │
│-20% │             │      -20%│
└──────┘             └──────────┘
```

### Style Variants

| Variant | Background | Text | Border | Animation | Use Case |
|---------|------------|------|--------|-----------|----------|
| Default | bg-red-600 | text-white | None | No | Standard sales |
| Urgent | bg-red-700 | text-white | red-800 | Pulse | Ending soon |
| Featured | Gradient | text-white | Shadow | Subtle | Featured deals |

### Size Specifications

| Size | Padding | Font Size | Min Width | Min Height |
|------|---------|-----------|-----------|------------|
| Small | px-1.5 py-0.5 | text-xs | 40px | 20px |
| Medium | px-2 py-1 | text-sm | 50px | 24px |
| Large | px-3 py-1.5 | text-base | 60px | 30px |

### Shape Examples

**Rounded:**
```
┌────────┐
│ -20%   │
└────────┘
  Slightly rounded corners
```

**Circle:**
```
   ┌───┐
  │ -20% │
   └───┘
  Fully circular
```

**Square:**
```
┌────────┐
│ -20%   │
└────────┘
  Sharp corners
```

### Color Schemes

| Urgency Level | Background | Text | Border |
|---------------|------------|------|--------|
| Standard | red-600 | white | None |
| High | red-700 | white | red-800 |
| Critical | red-800 | yellow-300 | red-900 |
| Special | gradient | white | shadow |

### Pulse Animation

```
@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

Duration: 1.5s
Timing: ease-in-out
Iteration: infinite
```

### Gradient Backgrounds (Featured)

| Gradient | Colors | Direction |
|----------|--------|-----------|
| Warm | red-500 to orange-500 | Left to right |
| Hot | red-600 to pink-600 | Top to bottom |
| Fire | orange-500 to yellow-500 | Diagonal |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Contrast | Minimum 4.5:1 ratio |
| Text Size | Minimum 11px |
| ARIA Label | "20% discount" |
| Color Blind | Pattern or icon addition |

### Conditional Display Logic

| Discount | Display |
|----------|---------|
| 0 | Hide badge |
| < 5% | Show but no urgency |
| 5% - 30% | Standard badge |
| 30% - 50% | Featured badge |
| > 50% | Urgent badge with animation |

### Expected Outcome
- Eye-catching discount badge component
- Multiple positioning options
- Various styling intensities
- Responsive sizing
- Optional animations for urgency

### Verification Checklist
- [ ] `frontend/components/marketing/flash-sales/DiscountBadge.tsx` created
- [ ] Component accepts all required props
- [ ] Discount text calculated and displayed correctly
- [ ] Percentage and amount types supported
- [ ] Position variants implemented
- [ ] Style variants (default, urgent, featured) implemented
- [ ] Size variants implemented
- [ ] Shape variants implemented
- [ ] Pulse animation working (if enabled)
- [ ] Shadow and depth applied
- [ ] Color contrast meets accessibility standards
- [ ] Edge cases handled (zero, negative)
- [ ] Component properly typed
- [ ] Component exports correctly

---

## Task 48: Create Stock Counter

### Overview
Create the StockCounter component that displays remaining inventory for flash sale products. This component communicates scarcity and urgency by showing limited stock quantities with color-coded warnings and optional progress bars, encouraging faster purchase decisions.

### Dependencies
- Task 45: Create Flash Sale ProductCard

### Instructions

1. **Create stock counter component file**
   - Navigate to `frontend/components/marketing/flash-sales/` directory
   - Create `StockCounter.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - currentStock: number (required, items remaining)
   - totalStock?: number (optional, original stock)
   - showProgress?: boolean (display progress bar)
   - threshold?: number (low stock threshold, default 5)
   - variant?: 'text' | 'bar' | 'combined' (display style)
   - size?: 'sm' | 'md' | 'lg' (component size)
   - className?: string (additional styling)

3. **Calculate stock status**
   - Determine if stock is low (< threshold)
   - Calculate stock percentage if totalStock provided
   - Determine urgency level (critical, low, normal)
   - Format stock number for display

4. **Implement text display**
   - Show "Only X left in stock!" for low stock
   - Show "X available" for normal stock
   - Use appropriate color coding
   - Include urgency icon (⚠ or 🔥)

5. **Implement progress bar**
   - Visual bar showing stock depletion
   - Fill from left based on percentage
   - Color-coded (green → yellow → red)
   - Smooth transitions on updates

6. **Implement combined display**
   - Show both text and progress bar
   - Stack vertically or horizontally
   - Coordinate colors between elements

7. **Apply urgency styling**
   - Critical (< 3 items): Red, pulsing
   - Low (3-threshold): Orange/yellow, warning
   - Normal (> threshold): Green or gray, calm
   - Adjust based on context

8. **Add urgency animations**
   - Pulse effect for critical stock
   - Subtle glow for low stock
   - No animation for normal stock
   - Respect reduced motion preferences

9. **Implement size variants**
   - Small: Compact text, thin progress bar
   - Medium: Standard sizing
   - Large: Prominent display with icons

10. **Handle edge cases**
    - Out of stock (0 items)
    - High stock (hide counter or show generic)
    - Missing totalStock (show only current)
    - Negative stock (validation error)

11. **Add tooltips (optional)**
    - Hover to show exact stock count
    - Display original stock if available
    - Show stock trend if applicable

12. **Apply accessibility**
    - ARIA labels for stock status
    - Announce urgency to screen readers
    - Color not sole indicator (use icons/text)

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| currentStock | number | Yes | - | Items remaining |
| totalStock | number | No | undefined | Original stock |
| showProgress | boolean | No | false | Display progress bar |
| threshold | number | No | 5 | Low stock threshold |
| variant | 'text' or 'bar' or 'combined' | No | 'text' | Display style |
| size | 'sm' or 'md' or 'lg' | No | 'md' | Component size |
| className | string | No | '' | Additional classes |

### Stock Status Levels

| Stock Count | Status | Color | Icon | Message |
|-------------|--------|-------|------|---------|
| 0 | Out of Stock | Gray | ✗ | "Out of Stock" |
| 1-2 | Critical | Red | ⚠ | "Only X left!" |
| 3-5 | Low | Orange | 🔥 | "Only X left in stock" |
| 6-20 | Available | Yellow | ℹ | "X available" |
| > 20 | Good Stock | Green/Gray | ✓ | "In Stock" or hide |

### Text Display Variants

**Critical Stock (1-2):**
```
⚠ Only 2 left in stock!
```

**Low Stock (3-5):**
```
🔥 Only 4 left in stock
```

**Available (6-20):**
```
12 available
```

**High Stock (> 20):**
```
In Stock
```
*(or hide counter)*

### Progress Bar Structure

```
Low Stock (20%)
┌──────────────────────────────┐
│████░░░░░░░░░░░░░░░░░░░░░░░░│  ← Red fill
└──────────────────────────────┘
  4 of 20 items remaining

Normal Stock (60%)
┌──────────────────────────────┐
│███████████████████░░░░░░░░░░│  ← Green fill
└──────────────────────────────┘
  12 of 20 items remaining
```

### Progress Bar Color Coding

| Stock % | Color | Gradient | Urgency |
|---------|-------|----------|---------|
| 0% | Gray | None | Out |
| 1-20% | Red | red-600 to red-700 | Critical |
| 21-50% | Orange | orange-500 to orange-600 | Low |
| 51-75% | Yellow | yellow-400 to yellow-500 | Moderate |
| 76-100% | Green | green-500 to green-600 | Good |

### Combined Display Layout

```
Horizontal (Default):
⚠ Only 4 left in stock!
┌──────────────────────────────┐
│████████░░░░░░░░░░░░░░░░░░░░│
└──────────────────────────────┘
```

```
Vertical (Compact):
┌──────────────────────────────┐
│████████░░░░░░░░░░░░░░░░░░░░│
└──────────────────────────────┘
⚠ Only 4 left
```

### Size Variants

| Size | Text Font | Progress Height | Icon Size | Padding |
|------|-----------|-----------------|-----------|---------|
| Small | text-xs | h-1 | 12px | px-2 py-1 |
| Medium | text-sm | h-2 | 16px | px-3 py-1.5 |
| Large | text-base | h-3 | 20px | px-4 py-2 |

### Urgency Animations

**Critical Pulse:**
```
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
  }
}
```

**Low Stock Glow:**
```
box-shadow: 0 0 8px rgba(255, 165, 0, 0.5);
```

### Display Logic by Stock Level

| Stock | Threshold 5 | Display |
|-------|-------------|---------|
| 0 | - | "Out of Stock" (gray) |
| 1-2 | Critical | "Only X left!" (red, pulse) |
| 3-5 | Low | "Only X left in stock" (orange) |
| 6-10 | Visible | "X available" (yellow) |
| 11-20 | Visible | "In Stock" (green) |
| > 20 | Hide or Generic | "In Stock" or hide |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA Label | "Low stock: only 4 items remaining" |
| Color Blind | Use icons + text, not just color |
| Screen Readers | Announce urgency level |
| Focus | Focusable if interactive |
| Contrast | Minimum 4.5:1 ratio |

### Edge Case Handling

| Case | Handling |
|------|----------|
| currentStock = 0 | Show "Out of Stock", disable cart |
| currentStock < 0 | Validation error, show as 0 |
| Missing totalStock | Show only current stock text |
| High stock (> 50) | Hide or show generic "In Stock" |
| Stock updated | Smooth transition, no flash |

### Expected Outcome
- Clear stock availability indicator
- Urgency communicated effectively
- Multiple display formats (text, bar, combined)
- Color-coded visual cues
- Accessible to all users

### Verification Checklist
- [ ] `frontend/components/marketing/flash-sales/StockCounter.tsx` created
- [ ] Component accepts all required props
- [ ] Stock status calculated correctly
- [ ] Text display variant implemented
- [ ] Progress bar variant implemented
- [ ] Combined variant implemented
- [ ] Urgency color coding applied
- [ ] Urgency animations working (pulse, glow)
- [ ] Size variants implemented
- [ ] Out of stock handling
- [ ] High stock hiding logic
- [ ] Progress bar fills correctly
- [ ] Accessibility features included
- [ ] Edge cases handled
- [ ] Component properly typed
- [ ] Component exports correctly

---

## Task 49: Create Flash Sale Page

### Overview
Create a dedicated page for displaying all products in a flash sale. This page provides a comprehensive view with a prominent hero section showing the sale banner and countdown, a filterable product grid, category navigation, and sorting options. It serves as the primary destination for users exploring flash sale offerings.

### Dependencies
- Task 44: Create Flash Sale Section

### Instructions

1. **Create flash sale page file**
   - Navigate to `frontend/app/(storefront)/flash-sales/` directory
   - Create directory if it doesn't exist
   - Create `page.tsx` file for the flash sales listing page

2. **Import required dependencies**
   - Import FlashSaleBanner component (Task 43)
   - Import FlashSaleProductCard component (Task 45)
   - Import filter and sort components (Task 50)
   - Import useActiveFlashSales hook (Task 37)
   - Import useFlashSaleStore (Task 38)

3. **Define page metadata**
   - Set page title: "Flash Sales | LankaCommerce Cloud"
   - Add description for SEO
   - Include Open Graph tags
   - Add structured data for sales

4. **Implement page structure**
   - Hero section with FlashSaleBanner
   - Filter bar with categories and sorting
   - Product grid displaying all sale items
   - Pagination if needed
   - Footer with related links

5. **Add hero section**
   - Display prominent FlashSaleBanner at top
   - Show featured sale or current active sale
   - Large countdown timer
   - Call-to-action to scroll to products

6. **Implement breadcrumb navigation**
   - Home > Flash Sales
   - Home > Flash Sales > [Sale Name]
   - Improve navigation and SEO
   - Add structured data

7. **Add filter and sort bar**
   - Category filters (horizontal or sidebar)
   - Sort options dropdown
   - Price range filter (optional)
   - Stock availability filter
   - Clear filters button

8. **Implement product grid**
   - Use CSS Grid for responsive layout
   - Default 4 columns on desktop
   - Adjust for tablet (2-3 cols) and mobile (1-2 cols)
   - Map FlashSaleProductCard for each product
   - Maintain consistent spacing

9. **Add pagination or infinite scroll**
   - Display 20-50 products per page
   - Implement pagination buttons or infinite scroll
   - Show product count ("Showing 1-20 of 120")
   - Maintain scroll position on filter

10. **Implement sale selection**
    - If multiple active sales, show selector
    - Display tabs or dropdown for sales
    - Update products when sale changed
    - Maintain selected sale in URL

11. **Add empty state**
    - Show when no products match filters
    - Suggest clearing filters
    - Link to other sales or promotions
    - Display relevant message

12. **Add loading state**
    - Show skeleton loaders for products
    - Loading indicator during filter
    - Smooth transitions

13. **Implement URL parameters**
    - Sale ID in URL (/flash-sales/[id])
    - Category filter in query (?category=electronics)
    - Sort option in query (?sort=discount)
    - Enable sharing filtered views

14. **Add mobile optimizations**
    - Sticky filter bar on mobile
    - Collapsible filter panel
    - Simplified layout for small screens
    - Touch-friendly interactions

15. **Add sale end handling**
    - Detect when sale expires
    - Show expiration message
    - Redirect to active sales or homepage
    - Trigger automatic refresh

### Page Structure

```
┌──────────────────────────────────────────────────┐
│  Breadcrumb: Home > Flash Sales                   │
├──────────────────────────────────────────────────┤
│                                                   │
│  ╔════════════════════════════════════════════╗  │
│  ║  Flash Sale Banner (Hero)                  ║  │
│  ║  Large Countdown Timer                     ║  │
│  ║  [ Shop Now CTA ]                          ║  │
│  ╚════════════════════════════════════════════╝  │
│                                                   │
├──────────────────────────────────────────────────┤
│  Filter Bar                                       │
│  [All] [Electronics] [Fashion] ... | Sort: [▼]   │
├──────────────────────────────────────────────────┤
│                                                   │
│  Showing 1-20 of 120 products                     │
│                                                   │
│  ┌───────┬───────┬───────┬───────┐              │
│  │Product│Product│Product│Product│              │
│  │ Card  │ Card  │ Card  │ Card  │              │
│  └───────┴───────┴───────┴───────┘              │
│  ┌───────┬───────┬───────┬───────┐              │
│  │Product│Product│Product│Product│              │
│  │ Card  │ Card  │ Card  │ Card  │              │
│  └───────┴───────┴───────┴───────┘              │
│  ...                                              │
│                                                   │
│  [ ← Previous ]  [ 1 2 3 ... 10 ]  [ Next → ]   │
└──────────────────────────────────────────────────┘
```

### URL Structure

| URL | Description |
|-----|-------------|
| `/flash-sales` | All active flash sales |
| `/flash-sales/avurudu-sale` | Specific sale by slug |
| `/flash-sales?category=electronics` | Filtered by category |
| `/flash-sales?sort=discount` | Sorted by discount |
| `/flash-sales?category=fashion&sort=price-asc` | Multiple filters |

### Filter Options

| Filter Type | Options | Default |
|-------------|---------|---------|
| Category | All, Electronics, Fashion, Home, etc. | All |
| Sort | Discount %, Price Low-High, Price High-Low | Discount % |
| Price Range | ₨0-1000, ₨1000-5000, ₨5000+ | All |
| Stock | In Stock, Low Stock | All |

### Sort Options

| Option | Label | Sort Logic |
|--------|-------|------------|
| discount | "Biggest Discount" | Discount % descending |
| price-asc | "Price: Low to High" | Sale price ascending |
| price-desc | "Price: High to Low" | Sale price descending |
| stock | "Low Stock First" | Stock ascending |
| popular | "Most Popular" | Sales count descending |

### Product Grid Layout

| Breakpoint | Columns | Gap | Card Width |
|------------|---------|-----|------------|
| < 640px | 1 | gap-4 | 100% |
| 640px - 768px | 2 | gap-4 | ~48% |
| 768px - 1024px | 3 | gap-6 | ~31% |
| 1024px - 1280px | 4 | gap-6 | ~23% |
| > 1280px | 4-5 | gap-6 | ~23% / ~18% |

### Pagination Strategy

| Approach | Products per Page | Implementation |
|----------|-------------------|----------------|
| Standard Pagination | 20-30 | Page numbers + prev/next |
| Load More Button | 20 initial, +20 per click | Button at bottom |
| Infinite Scroll | 20 initial, +20 on scroll | Intersection Observer |

### Empty State Messages

| Scenario | Message |
|----------|---------|
| No products in sale | "No products in this flash sale yet. Check back soon!" |
| All filtered out | "No products match your filters. Try adjusting or clearing filters." |
| Sale ended | "This flash sale has ended. Check out our current sales!" |
| No active sales | "No active flash sales right now. Sign up for notifications!" |

### Mobile Optimizations

| Feature | Mobile Implementation |
|---------|----------------------|
| Filter Bar | Collapsible drawer from bottom |
| Product Grid | 1-2 columns |
| Banner | Smaller, stacked layout |
| Sort Options | Dropdown instead of tabs |
| Pagination | Simplified buttons |

### Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Image Loading | Lazy load, Next.js Image |
| Product Cards | Virtualization if > 100 products |
| Filters | Debounced API calls |
| Caching | React Query with stale time |
| Prefetching | Prefetch next page |

### Sale End Behavior

```
Sale Expires During Browsing
        │
        ▼
Detect Expiration (useCountdown hook)
        │
        ▼
Show Toast: "This sale has ended"
        │
        ▼
Fetch Active Sales
        │
    ┌───┴───┐
    │       │
  Found    None
    │       │
    ▼       ▼
Redirect  Redirect
to Sale   to Home
```

### Expected Outcome
- Comprehensive flash sale product listing page
- Clear filtering and sorting options
- Responsive product grid
- Prominent sale banner and countdown
- Smooth navigation and interactions

### Verification Checklist
- [ ] `frontend/app/(storefront)/flash-sales/page.tsx` created
- [ ] Page metadata configured
- [ ] FlashSaleBanner displayed in hero section
- [ ] Breadcrumb navigation implemented
- [ ] Filter bar implemented (Task 50)
- [ ] Product grid layout configured
- [ ] FlashSaleProductCard displayed for each product
- [ ] Pagination or infinite scroll implemented
- [ ] URL parameters for filters/sort
- [ ] Empty state handling
- [ ] Loading state with skeletons
- [ ] Sale selection (if multiple sales)
- [ ] Mobile responsive design
- [ ] Sale end detection and handling
- [ ] Performance optimizations applied

---

## Task 50: Create Sale Category Filter

### Overview
Create the category filter component for the flash sale page. This component allows users to filter products by category, view product counts per category, and easily switch between different product types. It integrates with the page's filtering logic to update the product display dynamically.

### Dependencies
- Task 49: Create Flash Sale Page

### Instructions

1. **Create sale category filter component file**
   - Navigate to `frontend/components/marketing/flash-sales/` directory
   - Create `SaleCategoryFilter.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - categories: Category[] (available categories with counts)
   - selectedCategory?: string | null (currently selected)
   - onCategoryChange: (category: string | null) => void (selection handler)
   - layout?: 'horizontal' | 'vertical' | 'dropdown' (display style)
   - showCounts?: boolean (display product counts)
   - className?: string (additional styling)

3. **Fetch available categories**
   - Get categories from sale products
   - Calculate product count per category
   - Filter out empty categories
   - Sort by count or alphabetically

4. **Implement horizontal tabs layout**
   - Display categories as tabs
   - Highlight selected category
   - Scroll horizontally on overflow (mobile)
   - Smooth scroll to selected tab

5. **Implement vertical sidebar layout**
   - Display categories as vertical list
   - Suitable for desktop side filters
   - Checkbox or radio button style
   - Collapsible on mobile

6. **Implement dropdown layout**
   - Compact dropdown selector
   - Best for mobile or limited space
   - Show selected category in button
   - Dropdown menu for options

7. **Add "All Categories" option**
   - Always available at the start
   - Clears category filter
   - Shows total product count
   - Default selected state

8. **Display product counts**
   - Show count next to each category
   - Format: "Electronics (24)"
   - Update dynamically with filters
   - Gray out empty categories

9. **Implement category selection**
   - Call onCategoryChange with selected category
   - Update URL query parameters
   - Update product grid display
   - Show visual feedback (highlight)

10. **Add clear filters option**
    - Button to reset all filters
    - Returns to "All Categories"
    - Clears other active filters
    - Visible when filters applied

11. **Implement responsive behavior**
    - Desktop: Horizontal tabs or sidebar
    - Tablet: Horizontal tabs (scrollable)
    - Mobile: Dropdown or collapsible list
    - Adjust based on screen width

12. **Add accessibility features**
    - Keyboard navigation (arrow keys)
    - ARIA labels and roles
    - Focus indicators
    - Screen reader announcements

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| categories | Category[] | Yes | - | Available categories |
| selectedCategory | string or null | No | null | Selected category |
| onCategoryChange | (category) => void | Yes | - | Selection handler |
| layout | 'horizontal' or 'vertical' or 'dropdown' | No | 'horizontal' | Display style |
| showCounts | boolean | No | true | Show product counts |
| className | string | No | '' | Additional classes |

### Category Data Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Category identifier |
| name | string | Display name |
| slug | string | URL-friendly name |
| count | number | Products in category |
| icon | string (optional) | Category icon |

### Horizontal Tabs Layout

```
┌────────────────────────────────────────────────────┐
│ [All (120)] [Electronics (24)] [Fashion (36)]     │
│ [Home (18)] [Beauty (22)] [Sports (20)] ...       │
└────────────────────────────────────────────────────┘
          ▲                                     
     Selected Tab (underline or background)
```

### Vertical Sidebar Layout

```
┌────────────────┐
│ Categories     │
├────────────────┤
│ ☑ All (120)   │ ← Selected
│ ☐ Electronics  │
│   (24)         │
│ ☐ Fashion (36) │
│ ☐ Home (18)    │
│ ☐ Beauty (22)  │
│ ☐ Sports (20)  │
└────────────────┘
```

### Dropdown Layout

```
┌──────────────────────────┐
│ All Categories (120)  ▼ │ ← Closed
└──────────────────────────┘

┌──────────────────────────┐
│ All Categories (120)  ▲ │ ← Open
├──────────────────────────┤
│ ☑ All (120)             │
│ ☐ Electronics (24)       │
│ ☐ Fashion (36)           │
│ ☐ Home (18)              │
│ ☐ Beauty (22)            │
│ ☐ Sports (20)            │
└──────────────────────────┘
```

### Selection States

| State | Visual Treatment | Interaction |
|-------|------------------|-------------|
| Default | Gray text, no background | Clickable |
| Hover | Light background, pointer | Highlight |
| Selected | Primary color, bold, underline/bg | Active |
| Disabled | Gray, reduced opacity | Not clickable |

### Category Count Display

| Format | Example | Use Case |
|--------|---------|----------|
| Inline | "Electronics (24)" | Standard |
| Badge | "Electronics" + badge "24" | Prominent |
| Subtle | "Electronics" + gray "24" | Minimalist |
| None | "Electronics" | Clean |

### Responsive Breakpoints

| Breakpoint | Layout | Behavior |
|------------|--------|----------|
| < 640px | Dropdown or Collapsible | Save space |
| 640px - 1024px | Horizontal Tabs (scroll) | Moderate space |
| > 1024px | Horizontal Tabs or Sidebar | Ample space |

### Horizontal Scroll Behavior

```
Desktop (Wide):
[All] [Electronics] [Fashion] [Home] [Beauty] [Sports] [Books]
                     ↑ All visible

Mobile (Narrow):
[All] [Electronics] [Fashion] → 
 ↑ Scroll to see more
```

### Clear Filters Integration

```
[All (120)] [Electronics (24) ✓] [Fashion (36)]  [ ✗ Clear ]
                 ▲                                      ▲
           Active Filter                        Clear Button
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move to next category |
| Shift+Tab | Move to previous category |
| Enter / Space | Select category |
| Arrow Left/Right | Navigate tabs (horizontal) |
| Arrow Up/Down | Navigate list (vertical) |
| Home | Go to first category |
| End | Go to last category |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | role="tablist" (horizontal), role="listbox" (vertical) |
| ARIA Labels | aria-label="Filter by category" |
| Selected | aria-selected="true" |
| Count | aria-label="Electronics, 24 products" |
| Focus | Visible focus ring |

### Empty Category Handling

| Scenario | Display |
|----------|---------|
| No products | Gray out, show "(0)" |
| Filter excludes | Hide category |
| All filtered out | Show "No categories available" |

### Expected Outcome
- Functional category filter for flash sale page
- Multiple layout options (tabs, sidebar, dropdown)
- Clear visual feedback for selections
- Responsive design for all devices
- Accessible keyboard navigation

### Verification Checklist
- [ ] `frontend/components/marketing/flash-sales/SaleCategoryFilter.tsx` created
- [ ] Component accepts all required props
- [ ] Categories displayed correctly
- [ ] Horizontal tabs layout implemented
- [ ] Vertical sidebar layout implemented
- [ ] Dropdown layout implemented
- [ ] "All Categories" option included
- [ ] Product counts displayed
- [ ] onCategoryChange callback triggers correctly
- [ ] URL query parameters updated
- [ ] Clear filters option added
- [ ] Responsive behavior implemented
- [ ] Keyboard navigation working
- [ ] Accessibility features included
- [ ] Empty category handling
- [ ] Component properly typed
- [ ] Component exports correctly

---

## Task 51: Create Sale End Notification

### Overview
Create a notification system that alerts users when a flash sale is about to end or has ended. This system uses toast notifications at strategic time intervals (1 hour, 10 minutes, 1 minute before) to create urgency and prompt immediate action. It integrates with the countdown timer and useActiveFlashSales hook.

### Dependencies
- Task 39: Create Countdown Timer Hook

### Instructions

1. **Create sale notification utility file**
   - Navigate to `frontend/lib/marketing/` directory
   - Create `flash-sale-notifications.ts` file
   - Set up notification logic and timing

2. **Import required dependencies**
   - Import toast/notification library (e.g., react-hot-toast, sonner)
   - Import useCountdown hook
   - Import flash sale types

3. **Define notification types**
   - ENDING_SOON_1HR: 1 hour before end
   - ENDING_SOON_10MIN: 10 minutes before end
   - ENDING_SOON_1MIN: 1 minute before end
   - SALE_ENDED: When sale expires
   - SALE_STARTED: When new sale begins

4. **Define notification configuration**
   - Message templates for each type
   - Icon or emoji for visual impact
   - Duration notification displays
   - Action buttons (e.g., "Shop Now")

5. **Implement notification timing logic**
   - Calculate time remaining in milliseconds
   - Determine which notification to show
   - Track shown notifications to avoid duplicates
   - Clear timers on unmount

6. **Create notification trigger function**
   - Accept sale data and time remaining
   - Determine appropriate notification
   - Show toast with configured options
   - Log for debugging (development only)

7. **Implement notification scheduling**
   - Schedule notifications at specific times
   - Use setTimeout or interval checking
   - Cancel scheduled notifications on changes
   - Handle multiple concurrent sales

8. **Create notification messages**
   - 1 hour: "Hurry! Avurudu Sale ends in 1 hour! ⏰"
   - 10 minutes: "Last chance! Only 10 minutes left! 🔥"
   - 1 minute: "Almost over! Sale ends in 1 minute! ⚠"
   - Ended: "Avurudu Sale has ended. Thanks for shopping!"
   - Started: "New Flash Sale is live! Shop now! 🎉"

9. **Add action buttons to notifications**
   - "Shop Now" button linking to sale page
   - "View Details" button for more info
   - "Dismiss" or close option
   - Track button clicks for analytics

10. **Implement persistent notification preference**
    - Allow users to opt-out of notifications
    - Store preference in localStorage
    - Respect user choice across sessions
    - Provide toggle in user settings

11. **Add sound effects (optional)**
    - Subtle sound for urgency
    - Respect browser autoplay policies
    - Provide mute option
    - Only for critical notifications

12. **Integrate with page components**
    - Create useFlashSaleNotifications hook
    - Integrate with FlashSaleSection
    - Integrate with FlashSalePage
    - Ensure single notification instance

13. **Handle multiple sales**
    - Prioritize ending sooner sales
    - Avoid notification spam
    - Group notifications if needed
    - Clear notifications for ended sales

14. **Add analytics tracking**
    - Track notification views
    - Track button clicks
    - Track conversion from notifications
    - Send to analytics platform

### Notification Types and Timing

| Type | Timing | Priority | Icon | Sound |
|------|--------|----------|------|-------|
| SALE_STARTED | On sale start | High | 🎉 | Optional |
| ENDING_SOON_1HR | 60 min before | Medium | ⏰ | No |
| ENDING_SOON_10MIN | 10 min before | High | 🔥 | No |
| ENDING_SOON_1MIN | 1 min before | Critical | ⚠ | Optional |
| SALE_ENDED | On end | Low | ℹ | No |

### Notification Message Templates

| Type | Message Template |
|------|------------------|
| 1 Hour | "Hurry! {saleName} ends in 1 hour! Don't miss out! ⏰" |
| 10 Minutes | "Last chance! Only 10 minutes left in {saleName}! 🔥" |
| 1 Minute | "Almost over! {saleName} ends in 1 minute! ⚠" |
| Ended | "{saleName} has ended. Check out our other sales!" |
| Started | "New Flash Sale: {saleName} is now live! 🎉" |

### Notification Display Configuration

| Type | Duration | Position | Dismissible | Action |
|------|----------|----------|-------------|--------|
| Started | 8 seconds | Top-right | Yes | "Shop Now" |
| 1 Hour | 6 seconds | Top-right | Yes | "View Sale" |
| 10 Minutes | 8 seconds | Top-center | Yes | "Shop Now" |
| 1 Minute | 10 seconds | Top-center | No | "Shop Now" |
| Ended | 6 seconds | Top-right | Yes | "View Other Sales" |

### Notification Scheduling Logic

```
Sale Start Time: 10:00 AM
Sale End Time: 6:00 PM
Current Time: 4:00 PM

Time Remaining: 2 hours

Scheduled Notifications:
├── 5:00 PM: 1-hour notification
├── 5:50 PM: 10-minute notification
├── 5:59 PM: 1-minute notification
└── 6:00 PM: Sale ended notification
```

### Duplicate Prevention

| Mechanism | Implementation |
|-----------|----------------|
| Tracking | Set of shown notification IDs |
| Storage | localStorage for persistence |
| Comparison | Check before showing |
| Reset | Clear on new sale or page reload |

### useFlashSaleNotifications Hook

```
Hook Initialization
        │
        ▼
Get Active Sales
        │
        ▼
Calculate Time Remaining
        │
        ▼
Determine Next Notification
        │
        ▼
Schedule Notification
        │
        ▼
Wait for Trigger Time
        │
        ▼
Show Toast Notification
        │
        ▼
Track as Shown
        │
        ▼
Schedule Next Notification
```

### User Preference Handling

| Setting | Options | Storage | Default |
|---------|---------|---------|---------|
| Enable Notifications | On / Off | localStorage | On |
| Sound | On / Off | localStorage | Off |
| Priority | All / Critical Only | localStorage | All |

### Multiple Sales Handling

| Scenario | Behavior |
|----------|----------|
| 2 sales ending within 1 hour | Show most urgent only |
| Both sales end simultaneously | Combine in single notification |
| One ends, one continues | Show ended, schedule next for ongoing |
| New sale starts during active | Show "New Sale" notification |

### Analytics Events

| Event | Data | Trigger |
|-------|------|---------|
| notification_shown | type, sale_id | On display |
| notification_clicked | type, sale_id, action | On button click |
| notification_dismissed | type, sale_id | On close |
| notification_converted | sale_id, product_id | If purchase |

### Toast Notification Styling

| Type | Background | Text | Border |
|------|------------|------|--------|
| Started | Blue gradient | White | None |
| 1 Hour | Yellow-50 | Gray-900 | Yellow-300 |
| 10 Minutes | Orange-50 | Gray-900 | Orange-400 |
| 1 Minute | Red-50 | Gray-900 | Red-400 |
| Ended | Gray-50 | Gray-700 | Gray-300 |

### Expected Outcome
- Timely notifications for flash sale events
- Configurable notification preferences
- No duplicate or spam notifications
- Clear calls-to-action
- Increased urgency and conversions

### Verification Checklist
- [ ] `frontend/lib/marketing/flash-sale-notifications.ts` created
- [ ] Notification types defined
- [ ] Notification timing logic implemented
- [ ] Message templates created with Sri Lanka context
- [ ] Toast library integrated
- [ ] Notification scheduling working
- [ ] Duplicate prevention implemented
- [ ] Action buttons functional
- [ ] User preferences stored and respected
- [ ] useFlashSaleNotifications hook created
- [ ] Integration with countdown timer
- [ ] Multiple sales handling
- [ ] Analytics tracking added
- [ ] Sound effects optional functionality
- [ ] Notification styling applied

---

## Task 52: Verify Flash Sales

### Overview
Conduct comprehensive verification and testing of the entire flash sales system. This task ensures all components work together correctly, the user experience is smooth, data flows properly, and edge cases are handled gracefully. It includes functional testing, integration testing, and user acceptance criteria validation.

### Dependencies
- Task 51: Create Sale End Notification

### Instructions

1. **Prepare test environment**
   - Set up development environment
   - Create test flash sales in database
   - Prepare test products with sale pricing
   - Configure test data with various scenarios

2. **Verify flash sale types (Task 35)**
   - Check TypeScript types compile without errors
   - Verify all interfaces are properly exported
   - Test type safety in components
   - Validate enum values

3. **Verify flash sale API (Task 36)**
   - Test getActiveFlashSales endpoint
   - Test getFlashSaleById endpoint
   - Test getFlashSaleProducts endpoint
   - Verify error handling (404, 500, network)
   - Check response transformation
   - Validate caching behavior

4. **Verify active sales query (Task 37)**
   - Test useActiveFlashSales hook
   - Verify automatic refetching works
   - Check loading and error states
   - Test with no active sales
   - Verify refetch on sale expiry

5. **Verify flash sale store (Task 38)**
   - Test setActiveSales action
   - Test setCurrentSale action
   - Test updateTimeRemaining action
   - Verify persistence to localStorage
   - Check derived selectors
   - Test store reset functionality

6. **Verify countdown timer hook (Task 39)**
   - Test useCountdown with various end times
   - Verify accurate time calculations
   - Test expiration callback triggers
   - Check pause/resume functionality
   - Test reset functionality
   - Verify no memory leaks

7. **Verify CountdownTimer component (Task 40)**
   - Test display with various times
   - Verify size variants render correctly
   - Test style variants
   - Check responsive behavior
   - Verify accessibility features

8. **Verify countdown digits animation (Task 41)**
   - Test flip animation
   - Test slide animation
   - Test fade animation
   - Verify smooth transitions
   - Check performance (no lag)
   - Test reduced motion respect

9. **Verify expired state (Task 42)**
   - Test expired message display
   - Verify onExpired callback triggers
   - Test hideWhenExpired behavior
   - Check transition animations
   - Test auto-refresh on expiry

10. **Verify flash sale banner (Task 43)**
    - Test banner display with sale data
    - Verify countdown timer integration
    - Check call-to-action button
    - Test responsive layout (desktop, tablet, mobile)
    - Verify urgency indicators
    - Test background image/gradient

11. **Verify flash sale section (Task 44)**
    - Test section display on homepage
    - Verify product grid layout
    - Check "View All" link navigation
    - Test loading state
    - Test empty state
    - Verify integration with store

12. **Verify flash sale product card (Task 45)**
    - Test card display with product data
    - Verify discount badge positioning
    - Check price display integration
    - Test stock counter integration
    - Verify add to cart functionality
    - Test quick view functionality
    - Check hover effects

13. **Verify sale price display (Task 46)**
    - Test original and sale price display
    - Verify discount calculation accuracy
    - Check savings display
    - Test percentage display
    - Verify LKR currency formatting (₨)
    - Test layout variants

14. **Verify discount badge (Task 47)**
    - Test badge display with various discounts
    - Verify positioning variants
    - Check style variants (default, urgent, featured)
    - Test size variants
    - Verify animation (pulse)
    - Check color contrast

15. **Verify stock counter (Task 48)**
    - Test with various stock levels
    - Verify urgency color coding
    - Check progress bar accuracy
    - Test animations (pulse, glow)
    - Verify out-of-stock handling
    - Test hide logic for high stock

16. **Verify flash sale page (Task 49)**
    - Test page loads correctly
    - Verify hero banner displays
    - Check filter integration
    - Test product grid layout
    - Verify pagination/infinite scroll
    - Test empty state
    - Check loading state
    - Test URL parameter handling
    - Verify mobile responsiveness

17. **Verify category filter (Task 50)**
    - Test category filtering
    - Verify product counts update
    - Check layout variants
    - Test "All Categories" option
    - Verify clear filters functionality
    - Test keyboard navigation
    - Check accessibility

18. **Verify sale end notifications (Task 51)**
    - Test notification at 1 hour before
    - Test notification at 10 minutes before
    - Test notification at 1 minute before
    - Verify sale ended notification
    - Check no duplicate notifications
    - Test user preference storage
    - Verify action buttons work

19. **Test end-to-end user flow**
    - User visits homepage
    - User sees flash sale section
    - User clicks "View All" or product
    - User filters by category
    - User adds product to cart
    - User receives notifications
    - Sale expires, user notified

20. **Test edge cases**
    - Sale with no products
    - Sale with 1 product
    - Sale already expired
    - Sale starting in future
    - Multiple concurrent sales
    - Very long sale name
    - Very high/low discount
    - Zero stock products

21. **Test performance**
    - Load time for flash sale page
    - Countdown timer CPU usage
    - Memory usage over time
    - Filter response time
    - Image loading speed
    - Mobile device performance

22. **Test accessibility**
    - Screen reader compatibility
    - Keyboard navigation
    - Focus indicators
    - Color contrast ratios
    - ARIA labels
    - Semantic HTML

23. **Test responsiveness**
    - Desktop (1920x1080)
    - Laptop (1366x768)
    - Tablet (768x1024)
    - Mobile (375x667, 414x896)
    - Very small screens (320px)

24. **Test browser compatibility**
    - Chrome/Edge (Chromium)
    - Firefox
    - Safari (Mac/iOS)
    - Mobile browsers (Chrome, Safari)

25. **Document issues and fixes**
    - Create issue list
    - Prioritize by severity
    - Assign to developers
    - Track resolution
    - Retest after fixes

### Verification Checklist

#### Types and API (Tasks 35-37)
- [ ] TypeScript types compile without errors
- [ ] API endpoints return correct data
- [ ] Error handling works correctly
- [ ] Response transformation accurate
- [ ] React Query caching functional
- [ ] Refetch logic triggers appropriately

#### State Management (Task 38)
- [ ] Zustand store actions work
- [ ] State persists to localStorage
- [ ] Derived selectors return correct data
- [ ] Store integrates with components

#### Countdown Timer (Tasks 39-42)
- [ ] useCountdown calculates time accurately
- [ ] CountdownTimer displays correctly
- [ ] Digit animations smooth and performant
- [ ] Expired state triggers correctly
- [ ] No memory leaks detected

#### Display Components (Tasks 43-48)
- [ ] FlashSaleBanner displays correctly
- [ ] FlashSaleSection layout proper
- [ ] FlashSaleProductCard renders with all elements
- [ ] SalePriceDisplay formats prices correctly
- [ ] DiscountBadge positioned and styled properly
- [ ] StockCounter shows urgency appropriately

#### Page and Filtering (Tasks 49-50)
- [ ] Flash sale page loads without errors
- [ ] Product grid responsive
- [ ] Filtering works correctly
- [ ] Pagination/infinite scroll functional
- [ ] URL parameters update properly
- [ ] Category filter displays and functions

#### Notifications (Task 51)
- [ ] Notifications trigger at correct times
- [ ] No duplicate notifications
- [ ] Action buttons work
- [ ] User preferences respected
- [ ] Notification styling correct

#### Integration and User Flow
- [ ] End-to-end user flow works smoothly
- [ ] Components integrate correctly
- [ ] Data flows properly between components
- [ ] Navigation works as expected
- [ ] Add to cart from sale page works

#### Edge Cases
- [ ] Empty sales handled gracefully
- [ ] Expired sales managed correctly
- [ ] Multiple sales display properly
- [ ] Out-of-stock products handled
- [ ] Invalid data doesn't crash app

#### Performance
- [ ] Page load time < 3 seconds
- [ ] Countdown timer CPU usage < 5%
- [ ] No memory leaks over 10 minutes
- [ ] Filter response time < 500ms
- [ ] Images load efficiently

#### Accessibility
- [ ] Screen reader can navigate
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Contrast ratios ≥ 4.5:1
- [ ] ARIA labels present and correct

#### Responsiveness
- [ ] Desktop layout correct
- [ ] Tablet layout adapts properly
- [ ] Mobile layout functional
- [ ] No horizontal scroll on mobile
- [ ] Touch interactions work

#### Browser Compatibility
- [ ] Chrome/Edge works
- [ ] Firefox works
- [ ] Safari works
- [ ] Mobile browsers work
- [ ] No console errors

### Test Scenarios

| Scenario | Expected Outcome |
|----------|------------------|
| Active sale with 2 hours left | Banner shows, timer counts down, products display |
| Sale ends in 10 minutes | Urgent notification, red styling, timer prominent |
| Sale expires during browsing | Notification shown, page refreshes, expired message |
| Filter by Electronics | Only electronics products shown, count updates |
| Add product to cart | Success toast, cart count increases, modal closes |
| No active sales | Empty state shown, link to other promotions |
| Multiple sales active | User can select sale, most urgent featured |

### Performance Benchmarks

| Metric | Target | Measured | Pass/Fail |
|--------|--------|----------|-----------|
| Page Load | < 3s | _____ | ☐ |
| Filter Response | < 500ms | _____ | ☐ |
| Timer CPU | < 5% | _____ | ☐ |
| Memory Growth | < 10MB/10min | _____ | ☐ |
| Image Load | < 2s | _____ | ☐ |

### Accessibility Audit

| Check | Tool | Pass/Fail |
|-------|------|-----------|
| Screen Reader | NVDA/JAWS | ☐ |
| Keyboard Nav | Manual Test | ☐ |
| Color Contrast | WAVE/aXe | ☐ |
| ARIA Labels | aXe DevTools | ☐ |
| Semantic HTML | Lighthouse | ☐ |

### Expected Outcome
- Fully functional flash sales system
- All components working together seamlessly
- No critical bugs or issues
- Acceptable performance metrics
- Accessible to all users
- Responsive across devices

### Final Verification Sign-off
- [ ] All functional requirements met
- [ ] All integration points working
- [ ] Edge cases handled gracefully
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] Responsive design verified
- [ ] Browser compatibility confirmed
- [ ] User acceptance criteria met
- [ ] Documentation complete
- [ ] Ready for production deployment

---

## Summary

This document completed the flash sales system implementation by creating specialized product display components (FlashSaleProductCard with integrated price displays, discount badges, and stock counters), building the comprehensive flash sale page with category filtering and sorting, implementing timely sale end notifications, and providing detailed verification procedures for the entire system.

### Completed Tasks
1. ✓ Created FlashSaleProductCard with all sale-specific elements
2. ✓ Created SalePriceDisplay with LKR currency formatting
3. ✓ Created DiscountBadge with urgency styling and animations
4. ✓ Created StockCounter with color-coded urgency indicators
5. ✓ Created comprehensive Flash Sale Page with filtering
6. ✓ Created SaleCategoryFilter with multiple layout options
7. ✓ Created Sale End Notification system with timely alerts
8. ✓ Provided comprehensive verification procedures and test scenarios

### System Complete
The Group C: Flash Sales System is now complete with all components, pages, integrations, and verification procedures. The system provides:
- Real-time countdown timers with animations
- Specialized product displays for flash sales
- Dedicated sale pages with filtering
- Timely notifications for urgency
- Sri Lanka localization (LKR, cultural festivals)
- Responsive and accessible design
- Complete integration with ERP and storefront

The flash sales system is ready for testing, refinement, and production deployment.
