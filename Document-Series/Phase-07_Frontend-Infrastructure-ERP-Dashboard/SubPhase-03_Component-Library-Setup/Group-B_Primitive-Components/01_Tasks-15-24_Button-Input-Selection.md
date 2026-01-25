# Tasks 15-24: Button, Input, and Selection Components

> **Phase:** 07 - Frontend Infrastructure ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** B - Primitive Components  
> **Document:** 01 of 04  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-32_Display-Primitives.md](02_Tasks-25-32_Display-Primitives.md)

---

## Document Overview

This document covers the installation and customization of core input and interactive components for the ERP dashboard. These primitive components form the foundation for user input throughout the application, including buttons, text inputs, select dropdowns, checkboxes, and radio groups.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Install Button Component | Low | 10 min |
| 16 | Customize Button Variants | Medium | 30 min |
| 17 | Create ButtonGroup Component | Medium | 25 min |
| 18 | Install Input Component | Low | 10 min |
| 19 | Customize Input Variants | Medium | 35 min |
| 20 | Install Textarea Component | Low | 10 min |
| 21 | Install Select Component | Low | 10 min |
| 22 | Customize Select Component | High | 40 min |
| 23 | Install Checkbox Component | Low | 10 min |
| 24 | Install Radio Group Component | Low | 10 min |

---

## Task 15: Install Button Component

### Overview
Install the base Button component from shadcn/ui, which provides a foundational interactive element for user actions throughout the ERP dashboard. The button component supports various visual variants and sizes to accommodate different UI contexts.

### Dependencies
- Next.js project initialized
- Tailwind CSS configured
- shadcn/ui CLI installed
- Component library structure created

### Instructions

1. **Verify shadcn/ui configuration**
   - Ensure components.json exists in project root
   - Check that component aliases are properly configured
   - Verify Tailwind CSS integration is complete

2. **Install Button component via CLI**
   - Navigate to frontend project directory
   - Execute shadcn/ui add command for button component
   - CLI will download component files automatically

3. **Verify component installation**
   - Check that button.tsx appears in components/ui directory
   - Verify all necessary imports are present
   - Ensure component exports are correct

4. **Review default variants**
   - Examine default button styles
   - Check available variant options (default, destructive, outline, secondary, ghost, link)
   - Review size options (default, sm, lg, icon)

5. **Test basic button rendering**
   - Import Button in a test page
   - Render different variants
   - Verify styling and responsiveness

### Button Component Structure

```
┌───────────────────────────────────────────────┐
│            Button Component                   │
├───────────────────────────────────────────────┤
│ Base Variants:                                │
│  • default   - Primary action button          │
│  • destructive - Dangerous/delete actions     │
│  • outline   - Secondary outline style        │
│  • secondary - Alternative secondary style    │
│  • ghost     - Minimal styling                │
│  • link      - Link-style button              │
│                                               │
│ Sizes:                                        │
│  • default   - Standard size                  │
│  • sm        - Small size                     │
│  • lg        - Large size                     │
│  • icon      - Square icon button             │
└───────────────────────────────────────────────┘
```

### Button Variant Use Cases

| Variant | Primary Use | Example Context |
|---------|-------------|-----------------|
| default | Primary actions | Save, Submit, Create |
| destructive | Delete operations | Remove Item, Delete Record |
| outline | Secondary actions | Cancel, Back, Close |
| secondary | Alternative actions | Duplicate, Export |
| ghost | Tertiary actions | More Options, Toggle |
| link | Navigation | View Details, Learn More |

### Expected Outcome
- Button component installed successfully
- All default variants available
- Component ready for customization
- Foundation for all interactive buttons

### Verification Checklist
- [ ] Button component file exists in components/ui
- [ ] Component imports without errors
- [ ] All default variants render correctly
- [ ] All size options work properly
- [ ] TypeScript types are correct
- [ ] Component follows project conventions

---

## Task 16: Customize Button Variants

### Overview
Extend the base Button component with custom variants and features specific to ERP needs, including loading states, icon-only buttons with tooltips, custom sizes, and specialized action buttons for common ERP operations.

### Dependencies
- Task 15: Install Button Component

### Instructions

1. **Add loading state variant**
   - Create loading prop for button component
   - Add spinner icon component integration
   - Disable button interaction during loading
   - Show loading indicator replacing or alongside text

2. **Implement disabled button styling**
   - Enhance disabled state visual feedback
   - Add cursor-not-allowed styling
   - Reduce opacity for disabled state
   - Ensure accessibility standards

3. **Create icon-only button support**
   - Add icon prop for leading icons
   - Add iconPosition prop (left, right, only)
   - Handle spacing between icon and text
   - Support icon-only buttons with proper padding

4. **Add custom size variants**
   - Create xs (extra small) size option
   - Create xl (extra large) size option
   - Define appropriate padding and font sizes
   - Maintain consistent visual hierarchy

5. **Create specialized ERP button variants**
   - Add 'success' variant for positive actions
   - Add 'warning' variant for cautionary actions
   - Add 'info' variant for informational actions
   - Style to match ERP design system colors

6. **Implement button group compatibility**
   - Add groupPosition prop (left, middle, right, none)
   - Adjust border radius for grouped buttons
   - Remove duplicate borders in groups
   - Maintain visual continuity

7. **Add tooltip integration**
   - Support tooltip prop for icon-only buttons
   - Integrate with Tooltip component
   - Auto-show tooltip on hover
   - Handle accessibility labels

8. **Create button helper components**
   - Create SaveButton with loading state
   - Create DeleteButton with confirmation
   - Create RefreshButton with icon
   - Create ActionButton for common patterns

### Custom Button Variants

```
┌───────────────────────────────────────────────┐
│         Extended Button Variants              │
├───────────────────────────────────────────────┤
│ ERP-Specific Variants:                        │
│  • success   - Positive actions               │
│  • warning   - Cautionary actions             │
│  • info      - Informational actions          │
│                                               │
│ Extended Sizes:                               │
│  • xs        - Extra small (compact UI)       │
│  • xl        - Extra large (hero actions)     │
│                                               │
│ State Extensions:                             │
│  • loading   - Shows spinner, disabled        │
│  • iconOnly  - Icon without text              │
│                                               │
│ Helper Components:                            │
│  • SaveButton                                 │
│  • DeleteButton                               │
│  • RefreshButton                              │
│  • ActionButton                               │
└───────────────────────────────────────────────┘
```

### Loading State Behavior

```
Normal Button State
┌─────────────────┐
│    Save Data    │
└─────────────────┘
        ↓ Click
Loading State
┌─────────────────┐
│  ◌  Saving...   │  ← Spinner + Loading text
└─────────────────┘
        ↓ Complete
Success Feedback (Optional)
┌─────────────────┐
│  ✓  Saved!      │  ← Success icon
└─────────────────┘
```

