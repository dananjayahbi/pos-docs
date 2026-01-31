# Tasks 01-08: Portal Routes Setup

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** A - Portal Routes & Layout  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Layout-Navigation.md](02_Tasks-09-16_Layout-Navigation.md)

---

## Document Overview

This document covers the creation of the customer portal route structure under the account section. It establishes the portal directory, layout component, and all primary customer portal pages including dashboard, orders, order details, addresses, wishlist, and reviews. These routes provide customers with complete account management and order tracking capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Portal Directory | Low | 10 min |
| 02 | Create Portal Layout | Medium | 30 min |
| 03 | Create Dashboard Route | Low | 15 min |
| 04 | Create Orders Route | Low | 15 min |
| 05 | Create Order Detail Route | Low | 20 min |
| 06 | Create Addresses Route | Low | 15 min |
| 07 | Create Wishlist Route | Low | 15 min |
| 08 | Create Reviews Route | Low | 15 min |

---

## Task 01: Create Portal Directory

### Overview
Create the account portal directory structure under the storefront route group. This directory serves as the container for all customer account-related pages, providing a centralized location for authenticated customer features.

### Dependencies
- SubPhase-08 (Checkout & Payment Flow) must be complete
- Storefront route group exists
- Frontend project structure established

### Instructions

1. **Navigate to storefront directory**
   - Go to `frontend/app/(storefront)/` directory
   - Confirm this is the storefront route group

2. **Create account directory**
   - Create new directory named `account`
   - This becomes the URL path `/account/`
   - Will contain all portal-related pages

3. **Verify directory structure**
   - Confirm `frontend/app/(storefront)/account/` exists
   - Ensure proper nesting under storefront route group

4. **Understand routing behavior**
   - All routes in this directory are under `/account/` path
   - Portal layout will be shared across all routes
   - Authentication middleware will protect these routes

### Portal Directory Purpose

| Feature | Benefit |
|---------|---------|
| Centralized Location | All customer features in one place |
| Protected Routes | Authentication guard for security |
| Shared Layout | Consistent UI across portal |
| SEO-Friendly | Clean URL structure |

### Directory Structure
```
frontend/app/
└── (storefront)/
    ├── account/                # Portal directory
    │   └── layout.tsx         # (Created in Task 02)
    ├── products/
    └── cart/
```

### URL Mapping

| Directory | URL Path | Purpose |
|-----------|----------|---------|
| `account/` | `/account/` | Portal base (redirects to dashboard) |
| `account/dashboard/` | `/account/dashboard/` | Customer dashboard |
| `account/orders/` | `/account/orders/` | Order history |
| `account/addresses/` | `/account/addresses/` | Address management |

### Expected Outcome
- Account directory created under storefront
- Foundation for all portal pages
- Proper URL structure established

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/` directory exists
- [ ] Located correctly under storefront route group
- [ ] Ready to receive layout and page files

---

## Task 02: Create Portal Layout

### Overview
Create the layout component for the customer portal that provides a sidebar navigation layout. This layout wraps all portal pages with a consistent structure featuring a collapsible sidebar for desktop, mobile drawer navigation, and a main content area.

### Dependencies
- Task 01: Create Portal Directory

### Instructions

1. **Create layout file**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new file named `layout.tsx`
   - This layout wraps all pages in account directory

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import components for sidebar and header (created in later tasks)
   - Import authentication utilities for session check

3. **Define layout metadata**
   - Export metadata object with page title
   - Set title template: "%s | My Account | LankaCommerce"
   - Configure description for account pages

4. **Create layout component structure**
   - Define default export function `PortalLayout`
   - Accept `children` prop of type `ReactNode`
   - Return JSX structure with sidebar and main area

5. **Implement authentication check**
   - Add server-side session verification
   - Redirect to login if not authenticated
   - Pass user data to child components via context or props

6. **Structure layout sections**
   - Left section: Portal sidebar navigation (desktop)
   - Right section: Main content area for pages
   - Top section: Portal header with user greeting
   - Mobile: Hamburger menu trigger for drawer

7. **Add responsive behavior**
   - Desktop: Fixed sidebar, scrollable content
   - Tablet: Collapsible sidebar with toggle
   - Mobile: Hidden sidebar, drawer navigation only

8. **Configure layout grid**
   - Use CSS Grid or Flexbox for layout structure
   - Sidebar width: 256px (desktop), full width (mobile drawer)
   - Main area: Fill remaining space
   - Ensure proper spacing and padding

### Layout Structure

```
Desktop Layout
┌────────────────────────────────────────────────┐
│  Portal Header (User Name, Logout)            │
├──────────┬─────────────────────────────────────┤
│          │                                     │
│ Sidebar  │        Main Content Area           │
│  (256px) │         {children}                  │
│          │                                     │
│ • Dash   │                                     │
│ • Orders │                                     │
│ • Addr   │                                     │
│ • Wish   │                                     │
│ • Reviews│                                     │
│ • Setting│                                     │
│          │                                     │
└──────────┴─────────────────────────────────────┘

