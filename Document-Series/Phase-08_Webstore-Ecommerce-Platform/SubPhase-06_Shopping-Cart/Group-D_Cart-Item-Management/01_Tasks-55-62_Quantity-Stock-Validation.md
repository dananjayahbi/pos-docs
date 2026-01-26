# Tasks 55-62: Quantity Selector and Stock Validation

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** D - Cart Item Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-70_Remove-Save-Verify.md](02_Tasks-63-70_Remove-Save-Verify.md)

---

## Document Overview

This document covers the creation of the quantity selector component with integrated stock validation. It establishes the foundational quantity management system for cart items, including decrease/increase buttons, editable input field, minimum and maximum quantity constraints, real-time stock validation, and low stock warning indicators.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 55 | Create Quantity Selector | Medium | 45 min |
| 56 | Create Decrease Button | Low | 20 min |
| 57 | Create Increase Button | Low | 20 min |
| 58 | Create Quantity Input | Low | 25 min |
| 59 | Create Min Quantity Check | Low | 20 min |
| 60 | Create Max Quantity Check | Low | 20 min |
| 61 | Create Stock Validation | Medium | 35 min |
| 62 | Create Low Stock Warning | Low | 20 min |

---

## Task 55: Create Quantity Selector

### Overview
Create the QuantitySelector component that provides an inline control for adjusting item quantities in the cart. This component combines a decrease button, quantity input field, and increase button into a cohesive, bordered group that integrates with the cart state management system.

### Dependencies
- Task 54: Create Cart Item Display (from Group-C)
- Cart store actions (from Group-A)
- Type definitions for CartItem

### Instructions

1. **Create component directory structure**
   - Navigate to `frontend/components/storefront/cart/` directory
   - Create new directory named `QuantitySelector`
   - This will house all quantity-related components

2. **Create QuantitySelector component file**
   - Create `QuantitySelector.tsx` in `QuantitySelector/` directory
   - Set up TypeScript React functional component structure
   - Import necessary hooks and types

3. **Define component props interface**
   - Create `QuantitySelectorProps` interface
   - Include `cartItemId` prop (string - unique cart item ID)
   - Include `currentQuantity` prop (number)
   - Include `maxQuantity` prop (number - available stock)
   - Include `minQuantity` prop (number - default 1)
   - Include optional `onQuantityChange` callback

4. **Import cart store hooks**
   - Import `useCartStore` or equivalent state management hook
   - Access `updateItemQuantity` action from store
   - Prepare for dispatching quantity changes

5. **Implement component layout structure**
   - Create flex container with inline-flex display
   - Group decrease button, input, and increase button
   - Apply border to entire group for cohesive appearance

6. **Integrate child components**
   - Import and render DecreaseButton (Task 56)
   - Import and render QuantityInput (Task 58)
   - Import and render IncreaseButton (Task 57)
   - Pass necessary props to each child component

7. **Implement quantity change handler**
   - Create `handleQuantityChange` function
   - Validate new quantity against min/max constraints
   - Call store action to update cart item quantity
   - Handle optimistic updates for better UX

8. **Add accessibility features**
   - Include ARIA labels for screen readers
   - Ensure keyboard navigation works properly
   - Add role attributes where appropriate

9. **Style the selector container**
   - Apply rounded borders to group (`rounded-md`)
   - Add border color (`border-gray-300`)
   - Set overflow hidden to clip child borders
   - Ensure proper height and alignment

### Component Structure

```
┌─────────────────────────────────┐
│  ┌───┐ ┌────────┐ ┌───┐        │
│  │ - │ │   3    │ │ + │        │ ← Quantity Selector
│  └───┘ └────────┘ └───┘        │
└─────────────────────────────────┘
    ↑       ↑         ↑
    │       │         │
  Decrease Input  Increase
  Button  Field    Button
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| cartItemId | string | Yes | - | Unique cart item identifier |
| currentQuantity | number | Yes | - | Current item quantity |
| maxQuantity | number | Yes | - | Maximum available stock |
| minQuantity | number | No | 1 | Minimum allowed quantity |
| onQuantityChange | function | No | - | Optional callback on change |
| disabled | boolean | No | false | Disable entire selector |

### Layout Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Display | `inline-flex` | Inline with content |
| Border | `border border-gray-300` | Group definition |
| Radius | `rounded-md` | Modern appearance |
| Height | `h-9` or `h-10` | Consistent sizing |
| Overflow | `overflow-hidden` | Clean borders |
| Alignment | `items-center` | Vertical centering |

### Quantity Change Flow

```
User Action
    │
    ├─→ Decrease Button Click
    │       │
    │       ├─→ Validate (qty > min)
    │       └─→ Update Store (qty - 1)
    │
    ├─→ Increase Button Click
    │       │
    │       ├─→ Validate (qty < max)
    │       └─→ Update Store (qty + 1)
    │
    └─→ Input Field Change
            │
            ├─→ Validate (min ≤ qty ≤ max)
            ├─→ Debounce (500ms)
            └─→ Update Store (new qty)
