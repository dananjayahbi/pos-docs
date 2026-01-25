# Tasks 57-64: Sheet, Menus, and Command Components

> **Phase:** 07 - Frontend Infrastructure ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** D - Layout & Overlay Components  
> **Document:** 02 of 02  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-56_Card-Tabs-Dialog.md](01_Tasks-49-56_Card-Tabs-Dialog.md)

---

## Document Overview

This document covers the implementation of overlay and command components for the ERP dashboard, including side panels (sheets), menu systems (dropdown/context), floating content (popovers/tooltips), and the command palette interface. These components enable advanced user interactions and navigation patterns.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Install Sheet Component | Low | 10 min |
| 58 | Create SidePanel Component | Medium | 30 min |
| 59 | Install DropdownMenu Component | Low | 10 min |
| 60 | Install ContextMenu Component | Low | 10 min |
| 61 | Install Popover Component | Low | 10 min |
| 62 | Install Tooltip Component | Low | 10 min |
| 63 | Install Command Component | Low | 10 min |
| 64 | Create CommandPalette Component | High | 45 min |

---

## Task 57: Install Sheet Component

### Overview
Install the shadcn/ui Sheet component, which provides a drawer/slide-out panel functionality. Sheets are commonly used for displaying auxiliary content, filters, settings panels, or detail views that slide in from the edge of the screen.

### Dependencies
- Node.js and npm/pnpm installed
- shadcn/ui CLI configured
- React project initialized
- Tailwind CSS configured

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend/dashboard directory
   - Ensure package.json exists

2. **Install Sheet component using CLI**
   - Run shadcn/ui CLI command to add Sheet
   - Component will be added to components/ui/sheet.tsx
   - Includes Radix UI Dialog primitive

3. **Verify component installation**
   - Check that sheet.tsx exists in components/ui/
   - Review exported components
   - Confirm dependencies installed

4. **Review component structure**
   - Sheet root component (main wrapper)
   - SheetTrigger (button to open sheet)
   - SheetContent (drawer content container)
   - SheetHeader, SheetTitle, SheetDescription
   - SheetFooter (action buttons area)
   - SheetClose (close button)

5. **Understand Sheet directions**
   - Default: slides from right
   - Supports: top, right, bottom, left
   - Controlled via side prop

6. **Test basic Sheet implementation**
   - Create test component with Sheet
   - Verify slide-in animation
   - Test overlay backdrop
   - Confirm close functionality

### Sheet Component Architecture

```
┌────────────────────────────────────────────────┐
│              Sheet Component                   │
├────────────────────────────────────────────────┤
│ Primitive: Radix UI Dialog                    │
│                                                │
│ Components:                                    │
│  • Sheet (root wrapper)                        │
│  • SheetTrigger (open button)                  │
│  • SheetContent (drawer container)             │
│  • SheetHeader (title area)                    │
│  • SheetTitle (heading)                        │
│  • SheetDescription (subtitle)                 │
│  • SheetFooter (actions)                       │
│  • SheetClose (close button)                   │
│                                                │
│ Features:                                      │
│  • Slide-in animation                          │
│  • Overlay backdrop                            │
│  • Focus trap                                  │
│  • Keyboard navigation (Esc to close)          │
│  • Multiple direction support                  │
└────────────────────────────────────────────────┘
```

### Sheet Direction Options

```
┌─────────────────────────────────────────────┐
│                   Top                       │
│  ┌───────────────────────────────────────┐  │
│  │         Sheet Content                 │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

┌──────────┬──────────────────────┬───────────┐
│   Left   │                      │   Right   │
│  ┌─────┐ │                      │  ┌─────┐  │
│  │ Con │ │   Main Content       │  │ Con │  │
│  │ tent│ │                      │  │ tent│  │
│  └─────┘ │                      │  └─────┘  │
└──────────┴──────────────────────┴───────────┘

┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐  │
│  │         Sheet Content                 │  │
│  └───────────────────────────────────────┘  │
│                  Bottom                     │
└─────────────────────────────────────────────┘
```

### Sheet Use Cases

| Use Case | Direction | Width | Purpose |
|----------|-----------|-------|---------|
| Detail View | Right | 400-600px | View item details without page change |
| Filters | Right/Left | 300-400px | Apply search/filter criteria |
| Settings Panel | Right | 400-500px | Adjust preferences and options |
| Navigation Menu | Left | 250-300px | Mobile menu drawer |
| Notifications | Right | 350-400px | Display notification list |
| Cart Preview | Right | 400-500px | E-commerce shopping cart |

### Expected Outcome
- Sheet component installed and available
- All sheet sub-components accessible
- Slide-in animations working
- Support for all four directions
- Foundation for custom sheet implementations

### Verification Checklist
- [ ] components/ui/sheet.tsx file exists
- [ ] Sheet component exports verified
- [ ] Radix UI Dialog dependencies installed
- [ ] Test sheet implementation works
- [ ] All directions (top/right/bottom/left) functional
- [ ] Overlay backdrop displays correctly
- [ ] Close functionality working (X button and Esc key)

---

## Task 58: Create SidePanel Component

### Overview
Create a custom SidePanel component that wraps the Sheet component with standardized layouts and behaviors specific to the ERP dashboard. This component provides consistent detail view panels for viewing and editing records, displaying supplementary information, and managing contextual actions.

### Dependencies
- Task 57: Install Sheet Component

### Instructions

1. **Create SidePanel component file**
   - Create file at components/common/SidePanel.tsx
   - Import Sheet components from ui/sheet

2. **Define SidePanel props interface**
   - open (boolean): controlled open state
   - onOpenChange (function): state change handler
   - title (string): panel heading
   - description (optional string): subtitle text
   - children (ReactNode): panel content
   - side (optional): 'left' | 'right', default 'right'
   - size (optional): 'sm' | 'md' | 'lg' | 'xl', default 'md'
   - footer (optional ReactNode): action buttons area
   - showClose (optional boolean): show X button, default true

3. **Implement size variants**
   - Small (sm): 400px width
   - Medium (md): 500px width
   - Large (lg): 600px width
   - Extra Large (xl): 800px width
   - Create size-to-className mapping

4. **Build SidePanel component structure**
   - Wrap Sheet component with controlled props
   - Apply SheetContent with size-based width
   - Implement SheetHeader with title and description
   - Render children content in main area
   - Conditionally render footer if provided

5. **Add loading state support**
   - Add isLoading prop (optional boolean)
   - Display skeleton loader when loading
   - Show spinner or shimmer effect

6. **Implement scroll behavior**
   - Enable scroll for content area only
   - Keep header and footer fixed
   - Add scroll shadows for visual feedback

7. **Add keyboard shortcuts**
   - Esc key closes panel
   - Ctrl/Cmd + Enter saves (if applicable)
   - Tab navigation within panel

8. **Create SidePanelSection sub-component**
   - Provides consistent section layout
   - Props: title, optional, collapsible
   - Used for organizing panel content

9. **Export component and types**
   - Export SidePanel as default
   - Export SidePanelProps interface
   - Export SidePanelSection

### SidePanel Component Structure

```
┌────────────────────────────────────────────────┐
│            SidePanel Component                 │
├────────────────────────────────────────────────┤
│ Wraps: Sheet                                   │
│                                                │
│ Props:                                         │
│  • open (boolean)                              │
│  • onOpenChange (function)                     │
│  • title (string)                              │
│  • description (optional string)               │
│  • children (ReactNode)                        │
│  • side ('left' | 'right')                     │
│  • size ('sm' | 'md' | 'lg' | 'xl')            │
│  • footer (optional ReactNode)                 │
│  • showClose (boolean)                         │
│  • isLoading (optional boolean)                │
│                                                │
│ Features:                                      │
│  • Standardized widths                         │
│  • Fixed header/footer with scrollable content │
│  • Loading state support                       │
│  • Section organization                        │
│  • Keyboard shortcuts                          │
└────────────────────────────────────────────────┘
```

