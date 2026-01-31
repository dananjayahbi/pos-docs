# Tasks 17-26: Color Pickers and Color Options

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** B - Color Customization  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Palette-Preview-Verify.md](02_Tasks-27-34_Palette-Preview-Verify.md)

---

## Document Overview

This document covers the creation of the color customization system for the theme engine. It establishes comprehensive color picker functionality, preset management, and multiple color options for brand, UI, and page elements. The system enables store owners to customize primary, secondary, accent, background, and text colors with visual previews and hex input capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create Color Settings Section | Low | 20 min |
| 18 | Create Primary Color Picker | Low | 25 min |
| 19 | Create Secondary Color Picker | Low | 20 min |
| 20 | Create Color Picker Component | Medium | 45 min |
| 21 | Create Color Swatch Preview | Low | 20 min |
| 22 | Create Hex Input | Low | 25 min |
| 23 | Create Color Presets | Medium | 35 min |
| 24 | Create Accent Color | Low | 20 min |
| 25 | Create Background Color | Low | 20 min |
| 26 | Create Text Color | Low | 20 min |

---

## Task 17: Create Color Settings Section

### Overview
Create the main color settings section within the theme customization interface. This section organizes all color-related controls into logical groups (Brand Colors, UI Colors, Page Colors), providing a clear structure for store owners to customize their storefront's color scheme.

### Dependencies
- Task 16: Create Settings Panel (from Group A)
- Theme context and state management in place

### Instructions

1. **Create component directory structure**
   - Navigate to `frontend/components/storefront/theme/` directory
   - Create new subdirectory named `Colors`
   - Establish organizational structure for color components

2. **Create ColorSettings component file**
   - Create `ColorSettings.tsx` in `Colors/` directory
   - Set up TypeScript React functional component structure
   - Import theme context for accessing color state

3. **Define color state interface**
   - Create TypeScript interface for color configuration
   - Include properties for all color types (primary, secondary, accent, background, text)
   - Include color presets and selected preset ID
   - Ensure type safety throughout component

4. **Implement section structure**
   - Create main container with proper spacing
   - Add section heading ("Color Customization")
   - Add section description explaining color system

5. **Create subsection groups**
   - Brand Colors group (primary, secondary)
   - UI Colors group (accent)
   - Page Colors group (background, text)
   - Use semantic HTML with proper headings

6. **Add visual organization**
   - Apply borders or cards to separate groups
   - Use consistent spacing between groups
   - Add icons or labels for each color category

7. **Implement reset functionality**
   - Add "Reset to Default" button
   - Position prominently but not intrusively
   - Connect to reset handler (Task 30)

8. **Add responsive layout**
   - Stack sections vertically on mobile
   - Use grid layout on larger screens
   - Ensure touch-friendly targets on mobile

### Section Structure

```
┌─────────────────────────────────────────┐
│  COLOR CUSTOMIZATION                    │
│  Customize your storefront colors      │
├─────────────────────────────────────────┤
│                                         │
│  BRAND COLORS                           │
│  ┌─────────────────────────────────┐   │
│  │ Primary Color:   [Picker]       │   │
│  │ Secondary Color: [Picker]       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  UI COLORS                              │
│  ┌─────────────────────────────────┐   │
│  │ Accent Color: [Picker]          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PAGE COLORS                            │
│  ┌─────────────────────────────────┐   │
│  │ Background: [Picker]            │   │
│  │ Text Color: [Picker]            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Color Presets]                        │
│  [Reset to Default]                     │
└─────────────────────────────────────────┘
```

### Color Groups Organization

| Group | Colors | Purpose |
|-------|--------|---------|
| Brand Colors | Primary, Secondary | Core brand identity |
| UI Colors | Accent | Buttons, links, highlights |
| Page Colors | Background, Text | Page layout and readability |

### Section Styling Specifications

| Element | Styling | Purpose |
|---------|---------|---------|
| Container | `space-y-6 p-6` | Consistent spacing |
| Heading | `text-2xl font-bold` | Clear hierarchy |
| Subheading | `text-lg font-semibold mb-4` | Group labels |
| Group Container | `border rounded-lg p-4` | Visual separation |
| Description | `text-sm text-gray-600` | Helper text |

### State Management

| State Property | Type | Default | Description |
|----------------|------|---------|-------------|
| primaryColor | string | "#2563eb" | Primary brand color |
| secondaryColor | string | "#64748b" | Secondary brand color |
| accentColor | string | "#3b82f6" | UI accent color |
| backgroundColor | string | "#ffffff" | Page background |
| textColor | string | "#1f2937" | Body text color |
| selectedPreset | string \| null | null | Active preset ID |

### Expected Outcome
- Organized section with clear color groups
- Foundation for individual color pickers
- Intuitive layout for store owners
- Proper state management integration

### Verification Checklist
- [ ] `ColorSettings.tsx` component created
- [ ] Three subsections defined (Brand, UI, Page)
- [ ] Section heading and description present
- [ ] Component integrated with theme context
- [ ] Proper TypeScript interfaces defined
- [ ] Responsive layout implemented
- [ ] Reset button placeholder added

---

## Task 18: Create Primary Color Picker

### Overview
Create the primary color picker control that allows store owners to select their main brand color. This is the most prominent color in the theme and will be used for headers, primary buttons, and key brand elements throughout the storefront.

### Dependencies
- Task 17: Create Color Settings Section
- Task 20: Create Color Picker Component (will use this component)

