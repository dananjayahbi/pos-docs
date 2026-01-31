# Tasks 19-28: Font Configuration and CSS Optimization

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** B - Font & Loading Optimization  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-29-36_Loading-Skeletons-Verify.md](02_Tasks-29-36_Loading-Skeletons-Verify.md)

---

## Document Overview

This document covers font configuration and CSS optimization for the webstore. It establishes optimal font loading strategies using Next.js font optimization, configures primary and heading fonts with proper display settings, creates font subsets and preloading, implements CSS variables, optimizes icon fonts with tree-shaking, and establishes critical CSS inlining strategies for faster initial page loads.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create Font Configuration | Medium | 30 min |
| 20 | Create Primary Font | Low | 15 min |
| 21 | Create Heading Font | Low | 15 min |
| 22 | Create Font Display Swap | Low | 10 min |
| 23 | Create Font Subset | Low | 10 min |
| 24 | Create Font Preload | Medium | 25 min |
| 25 | Create Font Variable | Low | 15 min |
| 26 | Create Icon Font Optimization | Medium | 30 min |
| 27 | Create Critical CSS | High | 45 min |
| 28 | Create CSS Loading Strategy | Medium | 30 min |

---

## Task 19: Create Font Configuration

### Overview
Establish the font configuration system using Next.js built-in font optimization (next/font). This task sets up the foundation for loading fonts efficiently with automatic font optimization, self-hosting, and zero layout shift. Configure the fonts directory structure and initialization approach for both Google Fonts and local custom fonts.

### Dependencies
- SubPhase-12 (Next.js Configuration) must be complete
- Frontend project structure established
- Basic styles directory created

### Instructions

1. **Create fonts directory structure**
   - Navigate to `frontend/styles/` directory
   - Create new directory named `fonts/`
   - This will house all font configuration files

2. **Create font configuration file**
   - Create `fonts.ts` in `styles/fonts/` directory
   - This file centralizes all font imports and configurations
   - Export font objects for use across the application

3. **Choose font loading strategy**
   - Option A: Google Fonts (next/font/google)
   - Option B: Local Fonts (next/font/local)
   - Option C: Combination of both
   - Consider licensing, performance, and offline support

4. **Import Next.js font utilities**
   - Import font loader from `next/font/google` or `next/font/local`
   - Choose appropriate loader based on font source
   - Review Next.js font documentation for options

5. **Configure base font settings**
   - Define font family names
   - Specify font weights to include
   - Set font style variations (normal, italic)
   - Configure character subsets

6. **Set performance options**
   - Enable automatic font optimization
   - Configure preload behavior
   - Set display strategy (swap recommended)
   - Define fallback fonts

7. **Export font configuration**
   - Export individual font objects
   - Create combined exports for convenience
   - Ensure TypeScript types are correct

### Font Loading Strategy Comparison

| Strategy | Pros | Cons |
|----------|------|------|
| Google Fonts | Easy setup, wide selection | External dependency |
| Local Fonts | Full control, offline support | Manual updates |
| Combination | Best of both | More complex |

### Font Configuration Structure

```
frontend/styles/fonts/
├── fonts.ts              # Font configuration
├── fontVariables.css     # CSS variables (Task 25)
└── local/                # Local font files (if using)

frontend/app/layout.tsx   # Apply fonts
```

### Next.js Font Options

| Option | Recommended Value | Description |
|--------|-------------------|-------------|
| weight | ['400', '500', '600', '700'] | Font weights |
| subsets | ['latin'] | Character subsets |
| display | 'swap' | Display strategy |
| preload | true | Preload critical fonts |
| variable | '--font-body' | CSS variable |
| fallback | ['system-ui', 'arial'] | Fallback stack |

### Expected Outcome
- Centralized font configuration system established
- Next.js font optimization enabled
- Foundation ready for specific font implementations
- Proper TypeScript types and exports configured

### Verification Checklist
- [ ] `frontend/styles/fonts/` directory created
- [ ] `fonts.ts` configuration file created
- [ ] Next.js font utilities imported correctly
- [ ] Font loading strategy chosen and documented
- [ ] Base font configuration structure implemented
- [ ] Font configuration exports properly
- [ ] TypeScript types defined correctly

---

## Task 20: Create Primary Font

### Overview
Configure and implement the primary body font for the webstore using Next.js font optimization. This font will be used for body text, paragraphs, form inputs, and general content throughout the application. Select a highly readable font suitable for e-commerce content with appropriate weights for various text hierarchies.

### Dependencies
- Task 19: Create Font Configuration

### Instructions

1. **Select primary body font**
   - Choose from Google Fonts: Inter, Open Sans, Roboto, or Lato
   - Consider readability for product descriptions
   - Ensure font supports required character sets
   - Verify licensing for commercial use

