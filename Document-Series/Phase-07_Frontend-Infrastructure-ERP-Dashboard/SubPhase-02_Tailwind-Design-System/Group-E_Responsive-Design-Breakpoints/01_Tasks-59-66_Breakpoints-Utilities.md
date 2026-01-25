# Tasks 59-66: Screen Breakpoints and Responsive Utilities

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** E - Responsive Design & Breakpoints  
> **Document:** 01 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-67-72_Patterns-Print-Docs.md](02_Tasks-67-72_Patterns-Print-Docs.md)

---

## Document Overview

This document configures the responsive breakpoint system and creates foundational responsive utilities for the ERP dashboard. Establishes mobile-first breakpoints from tablet to ultra-wide screens. Creates responsive utility patterns for typography, spacing, and layout that adapt across device sizes. Ensures consistent responsive behavior throughout the application using Tailwind's mobile-first approach.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Configure Screen Breakpoints | Low | 10 min |
| 60 | Configure Tablet Breakpoint (md) | Low | 5 min |
| 61 | Configure Desktop Breakpoint (lg) | Low | 5 min |
| 62 | Configure Wide Desktop Breakpoint (xl) | Low | 5 min |
| 63 | Configure 2XL Breakpoint | Low | 5 min |
| 64 | Create Mobile-First Utilities | Low | 15 min |
| 65 | Create Responsive Typography Utilities | Low | 20 min |
| 66 | Create Responsive Spacing Utilities | Low | 20 min |

---

## Task 59: Configure Screen Breakpoints

### Overview
Configure the screen breakpoint system in Tailwind configuration. Establishes the foundation for responsive design using Tailwind's default breakpoint scale with mobile-first approach. These breakpoints define when layouts and styles should adapt to different screen sizes, from mobile phones to ultra-wide desktop monitors.

### Dependencies
- Task 02: Base Tailwind configuration file exists
- Frontend project structure established

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the theme.screens configuration section

2. **Add screens configuration object**
   - Add screens property to theme configuration
   - Will contain all breakpoint definitions
   - Use Tailwind's mobile-first min-width approach

3. **Document breakpoint strategy**
   - Add comment explaining mobile-first approach
   - Note that base styles apply to mobile
   - Breakpoint prefixes apply styles at minimum width and above

4. **Verify mobile-first understanding**
   - Confirm team understands default (no prefix) = mobile
   - Confirm breakpoint prefixes apply from that size up
   - Example: `md:text-lg` applies at 768px and above

5. **Prepare for breakpoint values**
   - Structure ready for specific breakpoint definitions
   - Will add sm, md, lg, xl, 2xl in subsequent tasks

### Mobile-First Approach Concept

```
Mobile-First Responsive Design
═══════════════════════════════

Base Styles (No Prefix)
   │
   │  Applied to ALL screen sizes
   ▼
┌─────────────────────────────────────────┐
│        Default: Mobile Styles           │
│        (320px - 767px)                  │
└─────────────────────────────────────────┘
            │
            │  md: breakpoint (768px+)
            ▼
┌─────────────────────────────────────────┐
│         Tablet Styles Override          │
│        (768px - 1023px)                 │
└─────────────────────────────────────────┘
            │
            │  lg: breakpoint (1024px+)
            ▼
┌─────────────────────────────────────────┐
│        Desktop Styles Override          │
│        (1024px - 1279px)                │
└─────────────────────────────────────────┘
            │
            │  xl: breakpoint (1280px+)
            ▼
┌─────────────────────────────────────────┐
│      Wide Desktop Styles Override       │
│        (1280px - 1535px)                │
└─────────────────────────────────────────┘
            │
            │  2xl: breakpoint (1536px+)
            ▼
┌─────────────────────────────────────────┐
│     Ultra-Wide Desktop Override         │
│        (1536px and above)               │
└─────────────────────────────────────────┘
```

### Breakpoint Cascade Example

```
Style Application Flow
══════════════════════

HTML Element:
<div class="text-sm md:text-base lg:text-lg xl:text-xl">

Screen Size 375px (Mobile):
  └─► text-sm applied (base style)

Screen Size 768px (Tablet):
  └─► md:text-base applied (overrides text-sm)

Screen Size 1024px (Desktop):
  └─► lg:text-lg applied (overrides md:text-base)

Screen Size 1280px (Wide Desktop):
  └─► xl:text-xl applied (overrides lg:text-lg)
```

### Breakpoint System Architecture

```
┌──────────────────────────────────────────────────────────┐
│              Tailwind Breakpoint System                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  sm:  640px   │  Large phones in landscape              │
│  md:  768px   │  Tablets in portrait                    │
│  lg:  1024px  │  Tablets landscape / Small desktops     │
│  xl:  1280px  │  Desktop monitors                       │
│  2xl: 1536px  │  Large desktop monitors                 │
│                                                          │
└──────────────────────────────────────────────────────────┘

Device Coverage:
├─ Mobile (default): 320px - 639px
├─ Large Mobile (sm): 640px - 767px
├─ Tablet (md): 768px - 1023px
├─ Desktop (lg): 1024px - 1279px
├─ Wide Desktop (xl): 1280px - 1535px
└─ Ultra-Wide (2xl): 1536px+
```

### Configuration Structure

| Breakpoint | Prefix | Min Width | Target Devices |
|------------|--------|-----------|----------------|
| sm | `sm:` | 640px | Large phones (landscape) |
| md | `md:` | 768px | Tablets (portrait) |
| lg | `lg:` | 1024px | Tablets (landscape), small laptops |
| xl | `xl:` | 1280px | Desktop monitors |
| 2xl | `2xl:` | 1536px | Large desktop monitors |

### Usage Philosophy

| Design Principle | Implementation |
|-----------------|----------------|
| Start Mobile | Write base styles without prefixes |
| Add Breakpoints | Layer responsive overrides progressively |
| Content-Based | Choose breakpoints where content needs to adapt |
| Device-Agnostic | Focus on layout needs, not specific devices |
| Performance | Minimize breakpoint complexity |

### Common Responsive Patterns

#### Pattern 1: Progressive Enhancement
```
Base Style → Tablet Enhancement → Desktop Enhancement

Example: Padding
  p-4           → md:p-6           → lg:p-8
  (mobile)        (tablet+)          (desktop+)
```

#### Pattern 2: Layout Changes
```
Stacked → Two Column → Three Column

Example: Grid
  grid-cols-1   → md:grid-cols-2   → lg:grid-cols-3
  (mobile)        (tablet+)          (desktop+)
```

#### Pattern 3: Visibility Control
```
Hidden → Visible → Different Layout

Example: Sidebar
  hidden        → md:block         → lg:w-64
  (mobile)        (tablet+)          (desktop+)
```

### Expected Outcome
- Breakpoint system configured in Tailwind
- Mobile-first approach established
- Foundation for responsive utilities
- Clear breakpoint strategy documented

### Verification Checklist
- [ ] tailwind.config.js opened
- [ ] theme.screens section identified
- [ ] Mobile-first approach documented in comments
- [ ] Configuration structure prepared
- [ ] Team understands cascade behavior
- [ ] Configuration validated

---

## Task 60: Configure Tablet Breakpoint (md)

### Overview
Configure the tablet breakpoint at 768px, targeting tablet devices in portrait orientation and larger mobile devices in landscape. This is a critical breakpoint where layouts typically transition from single-column mobile layouts to multi-column layouts, and where navigation patterns change from mobile drawers to expanded menus.

### Dependencies
- Task 59: Configure Screen Breakpoints

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate theme.screens configuration

2. **Add md breakpoint definition**
   - Set breakpoint name as 'md'
   - Set value to '768px'
   - This becomes the md: prefix in classes

3. **Document tablet breakpoint purpose**
   - Add comment explaining tablet target
   - Note typical use cases (2-column layouts, expanded navigation)
   - Document affected components

4. **Understand tablet design implications**
   - Sidebar can be partially visible (collapsed with icons)
   - Tables can show more columns
   - Forms can use 2-column layouts
   - Cards can display in 2-column grid

5. **Note tablet-specific patterns**
   - Document when to use md: prefix
   - List common md: utilities for ERP

### Tablet Breakpoint Context

```
Tablet Breakpoint (md: 768px)
══════════════════════════════

Device Coverage:
├─ iPad (portrait): 768px × 1024px
├─ iPad Mini (portrait): 768px × 1024px
├─ Android tablets (portrait): 768px - 800px
├─ Large phones (landscape): 740px - 850px
└─ Small tablets: 768px - 900px

Primary Use Cases:
├─ Transform mobile drawer → collapsed sidebar
├─ Single column → 2-column layouts
├─ Stack → side-by-side forms
└─ Full-width → constrained content width
```

### Tablet Layout Transformations

```
Mobile (< 768px)                 Tablet (≥ 768px)
═════════════════                ═════════════════

┌─────────────────┐              ┌───┬─────────────────────┐
│   [☰] Header    │              │ 🔲│    Header           │
├─────────────────┤              ├───┼─────────────────────┤
│                 │              │   │                     │
│   Content       │              │ S │    Content          │
│   Full Width    │              │ i │    2-Column         │
│                 │    ═══►      │ d │    Layout           │
│   Stacked       │              │ e │                     │
│   Cards         │              │ b │    Card   Card      │
│                 │              │ a │                     │
│   [Card 1]      │              │ r │    Card   Card      │
│   [Card 2]      │              │   │                     │
│   [Card 3]      │              │   │                     │
└─────────────────┘              └───┴─────────────────────┘

  Mobile Drawer                      Collapsed Sidebar
  Single Column                      Icon Navigation
  Stacked Cards                      2-Column Grid
```

