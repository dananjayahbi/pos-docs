# Tasks 69-75: Tabs, Description & Specifications

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** E - Tabs & Reviews  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-76-82_Reviews.md](02_Tasks-76-82_Reviews.md)

---

## Document Overview

This document covers the product tabs container, tab navigation, description tab with rich text display, and specifications tab. These components provide users with detailed product information through an organized tabbed interface below the main product details section.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create Product Tabs Container | Medium | 30 min |
| 70 | Create Tab Navigation | Low | 25 min |
| 71 | Create Tab Panel Container | Low | 20 min |
| 72 | Create Description Tab | Low | 25 min |
| 73 | Create Rich Text Display | Medium | 35 min |
| 74 | Create Specifications Tab | Low | 25 min |
| 75 | Create Spec Table Row | Low | 20 min |

---

## Task 69: Create Product Tabs Container

### Overview
Create the ProductTabs component that serves as the main container for product information tabs. This component displays a tabbed interface with description, specifications, and reviews sections, positioned below the product details area on the detail page.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 68 | Component | AddToWishlist button must exist |
| Radix UI Tabs | Library | Install @radix-ui/react-tabs or use custom |
| Product Data | State | Product description and specs available |

### Instructions

1. **Create tabs directory structure**
   - Navigate to `frontend/components/storefront/product/` directory
   - Create new directory named `ProductTabs`
   - This will house all tab-related components

2. **Install Radix UI Tabs (optional)**
   - Run `npm install @radix-ui/react-tabs` if using Radix
   - Or prepare for custom tab implementation
   - Review Radix UI Tabs documentation

3. **Create ProductTabs component file**
   - Create `ProductTabs.tsx` in `ProductTabs/` directory
   - Set up TypeScript React functional component
   - Import Radix Tabs components or custom tab logic

4. **Define component props interface**
   - Create `ProductTabsProps` interface
   - Include `product` prop (Product type) with description, specs, reviews
   - Include optional `defaultTab` prop (string) for initial active tab
   - Include optional `className` prop for styling

5. **Implement tabs container structure**
   - Use Radix Tabs.Root or custom div with state
   - Set default active tab to "description"
   - Apply full-width container styling

6. **Create tabs wrapper section**
   - Apply max-width container (max-w-7xl)
   - Add top border separator
   - Apply padding and margin top from product details

7. **Add tab navigation placeholder**
   - Position for TabNavigation component (Task 70)
   - Add sticky positioning option for desktop
   - Apply background color and border styling

8. **Add tab panels placeholder**
   - Position for TabPanel components (Task 71)
   - Apply padding and min-height
   - Prepare data props for each tab

### Tabs Container Structure

