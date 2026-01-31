# Tasks 69-82: Dashboard Components

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** E - Insights Dashboard  
> **Document:** 01 of 01  
> **Tasks Covered:** 69-82 (14 tasks)

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Analytics-Aggregation/](../Group-D_Analytics-Aggregation/)
- **→ Next Group:** [../Group-F_Automation-Testing/](../Group-F_Automation-Testing/)

---

## Document Overview

This document covers the complete Customer Insights Dashboard implementation - a comprehensive visualization layer for tenant administrators to view customer segments, lifetime value predictions, churn risk analysis, and cohort analytics.

### Tasks Summary Table

| Task | Title | Priority | Component | Description |
|------|-------|----------|-----------|-------------|
| 69 | Dashboard Layout | Medium | InsightsDashboard | Main layout with sidebar navigation |
| 70 | Overview Page | Medium | OverviewPage | Summary statistics cards |
| 71 | Segment Chart | Medium | SegmentChart | Pie chart for segment distribution |
| 72 | Segment Table | Medium | SegmentTable | Data table with customer segments |
| 73 | LTV Chart | Medium | LTVChart | Bar chart for LTV tiers |
| 74 | Churn Chart | Medium | ChurnChart | Bar chart for risk tiers |
| 75 | Customer Detail | Medium | CustomerDetail | Single customer profile view |
| 76 | Timeline View | Medium | TimelineView | Order history timeline |
| 77 | Cohort View | Medium | CohortView | Cohort analysis table |
| 78 | Cohort Chart | Medium | CohortChart | Retention curves line chart |
| 79 | Filter Controls | Low | FilterControls | Multi-filter component |
| 80 | Export CSV | Low | ExportCSV | CSV data export |
| 81 | Export PDF | Medium | ExportPDF | PDF report generation |
| 82 | Verify Dashboard | Low | - | Integration verification |

### Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | Next.js | React-based frontend |
| Charts | Recharts | Data visualization |
| CSV Export | Native JS | Blob download |
| PDF Export | jspdf + html2canvas | Report generation |
| Styling | Tailwind CSS | Component styling |
| State | React Query | Data fetching/caching |

---

## Architecture Overview

### Dashboard Layout Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INSIGHTS DASHBOARD                          │
├────────────┬────────────────────────────────────────────────────────┤
│            │  HEADER                                                │
│            │  ┌─────────────────────────────────────────────────┐   │
│  SIDEBAR   │  │ Title: Customer Insights  │  [Filters] [Export] │   │
│            │  └─────────────────────────────────────────────────┘   │
│ ┌────────┐ ├────────────────────────────────────────────────────────┤
│ │Overview│ │                                                        │
│ ├────────┤ │                    MAIN CONTENT                        │
│ │Segments│ │                                                        │
│ ├────────┤ │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│ │LTV     │ │  │   Card 1     │  │   Card 2     │  │   Card 3     │  │
│ ├────────┤ │  └──────────────┘  └──────────────┘  └──────────────┘  │
│ │Churn   │ │                                                        │
│ ├────────┤ │  ┌─────────────────────────────────────────────────┐   │
│ │Cohorts │ │  │                                                 │   │
│ ├────────┤ │  │              CHART / TABLE AREA                 │   │
│ │Customers│ │  │                                                 │   │
│ └────────┘ │  └─────────────────────────────────────────────────┘   │
│            │                                                        │
└────────────┴────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
InsightsDashboard (Layout)
├── Sidebar
│   └── NavigationMenu
├── Header
│   ├── PageTitle
│   ├── FilterControls
│   └── ExportButtons
└── MainContent
    ├── OverviewPage
    │   ├── StatCards (4x)
    │   ├── SegmentChart
    │   └── SegmentTable
    ├── SegmentsPage
    │   ├── SegmentChart
    │   └── SegmentTable
    ├── LTVPage
    │   └── LTVChart
    ├── ChurnPage
    │   └── ChurnChart
    ├── CohortsPage
    │   ├── CohortView
    │   └── CohortChart
    └── CustomerDetailPage
        ├── CustomerDetail
        └── TimelineView
```

### Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Backend   │────▶│  React      │────▶│  Dashboard  │
│   APIs      │     │  Query      │     │  Components │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ /segments   │     │  Cache      │     │  Charts     │
│ /ltv        │     │  Layer      │     │  Tables     │
│ /churn      │     │             │     │  Cards      │
│ /cohorts    │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Expected Deliverables

### File Structure

```
frontend/
├── components/
│   └── insights/
│       ├── InsightsDashboard.tsx      # Task 69
│       ├── OverviewPage.tsx           # Task 70
│       ├── CustomerDetail.tsx         # Task 75
│       ├── TimelineView.tsx           # Task 76
│       ├── CohortView.tsx             # Task 77
│       ├── FilterControls.tsx         # Task 79
│       ├── ExportCSV.tsx              # Task 80
│       ├── ExportPDF.tsx              # Task 81
│       ├── SegmentTable.tsx           # Task 72
│       └── charts/
│           ├── SegmentChart.tsx       # Task 71
│           ├── LTVChart.tsx           # Task 73
│           ├── ChurnChart.tsx         # Task 74
│           └── CohortChart.tsx        # Task 78
├── pages/
│   └── insights/
│       ├── index.tsx                  # Overview route
│       ├── segments.tsx               # Segments route
│       ├── ltv.tsx                    # LTV route
│       ├── churn.tsx                  # Churn route
│       ├── cohorts.tsx                # Cohorts route
│       └── customers/
│           └── [id].tsx               # Customer detail route
└── hooks/
    └── insights/
        ├── useSegments.ts
        ├── useLTV.ts
        ├── useChurn.ts
        └── useCohorts.ts