### Tablet Breakpoint Use Cases

| Component | Mobile (< 768px) | Tablet (md: ≥ 768px) |
|-----------|------------------|----------------------|
| Navigation | Hidden drawer (hamburger) | Collapsed sidebar (icons only) |
| Content Width | Full width (p-4) | Constrained (max-w-4xl, p-6) |
| Form Layout | Single column | 2-column (grid-cols-2) |
| Card Grid | 1 column | 2 columns |
| Table | Horizontal scroll | More visible columns |
| Typography | text-sm | text-base |
| Spacing | p-4, gap-4 | p-6, gap-6 |
| Buttons | Full width | Auto width |

### Common md: Patterns for ERP

#### Navigation Pattern
```
Mobile:          hidden
Tablet:          md:flex md:w-16 (collapsed, icons)
Desktop:         lg:w-64 (expanded, icons + text)
```

#### Content Container Pattern
```
Mobile:          w-full px-4
Tablet:          md:max-w-3xl md:mx-auto md:px-6
Desktop:         lg:max-w-7xl lg:px-8
```

#### Form Grid Pattern
```
Mobile:          grid-cols-1 gap-4
Tablet:          md:grid-cols-2 md:gap-6
Desktop:         lg:grid-cols-3 lg:gap-8
```

#### Card Grid Pattern
```
Mobile:          grid-cols-1
Tablet:          md:grid-cols-2
Desktop:         lg:grid-cols-3
Wide Desktop:    xl:grid-cols-4
```

### Tablet-Specific Component Behavior

| Component | Tablet Behavior |
|-----------|-----------------|
| Dashboard Cards | 2-column grid, summary metrics visible |
| Data Tables | Show 4-6 columns, horizontal scroll for more |
| Forms | Two columns for related fields |
| Modals | Wider, more content visible |
| Charts | Larger, more detailed |
| Search Bars | Inline with filters |
| Action Buttons | Grouped in button bars |
| Breadcrumbs | Fully visible |

### Tablet Typography Scale

| Element | Mobile | Tablet (md:) |
|---------|--------|--------------|
| Page Title (H1) | text-2xl | md:text-3xl |
| Section Title (H2) | text-xl | md:text-2xl |
| Subsection (H3) | text-lg | md:text-xl |
| Body Text | text-sm | md:text-base |
| Small Text | text-xs | md:text-sm |

### Tablet Spacing Scale

| Element | Mobile | Tablet (md:) |
|---------|--------|--------------|
| Page Padding | p-4 | md:p-6 |
| Section Gap | gap-4 | md:gap-6 |
| Card Padding | p-4 | md:p-5 |
| Form Gap | gap-4 | md:gap-6 |
| Button Padding | px-4 py-2 | md:px-5 md:py-2.5 |

### Expected Outcome
- Tablet breakpoint configured at 768px
- md: prefix available for responsive classes
- Clear understanding of tablet layout patterns
- Documentation of tablet-specific behaviors

### Verification Checklist
- [ ] md breakpoint set to '768px'
- [ ] Configuration validated
- [ ] Tablet use cases documented
- [ ] Common md: patterns identified
- [ ] Component behaviors defined
- [ ] Typography and spacing scales noted

---

## Task 61: Configure Desktop Breakpoint (lg)

### Overview
Configure the desktop breakpoint at 1024px, targeting desktop monitors and laptops. This breakpoint represents the transition to full desktop experience where sidebars can be fully expanded, layouts can use 3+ columns, and all features are accessible without compromise. The primary workspace for most ERP users.

### Dependencies
- Task 59: Configure Screen Breakpoints

### Instructions

1. **Open Tailwind configuration file**
   - Continue in `frontend/tailwind.config.js`
   - Locate theme.screens configuration

2. **Add lg breakpoint definition**
   - Set breakpoint name as 'lg'
   - Set value to '1024px'
   - This becomes the lg: prefix in classes

3. **Document desktop breakpoint purpose**
   - Add comment explaining desktop target
   - Note typical use cases (3-column layouts, full sidebar)
   - Document enhanced features available

4. **Understand desktop design implications**
   - Full sidebar with icons and text
   - 3-column content layouts
   - Side panels can be visible
   - Enhanced data tables with all columns
   - Multi-panel dashboards

5. **Note desktop-specific patterns**
   - Document when to use lg: prefix
   - List common lg: utilities for ERP
   - Define desktop-optimized experiences

### Desktop Breakpoint Context

```
Desktop Breakpoint (lg: 1024px)
════════════════════════════════

Device Coverage:
├─ Laptops: 1024px - 1440px
├─ Desktop monitors: 1024px - 1920px
├─ iPad Pro (landscape): 1024px × 1366px
├─ Tablet (landscape): 1024px - 1280px
└─ Small desktop monitors: 1024px - 1280px

Primary Use Cases:
├─ Full expanded sidebar (icons + labels)
├─ 3-column layouts
├─ Side panels and drawers
├─ Full data tables
└─ Multi-panel dashboards
```

### Desktop Layout Transformations

```
Tablet (< 1024px)                Desktop (≥ 1024px)
══════════════════               ═══════════════════

┌───┬─────────────┐              ┌───────┬───────────────┬──────┐
│ 🔲│   Header    │              │ Side  │    Header     │Filter│
├───┼─────────────┤              ├───────┼───────────────┼──────┤
│ S │             │              │  📁   │               │      │
│ i │  Content    │              │  📄   │   Content     │ 📊   │
│ d │  2-Column   │              │  ⚙️   │   3-Column    │ 🔍   │
│ e │             │    ═══►      │  📊   │               │ 🔔   │
│ b │ Card  Card  │              │  👤   │  Card  Card  │      │
│ a │             │              │       │     Card      │Panel │
│ r │ Card  Card  │              │ Full  │               │      │
│   │             │              │ Nav   │  Card  Card  │Side  │
│   │             │              │       │     Card      │Info  │
└───┴─────────────┘              └───────┴───────────────┴──────┘

Icon Sidebar                      Full Sidebar + Side Panel
2-Column Grid                     3-Column Layout
Hidden Side Info                  Visible Filter Panel
```

### Desktop Breakpoint Use Cases

| Component | Tablet (< 1024px) | Desktop (lg: ≥ 1024px) |
|-----------|-------------------|------------------------|
| Sidebar | Collapsed (icons) | Expanded (icons + text) lg:w-64 |
| Content Width | Constrained | Full width with margins lg:max-w-7xl |
| Grid Layout | 2 columns | 3 columns lg:grid-cols-3 |
| Data Tables | Scrollable | All columns visible |
| Dashboard Cards | 2 columns | 3-4 columns lg:grid-cols-4 |
| Filters | Modal/drawer | Persistent side panel lg:block |
| Typography | text-base | lg:text-lg for headings |
| Spacing | p-6, gap-6 | lg:p-8, lg:gap-8 |

### Common lg: Patterns for ERP

#### Full Sidebar Pattern
```
Mobile:          hidden
Tablet:          md:flex md:w-16
Desktop:         lg:w-64 (expanded with text)
```

#### Three-Column Layout Pattern
```
Mobile:          grid-cols-1
Tablet:          md:grid-cols-2
Desktop:         lg:grid-cols-3
```

#### Side Panel Pattern
```
Mobile:          hidden (modal on demand)
Tablet:          md:hidden
Desktop:         lg:block lg:w-80 (persistent panel)
```

#### Dashboard Grid Pattern
```
Mobile:          grid-cols-1
Tablet:          md:grid-cols-2
Desktop:         lg:grid-cols-4
```

### Desktop-Specific Component Behavior

| Component | Desktop Behavior |
|-----------|-----------------|
| Sidebar | Fully expanded, icons + text, 256px width |
| Dashboard | 3-4 column grid, all widgets visible |
| Data Tables | All columns visible, no horizontal scroll |
| Forms | 2-3 column layouts with related fields |
| Modals | Larger, max-w-4xl, more information |
| Charts | Full size, detailed legends visible |
| Filter Panels | Persistent side panels, always visible |
| Breadcrumbs | Full path visible |
| Search | Expanded with advanced filters inline |
| Toolbars | All actions visible, no overflow menu |

### Desktop Typography Scale

| Element | Tablet (md:) | Desktop (lg:) |
|---------|--------------|---------------|
| Page Title (H1) | md:text-3xl | lg:text-4xl |
| Section Title (H2) | md:text-2xl | lg:text-3xl |
| Subsection (H3) | md:text-xl | lg:text-2xl |
| Body Text | md:text-base | lg:text-base (same) |
| Small Text | md:text-sm | lg:text-sm (same) |
| Table Headers | md:text-sm | lg:text-base |

### Desktop Spacing Scale

