# Tasks 67-73: Dashboard Layout and Health Visualization

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 11 - Platform Analytics AI  
> **Group:** E - Admin Dashboard  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-74-80_Charts-Controls.md](02_Tasks-74-80_Charts-Controls.md)

---

## Document Overview

This document implements the foundational platform admin dashboard with comprehensive layout structure, overview page functionality, and sophisticated health visualization components. It establishes the administrative interface for platform-wide analytics, tenant management, and real-time health monitoring with responsive design and interactive data visualization.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create Dashboard Layout | High | 45 min |
| 68 | Create Overview Page | Medium | 35 min |
| 69 | Create KPI Cards | Medium | 30 min |
| 70 | Create Tenant List | Medium | 35 min |
| 71 | Create Health Column | Low | 25 min |
| 72 | Create Tenant Detail | High | 45 min |
| 73 | Create Health Chart | Medium | 40 min |

---

## Task 67: Create Dashboard Layout

### Overview
Create the foundational dashboard layout component that serves as the master template for the platform admin interface. This layout provides navigation, header functionality, responsive design, and the structural framework for all admin dashboard pages with modern UI patterns and accessibility features.

### Dependencies
- Task 66 (Verify Fraud Detection) must be complete
- Next.js project structure established
- Admin authentication system operational
- UI component library configured

### Instructions

1. **Create admin dashboard layout directory structure**
   - Navigate to `frontend/src/components/admin/`
   - Create `layout/` subdirectory for layout components
   - Create `DashboardLayout.tsx` as main layout component
   - Set up layout-specific styling files

2. **Implement main dashboard layout structure**
   - Create responsive grid-based layout with sidebar and main content
   - Implement collapsible sidebar navigation with section grouping
   - Add top header with platform branding and admin controls
   - Configure responsive breakpoints for mobile and tablet views

3. **Design navigation sidebar component**
   - Create navigation menu with hierarchical structure
   - Implement active route highlighting and breadcrumb navigation
   - Add section dividers for analytics, tenants, and system areas
   - Include navigation icons and tooltips for improved UX

4. **Configure header and toolbar components**
   - Add platform logo and admin dashboard title
   - Implement user profile dropdown with admin settings
   - Include notification bell with alert count indicator
   - Add theme toggle and accessibility controls

5. **Implement responsive layout behavior**
   - Configure sidebar collapse/expand functionality
   - Add mobile-first responsive design with hamburger menu
   - Implement tablet view with adaptive navigation
   - Set up keyboard navigation and focus management

6. **Set up layout state management**
   - Create layout context for sidebar and theme state
   - Implement localStorage persistence for user preferences
   - Add loading states and error boundaries
   - Configure SEO metadata and page titles

### Dashboard Layout Architecture

```
Admin Dashboard Structure:
┌────────────────────────────────────────────────────────────┐
│                    Platform Admin Header                    │
│  ┌─────────┐ ┌──────────────┐ ┌─────────┐ ┌─────────────┐ │
│  │  Logo   │ │ Breadcrumbs  │ │  Alerts │ │ User Menu   │ │
│  └─────────┘ └──────────────┘ └─────────┘ └─────────────┘ │
└────────────────────────────────────────────────────────────┘
│                                                            │
├─────────────┬──────────────────────────────────────────────┤
│             │                                              │
│  Sidebar    │                Main Content Area             │
│             │                                              │
│ ┌─────────┐ │  ┌─────────────────────────────────────────┐ │
│ │Analytics│ │  │                                         │ │
│ │ Health  │ │  │         Page Components                 │ │
│ │ Tenants │ │  │                                         │ │
│ │ Alerts  │ │  │                                         │ │
│ │ System  │ │  │                                         │ │
│ └─────────┘ │  └─────────────────────────────────────────┘ │
└─────────────┴──────────────────────────────────────────────┘
```

### Navigation Menu Structure

| Section | Routes | Purpose |
|---------|--------|---------|
| Overview | `/admin/dashboard` | Platform summary |
| Analytics | `/admin/analytics/*` | Data analysis |
| Tenants | `/admin/tenants/*` | Tenant management |
| Health | `/admin/health/*` | Health monitoring |
| Alerts | `/admin/alerts/*` | Alert management |
| System | `/admin/system/*` | System administration |

### Responsive Layout Breakpoints

| Device | Screen Width | Layout Behavior |
|--------|-------------|-----------------|
| Mobile | < 768px | Collapsed sidebar, hamburger menu |
| Tablet | 768px - 1024px | Compact sidebar, condensed header |
| Desktop | > 1024px | Full sidebar, complete header |
| Large | > 1440px | Expanded content area |

