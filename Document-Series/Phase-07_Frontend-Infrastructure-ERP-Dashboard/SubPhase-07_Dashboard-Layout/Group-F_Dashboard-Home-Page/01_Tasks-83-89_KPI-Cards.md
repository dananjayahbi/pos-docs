# Tasks 83-89: Dashboard Home Page & KPI Cards

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout  
> **Group:** F - Dashboard Home Page  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-E_Responsive-Design-Mobile/02_Tasks-76-82_Testing-Documentation.md](../Group-E_Responsive-Design-Mobile/02_Tasks-76-82_Testing-Documentation.md)
- **→ Next Document:** [02_Tasks-90-94_Widgets-API.md](02_Tasks-90-94_Widgets-API.md)

---

## Document Overview

This document covers the creation of the main dashboard home page and the essential KPI (Key Performance Indicator) card components. The dashboard serves as the primary landing page after login, displaying critical business metrics at a glance including sales performance, order counts, inventory alerts, and pending tasks requiring attention.

The implementation focuses on building a modular, reusable card system that can display various metrics with consistent styling while supporting dynamic data, trend indicators, and responsive layouts. Each KPI card provides immediate visual feedback on business health and includes contextual information like comparisons to previous periods.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create Dashboard Home Page | Low | 35 min |
| 84 | Create Welcome Banner | Low | 25 min |
| 85 | Create KPI Summary Cards | Medium | 45 min |
| 86 | Create Sales KPI Card | Low | 30 min |
| 87 | Create Orders KPI Card | Low | 25 min |
| 88 | Create Low Stock Alert Card | Low | 30 min |
| 89 | Create Pending Tasks Card | Low | 30 min |

**Total Estimated Time:** ~3 hours 40 minutes

---

## Dashboard Architecture Overview

### Component Hierarchy

```
app/(dashboard)/page.tsx (Dashboard Home)
    │
    ├── WelcomeBanner
    │       └── User name, greeting, current date
    │
    ├── KPISummary (Grid Container)
    │       ├── SalesKPI
    │       ├── OrdersKPI
    │       ├── LowStockAlert
    │       └── PendingTasks
    │
    ├── QuickActions (Task 90)
    ├── RecentActivity (Task 91)
    └── SalesChart (Task 92)
```

### Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│  DASHBOARD HOME PAGE                                       │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Welcome Banner                                   │    │
│  │  Good afternoon, John! · Monday, January 26, 2026 │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌────────────────── KPI SUMMARY GRID ──────────────────┐ │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │ │
│  │  │Sales   │  │Orders  │  │Low     │  │Pending │    │ │
│  │  │Today   │  │Today   │  │Stock   │  │Tasks   │    │ │
│  │  │LKR 45K │  │124     │  │8 items │  │5       │    │ │
│  │  │↑ 12%   │  │↑ 8%    │  │⚠️       │  │📋      │    │ │
│  │  └────────┘  └────────┘  └────────┘  └────────┘    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                            │
│  [Quick Actions Grid - Task 90]                           │
│  [Recent Activity Feed - Task 91]                         │
│  [Sales Chart - Task 92]                                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Responsive Grid Layout

```
Desktop (1024px+):     4 columns
┌────┬────┬────┬────┐
│ S  │ O  │ L  │ P  │
└────┴────┴────┴────┘

Tablet (768-1023px):   2 columns
┌────┬────┐
│ S  │ O  │
├────┼────┤
│ L  │ P  │
└────┴────┘

Mobile (<768px):       1 column
┌────┐
│ S  │
├────┤
│ O  │
├────┤
│ L  │
├────┤
│ P  │
└────┘

S = Sales, O = Orders, L = Low Stock, P = Pending
```

---

## Task 83: Create Dashboard Home Page

### Overview

**Objective:** Create the main dashboard home page at `app/(dashboard)/page.tsx` as the primary landing page after user authentication. This page serves as the central hub for business metrics, quick actions, and activity monitoring.

**Purpose:** Provides users with immediate visibility into key business metrics and quick access to common actions. The page aggregates information from multiple sources into a single, easy-to-scan interface.

**Location:** `frontend/app/(dashboard)/page.tsx`

---

### Dependencies

**Route Group Required:**
- Task 01-07: Route group `(dashboard)` with layout.tsx

**Layout Components:**
- Task 14: Dashboard layout with sidebar and header
- Authenticated route protection

**Design System:**
- Shadcn UI components installed
- Tailwind CSS configuration complete

---

### Instructions

#### Step 1: Create Dashboard Page File

1. Navigate to `frontend/app/(dashboard)/` directory
2. Create file `page.tsx` for the dashboard home page
3. Set up file as Next.js 14 App Router server component
4. Import necessary dependencies (React types, metadata)

#### Step 2: Define Page Metadata

1. Export metadata object with page title "Dashboard"
2. Set description: "Business metrics and overview"
3. Configure metadata for proper SEO and browser tab display

#### Step 3: Implement Main Dashboard Component

1. Create default export function `DashboardPage`
2. Define as async server component for data fetching capability
3. Structure return with semantic HTML5 elements
4. Use `<main>` wrapper with proper semantic structure

#### Step 4: Set Up Grid Layout System

1. Create container div with max-width constraint
2. Implement vertical spacing with gap utilities
3. Configure padding for proper content spacing
4. Set up responsive padding (mobile vs desktop)

