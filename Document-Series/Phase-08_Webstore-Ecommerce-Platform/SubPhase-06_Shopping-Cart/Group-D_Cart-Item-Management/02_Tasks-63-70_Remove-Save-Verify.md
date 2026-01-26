# Tasks 63-70: Remove, Save for Later, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** D - Cart Item Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-55-62_Quantity-Stock-Validation.md](01_Tasks-55-62_Quantity-Stock-Validation.md)

---

## Document Overview

This document covers the completion of cart item management functionality, including out of stock alerts, item removal with optional confirmation, undo remove functionality, save for later feature, update notifications, debounced quantity changes, and comprehensive verification of all quantity management flows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create Out of Stock Alert | Low | 20 min |
| 64 | Create Remove Item Button | Low | 25 min |
| 65 | Create Remove Confirmation | Low | 30 min |
| 66 | Create Undo Remove | Medium | 40 min |
| 67 | Create Save for Later | Medium | 45 min |
| 68 | Create Update Cart Toast | Low | 20 min |
| 69 | Create Debounced Quantity | Low | 30 min |
| 70 | Verify Quantity Management | Low | 30 min |

---

## Task 63: Create Out of Stock Alert

### Overview
Create the OutOfStockAlert component that displays when a cart item's stock reaches zero. This alert disables the quantity selector, provides clear messaging about unavailability, and offers actions to remove the item or save it for later when stock returns.

### Dependencies
- Task 61: Create Stock Validation
- Task 62: Create Low Stock Warning

### Instructions

1. **Create OutOfStockAlert component file**
   - Create `OutOfStockAlert.tsx` in `components/storefront/cart/CartItem/` directory
   - Set up React functional component structure
   - Import necessary icons and components

2. **Define component props interface**
   - Create `OutOfStockAlertProps` interface
   - Include `productId` prop (string)
   - Include `productName` prop (string)
   - Include `onRemove` callback function
   - Include `onSaveForLater` callback function (optional)

3. **Design alert message structure**
   - Primary message: "Out of Stock"
   - Secondary message: "This item is currently unavailable"
   - Action buttons area

4. **Import and configure icons**
   - Import XCircle or AlertTriangle icon for error state
   - Use red color to indicate unavailability
   - Size icon appropriately (20x20 or 24x24)

5. **Style the alert container**
   - Apply red/error background (bg-red-50)
   - Set text color to red-800
   - Add border with red-200
   - Set rounded corners and padding
   - Make alert prominent but not overwhelming

6. **Add action buttons**
   - "Remove from Cart" button (primary action)
   - "Save for Later" button (secondary action, if wishlist enabled)
   - "Notify When Available" button (optional)
   - Style buttons appropriately for alert context

7. **Implement alert positioning**
   - Replace quantity selector when stock = 0
   - Position in same area as quantity controls
   - Ensure alert is immediately visible

8. **Add conditional rendering logic**
   - Only show when stock level is exactly 0
   - Hide when stock becomes available again
   - Trigger re-render on stock updates

9. **Integrate with quantity selector**
   - Disable entire quantity selector when alert shows
   - Show alert instead of quantity controls
   - Provide smooth transition between states

### Alert Display Conditions

| Stock Level | Display Alert | Display Quantity Selector |
|-------------|---------------|---------------------------|
| > 0 | No | Yes (normal) |
| 0 | Yes | No (disabled/hidden) |

### Out of Stock Alert Layout

```
┌─────────────────────────────────────────┐
│  Product Name                           │
│  ₨1,299.00                             │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ ❌ Out of Stock                 │  │
│  │ This item is currently          │  │
│  │ unavailable                     │  │
│  │                                 │  │
│  │ [Remove] [Save for Later]      │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| productId | string | Yes | - | Product identifier |
| productName | string | Yes | - | Display name |
| onRemove | function | Yes | - | Remove item callback |
| onSaveForLater | function | No | - | Save for later callback |
| onNotify | function | No | - | Notify when available callback |
| className | string | No | "" | Additional CSS classes |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `bg-red-50 border border-red-200 rounded-lg` | Error background |
| Layout | `p-4 space-y-3` | Spacing and padding |
| Icon | `text-red-600 w-6 h-6` | Error indicator |
| Heading | `text-lg font-semibold text-red-900` | Primary message |
| Description | `text-sm text-red-700` | Secondary message |
| Button Container | `flex gap-2 mt-3` | Action buttons layout |

### Alert Messages

| Message Type | Content | Styling |
|--------------|---------|---------|
| Primary | "Out of Stock" | `text-lg font-semibold text-red-900` |
| Secondary | "This item is currently unavailable" | `text-sm text-red-700` |
| Alternative | "Limited stock - please check back soon" | `text-sm text-red-700` |

### Action Buttons

| Button | Style | Action |
|--------|-------|--------|
| Remove | `bg-red-600 text-white hover:bg-red-700` | Remove item from cart |
| Save for Later | `bg-white text-red-600 border border-red-300 hover:bg-red-50` | Move to wishlist |
| Notify Me | `text-red-600 hover:text-red-800 underline` | Subscribe to restock alert |

### Alert vs Quantity Selector Toggle

```
Stock Available (stock > 0)
    ↓
┌──────┬────────┬──────┐
│  [-] │   3    │ [+]  │  ← Quantity Selector
└──────┴────────┴──────┘

Stock Depleted (stock = 0)
    ↓
┌──────────────────────────┐
│ ❌ Out of Stock          │  ← Out of Stock Alert
│ This item is currently   │
│ unavailable              │
│                          │
│ [Remove] [Save Later]   │
└──────────────────────────┘
```

### Integration Flow

```
Cart Item Render
    │
    ├─→ Check stock level
    │       │
    │       ├─→ stock = 0?
    │       │       ├─→ Yes: Render OutOfStockAlert
    │       │       │       └─→ Hide QuantitySelector
    │       │       │
    │       │       └─→ No: Render QuantitySelector
    │       │               └─→ Hide OutOfStockAlert
    │       │
    │       └─→ Show LowStockWarning if needed
    │
    └─→ Render product info
```

### Responsive Behavior

```
Mobile (< 640px)
├── Stack buttons vertically
├── Full width buttons
└── Smaller padding (p-3)

Desktop (≥ 640px)
├── Buttons side by side
├── Auto width buttons
└── Standard padding (p-4)
```

### Icon Options

| Library | Icon Name | Visual Effect |
|---------|-----------|---------------|
| Lucide React | `XCircle` | Clear unavailability |
| Lucide React | `AlertTriangle` | Warning emphasis |
| Heroicons | `XCircleIcon` | Clear unavailability |
| Heroicons | `ExclamationTriangleIcon` | Warning emphasis |

### Action Button Handlers

| Button | Handler | Parameters |
|--------|---------|------------|
| Remove | `onRemove` | `productId` |
| Save for Later | `onSaveForLater` | `productId` |
| Notify Me | `onNotify` | `productId`, `userEmail` |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | `role="alert"` (immediate attention) |
| Aria Label | `aria-label="Product out of stock"` |
| Live Region | `aria-live="assertive"` |
| Button Labels | Clear, descriptive text |
| Color Independence | Icon + text (not color alone) |
| Contrast | High contrast (red on light background) |

### Expected Outcome
- Out of stock alert displays when stock reaches zero
- Clear error styling with red color scheme
- Quantity selector disabled/hidden
- Action buttons for remove and save for later
- Alert positioned prominently
- Accessible to screen readers
- Responsive design across devices

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartItem/OutOfStockAlert.tsx` created
- [ ] Component accepts required props
- [ ] Alert displays only when stock = 0
- [ ] Red error styling applied
- [ ] Error icon displayed prominently
- [ ] Primary and secondary messages shown
- [ ] Remove button functional
- [ ] Save for Later button functional (if enabled)
- [ ] Quantity selector hidden when alert shows
- [ ] Accessibility features implemented
- [ ] Responsive on mobile and desktop
- [ ] Component exports properly

