# Tasks 15-26: Page, Cards, and Filters

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales Orders UI  
> **Group:** B - Order Listing & Filters  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-32_Table-API.md](02_Tasks-27-32_Table-API.md)

---

## Document Overview

This document covers the creation of the Orders List page with comprehensive filtering capabilities. It establishes the main orders listing interface, including summary cards for key metrics (total orders, pending, shipped today, revenue), and a robust filtering system (search, status filter, date range, payment status).

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create Orders List Page | Low | 20 min |
| 16 | Create Orders Header | Low | 15 min |
| 17 | Create Order Summary Cards | Medium | 30 min |
| 18 | Create Total Orders Card | Low | 15 min |
| 19 | Create Pending Orders Card | Low | 15 min |
| 20 | Create Shipped Today Card | Low | 15 min |
| 21 | Create Revenue Card (LKR) | Low | 20 min |
| 22 | Create Order Filters Bar | Medium | 25 min |
| 23 | Create Order Search | Low | 20 min |
| 24 | Create Status Filter | Medium | 25 min |
| 25 | Create Date Range Filter | Medium | 30 min |
| 26 | Create Payment Status Filter | Medium | 25 min |

---

## Task 15: Create Orders List Page

### Overview
Create the main Orders List page component that serves as the container for the entire orders management interface. This page aggregates all order-related components including the header, summary cards, filters, and order table, providing a comprehensive view for managing sales orders.

### Dependencies
- SubPhase-09 (Inventory Management UI) must be complete
- Dashboard layout structure established
- Route configuration ready

### Instructions

1. **Create page directory structure**
   - Navigate to `frontend/app/(dashboard)/orders/` directory
   - Create the directory if it doesn't exist
   - This follows Next.js App Router conventions

2. **Create page component file**
   - Create `page.tsx` in the orders directory
   - This becomes the `/orders` route
   - Set up TypeScript React Server Component structure

3. **Define page metadata**
   - Export metadata object for SEO
   - Set title to "Sales Orders | LCC ERP"
   - Add description for search engines
   - Configure Open Graph tags if needed

4. **Implement page layout structure**
   - Create main container with proper spacing
   - Use consistent padding with other dashboard pages
   - Apply background color matching dashboard theme

5. **Import required components**
   - Import OrdersHeader (Task 16)
   - Import OrderSummaryCards (Task 17)
   - Import OrderFiltersBar (Task 22)
   - Import OrdersTable (Task 27)

6. **Compose page structure**
   - Place OrdersHeader at top
   - Add OrderSummaryCards below header
   - Add OrderFiltersBar for filtering options
   - Place OrdersTable as main content area

7. **Add loading and error states**
   - Implement loading skeleton or spinner
   - Add error boundary for graceful failures
   - Consider suspense boundaries for async data

### Page Structure

```
┌──────────────────────────────────────────────┐
│  OrdersHeader                                │
├──────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│  │ Total  │ │Pending │ │Shipped │ │Revenue ││
│  │ Orders │ │ Orders │ │ Today  │ │  Card  ││
│  └────────┘ └────────┘ └────────┘ └────────┘│
├──────────────────────────────────────────────┤
│  OrderFiltersBar                             │
│  [Search] [Status▼] [Date Range] [Payment▼] │
├──────────────────────────────────────────────┤
│                                              │
│  OrdersTable                                 │
│  (Order listing with pagination)             │
│                                              │
└──────────────────────────────────────────────┘
```

### Page Component Architecture

| Component | Position | Purpose |
|-----------|----------|---------|
| OrdersHeader | Top | Title, breadcrumb, actions |
| OrderSummaryCards | Below header | Key metrics display |
| OrderFiltersBar | Above table | Filtering controls |
| OrdersTable | Main content | Order data listing |

### URL Structure

| Route | Page Component | Purpose |
|-------|----------------|---------|
| `/orders` | `page.tsx` | Main listing page |
| `/orders/[id]` | Detail page (other SubPhase) | Single order view |
| `/orders/new` | Create page (other SubPhase) | New order creation |

### Metadata Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| title | "Sales Orders \| LCC ERP" | Browser tab title |
| description | "Manage sales orders..." | SEO description |
| robots | "noindex" (dashboard) | Search engine rules |

### State Management Considerations

| State Type | Implementation | Purpose |
|------------|----------------|---------|
| Filter State | URL search params | Shareable filtered views |
| Selected Orders | Local state or Zustand | Bulk actions |
| Pagination | URL search params | Navigation persistence |

### Expected Outcome
- Functional orders list page at `/orders` route
- Proper component composition and layout
- SEO metadata configured
- Loading and error states handled
- Consistent with dashboard design patterns

### Verification Checklist
- [ ] `frontend/app/(dashboard)/orders/page.tsx` created
- [ ] Page accessible at `/orders` route
- [ ] Metadata configured correctly
- [ ] All child components imported
- [ ] Page layout matches design
- [ ] Loading states implemented
- [ ] Error boundaries in place
- [ ] TypeScript types defined

---

## Task 16: Create Orders Header

### Overview
Create the OrdersHeader component that displays the page title, breadcrumb navigation, and primary action buttons. This header provides context and quick access to order creation and bulk operations.

### Dependencies
- Task 15: Create Orders List Page

### Instructions

1. **Create header component file**
   - Navigate to `frontend/components/orders/` directory
   - Create directory if it doesn't exist
   - Create `OrdersHeader.tsx` file

2. **Import required dependencies**
   - Import breadcrumb components from UI library
   - Import button components
   - Import icons (Plus, Download, Upload)
   - Import Next.js Link component

3. **Define component structure**
   - Create container with flexbox layout
   - Left section: breadcrumb and title
   - Right section: action buttons

4. **Implement breadcrumb navigation**
   - Home → Orders
   - Use Link components for navigation
   - Style active vs inactive breadcrumb items
   - Add separator icons between items

5. **Add page title**
   - Display "Sales Orders" as h1
   - Apply proper heading hierarchy
   - Use consistent typography with dashboard

6. **Create action buttons group**
   - "New Order" button (primary, with Plus icon)
   - "Export" button (secondary, with Download icon)
   - "Import" button (secondary, with Upload icon)
   - Group buttons with proper spacing

7. **Make header responsive**
   - Stack vertically on mobile
   - Horizontal layout on tablet and desktop
   - Adjust button sizes for mobile

### Header Layout

```
┌────────────────────────────────────────────────────┐
│  Home > Orders                                     │
│                                                    │
│  Sales Orders              [New Order] [Export]   │
│                                   [Import]         │
└────────────────────────────────────────────────────┘
```

