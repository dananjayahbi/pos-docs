# Tasks 15-24: Header, Logo, Search, and Account

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** B - Header Components  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-34_Account-Menu-Cart-Actions.md](02_Tasks-25-34_Account-Menu-Cart-Actions.md)
- **← Previous Group:** [../Group-A_Layout-Shell-Structure/](../Group-A_Layout-Shell-Structure/)
- **→ Next Group:** [../Group-C_Navigation-Mega-Menu/](../Group-C_Navigation-Mega-Menu/)

---

## Document Overview

This document covers the creation of the main storefront header component with its core elements: the header structure, TypeScript types, container layout, logo component with image handling, header search functionality with mobile overlay, and account link. These components form the foundation of the webstore's navigation and user interaction system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create Header Component | Medium | 30 min |
| 16 | Create Header Types | Low | 15 min |
| 17 | Create Header Container | Low | 20 min |
| 18 | Create Logo Component | Low | 25 min |
| 19 | Create Logo Image Handler | Low | 20 min |
| 20 | Create Logo Link | Low | 15 min |
| 21 | Create Header Search | Medium | 35 min |
| 22 | Create Search Icon Button | Low | 15 min |
| 23 | Create Search Overlay | Medium | 30 min |
| 24 | Create Account Link | Low | 20 min |

---

## Task 15: Create Header Component

### Overview
Create the main Header component for the storefront. This component serves as the primary navigation container, housing the logo, search functionality, account menu, cart, and wishlist. The header uses a responsive layout that adapts between mobile and desktop views, with different arrangements for optimal user experience on each device size.

### Dependencies
- SubPhase-01 (Layout Shell Structure) must be complete
- Next.js App Router structure is established
- Tailwind CSS is configured

### Instructions

1. **Create storefront layout directory**
   - Navigate to `frontend/components/` directory
   - Create path `storefront/layout/Header/` directory structure
   - This houses all header-related components

2. **Create Header component file**
   - Create `Header.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component structure
   - Use 'use client' directive for client-side interactivity

3. **Import required dependencies**
   - Import React and useState hooks
   - Import Next.js Link and Image components
   - Import Lucide React icons (Menu, Search, User, Heart, ShoppingCart)
   - Prepare for component imports (to be created in subsequent tasks)

4. **Define header structure sections**
   - Top bar section (optional, for announcements/offers)
   - Main header section with three zones: left, center, right
   - Mobile menu section (collapsible, shown on mobile only)
   - Plan sticky header behavior

5. **Implement responsive layout logic**
   - Mobile (< 768px): Show menu icon, logo, search icon, cart
   - Tablet (768px - 1024px): Show logo, search bar, account, cart
   - Desktop (≥ 1024px): Show logo, navigation, search, account, wishlist, cart

6. **Add sticky header behavior**
   - Apply sticky positioning to header
   - Add shadow on scroll for depth perception
   - Ensure header stays at top during page scroll
   - Consider z-index layering for proper stacking

7. **Create component state management**
   - Add state for mobile menu open/closed
   - Add state for search overlay visibility (mobile)
   - Prepare state connections for cart count and wishlist

8. **Implement header background and borders**
   - Apply white background with subtle border
   - Add transition effects for smooth interactions
   - Ensure proper contrast for readability

### Header Layout Structure

```
Desktop Layout (≥ 1024px)
┌────────────────────────────────────────────────────────────┐
│  Logo  |  Navigation  |  Search  |  Account  Wishlist  Cart │
└────────────────────────────────────────────────────────────┘

Mobile Layout (< 768px)
┌─────────────────────────────────────────┐
│  ☰ Menu  |  Logo  |  🔍 Search  🛒 Cart │
└─────────────────────────────────────────┘
```

### Header Sections Breakdown

| Section | Desktop Content | Mobile Content |
|---------|-----------------|----------------|
| Left | Logo, Navigation | Menu icon, Logo |
| Center | (Part of Nav) | (Empty) |
| Right | Search, Account, Wishlist, Cart | Search icon, Cart icon |

### Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Compact, icons only |
| Tablet | 768px - 1024px | Expanded, with search bar |
| Desktop | ≥ 1024px | Full layout with all features |

### Header Behavior Specifications

| Feature | Implementation |
|---------|----------------|
| Position | Sticky at top (top-0) |
| Background | White with border-b |
| Z-Index | z-50 (above content) |
| Shadow | On scroll (shadow-md) |
| Height | 64px (h-16) on mobile, 80px (h-20) on desktop |

### State Management Requirements

| State Variable | Type | Purpose |
|----------------|------|---------|
| mobileMenuOpen | boolean | Toggle mobile navigation menu |
| searchOverlayOpen | boolean | Toggle mobile search overlay |
| isScrolled | boolean | Track scroll position for shadow |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Landmarks | Use `<header>` semantic element |
| Navigation | Use `<nav>` within header |
| Skip Links | Add skip to main content link |
| Focus Management | Proper tab order and focus indicators |
| ARIA Labels | Descriptive labels for icon buttons |

### Expected Outcome
- Fully functional main header component structure
- Responsive layout adapting to screen sizes
- Sticky positioning with scroll-based shadow
- State management for interactive features
- Foundation for child components integration

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/Header.tsx` file created
- [ ] Component uses 'use client' directive
- [ ] Responsive layout defined for mobile, tablet, desktop
- [ ] Sticky positioning implemented
- [ ] State variables created for menu and search overlay
- [ ] Header has white background with border
- [ ] Proper z-index for layering
- [ ] Component exports properly

---

## Task 16: Create Header Types

### Overview
Create comprehensive TypeScript type definitions for all header-related components. These types ensure type safety, improve developer experience with IntelliSense, and document the expected structure of data flowing through header components.

### Dependencies
- Task 15: Create Header Component

### Instructions

1. **Create types directory structure**
   - Navigate to `frontend/types/` directory
   - Create subdirectory `store/` for storefront types
   - This separates storefront types from ERP types

2. **Create header types file**
   - Create `header.ts` in `types/store/` directory
   - Set up TypeScript interface and type definitions
   - Export all types for use across components

3. **Define HeaderProps interface**
   - Props for main Header component
   - Include optional className for styling flexibility
   - Include optional storeName for dynamic branding

4. **Define LogoProps interface**
   - src: string (path to logo image)
   - alt: string (accessibility text)
   - width: number (logo width in pixels)
   - height: number (logo height in pixels)
   - className?: string (optional additional styling)

5. **Define SearchProps interface**
   - placeholder: string (search input placeholder)
   - onSearch: function (search handler callback)
   - value: string (controlled input value)
   - onChange: function (input change handler)
   - className?: string

