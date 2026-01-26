# Tasks 23-30: Variables, Components, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** B - Store Layout Foundation  
> **Document:** 02 of 02  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-22_Layout-Providers-Styles.md](01_Tasks-15-22_Layout-Providers-Styles.md)

---

## Document Overview

This document covers the creation of CSS variables for store theming, design token systems, and foundational layout components. It establishes the store's visual design system through color, typography, and spacing tokens, then implements the header, footer, and navigation components that bring the store layout to life.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 23 | Define CSS Variables for Store Theme | Low | 25 min |
| 24 | Create Store Color Tokens | Low | 30 min |
| 25 | Create Typography Tokens | Low | 25 min |
| 26 | Create Spacing and Sizing Tokens | Low | 20 min |
| 27 | Create Store Header Component | Medium | 45 min |
| 28 | Create Store Footer Component | Medium | 40 min |
| 29 | Create Store Navigation Component | Medium | 35 min |
| 30 | Verify Layout Integration | Low | 20 min |

---

## Task 23: Define CSS Variables for Store Theme

### Overview
Establish CSS custom properties (CSS variables) for the store theme to enable consistent, maintainable, and dynamic theming across the entire storefront. These variables serve as the foundation for all visual styling, supporting both light and dark themes, and allowing for easy customization per tenant or brand.

### Dependencies
- Task 22: Create Store Global Styles
- Tailwind CSS configuration established
- Understanding of CSS custom properties

### Instructions

1. **Navigate to global styles file**
   - Open `frontend/app/(storefront)/globals.css` file
   - This file was created in Task 22
   - Locate the `@layer base` section for variable definitions

2. **Define root-level CSS variables**
   - Create `:root` selector for light theme variables
   - Use HSL color format for easier manipulation
   - Follow naming convention: `--store-[category]-[variant]`
   - Group variables by category (colors, spacing, typography)

3. **Create color variable categories**
   - Primary colors: main brand colors for CTAs and emphasis
   - Secondary colors: supporting brand colors for accents
   - Neutral colors: grays for text, borders, backgrounds
   - Semantic colors: success, warning, error, info states
   - Surface colors: backgrounds, cards, overlays

4. **Define typography variables**
   - Font family variables for headings and body text
   - Font size variables with scaling system
   - Font weight variables for hierarchy
   - Line height variables for readability
   - Letter spacing variables for fine-tuning

5. **Create spacing and sizing variables**
   - Base spacing unit (typically 4px or 8px)
   - Spacing scale multipliers (0.5x, 1x, 2x, 3x, etc.)
   - Container max-width values
   - Border radius values (sm, md, lg, xl)
   - Shadow definitions for depth

6. **Implement dark theme variables**
   - Create `[data-theme="dark"]` or `.dark` selector
   - Define dark theme color overrides
   - Adjust surface and text colors for readability
   - Maintain contrast ratios for accessibility

7. **Add transition and animation variables**
   - Transition duration values (fast, normal, slow)
   - Transition timing functions (ease, ease-in-out)
   - Animation duration and delay values
   - Enable consistent motion design

8. **Document variable usage**
   - Add comments explaining variable categories
   - Include usage examples in comments
   - Document naming conventions
   - Note accessibility considerations

### CSS Variable Naming Convention

| Category | Pattern | Example |
|----------|---------|---------|
| Colors | `--store-color-[name]-[shade]` | `--store-color-primary-500` |
| Typography | `--store-font-[property]` | `--store-font-size-lg` |
| Spacing | `--store-space-[size]` | `--store-space-4` |
| Borders | `--store-radius-[size]` | `--store-radius-md` |
| Shadows | `--store-shadow-[level]` | `--store-shadow-lg` |

### Variable Categories Structure

```
:root {
  /* Color Palette */
  ├── Primary Colors
  ├── Secondary Colors
  ├── Neutral Colors
  ├── Semantic Colors
  └── Surface Colors
  
  /* Typography */
  ├── Font Families
  ├── Font Sizes
  ├── Font Weights
  ├── Line Heights
  └── Letter Spacing
  
  /* Layout */
  ├── Spacing Scale
  ├── Container Widths
  ├── Border Radius
  └── Shadows
  
  /* Motion */
  ├── Transition Durations
  └── Timing Functions
}
```

### Color Variable Structure

| Variable | Purpose | Light Value | Dark Value |
|----------|---------|-------------|------------|
| `--store-color-primary` | Main brand color | HSL(214, 95%, 45%) | HSL(214, 90%, 60%) |
| `--store-color-background` | Page background | HSL(0, 0%, 100%) | HSL(222, 14%, 12%) |
| `--store-color-text` | Body text | HSL(222, 14%, 20%) | HSL(210, 20%, 90%) |
| `--store-color-border` | Borders, dividers | HSL(220, 13%, 91%) | HSL(215, 15%, 25%) |

### Typography Variable Examples

| Variable | Purpose | Value |
|----------|---------|-------|
| `--store-font-family-sans` | Body text font | Inter, system-ui, sans-serif |
| `--store-font-family-heading` | Heading font | Inter, sans-serif |
| `--store-font-size-base` | Base font size | 1rem (16px) |
| `--store-font-size-lg` | Large text | 1.125rem (18px) |
| `--store-line-height-normal` | Body line height | 1.5 |

### Spacing Scale System

| Variable | Multiplier | Computed Value | Use Case |
|----------|------------|----------------|----------|
| `--store-space-1` | 0.25rem | 4px | Tight spacing |
| `--store-space-2` | 0.5rem | 8px | Small gaps |
| `--store-space-4` | 1rem | 16px | Standard spacing |
| `--store-space-6` | 1.5rem | 24px | Medium spacing |
| `--store-space-8` | 2rem | 32px | Large spacing |
| `--store-space-12` | 3rem | 48px | Extra large |

### Integration with Tailwind CSS

```
Approach 1: Direct CSS Variables
└── Use var(--store-color-primary) in Tailwind classes

Approach 2: Tailwind Config Extension
└── Map CSS variables to Tailwind theme colors

Approach 3: Hybrid Approach
└── Use both for maximum flexibility
```

### Dark Theme Implementation

| Selector Option | Pros | Cons | Use When |
|----------------|------|------|----------|
| `[data-theme="dark"]` | Explicit control | Requires JS | Need manual toggle |
| `.dark` | Simple class | Less semantic | Using Tailwind dark mode |
| `@media (prefers-color-scheme: dark)` | System respect | No override | Auto-only themes |

### Expected Outcome
- Comprehensive CSS variable system defined
- All design tokens accessible via CSS variables
- Light and dark theme support implemented
- Variables follow consistent naming convention
- Integration with Tailwind CSS prepared
- Foundation for dynamic theming established

### Verification Checklist
- [ ] CSS variables defined in `:root` selector
- [ ] Color variables use HSL format
- [ ] Typography variables defined
- [ ] Spacing scale implemented
- [ ] Border radius and shadow variables created
- [ ] Dark theme variables defined
- [ ] Naming convention followed consistently
- [ ] Variables commented and documented

---

## Task 24: Create Store Color Tokens

### Overview
Create a comprehensive color token system that extends the CSS variables into usable design tokens throughout the application. These tokens provide semantic meaning to colors, making it easier to maintain consistency and implement features like theming, accessibility, and brand customization.

### Dependencies
- Task 23: Define CSS Variables for Store Theme
- Tailwind CSS configuration access

### Instructions

1. **Create color tokens configuration file**
   - Navigate to `frontend/config/` or `frontend/lib/` directory
   - Create new file named `storeColorTokens.ts`
   - This file will define semantic color mappings

2. **Define primary color palette**
   - Create object for primary brand colors
   - Include shades from 50 (lightest) to 950 (darkest)
   - Map to CSS variables: `var(--store-color-primary-[shade])`
   - Ensure colors follow brand guidelines

3. **Define secondary color palette**
   - Create object for secondary/accent colors
   - Include full shade range (50-950)
   - Use for supporting UI elements
   - Maintain visual harmony with primary

