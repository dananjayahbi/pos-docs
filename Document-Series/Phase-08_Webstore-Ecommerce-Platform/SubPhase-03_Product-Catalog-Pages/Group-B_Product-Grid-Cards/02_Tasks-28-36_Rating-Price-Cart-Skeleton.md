# Tasks 28-36: Rating, Price, Cart & Skeleton Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** B - Product Grid & Cards  
> **Document:** 02 of 02  
> **Tasks Covered:** 28, 29, 30, 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-27_Grid-Card-Image-Content.md](01_Tasks-17-27_Grid-Card-Image-Content.md)

---

## Document Overview

This document covers the creation of product card rating, price display components, add to cart functionality, variant selection, and skeleton loading states. It completes the product card implementation with interactive features and proper loading states for optimal user experience.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 28 | Create Card Rating | Low | 20 min |
| 29 | Create Card Price | Medium | 30 min |
| 30 | Create Regular Price Display | Low | 15 min |
| 31 | Create Sale Price Display | Low | 20 min |
| 32 | Create Discount Percentage | Low | 15 min |
| 33 | Create Card Add to Cart | Medium | 35 min |
| 34 | Create Card Variant Select | Medium | 40 min |
| 35 | Create Product Card Skeleton | Low | 25 min |
| 36 | Verify Product Cards | Low | 20 min |

---

## Task 28: Create Card Rating

### Overview
Create the CardRating component that displays product rating with star icons, average rating value, and review count. This component provides visual feedback about product quality and helps users make informed purchase decisions.

### Dependencies
- Task 25: Create Card Content Section
- Icon library installed (lucide-react or similar)

### Instructions

1. **Create CardRating component file**
   - Navigate to `frontend/components/storefront/catalog/ProductGrid/` directory
   - Create new file named `CardRating.tsx`
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CardRatingProps` interface
   - Include `rating` prop (number, 0-5)
   - Include `reviewCount` prop (number)
   - Include optional `showCount` prop (boolean, default true)

3. **Import star icon**
   - Import Star icon from lucide-react or icon library
   - Consider both filled and empty star variants
   - Ensure icon is properly sized

4. **Implement star display logic**
   - Create function to render 5 stars
   - Calculate filled, half-filled, and empty stars based on rating
   - Use array mapping to generate star elements

5. **Render filled stars**
   - Map over rating value (rounded down)
   - Render filled star icons with brand color
   - Apply appropriate size (w-4 h-4 or w-5 h-5)

6. **Handle half stars (optional)**
   - Check if rating has decimal value ≥ 0.5
   - Render half-filled star if applicable
   - Use CSS clip or dedicated half-star icon

7. **Render empty stars**
   - Calculate remaining empty stars (5 - filled - half)
   - Render empty star icons in gray color
   - Maintain consistent spacing between stars

8. **Add rating value display**
   - Show numeric rating value (e.g., "4.5")
   - Format to one decimal place
   - Apply appropriate text styling and size

9. **Add review count display**
   - Show review count in parentheses (e.g., "(123)")
   - Format large numbers with K/M suffixes if needed
   - Apply muted text color (text-gray-500)

10. **Style the component container**
    - Use flexbox for horizontal layout
    - Apply gap between stars, rating, and count
    - Ensure proper alignment (items-center)

11. **Add hover effects (optional)**
    - Consider highlighting on hover
    - Show tooltip with detailed rating breakdown
    - Maintain accessibility

### Rating Display Structure

```
┌─────────────────────────────────┐
│ ★★★★☆ 4.5 (123 reviews)       │
│ └─┬─┘ └┬┘ └──────┬──────┘      │
│   │    │         │              │
│   │    │         └─ Review count│
│   │    └─ Rating value          │
│   └─ Star icons                 │
└─────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| rating | number | Yes | - | Average rating (0-5) |
| reviewCount | number | Yes | - | Number of reviews |
| showCount | boolean | No | true | Show review count |
| className | string | No | "" | Additional classes |

### Star Color Mapping

| State | Color | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| Filled | Yellow | `text-yellow-400` | Active rating stars |
| Empty | Gray | `text-gray-300` | Remaining stars |
| Hover | Yellow | `hover:text-yellow-500` | Interactive feedback |

### Rating Value Formatting

| Rating | Display | Description |
|--------|---------|-------------|
| 4.8 | 4.8 | Show one decimal |
| 4.0 | 4.0 | Show trailing zero |
| 0 | 0.0 | Show zero rating |

### Review Count Formatting

| Count | Display | Logic |
|-------|---------|-------|
| 0-999 | 123 | Show exact number |
| 1,000-9,999 | 1.2K | Show with K suffix |
| 10,000+ | 10K | Round to nearest K |

### Expected Outcome
- Functional rating component with star display
- Accurate visual representation of product rating
- Review count displayed appropriately
- Responsive and accessible design

### Verification Checklist
- [ ] `CardRating.tsx` file created in ProductGrid directory
- [ ] Component accepts rating and reviewCount props
- [ ] Five stars rendered correctly
- [ ] Filled stars calculated from rating value
- [ ] Empty stars displayed in gray
- [ ] Rating value displayed with one decimal
- [ ] Review count shown in parentheses
- [ ] Proper spacing and alignment applied
- [ ] Component exports properly

---

## Task 29: Create Card Price

### Overview
Create the CardPrice component that serves as a container for price-related sub-components (regular price, sale price, discount percentage). This component orchestrates the display logic based on whether the product is on sale and manages the layout of price elements.

### Dependencies
- Task 25: Create Card Content Section

### Instructions