### Component Sections

| Section | Content | Alignment |
|---------|---------|-----------|
| Left | Breadcrumb + Title | Left |
| Right | Action buttons | Right |

### Breadcrumb Structure

| Item | Type | Link | Icon |
|------|------|------|------|
| Home | Link | `/dashboard` | Home icon |
| Separator | Static | - | ChevronRight |
| Orders | Current | - | - |

### Action Buttons

| Button | Type | Action | Icon | Route/Function |
|--------|------|--------|------|----------------|
| New Order | Primary | Create | Plus | `/orders/new` |
| Export | Secondary | Export data | Download | Export function |
| Import | Secondary | Import data | Upload | Import modal |

### Button Styling

| Button Type | Classes | Purpose |
|-------------|---------|---------|
| Primary | `bg-blue-600 hover:bg-blue-700 text-white` | Main action |
| Secondary | `border border-gray-300 hover:bg-gray-50` | Alt actions |

### Responsive Breakpoints

```
Mobile (< 768px)
├── Layout: Stack vertically
├── Buttons: Full width, stacked
└── Spacing: Reduced gaps

Tablet & Desktop (≥ 768px)
├── Layout: Flex row with space-between
├── Buttons: Inline, auto width
└── Spacing: Standard gaps
```

### Expected Outcome
- Functional header with navigation context
- Clear page title and breadcrumb
- Accessible action buttons for key operations
- Responsive layout for all screen sizes

### Verification Checklist
- [ ] `frontend/components/orders/OrdersHeader.tsx` created
- [ ] Breadcrumb navigation implemented
- [ ] Page title displayed correctly
- [ ] All action buttons present with icons
- [ ] Links navigate to correct routes
- [ ] Responsive layout on mobile and desktop
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 17: Create Order Summary Cards

### Overview
Create the OrderSummaryCards component that displays a grid of metric cards showing key order statistics. This component serves as a container for individual summary cards (Total Orders, Pending Orders, Shipped Today, Revenue), providing a quick overview of order performance.

### Dependencies
- Task 15: Create Orders List Page
- Tasks 18-21 (Individual card components)

### Instructions

1. **Create summary cards component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `OrderSummaryCards.tsx` file
   - Set up component structure

2. **Import individual card components**
   - Import TotalOrdersCard (Task 18)
   - Import PendingOrdersCard (Task 19)
   - Import ShippedTodayCard (Task 20)
   - Import RevenueCard (Task 21)

3. **Define component props**
   - Accept summary data object as prop
   - Define TypeScript interface for data structure
   - Include loading state prop

4. **Create grid layout**
   - Use CSS Grid or Flexbox
   - 4 columns on desktop
   - 2 columns on tablet
   - 1 column on mobile
   - Equal gaps between cards

5. **Pass data to child cards**
   - Destructure summary data
   - Pass relevant data to each card
   - Handle loading states
   - Handle missing or null data

6. **Implement loading skeleton**
   - Create placeholder cards while loading
   - Use shimmer effect for visual feedback
   - Match card dimensions

7. **Add error handling**
   - Display error message if data fetch fails
   - Provide retry mechanism
   - Show fallback values

### Grid Layout Structure

```
┌────────────────────────────────────────────────────┐
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │  Total   │ │ Pending  │ │ Shipped  │ │Revenue ││
│  │  Orders  │ │  Orders  │ │  Today   │ │  Card  ││
│  │          │ │          │ │          │ │        ││
│  │  1,234   │ │   45     │ │   12     │ │  LKR   ││
│  │          │ │          │ │          │ │ 245K   ││
│  └──────────┘ └──────────┘ └──────────┘ └────────┘│
└────────────────────────────────────────────────────┘
```

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | OrderSummaryData | Yes | Summary metrics data |
| loading | boolean | No | Loading state flag |
| error | Error \| null | No | Error object if failed |

### OrderSummaryData Interface

| Field | Type | Description |
|-------|------|-------------|
| totalOrders | number | Total order count |
| pendingOrders | number | Orders awaiting processing |
| shippedToday | number | Orders shipped today |
| totalRevenue | number | Total revenue in LKR |
| revenueChange | number | % change from previous period |

### Responsive Grid Configuration

```
Mobile (< 640px)
└── grid-cols-1 (Single column)

Tablet (640px - 1024px)
└── grid-cols-2 (Two columns)

Desktop (≥ 1024px)
└── grid-cols-4 (Four columns)
```

### Loading Skeleton Structure

| Element | Styling | Purpose |
|---------|---------|---------|
| Card Shell | `bg-gray-100 animate-pulse` | Placeholder |
| Title Line | `h-4 bg-gray-200 rounded` | Title skeleton |
| Value Line | `h-8 bg-gray-200 rounded` | Value skeleton |

### Data Flow Diagram

```
OrdersListPage
    ↓ (fetch summary data)
OrderSummaryCards
    ↓ (distribute data)
┌──────────┬───────────┬──────────┬──────────┐
│  Total   │  Pending  │ Shipped  │ Revenue  │
│  Card    │   Card    │  Card    │  Card    │
└──────────┴───────────┴──────────┴──────────┘
```

### Expected Outcome
- Grid layout containing four summary cards
- Responsive design adapting to screen size
- Proper data distribution to child cards
- Loading states with skeleton UI
- Error handling with user feedback

### Verification Checklist
- [ ] `frontend/components/orders/OrderSummaryCards.tsx` created
- [ ] Grid layout implemented with responsive columns
- [ ] All four card components imported
- [ ] Data props interface defined
- [ ] Loading skeleton implemented
- [ ] Error states handled
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 18: Create Total Orders Card

### Overview
Create the TotalOrdersCard component that displays the total number of orders in the system. This card shows the count with a visual indicator and optional trend information (increase/decrease from previous period).

### Dependencies
- Task 17: Create Order Summary Cards

### Instructions

1. **Create card component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `TotalOrdersCard.tsx` file
   - Set up component structure

2. **Define component props**
   - Accept `count` prop (number)
   - Accept optional `trend` prop (percentage change)
   - Accept optional `loading` prop (boolean)

3. **Design card layout**
   - Card container with padding and border
   - Icon section with background color
   - Title text ("Total Orders")
   - Large count display
   - Optional trend indicator

4. **Add appropriate icon**
   - Use ShoppingBag or Package icon
   - Apply blue color scheme
   - Size appropriately (24px or similar)
   - Place in corner or top of card

5. **Format count display**
   - Display count as large number
   - Add thousand separators (1,234)
   - Use prominent typography
   - Apply appropriate font weight

