# Tasks 81-88: Page Display and Utility Components

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** F - Composite Components Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-89-92_Index-Storybook-Docs.md](02_Tasks-89-92_Index-Storybook-Docs.md)

---

## Document Overview

This document covers the creation of page display and utility components that form the foundation of the ERP dashboard interface. These composite components provide consistent layout structures, data presentation patterns, and user interaction utilities across the entire application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create PageHeader Component | Medium | 45 min |
| 82 | Create PageContainer Component | Low | 20 min |
| 83 | Create Breadcrumb Component | Medium | 35 min |
| 84 | Create DescriptionList Component | Medium | 40 min |
| 85 | Create Timeline Component | High | 60 min |
| 86 | Create StatusIndicator Component | Low | 25 min |
| 87 | Create CopyButton Component | Medium | 30 min |
| 88 | Create ExportButton Component | Medium | 35 min |

---

## Task 81: Create PageHeader Component

### Overview
Create a comprehensive PageHeader component that provides a consistent header structure for all pages in the ERP dashboard. This component displays the page title, optional description, breadcrumb navigation, action buttons, and an optional back navigation link.

### Dependencies
- React 18+ installed
- TypeScript configured
- Tailwind CSS setup complete
- Icon system available (from previous groups)
- Router configured (Next.js or React Router)

### Instructions

1. **Create component directory structure**
   - Navigate to `components/composite/` directory
   - Create `PageHeader/` subdirectory
   - This will house the PageHeader component and related files

2. **Create PageHeader.tsx file**
   - Create main component file
   - Set up TypeScript interface for props
   - Import necessary dependencies

3. **Define PageHeaderProps interface**
   - title: string (required) - Main page heading
   - description: string (optional) - Subtitle or page description
   - breadcrumb: BreadcrumbItem array (optional) - Navigation trail
   - actions: ReactNode (optional) - Action buttons or controls
   - backHref: string (optional) - URL for back navigation
   - className: string (optional) - Additional CSS classes

4. **Create title section**
   - Render h1 element for page title
   - Apply appropriate typography styles
   - Use semantic HTML for accessibility
   - Ensure proper heading hierarchy

5. **Add description section**
   - Conditionally render description if provided
   - Use muted text color for visual hierarchy
   - Position below title with appropriate spacing

6. **Integrate breadcrumb component**
   - Conditionally render breadcrumb if provided
   - Position above title
   - Pass breadcrumb items to Breadcrumb component
   - Ensure proper spacing

7. **Implement back navigation**
   - Conditionally render back button if backHref provided
   - Use router Link component for navigation
   - Include back arrow icon
   - Position at start of header

8. **Add actions section**
   - Conditionally render actions container if provided
   - Align to end of header (right side)
   - Apply flex layout for multiple actions
   - Ensure proper spacing between action items

9. **Apply responsive layout**
   - Use flex layout for header structure
   - Stack elements on mobile (< 768px)
   - Horizontal layout on larger screens
   - Adjust spacing and alignment per breakpoint

10. **Add accessibility attributes**
    - Use semantic HTML elements
    - Add aria-label where appropriate
    - Ensure keyboard navigation support
    - Test with screen readers

11. **Create component exports**
    - Export PageHeader component as default
    - Export PageHeaderProps type
    - Create index.ts barrel export

### PageHeader Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│                      PageHeader                                │
├────────────────────────────────────────────────────────────────┤
│  [ ← Back ] Home > Products > Inventory                        │  ← Breadcrumb
│                                                                │
│  Page Title                                    [ + Add ] [ ⋮ ] │  ← Title + Actions
│  Optional description text goes here                           │  ← Description
└────────────────────────────────────────────────────────────────┘
```

### Layout Variations

#### Basic Header (Title Only)
```
┌────────────────────────────────────────────────────────────────┐
│  Dashboard                                                     │
└────────────────────────────────────────────────────────────────┘
```

#### Header with Description
```
┌────────────────────────────────────────────────────────────────┐
│  Inventory Management                                          │
│  View and manage product stock levels                          │
└────────────────────────────────────────────────────────────────┘
```

#### Header with Breadcrumb and Actions
```
┌────────────────────────────────────────────────────────────────┐
│  Home > Sales > Orders                                         │
│                                                                │
│  Order #12345                          [ Edit ] [ Delete ]    │
└────────────────────────────────────────────────────────────────┘
```

#### Header with Back Navigation
```
┌────────────────────────────────────────────────────────────────┐
│  [ ← Back ]                                                    │
│                                                                │
│  Customer Details                      [ Edit ] [ Delete ]    │
│  View and manage customer information                          │
└────────────────────────────────────────────────────────────────┘
```

#### Full Featured Header
```
┌────────────────────────────────────────────────────────────────┐
│  [ ← Back ] Home > Products > Electronics > Laptops            │
│                                                                │
│  Product: Dell XPS 15               [ Edit ] [ Clone ] [ ⋮ ]  │
│  Manage product details, pricing, and inventory                │
└────────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

#### Desktop (≥ 1024px)
```
┌──────────────────────────────────────────────────────────────┐
│  Home > Products > Inventory                                 │
│                                                              │
│  Product Catalog                    [ Filter ] [ + Add ]    │
│  Browse and manage product listings                          │
└──────────────────────────────────────────────────────────────┘
```

#### Tablet (768px - 1023px)
```
┌──────────────────────────────────────────────────────────────┐
│  Home > Products > Inventory                                 │
│                                                              │
│  Product Catalog                    [ Filter ] [ + Add ]    │
│  Browse and manage product listings                          │
└──────────────────────────────────────────────────────────────┘
```

#### Mobile (< 768px)
```
┌────────────────────────────────────┐
│  Home > ... > Inventory            │
│                                    │
│  Product Catalog                   │
│  Browse and manage product         │
│  listings                          │
│                                    │
│  [ Filter ]  [ + Add ]             │
└────────────────────────────────────┘
```

### Component Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | Yes | - | Main page heading text |
| description | string | No | undefined | Subtitle or description |
| breadcrumb | BreadcrumbItem[] | No | undefined | Navigation breadcrumb trail |
| actions | ReactNode | No | undefined | Action buttons or controls |
| backHref | string | No | undefined | URL for back navigation |
| className | string | No | '' | Additional CSS classes |

### BreadcrumbItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | string | Yes | Breadcrumb item text |
| href | string | No | Link URL (omit for current page) |
| icon | ReactNode | No | Optional icon before label |

### Use Cases

| Scenario | Configuration | Components Used |
|----------|---------------|-----------------|
| List page | title + actions | Title, action buttons |
| Detail page | title + description + breadcrumb + actions | All elements |
| Edit page | title + backHref + actions | Title, back button, actions |
| Dashboard | title only | Title element |
| Nested view | breadcrumb + title + backHref | Navigation elements |

### Expected Outcome
- Functional PageHeader component
- Consistent header across all pages
- Flexible configuration options
- Responsive layout behavior
- Accessible navigation structure

### Verification Checklist
- [ ] PageHeader.tsx file created
- [ ] PageHeaderProps interface defined
- [ ] Title rendering implemented
- [ ] Description conditionally rendered
- [ ] Breadcrumb integration working
- [ ] Back navigation functional
- [ ] Actions section implemented
- [ ] Responsive layout applied
- [ ] Accessibility attributes added
- [ ] Component exported properly
- [ ] TypeScript types complete

---

## Task 82: Create PageContainer Component

### Overview
Create a PageContainer component that provides consistent page-level layout and spacing across the ERP dashboard. This component wraps page content with appropriate maximum width constraints, padding, and responsive behavior.

### Dependencies
- React 18+ installed
- TypeScript configured
- Tailwind CSS setup complete
- PageHeader component (Task 81)

### Instructions

1. **Create component file**
   - Navigate to `components/composite/` directory
   - Create `PageContainer/` subdirectory
   - Create `PageContainer.tsx` file

2. **Define PageContainerProps interface**
   - children: ReactNode (required) - Page content
   - maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' (optional)
   - padding: 'none' | 'sm' | 'md' | 'lg' (optional)
   - className: string (optional) - Additional classes

3. **Set up component structure**
   - Create main container div
   - Apply base container styles
   - Add responsive behavior

4. **Implement maxWidth prop**
   - Map maxWidth values to Tailwind classes
   - Default to '2xl' (1536px)
   - Apply max-width constraint
   - Center container with auto margins

