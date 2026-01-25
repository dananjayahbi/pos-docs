# Tasks 31-38: Font Setup and Heading Styles

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** C - Typography System  
> **Document:** 01 of 02  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-39-44_Body-Prose-Utilities.md](02_Tasks-39-44_Body-Prose-Utilities.md)

---

## Document Overview

This document covers the foundational typography setup for LankaCommerce Cloud ERP Dashboard. It includes installing and configuring the Inter font family using Next.js font optimization, defining comprehensive typographic scales for size, line height, weight, and letter spacing, and creating default heading styles. These elements establish the base typography system that ensures consistent and professional text rendering across the entire application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Install Inter Font | Low | 10 min |
| 32 | Configure Font Family in Tailwind | Low | 10 min |
| 33 | Configure Fallback Font Stack | Low | 10 min |
| 34 | Define Font Size Scale | Low | 15 min |
| 35 | Define Line Height Scale | Low | 15 min |
| 36 | Define Font Weight Scale | Low | 10 min |
| 37 | Define Letter Spacing Scale | Low | 10 min |
| 38 | Create Heading Styles | Medium | 30 min |

---

## Task 31: Install Inter Font

### Overview
Install the Inter font family using Next.js font optimization system. Inter is a modern, highly legible sans-serif typeface designed specifically for user interfaces and digital screens. The next/font package provides automatic font optimization, including self-hosting, zero layout shift, and efficient loading strategies.

### Dependencies
- Next.js project initialized (Task 05 from Group A)
- `app/layout.tsx` file exists

### Instructions

1. **Verify next/font availability**
   - Confirm Next.js version supports next/font (13.0+)
   - Package is included with Next.js installation
   - No additional npm installation required

2. **Import Inter from next/font/google**
   - Open `app/layout.tsx` file
   - Add import statement at the top
   - Import from 'next/font/google' module

3. **Configure Inter font instance**
   - Create Inter font configuration object
   - Specify 'latin' subset for optimal loading
   - Define CSS variable name for font reference

4. **Configure font display strategy**
   - Use 'swap' strategy for better performance
   - Font swaps in when loaded (prevents FOIT)
   - Ensures text remains visible during load

5. **Configure font weights**
   - Include weight range 300-700
   - Covers light, normal, medium, semibold, bold
   - Optimizes font file loading

6. **Apply variable to html element**
   - Add font variable to root html element
   - Use className prop on html tag
   - Ensures font availability throughout app

7. **Verify font loading**
   - Check DevTools Network tab for font files
   - Confirm .woff2 files are loaded
   - Verify self-hosted from /_next/static/

### Inter Font Benefits

| Benefit | Description | Impact |
|---------|-------------|--------|
| UI Optimized | Designed for digital screens | Enhanced readability at all sizes |
| Open Source | Free for commercial use | No licensing costs |
| Complete Character Set | Supports 200+ languages | International compatibility |
| Variable Font | Multiple weights in one file | Reduced file size |
| High x-height | Taller lowercase letters | Better legibility at small sizes |
| Clear Numerals | Tabular and proportional options | Perfect for data display |

### Next.js Font Optimization Features

```
┌──────────────────────────────────────────────────┐
│         Next.js Font Optimization                │
├──────────────────────────────────────────────────┤
│ ✓ Automatic Self-Hosting                         │
│   • No external requests to Google Fonts         │
│   • Better privacy (no third-party tracking)     │
│   • Improved performance (no external latency)   │
│                                                  │
│ ✓ Zero Layout Shift                              │
│   • Font metrics calculated at build time        │
│   • Prevents CLS (Cumulative Layout Shift)       │
│   • Better Core Web Vitals scores                │
│                                                  │
│ ✓ Optimized Loading                              │
│   • Automatic font subsetting                    │
│   • Preload font files                           │
│   • Font display: swap strategy                  │
│                                                  │
│ ✓ CSS Variable Integration                       │
│   • Clean integration with Tailwind              │
│   • Easy theme customization                     │
│   • Type-safe font references                    │
└──────────────────────────────────────────────────┘
```

### Font Subset Options

| Subset | Languages | Use When |
|--------|-----------|----------|
| latin | English, Western European | Primary subset for LankaCommerce |
| latin-ext | Eastern European, Vietnamese | Extended language support needed |
| cyrillic | Russian, Ukrainian, Bulgarian | Cyrillic language support |
| greek | Greek | Greek language support |
| vietnamese | Vietnamese | Vietnamese language support |

### Display Strategy Options

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| swap | Show fallback, swap when ready | Recommended - balances performance & UX |
| optional | Show fallback, may not swap | Very slow connections |
| block | Wait for font, then show | Not recommended - may cause FOIT |
| fallback | Brief block, then swap | Alternative to swap |
| auto | Browser decides | Least control |

### Expected Outcome
- Inter font installed and optimized
- Font files self-hosted by Next.js
- CSS variable defined for Tailwind integration
- Zero layout shift on font load
- Improved performance and privacy

### Verification Checklist
- [ ] Inter imported from next/font/google
- [ ] Font configuration created with subset
- [ ] CSS variable defined (--font-inter)
- [ ] Variable applied to html element
- [ ] Font loads without external requests
- [ ] No layout shift observed
- [ ] Font files served from /_next/static/

---

## Task 32: Configure Font Family in Tailwind

### Overview
Configure the Inter font family in Tailwind CSS configuration to use the CSS variable created in Task 31. This integrates the optimized font into Tailwind's utility class system, making it available throughout the application via font-sans classes.

### Dependencies
- Task 31: Install Inter Font
- Task 02: Initialize Tailwind configuration
- `tailwind.config.js` exists

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `tailwind.config.js` in project root
   - Locate theme.extend section

2. **Import default theme**
   - Import fontFamily from 'tailwindcss/defaultTheme'
   - Required for accessing default font stack
   - Ensures fallback fonts are preserved

3. **Extend fontFamily in theme**
   - Add fontFamily object in theme.extend
   - Will override default sans-serif font
   - Preserves other font families (serif, mono)

4. **Configure sans font family**
   - Reference Inter CSS variable
   - Use 'var(--font-inter)' as first font
   - Spread default sans fonts as fallbacks

5. **Add utility class documentation**
   - Document font-sans usage in comments
   - Note that font-sans is now Inter
   - Reference variable name for clarity

6. **Test font application**
   - Verify font-sans class applies Inter
   - Check default body text uses Inter
   - Confirm fallback to system fonts if needed

### Font Family Configuration Structure

```
┌──────────────────────────────────────────────────┐
│        Tailwind Font Family Configuration        │
├──────────────────────────────────────────────────┤
│                                                  │
│  fontFamily: {                                   │
│    sans: [                                       │
│      'var(--font-inter)',    ← Primary: Inter    │
│      ...defaultTheme.fontFamily.sans  ← Fallbacks│
│    ]                                             │
│  }                                               │
│                                                  │
│  Results in utility classes:                     │
│    • font-sans → Inter + system fallbacks        │
│    • No class → Inherits font-sans (default)     │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Font Stack Architecture

```
Font Family Hierarchy
═════════════════════
┌─────────────────────────────────────────────────┐
│ 1. var(--font-inter)                            │
│    ↓ (If Inter loads successfully)              │
│    Inter font displayed                         │
│                                                 │
│ 2. System UI fonts (fallbacks)                  │
│    ↓ (If Inter fails to load)                   │
│    • -apple-system (macOS/iOS)                  │
│    • BlinkMacSystemFont (Chrome macOS)          │
│    • "Segoe UI" (Windows)                       │
│    • Roboto (Android)                           │
│    • Helvetica Neue (older macOS)               │
│    • Arial (universal fallback)                 │
│    • sans-serif (ultimate fallback)             │
└─────────────────────────────────────────────────┘
```

### Default Theme Font Families

| Property | Default Value | Purpose |
|----------|---------------|---------|
| fontFamily.sans | System font stack | Body text, most UI elements |
| fontFamily.serif | Georgia, Cambria, etc. | Headings, formal content |
| fontFamily.mono | Menlo, Monaco, Courier | Code blocks, technical text |

### Usage After Configuration

| Utility Class | Font Applied | Use Case |
|--------------|--------------|----------|
| font-sans | Inter + fallbacks | All body text, UI elements (default) |
| font-serif | System serif fonts | Headings, formal documents |
| font-mono | System monospace fonts | Code, technical content |
| (no class) | Inherits font-sans | Default throughout app |

### Font Loading Sequence

```
Page Load Timeline
══════════════════