2. **Configure font import**
   - Open `styles/fonts/fonts.ts` file
   - Import chosen font from next/font/google
   - Example: `import { Inter } from 'next/font/google'`

3. **Define font weights**
   - Include weight 400 (normal/regular text)
   - Include weight 500 (medium emphasis)
   - Include weight 600 (semi-bold headings)
   - Include weight 700 (bold emphasis)

4. **Set font configuration object**
   - Create font instance with configuration
   - Set subsets to ['latin'] (optimize for Latin characters)
   - Set display to 'swap' (prevent invisible text)
   - Enable preload for critical rendering path

5. **Configure CSS variable**
   - Set variable name to '--font-body'
   - This allows referencing in Tailwind config
   - Ensures consistent usage across components

6. **Define fallback fonts**
   - Add system font stack as fallback
   - Order: system-ui, -apple-system, sans-serif
   - Ensures text displays during font load

7. **Export font configuration**
   - Export as named constant (e.g., `primaryFont`)
   - Make available for layout component import
   - Document font purpose in comments

### Recommended Body Fonts & Weights

| Font | Best For | Weights | Usage |
|------|----------|---------|-------|
| Inter | Professional e-commerce | 400, 500, 600, 700 | Modern, neutral |
| Open Sans | Consumer stores | 400, 500, 600, 700 | Friendly, readable |
| Roboto | Tech products | 400, 500, 600, 700 | Clean, versatile |
| Lato | Lifestyle products | 400, 500, 600, 700 | Warm, approachable |

### Primary Font Configuration

```
Configure: subsets ['latin'], weight ['400','500','600','700'],
           display 'swap', preload true, variable '--font-body'
           
Apply: <body> element → Inherited by components → Override as needed
```

### Expected Outcome
- Primary body font configured with Next.js optimization
- Multiple weights loaded for typographic hierarchy
- CSS variable created for Tailwind integration
- Font ready for application in root layout

### Verification Checklist
- [ ] Primary font selected and documented
- [ ] Font imported from next/font/google
- [ ] Weights 400, 500, 600, 700 included
- [ ] Display set to 'swap'
- [ ] Subset set to 'latin'
- [ ] CSS variable '--font-body' configured
- [ ] Fallback fonts defined
- [ ] Font exported as named constant
- [ ] TypeScript types correct

---

## Task 21: Create Heading Font

### Overview
Configure and implement the heading font for the webstore. This font will be used for page titles, section headings, hero text, and other prominent typographic elements. Choose a font that provides strong visual hierarchy and complements the primary body font while maintaining brand identity.

### Dependencies
- Task 19: Create Font Configuration
- Task 20: Create Primary Font

### Instructions

1. **Select heading font**
   - Option A: Same as body font (unified typography)
   - Option B: Complementary display font (visual contrast)
   - Consider brand personality and readability
   - Ensure font pairing works harmoniously

2. **Configure font import**
   - Open `styles/fonts/fonts.ts` file
   - Import chosen heading font from next/font/google
   - If same as body font, can reuse configuration

3. **Define heading font weights**
   - Include weight 600 (semi-bold for h3-h6)
   - Include weight 700 (bold for h1-h2)
   - Optional: weight 800 (extra-bold for hero text)
   - Fewer weights needed than body font

4. **Set heading font configuration**
   - Create separate font instance or reuse body
   - Set subsets to ['latin']
   - Set display to 'swap'
   - Configure preload if used on critical pages

5. **Configure CSS variable**
   - Set variable name to '--font-heading'
   - Allows separate styling from body font
   - Enables easy font swapping in future

6. **Define fallback fonts**
   - Use appropriate fallback stack
   - Sans-serif fallback for sans heading fonts
   - Serif fallback for serif heading fonts

7. **Export heading font configuration**
   - Export as named constant (e.g., `headingFont`)
   - Make available for layout and component use
   - Document heading font purpose

### Heading Font Strategy & Usage

| Approach | When to Use | Weights |
|----------|-------------|----------|
| Unified (same as body) | Professional, minimalist | 600 (H3-H6), 700 (H1-H2) |
| Contrast (different family) | Creative, bold brands | 600, 700 |
| Weight Variation | Most e-commerce | 600 (H3-H6), 700 (H1-H2) |

### Heading Font Configuration

```
Unified: Reuse body font variable
Separate: New config with subsets ['latin'], weight ['600','700'],
          display 'swap', preload true, variable '--font-heading'
```

### Expected Outcome
- Heading font configured with proper weights
- Clear typographic hierarchy established
- CSS variable created for flexible usage
- Font pairing harmonizes with body font

