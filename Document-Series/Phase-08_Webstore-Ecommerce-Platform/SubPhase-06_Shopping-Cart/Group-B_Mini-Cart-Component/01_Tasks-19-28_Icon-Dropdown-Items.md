# Tasks 19-28: Icon, Dropdown, and Items

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** B - Mini Cart Component  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-29-36_Actions-Footer-Verify.md](02_Tasks-29-36_Actions-Footer-Verify.md)

---

## Document Overview

This document covers the creation of the mini cart component's core structure, including the cart icon button with badge, the dropdown container with positioning, header, items list, and individual item display components. It establishes the visual and interactive foundation for the shopping cart dropdown that appears when users click the cart icon in the header.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create Mini Cart Directory | Low | 10 min |
| 20 | Create Cart Icon Button | Low | 25 min |
| 21 | Create Cart Badge | Low | 20 min |
| 22 | Create Mini Cart Dropdown | Medium | 35 min |
| 23 | Create Mini Cart Position | Low | 20 min |
| 24 | Create Mini Cart Header | Low | 20 min |
| 25 | Create Mini Cart Items List | Low | 25 min |
| 26 | Create Mini Cart Item | Low | 30 min |
| 27 | Create Mini Cart Item Image | Low | 20 min |
| 28 | Create Mini Cart Item Info | Low | 25 min |

---

## Task 19: Create Mini Cart Directory

### Overview
Create the directory structure for the mini cart component system. This establishes an organized location for all mini cart-related components within the storefront cart components directory.

### Dependencies
- Task 18: Verify cart state implementation (from Group A)
- Storefront components directory structure exists

### Instructions

1. **Navigate to storefront components**
   - Go to `frontend/components/storefront/` directory
   - Confirm cart directory exists from previous group

2. **Create MiniCart directory**
   - Inside `components/storefront/cart/` create `MiniCart/` directory
   - This houses all mini cart dropdown components
   - Maintains separation from cart page components

3. **Understand directory purpose**
   - MiniCart: Dropdown component system
   - Separate from full cart page components
   - Contains icon, dropdown, items, actions

4. **Verify directory structure**
   - Confirm nested path exists
   - Ensure proper naming convention

### Directory Structure
```
frontend/components/storefront/cart/
├── MiniCart/              # (Created in this task)
│   └── (Components will be added in subsequent tasks)
├── (Other cart components from cart page)
└── index.ts
```

### Expected Outcome
- Clean directory structure for mini cart components
- Organized location for dropdown-related files
- Foundation for component creation in subsequent tasks

### Verification Checklist
- [ ] `frontend/components/storefront/cart/MiniCart/` directory exists
- [ ] Directory is empty and ready for components
- [ ] Path follows project structure conventions

---

## Task 20: Create Cart Icon Button

### Overview
Create the CartIconButton component that displays in the website header. This component shows a shopping cart icon and triggers the mini cart dropdown when clicked. It serves as the primary access point for users to view their cart contents.

### Dependencies
- Task 19: Create Mini Cart Directory
- Header component exists in storefront layout
- Cart state store is operational

### Instructions

1. **Create CartIconButton component file**
   - Navigate to `frontend/components/storefront/cart/MiniCart/` directory
   - Create new file named `CartIconButton.tsx`
   - Set up TypeScript React functional component

2. **Import required dependencies**
   - Import shopping cart icon from icon library
   - Import cart state hooks from store
   - Import state management for dropdown toggle
   - Import Next.js types as needed

3. **Define component props interface**
   - Create `CartIconButtonProps` interface
   - Include onClick handler prop for dropdown toggle
   - Include optional className for custom styling

4. **Implement icon button structure**
   - Create button element with proper accessibility
   - Add shopping cart icon with appropriate size
   - Set up click handler for dropdown toggle
   - Make button position relative for badge overlay

5. **Connect to cart state**
   - Use cart store hooks to get item count
   - Subscribe to cart updates for real-time count
   - Calculate total items across all products

6. **Apply button styling**
   - Set icon size (24px or w-6 h-6)
   - Add hover effects (hover:text-primary)
   - Set cursor to pointer
   - Add transition for smooth color change

7. **Add accessibility features**
   - Set button type to "button"
   - Add aria-label: "Shopping cart"
   - Include aria-expanded state
   - Add keyboard navigation support (Enter, Space)

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onClick | () => void | Yes | - | Handler for dropdown toggle |
| isOpen | boolean | Yes | - | Dropdown open state |
| className | string | No | "" | Additional CSS classes |

### Button Structure

```
┌─────────────────┐
│   ┌─────────┐   │ ← Badge (Task 21)
│   │    3    │   │
│   └─────────┘   │
│                 │
│   🛒 Cart Icon  │ ← Button with icon
│                 │
└─────────────────┘
```

### Icon Sizing Guide

| Screen Size | Icon Size | Purpose |
|-------------|-----------|---------|
| Mobile | 20px (w-5 h-5) | Compact header |
| Tablet | 22px (w-5.5 h-5.5) | Balanced size |
| Desktop | 24px (w-6 h-6) | Standard size |

