# Tasks 45-52: Spacing Scale, Border Radius, and Shadow System

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** D - Spacing & Layout System  
> **Document:** 01 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-53-58_Layout-Utilities-Docs.md](02_Tasks-53-58_Layout-Utilities-Docs.md)

---

## Document Overview

This document covers the foundation of the spacing and layout system, including the base spacing unit, extended spacing scale, container configurations, border radius definitions, box shadow scales, and specialized shadow utilities for cards and modals. These elements establish consistent visual rhythm and depth throughout the design system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Define Base Spacing Unit | Low | 5 min |
| 46 | Extend Spacing Scale | Low | 10 min |
| 47 | Configure Max Width Scale | Low | 10 min |
| 48 | Configure Container Settings | Low | 10 min |
| 49 | Define Border Radius Scale | Low | 10 min |
| 50 | Define Box Shadow Scale | Low | 15 min |
| 51 | Create Card Shadow Utilities | Low | 10 min |
| 52 | Create Modal Shadow Utilities | Low | 10 min |

---

## Task 45: Define Base Spacing Unit

### Overview
Establish a 4px base spacing unit as the foundation for consistent spacing throughout the design system. This base unit ensures mathematical consistency in spacing calculations and creates a predictable visual rhythm. The 4px unit aligns with common design practices and provides flexibility for both compact and spacious layouts.

### Dependencies
- Task 02: Initialize Tailwind configuration file

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the `theme` section

2. **Understand the base unit concept**
   - 1 spacing unit = 0.25rem = 4px (at default 16px root font size)
   - This creates consistent increments: 4px, 8px, 12px, 16px, etc.
   - Provides mathematical foundation for the spacing scale

3. **Configure spacing base unit**
   - Access the `theme.spacing` configuration
   - Verify or set the base spacing unit to 4px
   - This establishes the foundation for all spacing values

4. **Document the spacing philosophy**
   - Add inline comments explaining the 4px base
   - Note how spacing values multiply the base unit
   - Reference the mathematical relationship between units

5. **Verify default spacing values**
   - Confirm that standard spacing scale exists (0-96)
   - Ensure values follow 4px increments
   - Check that rem-based calculations are correct

### Spacing Unit System

| Spacing Key | Calculation | Rem Value | Pixel Value (16px root) |
|-------------|-------------|-----------|-------------------------|
| 1 | 1 × 0.25rem | 0.25rem | 4px |
| 2 | 2 × 0.25rem | 0.5rem | 8px |
| 3 | 3 × 0.25rem | 0.75rem | 12px |
| 4 | 4 × 0.25rem | 1rem | 16px |
| 8 | 8 × 0.25rem | 2rem | 32px |
| 16 | 16 × 0.25rem | 4rem | 64px |

### Base Unit Rationale

#### Why 4px?
- **Mathematical Harmony** - Clean multiples: 8px, 12px, 16px, 24px
- **Responsive Scaling** - Works well with rem-based responsive design
- **Design Standards** - Aligns with Material Design (8dp) and Human Interface Guidelines
- **Flexibility** - Small enough for fine control, large enough for consistency
- **Developer Experience** - Easy mental math (spacing-4 = 16px, spacing-8 = 32px)

#### Design System Benefits
```
Visual Rhythm Example:
┌──────────────────────────────────┐
│  Container                       │  padding: 16px (spacing-4)
│  ┌────────────────────────────┐  │
│  │  Card                      │  │  gap: 12px (spacing-3)
│  │  ├─ Header    ─┐           │  │
│  │  │            8px          │  │  margin: 8px (spacing-2)
│  │  ├─ Content   ─┘           │  │
│  │  │                         │  │
│  │  └─ Footer                 │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### Expected Outcome
- 4px base unit established as design system foundation
- Clear documentation of spacing unit calculations
- Consistent mathematical relationship between spacing values
- Foundation for extended spacing scale

### Verification Checklist
- [ ] Tailwind spacing configuration accessed
- [ ] Base unit of 4px (0.25rem) confirmed
- [ ] Default spacing scale verified
- [ ] Spacing calculation documented
- [ ] Inline comments added to config file
- [ ] Base unit philosophy understood

---

## Task 46: Extend Spacing Scale

### Overview
Extend the default Tailwind spacing scale with additional fractional values to provide more granular spacing control. This includes half-unit increments (0.5, 1.5, 2.5) and additional large-scale values. These extensions enable precise spacing adjustments while maintaining the 4px base unit consistency.

### Dependencies
- Task 45: Define Base Spacing Unit

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the `theme.extend.spacing` section

2. **Add fractional spacing values**
   - Extend spacing scale with 0.5 unit increments
   - Maintain rem-based values for responsive scaling
   - Focus on commonly needed fractional values

3. **Configure half-unit values**
   - Add spacing-0.5 (0.125rem = 2px)
   - Add spacing-1.5 (0.375rem = 6px)
   - Add spacing-2.5 (0.625rem = 10px)
   - Add spacing-3.5 (0.875rem = 14px)

4. **Add extended large values**
   - Verify spacing values up to spacing-96 exist
   - Consider adding spacing-128 (32rem = 512px) if needed
   - Ensure consistent scaling pattern

5. **Document extended spacing usage**
   - Add comments for fractional value use cases
   - Note when to use half-units vs full units
   - Provide examples of common applications

6. **Create spacing scale reference**
   - Document all available spacing values
   - Include both rem and pixel equivalents
   - Provide usage guidelines for each range

### Extended Spacing Scale

| Key | Rem Value | Pixel Value | Common Usage |
|-----|-----------|-------------|--------------|
| 0 | 0 | 0px | No spacing |
| 0.5 | 0.125rem | 2px | Minimal gap, tight spacing |
| 1 | 0.25rem | 4px | Very tight spacing |
| 1.5 | 0.375rem | 6px | Subtle separation |
| 2 | 0.5rem | 8px | Small spacing |
| 2.5 | 0.625rem | 10px | Between small and medium |
| 3 | 0.75rem | 12px | Medium-small spacing |
| 4 | 1rem | 16px | Standard spacing |
| 5 | 1.25rem | 20px | Medium spacing |
| 6 | 1.5rem | 24px | Medium-large spacing |
| 8 | 2rem | 32px | Large spacing |
| 10 | 2.5rem | 40px | Section spacing |
| 12 | 3rem | 48px | Component spacing |
| 16 | 4rem | 64px | Layout spacing |
| 20 | 5rem | 80px | Large layout spacing |
| 24 | 6rem | 96px | Extra large spacing |

### Spacing Usage Guidelines

#### Fractional Values (0.5, 1.5, 2.5)
- **Icon spacing** - Small gaps between icon and text
- **Form fields** - Subtle padding adjustments
- **Button padding** - Fine-tune button dimensions
- **Badge spacing** - Compact component spacing
- **List items** - Tight vertical spacing

#### Small Values (1-4)
- **Component padding** - Internal component spacing
- **Gap between elements** - Closely related items
- **Border spacing** - Space around borders
- **Icon margins** - Icon to text spacing

#### Medium Values (5-12)
- **Section padding** - Standard component padding
- **Card spacing** - Internal card spacing
- **Form spacing** - Between form elements
- **Grid gaps** - Standard grid spacing

#### Large Values (16-24+)
- **Layout spacing** - Between major sections
- **Container padding** - Page-level padding
- **Modal spacing** - Large component spacing
- **Hero sections** - Feature area spacing

### Visual Spacing Hierarchy

```
Spacing Hierarchy Example:

