# Tasks 25-34: Account Menu, Cart, and Header Actions

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** B - Header Components  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-24_Header-Logo-Search-Account.md](01_Tasks-15-24_Header-Logo-Search-Account.md)
- **← Previous Group:** [../Group-A_Layout-Shell-Structure/](../Group-A_Layout-Shell-Structure/)
- **→ Next Group:** [../Group-C_Navigation-Mega-Menu/](../Group-C_Navigation-Mega-Menu/)

---

## Document Overview

This document covers the creation of account dropdown menu with guest and logged-in states, cart icon with count badge, mini cart dropdown with product list and checkout functionality, wishlist icon, and the header actions group container. These components complete the header's interactive user features for account management and shopping functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Create Account Dropdown | Medium | 35 min |
| 26 | Create Login/Register Links | Low | 15 min |
| 27 | Create Logged In Menu | Low | 25 min |
| 28 | Create Cart Icon Button | Low | 20 min |
| 29 | Create Cart Count Badge | Low | 15 min |
| 30 | Create Mini Cart Dropdown | Medium | 40 min |
| 31 | Create Mini Cart Item | Low | 25 min |
| 32 | Create Mini Cart Footer | Low | 20 min |
| 33 | Create Wishlist Icon | Low | 15 min |
| 34 | Create Header Actions Group | Low | 20 min |

---

## Task 25: Create Account Dropdown

### Overview
Create the AccountDropdown component that displays a dropdown menu when users click the Account link. This dropdown shows different content based on authentication state: login/register links for guests, or account management options for logged-in users. The dropdown uses proper positioning, animations, and accessibility features.

### Dependencies
- Task 24: Create Account Link

### Instructions

1. **Create AccountDropdown component file**
   - Create `AccountDropdown.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Use 'use client' directive for client-side functionality

2. **Import required dependencies**
   - Import React, useEffect, useRef hooks
   - Import Headless UI Menu or custom dropdown logic
   - Import Lucide React icons for menu items
   - Import AccountDropdownProps type

3. **Define component props**
   - isOpen: boolean (dropdown visibility state)
   - isLoggedIn: boolean (authentication state)
   - onClose: function (close dropdown handler)
   - userName?: string (logged-in user name)
   - userEmail?: string (logged-in user email)
   - className?: string

4. **Implement dropdown container**
   - Create absolutely positioned dropdown
   - Position relative to parent AccountLink
   - Set appropriate width (w-64 or w-72)
   - Apply z-index for proper layering (z-50)

5. **Style dropdown appearance**
   - Apply white background with shadow
   - Add rounded corners (rounded-lg)
   - Set border for definition (border border-gray-200)
   - Add padding for spacing

6. **Implement show/hide animation**
   - Fade in/out with opacity transition
   - Scale slightly on appear (scale-95 to scale-100)
   - Slide down slightly (translateY)
   - Duration: 150-200ms for smooth effect

7. **Add click-outside detection**
   - Use useRef to reference dropdown element
   - Add event listener for clicks outside
   - Call onClose when clicking outside
   - Clean up event listener on unmount

8. **Implement focus trap**
   - Trap focus within dropdown when open
   - Tab cycles through menu items
   - Escape key closes dropdown
   - Return focus to trigger on close

9. **Add user info section (logged-in state)**
   - Display user name at top of dropdown
   - Show email below name
   - Add avatar or icon
   - Apply subtle background or border

10. **Create menu items section**
    - Render different items based on auth state
    - For guests: Login, Register links (Tasks 26)
    - For logged-in: Account menu items (Task 27)
    - Apply proper spacing and hover effects

11. **Implement keyboard navigation**
    - Arrow up/down to navigate menu items
    - Enter/Space to select item
    - Escape to close dropdown
    - Tab to cycle through items

12. **Add positioning logic**
    - Right-align dropdown by default
    - Adjust if dropdown extends beyond viewport
    - Consider mobile positioning (full width or centered)
    - Calculate position dynamically if needed

13. **Handle mobile responsiveness**
    - Full width on small screens (< 640px)
    - Constrained width on larger screens
    - Adjust positioning for mobile
    - Consider modal-style display for mobile

### Dropdown Structure

```
Desktop Layout
┌─ Account Link (Trigger) ─┐
│  👤 John Doe  ▼          │
└───────────────────────────┘
              │
              ▼
      ┌─────────────────────────────┐
      │  John Doe                   │ ← User Info
      │  john@example.com           │
      ├─────────────────────────────┤
      │  📋 My Orders               │ ← Menu Items
      │  👤 Profile                 │
      │  ❤️  Wishlist               │
      │  ⚙️  Settings               │
      ├─────────────────────────────┤
      │  🚪 Logout                  │
      └─────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| isOpen | boolean | Yes | false |
| isLoggedIn | boolean | Yes | false |
| onClose | () => void | Yes | - |
| userName | string | No | undefined |
| userEmail | string | No | undefined |
| className | string | No | "" |

### Dropdown Positioning

| Property | Value | Purpose |
|----------|-------|---------|
| Position | absolute | Relative to parent |
| Right | 0 | Right-aligned |
| Top | 100% + 8px | Below trigger with gap |
| Width | w-64 (256px) | Fixed comfortable width |
| Z-Index | 50 | Above other content |

### Dropdown Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Background | bg-white | Clean surface |
| Shadow | shadow-xl | Depth and elevation |
| Border | border border-gray-200 | Subtle definition |
| Radius | rounded-lg | Modern appearance |
| Padding | py-2 | Vertical spacing |

### Animation States

| State | Transform | Opacity | Duration |
|-------|-----------|---------|----------|
| Closed | scale(0.95) translateY(-10px) | 0 | - |
| Opening | scale(0.95) → scale(1) | 0 → 1 | 150ms |
| Open | scale(1) translateY(0) | 1 | - |
| Closing | scale(1) → scale(0.95) | 1 → 0 | 150ms |

### User Info Section (Logged-In)

| Element | Content | Styling |
|---------|---------|---------|
| Container | User details | px-4 py-3, bg-gray-50 |
| Name | User's display name | font-semibold, text-gray-900 |
| Email | User's email | text-sm, text-gray-600 |
| Avatar | Optional image or icon | h-10 w-10, rounded-full |

### Click-Outside Detection

```
Event Flow
│
├─ User clicks outside dropdown
│
├─ Event listener detects click
│
├─ Check if click is outside ref element
│
└─ Call onClose() if outside
```

### Focus Trap Implementation

| Action | Behavior |
|--------|----------|
| Dropdown Opens | Focus first menu item |
| Tab at Last Item | Focus first item (cycle) |
| Shift+Tab at First | Focus last item (cycle) |
| Escape Key | Close dropdown, return focus |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| ArrowDown | Highlight next item |
| ArrowUp | Highlight previous item |
| Enter/Space | Select highlighted item |
| Escape | Close dropdown |
| Tab | Cycle through items |

### Responsive Behavior

| Screen Size | Width | Positioning |
|-------------|-------|-------------|
| Mobile (< 640px) | w-screen | Full width, centered |
| Tablet (≥ 640px) | w-64 | Right-aligned |
| Desktop (≥ 1024px) | w-72 | Right-aligned |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA Role | role="menu" |
| ARIA Label | aria-label="Account menu" |
| Focus Management | Trap focus within dropdown |
| Keyboard Nav | Full keyboard support |
| Screen Reader | Announce state changes |

### Expected Outcome
- Functional dropdown menu for account features
- Smooth animations on open/close
- Different content for guest vs logged-in users
- Click-outside to close functionality
- Keyboard navigation support
- Focus trap within dropdown
- Accessible to screen readers
- Responsive positioning

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/AccountDropdown.tsx` file created
- [ ] Component accepts isOpen, isLoggedIn, onClose props
- [ ] Dropdown positioned correctly below Account link
- [ ] Show/hide animation implemented
- [ ] Click-outside detection works
- [ ] Focus trap implemented
- [ ] Keyboard navigation (arrows, Enter, Escape) works
- [ ] User info section displays for logged-in users
- [ ] Menu items section renders based on auth state
- [ ] Responsive width and positioning
- [ ] ARIA attributes added
- [ ] Component exports properly

---

## Task 26: Create Login/Register Links

### Overview
Create the login and register link components that appear in the AccountDropdown for guest (non-authenticated) users. These links provide clear entry points for users to access the authentication system and should be prominently displayed with appropriate styling and icons.

### Dependencies
- Task 25: Create Account Dropdown

### Instructions

1. **Create LoginRegisterLinks component file**
   - Create `LoginRegisterLinks.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - This component renders inside AccountDropdown

