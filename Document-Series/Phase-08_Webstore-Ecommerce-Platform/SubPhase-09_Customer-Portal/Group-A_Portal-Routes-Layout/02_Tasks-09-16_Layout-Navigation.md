# Tasks 09-16: Layout & Navigation Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** A - Portal Routes & Layout  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Routes-Setup.md](01_Tasks-01-08_Routes-Setup.md)

---

## Document Overview

This document covers the creation of portal layout components and navigation system. It includes the settings route, portal sidebar with navigation items, active state indicators, mobile navigation drawer, portal header with user greeting, logout functionality, and verification of all portal routes. These components provide the navigation structure and user experience for the customer portal.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create Settings Route | Low | 20 min |
| 10 | Create Portal Sidebar | Medium | 40 min |
| 11 | Create Sidebar Nav Item | Low | 20 min |
| 12 | Create Active Nav Indicator | Low | 15 min |
| 13 | Create Mobile Nav Drawer | Medium | 45 min |
| 14 | Create Portal Header | Low | 25 min |
| 15 | Create Logout Button | Low | 20 min |
| 16 | Verify Portal Routes | Low | 30 min |

---

## Task 09: Create Settings Route

### Overview
Create the settings route where customers can manage their account preferences including password changes, notification settings, email preferences, and account deletion options. Provides comprehensive account configuration capabilities.

### Dependencies
- Task 01: Create Portal Directory

### Instructions

1. **Create settings directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `settings`

2. **Create page file**
   - Create `page.tsx` file in settings directory
   - This renders at `/account/settings/` route

3. **Define page metadata**
   - Export metadata with title "Account Settings"
   - Add description for settings page
   - Configure noindex for privacy

4. **Create page component**
   - Define default export async function `SettingsPage`
   - Fetch current user settings from API
   - Include form handling for updates

5. **Structure settings sections**
   - Organize settings into logical groups
   - Use tabs or accordion for section navigation
   - Group related settings together

6. **Implement profile settings section**
   - Full name editing
   - Email address (with verification)
   - Phone number
   - Date of birth (optional)
   - Profile picture upload (optional)

7. **Add password section**
   - Current password input
   - New password input with strength indicator
   - Confirm new password
   - Password requirements display
   - "Change Password" button

8. **Create notifications section**
   - Email notification preferences (order updates, promotions, newsletter)
   - SMS notification toggle
   - Push notification settings
   - Notification frequency options

9. **Add privacy section**
   - Order history visibility
   - Review visibility settings
   - Data sharing preferences
   - Cookie consent management

10. **Implement account actions section**
    - "Export My Data" button (GDPR compliance)
    - "Download Order History" button
    - "Delete Account" button (with confirmation)
    - Account status display

### Settings Page Sections

| Section | Settings | Priority |
|---------|----------|----------|
| Profile | Name, email, phone, picture | High |
| Password | Change password | High |
| Notifications | Email, SMS, push preferences | Medium |
| Privacy | Visibility, data sharing | Medium |
| Account Actions | Export data, delete account | Low |

### Profile Settings Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | Text input | Yes | Min 2 characters |
| Email Address | Email input | Yes | Valid email format |
| Phone Number | Tel input | No | Sri Lanka format |
| Date of Birth | Date picker | No | Age > 13 years |
| Profile Picture | File upload | No | Max 5MB, JPG/PNG |

### Settings Layout

```
┌──────────────────────────────────────────────────┐
│  Account Settings                                │
│  [Profile][Password][Notifications][Privacy]     │
├──────────────────────────────────────────────────┤
│  Profile Information                             │
│  ┌────────────────────────────────────────────┐ │
│  │ Full Name:     [John Doe____________]      │ │
│  │ Email:         [john@example.com____]      │ │
│  │ Phone:         [+94 77 123 4567_____]      │ │
│  │ Date of Birth: [Jan 15, 1990________]      │ │
│  │                                            │ │
│  │ [Save Changes]                             │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Change Password                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ Current Password:  [************]          │ │
│  │ New Password:      [************]          │ │
│  │ Confirm Password:  [************]          │ │
│  │                                            │ │
│  │ [Change Password]                          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Notifications                                   │
│  ┌────────────────────────────────────────────┐ │
│  │ □ Email - Order Updates                    │ │
│  │ □ Email - Promotions & Offers              │ │
│  │ □ Email - Newsletter                       │ │
│  │ □ SMS - Order Shipment Updates             │ │
│  │                                            │ │
│  │ [Save Preferences]                         │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Account Actions                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ [Export My Data]  [Delete Account]         │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Notification Preferences

| Setting | Options | Default |
|---------|---------|---------|
| Order Updates | Email, SMS, Both, None | Email |
| Promotions | Email only, None | Email |
| Newsletter | Email only, None | None |
| Shipment Alerts | Email, SMS, Both | Both |

### Password Requirements

| Requirement | Rule |
|-------------|------|
| Length | Minimum 8 characters |
| Uppercase | At least 1 uppercase letter |
| Lowercase | At least 1 lowercase letter |
| Number | At least 1 number |
| Special | At least 1 special character |
| Match | New passwords must match |

### Account Deletion Flow

```
1. User clicks "Delete Account"
   ↓
2. Show warning modal with consequences
   ↓