4. **Define neutral color palette**
   - Create comprehensive gray scale
   - Include shades from white to black
   - Use for text, borders, backgrounds
   - Ensure sufficient contrast ratios

5. **Create semantic color tokens**
   - Success colors: green shades for positive actions
   - Error colors: red shades for errors and validation
   - Warning colors: amber/orange for cautionary states
   - Info colors: blue shades for informational content

6. **Define UI-specific color tokens**
   - Background colors: page, card, overlay backgrounds
   - Text colors: primary, secondary, muted, inverted
   - Border colors: default, hover, focus states
   - Interactive colors: hover, active, disabled states

7. **Extend Tailwind CSS configuration**
   - Open `tailwind.config.ts` file
   - Extend theme colors with store tokens
   - Map tokens to Tailwind color utilities
   - Enable usage like `bg-store-primary-500`

8. **Create color utility functions**
   - Function to get color by token name
   - Function to generate color variants
   - Function to check contrast ratios
   - Function to convert between color formats

9. **Document color usage guidelines**
   - Create comments explaining token purposes
   - Include accessibility notes (WCAG compliance)
   - Document color combination recommendations
   - Provide usage examples

### Color Token Categories

| Category | Purpose | Example Tokens |
|----------|---------|----------------|
| Brand | Primary identity | `primary-500`, `secondary-600` |
| Neutral | Grays and basics | `gray-100`, `gray-900` |
| Semantic | Status indicators | `success-500`, `error-500` |
| Surface | Backgrounds | `bg-page`, `bg-card` |
| Text | Typography | `text-primary`, `text-muted` |
| Interactive | User actions | `hover-primary`, `active-primary` |

### Primary Color Scale Structure

```
Primary Color Palette
├── 50:  Lightest tint (backgrounds)
├── 100: Very light (hover states)
├── 200: Light (borders)
├── 300: Medium-light
├── 400: Medium
├── 500: Base (main brand color) ←
├── 600: Medium-dark (hover)
├── 700: Dark
├── 800: Very dark
└── 950: Darkest (text on light)
```

### Semantic Color Mapping

| Token Name | Purpose | Light Mode | Dark Mode | Usage |
|------------|---------|------------|-----------|-------|
| `success` | Positive actions | Green-500 | Green-400 | Order success |
| `error` | Errors, validation | Red-500 | Red-400 | Form errors |
| `warning` | Cautionary info | Amber-500 | Amber-400 | Stock warnings |
| `info` | Informational | Blue-500 | Blue-400 | Tips, notices |

### UI Color Tokens

| Token | Light Value | Dark Value | Purpose |
|-------|-------------|------------|---------|
| `bg-page` | White | Gray-950 | Main background |
| `bg-card` | White | Gray-900 | Card background |
| `bg-elevated` | Gray-50 | Gray-800 | Elevated surfaces |
| `text-primary` | Gray-900 | Gray-50 | Main text |
| `text-secondary` | Gray-600 | Gray-400 | Secondary text |
| `text-muted` | Gray-500 | Gray-500 | Muted text |
| `border-default` | Gray-200 | Gray-700 | Standard borders |

### Tailwind Configuration Extension

```
Structure in tailwind.config.ts:

theme: {
  extend: {
    colors: {
      store: {
        primary: { 50...950 },
        secondary: { 50...950 },
        success: { 50...950 },
        error: { 50...950 },
        warning: { 50...950 },
        info: { 50...950 },
        ...
      }
    }
  }
}
```

### Accessibility Color Matrix

| Background | Text Color | Contrast Ratio | WCAG Level |
|------------|------------|----------------|------------|
| Primary-500 | White | 4.5:1+ | AA |
| Primary-600 | White | 7:1+ | AAA |
| Gray-50 | Gray-900 | 15:1+ | AAA |
| Gray-900 | Gray-50 | 15:1+ | AAA |

### Color Usage Guidelines

| Scenario | Recommended Tokens | Notes |
|----------|-------------------|-------|
| CTA Buttons | `primary-600`, `primary-700` | High contrast, clear action |
| Text Links | `primary-600` | Distinguishable from text |
| Success Messages | `success-50` bg, `success-700` text | Clear positive feedback |
| Error States | `error-50` bg, `error-700` text | Immediately noticeable |
| Disabled Elements | `gray-300` bg, `gray-500` text | Obviously non-interactive |

### Expected Outcome
- Complete color token system defined
- Semantic color mapping established
- Tailwind CSS extended with store colors
- Accessibility compliance ensured
- Color utility functions available
- Comprehensive documentation provided

### Verification Checklist
- [ ] Color tokens file created (`storeColorTokens.ts`)
- [ ] Primary color palette defined (50-950)
- [ ] Secondary color palette defined
- [ ] Neutral/gray scale defined
- [ ] Semantic colors defined (success, error, warning, info)
- [ ] UI-specific tokens created
- [ ] Tailwind config extended with tokens
- [ ] Contrast ratios verified for accessibility
- [ ] Color utility functions implemented
- [ ] Usage guidelines documented

---

## Task 25: Create Typography Tokens

### Overview
Establish a comprehensive typography token system that defines font sizes, weights, line heights, and letter spacing across the store. This system ensures consistent text styling, proper visual hierarchy, and optimal readability across all devices and content types.

### Dependencies
- Task 23: Define CSS Variables for Store Theme
- Font setup from Task 21 completed

### Instructions

1. **Create typography tokens configuration file**
   - Navigate to `frontend/config/` or `frontend/lib/` directory
   - Create new file named `storeTypographyTokens.ts`
   - Define TypeScript interfaces for type safety

2. **Define font family tokens**
   - Primary font: main body text font (e.g., Inter, Roboto)
   - Heading font: optional display font for headings
   - Monospace font: for code or technical content
   - Map to CSS variables from Task 23

3. **Create font size scale**
   - Define size range from xs (extra small) to 4xl (extra large)
   - Use rem units for accessibility and scaling
   - Follow established design system (e.g., 1.125 or 1.2 ratio)
   - Include pixel equivalents in comments

4. **Define font weight tokens**
   - Light: 300 (subtle text, less emphasis)
   - Normal: 400 (body text, default)
   - Medium: 500 (slightly emphasized)
   - Semibold: 600 (subheadings, important text)
   - Bold: 700 (headings, high emphasis)
   - Extrabold: 800 (display headings, hero text)

5. **Establish line height system**
   - Tight: 1.25 (large headings)
   - Snug: 1.375 (subheadings)
   - Normal: 1.5 (body text)
   - Relaxed: 1.625 (reading content)
   - Loose: 2 (poetry, special formatting)

6. **Create letter spacing tokens**
   - Tighter: -0.05em (large headings)
   - Tight: -0.025em (headings)
   - Normal: 0em (body text)
   - Wide: 0.025em (small text, labels)
   - Wider: 0.05em (all caps, tracking)

7. **Define text style presets**
   - Heading styles (h1, h2, h3, h4, h5, h6)
   - Body text styles (large, base, small)
   - Display styles (hero, subtitle)
   - Utility styles (caption, overline, label)
   - Combine size, weight, line-height, spacing

8. **Extend Tailwind CSS typography**
   - Update `tailwind.config.ts` with typography tokens
   - Add custom font size scale
   - Define custom font weight mappings
   - Configure line height and letter spacing

9. **Create responsive typography utilities**
   - Define mobile font sizes
   - Define tablet font sizes
   - Define desktop font sizes
   - Implement fluid typography if needed

### Font Size Scale

| Token | Size (rem) | Size (px) | Use Case |
|-------|-----------|-----------|----------|
| `xs` | 0.75rem | 12px | Small labels, captions |
| `sm` | 0.875rem | 14px | Secondary text, metadata |
| `base` | 1rem | 16px | Body text, default |
| `lg` | 1.125rem | 18px | Large body text |
| `xl` | 1.25rem | 20px | Subheadings |
| `2xl` | 1.5rem | 24px | Section headings |
| `3xl` | 1.875rem | 30px | Page headings |
| `4xl` | 2.25rem | 36px | Large headings |
| `5xl` | 3rem | 48px | Display headings |
| `6xl` | 3.75rem | 60px | Hero text |