### Verification Checklist
- [ ] Heading font selected and documented
- [ ] Font imported or reused from body configuration
- [ ] Weights 600 and 700 included
- [ ] Display set to 'swap'
- [ ] CSS variable '--font-heading' configured
- [ ] Font pairing tested visually
- [ ] Fallback fonts defined
- [ ] Font exported as named constant
- [ ] Typography hierarchy documented

---

## Task 22: Create Font Display Swap

### Overview
Configure font-display swap strategy to prevent Flash of Invisible Text (FOIT) and ensure text remains visible during font loading. This optimization improves perceived performance by showing fallback fonts immediately while custom fonts load in the background, then swapping to the custom font once ready.

### Dependencies
- Task 19: Create Font Configuration
- Task 20: Create Primary Font
- Task 21: Create Heading Font

### Instructions

1. **Understand font-display strategies**
   - Review available options: auto, block, swap, fallback, optional
   - Understand swap behavior and trade-offs
   - Consider user experience implications

2. **Configure display swap for primary font**
   - Open `styles/fonts/fonts.ts` file
   - Locate primary font configuration object
   - Set display property to 'swap'

3. **Configure display swap for heading font**
   - Locate heading font configuration object
   - Set display property to 'swap'
   - Ensure consistency across all fonts

4. **Verify Next.js automatic optimization**
   - Confirm Next.js handles font-display automatically
   - Check that @font-face declarations include display: swap
   - Test in browser DevTools

5. **Configure fallback fonts**
   - Ensure fallback fonts closely match custom fonts
   - Set appropriate font-family fallback stack
   - Consider font metrics for layout shift prevention

6. **Test font loading behavior**
   - Simulate slow network in DevTools
   - Verify fallback font displays immediately
   - Confirm smooth swap to custom font

7. **Document display strategy**
   - Add comments explaining swap behavior
   - Document fallback font choices
   - Note performance benefits

### Font-Display Strategy Comparison

| Strategy | Behavior | Use Case | FOIT Risk | Layout Shift |
|----------|----------|----------|-----------|--------------|
| auto | Browser default | Not recommended | High | Medium |
| block | Wait up to 3s, then swap | Never use | Very High | Low |
| swap | Show fallback, swap immediately | **Recommended** | None | Medium |
| fallback | Wait 100ms, swap for 3s | Critical text | Low | Medium |
| optional | Wait 100ms, use or skip | Non-critical | None | Low |

### Display Behavior

```
SWAP (Good): 0ms → Fallback displays → Font loads → Smooth swap
BLOCK (Bad): 0-3000ms → Invisible text → 3000ms+ → Custom font
```

### Layout Shift Prevention

- Match fallback metrics with size-adjust CSS
- Preload critical fonts
- Use Latin subsets for smaller files
- Consider variable fonts for fewer requests

### Expected Outcome
- Font-display swap configured for all custom fonts
- FOIT eliminated completely
- Text visible immediately on page load
- Smooth font swap when custom fonts ready

### Verification Checklist
- [ ] Primary font display set to 'swap'
- [ ] Heading font display set to 'swap'
- [ ] All custom fonts use swap strategy
- [ ] Fallback fonts configured
- [ ] Font loading tested with slow network
- [ ] No invisible text period observed
- [ ] Font swap occurs smoothly
- [ ] Configuration documented
- [ ] Browser DevTools shows correct font-display

---

## Task 23: Create Font Subset

### Overview
Configure font subsetting to load only the character sets needed for the webstore, significantly reducing font file sizes and improving load times. Focus on Latin character subset for English-based e-commerce, excluding unnecessary glyphs and special characters that increase file size without providing value.

### Dependencies
- Task 19: Create Font Configuration
- Task 20: Create Primary Font
- Task 21: Create Heading Font

### Instructions

1. **Identify required character sets**
   - Determine primary language(s) for webstore
   - Identify if Latin subset is sufficient
   - Consider international character needs
   - Review product name and content requirements

2. **Configure Latin subset for primary font**
   - Open `styles/fonts/fonts.ts` file
   - Locate primary font configuration
   - Set subsets property to ['latin']

3. **Configure Latin subset for heading font**
   - Locate heading font configuration
   - Set subsets property to ['latin']
   - Ensure consistency across fonts

4. **Review subset options**
   - latin: Basic Latin characters (recommended)
   - latin-ext: Extended Latin (European languages)
   - cyrillic: Russian, Ukrainian, etc.
   - greek: Greek characters
   - vietnamese: Vietnamese characters

5. **Verify file size reduction**
   - Check font file sizes in Network tab
   - Compare subset vs full font sizes
   - Document file size improvements

6. **Test character coverage**
   - Verify all product names display correctly
   - Test form inputs and content
   - Ensure no missing characters

7. **Document subset strategy**
   - Add comments explaining subset choice
   - Note file size savings
   - Document any special character needs

