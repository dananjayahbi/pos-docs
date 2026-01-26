# Tasks 53-60: Variant Selection Container & Logic

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** D - Variant & Cart Actions  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-C_Product-Information](../Group-C_Product-Information/)
- **→ Next Document:** [02_Tasks-61-68_Quantity-Cart-Wishlist.md](02_Tasks-61-68_Quantity-Cart-Wishlist.md)

---

## Document Overview

This document covers the implementation of the variant selection system for products with multiple options such as size and color. It includes creating the variant selection container, option groups for different variant types, size and color selectors with appropriate visual representations, unavailable state styling, variant selection logic with validation, and dynamic price updates when variants change.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create Variant Selection Container | Low | 25 min |
| 54 | Create Variant Option Group | Low | 30 min |
| 55 | Create Size Selector | Low | 35 min |
| 56 | Create Color Selector | Medium | 40 min |
| 57 | Create Color Swatch | Low | 25 min |
| 58 | Create Variant Unavailable State | Low | 20 min |
| 59 | Create Variant Selection Logic | Medium | 45 min |
| 60 | Create Price Update on Variant | Medium | 35 min |

---

## Task 53: Create Variant Selection Container

### Overview
Build the main variant selection container component that houses all variant option groups for a product. This container manages the layout structure for variant selectors like size and color, provides consistent spacing between variant groups, handles conditional rendering when variants exist, and serves as the coordination point for variant selection state management.

### Dependencies
- Task 35: Product Info Container (parent component)
- Product data types with variant definitions
- State management setup (local state or Zustand)
- Variant data structure defined

### Instructions

1. **Create variant selection container file**
   - Navigate to `frontend/components/storefront/product/VariantSelector/` directory
   - Create `VariantSelector.tsx` file
   - Set up TypeScript functional component structure
   - Import necessary React hooks and types

2. **Define TypeScript interfaces**
   - Create `VariantSelectorProps` interface
   - Include product variants array (variant types and options)
   - Add selectedVariants state object (key-value pairs)
   - Include onVariantChange callback function
   - Add availableVariants data (stock availability)
   - Include loading state boolean

3. **Implement container structure**
   - Use semantic section or div element
   - Apply vertical stack layout for variant groups
   - Add consistent spacing between groups (16-20px)
   - Include heading "Select Options" or "Choose Your Options"
   - Handle conditional rendering if no variants

4. **Set up state management**
   - Local state for selected variants object
   - State shape: { size: "M", color: "Blue" }
   - Lift state to parent if needed
   - Initialize with default selections (if applicable)
   - Update parent component on changes

5. **Implement variant groups rendering**
   - Map through variant types array
   - Render VariantOptionGroup for each type
   - Pass appropriate props to each group
   - Handle different variant types (size, color, material, etc.)
   - Maintain render order (size first, then color)

6. **Add conditional rendering logic**
   - Only show container if product has variants
   - Hide if simple product (no variants)
   - Show loading skeleton while fetching variant data
   - Display error state if variant data fails to load
   - Handle empty variants array gracefully

7. **Implement responsive behavior**
   - Desktop: Full width with proper spacing
   - Tablet: Maintained layout with adjusted padding
   - Mobile: Full width stack, optimized touch targets
   - Ensure variant buttons are touch-friendly (min 44x44px)

8. **Add accessibility features**
   - Semantic HTML structure with proper headings
   - ARIA labels for variant selection region
   - Keyboard navigation support
   - Screen reader announces variant changes
   - Focus management between variant groups

### Container Structure

```
VariantSelector Container
├── Heading
│   └── "Select Options"
├── Size Variant Group (if exists)
│   ├── Label: "Size"
│   └── Size Options (XS, S, M, L, XL, XXL)
├── Color Variant Group (if exists)
│   ├── Label: "Color"
│   └── Color Swatches
├── Material Variant Group (if exists)
│   ├── Label: "Material"
│   └── Material Options
└── [Additional variant groups...]
```

### Variant Data Structure

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| variantTypes | Array | Types of variants available | ["size", "color"] |
| options | Object | Available options per type | { size: ["S","M","L"], color: ["Red","Blue"] } |
| selectedVariants | Object | Currently selected values | { size: "M", color: "Blue" } |
| availability | Object | Stock status per combination | { "M-Blue": { available: true, stock: 5 } } |
| pricing | Object | Price per variant combination | { "M-Blue": 2500, "L-Red": 2650 } |

### Layout Configuration

| Breakpoint | Container Width | Gap | Padding | Button Size |
|------------|----------------|-----|---------|-------------|
| Mobile (<640px) | 100% | 16px | 16px | 44x44px min |
| Tablet (640-1024px) | 100% | 18px | 20px | 48x48px |
| Desktop (>1024px) | 100% | 20px | 24px | 44x44px |

### State Management Flow

```
User Clicks Variant Option
    ↓
VariantSelector receives selection
    ↓
Update selectedVariants state
    ↓
Check variant availability (Task 59)
    ↓
Call onVariantChange callback
    ↓
Parent updates price (Task 60)
    ↓
Parent updates gallery images
    ↓
Parent updates stock status
```

### Conditional Rendering Logic

| Condition | Display Behavior |
|-----------|------------------|
| No variants | Hide component completely |
| Loading variants | Show skeleton placeholders |
| Variants available | Render all variant groups |
| Error loading | Show error message with retry |
| Single variant type | Show only that type |
| Multiple variant types | Show all in order |

### Expected Outcome
- Functional variant selection container
- Proper vertical spacing between variant groups
- State management for selected variants
- Conditional rendering based on product type
- Responsive layout across all devices
- Accessible keyboard navigation
- Loading and error states handled
- Clean component composition pattern

### Verification Checklist
- [ ] Component renders with variant data
- [ ] All variant groups display correctly
- [ ] Spacing between groups consistent (16-20px)
- [ ] State updates on variant selection
- [ ] Callback fires with selected variants
- [ ] Hidden if product has no variants
- [ ] Loading skeleton displays during fetch
- [ ] Responsive layout works on all devices
- [ ] Keyboard navigation functional
- [ ] ARIA labels present for accessibility
- [ ] TypeScript compiles without errors
- [ ] Visual styling matches design system

---

## Task 54: Create Variant Option Group