5. **Implement padding prop**
   - Map padding values to Tailwind spacing
   - Default to 'md' (medium padding)
   - Apply responsive padding (less on mobile)
   - Ensure consistent spacing

6. **Add children rendering**
   - Render children inside container
   - Maintain proper content flow
   - Support any React elements

7. **Apply responsive adjustments**
   - Reduce padding on mobile devices
   - Maintain readability on all screen sizes
   - Ensure touch-friendly spacing

8. **Create component exports**
   - Export PageContainer as default
   - Export PageContainerProps type
   - Create index.ts barrel export

### PageContainer Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser Width                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     PageContainer                          │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │                                                      │  │  │
│  │  │              Page Content                            │  │  │
│  │  │              (children)                              │  │  │
│  │  │                                                      │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                    ↑ Max Width ↑                          │  │
│  │                   ↑ Padding ↑                             │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Max Width Options

| Value | Max Width | Use Case |
|-------|-----------|----------|
| 'sm' | 640px | Narrow forms, single-column content |
| 'md' | 768px | Standard forms, simple layouts |
| 'lg' | 1024px | Multi-column layouts, dashboards |
| 'xl' | 1280px | Wide dashboards, data tables |
| '2xl' | 1536px | Full-width layouts (default) |
| 'full' | 100% | Edge-to-edge content |

### Padding Options

| Value | Mobile | Tablet | Desktop | Use Case |
|-------|--------|--------|---------|----------|
| 'none' | 0 | 0 | 0 | Full-bleed content |
| 'sm' | 12px | 16px | 16px | Tight spacing |
| 'md' | 16px | 24px | 32px | Standard (default) |
| 'lg' | 20px | 32px | 48px | Generous spacing |

### Common Layout Patterns

#### Standard Page Layout
```
┌────────────────────────────────────────────────────────────────┐
│                      Browser Chrome                            │
├────────────────────────────────────────────────────────────────┤
│  Sidebar │ ┌─────────────────────────────────────────────┐    │
│          │ │  PageContainer (maxWidth='2xl', padding='md')│   │
│          │ │  ┌───────────────────────────────────────┐   │   │
│          │ │  │ PageHeader                             │   │   │
│          │ │  ├───────────────────────────────────────┤   │   │
│          │ │  │                                        │   │   │
│          │ │  │  Page Content                          │   │   │
│          │ │  │                                        │   │   │
│          │ │  └───────────────────────────────────────┘   │   │
│          │ └─────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

#### Narrow Form Layout
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│            ┌─────────────────────────────────────┐             │
│            │ PageContainer (maxWidth='sm')       │             │
│            │  ┌───────────────────────────────┐  │             │
│            │  │ Sign In Form                  │  │             │
│            │  │                               │  │             │
│            │  │ [ Username ]                  │  │             │
│            │  │ [ Password ]                  │  │             │
│            │  │ [ Sign In Button ]            │  │             │
│            │  └───────────────────────────────┘  │             │
│            └─────────────────────────────────────┘             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### Full-Width Dashboard
```
┌────────────────────────────────────────────────────────────────┐
│  PageContainer (maxWidth='full', padding='md')                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │  Card 1  │  │  Card 2  │  │  Card 3  │  │  Card 4  │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  │                                                          │  │
│  │  ┌──────────────────────────┐  ┌──────────────────────┐ │  │
│  │  │  Data Table              │  │  Chart               │ │  │
│  │  └──────────────────────────┘  └──────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Responsive Behavior Examples

#### Desktop View (≥ 1024px)
```
┌──────────────────────────────────────────────────────────────┐
│                        Full Width                            │
│    ┌────────────────────────────────────────────────┐        │
│    │  PageContainer (padding: 32px)                 │        │
│    │    Content with generous spacing               │        │
│    └────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────┘
```

#### Tablet View (768px - 1023px)
```
┌────────────────────────────────────────────────────────┐
│                   Tablet Width                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ PageContainer (padding: 24px)                │      │
│  │   Content with moderate spacing              │      │
│  └──────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────┘
```

#### Mobile View (< 768px)
```
┌────────────────────────────────┐
│        Mobile Width            │
│┌──────────────────────────────┐│
││ PageContainer (padding: 16px)││
││   Compact spacing            ││
│└──────────────────────────────┘│
└────────────────────────────────┘
```

### Integration with PageHeader

```
┌────────────────────────────────────────────────────────────────┐
│  PageContainer                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PageHeader                                              │  │
│  │  Home > Products                                         │  │
│  │  Product Catalog                        [ + Add ]       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  Page Content (children)                                │  │
│  │  - Product grid                                         │  │
│  │  - Filters                                              │  │
│  │  - Pagination                                           │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Page content to wrap |
| maxWidth | MaxWidth | No | '2xl' | Maximum container width |
| padding | Padding | No | 'md' | Container padding size |
| className | string | No | '' | Additional CSS classes |

### Expected Outcome
- Consistent page layout container
- Responsive width and padding
- Flexible configuration options
- Proper content centering
- Mobile-friendly spacing

### Verification Checklist
- [ ] PageContainer.tsx file created
- [ ] PageContainerProps interface defined
- [ ] maxWidth prop implemented
- [ ] padding prop implemented
- [ ] children rendering works
- [ ] Responsive behavior applied
- [ ] Component exported properly
- [ ] TypeScript types complete
- [ ] Integration with PageHeader tested

---

## Task 83: Create Breadcrumb Component

### Overview
Create a Breadcrumb component that provides hierarchical navigation trails throughout the ERP dashboard. This component displays a series of navigation links showing the user's current location in the application hierarchy, with support for icons and custom styling.

### Dependencies
- React 18+ installed
- TypeScript configured
- Tailwind CSS setup complete
- Router configured (Next.js or React Router)
- Icon system available

### Instructions

1. **Create component directory**
   - Navigate to `components/composite/` directory
   - Create `Breadcrumb/` subdirectory
   - Create component files

2. **Create Breadcrumb.tsx file**
   - Create main component file
   - Set up TypeScript interfaces
   - Import dependencies

3. **Define BreadcrumbItem interface**
   - label: string (required) - Display text
   - href: string (optional) - Link URL
   - icon: ReactNode (optional) - Icon element
   - Omit href for current page (non-clickable)

4. **Define BreadcrumbProps interface**
   - items: BreadcrumbItem[] (required)
   - separator: ReactNode (optional) - Custom separator
   - className: string (optional)

5. **Implement breadcrumb rendering**
   - Map through items array
   - Render each breadcrumb item
   - Add separators between items
   - Handle last item (current page)

6. **Create clickable breadcrumb items**
   - Use Link component for items with href
   - Apply appropriate styles
   - Add hover effects
   - Ensure keyboard accessibility

7. **Create current page item**
   - Render last item without link
   - Apply distinct styling (no hover)
   - Use aria-current="page" attribute
   - Muted color to indicate non-interactive

8. **Add icon support**
   - Conditionally render icon if provided
   - Position icon before label text
   - Apply appropriate spacing
   - Ensure icon alignment

9. **Implement separator rendering**
   - Use default separator (chevron or slash)
   - Support custom separator via prop
   - Apply consistent spacing
   - Position between items

10. **Add responsive behavior**
    - Collapse long breadcrumbs on mobile
    - Show abbreviated path ("Home > ... > Current")
    - Maintain full trail on larger screens
    - Ensure touch-friendly sizing

11. **Apply accessibility features**
    - Use nav element with aria-label
    - Add aria-current to current page
    - Ensure keyboard navigation
    - Provide screen reader support

12. **Create component exports**
    - Export Breadcrumb as default
    - Export BreadcrumbProps and BreadcrumbItem types
    - Create index.ts barrel export

### Breadcrumb Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│  Home  >  Products  >  Electronics  >  Laptops                 │
│   ↑        ↑            ↑              ↑                       │
│  Link     Link         Link          Current                  │
└────────────────────────────────────────────────────────────────┘
```

### Breadcrumb Variations

#### Simple Text Breadcrumb
```
Home > Products > Inventory
```

#### Breadcrumb with Icons
```
🏠 Home > 📦 Products > 📊 Inventory
```

#### Long Breadcrumb Path
```
Home > Sales > Orders > 2026 > January > Order #12345
```

#### Mobile Collapsed Breadcrumb
```
Home > ... > Order #12345
```