### Font Weight System

| Token | Value | Name | Usage |
|-------|-------|------|-------|
| `light` | 300 | Light | Subtle, decorative |
| `normal` | 400 | Regular | Body text |
| `medium` | 500 | Medium | Slight emphasis |
| `semibold` | 600 | Semibold | Subheadings, buttons |
| `bold` | 700 | Bold | Headings, strong emphasis |
| `extrabold` | 800 | Extra Bold | Display, hero text |

### Typography Preset Styles

```
Heading Hierarchy
├── H1: 3xl, extrabold, tight, -0.025em
├── H2: 2xl, bold, tight, -0.025em
├── H3: xl, bold, snug, 0em
├── H4: lg, semibold, snug, 0em
├── H5: base, semibold, normal, 0em
└── H6: sm, semibold, normal, 0em

Body Styles
├── Body Large: lg, normal, relaxed, 0em
├── Body Base: base, normal, normal, 0em
└── Body Small: sm, normal, normal, 0em

Display Styles
├── Hero: 6xl, extrabold, tight, -0.05em
├── Display: 5xl, bold, tight, -0.025em
└── Subtitle: xl, medium, snug, 0em
```

### Line Height Recommendations

| Content Type | Line Height | Token | Reasoning |
|-------------|-------------|-------|-----------|
| Large Headings | 1.1-1.25 | `tight` | Compact, impactful |
| Subheadings | 1.25-1.375 | `snug` | Readable, not loose |
| Body Text | 1.5 | `normal` | Optimal readability |
| Long-form Content | 1.625-1.75 | `relaxed` | Comfortable reading |
| Lists | 1.5-1.625 | `normal` | Clear separation |

### Responsive Typography Strategy

```
Mobile (< 640px)
├── H1: 2.5xl → Scales down from desktop
├── H2: 2xl
├── Body: base (16px) → Same across devices
└── Padding: Tighter

Tablet (640px - 1024px)
├── H1: 3xl
├── H2: 2xl
├── Body: base or lg
└── Padding: Medium

Desktop (> 1024px)
├── H1: 4xl → Full size
├── H2: 3xl
├── Body: lg (18px) → Larger for comfort
└── Padding: Spacious
```

### Tailwind Typography Extension

| Extension | Configuration | Purpose |
|-----------|---------------|---------|
| Font Size | `fontSize: { 'xs': '0.75rem', ... }` | Custom size scale |
| Font Weight | `fontWeight: { 'light': '300', ... }` | Weight mapping |
| Line Height | `lineHeight: { 'tight': '1.25', ... }` | Spacing control |
| Letter Spacing | `letterSpacing: { 'tight': '-0.025em', ... }` | Character spacing |

### Accessibility Considerations

| Guideline | Implementation | Standard |
|-----------|----------------|----------|
| Minimum Body Text | 16px (1rem) base | WCAG AA |
| Line Length | 50-75 characters | Readability |
| Contrast Ratio | 4.5:1 minimum | WCAG AA |
| Line Height | 1.5 minimum for body | WCAG AAA |
| Paragraph Spacing | 2x line height | WCAG AAA |

### Expected Outcome
- Complete typography token system defined
- Font size scale with proper hierarchy
- Font weight, line height, spacing tokens
- Text style presets for common elements
- Tailwind CSS extended with typography
- Responsive typography strategy implemented
- Accessibility standards met

### Verification Checklist
- [ ] Typography tokens file created (`storeTypographyTokens.ts`)
- [ ] Font family tokens defined
- [ ] Font size scale defined (xs to 6xl)
- [ ] Font weight tokens defined (300-800)
- [ ] Line height tokens defined
- [ ] Letter spacing tokens defined
- [ ] Text style presets created
- [ ] Tailwind config extended
- [ ] Responsive typography configured
- [ ] Accessibility guidelines followed

---

## Task 26: Create Spacing and Sizing Tokens

### Overview
Establish a comprehensive spacing and sizing token system that defines consistent measurements for margins, padding, gaps, widths, heights, and other dimensional properties. This system ensures visual consistency, proper alignment, and scalable layouts across the entire storefront.

### Dependencies
- Task 23: Define CSS Variables for Store Theme
- Understanding of spacing scales and proportional systems

### Instructions

1. **Create spacing tokens configuration file**
   - Navigate to `frontend/config/` or `frontend/lib/` directory
   - Create new file named `storeSpacingTokens.ts`
   - Define TypeScript interfaces for type safety

2. **Define base spacing unit**
   - Choose base unit (typically 4px or 8px)
   - All spacing will be multiples of this unit
   - Ensures consistent alignment across components
   - Map to CSS variable `--store-space-base`

3. **Create spacing scale system**
   - Define scale from 0 to 96 or beyond
   - Use multipliers: 0, 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96
   - Follow 4px or 8px increments
   - Include negative values for negative margins

4. **Define container width tokens**
   - Small container: 640px (mobile content)
   - Medium container: 768px (tablet content)
   - Large container: 1024px (standard desktop)
   - Extra large container: 1280px (wide desktop)
   - Full width: 100% (edge-to-edge)

5. **Create breakpoint tokens**
   - Small (sm): 640px (landscape phones)
   - Medium (md): 768px (tablets)
   - Large (lg): 1024px (laptops)
   - Extra Large (xl): 1280px (desktops)
   - 2XL: 1536px (large screens)

6. **Define border radius tokens**
   - None: 0 (sharp corners)
   - Small: 2-4px (subtle rounding)
   - Medium: 6-8px (standard cards)
   - Large: 12-16px (prominent elements)
   - Extra Large: 20-24px (hero sections)
   - Full: 9999px (pills, circles)

7. **Create shadow tokens**
   - None: no shadow
   - Small: subtle depth (1-2px blur)
   - Medium: standard elevation (4-6px blur)
   - Large: prominent depth (10-15px blur)
   - Extra Large: dramatic elevation (20-25px blur)
   - Inner: inset shadows

8. **Define z-index scale**
   - Base: 0 (default)
   - Dropdown: 10
   - Sticky: 20
   - Fixed: 30
   - Modal Backdrop: 40
   - Modal: 50
   - Popover: 60
   - Tooltip: 70

9. **Extend Tailwind CSS configuration**
   - Update `tailwind.config.ts` with spacing tokens
   - Add custom spacing scale
   - Define container sizes
   - Configure border radius and shadows
   - Set up z-index utilities

### Spacing Scale System

| Token | Value | Pixels | Use Case |
|-------|-------|--------|----------|
| `0` | 0rem | 0px | Reset spacing |
| `px` | 1px | 1px | Hairline borders |
| `0.5` | 0.125rem | 2px | Minimal spacing |
| `1` | 0.25rem | 4px | Tight spacing |
| `2` | 0.5rem | 8px | Small gaps |
| `3` | 0.75rem | 12px | Compact spacing |
| `4` | 1rem | 16px | Standard spacing |
| `6` | 1.5rem | 24px | Medium spacing |
| `8` | 2rem | 32px | Large spacing |
| `12` | 3rem | 48px | Extra large |
| `16` | 4rem | 64px | Section spacing |
| `24` | 6rem | 96px | Major sections |

### Container Width Definitions

```
Container Hierarchy
├── sm:  max-w-screen-sm  (640px)  - Mobile content
├── md:  max-w-screen-md  (768px)  - Tablet content
├── lg:  max-w-screen-lg  (1024px) - Laptop content
├── xl:  max-w-screen-xl  (1280px) - Desktop content
├── 2xl: max-w-screen-2xl (1536px) - Wide screens
└── full: max-w-full (100%)        - Edge-to-edge
```

### Responsive Breakpoint System

