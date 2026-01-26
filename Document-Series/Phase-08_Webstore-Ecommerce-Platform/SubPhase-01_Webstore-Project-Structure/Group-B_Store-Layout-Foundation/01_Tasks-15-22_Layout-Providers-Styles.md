# Tasks 15-22: Layout, Providers, and Styles

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** B - Store Layout Foundation  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-23-30_Variables-Components-Verify.md](02_Tasks-23-30_Variables-Components-Verify.md)

---

## Document Overview

This document covers the creation of the store layout component, provider infrastructure, and styling foundation for the webstore. It establishes the core layout structure, React Context providers for theme, cart, and authentication, as well as the foundational styling setup including fonts and global styles.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create Store Layout Component | Medium | 30 min |
| 16 | Create Store Providers | Medium | 25 min |
| 17 | Create Store Theme Provider | Medium | 30 min |
| 18 | Create Cart Provider | Medium | 40 min |
| 19 | Create Store Auth Provider | Medium | 35 min |
| 20 | Create Store Head Component | Low | 20 min |
| 21 | Create Store Font Setup | Low | 15 min |
| 22 | Create Store Global Styles | Low | 25 min |

---

## Task 15: Create Store Layout Component

### Overview
Create the main layout component for the storefront that wraps all customer-facing pages. This layout provides the structural foundation including header, main content area, and footer sections. Unlike the ERP dashboard layout, the store layout focuses on e-commerce UX with product navigation, search, cart access, and marketing-focused design.

### Dependencies
- Task 14: Create (storefront) Route Group
- SubPhase-07 (Frontend Infrastructure) completed
- Next.js App Router structure established

### Instructions

1. **Create storefront layout directory structure**
   - Navigate to `frontend/components/storefront/` directory
   - Create new directory named `layout`
   - This will contain all layout-related components for the store

2. **Create StoreLayout component file**
   - Create `StoreLayout.tsx` in `components/storefront/layout/` directory
   - Set up TypeScript React functional component structure
   - This component orchestrates the entire store page structure

3. **Define component props interface**
   - Create `StoreLayoutProps` interface
   - Include `children` prop (ReactNode) for page content
   - Add optional `hideHeader` prop (boolean) for special pages
   - Add optional `hideFooter` prop (boolean) for special pages
   - Add optional `fullWidth` prop (boolean) to disable container constraints

4. **Import required dependencies**
   - Import StoreHeader component (will be created in later tasks)
   - Import StoreFooter component (will be created in later tasks)
   - Import Container component (will be created in Task 25)
   - Import React types (ReactNode, FC)

5. **Implement three-section layout structure**
   - Top section: StoreHeader (navigation, search, cart)
   - Middle section: main content area with {children}
   - Bottom section: StoreFooter (links, newsletter, info)
   - Use semantic HTML5 elements (header, main, footer)

6. **Add conditional rendering logic**
   - Check `hideHeader` prop and conditionally render header
   - Check `hideFooter` prop and conditionally render footer
   - Check `fullWidth` prop to toggle container constraints
   - Ensure children always render regardless of other settings

7. **Apply accessibility attributes**
   - Add `role="main"` to main content section
   - Include skip navigation link for keyboard users
   - Ensure proper heading hierarchy throughout layout
   - Add ARIA landmarks where appropriate

8. **Implement responsive layout structure**
   - Ensure layout adapts to mobile, tablet, and desktop
   - Define minimum height to push footer down
   - Use flexbox for proper content stretching
   - Test with various content lengths

9. **Create layout export file**
   - Create `index.ts` in `components/storefront/layout/` directory
   - Export StoreLayout and related layout components
   - Facilitate clean imports throughout the application

### Layout Structure Overview

```
┌─────────────────────────────────────────────────┐
│              STORE HEADER                       │
│  [Logo] [Nav] [Search] [Account] [Cart]        │
├─────────────────────────────────────────────────┤
│                                                 │
│               MAIN CONTENT                      │
│                                                 │
│            {children}                           │
│         (Page-specific content)                 │
│                                                 │
├─────────────────────────────────────────────────┤
│              STORE FOOTER                       │
│  [Links] [Newsletter] [Social] [Legal]         │
└─────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Page content to display |
| hideHeader | boolean | No | false | Hide header for special pages |
| hideFooter | boolean | No | false | Hide footer for special pages |
| fullWidth | boolean | No | false | Disable container constraints |

### Layout Sections

| Section | Component | Purpose | Visibility |
|---------|-----------|---------|------------|
| Header | StoreHeader | Navigation, search, cart | Conditional |
| Main | children | Page content | Always |
| Footer | StoreFooter | Links, info, newsletter | Conditional |

### Semantic HTML Structure

| Element | Purpose | Accessibility |
|---------|---------|---------------|
| `<header>` | Page header | Landmark navigation |
| `<main>` | Primary content | Main content region |
| `<footer>` | Page footer | Contentinfo landmark |
| `<nav>` | Navigation menus | Navigation landmark |

### Layout Styling Strategy

| Aspect | Implementation | Purpose |
|--------|----------------|---------|
| Minimum Height | `min-h-screen` | Full viewport height |
| Flex Direction | `flex flex-col` | Vertical stacking |
| Main Flex | `flex-1` | Content stretches |
| Background | Store theme colors | Brand consistency |

### Expected Outcome
- Functional store layout component ready for integration
- Three-section structure (header, main, footer)
- Conditional rendering based on props
- Proper TypeScript typing and semantic HTML
- Accessibility features implemented
- Responsive design foundation

### Verification Checklist
- [ ] `frontend/components/storefront/layout/StoreLayout.tsx` created
- [ ] Component accepts all required props
- [ ] Three sections defined (header, main, footer)
- [ ] Conditional rendering works for header and footer
- [ ] Semantic HTML elements used
- [ ] Accessibility attributes applied
- [ ] Component exported in index.ts

---

## Task 16: Create Store Providers

### Overview
Create a centralized StoreProviders component that wraps all store-specific React Context providers. This component establishes the provider hierarchy and ensures proper nesting order for theme, authentication, cart, and notification providers. It serves as the single point of integration for all global store state management.

### Dependencies
- Task 15: Create Store Layout Component
- React Context API understanding
- Next.js client component patterns

### Instructions

1. **Create providers directory**
   - Navigate to `frontend/components/storefront/` directory
   - Create new directory named `providers`
   - This will house all store context providers

2. **Create StoreProviders wrapper file**
   - Create `StoreProviders.tsx` in `components/storefront/providers/` directory
   - Mark as client component with `"use client"` directive
   - This component composes all providers in proper order

3. **Define component props interface**
   - Create `StoreProvidersProps` interface
   - Include `children` prop (ReactNode) for wrapped content
   - Add optional `initialTheme` prop for SSR theme support

4. **Import provider dependencies**
   - Import ThemeProvider (will be created in Task 17)
   - Import CartProvider (will be created in Task 18)
   - Import StoreAuthProvider (will be created in Task 19)
   - Import TanStack Query's QueryClientProvider
   - Import toast library provider (Sonner or react-hot-toast)

5. **Create QueryClient instance**
   - Initialize QueryClient for TanStack Query
   - Configure default query options (staleTime, cacheTime, retry)
   - Set up appropriate error handling
   - Ensure proper TypeScript typing

6. **Implement provider nesting structure**
   - Nest providers in correct order (see hierarchy below)
   - Outer providers: theme, query client
   - Middle providers: authentication
   - Inner providers: cart, toast
   - Wrap children at the innermost level

7. **Add error boundary (optional)**
   - Consider wrapping providers in error boundary
   - Provide fallback UI for provider initialization failures
   - Log errors for debugging purposes

8. **Create providers export file**
   - Create `index.ts` in `components/storefront/providers/` directory
   - Export all provider components
   - Export related types and hooks

9. **Integrate with route group layout**
   - Import StoreProviders in `app/(storefront)/layout.tsx`
   - Wrap children with StoreProviders component
   - Pass any required props (theme, initial data)

### Provider Hierarchy

```
<StoreProviders>
  ├── <ThemeProvider>              ← Theme context (outermost)
  │   └── <QueryClientProvider>    ← TanStack Query
  │       └── <StoreAuthProvider>  ← Customer authentication
  │           └── <CartProvider>   ← Shopping cart state
  │               └── <ToastProvider>  ← Toast notifications
  │                   └── {children}   ← App content
  │                       (innermost)