1. **Create CardPrice component file**
   - Navigate to `frontend/components/storefront/catalog/ProductGrid/` directory
   - Create new file named `CardPrice.tsx`
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CardPriceProps` interface
   - Include `regularPrice` prop (number)
   - Include `salePrice` prop (number or null)
   - Include `currency` prop (string, default "₨")
   - Include optional `showDiscount` prop (boolean)

3. **Calculate discount percentage**
   - Create helper function to calculate discount
   - Formula: `((regularPrice - salePrice) / regularPrice) * 100`
   - Round to nearest integer
   - Return null if no sale price

4. **Determine display mode**
   - Check if product is on sale (salePrice exists and < regularPrice)
   - Set boolean flag for conditional rendering
   - Handle edge cases (salePrice = regularPrice)

5. **Implement layout structure**
   - Use flexbox for price elements
   - Arrange elements horizontally or vertically based on design
   - Apply proper spacing with gap utilities

6. **Render sale price scenario**
   - If on sale, display sale price prominently
   - Show regular price as strikethrough
   - Display discount percentage badge
   - Use visual hierarchy (size, color, weight)

7. **Render regular price scenario**
   - If not on sale, display regular price only
   - Use standard text size and color
   - No strikethrough or discount badge

8. **Add price formatting**
   - Format numbers with thousand separators
   - Use two decimal places consistently
   - Prepend currency symbol
   - Handle zero and null values

9. **Style price container**
   - Apply flexbox layout with items-center
   - Add gap between price elements
   - Ensure responsive sizing

10. **Compose child components**
    - Import and use RegularPriceDisplay (Task 30)
    - Import and use SalePriceDisplay (Task 31)
    - Import and use DiscountPercentage (Task 32)
    - Pass appropriate props to each

### Price Display Logic

```
┌─────────────────────────────────────┐
│ Is Product On Sale?                 │
│                                     │
│ YES ──┐                             │
│       │                             │
│       ▼                             │
│   ┌──────────────────────┐         │
│   │ ₨ 2,500  ~~₨ 3,000~~ │         │
│   │ (Sale)   (Regular)    │         │
│   │ -17% badge            │         │
│   └──────────────────────┘         │
│                                     │
│ NO ───┐                             │
│       │                             │
│       ▼                             │
│   ┌──────────────────────┐         │
│   │ ₨ 2,500               │         │
│   │ (Regular only)        │         │
│   └──────────────────────┘         │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| regularPrice | number | Yes | - | Original product price |
| salePrice | number \| null | No | null | Discounted price |
| currency | string | No | "₨" | Currency symbol |
| showDiscount | boolean | No | true | Show discount badge |
| className | string | No | "" | Additional classes |

### Price Display Scenarios

| Scenario | Regular Price | Sale Price | Discount | Display |
|----------|---------------|------------|----------|---------|
| Normal | ₨ 2,500 | - | - | ₨ 2,500 |
| On Sale | ₨ 3,000 | ₨ 2,500 | -17% | ₨ 2,500 ~~₨ 3,000~~ -17% |
| Free | ₨ 0 | - | - | Free |
| Sale = Regular | ₨ 2,500 | ₨ 2,500 | - | ₨ 2,500 |

### Layout Structure

| Layout Type | Configuration | Use Case |
|-------------|---------------|----------|
| Horizontal | `flex-row gap-2` | Compact display |
| Vertical | `flex-col gap-1` | More spacing |
| Inline | `inline-flex` | Text flow |

### Expected Outcome
- Container component that manages price display logic
- Proper orchestration of child price components
- Conditional rendering based on sale status
- Clean and flexible pricing display

### Verification Checklist
- [ ] `CardPrice.tsx` file created in ProductGrid directory
- [ ] Component accepts regularPrice and salePrice props
- [ ] Discount percentage calculated correctly
- [ ] Sale vs regular display logic implemented
- [ ] Proper layout with flexbox applied
- [ ] Child components integrated (Tasks 30-32)
- [ ] Price formatting helper functions created
- [ ] Component exports properly

---

## Task 30: Create Regular Price Display

### Overview
Create the RegularPriceDisplay component that shows the regular (non-discounted) price. This component handles formatting and styling of the regular price, including strikethrough styling when product is on sale.

### Dependencies
- Task 29: Create Card Price

### Instructions

1. **Create RegularPriceDisplay component file**
   - Navigate to `frontend/components/storefront/catalog/ProductGrid/` directory
   - Create new file named `RegularPriceDisplay.tsx` (or include in CardPrice.tsx)
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `RegularPriceDisplayProps` interface
   - Include `price` prop (number)
   - Include `currency` prop (string)
   - Include `isOnSale` prop (boolean)
   - Include optional `className` prop

3. **Format price value**
   - Convert number to formatted string
   - Add thousand separators (2,500)
   - Use two decimal places (2,500.00)
   - Handle edge cases (0, negative, very large)

4. **Build price string**
   - Concatenate currency symbol and formatted price
   - Example: "₨ 2,500.00"
   - Ensure proper spacing between symbol and number
   - Handle different currency symbols

5. **Apply conditional styling**
   - If `isOnSale` is true, apply strikethrough
   - Use `line-through` decoration
   - Apply muted color (text-gray-500)
   - Reduce font size slightly

6. **Apply normal styling**
   - If not on sale, use standard text color
   - Use appropriate font size (text-lg or text-xl)
   - Apply font weight (font-semibold or font-bold)
   - Maintain readability

7. **Handle special cases**
   - If price is 0, display "Free"
   - If price is null/undefined, display "-"
   - Add appropriate styling for special cases

### Price Formatting Rules

| Input | Output | Description |
|-------|--------|-------------|
| 2500 | ₨ 2,500.00 | Standard format |
| 150000 | ₨ 150,000.00 | Large numbers |
| 99.5 | ₨ 99.50 | Decimal handling |
| 0 | Free | Zero price |