| Element | Tablet (md:) | Desktop (lg:) |
|---------|--------------|---------------|
| Page Padding | md:p-6 | lg:p-8 |
| Section Gap | md:gap-6 | lg:gap-8 |
| Card Padding | md:p-5 | lg:p-6 |
| Grid Gap | md:gap-6 | lg:gap-8 |
| Container Max Width | md:max-w-4xl | lg:max-w-7xl |

### Desktop ERP-Specific Layouts

#### Dashboard Layout
```
┌───────┬─────────────────────────────────────┬────────┐
│       │         Dashboard Header            │ User   │
├───────┼─────────────────────────────────────┼────────┤
│  📁   │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐│ 🔔    │
│  📄   │  │Card │  │Card │  │Card │  │Card ││ 📊    │
│  ⚙️   │  └─────┘  └─────┘  └─────┘  └─────┘│ Quick │
│  📊   │  ┌───────────────┐  ┌──────────────┐│ Stats │
│  👤   │  │  Chart Area   │  │  Sales Chart ││       │
│       │  └───────────────┘  └──────────────┘│       │
│  Nav  │  ┌────────────────────────────────┐ │       │
│  Bar  │  │     Recent Transactions        │ │       │
│       │  └────────────────────────────────┘ │       │
└───────┴─────────────────────────────────────┴────────┘

Sidebar: 256px (lg:w-64)
Main: Flexible width
Right Panel: 320px (lg:w-80)
```

#### Data Table Layout
```
┌───────┬─────────────────────────────────────────────┐
│       │    Inventory Management          [+ Add]    │
├───────┼─────────────────────────────────────────────┤
│  📁   │ ┌─────────────────────────────────────────┐ │
│  📄   │ │ Product │ SKU │ Qty │ Price │ Status │├ │
│  ⚙️   │ ├─────────────────────────────────────────┤ │
│  📊   │ │ Item 1  │ ... │ ... │ ...   │ Active │├ │
│  👤   │ │ Item 2  │ ... │ ... │ ...   │ Active │├ │
│       │ │ Item 3  │ ... │ ... │ ...   │ Low    │├ │
│  Full │ └─────────────────────────────────────────┘ │
│  Nav  │             [1] [2] [3] ... [10]            │
└───────┴─────────────────────────────────────────────┘

All columns visible
No horizontal scroll
Full sidebar navigation
```

### Expected Outcome
- Desktop breakpoint configured at 1024px
- lg: prefix available for responsive classes
- Full desktop experience patterns documented
- Enhanced ERP layouts defined

### Verification Checklist
- [ ] lg breakpoint set to '1024px'
- [ ] Configuration validated
- [ ] Desktop use cases documented
- [ ] Common lg: patterns identified
- [ ] Component behaviors defined
- [ ] Typography and spacing scales noted
- [ ] ERP-specific layouts documented

---

## Task 62: Configure Wide Desktop Breakpoint (xl)

### Overview
Configure the wide desktop breakpoint at 1280px, targeting larger desktop monitors and widescreen displays. This breakpoint enables 4-column layouts, expanded dashboards with more widgets, and additional information density for power users. Optimizes for maximum information display while maintaining readability.

### Dependencies
- Task 59: Configure Screen Breakpoints

### Instructions

1. **Open Tailwind configuration file**
   - Continue in `frontend/tailwind.config.js`
   - Locate theme.screens configuration

2. **Add xl breakpoint definition**
   - Set breakpoint name as 'xl'
   - Set value to '1280px'
   - This becomes the xl: prefix in classes

3. **Document wide desktop breakpoint purpose**
   - Add comment explaining wide screen target
   - Note typical use cases (4-column layouts, more widgets)
   - Document information density optimizations

4. **Understand wide desktop implications**
   - 4+ column dashboard grids
   - Additional side panels can be shown
   - Wider content containers
   - More table columns visible
   - Enhanced multi-panel layouts

5. **Note wide desktop patterns**
   - Document when to use xl: prefix
   - List common xl: utilities
   - Define power user optimizations

### Wide Desktop Breakpoint Context

```
Wide Desktop Breakpoint (xl: 1280px)
═════════════════════════════════════

Device Coverage:
├─ Wide desktop monitors: 1280px - 1920px
├─ 15" - 17" laptops: 1280px - 1440px
├─ 24" monitors: 1920px × 1080px
├─ 27" monitors: 2560px × 1440px
└─ Ultrawide monitors: 2560px - 3440px

Primary Use Cases:
├─ 4-column layouts
├─ Multiple side panels
├─ Expanded dashboards
├─ More visible data
└─ Power user features
```

### Wide Desktop Layout Transformations

```
Desktop (< 1280px)                Wide Desktop (≥ 1280px)
══════════════════                ════════════════════════

┌───────┬───────────────┐         ┌──────┬──────────────────┬──────┬──────┐
│ Side  │    Header     │         │ Side │     Header       │Panel │Search│
├───────┼───────────────┤         ├──────┼──────────────────┼──────┼──────┤
│  📁   │               │         │  📁  │                  │ 📊   │ 🔍  │
│  📄   │   Content     │         │  📄  │    Content       │ Info │ Fil- │
│  ⚙️   │   3-Column    │         │  ⚙️  │    4-Column      │ Stats│ ters│
│  📊   │               │ ═══►    │  📊  │                  │ Quick│      │
│  👤   │ Card  Card    │         │  👤  │ Card Card Card   │ Acts │Panel │
│       │    Card       │         │      │    Card          │      │      │
│ Full  │               │         │ Full │ Card Card Card   │Right │Side  │
│ Nav   │ Card  Card    │         │ Nav  │    Card          │ Info │Info  │
└───────┴───────────────┘         └──────┴──────────────────┴──────┴──────┘

3-Column Layout                    4-Column + Dual Panels
Single Side Panel                  Multiple Information Panels
```

### Wide Desktop Breakpoint Use Cases

| Component | Desktop (< 1280px) | Wide Desktop (xl: ≥ 1280px) |
|-----------|-------------------|----------------------------|
| Dashboard Grid | 3 columns lg:grid-cols-3 | 4 columns xl:grid-cols-4 |
| Content Width | max-w-7xl | xl:max-w-[1440px] |
| Side Panels | 1 panel | 2 panels (left + right) |
| Table Columns | 6-8 columns | 10+ columns visible |
| Cards per Row | 3 cards | 4 cards |
| Spacing | gap-8 | xl:gap-10 |
| Container | lg:max-w-7xl | xl:max-w-[1440px] |
| Typography | lg:text-lg | xl:text-xl (headings only) |

### Common xl: Patterns for ERP

#### Four-Column Dashboard Pattern
```
Mobile:          grid-cols-1
Tablet:          md:grid-cols-2
Desktop:         lg:grid-cols-3
Wide Desktop:    xl:grid-cols-4
```

#### Dual Side Panels Pattern
```
<div class="flex">
  <aside class="lg:w-64">Sidebar</aside>
  <main class="flex-1">Content</main>
  <aside class="hidden xl:block xl:w-80">Right Panel</aside>
</div>
```

#### Expanded Container Pattern
```
Mobile:          w-full px-4
Tablet:          md:max-w-4xl md:mx-auto
Desktop:         lg:max-w-7xl
Wide Desktop:    xl:max-w-[1440px]
```

#### Enhanced Grid Pattern
```
Desktop:         lg:grid-cols-3 lg:gap-8
Wide Desktop:    xl:grid-cols-4 xl:gap-10
```

### Wide Desktop Component Behavior

| Component | Wide Desktop Behavior |
|-----------|----------------------|
| Dashboard | 4-column grid, 8-12 widgets visible |
| Data Tables | 10-15 columns visible, no scroll |
| Forms | 3-4 column layouts |
| Modals | max-w-6xl, extensive information |
| Charts | Maximum size, all details visible |
| Filter Panels | Persistent + additional side panel |
| Product Grids | 4-5 items per row |
| Reports | Full width, multi-column layouts |
| Timelines | Extended view with more items |
| Activity Feeds | Side panel always visible |

### Wide Desktop Information Density

```
Standard Desktop Layout          Wide Desktop Layout
═══════════════════════          ═══════════════════

Widget Density:                  Widget Density:
├─ Dashboard: 6-9 cards          ├─ Dashboard: 8-16 cards
├─ Tables: 6-8 columns           ├─ Tables: 10-15 columns
├─ Grid: 3 items/row             ├─ Grid: 4-5 items/row
└─ Panels: 1 side panel          └─ Panels: 2-3 side panels

Use Case: Efficient workflow     Use Case: Power users, analysts
```

### Wide Desktop ERP Layouts

#### Advanced Dashboard
```
┌──────┬────────────────────────────────────┬──────┬──────┐
│  📁  │         ERP Dashboard              │ 📊   │ 🔍  │
├──────┼────────────────────────────────────┼──────┼──────┤
│  📄  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │ Qk   │ Adv  │
│  ⚙️  │ │Card│ │Card│ │Card│ │Card│       │ Stats│ Fltr │
│  📊  │ └────┘ └────┘ └────┘ └────┘       │      │      │
│  👤  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │ • Rev│ Date │
│  🏪  │ │Card│ │Card│ │Card│ │Card│       │ • Ord│ Range│
│  💰  │ └────┘ └────┘ └────┘ └────┘       │ • Inv│      │
│  📦  │ ┌──────────────┐ ┌──────────────┐ │ • Usr│ Cat  │
│      │ │   Chart 1    │ │   Chart 2    │ │      │ List │
│ Full │ └──────────────┘ └──────────────┘ │ Panel│      │
│ Nav  │ ┌────────────────────────────────┐│      │Search│
│ 256  │ │   Recent Transactions Table    ││ 320  │ 280  │
└──────┴────────────────────────────────────┴──────┴──────┘

4-column card grid
2-column chart area
Right info panel + filter panel
```