```

### State Management Integration

| Action | Store Method | Parameters |
|--------|--------------|------------|
| Update Quantity | `updateItemQuantity` | `itemId`, `newQuantity` |
| Get Current Item | `getItemById` | `itemId` |
| Validate Stock | `validateItemStock` | `itemId`, `quantity` |

### Validation Rules

| Condition | Validation | Action |
|-----------|------------|--------|
| Quantity < Min | Failed | Clamp to min or prompt remove |
| Quantity > Max | Failed | Clamp to max stock |
| Quantity = 0 | Failed | Prompt item removal |
| Min ≤ Qty ≤ Max | Passed | Update cart |

### Expected Outcome
- Functional quantity selector component
- Integrated decrease, input, and increase controls
- Proper state management integration
- Validation against min/max constraints
- Accessible and keyboard-navigable

### Verification Checklist
- [ ] `frontend/components/storefront/cart/QuantitySelector/QuantitySelector.tsx` created
- [ ] Component accepts all required props
- [ ] Renders decrease, input, and increase components
- [ ] Integrates with cart store for updates
- [ ] Validates quantity changes properly
- [ ] Bordered group styling applied
- [ ] Accessibility features implemented
- [ ] Component exports via index file

---

## Task 56: Create Decrease Button

### Overview
Create the DecreaseButton component that reduces the item quantity by one when clicked. This button appears on the left side of the quantity selector and automatically disables when the quantity reaches the minimum value (typically 1).

### Dependencies
- Task 55: Create Quantity Selector

### Instructions

1. **Create DecreaseButton component file**
   - Create `DecreaseButton.tsx` in `QuantitySelector/` directory
   - Set up React functional component structure
   - Import necessary icons and utilities

2. **Define component props interface**
   - Create `DecreaseButtonProps` interface
   - Include `currentQuantity` prop (number)
   - Include `minQuantity` prop (number)
   - Include `onDecrease` callback function
   - Include optional `disabled` prop

3. **Import icon component**
   - Import Minus icon from icon library (Lucide, Heroicons, etc.)
   - Prepare icon for button display
   - Set appropriate icon size (16x16 or 20x20)

4. **Implement decrease logic**
   - Create click handler function
   - Check if current quantity is greater than minimum
   - Call `onDecrease` callback when valid
   - Prevent action when disabled or at minimum

5. **Implement disabled state logic**
   - Calculate if button should be disabled
   - Disable when `currentQuantity <= minQuantity`
   - Disable when parent `disabled` prop is true
   - Apply disabled styling accordingly

6. **Style the button**
   - Set button dimensions (square, typically 32-36px)
   - Apply border (only right border to separate from input)
   - Set background color (hover: light gray)
   - Configure disabled state appearance

7. **Add accessibility attributes**
   - Include `aria-label` ("Decrease quantity")
   - Add `aria-disabled` when applicable
   - Ensure button has proper type attribute
   - Add title tooltip for hover

8. **Implement hover and active states**
   - Add hover background color change
   - Add active state for click feedback
   - Disable hover effects when button is disabled

### Button States

| State | Condition | Appearance | Behavior |
|-------|-----------|------------|----------|
| Normal | qty > min | Enabled, hoverable | Decreases on click |
| Disabled | qty = min | Grayed out, no hover | No action |
| Hover | Normal + hover | Light background | Visual feedback |
| Active | Normal + click | Darker background | Visual feedback |

### Button Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Width | `w-9` or `w-10` | Square button |
| Height | `h-full` | Match selector height |
| Border | `border-r border-gray-300` | Right separator |
| Background | `bg-white hover:bg-gray-100` | Hover feedback |
| Disabled | `bg-gray-50 cursor-not-allowed` | Disabled state |
| Icon | `text-gray-600` | Minus symbol |
| Transition | `transition-colors` | Smooth effects |

### Decrease Button Layout

```
┌──────┬────────────┬──────┐
│  [-] │     3      │ [+]  │
└──────┴────────────┴──────┘
   ↑
   │
Decrease Button
(Left position)
```

### Disabled State Logic

```
isDisabled = (
  currentQuantity <= minQuantity ||
  disabled ||
  loading
)
```

### Click Handler Flow

```
User Clicks Decrease
    │
    ├─→ Check if disabled
    │       ├─→ Yes: Return (no action)
    │       └─→ No: Continue
    │
    ├─→ Calculate new quantity
    │       └─→ newQty = currentQty - 1
    │
    ├─→ Validate new quantity
    │       ├─→ newQty < min: Set to min
    │       └─→ Valid: Use newQty
    │
    └─→ Call onDecrease(newQty)
            └─→ Update cart store