0ms ────────────────────────────────────────────────
     HTML parsed
     CSS variable --font-inter defined
     
10ms ───────────────────────────────────────────────
     Fallback font renders (system UI)
     Text visible immediately (no FOIT)
     
50ms ───────────────────────────────────────────────
     Inter font file requested
     Self-hosted from /_next/static/
     
100ms ──────────────────────────────────────────────
     Inter font loads
     Font swap occurs (fallback → Inter)
     No layout shift (metrics pre-calculated)
```

### Expected Outcome
- Tailwind font-sans uses Inter
- Fallback font stack preserved
- Font family accessible via utility classes
- Consistent typography throughout app
- Graceful fallback if font fails

### Verification Checklist
- [ ] tailwind.config.js opened
- [ ] defaultTheme imported
- [ ] fontFamily.sans configured
- [ ] Inter CSS variable referenced
- [ ] Default fallbacks preserved
- [ ] font-sans class applies Inter
- [ ] Body text uses Inter by default

---

## Task 33: Configure Fallback Font Stack

### Overview
Configure comprehensive fallback font stack for graceful degradation when Inter font is unavailable. The fallback stack ensures text remains highly legible across all operating systems and browsers, using native system fonts that closely match Inter's characteristics.

### Dependencies
- Task 32: Configure Font Family in Tailwind

### Instructions

1. **Review current fallback stack**
   - Check defaultTheme.fontFamily.sans in Tailwind
   - Understand system fonts included
   - Verify cross-platform coverage

2. **Customize fallback order if needed**
   - Prioritize fonts similar to Inter
   - Consider platform-specific fonts
   - Ensure Windows, macOS, Linux, Android, iOS coverage

3. **Add Noto Sans as additional fallback**
   - Insert after system fonts but before Arial
   - Excellent Unicode coverage for international characters
   - Supports Sinhala, Tamil, and other Sri Lankan languages

4. **Configure font metrics matching**
   - Ensure fallback fonts have similar metrics to Inter
   - Prevents layout shift during font swap
   - Check x-height, character width, line height

5. **Test fallback rendering**
   - Disable Inter font loading in DevTools
   - Verify fallback font displays correctly
   - Check layouts remain intact
   - Test on different operating systems

6. **Document fallback strategy**
   - Add comments explaining font choices
   - Note platform-specific fonts
   - Document international support

### Comprehensive Fallback Stack

```
┌──────────────────────────────────────────────────┐
│          Complete Font Fallback Stack            │
├──────────────────────────────────────────────────┤
│ Priority Order:                                  │
│                                                  │
│ 1. var(--font-inter)                             │
│    • Primary font - Inter                        │
│    • Optimized, self-hosted                      │
│                                                  │
│ 2. -apple-system                                 │
│    • San Francisco (macOS 10.11+, iOS 9+)        │
│    • Native system font                          │
│                                                  │
│ 3. BlinkMacSystemFont                            │
│    • San Francisco (Chrome on macOS)             │
│    • Webkit-specific                             │
│                                                  │
│ 4. "Segoe UI"                                    │
│    • Windows system font (Vista+)                │
│    • Clean, modern appearance                    │
│                                                  │
│ 5. Roboto                                        │
│    • Android system font (4.0+)                  │
│    • Material Design standard                    │
│                                                  │
│ 6. "Noto Sans"                                   │
│    • Google's universal font family              │
│    • Excellent Unicode coverage                  │
│    • Supports Sinhala, Tamil, etc.               │
│                                                  │
│ 7. "Helvetica Neue"                              │
│    • Older macOS versions                        │
│    • Classic fallback                            │
│                                                  │
│ 8. Arial                                         │
│    • Universal availability                      │
│    • All platforms support                       │
│                                                  │
│ 9. sans-serif                                    │
│    • Browser's default sans-serif                │
│    • Ultimate fallback                           │
└──────────────────────────────────────────────────┘
```

### Platform-Specific Font Rendering

| Platform | Primary Fallback | Characteristics |
|----------|------------------|-----------------|
| macOS 10.11+ | San Francisco | System UI font, optimized for Retina |
| iOS 9+ | San Francisco | Consistent with macOS |
| Windows 10/11 | Segoe UI | Modern, clean, good readability |
| Android 4.0+ | Roboto | Material Design, geometric |
| Linux | Liberation Sans / DejaVu | Open source, metric-compatible |
| Older systems | Arial / Helvetica | Universal compatibility |

### Sri Lanka Language Support

```
┌──────────────────────────────────────────────────┐
│      International Character Support             │
├──────────────────────────────────────────────────┤
│                                                  │
│ Noto Sans Inclusion Benefits:                    │
│                                                  │
│ ✓ Sinhala Script                                 │
│   • Noto Sans Sinhala variant                    │
│   • Complete Unicode coverage                    │
│   • Example: සිංහල භාෂාව                         │
│                                                  │
│ ✓ Tamil Script                                   │
│   • Noto Sans Tamil variant                      │
│   • Full character set                           │
│   • Example: தமிழ் மொழி                          │
│                                                  │
│ ✓ Latin Extended                                 │
│   • Accented characters                          │
│   • International symbols                        │
│   • Currency symbols (₨, £, €, $)                │
│                                                  │
│ ✓ Mathematical Symbols                           │
│   • Numbers: 0-9, ०-९ (Devanagari)               │
│   • Operators: +, -, ×, ÷                        │
│   • Currency: LKR (රු.), USD ($), etc.           │
└──────────────────────────────────────────────────┘
```

### Font Metrics Comparison

| Font | x-height | Character Width | Weight Range | Similarity to Inter |
|------|----------|-----------------|--------------|---------------------|
| Inter | 1.00 | 1.00 | 300-700 | 100% (baseline) |
| San Francisco | 0.98 | 1.02 | 300-900 | 95% (excellent match) |
| Segoe UI | 0.96 | 1.05 | 300-700 | 90% (very good) |
| Roboto | 0.97 | 0.98 | 300-900 | 92% (very good) |
| Noto Sans | 0.98 | 1.01 | 300-900 | 94% (excellent) |
| Helvetica Neue | 0.93 | 1.08 | 300-900 | 85% (good) |
| Arial | 0.92 | 1.10 | 400-700 | 80% (acceptable) |

### Fallback Testing Scenarios

| Scenario | Font Used | Verification |
|----------|-----------|--------------|
| Normal operation | Inter | Check DevTools, font loads from /_next/static/ |
| Inter blocked | San Francisco (macOS) | Block Inter in DevTools, verify fallback |
| All custom fonts blocked | System defaults | Disable custom fonts, check legibility |
| Sinhala text | Noto Sans Sinhala | Display Sinhala characters, verify rendering |
| Tamil text | Noto Sans Tamil | Display Tamil characters, verify rendering |
| Currency symbols | Roboto / Segoe UI | Test LKR, USD, EUR symbols |

### Cross-Platform Testing Matrix

```
Operating System Testing
════════════════════════

macOS (Safari/Chrome/Firefox)
  ├── San Francisco renders correctly
  ├── Sinhala characters display
  ├── Tamil characters display
  └── No layout shift observed

Windows (Edge/Chrome/Firefox)
  ├── Segoe UI renders correctly
  ├── International characters display
  ├── Currency symbols render
  └── Consistent spacing maintained

Android (Chrome/Firefox)
  ├── Roboto renders correctly
  ├── Unicode characters supported
  ├── Touch targets appropriate size
  └── Mobile viewport optimized

iOS (Safari/Chrome)
  ├── San Francisco renders correctly
  ├── Retina display optimized
  ├── International text supported
  └── No FOIT observed

Linux (Chrome/Firefox)
  ├── Liberation Sans / DejaVu renders
  ├── UTF-8 characters display
  ├── Fallback stack complete
  └── Acceptable legibility