```

### Provider Order Rationale

| Order | Provider | Reason |
|-------|----------|--------|
| 1 | ThemeProvider | Theme must be available to all components |
| 2 | QueryClientProvider | API data fetching needed by auth/cart |
| 3 | StoreAuthProvider | Auth state needed by cart and pages |
| 4 | CartProvider | Cart depends on auth for user cart sync |
| 5 | ToastProvider | Toasts should respect theme and can show cart updates |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | App content to wrap |
| initialTheme | 'light' \| 'dark' | No | 'light' | Initial theme for SSR |

### QueryClient Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| staleTime | 5 minutes | How long data stays fresh |
| cacheTime | 10 minutes | How long inactive data is cached |
| retry | 1 | Number of retry attempts on failure |
| refetchOnWindowFocus | false | Don't refetch when window regains focus |

### Integration Points

| Component | Imports StoreProviders | Purpose |
|-----------|------------------------|---------|
| (storefront)/layout.tsx | Yes | Wraps all storefront pages |
| Individual pages | No | Inherit providers from layout |
| Components | No | Access contexts via hooks |

### Expected Outcome
- Centralized provider wrapper component
- Correct provider nesting order
- All store contexts available to child components
- Proper TypeScript typing throughout
- Clean integration with route group layout

### Verification Checklist
- [ ] `frontend/components/storefront/providers/StoreProviders.tsx` created
- [ ] Client component directive included (`"use client"`)
- [ ] All providers imported correctly
- [ ] Providers nested in correct order
- [ ] QueryClient configured with proper defaults
- [ ] Component exported in index.ts
- [ ] Integrated into (storefront)/layout.tsx

---

## Task 17: Create Store Theme Provider

### Overview
Create a theme provider specifically for the storefront that manages light/dark mode, store-specific color schemes, and visual preferences. This provider is separate from the ERP dashboard theme and focuses on customer-facing design requirements including brand colors, product display optimization, and accessibility.

### Dependencies
- Task 16: Create Store Providers
- React Context API
- LocalStorage or cookies for theme persistence

### Instructions

1. **Create theme types file**
   - Navigate to `frontend/types/` directory
   - Create `store-theme.ts` file
   - Define TypeScript types for theme modes, colors, and preferences

2. **Define theme type interfaces**
   - Create `StoreTheme` type: 'light' | 'dark' | 'auto'
   - Create `StoreThemeColors` interface with color values
   - Create `StoreThemeConfig` interface for theme settings
   - Create `StoreThemeContext` interface for context value

3. **Create ThemeProvider component file**
   - Create `ThemeProvider.tsx` in `components/storefront/providers/` directory
   - Mark as client component with `"use client"` directive
   - This manages theme state and provides theme utilities

4. **Define component props**
   - Create `ThemeProviderProps` interface
   - Include `children` prop (ReactNode)
   - Add optional `defaultTheme` prop
   - Add optional `storageKey` prop for persistence

5. **Set up theme state management**
   - Use useState hook for current theme
   - Initialize from localStorage/cookies or default
   - Handle SSR/hydration mismatch carefully
   - Implement useEffect for persistence

6. **Implement theme detection logic**
   - Detect system theme preference (prefers-color-scheme)
   - Handle 'auto' mode by listening to system changes
   - Update theme when system preference changes
   - Provide manual override capability

7. **Define theme color schemes**
   - Define light theme color values (backgrounds, text, primary, accent)
   - Define dark theme color values (with proper contrast)
   - Ensure accessibility standards (WCAG AA minimum)
   - Create color utility functions

8. **Implement theme utilities**
   - Create `setTheme` function to change theme
   - Create `toggleTheme` function for quick switching
   - Apply theme to document root via CSS classes or data attributes
   - Update localStorage/cookies on theme change

9. **Create theme context**
   - Create React Context for theme state
   - Provide theme value with current theme and utilities
   - Export context for use in custom hook

10. **Create useStoreTheme hook**
    - Create custom hook to access theme context
    - Include error handling for use outside provider
    - Export hook for component consumption
    - Provide TypeScript typing

11. **Apply theme classes to document**
    - Use useEffect to apply theme class to `<html>` element
    - Add data attribute: `data-store-theme="light"` or `"dark"`
    - This enables CSS selectors: `[data-store-theme="dark"] .class`
    - Ensure smooth transitions between themes

### Theme Type Definitions

| Type | Values | Description |
|------|--------|-------------|
| StoreTheme | 'light' \| 'dark' \| 'auto' | Theme mode |
| StoreThemeColors | object | Color scheme values |
| StoreThemeConfig | object | Theme configuration |

### Theme Color Scheme

| Element | Light Mode | Dark Mode | Usage |
|---------|------------|-----------|-------|
| Background | #ffffff | #0a0a0a | Page background |
| Surface | #f9fafb | #171717 | Card/product backgrounds |
| Text Primary | #171717 | #fafafa | Main text content |
| Text Secondary | #6b7280 | #9ca3af | Secondary text |
| Primary | #0066cc | #3399ff | Brand color, CTAs |
| Accent | #ff6600 | #ff9933 | Highlights, badges |
| Border | #e5e7eb | #374151 | Borders, dividers |
| Error | #dc2626 | #ef4444 | Error states |
| Success | #16a34a | #22c55e | Success states |

### Theme Context Value

| Property | Type | Description |
|----------|------|-------------|
| theme | StoreTheme | Current theme mode |
| setTheme | (theme) => void | Change theme function |
| toggleTheme | () => void | Toggle between light/dark |
| colors | StoreThemeColors | Current color values |
| isDark | boolean | Whether dark mode active |
| isLight | boolean | Whether light mode active |

### Theme Detection Flow

```
Component Mount
    │
    ├─→ Check localStorage
    │   └─→ Theme found? Use it
    │
    ├─→ Check defaultTheme prop
    │   └─→ Prop provided? Use it
    │
    └─→ Check system preference
        └─→ prefers-color-scheme: dark? Use 'dark' : 'light'