### Layout State Management

| State | Type | Purpose | Persistence |
|-------|------|---------|-------------|
| sidebarExpanded | boolean | Sidebar visibility | localStorage |
| currentTheme | string | UI theme selection | localStorage |
| activeRoute | string | Navigation highlighting | session |
| notificationCount | number | Alert counter | real-time |

### Expected Outcome
- Responsive admin dashboard layout with modern UI design
- Comprehensive navigation system with route management
- Mobile-optimized interface with accessibility features
- Foundation for all admin dashboard functionality

### Verification Checklist
- [ ] Layout component renders correctly across devices
- [ ] Navigation menu functions properly
- [ ] Responsive breakpoints work as expected
- [ ] Header and sidebar components integrated
- [ ] State management operational

---

## Task 68: Create Overview Page

### Overview
Implement the comprehensive overview page that provides platform administrators with essential metrics, system status, and key performance indicators in a unified dashboard view. This page serves as the central hub for platform monitoring with real-time data updates and interactive visualizations.

### Dependencies
- Task 67 (Dashboard Layout) must be complete
- Analytics data services available
- Real-time WebSocket connection established
- Chart libraries configured

### Instructions

1. **Create overview page component structure**
   - Navigate to `frontend/src/pages/admin/`
   - Create `overview.tsx` page component
   - Set up page layout with grid system
   - Configure SEO and metadata for overview page

2. **Implement platform summary statistics**
   - Create total tenants counter with growth indicator
   - Add active users metrics with period comparison
   - Include total revenue figures with trend analysis
   - Display system health status with color indicators

3. **Design real-time metrics dashboard**
   - Implement WebSocket connection for live data updates
   - Create auto-refreshing counters and status indicators
   - Add timestamp display for last data update
   - Configure data refresh intervals and error handling

4. **Set up overview data fetching**
   - Create API calls for platform summary statistics
   - Implement data aggregation and formatting
   - Add loading states and skeleton components
   - Configure error handling and retry mechanisms

5. **Implement overview page interactions**
   - Add clickable metric cards for drill-down navigation
   - Create hover effects and tooltips for additional context
   - Implement quick action buttons for common tasks
   - Add refresh button for manual data updates

6. **Configure overview page optimization**
   - Implement data caching for improved performance
   - Add progressive loading for better user experience
   - Configure responsive layout for mobile devices
   - Set up analytics tracking for admin interactions

### Overview Page Architecture