6. **Define AccountMenuProps interface**
   - isLoggedIn: boolean (user authentication state)
   - userName?: string (display name for logged-in users)
   - userEmail?: string (user email)
   - onLogout: function (logout handler)

7. **Define CartProps interface**
   - itemCount: number (number of items in cart)
   - subtotal: number (cart subtotal amount)
   - items: CartItem[] (array of cart items)
   - onViewCart: function (navigate to cart page)
   - onCheckout: function (navigate to checkout)

8. **Define CartItem interface**
   - id: string (unique product identifier)
   - name: string (product name)
   - slug: string (URL-friendly product identifier)
   - price: number (item price)
   - quantity: number (quantity in cart)
   - image: string (product thumbnail URL)
   - variant?: string (optional variant info)

9. **Define MiniCartProps interface**
   - isOpen: boolean (dropdown open state)
   - items: CartItem[] (items to display)
   - subtotal: number (total amount)
   - onClose: function (close dropdown handler)
   - onRemoveItem: function (remove item handler)
   - onViewCart: function
   - onCheckout: function

10. **Define WishlistProps interface**
    - itemCount: number (items in wishlist)
    - isActive: boolean (wishlist active state)
    - onClick: function (click handler)

11. **Define SearchOverlayProps interface**
    - isOpen: boolean (overlay visibility)
    - onClose: function (close overlay handler)
    - onSearch: function (search submission)

12. **Define AccountDropdownProps interface**
    - isOpen: boolean (dropdown state)
    - isLoggedIn: boolean (auth state)
    - userName?: string
    - onClose: function
    - menuItems: AccountMenuItem[]

13. **Define AccountMenuItem interface**
    - label: string (menu item text)
    - href: string (destination URL)
    - icon?: React.ReactNode (optional icon)
    - onClick?: function (optional click handler)

14. **Add utility types**
    - HeaderSection enum ('left' | 'center' | 'right')
    - HeaderSize enum ('mobile' | 'tablet' | 'desktop')
    - CurrencyFormatter type for price display

### Type Definitions Structure

| Type Category | Types Included |
|---------------|----------------|
| Component Props | HeaderProps, LogoProps, SearchProps |
| Account & Auth | AccountMenuProps, AccountDropdownProps, AccountMenuItem |
| Cart & Commerce | CartProps, MiniCartProps, CartItem |
| Wishlist | WishlistProps |
| Overlays | SearchOverlayProps |
| Utilities | HeaderSection, HeaderSize, CurrencyFormatter |

### Sample Type Structure

```
HeaderProps
├── className?: string
└── storeName?: string

LogoProps
├── src: string
├── alt: string
├── width: number
├── height: number
└── className?: string

CartItem
├── id: string
├── name: string
├── slug: string
├── price: number
├── quantity: number
├── image: string
└── variant?: string
```

### Type Safety Benefits

| Benefit | Description |
|---------|-------------|
| IntelliSense | Autocomplete in IDE |
| Type Checking | Catch errors at compile time |
| Documentation | Self-documenting code |
| Refactoring | Safe code modifications |
| Consistency | Uniform data structures |

### Currency Handling

| Aspect | Implementation |
|--------|----------------|
| Type | number (in cents/paisa) |
| Display | Format with ₨ symbol |
| Formatter | Utility function for conversion |

### Expected Outcome
- Comprehensive TypeScript types for all header components
- Type-safe props interfaces
- Clear documentation through type definitions
- Reusable types across storefront components

### Verification Checklist
- [ ] `frontend/types/store/header.ts` file created
- [ ] HeaderProps interface defined
- [ ] LogoProps interface defined
- [ ] SearchProps interface defined
- [ ] AccountMenuProps interface defined
- [ ] CartProps and CartItem interfaces defined
- [ ] MiniCartProps interface defined
- [ ] WishlistProps interface defined
- [ ] SearchOverlayProps interface defined
- [ ] AccountDropdownProps and AccountMenuItem interfaces defined
- [ ] All types exported properly
- [ ] No TypeScript errors

---

## Task 17: Create Header Container

### Overview
Create the HeaderContainer component that provides consistent padding, max-width constraints, and responsive layout for all header content. This container ensures the header content is properly centered and constrained on large screens while maintaining full-width appearance on smaller devices.

### Dependencies
- Task 15: Create Header Component
- Task 16: Create Header Types

### Instructions

1. **Create HeaderContainer component file**
   - Create `HeaderContainer.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - This is a layout utility component

2. **Import necessary types**
   - Import React and ReactNode types
   - Import HeaderContainerProps from types (if created)
   - Import className utility if available

3. **Define component props interface**
   - children: ReactNode (required, content to wrap)
   - className?: string (optional additional styling)
   - maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' (optional width constraint)
   - as?: 'div' | 'nav' | 'section' (optional HTML element type)

4. **Implement container layout**
   - Create responsive container div
   - Apply horizontal padding for mobile spacing
   - Set max-width for desktop constraint
   - Center content using mx-auto

5. **Add responsive padding**
   - Mobile (< 640px): px-4
   - Tablet (640px - 1024px): px-6
   - Desktop (≥ 1024px): px-8
   - Large Desktop (≥ 1280px): px-12

6. **Implement max-width variants**
   - Default: max-w-7xl (1280px)
   - Small: max-w-4xl (896px)
   - Medium: max-w-5xl (1024px)
   - Large: max-w-6xl (1152px)
   - Extra Large: max-w-7xl (1280px)
   - Full: max-w-full (no constraint)

7. **Add flex layout support**
   - Apply flexbox for horizontal layout
   - Enable items-center for vertical alignment
   - Support justify-between for spacing

8. **Implement dynamic element rendering**
   - Use 'as' prop to render different HTML elements
   - Default to 'div'
   - Support 'nav' and 'section' for semantic HTML

### Container Layout Structure

```
Full Screen Width
┌──────────────────────────────────────────────────────────────┐
│  Padding         Constrained Content          Padding        │
│    ←─────────────────────────────────────────────→           │
│                  (max-w-7xl centered)                        │
└──────────────────────────────────────────────────────────────┘
```

### Padding Specifications

| Screen Size | Breakpoint | Padding Class | Pixel Value |
|-------------|------------|---------------|-------------|
| Mobile | < 640px | px-4 | 16px each side |
| Tablet | 640px - 1024px | px-6 | 24px each side |
| Desktop | 1024px - 1280px | px-8 | 32px each side |
| Large Desktop | ≥ 1280px | px-12 | 48px each side |

### Max-Width Variants

| Variant | Tailwind Class | Pixel Width | Use Case |
|---------|----------------|-------------|----------|
| Small | max-w-4xl | 896px | Compact layouts |
| Medium | max-w-5xl | 1024px | Standard layouts |
| Large | max-w-6xl | 1152px | Wider layouts |
| Extra Large | max-w-7xl | 1280px | Full width (default) |
| Full | max-w-full | No limit | Edge-to-edge |

### Component Usage Examples

```
Basic Usage:
<HeaderContainer>
  <Logo />
  <Nav />
  <Actions />