### Overview
Implement the reusable variant option group component that displays a specific type of variant (e.g., size or color) with its label and options. This component serves as a wrapper for individual variant selectors, manages the layout of variant options, handles the selected state styling, and coordinates with the parent container.

### Dependencies
- Task 53: Variant Selection Container (parent)
- Variant data structure defined
- Theme styling system configured

### Instructions

1. **Create variant option group file**
   - Navigate to `frontend/components/storefront/product/VariantSelector/` directory
   - Create `VariantOptionGroup.tsx` file
   - Set up reusable component accepting variant type
   - Import necessary dependencies

2. **Define TypeScript interfaces**
   - Create `VariantOptionGroupProps` interface
   - Include variantType string (e.g., "size", "color")
   - Include label string for display (e.g., "Size", "Color")
   - Add options array for variant values
   - Include selectedValue string (current selection)
   - Add onSelect callback function
   - Include availableOptions array (for stock checking)
   - Add disabled boolean for entire group

3. **Implement group structure**
   - Container div with proper spacing
   - Label element displaying variant type
   - Show selected value in label (optional)
   - Options container with appropriate layout
   - Flexible to accommodate different option types

4. **Set up label styling**
   - Font size: 14-16px (medium)
   - Font weight: Medium or semibold (500-600)
   - Color: Primary text (gray-900)
   - Margin bottom: 8-12px
   - Include selected value in gray: "Size: Medium"

5. **Implement options container layout**
   - Flex wrap layout for multiple options
   - Grid layout for consistent sizing (alternative)
   - Gap between options: 8-12px
   - Horizontal arrangement by default
   - Wrap to multiple rows if needed

6. **Add selected value display in label**
   - Format: "Size: Medium" or "Color: Blue"
   - Show only when option selected
   - Use color coding for emphasis
   - Update dynamically on selection
   - Optional: show in parentheses

7. **Implement conditional rendering**
   - Only render if options array not empty
   - Handle loading state for options
   - Show placeholder if no options available
   - Disable entire group if disabled prop true

8. **Set up accessibility**
   - Use fieldset and legend elements (semantic)
   - Proper label association
   - ARIA labelledby for group
   - Role="radiogroup" for single selections
   - Keyboard navigation within group

### Option Group Structure

```
VariantOptionGroup
├── Label + Selected Value
│   └── "Size: Medium" or "Color: Blue"
├── Options Container
│   ├── Option 1 (Available)
│   ├── Option 2 (Selected)
│   ├── Option 3 (Available)
│   └── Option 4 (Unavailable)
└── [Helper text if needed]
```

### Label Format Options

| Format | Example | When to Use |
|--------|---------|-------------|
| Simple | "Size" | Before selection |
| With Selection | "Size: Medium" | After selection |
| Parentheses | "Size (Medium)" | Alternative format |
| Separate | "Size" + "Medium" in badge | Visual emphasis |

### Layout Configurations

| Layout Type | Use Case | CSS Classes |
|-------------|----------|-------------|
| Flex Wrap | Variable option counts | `flex flex-wrap gap-2` |
| Grid | Consistent sizing | `grid grid-cols-4 gap-2` |
| Inline Flex | Few options | `inline-flex gap-2` |
| Stack | Mobile optimization | `flex flex-col gap-2` |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `space-y-3` | Vertical spacing |
| Label | `text-sm font-medium text-gray-900` | Prominent label |
| Selected Info | `text-gray-600 ml-1` | Secondary info |
| Options Container | `flex flex-wrap gap-2` | Flexible layout |

### Variant Type Handling

| Variant Type | Component Used | Layout | Notes |
|--------------|---------------|--------|-------|
| Size | SizeSelector | Flex wrap | Text-based buttons |
| Color | ColorSelector | Flex wrap | Color swatches |
| Material | Text buttons | Flex wrap | Similar to size |
| Style | Text buttons | Flex wrap | Similar to size |
| Custom | Generic buttons | Flex wrap | Fallback for any type |

### Expected Outcome
- Reusable variant option group component
- Clear label with variant type
- Selected value displayed in label
- Flexible layout for different option types
- Proper spacing and visual hierarchy
- Accessible with semantic HTML
- Works with size, color, and other variant types
- Clean integration with parent container

### Verification Checklist
- [ ] Component renders with variant options
- [ ] Label displays variant type correctly
- [ ] Selected value shows in label
- [ ] Options container has proper layout
- [ ] Gap spacing between options correct
- [ ] onSelect callback fires on option click
- [ ] Component handles size selector (Task 55)
- [ ] Component handles color selector (Task 56)
- [ ] Accessible with keyboard navigation
- [ ] ARIA attributes present
- [ ] TypeScript types correct
- [ ] Styling matches design system

---

## Task 55: Create Size Selector

### Overview
Build the size selector component that displays size options as clickable buttons with clear visual states for available, selected, and unavailable sizes. This component handles common size abbreviations (XS, S, M, L, XL, XXL), implements proper button states with distinct styling, manages touch-friendly sizing for mobile devices, and provides accessible size selection.

### Dependencies
- Task 54: Variant Option Group (parent wrapper)
- Size data array from product variants
- Selection state management
- Stock availability data

### Instructions

1. **Create size selector component file**
   - Navigate to `frontend/components/storefront/product/VariantSelector/` directory
   - Create `SizeSelector.tsx` file
   - Set up component accepting size options array
   - Import button and state management utilities

2. **Define TypeScript interfaces**
   - Create `SizeSelectorProps` interface
   - Include sizes array (size objects with value, label, available)
   - Add selectedSize string (current selection)
   - Include onSizeSelect callback function
   - Add disabled boolean for entire selector

3. **Implement size option rendering**
   - Map through sizes array
   - Render button for each size option
   - Display size abbreviation (S, M, L, etc.)
   - Add full size name in tooltip
   - Handle click events for selection

4. **Set up button styling structure**
   - Base button: Border, square/rounded shape
   - Available: Border gray, clickable, hover effect
   - Selected: Filled background (primary color)
   - Unavailable: Strikethrough, disabled, muted
   - Focus: Visible focus ring for accessibility

5. **Implement size button dimensions**
   - Minimum touch target: 44x44px (mobile accessibility)
   - Desktop: 48x48px or slightly rectangular
   - Consistent sizing across all size buttons
   - Padding: 12-16px
   - Square or slightly wide rectangular shape

