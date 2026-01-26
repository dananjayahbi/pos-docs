# Tasks 35-44: Cart UI & Items

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** C - Cart Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Product-Search-Quick-Buttons/](../Group-B_Product-Search-Quick-Buttons/)
- **→ Next Document:** [02_Tasks-45-52_State-Persistence.md](02_Tasks-45-52_State-Persistence.md)

---

## Document Overview

This document covers the cart user interface components including the container, items list, item rows with quantity controls, and item options functionality.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 35 | Create Cart Container | Low |
| 36 | Create Cart Items List | Low |
| 37 | Create Cart Item Row | Medium |
| 38 | Create Item Name Display | Low |
| 39 | Create Item Quantity Controls | Medium |
| 40 | Create Quantity Input Field | Low |
| 41 | Create Item Price Display | Low |
| 42 | Create Remove Item Button | Low |
| 43 | Create Item Options Button | Low |
| 44 | Create Item Discount Input | Medium |

---

## Task 35: Create Cart Container

### Overview
Create the main cart container component that organizes the cart interface with header, scrollable items list, and fixed totals section at the bottom.

### Dependencies
- Group A, Task 11: Create Cart Panel

### Instructions

1. **Create cart container component**
   - Create `Cart/` directory in `components/modules/pos/`
   - Create `CartContainer.tsx` in Cart directory
   - Main wrapper for all cart components

2. **Define container structure**
   - Vertical flexbox layout
   - Cart header at top (fixed)
   - Items list in middle (scrollable)
   - Totals section at bottom (fixed)

3. **Add cart header**
   - Title: "Cart" or "Current Sale"
   - Item count badge (e.g., "3 items")
   - Clear cart button (icon or text)
   - Fixed position at top

4. **Configure layout sections**
   - Header: Fixed height (50-60px)
   - Items: Flex-grow to fill space
   - Totals: Fixed height (auto-sized)
   - No gaps or overlaps

5. **Style container**
   - Full height of cart panel
   - Background color
   - Border or shadow separation
   - Padding for sections

6. **Add responsive behavior**
   - Adapt to panel width changes
   - Maintain layout on resize
   - Stack appropriately on mobile
   - Touch-friendly spacing

### Cart Container Structure
```
┌─────────────────────────────┐
│ Cart (3 items)        [×]   │ ← Header (Fixed)
├─────────────────────────────┤
│ Item 1       [2] LKR 200    │
│ Item 2       [1] LKR 100    │ ← Items List
│ Item 3       [1] LKR 150    │   (Scrollable)
│                             │
│                             │
├─────────────────────────────┤
│ Subtotal:      LKR 450.00   │
│ Tax (15%):     LKR  67.50   │ ← Totals (Fixed)
│ Total:         LKR 517.50   │
│ [ Pay ]                     │
└─────────────────────────────┘
```

### Container Layout Sections

| Section | Height | Scroll | Purpose |
|---------|--------|--------|---------|
| Header | Fixed (50-60px) | No | Title, count, clear |
| Items List | Flex-grow | Yes | Cart item rows |
| Totals | Auto-sized | No | Calculations, actions |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/CartContainer.tsx

// 'use client' directive
// Imports
// CartContainer component
//   - Container wrapper
//   - Cart header
//   - CartItemsList component
//   - Totals section placeholder
```

### Verification Checklist
- [ ] `Cart/` directory created
- [ ] `CartContainer.tsx` exists
- [ ] Three-section layout defined
- [ ] Header fixed at top
- [ ] Items area scrollable
- [ ] Totals fixed at bottom
- [ ] Styling applied
- [ ] Responsive behavior works

---

## Task 36: Create Cart Items List

### Overview
Create the scrollable cart items list component that displays all items in the cart or an empty state when no items are present.

### Dependencies
- Task 35: Create Cart Container

### Instructions

1. **Create items list component**
   - Create `CartItemsList.tsx` in Cart directory
   - Scrollable container for cart items
   - Maps over cart items array

2. **Define list structure**
   - Vertical list layout
   - Each item as separate row
   - Dividers between items (optional)
   - Scrollable overflow

3. **Implement item mapping**
   - Map over cart items from state
   - Render CartItem for each
   - Pass item data and handlers
   - Key by item ID

4. **Add scroll behavior**
   - Overflow-y: auto
   - Smooth scrolling
   - Hide or minimal scrollbar
   - Scroll shadows (optional)

5. **Handle empty state**
   - Show when items array empty
   - Empty cart component (Task 45)
   - Centered in list area
   - Message and icon

6. **Add list styling**
   - No list bullets
   - Padding: 0
   - Gap between items
   - Background transparent

7. **Optimize rendering**
   - Virtual scrolling for many items (optional)
   - React.memo for item rows
   - Efficient key usage
   - Avoid unnecessary re-renders

### Cart Items List Layout
```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │ Cart Item 1             │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Cart Item 2             │ │ ← Scrollable
│ └─────────────────────────┘ │   Area
│ ┌─────────────────────────┐ │
│ │ Cart Item 3             │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

