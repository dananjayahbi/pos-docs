# Tasks 37-46: Container, Layout, and Cart Items

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** C - Cart Page  
> **Document:** 01 of 02  
> **Tasks Covered:** 37, 38, 39, 40, 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-47-54_Price-Empty-Mobile.md](02_Tasks-47-54_Price-Empty-Mobile.md)

---

## Document Overview

This document covers the creation of the cart page container, layout structure, and cart item components. It establishes the foundational structure for the full shopping cart page, including the page container setup, header with item count, two-column responsive layout, cart items and summary containers, and individual cart item rows with product images, details, and variant tags.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Create Cart Page Container | Low | 20 min |
| 38 | Create Cart Page Header | Low | 15 min |
| 39 | Create Cart Item Count Header | Low | 15 min |
| 40 | Create Cart Two Column Layout | Medium | 30 min |
| 41 | Create Cart Items Container | Low | 20 min |
| 42 | Create Cart Summary Container | Low | 20 min |
| 43 | Create Cart Item Row | Medium | 30 min |
| 44 | Create Cart Item Image | Low | 20 min |
| 45 | Create Cart Item Details | Low | 25 min |
| 46 | Create Cart Item Variant Tags | Low | 20 min |

---

## Task 37: Create Cart Page Container

### Overview
Create the main container component for the cart page that wraps all cart content. This container provides proper width constraints, centering, and spacing for the entire cart page, ensuring consistent layout across different screen sizes while maintaining the webstore design system.

### Dependencies
- Task 36: Verify Mini Cart Component (from Group-B)
- Cart store from Group-A must be complete
- Frontend project structure established

### Instructions

1. **Create cart page components directory**
   - Navigate to `frontend/components/storefront/cart/` directory
   - Create new directory named `CartPage`
   - This will house all full cart page components

2. **Create CartPage component file**
   - Create `CartPage.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up TypeScript React functional component structure
   - Configure as the main cart page component

3. **Import required dependencies**
   - Import React and necessary hooks (useState, useEffect)
   - Import cart store hooks from Group-A
   - Import child components (will be created in subsequent tasks)

4. **Define component structure**
   - Create default export function `CartPage`
   - Set up container div as main wrapper
   - Plan sections: header, layout, content

5. **Implement main container**
   - Create outer container with max-width constraint
   - Set max-width to 1200px for desktop readability
   - Add horizontal padding (px-4 sm:px-6 lg:px-8)

6. **Add centering and spacing**
   - Apply `mx-auto` for horizontal centering
   - Add vertical padding (py-8 md:py-12)
   - Ensure consistent spacing with site layout

7. **Connect to cart store**
   - Use cart store hook to access cart state
   - Retrieve cart items array
   - Retrieve cart totals and metadata

8. **Implement conditional rendering**
   - Check if cart items exist (items.length > 0)
   - Show full cart layout when items present
   - Show empty cart component when no items (Task 50)

### Container Structure

```
┌─────────────────────────────────────────────────┐
│  Browser Window                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ CartPage Container (max-w-1200px)        │ │
│  │ ┌─────────────────────────────────────┐  │ │
│  │ │                                     │  │ │
│  │ │  Cart Header (Task 38)              │  │ │
│  │ │                                     │  │ │
│  │ │  Two Column Layout (Task 40)        │  │ │
│  │ │  ┌──────────┬────────────┐         │  │ │
│  │ │  │  Items   │  Summary   │         │  │ │
│  │ │  │  (T-41)  │   (T-42)   │         │  │ │
│  │ │  └──────────┴────────────┘         │  │ │
│  │ │                                     │  │ │
│  │ └─────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Container Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Max Width | 1200px | Optimal reading width |
| Padding X | px-4 sm:px-6 lg:px-8 | Responsive spacing |
| Padding Y | py-8 md:py-12 | Vertical breathing room |
| Margin X | mx-auto | Horizontal centering |
| Min Height | min-h-screen | Full viewport height |

### Responsive Breakpoints

| Screen Size | Max Width | Padding X | Padding Y |
|-------------|-----------|-----------|-----------|
| Mobile (< 640px) | 100% | 16px | 32px |
| Tablet (640-1024px) | 100% | 24px | 48px |
| Desktop (> 1024px) | 1200px | 32px | 48px |

### Cart State Integration

| Store Value | Purpose | Used For |
|-------------|---------|----------|
| items[] | Cart items array | Display items, count |
| totalItems | Total quantity | Item count display |
| subtotal | Items subtotal | Summary calculations |
| isEmpty | Empty state flag | Conditional rendering |

### Conditional Rendering Logic

```
┌─────────────────────────────┐
│  Cart Items Exist?          │
│  (items.length > 0)         │
└──────────┬──────────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
  YES            NO
    │             │
    ▼             ▼
Full Cart     Empty Cart
Layout        Component
(Tasks 38-49) (Task 50)
```

### Expected Outcome
- Main cart page container component created
- Proper width constraints and centering applied
- Connected to cart store for state management
- Ready to receive child components
- Conditional rendering for empty/full states

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartPage.tsx` file created
- [ ] Container has max-width of 1200px
- [ ] Horizontal centering with mx-auto applied
- [ ] Responsive padding configured
- [ ] Cart store integration implemented
- [ ] Conditional rendering logic in place
- [ ] Component exports properly

---

## Task 38: Create Cart Page Header

### Overview
Create the header component for the cart page that displays the "Shopping Cart" title. This header provides clear page identification and establishes visual hierarchy at the top of the cart page, helping users understand they are viewing their shopping cart.

### Dependencies
- Task 37: Create Cart Page Container

### Instructions

1. **Create CartPageHeader component file**
   - Create `CartPageHeader.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CartPageHeaderProps` interface
   - Include itemCount prop (number) for displaying item count
   - Include optional className prop for additional styling

3. **Implement header structure**
   - Create header container using semantic HTML (header tag)
   - Add main heading with "Shopping Cart" text
   - Use h1 tag for proper semantic hierarchy

4. **Apply header styling**
   - Set text size (text-2xl md:text-3xl) for responsive sizing
   - Apply font weight (font-bold) for prominence
   - Set text color using storefront color scheme
   - Add bottom margin or padding for spacing (mb-6 md:mb-8)

5. **Add flexbox layout**
   - Use flexbox for horizontal alignment
   - Align items to baseline or center
   - Add gap between title and item count

6. **Integrate item count display**
   - Add slot for item count component (Task 39)
   - Position next to title text
   - Ensure responsive behavior

7. **Implement responsive design**
   - Adjust font size for mobile vs desktop
   - Modify spacing for different screen sizes
   - Test header on various viewport widths

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| itemCount | number | No | - | Number of items in cart |
| className | string | No | "" | Additional CSS classes |

### Header Structure

```
┌─────────────────────────────────────────┐
│  Shopping Cart      (3 items)           │
│  ────────────────                       │
│  H1 - Bold, Large                       │
└─────────────────────────────────────────┘
```

### Header Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex items-baseline gap-3 mb-6 md:mb-8` | Layout and spacing |
| Title | `text-2xl md:text-3xl font-bold text-gray-900` | Prominent heading |
| Count | `text-lg md:text-xl text-gray-600 font-normal` | Secondary info |