### Icon Position Options

| Position | Layout | Use Case |
|----------|--------|----------|
| left | [Icon] Text | Most common, natural reading |
| right | Text [Icon] | Directional actions (Next →) |
| only | [Icon] | Icon-only with tooltip |

### Size Comparison Chart

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| xs | 24px | 6px 10px | 12px | Compact tables, inline actions |
| sm | 32px | 8px 12px | 13px | Form actions, secondary buttons |
| default | 40px | 10px 16px | 14px | Standard buttons |
| lg | 48px | 12px 20px | 16px | Primary page actions |
| xl | 56px | 14px 24px | 18px | Hero CTAs, important actions |
| icon | 40px | 10px | - | Icon-only buttons |

### ERP Variant Color Scheme

```
Success Variant (Green Theme)
┌─────────────────┐
│  ✓  Approve     │  - Background: Green-600
└─────────────────┘  - Hover: Green-700
                     - Text: White

Warning Variant (Orange Theme)
┌─────────────────┐
│  ⚠  Pending     │  - Background: Orange-500
└─────────────────┘  - Hover: Orange-600
                     - Text: White

Info Variant (Blue Theme)
┌─────────────────┐
│  ℹ  View Info   │  - Background: Blue-500
└─────────────────┘  - Hover: Blue-600
                     - Text: White
```

### Helper Button Components

#### SaveButton
- Default loading text: "Saving..."
- Auto-disables on click
- Shows spinner during loading
- Success feedback optional

#### DeleteButton
- Always uses destructive variant
- Built-in confirmation dialog
- Requires confirmText prop
- Loading state during deletion

#### RefreshButton
- Icon-only by default
- Rotating animation on click
- Auto-stops after data refresh
- Tooltip: "Refresh"

#### ActionButton
- Flexible for common patterns
- Supports all custom props
- Pre-configured for ERP actions
- Consistent styling

### Expected Outcome
- Enhanced button functionality
- Loading states for async operations
- Icon support with proper spacing
- ERP-specific visual variants
- Reusable helper components

### Verification Checklist
- [ ] Loading state implemented and tested
- [ ] Icon integration working (left, right, only)
- [ ] Custom sizes (xs, xl) defined
- [ ] Success variant styled correctly
- [ ] Warning variant styled correctly
- [ ] Info variant styled correctly
- [ ] SaveButton helper created
- [ ] DeleteButton helper created
- [ ] RefreshButton helper created
- [ ] Tooltips work on icon-only buttons
- [ ] All variants are accessible
- [ ] TypeScript types updated

---

## Task 17: Create ButtonGroup Component

### Overview
Create a ButtonGroup component that combines multiple buttons into a cohesive visual unit. This component is essential for toolbar actions, toggle groups, and segmented controls common in ERP interfaces.

### Dependencies
- Task 16: Customize Button Variants

### Instructions

1. **Create ButtonGroup component file**
   - Create button-group.tsx in components/ui
   - Set up base component structure
   - Import necessary dependencies

2. **Define ButtonGroup props**
   - Add children prop for button elements
   - Add variant prop for group styling
   - Add size prop to control all buttons
   - Add orientation prop (horizontal, vertical)

3. **Implement horizontal layout**
   - Default orientation
   - Remove spacing between buttons
   - Remove borders on inner edges
   - Keep border radius on outer edges only

4. **Implement vertical layout**
   - Stack buttons vertically
   - Remove top/bottom borders on inner edges
   - Keep border radius on top/bottom edges only
   - Maintain consistent width

5. **Add attached/detached modes**
   - Attached mode: buttons touch each other
   - Detached mode: small gap between buttons
   - Control via spacing prop

6. **Handle button states in group**
   - Manage focus states across group
   - Ensure proper z-index layering
   - Handle hover effects
   - Maintain active button highlighting

7. **Create ToggleButtonGroup variant**
   - Single selection mode
   - Multiple selection mode
   - Controlled/uncontrolled modes
   - Visual feedback for selected state

8. **Add accessibility features**
   - Proper ARIA roles for group
   - Keyboard navigation support
   - Focus management
   - Screen reader announcements

### ButtonGroup Structure

```
┌──────────────────────────────────────────────┐
│          ButtonGroup Component               │
├──────────────────────────────────────────────┤
│ Props:                                       │
│  • variant - styling variant for group       │
│  • size - size for all buttons               │
│  • orientation - horizontal/vertical         │
│  • spacing - attached/detached               │
│  • disabled - disable entire group           │
│                                              │
│ Child Components:                            │
│  • Button (multiple)                         │
│                                              │
│ Variants:                                    │
│  • Default - Standard button group           │
│  • Toggle - Selection group                  │
│  • Toolbar - Toolbar actions                 │
└──────────────────────────────────────────────┘
```

### Horizontal ButtonGroup Layout

```
Attached Mode (Default)
┌─────────┬─────────┬─────────┐
│  Edit   │  Copy   │ Delete  │
└─────────┴─────────┴─────────┘
  ↑ No gaps between buttons

Detached Mode
┌─────────┐ ┌─────────┐ ┌─────────┐
│  Edit   │ │  Copy   │ │ Delete  │
└─────────┘ └─────────┘ └─────────┘
  ↑ Small gaps between buttons
```

### Vertical ButtonGroup Layout

```
Attached Mode
┌──────────────┐
│     Edit     │
├──────────────┤
│     Copy     │
├──────────────┤
│    Delete    │
└──────────────┘
  ↑ No gaps between buttons

Detached Mode
┌──────────────┐
│     Edit     │
└──────────────┘

┌──────────────┐
│     Copy     │
└──────────────┘

┌──────────────┐
│    Delete    │
└──────────────┘
```

### Toggle ButtonGroup Behavior

```
Single Selection Mode
┌─────────┬─────────┬─────────┐
│ ■ Day   │  Week   │  Month  │  ← Only one selected
└─────────┴─────────┴─────────┘

Multiple Selection Mode
┌─────────┬─────────┬─────────┐
│ ■ Email │ ■ SMS   │  Push   │  ← Multiple selected
└─────────┴─────────┴─────────┘
```

### ButtonGroup Use Cases

| Use Case | Orientation | Mode | Example |
|----------|-------------|------|---------|
| Toolbar actions | Horizontal | Attached | Edit, Copy, Delete |
| View switching | Horizontal | Toggle | List, Grid, Calendar |
| Sidebar filters | Vertical | Toggle | Categories, Tags |
| Table actions | Horizontal | Attached | Export, Print, Share |
| Date range | Horizontal | Toggle | Day, Week, Month, Year |
| Alignment tools | Horizontal | Toggle | Left, Center, Right |

### ERP-Specific ButtonGroup Examples

#### Table Action Toolbar
```
┌──────┬──────┬────────┬──────┬────────┐
│ Edit │ Copy │ Delete │ Move │ Export │
└──────┴──────┴────────┴──────┴────────┘
```