### List States

| State | Display |
|-------|---------|
| Empty | Empty cart component |
| Loading | Skeleton items (optional) |
| With Items | Item rows list |
| Many Items | Scrollable with shadow |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/CartItemsList.tsx

// Imports
// CartItemsList props
// CartItemsList component
//   - List container
//   - Empty state conditional
//   - Items mapping
//   - CartItem components
```

### Verification Checklist
- [ ] `CartItemsList.tsx` created
- [ ] List container rendered
- [ ] Items mapped correctly
- [ ] Scroll behavior works
- [ ] Empty state conditional
- [ ] Dividers between items (optional)
- [ ] Keys assigned properly
- [ ] Performance optimized

---

## Task 37: Create Cart Item Row

### Overview
Create the cart item row component that displays a single cart item with all its information and interactive controls in a horizontal layout.

### Dependencies
- Task 36: Create Cart Items List

### Instructions

1. **Create cart item component**
   - Create `CartItem.tsx` in Cart directory
   - Single cart item display
   - Accept item data prop

2. **Define row layout**
   - Horizontal flexbox layout
   - Item info on left
   - Quantity controls in center
   - Price and remove on right
   - Responsive wrapping if needed

3. **Add row sections**
   - Left: Item name and variant (Task 38)
   - Center: Quantity controls (Task 39-40)
   - Right: Line price (Task 41)
   - Far right: Remove button (Task 42)

4. **Style row container**
   - Padding: 12-16px
   - Border or background
   - Hover state (subtle)
   - Gap between sections

5. **Add interaction states**
   - Normal: Default appearance
   - Hover: Slight highlight
   - Selected: For keyboard navigation
   - Disabled: If operation pending

6. **Handle item updates**
   - Accept onChange handlers
   - Update quantity
   - Remove item
   - Open options menu

7. **Add accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation
   - Focus indicators

### Cart Item Row Layout
```
┌───────────────────────────────────────────────┐
│ Product Name (Variant)  [─][2][+]  LKR 200 [×]│
│ ↑                       ↑          ↑        ↑ │
│ Name                    Qty        Price    Remove
└───────────────────────────────────────────────┘
```

### Row Sections Distribution

| Section | Width | Content |
|---------|-------|---------|
| Name | 40% | Product name + variant |
| Quantity | 30% | +/- buttons and input |
| Price | 20% | Line total |
| Remove | 10% | X button |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/CartItem.tsx

// Imports
// CartItem props
// CartItem component
//   - Row container
//   - ItemName component
//   - QuantityControls component
//   - ItemPrice component
//   - RemoveButton component
//   - Options button
```

### Verification Checklist
- [ ] `CartItem.tsx` created
- [ ] Horizontal layout defined
- [ ] All sections positioned
- [ ] Child components rendered
- [ ] Hover state works
- [ ] Props passed correctly
- [ ] Accessibility attributes present
- [ ] Responsive behavior appropriate

---

## Task 38: Create Item Name Display

### Overview
Create the item name display component that shows the product name and optional variant information within the cart item row.

### Dependencies
- Task 37: Create Cart Item Row

### Instructions

1. **Create item name component**
   - Create `ItemName.tsx` in Cart directory
   - Display product and variant names
   - Accept item data prop

2. **Display product name**
   - Primary text line
   - Bold or semi-bold font
   - Truncate if too long (ellipsis)
   - Full name on hover (tooltip)

3. **Display variant information**
   - Secondary text line (if variant exists)
   - Smaller, lighter font
   - Format: "Size: Large, Color: Red"
   - Below product name

4. **Handle long names**
   - Max 2 lines total
   - Ellipsis on overflow
   - Tooltip shows full text
   - Responsive to container width

5. **Add product image**
   - Small thumbnail (30x30px)
   - Left of name (optional)
   - Rounded corners
   - Placeholder if no image