```

### Icon Options

| Library | Icon Name | Size |
|---------|-----------|------|
| Lucide React | `Minus` | 16-20px |
| Heroicons | `MinusIcon` | 16-20px |
| React Icons | `HiMinus` | 16-20px |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | `aria-label="Decrease quantity"` |
| Disabled | `aria-disabled={isDisabled}` |
| Role | `button` (native button element) |
| Title | `title="Decrease quantity"` |
| Keyboard | Native button keyboard support |

### Expected Outcome
- Functional decrease button
- Proper disabled state when at minimum
- Minus icon displayed clearly
- Smooth hover and click interactions
- Accessible to keyboard and screen readers

### Verification Checklist
- [ ] `frontend/components/storefront/cart/QuantitySelector/DecreaseButton.tsx` created
- [ ] Component accepts required props
- [ ] Minus icon displayed
- [ ] Decreases quantity by 1 on click
- [ ] Disables when quantity equals minimum
- [ ] Hover and active states work correctly
- [ ] Accessibility attributes added
- [ ] Disabled state styling applied

---

## Task 57: Create Increase Button

### Overview
Create the IncreaseButton component that increments the item quantity by one when clicked. This button appears on the right side of the quantity selector and automatically disables when the quantity reaches the maximum available stock.

### Dependencies
- Task 55: Create Quantity Selector

### Instructions

1. **Create IncreaseButton component file**
   - Create `IncreaseButton.tsx` in `QuantitySelector/` directory
   - Set up React functional component structure
   - Import necessary icons and utilities

2. **Define component props interface**
   - Create `IncreaseButtonProps` interface
   - Include `currentQuantity` prop (number)
   - Include `maxQuantity` prop (number - available stock)
   - Include `onIncrease` callback function
   - Include optional `disabled` prop

3. **Import icon component**
   - Import Plus icon from icon library (Lucide, Heroicons, etc.)
   - Prepare icon for button display
   - Set appropriate icon size (16x16 or 20x20)

4. **Implement increase logic**
   - Create click handler function
   - Check if current quantity is less than maximum
   - Call `onIncrease` callback when valid
   - Prevent action when disabled or at maximum

5. **Implement disabled state logic**
   - Calculate if button should be disabled
   - Disable when `currentQuantity >= maxQuantity`
   - Disable when parent `disabled` prop is true
   - Apply disabled styling accordingly

6. **Style the button**
   - Set button dimensions (square, typically 32-36px)
   - Apply border (only left border to separate from input)
   - Set background color (hover: light gray)
   - Configure disabled state appearance

7. **Add max quantity tooltip (optional)**
   - Show tooltip on hover when disabled due to stock limit
   - Display message like "Maximum available: X"
   - Use title attribute or tooltip component

8. **Add accessibility attributes**
   - Include `aria-label` ("Increase quantity")
   - Add `aria-disabled` when applicable
   - Ensure button has proper type attribute
   - Add title tooltip for hover

9. **Implement hover and active states**
   - Add hover background color change
   - Add active state for click feedback
   - Disable hover effects when button is disabled

### Button States

| State | Condition | Appearance | Behavior |
|-------|-----------|------------|----------|
| Normal | qty < max | Enabled, hoverable | Increases on click |
| Disabled | qty = max | Grayed out, no hover | No action |
| Hover | Normal + hover | Light background | Visual feedback |
| Active | Normal + click | Darker background | Visual feedback |
| At Limit | qty = max | Show tooltip | "Max available: X" |

### Button Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Width | `w-9` or `w-10` | Square button |
| Height | `h-full` | Match selector height |
| Border | `border-l border-gray-300` | Left separator |
| Background | `bg-white hover:bg-gray-100` | Hover feedback |
| Disabled | `bg-gray-50 cursor-not-allowed` | Disabled state |
| Icon | `text-gray-600` | Plus symbol |
| Transition | `transition-colors` | Smooth effects |

### Increase Button Layout

```
┌──────┬────────────┬──────┐
│  [-] │     3      │ [+]  │
└──────┴────────────┴──────┘
                       ↑
                       │
                 Increase Button
                 (Right position)
```

### Disabled State Logic

```
isDisabled = (
  currentQuantity >= maxQuantity ||
  disabled ||
  loading ||
  outOfStock
)
```

### Click Handler Flow

```
User Clicks Increase
    │
    ├─→ Check if disabled
    │       ├─→ Yes: Return (no action)
    │       └─→ No: Continue
    │
    ├─→ Calculate new quantity
    │       └─→ newQty = currentQty + 1
    │
    ├─→ Validate new quantity
    │       ├─→ newQty > max: Set to max
    │       └─→ Valid: Use newQty
    │
    └─→ Call onIncrease(newQty)
            └─→ Update cart store
```

### Maximum Quantity Tooltip

| Condition | Tooltip Message |
|-----------|-----------------|
| At Stock Limit | "Maximum available: {maxQuantity}" |
| Out of Stock | "Out of stock" |
| General Disabled | "Cannot increase quantity" |

### Icon Options

| Library | Icon Name | Size |
|---------|-----------|------|
| Lucide React | `Plus` | 16-20px |
| Heroicons | `PlusIcon` | 16-20px |
| React Icons | `HiPlus` | 16-20px |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | `aria-label="Increase quantity"` |
| Disabled | `aria-disabled={isDisabled}` |
| Role | `button` (native button element) |
| Title | `title="Increase quantity (Max: {max})"` |
| Keyboard | Native button keyboard support |

### Expected Outcome
- Functional increase button
- Proper disabled state when at maximum stock
- Plus icon displayed clearly
- Tooltip showing max quantity when disabled
- Smooth hover and click interactions
- Accessible to keyboard and screen readers

### Verification Checklist
- [ ] `frontend/components/storefront/cart/QuantitySelector/IncreaseButton.tsx` created
- [ ] Component accepts required props
- [ ] Plus icon displayed
- [ ] Increases quantity by 1 on click
- [ ] Disables when quantity equals maximum stock
- [ ] Shows max quantity tooltip when at limit
- [ ] Hover and active states work correctly
- [ ] Accessibility attributes added
- [ ] Disabled state styling applied

---

## Task 58: Create Quantity Input

### Overview
Create the QuantityInput component that displays the current quantity and allows direct numeric input for changing the quantity. This input field sits between the decrease and increase buttons, provides immediate validation feedback, and supports keyboard entry for quick quantity updates.

### Dependencies
- Task 55: Create Quantity Selector

### Instructions

1. **Create QuantityInput component file**
   - Create `QuantityInput.tsx` in `QuantitySelector/` directory
   - Set up React functional component structure
   - Import necessary hooks and utilities

2. **Define component props interface**
   - Create `QuantityInputProps` interface
   - Include `value` prop (number - current quantity)
   - Include `minQuantity` prop (number)
   - Include `maxQuantity` prop (number)
   - Include `onChange` callback function
   - Include optional `disabled` prop

3. **Implement controlled input state**
   - Use value from props for controlled input
   - Create local state for temporary input value (string)
   - Handle conversion between string and number types

4. **Create input change handler**
   - Handle onChange event for input
   - Allow only numeric input (regex validation)
   - Update local state with input value
   - Prepare for validation on blur

5. **Implement blur validation handler**
   - Create onBlur handler function
   - Parse input string to number
   - Validate against min/max constraints
   - Clamp value if out of range
   - Call parent onChange callback with validated value
   - Show toast notification if value was adjusted

6. **Implement keyboard support**
   - Handle Enter key to trigger blur/validation
   - Handle Up/Down arrow keys to increment/decrement
   - Prevent default behavior on arrow keys in number input

7. **Style the input field**
   - Set width (typically 40-50px)
   - Center text alignment
   - Remove number input spinners (Chrome, Firefox)
   - Apply consistent height with buttons
   - Set border (none - inherits from container)

8. **Handle edge cases**
   - Empty input (show placeholder or prevent)
   - Non-numeric characters (reject or strip)
   - Leading zeros (normalize)
   - Negative numbers (prevent)
   - Decimal numbers (round or prevent)

9. **Add accessibility attributes**
   - Include `aria-label` ("Quantity")
   - Add `aria-valuemin` and `aria-valuemax` attributes
   - Add `aria-valuenow` for current value
   - Set `type="number"` or `inputMode="numeric"`

### Input Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Width | `w-10` to `w-12` | Fit 2-3 digits |
| Height | `h-full` | Match selector height |
| Alignment | `text-center` | Center quantity |
| Border | `border-0` | No separate border |
| Focus | `focus:outline-none focus:ring-1` | Visual feedback |
| Type | `text` or `number` | Numeric input |
| Pattern | `[0-9]*` | Numeric keyboard (mobile) |

### Quantity Input Layout

```
┌──────┬────────────┬──────┐
│  [-] │     3      │ [+]  │
└──────┴────────────┴──────┘
            ↑
            │
      Quantity Input
      (Center position,
       text-centered)