### Typography Hierarchy

| Screen Size | Title Size | Count Size | Spacing |
|-------------|------------|------------|---------|
| Mobile | 24px (text-2xl) | 18px (text-lg) | mb-6 |
| Tablet | 28px | 20px | mb-7 |
| Desktop | 30px (text-3xl) | 20px (text-xl) | mb-8 |

### Responsive Behavior

```
Mobile (< 768px)
├── Title: 24px, Bold
├── Count: 18px, Normal
└── Layout: Horizontal with gap-2

Desktop (≥ 768px)
├── Title: 30px, Bold
├── Count: 20px, Normal
└── Layout: Horizontal with gap-3
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Semantic HTML | Use h1 tag for main heading |
| Text Contrast | Ensure 4.5:1 ratio minimum |
| Hierarchy | Clear visual and semantic hierarchy |
| Screen Readers | Proper heading level structure |

### Integration with CartPage

```
<CartPage>
  <CartPageHeader itemCount={cart.totalItems} />
  <!-- Rest of cart content -->
</CartPage>
```

### Expected Outcome
- Professional cart page header component
- Clear "Shopping Cart" title with proper hierarchy
- Slot for item count display (implemented in Task 39)
- Responsive typography and spacing
- Semantic HTML structure

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartPageHeader.tsx` file created
- [ ] Component uses h1 tag for heading
- [ ] "Shopping Cart" title displays correctly
- [ ] Font size responsive (text-2xl to text-3xl)
- [ ] Font weight set to bold
- [ ] Bottom margin/padding applied
- [ ] Props interface defined properly
- [ ] Component exports correctly

---

## Task 39: Create Cart Item Count Header

### Overview
Create a component that displays the number of items in the cart within the page header. This component shows a formatted count like "(3 items)" or "(1 item)" next to the "Shopping Cart" title, providing immediate feedback about cart contents.

### Dependencies
- Task 38: Create Cart Page Header

### Instructions

1. **Create CartItemCount component file**
   - Create `CartItemCount.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CartItemCountProps` interface
   - Include count prop (number) for item count
   - Include optional className prop for styling

3. **Implement count formatting logic**
   - Create helper function to format count text
   - Return "(1 item)" for singular
   - Return "(X items)" for plural
   - Return "(0 items)" for empty cart

4. **Create component structure**
   - Render span or div element
   - Display formatted count text
   - Apply appropriate styling

5. **Apply count styling**
   - Set text size (text-lg md:text-xl)
   - Use normal font weight (not bold)
   - Set text color to gray (text-gray-600)
   - Ensure contrast with title

6. **Implement plural handling**
   - Check if count equals 1
   - Use "item" for singular
   - Use "items" for plural
   - Handle zero case appropriately

7. **Add parentheses formatting**
   - Wrap count in parentheses: (X items)
   - Ensure consistent spacing
   - Maintain readability

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| count | number | Yes | - | Number of items in cart |
| className | string | No | "" | Additional CSS classes |

### Count Formatting Logic

| Count Value | Display Text | Example |
|-------------|--------------|---------|
| 0 | (0 items) | (0 items) |
| 1 | (1 item) | (1 item) |
| 2-999 | (X items) | (5 items) |
| 1000+ | (X items) | (1,234 items) |

### Formatting Function Example

```
formatItemCount(count: number): string
  ├── If count === 0 → "(0 items)"
  ├── If count === 1 → "(1 item)"
  └── If count > 1 → `(${count} items)`
```

### Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Font Size | text-lg md:text-xl | Readable, not prominent |
| Font Weight | font-normal | Secondary to title |
| Color | text-gray-600 | Subtle, supporting info |
| Display | inline | Flows with title |

### Integration Example

```
Header Layout:
┌──────────────────────────────────┐
│ Shopping Cart (3 items)          │
│ ─────────────  ─────────         │
│    Bold          Normal           │
└──────────────────────────────────┘
```

### Number Formatting Options

| Feature | Implementation | Example |
|---------|----------------|---------|
| Basic | count.toString() | "5" |
| Localized | count.toLocaleString() | "1,234" |
| Abbreviated | Custom function | "1.2K" |

### Edge Cases to Handle

| Case | Count | Display |
|------|-------|---------|
| Empty Cart | 0 | (0 items) |
| Single Item | 1 | (1 item) |
| Multiple Items | 5 | (5 items) |
| Large Number | 1234 | (1,234 items) |

### Responsive Behavior

```
Mobile
├── Size: 18px (text-lg)
├── Weight: Normal
└── Color: Gray-600

Desktop
├── Size: 20px (text-xl)
├── Weight: Normal
└── Color: Gray-600
```

