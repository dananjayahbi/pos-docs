# Tasks 39-44: Body Text, Prose Styles, and Typography Utilities

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** C - Typography System  
> **Document:** 02 of 02  
> **Tasks Covered:** 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-38_Font-Setup-Headings.md](01_Tasks-31-38_Font-Setup-Headings.md)

---

## Document Overview

This document covers the configuration of body text styles, prose styles for rich content, monospace font setup, and text utility classes. These elements complete the typography system by providing comprehensive text styling options for all content types in the LankaCommerce Cloud application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 39 | Create Body Text Styles | Low | 15 min |
| 40 | Create Caption/Small Text Styles | Low | 15 min |
| 41 | Configure Prose Styles | Medium | 30 min |
| 42 | Create Monospace Font Config | Low | 15 min |
| 43 | Create Text Truncation Utilities | Low | 15 min |
| 44 | Create Typography Documentation | Low | 20 min |

---

## Task 39: Create Body Text Styles

### Overview
Define default body text styles in the Tailwind base layer to ensure consistent text rendering across the application. These styles establish the foundation for readable, accessible content that works well in both light and dark modes.

### Dependencies
- Task 34: Define Font Size Scale
- Task 35: Define Line Height Scale
- Task 36: Define Font Weight Scale
- Task 38: Create Heading Styles

### Instructions

1. **Open globals.css file**
   - Navigate to `frontend/styles/globals.css`
   - Locate the @layer base section

2. **Add body text base styles**
   - Target the body element
   - Set font-size to base (1rem / 16px)
   - Set line-height to 1.5rem (24px)
   - Set font-weight to normal (400)

3. **Configure body text color**
   - Set text color to neutral-900 for light mode
   - Use Tailwind's dark: variant for dark mode
   - Set dark mode text color to neutral-100

4. **Add paragraph default styles**
   - Target p element
   - Set margin-bottom for paragraph spacing
   - Use spacing scale (1rem or 1.25rem)

5. **Configure paragraph color inheritance**
   - Ensure paragraphs inherit body color
   - No need to specify color explicitly

6. **Add strong/bold element styles**
   - Target strong and b elements
   - Set font-weight to semibold (600)
   - Ensure visibility in body text

7. **Add emphasis/italic element styles**
   - Target em and i elements
   - Set font-style to italic
   - Maintain readability

8. **Add text selection styles**
   - Target ::selection pseudo-element
   - Set background color (primary-100 or primary-200)
   - Set text color for contrast
   - Improve user experience when selecting text

### Body Text Style Specifications

| Element | Font Size | Line Height | Font Weight | Color (Light) | Color (Dark) |
|---------|-----------|-------------|-------------|---------------|--------------|
| body | 1rem (16px) | 1.5rem (24px) | 400 (normal) | neutral-900 | neutral-100 |
| p | Inherited | Inherited | Inherited | Inherited | Inherited |
| strong, b | Inherited | Inherited | 600 (semibold) | Inherited | Inherited |
| em, i | Inherited | Inherited | Inherited | Inherited | Inherited |

### Text Readability Guidelines

#### Optimal Line Length
```
Body text should maintain comfortable line length:
• Minimum: 45 characters per line
• Optimal: 60-75 characters per line
• Maximum: 90 characters per line

Container width should constrain text width
for optimal readability in body content.
```

#### Paragraph Spacing
```
Proper spacing between paragraphs improves
readability and visual hierarchy.

Use 1rem (16px) bottom margin for standard
paragraph spacing.

Use 1.25rem (20px) for more generous spacing
in marketing or landing page content.
```

#### Text Contrast Ratios

| Context | Light Mode | Dark Mode | WCAG Level |
|---------|------------|-----------|------------|
| Body text | neutral-900 on white | neutral-100 on neutral-900 | AAA |
| Large text (18px+) | neutral-700 on white | neutral-300 on neutral-900 | AA |
| Disabled text | neutral-400 on white | neutral-600 on neutral-900 | - |

### Body Text Usage Scenarios

#### Primary Content
- Blog posts and articles
- Product descriptions
- Help documentation
- Terms and conditions
- Privacy policies

#### Secondary Content
- Tooltips and hints
- Form helper text
- Placeholder text
- Supplementary information
- Footnotes and disclaimers

#### Interactive Content
- Button labels
- Link text
- Navigation items
- Form labels
- Table content

### Expected Outcome
- Consistent body text appearance
- Optimal readability across devices
- Proper dark mode support
- Accessible text contrast
- Smooth reading experience

### Verification Checklist
- [ ] Body font size set to base (16px)
- [ ] Body line height set to 1.5rem (24px)
- [ ] Body font weight set to normal (400)
- [ ] Light mode color set to neutral-900
- [ ] Dark mode color set to neutral-100
- [ ] Paragraph bottom margin defined
- [ ] Strong/bold styles defined (weight: 600)
- [ ] Emphasis/italic styles defined
- [ ] Text selection styles added
- [ ] All styles tested in light and dark modes