#### Step 5: Add Placeholder Structure

1. Add heading element "Dashboard" (h1) with sr-only class
2. Create sections for each major component area
3. Add comment markers for component placement
4. Include section for Welcome Banner
5. Include section for KPI Summary
6. Include section for Quick Actions (Task 90)
7. Include section for Activity Feed (Task 91)
8. Include section for Charts (Task 92)

#### Step 6: Implement Loading State

1. Create loading.tsx in same directory
2. Implement skeleton UI for dashboard loading
3. Use Skeleton components for cards
4. Match layout structure of main page
5. Ensure smooth loading transition

#### Step 7: Implement Error Boundary

1. Create error.tsx in same directory
2. Define as client component with 'use client'
3. Accept error and reset props
4. Display user-friendly error message
5. Include retry button calling reset function
6. Add link to return to previous page

#### Step 8: Configure Page Structure

1. Ensure proper TypeScript types for props
2. Add proper accessibility attributes
3. Configure container max-width (typically max-w-7xl)
4. Set up spacing between sections (space-y-6 or space-y-8)

---

### Expected Outcome

**File Created:**
- `frontend/app/(dashboard)/page.tsx`
- `frontend/app/(dashboard)/loading.tsx`
- `frontend/app/(dashboard)/error.tsx`

**Page Structure:**
- Accessible, semantic HTML structure
- Responsive container with proper spacing
- Clear sections for each component type
- Loading and error states implemented

**Features:**
- Server component for optimal performance
- Proper metadata for SEO
- Accessibility-first markup
- Error boundary for graceful error handling
- Loading skeleton for better UX

---

### Verification Checklist

- [ ] Page file created at correct location
- [ ] Metadata exported with title and description
- [ ] Main component exported as default
- [ ] Semantic HTML structure implemented
- [ ] Responsive container with max-width
- [ ] Vertical spacing configured
- [ ] Section placeholders for all components
- [ ] Loading state implemented
- [ ] Error boundary implemented
- [ ] Page renders without errors in dev mode
- [ ] Browser tab shows correct title
- [ ] Layout (sidebar/header) displays correctly
- [ ] Responsive padding works on mobile/desktop

---

## Task 84: Create Welcome Banner

### Overview

**Objective:** Create a personalized welcome banner component that displays a time-appropriate greeting, the user's name, and the current date. This provides context and personalization to the dashboard experience.

**Purpose:** Creates a welcoming, human touch to the interface while providing temporal context. The greeting changes based on time of day (morning, afternoon, evening) to maintain freshness and relevance.

**Location:** `frontend/components/dashboard/WelcomeBanner.tsx`

---

### Dependencies

**Authentication Required:**
- User session/context with user details
- Access to current user name and role

**Date/Time Libraries:**
- date-fns for date formatting
- Browser timezone detection

**UI Components:**
- Card component from Shadcn UI
- Typography utilities from Tailwind

---

### Banner Greeting Logic

```
Time-Based Greeting Algorithm:

00:00 - 11:59  →  "Good morning"
12:00 - 16:59  →  "Good afternoon"
17:00 - 23:59  →  "Good evening"

Display Format:
"Good [timeOfDay], [firstName]! · [dayOfWeek], [month] [day], [year]"

Example:
"Good afternoon, Sarah! · Monday, January 26, 2026"
```

---

### Instructions

#### Step 1: Create Component File

1. Create `WelcomeBanner.tsx` in `frontend/components/dashboard/`
2. Mark as client component with 'use client' directive
3. Import necessary dependencies (React, date-fns, icons)
4. Import Card components from UI library

#### Step 2: Set Up Component Structure

1. Define WelcomeBanner functional component
2. Create interface for props if accepting user data
3. Set up component export
4. Add proper TypeScript typing

#### Step 3: Implement Greeting Logic

1. Create function to determine time-based greeting
2. Get current hour using Date or date-fns
3. Implement conditional logic for morning/afternoon/evening
4. Return appropriate greeting string

#### Step 4: Format Current Date

1. Use date-fns `format` function for date display
2. Format as: "EEEE, MMMM d, yyyy" (Monday, January 26, 2026)
3. Ensure date updates on component mount
4. Handle timezone correctly for server/client rendering

#### Step 5: Access User Information

1. Import useUser or useSession hook for auth
2. Extract user first name or display name
3. Provide fallback name if user data not available
4. Handle loading state while fetching user data

#### Step 6: Implement Banner UI

1. Wrap content in Card component
2. Use horizontal layout for greeting and date
3. Separate greeting and date with visual divider (·)
4. Style greeting prominently (larger font, semibold)
5. Style date with muted color

#### Step 7: Add Responsive Styling

1. Mobile: Stack greeting and date vertically
2. Tablet+: Display inline with divider
3. Adjust font sizes for mobile readability
4. Ensure proper spacing and padding
5. Test text wrapping on small screens

#### Step 8: Handle Loading and Error States

1. Show skeleton loader while user data loading
2. Display default greeting if user fetch fails
3. Gracefully handle missing user information
4. Ensure component doesn't break on errors

---

### Expected Outcome

**Component Created:**
- `frontend/components/dashboard/WelcomeBanner.tsx`

**Display Features:**
- Time-appropriate greeting (morning/afternoon/evening)
- User's first name displayed
- Current date in readable format
- Visual separator between elements