6. **Create state-specific styling**
   - Available state: `border border-gray-300 hover:border-gray-400 bg-white text-gray-900`
   - Selected state: `border-2 border-blue-600 bg-blue-600 text-white`
   - Unavailable state: `border border-gray-200 bg-gray-50 text-gray-400 line-through cursor-not-allowed`
   - Transition: Smooth color and border transitions (150ms)

7. **Add size option data structure**
   - Size value: "S", "M", "L", etc.
   - Full name: "Small", "Medium", "Large"
   - Available boolean: true/false based on stock
   - Stock count: Number available (optional)
   - Display order: XS, S, M, L, XL, XXL, XXXL

8. **Implement click handling logic**
   - Check if size is available before selection
   - Prevent selection of unavailable sizes
   - Call onSizeSelect callback with selected size
   - Update visual state immediately (optimistic UI)
   - Provide haptic feedback on mobile (if supported)

9. **Add tooltip for full size name**
   - Show on hover (desktop)
   - Display full name: "Small", "Medium", "Large"
   - Include stock info: "5 available" or "Out of stock"
   - Position above button
   - Delay tooltip appearance (300-500ms)

10. **Set up accessibility features**
    - Button role with proper aria-label
    - Aria-pressed for selected state
    - Aria-disabled for unavailable sizes
    - Keyboard navigation (arrow keys)
    - Screen reader announces selection changes

### Size Options Configuration

| Size Code | Full Name | Display | Order |
|-----------|-----------|---------|-------|
| XS | Extra Small | XS | 1 |
| S | Small | S | 2 |
| M | Medium | M | 3 |
| L | Large | L | 4 |
| XL | Extra Large | XL | 5 |
| XXL | 2X Large | XXL | 6 |
| XXXL | 3X Large | XXXL | 7 |
| Freesize | One Size Fits All | Freesize | - |

### Button State Styling

| State | Border | Background | Text Color | Additional |
|-------|--------|------------|------------|------------|
| Available | gray-300 | white | gray-900 | Hover: border-gray-400 |
| Selected | blue-600 (2px) | blue-600 | white | Font: semibold |
| Unavailable | gray-200 | gray-50 | gray-400 | Strikethrough, disabled |
| Hover (available) | gray-400 | gray-50 | gray-900 | Cursor pointer |
| Focus | blue-500 ring | - | - | 2px ring offset |

### Size Button Dimensions

```
┌────────────┐
│            │
│     M      │  ← 48x48px (Desktop)
│            │
└────────────┘

Mobile Touch Target: 44x44px minimum
Desktop: 48x48px (square or 52x48px slightly wide)
Padding: 12px horizontal, 12px vertical
Border: 1px (2px when selected)
Border Radius: 4-6px (rounded)
```

### Selection Flow

```
User Clicks Size Button
    ↓
Check if size available
    ↓
├── Available: Proceed with selection
│   ├── Update selectedSize state
│   ├── Apply selected styling
│   ├── Call onSizeSelect callback
│   └── Announce to screen readers
│
└── Unavailable: Prevent selection
    ├── Show "Out of stock" tooltip
    └── No state change
```

### Tooltip Content

| Scenario | Tooltip Text |
|----------|--------------|
| Available, in stock | "Medium - 12 available" |
| Available, low stock | "Large - Only 2 left" |
| Unavailable | "Extra Large - Out of stock" |
| Selected | "Small - Currently selected" |

### Expected Outcome
- Functional size selector with clear button states
- Available, selected, and unavailable styling distinct
- Touch-friendly button dimensions (44x44px min)
- Proper state management and selection callbacks
- Tooltips showing full size names and stock
- Strikethrough styling for unavailable sizes
- Keyboard navigation support
- Accessible to screen readers

### Verification Checklist
- [ ] Component renders size options correctly
- [ ] All size buttons minimum 44x44px
- [ ] Available sizes have border and white background
- [ ] Selected size has blue background and white text
- [ ] Unavailable sizes have strikethrough styling
- [ ] Click on available size updates selection
- [ ] Click on unavailable size is prevented
- [ ] onSizeSelect callback fires with size value
- [ ] Tooltip shows full size name on hover
- [ ] Keyboard navigation works (arrow keys)
- [ ] Focus ring visible on keyboard focus
- [ ] ARIA attributes present
- [ ] Screen reader announces changes
- [ ] TypeScript types correct
- [ ] Styling consistent across states

---

## Task 56: Create Color Selector

### Overview
Implement the color selector component that displays color options as visual color swatches with selection indicators. This component uses actual color values for visual representation, implements bordered swatches with selection rings, handles color names and hex values, manages the relationship with product gallery images, and ensures accessibility with color names for screen readers.

### Dependencies
- Task 54: Variant Option Group (parent wrapper)
- Task 57: Color Swatch (child component)
- Color data array from product variants
- Selection state management
- Stock availability data

### Instructions

1. **Create color selector component file**
   - Navigate to `frontend/components/storefront/product/VariantSelector/` directory
   - Create `ColorSelector.tsx` file
   - Set up component accepting color options array
   - Import ColorSwatch component

2. **Define TypeScript interfaces**
   - Create `ColorSelectorProps` interface
   - Include colors array (color objects with name, hex, image, available)
   - Add selectedColor string (current selection)
   - Include onColorSelect callback function
   - Add onColorHover callback (for gallery preview)
   - Include disabled boolean

3. **Implement color option rendering**
   - Map through colors array
   - Render ColorSwatch for each color option (Task 57)
   - Display color visually using hex/rgb value
   - Show color name in tooltip
   - Handle click and hover events

4. **Set up color data structure**
   - Color name: "Navy Blue", "Crimson Red"
   - Color hex value: "#1e3a8a", "#dc2626"
   - Color image: URL to product image in that color
   - Available boolean: Stock availability
   - Display order: As provided or alphabetically

5. **Implement selection indicator styling**
   - Selected: 2-3px border ring around swatch
   - Ring color: Primary color (blue-600) or black
   - Ring offset: 2px gap between swatch and ring
   - Scale slightly on selection (optional)
   - Smooth transition animation

6. **Add hover preview functionality**
   - On hover, preview color in gallery
   - Call onColorHover callback with color data
   - Gallery updates to show product in that color
   - Reset gallery on mouse leave (optional)
   - Debounce hover events (200ms)

