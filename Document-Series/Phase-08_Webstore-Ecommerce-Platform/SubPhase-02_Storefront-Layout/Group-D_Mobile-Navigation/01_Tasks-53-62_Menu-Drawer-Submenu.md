# Tasks 53-62: Mobile Menu, Drawer, and Submenu Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** D - Mobile Navigation  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-68_Search-Account-Verify.md](02_Tasks-63-68_Search-Account-Verify.md)
- **← Previous Group:** [../Group-C_Navigation-Mega-Menu/](../Group-C_Navigation-Mega-Menu/)

---

## Document Overview

This document covers mobile navigation infrastructure: mobile menu button with animated hamburger icon, slide-in drawer with backdrop, drawer header, navigation list, and expandable submenus.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create Mobile Menu Button | Low | 20 min |
| 54 | Create Hamburger Icon | Low | 25 min |
| 55 | Create Mobile Nav Drawer | Medium | 45 min |
| 56 | Create Drawer Backdrop | Low | 15 min |
| 57 | Create Drawer Header | Low | 20 min |
| 58 | Create Close Drawer Button | Low | 15 min |
| 59 | Create Mobile Nav List | Low | 25 min |
| 60 | Create Mobile Nav Item | Low | 30 min |
| 61 | Create Mobile Submenu | Medium | 40 min |
| 62 | Create Submenu Toggle | Low | 20 min |

---

## Task 53: Create Mobile Menu Button

### Overview
Create mobile menu button that toggles navigation drawer. Appears in header on mobile (< 1024px), uses Zustand store, includes ARIA labels.

### Dependencies
- Task 34: Create Storefront Header
- Zustand UI store configured

### Instructions

1. **Create component structure**
   - Navigate to `frontend/components/storefront/layout/`
   - Create `MobileNav/` directory
   - Create `MobileMenuButton.tsx` file

2. **Import dependencies and setup**
   - Import React, Zustand UI store hook
   - Access `mobileMenuOpen` state and `toggleMobileMenu` function

3. **Create button element**
   - Use `<button type="button">` 
   - Wrap HamburgerIcon component (Task 54)
   - Add click handler to call `toggleMobileMenu()`

4. **Apply styling and accessibility**
   - Classes: `w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors lg:hidden`
   - Add `aria-label="Open menu"`, `aria-expanded={mobileMenuOpen}`, `aria-controls="mobile-nav-drawer"`

### Key Specifications
- Position: Header left, visible < 1024px (`lg:hidden`)
- Size: 44x44px touch target
- Store props: `mobileMenuOpen` (boolean), `toggleMobileMenu` (function)
- States: Default | Hover (bg-gray-100) | Focus (ring-2) | Active

### Expected Outcome
- Touch-friendly button (44x44px) that toggles drawer state
- Integrates with Zustand store
- Proper ARIA attributes for accessibility

### Verification Checklist
- [ ] Component created at correct path
- [ ] Integrates with Zustand UI store
- [ ] ARIA attributes present
- [ ] Only visible on mobile (lg:hidden)
- [ ] Click toggles drawer

---

## Task 54: Create Hamburger Icon

### Overview
Create animated hamburger icon that morphs between menu (three lines) and X (close) states using CSS transitions or Framer Motion.

### Dependencies
- Task 53: Create Mobile Menu Button

### Instructions

1. **Create component file**
   - Create `HamburgerIcon.tsx` in `MobileNav/` directory
   - Import React, optional Framer Motion

2. **Define props**
   - Interface: `{ isOpen: boolean; className?: string }`

3. **Create icon structure**
   - Use three div elements for lines or SVG
   - Container with `aria-hidden="true"`

4. **Style lines**
   - Each line: `w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300`
   - Container: `flex flex-col gap-1.5`

5. **Implement animation states**
   - **Closed**: All lines horizontal, middle visible
   - **Open**: Top rotates 45°, middle hidden (opacity-0), bottom rotates -45°
   - CSS classes or Framer Motion variants

6. **Animation transforms**
   - Top line (open): `translate-y-[8px] rotate-45`
   - Middle (open): `opacity-0`
   - Bottom (open): `translate-y-[-8px] rotate-[-45deg]`

### Key Specifications
- Line dimensions: 24px × 2px (w-6 h-0.5)
- Animation: 300ms ease-in-out
- States: Hamburger (three lines) ↔ X (crossed lines)

### Expected Outcome
- Smooth animation between hamburger and X icon
- 60fps performance
- Clean visual feedback

### Verification Checklist
- [ ] Three lines render correctly
- [ ] Closed state shows hamburger
- [ ] Open state shows X
- [ ] Animation smooth (300ms)
- [ ] `aria-hidden="true"` set