#### Full-Width Data Table
```
┌──────┬──────────────────────────────────────────────┬──────┐
│  📁  │    Inventory - All Products        [+ Add]   │ Info │
├──────┼──────────────────────────────────────────────┼──────┤
│  📄  │ ┌────────────────────────────────────────┐   │ 📊   │
│  ⚙️  │ │ID│SKU│Product│Cat│Qty│Price│Cost│Stat│   │ Sel  │
│  📊  │ ├────────────────────────────────────────┤   │ Item │
│  👤  │ │..│...│.......│...│...│.....│....│....│   │      │
│      │ │..│...│.......│...│...│.....│....│....│   │ Qk   │
│ Full │ │..│...│.......│...│...│.....│....│....│   │ Edit │
│ Nav  │ └────────────────────────────────────────┘   │      │
└──────┴──────────────────────────────────────────────┴──────┘

10+ columns visible
No horizontal scroll
Side info panel
```

### Wide Desktop Typography Scale

| Element | Desktop (lg:) | Wide Desktop (xl:) |
|---------|---------------|--------------------|
| Page Title (H1) | lg:text-4xl | xl:text-5xl |
| Section Title (H2) | lg:text-3xl | xl:text-4xl |
| Subsection (H3) | lg:text-2xl | xl:text-3xl |
| Body Text | lg:text-base | xl:text-base (same) |
| Table Headers | lg:text-base | xl:text-base |

### Wide Desktop Spacing Scale

| Element | Desktop (lg:) | Wide Desktop (xl:) |
|---------|---------------|--------------------|
| Grid Gap | lg:gap-8 | xl:gap-10 |
| Container Max Width | lg:max-w-7xl | xl:max-w-[1440px] |
| Section Padding | lg:p-8 | xl:p-10 |
| Card Grid Gap | lg:gap-6 | xl:gap-8 |
| Panel Width | lg:w-80 | xl:w-96 |

### Expected Outcome
- Wide desktop breakpoint configured at 1280px
- xl: prefix available for responsive classes
- 4-column layouts and dual panels defined
- Power user optimizations documented

### Verification Checklist
- [ ] xl breakpoint set to '1280px'
- [ ] Configuration validated
- [ ] Wide desktop use cases documented
- [ ] Common xl: patterns identified
- [ ] Component behaviors defined
- [ ] Information density optimizations noted
- [ ] Advanced ERP layouts documented

---

## Task 63: Configure 2XL Breakpoint

### Overview
Configure the ultra-wide desktop breakpoint at 1536px, targeting large desktop monitors and ultrawide displays. This breakpoint enables maximum information density with 5+ column layouts, multiple persistent panels, and optimized layouts for ultra-wide screens. Ensures content remains readable and functional at very large screen sizes.

### Dependencies
- Task 59: Configure Screen Breakpoints

### Instructions

1. **Open Tailwind configuration file**
   - Continue in `frontend/tailwind.config.js`
   - Locate theme.screens configuration

2. **Add 2xl breakpoint definition**
   - Set breakpoint name as '2xl'
   - Set value to '1536px'
   - This becomes the 2xl: prefix in classes

3. **Document ultra-wide breakpoint purpose**
   - Add comment explaining ultra-wide target
   - Note typical use cases (5+ columns, multiple panels)
   - Document maximum width constraints

4. **Understand ultra-wide implications**
   - 5-6 column dashboard grids
   - Multiple persistent panels
   - Maximum content width to maintain readability
   - Additional information without scrolling
   - Optimized for data-intensive workflows

5. **Note ultra-wide patterns**
   - Document when to use 2xl: prefix
   - List common 2xl: utilities
   - Define content width limits for readability

### Ultra-Wide Breakpoint Context

```
Ultra-Wide Breakpoint (2xl: 1536px)
════════════════════════════════════

Device Coverage:
├─ 27" monitors (QHD): 2560px × 1440px
├─ 32" monitors (4K): 3840px × 2160px
├─ 34" ultrawide: 3440px × 1440px
├─ 49" super ultrawide: 5120px × 1440px
└─ High-res displays: 1536px+ effective width

Primary Use Cases:
├─ 5-6 column layouts
├─ Triple panel layouts
├─ Maximum information density
├─ Multi-workspace views
└─ Data analysis dashboards
```

### Ultra-Wide Layout Transformations

```
Wide Desktop (< 1536px)           Ultra-Wide (≥ 1536px)
═══════════════════════           ══════════════════════

┌──────┬──────────────┬──────┐    ┌────┬──────────────────┬────┬────┐
│ Side │   Content    │Panel │    │Side│    Content       │Pan │Pan │
│      │   4-Column   │      │    │    │    5-6 Column    │ 1  │ 2  │
│      │              │      │    │    │                  │    │    │
│ Nav  │ Card Card    │ Info │    │Nav │ Card Card Card   │Info│Qk  │
│      │ Card Card    │      │    │    │ Card Card Card   │    │Act │
│      │              │      │    │    │                  │    │    │
│ 256  │ Chart  Chart │ 320  │    │256 │ Chart  Chart     │320 │240 │
└──────┴──────────────┴──────┘    └────┴──────────────────┴────┴────┘

4-column grid                     5-6 column grid
Single right panel                Dual right panels
```

### Ultra-Wide Breakpoint Use Cases

| Component | Wide Desktop (< 1536px) | Ultra-Wide (2xl: ≥ 1536px) |
|-----------|------------------------|---------------------------|
| Dashboard Grid | xl:grid-cols-4 | 2xl:grid-cols-5 or 2xl:grid-cols-6 |
| Content Max Width | xl:max-w-[1440px] | 2xl:max-w-[1600px] |
| Side Panels | 2 panels | 3 panels possible |
| Cards per Row | 4 cards | 5-6 cards |
| Table View | Full width | Centered with max width |
| Grid Gap | xl:gap-10 | 2xl:gap-12 |
| Multiple Workspaces | Hidden | 2xl:grid-cols-2 (split view) |

### Common 2xl: Patterns for ERP

#### Maximum Grid Columns Pattern
```
Mobile:          grid-cols-1
Tablet:          md:grid-cols-2
Desktop:         lg:grid-cols-3
Wide Desktop:    xl:grid-cols-4
Ultra-Wide:      2xl:grid-cols-6
```

#### Triple Panel Layout Pattern
```
<div class="flex">
  <aside class="lg:w-64">Main Sidebar</aside>
  <main class="flex-1">Content</main>
  <aside class="hidden xl:block xl:w-80">Info Panel</aside>
  <aside class="hidden 2xl:block 2xl:w-64">Quick Actions</aside>
</div>
```

#### Centered Content with Max Width Pattern
```
Desktop:         lg:max-w-7xl lg:mx-auto
Wide Desktop:    xl:max-w-[1440px]
Ultra-Wide:      2xl:max-w-[1600px] 2xl:mx-auto
```

#### Split Workspace Pattern
```
Ultra-Wide Only:
<div class="2xl:grid 2xl:grid-cols-2 2xl:gap-8">
  <section>Workspace 1</section>
  <section>Workspace 2</section>
</div>
```

### Ultra-Wide Component Behavior

| Component | Ultra-Wide Behavior |
|-----------|---------------------|
| Dashboard | 5-6 column grid, 12-18 widgets visible |
| Data Tables | Centered with max-width, all columns |
| Forms | Multi-section layout, side-by-side |
| Charts | Side-by-side comparison views |
| Panels | 3 persistent panels (sidebar + 2 right) |
| Product Grids | 5-6 items per row |
| Comparison Views | 2-3 items compared side-by-side |
| Split Views | Dual workspace (e.g., invoice + preview) |
| Activity Feeds | Multiple feeds visible |
| Toolbars | Extended with all actions visible |

### Content Width Strategy for Ultra-Wide

```
Content Width Philosophy
════════════════════════

Problem: Content too wide = hard to read
Solution: Maximum width constraints

┌──────────────────────────────────────────────────────┐
│                  2560px Screen                       │
│  ┌────┬────────────────────────────────┬────┬────┐  │
│  │Nav │     Max Width: 1600px         │Pan1│Pan2│  │
│  │    │     (Readable Content)         │    │    │  │
│  │256 │                                │320 │240 │  │
│  └────┴────────────────────────────────┴────┴────┘  │
│       ← margins →                    ← margins →     │
└──────────────────────────────────────────────────────┘

Content constrained for readability
Side space used for persistent panels
```

### Ultra-Wide Information Density

| Metric | Wide Desktop | Ultra-Wide |
|--------|--------------|------------|
| Dashboard Cards | 8 visible | 12-18 visible |
| Table Columns | 10 columns | 15+ columns |
| Grid Items/Row | 4 items | 5-6 items |
| Side Panels | 1-2 panels | 2-3 panels |
| Chart Comparisons | 2 charts | 3-4 charts |
| Form Sections | 2-3 sections | 3-4 sections side-by-side |