### Expected Outcome
- Functional item count component
- Proper singular/plural handling
- Formatted with parentheses
- Subtle styling (not bold)
- Integrates with cart header

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartItemCount.tsx` file created
- [ ] Component accepts count prop
- [ ] Singular/plural logic implemented correctly
- [ ] Returns "(1 item)" for count of 1
- [ ] Returns "(X items)" for other counts
- [ ] Parentheses formatting applied
- [ ] Font size and weight appropriate
- [ ] Text color set to gray-600
- [ ] Component exports properly

---

## Task 40: Create Cart Two Column Layout

### Overview
Create a responsive two-column layout component for the cart page that displays cart items on the left and the order summary on the right. This layout provides optimal organization of cart content on desktop while adapting to a single-column stack on mobile devices.

### Dependencies
- Task 37: Create Cart Page Container

### Instructions

1. **Create CartTwoColumnLayout component file**
   - Create `CartTwoColumnLayout.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CartTwoColumnLayoutProps` interface
   - Include itemsSlot prop (ReactNode) for left column
   - Include summarySlot prop (ReactNode) for right column
   - Include optional className prop

3. **Implement grid layout container**
   - Use CSS Grid for layout (grid)
   - Define grid columns (grid-cols-1 lg:grid-cols-12)
   - Set gap between columns (gap-6 lg:gap-8)

4. **Configure left column (items)**
   - Set column span to 12 on mobile (col-span-12)
   - Set column span to 7-8 on desktop (lg:col-span-7 or lg:col-span-8)
   - This gives 58-66% width to items section

5. **Configure right column (summary)**
   - Set column span to 12 on mobile (col-span-12)
   - Set column span to 4-5 on desktop (lg:col-span-5 or lg:col-span-4)
   - This gives 33-42% width to summary section

6. **Add sticky positioning for summary**
   - Apply sticky positioning to summary column (lg:sticky)
   - Set top offset (lg:top-4 or lg:top-6)
   - Ensures summary stays visible during scroll

7. **Implement responsive behavior**
   - Stack columns vertically on mobile (< 1024px)
   - Items column appears first
   - Summary column appears below on mobile
   - Side-by-side on desktop (≥ 1024px)

8. **Add self-start alignment**
   - Apply self-start to summary column
   - Prevents summary from stretching full height
   - Maintains compact summary appearance

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| itemsSlot | ReactNode | Yes | - | Cart items container content |
| summarySlot | ReactNode | Yes | - | Order summary content |
| className | string | No | "" | Additional CSS classes |

### Layout Structure - Desktop

```
┌───────────────────────────────────────────────┐
│  CartTwoColumnLayout (Grid 12 cols)          │
│  ┌─────────────────────┬──────────────────┐  │
│  │                     │                  │  │
│  │  Items Container    │  Cart Summary    │  │
│  │  (Col-span 7-8)     │  (Col-span 4-5)  │  │
│  │                     │  ┌────────────┐  │  │
│  │  ┌──────────────┐   │  │  Sticky    │  │  │
│  │  │ Cart Item 1  │   │  │  Position  │  │  │
│  │  └──────────────┘   │  │            │  │  │
│  │  ┌──────────────┐   │  │  Summary   │  │  │
│  │  │ Cart Item 2  │   │  │  Stays     │  │  │
│  │  └──────────────┘   │  │  Visible   │  │  │
│  │  ┌──────────────┐   │  │            │  │  │
│  │  │ Cart Item 3  │   │  └────────────┘  │  │
│  │  └──────────────┘   │                  │  │
│  │                     │                  │  │
│  └─────────────────────┴──────────────────┘  │
└───────────────────────────────────────────────┘
     65-70% width           30-35% width
```

### Layout Structure - Mobile

```
┌──────────────────────────────┐
│  CartTwoColumnLayout         │
│  (Single Column)             │
│                              │
│  ┌────────────────────────┐ │
│  │  Items Container       │ │
│  │  (Full Width)          │ │
│  │  ┌──────────────────┐  │ │
│  │  │  Cart Item 1     │  │ │
│  │  └──────────────────┘  │ │
│  │  ┌──────────────────┐  │ │
│  │  │  Cart Item 2     │  │ │
│  │  └──────────────────┘  │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │  Cart Summary          │ │
│  │  (Full Width Below)    │ │
│  │                        │ │
│  └────────────────────────┘ │
└──────────────────────────────┘
```

### Grid Configuration

| Breakpoint | Grid Columns | Items Span | Summary Span | Gap |
|------------|--------------|------------|--------------|-----|
| Mobile (< 1024px) | 1 | 12 (100%) | 12 (100%) | 24px |
| Desktop (≥ 1024px) | 12 | 7-8 (58-66%) | 4-5 (33-42%) | 32px |

### Column Width Options

| Layout Option | Items Cols | Summary Cols | Items % | Summary % |
|---------------|------------|--------------|---------|-----------|
| Option A | 8 | 4 | 66.7% | 33.3% |
| Option B | 7 | 5 | 58.3% | 41.7% |
| Recommended | 8 | 4 | 66.7% | 33.3% |

### Sticky Summary Behavior

```
┌─────────────────────────────────────┐
│  Page Top                           │
├─────────────────────────────────────┤
│  Header                             │
├─────────────────────────────────────┤
│  ┌─────────────┬────────────────┐   │
│  │   Items     │ ┌────────────┐ │   │ ← Summary sticks here
│  │   Scroll    │ │  Summary   │ │   │   (top-4 or top-6)
│  │   Down      │ │  (Sticky)  │ │   │
│  │             │ │            │ │   │
│  │   ↓         │ └────────────┘ │   │
│  │   ↓         │                │   │
│  └─────────────┴────────────────┘   │
└─────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8` | Responsive grid |
| Items Column | `col-span-12 lg:col-span-8` | Left column sizing |
| Summary Column | `col-span-12 lg:col-span-4 lg:sticky lg:top-6 lg:self-start` | Right column, sticky |

### Expected Outcome
- Responsive two-column grid layout
- Items on left (65-70% width desktop)
- Summary on right (30-35% width desktop)
- Sticky summary on desktop scroll
- Single column stack on mobile
- Proper spacing and gaps

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartTwoColumnLayout.tsx` file created
- [ ] Component accepts itemsSlot and summarySlot props
- [ ] Grid layout with 12 columns on desktop
- [ ] Items column spans 8 columns on desktop
- [ ] Summary column spans 4 columns on desktop
- [ ] Single column on mobile (< 1024px)
- [ ] Sticky positioning applied to summary
- [ ] Gap spacing configured (gap-6 lg:gap-8)
- [ ] Component exports properly

