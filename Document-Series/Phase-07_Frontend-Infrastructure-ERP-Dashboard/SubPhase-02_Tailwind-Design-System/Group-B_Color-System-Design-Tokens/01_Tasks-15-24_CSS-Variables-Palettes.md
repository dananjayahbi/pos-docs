# Tasks 15-24: CSS Variables and Color Palettes

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** B - Color System & Design Tokens  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-30_DarkMode-Utilities-Docs.md](02_Tasks-25-30_DarkMode-Utilities-Docs.md)

---

## Document Overview

This document establishes the complete color system using CSS custom properties and defines all color palettes. Creates primary, secondary, success, warning, error, and info color palettes with full shade ranges, plus semantic colors for backgrounds, foregrounds, and borders.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Define CSS Custom Properties | Medium | 30 min |
| 16 | Configure Primary Color Palette | Low | 15 min |
| 17 | Configure Secondary Color Palette | Low | 15 min |
| 18 | Configure Success Color Palette | Low | 15 min |
| 19 | Configure Warning Color Palette | Low | 15 min |
| 20 | Configure Error Color Palette | Low | 15 min |
| 21 | Configure Info Color Palette | Low | 15 min |
| 22 | Define Background Colors | Low | 20 min |
| 23 | Define Foreground Colors | Low | 15 min |
| 24 | Define Border Colors | Low | 15 min |

---

## Task 15: Define CSS Custom Properties

### Overview
Establish the CSS custom properties architecture using HSL color format in the globals.css file. This creates a flexible color system that supports theme switching, dark mode, and dynamic color manipulation.

### Dependencies
- Task 05: Create Global CSS File
- Task 08: Configure Tailwind Utilities Layer

### Instructions

1. **Open globals.css file**
   - Navigate to frontend/styles/globals.css
   - File should contain three Tailwind directives
   - Position cursor after @tailwind utilities

2. **Add root selector**
   - Create :root selector for light theme
   - Add blank line before it for separation
   - This will contain light mode CSS variables

3. **Add layer comment**
   - Add comment explaining color system
   - Note HSL format usage
   - Explain theme switching capability

4. **Choose HSL color format**
   - Use HSL without hsl() wrapper
   - Format: "222.2 84% 4.9%"
   - Allows flexible manipulation
   - Compatible with Tailwind theme

5. **Plan variable naming convention**
   - Use descriptive names: --primary, --secondary
   - Semantic names: --background, --foreground
   - State-based: --success, --warning, --error
   - Component-specific: --card, --popover

6. **Prepare variable structure**
   - Group by category (palettes, semantic, states)
   - Use comments to organize sections
   - Maintain consistent naming pattern

7. **Set up for shade ranges**
   - Plan for 50-950 shade ranges
   - Format: --primary-50, --primary-500, --primary-950
   - Enables precise color control

### HSL Format Benefits

| Benefit | Description |
|---------|-------------|
| Flexibility | Easy lightness/saturation adjustment |
| Readability | Intuitive color representation |
| Manipulation | Simple theme variations |
| Consistency | Standard across design system |

### Variable Naming Convention

| Category | Pattern | Example |
|----------|---------|---------|
| Brand colors | --{name}-{shade} | --primary-500 |
| Semantic | --{purpose} | --background |
| States | --{state} | --success |
| Components | --{component}-{property} | --card-foreground |

### Color System Architecture
```
:root (Light Theme)
├── Color Palettes (Tasks 16-21)
│   ├── Primary (blue)
│   ├── Secondary (slate)
│   ├── Success (green)
│   ├── Warning (amber)
│   ├── Error (red)
│   └── Info (blue variant)
├── Semantic Colors (Tasks 22-24)
│   ├── Backgrounds
│   ├── Foregrounds
│   └── Borders
└── Special Purpose
    ├── Charts
    └── Status
```