Theme Change Event
    │
    ├─→ Update state
    │
    ├─→ Save to localStorage
    │
    └─→ Apply to document root
```

### Storage Strategy

| Method | Key | Value | When to Use |
|--------|-----|-------|-------------|
| localStorage | `store-theme` | 'light' \| 'dark' \| 'auto' | Default choice |
| Cookie | `store-theme` | 'light' \| 'dark' \| 'auto' | If SSR theme needed |

### CSS Integration Approach

| Method | Implementation | Benefits |
|--------|----------------|----------|
| Data Attribute | `[data-store-theme="dark"]` | Clean CSS selectors |
| Class | `.dark-mode` | Simple, widely supported |
| CSS Variables | `var(--store-bg)` | Dynamic color updates |

### System Theme Detection

```
Media Query Listener
    │
    └─→ window.matchMedia('(prefers-color-scheme: dark)')
        │
        ├─→ matches? Apply dark theme
        │
        └─→ Add change listener
            └─→ Update on system theme change
```

### Expected Outcome
- Functional theme provider for storefront
- Support for light, dark, and auto modes
- Persistent theme preference across sessions
- System theme detection and following
- Smooth theme transitions
- Accessible color contrasts in all modes

### Verification Checklist
- [ ] `ThemeProvider.tsx` created in providers directory
- [ ] Theme types defined in `types/store-theme.ts`
- [ ] Theme state management implemented
- [ ] System theme detection working
- [ ] Theme persistence to localStorage/cookies
- [ ] `useStoreTheme` hook created and exported
- [ ] Theme classes applied to document root
- [ ] Light and dark color schemes defined
- [ ] Smooth transitions between themes
- [ ] Accessibility standards met (contrast ratios)

---

## Task 18: Create Cart Provider

### Overview
Create a comprehensive cart provider that manages shopping cart state across the storefront. This provider handles cart items, quantities, totals, and synchronization with backend cart APIs. It provides cart operations like add, remove, update quantities, and apply discounts. The cart persists across page navigation and syncs between tabs.

### Dependencies
- Task 16: Create Store Providers
- Task 19: Create Store Auth Provider (for cart sync)
- React Context API
- TanStack Query (for API calls)

### Instructions

1. **Create cart types file**
   - Navigate to `frontend/types/` directory
   - Create `cart.ts` file for cart-related types
   - Define TypeScript interfaces for cart structure

2. **Define cart type interfaces**
   - Create `CartItem` interface (productId, variantId, quantity, price, etc.)
   - Create `Cart` interface (items array, totals, discounts)
   - Create `CartContextValue` interface (state and methods)
   - Create `CartAction` types for reducer actions

3. **Create CartProvider component file**
   - Create `CartProvider.tsx` in `components/storefront/providers/` directory
   - Mark as client component with `"use client"` directive
   - This manages all cart state and operations

4. **Define component props**
   - Create `CartProviderProps` interface
   - Include `children` prop (ReactNode)
   - Add optional `storageKey` prop for localStorage key

5. **Set up cart state management**
   - Use useReducer for complex cart state management
   - Define cart reducer function with action handlers
   - Initialize cart from localStorage on mount
   - Handle SSR hydration carefully

6. **Implement cart operations**
   - Create `addToCart` function (product, quantity, variant)
   - Create `removeFromCart` function (itemId)
   - Create `updateQuantity` function (itemId, newQuantity)
   - Create `clearCart` function to empty cart
   - Create `applyDiscount` function for promo codes

7. **Calculate cart totals**
   - Create `calculateSubtotal` function (sum of items)
   - Create `calculateDiscount` function (from promo codes)
   - Create `calculateTax` function (based on location)
   - Create `calculateTotal` function (final total)
   - Update totals when items change

8. **Implement cart persistence**
   - Save cart to localStorage on every change
   - Use useEffect to persist cart state
   - Handle localStorage quota exceeded errors
   - Implement debouncing for frequent updates

9. **Add cart-backend synchronization**
   - For authenticated users, sync cart with backend API
   - Use TanStack Query mutations for cart updates
   - Handle merge conflicts (local vs server cart)
   - Implement optimistic updates for better UX

10. **Handle authentication integration**
    - Listen to auth state changes via StoreAuthProvider
    - When user logs in, merge local cart with user cart
    - When user logs out, keep local cart but clear user data
    - Sync cart operations with backend when authenticated

11. **Implement multi-tab synchronization**
    - Use storage event listener for cross-tab sync
    - Update cart when localStorage changes in another tab
    - Handle race conditions gracefully
    - Notify user of cart updates from other tabs

12. **Create cart utilities**
    - Create `getCartItemCount` function (total items)
    - Create `isInCart` function (check if product in cart)
    - Create `getCartItem` function (retrieve specific item)
    - Create validation functions (min/max quantities)

13. **Create useCart hook**
    - Create custom hook to access cart context
    - Include error handling for use outside provider
    - Export hook for component consumption
    - Provide full TypeScript typing

### Cart State Structure

```
Cart
├── items: CartItem[]
│   ├── id: string
│   ├── productId: string
│   ├── variantId?: string
│   ├── name: string
│   ├── price: number
│   ├── quantity: number
│   ├── imageUrl: string
│   └── metadata?: object
├── totals
│   ├── subtotal: number
│   ├── discount: number
│   ├── tax: number
│   └── total: number
├── discount?: DiscountCode
└── updatedAt: Date
```

### Cart Operations

| Operation | Parameters | Return | Description |
|-----------|------------|--------|-------------|
| addToCart | product, quantity, variant | Promise<void> | Add item to cart |
| removeFromCart | itemId | Promise<void> | Remove item from cart |
| updateQuantity | itemId, quantity | Promise<void> | Update item quantity |
| clearCart | - | Promise<void> | Empty entire cart |
| applyDiscount | code | Promise<boolean> | Apply discount code |
| removeDiscount | - | void | Remove applied discount |

### CartItem Interface

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique cart item ID |
| productId | string | Yes | Product identifier |
| variantId | string | No | Product variant ID |
| name | string | Yes | Product name |
| price | number | Yes | Unit price |
| quantity | number | Yes | Item quantity |
| imageUrl | string | Yes | Product image URL |
| maxQuantity | number | No | Stock limit |

### Cart Context Value

| Property | Type | Description |
|----------|------|-------------|
| cart | Cart | Current cart state |
| itemCount | number | Total items in cart |
| isLoading | boolean | Cart operations in progress |
| addToCart | function | Add item to cart |
| removeFromCart | function | Remove item |
| updateQuantity | function | Update quantity |
| clearCart | function | Empty cart |
| applyDiscount | function | Apply promo code |

### Cart Persistence Strategy

```
Cart Change Event
    │
    ├─→ Update state (via reducer)
    │
    ├─→ Calculate totals
    │
    ├─→ Save to localStorage (debounced)
    │
    └─→ If authenticated:
        └─→ Sync to backend API
            ├─→ Optimistic update
            └─→ Handle errors/rollback
