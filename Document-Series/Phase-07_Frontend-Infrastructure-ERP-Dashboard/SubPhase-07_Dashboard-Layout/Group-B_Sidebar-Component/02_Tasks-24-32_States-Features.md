# Tasks 24-32: States, Features & Interactions

> **Phase:** 07 - Frontend Infrastructure ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout Structure  
> **Group:** B - Sidebar Component  
> **Document:** 02 of 02  
> **Tasks Covered:** 24, 25, 26, 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-23_Sidebar-Navigation.md](01_Tasks-15-23_Sidebar-Navigation.md)
- **→ Next Group:** [../Group-C_Header-Component/](../Group-C_Header-Component/)

---

## Document Overview

This document completes the sidebar implementation by adding advanced features including nested sub-navigation, active state styling, icon integration, collapsed mode with tooltips, user footer, permission-based visibility, smooth animations, and keyboard navigation. These features transform the sidebar into a fully functional, accessible, and user-friendly navigation interface.

### Key Features
- **Nested Navigation:** SubNavItem component for hierarchical menu structures with proper indentation
- **Visual Feedback:** Active state highlighting with background colors, text emphasis, and left border indicators
- **Icon System:** Integration of Lucide React icons for visual navigation cues
- **Compact Mode:** Collapsed state reducing sidebar to 72px width showing only icons with hover tooltips
- **User Context:** Footer section displaying current user information and quick actions
- **Security:** Permission-based menu item visibility using authentication store
- **Polish:** Smooth CSS transitions for width, opacity, and state changes
- **Accessibility:** Full keyboard navigation with arrow keys, Enter, and Escape support

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 24 | Create SubNavItem Component | Medium | 30 min |
| 25 | Implement Active State Styling | Medium | 25 min |
| 26 | Add Navigation Icons | Low | 20 min |
| 27 | Implement Collapsed State | High | 40 min |
| 28 | Add Collapsed Tooltip | Medium | 30 min |
| 29 | Create Sidebar Footer | Medium | 35 min |
| 30 | Add Permission-Based Visibility | High | 45 min |
| 31 | Add Sidebar Resize Animation | Low | 20 min |
| 32 | Create Sidebar Keyboard Navigation | High | 50 min |

---

## Enhanced Sidebar Architecture

### Complete Component Structure

```
Sidebar (Main Container)
├── SidebarHeader
│   ├── Logo (Expanded/Collapsed variants)
│   └── CollapseToggle (Expand/Collapse button)
│
├── SidebarNav (Navigation Container)
│   └── Menu Items (Dynamic rendering with permissions)
│       ├── NavItem (Single menu item)
│       │   ├── Icon (Lucide icon) *NEW*
│       │   ├── Label (Text label)
│       │   ├── Active Indicator *NEW*
│       │   └── Tooltip (Collapsed mode) *NEW*
│       │
│       ├── NavGroup (Collapsible group)
│       │   ├── Group Header (Clickable)
│       │   │   ├── Icon *NEW*
│       │   │   ├── Label
│       │   │   ├── Active Indicator *NEW*
│       │   │   ├── Chevron (Expand/Collapse)
│       │   │   └── Tooltip (Collapsed) *NEW*
│       │   │
│       │   └── Children Container
│       │       └── SubNavItem(s) *NEW*
│       │           ├── Icon *NEW*
│       │           ├── Label (Indented)
│       │           ├── Active Indicator *NEW*
│       │           └── Tooltip (Collapsed) *NEW*
│       │
│       └── Permission Check (Per Item) *NEW*
│
└── SidebarFooter *NEW*
    ├── User Avatar
    ├── User Info (Name/Email)
    ├── Quick Actions
    └── Tooltip (Collapsed mode)

Keyboard Navigation Handler *NEW*
Resize Animation System *NEW*
```

### State Flow with New Features

```
┌───────────────────────────────────────────────────────────────┐
│ Zustand UI Store                                              │
│ (/stores/ui-store.ts)                                         │
│                                                               │
│ State:                                                        │
│  - sidebarCollapsed: boolean                                  │
│  - activeRoute: string                                        │
│                                                               │
│ Actions:                                                      │
│  - toggleSidebar()                                            │
│  - setSidebarCollapsed(value: boolean)                        │
│  - setActiveRoute(path: string)                               │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ↓
┌───────────────────────────────────────────────────────────────┐
│ Auth Store (Permission Context)                               │
│ (/stores/auth-store.ts)                                       │
│                                                               │
│ Methods:                                                      │
│  - hasPermission(permission: string): boolean                 │
│  - hasAnyPermission(permissions: string[]): boolean           │
│  - getCurrentUser(): User                                     │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ↓
                  ┌─────────────────────────┐
                  │ Sidebar Component       │
                  │ (with all features)     │
                  └─────────────────────────┘
                                │
       ┌────────────────────────┼────────────────────────┐
       │                        │                        │
       ↓                        ↓                        ↓
  NavItem/SubNavItem      SidebarFooter          CSS Transitions
  (active + icons         (user context)         (width, opacity)
   + tooltips)
       │                        │                        │
       └────────────────────────┴────────────────────────┘
                                │
                                ↓
                    Keyboard Navigation Handler
                    (Arrow keys, Enter, Escape)
```

---

## Task 24: Create SubNavItem Component

### Overview
Create the SubNavItem component for rendering nested navigation items within NavGroup components. SubNavItems represent child routes under a parent group, displayed with visual indentation, smaller text, and support for icons and active states. These items follow the same interaction patterns as regular NavItems but with distinct styling to indicate hierarchy.

### Dependencies
- NavItem component exists (Task 22)
- NavGroup component exists (Task 23)
- Sidebar structure established (Task 15)
- UI store connected (Task 19)
- Next.js Link and usePathname available

### Instructions

1. **Create SubNavItem component file**
   - Navigate to `frontend/components/layout/Sidebar/` directory
   - Create new file `SubNavItem.tsx`
   - Add file header comment with component description

2. **Define SubNavItem props interface**
   - Create `SubNavItemProps` interface
   - Add `href` property (string) - Target route path
   - Add `label` property (string) - Display text
   - Add `icon` property (optional LucideIcon) - Icon component
   - Add `isCollapsed` property (boolean) - Sidebar state
   - Add `onClick` property (optional function) - Click handler

3. **Import required dependencies**
   - Import Link and usePathname from Next.js
   - Import cn utility from class utils
   - Import LucideIcon type from lucide-react
   - Import React core utilities

4. **Implement active state detection**
   - Use usePathname hook to get current route
   - Compare current pathname with href prop
   - Support exact match detection
   - Support partial match for dynamic routes
   - Set isActive boolean flag

5. **Structure component JSX**
   - Wrap in Link component with href prop
   - Apply conditional CSS classes based on state
   - Render icon if provided and conditions met
   - Render label text with proper styling
   - Add hover and focus states

6. **Apply indentation styling**
   - Add left padding of 48px (pl-12) when expanded
   - Reduces to centered icon when collapsed
   - Visual indicator of hierarchy level
   - Distinct from parent NavItem styling

7. **Configure text sizing**
   - Use text-sm for smaller appearance
   - Maintains readability while showing hierarchy
   - Consistent with design system typography

8. **Add conditional rendering logic**
   - Show icon + label when expanded
   - Show only icon (centered) when collapsed
   - Handle cases where no icon provided
   - Maintain consistent spacing

9. **Implement interactive states**
   - Add hover background transition
   - Add focus ring for accessibility
   - Add active state visual feedback
   - Smooth opacity transitions

10. **Handle click events**
    - Call onClick prop if provided
    - Allow parent to handle navigation events
    - Maintain default Link behavior
    - Support external tracking

11. **Update Sidebar index exports**
    - Add SubNavItem to exports in `index.ts`
    - Maintain alphabetical ordering
    - Export props type for external use

12. **Verify integration points**
    - Ensure compatible with NavGroup children
    - Test with various icon types
    - Validate href path handling
    - Confirm responsive behavior

### SubNavItem Visual Structure

```
┌─────────────────────────────────────────────────────────┐
│                EXPANDED STATE (240px)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───┬────────────────────────────────────┐            │
│  │   │  [Icon]  Dashboard Overview       │ Regular    │
│  └───┴────────────────────────────────────┘            │
│       ↑                                                 │
│       48px indent                                       │
│                                                         │
│  ┌───┬────────────────────────────────────┐            │
│  │ ● │  [Icon]  Sales Analytics          │ Active     │
│  └───┴────────────────────────────────────┘            │
│   ↑                                                     │
│   4px left border                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌────────────────────────────┐
│  COLLAPSED STATE (72px)    │
├────────────────────────────┤
│                            │
│      ┌──────┐              │
│      │ [Ic] │  Regular     │
│      └──────┘              │
│                            │
│      ┌──────┐              │
│    ● │ [Ic] │  Active      │
│      └──────┘              │
│    ↑                       │
│    Left border             │
│                            │
└────────────────────────────┘
```

### SubNavItem Styling Specifications

```
Default State:
- Background: transparent
- Text: text-muted-foreground
- Size: text-sm
- Padding-left: 48px (expanded), centered (collapsed)
- Hover: bg-accent/50

Active State:
- Background: bg-primary/10
- Text: text-primary font-medium
- Left border: 4px w-1 bg-primary
- Icon color: text-primary

Focus State:
- Ring: ring-2 ring-ring
- Ring offset: ring-offset-2

Transition:
- All properties: transition-all duration-200
```

### Expected Outcome
SubNavItem component created and integrated into sidebar navigation system. Component supports hierarchical navigation display with proper indentation, handles active state detection, renders icons conditionally based on collapsed state, and integrates seamlessly with parent NavGroup components. The component is reusable, accessible, and styled consistently with the design system.

### Verification Checklist
- [ ] SubNavItem.tsx file created in correct directory
- [ ] Props interface defined with all required properties
- [ ] Active state detection working with usePathname
- [ ] Indentation clearly shows hierarchy (48px padding)
- [ ] Smaller text size (text-sm) applied
- [ ] Icons display correctly when provided
- [ ] Label text renders in expanded mode
- [ ] Collapsed mode shows centered icon only
- [ ] Hover states provide visual feedback
- [ ] Active state styling matches specifications
- [ ] Focus ring visible for keyboard navigation
- [ ] Component exported from index.ts
- [ ] TypeScript types compile without errors
- [ ] Integration with NavGroup successful