### Character Subset Options

| Subset | File Size vs Latin | Use Case |
|--------|-------------------|----------|
| latin | Baseline (smallest) | English content |
| latin-ext | +15% | European languages |
| cyrillic | +25% | Russian, Ukrainian |
| vietnamese | +18% | Vietnamese market |

### File Size Impact (Inter Font Example)

Full font: ~450KB | Latin subset: ~120KB (73% reduction)

### Subsetting Impact on Performance

| Metric | Full Font | Latin Subset | Improvement |
|--------|-----------|--------------|-------------|
| File Size | 450KB | 120KB | 73% smaller |
| Download Time (3G) | 1.8s | 0.5s | 1.3s faster |
| Parse Time | 45ms | 15ms | 30ms faster |
| Memory Usage | 8MB | 2MB | 6MB saved |

### Character Coverage Verification

```
Test Cases:
    ├──> Product names: "Smartphone", "Laptop"
    ├──> Prices: "$1,299.99", "Rs. 50,000"
    ├──> Content: "Free shipping on orders over $50"
    ├──> Form labels: "Email", "Password", "Confirm"
    └──> Special chars: ©, ®, ™, €, £, ¥
```

### Expected Outcome
- Font subsets configured for optimal file size
- Latin subset selected for English webstore
- File sizes reduced by 60-80%
- All required characters display correctly

### Verification Checklist
- [ ] Primary font subset set to ['latin']
- [ ] Heading font subset set to ['latin']
- [ ] File size reduction verified in Network tab
- [ ] All product names display correctly
- [ ] Form content renders properly
- [ ] Special characters tested (©, ®, $, etc.)
- [ ] No missing glyphs observed
- [ ] Subset strategy documented
- [ ] Performance improvement measured

---

## Task 24: Create Font Preload

### Overview
Implement font preloading to prioritize critical font files and reduce font loading time. Preloading instructs the browser to fetch font files early in the page load process, before they are discovered in CSS, improving First Contentful Paint (FCP) and reducing layout shift.

### Dependencies
- Task 19: Create Font Configuration
- Task 20: Create Primary Font
- Task 22: Create Font Display Swap

### Instructions

1. **Understand font preload mechanism**
   - Review <link rel="preload"> functionality
   - Understand preload priority and timing
   - Consider Next.js automatic font preloading

2. **Enable preload in font configuration**
   - Open `styles/fonts/fonts.ts` file
   - Locate primary font configuration object
   - Set preload property to true

3. **Configure preload for heading font**
   - Locate heading font configuration
   - Set preload property to true for above-fold headings
   - Set to false if headings only appear below fold

4. **Verify Next.js automatic preload**
   - Check that Next.js generates preload links
   - Inspect page source for <link rel="preload">
   - Verify correct as="font" and type attributes

5. **Prioritize critical fonts only**
   - Preload primary body font (always visible)
   - Preload heading font if used above fold
   - Don't preload non-critical or decorative fonts

6. **Configure crossorigin attribute**
   - Ensure crossorigin="anonymous" is set
   - Required for font preloading to work
   - Next.js handles this automatically

7. **Test preload effectiveness**
   - Check Network tab waterfall chart
   - Verify fonts load early in page load
   - Measure FCP improvement

### Font Preload Benefits

- Earlier font discovery (starts download sooner)
- Improved FCP (text visible faster)
- Reduced layout shift (font ready before render)
- Better perceived performance

### Preload Impact

```
Without: HTML → CSS → Font URL discovered → Download (late)
With: HTML → Preload discovered → Download starts (early)
```

### Preload Configuration Structure

```
Font Configuration
    │
    ├──> Primary Font
    │    ├── preload: true (always visible)
    │    └── Loads early in page lifecycle
    │
    ├──> Heading Font
    │    ├── preload: true (if above fold)
    │    └── preload: false (if below fold)
    │
    └──> Decorative Fonts
         └── preload: false (low priority)
```

### Critical Font Identification

| Font Type | Preload? | Reasoning |
|-----------|----------|-----------|
| Body font | ✅ Yes | Visible on every page |
| Heading font (hero) | ✅ Yes | Above fold, high priority |
| Heading font (sections) | ⚠️ Maybe | If used above fold |
| Icon font | ❌ No | Not critical for FCP |
| Special display font | ❌ No | Decorative, low priority |

### Network Waterfall Impact

```
Without Preload:
0ms ─────────────────────── HTML
200ms ───────────── CSS
400ms ──────── Font (late discovery)
600ms ── Font download complete

With Preload:
0ms ─────────────────────── HTML
0ms ──────── Font (preload link)
200ms ── Font download complete
200ms ───────────── CSS
```

### Preload Link Structure