### Ultra-Wide ERP Layouts

#### Maximum Density Dashboard
```
┌────┬────────────────────────────────────────┬────┬────┐
│ 📁 │         Executive Dashboard            │ 📊 │Qk  │
├────┼────────────────────────────────────────┼────┼────┤
│ 📄 │ ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐       │Rev │Act │
│ ⚙️ │ │C1 ││C2 ││C3 ││C4 ││C5 ││C6 │       │KPI │    │
│ 📊 │ └───┘└───┘└───┘└───┘└───┘└───┘       │    │Add │
│ 👤 │ ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐       │Stat│Ord │
│    │ │C7 ││C8 ││C9 ││C10││C11││C12│       │    │    │
│Nav │ └───┘└───┘└───┘└───┘└───┘└───┘       │Tre │Qk  │
│256 │ ┌──────┐┌──────┐┌──────┐┌──────┐     │nds │Inv │
│    │ │Chart1││Chart2││Chart3││Chart4│     │    │    │
│    │ └──────┘└──────┘└──────┘└──────┘     │Pan │Pan │
│    │       Recent Activity Table           │320 │240 │
└────┴────────────────────────────────────────┴────┴────┘

6-column card grid (12 cards)
4-column chart row
Triple panel layout
```

#### Split Workspace View
```
┌────┬──────────────────────┬──────────────────────┬────┐
│ 📁 │   Invoice Editor     │   Live Preview       │Info│
├────┼──────────────────────┼──────────────────────┼────┤
│ 📄 │                      │                      │    │
│ ⚙️ │ Customer: [Select]   │  ┌──────────────┐   │Cust│
│ 📊 │ Date: [Date Picker]  │  │  INVOICE     │   │Info│
│    │                      │  │              │   │    │
│Nav │ Items:               │  │  Customer    │   │Rct │
│    │ [Product] [Qty] [$]  │  │  Items list  │   │Ord │
│    │ [Add Line]           │  │  Totals      │   │    │
│    │                      │  │              │   │Pay │
│    │ Total: $0.00         │  └──────────────┘   │Hst │
└────┴──────────────────────┴──────────────────────┴────┘

Dual workspace: Edit + Preview
Real-time preview
Side info panel
```

### Ultra-Wide Typography

| Element | Wide Desktop (xl:) | Ultra-Wide (2xl:) |
|---------|--------------------|-------------------|
| Page Title (H1) | xl:text-5xl | 2xl:text-5xl (same) |
| Section Title (H2) | xl:text-4xl | 2xl:text-4xl (same) |
| Body Text | xl:text-base | 2xl:text-base (same) |

**Note:** Typography typically doesn't scale beyond xl: to maintain readability.

### Ultra-Wide Spacing Scale

| Element | Wide Desktop (xl:) | Ultra-Wide (2xl:) |
|---------|--------------------|--------------------|
| Grid Gap | xl:gap-10 | 2xl:gap-12 |
| Container Max Width | xl:max-w-[1440px] | 2xl:max-w-[1600px] |
| Section Gap | xl:gap-10 | 2xl:gap-12 |
| Dashboard Columns | xl:grid-cols-4 | 2xl:grid-cols-6 |

### Content Readability Guidelines

| Element | Max Width | Reason |
|---------|-----------|--------|
| Text Content | 65-75 characters | Optimal reading line length |
| Form Content | 1200px | Comfortable form filling |
| Dashboard | 1600px | Balance density vs readability |
| Data Tables | No max | Tables can span full width |
| Cards Grid | 1600px | Prevent cards too small |

### Expected Outcome
- Ultra-wide breakpoint configured at 1536px
- 2xl: prefix available for responsive classes
- Maximum density layouts defined
- Content width constraints for readability
- Multi-panel and split view patterns documented

### Verification Checklist
- [ ] 2xl breakpoint set to '1536px'
- [ ] Configuration validated
- [ ] Ultra-wide use cases documented
- [ ] Common 2xl: patterns identified
- [ ] Content width strategy defined
- [ ] Component behaviors documented
- [ ] Split workspace patterns noted
- [ ] Readability constraints established

---

## Task 64: Create Mobile-First Utilities

### Overview
Create documentation and guidelines for mobile-first utility usage patterns. Establishes the mobile-first development approach where base styles target mobile devices and responsive modifiers progressively enhance for larger screens. Ensures consistent application of mobile-first principles across the ERP dashboard.

### Dependencies
- Task 59: Configure Screen Breakpoints

### Instructions

1. **Create mobile-first guidelines document**
   - Create `docs/design-system/mobile-first-approach.md`
   - Document mobile-first philosophy
   - Provide examples and anti-patterns

2. **Document base styles approach**
   - Explain that classes without prefixes = mobile styles
   - These styles apply to ALL screen sizes
   - Breakpoint modifiers override base styles

3. **Create common utility examples**
   - Display utilities (hidden, block, flex, grid)
   - Spacing utilities (padding, margin, gap)
   - Typography utilities (font size, weight)
   - Layout utilities (width, height, position)

4. **Document progressive enhancement pattern**
   - Start with mobile design
   - Add tablet enhancements with md: prefix
   - Add desktop enhancements with lg: prefix
   - Add wide screen enhancements with xl:, 2xl:

5. **Create anti-pattern examples**
   - Document common mistakes
   - Show wrong approach (desktop-first)
   - Show correct approach (mobile-first)

6. **Establish component-level patterns**
   - Button responsive patterns
   - Card responsive patterns
   - Form responsive patterns
   - Navigation responsive patterns

### Mobile-First Philosophy

```
Mobile-First Development Approach
══════════════════════════════════

Traditional (Desktop-First):      Mobile-First:
═══════════════════════          ═════════════

Design for desktop →             Design for mobile →
Scale down to mobile             Scale up to desktop

Problems:                        Benefits:
• Mobile feels cramped           • Mobile-optimized by default
• Performance overhead           • Progressive enhancement
• Complex media queries          • Better performance
• Touch targets too small        • Simpler CSS
```

### Base Style Application

```
How Mobile-First Classes Work
══════════════════════════════

<div class="text-sm md:text-base lg:text-lg">

┌─────────────────────────────────────────────────┐
│ Screen Size 320px-767px (Mobile)                │
│   → text-sm applies                             │
│   → 14px font size                              │
└─────────────────────────────────────────────────┘
                    │
                    │ @ 768px
                    ▼
┌─────────────────────────────────────────────────┐
│ Screen Size 768px-1023px (Tablet)               │
│   → md:text-base applies (overrides text-sm)   │
│   → 16px font size                              │
└─────────────────────────────────────────────────┘
                    │
                    │ @ 1024px
                    ▼
┌─────────────────────────────────────────────────┐
│ Screen Size 1024px+ (Desktop)                   │
│   → lg:text-lg applies (overrides md:text-base)│
│   → 18px font size                              │
└─────────────────────────────────────────────────┘
```

### Common Mobile-First Utility Patterns

#### Display Utilities
```
Pattern: Show/Hide Elements

Mobile: hidden
Tablet: md:block
Desktop: lg:flex

Example:
<aside class="hidden md:block lg:flex lg:w-64">
  Sidebar
</aside>

Result:
• Mobile: Sidebar hidden
• Tablet: Sidebar visible as block
• Desktop: Sidebar visible as flex container
```

#### Spacing Utilities
```
Pattern: Progressive Spacing

Mobile: p-4
Tablet: md:p-6
Desktop: lg:p-8

Example:
<main class="p-4 md:p-6 lg:p-8">
  Content
</main>

Result:
• Mobile: 16px padding
• Tablet: 24px padding
• Desktop: 32px padding
```

#### Layout Utilities
```
Pattern: Responsive Grid

Mobile: grid-cols-1
Tablet: md:grid-cols-2
Desktop: lg:grid-cols-3

Example:
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

Result:
• Mobile: 1 column (stacked)
• Tablet: 2 columns
• Desktop: 3 columns
```

### Progressive Enhancement Examples

#### Example 1: Card Component
```
Mobile → Tablet → Desktop

<div class="w-full md:w-1/2 lg:w-1/3 p-4 md:p-5 lg:p-6">
  <div class="bg-white rounded-lg shadow-sm md:shadow-md">
    <h3 class="text-lg md:text-xl lg:text-2xl font-semibold">
      Card Title
    </h3>
    <p class="text-sm md:text-base text-gray-600">
      Card description
    </p>
  </div>
</div>

Progression:
Mobile:   Full width, small padding, subtle shadow
Tablet:   Half width, medium padding, stronger shadow
Desktop:  Third width, large padding, larger text
```

#### Example 2: Navigation
```
Mobile → Tablet → Desktop

<nav class="fixed inset-x-0 bottom-0 md:static md:inset-auto 
            bg-white md:bg-transparent border-t md:border-0
            flex md:flex-col lg:w-64">
  <a class="flex-1 md:flex-none p-4 md:p-3">
    <span class="hidden md:inline">Dashboard</span>
    <Icon class="md:mr-2" />
  </a>
</nav>

Progression:
Mobile:   Bottom bar, icons only, full width
Tablet:   Side navigation, icons only, auto width
Desktop:  Expanded sidebar, icons + text, fixed width
```