### SidePanel Size Specifications

| Size | Width | Use Case | Example |
|------|-------|----------|---------|
| sm | 400px | Quick views | Contact info, notifications |
| md | 500px | Standard details | Product details, order summary |
| lg | 600px | Extended forms | Customer profile, edit forms |
| xl | 800px | Rich content | Dashboard settings, reports |

### SidePanel Layout Structure

```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │ ← Fixed Header
│ │  Title                      [X] │ │
│ │  Description text               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ ← Scrollable Content
│ │                                 │ │
│ │  Section 1: Basic Info          │ │
│ │  ┌───────────────────────────┐  │ │
│ │  │ Field 1                   │  │ │
│ │  │ Field 2                   │  │ │
│ │  └───────────────────────────┘  │ │
│ │                                 │ │
│ │  Section 2: Additional Details  │ │
│ │  ┌───────────────────────────┐  │ │
│ │  │ Field 3                   │  │ │
│ │  │ Field 4                   │  │ │
│ │  └───────────────────────────┘  │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ ← Fixed Footer
│ │        [Cancel]  [Save]         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### SidePanel Usage Scenarios

#### Product Detail View
```
┌─────────────────────────────────────┐
│ Product Details                 [X] │
│ View and edit product information   │
├─────────────────────────────────────┤
│                                     │
│ Basic Information                   │
│ • Product Name: Widget Pro 2000     │
│ • SKU: WDG-2000                     │
│ • Category: Electronics             │
│                                     │
│ Pricing & Inventory                 │
│ • Price: Rs. 15,000.00              │
│ • Stock: 125 units                  │
│ • Status: Active                    │
│                                     │
│ Description                         │
│ • [Full product description...]     │
│                                     │
├─────────────────────────────────────┤
│         [Close]  [Edit]             │
└─────────────────────────────────────┘
```

#### Customer Order Details
```
┌─────────────────────────────────────┐
│ Order #ORD-2026-001234          [X] │
│ Placed on Jan 24, 2026 at 2:30 PM  │
├─────────────────────────────────────┤
│                                     │
│ Customer Information                │
│ • Nimal Perera                      │
│ • +94 77 123 4567                   │
│ • nimal@email.com                   │
│                                     │
│ Order Items (3)                     │
│ • Widget A × 2        Rs. 3,000.00  │
│ • Widget B × 1        Rs. 1,500.00  │
│ • Widget C × 5        Rs. 7,500.00  │
│                                     │
│ Payment Details                     │
│ • Subtotal:          Rs. 12,000.00  │
│ • Tax (15%):          Rs. 1,800.00  │
│ • Total:             Rs. 13,800.00  │
│ • Method: Credit Card               │
│                                     │
├─────────────────────────────────────┤
│  [Print]  [Refund]  [Close]         │
└─────────────────────────────────────┘
```

#### Filter Panel
```
┌─────────────────────────────────────┐
│ Filters                         [X] │
│ Refine search results               │
├─────────────────────────────────────┤
│                                     │
│ Date Range                          │
│ • From: [Jan 1, 2026]               │
│ • To: [Jan 31, 2026]                │
│                                     │
│ Status                              │
│ ☑ Active                            │
│ ☑ Pending                           │
│ ☐ Completed                         │
│ ☐ Cancelled                         │
│                                     │
│ Category                            │
│ • [Select category...]              │
│                                     │
│ Price Range                         │
│ • Min: Rs. [0]                      │
│ • Max: Rs. [100,000]                │
│                                     │
├─────────────────────────────────────┤
│      [Clear All]  [Apply]           │
└─────────────────────────────────────┘
```

### SidePanelSection Component

```
┌────────────────────────────────────────────────┐
│        SidePanelSection Component              │
├────────────────────────────────────────────────┤
│ Props:                                         │
│  • title (string)                              │
│  • children (ReactNode)                        │
│  • collapsible (optional boolean)              │
│  • defaultOpen (optional boolean)              │
│  • icon (optional ReactNode)                   │
│                                                │
│ Features:                                      │
│  • Consistent section styling                 │
│  • Optional collapse functionality             │
│  • Icon support                                │
│  • Proper spacing between sections             │
└────────────────────────────────────────────────┘
```

### Expected Outcome
- Reusable SidePanel component for detail views
- Consistent layout across all panels
- Multiple size options for different use cases
- Section organization for structured content
- Loading state and keyboard shortcut support

### Verification Checklist
- [ ] SidePanel.tsx file created
- [ ] SidePanelProps interface defined
- [ ] All size variants implemented (sm/md/lg/xl)
- [ ] Header with title and description
- [ ] Scrollable content area
- [ ] Optional footer area
- [ ] Loading state displays correctly
- [ ] SidePanelSection sub-component created
- [ ] Keyboard shortcuts functional
- [ ] Component exports properly

---

## Task 59: Install DropdownMenu Component

### Overview
Install the shadcn/ui DropdownMenu component for creating dropdown menu interfaces. This component provides context-sensitive actions, navigation options, and hierarchical menu structures with support for sub-menus, keyboard navigation, and rich content.

### Dependencies
- Node.js and npm/pnpm installed
- shadcn/ui CLI configured
- Radix UI primitives support

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend/dashboard directory

2. **Install DropdownMenu using CLI**
   - Run shadcn/ui CLI command
   - Component added to components/ui/dropdown-menu.tsx
   - Includes Radix UI DropdownMenu primitive

3. **Verify component installation**
   - Check dropdown-menu.tsx in components/ui/
   - Review all exported components
   - Confirm dependencies installed

4. **Review component structure**
   - DropdownMenu (root wrapper)
   - DropdownMenuTrigger (button to open)
   - DropdownMenuContent (menu container)
   - DropdownMenuItem (individual menu item)
   - DropdownMenuCheckboxItem (checkbox option)
   - DropdownMenuRadioGroup/RadioItem (radio options)
   - DropdownMenuLabel (section label)
   - DropdownMenuSeparator (divider)
   - DropdownMenuShortcut (keyboard hint)
   - DropdownMenuSub (nested sub-menu)

5. **Understand menu positioning**
   - Default: below trigger, aligned to start
   - Supports: top, bottom, left, right
   - Auto-adjusts for viewport boundaries
   - Side and align props for fine control

6. **Test basic dropdown**
   - Create test menu with items
   - Verify open/close behavior
   - Test keyboard navigation (arrows, enter, esc)
   - Confirm item selection

7. **Test sub-menu functionality**
   - Create nested menu structure
   - Verify sub-menu opens on hover
   - Test keyboard navigation in sub-menus

### DropdownMenu Component Architecture

```
┌────────────────────────────────────────────────┐
│          DropdownMenu Component                │
├────────────────────────────────────────────────┤
│ Primitive: Radix UI DropdownMenu              │
│                                                │
│ Components:                                    │
│  • DropdownMenu (root)                         │
│  • DropdownMenuTrigger (button)                │
│  • DropdownMenuContent (container)             │
│  • DropdownMenuItem (action item)              │
│  • DropdownMenuCheckboxItem (checkbox)         │
│  • DropdownMenuRadioGroup/RadioItem (radio)    │
│  • DropdownMenuLabel (heading)                 │
│  • DropdownMenuSeparator (divider)             │
│  • DropdownMenuShortcut (keyboard hint)        │
│  • DropdownMenuSub (nested menu)               │
│  • DropdownMenuSubTrigger (sub-menu trigger)   │
│  • DropdownMenuSubContent (sub-menu items)     │
│                                                │
│ Features:                                      │
│  • Keyboard navigation (arrows, enter, esc)    │
│  • Auto-positioning with collision detection   │
│  • Sub-menu support                            │
│  • Checkbox and radio items                    │
│  • Icon and shortcut display                   │
│  • Focus management                            │
└────────────────────────────────────────────────┘
```

### DropdownMenu Structure Examples

#### Basic Action Menu
```
┌──────────────────────────────┐
│ ▼ Actions                    │
└──────────────────────────────┘
        ↓
  ┌─────────────────────────┐
  │ 📝 Edit           Ctrl+E │
  │ 📋 Duplicate      Ctrl+D │
  ├─────────────────────────┤
  │ 🗑️  Delete         Del   │
  └─────────────────────────┘