```

### Expected Outcome
- Comprehensive fallback font stack
- Cross-platform compatibility
- International language support (Sinhala, Tamil)
- Similar font metrics to Inter
- No layout shift on font swap
- Graceful degradation on all systems

### Verification Checklist
- [ ] Fallback stack configured in Tailwind
- [ ] Noto Sans included for international support
- [ ] Platform-specific fonts ordered correctly
- [ ] Font metrics verified for consistency
- [ ] Tested with Inter disabled
- [ ] Sinhala characters render correctly
- [ ] Tamil characters render correctly
- [ ] Currency symbols display properly
- [ ] No layout shift during fallback

---

## Task 34: Define Font Size Scale

### Overview
Define a comprehensive font size scale in Tailwind configuration that covers all typographic needs from small captions to large display headings. The scale uses a modular approach with consistent mathematical relationships between sizes, ensuring visual hierarchy and readability across the application.

### Dependencies
- Task 02: Initialize Tailwind configuration

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `tailwind.config.js`
   - Locate theme.extend.fontSize section

2. **Review default Tailwind font sizes**
   - Understand existing scale (xs, sm, base, lg, xl, 2xl, etc.)
   - Identify any gaps or needed adjustments
   - Ensure scale covers all use cases

3. **Define extra-small size (xs)**
   - Set to 0.75rem (12px)
   - Use for captions, helper text, metadata
   - Smallest readable size for body text

4. **Define small size (sm)**
   - Set to 0.875rem (14px)
   - Use for secondary information, labels
   - Common for compact UI elements

5. **Define base size (base)**
   - Set to 1rem (16px)
   - Primary body text size
   - Optimal for readability

6. **Define large size (lg)**
   - Set to 1.125rem (18px)
   - Use for emphasized paragraphs, lead text
   - Slightly larger body text

7. **Define extra-large sizes (xl through 6xl)**
   - xl: 1.25rem (20px) - H5 level
   - 2xl: 1.5rem (24px) - H4 level
   - 3xl: 1.875rem (30px) - H3 level
   - 4xl: 2.25rem (36px) - H2 level
   - 5xl: 3rem (48px) - H1 level
   - 6xl: 3.75rem (60px) - Display headings

8. **Add additional display sizes if needed**
   - 7xl: 4.5rem (72px) - Large displays
   - 8xl: 6rem (96px) - Hero sections
   - 9xl: 8rem (128px) - Landing pages

9. **Test font sizes in UI**
   - Create sample components with each size
   - Verify readability at each level
   - Check mobile responsiveness

### Font Size Scale Specifications

```
┌──────────────────────────────────────────────────┐
│           LankaCommerce Font Size Scale          │
├──────────────────────────────────────────────────┤
│                                                  │
│  xs     0.75rem   12px   ← Captions, metadata   │
│  sm     0.875rem  14px   ← Labels, secondary    │
│  base   1rem      16px   ← Body text (default)  │
│  lg     1.125rem  18px   ← Lead paragraphs      │
│  xl     1.25rem   20px   ← H5, subheadings      │
│  2xl    1.5rem    24px   ← H4                   │
│  3xl    1.875rem  30px   ← H3                   │
│  4xl    2.25rem   36px   ← H2                   │
│  5xl    3rem      48px   ← H1                   │
│  6xl    3.75rem   60px   ← Display headings     │
│  7xl    4.5rem    72px   ← Large displays       │
│  8xl    6rem      96px   ← Hero sections        │
│  9xl    8rem     128px   ← Landing pages        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Font Size Usage Guidelines

| Size | Utility Class | Primary Use Case | Secondary Use Cases |
|------|---------------|------------------|---------------------|
| xs | text-xs | Timestamps, metadata, footnotes | Badges, tags, helper text |
| sm | text-sm | Labels, secondary text, table cells | Buttons (small), input placeholders |
| base | text-base | Body paragraphs, descriptions | Default text everywhere |
| lg | text-lg | Lead paragraphs, emphasized text | Card headings, subtitles |
| xl | text-xl | H5 headings, card titles | Large buttons, section labels |
| 2xl | text-2xl | H4 headings, widget titles | Dashboard headings |
| 3xl | text-3xl | H3 headings, section titles | Modal titles |
| 4xl | text-4xl | H2 headings, page subtitles | Feature highlights |
| 5xl | text-5xl | H1 headings, page titles | Dashboard main heading |
| 6xl | text-6xl | Display headings, hero text | Landing page titles |
| 7xl+ | text-7xl+ | Large displays, marketing | Hero sections, banners |

### Modular Scale Ratios

```
Size Progression Visualization
══════════════════════════════

xs   ■               (0.75rem / 12px)
sm   ■■              (0.875rem / 14px)
base ■■■             (1rem / 16px)  ← Base unit
lg   ■■■■            (1.125rem / 18px)
xl   ■■■■■           (1.25rem / 20px)
2xl  ■■■■■■■         (1.5rem / 24px)
3xl  ■■■■■■■■■■      (1.875rem / 30px)
4xl  ■■■■■■■■■■■■■   (2.25rem / 36px)
5xl  ■■■■■■■■■■■■■■■■■■■ (3rem / 48px)
6xl  ■■■■■■■■■■■■■■■■■■■■■■■ (3.75rem / 60px)
```

### Typography Hierarchy Example

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║  Dashboard Overview                     (text-5xl) ║
║  Manage your business operations        (text-lg)  ║
║                                                    ║
║  ═══════════════════════════════════════          ║
║                                                    ║
║  Sales Summary                          (text-4xl) ║
║  Weekly performance metrics            (text-base) ║
║                                                    ║
║    Revenue Analysis                     (text-3xl) ║
║    Current week vs. previous           (text-sm)   ║
║                                                    ║
║      Top Products                       (text-2xl) ║
║      Best-selling items this month     (text-sm)   ║
║                                                    ║
║        Product Name                      (text-xl) ║
║        LKR 45,000 • 234 units sold    (text-base) ║
║        Last updated: 2 hours ago        (text-xs) ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

### Mobile Responsive Considerations

| Desktop Size | Mobile Alternative | Reason |
|--------------|-------------------|--------|
| text-6xl | text-4xl | Prevent overflow on small screens |
| text-5xl | text-3xl | Maintain readability without scrolling |
| text-4xl | text-2xl | Keep heading proportional |
| text-3xl | text-xl | Balance hierarchy and space |
| text-2xl | text-lg | Readable on mobile |
| text-xl | text-base | Conserve vertical space |
| text-base | text-sm (optional) | Fit more content |

### Accessibility Requirements

```
┌──────────────────────────────────────────────────┐
│         Font Size Accessibility Standards        │
├──────────────────────────────────────────────────┤
│                                                  │
│ WCAG 2.1 Level AA Requirements:                  │
│                                                  │
│ ✓ Minimum Body Text: 16px (1rem)                 │
│   • text-base as default satisfies requirement   │
│   • Allow user zoom up to 200%                   │
│                                                  │
│ ✓ Small Text Exceptions:                         │
│   • 14px (text-sm) acceptable for labels         │
│   • 12px (text-xs) only for metadata/captions    │
│   • Must have sufficient contrast                │
│                                                  │
│ ✓ Large Text:                                    │
│   • 18px+ considered "large text"                │
│   • Lower contrast ratios acceptable             │
│   • text-lg and above qualify                    │
│                                                  │
│ ✓ User Preferences:                              │
│   • Respect browser font size settings           │
│   • Use rem units (not px) for scalability       │
│   • Test with browser zoom                       │
└──────────────────────────────────────────────────┘
```

### ERP Dashboard Specific Applications

| Component | Font Size | Rationale |
|-----------|-----------|-----------|
| Dashboard title | text-5xl (48px) | Clear page identification |
| Widget headings | text-2xl (24px) | Section organization |
| Data labels | text-sm (14px) | Compact, space-efficient |
| Data values | text-lg (18px) | Emphasize important metrics |
| Table headers | text-sm (14px) | Consistent with labels |
| Table cells | text-base (16px) | Optimal readability |
| Button text | text-base (16px) | Clear call-to-action |
| Form labels | text-sm (14px) | Standard form convention |
| Error messages | text-sm (14px) | Noticeable but not intrusive |
| Success messages | text-base (16px) | Clear confirmation |
| Breadcrumbs | text-sm (14px) | Subtle navigation |
| Tooltips | text-xs (12px) | Non-intrusive hints |

### Expected Outcome
- Complete font size scale defined
- Consistent size progression
- Clear visual hierarchy
- Mobile-responsive sizes
- Accessibility compliance
- Ready for heading and body styles