---

## Task 41: Create Cart Items Container

### Overview
Create a container component for the cart items section that holds all individual cart item rows. This container provides consistent styling, spacing, and organization for the list of products in the cart, serving as the left column in the two-column layout.

### Dependencies
- Task 40: Create Cart Two Column Layout

### Instructions

1. **Create CartItemsContainer component file**
   - Create `CartItemsContainer.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CartItemsContainerProps` interface
   - Include children prop (ReactNode) for cart item rows
   - Include optional className prop for additional styling
   - Include optional title prop for section heading

3. **Implement container structure**
   - Create main container div
   - Add optional section heading (h2 tag)
   - Add items wrapper for list of cart items

4. **Apply container styling**
   - Set background color (bg-white)
   - Add border (border border-gray-200)
   - Apply border radius (rounded-lg)
   - Add padding (p-4 md:p-6)

5. **Add section heading (optional)**
   - Display "Cart Items" or similar heading
   - Use h2 tag for semantic hierarchy
   - Apply appropriate text styling (text-lg font-semibold)
   - Add bottom margin to separate from items (mb-4)

6. **Create items list wrapper**
   - Use div to wrap all cart item children
   - Apply divide utility for borders between items (divide-y divide-gray-200)
   - This creates automatic borders between rows

7. **Configure spacing**
   - Set padding for container
   - Configure gap or divide for items
   - Ensure consistent spacing throughout

8. **Add empty state handling**
   - Check if children exist
   - Display empty message if no items
   - Or delegate to parent component

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Cart item rows |
| title | string | No | "Cart Items" | Section heading |
| className | string | No | "" | Additional CSS classes |

### Container Structure

```
┌─────────────────────────────────────┐
│  Cart Items Container               │
│  ┌───────────────────────────────┐  │
│  │ Cart Items (Optional)         │  │
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │  Cart Item Row 1              │  │
│  │  ───────────────────────      │  │
│  │  Cart Item Row 2              │  │
│  │  ───────────────────────      │  │
│  │  Cart Item Row 3              │  │
│  │                               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `bg-white border border-gray-200 rounded-lg p-4 md:p-6` | Card appearance |
| Heading | `text-lg font-semibold text-gray-900 mb-4` | Section title |
| Items Wrapper | `divide-y divide-gray-200` | Borders between items |

### Container Variations

| Variant | Background | Border | Shadow | Use Case |
|---------|------------|--------|--------|----------|
| Card | White | Gray-200 | None | Standard |
| Card Elevated | White | Gray-200 | shadow-sm | Emphasized |
| Minimal | Transparent | None | None | Clean look |
| Recommended | White | Gray-200 | None | Standard |

### Items Divider Approach

```
┌─────────────────────────────┐
│ Cart Item 1                 │
├─────────────────────────────┤ ← divide-y creates this
│ Cart Item 2                 │
├─────────────────────────────┤
│ Cart Item 3                 │
└─────────────────────────────┘
```

### Responsive Padding

| Screen Size | Padding | Purpose |
|-------------|---------|---------|
| Mobile | p-4 (16px) | Compact spacing |
| Tablet | p-5 (20px) | Medium spacing |
| Desktop | p-6 (24px) | Generous spacing |

### Integration Example

```
<CartTwoColumnLayout
  itemsSlot={
    <CartItemsContainer>
      <CartItemRow item={item1} />
      <CartItemRow item={item2} />
      <CartItemRow item={item3} />
    </CartItemsContainer>
  }
  summarySlot={<CartSummaryContainer />}
/>
```

### Expected Outcome
- Clean container for cart items
- Card-style appearance with border
- Automatic dividers between items
- Optional section heading
- Responsive padding
- Ready to receive cart item rows

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartItemsContainer.tsx` file created
- [ ] Component accepts children prop
- [ ] Container has white background
- [ ] Border and border-radius applied
- [ ] Padding configured (p-4 md:p-6)
- [ ] divide-y utility applied for item dividers
- [ ] Optional heading implemented
- [ ] Component exports properly

---

## Task 42: Create Cart Summary Container

### Overview
Create a container component for the order summary section that displays cart totals, promotional codes, and checkout button. This container provides the right column in the two-column layout with sticky positioning, keeping summary information visible as users scroll through cart items.

### Dependencies
- Task 40: Create Cart Two Column Layout

### Instructions

1. **Create CartSummaryContainer component file**
   - Create `CartSummaryContainer.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CartSummaryContainerProps` interface
   - Include children prop (ReactNode) for summary content
   - Include optional className prop for styling
   - Include optional title prop for heading

3. **Implement container structure**
   - Create main container div
   - Add section heading ("Order Summary")
   - Add content wrapper for children

4. **Apply container styling**
   - Set background color (bg-white)
   - Add border (border border-gray-200)
   - Apply border radius (rounded-lg)
   - Add padding (p-4 md:p-6)

5. **Add section heading**
   - Display "Order Summary" or similar text
   - Use h2 tag for semantic hierarchy
   - Apply text styling (text-lg font-semibold)
   - Add bottom margin (mb-4)

6. **Create content wrapper**
   - Wrap children in div for spacing control
   - Apply vertical spacing between elements (space-y-4)
   - This creates consistent gaps between summary items

7. **Add shadow for elevation (optional)**
   - Consider adding shadow (shadow-sm or shadow-md)
   - Provides subtle elevation effect
   - Makes summary stand out slightly

8. **Ensure sticky compatibility**
   - Design for sticky positioning (from Task 40)
   - Keep height reasonable for various screen sizes
   - Don't make container too tall for viewports

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Summary content |
| title | string | No | "Order Summary" | Section heading |
| className | string | No | "" | Additional CSS classes |

### Container Structure