7. **Implement click handling logic**
   - Check if color is available before selection
   - Prevent selection of unavailable colors
   - Call onColorSelect callback with color data
   - Update gallery to color-specific images
   - Update price if color affects pricing
   - Show visual feedback immediately

8. **Add color name tooltip**
   - Show color name on hover
   - Position above or below swatch
   - Include availability: "Navy Blue - In Stock"
   - Show stock count if low: "Only 3 left"
   - Delay tooltip appearance (300ms)

9. **Handle multi-tone colors**
   - Gradient swatches for multi-color items
   - Pattern representation (stripes, polka dots)
   - Split color swatches for two-tone
   - Special handling for prints or patterns

10. **Set up accessibility features**
    - Button role for each swatch
    - Aria-label with full color name
    - Aria-pressed for selected state
    - Aria-disabled for unavailable colors
    - Screen reader announces color selection
    - Keyboard navigation support

### Color Data Structure

| Property | Type | Example | Required |
|----------|------|---------|----------|
| id | string | "color-navy-blue" | Yes |
| name | string | "Navy Blue" | Yes |
| hex | string | "#1e3a8a" | Yes |
| rgb | string | "rgb(30, 58, 138)" | No |
| image | string | "/images/product-navy.jpg" | No |
| images | array | Array of gallery images | No |
| available | boolean | true | Yes |
| stock | number | 8 | No |

### Selection Ring Styling

```
Unselected Swatch
┌───────────┐
│           │
│   Color   │  ← Just the color circle
│           │
└───────────┘

Selected Swatch
  ┌─────────┐
┌─┼─────────┼─┐
│ │         │ │
│ │  Color  │ │  ← Blue ring around color
│ │         │ │
└─┼─────────┼─┘
  └─────────┘
```

### Color Swatch States

| State | Ring | Opacity | Cursor | Additional |
|-------|------|---------|--------|------------|
| Available | None | 100% | pointer | Hover: scale 1.05 |
| Selected | 2-3px blue-600 | 100% | pointer | Ring offset 2px |
| Unavailable | None | 50% | not-allowed | Diagonal line overlay |
| Hover (available) | Thin gray | 100% | pointer | Preview in gallery |

### Gallery Preview Flow

```
User Hovers Color Swatch
    ↓
Debounce hover event (200ms)
    ↓
Call onColorHover(colorData)
    ↓
Gallery component receives color
    ↓
Update gallery images to color variant
    ↓
Show preview images
    
User Leaves Swatch
    ↓
Reset to selected color images
(or keep preview until clicked)
```

### Multi-Tone Color Display

| Pattern Type | Visual Representation | CSS Implementation |
|--------------|----------------------|-------------------|
| Solid | Single color fill | `background: #1e3a8a` |
| Gradient | Two-color gradient | `background: linear-gradient(45deg, #1e3a8a, #3b82f6)` |
| Two-Tone | Split in half | `background: linear-gradient(90deg, #1e3a8a 50%, #fff 50%)` |
| Pattern | Small pattern image | `background: url('/patterns/polka.png')` |
| Print | Thumbnail preview | `background-image: url('/prints/floral.jpg')` |

### Tooltip Content Examples

| Scenario | Tooltip Text |
|----------|--------------|
| Available | "Navy Blue - In Stock" |
| Low Stock | "Crimson Red - Only 2 left" |
| Out of Stock | "Forest Green - Out of Stock" |
| Selected | "Charcoal Gray - Selected" |
| With Price | "Royal Blue - ₨ 2,650" |

### Expected Outcome
- Functional color selector with visual swatches
- Clear selection indicator (ring around selected)
- Available, selected, and unavailable states distinct
- Hover preview updates gallery images
- Color name tooltips on hover
- Unavailable colors dimmed with overlay
- Keyboard navigation and screen reader support
- Smooth transitions and interactions

### Verification Checklist
- [ ] Component renders color swatches correctly
- [ ] Each swatch displays actual color visually
- [ ] Selected swatch has blue ring around it
- [ ] Ring offset 2px from swatch edge
- [ ] Available colors have 100% opacity
- [ ] Unavailable colors have 50% opacity
- [ ] Click on available color updates selection
- [ ] Click on unavailable color is prevented
- [ ] Hover shows color name tooltip
- [ ] Hover updates gallery images (preview)
- [ ] onColorSelect callback fires correctly
- [ ] Keyboard navigation works
- [ ] ARIA labels include color names
- [ ] Screen reader announces color selection
- [ ] TypeScript types correct

---

## Task 57: Create Color Swatch

### Overview
Build the individual color swatch component that displays a single color as a circular or rounded square button. This reusable component handles color rendering, size variants, state styling, accessibility labels, and interaction states for individual color options.

### Dependencies
- Task 56: Color Selector (parent component)
- Color data structure defined
- Icon library for unavailable overlay
- Tooltip library or custom tooltip

### Instructions

1. **Create color swatch component file**
   - Navigate to `frontend/components/storefront/product/VariantSelector/` directory
   - Create `ColorSwatch.tsx` file
   - Set up reusable component for single color display
   - Import necessary dependencies

2. **Define TypeScript interfaces**
   - Create `ColorSwatchProps` interface
   - Include color name string
   - Include color hex value string
   - Add selected boolean
   - Add available boolean (default true)
   - Include size variant (small, medium, large)
   - Add onClick callback function
   - Add onHover callback function (optional)

3. **Implement swatch structure**
   - Button element for interactivity
   - Circular or rounded square shape
   - Color fill using background-color CSS
   - Border for light colors (contrast)
   - Selection ring wrapper (conditional)

4. **Set up size variants**
   - Small: 32x32px (for compact views, thumbnails)
   - Medium: 40x40px (default for product detail)
   - Large: 48x48px (for emphasis or large screens)
   - Maintain circular shape across sizes
   - Adjust ring size proportionally

5. **Implement color rendering**
   - Set background-color to hex value
   - Add thin border for very light colors (near white)
   - Use box-shadow for depth (subtle)
   - Handle transparency (show checkerboard behind)
   - Special handling for white/light colors

6. **Create selection ring styling**
   - Show only when selected prop is true
   - Ring thickness: 2-3px
   - Ring color: Primary (blue-600) or black
   - Ring offset: 2px gap (use outline-offset)
   - Alternative: box-shadow for ring effect