---

## Task 64: Create Remove Item Button

### Overview
Create the RemoveItemButton component that allows users to delete items from their cart. This button appears on each cart item, typically positioned on the right side or near the item controls, and optionally triggers a confirmation dialog before removing high-value or multiple-quantity items.

### Dependencies
- Task 43: Create Cart Item Card (from Group-C)
- Cart store remove action

### Instructions

1. **Create RemoveItemButton component file**
   - Create `RemoveItemButton.tsx` in `components/storefront/cart/CartItem/` directory
   - Set up React functional component structure
   - Import necessary icons and hooks

2. **Define component props interface**
   - Create `RemoveItemButtonProps` interface
   - Include `cartItemId` prop (string)
   - Include `productName` prop (string - for confirmation)
   - Include `onRemove` callback function
   - Include `showConfirmation` prop (boolean - optional)
   - Include `confirmThreshold` prop (number - for high-value items)

3. **Import icon component**
   - Import Trash2 or X icon from icon library
   - Prepare icon for button display
   - Size icon appropriately (16x16 or 20x20)

4. **Implement remove handler**
   - Create click handler function
   - Check if confirmation is needed
   - Call onRemove callback or show confirmation modal
   - Handle optimistic UI updates

5. **Integrate with cart store**
   - Import cart store hook
   - Access `removeItem` action
   - Dispatch remove action with cart item ID

6. **Style the button**
   - Create icon-only button with minimal styling
   - Apply hover state with red color
   - Position button appropriately (top-right or inline)
   - Ensure button is accessible and clickable

7. **Add tooltip on hover**
   - Show "Remove" text on hover
   - Use title attribute or tooltip component
   - Provide clear action indication

8. **Implement button variants**
   - Icon-only variant (compact)
   - Icon + text variant (explicit)
   - Support both through props or responsive design

9. **Add loading state**
   - Show loading spinner during removal
   - Disable button while processing
   - Provide visual feedback

### Button Positioning Options

| Position | Layout | Use Case |
|----------|--------|----------|
| Top Right | Absolute positioned | Card-style items |
| Right Inline | Flex end | List-style items |
| Below Quantity | Block below | Mobile layout |

### Remove Button Layout Examples

```
Option 1: Top Right (Absolute)
┌────────────────────────────── [×] ┐
│ Product Image  Product Name       │
│                ₨1,299.00          │
│                [Qty Selector]     │
└───────────────────────────────────┘

Option 2: Right Inline
┌──────────────────────────────────┐
│ Product Image  Product Name  [×] │
│                ₨1,299.00          │
│                [Qty Selector]     │
└──────────────────────────────────┘

Option 3: Below Quantity
┌──────────────────────────────────┐
│ Product Image  Product Name       │
│                ₨1,299.00          │
│                [Qty Selector]     │
│                [Remove Button]    │
└──────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| cartItemId | string | Yes | - | Cart item identifier |
| productName | string | Yes | - | For confirmation message |
| onRemove | function | No | - | Custom remove handler |
| showConfirmation | boolean | No | false | Show confirmation modal |
| confirmThreshold | number | No | - | Price threshold for confirmation |
| variant | "icon" \| "text" | No | "icon" | Button display variant |
| position | "absolute" \| "inline" | No | "absolute" | Position style |

### Button Styling Specifications

| Variant | Tailwind Classes | Description |
|---------|------------------|-------------|
| Icon Only | `p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600` | Compact, icon only |
| Icon + Text | `px-3 py-1.5 rounded-md hover:bg-red-50 text-gray-600 hover:text-red-600 flex items-center gap-2` | With "Remove" text |
| Loading | `opacity-50 cursor-not-allowed` | During removal |

### Remove Handler Flow

```
User Clicks Remove Button
    │
    ├─→ Check confirmation settings
    │       │
    │       ├─→ Confirmation needed?
    │       │       ├─→ Yes: Show modal (Task 65)
    │       │       │       ├─→ Confirm: Continue removal
    │       │       │       └─→ Cancel: Abort
    │       │       │
    │       │       └─→ No: Continue removal
    │       │
    │       └─→ Call removeItem action
    │               │
    │               ├─→ Update cart state
    │               ├─→ Show undo toast (Task 66)
    │               └─→ Recalculate totals
    │
    └─→ Success: Item removed
```

### Confirmation Threshold Logic

```
Determine if Confirmation Needed:

if (showConfirmation === true) {
  return true; // Always confirm
}

if (confirmThreshold && itemPrice > confirmThreshold) {
  return true; // Confirm high-value items
}

if (itemQuantity > 1) {
  return true; // Confirm multiple quantity
}

return false; // No confirmation needed
```

### Icon Options

| Library | Icon Name | Style | Use Case |
|---------|-----------|-------|----------|
| Lucide React | `Trash2` | Modern trash icon | Primary choice |
| Lucide React | `X` | Close/remove icon | Minimal style |
| Heroicons | `TrashIcon` | Traditional trash | Alternative |
| Heroicons | `XMarkIcon` | Close icon | Minimal style |

### Button States

| State | Appearance | Behavior |
|-------|------------|----------|
| Normal | Gray icon | Hoverable |
| Hover | Red icon, light background | Visual feedback |
| Loading | Spinner, disabled | Processing |
| Disabled | Gray, no hover | Cannot remove |

### Responsive Behavior

```
Mobile (< 640px)
├── Position: Top right absolute
├── Size: p-1.5 (smaller)
└── Icon only

Tablet (640px - 1024px)
├── Position: Top right or inline
├── Size: p-2 (standard)
└── Icon only or with text

Desktop (> 1024px)
├── Position: Inline right
├── Size: p-2 (standard)
└── Show text on hover
```

### Integration with Cart Store

| Store Method | Parameters | Action |
|--------------|------------|--------|
| `removeItem` | `cartItemId` | Remove from cart state |
| `addRemovedItem` | `itemSnapshot` | For undo functionality |
| `updateTotals` | - | Recalculate cart totals |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | `aria-label="Remove {productName}"` |
| Role | `button` (native button element) |
| Title | `title="Remove item"` |
| Keyboard | Enter/Space to activate |
| Focus | Visible focus ring |

### Expected Outcome
- Functional remove button on each cart item
- Clear hover state with red color
- Optional confirmation before removal
- Integration with cart store
- Undo functionality via toast (Task 66)
- Accessible and keyboard-navigable
- Responsive positioning

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartItem/RemoveItemButton.tsx` created
- [ ] Component accepts required props
- [ ] Remove icon displayed clearly
- [ ] Hover state shows red color
- [ ] Click handler triggers removal
- [ ] Integrates with cart store `removeItem` action
- [ ] Optional confirmation check implemented
- [ ] Loading state during removal
- [ ] Tooltip shows on hover
- [ ] Accessibility features implemented
- [ ] Responsive positioning works
- [ ] Component exports properly

---

## Task 65: Create Remove Confirmation

### Overview
Create the RemoveConfirmModal component that displays an optional confirmation dialog when users attempt to remove items from their cart. This modal is particularly useful for high-value items, items with multiple quantities, or as a configurable safeguard against accidental removals.

### Dependencies
- Task 64: Create Remove Item Button
- Modal/Dialog component library

### Instructions

1. **Create RemoveConfirmModal component file**
   - Create `RemoveConfirmModal.tsx` in `components/storefront/cart/Modals/` directory
   - Set up React functional component structure
   - Import modal/dialog library (Shadcn Dialog, Radix UI, etc.)

2. **Define component props interface**
   - Create `RemoveConfirmModalProps` interface
   - Include `isOpen` prop (boolean)
   - Include `onClose` callback function
   - Include `onConfirm` callback function
   - Include `productName` prop (string)
   - Include `productImage` prop (string - optional)
   - Include `quantity` prop (number)
   - Include `price` prop (number)