### Expected Outcome
- :root selector created in globals.css
- HSL format chosen and documented
- Variable naming convention established
- Structure ready for color definitions
- Foundation for complete color system

### Verification Checklist
- [ ] globals.css opened successfully
- [ ] :root selector added after @tailwind utilities
- [ ] Comment explaining color system added
- [ ] HSL format documented
- [ ] Variable naming convention understood
- [ ] Structure organized and clean
- [ ] Ready for color palette definitions

---

## Task 16: Configure Primary Color Palette

### Overview
Define the primary brand color palette with full shade range (50-950) using blue color family. This palette will be used for primary actions, active states, and key interactive elements throughout the application.

### Dependencies
- Task 15: Define CSS Custom Properties

### Instructions

1. **Add primary palette section**
   - Inside :root selector
   - Add comment: "Primary Color Palette"
   - Group all primary shades together

2. **Define lightest shade (50)**
   - Variable: --primary-50
   - Very light blue for backgrounds
   - HSL: 221 100% 97%
   - Subtle, minimal color

3. **Define light shades (100-400)**
   - --primary-100: 221 100% 94%
   - --primary-200: 221 100% 88%
   - --primary-300: 221 100% 82%
   - --primary-400: 221 100% 71%
   - Used for hover states, light backgrounds

4. **Define medium shade (500)**
   - Variable: --primary-500
   - Main brand color
   - HSL: 221 83% 53%
   - Default primary color
   - Used for buttons, links, active states

5. **Define dark shades (600-900)**
   - --primary-600: 221 83% 47%
   - --primary-700: 221 83% 40%
   - --primary-800: 221 83% 33%
   - --primary-900: 221 83% 27%
   - Used for hover/active states, text on light

6. **Define darkest shade (950)**
   - Variable: --primary-950
   - Very dark blue
   - HSL: 221 83% 20%
   - Used for text, strong emphasis

7. **Define semantic primary variables**
   - --primary: Same as --primary-500 (default)
   - --primary-foreground: White or light text
   - For text on primary colored backgrounds

### Primary Color Palette Structure

| Shade | HSL Value | Lightness | Use Case |
|-------|-----------|-----------|----------|
| 50 | 221 100% 97% | Very light | Backgrounds, subtle highlights |
| 100 | 221 100% 94% | Light | Hover states, light backgrounds |
| 200 | 221 100% 88% | Light | Borders, dividers |
| 300 | 221 100% 82% | Medium-light | Disabled states |
| 400 | 221 100% 71% | Medium-light | Muted elements |
| 500 | 221 83% 53% | Medium | **Primary brand color** |
| 600 | 221 83% 47% | Medium-dark | Hover states |
| 700 | 221 83% 40% | Dark | Active states |
| 800 | 221 83% 33% | Dark | Strong emphasis |
| 900 | 221 83% 27% | Very dark | Text on light |
| 950 | 221 83% 20% | Darkest | Headers, strong text |

### Color Usage Guidelines
- 50-200: Backgrounds and subtle elements
- 300-400: Muted interactive elements
- 500: Default brand color (buttons, links)
- 600-700: Hover and active states
- 800-950: Text and strong emphasis

### Expected Outcome
- Complete primary color palette defined
- Full shade range (50-950)
- Semantic variables (--primary, --primary-foreground)
- Blue color family consistent throughout
- Ready for use in components

### Verification Checklist
- [ ] Primary palette section added to :root
- [ ] All shades 50-950 defined
- [ ] HSL values in correct format
- [ ] --primary variable points to 500
- [ ] --primary-foreground defined
- [ ] Values follow consistent pattern
- [ ] No syntax errors

---

## Task 17: Configure Secondary Color Palette

### Overview
Define the secondary color palette using slate (neutral gray) with full shade range. Secondary colors provide neutral alternatives to primary colors and are used for text, borders, and backgrounds.

### Dependencies
- Task 15: Define CSS Custom Properties