```
Platform Overview Layout:
┌─────────────────────────────────────────────────────────────┐
│                    Platform Status Bar                      │
│  ┌──────────────┐ ┌───────────────┐ ┌───────────────────┐  │
│  │ System Health│ │ Last Updated  │ │ Auto-Refresh      │  │
│  └──────────────┘ └───────────────┘ └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Key Metrics Grid                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │   Total    │ │   Active   │ │   Total    │ │  System  │ │
│  │  Tenants   │ │   Users    │ │  Revenue   │ │  Health  │ │
│  │    847     │ │   12,453   │ │  $847K     │ │    98%   │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                   Quick Actions Panel                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │ View Alerts │ │Manage Tenants│ │   Generate Report       ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Platform Summary Metrics

| Metric | Data Source | Update Frequency | Format |
|--------|-------------|------------------|--------|
| Total Tenants | TenantCount API | Real-time | Number with trend |
| Active Users | UserActivity API | Every 5 minutes | Number with percentage |
| Total Revenue | Revenue API | Hourly | Currency with growth |
| System Health | HealthCheck API | Real-time | Percentage with status |

### Real-time Data Updates

| Component | WebSocket Event | Fallback Interval | Error Handling |
|-----------|-----------------|-------------------|----------------|
| Tenant Counter | `tenant_count_update` | 30 seconds | Show last known |
| User Activity | `user_activity_update` | 60 seconds | Graceful degradation |
| Revenue Metrics | `revenue_update` | 300 seconds | Cache previous value |
| Health Status | `system_health_update` | 15 seconds | Alert on failure |

### Quick Actions Configuration

| Action | Route | Permission | Description |
|--------|-------|------------|-------------|
| View Alerts | `/admin/alerts` | admin.alerts | Current alert list |
| Manage Tenants | `/admin/tenants` | admin.tenants | Tenant management |
| Generate Report | `/admin/reports` | admin.reports | Create platform report |
| System Settings | `/admin/system` | admin.system | Platform configuration |

### Expected Outcome
- Comprehensive platform overview with real-time metrics
- Interactive dashboard with drill-down navigation
- Auto-updating data with WebSocket integration
- Mobile-responsive design with optimal performance

### Verification Checklist
- [ ] Overview page renders with correct layout
- [ ] Real-time data updates function properly
- [ ] Metric cards display accurate information
- [ ] Quick actions navigate correctly
- [ ] Mobile responsiveness verified

---

## Task 69: Create KPI Cards

### Overview
Implement sophisticated Key Performance Indicator (KPI) cards that display critical platform metrics with visual indicators, trend analysis, and comparative data. These cards provide administrators with at-a-glance insights into platform performance, tenant health, and business metrics.

### Dependencies
- Task 68 (Overview Page) must be complete
- Chart.js or Recharts library configured
- KPI data endpoints available
- Icon library integrated

### Instructions

1. **Create KPI card component architecture**
   - Navigate to `frontend/src/components/admin/cards/`
   - Create `KPICard.tsx` base component with TypeScript interfaces
   - Design reusable card structure with consistent styling
   - Implement card variants for different metric types

2. **Implement core KPI card functionality**
   - Create metric value display with large typography
   - Add trend indicators with color-coded arrows and percentages
   - Include comparison period labels and date ranges
   - Implement loading states with skeleton animations

3. **Design visual indicator system**
   - Add color-coded status indicators (green/yellow/red)
   - Implement progress bars for percentage-based metrics
   - Create mini-chart integration for trend visualization
   - Add icon system for quick metric identification

4. **Configure KPI data integration**
   - Set up API connections for metric data fetching
   - Implement data formatting and calculation functions
   - Add error handling for missing or invalid data
   - Configure auto-refresh intervals for real-time updates

5. **Implement interactive card features**
   - Add hover effects with expanded metric details
   - Create click-through navigation to detailed views
   - Implement tooltip system for metric explanations
   - Add card customization for different admin roles

6. **Set up KPI card variations**
   - Create tenant count cards with growth indicators
   - Implement revenue cards with period comparisons
   - Add health score cards with distribution charts
   - Configure alert count cards with severity levels

### KPI Card Architecture

```
KPI Card Component Structure:
┌─────────────────────────────────────────────────────────┐
│                    KPI Card Header                      │
│  ┌─────────┐  ┌────────────────────┐  ┌─────────────┐  │
│  │  Icon   │  │    Metric Title    │  │   Period    │  │
│  └─────────┘  └────────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────┘
│                                                         │
├─────────────────────────────────────────────────────────┤
│                  Primary Metric                         │
│                                                         │
│             ┌─────────────────┐                         │
│             │    $1,247K      │                         │
│             │   ↗ +12.5%      │                         │
│             └─────────────────┘                         │
└─────────────────────────────────────────────────────────┘
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    Trend Chart                          │
│         ╭─╮     ╭─╮                                    │
│       ╭─╯ ╰─╮ ╭─╯ ╰─╮                                  │
│     ╭─╯     ╰─╯     ╰─╮                                │
│   ╭─╯                 ╰─╮                              │
│ ╭─╯                     ╰─╮                            │
└─────────────────────────────────────────────────────────┘
```

### KPI Card Types and Metrics

| Card Type | Primary Metric | Trend Period | Visual Indicator |
|-----------|---------------|--------------|------------------|
| Tenant Growth | Total Tenants | Monthly | Growth percentage |
| Revenue Performance | Monthly Revenue | Quarterly | Revenue trend chart |
| User Activity | Active Users | Daily | Activity heatmap |
| System Health | Health Score | Real-time | Status color ring |
| Alert Summary | Active Alerts | Weekly | Severity distribution |
| Storage Usage | Used Storage | Daily | Usage percentage bar |

### Trend Calculation Logic

| Metric | Current Period | Comparison Period | Calculation |
|--------|---------------|-------------------|-------------|
| Growth Rate | This Month | Last Month | `((current - previous) / previous) * 100` |
| Moving Average | Last 7 Days | Previous 7 Days | `sum(values) / count(values)` |
| Percentage Change | This Week | Last Week | `((current - previous) / previous) * 100` |
| Year-over-Year | This Year | Last Year | `((current - previous) / previous) * 100` |

### Visual Status Indicators

| Status | Color | Condition | Icon |
|--------|-------|-----------|------|
| Excellent | Green (#10B981) | > 90% of target | CheckCircle |
| Good | Blue (#3B82F6) | 70-90% of target | TrendingUp |
| Warning | Yellow (#F59E0B) | 50-70% of target | ExclamationTriangle |
| Critical | Red (#EF4444) | < 50% of target | AlertTriangle |

### Card Interaction Events

| Interaction | Trigger | Action | Analytics Event |
|-------------|---------|--------|-----------------|
| Card Click | Full card area | Navigate to detail view | `kpi_card_clicked` |
| Trend Hover | Mini chart area | Show expanded trend | `trend_hovered` |
| Info Tooltip | Info icon | Display metric definition | `info_tooltip_viewed` |
| Refresh Action | Refresh button | Force data update | `manual_refresh_triggered` |

### Expected Outcome
- Interactive KPI cards with comprehensive metric displays
- Visual trend indicators with color-coded status system
- Real-time data updates with smooth animations
- Responsive card layout optimized for various screen sizes

### Verification Checklist
- [ ] KPI cards render with correct data and formatting
- [ ] Trend indicators show accurate calculations
- [ ] Visual status indicators function properly
- [ ] Card interactions and navigation work
- [ ] Responsive design verified across devices

---

## Task 70: Create Tenant List

### Overview
Implement a comprehensive tenant list component that displays all platform tenants with essential information, filtering capabilities, and management actions. This component provides administrators with efficient tenant overview, search functionality, and quick access to tenant-specific operations.

### Dependencies
- Task 69 (KPI Cards) must be complete
- Tenant API endpoints operational
- Data table library configured
- Search and filtering utilities available

### Instructions

1. **Create tenant list component structure**
   - Navigate to `frontend/src/components/admin/tenants/`
   - Create `TenantList.tsx` component with TypeScript interfaces
   - Set up data table structure with sortable columns
   - Configure virtualization for large tenant datasets

2. **Implement tenant data display**
   - Create tenant information columns (name, domain, status, created date)
   - Add subscription tier and billing status indicators
   - Include user count and activity metrics
   - Display tenant health score with visual indicators

3. **Design search and filtering system**
   - Implement real-time search across tenant names and domains
   - Add status filter dropdown (Active, Inactive, Suspended, Trial)
   - Create subscription tier filtering options
   - Add date range filters for tenant creation and activity

4. **Set up tenant list data management**
   - Configure API integration for tenant data fetching
   - Implement pagination for optimal performance
   - Add sorting functionality for all table columns
   - Set up data refresh and caching strategies

5. **Implement tenant management actions**
   - Add row-level action buttons (View, Edit, Suspend, Delete)
   - Create bulk action capabilities for multiple tenant selection
   - Implement tenant status change functionality
   - Add export functionality for tenant data

6. **Configure tenant list optimization**
   - Implement lazy loading for improved performance
   - Add skeleton loading states during data fetch
   - Configure responsive table design for mobile devices
   - Set up accessibility features for screen readers

### Tenant List Architecture

```
Tenant Management Interface:
┌─────────────────────────────────────────────────────────────────┐
│                    Search and Filter Bar                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │   Search    │ │   Status    │ │   Tier      │ │   Date    │ │
│  │    Box      │ │   Filter    │ │   Filter    │ │   Range   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                       Tenant Data Table                         │
│ ┌─────┬──────────┬─────────┬────────┬─────────┬─────────┬──────┐│
│ │ ☐   │ Tenant   │ Domain  │ Status │ Tier    │ Users   │Health││
│ │     │ Name     │         │        │         │         │Score ││
│ ├─────┼──────────┼─────────┼────────┼─────────┼─────────┼──────┤│
│ │ ☐   │ Acme Corp│acme.com │Active  │Pro      │ 145     │ 92%  ││
│ │ ☐   │ Tech LLC │tech.io  │Active  │Basic    │ 23      │ 78%  ││
│ │ ☐   │ Store Inc│store.co │Trial   │Trial    │ 8       │ 65%  ││
│ └─────┴──────────┴─────────┴────────┴─────────┴─────────┴──────┘│
└─────────────────────────────────────────────────────────────────┘
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    Pagination Controls                          │
│      ┌──────┐ ┌──────┐ ┌──────┐     Page 1 of 47 (1,174)      │
│      │ Prev │ │ Next │ │ Jump │                                │
│      └──────┘ └──────┘ └──────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