6. **Style appropriately**
   - Clear typography
   - Adequate line height
   - Left-aligned
   - Color for readability

### Item Name Display Layout
```
Without Image:
Product Name Here
Size: Large | Color: Blue

With Image:
┌────┐ Product Name Here
│img │ Size: Large | Color: Blue
└────┘
```

### Display Format Examples

| Item Type | Display |
|-----------|---------|
| Simple Product | Product Name |
| With Variant | Product Name<br>Size: L, Color: Red |
| Long Name | Very Long Product Name...<br>Variant Info |
| With Image | [img] Product Name<br>      Variant Info |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/ItemName.tsx

// Imports
// ItemName props
// ItemName component
//   - Container div
//   - Optional image
//   - Product name text
//   - Variant info text
//   - Tooltip for full name
```

### Verification Checklist
- [ ] `ItemName.tsx` created
- [ ] Product name displays
- [ ] Variant info shows (if present)
- [ ] Long names truncated
- [ ] Tooltip available
- [ ] Image renders (if included)
- [ ] Typography clear
- [ ] Styling appropriate

---

## Task 39: Create Item Quantity Controls

### Overview
Create the quantity controls component with plus/minus buttons and direct input field for adjusting cart item quantities.

### Dependencies
- Task 37: Create Cart Item Row

### Instructions

1. **Create quantity controls component**
   - Create `QuantityControls.tsx` in Cart directory
   - Wrapper for +/- buttons and input
   - Accept quantity and onChange props

2. **Define controls layout**
   - Horizontal layout
   - Minus button on left
   - Quantity input in center
   - Plus button on right
   - Consistent spacing

3. **Create minus button**
   - Icon: minus or dash (−)
   - Decreases quantity by 1
   - Disabled at quantity 1
   - Remove item at 0 (prompt)

4. **Create plus button**
   - Icon: plus (+)
   - Increases quantity by 1
   - Max: stock quantity
   - Disabled if out of stock

5. **Add quantity input**
   - Direct number entry
   - Center-aligned text
   - Width: 40-50px
   - Validation on blur

6. **Implement quantity validation**
   - Min: 1 (or prompt remove)
   - Max: stock_quantity
   - Integers only
   - Reset invalid input

7. **Handle quantity updates**
   - Call onChange handler
   - Pass new quantity
   - Debounce for input typing
   - Update cart state

8. **Style controls**
   - Button size: 32-36px square
   - Touch-friendly
   - Clear borders
   - Consistent with theme

### Quantity Controls Layout
```
┌────┬──────┬────┐
│ −  │  2   │ +  │
└────┴──────┴────┘
  ↑     ↑      ↑
 Minus Input  Plus
```

### Button States

| State | Minus Button | Plus Button |
|-------|--------------|-------------|
| Quantity = 1 | Disabled/Warn | Enabled |
| Quantity < Max | Enabled | Enabled |
| Quantity = Max | Enabled | Disabled |
| Out of Stock | Enabled | Disabled |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/QuantityControls.tsx

// Imports
// QuantityControls props
// QuantityControls component
//   - Controls container
//   - Minus button
//   - QuantityInput component
//   - Plus button
//   - Handlers for increment/decrement
```

### Verification Checklist
- [ ] `QuantityControls.tsx` created
- [ ] Three-button layout defined
- [ ] Minus button works
- [ ] Plus button works
- [ ] Input field functional
- [ ] Validation implemented
- [ ] Disabled states correct
- [ ] onChange handler called
- [ ] Touch-friendly sizing

---

## Task 40: Create Quantity Input Field

### Overview
Create the direct quantity input field component that allows typing quantity values with validation and formatting.

### Dependencies
- Task 39: Create Item Quantity Controls

### Instructions

1. **Create quantity input component**
   - Create `QuantityInput.tsx` in Cart directory
   - Controlled input component
   - Accept value and onChange props

2. **Configure input field**
   - Type: number or text (with validation)
   - Pattern: integers only
   - Min: 1
   - Max: stock quantity

3. **Implement input handling**
   - onChange: Update local state
   - onBlur: Validate and commit
   - onKeyPress: Enter to commit
   - Filter non-numeric input

4. **Add validation logic**
   - Check min/max bounds
   - Parse to integer
   - Reject decimals
   - Reject negative numbers

5. **Handle invalid input**
   - Show error border
   - Reset to previous valid value
   - Display validation message (tooltip)
   - Prevent form submission