```

---

## Task 69: Create Dashboard Layout

> **Priority:** Medium | **Component:** InsightsDashboard | **Access:** Tenant Admin

### Objective

Create the main dashboard layout component with sidebar navigation, header section, and main content area that serves as the container for all insights pages.

### Layout Specifications

| Section | Width | Position | Content |
|---------|-------|----------|---------|
| Sidebar | 240px | Left fixed | Navigation menu |
| Header | Auto | Top of main | Title, filters, actions |
| Main | Remaining | Right of sidebar | Page content |

### Sidebar Navigation Items

| Nav Item | Icon | Route | Description |
|----------|------|-------|-------------|
| Overview | Dashboard | /insights | Summary page |
| Segments | Users | /insights/segments | Segment analysis |
| LTV | Dollar | /insights/ltv | Lifetime value |
| Churn Risk | Warning | /insights/churn | Risk analysis |
| Cohorts | Calendar | /insights/cohorts | Cohort analysis |
| Customers | User | /insights/customers | Customer list |

### Implementation Instructions

1. **Create Layout Component**
   - Create InsightsDashboard.tsx as wrapper component
   - Implement responsive flex/grid layout
   - Accept children prop for main content

2. **Build Sidebar**
   - Create fixed-width sidebar with navigation links
   - Highlight active route using Next.js router
   - Include collapse toggle for mobile view
   - Add tenant logo at top of sidebar

3. **Build Header**
   - Display current page title dynamically
   - Include slot for FilterControls component
   - Add export action buttons area
   - Include breadcrumb navigation

4. **Implement Responsiveness**
   - Collapsible sidebar on mobile (hamburger menu)
   - Adjust main content padding based on sidebar state
   - Stack header elements vertically on small screens

### Access Control

| Check | Implementation |
|-------|----------------|
| Auth Required | Wrap with authentication HOC |
| Role Check | Verify tenant_admin role |
| Redirect | Send to login if unauthorized |

### Acceptance Criteria

- [ ] Sidebar displays all navigation items with icons
- [ ] Active page is highlighted in sidebar
- [ ] Header shows current page title
- [ ] Main content area renders child components
- [ ] Layout is responsive on mobile devices
- [ ] Unauthorized users are redirected

---

## Task 70: Create Overview Page

> **Priority:** Medium | **Component:** OverviewPage | **Type:** Summary Statistics

### Objective

Create the main overview page displaying summary statistics cards and quick-view charts for customer insights.

### Statistics Cards Specifications

| Card | Metric | API Field | Format | Icon |
|------|--------|-----------|--------|------|
| Total Customers | Active count | `total_active` | Number | Users |
| Average LTV | Mean value | `avg_ltv` | Currency | Dollar |
| At-Risk | High-risk count | `high_risk_count` | Number | Alert |
| Champions | Champion count | `champion_count` | Number | Star |

### Card Layout Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    OVERVIEW PAGE                           │
├───────────────┬───────────────┬───────────────┬───────────┤
│ 👥 Total      │ 💰 Avg LTV   │ ⚠️ At-Risk    │ ⭐ Champs  │
│ Customers     │              │               │           │
│    1,234      │   $456.78    │     89        │    234    │
│   +5.2%       │   +12.3%     │   -2.1%       │   +8.4%   │
└───────────────┴───────────────┴───────────────┴───────────┘
```

### Implementation Instructions

1. **Create StatCard Component**
   - Build reusable card with icon, title, value, change indicator
   - Support positive/negative change styling (green/red)
   - Include loading skeleton state

2. **Fetch Overview Data**
   - Create useOverviewStats hook
   - Call GET /api/insights/overview endpoint
   - Implement React Query for caching
   - Handle loading and error states

3. **Layout Cards Grid**
   - Use 4-column grid on desktop
   - 2-column on tablet, 1-column on mobile
   - Equal card heights with flexbox

4. **Add Quick Charts Section**
   - Include mini SegmentChart (pie) below cards
   - Include mini recent trends chart
   - Link to full analysis pages

### Data Structure Expected

| Field | Type | Description |
|-------|------|-------------|
| total_active | integer | Active customer count |
| avg_ltv | decimal | Average lifetime value |
| high_risk_count | integer | Customers at high churn risk |
| champion_count | integer | Champion segment count |
| period_change | object | Percentage changes from last period |

### Acceptance Criteria

- [ ] Four statistics cards display correctly
- [ ] Cards show loading skeletons during fetch
- [ ] Percentage changes show with correct colors
- [ ] Quick charts render below cards
- [ ] Data refreshes when filters change

---

## Task 71: Create Segment Chart

> **Priority:** Medium | **Component:** SegmentChart | **Type:** Pie Chart

### Objective

Create a pie chart component displaying customer segment distribution using Recharts.

### Segment Color Scheme

| Segment | Color Code | Color Name |
|---------|------------|------------|
| Champions | #FFD700 | Gold |
| Loyal | #3B82F6 | Blue |
| Promising | #22C55E | Green |
| At Risk | #F97316 | Orange |
| Lost | #EF4444 | Red |
| New | #A855F7 | Purple |

### Chart Configuration

