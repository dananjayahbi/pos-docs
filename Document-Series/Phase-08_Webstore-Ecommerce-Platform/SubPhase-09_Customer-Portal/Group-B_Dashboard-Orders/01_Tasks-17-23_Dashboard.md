# Tasks 17-23: Dashboard Page and Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** B - Dashboard & Orders  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-A_Portal-Routes-Layout](../Group-A_Portal-Routes-Layout/)
- **→ Next Document:** [02_Tasks-24-36_Orders-List.md](02_Tasks-24-36_Orders-List.md)

---

## Document Overview

This document covers the creation of the customer portal dashboard page and its components. It establishes the main dashboard view that customers see when they access their portal, including a personalized welcome card, statistics summary showing order counts and wishlist items, recent orders preview, quick action buttons, and loading skeleton state.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create Dashboard Page | Low | 20 min |
| 18 | Create Welcome Card | Low | 20 min |
| 19 | Create Stats Summary | Medium | 30 min |
| 20 | Create Recent Orders Card | Medium | 30 min |
| 21 | Create View All Orders Link | Low | 10 min |
| 22 | Create Quick Actions | Low | 25 min |
| 23 | Create Dashboard Loading Skeleton | Low | 20 min |

---

## Task 17: Create Dashboard Page

### Overview
Create the main dashboard page component that serves as the customer portal homepage. This page orchestrates all dashboard sections including welcome card, statistics, recent orders, and quick actions into a cohesive layout with proper spacing and responsive design.

### Dependencies
- Task 16: Verify Portal Layout Navigation (from Group A)
- SubPhase-08 (Navigation & Header) must be complete
- Customer authentication is implemented

### Instructions

1. **Create dashboard page file**
   - Navigate to `frontend/app/(storefront)/portal/dashboard/` directory
   - Create new file named `page.tsx`
   - This is the main route for customer portal dashboard

2. **Import required dependencies**
   - Import dashboard components (WelcomeCard, StatsSummary, RecentOrders, QuickActions)
   - Import DashboardSkeleton for loading state
   - Import TanStack Query hooks for data fetching
   - Import authentication hooks to get customer data

3. **Define page metadata**
   - Export metadata object with page title
   - Set title to "Dashboard | LankaCommerce Cloud"
   - Configure description for SEO purposes

4. **Create dashboard component structure**
   - Define default export function `DashboardPage`
   - Use authentication hook to get customer information
   - Implement data fetching for dashboard stats and recent orders

5. **Implement loading state handling**
   - Show DashboardSkeleton while data is loading
   - Handle loading state for multiple data sources
   - Ensure smooth transition to content

6. **Create dashboard layout structure**
   - Use responsive grid layout for dashboard sections
   - Arrange components in logical reading order
   - Ensure proper spacing between sections

7. **Add error handling**
   - Handle authentication errors (redirect to login)
   - Handle data fetching errors gracefully
   - Show appropriate error messages to user

### Dashboard Layout Structure