6. **Style input field**
   - Width: 40-50px
   - Center-aligned text
   - No spinner arrows (hide)
   - Clear border

7. **Add focus behavior**
   - Select all on focus
   - Highlight on keyboard focus
   - Clear placeholder (if used)
   - Show validation on blur

### Input Field States
```
Normal:     [  2  ]
Focus:      [  2  ]  (highlighted)
Invalid:    [  X  ]  (red border)
Disabled:   [  2  ]  (grayed)
```

### Validation Rules

| Rule | Behavior |
|------|----------|
| Empty | Reset to 1 |
| < 1 | Reset to 1 or prompt remove |
| > Max | Set to max (stock) |
| Decimal | Round or reject |
| Non-numeric | Reject |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/QuantityInput.tsx

// Imports
// QuantityInput props
// QuantityInput component
//   - Input element
//   - Validation logic
//   - Change handler
//   - Blur handler
//   - Styling
```

### Verification Checklist
- [ ] `QuantityInput.tsx` created
- [ ] Input field renders
- [ ] Number type or validated
- [ ] Min/max enforced
- [ ] onChange works
- [ ] onBlur validates
- [ ] Invalid input handled
- [ ] Select all on focus
- [ ] Styling appropriate

---

## Task 41: Create Item Price Display

### Overview
Create the item price display component that shows the line total (unit price × quantity) with proper currency formatting.

### Dependencies
- Task 37: Create Cart Item Row

### Instructions

1. **Create item price component**
   - Create `ItemPrice.tsx` in Cart directory
   - Display calculated line total
   - Accept price and quantity props

2. **Calculate line total**
   - Line total = unit_price × quantity
   - Account for item discount if present
   - Round to 2 decimal places
   - Format as currency

3. **Display unit price**
   - Show unit price (optional)
   - Smaller, lighter text
   - Above or beside line total
   - Format: "@ LKR 100 each"

4. **Show discount indication**
   - Original total (strikethrough)
   - Discounted total (highlighted)
   - Discount amount or percentage
   - Color coding (green for savings)

5. **Format currency**
   - LKR currency format
   - Two decimal places
   - Thousands separator
   - Right-aligned

6. **Style price display**
   - Bold font for total
   - Larger text than unit price
   - Right-aligned in row
   - Clear contrast

7. **Handle price changes**
   - Recalculate on quantity change
   - Update on discount applied
   - Animate on change (subtle)
   - Highlight briefly

### Item Price Display Layouts
```
Standard:
LKR 200.00

With Unit Price:
@ LKR 100 × 2
LKR 200.00

With Discount:
LKR 250.00
LKR 200.00  (-20%)
```

### Price Calculation

| Component | Formula |
|-----------|---------|
| Unit Price | From product |
| Quantity | From cart item |
| Subtotal | Unit Price × Quantity |
| Discount | Subtotal × Discount% or Fixed |
| Line Total | Subtotal - Discount |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/ItemPrice.tsx

// Imports
// ItemPrice props
// ItemPrice component
//   - Price container
//   - Unit price display (optional)
//   - Line total calculation
//   - Discount display
//   - Currency formatting
```

### Verification Checklist
- [ ] `ItemPrice.tsx` created
- [ ] Line total calculated
- [ ] Currency formatted
- [ ] Unit price shown (if included)
- [ ] Discount displayed correctly
- [ ] Right-aligned
- [ ] Typography prominent
- [ ] Updates on changes

---

## Task 42: Create Remove Item Button

### Overview
Create the remove item button component that allows users to delete items from the cart with optional confirmation.

### Dependencies
- Task 37: Create Cart Item Row

### Instructions

1. **Create remove button component**
   - Create `RemoveItemButton.tsx` in Cart directory
   - Button to remove cart item
   - Accept item ID and onRemove props

2. **Design button UI**
   - Icon: X or trash icon
   - Small, unobtrusive
   - Far right of item row
   - Touch-friendly size (32x32px min)

3. **Implement click handler**
   - Call onRemove handler
   - Pass item ID
   - Optional: Show confirmation
   - Update cart state

4. **Add confirmation dialog**
   - For expensive items (optional)
   - Simple confirm/cancel
   - "Remove [item name]?"
   - Escape to cancel

5. **Style button**
   - Subtle default state
   - Red on hover
   - Icon only or with text
   - Circular or square

6. **Add hover effects**
   - Color change (red)
   - Scale slightly larger
   - Cursor pointer
   - Smooth transition