#### Report Time Range Selector
```
┌──────┬────────┬────────┬────────┐
│ ■ Day │ Week   │ Month  │  Year  │  ← Day selected
└──────┴────────┴────────┴────────┘
```

#### Inventory View Switcher
```
┌──────┬──────┬──────────┐
│ List │ ■ Grid │ Kanban  │  ← Grid selected
└──────┴──────┴──────────┘
```

#### Status Filter Group (Vertical)
```
┌──────────────┐
│  ■ Active    │  ← Selected
├──────────────┤
│  ■ Pending   │  ← Selected
├──────────────┤
│    Archived  │
└──────────────┘
```

### Border Radius Handling

```
Horizontal Group
First Button:  Round left corners only
Middle Buttons: No rounded corners
Last Button:   Round right corners only

┌●────────┬─────────┬─────────●┐
│  First  │ Middle  │   Last   │
└●────────┴─────────┴─────────●┘
  ↑ Rounded           Rounded ↑
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus to group |
| Arrow Right/Down | Next button |
| Arrow Left/Up | Previous button |
| Space/Enter | Activate button |
| Home | First button |
| End | Last button |

### Expected Outcome
- Cohesive button grouping
- Visual continuity between buttons
- Toggle selection support
- Proper keyboard navigation
- Accessible group interactions

### Verification Checklist
- [ ] ButtonGroup component created
- [ ] Horizontal layout working
- [ ] Vertical layout working
- [ ] Attached mode styled correctly
- [ ] Detached mode with proper spacing
- [ ] Border radius handling correct
- [ ] ToggleButtonGroup variant created
- [ ] Single selection mode working
- [ ] Multiple selection mode working
- [ ] Keyboard navigation functional
- [ ] ARIA attributes correct
- [ ] Focus management working
- [ ] TypeScript types defined

---

## Task 18: Install Input Component

### Overview
Install the base Input component from shadcn/ui for text input fields throughout the ERP dashboard. The input component provides a consistent foundation for all text-based form inputs with proper styling and accessibility.

### Dependencies
- Next.js project initialized
- Tailwind CSS configured
- shadcn/ui CLI installed

### Instructions

1. **Install Input component via CLI**
   - Navigate to frontend project directory
   - Execute shadcn/ui add command for input component
   - CLI will download component files automatically

2. **Verify component installation**
   - Check that input.tsx appears in components/ui directory
   - Verify all necessary imports are present
   - Ensure component exports are correct

3. **Review default input styling**
   - Examine base styles applied
   - Check focus state styling
   - Review disabled state appearance
   - Test border and background colors

4. **Test input types**
   - Verify text input rendering
   - Test email input validation
   - Test number input behavior
   - Test password input masking

5. **Check accessibility features**
   - Verify proper label association
   - Test keyboard navigation
   - Check screen reader compatibility
   - Ensure ARIA attributes are present

### Input Component Structure

```
┌───────────────────────────────────────────────┐
│            Input Component                    │
├───────────────────────────────────────────────┤
│ Base Features:                                │
│  • Standard text input styling               │
│  • Focus state with ring                     │
│  • Disabled state styling                    │
│  • Error state support                       │
│  • Full width by default                     │
│                                              │
│ Supported Types:                             │
│  • text, email, password                     │
│  • number, tel, url                          │
│  • search, date, time                        │
│                                              │
│ Accessibility:                               │
│  • Label association                         │
│  • ARIA attributes                           │
│  • Keyboard navigation                       │
└───────────────────────────────────────────────┘
```

### Input Type Use Cases

| Type | Use Case | Example |
|------|----------|---------|
| text | General text entry | Product name, description |
| email | Email addresses | Customer email, user email |
| password | Secure entry | Login, password fields |
| number | Numeric values | Quantity, price, discount |
| tel | Phone numbers | Contact phone, mobile |
| url | Website addresses | Company website |
| search | Search queries | Product search, filter |
| date | Date selection | Order date, delivery date |
| time | Time selection | Opening hours, schedule |

### Input States

```
Normal State
┌────────────────────────────────────┐
│ Enter product name...              │
└────────────────────────────────────┘

Focus State
┌────────────────────────────────────┐
│ Enter product name...              │  ← Blue ring
└────────────────────────────────────┘

Disabled State
┌────────────────────────────────────┐
│ Enter product name...              │  ← Grayed out
└────────────────────────────────────┘

Error State
┌────────────────────────────────────┐
│ Enter product name...              │  ← Red border
└────────────────────────────────────┘
⚠ Product name is required
```

### Expected Outcome
- Input component installed successfully
- All input types supported
- Consistent styling across inputs
- Proper accessibility features
- Foundation for input customization

### Verification Checklist
- [ ] Input component file exists in components/ui
- [ ] Component imports without errors
- [ ] All input types render correctly
- [ ] Focus state styling works
- [ ] Disabled state styled properly
- [ ] Error state support present
- [ ] Accessibility attributes correct
- [ ] TypeScript types are correct

---

## Task 19: Customize Input Variants

### Overview
Enhance the base Input component with custom variants and features specific to ERP requirements, including icon prefixes/suffixes, clearable inputs, validation states, input masks, and specialized input types for common ERP data.

### Dependencies
- Task 18: Install Input Component

### Instructions

1. **Add icon prefix support**
   - Create prefixIcon prop
   - Position icon at start of input
   - Adjust input padding for icon space
   - Style icon color and size

2. **Add icon suffix support**
   - Create suffixIcon prop
   - Position icon at end of input
   - Handle both suffix and clearable button
   - Maintain proper spacing

3. **Implement clearable input**
   - Add clearable prop
   - Show clear button when input has value
   - Clear value on button click
   - Hide button when empty

4. **Add validation state variants**
   - Create success state styling
   - Create warning state styling
   - Create error state styling
   - Add corresponding border colors

5. **Implement helper text support**
   - Add helperText prop
   - Position below input field
   - Style based on validation state
   - Support for error messages

6. **Create size variants**
   - Add sm (small) size option
   - Add lg (large) size option
   - Adjust padding and font sizes
   - Maintain consistent heights with buttons

7. **Add input mask support**
   - Integrate input masking library
   - Create currency mask variant
   - Create phone number mask variant
   - Create date mask variant

8. **Create specialized input components**
   - Create CurrencyInput with symbol
   - Create PhoneInput with country code
   - Create SearchInput with icon
   - Create PasswordInput with toggle visibility

9. **Implement input addon support**
   - Add addonBefore prop (text/element)
   - Add addonAfter prop (text/element)
   - Style addon sections
   - Common for units (%, Rs., kg)

10. **Add character counter**
    - Create maxLength support
    - Show character count
    - Update count as user types
    - Warning when approaching limit

### Custom Input Variants

```
┌───────────────────────────────────────────────┐
│         Extended Input Features               │
├───────────────────────────────────────────────┤
│ Icon Support:                                 │
│  • prefixIcon - Leading icon                  │
│  • suffixIcon - Trailing icon                 │
│                                              │
│ Features:                                     │
│  • clearable - Clear button                   │
│  • helperText - Below input message           │
│  • characterCounter - Shows count             │
│                                              │
│ Validation States:                            │
│  • success - Green border                     │
│  • warning - Orange border                    │
│  • error - Red border                         │
│                                              │
│ Sizes:                                        │
│  • sm - Small (32px height)                   │
│  • default - Standard (40px)                  │
│  • lg - Large (48px)                          │
│                                              │
│ Specialized Inputs:                           │
│  • CurrencyInput                              │
│  • PhoneInput                                 │
│  • SearchInput                                │
│  • PasswordInput                              │
└───────────────────────────────────────────────┘
```

### Input with Icons

```
Prefix Icon
┌────────────────────────────────────┐
│ 🔍 Search products...              │
└────────────────────────────────────┘

