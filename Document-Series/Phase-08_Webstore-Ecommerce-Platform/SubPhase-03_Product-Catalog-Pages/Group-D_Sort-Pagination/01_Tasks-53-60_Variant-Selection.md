# Tasks 53-60: Product Variant Selection

> **Phase:** 08 - Webstore & E-Commerce Platform | **SubPhase:** 03 - Product Catalog Pages  
> **Group:** D - Variant & Cart Actions | **Document:** 01 of 02

---

## Overview

Implement variant selection (size, color) on product cards for streamlined shopping experience.

### Tasks | Est. Time: 4 hours

| # | Task | Time |
|---|------|------|
| 53 | Variant Selector Container | 20m |
| 54 | Variant Type Component | 30m |
| 55 | Size Variant Selector | 35m |
| 56 | Color Variant Selector | 35m |
| 57 | Variant Availability Check | 30m |
| 58 | Selected Variant Display | 25m |
| 59 | Variant Selection Logic | 45m |
| 60 | Verify Selection Flow | 20m |

---

## Task 53: Variant Selector Container

### Overview
Main container for variant selection UI on product cards. Shows only when product has variants.

### Dependencies
- Product Card Component (Group B)
- Product data with variants

### Instructions

1. **Create component**: `components/storefront/catalog/ProductCard/VariantSelector.tsx`
2. **Define props**: variants array, selectedVariant ID, onVariantChange callback
3. **Implement layout**: Flex layout, positioned below product image/title
4. **Conditional rendering**: Show only if variants exist
5. **Group variants**: Group by type (size, color), render each type
6. **Style**: Subtle border/background, responsive padding
7. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### Component Structure
```
Product Card
├── Image
├── Name & Price
├── Variant Selector    ← This component
│   ├── Size: S M L XL
│   └── Color: ● ● ● ●
└── Add to Cart
```

### Props & Data

| Prop | Type | Required |
|------|------|----------|
| variants | VariantGroup[] | Yes |
| selectedVariant | string \| null | No |
| onVariantChange | (id: string) => void | Yes |

```
VariantGroup { type, label, options: VariantOption[] }
VariantOption { id, value, available, price_modifier }
```

### Expected Outcome
✓ Container displays when variants present  
✓ Groups variants by type  
✓ Responsive layout  
✓ Keyboard accessible

---

## Task 54: Variant Type Component

### Overview
Reusable component for single variant type (Size OR Color) with selection state.

### Dependencies
- Task 53 (Container)

### Instructions

1. **Create**: `VariantType.tsx` in same directory
2. **Props**: type, label, options, selected, onChange
3. **Label section**: Display type name + selected value ("Size: M")
4. **Options container**: Horizontal layout, flex-wrap, gap spacing
5. **Selection state**: Highlight selected option visually
6. **Disabled state**: Gray out unavailable, prevent selection
7. **Styling**: 14px font, theme colors, spacing
8. **Helper text**: Optional size guide link, availability messages

### Visual States

| State | Indicator |
|-------|-----------|
| Default | Border, white bg |
| Selected | Primary color bg, white text |
| Hover | Light bg color |
| Disabled | Gray, line-through |

### Expected Outcome
✓ Displays variant type with options  
✓ Shows selection state  
✓ Handles disabled options  
✓ Reusable for any type

---

## Task 55: Size Variant Selector

### Overview
Specialized component for size selection with size guide and stock indicators.

### Dependencies
- Task 54 (Variant Type)

### Instructions

1. **Create**: `SizeSelector.tsx`, extends/uses VariantType
2. **Support formats**: Letters (XS-XXL), Numbers (6-14), Mixed
3. **Button grid**: 2-4 cols mobile, 5-6 desktop, min 44x44px touch
4. **Size guide**: Link to size chart, icon next to label
5. **Style buttons**: Border default, filled when selected, strikethrough disabled
6. **Stock indicators**: "Only X left" for low stock (1-10 units)
7. **Keyboard**: Arrow keys navigate, Enter/Space select
8. **Handle unavailable**: Disable, tooltip, suggest alternatives

### Size Formats

| Product | Format | Example |
|---------|--------|---------|
| Apparel | Letters | XS, S, M, L, XL |
| Shoes | Numbers | 6, 7, 8, 9, 10 |
| Kids | Age | 2-3Y, 110cm |

### Button States

| State | BG | Border | Text |
|-------|----|----|------|
| Default | White | Gray | Black |
| Hover | Light gray | Dark gray | Black |
| Selected | Primary | Primary | White |
| Disabled | Light gray | Light gray | Gray strikethrough |

### Stock Display

