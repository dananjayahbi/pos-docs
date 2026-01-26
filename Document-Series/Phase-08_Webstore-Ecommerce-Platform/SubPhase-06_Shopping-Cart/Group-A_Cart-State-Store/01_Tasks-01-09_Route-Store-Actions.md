# Tasks 01-09: Route, Store Setup, and Initial Actions

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** A - Cart State & Store  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-10-18_Actions-Selectors-Verify.md](02_Tasks-10-18_Actions-Selectors-Verify.md)

---

## Document Overview

This document covers the creation of the cart route structure, Zustand store setup, TypeScript type definitions, and the initial cart action implementation. It establishes the foundational cart infrastructure including directory setup, page routes, loading states, store initialization, type definitions, and the add-to-cart functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Cart Directory | Low | 10 min |
| 02 | Create Cart Page Route | Low | 15 min |
| 03 | Create Cart Page Layout | Low | 20 min |
| 04 | Create Cart Loading State | Low | 15 min |
| 05 | Create Cart Store Directory | Low | 10 min |
| 06 | Create Cart Store | Medium | 35 min |
| 07 | Create CartItem Type | Low | 20 min |
| 08 | Create Cart State Type | Low | 15 min |
| 09 | Create Add to Cart Action | Medium | 30 min |

---

## Task 01: Create Cart Directory

### Overview
Create the cart directory within the storefront route group. This establishes the `/cart` route where customers can view and manage their shopping cart items. The directory follows Next.js App Router conventions and is placed within the `(storefront)` route group to share the storefront layout.

### Dependencies
- SubPhase-05 (Product Catalog & Listing) must be complete
- Next.js App Router structure is established
- Frontend project is initialized

### Instructions

1. **Navigate to storefront route group**
   - Go to `frontend/app/(storefront)/` directory
   - This route group contains all customer-facing pages
   - Verify the directory exists

2. **Create the cart directory**
   - Create new directory named `cart`
   - This creates the `/cart` route
   - Location: `frontend/app/(storefront)/cart/`

3. **Understand route structure**
   - URL path will be: `/cart`
   - Inherits layout from `(storefront)/layout.tsx`
   - Shares storefront header and footer

4. **Verify directory creation**
   - Confirm `frontend/app/(storefront)/cart/` exists
   - Ensure proper naming (lowercase)
   - Check directory permissions

### Route Group Context

| Feature | Description |
|---------|-------------|
| Route Group | (storefront) |
| URL Path | /cart |
| Layout | Inherits storefront layout |
| Purpose | Shopping cart management |

### Directory Structure
```
frontend/app/(storefront)/
├── products/            # Product pages
├── checkout/            # (Created in later SubPhase)
├── cart/                # Cart directory (Task 01)
│   ├── page.tsx         # (Created in Task 02)
│   ├── layout.tsx       # (Created in Task 03)
│   └── loading.tsx      # (Created in Task 04)
└── layout.tsx           # Storefront layout
```

### URL Mapping

| File Path | URL Path | Purpose |
|-----------|----------|---------|
| `app/(storefront)/cart/page.tsx` | `/cart` | Cart page |
| `app/(storefront)/cart/layout.tsx` | `/cart` | Cart layout wrapper |

### Expected Outcome
- Cart directory created in correct location
- Foundation for cart page implementation
- Proper route structure established

### Verification Checklist
- [ ] `frontend/app/(storefront)/cart/` directory exists
- [ ] Directory located within `(storefront)` route group
- [ ] Naming follows conventions (lowercase)

---

## Task 02: Create Cart Page Route

### Overview
Create the main cart page component that displays the shopping cart interface. This page shows cart items, quantities, prices, and provides actions to update or remove items. It serves as the central hub for cart management before customers proceed to checkout.

### Dependencies
- Task 01: Create Cart Directory

### Instructions

1. **Create page.tsx file**
   - Navigate to `frontend/app/(storefront)/cart/` directory
   - Create new file named `page.tsx`
   - This becomes the default route component

2. **Import required dependencies**
   - Import React and necessary hooks
   - Import cart store hook (from Task 06)
   - Import UI components for cart display
   - Import Link from Next.js for navigation

3. **Define page metadata**
   - Export metadata object for SEO
   - Set title: "Shopping Cart | LankaCommerce Cloud"
   - Set description for cart page
   - Configure Open Graph tags

4. **Create page component structure**
   - Define default export function `CartPage`
   - Set up component as async if needed
   - Return JSX structure for cart layout

5. **Implement cart display logic**
   - Access cart state from store
   - Check if cart is empty
   - Display empty cart message if no items
   - Render cart items if present

6. **Add cart sections**
   - Cart header with title and item count
   - Cart items list section
   - Cart summary section with totals
   - Checkout button and continue shopping link

