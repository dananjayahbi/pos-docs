# Tasks 49-56: Card, Tabs, and Dialog Components

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** D - Layout & Overlay Components  
> **Document:** 01 of 03  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-57-64_Sheet-Menus-Command.md](02_Tasks-57-64_Sheet-Menus-Command.md)

---

## Document Overview

This document covers the implementation of card components, tab navigation systems, collapsible accordions, and dialog/modal components. These elements provide essential layout containers and overlay UI patterns for building the ERP dashboard interface, enabling organized content presentation and user interactions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Install Card Component | Low | 15 min |
| 50 | Create StatCard Component | Medium | 30 min |
| 51 | Install Tabs Component | Low | 15 min |
| 52 | Customize Tabs Variants | Medium | 25 min |
| 53 | Install Accordion Component | Low | 15 min |
| 54 | Install Dialog Component | Low | 15 min |
| 55 | Create ConfirmDialog Component | Medium | 30 min |
| 56 | Create FormDialog Component | Medium | 35 min |

---

## Task 49: Install Card Component

### Overview
Install and configure the Card component from shadcn/ui, which provides a flexible container for grouping related content with optional header, content, and footer sections. Cards are fundamental building blocks for dashboard layouts and content organization.

### Dependencies
- SubPhase-01: Next.js project setup completed
- SubPhase-02: Tailwind CSS and design system configured
- shadcn/ui CLI installed

### Instructions

1. **Install Card component using CLI**
   - Navigate to frontend project directory
   - Run shadcn/ui add command for Card component
   - Accept default configuration

2. **Verify component files created**
   - Check `components/ui/card.tsx` was created
   - Inspect Card component structure
   - Verify all sub-components exported (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)

3. **Review component API**
   - Study Card component props
   - Understand composition pattern (header, content, footer)
   - Note className customization options

4. **Test basic Card usage**
   - Create test page or component
   - Import Card components
   - Render simple card with header, content, footer

5. **Verify styling integration**
   - Confirm Tailwind classes apply correctly
   - Check border, shadow, padding defaults
   - Test responsive behavior

### Card Component Structure

```
┌─────────────────────────────────┐
│ CardHeader                      │
│  ┌──────────────────────────┐   │
│  │ CardTitle                │   │  ← Main heading
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │ CardDescription          │   │  ← Subtitle/description
│  └──────────────────────────┘   │
├─────────────────────────────────┤
│ CardContent                     │
│                                 │
│  [Main content area]            │  ← Primary content
│                                 │
│                                 │
├─────────────────────────────────┤
│ CardFooter                      │
│  [Actions/metadata]             │  ← Footer content
└─────────────────────────────────┘
```

### Card Sub-Components

| Component | Purpose | Typical Content |
|-----------|---------|-----------------|
| Card | Root container | Wraps all card content |
| CardHeader | Top section | Title, description, actions |
| CardTitle | Main heading | Card title text |
| CardDescription | Subtitle | Supporting description text |
| CardContent | Main body | Primary card content |
| CardFooter | Bottom section | Actions, metadata, timestamps |

### Expected Outcome
- Card component installed and functional
- All sub-components available for use
- Clean, reusable container for content grouping
- Foundation for dashboard widgets and data displays

### Verification Checklist
- [ ] `components/ui/card.tsx` file exists
- [ ] Card component exports all sub-components
- [ ] Test card renders correctly
- [ ] Styling matches design system
- [ ] Component is type-safe (TypeScript)
- [ ] No console errors or warnings

---

## Task 50: Create StatCard Component

### Overview
Create a specialized StatCard component for displaying key performance indicators (KPIs) and statistics on the dashboard. This component presents numeric data with supporting context, including trend indicators, icons, and descriptive text.

### Dependencies
- Task 49: Install Card Component

### Instructions

1. **Create StatCard component file**
   - Navigate to `components/dashboard/` directory
   - Create `stat-card.tsx` file
   - Set up TypeScript component structure

2. **Define StatCard props interface**
   - Define props: title, value, change, trend, icon, description
   - Make appropriate props optional
   - Add type definitions for trend ('up' | 'down' | 'neutral')

3. **Implement component layout**
   - Use Card as base component
   - Structure layout for stat display
   - Position icon, title, value prominently

4. **Add trend indicator logic**
   - Create conditional rendering for trend
   - Display up/down/neutral indicators
   - Color code based on trend direction