```
┌──────────────────────────────────────────────────────────┐
│                    Product Tabs                          │
├──────────────────────────────────────────────────────────┤
│  [Description] [Specifications] [Reviews (25)]           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│                     Tab Panel Content                     │
│                    (Dynamic Content)                      │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| product | Product | Yes | - | Product with description/specs |
| defaultTab | string | No | "description" | Initial active tab |
| className | string | No | "" | Additional CSS classes |

### Tab Configuration

| Tab ID | Label | Badge | Content |
|--------|-------|-------|---------|
| description | Description | - | Rich HTML content |
| specifications | Specifications | - | Spec table |
| reviews | Reviews | Count | Reviews list |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `w-full border-t border-gray-200 mt-12` | Base styling |
| Wrapper | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Content width |
| Background | `bg-white` | Clean background |

### Expected Outcome
- Full-width tabs container below product details
- Top border separator from product section
- Placeholder for tab navigation and panels
- State management for active tab
- Responsive container with proper max-width

### Checklist
- [ ] ProductTabs directory created
- [ ] Radix UI Tabs installed (or custom logic ready)
- [ ] ProductTabs.tsx component created
- [ ] Props interface defined (product, defaultTab, className)
- [ ] Tabs container structure implemented
- [ ] Tab state management working
- [ ] Top border separator applied
- [ ] Responsive max-width container
- [ ] Placeholders for navigation and panels
- [ ] Component exported from index.ts

---

## Task 70: Create Tab Navigation

### Overview
Create the TabNavigation component that displays clickable tab buttons for Description, Specifications, and Reviews. This navigation allows users to switch between different information sections, with visual indication of the active tab and review count badge.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 69 | Component | ProductTabs container must exist |
| Radix UI | Library | Tabs.List and Tabs.Trigger if using Radix |
| Review Count | Data | Total reviews count for badge |

### Instructions

1. **Create TabNavigation component file**
   - Create `TabNavigation.tsx` in `ProductTabs/` directory
   - Set up TypeScript React functional component
   - Import Radix Tabs components or custom button logic

2. **Define component props interface**
   - Create `TabNavigationProps` interface
   - Include `activeTab` prop (string) for current active tab
   - Include `onTabChange` prop (function) for tab click handler
   - Include `reviewCount` prop (number) for reviews badge

3. **Implement tab list container**
   - Use Radix Tabs.List or custom div with flex layout
   - Apply border-bottom separator
   - Set horizontal scrolling on mobile

4. **Create Description tab button**
   - Use Radix Tabs.Trigger or custom button
   - Label: "Description"
   - Apply active/inactive styling based on state
   - Add hover effects

5. **Create Specifications tab button**
   - Label: "Specifications"
   - Same structure as Description tab
   - Apply consistent styling and hover states

6. **Create Reviews tab button with badge**
   - Label: "Reviews"
   - Add review count badge (e.g., "25")
   - Format badge as small gray circle
   - Show only if review count > 0

7. **Implement active tab styling**
   - Active tab: border-bottom-2, bold font, primary color
   - Inactive tab: normal font, gray color
   - Smooth transition animations

8. **Add keyboard navigation**
   - Arrow keys to switch tabs
   - Tab key for focus management
   - Enter/Space to activate tab

### Tab Navigation Layout

```
┌──────────────────────────────────────────────────────────┐
│  Description  │  Specifications  │  Reviews (25)         │
│  ▔▔▔▔▔▔▔▔▔▔▔                                             │
└──────────────────────────────────────────────────────────┘
     Active            Inactive           Inactive + Badge
```

### Tab Button States

| State | Border | Font | Color | Background |
|-------|--------|------|-------|------------|
| Active | 2px bottom | Bold | primary-600 | white |
| Inactive | None | Normal | gray-700 | white |
| Hover | None | Normal | gray-900 | gray-50 |
| Focus | Ring | - | - | - |

### Review Badge Styling

| Property | Value | Description |
|----------|-------|-------------|
| Background | `bg-gray-100` | Light gray |
| Text Color | `text-gray-700` | Dark gray |
| Size | `text-xs` | Small font |
| Padding | `px-2 py-0.5` | Compact |
| Border Radius | `rounded-full` | Circular |
| Position | `ml-1.5` | Right of label |

### Tab Configuration

| Tab ID | Label | Show Badge | Badge Value |
|--------|-------|------------|-------------|
| description | Description | No | - |
| specifications | Specifications | No | - |
| reviews | Reviews | Yes if > 0 | Review count |

### Responsive Behavior

```
Mobile (< 640px)
├── Direction: Horizontal scroll
├── Tabs: No wrap
└── Padding: px-4

