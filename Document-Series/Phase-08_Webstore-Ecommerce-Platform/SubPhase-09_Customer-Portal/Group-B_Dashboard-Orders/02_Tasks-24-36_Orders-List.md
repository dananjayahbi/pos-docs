# Tasks 24-36: Orders List Page and Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** B - Dashboard & Orders  
> **Document:** 02 of 02  
> **Tasks Covered:** 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-23_Dashboard.md](01_Tasks-17-23_Dashboard.md)
- **→ Next Group:** [Group-C_Order-Details-Tracking](../Group-C_Order-Details-Tracking/)

---

## Document Overview

This document covers the creation of the orders list page where customers can view and filter their complete order history. It includes the orders page structure, header with title and description, status filter tabs for filtering by order status, paginated orders list, individual order cards displaying order information, pagination controls, and empty state for customers without orders.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 24 | Create Orders Page | Low | 20 min |
| 25 | Create Orders Header | Low | 15 min |
| 26 | Create Orders Filter | Medium | 30 min |
| 27 | Create Orders List | Medium | 30 min |
| 28 | Create Order Card | Medium | 35 min |
| 29 | Create Order Date Display | Low | 15 min |
| 30 | Create Order Status Badge | Low | 20 min |
| 31 | Create Order Total | Low | 15 min |
| 32 | Create View Order Button | Low | 15 min |
| 33 | Create Orders Pagination | Medium | 30 min |
| 34 | Create Empty Orders State | Low | 20 min |
| 35 | Create Start Shopping CTA | Low | 15 min |
| 36 | Verify Orders List | Low | 20 min |

---

## Task 24: Create Orders Page

### Overview
Create the main orders list page component that displays all customer orders with filtering and pagination capabilities. This page orchestrates the orders header, filter tabs, orders list, and pagination into a cohesive interface for viewing order history.

### Dependencies
- Task 16: Verify Portal Layout Navigation (from Group A)
- Task 21: Create View All Orders Link (from previous document)
- Order data service is implemented

### Instructions

1. **Create orders page file**
   - Navigate to `frontend/app/(storefront)/portal/orders/` directory
   - Create new file named `page.tsx`
   - This is the main route for customer orders list

2. **Import required dependencies**
   - Import orders components (OrdersHeader, OrdersFilter, OrdersList)
   - Import TanStack Query hooks for data fetching
   - Import pagination hooks and utilities
   - Import authentication hooks to verify customer access

3. **Define page metadata**
   - Export metadata object with page title
   - Set title to "My Orders | LankaCommerce Cloud"
   - Configure description for SEO purposes

4. **Implement search params handling**
   - Accept search params for filter status and pagination
   - Extract status filter from URL query parameters
   - Extract page number from URL query parameters
   - Provide default values for missing parameters

5. **Create orders component structure**
   - Define default export function `OrdersPage`
   - Use authentication hook to verify customer login
   - Implement data fetching with filter and pagination

6. **Implement data fetching logic**
   - Create query to fetch orders with status filter
   - Include pagination parameters (page, limit)
   - Sort orders by date descending (newest first)
   - Handle loading and error states

7. **Create page layout structure**
   - Add OrdersHeader component at top
   - Add OrdersFilter component below header
   - Add OrdersList component for order display
   - Add pagination controls at bottom
   - Handle empty state when no orders match filter

### Orders Page Layout