5. **Implement change percentage display**
   - Format change value with sign (+/-)
   - Style based on positive/negative
   - Position near main value

6. **Add icon support**
   - Accept icon component as prop
   - Position icon in header or beside value
   - Apply consistent sizing and colors

7. **Style value formatting**
   - Support large numbers with formatting
   - Handle currency, percentage, count displays
   - Ensure readability with appropriate font sizes

8. **Add description field**
   - Display optional descriptive text
   - Position in footer or below value
   - Use muted text styling

### StatCard Layout Structure

```
┌─────────────────────────────────────┐
│  [Icon]  Title                      │  ← Header with icon and title
├─────────────────────────────────────┤
│                                     │
│         1,234,567                   │  ← Large value display
│                                     │
│         ↑ +12.5%                    │  ← Trend indicator and change
│                                     │
├─────────────────────────────────────┤
│  Compared to last month             │  ← Description/context
└─────────────────────────────────────┘
```

### StatCard Variants

#### Revenue Card
```
┌─────────────────────────────────┐
│  [$]  Total Revenue             │
│                                 │
│        Rs 1,234,567.00          │
│        ↑ +8.2%                  │
│                                 │
│  Up from last month             │
└─────────────────────────────────┘
```

#### Orders Card
```
┌─────────────────────────────────┐
│  [📦]  Orders                   │
│                                 │
│        1,523                    │
│        ↓ -3.1%                  │
│                                 │
│  Down from last week            │
└─────────────────────────────────┘
```

#### Customer Card
```
┌─────────────────────────────────┐
│  [👥]  Active Customers         │
│                                 │
│        8,492                    │
│        → 0.0%                   │
│                                 │
│  No change from yesterday       │
└─────────────────────────────────┘
```

### Trend Indicator Styling

| Trend | Icon | Color | Meaning |
|-------|------|-------|---------|
| up | ↑ | Green (success) | Positive increase |
| down | ↓ | Red (destructive) | Negative decrease |
| neutral | → | Gray (muted) | No significant change |

### Value Formatting Examples

| Type | Raw Value | Formatted Display |
|------|-----------|-------------------|
| Currency | 1234567.50 | Rs 1,234,567.50 |
| Count | 8492 | 8,492 |
| Percentage | 0.125 | 12.5% |
| Large Number | 1234567 | 1.23M |

### Expected Outcome
- Reusable StatCard component for KPIs
- Consistent stat display across dashboard
- Support for various data types (currency, counts, percentages)
- Visual trend indicators with color coding
- Clean, scannable layout for metrics

### Verification Checklist
- [ ] `components/dashboard/stat-card.tsx` file created
- [ ] Props interface defined with all fields
- [ ] Component uses Card as base
- [ ] Trend indicators display correctly
- [ ] Color coding works for up/down/neutral
- [ ] Change percentage formatted with sign
- [ ] Icon support implemented
- [ ] Value formatting handles large numbers
- [ ] Description field displays properly
- [ ] TypeScript types are complete

---

## Task 51: Install Tabs Component

### Overview
Install the Tabs component from shadcn/ui to enable tabbed navigation within pages. Tabs organize related content into separate panels, allowing users to switch between views without leaving the current page context.

### Dependencies
- SubPhase-01: Next.js project setup completed
- SubPhase-02: Tailwind CSS configured
- shadcn/ui CLI installed

### Instructions

1. **Install Tabs component using CLI**
   - Navigate to frontend project directory
   - Run shadcn/ui add command for Tabs
   - Accept default configuration

2. **Verify component files created**
   - Check `components/ui/tabs.tsx` was created
   - Inspect Tabs component structure
   - Verify all sub-components exported (Tabs, TabsList, TabsTrigger, TabsContent)

3. **Review component API**
   - Study Tabs props (defaultValue, value, onValueChange)
   - Understand controlled/uncontrolled modes
   - Note composition pattern for tabs

4. **Test basic Tabs usage**
   - Create test implementation
   - Add multiple tab triggers and content panels
   - Verify switching behavior

5. **Verify accessibility features**
   - Test keyboard navigation (arrow keys, tab)
   - Check ARIA attributes
   - Verify focus management

6. **Test responsive behavior**
   - Check tabs on mobile viewports
   - Verify horizontal scrolling if needed
   - Test touch interactions

### Tabs Component Structure