| Property | Value |
|----------|-------|
| Chart Type | PieChart (Recharts) |
| Inner Radius | 60 (donut style) |
| Outer Radius | 100 |
| Label | Segment name + percentage |
| Legend | Bottom, horizontal |
| Tooltip | Segment name, count, percentage |

### Visual Layout

```
        ┌─────────────────┐
        │    SEGMENTS     │
        │                 │
        │     ╭─────╮     │
        │   ╱ Champ  ╲    │
        │  │  Loyal   │   │
        │   ╲ Others ╱    │
        │     ╰─────╯     │
        │                 │
        │ 🟡🔵🟢🟠🔴🟣  │
        └─────────────────┘
```

### Implementation Instructions

1. **Setup Recharts PieChart**
   - Import PieChart, Pie, Cell, Legend, Tooltip from recharts
   - Configure responsive container wrapper
   - Set donut style with inner radius

2. **Process Segment Data**
   - Transform API data to chart format
   - Calculate percentages from counts
   - Sort by count descending

3. **Apply Color Mapping**
   - Create SEGMENT_COLORS constant object
   - Map each Cell component to segment color
   - Apply consistent colors across dashboard

4. **Configure Interactions**
   - Add hover tooltip with details
   - Implement click handler for segment drill-down
   - Animate on data change

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | SegmentData[] | Yes | Segment distribution data |
| onSegmentClick | function | No | Click handler for drill-down |
| height | number | No | Chart height (default: 300) |
| showLegend | boolean | No | Show legend (default: true) |

### Acceptance Criteria

- [ ] Pie chart renders with correct segment colors
- [ ] Tooltips show segment details on hover
- [ ] Legend displays all segments
- [ ] Chart is responsive to container size
- [ ] Animation plays on data load/update

---

## Task 72: Create Segment Table

> **Priority:** Medium | **Component:** SegmentTable | **Type:** Data Table

### Objective

Create a data table component displaying customer segments with sortable columns and pagination.

### Table Columns

| Column | Field | Type | Sortable | Width |
|--------|-------|------|----------|-------|
| Customer | name | string | Yes | 25% |
| Segment | segment | badge | Yes | 15% |
| R/F/M | rfm_scores | 3 numbers | Yes | 15% |
| LTV | predicted_ltv | currency | Yes | 15% |
| Risk | churn_risk | percentage | Yes | 15% |
| Actions | - | buttons | No | 15% |

### Segment Badge Colors

| Segment | Background | Text |
|---------|------------|------|
| Champions | bg-yellow-100 | text-yellow-800 |
| Loyal | bg-blue-100 | text-blue-800 |
| Promising | bg-green-100 | text-green-800 |
| At Risk | bg-orange-100 | text-orange-800 |
| Lost | bg-red-100 | text-red-800 |
| New | bg-purple-100 | text-purple-800 |

### R/F/M Score Display

```
┌─────────────────────┐
│  R: 5  F: 4  M: 5   │  High scores
│  R: 2  F: 1  M: 3   │  Low scores
└─────────────────────┘
Display as: "5 / 4 / 5" with color coding
```

### Implementation Instructions

1. **Create Table Structure**
   - Build responsive table with fixed header
   - Implement horizontal scroll on mobile
   - Use semantic table elements

2. **Add Sorting Functionality**
   - Track sort column and direction in state
   - Display sort indicators on column headers
   - Sort data client-side or request from API

3. **Implement Pagination**
   - Add page size selector (10, 25, 50, 100)
   - Display page navigation controls
   - Show "Showing X-Y of Z" text

4. **Add Row Actions**
   - View Detail button → navigate to customer detail
   - Quick actions dropdown (optional)
   - Row click handler for selection

5. **Style Segment Badges**
   - Create SegmentBadge sub-component
   - Apply color based on segment name
   - Ensure consistent sizing

### Acceptance Criteria

- [ ] Table displays all columns correctly
- [ ] Columns are sortable with visual indicators
- [ ] Pagination controls work correctly
- [ ] Segment badges show correct colors
- [ ] View Detail navigates to customer page
- [ ] Table is responsive on mobile

---

## Task 73: Create LTV Chart

> **Priority:** Medium | **Component:** LTVChart | **Type:** Bar Chart

### Objective

Create a bar chart component displaying customer distribution across LTV tiers.

### LTV Tier Definitions

| Tier | Range | Color | Description |
|------|-------|-------|-------------|
| Premium | $1000+ | #10B981 | High-value customers |
| High | $500-999 | #3B82F6 | Above average LTV |
| Medium | $200-499 | #F59E0B | Average LTV |
| Low | $50-199 | #F97316 | Below average |
| Minimal | <$50 | #EF4444 | Low value |

### Chart Layout

```
┌────────────────────────────────────────┐
│           LTV DISTRIBUTION             │
│                                        │
│  Premium  ████████████████  (234)      │
│  High     ████████████████████ (456)   │
│  Medium   ██████████████████████ (567) │
│  Low      ████████████ (189)           │
│  Minimal  ████████ (123)               │
│                                        │
│         0    200   400   600   800     │
└────────────────────────────────────────┘
```

### Implementation Instructions

1. **Setup Recharts BarChart**
   - Import BarChart, Bar, XAxis, YAxis, Tooltip from recharts
   - Configure horizontal bar layout
   - Set responsive container

2. **Configure Axes**
   - Y-axis: LTV tier names
   - X-axis: Customer count
   - Add grid lines for readability

