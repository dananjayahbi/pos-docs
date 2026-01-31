# Tasks 67-75: Homepage Builder and Section Configurations

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** E - Homepage Sections  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-76-80_Add-Save-Verify.md](02_Tasks-76-80_Add-Save-Verify.md)

---

## Document Overview

This document covers the creation of the homepage section builder with drag-and-drop functionality and configuration panels for various section types. It establishes the visual builder interface, section management list, drag-and-drop reordering, enable/disable toggles, and detailed configuration forms for Hero, Featured Products, Categories, Testimonials, and Newsletter sections.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create Homepage Builder | Medium | 45 min |
| 68 | Create Section List | Medium | 40 min |
| 69 | Create Section Drag Handle | Low | 20 min |
| 70 | Create Section Toggle | Low | 20 min |
| 71 | Create Hero Section Config | Medium | 40 min |
| 72 | Create Featured Products Config | Medium | 40 min |
| 73 | Create Categories Section Config | Medium | 40 min |
| 74 | Create Testimonials Config | Medium | 35 min |
| 75 | Create Newsletter Config | Low | 30 min |

---

## Task 67: Create Homepage Builder

### Overview
Create the main Homepage Builder component that serves as the container and orchestrator for the entire homepage section builder UI. This component provides a split-screen interface with section list on the left and preview/configuration panel on the right, along with save functionality.

### Dependencies
- SubPhase-09 (Color Schemes) must be complete
- Theme context and state management ready
- API endpoints for homepage configuration available

### Instructions

1. **Navigate to storefront theme components**
   - Go to `frontend/components/storefront/theme/` directory
   - Create new directory named `Homepage`
   - This will house all homepage builder components

2. **Create HomepageBuilder component file**
   - Create `HomepageBuilder.tsx` in the Homepage directory
   - Set up TypeScript React functional component structure
   - Import required dependencies (React hooks, theme context)

3. **Define component state management**
   - Create state for sections array (list of homepage sections)
   - Create state for selected section (currently being configured)
   - Create state for preview mode (builder vs preview)
   - Create state for save status (loading, success, error)

4. **Implement main layout structure**
   - Create two-column layout using CSS Grid or Flexbox
   - Left column: Section list (30-40% width)
   - Right column: Preview or configuration (60-70% width)
   - Add header with title and action buttons

5. **Add builder header**
   - Display "Homepage Builder" title
   - Add "Preview" toggle button
   - Add "Save Changes" button
   - Include unsaved changes indicator

6. **Integrate section list component**
   - Import and render SectionList component (Task 68)
   - Pass sections array and handlers as props
   - Handle section selection events
   - Handle section reorder events

7. **Implement configuration panel**
   - Conditionally render based on selected section type
   - Show section-specific configuration form
   - Handle configuration changes
   - Update sections array when config changes

8. **Add preview panel option**
   - Create toggle between configuration and preview
   - Render HomepagePreview component when in preview mode
   - Pass current section configuration to preview

9. **Implement save functionality**
   - Create save handler function
   - Call API to save section configuration
   - Show loading state during save
   - Display success/error notifications

10. **Add keyboard shortcuts (optional)**
    - Ctrl+S / Cmd+S to save
    - Escape to close configuration panel
    - Add keyboard event listeners

### Builder Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Homepage Builder                    [Preview] [Save Changes] │
├────────────────────────┬─────────────────────────────────────┤
│                        │                                     │
│   Section List         │    Configuration Panel              │
│   ─────────────       │    ───────────────────             │
│   ☰ Hero        [✓]    │                                     │
│   ☰ Featured    [✓]    │    Selected Section Settings        │
│   ☰ Categories  [ ]    │                                     │
│   ☰ Testimonial [✓]    │    [Form fields for selected        │
│   ☰ Newsletter  [✓]    │     section configuration]          │
│                        │                                     │
│   [+ Add Section]      │                                     │
│                        │                                     │
└────────────────────────┴─────────────────────────────────────┘
```

### Component State Structure

| State Variable | Type | Purpose |
|----------------|------|---------|
| sections | SectionConfig[] | All homepage sections |
| selectedSection | string \| null | ID of selected section |
| previewMode | boolean | Show preview vs config |
| saveStatus | SaveStatus | Save operation state |
| hasUnsavedChanges | boolean | Track unsaved edits |

### Section Configuration Interface

```typescript
interface SectionConfig {
  id: string;              // Unique identifier
  type: string;            // 'hero' | 'featured' | 'categories' | etc.
  enabled: boolean;        // Section visibility
  order: number;           // Display order
  config: object;          // Section-specific settings
}
```

### Builder Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Select Section | Click section item | Show config panel |
| Reorder | Drag section | Update order |
| Toggle | Click switch | Enable/disable section |
| Save | Click save button | Persist changes to API |
| Preview | Click preview button | Show live preview |

### Layout Responsive Behavior

```
Desktop (> 1024px)
├── Two-column layout
├── Section list: 35% width
└── Config panel: 65% width

Tablet (768px - 1024px)
├── Two-column layout
├── Section list: 40% width
└── Config panel: 60% width

Mobile (< 768px)
├── Stack vertically
├── Section list collapses to drawer
└── Config panel: full width
```

### Expected Outcome
- Functional homepage builder container
- Split-screen layout with section list and config panel
- State management for sections and selections
- Save functionality with loading states
- Foundation for adding section-specific configurations

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Homepage/HomepageBuilder.tsx` created
- [ ] Two-column layout implemented
- [ ] State management for sections configured
- [ ] Header with title and action buttons
- [ ] Section selection mechanism works
- [ ] Save functionality implemented
- [ ] Preview toggle functionality prepared
- [ ] Component exports properly

---

## Task 68: Create Section List

### Overview
Create the SectionList component that displays all available homepage sections in a draggable list. This component shows each section with its name, drag handle, enable/disable toggle, and configuration button. It manages the visual representation of sections and their order.

### Dependencies
- Task 67: Create Homepage Builder

### Instructions