Suffix Icon
┌────────────────────────────────────┐
│ Enter email...                  ✉ │
└────────────────────────────────────┘

Both Icons
┌────────────────────────────────────┐
│ 🔍 Search products...            ⚙ │
└────────────────────────────────────┘
```

### Clearable Input Behavior

```
Empty State (No clear button)
┌────────────────────────────────────┐
│ 🔍 Search...                       │
└────────────────────────────────────┘

With Value (Clear button appears)
┌────────────────────────────────────┐
│ 🔍 laptop computer              ✕ │
└────────────────────────────────────┘
        ↑ Text entered    Clear button ↑

After Clearing
┌────────────────────────────────────┐
│ 🔍 Search...                       │
└────────────────────────────────────┘
```

### Validation State Styling

| State | Border Color | Helper Text Color | Icon |
|-------|-------------|-------------------|------|
| default | Gray-300 | Gray-600 | - |
| success | Green-500 | Green-700 | ✓ |
| warning | Orange-500 | Orange-700 | ⚠ |
| error | Red-500 | Red-700 | ✗ |

### Input with Helper Text

```
Success State
┌────────────────────────────────────┐
│ john@example.com                ✓ │  ← Green border
└────────────────────────────────────┘
✓ Email format is valid

Error State
┌────────────────────────────────────┐
│ john@invalid                    ✗ │  ← Red border
└────────────────────────────────────┘
⚠ Please enter a valid email address

Warning State
┌────────────────────────────────────┐
│ short                           ⚠ │  ← Orange border
└────────────────────────────────────┘
⚠ Recommended: at least 8 characters
```

### Input Addon Examples

```
Currency Input (Prefix Addon)
┌──┬──────────────────────────────┐
│Rs│ 1,500.00                     │
└──┴──────────────────────────────┘

Weight Input (Suffix Addon)
┌──────────────────────────────┬────┐
│ 25.5                         │ kg │
└──────────────────────────────┴────┘

Percentage Input
┌──────────────────────────────┬───┐
│ 15                           │ % │
└──────────────────────────────┴───┘

Domain Input
┌──────────────────────────────┬─────────────┐
│ myshop                       │ .example.lk │
└──────────────────────────────┴─────────────┘
```

### Specialized Input Components

#### CurrencyInput
- Automatic number formatting (1000 → 1,000)
- Currency symbol prefix (Rs., $, €)
- Decimal precision control
- Negative value support
- Thousand separators

#### PhoneInput
- Country code selector
- Phone number formatting
- Pattern validation
- International format support
- Sri Lanka format: +94 XX XXX XXXX

#### SearchInput
- Search icon prefix
- Clearable by default
- Keyboard shortcuts (Ctrl+K)
- Loading state during search
- Recent searches dropdown

#### PasswordInput
- Password masking
- Toggle visibility icon
- Strength indicator
- Generate password button
- Copy to clipboard

### Character Counter

```
Normal State
┌────────────────────────────────────┐
│ Product description here...        │
└────────────────────────────────────┘
24/100 characters

Approaching Limit (Warning)
┌────────────────────────────────────┐
│ This is a very long product des... │
└────────────────────────────────────┘
95/100 characters ⚠

At Limit
┌────────────────────────────────────┐
│ This is a very long product descr  │
└────────────────────────────────────┘
100/100 characters
```

### Input Size Comparison

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| sm | 32px | 6px 10px | 13px | Compact forms, inline editing |
| default | 40px | 8px 12px | 14px | Standard forms |
| lg | 48px | 12px 16px | 16px | Prominent inputs, search bars |

### Input Masking Patterns

| Type | Mask Pattern | Example |
|------|--------------|---------|
| Sri Lanka Phone | +94 XX XXX XXXX | +94 77 123 4567 |
| NIC (Old) | 999999999V | 912345678V |
| NIC (New) | 999999999999 | 199212345678 |
| Postal Code | 99999 | 10230 |
| Currency | Rs. #,###.## | Rs. 1,234.56 |
| Date | DD/MM/YYYY | 25/01/2026 |
| Time | HH:MM | 14:30 |

### Expected Outcome
- Enhanced input functionality
- Icon support for visual context
- Validation state feedback
- Clearable inputs for better UX
- Specialized inputs for common data types
- Input masking for formatted data

### Verification Checklist
- [ ] Prefix icon support implemented
- [ ] Suffix icon support implemented
- [ ] Clearable input working
- [ ] Success state styled correctly
- [ ] Warning state styled correctly
- [ ] Error state styled correctly
- [ ] Helper text displays properly
- [ ] Size variants (sm, lg) created
- [ ] CurrencyInput component created
- [ ] PhoneInput component created
- [ ] SearchInput component created
- [ ] PasswordInput component created
- [ ] Input addons working
- [ ] Character counter functional
- [ ] Input masking library integrated
- [ ] All variants are accessible

---

## Task 20: Install Textarea Component

### Overview
Install the Textarea component from shadcn/ui for multi-line text input fields. This component is essential for longer content entry such as descriptions, notes, addresses, and comments throughout the ERP system.

### Dependencies
- Task 18: Install Input Component
- Tailwind CSS configured

### Instructions

1. **Install Textarea component via CLI**
   - Navigate to frontend project directory
   - Execute shadcn/ui add command for textarea component
   - CLI will download component files automatically

2. **Verify component installation**
   - Check that textarea.tsx appears in components/ui directory
   - Verify all necessary imports are present
   - Ensure component exports are correct

3. **Review default styling**
   - Examine base styles applied
   - Check focus state styling
   - Review disabled state appearance
   - Test resize behavior

4. **Test basic functionality**
   - Verify multi-line input works
   - Test auto-resize behavior
   - Check placeholder display
   - Test scrolling for long content

5. **Check accessibility features**
   - Verify proper label association
   - Test keyboard navigation
   - Check screen reader compatibility
   - Ensure ARIA attributes are present

### Textarea Component Structure

```
┌───────────────────────────────────────────────┐
│          Textarea Component                   │
├───────────────────────────────────────────────┤
│ Base Features:                                │
│  • Multi-line text input                      │
│  • Resizable (vertical by default)            │
│  • Focus state with ring                      │
│  • Disabled state styling                     │
│  • Scrollbar for overflow                     │
│                                              │
│ Properties:                                   │
│  • rows - Initial height in lines             │
│  • cols - Width in characters                 │
│  • resize - Control resize behavior           │
│  • maxLength - Character limit                │
│                                              │
│ Accessibility:                                │
│  • Label association                          │
│  • ARIA attributes                            │
│  • Keyboard navigation                        │
└───────────────────────────────────────────────┘
```

### Textarea Use Cases

| Use Case | Rows | Max Length | Context |
|----------|------|------------|---------|
| Product description | 4-6 | 500 | Short product details |
| Customer notes | 3-4 | 200 | Quick notes, comments |
| Address | 3 | 200 | Full address entry |
| Email content | 8-10 | 2000 | Email templates |
| Terms & conditions | 10+ | Unlimited | Legal text, policies |
| Internal notes | 5 | 1000 | Order notes, instructions |

### Textarea States

```
Normal State
┌────────────────────────────────────┐
│ Enter product description...       │
│                                    │
│                                    │
│                                    │
└────────────────────────────────────┘