7. **Implement empty cart state**
   - Display message when cart is empty
   - Show icon or illustration
   - Provide link to continue shopping
   - Suggest popular products (optional)

8. **Add responsive layout**
   - Two-column layout on desktop (items + summary)
   - Single column on mobile
   - Proper spacing and padding

### Page Component Structure

```
┌─────────────────────────────────────────┐
│  Shopping Cart (3 items)                │
│                                         │
│  ┌─────────────────┐  ┌──────────────┐ │
│  │                 │  │              │ │
│  │   Cart Items    │  │    Summary   │ │
│  │   List          │  │    Total     │ │
│  │   (Scrollable)  │  │    Checkout  │ │
│  │                 │  │              │ │
│  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────┘
```

### Page Sections

| Section | Purpose | Location |
|---------|---------|----------|
| Header | Cart title and count | Top |
| Items List | Display cart items | Left (desktop) |
| Summary | Total and checkout | Right (desktop) |
| Empty State | No items message | Center |

### Empty Cart Display

```
┌─────────────────────────────────┐
│          🛒                     │
│   Your cart is empty           │
│                                 │
│   [Continue Shopping]          │
└─────────────────────────────────┘
```

### Cart States

| State | Display | Action |
|-------|---------|--------|
| Empty | Empty message + link | Continue shopping |
| Has Items | Items list + summary | View/edit items |
| Loading | Loading skeleton | Wait for data |
| Error | Error message | Retry or refresh |

### Responsive Layout

```
Desktop (≥ 1024px)
├── Grid: 2 columns (70% / 30%)
├── Items: Left column
└── Summary: Right column (sticky)

Tablet (768px - 1023px)
├── Grid: 2 columns (65% / 35%)
├── Items: Left column
└── Summary: Right column

Mobile (< 768px)
├── Stack: Vertical
├── Items: Full width
└── Summary: Full width (below items)
```

### Page Metadata Configuration

| Property | Value |
|----------|-------|
| title | "Shopping Cart \| LankaCommerce Cloud" |
| description | "View and manage your shopping cart" |
| robots | "noindex, nofollow" |

### Expected Outcome
- Functional cart page route at `/cart`
- Empty cart state handled appropriately
- Cart items displayed when present
- Responsive layout for all devices
- Proper metadata for SEO

### Verification Checklist
- [ ] `frontend/app/(storefront)/cart/page.tsx` file created
- [ ] Page component exports correctly
- [ ] Metadata configured for SEO
- [ ] Empty cart state implemented
- [ ] Cart items display area defined
- [ ] Cart summary section included
- [ ] Responsive layout configured
- [ ] Links to continue shopping and checkout

---

## Task 03: Create Cart Page Layout

### Overview
Create a layout component specific to the cart page that wraps cart content with consistent styling and structure. This layout adds a progress indicator showing the customer's position in the shopping journey (Cart → Checkout → Payment) and provides a consistent container for cart-related pages.

### Dependencies
- Task 01: Create Cart Directory

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(storefront)/cart/` directory
   - Create new file named `layout.tsx`
   - This layout wraps the cart page and any sub-routes

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import UI components for progress indicator
   - Import Tailwind CSS utilities

3. **Define layout component**
   - Create default export function `CartLayout`
   - Accept `children` prop of type `ReactNode`
   - Return JSX structure with layout sections

4. **Create checkout progress indicator**
   - Show three steps: Cart, Checkout, Payment
   - Highlight current step (Cart)
   - Display as breadcrumb or step indicator
   - Position at top of cart page

5. **Implement main container**
   - Add container with max width
   - Apply proper padding for spacing
   - Ensure responsive behavior
   - Center content horizontally

6. **Add cart-specific styling**
   - Set background color if different from main layout
   - Add any cart-specific header or footer
   - Apply consistent spacing

7. **Render children content**
   - Place children in main content area
   - Ensure proper positioning within container
   - Allow children to fill available space

### Layout Component Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Page content to render |

### Layout Structure

```
┌─────────────────────────────────────────┐
│  Progress: Cart → Checkout → Payment   │
├─────────────────────────────────────────┤
│                                         │
│           {children}                    │
│        (Cart page content)              │
│                                         │
└─────────────────────────────────────────┘
```

### Checkout Progress Steps

| Step | Status | Icon | Description |
|------|--------|------|-------------|
| Cart | Active | 🛒 | Current step |
| Checkout | Inactive | 📋 | Next step |
| Payment | Inactive | 💳 | Final step |

### Progress Indicator Design

```
Cart (Active)  →  Checkout (Inactive)  →  Payment (Inactive)
    ●  ━━━━━━━━━━━  ○  ━━━━━━━━━━━  ○