6. **Implement trend indicator**
   - Show percentage change if provided
   - Green for positive, red for negative
   - Include up/down arrow icon
   - Display as badge or small text

7. **Apply card styling**
   - White background with subtle shadow
   - Rounded corners for modern look
   - Hover effect for interactivity
   - Responsive padding

### Card Visual Structure

```
┌────────────────────┐
│  📦 Total Orders   │
│                    │
│      1,234         │
│                    │
│  ↑ 12% from last   │
└────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| count | number | Yes | - | Total order count |
| trend | number | No | - | % change (positive/negative) |
| loading | boolean | No | false | Loading state |
| onClick | function | No | - | Click handler (optional) |

### Card Layout Elements

| Element | Position | Styling | Purpose |
|---------|----------|---------|---------|
| Icon | Top-left | Blue background | Visual identifier |
| Title | Top | Gray text, small | Card label |
| Count | Center | Large, bold | Main metric |
| Trend | Bottom | Green/red badge | Change indicator |

### Icon Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Icon | ShoppingBag/Package | Represents orders |
| Size | 24px | Visible but not overwhelming |
| Color | Blue-600 | Brand color |
| Background | Blue-100 | Subtle highlight |

### Trend Display Logic

| Condition | Display | Color | Icon |
|-----------|---------|-------|------|
| trend > 0 | "+12%" | Green | ArrowUp |
| trend < 0 | "-5%" | Red | ArrowDown |
| trend === 0 | "0%" | Gray | Minus |
| trend === null | Hidden | - | - |

### Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Background | `bg-white` | Clean appearance |
| Border | `border border-gray-200` | Subtle definition |
| Shadow | `shadow-sm hover:shadow-md` | Depth and interaction |
| Padding | `p-6` | Internal spacing |
| Border Radius | `rounded-lg` | Modern aesthetic |

### Number Formatting

| Input | Formatted Output |
|-------|------------------|
| 1234 | 1,234 |
| 45678 | 45,678 |
| 1234567 | 1,234,567 |

### Expected Outcome
- Attractive card displaying total orders count
- Clear visual hierarchy with icon and typography
- Trend indicator showing performance change
- Responsive design with hover effects
- Proper number formatting

### Verification Checklist
- [ ] `frontend/components/orders/TotalOrdersCard.tsx` created
- [ ] Count prop displayed with formatting
- [ ] Icon included with proper styling
- [ ] Trend indicator implemented
- [ ] Card styling applied (shadow, border, radius)
- [ ] Hover effects work correctly
- [ ] Loading state handled
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 19: Create Pending Orders Card

### Overview
Create the PendingOrdersCard component that displays the count of orders awaiting processing or fulfillment. This card highlights orders that require attention, using visual cues (orange/yellow theme) to indicate urgency.

### Dependencies
- Task 17: Create Order Summary Cards

### Instructions

1. **Create card component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `PendingOrdersCard.tsx` file
   - Set up component structure similar to Task 18

2. **Define component props**
   - Accept `count` prop (number of pending orders)
   - Accept optional `urgent` prop (high priority count)
   - Accept optional `loading` prop (boolean)

3. **Design card layout**
   - Follow same structure as TotalOrdersCard
   - Card container with padding
   - Icon section with warning color theme
   - Title: "Pending Orders"
   - Large count display

4. **Add appropriate icon**
   - Use Clock or HourglassIcon
   - Apply orange/yellow color scheme
   - Indicates waiting/pending status
   - Size: 24px

5. **Format count display**
   - Display pending count prominently
   - Add thousand separators if needed
   - Use warning color (orange-600) for text
   - Bold font weight for emphasis

6. **Add urgent orders indicator**
   - Show count of urgent/high-priority orders
   - Display as red badge or small text
   - Format: "5 urgent" or similar
   - Only show if urgent count > 0

7. **Apply warning theme styling**
   - Orange/yellow color scheme
   - Icon background: orange-100
   - Count text: orange-600
   - Urgent badge: red-100 background

### Card Visual Structure

```
┌────────────────────┐
│  ⏰ Pending Orders │
│                    │
│        45          │
│                    │
│  🔴 5 urgent       │
└────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| count | number | Yes | - | Pending orders count |
| urgent | number | No | 0 | Urgent orders count |
| loading | boolean | No | false | Loading state |
| onClick | function | No | - | Click handler |

### Color Scheme (Warning Theme)

| Element | Color | Class | Purpose |
|---------|-------|-------|---------|
| Icon Background | Orange-100 | `bg-orange-100` | Subtle highlight |
| Icon | Orange-600 | `text-orange-600` | Main icon color |
| Count | Orange-600 | `text-orange-600` | Attention-grabbing |
| Urgent Badge BG | Red-100 | `bg-red-100` | High priority bg |
| Urgent Badge Text | Red-600 | `text-red-600` | High priority text |

### Icon Options

| Icon | Usage | Meaning |
|------|-------|---------|
| Clock | Primary choice | Waiting/pending |
| Hourglass | Alternative | Time-sensitive |
| AlertCircle | Alternative | Requires attention |

### Urgent Indicator Logic

| Condition | Display | Styling |
|-----------|---------|---------|
| urgent > 0 | "5 urgent" | Red badge visible |
| urgent === 0 | Hidden | No badge |
| urgent === null | Hidden | No badge |

### Card Interactive States

| State | Styling | Purpose |
|-------|---------|---------|
| Default | `shadow-sm` | Normal state |
| Hover | `shadow-md cursor-pointer` | Interactive feedback |
| Loading | `opacity-50 animate-pulse` | Data fetching |

### Expected Outcome
- Warning-themed card for pending orders
- Clear count display with orange theme
- Urgent orders highlighted in red badge
- Visual distinction from other metric cards
- Interactive hover effects

### Verification Checklist
- [ ] `frontend/components/orders/PendingOrdersCard.tsx` created
- [ ] Pending count displayed with orange theme
- [ ] Clock/hourglass icon with orange background
- [ ] Urgent indicator implemented
- [ ] Warning color scheme applied
- [ ] Card styling consistent with other cards
- [ ] Loading state handled
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 20: Create Shipped Today Card

### Overview
Create the ShippedTodayCard component that displays the count of orders shipped within the current day. This card uses a green theme to indicate successful completion and provides a positive performance indicator.

### Dependencies
- Task 17: Create Order Summary Cards

### Instructions

1. **Create card component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `ShippedTodayCard.tsx` file
   - Set up component structure

2. **Define component props**
   - Accept `count` prop (number of shipped orders today)
   - Accept optional `target` prop (daily shipping goal)
   - Accept optional `loading` prop (boolean)