```

#### Menu with Sub-menus
```
┌──────────────────────────────┐
│ ⋮ More Options               │
└──────────────────────────────┘
        ↓
  ┌─────────────────────────┐
  │ Export              ▶   │ → ┌──────────────────┐
  │ Share               ▶   │   │ 📄 PDF           │
  ├─────────────────────────┤   │ 📊 Excel         │
  │ Settings                │   │ 📨 Email         │
  │ Help                    │   └──────────────────┘
  └─────────────────────────┘
```

#### Menu with Checkboxes
```
┌──────────────────────────────┐
│ 👁️  View Options              │
└──────────────────────────────┘
        ↓
  ┌─────────────────────────┐
  │ View                    │
  ├─────────────────────────┤
  │ ☑ Show Sidebar          │
  │ ☑ Show Toolbar          │
  │ ☐ Show Footer           │
  │ ☐ Compact Mode          │
  └─────────────────────────┘
```

#### Menu with Radio Groups
```
┌──────────────────────────────┐
│ ⚙️  Settings                  │
└──────────────────────────────┘
        ↓
  ┌─────────────────────────┐
  │ Theme                   │
  ├─────────────────────────┤
  │ ◉ Light                 │
  │ ○ Dark                  │
  │ ○ Auto                  │
  ├─────────────────────────┤
  │ Language                │
  ├─────────────────────────┤
  │ ◉ English               │
  │ ○ සිංහල                │
  │ ○ தமிழ்                 │
  └─────────────────────────┘
```

### DropdownMenu Use Cases

| Use Case | Menu Type | Example Content |
|----------|-----------|-----------------|
| Row Actions | Basic items | Edit, Delete, Duplicate, View Details |
| Bulk Actions | Items + separator | Select All, Deselect, Export, Delete Selected |
| View Options | Checkboxes | Show columns, filters, compact mode |
| Sort Options | Radio group | Sort by name, date, price (asc/desc) |
| Export Menu | Sub-menu | Export as PDF, Excel, CSV, JSON |
| User Menu | Mixed | Profile, Settings, Logout |

### Menu Positioning Strategy

```
Trigger Position → Menu Placement

┌─────────────────────────────────────────┐
│                                         │
│  [Trigger]                              │
│      ↓                                  │
│  ┌──────────┐                           │
│  │ Menu     │  ← Default: below, left   │
│  └──────────┘                           │
│                                         │
│                    ┌──────────┐         │
│                    │ Menu     │         │
│                    └──────────┘         │
│                        ↑                │
│                   [Trigger]             │
│                                         │
└─────────────────────────────────────────┘

Auto-adjust for viewport edges
```

### Expected Outcome
- DropdownMenu component installed and functional
- All menu sub-components available
- Support for items, checkboxes, radio groups
- Sub-menu functionality working
- Keyboard navigation operational

### Verification Checklist
- [ ] components/ui/dropdown-menu.tsx exists
- [ ] All menu components exported
- [ ] Radix UI dependencies installed
- [ ] Basic menu renders correctly
- [ ] Menu items clickable
- [ ] Keyboard navigation works (arrows, enter, esc)
- [ ] Sub-menus open and navigate properly
- [ ] Checkboxes and radio items functional
- [ ] Shortcuts display correctly

---

## Task 60: Install ContextMenu Component

### Overview
Install the shadcn/ui ContextMenu component for right-click context menu functionality. Context menus provide quick access to contextual actions when users right-click on elements, offering a familiar desktop-like interaction pattern.

### Dependencies
- Node.js and npm/pnpm installed
- shadcn/ui CLI configured
- DropdownMenu component (shares similar structure)

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend/dashboard directory

2. **Install ContextMenu using CLI**
   - Run shadcn/ui CLI command
   - Component added to components/ui/context-menu.tsx
   - Includes Radix UI ContextMenu primitive

3. **Verify component installation**
   - Check context-menu.tsx in components/ui/
   - Review exported components
   - Confirm dependencies installed

4. **Review component structure**
   - ContextMenu (root wrapper)
   - ContextMenuTrigger (element to right-click)
   - ContextMenuContent (menu container)
   - ContextMenuItem (individual item)
   - ContextMenuCheckboxItem (checkbox option)
   - ContextMenuRadioGroup/RadioItem (radio options)
   - ContextMenuLabel (section label)
   - ContextMenuSeparator (divider)
   - ContextMenuShortcut (keyboard hint)
   - ContextMenuSub (nested sub-menu)

5. **Understand context menu behavior**
   - Opens on right-click (contextmenu event)
   - Positioned at cursor location
   - Auto-adjusts for viewport boundaries
   - Closes on click outside or item selection

6. **Test basic context menu**
   - Wrap target element with ContextMenuTrigger
   - Right-click to open menu
   - Verify menu appears at cursor
   - Test item selection

7. **Test keyboard interaction**
   - Right-click to open
   - Navigate with arrow keys
   - Select with Enter
   - Close with Esc

### ContextMenu Component Architecture

```
┌────────────────────────────────────────────────┐
│          ContextMenu Component                 │
├────────────────────────────────────────────────┤
│ Primitive: Radix UI ContextMenu               │
│                                                │
│ Components:                                    │
│  • ContextMenu (root)                          │
│  • ContextMenuTrigger (target element)         │
│  • ContextMenuContent (menu container)         │
│  • ContextMenuItem (action item)               │
│  • ContextMenuCheckboxItem (checkbox)          │
│  • ContextMenuRadioGroup/RadioItem (radio)     │
│  • ContextMenuLabel (heading)                  │
│  • ContextMenuSeparator (divider)              │
│  • ContextMenuShortcut (keyboard hint)         │
│  • ContextMenuSub (nested menu)                │
│                                                │
│ Features:                                      │
│  • Right-click activation                      │
│  • Cursor-based positioning                    │
│  • Keyboard navigation                         │
│  • Sub-menu support                            │
│  • Checkbox and radio items                    │
│  • Automatic collision detection               │
└────────────────────────────────────────────────┘
```

### ContextMenu Usage Examples

#### Table Row Context Menu
```
┌──────────────────────────────────────────────┐
│ ID   │ Name        │ Status   │ Actions     │
├──────────────────────────────────────────────┤
│ 001  │ John Doe    │ Active   │ ⋮           │
│ 002  │ Jane Smith  │ Active   │ ⋮           │ ← Right-click
│ 003  │ Bob Johnson │ Inactive │ ⋮           │
└──────────────────────────────────────────────┘
              ↓
        ┌─────────────────────┐
        │ 👁️  View Details     │
        │ ✏️  Edit             │
        │ 📧 Send Email       │
        ├─────────────────────┤
        │ 🗑️  Delete           │
        └─────────────────────┘