3. **Design modal structure**
   - Header with title: "Remove Item?"
   - Body with confirmation message
   - Optional product preview (image, name, price)
   - Footer with Cancel and Remove buttons

4. **Implement confirmation message**
   - Primary message: "Remove {productName} from your cart?"
   - Secondary details: quantity and total value
   - Keep message clear and concise

5. **Add product preview section (optional)**
   - Display product thumbnail
   - Show product name
   - Show quantity and price
   - Provide visual confirmation of item being removed

6. **Style the modal**
   - Use modal library's styling system
   - Apply consistent padding and spacing
   - Ensure modal is centered and responsive
   - Add overlay/backdrop for focus

7. **Implement action buttons**
   - Cancel button (secondary style)
   - Remove button (primary danger style - red)
   - Handle keyboard navigation (Escape to cancel, Enter to confirm)

8. **Add loading state**
   - Show loading spinner on Remove button during removal
   - Disable both buttons while processing
   - Prevent modal close during removal

9. **Implement modal controls**
   - Close on backdrop click (optional)
   - Close on Escape key
   - Prevent close during loading
   - Focus trap within modal

### Modal Layout Structure

```
┌─────────────────────────────────────┐
│  Remove Item?                   [×] │ ← Header
├─────────────────────────────────────┤
│                                     │
│  ┌────────────────────────────┐   │
│  │ Are you sure you want to   │   │
│  │ remove this item from      │   │ ← Body
│  │ your cart?                 │   │
│  │                            │   │
│  │ [Product Preview]          │   │
│  │ Product Name               │   │
│  │ Quantity: 2 × ₨1,299.00   │   │
│  │ Total: ₨2,598.00          │   │
│  └────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [Cancel]        [Remove Item]     │ ← Footer
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| isOpen | boolean | Yes | - | Modal visibility state |
| onClose | function | Yes | - | Close modal callback |
| onConfirm | function | Yes | - | Confirm removal callback |
| productName | string | Yes | - | Product display name |
| productImage | string | No | - | Product thumbnail URL |
| quantity | number | Yes | - | Item quantity |
| price | number | Yes | - | Unit price |
| loading | boolean | No | false | Loading state |

### Modal Styling Specifications

| Element | Styling | Purpose |
|---------|---------|---------|
| Overlay | `bg-black/50 backdrop-blur-sm` | Focus attention |
| Container | `bg-white rounded-lg shadow-xl` | Modal card |
| Width | `max-w-md` | Readable width |
| Padding | `p-6` | Internal spacing |
| Header | `text-lg font-semibold` | Title emphasis |
| Body | `py-4 text-gray-600` | Content area |

### Confirmation Messages

| Message Type | Content | Styling |
|--------------|---------|---------|
| Primary | "Remove {productName} from your cart?" | `text-lg font-semibold` |
| Secondary | "This action cannot be undone." | `text-sm text-gray-500` (if no undo) |
| With Undo | "You can undo this action for 5 seconds." | `text-sm text-gray-500` |
| High Value | "This is a high-value item (₨{price}). Are you sure?" | `text-sm text-orange-600` |

### Product Preview Section

```
┌──────────────────────────────┐
│  ┌────┐                      │
│  │IMG │  Product Name        │
│  └────┘  ₨1,299.00          │
│          Quantity: 2         │
│          Total: ₨2,598.00   │
└──────────────────────────────┘
```

### Button Specifications

| Button | Style | Behavior |
|--------|-------|----------|
| Cancel | `bg-gray-100 text-gray-700 hover:bg-gray-200` | Close modal, no action |
| Remove | `bg-red-600 text-white hover:bg-red-700` | Confirm removal |
| Both | `px-4 py-2 rounded-md font-medium` | Base styling |

### Modal Behavior Flow

```
User Clicks Remove Button
    │
    ├─→ Open modal (isOpen = true)
    │       │
    │       ├─→ Display confirmation
    │       │
    │       ├─→ User clicks Cancel
    │       │       └─→ Close modal (no action)
    │       │
    │       ├─→ User clicks Remove
    │       │       ├─→ Set loading = true
    │       │       ├─→ Call onConfirm()
    │       │       ├─→ Remove item from cart
    │       │       └─→ Close modal
    │       │
    │       └─→ User presses Escape
    │               └─→ Close modal (no action)
    │
    └─→ Modal closes
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Escape | Close modal (cancel) |
| Enter | Confirm removal (if focused) |
| Tab | Navigate between buttons |
| Space | Activate focused button |

### Conditional Confirmation Logic

| Condition | Show Confirmation |
|-----------|-------------------|
| High-value item (>₨10,000) | Yes |
| Quantity > 1 | Yes |
| Configuration enabled | Yes |
| Quick remove mode | No |

### Loading State

```
Remove Button During Loading:

┌──────────────────────┐
│  [spinner] Removing  │ ← Disabled, showing spinner
└──────────────────────┘
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | `role="alertdialog"` |
| Aria Label | `aria-labelledby="dialog-title"` |
| Aria Description | `aria-describedby="dialog-description"` |
| Focus Trap | Keep focus within modal |
| Focus Return | Return focus to trigger after close |
| Backdrop Close | Optional, configurable |

### Responsive Behavior

```
Mobile (< 640px)
├── Width: Full width with margin
├── Padding: p-4
└── Stack buttons vertically

Desktop (≥ 640px)
├── Width: max-w-md
├── Padding: p-6
└── Buttons side by side
```

### Integration with Remove Button

```typescript
// RemoveItemButton usage example
const [showConfirmation, setShowConfirmation] = useState(false);

const handleRemoveClick = () => {
  if (requiresConfirmation) {
    setShowConfirmation(true);
  } else {
    removeItem();
  }
};

const handleConfirmRemove = () => {
  removeItem();
  setShowConfirmation(false);
};
```

### Expected Outcome
- Confirmation modal displays before removal
- Clear, concise confirmation message
- Product preview for context
- Cancel and Remove action buttons
- Keyboard navigation support
- Loading state during removal
- Accessible to screen readers
- Responsive design

### Verification Checklist
- [ ] `frontend/components/storefront/cart/Modals/RemoveConfirmModal.tsx` created
- [ ] Component accepts required props
- [ ] Modal displays when isOpen is true
- [ ] Confirmation message shows product name
- [ ] Product preview section displays correctly
- [ ] Cancel button closes modal without action
- [ ] Remove button calls onConfirm callback
- [ ] Loading state shows during removal
- [ ] Modal closes after successful removal
- [ ] Keyboard navigation works (Escape, Enter, Tab)
- [ ] Accessibility features implemented
- [ ] Responsive on mobile and desktop
- [ ] Component exports properly

---

## Task 66: Create Undo Remove

### Overview
Implement the undo remove functionality that allows users to quickly restore a recently removed cart item. When an item is removed, a toast notification appears with an "Undo" button for 5 seconds, giving users a chance to reverse the action before the removal becomes permanent.

### Dependencies
- Task 64: Create Remove Item Button
- Toast notification library (Sonner, React-Toastify, etc.)
- Cart store state management

### Instructions

1. **Set up toast notification library**
   - Install and configure Sonner or preferred toast library
   - Set up toast container in layout or root component
   - Configure default toast duration and positioning

2. **Create removed items temporary storage**
   - Add `removedItems` array to cart store
   - Store removed item snapshot (id, product, quantity, price, timestamp)
   - Implement cleanup after undo timeout expires

3. **Implement remove with snapshot**
   - Before removing item, create snapshot of item data
   - Store snapshot in temporary storage with timestamp
   - Set 5-second timeout for auto-cleanup
   - Remove item from cart state

4. **Create undo handler function**
   - Create `undoRemove` function in cart store
   - Accept item ID or snapshot reference
   - Restore item to cart from snapshot
   - Remove from temporary storage
   - Dismiss toast notification

5. **Implement toast notification**
   - Show toast immediately after item removal
   - Include message: "{Product name} removed from cart"
   - Add "Undo" button in toast
   - Set toast duration to 5 seconds (configurable)

6. **Style the undo toast**
   - Use library's default styling or customize
   - Ensure "Undo" button is prominent
   - Apply brand colors
   - Make button easily clickable

7. **Implement toast action handler**
   - Connect "Undo" button to `undoRemove` function
   - Pass correct item reference
   - Dismiss toast on undo
   - Show success feedback after undo

8. **Handle edge cases**
   - Multiple items removed quickly (queue management)
   - User leaves page before undo timeout
   - Stock changes during undo period
   - Item already purchased by others (if real-time inventory)

9. **Add confirmation feedback**
   - Show success toast after undo: "Item restored to cart"
   - Update cart totals
   - Scroll to restored item (optional)
   - Focus restored item (optional)

### Undo Remove Flow

```
User Removes Item
    │
    ├─→ Create item snapshot
    │       ├─→ id, product, qty, price, timestamp
    │       └─→ Store in removedItems array
    │
    ├─→ Remove item from cart
    │
    ├─→ Show undo toast
    │       ├─→ Message: "{name} removed"
    │       ├─→ Action: [Undo] button
    │       └─→ Duration: 5 seconds
    │
    ├─→ Start timeout (5 seconds)
    │       │
    │       ├─→ User clicks Undo (before timeout)
    │       │       ├─→ Restore item to cart
    │       │       ├─→ Remove from removedItems
    │       │       ├─→ Dismiss toast
    │       │       └─→ Show "Item restored" toast
    │       │
    │       └─→ Timeout expires (no undo)
    │               ├─→ Remove snapshot from storage
    │               └─→ Removal permanent
    │
    └─→ Update cart totals