### Button States

| State | Styling | Behavior |
|-------|---------|----------|
| Default | `text-gray-700` | Normal appearance |
| Hover | `text-primary` | Color change |
| Active | `text-primary-dark` | Darker shade |
| Focus | `ring-2 ring-primary` | Focus ring |

### Accessibility Requirements

| Feature | Implementation |
|---------|----------------|
| Button Type | `type="button"` |
| Label | `aria-label="Shopping cart"` |
| Expanded | `aria-expanded={isOpen}` |
| Keyboard | Enter and Space key support |

### Expected Outcome
- Functional cart icon button in header
- Proper click handling for dropdown toggle
- Connected to cart state for item count
- Accessible with keyboard and screen readers

### Verification Checklist
- [ ] `frontend/components/storefront/cart/MiniCart/CartIconButton.tsx` created
- [ ] Shopping cart icon displays correctly
- [ ] Button triggers dropdown toggle on click
- [ ] Cart item count accessible from state
- [ ] Hover effects work properly
- [ ] Accessibility attributes included
- [ ] TypeScript types defined correctly
- [ ] Component exports properly

---

## Task 21: Create Cart Badge

### Overview
Create the CartBadge component that displays the number of items in the cart as an overlay badge on the cart icon button. This component provides immediate visual feedback about cart contents without requiring user interaction.

### Dependencies
- Task 20: Create Cart Icon Button
- Cart state with item count available

### Instructions

1. **Create CartBadge component file**
   - Create `CartBadge.tsx` in `components/storefront/cart/MiniCart/` directory
   - Set up React functional component structure

2. **Define component props**
   - Create `CartBadgeProps` interface
   - Include count prop (number)
   - Include optional size variant prop

3. **Implement badge visibility logic**
   - Only render badge if count > 0
   - Return null if cart is empty
   - Avoid showing "0" badge

4. **Format badge count display**
   - Show actual number for counts 1-99
   - Display "99+" for counts 100 and above
   - Center text within badge

5. **Create badge structure**
   - Use absolute positioning for overlay
   - Position top-right of parent button
   - Create circular or pill-shaped badge

6. **Apply badge styling**
   - Use primary or accent color background
   - Set white text color for contrast
   - Add small font size (text-xs or 10-11px)
   - Set minimum size for single digits
   - Add padding for multi-digit numbers

7. **Implement responsive sizing**
   - Smaller badge on mobile devices
   - Standard badge on desktop
   - Ensure readability at all sizes

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| count | number | Yes | - | Number of cart items |
| size | "sm" \| "md" | No | "md" | Badge size variant |
| className | string | No | "" | Additional classes |

### Badge Positioning

```
┌────────────────────┐
│  ┌─────┐          │
│  │  3  │ ← Badge  │
│  └─────┘          │
│     🛒 Cart       │
└────────────────────┘
```

### Badge Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Position | `absolute -top-1 -right-1` | Top-right overlay |
| Background | `bg-primary or bg-red-500` | High visibility |
| Text Color | `text-white` | Contrast |
| Font Size | `text-xs` (12px) | Readable size |
| Padding | `px-1.5 py-0.5` | Number spacing |
| Min Width | `min-w-[20px]` | Single digit size |
| Border Radius | `rounded-full` | Circular shape |
| Border | `border-2 border-white` | Separation from icon |

### Count Display Logic

| Count Range | Display | Example |
|-------------|---------|---------|
| 0 | (Hidden) | - |
| 1-9 | Single digit | "3" |
| 10-99 | Two digits | "42" |
| 100+ | "99+" | "99+" |

### Badge Variants

| Variant | Size | Use Case |
|---------|------|----------|
| Small | 16px min-w | Mobile, compact |
| Medium | 20px min-w | Desktop, standard |

### Color Options

| Option | Background | Use Case |
|--------|------------|----------|
| Primary | `bg-primary` | Brand consistency |
| Accent | `bg-accent` | High emphasis |
| Red | `bg-red-500` | Alert/attention |
| Success | `bg-green-500` | Confirmation |

### Animation Considerations

| Animation | Trigger | Effect |
|-----------|---------|--------|
| Scale Pulse | Item added | Badge grows/shrinks |
| Fade In | First item | Smooth appearance |
| Number Change | Count update | Smooth transition |

### Expected Outcome
- Visible badge overlay on cart icon
- Correct item count display
- Hidden when cart is empty
- Properly styled for visibility

### Verification Checklist
- [ ] `frontend/components/storefront/cart/MiniCart/CartBadge.tsx` created
- [ ] Badge displays item count correctly
- [ ] Badge hidden when count is 0
- [ ] "99+" displayed for counts over 99
- [ ] Positioned top-right of cart icon
- [ ] High contrast for readability
- [ ] Responsive sizing implemented
- [ ] Component exports properly

---