### Visual Examples

#### Desktop Breadcrumb (Full Path)
```
┌────────────────────────────────────────────────────────────────┐
│  🏠 Home > 👥 Customers > 📋 Customer List > 👤 John Doe       │
│                                              └─ Non-clickable  │
└────────────────────────────────────────────────────────────────┘
```

#### Tablet Breadcrumb (Full Path)
```
┌──────────────────────────────────────────────────────────┐
│  Home > Customers > Customer List > John Doe             │
└──────────────────────────────────────────────────────────┘
```

#### Mobile Breadcrumb (Collapsed)
```
┌────────────────────────────────┐
│  Home > ... > John Doe         │
└────────────────────────────────┘
```

### Breadcrumb Item States

#### Clickable Item (Hover State)
```
┌──────────┐
│  Home    │  ← Blue color, underline on hover
└──────────┘
```

#### Current Page Item
```
┌──────────┐
│  John Doe│  ← Muted color, no hover effect
└──────────┘
```

#### Item with Icon
```
┌────────────┐
│ 📦 Products│  ← Icon + Text
└────────────┘
```

### Separator Options

| Style | Character | Use Case |
|-------|-----------|----------|
| Chevron | > | Default, clear hierarchy |
| Slash | / | Compact, modern |
| Arrow | → | Directional emphasis |
| Dot | • | Minimal, subtle |

### Breadcrumb Hierarchy Examples

#### E-Commerce Navigation
```
Home > Products > Electronics > Laptops > Dell XPS 15
```

#### Customer Management
```
Home > Customers > Active Customers > Customer Details
```

#### Order Processing
```
Home > Sales > Orders > 2026 > January > Order #12345
```

#### Inventory Management
```
Home > Inventory > Warehouse A > Aisle 3 > Shelf B > Product SKU
```

#### Settings Navigation
```
Home > Settings > Company > Locations > Colombo Branch
```

### Responsive Collapse Patterns

#### 2 Items (Never collapse)
```
Desktop:  Home > Products
Tablet:   Home > Products
Mobile:   Home > Products
```

#### 3 Items (Collapse on mobile)
```
Desktop:  Home > Products > Laptops
Tablet:   Home > Products > Laptops
Mobile:   Home > ... > Laptops
```

#### 4+ Items (Collapse on mobile/tablet)
```
Desktop:  Home > Sales > Orders > January > Order #12345
Tablet:   Home > ... > January > Order #12345
Mobile:   Home > ... > Order #12345
```

### Accessibility Structure

```
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">Laptops</li>
  </ol>
</nav>
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| items | BreadcrumbItem[] | Yes | - | Array of breadcrumb items |
| separator | ReactNode | No | '>' | Custom separator element |
| className | string | No | '' | Additional CSS classes |

### BreadcrumbItem Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | string | Yes | Display text for item |
| href | string | No | Link URL (omit for current page) |
| icon | ReactNode | No | Optional icon before label |

### Expected Outcome
- Functional breadcrumb navigation
- Clear visual hierarchy
- Responsive collapse behavior
- Icon support
- Accessible navigation structure

### Verification Checklist
- [ ] Breadcrumb.tsx file created
- [ ] BreadcrumbProps interface defined
- [ ] BreadcrumbItem interface defined
- [ ] Item rendering implemented
- [ ] Separator rendering working
- [ ] Icon support added
- [ ] Current page styling applied
- [ ] Responsive collapse implemented
- [ ] Accessibility attributes added
- [ ] Router integration working
- [ ] Component exported properly

---

## Task 84: Create DescriptionList Component

### Overview
Create a DescriptionList component that displays key-value pairs in a structured, readable format. This component is commonly used for displaying entity details, configuration settings, and metadata throughout the ERP dashboard, supporting multiple column layouts and orientation options.

### Dependencies
- React 18+ installed
- TypeScript configured
- Tailwind CSS setup complete

### Instructions

1. **Create component directory**
   - Navigate to `components/composite/` directory
   - Create `DescriptionList/` subdirectory
   - Create component files

2. **Create DescriptionList.tsx file**
   - Create main component file
   - Set up TypeScript interfaces
   - Import dependencies

3. **Define DescriptionItem interface**
   - label: string (required) - Field label/key
   - value: ReactNode (required) - Field value/content
   - className: string (optional) - Custom styling

4. **Define DescriptionListProps interface**
   - items: DescriptionItem[] (required)
   - columns: 1 | 2 | 3 (optional) - Number of columns
   - orientation: 'horizontal' | 'vertical' (optional)
   - className: string (optional)

5. **Set up base component structure**
   - Create wrapper element
   - Apply grid layout
   - Set default props

6. **Implement column layout**
   - Map columns prop to CSS grid columns
   - Default to 1 column
   - Support 2 and 3 column layouts
   - Apply responsive behavior

7. **Implement horizontal orientation**
   - Label and value on same row
   - Label on left, value on right
   - Apply appropriate spacing
   - Use flex layout for alignment

8. **Implement vertical orientation**
   - Label above value
   - Stack vertically
   - Apply appropriate spacing
   - Use block layout

9. **Style labels consistently**
   - Apply muted color
   - Use smaller font size
   - Add font weight for emphasis
   - Ensure readability

10. **Style values consistently**
    - Use default text color
    - Apply appropriate font size
    - Support rich content (ReactNode)
    - Handle long text wrapping

11. **Add responsive behavior**
    - Reduce columns on smaller screens
    - Stack on mobile regardless of columns prop
    - Adjust spacing per breakpoint
    - Ensure touch-friendly layout

12. **Create component exports**
    - Export DescriptionList as default
    - Export DescriptionListProps and DescriptionItem types
    - Create index.ts barrel export

### DescriptionList Layout Options

#### 1 Column - Horizontal Orientation
```
┌────────────────────────────────────────────────┐
│  Customer Name:    John Doe                    │
│  Email:            john@example.com            │
│  Phone:            +94 77 123 4567             │
│  Status:           Active                      │
└────────────────────────────────────────────────┘
```

#### 1 Column - Vertical Orientation
```
┌────────────────────────────────────────────────┐
│  Customer Name                                 │
│  John Doe                                      │
│                                                │
│  Email                                         │
│  john@example.com                              │
│                                                │
│  Phone                                         │
│  +94 77 123 4567                               │
└────────────────────────────────────────────────┘
```

#### 2 Columns - Horizontal Orientation
```
┌───────────────────────────┬───────────────────────────┐
│  Name:      John Doe      │  Status:    Active        │
│  Email:     john@...      │  Type:      Premium       │
│  Phone:     +94 77...     │  Since:     Jan 2026      │
└───────────────────────────┴───────────────────────────┘
```

#### 3 Columns - Horizontal Orientation
```
┌─────────────────┬─────────────────┬─────────────────┐
│  Name:   John   │  Status: Active │  Type: Premium  │
│  Email:  john@  │  Phone: +94 77  │  Since: Jan 26  │
└─────────────────┴─────────────────┴─────────────────┘
```

### Detailed Layout Examples

#### Customer Details (1 Column, Horizontal)
```
┌────────────────────────────────────────────────────────────────┐
│  Customer Name:           John Doe                             │
│  Email Address:           john.doe@example.com                 │
│  Phone Number:            +94 77 123 4567                      │
│  Customer Type:           Premium                              │
│  Account Status:          Active                               │
│  Member Since:            January 15, 2026                     │
│  Total Orders:            47                                   │
│  Lifetime Value:          LKR 125,450.00                       │
└────────────────────────────────────────────────────────────────┘
```

#### Order Summary (2 Columns, Horizontal)
```
┌─────────────────────────────────┬─────────────────────────────────┐
│  Order Number:                  │  Payment Method:                │
│  #ORD-2026-00123                │  Credit Card                    │
│                                 │                                 │
│  Order Date:                    │  Payment Status:                │
│  January 25, 2026               │  Paid                           │
│                                 │                                 │
│  Customer:                      │  Delivery Method:               │
│  John Doe                       │  Express Shipping               │
│                                 │                                 │
│  Subtotal:                      │  Tax:                           │
│  LKR 10,000.00                  │  LKR 1,500.00                   │
│                                 │                                 │
│  Shipping:                      │  Total:                         │
│  LKR 500.00                     │  LKR 12,000.00                  │
└─────────────────────────────────┴─────────────────────────────────┘
```

#### Product Specifications (3 Columns, Vertical)
```
┌──────────────────┬──────────────────┬──────────────────┐
│  Brand           │  Model           │  SKU             │
│  Dell            │  XPS 15          │  DELL-XPS15-001  │
│                  │                  │                  │
│  Processor       │  RAM             │  Storage         │
│  Intel i7        │  16GB            │  512GB SSD       │
│                  │                  │                  │
│  Display         │  Graphics        │  Weight          │
│  15.6" FHD       │  NVIDIA GTX 1650 │  1.8 kg          │
└──────────────────┴──────────────────┴──────────────────┘
```

### Responsive Behavior

#### Desktop (≥ 1024px)
```
3 columns → 3 columns
2 columns → 2 columns
1 column  → 1 column
```

#### Tablet (768px - 1023px)
```
3 columns → 2 columns
2 columns → 2 columns
1 column  → 1 column
```

#### Mobile (< 768px)
```
3 columns → 1 column
2 columns → 1 column
1 column  → 1 column
```

### Orientation Comparison

#### Horizontal (Label: Value on same line)
```
┌────────────────────────────────────────────────┐
│  Product Name:        Dell XPS 15              │
│  Price:               LKR 250,000              │
│  Stock:               15 units                 │
└────────────────────────────────────────────────┘