```

### Progress Indicator Styling

| State | Color | Weight | Description |
|-------|-------|--------|-------------|
| Active | Blue (brand) | Bold | Current step |
| Inactive | Gray | Normal | Future steps |
| Completed | Green | Bold | Past steps |

### Container Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Max Width | `max-w-7xl` | Prevent excessive width |
| Padding | `px-4 md:px-6 lg:px-8` | Responsive spacing |
| Margin | `mx-auto` | Center horizontally |
| Min Height | `min-h-screen` | Full viewport |

### Responsive Behavior

```
Mobile (< 768px)
├── Progress: Simplified (icons only)
├── Padding: px-4
└── Font Size: Smaller

Desktop (≥ 768px)
├── Progress: Full text labels
├── Padding: px-6 lg:px-8
└── Font Size: Standard
```

### Expected Outcome
- Layout wrapper for cart pages
- Checkout progress indicator displayed
- Consistent container and spacing
- Responsive design across devices

### Verification Checklist
- [ ] `frontend/app/(storefront)/cart/layout.tsx` file created
- [ ] Layout component accepts children prop
- [ ] Progress indicator shows three steps
- [ ] Current step (Cart) highlighted
- [ ] Container has proper max-width and padding
- [ ] Layout is responsive
- [ ] Component exports correctly

---

## Task 04: Create Cart Loading State

### Overview
Create a loading skeleton component that displays while cart data is being fetched or updated. This provides visual feedback to users and improves perceived performance by showing a placeholder that mimics the cart's structure.

### Dependencies
- Task 02: Create Cart Page Route

### Instructions

1. **Create loading.tsx file**
   - Navigate to `frontend/app/(storefront)/cart/` directory
   - Create new file named `loading.tsx`
   - Next.js uses this file for loading states automatically

2. **Import skeleton components**
   - Import Skeleton component from UI library
   - Import any animation utilities
   - Import layout components

3. **Define loading component**
   - Create default export function `CartLoading`
   - Return JSX structure mimicking cart layout
   - No props required for loading component

4. **Create skeleton for cart items**
   - Show 3-4 placeholder item cards
   - Each card shows skeleton for image, title, price
   - Include skeleton for quantity controls
   - Add skeleton for remove button

5. **Create skeleton for cart summary**
   - Show placeholder for subtotal line
   - Show placeholder for discount line
   - Show placeholder for total line
   - Show skeleton for checkout button

6. **Match actual cart layout**
   - Use same grid/flex structure as cart page
   - Maintain same spacing and padding
   - Ensure visual consistency

7. **Add loading animation**
   - Apply pulse or shimmer animation
   - Use CSS animations or Tailwind utilities
   - Keep animation subtle and smooth

### Loading Component Structure

```
┌─────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓ (3 items)                    │
│                                         │
│  ┌─────────────────┐  ┌──────────────┐ │
│  │  ▓▓▓  ▓▓▓▓▓▓   │  │  ▓▓▓▓▓▓▓▓▓▓ │ │
│  │  ▓▓▓  ▓▓▓▓     │  │  ▓▓▓▓▓▓▓▓▓▓ │ │
│  │                 │  │              │ │
│  │  ▓▓▓  ▓▓▓▓▓▓   │  │  ▓▓▓▓▓▓▓▓▓▓ │ │
│  │  ▓▓▓  ▓▓▓▓     │  │              │ │
│  │                 │  │  ▓▓▓▓▓▓▓▓▓▓ │ │
│  │  ▓▓▓  ▓▓▓▓▓▓   │  │              │ │
│  │  ▓▓▓  ▓▓▓▓     │  └──────────────┘ │
│  └─────────────────┘                   │
└─────────────────────────────────────────┘
```

### Skeleton Elements

| Element | Skeleton Appearance | Animation |
|---------|---------------------|-----------|
| Product Image | Gray square | Pulse |
| Product Name | Gray bar (80% width) | Pulse |
| Price | Gray bar (30% width) | Pulse |
| Quantity Control | Gray circles | Pulse |
| Summary Lines | Gray bars (60% width) | Pulse |
| Checkout Button | Gray rectangle | Pulse |

### Cart Item Skeleton

```
┌────────────────────────────────┐
│  [IMG]  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│  [   ]  ▓▓▓▓▓▓▓▓              │
│  [   ]  ▓▓▓  [- 1 +]  ▓▓▓▓   │
└────────────────────────────────┘
```

### Summary Skeleton

```
┌──────────────────────┐
│  ▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓   │
│  ▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓   │
│  ──────────────────  │
│  ▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓   │
│                      │
│  [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]  │
└──────────────────────┘
```

### Animation Specifications

| Animation | Duration | Easing | Purpose |
|-----------|----------|--------|---------|
| Pulse | 2s | ease-in-out | Loading indicator |
| Shimmer | 1.5s | linear | Elegant effect |
| Fade In | 0.3s | ease-out | Smooth appearance |

### Skeleton Component Usage

| Component | Width | Height | Rounded |
|-----------|-------|--------|---------|
| Image | 80px | 80px | md |
| Title | 100% | 20px | sm |
| Price | 60px | 16px | sm |
| Button | 100% | 40px | md |

### Expected Outcome
- Loading skeleton that mimics cart layout
- Smooth animations for loading state
- Visual feedback during data fetching
- Improved perceived performance

### Verification Checklist
- [ ] `frontend/app/(storefront)/cart/loading.tsx` file created
- [ ] Skeleton structure matches cart layout
- [ ] Multiple item skeletons displayed (3-4)
- [ ] Summary section skeleton included
- [ ] Pulse or shimmer animation applied
- [ ] Same responsive layout as cart page
- [ ] Component exports correctly

---

## Task 05: Create Cart Store Directory

### Overview
Create the directory structure for the cart store within the stores directory. This organizes all storefront-related Zustand stores in a dedicated location, maintaining a clean separation between storefront and ERP dashboard state management.

### Dependencies
- Task 01: Create Cart Directory

### Instructions

1. **Navigate to stores directory**
   - Go to `frontend/stores/` directory
   - This is the root directory for all Zustand stores
   - Verify the directory exists

2. **Create storefront subdirectory**
   - Create new directory named `storefront`
   - This houses all storefront-specific stores
   - Location: `frontend/stores/storefront/`

3. **Verify subdirectory structure**
   - Confirm `frontend/stores/storefront/` exists
   - Check for other store directories (dashboard, etc.)
   - Ensure consistent naming conventions

4. **Plan for future stores**
   - Cart store (Task 06)
   - Wishlist store (future SubPhase)
   - Product filter store (future SubPhase)
   - User preferences store (future SubPhase)

### Store Directory Structure

```
frontend/stores/
├── dashboard/           # ERP dashboard stores
│   ├── userStore.ts
│   └── settingsStore.ts
├── storefront/          # Storefront stores (Task 05)
│   ├── cartStore.ts     # (Created in Task 06)
│   ├── wishlistStore.ts # (Future SubPhase)
│   └── filterStore.ts   # (Future SubPhase)
└── shared/              # Shared stores
    └── themeStore.ts