```html
<!-- Next.js generates automatically -->
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

### Expected Outcome
- Critical fonts preloaded for faster rendering
- Font files fetched early in page load
- Improved FCP and reduced layout shift
- Next.js automatic preload link generation

### Verification Checklist
- [ ] Primary font preload set to true
- [ ] Heading font preload configured appropriately
- [ ] Preload links generated in page source
- [ ] <link rel="preload"> includes correct attributes
- [ ] crossorigin="anonymous" attribute present
- [ ] Fonts appear early in Network waterfall
- [ ] FCP improvement measured (Lighthouse)
- [ ] No console warnings about preload
- [ ] Only critical fonts preloaded (not all)

---

## Task 25: Create Font Variable

### Overview
Configure CSS custom properties (variables) for fonts to enable consistent font usage across the application and integration with Tailwind CSS. Font variables provide a centralized reference point for fonts, making it easy to apply fonts in components and allowing for potential theming support.

### Dependencies
- Task 20: Create Primary Font
- Task 21: Create Heading Font

### Instructions

1. **Create font variables CSS file**
   - Navigate to `styles/fonts/` directory
   - Create new file named `fontVariables.css`
   - This file defines CSS custom properties for fonts

2. **Define body font variable**
   - Create CSS variable `--font-body`
   - Set value to font family name from Next.js font
   - Include fallback font stack

3. **Define heading font variable**
   - Create CSS variable `--font-heading`
   - Set value to heading font family
   - Include fallback font stack

4. **Apply variables to :root**
   - Define variables in :root selector
   - Ensures global availability throughout app
   - Variables inherit to all elements

5. **Configure Tailwind integration**
   - Open `tailwind.config.ts` file
   - Add custom font families to theme.extend.fontFamily
   - Reference CSS variables using var() syntax

6. **Create Tailwind utility classes**
   - Configure font-body class: font-family: var(--font-body)
   - Configure font-heading class: font-family: var(--font-heading)
   - Classes available throughout components

7. **Apply fonts in root layout**
   - Open `app/layout.tsx` file
   - Apply font variable classes to <html> or <body>
   - Use className from Next.js font object

### CSS Variable Structure

```css
:root {
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-heading: 'Inter', system-ui, -apple-system, sans-serif;
}
```

### Tailwind Configuration Integration

```
tailwind.config.ts
    │
    └──> theme.extend.fontFamily
         ├── body: ['var(--font-body)']
         └── heading: ['var(--font-heading)']
```

### Font Variable Usage Patterns

| Usage Pattern | Implementation | When to Use |
|---------------|----------------|-------------|
| Tailwind classes | `font-body`, `font-heading` | Component styling |
| Direct CSS | `font-family: var(--font-body)` | Custom CSS files |
| Inline styles | `style={{ fontFamily: 'var(--font-body)' }}` | Dynamic styling |

### Font Application Hierarchy

```
Root Layout
    │
    ├──> <html className={primaryFont.variable}>
    │    └──> Defines --font-body variable
    │
    ├──> <body className="font-body">
    │    └──> Applies body font by default
    │
    └──> Components override as needed
         └──> <h1 className="font-heading">