```
┌───────────────────────────────────────────────┐
│ TabsList                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │ Tab 1   │ │ Tab 2   │ │ Tab 3   │        │  ← Tab triggers
│  └─────────┘ └─────────┘ └─────────┘        │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ TabsContent (active)                          │
│                                               │
│  [Content for selected tab]                  │  ← Active content panel
│                                               │
│                                               │
└───────────────────────────────────────────────┘
```

### Tab Composition Pattern

| Component | Purpose | Required |
|-----------|---------|----------|
| Tabs | Root container, manages state | Yes |
| TabsList | Container for tab triggers | Yes |
| TabsTrigger | Individual tab button | Yes (multiple) |
| TabsContent | Content panel for each tab | Yes (matches triggers) |

### Tab State Management

#### Uncontrolled Mode
- Tabs manage own state internally
- Use defaultValue prop
- Simple implementation for basic use cases

#### Controlled Mode
- Parent component controls active tab
- Use value and onValueChange props
- Enables programmatic tab switching
- Useful for complex interactions

### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Keyboard Navigation | Arrow keys move between tabs | Accessibility compliance |
| Focus Management | Visual focus indicators | Shows active element |
| ARIA Attributes | role, aria-selected, aria-controls | Screen reader support |
| Tab/Enter Keys | Activate selected tab | Standard keyboard interaction |

### Expected Outcome
- Tabs component installed and functional
- Tab switching works smoothly
- Keyboard navigation operational
- Accessible to screen readers
- Foundation for tabbed interfaces throughout app

### Verification Checklist
- [ ] `components/ui/tabs.tsx` file exists
- [ ] All sub-components exported
- [ ] Test tabs render correctly
- [ ] Tab switching works
- [ ] Keyboard navigation functional
- [ ] ARIA attributes present
- [ ] Styling matches design system
- [ ] No console errors or warnings

---

## Task 52: Customize Tabs Variants

### Overview
Create multiple visual variants for the Tabs component to support different UI contexts. Implement default/underline variant, pills variant, and enclosed variant, each with distinct styling appropriate for various use cases in the ERP dashboard.

### Dependencies
- Task 51: Install Tabs Component

### Instructions

1. **Plan variant architecture**
   - Identify three main variants: default, pills, enclosed
   - Define styling differences for each
   - Plan how to apply variants

2. **Extend Tabs component with variant prop**
   - Modify `components/ui/tabs.tsx`
   - Add variant prop to TabsList component
   - Define variant type: 'default' | 'pills' | 'enclosed'

3. **Implement default (underline) variant**
   - Style tab triggers with bottom border
   - Active tab shows colored underline
   - Minimal, clean appearance

4. **Implement pills variant**
   - Style tabs as rounded pills
   - Active tab has filled background
   - Better for prominent navigation

5. **Implement enclosed variant**
   - Style tabs with borders and background
   - Tabs appear as connected buttons
   - Good for form-like interfaces

6. **Apply variant styles using cn utility**
   - Use conditional classes based on variant prop
   - Leverage Tailwind CSS for styling
   - Ensure smooth transitions

7. **Create variant examples**
   - Document each variant with example
   - Show appropriate use cases
   - Provide usage guidelines

### Tab Variants Visual Comparison

#### Default (Underline) Variant
```
┌──────────────────────────────────────────┐
│  Overview   Settings   Security          │  ← Underline active tab
│  ═══════                                 │
└──────────────────────────────────────────┘
```
- Minimal visual weight
- Clear active indicator
- Best for: Content-heavy pages, subtle navigation

#### Pills Variant
```
┌──────────────────────────────────────────┐
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │Overview │  │Settings │  │Security │  │  ← Filled pill for active
│  └─────────┘  └─────────┘  └─────────┘  │
└──────────────────────────────────────────┘
```
- High visibility
- Rounded, modern appearance
- Best for: Primary navigation, prominent sections

#### Enclosed Variant
```
┌──────────────────────────────────────────┐
│ ┌─────────┬─────────┬─────────┐         │
│ │Overview │Settings │Security │         │  ← Connected tabs with borders
│ └─────────┴─────────┴─────────┘         │
└──────────────────────────────────────────┘
```
- Traditional tab appearance
- Clear visual grouping
- Best for: Forms, dialog content, settings panels

### Variant Styling Specifications

| Variant | Active State | Inactive State | Best Use Case |
|---------|--------------|----------------|---------------|
| Default | Bottom border (primary color) | No border, muted text | Content pages, articles |
| Pills | Filled background (primary) | Transparent, muted text | Dashboard sections, main nav |
| Enclosed | Filled background, top/side borders | Background, all borders | Settings, dialogs, forms |

