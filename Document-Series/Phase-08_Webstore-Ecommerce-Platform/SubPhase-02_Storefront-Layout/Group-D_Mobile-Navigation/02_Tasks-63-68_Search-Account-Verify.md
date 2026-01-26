# Tasks 63-68: Mobile Search, Account Links, Contact Info, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** D - Mobile Navigation  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-62_Menu-Drawer-Submenu.md](01_Tasks-53-62_Menu-Drawer-Submenu.md)
- **→ Next Group:** [../Group-E_Footer-Components/](../Group-E_Footer-Components/)

---

## Document Overview

This document completes mobile navigation with search input, account links, Sri Lankan contact information (phone and WhatsApp), comprehensive animations, and thorough verification testing.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create Submenu Items | Low | 20 min |
| 64 | Create Mobile Search | Low | 30 min |
| 65 | Create Mobile Account Links | Low | 30 min |
| 66 | Create Mobile Contact Info | Low | 35 min |
| 67 | Create Drawer Animation | Medium | 40 min |
| 68 | Verify Mobile Navigation | Low | 45 min |

---

## Task 63: Create Submenu Items

### Overview
Create individual submenu item components that render as indented child links within expanded submenus. Close drawer upon navigation.

### Dependencies
- Task 61: Create Mobile Submenu
- Task 60: Create Mobile Nav Item

### Instructions

1. **Determine if separate component needed**
   - Check if MobileNavItem can handle submenu items with `isChild` prop
   - Or create new `MobileSubmenuItem.tsx` if needed

2. **Define props**
   - Interface: `{ label: string; href: string; icon?: ComponentType; parentLabel?: string }`

3. **Create item structure**
   - Wrap in `<li>`
   - Use Next.js Link component

4. **Apply child-specific styling**
   - Indentation: `pl-10` or `pl-12`
   - Font: `text-sm text-gray-600`
   - Height: `min-h-[48px]` (touch-friendly)
   - Layout: `flex items-center w-full py-3 pr-4`

5. **Detect active state**
   - Use `usePathname()` to compare with href
   - Apply active styling if match

6. **Style active items**
   - Active: `bg-primary-50 text-primary-700 font-medium`

7. **Add hover/focus states**
   - Hover: `hover:bg-gray-50`
   - Focus: `focus:outline-none focus:bg-gray-50`
   - Transition: `transition-colors duration-150`

8. **Implement click handler**
   - Close drawer on click via Zustand store
   - Navigate via Link component

9. **Handle long labels**
   - Use `truncate` or allow wrapping
   - Test on small screens

10. **Add accessibility**
    - `aria-current="page"` if active
    - Proper keyboard navigation

### Key Specifications
- Indentation: pl-10 (40px) for hierarchy
- Font: text-sm (14px), lighter than parent
- Min height: 48px (touch target)
- Active: bg-primary-50, text-primary-700, font-medium

### Expected Outcome
- Indented child links within submenus
- Active state highlights current page
- Closes drawer on navigation
- Touch-friendly sizing

### Verification Checklist
- [ ] Items indented properly (pl-10)
- [ ] Font smaller than parent (text-sm)
- [ ] Min height 48px
- [ ] Active state detected
- [ ] Hover/focus states work
- [ ] Click closes drawer
- [ ] Navigation works

---

## Task 64: Create Mobile Search

### Overview
Create mobile search input that appears at top of drawer, submits to search page with query parameter.

### Dependencies
- Task 55: Create Mobile Nav Drawer

### Instructions

1. **Create component file**
   - Create `MobileSearch.tsx` in `MobileNav/` directory

2. **Import dependencies**
   - Import React, useState, Next.js useRouter, Search icon from Lucide

3. **Set up state**
   - `const [searchQuery, setSearchQuery] = useState('')`

4. **Create form structure**
   - Use `<form>` element for semantic HTML
   - Handle onSubmit event

5. **Design input field**
   - Container: `p-4 border-b border-gray-200`
   - Input wrapper: `relative w-full`
   - Input: `w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary`
   - Placeholder: "Search products, categories..."

6. **Add search icon**
   - Position: `absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`
   - Size: 20px

7. **Implement submission**
   - Prevent default form submission
   - Navigate to `/search?q={searchQuery}`
   - Optionally close drawer