3. **Design card layout**
   - Follow consistent card structure
   - Icon section with success color theme
   - Title: "Shipped Today"
   - Large count display
   - Optional progress indicator

4. **Add appropriate icon**
   - Use Truck or Package icon with checkmark
   - Apply green color scheme
   - Indicates successful shipment
   - Size: 24px

5. **Format count display**
   - Display today's shipment count
   - Use green color (green-600)
   - Bold typography
   - Add thousand separators if needed

6. **Implement target/goal indicator**
   - Show progress toward daily target if provided
   - Display as "12 of 20" or progress bar
   - Calculate percentage completion
   - Use green for on-track, yellow for behind

7. **Apply success theme styling**
   - Green color scheme throughout
   - Icon background: green-100
   - Count text: green-600
   - Progress indicator with green fill

### Card Visual Structure

```
┌────────────────────┐
│  🚚 Shipped Today  │
│                    │
│        12          │
│                    │
│  12 of 20 (60%)    │
└────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| count | number | Yes | - | Orders shipped today |
| target | number | No | - | Daily shipping goal |
| loading | boolean | No | false | Loading state |
| onClick | function | No | - | Click handler |

### Color Scheme (Success Theme)

| Element | Color | Class | Purpose |
|---------|-------|-------|---------|
| Icon Background | Green-100 | `bg-green-100` | Success highlight |
| Icon | Green-600 | `text-green-600` | Success indicator |
| Count | Green-600 | `text-green-600` | Achievement |
| Progress Bar | Green-500 | `bg-green-500` | Progress fill |
| Progress BG | Green-100 | `bg-green-100` | Progress track |

### Icon Options

| Icon | Usage | Meaning |
|------|-------|---------|
| Truck | Primary choice | Shipping/delivery |
| Package + Check | Alternative | Completed shipment |
| CheckCircle | Alternative | Success status |

### Target/Goal Display

| Format | When to Use | Example |
|--------|-------------|---------|
| "X of Y" | Target provided | "12 of 20" |
| Percentage | Target provided | "60%" |
| Progress Bar | Target provided | Visual bar |
| Count Only | No target | "12" |

### Progress Calculation

| Condition | Display Color | Meaning |
|-----------|---------------|---------|
| count >= target | Green | Goal achieved |
| count >= target * 0.7 | Green | On track |
| count < target * 0.7 | Yellow | Behind schedule |

### Expected Outcome
- Success-themed card for shipped orders
- Green color scheme indicating positive action
- Today's shipment count prominently displayed
- Optional progress toward daily target
- Encouraging visual feedback

### Verification Checklist
- [ ] `frontend/components/orders/ShippedTodayCard.tsx` created
- [ ] Shipped count displayed with green theme
- [ ] Truck/package icon with green background
- [ ] Target/goal indicator implemented
- [ ] Success color scheme applied
- [ ] Progress calculation logic correct
- [ ] Loading state handled
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 21: Create Revenue Card (LKR)

### Overview
Create the RevenueCard component that displays total revenue in Sri Lankan Rupees (LKR). This card shows financial performance with currency formatting, trend indicators, and comparison to previous periods. Uses a purple/indigo theme to differentiate from other metrics.

### Dependencies
- Task 17: Create Order Summary Cards

### Instructions

1. **Create card component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `RevenueCard.tsx` file
   - Set up component structure

2. **Define component props**
   - Accept `amount` prop (revenue in LKR)
   - Accept optional `previousAmount` prop (for comparison)
   - Accept optional `period` prop (e.g., "today", "this month")
   - Accept optional `loading` prop (boolean)

3. **Design card layout**
   - Follow consistent card structure
   - Icon section with financial theme
   - Title: "Total Revenue" or "Revenue (Today)"
   - Large formatted amount display
   - Trend/comparison indicator

4. **Add appropriate icon**
   - Use CurrencyDollar or Wallet icon
   - Apply purple/indigo color scheme
   - Represents financial metrics
   - Size: 24px

5. **Implement LKR currency formatting**
   - Format number with thousand separators
   - Add "LKR" prefix or suffix
   - Handle decimals (2 decimal places)
   - Example: "LKR 245,678.00"

6. **Add revenue formatting utilities**
   - For large amounts, use abbreviations
   - 245678 → "LKR 245.7K"
   - 2456780 → "LKR 2.46M"
   - Show full amount on hover/tooltip

7. **Implement comparison logic**
   - Calculate change from previous period
   - Display percentage increase/decrease
   - Show green for growth, red for decline
   - Include up/down arrow icon

8. **Apply financial theme styling**
   - Purple/indigo color scheme
   - Icon background: purple-100
   - Amount text: purple-600
   - Professional appearance

### Card Visual Structure

```
┌────────────────────┐
│  💰 Total Revenue  │
│                    │
│   LKR 245.7K       │
│                    │
│  ↑ 18.5% vs last   │
└────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| amount | number | Yes | - | Revenue amount (LKR) |
| previousAmount | number | No | - | Previous period amount |
| period | string | No | "Total" | Time period label |
| loading | boolean | No | false | Loading state |

### Color Scheme (Financial Theme)

| Element | Color | Class | Purpose |
|---------|-------|-------|---------|
| Icon Background | Purple-100 | `bg-purple-100` | Financial highlight |
| Icon | Purple-600 | `text-purple-600` | Money indicator |
| Amount | Purple-600 | `text-purple-600` | Primary metric |
| Trend Up | Green-600 | `text-green-600` | Positive growth |
| Trend Down | Red-600 | `text-red-600` | Negative growth |

### Currency Formatting Rules

| Amount | Display (Short) | Display (Full) |
|--------|----------------|----------------|
| 1500 | LKR 1.5K | LKR 1,500.00 |
| 245678 | LKR 245.7K | LKR 245,678.00 |
| 2456780 | LKR 2.46M | LKR 2,456,780.00 |
| 24567800 | LKR 24.57M | LKR 24,567,800.00 |

### Abbreviation Logic

| Range | Suffix | Example |
|-------|--------|---------|
| < 1,000 | None | "LKR 750" |
| 1,000 - 999,999 | K | "LKR 245.7K" |
| 1,000,000 - 999,999,999 | M | "LKR 2.46M" |
| ≥ 1,000,000,000 | B | "LKR 1.23B" |

### Comparison Display

| Change | Display | Color | Icon |
|--------|---------|-------|------|
| +18.5% | "↑ 18.5%" | Green | ArrowUp |
| -5.2% | "↓ 5.2%" | Red | ArrowDown |
| 0% | "No change" | Gray | Minus |
| N/A | Hidden | - | - |