```

### Removed Item Snapshot Structure

```typescript
interface RemovedItemSnapshot {
  id: string;
  cartItemId: string;
  product: Product;
  quantity: number;
  price: number;
  timestamp: Date;
  timeoutId: NodeJS.Timeout;
}
```

### Toast Notification Layout

```
┌────────────────────────────────┐
│  Product Name removed from     │
│  cart                          │
│                   [Undo]       │
└────────────────────────────────┘
  ← Auto-dismiss after 5 seconds
```

### Toast Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Duration | 5000ms (5 sec) | Time to undo |
| Position | `bottom-right` or `bottom-center` | Visible but not intrusive |
| Action | "Undo" button | Restore item |
| Dismissible | Yes | Manual close option |
| Queue | Yes | Multiple removals |

### Cart Store Methods

| Method | Parameters | Action |
|--------|------------|--------|
| `removeItemWithUndo` | `itemId` | Remove with snapshot |
| `undoRemove` | `snapshotId` | Restore from snapshot |
| `clearRemovedItem` | `snapshotId` | Cleanup after timeout |
| `clearAllRemovedItems` | - | Cleanup on page leave |

### Undo Handler Implementation

```
Undo Remove Function:

1. Find snapshot in removedItems array
2. Validate snapshot (not expired, still valid)
3. Clear timeout for auto-cleanup
4. Add item back to cart
5. Remove snapshot from storage
6. Update cart totals
7. Dismiss toast
8. Show success toast
```

### Multiple Removals Handling

```
User Removes Multiple Items Quickly:

Item 1 Removed
    ├─→ Toast 1: "Item 1 removed [Undo]"
    └─→ Timeout 1: 5 seconds

Item 2 Removed (2 seconds later)
    ├─→ Toast 2: "Item 2 removed [Undo]"
    └─→ Timeout 2: 5 seconds

Both toasts shown simultaneously or queued
Each has independent undo action
Each has independent timeout
```

### Edge Case Handling

| Scenario | Handling |
|----------|----------|
| User leaves page | Clear all timeouts, cleanup snapshots |
| Stock becomes 0 during undo | Validate stock on restore, show error if unavailable |
| Multiple undos | Support multiple snapshots in queue |
| Undo after timeout | Show error: "Cannot restore this item" |
| Network error on restore | Retry or show error toast |

### Toast Library Integration (Sonner Example)

```typescript
// Usage example structure
import { toast } from 'sonner';

const handleRemove = (itemId: string) => {
  const snapshot = createSnapshot(item);
  removeItem(itemId);
  
  toast.success('Product removed from cart', {
    action: {
      label: 'Undo',
      onClick: () => undoRemove(snapshot.id)
    },
    duration: 5000
  });
};
```

### Success Feedback After Undo

```
┌────────────────────────────────┐
│  ✓ Item restored to cart       │
└────────────────────────────────┘
  ← Auto-dismiss after 2 seconds
```

### Timeout Cleanup Logic

```
Set Timeout on Remove:

timeoutId = setTimeout(() => {
  // After 5 seconds (no undo)
  clearRemovedItem(snapshotId);
  // Snapshot deleted, undo no longer possible
}, 5000);

// Store timeoutId with snapshot
snapshot.timeoutId = timeoutId;

// On undo, clear timeout
if (snapshot.timeoutId) {
  clearTimeout(snapshot.timeoutId);
}
```

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Screen Reader | Announce "Item removed. Undo available." |
| Focus Management | Optional focus to undo button |
| Keyboard | Ensure undo button is keyboard accessible |
| ARIA | `role="status"` for toast |

### Expected Outcome
- Toast notification appears after item removal
- "Undo" button prominently displayed
- 5-second window to undo removal
- Item restored on undo click
- Success feedback after undo
- Multiple removals handled correctly
- Edge cases managed gracefully
- Accessible to all users

### Verification Checklist
- [ ] Toast library configured
- [ ] `removedItems` storage in cart store
- [ ] `removeItemWithUndo` function implemented
- [ ] `undoRemove` function implemented
- [ ] Item snapshot created on removal
- [ ] Toast shows with product name and Undo button
- [ ] Undo button restores item to cart
- [ ] 5-second timeout implemented
- [ ] Snapshot cleanup after timeout
- [ ] Success toast after undo
- [ ] Multiple removals handled
- [ ] Edge cases handled (stock changes, page leave)
- [ ] Accessibility features implemented

---

## Task 67: Create Save for Later

### Overview
Implement the "Save for Later" feature that allows users to move cart items to a wishlist or saved items list instead of removing them entirely. This feature requires user authentication and integrates with the wishlist system to preserve items for future purchase consideration.

### Dependencies
- Task 43: Create Cart Item Card (from Group-C)
- Wishlist system (from SubPhase-08 Wishlist Management)
- User authentication state

### Instructions

1. **Create SaveForLaterButton component**
   - Create `SaveForLaterButton.tsx` in `components/storefront/cart/CartItem/` directory
   - Set up React functional component structure
   - Import necessary icons and hooks

2. **Define component props interface**
   - Create `SaveForLaterButtonProps` interface
   - Include `cartItemId` prop (string)
   - Include `productId` prop (string)
   - Include `productData` prop (product object)
   - Include optional `onSave` callback

3. **Check authentication state**
   - Import authentication hook (useAuth, useSession, etc.)
   - Check if user is logged in
   - Conditionally render or disable button based on auth state

4. **Import icon component**
   - Import Heart or Bookmark icon
   - Use outline version initially
   - Consider filled version for saved state

5. **Implement save for later handler**
   - Create click handler function
   - Check authentication (redirect to login if not authenticated)
   - Add item to wishlist via API or store action
   - Remove item from cart
   - Show success toast notification

6. **Style the button**
   - Create text button with icon
   - Apply subtle styling (not too prominent)
   - Position below or beside quantity selector
   - Show hover state

7. **Integrate with wishlist API/store**
   - Call wishlist add endpoint or store action
   - Pass product ID and relevant data
   - Handle API response (success/error)
   - Update wishlist count if displayed

8. **Handle authentication redirect**
   - When unauthenticated user clicks
   - Save intent (item to save) in session storage
   - Redirect to login page
   - Complete save after successful login
   - Return user to cart page

9. **Add confirmation feedback**
   - Show toast: "{Product name} saved for later"
   - Include link to wishlist in toast (optional)
   - Provide undo option (optional)

10. **Handle edge cases**
    - Item already in wishlist
    - API failure
    - Network error
    - Concurrent save attempts

### Save for Later Flow

```
User Clicks "Save for Later"
    │
    ├─→ Check authentication
    │       │
    │       ├─→ Not authenticated
    │       │       ├─→ Save intent to session
    │       │       ├─→ Redirect to login
    │       │       └─→ Return after login
    │       │
    │       └─→ Authenticated
    │               └─→ Continue
    │
    ├─→ Call wishlist API
    │       │
    │       ├─→ Success
    │       │       ├─→ Add to wishlist
    │       │       ├─→ Remove from cart
    │       │       └─→ Show success toast
    │       │
    │       └─→ Error
    │               ├─→ Item already in wishlist?
    │               │       └─→ Remove from cart only
    │               └─→ Show error toast
    │
    └─→ Update UI
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| cartItemId | string | Yes | - | Cart item identifier |
| productId | string | Yes | - | Product identifier |
| productData | Product | Yes | - | Product details |
| onSave | function | No | - | Custom save callback |
| disabled | boolean | No | false | Disable button |