#### Example 3: Data Table
```
Mobile → Tablet → Desktop

<div class="overflow-x-auto md:overflow-visible">
  <table class="min-w-full">
    <thead class="hidden md:table-header-group">
      <tr>
        <th class="text-xs md:text-sm lg:text-base">Product</th>
        <th class="hidden lg:table-cell">SKU</th>
        <th>Price</th>
        <th class="hidden md:table-cell">Stock</th>
      </tr>
    </thead>
  </table>
</div>

Progression:
Mobile:   Horizontal scroll, headers hidden, minimal columns
Tablet:   No scroll, headers visible, more columns
Desktop:  Full table, all columns visible
```

### Anti-Patterns (Wrong Approach)

#### Anti-Pattern 1: Desktop-First
```
❌ WRONG (Desktop-First):
<div class="p-8 md:p-6 sm:p-4">
  Content
</div>

This applies large padding first, then reduces it.
Mobile loads unnecessary large padding CSS.

✅ CORRECT (Mobile-First):
<div class="p-4 md:p-6 lg:p-8">
  Content
</div>

This applies small padding first, then enhances it.
Mobile loads only what it needs.
```

#### Anti-Pattern 2: Too Many Breakpoints
```
❌ WRONG (Over-specified):
<div class="text-sm sm:text-sm md:text-base lg:text-base 
            xl:text-lg 2xl:text-xl">
  Text
</div>

Redundant breakpoints, hard to maintain.

✅ CORRECT (Essential Only):
<div class="text-sm md:text-base xl:text-lg">
  Text
</div>

Only specify when value changes.
```

#### Anti-Pattern 3: Showing Then Hiding
```
❌ WRONG (Unnecessary Toggle):
<div class="block md:hidden">
  Mobile only content
</div>

Better to use conditional rendering in framework.

✅ CORRECT (When needed):
<aside class="hidden lg:block">
  Desktop sidebar
</aside>

Hide by default, show when space available.
```

### Component-Level Patterns

#### Button Pattern
```
<button class="w-full md:w-auto 
               px-4 md:px-6 
               py-2 md:py-2.5 
               text-sm md:text-base">
  Button Text
</button>

Mobile:   Full width, compact padding
Tablet+:  Auto width, comfortable padding
```

#### Form Pattern
```
<form class="space-y-4 md:space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
    <input />
    <input />
  </div>
</form>

Mobile:   Single column, compact spacing
Tablet+:  Two columns, generous spacing
```

#### Card Grid Pattern
```
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
            gap-4 md:gap-6 lg:gap-8">
  <div class="p-4 md:p-5 lg:p-6">Card</div>
</div>

Mobile:   1 column, small gaps and padding
Tablet:   2 columns, medium gaps and padding
Desktop:  3 columns, large gaps and padding
```

### Mobile-First Checklist

| Aspect | Mobile-First Approach |
|--------|-----------------------|
| Design Order | Design mobile layout first |
| Base Styles | Apply without prefixes |
| Breakpoints | Add md:, lg:, xl: as needed |
| Content | Essential content on mobile |
| Touch Targets | 44px minimum on mobile |
| Performance | Minimize CSS loaded on mobile |
| Testing | Test mobile view first |

### Quick Reference: Common Patterns

| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Container | `px-4` | `md:px-6` | `lg:px-8` |
| Grid | `grid-cols-1` | `md:grid-cols-2` | `lg:grid-cols-3` |
| Text | `text-sm` | `md:text-base` | `lg:text-base` |
| Gaps | `gap-4` | `md:gap-6` | `lg:gap-8` |
| Buttons | `w-full` | `md:w-auto` | - |
| Sidebar | `hidden` | `md:block md:w-16` | `lg:w-64` |

### Expected Outcome
- Mobile-first approach documented
- Common utility patterns established
- Anti-patterns identified
- Component patterns defined
- Progressive enhancement strategy clear

### Verification Checklist
- [ ] Mobile-first guidelines document created
- [ ] Base styles approach documented
- [ ] Common utility examples provided
- [ ] Progressive enhancement patterns shown
- [ ] Anti-patterns documented
- [ ] Component-level patterns defined
- [ ] Quick reference created

---

## Task 65: Create Responsive Typography Utilities

### Overview
Create responsive typography utility patterns that scale appropriately across device sizes. Establishes typographic hierarchy that remains readable and proportional from mobile to desktop. Ensures headings, body text, and UI elements use appropriate font sizes at each breakpoint.

### Dependencies
- Task 34: Typography scale defined (from Group C)
- Task 59: Configure Screen Breakpoints

### Instructions

1. **Create responsive typography documentation**
   - Create `docs/design-system/responsive-typography.md`
   - Document typography scaling strategy
   - Provide usage examples for each text style

2. **Define heading scale progression**
   - Document H1 through H6 responsive sizes
   - Define when to scale up at each breakpoint
   - Ensure proper hierarchy maintained

3. **Define body text scale**
   - Document base body text sizes
   - Define when body text should scale
   - Consider reading comfort at each size

4. **Create UI text patterns**
   - Button text sizing
   - Input field text sizing
   - Label and helper text sizing
   - Table text sizing

5. **Document line height adjustments**
   - Line height should adjust with font size
   - Ensure readability at all sizes
   - Reference Tailwind's default line heights

6. **Create typography usage guidelines**
   - When to scale typography
   - When to keep consistent
   - Mobile vs desktop considerations

### Responsive Typography Scale

```
Typography Progression: Mobile → Tablet → Desktop
══════════════════════════════════════════════════

Mobile (320-767px)    Tablet (768-1023px)   Desktop (1024px+)
══════════════        ═══════════════        ═════════════

H1: text-3xl    →     md:text-4xl      →    lg:text-5xl
    (30px)            (36px)                (48px)

H2: text-2xl    →     md:text-3xl      →    lg:text-4xl
    (24px)            (30px)                (36px)

H3: text-xl     →     md:text-2xl      →    lg:text-3xl
    (20px)            (24px)                (30px)

H4: text-lg     →     md:text-xl       →    lg:text-2xl
    (18px)            (20px)                (24px)

H5: text-base   →     md:text-lg       →    lg:text-xl
    (16px)            (18px)                (20px)

Body: text-sm   →     md:text-base     →    lg:text-base
      (14px)          (16px)                (16px - no change)

Small: text-xs  →     md:text-sm       →    lg:text-sm
       (12px)         (14px)                (14px - no change)
```

### Heading Responsive Patterns

#### H1 - Page Title
```
<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold">
  Page Title
</h1>

Usage: Main page heading
Mobile:  30px - Fits in viewport
Tablet:  36px - More prominent
Desktop: 48px - Maximum impact

Line Height:
class="leading-tight"  (1.25)
```

#### H2 - Section Title
```
<h2 class="text-2xl md:text-3xl lg:text-4xl font-semibold">
  Section Title
</h2>

Usage: Major sections
Mobile:  24px - Clear hierarchy
Tablet:  30px - Balanced
Desktop: 36px - Prominent sections

Line Height:
class="leading-tight"  (1.25)
```

#### H3 - Subsection Title
```
<h3 class="text-xl md:text-2xl lg:text-3xl font-semibold">
  Subsection Title
</h3>

Usage: Subsections, card headers
Mobile:  20px - Good contrast
Tablet:  24px - Comfortable reading
Desktop: 30px - Clear subsections

Line Height:
class="leading-snug"  (1.375)
```

#### H4 - Component Title
```
<h4 class="text-lg md:text-xl lg:text-2xl font-medium">
  Component Title
</h4>

Usage: Card titles, widget headers
Mobile:  18px - Readable
Tablet:  20px - Slightly larger
Desktop: 24px - Clear hierarchy

Line Height:
class="leading-snug"  (1.375)
```

#### H5 - Small Heading
```
<h5 class="text-base md:text-lg lg:text-xl font-medium">
  Small Heading
</h5>

Usage: List headers, small sections
Mobile:  16px - Base size
Tablet:  18px - Enhanced
Desktop: 20px - Comfortable

Line Height:
class="leading-normal"  (1.5)
```

#### H6 - Minimal Heading
```
<h6 class="text-sm md:text-base lg:text-lg font-medium">
  Minimal Heading
</h6>

Usage: Sub-sub sections, labels
Mobile:  14px - Minimal
Tablet:  16px - Standard
Desktop: 18px - Clear

Line Height:
class="leading-normal"  (1.5)
```

### Body Text Patterns

#### Body Text - Standard
```
<p class="text-sm md:text-base">
  Standard body text content for paragraphs and descriptions.
</p>

Usage: Paragraphs, descriptions
Mobile:  14px - Readable on small screens
Tablet+: 16px - Comfortable reading size
Desktop: 16px - No change from tablet

Line Height:
class="leading-relaxed"  (1.625)
```

#### Body Text - Large
```
<p class="text-base md:text-lg">
  Emphasized body text for important content.
</p>

Usage: Lead paragraphs, callouts
Mobile:  16px - Emphasized
Tablet+: 18px - More prominent

Line Height:
class="leading-relaxed"  (1.625)
```