### Period Labels

| Prop Value | Display Title |
|------------|---------------|
| "today" | "Revenue (Today)" |
| "week" | "Revenue (This Week)" |
| "month" | "Revenue (This Month)" |
| undefined | "Total Revenue" |

### Expected Outcome
- Professional revenue card with LKR formatting
- Clear display of financial performance
- Trend indicators showing growth/decline
- Abbreviated amounts for readability
- Purple theme distinguishing financial data

### Verification Checklist
- [ ] `frontend/components/orders/RevenueCard.tsx` created
- [ ] Revenue displayed with LKR formatting
- [ ] Currency icon with purple theme
- [ ] Amount abbreviation logic implemented
- [ ] Comparison/trend indicator working
- [ ] Tooltip showing full amount
- [ ] Color scheme applied correctly
- [ ] Loading state handled
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 22: Create Order Filters Bar

### Overview
Create the OrderFiltersBar component that contains all filtering controls for the orders list. This component serves as a container for search, status filter, date range filter, and payment status filter, organizing them in a responsive layout with clear visual grouping.

### Dependencies
- Task 15: Create Orders List Page
- Tasks 23-26 (Individual filter components)

### Instructions

1. **Create filters bar component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `OrderFiltersBar.tsx` file
   - Set up component structure

2. **Import filter components**
   - Import OrderSearch (Task 23)
   - Import StatusFilter (Task 24)
   - Import DateRangeFilter (Task 25)
   - Import PaymentStatusFilter (Task 26)

3. **Define component props**
   - Accept `filters` state object
   - Accept `onFilterChange` callback function
   - Accept optional `onClearFilters` function
   - Define TypeScript interface for filters

4. **Design filters layout**
   - Horizontal layout on desktop
   - Responsive stacking on mobile
   - Group related filters together
   - Consistent spacing between filters

5. **Create filters container**
   - White background with border
   - Padding for internal spacing
   - Rounded corners
   - Shadow for depth

6. **Implement filter state management**
   - Accept controlled filter values
   - Emit changes via callbacks
   - Handle URL search params (optional)
   - Provide clear filters functionality

7. **Add "Clear All Filters" button**
   - Display when any filter is active
   - Reset all filters to default state
   - Show filter count badge
   - Position at end of filters bar

8. **Make filters bar responsive**
   - Single row on large screens
   - Wrap to multiple rows on tablets
   - Stack vertically on mobile
   - Maintain usability at all sizes

### Filters Bar Layout

```
┌────────────────────────────────────────────────────────┐
│  [🔍 Search Orders...]  [Status ▼]  [Date Range ▼]    │
│  [Payment Status ▼]     [Clear All Filters (3)]       │
└────────────────────────────────────────────────────────┘
```

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| filters | OrderFilters | Yes | Current filter values |
| onFilterChange | function | Yes | Filter change handler |
| onClearFilters | function | No | Clear all filters |
| loading | boolean | No | Disable during loading |

### OrderFilters Interface

| Field | Type | Description |
|-------|------|-------------|
| search | string | Search query |
| status | string[] | Selected statuses |
| dateRange | { from: Date, to: Date } | Date range |
| paymentStatus | string[] | Payment statuses |

### Filter Components Layout

| Filter | Width | Position | Priority |
|--------|-------|----------|----------|
| Search | 40% / flex-grow | Left | High |
| Status | 15% / fixed | Center-left | Medium |
| Date Range | 20% / fixed | Center-right | Medium |
| Payment | 15% / fixed | Right | Medium |
| Clear Button | Auto | Far right | Low |

### Responsive Behavior

```
Desktop (≥ 1024px)
└── Single row, all filters visible

Tablet (768px - 1023px)
├── Row 1: Search, Status
└── Row 2: Date Range, Payment, Clear

Mobile (< 768px)
├── Stack vertically
├── Full width inputs
└── Fixed order: Search → Status → Date → Payment → Clear
```

### Clear Filters Button Logic

| Condition | Display | Badge |
|-----------|---------|-------|
| Any filter active | Show button | Count of active filters |
| All filters default | Hide button | - |

### Active Filter Count

| Filter | Counts as Active When |
|--------|----------------------|
| Search | search.length > 0 |
| Status | status.length > 0 |
| Date Range | dateRange is set |
| Payment | paymentStatus.length > 0 |

### Filter Bar Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Background | `bg-white` | Clean container |
| Border | `border border-gray-200` | Separation |
| Padding | `p-4 md:p-6` | Internal spacing |
| Gap | `gap-3 md:gap-4` | Filter spacing |
| Border Radius | `rounded-lg` | Modern look |
| Shadow | `shadow-sm` | Subtle depth |

### Expected Outcome
- Organized filters bar containing all filter controls
- Responsive layout adapting to screen size
- Clear visual grouping of filters
- Active filters display with clear button
- Smooth filter state management

### Verification Checklist
- [ ] `frontend/components/orders/OrderFiltersBar.tsx` created
- [ ] All filter components imported and rendered
- [ ] Filters interface defined with TypeScript
- [ ] Filter change callbacks implemented
- [ ] Clear all filters button functional
- [ ] Active filter count displayed
- [ ] Responsive layout on all screen sizes
- [ ] Component exports properly
- [ ] Filter state management working

---

## Task 23: Create Order Search

### Overview
Create the OrderSearch component that provides real-time search functionality for orders. Users can search by order number, customer name, customer email, or product name. The component features debounced input to optimize performance and displays search results count.

### Dependencies
- Task 22: Create Order Filters Bar

### Instructions

1. **Create search component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `OrderSearch.tsx` file
   - Set up component structure

2. **Import required dependencies**
   - Import Search icon from icon library
   - Import debounce utility or custom hook
   - Import input component from UI library

3. **Define component props**
   - Accept `value` prop (current search query)
   - Accept `onChange` callback function
   - Accept optional `placeholder` prop
   - Accept optional `disabled` prop

4. **Create search input field**
   - Use text input with search icon
   - Left-aligned search icon
   - Placeholder text guidance
   - Right-aligned clear button (when has value)

5. **Implement debounce functionality**
   - Debounce search input (300-500ms)
   - Avoid excessive API calls
   - Show loading indicator during debounce
   - Use useDebounce hook or lodash debounce

6. **Add clear search button**
   - Display X icon when input has value
   - Clear input and reset search on click
   - Position at right of input field
   - Animate appearance/disappearance

7. **Implement keyboard shortcuts**
   - Focus on "/" key press (optional)
   - Clear on Escape key
   - Submit/search on Enter key
   - Improve power user experience