1. **Create SectionList component file**
   - Create `SectionList.tsx` in `components/storefront/theme/Homepage/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `SectionListProps` interface
   - Include sections array prop
   - Include onReorder callback prop
   - Include onToggle callback prop
   - Include onSelect callback prop

3. **Install drag-and-drop library**
   - Choose between dnd-kit (recommended) or react-beautiful-dnd
   - Install via npm/yarn: `npm install @dnd-kit/core @dnd-kit/sortable`
   - Import necessary hooks and components

4. **Set up drag-and-drop context**
   - Wrap list with DndContext (dnd-kit) or DragDropContext (react-beautiful-dnd)
   - Configure sensors for mouse and touch interactions
   - Set up collision detection strategy

5. **Implement sortable container**
   - Use SortableContext for the list container
   - Pass section IDs for sorting identification
   - Configure vertical list strategy

6. **Create section list items**
   - Map over sections array
   - Render SectionItem component (created inline or separate)
   - Pass section data and handlers to each item
   - Include drag handle, toggle, and select functionality

7. **Implement reorder handler**
   - Listen to drag end events
   - Calculate new section order
   - Call onReorder prop with updated sections array
   - Update local state optimistically

8. **Style the list container**
   - Add background color and border
   - Set padding and spacing between items
   - Add scroll behavior for long lists
   - Style empty state if no sections

9. **Add section count display**
   - Show total sections count
   - Show enabled vs disabled count
   - Display at top or bottom of list

10. **Implement empty state**
    - Show message when no sections exist
    - Display "Add Section" prompt
    - Style appropriately with icon and text

### Section List Structure

```
┌────────────────────────┐
│  Sections (5)          │
│  4 enabled, 1 disabled │
├────────────────────────┤
│  ☰  Hero         [✓]  >│
│  ☰  Featured     [✓]  >│
│  ☰  Categories   [ ]  >│
│  ☰  Testimonials [✓]  >│
│  ☰  Newsletter   [✓]  >│
└────────────────────────┘
│  [+ Add Section]       │
└────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| sections | SectionConfig[] | Yes | Array of section configurations |
| onReorder | (sections: SectionConfig[]) => void | Yes | Handle section reorder |
| onToggle | (id: string, enabled: boolean) => void | Yes | Handle enable/disable |
| onSelect | (id: string) => void | Yes | Handle section selection |
| selectedId | string \| null | No | Currently selected section ID |

### Section Item Layout

```
┌──────────────────────────────────────┐
│ ☰  Section Name    [Toggle]   [>]    │
│ │   │              │          │      │
│ │   │              │          │      │
│ │   │              │          └─ Config button
│ │   │              └─ Enable/disable toggle
│ │   └─ Section name/label
│ └─ Drag handle
└──────────────────────────────────────┘
```

### Drag-and-Drop Library Comparison

| Feature | dnd-kit | react-beautiful-dnd |
|---------|---------|---------------------|
| Bundle Size | ~20KB | ~50KB |
| Performance | Excellent | Good |
| Touch Support | Built-in | Built-in |
| Accessibility | Built-in | Built-in |
| Maintenance | Active | Less active |
| Recommendation | ✓ Preferred | Alternative |

### List Item States

| State | Visual Indicator | Behavior |
|-------|------------------|----------|
| Normal | Default styling | Static |
| Hover | Highlight background | Show interactive elements |
| Dragging | Elevated shadow, opacity | Move with cursor |
| Selected | Blue border/background | Show as active |
| Disabled | Reduced opacity | Dimmed appearance |

### Styling Specifications

| Element | Styling | Purpose |
|---------|---------|---------|
| Container | `bg-white border rounded-lg p-4` | Clean container |
| List | `space-y-2` | Spacing between items |
| Item | `bg-gray-50 hover:bg-gray-100 p-3 rounded cursor-pointer` | Interactive item |
| Drag Handle | `text-gray-400 hover:text-gray-600 cursor-grab` | Visual affordance |

### Expected Outcome
- Functional section list with drag-and-drop
- Visual representation of all homepage sections
- Smooth reordering animations
- Toggle and select interactions
- Responsive and accessible list

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Homepage/SectionList.tsx` created
- [ ] Drag-and-drop library installed and configured
- [ ] Section items display with all elements
- [ ] Drag to reorder functionality works
- [ ] Toggle switches functional
- [ ] Section selection highlights correctly
- [ ] Empty state displays appropriately
- [ ] Smooth animations on drag
- [ ] Component accepts and uses all props correctly

---

## Task 69: Create Section Drag Handle

### Overview
Create the SectionDragHandle component that provides a visual and interactive handle for dragging section items. This component displays a grip icon and manages drag cursor states to provide clear drag affordance to users.

### Dependencies
- Task 68: Create Section List

### Instructions

1. **Create SectionDragHandle component file**
   - Create `SectionDragHandle.tsx` in `components/storefront/theme/Homepage/` directory
   - Set up as a small, focused component

2. **Import icon library**
   - Import grip vertical icon from icon library (Lucide, Heroicons, etc.)
   - Choose appropriate grip/drag icon (⋮⋮ or ☰)
   - Ensure icon is clear and recognizable

3. **Define component props**
   - Create props interface (may be minimal)
   - Accept optional className prop
   - Accept drag attributes from drag library

4. **Implement drag handle markup**
   - Create button or div element
   - Add drag library attributes (listeners, setNodeRef)
   - Include icon component
   - Set proper cursor styles

5. **Style the drag handle**
   - Set appropriate size (24x24px or similar)
   - Apply gray color by default
   - Add hover state with darker color
   - Configure cursor: grab when idle, grabbing when dragging

6. **Add accessibility attributes**
   - Include aria-label for screen readers
   - Set role="button" if using div
   - Add keyboard drag instructions (if supported)

7. **Implement cursor states**
   - Default: cursor-grab
   - Active (dragging): cursor-grabbing
   - Disabled: cursor-not-allowed

8. **Add touch feedback**
   - Ensure touch-friendly size (min 44x44px hit area)
   - Add active state for touch devices
   - Test on mobile browsers

### Drag Handle Visual States

```
Idle State:          Hover State:         Dragging State:
   ⋮⋮                  ⋮⋮                    ⋮⋮
(gray-400)          (gray-600)            (blue-500)
cursor-grab         cursor-grab           cursor-grabbing
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| listeners | object | No | Drag listeners from drag library |
| attributes | object | No | Drag attributes from drag library |
| className | string | No | Additional CSS classes |

### Icon Options

| Library | Icon Name | Import |
|---------|-----------|--------|
| Lucide React | GripVertical | `import { GripVertical } from 'lucide-react'` |
| Heroicons | Bars3Icon | `import { Bars3Icon } from '@heroicons/react/24/outline'` |
| React Icons | MdDragHandle | `import { MdDragHandle } from 'react-icons/md'` |

### Styling Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Size | 20-24px | Clearly visible |
| Color | gray-400 | Non-intrusive |
| Hover Color | gray-600 | Interactive feedback |
| Cursor | grab/grabbing | Drag affordance |
| Touch Area | 44x44px min | Mobile accessibility |

### Cursor States Implementation

| State | CSS Class | When |
|-------|-----------|------|
| Default | `cursor-grab` | Not dragging |
| Active | `cursor-grabbing` | During drag |
| Disabled | `cursor-not-allowed` | Section locked |