```

#### File/Folder Context Menu
```
┌─────────────────────────────────┐
│ 📁 Documents                    │
│    📄 Report.pdf                │ ← Right-click
│    📄 Invoice.xlsx              │
│    📁 Archives                  │
└─────────────────────────────────┘
         ↓
   ┌──────────────────────────┐
   │ Open                     │
   │ Open in New Window       │
   ├──────────────────────────┤
   │ Rename               F2  │
   │ Copy              Ctrl+C │
   │ Cut               Ctrl+X │
   ├──────────────────────────┤
   │ Download                 │
   │ Share               ▶    │
   ├──────────────────────────┤
   │ Delete             Del   │
   └──────────────────────────┘
```

#### Card Context Menu
```
┌────────────────────────────┐
│  Product Widget Pro        │
│                            │ ← Right-click card
│  Rs. 15,000.00             │
│  Stock: 125                │
└────────────────────────────┘
         ↓
   ┌──────────────────────┐
   │ Quick Actions        │
   ├──────────────────────┤
   │ ➕ Add to Cart       │
   │ ⭐ Add to Wishlist   │
   │ 📊 View Analytics    │
   ├──────────────────────┤
   │ ✏️  Edit Product      │
   │ 🔄 Duplicate         │
   ├──────────────────────┤
   │ 🗑️  Delete            │
   └──────────────────────┘
```

#### Canvas/Drawing Area Context Menu
```
┌─────────────────────────────────────┐
│                                     │
│       [Selected Object]             │ ← Right-click
│                                     │
│                                     │
└─────────────────────────────────────┘
              ↓
        ┌──────────────────────┐
        │ Cut           Ctrl+X │
        │ Copy          Ctrl+C │
        │ Paste         Ctrl+V │
        ├──────────────────────┤
        │ Duplicate     Ctrl+D │
        │ Delete          Del  │
        ├──────────────────────┤
        │ Bring to Front       │
        │ Send to Back         │
        ├──────────────────────┤
        │ Properties           │
        └──────────────────────┘
```

### ContextMenu vs DropdownMenu

| Aspect | ContextMenu | DropdownMenu |
|--------|-------------|--------------|
| Trigger | Right-click | Button click |
| Position | At cursor | Below trigger |
| Use Case | Contextual actions | Explicit menu |
| Discoverability | Low (hidden) | High (visible button) |
| Desktop Pattern | Common | Less common |
| Mobile Support | Limited | Full |

### ContextMenu Design Guidelines

#### When to Use
- Table row actions (supplement visible buttons)
- File/folder management interfaces
- Canvas/drawing applications
- Text editor actions
- Image/media viewers
- Dashboard widgets

#### When NOT to Use
- Primary actions (should be visible)
- Mobile-first applications (limited support)
- Actions requiring high discoverability
- Single obvious action (use button instead)

### Context Menu Positioning

```
Right-click event occurs here
              ↓
             [●] ← Cursor position
              ↓
        ┌──────────┐
        │ Menu     │  ← Menu appears at cursor
        └──────────┘

If too close to edge, menu auto-adjusts:
                              
                    [●] ← Cursor near right edge
                     ↓
              ┌──────────┐
              │ Menu     │  ← Menu opens to left
              └──────────┘
```

### Expected Outcome
- ContextMenu component installed and functional
- Right-click opens menu at cursor position
- Menu items perform actions correctly
- Keyboard navigation works
- Auto-positioning prevents overflow

### Verification Checklist
- [ ] components/ui/context-menu.tsx exists
- [ ] All context menu components exported
- [ ] Radix UI dependencies installed
- [ ] Right-click opens menu
- [ ] Menu appears at cursor position
- [ ] Menu closes on click outside
- [ ] Menu closes on item selection
- [ ] Keyboard navigation functional
- [ ] Sub-menus work correctly
- [ ] Menu adjusts position near viewport edges

---

## Task 61: Install Popover Component

### Overview
Install the shadcn/ui Popover component for displaying floating content anchored to trigger elements. Popovers are used for displaying supplementary information, form inputs, color pickers, date pickers, and other rich content that appears on demand.

### Dependencies
- Node.js and npm/pnpm installed
- shadcn/ui CLI configured
- Radix UI primitives support

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend/dashboard directory

2. **Install Popover using CLI**
   - Run shadcn/ui CLI command
   - Component added to components/ui/popover.tsx
   - Includes Radix UI Popover primitive

3. **Verify component installation**
   - Check popover.tsx in components/ui/
   - Review exported components
   - Confirm dependencies installed

4. **Review component structure**
   - Popover (root wrapper)
   - PopoverTrigger (button to open)
   - PopoverContent (floating content container)
   - PopoverAnchor (optional anchor element)
   - PopoverArrow (optional pointing arrow)

5. **Understand popover positioning**
   - Default: below trigger, centered
   - Supports: top, bottom, left, right
   - Side and align props for fine control
   - Auto-adjusts for viewport boundaries
   - Collision detection with sideOffset, alignOffset

6. **Test basic popover**
   - Create test popover with trigger
   - Verify content appears on click
   - Test positioning variations
   - Confirm close behavior (click outside, Esc)

7. **Test controlled popover**
   - Implement controlled open state
   - Test programmatic open/close
   - Verify onOpenChange callback

### Popover Component Architecture

```
┌────────────────────────────────────────────────┐
│            Popover Component                   │
├────────────────────────────────────────────────┤
│ Primitive: Radix UI Popover                   │
│                                                │
│ Components:                                    │
│  • Popover (root)                              │
│  • PopoverTrigger (button/element to click)    │
│  • PopoverContent (floating container)         │
│  • PopoverAnchor (optional anchor)             │
│  • PopoverArrow (optional arrow)               │
│                                                │
│ Props:                                         │
│  • open (boolean): controlled open state       │
│  • onOpenChange (function): state handler      │
│  • modal (boolean): modal behavior             │
│  • side ('top'|'bottom'|'left'|'right')        │
│  • align ('start'|'center'|'end')              │
│  • sideOffset (number): distance from trigger  │
│  • alignOffset (number): alignment adjustment  │
│                                                │
│ Features:                                      │
│  • Click or hover trigger                      │
│  • Flexible positioning                        │
│  • Auto collision detection                    │
│  • Focus management                            │
│  • Rich content support                        │
└────────────────────────────────────────────────┘
```

### Popover Positioning Examples

```
Top Side:
   ┌──────────────────┐
   │ Popover Content  │
   └────────┬─────────┘
            │
      [Trigger Button]


Bottom Side (Default):
      [Trigger Button]
            │
   ┌────────┴─────────┐
   │ Popover Content  │
   └──────────────────┘


Left Side:
   ┌──────────────────┐
   │ Popover Content  │──── [Trigger Button]
   └──────────────────┘


Right Side:
   [Trigger Button] ────┌──────────────────┐
                        │ Popover Content  │
                        └──────────────────┘
```

### Popover Use Cases

| Use Case | Content | Trigger | Example |
|----------|---------|---------|---------|
| Info Display | Text, icons | Help icon (i) | Field descriptions, hints |
| Form Input | Input fields | Button/field | Quick edit, inline forms |
| Color Picker | Color swatches | Color preview | Theme customization |
| Date Picker | Calendar | Date input | Date selection |
| User Profile | Avatar, name, stats | User avatar | Quick profile view |
| Filter Options | Checkboxes, inputs | Filter button | Advanced filters |
| Settings Panel | Form controls | Settings icon | Quick settings |

### Popover Content Examples

#### Info Popover
```
        [ℹ️] ← Trigger
          ↓
   ┌────────────────────────────┐
   │ What is this?              │
   │                            │
   │ This field is used to      │
   │ specify the customer's     │
   │ preferred contact method.  │
   │                            │
   │ [Learn More]               │
   └────────────────────────────┘