```
┌────────────────────────────┐
│  Order Summary             │
│  ─────────────             │
│                            │
│  Subtotal:        ₨4,500  │
│  Shipping:         ₨350   │
│  ──────────────────────    │
│  Total:           ₨4,850  │
│                            │
│  [Proceed to Checkout]     │
│                            │
└────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `bg-white border border-gray-200 rounded-lg p-4 md:p-6` | Card appearance |
| Heading | `text-lg font-semibold text-gray-900 mb-4 pb-4 border-b` | Section title |
| Content | `space-y-4` | Vertical spacing |

### Container Height Considerations

| Content | Min Height | Max Height | Scrollable |
|---------|------------|------------|------------|
| Basic Summary | 250px | 400px | No |
| With Promo | 300px | 500px | No |
| Extended | 400px | 600px | Consider scroll |

### Summary Content Layout

```
Order Summary
───────────────
┌──────────────────────────┐
│ Subtotal    ₨4,500      │ ← space-y-4
│ Tax         ₨450        │    creates gaps
│ Shipping    ₨350        │
├──────────────────────────┤
│ Total       ₨5,300      │
├──────────────────────────┤
│ [Promo Code Input]       │
│ [Apply Button]           │
├──────────────────────────┤
│ [Proceed to Checkout]    │
└──────────────────────────┘
```

### Responsive Padding

| Screen Size | Padding | Border Radius |
|-------------|---------|---------------|
| Mobile | p-4 (16px) | rounded-lg |
| Tablet | p-5 (20px) | rounded-lg |
| Desktop | p-6 (24px) | rounded-lg |

### Sticky Positioning Context

```
Desktop View with Scroll:
┌─────────────────────────────────┐
│ Items Container (Long, Scrolls) │
│ ┌─────────────┐                 │
│ │ Item 1      │                 │
│ │ Item 2      │  ┌───────────┐  │
│ │ Item 3      │  │  Summary  │  │ ← Stays visible
│ │ Item 4      │  │  (Sticky) │  │   while scrolling
│ │ Item 5      │  └───────────┘  │
│ │   ↓         │                 │
│ │   ↓         │                 │
│ └─────────────┘                 │
└─────────────────────────────────┘
```

### Integration Example

```
<CartTwoColumnLayout
  itemsSlot={<CartItemsContainer>...</CartItemsContainer>}
  summarySlot={
    <CartSummaryContainer>
      <SummaryRow label="Subtotal" value="₨4,500" />
      <SummaryRow label="Shipping" value="₨350" />
      <Divider />
      <SummaryRow label="Total" value="₨4,850" isBold />
      <CheckoutButton />
    </CartSummaryContainer>
  }
/>
```

### Expected Outcome
- Professional order summary container
- Card-style appearance with border
- "Order Summary" heading
- Consistent spacing for child elements
- Works with sticky positioning
- Responsive padding

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartSummaryContainer.tsx` file created
- [ ] Component accepts children prop
- [ ] Container has white background
- [ ] Border and border-radius applied
- [ ] Padding configured (p-4 md:p-6)
- [ ] "Order Summary" heading displayed
- [ ] space-y utility applied for vertical spacing
- [ ] Compatible with sticky positioning
- [ ] Component exports properly

---

## Task 43: Create Cart Item Row

### Overview
Create the cart item row component that displays a single product in the cart. This component combines product image, details, variant information, quantity controls, pricing, and remove functionality in a horizontal layout, providing all essential information and actions for each cart item.

### Dependencies
- Task 41: Create Cart Items Container

### Instructions

1. **Create CartItemRow component file**
   - Create `CartItemRow.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CartItemRowProps` interface
   - Include item prop (CartItem type from store)
   - Include optional onRemove callback function
   - Include optional onUpdateQuantity callback
   - Include optional className prop

3. **Import required types and hooks**
   - Import CartItem type from cart store
   - Import hooks for cart operations (remove, update quantity)
   - Import child components (image, details, price components)

4. **Implement row container**
   - Create main container div with flexbox
   - Use horizontal layout (flex flex-row)
   - Set gap between elements (gap-4 md:gap-6)
   - Add padding (py-4 md:py-6)

5. **Structure row sections**
   - Left section: Product image (Task 44)
   - Middle section: Product details and variants (Tasks 45-46)
   - Right section: Price, quantity, total, remove (Tasks 47-48)

6. **Add responsive behavior**
   - Keep horizontal layout on desktop
   - Consider stacking or wrapping on very small mobile
   - Adjust gaps and padding for screen sizes

7. **Implement item actions**
   - Connect to cart store for remove action
   - Connect to cart store for quantity update
   - Handle loading states for actions
   - Show confirmation for remove (optional)

8. **Add hover effects**
   - Subtle background change on hover
   - Visual feedback for interactive elements
   - Maintain usability and accessibility

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| item | CartItem | Yes | - | Cart item data |
| onRemove | () => void | No | - | Remove item handler |
| onUpdateQuantity | (qty: number) => void | No | - | Update quantity handler |
| className | string | No | "" | Additional CSS classes |

### Cart Item Row Structure - Desktop

```
┌──────────────────────────────────────────────────────────┐
│  ┌──────┐  Product Name                    ₨1,500 × 2  │
│  │      │  Size: M, Color: Blue                        │
│  │ Img  │  SKU: PROD-001                    ₨3,000   │
│  │      │  [Qty: 2 ▼] [Remove]                         │
│  └──────┘                                               │
└──────────────────────────────────────────────────────────┘
    20%         50%                           30%
   Image      Details                       Price/Actions
```

### Cart Item Row Structure - Mobile

```
┌────────────────────────────────┐
│ ┌────┐  Product Name           │
│ │Img │  Size: M, Color: Blue   │
│ └────┘  ₨1,500                 │
│                                 │
│ Qty: 2 ▼    Total: ₨3,000     │
│ [Remove]                        │
└────────────────────────────────┘
```

### Row Layout Specifications