Best for:
- Compact display
- Quick scanning
- Short values
- Dense information
```

#### Vertical (Label above Value)
```
┌────────────────────────────────────────────────┐
│  Product Name                                  │
│  Dell XPS 15                                   │
│                                                │
│  Price                                         │
│  LKR 250,000                                   │
│                                                │
│  Stock                                         │
│  15 units available                            │
└────────────────────────────────────────────────┘

Best for:
- Long values
- Emphasis on values
- Rich content (badges, links)
- Breathing room
```

### Complex Value Types

#### With Status Badges
```
┌────────────────────────────────────────────────┐
│  Order Status:        [ ✓ Delivered ]          │
│  Payment Status:      [ ✓ Paid ]               │
│  Shipping Status:     [ → In Transit ]         │
└────────────────────────────────────────────────┘
```

#### With Links
```
┌────────────────────────────────────────────────┐
│  Customer:           John Doe (View Profile)   │
│  Invoice:            #INV-123 (Download PDF)   │
│  Tracking:           TRK-456 (Track Package)   │
└────────────────────────────────────────────────┘
```

#### With Formatted Content
```
┌────────────────────────────────────────────────┐
│  Description:        High-performance laptop   │
│                      with stunning display and │
│                      long battery life.        │
│                                                │
│  Specifications:     • Intel Core i7           │
│                      • 16GB RAM                │
│                      • 512GB SSD               │
└────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| items | DescriptionItem[] | Yes | - | Array of label-value pairs |
| columns | 1 \| 2 \| 3 | No | 1 | Number of columns |
| orientation | 'horizontal' \| 'vertical' | No | 'horizontal' | Layout orientation |
| className | string | No | '' | Additional CSS classes |

### DescriptionItem Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | string | Yes | Field label/key |
| value | ReactNode | Yes | Field value/content |
| className | string | No | Custom item styling |

### Use Cases by Layout

| Layout | Best For | Example Use |
|--------|----------|-------------|
| 1 col, horizontal | Detailed views, forms | Customer details page |
| 1 col, vertical | Emphasis on values | Product descriptions |
| 2 col, horizontal | Balanced information | Order summaries |
| 2 col, vertical | Rich content | Feature comparisons |
| 3 col, horizontal | Dense data | Product specifications |
| 3 col, vertical | Structured data | Comparison tables |

### Expected Outcome
- Flexible description list component
- Multiple layout configurations
- Responsive column behavior
- Support for rich content values
- Consistent styling across application

### Verification Checklist
- [ ] DescriptionList.tsx file created
- [ ] DescriptionListProps interface defined
- [ ] DescriptionItem interface defined
- [ ] Column layout implemented
- [ ] Horizontal orientation working
- [ ] Vertical orientation working
- [ ] Label styling applied
- [ ] Value styling applied
- [ ] Responsive behavior implemented
- [ ] Rich content support verified
- [ ] Component exported properly

---

## Task 85: Create Timeline Component

### Overview
Create a Timeline component that displays chronological events in a vertical timeline format. This component is ideal for showing order history, status updates, activity logs, and other time-based sequences in the ERP dashboard. Each timeline item includes a date, title, description, icon, and status indicator.

### Dependencies
- React 18+ installed
- TypeScript configured
- Tailwind CSS setup complete
- Icon system available
- Date formatting library (date-fns or dayjs)

### Instructions

1. **Create component directory**
   - Navigate to `components/composite/` directory
   - Create `Timeline/` subdirectory
   - Create component files

2. **Create Timeline.tsx file**
   - Create main component file
   - Set up TypeScript interfaces
   - Import dependencies

3. **Define TimelineItem interface**
   - date: Date | string (required) - Event timestamp
   - title: string (required) - Event title
   - description: string (optional) - Event details
   - icon: ReactNode (optional) - Custom icon
   - status: 'success' | 'pending' | 'error' | 'info' (optional)

4. **Define TimelineProps interface**
   - items: TimelineItem[] (required)
   - className: string (optional)

5. **Set up timeline structure**
   - Create vertical timeline container
   - Add connecting line between items
   - Position items along timeline

6. **Create timeline item rendering**
   - Map through items array
   - Render each timeline entry
   - Position elements correctly
   - Apply consistent spacing

7. **Implement date display**
   - Format date for display
   - Support Date objects and ISO strings
   - Use relative time for recent dates
   - Show full date for older events

8. **Add icon support**
   - Render custom icon if provided
   - Use default icon based on status
   - Position icon on timeline
   - Apply status-based styling

9. **Implement status indicators**
   - Map status to colors
   - Success: green
   - Pending: yellow/amber
   - Error: red
   - Info: blue
   - Apply to icon and connector

10. **Style timeline connector**
    - Vertical line connecting items
    - Different style for last item
    - Match status colors
    - Create visual flow

11. **Add title and description**
    - Render title prominently
    - Display description below title
    - Apply appropriate typography
    - Handle optional description

12. **Implement responsive layout**
    - Adjust spacing on mobile
    - Maintain readability
    - Keep vertical orientation
    - Ensure touch-friendly sizing

13. **Create component exports**
    - Export Timeline as default
    - Export TimelineProps and TimelineItem types
    - Create index.ts barrel export

### Timeline Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   ●────  Jan 25, 10:30 AM                                      │
│   │      Order Placed                                          │
│   │      Order #12345 has been placed successfully             │
│   │                                                            │
│   ●────  Jan 25, 10:45 AM                                      │
│   │      Payment Confirmed                                     │
│   │      Payment of LKR 12,000 received                        │
│   │                                                            │
│   ●────  Jan 25, 11:00 AM                                      │
│   │      Processing                                            │
│   │      Order is being prepared for shipment                  │
│   │                                                            │
│   ○      Pending Shipment                                      │
│          Waiting for courier pickup                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Timeline Variations

#### Basic Timeline (Text Only)
```
●─── Order Placed
│
●─── Payment Confirmed
│
●─── Processing
│
○    Pending Shipment
```

#### Timeline with Dates
```
Jan 25, 10:30 AM  ●─── Order Placed
                  │
Jan 25, 10:45 AM  ●─── Payment Confirmed
                  │
Jan 25, 11:00 AM  ●─── Processing
                  │
Pending...        ○    Awaiting Shipment
```

#### Timeline with Status Colors
```
🟢─── Completed        (Green - Success)
│
🟢─── Completed        (Green - Success)
│
🟡─── In Progress      (Yellow - Pending)
│
⚪─── Not Started      (Gray - Info)
```

### Detailed Timeline Example: Order Tracking