```

#### Quick Edit Popover
```
   [✏️ Quick Edit] ← Trigger
          ↓
   ┌────────────────────────────┐
   │ Edit Product Price         │
   │                            │
   │ Price: [₨15,000.00]        │
   │ Discount: [10]%            │
   │                            │
   │     [Cancel]  [Save]       │
   └────────────────────────────┘
```

#### User Profile Popover
```
   [👤 Avatar] ← Trigger
       ↓
   ┌────────────────────────────┐
   │    [Avatar Image]          │
   │                            │
   │    Nimal Perera            │
   │    nimal@company.lk        │
   │                            │
   │    Sales Manager           │
   │    Colombo Branch          │
   │                            │
   │ [View Profile]  [Message]  │
   └────────────────────────────┘
```

#### Filter Popover
```
   [🔍 Filters (2)] ← Trigger
          ↓
   ┌────────────────────────────┐
   │ Filter Options             │
   │                            │
   │ Status                     │
   │ ☑ Active                   │
   │ ☑ Pending                  │
   │ ☐ Completed                │
   │                            │
   │ Date Range                 │
   │ From: [Jan 1, 2026]        │
   │ To: [Jan 31, 2026]         │
   │                            │
   │   [Clear]  [Apply]         │
   └────────────────────────────┘
