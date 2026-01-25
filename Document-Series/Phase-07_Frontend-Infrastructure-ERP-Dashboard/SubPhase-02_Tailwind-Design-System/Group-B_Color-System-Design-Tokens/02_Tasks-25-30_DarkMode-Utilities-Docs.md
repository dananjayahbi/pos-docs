# Tasks 25-30: Dark Mode, Utilities, and Documentation

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** B - Color System & Design Tokens  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-24_CSS-Variables-Palettes.md](01_Tasks-15-24_CSS-Variables-Palettes.md)

---

## Document Overview

This document completes the color system by implementing dark mode color scheme, extending Tailwind theme with CSS variables, creating custom color utilities, adding chart and status colors, and documenting the entire color system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Configure Dark Mode Colors | Medium | 30 min |
| 26 | Extend Tailwind Colors | Medium | 25 min |
| 27 | Create Color Utility Classes | Low | 15 min |
| 28 | Configure Chart Colors | Low | 20 min |
| 29 | Configure Status Colors | Low | 15 min |
| 30 | Create Color Documentation | Low | 30 min |

---

## Task 25: Configure Dark Mode Colors

### Overview
Implement a comprehensive dark mode color scheme by creating .dark selector in globals.css with inverted color values. Dark mode provides reduced eye strain and battery savings while maintaining visual hierarchy.

### Dependencies
- Tasks 15-24: Complete light mode color system

### Instructions

1. **Create dark mode selector**
   - Add .dark selector below :root
   - Add comment: "Dark Mode Colors"
   - Maintain same variable names as light mode

2. **Invert background colors**
   - --background: Reference secondary-950 (dark)
   - --card: Reference secondary-900 (slightly lighter)
   - --popover: Reference secondary-900
   - --muted: Reference secondary-800
   - --accent: Reference secondary-800

3. **Invert foreground colors**
   - --foreground: Reference secondary-50 (light text)
   - --card-foreground: Reference secondary-50
   - --popover-foreground: Reference secondary-50
   - --muted-foreground: Reference secondary-400
   - --accent-foreground: Reference secondary-50

4. **Adjust border colors**
   - --border: Reference secondary-800
   - --input: Reference secondary-700
   - --ring: Keep primary-500 or adjust slightly

5. **Review color palettes**
   - Primary, secondary, success, warning, error, info palettes
   - Generally keep same values (work in both modes)
   - Or provide dark mode specific adjustments

6. **Test contrast ratios**
   - Ensure WCAG AA compliance in dark mode
   - Light text on dark backgrounds
   - Minimum 4.5:1 contrast for body text

7. **Consider semantic adjustments**
   - Primary/success/error colors may need slight adjustments
   - Ensure visibility on dark backgrounds
   - Maintain brand consistency

### Dark Mode Color Mapping

| Variable | Light Value | Dark Value | Purpose |
|----------|-------------|------------|---------|
| background | White (0 0% 100%) | slate-950 | Main canvas |
| foreground | slate-950 | slate-50 | Main text |
| card | White | slate-900 | Card surfaces |
| muted | slate-100 | slate-800 | Subtle backgrounds |
| border | slate-200 | slate-800 | Separators |

### Dark Mode Implementation Strategy
```
.dark class on <html> → CSS Variables Override → Components Automatically Adapt
```

### Expected Outcome
- Complete dark mode color scheme
- Inverted values maintain hierarchy
- Accessible contrast ratios
- Automatic theme switching capability
- Consistent visual language

### Verification Checklist
- [ ] .dark selector created below :root
- [ ] All background variables inverted
- [ ] All foreground variables inverted
- [ ] Border variables adjusted for dark backgrounds
- [ ] Color palettes reviewed for dark mode
- [ ] Contrast ratios tested and meet standards
- [ ] Visual hierarchy maintained
- [ ] No syntax errors

---

## Task 26: Extend Tailwind Colors

### Overview
Extend the Tailwind theme configuration to map CSS custom properties to Tailwind utility classes. This makes all color system variables available as Tailwind classes (bg-primary, text-foreground, etc.).

### Dependencies
- Tasks 15-24: CSS custom properties defined
- Task 02: Tailwind config initialized

### Instructions

1. **Open tailwind.config.js**
   - Navigate to frontend directory
   - Open configuration file

2. **Locate theme.extend section**
   - Find theme object
   - Find or create extend property
   - Prepare to add colors

3. **Add colors object**
   - Inside theme.extend
   - Create colors property
   - Will map CSS variables to Tailwind

4. **Map semantic colors**
   - background: 'hsl(var(--background))'
   - foreground: 'hsl(var(--foreground))'
   - card, popover, muted, accent with variants
   - Each with DEFAULT and foreground properties