Focus State
┌────────────────────────────────────┐
│ High quality product with...       │  ← Blue ring
│                                    │
│                                    │
│                                    │
└────────────────────────────────────┘

With Content & Scrollbar
┌────────────────────────────────────┐
│ This is a detailed product         │▲
│ description that contains          │█
│ multiple lines of text and         │█
│ wraps to demonstrate how the...    │▼
└────────────────────────────────────┘
```

### Resize Options

| Option | Behavior | Use Case |
|--------|----------|----------|
| vertical | Resize height only | Most common, default |
| horizontal | Resize width only | Rare, specific layouts |
| both | Resize in both directions | Flexible forms |
| none | Fixed size | Consistent UI, cards |

### Expected Outcome
- Textarea component installed successfully
- Multi-line input functional
- Resize behavior working
- Proper accessibility features
- Foundation for textarea customization

### Verification Checklist
- [ ] Textarea component file exists
- [ ] Component imports without errors
- [ ] Multi-line input works correctly
- [ ] Focus state styling applied
- [ ] Disabled state styled properly
- [ ] Resize behavior functional
- [ ] Scrollbar appears for overflow
- [ ] Accessibility attributes correct
- [ ] TypeScript types are correct

---

## Task 21: Install Select Component

### Overview
Install the Select component from shadcn/ui for dropdown selection fields. The select component provides a robust foundation for single-choice selection with proper styling, accessibility, and integration with React Hook Form.

### Dependencies
- Next.js project initialized
- Tailwind CSS configured
- Radix UI dependencies installed

### Instructions

1. **Install Select component via CLI**
   - Navigate to frontend project directory
   - Execute shadcn/ui add command for select component
   - CLI will download component and dependencies

2. **Verify component installation**
   - Check that select.tsx appears in components/ui directory
   - Verify Radix UI Select is installed
   - Ensure all subcomponents are present

3. **Review component structure**
   - Examine Select root component
   - Check SelectTrigger for button display
   - Review SelectContent for dropdown
   - Check SelectItem for options

4. **Test basic select functionality**
   - Render a simple select dropdown
   - Test opening/closing dropdown
   - Test option selection
   - Verify selected value display

5. **Check accessibility features**
   - Test keyboard navigation
   - Verify ARIA attributes
   - Check screen reader compatibility
   - Test focus management

### Select Component Structure

```
┌───────────────────────────────────────────────┐
│           Select Component                    │
├───────────────────────────────────────────────┤
│ Subcomponents:                                │
│  • Select - Root container                    │
│  • SelectTrigger - Button to open dropdown    │
│  • SelectValue - Display selected value       │
│  • SelectContent - Dropdown container         │
│  • SelectItem - Individual option             │
│  • SelectGroup - Group related options        │
│  • SelectLabel - Group label                  │
│  • SelectSeparator - Visual divider           │
│                                              │
│ Features:                                     │
│  • Keyboard navigation                        │
│  • Controlled/uncontrolled modes              │
│  • Disabled options support                   │
│  • Portal rendering for overflow              │
│                                              │
│ Accessibility:                                │
│  • Full ARIA support                          │
│  • Keyboard navigation (↑↓ Enter Esc)         │
│  • Focus management                           │
└───────────────────────────────────────────────┘
```

### Select Component Hierarchy

```
<Select>                           ← Root (state management)
  <SelectTrigger>                  ← Button to open
    <SelectValue />                ← Display selected
  </SelectTrigger>
  
  <SelectContent>                  ← Dropdown (portal)
    <SelectItem value="1">         ← Option 1
      Option One
    </SelectItem>
    <SelectItem value="2">         ← Option 2
      Option Two
    </SelectItem>
  </SelectContent>
</Select>
```

### Select States

```
Closed State (Default)
┌────────────────────────────────┬─┐
│ Select an option...            │▼│
└────────────────────────────────┴─┘

Open State (Dropdown Visible)
┌────────────────────────────────┬─┐
│ Select an option...            │▲│
└────────────────────────────────┴─┘
┌────────────────────────────────────┐
│ Option One                         │
│ ■ Option Two                       │  ← Highlighted
│ Option Three                       │
└────────────────────────────────────┘

Selected State
┌────────────────────────────────┬─┐
│ Option Two                     │▼│
└────────────────────────────────┴─┘
```

### Grouped Select Example

```
┌────────────────────────────────┬─┐
│ Select a category...           │▼│
└────────────────────────────────┴─┘
                ↓ Click
┌────────────────────────────────────┐
│ Electronics                        │  ← Group label
│   Laptops                          │
│   Phones                           │
│   Tablets                          │
├────────────────────────────────────┤  ← Separator
│ Furniture                          │  ← Group label
│   Chairs                           │
│   Tables                           │
│   Desks                            │
└────────────────────────────────────┘
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Space/Enter | Open dropdown |
| Arrow Down | Next option (highlight) |
| Arrow Up | Previous option |
| Home | First option |
| End | Last option |
| Enter | Select highlighted option |
| Esc | Close dropdown |
| Type | Search options by text |

### Expected Outcome
- Select component installed successfully
- Dropdown functionality working
- Keyboard navigation functional
- Proper accessibility support
- Foundation for select customization