### Verification Checklist
- [ ] fontSize configuration added to Tailwind
- [ ] All sizes from xs to 6xl defined
- [ ] Optional display sizes (7xl+) added
- [ ] Rem units used for accessibility
- [ ] Mathematical progression verified
- [ ] Utility classes work (text-xs, text-sm, etc.)
- [ ] Mobile responsive behavior tested
- [ ] Sample components created
- [ ] Hierarchy clear and distinguishable

---

## Task 35: Define Line Height Scale

### Overview
Define line height scale that pairs with font sizes to ensure optimal readability and visual balance. Line height (leading) controls the vertical space between lines of text and is critical for legibility, especially in data-dense ERP interfaces. The scale follows typographic best practices with tighter leading for headings and comfortable leading for body text.

### Dependencies
- Task 34: Define Font Size Scale

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `tailwind.config.js`
   - Locate theme.extend.lineHeight section

2. **Review default Tailwind line heights**
   - Understand existing values (none, tight, normal, relaxed, loose)
   - Check numeric values (3, 4, 5, etc.)
   - Identify gaps in the scale

3. **Define tight line height (tight)**
   - Set to 1.25 (125% of font size)
   - Use for large headings (H1, H2)
   - Reduces vertical space in display text

4. **Define snug line height (snug)**
   - Set to 1.375 (137.5% of font size)
   - Use for medium headings (H3, H4, H5)
   - Balance between compact and comfortable

5. **Define normal line height (normal)**
   - Set to 1.5 (150% of font size)
   - Default for body text
   - Optimal readability for paragraphs

6. **Define relaxed line height (relaxed)**
   - Set to 1.625 (162.5% of font size)
   - Use for long-form content
   - Extra breathing room for prose

7. **Define loose line height (loose)**
   - Set to 2 (200% of font size)
   - Use for very spacious layouts
   - Special cases, lead paragraphs

8. **Pair line heights with font sizes**
   - Create mapping chart
   - Document recommended pairings
   - Ensure consistency across components

9. **Configure line height in fontSize**
   - Add line height as second value in fontSize tuple
   - Example: fontSize: { 'base': ['1rem', { lineHeight: '1.5' }] }
   - Creates automatic pairing

### Line Height Scale Specifications

```
┌──────────────────────────────────────────────────┐
│         LankaCommerce Line Height Scale          │
├──────────────────────────────────────────────────┤
│                                                  │
│  Name      Ratio    Usage                        │
│  ─────────────────────────────────────────────   │
│  none      1        Disable line height          │
│  tight     1.25     Large headings (H1, H2)      │
│  snug      1.375    Medium headings (H3-H5)      │
│  normal    1.5      Body text (default)          │
│  relaxed   1.625    Long-form content            │
│  loose     2.0      Extra spacious layouts       │
│                                                  │
│  Numeric scale (for fine-tuning):                │
│  ─────────────────────────────────────────────   │
│  3    0.75rem       Very tight, special cases    │
│  4    1rem          Compact elements             │
│  5    1.25rem       Small text line height       │
│  6    1.5rem        Base text line height        │
│  7    1.75rem       Comfortable spacing          │
│  8    2rem          Generous spacing             │
│  9    2.25rem       Very spacious                │
│  10   2.5rem        Maximum spacing              │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Font Size and Line Height Pairings

| Font Size | Recommended Line Height | Ratio | Utility Classes | Use Case |
|-----------|------------------------|-------|-----------------|----------|
| text-xs (12px) | 1rem (16px) | 1.33 | leading-4 | Captions, metadata |
| text-sm (14px) | 1.25rem (20px) | 1.43 | leading-5 | Labels, secondary text |
| text-base (16px) | 1.5rem (24px) | 1.5 | leading-6 or leading-normal | Body paragraphs |
| text-lg (18px) | 1.75rem (28px) | 1.56 | leading-7 | Lead text, large body |
| text-xl (20px) | 1.75rem (28px) | 1.4 | leading-7 or leading-snug | H5, card titles |
| text-2xl (24px) | 2rem (32px) | 1.33 | leading-8 or leading-snug | H4 headings |
| text-3xl (30px) | 2.25rem (36px) | 1.2 | leading-9 or leading-tight | H3 headings |
| text-4xl (36px) | 2.5rem (40px) | 1.11 | leading-10 or leading-tight | H2 headings |
| text-5xl (48px) | 1 (48px) | 1.0 | leading-none or leading-tight | H1 headings |
| text-6xl (60px) | 1 (60px) | 1.0 | leading-none | Display headings |

### Line Height Visual Comparison

```
Tight Line Height (1.25) - Headings
═══════════════════════════════════
Dashboard Overview
Weekly Sales Report
Revenue Analysis
```

```
Normal Line Height (1.5) - Body Text
════════════════════════════════════
This is body text with normal line height.

Multiple lines demonstrate comfortable 

spacing for readability. Perfect for

paragraphs and longer content blocks.
```

```
Relaxed Line Height (1.625) - Prose
═══════════════════════════════════
Long-form content benefits from extra

breathing room between lines. This makes

extended reading more comfortable and

reduces eye strain over time.
```

### Line Height by Content Type

```
┌──────────────────────────────────────────────────┐
│        Line Height Recommendations               │
├──────────────────────────────────────────────────┤
│                                                  │
│ Display Headings (H1, H2):                       │
│   • leading-tight (1.25) or leading-none (1.0)   │
│   • Emphasizes scale and impact                  │
│   • Reduces vertical space consumption           │
│                                                  │
│ Section Headings (H3, H4, H5):                   │
│   • leading-snug (1.375)                         │
│   • Balances presence and spacing                │
│   • Clear hierarchy without excess space         │
│                                                  │
│ Body Paragraphs:                                 │
│   • leading-normal (1.5)                         │
│   • Industry standard for readability            │
│   • Comfortable for extended reading             │
│                                                  │
│ Dense Data Tables:                               │
│   • leading-snug (1.375) or leading-5 (1.25rem)  │
│   • Compact to show more rows                    │
│   • Still maintains legibility                   │
│                                                  │
│ Form Labels:                                     │
│   • leading-5 (1.25rem) with text-sm             │
│   • Tight spacing for vertical forms             │
│   • Aligns with input fields                     │
│                                                  │
│ Prose Content (Documentation):                   │
│   • leading-relaxed (1.625)                      │
│   • Extra comfort for long reading               │
│   • Reduces eye strain                           │
│                                                  │
│ Buttons, Badges, Tags:                           │
│   • leading-tight or leading-none                │
│   • Minimal padding needed                       │
│   • Compact appearance                           │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Line Height Accessibility Guidelines

| Aspect | WCAG Recommendation | LankaCommerce Implementation |
|--------|---------------------|------------------------------|
| Body text | Minimum 1.5 line height | leading-normal (1.5) as default |
| Paragraph spacing | At least 2× font size | Configured in prose plugin |
| Heading spacing | At least 1.2× font size | leading-tight (1.25) minimum |
| User control | Allow line height override | CSS custom properties support |
| Dense layouts | 1.4 minimum acceptable | leading-snug (1.375) for data tables |

### ERP Dashboard Line Height Applications

| Component | Line Height Class | Reasoning |
|-----------|------------------|-----------|
| Page title | leading-tight | Emphasize scale, reduce space |
| Widget heading | leading-snug | Balance presence and density |
| Data table row | leading-snug | Show more data, maintain legibility |
| Form label | leading-5 | Compact form layouts |
| Form help text | leading-normal | Comfortable reading |
| Paragraph | leading-normal | Optimal body text readability |
| Alert message | leading-normal | Clear communication |
| List items | leading-relaxed | Easy scanning of options |
| Card content | leading-normal | Standard readability |
| Breadcrumbs | leading-tight | Minimal vertical space |
| Button text | leading-tight | Compact, centered appearance |
| Badge/Tag | leading-none | Tight, compact labels |

### Responsive Line Height Considerations

```
Desktop vs. Mobile Line Height Adjustments
═══════════════════════════════════════════

Desktop (Larger screens):
  ├── Headings: leading-tight
  ├── Body: leading-normal
  └── Prose: leading-relaxed

Mobile (Smaller screens):
  ├── Headings: leading-snug (slightly more space)
  ├── Body: leading-relaxed (easier to read)
  └── Prose: leading-loose (maximum comfort)

Reason: Smaller screens benefit from extra 
line height for easier reading and better
touch target spacing.
```