Desktop (≥ 640px)
├── Direction: Flex row
├── Tabs: No scroll
└── Padding: px-0
```

### Expected Outcome
- Three clickable tab buttons
- Active tab visually highlighted
- Reviews tab shows count badge
- Smooth transitions on tab change
- Keyboard navigation working
- Mobile horizontal scroll

### Checklist
- [ ] TabNavigation.tsx component created
- [ ] Props interface defined (activeTab, onTabChange, reviewCount)
- [ ] Tab list container implemented
- [ ] Description tab button created
- [ ] Specifications tab button created
- [ ] Reviews tab button with badge created
- [ ] Active/inactive styling applied
- [ ] Hover and focus states working
- [ ] Keyboard navigation functional
- [ ] Mobile responsive scrolling

---

## Task 71: Create Tab Panel Container

### Overview
Create the TabPanel component that wraps content for each tab. This component handles the display of tab content with proper padding, animations, and lazy loading. It ensures smooth transitions when switching between tabs.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 69 | Component | ProductTabs container must exist |
| Task 70 | Component | TabNavigation for active state |
| Radix UI | Library | Tabs.Content if using Radix |

### Instructions

1. **Create TabPanel component file**
   - Create `TabPanel.tsx` in `ProductTabs/` directory
   - Set up TypeScript React functional component
   - Import Radix Tabs.Content or custom div with conditional

2. **Define component props interface**
   - Create `TabPanelProps` interface
   - Include `value` prop (string) for tab identifier
   - Include `children` prop (ReactNode) for content
   - Include optional `className` prop for styling

3. **Implement panel container**
   - Use Radix Tabs.Content or custom div with state check
   - Apply hidden/visible based on active tab
   - Add fade-in animation when panel becomes active

4. **Add padding and spacing**
   - Apply vertical padding (py-8)
   - Apply horizontal padding (px-4 sm:px-0)
   - Set min-height for consistent layout

5. **Implement animation transitions**
   - Fade in animation: opacity 0 to 1
   - Slight upward slide animation (translate-y)
   - Duration: 200-300ms
   - Ease-in-out timing function

6. **Add content wrapper**
   - Wrap children in content div
   - Apply max-width if needed
   - Add prose styling for text content

7. **Handle loading states**
   - Show loading spinner if data not ready
   - Prepare for lazy loading content
   - Add skeleton placeholders option

8. **Implement focus management**
   - Set focus to panel when activated
   - Manage tab order for accessibility
   - Add aria-labelledby to link with tab button

### Tab Panel Structure

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│   ┌───────────────────────────────────────────────┐     │
│   │                                                │     │
│   │          Tab Panel Content                     │     │
│   │          (Description / Specs / Reviews)       │     │
│   │                                                │     │
│   └───────────────────────────────────────────────┘     │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Tab identifier (e.g., "description") |
| children | ReactNode | Yes | - | Tab content to display |
| className | string | No | "" | Additional CSS classes |

### Animation Specifications

| Property | Initial | Final | Duration | Timing |
|----------|---------|-------|----------|--------|
| Opacity | 0 | 1 | 200ms | ease-in-out |
| Transform | translateY(4px) | translateY(0) | 200ms | ease-in-out |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Panel | `py-8 px-4 sm:px-0` | Padding |
| Content | `min-h-[400px]` | Consistent height |
| Animation | `animate-in fade-in slide-in-from-bottom-1` | Transitions |

### Expected Outcome
- Tab panel displays content when active
- Smooth fade-in animation on tab change
- Proper padding and spacing
- Hidden when not active
- Focus management working
- Accessible ARIA attributes

### Checklist
- [ ] TabPanel.tsx component created
- [ ] Props interface defined (value, children, className)
- [ ] Panel container implemented
- [ ] Show/hide logic based on active tab
- [ ] Fade-in animation applied
- [ ] Padding and spacing correct
- [ ] Min-height set for consistency
- [ ] Focus management working
- [ ] ARIA attributes added
- [ ] Component exported from index.ts

---

## Task 72: Create Description Tab

### Overview
Create the DescriptionTab component that displays the product's full description content. This component receives HTML content from the product data and passes it to the RichTextDisplay component for safe rendering with proper styling.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 71 | Component | TabPanel container must exist |
| Product Data | State | Product description HTML available |
| Task 73 | Component | RichTextDisplay for HTML rendering (next) |

### Instructions

1. **Create DescriptionTab component file**
   - Create `DescriptionTab.tsx` in `ProductTabs/` directory
   - Set up TypeScript React functional component
   - Import TabPanel component

2. **Define component props interface**
   - Create `DescriptionTabProps` interface
   - Include `description` prop (string) for HTML content
   - Include optional `className` prop for styling

3. **Implement tab panel wrapper**
   - Use TabPanel component with value="description"
   - Pass description data to children
   - Apply styling for content area

4. **Add content validation**
   - Check if description exists and is not empty
   - Show "No description available" message if empty
   - Handle null or undefined gracefully

5. **Create placeholder for RichTextDisplay**
   - Position for Task 73 component
   - Pass description HTML as prop
   - Apply container styling

6. **Add content section heading (optional)**
   - Add "About this product" heading (optional)
   - Apply heading typography (text-lg font-medium)
   - Add bottom margin

7. **Implement loading state**
   - Show skeleton loader while description loading
   - Use gray animated rectangles
   - Match expected content height

8. **Add responsive styling**
   - Full width on mobile
   - Max-width on desktop for readability
   - Adjust padding for different screen sizes

### Description Tab Layout

```
┌──────────────────────────────────────────────────────────┐
│  About this product                                       │
│                                                           │
│  This premium wireless headphone delivers exceptional    │
│  sound quality with active noise cancellation. Features  │
│  40mm drivers, 30-hour battery life, and comfortable     │
│  over-ear design.                                        │
│                                                           │
│  Key Features:                                           │
│  • Bluetooth 5.0 connectivity                            │
│  • Active noise cancellation                             │
│  • 30-hour battery life                                  │
│  • Comfortable over-ear cushions                         │
│                                                           │
│  [Images and formatted content via RichTextDisplay]      │
└──────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| description | string | Yes | - | HTML description content |
| className | string | No | "" | Additional CSS classes |