```

### Tailwind Font Classes

| Class | CSS Output | Usage |
|-------|------------|-------|
| font-body | font-family: var(--font-body) | Body text, paragraphs |
| font-heading | font-family: var(--font-heading) | Headings, titles |

### Variable Naming Convention

| Variable Name | Purpose | Scope |
|---------------|---------|-------|
| --font-body | Primary content font | All body text |
| --font-heading | Headings and titles | H1-H6 elements |
| --font-mono | Monospace code font | Code blocks (optional) |
| --font-display | Hero/display font | Large hero text (optional) |

### Expected Outcome
- CSS custom properties created for fonts
- Tailwind configured to use font variables
- Consistent font application across app
- Easy font changes via variable updates

### Verification Checklist
- [ ] `fontVariables.css` file created
- [ ] --font-body variable defined in :root
- [ ] --font-heading variable defined in :root
- [ ] Fallback fonts included in variables
- [ ] Tailwind config updated with font families
- [ ] font-body and font-heading classes available
- [ ] Fonts applied in root layout
- [ ] DevTools shows correct font-family values
- [ ] All components inherit fonts correctly

---

## Task 26: Create Icon Font Optimization

### Overview
Optimize icon usage by implementing tree-shaking for icon libraries, ensuring only used icons are included in the bundle. Use Lucide React or similar tree-shakeable icon library with named imports to dramatically reduce bundle size compared to importing entire icon sets.

### Dependencies
- Task 19: Create Font Configuration
- Frontend build configuration established

### Instructions

1. **Choose icon library**
   - Recommended: Lucide React (tree-shakeable)
   - Alternative: Heroicons, React Icons (with selective imports)
   - Avoid: Font Awesome CDN, entire icon font files

2. **Install icon library**
   - Install Lucide React: `npm install lucide-react`
   - Verify installation in package.json
   - Check library supports tree-shaking

3. **Configure proper import pattern**
   - Use named imports: `import { Home, ShoppingCart } from 'lucide-react'`
   - Never use: `import * as Icons from 'lucide-react'`
   - Document correct import pattern for team

4. **Create icon component wrapper**
   - Create `components/common/Icon.tsx` wrapper (optional)
   - Centralize icon styling (size, color)
   - Ensure wrapper doesn't break tree-shaking

5. **Define icon size standards**
   - Small: 16px (inline text icons)
   - Medium: 24px (standard UI icons)
   - Large: 32px (feature icons)
   - Extra Large: 48px+ (hero sections)

6. **Audit and remove unused icons**
   - Search codebase for icon imports
   - Remove unused icon imports
   - Configure build tools to detect unused imports

7. **Verify bundle size reduction**
   - Build production bundle
   - Check bundle analyzer for icon library size
   - Confirm only imported icons included

### Icon Library Comparison

| Library | Tree-Shakeable | All Icons | 10 Icons | Recommended |
|---------|----------------|-----------|----------|-------------|
| Lucide React | ✅ Yes | 1.2MB | ~15KB | ✅ Best |
| Heroicons | ✅ Yes | 900KB | ~12KB | ✅ Good |
| React Icons | ⚠️ Partial | 2.5MB | ~50KB | ⚠️ Careful |
| Font Awesome | ❌ No | 1.8MB | 1.8MB | ❌ Avoid |

### Icon Import Patterns

```
✅ CORRECT (Tree-shakeable):
import { Home, User, Settings } from 'lucide-react'

❌ WRONG (Imports everything):
import * as Icons from 'lucide-react'
import Icons from 'lucide-react'
```

### Icon Usage Standards

| Context | Size | Import Example |
|---------|------|----------------|
| Inline text | 16px | `<Mail size={16} />` |
| Navigation | 20px | `<Home size={20} />` |
| Buttons | 20px | `<ShoppingCart size={20} />` |
| Feature cards | 32px | `<Truck size={32} />` |
| Hero sections | 48px | `<Package size={48} />` |

### Bundle Size Impact

```
Without Tree-Shaking:
└──> Import all icons: 1.2MB added to bundle

With Tree-Shaking:
└──> Import 20 icons: ~30KB added to bundle
     (97% reduction)
```

### Icon Component Wrapper Pattern

```
Icon Component Structure
    │
    ├──> Accepts icon name or component as prop
    │
    ├──> Applies consistent sizing
    │
    ├──> Applies consistent colors
    │
    └──> Maintains tree-shaking (important!)
```

### Tree-Shaking Verification

| Method | How to Check |
|--------|--------------|
| Bundle analyzer | Visualize included icon code |
| Build logs | Check chunk sizes |
| DevTools | Inspect loaded JavaScript |
| Search bundle | Look for unused icon names |

### Expected Outcome
- Tree-shakeable icon library installed
- Only used icons included in bundle
- Bundle size reduced by 90%+ vs full icon font
- Consistent icon sizing and usage

### Verification Checklist
- [ ] Lucide React or tree-shakeable library installed
- [ ] Named import pattern documented
- [ ] No wildcard icon imports in codebase
- [ ] Icon sizes standardized
- [ ] Bundle analyzer shows only used icons
- [ ] Bundle size improvement verified (90%+ reduction)
- [ ] Icon usage consistent across components
- [ ] Team trained on correct import pattern
- [ ] ESLint rule configured to prevent wildcard imports

---

## Task 27: Create Critical CSS

### Overview
Implement critical CSS inlining to optimize First Contentful Paint (FCP) by including essential above-the-fold styles directly in the HTML. Extract and inline CSS required to render the initial viewport, deferring non-critical styles to load asynchronously after initial render.

### Dependencies
- Task 18: Optimize Images Complete
- Styles directory structure established
- Build configuration accessible

### Instructions

1. **Identify critical above-the-fold content**
   - Analyze homepage and key landing pages
   - Identify visible content without scrolling
   - List components that appear above fold
   - Focus on header, hero, initial product grid

2. **Extract critical styles**
   - Review existing stylesheets and Tailwind classes
   - Identify minimal CSS needed for above-fold render
   - Include layout, fonts, colors for visible content
   - Exclude animations, hover states, below-fold styles

3. **Create critical CSS file**
   - Create `styles/critical.css` file
   - Include minimal styles for initial render
   - Keep file size under 14KB (TCP slow-start window)

4. **Inline critical CSS in layout**
   - Open `app/layout.tsx` root layout file
   - Add <style> tag in <head> with critical CSS
   - Or use Next.js built-in CSS inlining

5. **Configure deferred loading for remaining CSS**
   - Ensure non-critical CSS loads asynchronously
   - Use media="print" onload="this.media='all'" technique
   - Or rely on Next.js automatic code splitting

6. **Optimize critical CSS size**
   - Remove comments and whitespace
   - Minify critical CSS
   - Eliminate duplicate declarations
   - Remove unused selectors

7. **Test critical CSS effectiveness**
   - Measure FCP improvement
   - Use Lighthouse to verify
   - Check that page renders without flash of unstyled content
   - Test on slow connections

### Critical vs Non-Critical CSS

**Include (Critical):** Layout/header/hero, font declarations, above-fold colors, navigation, CTA buttons, product grid (first row)

**Exclude (Non-Critical):** Footer, hover effects, modals, product details pages, below-fold sections

```
Critical CSS Content:
    │
    ├──> Layout & Grid
    │    ├── Container widths
    │    ├── Flexbox/Grid for header
    │    └── Responsive breakpoints
    │
    ├──> Typography
    │    ├── Font-family declarations
    │    ├── Font sizes for headings
    │    └── Line heights
    │
    ├──> Colors & Backgrounds
    │    ├── Brand colors
    │    ├── Background colors
    │    └── Text colors
    │
    └──> Above-Fold Components
         ├── Header/Navigation
         ├── Hero section
         └── First product row