#### Body Text - Small
```
<p class="text-xs md:text-sm">
  Helper text, captions, and secondary information.
</p>

Usage: Captions, helper text, footnotes
Mobile:  12px - Minimal but readable
Tablet+: 14px - Comfortable

Line Height:
class="leading-normal"  (1.5)
```

### UI Component Typography

#### Button Text
```
<button class="text-sm md:text-base font-medium">
  Button Text
</button>

Mobile:  14px - Touch-friendly
Tablet+: 16px - Clear and prominent

No desktop scaling for buttons.
```

#### Input Field Text
```
<input class="text-sm md:text-base" />

Mobile:  14px - Prevents zoom on iOS
Tablet+: 16px - Comfortable typing

16px prevents mobile zoom on focus.
```

#### Label Text
```
<label class="text-sm md:text-base font-medium">
  Form Label
</label>

Mobile:  14px - Clear
Tablet+: 16px - Easy to read
```

#### Helper Text
```
<span class="text-xs md:text-sm text-gray-600">
  Helper text or error message
</span>

Mobile:  12px - Space-efficient
Tablet+: 14px - Readable
```

#### Table Header Text
```
<th class="text-xs md:text-sm lg:text-base font-semibold">
  Column Header
</th>

Mobile:  12px - Fits many columns
Tablet:  14px - More comfortable
Desktop: 16px - Clear headers
```

#### Table Body Text
```
<td class="text-sm md:text-base">
  Cell content
</td>

Mobile:  14px - Readable
Tablet+: 16px - Comfortable
```

### Typography Scaling Guidelines

| Element | Scale on Mobile | Scale on Tablet | Scale on Desktop |
|---------|----------------|-----------------|------------------|
| H1-H4 | ✅ Yes | ✅ Yes | ✅ Yes |
| H5-H6 | ✅ Yes | ✅ Yes | ⚠️ Optional |
| Body Text | ✅ Yes (sm→base) | ❌ No (stays base) | ❌ No |
| UI Text | ✅ Minimal | ❌ No | ❌ No |
| Buttons | ✅ Minimal | ❌ No | ❌ No |
| Tables | ✅ Yes | ✅ Yes | ⚠️ Optional |

### Typography Use Cases for ERP

#### Dashboard Cards
```
<div class="p-4 md:p-6">
  <h3 class="text-lg md:text-xl font-semibold mb-2">
    Card Title
  </h3>
  <p class="text-2xl md:text-3xl font-bold">
    $12,345
  </p>
  <p class="text-xs md:text-sm text-gray-600">
    +12% from last month
  </p>
</div>

Card title scales moderately
Metric value scales for impact
Description text scales minimally
```

#### Data Table
```
<table>
  <thead>
    <tr>
      <th class="text-xs md:text-sm font-semibold">
        Product Name
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="text-sm md:text-base">
        Product ABC
      </td>
    </tr>
  </tbody>
</table>

Headers: Scale for clarity
Body: Scale for readability
Fits more data on mobile with smaller text
```

#### Form Labels
```
<label class="text-sm md:text-base font-medium">
  Customer Name
</label>
<input class="text-sm md:text-base" />
<span class="text-xs md:text-sm text-gray-600">
  Enter full legal name
</span>

Label: Scales for readability
Input: Scales to match label
Helper: Scales minimally
```

### Line Height Reference

| Class | Value | Usage |
|-------|-------|-------|
| `leading-tight` | 1.25 | Headings (H1-H2) |
| `leading-snug` | 1.375 | Headings (H3-H4) |
| `leading-normal` | 1.5 | UI elements, small text |
| `leading-relaxed` | 1.625 | Body text, paragraphs |
| `leading-loose` | 2 | Special cases only |

### Responsive Typography Examples

#### Example 1: Page Header
```
<header class="mb-6 md:mb-8">
  <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2">
    Inventory Management
  </h1>
  <p class="text-sm md:text-base text-gray-600 leading-relaxed">
    Manage your products, stock levels, and inventory movements
  </p>
</header>
```

#### Example 2: Statistic Card
```
<div class="bg-white rounded-lg p-4 md:p-6">
  <div class="text-xs md:text-sm font-medium text-gray-600 mb-1">
    Total Revenue
  </div>
  <div class="text-2xl md:text-3xl lg:text-4xl font-bold">
    Rs. 1,234,567
  </div>
  <div class="text-xs md:text-sm text-green-600 mt-2">
    +15.3% from last month
  </div>
</div>
```

#### Example 3: Content Section
```
<section class="prose prose-sm md:prose lg:prose-lg">
  <h2 class="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
    Section Title
  </h2>
  <p class="text-sm md:text-base leading-relaxed mb-4">
    Body text content with comfortable line height for reading...
  </p>
</section>
```

### Expected Outcome
- Responsive typography scale documented
- Heading and body text patterns defined
- UI component typography specified
- Usage guidelines and examples provided
- Line height recommendations included

### Verification Checklist
- [ ] Responsive typography documentation created
- [ ] Heading scales (H1-H6) defined
- [ ] Body text patterns documented
- [ ] UI component typography specified
- [ ] Line height guidelines provided
- [ ] Usage examples created
- [ ] ERP-specific patterns documented

---

## Task 66: Create Responsive Spacing Utilities

### Overview
Create responsive spacing utility patterns that adapt across device sizes. Establishes consistent spacing system that provides comfortable layouts on mobile while maximizing screen real estate on desktop. Covers padding, margins, gaps, and container widths for all breakpoints.

### Dependencies
- Task 46: Spacing scale defined (from Group D)
- Task 59: Configure Screen Breakpoints

### Instructions

1. **Create responsive spacing documentation**
   - Create `docs/design-system/responsive-spacing.md`
   - Document spacing progression strategy
   - Provide usage patterns for common scenarios

2. **Define container padding progression**
   - Mobile: Minimal padding to maximize space
   - Tablet: Comfortable padding
   - Desktop: Generous padding
   - Document page, section, and component padding

3. **Define gap progression**
   - Grid gaps scale with screen size
   - Flex gaps scale appropriately
   - Stack spacing scales for readability

4. **Define container width patterns**
   - Mobile: Full width with padding
   - Tablet: Constrained with max-width
   - Desktop: Wider constraints
   - Ultra-wide: Maximum width limits

5. **Create component spacing patterns**
   - Card spacing (internal and external)
   - Form spacing (fields, sections)
   - List spacing (items, sections)
   - Dashboard spacing (widgets, sections)

6. **Document spacing usage guidelines**
   - When to scale spacing
   - When to keep consistent
   - Relationship to content density

### Responsive Spacing Scale

```
Spacing Progression: Mobile → Tablet → Desktop → Wide
═══════════════════════════════════════════════════════

Mobile          Tablet          Desktop         Wide/Ultra
(< 768px)       (768-1023px)    (1024-1279px)   (1280px+)
════════        ════════        ═════════       ══════════

Container Padding:
px-4 (16px) →   md:px-6 (24px) → lg:px-8 (32px) → xl:px-10 (40px)

Section Gap:
gap-4 (16px) →  md:gap-6 (24px) → lg:gap-8 (32px) → xl:gap-10 (40px)

Card Padding:
p-4 (16px)   →  md:p-5 (20px)  → lg:p-6 (24px)  → xl:p-8 (32px)

Grid Gap:
gap-4 (16px) →  md:gap-6 (24px) → lg:gap-8 (32px) → xl:gap-10 (40px)

Stack Gap:
space-y-4    →  md:space-y-6   → lg:space-y-8   → xl:space-y-10
(16px)          (24px)            (32px)           (40px)
```

### Container Padding Patterns

#### Page Container
```
<main class="px-4 md:px-6 lg:px-8 xl:px-10 py-6 md:py-8 lg:py-10">
  Page content
</main>

Horizontal Padding:
Mobile:  16px - Maximize content area
Tablet:  24px - Comfortable margins
Desktop: 32px - Generous spacing
Wide:    40px - Prevents edge proximity

Vertical Padding:
Mobile:  24px - Compact
Tablet:  32px - Comfortable
Desktop: 40px - Generous
```

#### Section Container
```
<section class="px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
  Section content
</section>

Section padding increases progressively
More vertical space on desktop
Horizontal matches page container
```

#### Card Padding
```
<div class="p-4 md:p-5 lg:p-6 xl:p-8">
  Card content
</div>

Mobile:  16px - Space-efficient
Tablet:  20px - Comfortable
Desktop: 24px - Generous
Wide:    32px - Spacious for large cards
```

### Gap Progression Patterns

#### Grid Gap
```
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
            gap-4 md:gap-6 lg:gap-8 xl:gap-10">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

Gap scales with grid complexity:
Mobile:  16px - Tight but clear
Tablet:  24px - Comfortable
Desktop: 32px - Generous
Wide:    40px - Spacious for many columns
```

#### Flex Gap
```
<div class="flex flex-wrap gap-3 md:gap-4 lg:gap-6">
  <button>Action 1</button>
  <button>Action 2</button>
</div>

Smaller gap increments for inline elements
Mobile:  12px - Compact
Tablet:  16px - Comfortable
Desktop: 24px - Clear separation
```