```
┌────────────────────────────────────────────────────────────────┐
│  Order Timeline - #ORD-2026-00123                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🟢────  January 25, 2026 10:30 AM                             │
│   │      Order Placed                                          │
│   │      Your order has been successfully placed.              │
│   │      Order total: LKR 12,000.00                            │
│   │                                                            │
│  🟢────  January 25, 2026 10:45 AM                             │
│   │      Payment Confirmed                                     │
│   │      Payment received via Credit Card (**** 1234)          │
│   │      Transaction ID: TXN-789456123                         │
│   │                                                            │
│  🟢────  January 25, 2026 11:30 AM                             │
│   │      Order Processing                                      │
│   │      Your items are being prepared for shipment.           │
│   │      Estimated packaging time: 30 minutes                  │
│   │                                                            │
│  🟢────  January 25, 2026 2:00 PM                              │
│   │      Ready for Pickup                                      │
│   │      Package ready for courier collection.                 │
│   │      Package ID: PKG-2026-001234                           │
│   │                                                            │
│  🟡────  January 25, 2026 4:30 PM (In Progress)                │
│   │      Out for Delivery                                      │
│   │      Package is with courier: DHL Express                  │
│   │      Tracking: DHL-789456123                               │
│   │                                                            │
│  ⚪      Estimated Delivery                                     │
│          January 26, 2026 by 5:00 PM                           │
│          Delivery address: 123 Galle Road, Colombo 03          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Timeline Example: Customer Activity Log

```
┌────────────────────────────────────────────────────────────────┐
│  Customer Activity - John Doe                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  👤────  2 hours ago                                           │
│   │      Profile Updated                                       │
│   │      Customer updated phone number and email address       │
│   │                                                            │
│  🛒────  Yesterday at 3:45 PM                                  │
│   │      Purchase Made                                         │
│   │      Order #ORD-123 - Total: LKR 5,400.00                  │
│   │                                                            │
│  💬────  Jan 23, 2026                                          │
│   │      Support Ticket Created                                │
│   │      Ticket #TKT-456 - "Question about warranty"           │
│   │                                                            │
│  ⭐────  Jan 20, 2026                                          │
│   │      Review Submitted                                      │
│   │      5-star review for "Dell XPS 15"                       │
│   │                                                            │
│  📧────  Jan 15, 2026                                          │
│   │      Account Created                                       │
│          Welcome email sent to john@example.com                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Timeline Example: Support Ticket History

```
┌────────────────────────────────────────────────────────────────┐
│  Ticket History - #TKT-2026-00789                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🟢────  Jan 25, 2026 3:30 PM                                  │
│   │      Ticket Resolved                                       │
│   │      Issue resolved by Support Agent: Sarah K.             │
│   │      Resolution: Provided replacement product              │
│   │                                                            │
│  🟡────  Jan 25, 2026 2:00 PM                                  │
│   │      Response Sent                                         │
│   │      Support agent replied with solution                   │
│   │      Response time: 45 minutes                             │
│   │                                                            │
│  🟡────  Jan 25, 2026 1:15 PM                                  │
│   │      Ticket Assigned                                       │
│   │      Assigned to: Support Agent Sarah K.                   │
│   │      Priority: High                                        │
│   │                                                            │
│  🔵────  Jan 25, 2026 12:30 PM                                 │
│          Ticket Created                                        │
│          Customer: John Doe                                    │
│          Subject: "Product not working as expected"            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Status Indicator Colors

| Status | Color | Use Case | Icon Example |
|--------|-------|----------|--------------|
| success | Green | Completed actions | ✓ Checkmark |
| pending | Yellow/Amber | In progress | ⏳ Hourglass |
| error | Red | Failed/Error | ✗ Cross |
| info | Blue | Informational | ℹ Info |

### Date Formatting Guidelines

| Time Difference | Display Format | Example |
|----------------|----------------|---------|
| < 1 minute | "Just now" | Just now |
| < 1 hour | "X minutes ago" | 15 minutes ago |
| < 24 hours | "X hours ago" | 3 hours ago |
| < 7 days | "X days ago" | 2 days ago |
| < 30 days | "Month Day" | Jan 25 |
| > 30 days | "Month Day, Year" | Dec 15, 2025 |

### Timeline Icon Recommendations

| Event Type | Icon | Color |
|------------|------|-------|
| Order placed | 🛒 Shopping Cart | Blue |
| Payment | 💳 Credit Card | Green |
| Shipment | 📦 Package | Orange |
| Delivery | 🚚 Truck | Green |
| Update | 🔄 Refresh | Blue |
| Message | 💬 Chat | Blue |
| User action | 👤 User | Gray |
| Success | ✓ Check | Green |
| Error | ✗ Cross | Red |

### Responsive Behavior

#### Desktop View
```
┌──────────────────────────────────────────────┐
│                                              │
│  Jan 25, 10:30 AM  🟢────  Order Placed      │
│                     │      Details...        │
│                     │                        │
│  Jan 25, 10:45 AM  🟢────  Payment Confirmed │
│                     │      Details...        │
└──────────────────────────────────────────────┘
```

#### Mobile View
```
┌────────────────────────┐
│                        │
│  🟢─── Order Placed     │
│   │    Jan 25, 10:30 AM│
│   │    Details...      │
│   │                    │
│  🟢─── Payment Confirmed│
│        Jan 25, 10:45 AM│
│        Details...      │
└────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| items | TimelineItem[] | Yes | - | Array of timeline events |
| className | string | No | '' | Additional CSS classes |

### TimelineItem Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| date | Date \| string | Yes | Event timestamp |
| title | string | Yes | Event title |
| description | string | No | Event details/description |
| icon | ReactNode | No | Custom icon element |
| status | TimelineStatus | No | Event status (affects color) |

### Expected Outcome
- Functional timeline component
- Chronological event display
- Status-based styling
- Flexible date formatting
- Icon support
- Responsive layout

### Verification Checklist
- [ ] Timeline.tsx file created
- [ ] TimelineProps interface defined
- [ ] TimelineItem interface defined
- [ ] Timeline structure implemented
- [ ] Date formatting working
- [ ] Icon rendering functional
- [ ] Status indicators applied
- [ ] Timeline connector styled
- [ ] Title and description rendering
- [ ] Responsive layout implemented
- [ ] Component exported properly

---

## Task 86: Create StatusIndicator Component

### Overview
Create a StatusIndicator component that displays status information with consistent visual styling across the ERP dashboard. This component shows status labels with color-coded badges, optional status dots, and configurable sizing. It's used throughout the application to indicate order status, payment status, user status, and other state information.

### Dependencies
- React 18+ installed
- TypeScript configured
- Tailwind CSS setup complete
- Color system from design tokens

### Instructions

1. **Create component directory**
   - Navigate to `components/composite/` directory
   - Create `StatusIndicator/` subdirectory
   - Create component files

2. **Create StatusIndicator.tsx file**
   - Create main component file
   - Set up TypeScript interfaces
   - Import dependencies

3. **Define status type mapping**
   - Create STATUS_CONFIG object
   - Map status keys to colors and labels
   - Support common status types

4. **Define StatusIndicatorProps interface**
   - status: string (required) - Status key
   - label: string (optional) - Custom label override
   - showDot: boolean (optional) - Show status dot
   - size: 'sm' | 'md' | 'lg' (optional) - Component size
   - className: string (optional)

5. **Implement status color logic**
   - Map status to Tailwind color classes
   - Support background, text, and dot colors
   - Fallback to neutral for unknown status

6. **Create status label rendering**
   - Display status label text
   - Use custom label if provided
   - Apply appropriate typography
   - Apply status-based text color

7. **Implement status dot**
   - Conditionally render dot if showDot=true
   - Position before label
   - Apply status color
   - Animate with pulse for active states

8. **Implement size variations**
   - Small (sm): Compact, for tables
   - Medium (md): Standard, default size
   - Large (lg): Prominent, for headers
   - Adjust font size and padding

9. **Style badge container**
   - Apply rounded corners
   - Add background color with opacity
   - Set padding based on size
   - Use inline-flex for content fitting

10. **Create component exports**
    - Export StatusIndicator as default
    - Export StatusIndicatorProps type
    - Export status type constants
    - Create index.ts barrel export

### StatusIndicator Component Structure

```
┌─────────────────────────┐
│  ● Active               │  ← Dot + Label
└─────────────────────────┘

┌─────────────────────────┐
│  Paid                   │  ← Label only
└─────────────────────────┘
```

### Status Type Mappings

| Status Key | Label | Color | Use Case |
|------------|-------|-------|----------|
| active | Active | Green | User/Account status |
| inactive | Inactive | Gray | User/Account status |
| pending | Pending | Yellow | Order/Payment status |
| processing | Processing | Blue | Order status |
| completed | Completed | Green | Order/Task status |
| cancelled | Cancelled | Red | Order status |
| failed | Failed | Red | Payment/Process status |
| paid | Paid | Green | Payment status |
| unpaid | Unpaid | Red | Payment status |
| partial | Partially Paid | Orange | Payment status |
| shipped | Shipped | Blue | Order status |
| delivered | Delivered | Green | Order status |
| draft | Draft | Gray | Document status |
| published | Published | Green | Content status |

