# Tasks 15-24: Sidebar, Theme & Modals

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** B - UI State Stores  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-30_Notifications-CommandPalette.md](02_Tasks-25-30_Notifications-CommandPalette.md)

---

## Document Overview

This document creates the UI state store for managing application interface state. Implements sidebar state for navigation control, theme management for light/dark/system modes, and modal registry for managing multiple modal dialogs. These UI state components form the foundation of the dashboard's interactive experience.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create UI Store | Low | 10 min |
| 16 | Define Sidebar State | Low | 15 min |
| 17 | Create toggleSidebar Action | Low | 10 min |
| 18 | Create setActiveMenu Action | Low | 10 min |
| 19 | Define Theme State | Low | 15 min |
| 20 | Create setTheme Action | Low | 15 min |
| 21 | Define Modal State | Low | 20 min |
| 22 | Create openModal Action | Low | 15 min |
| 23 | Create closeModal Action | Low | 10 min |
| 24 | Create closeAllModals Action | Low | 10 min |

---

## Task 15: Create UI Store

### Overview
Create the foundational UI store file that will manage all user interface state including sidebar visibility, theme preferences, modal dialogs, notifications, and command palette state. This centralized UI state management ensures consistent interface behavior across the application.

### Dependencies
- Task 14: Verify Zustand Setup (Group A)
- createStore utility available

### Instructions

1. **Create uiStore.ts file**
   - Navigate to store/ directory
   - Create new file named `uiStore.ts`
   - Add module documentation

2. **Import required utilities**
   - Import createStore from utils
   - Import necessary types
   - Import type definitions

3. **Define UIState interface**
   - Sidebar state properties
   - Theme state properties
   - Modal state properties
   - Notification state properties
   - Command palette state properties

4. **Define UIActions interface**
   - Sidebar action methods
   - Theme action methods
   - Modal action methods
   - Notification action methods
   - Command palette action methods

5. **Create combined UIStore type**
   - Merge UIState and UIActions
   - Export for type safety
   - Use in store creation

6. **Initialize store with createStore**
   - Use createStore utility
   - Pass store name for DevTools
   - Enable persistence
   - Configure initial state

7. **Configure persistence**
   - Persist theme preference
   - Persist sidebar collapsed state
   - Exclude modals and notifications
   - Exclude temporary state

### UI Store Responsibilities

| Domain | State Managed | Actions Provided |
|--------|---------------|------------------|
| Sidebar | Collapsed state, active menu | Toggle, set menu |
| Theme | Light/dark/system preference | Set theme |
| Modals | Open modal registry | Open, close, close all |
| Notifications | Notification queue | Add, remove, clear |
| Command Palette | Open/closed state | Toggle |

### Store Structure

**State Properties**
```
Sidebar state (isCollapsed, activeMenu)
Theme state (mode: light/dark/system)
Modal state (modals: Map)
Notification state (notifications: array)
Command palette state (isOpen: boolean)
```

**Action Methods**
```
Sidebar actions (toggle, setMenu)
Theme actions (setTheme)
Modal actions (open, close, closeAll)
Notification actions (add, remove, clear)
Command palette actions (toggle)
```

### Why Zustand for UI State?

**Advantages**
- Lightweight and fast
- No prop drilling needed
- Easy to use from any component
- Persistence built-in
- Excellent DevTools support
- TypeScript-friendly

**UI State Characteristics**
- Frequently accessed
- Needs global availability
- Benefits from persistence
- Requires fast updates
- Not fetched from API

### Persistence Strategy

**What to Persist**
- Theme preference (user choice)
- Sidebar collapsed state (preference)
- Active menu selection (optional)

**What NOT to Persist**
- Modal open states (temporary)
- Notifications (transient)
- Command palette state (temporary)

**Partialize Configuration**
```
Select only theme and sidebar state
Exclude modals array
Exclude notifications array
Exclude command palette state
```

### Store Naming Convention

**DevTools Name**
```
"LCC/UI"
Appears in Redux DevTools
Easy to identify
Consistent with other stores
```

### Initial State Values

| Property | Initial Value | Rationale |
|----------|--------------|-----------|
| isCollapsed | false | Sidebar open by default |
| activeMenu | null | No menu selected initially |
| theme | 'system' | Respect OS preference |
| modals | new Map() | No modals open |
| notifications | [] | No notifications |
| commandPaletteOpen | false | Palette closed |

### Expected Outcome
- uiStore.ts file created
- Store structure defined
- TypeScript types established
- Persistence configured
- Foundation ready for actions

### Verification Checklist
- [ ] uiStore.ts file created
- [ ] UIState interface defined
- [ ] UIActions interface defined
- [ ] UIStore type exported
- [ ] createStore utility used
- [ ] Persistence configured
- [ ] DevTools name set

---

## Task 16: Define Sidebar State

### Overview
Define the state structure for sidebar navigation management including collapse state and active menu tracking. The sidebar state controls the main navigation panel visibility and highlights the currently selected menu section.

### Dependencies
- Task 15: Create UI Store

### Instructions

1. **Add sidebar state to UIState**
   - Define isCollapsed property
   - Define activeMenu property
   - Document property purposes

2. **Define isCollapsed property**
   - Type: boolean
   - Purpose: Track sidebar expanded/collapsed
   - Default: false (expanded)

3. **Define activeMenu property**
   - Type: string or null
   - Purpose: Track active menu section
   - Default: null (no selection)

4. **Document sidebar behavior**
   - How collapse affects layout
   - How activeMenu highlights items
   - Mobile vs desktop behavior