**Behavior:**
- Greeting updates based on time of day
- Date displays in user's timezone
- Smooth loading state
- Error-resilient

**Styling:**
- Prominent greeting text
- Muted date display
- Responsive layout (mobile/desktop)
- Proper spacing and padding
- Consistent with design system

---

### Verification Checklist

- [ ] Component file created in correct location
- [ ] Marked as client component ('use client')
- [ ] Time-based greeting logic implemented
- [ ] Morning greeting (00:00-11:59)
- [ ] Afternoon greeting (12:00-16:59)
- [ ] Evening greeting (17:00-23:59)
- [ ] User name displays correctly
- [ ] Current date formatted properly
- [ ] Visual divider between greeting and date
- [ ] Mobile layout: stacked vertically
- [ ] Desktop layout: inline with divider
- [ ] Loading state implemented
- [ ] Error state handled gracefully
- [ ] Component renders without errors
- [ ] Greeting updates when time changes
- [ ] Works with user session/context
- [ ] Fallback for missing user data
- [ ] Typography hierarchy clear

---

## Task 85: Create KPI Summary Cards

### Overview

**Objective:** Create the KPI Summary container component and reusable KPI Card base component. The container manages the grid layout for displaying multiple KPI cards responsively, while the base card provides a consistent structure for all metric displays.

**Purpose:** Establishes a flexible, reusable system for displaying key performance indicators. The grid container handles responsive layout while the base card component ensures visual consistency across all metrics.

**Location:** 
- `frontend/components/dashboard/KPISummary.tsx`
- `frontend/components/dashboard/KPICard.tsx`

---

### Dependencies

**UI Components:**
- Card component from Shadcn UI
- Icon components (lucide-react)

**Layout:**
- CSS Grid for responsive layout
- Tailwind utilities for styling

---

### KPI Card Anatomy

```
┌──────────────────────────────┐
│  ┌──┐  Title                │  ← Header section
│  │🔷│  Subtitle/Label       │     Icon + Text
│  └──┘                        │
│                              │
│  ╔════════════╗              │  ← Value section
│  ║   45,000   ║              │     Large, prominent
│  ╚════════════╝              │
│                              │
│  ↑ 12.5%                     │  ← Trend indicator
│  vs yesterday                │     Change + comparison
│                              │
└──────────────────────────────┘
```

### Component Props Interface

```
KPICard Props:
{
  title: string              // "Today's Sales"
  value: string | number     // "45000" or "LKR 45,000"
  icon: LucideIcon          // DollarSign, ShoppingBag, etc.
  trend?: {
    value: number           // 12.5 (percentage)
    direction: 'up' | 'down' | 'neutral'
    label?: string          // "vs yesterday"
  }
  variant?: 'default' | 'warning' | 'success' | 'danger'
  onClick?: () => void      // Optional click handler
  loading?: boolean         // Show skeleton state
}
```

---

### Instructions

#### Step 1: Create KPICard Base Component

1. Create file `KPICard.tsx` in `components/dashboard/`
2. Mark as client component if interactive
3. Import Card, Icon types, and utilities
4. Define comprehensive TypeScript interface for props

#### Step 2: Implement Card Structure

1. Use Card as wrapper component
2. Create header section with icon and title
3. Implement main value display area
4. Add trend indicator section (optional)
5. Apply proper spacing between sections

#### Step 3: Style Card Header

1. Display icon on left side (24x24 or 20x20)
2. Place title next to icon
3. Add optional subtitle below title
4. Use muted colors for subtitle
5. Implement icon color based on variant

#### Step 4: Implement Value Display

1. Create large, prominent text for value
2. Apply appropriate font size (text-3xl or text-4xl)
3. Use monospace font for numbers (font-mono)
4. Ensure proper number formatting
5. Handle long values with responsive sizing

#### Step 5: Add Trend Indicator

1. Show trend percentage with arrow (↑ ↓ →)
2. Color trend based on direction:
   - Up: green (text-green-600)
   - Down: red (text-red-600)
   - Neutral: gray (text-gray-600)
3. Display comparison label below trend
4. Make trend section optional
5. Format percentage with 1 decimal place

#### Step 6: Implement Variant Styling

1. Define variant types: default, warning, success, danger
2. Apply border/background colors based on variant
3. Adjust icon colors per variant
4. Keep consistent padding and spacing
5. Ensure accessibility with sufficient contrast

#### Step 7: Add Loading State

1. Create skeleton version of card
2. Show animated shimmer effect
3. Match dimensions of loaded state
4. Display skeleton for icon, title, value
5. Smooth transition from loading to loaded

#### Step 8: Create KPISummary Container

1. Create file `KPISummary.tsx` in same directory
2. Accept children prop for card components
3. Implement CSS Grid layout
4. Configure responsive columns:
   - Mobile: 1 column
   - Tablet: 2 columns
   - Desktop: 4 columns
5. Add gap between cards (gap-4 or gap-6)
6. Set consistent card heights

#### Step 9: Implement Click Behavior

1. Add optional onClick prop to KPICard
2. Make entire card clickable if handler provided
3. Add hover effects when clickable
4. Include visual feedback (cursor-pointer, hover:shadow)
5. Ensure keyboard accessibility (tab, enter)