### Styling Variations

| State | Text Color | Text Decoration | Font Size | Font Weight |
|-------|-----------|-----------------|-----------|-------------|
| Normal | `text-gray-900` | none | `text-lg` | `font-bold` |
| On Sale (strikethrough) | `text-gray-500` | `line-through` | `text-sm` | `font-normal` |
| Free | `text-green-600` | none | `text-lg` | `font-bold` |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| price | number | Yes | - | Price value to display |
| currency | string | No | "₨" | Currency symbol |
| isOnSale | boolean | No | false | Apply sale styling |
| className | string | No | "" | Additional classes |

### Display Examples

```
Normal Price:
┌──────────────┐
│ ₨ 2,500.00   │ ← Bold, large, dark
└──────────────┘

On Sale (Strikethrough):
┌──────────────┐
│ ₨ 2,500.00   │ ← Gray, line-through, smaller
└──────────────┘

Free:
┌──────────────┐
│ Free         │ ← Green, bold
└──────────────┘
```

### Number Formatting Function

| Function | Purpose | Example |
|----------|---------|---------|
| toLocaleString() | Add separators | 2,500.00 |
| toFixed(2) | Two decimals | 2500.00 |
| Intl.NumberFormat | Locale-aware | ₨2,500.00 |

### Expected Outcome
- Component displays regular price with proper formatting
- Strikethrough styling applied when on sale
- Special handling for free items
- Clean and readable price display

### Verification Checklist
- [ ] Component file created (standalone or in CardPrice.tsx)
- [ ] Price formatting function implemented
- [ ] Thousand separators added correctly
- [ ] Two decimal places enforced
- [ ] Currency symbol prepended
- [ ] Strikethrough styling applied when isOnSale=true
- [ ] "Free" displayed for zero price
- [ ] Component exports properly

---

## Task 31: Create Sale Price Display

### Overview
Create the SalePriceDisplay component that shows the discounted sale price prominently. This component highlights the savings opportunity and draws attention to the special price with appropriate styling and emphasis.

### Dependencies
- Task 29: Create Card Price

### Instructions

1. **Create SalePriceDisplay component file**
   - Navigate to `frontend/components/storefront/catalog/ProductGrid/` directory
   - Create new file named `SalePriceDisplay.tsx` (or include in CardPrice.tsx)
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `SalePriceDisplayProps` interface
   - Include `price` prop (number)
   - Include `currency` prop (string)
   - Include optional `className` prop

3. **Format sale price value**
   - Convert number to formatted string
   - Add thousand separators
   - Use two decimal places
   - Handle edge cases

4. **Apply prominent styling**
   - Use larger font size (text-xl or text-2xl)
   - Apply bold font weight (font-bold)
   - Use accent color for emphasis (text-red-600 or text-blue-600)
   - Ensure high visibility

5. **Build price string**
   - Concatenate currency symbol and formatted price
   - Example: "₨ 2,500"
   - Maintain consistent formatting

6. **Add visual emphasis**
   - Consider background color (bg-red-50)
   - Add padding for background (px-2 py-1)
   - Apply border radius (rounded)
   - Keep design clean and not overwhelming

7. **Render only when applicable**
   - Component should only render if sale price exists
   - Return null if no sale price
   - Handle in parent component (CardPrice)

### Sale Price Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Font Size | `text-xl` or `text-2xl` | Prominence |
| Font Weight | `font-bold` | Emphasis |
| Text Color | `text-red-600` or `text-blue-600` | Attention |
| Background | `bg-red-50` (optional) | Highlight |
| Display | `inline-block` | Proper spacing |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| price | number | Yes | - | Sale price value |
| currency | string | No | "₨" | Currency symbol |
| className | string | No | "" | Additional classes |

### Display Example

```
┌─────────────────┐
│  ₨ 2,500        │ ← Large, bold, red/blue
└─────────────────┘
     ↑
     Prominent sale price
```

### Color Options

| Theme | Text Color | Background | Use Case |
|-------|-----------|------------|----------|
| Red | `text-red-600` | `bg-red-50` | Traditional sale |
| Blue | `text-blue-600` | `bg-blue-50` | Brand accent |
| Green | `text-green-600` | `bg-green-50` | Savings emphasis |
| Default | `text-gray-900` | `bg-gray-50` | Subtle |

### Comparison with Regular Price

| Aspect | Regular Price | Sale Price |
|--------|---------------|------------|
| Size | Medium | Large |
| Weight | Normal/Semibold | Bold |
| Color | Gray | Red/Blue |
| Decoration | Strikethrough | None |
| Emphasis | Low | High |

### Expected Outcome
- Prominently displayed sale price
- Clear visual distinction from regular price
- Proper formatting with currency
- Eye-catching design that highlights savings

### Verification Checklist
- [ ] Component file created (standalone or in CardPrice.tsx)
- [ ] Sale price formatted correctly
- [ ] Large, bold font applied
- [ ] Accent color used for emphasis
- [ ] Currency symbol included
- [ ] Background highlight applied (optional)
- [ ] Component exports properly

---

## Task 32: Create Discount Percentage

### Overview
Create the DiscountPercentage component that displays the savings percentage as a badge. This component calculates and shows the discount amount (e.g., "-17%") in a visually distinct badge, reinforcing the value proposition of the sale.

### Dependencies
- Task 29: Create Card Price

### Instructions

1. **Create DiscountPercentage component file**
   - Navigate to `frontend/components/storefront/catalog/ProductGrid/` directory
   - Create new file named `DiscountPercentage.tsx` (or include in CardPrice.tsx)
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `DiscountPercentageProps` interface
   - Include `regularPrice` prop (number)
   - Include `salePrice` prop (number)
   - Include optional `className` prop