---

## Task 25: Implement Active State Styling

### Overview
Implement comprehensive active state styling for all navigation components (NavItem, NavGroup, SubNavItem) to provide clear visual feedback about the current route. Active state includes background highlighting, text color changes, font weight adjustments, and a distinctive left border. The system intelligently handles parent group activation when child routes are active.

### Dependencies
- NavItem component exists (Task 22)
- NavGroup component exists (Task 23)
- SubNavItem component exists (Task 24)
- usePathname hook available
- Tailwind CSS configured
- Design tokens defined

### Instructions

1. **Define active state detection utility**
   - Create helper function `isRouteActive`
   - Accept current pathname and target href
   - Implement exact match logic
   - Implement partial match for parent routes
   - Return boolean result

2. **Create route matching logic**
   - Exact match: pathname === href
   - Prefix match: pathname starts with href for parent groups
   - Dynamic route handling: match base path
   - Query parameter independence
   - Hash fragment independence

3. **Update NavItem component**
   - Add active state detection using usePathname
   - Apply conditional className based on isActive
   - Add background color: bg-primary/10
   - Add text color: text-primary
   - Add font weight: font-medium
   - Add left border indicator

4. **Implement left border indicator**
   - Position: absolute left border
   - Width: 4px (w-1 in Tailwind)
   - Color: bg-primary
   - Height: full height of item
   - Rounded: rounded-r-md
   - Visible only when active

5. **Update NavGroup component**
   - Detect if any child route is active
   - Apply active styling to group header when child active
   - Keep group expanded if child is active
   - Highlight both parent and active child

6. **Update SubNavItem component**
   - Add active state detection
   - Apply same active styles as NavItem
   - Maintain indentation in active state
   - Ensure left border doesn't conflict with padding

7. **Create CSS classes for active state**
   - Define reusable active state class combination
   - Ensure consistency across all nav components
   - Support dark mode color variations
   - Include transition properties

8. **Handle parent-child relationship**
   - When SubNavItem active, parent NavGroup shows partial active state
   - Parent gets subtle background: bg-accent
   - Child gets full active state: bg-primary/10
   - Both maintain text color consistency

9. **Implement hover interaction with active state**
   - Active items have reduced hover effect
   - Inactive items have stronger hover feedback
   - Maintain visual hierarchy
   - Smooth transition between states

10. **Add focus state compatibility**
    - Focus ring visible on active items
    - Focus ring contrasts with active background
    - Keyboard navigation clearly visible
    - Doesn't conflict with left border

11. **Support collapsed mode active state**
    - Active indicator visible in collapsed mode
    - Left border remains visible
    - Icon color changes to text-primary
    - Background color visible behind icon

12. **Test multi-level activation**
    - Test with nested routes
    - Verify parent activation with child routes
    - Test route parameter changes
    - Verify query string independence

### Active State Visual Hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│                 ACTIVE STATE HIERARCHY                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SCENARIO 1: Direct NavItem Active                          │
│  ───────────────────────────────────────                    │
│                                                              │
│  ┌────┬──────────────────────────────────┐                  │
│  │ ●● │ [Icon]  Dashboard               │  ← Active        │
│  └────┴──────────────────────────────────┘                  │
│    ↑    bg-primary/10, text-primary                          │
│    4px border                                                │
│                                                              │
│                                                              │
│  SCENARIO 2: NavGroup with Active Child                     │
│  ────────────────────────────────────────                   │
│                                                              │
│  ┌────┬──────────────────────────────────┐                  │
│  │    │ [Icon]  Sales  [▼]              │  ← Parent        │
│  └────┴──────────────────────────────────┘  bg-accent       │
│       │                                                      │
│       │  ┌───┬─────────────────────────┐                    │
│       └──│ ●●│  [Icon] Orders          │  ← Active Child   │
│          └───┴─────────────────────────┘  bg-primary/10     │
│               ↑                                              │
│               48px indent + 4px border                       │
│                                                              │
│                                                              │
│  SCENARIO 3: Collapsed Mode Active                          │
│  ───────────────────────────────────                        │
│                                                              │
│          ┌──────┐                                            │
│        ● │ [Ic] │  ← Active (left border + bg)              │
│          └──────┘                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Active State Styling Matrix

```
╔═══════════════════════╦══════════════════════╦═══════════════════╗
║ Component             ║ Expanded Mode        ║ Collapsed Mode    ║
╠═══════════════════════╬══════════════════════╬═══════════════════╣
║ NavItem (Active)      ║ bg-primary/10        ║ bg-primary/10     ║
║                       ║ text-primary         ║ text-primary      ║
║                       ║ font-medium          ║ font-medium       ║
║                       ║ 4px left border      ║ 4px left border   ║
╠═══════════════════════╬══════════════════════╬═══════════════════╣
║ NavGroup (Child       ║ bg-accent (subtle)   ║ bg-accent         ║
║  Active)              ║ text-foreground      ║ icon-primary      ║
║                       ║ No left border       ║ No left border    ║
╠═══════════════════════╬══════════════════════╬═══════════════════╣
║ SubNavItem (Active)   ║ bg-primary/10        ║ bg-primary/10     ║
║                       ║ text-primary         ║ text-primary      ║
║                       ║ font-medium          ║ font-medium       ║
║                       ║ 4px left border      ║ 4px left border   ║
║                       ║ 48px indent          ║ Centered icon     ║
╚═══════════════════════╩══════════════════════╩═══════════════════╝
```

### Route Matching Logic Flow

```
┌──────────────────────────────────────────────────────────┐
│ Current Path: /dashboard/sales/orders/123                │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────┐
        │ Route Matching Algorithm   │
        └────────────────────────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ↓               ↓               ↓
 Exact Match    Prefix Match   Dynamic Match
 (NavItem)      (NavGroup)     (Params)
     │               │               │
     ↓               ↓               ↓
/orders/123    /sales          /orders/:id
 (Match)        (Match)         (Match)
     │               │               │
     └───────────────┴───────────────┘
                     │
                     ↓
          ┌──────────────────────┐
          │ Apply Active States  │
          └──────────────────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ↓               ↓               ↓
SubNavItem      NavGroup         Parent
(Full Active)  (Partial Active)  (Expanded)
```

### Expected Outcome
Active state styling fully implemented across all navigation components with clear visual feedback. Current route and its parent groups are properly highlighted with appropriate background colors, text emphasis, and left border indicators. The system correctly handles nested routes, dynamic parameters, and maintains visual consistency in both expanded and collapsed sidebar modes. Users can instantly identify their current location in the application.

### Verification Checklist
- [ ] isRouteActive utility function created and working
- [ ] Exact route matching functional
- [ ] Prefix matching works for parent routes
- [ ] Dynamic route parameters handled correctly
- [ ] NavItem shows active state on current route
- [ ] NavGroup shows active state when child active
- [ ] SubNavItem shows active state correctly
- [ ] Left border (4px, primary color) displays
- [ ] Background color bg-primary/10 applies correctly
- [ ] Text color text-primary and font-medium apply
- [ ] Parent groups highlight when child is active
- [ ] Active state visible in collapsed mode
- [ ] Hover states work with active states
- [ ] Focus states compatible with active styling
- [ ] No layout shifts when state changes
- [ ] Dark mode colors work correctly
- [ ] Transitions smooth between states

---

## Task 26: Add Navigation Icons

### Overview
Integrate Lucide React icons throughout the navigation system to provide visual cues for each menu item. Assign semantically appropriate icons to all menu items, groups, and sub-items defined in the navigation configuration. Icons enhance usability, improve visual scanning, and are essential for the collapsed sidebar mode where they serve as the primary navigation indicators.

### Dependencies
- NavItem component exists (Task 22)
- NavGroup component exists (Task 23)
- SubNavItem component exists (Task 24)
- Navigation menu items defined (Task 21)
- lucide-react package installed
- Component props support icon property

### Instructions

1. **Install lucide-react package**
   - Navigate to frontend directory
   - Run package manager install command
   - Verify installation in package.json
   - Check for peer dependency warnings

2. **Import required icons**
   - Create icons import file or section
   - Import all needed icons from lucide-react
   - Group imports by category
   - Use named imports for tree-shaking

3. **Define icon mapping**
   - Create icons object or configuration
   - Map each route to appropriate icon
   - Ensure semantic meaning
   - Consider user familiarity

4. **Assign dashboard icons**
   - Home/Dashboard: LayoutDashboard
   - Analytics: BarChart3
   - Reports: FileText
   - Overview: Activity

5. **Assign inventory icons**
   - Products: Package
   - Categories: FolderTree
   - Stock: Archive
   - Adjustments: RefreshCw
   - Suppliers: Truck

6. **Assign sales icons**
   - Orders: ShoppingCart
   - Invoices: FileText
   - Quotes: FileCheck
   - Customers: Users
   - POS: CreditCard

7. **Assign purchasing icons**
   - Purchase Orders: ShoppingBag
   - Bills: Receipt
   - Vendors: Building2
   - Payments: DollarSign

8. **Assign HR & Payroll icons**
   - Employees: UserCircle
   - Attendance: Clock
   - Payroll: Wallet
   - Leave: Calendar

9. **Assign settings icons**
   - General: Settings
   - Users: UserCog
   - Roles: Shield
   - System: Server
   - Preferences: Sliders

10. **Update navigation menu items array**
    - Add icon property to each menu item object
    - Set icon value to imported icon component
    - Maintain consistent property ordering
    - Include icons for all levels (groups and items)

11. **Update component props to accept icons**
    - Ensure NavItem accepts icon prop
    - Ensure NavGroup accepts icon prop
    - Ensure SubNavItem accepts icon prop
    - Type icon prop as LucideIcon

12. **Render icons in components**
    - Display icon before label text
    - Apply consistent sizing (h-5 w-5 or h-4 w-4)
    - Add margin-right for spacing from label
    - Handle missing icon gracefully

13. **Style icons appropriately**
    - Default color: currentColor
    - Active state: inherits text-primary
    - Hover state: subtle color transition
    - Size consistency across all items

14. **Configure collapsed mode icons**
    - Center icons when sidebar collapsed
    - Increase icon size slightly if needed
    - Ensure adequate touch target
    - Maintain aspect ratio