#### Step 10: Create Card Exports

1. Create `index.ts` in dashboard directory
2. Export all dashboard components
3. Organize exports logically
4. Enable clean imports from parent

---

### Expected Outcome

**Components Created:**
- `frontend/components/dashboard/KPICard.tsx`
- `frontend/components/dashboard/KPISummary.tsx`
- `frontend/components/dashboard/index.ts`

**KPICard Features:**
- Flexible props interface
- Icon + title header
- Prominent value display
- Optional trend indicator
- Multiple variant styles
- Loading skeleton
- Click handler support
- Keyboard accessible

**KPISummary Features:**
- Responsive grid layout
- Consistent spacing
- Equal card heights
- Mobile to desktop breakpoints
- Clean, organized presentation

**Styling:**
- Consistent with design system
- Proper spacing and padding
- Hover states for interactive cards
- Color coding for trends
- Responsive typography

---

### Verification Checklist

- [ ] KPICard.tsx created with full props interface
- [ ] KPISummary.tsx created as grid container
- [ ] Card displays icon and title
- [ ] Value displayed prominently
- [ ] Trend indicator shows arrow + percentage
- [ ] Trend colors: green (up), red (down), gray (neutral)
- [ ] Comparison label displays correctly
- [ ] Variant styles work (default, warning, success, danger)
- [ ] Loading skeleton implemented
- [ ] Grid responsive: 1 col (mobile), 2 col (tablet), 4 col (desktop)
- [ ] Gap between cards consistent
- [ ] Cards have equal heights in grid
- [ ] Click handler works when provided
- [ ] Hover effects display on clickable cards
- [ ] Keyboard navigation works
- [ ] Component exports in index.ts
- [ ] TypeScript types properly defined
- [ ] No console errors or warnings
- [ ] Cards render without layout shift

---

## Task 86: Create Sales KPI Card

### Overview

**Objective:** Implement the Sales KPI card to display today's sales amount in LKR (Sri Lankan Rupees), including trend comparison versus yesterday's sales. This card provides immediate visibility into daily revenue performance.

**Purpose:** Gives business owners and managers instant insight into current day sales performance, with trend indicators to quickly assess whether sales are improving or declining compared to the previous day.

**Location:** `frontend/components/dashboard/SalesKPI.tsx`

---

### Dependencies

**Base Components:**
- Task 85: KPICard base component
- KPISummary container

**Data Requirements:**
- Today's total sales amount
- Yesterday's total sales amount
- Percentage change calculation

**Icons:**
- DollarSign icon from lucide-react

---

### Sales Data Structure

```
Sales Data Interface:
{
  todaySales: number          // 45000.00
  yesterdaySales: number      // 40000.00
  currency: string            // "LKR"
  trend: {
    percentage: number        // 12.5
    direction: 'up' | 'down'  // calculated
  }
}

Display Format:
- Amount: "LKR 45,000" (with thousand separators)
- Trend: "↑ 12.5%"
- Label: "vs yesterday"
```

---

### Instructions

#### Step 1: Create Sales KPI Component File

1. Create `SalesKPI.tsx` in `components/dashboard/`
2. Mark as client component for data fetching
3. Import KPICard component
4. Import DollarSign icon from lucide-react
5. Import number formatting utilities

#### Step 2: Define Props Interface

1. Create TypeScript interface for component props
2. Include optional salesData for server-passed data
3. Add loading state prop
4. Add error state prop
5. Define data structure for sales information

#### Step 3: Set Up Data Fetching

1. Create state for sales data
2. Create state for loading status
3. Implement useEffect for data fetch on mount
4. Set up API endpoint call for sales metrics
5. Handle fetch errors gracefully
6. Update state with fetched data

#### Step 4: Implement Calculation Logic

1. Calculate percentage change formula:
   - `((today - yesterday) / yesterday) * 100`
2. Determine trend direction (up if positive, down if negative)
3. Handle edge cases (yesterday = 0)
4. Round percentage to 1 decimal place
5. Format absolute change amount if needed

#### Step 5: Format Currency Display

1. Create function to format amount with LKR prefix
2. Add thousand separators using toLocaleString
3. Handle decimal places (0 or 2 based on requirements)
4. Format: "LKR 45,000" or "LKR 45,000.00"
5. Ensure consistent formatting for large numbers

#### Step 6: Configure KPICard Props

1. Set title: "Today's Sales"
2. Pass formatted value with currency
3. Set icon to DollarSign
4. Configure trend object:
   - value: calculated percentage
   - direction: up/down based on calculation
   - label: "vs yesterday"
5. Set variant to 'default' or 'success' if positive trend

#### Step 7: Handle Loading State

1. Pass loading prop to KPICard
2. Show skeleton while data fetching
3. Prevent flash of empty content
4. Maintain card dimensions during loading

#### Step 8: Handle Error State

1. Catch API fetch errors
2. Display fallback message in card
3. Show error indicator without breaking layout
4. Optionally show retry button
5. Log errors for debugging

#### Step 9: Add Click Behavior

1. Make card clickable to navigate to sales report
2. Define onClick handler
3. Navigate to detailed sales page/report
4. Use Next.js router for navigation
5. Add cursor-pointer for visual feedback

#### Step 10: Optimize Performance