### Instructions

1. **Add primary color field to ColorSettings**
   - Position within Brand Colors group
   - Add label "Primary Color"
   - Add description text explaining usage

2. **Implement color picker integration**
   - Use Color Picker Component (Task 20)
   - Pass current primary color as value
   - Handle color change events
   - Update theme context state

3. **Add color validation**
   - Ensure valid hex color format
   - Provide fallback for invalid values
   - Display validation errors to user

4. **Implement state updates**
   - Update primary color in theme state
   - Trigger palette generation (Task 27)
   - Apply to CSS variables immediately (Task 29)

5. **Add visual feedback**
   - Show current color in swatch
   - Display hex value
   - Indicate when color changes
   - Show loading state if needed

6. **Connect to presets**
   - Allow preset selection to update primary
   - Update selected preset when manually changed
   - Clear preset selection on manual edit

7. **Add accessibility features**
   - Label picker for screen readers
   - Ensure keyboard navigation
   - Provide color name or description

### Primary Color Usage

| Element | Application |
|---------|-------------|
| Header | Background color |
| Primary Buttons | Background, hover states |
| Links | Default link color |
| Active States | Navigation, tabs |
| Icons | Brand icon color |

### Color Picker Layout

```
Primary Color
└── [Color Swatch] #2563eb [Hex Input]
    ├── Swatch: Visual preview (40x40px)
    ├── Hex: Text input for direct entry
    └── Picker: Browser color input
```

### Primary Color Constraints