### Button Styling Specifications

| State | Tailwind Classes | Description |
|-------|------------------|-------------|
| Normal | `text-gray-600 hover:text-blue-600 flex items-center gap-2` | Default state |
| Hover | `underline` | Hover feedback |
| Disabled | `text-gray-400 cursor-not-allowed` | Not available |
| Loading | `opacity-50` | Processing |

### Save for Later Button Layout

```
┌──────────────────────────────────┐
│  ┌───┬────────┬───┐              │
│  │ - │   3    │ + │              │
│  └───┴────────┴───┘              │
│                                   │
│  [♡ Save for Later]               │ ← Save Button
└──────────────────────────────────┘
```

### Authentication Check

```
User Clicks Save for Later
    │
    ├─→ isAuthenticated?
    │       │
    │       ├─→ Yes: Proceed with save
    │       │
    │       └─→ No: Handle unauthenticated
    │               ├─→ Save intent:
    │               │   sessionStorage.setItem('saveIntent', {
    │               │     action: 'saveForLater',
    │               │     cartItemId,
    │               │     productId,
    │               │     returnUrl: '/cart'
    │               │   })
    │               │
    │               ├─→ Show toast: "Please login to save items"
    │               └─→ Redirect to: /login?returnUrl=/cart
    │
    └─→ After login, check and execute saved intent
```

### Wishlist Integration

| Endpoint | Method | Parameters | Response |
|----------|--------|------------|----------|
| `/api/wishlist/add` | POST | `productId`, `userId` | `{ success: boolean, wishlistId: string }` |
| `/api/wishlist/check` | GET | `productId`, `userId` | `{ exists: boolean }` |
| `/api/cart/remove` | DELETE | `cartItemId` | `{ success: boolean }` |

### Success Toast Layout

```
┌────────────────────────────────┐
│  Product Name saved for later  │
│               [View Wishlist]  │
└────────────────────────────────┘
```

### Error Handling

| Error | Message | Action |
|-------|---------|--------|
| Already in wishlist | "Already in your wishlist. Removed from cart." | Remove from cart |
| API failure | "Could not save item. Please try again." | Retry option |
| Network error | "Connection error. Item not saved." | Keep in cart |
| Auth required | "Please login to save items" | Redirect to login |

### Icon Options

| Library | Icon Name | State | Visual |
|---------|-----------|-------|--------|
| Lucide React | `Heart` | Default | Outline heart |
| Lucide React | `HeartFilled` | After save | Filled heart |
| Lucide React | `Bookmark` | Alternative | Bookmark icon |
| Heroicons | `HeartIcon` | Default | Outline heart |

### Button Variants

```
Variant 1: Text + Icon
┌──────────────────────┐
│ ♡ Save for Later     │
└──────────────────────┘

Variant 2: Icon Only (compact)
┌──────┐
│  ♡   │
└──────┘

Variant 3: With Subtext
┌──────────────────────┐
│ ♡ Save for Later     │
│   (Move to wishlist) │
└──────────────────────┘
```

### Undo Save Option (Optional)

```
Save for Later with Undo:

1. Save item to wishlist
2. Remove from cart
3. Show toast: "Saved for later [Undo]"
4. Undo: Restore to cart, remove from wishlist
5. Timeout: 5 seconds
```

### Post-Login Intent Handling

```typescript
// After successful login
useEffect(() => {
  const intent = sessionStorage.getItem('saveIntent');
  if (intent) {
    const data = JSON.parse(intent);
    if (data.action === 'saveForLater') {
      executeSaveForLater(data.productId, data.cartItemId);
      sessionStorage.removeItem('saveIntent');
    }
  }
}, [isAuthenticated]);
```

### Edge Case: Already in Wishlist

```
Save Attempt for Existing Wishlist Item:

1. Check if product already in wishlist
2. If yes:
   - Skip API call to add
   - Just remove from cart
   - Show toast: "Already in your wishlist"
3. If no:
   - Add to wishlist
   - Remove from cart
   - Show success toast
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | `aria-label="Save {productName} for later"` |
| Role | `button` |
| State | `aria-pressed` if toggleable |
| Disabled | `aria-disabled` when not authenticated |

### Expected Outcome
- Save for Later button on each cart item
- Authentication check before save
- Item added to wishlist successfully
- Item removed from cart after save
- Success toast with wishlist link
- Authentication redirect flow works
- Error handling for edge cases
- Accessible to all users

### Verification Checklist
- [ ] `frontend/components/storefront/cart/CartItem/SaveForLaterButton.tsx` created
- [ ] Component accepts required props
- [ ] Button displays with heart/bookmark icon
- [ ] Authentication check implemented
- [ ] Redirects to login if not authenticated
- [ ] Adds item to wishlist via API
- [ ] Removes item from cart after save
- [ ] Success toast displays with product name
- [ ] Optional wishlist link in toast
- [ ] Error handling for API failures
- [ ] Edge case: already in wishlist handled
- [ ] Post-login intent execution works
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 68: Create Update Cart Toast

### Overview
Create standardized toast notifications for cart updates, including quantity changes, item additions, item removals, and validation messages. These toasts provide immediate feedback to users about cart state changes and use consistent styling and positioning.

### Dependencies
- Toast notification library (Sonner, React-Toastify, etc.)
- Cart store actions

### Instructions

1. **Set up toast notification system**
   - Ensure toast library is installed and configured
   - Set up toast provider in app layout
   - Configure default toast settings (duration, position)

2. **Create toast utility functions**
   - Create `cartToastUtils.ts` in `lib/` or `utils/` directory
   - Define toast helper functions for common cart actions
   - Export functions for use throughout cart components

3. **Implement quantity update toast**
   - Show toast when quantity changes
   - Message: "Quantity updated" or "Cart updated"
   - Brief duration (2-3 seconds)
   - Success variant (green checkmark)

4. **Implement item added toast**
   - Show toast when item added to cart
   - Message: "{Product name} added to cart"
   - Include cart icon
   - Action button: "View Cart" (optional)

5. **Implement item removed toast**
   - Already covered in Task 66 (Undo Remove)
   - Message: "{Product name} removed"
   - Include "Undo" action button
   - 5-second duration

6. **Implement validation error toasts**
   - Stock validation failures
   - Quantity constraint violations
   - Message examples:
     - "Only {max} items available"
     - "Minimum quantity is 1"
     - "Out of stock"
   - Warning or error variant (orange/red)

7. **Implement generic cart update toast**
   - For miscellaneous cart updates
   - Message: "Cart updated"
   - Success variant
   - Short duration (2 seconds)

8. **Configure toast positioning**
   - Decide on global position (bottom-right, bottom-center, top-right)
   - Ensure toasts don't overlap critical UI
   - Support multiple toasts (queue or stack)

9. **Implement toast variants**
   - Success: green with checkmark icon
   - Warning: orange with alert icon
   - Error: red with error icon
   - Info: blue with info icon

10. **Add toast dismissal options**
    - Auto-dismiss with timeout
    - Manual dismiss with close button
    - Swipe to dismiss (if supported)

### Toast Types and Messages

| Action | Message | Variant | Duration |
|--------|---------|---------|----------|
| Quantity increased | "Quantity updated" | Success | 2s |
| Quantity decreased | "Quantity updated" | Success | 2s |
| Quantity adjusted (max) | "Only {max} items available" | Warning | 4s |
| Quantity adjusted (min) | "Minimum quantity is 1" | Info | 3s |
| Item added | "{Product} added to cart" | Success | 3s |
| Item removed | "{Product} removed" | Success | 5s (w/ Undo) |
| Item saved | "{Product} saved for later" | Success | 3s |
| Out of stock | "Item is out of stock" | Error | 4s |
| Generic update | "Cart updated" | Success | 2s |

### Toast Utility Functions Structure

```typescript
// cartToastUtils.ts