5. **Plan responsive behavior**
   - Desktop: sidebar toggles width
   - Mobile: sidebar overlays content
   - State drives CSS classes

### Sidebar State Properties

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| isCollapsed | boolean | false | Sidebar expanded/collapsed |
| activeMenu | string \| null | null | Currently active menu section |

### isCollapsed State

**When false (Expanded)**
- Sidebar shows full width (256px typical)
- Menu labels visible
- Icons with text
- Comfortable navigation

**When true (Collapsed)**
- Sidebar shows minimal width (64px typical)
- Only icons visible
- Text hidden or abbreviated
- Space-efficient layout

**Use Cases**
- User wants more content space
- Working with multiple windows
- Personal preference
- Small screen optimization

### activeMenu State

**Purpose**
- Highlight current navigation section
- Indicate user's location in app
- Show expanded submenu
- Visual navigation aid

**Value Format**
```
String identifier of menu section
Examples: 'dashboard', 'products', 'sales'
null when no specific section active
Matches route or feature area
```

**Setting Strategy**
- Set on navigation
- Set on page load (from route)
- Clear when appropriate
- Persist across sessions (optional)

### Sidebar State Flows

**Initial Load**
```
1. Check persisted state
2. Apply isCollapsed value
3. Determine activeMenu from route
4. Apply CSS classes
5. Render sidebar
```

**User Toggles Sidebar**
```
1. User clicks toggle button
2. Call toggleSidebar action
3. isCollapsed flips
4. CSS transition animates
5. New state persisted
```

**User Navigates**
```
1. User clicks menu item
2. Call setActiveMenu action
3. activeMenu updates
4. Previous item unhighlighted
5. New item highlighted
6. Navigate to route
```

### Responsive Behavior

**Desktop (≥1024px)**
| State | Behavior |
|-------|----------|
| Collapsed | Narrow sidebar, icons only |
| Expanded | Full sidebar with labels |
| Transition | Smooth width animation |

**Tablet (768px-1023px)**
| State | Behavior |
|-------|----------|
| Collapsed | Hidden or narrow |
| Expanded | Overlay or push content |
| Transition | Slide animation |

**Mobile (<768px)**
| State | Behavior |
|-------|----------|
| Collapsed | Hidden completely |
| Expanded | Full-screen overlay |
| Transition | Slide from side |

### Menu Section Identifiers

**Main Menu Sections**
```
'dashboard' - Dashboard overview
'products' - Product management
'inventory' - Inventory tracking
'sales' - Sales and orders
'customers' - Customer management
'reports' - Reports and analytics
'settings' - Application settings
'hr' - HR and employee management
```

### Integration with Routing

**Automatic Active Menu**
```
On route change:
Parse current pathname
Extract menu section
Call setActiveMenu
Update activeMenu state
```

**Example Flow**
```
Navigate to /dashboard/sales
Extract 'sales' from path
Set activeMenu = 'sales'
Sales menu item highlighted
```

### Expected Outcome
- Sidebar state properties defined
- State behavior documented
- Responsive strategy planned
- Menu identifiers established
- Integration points clear

### Verification Checklist
- [ ] isCollapsed property defined
- [ ] activeMenu property defined
- [ ] Default values set
- [ ] State behavior documented
- [ ] Responsive behavior planned
- [ ] Menu identifiers documented

---

## Task 17: Create toggleSidebar Action

### Overview
Create the toggleSidebar action that flips the sidebar's collapsed state between expanded and collapsed. This action provides users with a simple way to maximize content space or access full navigation labels.

### Dependencies
- Task 16: Define Sidebar State

### Instructions

1. **Add toggleSidebar to UIActions**
   - Define method signature
   - No parameters required
   - Returns void

2. **Implement toggleSidebar action**
   - Access current isCollapsed state
   - Flip boolean value
   - Update state immutably
   - Trigger persistence

3. **Handle side effects**
   - Log action in DevTools
   - Trigger layout recalculation
   - Update ARIA attributes
   - Animate transition (CSS handles)

4. **Document action behavior**
   - What the action does
   - When to call it
   - Expected outcome
   - Usage examples

### Action Signature

```typescript
toggleSidebar: () => void
```

**Parameters:** None  
**Returns:** void  
**Side Effects:** Updates isCollapsed state

### Implementation Pattern

**Using Immer**
```
Access state draft
Read current isCollapsed
Set to opposite value
Immer handles immutability
```

**State Update**
```
Before: isCollapsed = false
Action called
After: isCollapsed = true
```

### Trigger Points

**User Actions**
- Click hamburger menu button
- Keyboard shortcut (Ctrl+B)
- Touch gesture on mobile
- Voice command (future)

**Programmatic**
- Window resize (mobile transition)
- Route change (mobile)
- Specific feature activation

### Accessibility Considerations

**ARIA Updates**
```
Update aria-expanded attribute
Update aria-label text
Announce state change
Maintain keyboard focus
```

**Keyboard Support**
```
Trigger with keyboard shortcut
Focus management on toggle
Escape to close on mobile
Tab navigation maintained
```

### Mobile-Specific Behavior

**Desktop**
- Simple width toggle
- Content reflows
- Smooth animation

**Mobile**
- Show/hide overlay
- Disable body scroll when open
- Add backdrop
- Close on backdrop click

### Animation Coordination

**CSS Transitions**
```
Width transition (desktop)
Transform transition (mobile)
Duration: 200-300ms
Easing: ease-in-out
```

**Layout Recalculation**
```
Browser handles reflow
Use transform for performance
Avoid layout thrashing
GPU-accelerated animations
```