## Task 22: Create Mini Cart Dropdown

### Overview
Create the MiniCartDropdown component that serves as the container for the mini cart content. This component displays when users click the cart icon and contains the header, items list, subtotal, and action buttons. It manages the dropdown's visibility state and overall structure.

### Dependencies
- Task 20: Create Cart Icon Button
- Cart state store operational
- Click outside detection for closing

### Instructions

1. **Create MiniCartDropdown component file**
   - Create `MiniCartDropdown.tsx` in `components/storefront/cart/MiniCart/` directory
   - Set up TypeScript React functional component

2. **Define component props**
   - Create `MiniCartDropdownProps` interface
   - Include isOpen prop (boolean)
   - Include onClose handler prop
   - Include optional className prop

3. **Implement visibility control**
   - Only render when isOpen is true
   - Use conditional rendering or CSS display
   - Apply fade-in animation on open

4. **Set up click outside detection**
   - Use ref to track dropdown element
   - Add document click event listener
   - Close dropdown when clicking outside
   - Clean up event listener on unmount

5. **Create dropdown container structure**
   - Use div as main container
   - Set fixed or absolute positioning
   - Define dropdown dimensions
   - Add overflow handling

6. **Apply container styling**
   - Set white background color
   - Add shadow for elevation (shadow-xl)
   - Apply border radius (rounded-lg)
   - Set border with subtle gray

7. **Define dropdown dimensions**
   - Set width to 320-400px
   - Set max-height to 500px
   - Enable vertical scrolling for items
   - Maintain fixed header and footer

8. **Add accessibility features**
   - Set role="dialog" or role="menu"
   - Add aria-label="Shopping cart"
   - Trap focus within dropdown
   - Support Escape key to close

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| isOpen | boolean | Yes | - | Dropdown visibility state |
| onClose | () => void | Yes | - | Handler to close dropdown |
| className | string | No | "" | Additional CSS classes |

### Dropdown Structure

```
┌────────────────────────────┐
│ Mini Cart Header    (Task 24)│
├────────────────────────────┤
│                            │
│ Mini Cart Items List (T-25)│
│   - Item 1          (T-26) │
│   - Item 2                 │
│   - Item 3                 │
│   (Scrollable)             │
│                            │
├────────────────────────────┤
│ Subtotal Display    (T-30) │
├────────────────────────────┤
│ Footer with Buttons (T-31) │
└────────────────────────────┘
```

### Dropdown Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Width | `w-80 md:w-96` | 320-384px |
| Max Height | `max-h-[500px]` | Limit size |
| Background | `bg-white` | Clean surface |
| Shadow | `shadow-xl` | Elevation |
| Border | `border border-gray-200` | Definition |
| Radius | `rounded-lg` | Modern look |
| Z-index | `z-50` | Above content |

### Positioning Strategy

```
Header Cart Icon
      │
      ▼
┌───────────────┐
│ Mini Cart     │ ← Dropdown appears
│ Dropdown      │   below and right
│               │   aligned
└───────────────┘
```

### Layout Sections

| Section | Scroll | Height | Position |
|---------|--------|--------|----------|
| Header | Fixed | Auto | Top |
| Items List | Scrollable | Flex-grow | Middle |
| Subtotal | Fixed | Auto | Before footer |
| Footer | Fixed | Auto | Bottom |

### Click Outside Detection

| Event | Action | Implementation |
|-------|--------|----------------|
| Click inside | Do nothing | Check if target is within ref |
| Click outside | Close dropdown | Call onClose handler |
| Mount | Add listener | useEffect setup |
| Unmount | Remove listener | useEffect cleanup |

### Dropdown States

| State | CSS Classes | Behavior |
|-------|-------------|----------|
| Closed | `hidden` or `opacity-0` | Not visible |
| Opening | `opacity-0` → `opacity-100` | Fade in |
| Open | `opacity-100` | Fully visible |
| Closing | `opacity-100` → `opacity-0` | Fade out |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | `role="dialog"` |
| Label | `aria-label="Shopping cart"` |
| Focus Trap | Keep focus inside |
| Escape Key | Close on Escape |

### Expected Outcome
- Functional dropdown container
- Proper visibility control
- Click outside closes dropdown
- Smooth animations
- Accessible to keyboard users

### Verification Checklist
- [ ] `frontend/components/storefront/cart/MiniCart/MiniCartDropdown.tsx` created
- [ ] Dropdown opens when isOpen is true
- [ ] Dropdown closes when clicking outside
- [ ] Escape key closes dropdown
- [ ] Proper dimensions and max-height set
- [ ] Shadow and border styling applied
- [ ] Accessibility attributes included
- [ ] Component exports properly

---

## Task 23: Create Mini Cart Position

### Overview
Configure the positioning logic for the mini cart dropdown relative to the cart icon button. This ensures the dropdown appears in the correct location (below and right-aligned with the icon) and adjusts for screen edges to prevent cutoff.