```

#### Color Picker Popover
```
   [⬛] ← Color preview trigger
     ↓
   ┌──────────────────────┐
   │ Color Picker         │
   │                      │
   │ [Color Grid]         │
   │ ■ ■ ■ ■ ■ ■ ■ ■     │
   │ ■ ■ ■ ■ ■ ■ ■ ■     │
   │ ■ ■ ■ ■ ■ ■ ■ ■     │
   │                      │
   │ Hex: [#3B82F6]       │
   │                      │
   │ [Cancel]  [Select]   │
   └──────────────────────┘
```

### Popover vs Tooltip vs Dialog

| Feature | Popover | Tooltip | Dialog |
|---------|---------|---------|--------|
| Content | Rich (forms, buttons) | Simple text | Complex (full pages) |
| Interaction | Clickable | Hover only | Modal |
| Size | Medium | Small | Large |
| Close Method | Click outside, Esc | Mouse leave | Explicit action |
| Use Case | Interactive content | Info hints | Important actions |

### Popover Design Guidelines

#### Content Guidelines
- Keep content focused and concise
- Use clear headings for context
- Include relevant actions (Save, Cancel)
- Limit width to 300-400px typically
- Use padding for comfortable spacing

#### Interaction Guidelines
- Close on click outside (default)
- Close on Esc key press
- Don't nest popovers (use Dialog instead)
- Provide clear trigger indication
- Support keyboard navigation within content

### Expected Outcome
- Popover component installed and functional
- Content appears anchored to trigger
- All positioning options available
- Click outside and Esc key close popover
- Support for rich interactive content

### Verification Checklist
- [ ] components/ui/popover.tsx exists
- [ ] Popover components exported
- [ ] Radix UI dependencies installed
- [ ] Popover opens on trigger click
- [ ] Content displays correctly
- [ ] Positioning works (top/bottom/left/right)
- [ ] Closes on click outside
- [ ] Closes on Esc key
- [ ] Controlled state works
- [ ] Auto-positioning near edges works

---

## Task 62: Install Tooltip Component

### Overview
Install the shadcn/ui Tooltip component for displaying hover hints and supplementary information. Tooltips provide brief, contextual help text when users hover over or focus on UI elements, enhancing usability without cluttering the interface.

### Dependencies
- Node.js and npm/pnpm installed
- shadcn/ui CLI configured
- Radix UI primitives support

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend/dashboard directory

2. **Install Tooltip using CLI**
   - Run shadcn/ui CLI command
   - Component added to components/ui/tooltip.tsx
   - Includes Radix UI Tooltip primitive

3. **Verify component installation**
   - Check tooltip.tsx in components/ui/
   - Review exported components
   - Confirm dependencies installed

4. **Review component structure**
   - TooltipProvider (required wrapper)
   - Tooltip (root wrapper for individual tooltip)
   - TooltipTrigger (element that shows tooltip)
   - TooltipContent (tooltip text container)
   - TooltipArrow (optional pointing arrow)

5. **Understand tooltip behavior**
   - Appears on hover (mouse over)
   - Appears on focus (keyboard navigation)
   - Disappears on mouse leave
   - Disappears on focus leave
   - Delay before showing (default: ~700ms)
   - Delay before hiding (default: ~0ms)

6. **Review tooltip positioning**
   - Default: top, centered
   - Supports: top, bottom, left, right
   - Auto-adjusts for viewport boundaries

7. **Test basic tooltip**
   - Wrap trigger element with Tooltip
   - Add TooltipContent with text
   - Hover to verify appearance
   - Test keyboard focus (Tab key)

8. **Test TooltipProvider configuration**
   - Wrap app/section with TooltipProvider
   - Configure global delay timings
   - Test skipDelayDuration for quick successive hovers

### Tooltip Component Architecture

```
┌────────────────────────────────────────────────┐
│            Tooltip Component                   │
├────────────────────────────────────────────────┤
│ Primitive: Radix UI Tooltip                   │
│                                                │
│ Components:                                    │
│  • TooltipProvider (global wrapper)            │
│  • Tooltip (root wrapper)                      │
│  • TooltipTrigger (hover target)               │
│  • TooltipContent (text container)             │
│  • TooltipArrow (optional arrow)               │
│                                                │
│ TooltipProvider Props:                         │
│  • delayDuration (number): ms before show      │
│  • skipDelayDuration (number): quick hover ms  │
│  • disableHoverableContent (boolean)           │
│                                                │
│ TooltipContent Props:                          │
│  • side ('top'|'bottom'|'left'|'right')        │
│  • align ('start'|'center'|'end')              │
│  • sideOffset (number): distance from trigger  │
│                                                │
│ Features:                                      │
│  • Hover and focus activation                  │
│  • Configurable delays                         │
│  • Auto-positioning                            │
│  • Keyboard accessible                         │
│  • Brief, helpful text only                    │
└────────────────────────────────────────────────┘
```

### Tooltip Positioning Examples

```
Top (Default):
   ┌──────────────┐
   │  Tooltip     │
   └──────┬───────┘
          ↓
     [⚙️ Button]


Bottom:
     [⚙️ Button]
          ↓
   ┌──────┴───────┐
   │  Tooltip     │
   └──────────────┘


Left:
   ┌──────────────┐
   │  Tooltip     │──── [⚙️ Button]
   └──────────────┘


Right:
   [⚙️ Button] ────┌──────────────┐
                   │  Tooltip     │
                   └──────────────┘
```

### Tooltip Use Cases

| Use Case | Trigger Element | Tooltip Content | Example |
|----------|----------------|-----------------|---------|
| Icon Buttons | Icon-only button | Action description | "Save changes" on save icon |
| Abbreviated Text | Truncated text | Full text | Full product name on ellipsis |
| Status Indicators | Status badge | Status meaning | "Pending approval" on yellow dot |
| Disabled Elements | Disabled button | Reason for disable | "Save 3 changes first" |
| Help Hints | Help icon (i) | Brief explanation | "Include VAT in price" |
| Keyboard Shortcuts | Any UI element | Shortcut keys | "Ctrl+S" on save button |
| Data Values | Metric/stat | Additional context | "2.5% increase from last month" |

### Tooltip Content Examples

#### Icon Button Tooltips
```
[💾] → "Save changes (Ctrl+S)"
[✏️] → "Edit product"
[🗑️] → "Delete item"
[↻] → "Refresh data"
[⚙️] → "Open settings"
[👁️] → "View details"
[📄] → "Print receipt"
[📧] → "Send email"
```

#### Status Indicator Tooltips
```
[🟢] → "Active - Processing orders normally"
[🟡] → "Pending - Awaiting manager approval"
[🔴] → "Inactive - Temporarily disabled"
[🔵] → "In Progress - 3 of 5 steps completed"
```

#### Truncated Text Tooltips
```
Display: "Very Long Product Name That..."
Tooltip: "Very Long Product Name That Gets Cut Off Due To Space Constraints"

Display: "John D."
Tooltip: "John Doe - Sales Manager"
```

#### Disabled Element Tooltips
```
[Save] (disabled) → "Please fix 3 errors before saving"
[Submit] (disabled) → "Fill all required fields"
[Export] (disabled) → "Select at least one item to export"
```

#### Keyboard Shortcut Tooltips
```
[Save] → "Save (Ctrl+S)"
[Undo] → "Undo (Ctrl+Z)"
[Copy] → "Copy (Ctrl+C)"
[Find] → "Find (Ctrl+F)"
[New] → "New Document (Ctrl+N)"
```

### Tooltip Best Practices

#### Content Guidelines
- **Keep it brief**: 1-10 words ideal, max 2 lines
- **Be specific**: "Save changes" not "Save"
- **No interactive content**: Text only, no buttons/links
- **Use sentence case**: "Save changes" not "SAVE CHANGES"
- **Include shortcuts**: Show keyboard shortcuts when applicable

#### When to Use Tooltips
✅ Icon-only buttons (no text label)  
✅ Truncated/abbreviated text  
✅ Status indicators  
✅ Disabled elements (explain why)  
✅ Supplementary info that's not critical  

#### When NOT to Use Tooltips
❌ Critical information (use visible text instead)  
❌ Long explanations (use Popover or help page)  
❌ Interactive content (use Popover or Dialog)  
❌ Mobile-primary interfaces (hover not available)  
❌ Redundant text (tooltip same as visible label)  

### Tooltip Timing Configuration

```
┌────────────────────────────────────────────────┐
│         Tooltip Timing Settings                │
├────────────────────────────────────────────────┤
│                                                │
│ delayDuration (default: 700ms)                 │
│ • Time before tooltip appears                  │
│ • Prevents accidental triggers                 │
│ • Recommended: 400-1000ms                      │
│                                                │
│ skipDelayDuration (default: 300ms)             │
│ • Time window for instant tooltips             │
│ • After one tooltip shown, others show faster  │
│ • Recommended: 200-500ms                       │
│                                                │
│ Usage:                                         │
│ <TooltipProvider                               │
│   delayDuration={500}                          │
│   skipDelayDuration={300}                      │
│ >                                              │
│   <App />                                      │
│ </TooltipProvider>                             │
└────────────────────────────────────────────────┘
```

### Tooltip Accessibility

#### Keyboard Support
- Tooltip appears on focus (Tab navigation)
- Tooltip disappears on blur (Tab away)
- Works with screen readers
- ARIA attributes automatically handled

#### Screen Reader Behavior
- Tooltip content announced on focus
- Associated with trigger element
- Describedby relationship established

### Expected Outcome
- Tooltip component installed and functional
- Tooltips appear on hover and focus
- Brief, helpful text displays correctly
- Auto-positioning works
- Configurable delay timings

### Verification Checklist
- [ ] components/ui/tooltip.tsx exists
- [ ] All tooltip components exported
- [ ] Radix UI dependencies installed
- [ ] TooltipProvider wraps application
- [ ] Tooltips appear on hover
- [ ] Tooltips appear on keyboard focus
- [ ] Tooltips disappear on mouse leave
- [ ] Positioning works (top/bottom/left/right)
- [ ] Delay timing is appropriate
- [ ] Tooltips auto-adjust near viewport edges
- [ ] Screen reader compatibility confirmed

---

## Task 63: Install Command Component

### Overview
Install the shadcn/ui Command component, which provides a command menu interface powered by cmdk (Command Menu Development Kit). This component enables the creation of searchable command palettes with keyboard-first navigation, perfect for quick actions, search, and navigation.

### Dependencies
- Node.js and npm/pnpm installed
- shadcn/ui CLI configured
- cmdk library (installed automatically)
- Dialog component (for modal command palette)

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend/dashboard directory

2. **Install Command component using CLI**
   - Run shadcn/ui CLI command
   - Component added to components/ui/command.tsx
   - Installs cmdk library dependency

3. **Verify component installation**
   - Check command.tsx in components/ui/
   - Review all exported components
   - Confirm cmdk package in dependencies

4. **Review component structure**
   - Command (root wrapper)
   - CommandInput (search input field)
   - CommandList (scrollable results container)
   - CommandEmpty (empty state message)
   - CommandGroup (grouped items section)
   - CommandItem (individual command item)
   - CommandSeparator (divider between groups)
   - CommandShortcut (keyboard shortcut display)

5. **Understand command filtering**
   - Built-in fuzzy search
   - Auto-filters items as user types
   - Customizable filter function
   - Score-based ranking

6. **Review keyboard navigation**
   - Arrow Up/Down: navigate items
   - Enter: select item
   - Esc: close (when in dialog)
   - Type to search: immediate filtering

7. **Test basic command menu**
   - Create test command with input and items
   - Type in search input
   - Verify filtering works
   - Test keyboard navigation
   - Test item selection

### Command Component Architecture

```
┌────────────────────────────────────────────────┐
│            Command Component                   │
├────────────────────────────────────────────────┤
│ Library: cmdk                                  │
│                                                │
│ Components:                                    │
│  • Command (root wrapper)                      │
│  • CommandInput (search field)                 │
│  • CommandList (results container)             │
│  • CommandEmpty (no results message)           │
│  • CommandGroup (item group with label)        │
│  • CommandItem (individual command)            │
│  • CommandSeparator (divider)                  │
│  • CommandShortcut (shortcut badge)            │
│                                                │
│ Features:                                      │
│  • Built-in fuzzy search                       │
│  • Keyboard-first navigation                   │
│  • Automatic filtering                         │
│  • Group organization                          │
│  • Shortcut display                            │
│  • Custom scoring/ranking                      │
│  • Loading states                              │
│  • Empty states                                │
└────────────────────────────────────────────────┘
```

### Command Component Structure

```
┌────────────────────────────────────┐
│ [🔍 Search commands...]            │ ← CommandInput
├────────────────────────────────────┤
│                                    │
│ Navigation                         │ ← CommandGroup
│  📊 Dashboard                      │ ← CommandItem
│  📦 Products                       │
│  👥 Customers                      │
│                                    │
│ Actions                            │ ← CommandGroup
│  ➕ New Product           Ctrl+N  │ ← CommandItem + CommandShortcut
│  💾 Save Changes          Ctrl+S  │
│                                    │
│ Settings                           │ ← CommandGroup
│  ⚙️  Preferences                   │
│  👤 Profile                        │
│                                    │
└────────────────────────────────────┘
```

### Command Filtering Examples

#### Initial State (Empty Search)
```
┌────────────────────────────────────┐
│ [🔍 Type a command or search...]   │
├────────────────────────────────────┤
│ Suggestions                        │
│  📊 View Dashboard                 │
│  📦 Browse Products                │
│  👥 Manage Customers               │
│  📝 Create Invoice                 │
│  ⚙️  Open Settings                 │
└────────────────────────────────────┘
```

#### Filtered Results (User types "prod")
```
┌────────────────────────────────────┐
│ [🔍 prod_]                         │
├────────────────────────────────────┤
│ Navigation                         │
│  📦 Products                       │ ← Matches "prod"
│                                    │
│ Actions                            │
│  ➕ New Product                    │ ← Matches "prod"
│  ✏️  Edit Product                  │ ← Matches "prod"
│                                    │
│ Reports                            │
│  📊 Product Sales Report           │ ← Matches "product"
│  📈 Product Performance            │ ← Matches "product"
└────────────────────────────────────┘
```

#### No Results State
```
┌────────────────────────────────────┐
│ [🔍 xyzabc_]                       │
├────────────────────────────────────┤
│                                    │
│         No results found           │ ← CommandEmpty
│                                    │
└────────────────────────────────────┘
```

### Command Item Types

| Type | Icon | Label | Shortcut | Action |
|------|------|-------|----------|--------|
| Navigation | 📊 | "Dashboard" | - | Navigate to route |
| Action | ➕ | "New Product" | Ctrl+N | Trigger action |
| Search Result | 📦 | "Widget Pro 2000" | - | View details |
| Setting | ⚙️ | "Preferences" | Ctrl+, | Open settings |
| Help | ❓ | "Documentation" | F1 | Open help |

### Command Groups Organization

```
┌────────────────────────────────────────────────┐
│         Command Group Structure                │
├────────────────────────────────────────────────┤
│                                                │
│ Group 1: Pages/Navigation                      │
│  • Dashboard                                   │
│  • Products                                    │
│  • Customers                                   │
│  • Orders                                      │
│                                                │
│ Group 2: Quick Actions                         │
│  • New Product                                 │
│  • New Customer                                │
│  • New Order                                   │
│                                                │
│ Group 3: Recent                                │
│  • Last viewed items                           │
│  • Recent documents                            │
│                                                │
│ Group 4: Settings                              │
│  • Preferences                                 │
│  • Profile                                     │
│  • Logout                                      │
└────────────────────────────────────────────────┘
```

### Expected Outcome
- Command component installed and functional
- Search/filter functionality works
- Keyboard navigation operational
- Groups and items render correctly
- Foundation for CommandPalette

### Verification Checklist
- [ ] components/ui/command.tsx exists
- [ ] All command components exported
- [ ] cmdk package in dependencies
- [ ] CommandInput accepts text input
- [ ] Filtering works as user types
- [ ] CommandEmpty shows when no results
- [ ] Keyboard navigation works (arrows, enter)
- [ ] CommandGroup labels display
- [ ] CommandItem selection works
- [ ] CommandShortcut displays correctly

---

## Task 64: Create CommandPalette Component

### Overview
Create a comprehensive CommandPalette component that combines the Command component with Dialog to provide a global, keyboard-accessible command interface. This palette enables users to quickly navigate the application, execute actions, and search content using Cmd+K (Mac) or Ctrl+K (Windows/Linux) shortcut.

### Dependencies
- Task 63: Install Command Component
- Dialog component installed
- React hooks (useState, useEffect)
- Next.js Router (for navigation)

### Instructions

1. **Create CommandPalette component file**
   - Create file at components/common/CommandPalette.tsx
   - Import Command components from ui/command
   - Import Dialog components for modal

2. **Set up keyboard shortcut listener**
   - Use useEffect to add keyboard event listener
   - Detect Cmd+K (Mac) or Ctrl+K (Windows/Linux)
   - Prevent default browser behavior
   - Toggle palette open state

3. **Implement search state management**
   - Create search query state
   - Debounce search input (optional)
   - Filter items based on query
   - Track selected item index

4. **Define command categories**
   - Navigation commands (pages/routes)
   - Action commands (create, edit, delete)
   - Search results (products, customers, orders)
   - Recent items (history)
   - Settings and preferences
   - Help and documentation

5. **Implement navigation commands**
   - Define list of main routes
   - Include icons and labels
   - Handle navigation on select
   - Close palette after navigation

6. **Implement action commands**
   - Define quick action commands
   - Include keyboard shortcuts
   - Trigger actions on select
   - Examples: New Product, Export Data, Print

7. **Add recent items tracking**
   - Store recently accessed items in state/storage
   - Display in "Recent" group
   - Limit to 5-10 most recent
   - Clear with option

8. **Implement search filtering**
   - Filter across multiple categories
   - Fuzzy match algorithm (built-in cmdk)
   - Show relevant groups only
   - Hide empty groups

9. **Add loading states**
   - Show loading for async searches
   - Skeleton items while loading
   - Handle search API calls (future)

10. **Style and animations**
    - Smooth dialog open/close animation
    - Highlight selected item
    - Keyboard shortcut badges
    - Empty state message

11. **Add command execution**
    - Execute action on item select
    - Close palette after execution
    - Handle errors gracefully
    - Show success feedback (toast)

12. **Export and integrate**
    - Export CommandPalette component
    - Add to root layout/app
    - Test keyboard shortcut globally

### CommandPalette Component Structure

```
┌────────────────────────────────────────────────┐
│         CommandPalette Component               │
├────────────────────────────────────────────────┤
│ Wraps: Dialog + Command                        │
│                                                │
│ State:                                         │
│  • open (boolean)                              │
│  • search (string)                             │
│  • recentItems (array)                         │
│                                                │
│ Features:                                      │
│  • Keyboard shortcut (Cmd/Ctrl+K)              │
│  • Search filtering across categories          │
│  • Grouped commands                            │
│  • Recent items history                        │
│  • Navigation shortcuts                        │
│  • Quick actions                               │
│  • Loading states                              │
│  • Empty states                                │
│                                                │
│ Command Groups:                                │
│  1. Recent (history)                           │
│  2. Pages (navigation)                         │
│  3. Actions (quick actions)                    │
│  4. Search Results (dynamic)                   │
│  5. Settings                                   │
│  6. Help                                       │
└────────────────────────────────────────────────┘
```

### CommandPalette Layout

```
┌──────────────────────────────────────────────┐
│  ╔════════════════════════════════════════╗  │
│  ║  Command Palette              [Esc]    ║  │
│  ╠════════════════════════════════════════╣  │
│  ║                                        ║  │
│  ║  [🔍 Type a command or search...]      ║  │ ← Input
│  ║                                        ║  │
│  ║  Recent                                ║  │ ← Group
│  ║   📦 Product: Widget Pro 2000          ║  │ ← Item
│  ║   👤 Customer: Nimal Perera            ║  │
│  ║   📄 Invoice #INV-2026-001             ║  │
│  ║                                        ║  │
│  ║  Pages                                 ║  │ ← Group
│  ║   📊 Dashboard                         ║  │
│  ║   📦 Products                          ║  │
│  ║   👥 Customers                         ║  │
│  ║   🛒 Orders                            ║  │
│  ║                                        ║  │
│  ║  Actions                               ║  │ ← Group
│  ║   ➕ New Product                Ctrl+N ║  │ ← With shortcut
│  ║   📄 New Invoice                Ctrl+I ║  │
│  ║   💾 Save Changes               Ctrl+S ║  │
│  ║                                        ║  │
│  ║  Settings                              ║  │ ← Group
│  ║   ⚙️  Preferences               Ctrl+, ║  │
│  ║   👤 Profile                           ║  │
│  ║   🚪 Logout                            ║  │
│  ║                                        ║  │
│  ╚════════════════════════════════════════╝  │
└──────────────────────────────────────────────┘
```

### Command Categories and Items

#### 1. Recent Items Group
```javascript
Recent (max 10 items)
├─ Product: Widget Pro 2000
├─ Customer: John Doe
├─ Order: #ORD-2026-001
├─ Invoice: #INV-2026-045
└─ Report: Monthly Sales
```

#### 2. Pages/Navigation Group
```javascript
Pages
├─ 📊 Dashboard                 (/)
├─ 📦 Products                  (/products)
├─ 👥 Customers                 (/customers)
├─ 🛒 Orders                    (/orders)
├─ 📄 Invoices                  (/invoices)
├─ 📊 Reports                   (/reports)
├─ ⚙️  Settings                 (/settings)
└─ 💰 Accounting                (/accounting)
```

#### 3. Quick Actions Group
```javascript
Actions
├─ ➕ New Product         Ctrl+N
├─ 👤 New Customer        Ctrl+Shift+C
├─ 🛒 New Order           Ctrl+O
├─ 📄 New Invoice         Ctrl+I
├─ 💾 Save Changes        Ctrl+S
├─ 🔄 Refresh Data        Ctrl+R
├─ 📥 Import Data
└─ 📤 Export Data
```

#### 4. Search Results Group (Dynamic)
```javascript
Search Results (when searching)
├─ Product: "Widget Pro 2000" - Rs. 15,000
├─ Product: "Widget Standard" - Rs. 10,000
├─ Customer: "Nimal Perera" - +94 77 123 4567
├─ Order: "#ORD-2026-001234" - Rs. 13,800
└─ Invoice: "#INV-2026-045" - Paid
```

#### 5. Settings Group
```javascript
Settings
├─ ⚙️  Preferences        Ctrl+,
├─ 👤 Profile
├─ 🎨 Theme               (Light/Dark/Auto)
├─ 🌐 Language            (English/සිංහල/தமிழ்)
└─ 🚪 Logout
```

#### 6. Help Group
```javascript
Help
├─ 📖 Documentation       F1
├─ ⌨️  Keyboard Shortcuts Ctrl+/
├─ 💬 Support Chat
├─ 🐛 Report Issue
└─ ℹ️  About
```

### Keyboard Shortcut Handling

```
┌────────────────────────────────────────────────┐
│      CommandPalette Keyboard Shortcuts         │
├────────────────────────────────────────────────┤
│                                                │
│ Open/Close:                                    │
│  • Cmd+K / Ctrl+K    → Toggle palette          │
│  • Esc               → Close palette           │
│                                                │
│ Navigation:                                    │
│  • ↑ Arrow Up        → Previous item           │
│  • ↓ Arrow Down      → Next item               │
│  • Home              → First item              │
│  • End               → Last item               │
│  • Enter             → Select item             │
│                                                │
│ Search:                                        │
│  • Type              → Filter commands         │
│  • Backspace         → Delete character        │
│  • Ctrl+A            → Select all text         │
│                                                │
│ Quick Actions (when palette closed):           │
│  • Ctrl+N            → Open palette + New Prod │
│  • Ctrl+O            → Open palette + New Order│
│  • Ctrl+,            → Open palette + Settings │
└────────────────────────────────────────────────┘
```

### Recent Items Management

```javascript
// Recent items structure
recentItems = [
  {
    id: 'prod-001',
    type: 'product',
    label: 'Widget Pro 2000',
    icon: '📦',
    route: '/products/prod-001',
    timestamp: '2026-01-24T14:30:00Z'
  },
  {
    id: 'cust-042',
    type: 'customer',
    label: 'Nimal Perera',
    icon: '👤',
    route: '/customers/cust-042',
    timestamp: '2026-01-24T14:25:00Z'
  },
  // ... more items
]

// Add to recent items
function addRecentItem(item) {
  // Add to beginning
  // Remove duplicates
  // Limit to 10 items
  // Store in localStorage
}

// Clear recent items
function clearRecentItems() {
  // Clear from state and storage
}
```

### Search Filtering Logic

```
Search Query: "prod"

Results:
┌────────────────────────────────────┐
│ Pages                              │
│  📦 Products              ← Match  │
├────────────────────────────────────┤
│ Actions                            │
│  ➕ New Product           ← Match  │
│  ✏️  Edit Product          ← Match  │
├────────────────────────────────────┤
│ Search Results                     │
│  📦 Widget Pro 2000       ← Match  │
│  📦 Widget Production Kit ← Match  │
└────────────────────────────────────┘

Empty Groups Hidden:
- Recent (no matches)
- Settings (no matches)
- Help (no matches)
```

### Loading States

```
While searching/loading:

┌────────────────────────────────────┐
│ [🔍 searching products...]         │
├────────────────────────────────────┤
│                                    │
│  ⏳ Loading results...             │ ← Loading message
│                                    │
│  ▓░░░░░░░░░░░░░░░                 │ ← Skeleton item
│  ▓░░░░░░░░░░░░░░░                 │
│  ▓░░░░░░░░░░░░░░░                 │
│                                    │
└────────────────────────────────────┘
```

### Command Execution Flow

```
1. User opens palette (Cmd+K)
        ↓
2. User types search query
        ↓
3. Results filtered in real-time
        ↓
4. User navigates with arrows
        ↓
5. User selects item (Enter)
        ↓
6. Action executed:
   ├─ Navigation → Router.push()
   ├─ Action → Trigger function
   ├─ External → Window.open()
   └─ Modal → Open dialog
        ↓
7. Palette closes
        ↓
8. Item added to recent history
        ↓
9. Success feedback (optional toast)
```

### Integration Example Layout

```
components/
├─ common/
│  ├─ CommandPalette.tsx       ← Main component
│  └─ useCommandPalette.ts     ← Hook for external triggers
├─ ui/
│  ├─ command.tsx              ← Base Command component
│  └─ dialog.tsx               ← Dialog wrapper
└─ layout/
   └─ RootLayout.tsx           ← Include CommandPalette here

app/
└─ layout.tsx
   └─ <CommandPalette />       ← Global availability
```

### Expected Outcome
- Fully functional command palette
- Opens with Cmd/Ctrl+K shortcut
- Search filters across all command types
- Navigation and action commands work
- Recent items tracked and displayed
- Grouped, organized command structure
- Smooth user experience

### Verification Checklist
- [ ] CommandPalette.tsx file created
- [ ] Cmd/Ctrl+K opens palette
- [ ] Esc closes palette
- [ ] Search input filters commands
- [ ] Arrow key navigation works
- [ ] Enter key selects commands
- [ ] Navigation commands work
- [ ] Action commands execute
- [ ] Recent items track history
- [ ] Groups display correctly
- [ ] Empty state shows when no results
- [ ] Loading state displays during search
- [ ] Keyboard shortcuts display
- [ ] Palette closes after selection
- [ ] Component integrated in root layout

---

## Summary

This document established the overlay and command infrastructure for the ERP dashboard:

### Completed Components
- ✅ Sheet component (side panels/drawers)
- ✅ SidePanel component (custom detail views)
- ✅ DropdownMenu component (action menus)
- ✅ ContextMenu component (right-click menus)
- ✅ Popover component (floating content)
- ✅ Tooltip component (hover hints)
- ✅ Command component (command interface base)
- ✅ CommandPalette component (global Cmd+K interface)

### Key Achievements
1. **Side Panel System** - Consistent detail view panels with multiple sizes
2. **Menu Systems** - Dropdown and context menus for actions
3. **Floating Content** - Popovers and tooltips for supplementary info
4. **Command Interface** - Global keyboard-accessible command palette
5. **Keyboard Navigation** - Comprehensive keyboard shortcut support
6. **User Experience** - Desktop-class interactions for ERP dashboard

### Component Categories Completed
- **Layout Components**: Sheet, SidePanel
- **Menu Components**: DropdownMenu, ContextMenu
- **Overlay Components**: Popover, Tooltip
- **Command Components**: Command, CommandPalette

### Next Steps
With Group D complete, all component library setup tasks for SubPhase-03 are finished. Proceed to SubPhase-04 for state management and data fetching setup.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~995