8. **Add accessibility features**
   - Proper ARIA labels
   - Role="search" for container
   - Keyboard navigation support
   - Screen reader announcements

### Search Component Structure

```
┌─────────────────────────────────────┐
│ 🔍 Search by order #, customer... ✕│
└─────────────────────────────────────┘
   ↑ Icon    ↑ Input field    ↑ Clear
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | "" | Current search query |
| onChange | function | Yes | - | Search change handler |
| placeholder | string | No | "Search orders..." | Input placeholder |
| disabled | boolean | No | false | Disable input |
| loading | boolean | No | false | Show loading state |

### Search Functionality

| User Action | Component Behavior |
|-------------|-------------------|
| Type in input | Debounce 300ms, then emit onChange |
| Click clear (X) | Clear input, emit onChange("") |
| Press Enter | Trigger immediate search (bypass debounce) |
| Press Escape | Clear input if has value, blur if empty |
| Press "/" | Focus input (global shortcut) |

### Searchable Fields

| Field | Example | Priority |
|-------|---------|----------|
| Order Number | "ORD-12345" | Highest |
| Customer Name | "John Doe" | High |
| Customer Email | "john@example.com" | High |
| Product Name | "Widget Pro" | Medium |
| Reference Number | "REF-789" | Medium |

### Debounce Implementation

```
User types → Wait 300ms → No more input → Trigger onChange

Typing "abc":
a → wait 300ms
ab → reset timer, wait 300ms
abc → reset timer, wait 300ms → onChange("abc")
```

### Input Styling

| Element | Classes | Purpose |
|---------|---------|---------|
| Container | `relative w-full md:w-96` | Responsive width |
| Input | `pl-10 pr-10 py-2 border rounded-lg` | Padding for icons |
| Search Icon | `absolute left-3 top-1/2 -translate-y-1/2` | Position left |
| Clear Button | `absolute right-3 top-1/2 -translate-y-1/2` | Position right |

### Clear Button Logic

| Condition | Display | Action |
|-----------|---------|--------|
| value.length > 0 | Show | Clear search |
| value.length === 0 | Hide | - |
| disabled | Hide | - |

### Accessibility Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| role | "search" | Semantic meaning |
| aria-label | "Search orders" | Screen reader label |
| aria-describedby | "search-help" | Additional context |
| aria-busy | loading state | Loading indicator |

### Expected Outcome
- Functional search input with icon
- Debounced search to optimize performance
- Clear button when input has value
- Keyboard shortcuts for power users
- Accessible to screen readers

### Verification Checklist
- [ ] `frontend/components/orders/OrderSearch.tsx` created
- [ ] Search icon positioned correctly
- [ ] Debounce implemented (300-500ms)
- [ ] Clear button appears when input has value
- [ ] onChange callback fires correctly
- [ ] Enter key triggers immediate search
- [ ] Escape key clears input
- [ ] Accessibility attributes present
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 24: Create Status Filter

### Overview
Create the StatusFilter component that allows users to filter orders by their status (Pending, Processing, Shipped, Delivered, Cancelled). This multi-select dropdown displays status options with color-coded badges and allows selecting multiple statuses simultaneously.

### Dependencies
- Task 22: Create Order Filters Bar

### Instructions

1. **Create status filter component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `StatusFilter.tsx` file
   - Set up component structure

2. **Import required dependencies**
   - Import dropdown/select components from UI library
   - Import Checkbox component for multi-select
   - Import status badge component (if exists)
   - Import status-related icons

3. **Define component props**
   - Accept `value` prop (array of selected statuses)
   - Accept `onChange` callback function
   - Accept optional `disabled` prop
   - Define OrderStatus type or enum

4. **Define order status options**
   - Pending (orange/yellow badge)
   - Processing (blue badge)
   - Shipped (purple badge)
   - Delivered (green badge)
   - Cancelled (red badge)
   - Return status colors and labels

5. **Create dropdown trigger button**
   - Display "Status" label with dropdown icon
   - Show count of selected statuses (e.g., "Status (3)")
   - Apply active state styling when filters applied
   - Indicate dropdown state (open/closed)

6. **Implement dropdown content**
   - List all status options with checkboxes
   - Display each status with color badge
   - Allow multiple selection
   - Include "Select All" and "Clear" options

7. **Add visual status indicators**
   - Color-coded dots or badges for each status
   - Consistent with status display in table
   - Legend showing what each color means
   - Accessible color combinations

8. **Implement multi-select logic**
   - Toggle individual statuses on checkbox click
   - Update selected array in parent state
   - "Select All" checks all options
   - "Clear" unchecks all options

### Status Filter Structure

```
┌─────────────────┐
│ Status (2) ▼    │ ← Trigger button
└─────────────────┘
        ↓ (opens dropdown)
┌───────────────────────────┐
│ Select All  |  Clear      │
├───────────────────────────┤
│ ☑ 🟠 Pending              │
│ ☑ 🔵 Processing           │
│ ☐ 🟣 Shipped              │
│ ☐ 🟢 Delivered            │
│ ☐ 🔴 Cancelled            │
└───────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string[] | Yes | [] | Selected status IDs |
| onChange | function | Yes | - | Selection change handler |
| disabled | boolean | No | false | Disable filter |
| placeholder | string | No | "Status" | Button label |

### Order Status Options

| Status | Label | Color | Badge Class | Icon |
|--------|-------|-------|-------------|------|
| pending | Pending | Orange | `bg-orange-100 text-orange-700` | Clock |
| processing | Processing | Blue | `bg-blue-100 text-blue-700` | Loader |
| shipped | Shipped | Purple | `bg-purple-100 text-purple-700` | Truck |
| delivered | Delivered | Green | `bg-green-100 text-green-700` | CheckCircle |
| cancelled | Cancelled | Red | `bg-red-100 text-red-700` | XCircle |

### Trigger Button States

| State | Display | Styling |
|-------|---------|---------|
| No selection | "Status ▼" | Default gray |
| 1 selected | "Status (1) ▼" | Blue tint |
| Multiple | "Status (3) ▼" | Blue tint |
| All selected | "Status (All) ▼" | Blue tint |

### Dropdown Layout

| Section | Content | Purpose |
|---------|---------|---------|
| Header | Select All \| Clear buttons | Bulk actions |
| Divider | Horizontal line | Visual separation |
| Options List | Status checkboxes with badges | Selection options |

### Multi-Select Logic

| Action | Behavior |
|--------|----------|
| Click status checkbox | Toggle that status in selection array |
| Click "Select All" | Add all statuses to array |
| Click "Clear" | Empty the selection array |
| Click outside | Close dropdown, preserve selection |