```

### Critical CSS Inlining Approach

```
Page Load Timeline:
    │
    ├──> 0ms: HTML with inlined critical CSS
    │    └──> Page renders immediately
    │
    ├──> ~100ms: Non-critical CSS loads
    │    └──> Additional styles applied
    │
    └──> Result: Fast initial render, complete styles shortly after
```

### Critical CSS Size Guidelines

| Size | Recommendation | Impact |
|------|----------------|--------|
| < 14KB | ✅ Optimal | Fits in first TCP packet |
| 14-50KB | ⚠️ Acceptable | Requires multiple packets |
| > 50KB | ❌ Too large | Defeats purpose of inlining |

### Critical CSS Extraction Methods

| Method | Approach | Complexity |
|--------|----------|------------|
| Manual | Hand-select critical styles | High effort, precise |
| Automated tool | Use Critical, Critters, etc. | Low effort, may include extra |
| Next.js automatic | Built-in optimization | No effort, good default |

### Deferred CSS Loading Pattern

```html
<!-- Critical CSS inlined in <style> tag -->
<style>
  /* Critical CSS here (14KB max) */
</style>

<!-- Non-critical CSS deferred -->
<link
  rel="stylesheet"
  href="/styles/main.css"
  media="print"
  onload="this.media='all'"
/>
```

### Expected Outcome
- Critical CSS identified and extracted
- Above-the-fold content renders immediately
- FCP improved by 20-40%
- No flash of unstyled content

### Verification Checklist
- [ ] Above-the-fold content identified
- [ ] Critical CSS extracted to separate file
- [ ] Critical CSS size under 14KB
- [ ] Critical CSS inlined in HTML head
- [ ] Non-critical CSS deferred
- [ ] Page renders without FOUC
- [ ] FCP measured and improved
- [ ] Lighthouse score improved
- [ ] Tested on slow 3G connection

---

## Task 28: Create CSS Loading Strategy

### Overview
Establish a comprehensive CSS loading strategy that balances performance with maintainability. Configure how Tailwind CSS, component styles, and critical CSS are loaded and optimized, implementing lazy loading for non-critical styles and ensuring efficient CSS delivery.

### Dependencies
- Task 27: Create Critical CSS

### Instructions

1. **Configure Tailwind CSS purging**
   - Open `tailwind.config.ts` file
   - Verify content paths include all component files
   - Ensure unused Tailwind classes removed in production
   - Configure safelist for dynamic classes

2. **Implement CSS code splitting**
   - Configure Next.js to split CSS by route
   - Ensure each page loads only required CSS
   - Verify automatic CSS chunking

3. **Set up CSS module strategy**
   - Decide on global vs scoped styles approach
   - Use CSS Modules for component-specific styles
   - Use global styles for app-wide defaults

4. **Configure CSS compression**
   - Ensure CSS minification enabled in production
   - Configure cssnano or similar minifier
   - Verify Next.js automatic CSS optimization

5. **Implement CSS caching strategy**
   - Configure long-term caching headers for CSS files
   - Use content hashing in CSS filenames
   - Verify Next.js automatic cache busting

6. **Order CSS loading priority**
   - Critical CSS: Inline in HTML (Task 27)
   - Framework CSS: Preload if needed
   - Component CSS: Load per route
   - Non-critical CSS: Defer loading

7. **Test CSS loading performance**
   - Measure CSS file sizes in production build
   - Check Network tab for CSS loading order
   - Verify no render-blocking CSS
   - Test CSS caching behavior

### CSS Loading Priority

| Priority | CSS Type | Loading Method | When |
|----------|----------|----------------|------|
| 1. Critical | Above-fold styles | Inline in HTML | Immediate |
| 2. Framework | Tailwind base/utilities | Automatic split | Per route |
| 3. Component | Scoped component CSS | Automatic split | Per route |
| 4. Non-critical | Below-fold styles | Deferred | After initial render |

### Tailwind CSS Purging Configuration

```
Purging Strategy:
    │
    ├──> Development: All classes available
    │
    └──> Production: Purge unused classes
         ├── Scan: All component files
         ├── Keep: Used classes only
         └── Result: 90%+ size reduction