3. Require password confirmation
   ↓
4. Ask for deletion reason (optional)
   ↓
5. Send confirmation email
   ↓
6. Account marked for deletion (30-day grace period)
   ↓
7. Permanent deletion after grace period
```

### Form Validation

| Field | Validation | Error Message |
|-------|------------|---------------|
| Email | Valid format | "Please enter a valid email" |
| Phone | Sri Lanka format | "Please enter valid Sri Lankan number" |
| Password | Meets requirements | "Password must meet all requirements" |
| Confirm Password | Matches new password | "Passwords do not match" |

### Expected Outcome
- Functional settings page with multiple sections
- Profile information editing capability
- Password change functionality
- Notification preferences management
- Account deletion option with safeguards

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/settings/page.tsx` created
- [ ] Page renders at `/account/settings/` route
- [ ] Metadata configured with noindex
- [ ] Settings sections organized (profile, password, notifications)
- [ ] Form fields structured with validation
- [ ] Password change form planned
- [ ] Notification preferences toggles included
- [ ] Account deletion flow designed with confirmation

---

## Task 10: Create Portal Sidebar

### Overview
Create the portal sidebar component that provides primary navigation for the customer portal. Displays navigation links to all portal sections, active state indicators, user profile summary, and logout option. Responsive for desktop with full visibility.

### Dependencies
- Task 02: Create Portal Layout

### Instructions

1. **Create portal components directory**
   - Navigate to `frontend/components/storefront/` directory
   - Create new directory named `portal`
   - Create subdirectory named `Layout`

2. **Create PortalSidebar component file**
   - Create `PortalSidebar.tsx` in `components/storefront/portal/Layout/` directory
   - Set up TypeScript React functional component

3. **Define component structure**
   - Export default function `PortalSidebar`
   - No props required (uses auth context for user)
   - Return sidebar container with navigation

4. **Implement sidebar container**
   - Fixed width: 256px for desktop
   - Full height with background color
   - Border on right side
   - Proper padding for content

5. **Add user profile section**
   - Display user's name or email at top
   - Optional profile picture/avatar
   - Account type badge (if applicable)
   - Subtle background to separate from nav

6. **Structure navigation menu**
   - Create navigation list with links
   - Group related links if needed
   - Use semantic HTML (nav, ul, li)
   - Proper ARIA labels for accessibility

7. **Define navigation items**
   - Dashboard link with home icon
   - Orders link with shopping bag icon
   - Addresses link with location icon
   - Wishlist link with heart icon
   - Reviews link with star icon
   - Settings link with gear icon

8. **Add visual styling**
   - Consistent spacing between items
   - Icon + text layout for each link
   - Hover states with background color
   - Active state highlighting
   - Proper text colors and contrast

9. **Implement responsive behavior**
   - Hidden on mobile (below 768px)
   - Visible on tablet and desktop
   - Full height sticky positioning
   - Scroll if content overflows

### Sidebar Sections

| Section | Content | Position |
|---------|---------|----------|
| User Profile | Name, avatar, account type | Top |
| Primary Nav | Main navigation links | Middle |
| Secondary Nav | Settings, help | Bottom |
| Logout | Logout button | Very Bottom |

### Navigation Items

| Item | Icon | Route | Badge |
|------|------|-------|-------|
| Dashboard | Home | /account/dashboard/ | None |
| Orders | Shopping Bag | /account/orders/ | Pending count |
| Addresses | Location Pin | /account/addresses/ | None |
| Wishlist | Heart | /account/wishlist/ | Item count |
| Reviews | Star | /account/reviews/ | None |
| Settings | Gear | /account/settings/ | None |

### Sidebar Layout

```
┌──────────────────────┐
│                      │
│  ┌────────────────┐ │  ← User Profile
│  │  [Avatar] JD   │ │
│  │  John Doe      │ │
│  └────────────────┘ │
│                      │
├──────────────────────┤
│                      │
│  ⌂  Dashboard       │  ← Active (highlighted)
│                      │
│  🛍  Orders      [2] │  ← Badge showing count
│                      │
│  📍  Addresses       │
│                      │
│  ♥  Wishlist    [8] │  ← Badge showing count
│                      │
│  ★  Reviews          │
│                      │
├──────────────────────┤
│                      │
│  ⚙  Settings         │
│                      │
│  [Logout Button]     │  ← Bottom of sidebar
│                      │
└──────────────────────┘
```

### User Profile Section

| Element | Display | Styling |
|---------|---------|---------|
| Avatar | User initials or photo | Circle, 40px |
| Name | Full name or username | Bold text |
| Email | User's email (truncated) | Small gray text |
| Badge | Account type (if premium) | Small colored badge |

### Navigation Item States

| State | Visual | Behavior |
|-------|--------|----------|
| Default | Gray text, white bg | Normal link |
| Hover | Darker text, light bg | Show cursor pointer |
| Active | Primary color, accent bg | Current page indicator |
| Disabled | Light gray, no cursor | Not clickable |

### Badge Display

| Badge Type | Color | Purpose |
|------------|-------|---------|
| Count | Blue/Primary | Show number of items |
| New | Green | Highlight new content |
| Alert | Red | Urgent attention needed |

### Responsive Behavior

