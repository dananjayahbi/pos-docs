# Tasks 85-93: Order Sidebar & API Service

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** F - Order Sidebar & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 85, 86, 87, 88, 89, 90, 91, 92, 93

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-94-98_Comprehensive-Testing.md](02_Tasks-94-98_Comprehensive-Testing.md)

---

## Document Overview

This document covers the creation of the order sidebar component and the order API service. The order sidebar provides customers with a real-time summary of their order throughout the checkout process, displaying cart items, pricing breakdown, shipping costs, fees, and the total amount. The sidebar is sticky on desktop for persistent visibility and collapsible on mobile devices for optimal screen space utilization. Additionally, this document establishes the API service responsible for order submission and cart data retrieval.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Create Order Sidebar | Medium | 45 min |
| 86 | Create Sidebar Items List | Low | 25 min |
| 87 | Create Sidebar Item Row | Low | 20 min |
| 88 | Create Sidebar Subtotal | Low | 20 min |
| 89 | Create Sidebar Shipping | Low | 20 min |
| 90 | Create Sidebar Discount | Low | 20 min |
| 91 | Create Sidebar Total | Low | 20 min |
| 92 | Create Collapsible Sidebar | Medium | 40 min |
| 93 | Create Order API Service | Medium | 50 min |

---

## Task 85: Create Order Sidebar

### Overview
Create the main order sidebar component that serves as the container for the order summary throughout the checkout process. This sidebar is positioned in the right column on desktop views and displays a complete breakdown of the customer's order including items, pricing, shipping, fees, and totals. The sidebar uses sticky positioning to remain visible as the user scrolls through the checkout form.

### Dependencies
- Task 84: Verify Step 4 Flow (ensures checkout flow is ready)
- Checkout store implemented (from previous tasks)
- Cart items available in application state

### Instructions

1. **Create sidebar component directory**
   - Navigate to `frontend/components/storefront/checkout/`
   - Create `OrderSidebar/` directory
   - This organizes all sidebar-related components

2. **Create main sidebar component file**
   - Create `OrderSidebar.tsx` in the OrderSidebar directory
   - Set up component structure with TypeScript
   - Import necessary dependencies

3. **Define component structure**
   - Create functional component using React hooks
   - Accept props for cart data and checkout state
   - Set up local state for sidebar visibility (mobile)