### Expected Outcome
- Clear, recognizable drag handle icon
- Proper cursor feedback for drag interaction
- Smooth integration with drag-and-drop library
- Touch-friendly sizing and interaction
- Accessible to keyboard and screen readers

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Homepage/SectionDragHandle.tsx` created
- [ ] Grip icon displays clearly
- [ ] Cursor changes to grab on hover
- [ ] Cursor changes to grabbing while dragging
- [ ] Touch area is sufficiently large (44x44px minimum)
- [ ] Integrates with drag library attributes
- [ ] Accessibility attributes included
- [ ] Component exports properly

---

## Task 70: Create Section Toggle

### Overview
Create the SectionToggle component that provides a toggle switch for enabling or disabling homepage sections. This component displays a visual switch that users can click to toggle section visibility on the live storefront.

### Dependencies
- Task 68: Create Section List

### Instructions

1. **Create SectionToggle component file**
   - Create `SectionToggle.tsx` in `components/storefront/theme/Homepage/` directory
   - Set up TypeScript React functional component

2. **Define component props interface**
   - Create `SectionToggleProps` interface
   - Include enabled prop (boolean)
   - Include onChange callback prop
   - Include optional disabled prop
   - Include optional size prop

3. **Choose toggle implementation approach**
   - Option A: Use existing toggle from UI library (Shadcn/ui Switch)
   - Option B: Build custom toggle with checkbox input
   - Option C: Use headless UI library (Radix, Headless UI)
   - Recommended: Shadcn/ui Switch component

4. **Implement toggle component**
   - Render switch/toggle element
   - Bind enabled prop to checked state
   - Attach onChange handler
   - Handle click events

5. **Style toggle states**
   - Enabled state: Blue/green background, switch right
   - Disabled state: Gray background, switch left
   - Hover state: Slightly darker background
   - Focus state: Ring outline for accessibility

6. **Add visual feedback**
   - Smooth transition animation (150-200ms)
   - Clear on/off position
   - Optional checkmark icon in enabled state
   - Color coding (green = on, gray = off)

7. **Implement disabled state**
   - Reduce opacity when disabled prop is true
   - Change cursor to not-allowed
   - Prevent click events
   - Gray out the toggle

8. **Add accessibility features**
   - Use semantic checkbox input
   - Include aria-label or label element
   - Support keyboard interaction (Space to toggle)
   - Announce state changes to screen readers

9. **Handle parent callback**
   - Call onChange prop when toggled
   - Pass new enabled state value
   - Debounce if necessary to prevent rapid toggles

### Toggle Visual States

```
Enabled:                    Disabled:
┌──────────┐               ┌──────────┐
│      ●───┤  ✓            ├───●      │
└──────────┘               └──────────┘
 (bg-green-500)            (bg-gray-300)
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| enabled | boolean | Yes | - | Current toggle state |
| onChange | (enabled: boolean) => void | Yes | - | Callback when toggled |
| disabled | boolean | No | false | Disable interaction |
| label | string | No | - | Accessible label |
| size | "sm" \| "md" | No | "md" | Toggle size |

### Toggle States and Colors

| State | Background | Thumb Position | Cursor |
|-------|------------|----------------|--------|
| Enabled | green-500 or blue-500 | Right | pointer |
| Disabled | gray-300 | Left | pointer |
| Loading | gray-400 | Center | wait |
| Inactive | gray-200 | Left | not-allowed |

### Animation Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Transition | all 150ms ease-in-out | Smooth animation |
| Duration | 150ms | Quick feedback |
| Easing | ease-in-out | Natural motion |

### Accessibility Requirements

| Feature | Implementation |
|---------|----------------|
| Keyboard | Space/Enter to toggle |
| Screen Reader | Announce "enabled" or "disabled" |
| Focus | Visible focus ring |
| Label | Associated label or aria-label |

### Usage in Section List

```
Section Item:
┌────────────────────────────────┐
│ ☰  Hero Section    [Toggle]   >│
│                       ↑         │
│                    enabled=true │
└────────────────────────────────┘
```

### Expected Outcome
- Functional toggle switch component
- Clear visual distinction between enabled/disabled
- Smooth animation on state change
- Accessible keyboard and screen reader support
- Proper callback to parent component

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Homepage/SectionToggle.tsx` created
- [ ] Toggle displays in off state when enabled=false
- [ ] Toggle displays in on state when enabled=true
- [ ] Smooth animation when toggling
- [ ] onChange callback fires correctly
- [ ] Keyboard interaction (Space/Enter) works
- [ ] Focus ring visible when focused
- [ ] Disabled state prevents interaction
- [ ] Screen reader announces state correctly
- [ ] Component exports properly

---

## Task 71: Create Hero Section Config

### Overview
Create the HeroConfig component that provides a configuration form for the Hero section. This component allows users to customize the hero banner image, heading text, subheading, call-to-action button text and link, and overlay settings.

### Dependencies
- Task 67: Create Homepage Builder

### Instructions

1. **Create HeroConfig component file**
   - Create `HeroConfig.tsx` in `components/storefront/theme/Homepage/` directory
   - Set up TypeScript React functional component structure

2. **Define Hero configuration interface**
   - Create `HeroSectionConfig` interface
   - Include fields: backgroundImage, title, subtitle, ctaText, ctaLink, overlayOpacity
   - Define TypeScript types for all fields

3. **Define component props**
   - Create `HeroConfigProps` interface
   - Include config prop (current hero settings)
   - Include onChange callback to update config
   - Include optional validation errors prop

4. **Implement form layout**
   - Create vertical form layout with sections
   - Group related fields (content, CTA, styling)
   - Use proper spacing between field groups
   - Add section headers/labels

5. **Add background image upload field**
   - Create file upload input or image picker
   - Display current image thumbnail
   - Allow URL input as alternative
   - Show image dimensions requirements (e.g., 1920x800px)
   - Handle image upload/selection

6. **Add text content fields**
   - Title input: Text input, max 60 characters
   - Subtitle input: Textarea, max 150 characters
   - Show character count for each field
   - Provide placeholder text examples

7. **Add CTA button configuration**
   - CTA text input: Text input, max 30 characters
   - CTA link input: Text input with validation
   - Link type selector: Internal page or external URL
   - Preview button appearance

8. **Add overlay settings**
   - Overlay opacity slider (0-100%)
   - Overlay color picker (optional)
   - Live preview of overlay effect
   - Default to 40% opacity

9. **Implement form validation**
   - Validate required fields (title, ctaText)
   - Validate image URL format
   - Validate CTA link format
   - Show inline error messages

10. **Handle form changes**
    - Debounce text input changes (300ms)
    - Call onChange callback with updated config
    - Update local state optimistically
    - Validate on change or on blur

11. **Add preset/template options (optional)**
    - Provide 2-3 preset hero layouts
    - Include example content
    - Allow quick application of presets

### Hero Section Configuration Interface

```typescript
interface HeroSectionConfig {
  backgroundImage: string;      // URL or path to image
  title: string;                // Main heading
  subtitle: string;             // Supporting text
  ctaText: string;              // Button text
  ctaLink: string;              // Button destination
  overlayOpacity: number;       // 0-100
  overlayColor?: string;        // Hex color (optional)
}
```

### Form Layout Structure

```
┌────────────────────────────────────┐
│  Hero Section Configuration        │
├────────────────────────────────────┤
│  Background Image                  │
│  ┌──────────────┐                 │
│  │  [Thumbnail] │  [Upload/Change]│
│  └──────────────┘                 │
│                                    │
│  Content                           │
│  Title: [___________________]      │
│         (60 characters max)        │
│  Subtitle: [________________]      │
│            [________________]      │
│         (150 characters max)       │
│                                    │
│  Call to Action                    │
│  Button Text: [______________]     │
│  Button Link: [______________]     │
│  Link Type: [Internal ▼]           │
│                                    │
│  Styling                           │
│  Overlay Opacity: [========] 40%   │
│  Overlay Color: [■] (optional)     │
│                                    │
│  [Preview Hero Section]            │
└────────────────────────────────────┘
```

### Form Fields Specifications

| Field | Type | Max Length | Required | Validation |
|-------|------|------------|----------|------------|
| Background Image | Image Upload/URL | - | Yes | Valid image URL |
| Title | Text Input | 60 chars | Yes | Non-empty |
| Subtitle | Textarea | 150 chars | No | - |
| CTA Text | Text Input | 30 chars | Yes | Non-empty |
| CTA Link | Text Input | - | Yes | Valid URL/path |
| Overlay Opacity | Slider | 0-100 | No | Number |
| Overlay Color | Color Picker | 7 chars | No | Hex color |

### Image Upload Requirements

| Aspect | Specification |
|--------|---------------|
| Recommended Size | 1920x800px (2.4:1 ratio) |
| Min Size | 1280x600px |
| Max File Size | 2MB |
| Formats | JPEG, PNG, WebP |
| Optimization | Compress before upload |

### CTA Link Types

| Type | Description | Example |
|------|-------------|---------|
| Internal Page | Link to store page | `/products`, `/about` |
| Product Category | Link to category | `/category/electronics` |
| External URL | Link to external site | `https://example.com` |