15. **Test icon visibility**
    - Verify all icons display correctly
    - Check alignment with text
    - Test in both light and dark modes
    - Validate collapsed mode appearance

### Icon Mapping Reference

```
┌─────────────────────────────────────────────────────────────┐
│                   ICON ASSIGNMENTS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DASHBOARD & ANALYTICS                                      │
│  ├─ LayoutDashboard  →  Dashboard Home                      │
│  ├─ BarChart3        →  Analytics                           │
│  ├─ Activity         →  Activity Overview                   │
│  └─ FileText         →  Reports                             │
│                                                             │
│  INVENTORY MANAGEMENT                                       │
│  ├─ Package          →  Products                            │
│  ├─ FolderTree       →  Categories                          │
│  ├─ Archive          →  Stock Levels                        │
│  ├─ RefreshCw        →  Adjustments                         │
│  └─ Truck            →  Suppliers                           │
│                                                             │
│  SALES & CUSTOMERS                                          │
│  ├─ ShoppingCart     →  Sales Orders                        │
│  ├─ FileText         →  Invoices                            │
│  ├─ FileCheck        →  Quotations                          │
│  ├─ Users            →  Customers                           │
│  └─ CreditCard       →  POS                                 │
│                                                             │
│  PURCHASING                                                 │
│  ├─ ShoppingBag      →  Purchase Orders                     │
│  ├─ Receipt          →  Vendor Bills                        │
│  ├─ Building2        →  Vendors                             │
│  └─ DollarSign       →  Payments                            │
│                                                             │
│  HR & PAYROLL                                               │
│  ├─ UserCircle       →  Employees                           │
│  ├─ Clock            →  Attendance                          │
│  ├─ Wallet           →  Payroll                             │
│  └─ Calendar         →  Leave Management                    │
│                                                             │
│  SETTINGS                                                   │
│  ├─ Settings         →  General Settings                    │
│  ├─ UserCog          →  User Management                     │
│  ├─ Shield           →  Roles & Permissions                 │
│  ├─ Server           →  System Settings                     │
│  └─ Sliders          →  Preferences                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Icon Rendering Structure

```
EXPANDED MODE (240px):
┌────────────────────────────────────┐
│  [Icon: 20x20]  Label Text         │
│   └─ 12px gap ─┘                   │
└────────────────────────────────────┘

COLLAPSED MODE (72px):
┌──────────┐
│          │
│  [Icon]  │  ← Centered, 24x24
│          │
└──────────┘

SUBNAV ITEM (Indented):
┌─────────────────────────────────────┐
│        [Icon: 16x16]  Label Text    │
│ 48px → └─ 8px gap ──┘               │
└─────────────────────────────────────┘
```

### Icon Size Specifications

```
╔═══════════════════════╦════════════════╦═════════════════╗
║ Component Type        ║ Expanded Size  ║ Collapsed Size  ║
╠═══════════════════════╬════════════════╬═════════════════╣
║ NavItem               ║ 20x20px (h-5)  ║ 24x24px (h-6)   ║
║ NavGroup              ║ 20x20px (h-5)  ║ 24x24px (h-6)   ║
║ SubNavItem            ║ 16x16px (h-4)  ║ 20x20px (h-5)   ║
║ SidebarFooter         ║ 16x16px (h-4)  ║ 20x20px (h-5)   ║
╚═══════════════════════╩════════════════╩═════════════════╝
```

### Expected Outcome
All navigation menu items display appropriate Lucide React icons that provide visual cues about their function. Icons are semantically meaningful, consistently sized, and properly aligned with text labels. The icon system enhances usability in expanded mode and becomes the primary navigation interface in collapsed mode. Icons inherit appropriate colors for default, hover, and active states.

### Verification Checklist
- [ ] lucide-react package installed and in package.json
- [ ] All required icons imported correctly
- [ ] Icon mapping covers all menu items
- [ ] Dashboard section has appropriate icons
- [ ] Inventory section has appropriate icons
- [ ] Sales section has appropriate icons
- [ ] Purchasing section has appropriate icons
- [ ] HR/Payroll section has appropriate icons
- [ ] Settings section has appropriate icons
- [ ] Icons added to navigation menu items array
- [ ] NavItem component renders icons correctly
- [ ] NavGroup component renders icons correctly
- [ ] SubNavItem component renders icons correctly
- [ ] Icon sizing consistent (h-5 w-5 for main items)
- [ ] Icon spacing from text appropriate (mr-3)
- [ ] Icons centered in collapsed mode
- [ ] Icons inherit text color (currentColor)
- [ ] Active state icons show text-primary color
- [ ] Dark mode icon colors work correctly
- [ ] All icons display without errors
- [ ] No missing icon warnings

---

## Task 27: Implement Collapsed State

### Overview
Implement the collapsed sidebar state that reduces the sidebar width from 240px to 72px, showing only icons without text labels. This feature provides users with more screen space for content while maintaining access to navigation. The collapsed state is controlled by the UI store, persists across sessions, and includes smooth transitions between states.

### Dependencies
- Sidebar component exists (Task 15)
- UI store connected (Task 19)
- Icons added to navigation (Task 26)
- Toggle button implemented (Task 18)
- All navigation components support collapsed mode

### Instructions

1. **Review UI store implementation**
   - Verify sidebarCollapsed state exists in UI store
   - Confirm toggleSidebar action available
   - Check setSidebarCollapsed action available
   - Ensure localStorage persistence configured

2. **Connect Sidebar to collapsed state**
   - Import useUIStore hook in Sidebar component
   - Subscribe to sidebarCollapsed state
   - Pass collapsed state to all child components
   - React to state changes

3. **Apply width transitions**
   - Set default width to 240px (w-60)
   - Set collapsed width to 72px (w-18)
   - Add CSS transition for width changes
   - Duration: 300ms (duration-300)
   - Easing: ease-in-out

4. **Update Sidebar container classes**
   - Add conditional className based on collapsed state
   - Apply w-60 when expanded
   - Apply w-18 when collapsed
   - Add transition-all class
   - Maintain fixed positioning

5. **Update SidebarHeader for collapsed state**
   - Show full logo when expanded
   - Show compact logo mark when collapsed
   - Center content when collapsed
   - Adjust padding appropriately

6. **Update Logo component**
   - Create two logo variants: full and mark
   - Show full logo (text + mark) when expanded
   - Show only mark (icon) when collapsed
   - Transition opacity between variants
   - Center mark in collapsed state

7. **Update NavItem for collapsed state**
   - Hide label text when collapsed
   - Center icon when collapsed
   - Maintain full height for click target
   - Show tooltip on hover (Task 28 dependency)
   - Keep active state visible

8. **Update NavGroup for collapsed state**
   - Hide group label when collapsed
   - Hide chevron indicator when collapsed
   - Center icon when collapsed
   - Disable expansion when collapsed
   - Show tooltip with group name

9. **Update NavGroup children behavior**
   - Hide all children when sidebar collapsed
   - Don't expand groups in collapsed mode
   - Maintain expansion state for when reopened
   - Show tooltip indicating sub-items exist

10. **Update SubNavItem for collapsed state**
    - Hide completely when parent sidebar collapsed
    - Groups don't expand in collapsed mode
    - Ready to show when sidebar re-expanded
    - Maintain active state data

11. **Configure overflow handling**
    - Set overflow-hidden on transition elements
    - Prevent text from wrapping during transition
    - Hide scrollbar during collapse
    - Restore scrollbar when expanded

12. **Add content padding adjustments**
    - Update main content area margin/padding
    - Account for sidebar width change
    - Synchronize with sidebar transition
    - Prevent layout shift

13. **Handle tooltip trigger setup**
    - Add tooltip wrapper to items when collapsed
    - Position tooltips to right of sidebar
    - Delay tooltip appearance (200ms)
    - Hide tooltips when expanded

14. **Test state persistence**
    - Verify collapsed state saves to localStorage
    - Check state restores on page reload
    - Test state sync across components
    - Validate default state on first load

15. **Test transition smoothness**
    - Verify smooth width animation
    - Check no layout jank
    - Test with slow motion animations
    - Validate performance

### Collapsed State Visual Transition

```
EXPANDED (240px)                       COLLAPSED (72px)
┌────────────────────────────────┐    ┌──────────┐
│ ┌─┐ Company Logo              │    │   ┌─┐    │
│ └─┘                    [≡]    │    │   └─┘ [≡]│
├────────────────────────────────┤    ├──────────┤
│                                │    │          │
│ [≡] Dashboard                  │    │   [≡]    │
│                                │    │          │
│ [▼] Inventory                  │    │   [▼]    │
│   → [□] Products               │    │          │
│   → [◊] Categories             │    │          │
│                                │    │          │
│ [▼] Sales                      │    │   [▼]    │
│   → [○] Orders                 │    │          │
│   → [◊] Invoices               │    │          │
│                                │    │          │
│ [★] Settings                   │    │   [★]    │
│                                │    │          │
├────────────────────────────────┤    ├──────────┤
│ ◉ John Doe                     │    │    ◉     │
│   john@example.com             │    │          │
└────────────────────────────────┘    └──────────┘
         │                                  │
         │      TRANSITION (300ms)          │
         └──────────────────────────────────┘
                  Smooth resize
            Icons remain visible
           Text fades out/in
         Background maintained
```

### Width Transition States

```
┌──────────────────────────────────────────────────────────┐
│            SIDEBAR WIDTH TRANSITION                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  t=0ms    ████████████████████  240px (Expanded)        │
│                                                          │
│  t=100ms  ████████████████      192px (Transitioning)   │
│           [Text starts fading]                           │
│                                                          │
│  t=200ms  ████████              120px (Transitioning)   │
│           [Icons repositioning]                          │
│                                                          │
│  t=300ms  ████                  72px (Collapsed)        │
│           [Icons centered]                               │
│           [Tooltips enabled]                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Collapsed State Component Behavior