</HeaderContainer>

With Max-Width:
<HeaderContainer maxWidth="xl">
  {children}
</HeaderContainer>

As Navigation:
<HeaderContainer as="nav">
  <NavLinks />
</HeaderContainer>
```

### Flex Layout Utilities

| Property | Default | Purpose |
|----------|---------|---------|
| display | flex | Enable flexbox |
| align-items | center | Vertical centering |
| justify-content | between | Space distribution |
| gap | gap-4 or gap-6 | Spacing between items |

### Semantic HTML Options

| Element | When to Use |
|---------|-------------|
| div | Generic container (default) |
| nav | Navigation wrapper |
| section | Logical content section |

### Expected Outcome
- Reusable container component for header content
- Responsive padding that adapts to screen size
- Configurable max-width constraints
- Centered content on large screens
- Flexible element type rendering

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/HeaderContainer.tsx` file created
- [ ] Component accepts children prop
- [ ] Optional className prop supported
- [ ] Responsive padding implemented (px-4, px-6, px-8, px-12)
- [ ] Max-width constraint applied (max-w-7xl default)
- [ ] Content centered with mx-auto
- [ ] Flexbox layout configured
- [ ] Dynamic element type rendering with 'as' prop
- [ ] Component exports properly

---

## Task 18: Create Logo Component

### Overview
Create the Logo component that displays the store's logo in the header. This component handles logo display with proper sizing, aspect ratio maintenance, and serves as a clickable link to the homepage. The logo is a critical branding element and should be optimized for performance and accessibility.

### Dependencies
- Task 15: Create Header Component
- Task 16: Create Header Types
- Task 17: Create Header Container

### Instructions

1. **Create Logo component file**
   - Create `Logo.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Use 'use client' directive if needed for interactivity

2. **Import required dependencies**
   - Import React
   - Import Next.js Image component for optimization
   - Import Next.js Link component for navigation
   - Import LogoProps type from header types

3. **Define component props**
   - src: string (logo image path, default: '/logo.svg')
   - alt: string (alt text, default: 'Store Logo')
   - width: number (logo width, default: 150)
   - height: number (logo height, default: 40)
   - href: string (link destination, default: '/')
   - className?: string (optional styling)
   - priority?: boolean (image loading priority)

4. **Implement logo wrapper structure**
   - Create container div for logo positioning
   - Apply flex layout for alignment
   - Set appropriate padding or margin

5. **Integrate Next.js Link**
   - Wrap logo in Link component for navigation
   - Set href to homepage or custom destination
   - Add aria-label for accessibility ("Go to homepage")

6. **Implement Next.js Image component**
   - Use Image component for automatic optimization
   - Set src, alt, width, height props
   - Enable priority loading for above-fold content
   - Maintain aspect ratio with proper sizing

7. **Add responsive sizing logic**
   - Mobile: Smaller logo (width: 120px, height: 32px)
   - Tablet: Medium logo (width: 140px, height: 38px)
   - Desktop: Full logo (width: 150px, height: 40px)
   - Use responsive variants or CSS classes

8. **Implement hover effects**
   - Add subtle opacity change on hover (hover:opacity-80)
   - Add transition for smooth effect
   - Consider scale transform for interactivity

9. **Handle logo loading states**
   - Add loading skeleton or placeholder
   - Handle image load errors gracefully
   - Display fallback if image fails to load

### Logo Sizing Guide

| Screen Size | Width | Height | Use Case |
|-------------|-------|--------|----------|
| Mobile | 120px | 32px | Compact header |
| Tablet | 140px | 38px | Medium header |
| Desktop | 150px | 40px | Full header |
| Custom | Configurable | Configurable | Special layouts |

### Logo Component Structure

```
┌──────────────────────────┐
│   <Link to="/">         │
│     ┌──────────────┐     │
│     │              │     │
│     │  Logo Image  │     │
│     │   (Next.js)  │     │
│     │              │     │
│     └──────────────┘     │
│   </Link>                │
└──────────────────────────┘
     ↑ Clickable Area ↑
```

### Image Optimization Features

| Feature | Implementation |
|---------|----------------|
| Format | WebP with fallback |
| Lazy Loading | Disabled (priority: true) |
| Responsive | Automatic srcset |
| Optimization | Next.js Image API |
| Caching | Automatic browser caching |

### Accessibility Requirements

| Feature | Implementation |
|---------|----------------|
| Alt Text | Descriptive store name |
| Link Label | aria-label="Go to homepage" |
| Focus Indicator | Visible focus ring |
| Keyboard Nav | Fully keyboard accessible |

### Hover Effects

| Effect | CSS Property | Value |
|--------|-------------|--------|
| Opacity | opacity | 0.8 on hover |
| Transition | transition | opacity 200ms |
| Scale (optional) | transform | scale(1.05) |
| Cursor | cursor | pointer |

### Fallback Handling

| Scenario | Solution |
|----------|----------|
| Image Not Found | Display text logo |
| Slow Loading | Show placeholder |
| Image Error | Log error, show fallback |

### Expected Outcome
- Functional logo component with image display
- Clickable link to homepage
- Optimized image loading with Next.js Image
- Responsive sizing across devices
- Accessible with proper ARIA labels
- Smooth hover interactions

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/Logo.tsx` file created
- [ ] Component accepts LogoProps
- [ ] Next.js Link wraps logo for navigation
- [ ] Next.js Image component used for optimization
- [ ] Alt text provided for accessibility
- [ ] Responsive sizing implemented
- [ ] Hover effects applied
- [ ] Priority loading enabled
- [ ] Link has aria-label
- [ ] Component exports properly

---

## Task 19: Create Logo Image Handler

### Overview
Create utility functions and logic to handle logo image loading, error handling, placeholder display, and dynamic logo switching (e.g., light/dark mode logos). This handler ensures robust logo display across various scenarios and provides fallback mechanisms for better user experience.

### Dependencies
- Task 18: Create Logo Component

### Instructions

1. **Create logo utilities file**
   - Create `logoUtils.ts` in `components/storefront/layout/Header/` directory
   - Or create in `utils/store/` for broader reusability
   - Export utility functions for logo handling

2. **Implement getLogoSource function**
   - Accept theme parameter ('light' | 'dark')
   - Accept logo configuration object
   - Return appropriate logo path based on theme
   - Provide default fallback logo path