### Overlay Opacity Guide

| Opacity | Use Case | Readability |
|---------|----------|-------------|
| 0-20% | Light backgrounds | High |
| 30-50% | Medium backgrounds | Good |
| 60-80% | Dark backgrounds | Excellent |
| 80-100% | Very dark images | Maximum |

### Form Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Required Title | title.length > 0 | "Title is required" |
| Title Length | title.length ≤ 60 | "Title too long (max 60)" |
| Required CTA | ctaText.length > 0 | "Button text required" |
| Valid Link | isValidUrl(ctaLink) | "Invalid URL format" |

### Expected Outcome
- Comprehensive configuration form for Hero section
- Image upload and management
- Text content editing with validation
- CTA button customization
- Overlay styling controls
- Real-time validation and feedback

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Homepage/HeroConfig.tsx` created
- [ ] All form fields implemented
- [ ] Image upload functionality works
- [ ] Character counters display correctly
- [ ] CTA link validation works
- [ ] Overlay opacity slider functional
- [ ] Form validation shows errors appropriately
- [ ] onChange callback fires with updated config
- [ ] TypeScript interfaces defined
- [ ] Component exports properly

---

## Task 72: Create Featured Products Config

### Overview
Create the FeaturedConfig component that provides a configuration form for the Featured Products section. This component allows users to set the section title, select how many products to display, choose product selection method (manual or automatic), and configure display settings.

### Dependencies
- Task 67: Create Homepage Builder

### Instructions

1. **Create FeaturedConfig component file**
   - Create `FeaturedConfig.tsx` in `components/storefront/theme/Homepage/` directory
   - Set up TypeScript React functional component structure

2. **Define Featured Products configuration interface**
   - Create `FeaturedProductsConfig` interface
   - Include fields: title, productCount, selectionMethod, productIds, displayColumns, showPrice, showAddToCart
   - Define TypeScript types for all fields

3. **Define component props**
   - Create `FeaturedConfigProps` interface
   - Include config prop
   - Include onChange callback
   - Include optional products list for selection

4. **Implement form layout**
   - Create sections: General, Products, Display
   - Use collapsible sections or tabs if lengthy
   - Maintain clear visual hierarchy

5. **Add section title field**
   - Text input for section heading
   - Max 50 characters
   - Default: "Featured Products"
   - Show character counter

6. **Add product count selector**
   - Number input or select dropdown
   - Options: 4, 6, 8, 12 products
   - Default: 8 products
   - Explain impact on layout

7. **Add selection method toggle**
   - Radio buttons or segmented control
   - Options: "Manual Selection" or "Automatic (Newest/Best Selling)"
   - Default: Automatic
   - Show different fields based on selection

8. **Implement manual product selector**
   - Show only when selectionMethod is "manual"
   - Multi-select dropdown or searchable list
   - Display product thumbnails and names
   - Allow drag to reorder selected products
   - Limit selection to productCount

9. **Implement automatic selector**
   - Show only when selectionMethod is "automatic"
   - Radio options: "Newest Products", "Best Selling", "Highest Rated"
   - Explain criteria for each option

10. **Add display columns selector**
    - Select dropdown or radio buttons
    - Options: 3 or 4 columns
    - Default: 4 columns
    - Show visual preview of grid

11. **Add display options toggles**
    - Show Price toggle (default: true)
    - Show Add to Cart toggle (default: true)
    - Show Rating toggle (default: true)
    - Each with switch/checkbox

12. **Handle form changes**
    - Validate selections
    - Call onChange callback with updated config
    - Show preview of how section will appear

### Featured Products Configuration Interface

```typescript
interface FeaturedProductsConfig {
  title: string;                    // Section heading
  productCount: 4 | 6 | 8 | 12;    // Number to display
  selectionMethod: 'manual' | 'automatic';
  productIds?: string[];            // Manual selection
  autoMethod?: 'newest' | 'bestselling' | 'toprated';  // Automatic
  displayColumns: 3 | 4;            // Grid columns
  showPrice: boolean;               // Display price
  showAddToCart: boolean;          // Display add button
  showRating: boolean;             // Display rating
}
```

### Form Layout Structure

```
┌────────────────────────────────────┐
│  Featured Products Configuration   │
├────────────────────────────────────┤
│  General Settings                  │
│  Section Title: [______________]   │
│                 (50 chars max)     │
│  Product Count: [ 8 ▼ ]            │
│                                    │
│  Product Selection                 │
│  ◉ Automatic   ○ Manual            │
│                                    │
│  [If Automatic:]                   │
│  ◉ Newest Products                 │
│  ○ Best Selling                    │
│  ○ Highest Rated                   │
│                                    │
│  [If Manual:]                      │
│  Selected Products: [Search▼]      │
│  ┌──────────┬──────────┐          │
│  │ Product1 │ Product2 │  (8 max) │
│  └──────────┴──────────┘          │
│                                    │
│  Display Settings                  │
│  Grid Columns: [ 4 ▼ ]             │
│  Show Price:      [✓]              │
│  Show Add to Cart: [✓]             │
│  Show Rating:     [✓]              │
│                                    │
│  [Preview Section]                 │
└────────────────────────────────────┘
```

### Product Count Options

| Count | Grid | Use Case |
|-------|------|----------|
| 4 | 2x2 or 4x1 | Minimal selection |
| 6 | 3x2 | Balanced display |
| 8 | 4x2 | Recommended |
| 12 | 4x3 | Maximum showcase |

### Selection Method Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| Manual | Full control, curated | Requires maintenance | Promoted products |
| Automatic (Newest) | Always fresh | Less control | New arrivals |
| Automatic (Best Selling) | Data-driven | Stale if no sales | Popular items |
| Automatic (Top Rated) | Quality focus | Requires reviews | High-quality stores |

### Display Columns Impact

```
3 Columns:                    4 Columns:
┌───┬───┬───┐                ┌──┬──┬──┬──┐
│ P │ P │ P │                │P │P │P │P │
├───┼───┼───┤                ├──┼──┼──┼──┤
│ P │ P │ P │                │P │P │P │P │
└───┴───┴───┘                └──┴──┴──┴──┘
(Larger items)               (More items visible)
```

### Display Options Effect

| Option | When Enabled | When Disabled |
|--------|--------------|---------------|
| Show Price | Price displayed below product | Price hidden |
| Show Add to Cart | Quick add button visible | No button, click for details |
| Show Rating | Stars/rating shown | No rating display |

### Form Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Title Required | title.length > 0 | "Section title is required" |
| Title Length | title.length ≤ 50 | "Title too long (max 50)" |
| Manual Selection | productIds.length = productCount | "Select X products" |
| Valid Products | All IDs exist | "Some products not found" |

### Expected Outcome
- Complete configuration form for Featured Products section
- Manual and automatic product selection modes
- Display customization options
- Grid layout configuration
- Validation and preview functionality

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Homepage/FeaturedConfig.tsx` created
- [ ] All form fields implemented
- [ ] Selection method toggle works
- [ ] Manual product selector functional
- [ ] Automatic method options work
- [ ] Display column selector functional
- [ ] Display option toggles work
- [ ] Form validation shows errors
- [ ] onChange callback fires correctly
- [ ] TypeScript interfaces defined
- [ ] Component exports properly