Mobile Layout
┌────────────────────────────────────────────────┐
│  [☰] Portal Header                            │
├────────────────────────────────────────────────┤
│                                                │
│        Main Content Area (Full Width)         │
│               {children}                       │
│                                                │
│  [Drawer opens on hamburger click]            │
└────────────────────────────────────────────────┘
```

### Layout Component Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Portal page content |

### Layout Sections

| Section | Component | Visibility | Purpose |
|---------|-----------|-----------|---------|
| Header | PortalHeader | Always | User greeting, logout |
| Sidebar | PortalSidebar | Desktop/Tablet | Navigation links |
| Drawer | MobileNavDrawer | Mobile | Mobile navigation |
| Main | children | Always | Page content |

### Responsive Breakpoints

| Screen Size | Layout Behavior |
|-------------|-----------------|
| Mobile (< 768px) | Drawer navigation, full-width content |
| Tablet (768px - 1024px) | Collapsible sidebar with toggle |
| Desktop (> 1024px) | Fixed sidebar, content beside |

### Expected Outcome
- Functional portal layout component
- Sidebar navigation on desktop
- Mobile drawer navigation
- Authentication protection
- Proper TypeScript typing

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/layout.tsx` created
- [ ] Layout accepts children prop
- [ ] Metadata configured for portal pages
- [ ] Authentication check implemented
- [ ] Responsive layout structure defined
- [ ] Sidebar and header sections planned

---

## Task 03: Create Dashboard Route

### Overview
Create the customer dashboard route that serves as the landing page for the portal. Displays overview cards with order summary, recent orders, wishlist count, saved addresses, and quick action buttons.

### Dependencies
- Task 01: Create Portal Directory

### Instructions

1. **Create dashboard directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `dashboard`

2. **Create page file**
   - Create `page.tsx` file in dashboard directory
   - This renders at `/account/dashboard/` route

3. **Define page metadata**
   - Export metadata object with title "Dashboard"
   - Add description for dashboard page
   - Configure OpenGraph tags if needed

4. **Create page component**
   - Define default export async function `DashboardPage`
   - Fetch user's dashboard data (server component)
   - Include order count, recent orders, wishlist count

5. **Structure dashboard layout**
   - Welcome section with user's name
   - Overview cards (4-6 summary cards)
   - Recent orders section
   - Quick action buttons

6. **Implement overview cards**
   - Total orders card
   - Pending orders card
   - Wishlist items count
   - Saved addresses count
   - Loyalty points (if applicable)
   - Recent activity summary

7. **Add quick actions section**
   - "Track Order" button
   - "Continue Shopping" link
   - "View All Orders" link
   - "Manage Addresses" link

### Dashboard Sections

| Section | Content | Priority |
|---------|---------|----------|
| Welcome | User greeting, account since date | High |
| Overview Cards | Order stats, wishlist, addresses | High |
| Recent Orders | Last 3-5 orders with status | High |
| Quick Actions | Primary action buttons | Medium |
| Recommendations | Product suggestions (Phase 10) | Low |

### Overview Card Types

| Card | Data Display | Action |
|------|--------------|--------|
| Total Orders | Count of all orders | View all orders |
| Pending Orders | Count of processing orders | Track orders |
| Wishlist Items | Count of wishlist products | View wishlist |
| Saved Addresses | Count of addresses | Manage addresses |