1. Implement data caching to reduce API calls
2. Add refresh interval (e.g., every 5 minutes)
3. Consider using SWR or React Query for data
4. Memoize calculation functions
5. Prevent unnecessary re-renders

---

### Expected Outcome

**Component Created:**
- `frontend/components/dashboard/SalesKPI.tsx`

**Display Features:**
- "Today's Sales" title
- DollarSign icon in header
- Formatted amount: "LKR 45,000"
- Trend indicator: "↑ 12.5%"
- Comparison: "vs yesterday"
- Color-coded trend (green up, red down)

**Behavior:**
- Fetches real-time sales data
- Calculates trend percentage
- Formats currency correctly
- Shows loading skeleton
- Handles errors gracefully
- Clickable to view details

**Data Integration:**
- Connects to sales metrics API
- Refreshes periodically
- Caches data appropriately
- Handles empty/zero values

---

### Verification Checklist

- [ ] Component file created
- [ ] DollarSign icon displayed
- [ ] Title: "Today's Sales"
- [ ] Amount formatted with LKR prefix
- [ ] Thousand separators in amount
- [ ] Trend percentage calculated correctly
- [ ] Trend direction determined (up/down)
- [ ] Arrow indicator matches direction (↑ ↓)
- [ ] Trend color: green (positive), red (negative)
- [ ] "vs yesterday" label displays
- [ ] Loading state shows skeleton
- [ ] Error state handled gracefully
- [ ] Clickable navigation to sales report
- [ ] Hover effect on card
- [ ] Data refreshes periodically
- [ ] Edge case: yesterday sales = 0 handled
- [ ] Edge case: negative sales handled
- [ ] No console errors
- [ ] TypeScript compilation successful
- [ ] Component renders in dashboard grid

---

## Task 87: Create Orders KPI Card

### Overview

**Objective:** Implement the Orders KPI card to display today's order count with trend comparison to yesterday. This metric provides visibility into order volume and business activity.

**Purpose:** Allows quick assessment of daily order volume, helping identify busy days, patterns, and potential issues if order counts drop unexpectedly.

**Location:** `frontend/components/dashboard/OrdersKPI.tsx`

---

### Dependencies

**Base Components:**
- Task 85: KPICard base component

**Data Requirements:**
- Today's order count
- Yesterday's order count
- Percentage change calculation

**Icons:**
- ShoppingBag icon from lucide-react

---

### Orders Data Structure

```
Orders Data Interface:
{
  todayOrders: number         // 124
  yesterdayOrders: number     // 115
  trend: {
    percentage: number        // 7.8
    direction: 'up' | 'down'
  }
}

Display Format:
- Count: "124" (plain number)
- Trend: "↑ 7.8%"
- Label: "vs yesterday"
```

---

### Instructions

#### Step 1: Create Orders KPI Component

1. Create `OrdersKPI.tsx` in `components/dashboard/`
2. Mark as client component
3. Import KPICard, ShoppingBag icon
4. Set up component structure similar to SalesKPI

#### Step 2: Define Data Interface

1. Create TypeScript interface for orders data
2. Include today and yesterday counts
3. Add loading and error state types
4. Define props interface

#### Step 3: Implement Data Fetching

1. Create state for orders data
2. Set up useEffect for API call
3. Fetch today's and yesterday's order counts
4. Use appropriate API endpoint (e.g., /api/dashboard/orders)
5. Handle loading and error states

#### Step 4: Calculate Trend

1. Implement percentage change calculation
2. Formula: `((today - yesterday) / yesterday) * 100`
3. Determine up or down direction
4. Handle zero yesterday count edge case
5. Round to 1 decimal place

#### Step 5: Configure Card Display

1. Set title: "Today's Orders"
2. Display count as simple number (no currency)
3. Use ShoppingBag icon
4. Pass trend data to KPICard
5. Set comparison label: "vs yesterday"

#### Step 6: Format Count Display

1. Display whole number (no decimals)
2. Add thousand separators for large counts
3. Format as: "124" or "1,234"
4. Keep display simple and readable

#### Step 7: Add Interactivity

1. Make card clickable
2. Navigate to orders list/management page
3. Link to orders filtered by today's date
4. Add hover effect
5. Ensure keyboard accessibility

#### Step 8: Handle States

1. Show loading skeleton during fetch
2. Display error message if fetch fails
3. Show zero state gracefully
4. Handle no yesterday data scenario

---

### Expected Outcome

**Component Created:**
- `frontend/components/dashboard/OrdersKPI.tsx`

**Display:**
- Title: "Today's Orders"
- ShoppingBag icon
- Order count: "124"
- Trend: "↑ 7.8%"
- Label: "vs yesterday"

**Behavior:**
- Real-time order count
- Trend calculation
- Loading state
- Error handling
- Click navigation

---

### Verification Checklist

- [ ] Component file created
- [ ] ShoppingBag icon displayed
- [ ] Title: "Today's Orders"
- [ ] Count displays as whole number
- [ ] Thousand separators for large numbers
- [ ] Trend percentage calculated
- [ ] Direction indicator correct (↑ ↓)
- [ ] Trend color appropriate
- [ ] Comparison label: "vs yesterday"
- [ ] Loading skeleton works
- [ ] Error state handled
- [ ] Clickable to orders page
- [ ] Navigation passes correct filters
- [ ] Zero count handled gracefully
- [ ] No yesterday data handled
- [ ] Component renders correctly
- [ ] No TypeScript errors