---

## Task 73: Create Categories Section Config

### Overview
Create the CategoriesConfig component that provides a configuration form for the Categories section. This component allows users to set the section title, select which product categories to display, choose display style (grid or carousel), and configure category card settings.

### Dependencies
- Task 67: Create Homepage Builder

### Instructions

1. **Create CategoriesConfig component file**
   - Create `CategoriesConfig.tsx` in `components/storefront/theme/Homepage/` directory
   - Set up TypeScript React functional component structure

2. **Define Categories configuration interface**
   - Create `CategoriesSectionConfig` interface
   - Include fields: title, categoryIds, displayStyle, columns, showProductCount, showImages
   - Define TypeScript types for all fields

3. **Define component props**
   - Create `CategoriesConfigProps` interface
   - Include config prop
   - Include onChange callback
   - Include categories list prop (available categories)

4. **Implement form layout**
   - Create sections: General, Category Selection, Display
   - Use clear section headers
   - Maintain consistent spacing

5. **Add section title field**
   - Text input for section heading
   - Max 50 characters
   - Default: "Shop by Category"
   - Show character counter

6. **Add category selector**
   - Multi-select dropdown with checkboxes
   - Display all available categories
   - Allow selecting/deselecting categories
   - Show category hierarchy (parent/child)
   - Allow drag to reorder selected categories

7. **Add display style selector**
   - Radio buttons or segmented control
   - Options: "Grid" or "Carousel"
   - Default: Grid
   - Show icon preview of each style

8. **Add columns selector (for grid style)**
   - Show only when displayStyle is "grid"
   - Select dropdown or radio buttons
   - Options: 3, 4, or 6 columns
   - Default: 4 columns

9. **Add carousel settings (for carousel style)**
   - Show only when displayStyle is "carousel"
   - Auto-play toggle
   - Auto-play interval (seconds)
   - Show navigation arrows toggle

10. **Add display options toggles**
    - Show Product Count toggle (default: true)
    - Show Category Images toggle (default: true)
    - Show Description toggle (default: false)

11. **Implement category reordering**
    - Drag handles for selected categories
    - Visual feedback during drag
    - Update order in config

12. **Handle form changes**
    - Validate minimum 1 category selected
    - Call onChange callback with updated config
    - Show preview or example

### Categories Section Configuration Interface

```typescript
interface CategoriesSectionConfig {
  title: string;                    // Section heading
  categoryIds: string[];            // Selected category IDs
  displayStyle: 'grid' | 'carousel';
  columns?: 3 | 4 | 6;              // Grid columns (if grid)
  autoPlay?: boolean;               // Carousel auto-play (if carousel)
  autoPlayInterval?: number;        // Seconds (if carousel)
  showProductCount: boolean;        // Display product count
  showImages: boolean;              // Display category images
  showDescription: boolean;         // Display short description
}
```

### Form Layout Structure

```
┌────────────────────────────────────┐
│  Categories Section Configuration  │
├────────────────────────────────────┤
│  General Settings                  │
│  Section Title: [______________]   │
│                 (50 chars max)     │
│                                    │
│  Category Selection                │
│  Select Categories: [Choose▼]      │
│  ┌────────────────────────────┐   │
│  │ ☰ Electronics       [×]    │   │
│  │ ☰ Clothing          [×]    │   │
│  │ ☰ Home & Garden     [×]    │   │
│  │ ☰ Sports            [×]    │   │
│  └────────────────────────────┘   │
│  (Drag to reorder)                 │
│                                    │
│  Display Style                     │
│  ◉ Grid      ○ Carousel            │
│                                    │
│  [If Grid:]                        │
│  Columns: [ 4 ▼ ]                  │
│                                    │
│  [If Carousel:]                    │
│  Auto-play: [✓]                    │
│  Interval: [ 5 ] seconds           │
│  Navigation: [✓]                   │
│                                    │
│  Display Options                   │
│  Show Product Count: [✓]           │
│  Show Images:       [✓]            │
│  Show Description:  [ ]            │
│                                    │
│  [Preview Section]                 │
└────────────────────────────────────┘
```

### Display Style Comparison