### Content States

| State | Display | Styling |
|-------|---------|---------|
| Has Content | Rich text display | Normal |
| Empty | "No description available" | text-gray-500 |
| Loading | Skeleton loader | Animated |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `max-w-4xl` | Content width |
| Heading | `text-lg font-medium text-gray-900 mb-4` | Section title |
| Empty State | `text-center py-12 text-gray-500` | No content |

### Expected Outcome
- Description tab displays product HTML content
- Empty state shown if no description
- Loading state displays skeleton
- Content passed to RichTextDisplay component
- Responsive width and padding
- Accessible and semantic HTML

### Checklist
- [ ] DescriptionTab.tsx component created
- [ ] Props interface defined (description, className)
- [ ] TabPanel wrapper implemented
- [ ] Content validation added
- [ ] Empty state handling
- [ ] Placeholder for RichTextDisplay (Task 73)
- [ ] Optional section heading added
- [ ] Loading state skeleton implemented
- [ ] Responsive styling applied
- [ ] Component exported from index.ts

---

## Task 73: Create Rich Text Display

### Overview
Create the RichTextDisplay component that safely renders HTML content from the product description. This component sanitizes HTML to prevent XSS attacks, applies typography styling, and ensures responsive images and proper formatting for lists, headings, and other HTML elements.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 72 | Component | DescriptionTab must exist |
| DOMPurify | Library | Install dompurify and @types/dompurify |
| Tailwind Typography | Plugin | Install @tailwindcss/typography |

### Instructions

1. **Install DOMPurify library**
   - Run `npm install dompurify @types/dompurify`
   - Import DOMPurify in component
   - Review DOMPurify configuration options

2. **Install Tailwind Typography plugin**
   - Run `npm install -D @tailwindcss/typography`
   - Add plugin to `tailwind.config.js`
   - Review prose class options

3. **Create RichTextDisplay component file**
   - Create `RichTextDisplay.tsx` in `ProductTabs/` directory
   - Set up TypeScript React functional component
   - Import DOMPurify

4. **Define component props interface**
   - Create `RichTextDisplayProps` interface
   - Include `html` prop (string) for HTML content
   - Include optional `className` prop for styling

5. **Implement HTML sanitization**
   - Use DOMPurify.sanitize() to clean HTML
   - Configure allowed tags (p, h2, h3, ul, ol, li, a, img, strong, em)
   - Configure allowed attributes (href, src, alt, target)
   - Remove dangerous attributes (onclick, onerror)