3. **Apply Tier Colors**
   - Create LTV_TIER_COLORS constant
   - Use Cell components for individual bar colors
   - Match colors to tier definitions

4. **Add Interactivity**
   - Tooltip showing tier details and count
   - Click handler for filtering by tier
   - Hover highlight effect

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | LTVTierData[] | Yes | Tier distribution data |
| onTierClick | function | No | Click handler for filtering |
| orientation | string | No | 'horizontal' or 'vertical' |

### Acceptance Criteria

- [ ] Bar chart displays all LTV tiers
- [ ] Bars have correct tier colors
- [ ] Tooltips show tier details
- [ ] Chart updates when data changes
- [ ] Click on bar triggers filter action

---

## Task 74: Create Churn Chart

> **Priority:** Medium | **Component:** ChurnChart | **Type:** Bar Chart

### Objective

Create a bar chart component displaying customer distribution across churn risk tiers.

### Risk Tier Definitions

| Tier | Probability Range | Color | Action |
|------|------------------|-------|--------|
| Critical | 80-100% | #DC2626 | Immediate intervention |
| High | 60-79% | #F97316 | Priority outreach |
| Medium | 40-59% | #F59E0B | Monitor closely |
| Low | 20-39% | #3B82F6 | Standard engagement |
| Minimal | 0-19% | #10B981 | Maintain relationship |

### Chart Layout

```
┌────────────────────────────────────────┐
│          CHURN RISK DISTRIBUTION       │
│                                        │
│        🔴 Critical  ████ (45)          │
│        🟠 High      ████████ (89)      │
│        🟡 Medium    ██████████ (156)   │
│        🔵 Low       ████████████ (234) │
│        🟢 Minimal   ██████████████(345)│
│                                        │
│              Customer Count            │
└────────────────────────────────────────┘
```

### Implementation Instructions

1. **Setup Horizontal Bar Chart**
   - Use Recharts BarChart component
   - Configure for horizontal display
   - Set dynamic height based on data

2. **Configure Risk Colors**
   - Create RISK_TIER_COLORS constant
   - Apply gradient or solid fills
   - Use color-blind friendly palette option

3. **Add Percentage Labels**
   - Show count and percentage on bars
   - Position labels inside or outside based on bar width
   - Format percentages to one decimal

4. **Implement Drill-Down**
   - Click on bar → filter customer table
   - Navigate to risk-specific view
   - Highlight selected tier

### Additional Features

| Feature | Description |
|---------|-------------|
| Trend Indicator | Show change from previous period |
| Alert Threshold | Highlight if critical tier exceeds X% |
| Comparison Mode | Toggle to show previous period overlay |

### Acceptance Criteria

- [ ] Bar chart displays all risk tiers
- [ ] Colors correctly indicate risk severity
- [ ] Counts and percentages displayed
- [ ] Click triggers customer list filter
- [ ] Responsive on all screen sizes

---

## Task 75: Create Customer Detail

> **Priority:** Medium | **Component:** CustomerDetail | **Type:** Profile View

### Objective

Create a comprehensive single-customer view component displaying all AI-derived insights and customer information.

### Section Layout

```
┌─────────────────────────────────────────────────────────────┐
│                     CUSTOMER DETAIL                         │
├─────────────────────────┬───────────────────────────────────┤
│                         │                                   │
│  ┌──────────────────┐   │   ┌─────────────────────────────┐ │
│  │     PROFILE      │   │   │        METRICS              │ │
│  │  👤 John Smith   │   │   │  Orders: 45  │ Spend: $2.3k │ │
│  │  📧 john@ex.com  │   │   │  AOV: $51    │ Last: 5 days │ │
│  │  📱 555-1234     │   │   └─────────────────────────────┘ │
│  └──────────────────┘   │                                   │
│                         │   ┌─────────────────────────────┐ │
│  ┌──────────────────┐   │   │      SEGMENT / RFM          │ │
│  │   LTV INSIGHTS   │   │   │  Segment: Champions ⭐      │ │
│  │  Predicted: $890 │   │   │  R: 5  │  F: 5  │  M: 4     │ │
│  │  Tier: Premium   │   │   └─────────────────────────────┘ │
│  │  Confidence: 85% │   │                                   │
│  └──────────────────┘   │   ┌─────────────────────────────┐ │
│                         │   │      CHURN RISK             │ │
│  ┌──────────────────┐   │   │  Probability: 12% 🟢        │ │
│  │    TIMELINE      │   │   │  Tier: Minimal              │ │
│  │  (See Task 76)   │   │   │  Factors: None significant  │ │
│  └──────────────────┘   │   └─────────────────────────────┘ │
│                         │                                   │
└─────────────────────────┴───────────────────────────────────┘
```

### Section Specifications

| Section | Fields | Source |
|---------|--------|--------|
| Profile | Name, Email, Phone, Join Date | Customer API |
| Metrics | Total Orders, Total Spend, AOV, Days Since Last | Aggregated |
| Segment | Segment Name, R/F/M Scores, Segment Since | Segmentation API |
| LTV | Predicted Value, Tier, Confidence, Trend | LTV API |
| Risk | Churn Probability, Tier, Risk Factors | Churn API |
| Timeline | Order History | Timeline API |

### Implementation Instructions

1. **Create Page Layout**
   - Two-column layout on desktop
   - Single column on mobile
   - Sticky header with customer name

2. **Build Profile Section**
   - Display avatar (initials if no image)
   - Show contact information
   - Include member since date