3. **Calculate discount percentage**
   - Formula: `((regularPrice - salePrice) / regularPrice) * 100`
   - Round to nearest integer (Math.round)
   - Handle division by zero
   - Return null if percentage is 0 or negative

4. **Format percentage string**
   - Prepend minus sign ("-")
   - Append percentage symbol ("%")
   - Example: "-17%"
   - Keep format concise

5. **Design badge styling**
   - Use small font size (text-xs)
   - Apply background color (bg-red-500 or bg-green-500)
   - Use white text (text-white)
   - Add padding (px-2 py-1)
   - Apply border radius (rounded-md)
   - Use font weight (font-semibold)

6. **Position badge appropriately**
   - Display inline with price elements
   - Or position absolutely on card image (alternative)
   - Ensure visibility and readability

7. **Handle edge cases**
   - If discount is less than 1%, don't display
   - If salePrice >= regularPrice, don't display
   - If either price is invalid, return null

### Discount Calculation Examples

| Regular Price | Sale Price | Calculation | Result |
|---------------|------------|-------------|--------|
| ₨ 3,000 | ₨ 2,500 | (500/3000)*100 | -17% |
| ₨ 5,000 | ₨ 3,999 | (1001/5000)*100 | -20% |
| ₨ 1,000 | ₨ 750 | (250/1000)*100 | -25% |
| ₨ 100 | ₨ 99 | (1/100)*100 | -1% |

### Badge Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Background | `bg-red-500` or `bg-green-500` | Attention |
| Text Color | `text-white` | Contrast |
| Font Size | `text-xs` | Compact |
| Font Weight | `font-semibold` | Readability |
| Padding | `px-2 py-1` | Spacing |
| Border Radius | `rounded-md` | Smooth edges |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| regularPrice | number | Yes | - | Original price |
| salePrice | number | Yes | - | Discounted price |
| className | string | No | "" | Additional classes |

### Badge Display Options

```
Option 1: Inline with Price
┌──────────────────────────────┐
│ ₨ 2,500  ~~₨ 3,000~~  -17%  │
└──────────────────────────────┘

Option 2: Badge on Image (Alternative)
┌────────────────────┐
│ ┌──────┐          │
│ │ -17% │ [Image]  │
│ └──────┘          │
└────────────────────┘
```

### Color Schemes

| Theme | Background | Text | Use Case |
|-------|-----------|------|----------|
| Red | `bg-red-500` | `text-white` | Urgent sale |
| Green | `bg-green-500` | `text-white` | Savings |
| Orange | `bg-orange-500` | `text-white` | Hot deal |
| Yellow | `bg-yellow-500` | `text-gray-900` | Attention |

### Expected Outcome
- Discount percentage badge displayed correctly
- Accurate calculation of savings
- Eye-catching badge design
- Only shown when applicable

### Verification Checklist
- [ ] Component file created (standalone or in CardPrice.tsx)
- [ ] Discount calculation formula implemented correctly
- [ ] Percentage rounded to integer
- [ ] Badge styled with background and text color
- [ ] "-" prefix and "%" suffix added
- [ ] Edge cases handled (0%, negative, invalid)
- [ ] Component returns null when no discount
- [ ] Component exports properly

---

## Task 33: Create Card Add to Cart

### Overview
Create the CardAddToCart component that provides a button for adding products to the shopping cart directly from the product card. This component handles different states (available, out of stock, has variants, loading) and integrates with the cart management system.

### Dependencies
- Task 19: Create Product Card Component
- Cart context/state management setup

### Instructions

1. **Create CardAddToCart component file**
   - Navigate to `frontend/components/storefront/catalog/ProductGrid/` directory
   - Create new file named `CardAddToCart.tsx`
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CardAddToCartProps` interface
   - Include `productId` prop (string)
   - Include `inStock` prop (boolean)
   - Include `hasVariants` prop (boolean)
   - Include `quantity` prop (number, default 1)
   - Include optional `onAddToCart` callback

3. **Import cart functionality**
   - Import cart context or state management hooks
   - Import any required cart actions (addToCart)
   - Ensure cart integration is available

4. **Implement button state logic**
   - Determine button text based on state
   - "Add to Cart" - default state
   - "Out of Stock" - when not in stock
   - "Select Options" - when has variants
   - "Adding..." - during loading
   - Disable button when appropriate

5. **Handle add to cart action**
   - Create click handler function
   - Prevent action if out of stock
   - If has variants, redirect to product detail page
   - If simple product, add to cart directly
   - Show loading state during operation

6. **Integrate with cart system**
   - Call addToCart action with productId and quantity
   - Handle success response (show toast/notification)
   - Handle error response (show error message)
   - Update cart count/state

7. **Style the button**
   - Apply primary brand color (bg-blue-600)
   - Use white text (text-white)
   - Add hover effect (hover:bg-blue-700)
   - Apply proper padding (px-4 py-2)
   - Set full width (w-full)
   - Add border radius (rounded-md)

8. **Add disabled state styling**
   - Gray background (bg-gray-400)
   - Cursor not-allowed
   - Reduced opacity
   - Remove hover effects

9. **Add loading state**
   - Show loading spinner or text
   - Disable button during loading
   - Prevent multiple clicks

10. **Add icon (optional)**
    - Import ShoppingCart icon
    - Display icon before or after button text
    - Ensure proper spacing

### Button State Logic

```
┌─────────────────────────────────────┐
│ Check Product State                 │
│                                     │
│ Out of Stock? ──Yes──▶ "Out of Stock" (disabled)
│       │                             │
│       No                            │
│       │                             │
│       ▼                             │
│ Has Variants? ──Yes──▶ "Select Options"
│       │                             │
│       No                            │
│       │                             │
│       ▼                             │
│ Is Loading? ──Yes──▶ "Adding..." (disabled)
│       │                             │
│       No                            │
│       │                             │
│       ▼                             │
│ "Add to Cart" (enabled)             │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| productId | string | Yes | - | Product identifier |
| inStock | boolean | Yes | - | Stock availability |
| hasVariants | boolean | No | false | Product has variants |
| quantity | number | No | 1 | Quantity to add |
| onAddToCart | function | No | - | Custom callback |
| className | string | No | "" | Additional classes |