7. **Implement unavailable state overlay**
   - Reduce opacity to 50%
   - Add diagonal line through swatch
   - Show "X" icon overlay (small)
   - Disable pointer events or show not-allowed cursor
   - Muted appearance

8. **Add hover state styling**
   - Slight scale transform (scale 1.05)
   - Cursor pointer if available
   - Show tooltip with color name
   - Preview ring (thin gray) if not selected
   - Smooth transition animation (150ms)

9. **Implement click handling**
   - Prevent click if unavailable
   - Call onClick callback with color data
   - Provide visual feedback (brief scale or shadow)
   - Ensure touch-friendly for mobile

10. **Set up accessibility**
    - Button element with proper role
    - Aria-label with color name: "Select Navy Blue"
    - Aria-pressed for selected state
    - Aria-disabled for unavailable
    - Title attribute for tooltip fallback
    - Screen reader friendly text

### Swatch Size Specifications

| Size | Dimensions | Border Radius | Ring Width | Use Case |
|------|-----------|---------------|------------|----------|
| Small | 32x32px | 16px (circle) | 2px | Thumbnails, compact lists |
| Medium | 40x40px | 20px (circle) | 2px | Default product detail |
| Large | 48x48px | 24px (circle) | 3px | Featured products, emphasis |

### Color Swatch Structure

```
Color Swatch Component
├── Outer Ring (if selected)
│   └── 2-3px blue border with 2px offset
├── Swatch Button
│   ├── Background: Color hex value
│   ├── Border: 1px light gray (for light colors)
│   └── Shape: Circular (border-radius 50%)
└── Unavailable Overlay (if unavailable)
    ├── Opacity: 50%
    └── Diagonal line or X icon
```

### Selection Ring Implementation

| Method | CSS Implementation | Pros |
|--------|-------------------|------|
| Outline | `outline: 2px solid #2563eb; outline-offset: 2px;` | Clean, doesn't affect layout |
| Box Shadow | `box-shadow: 0 0 0 2px white, 0 0 0 4px #2563eb;` | Layered effect possible |
| Wrapper Border | Parent div with border, child color swatch | More control over spacing |

### State Styling Configuration

| State | Opacity | Border | Cursor | Transform | Additional |
|-------|---------|--------|--------|-----------|------------|
| Available | 100% | 1px gray-300 | pointer | None | - |
| Selected | 100% | Ring (2-3px blue) | pointer | None | - |
| Unavailable | 50% | 1px gray-300 | not-allowed | None | Diagonal line |
| Hover (available) | 100% | 1px gray-400 | pointer | scale(1.05) | Preview ring |
| Focus | 100% | Focus ring | pointer | None | Accessibility |

### Unavailable State Styling

```
Available Swatch      Unavailable Swatch
┌─────────┐          ┌─────────┐
│         │          │    /    │
│  Color  │          │   / X   │  ← Diagonal line + X icon
│         │          │  /      │    + 50% opacity
└─────────┘          └─────────┘
```

### Light Color Border Logic

```
if (isLightColor(hex)) {
  // Add visible border for contrast
  border: 1px solid #d1d5db (gray-300)
}

function isLightColor(hex) {
  // Calculate luminance
  const rgb = hexToRgb(hex)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.9
}
```

### Expected Outcome
- Reusable color swatch component
- Circular shape with color fill
- Selection ring for selected state
- Unavailable overlay with reduced opacity
- Size variants (small, medium, large)
- Hover effects with scale transform
- Proper border for light colors
- Accessible with ARIA labels
- Smooth transitions

### Verification Checklist
- [ ] Component renders with color hex value
- [ ] Circular shape (border-radius 50%)
- [ ] Size variants work (32, 40, 48px)
- [ ] Selected shows blue ring with 2px offset
- [ ] Unavailable shows 50% opacity
- [ ] Unavailable shows diagonal line or X
- [ ] Light colors have visible border
- [ ] Hover scales swatch (1.05)
- [ ] Click calls onClick callback
- [ ] Click prevented if unavailable
- [ ] ARIA label includes color name
- [ ] Tooltip shows on hover
- [ ] TypeScript types correct
- [ ] Smooth transitions (150ms)

---

## Task 58: Create Variant Unavailable State

### Overview
Implement consistent unavailable state styling and behavior across all variant option types. This task ensures that out-of-stock or unavailable variants are clearly communicated through visual styling, prevents selection of unavailable options, provides informative messaging about unavailability, and maintains accessible indication for users with disabilities.

### Dependencies
- Task 55: Size Selector (applies to)
- Task 56: Color Selector (applies to)
- Task 57: Color Swatch (applies to)
- Stock availability data

### Instructions

1. **Define unavailable state criteria**
   - Product variant completely out of stock
   - Variant combination not available (e.g., size M in blue)
   - Variant disabled by business rules
   - Temporary unavailability (pre-order, coming soon)
   - Determine data source for availability

2. **Implement visual styling standards**
   - Opacity reduction: 50% (0.5 opacity)
   - Cursor: not-allowed or default (no pointer)
   - Strikethrough for text-based options (size)
   - Diagonal line overlay for color swatches
   - Muted colors: Convert to grayscale or desaturate
   - Disabled state: pointer-events: none (optional)

3. **Create size option unavailable styling**
   - Strikethrough text decoration
   - Light gray background (gray-50)
   - Gray border (gray-200)
   - Gray text color (gray-400)
   - Remove hover effects
   - Show not-allowed cursor

4. **Create color swatch unavailable styling**
   - Reduce opacity to 50%
   - Add diagonal line across swatch (pseudo-element)
   - Remove hover scale effect
   - Show not-allowed cursor
   - Optional: Show small X icon overlay
   - Maintain color visibility but clearly marked

5. **Implement diagonal line overlay**
   - Use CSS pseudo-element (::before or ::after)
   - Position absolute, covering swatch
   - Diagonal line: 1-2px wide, dark gray
   - Rotate 45 degrees (transform: rotate(-45deg))
   - Z-index above color but below tooltip

6. **Add unavailable tooltip/message**
   - Hover tooltip: "Out of stock"
   - Alternative: "Unavailable in this combination"
   - Include restocking information if available
   - Show estimated availability date
   - Link to notify when available (optional)

7. **Prevent selection of unavailable variants**
   - Check availability before onClick handler
   - Block selection if unavailable
   - Show brief toast: "This option is currently unavailable"
   - Do not update state on unavailable selection attempt
   - Log analytics event (optional)