### Dependencies
- Task 22: Create Mini Cart Dropdown
- Task 20: Create Cart Icon Button

### Instructions

1. **Determine positioning strategy**
   - Use absolute positioning for dropdown
   - Position relative to cart icon button
   - Right-align dropdown with icon
   - Add offset below icon

2. **Create positioning wrapper**
   - Wrap icon button and dropdown in container
   - Set container to position relative
   - Position dropdown absolute within container

3. **Define dropdown position classes**
   - Set `absolute` positioning
   - Use `top-full` to position below icon
   - Use `right-0` to align right edge
   - Add `mt-2` for spacing below icon

4. **Handle edge cases**
   - Check if dropdown extends beyond viewport
   - Adjust position if too close to right edge
   - Ensure visibility on mobile devices

5. **Add positioning offset**
   - Set vertical offset (8-12px below icon)
   - Ensure dropdown doesn't overlap icon
   - Maintain consistent spacing

6. **Implement z-index layering**
   - Set dropdown z-index to 50
   - Ensure dropdown appears above page content
   - Prevent other elements from overlapping

7. **Test responsive positioning**
   - Verify position on mobile (narrow screens)
   - Test on tablet (medium screens)
   - Confirm on desktop (wide screens)

### Positioning Structure

```
<div className="relative">  ← Positioning container
  <CartIconButton />        ← Icon button
  <MiniCartDropdown         ← Dropdown
    className="absolute top-full right-0 mt-2"
  />
</div>
```

### Position Classes

| Class | Purpose | Effect |
|-------|---------|--------|
| `relative` | Container | Reference point |
| `absolute` | Dropdown | Position from container |
| `top-full` | Vertical | Below icon (100%) |
| `right-0` | Horizontal | Right aligned |
| `mt-2` | Spacing | 8px offset |
| `z-50` | Layering | Above content |

### Alignment Diagram

```
         [Cart Icon] ← Cart button
              │
              ▼ (mt-2 spacing)
   ┌─────────────────┐
   │ Mini Cart       │ ← Right-aligned
   │ Dropdown        │
   │                 │
   └─────────────────┘
```

### Responsive Position Adjustments

| Screen Size | Adjustment | Reason |
|-------------|------------|--------|
| Mobile (< 640px) | Full width option | Limited space |
| Tablet (640-1024px) | Standard right align | Sufficient space |
| Desktop (> 1024px) | Standard right align | Ample space |

### Edge Detection Logic

| Scenario | Detection | Solution |
|----------|-----------|----------|
| Right edge cutoff | Dropdown width + icon position > viewport width | Shift left or right align |
| Bottom cutoff | Dropdown height + icon position > viewport height | Position above icon |
| Mobile full width | Viewport < 640px | Expand to full width |

### Z-Index Hierarchy

| Element | Z-Index | Rationale |
|---------|---------|-----------|
| Page content | 1-10 | Base layer |
| Header | 40 | Above content |
| Dropdown | 50 | Above header |
| Modal | 100 | Highest priority |

### Expected Outcome
- Dropdown positioned correctly below cart icon
- Right-aligned with icon button
- Proper spacing and no overlap
- Adapts to screen edges

### Verification Checklist
- [ ] Dropdown appears directly below cart icon
- [ ] Right edge of dropdown aligns with icon
- [ ] 8-12px spacing between icon and dropdown
- [ ] Dropdown doesn't extend beyond viewport
- [ ] Position works on mobile, tablet, desktop
- [ ] Z-index ensures visibility above content
- [ ] No overlap with icon button

---

## Task 24: Create Mini Cart Header

### Overview
Create the MiniCartHeader component that displays at the top of the mini cart dropdown. This component shows the cart title and the current number of items in the cart, providing users with immediate context about their cart contents.

### Dependencies
- Task 22: Create Mini Cart Dropdown
- Cart state with item count

### Instructions

1. **Create MiniCartHeader component file**
   - Create `MiniCartHeader.tsx` in `components/storefront/cart/MiniCart/` directory
   - Set up React functional component

2. **Define component props**
   - Create `MiniCartHeaderProps` interface
   - Include itemCount prop (number)
   - Include optional className prop

3. **Implement header structure**
   - Create container div for header content
   - Add title text element
   - Add item count element
   - Use flexbox for layout

4. **Format title text**
   - Display "Your Cart" or "Shopping Cart"
   - Use heading level (h3 or h4)
   - Apply bold font weight

5. **Format item count display**
   - Show count in parentheses: "(3 items)"
   - Use singular "item" for count of 1
   - Use plural "items" for all other counts
   - Apply lighter font weight

6. **Apply header styling**
   - Set padding for spacing (px-4 py-3)
   - Add bottom border for separation
   - Use semibold font for title
   - Set text size (text-base or text-lg)

7. **Add responsive adjustments**
   - Adjust padding on mobile vs desktop
   - Ensure text doesn't wrap awkwardly
   - Maintain consistent spacing

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| itemCount | number | Yes | - | Number of items in cart |
| className | string | No | "" | Additional CSS classes |