---

## Task 40: Create Caption/Small Text Styles

### Overview
Configure caption and small text utility classes for secondary information, metadata, labels, and supplementary content. These styles provide hierarchical contrast with body text while maintaining readability.

### Dependencies
- Task 34: Define Font Size Scale
- Task 35: Define Line Height Scale
- Task 39: Create Body Text Styles

### Instructions

1. **Open globals.css file**
   - Continue in `frontend/styles/globals.css`
   - Add caption styles to @layer base section

2. **Create caption class**
   - Define .caption utility class
   - Set font-size to sm (0.875rem / 14px)
   - Set line-height to 1.25rem (20px)
   - Set color to neutral-600 (light mode)

3. **Add dark mode caption color**
   - Use dark: variant
   - Set color to neutral-400
   - Ensure adequate contrast

4. **Create small text class**
   - Define .small-text utility class
   - Set font-size to xs (0.75rem / 12px)
   - Set line-height to 1rem (16px)
   - Set color to neutral-500 (light mode)

5. **Add dark mode small text color**
   - Use dark: variant
   - Set color to neutral-500
   - Maintain readability at small size

6. **Create muted text class**
   - Define .text-muted utility class
   - Use neutral-600 for light mode
   - Use neutral-400 for dark mode
   - For de-emphasized content

7. **Create label text class**
   - Define .label-text utility class
   - Set font-size to sm (14px)
   - Set font-weight to medium (500)
   - Set color to neutral-700 (light mode)

8. **Add uppercase label variant**
   - Create .label-text-uppercase class
   - Set text-transform to uppercase
   - Set letter-spacing to wider (0.05em)
   - Reduce font-size slightly (xs or sm)

### Caption and Small Text Scale

| Class Name | Font Size | Line Height | Font Weight | Color (Light) | Color (Dark) | Use Case |
|------------|-----------|-------------|-------------|---------------|--------------|----------|
| .caption | 14px (0.875rem) | 20px (1.25rem) | 400 | neutral-600 | neutral-400 | Captions, metadata |
| .small-text | 12px (0.75rem) | 16px (1rem) | 400 | neutral-500 | neutral-500 | Fine print, footnotes |
| .text-muted | Inherited | Inherited | 400 | neutral-600 | neutral-400 | De-emphasized text |
| .label-text | 14px (0.875rem) | 20px (1.25rem) | 500 | neutral-700 | neutral-300 | Form labels, tags |
| .label-text-uppercase | 12px or 14px | Inherited | 500-600 | neutral-700 | neutral-300 | Section headers |

### Small Text Hierarchy

```
┌─────────────────────────────────────────────────┐
│  Product Title (text-lg or text-xl)            │  ← Primary
├─────────────────────────────────────────────────┤
│  Product description text at base size         │  ← Body
│  continues with comfortable reading flow...    │
├─────────────────────────────────────────────────┤
│  Posted by John Doe • 2 hours ago (caption)    │  ← Caption
├─────────────────────────────────────────────────┤
│  Product ID: PRD-12345 (small-text)            │  ← Small
└─────────────────────────────────────────────────┘
```

### Small Text Usage Scenarios

#### Caption Text (14px / text-sm)
- Image captions
- Timestamp labels
- Author attribution
- Comment metadata
- Card subtitles
- Table captions

#### Small Text (12px / text-xs)
- Legal disclaimers
- Copyright notices
- Input field hints
- Badge text
- Tag labels
- Tooltip content

#### Muted Text
- Placeholder values
- Disabled state labels
- Optional field indicators
- Inactive menu items
- Soft warnings

#### Label Text
- Form field labels
- Table column headers
- Filter labels
- Category tags
- Status indicators
- Section headers (when uppercased)

### Minimum Font Size Guidelines

```
┌──────────────────────────────────────────────────┐
│  Accessibility Consideration                     │
├──────────────────────────────────────────────────┤
│  • Minimum readable size: 12px (0.75rem)        │
│  • Avoid fonts smaller than 12px                │
│  • Exception: 11px for dense data tables        │
│  • Never use fonts smaller than 10px            │
│                                                  │
│  Test readability on actual devices:            │
│  • Mobile: 12px minimum                         │
│  • Tablet: 12px minimum                         │
│  • Desktop: 11px acceptable in tables           │
└──────────────────────────────────────────────────┘
```

### Expected Outcome
- Clear text hierarchy with size variations
- Consistent caption and label styling
- Readable small text across devices
- Proper color contrast at all sizes
- Accessible text for all content types

### Verification Checklist
- [ ] .caption class created (14px / text-sm)
- [ ] .small-text class created (12px / text-xs)
- [ ] .text-muted class created
- [ ] .label-text class created
- [ ] .label-text-uppercase class created
- [ ] All classes have light mode colors
- [ ] All classes have dark mode colors
- [ ] Font sizes meet minimum 12px guideline
- [ ] Color contrast ratios verified
- [ ] Classes tested on multiple screen sizes