### Tenant List Columns Configuration

| Column | Data Type | Sortable | Filterable | Width |
|--------|-----------|----------|------------|-------|
| Checkbox | Boolean | No | No | 40px |
| Tenant Name | String | Yes | Yes | 200px |
| Domain | String | Yes | Yes | 150px |
| Status | Enum | Yes | Yes | 100px |
| Subscription Tier | Enum | Yes | Yes | 120px |
| User Count | Number | Yes | No | 80px |
| Health Score | Number | Yes | Yes | 100px |
| Created Date | Date | Yes | Yes | 120px |
| Actions | Component | No | No | 120px |

### Filtering Options

| Filter Type | Options | Behavior |
|-------------|---------|----------|
| Status | Active, Inactive, Suspended, Trial | Multi-select dropdown |
| Tier | Free, Basic, Pro, Enterprise | Multi-select dropdown |
| Health Score | Excellent (90+), Good (70-89), At-Risk (<70) | Range selector |
| Date Created | Last 7 days, Last 30 days, Custom range | Date picker |
| User Count | 1-10, 11-50, 51-200, 200+ | Range selector |

### Bulk Actions Configuration

| Action | Description | Permission Required | Confirmation |
|--------|-------------|-------------------|--------------|
| Export Selected | Export tenant data to CSV/Excel | admin.tenants.export | No |
| Suspend Selected | Suspend multiple tenants | admin.tenants.suspend | Yes |
| Send Notification | Send message to selected tenants | admin.communication | Yes |
| Update Tier | Bulk tier changes | admin.billing | Yes |