3. **Create handleLogoError function**
   - Accept error event from image loading
   - Log error to console or monitoring service
   - Set fallback image source
   - Optionally display text-based logo

4. **Implement getLogoPlaceholder function**
   - Return placeholder image or data URI
   - Generate SVG placeholder with store initials
   - Match placeholder dimensions to logo size
   - Use brand colors for consistency

5. **Create preloadLogo function**
   - Preload logo image for faster display
   - Use Image() constructor for preloading
   - Handle preload success and failure
   - Cache logo in browser memory

6. **Implement validateLogoPath function**
   - Check if logo path is valid URL or file path
   - Validate file extension (svg, png, jpg, webp)
   - Return boolean for valid/invalid
   - Provide error messages for debugging

7. **Create getResponsiveLogoSizes function**
   - Accept viewport width
   - Return appropriate logo dimensions
   - Calculate based on breakpoints
   - Maintain aspect ratio

8. **Implement theme-aware logo switching**
   - Detect system theme preference
   - Switch between light and dark logos
   - Listen for theme changes
   - Update logo dynamically

9. **Add logo configuration interface**
   - Define LogoConfig type
   - Include light and dark logo paths
   - Include dimensions and alt text
   - Include fallback options

10. **Create text-based fallback generator**
    - Extract store name initials
    - Generate SVG with initials
    - Apply brand styling
    - Return as data URI for inline use

### Logo Utility Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| getLogoSource | Get theme-appropriate logo path | string |
| handleLogoError | Handle image loading errors | void |
| getLogoPlaceholder | Generate placeholder image | string |
| preloadLogo | Preload logo for performance | Promise<void> |
| validateLogoPath | Validate logo path | boolean |
| getResponsiveLogoSizes | Calculate responsive sizes | {width, height} |
| generateInitialLogo | Create text fallback | string (SVG data URI) |

### Logo Configuration Structure

```
LogoConfig
├── light: string (light mode logo path)
├── dark: string (dark mode logo path)
├── default: string (fallback logo)
├── width: number
├── height: number
├── alt: string
└── storeName: string
```

### Theme Detection Logic

| Method | API | Support |
|--------|-----|---------|
| System Preference | window.matchMedia('(prefers-color-scheme: dark)') | Modern browsers |
| Local Storage | localStorage.getItem('theme') | Manual theme setting |
| CSS Class | document.documentElement.classList | Theme class on root |

### Error Handling Flow

```
Image Load Attempt
    │
    ├─ Success → Display logo
    │
    └─ Failure
         │
         ├─ Try Fallback Image
         │    │
         │    ├─ Success → Display fallback
         │    │
         │    └─ Failure → Generate Text Logo
         │
         └─ Display Text Logo (Initials)
```

### Responsive Logo Sizing Logic

| Viewport Width | Logo Width | Logo Height | Multiplier |
|----------------|------------|-------------|------------|
| < 640px | 100px | 28px | 0.7x |
| 640px - 768px | 120px | 32px | 0.8x |
| 768px - 1024px | 140px | 38px | 0.93x |
| ≥ 1024px | 150px | 40px | 1.0x |

### Placeholder SVG Generation

| Element | Value |
|---------|-------|
| Background | Brand primary color |
| Text | White or contrast color |
| Font | Bold, sans-serif |
| Size | Match logo dimensions |
| Text | Store initials (e.g., "LCC") |

### Image Validation Rules

| Check | Valid Formats |
|-------|---------------|
| Extension | .svg, .png, .jpg, .jpeg, .webp |
| Protocol | http://, https://, / (relative) |
| Path | Must not be empty string |

### Expected Outcome
- Robust logo image handling utilities
- Theme-aware logo switching
- Graceful error handling with fallbacks
- Text-based logo generation for failures
- Responsive sizing calculations
- Image preloading for performance

### Verification Checklist
- [ ] Logo utilities file created
- [ ] getLogoSource function implemented
- [ ] handleLogoError function created
- [ ] getLogoPlaceholder function created
- [ ] preloadLogo function implemented
- [ ] validateLogoPath function created
- [ ] getResponsiveLogoSizes function implemented
- [ ] Theme detection logic added
- [ ] Text fallback generator created
- [ ] LogoConfig interface defined
- [ ] All functions exported properly
- [ ] Error handling tested

---

## Task 20: Create Logo Link

### Overview
Enhance the Logo component with proper link functionality, including navigation behavior, accessibility features, keyboard support, and analytics tracking. This ensures the logo serves as an effective navigation element while maintaining best practices for user experience and SEO.

### Dependencies
- Task 18: Create Logo Component
- Task 19: Create Logo Image Handler

### Instructions

1. **Update Logo component for link integration**
   - Open existing `Logo.tsx` component
   - Ensure Next.js Link is properly imported
   - Verify logo is wrapped in Link component

2. **Configure link behavior**
   - Set href prop to '/' for homepage navigation
   - Use Next.js Link for client-side navigation
   - Ensure no page reload on logo click
   - Test navigation from various pages

3. **Add prefetching optimization**
   - Enable Next.js Link prefetch (default behavior)
   - Consider prefetch={true} for explicit control
   - Prefetch homepage for instant navigation
   - Balance performance with resource usage

4. **Implement accessibility attributes**
   - Add aria-label="Go to homepage" to Link
   - Ensure alt text on Image describes logo
   - Add title attribute for tooltip
   - Verify screen reader compatibility

5. **Add keyboard navigation support**
   - Ensure Link is keyboard accessible (Tab key)
   - Add visible focus indicator styling
   - Test Enter key navigation
   - Verify focus outline is clearly visible

6. **Implement focus styling**
   - Add focus:ring-2 class for focus ring
   - Use brand color for focus ring (focus:ring-blue-500)
   - Add focus:outline-none to remove default outline
   - Ensure focus ring is visible against background

7. **Add click analytics tracking (optional)**
   - Add onClick handler to track logo clicks
   - Send event to analytics service
   - Track navigation source for reporting
   - Ensure tracking doesn't block navigation

8. **Implement active state indication**
   - Detect if current page is homepage
   - Apply subtle visual indicator when active
   - Use router.pathname to check current route
   - Consider cursor style change on hover

9. **Add title attribute for tooltip**
   - Set title="Go to homepage" on Link
   - Provides tooltip on hover for context
   - Improves user experience
   - Cross-browser compatible

10. **Test link functionality**
    - Test navigation from multiple pages
    - Verify prefetching behavior
    - Test keyboard navigation
    - Verify accessibility with screen reader
    - Check focus indicators