### Persistence Behavior

**Automatic Persistence**
```
Toggle called
State updated
Persist middleware triggered
localStorage updated
Preference saved
```

**Cross-Session**
```
User toggles sidebar
Refreshes page
State restored from localStorage
Sidebar appears in saved state
```

### Integration Example

**In Component**
```
Import useUIStore
Destructure toggleSidebar
Attach to button onClick
Button triggers toggle
State updates automatically
Component re-renders
```

**Button Example**
```
Hamburger icon button
Call toggleSidebar on click
Icon rotates or changes
Sidebar animates
State persisted
```

### Expected Outcome
- toggleSidebar action created
- Sidebar state toggles correctly
- Smooth animations occur
- State persists across sessions
- Accessibility maintained

### Verification Checklist
- [ ] Action signature defined
- [ ] Implementation uses immer
- [ ] State toggles correctly
- [ ] Persistence works
- [ ] DevTools shows action
- [ ] Accessibility considered
- [ ] Mobile behavior planned

---

## Task 18: Create setActiveMenu Action

### Overview
Create the setActiveMenu action to set the currently active menu section in the sidebar. This action updates the highlighted navigation item based on user navigation or route changes, providing clear visual feedback about the current location.

### Dependencies
- Task 16: Define Sidebar State

### Instructions

1. **Add setActiveMenu to UIActions**
   - Define method signature
   - Accept menu parameter (string or null)
   - Returns void

2. **Implement setActiveMenu action**
   - Accept menuId parameter
   - Update activeMenu state
   - Validate menu identifier (optional)
   - Handle null (clear active)

3. **Handle menu activation**
   - Clear previous active menu
   - Set new active menu
   - Update UI highlights
   - Scroll to active item (optional)

4. **Document usage patterns**
   - When to call action
   - Valid menu identifiers
   - Route integration
   - Manual override scenarios

### Action Signature

```typescript
setActiveMenu: (menuId: string | null) => void
```

**Parameters:**
- `menuId`: Menu section identifier or null

**Returns:** void  
**Side Effects:** Updates activeMenu state

### Implementation Pattern

**Using Immer**
```
Access state draft
Set activeMenu to provided value
Immer handles immutability
State update triggers re-render
```

**State Update**
```
Before: activeMenu = 'dashboard'
Action: setActiveMenu('products')
After: activeMenu = 'products'
```

### Valid Menu Identifiers