```
┌─────────────────────────────────────────────┐
│         Orders Header                       │
│         (Title & Description)               │
├─────────────────────────────────────────────┤
│         Orders Filter                       │
│         [All] [Pending] [Completed] [...]   │
├─────────────────────────────────────────────┤
│                                             │
│         Orders List                         │
│         (Order Cards)                       │
│                                             │
├─────────────────────────────────────────────┤
│         Pagination                          │
│         ← 1 2 3 ... 10 →                   │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Orders page renders with all sections
- URL parameters control filter and pagination
- Data fetching responds to URL changes
- Loading and empty states display correctly

### Verification Checklist
- [ ] Orders page accessible at `/portal/orders`
- [ ] All page sections render in correct order
- [ ] URL parameters control page state
- [ ] Data loads based on filters
- [ ] Authenticated access only

---

## Task 25: Create Orders Header

### Overview
Create the orders header component that displays the page title and description. This provides context for the orders list page and helps customers understand what information they're viewing.

### Dependencies
- Task 24: Create Orders Page

### Instructions

1. **Create orders header component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `OrdersHeader.tsx`
   - This component displays page title and description

2. **Import required dependencies**
   - Import heading and text components
   - Import any necessary layout utilities
   - Import icon components if adding visual elements

3. **Create header component structure**
   - Define default export function `OrdersHeader`
   - No props needed (static content)
   - Return semantic header element

4. **Add page title**
   - Use heading level 1 for page title
   - Set text to "My Orders"
   - Apply appropriate text size and weight
   - Use brand typography styles

5. **Add page description**
   - Include descriptive text below title
   - Use text like "View and track all your orders"
   - Apply muted text color
   - Keep description concise (one line)

6. **Implement responsive styling**
   - Adjust text sizes for mobile devices
   - Ensure proper spacing above and below header
   - Center or left-align based on design system

### Header Content

| Element | Content | Style |
|---------|---------|-------|
| Title | My Orders | H1, Bold, Large |
| Description | View and track all your orders | Muted, Regular |

### Expected Outcome
- Header displays page title prominently
- Description provides context clearly
- Styling matches design system
- Responsive across all screen sizes

### Verification Checklist
- [ ] Title displays as "My Orders"
- [ ] Description text is clear and helpful
- [ ] Spacing appropriate above and below
- [ ] Text sizes responsive on mobile
- [ ] Styling consistent with design system

---

## Task 26: Create Orders Filter

### Overview
Create the orders filter component that allows customers to filter orders by status. Displays tabs for All, Pending, Completed, and Cancelled orders, updating the URL and triggering data refetch when a filter is selected.

### Dependencies
- Task 24: Create Orders Page
- Order status types are defined in backend

### Instructions

1. **Create orders filter component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `OrdersFilter.tsx`
   - This component displays status filter tabs

2. **Define filter options structure**
   - Create array of filter options
   - Each option has label, value, and optional icon
   - Include: All, Pending, Completed, Cancelled statuses

3. **Import required dependencies**
   - Import Button or Tab components
   - Import Next.js router hooks (useRouter, useSearchParams)
   - Import any badge or count components
   - Import icon components for visual indicators

4. **Define component props interface**
   - Accept current active filter as prop
   - Accept optional order counts per status
   - Make props strongly typed

5. **Implement filter state management**
   - Get current search params from URL
   - Extract active filter from search params
   - Provide "all" as default filter

6. **Create filter change handler**
   - Create function to handle filter selection
   - Update URL search params with new filter
   - Reset pagination to page 1 when filter changes
   - Use Next.js router to update URL

7. **Render filter tabs**
   - Map through filter options array
   - Render button or tab for each option
   - Highlight active filter with different styling
   - Show order count badge if available

8. **Style filter tabs**
   - Use horizontal layout for tabs
   - Apply active state styling (border, background, or underline)
   - Ensure keyboard navigation support
   - Make tabs scrollable on mobile if needed

### Filter Options

| Filter | Label | Value | Description |
|--------|-------|-------|-------------|
| All | All Orders | all | Show all orders |
| Pending | Pending | pending | Orders being processed |
| Completed | Completed | completed | Delivered orders |
| Cancelled | Cancelled | cancelled | Cancelled orders |

### Expected Outcome
- Filter tabs display horizontally
- Active filter is visually highlighted
- Clicking filter updates URL and refetches data
- Smooth transition between filter states

### Verification Checklist
- [ ] All filter options visible
- [ ] Active filter highlighted correctly
- [ ] Clicking filter updates URL
- [ ] Page resets to 1 when filter changes
- [ ] Keyboard navigation works

---

## Task 27: Create Orders List

### Overview
Create the orders list component that displays a paginated list of order cards. This component maps through the orders array and renders individual order cards, handles loading states, and manages the empty state when no orders are found.

### Dependencies
- Task 24: Create Orders Page
- Task 26: Create Orders Filter
- Order card component will be created in Task 28

### Instructions

1. **Create orders list component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `OrdersList.tsx`
   - This component displays list of orders

2. **Define component props interface**
   - Accept array of order objects
   - Accept loading state boolean
   - Accept error state and message
   - Make props strongly typed with order type

3. **Import required dependencies**
   - Import OrderCard component (from Task 28)
   - Import loading skeleton components
   - Import EmptyOrders component (from Task 34)
   - Import any list layout utilities

4. **Implement loading state**
   - Check loading prop value
   - Render skeleton cards while loading
   - Show 3-5 skeleton cards to fill space
   - Match skeleton structure to actual order cards

5. **Implement error state**
   - Check error prop value
   - Display error message if error exists
   - Provide retry action button
   - Style error state clearly

6. **Implement empty state**
   - Check if orders array is empty and not loading
   - Render EmptyOrders component
   - Provide clear messaging and call-to-action
   - Style empty state appropriately

7. **Render orders list**
   - Map through orders array when data exists
   - Render OrderCard for each order
   - Apply consistent spacing between cards
   - Use proper list semantics

8. **Add list container styling**
   - Use vertical stack layout
   - Apply consistent spacing between items
   - Ensure proper margins and padding
   - Make list scrollable if needed

### List States

| State | Display | Component |
|-------|---------|-----------|
| Loading | Skeleton cards | Custom skeleton |
| Error | Error message | Error state |
| Empty | No orders found | EmptyOrders |
| Success | Order cards | OrderCard list |

### Expected Outcome
- Orders display in vertical list
- Loading state shows skeleton cards
- Empty state shows helpful message
- Error state displays clearly

### Verification Checklist
- [ ] Orders render as list of cards
- [ ] Loading state shows skeletons
- [ ] Empty state displays correctly
- [ ] Error state handles failures
- [ ] Spacing consistent between items

---

## Task 28: Create Order Card

### Overview
Create the order card component that displays summary information for a single order. Shows order number, order date, order status, order total in LKR format, number of items, and a view details button. This is the main visual component in the orders list.

### Dependencies
- Task 27: Create Orders List
- Order data type is defined
- Currency formatting utilities available

### Instructions

1. **Create order card component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `OrderCard.tsx`
   - This component displays individual order information

2. **Define component props interface**
   - Accept order object as prop
   - Order should include: id, number, date, status, total, items count
   - Make props strongly typed with order type

3. **Import required dependencies**
   - Import Card components from UI library
   - Import sub-components (OrderDate, OrderStatusBadge, OrderTotal)
   - Import Link component for navigation
   - Import icon components for visual elements

4. **Create card structure**
   - Use Card component as container
   - Divide into sections: header, content, footer
   - Apply consistent padding and spacing

5. **Implement card header**
   - Display order number prominently (e.g., "#12345")
   - Include OrderDate component showing order date
   - Use monospace font for order number
   - Align header elements appropriately

6. **Implement card content**
   - Display OrderStatusBadge component
   - Show number of items in order (e.g., "3 items")
   - Include any relevant order icons
   - Organize information clearly

7. **Implement card footer**
   - Display OrderTotal component showing LKR amount
   - Include "View Details" button linking to order details page
   - Align total and button appropriately
   - Ensure sufficient spacing

8. **Add interaction states**
   - Implement hover effect on entire card
   - Add subtle border or shadow on hover
   - Make card feel clickable and interactive
   - Ensure good contrast for readability

### Order Card Layout

```
┌─────────────────────────────────────┐
│  #12345              3 days ago     │ (Header)
├─────────────────────────────────────┤
│  [Processing]                       │ (Status)
│  3 items                            │ (Items count)
├─────────────────────────────────────┤
│  Total: ₨ 5,250.00  [View Details] │ (Footer)
└─────────────────────────────────────┘
```

### Expected Outcome
- Order card displays all key information
- Card is visually organized and scannable
- Hover states provide feedback
- View Details button navigates correctly

### Verification Checklist
- [ ] Order number displays correctly
- [ ] Date shows in readable format
- [ ] Status badge displays with color
- [ ] Total shows in LKR format
- [ ] View Details button navigates to order details

---

## Task 29: Create Order Date Display

### Overview
Create the order date display component that formats and displays the order date in a user-friendly way. Shows relative time for recent orders (e.g., "2 days ago") and absolute date for older orders (e.g., "Jan 15, 2025").

### Dependencies
- Task 28: Create Order Card

### Instructions

1. **Create order date component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `OrderDate.tsx`
   - This component displays formatted order date

2. **Define component props interface**
   - Accept date as prop (Date object or ISO string)
   - Accept optional format preference
   - Make props strongly typed

3. **Import required dependencies**
   - Import date formatting library (date-fns or similar)
   - Import relative time utilities
   - Import any necessary type definitions

4. **Implement date formatting logic**
   - Parse date string to Date object if needed
   - Calculate time difference from current date
   - Determine if relative or absolute format appropriate

5. **Implement relative time display**
   - Show relative time for orders within last 7 days
   - Use formats like "Just now", "2 hours ago", "3 days ago"
   - Ensure accurate calculation

6. **Implement absolute date display**
   - Show absolute date for orders older than 7 days
   - Use format like "Jan 15, 2025" or "15/01/2025"
   - Consider Sri Lankan date preferences

7. **Add tooltip with full date**
   - Include tooltip showing exact date and time
   - Display on hover over date text
   - Use full format: "January 15, 2025 at 2:30 PM"
   - Include timezone (Asia/Colombo)

8. **Style date display**
   - Use muted text color for subtle appearance
   - Apply appropriate font size
   - Ensure readability on all backgrounds

### Date Format Rules

| Time Difference | Display Format | Example |
|----------------|----------------|---------|
| < 1 hour | Minutes ago | "30 minutes ago" |
| < 24 hours | Hours ago | "5 hours ago" |
| < 7 days | Days ago | "3 days ago" |
| ≥ 7 days | Absolute date | "Jan 15, 2025" |

### Expected Outcome
- Dates display in user-friendly format
- Recent orders show relative time
- Older orders show absolute date
- Tooltip provides exact date/time

### Verification Checklist
- [ ] Relative time works for recent orders
- [ ] Absolute date displays for older orders
- [ ] Tooltip shows full date and time
- [ ] Date calculation is accurate
- [ ] Text color and size appropriate

---

## Task 30: Create Order Status Badge

### Overview
Create the order status badge component that displays the current order status with appropriate color coding. Shows statuses like Pending, Processing, Shipped, Delivered, Cancelled with distinct colors and icons.

### Dependencies
- Task 28: Create Order Card
- Order status types defined in system

### Instructions

1. **Create order status badge component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `OrderStatusBadge.tsx`
   - This component displays order status

2. **Define component props interface**
   - Accept status as prop (string or enum)
   - Accept optional size variant
   - Make props strongly typed

3. **Import required dependencies**
   - Import Badge component from UI library
   - Import icon components for each status
   - Import color utilities or theme tokens

4. **Define status configurations**
   - Create mapping of status to color and icon
   - Include: Pending, Processing, Shipped, Delivered, Cancelled
   - Define appropriate colors for each status

5. **Implement status badge rendering**
   - Use Badge component as base
   - Apply color based on status mapping
   - Include icon matching status type
   - Display status text in title case

6. **Apply color scheme**
   - Pending: Orange/Yellow (waiting state)
   - Processing: Blue (in progress)
   - Shipped: Purple/Indigo (in transit)
   - Delivered: Green (success)
   - Cancelled: Red/Gray (failed/cancelled)

7. **Add icon for each status**
   - Pending: Clock icon
   - Processing: Package icon
   - Shipped: Truck icon
   - Delivered: Check/CircleCheck icon
   - Cancelled: X/XCircle icon

8. **Implement responsive sizing**
   - Provide size variants if needed
   - Ensure badge readable on mobile
   - Maintain icon-text balance

### Status Badge Colors

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| Pending | Orange | Clock | Awaiting processing |
| Processing | Blue | Package | Being prepared |
| Shipped | Purple | Truck | In transit |
| Delivered | Green | Check | Successfully delivered |
| Cancelled | Red | X | Order cancelled |

### Expected Outcome
- Status badge displays with correct color
- Icon matches status appropriately
- Badge is readable and clear
- Colors are distinct and intuitive

### Verification Checklist
- [ ] Badge displays correct color for status
- [ ] Icon matches status type
- [ ] Text is readable on background
- [ ] Sizing appropriate in card context
- [ ] All status types handled

---

## Task 31: Create Order Total

### Overview
Create the order total component that displays the order total amount in Sri Lankan Rupees (LKR) with proper formatting. Shows currency symbol (₨), thousands separators, and two decimal places for cents.

### Dependencies
- Task 28: Create Order Card
- Currency formatting utilities available

### Instructions

1. **Create order total component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `OrderTotal.tsx`
   - This component displays formatted order total

2. **Define component props interface**
   - Accept amount as prop (number)
   - Accept optional currency code (default LKR)
   - Accept optional display style (inline or block)
   - Make props strongly typed

3. **Import required dependencies**
   - Import currency formatting utilities
   - Import number formatting functions
   - Import any necessary type definitions

4. **Implement LKR formatting**
   - Format number with two decimal places
   - Add thousands separators (comma or space)
   - Prepend LKR currency symbol (₨)
   - Handle negative amounts if applicable

5. **Create formatting function**
   - Convert amount to number if string
   - Use Intl.NumberFormat or custom formatter
   - Apply Sri Lankan locale formatting
   - Return formatted string

6. **Implement component rendering**
   - Display formatted amount
   - Use appropriate text weight and size
   - Apply semantic HTML (strong tag for emphasis)
   - Include "Total:" label if needed

7. **Add styling**
   - Use prominent text size for visibility
   - Apply appropriate font weight (medium or semibold)
   - Use default or accent color
   - Ensure good contrast ratio

8. **Handle edge cases**
   - Handle zero amounts
   - Handle very large amounts
   - Handle null or undefined values
   - Provide fallback display

### Formatting Examples

| Amount | Formatted Display |
|--------|-------------------|
| 1250.00 | ₨ 1,250.00 |
| 50000.50 | ₨ 50,000.50 |
| 125000.00 | ₨ 125,000.00 |
| 0.00 | ₨ 0.00 |

### Expected Outcome
- Total displays in LKR format
- Thousands separators included
- Two decimal places always shown
- Currency symbol present

### Verification Checklist
- [ ] Amount formatted with ₨ symbol
- [ ] Thousands separators display correctly
- [ ] Two decimal places always shown
- [ ] Large amounts formatted properly
- [ ] Zero amounts handled correctly

---

## Task 32: Create View Order Button

### Overview
Create the view order details button component that links from the order card to the full order details page. Provides clear call-to-action for customers to see complete order information including items, shipping details, and tracking.

### Dependencies
- Task 28: Create Order Card
- Order details page route exists (from Group C)

### Instructions

1. **Create view order button component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `ViewOrderButton.tsx`
   - This component displays navigation button

2. **Define component props interface**
   - Accept order ID as prop
   - Accept optional button variant
   - Accept optional button size
   - Make props strongly typed

3. **Import required dependencies**
   - Import Button component from UI library
   - Import Link component from Next.js
   - Import arrow or chevron icon
   - Import any necessary utilities

4. **Create button component**
   - Render Button component as Link
   - Set href to `/portal/orders/[orderId]`
   - Use order ID prop to build dynamic URL
   - Display "View Details" or "View Order" text

5. **Add visual indicator**
   - Include right arrow or chevron icon
   - Position icon after button text
   - Use appropriate icon size
   - Ensure icon color matches text

6. **Implement button styling**
   - Use outline or ghost variant
   - Apply primary color scheme
   - Ensure sufficient padding
   - Make touch-friendly for mobile

7. **Add interaction states**
   - Implement hover state styling
   - Add focus state for keyboard navigation
   - Include active state for click feedback
   - Ensure good accessibility

### Button Variants

| Variant | Style | Use Case |
|---------|-------|----------|
| Primary | Filled button | Main action |
| Secondary | Outline button | Secondary action |
| Ghost | Text button | Subtle action |

### Expected Outcome
- Button displays clearly in order card
- Button links to correct order details page
- Hover and focus states work properly
- Button accessible via keyboard

### Verification Checklist
- [ ] Button displays with correct text
- [ ] Button navigates to order details page
- [ ] Order ID passed correctly in URL
- [ ] Hover states provide feedback
- [ ] Keyboard navigation functional

---

## Task 33: Create Orders Pagination

### Overview
Create the pagination component for the orders list that allows customers to navigate through multiple pages of orders. Displays page numbers, previous/next buttons, and handles URL-based pagination state.

### Dependencies
- Task 27: Create Orders List
- Pagination data available from API response
- URL search params for state management

### Instructions

1. **Create orders pagination component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `OrdersPagination.tsx`
   - This component displays pagination controls

2. **Define component props interface**
   - Accept current page number
   - Accept total pages count
   - Accept total results count
   - Accept optional page size
   - Make props strongly typed

3. **Import required dependencies**
   - Import pagination components from UI library
   - Import Next.js router hooks
   - Import button components
   - Import icon components (arrows)

4. **Implement pagination state management**
   - Get current page from URL search params
   - Create function to update page in URL
   - Preserve filter params when changing page
   - Scroll to top when page changes

5. **Create page change handlers**
   - Create handler for previous page button
   - Create handler for next page button
   - Create handler for specific page number
   - Validate page number ranges

6. **Implement pagination UI**
   - Display previous button (disabled on first page)
   - Display page numbers with current page highlighted
   - Display next button (disabled on last page)
   - Show ellipsis for large page ranges

7. **Add results summary**
   - Display text like "Showing 1-10 of 50 orders"
   - Calculate range based on page and page size
   - Update summary when page changes
   - Position above or below page numbers

8. **Implement responsive design**
   - Show full pagination on desktop
   - Show compact pagination on mobile
   - Consider showing only prev/next on small screens
   - Ensure touch-friendly button sizes

### Pagination Layout

```
Desktop:
Showing 1-10 of 50 orders
[←] 1 [2] 3 ... 5 [→]