4. **Implement desktop layout**
   - Container with 30-35% width
   - Right column positioning
   - Light gray background (e.g., #F9FAFB)
   - Rounded corners and subtle shadow

5. **Configure sticky positioning**
   - Use CSS `position: sticky`
   - Set `top` value (e.g., 80px to account for header)
   - Enable on viewports ≥1024px (desktop)
   - Ensure natural scroll behavior

6. **Add sidebar header**
   - Display "Order Summary" heading
   - Show item count badge (e.g., "3 items")
   - Use medium-large font weight
   - Include bottom border separator

7. **Create sidebar content sections**
   - Items list section (placeholder for Task 86)
   - Pricing breakdown section (placeholders for Tasks 88-91)
   - Ensure proper spacing between sections
   - Add divider lines where appropriate

8. **Implement responsive behavior**
   - Desktop (≥1024px): Sticky right column
   - Tablet (768px-1023px): Non-sticky right column
   - Mobile (<768px): Full width, collapsible (Task 92)

9. **Add loading states**
   - Show skeleton loader while cart data loads
   - Display loading indicator for price calculations
   - Graceful handling of empty cart state

10. **Integrate with checkout store**
    - Subscribe to cart items from store
    - Subscribe to shipping cost selection
    - Subscribe to discount code application
    - Subscribe to payment method selection (for fees)

11. **Create index file**
    - Create `index.ts` in OrderSidebar directory
    - Export OrderSidebar component as default
    - Export any sidebar-related types

### Component Structure

```
OrderSidebar Component
├── Sidebar Container
│   ├── Sticky positioning (desktop)
│   ├── Background styling
│   └── Responsive width
├── Sidebar Header
│   ├── "Order Summary" title
│   └── Item count badge
├── Items Section
│   └── Placeholder for SidebarItemsList (Task 86)
├── Pricing Section
│   ├── Placeholder for SidebarSubtotal (Task 88)
│   ├── Placeholder for SidebarShipping (Task 89)
│   ├── Placeholder for SidebarDiscount (Task 90)
│   └── Placeholder for SidebarTotal (Task 91)
└── Mobile Controls
    └── Placeholder for CollapsibleSidebar (Task 92)
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container Width | Desktop | 30-35% |
| Container Width | Mobile | 100% |
| Background | Color | #F9FAFB or similar light gray |
| Border Radius | All corners | 8px |
| Padding | Internal | 20-24px |
| Shadow | Box shadow | Subtle (e.g., 0 1px 3px rgba(0,0,0,0.1)) |
| Position | Desktop | sticky |
| Top Offset | Desktop | 80-100px |
| Z-Index | Stacking | 10 |

### Responsive Breakpoints

| Breakpoint | Behavior | Layout |
|------------|----------|--------|
| ≥1280px | Full sticky sidebar | Right column, 30% width |
| 1024-1279px | Full sticky sidebar | Right column, 35% width |
| 768-1023px | Non-sticky sidebar | Right column, 40% width |
| <768px | Collapsible sidebar | Full width, above form |

### State Management

| State | Type | Purpose |
|-------|------|---------|
| cartItems | Array | List of items in cart |
| subtotal | Number | Sum of item prices |
| shippingCost | Number | Selected shipping cost |
| discount | Number | Applied discount amount |
| total | Number | Final order total |
| isLoading | Boolean | Loading state for calculations |

### Sidebar Sections

```
Order Summary Sidebar
│
├── Header Section
│   ├── Title: "Order Summary"
│   └── Badge: "(3 items)"
│
├── Items Section
│   └── Component: <SidebarItemsList />
│
├── Divider Line
│
├── Pricing Breakdown
│   ├── <SidebarSubtotal />
│   ├── <SidebarShipping />
│   ├── <SidebarDiscount /> (conditional)
│   └── Divider Line
│
├── Total Section
│   └── <SidebarTotal />
│
└── Mobile Toggle (< 768px)
    └── <CollapsibleSidebar />
```

### Integration Points

| Component | Connection | Data Flow |
|-----------|------------|-----------|
| Cart Store | Subscribe | Receives cart items |
| Shipping Store | Subscribe | Receives shipping selection |
| Discount Store | Subscribe | Receives discount codes |
| Payment Store | Subscribe | Receives payment method (for fees) |
| Items List | Child | Passes cart items |
| Pricing Components | Children | Passes calculated values |

### Expected Outcome
- Fully functional order sidebar component
- Sticky positioning on desktop viewports
- Proper integration with checkout state
- Responsive layout across all screen sizes
- Loading states for async operations
- Foundation for child components (Tasks 86-92)

### Verification Checklist
- [ ] `OrderSidebar.tsx` created in correct directory
- [ ] Component renders with proper styling
- [ ] Sticky positioning works on desktop
- [ ] Sidebar subscribes to checkout store
- [ ] Header displays title and item count
- [ ] Section placeholders for child components
- [ ] Responsive behavior at all breakpoints
- [ ] Loading states display correctly
- [ ] `index.ts` exports component properly

---

## Task 86: Create Sidebar Items List

### Overview
Create the items list component that displays all products in the customer's cart within the order sidebar. This component shows a compact view of cart items, limited to displaying 3-4 items initially with scrolling enabled if more items exist. Each item is rendered using the SidebarItemRow component (Task 87).

### Dependencies
- Task 85: Create Order Sidebar (provides container)
- Cart data available in checkout store

### Instructions

1. **Create items list component**
   - Create `SidebarItemsList.tsx` in OrderSidebar directory
   - Set up functional component with TypeScript
   - Define props interface for cart items

2. **Accept cart items as props**
   - Define prop type: array of cart item objects
   - Each item contains: id, name, image, price, quantity, variant
   - Add TypeScript types for type safety

3. **Implement scrollable container**
   - Set maximum height (e.g., 250-300px for 3-4 items)
   - Enable vertical scrolling if items exceed max height
   - Custom scrollbar styling (subtle, minimal)
   - Smooth scrolling behavior

4. **Map items to rows**
   - Iterate over cart items array
   - Render placeholder for SidebarItemRow (Task 87)
   - Pass item data to each row component
   - Add unique key prop for each item

5. **Handle empty state**
   - Display message if cart is empty
   - Show "Your cart is empty" with appropriate styling
   - Optional: Add button to return to shopping

6. **Add spacing between items**
   - Add margin or padding between item rows
   - Ensure visual separation without excessive space
   - Consistent spacing throughout list

7. **Implement loading state**
   - Show skeleton loaders while items load
   - Display 2-3 skeleton rows
   - Match skeleton to actual row height

8. **Optimize for performance**
   - Use React.memo for item rows if needed
   - Avoid unnecessary re-renders
   - Efficient list rendering

### Component Structure

```
SidebarItemsList Component
├── Items Container
│   ├── Max height constraint
│   ├── Overflow-y: auto
│   └── Custom scrollbar
├── Item Rows (mapped)
│   └── SidebarItemRow × n items
├── Empty State (conditional)
│   ├── Message
│   └── Optional CTA
└── Loading State (conditional)
    └── Skeleton loaders
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | Max Height | 250-300px |
| Container | Overflow Y | auto |
| Container | Overflow X | hidden |
| Scrollbar Width | Webkit | 6px |
| Scrollbar Track | Color | Transparent |
| Scrollbar Thumb | Color | #D1D5DB |
| Scrollbar Thumb Hover | Color | #9CA3AF |
| Item Spacing | Margin Bottom | 12px |

### Scroll Behavior

| Scenario | Behavior |
|----------|----------|
| ≤3 items | No scroll, all visible |
| 4 items | Slight scroll, mostly visible |
| 5+ items | Scroll enabled, shows 3-4 |
| Scrollbar | Appears only on hover/scroll |

### Cart Item Data Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Unique item ID | "item_abc123" |
| productId | string | Product ID | "prod_xyz789" |
| name | string | Product name | "Premium T-Shirt" |
| variant | object | Size, color, etc. | {size: "L", color: "Blue"} |
| image | string | Thumbnail URL | "/images/tshirt-thumb.jpg" |
| price | number | Unit price | 3000 |
| quantity | number | Item quantity | 2 |
| subtotal | number | price × quantity | 6000 |

### Empty State Design

```
Empty Cart Display
├── Icon (shopping bag)
│   └── Light gray, centered
├── Message
│   └── "Your cart is empty"
├── Subtext
│   └── "Add items to get started"
└── Optional Button
    └── "Continue Shopping"
```

### Loading State Pattern

```
Skeleton Loader (per item)
├── Image Placeholder
│   └── 50x50px gray box
├── Text Placeholders
│   ├── Name: 100px wide bar
│   ├── Variant: 80px wide bar
│   └── Price: 60px wide bar
└── Quantity Badge
    └── 20x20px circle
```

### Performance Considerations

| Optimization | Implementation |
|--------------|----------------|
| Memo Row Components | Prevent re-renders of unchanged items |
| Virtual Scrolling | If >20 items (optional, future enhancement) |
| Image Lazy Loading | Load images as they scroll into view |
| Debounce Updates | Throttle cart updates during rapid changes |

### Integration with Sidebar

```
OrderSidebar
└── Items Section
    └── <SidebarItemsList items={cartItems} />
        ├── Props: cartItems array
        ├── Maps to: <SidebarItemRow /> components
        └── Renders: 3-4 visible, scroll for more
```

### Expected Outcome
- Scrollable list of cart items
- Shows 3-4 items without scrolling
- Enables scrolling for additional items
- Empty state for no items
- Loading state with skeletons
- Foundation for SidebarItemRow components (Task 87)

### Verification Checklist
- [ ] `SidebarItemsList.tsx` created in OrderSidebar directory
- [ ] Component accepts cart items as props
- [ ] Maximum height set with scrolling enabled
- [ ] Items map to SidebarItemRow placeholders
- [ ] Empty state displays when no items
- [ ] Loading state shows skeleton loaders
- [ ] Scrollbar styling is subtle and minimal
- [ ] Component integrates with OrderSidebar

---

## Task 87: Create Sidebar Item Row

### Overview
Create the individual item row component that displays a single cart item within the sidebar items list. This component presents a compact view of the product including a small thumbnail image, product name, selected variants, quantity badge, and item price. The row is designed to be space-efficient while providing all essential information.

### Dependencies
- Task 86: Create Sidebar Items List (provides parent container)
- Cart item data structure defined

### Instructions

1. **Create item row component**
   - Create `SidebarItemRow.tsx` in OrderSidebar directory
   - Set up functional component with TypeScript
   - Define props interface for item data

2. **Define props interface**
   - Accept item object with all necessary fields
   - Include: id, name, image, variant, quantity, price
   - Add optional fields: subtotal, productUrl
   - Ensure type safety with TypeScript

3. **Implement row layout**
   - Horizontal flexbox layout
   - Thumbnail on left (50x50px)
   - Content section in middle
   - Price on right
   - Align items to center vertically

4. **Display product thumbnail**
   - Render image with 50x50px dimensions
   - Apply rounded corners (4-6px)
   - Add border or subtle shadow
   - Use object-fit: cover for proper scaling
   - Implement lazy loading
   - Fallback placeholder if image fails

5. **Show product name**
   - Display product name prominently
   - Truncate if exceeds 2 lines
   - Medium font weight
   - Dark gray color (#1F2937 or similar)

6. **Display variant information**
   - Show size, color, or other variants
   - Smaller font size than name
   - Light gray color (#6B7280 or similar)
   - Format: "Size: L, Color: Blue"
   - Truncate if too long

7. **Show quantity badge**
   - Display as "×2" or "Qty: 2" format
   - Small badge with subtle background
   - Position near variant or as separate element
   - Use consistent styling

8. **Display item price**
   - Show unit price or line total
   - Right-aligned
   - Currency symbol: ₨
   - Format: ₨3,000 (with comma separators)
   - Medium font weight

9. **Add hover effects (optional)**
   - Subtle background color change on hover
   - Indicate interactivity if row is clickable
   - Smooth transition animation

10. **Handle long text**
    - Truncate product name with ellipsis
    - Ensure variant text doesn't overflow
    - Maintain row height consistency

### Component Structure

```
SidebarItemRow Component
├── Row Container (flex)
│   ├── Thumbnail Section
│   │   ├── Product image (50x50)
│   │   └── Fallback placeholder
│   ├── Content Section (flex-grow)
│   │   ├── Product Name
│   │   │   ├── Truncated text
│   │   │   └── Dark color
│   │   ├── Variant Info
│   │   │   ├── Size/color
│   │   │   └── Light color
│   │   └── Quantity Badge
│   │       └── "×2" format
│   └── Price Section
│       └── ₨3,000 (formatted)
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Row Container | Display | flex |
| Row Container | Align Items | center |
| Row Container | Gap | 12px |
| Row Container | Padding | 8px 0 |
| Thumbnail | Width × Height | 50px × 50px |
| Thumbnail | Border Radius | 6px |
| Thumbnail | Object Fit | cover |
| Thumbnail | Border | 1px solid #E5E7EB |
| Name | Font Size | 14px |
| Name | Font Weight | 500 (medium) |
| Name | Color | #1F2937 |
| Name | Line Clamp | 2 |
| Variant | Font Size | 12px |
| Variant | Color | #6B7280 |
| Quantity | Font Size | 12px |
| Quantity | Background | #F3F4F6 |
| Quantity | Padding | 2px 6px |
| Quantity | Border Radius | 4px |
| Price | Font Size | 14px |
| Price | Font Weight | 500 |
| Price | Color | #1F2937 |

### Layout Dimensions

```
Row Layout (Total height: ~66px)
├── Thumbnail: 50px × 50px (left)
│   └── Margin-right: 12px
├── Content: flex-grow (middle)
│   ├── Name: 14px line-height
│   ├── Variant: 12px line-height
│   └── Quantity: 20px height
└── Price: auto width (right)
    └── Align-self: flex-start or center
```

### Variant Display Format

| Variant Type | Display Example |
|--------------|-----------------|
| Size Only | "Size: L" |
| Color Only | "Color: Blue" |
| Size + Color | "L • Blue" or "Size: L, Color: Blue" |
| Custom Attribute | "Material: Cotton" |
| Multiple | "L • Blue • Cotton" |

### Price Formatting

| Input | Output | Currency |
|-------|--------|----------|
| 3000 | ₨3,000 | LKR |
| 15000 | ₨15,000 | LKR |
| 500 | ₨500 | LKR |
| 125000 | ₨125,000 | LKR |

### Image Fallback Strategy

```
Image Loading States
├── Loading
│   └── Skeleton placeholder (gray)
├── Loaded
│   └── Actual product image
└── Error
    └── Default placeholder icon or image
```

### Text Truncation Rules

| Field | Max Lines | Overflow |
|-------|-----------|----------|
| Product Name | 2 | Ellipsis (...) |
| Variant Info | 1 | Ellipsis (...) |
| Price | 1 | No truncation (should fit) |

### Responsive Behavior

| Viewport | Layout Adjustments |
|----------|-------------------|
| Desktop (≥1024px) | Standard layout, all elements visible |
| Tablet (768-1023px) | Slightly reduced spacing |
| Mobile (<768px) | Smaller font sizes, compact layout |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Image Alt Text | Descriptive alt attribute with product name |
| Semantic HTML | Use appropriate tags (img, span, div) |
| ARIA Labels | Add labels for screen readers if needed |
| Keyboard Navigation | Ensure row is focusable if clickable |

### Expected Outcome
- Compact, readable item row component
- 50x50px product thumbnail with fallback
- Product name and variant display
- Quantity badge and price
- Consistent row height and spacing
- Proper text truncation for long names
- Integration with SidebarItemsList

### Verification Checklist
- [ ] `SidebarItemRow.tsx` created in OrderSidebar directory
- [ ] Component accepts item props with proper types
- [ ] Thumbnail displays at 50x50px with rounded corners
- [ ] Product name displays with truncation
- [ ] Variant information shows correctly
- [ ] Quantity badge displays (×2 format)
- [ ] Price formats correctly with ₨ symbol
- [ ] Row layout is responsive and consistent
- [ ] Image fallback works when image fails to load
- [ ] Component integrates with SidebarItemsList

---

## Task 88: Create Sidebar Subtotal

### Overview
Create the subtotal component that displays the sum of all item prices before shipping, taxes, and discounts. This component shows the subtotal amount in LKR currency with proper formatting and includes an item count indicator. It serves as the first line item in the pricing breakdown section of the sidebar.

### Dependencies
- Task 85: Create Order Sidebar (provides container)
- Cart items with prices available in checkout store

### Instructions

1. **Create subtotal component**
   - Create `SidebarSubtotal.tsx` in OrderSidebar directory
   - Set up functional component with TypeScript
   - Define props interface for subtotal data

2. **Accept subtotal props**
   - Subtotal amount (number)
   - Item count (number)
   - Optional: loading state (boolean)
   - Ensure type safety

3. **Implement component layout**
   - Horizontal flexbox layout
   - Label on left, value on right
   - Space-between alignment
   - Bottom border or spacing separator

4. **Display subtotal label**
   - Text: "Subtotal"
   - Medium gray color (#6B7280 or similar)
   - Regular font weight
   - Align left

5. **Display item count**
   - Format: "(3 items)" or "3 items"
   - Smaller font size than label
   - Light gray color
   - Position below or next to label

6. **Display subtotal amount**
   - Currency: ₨ (Sri Lankan Rupees)
   - Format: ₨5,000 (with comma separator)
   - Dark gray or black color
   - Medium font weight
   - Right-aligned

7. **Calculate subtotal**
   - Sum all cart item prices × quantities
   - Formula: Σ(item.price × item.quantity)
   - Handle decimal precision (2 decimal places)
   - Round to nearest rupee if needed

8. **Add loading state**
   - Show skeleton loader when calculating
   - Display animated placeholder
   - Match layout of actual content

9. **Handle edge cases**
   - Zero items: display "₨0"
   - Negative values: prevent display or show as ₨0
   - Very large amounts: format with proper separators

10. **Add bottom spacing**
    - Margin or padding below component
    - Prepare for next pricing component
    - Consistent spacing in sidebar

### Component Structure

```
SidebarSubtotal Component
├── Container (flex, space-between)
│   ├── Left Section
│   │   ├── Label: "Subtotal"
│   │   └── Item Count: "(3 items)"
│   └── Right Section
│       └── Amount: "₨5,000"
└── Bottom Border/Spacing
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | Display | flex |
| Container | Justify Content | space-between |
| Container | Align Items | center |
| Container | Padding | 12px 0 |
| Container | Border Bottom | 1px solid #E5E7EB (optional) |
| Label | Font Size | 14px |
| Label | Color | #6B7280 |
| Label | Font Weight | 400 (regular) |
| Item Count | Font Size | 12px |
| Item Count | Color | #9CA3AF |
| Amount | Font Size | 14px |
| Amount | Color | #1F2937 |
| Amount | Font Weight | 500 (medium) |

### Subtotal Calculation Logic

```
Subtotal Calculation
└── For each cart item:
    ├── Line Total = item.price × item.quantity
    └── Subtotal = Σ(Line Totals)
        └── Round to 2 decimal places or nearest rupee
```

| Cart Item | Price | Qty | Line Total |
|-----------|-------|-----|------------|
| T-Shirt | ₨3,000 | 2 | ₨6,000 |
| Jeans | ₨4,500 | 1 | ₨4,500 |
| Socks | ₨500 | 3 | ₨1,500 |
| **Subtotal** | | | **₨12,000** |

### Item Count Display

| Item Count | Display Format |
|------------|----------------|
| 0 items | "(0 items)" or "No items" |
| 1 item | "(1 item)" (singular) |
| 2-10 items | "(3 items)" (plural) |
| >10 items | "(15 items)" |

### Currency Formatting

| Amount | Formatted Output |
|--------|------------------|
| 0 | ₨0 |
| 500 | ₨500 |
| 3000 | ₨3,000 |
| 15000 | ₨15,000 |
| 125000 | ₨125,000 |
| 1250000 | ₨1,250,000 |

### Loading State Design

```
Skeleton Loader
├── Left: Label placeholder
│   └── 80px × 14px gray bar
└── Right: Amount placeholder
    └── 60px × 14px gray bar
```

### Responsive Behavior

| Viewport | Adjustments |
|----------|-------------|
| Desktop | Standard spacing and font sizes |
| Tablet | Maintain layout, adjust padding |
| Mobile | Slightly smaller fonts, compact padding |

### Integration Points

| Source | Data | Update Trigger |
|--------|------|----------------|
| Cart Store | Cart items array | Item added/removed/updated |
| Calculation | Sum of prices × quantities | Cart changes |
| Sidebar | Display subtotal | Real-time updates |

### Position in Sidebar

```
Order Summary Sidebar
├── Header
├── Items List
├── [Divider]
├── → Subtotal ← (This component)
├── Shipping
├── Discount
├── [Divider]
└── Total
```

### Edge Cases Handling

| Scenario | Behavior |
|----------|----------|
| Empty Cart | Display "₨0" with "(0 items)" |
| Single Item | Use singular "item" in count |
| Decimal Prices | Round to 2 decimals or nearest rupee |
| Very Large Amount | Format with proper comma separators |
| Loading | Show skeleton, prevent flash |

### Expected Outcome
- Subtotal component displaying sum of cart items
- Item count indicator showing number of items
- Proper LKR currency formatting
- Real-time updates when cart changes
- Loading state for calculations
- Clean, readable layout in sidebar

### Verification Checklist
- [ ] `SidebarSubtotal.tsx` created in OrderSidebar directory
- [ ] Component accepts subtotal and item count props
- [ ] Label displays "Subtotal" on left
- [ ] Item count shows in proper format
- [ ] Amount displays on right with ₨ symbol
- [ ] Currency formatting includes comma separators
- [ ] Subtotal calculates correctly from cart items
- [ ] Loading state shows skeleton loader
- [ ] Component integrates with OrderSidebar
- [ ] Layout is responsive across viewports

---

## Task 89: Create Sidebar Shipping

### Overview
Create the shipping cost component that displays the selected shipping method's cost or a placeholder message when shipping hasn't been selected yet. This component shows different states: "Calculated at next step" when no shipping is selected, the actual cost when selected (e.g., ₨350), and "Free" in green text for free shipping options. The component adapts based on the checkout step and shipping selection.

### Dependencies
- Task 85: Create Order Sidebar (provides container)
- Task 47: Create Shipping Method Selection (provides shipping data)
- Shipping store with selected method

### Instructions

1. **Create shipping component**
   - Create `SidebarShipping.tsx` in OrderSidebar directory
   - Set up functional component with TypeScript
   - Define props interface for shipping data

2. **Accept shipping props**
   - Selected shipping method (object or null)
   - Shipping cost (number or null)
   - Is shipping step completed (boolean)
   - Loading state (boolean)

3. **Implement component layout**
   - Horizontal flexbox layout
   - Label on left, value on right
   - Space-between alignment
   - Consistent spacing with other pricing rows

4. **Display shipping label**
   - Text: "Shipping" or "Delivery"
   - Medium gray color (#6B7280)
   - Regular font weight
   - Align left

5. **Implement conditional value display**
   - Not selected: "Calculated at next step"
   - Selected with cost: "₨350" (formatted)
   - Free shipping: "Free" in green color
   - Loading: skeleton or spinner

6. **Handle "not selected" state**
   - Display: "Calculated at next step"
   - Alternative: "To be calculated"
   - Font size: smaller than normal value
   - Color: light gray (#9CA3AF)
   - Italic style (optional)

7. **Display shipping cost when selected**
   - Currency: ₨ (Sri Lankan Rupees)
   - Format: ₨350 (with comma separator if >999)
   - Color: dark gray (#1F2937)
   - Medium font weight
   - Right-aligned

8. **Display free shipping**
   - Text: "Free"
   - Color: green (#10B981 or similar)
   - Medium font weight
   - Optional: add checkmark icon
   - Emphasize to customer

9. **Show shipping method name (optional)**
   - Display below label: "Standard Delivery"
   - Smaller font size
   - Light gray color
   - Only when shipping selected

10. **Add loading state**
    - Show skeleton while calculating
    - Display spinner for async operations
    - Match layout of actual content

### Component Structure

```
SidebarShipping Component
├── Container (flex, space-between)
│   ├── Left Section
│   │   ├── Label: "Shipping"
│   │   └── Method Name (optional): "Standard"
│   └── Right Section
│       └── Value: (Conditional)
│           ├── "Calculated at next step" (not selected)
│           ├── "₨350" (selected)
│           └── "Free" (free shipping)
└── Bottom Spacing
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | Display | flex |
| Container | Justify Content | space-between |
| Container | Align Items | center |
| Container | Padding | 12px 0 |
| Label | Font Size | 14px |
| Label | Color | #6B7280 |
| Label | Font Weight | 400 |
| Value (Cost) | Font Size | 14px |
| Value (Cost) | Color | #1F2937 |
| Value (Cost) | Font Weight | 500 |
| Value (Free) | Font Size | 14px |
| Value (Free) | Color | #10B981 (green) |
| Value (Free) | Font Weight | 500 |
| Value (Pending) | Font Size | 13px |
| Value (Pending) | Color | #9CA3AF |
| Value (Pending) | Font Style | italic (optional) |
| Method Name | Font Size | 12px |
| Method Name | Color | #9CA3AF |

### Display States

| State | Condition | Display Text | Color | Style |
|-------|-----------|--------------|-------|-------|
| Not Selected | shippingMethod === null | "Calculated at next step" | #9CA3AF | Italic |
| Standard | cost > 0 | "₨350" | #1F2937 | Bold |
| Free | cost === 0 | "Free" | #10B981 | Bold |
| Loading | isLoading === true | Skeleton/Spinner | N/A | Animated |

### Shipping Cost Examples

| Shipping Method | Cost | Display |
|-----------------|------|---------|
| Standard Delivery | 350 | ₨350 |
| Express Delivery | 750 | ₨750 |
| Same-Day Delivery | 1500 | ₨1,500 |
| Free Shipping (Promo) | 0 | Free (green) |
| Not Selected | null | Calculated at next step |

### Free Shipping Styling

```
Free Shipping Display
├── Text: "Free"
├── Color: Green (#10B981)
├── Font Weight: 500 (medium)
├── Optional Icon: ✓ checkmark
└── Emphasis: Stands out from other values
```

### Loading State Design

```
Skeleton Loader
├── Left: Label "Shipping"
└── Right: Value placeholder
    └── 80px × 14px gray bar (animated)
```

### Integration with Checkout Flow

| Checkout Step | Shipping State | Display |
|---------------|----------------|---------|
| Step 1 (Info) | Not selected | "Calculated at next step" |
| Step 2 (In Progress) | Not selected | "Calculated at next step" |
| Step 2 (Selected) | Method chosen | "₨350" or "Free" |
| Step 3-5 | Selected | "₨350" or "Free" |

### Responsive Behavior

| Viewport | Adjustments |
|----------|-------------|
| Desktop | Standard spacing |
| Tablet | Maintain layout |
| Mobile | Smaller "pending" text, ensure readability |

### Position in Sidebar

```
Order Summary Sidebar
├── Header
├── Items List
├── [Divider]
├── Subtotal
├── → Shipping ← (This component)
├── Discount
├── [Divider]
└── Total
```

### Shipping Store Integration

| Store Property | Usage | Update Trigger |
|----------------|-------|----------------|
| selectedMethod | Display method name | Method selected |
| shippingCost | Display cost or "Free" | Cost calculated |
| isCalculating | Show loading state | Async calculation |
| currentStep | Determine display state | Step navigation |

### Edge Cases Handling

| Scenario | Display Behavior |
|----------|------------------|
| No Method Selected | "Calculated at next step" |
| Free Shipping | "Free" in green |
| Cost Calculation Error | "Unable to calculate" |
| Invalid Cost | Default to "Contact us" |
| Multiple Methods Available | Show selected only |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Color Meaning | Don't rely solely on green for "free" |
| Screen Readers | ARIA label describing shipping state |
| Semantic HTML | Use appropriate tags |

### Expected Outcome
- Shipping cost component with multiple states
- "Calculated at next step" for unselected state
- Proper cost display with ₨ formatting
- Green "Free" text for free shipping
- Real-time updates based on selection
- Loading state for calculations
- Integration with shipping store

### Verification Checklist
- [ ] `SidebarShipping.tsx` created in OrderSidebar directory
- [ ] Component accepts shipping props with proper types
- [ ] Label displays "Shipping" on left
- [ ] "Calculated at next step" shows when not selected
- [ ] Shipping cost displays correctly with ₨ symbol
- [ ] "Free" displays in green for free shipping
- [ ] Loading state shows skeleton loader
- [ ] Component subscribes to shipping store
- [ ] Display updates when shipping method changes
- [ ] Component integrates with OrderSidebar

---

## Task 90: Create Sidebar Discount

### Overview
Create the discount component that displays the discount amount applied through coupon codes or promotional offers. This component only appears when a discount is active, showing the discount amount as a negative value in green text to indicate savings. The component removes itself from the display when no discount is applied, maintaining a clean sidebar layout.

### Dependencies
- Task 85: Create Order Sidebar (provides container)
- Task 71: Create Discount Code Input (provides discount application)
- Discount store with applied discount data

### Instructions

1. **Create discount component**
   - Create `SidebarDiscount.tsx` in OrderSidebar directory
   - Set up functional component with TypeScript
   - Define props interface for discount data

2. **Accept discount props**
   - Discount amount (number)
   - Discount code (string, optional)
   - Discount type (percentage or fixed)
   - Is discount applied (boolean)

3. **Implement conditional rendering**
   - Only render component if discount > 0
   - Return null if no discount applied
   - Hide component completely, not just hide value

4. **Implement component layout**
   - Horizontal flexbox layout
   - Label on left, value on right
   - Space-between alignment
   - Consistent spacing with other pricing rows

5. **Display discount label**
   - Text: "Discount" or "Savings"
   - Optional: include code name "(CODE20)"
   - Medium gray color (#6B7280)
   - Regular font weight
   - Align left

6. **Display discount amount**
   - Prefix with minus sign: "-₨500"
   - Green color to indicate savings (#10B981)
   - Medium font weight
   - Right-aligned
   - Format with comma separators

7. **Show discount code (optional)**
   - Display below label: "SUMMER20"
   - Smaller font size (12px)
   - Light gray color
   - Uppercase formatting
   - Helps customer identify which code applied

8. **Handle discount types**
   - Fixed amount: Display as "-₨500"
   - Percentage: Calculate and display as "-₨500"
   - Free shipping: May not show here (shows in shipping row)

9. **Add remove button (optional)**
   - Small "×" or "Remove" button
   - Positioned near discount code
   - Allows customer to remove discount
   - Triggers discount store action

10. **Style for emphasis**
    - Green color emphasizes savings
    - Potentially bold or slightly larger
    - Stand out from other pricing rows

### Component Structure

```
SidebarDiscount Component (Conditional)
├── Container (flex, space-between)
│   ├── Left Section
│   │   ├── Label: "Discount"
│   │   └── Code (optional): "SUMMER20"
│   └── Right Section
│       ├── Amount: "-₨500" (green)
│       └── Remove Button (optional)
└── Bottom Spacing
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | Display | flex |
| Container | Justify Content | space-between |
| Container | Align Items | center |
| Container | Padding | 12px 0 |
| Label | Font Size | 14px |
| Label | Color | #6B7280 |
| Label | Font Weight | 400 |
| Amount | Font Size | 14px |
| Amount | Color | #10B981 (green) |
| Amount | Font Weight | 500 |
| Code | Font Size | 12px |
| Code | Color | #9CA3AF |
| Code | Text Transform | uppercase |
| Remove Button | Font Size | 12px |
| Remove Button | Color | #EF4444 (red) |
| Remove Button | Cursor | pointer |

### Conditional Rendering Logic

```
Render Logic
└── IF discount > 0
    ├── Render component with discount display
    └── ELSE
        └── Return null (component hidden)
```

| Discount Amount | Component Visibility |
|-----------------|----------------------|
| 0 | Hidden (not rendered) |
| > 0 | Visible with amount |
| null or undefined | Hidden |

### Discount Display Examples

| Discount Type | Original | Amount | Display |
|---------------|----------|--------|---------|
| Fixed ₨500 off | ₨5,000 | -₨500 | -₨500 |
| 10% off | ₨5,000 | -₨500 | -₨500 |
| 20% off | ₨10,000 | -₨2,000 | -₨2,000 |
| Free shipping | N/A | N/A | Shows in Shipping row |

### Discount Code Display

```
Discount with Code
├── Main Row
│   ├── Left: "Discount (SUMMER20)"
│   └── Right: "-₨500"
└── Code Detail Row (optional)
    └── "Code: SUMMER20" (smaller, below)
```

| Code | Display Format |
|------|----------------|
| SUMMER20 | "Discount (SUMMER20)" or "Code: SUMMER20" |
| WELCOME10 | "Discount (WELCOME10)" |
| No Code | "Discount" (no code shown) |
| Auto-applied | "Discount (Auto-applied)" |

### Green Color for Savings

```
Savings Emphasis
├── Color: Green (#10B981)
├── Purpose: Indicate positive outcome (savings)
├── Weight: Medium (500)
└── Contrast: Stands out from other amounts
```

### Optional Remove Functionality

```
Remove Button
├── Text: "×" or "Remove"
├── Position: Next to amount or below code
├── Action: Dispatch removeDiscount() to store
├── Confirm: Optional confirmation dialog
└── Update: Sidebar re-renders with discount removed
```

### Integration with Discount Store

| Store Property | Usage | Update Trigger |
|----------------|-------|----------------|
| discountCode | Display code name | Code applied |
| discountAmount | Display amount | Calculation complete |
| discountType | Determine display | Code applied |
| isApplied | Control visibility | Code applied/removed |

### Position in Sidebar

```
Order Summary Sidebar
├── Header
├── Items List
├── [Divider]
├── Subtotal
├── Shipping
├── → Discount ← (This component, conditional)
├── [Divider]
└── Total
```

### Responsive Behavior

| Viewport | Adjustments |
|----------|-------------|
| Desktop | Standard spacing, full text |
| Tablet | Maintain layout |
| Mobile | Ensure code doesn't wrap awkwardly |

### Discount Calculation Flow

```
Discount Calculation
└── Discount Code Applied
    ├── Type: Percentage
    │   └── Amount = Subtotal × (Percentage / 100)
    ├── Type: Fixed
    │   └── Amount = Fixed Value
    └── Type: Free Shipping
        └── Amount = Shipping Cost (shows in shipping row)
```

### Edge Cases Handling

| Scenario | Display Behavior |
|----------|------------------|
| No Discount | Component not rendered |
| Discount = 0 | Component not rendered |
| Discount Removed | Component disappears smoothly |
| Invalid Code | Not shown (handled in input component) |
| Expired Code | Removed from display |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Color + Text | Use minus sign "-" not just green color |
| Screen Reader | ARIA label: "Discount applied, ₨500 savings" |
| Semantic HTML | Use appropriate tags |

### Expected Outcome
- Discount component that conditionally renders
- Only visible when discount is applied
- Green negative amount showing savings
- Optional discount code display
- Clean removal when discount not applied
- Integration with discount store

### Verification Checklist
- [ ] `SidebarDiscount.tsx` created in OrderSidebar directory
- [ ] Component accepts discount props with proper types
- [ ] Component only renders when discount > 0
- [ ] Label displays "Discount" on left
- [ ] Amount displays with "-" prefix and green color
- [ ] Discount code displays if available
- [ ] Component subscribes to discount store
- [ ] Component disappears when discount removed
- [ ] Currency formatting includes comma separators
- [ ] Component integrates with OrderSidebar

---

## Task 91: Create Sidebar Total

### Overview
Create the total component that displays the final order amount including all items, shipping, fees, and discounts. This is the most prominent pricing element in the sidebar, styled with bold text, larger font size, and a top border to separate it from the breakdown above. The total is displayed in Sri Lankan Rupees (LKR) with proper formatting and updates in real-time as cart contents or selections change.

### Dependencies
- Task 85: Create Order Sidebar (provides container)
- Task 88: Create Sidebar Subtotal (provides subtotal)
- Task 89: Create Sidebar Shipping (provides shipping cost)
- Task 90: Create Sidebar Discount (provides discount)
- All pricing data available in checkout store

### Instructions

1. **Create total component**
   - Create `SidebarTotal.tsx` in OrderSidebar directory
   - Set up functional component with TypeScript
   - Define props interface for total data

2. **Accept total props**
   - Total amount (number)
   - Breakdown components: subtotal, shipping, fees, discount
   - Currency code (default: LKR)
   - Loading state (boolean)

3. **Implement component layout**
   - Horizontal flexbox layout
   - Label on left, value on right
   - Space-between alignment
   - Distinguished from other pricing rows

4. **Add visual separation**
   - Top border (1-2px solid)
   - Extra top padding (16-20px)
   - Slightly larger bottom margin
   - Clear visual break from breakdown

5. **Display total label**
   - Text: "Total" or "Order Total"
   - Darker color than other labels (#1F2937)
   - Bold or semi-bold font weight
   - Slightly larger font (15-16px)
   - Align left

6. **Display total amount**
   - Currency: ₨ (Sri Lankan Rupees)
   - Format: ₨12,850 (with comma separators)
   - Bold font weight (600-700)
   - Larger font size (18-20px)
   - Dark color (#111827 or black)
   - Right-aligned

7. **Calculate total amount**
   - Formula: Subtotal + Shipping + Fees - Discount
   - Handle null values (treat as 0)
   - Ensure minimum total of ₨0
   - Round to nearest rupee

8. **Include fees if applicable**
   - COD fees (if COD payment selected)
   - Processing fees
   - Other additional charges
   - Display fees separately or in total

9. **Add tax note (if applicable)**
   - Display below total: "Including all taxes"
   - Or: "Tax: ₨0 (tax-free)"
   - Small font size
   - Light gray color

10. **Implement loading state**
    - Show skeleton while calculating
    - Display spinner for async operations
    - Prevent flash of incorrect total

11. **Add emphasis styling**
    - Larger and bolder than other amounts
    - Dark color for maximum contrast
    - Optional: subtle background highlight
    - Make it the focus of the sidebar

### Component Structure

```
SidebarTotal Component
├── Top Border Separator
├── Container (flex, space-between)
│   ├── Left Section
│   │   └── Label: "Total"
│   └── Right Section
│       └── Amount: "₨12,850" (bold, large)
└── Tax Note (optional)
    └── "Including all taxes"
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | Display | flex |
| Container | Justify Content | space-between |
| Container | Align Items | center |
| Container | Padding Top | 16-20px |
| Container | Padding Bottom | 12px |
| Container | Border Top | 1px solid #E5E7EB |
| Container | Margin Top | 8px |
| Label | Font Size | 15-16px |
| Label | Color | #1F2937 |
| Label | Font Weight | 600 (semi-bold) |
| Amount | Font Size | 18-20px |
| Amount | Color | #111827 (black) |
| Amount | Font Weight | 700 (bold) |
| Tax Note | Font Size | 12px |
| Tax Note | Color | #9CA3AF |
| Tax Note | Margin Top | 4px |

### Total Calculation Logic

```
Total Calculation
├── Start with Subtotal (sum of all items)
├── Add Shipping Cost (if selected, else 0)
├── Add Fees (COD, processing, etc.)
├── Subtract Discount (if applied, else 0)
└── Result: Total Amount (minimum ₨0)
```

| Component | Example | Included |
|-----------|---------|----------|
| Subtotal | ₨10,000 | + |
| Shipping | ₨350 | + |
| COD Fee | ₨150 | + |
| Discount | -₨500 | - |
| **Total** | **₨10,000** | **=** |

### Example Calculations

```
Example 1: Standard Order
Subtotal:    ₨10,000
Shipping:    ₨350
Discount:    -₨500
Total:       ₨9,850

Example 2: With COD Fee
Subtotal:    ₨15,000
Shipping:    ₨500
COD Fee:     ₨200
Total:       ₨15,700

Example 3: Free Shipping
Subtotal:    ₨20,000
Shipping:    ₨0 (Free)
Discount:    -₨2,000
Total:       ₨18,000
```

### Currency Formatting

| Amount | Formatted Output |
|--------|------------------|
| 9850 | ₨9,850 |
| 15000 | ₨15,000 |
| 125500 | ₨125,500 |
| 1250000 | ₨1,250,000 |

### Visual Hierarchy

```
Sidebar Pricing Hierarchy
├── Items List (small, compact)
├── Subtotal (medium, gray)
├── Shipping (medium, gray)
├── Discount (medium, green)
├── [Divider - Border]
└── → Total (LARGE, BOLD, BLACK) ← Focus point
```

### Position in Sidebar

```
Order Summary Sidebar
├── Header
├── Items List
├── [Divider]
├── Subtotal
├── Shipping
├── Discount (conditional)
├── [Divider / Border]
├── → Total ← (This component)
└── Optional: Tax note
```

### Loading State Design

```
Skeleton Loader
├── Top Border
├── Flex Container
│   ├── Left: "Total" label placeholder
│   │   └── 60px × 16px gray bar
│   └── Right: Amount placeholder
│       └── 100px × 20px gray bar (animated)
└── Tax note placeholder (optional)
```

### Fee Display Options

| Option | Description | Display |
|--------|-------------|---------|
| Included | Fees included in total | No separate line |
| Separate | Fees shown above total | "COD Fee: ₨150" row |
| Tooltip | Fees explained on hover | Info icon with tooltip |

### Integration Points

| Source | Data | Purpose |
|--------|------|---------|
| Subtotal Component | Subtotal amount | Base calculation |
| Shipping Component | Shipping cost | Add to total |
| Discount Component | Discount amount | Subtract from total |
| Payment Store | COD fee | Add if COD selected |
| Total Component | Final total | Display to customer |

### Responsive Behavior

| Viewport | Adjustments |
|----------|-------------|
| Desktop | Full size, 20px font |
| Tablet | Maintain emphasis |
| Mobile | Slightly smaller (18px), still bold |

### Tax Display (Sri Lanka Context)

| Tax Status | Display |
|------------|---------|
| No Tax | "Tax: ₨0" or no display |
| Tax Included | "Including all taxes" |
| Tax Separate | "Tax: ₨500" (additional row) |
| Tax-Free Items | "No tax applied" |

### Real-Time Updates

| Trigger | Update Behavior |
|---------|-----------------|
| Item Added | Total increases immediately |
| Item Removed | Total decreases immediately |
| Shipping Selected | Total updates with shipping cost |
| Discount Applied | Total decreases with discount |
| Payment Method Changed | Total updates with fees (COD) |

### Edge Cases Handling

| Scenario | Display Behavior |
|----------|------------------|
| Empty Cart | Total: ₨0 |
| Negative Total | Prevent: set minimum ₨0 |
| Null Values | Treat as 0 in calculation |
| Discount > Subtotal | Total: ₨0 (free order) |
| Very Large Total | Format with proper separators |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Screen Reader | ARIA label: "Order total: ₨9,850" |
| Visual Emphasis | Bold + size, not just color |
| Semantic HTML | Use <strong> or appropriate tag |
| Focus | Ensure total is easily locatable |

### Expected Outcome
- Bold, prominent total component
- Largest and most visible pricing element
- Top border separating from breakdown
- Real-time calculation and updates
- Proper LKR currency formatting
- Loading state during calculations
- Integration with all pricing components

### Verification Checklist
- [ ] `SidebarTotal.tsx` created in OrderSidebar directory
- [ ] Component accepts total and breakdown props
- [ ] Label displays "Total" with bold styling
- [ ] Amount displays with ₨ symbol and bold font
- [ ] Font size larger than other pricing rows (18-20px)
- [ ] Top border separates total from breakdown
- [ ] Total calculates correctly (subtotal + shipping + fees - discount)
- [ ] Currency formatting includes comma separators
- [ ] Loading state shows skeleton loader
- [ ] Real-time updates when cart or selections change
- [ ] Component integrates with OrderSidebar

---

## Task 92: Create Collapsible Sidebar

### Overview
Create a mobile-optimized version of the order sidebar that collapses into an accordion-style component for screens smaller than 1024px. This collapsible sidebar displays a summary header showing the item count and total when collapsed, and expands to reveal the full order breakdown when clicked. This approach saves valuable screen space on mobile devices while keeping the order summary accessible.

### Dependencies
- Task 85: Create Order Sidebar (provides base sidebar component)
- Task 91: Create Sidebar Total (provides total for collapsed view)
- All sidebar child components (Tasks 86-91)

### Instructions

1. **Create collapsible wrapper component**
   - Create `CollapsibleSidebar.tsx` in OrderSidebar directory
   - Set up functional component with TypeScript
   - Define props interface for sidebar content and state

2. **Implement collapse/expand state**
   - Use React useState for collapse state
   - Default to collapsed on mobile
   - Toggle state on header click
   - Smooth animation for expand/collapse

3. **Create collapsed header**
   - Display: "Order Summary (3 items)"
   - Show total amount: "₨9,850"
   - Add chevron icon (down when collapsed, up when expanded)
   - Full-width, touch-friendly click area
   - Background color to distinguish from content

4. **Implement expand/collapse animation**
   - Use CSS transitions or React animation library
   - Smooth height animation (300-400ms)
   - Content fades in/out slightly
   - Chevron rotates 180 degrees

5. **Style collapsed state**
   - Compact header bar
   - Item count and total inline
   - Chevron icon on right
   - Clear touch target (min 44x44px)
   - Subtle shadow or border

6. **Style expanded state**
   - Full sidebar content visible
   - Header remains at top
   - Scrollable content if needed
   - Chevron indicates collapse action

7. **Render sidebar content when expanded**
   - Show full OrderSidebar component
   - Include all child components (items, pricing, total)
   - Maintain full functionality
   - Enable scrolling if content exceeds screen

8. **Handle responsive breakpoint**
   - Trigger: viewport width < 1024px
   - Desktop (≥1024px): normal sidebar, ignore collapse
   - Mobile (<1024px): collapsible version active
   - Use CSS media queries or JS viewport detection

9. **Add touch-friendly interactions**
   - Large tap targets (min 44x44px)
   - Clear visual feedback on tap
   - Smooth animations, not jarring
   - Haptic feedback (if supported)

10. **Optimize for accessibility**
    - ARIA attributes: aria-expanded, aria-controls
    - Keyboard navigation: Enter/Space to toggle
    - Focus management: maintain focus on toggle
    - Screen reader announcements

11. **Position in mobile layout**
    - Above checkout form content
    - Full width container
    - Sticky or static (design choice)
    - Margin below when expanded

### Component Structure

```
CollapsibleSidebar Component (Mobile Only)
├── Collapsed State
│   └── Header Bar
│       ├── Left: "Order Summary (3 items)"
│       ├── Right: "₨9,850"
│       └── Chevron Icon (down)
└── Expanded State
    ├── Header Bar
    │   ├── Left: "Order Summary (3 items)"
    │   ├── Right: "₨9,850"
    │   └── Chevron Icon (up)
    └── Sidebar Content (full)
        ├── Items List
        ├── Subtotal
        ├── Shipping
        ├── Discount
        └── Total
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | Display | block (mobile only) |
| Container | Width | 100% |
| Container | Background | White |
| Header | Display | flex |
| Header | Justify Content | space-between |
| Header | Align Items | center |
| Header | Padding | 16px |
| Header | Cursor | pointer |
| Header | Background | #F9FAFB |
| Header | Border | 1px solid #E5E7EB |
| Header | Border Radius | 8px |
| Header | Min Height | 44px (touch target) |
| Title | Font Size | 14px |
| Title | Font Weight | 600 |
| Item Count | Font Size | 14px |
| Item Count | Color | #6B7280 |
| Total (Header) | Font Size | 16px |
| Total (Header) | Font Weight | 700 |
| Total (Header) | Color | #111827 |
| Chevron | Size | 20x20px |
| Chevron | Color | #6B7280 |
| Content | Padding | 16px |
| Content | Max Height | Animated |
| Content | Overflow | hidden (collapsed) |

### Collapse/Expand Animation

```
Animation Sequence
└── Click/Tap Header
    ├── State: collapsed → expanded (or vice versa)
    ├── Chevron: rotate 180deg (300ms ease)
    ├── Content: max-height 0 → auto (400ms ease)
    ├── Content: opacity 0 → 1 (200ms ease, delayed 100ms)
    └── Complete: content visible and scrollable
```

| Property | Collapsed | Expanded | Transition |
|----------|-----------|----------|------------|
| Content Max Height | 0 | auto or 600px | 400ms ease |
| Content Opacity | 0 | 1 | 200ms ease |
| Chevron Rotation | 0deg | 180deg | 300ms ease |
| Header Background | #F9FAFB | #F3F4F6 | 200ms ease |

### Collapsed Header Layout

```
Header Bar (Collapsed)
├── Left Section (60%)
│   └── "Order Summary (3 items)"
├── Right Section (40%)
│   ├── "₨9,850" (bold)
│   └── Chevron ▼
```

### Expanded Layout

```
CollapsibleSidebar (Expanded)
├── Header Bar (sticky optional)
│   └── "Order Summary (3)" + Total + Chevron ▲
└── Expanded Content
    ├── Items List (scrollable)
    ├── [Divider]
    ├── Subtotal
    ├── Shipping
    ├── Discount (conditional)
    ├── [Divider]
    └── Total (bold, large)
```

### Responsive Behavior

| Viewport | Sidebar Behavior | Collapsible Active |
|----------|------------------|-------------------|
| ≥1024px (Desktop) | Sticky right column | No |
| 768-1023px (Tablet) | Right column | Optional (design choice) |
| <768px (Mobile) | Full width, collapsible | Yes |

### Breakpoint Implementation

```
CSS Media Query
@media (max-width: 1023px) {
  .order-sidebar-desktop {
    display: none;
  }
  .collapsible-sidebar-mobile {
    display: block;
  }
}

@media (min-width: 1024px) {
  .order-sidebar-desktop {
    display: block;
  }
  .collapsible-sidebar-mobile {
    display: none;
  }
}
```

### Touch Interaction Design

| Element | Size | Action | Feedback |
|---------|------|--------|----------|
| Header Bar | Full width × 44px+ | Toggle expand/collapse | Background color change |
| Chevron Icon | 44x44px tap area | Indicates state | Rotates on toggle |
| Content Area | Scrollable | Scroll through items | Smooth scroll |

### State Management

| State Variable | Type | Default | Purpose |
|----------------|------|---------|---------|
| isExpanded | boolean | false | Controls expand/collapse |
| isMobile | boolean | (detect) | Activates collapsible |
| contentHeight | number | 0 | For animation |
| isAnimating | boolean | false | Prevents rapid toggling |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA Expanded | `aria-expanded={isExpanded}` on header |
| ARIA Controls | `aria-controls="sidebar-content"` |
| ARIA Label | `aria-label="Toggle order summary"` |
| Keyboard | Enter/Space to toggle |
| Focus Indicator | Visible focus ring on header |
| Screen Reader | Announce: "Order summary expanded/collapsed" |

### Integration with OrderSidebar

```
Sidebar Rendering Logic
└── Detect Viewport Width
    ├── IF width >= 1024px
    │   └── Render: <OrderSidebar /> (normal, sticky)
    └── ELSE width < 1024px
        └── Render: <CollapsibleSidebar>
            └── Contains: <OrderSidebar /> (when expanded)
```

### Content Scrolling

| Scenario | Behavior |
|----------|----------|
| Short Content | No scroll, fits in viewport |
| Long Content | Enable scroll within content area |
| Expanded on Small Screen | Scroll independently from page |
| Many Items | Items list scrolls, pricing stays visible |

### Default State Strategy

| Device | Default State | Rationale |
|--------|---------------|-----------|
| Mobile | Collapsed | Save screen space, show form first |
| Tablet | Expanded (optional) | More space available |
| After Interaction | Remember state | UX continuity |

### Position in Mobile Layout

```
Mobile Checkout Page
├── Header
├── Progress Indicator
├── → Collapsible Sidebar (collapsed) ← Above form
├── Checkout Form
│   └── Step content
└── Footer
```

### Expected Outcome
- Collapsible sidebar for mobile viewports (<1024px)
- Collapsed header shows item count and total
- Smooth expand/collapse animation
- Full sidebar content when expanded
- Touch-friendly interactions
- Accessible keyboard and screen reader support
- Saves screen space on mobile devices

### Verification Checklist
- [ ] `CollapsibleSidebar.tsx` created in OrderSidebar directory
- [ ] Component renders only on mobile (<1024px)
- [ ] Collapsed header displays item count and total
- [ ] Chevron icon indicates expand/collapse state
- [ ] Click/tap on header toggles expand/collapse
- [ ] Smooth animation for expand/collapse transition
- [ ] Full sidebar content displays when expanded
- [ ] ARIA attributes implemented correctly
- [ ] Keyboard navigation works (Enter/Space to toggle)
- [ ] Component integrates with OrderSidebar
- [ ] Default state is collapsed on mobile

---

## Task 93: Create Order API Service

### Overview
Create the API service module responsible for order submission, cart data retrieval, and shipping cost calculation. This service provides methods to interact with the backend order and cart endpoints, handling the creation of new orders with customer information, shipping details, payment methods, and cart items. The service manages API requests, response handling, error management, and data transformation.

### Dependencies
- Task 77: Create Process Payment (payment processing completed)
- All checkout form data collection (Tasks 19-84)
- Backend API endpoints available

### Instructions

1. **Create order service file**
   - Navigate to `frontend/services/storefront/checkout/`
   - Create `orderService.ts` file
   - Set up TypeScript interfaces and types
   - Import HTTP client (e.g., axios or fetch)

2. **Define API endpoints**
   - Base URL: `/api/storefront/orders/`
   - Create order: `POST /api/orders`
   - Get cart: `GET /api/cart`
   - Calculate shipping: `POST /api/shipping/calculate`
   - Update cart: `PUT /api/cart/:id`

3. **Define TypeScript interfaces**
   - OrderCreateRequest
   - OrderCreateResponse
   - CartResponse
   - ShippingCalculationRequest
   - ShippingCalculationResponse
   - Ensure type safety throughout

4. **Implement createOrder function**
   - Method: POST
   - Endpoint: `/api/orders`
   - Payload: customer info, shipping, payment, items
   - Returns: order ID, status, confirmation
   - Error handling: validation errors, server errors

5. **Build order payload structure**
   - Contact information: email, phone, name
   - Shipping address: full address with province, district, city
   - Shipping method: selected method ID and cost
   - Payment method: payment type, details
   - Cart items: product IDs, quantities, prices
   - Discount code: if applied
   - Additional notes: customer comments

6. **Implement getCart function**
   - Method: GET
   - Endpoint: `/api/cart` or `/api/cart/:userId`
   - Returns: cart items, subtotal, item count
   - Handles guest vs. authenticated user carts
   - Error handling: empty cart, cart not found

7. **Implement calculateShipping function**
   - Method: POST
   - Endpoint: `/api/shipping/calculate`
   - Payload: destination address, cart items
   - Returns: shipping cost, estimated delivery
   - Error handling: invalid address, service unavailable

8. **Add request/response interceptors**
   - Add authentication tokens if user logged in
   - Set common headers (Content-Type, Accept)
   - Handle CSRF tokens if required
   - Log requests/responses in development

9. **Implement error handling**
   - Network errors: timeout, no connection
   - Server errors: 500, 503
   - Validation errors: 400, 422
   - Return user-friendly error messages
   - Log errors for debugging

10. **Add request validation**
    - Validate order data before submission
    - Ensure all required fields present
    - Check data formats (email, phone, etc.)
    - Prevent invalid requests

11. **Implement response transformation**
    - Transform backend response to frontend format
    - Normalize data structures
    - Format dates, currency, etc.
    - Handle nested objects

12. **Add loading/abort functionality**
    - Support request cancellation
    - Implement timeout handling
    - Return loading states
    - Use AbortController for fetch

### Service Structure

```
orderService.ts
├── API Configuration
│   ├── Base URLs
│   ├── Endpoints
│   └── HTTP client setup
├── TypeScript Interfaces
│   ├── Request types
│   ├── Response types
│   └── Error types
├── API Functions
│   ├── createOrder()
│   ├── getCart()
│   ├── calculateShipping()
│   ├── updateCart()
│   └── applyDiscount()
├── Helper Functions
│   ├── buildOrderPayload()
│   ├── validateOrderData()
│   ├── handleApiError()
│   └── transformResponse()
└── Export Module
    └── Default export: orderService
```

### API Endpoints

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| createOrder | POST | `/api/orders` | Submit new order |
| getCart | GET | `/api/cart` | Retrieve cart data |
| updateCart | PUT | `/api/cart/:id` | Update cart item |
| deleteCartItem | DELETE | `/api/cart/:id` | Remove cart item |
| calculateShipping | POST | `/api/shipping/calculate` | Get shipping cost |
| applyDiscount | POST | `/api/discounts/apply` | Apply discount code |
| validateDiscount | GET | `/api/discounts/:code` | Check discount validity |

### Order Payload Structure

```
OrderCreateRequest
├── customer
│   ├── email: string
│   ├── phone: string
│   ├── firstName: string
│   ├── lastName: string
│   └── whatsappOptIn: boolean
├── shipping
│   ├── address: string
│   ├── addressLine2: string (optional)
│   ├── city: string (or cityId)
│   ├── district: string (or districtId)
│   ├── province: string (or provinceId)
│   ├── postalCode: string
│   └── notes: string (optional)
├── shippingMethod
│   ├── methodId: string
│   ├── methodName: string
│   └── cost: number
├── payment
│   ├── method: string ("payhere" | "cod" | "bank_transfer")
│   ├── details: object (method-specific)
│   └── transactionId: string (if completed)
├── items
│   └── Array of:
│       ├── productId: string
│       ├── variantId: string (optional)
│       ├── quantity: number
│       ├── price: number
│       └── subtotal: number
├── discount
│   ├── code: string (optional)
│   ├── amount: number (optional)
│   └── type: string (optional)
└── metadata
    ├── subtotal: number
    ├── shippingCost: number
    ├── discount: number
    ├── total: number
    └── currency: "LKR"
```

### Order Response Structure

```
OrderCreateResponse
├── success: boolean
├── orderId: string
├── orderNumber: string
├── status: "pending" | "confirmed" | "processing"
├── total: number
├── paymentStatus: "pending" | "completed" | "failed"
├── paymentUrl: string (if PayHere)
├── estimatedDelivery: string (date)
└── message: string
```

### Cart Response Structure

```
CartResponse
├── cartId: string
├── items: Array of CartItem
│   └── CartItem
│       ├── id: string
│       ├── productId: string
│       ├── name: string
│       ├── image: string
│       ├── price: number
│       ├── quantity: number
│       ├── variant: object
│       └── subtotal: number
├── subtotal: number
├── itemCount: number
├── currency: "LKR"
└── updatedAt: string (date)
```

### Shipping Calculation Request

```
ShippingCalculationRequest
├── destination
│   ├── cityId: string
│   ├── districtId: string
│   └── provinceId: string
├── cartItems
│   └── Array of:
│       ├── productId: string
│       ├── quantity: number
│       └── weight: number (optional)
└── dimensions (optional)
    ├── weight: number
    ├── length: number
    ├── width: number
    └── height: number
```

### Shipping Calculation Response

```
ShippingCalculationResponse
├── success: boolean
├── methods: Array of ShippingMethod
│   └── ShippingMethod
│       ├── id: string
│       ├── name: string
│       ├── cost: number
│       ├── estimatedDays: number
│       └── description: string
└── error: string (if any)
```

### Error Response Structure

```
ApiErrorResponse
├── error: boolean
├── message: string
├── code: string
├── details: object (field-specific errors)
└── statusCode: number
```

### createOrder Function Signature

```typescript
async function createOrder(
  orderData: OrderCreateRequest
): Promise<OrderCreateResponse> {
  // Validate order data
  // Build request payload
  // Send POST request to /api/orders
  // Handle response
  // Handle errors
  // Return order result
}
```

### getCart Function Signature

```typescript
async function getCart(
  userId?: string
): Promise<CartResponse> {
  // Determine cart endpoint (guest vs user)
  // Send GET request
  // Transform response
  // Handle errors
  // Return cart data
}
```

### calculateShipping Function Signature

```typescript
async function calculateShipping(
  request: ShippingCalculationRequest
): Promise<ShippingCalculationResponse> {
  // Validate request
  // Send POST request
  // Parse response
  // Handle errors
  // Return shipping methods
}
```

### Error Handling Patterns

| Error Type | HTTP Code | Handling |
|------------|-----------|----------|
| Validation Error | 400, 422 | Display field errors to user |
| Authentication Error | 401 | Redirect to login or allow guest |
| Authorization Error | 403 | Show "not allowed" message |
| Not Found | 404 | Show "resource not found" |
| Server Error | 500 | Show generic error, log details |
| Network Error | - | Show "connection failed" |
| Timeout | - | Show "request timeout", retry |

### Request Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Type | application/json | JSON payload |
| Accept | application/json | JSON response |
| Authorization | Bearer {token} | User authentication |
| X-CSRF-Token | {token} | CSRF protection |
| X-Request-ID | {uuid} | Request tracking |

### Authentication Handling

```
Authentication Flow
└── Check if user is logged in
    ├── If logged in:
    │   ├── Get auth token from store
    │   ├── Add Authorization header
    │   └── Include userId in request
    └── If guest:
        ├── Use session ID or guest token
        ├── Include guestId in request
        └── Link cart to guest session
```

### HTTP Client Configuration

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  // Add auth token if available
  // Add CSRF token
  // Log request in dev mode
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => handleApiError(error)
);
```

### Integration with Checkout Flow

```
Checkout Submission Flow
└── User clicks "Place Order"
    ├── Collect all form data
    ├── Validate data locally
    ├── Call orderService.createOrder(orderData)
    │   ├── Send request to backend
    │   ├── Wait for response
    │   └── Handle result
    ├── If success:
    │   ├── Store order ID
    │   ├── Redirect to confirmation or payment
    │   └── Clear cart
    └── If error:
        ├── Display error message
        ├── Allow user to retry
        └── Log error for support
```

### Service Usage Example

```
Usage in Component
└── Import orderService
    └── const { createOrder } = orderService;
    └── In submit handler:
        └── try {
            const result = await createOrder(checkoutData);
            // Handle success
          } catch (error) {
            // Handle error
          }
```

### Expected Outcome
- Complete API service for order operations
- Functions for order creation, cart retrieval, shipping calculation
- Proper TypeScript types for requests and responses
- Error handling for network and server errors
- Integration with checkout form data
- Support for guest and authenticated users
- Request/response transformation
- Authentication token management

### Verification Checklist
- [ ] `orderService.ts` created in correct directory
- [ ] TypeScript interfaces defined for all API types
- [ ] `createOrder()` function implemented
- [ ] `getCart()` function implemented
- [ ] `calculateShipping()` function implemented
- [ ] Error handling implemented for all functions
- [ ] Request/response transformation logic
- [ ] Authentication headers added when user logged in
- [ ] API client configured with base URL and headers
- [ ] Service exports all necessary functions
- [ ] Integration with checkout store tested

---

## Summary

This document covered Tasks 85-93, establishing the order sidebar and API service for the checkout flow. The order sidebar provides customers with a persistent, real-time summary of their order including cart items, pricing breakdown, shipping costs, fees, and totals. On mobile devices, the sidebar collapses into an accordion for optimal screen space usage. The order API service handles order submission, cart data retrieval, and shipping calculation, providing the necessary backend integration for completing the checkout process.

### Key Deliverables

| Task | Component | Purpose |
|------|-----------|---------|
| 85 | OrderSidebar.tsx | Main sidebar container with sticky positioning |
| 86 | SidebarItemsList.tsx | Scrollable list of cart items |
| 87 | SidebarItemRow.tsx | Individual cart item display |
| 88 | SidebarSubtotal.tsx | Subtotal amount with item count |
| 89 | SidebarShipping.tsx | Shipping cost or pending message |
| 90 | SidebarDiscount.tsx | Discount amount (conditional) |
| 91 | SidebarTotal.tsx | Bold, prominent total amount |
| 92 | CollapsibleSidebar.tsx | Mobile collapsible wrapper |
| 93 | orderService.ts | API service for orders, cart, shipping |

### Component Hierarchy

```
Checkout Page
├── Desktop View (≥1024px)
│   ├── Form Column (65-70%)
│   └── OrderSidebar (30-35%, sticky)
│       ├── Header
│       ├── SidebarItemsList
│       │   └── SidebarItemRow × n
│       ├── SidebarSubtotal
│       ├── SidebarShipping
│       ├── SidebarDiscount (conditional)
│       └── SidebarTotal
└── Mobile View (<1024px)
    ├── CollapsibleSidebar
    │   ├── Collapsed: Header with summary
    │   └── Expanded: Full OrderSidebar
    └── Form (full width)
```

### API Integration

```
API Service (orderService.ts)
├── createOrder()
│   └── POST /api/orders
├── getCart()
│   └── GET /api/cart
├── calculateShipping()
│   └── POST /api/shipping/calculate
└── Error Handling
    └── Network, validation, server errors
```

### Responsive Design Summary

| Breakpoint | Layout | Sidebar Behavior |
|------------|--------|------------------|
| ≥1280px | Two columns | Sticky sidebar, 30% width |
| 1024-1279px | Two columns | Sticky sidebar, 35% width |
| 768-1023px | Two columns | Non-sticky sidebar, 40% width |
| <768px | Single column | Collapsible accordion |

### Total Estimation

| Category | Count | Total Time |
|----------|-------|------------|
| Components | 8 | ~4 hours |
| API Service | 1 | ~50 min |
| **Total** | **9 Tasks** | **~5 hours** |

---

## Next Steps

With the order sidebar and API service complete, proceed to:
1. **Task 94-98:** Comprehensive checkout testing (Document 02)
2. Test guest checkout flow
3. Test logged-in user checkout flow
4. Test address cascade functionality
5. Test payment method selection
6. Test mobile checkout experience

The sidebar provides customers with full transparency of their order throughout the checkout process, while the API service enables seamless order submission and data retrieval from the backend.