---

## Task 41: Configure Prose Styles

### Overview
Install and configure the Tailwind Typography plugin to create beautiful default styles for rendered Markdown content, blog posts, and rich text. Customize prose styles to match the LankaCommerce design system colors and typography.

### Dependencies
- Task 10: Install @tailwindcss/typography plugin
- Task 34: Define Font Size Scale
- Task 38: Create Heading Styles
- Group B: Color System (for link and code colors)

### Instructions

1. **Verify typography plugin installation**
   - Confirm @tailwindcss/typography is in package.json
   - Verify plugin is registered in tailwind.config.js
   - If not installed, run npm install command

2. **Open tailwind.config.js file**
   - Navigate to theme.extend section
   - Prepare to add typography customization

3. **Add typography configuration object**
   - Create typography property in theme.extend
   - Begin customization of prose styles

4. **Customize default prose styles**
   - Configure DEFAULT variant (base prose size)
   - Override default colors to match design system
   - Customize typography elements

5. **Configure prose heading colors**
   - Set h1 color to neutral-900 (light) / neutral-100 (dark)
   - Set h2-h6 colors to neutral-800 (light) / neutral-200 (dark)
   - Ensure consistent heading appearance

6. **Configure prose paragraph styles**
   - Set paragraph color to neutral-700 (light) / neutral-300 (dark)
   - Adjust paragraph margin-bottom if needed
   - Maintain readability

7. **Configure prose link styles**
   - Set link color to primary-600 (light mode)
   - Set link color to primary-400 (dark mode)
   - Add hover states (primary-700 / primary-300)
   - Configure underline styles

8. **Configure prose list styles**
   - Set list marker color to neutral-500
   - Adjust list spacing
   - Configure nested list indentation

9. **Configure prose blockquote styles**
   - Set border color to neutral-300 (light) / neutral-700 (dark)
   - Set text color to neutral-600 (light) / neutral-400 (dark)
   - Set italic font style
   - Adjust padding and margin

10. **Configure prose code styles**
    - Set inline code background to neutral-100 (light) / neutral-800 (dark)
    - Set inline code text color to primary-600 / primary-400
    - Configure code block background
    - Set code block text color

11. **Configure prose pre (code block) styles**
    - Set background to neutral-900 (light) / neutral-950 (dark)
    - Set text color to neutral-100
    - Configure padding and border-radius
    - Add scrollbar styling if needed

12. **Configure prose strong/bold styles**
    - Set font-weight to semibold (600)
    - Set color to neutral-900 (light) / neutral-100 (dark)

13. **Configure prose em/italic styles**
    - Maintain italic font-style
    - Inherit color from parent

14. **Configure prose hr (horizontal rule) styles**
    - Set border color to neutral-300 (light) / neutral-700 (dark)
    - Adjust margin spacing

15. **Configure prose table styles**
    - Set border color to neutral-300 (light) / neutral-700 (dark)
    - Set header background to neutral-100 (light) / neutral-800 (dark)
    - Configure cell padding
    - Add striped row styling if desired

16. **Add prose size variants**
    - Customize prose-sm (smaller prose)
    - Customize prose-lg (larger prose)
    - Customize prose-xl (extra large prose)
    - Adjust font sizes and spacing for each variant

17. **Test prose dark mode**
    - Ensure all prose styles have dark mode variants
    - Verify contrast ratios in dark mode
    - Test with actual Markdown content

### Prose Style Configuration Overview

```
┌────────────────────────────────────────────────────┐
│          Typography Plugin Customization           │
├────────────────────────────────────────────────────┤
│  Prose Elements:                                   │
│   • Headings (h1-h6)                               │
│   • Paragraphs                                     │
│   • Links                                          │
│   • Lists (ul, ol)                                 │
│   • Blockquotes                                    │
│   • Code (inline & blocks)                         │
│   • Tables                                         │
│   • Horizontal rules                               │
│   • Strong & emphasis                              │
│                                                    │
│  Size Variants:                                    │
│   • prose-sm (smaller)                             │
│   • prose (default)                                │
│   • prose-lg (larger)                              │
│   • prose-xl (extra large)                         │
│                                                    │
│  Mode Variants:                                    │
│   • Light mode (default colors)                    │
│   • Dark mode (prose-invert or custom dark colors) │
└────────────────────────────────────────────────────┘
```

### Prose Element Color Scheme

| Element | Light Mode | Dark Mode | Notes |
|---------|------------|-----------|-------|
| Headings | neutral-900, neutral-800 | neutral-100, neutral-200 | High contrast |
| Paragraphs | neutral-700 | neutral-300 | Body text |
| Links | primary-600 | primary-400 | Brand color |
| Link hover | primary-700 | primary-300 | Darker/lighter |
| Lists | neutral-500 (markers) | neutral-500 | Subtle markers |
| Blockquote border | neutral-300 | neutral-700 | Left border |
| Blockquote text | neutral-600 | neutral-400 | Muted |
| Inline code bg | neutral-100 | neutral-800 | Subtle background |
| Inline code text | primary-600 | primary-400 | Brand accent |
| Code block bg | neutral-900 | neutral-950 | Dark background |
| Code block text | neutral-100 | neutral-100 | Light text |
| Table borders | neutral-300 | neutral-700 | Subtle borders |
| Table header bg | neutral-100 | neutral-800 | Header emphasis |
| HR border | neutral-300 | neutral-700 | Divider line |