### Instructions

1. **Add secondary palette section**
   - Below primary palette
   - Add comment: "Secondary Color Palette"
   - Group all secondary shades

2. **Define slate shade range (50-950)**
   - Use slate/gray color family
   - Neutral, professional tone
   - Full spectrum from white to black

3. **Define specific shades**
   - --secondary-50: 210 40% 98%
   - --secondary-100: 210 40% 96%
   - --secondary-200: 214 32% 91%
   - --secondary-300: 213 27% 84%
   - --secondary-400: 215 20% 65%
   - --secondary-500: 215 16% 47%
   - --secondary-600: 215 19% 35%
   - --secondary-700: 215 25% 27%
   - --secondary-800: 217 33% 17%
   - --secondary-900: 222 47% 11%
   - --secondary-950: 229 84% 5%

4. **Define semantic secondary variables**
   - --secondary: Same as --secondary-500
   - --secondary-foreground: White text
   - For text on secondary backgrounds

### Secondary Color Purpose

| Usage | Description |
|-------|-------------|
| Text | Primary and secondary text colors |
| Borders | Subtle separators and outlines |
| Backgrounds | Card backgrounds, panels |
| Disabled states | Inactive elements |
| Shadows | Drop shadows and elevation |

### Expected Outcome
- Complete secondary/slate palette
- Neutral color options available
- Balanced grayscale progression
- Versatile for UI elements

### Verification Checklist
- [ ] Secondary palette section added
- [ ] All shades 50-950 defined
- [ ] Slate/gray color family used
- [ ] --secondary and --secondary-foreground defined
- [ ] Neutral appearance maintained
- [ ] No syntax errors

---

## Task 18: Configure Success Color Palette

### Overview
Define the success state color palette using green color family. Success colors indicate positive actions, completed states, and successful operations.

### Dependencies
- Task 15: Define CSS Custom Properties

### Instructions

1. **Add success palette section**
   - Below secondary palette
   - Add comment: "Success Color Palette"
   - Group success shades

2. **Define green shade range**
   - Use vibrant green for positivity
   - Full shade range (50-950)
   - Balanced saturation and lightness

3. **Define specific shades**
   - --success-50: 138 76% 97%
   - --success-100: 141 84% 93%
   - --success-200: 141 79% 85%
   - --success-300: 142 77% 73%
   - --success-400: 142 69% 58%
   - --success-500: 142 71% 45%
   - --success-600: 142 76% 36%
   - --success-700: 142 72% 29%
   - --success-800: 143 64% 24%
   - --success-900: 144 61% 20%
   - --success-950: 145 80% 10%

4. **Define semantic success variables**
   - --success: Same as --success-500
   - --success-foreground: White text
   - For text on success backgrounds

### Success Color Usage

| Context | Example |
|---------|---------|
| Buttons | Submit, Save, Confirm actions |
| Messages | Success notifications, alerts |
| Badges | Completed status, active state |
| Icons | Checkmarks, confirmation icons |
| Progress | Completed steps, achievements |

### Expected Outcome
- Complete success color palette
- Positive, encouraging green tones
- Accessible contrast ratios
- Ready for success states

### Verification Checklist
- [ ] Success palette section added
- [ ] Green color family used
- [ ] All shades 50-950 defined
- [ ] --success and --success-foreground defined
- [ ] Vibrant, positive appearance
- [ ] No syntax errors

---

## Task 19: Configure Warning Color Palette

### Overview
Define the warning state color palette using amber/yellow color family. Warning colors indicate caution, pending states, and situations requiring attention.

### Dependencies
- Task 15: Define CSS Custom Properties

### Instructions

1. **Add warning palette section**
   - Below success palette
   - Add comment: "Warning Color Palette"
   - Group warning shades

2. **Define amber shade range**
   - Use amber/yellow for attention
   - Full shade range (50-950)
   - Warm, noticeable tones