8. **Implement keyboard and screen reader support**
   - Aria-disabled="true" on unavailable options
   - Screen reader announces "unavailable" or "out of stock"
   - Aria-label includes availability status
   - Skip unavailable options in keyboard navigation (optional)
   - Announce unavailable state on focus

9. **Add conditional rendering logic**
   - Check variant.available boolean
   - Check stock count > 0
   - Check variant combination validity
   - Apply unavailable styling conditionally
   - Update on real-time stock changes

10. **Create consistency across variant types**
    - All variant types use same unavailable pattern
    - Consistent opacity, cursor, and messaging
    - Unified tooltip style and content
    - Same animation behavior (or lack thereof)
    - Coordinated accessibility approach

### Unavailable Criteria

| Condition | Unavailable? | Reason |
|-----------|--------------|--------|
| stock === 0 | Yes | Out of stock |
| stock === null | Yes | No stock data |
| available === false | Yes | Explicitly disabled |
| Combination invalid | Yes | Size+Color not available |
| Pre-order not open | Yes | Coming soon |

### Visual Styling Standards

| Element | Available | Unavailable |
|---------|-----------|-------------|
| Opacity | 100% | 50% |
| Cursor | pointer | not-allowed |
| Hover Effect | Yes (scale, border) | None |
| Background (size) | white | gray-50 |
| Text Color (size) | gray-900 | gray-400 |
| Strikethrough | None | Yes (size options) |
| Diagonal Line | None | Yes (color swatches) |

### Size Option Unavailable Styling

```css
/* Unavailable Size Button */
.size-button-unavailable {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f9fafb; /* gray-50 */
  border-color: #e5e7eb; /* gray-200 */
  color: #9ca3af; /* gray-400 */
  text-decoration: line-through;
  pointer-events: none; /* Prevent interaction */
}
```

### Color Swatch Diagonal Line Implementation

```css
/* Diagonal Line Overlay */
.color-swatch-unavailable::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom right,
    transparent calc(50% - 1px),
    #6b7280 calc(50% - 1px),
    #6b7280 calc(50% + 1px),
    transparent calc(50% + 1px)
  );
  pointer-events: none;
}
```

### Tooltip Messages

| Scenario | Tooltip Content |
|----------|-----------------|
| Out of stock | "Out of stock" |
| Pre-order | "Available from [date]" |
| Combination invalid | "Not available in this combination" |
| With restock | "Out of stock - Restocking soon" |
| With notify | "Out of stock - Click to get notified" |

### Accessibility Implementation

| Attribute | Value | Purpose |
|-----------|-------|---------|
| aria-disabled | "true" | Indicate disabled state |
| aria-label | "Size Large - Out of stock" | Full description |
| role | "button" | Semantic role |
| tabindex | "-1" (optional) | Skip in tab order |

### Prevention Logic

```
User Clicks Unavailable Variant
    ↓
Check variant.available === false
    ↓
Prevent default action
    ↓
Show toast notification
    ↓
"This option is currently unavailable"
    ↓
Do NOT update selection state
    ↓
Log analytics (optional)
```

### Expected Outcome
- Consistent unavailable styling across all variant types
- Size options show strikethrough and muted colors
- Color swatches show diagonal line and reduced opacity
- Selection of unavailable variants prevented
- Tooltips explain unavailability
- Accessible to screen readers and keyboard users
- No hover effects on unavailable options
- Clear visual distinction from available options

### Verification Checklist
- [ ] Unavailable variants have 50% opacity
- [ ] Size unavailable has strikethrough text
- [ ] Color unavailable has diagonal line overlay
- [ ] Cursor shows not-allowed on unavailable
- [ ] Hover effects removed for unavailable
- [ ] Click on unavailable does nothing
- [ ] Toast message shows on unavailable click
- [ ] Tooltip shows "Out of stock" on hover
- [ ] Aria-disabled="true" on unavailable options
- [ ] Screen reader announces unavailable status
- [ ] Consistent styling across size and color
- [ ] TypeScript types handle available boolean
- [ ] Visual distinction clear and obvious

---

## Task 59: Create Variant Selection Logic

### Overview
Build the core variant selection logic that manages variant state, validates variant combinations, checks availability, updates product data based on selections, and coordinates between variant options. This task implements the business logic that powers the variant selection user experience.

### Dependencies
- Task 53: Variant Selection Container
- Task 54: Variant Option Group
- Task 55: Size Selector
- Task 56: Color Selector
- Product data with variant combinations
- Stock availability data

### Instructions

1. **Create variant selection hook file**
   - Navigate to `frontend/hooks/store/` directory
   - Create `useVariantSelection.ts` custom hook
   - Centralize variant selection logic
   - Export hook for use in components

2. **Define TypeScript interfaces and types**
   - Create `VariantSelection` type: Record<string, string>
   - Create `VariantOption` interface: { type, value, available, stock }
   - Create `VariantCombination` interface: { variants, sku, price, stock, available, images }
   - Create `VariantState` interface: { selected, available, loading, error }
   - Define return type for hook

3. **Implement state management**
   - Use useState for selectedVariants object: { size: "M", color: "Blue" }
   - Use useState for availableOptions object: which options are available
   - Use useState for currentVariant: full variant data for selection
   - Track previous selections for smart defaults
   - Handle loading and error states

4. **Create variant combination lookup**
   - Function: findVariantCombination(selections)
   - Look up variant in product data by combination
   - Match selected size + color to specific variant
   - Return variant object: { sku, price, stock, images, available }
   - Handle missing combinations gracefully

5. **Implement availability checking logic**
   - Function: checkVariantAvailability(type, value)
   - Check if specific variant option is available
   - Consider current selections (cross-validation)
   - Check stock levels > 0
   - Return boolean: true/false

6. **Create dynamic option filtering**
   - Filter available options based on current selections
   - If size "M" selected, show only colors available in M
   - If color "Blue" selected, show only sizes available in Blue
   - Update available options on each selection
   - Prevent invalid combinations

7. **Implement selection validation**
   - Validate combination exists before confirming
   - Check stock availability for combination
   - Validate all required variants selected
   - Show validation errors if needed
   - Prevent invalid state