```

### Input Validation Flow

```
User Types in Input
    │
    ├─→ onChange Event
    │       ├─→ Filter non-numeric chars
    │       └─→ Update local state
    │
    ├─→ User Presses Enter or Blurs
    │       │
    │       ├─→ Parse to number
    │       │
    │       ├─→ Validate range
    │       │       ├─→ < min: Clamp to min
    │       │       ├─→ > max: Clamp to max
    │       │       └─→ Valid: Use value
    │       │
    │       ├─→ Show toast if adjusted
    │       │
    │       └─→ Call onChange(validQty)
    │
    └─→ Update cart store
```

### Input Validation Rules

| Input | Validation | Action |
|-------|------------|--------|
| Empty | Invalid | Revert to previous value |
| "0" | Invalid | Set to min (1) or prompt remove |
| < Min | Out of range | Clamp to min, show toast |
| > Max | Out of range | Clamp to max, show toast |
| Valid | Passed | Update quantity |
| Non-numeric | Invalid | Strip or reject characters |

### Hide Number Input Spinners

```
CSS Approach:

/* Chrome, Safari, Edge */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Enter | Trigger blur validation |
| Escape | Cancel edit, revert value |
| Up Arrow | Increase quantity by 1 |
| Down Arrow | Decrease quantity by 1 |
| Tab | Move focus, trigger validation |

### Validation Feedback Messages

| Condition | Toast Message |
|-----------|---------------|
| Below Min | "Quantity set to minimum (1)" |
| Above Max | "Quantity set to maximum ({max})" |
| Invalid Input | "Invalid quantity entered" |
| Out of Stock | "Only {max} items available" |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | `aria-label="Quantity"` |
| Value Range | `aria-valuemin={min}` `aria-valuemax={max}` |
| Current Value | `aria-valuenow={value}` |
| Input Mode | `inputMode="numeric"` (mobile) |
| Role | `spinbutton` (implicit with type="number") |

### Expected Outcome
- Functional numeric input field
- Direct quantity editing capability
- Real-time validation on blur
- Clamping to min/max constraints
- Centered text display
- Keyboard navigation support
- Toast feedback for adjustments

### Verification Checklist
- [ ] `frontend/components/storefront/cart/QuantitySelector/QuantityInput.tsx` created
- [ ] Component accepts required props
- [ ] Displays current quantity centered
- [ ] Allows direct numeric input
- [ ] Validates input on blur
- [ ] Clamps values to min/max range
- [ ] Shows toast when value adjusted
- [ ] Number spinners hidden
- [ ] Keyboard support implemented
- [ ] Accessibility attributes added

---

## Task 59: Create Min Quantity Check

### Overview
Implement minimum quantity validation logic to ensure cart items maintain at least a quantity of 1 (or configurable minimum). When users attempt to set a quantity below the minimum, the system either clamps the value to the minimum or prompts the user to remove the item entirely.

### Dependencies
- Task 55: Create Quantity Selector
- Task 56: Create Decrease Button

### Instructions

1. **Define minimum quantity constant**
   - Set default minimum quantity (typically 1)
   - Allow configuration via props or context
   - Document minimum quantity policy

2. **Implement validation function**
   - Create `validateMinQuantity` utility function
   - Accept quantity value and minimum threshold
   - Return validated quantity or error indicator

3. **Integrate with decrease button**
   - Check minimum before decreasing quantity
   - Disable decrease button when at minimum
   - Optionally show tooltip explaining why disabled

4. **Integrate with quantity input**
   - Validate input value against minimum
   - Clamp to minimum if below threshold
   - Show feedback message when adjusted

5. **Handle zero quantity scenario**
   - When user enters 0, interpret as remove intent
   - Show confirmation dialog or toast
   - Provide option to restore to minimum (1)

6. **Handle negative quantity input**
   - Prevent negative number entry
   - Strip minus sign from input
   - Show error message if somehow entered

7. **Add remove item prompt**
   - When quantity would go below minimum from decrease button
   - Show confirmation: "Remove item from cart?"
   - Provide Cancel and Remove options

8. **Implement feedback notifications**
   - Show toast when quantity clamped to minimum
   - Display message: "Minimum quantity is 1"
   - Include undo option if appropriate

### Minimum Quantity Rules

| Scenario | Current Qty | Action | Result |
|----------|-------------|--------|--------|
| Decrease at min | 1 | Disable button | No change |
| Input below min | 0 | Set to min | Qty = 1 |
| Input zero | 0 | Prompt remove | Remove or set to 1 |
| Input negative | -5 | Prevent/clamp | Qty = 1 |