### Prose Usage Examples

#### Blog Post Container
```
Apply prose class to container div:
<div class="prose prose-lg dark:prose-invert">
  {/* Rendered Markdown content */}
</div>
```

#### Documentation Page
```
Apply prose with max width:
<article class="prose max-w-none dark:prose-invert">
  {/* Technical documentation */}
</article>
```

#### Product Description
```
Apply smaller prose for compact layout:
<div class="prose prose-sm dark:prose-invert">
  {/* Product detailed description */}
</div>
```

### Prose Responsive Sizing

| Breakpoint | Prose Class | Base Font Size | Max Width |
|------------|-------------|----------------|-----------|
| Mobile (default) | prose-sm | 14px | 100% |
| Tablet (md:) | prose | 16px | 65ch |
| Desktop (lg:) | prose-lg | 18px | 65ch |
| Large screens | prose-xl (optional) | 20px | 65ch |

### Expected Outcome
- Beautifully styled Markdown content
- Consistent prose appearance across app
- Dark mode support for all prose elements
- Customized colors matching design system
- Multiple size variants for flexibility
- Accessible link and code styling

### Verification Checklist
- [ ] @tailwindcss/typography plugin installed
- [ ] Typography object added to theme.extend
- [ ] Heading colors customized (h1-h6)
- [ ] Paragraph colors customized
- [ ] Link colors and hover states configured
- [ ] List styles customized
- [ ] Blockquote styles customized
- [ ] Inline code styles configured
- [ ] Code block (pre) styles configured
- [ ] Strong/em styles configured
- [ ] HR styles configured
- [ ] Table styles configured
- [ ] prose-sm variant customized
- [ ] prose-lg variant customized
- [ ] Dark mode styles verified
- [ ] Tested with actual Markdown content

---

## Task 42: Create Monospace Font Config

### Overview
Configure a monospace font family for code, technical content, and data displays. Set up font fallbacks for code blocks, inline code, and terminal-style interfaces to ensure proper rendering across different operating systems.

### Dependencies
- Task 02: Extend Tailwind Config
- Task 32: Configure Font Family in Tailwind

### Instructions

1. **Open tailwind.config.js file**
   - Navigate to theme.extend.fontFamily section
   - Prepare to add monospace font configuration

2. **Research monospace font options**
   - Consider system fonts: SF Mono, Consolas, Monaco
   - Consider web fonts: Fira Code, JetBrains Mono, Source Code Pro
   - Evaluate code ligature support if needed

3. **Define monospace font stack**
   - Create mono property in fontFamily object
   - List preferred monospace fonts
   - Include system font fallbacks

4. **Add web font as first choice (optional)**
   - If using Fira Code or similar, list first
   - Ensure font is loaded via next/font or CDN
   - Optimize for variable font if available

5. **Add macOS system fonts**
   - Add 'SF Mono' for macOS
   - Add 'Monaco' as fallback
   - Ensure proper font name casing

6. **Add Windows system fonts**
   - Add 'Consolas' for Windows
   - Add 'Courier New' as universal fallback
   - Cover older Windows versions

7. **Add Linux system fonts**
   - Add 'Liberation Mono' for Linux
   - Add 'Ubuntu Mono' as alternative
   - Ensure broad Linux distribution support

8. **Add generic fallback**
   - Add 'monospace' as final fallback
   - Browser will use default monospace font
   - Ensures rendering on all platforms

9. **Configure font feature settings (optional)**
   - Enable code ligatures if using Fira Code
   - Configure character variants
   - Add in custom CSS if needed

10. **Test monospace font rendering**
    - Apply font-mono class to code elements
    - Verify proper spacing and alignment
    - Test on different operating systems

### Monospace Font Stack Options

#### Option A: Web Font First (Fira Code)
```
mono: [
  'Fira Code',
  'SF Mono',
  'Consolas',
  'Liberation Mono',
  'Monaco',
  'Courier New',
  'monospace'
]
```

#### Option B: System Fonts Only
```
mono: [
  'SF Mono',
  'Consolas',
  'Monaco',
  'Liberation Mono',
  'Ubuntu Mono',
  'Courier New',
  'monospace'
]
```

#### Option C: JetBrains Mono
```
mono: [
  'JetBrains Mono',
  'Menlo',
  'Consolas',
  'Monaco',
  'Liberation Mono',
  'Courier New',
  'monospace'
]
```

### Monospace Font Characteristics