```
╔═══════════════════╦═════════════════════╦══════════════════╗
║ Component         ║ Expanded            ║ Collapsed        ║
╠═══════════════════╬═════════════════════╬══════════════════╣
║ Sidebar           ║ w-60 (240px)        ║ w-18 (72px)      ║
║                   ║ overflow-y-auto     ║ overflow-visible ║
╠═══════════════════╬═════════════════════╬══════════════════╣
║ Logo              ║ Full logo + text    ║ Icon mark only   ║
║                   ║ Left aligned        ║ Centered         ║
╠═══════════════════╬═════════════════════╬══════════════════╣
║ NavItem           ║ Icon + Label        ║ Icon only        ║
║                   ║ Text visible        ║ Text hidden      ║
║                   ║ No tooltip          ║ Tooltip on hover ║
╠═══════════════════╬═════════════════════╬══════════════════╣
║ NavGroup          ║ Expandable          ║ Not expandable   ║
║                   ║ Shows children      ║ Hides children   ║
║                   ║ Chevron visible     ║ No chevron       ║
║                   ║ No tooltip          ║ Tooltip on hover ║
╠═══════════════════╬═════════════════════╬══════════════════╣
║ SubNavItem        ║ Visible indented    ║ Hidden           ║
║                   ║ Icon + Label        ║ Not rendered     ║
╠═══════════════════╬═════════════════════╬══════════════════╣
║ Footer            ║ Avatar + Name/Email ║ Avatar only      ║
║                   ║ Actions visible     ║ Tooltip on hover ║
╚═══════════════════╩═════════════════════╩══════════════════╝
```

### Expected Outcome
Sidebar smoothly transitions between expanded (240px) and collapsed (72px) states when toggle button is clicked. In collapsed mode, only icons are visible, centered within the narrow sidebar. Text labels hide gracefully during transition. Active state indicators remain visible. The collapsed state persists across page reloads via localStorage. Layout is stable with no content jumping. Icons maintain adequate touch targets. Tooltips are prepared for display (implemented in Task 28).

### Verification Checklist
- [ ] UI store sidebarCollapsed state connected
- [ ] Toggle button triggers state change
- [ ] Width transitions from 240px to 72px smoothly
- [ ] Transition duration is 300ms
- [ ] Transition easing is ease-in-out
- [ ] Logo switches to mark-only in collapsed state
- [ ] Logo centered in collapsed state
- [ ] NavItem labels hide in collapsed mode
- [ ] NavItem icons center in collapsed mode
- [ ] NavGroup labels hide in collapsed mode
- [ ] NavGroup chevrons hide in collapsed mode
- [ ] NavGroup children hide in collapsed mode
- [ ] SubNavItems completely hidden in collapsed mode
- [ ] Footer shows avatar only when collapsed
- [ ] Active state indicators still visible
- [ ] Left border visible in collapsed mode
- [ ] No horizontal scrollbar appears
- [ ] Click targets remain adequate (min 44x44px)
- [ ] State persists to localStorage
- [ ] State restores on page reload
- [ ] No layout shift during transition
- [ ] Smooth animation with no jank
- [ ] Content area adjusts appropriately

---

## Task 28: Add Collapsed Tooltip

### Overview
Implement Radix UI Tooltip component to display menu item labels when the sidebar is in collapsed mode. Tooltips appear on hover over icons, showing the full item name, helping users navigate when text labels are hidden. Tooltips are positioned to the right of the sidebar, have a subtle delay, and follow accessibility best practices.

### Dependencies
- Collapsed state implemented (Task 27)
- Icons added to navigation (Task 26)
- NavItem component exists (Task 22)
- NavGroup component exists (Task 23)
- @radix-ui/react-tooltip package available

### Instructions

1. **Install Radix Tooltip**
   - Navigate to frontend directory
   - Install @radix-ui/react-tooltip package
   - Verify installation in package.json
   - Check for required peer dependencies

2. **Create Tooltip wrapper component**
   - Create new file at `components/ui/Tooltip.tsx`
   - Import Radix Tooltip primitives
   - Create custom Tooltip component
   - Wrap Radix components with sensible defaults

3. **Configure Tooltip provider**
   - Add TooltipProvider to layout or sidebar
   - Set delayDuration to 200ms
   - Set skipDelayDuration to 300ms
   - Configure disableHoverableContent if needed

4. **Define tooltip styling**
   - Background: bg-popover
   - Text color: text-popover-foreground
   - Border: border border-border
   - Padding: px-3 py-1.5
   - Font size: text-sm
   - Rounded corners: rounded-md
   - Shadow: shadow-md
   - Z-index: z-50

5. **Add tooltip to NavItem component**
   - Wrap NavItem content with Tooltip
   - Only render tooltip when sidebar is collapsed
   - Set tooltip content to item label
   - Position tooltip to right (side="right")
   - Add 8px offset (sideOffset={8})

6. **Add tooltip to NavGroup component**
   - Wrap NavGroup header with Tooltip
   - Only show when collapsed
   - Content shows group label
   - Include indication of sub-items count
   - Same positioning as NavItem

7. **Configure tooltip positioning**
   - Set side prop to "right"
   - Set sideOffset to 8px
   - Set align to "center"
   - Allow collision detection
   - Flip if space insufficient

8. **Add tooltip animations**
   - Fade in animation: duration-150
   - Fade out animation: duration-100
   - Scale animation: scale-95 to scale-100
   - Origin: origin-left
   - Use Radix animation data attributes

9. **Handle tooltip for SubNavItem**
   - Note: SubNavItems hidden when collapsed
   - No tooltip needed for SubNavItems
   - Parent group tooltip indicates children exist
   - Document this behavior

10. **Add tooltip to SidebarFooter**
    - Wrap footer avatar with Tooltip
    - Show user name and email in tooltip
    - Include quick action labels if present
    - Same styling and positioning

11. **Configure accessibility**
    - Ensure aria-label matches tooltip content
    - Use semantic HTML in tooltip content
    - Support keyboard navigation
    - Announce tooltip content to screen readers

12. **Handle tooltip visibility logic**
    - Only render tooltips when isCollapsed = true
    - Hide tooltips immediately when expanding
    - Show tooltips after hover delay when collapsed
    - Hide on click/navigation

13. **Test tooltip interactions**
    - Hover delay works (200ms)
    - Tooltip appears in correct position
    - Tooltip doesn't overflow viewport
    - Tooltip hides on mouse leave
    - Multiple tooltips don't overlap

14. **Optimize tooltip performance**
    - Lazy render tooltip content
    - Debounce hover events if needed
    - Clean up event listeners
    - Avoid unnecessary re-renders

15. **Style tooltip for dark mode**
    - Use theme-aware colors
    - Test visibility in dark mode
    - Ensure sufficient contrast
    - Match overall design system

### Tooltip Implementation Structure

```
┌──────────────────────────────────────────────────────────┐
│              TOOLTIP COMPONENT STRUCTURE                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  TooltipProvider (Root, in Layout)                      │
│    │                                                     │
│    └─ Sidebar                                            │
│         │                                                │
│         └─ if (isCollapsed)                              │
│              │                                           │
│              └─ Tooltip                                  │
│                   ├─ TooltipTrigger                      │
│                   │    └─ NavItem (Icon only)            │
│                   │                                      │
│                   └─ TooltipContent                      │
│                        ├─ side="right"                   │
│                        ├─ sideOffset={8}                 │
│                        ├─ align="center"                 │
│                        └─ Content: "Dashboard"           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Tooltip Positioning Diagram

```
COLLAPSED SIDEBAR (72px) + TOOLTIP
┌──────────┬─────────────────────────────┐
│          │                             │
│   [≡]    │  ← Tooltip: "Dashboard"    │
│          │     (8px offset)            │
└──────────┴─────────────────────────────┘
    ↑
  Icon
 Trigger

COLLISION DETECTION
┌──────────┐                    ┌─────────────┐
│          │                    │             │
│   [≡]    │ →  No space  →    │ ← Tooltip   │
│          │                    │   (Flipped) │
│          │                    │             │
└──────────┘ Viewport Edge      └─────────────┘
                                      Adjusts
```

### Tooltip Content Examples

```
╔═══════════════════════╦════════════════════════════════╗
║ Component             ║ Tooltip Content                ║
╠═══════════════════════╬════════════════════════════════╣
║ NavItem               ║ "Dashboard"                    ║
║                       ║ "Products"                     ║
║                       ║ "Settings"                     ║
╠═══════════════════════╬════════════════════════════════╣
║ NavGroup              ║ "Inventory (4 items)"          ║
║                       ║ "Sales (6 items)"              ║
║                       ║ "Reports (3 items)"            ║
╠═══════════════════════╬════════════════════════════════╣
║ SidebarFooter         ║ "John Doe"                     ║
║                       ║ "john@example.com"             ║
║                       ║ "View Profile • Settings"      ║
╚═══════════════════════╩════════════════════════════════╝
```

### Tooltip Styling Specifications

```
Tooltip Content:
- Background: bg-popover (var(--popover))
- Text: text-popover-foreground
- Border: 1px solid var(--border)
- Padding: 12px 16px (px-3 py-1.5)
- Font Size: 14px (text-sm)
- Border Radius: 6px (rounded-md)
- Shadow: 0 10px 38px -10px rgba(0,0,0,0.35)
- Max Width: 250px
- Z-Index: 50

Tooltip Arrow:
- Fill: var(--popover)
- Size: 8px
- Border: matches content border