export const cartToasts = {
  quantityUpdated: () => {
    toast.success('Quantity updated');
  },
  
  itemAdded: (productName: string) => {
    toast.success(`${productName} added to cart`, {
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart')
      }
    });
  },
  
  itemRemoved: (productName: string, onUndo: () => void) => {
    toast.success(`${productName} removed`, {
      action: {
        label: 'Undo',
        onClick: onUndo
      },
      duration: 5000
    });
  },
  
  maxQuantityReached: (maxQty: number) => {
    toast.warning(`Only ${maxQty} items available`);
  },
  
  outOfStock: (productName: string) => {
    toast.error(`${productName} is out of stock`);
  }
};
```

### Toast Positioning Options

| Position | Use Case | Pros | Cons |
|----------|----------|------|------|
| Bottom Right | Desktop default | Doesn't block content | May overlap FABs |
| Bottom Center | Mobile default | Centered, visible | Blocks bottom nav |
| Top Right | Alternative | Traditional | Blocks header actions |
| Top Center | Announcements | Very visible | Intrusive |

### Toast Styling Specifications (Sonner)

| Variant | Background | Icon | Border |
|---------|------------|------|--------|
| Success | `bg-green-50` | ✓ (checkmark) | `border-green-200` |
| Warning | `bg-orange-50` | ⚠ (alert) | `border-orange-200` |
| Error | `bg-red-50` | ✗ (error) | `border-red-200` |
| Info | `bg-blue-50` | ℹ (info) | `border-blue-200` |

### Usage Examples

```typescript
// In QuantitySelector component
const handleQuantityChange = (newQty: number) => {
  updateItemQuantity(itemId, newQty);
  cartToasts.quantityUpdated();
};

// In RemoveItemButton component
const handleRemove = () => {
  const snapshot = createSnapshot(item);
  removeItem(itemId);
  cartToasts.itemRemoved(productName, () => undoRemove(snapshot.id));
};

// In Stock Validation
if (stock < requestedQty) {
  adjustQuantity(itemId, stock);
  cartToasts.maxQuantityReached(stock);
}
```

### Toast Queueing Behavior

```
Multiple Cart Actions in Quick Succession:

Action 1: Add item
    ├─→ Toast 1: "Product A added"

Action 2: Update quantity (1 second later)
    ├─→ Toast 2: "Quantity updated"

Action 3: Remove item (1 second later)
    ├─→ Toast 3: "Product B removed [Undo]"

All toasts shown:
├─→ Stacked vertically or queued
└─→ Each auto-dismisses independently
```

### Responsive Toast Behavior

```
Mobile (< 640px)
├── Position: bottom-center
├── Width: Full width with padding
└── Smaller text and icons

Desktop (≥ 640px)
├── Position: bottom-right
├── Width: max-w-md
└── Standard text and icons
```

### Toast Animation Options

| Animation | Effect | Use Case |
|-----------|--------|----------|
| Slide Up | Slide from bottom | Bottom positioned toasts |
| Slide Down | Slide from top | Top positioned toasts |
| Fade In | Opacity transition | Subtle appearance |
| Scale In | Zoom effect | Attention-grabbing |

### Integration Points

| Component | Toast Trigger | Message |
|-----------|---------------|---------|
| QuantitySelector | Qty change | "Quantity updated" |
| RemoveItemButton | Remove click | "{Product} removed [Undo]" |
| Stock Validation | Adjustment | "Only {max} available" |
| SaveForLaterButton | Save click | "{Product} saved for later" |
| AddToCartButton | Add click | "{Product} added to cart" |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| ARIA Role | `role="status"` or `role="alert"` |
| ARIA Live | `aria-live="polite"` or `"assertive"` |
| Screen Reader | Announce message text |
| Focus Management | Don't steal focus from action |
| Keyboard | Actionable toasts keyboard accessible |

### Expected Outcome
- Consistent toast notifications for all cart actions
- Clear, concise messages
- Appropriate variant styling (success, warning, error)
- Proper positioning (bottom-right/center)
- Auto-dismiss with appropriate durations
- Action buttons for relevant toasts (Undo, View Cart)
- Queue multiple toasts gracefully
- Accessible to all users

### Verification Checklist
- [ ] Toast library configured in app
- [ ] `cartToastUtils.ts` utility file created
- [ ] Quantity update toast implemented
- [ ] Item added toast implemented
- [ ] Item removed toast implemented (with undo)
- [ ] Validation error toasts implemented
- [ ] Generic cart update toast implemented
- [ ] Toast variants styled correctly (success, warning, error)
- [ ] Toast positioning configured
- [ ] Multiple toasts queue or stack properly
- [ ] Action buttons work in toasts
- [ ] Auto-dismiss timing appropriate
- [ ] Accessibility features implemented
- [ ] Responsive behavior tested

---

## Task 69: Create Debounced Quantity

### Overview
Implement debounced quantity updates to optimize API calls and improve performance when users adjust cart item quantities. Instead of triggering an update for every increment/decrement or input change, debouncing delays the API call until the user has stopped adjusting the quantity for a specified period (500ms).

### Dependencies
- Task 55: Create Quantity Selector
- React hooks (useState, useEffect, useCallback)
- Cart store update actions

### Instructions

1. **Create debounce hook or utility**
   - Create `useQuantityDebounce.ts` in `hooks/store/` directory
   - Implement custom React hook for debounced values
   - Or create utility function for debouncing

2. **Define debounce delay**
   - Set delay to 500ms (half second)
   - Allow configuration via props or constant
   - Balance between responsiveness and API efficiency

3. **Implement debounced state**
   - Maintain local state for immediate UI updates
   - Maintain debounced state for API calls
   - Separate display value from persisted value

4. **Create debounce logic**
   - Update local state immediately on user input
   - Set timeout to update store after delay
   - Clear previous timeout on new input (restart timer)
   - Call store action only after delay period with no changes

5. **Handle loading states**
   - Show loading indicator while debounced update pending
   - Optionally disable controls during update
   - Clear indication that update is in progress

6. **Integrate with quantity selector**
   - Apply debouncing to QuantityInput component
   - Optionally apply to Increase/Decrease buttons
   - Ensure immediate visual feedback despite delay

7. **Implement debounce cancellation**
   - Cancel pending update on component unmount
   - Cancel on user leaving cart page
   - Clean up timeout references

8. **Handle rapid changes**
   - User clicking increase button rapidly
   - User typing in input field
   - Only final value sent to API after delay

9. **Add sync indicator (optional)**
   - Show "Syncing..." or spinner during debounce period
   - Clear indicator after successful update
   - Show check mark on success

### Debounce Flow

```
User Changes Quantity
    │
    ├─→ Update local state (immediate)
    │       └─→ UI updates instantly
    │
    ├─→ Clear existing timeout (if any)
    │       └─→ Cancel previous pending update
    │
    ├─→ Start new timeout (500ms)
    │       │
    │       ├─→ User makes another change
    │       │       └─→ Restart: clear + new timeout
    │       │
    │       └─→ 500ms passes (no new changes)
    │               ├─→ Call cart store action
    │               ├─→ Update cart state
    │               ├─→ Call API to persist
    │               └─→ Show success toast (optional)
    │
    └─→ Complete: quantity synced