| Breakpoint | Min Width | Target Devices | Container Max-Width |
|------------|-----------|----------------|---------------------|
| `sm` | 640px | Landscape phones | 100% |
| `md` | 768px | Tablets | 100% |
| `lg` | 1024px | Laptops, small desktops | 1024px |
| `xl` | 1280px | Desktops | 1280px |
| `2xl` | 1536px | Large displays | 1536px |

### Border Radius Scale

| Token | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `none` | 0 | 0px | Sharp edges, borders |
| `sm` | 0.125rem | 2px | Subtle rounding |
| `DEFAULT` | 0.25rem | 4px | Buttons, inputs |
| `md` | 0.375rem | 6px | Cards, containers |
| `lg` | 0.5rem | 8px | Modal, panels |
| `xl` | 0.75rem | 12px | Large cards |
| `2xl` | 1rem | 16px | Hero sections |
| `3xl` | 1.5rem | 24px | Prominent elements |
| `full` | 9999px | Full | Circles, pills |

### Shadow System

```
Shadow Elevation Levels
├── none:   No shadow (flat)
├── sm:     0 1px 2px rgba(0,0,0,0.05)      - Subtle depth
├── DEFAULT: 0 1px 3px rgba(0,0,0,0.1)       - Standard cards
├── md:     0 4px 6px rgba(0,0,0,0.1)        - Raised elements
├── lg:     0 10px 15px rgba(0,0,0,0.1)      - Dropdowns, popovers
├── xl:     0 20px 25px rgba(0,0,0,0.1)      - Modals, overlays
├── 2xl:    0 25px 50px rgba(0,0,0,0.25)     - Floating elements
└── inner:  inset 0 2px 4px rgba(0,0,0,0.06) - Pressed state
```

### Z-Index Layering System

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | 0 | Default page content |
| Dropdown | 10 | Dropdown menus |
| Sticky Header | 20 | Sticky navigation |
| Fixed Elements | 30 | Fixed sidebars, chat |
| Overlay/Backdrop | 40 | Modal backdrop |
| Modal | 50 | Modal dialogs |
| Popover | 60 | Popovers, tooltips |
| Toast/Notification | 70 | Toast messages |

### Spacing Usage Guidelines

| Context | Recommended Spacing | Token |
|---------|-------------------|-------|
| Component Internal | 4-8px | `space-1` to `space-2` |
| Between Elements | 16-24px | `space-4` to `space-6` |
| Section Padding | 32-48px | `space-8` to `space-12` |
| Section Margin | 48-96px | `space-12` to `space-24` |
| Page Padding (Mobile) | 16-20px | `space-4` to `space-5` |
| Page Padding (Desktop) | 24-32px | `space-6` to `space-8` |

### Responsive Spacing Strategy

```
Mobile (< 640px)
├── Component Gap: space-2 to space-3
├── Section Padding: space-6 to space-8
├── Section Margin: space-8 to space-12
└── Page Padding: space-4

Tablet (640px - 1024px)
├── Component Gap: space-3 to space-4
├── Section Padding: space-8 to space-12
├── Section Margin: space-12 to space-16
└── Page Padding: space-6

Desktop (> 1024px)
├── Component Gap: space-4 to space-6
├── Section Padding: space-12 to space-16
├── Section Margin: space-16 to space-24
└── Page Padding: space-8
```

### Tailwind Configuration Extension

| Property | Configuration | Purpose |
|----------|---------------|---------|
| Spacing | `spacing: { '0.5': '0.125rem', ... }` | Margin, padding, gap |
| Container | `container: { center: true, ... }` | Layout containers |
| Border Radius | `borderRadius: { 'sm': '2px', ... }` | Rounded corners |
| Box Shadow | `boxShadow: { 'sm': '0 1px 2px...', ... }` | Elevation |
| Z-Index | `zIndex: { '10': '10', ... }` | Stacking order |

### Expected Outcome
- Comprehensive spacing and sizing token system
- Consistent spacing scale across application
- Container width definitions for layouts
- Border radius and shadow systems
- Z-index layering strategy
- Tailwind CSS extended with tokens
- Responsive spacing guidelines

### Verification Checklist
- [ ] Spacing tokens file created (`storeSpacingTokens.ts`)
- [ ] Base spacing unit defined
- [ ] Spacing scale defined (0 to 96+)
- [ ] Container width tokens defined
- [ ] Breakpoint tokens defined
- [ ] Border radius tokens defined
- [ ] Shadow tokens defined
- [ ] Z-index scale defined
- [ ] Tailwind config extended
- [ ] Responsive spacing strategy documented

---

## Task 27: Create Store Header Component

### Overview
Create the main header component for the storefront that provides primary navigation, search functionality, account access, and shopping cart visibility. This component serves as the persistent top-level navigation across all store pages and is crucial for user experience and conversion.

### Dependencies
- Task 15: Create Store Layout Component
- Task 23-26: Design tokens established
- Next.js Link and Image components available

### Instructions

1. **Create header component file**
   - Navigate to `frontend/components/storefront/layout/` directory
   - Create new file named `StoreHeader.tsx`
   - Mark as client component with `"use client"` directive if using hooks

2. **Define component props interface**
   - Create `StoreHeaderProps` interface
   - Include optional `transparent` prop for hero sections
   - Include optional `sticky` prop to enable/disable sticky behavior
   - Include optional `hideSearch` prop for special pages

3. **Plan header structure layout**
   - Top section: announcement bar (optional)
   - Main section: logo, navigation, search, actions
   - Bottom section: category mega-menu (optional)
   - Use semantic HTML `<header>` element

4. **Implement logo section**
   - Display store logo on the left
   - Link logo to homepage using Next.js Link
   - Use Next.js Image for optimization
   - Ensure proper alt text for accessibility

5. **Create navigation menu structure**
   - Primary navigation links (Shop, Categories, Deals)
   - Implement as horizontal list
   - Use Next.js Link for navigation
   - Apply active link styling
   - Plan for responsive collapse on mobile

6. **Implement search functionality**
   - Create search input field with icon
   - Position centrally or to the right
   - Add placeholder text (e.g., "Search products...")
   - Implement search button or submit on enter
   - Plan for search suggestions (future task)

7. **Create action buttons section**
   - Account button: user icon or "Sign In" text
   - Wishlist button: heart icon with count badge
   - Cart button: shopping cart icon with item count
   - Group buttons with consistent spacing
   - Add hover and active states

8. **Implement responsive behavior**
   - Desktop: full horizontal layout
   - Tablet: condensed navigation, search toggle
   - Mobile: hamburger menu, icons only
   - Ensure touch-friendly tap targets (44x44px minimum)

9. **Add sticky header functionality**
   - Apply `position: sticky` or `position: fixed`
   - Add scroll detection to shrink header
   - Implement smooth height transition
   - Ensure z-index properly layers above content

10. **Style header with design tokens**
    - Apply background color from color tokens
    - Use spacing tokens for padding and gaps
    - Apply border bottom for definition
    - Implement shadow for elevation
    - Support light/dark theme variants

11. **Implement accessibility features**
    - Proper ARIA labels for icon buttons
    - Keyboard navigation support
    - Focus indicators visible
    - Skip to main content link
    - Screen reader announcements

### Header Structure Overview