| Breakpoint | Sidebar State | Alternative |
|------------|---------------|-------------|
| Mobile (< 768px) | Hidden | Use mobile drawer (Task 13) |
| Tablet (768px - 1024px) | Visible, can collapse | Toggle button in header |
| Desktop (> 1024px) | Always visible | Fixed position |

### Expected Outcome
- Functional sidebar component for desktop
- User profile section at top
- Navigation links to all portal pages
- Active state indicator
- Badge support for counts
- Proper hover and focus states

### Verification Checklist
- [ ] `PortalSidebar.tsx` component created
- [ ] User profile section included
- [ ] Navigation items structured with icons
- [ ] Active state styling defined
- [ ] Badge support for counts planned
- [ ] Responsive behavior configured (desktop only)
- [ ] Proper semantic HTML and accessibility

---

## Task 11: Create Sidebar Nav Item

### Overview
Create a reusable SidebarNavItem component for individual navigation links in the portal sidebar. This component handles link rendering, active state detection, icon display, badge counts, and accessibility features.

### Dependencies
- Task 10: Create Portal Sidebar

### Instructions

1. **Create component file**
   - Create `SidebarNavItem.tsx` in `components/storefront/portal/Layout/` directory
   - Set up TypeScript React functional component

2. **Define component props interface**
   - `href`: string (navigation URL)
   - `icon`: React component or element
   - `label`: string (link text)
   - `badge`: optional number (count to display)
   - `isActive`: optional boolean (for active state)

3. **Implement component structure**
   - Use Next.js Link component for navigation
   - Wrap icon and label in proper layout
   - Include badge if count provided
   - Apply active state styling conditionally

4. **Structure link layout**
   - Flex container for horizontal layout
   - Icon on left side (20px × 20px)
   - Label text in middle (flex-grow)
   - Badge on right side (if present)
   - Proper spacing between elements

5. **Add active state detection**
   - Accept isActive prop or use usePathname hook
   - Apply different styles when active
   - Change background color and text color
   - Add left border accent for active item

6. **Implement badge display**
   - Render badge only if count > 0
   - Small circular or pill badge
   - Display count number
   - Use brand color for badge background
   - Limit display to 99+ for large numbers

7. **Add accessibility features**
   - Proper ARIA labels for screen readers
   - Include aria-current when active
   - Ensure keyboard navigation works
   - Focus visible indicator

8. **Style hover and focus states**
   - Background color change on hover
   - Smooth transition animations
   - Focus ring for keyboard navigation
   - Cursor pointer on hover

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| href | string | Yes | - | Navigation URL |
| icon | ReactNode | Yes | - | Icon component to display |
| label | string | Yes | - | Link text label |
| badge | number | No | undefined | Count to show in badge |
| isActive | boolean | No | false | Whether link is active |

### NavItem Layout

```
┌────────────────────────────────┐
│  [Icon]  Label          [99+] │
│   ↑       ↑               ↑   │
│   Icon    Text           Badge│
│  (20px)  (flex-grow)    (opt) │
└────────────────────────────────┘
```

### Visual States

| State | Background | Text Color | Border | Icon Color |
|-------|-----------|-----------|--------|------------|
| Default | Transparent | gray-700 | None | gray-500 |
| Hover | gray-100 | gray-900 | None | gray-700 |
| Active | blue-50 | blue-700 | Left blue-600 | blue-600 |
| Focus | gray-100 | gray-900 | Focus ring | gray-700 |

### Badge Styling

| Element | Style | Purpose |
|---------|-------|---------|
| Container | Rounded, min-width | Consistent shape |
| Background | Primary color | Visibility |
| Text | White, small font | Readability |
| Max Display | 99+ for counts > 99 | Prevent overflow |

### Active State Indicator

```
Active Link
┃  [Icon]  Dashboard
┃  ← Left border (3px blue)

Inactive Link
   [Icon]  Orders
```

### Accessibility Attributes

| Attribute | Value | When |
|-----------|-------|------|
| aria-label | Link label + badge count | Always |
| aria-current | "page" | When active |
| role | "link" | Always (implicit) |
| tabIndex | 0 | Always (implicit) |

### Usage Examples

```
Basic Link
<SidebarNavItem 
  href="/account/dashboard"
  icon={<HomeIcon />}
  label="Dashboard"
/>

Link with Badge
<SidebarNavItem 
  href="/account/orders"
  icon={<ShoppingBagIcon />}
  label="Orders"
  badge={3}
/>

Active Link
<SidebarNavItem 
  href="/account/wishlist"
  icon={<HeartIcon />}
  label="Wishlist"
  badge={8}
  isActive={true}
/>
```

### Expected Outcome
- Reusable navigation item component
- Icon, label, and optional badge display
- Active state styling
- Hover and focus states
- Full accessibility support
- Smooth transitions

### Verification Checklist
- [ ] `SidebarNavItem.tsx` component created
- [ ] Props interface defined with all required fields
- [ ] Link layout structured (icon, label, badge)
- [ ] Active state styling implemented
- [ ] Badge display logic included
- [ ] Hover and focus states defined
- [ ] Accessibility attributes added
- [ ] Component reusable in sidebar

---

## Task 12: Create Active Nav Indicator

### Overview
Create visual indicator system to highlight the active navigation item in the sidebar. Uses URL path matching to determine active state and applies distinct styling including border accent, background color, and text highlighting.