### Expected Outcome
- Comprehensive line height scale defined
- Optimal readability for all text sizes
- Clear pairings with font sizes
- Accessibility compliance (WCAG 1.5 for body)
- Responsive considerations documented
- Foundation for typography utilities

### Verification Checklist
- [ ] lineHeight configuration added to Tailwind
- [ ] Named scales defined (tight, snug, normal, relaxed, loose)
- [ ] Numeric scale defined (3-10)
- [ ] Font size pairings documented
- [ ] Default body text uses leading-normal (1.5)
- [ ] Heading line heights appropriate
- [ ] Utility classes work (leading-tight, leading-6, etc.)
- [ ] Responsive behavior considered
- [ ] Accessibility guidelines met
- [ ] Sample components tested

---

## Task 36: Define Font Weight Scale

### Overview
Define font weight scale that provides appropriate emphasis levels throughout the application. Font weights control the thickness of characters and are essential for establishing visual hierarchy, emphasizing important content, and creating distinction between different text elements. The Inter font family supports a wide range of weights that will be configured in Tailwind.

### Dependencies
- Task 02: Initialize Tailwind configuration
- Task 31: Install Inter Font

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `tailwind.config.js`
   - Locate theme.extend.fontWeight section

2. **Review default Tailwind font weights**
   - Understand existing scale (thin to black)
   - Verify Inter font supports all weights
   - Check variable font weight range

3. **Configure light weight (300)**
   - Use for subtle text, de-emphasized content
   - Optional for secondary information
   - Test readability at small sizes

4. **Configure normal weight (400)**
   - Default body text weight
   - Primary content, paragraphs
   - Most common throughout app

5. **Configure medium weight (500)**
   - Emphasis within body text
   - Form labels, input text
   - Balanced between normal and bold

6. **Configure semibold weight (600)**
   - Headings H3, H4, H5, H6
   - Card titles, widget headings
   - Strong emphasis without full bold

7. **Configure bold weight (700)**
   - Strong emphasis, important text
   - Primary headings H1, H2
   - Call-to-action buttons

8. **Test weight combinations**
   - Verify contrast between weights
   - Check readability at different sizes
   - Ensure visual hierarchy is clear

9. **Document weight usage guidelines**
   - Create usage chart for components
   - Define semantic meaning of weights
   - Standardize across design system

### Font Weight Scale Specifications

```
┌──────────────────────────────────────────────────┐
│        LankaCommerce Font Weight Scale           │
├──────────────────────────────────────────────────┤
│                                                  │
│  Name       Value   Utility Class   Usage        │
│  ────────────────────────────────────────────    │
│  Light      300     font-light      Subtle text  │
│  Normal     400     font-normal     Body default │
│  Medium     500     font-medium     Emphasis     │
│  Semibold   600     font-semibold   Headings     │
│  Bold       700     font-bold       Strong focus │
│                                                  │
│  Inter Font Support:                             │
│    • Variable font: 100-900                      │
│    • Recommended range: 300-700                  │
│    • Optimal weights for UI: 400, 500, 600, 700  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Font Weight Visual Hierarchy

```
Font Weight Comparison (at 16px/1rem)
═════════════════════════════════════

font-light (300):   This is light weight text
font-normal (400):  This is normal weight text ← Body default
font-medium (500):  This is medium weight text
font-semibold (600): This is semibold weight text
font-bold (700):    This is bold weight text


Large Heading Example (text-5xl)
═════════════════════════════════

font-normal (400):
Dashboard Overview

font-semibold (600):
Dashboard Overview

font-bold (700):
Dashboard Overview ← Recommended for H1/H2
```

### Font Weight Usage Guidelines

| Weight | Utility Class | Primary Use Cases | Secondary Use Cases |
|--------|---------------|-------------------|---------------------|
| 300 (Light) | font-light | Subtle labels, placeholder text | Decorative elements, watermarks |
| 400 (Normal) | font-normal | Body paragraphs, descriptions | Table cells, list items |
| 500 (Medium) | font-medium | Form labels, input text | H5/H6 headings, button text |
| 600 (Semibold) | font-semibold | H3/H4/H5 headings, card titles | Navigation links, tab labels |
| 700 (Bold) | font-bold | H1/H2 headings, important data | Alert titles, error messages |

### Semantic Weight Mapping

```
┌──────────────────────────────────────────────────┐
│         Semantic Font Weight Guidelines          │
├──────────────────────────────────────────────────┤
│                                                  │
│ Content Hierarchy:                               │
│   H1 → font-bold (700)                           │
│   H2 → font-bold (700)                           │
│   H3 → font-semibold (600)                       │
│   H4 → font-semibold (600)                       │
│   H5 → font-medium (500)                         │
│   H6 → font-medium (500)                         │
│   Body → font-normal (400)                       │
│   Caption → font-normal (400) or font-light (300)│
│                                                  │
│ Interactive Elements:                            │
│   Primary Button → font-medium (500)             │
│   Secondary Button → font-normal (400)           │
│   Link → font-medium (500)                       │
│   Navigation → font-medium (500)                 │
│   Breadcrumb → font-normal (400)                 │
│                                                  │
│ Data Display:                                    │
│   Table Header → font-semibold (600)             │
│   Table Cell → font-normal (400)                 │
│   Metric Value → font-bold (700)                 │
│   Metric Label → font-medium (500)               │
│   Currency → font-semibold (600)                 │
│                                                  │
│ Forms:                                           │
│   Label → font-medium (500)                      │
│   Input Text → font-normal (400)                 │
│   Placeholder → font-light (300)                 │
│   Help Text → font-normal (400)                  │
│   Error Message → font-medium (500)              │
│                                                  │
│ Feedback:                                        │
│   Alert Title → font-semibold (600)              │
│   Alert Content → font-normal (400)              │
│   Toast Message → font-medium (500)              │
│   Badge → font-medium (500)                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Weight Contrast for Hierarchy

```
Dashboard Example with Weight Hierarchy
════════════════════════════════════════

┌─────────────────────────────────────────────────┐
│                                                 │
│  Sales Dashboard          (font-bold, text-5xl) │
│  Track your performance   (font-normal, text-lg)│
│                                                 │
│  ───────────────────────────────────────────    │
│                                                 │
│  Today's Revenue          (font-semibold, 2xl)  │
│  LKR 456,789             (font-bold, text-4xl)  │
│  +12.5% from yesterday   (font-normal, text-sm) │
│                                                 │
│  Top Products             (font-semibold, xl)   │
│  │                                               │
│  ├─ Product ABC          (font-medium, base)   │
│  │  234 units sold      (font-normal, text-sm) │
│  │                                               │
│  └─ Product XYZ          (font-medium, base)   │
│     189 units sold      (font-normal, text-sm) │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Font Weight Accessibility Considerations

| Aspect | Guideline | Implementation |
|--------|-----------|----------------|
| Minimum weight for small text | 400+ for text below 16px | Use font-normal minimum for text-sm and below |
| Light weight readability | Avoid 300 below 16px | Only use font-light at text-base or larger |
| Contrast with background | Higher weight if low contrast | Increase weight for gray text on white |
| Bold for emphasis | Use 600+ for strong emphasis | font-semibold or font-bold for emphasis |
| Consistency | Same weight for same element type | All H3 use same weight throughout app |

### Inter Font Weight Optimization

```
Inter Font Weight Characteristics
══════════════════════════════════

300 (Light):
  ├── Delicate, refined appearance
  ├── Use sparingly, mainly decorative
  └── Ensure sufficient size (16px+)

400 (Normal):
  ├── Optimal for body text
  ├── Excellent readability
  └── Use as primary weight

500 (Medium):
  ├── Perfect for UI elements
  ├── Good contrast without heaviness
  └── Versatile for multiple contexts

600 (Semibold):
  ├── Strong without being too bold
  ├── Ideal for headings
  └── Clear hierarchy

700 (Bold):
  ├── Maximum emphasis
  ├── Use for most important elements
  └── Clear focal points