2. **Import required dependencies**
   - Import React
   - Import Next.js Link component
   - Import Lucide React icons (LogIn, UserPlus)
   - Import any necessary types

3. **Define component structure**
   - Create container for login and register links
   - Apply vertical layout for stacking
   - Add appropriate spacing between items

4. **Create Login link**
   - Use Next.js Link component
   - Set href to `/login` or authentication route
   - Display "Login" or "Sign In" text
   - Add LogIn icon before text

5. **Create Register link**
   - Use Next.js Link component
   - Set href to `/register` or signup route
   - Display "Register" or "Sign Up" text
   - Add UserPlus icon before text

6. **Style link containers**
   - Apply flexbox for icon and text alignment
   - Set proper padding for clickable area (px-4 py-3)
   - Add hover background color (hover:bg-gray-100)
   - Ensure text is readable with good contrast

7. **Add link hover effects**
   - Background color change on hover
   - Text color change (hover:text-blue-600)
   - Smooth transition (transition-colors)
   - Active state feedback

8. **Implement icon styling**
   - Position icons to left of text
   - Set appropriate size (h-5 w-5)
   - Match icon color to text color
   - Add spacing between icon and text (gap-3)

9. **Add separator between links (optional)**
   - Divider line between Login and Register
   - Subtle gray color (border-gray-200)
   - Or use spacing without divider

10. **Add call-to-action styling**
    - Consider making Register link more prominent
    - Use brand color or button styling
    - Distinguish from Login link
    - Draw attention to registration

11. **Implement accessibility features**
    - Ensure links are keyboard accessible
    - Add proper focus indicators
    - Use semantic HTML
    - Provide descriptive text

### Guest Dropdown Structure

```
Account Dropdown (Guest)
┌────────────────────────────┐
│  🔓 Login                  │ ← Login Link
├────────────────────────────┤
│  ➕ Create Account         │ ← Register Link
└────────────────────────────┘
```

### Component Structure

```
LoginRegisterLinks Component
├── Link to /login
│   ├── LogIn icon
│   └── "Login" text
└── Link to /register
    ├── UserPlus icon
    └── "Create Account" text
```

### Link Destinations

| Link | Route | Purpose |
|------|-------|---------|
| Login | `/login` or `/auth/login` | Sign in existing users |
| Register | `/register` or `/auth/register` | Create new account |

### Link Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Display | flex items-center | Icon and text alignment |
| Padding | px-4 py-3 | Comfortable clickable area |
| Gap | gap-3 | Icon-text spacing |
| Color | text-gray-700 | Neutral default |
| Hover BG | hover:bg-gray-100 | Interactive feedback |
| Hover Text | hover:text-blue-600 | Brand emphasis |
| Transition | transition-colors duration-150 | Smooth effect |

### Icon Specifications

| Icon | Component | Size | Purpose |
|------|-----------|------|---------|
| Login | LogIn | h-5 w-5 | Sign in indicator |
| Register | UserPlus | h-5 w-5 | Sign up indicator |

### Link Text Options

| Action | Primary | Alternative |
|--------|---------|-------------|
| Login | "Login" | "Sign In" |
| Register | "Create Account" | "Sign Up", "Register" |

### Hover Effects

| State | Background | Text Color | Icon Color |
|-------|------------|------------|------------|
| Default | transparent | text-gray-700 | text-gray-700 |
| Hover | bg-gray-100 | text-blue-600 | text-blue-600 |
| Active | bg-gray-200 | text-blue-700 | text-blue-700 |

### Call-to-Action Variants

| Variant | Styling | Use Case |
|---------|---------|----------|
| Standard | Both links equal weight | Neutral presentation |
| Emphasized Register | Register with bg-blue-600, text-white | Drive signups |
| Bordered Register | Register with border-2 border-blue-600 | Highlight option |

### Separator Options

```
Option A: With Divider
┌────────────────────────────┐
│  Login                     │
├────────────────────────────┤ ← Border divider
│  Create Account            │
└────────────────────────────┘

Option B: Without Divider
┌────────────────────────────┐
│  Login                     │
│                            │ ← Gap spacing
│  Create Account            │
└────────────────────────────┘
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Focus Indicator | Focus ring on Tab |
| Keyboard Access | Fully tabbable links |
| Screen Reader | Descriptive link text |
| Contrast | WCAG AA compliant |

### Expected Outcome
- Clean, accessible login and register links
- Proper icon and text alignment
- Smooth hover effects
- Clear visual hierarchy
- Integrated within AccountDropdown
- Responsive and touch-friendly

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/LoginRegisterLinks.tsx` file created
- [ ] Login link created with LogIn icon
- [ ] Register link created with UserPlus icon
- [ ] Links use Next.js Link component
- [ ] Correct href paths set
- [ ] Hover background effect applied
- [ ] Icon and text properly aligned
- [ ] Proper spacing and padding
- [ ] Focus indicators visible
- [ ] Component integrates with AccountDropdown
- [ ] Component exports properly

---

## Task 27: Create Logged In Menu

### Overview
Create the LoggedInMenu component that displays account management options for authenticated users within the AccountDropdown. This menu provides navigation to user-specific pages like profile, orders, wishlist, settings, and a logout option, with appropriate icons and organization.

### Dependencies
- Task 25: Create Account Dropdown

### Instructions

1. **Create LoggedInMenu component file**
   - Create `LoggedInMenu.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Component renders inside AccountDropdown when user is logged in

2. **Import required dependencies**
   - Import React
   - Import Next.js Link and useRouter
   - Import Lucide React icons (User, Package, Heart, Settings, LogOut)
   - Import logout handler from auth service

3. **Define component props**
   - userName?: string (user display name)
   - userEmail?: string (user email address)
   - onLogout: function (logout handler)
   - onClose: function (close dropdown after navigation)
   - className?: string

4. **Define menu items structure**
   - Create array of menu items with properties
   - Each item: label, href, icon, onClick (optional)
   - Organize logically by function
   - Separate logout from other items

5. **Create menu items list**
   - My Profile: Link to `/account/profile`
   - My Orders: Link to `/account/orders`
   - Wishlist: Link to `/account/wishlist`
   - Settings: Link to `/account/settings`
   - Addresses: Link to `/account/addresses` (optional)

6. **Implement menu item rendering**
   - Map through menu items array
   - Render each as Next.js Link or button
   - Display icon, label, and optional badge
   - Apply consistent styling

7. **Style menu items**
   - Flexbox layout for icon and text (flex items-center)
   - Padding for comfortable clicking (px-4 py-3)
   - Hover background (hover:bg-gray-100)
   - Hover text color (hover:text-blue-600)
   - Smooth transitions

8. **Create logout button**
   - Render as button, not link
   - Place at bottom of menu
   - Add LogOut icon
   - Apply distinct styling (optional red color)
   - Separate from other items with divider

9. **Implement logout functionality**
   - Handle onClick event
   - Call logout handler from auth service
   - Clear user session/tokens
   - Redirect to homepage or login page
   - Close dropdown after logout

10. **Add order count badge (optional)**
    - Display unread order count next to "My Orders"
    - Show badge with number
    - Style with small size and brand color
    - Hide if count is zero

11. **Add dividers for organization**
    - Add subtle divider before logout
    - Optional divider to group related items
    - Use border-t with gray color

12. **Handle click behavior**
    - Call onClose after navigation
    - Prevent dropdown from staying open
    - Close on item selection
    - Maintain expected UX

### Logged-In Dropdown Structure

```
Account Dropdown (Logged In)
┌────────────────────────────────┐
│  John Doe                      │ ← User Info Section
│  john@example.com              │
├────────────────────────────────┤
│  👤 My Profile                │
│  📦 My Orders              [3] │ ← Badge
│  ❤️  Wishlist                 │
│  📍 Addresses                  │
│  ⚙️  Settings                 │
├────────────────────────────────┤ ← Divider
│  🚪 Logout                     │ ← Logout Button
└────────────────────────────────┘
```

### Menu Items Definition

| Item | Label | Icon | Href | Description |
|------|-------|------|------|-------------|
| 1 | My Profile | User | `/account/profile` | User profile page |
| 2 | My Orders | Package | `/account/orders` | Order history |
| 3 | Wishlist | Heart | `/account/wishlist` | Saved items |
| 4 | Addresses | MapPin | `/account/addresses` | Shipping addresses |
| 5 | Settings | Settings | `/account/settings` | Account settings |
| 6 | Logout | LogOut | - (button) | Sign out |

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| userName | string | No | undefined |
| userEmail | string | No | undefined |
| onLogout | () => void | Yes | - |
| onClose | () => void | Yes | - |
| className | string | No | "" |

### Menu Item Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Display | flex items-center | Icon and text alignment |
| Padding | px-4 py-3 | Comfortable clickable area |
| Gap | gap-3 | Icon-text spacing |
| Width | w-full | Full width of dropdown |
| Color | text-gray-700 | Neutral default |
| Hover BG | hover:bg-gray-100 | Interactive feedback |
| Hover Text | hover:text-blue-600 | Brand emphasis |
| Transition | transition-colors | Smooth effect |

### Logout Button Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Color | text-red-600 | Indicate destructive action |
| Hover BG | hover:bg-red-50 | Consistent with color |
| Hover Text | hover:text-red-700 | Darker on hover |
| Border Top | border-t border-gray-200 | Separate from menu |
| Margin Top | mt-2 | Additional spacing |

### Badge Component (Order Count)

| Property | Value | Purpose |
|----------|-------|---------|
| Background | bg-blue-600 | Brand color |
| Text Color | text-white | High contrast |
| Size | text-xs | Small, unobtrusive |
| Padding | px-2 py-0.5 | Compact badge |
| Border Radius | rounded-full | Pill shape |
| Position | ml-auto | Right-aligned |

### Logout Flow

```
User Clicks Logout
    │
    ├─ Trigger onLogout handler
    │
    ├─ Call auth service logout
    │
    ├─ Clear tokens/session
    │
    ├─ Close dropdown (onClose)
    │
    └─ Redirect to homepage or login