### Search Implementation

| Search Target | Weight | Fuzzy Matching | Real-time |
|---------------|--------|----------------|-----------|
| Tenant Name | 1.0 | Yes | Yes |
| Domain | 0.8 | Yes | Yes |
| Contact Email | 0.6 | No | Yes |
| Company ID | 1.0 | No | Yes |

### Expected Outcome
- Comprehensive tenant list with advanced filtering and search
- Efficient data table with virtualization and pagination
- Bulk action capabilities for tenant management
- Responsive design optimized for administrative workflows

### Verification Checklist
- [ ] Tenant list displays with correct data formatting
- [ ] Search and filtering functions work accurately
- [ ] Sorting and pagination operate correctly
- [ ] Bulk actions function properly
- [ ] Mobile responsiveness verified

---

## Task 71: Create Health Column

### Overview
Implement a sophisticated health column component within the tenant list that displays visual health indicators, health score values, and interactive health status information. This column provides quick health assessment visualization with color-coded indicators and drill-down capabilities.

### Dependencies
- Task 70 (Tenant List) must be complete
- Health scoring API available
- Health status calculation service operational
- Visual indicator components configured

### Instructions

1. **Create health column component**
   - Navigate to `frontend/src/components/admin/tenants/columns/`
   - Create `HealthColumn.tsx` component with health display logic
   - Implement health score formatting and visualization
   - Set up component props and TypeScript interfaces

2. **Design health score visualization**
   - Create circular progress indicator for health scores (0-100)
   - Implement color gradient system based on score ranges
   - Add percentage text overlay with readable typography
   - Design responsive health indicator sizing

3. **Implement health status indicators**
   - Add color-coded status badges (Healthy, At-Risk, Critical)
   - Create health trend arrows (improving, stable, declining)
   - Implement health category icons and tooltips
   - Add last updated timestamp display

4. **Configure interactive health features**
   - Add hover tooltips with detailed health breakdown
   - Implement click action to navigate to health detail view
   - Create health score animation effects on data updates
   - Add loading states for health score calculations

5. **Set up health data integration**
   - Connect to health scoring API endpoints
   - Implement real-time health score updates
   - Add health data caching for performance optimization
   - Configure error handling for missing health data

6. **Optimize health column performance**
   - Implement health score memoization to prevent unnecessary rerenders
   - Add virtualization support for large tenant lists
   - Configure batch health score loading
   - Set up health data refresh intervals

### Health Column Architecture

```
Health Column Visual Structure:
┌─────────────────────────────────────┐
│           Health Column             │
│  ┌───────────────────────────────┐  │
│  │      Health Score Ring        │  │
│  │     ╭─────────────────╮       │  │
│  │   ╭─╯      92%       ╰─╮     │  │
│  │ ╭─╯                   ╰─╮   │  │
│  │╱                       ╲│   │  │
│  ╱         HEALTHY         ╲   │  │
│  ╲                         ╱   │  │
│  │╲                       ╱│   │  │
│  │ ╰─╮                   ╱─╯   │  │
│  │   ╰─╮      ↗ +3%    ╱─╯     │  │
│  │     ╰─────────────────╯       │  │
│  └───────────────────────────────┘  │
│            2 hours ago              │
└─────────────────────────────────────┘
```

### Health Score Color Mapping