| Font Name | Platform | Ligatures | Character Width | Distinguishability |
|-----------|----------|-----------|-----------------|-------------------|
| Fira Code | Web font | Yes | Proportional mono | Excellent |
| JetBrains Mono | Web font | Yes | Proportional mono | Excellent |
| SF Mono | macOS | No | Fixed | Excellent |
| Consolas | Windows | No | Fixed | Good |
| Monaco | macOS | No | Fixed | Good |
| Liberation Mono | Linux | No | Fixed | Good |
| Courier New | All | No | Fixed | Fair |

### Character Distinguishability

```
Important characters to test in monospace fonts:
┌────────────────────────────────────────────────┐
│  0 O (zero vs capital O)                      │
│  1 l I (one vs lowercase L vs capital I)      │
│  2 Z (two vs capital Z)                       │
│  5 S (five vs capital S)                      │
│  6 b (six vs lowercase b)                     │
│  8 B (eight vs capital B)                     │
│  ` ' " (backtick vs single vs double quotes)  │
│  - _ (hyphen vs underscore)                   │
│  . , ; : (punctuation marks)                  │
│  {} [] () <> (brackets and braces)            │
└────────────────────────────────────────────────┘
```

### Monospace Font Usage

#### Inline Code
```
Apply font-mono to inline code elements:
<code class="font-mono">const value = 42;</code>
```

#### Code Blocks
```
Apply font-mono to pre/code blocks:
<pre class="font-mono"><code>
  function example() {
    return true;
  }
</code></pre>
```

#### Terminal Output
```
Apply to terminal-style displays:
<div class="font-mono bg-neutral-900 text-green-400">
  $ npm run dev
</div>
```

#### Data Tables
```
Apply to numeric data for alignment:
<td class="font-mono text-right">1,234.56</td>
```

#### API Endpoints
```
Apply to URLs and endpoints:
<span class="font-mono text-sm">
  /api/v1/products
</span>
```

### Font Loading Optimization (if using web font)

```
If loading Fira Code or JetBrains Mono:

1. Use next/font for optimal loading
2. Enable font-display: swap
3. Subset to Latin characters only
4. Preload font file for critical code
5. Consider variable font for size reduction
```

### Expected Outcome
- Clean, readable monospace font
- Consistent code display across platforms
- Clear character distinguishability
- Proper alignment in code blocks
- Optimized font loading

### Verification Checklist
- [ ] Monospace font stack defined in tailwind.config.js
- [ ] Preferred font listed first
- [ ] macOS fonts included (SF Mono, Monaco)
- [ ] Windows fonts included (Consolas)
- [ ] Linux fonts included (Liberation Mono)
- [ ] Generic monospace fallback added
- [ ] font-mono class tested on code elements
- [ ] Character distinguishability verified
- [ ] Font rendering tested on multiple platforms
- [ ] Font loading optimized (if using web font)

---

## Task 43: Create Text Truncation Utilities

### Overview
Configure text truncation and line-clamping utilities to handle overflow content gracefully. Create utility classes for single-line ellipsis, multi-line clamping, and responsive text truncation to maintain clean layouts when text exceeds available space.

### Dependencies
- Task 02: Extend Tailwind Config
- Task 34: Define Font Size Scale

### Instructions

1. **Verify Tailwind truncate utility**
   - Confirm that Tailwind's built-in truncate class exists
   - Test truncate class for single-line ellipsis
   - No additional configuration needed for basic truncate

2. **Open tailwind.config.js file**
   - Navigate to theme.extend section
   - Prepare to add line-clamp configuration

3. **Add line-clamp utilities**
   - Extend lineClamp property in theme
   - Define line-clamp values for multi-line truncation
   - Cover common use cases (2, 3, 4, 5 lines)

4. **Configure line-clamp-1**
   - Equivalent to truncate but using line-clamp
   - Clamp to 1 line
   - Alternative syntax for consistency

5. **Configure line-clamp-2**
   - Clamp text to 2 lines
   - Most common for card titles and descriptions
   - Maintain line-height

6. **Configure line-clamp-3**
   - Clamp text to 3 lines
   - Common for product descriptions
   - Balance content preview with space

7. **Configure line-clamp-4**
   - Clamp text to 4 lines
   - Used in longer descriptions
   - Preserve more content

8. **Configure line-clamp-5**
   - Clamp text to 5 lines
   - Maximum recommended lines
   - For detailed previews

9. **Configure line-clamp-none**
   - Remove line clamping
   - Useful for responsive breakpoints
   - Show full text on larger screens

10. **Add custom truncation utilities in globals.css**
    - Open `frontend/styles/globals.css`
    - Add @layer utilities section if not exists

11. **Create truncate-2-lines utility**
    - Alternative naming convention
    - Use -webkit-line-clamp
    - Set display and overflow properties

12. **Create truncate-ellipsis-end utility**
    - Explicit ellipsis at text end
    - Ensure ellipsis character renders
    - Cross-browser compatibility

13. **Create truncate-fade utility**
    - Alternative to ellipsis: gradient fade
    - Apply gradient overlay at text end
    - Create smooth fade-out effect

14. **Add responsive truncation variants**
    - Create utilities that change at breakpoints
    - Example: truncate on mobile, full text on desktop
    - Combine with Tailwind's responsive prefixes

15. **Test truncation across browsers**
    - Verify ellipsis rendering in Chrome, Firefox, Safari
    - Test line-clamp support
    - Add fallbacks if needed

### Truncation Utility Overview

```
┌──────────────────────────────────────────────────┐
│         Text Truncation Methods                  │
├──────────────────────────────────────────────────┤
│  Single Line:                                    │
│   • truncate (built-in Tailwind)                │
│   • line-clamp-1                                │
│                                                  │
│  Multi Line:                                     │
│   • line-clamp-2                                │
│   • line-clamp-3                                │
│   • line-clamp-4                                │
│   • line-clamp-5                                │
│                                                  │
│  Custom:                                         │
│   • truncate-fade (gradient overlay)            │
│   • Responsive variants                         │
└──────────────────────────────────────────────────┘
```

### Line-Clamp Configuration Table

| Utility Class | Lines Visible | CSS Property | Browser Support | Use Case |
|---------------|---------------|--------------|-----------------|----------|
| truncate | 1 | text-overflow: ellipsis | All browsers | Single-line text |
| line-clamp-1 | 1 | -webkit-line-clamp: 1 | Modern browsers | Alternative syntax |
| line-clamp-2 | 2 | -webkit-line-clamp: 2 | Modern browsers | Card titles |
| line-clamp-3 | 3 | -webkit-line-clamp: 3 | Modern browsers | Short descriptions |
| line-clamp-4 | 4 | -webkit-line-clamp: 4 | Modern browsers | Medium descriptions |
| line-clamp-5 | 5 | -webkit-line-clamp: 5 | Modern browsers | Long previews |
| line-clamp-none | Unlimited | -webkit-line-clamp: unset | Modern browsers | Remove clamping |

### Truncation Use Cases

#### Product Card Title (2 lines max)
```
Container: Fixed height card
Text: Product name may be long
Solution: line-clamp-2
Result: Shows up to 2 lines with ellipsis
```

#### Product Description (3 lines max)
```
Container: Product grid card
Text: Full product description
Solution: line-clamp-3
Result: Preview of description with ellipsis
```

#### Blog Post Excerpt (4-5 lines max)
```
Container: Blog post card
Text: Article excerpt or summary
Solution: line-clamp-4 or line-clamp-5
Result: Generous preview with ellipsis
```

#### Table Cell (1 line max)
```
Container: Table column with fixed width
Text: Cell content may overflow
Solution: truncate
Result: Single line with ellipsis
```

#### Navigation Menu Item (1 line max)
```
Container: Sidebar navigation
Text: Menu item label
Solution: truncate
Result: Prevents layout breaking
```

### Responsive Truncation Example

```
Strategy: Show truncated on mobile, full text on desktop