```

### Navigation Behavior

| Action | Behavior |
|--------|----------|
| Click Menu Item | Navigate to href, close dropdown |
| Click Logout | Execute logout, close dropdown |
| Keyboard Enter | Same as click |
| Keyboard Escape | Close dropdown |

### Icon Sizing

| Icon | Size | Color |
|------|------|-------|
| All Icons | h-5 w-5 | Inherit from text |

### Divider Styling

| Position | Style | Purpose |
|----------|-------|---------|
| Before Logout | border-t border-gray-200 | Separate logout |
| Optional Groups | border-t border-gray-100 | Organize sections |

### Expected Outcome
- Complete menu for logged-in users
- Clear navigation to account pages
- Functional logout button
- Organized with icons and labels
- Smooth hover effects
- Optional order count badge
- Closes dropdown on selection

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/LoggedInMenu.tsx` file created
- [ ] Component accepts userName, userEmail, onLogout, onClose props
- [ ] All menu items created with correct links
- [ ] Icons properly imported and displayed
- [ ] Links use Next.js Link component
- [ ] Logout button functional
- [ ] Logout handler clears session
- [ ] Hover effects applied to all items
- [ ] Logout styled distinctly (red color)
- [ ] Divider before logout added
- [ ] onClose called after navigation/logout
- [ ] Optional badge for order count
- [ ] Component exports properly

---

## Task 28: Create Cart Icon Button

### Overview
Create the CartIcon component that displays a shopping cart icon in the header. This button serves as the trigger for the mini cart dropdown and displays the current cart item count via a badge. The icon is always visible and provides quick access to cart functionality.

### Dependencies
- Task 15: Create Header Component
- Task 16: Create Header Types

### Instructions

1. **Create CartIcon component file**
   - Create `CartIcon.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Use 'use client' directive for interactivity

2. **Import required dependencies**
   - Import React
   - Import Lucide React ShoppingCart icon
   - Import CartIconProps type from header types
   - Import cart state from Zustand store or context

3. **Define component props**
   - itemCount: number (number of items in cart)
   - onClick: function (click handler to open mini cart)
   - className?: string (optional styling)
   - showBadge?: boolean (show/hide badge, default: true)

4. **Implement button structure**
   - Create button element with type="button"
   - Apply relative positioning for badge placement
   - Add ShoppingCart icon
   - Ensure button is properly clickable

5. **Style cart icon**
   - Set icon color (text-gray-700 or text-gray-900)
   - Add hover state (hover:text-blue-600)
   - Apply transition for smooth effect
   - Size icon appropriately (h-6 w-6)

6. **Add accessibility attributes**
   - Add aria-label="Shopping cart"
   - Include item count in aria-label ("Shopping cart, 3 items")
   - Add title attribute for tooltip
   - Ensure keyboard accessible

7. **Implement hover and focus states**
   - Change icon color on hover
   - Add focus ring for keyboard navigation
   - Smooth transition between states
   - Provide clear visual feedback

8. **Add cart badge integration**
   - Position badge (Task 29) absolutely on top-right
   - Pass itemCount to badge component
   - Show badge only when items > 0
   - Ensure badge doesn't interfere with icon

9. **Handle click behavior**
   - Accept onClick prop from parent
   - Toggle mini cart dropdown
   - Prevent default button behavior
   - Manage dropdown open/close state

10. **Implement responsive behavior**
    - Visible on all screen sizes
    - Adjust icon size for mobile if needed
    - Ensure touch target is adequate (min 44x44px)
    - Maintain badge visibility

11. **Add animation on cart update (optional)**
    - Subtle shake or pulse when item added
    - Scale animation for attention
    - Brief duration (200-300ms)
    - Enhance user feedback

### Cart Icon Structure

```
Header Actions
┌──────────────────────────────────┐
│  🔍 Search  👤 Account  🛒 [3]  │
│                            ↑      │
│                      Cart Icon + Badge
└──────────────────────────────────┘
```

### Component Structure

```
CartIcon Component
└── Button (relative positioning)
    ├── ShoppingCart Icon
    └── CartBadge (absolute, top-right)
        └── Item Count
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| itemCount | number | Yes | 0 |
| onClick | () => void | Yes | - |
| className | string | No | "" |
| showBadge | boolean | No | true |

### Button Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Position | relative | Badge positioning context |
| Display | inline-flex | Center icon |
| Padding | p-2 | Clickable area |
| Color | text-gray-700 | Neutral appearance |
| Hover | hover:text-blue-600 | Interactive feedback |
| Transition | transition-colors | Smooth change |
| Cursor | cursor-pointer | Indicate clickability |

### Icon Sizing

| Screen Size | Icon Size | Touch Target |
|-------------|-----------|--------------|
| Mobile | h-6 w-6 | 44x44px (with padding) |
| Desktop | h-6 w-6 | 44x44px (with padding) |

### Accessibility Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| aria-label | "Shopping cart, X items" | Screen reader description |
| title | "View cart" | Tooltip |
| type | "button" | Button semantics |
| aria-haspopup | "true" | Indicates dropdown |

### Badge Positioning

```
Cart Icon with Badge
┌──────────────┐
│   ┌──────┐   │
│   │  [3] │   │ ← Badge (absolute, top-right)
│   └──────┘   │
│              │
│   🛒        │ ← Cart Icon
│              │
└──────────────┘
```

### Badge Display Logic

| Item Count | Badge Display |
|------------|---------------|
| 0 | Hidden |
| 1-99 | Show count |
| 100+ | Show "99+" |

### Hover and Focus States

| State | Styles | Visual Effect |
|-------|--------|---------------|
| Default | text-gray-700 | Neutral gray |
| Hover | text-blue-600 | Brand color |
| Focus | ring-2 ring-blue-500 | Focus indicator |
| Active | text-blue-700 | Pressed state |

### Click Behavior

```
User Clicks Cart Icon
    │
    ├─ Trigger onClick handler
    │
    ├─ Toggle mini cart dropdown
    │
    └─ Display cart contents
```

### Animation on Cart Update (Optional)

| Animation | Property | Duration | Purpose |
|-----------|----------|----------|---------|
| Shake | translateX(-2px to 2px) | 200ms | Item added feedback |
| Pulse | scale(1 to 1.1 to 1) | 300ms | Attention grabbing |
| Badge Pop | scale(0 to 1) | 150ms | Badge appearance |