### Variant Selection Guidelines

#### Use Default When:
- Content is primary focus
- Navigation should be subtle
- Minimalist design preferred
- Reading-focused interfaces

#### Use Pills When:
- Navigation is important
- Modern, friendly appearance desired
- High contrast needed
- Dashboard-style layouts

#### Use Enclosed When:
- Traditional UI expected
- Clear boundaries needed
- Form sections or settings
- Multi-step processes

### Expected Outcome
- Three distinct tab variants available
- Each variant has appropriate styling
- Variants suitable for different contexts
- Consistent API across variants
- Enhanced design flexibility

### Verification Checklist
- [ ] Variant prop added to component
- [ ] Default (underline) variant implemented
- [ ] Pills variant implemented
- [ ] Enclosed variant implemented
- [ ] Variant styles apply correctly
- [ ] Active/inactive states styled properly
- [ ] Transitions smooth between states
- [ ] Documentation updated with variants
- [ ] Examples created for each variant
- [ ] TypeScript types updated

---

## Task 53: Install Accordion Component

### Overview
Install the Accordion component from shadcn/ui to provide collapsible sections for organizing content. Accordions allow users to expand and collapse content panels, making them ideal for FAQs, settings groups, and information sections where screen space is limited.

### Dependencies
- SubPhase-01: Next.js project setup completed
- SubPhase-02: Tailwind CSS configured
- shadcn/ui CLI installed

### Instructions

1. **Install Accordion component using CLI**
   - Navigate to frontend project directory
   - Run shadcn/ui add command for Accordion
   - Accept default configuration

2. **Verify component files created**
   - Check `components/ui/accordion.tsx` was created
   - Inspect component structure
   - Verify sub-components exported (Accordion, AccordionItem, AccordionTrigger, AccordionContent)

3. **Review component API**
   - Study Accordion props (type: 'single' | 'multiple', collapsible)
   - Understand single vs multiple modes
   - Note composition pattern

4. **Test single mode accordion**
   - Create test with type="single"
   - Verify only one item open at a time
   - Test collapsible option

5. **Test multiple mode accordion**
   - Create test with type="multiple"
   - Verify multiple items can be open
   - Test independent expansion/collapse

6. **Verify animations**
   - Check smooth expand/collapse transitions
   - Verify content reveals properly
   - Test animation performance

7. **Test accessibility**
   - Verify keyboard navigation (Enter, Space, Arrow keys)
   - Check ARIA attributes
   - Test screen reader compatibility

### Accordion Component Structure

```
┌────────────────────────────────────────┐
│ AccordionItem 1                        │
│  ┌─────────────────────────────────┐   │
│  │ AccordionTrigger        [▼]    │   │  ← Clickable header
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ AccordionContent (expanded)     │   │  ← Content panel
│  │ Content details here...         │   │
│  └─────────────────────────────────┘   │
├────────────────────────────────────────┤
│ AccordionItem 2                        │
│  ┌─────────────────────────────────┐   │
│  │ AccordionTrigger        [▶]    │   │  ← Collapsed
│  └─────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### Accordion Sub-Components

| Component | Purpose | Required |
|-----------|---------|----------|
| Accordion | Root container, manages state | Yes |
| AccordionItem | Individual collapsible section | Yes (multiple) |
| AccordionTrigger | Clickable header with chevron | Yes (per item) |
| AccordionContent | Expandable content panel | Yes (per item) |

### Accordion Modes

#### Single Mode (type="single")
- Only one item can be open at a time
- Opening new item closes previous
- Optional collapsible prop allows closing all
- Use for: Settings sections, navigation groups

#### Multiple Mode (type="multiple")
- Multiple items can be open simultaneously
- Items expand/collapse independently
- All items can be open or closed
- Use for: FAQs, feature lists, detailed forms

### Accordion Use Cases

| Scenario | Mode | Example |
|----------|------|---------|
| Settings Groups | Single | User settings, display options, privacy settings |
| FAQ Sections | Multiple | Help documentation, troubleshooting guides |
| Form Sections | Single | Multi-step forms, wizard interfaces |
| Feature Lists | Multiple | Product features, specification details |
| Navigation Menus | Single | Sidebar navigation with sub-sections |

### Animation Behavior

```
Collapsed State:
┌──────────────────────────┐
│ Section Title      [▶]   │
└──────────────────────────┘