### Dashboard Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Welcome Back, [Customer Name]!                 │
│  Member since: [Date]                           │
├────────┬────────┬────────┬────────┬────────────┤
│ Total  │Pending │Wishlist│ Saved  │            │
│ Orders │ Orders │ Items  │Address │            │
│   15   │   2    │   8    │   3    │            │
└────────┴────────┴────────┴────────┴────────────┘
│                                                 │
│  Recent Orders                                  │
│  ┌──────────────────────────────────────────┐ │
│  │ Order #12345  | Delivered | ₨ 5,500      │ │
│  │ Order #12344  | Shipped   | ₨ 8,200      │ │
│  │ Order #12343  | Processing| ₨ 3,750      │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  [Track Order] [Continue Shopping]              │
└─────────────────────────────────────────────────┘
```

### Data Requirements

| Data Point | Source | Purpose |
|------------|--------|---------|
| User Name | Session/Auth | Personalized greeting |
| Order Count | Database query | Overview statistics |
| Recent Orders | Database query | Quick order access |
| Wishlist Count | Database query | Engagement metric |
| Address Count | Database query | Account completeness |

### Expected Outcome
- Functional dashboard page at /account/dashboard/
- Overview cards displaying customer statistics
- Recent orders list with status
- Quick action buttons for common tasks

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/dashboard/page.tsx` created
- [ ] Page renders at `/account/dashboard/` route
- [ ] Metadata configured
- [ ] Dashboard sections structured
- [ ] Overview cards planned
- [ ] Recent orders section planned

---

## Task 04: Create Orders Route

### Overview
Create the orders route that displays a complete list of customer orders with search, filter, and pagination capabilities. Allows customers to view all orders, filter by status, search by order number or product, and access order details.

### Dependencies
- Task 01: Create Portal Directory

### Instructions

1. **Create orders directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `orders`

2. **Create page file**
   - Create `page.tsx` file in orders directory
   - This renders at `/account/orders/` route

3. **Define page metadata**
   - Export metadata with title "My Orders"
   - Add description for order history page
   - Configure for search engine indexing (noindex for privacy)

4. **Create page component**
   - Define default export async function `OrdersPage`
   - Accept searchParams for filtering and pagination
   - Fetch orders list based on filters

5. **Implement filters section**
   - Status filter (All, Processing, Shipped, Delivered, Cancelled)
   - Date range filter (Last 30 days, Last 6 months, All time)
   - Search input for order number or product name

6. **Structure orders table**
   - Column headers: Order #, Date, Status, Items, Total, Actions
   - Responsive card layout for mobile
   - Table layout for desktop

7. **Add order list items**
   - Display order number with link to details
   - Show order date and delivery status
   - Display item count and order total
   - Include "View Details" action button

8. **Implement pagination**
   - Show 10-20 orders per page
   - Page number buttons or infinite scroll
   - Total count display

9. **Add empty state handling**
   - Show message if no orders found
   - Display "Start Shopping" button
   - Provide helpful suggestions for first-time users

### Orders Page Sections

| Section | Content | Priority |
|---------|---------|----------|
| Filters | Status, date range, search | High |
| Orders List | Paginated order records | High |
| Pagination | Page controls | High |
| Empty State | No orders message | Medium |

### Order List Columns

| Column | Data | Mobile Display |
|--------|------|----------------|
| Order # | Order ID with link | Yes |
| Date | Order placement date | Yes |
| Status | Order status badge | Yes |
| Items | Item count | No (show in details) |
| Total | Order total amount | Yes |
| Actions | View Details button | Yes |

### Status Filter Options

| Status | Badge Color | Description |
|--------|-------------|-------------|
| All | Gray | Show all orders |
| Processing | Blue | Orders being prepared |
| Shipped | Purple | Orders in transit |
| Delivered | Green | Completed orders |
| Cancelled | Red | Cancelled orders |

### Orders List Layout

```
Desktop View
┌──────────────────────────────────────────────────┐
│  Filters: [All] [Processing] [Shipped]          │
│  Search: [____________]  Date: [Last 30 days ▼] │
├────────┬─────────┬────────┬──────┬───────┬──────┤
│Order # │   Date  │ Status │Items │ Total │Action│
├────────┼─────────┼────────┼──────┼───────┼──────┤
│ #12345 │ Jan 25  │Shipped │  3   │₨5,500 │[View]│
│ #12344 │ Jan 20  │Deliver │  2   │₨8,200 │[View]│
│ #12343 │ Jan 15  │Process │  1   │₨3,750 │[View]│
└────────┴─────────┴────────┴──────┴───────┴──────┘
│  Showing 1-10 of 45 orders   [1] [2] [3] [Next] │
└──────────────────────────────────────────────────┘

Mobile View (Card Layout)
┌──────────────────────────────────┐
│  Order #12345                    │
│  Jan 25, 2026 • [Shipped]       │
│  3 items • ₨ 5,500               │
│  [View Details]                  │
├──────────────────────────────────┤
│  Order #12344                    │
│  Jan 20, 2026 • [Delivered]     │
│  2 items • ₨ 8,200               │
│  [View Details]                  │
└──────────────────────────────────┘
```