### Touch Target Requirements

| Platform | Minimum Size | Implementation |
|----------|--------------|----------------|
| Mobile | 44x44px | p-2 with h-6 w-6 icon |
| Desktop | 44x44px | Consistent sizing |

### Expected Outcome
- Functional cart icon button in header
- Badge displays current item count
- Opens mini cart dropdown on click
- Proper hover and focus states
- Accessible with screen readers
- Adequate touch target size
- Optional animation on cart updates

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/CartIcon.tsx` file created
- [ ] Component accepts itemCount and onClick props
- [ ] ShoppingCart icon displayed
- [ ] Button positioned relatively for badge
- [ ] aria-label includes item count
- [ ] Hover state styling applied
- [ ] Focus ring implemented
- [ ] Touch target size adequate (min 44x44px)
- [ ] Badge integration ready (Task 29)
- [ ] Click handler triggers correctly
- [ ] Component exports properly

---

## Task 29: Create Cart Count Badge

### Overview
Create the CartBadge component that displays the number of items in the cart as a small badge overlaid on the cart icon. The badge should be visually distinct with brand colors, automatically hide when the cart is empty, and display "99+" for counts over 99.

### Dependencies
- Task 28: Create Cart Icon Button

### Instructions

1. **Create CartBadge component file**
   - Create `CartBadge.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Component renders inside CartIcon

2. **Import required dependencies**
   - Import React
   - Import CartBadgeProps type (if created)

3. **Define component props**
   - count: number (number of items in cart)
   - max?: number (maximum count to display, default: 99)
   - className?: string (optional styling)
   - show?: boolean (force show/hide, default: based on count)

4. **Implement conditional rendering**
   - Return null if count is 0
   - Render badge only when count > 0
   - Check show prop for override

5. **Calculate display value**
   - Display count if <= max (default 99)
   - Display "99+" if count > max
   - Format number appropriately
   - Handle edge cases (negative numbers)

6. **Style badge container**
   - Absolute positioning (absolute)
   - Position top-right of parent (-top-1 -right-1)
   - Small size for unobtrusive display
   - Z-index to ensure visibility (z-10)

7. **Apply badge styling**
   - Background color: brand primary (bg-blue-600 or bg-red-600)
   - Text color: white (text-white)
   - Border radius: fully rounded (rounded-full)
   - Padding: compact (px-1.5 py-0.5)
   - Font size: extra small (text-xs)
   - Font weight: semi-bold or bold

8. **Add border/outline**
   - White border around badge (border-2 border-white)
   - Creates separation from icon
   - Improves visibility on various backgrounds
   - Ensures badge stands out

9. **Implement responsive sizing**
   - Slightly smaller on mobile if needed
   - Maintain readability at all sizes
   - Ensure badge doesn't overlap icon excessively

10. **Add animation on count change (optional)**
    - Pulse or scale when count increases
    - Brief animation (200ms)
    - Smooth transition between numbers
    - Enhance user feedback

### Badge Positioning

```
Cart Icon with Badge
┌─────────────────┐
│      [3] ←──────┼─── Badge (absolute positioning)
│   ┌─────────┐   │
│   │         │   │
│   │  🛒     │   │
│   │         │   │
│   └─────────┘   │
└─────────────────┘
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| count | number | Yes | 0 |
| max | number | No | 99 |
| className | string | No | "" |
| show | boolean | No | count > 0 |

### Badge Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Position | absolute | Overlay on icon |
| Top | -top-1 | Offset above icon |
| Right | -right-1 | Offset to right of icon |
| Background | bg-red-600 | High visibility |
| Text Color | text-white | High contrast |
| Border | border-2 border-white | Separation |
| Radius | rounded-full | Circular badge |
| Padding | px-1.5 py-0.5 | Compact size |
| Font Size | text-xs | Small but readable |
| Font Weight | font-semibold | Bold appearance |
| Z-Index | z-10 | Above icon |

### Display Value Logic

| Count | Display |
|-------|---------|
| 0 | (Hidden) |
| 1 | "1" |
| 5 | "5" |
| 99 | "99" |
| 100 | "99+" |
| 523 | "99+" |

### Badge Size Specifications

| Dimension | Value | Purpose |
|-----------|-------|---------|
| Min Width | min-w-[18px] | Accommodate single digit |
| Min Height | h-[18px] | Circular shape |
| Max Width | Flexible | Accommodate "99+" |
| Line Height | leading-none | Vertical centering |

### Color Variants

| Variant | Background | Use Case |
|---------|------------|----------|
| Default (Red) | bg-red-600 | Standard e-commerce |
| Blue | bg-blue-600 | Brand consistency |
| Green | bg-green-600 | Alternate |

### Conditional Rendering Logic

```
Badge Render Decision
│
├─ If count === 0 → return null (hidden)
│
├─ If show === false → return null
│
└─ If count > 0 → render badge
    │
    ├─ If count <= max → display count
    │
    └─ If count > max → display "max+"
```

### Animation on Count Change (Optional)

| Animation | Effect | Duration | Trigger |
|-----------|--------|----------|---------|
| Scale Pulse | 1 → 1.2 → 1 | 200ms | Count increases |
| Fade In | opacity 0 → 1 | 150ms | Badge appears |
| Number Flip | Flip animation | 300ms | Count changes |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Screen Reader | Count included in parent aria-label |
| Visual Only | Badge is decorative (count in label) |
| Color Contrast | White on red/blue meets WCAG AA |

### Badge Positioning Options

```
Option A: Top-Right (Standard)
┌──────────┐
│     [3]  │
│   🛒     │
└──────────┘

Option B: Top-Center
┌──────────┐
│   [3]    │
│   🛒     │
└──────────┘

Option C: Top-Right with More Offset
┌──────────┐
│       [3]│
│   🛒     │
└──────────┘
```

### Expected Outcome
- Functional badge displaying cart item count
- Automatically hidden when count is 0
- Displays "99+" for counts over 99
- Visually distinct with brand color
- Proper positioning on cart icon
- White border for separation
- Optional animation on count change

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/CartBadge.tsx` file created
- [ ] Component accepts count prop
- [ ] Badge hidden when count is 0
- [ ] Badge shows count when count > 0
- [ ] Displays "99+" when count > 99
- [ ] Positioned absolutely (top-right)
- [ ] Background color applied (red or blue)
- [ ] White border added
- [ ] Text is white and bold
- [ ] Rounded-full styling applied
- [ ] Integrates with CartIcon component
- [ ] Component exports properly

---

## Task 30: Create Mini Cart Dropdown

### Overview
Create the MiniCart component that displays a dropdown with cart contents when users click the cart icon. This dropdown shows a preview of cart items (up to 3-5), subtotal, and action buttons to view full cart or proceed to checkout. It provides quick access to cart management without navigating away from the current page.

### Dependencies
- Task 28: Create Cart Icon Button
- Task 29: Create Cart Count Badge

### Instructions