┌───────────────────────────────────────────────┐
│  Page Container (padding-8 = 32px)           │
│  ┌─────────────────────────────────────────┐ │
│  │  Section (margin-bottom-12 = 48px)      │ │
│  │  ┌───────────────────────────────────┐  │ │
│  │  │  Card (padding-6 = 24px)          │  │ │
│  │  │  ┌─────────────────────────────┐  │  │ │
│  │  │  │  Content (gap-4 = 16px)     │  │  │ │
│  │  │  │  • Item (margin-2 = 8px)    │  │  │ │
│  │  │  │  • Item (margin-2 = 8px)    │  │  │ │
│  │  │  └─────────────────────────────┘  │  │ │
│  │  └───────────────────────────────────┘  │ │
│  └─────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘

Spacing decreases as you go deeper into the hierarchy
```

### Expected Outcome
- Extended spacing scale with fractional values
- More granular spacing control
- Clear usage guidelines for different spacing ranges
- Consistent spacing hierarchy throughout design

### Verification Checklist
- [ ] Fractional spacing values added (0.5, 1.5, 2.5, 3.5)
- [ ] Extended spacing scale configured
- [ ] Spacing scale documented with pixel equivalents
- [ ] Usage guidelines created
- [ ] Visual hierarchy examples documented
- [ ] Configuration properly extends default spacing

---

## Task 47: Configure Max Width Scale

### Overview
Configure the maximum width scale for content containers to ensure optimal reading experience and responsive layouts. Define standard max-width breakpoints aligned with design best practices for content width. These values control the maximum width of centered containers at different viewport sizes.

### Dependencies
- Task 02: Initialize Tailwind configuration file

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the `theme.extend.maxWidth` section

2. **Understand max-width purpose**
   - Controls maximum content width
   - Ensures readable line lengths
   - Creates responsive container behavior
   - Aligns with screen size breakpoints

3. **Configure standard max-width values**
   - Define max-w-sm (640px) for small content
   - Define max-w-md (768px) for medium content
   - Define max-w-lg (1024px) for large content
   - Define max-w-xl (1280px) for extra large content
   - Define max-w-2xl (1536px) for maximum width

4. **Add specialized max-widths**
   - Consider max-w-prose (65ch) for readable text
   - Add max-w-screen-* variants if needed
   - Include percentage-based max-widths if required

5. **Document max-width usage**
   - Provide guidelines for each max-width value
   - Note when to use specific sizes
   - Include responsive considerations

6. **Align with container strategy**
   - Ensure max-width values match container needs
   - Consider dashboard layout requirements
   - Plan for full-width and contained sections

### Max-Width Scale

| Class | Value | Usage | Optimal For |
|-------|-------|-------|-------------|
| max-w-sm | 640px | Small content blocks | Mobile-first content, narrow forms |
| max-w-md | 768px | Medium content | Tablet content, standard forms |
| max-w-lg | 1024px | Large content | Desktop content, wide forms |
| max-w-xl | 1280px | Extra large | Dashboard layouts, data tables |
| max-w-2xl | 1536px | Maximum width | Full dashboard, complex layouts |
| max-w-prose | 65ch | Reading content | Blog posts, documentation |
| max-w-full | 100% | Full width | Full-bleed sections |
| max-w-screen-sm | 640px | Match breakpoint | Responsive max-width |
| max-w-screen-md | 768px | Match breakpoint | Responsive max-width |
| max-w-screen-lg | 1024px | Match breakpoint | Responsive max-width |
| max-w-screen-xl | 1280px | Match breakpoint | Responsive max-width |
| max-w-screen-2xl | 1536px | Match breakpoint | Responsive max-width |

### Max-Width Usage Guidelines

#### Small (max-w-sm: 640px)
- Login forms
- Simple dialogs
- Mobile-first content
- Narrow sidebars
- Compact widgets

#### Medium (max-w-md: 768px)
- Standard forms
- Modal dialogs
- Product cards
- Profile sections
- Settings panels

#### Large (max-w-lg: 1024px)
- Content sections
- Wide forms
- Dashboard cards
- Data displays
- Feature sections

#### Extra Large (max-w-xl: 1280px)
- Dashboard layouts
- Data tables
- Complex forms
- Multi-column content
- Admin interfaces

#### 2XL (max-w-2xl: 1536px)
- Full dashboard
- Wide data tables
- Multi-panel layouts
- Analytics dashboards
- Complex interfaces

#### Prose (max-w-prose: 65ch)
- Article content
- Documentation
- Blog posts
- Long-form text
- Reading interfaces

### Content Width Visual Reference

```
┌─────────────────────────────────────────────────────┐
│                    Browser Window                    │
│                                                       │
│    ┌─────────────────────────────────────────┐      │
│    │          max-w-2xl (1536px)            │      │
│    │  ┌───────────────────────────────────┐ │      │
│    │  │     max-w-xl (1280px)            │ │      │
│    │  │  ┌─────────────────────────────┐ │ │      │
│    │  │  │   max-w-lg (1024px)        │ │ │      │
│    │  │  │  ┌───────────────────────┐ │ │ │      │
│    │  │  │  │ max-w-md (768px)     │ │ │ │      │
│    │  │  │  │  ┌─────────────────┐ │ │ │ │      │
│    │  │  │  │  │ max-w-sm (640px)│ │ │ │ │      │
│    │  │  │  │  │                 │ │ │ │ │      │
│    │  │  │  │  │     Content     │ │ │ │ │      │
│    │  │  │  │  │                 │ │ │ │ │      │
│    │  │  │  │  └─────────────────┘ │ │ │ │      │
│    │  │  │  └───────────────────────┘ │ │ │      │
│    │  │  └─────────────────────────────┘ │ │      │
│    │  └───────────────────────────────────┘ │      │
│    └─────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────┘
```

### Expected Outcome
- Comprehensive max-width scale configured
- Clear guidelines for each width value
- Responsive content width strategy
- Foundation for container system

### Verification Checklist
- [ ] Standard max-width values configured (sm to 2xl)
- [ ] Max-width prose value added
- [ ] Max-width screen variants included
- [ ] Usage guidelines documented
- [ ] Visual reference created
- [ ] Values aligned with design requirements

---

## Task 48: Configure Container Settings

### Overview
Configure container utility settings to create responsive, centered layout containers with automatic padding. Define container behavior at different breakpoints, including maximum widths, centering, and horizontal padding. This ensures consistent page layout structure across the application.

### Dependencies
- Task 47: Configure Max Width Scale

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the `theme.container` section

2. **Enable container centering**
   - Configure container to center by default
   - Set `center: true` in container configuration
   - This applies `margin-left: auto` and `margin-right: auto`

3. **Configure default container padding**
   - Add horizontal padding to containers
   - Define default padding value (typically 1rem or 2rem)
   - Ensures content doesn't touch viewport edges

4. **Define responsive padding**
   - Configure padding per breakpoint
   - Increase padding on larger screens
   - Provide comfortable margins at all viewport sizes

5. **Configure container max-widths**
   - Set max-width at each breakpoint
   - Align with standard breakpoint values
   - Ensure smooth responsive behavior

6. **Document container usage**
   - Provide examples of container usage
   - Explain centering and padding behavior
   - Note when to use container vs custom max-width

### Container Configuration

| Breakpoint | Screen Size | Container Max-Width | Padding |
|------------|-------------|---------------------|---------|
| default | < 640px | 100% | 1rem (16px) |
| sm | ≥ 640px | 640px | 1rem (16px) |
| md | ≥ 768px | 768px | 1.5rem (24px) |
| lg | ≥ 1024px | 1024px | 2rem (32px) |
| xl | ≥ 1280px | 1280px | 2rem (32px) |
| 2xl | ≥ 1536px | 1536px | 2rem (32px) |

### Container Behavior

#### Default Container
- Automatically centers content
- Applies horizontal padding
- Responsive max-width at each breakpoint
- Full width on mobile, constrained on desktop

#### Container with Custom Padding
- Override default padding per use case
- Use `container px-4` for custom padding
- Combine with responsive variants: `container px-4 md:px-8`

#### Container vs Max-Width
- **Use container** for page-level layouts
- **Use max-width** for component-level constraints
- **Combine both** for nested layouts when needed

### Container Visual Examples

#### Standard Container Behavior
```
Mobile (< 640px):
┌───────────────────────────────┐
│ ◄─ 16px padding               │
│  ┌─────────────────────────┐  │
│  │      Content            │  │
│  │      (full width)       │  │
│  └─────────────────────────┘  │
│                16px padding ─►│
└───────────────────────────────┘