### Verification Checklist
- [ ] Select component file exists
- [ ] All subcomponents present
- [ ] Radix UI Select installed
- [ ] Dropdown opens/closes correctly
- [ ] Option selection works
- [ ] Keyboard navigation functional
- [ ] ARIA attributes correct
- [ ] Focus management working
- [ ] TypeScript types correct

---

## Task 22: Customize Select Component

### Overview
Enhance the Select component with advanced features required for ERP applications, including search functionality, multi-select capability, async data loading, option creation, grouping, and specialized select variants for common ERP scenarios.

### Dependencies
- Task 21: Install Select Component

### Instructions

1. **Implement search functionality**
   - Add search input at top of dropdown
   - Filter options as user types
   - Highlight matching text in options
   - Show "no results" message when empty

2. **Create multi-select variant**
   - Allow multiple option selection
   - Show checkboxes for each option
   - Display selected items as tags
   - Support "Select All" option
   - Add clear all functionality

3. **Implement async select**
   - Support async data loading
   - Show loading spinner while fetching
   - Handle loading errors
   - Support pagination for large datasets
   - Implement debounced search

4. **Add creatable select option**
   - Allow user to create new options
   - Show "Create new" option
   - Trigger onCreate callback
   - Add newly created option to list
   - Validate new option format

5. **Enhance option rendering**
   - Support icons in options
   - Support descriptions below labels
   - Support badges/tags on options
   - Custom option rendering
   - Disabled options styling

6. **Implement option grouping**
   - Support nested groups
   - Collapsible groups
   - Group headers styling
   - Separators between groups
   - Group selection (select all in group)

7. **Add virtualization for large lists**
   - Implement virtual scrolling
   - Render only visible options
   - Improve performance with 1000+ options
   - Maintain scroll position on search

8. **Create specialized select components**
   - Create CountrySelect with flags
   - Create CurrencySelect with symbols
   - Create CategorySelect with hierarchy
   - Create UserSelect with avatars
   - Create StatusSelect with colored dots

9. **Implement clear functionality**
   - Add clearable prop
   - Show clear button when value selected
   - Clear value on click
   - Support for "none" or null state

10. **Add custom trigger variants**
    - Create compact trigger size
    - Create tag-style display for multi-select
    - Create inline select variant
    - Support custom trigger rendering

### Enhanced Select Features

```
┌───────────────────────────────────────────────┐
│       Enhanced Select Capabilities            │
├───────────────────────────────────────────────┤
│ Search & Filter:                              │
│  • Search input in dropdown                   │
│  • Real-time filtering                        │
│  • Highlight matching text                    │
│                                              │
│ Multi-Select:                                 │
│  • Checkbox selection                         │
│  • Tag display for selected                   │
│  • Select all / Clear all                     │
│                                              │
│ Async Loading:                                │
│  • Load options from API                      │
│  • Debounced search                           │
│  • Pagination support                         │
│  • Loading states                             │
│                                              │
│ Creatable:                                    │
│  • Create new options                         │
│  • Custom validation                          │
│  • onCreate callback                          │
│                                              │
│ Advanced Features:                            │
│  • Virtual scrolling                          │
│  • Option grouping                            │
│  • Custom rendering                           │
│  • Icons and descriptions                     │
└───────────────────────────────────────────────┘
```

### Search Select Behavior

```
Closed State
┌────────────────────────────────┬─┐
│ Search products...             │▼│
└────────────────────────────────┴─┘

Open with Search
┌────────────────────────────────┬─┐
│ Search products...             │▲│
└────────────────────────────────┴─┘
┌────────────────────────────────────┐
│ 🔍 lap                             │  ← Search input
├────────────────────────────────────┤
│ 💻 Laptop Computer                 │
│ 💻 Laptop Bag                      │
│ 🖥️ Desktop Laptop Stand            │
└────────────────────────────────────┘

No Results
┌────────────────────────────────────┐
│ 🔍 xyz                             │
├────────────────────────────────────┤
│      No results found              │
└────────────────────────────────────┘
```

### Multi-Select Display

```
Trigger with Selected Items
┌─────────────────────────────────────────────┬─┐
│ ✓ Electronics  ✓ Furniture  ✓ Food      [x]│▼│
└─────────────────────────────────────────────┴─┘
    ↑ Tags for selected items        Clear all ↑

Dropdown with Checkboxes
┌────────────────────────────────────────────────┐
│ 🔍 Search categories...                        │
├────────────────────────────────────────────────┤
│ ☑ Select All                                   │
├────────────────────────────────────────────────┤
│ ☑ Electronics                                  │  ← Selected
│ ☑ Furniture                                    │  ← Selected
│ ☐ Food                                         │
│ ☐ Clothing                                     │
└────────────────────────────────────────────────┘
```

### Async Select States

```
Initial Load
┌────────────────────────────────┬─┐
│ Loading...                  ◌  │▼│
└────────────────────────────────┴─┘

Loaded
┌────────────────────────────────┬─┐
│ Select a customer...           │▼│
└────────────────────────────────┴─┘
                ↓ Open
┌────────────────────────────────────┐
│ John Doe - john@example.com        │
│ Jane Smith - jane@example.com      │
│ Bob Wilson - bob@example.com       │
└────────────────────────────────────┘

Searching with Debounce
┌────────────────────────────────────┐
│ 🔍 john                         ◌  │  ← Loading indicator
├────────────────────────────────────┤
│ Searching...                       │
└────────────────────────────────────┘
```

### Creatable Select

```
Search with Create Option
┌────────────────────────────────────┐
│ 🔍 New Category                    │
├────────────────────────────────────┤
│ + Create "New Category"            │  ← Create option
├────────────────────────────────────┤
│ Existing Category 1                │
│ Existing Category 2                │
└────────────────────────────────────┘

After Creating
┌────────────────────────────────┬─┐
│ New Category                   │▼│  ← Newly created selected
└────────────────────────────────┴─┘
```

### Rich Option Rendering

```
Options with Icons and Descriptions
┌────────────────────────────────────────────────┐
│ 💻 Electronics                                 │
│    Computers, phones, and gadgets              │
├────────────────────────────────────────────────┤
│ 👕 Clothing                                    │
│    Apparel and accessories                     │
├────────────────────────────────────────────────┤
│ 🍔 Food & Beverage                             │
│    Groceries and drinks                        │
└────────────────────────────────────────────────┘

Options with Status Badges
┌────────────────────────────────────────────────┐
│ Product A                    [IN STOCK]        │
│ Product B                    [LOW STOCK]       │
│ Product C                    [OUT OF STOCK]    │
└────────────────────────────────────────────────┘
```

### Hierarchical Category Select

```
Nested Categories with Indentation
┌────────────────────────────────────────────────┐
│ Electronics                                    │
│   → Computers                                  │
│      → Laptops                                 │
│      → Desktops                                │
│   → Phones                                     │
│      → Smartphones                             │
│      → Feature Phones                          │
│ Furniture                                      │
│   → Living Room                                │
│   → Bedroom                                    │
└────────────────────────────────────────────────┘
```