3. **Define specific shades**
   - --warning-50: 48 100% 96%
   - --warning-100: 48 96% 89%
   - --warning-200: 48 97% 77%
   - --warning-300: 46 97% 65%
   - --warning-400: 43 96% 56%
   - --warning-500: 38 92% 50%
   - --warning-600: 32 95% 44%
   - --warning-700: 26 90% 37%
   - --warning-800: 23 83% 31%
   - --warning-900: 22 78% 26%
   - --warning-950: 21 92% 14%

4. **Define semantic warning variables**
   - --warning: Same as --warning-500
   - --warning-foreground: Dark text
   - For text on warning backgrounds

### Warning Color Usage

| Context | Example |
|---------|---------|
| Alerts | Caution messages, warnings |
| Status | Pending, in-progress states |
| Badges | Attention required |
| Buttons | Caution actions |
| Highlights | Important information |

### Expected Outcome
- Complete warning color palette
- Attention-grabbing amber tones
- Balanced visibility
- Ready for warning states

### Verification Checklist
- [ ] Warning palette section added
- [ ] Amber/yellow color family used
- [ ] All shades 50-950 defined
- [ ] --warning and --warning-foreground defined
- [ ] Visible, attention-grabbing appearance
- [ ] No syntax errors

---

## Task 20: Configure Error Color Palette

### Overview
Define the error state color palette using red color family. Error colors indicate negative actions, failed operations, and destructive states.

### Dependencies
- Task 15: Define CSS Custom Properties

### Instructions

1. **Add error palette section**
   - Below warning palette
   - Add comment: "Error/Danger Color Palette"
   - Group error shades

2. **Define red shade range**
   - Use strong red for urgency
   - Full shade range (50-950)
   - Clear, unmistakable error indication

3. **Define specific shades**
   - --error-50: 0 86% 97%
   - --error-100: 0 93% 94%
   - --error-200: 0 96% 89%
   - --error-300: 0 94% 82%
   - --error-400: 0 91% 71%
   - --error-500: 0 84% 60%
   - --error-600: 0 72% 51%
   - --error-700: 0 74% 42%
   - --error-800: 0 70% 35%
   - --error-900: 0 63% 31%
   - --error-950: 0 75% 15%

4. **Define semantic error variables**
   - --error: Same as --error-500
   - --error-foreground: White text
   - For text on error backgrounds

5. **Add destructive alias**
   - --destructive: Same as --error-500
   - --destructive-foreground: Same as --error-foreground
   - Shadcn/UI compatibility

### Error Color Usage

| Context | Example |
|---------|---------|
| Alerts | Error messages, failures |
| Validation | Form errors, invalid input |
| Buttons | Delete, remove, cancel actions |
| Badges | Failed status, error state |
| Icons | Error icons, warnings |

### Expected Outcome
- Complete error color palette
- Clear, urgent red tones
- Strong visual indication
- Ready for error states

### Verification Checklist
- [ ] Error palette section added
- [ ] Red color family used
- [ ] All shades 50-950 defined
- [ ] --error and --error-foreground defined
- [ ] --destructive aliases added
- [ ] Strong, clear appearance
- [ ] No syntax errors

---

## Task 21: Configure Info Color Palette

### Overview
Define the info state color palette using a cyan/blue variant. Info colors indicate informational messages, help text, and neutral notifications.

### Dependencies
- Task 15: Define CSS Custom Properties

### Instructions

1. **Add info palette section**
   - Below error palette
   - Add comment: "Info Color Palette"
   - Group info shades

2. **Define cyan/blue shade range**
   - Use cyan or light blue
   - Distinct from primary blue
   - Full shade range (50-950)