Desktop (≥ 1280px):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  ◄─ auto margin  ┌─────────────────────────┐  auto ─►   │
│                  │  Container (max 1280px) │            │
│  ◄─ 32px padding │      Content            │  32px ─►   │
│                  │                         │            │
│                  └─────────────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

#### Nested Containers
```
┌─────────────────────────────────────────────────────────┐
│  Outer Container (max-w-2xl, centered)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Inner Section (max-w-lg, centered)               │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Content                                    │  │  │
│  │  │  • Outer: page-level layout                 │  │  │
│  │  │  • Inner: content constraint                │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Responsive container utility configured
- Automatic centering and padding
- Consistent page layout structure
- Clear container usage guidelines

### Verification Checklist
- [ ] Container centering enabled (center: true)
- [ ] Default padding configured
- [ ] Responsive padding per breakpoint defined
- [ ] Container max-widths aligned with breakpoints
- [ ] Container behavior documented
- [ ] Usage examples created

---

## Task 49: Define Border Radius Scale

### Overview
Define a comprehensive border radius scale to provide consistent corner rounding options across the design system. Establish values from sharp corners to fully rounded elements, supporting various UI components including cards, buttons, inputs, modals, and circular elements.

### Dependencies
- Task 02: Initialize Tailwind configuration file

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the `theme.extend.borderRadius` section

2. **Configure standard border radius values**
   - Define none (0) for sharp corners
   - Define sm (0.125rem / 2px) for subtle rounding
   - Define default (0.375rem / 6px) for standard rounding
   - Define md (0.375rem / 6px) as alias for default
   - Define lg (0.5rem / 8px) for cards

3. **Configure extended border radius values**
   - Define xl (0.75rem / 12px) for large cards
   - Define 2xl (1rem / 16px) for modals
   - Define 3xl (1.5rem / 24px) for prominent elements
   - Define full (9999px) for circular/pill shapes

4. **Document border radius usage**
   - Provide guidelines for each radius value
   - Include component-specific recommendations
   - Note accessibility considerations

5. **Create border radius scale reference**
   - Document all available radius values
   - Show visual examples of each size
   - Provide common use cases

### Border Radius Scale

| Class | Value | Pixels | Visual | Common Usage |
|-------|-------|--------|--------|--------------|
| rounded-none | 0 | 0px | ⬜ | Sharp edges, formal interfaces |
| rounded-sm | 0.125rem | 2px | ▢ | Subtle rounding, minimal style |
| rounded | 0.375rem | 6px | ◻ | Default buttons, inputs |
| rounded-md | 0.375rem | 6px | ◻ | Same as default |
| rounded-lg | 0.5rem | 8px | ▢ | Cards, panels |
| rounded-xl | 0.75rem | 12px | ○ | Large cards, containers |
| rounded-2xl | 1rem | 16px | ◯ | Modals, prominent cards |
| rounded-3xl | 1.5rem | 24px | ◉ | Hero sections, featured content |
| rounded-full | 9999px | Full | ● | Avatars, badges, pills |

### Border Radius Usage by Component

#### Buttons
- **Primary/Secondary:** rounded-md (6px) - Standard button appearance
- **Pill buttons:** rounded-full - Modern, friendly design
- **Icon buttons:** rounded-lg or rounded-full - Depending on style

#### Form Inputs
- **Text inputs:** rounded-md (6px) - Standard form appearance
- **Selects/dropdowns:** rounded-md (6px) - Consistent with inputs
- **Checkboxes:** rounded-sm (2px) - Subtle rounding
- **Radio buttons:** rounded-full - Circular by nature

#### Cards & Panels
- **Standard cards:** rounded-lg (8px) - Comfortable card appearance
- **Large cards:** rounded-xl (12px) - Prominent cards
- **Featured cards:** rounded-2xl (16px) - Hero/featured content
- **Nested cards:** Use smaller radius than parent

#### Modals & Overlays
- **Modals:** rounded-2xl (16px) - Prominent, floating appearance
- **Tooltips:** rounded-md (6px) - Small, subtle
- **Popovers:** rounded-lg (8px) - Medium prominence
- **Sheets:** rounded-t-2xl (16px top only) - Bottom sheets

#### Images & Media
- **Thumbnails:** rounded-md (6px) - Standard images
- **Avatars:** rounded-full - Circular profile images
- **Gallery images:** rounded-lg (8px) - Featured images
- **Product images:** rounded-lg (8px) - E-commerce display

#### Badges & Tags
- **Badges:** rounded-full - Pill-shaped badges
- **Tags:** rounded-md (6px) - Standard tags
- **Status indicators:** rounded-full - Circular dots

### Border Radius Visual Scale

```
Border Radius Progression:

┌─────────┐    ┌────────┐    ┌───────┐    ╭──────╮    ╭─────╮    ●
│  none   │    │  sm    │    │  md   │    │  lg  │    │ xl  │   full
│         │    │        │    │       │    │      │    │     │
│    0px  │    │   2px  │    │  6px  │    │ 8px  │    │12px │  9999px
└─────────┘    └────────┘    └───────┘    ╰──────╯    ╰─────╯
     ▢             ▢             ◻            ▢           ○       ●

    Sharp       Subtle      Standard       Cards     Large Card  Circle
```

### Border Radius Hierarchy

```
Component Hierarchy Example:

┌────────────────────────────────────────────────────╮  Modal (2xl/16px)
│  Modal Header                                      │
│  ╭──────────────────────────────────────────────╮  │  Card (xl/12px)
│  │  Card Component                              │  │
│  │  ┌────────────────────────────────────────┐  │  │  Input (md/6px)
│  │  │  Input Field                           │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │  ╔════╗ ╔════╗                              │  │  Buttons (md/6px)
│  │  ║ OK ║ ║ ✕  ║                              │  │
│  │  ╚════╝ ╚════╝                              │  │
│  ╰──────────────────────────────────────────────╯  │
╰────────────────────────────────────────────────────╯

Larger radius for outer containers, smaller for inner elements
```

### Expected Outcome
- Complete border radius scale defined
- Clear usage guidelines per component type
- Visual reference for all radius values
- Consistent corner rounding throughout design

### Verification Checklist
- [ ] All standard radius values defined (none, sm, md, lg, xl, 2xl, 3xl, full)
- [ ] Default radius value set
- [ ] Component-specific guidelines documented
- [ ] Visual scale reference created
- [ ] Hierarchy examples provided
- [ ] Accessibility considerations noted

---

## Task 50: Define Box Shadow Scale

### Overview
Define a comprehensive box shadow scale to create visual depth and hierarchy in the interface. Establish shadow values from subtle elevation to prominent floating elements, including standard shadows, inner shadows, and colored shadows for specific states. Shadows enhance the perception of layers and z-axis positioning.

### Dependencies
- Task 02: Initialize Tailwind configuration file

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the `theme.extend.boxShadow` section

2. **Configure small shadows**
   - Define shadow-sm for subtle elevation
   - Use minimal blur and offset
   - Appropriate for slight depth

3. **Configure standard shadows**
   - Define shadow-DEFAULT for standard elevation
   - Balance between subtle and prominent
   - Most commonly used shadow

4. **Configure medium shadows**
   - Define shadow-md for medium elevation
   - More pronounced than default
   - Used for floating elements

5. **Configure large shadows**
   - Define shadow-lg for cards and dropdowns
   - Define shadow-xl for modals
   - Define shadow-2xl for prominent floating elements
   - Increase blur and spread progressively

6. **Configure special shadows**
   - Define shadow-inner for inset effects
   - Consider shadow-none for removing shadows
   - Add colored shadows for focus/hover states if needed

7. **Document shadow usage**
   - Provide guidelines for each shadow level
   - Include elevation hierarchy
   - Note performance considerations

### Box Shadow Scale

| Class | Blur | Spread | Y-Offset | Opacity | Usage |
|-------|------|--------|----------|---------|-------|
| shadow-sm | 1px | 0 | 1px | 0.05 | Minimal elevation |
| shadow | 1px, 2px | 0, 0 | 1px, 2px | 0.1, 0.06 | Standard elevation |
| shadow-md | 4px, 2px | -2px, 0 | 4px, 2px | 0.1, 0.06 | Medium elevation |
| shadow-lg | 10px, 4px | -5px, -2px | 10px, 4px | 0.1, 0.05 | Dropdowns, cards |
| shadow-xl | 20px, 8px | -10px, -4px | 20px, 8px | 0.1, 0.04 | Modals |
| shadow-2xl | 25px | -12px | 25px | 0.08 | Floating elements |
| shadow-inner | 2px inset | - | 2px inset | 0.06 | Inset depth |
| shadow-none | - | - | - | - | Remove shadow |

### Shadow Elevation Hierarchy

#### Level 1: Minimal (shadow-sm)
- **Elevation:** 1-2px above surface
- **Usage:** Slight depth, subtle separation
- **Components:** Flat buttons, subtle dividers, inactive states
- **Z-axis:** Just above base surface

#### Level 2: Standard (shadow)
- **Elevation:** 2-4px above surface
- **Usage:** Default elevation, standard separation
- **Components:** Buttons, input fields, small cards
- **Z-axis:** Standard UI elements

#### Level 3: Medium (shadow-md)
- **Elevation:** 4-6px above surface
- **Usage:** Floating elements, hover states
- **Components:** Hovered buttons, active inputs, tooltips
- **Z-axis:** Interactive elevation

#### Level 4: Raised (shadow-lg)
- **Elevation:** 8-10px above surface
- **Usage:** Elevated components, dropdowns
- **Components:** Cards, panels, dropdown menus, date pickers
- **Z-axis:** Raised components

#### Level 5: High (shadow-xl)
- **Elevation:** 16-20px above surface
- **Usage:** Prominent floating elements
- **Components:** Modals, dialogs, popovers
- **Z-axis:** Overlay elements

#### Level 6: Maximum (shadow-2xl)
- **Elevation:** 24-25px above surface
- **Usage:** Highest elevation, floating above all
- **Components:** Drag handles, toast notifications, floating action buttons
- **Z-axis:** Top-level elements

#### Inset (shadow-inner)
- **Elevation:** Negative depth (inward)
- **Usage:** Pressed states, wells
- **Components:** Pressed buttons, input wells, sunken containers
- **Z-axis:** Below surface

### Shadow Visual Elevation

```
Shadow Elevation Stack (Side View):

                              ┌──────────────┐
                              │   2xl        │  Level 6: Maximum
                              └──────┬───────┘
                          ┌──────────┴───────────┐
                          │   xl                 │  Level 5: High
                          └──────┬───────────────┘
                      ┌──────────┴────────────┐
                      │   lg                  │     Level 4: Raised
                      └──────┬────────────────┘
                  ┌──────────┴─────────────┐
                  │   md                   │        Level 3: Medium
                  └──────┬─────────────────┘
              ┌──────────┴──────────────┐
              │   default               │           Level 2: Standard
              └──────┬──────────────────┘
          ┌──────────┴───────────────┐
          │   sm                     │              Level 1: Minimal