3. **Build Metrics Card**
   - Create grid of key metrics
   - Format currency and numbers appropriately
   - Show comparison to average

4. **Build Segment Card**
   - Display segment badge with color
   - Show R/F/M scores with visual bars
   - Include segment movement history

5. **Build LTV Card**
   - Display predicted value prominently
   - Show tier indicator
   - Include confidence level and trend arrow

6. **Build Risk Card**
   - Display probability with color indicator
   - Show contributing risk factors
   - Include recommended actions

7. **Integrate Timeline**
   - Embed TimelineView component (Task 76)
   - Allow expand/collapse
   - Show recent 5 entries, link to full history

### Acceptance Criteria

- [ ] All customer sections display correctly
- [ ] Data loads from multiple API endpoints
- [ ] Responsive layout on all devices
- [ ] RFM scores visualized clearly
- [ ] Risk factors listed when applicable
- [ ] Timeline embedded and functional

---

## Task 76: Create Timeline View

> **Priority:** Medium | **Component:** TimelineView | **Type:** Vertical Timeline

### Objective

Create a vertical timeline component displaying customer order history with visual connectors.

### Timeline Entry Structure

| Field | Type | Description |
|-------|------|-------------|
| Date | datetime | Order date formatted |
| Order Number | string | Order reference ID |
| Amount | currency | Order total value |
| Item Count | integer | Number of items |
| Status | string | Order status |

### Visual Layout

```
┌─────────────────────────────────────────┐
│            ORDER TIMELINE               │
│                                         │
│  ● Jan 28, 2026                        │
│  │  Order #1234 • $156.00 • 3 items    │
│  │  Status: Delivered ✓                │
│  │                                      │
│  ● Jan 15, 2026                        │
│  │  Order #1198 • $89.50 • 2 items     │
│  │  Status: Delivered ✓                │
│  │                                      │
│  ● Dec 22, 2025                        │
│  │  Order #1156 • $234.00 • 5 items    │
│  │  Status: Delivered ✓                │
│  │                                      │
│  ○ Load More...                        │
│                                         │
└─────────────────────────────────────────┘
```

### Implementation Instructions

1. **Create Timeline Container**
   - Vertical layout with connector line
   - Scrollable container for long histories
   - Group by month/year optionally

2. **Build Timeline Entry Component**
   - Circular bullet point on left
   - Vertical connector line between entries
   - Entry content card on right

3. **Display Entry Information**
   - Date formatted as "MMM DD, YYYY"
   - Order number as link to order detail
   - Amount in local currency format
   - Item count with plural handling

4. **Add Status Indicators**
   - Delivered: Green checkmark
   - Processing: Yellow spinner
   - Cancelled: Red X
   - Pending: Gray clock

5. **Implement Pagination**
   - Load initial 10 entries
   - "Load More" button at bottom
   - Infinite scroll option

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| customerId | string | Yes | Customer ID for data fetch |
| limit | number | No | Initial entries to show |
| showLoadMore | boolean | No | Enable load more button |

### Acceptance Criteria

- [ ] Timeline displays chronologically
- [ ] Visual connectors between entries
- [ ] Status icons display correctly
- [ ] Load more functionality works
- [ ] Order links navigate to order detail

---

## Task 77: Create Cohort View

> **Priority:** Medium | **Component:** CohortView | **Type:** Cohort Analysis Table

### Objective

Create a cohort analysis table showing customer retention rates across time periods.

### Cohort Table Structure

```
┌────────────────────────────────────────────────────────────────┐
│                     COHORT ANALYSIS                            │
├──────────┬─────────┬─────────┬─────────┬─────────┬─────────────┤
│  Cohort  │ Month 0 │ Month 1 │ Month 2 │ Month 3 │ Month 4 ... │
├──────────┼─────────┼─────────┼─────────┼─────────┼─────────────┤
│ Jan 2026 │  100%   │  78%    │  65%    │   -     │    -        │
│ Dec 2025 │  100%   │  82%    │  71%    │  62%    │    -        │
│ Nov 2025 │  100%   │  75%    │  68%    │  59%    │   52%       │
│ Oct 2025 │  100%   │  80%    │  72%    │  64%    │   58%       │
│ Sep 2025 │  100%   │  77%    │  69%    │  61%    │   54%       │
└──────────┴─────────┴─────────┴─────────┴─────────┴─────────────┘
                     Color gradient: Green → Yellow → Red
```

### Color Scale for Retention

| Retention % | Color | Meaning |
|-------------|-------|---------|
| 80-100% | Deep Green | Excellent |
| 60-79% | Light Green | Good |
| 40-59% | Yellow | Average |
| 20-39% | Orange | Below Average |
| 0-19% | Red | Poor |

### Implementation Instructions

1. **Create Table Structure**
   - Fixed first column (cohort name)
   - Scrollable columns for months
   - Highlight diagonal pattern

2. **Apply Heatmap Coloring**
   - Calculate color based on retention value
   - Use CSS background colors
   - Ensure text contrast meets accessibility

3. **Display Cell Values**
   - Show percentage with one decimal
   - Show "-" for future months
   - Show customer count in tooltip

4. **Add Cohort Selection**
   - Dropdown to select time range
   - Options: Last 6 months, Last 12 months, Custom
   - Update table on selection change

5. **Add Summary Row**
   - Average retention per month column
   - Highlight best/worst performing cohorts
   - Show trend indicator

### Data Structure Expected