### Validation Logic Flow

```
Quantity Change Attempted
    │
    ├─→ Check new quantity
    │       │
    │       ├─→ newQty < minQty
    │       │       │
    │       │       ├─→ newQty = 0?
    │       │       │       ├─→ Yes: Prompt removal
    │       │       │       └─→ No: Clamp to minQty
    │       │       │
    │       │       └─→ Show feedback toast
    │       │
    │       └─→ newQty >= minQty
    │               └─→ Allow change
    │
    └─→ Update cart
```

### Validation Function Structure

| Function | Parameters | Returns |
|----------|------------|---------|
| `validateMinQuantity` | `qty`, `min` | `{ valid: boolean, value: number, message?: string }` |
| `isAtMinimum` | `qty`, `min` | `boolean` |
| `promptRemoveOnZero` | `itemId` | `Promise<boolean>` |

### Remove Prompt Dialog

```
┌─────────────────────────────────┐
│  Remove Item from Cart?         │
│                                  │
│  Setting quantity to 0 will     │
│  remove this item from cart.    │
│                                  │
│  ┌──────────┐  ┌──────────┐    │
│  │  Cancel  │  │  Remove  │    │
│  └──────────┘  └──────────┘    │
└─────────────────────────────────┘
```

### Feedback Messages

| Condition | Message | Type |
|-----------|---------|------|
| Clamped to min | "Minimum quantity is 1" | Info toast |
| Zero entered | "Remove item from cart?" | Confirmation |
| Negative blocked | "Quantity must be positive" | Warning toast |
| At minimum | "Already at minimum quantity" | Info tooltip |

### Decrease Button Behavior at Minimum

```
┌──────┬────────────┬──────┐
│  [-] │     1      │ [+]  │
└──────┴────────────┴──────┘
   ↑
   │
Disabled state
(qty = minimum)
```

### Edge Cases to Handle

| Case | Handling |
|------|----------|
| Fractional minimum | Round up to nearest integer |
| Zero minimum allowed | Special case for free items |
| Variable minimums | Per-product minimum rules |
| Bulk items | Minimum might be > 1 |

### Integration Points

| Component | Integration |
|-----------|-------------|
| DecreaseButton | Disable when `qty <= min` |
| QuantityInput | Validate on blur, clamp if needed |
| QuantitySelector | Pass min prop to children |
| Cart Store | Validate before state update |

### Expected Outcome
- Minimum quantity enforced across all inputs
- Decrease button disabled at minimum
- Input validation clamps to minimum
- Clear feedback when adjustments made
- Remove prompt when zero entered
- Negative values prevented

### Verification Checklist
- [ ] Minimum quantity constant defined (default: 1)
- [ ] Validation function created
- [ ] Decrease button disables at minimum
- [ ] Input clamps values below minimum
- [ ] Zero quantity prompts removal confirmation
- [ ] Negative values prevented
- [ ] Feedback toasts display correctly
- [ ] Integration with all quantity controls works
- [ ] Edge cases handled appropriately

---

## Task 60: Create Max Quantity Check

### Overview
Implement maximum quantity validation logic based on available stock to prevent customers from adding more items to their cart than are available. When users attempt to exceed available stock, the system clamps the value to the maximum available and provides clear feedback about stock limitations.

### Dependencies
- Task 55: Create Quantity Selector
- Task 57: Create Increase Button

### Instructions

1. **Define maximum quantity source**
   - Source max quantity from product stock data
   - Pass stock availability via props to selector
   - Handle real-time stock updates

2. **Implement validation function**
   - Create `validateMaxQuantity` utility function
   - Accept quantity value and maximum stock
   - Return validated quantity or error indicator
   - Include stock availability check

3. **Integrate with increase button**
   - Check maximum before increasing quantity
   - Disable increase button when at maximum stock
   - Show tooltip with "Maximum available: X" message

4. **Integrate with quantity input**
   - Validate input value against maximum stock
   - Clamp to maximum if above threshold
   - Show feedback message when adjusted

5. **Handle stock updates**
   - React to real-time stock level changes
   - Adjust cart quantity if stock decreases below current qty
   - Show notification when quantity auto-adjusted

6. **Implement stock limit feedback**
   - Show toast when quantity clamped to max
   - Display message: "Only X items available"
   - Provide link to notify when back in stock (optional)

7. **Add visual stock indicators**
   - Show "X in stock" message near selector
   - Highlight when approaching stock limit
   - Change color based on stock level

8. **Handle zero stock scenario**
   - Disable entire selector when out of stock
   - Show "Out of Stock" message
   - Provide "Remove" or "Save for Later" options

### Maximum Quantity Rules

| Scenario | Current Qty | Max Stock | Action | Result |
|----------|-------------|-----------|--------|--------|
| Increase at max | 5 | 5 | Disable button | No change |
| Input above max | 10 | 5 | Clamp to max | Qty = 5 |
| Stock decreases | 8 | 5 | Auto-adjust | Qty = 5 |
| Out of stock | 3 | 0 | Disable selector | Show alert |

### Validation Logic Flow

```
Quantity Change Attempted
    │
    ├─→ Get current stock level
    │       │
    │       ├─→ stock = 0
    │       │       └─→ Show out of stock alert
    │       │
    │       └─→ stock > 0
    │               └─→ Continue validation
    │
    ├─→ Check new quantity
    │       │
    │       ├─→ newQty > maxStock
    │       │       ├─→ Clamp to maxStock
    │       │       └─→ Show feedback toast
    │       │
    │       └─→ newQty <= maxStock
    │               └─→ Allow change
    │
    └─→ Update cart
```

### Validation Function Structure