Expanding (animation):
┌──────────────────────────┐
│ Section Title      [▼]   │
│ ┌──────────────────────┐ │
│ │ Content appears...   │ │  ← Smooth height transition
│ └──────────────────────┘ │
└──────────────────────────┘

Expanded State:
┌──────────────────────────┐
│ Section Title      [▼]   │
│ ┌──────────────────────┐ │
│ │ Full content visible │ │
│ │ ...                  │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

### Expected Outcome
- Accordion component installed and functional
- Single and multiple modes working
- Smooth expand/collapse animations
- Keyboard navigation operational
- Accessible to assistive technologies

### Verification Checklist
- [ ] `components/ui/accordion.tsx` file exists
- [ ] All sub-components exported
- [ ] Single mode works correctly
- [ ] Multiple mode works correctly
- [ ] Collapsible option functional
- [ ] Animations smooth and performant
- [ ] Keyboard navigation works
- [ ] ARIA attributes present
- [ ] No console errors or warnings

---

## Task 54: Install Dialog Component

### Overview
Install the Dialog (modal) component from shadcn/ui to create overlay windows for focused interactions. Dialogs present content above the main interface, blocking interaction with the underlying page until dismissed. Essential for confirmations, forms, and detailed information displays.

### Dependencies
- SubPhase-01: Next.js project setup completed
- SubPhase-02: Tailwind CSS configured
- shadcn/ui CLI installed

### Instructions

1. **Install Dialog component using CLI**
   - Navigate to frontend project directory
   - Run shadcn/ui add command for Dialog
   - Accept default configuration

2. **Verify component files created**
   - Check `components/ui/dialog.tsx` was created
   - Inspect component structure
   - Verify all sub-components exported

3. **Review Dialog sub-components**
   - Dialog: Root component
   - DialogTrigger: Opens dialog
   - DialogContent: Main modal container
   - DialogHeader: Header section
   - DialogTitle: Title text
   - DialogDescription: Description text
   - DialogFooter: Footer with actions

4. **Test basic Dialog usage**
   - Create test implementation
   - Add trigger button
   - Display dialog with content

5. **Verify overlay behavior**
   - Check backdrop overlay appears
   - Test clicking outside to close
   - Verify escape key closes dialog

6. **Test focus management**
   - Verify focus traps within dialog
   - Check tab navigation stays in dialog
   - Confirm focus returns on close

7. **Verify accessibility**
   - Check ARIA attributes (role, aria-labelledby, aria-describedby)
   - Test screen reader announcements
   - Verify keyboard navigation

8. **Test scroll behavior**
   - Check body scroll lock when open
   - Verify dialog content scrolls if tall
   - Test on various viewport sizes

### Dialog Component Structure