5. **Map brand color palettes**
   - Primary with DEFAULT and foreground
   - Secondary with DEFAULT and foreground
   - Success, warning, error, info with foregrounds

6. **Map border colors**
   - border: 'hsl(var(--border))'
   - input: 'hsl(var(--input))'
   - ring: 'hsl(var(--ring))'

7. **Add destructive alias**
   - Map destructive to error colors
   - Shadcn/UI compatibility

8. **Review mapping pattern**
   - All use hsl() wrapper
   - Reference CSS variables with var()
   - Format: 'hsl(var(--variable-name))'

### Tailwind Color Mapping Structure

```javascript
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      // ... more colors
    }
  }
}
```

### Generated Utility Classes

| Color Variable | Utility Class Examples |
|----------------|------------------------|
| background | bg-background, hover:bg-background |
| foreground | text-foreground, decoration-foreground |
| primary | bg-primary, text-primary, border-primary |
| card | bg-card, text-card-foreground |
| muted | bg-muted, text-muted-foreground |

### Color Utility Applications
- Background: bg-{color}
- Text: text-{color}
- Border: border-{color}
- Ring: ring-{color}
- Divide: divide-{color}

### Expected Outcome
- CSS variables mapped to Tailwind theme
- All color utilities available
- Consistent naming across system
- Automatic dark mode support
- Type-safe color references

### Verification Checklist
- [ ] tailwind.config.js opened
- [ ] theme.extend.colors created
- [ ] Semantic colors mapped (background, foreground, etc.)
- [ ] Brand palettes mapped (primary, secondary, etc.)
- [ ] Border colors mapped
- [ ] Correct hsl(var(--name)) format used
- [ ] All variables have foreground pairs where applicable
- [ ] File saved successfully

---

## Task 27: Create Color Utility Classes

### Overview
Create custom utility classes in globals.css for common color patterns and combinations. These utilities simplify applying color system patterns consistently.

### Dependencies
- Task 26: Extend Tailwind Colors

### Instructions

1. **Add utilities section in globals.css**
   - After .dark selector
   - Add comment: "Custom Color Utilities"
   - Use @layer utilities directive

2. **Create gradient utilities**
   - .bg-gradient-primary: Primary color gradient
   - .bg-gradient-success: Success gradient
   - Use color palette shades

3. **Create hover state utilities**
   - .hover-lift: Hover with elevation
   - .hover-darken: Darken on hover
   - Combine color and transform

4. **Create text contrast utilities**
   - .text-on-primary: Text color for primary backgrounds
   - .text-on-success: Text color for success backgrounds
   - Automatic foreground selection

5. **Create interactive state utilities**
   - .interactive: Hover, focus, active states
   - Combined color transitions
   - Consistent interaction patterns

6. **Consider component-specific utilities**
   - .btn-primary: Button color pattern
   - .badge-success: Badge color pattern
   - Reusable color combinations

7. **Keep utilities minimal**
   - Only for common patterns
   - Don't duplicate Tailwind utilities
   - Focus on combinations not available

### Custom Utility Examples

| Utility | Purpose | Application |
|---------|---------|-------------|
| .bg-gradient-primary | Primary gradient | Hero sections, CTAs |
| .text-on-primary | Text on primary bg | Button text, badges |
| .interactive | Interactive states | Buttons, links, cards |
| .hover-lift | Hover elevation | Cards, product items |

### Utility Layer Structure
```
@layer utilities {
  /* Custom color utilities */
  .bg-gradient-primary {
    background: gradient using primary shades
  }
  
  .text-on-primary {
    color: primary-foreground
  }
}
```

### Expected Outcome
- Useful custom color utilities
- Common patterns simplified
- Consistent color applications
- Reduced code repetition

### Verification Checklist
- [ ] @layer utilities section added
- [ ] Gradient utilities created
- [ ] Hover state utilities created
- [ ] Text contrast utilities created
- [ ] Interactive utilities created
- [ ] Utilities don't duplicate Tailwind
- [ ] Comments explain purpose
- [ ] No syntax errors

---

## Task 28: Configure Chart Colors

### Overview
Define dedicated color variables for data visualization and charts. Chart colors provide distinct, accessible color options for multi-series data displays.

### Dependencies
- Task 15: Define CSS Custom Properties

### Instructions

1. **Add chart colors section**
   - In :root selector
   - Add comment: "Chart Visualization Colors"
   - Group chart variables

2. **Define chart color palette**
   - --chart-1: Primary data series (blue)
   - --chart-2: Secondary series (green)
   - --chart-3: Tertiary series (orange)
   - --chart-4: Fourth series (purple)
   - --chart-5: Fifth series (pink)