| Function | Parameters | Returns |
|----------|------------|---------|
| `validateMaxQuantity` | `qty`, `maxStock` | `{ valid: boolean, value: number, message?: string }` |
| `isAtMaximum` | `qty`, `maxStock` | `boolean` |
| `getStockLevel` | `productId` | `number` |
| `checkStockAvailable` | `productId`, `qty` | `boolean` |

### Maximum Quantity Tooltip

```
Hover on disabled increase button:

┌──────────────────────────┐
│ Maximum available: 5     │
└──────────────────────────┘
```

### Feedback Messages

| Condition | Message | Type |
|-----------|---------|------|
| Clamped to max | "Only {max} items available" | Warning toast |
| At maximum | "Maximum available: {max}" | Info tooltip |
| Stock decreased | "Stock updated. Quantity adjusted to {max}" | Warning toast |
| Out of stock | "This item is currently out of stock" | Error alert |

### Increase Button Behavior at Maximum

```
┌──────┬────────────┬──────┐
│  [-] │     5      │ [+]  │
└──────┴────────────┴──────┘
                       ↑
                       │
                 Disabled state
                 (qty = max stock)
```

### Stock Level Indicators

| Stock Level | Indicator | Color | Message |
|-------------|-----------|-------|---------|
| High (> 10) | None | - | - |
| Medium (5-10) | Badge | Orange | "Limited stock" |
| Low (1-4) | Badge | Red | "Only X left!" |
| Zero (0) | Badge | Gray | "Out of stock" |

### Real-Time Stock Update Handling

```
Stock Level Changes (WebSocket/Polling)
    │
    ├─→ New stock < current cart qty
    │       │
    │       ├─→ Adjust cart quantity down
    │       ├─→ Show notification
    │       └─→ Update max quantity prop
    │
    └─→ New stock >= current cart qty
            └─→ Update max quantity prop
                └─→ Enable increase button if was disabled
```

### Edge Cases to Handle

| Case | Handling |
|------|----------|
| Stock becomes 0 | Disable selector, show out of stock |
| Stock < cart qty | Auto-adjust cart qty, notify user |
| Reserved stock | Account for pending orders |
| Bundle products | Check all components' stock |
| Pre-orders | Different max qty rules |

### Integration Points

| Component | Integration |
|-----------|-------------|
| IncreaseButton | Disable when `qty >= maxStock` |
| QuantityInput | Validate on blur, clamp if needed |
| QuantitySelector | Pass maxStock prop to children |
| Cart Store | Validate before state update |
| Product API | Fetch real-time stock levels |

### Expected Outcome
- Maximum quantity enforced based on stock
- Increase button disabled at maximum
- Input validation clamps to maximum stock
- Clear feedback about stock limitations
- Stock level indicators visible
- Real-time stock updates handled
- Out of stock scenario managed gracefully

### Verification Checklist
- [ ] Maximum quantity sourced from stock data
- [ ] Validation function created
- [ ] Increase button disables at maximum stock
- [ ] Input clamps values above maximum
- [ ] Stock limit tooltip shows on disabled increase
- [ ] Feedback toasts display correctly
- [ ] Stock level indicators implemented
- [ ] Real-time stock updates handled
- [ ] Out of stock scenario managed
- [ ] Edge cases handled appropriately

---

## Task 61: Create Stock Validation

### Overview
Implement comprehensive stock validation system that checks product availability at multiple points in the cart flow: when adding items, when changing quantities, and when loading the cart page. This ensures customers cannot proceed to checkout with unavailable items and maintains data integrity between cart state and actual inventory.

### Dependencies
- Task 60: Create Max Quantity Check
- Cart store actions from Group-A
- Product inventory API

### Instructions

1. **Create stock validation service**
   - Create `stockValidation.ts` utility file
   - Define stock validation functions
   - Implement API calls to check inventory
   - Handle batch validation for multiple items

2. **Define validation trigger points**
   - On add to cart action
   - On quantity increase/decrease
   - On cart page load
   - On checkout initiation
   - On returning to cart after time away

3. **Implement real-time stock checking**
   - Create `validateItemStock` function
   - Accept product ID and requested quantity
   - Call inventory API for current stock level
   - Return validation result with available quantity

4. **Implement batch validation**
   - Create `validateCartStock` function
   - Accept array of cart items
   - Validate all items in single API call
   - Return map of item IDs to validation results

5. **Handle validation results**
   - Process successful validation (stock available)
   - Process failed validation (insufficient stock)
   - Process out-of-stock scenarios
   - Process partial availability (some qty available)

6. **Implement auto-adjustment logic**
   - When stock < requested quantity
   - Automatically adjust cart quantity to available stock
   - Show notification of adjustment
   - Provide option to remove item instead

7. **Create validation error handling**
   - Handle API failures gracefully
   - Show appropriate error messages
   - Allow retry mechanism
   - Fallback to cached stock data if available

8. **Implement validation caching**
   - Cache validation results for short period (30-60 seconds)
   - Prevent excessive API calls
   - Invalidate cache on stock change events
   - Balance freshness vs performance

9. **Add validation loading states**
   - Show loading indicator during validation
   - Disable quantity controls while validating
   - Prevent duplicate validation requests

### Validation Trigger Points

| Trigger | When | Action |
|---------|------|--------|
| Add to Cart | Item added | Validate stock before adding |
| Quantity Change | User adjusts qty | Validate new quantity |
| Cart Load | Page loads | Validate all cart items |
| Checkout Click | User proceeds | Final validation check |
| Focus Return | Tab/window focus | Re-validate after inactivity |
| Stock Update Event | Real-time update | Trigger re-validation |

### Stock Validation Flow