```
┌─────────────────────────────────────────────────────────┐
│  [Announcement Bar] Free shipping over $100! 🚚        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Logo]  [Nav] [Nav] [Nav]    [Search]  [👤] [❤️] [🛒] │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Category Mega Menu] (on hover/click)                 │
└─────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| transparent | boolean | No | false | Transparent background for hero |
| sticky | boolean | No | true | Enable sticky positioning |
| hideSearch | boolean | No | false | Hide search bar |
| className | string | No | "" | Additional CSS classes |

### Header Sections Breakdown

| Section | Content | Position | Visibility |
|---------|---------|----------|------------|
| Announcement Bar | Promo message | Top | Optional |
| Logo | Store branding | Left | Always |
| Navigation | Primary links | Center-left | Desktop/Tablet |
| Search Bar | Product search | Center | Desktop |
| Actions | Account, cart, wishlist | Right | Always |
| Mega Menu | Category dropdown | Below header | On interaction |

### Navigation Links Structure

| Link | Destination | Icon | Priority |
|------|-------------|------|----------|
| Shop | `/shop` | None | Primary |
| Categories | Mega menu trigger | Chevron | Primary |
| Deals | `/deals` | Tag icon | Secondary |
| New Arrivals | `/new` | Sparkle | Secondary |
| About | `/about` | None | Tertiary |

### Action Buttons Configuration

```
Action Buttons (Right Side)
├── Account Button
│   ├── Desktop: User icon + "Account" text
│   ├── Mobile: User icon only
│   ├── Logged in: User initial/avatar
│   └── Logged out: "Sign In" link
│
├── Wishlist Button
│   ├── Heart icon
│   ├── Badge with item count
│   └── Link to /wishlist
│
└── Cart Button
    ├── Shopping cart icon
    ├── Badge with item count
    ├── Link to /cart
    └── Hover: Mini cart preview (optional)
```

### Responsive Breakpoints

| Screen Size | Logo | Navigation | Search | Actions |
|-------------|------|------------|--------|---------|
| Mobile (<640px) | Left | Hamburger | Hidden/Toggle | Icons only |
| Tablet (640-1024px) | Left | Partial | Toggle | Icons + text |
| Desktop (>1024px) | Left | Full horizontal | Always visible | Full display |

### Sticky Header Behavior

| State | Height | Background | Shadow |
|-------|--------|------------|--------|
| Top of Page | 80px | Transparent/Solid | None |
| Scrolled Down | 64px | Solid | Medium |
| Scrolling Up | 64px | Solid | Medium |
| Scrolling Down | Hidden/Minimized | - | - |

### Styling Specifications

| Element | Styling | Tokens |
|---------|---------|--------|
| Header Container | `bg-white border-b` | `--store-color-bg-card` |
| Height | `h-20` (80px) | `--store-space-20` |
| Padding | `px-4 md:px-6 lg:px-8` | `--store-space-[4,6,8]` |
| Logo Height | `h-10` (40px) | - |
| Nav Links | `text-gray-700 hover:text-primary` | `--store-color-text` |
| Search Input | `rounded-full border` | `--store-radius-full` |
| Action Buttons | `p-2 rounded-lg` | `--store-space-2` |
| Badge | `rounded-full bg-primary text-white` | `--store-color-primary` |

### Accessibility Features

| Feature | Implementation | Standard |
|---------|----------------|----------|
| Skip Link | Hidden link to main content | WCAG 2.4.1 |
| ARIA Labels | `aria-label` on icon buttons | WCAG 4.1.2 |
| Keyboard Nav | Tab order, Enter/Space triggers | WCAG 2.1.1 |
| Focus Visible | `focus-visible:ring-2` | WCAG 2.4.7 |
| Screen Reader | Announce cart count changes | WCAG 4.1.3 |

### Expected Outcome
- Fully functional store header component
- Responsive design across all devices
- Search, navigation, and action buttons integrated
- Sticky positioning with smooth transitions
- Accessibility features implemented
- Design tokens applied consistently

### Verification Checklist
- [ ] `frontend/components/storefront/layout/StoreHeader.tsx` created
- [ ] Component accepts defined props
- [ ] Logo section with homepage link
- [ ] Navigation links implemented
- [ ] Search bar functional
- [ ] Account button implemented
- [ ] Wishlist button with count badge
- [ ] Cart button with count badge
- [ ] Responsive behavior on mobile/tablet/desktop
- [ ] Sticky header functionality works
- [ ] Design tokens applied
- [ ] Accessibility features present
- [ ] Component exports properly

---

## Task 28: Create Store Footer Component

### Overview
Create a comprehensive footer component for the storefront that provides navigation links, company information, newsletter signup, social media links, and legal information. The footer serves as a secondary navigation tool and trust-building element while following e-commerce best practices.

### Dependencies
- Task 15: Create Store Layout Component
- Task 23-26: Design tokens established
- Next.js Link component available

### Instructions

1. **Create footer component file**
   - Navigate to `frontend/components/storefront/layout/` directory
   - Create new file named `StoreFooter.tsx`
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `StoreFooterProps` interface
   - Include optional `hideNewsletter` prop
   - Include optional `simplified` prop for minimal footer
   - Include optional `className` prop

3. **Plan footer layout structure**
   - Newsletter section (full-width, above main footer)
   - Main footer section with multiple columns
   - Bottom bar with copyright and legal links
   - Use semantic HTML `<footer>` element

4. **Implement newsletter section**
   - Heading: "Stay Updated" or similar
   - Subheading: benefit of subscribing
   - Email input field with validation
   - Subscribe button
   - Privacy notice or consent checkbox
   - Position at top of footer

5. **Create footer navigation columns**
   - Column 1: Shop (Categories, Products, Deals)
   - Column 2: Customer Service (Help, Returns, Shipping)
   - Column 3: Company (About, Contact, Careers)
   - Column 4: Connect (Social links, Blog)
   - Use grid layout for responsive organization

6. **Implement shop links column**
   - Link to All Products page
   - Link to main category pages
   - Link to Deals/Sale page
   - Link to New Arrivals page
   - Use Next.js Link components

7. **Implement customer service column**
   - Link to Help Center/FAQ
   - Link to Contact Us page
   - Link to Shipping Information
   - Link to Returns & Exchanges
   - Link to Order Tracking

8. **Implement company info column**
   - Link to About Us page
   - Link to Contact page
   - Link to Careers page (if applicable)
   - Link to Press/Media page
   - Store address and phone (optional)

9. **Create social media section**
   - Social media icons (Facebook, Instagram, Twitter, etc.)
   - External links to social profiles
   - Use SVG icons or icon library
   - Apply hover effects
   - Position in dedicated column or bottom bar

10. **Implement payment methods display**
    - Show accepted payment method icons
    - Include Visa, Mastercard, mobile payment options
    - Display trust badges (SSL, secure checkout)
    - Position in bottom bar area

11. **Create bottom bar section**
    - Copyright text with dynamic year
    - Legal links (Privacy Policy, Terms, Cookies)
    - Language/currency selector (if applicable)
    - Use flexbox for horizontal layout

12. **Style footer with design tokens**
    - Dark or light background based on theme
    - Use spacing tokens for padding and gaps
    - Apply border top for separation
    - Implement proper text hierarchy
    - Support theme variants

13. **Implement responsive layout**
    - Mobile: single column, stacked sections
    - Tablet: 2-column grid
    - Desktop: 4-column grid
    - Ensure proper touch targets on mobile

### Footer Structure Overview

```
┌─────────────────────────────────────────────────────────┐
│                  NEWSLETTER SECTION                     │
│  "Stay Updated"  [Email Input] [Subscribe Button]      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [SHOP]      [CUSTOMER]      [COMPANY]      [CONNECT]  │
│  Category    Help Center     About Us       [f][t][i]  │
│  Products    Returns         Contact        [y][p][l]  │
│  Deals       Shipping        Careers        Blog       │
│  New         Tracking        Press          Support    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  © 2026 LankaCommerce  |  Privacy  |  Terms  | [💳 🔒] │
└─────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| hideNewsletter | boolean | No | false | Hide newsletter section |
| simplified | boolean | No | false | Show minimal footer only |
| className | string | No | "" | Additional CSS classes |

### Footer Sections Breakdown

| Section | Content | Position | Visibility |
|---------|---------|----------|------------|
| Newsletter | Email signup | Top, full-width | Optional |
| Shop Links | Product navigation | Column 1 | Always |
| Customer Service | Support links | Column 2 | Always |
| Company Info | About/Contact | Column 3 | Always |
| Connect/Social | Social media | Column 4 | Always |
| Bottom Bar | Copyright, legal | Bottom, full-width | Always |

### Navigation Columns Configuration