### Header Structure

```
┌────────────────────────────┐
│ Your Cart (3 items)        │ ← Header
├────────────────────────────┤
│                            │
│ (Items list below)         │
```

### Header Layout

| Element | Content | Styling |
|---------|---------|---------|
| Title | "Your Cart" | Bold, text-base |
| Count | "(3 items)" | Normal, text-gray-600 |
| Container | Both elements | Flex row, space-between |

### Item Count Format

| Count | Display | Example |
|-------|---------|---------|
| 0 | "Your Cart (empty)" | Empty state |
| 1 | "Your Cart (1 item)" | Singular |
| 2+ | "Your Cart (X items)" | Plural |

### Header Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Padding | `px-4 py-3` | Spacing |
| Border | `border-b border-gray-200` | Separation |
| Font Weight | `font-semibold` | Emphasis |
| Text Size | `text-base` | Readable |
| Text Color | `text-gray-900` | High contrast |
| Count Color | `text-gray-600` | Subdued |

### Layout Options

**Option A: Side by Side**
```
Your Cart                    (3 items)
```

**Option B: Stacked**
```
Your Cart
3 items
```

**Option C: Inline**
```
Your Cart (3 items)
```

### Responsive Behavior

| Screen Size | Layout | Font Size |
|-------------|--------|-----------|
| Mobile | Option C (inline) | text-sm |
| Tablet | Option A (side by side) | text-base |
| Desktop | Option A (side by side) | text-base |

### Expected Outcome
- Clear header at top of dropdown
- Title and item count displayed
- Proper grammar for singular/plural
- Visual separation from items list

### Verification Checklist
- [ ] `frontend/components/storefront/cart/MiniCart/MiniCartHeader.tsx` created
- [ ] "Your Cart" title displayed
- [ ] Item count shown correctly
- [ ] Singular/plural grammar handled
- [ ] Bottom border separates from items
- [ ] Padding and spacing applied
- [ ] Component exports properly

---

## Task 25: Create Mini Cart Items List

### Overview
Create the MiniCartItemsList component that displays a scrollable list of all items in the cart. This component serves as a container for individual mini cart items and handles overflow scrolling when there are many items.

### Dependencies
- Task 22: Create Mini Cart Dropdown
- Task 24: Create Mini Cart Header
- Cart state with items array

### Instructions

1. **Create MiniCartItemsList component file**
   - Create `MiniCartItemsList.tsx` in `components/storefront/cart/MiniCart/` directory
   - Set up React functional component

2. **Define component props**
   - Create `MiniCartItemsListProps` interface
   - Include items prop (array of cart items)
   - Include optional className prop

3. **Connect to cart state**
   - Use cart store hooks to access items
   - Subscribe to cart updates
   - Handle empty cart state

4. **Implement list container**
   - Create div as scrollable container
   - Map over items array
   - Render MiniCartItem for each item
   - Add key prop for each item

5. **Configure scrolling behavior**
   - Set max-height to limit list size
   - Enable vertical scrolling (overflow-y-auto)
   - Hide horizontal scrollbar (overflow-x-hidden)
   - Apply smooth scrolling behavior

6. **Apply list styling**
   - Set padding for item spacing
   - Add subtle background if needed
   - Ensure scrollbar styling
   - Add dividers between items (optional)

7. **Handle empty state**
   - Show empty message if no items
   - Display empty cart component
   - Provide "Continue Shopping" link

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| items | CartItem[] | Yes | - | Array of cart items |
| className | string | No | "" | Additional CSS classes |