---

## Task 55: Create Mobile Nav Drawer

### Overview
Create main drawer component that slides from left, contains all mobile nav content, uses Framer Motion animations, includes focus trap and scroll lock.

### Dependencies
- Task 53: Create Mobile Menu Button
- Framer Motion installed

### Instructions

1. **Create component file**
   - Create `MobileDrawer.tsx` in `MobileNav/` directory
   - Import React (useEffect, useRef), Framer Motion (motion, AnimatePresence), Zustand store, Portal

2. **Access store state**
   - Get `mobileMenuOpen` and `setMobileMenuOpen` from store

3. **Implement drawer structure**
   - Use React Portal to render outside normal DOM
   - Wrap in AnimatePresence for exit animations
   - Create motion.div for drawer panel

4. **Configure positioning and styling**
   - Classes: `fixed left-0 top-0 h-full w-[80vw] max-w-[320px] bg-white shadow-2xl overflow-y-auto z-50`
   - Position fixed, left-aligned, full height

5. **Add Framer Motion animation**
   - Variants: `hidden: { x: "-100%" }`, `visible: { x: 0 }`
   - Duration: 300ms enter, 200ms exit
   - Easing: ease-out (enter), ease-in (exit)

6. **Implement focus trap**
   - Use react-focus-trap library or custom implementation
   - Trap focus within drawer when open
   - Return focus to button on close

7. **Add scroll lock**
   - useEffect: Set `document.body.style.overflow = 'hidden'` when open
   - Cleanup: Reset to 'auto' on unmount

8. **Handle Escape key**
   - Add keydown listener for Escape key
   - Close drawer when pressed

9. **Structure drawer sections**
   - DrawerHeader (Task 57)
   - MobileSearch (Task 64)
   - MobileNavList (Task 59)
   - MobileAccountLinks (Task 65)
   - MobileContactInfo (Task 66)

### Key Specifications
- Width: 80vw, max 320px
- Z-index: 50
- Animation: Slide from left (-100% to 0)
- ARIA: `role="dialog"`, `aria-label="Mobile navigation"`, `aria-modal="true"`

### Expected Outcome
- Smooth sliding drawer from left
- Full height, scrollable content
- Focus trapped, body scroll locked
- Escape closes drawer

### Verification Checklist
- [ ] Drawer renders in portal
- [ ] Slides smoothly (300ms)
- [ ] Focus trap works
- [ ] Body scroll locked when open
- [ ] Escape key closes drawer
- [ ] ARIA attributes set

---

## Task 56: Create Drawer Backdrop

### Overview
Create semi-transparent backdrop behind drawer, fades in/out, closes drawer when clicked.

### Dependencies
- Task 55: Create Mobile Nav Drawer

### Instructions

1. **Create component file**
   - Create `DrawerBackdrop.tsx` in `MobileNav/` directory

2. **Define props**
   - Interface: `{ onClose: () => void }`

3. **Create backdrop structure**
   - Use motion.div from Framer Motion
   - Classes: `fixed inset-0 bg-black bg-opacity-50 z-40 cursor-pointer`
   - Add onClick handler to call onClose

4. **Add fade animation**
   - Variants: `hidden: { opacity: 0 }`, `visible: { opacity: 0.5 }`
   - Duration: 200ms enter, 150ms exit

5. **Set accessibility**
   - Add `aria-hidden="true"`

### Key Specifications
- Position: fixed, full screen (inset-0)
- Z-index: 40 (below drawer at 50)
- Color: black 50% opacity
- Click closes drawer

### Expected Outcome
- Semi-transparent overlay behind drawer
- Smooth fade in/out
- Clicking closes drawer

### Verification Checklist
- [ ] Backdrop covers full viewport
- [ ] Z-index correct (40)
- [ ] Opacity 50%
- [ ] Click calls onClose
- [ ] Fade animation smooth

---

## Task 57: Create Drawer Header

### Overview
Create header for drawer with store logo and close button, bottom border separation.

### Dependencies
- Task 55: Create Mobile Nav Drawer

### Instructions

1. **Create component file**
   - Create `DrawerHeader.tsx` in `MobileNav/` directory

2. **Define props**
   - Interface: `{ onClose: () => void; logoSrc?: string }`

3. **Create header structure**
   - Use semantic `<header>` element
   - Classes: `flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white`

4. **Add logo section**
   - Use Next.js Image component
   - Size: 32-40px height
   - Alt text: "Store Name" or "Logo"
   - Optional: wrap in Link to "/"

5. **Add close button placeholder**
   - Space for CloseDrawerButton (Task 58)
   - Will be filled in next task