### Filter Parameters

| Parameter | Type | Values | Purpose |
|-----------|------|--------|---------|
| status | string | all, processing, shipped, delivered, cancelled | Filter by order status |
| dateRange | string | 30days, 6months, all | Filter by date |
| search | string | Order # or product name | Search orders |
| page | number | 1, 2, 3, ... | Pagination |

### Expected Outcome
- Functional orders list page
- Filter and search capabilities
- Paginated order display
- Responsive table/card layout
- Link to order details page

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/orders/page.tsx` created
- [ ] Page renders at `/account/orders/` route
- [ ] Metadata configured with noindex for privacy
- [ ] Filters section structured
- [ ] Orders table/list layout defined
- [ ] Pagination planned
- [ ] Empty state handling included

---

## Task 05: Create Order Detail Route

### Overview
Create the dynamic order detail route that displays comprehensive information about a specific order. Shows order items, shipping address, payment information, status timeline, tracking details, and invoice download option.

### Dependencies
- Task 01: Create Portal Directory

### Instructions

1. **Create dynamic route directory**
   - Navigate to `frontend/app/(storefront)/account/orders/` directory
   - Create directory named `[id]` (with square brackets)
   - This creates dynamic route for order ID

2. **Create page file**
   - Create `page.tsx` file in `[id]` directory
   - This renders at `/account/orders/[orderId]` route

3. **Define dynamic metadata**
   - Export generateMetadata async function
   - Use order ID from params to fetch order
   - Set title to "Order #[orderNumber]"
   - Add noindex for privacy

4. **Create page component**
   - Define default export async function `OrderDetailPage`
   - Accept params prop with id parameter
   - Fetch order details from API using order ID

5. **Implement order header section**
   - Display order number prominently
   - Show order date and current status
   - Include status badge with appropriate color
   - Add "Track Order" and "Download Invoice" buttons

6. **Structure order items section**
   - List all items in the order
   - Show product image, name, variant, quantity, price
   - Display subtotal for each line item
   - Include product links to product pages

7. **Add order summary section**
   - Show subtotal, shipping, tax breakdown
   - Display discounts and coupon codes applied
   - Show order total prominently
   - Include payment method information

8. **Create shipping information section**
   - Display shipping address details
   - Show expected delivery date
   - Include tracking number if shipped
   - Add courier service information

9. **Implement status timeline**
   - Show order status progression
   - Display timestamps for each status change
   - Visual timeline indicator
   - Highlight current status

10. **Add action buttons**
    - "Download Invoice" button
    - "Track Shipment" button (if shipped)
    - "Contact Support" button
    - "Cancel Order" button (if eligible)

### Order Detail Sections

| Section | Content | Priority |
|---------|---------|----------|
| Header | Order #, date, status, actions | High |
| Items List | Products ordered with details | High |
| Order Summary | Pricing breakdown | High |
| Shipping Info | Address, tracking, courier | High |
| Status Timeline | Order progression | Medium |
| Actions | Invoice, tracking, support | Medium |

### Order Items Display

| Column | Data | Mobile |
|--------|------|--------|
| Product Image | Thumbnail | Yes |
| Product Name | Name + variant | Yes |
| Quantity | Item count | Yes |
| Price | Unit price | No |
| Subtotal | Quantity × Price | Yes |

### Order Detail Layout

```
┌──────────────────────────────────────────────────┐
│  Order #12345              [Shipped]             │
│  Placed on Jan 25, 2026                          │
│  [Download Invoice] [Track Order]                │
├──────────────────────────────────────────────────┤
│  Order Items                                     │
│  ┌────────────────────────────────────────────┐ │
│  │ [IMG] Product Name - Variant               │ │
│  │       Qty: 2  ×  ₨ 1,500  =  ₨ 3,000      │ │
│  ├────────────────────────────────────────────┤ │
│  │ [IMG] Another Product                      │ │
│  │       Qty: 1  ×  ₨ 2,500  =  ₨ 2,500      │ │
│  └────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│  Order Summary          │  Shipping Information  │
│  Subtotal:  ₨ 5,500    │  John Doe              │
│  Shipping:  ₨   300    │  123 Main Street       │
│  Tax:       ₨   270    │  Colombo, Sri Lanka    │
│  Total:     ₨ 6,070    │  +94 77 123 4567       │
│  Payment: Visa ****1234│  Tracking: ABC123456   │
├──────────────────────────────────────────────────┤
│  Status Timeline                                 │
│  ● Order Placed       - Jan 25, 10:00 AM        │
│  ● Payment Confirmed  - Jan 25, 10:05 AM        │
│  ● Processing         - Jan 25, 11:00 AM        │
│  ● Shipped           - Jan 26, 09:00 AM        │
│  ○ Delivered          - Expected Jan 28         │
└──────────────────────────────────────────────────┘
```

### Status Timeline States

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| Completed | ● | Green | Status completed |
| Current | ◉ | Blue | Current status |
| Pending | ○ | Gray | Not yet reached |
| Cancelled | ✕ | Red | Order cancelled |

### Action Button Conditions

| Button | Condition | Action |
|--------|-----------|--------|
| Download Invoice | Order confirmed | Generate PDF invoice |
| Track Order | Order shipped | Show tracking details |
| Cancel Order | Status = Processing or Confirmed | Cancel order request |
| Contact Support | Always available | Open support chat |

### Expected Outcome
- Functional order detail page with dynamic routing
- Complete order information display
- Order items list with product details
- Shipping and payment information
- Status timeline visualization
- Downloadable invoice option

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/orders/[id]/page.tsx` created
- [ ] Dynamic route renders at `/account/orders/[orderId]`
- [ ] Dynamic metadata function implemented
- [ ] Order header with status displayed
- [ ] Order items section structured
- [ ] Order summary section planned
- [ ] Shipping information section included
- [ ] Status timeline layout defined
- [ ] Action buttons configured