══════════┴══════════════════════════┴═════════════  Base Surface (0)
          ┌──────────────────────────┐
          │   inner (inset)          │              Negative depth
          └──────────────────────────┘
```

### Shadow Usage by Component

#### Buttons
- **Default state:** shadow-sm
- **Hover state:** shadow-md
- **Active/pressed:** shadow-inner or shadow-none
- **Floating action buttons:** shadow-xl

#### Cards
- **Standard cards:** shadow-lg
- **Hovered cards:** shadow-xl
- **Featured cards:** shadow-2xl
- **Flat cards:** shadow-sm or shadow-none

#### Dropdowns & Menus
- **Dropdown menus:** shadow-lg
- **Context menus:** shadow-xl
- **Select dropdowns:** shadow-lg
- **Autocomplete lists:** shadow-lg

#### Modals & Overlays
- **Modals:** shadow-xl or shadow-2xl
- **Dialogs:** shadow-xl
- **Popovers:** shadow-lg
- **Tooltips:** shadow-md

#### Form Elements
- **Text inputs:** shadow-sm (default), shadow-md (focus)
- **Select boxes:** shadow-sm (default), shadow-lg (open)
- **Textareas:** shadow-sm
- **Input wells:** shadow-inner

#### Navigation
- **Navigation bars:** shadow-sm or shadow-md
- **Sidebars:** shadow-lg (when floating)
- **Tabs:** shadow-sm (active tab)
- **Breadcrumbs:** shadow-none

### Expected Outcome
- Complete box shadow scale defined
- Clear elevation hierarchy established
- Component-specific shadow guidelines
- Visual depth and layering system

### Verification Checklist
- [ ] All shadow levels defined (sm, default, md, lg, xl, 2xl)
- [ ] Inner shadow configured
- [ ] Shadow values use appropriate blur and offset
- [ ] Elevation hierarchy documented
- [ ] Component usage guidelines provided
- [ ] Visual elevation diagram created

---

## Task 51: Create Card Shadow Utilities

### Overview
Create specialized shadow utilities for card components, including default card shadows, hover state shadows, and interactive card shadows. These utilities provide consistent elevation behavior for cards throughout the design system, enhancing the visual hierarchy and interaction feedback.

### Dependencies
- Task 50: Define Box Shadow Scale

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the `theme.extend.boxShadow` section

2. **Define card-default shadow**
   - Create shadow utility specifically for card default state
   - Use shadow-lg as base (10px blur, subtle offset)
   - Consider slightly softer opacity for cards

3. **Define card-hover shadow**
   - Create shadow utility for card hover state
   - Use shadow-xl as base (20px blur, more offset)
   - Provide elevation feedback on hover

4. **Define card-active shadow**
   - Create shadow utility for card active/pressed state
   - Use shadow-md or shadow as base
   - Reduce elevation when card is clicked

5. **Define card-flat shadow**
   - Create shadow utility for flat card variant
   - Use shadow-sm for minimal elevation
   - Appropriate for dense layouts

6. **Define card-featured shadow**
   - Create shadow utility for featured/highlighted cards
   - Use shadow-2xl as base
   - Maximum elevation for prominent cards

7. **Document card shadow usage**
   - Provide transition guidelines (hover effects)
   - Include state-specific recommendations
   - Note accessibility considerations

### Card Shadow Specifications

| Shadow Utility | Base Shadow | Blur | Y-Offset | Use Case |
|----------------|-------------|------|----------|----------|
| shadow-card | shadow-lg | 10px | 10px | Default card state |
| shadow-card-hover | shadow-xl | 20px | 20px | Hovered interactive card |
| shadow-card-active | shadow-md | 4px | 4px | Clicked/active card |
| shadow-card-flat | shadow-sm | 1px | 1px | Minimal elevation card |
| shadow-card-featured | shadow-2xl | 25px | 25px | Featured/hero card |

### Card Shadow States

#### Default Card State
```
┌────────────────────────────┐
│                            │
│      Card Content          │     shadow-card (lg)
│                            │     Subtle, resting elevation
│                            │
└────────────────────────────┘
       ═══════════════
     (standard shadow)