```

### Authentication Integration Flow

```
User Logs In
    │
    ├─→ Fetch user's cart from backend
    │
    ├─→ Merge with local cart
    │   ├─→ Same product? Sum quantities
    │   └─→ Different products? Combine
    │
    └─→ Update backend with merged cart

User Logs Out
    │
    ├─→ Keep local cart intact
    │
    └─→ Clear user-specific data
```

### Multi-Tab Synchronization

| Event | Source | Action |
|-------|--------|--------|
| storage | Other tab modified localStorage | Update cart from localStorage |
| visibilitychange | User switches back to tab | Revalidate cart state |
| online | Network connection restored | Sync cart with backend |

### Cart Validation Rules

| Rule | Validation | Error Handling |
|------|------------|----------------|
| Min Quantity | Must be ≥ 1 | Show error toast |
| Max Quantity | Check against stock | Limit to available stock |
| Product Exists | Verify product active | Remove invalid items |
| Price Valid | Check current price | Update to current price |

### Expected Outcome
- Comprehensive cart state management
- Full cart operations (add, remove, update, clear)
- Cart persistence across sessions and tabs
- Backend synchronization for authenticated users
- Automatic total calculations
- Discount code support
- Optimistic updates for better UX

### Verification Checklist
- [ ] `CartProvider.tsx` created in providers directory
- [ ] Cart types defined in `types/cart.ts`
- [ ] Cart reducer implemented with all actions
- [ ] All cart operations functional (add, remove, update, clear)
- [ ] Cart totals calculated automatically
- [ ] localStorage persistence working
- [ ] Multi-tab sync implemented
- [ ] Auth integration working (cart merge on login)
- [ ] Backend API sync for authenticated users
- [ ] `useCart` hook created and exported
- [ ] Discount code functionality implemented
- [ ] Proper TypeScript typing throughout

---

## Task 19: Create Store Auth Provider

### Overview
Create an authentication provider specifically for storefront customers. This provider manages customer authentication state, login/logout operations, registration, and profile access. It is separate from the ERP admin authentication and focuses on customer-facing authentication including guest checkout support and customer preferences.

### Dependencies
- Task 16: Create Store Providers
- React Context API
- TanStack Query for API calls
- JWT token management

### Instructions

1. **Create store auth types file**
   - Navigate to `frontend/types/` directory
   - Create `store-auth.ts` file
   - Define TypeScript interfaces for customer auth

2. **Define auth type interfaces**
   - Create `StoreCustomer` interface (id, email, name, addresses, etc.)
   - Create `StoreAuthState` interface (user, isAuthenticated, isLoading)
   - Create `StoreAuthContextValue` interface (state and methods)
   - Create `LoginCredentials` and `RegisterData` types

3. **Create StoreAuthProvider component file**
   - Create `AuthProvider.tsx` in `components/storefront/providers/` directory
   - Mark as client component with `"use client"` directive
   - This manages customer authentication state

4. **Define component props**
   - Create `StoreAuthProviderProps` interface
   - Include `children` prop (ReactNode)
   - Add optional `tokenKey` prop for storage key

5. **Set up auth state management**
   - Use useState for customer and auth status
   - Use useState for loading and error states
   - Initialize auth state from stored token on mount
   - Handle SSR hydration carefully

6. **Implement token management**
   - Create token storage utilities (save, retrieve, remove)
   - Store JWT tokens in localStorage or httpOnly cookies
   - Implement token refresh logic
   - Handle token expiration gracefully

7. **Create authentication operations**
   - Create `login` function (email, password)
   - Create `logout` function (clear tokens and state)
   - Create `register` function (registration data)
   - Create `updateProfile` function (customer data)
   - Create `changePassword` function

8. **Implement API integration**
   - Use TanStack Query mutations for auth operations
   - Create API calls for login, register, logout, refresh
   - Handle API errors and display to user
   - Implement proper error messages

9. **Add token refresh mechanism**
   - Implement automatic token refresh before expiration
   - Use setInterval or token expiration time
   - Refresh tokens silently in background
   - Handle refresh failures (logout user)

10. **Implement session validation**
    - Create `validateSession` function to check token validity
    - Call on app mount and after visibility changes
    - Verify token with backend API
    - Logout if token invalid or expired

11. **Add guest user support**
    - Allow guest browsing and checkout
    - Generate guest IDs for cart/order tracking
    - Provide "convert to account" functionality
    - Maintain guest data until conversion

12. **Handle authentication redirects**
    - Create `requireAuth` utility function
    - Redirect to login for protected actions
    - Store intended destination for post-login redirect
    - Handle redirect loop prevention

13. **Create useStoreAuth hook**
    - Create custom hook to access auth context
    - Include error handling for use outside provider
    - Export hook for component consumption
    - Provide complete TypeScript typing

14. **Integrate authentication interceptors**
    - Add auth token to API request headers
    - Handle 401 responses (token expired)
    - Attempt token refresh on 401
    - Logout user if refresh fails

### Store Customer Interface

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Customer ID |
| email | string | Yes | Email address |
| firstName | string | Yes | First name |
| lastName | string | Yes | Last name |
| phone | string | No | Phone number |
| addresses | Address[] | No | Shipping addresses |
| defaultAddressId | string | No | Default address ID |
| createdAt | Date | Yes | Registration date |

### Auth Context Value

| Property | Type | Description |
|----------|------|-------------|
| customer | StoreCustomer \| null | Current customer |
| isAuthenticated | boolean | Login status |
| isLoading | boolean | Auth operation in progress |
| isGuest | boolean | Whether user is guest |
| login | function | Login with credentials |
| logout | function | Logout customer |
| register | function | Register new customer |
| updateProfile | function | Update customer data |
| refreshToken | function | Refresh auth token |

### Authentication Flow

```
Login Request
    │
    ├─→ Validate credentials
    │
    ├─→ Call login API
    │   ├─→ Success:
    │   │   ├─→ Store tokens (access + refresh)
    │   │   ├─→ Fetch customer data
    │   │   ├─→ Update auth state
    │   │   └─→ Trigger cart sync
    │   │
    │   └─→ Failure:
    │       ├─→ Display error message
    │       └─→ Clear any partial state
    │
    └─→ Redirect to intended page or home