### List Structure

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ Item 1                 │ │ ← MiniCartItem
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ Item 2                 │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ Item 3                 │ │
│ └────────────────────────┘ │
│ │                        │ │ ← Scrollable area
│ ▼                        ▼ │
└────────────────────────────┘
```

### Scrolling Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Max Height | `max-h-80` (320px) | Limit size |
| Overflow Y | `overflow-y-auto` | Vertical scroll |
| Overflow X | `overflow-x-hidden` | No horizontal scroll |
| Scroll Behavior | `scroll-smooth` | Smooth scrolling |

### List Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Padding | `py-2` | Vertical spacing |
| Background | `bg-white` | Clean surface |
| Scrollbar | Custom thin style | Subtle appearance |
| Dividers | `divide-y divide-gray-100` | Item separation |

### Item Display Strategy

| Scenario | Display Strategy |
|----------|------------------|
| 1-3 items | Show all, no scroll |
| 4+ items | Show 3-4, enable scroll |
| Many items | Scrollable with visible scrollbar |

### Empty State Handling

| Condition | Display | Component |
|-----------|---------|-----------|
| items.length === 0 | Empty message | EmptyMiniCart (Task 34) |
| items.length > 0 | Items list | Map MiniCartItem |

### Scroll Behavior

```
Visible Items (3-4)
┌────────────────┐
│ Item 1   ✓    │ ← Visible
│ Item 2   ✓    │ ← Visible
│ Item 3   ✓    │ ← Visible
├────────────────┤ ← Scroll starts here
│ Item 4   ▼    │ ← Scrollable
│ Item 5   ▼    │ ← Scrollable
└────────────────┘
```

### List Rendering Logic

```
{items.length === 0 ? (
  <EmptyMiniCart />
) : (
  items.map(item => (
    <MiniCartItem key={item.id} item={item} />
  ))
)}
```

### Performance Considerations

| Concern | Solution |
|---------|----------|
| Large lists | Virtual scrolling (optional) |
| Re-renders | React.memo for items |
| Animations | CSS transitions only |
| Updates | Optimistic UI updates |

### Expected Outcome
- Scrollable container for cart items
- Each item rendered with MiniCartItem component
- Smooth scrolling when items exceed max height
- Empty state handled gracefully

### Verification Checklist
- [ ] `frontend/components/storefront/cart/MiniCart/MiniCartItemsList.tsx` created
- [ ] Items list renders all cart items
- [ ] Scrolling enabled when items exceed max height
- [ ] Empty state displays when no items
- [ ] Each item has unique key prop
- [ ] Padding and spacing applied
- [ ] Component exports properly

---

## Task 26: Create Mini Cart Item

### Overview
Create the MiniCartItem component that displays an individual product in the mini cart dropdown. This component shows the product image, name, variant details, quantity, price, and remove button in a compact, organized layout.

### Dependencies
- Task 25: Create Mini Cart Items List
- Cart item type definition
- Cart state with update functions

### Instructions

1. **Create MiniCartItem component file**
   - Create `MiniCartItem.tsx` in `components/storefront/cart/MiniCart/` directory
   - Set up React functional component

2. **Define component props**
   - Create `MiniCartItemProps` interface
   - Include item prop (CartItem type)
   - Include onRemove handler prop
   - Include optional className prop

3. **Implement item structure**
   - Create container div with flex layout
   - Add left section for image
   - Add center section for info
   - Add right section for remove button

4. **Use sub-components**
   - Import MiniCartItemImage (Task 27)
   - Import MiniCartItemInfo (Task 28)
   - Import MiniCartItemRemove (Task 29)
   - Compose them in layout

5. **Set up item layout**
   - Use flexbox for horizontal arrangement
   - Image on left (fixed width)
   - Info in center (flex-grow)
   - Remove button on right
   - Add gap between sections

6. **Apply item styling**
   - Set padding for spacing (p-3)
   - Add hover effect (hover:bg-gray-50)
   - Set border or divider between items
   - Add transition for smooth hover

7. **Handle item interactions**
   - Connect remove button to cart store
   - Update quantity if inline controls added
   - Show loading state during updates

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| item | CartItem | Yes | - | Cart item data |
| onRemove | (id: string) => void | Yes | - | Remove handler |
| className | string | No | "" | Additional classes |

### Item Structure

```
┌─────────────────────────────────────┐
│ ┌────┐                              │
│ │    │ Product Name                 │
│ │IMG │ Variant: Size M              │
│ │    │ ₨1,500 × 2                 [X]│
│ └────┘                              │
└─────────────────────────────────────┘
  ← 60px →← Info (flex-grow) →← Remove