```

#### Hovered Card State
```
┌────────────────────────────┐
│                            │
│      Card Content          │     shadow-card-hover (xl)
│      (Interactive)         │     Elevated, ready for action
│                            │
└────────────────────────────┘
       ═══════════════════
     (elevated shadow)
```

#### Active/Pressed Card State
```
┌────────────────────────────┐
│                            │
│      Card Content          │     shadow-card-active (md)
│      (Pressed)             │     Reduced elevation
│                            │
└────────────────────────────┘
         ════════
     (reduced shadow)
```

#### Flat Card Variant
```
┌────────────────────────────┐
│                            │
│      Card Content          │     shadow-card-flat (sm)
│      (Dense layout)        │     Minimal elevation
│                            │
└────────────────────────────┘
          ═══
     (minimal shadow)
```

#### Featured Card
```
╔════════════════════════════╗
║                            ║
║      Featured Card         ║     shadow-card-featured (2xl)
║      (Hero/Important)      ║     Maximum elevation
║                            ║
╚════════════════════════════╝
    ═════════════════════════
     (prominent shadow)
```

### Card Shadow Usage Guidelines

#### Static Cards
- Use `shadow-card` for default state
- No hover effects needed
- Consistent elevation
- Example: Dashboard metric cards, info panels

#### Interactive Cards
- Use `shadow-card` for default state
- Use `shadow-card-hover` on hover
- Use `shadow-card-active` on active/pressed
- Add transition for smooth animation
- Example: Clickable product cards, navigation cards

#### Dense Layouts
- Use `shadow-card-flat` for minimal elevation
- Appropriate for card grids with many items
- Reduces visual weight
- Example: Image galleries, list views

#### Featured Content
- Use `shadow-card-featured` for prominence
- Draw attention to important content
- Use sparingly (1-2 per screen)
- Example: Hero cards, promotional banners

### Card Shadow Transitions

#### Smooth Hover Animation
- Transition property: `box-shadow`
- Duration: 200-300ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Combine with subtle scale transform

#### Animation Specifications
```
Default → Hover
  shadow-card  ──(300ms)──►  shadow-card-hover
  (10px blur)                (20px blur)
  scale(1)                   scale(1.02)