#### Stack Spacing (Vertical)
```
<div class="space-y-4 md:space-y-6 lg:space-y-8">
  <section>Section 1</section>
  <section>Section 2</section>
  <section>Section 3</section>
</div>

Vertical rhythm increases with screen size
Mobile:  16px - Compact scrolling
Tablet:  24px - Comfortable rhythm
Desktop: 32px - Clear sections
```

### Container Width Patterns

#### Full-Width with Padding
```
<div class="w-full px-4 md:px-6 lg:px-8">
  Content spans full width with safe margins
</div>

Usage: Dashboard, full-width layouts
Mobile:  100% width, 16px margin
Tablet:  100% width, 24px margin
Desktop: 100% width, 32px margin
```

#### Constrained Width Container
```
<div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
  Content centered with maximum width
</div>

Usage: Forms, articles, centered content
Mobile:  100% width
Tablet:  100% width (or max-w-4xl)
Desktop: 1280px max (max-w-7xl)
```

#### Responsive Max Width
```
<div class="w-full md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4">
  Content
</div>

Mobile:  Full width
Tablet:  672px max
Desktop: 896px max
Wide:    1152px max

Progressive width constraints
```

### Component Spacing Patterns

#### Dashboard Card
```
<div class="p-4 md:p-5 lg:p-6 space-y-3 md:space-y-4">
  <h3 class="text-lg font-semibold">Card Title</h3>
  <div class="text-2xl font-bold">$12,345</div>
  <p class="text-sm text-gray-600">Description</p>
</div>

Card Padding:
Mobile:  16px - Space-efficient
Tablet:  20px - Comfortable
Desktop: 24px - Generous

Internal Spacing:
Mobile:  12px between elements
Tablet:  16px between elements
```

#### Form Spacing
```
<form class="space-y-4 md:space-y-6 lg:space-y-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
    <div>
      <label class="block mb-2 md:mb-3">Label</label>
      <input class="w-full" />
    </div>
  </div>
</form>

Form Section Gap:
Mobile:  16px - Compact form
Tablet:  24px - Comfortable
Desktop: 32px - Clear sections

Field Gap:
Mobile:  16px between fields
Tablet:  24px between fields

Label Margin:
Mobile:  8px below label
Tablet:  12px below label
```

#### List Spacing
```
<ul class="space-y-2 md:space-y-3 lg:space-y-4">
  <li class="p-3 md:p-4 border-b">
    List item content
  </li>
</ul>

List Item Gap:
Mobile:  8px - Compact list
Tablet:  12px - Comfortable
Desktop: 16px - Clear separation

Item Padding:
Mobile:  12px - Touch-friendly
Tablet:  16px - Comfortable
```

#### Data Table Spacing
```
<table class="w-full">
  <thead>
    <tr>
      <th class="px-3 md:px-4 lg:px-6 py-2 md:py-3">
        Header
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="px-3 md:px-4 lg:px-6 py-2 md:py-3">
        Cell
      </td>
    </tr>
  </tbody>
</table>

Cell Padding:
Mobile:  12px horizontal, 8px vertical
Tablet:  16px horizontal, 12px vertical
Desktop: 24px horizontal, 12px vertical
```

### ERP-Specific Spacing Patterns

#### Dashboard Grid
```
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
            gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8">
  <div class="p-4 md:p-5 lg:p-6">Widget</div>
</div>

Container: Progressive padding
Grid Gap: Increases with columns
Widget: Internal padding scales
```

#### Sidebar + Content Layout
```
<div class="flex">
  <aside class="hidden md:block md:w-16 lg:w-64 md:p-4 lg:p-6">
    Sidebar
  </aside>
  <main class="flex-1 p-4 md:p-6 lg:p-8">
    Content
  </main>
</div>

Sidebar Padding:
Tablet:  16px (collapsed)
Desktop: 24px (expanded)

Main Content Padding:
Mobile:  16px
Tablet:  24px
Desktop: 32px
```

#### Modal Spacing
```
<div class="p-6 md:p-8 lg:p-10">
  <h2 class="text-2xl font-bold mb-4 md:mb-6">
    Modal Title
  </h2>
  <div class="space-y-4 md:space-y-6">
    Content sections
  </div>
  <div class="flex gap-3 md:gap-4 mt-6 md:mt-8">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</div>

Modal Padding:
Mobile:  24px
Tablet:  32px
Desktop: 40px

Section Gaps:
Mobile:  16px
Tablet:  24px
```

### Spacing Usage Guidelines

| Scenario | Mobile | Tablet | Desktop | Reasoning |
|----------|--------|--------|---------|-----------|
| Page padding | px-4 | md:px-6 | lg:px-8 | Progressive comfort |
| Card padding | p-4 | md:p-5 | lg:p-6 | Internal space scales |
| Grid gap | gap-4 | md:gap-6 | lg:gap-8 | Visual separation |
| Form spacing | space-y-4 | md:space-y-6 | lg:space-y-8 | Clear sections |
| List items | space-y-2 | md:space-y-3 | lg:space-y-4 | Scannable lists |
| Button group | gap-2 | md:gap-3 | lg:gap-4 | Touch vs mouse |
| Sections | space-y-6 | md:space-y-8 | lg:space-y-12 | Major divisions |

### Spacing Scale Reference

| Tailwind Class | Size | Mobile Use | Tablet Use | Desktop Use |
|----------------|------|------------|------------|-------------|
| p-2, gap-2 | 8px | Minimal spacing | - | - |
| p-3, gap-3 | 12px | Compact UI | Minimal spacing | - |
| p-4, gap-4 | 16px | **Standard** | Compact UI | Minimal |
| p-5, gap-5 | 20px | Generous | **Standard** | Compact |
| p-6, gap-6 | 24px | Large | Generous | **Standard** |
| p-8, gap-8 | 32px | - | Large | Generous |
| p-10, gap-10 | 40px | - | - | Large |
| p-12, gap-12 | 48px | - | - | Section gaps |

### Responsive Spacing Examples

#### Example 1: Dashboard Page
```
<main class="px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
  <header class="mb-6 md:mb-8 lg:mb-10">
    <h1 class="text-3xl font-bold">Dashboard</h1>
  </header>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
              gap-4 md:gap-6 lg:gap-8">
    <div class="p-4 md:p-5 lg:p-6">Card 1</div>
    <div class="p-4 md:p-5 lg:p-6">Card 2</div>
  </div>
</main>
```

#### Example 2: Form Layout
```
<form class="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
  <div class="space-y-6 md:space-y-8">
    <section class="space-y-4 md:space-y-6">
      <h2 class="text-xl font-semibold">Section 1</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div class="space-y-2 md:space-y-3">
          <label>Field 1</label>
          <input />
        </div>
      </div>
    </section>
  </div>
</form>
```

#### Example 3: Card Grid
```
<div class="px-4 md:px-6 lg:px-8 py-6">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
              gap-4 md:gap-6 lg:gap-8">
    <div class="bg-white rounded-lg p-4 md:p-5 lg:p-6 space-y-3 md:space-y-4">
      <h3>Card Title</h3>
      <p>Content</p>
    </div>
  </div>
</div>
```

### Expected Outcome
- Responsive spacing patterns documented
- Container padding progression defined
- Gap patterns for grids and stacks
- Component spacing patterns established
- Usage guidelines and examples provided

### Verification Checklist
- [ ] Responsive spacing documentation created
- [ ] Container padding patterns defined
- [ ] Gap progression documented
- [ ] Container width patterns specified
- [ ] Component spacing patterns created
- [ ] ERP-specific patterns documented
- [ ] Usage guidelines provided
- [ ] Examples created for common layouts

---

## Summary

This document established the responsive breakpoint foundation and core responsive utilities:

### Completed Infrastructure
- ✅ Screen breakpoints configured (sm, md, lg, xl, 2xl)
- ✅ Tablet breakpoint (768px) for medium screens
- ✅ Desktop breakpoint (1024px) for full experience
- ✅ Wide desktop breakpoint (1280px) for enhanced layouts
- ✅ Ultra-wide breakpoint (1536px) for maximum density
- ✅ Mobile-first utility patterns and guidelines
- ✅ Responsive typography scaling system
- ✅ Responsive spacing progression patterns

### Key Achievements
1. **Mobile-First Foundation** - Base styles for mobile, enhanced for larger screens
2. **Breakpoint System** - Five breakpoints covering all device sizes
3. **Typography Scale** - Proportional text sizing across breakpoints
4. **Spacing System** - Progressive spacing from compact to generous
5. **Component Patterns** - Reusable responsive patterns for common components
6. **Documentation** - Comprehensive guidelines and examples

### Breakpoint Summary
| Breakpoint | Width | Target | Key Use |
|-----------|-------|--------|---------|
| Default | < 640px | Mobile | Base styles |
| sm | 640px | Large phones | Minimal adjustments |
| md | 768px | Tablets | 2-column, collapsed sidebar |
| lg | 1024px | Desktop | 3-column, full sidebar |
| xl | 1280px | Wide desktop | 4-column, dual panels |
| 2xl | 1536px | Ultra-wide | 5-6 column, triple panels |

### Next Steps
Proceed to [02_Tasks-67-72_Patterns-Print-Docs.md](02_Tasks-67-72_Patterns-Print-Docs.md) to implement responsive grid utilities, component-specific patterns (sidebar, tables, cards), print styles, and comprehensive responsive documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~990