| Field | Type | Description |
|-------|------|-------------|
| cohort_month | string | YYYY-MM format |
| cohort_size | integer | Starting customer count |
| retention | array | Array of retention percentages |

### Acceptance Criteria

- [ ] Table displays all cohorts correctly
- [ ] Heatmap colors applied based on values
- [ ] Future months show dash
- [ ] Tooltips show customer counts
- [ ] Time range selection updates table

---

## Task 78: Create Cohort Chart

> **Priority:** Medium | **Component:** CohortChart | **Type:** Line Chart

### Objective

Create a multi-line chart showing retention curves for different customer cohorts over time.

### Chart Layout

```
┌─────────────────────────────────────────────────────────────┐
│                   RETENTION CURVES                          │
│  100% ─┬─────────────────────────────────────────────────   │
│        │ ╲                                                  │
│   80% ─┤  ╲___                                             │
│        │      ╲___                                         │
│   60% ─┤          ╲___  ╲___                               │
│        │              ╲___  ╲___                           │
│   40% ─┤                  ╲___  ╲___                       │
│        │                      ╲___                         │
│   20% ─┤                          ╲___                     │
│        │                              ╲                    │
│    0% ─┴─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────   │
│              M0    M1    M2    M3    M4    M5    M6        │
│                                                            │
│  ── Jan 2026  ── Dec 2025  ── Nov 2025  ── Oct 2025       │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Instructions

1. **Setup Recharts LineChart**
   - Import LineChart, Line, XAxis, YAxis, Legend from recharts
   - Configure responsive container
   - Set percentage Y-axis (0-100%)

2. **Configure Multiple Lines**
   - One line per cohort
   - Different colors for each line
   - Match colors to cohort table

3. **Add Reference Lines**
   - Average retention line (dashed)
   - Target retention line if configured
   - Highlight important thresholds

4. **Configure Interactions**
   - Tooltip showing all cohort values at point
   - Click on legend to toggle line visibility
   - Zoom/pan for detailed view

5. **Add Cohort Selector**
   - Toggle which cohorts to display
   - Limit to prevent visual clutter (max 6-8 lines)
   - Default to most recent cohorts

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | CohortData[] | Yes | Array of cohort retention data |
| cohorts | string[] | No | Cohorts to display (default: recent 6) |
| showAverage | boolean | No | Show average line |
| showTarget | boolean | No | Show target retention line |

### Acceptance Criteria

- [ ] Multiple cohort lines display correctly
- [ ] Legend toggles line visibility
- [ ] Tooltip shows all values at hover point
- [ ] Average line displays if enabled
- [ ] Chart is responsive

---

## Task 79: Create Filter Controls

> **Priority:** Low | **Component:** FilterControls | **Type:** Filter Panel

### Objective

Create a unified filter control component for filtering dashboard data across all views.

### Filter Components

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Segment | Multi-select | All segments | All selected |
| Date Range | Date picker | Custom range | Last 30 days |
| LTV Tier | Dropdown | Premium, High, Medium, Low, Minimal | All |
| Risk Tier | Dropdown | Critical, High, Medium, Low, Minimal | All |
| Search | Text input | Customer name/email | Empty |

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                        FILTER CONTROLS                          │
├─────────────┬─────────────┬───────────────┬──────────┬──────────┤
│ [Segments▾] │ [Date Range]│ [LTV Tier ▾]  │[Risk ▾]  │[🔍 Search]│
│ Multi-select│ Picker      │ Dropdown      │ Dropdown │ Text     │
└─────────────┴─────────────┴───────────────┴──────────┴──────────┘
                     [Clear All]  [Apply Filters]
```

### Implementation Instructions

1. **Create Filter Container**
   - Horizontal layout on desktop
   - Collapsible panel on mobile
   - Sticky position option

2. **Build Segment Multi-Select**
   - Checkbox list for all segments
   - "Select All" / "Clear" options
   - Show selected count in trigger button

3. **Build Date Range Picker**
   - Preset options: Today, Last 7 days, Last 30 days, Last 90 days
   - Custom range selection
   - Display selected range in trigger

4. **Build Tier Dropdowns**
   - Single-select for LTV tier
   - Single-select for risk tier
   - "All" option at top

5. **Build Search Input**
   - Debounced text input (300ms)
   - Clear button when has value
   - Placeholder: "Search customers..."

6. **Implement Filter State**
   - Store filter state in URL query params
   - Persist across page navigation
   - Share filter state via link

7. **Add Action Buttons**
   - Clear All: Reset all filters to default
   - Apply Filters: Trigger data refresh

### Filter State Interface

| Field | Type | Description |
|-------|------|-------------|
| segments | string[] | Selected segment names |
| dateFrom | Date | Start date |
| dateTo | Date | End date |
| ltvTier | string | Selected LTV tier |
| riskTier | string | Selected risk tier |
| search | string | Search query |

### Acceptance Criteria

- [ ] All filter types function correctly
- [ ] Filters persist in URL params
- [ ] Clear All resets all filters
- [ ] Filter changes trigger data refresh
- [ ] Responsive on mobile

---

## Task 80: Create Export CSV

> **Priority:** Low | **Component:** ExportCSV | **Type:** Data Export

### Objective

Create a CSV export function to download filtered customer data.

### CSV Columns

| Column Name | Source Field | Format |
|-------------|--------------|--------|
| customer_id | id | String |
| name | full_name | String |
| email | email | String |
| segment | segment_name | String |
| rfm_score | rfm_combined | "R-F-M" format |
| ltv | predicted_ltv | Decimal (2 places) |
| ltv_tier | ltv_tier_name | String |
| churn_risk | churn_probability | Percentage |
| risk_tier | risk_tier_name | String |
| last_order_date | last_order_at | ISO date |