3. **Use distinct, accessible colors**
   - High contrast between series
   - Color-blind friendly palette
   - Distinct in both light and dark modes

4. **Define specific HSL values**
   - --chart-1: Reference primary-500
   - --chart-2: Reference success-500
   - --chart-3: 25 95% 53% (orange)
   - --chart-4: 270 95% 60% (purple)
   - --chart-5: 330 85% 60% (pink)

5. **Add dark mode chart colors**
   - In .dark selector
   - May need adjusted values for visibility
   - Maintain same color families

6. **Consider additional chart variables**
   - --chart-grid: Grid line color
   - --chart-axis: Axis color
   - --chart-label: Label text color

7. **Map to Tailwind theme**
   - Add chart colors in tailwind.config.js
   - chart: { 1: 'hsl(var(--chart-1))', ... }
   - Enable chart-1, chart-2 utilities

### Chart Color Palette

| Variable | Color | Usage | Accessibility |
|----------|-------|-------|---------------|
| chart-1 | Blue | Primary data | High contrast |
| chart-2 | Green | Secondary data | Distinct from chart-1 |
| chart-3 | Orange | Tertiary data | Warm tone |
| chart-4 | Purple | Fourth series | Cool tone |
| chart-5 | Pink | Fifth series | Accent |

### Chart Color Best Practices
- Maximum 5-7 series for readability
- Always provide legends
- Consider patterns for color-blindness
- Test in both light and dark modes
- Maintain consistent order

### Expected Outcome
- 5 distinct chart colors defined
- Accessible, distinguishable palette
- Dark mode variants
- Available as Tailwind utilities
- Ready for data visualization

### Verification Checklist
- [ ] Chart colors section added to :root
- [ ] 5 chart color variables defined
- [ ] Distinct, accessible colors chosen
- [ ] Dark mode chart colors defined
- [ ] Optional chart-grid, axis, label variables
- [ ] Mapped in tailwind.config.js
- [ ] Color-blind friendly tested
- [ ] No syntax errors

---

## Task 29: Configure Status Colors

### Overview
Define color variables for application status indicators and state badges. Status colors communicate system states, process stages, and item conditions.

### Dependencies
- Task 15: Define CSS Custom Properties

### Instructions

1. **Add status colors section**
   - In :root selector
   - Add comment: "Status Indicator Colors"
   - Group status variables

2. **Define pending status**
   - --status-pending: Reference warning-500 (amber)
   - Awaiting action or review
   - Attention required

3. **Define processing status**
   - --status-processing: Reference info-500 (cyan/blue)
   - In progress, actively working
   - Ongoing activity

4. **Define completed status**
   - --status-completed: Reference success-500 (green)
   - Successfully finished
   - Positive outcome

5. **Define cancelled status**
   - --status-cancelled: Reference secondary-400 (gray)
   - Cancelled or inactive
   - Neutral, disabled

6. **Define failed status**
   - --status-failed: Reference error-500 (red)
   - Error or failure
   - Negative outcome

7. **Add additional statuses**
   - --status-draft: Light gray
   - --status-archived: Muted gray
   - --status-new: Primary blue
   - Context-specific statuses

8. **Define dark mode status colors**
   - In .dark selector
   - May reference same values or adjust
   - Ensure visibility on dark backgrounds

9. **Map to Tailwind theme**
   - Add status colors in tailwind.config.js
   - Enable bg-status-pending, text-status-completed utilities

### Status Color Mapping

| Status | Color | HSL/Reference | Use Case |
|--------|-------|---------------|----------|
| pending | Amber | warning-500 | Awaiting approval, review needed |
| processing | Blue | info-500 | In progress, being processed |
| completed | Green | success-500 | Finished, successful |
| cancelled | Gray | secondary-400 | Cancelled, inactive |
| failed | Red | error-500 | Failed, error occurred |
| draft | Light Gray | secondary-300 | Draft, not published |
| archived | Muted Gray | secondary-500 | Archived, historical |
| new | Primary Blue | primary-500 | New item, unread |

### Status Usage Contexts
- Order statuses: pending, processing, shipped, delivered
- Payment statuses: pending, paid, failed, refunded
- Task statuses: to-do, in-progress, completed
- Document statuses: draft, pending, approved, rejected
- Subscription statuses: active, cancelled, expired

### Expected Outcome
- Complete status color system
- Clear state communication
- Consistent across application
- Available as Tailwind utilities
- Ready for badges and indicators

### Verification Checklist
- [ ] Status colors section added
- [ ] Core statuses defined (pending, processing, completed, cancelled, failed)
- [ ] Additional context statuses defined
- [ ] Colors aligned with semantic meanings
- [ ] Dark mode status colors defined
- [ ] Mapped in tailwind.config.js
- [ ] Clear, distinguishable colors
- [ ] No syntax errors