| Score Range | Color | Health Status | Ring Color | Background |
|-------------|-------|---------------|------------|------------|
| 90-100 | Green | Excellent | #10B981 | #ECFDF5 |
| 80-89 | Light Green | Healthy | #22C55E | #F0FDF4 |
| 70-79 | Blue | Good | #3B82F6 | #EFF6FF |
| 60-69 | Yellow | Stable | #F59E0B | #FFFBEB |
| 50-59 | Orange | At Risk | #F97316 | #FFF7ED |
| 30-49 | Red | Critical | #EF4444 | #FEF2F2 |
| 0-29 | Dark Red | Failing | #DC2626 | #FEF2F2 |

### Health Status Indicators

| Status | Icon | Description | Trend Arrow |
|--------|------|-------------|-------------|
| Improving | TrendingUp | Score increased | ↗ Green |
| Stable | Minus | Score unchanged | → Blue |
| Declining | TrendingDown | Score decreased | ↘ Red |
| New | Plus | Recently created | ✨ Purple |
| Unknown | Question | No data available | ? Gray |

### Health Tooltip Content

| Information | Format | Source |
|-------------|--------|---------|
| Overall Score | "92/100" | Health calculation |
| Score Breakdown | Activity: 95, Revenue: 88, etc. | Component scores |
| Last Updated | "2 hours ago" | Timestamp formatting |
| Trend | "+3% from last week" | Trend calculation |
| Category | "Healthy - Optimal performance" | Status description |

### Health Column Interactions

| Interaction | Trigger | Action | Data Loading |
|-------------|---------|--------|--------------|
| Hover | Mouse over health ring | Show detailed tooltip | Lazy load details |
| Click | Click health column | Navigate to health detail | Load full health data |
| Animation | Data update | Animate score change | Real-time update |
| Loading | Missing health data | Show skeleton loader | Fetch health score |

### Performance Optimization

| Optimization | Implementation | Benefit |
|-------------|----------------|---------|
| Memoization | React.memo on health component | Prevent unnecessary rerenders |
| Batch Loading | Load health scores in chunks | Reduce API calls |
| Caching | Cache health scores for 5 minutes | Improve response time |
| Virtualization | Only render visible rows | Handle large datasets |

### Expected Outcome
- Visual health score indicators with intuitive color coding
- Interactive health column with detailed tooltips
- Smooth animations and loading states
- Optimized performance for large tenant lists

### Verification Checklist
- [ ] Health column displays accurate scores and colors
- [ ] Visual indicators and animations work properly
- [ ] Tooltip content shows correct health breakdown
- [ ] Click navigation to health details functions
- [ ] Performance optimization measures effective

---

## Task 72: Create Tenant Detail

### Overview
Implement a comprehensive tenant detail page that provides administrators with in-depth analytics, health metrics, usage patterns, and management capabilities for individual tenants. This page serves as the central hub for tenant-specific administration and monitoring.

### Dependencies
- Task 71 (Health Column) must be complete
- Tenant analytics API endpoints available
- Chart visualization library configured
- Tenant management permissions implemented

### Instructions

1. **Create tenant detail page structure**
   - Navigate to `frontend/src/pages/admin/tenants/`
   - Create `[tenantId].tsx` dynamic route page
   - Set up page layout with tabbed navigation
   - Configure breadcrumb navigation and page metadata

2. **Implement tenant overview section**
   - Create tenant profile header with basic information
   - Add subscription details and billing status
   - Include contact information and admin users
   - Display tenant creation date and lifecycle stage

3. **Design health and analytics dashboard**
   - Create comprehensive health score breakdown
   - Add health trend visualization with historical data
   - Implement component-wise health metrics display
   - Include health score factors and recommendations

4. **Set up usage analytics visualization**
   - Create API usage charts with endpoint breakdowns
   - Add user activity heatmaps and session analytics
   - Implement feature usage tracking and adoption metrics
   - Display storage usage and resource consumption

5. **Implement tenant management actions**
   - Add tenant status management (activate, suspend, terminate)
   - Create subscription tier change functionality
   - Implement billing and payment management actions
   - Add tenant communication and notification tools

6. **Configure detailed metrics and reporting**
   - Set up revenue analytics and transaction metrics
   - Add performance metrics and error rate tracking
   - Implement data export functionality for tenant analytics
   - Create custom date range selection for all metrics

### Tenant Detail Architecture