### Implementation Instructions

1. **Create Export Function**
   - Accept filtered data array as input
   - Generate CSV header row from column definitions
   - Format each row according to column specs

2. **Handle Data Formatting**
   - Escape commas and quotes in string values
   - Format decimals with proper precision
   - Convert dates to ISO format

3. **Trigger Download**
   - Create Blob from CSV string
   - Generate download URL using URL.createObjectURL
   - Create temporary anchor element and trigger click
   - Clean up URL object after download

4. **Add Filename Generation**
   - Include date in filename: `customer-insights-YYYY-MM-DD.csv`
   - Include filter context if applicable
   - Ensure valid filename characters

5. **Create Export Button Component**
   - Button with download icon
   - Loading state during generation
   - Success/error toast notification

### Export Flow

```
[Export CSV Button]
        │
        ▼
┌───────────────────┐
│ Get filtered data │
│ from current view │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Format data as    │
│ CSV string        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Create Blob and   │
│ trigger download  │
└─────────┬─────────┘
          │
          ▼
   [File Downloaded]
```

### Acceptance Criteria

- [ ] CSV generates with correct columns
- [ ] Data properly escaped for CSV format
- [ ] File downloads with appropriate name
- [ ] Export respects current filters
- [ ] Loading state shown during export

---

## Task 81: Create Export PDF

> **Priority:** Medium | **Component:** ExportPDF | **Type:** Report Generation

### Objective

Create a PDF report generator that exports the current dashboard view with charts and data using jspdf and html2canvas.

### PDF Report Structure

```
┌─────────────────────────────────────────────┐
│          CUSTOMER INSIGHTS REPORT           │
│            Generated: Jan 31, 2026          │
│            Tenant: ABC Company              │
├─────────────────────────────────────────────┤
│                                             │
│  EXECUTIVE SUMMARY                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│  │Stats│ │Stats│ │Stats│ │Stats│           │
│  └─────┘ └─────┘ └─────┘ └─────┘           │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  SEGMENT DISTRIBUTION                       │
│  [Pie Chart Image]                          │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  LTV ANALYSIS                               │
│  [Bar Chart Image]                          │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  CUSTOMER DATA TABLE                        │
│  [Table Rows...]                            │
│                                             │
├─────────────────────────────────────────────┤
│  Page 1 of N          Confidential          │
└─────────────────────────────────────────────┘
```

### Required Libraries

| Library | Purpose | Installation |
|---------|---------|--------------|
| jspdf | PDF generation | npm install jspdf |
| html2canvas | HTML to image | npm install html2canvas |

### Implementation Instructions

1. **Setup PDF Document**
   - Create new jsPDF instance with A4 size
   - Set document properties (title, author, date)
   - Configure margins and page layout

2. **Capture Charts as Images**
   - Use html2canvas to render chart elements
   - Convert canvas to image data URL
   - Size images proportionally for PDF

3. **Build Report Sections**
   - Add header with title and metadata
   - Add summary statistics section
   - Add chart images with captions
   - Add data table with pagination

4. **Handle Multiple Pages**
   - Calculate content height per page
   - Add page breaks between sections
   - Include page numbers in footer

5. **Add Styling**
   - Apply consistent fonts (Helvetica)
   - Use brand colors for headings
   - Add borders and backgrounds

6. **Trigger Download**
   - Generate PDF blob
   - Download with filename including date
   - Show progress indicator during generation

### Export Flow

```
[Export PDF Button]
        │
        ▼
┌───────────────────┐
│ Capture charts    │
│ with html2canvas  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Initialize jsPDF  │
│ document          │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Add sections:     │
│ - Header          │
│ - Summary         │
│ - Charts          │
│ - Table           │
│ - Footer          │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Save and download │
│ PDF file          │
└─────────┬─────────┘
          │
          ▼
   [File Downloaded]
```

### Acceptance Criteria

- [ ] PDF generates with all report sections
- [ ] Charts rendered clearly as images
- [ ] Multiple pages handled correctly
- [ ] Page numbers included in footer
- [ ] File downloads with correct name
- [ ] Loading indicator during generation

---

## Task 82: Verify Dashboard

> **Priority:** Low | **Type:** Integration Verification

### Objective

Verify that all dashboard components work correctly together and meet requirements.

### Verification Checklist

#### Layout & Navigation (Task 69)

| Check | Verification Step | Pass/Fail |
|-------|-------------------|-----------|
| Sidebar renders | Verify sidebar appears with all nav items | ☐ |
| Navigation works | Click each nav item, verify page loads | ☐ |
| Active state | Verify current page highlighted in sidebar | ☐ |
| Mobile responsive | Test sidebar collapse on mobile | ☐ |
| Auth redirect | Test access without login | ☐ |

#### Overview Page (Task 70)

| Check | Verification Step | Pass/Fail |
|-------|-------------------|-----------|
| Stats load | Verify four stat cards display data | ☐ |
| Loading state | Verify skeleton shows during load | ☐ |
| Change indicators | Verify percentage changes display | ☐ |
| Quick charts | Verify charts render below cards | ☐ |

#### Charts (Tasks 71, 73, 74, 78)