```

### Debounce Hook Structure

```typescript
// useQuantityDebounce.ts

export function useQuantityDebounce(
  initialValue: number,
  callback: (value: number) => void,
  delay: number = 500
) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      callback(value);
      setIsPending(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, callback]);

  return { value, setValue, debouncedValue, isPending };
}
```

### Usage in QuantitySelector

```typescript
// QuantitySelector component

const { 
  value, 
  setValue, 
  debouncedValue, 
  isPending 
} = useQuantityDebounce(
  currentQuantity,
  (newQty) => updateItemQuantity(itemId, newQty),
  500
);

// Display `value` in UI (immediate)
// `debouncedValue` triggers API call
// `isPending` shows loading state
```

### Debounce Timing Diagram

```
Time: 0ms ────────> 500ms ────────> 1000ms ────────>

User Input:
├─ Click + (0ms)
├─ Click + (200ms)
├─ Click + (400ms)
└─ [No more input]

Timeout:
├─ Set timeout (0ms)
├─ Clear, reset (200ms)
├─ Clear, reset (400ms)
└─ Execute API call (900ms)

API Calls: 0 ──────────────────────> 1 (at 900ms)
```

### Local vs Debounced State

| State | Updates | Purpose |
|-------|---------|---------|
| Local (`value`) | Immediately | UI display, instant feedback |
| Debounced (`debouncedValue`) | After 500ms | API calls, cart persistence |
| Pending (`isPending`) | During delay | Loading indicator |

### Loading Indicator During Debounce

```
┌──────┬────────────┬──────┐
│  [-] │     5      │ [+]  │  [⟳] ← Syncing indicator
└──────┴────────────┴──────┘

or

┌──────┬────────────┬──────┐
│  [-] │     5      │ [+]  │
└──────┴────────────┴──────┘
        Syncing... ← Text indicator
```

### Optimization Benefits

| Scenario | Without Debounce | With Debounce |
|----------|------------------|---------------|
| 5 rapid clicks | 5 API calls | 1 API call |
| Typing "12" | 2 API calls | 1 API call |
| 10 adjustments | 10 API calls | 1 API call |

### Edge Cases to Handle

| Case | Handling |
|------|----------|
| Component unmounts | Clear timeout, don't call API |
| User leaves page | Clear all pending timeouts |
| Value equals current | Skip API call (no change) |
| Validation fails | Revert to previous value |
| Network error | Retry or show error |

### Alternative: Debounce Only on Input

```
Strategy: Immediate buttons, debounced input

Increase/Decrease Buttons:
└─→ Update immediately (no debounce)

Quantity Input Field:
└─→ Debounce by 500ms
```

### Cleanup on Unmount

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    // Debounced update
  }, delay);

  return () => {
    clearTimeout(timer); // Cleanup on unmount
  };
}, [value]);
```

### Success Feedback After Sync

```
Debounced Update Complete:

Option 1: Subtle check mark
┌──────┬────────────┬──────┐
│  [-] │     5      │ [+]  │  [✓] ← Success indicator
└──────┴────────────┴──────┘

Option 2: Toast notification
└─→ "Cart updated" (2s duration)

Option 3: No feedback (silent update)
```

### Integration with Cart Store

```typescript
// Cart store action

const updateItemQuantity = async (itemId: string, quantity: number) => {
  // 1. Update local state (optimistic)
  updateLocalState(itemId, quantity);
  
  // 2. Call API to persist
  try {
    await api.cart.updateQuantity(itemId, quantity);
    // Success
  } catch (error) {
    // Revert local state on error
    revertLocalState(itemId);
    toast.error('Failed to update quantity');
  }
};
```

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Screen Reader | Announce "Updating quantity" when pending |
| Loading State | `aria-busy="true"` during debounce |
| Disabled State | Optionally disable during update |

### Expected Outcome
- Quantity changes update UI immediately
- API calls debounced by 500ms
- Multiple rapid changes result in single API call
- Loading indicator during debounce period
- Successful sync after delay
- Cleanup on component unmount
- Optimized performance and reduced server load

### Verification Checklist
- [ ] Debounce hook or utility created
- [ ] 500ms delay configured
- [ ] Local state updates immediately
- [ ] Debounced state updates after delay
- [ ] API call only made after delay period
- [ ] Multiple rapid changes coalesce to single call
- [ ] Loading/syncing indicator shows during delay
- [ ] Timeout cleanup on unmount
- [ ] Edge cases handled (validation, errors)
- [ ] Integration with cart store completed
- [ ] Accessibility features implemented
- [ ] Performance improvement verified

---

## Task 70: Verify Quantity Management

### Overview
Perform comprehensive verification of all quantity management functionality to ensure all features work correctly individually and together. This includes testing quantity selector controls, stock validation, remove functionality, save for later, toasts, and debouncing across various scenarios and edge cases.

### Dependencies
- All previous tasks in Group-D (Tasks 55-69)
- Cart page implementation
- Test environment

### Instructions

1. **Create verification checklist**
   - List all quantity management features
   - Define test scenarios for each feature
   - Prepare test data (products with various stock levels)

2. **Test quantity selector basic functionality**
   - Verify decrease button works
   - Verify increase button works
   - Verify direct input accepts valid numbers
   - Verify all buttons and input are accessible

3. **Test minimum quantity constraints**
   - Verify decrease disabled at quantity = 1
   - Verify input clamps to minimum
   - Verify zero input prompts removal
   - Verify negative input prevented

4. **Test maximum quantity constraints**
   - Verify increase disabled at max stock
   - Verify input clamps to maximum stock
   - Verify max quantity tooltip shows
   - Verify proper feedback when limit reached

5. **Test stock validation**
   - Verify validation on add to cart
   - Verify validation on quantity change
   - Verify validation on page load
   - Verify real-time stock updates (if applicable)
   - Verify auto-adjustment when stock decreases

6. **Test low stock warning**
   - Verify warning shows when stock ≤ threshold
   - Verify warning disappears when stock increases
   - Verify urgent styling for very low stock (1-2)
   - Verify no warning when stock sufficient

7. **Test out of stock alert**
   - Verify alert shows when stock = 0
   - Verify quantity selector disabled
   - Verify remove and save for later buttons work
   - Verify alert replaces quantity selector

8. **Test remove item functionality**
   - Verify remove button removes item
   - Verify optional confirmation modal (if enabled)
   - Verify cart updates after removal
   - Verify totals recalculate correctly

9. **Test undo remove functionality**
   - Verify toast appears with Undo button
   - Verify Undo restores item within 5 seconds
   - Verify timeout makes removal permanent
   - Verify multiple removals queue correctly

10. **Test save for later functionality**
    - Verify authentication check
    - Verify redirect to login if not authenticated
    - Verify item added to wishlist
    - Verify item removed from cart
    - Verify success toast displays