```

### Store Organization Strategy

| Directory | Purpose | Examples |
|-----------|---------|----------|
| dashboard/ | ERP admin stores | User, settings, notifications |
| storefront/ | Customer stores | Cart, wishlist, filters |
| shared/ | Common stores | Theme, language, auth |

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Directory | lowercase | storefront/ |
| File | camelCase + Store.ts | cartStore.ts |
| Hook | use + Name + Store | useCartStore |

### Expected Outcome
- Clean directory structure for stores
- Storefront stores separated from dashboard
- Foundation for cart store creation
- Organized state management structure

### Verification Checklist
- [ ] `frontend/stores/storefront/` directory exists
- [ ] Directory located within `frontend/stores/`
- [ ] Naming follows conventions
- [ ] Ready for cart store file creation

---

## Task 06: Create Cart Store

### Overview
Create the Zustand store for cart state management. This store handles all cart operations including adding items, removing items, updating quantities, and computing cart totals. It uses Zustand with persist middleware to maintain cart state across browser sessions and page refreshes.

### Dependencies
- Task 05: Create Cart Store Directory

### Instructions

1. **Create cartStore.ts file**
   - Navigate to `frontend/stores/storefront/` directory
   - Create new file named `cartStore.ts`
   - This file contains the entire cart store implementation

2. **Import Zustand dependencies**
   - Import `create` from 'zustand'
   - Import `persist` middleware from 'zustand/middleware'
   - Import `devtools` middleware for development
   - Import TypeScript types

3. **Import cart types**
   - Import CartItem type (from Task 07)
   - Import Cart state type (from Task 08)
   - Import any product types needed
   - Import utility functions

4. **Define store state interface**
   - Extend Cart state type
   - Add action methods to interface
   - Include computed selector methods
   - Define proper TypeScript types

5. **Create initial state**
   - Empty items array
   - No coupon applied
   - isLoading: false
   - error: null

6. **Implement store creation**
   - Use Zustand create function
   - Wrap with persist middleware for localStorage
   - Add devtools middleware for debugging
   - Configure persistence options

7. **Configure persist middleware**
   - Set storage name: 'cart-storage'
   - Define what to persist (items, coupon)
   - Exclude non-persistable state (isLoading, error)
   - Configure version for migration support

8. **Setup devtools middleware**
   - Enable only in development environment
   - Set store name: 'CartStore'
   - Configure trace for debugging
   - Add serialization options

9. **Prepare for action implementations**
   - Define placeholder action methods
   - Add TODO comments for each action
   - Set up structure for Tasks 09-12

10. **Add TypeScript strict typing**
    - Define proper return types
    - Use Immer for immutable updates (optional)
    - Ensure type safety throughout
    - Export store hook with proper types

### Store State Structure

```typescript
{
  // State
  items: CartItem[]           // Array of cart items
  coupon: Coupon | null       // Applied coupon
  isLoading: boolean          // Loading state
  error: string | null        // Error message
  
  // Actions (Task 09-12)
  addItem: (item) => void
  removeItem: (id) => void
  updateQuantity: (id, qty) => void
  clearCart: () => void
  applyCoupon: (code) => void
  removeCoupon: () => void
  
  // Selectors (Task 13-15)
  getTotal: () => number
  getItemCount: () => number
  getSubtotal: () => number
}
```

### Persist Middleware Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| name | 'cart-storage' | LocalStorage key |
| version | 1 | Migration support |
| partialize | (state) => {...} | Select persisted state |
| storage | createJSONStorage | Default localStorage |

### Persisted State

| Property | Persisted | Reason |
|----------|-----------|--------|
| items | ✓ | Must survive refresh |
| coupon | ✓ | Maintain discount |
| isLoading | ✗ | Reset on load |
| error | ✗ | Reset on load |

### DevTools Configuration

| Option | Value | Environment |
|--------|-------|-------------|
| enabled | true | Development only |
| name | 'CartStore' | DevTools label |
| trace | true | Action tracking |

### Store Creation Pattern

```
create<StoreInterface>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        items: [],
        
        // Actions
        addItem: (item) => set(...),
      }),
      {
        // Persist config
        name: 'cart-storage',
      }
    ),
    {
      // DevTools config
      name: 'CartStore',
    }
  )
)
```

### Initial State Values

| Property | Initial Value | Type |
|----------|---------------|------|
| items | [] | CartItem[] |
| coupon | null | Coupon \| null |
| isLoading | false | boolean |
| error | null | string \| null |

### Store Hook Export

| Export | Type | Usage |
|--------|------|-------|
| useCartStore | Hook | Access store state |
| useCartActions | Hook | Access actions only |
| useCartSelectors | Hook | Access selectors only |

### Expected Outcome
- Functional Zustand cart store
- Persist middleware configured
- DevTools enabled for development
- Type-safe store interface
- Ready for action implementations

### Verification Checklist
- [ ] `frontend/stores/storefront/cartStore.ts` file created
- [ ] Zustand create function used
- [ ] Persist middleware configured with correct name
- [ ] DevTools middleware added
- [ ] Initial state defined correctly
- [ ] TypeScript interfaces defined
- [ ] Store hook exports properly
- [ ] Placeholder methods for actions included

---

## Task 07: Create CartItem Type

### Overview
Define the CartItem TypeScript interface that represents a single item in the shopping cart. This type includes all necessary information about the product variant, quantity, pricing, and stock constraints needed for cart operations.

### Dependencies
- Task 06: Create Cart Store

### Instructions

1. **Create types directory structure**
   - Navigate to `frontend/types/` directory
   - Create `storefront` subdirectory if not exists
   - Location: `frontend/types/storefront/`

2. **Create cart.types.ts file**
   - Create new file in `frontend/types/storefront/`
   - File name: `cart.types.ts`
   - This file contains all cart-related types

3. **Define CartItem interface**
   - Export interface named `CartItem`
   - Include all required properties
   - Use proper TypeScript types
   - Add JSDoc comments for documentation

4. **Add core identification properties**
   - id: Unique cart item identifier (string)
   - productId: Reference to product (string)
   - variantId: Reference to variant (string)
   - Add documentation for each field

5. **Add product information properties**
   - name: Product name (string)
   - image: Product image URL (string)
   - slug: Product URL slug (string)
   - sku: Product SKU code (string, optional)

6. **Add pricing properties**
   - price: Unit price in LKR (number)
   - originalPrice: Before discount (number, optional)
   - discount: Discount percentage (number, optional)

7. **Add quantity properties**
   - quantity: Current quantity (number)
   - maxQuantity: Stock limit (number)
   - minQuantity: Minimum order (number, default 1)

8. **Add variant properties**
   - variant: Object containing size, color, etc.
   - Define nested VariantSelection interface
   - Include all variant attributes

9. **Add metadata properties**
   - addedAt: Timestamp (Date or string)
   - updatedAt: Last update timestamp (Date or string)
   - isAvailable: Stock status (boolean)
   - notes: Customer notes (string, optional)

### CartItem Interface Structure

```typescript
interface CartItem {
  // Identification
  id: string
  productId: string
  variantId: string
  