7. **Handle disabled state**
   - Disable during operations
   - Grayed out appearance
   - No hover effects
   - Cursor: not-allowed

### Remove Button States
```
Normal:   [×]       ← Gray icon
Hover:    [×]       ← Red icon, slightly larger
Active:   [×]       ← Pressed state
Disabled: [×]       ← Grayed, no interaction
```

### Button Sizes

| Context | Size | Icon Size |
|---------|------|-----------|
| Desktop | 32×32px | 16-18px |
| Touch | 44×44px | 20-22px |
| Compact | 24×24px | 14-16px |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/RemoveItemButton.tsx

// Imports
// RemoveItemButton props
// RemoveItemButton component
//   - Button element
//   - Icon
//   - Click handler
//   - Confirmation logic (optional)
//   - State styling
```

### Verification Checklist
- [ ] `RemoveItemButton.tsx` created
- [ ] Button renders
- [ ] Icon displayed
- [ ] Click removes item
- [ ] Confirmation shown (if implemented)
- [ ] Hover effect works
- [ ] Touch-friendly size
- [ ] Disabled state functional

---

## Task 43: Create Item Options Button

### Overview
Create the item options button component that opens a menu for additional item actions like applying discounts or adding notes.

### Dependencies
- Task 37: Create Cart Item Row

### Instructions

1. **Create options button component**
   - Create `ItemOptionsMenu.tsx` in Cart directory
   - Button with dropdown menu
   - Accept item data prop

2. **Design button UI**
   - Icon: Three dots (⋮) or gear
   - Small button near remove button
   - Toggle menu visibility
   - Touch-friendly size

3. **Create options menu**
   - Dropdown or popover
   - Positioned below button
   - List of action options
   - Close on outside click

4. **Add menu options**
   - Apply Discount (Task 44)
   - Add Note (optional)
   - View Details (optional)
   - Remove Item (duplicate of Task 42)

5. **Implement option handlers**
   - Discount: Open discount modal
   - Note: Open note input
   - Details: Show product info
   - Remove: Confirm and remove

6. **Style menu appropriately**
   - White background
   - Border and shadow
   - List items with hover
   - Icons for each option

7. **Add keyboard support**
   - Tab to navigate options
   - Enter to select
   - Escape to close
   - Arrow keys for menu items

### Options Button and Menu Layout
```
Button:  [⋮]

Menu:
┌─────────────────────┐
│ 🏷️  Apply Discount  │
│ 📝  Add Note        │
│ ℹ️   View Details   │
│ 🗑️  Remove Item     │
└─────────────────────┘
```

### Menu Options

| Option | Icon | Action |
|--------|------|--------|
| Apply Discount | 🏷️ | Open discount input |
| Add Note | 📝 | Open note field |
| View Details | ℹ️ | Show product modal |
| Remove Item | 🗑️ | Remove from cart |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/ItemOptionsMenu.tsx

// Imports
// ItemOptionsMenu props
// ItemOptionsMenu component
//   - Options button
//   - Menu visibility state
//   - Dropdown menu
//   - Menu items list
//   - Action handlers
//   - Click outside handler
```

### Verification Checklist
- [ ] `ItemOptionsMenu.tsx` created
- [ ] Button renders
- [ ] Menu toggles on click
- [ ] Options listed
- [ ] Each option functional
- [ ] Menu closes appropriately
- [ ] Keyboard support added
- [ ] Positioning correct

---

## Task 44: Create Item Discount Input

### Overview
Create the item discount input component that allows applying percentage or fixed discounts to individual cart items with reason selection.

### Dependencies
- Task 43: Create Item Options Button

### Instructions

1. **Create discount input component**
   - Create `ItemDiscount.tsx` in Cart directory
   - Modal or inline form
   - Accept item and onApply props

2. **Add discount type toggle**
   - Toggle between Percentage and Fixed
   - Visual switch or radio buttons
   - Default: Percentage
   - Remember last used

3. **Create value input field**
   - Number input
   - Percentage: 0-100
   - Fixed: 0 to item subtotal
   - Validation on input

4. **Add discount reason select**
   - Dropdown of preset reasons
   - Options: "Loyalty", "Damaged", "Manager Approval", "Other"
   - Optional field
   - Free text for "Other"

5. **Show discount preview**
   - Original price
   - Discount amount
   - Final price after discount
   - Update in real-time

6. **Implement apply button**
   - Validate discount value
   - Check authorization (optional)
   - Update cart item
   - Close discount input