```
Column 1: Shop
├── All Products (/shop)
├── Categories (/categories)
├── Deals & Sales (/deals)
├── New Arrivals (/new)
└── Best Sellers (/best-sellers)

Column 2: Customer Service
├── Help Center (/help)
├── Contact Us (/contact)
├── Shipping Info (/shipping)
├── Returns & Exchanges (/returns)
└── Track Order (/track)

Column 3: Company
├── About Us (/about)
├── Our Story (/story)
├── Contact (/contact)
├── Careers (/careers)
└── Press Kit (/press)

Column 4: Connect
├── Social Media Links
├── Blog (/blog)
├── Newsletter (if not in top section)
└── Support (/support)
```

### Newsletter Section Design

| Element | Content | Styling |
|---------|---------|---------|
| Heading | "Stay Updated" | `text-2xl font-bold` |
| Subheading | "Get exclusive offers..." | `text-gray-600` |
| Email Input | Placeholder: "Enter your email" | `rounded-l-md border` |
| Subscribe Button | "Subscribe" | `rounded-r-md bg-primary` |
| Privacy Note | "We respect your privacy" | `text-xs text-gray-500` |

### Social Media Links

| Platform | Icon | URL Pattern | Priority |
|----------|------|-------------|----------|
| Facebook | f icon | `facebook.com/[store]` | High |
| Instagram | camera icon | `instagram.com/[store]` | High |
| Twitter/X | bird icon | `twitter.com/[store]` | Medium |
| YouTube | play icon | `youtube.com/[store]` | Medium |
| Pinterest | pin icon | `pinterest.com/[store]` | Low |
| LinkedIn | in icon | `linkedin.com/company/[store]` | Low |

### Responsive Grid Layout

```
Mobile (< 640px)
└── 1 Column
    ├── Newsletter (full width)
    ├── Shop Links
    ├── Customer Service
    ├── Company
    ├── Connect
    └── Bottom Bar

Tablet (640px - 1024px)
└── 2 Columns
    ├── Newsletter (full width, 2 cols)
    ├── Col 1: Shop, Customer Service
    ├── Col 2: Company, Connect
    └── Bottom Bar (full width, 2 cols)

Desktop (> 1024px)
└── 4 Columns
    ├── Newsletter (full width, 4 cols)
    ├── Col 1: Shop
    ├── Col 2: Customer Service
    ├── Col 3: Company
    ├── Col 4: Connect
    └── Bottom Bar (full width, 4 cols)
```

### Bottom Bar Content

| Element | Content | Alignment |
|---------|---------|-----------|
| Copyright | "© 2026 LankaCommerce Cloud" | Left |
| Legal Links | Privacy, Terms, Cookies | Center |
| Payment Methods | Card icons, SSL badge | Right |
| Language/Currency | Selectors (if applicable) | Right |

### Styling Specifications

| Element | Styling | Tokens |
|---------|---------|--------|
| Footer Background | `bg-gray-900 text-white` | `--store-color-bg-footer` |
| Newsletter Section | `bg-gray-800 py-12` | `--store-space-12` |
| Main Footer | `py-16 px-4 md:px-6 lg:px-8` | `--store-space-[4,6,8,16]` |
| Column Headings | `text-lg font-semibold mb-4` | `--store-font-size-lg` |
| Links | `text-gray-400 hover:text-white` | `--store-color-text-muted` |
| Bottom Bar | `border-t border-gray-800 py-6` | `--store-space-6` |
| Social Icons | `w-6 h-6 hover:text-primary` | `--store-color-primary` |

### Payment Method Icons

| Payment Method | Icon | Display Priority |
|---------------|------|------------------|
| Visa | Card icon | Always |
| Mastercard | Card icon | Always |
| Cash on Delivery | COD icon | High (Sri Lanka) |
| Bank Transfer | Bank icon | Medium |
| Mobile Payment | Phone icon | High (regional) |
| SSL/Security Badge | Lock icon | Always |

### Accessibility Features

| Feature | Implementation | Standard |
|---------|----------------|----------|
| Semantic HTML | `<footer>` element | HTML5 |
| Link Descriptions | Clear link text | WCAG 2.4.4 |
| Keyboard Navigation | All links focusable | WCAG 2.1.1 |
| Focus Indicators | Visible focus rings | WCAG 2.4.7 |
| Email Validation | Proper input types | HTML5 |
| ARIA Labels | For icon-only buttons | WCAG 4.1.2 |

### Expected Outcome
- Comprehensive footer component with all sections
- Newsletter signup functionality prepared
- Multi-column navigation links
- Social media integration
- Responsive grid layout
- Design tokens applied
- Accessibility features implemented

### Verification Checklist
- [ ] `frontend/components/storefront/layout/StoreFooter.tsx` created
- [ ] Component accepts defined props
- [ ] Newsletter section implemented
- [ ] Shop links column created
- [ ] Customer service links column created
- [ ] Company info links column created
- [ ] Social media links section created
- [ ] Bottom bar with copyright and legal links
- [ ] Payment method icons displayed
- [ ] Responsive grid layout works
- [ ] Mobile, tablet, desktop tested
- [ ] Design tokens applied
- [ ] Accessibility features present
- [ ] Component exports properly

---

## Task 29: Create Store Navigation Component

### Overview
Create a dedicated navigation component that handles the primary navigation menu for the storefront, including category links, mega menu functionality, and mobile hamburger menu. This component is used within the StoreHeader and provides the core navigation structure for customers to browse the store.

### Dependencies
- Task 27: Create Store Header Component
- Task 23-26: Design tokens established
- Understanding of navigation patterns and UX

### Instructions

1. **Create navigation component file**
   - Navigate to `frontend/components/storefront/layout/` directory
   - Create new file named `StoreNavigation.tsx`
   - Mark as client component with `"use client"` directive for interactivity

2. **Define component props interface**
   - Create `StoreNavigationProps` interface
   - Include `variant` prop: "desktop" | "mobile" | "both"
   - Include optional `className` prop
   - Include optional `onNavigate` callback for analytics

3. **Define navigation structure data**
   - Create navigation items configuration
   - Include label, href, icon (optional), badge (optional)
   - Define mega menu content for category links
   - Support nested navigation (categories → subcategories)

4. **Implement desktop navigation**
   - Horizontal list of navigation links
   - Use Next.js Link components
   - Apply active link styling based on current route
   - Position links with proper spacing
   - Support dropdown/mega menu on hover or click

5. **Create mega menu functionality**
   - Trigger mega menu on hover or click
   - Display full-width dropdown panel
   - Show category grid with images
   - Include featured products or promotions
   - Implement smooth open/close animations
   - Close on outside click or ESC key

6. **Implement mobile navigation**
   - Hamburger icon button to trigger
   - Slide-in drawer from left or right
   - Full-screen overlay with navigation
   - Vertical list of links with expandable sections
   - Close button (X) in top corner
   - Smooth slide-in/out animation

7. **Create category navigation structure**
   - Primary categories (top level)
   - Subcategories (nested under primary)
   - Featured items within categories
   - "View All" link for each category
   - Support multiple nesting levels

8. **Add navigation state management**
   - Track open/closed state for mobile menu
   - Track active mega menu (which category)
   - Track current route for active styling
   - Use React hooks (useState, useEffect)

9. **Implement keyboard navigation**
   - Tab through navigation links
   - Arrow keys for menu navigation
   - Enter/Space to activate links
   - ESC to close mega menu or mobile menu
   - Focus trapping in mobile menu

10. **Style navigation with design tokens**
    - Apply text colors from color tokens
    - Use spacing tokens for gaps and padding
    - Apply hover and active states
    - Implement smooth transitions
    - Support theme variants (light/dark)

11. **Add navigation analytics hooks**
    - Track menu opens/closes
    - Track link clicks
    - Track category browsing
    - Pass data to analytics callback

### Navigation Structure Overview