6. **Create sanitized HTML container**
   - Use dangerouslySetInnerHTML with sanitized content
   - Apply Tailwind Typography prose classes
   - Set max-width for readability

7. **Configure typography styling**
   - Use `prose prose-gray lg:prose-lg` classes
   - Customize heading colors and sizes
   - Style links with primary color
   - Make images responsive

8. **Add custom styling overrides**
   - External links open in new tab (target="_blank")
   - Images have rounded corners and shadow
   - Lists have proper spacing
   - Code blocks have background color

9. **Implement image responsiveness**
   - Images max-width 100%
   - Images height auto
   - Add loading="lazy" attribute
   - Center align images

### Rich Text Display Structure

```
┌──────────────────────────────────────────────────────────┐
│  Heading Level 2                                         │
│                                                           │
│  Regular paragraph text with bold and italic formatting. │
│  Links are styled with primary color.                    │
│                                                           │
│  • Bullet point item one                                 │
│  • Bullet point item two                                 │
│  • Bullet point item three                               │
│                                                           │
│  ┌────────────────────────────────────────────┐         │
│  │                                             │         │
│  │         Product Image (Responsive)          │         │
│  │                                             │         │
│  └────────────────────────────────────────────┘         │
│                                                           │
│  More paragraph content continues here...                │
└──────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| html | string | Yes | - | HTML content to sanitize and display |
| className | string | No | "" | Additional CSS classes |

### DOMPurify Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| ALLOWED_TAGS | p, h2, h3, h4, ul, ol, li, a, img, strong, em, br, span, div | Safe HTML tags |
| ALLOWED_ATTR | href, src, alt, target, class | Safe attributes |
| FORBID_ATTR | onclick, onerror, onload | Remove dangerous |
| ALLOWED_URI_REGEXP | https?:// | Only HTTP(S) links |

### Typography Styling

| Element | Styling | Description |
|---------|---------|-------------|
| Headings | text-gray-900 font-semibold | H2, H3 styling |
| Paragraphs | text-gray-700 leading-relaxed | Body text |
| Links | text-primary-600 underline hover:text-primary-700 | Link styling |
| Lists | list-disc ml-6 space-y-1 | Bullet/number lists |
| Images | rounded-lg shadow-sm max-w-full h-auto | Responsive images |

### Prose Configuration

| Class | Purpose | Responsive |
|-------|---------|------------|
| prose | Base typography | All screens |
| prose-gray | Gray color scheme | All screens |
| lg:prose-lg | Larger text | Desktop |
| max-w-none | No max-width | All screens |

### Expected Outcome
- HTML content safely sanitized
- XSS attacks prevented
- Typography beautifully styled with Tailwind prose
- Images responsive and lazy-loaded
- Links styled and open correctly
- Lists, headings, and paragraphs properly formatted

### Checklist
- [ ] DOMPurify installed
- [ ] Tailwind Typography plugin installed and configured
- [ ] RichTextDisplay.tsx component created
- [ ] Props interface defined (html, className)
- [ ] HTML sanitization implemented
- [ ] DOMPurify configuration set (allowed tags/attributes)
- [ ] dangerouslySetInnerHTML used with sanitized content
- [ ] Prose classes applied
- [ ] Custom styling overrides added
- [ ] Image responsiveness configured
- [ ] Component exported from index.ts

---

## Task 74: Create Specifications Tab

### Overview
Create the SpecificationsTab component that displays product technical specifications in a two-column table format. This component receives an array of specification key-value pairs and renders them as table rows with alternating background colors for better readability.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 71 | Component | TabPanel container must exist |
| Product Data | State | Product specifications array available |
| Task 75 | Component | SpecTableRow for rendering rows (next) |

### Instructions

1. **Create SpecificationsTab component file**
   - Create `SpecificationsTab.tsx` in `ProductTabs/` directory
   - Set up TypeScript React functional component
   - Import TabPanel component

2. **Define component props interface**
   - Create `SpecificationsTabProps` interface
   - Include `specifications` prop (array of { key, value } objects)
   - Include optional `className` prop for styling

3. **Define specification type**
   - Create `Specification` interface
   - Include `key` property (string) for spec name
   - Include `value` property (string | number) for spec value

4. **Implement tab panel wrapper**
   - Use TabPanel component with value="specifications"
   - Pass specifications data to children
   - Apply styling for table container

5. **Add content validation**
   - Check if specifications array exists and has items
   - Show "No specifications available" message if empty
   - Handle null or undefined gracefully

6. **Create table container**
   - Use HTML table element
   - Apply full width styling
   - Add border and rounded corners

7. **Implement table structure**
   - Create table head with "Specification" and "Value" columns (optional)
   - Create table body for rows
   - Map over specifications array
   - Render SpecTableRow component for each spec (Task 75)

8. **Add alternating row styling**
   - Even rows: white background
   - Odd rows: light gray background (bg-gray-50)
   - Apply via CSS or conditional class

9. **Implement responsive layout**
   - Stack columns on mobile if needed
   - Maintain two-column layout on desktop
   - Adjust font sizes for mobile

### Specifications Tab Layout

```
┌──────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐ │
│  │ Specification            │ Value                   │ │
│  ├──────────────────────────┼─────────────────────────┤ │
│  │ Brand                    │ Sony                    │ │
│  ├──────────────────────────┼─────────────────────────┤ │
│  │ Model                    │ WH-1000XM5              │ │
│  ├──────────────────────────┼─────────────────────────┤ │
│  │ Color                    │ Midnight Black          │ │
│  ├──────────────────────────┼─────────────────────────┤ │
│  │ Connectivity             │ Bluetooth 5.2, Wired    │ │
│  ├──────────────────────────┼─────────────────────────┤ │
│  │ Battery Life             │ 30 hours                │ │
│  ├──────────────────────────┼─────────────────────────┤ │
│  │ Weight                   │ 250g                    │ │
│  ├──────────────────────────┼─────────────────────────┤ │
│  │ Warranty                 │ 1 year                  │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| specifications | Specification[] | Yes | [] | Array of spec objects |
| className | string | No | "" | Additional CSS classes |