| Stock | Message |
|-------|---------|
| 0 | Out of stock (disabled) |
| 1-3 | "Only X left" (red) |
| 4-10 | Low stock (orange) |
| 11+ | (No message) |

### Expected Outcome
✓ Size buttons displayed  
✓ Size guide link works  
✓ Stock indicators accurate  
✓ Touch targets adequate

---

## Task 56: Color Variant Selector

### Overview
Visual color swatch selector with swatches, tooltips, and pattern support.

### Dependencies
- Task 54 (Variant Type)

### Instructions

1. **Create**: `ColorSelector.tsx`, swatch-based interface
2. **Color data**: name, hex code, optional image URL, availability
3. **Swatch display**: Circular/square, 32-40px, border for light colors
4. **Selection indicator**: Checkmark icon or thick border on selected
5. **Pattern support**: Display image in swatch, fallback to solid
6. **Layout**: 6-8 swatches per row, responsive, 8px gap
7. **Tooltips**: Show color name on hover
8. **Unavailable**: Diagonal line, 40% opacity, tooltip

### Swatch Structure
```
Color: Navy Blue
● ● ● ● ● ●
  ↑
Selected (checkmark)
```

### Swatch States

| State | Border | Icon | Scale |
|-------|--------|------|-------|
| Default | 2px light gray | None | 1.0 |
| Hover | 2px dark gray | None | 1.1 |
| Selected | 3px black | Checkmark | 1.0 |
| Disabled | 2px gray + overlay | Slash | 1.0 |

### Data Format
```
ColorVariant {
  id, name, hex, image?, available, stock
}
```

### Expected Outcome
✓ Color swatches display  
✓ Selection indicated  
✓ Tooltips show names  
✓ Patterns load

---

## Task 57: Variant Availability Check

### Overview
Real-time availability checking ensuring only valid, in-stock combinations selectable.

### Dependencies
- Task 59 (Selection Logic)
- Product API

### Instructions

1. **Create utility**: `utils/variants/checkAvailability.ts`
2. **Stock validation**: Check stock count, reserved items, cart items
3. **Minimum rules**: Default 1, wholesale 5+, bundles
4. **Maximum limits**: Stock-based, per-customer, per-order, category
5. **Validation response**: success, valid quantity, error message
6. **Business rules**: Wholesale thresholds, bulk discounts, promotional limits
7. **Real-time**: Check on selection change, re-validate before cart add
8. **Edge cases**: Pre-orders, made-to-order, digital products

### Functions

| Function | Returns |
|----------|---------|
| isVariantAvailable(variantId) | boolean |
| getCombinationStock(variants[]) | number |
| getAvailableOptions(selected) | string[] |
| checkInventoryStatus(variantId) | StockStatus |

### Stock Status Types
```
"in_stock" | "low_stock" | "out_of_stock" | "pre_order"
```

### Availability Matrix
```
     Red  Blue Green
S    ✓    ✓    ✗
M    ✓    ✓    ✓
L    ✗    ✓    ✓
```

### Cache Strategy

| Data | Duration | Invalidation |
|------|----------|--------------|
| Stock levels | 2 min | On purchase |
| Availability matrix | 5 min | On restock |

### Expected Outcome
✓ Real-time checks working  
✓ Invalid combos disabled  
✓ Stock accurate  
✓ Performant

---

## Task 58: Selected Variant Display

### Overview
Display component showing current selections before adding to cart.

### Dependencies
- Task 53 (Container)
- Task 59 (Logic)

### Instructions

1. **Create**: `SelectedVariantDisplay.tsx`
2. **Format options**: Compact text ("M · Blue"), detailed multi-line, visual with icons
3. **Text display**: "Size: M | Color: Blue" or multi-line
4. **Visual indicators**: Color swatch, size badge
5. **Price adjustments**: Show base + modifier = total
6. **Reset function**: "Clear selection" option
7. **Styling**: Subtle background, above add to cart button
8. **Validation indicator**: Green check (valid), warning (incomplete), error (invalid)

### Display Formats
```
Compact: Selected: M · Navy

Detailed:
Size: Medium
Color: Navy Blue ●
Price: ₨2,499

Visual:
[M] ● Navy ₨2,499
   ✓ Ready to add
```

### Price Display

| Scenario | Display |
|----------|---------|
| No modifier | ₨2,499 |
| Positive | ₨2,499 + ₨200 = ₨2,699 |
| Negative | ₨2,499 - ₨100 = ₨2,399 |

### Validation States

| State | Icon | Message |
|-------|------|---------|
| Complete | Green check | "Ready to add" |
| Incomplete | Warning | "Select size and color" |
| Invalid | Error | "Combination unavailable" |