---

## Task 88: Create Low Stock Alert Card

### Overview

**Objective:** Implement the Low Stock Alert card to display count of products below their reorder point. This critical metric helps prevent stockouts and ensures inventory availability.

**Purpose:** Provides proactive warning about inventory levels, enabling timely reordering decisions. The warning styling draws attention to items requiring action.

**Location:** `frontend/components/dashboard/LowStockAlert.tsx`

---

### Dependencies

**Base Components:**
- Task 85: KPICard base component

**Data Requirements:**
- Count of products with quantity < reorder point
- Product inventory data access

**Icons:**
- AlertTriangle icon from lucide-react

---

### Low Stock Data Structure

```
Low Stock Data Interface:
{
  lowStockCount: number       // 8
  criticalCount: number       // 2 (quantity = 0)
  items?: Array<{
    id: string
    name: string
    currentQty: number
    reorderPoint: number
  }>
}

Display Format:
- Count: "8 items"
- Status: "Below reorder point"
- No trend comparison (static alert)
```

---

### Instructions

#### Step 1: Create Low Stock Component

1. Create `LowStockAlert.tsx` in `components/dashboard/`
2. Mark as client component
3. Import KPICard, AlertTriangle icon
4. Set up component structure

#### Step 2: Define Data Structure

1. Create interface for low stock data
2. Include count and optional item details
3. Add critical stock count (qty = 0)
4. Define props interface

#### Step 3: Fetch Inventory Data

1. Set up API call to inventory endpoint
2. Query products where `quantity < reorder_point`
3. Get count of affected items
4. Optionally fetch top items list
5. Handle loading/error states

#### Step 4: Configure Warning Styling

1. Set KPICard variant to 'warning'
2. Use amber/orange color scheme
3. AlertTriangle icon in warning color
4. Make card stand out visually
5. Consider subtle animation if critical

#### Step 5: Format Display

1. Title: "Low Stock Alert"
2. Value: "[count] items" (e.g., "8 items")
3. Subtitle: "Below reorder point"
4. No trend indicator needed
5. Icon: AlertTriangle in warning color

#### Step 6: Add Critical Stock Indication

1. If criticalCount > 0, show additional badge
2. Display "2 out of stock" as secondary info
3. Use red color for critical items
4. Position below main count
5. Make it visually distinct

#### Step 7: Implement Click Navigation

1. Make card clickable
2. Navigate to inventory page
3. Pre-filter for low stock items
4. Pass filter parameter in URL
5. Open in inventory management view

#### Step 8: Add Tooltip or Details

1. Optionally show tooltip on hover
2. List top 3 low stock items
3. Display item name and current quantity
4. Keep tooltip concise
5. Ensure mobile accessibility

#### Step 9: Handle Zero State

1. If no low stock items, show success variant
2. Display "0 items" or "All stocked"
3. Change icon to CheckCircle
4. Use success color (green)
5. Provide positive feedback

#### Step 10: Implement Refresh Logic

1. Auto-refresh data periodically
2. Update after inventory changes
3. Show loading indicator during refresh
4. Consider real-time updates via WebSocket
5. Cache appropriately

---

### Expected Outcome

**Component Created:**
- `frontend/components/dashboard/LowStockAlert.tsx`

**Display:**
- Title: "Low Stock Alert"
- AlertTriangle icon (warning color)
- Count: "8 items"
- Status: "Below reorder point"
- Warning card styling
- Critical count if any

**Behavior:**
- Fetches low stock count
- Updates automatically
- Clickable to filtered inventory
- Shows success state when zero
- Displays critical items

**Styling:**
- Warning variant (amber/orange)
- Attention-grabbing design
- Clear visual hierarchy
- Consistent with design system

---

### Verification Checklist

- [ ] Component file created
- [ ] AlertTriangle icon displayed
- [ ] Title: "Low Stock Alert"
- [ ] Count formatted: "[n] items"
- [ ] Subtitle: "Below reorder point"
- [ ] Warning color scheme applied
- [ ] Card variant set to 'warning'
- [ ] Critical count displayed if > 0
- [ ] Loading state implemented
- [ ] Error handling added
- [ ] Clickable to inventory page
- [ ] Navigation filters for low stock
- [ ] Zero state shows success styling
- [ ] Success icon when no alerts
- [ ] Tooltip shows item details (optional)
- [ ] Auto-refresh configured
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessible (screen readers)
- [ ] Component integrates in dashboard

---

## Task 89: Create Pending Tasks Card

### Overview

**Objective:** Implement the Pending Tasks card to display the count of items requiring approval or action. This helps users track outstanding administrative tasks and approvals.

**Purpose:** Ensures important tasks requiring user action don't get overlooked. Provides visibility into pending approvals, reviews, or other actionable items.

**Location:** `frontend/components/dashboard/PendingTasks.tsx`

---

### Dependencies

**Base Components:**
- Task 85: KPICard base component

**Data Requirements:**
- Count of pending approvals
- Task/workflow system access

**Icons:**
- ClipboardList icon from lucide-react

---

### Pending Tasks Data Structure

```
Pending Tasks Data Interface:
{
  pendingCount: number        // 5
  categories: {
    approvals: number         // 3
    reviews: number           // 1
    assignments: number       // 1
  }
  urgentCount?: number        // 2 (overdue)
}

Display Format:
- Count: "5" (plain number)
- Label: "Pending approvals"
- No trend comparison
```