8. **Add smart defaulting behavior**
   - Auto-select first available option (optional)
   - Remember last user selections (localStorage)
   - Pre-select from URL parameters (query string)
   - Pre-select most popular variant
   - Handle conflicts intelligently

9. **Create selection change handler**
   - Function: handleVariantChange(type, value)
   - Update selectedVariants state
   - Validate new combination
   - Update available options for other types
   - Trigger price update (Task 60)
   - Trigger gallery image update
   - Call parent callbacks

10. **Implement reset and clear functions**
    - Function: resetSelections()
    - Clear all variant selections
    - Reset to default state or first options
    - Function: clearVariantType(type)
    - Clear specific variant type selection
    - Update dependent selections

11. **Add validation error handling**
    - Detect invalid combinations
    - Show user-friendly error messages
    - Suggest alternative combinations
    - Guide user to valid selections
    - Prevent add to cart if invalid

12. **Set up side effects and callbacks**
    - useEffect to update price on selection change
    - useEffect to update gallery images
    - useEffect to update stock status
    - Call onVariantChange callback to parent
    - Broadcast selection changes

### Variant Selection State Shape

```typescript
interface VariantSelectionState {
  selectedVariants: {
    size?: string;      // "M"
    color?: string;     // "Navy Blue"
    material?: string;  // Optional third variant
  };
  currentVariant: {
    sku: string;
    price: number;
    originalPrice?: number;
    stock: number;
    available: boolean;
    images: string[];
  } | null;
  availableOptions: {
    size: string[];     // ["S", "M", "L"]
    color: string[];    // ["Navy Blue", "Black"]
  };
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Variant Combination Lookup Logic

```
findVariantCombination({ size: "M", color: "Blue" })
    ↓
Look up in product variants array
    ↓
Find variant where:
    variant.attributes.size === "M"
    AND variant.attributes.color === "Blue"
    ↓
Return variant object:
    {
      sku: "SHIRT-M-BLUE",
      price: 2500,
      stock: 8,
      available: true,
      images: ["/images/shirt-m-blue-1.jpg", ...]
    }
```

### Availability Checking Algorithm

```
checkVariantAvailability("color", "Red")
    ↓
Get currently selected size: "M"
    ↓
Look for variant with size="M" AND color="Red"
    ↓
├── Found and stock > 0: Return true (available)
├── Found but stock = 0: Return false (unavailable)
└── Not found: Return false (combination doesn't exist)
```

### Dynamic Option Filtering

| Current Selection | Available Options Update |
|-------------------|-------------------------|
| None | All sizes and colors shown |
| Size: "M" | Only colors available in size M shown |
| Color: "Blue" | Only sizes available in Blue shown |
| Size: "M", Color: "Blue" | Specific variant selected |

### Selection Validation Flow

```
User Selects Variant Option
    ↓
handleVariantChange("size", "L")
    ↓
Update selectedVariants state
    ↓
Check if all required variants selected
    ↓
├── All selected: Validate combination
│   ├── Combination exists
│   ├── Stock available
│   └── Set currentVariant
│
└── Some missing: Wait for more selections
    └── Update available options for other types
```

### Smart Defaulting Priority

| Priority | Method | Example |
|----------|--------|---------|
| 1 | URL parameters | ?size=M&color=Blue |
| 2 | User's last selection | localStorage |
| 3 | Most popular variant | Analytics data |
| 4 | First available option | Array[0] |
| 5 | None (user must select) | Empty state |

### Expected Outcome
- Custom hook managing variant selection state
- Validation of variant combinations
- Dynamic filtering of available options
- Smart defaults and pre-selection
- Availability checking for each option
- Side effects triggering price and image updates
- Error handling for invalid combinations
- Clean API for components to consume
- Reusable across product pages

### Verification Checklist
- [ ] useVariantSelection hook created
- [ ] Hook returns selectedVariants state
- [ ] Hook returns handleVariantChange function
- [ ] Selecting size updates state correctly
- [ ] Selecting color updates state correctly
- [ ] Invalid combinations prevented
- [ ] Available options filtered dynamically
- [ ] Size M selected shows only available colors in M
- [ ] Unavailable combinations marked correctly
- [ ] findVariantCombination returns correct variant
- [ ] currentVariant updates on valid selection
- [ ] Price updates triggered (Task 60)
- [ ] Gallery images update on color change
- [ ] Error state handled gracefully
- [ ] TypeScript types correct
- [ ] Hook reusable and performant

---

## Task 60: Create Price Update on Variant

### Overview
Implement dynamic price updating functionality that changes the displayed price when users select different variant combinations. This task handles price changes based on variant selections, updates all price-related components, manages discount recalculation for variant-specific pricing, implements smooth transitions, and ensures price accuracy across the interface.

### Dependencies
- Task 41: Price Display Component
- Task 42: Original Price Component
- Task 43: Discount Badge Component
- Task 59: Variant Selection Logic
- Variant pricing data

### Instructions

1. **Define variant pricing structure**
   - Each variant combination has a price
   - Example: { size: "M", color: "Blue" } → ₨ 2,500
   - Example: { size: "L", color: "Red" } → ₨ 2,650
   - Store variant prices in product data
   - Include original price if on sale

2. **Create price update function**
   - Function: updatePriceFromVariant(variantData)
   - Extract price from current variant combination
   - Update price state in parent component
   - Trigger re-render of price components
   - Handle missing price data gracefully

3. **Implement price extraction logic**
   - Get currentVariant from useVariantSelection hook
   - Extract price: currentVariant.price
   - Extract original price: currentVariant.originalPrice
   - Calculate discount: if original > current
   - Handle null or undefined prices

4. **Update Price Display component (Task 41)**
   - Accept price prop from parent state
   - Accept originalPrice prop if on sale
   - React to prop changes automatically
   - Display updated price immediately
   - Maintain LKR currency formatting

5. **Update Original Price component (Task 42)**
   - Show/hide based on variant pricing
   - Some variants may not have discount
   - Update originalPrice prop dynamically
   - Conditional rendering if prices equal
   - Maintain strikethrough styling

6. **Update Discount Badge component (Task 43)**
   - Recalculate discount percentage
   - Formula: ((original - current) / original) * 100
   - Update badge text with new percentage
   - Show/hide badge if discount changes
   - Handle variants with no discount

7. **Implement smooth price transitions**
   - CSS transition on price change (300ms)
   - Fade out old price, fade in new price
   - Brief highlight animation (optional)
   - Scale pulse effect (optional)
   - Smooth update without jarring changes

8. **Add loading state during variant change**
   - Show loading indicator if fetching variant data
   - Skeleton loader for price during load
   - Prevent multiple rapid updates
   - Debounce price updates (if needed)
   - Handle async variant data fetching

9. **Implement price range display (before selection)**
   - If no variant selected, show price range
   - Format: "₨ 2,500 - ₨ 3,500"
   - Calculate from all variant prices
   - Find min and max prices
   - Switch to single price on selection

10. **Add price change announcement**
    - Screen reader announces price change
    - ARIA live region for price updates
    - Announce: "Price updated to ₨ 2,650"
    - Don't spam announcements on rapid changes
    - Ensure accessibility compliance

11. **Handle edge cases**
    - Variant with no price data: Show "Contact for price"
    - Free variant: Show "Free" instead of ₨ 0.00
    - Price fetch error: Show previous price + error notice
    - Invalid variant: Keep displaying last valid price
    - Out of stock variant: Gray out price (optional)

12. **Create price validation**
    - Validate price is a valid number
    - Ensure price > 0 (except free items)
    - Check price format and decimals
    - Verify currency consistency (LKR)
    - Log errors for invalid prices

### Variant Pricing Data Structure

```typescript
interface VariantPricing {
  sku: string;
  combination: {
    size: string;
    color: string;
  };
  price: number;           // Current price: 2500
  originalPrice?: number;  // Pre-discount price: 3000
  discount?: number;       // Percentage: 20
  currency: "LKR";
}

// Example product variants with pricing
variants: [
  {
    sku: "SHIRT-M-BLUE",
    attributes: { size: "M", color: "Blue" },
    price: 2500,
    originalPrice: 3000,
    stock: 8
  },
  {
    sku: "SHIRT-L-RED",
    attributes: { size: "L", color: "Red" },
    price: 2650,
    originalPrice: 2650,  // No discount
    stock: 5
  }
]
```

### Price Update Flow

```
User Selects Variant
    ↓
handleVariantChange called (Task 59)
    ↓
Update selectedVariants state
    ↓
Find matching variant combination
    ↓
Extract price from variant: variant.price
    ↓
Update price state in parent component
    ↓
Price Display component receives new price
    ↓
Component re-renders with new price
    ↓
Original Price and Discount Badge update
    ↓
Screen reader announces price change
```

### Price Calculation Examples

| Variant | Base Price | Original Price | Discount | Display |
|---------|-----------|----------------|----------|---------|
| M, Blue | ₨ 2,500 | ₨ 3,000 | 16.7% | ~~₨ 3,000~~ ₨ 2,500 -17% OFF |
| L, Red | ₨ 2,650 | - | 0% | ₨ 2,650 |
| XL, Green | ₨ 2,800 | ₨ 3,200 | 12.5% | ~~₨ 3,200~~ ₨ 2,800 -13% OFF |

### Price Range Display (No Selection)

```
Before Variant Selection:
┌────────────────────────────┐
│  ₨ 2,500 - ₨ 3,500        │  ← Price range
└────────────────────────────┘

After Selecting M + Blue:
┌────────────────────────────┐
│  ₨ 2,500.00                │  ← Specific price
└────────────────────────────┘
```

### Price Transition CSS

```css
.price-display {
  transition: all 300ms ease-in-out;
}

.price-update-animation {
  animation: priceHighlight 600ms ease-in-out;
}

@keyframes priceHighlight {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); color: #2563eb; }
}
```

### ARIA Live Announcement

```html
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {priceChangeMessage}
</div>