### Link Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| href | "/" | Homepage destination |
| prefetch | true | Preload homepage |
| aria-label | "Go to homepage" | Screen reader description |
| title | "Go to homepage" | Tooltip text |
| onClick | (optional) | Analytics tracking |

### Accessibility Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| aria-label | "Go to homepage" | Screen reader label |
| title | "Go to homepage" | Tooltip |
| alt (Image) | "Store Logo" | Image description |
| role | "link" (implicit) | Semantic meaning |

### Focus Styling

| State | Styles | Visual Result |
|-------|--------|---------------|
| Default | No outline | Clean appearance |
| Focus | ring-2, ring-blue-500 | Blue ring around logo |
| Hover | opacity-80 | Subtle dimming |
| Active | opacity-90 | Slight feedback |

### Focus Ring Implementation

```
Focus States:
┌─────────────────────────┐
│ ┌─────────────────────┐ │ ← Focus ring (2px blue)
│ │                     │ │
│ │   Logo Image        │ │
│ │                     │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Analytics Tracking (Optional)

| Event | Data Captured |
|-------|---------------|
| Event Name | "logo_click" |
| Source Page | router.pathname |
| Timestamp | Date.now() |
| User Session | Session ID |

### Keyboard Navigation Support

| Key | Action |
|-----|--------|
| Tab | Focus logo link |
| Enter | Navigate to homepage |
| Shift+Tab | Focus previous element |

### Link Performance Optimization

| Technique | Implementation |
|-----------|----------------|
| Prefetching | Next.js Link default |
| Client Navigation | No page reload |
| Resource Hints | Preload critical assets |

### Expected Outcome
- Logo functions as clickable homepage link
- Accessible via keyboard navigation
- Clear focus indicators for usability
- Prefetching for instant navigation
- Optional analytics tracking
- Screen reader compatible

### Verification Checklist
- [ ] Logo wrapped in Next.js Link component
- [ ] href prop set to "/"
- [ ] aria-label added to Link
- [ ] title attribute added for tooltip
- [ ] alt text on Image component
- [ ] Focus ring styling implemented
- [ ] Keyboard navigation tested (Tab, Enter)
- [ ] Prefetching enabled
- [ ] Click tracking added (optional)
- [ ] Screen reader tested
- [ ] Navigation from multiple pages tested

---

## Task 21: Create Header Search

### Overview
Create the HeaderSearch component that provides product search functionality in the header. This component includes a search input field with icon, submit functionality, and autocomplete suggestions. The search is responsive, showing as an inline input on desktop and an icon button on mobile that triggers an overlay.

### Dependencies
- Task 15: Create Header Component
- Task 16: Create Header Types
- Task 17: Create Header Container

### Instructions

1. **Create HeaderSearch component file**
   - Create `HeaderSearch.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Use 'use client' directive for client-side functionality

2. **Import required dependencies**
   - Import React, useState, useEffect hooks
   - Import Next.js router for navigation
   - Import Lucide React Search icon
   - Import SearchProps type from header types

3. **Define component props**
   - placeholder: string (default: "Search products...")
   - onSearch: function (search handler callback)
   - value?: string (controlled input value)
   - onChange?: function (input change handler)
   - showResults?: boolean (show autocomplete dropdown)
   - className?: string

4. **Create component state**
   - searchQuery: string (current search input)
   - isFocused: boolean (input focus state)
   - searchResults: array (autocomplete results)
   - isLoading: boolean (loading state for results)

5. **Implement search input structure**
   - Create form wrapper for search submission
   - Add search input field with proper type
   - Add Search icon button for submission
   - Apply responsive visibility (hidden on mobile, visible on tablet+)

6. **Style search input container**
   - Apply flexbox layout for icon and input
   - Set white background with border
   - Add rounded corners (rounded-full or rounded-lg)
   - Set max-width (max-w-md or max-w-lg)
   - Add shadow on focus for depth

7. **Implement search icon**
   - Position Search icon inside input (left side)
   - Make icon clickable for search submission
   - Apply appropriate color (gray when unfocused, brand color when focused)
   - Size icon appropriately (h-5 w-5)

8. **Add input field styling**
   - Remove default input styles (border, outline)
   - Add padding for comfortable typing
   - Set placeholder text color
   - Ensure text is readable with proper contrast
   - Set font size and line height

9. **Implement search submission**
   - Handle form onSubmit event
   - Prevent default form submission
   - Navigate to search results page with query
   - Clear search results dropdown after submission
   - Format: `/search?q=${encodeURIComponent(searchQuery)}`

10. **Add input change handler**
    - Update searchQuery state on input change
    - Trigger autocomplete search after debounce
    - Clear results when input is empty
    - Validate input (trim whitespace)

11. **Implement autocomplete functionality (basic)**
    - Create dropdown container below input
    - Fetch search suggestions from API (simulated)
    - Display top 5 results as clickable links
    - Include product image, name, and price
    - Hide dropdown when input loses focus

12. **Add keyboard navigation support**
    - Arrow up/down to navigate suggestions
    - Enter to select highlighted suggestion
    - Escape to close dropdown
    - Tab to move to next element

13. **Implement responsive behavior**
    - Hide on mobile (< 768px) - show icon instead (Task 22)
    - Show inline on tablet (≥ 768px)
    - Full width on tablet, constrained on desktop
    - Adjust styling for different screen sizes

14. **Add loading and empty states**
    - Show loading spinner while fetching results
    - Display "No results found" when search yields nothing
    - Show recent searches when input is empty but focused
    - Provide clear feedback for all states

### Search Input Structure

```
Desktop Layout
┌──────────────────────────────────┐
│  🔍  Search products...         │  ← Input with icon
└──────────────────────────────────┘
        │
        └─ Autocomplete Dropdown ─┐
            ┌──────────────────────┴─┐
            │ Product 1              │
            │ Product 2              │
            │ Product 3              │
            └────────────────────────┘
```

### Search Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| placeholder | string | No | "Search products..." |
| onSearch | (query: string) => void | Yes | - |
| value | string | No | "" |
| onChange | (value: string) => void | No | - |
| showResults | boolean | No | true |
| className | string | No | "" |

### Input Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Background | bg-white or bg-gray-50 | Clean appearance |
| Border | border border-gray-300 | Subtle definition |
| Radius | rounded-full | Pill-shaped input |
| Padding | py-2 px-4 | Comfortable spacing |
| Width | w-full max-w-md | Responsive sizing |
| Focus | ring-2 ring-blue-500 | Focus indicator |

### Search Submission Flow