---

### Instructions

#### Step 1: Create Pending Tasks Component

1. Create `PendingTasks.tsx` in `components/dashboard/`
2. Mark as client component
3. Import KPICard, ClipboardList icon
4. Set up component structure

#### Step 2: Define Tasks Data Structure

1. Create TypeScript interface for pending tasks
2. Include total count and category breakdown
3. Add urgent/overdue count
4. Define props interface

#### Step 3: Implement Data Fetching

1. Set up API call to tasks/approvals endpoint
2. Query for items with status 'pending'
3. Filter by current user's responsibility
4. Count total pending items
5. Handle loading/error states

#### Step 4: Configure Card Display

1. Title: "Pending Tasks"
2. Value: Simple count number (e.g., "5")
3. Icon: ClipboardList
4. Subtitle: "Awaiting action" or "Pending approvals"
5. Use default or info variant

#### Step 5: Add Urgency Indicator

1. If urgentCount > 0, show badge
2. Display urgent count with distinct styling
3. Use red color for urgent items
4. Position badge in corner or below count
5. Make it visually prominent

#### Step 6: Categorize Tasks

1. Show breakdown by category on hover or below
2. Categories: Approvals, Reviews, Assignments
3. Display as: "3 approvals, 2 reviews"
4. Keep display concise
5. Optional: show in tooltip

#### Step 7: Implement Navigation

1. Make card clickable
2. Navigate to tasks/approvals page
3. Filter for pending items assigned to user
4. Pass appropriate URL parameters
5. Open in workflow/tasks view

#### Step 8: Handle Zero State

1. Display "0" when no pending tasks
2. Keep neutral styling (no success/warning)
3. Show "No pending tasks" message
4. Provide positive feedback
5. Maintain card structure

#### Step 9: Add Badge Styling

1. If count > 0, optionally add notification badge
2. Small red dot or number badge on icon
3. Draw attention to actionable items
4. Animate badge if urgent
5. Ensure accessibility

#### Step 10: Implement Real-Time Updates

1. Consider WebSocket for real-time count
2. Update when new tasks assigned
3. Refresh when tasks completed
4. Show subtle animation on update
5. Handle connection errors gracefully

---

### Expected Outcome

**Component Created:**
- `frontend/components/dashboard/PendingTasks.tsx`

**Display:**
- Title: "Pending Tasks"
- ClipboardList icon
- Count: "5"
- Label: "Awaiting action"
- Urgent indicator if applicable

**Behavior:**
- Fetches pending tasks count
- Real-time or periodic updates
- Clickable to tasks page
- Shows category breakdown
- Handles zero state

**Styling:**
- Default or info variant
- Urgent badge if needed
- Clear visual hierarchy
- Consistent design

---

### Verification Checklist

- [ ] Component file created
- [ ] ClipboardList icon displayed
- [ ] Title: "Pending Tasks"
- [ ] Count displays correctly
- [ ] Label: "Awaiting action" or similar
- [ ] Urgent indicator for overdue tasks
- [ ] Category breakdown available
- [ ] Loading state implemented
- [ ] Error handling added
- [ ] Clickable to tasks page
- [ ] Navigation filters correctly
- [ ] Zero state handled
- [ ] Neutral styling for zero
- [ ] Badge styling for urgent items
- [ ] Real-time updates configured
- [ ] Tooltip shows categories (optional)
- [ ] No console errors
- [ ] TypeScript types correct
- [ ] Accessible (keyboard, screen reader)
- [ ] Integrates in dashboard grid

---

## Integration Requirements

### Component Exports

Create or update `frontend/components/dashboard/index.ts`:

```
Export Structure:
- WelcomeBanner
- KPISummary
- KPICard
- SalesKPI
- OrdersKPI
- LowStockAlert
- PendingTasks
```

### Dashboard Page Integration

Update `app/(dashboard)/page.tsx` to include:

1. Import all components from `@/components/dashboard`
2. Add WelcomeBanner at top
3. Add KPISummary container with all KPI cards
4. Ensure proper spacing between sections
5. Apply loading states
6. Handle errors gracefully

### Data Flow Architecture

```
API Endpoints Required:
├── GET /api/dashboard/sales
│   └── { todaySales, yesterdaySales }
├── GET /api/dashboard/orders
│   └── { todayOrders, yesterdayOrders }
├── GET /api/dashboard/inventory
│   └── { lowStockCount, criticalCount, items[] }
└── GET /api/dashboard/tasks
    └── { pendingCount, categories, urgentCount }

Component Data Fetching:
- Each KPI component fetches own data
- Independent loading states
- Parallel API calls for performance
- Error isolation per component
- Optional: Aggregate endpoint for all metrics
```

---

## Responsive Layout Details

### Grid Breakpoints

**Mobile (<640px):**
- 1 column layout
- Full width cards
- Stacked vertically
- Touch-friendly spacing
- Welcome banner stacked

**Tablet (640px - 1023px):**
- 2 column grid
- Cards span half width
- Welcome banner inline
- Moderate spacing

**Desktop (1024px - 1439px):**
- 4 column grid
- Equal width cards
- Compact layout
- Standard spacing