### Badge Components

Each status option displays a badge:
```
☑ [🟠 Pending]
     ↑ Badge with color
```

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Keyboard Nav | Arrow keys to navigate options |
| Space/Enter | Toggle checkbox selection |
| Screen Reader | Announce selections and changes |
| Focus Management | Return focus to trigger on close |

### Expected Outcome
- Multi-select dropdown for order statuses
- Color-coded status badges for visual clarity
- Selection count displayed on trigger button
- Bulk "Select All" and "Clear" actions
- Accessible keyboard and screen reader support

### Verification Checklist
- [ ] `frontend/components/orders/StatusFilter.tsx` created
- [ ] All five status options defined with colors
- [ ] Multi-select checkboxes functional
- [ ] Selected count displayed on button
- [ ] "Select All" and "Clear" buttons work
- [ ] Status badges styled consistently
- [ ] Dropdown closes on outside click
- [ ] onChange callback fires correctly
- [ ] Keyboard navigation works
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 25: Create Date Range Filter

### Overview
Create the DateRangeFilter component that allows users to filter orders by date range. This component provides a calendar-based date picker with preset ranges (Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month, Custom Range) for quick filtering.

### Dependencies
- Task 22: Create Order Filters Bar

### Instructions

1. **Create date range filter component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `DateRangeFilter.tsx` file
   - Set up component structure

2. **Import required dependencies**
   - Import date picker library (e.g., react-date-range, date-fns)
   - Import Calendar icon
   - Import dropdown component
   - Import date formatting utilities

3. **Define component props**
   - Accept `value` prop (date range object)
   - Accept `onChange` callback function
   - Accept optional `disabled` prop
   - Define DateRange interface

4. **Define preset date ranges**
   - Today
   - Yesterday
   - Last 7 Days
   - Last 30 Days
   - This Month
   - Last Month
   - Custom Range (opens calendar)

5. **Create dropdown trigger button**
   - Display Calendar icon and label
   - Show selected date range
   - Format: "Jan 20 - Jan 26, 2026"
   - Show "Date Range" when no selection

6. **Implement dropdown content**
   - Left panel: Preset range buttons
   - Right panel: Calendar picker
   - Apply and Cancel buttons at bottom
   - Clear selection option

7. **Add calendar date picker**
   - Use date range picker library
   - Allow selecting start and end dates
   - Highlight selected range
   - Disable future dates (optional)

8. **Implement date range logic**
   - Calculate preset range dates
   - Handle timezone considerations
   - Validate start date before end date
   - Format dates consistently

### Date Range Filter Structure

```
┌─────────────────────────────┐
│ 📅 Jan 20 - Jan 26, 2026 ▼ │ ← Trigger
└─────────────────────────────┘
              ↓ (opens dropdown)
┌─────────────────────────────────────────┐
│ Presets         │   Calendar            │
│ • Today         │   [Calendar Widget]   │
│ • Yesterday     │                       │
│ • Last 7 Days   │   Jan 2026            │
│ • Last 30 Days  │  S M T W T F S        │
│ • This Month    │     1  2  3  4  5     │
│ • Last Month    │  6  7  8  9 10 11 12  │
│ • Custom Range  │ ...                   │
│                                          │
│         [Cancel]  [Apply]                │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | DateRange \| null | Yes | null | Selected date range |
| onChange | function | Yes | - | Range change handler |
| disabled | boolean | No | false | Disable filter |
| maxDate | Date | No | Today | Maximum selectable date |

### DateRange Interface

| Field | Type | Description |
|-------|------|-------------|
| from | Date | Start date |
| to | Date | End date |
| preset | string | Preset name (optional) |

### Preset Date Ranges

| Preset | Calculation | Example (Today: Jan 26) |
|--------|-------------|-------------------------|
| Today | Start: Today, End: Today | Jan 26 - Jan 26 |
| Yesterday | Start: Yesterday, End: Yesterday | Jan 25 - Jan 25 |
| Last 7 Days | Start: 6 days ago, End: Today | Jan 20 - Jan 26 |
| Last 30 Days | Start: 29 days ago, End: Today | Dec 28 - Jan 26 |
| This Month | Start: 1st of month, End: Today | Jan 1 - Jan 26 |
| Last Month | Start: 1st of prev month, End: Last day of prev month | Dec 1 - Dec 31 |
| Custom | User selects | Variable |

### Trigger Button Display

| Condition | Display Text |
|-----------|--------------|
| No selection | "Date Range" |
| Same day | "Jan 26, 2026" |
| Different days | "Jan 20 - Jan 26, 2026" |
| Long range | "Jan 1 - Dec 31, 2026" |

### Date Format Options

| Context | Format | Example |
|---------|--------|---------|
| Short | MMM DD | Jan 26 |
| Medium | MMM DD, YYYY | Jan 26, 2026 |
| Long | MMMM DD, YYYY | January 26, 2026 |
| Range | MMM DD - MMM DD, YYYY | Jan 20 - Jan 26, 2026 |

### Dropdown Layout Sections

| Section | Width | Content |
|---------|-------|---------|
| Presets Panel | 200px | Preset buttons list |
| Calendar Panel | 300px | Date picker widget |
| Actions Bar | Full width | Cancel and Apply buttons |

### Validation Rules

| Rule | Behavior |
|------|----------|
| Start > End | Swap dates or show error |
| Future dates | Disable or show warning |
| Max range | Limit to 1 year (optional) |

### State Management

| State | Type | Purpose |
|-------|------|---------|
| isOpen | boolean | Dropdown visibility |
| tempRange | DateRange | Working selection |
| confirmedRange | DateRange | Applied selection |

### Expected Outcome
- Functional date range filter with calendar picker
- Quick preset ranges for common scenarios
- Visual calendar for custom range selection
- Proper date formatting and display
- Validation of date range logic

### Verification Checklist
- [ ] `frontend/components/orders/DateRangeFilter.tsx` created
- [ ] All preset ranges defined and calculated correctly
- [ ] Calendar picker integrated and functional
- [ ] Selected range displayed on trigger button
- [ ] Apply and Cancel buttons work correctly
- [ ] Date validation implemented
- [ ] Clear filter option available
- [ ] Dropdown closes on outside click
- [ ] onChange callback fires with correct format
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 26: Create Payment Status Filter

### Overview
Create the PaymentStatusFilter component that allows users to filter orders by payment status (Paid, Unpaid, Partially Paid, Refunded, Failed). This multi-select dropdown displays payment statuses with color-coded indicators and enables selecting multiple payment statuses simultaneously.

### Dependencies
- Task 22: Create Order Filters Bar

### Instructions

1. **Create payment status filter component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `PaymentStatusFilter.tsx` file
   - Set up component structure similar to StatusFilter

2. **Import required dependencies**
   - Import dropdown/select components
   - Import Checkbox component
   - Import payment status icons
   - Import badge components

3. **Define component props**
   - Accept `value` prop (array of selected payment statuses)
   - Accept `onChange` callback function
   - Accept optional `disabled` prop
   - Define PaymentStatus type or enum

4. **Define payment status options**
   - Paid (green badge)
   - Unpaid (red badge)
   - Partially Paid (yellow/orange badge)
   - Refunded (gray badge)
   - Failed (dark red badge)
   - Include icons and color codes

5. **Create dropdown trigger button**
   - Display "Payment" label with dropdown icon
   - Show count of selected statuses (e.g., "Payment (2)")
   - Apply active state when filters applied
   - Indicate open/closed state

6. **Implement dropdown content**
   - List all payment status options
   - Checkbox for each status
   - Color-coded badge/indicator
   - "Select All" and "Clear" buttons

7. **Add visual payment indicators**
   - Color-coded dots or badges
   - Icons (CheckCircle, XCircle, etc.)
   - Consistent with payment display in table
   - Accessible color combinations

8. **Implement multi-select logic**
   - Toggle individual payment statuses
   - Update selected array
   - Handle "Select All" action
   - Handle "Clear" action

### Payment Status Filter Structure

```
┌─────────────────┐
│ Payment (2) ▼   │ ← Trigger button
└─────────────────┘
        ↓ (opens dropdown)