| Menu ID | Menu Label | Route Pattern |
|---------|------------|---------------|
| 'dashboard' | Dashboard | /dashboard |
| 'products' | Products | /products/* |
| 'inventory' | Inventory | /inventory/* |
| 'sales' | Sales | /sales/* |
| 'customers' | Customers | /customers/* |
| 'vendors' | Vendors | /vendors/* |
| 'reports' | Reports | /reports/* |
| 'hr' | Human Resources | /hr/* |
| 'settings' | Settings | /settings/* |
| null | None | - |

### Trigger Scenarios

**Route-Based Activation**
```
User navigates to /products
Parse route
Determine menu: 'products'
Call setActiveMenu('products')
Products menu highlighted
```

**Manual Activation**
```
User clicks menu item
Item onClick handler
Call setActiveMenu with ID
Menu highlighted
Navigate to route
```

**Clear Active**
```
Navigate to special route
No menu applies
Call setActiveMenu(null)
All menus unhighlighted
```

### Integration with Next.js Router

**usePathname Hook**
```
Get current pathname
Match to menu section
Call setActiveMenu on mount
Update on route change
Automatic highlighting
```

**Route Matching Logic**
```
const pathname = usePathname()
if (pathname.startsWith('/products')) {
  setActiveMenu('products')
}
else if (pathname.startsWith('/sales')) {
  setActiveMenu('sales')
}
// etc.
```

### UI Highlighting

**Active Menu Styling**
```
Compare item ID to activeMenu
If match, apply active styles
Background color change
Icon color change
Border or indicator
Font weight bold
```

**CSS Class Application**
```
{activeMenu === 'products' && 'active'}
Conditional class application
Tailwind conditional classes
Dynamic styling
```

### Submenu Expansion

**When Menu Activated**
```
Set activeMenu
Check if menu has submenu
If yes, expand submenu
Show child items
Allow nested navigation
```

**Collapse Previous**
```
Get previous activeMenu
Find corresponding menu
Collapse its submenu
Show only new active submenu
Clean UI state
```

### Accessibility

**ARIA Attributes**
```
aria-current="page" on active item
Update on menu change
Screen reader announces
Keyboard navigation maintained
```

**Focus Management**
```
On programmatic change
Optionally move focus
Announce change
Maintain navigation context
```

### Persistence Considerations

**Should activeMenu Persist?**

**Arguments For:**
- User returns to last-viewed section
- Seamless experience
- Less reorientation needed

**Arguments Against:**
- Route should determine menu
- Can cause confusion
- Stale if user shares URL

**Recommended Approach:**
- Don't persist activeMenu
- Always derive from current route
- Ensures consistency
- URL is source of truth

### Expected Outcome
- setActiveMenu action created
- Menu highlighting works correctly
- Route integration planned
- Clear visual feedback provided
- Accessibility maintained

### Verification Checklist
- [ ] Action signature defined
- [ ] Implementation accepts menuId
- [ ] State updates correctly
- [ ] Valid menu IDs documented
- [ ] Route integration planned
- [ ] UI highlighting specified
- [ ] Accessibility considered

---

## Task 19: Define Theme State

### Overview
Define the theme state structure for managing the application's visual theme including light mode, dark mode, and system preference detection. Theme state enables users to customize their interface appearance and respects their OS-level preferences.

### Dependencies
- Task 15: Create UI Store

### Instructions

1. **Add theme state to UIState**
   - Define theme property
   - Type as union of valid themes
   - Document theme options

2. **Define theme type**
   - Create ThemeMode type
   - Include 'light' option
   - Include 'dark' option
   - Include 'system' option

3. **Set default theme**
   - Default to 'system'
   - Respects user OS preference
   - Seamless experience

4. **Document theme behavior**
   - How each mode works
   - System preference detection
   - Theme application method

5. **Plan theme persistence**
   - Persist user's explicit choice
   - Include in persist configuration
   - Restore on page load

### Theme State Property

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| theme | 'light' \| 'dark' \| 'system' | 'system' | Active theme mode |

### Theme Mode Options

**'light' Mode**
```
Light background colors
Dark text for contrast
Standard UI colors
Suitable for bright environments
User explicitly chose light
```

**'dark' Mode**
```
Dark background colors
Light text for contrast
Muted UI colors
Suitable for low-light environments
User explicitly chose dark
Reduces eye strain
```

**'system' Mode**
```
Follows OS preference
Detects prefers-color-scheme
Automatic switching
Respects user's system setting
No manual maintenance
```

### System Theme Detection

**Media Query**
```
prefers-color-scheme: dark
prefers-color-scheme: light
Detects OS preference
React to changes
Update UI automatically
```

**Detection Flow**
```
1. Check theme state
2. If 'system', detect OS preference
3. Match to light or dark
4. Apply corresponding theme
5. Listen for OS changes
6. Update when OS theme changes
```

### Theme Application Methods

**CSS Variables**
```
Define color variables
--bg-primary, --text-primary, etc.
Set different values per theme
Apply theme class to root
Variables cascade to all components
```

**CSS Classes**
```
.light theme classes
.dark theme classes
Applied to <html> or <body>
Components style based on ancestor class
Tailwind dark: variant
```

**Tailwind Dark Mode**
```
Configure class-based dark mode
Apply 'dark' class when dark theme
Components use dark: prefix
Automatic responsive dark styling
```

### Theme State Flow

**Initial Load (System Preference)**
```
1. Check persisted theme
2. If 'system', detect OS
3. Apply light or dark
4. Set theme class on root
5. Render with theme
```

**User Changes Theme**
```
1. User selects theme in settings
2. Call setTheme action
3. Update theme state
4. Apply new theme class
5. Persist choice
6. All components re-style
```

**OS Preference Changes**
```
1. User changes OS theme
2. Media query detects change
3. If theme is 'system', update
4. Apply new OS preference
5. UI updates automatically
```

### Integration with Tailwind

**tailwind.config.js**
```
darkMode: 'class'
Enables class-based dark mode
Apply 'dark' class to enable
All dark: utilities activate
```

**Component Usage**
```
className="bg-white dark:bg-gray-900"
Light mode: white background
Dark mode: gray-900 background
Automatic based on theme
```

### Accessibility Considerations

**Contrast Ratios**
```
WCAG AA compliance
Text contrast ≥ 4.5:1
Large text ≥ 3:1
Test both themes
Use contrast checkers
```

**Reduced Motion**
```
Respect prefers-reduced-motion
Disable theme transitions if requested
Accessibility priority
Smooth experience for all
```

### Theme Persistence

**What to Persist**
```
User's theme choice
'light', 'dark', or 'system'
Store in localStorage
Restore on page load
```

**Persistence Key**
```
Include theme in persist partialize
Storage key: 'lcc-ui-store'
Nested under theme property
Retrieved on init
```

### Expected Outcome
- Theme state property defined
- Three theme modes supported
- System detection planned
- Tailwind integration specified
- Persistence configured

### Verification Checklist
- [ ] theme property added to UIState
- [ ] ThemeMode type defined
- [ ] Default value set to 'system'
- [ ] Theme behaviors documented
- [ ] System detection explained
- [ ] Tailwind integration planned
- [ ] Persistence configured

---

## Task 20: Create setTheme Action

### Overview
Create the setTheme action to update the application's theme mode. This action allows users to explicitly choose between light, dark, or system theme preferences, applying the selection immediately and persisting it across sessions.

### Dependencies
- Task 19: Define Theme State

### Instructions

1. **Add setTheme to UIActions**
   - Define method signature
   - Accept theme parameter
   - Type as ThemeMode
   - Returns void

2. **Implement setTheme action**
   - Accept newTheme parameter
   - Validate theme value
   - Update theme state
   - Trigger theme application

3. **Apply theme to DOM**
   - Determine actual theme (resolve system)
   - Add/remove theme classes
   - Update root element
   - Trigger CSS variable updates

4. **Handle system preference**
   - If theme is 'system', detect OS
   - Apply corresponding theme
   - Listen for OS changes
   - Update when OS changes

5. **Persist theme choice**
   - Persist middleware handles storage
   - User's choice saved
   - Restored on next session

6. **Document usage patterns**
   - When to call action
   - Theme picker component integration
   - Testing different themes

### Action Signature

```typescript
setTheme: (newTheme: 'light' | 'dark' | 'system') => void
```

**Parameters:**
- `newTheme`: Theme mode to apply

**Returns:** void  
**Side Effects:** Updates theme state, modifies DOM classes

### Implementation Pattern

**State Update**
```
Accept newTheme parameter
Validate theme value
Update state.theme
Trigger DOM updates
Persist automatically
```

**Theme Resolution**
```
If newTheme === 'light', apply light
If newTheme === 'dark', apply dark
If newTheme === 'system':
  Detect OS preference
  Apply light or dark accordingly
```

### DOM Manipulation

**Update Root Element**
```
Get document.documentElement
Remove existing theme class
Add new theme class
CSS immediately responds
```

**Class Management**
```
Remove 'light' class
Remove 'dark' class
Add 'light' or 'dark' based on resolved theme
Tailwind dark: utilities activate
```

**Example**
```
Current: <html class="light">
setTheme('dark')
Result: <html class="dark">
All dark: styles apply
```

### System Preference Detection

**Media Query**
```
window.matchMedia('(prefers-color-scheme: dark)')
Returns MediaQueryList
Check .matches property
true = dark, false = light
```

**Listener for Changes**
```
Add change listener to MediaQueryList
When OS theme changes:
  If current theme is 'system':
    Re-resolve OS preference
    Update DOM class
    UI automatically updates
```

### Theme Application Flow

**User Selects Theme**
```
1. User clicks theme selector
2. Call setTheme(selectedTheme)
3. Action updates state
4. Resolve actual theme
5. Update DOM class
6. CSS re-applies
7. Persist choice
8. UI reflects new theme
```

**Page Load with System Theme**
```
1. Restore theme = 'system'
2. Detect OS preference
3. Resolve to 'light' or 'dark'
4. Apply DOM class
5. Render with resolved theme
6. Set up OS change listener
```

### Integration Patterns

**Theme Selector Component**
```
Show radio buttons or dropdown
Options: Light, Dark, System
On change, call setTheme
Current selection highlighted
Immediate visual feedback
```

**Settings Page**
```
Theme section in settings
Visual preview of each theme
Click to apply
Current theme indicated
Persist immediately
```

**Keyboard Shortcut**
```
Ctrl+Shift+T to cycle themes
Light → Dark → System → Light
Call setTheme for each
Quick theme switching
Developer convenience
```

### CSS Variables Update

**If Using CSS Variables**
```
Define variables per theme
:root.light { --bg: white; }
:root.dark { --bg: black; }
Variables update automatically
All components re-paint
```

### Accessibility

**Announce Theme Change**
```
Use ARIA live region
Announce "Theme changed to dark mode"
Screen reader accessibility
Non-visual feedback
```

**High Contrast Support**
```
Check prefers-contrast: high
Apply high contrast theme variant
Enhanced contrast ratios
Accessibility priority
```

### Testing Themes

**Manual Testing**
```
1. Test each theme mode
2. Verify visual consistency
3. Check contrast ratios
4. Test theme persistence
5. Test OS preference changes
6. Verify smooth transitions
```

**Automated Testing**
```
Mock matchMedia
Test theme resolution
Test DOM class application
Test persistence
Test theme switching
```

### Expected Outcome
- setTheme action created
- Theme updates immediately
- DOM classes managed correctly
- System preference detected
- Theme persists across sessions

### Verification Checklist
- [ ] Action signature defined
- [ ] Theme parameter validated
- [ ] State updates correctly
- [ ] DOM class applied
- [ ] System detection works
- [ ] OS change listener set
- [ ] Persistence functions
- [ ] Accessibility considered

---

## Task 21: Define Modal State

### Overview
Define the modal state structure for managing multiple modal dialogs throughout the application. The modal registry pattern enables centralized control over all modals, preventing conflicts, managing z-index stacking, and providing clean open/close APIs.

### Dependencies
- Task 15: Create UI Store

### Instructions

1. **Add modals state to UIState**
   - Define modals property
   - Type as Map of modal data
   - Document registry pattern

2. **Define Modal type**
   - Create Modal interface
   - Include id property
   - Include isOpen property
   - Include props property

3. **Choose data structure**
   - Use Map for efficient lookup
   - Key: modal ID (string)
   - Value: Modal object
   - Fast operations

4. **Document modal lifecycle**
   - Registration (open)
   - State management (props)
   - Cleanup (close)
   - Batch operations (close all)

5. **Plan z-index management**
   - Layer modals properly
   - Handle backdrop
   - Prevent body scroll
   - Focus management

### Modal State Property

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| modals | Map<string, Modal> | new Map() | Registry of all modals |

### Modal Interface

```typescript
interface Modal {
  id: string
  isOpen: boolean
  props?: Record<string, any>
}
```

**Properties:**
- `id`: Unique identifier for modal
- `isOpen`: Whether modal is currently open
- `props`: Optional props passed to modal component

### Why Use Map?

**Map Advantages**
- Fast lookup by ID: O(1)
- Easy to add/remove modals
- Iteration when needed
- No prototype pollution
- Clear API

**Alternative: Array**
- Slower lookup: O(n)
- Harder to update specific modal
- More complex operations
- Less efficient

### Modal Registry Pattern

**Registration on Open**
```
User triggers modal
Generate unique modal ID
Create modal object
Add to modals Map
Modal appears
```

**Deregistration on Close**
```
User closes modal
Get modal by ID
Remove from Map
Modal disappears
Cleanup complete
```

### Modal Lifecycle

**1. Open**
```
Action: openModal('editProduct', { productId: 123 })
Creates entry in Map
Modal component renders
Focus trapped in modal
Body scroll disabled
```

**2. Active**
```
Modal is displayed
User interacts
Props can update
State changes tracked
```

**3. Close**
```
Action: closeModal('editProduct')
Removes from Map
Modal component unmounts
Focus restored
Body scroll enabled
```

### Multiple Modal Management

**Stacking**
```
Modal 1 opens (z-index: 1000)
Modal 2 opens (z-index: 1010)
Both in Map
Proper layering
Close in reverse order
```

**Independent State**
```
Each modal has own entry
Separate props
Independent lifecycle
No interference
Clean separation
```

### Modal ID Conventions

**Naming Pattern**
```
{action}{Entity}Modal
editProductModal
deleteCustomerModal
confirmOrderModal
viewReportModal
```

**Unique IDs**
```
Static IDs for single-instance modals
Dynamic IDs for entity-specific modals
Pattern: 'editProduct-${productId}'
Ensures uniqueness
Allows multiple of same type
```

### Modal Props

**Purpose**
- Pass data to modal
- Configure modal behavior
- Provide callbacks
- Customize content

**Example Props**
```
productId: ID of product to edit
onSave: Callback after save
initialValues: Form defaults
mode: 'create' or 'edit'
```

**Type Safety**
```
Use generic type for props
Each modal type defines interface
Type-safe prop passing
Compile-time checking
```

### Accessibility Considerations

**Focus Management**
```
Trap focus in modal
First focusable element focused
Tab cycles within modal
Escape closes modal
Focus returns to trigger
```

**ARIA Attributes**
```
role="dialog"
aria-modal="true"
aria-labelledby="modal-title"
aria-describedby="modal-description"
```

**Keyboard Support**
```
Escape to close
Tab to navigate
Enter to confirm
Arrow keys for selection (if applicable)
```

### Body Scroll Prevention

**When Modal Opens**
```
Add overflow:hidden to body
Prevent background scroll
Maintain scroll position
Better UX
```

**When Modal Closes**
```
Remove overflow:hidden
Restore scroll behavior
Return to previous position
```

### Persistence Behavior

**Do NOT Persist Modals**
```
Modals are transient UI
Should not persist across sessions
Always start with empty Map
Re-opening handled by app logic
```

**Partialize Configuration**
```
Exclude modals from persistence
Only persist theme and sidebar
Modals reset on page load
```

### Expected Outcome
- Modal state property defined
- Modal interface created
- Registry pattern established
- Lifecycle documented
- Accessibility planned

### Verification Checklist
- [ ] modals property added to UIState
- [ ] Modal interface defined
- [ ] Map data structure chosen
- [ ] Modal lifecycle documented
- [ ] z-index strategy planned
- [ ] Accessibility considered
- [ ] Persistence exclusion noted

---

## Task 22: Create openModal Action

### Overview
Create the openModal action to register and display a modal dialog. This action adds the modal to the registry with specified props, triggers the modal component to render, and manages necessary side effects like focus trapping and scroll prevention.

### Dependencies
- Task 21: Define Modal State

### Instructions

1. **Add openModal to UIActions**
   - Define method signature
   - Accept modalId parameter
   - Accept optional props parameter
   - Type with generics for props
   - Returns void

2. **Implement openModal action**
   - Accept modalId and props
   - Create Modal object
   - Add to modals Map
   - Set isOpen to true

3. **Handle duplicate opens**
   - Check if modal already open
   - Update props if already open
   - Or ignore if already open
   - Prevent duplicate entries

4. **Manage side effects**
   - Disable body scroll
   - Set focus to modal
   - Add to modal stack
   - Update z-index

5. **Type-safe props**
   - Use generic type parameter
   - Type props per modal
   - Compile-time checking
   - Autocomplete support

6. **Document usage patterns**
   - How to open modals
   - Passing props
   - Modal component integration

### Action Signature

```typescript
openModal: <T = any>(modalId: string, props?: T) => void
```

**Parameters:**
- `modalId`: Unique identifier for modal
- `props`: Optional props object for modal

**Returns:** void  
**Side Effects:** Adds modal to Map, triggers render

### Implementation Pattern

**Using Immer**
```
Access state.modals Map
Create new Modal object
Set id, isOpen, props
Add to Map with modalId as key
Immer handles immutability
```

**State Update**
```
Before: modals = new Map()
Action: openModal('editProduct', { id: 123 })
After: modals = Map { 'editProduct' => { id, isOpen: true, props } }
```

### Duplicate Open Handling

**Strategy 1: Update Props**
```
Check if modal already in Map
If exists, update props
Keep modal open
New props applied
Modal re-renders with new props
```

**Strategy 2: Ignore**
```
Check if modal already open
If exists, do nothing
Prevents duplicate
Existing modal remains
```

**Recommended: Update Props**
- More flexible
- Handles re-open with new data
- Modal refreshes content
- Better UX

### Modal Component Integration

**Modal Component Pattern**
```
Component checks store for modal state
If modal in Map and isOpen === true:
  Render modal
Else:
  Return null
Props passed to component
```

**Example Component**
```
const modal = useUIStore(state => state.modals.get('editProduct'))
if (!modal?.isOpen) return null
return <ModalDialog {...modal.props} />
```

### Props Type Safety

**Generic Type Parameter**
```typescript
openModal<EditProductProps>('editProduct', {
  productId: '123',
  onSave: handleSave
})
```

**Props Interface**
```typescript
interface EditProductProps {
  productId: string
  onSave: (product: Product) => void
}
```

**Type Checking**
- Compile-time validation
- Autocomplete for props
- Prevents typos
- Catches missing props

### Side Effect Management

**Disable Body Scroll**
```
Add class to body element
overflow: hidden applied
Background scroll prevented
Better modal focus
```

**Focus Management**
```
After modal renders
Focus first focusable element
Trap focus within modal
Escape to close
```

**Z-Index Stacking**
```
Each modal gets incrementing z-index
Base: 1000
Increment: 10
Modal 1: 1000, Modal 2: 1010
Proper layering
```

### Usage Examples

**Simple Modal**
```
openModal('confirmDelete')
No props needed
Generic confirmation
Simple use case
```

**Modal with Props**
```
openModal('editProduct', {
  productId: '123',
  mode: 'edit'
})
Props passed to component
Modal displays product
Edit mode active
```

**Modal with Callbacks**
```
openModal('selectCustomer', {
  onSelect: (customer) => {
    console.log(customer)
    closeModal('selectCustomer')
  }
})
Callback executed on selection
Modal closes after
Data returned to caller
```

### Integration with Components

**Button Trigger**
```
<Button onClick={() => openModal('editProduct', { id })}>
  Edit Product
</Button>
```

**Conditional Render**
```
const editProductModal = useUIStore(
  state => state.modals.get('editProduct')
)
return (
  <>
    {editProductModal?.isOpen && (
      <EditProductModal {...editProductModal.props} />
    )}
  </>
)
```

### Expected Outcome
- openModal action created
- Modals added to registry correctly
- Props passed and typed safely
- Side effects managed
- Components can trigger modals

### Verification Checklist
- [ ] Action signature defined
- [ ] Generic type parameter for props
- [ ] Modal added to Map
- [ ] Duplicate handling implemented
- [ ] Props type-safe
- [ ] Side effects planned
- [ ] Usage examples provided

---

## Task 23: Create closeModal Action

### Overview
Create the closeModal action to remove a modal from the registry and hide it from view. This action handles cleanup including removing the modal entry, restoring body scroll, and returning focus to the trigger element.

### Dependencies
- Task 21: Define Modal State

### Instructions

1. **Add closeModal to UIActions**
   - Define method signature
   - Accept modalId parameter
   - Returns void

2. **Implement closeModal action**
   - Accept modalId parameter
   - Find modal in Map
   - Remove from Map
   - Trigger cleanup

3. **Handle side effects**
   - Re-enable body scroll
   - Restore focus to trigger
   - Clean up event listeners
   - Update modal stack

4. **Handle non-existent modal**
   - Check if modal exists
   - Silently ignore if not found
   - Prevent errors
   - Graceful handling

5. **Document usage patterns**
   - When to close modals
   - Manual close vs callback close
   - Cleanup verification

### Action Signature

```typescript
closeModal: (modalId: string) => void
```

**Parameters:**
- `modalId`: ID of modal to close

**Returns:** void  
**Side Effects:** Removes modal from Map, cleanup

### Implementation Pattern

**Using Immer**
```
Access state.modals Map
Check if modal exists
Delete modal from Map
Immer handles immutability
Component unmounts automatically
```

**State Update**
```
Before: modals = Map { 'editProduct' => { ... } }
Action: closeModal('editProduct')
After: modals = Map {}
```

### Modal Removal

**Map Delete Operation**
```
state.modals.delete(modalId)
Removes entry from Map
Modal component returns null
Visual disappearance
Memory freed
```

**Non-Existent Modal**
```
If modalId not in Map:
  Silently ignore
  No error thrown
  Safe to call anytime
  Idempotent operation
```

### Cleanup Side Effects

**Re-enable Body Scroll**
```
Check if any modals still open
If no open modals:
  Remove overflow:hidden from body
  Restore scrolling
If other modals open:
  Keep scroll disabled
```

**Focus Restoration**
```
Get original trigger element
Return focus to trigger
Maintain keyboard navigation
Accessibility requirement
```

**Event Listener Cleanup**
```
Remove Escape key listener
Remove backdrop click listener
Clean up focus trap
Prevent memory leaks
```

### Close Triggers

**User Actions**
```
Click close button (X)
Click backdrop/overlay
Press Escape key
Submit form (auto-close)
Cancel action
```

**Programmatic**
```
After successful save
After delete confirmation
Timeout (notifications)
Route change (optional)
Error conditions
```

### Modal Stack Management

**Single Modal**
```
Close only modal
All cleanup executed
Body scroll restored
Focus returned
```

**Multiple Modals**
```
Close top modal
Keep lower modals open
Maintain scroll disabled
Focus to next modal
Proper z-index maintained
```

### Animation Coordination

**CSS Transitions**
```
Add closing class
Wait for animation
Then remove from DOM
Smooth exit
```

**Implementation**
```
Set modal.isOpen = false
CSS triggers exit animation
After animation, remove from Map
Clean visual transition
```

### Usage Patterns

**Close Button**
```
<Button onClick={() => closeModal('editProduct')}>
  Close
</Button>
Internal close trigger
Clear action
Explicit close
```

**Escape Key**
```
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal('editProduct')
    }
  }
  window.addEventListener('keydown', handleEscape)
  return () => window.removeEventListener('keydown', handleEscape)
}, [])
```

**Backdrop Click**
```
<div onClick={() => closeModal('editProduct')} />
Click outside to close
Common pattern
User expectation
```

**After Action**
```
const handleSave = async () => {
  await saveProduct(data)
  closeModal('editProduct')
}
Auto-close after success
Clean user flow
```

### Confirmation Before Close

**Unsaved Changes**
```
Check if form has changes
If dirty, show confirmation
"Discard changes?"
User confirms
Then close modal
```

**Implementation**
```
const handleClose = () => {
  if (isDirty) {
    if (confirm('Discard changes?')) {
      closeModal('editProduct')
    }
  } else {
    closeModal('editProduct')
  }
}
```

### Expected Outcome
- closeModal action created
- Modals removed from registry
- Cleanup side effects executed
- Body scroll restored
- Focus returned appropriately

### Verification Checklist
- [ ] Action signature defined
- [ ] Modal removed from Map
- [ ] Non-existent modal handled
- [ ] Body scroll restored
- [ ] Focus restoration planned
- [ ] Cleanup executed
- [ ] Usage patterns documented

---

## Task 24: Create closeAllModals Action

### Overview
Create the closeAllModals action to simultaneously close all open modals. This batch operation is useful for application reset scenarios, navigation events, or emergency UI cleanup situations.

### Dependencies
- Task 21: Define Modal State

### Instructions

1. **Add closeAllModals to UIActions**
   - Define method signature
   - No parameters required
   - Returns void

2. **Implement closeAllModals action**
   - Access modals Map
   - Clear entire Map
   - Trigger all cleanup
   - Reset modal state

3. **Handle cleanup for all modals**
   - Re-enable body scroll
   - Clear all focus traps
   - Remove all event listeners
   - Reset z-index counter

4. **Document usage scenarios**
   - When to close all modals
   - Navigation handling
   - Logout cleanup
   - Error recovery

### Action Signature

```typescript
closeAllModals: () => void
```

**Parameters:** None  
**Returns:** void  
**Side Effects:** Clears modals Map, complete cleanup

### Implementation Pattern

**Using Immer**
```
Access state.modals Map
Call Map.clear()
All entries removed
All modal components unmount
UI returns to clean state
```

**State Update**
```
Before: modals = Map { 'modal1' => {...}, 'modal2' => {...} }
Action: closeAllModals()
After: modals = Map {}
```

### Batch Cleanup

**Re-enable Body Scroll**
```
Force remove overflow:hidden
Don't check modal count
Always restore scrolling
Clean slate
```

**Clear Focus Traps**
```
All modals lose focus trap
Return focus to body or main content
Reset focus management
Clear focus stack
```

**Remove Event Listeners**
```
Clear all Escape listeners
Clear all backdrop listeners
Remove all modal event handlers
Prevent memory leaks
```

### Use Cases

**User Logout**
```
User clicks logout
Close all open modals
Clear all state
Navigate to login
Clean session end
```

**Route Navigation**
```
User navigates to new route
Close all modals
Clean UI state
New page loads fresh
No modal remnants
```

**Error Recovery**
```
Critical error occurs
Close all modals
Show error notification
Return to stable state
User can recover
```

**Application Reset**
```
Test cleanup
Demo mode reset
Clear all UI state
Fresh start
Known good state
```

### Navigation Integration

**Next.js Router**
```
router.events.on('routeChangeStart', () => {
  closeAllModals()
})
Automatically close on navigation
Clean page transitions
No modal carry-over
```

**React Router**
```
useEffect(() => {
  return () => closeAllModals()
}, [pathname])
Close on route change
Cleanup effect
Fresh page state
```

### Logout Integration

**Logout Flow**
```
1. User clicks logout
2. closeAllModals()
3. Clear auth state
4. Clear other stores
5. Redirect to login
6. Clean session end
```

### Confirmation Consideration

**Should Confirm?**

**Arguments For:**
- User might have unsaved changes
- Prevents accidental data loss
- Better UX in some cases

**Arguments Against:**
- Emergency action should be immediate
- Used in critical situations
- Modal stack might be corrupted

**Recommendation:**
- Don't confirm for closeAllModals
- Individual modals handle own confirmation
- This is emergency/system action
- Immediate execution needed

### Testing Scenarios

**Multiple Modals Open**
```
1. Open 3 modals
2. Verify all in Map
3. Call closeAllModals()
4. Verify Map empty
5. Check all unmounted
6. Verify body scroll restored
```

**No Modals Open**
```
1. Verify Map empty
2. Call closeAllModals()
3. No errors thrown
4. Idempotent operation
5. Safe to call anytime
```

### Performance Considerations

**Batch Operation**
```
Single state update
All modals close simultaneously
No cascading re-renders
Efficient cleanup
Good performance
```

**Memory Cleanup**
```
All modal components unmount
React cleanup executes
Event listeners removed
Memory freed
No leaks
```

### Expected Outcome
- closeAllModals action created
- All modals close simultaneously
- Complete cleanup executed
- Body scroll restored
- Focus management reset

### Verification Checklist
- [ ] Action signature defined
- [ ] Map cleared completely
- [ ] All cleanup executed
- [ ] Body scroll restored
- [ ] Use cases documented
- [ ] Navigation integration planned
- [ ] Logout integration planned

---

## Summary

This document established the core UI state store with sidebar, theme, and modal management. The sidebar state enables collapse/expand control and active menu tracking. Theme state supports light, dark, and system preferences with automatic OS detection. Modal state uses a registry pattern with Map-based storage for efficient multi-modal management.

### Completed Tasks

| Task | Status | Key Deliverable |
|------|--------|----------------|
| 15 | ✓ | uiStore.ts foundation created |
| 16 | ✓ | Sidebar state (isCollapsed, activeMenu) |
| 17 | ✓ | toggleSidebar action |
| 18 | ✓ | setActiveMenu action |
| 19 | ✓ | Theme state (light/dark/system) |
| 20 | ✓ | setTheme action with system detection |
| 21 | ✓ | Modal state (Map registry) |
| 22 | ✓ | openModal action with type-safe props |
| 23 | ✓ | closeModal action with cleanup |
| 24 | ✓ | closeAllModals batch action |

### Next Steps

The next document covers notification queue management and command palette state, completing the UI store implementation with transient notification handling and keyboard-driven command interface.