Animation:
- Enter: fade-in + scale-95 to scale-100
- Exit: fade-out + scale-100 to scale-95
- Duration: 150ms enter, 100ms exit
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
```

### Expected Outcome
Tooltips display consistently when hovering over sidebar icons in collapsed mode. Tooltips appear after a 200ms delay, positioned to the right of the sidebar with 8px offset. Content clearly shows the item label and any additional context. Styling matches the design system with proper dark mode support. Tooltips are accessible, responsive to viewport constraints, and enhance navigation usability without adding clutter.

### Verification Checklist
- [ ] @radix-ui/react-tooltip package installed
- [ ] Custom Tooltip wrapper component created
- [ ] TooltipProvider added to layout/sidebar
- [ ] Tooltip delay set to 200ms
- [ ] Tooltip only renders when sidebar collapsed
- [ ] NavItem wrapped with Tooltip
- [ ] NavGroup wrapped with Tooltip
- [ ] SidebarFooter wrapped with Tooltip
- [ ] Tooltip positioned to right of sidebar
- [ ] Tooltip offset is 8px (sideOffset)
- [ ] Tooltip content shows item label
- [ ] NavGroup tooltip indicates sub-item count
- [ ] Styling matches design system
- [ ] Background color: bg-popover
- [ ] Text color: text-popover-foreground
- [ ] Border applied correctly
- [ ] Shadow applied for depth
- [ ] Font size text-sm
- [ ] Padding appropriate (px-3 py-1.5)
- [ ] Rounded corners applied
- [ ] Fade/scale animation working
- [ ] Tooltip hides on mouse leave
- [ ] Tooltip repositions near viewport edge
- [ ] Dark mode colors correct
- [ ] Accessible to screen readers
- [ ] Keyboard focus shows tooltip
- [ ] No performance issues on hover

---

## Task 29: Create Sidebar Footer

### Overview
Create a sidebar footer component displaying current user information including avatar, name, email, and quick action menu. The footer remains fixed at the bottom of the sidebar, adapts to collapsed state showing only the avatar, and provides access to user-related actions like profile settings, preferences, and logout.

### Dependencies
- Sidebar component exists (Task 15)
- Auth store with user data available
- Collapsed state implemented (Task 27)
- Tooltip component ready (Task 28)
- Avatar component available
- Dropdown menu component available

### Instructions

1. **Create SidebarFooter component file**
   - Navigate to `frontend/components/layout/Sidebar/` directory
   - Create new file `SidebarFooter.tsx`
   - Add file header comment with component description
   - Set up TypeScript imports

2. **Define SidebarFooter props interface**
   - Create `SidebarFooterProps` interface
   - Add `isCollapsed` property (boolean)
   - Add optional `className` property
   - Consider additional customization props

3. **Import required dependencies**
   - Import React core
   - Import useAuthStore from stores
   - Import Avatar component
   - Import DropdownMenu from Radix UI
   - Import relevant Lucide icons
   - Import Tooltip component

4. **Fetch user data from auth store**
   - Use useAuthStore hook
   - Get current user object
   - Extract name, email, avatar URL
   - Handle loading and error states

5. **Create component structure**
   - Fixed positioning at bottom of sidebar
   - Full width of sidebar (adapts to collapsed)
   - Border top separator
   - Padding for spacing
   - Background color matching sidebar

6. **Design expanded state layout**
   - Horizontal flex layout
   - Avatar on left (40px size)
   - User info column (name + email)
   - Dropdown trigger on right
   - Adequate padding and spacing

7. **Render user avatar**
   - Use Avatar component
   - Size: h-10 w-10 in expanded, h-8 w-8 in collapsed
   - Show user initials as fallback
   - Display profile image if available
   - Apply rounded-full

8. **Display user information**
   - Name: font-medium text-sm
   - Email: text-xs text-muted-foreground
   - Truncate long names/emails
   - Only show in expanded state
   - Hide with opacity transition

9. **Add dropdown menu trigger**
   - Icon button (ChevronUp or MoreVertical)
   - Only visible in expanded state
   - Triggers dropdown with user actions
   - Keyboard accessible

10. **Implement dropdown menu**
    - Use Radix UI DropdownMenu
    - Position: align-start side-top
    - Include menu items: Profile, Settings, Preferences, Logout
    - Add icons to menu items
    - Add divider before Logout
    - Handle menu item clicks

11. **Configure collapsed state**
    - Show only avatar (centered)
    - Hide name and email
    - Hide dropdown trigger
    - Wrap avatar in Tooltip
    - Tooltip shows name and email

12. **Add quick actions to menu**
    - View Profile: navigates to profile page
    - Settings: opens user settings
    - Preferences: opens preferences modal
    - Sign Out: triggers logout action
    - Each item has appropriate icon

13. **Implement logout handler**
    - Call auth store logout action
    - Show loading state during logout
    - Redirect to login on success
    - Handle logout errors
    - Clear local storage

14. **Style footer container**
    - Border-top: border-t
    - Background: inherits from sidebar
    - Padding: p-4 in expanded, p-3 in collapsed
    - Transition: all properties duration-300
    - Fixed: sticky bottom-0

15. **Add accessibility features**
    - Aria labels for buttons
    - Keyboard navigation support
    - Focus indicators
    - Screen reader announcements
    - Semantic HTML

16. **Handle edge cases**
    - No user data available (loading state)
    - Long names overflow (truncate)
    - Missing avatar (initials fallback)
    - Menu positioning at screen edges
    - Logout in progress state

17. **Update Sidebar component**
    - Import SidebarFooter
    - Render at bottom of sidebar container
    - Pass isCollapsed prop
    - Ensure proper positioning

18. **Export component**
    - Export SidebarFooter from file
    - Add to Sidebar index.ts exports
    - Export props type for reuse

### SidebarFooter Visual Layout

```
EXPANDED STATE (240px):
┌────────────────────────────────────────┐
│ ┌────┬──────────────────────┬────┐    │
│ │ ◉  │ John Doe             │ ⋮  │    │
│ │    │ john@example.com     │    │    │
│ └────┴──────────────────────┴────┘    │
└────────────────────────────────────────┘
  ↑    ↑                       ↑
Avatar  User Info             Menu

COLLAPSED STATE (72px):
┌──────────────┐
│              │
│      ◉       │  ← Avatar + Tooltip
│              │
└──────────────┘

DROPDOWN MENU (Expanded):
┌────────────────────────────────────────┐
│ ┌────┬──────────────────────┬────┐    │
│ │ ◉  │ John Doe             │ ⋮  │ ←─┐│
│ │    │ john@example.com     │    │   ││
│ └────┴──────────────────────┴────┘   ││
│              ┌──────────────────────┐ ││
│              │ [👤] View Profile    │ ││
│              │ [⚙] Settings         │ ││
│              │ [🎨] Preferences     │ ││
│              ├──────────────────────┤ ││
│              │ [↗] Sign Out         │←┘│
│              └──────────────────────┘  │
└────────────────────────────────────────┘
```

### Footer Component Structure

```
┌─────────────────────────────────────────────────────────┐
│              SidebarFooter Component                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Container (Fixed bottom, border-top)                   │
│    │                                                    │
│    ├─ if (isCollapsed)                                  │
│    │    │                                               │
│    │    └─ Tooltip                                      │
│    │         └─ Avatar (centered)                       │
│    │                                                    │
│    └─ else (expanded)                                   │
│         │                                               │
│         └─ Flex Container                               │
│              ├─ Avatar                                  │
│              ├─ User Info                               │
│              │    ├─ Name (font-medium)                 │
│              │    └─ Email (text-muted)                 │
│              │                                          │
│              └─ DropdownMenu                            │
│                   ├─ Trigger (MoreVertical icon)        │
│                   │                                     │
│                   └─ Content                            │
│                        ├─ View Profile                  │
│                        ├─ Settings                      │
│                        ├─ Preferences                   │
│                        ├─ Separator                     │
│                        └─ Sign Out                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Footer Menu Actions

```
╔════════════════╦═══════════════════╦══════════════════════╗
║ Action         ║ Icon              ║ Behavior             ║
╠════════════════╬═══════════════════╬══════════════════════╣
║ View Profile   ║ UserCircle        ║ Navigate to /profile ║
║ Settings       ║ Settings          ║ Navigate to /settings║
║ Preferences    ║ Sliders           ║ Open preferences     ║
║ Sign Out       ║ LogOut            ║ Logout + redirect    ║
╚════════════════╩═══════════════════╩══════════════════════╝
```

### Expected Outcome
Sidebar footer component displays at the bottom of the sidebar with current user information. In expanded mode, shows avatar, full name, email, and a dropdown menu button for quick actions. In collapsed mode, shows only the avatar with a tooltip containing user info. Dropdown menu provides access to profile, settings, preferences, and logout functionality. Component adapts smoothly to sidebar state changes and integrates with the auth store.

### Verification Checklist
- [ ] SidebarFooter.tsx file created
- [ ] Props interface defined with isCollapsed
- [ ] Auth store integration working
- [ ] User data fetched correctly (name, email, avatar)
- [ ] Avatar component renders correctly
- [ ] Avatar size: h-10 w-10 in expanded
- [ ] Avatar size: h-8 w-8 in collapsed
- [ ] User name displays in expanded mode
- [ ] User email displays in expanded mode
- [ ] Text truncates for long names/emails
- [ ] Dropdown menu trigger shows in expanded mode
- [ ] Dropdown menu positioned correctly (top, start)
- [ ] Menu items: Profile, Settings, Preferences, Logout
- [ ] Icons added to all menu items
- [ ] Divider before Logout item
- [ ] Logout handler calls auth store logout
- [ ] Navigation works for menu items
- [ ] Collapsed mode shows centered avatar only
- [ ] Tooltip shows on avatar hover when collapsed
- [ ] Tooltip content includes name and email
- [ ] Footer fixed at bottom of sidebar
- [ ] Border-top separator visible
- [ ] Padding appropriate in both states
- [ ] Background color matches sidebar
- [ ] Transitions smooth between states
- [ ] Keyboard navigation functional
- [ ] Focus indicators visible
- [ ] Component exported from index.ts

---

## Task 30: Add Permission-Based Visibility

### Overview
Implement permission-based filtering of navigation menu items using the auth store's permission checking utilities. Menu items and groups are conditionally rendered based on the current user's assigned permissions, ensuring users only see navigation options they have access to. This provides security through UI enforcement and improves UX by hiding irrelevant features.

### Dependencies
- Auth store with permission checking (hasPermission)
- Navigation menu items defined (Task 21)
- NavItem component exists (Task 22)
- NavGroup component exists (Task 23)
- All sidebar components ready
- Permission constants defined

### Instructions

1. **Review permission system**
   - Understand auth store permission structure
   - Review hasPermission method signature
   - Check hasAnyPermission method availability
   - Understand permission string format

2. **Define permission constants**
   - Create file for permission string constants
   - Define permissions by module (e.g., 'inventory.view')
   - Group permissions logically
   - Export for reuse across application
   - Consider using enums or const objects

3. **Update navigation menu items structure**
   - Add `permission` property to each menu item
   - Single permission: string
   - Multiple permissions (any): string[]
   - Multiple permissions (all): object with `all` array
   - Optional items have no permission requirement