1. **Create MiniCart component file**
   - Create `MiniCart.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Use 'use client' directive for client-side functionality

2. **Import required dependencies**
   - Import React, useEffect, useRef hooks
   - Import MiniCartItem component (Task 31)
   - Import MiniCartFooter component (Task 32)
   - Import MiniCartProps type
   - Import cart state from Zustand or context

3. **Define component props**
   - isOpen: boolean (dropdown visibility)
   - onClose: function (close dropdown handler)
   - items: CartItem[] (array of cart items)
   - subtotal: number (cart subtotal amount)
   - onRemoveItem: function (remove item handler)
   - onViewCart: function (navigate to cart page)
   - onCheckout: function (navigate to checkout)

4. **Implement dropdown container**
   - Absolute positioning below cart icon
   - Right-aligned in header
   - Fixed width (w-96 or w-[400px])
   - Set z-index (z-50)
   - Apply shadow and border

5. **Style dropdown appearance**
   - White background (bg-white)
   - Rounded corners (rounded-lg)
   - Shadow for depth (shadow-xl)
   - Border for definition (border border-gray-200)

6. **Create dropdown header**
   - Display "Shopping Cart" or "Cart" title
   - Show item count in parentheses "(3 items)"
   - Add close button (X icon) on right
   - Apply padding and border-bottom

7. **Implement cart items section**
   - Scrollable container for items
   - Display up to 3-5 items (max-height with scroll)
   - Render MiniCartItem for each product
   - Show "View all items" link if more than max

8. **Add empty cart state**
   - Display when items array is empty
   - Show empty cart icon or illustration
   - Message: "Your cart is empty"
   - Link to shop or continue shopping

9. **Implement animation**
   - Fade and scale in/out
   - Slide down slightly on appear
   - Smooth transition (150-200ms)
   - Exit animation on close

10. **Add click-outside detection**
    - Use useRef for dropdown element
    - Add event listener for outside clicks
    - Call onClose when clicking outside
    - Clean up listener on unmount

11. **Integrate MiniCartFooter**
    - Render footer at bottom (Task 32)
    - Pass subtotal, onViewCart, onCheckout
    - Apply fixed positioning at dropdown bottom
    - Ensure footer is always visible

12. **Handle keyboard interactions**
    - Escape key to close dropdown
    - Tab to navigate items and buttons
    - Focus trap within dropdown
    - Return focus to cart icon on close

13. **Implement responsive behavior**
    - Full width on mobile (w-screen)
    - Fixed width on desktop (w-96)
    - Adjust positioning for mobile (centered or full)
    - Consider mobile modal instead of dropdown

14. **Add loading state**
    - Show skeleton or spinner while fetching cart
    - Display loading message
    - Handle cart update states

### Mini Cart Structure

```
Desktop Layout
┌─ Cart Icon ─┐
│   🛒 [3]   │
└─────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Shopping Cart (3 items)        ✕   │ ← Header
├─────────────────────────────────────┤
│ [Image] Product Name                │
│         ₨ 5,500 × 2     Remove      │
│                                     │
│ [Image] Another Product             │ ← Items (scrollable)
│         ₨ 3,200 × 1     Remove      │
│                                     │
│ [Image] Third Item                  │
│         ₨ 1,800 × 1     Remove      │
├─────────────────────────────────────┤
│ Subtotal:           ₨ 16,000.00    │ ← Footer
│ ┌──────────────┐ ┌───────────────┐ │
│ │  View Cart   │ │   Checkout    │ │
│ └──────────────┘ └───────────────┘ │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| isOpen | boolean | Yes | false |
| onClose | () => void | Yes | - |
| items | CartItem[] | Yes | [] |
| subtotal | number | Yes | 0 |
| onRemoveItem | (id: string) => void | Yes | - |
| onViewCart | () => void | Yes | - |
| onCheckout | () => void | Yes | - |

### Dropdown Positioning

| Property | Value | Purpose |
|----------|-------|---------|
| Position | absolute | Relative to cart icon |
| Right | 0 | Right-aligned |
| Top | 100% + 8px | Below trigger |
| Width | w-96 (384px) | Fixed comfortable width |
| Max Height | max-h-[600px] | Limit height |
| Z-Index | 50 | Above content |

### Dropdown Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Background | bg-white | Clean surface |
| Shadow | shadow-xl | Depth |
| Border | border border-gray-200 | Definition |
| Radius | rounded-lg | Modern look |

### Header Section

| Element | Styling | Content |
|---------|---------|---------|
| Container | px-4 py-3, border-b | Header wrapper |
| Title | text-lg font-semibold | "Shopping Cart" |
| Count | text-sm text-gray-600 | "(3 items)" |
| Close Button | h-6 w-6, hover:text-gray-700 | X icon |

### Items Section

| Property | Value | Purpose |
|----------|-------|---------|
| Container | overflow-y-auto | Scrollable |
| Max Height | max-h-80 | Limit to ~5 items |
| Padding | p-4 | Internal spacing |
| Divide | divide-y | Item separators |

### Empty Cart State

```
Empty Cart Display
┌─────────────────────────────────┐
│                                 │
│          🛒                     │
│                                 │
│    Your cart is empty           │
│                                 │
│  ┌───────────────────────┐     │
│  │   Continue Shopping   │     │
│  └───────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

### Animation States

| State | Transform | Opacity | Duration |
|-------|-----------|---------|----------|
| Closed | scale(0.95) translateY(-10px) | 0 | - |
| Opening | scale(0.95) → scale(1) | 0 → 1 | 150ms |
| Open | scale(1) translateY(0) | 1 | - |
| Closing | scale(1) → scale(0.95) | 1 → 0 | 150ms |

### Items Display Logic

| Item Count | Display Behavior |
|------------|------------------|
| 0 | Show empty state |
| 1-5 | Show all items |
| > 5 | Show first 5 + "View all" link |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Escape | Close dropdown |
| Tab | Navigate through items |
| Enter | Execute focused action |

### Responsive Behavior

| Screen Size | Width | Positioning |
|-------------|-------|-------------|
| Mobile (< 640px) | w-screen | Full width |
| Tablet (≥ 640px) | w-96 | Right-aligned |
| Desktop (≥ 1024px) | w-96 | Right-aligned |

### Loading State

| Element | Display |
|---------|---------|
| Skeleton Items | 3 placeholder items |
| Loading Text | "Loading cart..." |
| Spinner | Optional spinner icon |

### Expected Outcome
- Functional mini cart dropdown
- Displays cart items in scrollable list
- Shows subtotal and action buttons
- Empty state for zero items
- Smooth animations on open/close
- Click-outside to close
- Keyboard navigation support
- Responsive positioning

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/MiniCart.tsx` file created
- [ ] Component accepts isOpen, onClose, items, subtotal props
- [ ] Dropdown positioned correctly below cart icon
- [ ] Header section with title and close button
- [ ] Items section renders MiniCartItem components
- [ ] Scrollable items container with max-height
- [ ] Empty cart state implemented
- [ ] MiniCartFooter integrated at bottom
- [ ] Animation on open/close
- [ ] Click-outside detection works
- [ ] Escape key closes dropdown
- [ ] Responsive width and positioning
- [ ] Component exports properly

---

## Task 31: Create Mini Cart Item

### Overview
Create the MiniCartItem component that displays individual product information within the mini cart dropdown. Each item shows product image, name, price, quantity, and a remove button. The component provides a compact yet informative view of cart contents.

### Dependencies
- Task 30: Create Mini Cart Dropdown

### Instructions

1. **Create MiniCartItem component file**
   - Create `MiniCartItem.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Component renders inside MiniCart

2. **Import required dependencies**
   - Import React
   - Import Next.js Image and Link components
   - Import Lucide React X icon
   - Import MiniCartItemProps or CartItem type

3. **Define component props**
   - item: CartItem (product data object)
   - onRemove: function (remove item handler)
   - className?: string

4. **Define CartItem structure (if not in types)**
   - id: string (product ID)
   - name: string (product name)
   - slug: string (URL slug)
   - price: number (unit price)
   - quantity: number (quantity in cart)
   - image: string (product image URL)
   - variant?: string (optional variant info like "Size: L, Color: Blue")

5. **Implement item container**
   - Flex layout for horizontal arrangement
   - Gap between image and content
   - Padding for spacing
   - Hover effect for interactivity

6. **Create product image section**
   - Use Next.js Image component
   - Square aspect ratio (80x80px or 64x64px)
   - Rounded corners (rounded-md)
   - Border for definition
   - Link to product page

7. **Create product info section**
   - Flex column layout
   - Display product name (truncate if long)
   - Show variant if available
   - Display price and quantity
   - Allow space for remove button

8. **Implement product name link**
   - Link to product detail page (`/products/${slug}`)
   - Truncate long names (line-clamp-2)
   - Hover underline effect
   - Text size: text-sm

9. **Display variant information**
   - Show below product name
   - Small text size (text-xs)
   - Gray color (text-gray-500)
   - Format: "Size: L, Color: Blue"

10. **Display price and quantity**
    - Show price with currency symbol (₨)
    - Display quantity (× 2)
    - Format: "₨ 5,500 × 2"
    - Text size: text-sm, semi-bold

11. **Create remove button**
    - Button with X icon
    - Position on right side or below
    - Small size (h-5 w-5)
    - Hover: text-red-600
    - aria-label: "Remove {product name}"

12. **Calculate line total (optional)**
    - Show price × quantity = total
    - Display below or instead of unit price
    - Format: "₨ 11,000" for 2 items at ₨5,500

13. **Add hover effects**
    - Background change on container hover
    - Name underline on hover
    - Remove button color change

14. **Handle remove action**
    - Call onRemove with item ID
    - Confirm removal (optional modal)
    - Provide feedback (toast notification)
    - Update cart state

### Mini Cart Item Structure

```
Single Item Layout
┌───────────────────────────────────────┐
│ ┌────┐  Product Name                  │
│ │Img │  Size: L, Color: Blue          │
│ │64px│  ₨ 5,500 × 2     [Remove]     │
│ └────┘                                 │
└───────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| item | CartItem | Yes | - |
| onRemove | (id: string) => void | Yes | - |
| className | string | No | "" |