Mobile (default):
  <p class="line-clamp-2 md:line-clamp-none">
    Full product description text...
  </p>

Tablet (md):
  Remove truncation, show all text

Desktop (lg):
  Full text continues to display
```

### Truncate vs Line-Clamp

| Feature | truncate | line-clamp-{n} |
|---------|----------|----------------|
| Lines | Single line only | Multiple lines |
| Browser support | All browsers | Modern only (fallback needed) |
| Ellipsis | Automatic | Automatic |
| Overflow | text-overflow | -webkit-line-clamp |
| White-space | nowrap | normal |
| Display | block | -webkit-box |

### Gradient Fade Alternative

```
When ellipsis doesn't fit design:

Create fade-out effect at text end:
1. Position relative container
2. Absolute positioned pseudo-element
3. Gradient from transparent to background color
4. Positioned at bottom-right

Visual result: Text fades smoothly instead of
cutting off with ellipsis character.
```

### Cross-Browser Considerations

```
┌────────────────────────────────────────────────┐
│  Browser Compatibility Notes                   │
├────────────────────────────────────────────────┤
│  line-clamp support:                           │
│   ✓ Chrome/Edge: Full support                 │
│   ✓ Safari: Full support                      │
│   ✓ Firefox: Supported (v68+)                 │
│   ✗ IE11: Not supported (fallback needed)     │
│                                                │
│  Fallback strategy:                            │
│   • Use max-height + overflow: hidden         │
│   • Calculate height based on line-height     │
│   • No ellipsis, just cut-off                 │
│   • Acceptable for older browsers             │
└────────────────────────────────────────────────┘
```

### Expected Outcome
- Flexible text truncation utilities
- Single and multi-line ellipsis support
- Responsive truncation capabilities
- Clean overflow handling
- Consistent appearance across browsers

### Verification Checklist
- [ ] truncate utility tested (Tailwind built-in)
- [ ] line-clamp-1 configured
- [ ] line-clamp-2 configured
- [ ] line-clamp-3 configured
- [ ] line-clamp-4 configured
- [ ] line-clamp-5 configured
- [ ] line-clamp-none configured
- [ ] Custom utilities added to globals.css
- [ ] Truncation tested in card layouts
- [ ] Truncation tested in table cells
- [ ] Responsive variants tested
- [ ] Cross-browser compatibility verified
- [ ] Ellipsis rendering confirmed
- [ ] Fallback styles added for older browsers

---

## Task 44: Create Typography Documentation

### Overview
Create comprehensive documentation for the typography system, covering font families, size scales, text styles, utility classes, and usage guidelines. This documentation serves as a reference for developers and designers implementing the LankaCommerce design system.

### Dependencies
- Task 31: Install Inter Font
- Task 34: Define Font Size Scale
- Task 36: Define Font Weight Scale
- Task 38: Create Heading Styles
- Task 39: Create Body Text Styles
- Task 40: Create Caption/Small Text Styles
- Task 41: Configure Prose Styles
- Task 42: Create Monospace Font Config
- Task 43: Create Text Truncation Utilities

### Instructions

1. **Create documentation file**
   - Navigate to `frontend/docs/design-system/` directory
   - Create file named `typography.md`
   - Add front matter or header section

2. **Add document header**
   - Title: Typography System
   - Subtitle: Font Configuration and Text Styles
   - Version and last updated date
   - Table of contents

3. **Document font families section**
   - List all configured font families
   - Show sans-serif stack (Inter + fallbacks)
   - Show monospace stack (Fira Code/SF Mono + fallbacks)
   - Explain font loading strategy

4. **Document font size scale**
   - Create table showing all font sizes
   - Include rem values, pixel equivalents
   - Show default line heights for each size
   - Add visual scale representation

5. **Document font weight scale**
   - List all font weights (300-700)
   - Show weight names (light, normal, medium, semibold, bold)
   - Provide usage recommendations
   - Note Inter font weight support

6. **Document letter spacing scale**
   - List letter spacing values
   - Show use cases for each value
   - Note when to use tighter/wider spacing
   - Explain uppercase letter spacing

7. **Document heading styles**
   - Show H1 through H6 styles
   - Include font size, weight, line height
   - Provide visual examples
   - Show dark mode appearance

8. **Document body text styles**
   - Explain default body text configuration
   - Show paragraph spacing
   - Document strong and emphasis styles
   - Include text selection styling

9. **Document caption and small text**
   - List caption and small text classes
   - Show .caption, .small-text, .text-muted, .label-text
   - Provide size and color details
   - Include usage scenarios

10. **Document prose styles**
    - Explain @tailwindcss/typography plugin
    - Show prose class usage
    - Document customized elements (headings, links, code, blockquotes)
    - Show prose size variants (prose-sm, prose-lg)

11. **Document monospace font**
    - Show font-mono class
    - List monospace font stack
    - Provide code block examples
    - Show inline code styling

12. **Document text truncation utilities**
    - Show truncate class
    - Show line-clamp-{n} classes
    - Provide usage examples
    - Explain responsive truncation

13. **Add usage guidelines section**
    - Text hierarchy best practices
    - Accessibility considerations
    - Responsive typography tips
    - When to use each text style

14. **Add component examples**
    - Show real component implementations
    - Card title with line-clamp
    - Form label with proper size
    - Button text with appropriate weight
    - Code snippet with monospace font

15. **Add color contrast section**
    - Document text color recommendations
    - Show contrast ratios for accessibility
    - List approved text/background combinations
    - Note WCAG compliance

16. **Add do's and don'ts section**
    - Show good typography examples
    - Show anti-patterns to avoid
    - Provide visual comparisons
    - Explain reasoning

17. **Add resources section**
    - Link to Tailwind Typography docs
    - Link to Inter font documentation
    - Link to WCAG guidelines
    - List related design system docs

### Documentation Structure

```
typography.md
├── 1. Overview
│   └── Introduction to typography system
├── 2. Font Families
│   ├── Sans-serif (Inter)
│   └── Monospace (Fira Code/SF Mono)
├── 3. Font Scale
│   ├── Font sizes (xs - 6xl)
│   ├── Line heights
│   ├── Font weights
│   └── Letter spacing
├── 4. Text Styles
│   ├── Headings (H1-H6)
│   ├── Body text
│   └── Caption/small text
├── 5. Prose Styles
│   ├── Typography plugin
│   └── Customization
├── 6. Utilities
│   ├── Text truncation
│   └── Line clamping
├── 7. Usage Guidelines
│   ├── Hierarchy
│   ├── Accessibility
│   └── Responsive design
├── 8. Examples
│   └── Component implementations
├── 9. Accessibility
│   └── Color contrast
└── 10. Resources
    └── External links