```

### Layout Sections

| Section | Width | Content | Alignment |
|---------|-------|---------|-----------|
| Image | 60px | Product thumbnail | Center |
| Info | Flex-grow | Name, variant, price | Left |
| Remove | 24px | X button | Top-right |

### Item Layout Breakdown

| Element | Component | Location | Task |
|---------|-----------|----------|------|
| Thumbnail | MiniCartItemImage | Left | Task 27 |
| Details | MiniCartItemInfo | Center | Task 28 |
| Remove | MiniCartItemRemove | Right | Task 29 |

### Item Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Display | `flex items-start` | Horizontal layout |
| Gap | `gap-3` | Spacing between sections |
| Padding | `p-3` | Internal spacing |
| Hover | `hover:bg-gray-50` | Interactive feedback |
| Transition | `transition-colors` | Smooth hover |
| Border | `border-b border-gray-100` | Item separation |

### CartItem Type Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique item ID |
| productId | string | Product reference |
| name | string | Product name |
| variant | object | Size, color, etc. |
| price | number | Unit price |
| quantity | number | Item quantity |
| image | string | Image URL |
| slug | string | Product URL slug |

### Item States

| State | Styling | Behavior |
|-------|---------|----------|
| Default | Normal appearance | Idle |
| Hover | `bg-gray-50` | Show interactivity |
| Removing | Opacity fade | Removing from cart |
| Error | Red border | Update failed |

### Interaction Flows

```
User Actions:
├── Click Remove → onRemove(item.id)
├── Click Image → Navigate to product
├── Click Name → Navigate to product
└── Click Info → Navigate to product
```

### Expected Outcome
- Compact, organized cart item display
- Image, info, and remove button visible
- Proper spacing and alignment
- Interactive hover effects

### Verification Checklist
- [ ] `frontend/components/storefront/cart/MiniCart/MiniCartItem.tsx` created
- [ ] Item displays image, name, variant, price
- [ ] Flexbox layout with three sections
- [ ] Remove button positioned correctly
- [ ] Hover effect applied
- [ ] Item border or divider present
- [ ] Component accepts item and onRemove props
- [ ] Component exports properly

---

## Task 27: Create Mini Cart Item Image

### Overview
Create the MiniCartItemImage component that displays the product thumbnail image for each cart item. This component handles image loading, fallbacks, and links to the product page.

### Dependencies
- Task 26: Create Mini Cart Item
- Next.js Image component
- Product image URLs

### Instructions

1. **Create MiniCartItemImage component file**
   - Create `MiniCartItemImage.tsx` in `components/storefront/cart/MiniCart/` directory
   - Set up React functional component

2. **Define component props**
   - Create `MiniCartItemImageProps` interface
   - Include src prop (image URL)
   - Include alt prop (product name)
   - Include productSlug prop for linking
   - Include optional size prop

3. **Import Next.js Image**
   - Import Image from "next/image"
   - Import Link from "next/link"
   - Prepare for optimized image loading

4. **Implement image container**
   - Create wrapper div with fixed dimensions
   - Set width and height (60x60px)
   - Add border radius for rounded corners
   - Set background color for loading state

5. **Add product link wrapper**
   - Wrap image in Next.js Link component
   - Link to product page using slug
   - Make entire image clickable

6. **Configure Next.js Image**
   - Set src prop to image URL
   - Set alt prop for accessibility
   - Set width and height (60x60)
   - Set object-fit to "cover"
   - Enable loading optimization

7. **Implement fallback image**
   - Handle missing or broken images
   - Use placeholder image or icon
   - Show product name initial if no image

8. **Apply image styling**
   - Add border with subtle color
   - Set border radius for rounded look
   - Add hover effect on link
   - Ensure aspect ratio maintained

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| src | string | Yes | - | Image URL |
| alt | string | Yes | - | Alt text (product name) |
| productSlug | string | Yes | - | Product page URL |
| size | number | No | 60 | Image dimensions (px) |
| className | string | No | "" | Additional classes |

### Image Structure

```
┌──────────────┐
│ ┌──────────┐ │ ← Border/container
│ │          │ │
│ │  Image   │ │ ← 60x60px product image
│ │          │ │
│ └──────────┘ │
└──────────────┘
```

### Image Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Width | `w-15` (60px) | Fixed width |
| Height | `h-15` (60px) | Fixed height |
| Border | `border border-gray-200` | Definition |
| Radius | `rounded-md` | Rounded corners |
| Object Fit | `object-cover` | Fill container |
| Background | `bg-gray-100` | Loading state |

### Image Sizing Options

| Size | Dimensions | Use Case |
|------|------------|----------|
| Small | 48x48px | Mobile compact |
| Medium | 60x60px | Standard mini cart |
| Large | 80x80px | Emphasized display |

### Link Behavior

| Interaction | Behavior | Implementation |
|-------------|----------|----------------|
| Click | Navigate to product | Link to `/product/${slug}` |
| Hover | Opacity change | `hover:opacity-80` |
| Focus | Focus ring | `focus:ring-2` |

### Image Loading States

| State | Display | Implementation |
|-------|---------|----------------|
| Loading | Gray background | Placeholder div |
| Loaded | Product image | Next.js Image |
| Error | Fallback icon | onError handler |

### Fallback Strategies

| Strategy | Implementation | Use Case |
|----------|----------------|----------|
| Placeholder Image | Static image URL | Generic product icon |
| Product Initial | First letter of name | Text-based fallback |
| Gray Box | Empty container | Loading state |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Alt Text | Product name |
| Link Label | `aria-label="View ${productName}"` |
| Focus Indicator | Visible focus ring |

### Expected Outcome
- Clickable product thumbnail image
- Proper sizing (60x60px)
- Links to product page
- Handles missing images gracefully

### Verification Checklist
- [ ] `frontend/components/storefront/cart/MiniCart/MiniCartItemImage.tsx` created
- [ ] Next.js Image component used
- [ ] Image displays at 60x60px
- [ ] Image wrapped in Link to product page
- [ ] Alt text provided for accessibility
- [ ] Border and rounded corners applied
- [ ] Fallback for missing images
- [ ] Hover effect on link
- [ ] Component exports properly

---

## Task 28: Create Mini Cart Item Info

### Overview
Create the MiniCartItemInfo component that displays the product details for each cart item, including product name, variant information (size, color), quantity, and price calculation. This component occupies the center section of the cart item layout.

### Dependencies
- Task 26: Create Mini Cart Item
- Cart item data structure
- Price formatting utilities

### Instructions

1. **Create MiniCartItemInfo component file**
   - Create `MiniCartItemInfo.tsx` in `components/storefront/cart/MiniCart/` directory
   - Set up React functional component

2. **Define component props**
   - Create `MiniCartItemInfoProps` interface
   - Include item prop (CartItem type)
   - Include optional className prop

3. **Implement info structure**
   - Create container div with vertical stacking
   - Add product name line
   - Add variant info line
   - Add price and quantity line

4. **Display product name**
   - Show full product name
   - Make it clickable link to product
   - Use font-medium weight
   - Truncate if too long (line-clamp-1)

5. **Display variant information**
   - Show selected variant attributes
   - Format as "Size: M, Color: Blue"
   - Use smaller text size
   - Use gray color for subdued appearance

6. **Display price and quantity**
   - Format: "₨1,500 × 2"
   - Calculate and show item total if needed
   - Use medium font weight
   - Align with price formatting standards

7. **Apply info styling**
   - Set flex-grow to use available space
   - Add line spacing for readability
   - Use text ellipsis for overflow
   - Ensure responsive text sizing

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| item | CartItem | Yes | - | Cart item data |
| showTotal | boolean | No | false | Show item total |
| className | string | No | "" | Additional classes |

### Info Structure

```
┌────────────────────────┐
│ Product Name           │ ← Line 1: Name (link)
│ Size: M, Color: Blue   │ ← Line 2: Variant
│ ₨1,500 × 2           │ ← Line 3: Price × Qty
└────────────────────────┘
```

### Info Lines Breakdown

| Line | Content | Styling | Clickable |
|------|---------|---------|-----------|
| 1 | Product name | `font-medium text-gray-900` | Yes (link) |
| 2 | Variant info | `text-sm text-gray-600` | No |
| 3 | Price × Qty | `text-sm text-gray-900` | No |

### Product Name Formatting

| Aspect | Implementation |
|--------|----------------|
| Font Weight | `font-medium` |
| Text Color | `text-gray-900` |
| Text Size | `text-sm` |
| Overflow | `truncate` or `line-clamp-1` |
| Link | Next.js Link to product |
| Hover | `hover:text-primary` |

### Variant Display Format

| Variant Type | Display Format | Example |
|--------------|----------------|---------|
| Size only | "Size: M" | Size: M |
| Color only | "Color: Blue" | Color: Blue |
| Both | "Size: M, Color: Blue" | Size: M, Color: Blue |
| Multiple | "Attr1: Val1, Attr2: Val2" | Material: Cotton, Fit: Slim |

### Price and Quantity Display

| Display Format | Example | Use Case |
|----------------|---------|----------|
| Price × Qty | ₨1,500 × 2 | Standard mini cart |
| Price only | ₨1,500 each | Simplified view |
| Price × Qty = Total | ₨1,500 × 2 = ₨3,000 | Detailed view |

### Info Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Display | `flex flex-col` | Vertical stack |
| Gap | `gap-0.5` | Line spacing |
| Flex Grow | `flex-grow` | Use available space |
| Text Size | `text-sm` | Compact info |
| Line Height | `leading-tight` | Tight spacing |

### Variant Formatting Function

```typescript
function formatVariant(variant: object): string
  - Input: { size: "M", color: "Blue" }
  - Output: "Size: M, Color: Blue"
  - Handle missing/undefined attributes
  - Capitalize attribute names
