# Tasks 01-07: Route Group and Directory Structure

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** A - Route Group & Directory Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Pages-Components-Verify.md](02_Tasks-08-14_Pages-Components-Verify.md)

---

## Document Overview

This document covers the creation of the storefront route group and core directory structure for the webstore. It establishes the foundational routing architecture separate from the ERP dashboard, including the (storefront) route group setup, store root layout, homepage route, and all primary customer-facing page directories (products, cart, checkout, account).

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Storefront Route Group | Low | 15 min |
| 02 | Create Store Root Layout | Medium | 30 min |
| 03 | Create Store Homepage Route | Low | 20 min |
| 04 | Create Products Directory | Low | 15 min |
| 05 | Create Cart Directory | Low | 15 min |
| 06 | Create Checkout Directory | Low | 15 min |
| 07 | Create Account Directory | Low | 15 min |

---

## Task 01: Create Storefront Route Group

### Overview
Create the `(storefront)` route group in the Next.js App Router to house all customer-facing e-commerce pages. The parentheses notation creates a folder that doesn't add to the URL path but allows for a completely separate layout system from the ERP dashboard. This architectural decision ensures clean separation between admin/ERP functionality and customer-facing storefront pages.

### Dependencies
- Phase-07 (Frontend Infrastructure & ERP Dashboard) must be complete
- Next.js App Router structure is established
- Frontend project is initialized with monorepo structure

### Instructions

1. **Navigate to the app directory**
   - Go to `frontend/app/` directory
   - This is the root of the Next.js App Router structure
   - Verify the (dashboard) route group exists from Phase-07

2. **Create the (storefront) route group folder**
   - Create a new directory named `(storefront)` (including parentheses)
   - The parentheses indicate this is a route group
   - Files inside will not add `/storefront` to URLs

3. **Understand storefront vs dashboard separation**
   - `(storefront)` contains customer-facing e-commerce pages
   - `(dashboard)` contains admin/ERP functionality
   - Both route groups exist under the same root layout
   - Completely independent layouts and styling

4. **Verify route group creation**
   - Confirm `frontend/app/(storefront)/` directory exists
   - Ensure proper naming with parentheses
   - Check directory is at same level as `(dashboard)/`

### Route Group Architecture

| Route Group | URL Path | Purpose | Users |
|-------------|----------|---------|-------|
| (dashboard) | `/` (admin routes) | ERP & Admin | Internal staff |
| (storefront) | `/` (public routes) | E-commerce | Customers |

### Route Group Behavior

| Feature | Benefit |
|---------|---------|
| Separate Layouts | Storefront has customer-facing design, dashboard has admin UI |
| Independent Styling | Different themes, colors, components |
| Clean URLs | No `/storefront` prefix in customer URLs |
| Organization | Clear separation of concerns |
| Security | Easier to implement role-based routing |

### Directory Structure Context
```
frontend/app/
├── (dashboard)/         # ERP Admin (Phase-07)
│   ├── layout.tsx       # Admin layout
│   ├── inventory/
│   ├── pos/
│   └── ...
├── (storefront)/        # Customer Store (Phase-08) ← NEW
│   └── layout.tsx       # (Created in Task 02)
└── layout.tsx           # Root layout (shared)
```

### URL Mapping Explanation

| File Path | URL Path | Page Type |
|-----------|----------|-----------|
| `app/(storefront)/page.tsx` | `/` | Store homepage |
| `app/(storefront)/products/page.tsx` | `/products` | Product listing |
| `app/(storefront)/cart/page.tsx` | `/cart` | Shopping cart |
| `app/(dashboard)/inventory/page.tsx` | `/inventory` | Admin inventory |

### Expected Outcome
- Route group folder created with proper naming convention
- Foundation for separate storefront layout system
- Clear architectural separation from dashboard
- Ready for customer-facing e-commerce pages

### Verification Checklist
- [ ] `frontend/app/(storefront)/` directory exists
- [ ] Directory name includes parentheses
- [ ] Located directly under `app/` directory
- [ ] At same hierarchy level as `(dashboard)/`

---

## Task 02: Create Store Root Layout