### Key Specifications
- Layout: flexbox, space-between
- Height: ~56-64px
- Border: bottom border-gray-200
- Logo: 32-40px, left-aligned
- Close button area: 44x44px, right-aligned

### Expected Outcome
- Clean header with logo and close button space
- Bottom border separates from content
- Proper spacing

### Verification Checklist
- [ ] Semantic `<header>` element used
- [ ] Logo displays on left
- [ ] Space for close button on right
- [ ] Bottom border present
- [ ] Flexbox layout correct

---

## Task 58: Create Close Drawer Button

### Overview
Create close button with X icon for drawer header, includes hover/focus states.

### Dependencies
- Task 57: Create Drawer Header

### Instructions

1. **Create component file**
   - Can be part of DrawerHeader or separate `CloseDrawerButton.tsx`

2. **Import dependencies**
   - Import X icon from Lucide React

3. **Define props**
   - Interface: `{ onClose: () => void; className?: string }`

4. **Create button structure**
   - `<button type="button">`
   - Render `<X size={20} />` icon

5. **Apply styling**
   - Classes: `w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors`

6. **Add accessibility**
   - `aria-label="Close menu"`
   - `aria-controls="mobile-nav-drawer"`

7. **Implement click handler**
   - Call onClose function

### Key Specifications
- Size: 44x44px touch target
- Icon: X, 20-24px
- Hover: bg-gray-100
- Focus: ring-2

### Expected Outcome
- Touch-friendly close button
- Clear X icon
- Smooth hover/focus states
- Closes drawer on click

### Verification Checklist
- [ ] Button 44x44px
- [ ] X icon renders
- [ ] `aria-label` set
- [ ] Hover/focus states work
- [ ] Click closes drawer

---

## Task 59: Create Mobile Nav List

### Overview
Create navigation list component that renders all nav items vertically.

### Dependencies
- Task 55: Create Mobile Nav Drawer

### Instructions

1. **Create component file**
   - Create `MobileNavList.tsx` in `MobileNav/` directory

2. **Define navigation data structure**
   - TypeScript interface: `{ id: string; label: string; href: string; children?: NavigationItem[] }`

3. **Define props**
   - Interface: `{ items: NavigationItem[]; onItemClick?: (item) => void }`

4. **Create list structure**
   - Use semantic `<nav>` element with `aria-label="Mobile navigation"`
   - Use `<ul>` with `list-none space-y-1 w-full py-4`
   - Map items to MobileNavItem components

5. **Pass props to items**
   - Pass item data, onItemClick handler

### Key Specifications
- Container: `<nav>` with aria-label
- List: `<ul>` no bullets, vertical spacing
- Items: Map through array rendering MobileNavItem

### Expected Outcome
- Vertical list of navigation items
- Semantic HTML structure
- Renders simple links and submenu parents

### Verification Checklist
- [ ] `<nav>` element used
- [ ] `aria-label` set
- [ ] Maps through items
- [ ] Renders MobileNavItem components
- [ ] No bullet points

---

## Task 60: Create Mobile Nav Item

### Overview
Create individual navigation item component for links and submenu parents, includes active state detection.

### Dependencies
- Task 59: Create Mobile Nav List

### Instructions

1. **Create component file**
   - Create `MobileNavItem.tsx` in `MobileNav/` directory

2. **Import dependencies**
   - Import React, Next.js Link, usePathname, ChevronRight from Lucide

3. **Define props**
   - Interface: `{ label: string; href?: string; icon?: ComponentType; hasChildren?: boolean; onClick?: () => void }`

4. **Detect active state**
   - Use `usePathname()` to get current route
   - Compare with href
   - Set isActive boolean

5. **Create item structure**
   - Wrap in `<li>`
   - Use Link if href, button if submenu parent
   - Layout: `flex items-center justify-between w-full min-h-[48px] px-4 py-3`

6. **Render content**
   - Left: optional icon + label
   - Right: ChevronRight if hasChildren

7. **Apply styling**
   - Base: `text-base text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors`
   - Active: `bg-gray-100 text-primary font-semibold`

8. **Handle clicks**
   - Simple link: close drawer, navigate
   - Submenu parent: call onClick to toggle

9. **Add accessibility**
   - `aria-current="page"` if active
   - `aria-expanded={expanded}` if submenu parent

### Key Specifications
- Min height: 48px (touch-friendly)
- Layout: flexbox, space-between
- Active state: bg-gray-100, text-primary, font-semibold
- Chevron: shown if hasChildren

### Expected Outcome
- Touch-friendly nav items
- Active state highlights current page
- Chevron for submenus
- Closes drawer on link click

### Verification Checklist
- [ ] Min height 48px
- [ ] Active state detected
- [ ] Active styling applied
- [ ] Chevron shows if hasChildren
- [ ] Click closes drawer (links)
- [ ] `aria-current` set if active