4. **Assign permissions to menu items**
   - Dashboard: 'dashboard.view'
   - Products: 'inventory.view_product'
   - Categories: 'inventory.view_category'
   - Sales Orders: 'sales.view_order'
   - Invoices: 'sales.view_invoice'
   - Purchase Orders: 'purchasing.view_po'
   - Employees: 'hr.view_employee'
   - Settings: 'settings.view'

5. **Assign permissions to NavGroups**
   - Group visible if user has ANY child permission
   - Store child permissions array in group config
   - Check permissions before rendering group
   - Empty groups (all children hidden) should hide

6. **Create permission check utility**
   - Create helper function `checkMenuItemPermission`
   - Accept menu item and user permissions
   - Handle single permission string
   - Handle array of permissions (any match)
   - Handle object with `all` requirement
   - Return boolean result

7. **Integrate with NavItem component**
   - Accept permission prop
   - Use auth store to check permission
   - Return null if no permission
   - Render normally if permission granted
   - Handle loading state

8. **Integrate with NavGroup component**
   - Check group-level permission
   - Filter children by their permissions
   - Hide group if no children visible
   - Maintain expansion state logic
   - Handle permission changes dynamically

9. **Integrate with SubNavItem component**
   - Similar to NavItem implementation
   - Check permission before render
   - Return null if denied
   - Maintain active state logic

10. **Filter navigation menu items**
    - Create filtered menu items array
    - Use permission check utility
    - Filter at render time or memoize
    - Pass filtered array to SidebarNav
    - Update when user permissions change

11. **Handle permission loading state**
    - Show skeleton or loading state
    - Don't flash hidden items during load
    - Wait for auth store initialization
    - Handle auth state changes

12. **Implement NavGroup visibility logic**
    - NavGroup visible only if:
      - User has group-level permission, OR
      - At least one child item has permission
    - Empty groups should not render
    - Update visibility reactively

13. **Add permission error handling**
    - Handle missing permission data gracefully
    - Default to hiding items if unsure
    - Log permission check failures
    - Don't expose permission strings to users

14. **Test permission scenarios**
    - User with full permissions (admin)
    - User with limited module access
    - User with read-only permissions
    - User with no permissions (minimal UI)
    - Permission changes during session

15. **Optimize performance**
    - Memoize permission checks
    - Use useMemo for filtered menu items
    - Avoid unnecessary re-renders
    - Cache permission results if appropriate

16. **Document permission requirements**
    - Document each menu item's permission
    - Create permission mapping reference
    - Add comments in navigation config
    - Update role management docs

### Permission Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│              Permission Check Flow                         │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────────────────────┐
        │ Auth Store (User Permissions)    │
        │                                  │
        │ permissions: [                   │
        │   'dashboard.view',              │
        │   'inventory.view_product',      │
        │   'sales.view_order',            │
        │   'hr.view_employee'             │
        │ ]                                │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ Navigation Menu Items            │
        │                                  │
        │ [                                │
        │   {                              │
        │     label: "Dashboard",          │
        │     permission: "dashboard.view" │
        │   },                             │
        │   {                              │
        │     label: "Products",           │
        │     permission: "inventory.view" │
        │   }                              │
        │ ]                                │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ checkMenuItemPermission()        │
        │                                  │
        │ For each item:                   │
        │   if (item.permission)           │
        │     hasPermission(permission)    │
        │   else                           │
        │     return true                  │
        └──────────────┬───────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
    ┌─────────┐                ┌──────────┐
    │ Allowed │                │ Denied   │
    └────┬────┘                └────┬─────┘
         │                          │
         ▼                          ▼
    Render Item                Return null
```

### Permission Configuration Examples

```typescript
// Example Menu Item Structures (Conceptual - No Code)

Single Permission:
{
  label: "Products",
  href: "/dashboard/inventory/products",
  icon: PackageIcon,
  permission: "inventory.view_product"  // Single string
}

Multiple Permissions (Any):
{
  label: "Orders",
  href: "/dashboard/sales/orders",
  icon: ShoppingCartIcon,
  permission: ["sales.view_order", "sales.manage_order"]  // Array
}

Multiple Permissions (All):
{
  label: "System Settings",
  href: "/dashboard/settings/system",
  icon: ServerIcon,
  permission: {
    all: ["settings.view", "settings.manage_system"]  // All required
  }
}

No Permission (Public):
{
  label: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboardIcon
  // No permission property - always visible
}

NavGroup with Children:
{
  label: "Inventory",
  icon: PackageIcon,
  permission: ["inventory.view"],  // Group-level permission
  children: [
    {
      label: "Products",
      href: "/dashboard/inventory/products",
      permission: "inventory.view_product"
    },
    {
      label: "Categories",
      href: "/dashboard/inventory/categories",
      permission: "inventory.view_category"
    }
  ]
}
```

### Permission Matrix Example

```
╔════════════════════╦═══════════════════════╦══════════════════╗
║ Menu Item          ║ Required Permission   ║ Fallback Visible ║
╠════════════════════╬═══════════════════════╬══════════════════╣
║ Dashboard          ║ (none)                ║ Yes              ║
║ Products           ║ inventory.view        ║ No               ║
║ Categories         ║ inventory.view        ║ No               ║
║ Sales Orders       ║ sales.view_order      ║ No               ║
║ Invoices           ║ sales.view_invoice    ║ No               ║
║ Customers          ║ sales.view_customer   ║ No               ║
║ Purchase Orders    ║ purchasing.view_po    ║ No               ║
║ Vendor Bills       ║ purchasing.view_bill  ║ No               ║
║ Employees          ║ hr.view_employee      ║ No               ║
║ Payroll            ║ hr.view_payroll       ║ No               ║
║ User Settings      ║ (none)                ║ Yes              ║
║ System Settings    ║ settings.manage       ║ No               ║
╚════════════════════╩═══════════════════════╩══════════════════╝
```

### NavGroup Visibility Logic

```
┌──────────────────────────────────────────────────────────┐
│        NavGroup Visibility Decision Tree                 │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │ Does group have permission?   │
          └───────────┬───────────────────┘
                      │
              ┌───────┴────────┐
              │                │
           Yes│                │No
              ▼                ▼
         Check User      Check Children
         Permission      Permissions
              │                │
       ┌──────┴──────┐   ┌─────┴──────┐
       │             │   │            │
    Granted     Denied  Any       None
       │             │   Child      │
       │             │   Granted    │
       ▼             │   │          │
    Show Group       │   ▼          ▼
       │             └─►Show    Hide Group
       │                Group
       ▼                  │
    Expand if             │
    child active          │
       │                  │
       └──────────────────┘
              │
              ▼
       Render Visible
       Children Only
```

### Expected Outcome
Navigation menu items are filtered based on current user permissions. Users only see menu items and groups they have access to. Empty groups (all children hidden) do not render. Permission checks happen reactively when user permissions change. The system fails securely by hiding items when permission status is uncertain. Performance is optimized through memoization. The sidebar provides a clean, permission-appropriate interface for each user role.

### Verification Checklist
- [ ] Permission constants file created and exported
- [ ] Permissions defined for all modules
- [ ] Permission property added to menu item types
- [ ] All menu items assigned appropriate permissions
- [ ] NavGroups assigned group-level permissions
- [ ] checkMenuItemPermission utility created
- [ ] Utility handles single permission string
- [ ] Utility handles permission arrays (any)
- [ ] Utility handles permission objects (all required)
- [ ] NavItem checks permission before render
- [ ] NavGroup checks permission before render
- [ ] SubNavItem checks permission before render
- [ ] NavGroup filters children by permissions
- [ ] Empty NavGroups (no visible children) hide
- [ ] Auth store hasPermission method integrated
- [ ] Permission loading state handled
- [ ] Items don't flash during auth initialization
- [ ] Menu updates when permissions change
- [ ] useMemo optimization applied
- [ ] Admin user sees all items (full permissions)
- [ ] Limited user sees only permitted items
- [ ] Read-only user has appropriate access
- [ ] Permission checks fail securely (hide on error)
- [ ] Console logs no permission errors
- [ ] Performance acceptable (no lag)
- [ ] Documentation updated with permission mapping

---

## Task 31: Add Sidebar Resize Animation

### Overview
Polish the sidebar collapse/expand transition with smooth CSS animations for width changes, opacity fades for text content, and coordinated transitions across all sidebar elements. The animation system creates a professional, fluid user experience when toggling between expanded and collapsed states, avoiding jarring layout shifts.

### Dependencies
- Sidebar component exists (Task 15)
- Collapsed state implemented (Task 27)
- All sidebar sub-components created
- Tailwind CSS configured
- CSS transition utilities available

### Instructions

1. **Define animation timing constants**
   - Main transition duration: 300ms
   - Text fade duration: 200ms
   - Icon transition duration: 250ms
   - Easing function: ease-in-out
   - Document in CSS or config file

2. **Apply width transition to Sidebar**
   - Add transition-all to sidebar container
   - Set duration-300 for width changes
   - Use ease-in-out easing function
   - Ensure smooth from 240px to 72px
   - Prevent layout shift of sibling content

3. **Implement text opacity transitions**
   - Add transition-opacity to all text elements
   - Duration: 200ms (faster than width)
   - Fade out before collapse completes
   - Fade in after expand completes
   - Use opacity-0 for hidden state

4. **Coordinate icon positioning transitions**
   - Icons transition from left-aligned to centered
   - Use transition-all on icon containers
   - Duration: 250ms (slightly slower than text)
   - Transform: translateX for smooth movement
   - Scale if size changes

5. **Add chevron rotation animation**
   - NavGroup chevron rotates on expand/collapse
   - Transform: rotate(0deg) to rotate(180deg)
   - Duration: 200ms
   - Easing: ease-in-out
   - Synchronized with group expansion

6. **Implement NavGroup children animation**
   - Children slide down on expand
   - Children slide up on collapse
   - Use max-height transition with overflow-hidden
   - Duration: 300ms
   - Stagger children with incremental delays (optional)

7. **Add tooltip fade animation**
   - Tooltips fade in when sidebar collapsed
   - Tooltips fade out when sidebar expands
   - Duration: 150ms
   - Opacity transition
   - Slight scale effect (scale-95 to scale-100)

8. **Configure main content area transition**
   - Content area margin/padding adjusts with sidebar
   - Synchronize with sidebar width transition
   - Same duration: 300ms
   - Prevents content jumping
   - Smooth text reflow

9. **Add left border transition**
   - Active state left border animates smoothly
   - Width transition: 0px to 4px or vice versa
   - Color transition if needed
   - Duration: 200ms
   - Prevents flash

10. **Implement footer transition**
    - Footer content transitions between layouts
    - User info fades out/in
    - Avatar repositions smoothly
    - Duration: 300ms synchronized with sidebar
    - Dropdown trigger fades appropriately

11. **Handle logo transition**
    - Full logo fades out during collapse
    - Logo mark fades in during collapse
    - Cross-fade effect for smooth switch
    - Duration: 200ms
    - Prevent logo jump

12. **Add background color transitions**
    - Hover states transition smoothly
    - Active states transition smoothly
    - Duration: 150ms
    - Applies to all interactive elements
    - Consistent across components

13. **Prevent animation on initial load**
    - Disable transitions for first render
    - Add transitions after component mounts
    - Use state flag or class toggle
    - Prevents animation during hydration

14. **Test animation performance**
    - Use Chrome DevTools Performance tab
    - Check for layout thrashing
    - Verify 60fps during transitions
    - Optimize if frame drops occur
    - Test on lower-end devices

15. **Add reduced motion support**
    - Respect prefers-reduced-motion media query
    - Disable animations for users with preference
    - Use CSS media query or JS detection
    - Maintain functionality without animation
    - Consider duration: 0ms override

### Animation Timeline Diagram

```
┌────────────────────────────────────────────────────────────┐
│        Sidebar Collapse Animation Timeline                 │
│        (Expanded → Collapsed, Total: 300ms)                │
└────────────────────────────────────────────────────────────┘