**Large Desktop (1440px+):**
- 4 column grid maintained
- Max-width container
- Generous spacing
- Enhanced readability

### Spacing Configuration

```
Container:
- Max-width: 1280px (max-w-7xl)
- Padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)

Grid Gap:
- Mobile: gap-4 (1rem)
- Tablet: gap-6 (1.5rem)
- Desktop: gap-6 (1.5rem)

Card Padding:
- Internal: p-6 (1.5rem)
- Consistent across all sizes

Section Spacing:
- Between sections: space-y-6 or space-y-8
```

---

## Accessibility Guidelines

### Keyboard Navigation

1. All cards keyboard accessible (tab order)
2. Enter key activates card click
3. Focus indicators visible
4. Logical tab order

### Screen Readers

1. Proper ARIA labels on cards
2. Trend direction announced
3. Icon labels for context
4. Landmark regions for sections

### Visual Accessibility

1. Sufficient color contrast (WCAG AA)
2. Icons not sole indicator of meaning
3. Text readable at all sizes
4. Focus states clearly visible

### Semantic HTML

1. Use appropriate heading levels
2. Proper button/link elements
3. Meaningful alt text
4. Landmark elements (main, section)

---

## Performance Considerations

### Data Fetching Optimization

1. **Parallel Requests**: All KPI components fetch data simultaneously
2. **Caching**: Implement stale-while-revalidate pattern
3. **Error Boundaries**: Isolate failures per component
4. **Loading States**: Progressive rendering, show cached data first

### Rendering Optimization

1. **Memoization**: Memoize calculation functions
2. **Code Splitting**: Lazy load non-critical components
3. **Image Optimization**: Use Next.js Image for icons if needed
4. **Skeleton Screens**: Immediate visual feedback

### API Optimization

1. Consider aggregate endpoint for all metrics
2. Implement server-side caching (Redis)
3. Use ETags for efficient updates
4. Debounce refresh requests

---

## Testing Strategy

### Unit Tests

**KPICard Component:**
- Renders with all props
- Displays trend correctly
- Handles loading state
- Handles error state
- Click handler fires
- Variant styles apply

**Individual KPI Components:**
- Fetches data correctly
- Calculates trends accurately
- Formats values properly
- Handles edge cases
- Error handling works

### Integration Tests

**Dashboard Page:**
- All components render
- Layout responsive at breakpoints
- Loading states coordinated
- Navigation works
- Error boundaries catch errors

### Visual Tests

**Responsive Design:**
- Test at all breakpoints
- Verify grid layout
- Check spacing consistency
- Validate typography scaling

### Accessibility Tests

**A11y Compliance:**
- Keyboard navigation works
- Screen reader compatible
- Color contrast sufficient
- Focus management correct

---

## Security Considerations

### Data Access

1. Verify user permissions for metrics data
2. Filter data by tenant/organization
3. Validate API tokens
4. Rate limit API requests

### Data Privacy

1. Don't expose sensitive financial data unnecessarily
2. Sanitize error messages (no stack traces)
3. Log access to metrics for audit
4. Implement data masking if needed

---

## Error Handling Strategy

### Component-Level Errors

**Graceful Degradation:**
- Show error message in card
- Maintain layout structure
- Provide retry option
- Don't break entire dashboard

### Network Errors

**Resilience:**
- Display cached data if available
- Show "offline" indicator
- Retry failed requests
- Timeout handling

### Data Validation

**Input Validation:**
- Handle null/undefined values
- Validate number ranges
- Handle zero/negative values
- Format invalid data gracefully

---

## Documentation Requirements

### Component Documentation

**Each Component Should Include:**
1. Purpose and usage
2. Props interface with descriptions
3. Example usage
4. Error handling notes
5. Accessibility features

### Code Comments

**Inline Documentation:**
1. Complex calculations explained
2. API endpoint references
3. Edge case handling notes
4. Performance optimization notes

---

## Future Enhancements

### Potential Improvements

1. **Real-Time Updates**: WebSocket integration for live metrics
2. **Custom Timeframes**: Allow date range selection
3. **Drill-Down**: Click to detailed charts/reports
4. **Comparison Modes**: Compare to last week/month/year
5. **Export Data**: Download metrics as CSV/PDF
6. **Customization**: User-configurable KPI selection
7. **Alerts**: Threshold-based notifications
8. **Historical Trends**: Mini sparkline charts

---

## Summary

This document has covered the implementation of the dashboard home page and four essential KPI cards: Sales, Orders, Low Stock Alert, and Pending Tasks. These components provide critical business metrics at a glance, enabling quick decision-making and proactive management.

### Key Achievements

- **Dashboard Page**: Central hub for business metrics
- **Welcome Banner**: Personalized, time-aware greeting
- **Modular KPI System**: Reusable card components
- **Sales Tracking**: Revenue performance monitoring
- **Order Monitoring**: Activity volume tracking
- **Inventory Alerts**: Proactive stock management
- **Task Management**: Pending action visibility

### Next Steps

Proceed to [02_Tasks-90-94_Widgets-API.md](02_Tasks-90-94_Widgets-API.md) to implement Quick Actions Grid, Recent Activity Feed, Sales Chart, and API integration.

---

**Document Complete** | **Tasks 83-89** | **Est. Time: ~3h 40min** | **Page Navigation: ↑ Top**