---

## Task 06: Create Addresses Route

### Overview
Create the addresses route for managing customer shipping and billing addresses. Allows customers to view all saved addresses, add new addresses, edit existing ones, set default address, and delete addresses.

### Dependencies
- Task 01: Create Portal Directory

### Instructions

1. **Create addresses directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `addresses`

2. **Create page file**
   - Create `page.tsx` file in addresses directory
   - This renders at `/account/addresses/` route

3. **Define page metadata**
   - Export metadata with title "My Addresses"
   - Add description for address management page
   - Configure noindex for privacy

4. **Create page component**
   - Define default export async function `AddressesPage`
   - Fetch customer's saved addresses
   - Include both shipping and billing addresses

5. **Structure page header**
   - Page title "My Addresses"
   - "Add New Address" button prominently displayed
   - Address count indicator (optional)

6. **Implement address cards grid**
   - Display addresses in responsive grid layout
   - 2-3 columns on desktop, 1 column on mobile
   - Each address as a card with details

7. **Design address card content**
   - Address label/name (e.g., "Home", "Office")
   - Full name of recipient
   - Complete address with street, city, postal code
   - Phone number
   - "Default" badge if default address
   - Address type badge (Shipping/Billing/Both)

8. **Add address card actions**
   - "Edit" button to modify address
   - "Delete" button to remove address
   - "Set as Default" button if not default
   - Confirmation modal for delete action

9. **Implement empty state**
   - Show message if no addresses saved
   - Display "Add Your First Address" button
   - Provide helpful explanation

### Addresses Page Sections

| Section | Content | Priority |
|---------|---------|----------|
| Header | Page title, add button | High |
| Address Grid | Saved addresses cards | High |
| Empty State | No addresses message | Medium |

### Address Card Information

| Field | Display | Required |
|-------|---------|----------|
| Label | Name of address (Home, Office) | Yes |
| Full Name | Recipient name | Yes |
| Address Line 1 | Street address | Yes |
| Address Line 2 | Apartment, unit | No |
| City | City name | Yes |
| Postal Code | ZIP/Postal code | Yes |
| Phone | Contact number | Yes |
| Type | Shipping/Billing | Yes |
| Default | Default badge | If default |