```
Tenant Detail Page Layout:
┌─────────────────────────────────────────────────────────────┐
│                    Tenant Header                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │   Avatar    │ │  Tenant     │ │    Management           ││
│  │    Logo     │ │ Information │ │     Actions             ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Tab Navigation                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┬─────────┐ │
│  │Overview │ │ Health  │ │Analytics│ │ Usage   │Settings │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┴─────────┘ │
└─────────────────────────────────────────────────────────────┘
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      Tab Content                            │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │              Dynamic Tab Content                      │ │
│  │                                                       │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Tenant Information Sections

| Section | Content | Data Source |
|---------|---------|-------------|
| Basic Info | Name, domain, status, created date | Tenant API |
| Subscription | Tier, billing cycle, next payment | Billing API |
| Users | Admin count, total users, activity | User API |
| Health | Overall score, component breakdown | Health API |
| Usage | API calls, storage, feature usage | Analytics API |

### Tab Navigation Structure

| Tab | Content | Permissions |
|-----|---------|-------------|
| Overview | Key metrics and summary | admin.tenants.view |
| Health | Health scoring and trends | admin.health.view |
| Analytics | Usage and performance analytics | admin.analytics.view |
| Usage | Resource consumption details | admin.usage.view |
| Settings | Tenant configuration and management | admin.tenants.manage |

### Management Actions

| Action | Description | Permission | Confirmation |
|--------|-------------|------------|--------------|
| Suspend Tenant | Temporarily disable tenant access | admin.tenants.suspend | Yes |
| Activate Tenant | Re-enable suspended tenant | admin.tenants.activate | No |
| Change Tier | Update subscription tier | admin.billing.manage | Yes |
| Reset Password | Force password reset for admins | admin.security.manage | Yes |
| Export Data | Generate tenant data export | admin.data.export | No |
| Delete Tenant | Permanently remove tenant | admin.tenants.delete | Yes |

### Health Breakdown Display

| Component | Weight | Visualization | Calculation |
|-----------|--------|---------------|-------------|
| Activity Score | 25% | Progress bar | Login frequency and usage |
| Revenue Score | 20% | Trend chart | Revenue growth and stability |
| Feature Usage | 20% | Adoption chart | Feature utilization rate |
| Error Rate | 15% | Line chart | Error frequency and severity |
| Payment Health | 10% | Status indicator | Payment success rate |
| Growth Score | 10% | Growth chart | User and transaction growth |

### Analytics Visualizations

| Chart Type | Metric | Time Range | Purpose |
|------------|--------|------------|---------|
| Line Chart | API Usage | Last 30 days | Usage trend analysis |
| Bar Chart | Feature Adoption | Monthly | Feature utilization |
| Heatmap | User Activity | Last 7 days | Activity pattern analysis |
| Pie Chart | Storage Usage | Current | Resource allocation |
| Area Chart | Revenue Trend | Last 12 months | Financial performance |

### Expected Outcome
- Comprehensive tenant detail page with complete tenant insights
- Interactive analytics dashboard with multiple visualization types
- Tenant management capabilities with proper permissions
- Responsive design optimized for administrative workflows

### Verification Checklist
- [ ] Tenant detail page loads with correct information
- [ ] Tab navigation functions properly
- [ ] Health breakdown displays accurate metrics
- [ ] Analytics visualizations render correctly
- [ ] Management actions work with proper confirmations

---

## Task 73: Create Health Chart

### Overview
Implement a sophisticated health chart component that visualizes tenant health scores over time with interactive features, trend analysis, and detailed health component breakdown. This chart provides administrators with comprehensive health trend visualization and predictive insights.

### Dependencies
- Task 72 (Tenant Detail) must be complete
- Chart.js or Recharts library configured
- Health time-series data API available
- Date range picker component implemented

### Instructions

1. **Create health chart component structure**
   - Navigate to `frontend/src/components/admin/charts/`
   - Create `HealthChart.tsx` component with chart configuration
   - Set up TypeScript interfaces for health data
   - Configure chart responsive container and sizing

2. **Implement health score time-series visualization**
   - Create line chart for overall health score trends
   - Add multiple data series for component health scores
   - Implement interactive tooltips with detailed score breakdowns
   - Configure chart animations and smooth transitions

3. **Design health component breakdown visualization**
   - Add stacked area chart for health component contributions
   - Create color-coded health component indicators
   - Implement component visibility toggle functionality
   - Add health component legend with interactive controls

4. **Set up interactive chart features**
   - Implement zoom and pan functionality for detailed analysis
   - Add data point click events for drill-down navigation
   - Create brush selection for custom time range analysis
   - Configure crosshair and reference lines for trend analysis

5. **Configure health chart data management**
   - Set up API integration for health time-series data
   - Implement data aggregation and smoothing algorithms
   - Add real-time data updates with WebSocket integration
   - Configure data caching and performance optimization

6. **Implement advanced chart analytics**
   - Add trend line calculation and visualization
   - Create health score prediction based on historical data
   - Implement anomaly detection highlighting on the chart
   - Add health milestone markers and annotations

### Health Chart Architecture

```
Health Chart Component Structure:
┌─────────────────────────────────────────────────────────────┐
│                    Chart Header                             │
│  ┌─────────────┐ ┌─────────────┐ ┌───────────────────────┐ │
│  │   Title     │ │ Date Range  │ │    Export/Settings    │ │
│  │ Health Trend│ │  Selector   │ │      Controls         │ │
│  └─────────────┘ └─────────────┘ └───────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Chart Legend                             │
│  ▬ Overall Health  ▬ Activity  ▬ Revenue  ▬ Growth  ▬ Error│
└─────────────────────────────────────────────────────────────┘
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                   Health Chart Area                         │
│ 100│     ╭─╮                           ╭─╮                 │
│  90│   ╭─╯ ╰─╮                       ╭─╯ ╰─╮               │
│  80│ ╭─╯     ╰─╮                   ╭─╯     ╰─╮             │
│  70│╱         ╰─╮                 ╱         ╰─╮           │
│  60│           ╰─╮             ╭─╯           ╰─╮         │
│  50│             ╰─╮         ╭─╯               ╰─╮       │
│   0└─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬───    │
│        Jan   Feb   Mar   Apr   May   Jun   Jul   Aug      │
└─────────────────────────────────────────────────────────────┘
```

### Health Chart Data Series

| Data Series | Color | Line Style | Purpose |
|-------------|-------|------------|---------|
| Overall Health | #3B82F6 | Solid, 3px | Primary health trend |
| Activity Score | #10B981 | Solid, 2px | User engagement trend |
| Revenue Score | #F59E0B | Solid, 2px | Financial performance |
| Growth Score | #8B5CF6 | Solid, 2px | Business growth trend |
| Error Score | #EF4444 | Dashed, 2px | System reliability |
| Trend Line | #6B7280 | Dashed, 1px | Predictive trend |

### Chart Interaction Features

| Interaction | Trigger | Behavior | Data Display |
|-------------|---------|----------|--------------|
| Hover Point | Mouse over data point | Show detailed tooltip | All component scores |
| Click Point | Click data point | Navigate to detail view | Specific date health |
| Zoom | Mouse wheel/pinch | Zoom time range | Adjusted axis labels |
| Pan | Click and drag | Scroll time period | Updated data range |
| Legend Click | Click legend item | Toggle series visibility | Recalculate scales |

### Health Chart Time Ranges

| Range | Period | Data Points | Aggregation |
|-------|--------|-------------|-------------|
| Last 7 Days | Daily | 7 points | Daily averages |
| Last 30 Days | Daily | 30 points | Daily averages |
| Last 3 Months | Weekly | 12 points | Weekly averages |
| Last Year | Monthly | 12 points | Monthly averages |
| Custom Range | Variable | Variable | Dynamic aggregation |

### Chart Configuration Options

| Option | Values | Default | Purpose |
|--------|--------|---------|---------|
| Animation Duration | 200-1000ms | 500ms | Chart render speed |
| Point Radius | 2-8px | 4px | Data point visibility |
| Line Tension | 0-1 | 0.3 | Curve smoothness |
| Grid Lines | Show/Hide | Show | Reference grid |
| Crosshair | Enable/Disable | Enable | Data point tracking |

### Health Annotations and Markers

| Marker Type | Visual | Purpose | Trigger |
|-------------|--------|---------|---------|
| Health Alert | Red triangle | Health drop event | Score < 60 |
| Milestone | Green star | Achievement marker | Score improvement |
| System Event | Blue circle | Platform change | Deployment, update |
| Anomaly | Orange diamond | Unusual pattern | Statistical deviation |

### Expected Outcome
- Interactive health chart with comprehensive trend visualization
- Multi-series health component breakdown with toggle controls
- Advanced chart interactions including zoom, pan, and drill-down
- Real-time updates with smooth animations and performance optimization

### Verification Checklist
- [ ] Health chart renders with correct data and styling
- [ ] Interactive features (hover, click, zoom) work properly
- [ ] Health component series toggle correctly
- [ ] Date range selection updates chart data
- [ ] Chart animations and transitions perform smoothly