### Overview
Create the layout component for the storefront route group. This layout provides the complete customer-facing structure including navigation header, main content area, and footer. Unlike the dashboard layout, the storefront layout emphasizes product discovery, cart access, and customer account functionality with a modern e-commerce design.

### Dependencies
- Task 01: Create Storefront Route Group

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new file named `layout.tsx`
   - This layout wraps all pages in the (storefront) route group

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import future components (StoreHeader, StoreFooter)
   - Import any required context providers
   - Import Tailwind CSS utilities if needed

3. **Define layout metadata**
   - Export metadata object with default store metadata
   - Set title template: "%s | LankaCommerce Store"
   - Configure default description for SEO
   - Add OpenGraph and Twitter card metadata

4. **Create layout component structure**
   - Define default export function `StorefrontLayout`
   - Accept `children` prop of type `ReactNode`
   - Return JSX structure with three main sections

5. **Implement three-section layout**
   - Top section: Store header with navigation
   - Main section: Page content (children)
   - Bottom section: Store footer with links

6. **Add store-specific wrapper elements**
   - Container for responsive width control
   - Main content wrapper with proper spacing
   - Background color and styling for storefront theme

7. **Plan for future integrations**
   - Cart context provider (Phase-08, later SubPhases)
   - Authentication context for customer accounts
   - Analytics tracking components
   - Toast notification system

### Layout Structure

```
┌────────────────────────────────────────────┐
│         StoreHeader                        │
│  [Logo] [Nav] [Search] [Cart] [Account]   │
├────────────────────────────────────────────┤
│                                            │
│                                            │
│            {children}                      │
│         (Store Pages)                      │
│                                            │
│                                            │
├────────────────────────────────────────────┤
│         StoreFooter                        │
│  [Links] [Categories] [Info] [Social]     │
└────────────────────────────────────────────┘
```

### Layout Component Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Store page content to render |

### Layout Sections

| Section | Component | Position | Purpose |
|---------|-----------|----------|---------|
| Header | StoreHeader | Top | Navigation, search, cart, account |
| Main | children | Center | Page-specific content |
| Footer | StoreFooter | Bottom | Links, info, social, legal |

### Metadata Configuration

| Field | Value | Purpose |
|-------|-------|---------|
| title.template | "%s \| LankaCommerce Store" | Consistent page titles |
| title.default | "LankaCommerce Store" | Fallback title |
| description | Store description | SEO optimization |
| keywords | Product-related keywords | Search visibility |
| openGraph | Store metadata | Social sharing |

### Layout Styling Approach

| Element | Styling | Purpose |
|---------|---------|---------|
| Container | `min-h-screen flex flex-col` | Full height, vertical layout |
| Header | `sticky top-0 z-50` | Fixed navigation on scroll |
| Main | `flex-grow container mx-auto px-4` | Centered, responsive content |
| Footer | `mt-auto` | Push to bottom |
| Background | `bg-gray-50` | Subtle background color |

### Responsive Considerations

```
Mobile (< 768px)
├── Hamburger menu for navigation
├── Simplified header layout
├── Full-width content
└── Stacked footer sections

Tablet (768px - 1024px)
├── Expanded navigation
├── Partial header elements
├── Constrained content width
└── Multi-column footer

Desktop (> 1024px)
├── Full navigation bar
├── All header elements visible
├── Max-width container (1280px)
└── Multi-column footer layout
```

### Future Context Providers

| Provider | Purpose | SubPhase |
|----------|---------|----------|
| CartProvider | Shopping cart state | SubPhase-03 |
| AuthProvider | Customer authentication | SubPhase-04 |
| WishlistProvider | Product wishlist | SubPhase-05 |
| SearchProvider | Search functionality | SubPhase-06 |

### Expected Outcome
- Functional layout component for all storefront pages
- Three-section structure (header, content, footer)
- Proper TypeScript typing for props
- SEO-friendly metadata configuration
- Ready to receive page content as children

### Verification Checklist
- [ ] `frontend/app/(storefront)/layout.tsx` file created
- [ ] Layout component exports properly as default
- [ ] Accepts children prop correctly
- [ ] Three sections defined (header, main, footer)
- [ ] Metadata object exported for SEO
- [ ] Responsive container styling applied
- [ ] Layout prepared for future context providers
- [ ] TypeScript types defined correctly

---