---

## Task 61: Create Mobile Submenu

### Overview
Create expandable submenu component with slide-down animation, renders child items with indentation.

### Dependencies
- Task 60: Create Mobile Nav Item

### Instructions

1. **Create component file**
   - Create `MobileSubmenu.tsx` in `MobileNav/` directory

2. **Import dependencies**
   - Import React, useState, Framer Motion (optional), MobileNavItem

3. **Define props**
   - Interface: `{ parentLabel: string; items: NavigationItem[]; isOpen?: boolean; onToggle?: () => void }`

4. **Set up state**
   - Use useState or accept controlled isOpen/onToggle props

5. **Create structure**
   - Parent button: renders like MobileNavItem with chevron
   - Child list: ul element that expands/collapses

6. **Implement parent button**
   - Click toggles expanded state
   - Chevron rotates 90° when expanded: `transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`

7. **Render children conditionally**
   - Only render when isOpen is true
   - Map items array to MobileNavItem components
   - Add indentation: `pl-8` or `pl-10` or `pl-12`

8. **Apply animation**
   - CSS: `max-height` transition or `grid-rows` technique
   - Framer Motion: height 0 to auto with opacity fade
   - Duration: 250ms

9. **Style child items**
   - Indentation: `pl-10`
   - Font size: `text-sm`
   - Text color: `text-gray-600`
   - Min height: 48px

10. **Add accessibility**
    - Parent: `aria-expanded={isOpen}`, `aria-controls="submenu-{id}"`
    - Submenu: unique ID

### Key Specifications
- Parent: Clickable button with rotating chevron
- Children: Indented (pl-10), smaller text (text-sm)
- Animation: Slide down 250ms
- Max depth: 2 levels

### Expected Outcome
- Smooth expanding/collapsing submenu
- Child items indented and styled
- Chevron rotates with state
- Touch-friendly

### Verification Checklist
- [ ] Parent toggles on click
- [ ] Chevron rotates 90°
- [ ] Children render when expanded
- [ ] Children indented (pl-10)
- [ ] Animation smooth (250ms)
- [ ] `aria-expanded` set

---

## Task 62: Create Submenu Toggle

### Overview
Implement submenu toggle state management, ensuring only one submenu open at a time (accordion behavior).

### Dependencies
- Task 61: Create Mobile Submenu

### Instructions

1. **Choose implementation approach**
   - Option A: useState in parent component (MobileNavList)
   - Option B: Custom hook (useSubmenuToggle)
   - Option C: Zustand store slice

2. **Define state structure**
   - Track: `openSubmenuId: string | null`

3. **Implement toggle function**
   - If opening: set openSubmenuId to clicked id (closes others)
   - If already open: set to null (close it)

4. **Create helper functions**
   - `isSubmenuOpen(id: string): boolean` - checks if specific submenu is open
   - `toggleSubmenu(id: string): void` - toggles submenu state
   - `closeAllSubmenus(): void` - resets all submenus

5. **Reset on drawer close**
   - Use useEffect to listen for drawer state
   - Close all submenus when drawer closes

6. **Pass state to submenu components**
   - Pass isOpen and onToggle props to each submenu
   - Or use context/store for global access

7. **Add keyboard navigation**
   - Arrow keys navigate items
   - Enter/Space toggle submenu
   - Escape closes current submenu

### Key Specifications
- State: Track single openSubmenuId
- Behavior: Accordion (only one open)
- Reset: Close all on drawer close

### Expected Outcome
- Only one submenu open at a time
- Smooth toggle animations
- State resets when drawer closes

### Verification Checklist
- [ ] Toggle function implemented
- [ ] Only one submenu open at time
- [ ] State resets on drawer close
- [ ] isSubmenuOpen function works
- [ ] Keyboard navigation supported

---

## Summary

This document established mobile navigation infrastructure with menu button, animated hamburger icon, slide-in drawer with backdrop, header with close button, navigation list, and expandable submenus. All components integrate with Zustand store and include proper accessibility features.

### Completed Tasks
1. ✓ Created mobile menu button
2. ✓ Created animated hamburger icon
3. ✓ Created mobile nav drawer
4. ✓ Created drawer backdrop
5. ✓ Created drawer header
6. ✓ Created close drawer button
7. ✓ Created mobile nav list
8. ✓ Created mobile nav item
9. ✓ Created mobile submenu
10. ✓ Created submenu toggle

### Next Steps
Proceed to [02_Tasks-63-68_Search-Account-Verify.md](02_Tasks-63-68_Search-Account-Verify.md) to implement mobile search, account links, contact info, animations, and verification.

---