```
Validation Triggered
    │
    ├─→ Check cache
    │       ├─→ Valid cache exists?
    │       │       ├─→ Yes: Use cached result
    │       │       └─→ No: Continue
    │       │
    │       └─→ Call inventory API
    │               │
    │               ├─→ Success
    │               │       ├─→ Stock available
    │               │       │       └─→ Allow action
    │               │       │
    │               │       └─→ Insufficient stock
    │               │               ├─→ Adjust quantity
    │               │               └─→ Show notification
    │               │
    │               └─→ Error
    │                       ├─→ Show error message
    │                       └─→ Use cached data if available
    │
    └─→ Update cache
```

### Validation Result Types

| Result | Stock Status | Action |
|--------|--------------|--------|
| Valid | Stock >= requested qty | Allow addition/update |
| Partial | 0 < stock < requested qty | Adjust to available stock |
| OutOfStock | Stock = 0 | Show out of stock, suggest remove |
| Error | API failure | Show error, allow retry |

### API Integration

| Endpoint | Method | Parameters | Response |
|----------|--------|------------|----------|
| `/api/inventory/check` | POST | `productId`, `quantity` | `{ available: boolean, stock: number }` |
| `/api/inventory/batch` | POST | `items: [{ id, qty }]` | `{ results: Map<id, result> }` |
| `/api/inventory/subscribe` | WS | `productIds[]` | Real-time stock updates |

### Validation Response Structure

```typescript
{
  valid: boolean,
  productId: string,
  requestedQuantity: number,
  availableStock: number,
  adjustedQuantity: number,
  message: string,
  timestamp: Date
}
```

### Auto-Adjustment Logic

```
Stock < Requested Quantity
    │
    ├─→ availableStock > 0
    │       ├─→ Adjust cart qty to availableStock
    │       ├─→ Show toast: "Quantity adjusted to {stock} (all available)"
    │       └─→ Provide "Remove" button in toast
    │
    └─→ availableStock = 0
            ├─→ Disable quantity selector
            ├─→ Show out of stock alert
            └─→ Provide "Remove" or "Save for Later" options
```

### Validation Notifications

| Scenario | Notification | Type | Actions |
|----------|--------------|------|---------|
| Stock sufficient | None | - | - |
| Qty adjusted down | "Only {stock} available. Quantity adjusted." | Warning | Undo, Remove |
| Out of stock | "This item is no longer available." | Error | Remove, Save Later |
| API error | "Unable to verify stock. Please try again." | Error | Retry |

### Caching Strategy

| Cache Duration | Use Case |
|----------------|----------|
| 30 seconds | Frequent interactions (quantity changes) |
| 60 seconds | Page load validations |
| 0 seconds (no cache) | Checkout validation |
| Real-time | WebSocket updates |

### Loading States

```
Validating Stock...

┌──────┬────────────┬──────┐
│  [-] │     3      │ [+]  │  ← Disabled
└──────┴────────────┴──────┘
          ↓
    [Loading spinner]
    "Checking availability..."
```

### Error Handling

| Error Type | Message | Recovery |
|------------|---------|----------|
| Network Error | "Connection lost. Check your internet." | Retry button |
| API Error | "Unable to check stock. Please try again." | Retry button |
| Timeout | "Request timed out. Please try again." | Retry button |
| Invalid Response | "Error checking stock. Please refresh page." | Refresh button |

### Integration with Cart Store

| Store Action | Validation Point |
|--------------|------------------|
| `addItem` | Before adding to state |
| `updateQuantity` | Before updating state |
| `loadCart` | After loading from storage |
| `checkout` | Before proceeding to checkout |

### Expected Outcome
- Comprehensive stock validation system
- Multiple validation trigger points
- Real-time stock level checking
- Automatic quantity adjustments
- Clear user notifications
- Efficient API usage with caching
- Graceful error handling
- Loading states for user feedback

### Verification Checklist
- [ ] Stock validation service created
- [ ] Validation functions implemented
- [ ] API integration completed
- [ ] Validation triggers at all required points
- [ ] Auto-adjustment logic works correctly
- [ ] Notifications display appropriately
- [ ] Caching strategy implemented
- [ ] Loading states show during validation
- [ ] Error handling covers all scenarios
- [ ] Batch validation for cart load works
- [ ] Real-time updates integrated (if applicable)

---

## Task 62: Create Low Stock Warning

### Overview
Create the LowStockWarning component that displays an alert when a cart item's available stock falls below a certain threshold (typically 5 units). This warning appears below the quantity selector and provides visual feedback to encourage users to complete their purchase before the item sells out.

### Dependencies
- Task 61: Create Stock Validation

### Instructions

1. **Create LowStockWarning component file**
   - Create `LowStockWarning.tsx` in `components/storefront/cart/CartItem/` directory
   - Set up React functional component structure
   - Import necessary icons and styling utilities

2. **Define component props interface**
   - Create `LowStockWarningProps` interface
   - Include `stockLevel` prop (number)
   - Include `threshold` prop (number - default 5)
   - Include optional `variant` prop for styling
   - Include optional `showCount` prop (boolean)

3. **Implement warning display logic**
   - Calculate if warning should show (stockLevel <= threshold)
   - Return null if stock is above threshold
   - Render warning message when below threshold

4. **Design warning message**
   - Display "Only X left in stock!" or similar
   - Use dynamic stock count in message
   - Keep message concise and action-oriented

5. **Import and configure icon**
   - Import AlertCircle or Warning icon
   - Use orange/amber color to indicate caution
   - Size icon appropriately (16x16 or 20x20)

6. **Style the warning component**
   - Apply orange/amber background color (bg-orange-50)
   - Set text color to orange-700 or amber-700
   - Add padding for readability
   - Set rounded corners
   - Use flex layout for icon + text

7. **Implement threshold customization**
   - Allow threshold to be configured via props
   - Default to 5 items
   - Support per-product threshold if needed

8. **Add animation (optional)**
   - Subtle fade-in animation when warning appears
   - Pulse effect for very low stock (≤ 2)
   - Keep animations subtle to avoid annoyance