### Specification Data Structure

| Property | Type | Example | Description |
|----------|------|---------|-------------|
| key | string | "Brand" | Specification name |
| value | string \| number | "Sony" | Specification value |

### Content States

| State | Display | Styling |
|-------|---------|---------|
| Has Specs | Table with rows | Normal |
| Empty | "No specifications available" | text-gray-500 |
| Loading | Skeleton loader | Animated |

### Table Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Table | `w-full border border-gray-200 rounded-lg overflow-hidden` | Base table |
| Header Row | `bg-gray-100 font-medium` | Optional header |
| Spec Row | `border-b last:border-0` | Row separator |
| Alternating | `even:bg-white odd:bg-gray-50` | Zebra striping |

### Expected Outcome
- Specifications displayed in clean table format
- Two-column layout (key and value)
- Alternating row backgrounds for readability
- Empty state if no specifications
- Responsive table layout
- Each row rendered by SpecTableRow component

### Checklist
- [ ] SpecificationsTab.tsx component created
- [ ] Props interface defined (specifications, className)
- [ ] Specification interface defined (key, value)
- [ ] TabPanel wrapper implemented
- [ ] Content validation added
- [ ] Empty state handling
- [ ] Table container created
- [ ] Table structure with head and body
- [ ] Map over specifications array
- [ ] Alternating row styling applied
- [ ] Responsive layout working
- [ ] Component exported from index.ts

---

## Task 75: Create Spec Table Row

### Overview
Create the SpecTableRow component that renders a single specification row in the specifications table. This component displays a specification key (label) in the first column and its corresponding value in the second column with proper styling and spacing.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 74 | Component | SpecificationsTab must exist |
| Specification Data | Props | Key-value data from parent |

### Instructions