```

### Token Refresh Flow

```
Token Expiring Soon
    │
    ├─→ Check refresh token validity
    │
    ├─→ Call refresh API
    │   ├─→ Success:
    │   │   ├─→ Store new access token
    │   │   └─→ Continue session
    │   │
    │   └─→ Failure:
    │       ├─→ Clear tokens
    │       ├─→ Update auth state
    │       └─→ Redirect to login
```

### Token Storage Strategy

| Method | Security | Persistence | Best For |
|--------|----------|-------------|----------|
| localStorage | Low | High | Development only |
| sessionStorage | Low | Session only | Temporary sessions |
| httpOnly Cookie | High | Configurable | Production use |
| Memory only | High | Session only | High security needs |

### Authentication States

| State | isAuthenticated | isLoading | customer | Action |
|-------|----------------|-----------|----------|---------|
| Initial | false | true | null | Validating session |
| Authenticated | true | false | object | Show customer UI |
| Guest | false | false | null | Show login prompts |
| Error | false | false | null | Show error message |

### API Integration Points

| Operation | Endpoint | Method | Response |
|-----------|----------|--------|----------|
| Login | `/api/store/auth/login` | POST | tokens + customer |
| Logout | `/api/store/auth/logout` | POST | success message |
| Register | `/api/store/auth/register` | POST | tokens + customer |
| Refresh | `/api/store/auth/refresh` | POST | new access token |
| Profile | `/api/store/auth/profile` | GET | customer data |

### Guest User Handling

```
Guest User Flow
    │
    ├─→ Generate guest ID (uuid)
    │
    ├─→ Store in localStorage
    │
    ├─→ Associate cart with guest ID
    │
    ├─→ Allow checkout as guest
    │
    └─→ Offer account creation:
        ├─→ Transfer cart to account
        ├─→ Transfer order history
        └─→ Remove guest ID