  // Product Info
  name: string
  image: string
  slug: string
  sku?: string
  
  // Pricing
  price: number          // In LKR
  originalPrice?: number
  discount?: number
  
  // Quantity
  quantity: number
  maxQuantity: number
  minQuantity: number
  
  // Variant
  variant: VariantSelection
  
  // Metadata
  addedAt: string
  updatedAt: string
  isAvailable: boolean
  notes?: string
}
```

### VariantSelection Interface

```typescript
interface VariantSelection {
  size?: string
  color?: string
  material?: string
  [key: string]: string | undefined
}
```

### Property Details

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique cart item ID |
| productId | string | Yes | Product reference |
| variantId | string | Yes | Variant reference |
| name | string | Yes | Product name |
| image | string | Yes | Image URL |
| price | number | Yes | Unit price (LKR) |
| quantity | number | Yes | Current quantity |
| maxQuantity | number | Yes | Stock limit |
| variant | object | Yes | Size, color, etc. |

### Pricing Calculations

| Calculation | Formula | Example |
|-------------|---------|---------|
| Line Total | price × quantity | ₨1,500 × 2 = ₨3,000 |
| Discount Amount | originalPrice - price | ₨2,000 - ₨1,500 = ₨500 |
| Total Savings | discount × quantity | ₨500 × 2 = ₨1,000 |

### Quantity Constraints

| Property | Purpose | Validation |
|----------|---------|------------|
| minQuantity | Minimum order | quantity ≥ minQuantity |
| maxQuantity | Stock limit | quantity ≤ maxQuantity |
| quantity | Current amount | Between min and max |

### Variant Properties

| Property | Type | Example | Required |
|----------|------|---------|----------|
| size | string | "M", "XL" | Optional |
| color | string | "Red", "Blue" | Optional |
| material | string | "Cotton" | Optional |
| custom | string | Any custom attribute | Optional |

### CartItem Example

```typescript
{
  id: "cart_item_123",
  productId: "prod_456",
  variantId: "var_789",
  name: "Men's Cotton T-Shirt",
  image: "/products/tshirt-red.jpg",
  slug: "mens-cotton-tshirt",
  sku: "TSH-M-RED-001",
  price: 1500,
  originalPrice: 2000,
  discount: 25,
  quantity: 2,
  maxQuantity: 10,
  minQuantity: 1,
  variant: {
    size: "M",
    color: "Red"
  },
  addedAt: "2026-01-26T10:30:00Z",
  updatedAt: "2026-01-26T11:45:00Z",
  isAvailable: true,
  notes: "Gift wrap requested"
}
```

### Type Exports

| Export | Type | Purpose |
|--------|------|---------|
| CartItem | interface | Single cart item |
| VariantSelection | interface | Variant attributes |
| CartItemInput | type | Adding items to cart |

### Expected Outcome
- Complete CartItem TypeScript interface
- VariantSelection interface for variant properties
- Proper documentation with JSDoc comments
- Type safety for cart operations

### Verification Checklist
- [ ] `frontend/types/storefront/cart.types.ts` file created
- [ ] CartItem interface exported
- [ ] All required properties defined
- [ ] Proper TypeScript types used
- [ ] VariantSelection interface defined
- [ ] JSDoc comments added
- [ ] Price properties use number type
- [ ] Quantity constraints included

---

## Task 08: Create Cart State Type

### Overview
Define the Cart state TypeScript interface that represents the complete cart state in the Zustand store. This type includes the items array, applied coupon, loading states, and error handling properties.

### Dependencies
- Task 07: Create CartItem Type

### Instructions

1. **Open cart.types.ts file**
   - Navigate to `frontend/types/storefront/cart.types.ts`
   - Continue adding types in the same file
   - Maintain consistent organization

2. **Define Coupon interface**
   - Export interface named `Coupon`
   - Include coupon properties
   - Add discount calculation fields

3. **Add coupon properties**
   - code: Coupon code (string)
   - type: 'percentage' | 'fixed' (union type)
   - value: Discount value (number)
   - minOrderAmount: Minimum cart value (number, optional)
   - maxDiscount: Maximum discount cap (number, optional)
   - expiresAt: Expiry date (string, optional)

4. **Define Cart state interface**
   - Export interface named `Cart`
   - Include all state properties
   - Use CartItem[] for items array
   - Use Coupon | null for coupon

5. **Add cart state properties**
   - items: Array of CartItem (CartItem[])
   - coupon: Applied coupon (Coupon | null)
   - isLoading: Loading state (boolean)
   - error: Error message (string | null)

6. **Add computed properties (optional)**
   - subtotal: Items total (computed from items)
   - discount: Discount amount (computed from coupon)
   - total: Final total (computed value)
   - itemCount: Total item count (computed)

7. **Add JSDoc documentation**
   - Document each property
   - Explain computed properties
   - Add usage examples

### Coupon Interface Structure

```typescript
interface Coupon {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  expiresAt?: string
  description?: string
}
```

### Cart State Interface Structure

```typescript
interface Cart {
  // Items
  items: CartItem[]
  