t=0ms     ▼ User clicks collapse button
          │
          ├─ Sidebar width: 240px → 72px (300ms)
          ├─ Text opacity: 100% → 0% (200ms, fast fade)
          ├─ Icons position: left → center (250ms)
          ├─ Content margin: 240px → 72px (300ms)
          └─ Tooltips: prepare for display

t=50ms    │
          └─ Text elements starting to fade

t=100ms   │
          └─ Icons starting to reposition

t=150ms   │
          └─ Text fully faded (hidden)

t=200ms   │
          ├─ Text elements hidden (display: none)
          └─ Icons continuing movement

t=250ms   │
          ├─ Icons reaching center position
          └─ Width transition 80% complete

t=300ms   ▼ Animation complete
          ├─ Width: 72px (final)
          ├─ Icons: centered (final)
          ├─ Tooltips: enabled
          └─ Layout: stable

──────────────────────────────────────────────────────────────

EXPAND ANIMATION (Collapsed → Expanded)

t=0ms     ▼ User clicks expand button
          │
          ├─ Sidebar width: 72px → 240px (300ms)
          ├─ Icons position: center → left (250ms)
          ├─ Tooltips: disabled immediately
          └─ Content margin: 72px → 240px (300ms)

t=100ms   │
          └─ Icons repositioning to left

t=150ms   │
          ├─ Width transition 50% complete
          └─ Space available for text

t=200ms   │
          ├─ Text opacity: 0% → 100% (200ms, delayed start)
          └─ Text elements fade in

t=250ms   │
          └─ Icons at left position

t=300ms   ▼ Animation complete
          ├─ Width: 240px (final)
          ├─ Text: fully visible
          └─ Layout: stable
```

### CSS Transition Specifications

```
╔═══════════════════════╦══════════╦═══════════════╦══════════╗
║ Element               ║ Property ║ Duration      ║ Easing   ║
╠═══════════════════════╬══════════╬═══════════════╬══════════╣
║ Sidebar Container     ║ width    ║ 300ms         ║ ease-io  ║
║ Text Labels           ║ opacity  ║ 200ms         ║ ease-io  ║
║ Icons                 ║ all      ║ 250ms         ║ ease-io  ║
║ Active Left Border    ║ width    ║ 200ms         ║ ease-io  ║
║ Background Colors     ║ bg       ║ 150ms         ║ ease-io  ║
║ NavGroup Chevron      ║ rotate   ║ 200ms         ║ ease-io  ║
║ NavGroup Children     ║ height   ║ 300ms         ║ ease-io  ║
║ Tooltips              ║ opacity  ║ 150ms         ║ ease-io  ║
║ Logo                  ║ opacity  ║ 200ms         ║ ease-io  ║
║ Footer Content        ║ all      ║ 300ms         ║ ease-io  ║
║ Main Content Margin   ║ margin   ║ 300ms         ║ ease-io  ║
╚═══════════════════════╩══════════╩═══════════════╩══════════╝

Note: ease-io = ease-in-out
```

### Tailwind Classes for Transitions

```
Sidebar Container:
- transition-all duration-300 ease-in-out

Text Elements (Labels):
- transition-opacity duration-200 ease-in-out
- opacity-0 (collapsed) / opacity-100 (expanded)

Icons:
- transition-all duration-250 ease-in-out
- justify-start (expanded) / justify-center (collapsed)

Hover/Active Backgrounds:
- transition-colors duration-150 ease-in-out

NavGroup Chevron:
- transition-transform duration-200 ease-in-out
- rotate-0 (collapsed) / rotate-180 (expanded)

Reduced Motion:
- motion-reduce:transition-none
- motion-reduce:duration-0
```

### Animation State Machine

```
┌──────────────────────────────────────────────────────────┐
│            Sidebar Animation States                      │
└──────────────────────────────────────────────────────────┘

        ┌─────────────┐
        │   INITIAL   │ (No animation on mount)
        │  (Expanded) │
        └──────┬──────┘
               │
    User clicks toggle
               │
               ▼
        ┌─────────────┐
        │ COLLAPSING  │ (Animations active)
        │  (300ms)    │
        └──────┬──────┘
               │
    Animation complete
               │
               ▼
        ┌─────────────┐
        │  COLLAPSED  │ (Stable state)
        │  (72px)     │
        └──────┬──────┘
               │
    User clicks toggle
               │
               ▼
        ┌─────────────┐
        │  EXPANDING  │ (Animations active)
        │  (300ms)    │
        └──────┬──────┘
               │
    Animation complete
               │
               ▼
        ┌─────────────┐
        │  EXPANDED   │ (Stable state)
        │  (240px)    │
        └──────┬──────┘
               │
               │ (cycle repeats)
               │
               └──────────────────┐
                                 │
                        Back to COLLAPSING
```

### Expected Outcome
Sidebar transitions smoothly between expanded and collapsed states with coordinated animations across all elements. Width changes are fluid, text fades gracefully, icons reposition smoothly, and the overall experience feels polished and professional. No layout jumps or jank occurs. Animations respect user preferences for reduced motion. Performance is maintained at 60fps on typical hardware.

### Verification Checklist
- [ ] Sidebar width transition smooth (300ms)
- [ ] Width changes from 240px to 72px fluidly
- [ ] Easing function ease-in-out applied
- [ ] Text labels fade out before collapse completes
- [ ] Text labels fade in after expand starts
- [ ] Icon repositioning smooth (250ms)
- [ ] Icons center correctly in collapsed state
- [ ] Active left border transitions smoothly
- [ ] Background color transitions smooth (150ms)
- [ ] Hover effects transition smoothly
- [ ] NavGroup chevron rotates correctly
- [ ] NavGroup children expand/collapse smoothly
- [ ] Tooltips fade in/out appropriately
- [ ] Logo transitions between full and mark
- [ ] Footer content adapts smoothly
- [ ] Main content area margin synchronized
- [ ] No layout shift during transition
- [ ] No jank or stuttering
- [ ] 60fps maintained (check DevTools)
- [ ] No animations on initial page load
- [ ] Reduced motion support implemented
- [ ] prefers-reduced-motion disables animations
- [ ] Functionality maintained without animations
- [ ] All transitions use hardware acceleration
- [ ] No console warnings or errors

---

## Task 32: Create Sidebar Keyboard Navigation

### Overview
Implement comprehensive keyboard navigation for the sidebar, allowing users to navigate menu items using arrow keys, activate items with Enter, expand/collapse groups, toggle sidebar state, and return focus to content. Keyboard navigation is essential for accessibility, power users, and compliance with WCAG guidelines.

### Dependencies
- Sidebar component exists (Task 15)
- All navigation components created (Tasks 22-24)
- Navigation menu items defined (Task 21)
- Focus management utilities available
- React key event handling

### Instructions

1. **Define keyboard shortcuts**
   - Arrow Down: Move focus to next item
   - Arrow Up: Move focus to previous item
   - Arrow Right: Expand NavGroup or enter sub-items
   - Arrow Left: Collapse NavGroup or return to parent
   - Enter: Activate focused item (navigate)
   - Space: Expand/collapse focused NavGroup
   - Escape: Return focus to main content area
   - Ctrl/Cmd + B: Toggle sidebar collapsed state

2. **Create keyboard navigation context**
   - Create React context for keyboard state
   - Track currently focused item index
   - Track focus path (for nested items)
   - Provide navigation methods
   - Share state across sidebar components

3. **Build flat navigation items array**
   - Flatten nested menu structure
   - Include all visible items in order
   - Account for expanded/collapsed groups
   - Update when groups expand/collapse
   - Filter by permissions

4. **Implement focus management**
   - Track focus index in state
   - Apply focus programmatically with refs
   - Create ref for each navigable item
   - Use useRef array or Map structure
   - Update focus on keyboard events

5. **Handle Arrow Down key**
   - Move focus to next visible item
   - Wrap to first item at end
   - Skip hidden or disabled items
   - Update focus state
   - Announce change to screen readers

6. **Handle Arrow Up key**
   - Move focus to previous visible item
   - Wrap to last item at start
   - Skip hidden or disabled items
   - Update focus state
   - Announce change to screen readers

7. **Handle Arrow Right key**
   - If focused on collapsed NavGroup: expand group
   - If focused on expanded NavGroup: move focus to first child
   - If focused on NavItem: no action (or navigate)
   - Update group expansion state
   - Update focus as needed

8. **Handle Arrow Left key**
   - If focused on SubNavItem: move focus to parent NavGroup
   - If focused on expanded NavGroup: collapse group
   - If focused on collapsed NavGroup: no action
   - Update group expansion state
   - Update focus appropriately

9. **Handle Enter key**
   - If focused on NavItem or SubNavItem: trigger navigation
   - If focused on NavGroup: expand/collapse group
   - Call onClick handler or router.push
   - Maintain focus after navigation (optional)
   - Provide feedback (visual or audible)

10. **Handle Space key**
    - If focused on NavGroup: toggle expansion
    - Similar to Enter for groups
    - Prevent page scroll
    - Update expansion state
    - Maintain focus

11. **Handle Escape key**
    - Return focus to main content area
    - Collapse any expanded groups (optional)
    - Clear focus state
    - Find and focus main content element
    - Useful for keyboard-only users

12. **Implement sidebar toggle shortcut**
    - Listen for Ctrl/Cmd + B globally
    - Toggle sidebar collapsed state
    - Maintain or adjust focus appropriately
    - Announce state change
    - Works from anywhere in app

13. **Add focus indicators**
    - Use ring-2 ring-ring for focused items
    - Ensure sufficient contrast
    - Visible in both light and dark modes
    - Distinct from hover state
    - Use :focus-visible for keyboard only

14. **Update NavItem for keyboard support**
    - Accept focused prop
    - Apply focus styles when focused
    - Provide ref for focus management
    - Handle Enter key when focused
    - Support tab index

15. **Update NavGroup for keyboard support**
    - Accept focused prop
    - Handle Enter/Space to expand
    - Handle Arrow Right to expand
    - Handle Arrow Left to collapse
    - Provide ref for focus management

16. **Update SubNavItem for keyboard support**
    - Similar to NavItem
    - Handle Arrow Left to return to parent
    - Provide ref for focus management
    - Support tab index

17. **Implement skip to content**
    - Add "Skip to main content" link at top
    - Hidden until focused
    - Allows bypassing sidebar navigation
    - WCAG requirement
    - Focus main content on activation

18. **Add ARIA attributes**
    - role="navigation" on sidebar
    - aria-label="Main navigation"
    - aria-current="page" on active item
    - aria-expanded on NavGroups
    - aria-haspopup where applicable

19. **Add screen reader announcements**
    - Use aria-live regions for updates
    - Announce focus changes (optional)
    - Announce expansion state changes
    - Announce sidebar collapse/expand
    - Polite or assertive as appropriate

20. **Test keyboard navigation flow**
    - Navigate entire menu with keyboard only
    - Test all shortcut keys
    - Verify focus visible at all times
    - Test with screen reader
    - Validate WCAG 2.1 Level AA compliance

### Keyboard Navigation Flow

```
┌──────────────────────────────────────────────────────────┐
│          Keyboard Navigation Structure                   │
└──────────────────────────────────────────────────────────┘