```
Grid Style:                   Carousel Style:
┌────┬────┬────┬────┐        ◄ ┌────┬────┬────┐ ►
│Cat1│Cat2│Cat3│Cat4│          │Cat1│Cat2│Cat3│
└────┴────┴────┴────┘          └────┴────┴────┘
(All visible)                  (Scrollable)
```

### Grid Columns Options

| Columns | Layout | Use Case |
|---------|--------|----------|
| 3 | Fewer, larger cards | Detailed view |
| 4 | Balanced | Recommended |
| 6 | Many, smaller cards | Compact display |

### Category Card Display Options

| Option | When Enabled | When Disabled |
|--------|--------------|---------------|
| Product Count | "Electronics (234)" | "Electronics" |
| Images | Category image shown | Icon or color block |
| Description | Brief text below title | Title only |

### Carousel Settings

| Setting | Default | Range | Purpose |
|---------|---------|-------|---------|
| Auto-play | true | - | Automatic scrolling |
| Interval | 5 sec | 3-10 sec | Time between slides |
| Navigation | true | - | Show prev/next arrows |
| Dots | true | - | Show position indicators |

### Category Selection Interface

```
Multi-Select Dropdown:
┌──────────────────────────┐
│ Electronics      [✓]     │
│   ├─ Computers   [✓]     │
│   └─ Phones      [ ]     │
│ Clothing         [✓]     │
│   ├─ Men         [ ]     │
│   └─ Women       [✓]     │
│ Home & Garden    [ ]     │
└──────────────────────────┘
(Hierarchical with parent/child)
```

### Form Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Title Required | title.length > 0 | "Section title is required" |
| Title Length | title.length ≤ 50 | "Title too long (max 50)" |
| Min Categories | categoryIds.length ≥ 1 | "Select at least 1 category" |
| Max Categories | categoryIds.length ≤ 12 | "Maximum 12 categories" |

### Expected Outcome
- Complete configuration form for Categories section
- Category selection with hierarchy support
- Grid and carousel display options
- Reorderable category list
- Display customization toggles
- Validation and preview

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Homepage/CategoriesConfig.tsx` created
- [ ] All form fields implemented
- [ ] Category multi-select works
- [ ] Display style toggle functional
- [ ] Grid columns selector works (when grid selected)
- [ ] Carousel settings work (when carousel selected)
- [ ] Category reordering functional
- [ ] Display option toggles work
- [ ] Form validation shows errors
- [ ] onChange callback fires correctly
- [ ] TypeScript interfaces defined
- [ ] Component exports properly

---

## Task 74: Create Testimonials Config

### Overview
Create the TestimonialsConfig component that provides a configuration form for the Testimonials section. This component allows users to add, edit, and remove customer testimonials, set the section title, choose display style (cards or carousel), and configure testimonial display settings.

### Dependencies
- Task 67: Create Homepage Builder

### Instructions

1. **Create TestimonialsConfig component file**
   - Create `TestimonialsConfig.tsx` in `components/storefront/theme/Homepage/` directory
   - Set up TypeScript React functional component structure

2. **Define Testimonials configuration interface**
   - Create `TestimonialsSectionConfig` interface
   - Include fields: title, testimonials array, displayStyle, showRatings, showImages
   - Create `Testimonial` interface for individual testimonial structure

3. **Define component props**
   - Create `TestimonialsConfigProps` interface
   - Include config prop
   - Include onChange callback

4. **Implement form layout**
   - Create sections: General, Testimonials List, Display
   - Use expandable/collapsible sections
   - Maintain clear organization

5. **Add section title field**
   - Text input for section heading
   - Max 50 characters
   - Default: "What Our Customers Say"
   - Show character counter

6. **Create testimonials list interface**
   - Display all existing testimonials
   - Show preview of each (customer name + excerpt)
   - Add edit and delete buttons for each
   - Show drag handles for reordering

7. **Implement add testimonial functionality**
   - "Add Testimonial" button
   - Open modal or inline form when clicked
   - Include fields: name, role, company, testimonial text, rating, image

8. **Create testimonial form fields**
   - Customer Name (required, max 50 chars)
   - Role/Title (optional, max 50 chars)
   - Company (optional, max 50 chars)
   - Testimonial Text (required, max 300 chars)
   - Rating (1-5 stars, optional)
   - Customer Image (optional, upload or URL)

9. **Implement edit testimonial**
   - Click edit button to open form
   - Populate form with existing data
   - Save to update testimonial
   - Cancel to discard changes

10. **Implement delete testimonial**
    - Delete button with confirmation
    - Remove from testimonials array
    - Update config immediately

11. **Add display style selector**
    - Radio buttons or segmented control
    - Options: "Cards" or "Carousel"
    - Default: Carousel
    - Show icon preview of each style

12. **Add display options toggles**
    - Show Ratings toggle (default: true)
    - Show Customer Images toggle (default: true)
    - Show Company Names toggle (default: false)

13. **Implement testimonial reordering**
    - Drag handles in testimonials list
    - Drag to reorder testimonials
    - Update order in config

14. **Handle form changes**
    - Validate testimonial data
    - Call onChange callback with updated config
    - Show testimonial count limit (e.g., max 10)

### Testimonials Section Configuration Interface

```typescript
interface Testimonial {
  id: string;                       // Unique identifier
  customerName: string;             // Customer name
  role?: string;                    // Job title
  company?: string;                 // Company name
  text: string;                     // Testimonial content
  rating?: number;                  // 1-5 stars
  image?: string;                   // Avatar URL
}