```
┌─────────────────────────────────────────────┐
│         Welcome Card (Full Width)           │
├─────────────────────────────────────────────┤
│                                             │
│         Stats Summary (Grid Cards)          │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│         Recent Orders Card                  │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│         Quick Actions (Button Grid)         │
│                                             │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Dashboard page renders all sections correctly
- Loading state displays properly before content
- Authentication is verified before rendering
- Responsive layout works on all screen sizes

### Verification Checklist
- [ ] Dashboard page accessible at `/portal/dashboard`
- [ ] All dashboard sections render in correct order
- [ ] Loading skeleton displays during data fetch
- [ ] Authenticated customers see personalized content
- [ ] Error states handled gracefully

---

## Task 18: Create Welcome Card

### Overview
Create the welcome card component that displays a personalized greeting to the customer. This card shows the customer's name, a friendly welcome message, and sets a positive tone for the portal experience.

### Dependencies
- Task 17: Create Dashboard Page
- Customer data available from authentication context

### Instructions

1. **Create welcome card component file**
   - Navigate to `frontend/components/storefront/portal/Dashboard/` directory
   - Create new file named `WelcomeCard.tsx`
   - This component displays personalized greeting

2. **Define component props interface**
   - Create props interface accepting customer name
   - Accept optional subtitle or message text
   - Make props strongly typed with TypeScript

3. **Import required dependencies**
   - Import Card components from UI library
   - Import icon components for visual elements
   - Import formatting utilities for name display

4. **Create welcome card structure**
   - Use Card component as container
   - Add gradient or accent background styling
   - Implement responsive padding and spacing

5. **Add greeting text**
   - Display "Welcome back, [Customer Name]!" as main heading
   - Use customer's first name for personalization
   - Handle missing name gracefully with fallback

6. **Add contextual message**
   - Include subtitle like "Here's what's happening with your account"
   - Keep message encouraging and informative
   - Use appropriate text sizing and color

7. **Add visual elements**
   - Include decorative icon or illustration
   - Use brand colors for accent elements
   - Ensure visual balance with text content

### Welcome Card Features

| Feature | Implementation |
|---------|----------------|
| Personalization | Display customer's first name |
| Greeting | "Welcome back, [Name]!" |
| Message | Contextual subtitle |
| Styling | Accent background with gradient |
| Icons | Decorative wave or sparkle icon |

### Expected Outcome
- Welcome card displays personalized greeting
- Customer name appears correctly formatted
- Card styling is visually appealing
- Responsive design works on mobile devices

### Verification Checklist
- [ ] Customer name displays correctly
- [ ] Greeting text is friendly and welcoming
- [ ] Card styling matches brand design
- [ ] Responsive layout on all screen sizes
- [ ] Fallback text shown when name unavailable

---

## Task 19: Create Stats Summary

### Overview
Create the statistics summary component that displays key metrics about the customer's account. Shows total orders count, pending orders, wishlist item count, and reviews written in a grid of stat cards with icons.

### Dependencies
- Task 17: Create Dashboard Page
- Order data service is available
- Wishlist functionality is implemented
- Reviews system is implemented

### Instructions

1. **Create stats summary component file**
   - Navigate to `frontend/components/storefront/portal/Dashboard/` directory
   - Create new file named `StatsSummary.tsx`
   - This component displays account statistics

2. **Define stats data structure**
   - Create interface for stats data (orders, pending, wishlist, reviews)
   - Accept stats data as component props
   - Include loading state handling

3. **Import required dependencies**
   - Import Card components from UI library
   - Import icon components (Package, Clock, Heart, Star)
   - Import TanStack Query for data fetching

4. **Implement data fetching**
   - Create query for fetching customer stats
   - Aggregate data from multiple sources if needed
   - Handle loading and error states

5. **Create stat card component**
   - Create reusable StatCard sub-component
   - Accept icon, label, value, and optional trend
   - Style with consistent card design

6. **Implement stats grid layout**
   - Use responsive grid (2x2 on mobile, 4x1 on desktop)
   - Ensure equal spacing between cards
   - Make cards touch-friendly for mobile

7. **Add stat cards for each metric**
   - Total Orders: Show all-time order count with Package icon
   - Pending Orders: Show orders in progress with Clock icon
   - Wishlist Items: Show saved products count with Heart icon
   - Reviews Written: Show review count with Star icon

8. **Add empty state handling**
   - Show zero values for new customers
   - Display encouraging message for empty stats
   - Provide links to relevant actions

### Stats Summary Layout

| Stat | Icon | Description | Color |
|------|------|-------------|-------|
| Total Orders | Package | All orders placed | Blue |
| Pending Orders | Clock | Orders being processed | Orange |
| Wishlist Items | Heart | Saved products | Red |
| Reviews Written | Star | Product reviews | Yellow |

### Expected Outcome
- Four stat cards display in responsive grid
- Each stat shows correct count with icon
- Loading state displays skeleton cards
- Stats update when data changes

### Verification Checklist
- [ ] All four stats display correctly
- [ ] Icons match each stat type
- [ ] Counts are accurate and update live
- [ ] Grid layout responsive on all devices
- [ ] Empty state handled for new customers

---

## Task 20: Create Recent Orders Card

### Overview
Create the recent orders card component that displays the three most recent customer orders. This provides quick access to order status and details without navigating to the full orders page.

### Dependencies
- Task 17: Create Dashboard Page
- Order data service is available
- Order card component design is planned

### Instructions

1. **Create recent orders component file**
   - Navigate to `frontend/components/storefront/portal/Dashboard/` directory
   - Create new file named `RecentOrders.tsx`
   - This component displays order previews

2. **Define component props interface**
   - Accept array of order objects
   - Include loading state prop
   - Accept optional limit prop (default 3)

3. **Import required dependencies**
   - Import Card components from UI library
   - Import order-related utilities and formatters
   - Import Link component for navigation
   - Import TanStack Query for data fetching

4. **Implement data fetching**
   - Create query to fetch recent orders
   - Limit results to 3 most recent
   - Sort by order date descending
   - Handle loading and error states

5. **Create card container**
   - Use Card component with header and content sections
   - Add "Recent Orders" title in header
   - Include section description if needed

6. **Create order item component**
   - Create OrderPreview sub-component for each order
   - Display order number and date
   - Show order status badge
   - Display order total in LKR format
   - Add "View Details" link

7. **Implement orders list**
   - Map through recent orders array
   - Render OrderPreview for each order
   - Add dividers between orders
   - Limit to 3 items maximum

8. **Add empty state handling**
   - Show message when no orders exist
   - Display "No orders yet" with friendly icon
   - Provide "Start Shopping" call-to-action button

### Order Preview Display

| Element | Content | Format |
|---------|---------|--------|
| Order Number | #12345 | Monospace font |
| Date | 3 days ago | Relative time |
| Status | Processing | Colored badge |
| Total | ₨ 5,250.00 | LKR format |
| Action | View Details | Link button |

### Expected Outcome
- Recent orders card displays up to 3 orders
- Each order shows key information clearly
- Empty state appears for customers without orders
- Orders link to full order details page

### Verification Checklist
- [ ] Card displays 3 most recent orders
- [ ] Order information formatted correctly
- [ ] Status badges display with correct colors
- [ ] View Details links navigate correctly
- [ ] Empty state shows for new customers

---

## Task 21: Create View All Orders Link

### Overview
Add a "View All Orders" link to the recent orders card that navigates customers to the full orders list page. This provides clear navigation path from the dashboard to the complete order history.

### Dependencies
- Task 20: Create Recent Orders Card
- Orders page route exists (created in Task 24)

### Instructions

1. **Locate recent orders component**
   - Open `RecentOrders.tsx` file from Task 20
   - Identify the card footer section
   - Prepare to add navigation link

2. **Import Link component**
   - Import Next.js Link component
   - Import arrow or chevron icon for visual indicator
   - Import any necessary styling utilities

3. **Add card footer section**
   - Create footer section in Card component
   - Apply appropriate padding and border styling
   - Center or right-align the link

4. **Implement view all link**
   - Create Link component pointing to `/portal/orders`
   - Use text "View All Orders" or "See All Orders"
   - Add right arrow icon for visual direction

5. **Style the link**
   - Use primary color for link text
   - Add hover state with underline or color change
   - Ensure sufficient click target size
   - Make it visually distinct but not overwhelming

6. **Add conditional rendering**
   - Only show link when orders exist
   - Hide link in empty state
   - Ensure link is keyboard accessible

### Link Placement

```
┌─────────────────────────────────────┐
│      Recent Orders                  │
├─────────────────────────────────────┤
│  Order #12345    ₨ 5,250.00        │
│  Order #12344    ₨ 3,100.00        │
│  Order #12343    ₨ 8,750.00        │
├─────────────────────────────────────┤
│        View All Orders →            │
└─────────────────────────────────────┘
```

### Expected Outcome
- View All link appears in card footer
- Link navigates to orders page correctly
- Link only visible when orders exist
- Styling matches overall design system

### Verification Checklist
- [ ] Link displays in recent orders card footer
- [ ] Link navigates to `/portal/orders` correctly
- [ ] Link hidden when no orders exist
- [ ] Hover states work correctly
- [ ] Keyboard navigation functional

---

## Task 22: Create Quick Actions

### Overview
Create the quick actions component that provides shortcut buttons for common customer actions. Includes buttons for tracking orders, browsing catalog, viewing wishlist, and contacting support.

### Dependencies
- Task 17: Create Dashboard Page
- Navigation routes are established
- Catalog and wishlist pages exist

### Instructions

1. **Create quick actions component file**
   - Navigate to `frontend/components/storefront/portal/Dashboard/` directory
   - Create new file named `QuickActions.tsx`
   - This component displays action buttons

2. **Define actions data structure**
   - Create array of action objects
   - Each action has title, description, icon, and link
   - Make structure easily extensible

3. **Import required dependencies**
   - Import Card components from UI library
   - Import Button component
   - Import icon components for each action
   - Import Link component for navigation

4. **Create action button component**
   - Create ActionButton sub-component
   - Accept icon, title, description, and href props
   - Style as card with hover effects
   - Implement as clickable link

5. **Define quick actions**
   - Track Order: Navigate to orders page with tracking focus
   - Browse Products: Navigate to product catalog
   - View Wishlist: Navigate to saved items page
   - Contact Support: Navigate to support or help page

6. **Implement actions grid layout**
   - Use responsive grid (1 column mobile, 2 columns tablet, 4 columns desktop)
   - Ensure equal spacing between action cards
   - Make buttons touch-friendly for mobile

7. **Style action buttons**
   - Use outlined or subtle filled style
   - Add icon at top with appropriate color
   - Display title and short description
   - Include hover and active states

### Quick Actions List

| Action | Icon | Destination | Description |
|--------|------|-------------|-------------|
| Track Orders | MapPin | /portal/orders | View order status and tracking |
| Browse Products | ShoppingBag | /products | Explore product catalog |
| View Wishlist | Heart | /portal/wishlist | See saved items |
| Contact Support | MessageCircle | /support | Get help and support |

### Expected Outcome
- Four action buttons display in responsive grid
- Each button navigates to correct destination
- Icons and text clearly indicate action purpose
- Hover states provide visual feedback

### Verification Checklist
- [ ] Four action buttons render correctly
- [ ] Grid layout responsive on all devices
- [ ] All navigation links work correctly
- [ ] Icons match action descriptions
- [ ] Hover states provide clear feedback

---

## Task 23: Create Dashboard Loading Skeleton

### Overview
Create loading skeleton component that displays while dashboard data is being fetched. This provides visual feedback and maintains layout structure during the loading state, improving perceived performance.

### Dependencies
- Task 17: Create Dashboard Page
- All dashboard components are designed
- Skeleton component library is available

### Instructions

1. **Create dashboard skeleton component file**
   - Navigate to `frontend/components/storefront/portal/Dashboard/` directory
   - Create new file named `DashboardSkeleton.tsx`
   - This component shows loading placeholders

2. **Import skeleton components**
   - Import Skeleton component from UI library
   - Import Card components for structure
   - Import any animation utilities

3. **Create welcome card skeleton**
   - Replicate WelcomeCard layout structure
   - Use skeleton for greeting text (large)
   - Use skeleton for subtitle text (medium)
   - Maintain same spacing and padding

4. **Create stats summary skeleton**
   - Replicate StatsSummary grid layout
   - Create four skeleton stat cards
   - Show skeleton icon, label, and value
   - Use same grid structure as actual stats

5. **Create recent orders skeleton**
   - Replicate RecentOrders card structure
   - Show skeleton for card header
   - Display three skeleton order items
   - Include skeleton for view all link

6. **Create quick actions skeleton**
   - Replicate QuickActions grid layout
   - Create four skeleton action buttons
   - Show skeleton icon and text areas
   - Maintain responsive grid structure

7. **Add skeleton animation**
   - Use pulse or shimmer animation
   - Apply consistent animation across all skeletons
   - Ensure smooth, non-distracting motion

8. **Implement full dashboard skeleton**
   - Combine all skeleton sections
   - Match exact layout of actual dashboard
   - Use same spacing and structure

### Skeleton Structure

```
┌─────────────────────────────────────────┐
│  ████████████ ███████                   │  (Welcome Card)
│  ███████ ██████████                     │
├─────────────────────────────────────────┤
│  ████  ████  ████  ████                │  (Stats Grid)
│  ████  ████  ████  ████                │
├─────────────────────────────────────────┤
│  ████████                               │  (Recent Orders)
│  ████████ ████                          │
│  ████████ ████                          │
├─────────────────────────────────────────┤
│  ████  ████  ████  ████                │  (Quick Actions)
└─────────────────────────────────────────┘
```

### Expected Outcome
- Skeleton matches dashboard layout exactly
- Loading animation is smooth and subtle
- Skeleton displays while data is fetching
- Smooth transition to actual content

### Verification Checklist
- [ ] Skeleton layout matches real dashboard
- [ ] All sections have skeleton placeholders
- [ ] Animation is smooth and non-distracting
- [ ] Skeleton disappears when data loads
- [ ] No layout shift during transition

---

## Summary

This document covered the creation of the customer portal dashboard and its core components. The dashboard provides a personalized overview of the customer's account with welcome greeting, statistics summary, recent orders preview, quick action shortcuts, and proper loading states. The next document will cover the orders list page with filtering and pagination functionality.

### Completed Tasks
- ✓ Task 17: Dashboard Page
- ✓ Task 18: Welcome Card
- ✓ Task 19: Stats Summary
- ✓ Task 20: Recent Orders Card
- ✓ Task 21: View All Orders Link
- ✓ Task 22: Quick Actions
- ✓ Task 23: Dashboard Loading Skeleton

### Next Steps
Proceed to [02_Tasks-24-36_Orders-List.md](02_Tasks-24-36_Orders-List.md) to create the orders list page with filtering, pagination, and empty states.