### Button States

| State | Button Text | Background | Disabled | Action |
|-------|-------------|------------|----------|--------|
| Available | "Add to Cart" | Blue | No | Add to cart |
| Out of Stock | "Out of Stock" | Gray | Yes | None |
| Has Variants | "Select Options" | Blue | No | Go to detail |
| Loading | "Adding..." | Blue | Yes | None |

### Button Styling Specifications

| Property | Available | Disabled | Hover |
|----------|-----------|----------|-------|
| Background | `bg-blue-600` | `bg-gray-400` | `hover:bg-blue-700` |
| Text | `text-white` | `text-white` | `text-white` |
| Cursor | `cursor-pointer` | `cursor-not-allowed` | `cursor-pointer` |
| Opacity | `opacity-100` | `opacity-60` | `opacity-100` |

### Add to Cart Flow

```
1. User Clicks Button
   │
   ▼
2. Validate Product State
   │
   ├── Out of Stock? ──▶ Show Error
   │
   ├── Has Variants? ──▶ Navigate to Product Detail
   │
   └── Simple Product
       │
       ▼
3. Call addToCart()
   │
   ├── Set Loading State
   │
   ▼
4. Wait for Response
   │
   ├── Success ──▶ Show Success Toast
   │             Update Cart Count
   │
   └── Error ──▶ Show Error Message
                 Reset State
```

### Expected Outcome
- Functional add to cart button with state handling
- Proper integration with cart system
- Different states handled appropriately
- Loading and error states managed
- Responsive and accessible button

### Verification Checklist
- [ ] `CardAddToCart.tsx` file created in ProductGrid directory
- [ ] Component accepts required props
- [ ] Button states implemented (available, out of stock, variants, loading)
- [ ] Add to cart action handler created
- [ ] Cart integration functional
- [ ] Loading state shows during operation
- [ ] Success/error notifications displayed
- [ ] Button styling applied correctly
- [ ] Disabled state styled appropriately
- [ ] Hover effects work on enabled button
- [ ] Component exports properly

---

## Task 34: Create Card Variant Select

### Overview
Create the CardVariantSelect component that allows users to choose product variants (size, color, etc.) directly from the product card. This component displays variant options and updates the selected variant before adding to cart, or redirects to the product detail page for complex variant selection.

### Dependencies
- Task 33: Create Card Add to Cart
- Product variant data structure defined

### Instructions

1. **Create CardVariantSelect component file**
   - Navigate to `frontend/components/storefront/catalog/ProductGrid/` directory
   - Create new file named `VariantSelect.tsx` or `CardVariantSelect.tsx`
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CardVariantSelectProps` interface
   - Include `variants` prop (array of variant objects)
   - Include `selectedVariant` prop (string or null)
   - Include `onVariantChange` callback
   - Include optional `displayType` prop ("dropdown" or "swatches")

3. **Define variant data structure**
   - Variant object should have: id, name, value, inStock
   - Example: { id: "size-m", name: "Size", value: "M", inStock: true }
   - Support multiple variant types (size, color, material)

4. **Implement dropdown variant selector**
   - Create select element with variant options
   - Map over variants array to generate options
   - Set selected value to selectedVariant
   - Apply proper styling to select element

5. **Implement swatch variant selector (alternative)**
   - Display variants as clickable color swatches or buttons
   - Highlight selected variant
   - Show visual representation (color for colors, text for sizes)
   - Add hover effects

6. **Handle variant selection**
   - Create onChange handler
   - Update selectedVariant state
   - Call onVariantChange callback with selected variant
   - Update available add to cart options

7. **Display variant on hover (optional)**
   - Hide variant selector by default
   - Show on product card hover
   - Use CSS transitions for smooth appearance
   - Ensure doesn't interfere with other card interactions

8. **Handle out of stock variants**
   - Disable out of stock variant options
   - Add visual indicator (strikethrough, opacity)
   - Show "Out of Stock" label or tooltip
   - Prevent selection of unavailable variants

9. **Integrate with add to cart**
   - Pass selected variant to CardAddToCart component
   - Disable add to cart if no variant selected
   - Show "Select Options" button if variants are complex
   - Redirect to product detail for multi-attribute variants

10. **Style the component**
    - Apply appropriate spacing and sizing
    - Ensure mobile-friendly (touch targets)
    - Match card design aesthetic
    - Maintain visual hierarchy

### Variant Display Types

```
Dropdown:
┌──────────────────────────┐
│ Size: [M ▼]              │
└──────────────────────────┘

Swatches (Colors):
┌──────────────────────────┐
│ [●] [●] [●] [●]          │
│  Red Blue Green Black     │
└──────────────────────────┘

Buttons (Sizes):
┌──────────────────────────┐
│ [S] [M] [L] [XL]         │
└──────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variants | Variant[] | Yes | - | Array of variants |
| selectedVariant | string \| null | No | null | Current selection |
| onVariantChange | function | Yes | - | Selection callback |
| displayType | "dropdown" \| "swatches" | No | "dropdown" | Display style |
| className | string | No | "" | Additional classes |