```

### Protected Actions Strategy

| Action | Guest Allowed | Auth Required | Fallback |
|--------|---------------|---------------|----------|
| Browse Products | Yes | No | - |
| Add to Cart | Yes | No | - |
| Checkout | Yes (guest) | No | Guest checkout form |
| View Orders | No | Yes | Redirect to login |
| Save Address | No | Yes | Prompt to register |
| Save Wishlist | No | Yes | Prompt to register |

### Expected Outcome
- Functional customer authentication provider
- Login, logout, and registration operations
- Token management with refresh
- Guest user support
- Session validation and persistence
- API integration with error handling
- Proper security practices

### Verification Checklist
- [ ] `AuthProvider.tsx` created in providers directory
- [ ] Auth types defined in `types/store-auth.ts`
- [ ] Auth state management implemented
- [ ] Login operation working
- [ ] Logout operation working
- [ ] Register operation working
- [ ] Token storage and retrieval working
- [ ] Token refresh mechanism implemented
- [ ] Guest user support functional
- [ ] `useStoreAuth` hook created and exported
- [ ] API integration complete
- [ ] Protected actions handled correctly
- [ ] Proper TypeScript typing throughout

---

## Task 20: Create Store Head Component

### Overview
Create a StoreHead component that manages document head metadata for storefront pages. This component provides SEO-optimized meta tags, Open Graph tags for social sharing, structured data for search engines, and favicon management. It uses Next.js Metadata API for optimal SEO and social media integration.

### Dependencies
- Task 15: Create Store Layout Component
- Next.js Metadata API
- Understanding of SEO best practices

### Instructions

1. **Create head component file**
   - Create `StoreHead.tsx` in `components/storefront/layout/` directory
   - This component exports metadata configuration
   - Use Next.js 13+ Metadata API (not react-helmet)

2. **Define metadata props interface**
   - Create `StoreHeadProps` interface
   - Include `title` (string) for page title
   - Include `description` (string) for meta description
   - Include optional `image` for og:image
   - Include optional `type` ('website' | 'product' | 'article')
   - Include optional `keywords` (string[]) for SEO

3. **Create default metadata constant**
   - Define default title: "LankaCommerce Cloud | Sri Lankan E-Commerce Platform"
   - Define default description (2-3 sentences about store)
   - Define default Open Graph image
   - Define default site name and locale
   - Export as reusable constant

4. **Implement metadata generation function**
   - Create `generateStoreMetadata` function
   - Accept props matching StoreHeadProps interface
   - Merge props with default metadata
   - Return Metadata object for Next.js

5. **Configure Open Graph meta tags**
   - Set og:title (page title)
   - Set og:description (page description)
   - Set og:image (share image, min 1200x630px)
   - Set og:url (canonical page URL)
   - Set og:type (website, product, etc.)
   - Set og:site_name (store name)

6. **Configure Twitter Card meta tags**
   - Set twitter:card (summary_large_image)
   - Set twitter:title (same as og:title)
   - Set twitter:description (same as og:description)
   - Set twitter:image (same as og:image)
   - Set twitter:creator (optional @handle)

7. **Add structured data (JSON-LD)**
   - Create function to generate Organization schema
   - Create function to generate Product schema (for product pages)
   - Create function to generate BreadcrumbList schema
   - Include structured data in metadata
   - Validate with Google's Rich Results Test

8. **Configure favicon and app icons**
   - Define favicon.ico location
   - Define apple-touch-icon
   - Define various icon sizes for different devices
   - Set theme-color for browser chrome
   - Configure manifest.json reference

9. **Set viewport and mobile configuration**
   - Configure viewport meta tag (width, initial-scale)
   - Set mobile-web-app-capable if applicable
   - Configure format-detection for phone numbers

10. **Add robots and canonical URLs**
    - Configure robots meta tag (index, follow)
    - Set canonical URL for duplicate content prevention
    - Add alternate language tags if multilingual
    - Configure noindex for specific pages (e.g., cart)

11. **Create page-specific metadata helpers**
    - Create `productMetadata` helper for product pages
    - Create `categoryMetadata` helper for category pages
    - Create `pageMetadata` helper for static pages
    - Export all helpers for easy use in pages

12. **Document metadata best practices**
    - Add JSDoc comments with metadata guidelines
    - Include title length recommendations (50-60 chars)
    - Include description length recommendations (150-160 chars)
    - Provide image dimension requirements

### Default Metadata Structure

| Field | Value | Purpose |
|-------|-------|---------|
| title | Dynamic + "| LCC" | Browser tab, search results |
| description | 150-160 chars | Search result snippet |
| keywords | Relevant terms | Legacy SEO (minor impact) |
| og:image | 1200x630px | Social media shares |
| canonical | Current URL | Prevent duplicate content |

### Metadata Generation Function

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| title | string | Default title | Page title |
| description | string | Default desc | Meta description |
| image | string | Default image | Share image URL |
| type | string | 'website' | Open Graph type |
| keywords | string[] | [] | SEO keywords |
| noindex | boolean | false | Prevent indexing |

### Open Graph Tags

| Tag | Value | Purpose |
|-----|-------|---------|
| og:title | Page title | Social share title |
| og:description | Page description | Social share description |
| og:image | Image URL | Social share image |
| og:url | Page URL | Canonical URL |
| og:type | website/product | Content type |
| og:site_name | Store name | Brand identity |
| og:locale | en_US | Language/region |

### Twitter Card Configuration

| Tag | Value | Card Type |
|-----|-------|-----------|
| twitter:card | summary_large_image | Large image format |
| twitter:title | Page title | Tweet title |
| twitter:description | Description | Tweet description |
| twitter:image | Image URL | Tweet image |

### Structured Data (JSON-LD)

```
Organization Schema
├── @type: Organization
├── name: LankaCommerce Cloud
├── url: https://store.example.com
├── logo: Logo URL
├── sameAs: [Social media URLs]
└── contactPoint: Contact info

Product Schema (Product Pages)
├── @type: Product
├── name: Product name
├── image: Product images
├── description: Product description
├── sku: Product SKU
├── brand: Brand info
├── offers:
│   ├── price: Price
│   ├── priceCurrency: LKR
│   └── availability: In stock
└── aggregateRating: Reviews
```

### Page-Specific Metadata Helpers

| Helper | Usage | Special Fields |
|--------|-------|----------------|
| productMetadata | Product detail pages | price, availability, rating |
| categoryMetadata | Category listing pages | product count, filters |
| pageMetadata | Static content pages | article schema if blog |
| searchMetadata | Search results | noindex to prevent indexing |

### SEO Best Practices

| Element | Guideline | Reason |
|---------|-----------|--------|
| Title Length | 50-60 characters | Prevent truncation in SERPs |
| Description | 150-160 characters | Optimal snippet length |
| Image Size | 1200x630px minimum | Social media requirements |
| Unique Titles | Each page different | Better search ranking |
| Keywords | Natural, not stuffed | Modern SEO priorities |

### Expected Outcome
- Comprehensive metadata management component
- SEO-optimized meta tags for all pages
- Open Graph tags for social media sharing
- Twitter Card configuration
- Structured data (JSON-LD) for rich results
- Page-specific metadata helpers
- Favicon and app icon configuration

### Verification Checklist
- [ ] `StoreHead.tsx` created in layout directory
- [ ] Default metadata configured
- [ ] `generateStoreMetadata` function implemented
- [ ] Open Graph tags complete
- [ ] Twitter Card tags complete
- [ ] Structured data (JSON-LD) implemented
- [ ] Favicon configuration complete
- [ ] Page-specific metadata helpers created
- [ ] Metadata follows SEO best practices
- [ ] Title and description length guidelines documented

---

## Task 21: Create Store Font Setup

### Overview
Create font configuration for the storefront using Next.js font optimization. This setup defines and loads fonts for headings, body text, and special elements like prices. Using Next.js's built-in font optimization ensures fonts are self-hosted, optimized, and loaded efficiently with zero layout shift.

### Dependencies
- Task 15: Create Store Layout Component
- Next.js Font Optimization (next/font)
- Understanding of font loading strategies

### Instructions

1. **Choose store fonts**
   - Select primary font for body text (e.g., Inter, Open Sans)
   - Select heading font if different (optional, can use same)
   - Select monospace font for prices/codes (e.g., JetBrains Mono)
   - Consider brand guidelines and readability

2. **Create fonts configuration file**
   - Create `fonts.ts` in `app/(storefront)/` directory
   - Import font utilities from `next/font/google`
   - This centralizes all font definitions

3. **Configure primary font (body text)**
   - Import chosen font (e.g., Inter) from next/font/google
   - Configure font options:
     - subsets: ['latin'] (minimum, add others if needed)
     - weight: ['400', '500', '600', '700'] (regular to bold)
     - display: 'swap' (for FOUT prevention)
     - variable: '--font-body' (CSS variable name)
   - Export configured font instance

4. **Configure heading font (optional)**
   - If using different font for headings, import and configure
   - Use similar options as body font
   - Set variable: '--font-heading'
   - Export configured font instance
   - If same as body, skip and reuse body font

5. **Configure monospace font (prices/codes)**
   - Import monospace font (e.g., JetBrains Mono)
   - Configure with appropriate weights
   - Set variable: '--font-mono'
   - Export configured font instance
   - Use for prices, SKUs, codes

6. **Apply fonts to root layout**
   - Import font instances in `app/(storefront)/layout.tsx`
   - Add font className to `<html>` or `<body>` element
   - Multiple fonts: combine with template literals
   - Fonts now available via CSS variables

7. **Configure Tailwind for custom fonts**
   - Update `tailwind.config.js` (or create store-specific config)
   - Extend theme.fontFamily with CSS variables
   - Map: `sans: ['var(--font-body)']`
   - Map: `heading: ['var(--font-heading)']` if applicable
   - Map: `mono: ['var(--font-mono)']`

8. **Apply fonts in global styles**
   - Set default font on body: `font-sans`
   - Set heading font on h1-h6 elements
   - Set monospace on price/code elements
   - Create utility classes if needed

9. **Optimize font loading**
   - Ensure preload: true in font config (default)
   - Use font-display: swap for better perceived performance
   - Consider subsetting to reduce font file size
   - Test with Lighthouse for CLS (Cumulative Layout Shift)

10. **Handle font fallback stack**
    - Define fallback fonts in Tailwind config
    - Example: `sans: ['var(--font-body)', 'system-ui', 'sans-serif']`
    - Ensures text visible during font load
    - Maintains readability if font fails

### Font Configuration Structure

| Font Type | Usage | Example Font | Weights |
|-----------|-------|--------------|---------|
| Body | Paragraphs, UI text | Inter | 400, 500, 600, 700 |
| Heading | Titles, headings | Inter (same) | 600, 700, 800 |
| Monospace | Prices, codes, SKUs | JetBrains Mono | 400, 500 |

### Font Options Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| subsets | ['latin'] | Character sets to load |
| weight | ['400', '500', '600', '700'] | Font weights to include |
| display | 'swap' | Font loading strategy |
| variable | '--font-body' | CSS custom property name |
| preload | true | Preload font for performance |

### Font Loading Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| swap | Show fallback, swap when loaded | Best for web fonts |
| optional | Use font if cached, else fallback | Performance critical |
| block | Block rendering until font loads | Brand-critical fonts |
| fallback | Brief block, then swap | Compromise approach |

### CSS Variable Mapping

| CSS Variable | Tailwind Class | Usage |
|--------------|----------------|-------|
| --font-body | font-sans | Body text, UI |
| --font-heading | font-heading | Titles, headings |
| --font-mono | font-mono | Prices, codes |

### Font Application

```
Storefront Typography Hierarchy
├── Headings (h1-h6)
│   └── font-heading text-gray-900 dark:text-gray-100
├── Body Text
│   └── font-sans text-gray-700 dark:text-gray-300
├── Prices
│   └── font-mono text-gray-900 dark:text-gray-100
└── Labels/UI
    └── font-sans text-sm text-gray-600 dark:text-gray-400