```

### Weight Pairing Examples

| Component | Weight Pairing | Visual Effect |
|-----------|---------------|---------------|
| Card | font-semibold title + font-normal body | Clear distinction |
| Metric | font-bold value + font-medium label | Emphasizes data |
| List | font-medium heading + font-normal items | Organized hierarchy |
| Table | font-semibold header + font-normal cells | Professional appearance |
| Alert | font-semibold title + font-normal message | Draws attention |
| Button | font-medium text | Balanced, clickable |

### ERP Dashboard Weight Applications

| Component | Font Weight | Size | Reasoning |
|-----------|-------------|------|-----------|
| Dashboard title | font-bold | text-5xl | Maximum presence |
| Widget heading | font-semibold | text-2xl | Clear sections |
| Metric value | font-bold | text-4xl | Emphasize data |
| Metric label | font-medium | text-sm | Support value |
| Table header | font-semibold | text-sm | Column distinction |
| Table cell | font-normal | text-base | Easy scanning |
| Form label | font-medium | text-sm | Clear identification |
| Input text | font-normal | text-base | Natural reading |
| Button | font-medium | text-base | Balanced CTA |
| Link | font-medium | text-base | Indicates interactivity |
| Breadcrumb | font-normal | text-sm | Subtle navigation |
| Badge | font-medium | text-xs | Compact emphasis |

### Expected Outcome
- Clear font weight scale defined
- Visual hierarchy through weight contrast
- Semantic weight mapping established
- Accessibility guidelines followed
- Inter font weights optimized
- Foundation for heading and text styles

### Verification Checklist
- [ ] fontWeight configuration reviewed in Tailwind
- [ ] Weights 300-700 available
- [ ] Inter font supports all weights
- [ ] Utility classes work (font-light, font-bold, etc.)
- [ ] Weight hierarchy clear and distinguishable
- [ ] Sample components created with different weights
- [ ] Readability tested at various sizes
- [ ] Usage guidelines documented
- [ ] Semantic mapping created
- [ ] Accessibility requirements met

---

## Task 37: Define Letter Spacing Scale

### Overview
Define letter spacing (tracking) scale to control horizontal space between characters. Letter spacing is a subtle but important aspect of typography that affects readability and visual balance. Headings often benefit from tighter tracking, while body text uses default spacing, and small text may need slightly increased spacing for clarity.

### Dependencies
- Task 02: Initialize Tailwind configuration

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `tailwind.config.js`
   - Locate theme.extend.letterSpacing section

2. **Review default Tailwind letter spacing**
   - Understand existing scale (tighter to widest)
   - Check numeric values
   - Identify needed customizations

3. **Configure tighter letter spacing**
   - Set to -0.05em (-5% of font size)
   - Use for large display headings
   - Creates more compact, sophisticated look

4. **Configure tight letter spacing**
   - Set to -0.025em (-2.5% of font size)
   - Use for medium to large headings
   - Subtle tightening for refinement

5. **Configure normal letter spacing**
   - Set to 0em (default browser spacing)
   - Use for body text and most content
   - Optimal for readability

6. **Configure wide letter spacing**
   - Set to 0.025em (2.5% of font size)
   - Use for small text, labels, uppercase
   - Improves legibility at small sizes

7. **Configure wider letter spacing**
   - Set to 0.05em (5% of font size)
   - Use for very small text, captions
   - Enhances character distinction

8. **Configure widest letter spacing**
   - Set to 0.1em (10% of font size)
   - Use for all-caps text, badges
   - Creates dramatic, spacious effect

9. **Document letter spacing usage**
   - Create pairing chart with font sizes
   - Define use cases for each value
   - Note impact on readability

### Letter Spacing Scale Specifications

```
┌──────────────────────────────────────────────────┐
│       LankaCommerce Letter Spacing Scale         │
├──────────────────────────────────────────────────┤
│                                                  │
│  Name      Value      Utility Class   Usage      │
│  ───────────────────────────────────────────     │
│  Tighter   -0.05em    tracking-tighter  Display  │
│  Tight     -0.025em   tracking-tight    Headings │
│  Normal    0em        tracking-normal   Body     │
│  Wide      0.025em    tracking-wide     Labels   │
│  Wider     0.05em     tracking-wider    Small    │
│  Widest    0.1em      tracking-widest   All-caps │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Letter Spacing Visual Comparison

```
Different Letter Spacing at Same Size (text-2xl)
════════════════════════════════════════════════

tracking-tighter (-0.05em):
Dashboard Overview

tracking-tight (-0.025em):
Dashboard Overview

tracking-normal (0em):
Dashboard Overview ← Default

tracking-wide (0.025em):
Dashboard Overview

tracking-wider (0.05em):
Dashboard Overview

tracking-widest (0.1em):
Dashboard Overview
```

### Letter Spacing Usage Guidelines

| Spacing | Utility Class | Font Size Range | Primary Use Cases |
|---------|---------------|-----------------|-------------------|
| Tighter (-0.05em) | tracking-tighter | text-5xl to text-9xl | Display headings, hero text |
| Tight (-0.025em) | tracking-tight | text-2xl to text-4xl | H1, H2, H3 headings |
| Normal (0em) | tracking-normal | text-sm to text-xl | Body text, paragraphs, most content |
| Wide (0.025em) | tracking-wide | text-xs to text-sm | Labels, small text, buttons |
| Wider (0.05em) | tracking-wider | text-xs | Captions, metadata, footnotes |
| Widest (0.1em) | tracking-widest | Any size (uppercase) | All-caps labels, badges, tags |

### Font Size and Letter Spacing Pairings

```
┌──────────────────────────────────────────────────┐
│       Recommended Size-Spacing Combinations      │
├──────────────────────────────────────────────────┤
│                                                  │
│ Display Headings:                                │
│   text-6xl + tracking-tighter                    │
│   text-5xl + tracking-tighter or tracking-tight  │
│                                                  │
│ Page Headings:                                   │
│   text-4xl + tracking-tight                      │
│   text-3xl + tracking-tight                      │
│   text-2xl + tracking-tight or tracking-normal   │
│                                                  │
│ Section Headings:                                │
│   text-xl + tracking-normal                      │
│   text-lg + tracking-normal                      │
│                                                  │
│ Body Text:                                       │
│   text-base + tracking-normal                    │
│   text-sm + tracking-normal or tracking-wide     │
│                                                  │
│ Small Text:                                      │
│   text-xs + tracking-wide or tracking-wider      │
│                                                  │
│ Uppercase Text:                                  │
│   Any size + tracking-widest                     │
│   (e.g., SECTION LABEL, BADGE, TAG)              │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Letter Spacing by Component Type

| Component | Letter Spacing | Reasoning |
|-----------|---------------|-----------|
| H1 (text-5xl) | tracking-tighter | Reduces width, sophisticated look |
| H2 (text-4xl) | tracking-tight | Refined, professional appearance |
| H3 (text-3xl) | tracking-tight | Subtle tightening for balance |
| H4-H6 | tracking-normal | Standard readability |
| Body paragraph | tracking-normal | Optimal reading experience |
| Button text | tracking-wide | Improves clickability perception |
| Form label | tracking-wide | Enhanced clarity at small size |
| Table header (uppercase) | tracking-widest | Clear column distinction |
| Badge/Tag (uppercase) | tracking-widest | Better legibility in small space |
| Navigation link | tracking-normal | Standard, comfortable |
| Breadcrumb | tracking-normal | Easy scanning |
| Caption/metadata | tracking-wider | Improves small text clarity |

### Uppercase Text Considerations

```
Uppercase Text Letter Spacing
══════════════════════════════

Default (tracking-normal):
DASHBOARD SETTINGS
↓ Feels cramped, letters too close

With tracking-wide:
D A S H B O A R D  S E T T I N G S
↓ Better, but still tight

With tracking-widest:
D A S H B O A R D   S E T T I N G S
↓ Optimal, clear and readable