## Task 03: Create Store Homepage Route

### Overview
Create the storefront homepage route that serves as the landing page for customer visitors. This page is the primary entry point to the e-commerce experience, featuring hero sections, featured products, category showcases, promotional banners, and calls-to-action that drive customer engagement and product discovery.

### Dependencies
- Task 01: Create Storefront Route Group
- Task 02: Create Store Root Layout

### Instructions

1. **Create homepage page.tsx file**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new file named `page.tsx`
   - This is the root page for the storefront (URL: `/`)

2. **Import required dependencies**
   - Import React and Next.js types
   - Import placeholder or future homepage components
   - Import any required client/server component markers

3. **Define page metadata**
   - Export metadata object specific to homepage
   - Set title: "Home | LankaCommerce Store" (or just "LankaCommerce Store")
   - Set compelling description for SEO
   - Include keywords relevant to products

4. **Create page component structure**
   - Define default export async function `HomePage`
   - Return JSX structure for homepage layout
   - Plan sections for future implementation

5. **Plan homepage sections**
   - Hero banner section (large promotional area)
   - Featured products section
   - Category showcase grid
   - Special offers/promotions section
   - Newsletter signup section
   - Trust indicators (shipping, returns, support)

6. **Add placeholder content**
   - Create basic structural elements for each section
   - Add descriptive text indicating future implementations
   - Use semantic HTML elements (section, article, etc.)

7. **Implement responsive structure**
   - Grid layouts for product/category displays
   - Responsive breakpoints for mobile/tablet/desktop
   - Flexible container widths

8. **Consider SEO optimization**
   - Proper heading hierarchy (h1, h2, h3)
   - Semantic HTML for better crawling
   - Structured data preparation (future)

### Homepage Route Context

| Aspect | Details |
|--------|---------|
| URL | `/` (root of storefront) |
| Purpose | Primary landing page for customers |
| Layout | Uses StorefrontLayout from Task 02 |
| Type | Server Component (default) |

### Planned Homepage Sections

| Section | Purpose | Priority |
|---------|---------|----------|
| Hero Banner | Highlight main promotion/brand | High |
| Featured Products | Showcase trending/new items | High |
| Category Grid | Browse by product category | High |
| Special Offers | Limited-time promotions | Medium |
| Newsletter | Email capture for marketing | Medium |
| Trust Badges | Shipping, returns, support info | Low |

### Homepage Structure

```
┌────────────────────────────────────────┐
│         Hero Banner                    │
│  [Large promotional image + CTA]       │
├────────────────────────────────────────┤
│      Featured Products                 │
│  [Product 1] [Product 2] [Product 3]   │
├────────────────────────────────────────┤
│      Shop by Category                  │
│  [Cat 1] [Cat 2] [Cat 3] [Cat 4]      │
├────────────────────────────────────────┤
│      Special Offers                    │
│  [Promo Banner] [Discount Info]        │
├────────────────────────────────────────┤
│      Newsletter Signup                 │
│  [Email Input] [Subscribe Button]      │
└────────────────────────────────────────┘
```

### Page Component Pattern

| Pattern | Usage |
|---------|-------|
| Server Component | Default for homepage (data fetching) |
| Client Component | Only for interactive elements |
| Async/Await | Fetch data at component level |
| Suspense | Wrap slow-loading sections |

### SEO Metadata Structure

| Field | Example Value |
|-------|---------------|
| title | "LankaCommerce Store - Sri Lanka's Premier POS & E-commerce" |
| description | "Shop quality products with seamless checkout. Free delivery across Sri Lanka on orders over Rs. 5000." |
| keywords | "sri lanka, online shopping, e-commerce, pos" |
| openGraph.title | "LankaCommerce Store" |
| openGraph.description | "Shop quality products online" |

### Responsive Grid Examples

```
Mobile (< 640px)
└── Single column
    ├── Hero: Full width
    ├── Products: 1 per row
    └── Categories: 2 per row

Tablet (640px - 1024px)
└── Multi-column
    ├── Hero: Full width
    ├── Products: 2-3 per row
    └── Categories: 3-4 per row

Desktop (> 1024px)
└── Grid layout
    ├── Hero: Full width
    ├── Products: 4 per row
    └── Categories: 4-6 per row
```