### CartItem Interface

| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique item identifier |
| name | string | Product name |
| slug | string | URL-friendly identifier |
| price | number | Unit price in cents/paisa |
| quantity | number | Quantity in cart |
| image | string | Product image URL |
| variant | string | Optional variant (size, color) |

### Item Container Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Display | flex | Horizontal layout |
| Gap | gap-3 | Image-content spacing |
| Padding | py-3 | Vertical spacing |
| Hover BG | hover:bg-gray-50 | Interactive feedback |
| Transition | transition-colors | Smooth effect |

### Image Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Width | 64px | Compact display |
| Height | 64px | Square aspect |
| Border Radius | rounded-md | Soft corners |
| Border | border border-gray-200 | Definition |
| Object Fit | cover | Fill area |
| Loading | lazy | Performance |

### Product Name Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Font Size | text-sm | Compact text |
| Line Clamp | line-clamp-2 | Max 2 lines |
| Color | text-gray-900 | High contrast |
| Hover | hover:underline | Interactive |
| Font Weight | font-medium | Emphasis |

### Variant Display

| Property | Value | Purpose |
|----------|-------|---------|
| Font Size | text-xs | Small supplementary text |
| Color | text-gray-500 | Lower emphasis |
| Margin | mt-1 | Spacing from name |
| Format | "Size: L, Color: Blue" | Comma-separated |

### Price and Quantity Display

| Element | Format | Example |
|---------|--------|---------|
| Price | ₨ X,XXX | ₨ 5,500 |
| Quantity | × N | × 2 |
| Combined | ₨ X,XXX × N | ₨ 5,500 × 2 |
| Line Total | ₨ XX,XXX | ₨ 11,000 |

### Remove Button Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Size | h-5 w-5 | Small icon |
| Color | text-gray-400 | Subtle default |
| Hover | hover:text-red-600 | Danger indicator |
| Padding | p-1 | Clickable area |
| Transition | transition-colors | Smooth effect |
| Aria Label | "Remove {item name}" | Accessibility |

### Price Formatting

| Input | Output |
|-------|--------|
| 5500 (cents) | ₨ 5,500.00 |
| 12000 (cents) | ₨ 12,000.00 |
| 350 (cents) | ₨ 350.00 |

### Item Layout Options

```
Option A: Remove Button on Right
┌──────────────────────────────────┐
│ [Img] Name              [Remove] │
│       ₨ 5,500 × 2                │
└──────────────────────────────────┘

Option B: Remove Button Below
┌──────────────────────────────────┐
│ [Img] Name                       │
│       ₨ 5,500 × 2                │
│       [Remove Item]              │
└──────────────────────────────────┘
```

### Variant Format Examples

| Variant Data | Display |
|--------------|---------|
| Size: L | "Size: L" |
| Color: Blue | "Color: Blue" |
| Size: L, Color: Blue | "Size: L, Color: Blue" |
| No variant | (Not displayed) |

### Expected Outcome
- Compact cart item display
- Product image linked to detail page
- Product name with truncation
- Variant information (if applicable)
- Price and quantity display
- Functional remove button
- Hover effects for interactivity
- Proper formatting of prices

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/MiniCartItem.tsx` file created
- [ ] Component accepts item and onRemove props
- [ ] Product image displayed with Next.js Image
- [ ] Image links to product page
- [ ] Product name displayed and truncated
- [ ] Variant information shown (if exists)
- [ ] Price and quantity formatted correctly
- [ ] Remove button with X icon
- [ ] Remove button triggers onRemove handler
- [ ] Hover effects applied
- [ ] aria-label on remove button
- [ ] Currency symbol (₨) used
- [ ] Component exports properly

---

## Task 32: Create Mini Cart Footer

### Overview
Create the MiniCartFooter component that displays the cart subtotal and action buttons at the bottom of the mini cart dropdown. This footer provides quick access to view the full cart page or proceed directly to checkout, with a clear display of the current cart total.

### Dependencies
- Task 30: Create Mini Cart Dropdown

### Instructions

1. **Create MiniCartFooter component file**
   - Create `MiniCartFooter.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Component renders at bottom of MiniCart

2. **Import required dependencies**
   - Import React
   - Import Next.js Link and useRouter
   - Import MiniCartFooterProps type

3. **Define component props**
   - subtotal: number (cart subtotal amount)
   - onViewCart: function (navigate to cart page)
   - onCheckout: function (navigate to checkout)
   - itemCount: number (total items in cart)
   - className?: string

4. **Implement footer container**
   - Apply border-top for separation
   - Set padding for spacing
   - Fixed at bottom of dropdown
   - Background color (bg-white or bg-gray-50)

5. **Create subtotal section**
   - Display "Subtotal" label
   - Show formatted amount with currency
   - Align label left, amount right
   - Use flexbox for layout

6. **Style subtotal display**
   - Label: text-gray-600, medium weight
   - Amount: larger text, bold (text-lg font-semibold)
   - Use currency symbol (₨)
   - Format with thousands separators

7. **Create action buttons section**
   - Two buttons: "View Cart" and "Checkout"
   - Grid or flex layout for equal width
   - Spacing between buttons (gap-2 or gap-3)
   - Stack on very small screens (optional)

8. **Style View Cart button**
   - Secondary button style (outline or ghost)
   - Border with brand color
   - Text color: brand primary
   - Hover: background with light brand color
   - Full width within container

9. **Style Checkout button**
   - Primary button style (filled)
   - Background: brand primary (bg-blue-600)
   - Text color: white
   - Hover: darker shade (hover:bg-blue-700)
   - Full width within container

10. **Implement button click handlers**
    - View Cart: navigate to `/cart`
    - Checkout: navigate to `/checkout`
    - Close dropdown after navigation
    - Prevent default if using Link

11. **Add shipping notice (optional)**
    - Small text below subtotal
    - Message: "Shipping calculated at checkout"
    - Text size: text-xs
    - Color: text-gray-500

12. **Handle empty cart state**
    - Disable or hide buttons if cart is empty
    - Show different message
    - Prevent navigation to checkout

13. **Add loading state**
    - Disable buttons during cart updates
    - Show loading spinner on buttons
    - Prevent multiple clicks

### Mini Cart Footer Structure