### Size Variations

#### Small (sm)
```
┌──────────────┐
│ ● Active     │  ← Compact, for dense layouts
└──────────────┘
Font: 12px, Padding: 4px 8px
```

#### Medium (md) - Default
```
┌─────────────────┐
│ ● Active        │  ← Standard size
└─────────────────┘
Font: 14px, Padding: 6px 12px
```

#### Large (lg)
```
┌────────────────────┐
│ ● Active           │  ← Prominent display
└────────────────────┘
Font: 16px, Padding: 8px 16px
```

### Visual Examples

#### Order Status Indicators
```
┌─────────────────────────────────────────────────────────────────┐
│  Order #12345                                                   │
│  Status: [ ● Pending ]                                          │
│                                                                 │
│  Order #12346                                                   │
│  Status: [ ● Processing ]                                       │
│                                                                 │
│  Order #12347                                                   │
│  Status: [ ● Shipped ]                                          │
│                                                                 │
│  Order #12348                                                   │
│  Status: [ ● Delivered ]                                        │
└─────────────────────────────────────────────────────────────────┘
```

#### Payment Status Indicators
```
┌─────────────────────────────────────────────────────────────────┐
│  Invoice #001:  [ Paid ]           Green background             │
│  Invoice #002:  [ Unpaid ]         Red background               │
│  Invoice #003:  [ Partially Paid ] Orange background            │
│  Invoice #004:  [ Pending ]        Yellow background            │
└─────────────────────────────────────────────────────────────────┘
```

#### User Status Indicators
```
┌─────────────────────────────────────────────────────────────────┐
│  John Doe       [ ● Active ]       Green with pulse             │
│  Jane Smith     [ Inactive ]       Gray, no pulse               │
│  Bob Wilson     [ ● Active ]       Green with pulse             │
└─────────────────────────────────────────────────────────────────┘
```

### Color System

#### Green (Success/Active/Completed)
```
Background: bg-green-100
Text: text-green-700
Dot: bg-green-500
Border: border-green-200
```

#### Red (Error/Failed/Cancelled)
```
Background: bg-red-100
Text: text-red-700
Dot: bg-red-500
Border: border-red-200
```

#### Yellow (Warning/Pending)
```
Background: bg-yellow-100
Text: text-yellow-700
Dot: bg-yellow-500
Border: border-yellow-200
```

#### Blue (Info/Processing)
```
Background: bg-blue-100
Text: text-blue-700
Dot: bg-blue-500
Border: border-blue-200
```

#### Gray (Neutral/Inactive)
```
Background: bg-gray-100
Text: text-gray-700
Dot: bg-gray-500
Border: border-gray-200
```

#### Orange (Partial/In Progress)
```
Background: bg-orange-100
Text: text-orange-700
Dot: bg-orange-500
Border: border-orange-200
```

### Table Integration Example

```
┌──────────────┬──────────────┬─────────────────┬─────────────┐
│ Order #      │ Customer     │ Amount          │ Status      │
├──────────────┼──────────────┼─────────────────┼─────────────┤
│ #12345       │ John Doe     │ LKR 12,000      │ [Delivered] │
│ #12346       │ Jane Smith   │ LKR 8,500       │ [Shipped]   │
│ #12347       │ Bob Wilson   │ LKR 15,200      │ [Processing]│
│ #12348       │ Alice Brown  │ LKR 3,400       │ [Pending]   │
└──────────────┴──────────────┴─────────────────┴─────────────┘
```

### Dot Variations

#### With Dot (showDot=true)
```
[ ● Active ]    ← Animated pulse for active states
```

#### Without Dot (showDot=false)
```
[ Active ]      ← Simple badge, cleaner look
```

### Animation States

#### Static (No Animation)
```
[ ● Delivered ]     Completed states: no animation
[ Cancelled ]       Cancelled states: no animation
```

#### Pulsing (Animated)
```
[ ● Processing ]    Active/In-progress: pulse animation
[ ● Pending ]       Waiting states: slow pulse
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| status | string | Yes | - | Status key (e.g., 'active', 'pending') |
| label | string | No | Auto | Custom label override |
| showDot | boolean | No | false | Show status dot indicator |
| size | 'sm' \| 'md' \| 'lg' | No | 'md' | Component size |
| className | string | No | '' | Additional CSS classes |

### Common Status Configurations

| Status | Default Label | Color | Show Dot | Use Case |
|--------|---------------|-------|----------|----------|
| active | Active | Green | true | User online status |
| pending | Pending | Yellow | false | Order awaiting action |
| completed | Completed | Green | false | Finished task |
| processing | Processing | Blue | true | Order being processed |
| failed | Failed | Red | false | Failed operation |
| cancelled | Cancelled | Red | false | Cancelled order |

### Expected Outcome
- Reusable status indicator component
- Consistent status styling
- Configurable appearance
- Support for common status types
- Accessible color contrast

### Verification Checklist
- [ ] StatusIndicator.tsx file created
- [ ] StatusIndicatorProps interface defined
- [ ] Status type mapping implemented
- [ ] Status color logic working
- [ ] Label rendering functional
- [ ] Dot rendering conditional
- [ ] Size variations implemented
- [ ] Badge styling applied
- [ ] Animation for active states
- [ ] Component exported properly

---

## Task 87: Create CopyButton Component

### Overview
Create a CopyButton component that allows users to copy text to their clipboard with visual feedback. This component uses the Navigator Clipboard API to copy values and provides immediate feedback through icon changes and optional toast notifications. Commonly used for copying IDs, codes, URLs, and other reference data.

### Dependencies
- React 18+ installed
- TypeScript configured
- Tailwind CSS setup complete
- Icon system available
- Browser Clipboard API support

### Instructions

1. **Create component directory**
   - Navigate to `components/composite/` directory
   - Create `CopyButton/` subdirectory
   - Create component files

2. **Create CopyButton.tsx file**
   - Create main component file
   - Set up TypeScript interfaces
   - Import dependencies

3. **Define CopyButtonProps interface**
   - value: string (required) - Text to copy
   - onCopy: function (optional) - Callback after copy
   - label: string (optional) - Button label
   - showLabel: boolean (optional) - Show/hide label
   - size: 'sm' | 'md' | 'lg' (optional) - Button size
   - className: string (optional)

4. **Set up component state**
   - Create copied state (boolean)
   - Track copy status
   - Reset after delay

5. **Implement copy functionality**
   - Use navigator.clipboard.writeText()
   - Handle async operation
   - Set copied state on success
   - Invoke onCopy callback if provided

6. **Add error handling**
   - Try-catch for clipboard operation
   - Fallback for unsupported browsers
   - Log errors for debugging
   - Show error feedback to user

7. **Create icon rendering**
   - Show copy icon by default
   - Show checkmark icon when copied
   - Smooth transition between states
   - Use appropriate icon size

8. **Implement visual feedback**
   - Change icon when copied
   - Update button color/style
   - Show "Copied!" text briefly
   - Reset after 2 seconds

9. **Add label support**
   - Conditionally show label text
   - Position label next to icon
   - Hide on small sizes if needed
   - Ensure proper spacing

10. **Implement size variations**
    - Small: Icon only, compact
    - Medium: Icon + optional label
    - Large: Icon + label, prominent
    - Adjust padding and font size

11. **Add accessibility features**
    - Use button element
    - Add aria-label
    - Announce copy success to screen readers
    - Support keyboard activation

12. **Create component exports**
    - Export CopyButton as default
    - Export CopyButtonProps type
    - Create index.ts barrel export

### CopyButton Component States

#### Default State
```
┌──────────┐
│  📋 Copy │  ← Copy icon + label
└──────────┘
```

#### Copied State (Temporary)
```
┌─────────────┐
│  ✓ Copied!  │  ← Checkmark + feedback
└─────────────┘
```

### Size Variations

#### Small (sm)
```
┌────┐
│ 📋 │  ← Icon only
└────┘
```

#### Medium (md) - Default
```
┌──────────┐
│ 📋 Copy  │  ← Icon + label
└──────────┘
```

#### Large (lg)
```
┌──────────────┐
│  📋  Copy    │  ← Larger icon + label
└──────────────┘
```

### Visual Examples

#### Copy Order Number
```
┌────────────────────────────────────────────────────────────────┐
│  Order Number: #ORD-2026-00123  [ 📋 Copy ]                    │
└────────────────────────────────────────────────────────────────┘