```
Desktop Navigation
┌─────────────────────────────────────────────┐
│ [Shop ▼] [Categories ▼] [Deals] [New]      │
│                                             │
│ ┌─────── Mega Menu (on hover) ───────┐    │
│ │ [Category Grid] [Featured] [Promo]  │    │
│ └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘

Mobile Navigation
┌─────────────────┐
│ [☰ Hamburger]  │ → Click triggers drawer
│                 │
│ ┌─────────────┐│
│ │ [X Close]   ││  Slide-in drawer
│ │             ││
│ │ Shop ▼      ││  Expandable sections
│ │   - Cat1    ││
│ │   - Cat2    ││
│ │ Deals       ││
│ │ New         ││
│ └─────────────┘│
└─────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variant | "desktop" \| "mobile" \| "both" | No | "both" | Which variant to render |
| className | string | No | "" | Additional CSS classes |
| onNavigate | (item: NavItem) => void | No | undefined | Callback on navigation |

### Navigation Items Configuration

```
Navigation Structure
├── Shop
│   ├── All Products (/shop)
│   └── Mega Menu: Categories Grid
│
├── Categories (Mega Menu)
│   ├── Electronics
│   │   ├── Phones & Tablets
│   │   ├── Computers & Laptops
│   │   └── Accessories
│   ├── Fashion
│   │   ├── Men's Clothing
│   │   ├── Women's Clothing
│   │   └── Shoes & Bags
│   └── [More categories...]
│
├── Deals (/deals)
│   └── Badge: "SALE"
│
├── New Arrivals (/new)
│   └── Badge: "NEW"
│
└── About (/about)
```

### Mega Menu Content Structure

| Section | Content | Layout |
|---------|---------|--------|
| Categories Grid | Category cards with images | 3-4 columns |
| Featured Products | Highlighted products | 2-3 items |
| Promotions | Banner or CTA | Full width or sidebar |
| Quick Links | "View All", "Shop by Brand" | Bottom row |

### Desktop Navigation Styling

| Element | Styling | Tokens |
|---------|---------|--------|
| Nav Container | `flex gap-6` | `--store-space-6` |
| Nav Link | `text-base font-medium` | `--store-font-size-base` |
| Link Default | `text-gray-700` | `--store-color-text` |
| Link Hover | `text-primary` | `--store-color-primary` |
| Link Active | `text-primary font-semibold` | `--store-color-primary` |
| Mega Menu | `absolute top-full bg-white shadow-lg` | `--store-shadow-lg` |

### Mobile Navigation Styling

| Element | Styling | Tokens |
|---------|---------|--------|
| Hamburger Button | `p-2 rounded-lg` | `--store-space-2` |
| Drawer | `fixed inset-y-0 left-0 w-80 bg-white` | - |
| Overlay | `fixed inset-0 bg-black/50` | - |
| Close Button | `absolute top-4 right-4 p-2` | `--store-space-4` |
| Nav Links | `py-3 px-4 border-b` | `--store-space-[3,4]` |
| Submenu | `pl-8 bg-gray-50` | `--store-space-8` |

### Mega Menu Layout

```
┌──────────────────────────────────────────────────────┐
│  CATEGORIES MEGA MENU                                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [Electronics]    [Fashion]      [Home & Living]    │
│   - Phones        - Men's         - Furniture        │
│   - Computers     - Women's       - Decor            │
│   - Accessories   - Kids          - Kitchen          │
│                                                      │
│  [Sports]         [Beauty]       [Books]             │
│   - Fitness       - Skincare      - Fiction          │
│   - Outdoor       - Makeup        - Non-Fiction      │
│   - Equipment     - Fragrance     - Education        │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │ Featured: "Summer Sale - Up to 50% Off"    │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Mobile Menu Behavior

| Action | Behavior | Animation |
|--------|----------|-----------|
| Hamburger Click | Open drawer | Slide in from left 300ms |
| Overlay Click | Close drawer | Slide out to left 300ms |
| Close Button | Close drawer | Slide out to left 300ms |
| ESC Key | Close drawer | Slide out to left 300ms |
| Category Click | Expand/collapse submenu | Height transition 200ms |
| Link Click | Navigate and close | Immediate |

### Active Link Detection

| Method | Implementation | Use Case |
|--------|----------------|----------|
| Exact Match | `pathname === href` | Specific pages |
| Starts With | `pathname.startsWith(href)` | Section navigation |
| Regex Match | Custom pattern | Complex routing |

### Keyboard Navigation Support

| Key | Action | Context |
|-----|--------|---------|
| Tab | Focus next link | All |
| Shift+Tab | Focus previous link | All |
| Enter / Space | Activate link | Focused link |
| Arrow Down | Next menu item | Desktop mega menu |
| Arrow Up | Previous menu item | Desktop mega menu |
| ESC | Close menu | Mega menu, mobile menu |
| Home | First menu item | Desktop mega menu |
| End | Last menu item | Desktop mega menu |

### Responsive Breakpoints

| Screen Size | Navigation Style | Menu Trigger |
|-------------|------------------|--------------|
| Mobile (<640px) | Hamburger drawer | Hamburger icon |
| Tablet (640-1024px) | Partial horizontal | Mix of both |
| Desktop (>1024px) | Full horizontal | Hover/Click |

### Expected Outcome
- Functional navigation component for desktop and mobile
- Mega menu with category grid and features
- Mobile drawer with smooth animations
- Keyboard navigation support
- Active link styling
- Analytics tracking hooks
- Design tokens applied

### Verification Checklist
- [ ] `frontend/components/storefront/layout/StoreNavigation.tsx` created
- [ ] Component accepts defined props
- [ ] Navigation items configured
- [ ] Desktop horizontal navigation implemented
- [ ] Mega menu functionality works
- [ ] Mobile hamburger menu implemented
- [ ] Drawer slide animations smooth
- [ ] Category expandable sections work
- [ ] Active link styling applied
- [ ] Keyboard navigation functional
- [ ] ESC key closes menus
- [ ] Outside click closes menus
- [ ] Design tokens applied
- [ ] Accessibility features present
- [ ] Component exports properly

---

## Task 30: Verify Layout Integration

### Overview
Conduct comprehensive verification and testing of the complete store layout integration, ensuring all components work together harmoniously. This task validates that the layout foundation, design tokens, header, footer, and navigation components are properly integrated and function correctly across all devices and scenarios.

### Dependencies
- Task 15-29: All previous tasks in this group completed
- All components created and integrated
- Store layout rendered in application

### Instructions

1. **Verify directory structure**
   - Check all component files exist in correct locations
   - Verify export statements in index files
   - Confirm proper file naming conventions
   - Ensure TypeScript types are properly defined

2. **Test layout component integration**
   - Verify StoreLayout properly wraps page content
   - Test conditional rendering (hideHeader, hideFooter)
   - Verify fullWidth prop works correctly
   - Check semantic HTML structure

3. **Verify providers hierarchy**
   - Confirm StoreProviders wraps layout properly
   - Test theme provider context availability
   - Verify cart provider state management
   - Check auth provider context access

4. **Test design token application**
   - Verify CSS variables are defined and accessible
   - Test color tokens across components
   - Check typography tokens applied correctly
   - Validate spacing tokens in use

5. **Validate header functionality**
   - Test logo link to homepage
   - Verify navigation links work
   - Test search input functionality
   - Check account, wishlist, cart buttons
   - Verify sticky header behavior
   - Test responsive collapse on mobile

6. **Validate footer functionality**
   - Test all footer links navigate correctly
   - Verify newsletter input validation
   - Check social media links open correctly
   - Test responsive column layout

7. **Validate navigation functionality**
   - Test desktop horizontal navigation
   - Verify mega menu opens and closes
   - Test mobile hamburger menu
   - Check drawer animations
   - Verify category expandable sections
   - Test keyboard navigation

8. **Test responsive behavior**
   - Test on mobile viewport (320px-639px)
   - Test on tablet viewport (640px-1023px)
   - Test on desktop viewport (1024px+)
   - Verify all breakpoint transitions smooth
   - Check touch targets on mobile (44x44px minimum)