  // Coupon
  coupon: Coupon | null
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Optional Computed (can be selectors)
  // subtotal?: number
  // discount?: number
  // total?: number
  // itemCount?: number
}
```

### Coupon Types

| Type | Description | Example |
|------|-------------|---------|
| percentage | Discount percentage | 10% off |
| fixed | Fixed amount in LKR | ₨500 off |

### Coupon Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| code | string | Yes | Coupon code |
| type | union | Yes | percentage/fixed |
| value | number | Yes | Discount value |
| minOrderAmount | number | No | Minimum cart value |
| maxDiscount | number | No | Maximum discount |
| expiresAt | string | No | Expiry date |

### Cart State Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| items | CartItem[] | Yes | Cart items array |
| coupon | Coupon \| null | Yes | Applied coupon |
| isLoading | boolean | Yes | Loading state |
| error | string \| null | Yes | Error message |

### Coupon Discount Calculation

| Type | Formula | Example |
|------|---------|---------|
| Percentage | subtotal × (value / 100) | ₨10,000 × 10% = ₨1,000 |
| Fixed | value | ₨500 flat discount |
| With Max Cap | min(calculated, maxDiscount) | min(₨2,000, ₨1,000) = ₨1,000 |

### Coupon Example

```typescript
{
  code: "SUMMER25",
  type: "percentage",
  value: 25,
  minOrderAmount: 5000,
  maxDiscount: 2000,
  expiresAt: "2026-08-31T23:59:59Z",
  description: "25% off summer sale"
}
```

### Cart State Example

```typescript
{
  items: [
    {
      id: "cart_item_1",
      productId: "prod_123",
      // ... other CartItem properties
    },
    {
      id: "cart_item_2",
      productId: "prod_456",
      // ... other CartItem properties
    }
  ],
  coupon: {
    code: "SAVE10",
    type: "percentage",
    value: 10
  },
  isLoading: false,
  error: null
}
```

### Loading States

| State | isLoading | error | Description |
|-------|-----------|-------|-------------|
| Idle | false | null | Ready for actions |
| Loading | true | null | Processing action |
| Error | false | "message" | Action failed |
| Success | false | null | Action completed |

### Type Exports

| Export | Type | Purpose |
|--------|------|---------|
| Coupon | interface | Coupon object |
| Cart | interface | Cart state |
| CouponType | type | 'percentage' \| 'fixed' |

### Expected Outcome
- Complete Cart state TypeScript interface
- Coupon interface for discount management
- Proper documentation for all properties
- Type safety for cart state

### Verification Checklist
- [ ] Coupon interface defined and exported
- [ ] Cart interface defined and exported
- [ ] items property uses CartItem[] type
- [ ] coupon property uses Coupon | null type
- [ ] Loading and error states included
- [ ] JSDoc comments added
- [ ] Coupon type union defined
- [ ] All properties properly typed

---

## Task 09: Create Add to Cart Action

### Overview
Implement the addItem action in the cart store that adds products to the cart. This action handles checking for existing items with the same variant, updating quantities if the item exists, or adding new items to the cart array. It includes stock validation and proper state updates.

### Dependencies
- Task 06: Create Cart Store
- Task 07: Create CartItem Type
- Task 08: Create Cart State Type

### Instructions

1. **Open cartStore.ts file**
   - Navigate to `frontend/stores/storefront/cartStore.ts`
   - Locate the placeholder addItem method
   - Prepare to implement full logic

2. **Define action parameters**
   - Accept product data as input
   - Accept variant selection
   - Accept quantity (default: 1)
   - Define proper TypeScript types

3. **Create AddItemInput type**
   - Define input interface in cart.types.ts
   - Include required product properties
   - Include variant and quantity
   - Export the type

4. **Generate unique cart item ID**
   - Create ID using productId + variantId + timestamp
   - Ensure uniqueness for tracking
   - Use variant key generator (Task 16 can be done early)

5. **Check for existing item**
   - Search items array for matching product + variant
   - Use variant key for comparison
   - Determine if item already exists

6. **Handle existing item scenario**
   - If item exists, update quantity
   - Check against maxQuantity constraint
   - Show warning if quantity exceeds stock
   - Update updatedAt timestamp

7. **Handle new item scenario**
   - If item doesn't exist, create new CartItem object
   - Set all required properties
   - Set addedAt and updatedAt timestamps
   - Add to items array

8. **Validate stock constraints**
   - Check quantity against maxQuantity
   - Prevent adding more than available stock
   - Set error state if validation fails
   - Return early if invalid

9. **Update store state**
   - Use Zustand set function
   - Update items array immutably
   - Clear any existing errors
   - Maintain other state properties

10. **Add success feedback (optional)**
    - Consider toast notification
    - Log to console in development
    - Track analytics event
    - Return success indicator

### Action Signature

```typescript
addItem: (input: AddItemInput) => void
```

### AddItemInput Interface

```typescript
interface AddItemInput {
  productId: string
  variantId: string
  name: string
  image: string
  slug: string
  price: number
  originalPrice?: number
  variant: VariantSelection
  maxQuantity: number
  quantity?: number
  sku?: string
}
```

### Action Logic Flow

```
1. Receive input with product data
   │
   ├─→ 2. Generate variant key
   │
   ├─→ 3. Check if item exists
   │      │
   │      ├─→ EXISTS
   │      │   │
   │      │   ├─→ 4a. Calculate new quantity
   │      │   │
   │      │   ├─→ 5a. Validate against maxQuantity
   │      │   │
   │      │   └─→ 6a. Update existing item quantity
   │      │
   │      └─→ DOESN'T EXIST
   │          │
   │          ├─→ 4b. Create new CartItem object
   │          │
   │          ├─→ 5b. Validate quantity
   │          │
   │          └─→ 6b. Add to items array
   │
   └─→ 7. Update store state