After Click:
┌────────────────────────────────────────────────────────────────┐
│  Order Number: #ORD-2026-00123  [ ✓ Copied! ]                 │
└────────────────────────────────────────────────────────────────┘
```

#### Copy Invoice ID in Table
```
┌──────────────────────┬────────────────┬──────────────┐
│ Invoice              │ Amount         │ Action       │
├──────────────────────┼────────────────┼──────────────┤
│ INV-001  [ 📋 ]      │ LKR 10,000     │ View         │
│ INV-002  [ 📋 ]      │ LKR 8,500      │ View         │
│ INV-003  [ 📋 ]      │ LKR 15,200     │ View         │
└──────────────────────┴────────────────┴──────────────┘
```

#### Copy API Key
```
┌────────────────────────────────────────────────────────────────┐
│  API Key                                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ sk_live_abcdef123456789...                [ 📋 Copy ]    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

#### Copy Tracking Number
```
┌────────────────────────────────────────────────────────────────┐
│  Tracking Number                                               │
│  TRK-789456123                          [ 📋 Copy to Clipboard]│
└────────────────────────────────────────────────────────────────┘
```

### Copy Functionality Flow

```
User Clicks Button
       ↓
Check Clipboard API Support
       ↓
   Supported? ──No──→ Show Error Message
       ↓ Yes
Copy Value to Clipboard
       ↓
   Success? ──No──→ Show Error Feedback
       ↓ Yes
Set copied=true
       ↓
Show "Copied!" Feedback
       ↓
Invoke onCopy Callback
       ↓
Wait 2 seconds
       ↓
Reset to Default State
```

### State Transition Timeline

```
Time: 0s        Click Event
      ↓
      [📋 Copy] → User clicks
      ↓
Time: 0.1s      Copy Operation
      ↓
      [✓ Copied!] → Feedback shown
      ↓
Time: 2.1s      Reset
      ↓
      [📋 Copy] → Back to default
```

### Use Cases

| Context | Value to Copy | Button Style | Label |
|---------|---------------|--------------|-------|
| Order details | Order ID | Small, icon only | No label |
| Invoice page | Invoice number | Medium | "Copy" |
| API settings | API key | Large | "Copy to Clipboard" |
| Tracking | Tracking code | Medium | "Copy Tracking" |
| Customer ID | Customer UID | Small | Icon only |
| Share link | URL | Large | "Copy Link" |

### Error Handling Scenarios

#### Clipboard API Not Supported
```
Browser doesn't support Clipboard API
       ↓
Show error message: "Copy not supported"
       ↓
Optionally: Show manual copy instructions
```

#### Permission Denied
```
User denied clipboard permission
       ↓
Show error: "Permission denied"
       ↓
Suggest: Check browser settings
```

#### Copy Failed
```
Clipboard operation failed
       ↓
Show error: "Failed to copy"
       ↓
Log error for debugging
```

### Accessibility Features

```
<button
  aria-label="Copy to clipboard"
  aria-live="polite"
  role="button"
>
  {copied ? 'Copied!' : 'Copy'}
</button>

Screen reader announces:
  "Copy to clipboard button"
  [User clicks]
  "Copied!" (polite announcement)
```

### Integration Examples

#### With DescriptionList
```
┌────────────────────────────────────────────────┐
│  Order ID:           #ORD-123  [ 📋 ]          │
│  Tracking Number:    TRK-456   [ 📋 ]          │
│  Invoice:            INV-789   [ 📋 ]          │
└────────────────────────────────────────────────┘
```

#### With Input Field
```
┌────────────────────────────────────────────────────────────────┐
│  Share Link                                                    │
│  ┌──────────────────────────────────────────────┐              │
│  │ https://example.com/order/123                │  [ 📋 Copy ] │
│  └──────────────────────────────────────────────┘              │
└────────────────────────────────────────────────────────────────┘
```

#### With Code Block
```
┌────────────────────────────────────────────────────────────────┐
│  API Request                                     [ 📋 Copy ]   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ curl -X GET https://api.example.com/orders/123           │  │
│  │   -H "Authorization: Bearer {token}"                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Text to copy to clipboard |
| onCopy | () => void | No | undefined | Callback after successful copy |
| label | string | No | 'Copy' | Button label text |
| showLabel | boolean | No | true | Show/hide label text |
| size | 'sm' \| 'md' \| 'lg' | No | 'md' | Button size |
| className | string | No | '' | Additional CSS classes |

### Expected Outcome
- Functional copy-to-clipboard button
- Visual feedback on copy
- Clipboard API integration
- Error handling
- Accessible implementation
- Size variations

### Verification Checklist
- [ ] CopyButton.tsx file created
- [ ] CopyButtonProps interface defined
- [ ] Component state set up
- [ ] Copy functionality implemented
- [ ] Clipboard API integrated
- [ ] Error handling added
- [ ] Icon rendering working
- [ ] Visual feedback implemented
- [ ] Label support added
- [ ] Size variations implemented
- [ ] Accessibility features added
- [ ] Component exported properly

---

## Task 88: Create ExportButton Component

### Overview
Create an ExportButton component that provides a dropdown menu for exporting data in multiple formats. This component handles export operations for PDF, Excel, and CSV formats, with a customizable format list and callback handler. Commonly used in data tables, reports, and detail pages throughout the ERP dashboard.

### Dependencies
- React 18+ installed
- TypeScript configured
- Tailwind CSS setup complete
- Icon system available
- Dropdown/Menu component (from previous groups)

### Instructions

1. **Create component directory**
   - Navigate to `components/composite/` directory
   - Create `ExportButton/` subdirectory
   - Create component files

2. **Create ExportButton.tsx file**
   - Create main component file
   - Set up TypeScript interfaces
   - Import dependencies

3. **Define export format types**
   - Create ExportFormat type ('PDF' | 'Excel' | 'CSV')
   - Support common export formats
   - Allow for future format extensions

4. **Define ExportButtonProps interface**
   - onExport: function (required) - Handler receives format
   - formats: ExportFormat[] (optional) - Available formats
   - label: string (optional) - Button label
   - disabled: boolean (optional) - Disable button
   - isLoading: boolean (optional) - Loading state
   - className: string (optional)

5. **Set up component state**
   - Track dropdown open/closed state
   - Track loading state per format
   - Manage focus state

6. **Create main export button**
   - Render button with export icon
   - Show label text
   - Handle click to toggle dropdown
   - Apply appropriate styling

7. **Implement dropdown menu**
   - Show format options when open
   - Position below button
   - Close on selection or outside click
   - Support keyboard navigation

8. **Create format menu items**
   - Map through formats array
   - Render menu item per format
   - Show format icon and label
   - Handle click event

9. **Implement export handler**
   - Call onExport with selected format
   - Close dropdown after selection
   - Show loading state during export
   - Handle export errors

10. **Add format icons**
    - PDF: Document/file icon
    - Excel: Spreadsheet icon
    - CSV: Table icon
    - Apply appropriate colors

11. **Implement loading state**
    - Show spinner during export
    - Disable button when loading
    - Indicate which format is exporting
    - Prevent multiple simultaneous exports

12. **Add keyboard support**
    - Arrow keys to navigate formats
    - Enter to select format
    - Escape to close dropdown
    - Tab navigation support

13. **Create component exports**
    - Export ExportButton as default
    - Export ExportButtonProps type
    - Export ExportFormat type
    - Create index.ts barrel export

### ExportButton Component States

#### Default State (Closed)
```
┌──────────────────┐
│  ⬇ Export        │
└──────────────────┘
```

#### Open State (Dropdown Visible)
```
┌──────────────────┐
│  ⬇ Export        │  ← Main button
└──────────────────┘
┌──────────────────┐
│ 📄 Export as PDF │  ← Format option
│ 📊 Export as Excel│
│ 📋 Export as CSV  │
└──────────────────┘
```

#### Loading State
```
┌──────────────────┐
│  ⏳ Exporting... │  ← Spinner + text
└──────────────────┘
```

### Visual Examples

#### Export Button on Data Table
```
┌────────────────────────────────────────────────────────────────┐
│  Order List                                  [ 🔍 ] [ ⬇ Export]│
├────────────────────────────────────────────────────────────────┤
│  Order #     Customer      Amount          Status              │
│  #12345      John Doe      LKR 12,000      Delivered           │
│  #12346      Jane Smith    LKR 8,500       Processing          │
└────────────────────────────────────────────────────────────────┘
```

#### Export Dropdown Menu
```
┌────────────────────────────────────────────────────────────────┐
│  Sales Report                                [ ⬇ Export     ]  │
│                                              ┌─────────────────┐
│                                              │ 📄 PDF         │
│                                              │ 📊 Excel       │
│                                              │ 📋 CSV         │
│                                              └─────────────────┘
└────────────────────────────────────────────────────────────────┘
```

#### Export Button with Custom Formats
```
┌──────────────────┐
│  ⬇ Export        │
└──────────────────┘
┌──────────────────┐
│ 📄 Export as PDF │
│ 📋 Export as CSV  │
└──────────────────┘
```

### Format Options

| Format | Icon | File Extension | Use Case |
|--------|------|----------------|----------|
| PDF | 📄 Document | .pdf | Formatted documents, invoices |
| Excel | 📊 Spreadsheet | .xlsx | Editable data, analysis |
| CSV | 📋 Table | .csv | Raw data, import/export |

### Export Flow

```
User Clicks "Export" Button
       ↓