3. **Define specific shades**
   - --info-50: 204 100% 97%
   - --info-100: 204 94% 94%
   - --info-200: 201 94% 86%
   - --info-300: 199 95% 74%
   - --info-400: 198 93% 60%
   - --info-500: 199 89% 48%
   - --info-600: 200 98% 39%
   - --info-700: 201 96% 32%
   - --info-800: 201 90% 27%
   - --info-900: 202 80% 24%
   - --info-950: 204 80% 16%

4. **Define semantic info variables**
   - --info: Same as --info-500
   - --info-foreground: White text
   - For text on info backgrounds

### Info Color Usage

| Context | Example |
|---------|---------|
| Alerts | Informational messages |
| Tooltips | Help text, guidance |
| Badges | Informational status |
| Highlights | Important information |
| Notices | Updates, announcements |

### Expected Outcome
- Complete info color palette
- Neutral, informative tones
- Distinct from primary colors
- Ready for info states

### Verification Checklist
- [ ] Info palette section added
- [ ] Cyan/light blue color family used
- [ ] All shades 50-950 defined
- [ ] --info and --info-foreground defined
- [ ] Distinct from primary blue
- [ ] No syntax errors

---

## Task 22: Define Background Colors

### Overview
Define semantic background color variables for various UI surfaces. Background colors provide the canvas for all other elements and establish visual hierarchy.

### Dependencies
- Task 15: Define CSS Custom Properties

### Instructions

1. **Add background colors section**
   - Below color palettes
   - Add comment: "Semantic Background Colors"
   - Group background variables

2. **Define primary background**
   - --background: 0 0% 100% (white)
   - Main page background
   - Default canvas color

3. **Define card background**
   - --card: 0 0% 100% (white)
   - Card and panel backgrounds
   - Same as background for light theme

4. **Define popover background**
   - --popover: 0 0% 100% (white)
   - Popup, dropdown backgrounds
   - Elevated surfaces

5. **Define muted background**
   - --muted: 210 40% 96% (light slate)
   - Subtle backgrounds
   - Disabled states, less emphasis

6. **Define accent background**
   - --accent: 210 40% 96% (light slate)
   - Hover states, highlights
   - Interactive surface backgrounds

7. **Add foreground pairs**
   - --card-foreground: Reference secondary-950
   - --popover-foreground: Reference secondary-950
   - --muted-foreground: Reference secondary-500
   - --accent-foreground: Reference secondary-900
   - Text colors for each background

### Background Color Hierarchy

| Variable | Color | Usage | Elevation |
|----------|-------|-------|-----------|
| background | White | Page background | Base |
| card | White | Card surfaces | Level 1 |
| popover | White | Dropdowns, modals | Level 2 |
| muted | Light slate | Subtle areas | Recessed |
| accent | Light slate | Hover states | Interactive |

### Expected Outcome
- Comprehensive background color system
- Clear visual hierarchy
- Paired with appropriate foreground colors
- Ready for UI composition

### Verification Checklist
- [ ] Background colors section added
- [ ] --background defined (white)
- [ ] --card and --card-foreground defined
- [ ] --popover and --popover-foreground defined
- [ ] --muted and --muted-foreground defined
- [ ] --accent and --accent-foreground defined
- [ ] Foreground pairs match backgrounds
- [ ] No syntax errors

---

## Task 23: Define Foreground Colors

### Overview
Define semantic foreground (text) color variables for various UI contexts. Foreground colors ensure readable, accessible text across all surfaces.

### Dependencies
- Task 15: Define CSS Custom Properties
- Task 17: Configure Secondary Color Palette

### Instructions

1. **Add foreground colors section**
   - Below background colors
   - Add comment: "Semantic Foreground Colors"
   - Group foreground variables

2. **Define primary foreground**
   - --foreground: Reference secondary-950
   - Main text color
   - Highest contrast, most readable

3. **Review background-paired foregrounds**
   - Already defined in Task 22
   - --card-foreground
   - --popover-foreground
   - --muted-foreground
   - --accent-foreground

4. **Verify contrast ratios**
   - Ensure WCAG AA compliance
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text