### Expected Outcome
- Functional homepage route at root URL (`/`)
- Structured sections for future content
- SEO-optimized metadata configuration
- Responsive layout structure
- Ready for component integration in later tasks

### Verification Checklist
- [ ] `frontend/app/(storefront)/page.tsx` file created
- [ ] Page component exports as default function
- [ ] Metadata object exported with SEO content
- [ ] Sections planned and structured
- [ ] Responsive grid structure implemented
- [ ] Semantic HTML elements used
- [ ] TypeScript types defined correctly
- [ ] Page accessible at root URL (`/`)

---

## Task 04: Create Products Directory

### Overview
Create the products directory structure to house all product-related routes including product listing pages, individual product detail pages, category filtering, and product search results. This directory forms the core of the product discovery experience.

### Dependencies
- Task 01: Create Storefront Route Group

### Instructions

1. **Create products directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `products`
   - This directory will house product-related routes

2. **Understand products routing structure**
   - `/products` → Product listing page
   - `/products/[slug]` → Individual product detail page
   - `/products/category/[category]` → Category filtering
   - Future: `/products/search?q=...` → Search results

3. **Plan directory structure**
   - `page.tsx` → Product listing page (task for Document 02)
   - `[slug]/` → Dynamic route for product details
   - `category/` → Category-based filtering
   - `loading.tsx` → Loading state (task for Document 02)

4. **Create placeholder subdirectories**
   - Create `[slug]/` directory for dynamic product pages
   - Create `category/` directory for category pages
   - Leave page creation for Document 02

5. **Consider future requirements**
   - Product filtering (price, rating, availability)
   - Sorting options (newest, price, popularity)
   - Pagination or infinite scroll
   - Product comparison features

6. **Document routing patterns**
   - Understand Next.js dynamic routes with [slug]
   - Plan for category hierarchy
   - Consider breadcrumb navigation

### Products Directory Structure

```
frontend/app/(storefront)/products/
├── page.tsx                    # Product listing (Doc 02)
├── loading.tsx                 # Loading state (Doc 02)
├── [slug]/
│   ├── page.tsx               # Product detail page
│   └── loading.tsx            # Detail loading state
└── category/
    ├── [category]/
    │   ├── page.tsx          # Category filtered products
    │   └── loading.tsx       # Category loading state
    └── page.tsx              # All categories list
```

### Product Routes Mapping

| Route | URL Pattern | Purpose |
|-------|-------------|---------|
| Listing | `/products` | All products with filtering |
| Detail | `/products/laptop-dell-xps-15` | Single product page |
| Category | `/products/category/electronics` | Category-specific products |
| Subcategory | `/products/category/electronics/laptops` | Nested category |

### URL Slug Patterns

| Pattern Type | Example | Implementation |
|--------------|---------|----------------|
| Product Slug | `laptop-dell-xps-15` | Kebab-case product name + ID |
| Category Slug | `electronics` | Kebab-case category name |
| Brand Slug | `brand/dell` | Nested brand filtering |

### Dynamic Route Behavior

| Route | File | URL Example |
|-------|------|-------------|
| Product Detail | `[slug]/page.tsx` | `/products/wireless-mouse-logitech` |
| Category Filter | `category/[category]/page.tsx` | `/products/category/accessories` |

### Future Filtering Options

| Filter Type | Example | Implementation |
|-------------|---------|----------------|
| Price Range | `?min=1000&max=5000` | Query parameters |
| Brand | `?brand=dell,hp` | Multi-select filter |
| Rating | `?rating=4` | Minimum rating filter |
| Availability | `?inStock=true` | Stock status filter |
| Sort | `?sort=price_asc` | Sort order |

### Product Page Types

| Page Type | Purpose | Data Source |
|-----------|---------|-------------|
| Listing | Display multiple products | Database query |
| Detail | Show single product | Product ID lookup |
| Category | Filter by category | Category ID filter |
| Search | Text-based search | Search index |

### Expected Outcome
- Products directory structure created
- Subdirectories for dynamic routes prepared
- Clear routing hierarchy established
- Foundation for product pages in Document 02