| Section | Width | Content | Alignment |
|---------|-------|---------|-----------|
| Image | 100-120px fixed | Product photo | Left |
| Details | Flex-grow | Name, variants, SKU | Left |
| Price/Actions | Auto | Price, qty, total, remove | Right |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex flex-row gap-4 md:gap-6 py-4 md:py-6` | Horizontal layout |
| Image Section | `flex-shrink-0` | Fixed image size |
| Details Section | `flex-grow` | Takes available space |
| Price Section | `flex-shrink-0 text-right` | Right-aligned pricing |

### Responsive Breakpoints

| Screen Size | Layout | Image Size | Gap | Padding Y |
|-------------|--------|------------|-----|-----------|
| Mobile (< 640px) | Horizontal | 80px | 12px | 16px |
| Tablet (640-1024px) | Horizontal | 100px | 16px | 20px |
| Desktop (> 1024px) | Horizontal | 120px | 24px | 24px |

### Cart Item Data Structure

```
CartItem {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  quantity: number
  image: string
  variants: {
    [key: string]: string
  }
  sku: string
  lineTotal: number
}
```

### Action Handlers

| Action | Handler | Purpose |
|--------|---------|---------|
| Remove Item | onRemove() | Delete from cart |
| Update Quantity | onUpdateQuantity(qty) | Change item quantity |
| View Product | Navigate to product page | Product details |

### Interactive Elements

```
Cart Item Row
├── Product Image → Links to product page
├── Product Name → Links to product page
├── Quantity Selector → Updates cart
├── Remove Button → Removes item
└── Price → Display only
```

### Expected Outcome
- Complete cart item row component
- Horizontal layout with three sections
- Responsive design for all screen sizes
- Integrated with cart store for actions
- Ready to receive child components
- Interactive elements functional

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartItemRow.tsx` file created
- [ ] Component accepts item prop (CartItem type)
- [ ] Horizontal flexbox layout implemented
- [ ] Three sections defined (image, details, price)
- [ ] Gap and padding configured
- [ ] Props interface defined properly
- [ ] Slots for child components prepared
- [ ] onRemove and onUpdateQuantity handlers supported
- [ ] Component exports properly

---

## Task 44: Create Cart Item Image

### Overview
Create a component that displays the product image within the cart item row. This component handles image display with proper sizing, aspect ratio, fallback for missing images, and click functionality to navigate to the product page.

### Dependencies
- Task 43: Create Cart Item Row

### Instructions

1. **Create CartItemImage component file**
   - Create `CartItemImage.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CartItemImageProps` interface
   - Include src prop (string) for image URL
   - Include alt prop (string) for image description
   - Include productSlug prop (string) for product page link
   - Include optional size prop ("sm" | "md" | "lg")

3. **Import Next.js Image and Link**
   - Import Image component from next/image
   - Import Link component from next/link
   - Use for optimization and navigation

4. **Implement image container**
   - Create wrapper div with fixed dimensions
   - Set width and height based on size prop
   - Apply flex-shrink-0 to prevent shrinking

5. **Configure image component**
   - Use Next.js Image component
   - Set width and height props
   - Set alt text for accessibility
   - Configure object-fit (cover) for proper scaling

6. **Add link wrapper**
   - Wrap image in Next.js Link component
   - Link to product page using slug (/products/{slug})
   - Enable navigation to product on click

7. **Apply image styling**
   - Add border (border border-gray-200)
   - Add border radius (rounded-md)
   - Add hover effect (hover:opacity-80)
   - Ensure proper aspect ratio (1:1 square)

8. **Implement fallback image**
   - Handle missing or broken images
   - Use placeholder or default product image
   - Use onError handler or fallback prop

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| src | string | Yes | - | Image URL |
| alt | string | Yes | - | Image alt text |
| productSlug | string | Yes | - | Product slug for link |
| size | "sm" \| "md" \| "lg" | No | "md" | Image size variant |
| className | string | No | "" | Additional CSS classes |

### Image Size Variants

| Size | Dimensions | Use Case | Tailwind Class |
|------|------------|----------|----------------|
| Small | 80px × 80px | Mobile cart | w-20 h-20 |
| Medium | 100px × 100px | Standard cart | w-24 h-24 or w-28 h-28 |
| Large | 120px × 120px | Desktop cart | w-30 h-30 |

### Image Structure

```
┌─────────────────┐
│ Link Wrapper    │
│ ┌─────────────┐ │
│ │             │ │
│ │   Product   │ │
│ │   Image     │ │
│ │   (1:1)     │ │
│ │             │ │
│ └─────────────┘ │
│  ↑ Next Image   │
└─────────────────┘
   ↑ Clickable
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex-shrink-0 w-24 h-24 md:w-28 md:h-28` | Fixed size |
| Link | `block rounded-md overflow-hidden hover:opacity-80` | Clickable wrapper |
| Image | `object-cover border border-gray-200` | Image styling |

### Responsive Sizing

| Screen Size | Image Size | Dimensions | Class |
|-------------|------------|------------|-------|
| Mobile (< 640px) | Small | 80px × 80px | w-20 h-20 |
| Tablet (640-1024px) | Medium | 100px × 100px | w-24 h-24 |
| Desktop (> 1024px) | Medium/Large | 112px × 112px | w-28 h-28 |

### Image Optimization

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| Next.js Image | Use Image component | Automatic optimization |
| Lazy Loading | Built-in with Image | Performance |
| Responsive | Sizes prop | Correct resolution |
| Format | WebP/AVIF | Smaller file size |

### Fallback Handling

```
Image Loading States:
┌────────────────────┐
│ Loading            │
│ ┌────────────────┐ │
│ │  Skeleton or   │ │
│ │  Spinner       │ │
│ └────────────────┘ │
└────────────────────┘
        ↓
┌────────────────────┐     ┌────────────────────┐
│ Success            │     │ Error              │
│ ┌────────────────┐ │     │ ┌────────────────┐ │
│ │  Product       │ │ or  │ │  Placeholder   │ │
│ │  Image         │ │     │ │  Image         │ │
│ └────────────────┘ │     │ └────────────────┘ │
└────────────────────┘     └────────────────────┘
```

### Link Behavior

| Interaction | Behavior |
|-------------|----------|
| Click | Navigate to /products/{slug} |
| Hover | Opacity 80% transition |
| Focus | Focus ring visible |
| Right-click | Context menu (open in new tab) |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Alt Text | Descriptive product name |
| Focus Indicator | Visible focus ring |
| Keyboard Nav | Tab accessible |
| Screen Reader | Announces "Link to {product}" |