9. **Consider urgency levels**
   - Normal low stock (3-5 items): Orange
   - Very low stock (1-2 items): Red
   - Adjust styling based on urgency level

### Warning Display Conditions

| Stock Level | Threshold | Display Warning | Style |
|-------------|-----------|-----------------|-------|
| > 5 | 5 | No | - |
| 3-5 | 5 | Yes | Orange (normal) |
| 1-2 | 5 | Yes | Red (urgent) |
| 0 | 5 | No | (Out of stock alert instead) |

### Warning Component Layout

```
┌─────────────────────────────────────┐
│  ┌───┬────────┬───┐                 │
│  │ - │   3    │ + │  Quantity       │
│  └───┴────────┴───┘                 │
│                                      │
│  ┌──────────────────────────────┐  │
│  │ ⚠️ Only 3 left in stock!     │  │ ← Low Stock Warning
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| stockLevel | number | Yes | - | Current available stock |
| threshold | number | No | 5 | Warning threshold |
| showCount | boolean | No | true | Show exact count or generic message |
| variant | "normal" \| "urgent" | No | "normal" | Warning urgency level |
| className | string | No | "" | Additional CSS classes |

### Warning Messages

| Stock Level | Message | Variant |
|-------------|---------|---------|
| 5 | "Only 5 left in stock!" | Normal |
| 3 | "Only 3 left in stock!" | Normal |
| 2 | "Only 2 left!" | Urgent |
| 1 | "Last one!" | Urgent |

### Styling Specifications

| Element | Tailwind Classes (Normal) | Purpose |
|---------|---------------------------|---------|
| Container | `bg-orange-50 border border-orange-200 rounded-md` | Warning background |
| Layout | `flex items-center gap-2 px-3 py-2` | Icon + text layout |
| Icon | `text-orange-600 flex-shrink-0` | Warning icon |
| Text | `text-sm text-orange-800 font-medium` | Message text |

### Styling Specifications (Urgent Variant)

| Element | Tailwind Classes (Urgent) | Purpose |
|---------|---------------------------|---------|
| Container | `bg-red-50 border border-red-200 rounded-md` | Urgent background |
| Layout | `flex items-center gap-2 px-3 py-2` | Icon + text layout |
| Icon | `text-red-600 flex-shrink-0` | Urgent icon |
| Text | `text-sm text-red-800 font-semibold` | Urgent message |

### Urgency Level Logic

```
Determine Warning Variant:

if (stockLevel === 0) {
  // Show out of stock alert instead
  return null;
} else if (stockLevel <= 2) {
  return 'urgent'; // Red styling
} else if (stockLevel <= threshold) {
  return 'normal'; // Orange styling
} else {
  return null; // No warning
}
```

### Icon Options

| Library | Icon Name | Usage |
|---------|-----------|-------|
| Lucide React | `AlertCircle` | Normal warning |
| Lucide React | `AlertTriangle` | Urgent warning |
| Heroicons | `ExclamationCircleIcon` | Normal warning |
| Heroicons | `ExclamationTriangleIcon` | Urgent warning |

### Animation Options (Optional)

| Animation | CSS | When to Use |
|-----------|-----|-------------|
| Fade In | `animate-in fade-in duration-300` | Warning appears |
| Pulse | `animate-pulse` | Very low stock (1-2) |
| Slide Down | `animate-in slide-in-from-top-2` | Warning appears |

### Responsive Behavior

```
Mobile (< 640px)
├── Font Size: text-xs
├── Padding: px-2 py-1.5
└── Icon Size: 14px

Desktop (≥ 640px)
├── Font Size: text-sm
├── Padding: px-3 py-2
└── Icon Size: 16px
```

### Integration with CartItem

```
CartItem Component
    │
    ├─→ Product Info
    ├─→ Price Display
    ├─→ Quantity Selector
    │
    ├─→ LowStockWarning ← Insert here
    │       └─→ Shows when stock <= threshold
    │
    └─→ Remove Button
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | `role="alert"` (for screen readers) |
| Aria Label | `aria-label="Low stock warning"` |
| Color Independence | Icon + text (not just color) |
| Contrast | Sufficient contrast ratio (4.5:1+) |

### Expected Outcome
- Low stock warning component displays when appropriate
- Orange styling for moderate low stock
- Red styling for very low stock (1-2 items)
- Clear, concise warning message
- Positioned below quantity selector
- Accessible to screen readers
- Responsive across device sizes

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartItem/LowStockWarning.tsx` created
- [ ] Component accepts required props
- [ ] Warning displays when stock <= threshold
- [ ] No warning when stock > threshold
- [ ] Orange styling for normal low stock
- [ ] Red styling for urgent low stock (1-2 items)
- [ ] Warning icon displayed correctly
- [ ] Message shows exact stock count
- [ ] Component positioned below quantity selector
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Summary

This document established the quantity selector system with comprehensive stock validation. It created the selector component with decrease/increase buttons and editable input, implemented minimum and maximum quantity constraints, integrated real-time stock validation, and added low stock warning indicators.

### Completed Tasks
1. ✓ Created QuantitySelector component with grouped layout
2. ✓ Created DecreaseButton with minimum validation
3. ✓ Created IncreaseButton with maximum validation
4. ✓ Created QuantityInput with direct editing and validation
5. ✓ Implemented minimum quantity check (default: 1)
6. ✓ Implemented maximum quantity check (based on stock)
7. ✓ Created stock validation service with multiple triggers
8. ✓ Created LowStockWarning component for user awareness

### Next Steps
Proceed to [02_Tasks-63-70_Remove-Save-Verify.md](02_Tasks-63-70_Remove-Save-Verify.md) to create out of stock alerts, remove item functionality, save for later option, and verification of quantity management flows.