┌──────────────────────────────┐
│ Select All  |  Clear         │
├──────────────────────────────┤
│ ☑ 🟢 Paid                    │
│ ☑ 🔴 Unpaid                  │
│ ☐ 🟡 Partially Paid          │
│ ☐ ⚪ Refunded                │
│ ☐ 🔴 Failed                  │
└──────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string[] | Yes | [] | Selected payment status IDs |
| onChange | function | Yes | - | Selection change handler |
| disabled | boolean | No | false | Disable filter |
| placeholder | string | No | "Payment" | Button label |

### Payment Status Options

| Status | Label | Color | Badge Class | Icon |
|--------|-------|-------|-------------|------|
| paid | Paid | Green | `bg-green-100 text-green-700` | CheckCircle |
| unpaid | Unpaid | Red | `bg-red-100 text-red-700` | XCircle |
| partial | Partially Paid | Orange | `bg-orange-100 text-orange-700` | MinusCircle |
| refunded | Refunded | Gray | `bg-gray-100 text-gray-700` | RefreshCw |
| failed | Failed | Dark Red | `bg-red-200 text-red-800` | AlertCircle |

### Trigger Button States

| State | Display | Styling |
|-------|---------|---------|
| No selection | "Payment ▼" | Default gray |
| 1 selected | "Payment (1) ▼" | Blue tint |
| Multiple | "Payment (2) ▼" | Blue tint |
| All selected | "Payment (All) ▼" | Blue tint |

### Dropdown Layout

| Section | Content | Purpose |
|---------|---------|---------|
| Header | Select All \| Clear buttons | Bulk actions |
| Divider | Horizontal line | Visual separation |
| Options List | Payment status checkboxes | Selection options |

### Multi-Select Logic

| Action | Behavior |
|--------|----------|
| Click status checkbox | Toggle that payment status |
| Click "Select All" | Add all payment statuses to array |
| Click "Clear" | Empty the selection array |
| Click outside | Close dropdown, preserve selection |

### Payment Status Badge

Each option displays with colored badge:
```
☑ [🟢 Paid]
     ↑ Green badge with icon
```

### Priority Order

Display payment statuses in this order:
1. Paid (most common positive status)
2. Partially Paid (incomplete payment)
3. Unpaid (needs payment)
4. Failed (payment attempted but failed)
5. Refunded (post-payment action)

### Icon Mapping

| Status | Icon | Meaning |
|--------|------|---------|
| Paid | CheckCircle | Completed successfully |
| Unpaid | XCircle | Not yet paid |
| Partially Paid | MinusCircle | Incomplete payment |
| Refunded | RefreshCw | Money returned |
| Failed | AlertCircle | Payment error |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Keyboard Nav | Arrow keys navigate options |
| Space/Enter | Toggle checkbox |
| Screen Reader | Announce status and selection |
| Focus | Visual focus indicators |
| Color + Icon | Don't rely solely on color |

### Expected Outcome
- Multi-select dropdown for payment statuses
- Color-coded badges for visual clarity
- Selection count on trigger button
- Bulk selection and clearing actions
- Accessible and keyboard-navigable

### Verification Checklist
- [ ] `frontend/components/orders/PaymentStatusFilter.tsx` created
- [ ] All five payment status options defined
- [ ] Multi-select checkboxes functional
- [ ] Selected count displayed on button
- [ ] "Select All" and "Clear" buttons work
- [ ] Payment badges styled consistently
- [ ] Icons mapped correctly
- [ ] Dropdown closes on outside click
- [ ] onChange callback fires correctly
- [ ] Keyboard navigation functional
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Summary

This document established the Orders List page with comprehensive filtering capabilities. It includes the main page structure, header with navigation and actions, four summary cards displaying key metrics (total orders, pending, shipped, revenue), and a complete filtering system (search, status, date range, payment status).

### Completed Tasks
1. ✓ Created Orders List page as main container
2. ✓ Created Orders Header with breadcrumb and actions
3. ✓ Created Order Summary Cards container component
4. ✓ Created Total Orders Card showing order count
5. ✓ Created Pending Orders Card with urgency indicator
6. ✓ Created Shipped Today Card with goal tracking
7. ✓ Created Revenue Card with LKR formatting
8. ✓ Created Order Filters Bar as container
9. ✓ Created Order Search with debouncing
10. ✓ Created Status Filter with multi-select
11. ✓ Created Date Range Filter with presets and calendar
12. ✓ Created Payment Status Filter with multi-select

### Key Features Implemented
- **Dashboard Integration:** Orders page fits within dashboard layout
- **Metrics Display:** Four cards showing critical order KPIs
- **Advanced Filtering:** Search, status, date, and payment filters
- **Responsive Design:** Mobile-first approach for all screen sizes
- **Visual Clarity:** Color-coded badges and indicators throughout
- **User Experience:** Debounced search, preset date ranges, bulk filter actions

### Next Steps
Proceed to [02_Tasks-27-32_Table-API.md](02_Tasks-27-32_Table-API.md) to create the orders data table with sorting, pagination, and API integration.