### Addresses Layout

```
┌──────────────────────────────────────────────────┐
│  My Addresses              [+ Add New Address]   │
├────────────────────┬─────────────────────────────┤
│ ┌────────────────┐│┌────────────────┐           │
│ │ [Default] Home ││ Office          │           │
│ │                ││                 │           │
│ │ John Doe       ││ John Doe        │           │
│ │ 123 Main St    ││ 456 Business Ave│           │
│ │ Colombo 00100  ││ Colombo 00200   │           │
│ │ +94 77 123 4567││ +94 77 987 6543 │           │
│ │                ││                 │           │
│ │ [Edit][Delete] ││ [Edit][Set Default]         │
│ └────────────────┘│└────────────────┘           │
└────────────────────┴─────────────────────────────┘
```

### Address Card Actions

| Action | Icon/Button | Behavior |
|--------|-------------|----------|
| Edit | Pencil icon or "Edit" | Open edit modal/page |
| Delete | Trash icon or "Delete" | Show confirmation, then delete |
| Set Default | Star icon or button | Make this the default address |

### Address Types

| Type | Usage | Badge Color |
|------|-------|-------------|
| Shipping | Delivery address | Blue |
| Billing | Invoice address | Green |
| Both | Shipping & Billing | Purple |

### Empty State Display

```
┌──────────────────────────────────────┐
│                                      │
│         [Address Icon]               │
│                                      │
│     No Addresses Saved Yet           │
│                                      │
│  Add an address to speed up          │
│  your checkout process               │
│                                      │
│     [Add Your First Address]         │
│                                      │
└──────────────────────────────────────┘
```

### Expected Outcome
- Functional addresses management page
- Grid display of saved addresses
- Add new address button
- Edit and delete actions for each address
- Default address indicator
- Empty state handling

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/addresses/page.tsx` created
- [ ] Page renders at `/account/addresses/` route
- [ ] Metadata configured with noindex
- [ ] Page header with add button
- [ ] Address cards grid layout defined
- [ ] Address card content structure planned
- [ ] Action buttons (edit, delete, set default) included
- [ ] Empty state handling designed

---

## Task 07: Create Wishlist Route

### Overview
Create the wishlist route that displays all products saved by the customer for future purchase. Allows customers to view wishlist items, add products to cart directly, remove items from wishlist, and share wishlist with others.

### Dependencies
- Task 01: Create Portal Directory

### Instructions

1. **Create wishlist directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `wishlist`

2. **Create page file**
   - Create `page.tsx` file in wishlist directory
   - This renders at `/account/wishlist/` route

3. **Define page metadata**
   - Export metadata with title "My Wishlist"
   - Add description for wishlist page
   - Configure OpenGraph for social sharing

4. **Create page component**
   - Define default export async function `WishlistPage`
   - Fetch customer's wishlist items
   - Include product details and availability

5. **Structure page header**
   - Page title "My Wishlist"
   - Wishlist item count
   - "Share Wishlist" button (optional)
   - Filter by category or price (optional)

6. **Implement wishlist grid**
   - Display products in responsive grid
   - 3-4 columns on desktop, 2 columns tablet, 1 mobile
   - Product cards with image, name, price

7. **Design wishlist item card**
   - Product image with link to product page
   - Product name and brief description
   - Current price (show discount if on sale)
   - Stock availability indicator
   - "Add to Cart" button
   - "Remove from Wishlist" button

8. **Add item actions**
   - "Add to Cart" button (primary action)
   - "Remove" icon/button (subtle)
   - "View Product" link on image/name
   - Variant selector if product has variants

9. **Implement empty state**
   - Show message if wishlist is empty
   - Display "Start Shopping" button
   - Suggest popular or trending products

### Wishlist Page Sections

| Section | Content | Priority |
|---------|---------|----------|
| Header | Title, count, share button | High |
| Product Grid | Wishlist items | High |
| Empty State | No items message | Medium |

### Wishlist Item Card Content

| Element | Display | Action |
|---------|---------|--------|
| Product Image | Thumbnail with hover | Link to product page |
| Product Name | Name + variant | Link to product page |
| Price | Current price, sale badge | Visual only |
| Stock Status | In Stock / Out of Stock | Visual indicator |
| Add to Cart | Primary button | Add item to cart |
| Remove | Icon or button | Remove from wishlist |

### Wishlist Layout

```
┌──────────────────────────────────────────────────┐
│  My Wishlist (8 items)          [Share Wishlist] │
├──────────────┬──────────────┬──────────────┬─────┤
│ ┌──────────┐│┌──────────┐ │┌──────────┐  │     │
│ │  [IMG]   ││  [IMG]   │ ││  [IMG]   │  │     │
│ │          ││          │ ││          │  │     │
│ │ Product 1││ Product 2│ ││ Product 3│  │     │
│ │ ₨ 5,500  ││ ₨ 8,200  │ ││ ₨ 3,750  │  │     │
│ │ In Stock ││ In Stock │ ││Out Stock │  │     │
│ │[Add Cart]││[Add Cart]│ ││[Notify Me]│  │     │
│ │    [×]   ││    [×]   │ ││    [×]   │  │     │
│ └──────────┘│└──────────┘ │└──────────┘  │     │
└──────────────┴──────────────┴──────────────┴─────┘
```

### Stock Status Display

| Status | Badge Color | Action Button |
|--------|-------------|---------------|
| In Stock | Green | Add to Cart |
| Low Stock (< 5) | Yellow | Add to Cart |
| Out of Stock | Red | Notify Me |

### Item Actions

| Action | Button Type | Behavior |
|--------|-------------|----------|
| Add to Cart | Primary button | Add item to cart, keep in wishlist |
| Remove | Icon button (×) | Remove from wishlist with confirmation |
| View Product | Link on image/name | Navigate to product detail page |
| Notify Me | Secondary button | Subscribe to stock notification |

### Empty Wishlist State

```
┌──────────────────────────────────────┐
│                                      │
│         [Heart Icon]                 │
│                                      │
│     Your Wishlist is Empty           │
│                                      │
│  Save items you love for later.      │
│  Start adding products now!          │
│                                      │
│     [Start Shopping]                 │
│                                      │
└──────────────────────────────────────┘
```

### Expected Outcome
- Functional wishlist page
- Grid display of wishlist products
- Add to cart functionality from wishlist
- Remove items option
- Stock availability indicators
- Empty state handling

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/wishlist/page.tsx` created
- [ ] Page renders at `/account/wishlist/` route
- [ ] Metadata configured
- [ ] Page header with item count
- [ ] Product grid layout defined
- [ ] Wishlist item cards structured
- [ ] Add to cart and remove actions planned
- [ ] Empty state designed