```
┌─────────────────────────────────────────────┐
│ [Backdrop overlay - semi-transparent]       │
│                                             │
│   ┌───────────────────────────────────┐    │
│   │ DialogHeader                      │    │
│   │  ┌─────────────────────────────┐  │    │
│   │  │ DialogTitle                 │  │    │  ← Main heading
│   │  └─────────────────────────────┘  │    │
│   │  ┌─────────────────────────────┐  │    │
│   │  │ DialogDescription           │  │    │  ← Supporting text
│   │  └─────────────────────────────┘  │    │
│   ├───────────────────────────────────┤    │
│   │ DialogContent                     │    │
│   │                                   │    │
│   │  [Main dialog content]            │    │  ← Body content
│   │                                   │    │
│   ├───────────────────────────────────┤    │
│   │ DialogFooter                      │    │
│   │  [Cancel] [Confirm]               │    │  ← Action buttons
│   └───────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Dialog Sub-Components

| Component | Purpose | Required |
|-----------|---------|----------|
| Dialog | Root container, manages state | Yes |
| DialogTrigger | Button/element that opens dialog | Optional (can control programmatically) |
| DialogContent | Main modal window | Yes |
| DialogHeader | Top section for title/description | Optional but recommended |
| DialogTitle | Main heading | Recommended (accessibility) |
| DialogDescription | Supporting description | Optional |
| DialogFooter | Bottom section for actions | Optional but common |

### Dialog Behavior Features

#### Backdrop Overlay
- Semi-transparent dark background
- Covers entire viewport
- Prevents interaction with underlying page
- Can close dialog on click (optional)

#### Focus Management
- Focus moves to dialog on open
- Tab navigation contained within dialog
- Focus returns to trigger on close
- First focusable element receives focus

#### Keyboard Interactions

| Key | Action |
|-----|--------|
| Escape | Close dialog |
| Tab | Navigate forward through focusable elements |
| Shift+Tab | Navigate backward through focusable elements |
| Enter | Activate focused button/element |

#### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Focus Trap | Tab navigation stays in dialog | Prevents losing context |
| ARIA Roles | role="dialog", role="alertdialog" | Identifies dialog to AT |
| Labeling | aria-labelledby, aria-describedby | Provides context |
| Focus Return | Focus returns to trigger | Maintains navigation state |
| Body Scroll Lock | Prevents scrolling page behind | Maintains user context |

### Dialog States

#### Closed State
```
[Button: Open Dialog]  ← Trigger button visible
```

#### Open State
```
┌─────────────────────────────────────┐
│ ::::::::::::::::::::::::::::::::::  │  ← Backdrop
│ ::::::::::::::::::::::::::::::::::  │
│ ::::::::::::::::::::::::::::::::::  │
│ :::::  ┌──────────────────┐  ::::::  │
│ :::::  │ Dialog Content   │  ::::::  │  ← Modal window
│ :::::  │                  │  ::::::  │
│ :::::  └──────────────────┘  ::::::  │
│ ::::::::::::::::::::::::::::::::::  │
└─────────────────────────────────────┘
```

### Expected Outcome
- Dialog component installed and functional
- Modal opens and closes correctly
- Overlay and focus trap working
- Keyboard navigation operational
- Accessible to screen readers
- Foundation for custom dialog components

### Verification Checklist
- [ ] `components/ui/dialog.tsx` file exists
- [ ] All sub-components exported
- [ ] Dialog opens on trigger
- [ ] Backdrop overlay displays
- [ ] Click outside closes (if configured)
- [ ] Escape key closes dialog
- [ ] Focus traps correctly
- [ ] Focus returns on close
- [ ] Body scroll locks when open
- [ ] ARIA attributes present
- [ ] No console errors or warnings

---

## Task 55: Create ConfirmDialog Component

### Overview
Create a specialized ConfirmDialog component for handling destructive actions that require user confirmation. This component provides a consistent interface for delete confirmations, account closures, data loss warnings, and other critical actions that need explicit user approval.

### Dependencies
- Task 54: Install Dialog Component

### Instructions

1. **Create ConfirmDialog component file**
   - Navigate to `components/ui/` or `components/common/` directory
   - Create `confirm-dialog.tsx` file
   - Set up TypeScript component structure

2. **Define ConfirmDialog props interface**
   - Props: open, onOpenChange, onConfirm, title, description, variant
   - Add optional props: confirmText, cancelText
   - Define variant types: 'default' | 'destructive' | 'warning'

3. **Implement Dialog composition**
   - Use Dialog as base component
   - Structure header with title and description
   - Add footer with action buttons

4. **Create action button layout**
   - Position Cancel button (secondary)
   - Position Confirm button (primary)
   - Apply appropriate spacing

5. **Implement variant styling**
   - Default: Standard blue confirm button
   - Destructive: Red confirm button for delete actions
   - Warning: Yellow/orange for cautionary actions

6. **Add confirmation handler**
   - Call onConfirm when confirmed
   - Close dialog after confirmation
   - Handle async confirmation actions

7. **Implement cancel behavior**
   - Close dialog on cancel
   - Call onOpenChange with false
   - No action performed

8. **Add loading state support**
   - Accept isLoading prop
   - Disable buttons during async operations
   - Show loading indicator on confirm button

### ConfirmDialog Layout Structure

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ [Icon] Confirm Delete             │  │  ← Title with optional icon
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Are you sure you want to delete   │  │  ← Description
│  │ this item? This action cannot be  │  │
│  │ undone.                           │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │        [Cancel]  [Delete]         │  │  ← Action buttons
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### ConfirmDialog Variants

#### Default Variant
```
┌─────────────────────────────────┐
│  Confirm Action                 │
│                                 │
│  Are you sure you want to       │
│  proceed with this action?      │
│                                 │
│  [Cancel]  [Confirm]            │  ← Blue confirm button
└─────────────────────────────────┘
```

#### Destructive Variant
```
┌─────────────────────────────────┐
│  🗑️  Delete Item                │
│                                 │
│  This action cannot be undone.  │
│  All associated data will be    │
│  permanently deleted.           │
│                                 │
│  [Cancel]  [Delete]             │  ← Red delete button
└─────────────────────────────────┘
```

#### Warning Variant
```
┌─────────────────────────────────┐
│  ⚠️  Unsaved Changes            │
│                                 │
│  You have unsaved changes.      │
│  Are you sure you want to       │
│  leave without saving?          │
│                                 │
│  [Cancel]  [Leave]              │  ← Yellow/orange warning
└─────────────────────────────────┘
```

### Variant Specifications

| Variant | Button Color | Icon | Use Case |
|---------|-------------|------|----------|
| Default | Primary (blue) | None | Standard confirmations |
| Destructive | Destructive (red) | 🗑️ | Delete actions, irreversible changes |
| Warning | Warning (yellow) | ⚠️ | Data loss warnings, navigation with unsaved changes |

### Common Use Cases

#### Delete Confirmation
- Title: "Delete [Resource]"
- Description: Clear explanation of consequences
- Variant: Destructive
- Confirm Text: "Delete"

#### Account Closure
- Title: "Close Account"
- Description: List what will be deleted
- Variant: Destructive
- Confirm Text: "Close Account"

#### Discard Changes
- Title: "Unsaved Changes"
- Description: Warn about data loss
- Variant: Warning
- Confirm Text: "Discard"

#### Archive Item
- Title: "Archive [Resource]"
- Description: Explain archive functionality
- Variant: Default
- Confirm Text: "Archive"

### Loading State Behavior

```
Normal State:
┌─────────────────────────────────┐
│  [Cancel]  [Delete]             │
└─────────────────────────────────┘