### Dependencies
- Task 11: Create Sidebar Nav Item

### Instructions

1. **Implement active state detection**
   - Use Next.js usePathname hook to get current URL
   - Compare current path with nav item href
   - Handle exact matches and parent path matches
   - Return boolean for active state

2. **Create path matching utility**
   - Exact match: path === href
   - Parent match: path starts with href (for nested routes)
   - Handle trailing slashes consistently
   - Account for dynamic routes

3. **Define active styling**
   - Background color: light blue or brand color tint
   - Text color: darker or brand color
   - Left border: 3-4px solid brand color
   - Icon color: match text color

4. **Add visual transitions**
   - Smooth color transitions on state change
   - Animate border appearance
   - Duration: 150-200ms
   - Easing: ease-in-out

5. **Handle nested routes**
   - Orders route should be active when viewing order details
   - Parent item stays highlighted for child pages
   - Use startsWith for parent matching
   - Define exceptions if needed

6. **Apply to all nav items**
   - Update each SidebarNavItem to use detection
   - Pass isActive prop based on path matching
   - Ensure consistent behavior across all items

### Path Matching Strategy

| Current Path | Nav Item Href | Match Type | Active? |
|--------------|---------------|------------|---------|
| /account/dashboard/ | /account/dashboard/ | Exact | Yes |
| /account/orders/ | /account/orders/ | Exact | Yes |
| /account/orders/12345 | /account/orders/ | Parent | Yes |
| /account/wishlist/ | /account/orders/ | None | No |

### Active State Styling

| Property | Inactive Value | Active Value | Transition |
|----------|---------------|--------------|------------|
| Background | transparent | blue-50 | 200ms |
| Text Color | gray-700 | blue-700 | 200ms |
| Icon Color | gray-500 | blue-600 | 200ms |
| Border Left | 0px transparent | 3px blue-600 | 200ms |
| Font Weight | normal | medium | instant |

### Path Matching Logic

```
Function: isNavItemActive(itemHref, currentPath)

1. Normalize both paths (remove trailing slash)
2. Check exact match: itemHref === currentPath
   → If true, return true
3. Check parent match: currentPath starts with itemHref
   → If true and not root, return true
4. Return false
```

### Special Route Handling

| Route Type | Example | Active Logic |
|------------|---------|--------------|
| Root | /account/dashboard/ | Exact match only |
| List | /account/orders/ | Exact or starts with |
| Detail | /account/orders/[id] | Parent route is active |
| Settings | /account/settings/ | Exact match only |

### Visual Hierarchy

```
Navigation with Active Indicator

  Dashboard           ← Inactive (gray)
┃ Orders              ← Active (blue bg, blue text, left border)
  Addresses           ← Inactive (gray)
  Wishlist            ← Inactive (gray)
  Reviews             ← Inactive (gray)
  Settings            ← Inactive (gray)
```

### Expected Outcome
- Automatic active state detection based on URL
- Visual indication of current page
- Parent routes stay active for child pages
- Smooth transitions between states
- Consistent behavior across all nav items

### Verification Checklist
- [ ] Active state detection logic implemented
- [ ] usePathname hook used for current path
- [ ] Path matching handles exact and parent matches
- [ ] Active styling applied (background, border, colors)
- [ ] Transitions smooth and fast
- [ ] Works correctly for nested routes
- [ ] All navigation items use active detection

---

## Task 13: Create Mobile Nav Drawer

### Overview
Create a mobile navigation drawer component that slides in from the left side on mobile devices. Provides access to all portal navigation items when sidebar is hidden on small screens. Includes backdrop overlay, slide animation, and close button.

### Dependencies
- Task 10: Create Portal Sidebar

### Instructions

1. **Create drawer component file**
   - Create `MobileNavDrawer.tsx` in `components/storefront/portal/Layout/` directory
   - Set up TypeScript React functional component

2. **Define component props**
   - `isOpen`: boolean (drawer visibility state)
   - `onClose`: function (close drawer callback)
   - No children prop (uses same nav items as sidebar)

3. **Implement drawer overlay**
   - Fixed position covering entire viewport
   - Dark semi-transparent background (backdrop)
   - Click overlay to close drawer
   - Z-index above page content but below modals

4. **Create drawer panel**
   - Fixed position on left side
   - Width: 280px or 80% of screen width
   - Full height (100vh)
   - Slide animation from left
   - White background

5. **Add drawer header**
   - Close button (X icon) on right side
   - Optional title or logo
   - Border bottom to separate from content
   - Proper padding

6. **Structure drawer content**
   - User profile section (same as sidebar)
   - Navigation items list (reuse SidebarNavItem)
   - Logout button at bottom
   - Scroll if content overflows

7. **Implement slide animation**
   - Transform: translateX(-100%) when closed
   - Transform: translateX(0) when open
   - Transition duration: 300ms
   - Easing: ease-out

8. **Add backdrop animation**
   - Opacity: 0 when closed
   - Opacity: 0.5 when open
   - Transition: 200ms
   - Fade in/out effect

9. **Handle touch gestures**
   - Swipe left to close drawer
   - Swipe from edge to open (optional)
   - Prevent body scroll when open
   - Touch-friendly close button