### Specialized Select Components

#### CountrySelect
- Flag icons for each country
- Search by name or code
- Grouped by region
- Popular countries at top
- Phone code in description

#### CurrencySelect
- Currency symbols displayed
- Currency code (USD, EUR, LKR)
- Exchange rate information
- Most used currencies prioritized

#### CategorySelect
- Hierarchical tree structure
- Expand/collapse categories
- Breadcrumb display
- Icon for each category
- Product count per category

#### UserSelect
- Avatar/profile picture
- User name and email
- Role badge
- Online status indicator
- Recent users at top

#### StatusSelect
- Colored status dots
- Status name
- Description
- Disabled invalid transitions
- Workflow progression

### Virtual Scrolling for Performance

```
Large List (1000+ items)
┌────────────────────────────────────┐
│ Option 1                          ▲│  ← Top of scroll
│ Option 2                          █│
│ Option 3                          █│
│ Option 4                          █│  ← Only visible items rendered
│ Option 5                          ▼│
└────────────────────────────────────┘
                ↓ Scroll down
┌────────────────────────────────────┐
│ Option 498                        ▲│
│ Option 499                        █│  ← Virtual scrolling
│ Option 500                        █│     maintains performance
│ Option 501                        █│
│ Option 502                        ▼│
└────────────────────────────────────┘
```

### ERP-Specific Use Cases

| Component | Use Case | Features |
|-----------|----------|----------|
| CountrySelect | Customer country | Flags, search, regions |
| CurrencySelect | Pricing currency | Symbols, codes, rates |
| CategorySelect | Product category | Hierarchy, breadcrumbs |
| UserSelect | Assign task | Avatar, role, status |
| StatusSelect | Order status | Colors, workflow |
| WarehouseSelect | Location | Address, capacity |
| SupplierSelect | Purchase order | Contact, rating |
| TaxRateSelect | Tax calculation | Rate, region, type |

### Expected Outcome
- Advanced select functionality
- Search and filter capability
- Multi-select support
- Async data loading
- Creatable options
- Specialized select components
- Improved performance with virtualization

### Verification Checklist
- [ ] Search functionality implemented
- [ ] Multi-select variant created
- [ ] Checkboxes in multi-select working
- [ ] Tag display for selected items
- [ ] Async select loading states
- [ ] Debounced search working
- [ ] Creatable select functional
- [ ] Rich option rendering (icons, descriptions)
- [ ] Option grouping implemented
- [ ] Collapsible groups working
- [ ] Virtual scrolling for large lists
- [ ] CountrySelect component created
- [ ] CurrencySelect component created
- [ ] CategorySelect component created
- [ ] UserSelect component created
- [ ] StatusSelect component created
- [ ] Clear functionality working
- [ ] All variants accessible

---

## Task 23: Install Checkbox Component

### Overview
Install the Checkbox component from shadcn/ui for boolean selection fields. The checkbox component provides a consistent, accessible way to handle binary choices and multiple selections throughout the ERP dashboard.

### Dependencies
- Next.js project initialized
- Tailwind CSS configured
- Radix UI dependencies installed

### Instructions

1. **Install Checkbox component via CLI**
   - Navigate to frontend project directory
   - Execute shadcn/ui add command for checkbox component
   - CLI will download component and dependencies

2. **Verify component installation**
   - Check that checkbox.tsx appears in components/ui directory
   - Verify Radix UI Checkbox is installed
   - Ensure component exports are correct

3. **Review component structure**
   - Examine Checkbox root component
   - Check CheckboxIndicator for checkmark
   - Review styling and states

4. **Test basic checkbox functionality**
   - Render a simple checkbox
   - Test checking/unchecking
   - Verify visual feedback
   - Test disabled state

5. **Check accessibility features**
   - Test keyboard navigation (Space to toggle)
   - Verify ARIA attributes
   - Check screen reader compatibility
   - Test focus states

### Checkbox Component Structure

```
┌───────────────────────────────────────────────┐
│          Checkbox Component                   │
├───────────────────────────────────────────────┤
│ Features:                                     │
│  • Binary state (checked/unchecked)           │
│  • Indeterminate state support                │
│  • Disabled state                             │
│  • Smooth animations                          │
│  • Label association                          │
│                                              │
│ States:                                       │
│  • unchecked - Empty box                      │
│  • checked - Box with checkmark               │
│  • indeterminate - Box with dash              │
│  • disabled - Grayed out, non-interactive     │
│                                              │
│ Accessibility:                                │
│  • ARIA role="checkbox"                       │
│  • Keyboard navigation (Space)                │
│  • Focus ring on focus                        │
│  • Label association via htmlFor              │
└───────────────────────────────────────────────┘
```

### Checkbox States

```
Unchecked State
┌───┐
│   │ Accept terms and conditions
└───┘

Checked State
┌───┐
│ ✓ │ Accept terms and conditions
└───┘

Indeterminate State (Partial Selection)
┌───┐
│ - │ Select all items
└───┘

Disabled State (Unchecked)
┌───┐
│   │ Not available
└───┘

Disabled State (Checked)
┌───┐
│ ✓ │ Permanently selected
└───┘
```

### Checkbox Use Cases

| Use Case | State Type | Example |
|----------|-----------|---------|
| Agreement | Binary | Accept terms |
| Feature toggle | Binary | Enable notifications |
| Item selection | Binary | Select for action |
| Bulk selection | Indeterminate | Select all (some selected) |
| Permissions | Binary | Grant read access |
| Filters | Binary | Show only active items |
| Settings | Binary | Auto-save enabled |

### Checkbox with Label

```
Standard Layout
┌───┐
│ ✓ │ Send email notifications
└───┘

With Description
┌───┐
│ ✓ │ Send email notifications
└───┘
      Receive updates about orders and promotions
```

### Indeterminate State Example

```
Parent Checkbox (Indeterminate - Some selected)
┌───┐
│ - │ Select all products
└───┘
    ├─┌───┐
    │ │ ✓ │ Product A  (Selected)
    │ └───┘
    ├─┌───┐
    │ │   │ Product B  (Not selected)
    │ └───┘
    └─┌───┐
      │ ✓ │ Product C  (Selected)
      └───┘
```

### Expected Outcome
- Checkbox component installed successfully
- All checkbox states functional
- Proper accessibility support
- Label association working
- Foundation for checkbox customization

### Verification Checklist
- [ ] Checkbox component file exists
- [ ] Radix UI Checkbox installed
- [ ] Component imports without errors
- [ ] Checked state works correctly
- [ ] Unchecked state works correctly
- [ ] Indeterminate state supported
- [ ] Disabled state styled properly
- [ ] Keyboard navigation (Space) works
- [ ] ARIA attributes correct
- [ ] Focus states visible
- [ ] Label association functional
- [ ] TypeScript types correct