```

### Documentation Content Sections

| Section | Content Type | Purpose |
|---------|--------------|---------|
| Overview | Introduction | Explain typography system scope |
| Font Families | Reference table | List all font stacks |
| Font Scale | Visual scale + table | Show size progression |
| Text Styles | Examples + code | Demonstrate heading/body styles |
| Prose Styles | Usage guide | Explain rich content styling |
| Utilities | Reference + examples | Document helper classes |
| Usage Guidelines | Best practices | Guide proper usage |
| Examples | Component code | Show real implementations |
| Accessibility | Compliance guide | Ensure WCAG standards |
| Resources | Link collection | Provide further reading |

### Visual Elements to Include

#### Font Size Scale Visualization
```
Display sizes in ascending order:
xs   ← 12px
sm   ← 14px
base ← 16px (default body)
lg   ← 18px
xl   ← 20px
2xl  ← 24px
3xl  ← 30px
4xl  ← 36px
5xl  ← 48px
6xl  ← 60px
```

#### Heading Hierarchy Example
```
Show visual hierarchy:
H1 - Main Page Title (text-5xl font-bold)
 └─ H2 - Section Title (text-4xl font-bold)
     └─ H3 - Subsection Title (text-3xl font-semibold)
         └─ H4 - Component Title (text-2xl font-semibold)
             └─ H5 - Small Title (text-xl font-medium)
                 └─ H6 - Tiny Title (text-lg font-medium)