### Verification Checklist
- [ ] `frontend/app/(storefront)/products/` directory exists
- [ ] `[slug]/` subdirectory created for product details
- [ ] `category/` subdirectory created for category pages
- [ ] Directory structure matches planned hierarchy
- [ ] Ready for page component creation in Document 02

---

## Task 05: Create Cart Directory

### Overview
Create the cart directory structure to house shopping cart functionality including the main cart page, cart items display, quantity adjustments, and proceed-to-checkout actions. The cart is a critical component of the e-commerce flow where customers review their selections before purchase.

### Dependencies
- Task 01: Create Storefront Route Group

### Instructions

1. **Create cart directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `cart`
   - This directory will house cart-related functionality

2. **Understand cart routing structure**
   - `/cart` → Main shopping cart page
   - Future: `/cart/empty` → Empty cart state (optional)
   - Cart actions handled through page interactions

3. **Plan cart page structure**
   - `page.tsx` → Main cart page (task for Document 02)
   - `loading.tsx` → Cart loading state (task for Document 02)
   - Future: Cart components in storefront components directory

4. **Consider cart functionality**
   - Display cart items with images and details
   - Quantity adjustment controls
   - Remove item functionality
   - Subtotal and total calculations
   - Shipping cost estimation
   - Discount code application
   - Proceed to checkout button

5. **Plan cart state management**
   - Client-side cart context (CartProvider)
   - Persistent cart storage (localStorage/database)
   - Guest cart vs authenticated user cart
   - Cart synchronization between sessions

6. **Consider empty cart state**
   - Display when cart has no items
   - Call-to-action to continue shopping
   - Suggested products or categories

7. **Plan responsive design**
   - Mobile: Stacked layout for cart items
   - Tablet: Two-column layout (items + summary)
   - Desktop: Optimal spacing and readability

### Cart Directory Structure

```
frontend/app/(storefront)/cart/
├── page.tsx           # Main cart page (Doc 02)
└── loading.tsx        # Cart loading state (Doc 02)
```

### Cart Route Mapping

| Route | URL | Purpose |
|-------|-----|---------|
| Cart Page | `/cart` | Display shopping cart items |

### Cart Page Sections

| Section | Purpose | Priority |
|---------|---------|----------|
| Cart Items | Display added products | High |
| Quantity Controls | Adjust item quantities | High |
| Remove Items | Delete from cart | High |
| Price Summary | Subtotal, tax, total | High |
| Discount Code | Apply promo codes | Medium |
| Shipping Estimate | Calculate shipping | Medium |
| Checkout Button | Proceed to checkout | High |

### Cart Item Display

```
┌──────────────────────────────────────┐
│  [Image] Product Name                │
│          Size: M, Color: Blue        │
│          Price: Rs. 2,500            │
│          Qty: [−] 2 [+]  [Remove]    │
├──────────────────────────────────────┤
│  [Image] Another Product             │
│          ...                         │
└──────────────────────────────────────┘
```

### Cart Summary Layout

```
┌──────────────────────────────────────┐
│  Subtotal:           Rs. 12,500      │
│  Shipping:           Rs. 500         │
│  Tax (15%):          Rs. 1,875       │
│  Discount (SAVE10):  -Rs. 1,250      │
│  ────────────────────────────────    │
│  Total:              Rs. 13,625      │
│                                      │
│  [Proceed to Checkout]               │
└──────────────────────────────────────┘
```

### Cart State Management

| State | Storage | Scope |
|-------|---------|-------|
| Guest Cart | localStorage | Browser-specific |
| User Cart | Database | Cross-device sync |
| Cart Context | React Context | Runtime state |
| Cart Items | Array of objects | Product details |

### Cart Data Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Cart item unique ID |
| productId | string | Reference to product |
| quantity | number | Item quantity |
| variant | object | Size, color, etc. |
| price | number | Current price |

### Empty Cart State

| Element | Content |
|---------|---------|
| Icon | Shopping cart icon |
| Message | "Your cart is empty" |
| CTA | "Continue Shopping" button |
| Suggestions | Featured products or categories |

### Expected Outcome
- Cart directory structure created
- Foundation for cart page and components
- Clear cart functionality planned
- Ready for page implementation in Document 02

### Verification Checklist
- [ ] `frontend/app/(storefront)/cart/` directory exists
- [ ] Directory structure matches planned hierarchy
- [ ] Cart functionality requirements documented
- [ ] Ready for page component creation in Document 02