```

### Existing Item Logic

| Scenario | Action | Validation |
|----------|--------|------------|
| Same variant | Increase quantity | Check max limit |
| Different variant | Add as new item | Check max limit |
| Max stock reached | Show error | Prevent update |

### Quantity Validation

```typescript
const newQuantity = existingQuantity + inputQuantity
if (newQuantity > maxQuantity) {
  // Set error state
  // Don't update quantity
  return
}
```

### State Update Pattern

```typescript
set((state) => ({
  items: existingItem
    ? state.items.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: newQuantity, updatedAt: now }
          : item
      )
    : [...state.items, newCartItem],
  error: null
}))
```

### CartItem Creation

```typescript
const newCartItem: CartItem = {
  id: generateCartItemId(productId, variantId),
  productId,
  variantId,
  name,
  image,
  slug,
  sku,
  price,
  originalPrice,
  discount: calculateDiscount(originalPrice, price),
  quantity: quantity || 1,
  maxQuantity,
  minQuantity: 1,
  variant,
  addedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isAvailable: true
}
```

### Variant Key Generation

| Component | Example | Format |
|-----------|---------|--------|
| Product ID | "prod_123" | String |
| Size | "M" | String |
| Color | "Red" | String |
| Generated Key | "prod_123-M-Red" | Combined |

### Error Scenarios

| Error | Condition | Message |
|-------|-----------|---------|
| Stock exceeded | quantity > maxQuantity | "Not enough stock available" |
| Invalid quantity | quantity < 1 | "Quantity must be at least 1" |
| Product unavailable | isAvailable = false | "Product is currently unavailable" |

### Success Indicators

| Indicator | Type | Description |
|-----------|------|-------------|
| State update | items array updated | Item added/updated |
| No error | error = null | Validation passed |
| Toast | UI notification | Success message |

### Expected Outcome
- Functional add to cart action
- Existing item quantity updates correctly
- New items added to cart properly
- Stock validation prevents over-adding
- Type-safe implementation

### Verification Checklist
- [ ] addItem action implemented in cartStore.ts
- [ ] AddItemInput type defined in cart.types.ts
- [ ] Variant key generation logic added
- [ ] Existing item check implemented
- [ ] Quantity validation against maxQuantity
- [ ] New CartItem object created correctly
- [ ] State updated immutably
- [ ] Error handling for stock limits
- [ ] Timestamps set for addedAt and updatedAt
- [ ] TypeScript types satisfied

---

## Summary

This document established the foundational cart infrastructure including route structure, Zustand store setup, TypeScript type definitions, and the add-to-cart action implementation. These elements provide the core functionality needed for cart state management.

### Completed Tasks
1. ✓ Created cart directory within storefront route group
2. ✓ Created cart page route with empty state handling
3. ✓ Created cart layout with checkout progress indicator
4. ✓ Created cart loading skeleton for better UX
5. ✓ Created cart store directory for organization
6. ✓ Created Zustand cart store with persist middleware
7. ✓ Created CartItem TypeScript interface
8. ✓ Created Cart state and Coupon interfaces
9. ✓ Implemented add to cart action with validation

### Next Steps
Proceed to [02_Tasks-10-18_Actions-Selectors-Verify.md](02_Tasks-10-18_Actions-Selectors-Verify.md) to implement remaining cart actions (remove, update, clear), create computed selectors for totals, implement variant key generator, create cart context provider, and verify all cart store functionality.