9. **Verify accessibility features**
   - Test keyboard navigation (Tab, Enter, ESC)
   - Verify focus indicators visible
   - Check ARIA labels on icon buttons
   - Test screen reader announcements
   - Verify color contrast ratios (4.5:1 minimum)
   - Check semantic HTML landmarks

10. **Test theme switching**
    - Verify light theme renders correctly
    - Test dark theme if implemented
    - Check theme persistence across navigation
    - Verify all colors adapt to theme

11. **Validate cross-browser compatibility**
    - Test in Chrome/Edge (Chromium)
    - Test in Firefox
    - Test in Safari (if available)
    - Check for CSS compatibility issues
    - Verify JavaScript functionality

12. **Test performance**
    - Check layout rendering speed
    - Verify no layout shift (CLS)
    - Test smooth animations (60fps)
    - Check bundle size impact
    - Verify no memory leaks

13. **Create verification report**
    - Document all tested scenarios
    - Note any issues or bugs found
    - List browser compatibility results
    - Record performance metrics
    - Provide recommendations

### Verification Checklist

#### Directory Structure
- [ ] All component files exist in correct directories
- [ ] Index files with proper exports created
- [ ] File naming conventions followed
- [ ] TypeScript interfaces defined

#### Component Integration
- [ ] StoreLayout renders correctly
- [ ] StoreProviders wraps layout
- [ ] StoreHeader displays properly
- [ ] StoreFooter displays properly
- [ ] StoreNavigation functions correctly

#### Design Tokens
- [ ] CSS variables defined and accessible
- [ ] Color tokens applied across components
- [ ] Typography tokens in use
- [ ] Spacing tokens consistent
- [ ] Border radius and shadows work

#### Header Functionality
- [ ] Logo links to homepage
- [ ] Navigation links work
- [ ] Search input functional
- [ ] Account button works
- [ ] Wishlist button works
- [ ] Cart button works with count badge
- [ ] Sticky header behavior correct
- [ ] Mobile hamburger menu triggers

#### Footer Functionality
- [ ] All footer links navigate correctly
- [ ] Newsletter form validates
- [ ] Social media links work
- [ ] Payment icons display
- [ ] Copyright year dynamic
- [ ] Responsive layout works

#### Navigation Functionality
- [ ] Desktop navigation renders
- [ ] Mega menu opens/closes
- [ ] Mobile drawer opens/closes
- [ ] Category sections expand/collapse
- [ ] Active link styling works
- [ ] Keyboard navigation functional

#### Responsive Testing
- [ ] Mobile (320px-639px) tested
- [ ] Tablet (640px-1023px) tested
- [ ] Desktop (1024px+) tested
- [ ] All breakpoints transition smoothly
- [ ] Touch targets adequate on mobile

#### Accessibility
- [ ] Keyboard navigation works (Tab, Enter, ESC)
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader compatible
- [ ] Color contrast ratios meet WCAG AA (4.5:1)
- [ ] Semantic HTML used

#### Theme Switching
- [ ] Light theme renders correctly
- [ ] Dark theme (if implemented) works
- [ ] Theme persists across navigation
- [ ] All colors adapt properly

#### Cross-Browser Testing
- [ ] Chrome/Edge tested
- [ ] Firefox tested
- [ ] Safari tested (if available)
- [ ] No CSS compatibility issues
- [ ] JavaScript works across browsers

#### Performance
- [ ] Layout renders quickly
- [ ] No cumulative layout shift (CLS)
- [ ] Animations smooth (60fps)
- [ ] Bundle size acceptable
- [ ] No memory leaks detected

### Testing Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Homepage Load | Navigate to store homepage | Layout renders with header, footer, content |
| Header Navigation | Click navigation link | Navigate to correct page, active styling |
| Mega Menu | Hover over Categories | Mega menu opens with category grid |
| Mobile Menu | Click hamburger icon | Drawer slides in from left |
| Search | Type in search box, press Enter | Search executed, results page shown |
| Cart Badge | Add item to cart | Badge updates with item count |
| Sticky Header | Scroll down page | Header sticks to top, shrinks slightly |
| Footer Link | Click footer link | Navigate to correct page |
| Newsletter | Enter email, click Subscribe | Validation works, submission processed |
| Theme Toggle | Switch theme (if available) | All colors change appropriately |

### Browser Compatibility Matrix

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome | Latest | ✓ | ✓ | Test |
| Edge | Latest | ✓ | ✓ | Test |
| Firefox | Latest | ✓ | ✓ | Test |
| Safari | Latest | ✓ | ✓ | Test |
| Safari iOS | Latest | - | ✓ | Test |
| Chrome Android | Latest | - | ✓ | Test |

### Performance Benchmarks

| Metric | Target | Acceptable | Notes |
|--------|--------|------------|-------|
| Layout Render Time | <100ms | <200ms | Time to interactive |
| CLS (Cumulative Layout Shift) | <0.1 | <0.25 | No jumping content |
| Animation Frame Rate | 60fps | 50fps | Smooth transitions |
| Bundle Size Increase | <50KB | <100KB | Gzipped impact |

### Common Issues Checklist

| Issue | Check | Solution |
|-------|-------|----------|
| Layout not rendering | Providers wrapping | Ensure StoreProviders wraps layout |
| Sticky header not working | CSS position | Verify sticky/fixed positioning |
| Mobile menu not opening | State management | Check useState hook |
| Design tokens not applying | CSS variables | Verify variables defined in globals.css |
| Links not navigating | Next.js Link | Ensure using Link component |
| Responsive breakpoints off | Tailwind config | Check breakpoint definitions |

### Expected Outcome
- All layout components verified and functional
- Responsive design confirmed across devices
- Accessibility features tested and working
- Cross-browser compatibility confirmed
- Performance metrics acceptable
- Complete verification report documented
- Any issues identified and logged for resolution

### Verification Report Template

```
# Store Layout Integration Verification Report
Date: [Date]
Tester: [Name]

## Summary
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Status: [Pass/Fail]

## Component Integration
- StoreLayout: [Pass/Fail]
- StoreHeader: [Pass/Fail]
- StoreFooter: [Pass/Fail]
- StoreNavigation: [Pass/Fail]
- StoreProviders: [Pass/Fail]

## Responsive Testing
- Mobile: [Pass/Fail]
- Tablet: [Pass/Fail]
- Desktop: [Pass/Fail]

## Accessibility
- Keyboard Navigation: [Pass/Fail]
- Screen Reader: [Pass/Fail]
- Color Contrast: [Pass/Fail]
- ARIA Labels: [Pass/Fail]

## Browser Compatibility
- Chrome: [Pass/Fail]
- Firefox: [Pass/Fail]
- Safari: [Pass/Fail]

## Performance
- Render Time: [ms]
- CLS: [score]
- Animation FPS: [fps]

## Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
1. [Recommendation]
2. [Recommendation]
```

---

## Summary

This document established the store's design token system and foundational layout components, completing the layout infrastructure for the webstore. CSS variables provide a flexible theming foundation, while color, typography, and spacing tokens ensure design consistency. The header, footer, and navigation components bring the store to life with full e-commerce functionality.

### Completed Tasks
1. ✓ Defined CSS variables for store theme
2. ✓ Created store color token system
3. ✓ Created typography token system
4. ✓ Created spacing and sizing token system
5. ✓ Created store header component with search and cart
6. ✓ Created store footer with links and newsletter
7. ✓ Created store navigation with mega menu
8. ✓ Verified complete layout integration

### Key Achievements
- Comprehensive design token system
- Flexible CSS variable foundation
- Fully functional store header
- Rich footer with multiple sections
- Advanced navigation with mega menu
- Complete responsive layout
- Accessibility features throughout
- Verified integration across devices

### Next Steps
Proceed to **Group C: Store Configuration** to define store settings, metadata, navigation structure, feature flags, and environment-specific configurations that will drive the storefront's behavior and content.