8. **Add clear button (optional)**
   - Show X icon when input has value
   - Position: `absolute right-2`
   - Click clears input: `setSearchQuery('')`

9. **Mobile keyboard optimization**
   - `type="search"` for search keyboard
   - `autocomplete="off"`
   - `autocapitalize="off"`
   - `spellcheck="false"`
   - `autoFocus={false}` (don't steal focus)

10. **Add accessibility**
    - Label: `<label>` (can be visually hidden)
    - `aria-label="Search"` on input

### Key Specifications
- Position: Top of drawer, below header
- Width: Full drawer width
- Height: 40-44px input
- Border: Bottom separator
- Mobile keyboard: type="search"

### Expected Outcome
- Full-width search input in drawer
- Submits to /search?q={query}
- Mobile-optimized keyboard
- Optional clear button

### Verification Checklist
- [ ] Input renders in drawer
- [ ] Search icon on left
- [ ] Submit navigates to search page
- [ ] Query parameter correct
- [ ] Mobile keyboard (type="search")
- [ ] Clear button works (if added)
- [ ] Focus styles visible
- [ ] Aria-label present

---

## Task 65: Create Mobile Account Links

### Overview
Create account links component showing different links based on auth state: guest (Login, Register) vs authenticated (Account, Orders, Logout).

### Dependencies
- Task 55: Create Mobile Nav Drawer
- Authentication system

### Instructions

1. **Create component file**
   - Create `MobileAccountLinks.tsx` in `MobileNav/` directory

2. **Import dependencies**
   - Import React, Next.js Link/useRouter, auth hook, icons (User, LogOut from Lucide)

3. **Access auth state**
   - Use auth hook: `const { isAuthenticated, user, logout } = useAuth()`

4. **Define link arrays**
   - Guest: `[{ label: 'Login', href: '/login', icon: User }, { label: 'Register', href: '/register', icon: UserPlus }]`
   - Authenticated: `[{ label: 'My Account', href: '/account', icon: User }, { label: 'Orders', href: '/account/orders', icon: Package }]`

5. **Create section structure**
   - Container: `border-t border-gray-200 py-4`
   - Optional title: `px-4 mb-2 text-xs font-semibold text-gray-500 uppercase`
   - Items container: `space-y-1`

6. **Style account links**
   - Layout: `flex items-center w-full min-h-[48px] px-4 py-3`
   - Icon: `w-5 h-5 mr-3 text-gray-400`
   - Text: `text-base text-gray-700`
   - Hover: `hover:bg-gray-100 transition-colors`

7. **Render conditionally**
   - Use ternary: `{isAuthenticated ? <AuthLinks /> : <GuestLinks />}`

8. **Implement logout**
   - Create logout handler function
   - Call `auth.logout()`
   - Close drawer (optional)
   - Redirect to home: `router.push('/')`

9. **Close drawer on link click**
   - Use Zustand store close function on navigation

10. **Add accessibility**
    - Semantic nav or section element
    - Keyboard navigation support

### Key Specifications
- Position: After nav list, before contact info
- Separation: border-t for visual distinction
- Links: Min-h-[48px] touch targets
- States: Guest (Login, Register) | Auth (Account, Orders, Logout)

### Expected Outcome
- Different links based on auth state
- Touch-friendly sizing
- Icons next to text
- Logout functionality
- Closes drawer on navigation

### Verification Checklist
- [ ] Auth state integration works
- [ ] Guest shows Login/Register
- [ ] Auth shows Account/Orders/Logout
- [ ] Icons display correctly
- [ ] Touch targets 48px
- [ ] Logout works and redirects
- [ ] Drawer closes on link click
- [ ] Keyboard nav works

---

## Task 66: Create Mobile Contact Info

### Overview
Create contact information component at drawer bottom with phone (+94 XX XXX XXXX), WhatsApp link, and optional hours.

### Dependencies
- Task 55: Create Mobile Nav Drawer

### Instructions

1. **Create component file**
   - Create `MobileContactInfo.tsx` in `MobileNav/` directory

2. **Import dependencies**
   - Import React, icons (Phone, MessageCircle, Clock from Lucide)

3. **Define contact data**
   - Phone: display "+94 77 123 4567", link "+94771234567"
   - WhatsApp: "94771234567"
   - Hours: "Mon-Sat: 9:00 AM - 8:00 PM" (optional)

4. **Define props**
   - Interface: `{ phone?: string; whatsapp?: string; hours?: string; showTitle?: boolean }`

5. **Create section structure**
   - Container: `border-t border-gray-200 py-4 px-4`
   - Optional title: `text-xs font-semibold text-gray-500 uppercase mb-3`
   - Items: `space-y-3`

6. **Implement phone link**
   - `<a href="tel:+94771234567">`
   - Layout: `flex items-center text-sm`
   - Icon: `<Phone className="w-5 h-5 mr-3 text-gray-400" />`
   - Text: "+94 77 123 4567"
   - Hover: `hover:text-primary transition-colors`

7. **Implement WhatsApp link**
   - `<a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer">`
   - Layout: same as phone
   - Icon: `<MessageCircle className="w-5 h-5 mr-3 text-gray-400" />`
   - Text: "Chat on WhatsApp"
   - Hover: `hover:text-primary transition-colors`

8. **Add operating hours (optional)**
   - Layout: `flex items-center text-sm text-gray-600`
   - Icon: `<Clock className="w-5 h-5 mr-3 text-gray-400" />`
   - Text: hours string
   - Non-clickable

9. **Format Sri Lankan phone**
   - Display: +94 XX XXX XXXX (with spaces)
   - Link: +94XXXXXXXXX (no spaces)
   - Example: Display "+94 77 123 4567", Link "tel:+94771234567"

10. **Add accessibility**
    - Descriptive link text (not just "Click here")
    - Icon + text combination
    - External link attributes for WhatsApp

### Key Specifications
- Position: Bottom of drawer
- Phone format: +94 XX XXX XXXX (Sri Lankan)
- WhatsApp: https://wa.me/94XXXXXXXXX
- Separation: border-t

### Expected Outcome
- Phone link opens dialer (tel:)
- WhatsApp opens in new tab
- Sri Lankan phone format
- Optional hours displayed
- Clean section styling

### Verification Checklist
- [ ] Phone in +94 format
- [ ] Phone link uses tel: protocol
- [ ] WhatsApp uses wa.me format
- [ ] WhatsApp opens new tab
- [ ] Icons display correctly
- [ ] Hover effects work
- [ ] Hours display (if added)
- [ ] Positioned at drawer bottom

---

## Task 67: Create Drawer Animation

### Overview
Create comprehensive animation system using Framer Motion for drawer, backdrop, submenus, and micro-interactions. Ensure smooth 60fps performance.

### Dependencies
- Tasks 55, 56, 61
- Framer Motion library

### Instructions

1. **Review existing animations**
   - Check drawer slide (Task 55)
   - Check backdrop fade (Task 56)
   - Check submenu expansion (Task 61)

2. **Create animation variants file**
   - Create `animations.ts` or constants in components
   - Define all variants in one place

3. **Define drawer animation variants**
   ```typescript
   drawerVariants = {
     hidden: { x: "-100%", transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
     visible: { x: 0, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }
   }
   ```

4. **Define backdrop variants**
   ```typescript
   backdropVariants = {
     hidden: { opacity: 0, transition: { duration: 0.15 } },
     visible: { opacity: 0.5, transition: { duration: 0.2 } }
   }
   ```

5. **Define nav list variants (stagger)**
   ```typescript
   navListVariants = {
     hidden: {},
     visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } }
   }
   navItemVariants = {
     hidden: { opacity: 0, x: -20 },
     visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
   }
   ```

6. **Define submenu variants**
   ```typescript
   submenuVariants = {
     collapsed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
     expanded: { height: "auto", opacity: 1, transition: { duration: 0.25, ease: "easeInOut" } }
   }
   ```

7. **Define timing constants**
   - DRAWER_ENTER: 300ms
   - DRAWER_EXIT: 200ms
   - BACKDROP_ENTER: 200ms
   - BACKDROP_EXIT: 150ms
   - SUBMENU: 250ms
   - STAGGER_DELAY: 30ms

8. **Apply AnimatePresence**
   - Wrap drawer and backdrop in AnimatePresence
   - Enable exit animations

9. **Add stagger to nav items**
   - Apply navListVariants to ul
   - Apply navItemVariants to each li

10. **Animate chevron rotation**
    - CSS: `transition-transform duration-200`
    - Classes: `${isOpen ? 'rotate-90' : 'rotate-0'}`

11. **Add micro-interactions**
    - Button press: `whileTap={{ scale: 0.95 }}`
    - Link hover: smooth color transitions

12. **Implement reduced motion**
    - Use `useReducedMotion()` hook
    - Simplify or disable animations if preferred
    - Maintain functionality

13. **Optimize performance**
    - Use transform and opacity only (GPU-accelerated)
    - Avoid animating width/height directly
    - Test on mobile devices for 60fps

14. **Test animation timing**
    - Ensure backdrop and drawer coordinate
    - No conflicts on rapid toggles
    - Smooth throughout

### Key Specifications
- Drawer: 300ms ease-out (enter), 200ms ease-in (exit)
- Backdrop: 200ms (enter), 150ms (exit)
- Stagger: 30ms delay between items
- Submenu: 250ms ease-in-out
- Properties: transform, opacity only

### Expected Outcome
- Smooth coordinated animations
- 60fps performance on mobile
- Staggered nav item entrance
- Reduced motion support
- No animation conflicts

### Verification Checklist
- [ ] Drawer slide smooth (300ms)
- [ ] Backdrop fade coordinated
- [ ] Nav items stagger
- [ ] Submenu animation smooth
- [ ] Chevron rotates (200ms)
- [ ] AnimatePresence applied
- [ ] Reduced motion supported
- [ ] 60fps on mobile devices
- [ ] No jank or conflicts

---

## Task 68: Verify Mobile Navigation

### Overview
Conduct comprehensive testing of mobile navigation across devices, browsers, screen sizes. Verify functionality, animations, accessibility, and performance.

### Dependencies
- All tasks in Group D (53-67)

### Instructions

1. **Set up testing environment**
   - Physical devices (iOS, Android)
   - Browser dev tools device emulation
   - Accessibility testing tools

2. **Test drawer functionality**
   - Open via menu button: drawer slides in, backdrop appears
   - Close via X button: drawer slides out
   - Close via backdrop click: drawer closes
   - Close via Escape key: drawer closes
   - Hamburger icon: morphs between hamburger and X

3. **Test navigation**
   - Simple links: navigate and close drawer
   - Submenu parents: expand/collapse on click
   - Submenu children: navigate and close drawer
   - Accordion behavior: only one submenu open at time

4. **Test search**
   - Focus input, type query
   - Submit via Enter: navigates to /search?q={query}
   - Clear button works (if added)
   - Mobile keyboard appears (type="search")

5. **Test account links**
   - Guest: Login/Register links work
   - Authenticated: Account/Orders/Logout work
   - Logout: logs out and redirects

6. **Test contact info**
   - Phone link: opens tel: dialer
   - WhatsApp: opens wa.me in new tab
   - Correct Sri Lankan format (+94)

7. **Test animations**
   - Drawer slide: smooth 300ms
   - Backdrop fade: smooth 200ms
   - Nav items: stagger on open
   - Submenu: smooth expand/collapse
   - No jank or stuttering

8. **Test accessibility**
   - Focus trap: focus stays in drawer
   - Keyboard nav: Tab, Enter, Space, Escape work
   - Screen reader: ARIA labels announce correctly
   - Color contrast: meets WCAG AA

9. **Test body scroll lock**
   - Open drawer: background doesn't scroll
   - Close drawer: scrolling re-enabled

10. **Test responsive behavior**
    - 320px: drawer 80% width, readable
    - 375px: no overflow
    - 425px: max-width 320px applied
    - 768-1023px: mobile menu still shown
    - 1024px+: mobile menu hidden

11. **Test on devices**
    - iPhone (Safari, Chrome)
    - Android (Chrome, Samsung Internet)
    - iPad (< 1024px width)

12. **Test performance**
    - Chrome DevTools Performance tab
    - Record animations: verify 60fps
    - Test on low-end device

13. **Test edge cases**
    - Rapid open/close: no conflicts
    - Long labels: truncate or wrap properly
    - Many submenu items: scrolling works
    - Drawer taller than viewport: vertical scroll enabled

14. **Create test checklist**
    - Document all test cases
    - Mark pass/fail
    - Note bugs and severity

15. **Fix issues**
    - Address critical bugs
    - Document workarounds
    - Create tickets for improvements

16. **Final sign-off**
    - Review results
    - Confirm critical functionality works
    - Approve for production

### Test Checklist

#### Functionality Tests
- [ ] Open drawer via button
- [ ] Close via X button
- [ ] Close via backdrop click
- [ ] Close via Escape key
- [ ] Hamburger animates to X
- [ ] Simple links navigate and close
- [ ] Submenu expands/collapses
- [ ] Submenu children navigate
- [ ] Search submits correctly
- [ ] Account links work (guest/auth)
- [ ] Logout works
- [ ] Phone link opens dialer
- [ ] WhatsApp opens in new tab

#### Animation Tests
- [ ] Drawer slide smooth (300ms)
- [ ] Backdrop fade smooth (200ms)
- [ ] Nav items stagger
- [ ] Submenu expand/collapse smooth
- [ ] Chevron rotates
- [ ] 60fps on mobile

#### Accessibility Tests
- [ ] Focus trap works
- [ ] Keyboard nav (Tab, Enter, Escape)
- [ ] ARIA labels correct
- [ ] Screen reader compatible
- [ ] Color contrast WCAG AA
- [ ] Touch targets 44x44px
- [ ] Reduced motion supported

#### Responsive Tests
- [ ] 320px: drawer adapts
- [ ] 375px: no overflow
- [ ] 425px: max-width applied
- [ ] 768-1023px: mobile menu shown
- [ ] 1024px+: mobile menu hidden

#### Device/Browser Tests
- [ ] iPhone Safari
- [ ] iPhone Chrome
- [ ] Android Chrome
- [ ] Android Samsung Internet
- [ ] iPad (< 1024px)

#### Performance Tests
- [ ] 60fps animations
- [ ] No layout thrashing
- [ ] Low-end device acceptable
- [ ] No memory leaks

#### Edge Cases
- [ ] Rapid open/close
- [ ] Long labels handled
- [ ] Many submenu items scrollable
- [ ] Drawer taller than viewport scrolls

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Janky animation | Use transform/opacity only, check FPS |
| Body scrolls behind drawer | Implement scroll lock with useEffect |
| Focus escapes drawer | Add focus trap (react-focus-trap) |
| Backdrop doesn't cover screen | Check fixed positioning and z-index |
| Links don't close drawer | Add onClick handler to close |

### Expected Outcome
- All functionality verified and working
- Animations smooth across devices
- Accessibility features functional
- Performance meets standards (60fps)
- Critical issues resolved
- Ready for production

### Verification Checklist
- [ ] All functionality tests passed
- [ ] All animation tests passed
- [ ] All accessibility tests passed
- [ ] All responsive tests passed
- [ ] Tested on iOS and Android
- [ ] Screen reader testing done
- [ ] Performance verified (60fps)
- [ ] Body scroll lock works
- [ ] Focus trap functional
- [ ] Edge cases tested
- [ ] Issues documented
- [ ] Critical bugs fixed
- [ ] Final sign-off obtained

---

## Summary

This document completed mobile navigation with search input, authentication-aware account links, Sri Lankan contact information, comprehensive Framer Motion animations, and thorough verification testing. The mobile navigation system now provides a complete, accessible, performant experience.

### Completed Tasks
1. ✓ Created submenu items with indentation
2. ✓ Created mobile search
3. ✓ Created account links
4. ✓ Created contact info (Sri Lankan format)
5. ✓ Created comprehensive animations
6. ✓ Verified mobile navigation

### Group D Complete

All 16 tasks in Group D (Mobile Navigation) are complete. The system provides:
- Animated mobile menu with hamburger icon
- Slide-in drawer with backdrop
- Drawer header with logo and close button
- Scrollable navigation with expandable submenus
- Mobile search input
- Authentication-aware account links
- Sri Lankan contact info (+94 phone, WhatsApp)
- Smooth Framer Motion animations
- Full accessibility (focus trap, keyboard nav, ARIA)
- Verified performance and functionality

### Next Steps
Proceed to [../Group-E_Footer-Components/](../Group-E_Footer-Components/) to implement storefront footer with newsletter, navigation, payment methods, and copyright.

---