7. **Add cancel/clear options**
   - Cancel: Close without applying
   - Clear: Remove existing discount
   - Confirm before clear
   - Reset form

### Item Discount Input Layout
```
┌───────────────────────────────────┐
│ Apply Discount to Item        [×] │
├───────────────────────────────────┤
│ Discount Type:                    │
│ ( ) Percentage  (•) Fixed         │
│                                   │
│ Value: [ 10.00 ]                  │
│                                   │
│ Reason: [Manager Approval    ▼]   │
│                                   │
│ Preview:                          │
│ Original:    LKR 200.00           │
│ Discount:    LKR  10.00           │
│ Final:       LKR 190.00           │
│                                   │
│      [ Cancel ]    [ Apply ]      │
└───────────────────────────────────┘
```

### Discount Types

| Type | Input | Range | Calculation |
|------|-------|-------|-------------|
| Percentage | 0-100 | Percent | Subtotal × (%) |
| Fixed | Currency | 0 to Subtotal | Direct amount |

### Validation Rules

| Rule | Percentage | Fixed |
|------|------------|-------|
| Min | 0% | LKR 0 |
| Max | 100% | Item Subtotal |
| Required | Yes | Yes |
| Decimals | 2 places | 2 places |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/ItemDiscount.tsx

// Imports
// ItemDiscount props
// ItemDiscount component
//   - Modal/form container
//   - Type toggle
//   - Value input
//   - Reason select
//   - Preview calculation
//   - Apply/Cancel buttons
//   - Validation logic
```

### Verification Checklist
- [ ] `ItemDiscount.tsx` created
- [ ] Type toggle works
- [ ] Value input functional
- [ ] Validation implemented
- [ ] Reason select populated
- [ ] Preview calculates correctly
- [ ] Apply button updates item
- [ ] Cancel closes without changes
- [ ] Clear discount option works

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 35 | Create Cart Container | Three-section cart layout |
| 36 | Create Cart Items List | Scrollable items container |
| 37 | Create Cart Item Row | Complete item display row |
| 38 | Create Item Name Display | Product name and variant |
| 39 | Create Item Quantity Controls | +/- buttons with input |
| 40 | Create Quantity Input Field | Direct quantity entry |
| 41 | Create Item Price Display | Formatted line total |
| 42 | Create Remove Item Button | Delete item button |
| 43 | Create Item Options Button | Additional actions menu |
| 44 | Create Item Discount Input | Item-level discount |

### Current Progress
```
frontend/components/modules/pos/Cart/
├── CartContainer.tsx               # Task 35 ✓
├── CartItemsList.tsx               # Task 36 ✓
├── CartItem.tsx                    # Task 37 ✓
├── ItemName.tsx                    # Task 38 ✓
├── QuantityControls.tsx            # Task 39 ✓
├── QuantityInput.tsx               # Task 40 ✓
├── ItemPrice.tsx                   # Task 41 ✓
├── RemoveItemButton.tsx            # Task 42 ✓
├── ItemOptionsMenu.tsx             # Task 43 ✓
├── ItemDiscount.tsx                # Task 44 ✓
└── index.ts
```

### Cart UI Status
✓ **Completed Components:**
- Cart container with three sections
- Scrollable items list
- Complete item row with all controls
- Quantity management (+/-, input)
- Price display with formatting
- Remove and options buttons
- Item-level discount functionality

⏳ **Pending (Next Document):**
- Empty cart state (Task 45)
- Cart state store with Zustand (Task 46)
- Cart actions (add, update, remove, clear) (Tasks 47-50)
- Clear cart confirmation (Task 51)
- Cart persistence in localStorage (Task 52)

### Next Steps
Proceed to [02_Tasks-45-52_State-Persistence.md](02_Tasks-45-52_State-Persistence.md) to implement cart state management and persistence.

---

## Notes for AI Agents

1. **Quantity Controls:** Ensure touch-friendly sizing (min 44px) for mobile POS terminals
2. **Validation:** Always validate quantity against stock availability before updates
3. **Discounts:** Item-level discounts are separate from cart-level discounts
4. **Price Display:** Use consistent currency formatting (LKR with 2 decimal places)
5. **Accessibility:** All interactive elements need proper ARIA labels and keyboard support
6. **Performance:** Use React.memo for cart items to prevent unnecessary re-renders
7. **Next Document:** Focus on state management with Zustand and localStorage persistence