### Expected Outcome
- Responsive product image component
- Square aspect ratio (1:1)
- Clickable link to product page
- Hover effect for visual feedback
- Fallback for missing images
- Optimized with Next.js Image

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartItemImage.tsx` file created
- [ ] Component accepts src, alt, productSlug props
- [ ] Next.js Image component used
- [ ] Link wrapper to product page implemented
- [ ] Fixed dimensions configured (w-24 h-24 or similar)
- [ ] Border and border-radius applied
- [ ] Hover effect implemented (opacity-80)
- [ ] Aspect ratio maintained (1:1)
- [ ] Size variants supported (optional)
- [ ] Component exports properly

---

## Task 45: Create Cart Item Details

### Overview
Create a component that displays the product details within the cart item row, including product name, variant information, SKU, and quantity controls. This component provides the core information section of each cart item, positioned between the image and pricing sections.

### Dependencies
- Task 43: Create Cart Item Row

### Instructions

1. **Create CartItemDetails component file**
   - Create `CartItemDetails.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CartItemDetailsProps` interface
   - Include name prop (string) for product name
   - Include productSlug prop (string) for product link
   - Include variants prop (object) for variant info
   - Include sku prop (string, optional) for SKU display
   - Include quantity prop (number) for quantity control
   - Include onUpdateQuantity callback function

3. **Implement details container**
   - Create flex container with vertical layout
   - Apply flex-grow to take available space
   - Set gap between elements (gap-2)

4. **Create product name element**
   - Display product name as link to product page
   - Use Next.js Link component
   - Apply text styling (text-base md:text-lg font-medium)
   - Add hover effect (hover:text-blue-600)

5. **Add variant tags slot**
   - Reserve space for variant tags (Task 46)
   - Pass variants data to CartItemVariantTags component
   - Display variant badges (e.g., "Size: M", "Color: Red")

6. **Add SKU display (optional)**
   - Show SKU if provided
   - Use smaller text size (text-xs text-gray-500)
   - Format as "SKU: PROD-001"

7. **Add quantity control section**
   - Create quantity selector (dropdown or +/- buttons)
   - Display current quantity
   - Connect to onUpdateQuantity handler
   - Add "Remove" link or button

8. **Implement responsive layout**
   - Adjust text sizes for mobile vs desktop
   - Ensure readability on small screens
   - Stack elements vertically with proper spacing

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| name | string | Yes | - | Product name |
| productSlug | string | Yes | - | Product page slug |
| variants | Record<string, string> | No | {} | Variant options |
| sku | string | No | - | Product SKU |
| quantity | number | Yes | - | Current quantity |
| onUpdateQuantity | (qty: number) => void | Yes | - | Quantity update handler |
| onRemove | () => void | No | - | Remove item handler |
| className | string | No | "" | Additional CSS classes |

### Details Structure

```
┌────────────────────────────────────┐
│  Product Name (Link)               │
│  ─────────────                     │
│  [Size: M] [Color: Blue]           │ ← Variant tags
│  SKU: PROD-001                     │
│  Qty: [2 ▼] Remove                 │
└────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex flex-col gap-2 flex-grow` | Vertical layout |
| Product Name | `text-base md:text-lg font-medium hover:text-blue-600` | Prominent title |
| Variant Container | `flex flex-wrap gap-1` | Variant badges |
| SKU | `text-xs text-gray-500` | Subtle identifier |
| Quantity Section | `flex items-center gap-3` | Controls layout |

### Product Name Link

| State | Styling | Behavior |
|-------|---------|----------|
| Normal | text-gray-900, font-medium | Display name |
| Hover | text-blue-600, underline | Visual feedback |
| Focus | focus:ring | Accessibility |
| Visited | Maintain color | Consistency |

### Quantity Control Options

| Option | Description | Complexity | Recommended |
|--------|-------------|------------|-------------|
| Dropdown | Select with options 1-10+ | Low | Yes |
| +/- Buttons | Increment/decrement | Medium | Yes |
| Input Field | Manual entry | Low | For large qty |

### Quantity Selector Structure

```
Option A: Dropdown
┌─────────────────┐
│ Qty: [2 ▼]     │
└─────────────────┘

Option B: +/- Buttons
┌─────────────────┐
│ [−] 2 [+]      │
└─────────────────┘
```

### Variants Display

| Variant Data | Display Format | Example |
|--------------|----------------|---------|
| { size: "M" } | "Size: M" | Size: M |
| { color: "Red" } | "Color: Red" | Color: Red |
| Multiple | Separate badges | Size: M, Color: Red |

### SKU Display Format

| Data | Display | Visibility |
|------|---------|------------|
| "PROD-001" | "SKU: PROD-001" | Always |
| undefined | Not displayed | Hidden |
| null | Not displayed | Hidden |

### Remove Link Styling

| Element | Styling | Purpose |
|---------|---------|---------|
| Text | text-sm text-red-600 | Warning color |
| Hover | hover:text-red-800 hover:underline | Visual feedback |
| Position | Inline with quantity | Space-efficient |

### Responsive Behavior

```
Desktop
┌───────────────────────────────┐
│ Product Name (Large)          │
│ [Size: M] [Color: Blue]       │
│ SKU: PROD-001                 │
│ Qty: [2 ▼]  Remove           │
└───────────────────────────────┘

Mobile
┌─────────────────────────┐
│ Product Name            │
│ [Size: M] [Color: Blue] │
│ SKU: PROD-001           │
│ Qty: [2 ▼]             │
│ Remove                  │
└─────────────────────────┘
```

### Expected Outcome
- Complete cart item details component
- Product name as clickable link
- Variant tags display (using Task 46 component)
- SKU display (if provided)
- Quantity control with update handler
- Remove link/button
- Vertical layout with proper spacing

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartItemDetails.tsx` file created
- [ ] Component accepts all required props
- [ ] Product name displays as link with hover effect
- [ ] Variant tags component integrated
- [ ] SKU displays conditionally
- [ ] Quantity selector implemented
- [ ] Remove link/button added
- [ ] flex-grow applied for space filling
- [ ] Responsive text sizing configured
- [ ] Component exports properly

---

## Task 46: Create Cart Item Variant Tags