```
User Input
    │
    ▼
onChange Handler
    │
    ├─ Update searchQuery state
    │
    ├─ Debounce (300ms)
    │
    ├─ Fetch Autocomplete Results
    │
    └─ Display Results
    
User Submit (Enter or Click)
    │
    ▼
onSubmit Handler
    │
    ├─ Prevent default
    │
    ├─ Navigate to /search?q=query
    │
    └─ Close autocomplete
```

### Autocomplete Dropdown Structure

| Element | Content |
|---------|---------|
| Header | "Suggestions" or result count |
| Items | Product list (max 5) |
| Item | Image, name, price, link |
| Empty | "No results found" |
| Loading | Spinner with text |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| ArrowDown | Highlight next result |
| ArrowUp | Highlight previous result |
| Enter | Navigate to highlighted result |
| Escape | Close dropdown |
| Tab | Move to next element, close dropdown |

### Responsive Visibility

| Screen Size | Visibility | Alternative |
|-------------|------------|-------------|
| Mobile (< 768px) | hidden | Icon button (Task 22) |
| Tablet (≥ 768px) | visible | Inline search |
| Desktop (≥ 1024px) | visible | Full search |

### Debounce Implementation

| Setting | Value | Reason |
|---------|-------|--------|
| Delay | 300ms | Balance responsiveness and API calls |
| Method | setTimeout | Standard JavaScript approach |
| Clear on Change | Yes | Prevent outdated requests |

### Expected Outcome
- Functional search input with icon
- Form submission navigates to search results page
- Basic autocomplete dropdown with suggestions
- Keyboard navigation support
- Responsive display (hidden on mobile)
- Focus states and visual feedback
- Debounced input for performance

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/HeaderSearch.tsx` file created
- [ ] Component uses 'use client' directive
- [ ] Search input with icon created
- [ ] Form submission handler implemented
- [ ] Navigation to search results page works
- [ ] searchQuery state managed correctly
- [ ] Autocomplete dropdown structure created
- [ ] Keyboard navigation implemented (arrows, Enter, Escape)
- [ ] Responsive visibility (hidden on mobile)
- [ ] Focus styling applied
- [ ] Debounce implemented for input
- [ ] Component exports properly

---

## Task 22: Create Search Icon Button

### Overview
Create a Search icon button component that appears in the mobile header. When clicked, this button triggers the search overlay (created in Task 23), allowing mobile users to search without cluttering the compact mobile header layout.

### Dependencies
- Task 21: Create Header Search

### Instructions

1. **Create SearchIconButton component file**
   - Create `SearchIconButton.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Use 'use client' directive for interactivity

2. **Import required dependencies**
   - Import React
   - Import Lucide React Search icon
   - Import button click handler types

3. **Define component props**
   - onClick: function (click handler to open search overlay)
   - className?: string (optional additional styling)
   - label?: string (accessibility label, default: "Search")
   - size?: 'sm' | 'md' | 'lg' (icon size variant)

4. **Implement button structure**
   - Create button element with proper type="button"
   - Add Search icon inside button
   - Ensure button is properly clickable
   - Apply appropriate padding and sizing

5. **Style icon button**
   - Set icon color (text-gray-700 or text-gray-900)
   - Add hover state (hover:text-blue-600)
   - Apply transition for smooth color change
   - Ensure icon is properly sized (h-6 w-6 default)

6. **Add accessibility attributes**
   - Add aria-label="Search" for screen readers
   - Add title="Search" for tooltip
   - Ensure button is keyboard accessible
   - Add proper focus indicators

7. **Implement responsive visibility**
   - Show only on mobile (< 768px)
   - Hide on tablet and desktop (≥ 768px)
   - Use Tailwind responsive classes (block md:hidden)

8. **Add focus styling**
   - Add focus ring (focus:ring-2 focus:ring-blue-500)
   - Add focus:outline-none to remove default
   - Ensure focus indicator is clearly visible
   - Round focus ring (focus:rounded-full)

9. **Implement active/pressed state**
   - Add active state styling (active:text-blue-700)
   - Consider scale transform on press
   - Provide tactile feedback for touch devices

10. **Integrate with parent component**
    - Accept onClick prop from Header component
    - Trigger search overlay when clicked
    - Ensure state management is connected
    - Test click behavior

### Icon Button Structure

```
Mobile Header
┌─────────────────────────────────────┐
│ ☰ Menu  | Logo |  [🔍]  [🛒] Cart  │
│                       ↑               │
│                Search Icon Button    │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| onClick | () => void | Yes | - |
| className | string | No | "" |
| label | string | No | "Search" |
| size | 'sm' \| 'md' \| 'lg' | No | "md" |

### Button Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Display | inline-flex | Center icon |
| Padding | p-2 | Clickable area |
| Color | text-gray-700 | Neutral appearance |
| Hover | hover:text-blue-600 | Interactive feedback |
| Transition | transition-colors duration-200 | Smooth change |
| Cursor | cursor-pointer | Indicate clickability |

### Icon Size Variants

| Size | Tailwind Class | Pixel Size |
|------|----------------|------------|
| Small | h-5 w-5 | 20x20px |
| Medium | h-6 w-6 | 24x24px |
| Large | h-7 w-7 | 28x28px |

### Accessibility Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| aria-label | "Search" | Screen reader description |
| title | "Search" | Tooltip on hover |
| type | "button" | Prevent form submission |
| role | "button" (implicit) | Semantic meaning |

### Responsive Visibility

| Screen Size | Visibility | Class |
|-------------|------------|-------|
| Mobile (< 768px) | Visible | block md:hidden |
| Tablet (≥ 768px) | Hidden | - |
| Desktop (≥ 1024px) | Hidden | - |

### Focus and Hover States

| State | Styles | Visual Effect |
|-------|--------|---------------|
| Default | text-gray-700 | Neutral gray icon |
| Hover | text-blue-600 | Brand color |
| Focus | ring-2 ring-blue-500 | Blue focus ring |
| Active | text-blue-700 | Darker blue |

### Touch Target Size

| Platform | Minimum Size | Implementation |
|----------|--------------|----------------|
| Mobile | 44x44px | p-2 with h-6 w-6 icon |
| Touch | 48x48px (recommended) | p-3 for larger target |

### Expected Outcome
- Functional icon button for mobile search
- Visible only on mobile devices
- Proper accessibility attributes
- Clear hover and focus states
- Adequate touch target size
- Smooth transitions and interactions

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/SearchIconButton.tsx` file created
- [ ] Component accepts onClick prop
- [ ] Search icon displayed correctly
- [ ] Responsive visibility (mobile only)
- [ ] aria-label and title attributes added
- [ ] Focus ring implemented
- [ ] Hover state styling applied
- [ ] Touch target size adequate (min 44x44px)
- [ ] Button type set to "button"
- [ ] Component exports properly
- [ ] Click handler triggers correctly