---

## Task 06: Create Checkout Directory

### Overview
Create the checkout directory structure to house the multi-step checkout process including customer information, shipping address, payment method selection, and order confirmation. The checkout flow is the most critical conversion point in the e-commerce experience.

### Dependencies
- Task 01: Create Storefront Route Group

### Instructions

1. **Create checkout directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `checkout`
   - This directory will house checkout flow pages

2. **Understand checkout routing structure**
   - `/checkout` → Main checkout page or step 1
   - `/checkout/shipping` → Shipping information step
   - `/checkout/payment` → Payment method step
   - `/checkout/review` → Order review step
   - `/checkout/success` → Order confirmation page

3. **Plan multi-step checkout structure**
   - `page.tsx` → Main checkout page (task for Document 02)
   - `loading.tsx` → Checkout loading state (task for Document 02)
   - `shipping/` → Shipping information step
   - `payment/` → Payment method step
   - `review/` → Order review step
   - `success/` → Confirmation page

4. **Create checkout subdirectories**
   - Create `shipping/` directory
   - Create `payment/` directory
   - Create `review/` directory
   - Create `success/` directory
   - Leave page creation for Document 02

5. **Plan checkout flow logic**
   - Step progression validation
   - Data persistence between steps
   - Back navigation to previous steps
   - Cart locking during checkout

6. **Consider checkout requirements**
   - Guest checkout vs account required
   - Address validation
   - Payment gateway integration
   - Order creation and confirmation
   - Email notification triggers

7. **Plan security considerations**
   - HTTPS enforcement
   - Payment data handling (PCI compliance)
   - Session timeout
   - CSRF protection

### Checkout Directory Structure

```
frontend/app/(storefront)/checkout/
├── page.tsx                # Checkout landing/Step 1 (Doc 02)
├── loading.tsx             # Checkout loading (Doc 02)
├── shipping/
│   └── page.tsx           # Shipping info step
├── payment/
│   └── page.tsx           # Payment method step
├── review/
│   └── page.tsx           # Order review step
└── success/
    └── page.tsx           # Order confirmation
```

### Checkout Routes Mapping

| Route | URL | Step | Purpose |
|-------|-----|------|---------|
| Start | `/checkout` | 1 | Cart summary & guest/login |
| Shipping | `/checkout/shipping` | 2 | Shipping address entry |
| Payment | `/checkout/payment` | 3 | Payment method selection |
| Review | `/checkout/review` | 4 | Order review & confirmation |
| Success | `/checkout/success` | 5 | Order confirmation |