Loading State:
┌─────────────────────────────────┐
│  [Cancel]  [🔄 Deleting...]     │  ← Disabled with spinner
└─────────────────────────────────┘
```

### Expected Outcome
- Reusable ConfirmDialog component
- Three variants for different severity levels
- Consistent confirmation UX across application
- Support for async operations with loading states
- Clear visual distinction between safe and destructive actions

### Verification Checklist
- [ ] `confirm-dialog.tsx` file created
- [ ] Props interface fully defined
- [ ] Dialog renders with all sections
- [ ] Default variant implemented
- [ ] Destructive variant implemented
- [ ] Warning variant implemented
- [ ] Confirm button triggers onConfirm
- [ ] Cancel button closes dialog
- [ ] Loading state supported
- [ ] Buttons disabled during loading
- [ ] TypeScript types complete
- [ ] Component is accessible

---

## Task 56: Create FormDialog Component

### Overview
Create a specialized FormDialog component for displaying forms in modal dialogs. This component handles form submission, validation errors, loading states, and provides a consistent interface for modal-based form interactions throughout the ERP application.

### Dependencies
- Task 54: Install Dialog Component

### Instructions

1. **Create FormDialog component file**
   - Navigate to `components/ui/` or `components/common/` directory
   - Create `form-dialog.tsx` file
   - Set up TypeScript component structure

2. **Define FormDialog props interface**
   - Props: open, onOpenChange, onSubmit, title, description
   - Add optional props: submitText, cancelText, isLoading
   - Add children prop for form content

3. **Implement Dialog composition**
   - Use Dialog as base component
   - Create DialogHeader with title and description
   - Add form element wrapping content
   - Add DialogFooter with form actions

4. **Set up form submission handler**
   - Wrap content in form element
   - Handle form onSubmit event
   - Call provided onSubmit prop
   - Prevent default form behavior

5. **Implement loading state**
   - Accept isLoading prop
   - Disable submit button when loading
   - Show loading indicator on button
   - Prevent form submission when loading

6. **Add form validation support**
   - Allow native HTML5 validation
   - Support for error states
   - Enable custom validation handling

7. **Create footer action layout**
   - Position Cancel button (secondary, type="button")
   - Position Submit button (primary, type="submit")
   - Apply proper spacing and alignment

8. **Handle dialog closure**
   - Close on successful submission (optional)
   - Close on cancel button
   - Support controlled closing behavior

9. **Add keyboard shortcuts**
   - Enter submits form (if appropriate)
   - Escape cancels/closes dialog
   - Tab navigation within form

### FormDialog Layout Structure

```
┌──────────────────────────────────────────────┐
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Add New Product                        │  │  ← Title
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ Enter the details for the new product │  │  ← Description
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Form Fields:                           │  │
│  │                                        │  │
│  │ [Product Name Input]                   │  │
│  │                                        │  │  ← Form content
│  │ [SKU Input]                            │  │
│  │                                        │  │
│  │ [Price Input]                          │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │          [Cancel]  [Create]            │  │  ← Form actions
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### FormDialog Usage Patterns