```

### Price Formatting

| Currency | Symbol | Format | Example |
|----------|--------|--------|---------|
| LKR | ₨ | ₨X,XXX | ₨1,500 |
| Separator | Comma | Thousands | ₨10,000 |

### Expected Outcome
- Three-line product info display
- Product name with link to product page
- Variant details clearly shown
- Price and quantity formatted correctly

### Verification Checklist
- [ ] `frontend/components/storefront/cart/MiniCart/MiniCartItemInfo.tsx` created
- [ ] Product name displays and links to product
- [ ] Variant info shows size, color, etc.
- [ ] Price and quantity formatted as "₨X × Y"
- [ ] Text truncation applied to prevent overflow
- [ ] Proper text sizing and colors
- [ ] Line spacing and layout correct
- [ ] Component exports properly

---

## Summary

This document established the core structure of the mini cart component system, including the cart icon button with badge, dropdown container with positioning, header, scrollable items list, and individual item display components. These elements provide the foundation for a functional mini cart dropdown.

### Completed Tasks
1. ✓ Created mini cart directory structure
2. ✓ Created cart icon button with toggle functionality
3. ✓ Created cart badge showing item count
4. ✓ Created mini cart dropdown container
5. ✓ Configured dropdown positioning logic
6. ✓ Created mini cart header with item count
7. ✓ Created scrollable items list container
8. ✓ Created mini cart item layout component
9. ✓ Created mini cart item image with linking
10. ✓ Created mini cart item info display

### Next Steps
Proceed to [02_Tasks-29-36_Actions-Footer-Verify.md](02_Tasks-29-36_Actions-Footer-Verify.md) to create the remove button, subtotal display, footer with action buttons, empty cart state, animations, and complete UX verification.