### Expected Outcome
✓ Selections displayed  
✓ Price shown correctly  
✓ Validation visible  
✓ Reset works

---

## Task 59: Implement Variant Selection Logic

### Overview
Core logic managing selection state, validations, and coordination.

### Dependencies
- Tasks 53-58 (All UI components)

### Instructions

1. **Create hook**: `hooks/store/useVariantSelection.ts`
2. **State structure**: selectedVariants object, availableOptions array, loading/error, validation
3. **Selection handler**: Update variant, validate combination, update options, trigger callbacks
4. **Validation**: Check required fields, verify combination, check stock
5. **Dependency checking**: Size change updates colors, color change updates sizes
6. **Price calculation**: Base + modifiers + promotions = final
7. **Reset**: Clear all selections or reset to default
8. **Error handling**: Invalid combo, out of stock, API failures

### Hook API
```
const {
  selectedVariants,
  availableOptions,
  isValid,
  variantPrice,
  selectVariant,
  resetSelection,
  error
} = useVariantSelection(productId)
```

### State Structure
```
{
  selectedVariants: { size: "M", color: "blue" },
  availableOptions: { size: ["S","M","L"], color: ["blue","red"] },
  isValid: true,
  variantPrice: 2499
}
```

### Selection Flow
```
Click Size M
→ Update selectedVariants.size
→ Check available colors for M
→ Update availableOptions.color
→ Validate selection
→ Calculate price
→ Update UI
```

### Validation Rules

| Rule | Check | Error |
|------|-------|-------|
| Required | All selected | "Select size and color" |
| Exists | In product data | "Combination unavailable" |
| Stock | > 0 units | "Out of stock" |

### Price Calculation
```
Base: ₨2,499
+ Size (XL): ₨100
+ Color (Premium): ₨200
= Total: ₨2,799
```

### Expected Outcome
✓ State managed correctly  
✓ Validation works  
✓ Price accurate  
✓ Dependencies update

---

## Task 60: Verify Variant Selection Flow

### Overview
Comprehensive testing of entire variant system.

### Dependencies
- Tasks 53-59 (All components)

### Instructions

1. **Basic flow**: Select size → verify feedback → select color → verify valid
2. **Availability**: Select out-of-stock → verify disabled colors
3. **Price**: Verify base price → select with modifier → verify updated
4. **Validation**: Test incomplete, invalid, out-of-stock selections
5. **Reset**: Make selections → clear → verify default state
6. **Responsive**: Test mobile, tablet, desktop viewports + touch
7. **Keyboard**: Tab through, Enter/Space select, arrows navigate
8. **Errors**: API failure, network timeout, invalid data

### Test Scenarios

| Scenario | Expected |
|----------|----------|
| M → Blue → Add | Success |
| M → Shows valid colors | Filtered |
| XL → Green (unavailable) | Green disabled |
| Select → Clear → Reselect | Clean state |

### Validation Tests

| Input | Output |
|-------|--------|
| Click add (no selection) | "Select size and color" |
| Size only | "Select color" |
| XL + Green (invalid) | "Unavailable" |
| M + Blue | Allow add to cart |

### Price Tests

| Base | Size | Color | Total |
|------|------|-------|-------|
| ₨2,499 | S (+₨0) | Red (+₨0) | ₨2,499 |
| ₨2,499 | XL (+₨200) | Blue (+₨0) | ₨2,699 |

### Responsive Testing

| Viewport | Check |
|----------|-------|
| Mobile (375px) | 2-3 sizes per row |
| Mobile | 6-7 colors per row |
| Desktop (1280px) | Compact layout |

### Accessibility

| Test | Expected |
|------|----------|
| Tab through all | All reachable |
| Screen reader | Proper labels |
| Focus visible | Clear rings |

### Performance

| Metric | Target |
|--------|--------|
| Selection response | < 100ms |
| Price update | < 50ms |
| API call | < 500ms |

### Expected Outcome
✓ All features working  
✓ Smooth UX  
✓ No errors  
✓ Accessible  
✓ Performant

---

## Summary

### Components Created
- Variant Selector Container
- Variant Type Component
- Size Variant Selector
- Color Variant Selector
- Selected Variant Display

### Logic Implemented
- Availability checking
- Selection state management
- Price calculation
- Validation logic

### Key Features
- Visual size/color selection
- Real-time availability
- Stock indicators
- Price modifiers
- Responsive design
- Keyboard accessible

**Next:** [02_Tasks-61-68_Quantity-Cart-Wishlist.md](02_Tasks-61-68_Quantity-Cart-Wishlist.md)