5. **Consider text hierarchy**
   - Primary text: --foreground
   - Secondary text: --muted-foreground
   - Disabled text: Lower opacity

### Foreground Color Usage

| Variable | Contrast | Usage |
|----------|----------|-------|
| foreground | Highest | Body text, headings |
| card-foreground | High | Text on cards |
| popover-foreground | High | Text in popovers |
| muted-foreground | Medium | Secondary text, labels |
| accent-foreground | High | Text on accent surfaces |

### Expected Outcome
- Complete foreground color system
- Accessible contrast ratios
- Clear text hierarchy
- Paired correctly with backgrounds

### Verification Checklist
- [ ] Foreground colors section present
- [ ] --foreground defined
- [ ] All foreground variants paired with backgrounds
- [ ] Contrast ratios meet accessibility standards
- [ ] Text hierarchy clear
- [ ] No syntax errors

---

## Task 24: Define Border Colors

### Overview
Define semantic border color variables for UI element separation. Border colors create visual boundaries and define interactive element states.

### Dependencies
- Task 15: Define CSS Custom Properties
- Task 17: Configure Secondary Color Palette

### Instructions

1. **Add border colors section**
   - Below foreground colors
   - Add comment: "Semantic Border Colors"
   - Group border variables

2. **Define default border**
   - --border: Reference secondary-200
   - Standard border color
   - Subtle but visible separation

3. **Define input border**
   - --input: Reference secondary-300
   - Form input borders
   - Slightly more prominent than default

4. **Define ring color**
   - --ring: Reference primary-500
   - Focus ring indicator
   - Accessible focus states
   - Uses primary brand color

5. **Consider border use cases**
   - Card borders
   - Input field outlines
   - Button borders
   - Dividers and separators
   - Focus indicators

### Border Color Purpose

| Variable | Color | Usage |
|----------|-------|-------|
| border | Light slate | Default borders, dividers |
| input | Medium slate | Form input borders |
| ring | Primary blue | Focus rings, keyboard navigation |

### Focus Ring Accessibility
- Must be visible against all backgrounds
- Minimum 3:1 contrast ratio
- Clear keyboard navigation indicator
- Primary color for brand consistency

### Expected Outcome
- Complete border color system
- Distinct border types for contexts
- Accessible focus indicators
- Consistent visual separation

### Verification Checklist
- [ ] Border colors section added
- [ ] --border defined (secondary-200)
- [ ] --input defined (secondary-300)
- [ ] --ring defined (primary-500)
- [ ] Focus ring meets accessibility standards
- [ ] Border hierarchy clear
- [ ] No syntax errors

---

## Summary

This document established the complete color foundation:

### Completed Tasks
1. ✅ Defined CSS custom properties architecture
2. ✅ Configured primary color palette (blue)
3. ✅ Configured secondary color palette (slate)
4. ✅ Configured success color palette (green)
5. ✅ Configured warning color palette (amber)
6. ✅ Configured error color palette (red)
7. ✅ Configured info color palette (cyan)
8. ✅ Defined background colors (background, card, popover, muted, accent)
9. ✅ Defined foreground colors (text colors)
10. ✅ Defined border colors (border, input, ring)

### Color System Structure
- 6 complete color palettes (50-950 shades)
- 5 background variants with paired foregrounds
- 3 border types for different contexts
- HSL format for flexibility
- Ready for dark mode implementation

### Files Modified
- styles/globals.css (CSS custom properties added)

### Next Steps
Proceed to [02_Tasks-25-30_DarkMode-Utilities-Docs.md](02_Tasks-25-30_DarkMode-Utilities-Docs.md) to configure dark mode, extend Tailwind theme, create utility classes, and document the color system.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-25  
**Next Document:** [02_Tasks-25-30_DarkMode-Utilities-Docs.md](02_Tasks-25-30_DarkMode-Utilities-Docs.md)