10. **Ensure accessibility**
    - Trap focus within drawer when open
    - Escape key to close drawer
    - Proper ARIA attributes (role="dialog")
    - Focus close button on open

### Drawer Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| isOpen | boolean | Yes | Drawer visibility state |
| onClose | () => void | Yes | Callback to close drawer |

### Drawer Layout Structure

```
Mobile Screen with Drawer Open
┌─────────────────────────────────────┐
│ ████████████████████████  Backdrop  │
│ █┌──────────────┐███████            │
│ █│   [X]        │███████  ← Close   │
│ █├──────────────┤███████            │
│ █│ [Avatar] JD  │███████  ← Profile │
│ █│ John Doe     │███████            │
│ █├──────────────┤███████            │
│ █│ Dashboard    │███████            │
│ █│ Orders   [2] │███████  ← Nav     │
│ █│ Addresses    │███████            │
│ █│ Wishlist [8] │███████            │
│ █│ Reviews      │███████            │
│ █├──────────────┤███████            │
│ █│ Settings     │███████            │
│ █│ [Logout]     │███████            │
│ █└──────────────┘███████            │
│ ████████████████████████            │
└─────────────────────────────────────┘
  ← Drawer panel (280px)
```

### Animation States

| State | Transform | Opacity (Backdrop) | Duration |
|-------|-----------|-------------------|----------|
| Closed | translateX(-100%) | 0 | 300ms |
| Opening | translateX(-100%) → translateX(0) | 0 → 0.5 | 300ms |
| Open | translateX(0) | 0.5 | - |
| Closing | translateX(0) → translateX(-100%) | 0.5 → 0 | 300ms |

### Drawer Sections

| Section | Content | Position |
|---------|---------|----------|
| Header | Close button, optional title | Top |
| Profile | User info | Below header |
| Navigation | Portal links | Middle (scrollable) |
| Footer | Settings, logout | Bottom |

### Close Triggers

| Trigger | Action | Behavior |
|---------|--------|----------|
| Close Button (X) | Click | Close drawer |
| Backdrop Click | Click outside | Close drawer |
| Escape Key | Keyboard | Close drawer |
| Swipe Left | Touch gesture | Close drawer |
| Navigation Click | Click any link | Close drawer + navigate |

### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Focus Trap | Trap focus in drawer | Keyboard navigation |
| ARIA Role | role="dialog" | Screen reader context |
| ARIA Label | aria-label="Navigation menu" | Describe drawer |
| Escape Key | onKeyDown handler | Close on ESC |
| Focus Management | Focus close button on open | User awareness |

### Responsive Behavior

| Breakpoint | Drawer State | Trigger |
|------------|--------------|---------|
| Mobile (< 768px) | Available | Hamburger menu in header |
| Tablet (768px+) | Hidden | Sidebar visible instead |
| Desktop (1024px+) | Hidden | Sidebar always visible |

### Expected Outcome
- Functional mobile navigation drawer
- Smooth slide-in/out animation
- Backdrop overlay with close on click
- All portal navigation items accessible
- Keyboard and touch-friendly
- Proper accessibility support

### Verification Checklist
- [ ] `MobileNavDrawer.tsx` component created
- [ ] Props interface defined (isOpen, onClose)
- [ ] Drawer panel with slide animation
- [ ] Backdrop overlay with fade animation
- [ ] Close button functional
- [ ] Navigation items reused from sidebar
- [ ] Focus trap implemented
- [ ] Escape key closes drawer
- [ ] Click outside closes drawer
- [ ] Body scroll prevented when open

---

## Task 14: Create Portal Header

### Overview
Create the portal header component that appears above the main content area. Displays user greeting with name, shows current page title on mobile, includes hamburger menu button to open mobile drawer, and provides quick access to logout functionality.

### Dependencies
- Task 02: Create Portal Layout

### Instructions

1. **Create header component file**
   - Create `PortalHeader.tsx` in `components/storefront/portal/Layout/` directory
   - Set up TypeScript React functional component