### Overview
Create a component that displays product variant information (like size, color, material) as styled badge tags within the cart item details. This component formats variant data into readable, visually distinct badges that clearly communicate product specifications.

### Dependencies
- Task 45: Create Cart Item Details

### Instructions

1. **Create CartItemVariantTags component file**
   - Create `CartItemVariantTags.tsx` in `components/storefront/cart/CartPage/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CartItemVariantTagsProps` interface
   - Include variants prop (Record<string, string>) for variant data
   - Include optional className prop for styling
   - Include optional maxDisplay prop to limit tags shown

3. **Implement variants parsing**
   - Convert variants object to array of key-value pairs
   - Format each variant for display
   - Handle empty variants gracefully

4. **Create tag container**
   - Use flex layout with wrapping (flex flex-wrap)
   - Set gap between tags (gap-1 or gap-2)
   - Allow tags to wrap to multiple lines if needed

5. **Create individual variant tags**
   - Map over variants array
   - Create badge/pill for each variant
   - Format as "Key: Value" (e.g., "Size: M")

6. **Apply tag styling**
   - Set background color (bg-gray-100 or bg-blue-50)
   - Set text color (text-gray-700 or text-blue-700)
   - Set text size (text-xs)
   - Add padding (px-2 py-1)
   - Add border radius (rounded-full or rounded-md)

7. **Handle special variant types**
   - Consider color variants with color swatches
   - Format variant names (capitalize, clean)
   - Handle long variant values (truncate if needed)

8. **Implement max display limit (optional)**
   - Limit number of visible tags
   - Show "+ X more" for hidden tags
   - Allow expansion on click (optional)

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variants | Record<string, string> | Yes | - | Variant key-value pairs |
| maxDisplay | number | No | - | Max tags to display |
| className | string | No | "" | Additional CSS classes |

### Variant Data Examples

| Input Data | Display Output |
|------------|----------------|
| { size: "M" } | `Size: M` |
| { size: "M", color: "Red" } | `Size: M` `Color: Red` |
| { size: "L", color: "Blue", material: "Cotton" } | `Size: L` `Color: Blue` `Material: Cotton` |

### Tag Structure

```
┌──────────────────────────────────────┐
│ [Size: M] [Color: Blue] [Fit: Slim] │
│  ───────   ──────────   ──────────   │
│   Badge      Badge         Badge     │
└──────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex flex-wrap gap-1.5` | Wrapping tag layout |
| Tag Badge | `bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full` | Pill badge style |
| Alternative | `bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md` | Blue variant |

### Tag Variants

| Style | Background | Text Color | Border Radius | Use Case |
|-------|------------|------------|---------------|----------|
| Gray Pill | bg-gray-100 | text-gray-700 | rounded-full | Neutral |
| Blue Pill | bg-blue-50 | text-blue-700 | rounded-full | Branded |
| Gray Box | bg-gray-100 | text-gray-700 | rounded-md | Compact |
| Bordered | bg-white | text-gray-700 | rounded-md + border | Outlined |

### Variant Formatting

| Input Key | Formatted Label | Example Value | Display |
|-----------|-----------------|---------------|---------|
| size | Size | "M" | Size: M |
| color | Color | "Red" | Color: Red |
| material | Material | "Cotton" | Material: Cotton |
| fit | Fit | "Slim" | Fit: Slim |

### Special Variant Types

```
Color Variant with Swatch:
┌──────────────────────┐
│ Color: ● Red         │
│        ↑ Color dot   │
└──────────────────────┘

Standard Variant:
┌──────────────────────┐
│ Size: M              │
└──────────────────────┘
```

### Handling Multiple Variants

| Count | Display Strategy |
|-------|------------------|
| 0 | Show nothing |
| 1-3 | Show all tags |
| 4-6 | Show all or limit with "more" |
| 7+ | Show first 3-4 + "Show more" |

### Max Display Implementation

```
Variants: [Size: M, Color: Red, Material: Cotton, Fit: Slim]

With maxDisplay={2}:
┌──────────────────────────────┐
│ [Size: M] [Color: Red] +2    │
└──────────────────────────────┘
```

### Responsive Behavior

```
Desktop - Single Line:
[Size: M] [Color: Blue] [Material: Cotton]

Mobile - Wrapped:
[Size: M] [Color: Blue]
[Material: Cotton]
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Semantic HTML | Use span or div for tags |
| Text Content | Include full variant info |
| ARIA Labels | Optional aria-label for complex variants |
| Contrast | Ensure text readable on background |

### Expected Outcome
- Reusable variant tags component
- Pill or badge-style tags for each variant
- Formatted as "Key: Value"
- Flex-wrap layout for responsive behavior
- Optional color swatches for color variants
- Clean, readable presentation

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartPage/CartItemVariantTags.tsx` file created
- [ ] Component accepts variants object prop
- [ ] Tags displayed as pill/badge style
- [ ] Each tag formatted as "Key: Value"
- [ ] flex-wrap layout implemented
- [ ] Gap between tags configured
- [ ] Background and text colors applied
- [ ] Text size set to text-xs
- [ ] Border radius applied (rounded-full or rounded-md)
- [ ] Handles empty variants gracefully
- [ ] Component exports properly

---

## Summary

This document established the core structure of the cart page, including the main container, header with item count, responsive two-column layout, and detailed cart item rows with images, product details, and variant information. These components form the foundation for displaying cart contents with proper organization and visual hierarchy.

### Completed Tasks
1. ✓ Created cart page container with proper constraints
2. ✓ Created cart page header with "Shopping Cart" title
3. ✓ Created cart item count display component
4. ✓ Created responsive two-column grid layout with sticky summary
5. ✓ Created cart items container for left column
6. ✓ Created cart summary container for right column
7. ✓ Created cart item row with horizontal layout
8. ✓ Created cart item image component with product link
9. ✓ Created cart item details with name and controls
10. ✓ Created variant tags component for product specifications

### Next Steps
Proceed to [02_Tasks-47-54_Price-Empty-Mobile.md](02_Tasks-47-54_Price-Empty-Mobile.md) to implement pricing display components, empty cart state, mobile layout optimization, and complete cart page verification.