```

### CSS Code Splitting

```
Route-Based Splitting:
    │
    ├──> / (Homepage)
    │    └──> main.css (100KB)
    │
    ├──> /products
    │    └──> products.css (50KB)
    │
    └──> /checkout
         └──> checkout.css (30KB)

Without Splitting:
    │
    └──> All routes load: global.css (250KB)
```

### CSS Loading Strategy Matrix

| CSS Type | Global | Scoped | Inline | Lazy |
|----------|--------|--------|--------|------|
| Reset/Normalize | ✅ | ❌ | ✅ | ❌ |
| Tailwind Base | ✅ | ❌ | ✅ | ❌ |
| Critical Styles | ✅ | ❌ | ✅ | ❌ |
| Component Styles | ❌ | ✅ | ❌ | ✅ |
| Theme Variables | ✅ | ❌ | ✅ | ❌ |
| Animations | ❌ | ✅ | ❌ | ✅ |

### CSS File Size Optimization

```
Before Optimization:
└──> Tailwind (all classes): 3.5MB

After Purging:
└──> Tailwind (used only): 15KB (99% reduction)

After Minification:
└──> Tailwind (gzipped): 5KB (final size)
```

### CSS Caching Strategy

| File Type | Cache Duration | Versioning |
|-----------|----------------|------------|
| CSS with hash | 1 year | Content hash in filename |
| CSS without hash | No cache | Always revalidate |
| Critical CSS | No cache | Inlined in HTML |

### CSS Loading Order

```
Page Load Sequence:
    │
    ├──> 1. Inline critical CSS
    │    └──> Page renders
    │
    ├──> 2. Route-specific CSS (automatic)
    │    └──> Component styles applied
    │
    └──> 3. Deferred non-critical CSS
         └──> Full styling complete
```

### Expected Outcome
- Optimized CSS loading strategy implemented
- Tailwind CSS purged to minimal size
- Route-based CSS code splitting active
- Efficient caching configured

### Verification Checklist
- [ ] Tailwind purging configured correctly
- [ ] CSS code splitting enabled
- [ ] Production CSS files minified
- [ ] CSS filenames include content hash
- [ ] No render-blocking CSS (except critical)
- [ ] CSS file sizes optimized (check Network tab)
- [ ] Unused Tailwind classes removed (99% reduction)
- [ ] CSS caching working (check response headers)
- [ ] CSS loads in correct priority order
- [ ] Total CSS payload under 50KB (gzipped)

---

## Summary

This document established comprehensive font and CSS optimization for the webstore. Font configuration uses Next.js font optimization with display swap and subsetting for optimal loading. CSS strategy implements critical CSS inlining, tree-shakeable icons, and efficient loading patterns to minimize render-blocking resources and improve perceived performance.

### Completed Tasks
1. ✓ Created font configuration foundation with Next.js
2. ✓ Configured primary body font with proper weights
3. ✓ Configured heading font for typography hierarchy
4. ✓ Implemented font-display swap to prevent FOIT
5. ✓ Configured font subsetting for smaller file sizes
6. ✓ Enabled font preloading for faster rendering
7. ✓ Created CSS font variables for consistency
8. ✓ Optimized icon fonts with tree-shaking
9. ✓ Implemented critical CSS inlining
10. ✓ Established comprehensive CSS loading strategy

### Performance Improvements
- Font file sizes reduced by 70%+ through subsetting
- FOIT eliminated with display swap
- Icon bundle reduced by 90%+ with tree-shaking
- Critical CSS enables instant above-fold render
- CSS payload minimized through purging and splitting

### Next Steps
Proceed to [02_Tasks-29-36_Loading-Skeletons-Verify.md](02_Tasks-29-36_Loading-Skeletons-Verify.md) to create loading states, page transitions, skeleton components, React Suspense boundaries, and verify font loading performance.