```
Footer Layout
┌─────────────────────────────────────┐
│ Subtotal:           ₨ 16,000.00    │
│ Shipping calculated at checkout     │
├─────────────────────────────────────┤
│ ┌──────────────┐ ┌───────────────┐ │
│ │  View Cart   │ │   Checkout    │ │
│ └──────────────┘ └───────────────┘ │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| subtotal | number | Yes | 0 |
| onViewCart | () => void | Yes | - |
| onCheckout | () => void | Yes | - |
| itemCount | number | No | 0 |
| className | string | No | "" |

### Footer Container Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Border Top | border-t border-gray-200 | Separation |
| Padding | p-4 | Spacing |
| Background | bg-white | Clean surface |
| Position | Sticky or relative | Fixed at bottom |

### Subtotal Section

| Element | Styling | Content |
|---------|---------|---------|
| Container | flex justify-between items-center | Layout |
| Label | text-gray-600 font-medium | "Subtotal:" |
| Amount | text-lg font-semibold text-gray-900 | ₨ 16,000.00 |

### Buttons Layout

| Property | Value | Purpose |
|----------|-------|---------|
| Container | grid grid-cols-2 gap-3 | Two equal columns |
| Margin Top | mt-3 | Spacing from subtotal |
| Width | w-full | Full footer width |

### View Cart Button

| Property | Value | Purpose |
|----------|-------|---------|
| Variant | Outline/Secondary | Less prominent |
| Border | border-2 border-blue-600 | Brand border |
| Text Color | text-blue-600 | Brand color |
| Background | transparent | Outline style |
| Hover BG | hover:bg-blue-50 | Subtle feedback |
| Padding | py-2 px-4 | Comfortable size |
| Radius | rounded-lg | Modern appearance |

### Checkout Button

| Property | Value | Purpose |
|----------|-------|---------|
| Variant | Primary/Filled | Most prominent |
| Background | bg-blue-600 | Brand color |
| Text Color | text-white | High contrast |
| Hover BG | hover:bg-blue-700 | Darker on hover |
| Padding | py-2 px-4 | Comfortable size |
| Radius | rounded-lg | Modern appearance |
| Font Weight | font-semibold | Emphasis |

### Price Formatting

| Input (cents/paisa) | Output |
|---------------------|--------|
| 1600000 | ₨ 16,000.00 |
| 550000 | ₨ 5,500.00 |
| 125000 | ₨ 1,250.00 |

### Shipping Notice

| Property | Value |
|----------|-------|
| Text | "Shipping calculated at checkout" |
| Size | text-xs |
| Color | text-gray-500 |
| Position | Below subtotal, above buttons |
| Margin | mt-1 mb-2 |

### Button States

| State | View Cart | Checkout |
|-------|-----------|----------|
| Default | Outline blue | Filled blue |
| Hover | Light blue bg | Darker blue bg |
| Disabled | Gray outline | Gray filled |
| Loading | Spinner + disabled | Spinner + disabled |

### Empty Cart Behavior

| Condition | Behavior |
|-----------|----------|
| itemCount === 0 | Disable checkout button |
| itemCount === 0 | Show different message |
| itemCount === 0 | Optional: hide footer |

### Navigation Flow

```
User Clicks View Cart
    │
    ├─ Trigger onViewCart
    │
    ├─ Navigate to /cart
    │
    └─ Close mini cart dropdown

User Clicks Checkout
    │
    ├─ Trigger onCheckout
    │
    ├─ Navigate to /checkout
    │
    └─ Close mini cart dropdown
```

### Expected Outcome
- Clear subtotal display with formatting
- Two action buttons for cart and checkout
- Proper button styling (outline and filled)
- Navigation to correct pages
- Optional shipping notice
- Disabled state for empty cart
- Clean, organized layout

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/MiniCartFooter.tsx` file created
- [ ] Component accepts subtotal, onViewCart, onCheckout props
- [ ] Subtotal displays with currency symbol (₨)
- [ ] Subtotal formatted with thousands separators
- [ ] View Cart button created with outline style
- [ ] Checkout button created with filled style
- [ ] Buttons laid out in grid (equal width)
- [ ] View Cart navigates to /cart
- [ ] Checkout navigates to /checkout
- [ ] Border-top separates from items section
- [ ] Optional shipping notice added
- [ ] Buttons disabled when cart empty
- [ ] Component exports properly

---

## Task 33: Create Wishlist Icon

### Overview
Create the WishlistIcon component that displays a heart icon in the header for quick access to the user's wishlist. The icon includes a count badge (similar to cart) if items are present and links to the wishlist page. The wishlist feature encourages users to save products for later purchase.

### Dependencies
- Task 15: Create Header Component
- Task 16: Create Header Types

### Instructions

1. **Create WishlistIcon component file**
   - Create `WishlistIcon.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Use 'use client' directive for interactivity

2. **Import required dependencies**
   - Import React
   - Import Next.js Link component
   - Import Lucide React Heart icon
   - Import WishlistIconProps type

3. **Define component props**
   - itemCount: number (number of items in wishlist)
   - isActive?: boolean (user has items in wishlist)
   - onClick?: function (optional click handler)
   - href?: string (link destination, default: '/wishlist')
   - showBadge?: boolean (show count badge, default: true)
   - className?: string

4. **Implement icon container**
   - Use Next.js Link for navigation
   - Apply relative positioning for badge
   - Ensure proper clickable area
   - Add appropriate padding

5. **Style heart icon**
   - Use Heart icon from Lucide
   - Set icon color (text-gray-700)
   - Add hover state (hover:text-red-600)
   - Apply transition for smooth effect
   - Size: h-6 w-6

6. **Implement filled state logic**
   - Show outline heart by default
   - Show filled heart when items exist (isActive)
   - Use Heart icon with fill property
   - Red color when filled (text-red-600)

7. **Add accessibility attributes**
   - aria-label="Wishlist" or "Wishlist, X items"
   - title="View wishlist"
   - Ensure keyboard accessible
   - Proper focus indicators

8. **Implement wishlist badge**
   - Similar to CartBadge (Task 29)
   - Position absolutely on top-right
   - Show count when items > 0
   - Hide when count is 0
   - Style with red or blue background

9. **Add hover and focus effects**
   - Icon color change on hover
   - Heart fills on hover (optional animation)
   - Focus ring for keyboard navigation
   - Smooth transitions

10. **Handle authentication check**
    - Require login to access wishlist
    - Redirect to login if not authenticated
    - Show tooltip: "Login to save items"
    - Disable click if not logged in

11. **Implement responsive behavior**
    - Visible on desktop (≥ 1024px)
    - Hidden on mobile and tablet (< 1024px)
    - Optional: show in mobile menu instead
    - Ensure touch target size

12. **Add animation on wishlist update (optional)**
    - Pulse or scale when item added
    - Heart fill animation
    - Brief duration (200-300ms)
    - Enhance user feedback

### Wishlist Icon Structure

```
Header Actions
┌─────────────────────────────────────────┐
│  Search  Account  ❤️ [5]  🛒 [3] Cart │
│                     ↑                   │
│               Wishlist Icon + Badge    │
└─────────────────────────────────────────┘
```

### Component Structure

```
WishlistIcon Component
└── Link to /wishlist
    └── Icon Container (relative)
        ├── Heart Icon
        └── Badge (absolute)
            └── Item Count
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| itemCount | number | Yes | 0 |
| isActive | boolean | No | itemCount > 0 |
| onClick | () => void | No | undefined |
| href | string | No | "/wishlist" |
| showBadge | boolean | No | true |
| className | string | No | "" |

### Icon Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Size | h-6 w-6 | Standard icon size |
| Color (empty) | text-gray-700 | Neutral appearance |
| Color (filled) | text-red-600 | Heart color |
| Hover | hover:text-red-600 | Interactive feedback |
| Transition | transition-colors | Smooth effect |
| Cursor | cursor-pointer | Indicate clickability |

### Heart Icon States

| State | Icon Type | Color | Fill |
|-------|-----------|-------|------|
| Empty | Heart outline | gray-700 | none |
| Has Items | Heart filled | red-600 | currentColor |
| Hover | Heart filled | red-600 | currentColor |

### Badge Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Background | bg-red-600 | Match heart color |
| Position | absolute, -top-1 -right-1 | Top-right corner |
| Size | Similar to CartBadge | Consistency |
| Display | Show if count > 0 | Conditional |

### Badge Display Logic

| Item Count | Display |
|------------|---------|
| 0 | Hidden |
| 1-99 | Show count |
| 100+ | Show "99+" |

### Accessibility Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| aria-label | "Wishlist" or "Wishlist, X items" | Screen reader |
| title | "View wishlist" | Tooltip |
| role | "link" (implicit from Link) | Semantics |

### Hover Effects

| State | Icon Color | Fill | Transform |
|-------|------------|------|-----------|
| Default | text-gray-700 | none | none |
| Hover | text-red-600 | filled | scale(1.1) optional |
| Focus | text-red-600 | filled | none |

### Authentication Check

| User State | Behavior |
|------------|----------|
| Logged In | Navigate to wishlist |
| Guest | Redirect to login or show modal |
| Guest Click | Show tooltip: "Login to save items" |

### Responsive Visibility

| Screen Size | Visibility | Reason |
|-------------|------------|--------|
| Mobile (< 768px) | Hidden | Space constraints |
| Tablet (768px - 1024px) | Hidden | Optional feature |
| Desktop (≥ 1024px) | Visible | Ample space |

### Animation on Wishlist Update (Optional)

| Animation | Effect | Duration | Trigger |
|-----------|--------|----------|---------|
| Pulse | scale(1 to 1.2 to 1) | 300ms | Item added |
| Fill | Outline to filled | 200ms | Item added |
| Color | Gray to red | 200ms | Item added |

### Link Destination