interface TestimonialsSectionConfig {
  title: string;                    // Section heading
  testimonials: Testimonial[];      // Array of testimonials
  displayStyle: 'cards' | 'carousel';
  showRatings: boolean;             // Display star ratings
  showImages: boolean;              // Display customer avatars
  showCompany: boolean;             // Display company names
}
```

### Form Layout Structure

```
┌────────────────────────────────────┐
│  Testimonials Configuration        │
├────────────────────────────────────┤
│  General Settings                  │
│  Section Title: [______________]   │
│                 (50 chars max)     │
│                                    │
│  Testimonials (3)                  │
│  ┌──────────────────────────────┐ │
│  │ ☰ John Doe - "Great service"│ │
│  │   ★★★★★  [Edit] [Delete]    │ │
│  ├──────────────────────────────┤ │
│  │ ☰ Jane Smith - "Love it!"   │ │
│  │   ★★★★☆  [Edit] [Delete]    │ │
│  ├──────────────────────────────┤ │
│  │ ☰ Bob Johnson - "Excellent" │ │
│  │   ★★★★★  [Edit] [Delete]    │ │
│  └──────────────────────────────┘ │
│  [+ Add Testimonial]               │
│                                    │
│  Display Style                     │
│  ○ Cards    ◉ Carousel             │
│                                    │
│  Display Options                   │
│  Show Ratings:  [✓]                │
│  Show Images:   [✓]                │
│  Show Company:  [ ]                │
│                                    │
│  [Preview Section]                 │
└────────────────────────────────────┘
```

### Add/Edit Testimonial Form

```
┌────────────────────────────────────┐
│  Add Testimonial                   │
├────────────────────────────────────┤
│  Customer Name: [______________]   │
│                 (Required)         │
│  Role/Title:    [______________]   │
│  Company:       [______________]   │
│                                    │
│  Testimonial:   [______________]   │
│                 [______________]   │
│                 [______________]   │
│                 (300 chars max)    │
│                                    │
│  Rating:  ☆☆☆☆☆                   │
│           (Click stars to rate)    │
│                                    │
│  Customer Image (optional)         │
│  ┌──────┐                         │
│  │[    ]│  [Upload Image]          │
│  └──────┘                         │
│                                    │
│  [Cancel] [Save Testimonial]       │
└────────────────────────────────────┘
```

### Testimonial Field Specifications

| Field | Type | Max Length | Required | Default |
|-------|------|------------|----------|---------|
| Customer Name | Text Input | 50 chars | Yes | - |
| Role | Text Input | 50 chars | No | - |
| Company | Text Input | 50 chars | No | - |
| Testimonial Text | Textarea | 300 chars | Yes | - |
| Rating | Star Selector | 1-5 | No | 5 |
| Image | Image Upload/URL | - | No | Default avatar |

### Display Style Comparison

```
Cards Style:                  Carousel Style:
┌────┬────┬────┐            ◄ ┌──────────┐ ►
│ T1 │ T2 │ T3 │              │    T1    │
│    │    │    │              │ (Larger) │
└────┴────┴────┘              └──────────┘
(All visible)                 (One/few at a time)
```

### Display Options Effect

| Option | When Enabled | When Disabled |
|--------|--------------|---------------|
| Ratings | ★★★★★ shown | No stars |
| Images | Avatar image displayed | Name initials or icon |
| Company | "CEO at Company X" | Role only or blank |

### Testimonial Card Preview

```
With All Options:
┌──────────────────────┐
│  ┌────┐              │
│  │[Img]│ John Doe    │
│  └────┘ CEO at TechCo│
│                      │
│  "Great service..."  │
│                      │
│  ★★★★★              │
└──────────────────────┘

Minimal:
┌──────────────────────┐
│  John Doe            │
│                      │
│  "Great service..."  │
└──────────────────────┘
```

### Form Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Title Required | title.length > 0 | "Section title is required" |
| Name Required | customerName.length > 0 | "Customer name is required" |
| Text Required | text.length > 0 | "Testimonial text is required" |
| Text Length | text.length ≤ 300 | "Text too long (max 300)" |
| Max Testimonials | testimonials.length ≤ 10 | "Maximum 10 testimonials" |
| Valid Rating | rating ≥ 1 && rating ≤ 5 | "Rating must be 1-5 stars" |

### Expected Outcome
- Complete configuration form for Testimonials section
- Add, edit, delete testimonials functionality
- Testimonial reordering capability
- Display style selection
- Display options configuration
- Form validation and preview

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Homepage/TestimonialsConfig.tsx` created
- [ ] All form fields implemented
- [ ] Add testimonial form works
- [ ] Edit testimonial form populates and saves
- [ ] Delete testimonial with confirmation works
- [ ] Testimonial reordering functional
- [ ] Display style toggle works
- [ ] Display option toggles work
- [ ] Form validation shows errors
- [ ] Character counters display correctly
- [ ] onChange callback fires correctly
- [ ] TypeScript interfaces defined
- [ ] Component exports properly

---

## Task 75: Create Newsletter Config

### Overview
Create the NewsletterConfig component that provides a configuration form for the Newsletter subscription section. This component allows users to customize the section title, subtitle/description, submit button text, background color or image, and subscription form settings.

### Dependencies
- Task 67: Create Homepage Builder

### Instructions

1. **Create NewsletterConfig component file**
   - Create `NewsletterConfig.tsx` in `components/storefront/theme/Homepage/` directory
   - Set up TypeScript React functional component structure

2. **Define Newsletter configuration interface**
   - Create `NewsletterSectionConfig` interface
   - Include fields: title, subtitle, buttonText, backgroundColor, backgroundImage, showPrivacyNotice
   - Define TypeScript types for all fields

3. **Define component props**
   - Create `NewsletterConfigProps` interface
   - Include config prop
   - Include onChange callback

4. **Implement form layout**
   - Create sections: Content, Design, Privacy
   - Use clear section headers
   - Group related settings

5. **Add section title field**
   - Text input for main heading
   - Max 60 characters
   - Default: "Subscribe to Our Newsletter"
   - Show character counter

6. **Add subtitle/description field**
   - Textarea for supporting text
   - Max 150 characters
   - Default: "Get the latest updates and exclusive offers"
   - Show character counter

7. **Add button text field**
   - Text input for submit button
   - Max 30 characters
   - Default: "Subscribe"
   - Preview button appearance

8. **Add background style selector**
   - Radio buttons or tabs
   - Options: "Color" or "Image"
   - Different fields shown based on selection

9. **Implement background color picker**
   - Show when background style is "Color"
   - Color picker component
   - Predefined color swatches for brand colors
   - Default to brand primary color

10. **Implement background image upload**
    - Show when background style is "Image"
    - File upload input or URL field
    - Display current image thumbnail
    - Image requirements: 1920x400px recommended

11. **Add privacy notice toggle**
    - Switch to show/hide privacy notice
    - Default: true
    - Preview of privacy text

12. **Add privacy notice text field**
    - Show when privacy toggle is enabled
    - Textarea input
    - Max 200 characters
    - Default: "We respect your privacy. Unsubscribe at any time."

13. **Add form placement option**
    - Radio buttons: "Inline" or "Modal/Popup"
    - Default: Inline
    - Note: Affects storefront behavior

14. **Handle form changes**
    - Validate required fields
    - Call onChange callback with updated config
    - Show preview of newsletter section

### Newsletter Section Configuration Interface

```typescript
interface NewsletterSectionConfig {
  title: string;                    // Main heading
  subtitle: string;                 // Supporting text
  buttonText: string;               // Submit button text
  backgroundType: 'color' | 'image';
  backgroundColor?: string;          // Hex color
  backgroundImage?: string;          // Image URL
  showPrivacyNotice: boolean;       // Display privacy text
  privacyText?: string;             // Custom privacy notice
  formPlacement: 'inline' | 'modal';
}
```

### Form Layout Structure