---

## Task 08: Create Reviews Route

### Overview
Create the reviews route that displays all product reviews written by the customer. Allows customers to view their past reviews, edit existing reviews, add reviews for purchased products, and manage review visibility.

### Dependencies
- Task 01: Create Portal Directory

### Instructions

1. **Create reviews directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `reviews`

2. **Create page file**
   - Create `page.tsx` file in reviews directory
   - This renders at `/account/reviews/` route

3. **Define page metadata**
   - Export metadata with title "My Reviews"
   - Add description for reviews page
   - Configure for indexing (public reviews)

4. **Create page component**
   - Define default export async function `ReviewsPage`
   - Fetch customer's submitted reviews
   - Include product details and review status

5. **Structure page header**
   - Page title "My Reviews"
   - Total reviews count
   - Filter tabs (All, Published, Pending)
   - "Write a Review" button

6. **Implement reviews list**
   - Display reviews in list format
   - Each review as a card with product and review details
   - Sort by date (newest first)
   - Pagination for many reviews

7. **Design review card**
   - Product image and name (linked to product)
   - Star rating display
   - Review title and text
   - Review date and status (Published/Pending/Rejected)
   - Helpful count (if reviews have voting)
   - Edit and delete action buttons

8. **Add review actions**
   - "Edit Review" button to modify review
   - "Delete Review" button with confirmation
   - View product link
   - Report issue button (if review rejected)

9. **Implement pending reviews section**
   - Show products eligible for review
   - Products purchased but not yet reviewed
   - "Write Review" button for each product

10. **Add empty state**
    - Show message if no reviews written
    - Display "Write Your First Review" prompt
    - Link to recent orders to review products

### Reviews Page Sections