### Checkout Flow Diagram

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Start   │ ─→ │ Shipping │ ─→ │ Payment  │ ─→ │  Review  │ ─→ │ Success  │
│ /checkout│    │ /shipping│    │ /payment │    │ /review  │    │ /success │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     └───← Back ─────┴───← Back ─────┴───← Back ────┘
```

### Checkout Step Details

| Step | Information Collected | Validation |
|------|----------------------|------------|
| 1. Start | Email, account option | Email format |
| 2. Shipping | Name, address, phone | Required fields, postal code |
| 3. Payment | Card details, billing | Payment gateway validation |
| 4. Review | Confirmation checkbox | Terms acceptance |
| 5. Success | N/A (display only) | Order created |

### Checkout Page Sections

| Section | Purpose | Steps |
|---------|---------|-------|
| Progress Indicator | Show current step | All steps |
| Form Fields | Collect information | 1-3 |
| Order Summary | Display cart items | All steps |
| Navigation | Next/Back buttons | 1-4 |
| Confirmation | Order details | 5 |

### Guest vs Authenticated Checkout

| Checkout Type | Features | Data Persistence |
|---------------|----------|------------------|
| Guest | Faster, no account needed | Order history via email |
| Authenticated | Saved addresses, order tracking | Full account history |

### Payment Gateway Integration

| Provider | Integration Point | Implementation |
|----------|------------------|----------------|
| Stripe | `/checkout/payment` | Client SDK + API |
| PayPal | `/checkout/payment` | PayPal button integration |
| Local Gateways | `/checkout/payment` | Sri Lanka payment systems |

### Order Confirmation Elements

| Element | Content |
|---------|---------|
| Order Number | Unique order ID |
| Thank You Message | Confirmation text |
| Order Summary | Items and totals |
| Shipping Info | Delivery address |
| Payment Info | Payment method (masked) |
| Next Steps | Email confirmation, tracking |
| CTA | Continue shopping, account |

### Expected Outcome
- Checkout directory structure created
- Subdirectories for multi-step flow prepared
- Clear checkout progression planned
- Foundation for checkout pages in Document 02

### Verification Checklist
- [ ] `frontend/app/(storefront)/checkout/` directory exists
- [ ] `shipping/` subdirectory created
- [ ] `payment/` subdirectory created
- [ ] `review/` subdirectory created
- [ ] `success/` subdirectory created
- [ ] Directory structure matches planned checkout flow
- [ ] Ready for page component creation in Document 02

---

## Task 07: Create Account Directory

### Overview
Create the account directory structure to house customer account pages including profile management, order history, addresses, wishlist, and account settings. This customer portal provides authenticated users with self-service capabilities to manage their account and review their purchase history.

### Dependencies
- Task 01: Create Storefront Route Group

### Instructions

1. **Create account directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `account`
   - This directory will house customer account pages

2. **Understand account routing structure**
   - `/account` → Account dashboard/overview
   - `/account/profile` → Profile information
   - `/account/orders` → Order history
   - `/account/addresses` → Saved addresses
   - `/account/wishlist` → Wishlist items
   - `/account/settings` → Account settings

3. **Plan account directory structure**
   - `page.tsx` → Account dashboard (task for Document 02)
   - `loading.tsx` → Account loading state (task for Document 02)
   - `layout.tsx` → Account section layout with sidebar
   - `profile/` → Profile management
   - `orders/` → Order history
   - `addresses/` → Address book
   - `wishlist/` → Saved products
   - `settings/` → Account settings

4. **Create account subdirectories**
   - Create `profile/` directory
   - Create `orders/` directory with `[orderId]/` subdirectory
   - Create `addresses/` directory
   - Create `wishlist/` directory
   - Create `settings/` directory
   - Leave page creation for Document 02

5. **Plan account layout with sidebar**
   - Left sidebar: Navigation menu
   - Right content: Active page content
   - Responsive: Sidebar converts to dropdown on mobile

6. **Consider authentication requirements**
   - Require authentication for all account pages
   - Redirect unauthenticated users to login
   - Implement route protection middleware

7. **Plan account features**
   - Profile: Edit name, email, phone, photo
   - Orders: View history, track, reorder, download invoices
   - Addresses: Add, edit, delete, set default
   - Wishlist: Save products, add to cart
   - Settings: Password change, notifications, preferences

### Account Directory Structure

```
frontend/app/(storefront)/account/
├── page.tsx                # Account dashboard (Doc 02)
├── layout.tsx              # Account sidebar layout (Doc 02)
├── loading.tsx             # Account loading (Doc 02)
├── profile/
│   └── page.tsx           # Profile management
├── orders/
│   ├── page.tsx           # Order history list
│   └── [orderId]/
│       └── page.tsx       # Individual order detail
├── addresses/
│   └── page.tsx           # Address book
├── wishlist/
│   └── page.tsx           # Saved products
└── settings/
    └── page.tsx           # Account settings