### Variant Object Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Variant attribute name (Size, Color) |
| value | string | Variant value (M, Red) |
| inStock | boolean | Availability |
| imageUrl | string (optional) | Visual representation |

### Display Behavior Options

| Option | When to Show | When to Hide |
|--------|-------------|--------------|
| Always Visible | Simple single variant | Never |
| Show on Hover | Standard implementation | Card not hovered |
| Click to Expand | Mobile friendly | Not expanded |
| Link to Detail | Complex variants | Never (always visible) |

### Variant Selection States

| State | Visual | Behavior |
|-------|--------|----------|
| Not Selected | Gray border | Can be selected |
| Selected | Blue border/fill | Currently chosen |
| Out of Stock | Gray + strikethrough | Cannot be selected |
| Hover | Blue highlight | Shows preview |

### Integration with Add to Cart

```
┌────────────────────────────────┐
│ Card Variant Select            │
│ ┌────────────────────────┐    │
│ │ Size: [M ▼]           │    │
│ └────────────────────────┘    │
│                                │
│ ▼                              │
│ Selected Variant: "size-m"     │
│                                │
│ ▼                              │
│ Card Add to Cart               │
│ ┌────────────────────────┐    │
│ │ [Add to Cart]          │    │
│ └────────────────────────┘    │
└────────────────────────────────┘
```

### Expected Outcome
- Functional variant selector component
- Clear display of available options
- Proper handling of variant selection
- Integration with add to cart functionality
- Out of stock variants handled appropriately

### Verification Checklist
- [ ] `VariantSelect.tsx` or `CardVariantSelect.tsx` file created
- [ ] Component accepts variants array prop
- [ ] Dropdown or swatch display implemented
- [ ] Variant selection handler created
- [ ] Selected variant state managed
- [ ] Out of stock variants disabled/styled
- [ ] Integration with CardAddToCart working
- [ ] Hover behavior implemented (if applicable)
- [ ] Mobile-friendly touch targets
- [ ] Component exports properly

---

## Task 35: Create Product Card Skeleton

### Overview
Create the ProductCardSkeleton component that displays animated loading placeholders while product data is being fetched. This component mimics the structure and layout of the actual ProductCard, providing visual feedback during loading states and improving perceived performance.

### Dependencies
- Task 19: Create Product Card Component

### Instructions

1. **Create ProductCardSkeleton component file**
   - Navigate to `frontend/components/storefront/catalog/ProductGrid/` directory
   - Create new file named `ProductCardSkeleton.tsx`
   - Set up TypeScript React functional component structure

2. **Match ProductCard structure**
   - Replicate the layout structure of ProductCard
   - Include skeleton elements for all visible sections
   - Maintain same dimensions and spacing
   - Ensure visual consistency

3. **Create skeleton image placeholder**
   - Rectangle with same aspect ratio as product image
   - Apply background color (bg-gray-200)
   - Set dimensions matching actual image section
   - Add border radius if product image has it

4. **Create skeleton category placeholder**
   - Small rectangle for category text
   - Width approximately 30-40% of card width
   - Height matching category text (h-4)
   - Position matching actual category placement

5. **Create skeleton title placeholder**
   - Two or three horizontal lines for title text
   - First line full width or 90%
   - Second line 70-80% width
   - Height matching title text (h-4 or h-5)
   - Space between lines (gap-2)

6. **Create skeleton rating placeholder**
   - Small rectangles for star icons
   - Rectangle for rating value
   - Rectangle for review count
   - Arrange in same layout as CardRating

7. **Create skeleton price placeholder**
   - Rectangle for price text
   - Width approximately 40-50% of card width
   - Height matching price text (h-6 or h-7)
   - Position matching actual price

8. **Create skeleton button placeholder**
   - Rectangle matching add to cart button
   - Full width of card content
   - Height matching button (h-10 or h-12)
   - Apply border radius

9. **Apply pulse animation**
   - Use Tailwind `animate-pulse` utility
   - Apply to all skeleton elements
   - Creates smooth loading effect
   - Indicates active loading state

10. **Adjust spacing and layout**
    - Match padding and gaps from ProductCard
    - Ensure card container has same dimensions
    - Maintain responsive behavior
    - Test alongside actual product cards

11. **Add card container styling**
    - Apply same border, shadow, radius as ProductCard
    - Match background color
    - Ensure consistent appearance
    - Blend naturally in grid

### Skeleton Structure