---

## Task 30: Create Color Documentation

### Overview
Create comprehensive documentation for the color system covering palettes, usage guidelines, accessibility standards, and code examples. This documentation serves as the reference for designers and developers.

### Dependencies
- Tasks 15-29: Complete color system implemented

### Instructions

1. **Create documentation directory**
   - Create docs/ directory in frontend
   - Create design-system/ subdirectory
   - Create colors.md file

2. **Add document header**
   - Title: "LankaCommerce Cloud Color System"
   - Date and version
   - Brief overview

3. **Document color architecture**
   - Explain CSS custom properties approach
   - HSL format rationale
   - Dark mode implementation
   - Tailwind integration

4. **Document color palettes**
   - Primary palette with all shades
   - Secondary, success, warning, error, info
   - Include HSL values
   - Show visual swatches (describe)

5. **Document semantic colors**
   - Background colors and usage
   - Foreground colors and usage
   - Border colors and usage
   - When to use each

6. **Document usage guidelines**
   - Brand color usage rules
   - State color meanings
   - Accessibility requirements
   - Dos and don'ts

7. **Document accessibility**
   - WCAG AA compliance
   - Contrast ratio requirements
   - Color-blind considerations
   - Testing procedures

8. **Provide code examples**
   - CSS variable usage
   - Tailwind utility examples
   - Component color patterns
   - Dark mode implementation

9. **Document special colors**
   - Chart colors and usage
   - Status colors and meanings
   - When to use each type

10. **Add reference tables**
    - Complete variable reference
    - Tailwind class mappings
    - HSL value reference
    - Quick reference guide

11. **Include visual examples**
    - Color combination examples
    - Button color variants
    - Alert/badge color usage
    - Chart color demonstrations

12. **Add maintenance notes**
    - How to add new colors
    - How to modify palettes
    - Testing procedures
    - Version history

### Documentation Structure

```markdown
# LankaCommerce Cloud Color System

## Overview
- Purpose and goals
- Architecture summary

## Color Architecture
- CSS custom properties
- HSL format
- Dark mode
- Tailwind integration

## Color Palettes
- Primary (Blue)
- Secondary (Slate)
- State Colors (Success, Warning, Error, Info)

## Semantic Colors
- Backgrounds
- Foregrounds
- Borders

## Usage Guidelines
- Brand colors
- State colors
- Accessibility
- Best practices

## Code Examples
- CSS variables
- Tailwind classes
- Component patterns

## Special Purpose Colors
- Chart colors
- Status colors

## Reference
- Variable list
- Class mappings
- HSL values

## Maintenance
- Adding colors
- Modifying palettes
- Testing
```

### Documentation Content Guidelines

| Section | Include | Purpose |
|---------|---------|---------|
| Overview | Purpose, architecture | Understanding context |
| Palettes | Colors, values, usage | Visual reference |
| Guidelines | Rules, dos/don'ts | Proper usage |
| Accessibility | Standards, testing | Compliance |
| Examples | Code snippets, patterns | Implementation help |
| Reference | Complete variable list | Quick lookup |

### Expected Outcome
- Comprehensive color documentation
- Clear usage guidelines
- Accessibility standards documented
- Code examples provided
- Reference for team
- Maintained and versioned

### Verification Checklist
- [ ] docs/design-system/ directory created
- [ ] colors.md file created
- [ ] Document header with version
- [ ] Color architecture explained
- [ ] All color palettes documented
- [ ] Semantic colors documented
- [ ] Usage guidelines provided
- [ ] Accessibility section complete
- [ ] Code examples included
- [ ] Special colors documented
- [ ] Reference tables complete
- [ ] Visual examples described
- [ ] Maintenance notes added
- [ ] Document well-organized and readable

---

## Summary

This document completed the color system implementation:

### Completed Tasks
1. ✅ Configured dark mode color scheme
2. ✅ Extended Tailwind theme with CSS variables
3. ✅ Created custom color utility classes
4. ✅ Configured chart visualization colors
5. ✅ Configured status indicator colors
6. ✅ Created comprehensive color documentation

### Color System Complete
- Light and dark mode support
- 6 complete color palettes
- Semantic color system
- Chart and status colors
- Tailwind integration
- Full documentation

### Files Created/Modified
- styles/globals.css (dark mode colors, utilities)
- tailwind.config.js (color theme extension)
- docs/design-system/colors.md (documentation)

### Next Steps
Proceed to Group C: Typography System to configure fonts, text sizes, line heights, and typographic scales for the design system.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-25  
**Next Group:** [Group-C_Typography-System](../Group-C_Typography-System/)