#### Create Resource Dialog
```
FormDialog
├── Title: "Create [Resource]"
├── Description: "Enter details..."
├── Form Fields:
│   ├── Required fields marked
│   ├── Validation rules applied
│   └── Error messages shown inline
└── Actions:
    ├── Cancel: Closes without saving
    └── Create: Submits form
```

#### Edit Resource Dialog
```
FormDialog
├── Title: "Edit [Resource]"
├── Description: "Update details..."
├── Form Fields:
│   └── Pre-filled with current values
└── Actions:
    ├── Cancel: Discards changes
    └── Save: Updates resource
```

#### Quick Action Dialog
```
FormDialog
├── Title: "Quick [Action]"
├── Description: Brief instruction
├── Minimal form fields
└── Actions:
    ├── Cancel
    └── [Action]: Executes quickly
```

### Form States

#### Normal State
```
┌────────────────────────────────┐
│  Product Name                  │
│  [_______________________]     │
│                                │
│  [Cancel]  [Create]            │
└────────────────────────────────┘
```

#### Loading State
```
┌────────────────────────────────┐
│  Product Name                  │
│  [_______________________]     │  ← Fields disabled
│                                │
│  [Cancel]  [🔄 Creating...]    │  ← Loading indicator
└────────────────────────────────┘
```

#### Error State
```
┌────────────────────────────────┐
│  Product Name                  │
│  [_______________________]     │
│  ❌ Product name is required   │  ← Error message
│                                │
│  [Cancel]  [Create]            │
└────────────────────────────────┘
```

### Submit Handler Pattern

#### Synchronous Submission
- Form submits immediately
- Dialog closes on success
- Errors displayed inline

#### Asynchronous Submission
- Show loading state during API call
- Disable form during submission
- Handle success/error responses
- Close dialog on success
- Display errors in form or toast

### Form Validation Approaches

| Approach | When to Validate | User Experience |
|----------|------------------|-----------------|
| On Submit | Form submission only | Simple, less intrusive |
| On Blur | Field loses focus | Immediate feedback per field |
| On Change | User types | Real-time validation |
| Hybrid | Blur first, then change | Balance of UX and performance |

### Expected Outcome
- Reusable FormDialog component for modal forms
- Consistent form submission handling
- Loading states during async operations
- Support for validation and error display
- Proper keyboard navigation and accessibility
- Clean API for form content composition

### Verification Checklist
- [ ] `form-dialog.tsx` file created
- [ ] Props interface fully defined
- [ ] Dialog renders with form element
- [ ] Form submission handler works
- [ ] Loading state implemented
- [ ] Submit button shows loading indicator
- [ ] Fields disabled during loading
- [ ] Cancel button closes dialog (type="button")
- [ ] Submit button submits form (type="submit")
- [ ] Keyboard shortcuts functional
- [ ] Children prop renders form content
- [ ] TypeScript types complete
- [ ] Component is accessible

---

## Summary

This document covered the implementation of essential layout and overlay components:

### Components Installed
1. **Card** - Flexible content container with header, content, footer
2. **StatCard** - Dashboard KPI display with trends and metrics
3. **Tabs** - Tabbed navigation with multiple variants
4. **Accordion** - Collapsible content sections
5. **Dialog** - Modal overlay component

### Custom Components Created
1. **StatCard** - Specialized card for dashboard statistics
2. **ConfirmDialog** - Standardized confirmation dialogs with variants
3. **FormDialog** - Modal forms with submission handling

### Key Achievements
- Established foundation for content organization
- Created reusable dashboard metric displays
- Implemented flexible tabbed navigation system
- Added collapsible sections for space efficiency
- Built modal/dialog infrastructure
- Created specialized confirmation patterns
- Enabled form-based modal interactions

### Next Steps
Proceed to [02_Tasks-57-64_Sheet-Menus-Command.md](02_Tasks-57-64_Sheet-Menus-Command.md) to implement Sheet (drawer) components, dropdown menus, and command palette functionality.

---

**Document End**