```

### Account Routes Mapping

| Route | URL | Purpose |
|-------|-----|---------|
| Dashboard | `/account` | Account overview |
| Profile | `/account/profile` | Edit personal info |
| Orders | `/account/orders` | Order history |
| Order Detail | `/account/orders/12345` | Single order view |
| Addresses | `/account/addresses` | Manage addresses |
| Wishlist | `/account/wishlist` | Saved products |
| Settings | `/account/settings` | Account preferences |

### Account Sidebar Navigation

| Menu Item | Route | Icon |
|-----------|-------|------|
| Dashboard | `/account` | Home |
| Profile | `/account/profile` | User |
| Orders | `/account/orders` | Shopping Bag |
| Addresses | `/account/addresses` | Map Pin |
| Wishlist | `/account/wishlist` | Heart |
| Settings | `/account/settings` | Settings |
| Logout | N/A | Log Out |

### Account Dashboard Overview

```
┌────────────────────────────────────────┐
│  Welcome back, [Name]!                 │
├────────────────────────────────────────┤
│  Recent Orders                         │
│  ┌──────────────────────────────────┐ │
│  │ Order #12345  |  Rs. 5,500       │ │
│  │ Delivered on Jan 20, 2026        │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Quick Actions                         │
│  [Track Order] [Reorder] [Wishlist]   │
└────────────────────────────────────────┘
```

### Account Layout Structure

```
┌──────────────────────────────────────────────────────┐
│                Store Header                          │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │         Page Content                      │
│          │                                           │
│ • Dash   │    ┌─────────────────────────────────┐  │
│ • Profile│    │                                 │  │
│ • Orders │    │     {children}                  │  │
│ • Address│    │   (Account Pages)               │  │
│ • Wishlist│   │                                 │  │
│ • Settings│   └─────────────────────────────────┘  │
│          │                                           │
└──────────┴───────────────────────────────────────────┤
│                Store Footer                          │
└──────────────────────────────────────────────────────┘
```

### Account Page Details

| Page | Key Features | Data Displayed |
|------|--------------|----------------|
| Dashboard | Quick overview | Recent orders, account summary |
| Profile | Edit form | Name, email, phone, photo |
| Orders | Order list, filters | Order ID, date, status, total |
| Order Detail | Full order info | Items, shipping, tracking |
| Addresses | CRUD operations | Saved addresses, default marker |
| Wishlist | Product grid | Saved products, add to cart |
| Settings | Preference forms | Password, notifications, privacy |

### Order History Features

| Feature | Description |
|---------|-------------|
| Filter | By date range, status |
| Sort | By date, amount |
| Search | By order number |
| Actions | View details, reorder, download invoice |
| Status | Pending, Processing, Shipped, Delivered |

### Address Management

| Action | Description |
|--------|-------------|
| Add | Create new address |
| Edit | Update existing address |
| Delete | Remove address (if not default) |
| Set Default | Mark for checkout default |
| Validation | Postal code, phone number |

### Account Settings Options

| Setting Category | Options |
|-----------------|---------|
| Password | Change password form |
| Email Preferences | Marketing, order updates |
| Privacy | Data export, account deletion |
| Notifications | Email, SMS preferences |
| Language | Locale selection |

### Authentication Protection

| Protection Level | Implementation |
|-----------------|----------------|
| Route Guard | Middleware check |
| Redirect | To login if unauthenticated |
| Session | JWT or session-based |
| Return URL | Redirect back after login |

### Expected Outcome
- Account directory structure created
- Subdirectories for all account sections prepared
- Account layout planned with sidebar navigation
- Foundation for account pages in Document 02

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/` directory exists
- [ ] `profile/` subdirectory created
- [ ] `orders/` subdirectory created with `[orderId]/`
- [ ] `addresses/` subdirectory created
- [ ] `wishlist/` subdirectory created
- [ ] `settings/` subdirectory created
- [ ] Directory structure matches planned hierarchy
- [ ] Ready for page and layout component creation in Document 02

---

## Summary

This document established the foundational storefront routing architecture, including the (storefront) route group, store root layout, homepage route, and all primary customer-facing directory structures (products, cart, checkout, account). These directories provide organized, scalable foundations for building a complete e-commerce experience separate from the ERP dashboard.

### Completed Tasks
1. ✓ Created (storefront) route group for customer-facing pages
2. ✓ Created store root layout with three-section structure
3. ✓ Created store homepage route at root URL
4. ✓ Created products directory with dynamic routing structure
5. ✓ Created cart directory for shopping cart functionality
6. ✓ Created checkout directory with multi-step flow structure
7. ✓ Created account directory with customer portal structure

### Next Steps
Proceed to [02_Tasks-08-14_Pages-Components-Verify.md](02_Tasks-08-14_Pages-Components-Verify.md) to create search page route, loading states, error boundaries, not-found page, component directories, and verify the complete directory structure.

### Key Achievements
- Established clear separation between storefront and dashboard
- Created logical routing hierarchy for e-commerce flow
- Prepared multi-step checkout structure
- Organized customer account portal directories
- Foundation ready for component and page implementation