```

### Tailwind Font Family Extension

```javascript
// tailwind.config.js (store specific)
fontFamily: {
  sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
  heading: ['var(--font-heading)', 'var(--font-body)', 'system-ui'],
  mono: ['var(--font-mono)', 'Courier New', 'monospace'],
}
```

### Font Fallback Stack

| Primary | Fallback 1 | Fallback 2 | Fallback 3 |
|---------|------------|------------|------------|
| var(--font-body) | system-ui | -apple-system | sans-serif |
| var(--font-mono) | Courier New | monospace | - |

### Performance Optimization

| Technique | Implementation | Benefit |
|-----------|----------------|---------|
| Self-hosting | next/font auto-hosts | No external requests |
| Subsetting | Configure subsets | Smaller file sizes |
| Preloading | preload: true | Faster font display |
| Font-display | display: 'swap' | Prevents invisible text |
| CSS Variables | --font-* | Flexible application |

### Expected Outcome
- Optimized font loading with Next.js
- Self-hosted fonts (no external CDN)
- Zero cumulative layout shift (CLS)
- Proper font fallback stack
- CSS variables for flexible usage
- Tailwind integration for easy application
- Fonts applied consistently across store

### Verification Checklist
- [ ] Fonts chosen for body, heading, and monospace
- [ ] `fonts.ts` created in app directory
- [ ] Fonts configured with next/font/google
- [ ] CSS variables defined for all fonts
- [ ] Fonts applied to root layout
- [ ] Tailwind config extended with font families
- [ ] Font fallback stack defined
- [ ] Global styles apply fonts correctly
- [ ] No layout shift (CLS) observed
- [ ] Lighthouse performance score acceptable

---

## Task 22: Create Store Global Styles

### Overview
Create global CSS styles specifically for the storefront. This includes base styles, CSS resets, utility classes, and store-specific design tokens. Global styles establish consistent spacing, colors, typography, transitions, and responsive behaviors across the entire storefront.

### Dependencies
- Task 21: Create Store Font Setup
- Task 17: Create Store Theme Provider
- Tailwind CSS configuration
- Understanding of CSS custom properties

### Instructions

1. **Create global styles file**
   - Create `store.css` in `frontend/styles/` directory
   - This file contains all store-specific global styles
   - Will be imported in storefront layout

2. **Import Tailwind directives**
   - Add `@tailwind base;` directive at top
   - Add `@tailwind components;` directive
   - Add `@tailwind utilities;` directive
   - Enables Tailwind's utility classes

3. **Define CSS custom properties (variables)**
   - Create `:root` selector for light theme variables
   - Create `[data-store-theme="dark"]` for dark theme variables
   - Define color variables (background, foreground, primary, accent)
   - Define spacing variables (common spacing values)
   - Define border radius variables
   - Define transition duration variables

4. **Create base layer styles**
   - Use `@layer base` directive
   - Set box-sizing: border-box on all elements
   - Set smooth scroll behavior on html element
   - Remove default margins on body
   - Set default text color and background
   - Apply font smoothing for better rendering

5. **Style scrollbar (optional)**
   - Customize scrollbar for webkit browsers
   - Define scrollbar width and thumb color
   - Match scrollbar to store theme
   - Ensure accessibility (contrast)

6. **Create component layer styles**
   - Use `@layer components` directive
   - Define reusable component classes
   - Create `.store-button` base class
   - Create `.store-card` base class
   - Create `.store-input` base class
   - Define hover and focus states

7. **Add focus ring utilities**
   - Create consistent focus ring styles
   - Use visible focus indicators for accessibility
   - Define focus ring colors matching theme
   - Apply to interactive elements

8. **Create utility layer styles**
   - Use `@layer utilities` directive
   - Add custom utility classes not in Tailwind
   - Create text gradient utilities
   - Create animation utilities
   - Create aspect ratio helpers

9. **Add responsive typography**
   - Define fluid typography scale
   - Use clamp() for responsive font sizes
   - Create heading size utilities (.text-store-h1, etc.)
   - Ensure readability on all screen sizes

10. **Style selection highlighting**
    - Customize ::selection pseudo-element
    - Use brand colors for text selection
    - Ensure proper contrast
    - Apply to both light and dark themes

11. **Add print styles (optional)**
    - Use @media print query
    - Hide unnecessary elements (header, footer)
    - Ensure content prints clearly
    - Optimize for black and white printing

12. **Import global styles in layout**
    - Import store.css in `app/(storefront)/layout.tsx`
    - Ensure it loads before any component styles
    - Verify styles apply across all pages
    - Test with hot module replacement

### CSS Custom Properties Structure

| Category | Variables | Example |
|----------|-----------|---------|
| Colors | --store-bg, --store-fg, --store-primary | #ffffff |
| Spacing | --store-space-sm, --store-space-md | 0.5rem, 1rem |
| Borders | --store-radius-sm, --store-radius-md | 0.25rem, 0.5rem |
| Transitions | --store-transition-fast, --store-transition-base | 150ms, 200ms |

### Theme Color Variables

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| --store-bg | #ffffff | #0a0a0a | Page background |
| --store-fg | #171717 | #fafafa | Text color |
| --store-primary | #0066cc | #3399ff | Primary brand |
| --store-accent | #ff6600 | #ff9933 | Accents, CTAs |
| --store-border | #e5e7eb | #374151 | Borders |
| --store-muted | #f9fafb | #171717 | Subtle backgrounds |

### Base Layer Styles

| Selector | Properties | Purpose |
|----------|------------|---------|
| * | box-sizing: border-box | Consistent box model |
| html | scroll-behavior: smooth | Smooth scrolling |
| body | margin: 0, background, color | Base styles |
| body | -webkit-font-smoothing | Font rendering |

### Component Layer Examples

```css
@layer components {
  .store-button {
    /* Base button styles */
    @apply px-4 py-2 rounded-md font-medium transition-colors;
    @apply bg-primary text-white hover:bg-primary-dark;
  }

  .store-card {
    /* Base card styles */
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md;
    @apply border border-gray-200 dark:border-gray-700;
  }

  .store-input {
    /* Base input styles */
    @apply w-full px-3 py-2 border rounded-md;
    @apply focus:outline-none focus:ring-2 focus:ring-primary;
  }
}
```

### Focus Ring Styles

| Element Type | Focus Style | Accessibility |
|--------------|-------------|---------------|
| Buttons | 2px ring, primary color | WCAG AA compliant |
| Links | 2px ring, offset 2px | Visible on all backgrounds |
| Inputs | 2px ring, primary color | High contrast |
| Custom | ring-2 ring-offset-2 | Consistent across site |

### Responsive Typography Scale

| Class | Mobile | Desktop | Usage |
|-------|--------|---------|-------|
| .text-store-h1 | clamp(2rem, 5vw, 3rem) | Large headings |
| .text-store-h2 | clamp(1.5rem, 4vw, 2.25rem) | Section headings |
| .text-store-h3 | clamp(1.25rem, 3vw, 1.75rem) | Subsection headings |
| .text-store-body | clamp(1rem, 2vw, 1.125rem) | Body text |

### Custom Utility Classes

| Utility | Purpose | Implementation |
|---------|---------|----------------|
| .text-gradient | Gradient text | background-clip: text |
| .animate-slide-up | Slide animation | transform + opacity |
| .aspect-product | Product image ratio | aspect-ratio: 3/4 |
| .scrollbar-hide | Hide scrollbar | overflow + scrollbar-width |

### Selection Highlighting

| Theme | Background | Text Color | Contrast |
|-------|------------|------------|----------|
| Light | var(--store-primary) | white | 4.5:1 |
| Dark | var(--store-accent) | black | 4.5:1 |

### Import Order

```
1. Tailwind Base
2. Tailwind Components
3. Tailwind Utilities
4. CSS Custom Properties
5. Base Layer Styles
6. Component Layer Styles
7. Utility Layer Styles
8. Media Queries
```

### Expected Outcome
- Comprehensive global styles for storefront
- CSS custom properties for theming
- Consistent base styles across all pages
- Reusable component classes
- Accessible focus indicators
- Responsive typography
- Theme-aware color system

### Verification Checklist
- [ ] `store.css` created in styles directory
- [ ] Tailwind directives included
- [ ] CSS custom properties defined for both themes
- [ ] Base layer styles implemented
- [ ] Component layer classes created
- [ ] Utility layer classes added
- [ ] Focus ring styles defined
- [ ] Responsive typography implemented
- [ ] Selection highlighting styled
- [ ] Global styles imported in layout
- [ ] Styles apply correctly in both themes
- [ ] No conflicts with Tailwind classes

---

## Summary

This document covered Tasks 15-22, establishing the foundational layout, provider infrastructure, and styling for the webstore. Key accomplishments include:

- **Store Layout Component**: Three-section structure with conditional rendering
- **Store Providers**: Centralized provider wrapper with proper nesting
- **Theme Provider**: Light/dark mode with system detection and persistence
- **Cart Provider**: Comprehensive cart management with backend sync
- **Store Auth Provider**: Customer authentication with guest support
- **Store Head Component**: SEO-optimized metadata and social sharing
- **Store Font Setup**: Optimized font loading with Next.js
- **Store Global Styles**: Consistent styling with CSS custom properties

The next document will cover Tasks 23-30, focusing on CSS variables, layout components, skeleton loaders, toast notifications, and verification.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-23-30_Variables-Components-Verify.md](02_Tasks-23-30_Variables-Components-Verify.md)

---

**Document Status:** ✅ Complete  
**Last Updated:** Phase-08, SubPhase-01, Group-B  
**Next Steps:** Proceed to Document 02 for CSS variables, components, and verification