| Destination | Purpose |
|-------------|---------|
| /wishlist | Wishlist page |
| /account/wishlist | Alternative route |

### Expected Outcome
- Functional wishlist icon in header
- Heart icon with outline and filled states
- Badge displays item count
- Links to wishlist page
- Hover and focus effects
- Hidden on mobile, visible on desktop
- Authentication check for access
- Optional animation on updates

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/WishlistIcon.tsx` file created
- [ ] Component accepts itemCount prop
- [ ] Heart icon from Lucide React
- [ ] Icon switches between outline and filled
- [ ] Badge displays count when > 0
- [ ] Links to /wishlist page
- [ ] Hover effect changes color to red
- [ ] Focus ring implemented
- [ ] aria-label includes item count
- [ ] Responsive visibility (desktop only)
- [ ] Authentication check implemented
- [ ] Component exports properly

---

## Task 34: Create Header Actions Group

### Overview
Create the HeaderActions component that groups together the right-side header actions: search (desktop), account menu, wishlist, and cart. This container ensures consistent spacing, alignment, and responsive behavior for all action icons in the header.

### Dependencies
- Task 24: Create Account Link
- Task 28: Create Cart Icon Button
- Task 33: Create Wishlist Icon

### Instructions

1. **Create HeaderActions component file**
   - Create `HeaderActions.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Container component for action icons

2. **Import required dependencies**
   - Import React
   - Import AccountLink component (Task 24)
   - Import CartIcon component (Task 28)
   - Import WishlistIcon component (Task 33)
   - Import HeaderSearch component (desktop, Task 21)

3. **Define component props**
   - className?: string (optional additional styling)
   - showSearch?: boolean (show search in actions, default: true)
   - showWishlist?: boolean (show wishlist icon, default: true)

4. **Implement container structure**
   - Create flex container for horizontal layout
   - Apply items-center for vertical alignment
   - Set gap between actions (gap-4 or gap-6)
   - Add padding if needed

5. **Add HeaderSearch (desktop only)**
   - Render HeaderSearch component first
   - Show only on desktop (hidden md:block)
   - Apply margin for separation
   - Optional based on showSearch prop

6. **Add AccountLink**
   - Render AccountLink component
   - Position after search
   - Ensure proper spacing
   - Pass necessary props (isLoggedIn, userName)

7. **Add WishlistIcon**
   - Render WishlistIcon component
   - Show only on desktop (hidden lg:block)
   - Position before cart icon
   - Optional based on showWishlist prop

8. **Add CartIcon**
   - Render CartIcon component last
   - Always visible on all screens
   - Most prominent action
   - Pass itemCount and onClick

9. **Style container**
   - Flexbox layout (flex items-center)
   - Gap between items (gap-4 or gap-6)
   - Padding for mobile (pr-4)
   - Height matches header (h-full)

10. **Implement responsive layout**
    - Mobile: Account icon, Cart icon only
    - Tablet: Account, Cart
    - Desktop: Search, Account, Wishlist, Cart
    - Adjust spacing and visibility

11. **Add dividers between actions (optional)**
    - Vertical line separators
    - Subtle gray color (border-l border-gray-300)
    - Height: h-6
    - Position between actions

12. **Ensure consistent sizing**
    - All icons same size (h-6 w-6)
    - Consistent padding on buttons (p-2)
    - Align centers vertically
    - Uniform spacing

### Header Actions Structure

```
Desktop Layout
┌──────────────────────────────────────────────┐
│  Logo  Navigation  |  🔍 Search  👤  ❤️  🛒 │
│                                              │
└──────────────────────────────────────────────┘
                         ↑ Header Actions Group

Mobile Layout
┌─────────────────────────────────────┐
│  ☰ Menu  Logo          |  👤  🛒  │
│                                     │
└─────────────────────────────────────┘
                         ↑ Header Actions
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| className | string | No | "" |
| showSearch | boolean | No | true |
| showWishlist | boolean | No | true |

### Container Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Display | flex items-center | Horizontal layout |
| Gap | gap-4 or gap-6 | Spacing between actions |
| Height | h-full | Match header height |
| Padding | pr-4 (mobile) | Edge spacing |

### Actions Order

| Position | Component | Desktop | Mobile |
|----------|-----------|---------|--------|
| 1 | HeaderSearch | Visible | Hidden |
| 2 | AccountLink | Visible | Visible |
| 3 | WishlistIcon | Visible | Hidden |
| 4 | CartIcon | Visible | Visible |

### Responsive Visibility

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| HeaderSearch | Hidden | Visible | Visible |
| AccountLink | Visible | Visible | Visible |
| WishlistIcon | Hidden | Hidden | Visible |
| CartIcon | Visible | Visible | Visible |

### Gap Specifications

| Screen Size | Gap | Pixel Value |
|-------------|-----|-------------|
| Mobile | gap-3 | 12px |
| Tablet | gap-4 | 16px |
| Desktop | gap-6 | 24px |

### Divider Styling (Optional)

```
With Dividers
┌───────────────────────────────────────┐
│ Search │ Account │ Wishlist │ Cart   │
│        │         │          │        │
└───────────────────────────────────────┘
         ↑ Vertical dividers
```

| Property | Value | Purpose |
|----------|-------|---------|
| Border | border-l border-gray-300 | Vertical line |
| Height | h-6 | Partial height |
| Margin | mx-2 | Spacing from icons |
| Color | gray-300 | Subtle separator |

### Icon Consistency

| Aspect | Value | Apply To |
|--------|-------|----------|
| Icon Size | h-6 w-6 | All icons |
| Button Padding | p-2 | All buttons |
| Touch Target | 44x44px min | All interactive elements |
| Transition | transition-colors | All hover effects |

### Layout Variants

```
Variant A: Compact (Mobile)
┌─────────────────┐
│ 👤 Account 🛒 │
└─────────────────┘

Variant B: Full (Desktop)
┌────────────────────────────────────┐
│ 🔍 Search  👤 Account  ❤️  🛒   │
└────────────────────────────────────┘
```

### Alignment

| Property | Value | Purpose |
|----------|-------|---------|
| Vertical | items-center | Center icons vertically |
| Horizontal | justify-end | Right-align in header |
| Height | h-full | Match parent height |

### Expected Outcome
- Container grouping all header actions
- Consistent spacing between icons
- Responsive visibility of components
- Clean, organized layout
- Proper alignment and sizing
- Optional dividers between actions
- Integrates with main Header component

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/HeaderActions.tsx` file created
- [ ] Component accepts optional props
- [ ] Flex container with items-center
- [ ] HeaderSearch included (desktop only)
- [ ] AccountLink included
- [ ] WishlistIcon included (desktop only)
- [ ] CartIcon included (always visible)
- [ ] Responsive visibility implemented
- [ ] Consistent gap between actions
- [ ] All icons properly sized
- [ ] Optional dividers added
- [ ] Component exports properly

---

## Summary

This document completed the header components with comprehensive account and shopping functionality. Created account dropdown with separate guest (login/register) and logged-in user menus, cart icon with dynamic count badge, mini cart dropdown displaying product previews with full CRUD operations, wishlist icon for saved items, and header actions container organizing all interactive elements. These components provide a complete e-commerce header experience with intuitive navigation and shopping features.

### Completed Tasks
1. ✓ Created AccountDropdown with animations and focus management
2. ✓ Created LoginRegisterLinks for guest users
3. ✓ Created LoggedInMenu with account navigation and logout
4. ✓ Created CartIcon button with badge integration
5. ✓ Created CartBadge with conditional display and "99+" logic
6. ✓ Created MiniCart dropdown with items and footer
7. ✓ Created MiniCartItem displaying product details
8. ✓ Created MiniCartFooter with subtotal and action buttons
9. ✓ Created WishlistIcon with authentication and responsive behavior
10. ✓ Created HeaderActions group container

### Integration Notes
- All header components should be imported and used in main Header component (Task 15)
- Ensure Zustand store or Context API is set up for cart and wishlist state management
- Connect authentication state from auth service/context
- Test all dropdown interactions and responsive behaviors
- Verify currency formatting uses ₨ symbol consistently
- Ensure keyboard navigation and accessibility features work properly

### Next Steps
Proceed to [Group-C Navigation Mega Menu](../Group-C_Navigation-Mega-Menu/) to create the main navigation menu with category dropdowns and mega menu functionality.