Dropdown Opens
       ↓
User Selects Format (e.g., "PDF")
       ↓
onExport('PDF') Handler Called
       ↓
Button Shows Loading State
       ↓
Application Generates Export File
       ↓
   Success? ──No──→ Show Error Message
       ↓ Yes
File Download Initiated
       ↓
Loading State Cleared
       ↓
Dropdown Closes
```

### Detailed Usage Examples

#### Export Invoice
```
┌────────────────────────────────────────────────────────────────┐
│  Invoice #INV-2026-001                       [ ⬇ Export ]     │
│                                              ┌─────────────────┐
│  Customer: John Doe                          │ 📄 PDF         │
│  Date: Jan 25, 2026                          │ 📊 Excel       │
│  Amount: LKR 12,000                          └─────────────────┘
└────────────────────────────────────────────────────────────────┘
```

#### Export Customer List
```
┌────────────────────────────────────────────────────────────────┐
│  Customer Database                  [ 🔍 Search ] [ ⬇ Export ] │
├────────────────────────────────────────────────────────────────┤
│  Name            Email                Phone         Status     │
│  John Doe        john@example.com    +94 77...     Active     │
│  Jane Smith      jane@example.com    +94 71...     Active     │
└────────────────────────────────────────────────────────────────┘

Export Options:
┌──────────────────┐
│ 📊 Excel         │ ← Full data with formatting
│ 📋 CSV           │ ← Plain data for import
└──────────────────┘
```

#### Export Sales Report
```
┌────────────────────────────────────────────────────────────────┐
│  Monthly Sales Report - January 2026         [ ⬇ Export ]     │
│                                              ┌─────────────────┐
│  Total Sales:    LKR 450,000                 │ 📄 PDF Report  │
│  Total Orders:   145                         │ 📊 Excel Data  │
│  Avg Order:      LKR 3,103                   │ 📋 CSV Data    │
│                                              └─────────────────┘
└────────────────────────────────────────────────────────────────┘
```

### Loading States

#### Exporting as PDF
```
┌──────────────────┐
│  ⏳ Exporting... │  ← Generic loading
└──────────────────┘

or

┌──────────────────────┐
│  ⏳ Generating PDF...│  ← Format-specific
└──────────────────────┘
```

#### Format-Specific Loading
```
┌──────────────────┐
│ 📄 PDF           │ ⏳ Generating...
│ 📊 Excel         │
│ 📋 CSV           │
└──────────────────┘
```

### Format Availability

#### All Formats (Default)
```
┌──────────────────┐
│ 📄 PDF           │
│ 📊 Excel         │
│ 📋 CSV           │
└──────────────────┘
```

#### PDF Only
```
┌──────────────────┐
│ 📄 PDF           │
└──────────────────┘
```

#### Excel and CSV Only
```
┌──────────────────┐
│ 📊 Excel         │
│ 📋 CSV           │
└──────────────────┘
```

### Error Handling

#### Export Failed
```
┌────────────────────────────────────────────────────────────────┐
│  [ ⬇ Export ]                                                  │
│                                                                │
│  ⚠ Export failed. Please try again.                           │
└────────────────────────────────────────────────────────────────┘
```

#### Format Not Supported
```
┌────────────────────────────────────────────────────────────────┐
│  [ ⬇ Export ]                                                  │
│                                                                │
│  ℹ This format is not available for this report.              │
└────────────────────────────────────────────────────────────────┘
```

### Keyboard Navigation

```
Tab          → Focus export button
Enter/Space  → Open dropdown
↓ Arrow      → Next format option
↑ Arrow      → Previous format option
Enter        → Select format
Escape       → Close dropdown
```

### Integration with PageHeader

```
┌────────────────────────────────────────────────────────────────┐
│  Home > Reports > Sales                                        │
│                                                                │
│  Sales Report                 [ 📅 Date Range ] [ ⬇ Export ]  │
│  View monthly sales performance                                │
└────────────────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onExport | (format: ExportFormat) => void | Yes | - | Handler receives selected format |
| formats | ExportFormat[] | No | ['PDF', 'Excel', 'CSV'] | Available export formats |
| label | string | No | 'Export' | Button label text |
| disabled | boolean | No | false | Disable export button |
| isLoading | boolean | No | false | Show loading state |
| className | string | No | '' | Additional CSS classes |

### ExportFormat Type

```
type ExportFormat = 'PDF' | 'Excel' | 'CSV'
```

### Common Usage Patterns

| Context | Formats | Handler Behavior |
|---------|---------|------------------|
| Data table | Excel, CSV | Export table rows as data |
| Invoice | PDF | Generate PDF invoice |
| Report | PDF, Excel | Generate formatted report |
| Customer list | Excel, CSV | Export contact information |
| Order history | PDF, CSV | Export transaction records |

### Expected Outcome
- Functional export button with dropdown
- Multiple format support
- Loading state indication
- Error handling
- Keyboard accessibility
- Clean visual design

### Verification Checklist
- [ ] ExportButton.tsx file created
- [ ] ExportButtonProps interface defined
- [ ] ExportFormat type defined
- [ ] Component state set up
- [ ] Main button rendering
- [ ] Dropdown menu implemented
- [ ] Format items rendering
- [ ] Export handler working
- [ ] Format icons added
- [ ] Loading state implemented
- [ ] Keyboard support added
- [ ] Error handling included
- [ ] Component exported properly

---

## Summary

This document established the foundation of page display and utility components for the ERP dashboard:

### Completed Components
- ✅ PageHeader - Consistent page header with title, breadcrumb, and actions
- ✅ PageContainer - Layout container with max-width and padding
- ✅ Breadcrumb - Hierarchical navigation with icon support
- ✅ DescriptionList - Key-value display with flexible layouts
- ✅ Timeline - Chronological event display with status indicators
- ✅ StatusIndicator - Color-coded status badges with dot option
- ✅ CopyButton - Clipboard copy with visual feedback
- ✅ ExportButton - Multi-format export with dropdown menu

### Key Achievements
1. **Page Structure** - Consistent layout components (PageHeader, PageContainer)
2. **Navigation** - Clear hierarchy through breadcrumbs
3. **Data Display** - Flexible presentation (DescriptionList, Timeline)
4. **Status Communication** - Visual status indicators
5. **User Actions** - Utility components (Copy, Export)
6. **Responsive Design** - Mobile-friendly layouts
7. **Accessibility** - Keyboard navigation and screen reader support

### Design Patterns Established
- Consistent prop interfaces across components
- Size variations (sm/md/lg) for flexible use
- Optional features via boolean props
- Status-based color coding
- Loading and error states
- Keyboard accessibility

### Next Steps
Proceed to [02_Tasks-89-92_Index-Storybook-Docs.md](02_Tasks-89-92_Index-Storybook-Docs.md) to implement component exports, Storybook stories, and comprehensive documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~985