| Section | Content | Priority |
|---------|---------|----------|
| Header | Title, count, filter tabs | High |
| Reviews List | Submitted reviews | High |
| Pending Reviews | Products to review | Medium |
| Empty State | No reviews message | Low |

### Review Card Content

| Element | Display | Editable |
|---------|---------|----------|
| Product Info | Image, name, variant | No |
| Star Rating | 1-5 stars visual | Yes (edit) |
| Review Title | Review headline | Yes (edit) |
| Review Text | Full review content | Yes (edit) |
| Review Date | Submission date | No |
| Status | Published/Pending/Rejected | No |
| Helpful Count | Number of helpful votes | No |

### Reviews Layout

```
┌──────────────────────────────────────────────────┐
│  My Reviews (12)        [All][Published][Pending]│
│                              [Write a Review]    │
├──────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────┐  │
│ │ [IMG] Product Name              [Published]│  │
│ │       ★★★★★ 5/5                            │  │
│ │                                            │  │
│ │ "Excellent Product"                        │  │
│ │ This product exceeded my expectations...   │  │
│ │                                            │  │
│ │ Reviewed on Jan 25, 2026  • 5 Helpful     │  │
│ │ [Edit Review] [Delete]                     │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ [IMG] Another Product           [Pending]  │  │
│ │       ★★★★☆ 4/5                            │  │
│ │                                            │  │
│ │ "Good Quality"                             │  │
│ │ Review pending moderation...               │  │
│ └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│  Products You Can Review                         │
│ ┌────────────────────────────────────────────┐  │
│ │ [IMG] Purchased Product   [Write Review]   │  │
│ │       Purchased on Jan 20, 2026            │  │
│ └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Review Status Types

| Status | Badge Color | Description |
|--------|-------------|-------------|
| Published | Green | Review is live on product page |
| Pending | Yellow | Awaiting moderation |
| Rejected | Red | Review did not meet guidelines |

### Review Actions

| Action | Condition | Behavior |
|--------|-----------|----------|
| Edit Review | Status = Published or Pending | Open review edit form |
| Delete Review | Any status | Confirm and delete review |
| Write Review | Product purchased, not reviewed | Open review form for product |
| View Product | Always | Navigate to product page |

### Filter Tabs

| Tab | Display | Description |
|-----|---------|-------------|
| All | All reviews | Show all submitted reviews |
| Published | Published only | Show live reviews |
| Pending | Pending only | Show reviews awaiting approval |

### Empty State Display

```
┌──────────────────────────────────────┐
│                                      │
│         [Star Icon]                  │
│                                      │
│     No Reviews Yet                   │
│                                      │
│  Share your experience with products │
│  you've purchased                    │
│                                      │
│     [Browse Orders to Review]        │
│                                      │
└──────────────────────────────────────┘
```

### Expected Outcome
- Functional reviews management page
- List of customer's reviews with status
- Edit and delete review options
- Pending reviews section for unreviewed products
- Filter tabs for review status
- Empty state handling

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/reviews/page.tsx` created
- [ ] Page renders at `/account/reviews/` route
- [ ] Metadata configured
- [ ] Page header with filter tabs
- [ ] Reviews list layout defined
- [ ] Review cards structured with product info
- [ ] Edit and delete actions planned
- [ ] Pending reviews section included
- [ ] Empty state designed

---

## Document Summary

This document established the complete customer portal route structure with eight core routes. The portal provides customers with comprehensive account management features including dashboard overview, order tracking, address management, wishlist functionality, and review management. All routes are nested under the `/account/` path and share the portal layout created in Task 02.

### Routes Created

| Route | URL | Purpose |
|-------|-----|---------|
| Portal Directory | `/account/` | Container for portal routes |
| Dashboard | `/account/dashboard/` | Customer overview and stats |
| Orders | `/account/orders/` | Order history and tracking |
| Order Detail | `/account/orders/[id]` | Detailed order information |
| Addresses | `/account/addresses/` | Shipping/billing address management |
| Wishlist | `/account/wishlist/` | Saved products for later |
| Reviews | `/account/reviews/` | Product review management |

### Next Steps

The next document covers the layout components, navigation sidebar, and portal verification (Tasks 09-16). These components will provide the navigation structure and user interface for the portal routes created in this document.

---

**Continue to:** [02_Tasks-09-16_Layout-Navigation.md](02_Tasks-09-16_Layout-Navigation.md)