1. **Create SpecTableRow component file**
   - Create `SpecTableRow.tsx` in `ProductTabs/` directory
   - Set up TypeScript React functional component
   - Import necessary types

2. **Define component props interface**
   - Create `SpecTableRowProps` interface
   - Include `specKey` prop (string) for specification name
   - Include `specValue` prop (string | number) for value
   - Include optional `className` prop for styling

3. **Implement table row structure**
   - Use HTML tr element
   - Create two td elements for key and value
   - Apply proper border and spacing

4. **Style specification key column**
   - First td element for spec name
   - Apply bold font weight
   - Set text color to gray-900
   - Set width to 30% of row

5. **Style specification value column**
   - Second td element for spec value
   - Apply normal font weight
   - Set text color to gray-700
   - Set width to 70% of row

6. **Add padding and spacing**
   - Apply px-4 py-3 padding to both cells
   - Ensure consistent vertical alignment
   - Add bottom border between rows

7. **Implement responsive styling**
   - Reduce padding on mobile (px-3 py-2)
   - Adjust font sizes for mobile
   - Maintain two-column layout

8. **Handle long values**
   - Allow value text to wrap
   - Use word-break if needed
   - Maintain proper line height

### Spec Table Row Structure

```
┌──────────────────────────────────────────────────────────┐
│ Specification Key (30%)    │ Specification Value (70%)  │
│ Brand                       │ Sony                       │
└──────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| specKey | string | Yes | - | Specification name/label |
| specValue | string \| number | Yes | - | Specification value |
| className | string | No | "" | Additional CSS classes |

### Column Layout

| Column | Width | Font | Color | Purpose |
|--------|-------|------|-------|---------|
| Key | 30% | Bold | gray-900 | Spec name |
| Value | 70% | Normal | gray-700 | Spec value |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Row | `border-b border-gray-200 last:border-0` | Row separator |
| Key Cell | `px-4 py-3 font-medium text-gray-900 w-[30%]` | Label column |
| Value Cell | `px-4 py-3 text-gray-700 w-[70%]` | Value column |

### Example Specifications

| Key | Value | Display |
|-----|-------|---------|
| Brand | Sony | **Brand** \| Sony |
| Weight | 250g | **Weight** \| 250g |
| Warranty | 1 year international | **Warranty** \| 1 year international |
| Dimensions | 25.4 x 21.9 x 7.6 cm | **Dimensions** \| 25.4 x 21.9 x 7.6 cm |

### Responsive Behavior

```
Mobile (< 640px)
├── Padding: px-3 py-2
├── Font: text-sm
└── Layout: Maintain 2-column

Desktop (≥ 640px)
├── Padding: px-4 py-3
├── Font: text-base
└── Layout: 30% / 70% split
```

### Expected Outcome
- Single table row with two columns
- Specification key displayed in bold
- Specification value displayed in normal weight
- Proper padding and spacing
- Border between rows
- Responsive font sizes
- Long values wrap properly

### Checklist
- [ ] SpecTableRow.tsx component created
- [ ] Props interface defined (specKey, specValue, className)
- [ ] Table row (tr) element created
- [ ] Two table data (td) cells implemented
- [ ] Key column styled (bold, 30% width)
- [ ] Value column styled (normal, 70% width)
- [ ] Padding applied to cells
- [ ] Border-bottom added to row
- [ ] Responsive styling applied
- [ ] Long value text wrapping handled
- [ ] Component exported from index.ts

---

## Summary

This document covered Tasks 69-75, creating the product tabs container with description and specifications tabs. The implementation includes:

- **Task 69:** ProductTabs container with tab state management
- **Task 70:** TabNavigation with clickable tabs and review count badge
- **Task 71:** TabPanel wrapper with animations
- **Task 72:** DescriptionTab displaying product HTML content
- **Task 73:** RichTextDisplay with HTML sanitization using DOMPurify
- **Task 74:** SpecificationsTab with table structure
- **Task 75:** SpecTableRow displaying individual specifications

These components provide users with detailed product information through an organized tabbed interface with safe HTML rendering and clean specification display.