```

#### Text Contrast Matrix
```
Create table showing text/background combinations:

| Text Color | Background | Ratio | WCAG | Use Case |
|------------|------------|-------|------|----------|
| neutral-900 | white | 21:1 | AAA | Body text |
| neutral-700 | white | 12:1 | AAA | Secondary text |
| neutral-600 | white | 7:1 | AA | Muted text |
| neutral-100 | neutral-900 | 18:1 | AAA | Dark mode body |
```

### Code Examples to Include

#### Heading Usage
```
<h1 class="text-5xl font-bold text-neutral-900 dark:text-neutral-100">
  Dashboard
</h1>
```

#### Prose Content
```
<article class="prose dark:prose-invert max-w-none">
  {/* Rendered Markdown */}
</article>
```

#### Truncated Text
```
<p class="line-clamp-2 text-sm text-neutral-600">
  Long product description...
</p>
```

#### Monospace Code
```
<code class="font-mono text-sm bg-neutral-100 px-1 py-0.5 rounded">
  npm install
</code>
```

### Expected Outcome
- Comprehensive typography reference
- Clear usage guidelines
- Visual examples for all styles
- Accessibility documentation
- Developer-friendly format
- Searchable markdown document

### Verification Checklist
- [ ] typography.md file created in docs/design-system/
- [ ] Document header with title and TOC added
- [ ] Font families section completed
- [ ] Font size scale documented with table
- [ ] Font weight scale documented
- [ ] Letter spacing scale documented
- [ ] Heading styles section completed (H1-H6)
- [ ] Body text styles section completed
- [ ] Caption/small text section completed
- [ ] Prose styles section completed
- [ ] Monospace font section completed
- [ ] Text truncation utilities documented
- [ ] Usage guidelines section added
- [ ] Component examples included
- [ ] Accessibility section with contrast ratios
- [ ] Do's and don'ts section added
- [ ] Resources section with external links
- [ ] Code examples syntax-highlighted
- [ ] Visual scale representations included
- [ ] Document reviewed for clarity

---

## Summary

This document completed the typography system configuration for LankaCommerce Cloud:

### Completed Typography Components
- ✅ Body text styles (16px base, neutral colors, dark mode)
- ✅ Caption and small text styles (14px, 12px variants)
- ✅ Prose styles configuration (@tailwindcss/typography customization)
- ✅ Monospace font setup (Fira Code / SF Mono stack)
- ✅ Text truncation utilities (line-clamp-1 through line-clamp-5)
- ✅ Comprehensive typography documentation

### Key Achievements
1. **Readable Body Text** - Optimal font size and line height for comfortable reading
2. **Text Hierarchy** - Caption and small text styles for secondary content
3. **Rich Content Styling** - Customized prose styles for Markdown and blog content
4. **Code Display** - Monospace font with excellent character distinguishability
5. **Overflow Handling** - Flexible truncation utilities for clean layouts
6. **Complete Documentation** - Reference guide for developers and designers

### Typography System Complete

With this document completed, Group C Typography System is now fully configured:
- Inter font installed and optimized (Task 31-33)
- Font scales defined (Tasks 34-37)
- Heading styles created (Task 38)
- Body, caption, and prose styles configured (Tasks 39-41)
- Monospace font and utilities added (Tasks 42-43)
- Documentation complete (Task 44)

### Files Modified
```
frontend/
├── tailwind.config.js         # Monospace font, line-clamp config
├── styles/
│   └── globals.css            # Body text, caption, small text styles
└── docs/
    └── design-system/
        └── typography.md      # Typography documentation
```

### Next Steps
Proceed to [Group-D_Spacing-Layout-System](../Group-D_Spacing-Layout-System/) to configure spacing scales, container widths, and layout utilities for the LankaCommerce design system.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~970