| Constraint | Value | Reason |
|------------|-------|--------|
| Format | Hex (#RRGGBB) | Consistency |
| Min Contrast | 4.5:1 with white | Accessibility |
| Brightness | > 20% | Visibility |
| Saturation | > 10% | Brand presence |

### Event Handlers

| Event | Handler | Action |
|-------|---------|--------|
| onChange | handlePrimaryChange | Update state |
| onBlur | validatePrimaryColor | Check validity |
| onPresetSelect | applyPreset | Load preset color |

### State Integration

```
Theme Context
├── colors.primary ← Primary color value
├── colors.primaryShades ← Generated palette
└── isDirty ← Tracks unsaved changes
```

### Expected Outcome
- Functional primary color picker
- Real-time preview of color changes
- Integration with theme state
- Validation and error handling

### Verification Checklist
- [ ] Primary color picker displayed in Brand Colors section
- [ ] Color swatch shows current value
- [ ] Hex input allows manual entry
- [ ] Color changes update theme context
- [ ] Validation prevents invalid colors
- [ ] Accessibility features implemented
- [ ] Integrates with color presets

---

## Task 19: Create Secondary Color Picker

### Overview
Create the secondary color picker control for selecting the complementary brand color. The secondary color supports the primary color and is used for secondary buttons, alternative highlights, and supporting brand elements.

### Dependencies
- Task 17: Create Color Settings Section
- Task 18: Create Primary Color Picker
- Task 20: Create Color Picker Component

### Instructions

1. **Add secondary color field**
   - Position below primary color in Brand Colors group
   - Add label "Secondary Color"
   - Add description explaining complementary usage

2. **Implement picker functionality**
   - Use same Color Picker Component as primary
   - Pass current secondary color value
   - Handle change events independently
   - Update theme context separately

3. **Add color harmony suggestions**
   - Optionally suggest complementary colors to primary
   - Show color wheel relationship
   - Allow manual override of suggestions

4. **Implement state management**
   - Store secondary color in theme state
   - Generate secondary color shades (Task 27)
   - Apply to appropriate CSS variables

5. **Add contrast checking**
   - Verify contrast with primary color
   - Ensure sufficient differentiation
   - Warn if colors are too similar

6. **Connect to preset system**
   - Load secondary from preset selection
   - Update preset when changed manually
   - Maintain preset relationship with primary

### Secondary Color Usage

| Element | Application |
|---------|-------------|
| Secondary Buttons | Background color |
| Subheadings | Text color option |
| Icons | Secondary icon color |
| Borders | Accent borders |
| Tags | Category or tag colors |

### Color Relationship

```
Primary (#2563eb)
    │
    ├── Complementary: Opposite on color wheel
    ├── Analogous: Adjacent colors
    └── Triadic: 120° offset
        │
        └── Secondary (Suggested or Manual)
```

### Secondary Color Constraints

| Constraint | Value | Reason |
|------------|-------|--------|
| Contrast with Primary | > 2:1 | Differentiation |
| Format | Hex (#RRGGBB) | Consistency |
| Independence | Not required to match primary | Flexibility |

### Picker Configuration

| Property | Value | Description |
|----------|-------|-------------|
| Label | "Secondary Color" | Clear identification |
| Default | "#64748b" | Neutral gray |
| Validation | Hex format | Input validation |
| Preview | Real-time | Immediate feedback |

### State Structure

```
Theme State
├── colors
│   ├── primary: "#2563eb"
│   ├── secondary: "#64748b"
│   ├── secondaryShades: [...]
│   └── colorHarmony: "complementary"
└── presets
    └── selected: "modern-blue"
```

### Expected Outcome
- Functional secondary color picker
- Independent from primary but harmonious
- Real-time preview and validation
- Integration with theme system

### Verification Checklist
- [ ] Secondary color picker displayed
- [ ] Positioned below primary color
- [ ] Independent state management
- [ ] Color swatch and hex input functional
- [ ] Validation implemented
- [ ] Preset integration working
- [ ] Contrast with primary verified

---

## Task 20: Create Color Picker Component

### Overview
Create a reusable ColorPicker component that combines a color swatch preview, browser color input, and hex text input. This component serves as the foundation for all color selection controls in the theme engine, providing a consistent user experience.

### Dependencies
- Task 17: Create Color Settings Section
- Foundation for Tasks 18, 19, 24, 25, 26

### Instructions

1. **Create ColorPicker component file**
   - Create `ColorPicker.tsx` in `Colors/` directory
   - Set up reusable component structure
   - Define comprehensive props interface

2. **Define component props**
   - value: current color (hex string)
   - onChange: callback for color changes
   - label: descriptive label for picker
   - description: optional helper text
   - disabled: optional disabled state
   - error: optional error message

3. **Implement component structure**
   - Label and description section
   - Color preview swatch (Task 21)
   - Browser color input (type="color")
   - Hex text input (Task 22)
   - Copy button for hex value
   - Error message display

4. **Create browser color input**
   - Use native `<input type="color">`
   - Style to match design system
   - Handle onChange events
   - Position for easy access

5. **Add interaction handlers**
   - Handle browser picker changes
   - Handle hex input changes
   - Validate hex format
   - Convert between formats if needed

6. **Implement copy-to-clipboard**
   - Add copy icon button next to hex
   - Use Clipboard API
   - Show success feedback (tooltip or toast)
   - Handle copy errors gracefully

7. **Add keyboard navigation**
   - Ensure tab order is logical
   - Support Enter key for interactions
   - Allow Escape to close picker (if needed)

8. **Style component elements**
   - Apply consistent spacing
   - Use design system colors
   - Add hover and focus states
   - Ensure mobile-friendly sizing

### Component Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Current color hex value |
| onChange | (color: string) => void | Yes | - | Color change handler |
| label | string | Yes | - | Picker label |
| description | string | No | "" | Helper text |
| disabled | boolean | No | false | Disabled state |
| error | string | No | "" | Error message |
| showCopy | boolean | No | true | Show copy button |

### Component Layout

```
┌─────────────────────────────────────┐
│ Primary Color                       │
│ Select your main brand color        │
├─────────────────────────────────────┤
│ ┌───┐  #2563eb  [Copy] [Picker]   │
│ │███│  (Hex Input)                 │
│ └───┘                               │
│  ↑ Swatch                           │
└─────────────────────────────────────┘
```

### Color Picker Elements

| Element | Size | Purpose |
|---------|------|---------|
| Swatch | 40x40px | Visual preview |
| Hex Input | ~100px | Manual entry |
| Copy Button | 32x32px | Copy hex value |
| Color Input | 40x40px | Browser picker |

### Interaction Flow

```
User Action
├── Click Swatch → Opens browser color picker
├── Use Browser Picker → Updates value via onChange
├── Type in Hex Input → Validates and updates
├── Click Copy → Copies hex to clipboard
└── Keyboard Nav → Tab through all elements
```

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Hex Format | Matches /^#[0-9A-Fa-f]{6}$/ | "Invalid hex color" |
| Required | Value not empty | "Color is required" |
| Disabled | No interaction when disabled | - |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | `<label htmlFor={inputId}>` |
| ARIA | aria-describedby for description |
| Focus | Visible focus indicators |
| Keyboard | All functions keyboard-accessible |
| Screen Reader | Announce color changes |

### Expected Outcome
- Reusable color picker component
- Multiple input methods (swatch, picker, hex)
- Copy-to-clipboard functionality
- Full accessibility support

### Verification Checklist
- [ ] `ColorPicker.tsx` component created
- [ ] All props defined and typed
- [ ] Color swatch displays current value
- [ ] Browser color input functional
- [ ] Hex text input with validation
- [ ] Copy button works correctly
- [ ] onChange callback fires properly
- [ ] Accessibility features implemented
- [ ] Error handling in place
- [ ] Component exports properly

---

## Task 21: Create Color Swatch Preview

### Overview
Create the ColorSwatch component that displays a visual preview of the selected color. This component shows the current color as a colored square with proper styling, borders, and click interaction to open the color picker.

### Dependencies
- Task 20: Create Color Picker Component (integrated within)

### Instructions

1. **Create ColorSwatch component file**
   - Create `ColorSwatch.tsx` in `Colors/` directory
   - Set up simple, focused component
   - Make reusable for any color preview

2. **Define swatch props**
   - color: hex color to display
   - size: small, medium, or large
   - onClick: optional click handler
   - disabled: optional disabled state
   - className: additional styling

3. **Implement swatch display**
   - Create div with background color from props
   - Apply fixed dimensions based on size
   - Add border for definition
   - Apply border-radius for rounded corners

4. **Add visual enhancements**
   - Add subtle shadow for depth
   - Add hover effect (scale or glow)
   - Add active/pressed state
   - Add disabled state styling

5. **Handle transparency**
   - Add checkerboard pattern background for alpha channel
   - Display transparency if color includes alpha
   - Ensure checkerboard visible behind color

6. **Make clickable**
   - Add cursor pointer on hover
   - Connect onClick handler
   - Add keyboard interaction (Space/Enter)
   - Add focus ring for accessibility

7. **Add loading state**
   - Show skeleton or spinner if color loading
   - Animate transition when color changes
   - Handle invalid color gracefully

### Swatch Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| color | string | Yes | - | Hex color to display |
| size | "sm" \| "md" \| "lg" | No | "md" | Swatch size |
| onClick | () => void | No | undefined | Click handler |
| disabled | boolean | No | false | Disabled state |
| className | string | No | "" | Additional classes |

### Size Specifications

| Size | Dimensions | Border | Use Case |
|------|------------|--------|----------|
| Small | 24x24px | 1px | Inline preview |
| Medium | 40x40px | 2px | Standard picker |
| Large | 60x60px | 2px | Prominent display |

### Swatch Visual Design

```
┌────────────────┐
│ ┌────────────┐ │ ← 4px padding
│ │            │ │
│ │    ████    │ │ ← Color fill
│ │    ████    │ │
│ │            │ │
│ └────────────┘ │
│   2px border   │
│   8px radius   │
└────────────────┘
```

### Swatch States

| State | Appearance | Cursor |
|-------|------------|--------|
| Default | Solid color, border | default |
| Hover | Scale 1.05, shadow | pointer |
| Active | Scale 0.95 | pointer |
| Disabled | Opacity 0.5, no interaction | not-allowed |
| Focus | Blue ring, 3px offset | pointer |

### Styling Classes

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `relative rounded-lg border-2` | Base structure |
| Color Fill | `w-full h-full rounded` | Color display |
| Hover | `hover:scale-105 transition-transform` | Interaction |
| Disabled | `opacity-50 cursor-not-allowed` | Disabled state |
| Focus | `focus:ring-2 focus:ring-blue-500` | Accessibility |

### Transparency Pattern

```
Background Pattern (for alpha)
┌─┬─┬─┬─┐
│░│▓│░│▓│  ← Checkerboard
├─┼─┼─┼─┤     8x8px squares
│▓│░│▓│░│     #e5e5e5 / #f5f5f5
└─┴─┴─┴─┘
```

### Expected Outcome
- Visual color preview component
- Clickable to open picker
- Proper sizing options
- Interactive states (hover, active, disabled)

### Verification Checklist
- [ ] `ColorSwatch.tsx` component created
- [ ] Color displays correctly from prop
- [ ] Border and border-radius applied
- [ ] Size variants functional (sm, md, lg)
- [ ] onClick handler works
- [ ] Hover effect implemented
- [ ] Disabled state styling correct
- [ ] Keyboard accessible
- [ ] Focus indicator visible

---

## Task 22: Create Hex Input

### Overview
Create the HexInput component that provides a text input field for manually entering hex color codes. This component includes validation, formatting, auto-prefix handling, and user feedback for invalid entries.

### Dependencies
- Task 20: Create Color Picker Component (integrated within)

### Instructions

1. **Create HexInput component file**
   - Create `HexInput.tsx` in `Colors/` directory
   - Set up controlled input component
   - Implement validation logic

2. **Define component props**
   - value: current hex value
   - onChange: callback for valid changes
   - onBlur: optional blur handler
   - disabled: disabled state
   - error: validation error message

3. **Implement input field**
   - Create text input with monospace font
   - Set maxLength to 7 characters (#RRGGBB)
   - Add placeholder "#000000"
   - Style with design system

4. **Add auto-prefix handling**
   - Automatically prepend "#" if user omits it
   - Don't duplicate "#" if already present
   - Allow user to type with or without "#"

5. **Implement hex validation**
   - Validate format: /^#[0-9A-Fa-f]{6}$/
   - Check on each keystroke (live validation)
   - Validate on blur (final check)
   - Provide clear error messages

6. **Add character filtering**
   - Only allow hex characters (0-9, A-F)
   - Convert input to uppercase or lowercase
   - Prevent invalid character entry

7. **Add visual validation feedback**
   - Show red border for invalid input
   - Show green border/checkmark for valid input
   - Display error message below input
   - Add validation icon (check or X)

8. **Implement copy functionality**
   - Add copy button next to input
   - Copy current value to clipboard
   - Show success feedback (tooltip)

9. **Add keyboard shortcuts**
   - Ctrl+A to select all
   - Escape to clear or revert
   - Enter to apply and blur

### Component Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Current hex value |
| onChange | (hex: string) => void | Yes | - | Valid color handler |
| onBlur | () => void | No | undefined | Blur handler |
| disabled | boolean | No | false | Disabled state |
| error | string | No | "" | Error message |
| label | string | No | "Hex Code" | Input label |

### Input Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Type | text | Character input |
| MaxLength | 7 | #RRGGBB format |
| Pattern | [#0-9A-Fa-f]+ | Hex validation |
| Font | Monospace | Readability |
| Width | ~120px | Fit hex code |

### Validation States

```
Input Value → Validation → Result
────────────────────────────────────
"2563eb"    → Add "#"    → "#2563eb" ✓
"#2563eb"   → Valid      → "#2563eb" ✓
"#2563e"    → Too short  → Error ✗
"#gggggg"   → Invalid    → Error ✗
"#2563EB"   → Valid      → "#2563EB" ✓
""          → Empty      → Required ✗
```

### Validation Rules

| Rule | Regex/Logic | Error Message |
|------|-------------|---------------|
| Format | /^#[0-9A-Fa-f]{6}$/ | "Must be valid hex (#RRGGBB)" |
| Length | 7 characters | "Must be 6 digits plus #" |
| Required | Not empty | "Hex code required" |
| Characters | Only 0-9, A-F | "Only hex digits allowed" |

### Input Styling

| State | Border | Icon | Purpose |
|-------|--------|------|---------|
| Default | Gray | - | Neutral |
| Focus | Blue | - | Active editing |
| Valid | Green | ✓ | Correct format |
| Invalid | Red | ✗ | Error state |
| Disabled | Gray light | - | Inactive |

### Input Layout

```
┌─────────────────────────────┐
│ Hex Code                    │
│ ┌─────────────┬───┬───┐    │
│ │ #2563eb     │ ✓ │ 📋│    │
│ └─────────────┴───┴───┘    │
│   ↑ Input   ↑Valid ↑Copy   │
└─────────────────────────────┘
```

### Character Handling

| Input | Processing | Output |
|-------|------------|--------|
| "2563eb" | Add "#" prefix | "#2563eb" |
| "#2563eb" | No change | "#2563eb" |
| "2563EB" | Add "#", keep case | "#2563EB" |
| "##2563eb" | Remove duplicate # | "#2563eb" |
| "256xyz" | Filter invalid | "256" |

### Expected Outcome
- Text input for hex color codes
- Automatic "#" prefix handling
- Real-time validation
- Visual feedback for valid/invalid state

### Verification Checklist
- [ ] `HexInput.tsx` component created
- [ ] Input accepts hex characters only
- [ ] MaxLength set to 7 characters
- [ ] Auto-prefix "#" functionality works
- [ ] Validation on keystroke and blur
- [ ] Valid/invalid visual feedback
- [ ] Error messages display correctly
- [ ] Copy button functional
- [ ] Keyboard shortcuts implemented
- [ ] Monospace font applied

---

## Task 23: Create Color Presets

### Overview
Create a ColorPresets component that displays pre-defined color scheme options for quick theme selection. Store owners can choose from curated color combinations (Modern Blue, Forest Green, Royal Purple, Coral) to instantly apply a complete color scheme.

### Dependencies
- Task 17: Create Color Settings Section
- Tasks 18, 19: Color pickers to apply preset values

### Instructions

1. **Create ColorPresets component file**
   - Create `ColorPresets.tsx` in `Colors/` directory
   - Set up component for displaying preset grid
   - Design for visual appeal and clarity

2. **Define preset data structure**
   - Create array of preset objects
   - Each preset includes: id, name, primary, secondary, accent, background, text
   - Store in separate presets.ts configuration file

3. **Create preset definitions**
   - Modern Blue: primary #2563eb, secondary #64748b
   - Forest Green: primary #059669, secondary #374151
   - Royal Purple: primary #7c3aed, secondary #4b5563
   - Coral: primary #f97316, secondary #475569
   - Add more presets as needed

4. **Implement preset grid layout**
   - Display presets as clickable cards
   - Show preset name
   - Display primary and secondary color swatches
   - Use grid layout (2 columns on mobile, 4 on desktop)

5. **Add preset selection**
   - Track selected/active preset
   - Highlight selected preset with border or background
   - Handle click to apply preset
   - Update all color values when preset selected

6. **Implement apply preset function**
   - Update primary color in theme state
   - Update secondary color
   - Update accent (derived or preset)
   - Update background and text if included
   - Trigger palette generation

7. **Add visual feedback**
   - Show hover state on preset cards
   - Indicate currently active preset
   - Show checkmark or badge on selected
   - Animate transition on selection

8. **Add custom preset option**
   - Include "Custom" preset card
   - Automatically select when colors manually changed
   - Allow saving current colors as custom preset

### Preset Data Structure

```typescript
interface ColorPreset {
  id: string;
  name: string;
  description?: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    text?: string;
  };
}
```

### Pre-defined Presets

| Preset Name | Primary | Secondary | Accent | Theme |
|-------------|---------|-----------|--------|-------|
| Modern Blue | #2563eb | #64748b | #3b82f6 | Professional |
| Forest Green | #059669 | #374151 | #10b981 | Natural |
| Royal Purple | #7c3aed | #4b5563 | #a855f7 | Elegant |
| Coral | #f97316 | #475569 | #fb923c | Energetic |
| Midnight | #1e293b | #64748b | #38bdf8 | Modern |
| Sunset | #dc2626 | #f59e0b | #fbbf24 | Warm |

### Preset Card Layout

```
┌──────────────┐ ┌──────────────┐
│ Modern Blue  │ │ Forest Green │
│ ┌──┐ ┌──┐   │ │ ┌──┐ ┌──┐   │
│ │██│ │▓▓│   │ │ │██│ │▓▓│   │
│ └──┘ └──┘   │ │ └──┘ └──┘   │
│ Professional │ │ Natural      │
│      ✓       │ │              │
└──────────────┘ └──────────────┘
  ↑ Selected
```

### Preset Card Specifications

| Element | Size/Style | Purpose |
|---------|------------|---------|
| Card | 140x100px | Preset container |
| Name | font-medium | Preset label |
| Swatches | 30x30px each | Color preview |
| Border | 2px solid | Selection indicator |
| Hover | Scale 1.02 | Interaction |

### Preset Grid Layout

| Breakpoint | Columns | Gap | Purpose |
|------------|---------|-----|---------|
| Mobile (< 640px) | 2 | 0.5rem | Compact |
| Tablet (640-1024px) | 3 | 0.75rem | Balanced |
| Desktop (> 1024px) | 4 | 1rem | Full display |

### Selection States

| State | Visual | Description |
|-------|--------|-------------|
| Unselected | Gray border | Available preset |
| Hover | Blue border, slight scale | Interactive |
| Selected | Blue border, checkmark | Active preset |
| Custom | Dashed border | Manual colors |

### Apply Preset Flow

```
User Clicks Preset
     │
     ├─→ Get preset colors
     ├─→ Update theme state
     │   ├─→ primary
     │   ├─→ secondary
     │   ├─→ accent
     │   ├─→ background
     │   └─→ text
     ├─→ Generate palettes
     ├─→ Apply to CSS variables
     └─→ Mark preset as selected
```

### Custom Preset Handling

| Action | Effect |
|--------|--------|
| Manual Color Change | Select "Custom" preset |
| Apply Preset | Deselect "Custom" |
| Save Custom | Store in localStorage |
| Load Custom | Restore saved colors |

### Expected Outcome
- Visual preset selector with color swatches
- Clickable preset cards
- One-click theme application
- Clear indication of selected preset

### Verification Checklist
- [ ] `ColorPresets.tsx` component created
- [ ] Preset data structure defined
- [ ] At least 4-6 presets created
- [ ] Preset grid displays correctly
- [ ] Preset cards show primary and secondary colors
- [ ] Click handler applies all preset colors
- [ ] Selected preset highlighted
- [ ] Custom preset option included
- [ ] Responsive grid layout works
- [ ] Component exports properly

---

## Task 24: Create Accent Color

### Overview
Create the accent color picker within the UI Colors section. The accent color is used for interactive elements like buttons, links, and highlights that need to stand out from the primary and secondary brand colors.

### Dependencies
- Task 17: Create Color Settings Section
- Task 20: Create Color Picker Component

### Instructions

1. **Add accent color field to ColorSettings**
   - Position within UI Colors subsection
   - Add label "Accent Color"
   - Add description explaining accent usage

2. **Implement accent color picker**
   - Use ColorPicker component (Task 20)
   - Pass current accent color value
   - Handle onChange events
   - Update theme state

3. **Set intelligent default**
   - Default to primary color if not set
   - Auto-adjust to complement primary
   - Allow manual override

4. **Define accent usage**
   - Call-to-action buttons
   - Active states in navigation
   - Link hover colors
   - Badge and tag backgrounds
   - Important highlights

5. **Add contrast validation**
   - Check contrast with white (#ffffff)
   - Check contrast with background color
   - Warn if insufficient (< 4.5:1)
   - Suggest adjustments

6. **Implement preview**
   - Show sample button with accent color
   - Show sample link with accent color
   - Update preview in real-time

7. **Connect to theme system**
   - Store in theme context state
   - Apply to CSS variable (--theme-accent)
   - Trigger preview updates

### Accent Color Usage

| Element | Application | Example |
|---------|-------------|---------|
| CTA Buttons | Background | "Buy Now", "Add to Cart" |
| Links | Color on hover | Product links |
| Badges | Background | "New", "Sale" |
| Active State | Border/background | Active nav item |
| Highlights | Text or background | Featured content |

### Accent Color Guidelines

| Guideline | Recommendation | Reason |
|-----------|----------------|--------|
| Contrast | ≥ 4.5:1 with white | Accessibility |
| Brightness | High enough for visibility | Stand out |
| Saturation | Higher than brand colors | Attention-grabbing |
| Relationship | Complement primary | Harmony |

### Default Accent Logic

```
If accent not set:
  ├─→ Use primary color + 10% lightness
  ├─→ Or use triadic color of primary
  └─→ Ensure contrast requirements met

If manually set:
  └─→ Use custom value
```

### Accent Color Section Layout

```
UI COLORS
┌─────────────────────────────────┐
│ Accent Color                    │
│ Used for buttons and highlights │
│                                 │
│ [Color Picker Component]        │
│                                 │
│ Preview:                        │
│ [Add to Cart Button]            │
│ [Learn More Link →]             │
└─────────────────────────────────┘
```

### Validation Checks

| Check | Threshold | Action |
|-------|-----------|--------|
| Contrast with White | < 4.5:1 | Warning |
| Contrast with Background | < 3:1 | Warning |
| Too Similar to Primary | < 15% difference | Suggestion |
| Too Dark | Lightness < 30% | Warning |

### State Management

```
Theme Context
├── colors.accent: string
├── colors.accentShades: string[]
└── validation.accentContrast: number
```

### Expected Outcome
- Functional accent color picker
- Clear explanation of accent usage
- Contrast validation
- Real-time preview of accent in UI elements

### Verification Checklist
- [ ] Accent color picker added to UI Colors section
- [ ] Label and description present
- [ ] ColorPicker component integrated
- [ ] Default value logic implemented
- [ ] onChange updates theme state
- [ ] Contrast validation working
- [ ] Preview elements show accent color
- [ ] CSS variable updated (--theme-accent)

---

## Task 25: Create Background Color

### Overview
Create the background color picker within the Page Colors section. The background color sets the base color for the entire storefront page, affecting the overall mood and readability of the site.

### Dependencies
- Task 17: Create Color Settings Section
- Task 20: Create Color Picker Component

### Instructions

1. **Add background color field**
   - Position within Page Colors subsection
   - Add label "Background Color"
   - Add description about page background

2. **Implement background picker**
   - Use ColorPicker component
   - Pass current background value
   - Handle color changes
   - Update theme context

3. **Set appropriate default**
   - Default to white (#ffffff) or light gray (#f9fafb)
   - Allow any color selection
   - Support dark mode alternative

4. **Add brightness constraints**
   - Warn if background too dark (< 90% lightness for light mode)
   - Warn if background too bright (> 15% lightness for dark mode)
   - Suggest adjustments for readability

5. **Implement contrast checking**
   - Check contrast with text color (Task 26)
   - Ensure minimum 4.5:1 ratio
   - Display warning if insufficient
   - Auto-suggest text color adjustments

6. **Add preview panel**
   - Show large swatch of background
   - Display sample content with background
   - Show how text appears on background
   - Update preview in real-time

7. **Handle edge cases**
   - Pure black (#000000) - suggest for dark mode only
   - Pure white (#ffffff) - default for light mode
   - Very bright colors - warn about eye strain
   - Colorful backgrounds - check text readability

### Background Color Usage

| Element | Application |
|---------|-------------|
| Page Background | Main body background |
| Section Background | Content area base |
| Card Background | Component backgrounds |
| Modal Backdrop | Overlay backgrounds |

### Background Color Guidelines

| Mode | Lightness Range | Recommendation |
|------|----------------|----------------|
| Light Mode | 90-100% | White to light gray |
| Dark Mode | 5-15% | Near black to dark gray |
| Custom | Any | Ensure text contrast |

### Background Picker Layout

```
PAGE COLORS
┌──────────────────────────────────┐
│ Background Color                 │
│ Main page background             │
│                                  │
│ [Color Picker Component]         │
│                                  │
│ Preview:                         │
│ ┌──────────────────────────────┐│
│ │ ████████████████████████████ ││
│ │ ████████████████████████████ ││
│ │    Sample text on BG         ││
│ │ ████████████████████████████ ││
│ └──────────────────────────────┘│
│                                  │
│ Contrast with text: 12.5:1 ✓    │
└──────────────────────────────────┘
```

### Validation Rules

| Rule | Check | Warning |
|------|-------|---------|
| Too Dark (Light Mode) | Lightness < 85% | May affect readability |
| Too Bright (Dark Mode) | Lightness > 20% | Not suitable for dark mode |
| Contrast with Text | < 4.5:1 | Text not readable |
| High Saturation | > 50% | May cause eye strain |

### Contrast Relationship

```
Background (#ffffff)
     │
     ├─→ Check with Text Color
     │   ├─→ Ratio: 21:1 (excellent)
     │   └─→ WCAG Level: AAA
     │
     ├─→ Check with Primary
     └─→ Check with Accent
```

### State Structure

```
Theme Context
├── colors.background: string
├── colors.text: string
├── validation
│   ├── bgTextContrast: number
│   └── bgTextLevel: "AAA" | "AA" | "Fail"
└── warnings[]
```

### Dark Mode Considerations

| Property | Light Mode | Dark Mode |
|----------|------------|-----------|
| Default | #ffffff | #0f172a |
| Lightness | 95-100% | 5-15% |
| Text Color | Dark (#1f2937) | Light (#f1f5f9) |

### Expected Outcome
- Background color picker with preview
- Contrast validation with text color
- Warnings for readability issues
- Large preview showing actual appearance

### Verification Checklist
- [ ] Background color picker added to Page Colors
- [ ] Label and description clear
- [ ] Default value set appropriately
- [ ] ColorPicker integrated
- [ ] Large preview panel implemented
- [ ] Contrast check with text color
- [ ] Warnings for problematic values
- [ ] CSS variable updated (--theme-bg)
- [ ] Real-time preview updates

---

## Task 26: Create Text Color

### Overview
Create the text color picker within the Page Colors section. The text color determines the color of body text throughout the storefront, and must maintain sufficient contrast with the background for readability and accessibility.

### Dependencies
- Task 17: Create Color Settings Section
- Task 20: Create Color Picker Component
- Task 25: Create Background Color (for contrast checking)

### Instructions

1. **Add text color field**
   - Position below background in Page Colors section
   - Add label "Text Color"
   - Add description about body text

2. **Implement text color picker**
   - Use ColorPicker component
   - Pass current text color value
   - Handle onChange events
   - Update theme state immediately

3. **Set appropriate default**
   - Default to dark gray (#1f2937) for light backgrounds
   - Default to light gray (#f1f5f9) for dark backgrounds
   - Auto-adjust based on background color

4. **Implement smart contrast checking**
   - Calculate contrast ratio with background
   - Check against WCAG AA (4.5:1) and AAA (7:1) standards
   - Display contrast ratio prominently
   - Show pass/fail indicators

5. **Add auto-suggest feature**
   - Suggest optimal text color for current background
   - Offer "Auto" button to apply suggestion
   - Calculate based on background lightness
   - Ensure maximum readability

6. **Implement visual preview**
   - Show sample paragraph with text color
   - Display on current background color
   - Include various text sizes (body, heading)
   - Update preview in real-time

7. **Add warning system**
   - Red alert for ratios < 3:1 (fail)
   - Yellow warning for 3:1 - 4.5:1 (AA Large only)
   - Green checkmark for ≥ 4.5:1 (AA)
   - Double checkmark for ≥ 7:1 (AAA)

8. **Handle light/dark mode**
   - Provide separate suggestions for light and dark modes
   - Allow saving mode-specific text colors
   - Switch preview based on background

### Text Color Usage

| Element | Application |
|---------|-------------|
| Body Text | Main content paragraphs |
| Headings | Page and section headings |
| Labels | Form labels and field text |
| Navigation | Menu item text |
| Descriptions | Product descriptions |

### Text Color Guidelines

| Background | Recommended Text | Contrast Ratio |
|------------|-----------------|----------------|
| White (#ffffff) | Dark Gray (#1f2937) | 16.1:1 (AAA) |
| Light Gray (#f9fafb) | Dark Gray (#111827) | 17.5:1 (AAA) |
| Dark (#0f172a) | Light Gray (#f1f5f9) | 15.2:1 (AAA) |
| Black (#000000) | White (#ffffff) | 21:1 (AAA) |

### WCAG Contrast Standards

| Level | Ratio | Large Text | Normal Text | Description |
|-------|-------|------------|-------------|-------------|
| Fail | < 3:1 | ✗ | ✗ | Not accessible |
| AA Large | 3:1 - 4.5:1 | ✓ | ✗ | Large text only |
| AA | 4.5:1 - 7:1 | ✓ | ✓ | Minimum |
| AAA | ≥ 7:1 | ✓ | ✓ | Enhanced |

### Text Color Section Layout

```
PAGE COLORS
┌─────────────────────────────────────┐
│ Text Color                          │
│ Main text throughout the site       │
│                                     │
│ [Color Picker] [Auto] 15.8:1 ✓✓    │
│                  ↑ Contrast AAA     │
│                                     │
│ Preview:                            │
│ ┌─────────────────────────────────┐│
│ │ This is sample body text that   ││
│ │ demonstrates how the text color ││
│ │ appears on the selected         ││
│ │ background color.               ││
│ │                                 ││
│ │ # Heading Example               ││
│ │ Paragraph text continues here.  ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Contrast Calculation

```
Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)

Where:
├── L1 = Relative luminance of lighter color
└── L2 = Relative luminance of darker color

Example:
├── Background: #ffffff (L = 1.0)
├── Text: #1f2937 (L = 0.06)
└── Ratio: (1.0 + 0.05) / (0.06 + 0.05) = 9.5:1 ✓ AAA
```

### Auto-Suggest Logic

```
If background lightness > 50%:
  └─→ Suggest dark text (#1f2937 or #111827)

If background lightness ≤ 50%:
  └─→ Suggest light text (#f1f5f9 or #ffffff)

Validation:
  ├─→ Calculate contrast ratio
  ├─→ If < 4.5:1, adjust lightness
  └─→ Return text color with ≥ 7:1 ratio
```

### Warning Display

| Ratio | Icon | Color | Message |
|-------|------|-------|---------|
| < 3:1 | ✗ | Red | "Fails WCAG - Not readable" |
| 3-4.5:1 | ⚠ | Yellow | "AA Large only" |
| 4.5-7:1 | ✓ | Green | "AA - Good" |
| ≥ 7:1 | ✓✓ | Green | "AAA - Excellent" |

### State Management

```
Theme Context
├── colors
│   ├── background: string
│   ├── text: string
│   └── textAutoSuggested: string
└── validation
    ├── textContrast: number
    ├── textContrastLevel: "AAA" | "AA" | "AA-Large" | "Fail"
    └── textContrastPass: boolean
```

### Expected Outcome
- Text color picker with contrast checking
- Real-time WCAG compliance validation
- Auto-suggest feature for optimal text color
- Visual preview with sample text

### Verification Checklist
- [ ] Text color picker added to Page Colors section
- [ ] Default values appropriate for background
- [ ] Contrast ratio calculated and displayed
- [ ] WCAG level indicator shown
- [ ] Auto-suggest button functional
- [ ] Preview panel with sample text
- [ ] Warning system for low contrast
- [ ] Real-time preview updates
- [ ] CSS variable updated (--theme-text)
- [ ] Both light and dark mode considerations

---

## Summary

This document established the comprehensive color customization system for the theme engine, including color pickers for primary, secondary, accent, background, and text colors. The system provides reusable components (ColorPicker, ColorSwatch, HexInput), pre-defined color presets for quick selection, and robust validation to ensure accessibility compliance.

### Completed Tasks
1. ✓ Created Color Settings Section with organized groups
2. ✓ Created Primary Color Picker for main brand color
3. ✓ Created Secondary Color Picker for complementary color
4. ✓ Created reusable Color Picker Component with multiple input methods
5. ✓ Created Color Swatch Preview for visual feedback
6. ✓ Created Hex Input with validation and copy functionality
7. ✓ Created Color Presets with curated color schemes
8. ✓ Created Accent Color option for UI highlights
9. ✓ Created Background Color option with contrast checking
10. ✓ Created Text Color option with WCAG compliance validation

### Component Architecture

```
Colors/
├── ColorSettings.tsx      (Main section container)
├── ColorPicker.tsx        (Reusable picker component)
├── ColorSwatch.tsx        (Color preview)
├── HexInput.tsx          (Manual hex entry)
├── ColorPresets.tsx       (Preset selector)
└── index.ts              (Exports)
```

### State Structure

```typescript
ThemeState.colors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  selectedPreset: string | null;
  // Generated in Task 27
  primaryShades: string[];
  secondaryShades: string[];
};
```

### Next Steps
Proceed to [02_Tasks-27-34_Palette-Preview-Verify.md](02_Tasks-27-34_Palette-Preview-Verify.md) to create palette generation, contrast checking, color application to CSS variables, reset functionality, color previews for UI elements, and final verification of the complete color system.

---

**Document Status:** Complete  
**Total Tasks:** 10 of 10  
**Estimated Implementation Time:** 4-5 hours