Mobile:
Page 2 of 5
[←] [→]
```

### Expected Outcome
- Pagination controls display below orders list
- Page changes update URL and refetch data
- Previous/next buttons work correctly
- Current page is highlighted

### Verification Checklist
- [ ] Pagination displays correctly
- [ ] Page numbers clickable and functional
- [ ] Previous/next buttons work
- [ ] Current page highlighted
- [ ] Disabled states on first/last page
- [ ] URL updates when page changes
- [ ] Results summary accurate

---

## Task 34: Create Empty Orders State

### Overview
Create the empty orders state component that displays when a customer has no orders or when a filter returns no results. Provides friendly messaging and encourages customers to start shopping.

### Dependencies
- Task 27: Create Orders List
- Empty state design patterns established

### Instructions

1. **Create empty orders component file**
   - Navigate to `frontend/components/storefront/portal/Orders/` directory
   - Create new file named `EmptyOrders.tsx`
   - This component displays empty state

2. **Define component props interface**
   - Accept optional filter status to customize message
   - Accept optional custom message text
   - Make props strongly typed

3. **Import required dependencies**
   - Import icon components for empty state
   - Import Button component for call-to-action
   - Import Link component for navigation
   - Import any layout utilities

4. **Create empty state container**
   - Use centered flexbox or grid layout
   - Apply generous padding for visual space
   - Ensure proper vertical centering

5. **Add empty state illustration**
   - Include relevant icon (package, shopping bag, or custom)
   - Use large icon size for visibility
   - Apply muted color to icon
   - Consider using illustration library

6. **Add heading message**
   - Display contextual heading based on filter
   - Use "No orders yet" for new customers
   - Use "No [status] orders" for filtered views
   - Keep heading concise and clear

7. **Add descriptive text**
   - Include encouraging message below heading
   - Customize message based on context
   - Keep text friendly and helpful
   - Suggest next action

8. **Add call-to-action**
   - Include "Start Shopping" button (from Task 35)
   - Link button to products catalog
   - Use primary button styling
   - Position button prominently

### Empty State Messages

| Context | Heading | Description |
|---------|---------|-------------|
| No orders | No orders yet | Start shopping to place your first order |
| No pending | No pending orders | All your orders have been processed |
| No completed | No completed orders | Orders will appear here once delivered |
| No cancelled | No cancelled orders | You haven't cancelled any orders |

### Expected Outcome
- Empty state displays when no orders found
- Message is contextual to filter applied
- Call-to-action button encourages shopping
- Design is visually balanced and friendly

### Verification Checklist
- [ ] Empty state shows when no orders
- [ ] Message appropriate for context
- [ ] Icon displays correctly
- [ ] Call-to-action button present
- [ ] Layout centered and balanced

---

## Task 35: Create Start Shopping CTA

### Overview
Create the Start Shopping call-to-action button component that appears in the empty orders state. This button encourages customers without orders to browse the product catalog and make their first purchase.

### Dependencies
- Task 34: Create Empty Orders State
- Product catalog route exists

### Instructions

1. **Locate empty orders component**
   - Open `EmptyOrders.tsx` file from Task 34
   - Identify call-to-action button section
   - Prepare to implement button component

2. **Import required dependencies**
   - Import Button component from UI library
   - Import Link component from Next.js
   - Import shopping bag or arrow icon
   - Ensure proper typing

3. **Create CTA button component**
   - Render Button component wrapped in Link
   - Set href to `/products` or main catalog page
   - Use "Start Shopping" or "Browse Products" text
   - Apply primary button styling

4. **Add visual elements**
   - Include shopping bag icon before or after text
   - Use appropriate icon size
   - Ensure icon color matches button text
   - Maintain visual balance

5. **Style the button**
   - Use primary color for emphasis
   - Apply large button size for prominence
   - Ensure sufficient padding
   - Make button stand out visually

6. **Implement hover and focus states**
   - Add hover effect (color change or elevation)
   - Include focus ring for keyboard navigation
   - Implement active state for click
   - Ensure good accessibility

7. **Add optional secondary action**
   - Consider adding "Learn More" link below button
   - Link to help or about page
   - Use subtle styling for secondary action
   - Keep focus on primary CTA

### CTA Button Properties

| Property | Value |
|----------|-------|
| Text | Start Shopping |
| Icon | ShoppingBag |
| Variant | Primary/Filled |
| Size | Large |
| Link | /products |

### Expected Outcome
- CTA button displays prominently
- Button links to product catalog correctly
- Styling emphasizes importance
- Interaction states work properly

### Verification Checklist
- [ ] Button displays with correct text
- [ ] Button links to catalog page
- [ ] Icon displays appropriately
- [ ] Hover states provide feedback
- [ ] Button is keyboard accessible

---

## Task 36: Verify Orders List

### Overview
Perform comprehensive verification of the orders list functionality to ensure all components work together correctly. Test filtering, pagination, empty states, and navigation to order details.

### Dependencies
- Task 35: Create Start Shopping CTA (all previous tasks complete)
- Test data available in development environment
- Backend API endpoints functional

### Instructions

1. **Set up test environment**
   - Ensure development server is running
   - Verify backend API is accessible
   - Confirm test customer account with orders exists
   - Prepare test scenarios

2. **Test orders page navigation**
   - Navigate to `/portal/orders` from dashboard
   - Verify page loads without errors
   - Check that authentication is required
   - Confirm page title and metadata correct

3. **Test orders list display**
   - Verify orders display in correct order (newest first)
   - Check all order information displays correctly
   - Confirm order cards render properly
   - Test with different numbers of orders

4. **Test status filter functionality**
   - Click each filter tab (All, Pending, Completed, Cancelled)
   - Verify URL updates with filter parameter
   - Confirm filtered results display correctly
   - Check empty state when filter has no results

5. **Test pagination functionality**
   - Navigate through multiple pages
   - Verify page numbers update correctly
   - Test previous and next buttons
   - Confirm URL updates with page parameter
   - Check disabled states on first and last pages

6. **Test order card interactions**
   - Click "View Details" button on order card
   - Verify navigation to order details page
   - Confirm correct order ID passed in URL
   - Test back navigation returns to orders list

7. **Test loading states**
   - Verify skeleton cards display while loading
   - Check smooth transition to loaded content
   - Test loading state on filter change
   - Confirm loading state on page change

8. **Test empty states**
   - Create or use account with no orders
   - Verify empty state displays correctly
   - Test "Start Shopping" button navigation
   - Check empty state for filtered views

9. **Test date and currency formatting**
   - Verify order dates display correctly
   - Check relative time for recent orders
   - Confirm LKR currency format correct
   - Test tooltip on date hover

10. **Test responsive design**
    - View orders list on mobile device or narrow viewport
    - Verify layout adjusts appropriately
    - Check touch targets are adequate
    - Test horizontal scrolling if present

11. **Test error handling**
    - Simulate API error
    - Verify error state displays correctly
    - Test retry functionality if present
    - Confirm user-friendly error messages

12. **Document test results**
    - Note any issues or bugs found
    - Record browser and device tested
    - List any accessibility concerns
    - Create bug reports for failures

### Verification Test Cases

| Test Case | Expected Result | Pass/Fail |
|-----------|----------------|-----------|
| Orders display | Orders list shows all orders | □ |
| Filter by status | Correct orders for each filter | □ |
| Pagination works | Can navigate pages | □ |
| View order details | Navigates to order page | □ |
| Empty state | Shows when no orders | □ |
| Loading state | Skeletons display | □ |
| Date format | Dates display correctly | □ |
| Currency format | LKR format correct | □ |
| Mobile responsive | Works on mobile | □ |
| Error handling | Errors display properly | □ |

### Expected Outcome
- All orders list functionality works correctly
- No console errors or warnings
- Performance is acceptable
- User experience is smooth and intuitive

### Verification Checklist
- [ ] Orders page loads successfully
- [ ] All filters work correctly
- [ ] Pagination functions properly
- [ ] Order cards display correctly
- [ ] Navigation to details works
- [ ] Empty states display properly
- [ ] Loading states work smoothly
- [ ] Responsive design verified
- [ ] Error handling tested
- [ ] No critical bugs found

---

## Summary

This document covered the creation of the orders list page with comprehensive filtering, pagination, and display functionality. The orders page allows customers to view their complete order history, filter by status, navigate through pages, and access detailed order information. Combined with the dashboard from the previous document, customers now have full visibility into their orders and account activity.

### Completed Tasks
- ✓ Task 24: Orders Page
- ✓ Task 25: Orders Header
- ✓ Task 26: Orders Filter
- ✓ Task 27: Orders List
- ✓ Task 28: Order Card
- ✓ Task 29: Order Date Display
- ✓ Task 30: Order Status Badge
- ✓ Task 31: Order Total
- ✓ Task 32: View Order Button
- ✓ Task 33: Orders Pagination
- ✓ Task 34: Empty Orders State
- ✓ Task 35: Start Shopping CTA
- ✓ Task 36: Verify Orders List

### Next Steps
Proceed to [Group-C_Order-Details-Tracking](../Group-C_Order-Details-Tracking/) to create the order details page with tracking information and order item displays.