---

## Task 24: Install Radio Group Component

### Overview
Install the Radio Group component from shadcn/ui for single-choice selection from multiple options. The radio group provides a mutually exclusive selection mechanism essential for forms and settings throughout the ERP dashboard.

### Dependencies
- Next.js project initialized
- Tailwind CSS configured
- Radix UI dependencies installed

### Instructions

1. **Install RadioGroup component via CLI**
   - Navigate to frontend project directory
   - Execute shadcn/ui add command for radio-group component
   - CLI will download component and dependencies

2. **Verify component installation**
   - Check that radio-group.tsx appears in components/ui directory
   - Verify Radix UI RadioGroup is installed
   - Ensure all subcomponents are present

3. **Review component structure**
   - Examine RadioGroup root component
   - Check RadioGroupItem for individual radios
   - Review indicator for selected state

4. **Test basic radio group functionality**
   - Render a radio group with multiple options
   - Test selecting different options
   - Verify only one can be selected
   - Test disabled options

5. **Check accessibility features**
   - Test keyboard navigation (Arrow keys, Tab)
   - Verify ARIA attributes
   - Check screen reader compatibility
   - Test focus management

### RadioGroup Component Structure

```
┌───────────────────────────────────────────────┐
│         RadioGroup Component                  │
├───────────────────────────────────────────────┤
│ Subcomponents:                                │
│  • RadioGroup - Root container                │
│  • RadioGroupItem - Individual radio button   │
│                                              │
│ Features:                                     │
│  • Single selection (mutually exclusive)      │
│  • Disabled items support                     │
│  • Controlled/uncontrolled modes              │
│  • Horizontal/vertical layouts                │
│  • Label association                          │
│                                              │
│ States:                                       │
│  • selected - Filled circle with dot          │
│  • unselected - Empty circle                  │
│  • disabled - Grayed out, non-interactive     │
│                                              │
│ Accessibility:                                │
│  • ARIA role="radiogroup"                     │
│  • Keyboard navigation (↑↓ or ←→)             │
│  • Focus management                           │
│  • Label association                          │
└───────────────────────────────────────────────┘
```

### RadioGroup States

```
Unselected Option
○ Option One

Selected Option
● Option Two

Disabled Option (Unselected)
○ Option Three (disabled)

Disabled Option (Selected)
● Option Four (disabled)
```

### RadioGroup Layout Options

```
Vertical Layout (Default)
○ Daily
● Weekly
○ Monthly

Horizontal Layout
○ Small    ● Medium    ○ Large
```

### RadioGroup with Labels and Descriptions

```
Standard Labels
○ Email Notification
   Receive updates via email

● SMS Notification
   Receive updates via text message

○ Push Notification
   Receive updates in the app
```

### RadioGroup Use Cases

| Use Case | Options | Context |
|----------|---------|---------|
| Notification method | Email, SMS, Push | User preferences |
| Shipping method | Standard, Express, Overnight | Checkout |
| Payment method | Cash, Card, Bank Transfer | Payment |
| Report format | PDF, Excel, CSV | Report generation |
| Sort order | Asc, Desc | Data display |
| Time period | Day, Week, Month, Year | Analytics |
| Priority level | Low, Medium, High, Critical | Task management |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus to radio group |
| Arrow Up/Left | Previous option |
| Arrow Down/Right | Next option |
| Space | Select focused option |
| Home | First option |
| End | Last option |

### RadioGroup Component Hierarchy

```
<RadioGroup defaultValue="option2">
  <RadioGroupItem value="option1" id="opt1" />
  <Label htmlFor="opt1">Option 1</Label>
  
  <RadioGroupItem value="option2" id="opt2" />
  <Label htmlFor="opt2">Option 2</Label>
  
  <RadioGroupItem value="option3" id="opt3" disabled />
  <Label htmlFor="opt3">Option 3</Label>
</RadioGroup>
```

### Mutually Exclusive Selection

```
Before Selection
○ Cash
○ Credit Card
○ Bank Transfer

After Selecting "Credit Card"
○ Cash
● Credit Card      ← Selected, others auto-deselected
○ Bank Transfer

After Selecting "Cash"
● Cash             ← New selection
○ Credit Card      ← Previous selection cleared
○ Bank Transfer
```

### RadioGroup Card Layout

```
Card-Style Radio Options
┌─────────────────────────────┐
│ ○ Standard Shipping         │
│   3-5 business days         │
│   Rs. 250                   │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ● Express Shipping          │  ← Selected
│   1-2 business days         │
│   Rs. 500                   │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ○ Overnight Shipping        │
│   Next business day         │
│   Rs. 1,000                 │
└─────────────────────────────┘
```

### Expected Outcome
- RadioGroup component installed successfully
- Single selection enforcement working
- Keyboard navigation functional
- Proper accessibility support
- Label association working
- Foundation for radio customization

### Verification Checklist
- [ ] RadioGroup component file exists
- [ ] Radix UI RadioGroup installed
- [ ] Component imports without errors
- [ ] Single selection works (mutually exclusive)
- [ ] Selected state displays correctly
- [ ] Unselected state displays correctly
- [ ] Disabled options styled properly
- [ ] Keyboard navigation works (Arrow keys)
- [ ] Tab navigation functional
- [ ] ARIA attributes correct
- [ ] Focus management working
- [ ] Label association functional
- [ ] TypeScript types correct

---

## Summary

This document established the foundation of interactive and input components for the ERP dashboard:

### Completed Components
- ✅ Button component with multiple variants
- ✅ Custom button states (loading, icons, sizes)
- ✅ ButtonGroup for grouped actions
- ✅ Input component with validation states
- ✅ Custom input features (icons, clearable, masks)
- ✅ Textarea for multi-line input
- ✅ Select component with advanced features
- ✅ Multi-select and async select
- ✅ Checkbox for binary choices
- ✅ RadioGroup for single selection

### Key Achievements
1. **Interactive Elements** - Comprehensive button system with variants
2. **Form Inputs** - Text input with validation and formatting
3. **Selection Components** - Dropdowns with search and multi-select
4. **Choice Components** - Checkboxes and radio buttons
5. **ERP-Optimized** - Specialized components for ERP workflows

### Component Statistics
- **10 Tasks Completed**
- **4 Primary Components** (Button, Input, Select, Checkbox/Radio)
- **15+ Specialized Variants** (CurrencyInput, UserSelect, etc.)
- **Full Accessibility** - ARIA support and keyboard navigation

### Next Steps
Proceed to [02_Tasks-25-32_Display-Primitives.md](02_Tasks-25-32_Display-Primitives.md) to implement display components including Badge, Avatar, Card, Separator, Typography, and more.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 10  
**Total Lines:** ~965