2. **Define component props**
   - `userName`: string (user's name for greeting)
   - `onMenuClick`: optional function (open mobile drawer)
   - Component can also fetch user from auth context

3. **Structure header layout**
   - Flex container spanning full width
   - Height: 64px for consistency
   - Border bottom for visual separation
   - Proper padding on left and right

4. **Add hamburger menu button**
   - Display only on mobile (< 768px)
   - Icon with three horizontal lines
   - Click opens mobile nav drawer
   - Positioned on far left
   - Proper touch target size (44px × 44px)

5. **Implement greeting section**
   - Display "Welcome back, [Name]!" or similar
   - Use user's first name from session
   - Hidden on mobile, visible on tablet/desktop
   - Position on left side (after hamburger on mobile)

6. **Add page title display**
   - Show current page title on mobile
   - Hide on desktop (sidebar already shows context)
   - Center aligned on mobile
   - Extracted from route or metadata

7. **Create actions section**
   - Right-aligned container
   - Notification icon (optional, future)
   - User menu dropdown (optional)
   - Logout button or link

8. **Style header appearance**
   - Background: white or light gray
   - Border bottom: subtle gray
   - Shadow: none or very subtle
   - Consistent with sidebar height

### Header Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| userName | string | No | undefined | User's name for greeting |
| onMenuClick | () => void | No | undefined | Callback to open mobile drawer |

### Header Layout

```
Desktop Header
┌─────────────────────────────────────────────────┐
│  Welcome back, John!              [User] [●]   │
│                                    (Actions)    │
└─────────────────────────────────────────────────┘

Mobile Header
┌─────────────────────────────────────────────────┐
│  [☰]          Dashboard              [●]       │
│ (Menu)      (Page Title)          (Actions)    │
└─────────────────────────────────────────────────┘
```

### Header Sections

| Section | Content | Alignment | Responsive |
|---------|---------|-----------|------------|
| Left | Hamburger (mobile) + Greeting (desktop) | Left | Conditional |
| Center | Page title (mobile only) | Center | Mobile only |
| Right | Notifications + User menu + Logout | Right | Always |

### Hamburger Menu Button

| Property | Value | Purpose |
|----------|-------|---------|
| Size | 44px × 44px | Touch target |
| Icon | Three lines (☰) | Universal menu icon |
| Visibility | Mobile only | Desktop has sidebar |
| Color | Gray-700 | Subtle but visible |
| Hover | Gray-900 bg | Interactive feedback |

### Greeting Variations

| Screen Size | Display | Format |
|-------------|---------|--------|
| Mobile | Hidden | - |
| Tablet | Full greeting | "Welcome back, [First Name]!" |
| Desktop | Full greeting | "Welcome back, [First Name]!" |

### Header Actions

| Action | Icon | Purpose | Priority |
|--------|------|---------|----------|
| Notifications | Bell | Show notifications count | Medium |
| User Menu | Avatar/Name | Account dropdown | High |
| Logout | Power/Exit | Sign out | High |

### Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (< 768px) | Show hamburger, hide greeting, show page title |
| Tablet (768px - 1024px) | Hide hamburger (sidebar visible), show greeting |
| Desktop (> 1024px) | Same as tablet, more spacing |

### Expected Outcome
- Functional portal header component
- Responsive layout for mobile and desktop
- Hamburger menu on mobile to open drawer
- User greeting on desktop
- Actions section with logout option
- Consistent height and styling

### Verification Checklist
- [ ] `PortalHeader.tsx` component created
- [ ] Props interface defined
- [ ] Header layout structured with three sections
- [ ] Hamburger menu button (mobile only)
- [ ] User greeting (desktop only)
- [ ] Page title display (mobile only)
- [ ] Actions section with logout
- [ ] Responsive behavior configured
- [ ] Proper height and border styling

---

## Task 15: Create Logout Button

### Overview
Create a logout button component that handles user sign-out from the customer portal. Provides clear logout action, confirmation dialog (optional), session termination, and redirect to home page or login. Accessible from both sidebar and mobile drawer.

### Dependencies
- Task 10: Create Portal Sidebar

### Instructions

1. **Create logout button component**
   - Create `LogoutButton.tsx` in `components/storefront/portal/Layout/` directory
   - Set up TypeScript React functional component

2. **Define component props**
   - `variant`: optional string ("full" | "icon" | "link")
   - `showConfirmation`: optional boolean (show confirm dialog)
   - `onLogoutSuccess`: optional callback after logout

3. **Implement button structure**
   - Button element with proper type
   - Icon (power or exit icon)
   - Text label "Logout" or "Sign Out"
   - Layout based on variant prop

4. **Add logout handler**
   - Client-side function to call logout API
   - Clear auth tokens and session
   - Show loading state during request
   - Handle errors gracefully

5. **Implement confirmation dialog**
   - Optional confirmation before logout
   - Modal or alert dialog
   - "Are you sure you want to logout?" message
   - Confirm and Cancel buttons

6. **Handle logout flow**
   - Show loading indicator on button
   - Call sign-out API endpoint
   - Clear client-side auth state
   - Redirect to home page or login
   - Display success message (optional)

7. **Add loading state**
   - Disable button during logout process
   - Show spinner or loading text
   - Prevent multiple clicks
   - Visual feedback for user

8. **Style button variants**
   - Full: Full-width button with icon and text
   - Icon: Icon-only button (for header)
   - Link: Text link style (subtle)
   - All variants have hover and focus states

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variant | "full" \| "icon" \| "link" | No | "full" | Button display style |
| showConfirmation | boolean | No | false | Show confirm dialog |
| onLogoutSuccess | () => void | No | undefined | Callback after logout |

### Logout Flow

```
1. User clicks Logout button
   ↓
2. [Optional] Show confirmation dialog
   ↓
3. User confirms (or skip if no confirmation)
   ↓
4. Show loading state on button
   ↓
5. Call logout API endpoint
   ↓
6. Clear auth tokens from storage
   ↓
7. Redirect to home page
   ↓
8. [Optional] Show "Logged out successfully" toast
```

### Button Variants

| Variant | Layout | Use Case | Styling |
|---------|--------|----------|---------|
| Full | Icon + Text, full width | Sidebar, drawer | Outlined button, red accent |
| Icon | Icon only, compact | Header actions | Icon button, gray |
| Link | Text only, inline | Footer, settings | Link style, underline on hover |

### Button Layouts

```
Full Variant (Sidebar)
┌──────────────────────┐
│  [→] Logout          │
└──────────────────────┘

Icon Variant (Header)
┌────┐
│ [→]│
└────┘

Link Variant (Text)
[Logout]
```

### Logout API Call

| Step | Action | Purpose |
|------|--------|---------|
| 1. Call API | POST /api/auth/logout | Invalidate server session |
| 2. Clear Tokens | Remove from localStorage/cookies | Clear client state |
| 3. Update Context | Reset auth context | Update app state |
| 4. Redirect | Navigate to home | Remove access |

### Loading State

| State | Button Text | Icon | Disabled |
|-------|------------|------|----------|
| Idle | "Logout" | Power icon | No |
| Loading | "Logging out..." | Spinner | Yes |
| Error | "Logout" | Power icon | No |

### Confirmation Dialog

```
┌─────────────────────────────────────┐
│  Confirm Logout                     │
├─────────────────────────────────────┤
│                                     │
│  Are you sure you want to logout?   │
│                                     │
│  [Cancel]         [Logout]          │
│                    ↑                │
│                  (Primary,          │
│                   destructive)      │
└─────────────────────────────────────┘
```

### Error Handling

| Error Type | Message | Action |
|------------|---------|--------|
| Network Error | "Unable to logout. Please try again." | Allow retry |
| API Error | "Logout failed. Please try again." | Allow retry |
| Token Invalid | (Silent) | Proceed with client-side logout |

### Expected Outcome
- Functional logout button component
- Three display variants (full, icon, link)
- Proper logout flow with API call
- Optional confirmation dialog
- Loading state during logout
- Redirect after successful logout
- Error handling

### Verification Checklist
- [ ] `LogoutButton.tsx` component created
- [ ] Props interface with variant and confirmation options
- [ ] Button variants styled (full, icon, link)
- [ ] Logout handler implemented
- [ ] API call to logout endpoint
- [ ] Loading state during logout process
- [ ] Optional confirmation dialog
- [ ] Redirect after logout
- [ ] Error handling included
- [ ] Accessible and keyboard-friendly

---

## Task 16: Verify Portal Routes

### Overview
Comprehensive verification of all customer portal routes, navigation components, and functionality. Test route accessibility, authentication guards, navigation flow, responsive behavior, and user experience across all portal pages and components.

### Dependencies
- Task 15: Create Logout Button

### Instructions

1. **Test route accessibility**
   - Access each portal route directly via URL
   - Verify all pages load without errors
   - Check page titles and metadata
   - Ensure proper 404 handling for invalid routes

2. **Verify authentication protection**
   - Test accessing portal routes without login
   - Confirm redirect to login page
   - Verify return URL after login
   - Test session expiration handling

3. **Test navigation flow**
   - Click all sidebar navigation links
   - Verify correct page loads
   - Check active state indicators
   - Test back/forward browser navigation

4. **Verify mobile navigation**
   - Test hamburger menu opens drawer
   - Verify drawer closes on link click
   - Test backdrop click closes drawer
   - Check swipe gesture to close
   - Verify escape key closes drawer

5. **Test responsive layouts**
   - View portal on mobile device (< 768px)
   - Test on tablet (768px - 1024px)
   - Verify desktop layout (> 1024px)
   - Check all breakpoint transitions

6. **Verify sidebar functionality**
   - Test all navigation links
   - Verify badge counts display
   - Check active state highlighting
   - Test hover states on all items
   - Verify user profile displays correctly

7. **Test portal header**
   - Verify hamburger menu on mobile
   - Check user greeting on desktop
   - Test page title display on mobile
   - Verify header actions work

8. **Test logout functionality**
   - Click logout button
   - Verify confirmation dialog (if enabled)
   - Confirm logout completes successfully
   - Verify redirect to home page
   - Test protected route access after logout

9. **Test dynamic routes**
   - Access order detail with valid order ID
   - Test with invalid order ID (404)
   - Verify back navigation to orders list
   - Check dynamic metadata updates

10. **Verify data loading**
    - Check loading states on all pages
    - Test with slow network (throttling)
    - Verify error states display properly
    - Test empty states (no orders, wishlist, etc.)

### Verification Routes Checklist

| Route | URL | Auth Required | Working |
|-------|-----|---------------|---------|
| Portal Base | /account/ | Yes | ☐ |
| Dashboard | /account/dashboard/ | Yes | ☐ |
| Orders List | /account/orders/ | Yes | ☐ |
| Order Detail | /account/orders/[id] | Yes | ☐ |
| Addresses | /account/addresses/ | Yes | ☐ |
| Wishlist | /account/wishlist/ | Yes | ☐ |
| Reviews | /account/reviews/ | Yes | ☐ |
| Settings | /account/settings/ | Yes | ☐ |

### Navigation Components Checklist

| Component | Location | Functionality | Working |
|-----------|----------|---------------|---------|
| Portal Layout | All portal pages | Wraps content | ☐ |
| Portal Sidebar | Desktop | Navigation links | ☐ |
| Sidebar Nav Item | Sidebar | Individual links | ☐ |
| Active Indicator | Sidebar | Highlight current | ☐ |
| Mobile Drawer | Mobile | Slide-in nav | ☐ |
| Portal Header | All portal pages | User greeting | ☐ |
| Logout Button | Sidebar/Drawer | Sign out | ☐ |

### Authentication Verification

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Access portal without login | Redirect to login | ☐ |
| Login and access portal | Show dashboard | ☐ |
| Logout from portal | Clear session, redirect | ☐ |
| Session expires | Redirect to login | ☐ |
| Return URL after login | Redirect to original page | ☐ |

### Responsive Behavior Tests

| Breakpoint | Sidebar | Drawer | Hamburger | Header Greeting |
|------------|---------|--------|-----------|-----------------|
| Mobile (< 768px) | Hidden | Available | Visible | Hidden |
| Tablet (768px - 1024px) | Visible | Hidden | Hidden | Visible |
| Desktop (> 1024px) | Visible | Hidden | Hidden | Visible |

### Navigation Flow Tests

| Test | Steps | Expected Outcome |
|------|-------|------------------|
| Sidebar Link Click | Click "Orders" in sidebar | Navigate to /account/orders/, active indicator on Orders |
| Mobile Drawer Link | Open drawer, click "Wishlist" | Navigate to /account/wishlist/, drawer closes |
| Order Detail Link | Click order in orders list | Navigate to /account/orders/[id], show order details |
| Back Navigation | Click browser back button | Return to previous portal page |
| Logout and Return | Logout, click link to portal | Redirect to login, then back to dashboard |

### Badge Display Tests

| Nav Item | Badge Type | Test Case | Expected |
|----------|-----------|-----------|----------|
| Orders | Pending count | User has 3 pending orders | Badge shows "3" |
| Wishlist | Item count | User has 15 wishlist items | Badge shows "15" |
| Reviews | None | User has reviews | No badge |
| Dashboard | None | Always | No badge |

### Empty State Tests

| Page | Condition | Expected Display |
|------|-----------|------------------|
| Orders | No orders placed | "No orders yet" message + shop button |
| Wishlist | Empty wishlist | "Wishlist is empty" + browse button |
| Reviews | No reviews written | "No reviews yet" + write review prompt |
| Addresses | No addresses saved | "No addresses" + add address button |

### Error Handling Tests

| Error Type | Trigger | Expected Result |
|------------|---------|-----------------|
| 404 Not Found | Invalid order ID | 404 page or error message |
| Network Error | Disconnect internet | Error message + retry button |
| Session Expired | Wait for timeout | Redirect to login |
| API Error | Server returns 500 | Error message, retry option |

### Performance Checks

| Metric | Target | Test Method |
|--------|--------|-------------|
| Page Load Time | < 2 seconds | Lighthouse or manual |
| Navigation Transition | < 300ms | Visual inspection |
| Drawer Animation | Smooth, < 300ms | Visual inspection |
| Route Switch | Instant | Click links |

### Expected Outcome
- All portal routes accessible and functional
- Authentication guards working correctly
- Navigation components responsive
- Mobile drawer working smoothly
- Active states highlighting correctly
- Logout functionality complete
- All badges displaying accurate counts
- Empty states showing properly
- Error handling graceful

### Final Verification Checklist
- [ ] All 8 portal routes accessible
- [ ] Authentication redirects working
- [ ] Sidebar navigation functional (desktop)
- [ ] Mobile drawer functional (mobile)
- [ ] Active state indicators correct
- [ ] Badges display accurate counts
- [ ] Hamburger menu opens/closes drawer
- [ ] Portal header displays correctly
- [ ] Logout button signs out successfully
- [ ] Responsive layouts work at all breakpoints
- [ ] Dynamic routes handle valid/invalid IDs
- [ ] Empty states display properly
- [ ] Error states handled gracefully
- [ ] Loading states show during data fetch
- [ ] Back/forward navigation works
- [ ] No console errors on any page

---

## Document Summary

This document completed the customer portal layout and navigation system with eight essential tasks. Created the settings route for account management, implemented the portal sidebar with navigation items, added active state indicators, built mobile navigation drawer, designed portal header with user greeting, integrated logout functionality, and performed comprehensive verification of all portal routes and components.

### Components Created

| Component | File | Purpose |
|-----------|------|---------|
| Settings Route | `account/settings/page.tsx` | Account preferences |
| Portal Sidebar | `PortalSidebar.tsx` | Desktop navigation |
| Sidebar Nav Item | `SidebarNavItem.tsx` | Reusable nav link |
| Active Indicator | (Logic in NavItem) | Current page highlighting |
| Mobile Nav Drawer | `MobileNavDrawer.tsx` | Mobile navigation |
| Portal Header | `PortalHeader.tsx` | Page header with greeting |
| Logout Button | `LogoutButton.tsx` | Sign out functionality |

### Navigation System Complete

- Desktop sidebar with full navigation
- Mobile drawer with slide animation
- Active state highlighting
- Badge support for counts
- User greeting and profile display
- Logout functionality
- Responsive across all devices
- Full accessibility support

### Portal Features Verified

- All 8 routes functional and accessible
- Authentication protection on all pages
- Navigation flow smooth and intuitive
- Responsive layouts across breakpoints
- Empty states for all list pages
- Error handling for edge cases
- Loading states during data fetches
- Dynamic routing for order details

### Next Group

The next group (Group-B) covers dashboard widgets and order management features, building upon the navigation structure created in this group.

---

**Group A Complete: Portal Routes & Layout**