Recommendation: Always use tracking-wide or 
tracking-widest with uppercase text for maximum
clarity and professional appearance.
```

### Letter Spacing Accessibility Guidelines

```
┌──────────────────────────────────────────────────┐
│     Letter Spacing Accessibility Standards       │
├──────────────────────────────────────────────────┤
│                                                  │
│ WCAG 2.1 Requirements:                           │
│                                                  │
│ ✓ Minimum Spacing:                               │
│   • Letter spacing: at least 0.12em              │
│   • User must be able to adjust spacing          │
│   • No loss of content or functionality          │
│                                                  │
│ ✓ Implementation:                                │
│   • Use em units for scalability                 │
│   • Avoid negative spacing for body text         │
│   • Test with user spacing overrides             │
│                                                  │
│ ✓ Small Text Exception:                          │
│   • Text below 14px can use tracking-wide        │
│   • Improves legibility                          │
│   • Compensates for reduced size                 │
│                                                  │
│ ✓ Dyslexia-Friendly:                             │
│   • Slightly wider spacing preferred             │
│   • Helps distinguish similar letters            │
│   • tracking-wide to tracking-wider              │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Letter Spacing Impact on Readability

| Aspect | Too Tight (< -0.05em) | Optimal (±0.025em) | Too Wide (> 0.15em) |
|--------|----------------------|-------------------|---------------------|
| Legibility | Characters merge | Clear, distinct | Disconnected words |
| Reading speed | Slower, effortful | Natural, fast | Slower, word fragmentation |
| Aesthetic | Cramped, dense | Balanced, professional | Scattered, sparse |
| Use case | Avoid | All typography | Special effects only |

### ERP Dashboard Letter Spacing Applications

```
Sample Dashboard with Letter Spacing
═════════════════════════════════════

┌──────────────────────────────────────────────────┐
│                                                  │
│  D A S H B O A R D  O V E R V I E W              │
│  (tracking-widest + uppercase + text-xs)         │
│                                                  │
│  Sales Performance                               │
│  (tracking-tight + text-4xl + font-bold)         │
│                                                  │
│  Track your daily, weekly, and monthly metrics   │
│  (tracking-normal + text-base + font-normal)     │
│                                                  │
│  ───────────────────────────────────────────     │
│                                                  │
│  TODAY'S REVENUE                                 │
│  (tracking-widest + uppercase + text-xs)         │
│                                                  │
│  LKR 456,789                                     │
│  (tracking-tight + text-4xl + font-bold)         │
│                                                  │
│  +12.5% from yesterday                           │
│  (tracking-normal + text-sm + font-normal)       │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Responsive Letter Spacing

| Screen Size | Heading Spacing | Body Spacing | Small Text Spacing |
|-------------|----------------|--------------|-------------------|
| Desktop (1024px+) | tracking-tight | tracking-normal | tracking-wide |
| Tablet (768-1023px) | tracking-normal | tracking-normal | tracking-wide |
| Mobile (<768px) | tracking-normal | tracking-normal | tracking-wider |

*Rationale: Smaller screens benefit from slightly wider spacing for touch targets and readability.*

### Expected Outcome
- Complete letter spacing scale defined
- Clear pairing with font sizes
- Uppercase text handled properly
- Accessibility compliance
- Enhanced readability at all sizes
- Professional, refined typography

### Verification Checklist
- [ ] letterSpacing configuration added to Tailwind
- [ ] All spacing values defined (tighter to widest)
- [ ] Em units used for scalability
- [ ] Utility classes work (tracking-tight, etc.)
- [ ] Uppercase text uses tracking-widest
- [ ] Body text uses tracking-normal
- [ ] Small text uses tracking-wide or wider
- [ ] Headings use tracking-tight or tighter
- [ ] Sample components created
- [ ] Readability tested across sizes
- [ ] Accessibility guidelines met

---

## Task 38: Create Heading Styles

### Overview
Create default heading styles (H1 through H6) in the global CSS base layer using the typographic scales defined in previous tasks. These styles establish consistent heading appearance throughout the application without requiring utility classes on every heading element. The styles combine font size, line height, font weight, and letter spacing for optimal visual hierarchy.

### Dependencies
- Task 34: Define Font Size Scale
- Task 35: Define Line Height Scale
- Task 36: Define Font Weight Scale
- Task 37: Define Letter Spacing Scale
- `styles/globals.css` exists

### Instructions

1. **Open global styles file**
   - Navigate to `styles/globals.css`
   - Locate @tailwind base directive
   - Add styles after base imports

2. **Create @layer base block**
   - Use Tailwind's @layer directive
   - Place heading styles in base layer
   - Ensures proper cascade with Tailwind

3. **Define H1 heading style**
   - Font size: text-5xl (3rem / 48px)
   - Line height: leading-tight (1.25)
   - Font weight: font-bold (700)
   - Letter spacing: tracking-tight (-0.025em)
   - Color: Inherit from parent or use theme color

4. **Define H2 heading style**
   - Font size: text-4xl (2.25rem / 36px)
   - Line height: leading-tight (1.25)
   - Font weight: font-bold (700)
   - Letter spacing: tracking-tight (-0.025em)

5. **Define H3 heading style**
   - Font size: text-3xl (1.875rem / 30px)
   - Line height: leading-snug (1.375)
   - Font weight: font-semibold (600)
   - Letter spacing: tracking-tight (-0.025em)

6. **Define H4 heading style**
   - Font size: text-2xl (1.5rem / 24px)
   - Line height: leading-snug (1.375)
   - Font weight: font-semibold (600)
   - Letter spacing: tracking-normal (0em)

7. **Define H5 heading style**
   - Font size: text-xl (1.25rem / 20px)
   - Line height: leading-snug (1.375)
   - Font weight: font-medium (500)
   - Letter spacing: tracking-normal (0em)

8. **Define H6 heading style**
   - Font size: text-lg (1.125rem / 18px)
   - Line height: leading-normal (1.5)
   - Font weight: font-medium (500)
   - Letter spacing: tracking-normal (0em)

9. **Add margin spacing to headings**
   - Top margin: Varies by heading level
   - Bottom margin: Consistent within level
   - Ensures proper vertical rhythm

10. **Test heading hierarchy**
    - Create sample page with all headings
    - Verify visual distinction between levels
    - Check spacing and readability
    - Test responsive behavior

11. **Document heading usage**
    - Create guidelines for when to use each level
    - Note semantic HTML importance
    - Reference accessibility best practices

### Heading Styles Specifications

```
┌──────────────────────────────────────────────────┐
│         LankaCommerce Heading Styles             │
├──────────────────────────────────────────────────┤
│                                                  │
│ H1: Page Title                                   │
│   • Size: text-5xl (48px)                        │
│   • Weight: font-bold (700)                      │
│   • Line height: leading-tight (1.25)            │
│   • Tracking: tracking-tight (-0.025em)          │
│   • Margin: mt-0 mb-6                            │
│                                                  │
│ H2: Section Title                                │
│   • Size: text-4xl (36px)                        │
│   • Weight: font-bold (700)                      │
│   • Line height: leading-tight (1.25)            │
│   • Tracking: tracking-tight (-0.025em)          │
│   • Margin: mt-12 mb-4                           │
│                                                  │
│ H3: Subsection Title                             │
│   • Size: text-3xl (30px)                        │
│   • Weight: font-semibold (600)                  │
│   • Line height: leading-snug (1.375)            │
│   • Tracking: tracking-tight (-0.025em)          │
│   • Margin: mt-10 mb-4                           │
│                                                  │
│ H4: Widget Title                                 │
│   • Size: text-2xl (24px)                        │
│   • Weight: font-semibold (600)                  │
│   • Line height: leading-snug (1.375)            │
│   • Tracking: tracking-normal (0em)              │
│   • Margin: mt-8 mb-3                            │
│                                                  │
│ H5: Card Title                                   │
│   • Size: text-xl (20px)                         │
│   • Weight: font-medium (500)                    │
│   • Line height: leading-snug (1.375)            │
│   • Tracking: tracking-normal (0em)              │
│   • Margin: mt-6 mb-2                            │
│                                                  │
│ H6: Small Heading                                │
│   • Size: text-lg (18px)                         │
│   • Weight: font-medium (500)                    │
│   • Line height: leading-normal (1.5)            │
│   • Tracking: tracking-normal (0em)              │
│   • Margin: mt-6 mb-2                            │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Heading Visual Hierarchy

```
Heading Scale Visualization
═══════════════════════════

H1: Dashboard Overview        (48px, bold)
────────────────────────────

H2: Sales Performance         (36px, bold)
─────────────────────────

H3: Revenue Analysis          (30px, semibold)
──────────────────────

H4: Today's Metrics           (24px, semibold)
────────────────────

H5: Product Summary           (20px, medium)
──────────────────

H6: Additional Details        (18px, medium)
─────────────────

Body: This is regular paragraph text for comparison
      at the standard 16px size with normal weight.
```