11. **Test toast notifications**
    - Verify quantity update toasts
    - Verify item removed toasts
    - Verify validation error toasts
    - Verify save for later toasts
    - Verify toast positioning and styling

12. **Test debounced quantity updates**
    - Verify rapid changes coalesce
    - Verify single API call after delay
    - Verify loading indicator during debounce
    - Verify immediate UI feedback

13. **Test edge cases**
    - Multiple items with different stock levels
    - Concurrent quantity changes
    - Network errors during updates
    - Page refresh during pending updates
    - Browser back/forward navigation

14. **Test responsive behavior**
    - Verify mobile layout (< 640px)
    - Verify tablet layout (640px - 1024px)
    - Verify desktop layout (> 1024px)
    - Verify touch interactions on mobile

15. **Test accessibility**
    - Verify keyboard navigation works
    - Verify screen reader announcements
    - Verify focus management
    - Verify ARIA attributes correct
    - Verify color contrast ratios

16. **Document test results**
    - Note any failures or issues
    - Document unexpected behaviors
    - List items needing fixes
    - Provide recommendations for improvements

### Verification Checklist

#### Quantity Selector
- [ ] Decrease button decreases quantity by 1
- [ ] Increase button increases quantity by 1
- [ ] Quantity input accepts numeric input
- [ ] Input validates on blur
- [ ] Quantity updates cart state
- [ ] Visual feedback on button clicks
- [ ] Bordered group styling applied
- [ ] Buttons have proper hover states

#### Minimum Quantity
- [ ] Decrease disabled when quantity = 1
- [ ] Input clamps to minimum (1)
- [ ] Zero input prompts removal
- [ ] Negative input prevented
- [ ] Feedback toast when clamped
- [ ] Min quantity constraint enforced

#### Maximum Quantity
- [ ] Increase disabled when quantity = max stock
- [ ] Input clamps to maximum stock
- [ ] Tooltip shows "Max available: X"
- [ ] Feedback toast when clamped
- [ ] Max quantity constraint enforced

#### Stock Validation
- [ ] Validates on add to cart
- [ ] Validates on quantity change
- [ ] Validates on cart page load
- [ ] Auto-adjusts when stock decreases
- [ ] Shows notification on adjustment
- [ ] Handles validation errors gracefully

#### Low Stock Warning
- [ ] Warning shows when stock ≤ 5
- [ ] Warning has orange styling (stock 3-5)
- [ ] Warning has red styling (stock 1-2)
- [ ] Warning disappears when stock sufficient
- [ ] Positioned below quantity selector
- [ ] Accessible to screen readers

#### Out of Stock Alert
- [ ] Alert shows when stock = 0
- [ ] Quantity selector disabled/hidden
- [ ] Red error styling applied
- [ ] Remove button functional
- [ ] Save for Later button functional
- [ ] Alert positioned prominently

#### Remove Item
- [ ] Remove button visible
- [ ] Click triggers removal
- [ ] Optional confirmation modal works (if enabled)
- [ ] Item removed from cart
- [ ] Totals update correctly
- [ ] Undo toast appears

#### Undo Remove
- [ ] Toast shows with Undo button
- [ ] Undo restores item within 5 seconds
- [ ] Timeout makes removal permanent
- [ ] Multiple removals handled
- [ ] Success toast after undo
- [ ] Cart state correct after undo

#### Save for Later
- [ ] Button visible (if authenticated)
- [ ] Authentication check works
- [ ] Redirects to login if not authenticated
- [ ] Item added to wishlist
- [ ] Item removed from cart
- [ ] Success toast displays
- [ ] Post-login intent execution works

#### Toast Notifications
- [ ] Quantity update toast shows
- [ ] Item removed toast shows (with Undo)
- [ ] Validation error toasts show
- [ ] Save for later toast shows
- [ ] Toasts have correct styling (success, warning, error)
- [ ] Toasts positioned correctly
- [ ] Multiple toasts queue/stack properly
- [ ] Auto-dismiss timing appropriate

#### Debounced Quantity
- [ ] Rapid changes coalesce to single update
- [ ] 500ms delay before API call
- [ ] Loading indicator during debounce
- [ ] Immediate UI feedback
- [ ] Cleanup on unmount
- [ ] Performance improvement verified

#### Edge Cases
- [ ] Multiple items with varied stock levels
- [ ] Concurrent quantity changes
- [ ] Network errors handled
- [ ] Page refresh during pending updates
- [ ] Browser back/forward navigation
- [ ] Component unmount during debounce

#### Responsive Design
- [ ] Mobile layout works (< 640px)
- [ ] Tablet layout works (640px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Touch interactions on mobile
- [ ] Elements positioned correctly on all sizes

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Screen reader announcements correct
- [ ] ARIA attributes present and correct
- [ ] Focus visible on all interactive elements
- [ ] Color contrast sufficient (4.5:1+)
- [ ] Functionality doesn't rely on color alone

### Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Basic quantity increase | Click + button 3 times | Quantity increases to 4, cart updates |
| Basic quantity decrease | Click - button 2 times | Quantity decreases by 2, cart updates |
| Max stock limit | Increase quantity to max stock | + button disables, tooltip shows |
| Min quantity limit | Decrease quantity to 1 | - button disables |
| Input validation | Type "10" in input, blur | If max < 10, clamps to max, shows toast |
| Remove item | Click remove button | Item removed, undo toast shows |
| Undo remove | Click Undo within 5s | Item restored to cart |
| Save for later (authenticated) | Click Save for Later | Item in wishlist, removed from cart |
| Save for later (unauthenticated) | Click Save for Later | Redirects to login |
| Low stock warning | Product with stock = 3 | Warning shows below selector |
| Out of stock | Product with stock = 0 | Alert shows, selector disabled |
| Debounced updates | Click + button 5 times rapidly | UI updates immediately, 1 API call after 500ms |

### Bug Reporting Template

```markdown
## Bug Report

**Feature:** [Feature name]
**Severity:** [Low / Medium / High / Critical]
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happens]
**Screenshots:** [If applicable]
**Environment:** [Browser, device, etc.]
**Additional Notes:** [Any other relevant information]
```

### Expected Outcome
- All quantity management features verified
- Test checklist completed
- All features working as expected
- Edge cases handled correctly
- Responsive design verified
- Accessibility confirmed
- Any bugs documented
- System ready for production

### Verification Checklist
- [ ] Verification plan created
- [ ] Test environment prepared
- [ ] Test data created (products with various stock levels)
- [ ] All basic functionality tests passed
- [ ] All constraint tests passed
- [ ] All validation tests passed
- [ ] All warning/alert tests passed
- [ ] All removal tests passed
- [ ] All save for later tests passed
- [ ] All toast notification tests passed
- [ ] All debounce tests passed
- [ ] All edge case tests passed
- [ ] All responsive design tests passed
- [ ] All accessibility tests passed
- [ ] Test results documented
- [ ] Bugs reported (if any)
- [ ] Fixes verified (if bugs found)
- [ ] Final approval obtained

---

## Summary

This document completed the cart item management functionality with removal features, save for later option, toast notifications, debounced updates, and comprehensive verification. All quantity management features are now fully implemented and tested.

### Completed Tasks
1. ✓ Created OutOfStockAlert for unavailable items
2. ✓ Created RemoveItemButton for cart item deletion
3. ✓ Created RemoveConfirmModal for optional confirmation
4. ✓ Implemented Undo Remove with 5-second window
5. ✓ Created Save for Later with wishlist integration
6. ✓ Implemented Update Cart Toast notifications
7. ✓ Created Debounced Quantity updates (500ms)
8. ✓ Verified all Quantity Management functionality

### Group D Complete
All cart item management functionality is now complete, including:
- Quantity selector with controls
- Stock validation and warnings
- Item removal with undo
- Save for later feature
- Toast notifications
- Optimized debounced updates
- Comprehensive verification

Proceed to the next group to continue with cart features.