Hover → Active
  shadow-card-hover ──(150ms)──► shadow-card-active
  (20px blur)                     (4px blur)
  scale(1.02)                     scale(0.98)
```

### Expected Outcome
- Specialized card shadow utilities created
- Clear state-based shadow variations
- Smooth transition guidelines
- Consistent card elevation behavior

### Verification Checklist
- [ ] shadow-card utility defined
- [ ] shadow-card-hover utility defined
- [ ] shadow-card-active utility defined
- [ ] shadow-card-flat utility defined
- [ ] shadow-card-featured utility defined
- [ ] Transition guidelines documented
- [ ] Usage scenarios provided
- [ ] Visual state diagrams created

---

## Task 52: Create Modal Shadow Utilities

### Overview
Create specialized shadow utilities for modal and overlay components, including standard modal shadows, large modal shadows, and backdrop shadows. These utilities ensure modals appear prominently above page content with appropriate visual depth, supporting different modal sizes and importance levels.

### Dependencies
- Task 50: Define Box Shadow Scale

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the `theme.extend.boxShadow` section

2. **Define modal-default shadow**
   - Create shadow utility for standard modals
   - Use shadow-xl as base (20px blur, significant offset)
   - Ensure clear separation from page content

3. **Define modal-large shadow**
   - Create shadow utility for large/full-screen modals
   - Use shadow-2xl as base (25px blur, maximum offset)
   - Prominent elevation for important dialogs

4. **Define modal-drawer shadow**
   - Create shadow utility for drawer/sheet modals
   - Use shadow-xl with directional emphasis
   - Appropriate for side panels

5. **Define modal-dialog shadow**
   - Create shadow utility for small dialog boxes
   - Use shadow-lg or shadow-xl as base
   - Balanced elevation for dialogs

6. **Define modal-popover shadow**
   - Create shadow utility for popover-style modals
   - Use shadow-lg as base
   - Subtle elevation for contextual overlays

7. **Document modal shadow usage**
   - Provide guidelines for different modal types
   - Include backdrop interaction notes
   - Note z-index coordination with shadows

### Modal Shadow Specifications

| Shadow Utility | Base Shadow | Blur | Y-Offset | Use Case |
|----------------|-------------|------|----------|----------|
| shadow-modal | shadow-xl | 20px | 20px | Standard modal dialog |
| shadow-modal-lg | shadow-2xl | 25px | 25px | Large/full-screen modal |
| shadow-modal-drawer | shadow-xl | 20px | 0px (directional) | Side drawer/sheet |
| shadow-modal-dialog | shadow-xl | 20px | 15px | Confirmation dialog |
| shadow-modal-popover | shadow-lg | 10px | 10px | Contextual popover |

### Modal Shadow Hierarchy

#### Standard Modal (shadow-modal)
```
┌─────────────────────────────────────────┐
│         Page Content (backdrop)         │
│                                         │
│    ╔═════════════════════════════╗     │
│    ║                             ║     │  shadow-modal (xl)
│    ║       Modal Dialog          ║     │  Clear elevation
│    ║                             ║     │  z-index: 250
│    ║  ┌──────────────────────┐   ║     │
│    ║  │  Modal Content       │   ║     │
│    ║  │                      │   ║     │
│    ║  └──────────────────────┘   ║     │
│    ║   [Cancel]      [Confirm]   ║     │
│    ╚═════════════════════════════╝     │
│                                         │
└─────────────────────────────────────────┘
           ═══════════════════
          (prominent shadow)
```

#### Large Modal (shadow-modal-lg)
```
┌─────────────────────────────────────────┐
│         Page Content (backdrop)         │
│                                         │
│  ╔═══════════════════════════════════╗  │
│  ║                                   ║  │  shadow-modal-lg (2xl)
│  ║      Large Modal / Wizard        ║  │  Maximum elevation
│  ║                                   ║  │  z-index: 250
│  ║  ┌─────────────────────────────┐ ║  │
│  ║  │                             │ ║  │
│  ║  │     Modal Content           │ ║  │
│  ║  │                             │ ║  │
│  ║  └─────────────────────────────┘ ║  │
│  ║   [Back]    [Cancel]   [Next]   ║  │
│  ╚═══════════════════════════════════╝  │
│                                         │
└─────────────────────────────────────────┘
       ═══════════════════════════
          (maximum shadow)