```
┌──────────────────────────────┐
│ ┌──────────────────────────┐ │ ← Image skeleton
│ │        [pulse]           │ │   (rectangle)
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────┐                    │ ← Category skeleton
│ │[pulse]│                   │   (small rectangle)
│ └──────┘                    │
│                              │
│ ┌─────────────────────────┐ │ ← Title skeleton
│ │[pulse]                  │ │   (2-3 lines)
│ └─────────────────────────┘ │
│ ┌──────────────────┐        │
│ │[pulse]           │        │
│ └──────────────────┘        │
│                              │
│ ●●●●● ┌──┐ ┌─────┐         │ ← Rating skeleton
│ [pulse] [p] [pulse]         │
│                              │
│ ┌──────────┐                │ ← Price skeleton
│ │[pulse]   │                │
│ └──────────┘                │
│                              │
│ ┌──────────────────────────┐ │ ← Button skeleton
│ │       [pulse]            │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

### Skeleton Element Specifications

| Element | Width | Height | Animation | Purpose |
|---------|-------|--------|-----------|---------|
| Image | 100% | 200-300px | Pulse | Product image placeholder |
| Category | 30-40% | h-4 | Pulse | Category text |
| Title Line 1 | 90% | h-5 | Pulse | Title text |
| Title Line 2 | 70% | h-5 | Pulse | Title continuation |
| Rating Stars | 20% | h-4 | Pulse | Star icons |
| Rating Text | 15% | h-4 | Pulse | Rating value |
| Review Count | 25% | h-4 | Pulse | Review text |
| Price | 40% | h-6 | Pulse | Price value |
| Button | 100% | h-10 | Pulse | Add to cart button |

### Color Palette

| State | Background | Description |
|-------|-----------|-------------|
| Base | `bg-gray-200` | Light gray skeleton |
| Dark Mode | `bg-gray-700` | Dark gray skeleton |
| Pulse | Animated | Fades to lighter shade |

### Component Structure

```typescript
// No props needed typically
export function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      {/* Image skeleton */}
      {/* Content skeletons */}
    </div>
  );
}
```

### Usage in Grid

```
┌─────────────────────────────────────┐
│ Product Grid                        │
│                                     │
│ [Skeleton] [Skeleton] [Product]    │
│ [Skeleton] [Product]  [Product]    │
│ [Product]  [Product]  [Product]    │
│                                     │
└─────────────────────────────────────┘
  ↑ Loading  ↑ Loading  ↑ Loaded