---

## Task 23: Create Search Overlay

### Overview
Create the SearchOverlay component that provides a full-width search interface for mobile devices. This overlay slides down from the header when the search icon button is clicked, providing a dedicated space for mobile search with autocomplete results and easy dismissal.

### Dependencies
- Task 22: Create Search Icon Button

### Instructions

1. **Create SearchOverlay component file**
   - Create `SearchOverlay.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Use 'use client' directive for interactivity

2. **Import required dependencies**
   - Import React, useState, useEffect, useRef hooks
   - Import Next.js router for navigation
   - Import Lucide React icons (Search, X)
   - Import SearchOverlayProps type

3. **Define component props**
   - isOpen: boolean (overlay visibility state)
   - onClose: function (close overlay handler)
   - onSearch: function (search submission handler)
   - placeholder?: string (default: "Search products...")

4. **Implement overlay container**
   - Create overlay wrapper with fixed positioning
   - Position below header (top-16 or top-20)
   - Set full width (w-full)
   - Apply white background with shadow
   - Add z-index for proper layering (z-40)

5. **Add overlay animation**
   - Slide down from header on open
   - Slide up to hide on close
   - Use CSS transitions or Framer Motion
   - Duration: 200-300ms for smooth effect

6. **Create search input section**
   - Add search input field similar to HeaderSearch
   - Include Search icon on left
   - Add Close (X) icon button on right
   - Auto-focus input when overlay opens

7. **Implement input auto-focus**
   - Use useRef to reference input element
   - Use useEffect to focus input when overlay opens
   - Ensure keyboard appears on mobile devices
   - Maintain focus within overlay

8. **Style search input**
   - Full width with padding (w-full p-4)
   - Large text size for mobile (text-lg)
   - Remove borders, use subtle background
   - Add bottom border for separation

9. **Add close button**
   - Position X icon on right side of input
   - Make button easily tappable (min 44x44px)
   - Add aria-label="Close search"
   - Trigger onClose when clicked

10. **Implement autocomplete results section**
    - Create results container below input
    - Display search suggestions or recent searches
    - Make results scrollable if needed
    - Show loading state while fetching

11. **Add backdrop/overlay background**
    - Create semi-transparent backdrop below overlay
    - Cover remaining screen space
    - Click backdrop to close overlay
    - Prevent body scroll when overlay is open

12. **Implement keyboard handling**
    - Escape key to close overlay
    - Enter key to submit search
    - Tab to navigate between elements
    - Trap focus within overlay when open

13. **Handle search submission**
    - Capture form submit or Enter key press
    - Navigate to search results page
    - Close overlay after submission
    - Clear input if needed

14. **Add responsive adjustments**
    - Full width on all mobile sizes
    - Adjust padding and font sizes
    - Consider tablet view (up to 1024px)
    - Hide on desktop (≥ 1024px)

15. **Implement focus trap**
    - Prevent focus from leaving overlay
    - Cycle focus between input and close button
    - Return focus to search icon button on close

### Overlay Structure

```
Mobile View (Overlay Open)
┌────────────────────────────────────┐
│          Header (Fixed)            │ ← Header remains visible
├────────────────────────────────────┤
│  🔍 Search...                   ✕ │ ← Search Overlay
│────────────────────────────────────│
│  Recent Searches / Suggestions:    │
│  ┌──────────────────────────────┐ │
│  │ Product A                    │ │
│  │ Product B                    │ │
│  │ Product C                    │ │
│  └──────────────────────────────┘ │
├────────────────────────────────────┤
│                                    │ ← Backdrop (semi-transparent)
│        (Click to close)            │
│                                    │
└────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| isOpen | boolean | Yes | - |
| onClose | () => void | Yes | - |
| onSearch | (query: string) => void | Yes | - |
| placeholder | string | No | "Search products..." |

### Overlay Positioning

| Property | Value | Purpose |
|----------|-------|---------|
| Position | fixed | Stay in viewport |
| Top | 64px (h-16) | Below header |
| Width | 100% | Full width |
| Z-Index | 40 | Above content, below modals |
| Background | bg-white | Solid background |
| Shadow | shadow-lg | Depth effect |

### Animation States

| State | Transform | Opacity | Visibility |
|-------|-----------|---------|------------|
| Closed | translateY(-100%) | 0 | hidden |
| Open | translateY(0) | 1 | visible |
| Transition | 200ms ease-in-out | 200ms | - |

### Backdrop Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Position | fixed | Cover viewport |
| Top | 144px (header + overlay) | Below overlay |
| Size | inset-0 | Full coverage |
| Background | bg-black/20 | Semi-transparent |
| Z-Index | 30 | Below overlay |
| Click | Close overlay | Dismiss on click |

### Input Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Width | w-full | Full width |
| Padding | p-4 | Comfortable spacing |
| Text Size | text-lg | Readable on mobile |
| Border | border-b | Subtle separation |
| Focus | outline-none | Custom focus style |

### Keyboard Handlers

| Key | Action |
|-----|--------|
| Escape | Close overlay |
| Enter | Submit search |
| Tab | Navigate within overlay |
| Shift+Tab | Reverse navigate |

### Focus Management

| Action | Focus Target |
|--------|--------------|
| Open Overlay | Search input |
| Close Overlay | Search icon button |
| Tab from Input | Close button |
| Tab from Close | Search input (cycle) |

### Body Scroll Lock

| State | Body Overflow |
|-------|---------------|
| Overlay Open | overflow-hidden |
| Overlay Closed | overflow-auto |