| Check | Verification Step | Pass/Fail |
|-------|-------------------|-----------|
| Segment chart | Verify pie chart with correct colors | ☐ |
| LTV chart | Verify bar chart with tier colors | ☐ |
| Churn chart | Verify risk distribution chart | ☐ |
| Cohort chart | Verify multi-line retention curves | ☐ |
| Tooltips | Verify tooltips on all charts | ☐ |
| Responsiveness | Verify charts resize correctly | ☐ |

#### Tables & Views (Tasks 72, 76, 77)

| Check | Verification Step | Pass/Fail |
|-------|-------------------|-----------|
| Segment table | Verify columns and sorting | ☐ |
| Pagination | Verify page controls work | ☐ |
| Timeline | Verify order history displays | ☐ |
| Cohort table | Verify heatmap colors | ☐ |

#### Customer Detail (Task 75)

| Check | Verification Step | Pass/Fail |
|-------|-------------------|-----------|
| Profile section | Verify customer info displays | ☐ |
| Metrics section | Verify aggregated metrics | ☐ |
| Segment section | Verify RFM scores display | ☐ |
| LTV section | Verify predicted value and tier | ☐ |
| Risk section | Verify churn probability | ☐ |
| Timeline | Verify embedded timeline works | ☐ |

#### Filters (Task 79)

| Check | Verification Step | Pass/Fail |
|-------|-------------------|-----------|
| Segment filter | Verify multi-select works | ☐ |
| Date range | Verify date picker works | ☐ |
| LTV tier | Verify dropdown works | ☐ |
| Risk tier | Verify dropdown works | ☐ |
| Search | Verify search filters data | ☐ |
| Clear All | Verify filters reset | ☐ |
| URL params | Verify filters persist in URL | ☐ |

#### Export (Tasks 80, 81)

| Check | Verification Step | Pass/Fail |
|-------|-------------------|-----------|
| CSV export | Verify CSV downloads with data | ☐ |
| CSV format | Verify columns match specification | ☐ |
| PDF export | Verify PDF generates with charts | ☐ |
| PDF pages | Verify multi-page handling | ☐ |
| Filter respect | Verify exports use current filters | ☐ |

### Integration Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Full flow | Navigate through all pages | All pages render correctly |
| Filter cascade | Apply filters, verify all components update | Data filtered consistently |
| Export after filter | Apply filters, export CSV/PDF | Export contains filtered data |
| Customer drill-down | Click customer in table, view detail | Detail page loads with correct data |
| Mobile experience | Test on mobile viewport | All features accessible |

### Performance Checks

| Metric | Target | Verification |
|--------|--------|--------------|
| Initial load | < 3 seconds | Measure time to interactive |
| Chart render | < 1 second | Time from data fetch to render |
| Filter response | < 500ms | Time from filter change to update |
| Export CSV | < 2 seconds | Time to generate and download |
| Export PDF | < 5 seconds | Time to generate and download |

### Final Sign-Off

| Approver | Role | Date | Signature |
|----------|------|------|-----------|
| | Frontend Lead | | |
| | Product Owner | | |
| | QA Engineer | | |

### Acceptance Criteria

- [ ] All verification checks pass
- [ ] Integration scenarios complete successfully
- [ ] Performance targets met
- [ ] No console errors in browser
- [ ] Accessibility review complete
- [ ] Sign-off obtained from stakeholders

---

## API Endpoints Reference

### Required Backend Endpoints

| Endpoint | Method | Description | Component |
|----------|--------|-------------|-----------|
| /api/insights/overview | GET | Summary statistics | OverviewPage |
| /api/insights/segments | GET | Segment distribution | SegmentChart, SegmentTable |
| /api/insights/ltv | GET | LTV tier distribution | LTVChart |
| /api/insights/churn | GET | Churn risk distribution | ChurnChart |
| /api/insights/cohorts | GET | Cohort analysis data | CohortView, CohortChart |
| /api/insights/customers | GET | Paginated customer list | SegmentTable |
| /api/insights/customers/{id} | GET | Single customer detail | CustomerDetail |
| /api/insights/customers/{id}/timeline | GET | Customer order history | TimelineView |

### Query Parameters

| Parameter | Type | Description | Used By |
|-----------|------|-------------|---------|
| segments | string[] | Filter by segments | All components |
| date_from | date | Start date | All components |
| date_to | date | End date | All components |
| ltv_tier | string | Filter by LTV tier | SegmentTable, Export |
| risk_tier | string | Filter by risk tier | SegmentTable, Export |
| search | string | Search query | SegmentTable |
| page | integer | Page number | SegmentTable |
| page_size | integer | Items per page | SegmentTable |

---

## Dependencies Summary

### NPM Packages Required

| Package | Version | Purpose |
|---------|---------|---------|
| recharts | ^2.x | Chart components |
| jspdf | ^2.x | PDF generation |
| html2canvas | ^1.x | HTML to canvas |
| @tanstack/react-query | ^5.x | Data fetching |
| date-fns | ^2.x | Date formatting |

### Internal Dependencies

| Component | Depends On |
|-----------|------------|
| InsightsDashboard | All child pages |
| OverviewPage | SegmentChart, StatCard |
| CustomerDetail | TimelineView |
| FilterControls | All data components |
| ExportPDF | All chart components |

---

## Document Metadata

| Property | Value |
|----------|-------|
| Created | 2026-01-31 |
| Author | Development Team |
| Status | Implementation Ready |
| Tasks | 69-82 (14 tasks) |
| Estimated Effort | 8-10 days |

---

**End of Document**