```

### Performance Considerations

| Aspect | Approach | Benefit |
|--------|----------|---------|
| Animation | CSS only (animate-pulse) | Better performance |
| Rendering | Simple divs | Fast initial render |
| Count | Match expected products | Realistic loading |
| Transition | Fade from skeleton to real | Smooth UX |

### Expected Outcome
- Loading skeleton component matching ProductCard layout
- Smooth pulse animation on all placeholder elements
- Consistent dimensions and spacing
- Improved perceived loading performance

### Verification Checklist
- [ ] `ProductCardSkeleton.tsx` file created in ProductGrid directory
- [ ] Component structure matches ProductCard layout
- [ ] Image skeleton placeholder created
- [ ] Category skeleton placeholder created
- [ ] Title skeleton placeholders created (2-3 lines)
- [ ] Rating skeleton placeholder created
- [ ] Price skeleton placeholder created
- [ ] Button skeleton placeholder created
- [ ] Pulse animation applied to all elements
- [ ] Card container styled consistently with ProductCard
- [ ] Spacing and dimensions match ProductCard
- [ ] Component exports properly

---

## Task 36: Verify Product Cards

### Overview
Verify that all product card components are correctly implemented, integrated, and functioning as expected. This task involves comprehensive testing of the product grid, individual product cards, all interactive features, and loading states to ensure a high-quality user experience.

### Dependencies
- All previous tasks (17-35) completed
- Product data available for testing

### Instructions

1. **Set up test environment**
   - Ensure development server is running
   - Navigate to a page with product grid
   - Prepare test data with various product scenarios
   - Have browser dev tools open

2. **Verify product grid layout**
   - Check grid displays correctly at all breakpoints
   - Verify 2 columns on mobile (< 640px)
   - Verify 3 columns on tablet (640px - 1024px)
   - Verify 4 columns on desktop (> 1024px)
   - Confirm proper spacing/gaps between cards

3. **Verify product card structure**
   - Check all card sections render correctly
   - Confirm image section displays properly
   - Confirm content section displays properly
   - Verify proper spacing within card
   - Check border, shadow, and radius applied

4. **Verify card image functionality**
   - Test image lazy loading works
   - Verify primary image displays correctly
   - Test hover to show secondary image (if implemented)
   - Check image maintains aspect ratio
   - Verify image optimization (Next.js Image)

5. **Verify card badges**
   - Check "Sale" badge displays on sale products
   - Check "New" badge displays on new products
   - Check "Out of Stock" badge on unavailable products
   - Verify badge positioning (top-left corner)
   - Confirm badge colors and styling

6. **Verify quick actions**
   - Test wishlist icon click functionality
   - Test quick view icon click functionality
   - Test compare icon click (if implemented)
   - Verify icons appear on hover (desktop)
   - Check icons always visible on mobile

7. **Verify card content**
   - Check category link displays and works
   - Verify product title displays and links to detail
   - Confirm title truncation works for long titles
   - Test clicking title navigates to product detail
   - Verify proper text styling and hierarchy

8. **Verify rating display**
   - Check star icons display correctly
   - Verify filled stars match rating value
   - Confirm empty stars displayed in gray
   - Check rating value displays (e.g., "4.5")
   - Verify review count displays (e.g., "(123)")
   - Test with products having different ratings

9. **Verify price display**
   - Test regular price displays correctly
   - Verify sale price displays on sale products
   - Check regular price has strikethrough when on sale
   - Confirm discount percentage badge shows
   - Verify "Free" displays for zero-price products
   - Test price formatting (thousand separators, decimals)

10. **Verify add to cart functionality**
    - Test "Add to Cart" button on simple products
    - Verify button adds product to cart
    - Check success notification appears
    - Verify cart count updates
    - Test "Out of Stock" button is disabled
    - Check "Select Options" displays for variant products
    - Verify loading state during add to cart operation

11. **Verify variant selection**
    - Test variant selector displays for variant products
    - Verify selecting variant updates state
    - Check selected variant reflected in UI
    - Test out of stock variants are disabled
    - Verify add to cart uses selected variant

12. **Verify skeleton loading states**
    - Test skeleton displays during initial load
    - Verify skeleton structure matches real card
    - Check pulse animation works smoothly
    - Test transition from skeleton to real card
    - Verify skeleton count matches expected products

13. **Test responsive behavior**
    - Test all features on mobile devices
    - Verify touch interactions work correctly
    - Check hover states have mobile alternatives
    - Test scrolling and performance
    - Verify text remains readable at all sizes

14. **Test accessibility**
    - Navigate cards using keyboard only
    - Verify all interactive elements are focusable
    - Check focus indicators are visible
    - Test with screen reader (basic check)
    - Verify sufficient color contrast ratios
    - Check alt text on images

15. **Performance testing**
    - Test with large number of products (50+)
    - Verify grid performance is acceptable
    - Check image loading doesn't block UI
    - Test scrolling is smooth
    - Verify no console errors or warnings

16. **Cross-browser testing**
    - Test in Chrome/Edge
    - Test in Firefox
    - Test in Safari (if available)
    - Verify consistent appearance and behavior
    - Note any browser-specific issues

### Verification Matrix

| Feature | Desktop | Tablet | Mobile | Notes |
|---------|---------|--------|--------|-------|
| Grid Layout | ✓ | ✓ | ✓ | 4/3/2 columns |
| Card Structure | ✓ | ✓ | ✓ | All sections |
| Image Display | ✓ | ✓ | ✓ | Lazy load |
| Image Hover | ✓ | ✓ | N/A | Secondary image |
| Badges | ✓ | ✓ | ✓ | Sale/New/Stock |
| Quick Actions | ✓ (hover) | ✓ (hover) | ✓ (visible) | Wishlist/View |
| Category Link | ✓ | ✓ | ✓ | Navigation |
| Title Link | ✓ | ✓ | ✓ | Navigation |
| Rating Display | ✓ | ✓ | ✓ | Stars + count |
| Price Display | ✓ | ✓ | ✓ | Regular/Sale |
| Discount Badge | ✓ | ✓ | ✓ | Percentage |
| Add to Cart | ✓ | ✓ | ✓ | All states |
| Variant Select | ✓ | ✓ | ✓ | Dropdown/Swatches |
| Skeleton | ✓ | ✓ | ✓ | Loading state |

### Test Product Scenarios

| Scenario | Description | Expected Behavior |
|----------|-------------|-------------------|
| Simple Product | No variants, in stock | Show "Add to Cart" button |
| Sale Product | On sale, discount | Show sale price, strikethrough regular, discount badge |
| New Product | Recently added | Show "New" badge |
| Out of Stock | Not available | Show "Out of Stock" badge and disabled button |
| Variant Product | Has size/color options | Show variant selector, "Select Options" or add to cart after selection |
| Free Product | Price = 0 | Show "Free" instead of price |
| High Rating | 4.5+ stars | Full stars display correctly |
| No Reviews | 0 reviews | Rating section handles gracefully |

### Common Issues Checklist

| Issue | Check | Resolution |
|-------|-------|------------|
| Images not loading | Network tab | Verify image paths and Next.js config |
| Grid layout broken | Inspect CSS | Check grid classes and breakpoints |
| Buttons not working | Console errors | Verify event handlers and state |
| Hover not working | CSS/JS | Check hover classes and interactions |
| Slow performance | Performance tab | Optimize images, reduce re-renders |
| Accessibility issues | Lighthouse | Add missing ARIA labels, fix contrast |

### Expected Outcome
- All product card features verified and working correctly
- Grid layout responsive across all devices
- Interactive features functioning as expected
- Loading states display appropriately
- Performance is acceptable with many products
- No critical bugs or console errors

### Verification Checklist
- [ ] Product grid displays with correct column configuration
- [ ] Grid responsive at all breakpoints
- [ ] Product cards render with all sections
- [ ] Product images display and lazy load correctly
- [ ] Image hover shows secondary image (if implemented)
- [ ] Badges display correctly (Sale, New, Out of Stock)
- [ ] Quick action icons work and positioned correctly
- [ ] Category links navigate correctly
- [ ] Product title links to detail page
- [ ] Title truncation works for long titles
- [ ] Star rating displays accurately
- [ ] Rating value and review count shown
- [ ] Regular price displays correctly
- [ ] Sale price shown with strikethrough on regular price
- [ ] Discount percentage badge displays
- [ ] "Free" displays for zero-price products
- [ ] Add to cart button works for simple products
- [ ] Add to cart updates cart state and count
- [ ] Success notification shown after adding to cart
- [ ] Out of stock button disabled
- [ ] Variant selector displays for variant products
- [ ] Variant selection works correctly
- [ ] Selected variant used in add to cart
- [ ] Skeleton loading displays during initial load
- [ ] Skeleton structure matches real card
- [ ] Smooth transition from skeleton to real card
- [ ] All features work on mobile devices
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader accessibility (basic test)
- [ ] No console errors or warnings
- [ ] Performance acceptable with many products
- [ ] Cross-browser compatibility verified

---

## Summary

This document completed the product card implementation with rating display, comprehensive price handling (regular, sale, discount), add to cart functionality with variant selection, and skeleton loading states. These components work together to create a fully functional and user-friendly product browsing experience.

### Completed Tasks
1. ✓ Created CardRating component with star display and review count
2. ✓ Created CardPrice container component with price orchestration
3. ✓ Created RegularPriceDisplay component with formatting and strikethrough
4. ✓ Created SalePriceDisplay component with prominent styling
5. ✓ Created DiscountPercentage badge component with calculation
6. ✓ Created CardAddToCart component with state handling and cart integration
7. ✓ Created CardVariantSelect component for variant selection
8. ✓ Created ProductCardSkeleton component for loading states
9. ✓ Verified all product card components and functionality

### Next Steps
Proceed to the next group in SubPhase-03 to continue building the product catalog pages, including filter sidebar, product sorting, pagination, and search functionality.