<!-- Example announcement -->
"Price updated to ₨ 2,650"
```

### Edge Case Handling

| Edge Case | Solution |
|-----------|----------|
| No price data | Display "Contact for pricing" |
| Price = 0 | Display "Free" |
| Invalid variant | Keep last valid price |
| Fetch error | Show previous price + retry button |
| Out of stock | Gray out price, strike through (optional) |
| Negative price | Log error, show contact message |

### Expected Outcome
- Dynamic price updates on variant selection
- Smooth transition animations between prices
- Discount percentage recalculates correctly
- Original price and badge update appropriately
- Price range shown before selection
- Single price shown after valid selection
- Screen reader announces price changes
- Loading states during async updates
- Edge cases handled gracefully
- Consistent LKR currency formatting

### Verification Checklist
- [ ] Price updates when size selected
- [ ] Price updates when color selected
- [ ] Price updates for size + color combination
- [ ] Correct price extracted from variant data
- [ ] Price Display component re-renders with new price
- [ ] Original Price updates or hides appropriately
- [ ] Discount Badge recalculates percentage
- [ ] Discount Badge shows/hides based on variant
- [ ] Transition animation smooth (300ms)
- [ ] Price range shown before selection
- [ ] Single price shown after valid selection
- [ ] ARIA live region announces changes
- [ ] Loading state shows during fetch
- [ ] Edge cases handled (no price, free, error)
- [ ] LKR formatting consistent
- [ ] TypeScript types correct

---

## End of Document

### Summary of Tasks Completed

This document covered 8 tasks related to variant selection container, size and color selectors, unavailable states, selection logic, and dynamic price updates:

- ✅ Task 53: Variant Selection Container - Main layout for variant options
- ✅ Task 54: Variant Option Group - Reusable wrapper for variant types
- ✅ Task 55: Size Selector - Size buttons with state management
- ✅ Task 56: Color Selector - Color swatches with selection rings
- ✅ Task 57: Color Swatch - Individual color display component
- ✅ Task 58: Variant Unavailable State - Consistent unavailable styling
- ✅ Task 59: Variant Selection Logic - Core selection and validation logic
- ✅ Task 60: Price Update on Variant - Dynamic price changes

### Next Steps

Continue to the next document to implement:
- Task 61: Quantity Selector
- Task 62: Quantity Min/Max Limits
- Task 63: Add to Cart Button
- Task 64: Buy Now Button
- Task 65: Add to Cart Loading State
- Task 66: Add to Cart Success Toast
- Task 67: Wishlist Button
- Task 68: Verify Cart Actions

**→ Next Document:** [02_Tasks-61-68_Quantity-Cart-Wishlist.md](02_Tasks-61-68_Quantity-Cart-Wishlist.md)