### Heading Usage Guidelines

| Heading | Semantic Purpose | ERP Dashboard Examples | Frequency per Page |
|---------|------------------|------------------------|-------------------|
| H1 | Main page title | "Dashboard", "Products", "Reports" | 1 only |
| H2 | Major sections | "Sales Summary", "Inventory Status" | 2-4 |
| H3 | Subsections | "Weekly Revenue", "Top Categories" | 3-8 |
| H4 | Widget titles | "Recent Orders", "Stock Alerts" | 5-15 |
| H5 | Card headings | "Order #12345", "Product Details" | 10-30 |
| H6 | Minor headings | "Shipping Info", "Notes" | As needed |

### Heading Hierarchy Rules

```
┌──────────────────────────────────────────────────┐
│            Heading Hierarchy Best Practices      │
├──────────────────────────────────────────────────┤
│                                                  │
│ ✓ Semantic HTML:                                 │
│   • Use proper heading tags (h1, h2, etc.)       │
│   • Don't skip levels (h1 → h3 is wrong)         │
│   • One h1 per page                              │
│   • Outline structure for screen readers         │
│                                                  │
│ ✓ Visual Hierarchy:                              │
│   • Clear size distinction between levels        │
│   • Consistent spacing throughout                │
│   • Weight contrast (bold → medium)              │
│   • Obvious h1 as most prominent                 │
│                                                  │
│ ✓ Content Organization:                          │
│   • h1: Page purpose/title                       │
│   • h2: Major page sections                      │
│   • h3-h6: Subsections and components            │
│   • Logical nesting and flow                     │
│                                                  │
│ ✓ Accessibility:                                 │
│   • Use heading tags, not just styled divs       │
│   • Provide skip navigation links                │
│   • Ensure sufficient contrast ratios            │
│   • Test with screen readers                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Margin and Spacing Strategy

```
Vertical Rhythm for Headings
═════════════════════════════

[Previous content]
        ↓
    (margin-top)    ← Space before heading
        ↓
   [H2 Heading]
        ↓
   (margin-bottom)  ← Space after heading
        ↓
  [Content/paragraph]
        ↓
    (margin-top)    ← Space before next heading
        ↓
   [H3 Heading]
        ↓
   (margin-bottom)
        ↓
  [Content/paragraph]


Margin Values:
H1: mt-0 mb-6    (0px top, 24px bottom)
H2: mt-12 mb-4   (48px top, 16px bottom)
H3: mt-10 mb-4   (40px top, 16px bottom)
H4: mt-8 mb-3    (32px top, 12px bottom)
H5: mt-6 mb-2    (24px top, 8px bottom)
H6: mt-6 mb-2    (24px top, 8px bottom)

Rationale:
- Larger top margins separate sections
- Smaller bottom margins keep heading with content
- Creates visual grouping and hierarchy
```

### ERP Dashboard Heading Applications

```
Dashboard Page Structure
════════════════════════

┌──────────────────────────────────────────────────┐
│                                                  │
│  <h1>Dashboard Overview</h1>                     │
│  Welcome back, manage your business operations   │
│                                                  │
│  ════════════════════════════════════════════    │
│                                                  │
│  <h2>Sales Performance</h2>                      │
│  Track revenue and transaction metrics           │
│                                                  │
│    <h3>Today's Revenue</h3>                      │
│    Real-time sales data and comparisons          │
│                                                  │
│      <h4>Total Sales</h4>                        │
│      LKR 456,789                                 │
│                                                  │
│      <h4>Transaction Count</h4>                  │
│      127 transactions                            │
│                                                  │
│    <h3>Weekly Summary</h3>                       │
│    7-day performance overview                    │
│                                                  │
│  ════════════════════════════════════════════    │
│                                                  │
│  <h2>Inventory Status</h2>                       │
│  Stock levels and alerts                         │
│                                                  │
│    <h3>Low Stock Items</h3>                      │
│                                                  │
│      <h5>Product ABC</h5>                        │
│      Only 5 units remaining                      │
│                                                  │
│      <h5>Product XYZ</h5>                        │
│      Only 12 units remaining                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Responsive Heading Adjustments

| Heading | Desktop (1024px+) | Tablet (768-1023px) | Mobile (<768px) |
|---------|------------------|---------------------|-----------------|
| H1 | text-5xl (48px) | text-4xl (36px) | text-3xl (30px) |
| H2 | text-4xl (36px) | text-3xl (30px) | text-2xl (24px) |
| H3 | text-3xl (30px) | text-2xl (24px) | text-xl (20px) |
| H4 | text-2xl (24px) | text-xl (20px) | text-lg (18px) |
| H5 | text-xl (20px) | text-lg (18px) | text-base (16px) |
| H6 | text-lg (18px) | text-base (16px) | text-base (16px) |

*Note: Implement using Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`*

### Color and Dark Mode Considerations

```
Heading Color Strategy
══════════════════════

Light Mode:
  ├── H1, H2: text-gray-900 (near black)
  ├── H3, H4: text-gray-800 (dark gray)
  └── H5, H6: text-gray-700 (medium-dark gray)

Dark Mode:
  ├── H1, H2: text-white or text-gray-50
  ├── H3, H4: text-gray-100
  └── H5, H6: text-gray-200

Implementation:
Use color utilities in base layer with dark: prefix
for automatic dark mode support.
```

### Expected Outcome
- Consistent heading styles across application
- Clear visual hierarchy H1 through H6
- Proper semantic HTML structure
- Accessible heading outline
- Responsive sizing for mobile
- Foundation for content structure
- No need for utility classes on headings

### Verification Checklist
- [ ] globals.css opened
- [ ] @layer base block created
- [ ] H1 style defined with all properties
- [ ] H2 style defined with all properties
- [ ] H3 style defined with all properties
- [ ] H4 style defined with all properties
- [ ] H5 style defined with all properties
- [ ] H6 style defined with all properties
- [ ] Margin spacing added to all headings
- [ ] Color scheme applied (light/dark mode)
- [ ] Sample page created with all headings
- [ ] Visual hierarchy clear and distinguishable
- [ ] Responsive behavior tested
- [ ] Semantic HTML structure verified
- [ ] Screen reader testing performed
- [ ] Documentation updated

---

## Summary

This document established the foundational typography system for LankaCommerce Cloud ERP Dashboard:

### Completed Typography Foundation
- ✅ Inter font installed with Next.js optimization
- ✅ Font family configured in Tailwind with fallback stack
- ✅ Comprehensive fallback fonts for cross-platform support
- ✅ Font size scale (xs to 9xl) defined
- ✅ Line height scale for optimal readability
- ✅ Font weight scale (light to bold)
- ✅ Letter spacing scale with accessibility compliance
- ✅ Default heading styles (H1-H6) created

### Key Achievements
1. **Optimized Font Loading** - Self-hosted Inter with zero layout shift
2. **Cross-Platform Support** - System font fallbacks for all platforms
3. **International Support** - Noto Sans for Sinhala and Tamil characters
4. **Complete Scales** - Size, line height, weight, and letter spacing
5. **Clear Hierarchy** - Distinct heading levels with proper spacing
6. **Accessibility** - WCAG 2.1 compliant typography
7. **Responsive Design** - Mobile-optimized heading sizes
8. **Semantic HTML** - Proper heading structure for screen readers

### Typography System at a Glance

| Element | Configuration | Result |
|---------|---------------|--------|
| Primary Font | Inter (next/font) | Optimized, self-hosted |
| Fallback Stack | System fonts + Noto Sans | Universal compatibility |
| Base Font Size | 1rem (16px) | Optimal readability |
| Heading Range | 18px to 60px | Clear hierarchy |
| Body Weight | 400 (normal) | Comfortable reading |
| Heading Weight | 500-700 (medium-bold) | Strong presence |
| Line Height | 1.25 to 1.625 | Size-appropriate spacing |
| Letter Spacing | -0.05em to 0.1em | Refined appearance |

### Next Steps
Proceed to [02_Tasks-39-44_Body-Prose-Utilities.md](02_Tasks-39-44_Body-Prose-Utilities.md) to implement body text styles, configure the typography prose plugin for rich content, create monospace font configuration, develop text truncation utilities, and complete the typography documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~990