```

#### Drawer Modal (shadow-modal-drawer)
```
┌─────────────────────────────────────────┐
│ Page Content (backdrop)    ┃            │
│                            ┃  ╔═══════╗ │  shadow-modal-drawer
│                            ┃  ║       ║ │  Directional shadow
│                            ┃  ║ Side  ║ │  Emphasizes edge
│                            ┃  ║ Panel ║ │  z-index: 250
│                            ┃  ║       ║ │
│                            ┃  ║       ║ │
│                            ┃  ╚═══════╝ │
└─────────────────────────────────────────┘
                            ║══════════════
                         (side shadow)
```

#### Dialog Modal (shadow-modal-dialog)
```
┌─────────────────────────────────────────┐
│         Page Content (backdrop)         │
│                                         │
│                                         │
│        ╔═══════════════════╗            │
│        ║  Confirm Action?  ║            │  shadow-modal-dialog
│        ╟───────────────────╢            │  Balanced elevation
│        ║ Are you sure you  ║            │  z-index: 250
│        ║ want to proceed?  ║            │
│        ║                   ║            │
│        ║  [No]      [Yes]  ║            │
│        ╚═══════════════════╝            │
│                                         │
└─────────────────────────────────────────┘
             ═══════════
          (dialog shadow)
```

#### Popover Modal (shadow-modal-popover)
```
┌─────────────────────────────────────────┐
│         Page Content                    │
│                                         │
│   [Button]                              │
│      ▼                                  │
│    ╔═══════════════╗                    │  shadow-modal-popover
│    ║  Options      ║                    │  Subtle elevation
│    ║  • Option 1   ║                    │  z-index: 300
│    ║  • Option 2   ║                    │
│    ║  • Option 3   ║                    │
│    ╚═══════════════╝                    │
│                                         │
└─────────────────────────────────────────┘
        ═══════════
     (popover shadow)
```

### Modal Shadow Usage Guidelines

#### Standard Modals
- Use `shadow-modal` for default dialogs
- Apply to modal container element
- Coordinate with `z-index: 250`
- Appropriate for most modal use cases

#### Large Modals
- Use `shadow-modal-lg` for full-screen modals
- Use for wizards, multi-step forms
- Maximum visual prominence
- Coordinate with `z-index: 250`

#### Drawer Modals
- Use `shadow-modal-drawer` for side panels
- Shadow emphasizes the edge (left or right)
- Use for navigation drawers, filters
- Coordinate with `z-index: 250`

#### Dialog Modals
- Use `shadow-modal-dialog` for confirmations
- Smaller, focused dialogs
- Use for yes/no, ok/cancel prompts
- Coordinate with `z-index: 250`

#### Popover Modals
- Use `shadow-modal-popover` for contextual overlays
- Lighter elevation than full modals
- Use for tooltips, dropdown menus
- Coordinate with `z-index: 300` (above modals)

### Modal Shadow and Z-Index Coordination

| Component | Shadow | Z-Index | Layer |
|-----------|--------|---------|-------|
| Page content | none | 0 | Base |
| Modal backdrop | none | 200 | Overlay |
| Modal container | shadow-modal | 250 | Above backdrop |
| Modal popover | shadow-modal-popover | 300 | Above modal |
| Toast notification | shadow-2xl | 400 | Top layer |

### Expected Outcome
- Specialized modal shadow utilities created
- Clear shadow variations for modal types
- Z-index coordination documented
- Consistent modal elevation behavior

### Verification Checklist
- [ ] shadow-modal utility defined
- [ ] shadow-modal-lg utility defined
- [ ] shadow-modal-drawer utility defined
- [ ] shadow-modal-dialog utility defined
- [ ] shadow-modal-popover utility defined
- [ ] Usage guidelines documented
- [ ] Visual hierarchy diagrams created
- [ ] Z-index coordination noted

---

## Summary

This document established the foundation of the spacing and layout system:

### Completed Infrastructure
- ✅ Base spacing unit (4px) defined
- ✅ Extended spacing scale with fractional values (0.5, 1.5, 2.5)
- ✅ Max-width scale configured (sm to 2xl)
- ✅ Container settings with centering and padding
- ✅ Border radius scale (none to full)
- ✅ Box shadow scale (sm to 2xl, inner)
- ✅ Card shadow utilities (default, hover, active, flat, featured)
- ✅ Modal shadow utilities (default, large, drawer, dialog, popover)

### Key Achievements
1. **Consistent Spacing** - 4px base unit with extended fractional scale
2. **Responsive Containers** - Auto-centering with responsive padding
3. **Visual Depth** - Comprehensive shadow system for elevation
4. **Component Shadows** - Specialized utilities for cards and modals
5. **Border Radius** - Complete scale from sharp to fully rounded

### Spacing Scale Summary
| Range | Values | Usage |
|-------|--------|-------|
| Fractional | 0.5, 1.5, 2.5, 3.5 | Fine-tune spacing |
| Small | 1-4 | Component padding |
| Medium | 5-12 | Section spacing |
| Large | 16-24+ | Layout spacing |

### Shadow Scale Summary
| Level | Shadow | Usage |
|-------|--------|-------|
| Minimal | shadow-sm | Subtle depth |
| Standard | shadow | Default elevation |
| Medium | shadow-md | Floating elements |
| Raised | shadow-lg | Cards, dropdowns |
| High | shadow-xl | Modals |
| Maximum | shadow-2xl | Prominent elements |

### Next Steps
Proceed to [02_Tasks-53-58_Layout-Utilities-Docs.md](02_Tasks-53-58_Layout-Utilities-Docs.md) to implement z-index scale, layout grid utilities, flex gap utilities, section spacing utilities, form layout utilities, and spacing documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~950