```
┌────────────────────────────────────┐
│  Newsletter Configuration          │
├────────────────────────────────────┤
│  Content                           │
│  Title: [_____________________]    │
│         (60 chars max)             │
│  Subtitle: [__________________]    │
│            [__________________]    │
│         (150 chars max)            │
│  Button Text: [______________]     │
│               (30 chars max)       │
│                                    │
│  Design                            │
│  Background:  ◉ Color  ○ Image     │
│                                    │
│  [If Color:]                       │
│  Background Color: [■] ▼           │
│  ┌─┬─┬─┬─┬─┐ (Color swatches)    │
│  │█│█│█│█│█│                      │
│  └─┴─┴─┴─┴─┘                      │
│                                    │
│  [If Image:]                       │
│  Background Image:                 │
│  ┌──────┐                         │
│  │[    ]│  [Upload/Change]         │
│  └──────┘                         │
│                                    │
│  Privacy & Compliance              │
│  Show Privacy Notice: [✓]          │
│  Privacy Text: [_______________]   │
│                [_______________]   │
│                (200 chars max)     │
│                                    │
│  Form Placement                    │
│  ◉ Inline   ○ Modal/Popup          │
│                                    │
│  [Preview Section]                 │
└────────────────────────────────────┘
```

### Background Type Comparison

```
Color Background:              Image Background:
┌────────────────────┐        ┌────────────────────┐
│ ████████████████   │        │ [Background Image] │
│ Subscribe Now!     │        │ Subscribe Now!     │
│ [email] [Submit]   │        │ [email] [Submit]   │
└────────────────────┘        └────────────────────┘
(Solid color)                 (Image overlay)
```

### Newsletter Field Specifications

| Field | Type | Max Length | Required | Default |
|-------|------|------------|----------|---------|
| Title | Text Input | 60 chars | Yes | "Subscribe to Our Newsletter" |
| Subtitle | Textarea | 150 chars | No | "Get the latest..." |
| Button Text | Text Input | 30 chars | Yes | "Subscribe" |
| Background Color | Color Picker | 7 chars | If color | Brand primary |
| Background Image | Image Upload | - | If image | - |
| Privacy Text | Textarea | 200 chars | If shown | Default notice |

### Brand Color Swatches

| Color | Usage | Hex |
|-------|-------|-----|
| Primary | Main brand | #0066CC |
| Secondary | Accent | #FF6B00 |
| Dark | Professional | #1A202C |
| Light | Subtle | #F7FAFC |
| Success | Action | #10B981 |

### Background Image Requirements

| Aspect | Specification |
|--------|---------------|
| Recommended Size | 1920x400px |
| Min Size | 1280x300px |
| Max File Size | 1MB |
| Formats | JPEG, PNG, WebP |
| Content | Low-detail for readability |

### Form Placement Options

| Placement | Description | Use Case |
|-----------|-------------|----------|
| Inline | Embedded in page flow | Standard homepage |
| Modal | Popup on page load/exit | Aggressive growth |

### Newsletter Section Preview

```
With Color Background:
┌──────────────────────────────────┐
│ █████████████████████████████    │
│                                  │
│     Subscribe to Our Newsletter  │
│  Get latest updates and offers   │
│                                  │
│  [Enter your email] [Subscribe]  │
│                                  │
│  We respect your privacy.        │
│  Unsubscribe anytime.            │
│                                  │
└──────────────────────────────────┘

With Image Background:
┌──────────────────────────────────┐
│ ░░ [Background Image] ░░░░░░░    │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│     Subscribe to Our Newsletter  │
│  Get latest updates and offers   │
│                                  │
│  [Enter your email] [Subscribe]  │
│                                  │
│  We respect your privacy.        │
└──────────────────────────────────┘
```

### Form Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Title Required | title.length > 0 | "Title is required" |
| Title Length | title.length ≤ 60 | "Title too long (max 60)" |
| Button Required | buttonText.length > 0 | "Button text required" |
| Button Length | buttonText.length ≤ 30 | "Button text too long" |
| Color Required | If color: hex valid | "Invalid color format" |
| Image Required | If image: URL valid | "Invalid image URL" |

### Privacy Compliance

| Consideration | Implementation |
|---------------|----------------|
| GDPR | Privacy notice recommended |
| Double Opt-in | Consider enabling |
| Unsubscribe | Always provide option |
| Data Storage | Secure handling |

### Expected Outcome
- Complete configuration form for Newsletter section
- Title and description customization
- Background styling (color or image)
- Privacy notice configuration
- Form placement options
- Validation and preview

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Homepage/NewsletterConfig.tsx` created
- [ ] All form fields implemented
- [ ] Background type selector works
- [ ] Color picker functional (when color selected)
- [ ] Image upload works (when image selected)
- [ ] Privacy notice toggle works
- [ ] Privacy text field displays conditionally
- [ ] Form placement selector works
- [ ] Character counters display correctly
- [ ] Form validation shows errors
- [ ] onChange callback fires correctly
- [ ] Preview shows accurate representation
- [ ] TypeScript interfaces defined
- [ ] Component exports properly

---

## Summary

This document established the homepage section builder infrastructure and comprehensive configuration forms for all major section types. The builder provides a visual interface for managing homepage sections with drag-and-drop reordering, enable/disable toggles, and detailed per-section settings.

### Completed Tasks
1. ✓ Created Homepage Builder container with split-screen layout
2. ✓ Created Section List with drag-and-drop functionality
3. ✓ Created Section Drag Handle for visual drag affordance
4. ✓ Created Section Toggle for enabling/disabling sections
5. ✓ Created Hero Section Config with image, text, and CTA settings
6. ✓ Created Featured Products Config with manual and automatic selection
7. ✓ Created Categories Section Config with grid and carousel options
8. ✓ Created Testimonials Config with add/edit/delete functionality
9. ✓ Created Newsletter Config with background and privacy settings

### Next Steps
Proceed to [02_Tasks-76-80_Add-Save-Verify.md](02_Tasks-76-80_Add-Save-Verify.md) to implement add section functionality, section settings panel, save API integration, homepage preview, and complete verification testing.

---

## Additional Resources

### Drag-and-Drop Libraries

| Library | Documentation |
|---------|---------------|
| dnd-kit | https://docs.dndkit.com/ |
| react-beautiful-dnd | https://github.com/atlassian/react-beautiful-dnd |

### UI Component Libraries

| Library | Components Used |
|---------|----------------|
| Shadcn/ui | Switch, Select, Slider, Dialog |
| Radix UI | Toggle, Dropdown, ColorPicker |
| Lucide React | Icons (GripVertical, Plus, etc.) |

### Design Patterns

| Pattern | Application |
|---------|-------------|
| Split-pane Layout | Builder interface |
| Modal/Drawer | Configuration forms |
| Drag-and-drop | Section reordering |
| Toggle switches | Enable/disable |
| Form validation | Input validation |

---

**End of Document 01**