Focus Order (Flattened):
1. Dashboard (NavItem)
2. Inventory (NavGroup)
   2a. Products (SubNavItem) - if expanded
   2b. Categories (SubNavItem) - if expanded
3. Sales (NavGroup)
   3a. Orders (SubNavItem) - if expanded
   3b. Invoices (SubNavItem) - if expanded
4. Settings (NavItem)

Arrow Down: 1 → 2 → 2a → 2b → 3 → 3a → 3b → 4 → 1 (wrap)
Arrow Up:   1 → 4 → 3b → 3a → 3 → 2b → 2a → 2 → 1 (wrap)

Arrow Right on NavGroup (collapsed):
  Inventory → [Expand] → (focus stays on Inventory)

Arrow Right on NavGroup (expanded):
  Inventory → Products (first child)

Arrow Left on SubNavItem:
  Products → Inventory (parent)

Arrow Left on NavGroup (expanded):
  Inventory → [Collapse] → (focus stays on Inventory)
```

### Keyboard Event Handling

```
┌─────────────────────────────────────────────────────────┐
│        Keyboard Event Handler (Sidebar Level)           │
└─────────────────────────────────────────────────────────┘

onKeyDown(event) {
  switch (event.key) {
    case 'ArrowDown':
      → moveFocusNext()
      → event.preventDefault()
      
    case 'ArrowUp':
      → moveFocusPrevious()
      → event.preventDefault()
      
    case 'ArrowRight':
      → if (focusedItem is NavGroup)
          if (collapsed) expandGroup()
          else moveFocusToFirstChild()
      → event.preventDefault()
      
    case 'ArrowLeft':
      → if (focusedItem is SubNavItem)
          moveFocusToParent()
      → else if (focusedItem is NavGroup && expanded)
          collapseGroup()
      → event.preventDefault()
      
    case 'Enter':
      → activateFocusedItem()
      → event.preventDefault()
      
    case ' ' (Space):
      → if (focusedItem is NavGroup)
          toggleGroupExpansion()
      → event.preventDefault()
      
    case 'Escape':
      → returnFocusToMainContent()
      → event.preventDefault()
  }
}

Global Shortcut:
onKeyDown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
    toggleSidebarCollapse()
    event.preventDefault()
  }
}
```

### Focus Management State

```
┌──────────────────────────────────────────────────────────┐
│           Focus Management State Structure               │
└──────────────────────────────────────────────────────────┘

State:
{
  focusedIndex: number,        // Index in flat items array
  focusPath: string[],         // Path to focused item
  flatItems: MenuItem[],       // Flattened, visible items
  itemRefs: Map<string, Ref>   // Refs for each item
}

Methods:
- getFlatItems(): Build flat array from nested structure
- moveFocusNext(): Increment index, wrap at end
- moveFocusPrevious(): Decrement index, wrap at start
- setFocus(index): Programmatically set focus
- activateItem(index): Trigger item action
- expandGroup(id): Expand group, rebuild flat items
- collapseGroup(id): Collapse group, rebuild flat items

Hooks:
- useKeyboardNav(): Consume context
- useFocusRef(id): Register item ref
- useArrowKeys(): Arrow key handling
```

### Accessibility Attributes

```
╔══════════════════╦════════════════════════════════════════════╗
║ Element          ║ ARIA Attributes                            ║
╠══════════════════╬════════════════════════════════════════════╣
║ Sidebar          ║ role="navigation"                          ║
║                  ║ aria-label="Main navigation"               ║
║                  ║ aria-orientation="vertical"                ║
╠══════════════════╬════════════════════════════════════════════╣
║ NavItem          ║ role="link" (if link)                      ║
║                  ║ aria-current="page" (if active)            ║
║                  ║ tabIndex={focused ? 0 : -1}                ║
╠══════════════════╬════════════════════════════════════════════╣
║ NavGroup         ║ role="button" (header)                     ║
║                  ║ aria-expanded={isExpanded}                 ║
║                  ║ aria-controls="group-children-id"          ║
║                  ║ tabIndex={focused ? 0 : -1}                ║
╠══════════════════╬════════════════════════════════════════════╣
║ SubNavItem       ║ role="link"                                ║
║                  ║ aria-current="page" (if active)            ║
║                  ║ tabIndex={focused ? 0 : -1}                ║
╠══════════════════╬════════════════════════════════════════════╣
║ Children         ║ role="group"                               ║
║ Container        ║ id="group-children-id"                     ║
║                  ║ aria-labelledby="group-header-id"          ║
╠══════════════════╬════════════════════════════════════════════╣
║ Skip Link        ║ href="#main-content"                       ║
║                  ║ class="sr-only focus:not-sr-only"          ║
╚══════════════════╩════════════════════════════════════════════╝
```

### Expected Outcome
Complete keyboard navigation system for sidebar allowing users to navigate all menu items, expand/collapse groups, activate items, and manage focus entirely with keyboard. Focus indicators are clearly visible. Arrow keys move through items in logical order. Enter activates items. Escape returns focus to main content. Global shortcut (Ctrl/Cmd + B) toggles sidebar from anywhere. System is fully accessible, WCAG compliant, and provides excellent UX for keyboard users.

### Verification Checklist
- [ ] Keyboard navigation context created
- [ ] Flat navigation items array built correctly
- [ ] Focus management state implemented
- [ ] Item refs registered for all navigable items
- [ ] Arrow Down moves to next item
- [ ] Arrow Up moves to previous item
- [ ] Arrow Right expands NavGroup
- [ ] Arrow Right moves into expanded group children
- [ ] Arrow Left collapses NavGroup
- [ ] Arrow Left returns from SubNavItem to parent
- [ ] Enter activates NavItem navigation
- [ ] Enter toggles NavGroup expansion
- [ ] Space toggles NavGroup expansion
- [ ] Escape returns focus to main content
- [ ] Ctrl/Cmd + B toggles sidebar collapse
- [ ] Focus wraps from last to first item
- [ ] Focus wraps from first to last item
- [ ] Focus indicators visible (ring-2)
- [ ] Focus visible in light and dark modes
- [ ] Focus distinct from hover state
- [ ] Hidden items skipped during navigation
- [ ] Permission-filtered items skipped
- [ ] NavGroup focus works correctly
- [ ] SubNavItem focus works correctly
- [ ] Focus maintained during group expansion
- [ ] Focus updates when groups collapse
- [ ] Tab key navigation works logically
- [ ] Skip to content link present and functional
- [ ] ARIA role="navigation" applied
- [ ] aria-label on sidebar
- [ ] aria-current on active items
- [ ] aria-expanded on NavGroups
- [ ] aria-controls linking groups to children
- [ ] Screen reader announces focus changes
- [ ] Screen reader announces expansions
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with NVDA or JAWS screen reader
- [ ] WCAG 2.1 Level AA compliant

---

## Summary

This document provided comprehensive implementation guidance for tasks 24-32, completing the sidebar component with advanced features. The sidebar now supports nested navigation with SubNavItems, active state styling with visual feedback, a complete icon system using Lucide icons, a collapsed state for space efficiency, tooltips for collapsed mode, a user footer with quick actions, permission-based visibility filtering, smooth resize animations, and full keyboard navigation for accessibility.

These features create a professional, accessible, and user-friendly navigation system that serves as the backbone of the ERP dashboard interface. The sidebar adapts to user permissions, responds to user interactions fluidly, and provides multiple navigation methods to accommodate different user preferences and accessibility needs.

**Total Estimated Time for Tasks 24-32:** ~5 hours

**Next Steps:** Proceed to [Group-C: Header Component](../Group-C_Header-Component/) to build the top navigation bar with breadcrumbs, search, notifications, and user menu.