### Expected Outcome
- Full-width search overlay for mobile
- Smooth slide-down/up animation
- Auto-focus on input when opened
- Backdrop closes overlay on click
- Keyboard navigation support
- Focus trap within overlay
- Autocomplete results display
- Body scroll locked when open

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/SearchOverlay.tsx` file created
- [ ] Component accepts isOpen and onClose props
- [ ] Overlay positioned below header (fixed)
- [ ] Slide animation implemented
- [ ] Input auto-focuses when overlay opens
- [ ] Close button (X icon) functional
- [ ] Backdrop covers remaining screen
- [ ] Clicking backdrop closes overlay
- [ ] Escape key closes overlay
- [ ] Enter key submits search
- [ ] Focus trap implemented
- [ ] Body scroll locked when open
- [ ] Autocomplete results section created
- [ ] Component exports properly

---

## Task 24: Create Account Link

### Overview
Create the AccountLink component that serves as the entry point to account-related features. This component displays different content based on authentication state: a "Login" link for guests or a user profile icon/name for logged-in users. Clicking it opens the account dropdown menu (created in Task 25).

### Dependencies
- Task 15: Create Header Component
- Task 16: Create Header Types

### Instructions

1. **Create AccountLink component file**
   - Create `AccountLink.tsx` in `components/storefront/layout/Header/` directory
   - Set up TypeScript React functional component
   - Use 'use client' directive for interactivity

2. **Import required dependencies**
   - Import React
   - Import Lucide React icons (User, ChevronDown)
   - Import AccountLinkProps type from header types
   - Import authentication hook or context

3. **Define component props**
   - isLoggedIn: boolean (authentication state)
   - userName?: string (display name for logged-in users)
   - onClick: function (click handler to open dropdown)
   - className?: string (optional styling)

4. **Implement guest state UI**
   - Display "Login" or "Sign In" text
   - Add User icon before text
   - Make entire element clickable
   - Link behavior or button behavior

5. **Implement logged-in state UI**
   - Display user icon or avatar
   - Show user name or "Account" text
   - Add ChevronDown icon to indicate dropdown
   - Truncate long names with ellipsis

6. **Style account link container**
   - Apply flexbox for icon and text alignment
   - Set appropriate spacing (gap-2)
   - Add padding for clickable area
   - Ensure adequate touch target size

7. **Add hover and focus states**
   - Change text color on hover (hover:text-blue-600)
   - Add smooth transition
   - Apply focus ring for keyboard navigation
   - Ensure accessible color contrast

8. **Implement responsive behavior**
   - Hide text on small mobile (< 640px), show icon only
   - Show icon and text on tablet and desktop
   - Adjust spacing for different screen sizes

9. **Add accessibility attributes**
   - Add aria-label describing function
   - Add aria-haspopup="true" for dropdown indication
   - Add aria-expanded state (true when dropdown open)
   - Ensure keyboard accessible

10. **Handle click behavior**
    - Accept onClick prop from parent
    - Toggle account dropdown on click
    - Prevent default link behavior if needed
    - Manage dropdown open/closed state

11. **Add user avatar support (optional)**
    - Display user profile picture if available
    - Show initials in circle if no picture
    - Fallback to User icon
    - Ensure proper sizing and styling

### Account Link States

| User State | Display | Icon |
|------------|---------|------|
| Guest | "Login" or "Sign In" | User icon |
| Logged In (with name) | User name + dropdown | User icon + ChevronDown |
| Logged In (no name) | "Account" + dropdown | User icon + ChevronDown |

### Component Structure (Guest)

```
┌──────────────────┐
│ 👤 Login         │
└──────────────────┘
   ↑ Clickable
```

### Component Structure (Logged In)

```
┌──────────────────────────┐
│ 👤 John Doe  ▼          │
└──────────────────────────┘
   ↑ Clickable with dropdown indicator
```

### Component Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| isLoggedIn | boolean | Yes | false |
| userName | string | No | undefined |
| onClick | () => void | Yes | - |
| className | string | No | "" |

### Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Display | flex items-center | Icon and text alignment |
| Gap | gap-1 or gap-2 | Spacing between elements |
| Padding | px-3 py-2 | Clickable area |
| Color | text-gray-700 | Default neutral |
| Hover | hover:text-blue-600 | Interactive feedback |
| Transition | transition-colors | Smooth change |
| Cursor | cursor-pointer | Indicate clickability |

### Icon Sizing

| Icon | Size | Purpose |
|------|------|---------|
| User | h-5 w-5 | Profile/login icon |
| ChevronDown | h-4 w-4 | Dropdown indicator |

### Responsive Display

| Screen Size | Display |
|-------------|---------|
| Mobile (< 640px) | Icon only |
| Tablet (≥ 640px) | Icon + Text |
| Desktop (≥ 1024px) | Icon + Text |

### Accessibility Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| aria-label | "Account menu" or "Login" | Screen reader description |
| aria-haspopup | "true" | Indicates dropdown |
| aria-expanded | true/false | Dropdown state |
| role | "button" | Semantic meaning |
| tabIndex | 0 | Keyboard focusable |

### Focus and Hover States

| State | Styles | Visual Effect |
|-------|--------|---------------|
| Default | text-gray-700 | Neutral appearance |
| Hover | text-blue-600 | Brand color |
| Focus | ring-2 ring-blue-500 | Focus indicator |
| Active | text-blue-700 | Pressed state |

### User Name Display

| Name Length | Display |
|-------------|---------|
| Short (< 15 chars) | Full name |
| Medium (15-20 chars) | Truncated with ... |
| Long (> 20 chars) | First name only |

### Avatar/Icon Priority

| Available | Display |
|-----------|---------|
| Profile picture | Avatar image |
| User initials | Initials in circle |
| Nothing | User icon |

### Expected Outcome
- Functional account link component
- Different displays for guest vs logged-in states
- Dropdown indicator for logged-in users
- Proper hover and focus states
- Responsive text visibility
- Accessibility attributes for screen readers
- Click handler triggers dropdown

### Verification Checklist
- [ ] `frontend/components/storefront/layout/Header/AccountLink.tsx` file created
- [ ] Component accepts isLoggedIn, userName, onClick props
- [ ] Guest state displays "Login" with User icon
- [ ] Logged-in state displays user name with dropdown icon
- [ ] Click handler triggers correctly
- [ ] Hover state styling applied
- [ ] Focus ring implemented
- [ ] Responsive text visibility (hide on small mobile)
- [ ] aria-label, aria-haspopup, aria-expanded added
- [ ] Touch target size adequate
- [ ] Component exports properly

---

## Summary

This document established the core header infrastructure including the main Header component structure, TypeScript types for type safety, responsive HeaderContainer, Logo component with image handling and navigation, comprehensive HeaderSearch with autocomplete, mobile SearchIconButton, SearchOverlay for mobile search experience, and AccountLink as the entry point to user account features. These components form the foundation for user navigation and interaction in the storefront.

### Completed Tasks
1. ✓ Created Header component with responsive layout
2. ✓ Created comprehensive Header TypeScript types
3. ✓ Created HeaderContainer for consistent layout
4. ✓ Created Logo component with Next.js Image optimization
5. ✓ Created Logo image handler utilities
6. ✓ Created Logo link with navigation and accessibility
7. ✓ Created HeaderSearch with autocomplete functionality
8. ✓ Created SearchIconButton for mobile
9. ✓ Created SearchOverlay with mobile-optimized search
10. ✓ Created AccountLink with guest/logged-in states

### Next Steps
Proceed to [02_Tasks-25-34_Account-Menu-Cart-Actions.md](02_Tasks-25-34_Account-Menu-Cart-Actions.md) to create the account dropdown menu, cart icon with badge, mini cart dropdown, wishlist icon, and header actions grouping components.
