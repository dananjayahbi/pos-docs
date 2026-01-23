# Tasks 79-84: Management Components and Utilities

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** E - Frontend Offline Components  
> **Document:** 02 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-73-78_Status-Indicators.md](01_Tasks-73-78_Status-Indicators.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Document Overview

This document covers the creation of management components, utility controls, and a comprehensive status page for offline mode operations. These components provide users with tools to manage sync operations, view logs, refresh cached data, and understand the current state of offline data.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Add offline mode restrictions UI | Medium | 25 min |
| 80 | Create SyncLogViewer component | High | 30 min |
| 81 | Create ManualSyncButton component | Medium | 20 min |
| 82 | Add sync error toast notifications | Medium | 20 min |
| 83 | Create offline data status page | High | 30 min |
| 84 | Add cache refresh button | Medium | 20 min |

---

## Task 79: Add Offline Mode Restrictions UI

### Overview
Create UI components and overlays that disable or restrict features that are unavailable during offline mode, providing clear visual feedback and messaging to users.

### Dependencies
- Task 73: Create OfflineIndicator component
- Offline status detection hook
- Feature availability service

### Instructions

1. **Create OfflineRestrictions component file**
   - Create file `OfflineRestrictions.tsx` in offline directory
   - Design as wrapper/HOC component

2. **Define component props interface**
   - Children elements
   - Restricted mode type
   - Fallback message
   - Show overlay flag
   - Custom className

3. **Implement feature availability map**
   - Define which features work offline
   - Define which features are read-only offline
   - Define which features are completely disabled offline
   - Create TypeScript enum or constant

4. **Create restriction types**
   - DISABLED: Feature completely unavailable
   - READ_ONLY: Feature viewable but not editable
   - QUEUED: Feature available but actions are queued
   - PARTIAL: Some functionality available

5. **Build wrapper component logic**
   - Check current connection status
   - Check feature availability for offline mode
   - Apply appropriate restrictions
   - Show/hide based on mode

6. **Implement disabled overlay UI**
   - Semi-transparent overlay over restricted content
   - Lock icon or similar indicator
   - Tooltip explaining restriction
   - "Available online only" message

7. **Create read-only mode styling**
   - Disable form inputs
   - Change cursor to not-allowed
   - Gray out action buttons
   - Show read-only badge

8. **Add informative messages**
   - Explain why feature is restricted
   - Suggest when it will be available
   - Provide alternatives if available
   - Link to offline documentation

9. **Implement queued action indicators**
   - Show that action will be queued
   - Display queue icon
   - Show estimated sync time
   - Confirm action will execute later

10. **Create feature-specific restrictions**
    - Reports: Completely disabled offline
    - Settings: Read-only offline
    - User management: Disabled offline
    - Payment processing: Queued for card, cash allowed

11. **Build restriction utility hook**
    - Create `useFeatureRestriction` hook
    - Hook checks feature availability
    - Returns restriction type and message
    - Provides enable/disable methods

12. **Add visual indicators**
    - Badge on restricted buttons
    - Disabled state styling
    - Tooltip on hover
    - Icon overlay

### Feature Availability Table

| Feature | Online | Offline | Restriction Type |
|---------|--------|---------|------------------|
| Sales transactions | ✅ Enabled | ✅ Enabled | None |
| Cash payments | ✅ Enabled | ✅ Enabled | None |
| Card payments | ✅ Enabled | ⚠️ Queued | QUEUED |
| Reports generation | ✅ Enabled | ❌ Disabled | DISABLED |
| Product search | ✅ Enabled | ⚠️ Cached only | PARTIAL |
| Inventory updates | ✅ Enabled | ⚠️ Queued | QUEUED |
| Settings changes | ✅ Enabled | 👁️ Read-only | READ_ONLY |
| User management | ✅ Enabled | ❌ Disabled | DISABLED |
| Cloud backup | ✅ Enabled | ❌ Disabled | DISABLED |
| Real-time sync | ✅ Enabled | ❌ Disabled | DISABLED |

### Restriction UI Patterns

```
Disabled Feature:
┌────────────────────────────────┐
│ ⊘  Reports                     │
│                                 │
│ [Generate Report] (disabled)   │
│                                 │
│ 🔒 Available online only        │
└────────────────────────────────┘

Read-Only Feature:
┌────────────────────────────────┐
│ ⚙️ Settings    [👁️ Read-only]  │
│                                 │
│ Tax Rate: 15% (cannot edit)    │
│ Currency: LKR (cannot edit)    │
│                                 │
│ ℹ️ Changes available online     │
└────────────────────────────────┘

Queued Feature:
┌────────────────────────────────┐
│ 💳 Card Payment                │
│                                 │
│ [Process Payment] ⏱️           │
│                                 │
│ ⚠️ Payment will be processed   │
│    when connection is restored │
└────────────────────────────────┘

Partial Feature:
┌────────────────────────────────┐
│ 🔍 Product Search              │
│                                 │
│ [Search] ⚠️ Cached data only   │
│                                 │
│ ℹ️ Results limited to locally  │
│    cached products             │
└────────────────────────────────┘
```

### Restriction Component Usage Examples

```typescript
// Example usage patterns (not code, just reference)

// Disabled feature
<OfflineRestrictions type="DISABLED" feature="reports">
  <ReportGenerator />
</OfflineRestrictions>

// Read-only feature
<OfflineRestrictions type="READ_ONLY" feature="settings">
  <SettingsForm />
</OfflineRestrictions>

// Queued feature
<OfflineRestrictions type="QUEUED" feature="card_payment">
  <CardPaymentButton />
</OfflineRestrictions>
```

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── ... (previous components)
            ├── OfflineRestrictions.tsx    # Restriction wrapper
            └── hooks/
                └── useFeatureRestriction.ts
```

### Verification Checklist
- [ ] OfflineRestrictions component created
- [ ] Props interface includes all restriction types
- [ ] Feature availability map defined
- [ ] All restriction types implemented
- [ ] Disabled overlay displays correctly
- [ ] Read-only mode styling applied
- [ ] Informative messages clear and helpful
- [ ] Queued action indicators shown
- [ ] Hook for restriction checking created
- [ ] Visual indicators distinct for each type
- [ ] Tooltips provide useful information
- [ ] Component works as wrapper/HOC
- [ ] Accessibility features included
- [ ] Tested with various features

---

## Task 80: Create SyncLogViewer Component

### Overview
Create a comprehensive component that displays a detailed log of all sync operations, including successes, failures, and detailed error information.

### Dependencies
- Task 75: Create SyncStatusBar component
- Group D: Sync history storage service
- Data table component library

### Instructions

1. **Create SyncLogViewer component file**
   - Create file `SyncLogViewer.tsx` in offline directory
   - Plan for table/list view with filters

2. **Define component props interface**
   - View mode (table, list, timeline)
   - Initial filter state
   - Page size for pagination
   - Show filters flag
   - Custom className

3. **Implement sync log data hook**
   - Create or import `useSyncHistory` hook
   - Hook queries sync log from storage
   - Hook supports filtering and pagination
   - Hook provides refresh method

4. **Design log entry data structure**
   - Timestamp (date and time)
   - Sync type (Push, Pull, Full, Auto, Manual)
   - Status (Success, Failed, Partial)
   - Duration in seconds
   - Entities synced (count by type)
   - Error details (if failed)
   - User who triggered (if manual)

5. **Create table view layout**
   - Sortable columns
   - Expandable rows for details
   - Status indicator icons
   - Timestamp formatting

6. **Define table columns**
   - Timestamp column (sortable)
   - Type column (with icon)
   - Status column (color-coded)
   - Entities synced column
   - Duration column (formatted)
   - Actions column (view details, retry)

7. **Implement filtering controls**
   - Date range filter
   - Sync type filter (checkboxes)
   - Status filter (checkboxes)
   - Entity type filter
   - Text search for errors

8. **Create expandable row details**
   - Click row to expand
   - Show detailed entity breakdown
   - Show error stack trace if failed
   - Show affected record IDs
   - Show conflict information

9. **Add status color coding**
   - Success: Green indicator
   - Failed: Red indicator
   - Partial success: Yellow indicator
   - In progress: Blue indicator with spinner

10. **Implement pagination**
    - Page size selector (10, 25, 50, 100)
    - Previous/Next navigation
    - Page number indicator
    - Jump to page input

11. **Create empty state**
    - Show when no sync history
    - Helpful message
    - Suggestion to trigger sync

12. **Add export functionality**
    - Export logs to CSV
    - Export logs to JSON
    - Date range selection for export
    - Filter before export option

13. **Implement refresh mechanism**
    - Manual refresh button
    - Auto-refresh toggle
    - Real-time updates when new sync completes

14. **Add retry failed sync option**
    - Retry button for failed syncs
    - Confirmation dialog
    - Progress indicator during retry
    - Update log after retry

### Log Viewer Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Sync History                          [🔄 Refresh] [Export] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Filters: [Last 7 days ▾] [All Types ▾] [All Status ▾]     │
│                                                             │
├──────────┬─────────┬────────┬─────────────┬─────────┬──────┤
│ Time     │ Type    │ Status │ Entities    │ Duration│ Info │
├──────────┼─────────┼────────┼─────────────┼─────────┼──────┤
│ 10:30 AM │ 🔄 Push │ ✅ OK  │ 5 products  │ 2.3s    │ [▾]  │
│ 10:25 AM │ ⬇️ Pull │ ✅ OK  │ 3 sales     │ 1.5s    │ [▾]  │
│ 10:20 AM │ 🔄 Full │ ⚠️ Partial │ 2 conflicts│ 5.7s │ [▾]  │
│ 10:15 AM │ ⬆️ Push │ ❌ Failed │ 1 product │ 0.8s   │ [▾]  │
│          │         │        │ Error: Net  │         │[Retry]│
├──────────┴─────────┴────────┴─────────────┴─────────┴──────┤
│ Showing 1-4 of 47    [◀] Page 1 of 12 [▶]  [10 per page ▾] │
└─────────────────────────────────────────────────────────────┘
```

### Expanded Row Details

```
┌─────────────────────────────────────────────────────────────┐
│ 10:15 AM │ ⬆️ Push │ ❌ Failed │ 1 product │ 0.8s │ [▾]     │
├─────────────────────────────────────────────────────────────┤
│ Sync Details:                                               │
│                                                             │
│ Started: 2026-01-23 10:15:23                               │
│ Ended: 2026-01-23 10:15:24                                 │
│ Triggered by: Auto-sync (scheduled)                        │
│                                                             │
│ Entities:                                                   │
│ • Products: 1 attempted, 0 succeeded, 1 failed             │
│                                                             │
│ Error Details:                                              │
│ ❌ NetworkError: Connection timeout                        │
│    Failed to reach server at api.example.com               │
│    Product ID: PROD-12345 "Wireless Mouse"                 │
│                                                             │
│ [Retry Sync] [View Error Log] [Copy Details]              │
└─────────────────────────────────────────────────────────────┘
```

### Sync Log Entry Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique log entry ID |
| `timestamp` | Date | When sync occurred |
| `type` | enum | Push, Pull, Full, Auto, Manual |
| `status` | enum | Success, Failed, Partial |
| `duration` | number | Duration in milliseconds |
| `entities` | object | Count by entity type |
| `errors` | array | Error details if failed |
| `conflicts` | array | Conflict details if partial |
| `triggeredBy` | string | User or system |

### Filter Options

| Filter | Options |
|--------|---------|
| Date Range | Today, Last 7 days, Last 30 days, Custom |
| Sync Type | Push, Pull, Full, Auto, Manual |
| Status | Success, Failed, Partial |
| Entity Type | Products, Sales, Customers, Inventory |

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── ... (previous components)
            └── SyncLogViewer.tsx          # Sync history viewer
```

### Verification Checklist
- [ ] SyncLogViewer component created
- [ ] Props interface complete
- [ ] Hook integration for sync history
- [ ] Table view displays all columns
- [ ] Expandable rows work correctly
- [ ] All filters functional
- [ ] Status color coding implemented
- [ ] Pagination works correctly
- [ ] Empty state displays properly
- [ ] Export functionality implemented
- [ ] Refresh mechanism works
- [ ] Retry failed sync functional
- [ ] Error details show completely
- [ ] Timestamp formatting correct
- [ ] Responsive on mobile devices

---

## Task 81: Create ManualSyncButton Component

### Overview
Create a button component that allows users to manually trigger a sync operation, with visual feedback during the sync process.

### Dependencies
- Task 75: Create SyncStatusBar component
- Group D: Sync service trigger methods
- Offline status detection

### Instructions

1. **Create ManualSyncButton component file**
   - Create file `ManualSyncButton.tsx` in offline directory
   - Design as reusable button component

2. **Define component props interface**
   - Sync type (Push, Pull, Full)
   - Button variant (primary, secondary, icon-only)
   - Size (small, medium, large)
   - Disabled state
   - Custom className
   - Success callback
   - Error callback

3. **Implement sync trigger hook**
   - Create or import `useManualSync` hook
   - Hook provides trigger method
   - Hook returns loading state
   - Hook returns error state
   - Hook provides progress updates

4. **Create button UI structure**
   - Button with icon and text
   - Loading spinner during sync
   - Success checkmark animation
   - Error indication

5. **Implement button states**
   - Default: Ready to sync icon
   - Loading: Spinning icon with progress
   - Success: Checkmark with fade
   - Error: Error icon with shake
   - Disabled: Grayed out

6. **Add sync type selection**
   - Default: Full sync
   - Dropdown menu for sync type selection
   - Options: Push only, Pull only, Full sync
   - Show sync type in tooltip

7. **Create visual feedback**
   - Icon rotation during sync
   - Progress percentage display (optional)
   - Duration timer
   - Entity count updating

8. **Implement online status check**
   - Check connection before sync
   - Show warning if offline
   - Disable button if offline
   - Tooltip explains why disabled

9. **Add confirmation dialog for destructive syncs**
   - Confirm before force push (overwrites server)
   - Confirm before pull (overwrites local changes)
   - Show affected entity counts
   - Warn about potential conflicts

10. **Create success feedback**
    - Brief success animation
    - Show sync summary
    - Display duration and entity counts
    - Auto-hide after 3 seconds

11. **Implement error handling**
    - Display error message
    - Show retry option
    - Log error to sync history
    - Provide troubleshooting link

12. **Add keyboard shortcut**
    - Support Ctrl+Shift+S or similar
    - Show shortcut in tooltip
    - Document in help section

13. **Create button variants**
    - Primary button with text and icon
    - Icon-only button for toolbar
    - Menu item for dropdowns
    - Link style for minimal UI

### Button States Diagram

```
Default State:
┌──────────────────┐
│ 🔄 Sync Now      │
└──────────────────┘

Loading State:
┌──────────────────┐
│ ⟳ Syncing...     │  ← Spinning icon
└──────────────────┘

Success State:
┌──────────────────┐
│ ✅ Synced!       │  ← Brief display, then back to default
└──────────────────┘

Error State:
┌──────────────────┐
│ ❌ Failed (Retry)│  ← Shake animation, shows retry
└──────────────────┘

Disabled State:
┌──────────────────┐
│ 🔄 Sync (Offline)│  ← Grayed out, tooltip explains
└──────────────────┘
```

### Sync Type Selection Menu

```
┌──────────────────────────┐
│ 🔄 Sync Now          [▾] │
└──────────────────────────┘
              │
              ▼
      ┌──────────────────────┐
      │ ⬆️ Push Changes Only │
      │ ⬇️ Pull Updates Only │
      │ 🔄 Full Sync (Both)  │
      │ ────────────────────  │
      │ ⚡ Force Push (!)    │
      │ 🔃 Reset & Re-sync   │
      └──────────────────────┘
```

### Confirmation Dialog for Destructive Operations

```
┌─────────────────────────────────────────────┐
│ Confirm Force Push                     [X]  │
├─────────────────────────────────────────────┤
│                                             │
│ ⚠️ This will overwrite server data with    │
│    your local changes.                      │
│                                             │
│ Affected entities:                          │
│ • 3 products will be updated                │
│ • 1 sale will be created                    │
│                                             │
│ This action cannot be undone.               │
│                                             │
│ [Cancel]               [Confirm Push]      │
└─────────────────────────────────────────────┘
```

### Sync Type Options

| Sync Type | Description | Use Case |
|-----------|-------------|----------|
| **Full Sync** | Push and pull all changes | Regular sync operation |
| **Push Only** | Upload local changes only | After making local edits |
| **Pull Only** | Download server changes only | Refresh from server |
| **Force Push** | Overwrite server with local | Resolve conflicts manually |
| **Reset & Re-sync** | Clear and re-download | Fix corruption issues |

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── ... (previous components)
            └── ManualSyncButton.tsx       # Manual sync trigger
```

### Verification Checklist
- [ ] ManualSyncButton component created
- [ ] Props interface includes all variants
- [ ] Hook integration for sync trigger
- [ ] All button states implemented
- [ ] Visual feedback during sync works
- [ ] Online status check functional
- [ ] Confirmation dialog for destructive operations
- [ ] Success animation displays
- [ ] Error handling implemented
- [ ] Retry option available on error
- [ ] Sync type selection menu works
- [ ] Keyboard shortcut implemented
- [ ] All button variants created
- [ ] Tooltips provide helpful information
- [ ] Accessible to keyboard and screen readers

---

## Task 82: Add Sync Error Toast Notifications

### Overview
Create a toast notification system for displaying sync errors, warnings, and success messages in a non-intrusive manner.

### Dependencies
- Toast notification library (Sonner, React Hot Toast, or similar)
- Group D: Sync service error events
- Task 81: ManualSyncButton (for retry functionality)

### Instructions

1. **Select and configure toast library**
   - Choose toast notification library
   - Install and configure in app
   - Set default positioning (top-right recommended)
   - Configure default duration

2. **Create useSyncToasts custom hook**
   - Create file `useSyncToasts.ts` in hooks directory
   - Hook listens to sync events
   - Hook triggers appropriate toasts
   - Hook manages toast lifecycle

3. **Define toast types for sync events**
   - Success toast for completed syncs
   - Error toast for failed syncs
   - Warning toast for partial syncs
   - Info toast for sync start/status

4. **Implement sync event listeners**
   - Listen to sync start events
   - Listen to sync complete events
   - Listen to sync error events
   - Listen to conflict detection events

5. **Create success toast format**
   - Green checkmark icon
   - "Sync completed successfully" message
   - Show entity counts synced
   - Auto-dismiss after 3 seconds

6. **Design error toast format**
   - Red error icon
   - Error message from sync service
   - "Retry" button
   - "View details" link
   - Stays visible until dismissed

7. **Build warning toast format**
   - Yellow warning icon
   - "Sync completed with conflicts" message
   - Show conflict count
   - "Resolve" button
   - Auto-dismiss after 5 seconds

8. **Create info toast format**
   - Blue info icon
   - "Sync started..." message
   - Optional progress bar
   - Auto-dismiss after 2 seconds

9. **Implement retry functionality**
   - Retry button in error toast
   - Triggers new sync attempt
   - Updates toast with result
   - Limits retry attempts

10. **Add toast action buttons**
    - Retry button for errors
    - View details button for errors
    - Resolve button for conflicts
    - Dismiss button for all toasts

11. **Create toast message templates**
    - Template for each sync event
    - Include dynamic data (counts, durations)
    - Keep messages concise
    - Use friendly language

12. **Implement toast stacking behavior**
    - Limit max visible toasts (default: 3)
    - Queue additional toasts
    - Group similar toasts
    - Prevent duplicate toasts

13. **Add toast positioning options**
    - Support multiple positions
    - Default: top-right
    - Alternative: bottom-right, top-center
    - Configure per toast type

14. **Create offline mode toast handling**
    - Special messaging when offline
    - Don't show network error toasts if already offline
    - Show "Queued for sync" toasts
    - Show reconnection success toast

### Toast Type Specifications

| Event | Icon | Color | Message Template | Duration | Actions |
|-------|------|-------|------------------|----------|---------|
| Sync Started | ℹ️ | Blue | "Syncing {count} items..." | 2s | None |
| Sync Success | ✅ | Green | "Synced {count} items successfully" | 3s | None |
| Sync Error | ❌ | Red | "Sync failed: {error}" | Until dismissed | Retry, Details |
| Sync Warning | ⚠️ | Yellow | "{count} conflicts detected" | 5s | Resolve |
| Connection Lost | 🔴 | Red | "Connection lost. Working offline." | 5s | None |
| Connection Restored | 🟢 | Green | "Connection restored. Syncing..." | 3s | None |

### Toast Display Examples

```
Success Toast:
┌────────────────────────────────┐
│ ✅ Sync completed              │
│ 5 products, 2 sales synced     │
└────────────────────────────────┘

Error Toast:
┌────────────────────────────────┐
│ ❌ Sync failed                 │
│ Network timeout                 │
│                                 │
│ [Retry] [Details]          [X] │
└────────────────────────────────┘

Warning Toast:
┌────────────────────────────────┐
│ ⚠️ Sync completed with issues  │
│ 2 conflicts require resolution │
│                                 │
│ [Resolve]                  [X] │
└────────────────────────────────┘

Info Toast:
┌────────────────────────────────┐
│ ℹ️ Syncing...                  │
│ ▓▓▓▓▓▓░░░░░░ 45%              │
└────────────────────────────────┘
```

### Toast Positioning Options

```
┌─────────────────────────────────────┐
│ top-left        top-center    [📢]  │  ← top-right (default)
│                                     │
│                                     │
│                 [📢]                │  ← center
│                                     │
│                                     │
│ bottom-left  bottom-center    [📢] │  ← bottom-right
└─────────────────────────────────────┘
```

### Expected Outcome
```
frontend/
├── components/
│   └── pos/
│       └── offline/
│           └── ... (previous components)
└── hooks/
    └── useSyncToasts.ts               # Toast notification hook
```

### Verification Checklist
- [ ] Toast library installed and configured
- [ ] useSyncToasts hook created
- [ ] All sync event listeners implemented
- [ ] Success toast format defined
- [ ] Error toast format defined
- [ ] Warning toast format defined
- [ ] Info toast format defined
- [ ] Retry functionality works
- [ ] Action buttons functional
- [ ] Toast messages are clear and helpful
- [ ] Toast stacking behavior correct
- [ ] Maximum toast limit enforced
- [ ] Duplicate toasts prevented
- [ ] Positioning options work
- [ ] Offline mode handling implemented
- [ ] Toasts are accessible

---

## Task 83: Create Offline Data Status Page

### Overview
Create a comprehensive status page that displays detailed information about cached data, sync status, pending transactions, and offline mode configuration.

### Dependencies
- Task 73: Create OfflineIndicator component
- Task 75: Create SyncStatusBar component
- Task 80: Create SyncLogViewer component
- Task 81: ManualSyncButton component
- Group D: Offline storage queries

### Instructions

1. **Create status page file**
   - Create directory `frontend/app/pos/settings/offline/`
   - Create file `page.tsx` in offline directory
   - Plan multi-section layout

2. **Design page structure**
   - Header with connection status
   - Connection status section
   - Cached data section
   - Pending transactions section
   - Sync history section
   - Configuration section

3. **Build header section**
   - Page title: "Offline Mode Status"
   - OfflineIndicator component
   - Manual sync button
   - Last successful sync timestamp

4. **Create connection status card**
   - Current connection state (online/offline)
   - Connection quality indicator
   - Server endpoint URL
   - Last ping timestamp
   - Test connection button

5. **Implement cached data overview**
   - Table of cached entity types
   - Cache size per entity (MB)
   - Record count per entity
   - Last updated timestamp per entity
   - Cache refresh buttons per entity

6. **Create cache details table**
   - Entity type column
   - Record count column
   - Cache size column
   - Last sync column
   - Actions column (refresh, clear)

7. **Build pending transactions section**
   - Count of pending transactions
   - List of pending items
   - Entity type breakdown
   - Oldest pending timestamp
   - Sync now button

8. **Implement pending items list**
   - Expandable list of pending items
   - Entity type and ID
   - Operation type (create, update, delete)
   - Timestamp queued
   - View details button

9. **Add sync history summary**
   - Last 5 sync operations
   - Success/failure indicators
   - Link to full SyncLogViewer
   - Overall sync success rate

10. **Create configuration section**
    - Auto-sync enabled toggle
    - Sync interval setting
    - Cache size limit
    - Offline mode settings
    - Save configuration button

11. **Implement data statistics**
    - Total cached data size
    - Available storage space
    - Storage usage percentage
    - Warning if storage low

12. **Add troubleshooting section**
    - Common issues and solutions
    - Clear all cache button (with confirmation)
    - Reset sync state button
    - Export diagnostics button

13. **Create export diagnostics feature**
    - Export cache state
    - Export sync logs
    - Export pending transactions
    - Export as JSON file

14. **Implement refresh functionality**
    - Refresh all data button
    - Individual entity refresh
    - Progress indicator during refresh
    - Success/error feedback

15. **Add responsive layout**
    - Grid layout on desktop
    - Stacked layout on mobile
    - Collapsible sections on mobile
    - Touch-friendly buttons

### Page Layout Diagram

```
┌──────────────────────────────────────────────────────────┐
│ Offline Mode Status                                      │
│ 🟢 Online • Last sync: 2 minutes ago    [🔄 Sync Now]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────────────────┐  ┌──────────────────────────┐  │
│ │ Connection Status   │  │ Cached Data Summary      │  │
│ │                     │  │                          │  │
│ │ Status: Online      │  │ Total Size: 24.5 MB      │  │
│ │ Server: Reachable   │  │ Products: 1,234          │  │
│ │ Latency: 45ms       │  │ Customers: 567           │  │
│ │                     │  │ Sales: 89                │  │
│ │ [Test Connection]   │  │ Last Sync: 2 min ago     │  │
│ └─────────────────────┘  └──────────────────────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Pending Transactions                                │  │
│ │                                                    │  │
│ │ 3 transactions waiting to sync                      │  │
│ │                                                    │  │
│ │ • Sale #1234 (2 min ago)                          │  │
│ │ • Product update: "Wireless Mouse" (5 min ago)    │  │
│ │ • Inventory adjustment (8 min ago)                 │  │
│ │                                                    │  │
│ │                           [Sync Pending Items]     │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Cached Data Details                                 │  │
│ ├─────────┬───────┬──────────┬────────────┬─────────┤  │
│ │ Entity  │ Count │ Size     │ Last Sync  │ Actions │  │
│ ├─────────┼───────┼──────────┼────────────┼─────────┤  │
│ │ Products│ 1,234 │ 15.2 MB  │ 2 min ago  │[↻][✕]  │  │
│ │ Customer│  567  │ 5.8 MB   │ 2 min ago  │[↻][✕]  │  │
│ │ Sales   │   89  │ 3.5 MB   │ 2 min ago  │[↻][✕]  │  │
│ └─────────┴───────┴──────────┴────────────┴─────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Recent Sync History                                 │  │
│ │                                                    │  │
│ │ ✅ Full sync - 2 min ago (2.3s)                    │  │
│ │ ✅ Push - 15 min ago (1.5s)                        │  │
│ │ ⚠️ Pull - 30 min ago (conflicts: 2)               │  │
│ │ ✅ Full sync - 1 hour ago (3.1s)                   │  │
│ │ ❌ Push - 2 hours ago (network error)              │  │
│ │                                                    │  │
│ │                         [View Full Sync Log]       │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Configuration                                       │  │
│ │                                                    │  │
│ │ ☑️ Enable auto-sync                                │  │
│ │ Sync interval: [5 minutes ▾]                       │  │
│ │ Cache size limit: [50 MB ▾]                        │  │
│ │                                                    │  │
│ │                              [Save Configuration]  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Troubleshooting                                     │  │
│ │                                                    │  │
│ │ [Clear All Cache]  [Reset Sync]  [Export Diagnostics]│
│ └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Cache Details Table Structure

| Column | Description | Actions |
|--------|-------------|---------|
| Entity Type | Type of cached data | - |
| Record Count | Number of cached records | - |
| Cache Size | Storage size in MB | - |
| Last Sync | Time since last update | - |
| Actions | Available operations | Refresh, Clear |

### Pending Transactions Display

```
┌─────────────────────────────────────────────────────┐
│ Pending Transaction #1                    [Details] │
├─────────────────────────────────────────────────────┤
│ Type: Sale                                          │
│ ID: SALE-1234                                       │
│ Operation: Create                                   │
│ Queued: 2 minutes ago                               │
│ Size: 2.3 KB                                        │
│                                                     │
│ Summary:                                            │
│ • Total: Rs. 5,450                                  │
│ • Items: 3                                          │
│ • Payment: Cash                                     │
│                                                     │
│ [Force Sync] [View Full Details] [Remove]          │
└─────────────────────────────────────────────────────┘
```

### Configuration Options

| Setting | Type | Options | Default |
|---------|------|---------|---------|
| Auto-sync | Toggle | On/Off | On |
| Sync interval | Dropdown | 1, 5, 10, 15, 30 min | 5 min |
| Cache size limit | Dropdown | 10, 25, 50, 100 MB | 50 MB |
| Offline mode | Toggle | Auto/Manual | Auto |

### Expected Outcome
```
frontend/
└── app/
    └── pos/
        └── settings/
            └── offline/
                └── page.tsx           # Offline status page
```

### Verification Checklist
- [ ] Status page file created in correct directory
- [ ] Page structure with all sections implemented
- [ ] Header section displays connection status
- [ ] Connection status card shows all details
- [ ] Cached data overview displays correctly
- [ ] Cache details table functional with all columns
- [ ] Pending transactions section lists all pending items
- [ ] Pending items expandable for details
- [ ] Sync history summary displays recent syncs
- [ ] Configuration section has all settings
- [ ] Data statistics calculate correctly
- [ ] Troubleshooting section with all actions
- [ ] Export diagnostics works
- [ ] Refresh functionality implemented
- [ ] Responsive layout on mobile
- [ ] All buttons and actions functional
- [ ] Real-time updates when data changes

---

## Task 84: Add Cache Refresh Button

### Overview
Create a button component that allows users to manually refresh cached data from the server, with options to refresh specific entities or all cached data.

### Dependencies
- Task 83: Create offline data status page
- Group D: Cache management service
- Offline status detection

### Instructions

1. **Create CacheRefreshButton component file**
   - Create file `CacheRefreshButton.tsx` in offline directory
   - Design as reusable button component

2. **Define component props interface**
   - Entity type to refresh (optional, null for all)
   - Button variant (primary, secondary, icon-only)
   - Size (small, medium, large)
   - Show progress flag
   - Success callback
   - Error callback

3. **Implement cache refresh hook**
   - Create or import `useCacheRefresh` hook
   - Hook provides refresh method
   - Hook accepts entity type parameter
   - Hook returns loading state and progress

4. **Create button UI structure**
   - Button with refresh icon
   - Optional text label
   - Progress indicator during refresh
   - Success/error feedback

5. **Implement button states**
   - Default: Ready to refresh icon
   - Loading: Spinning icon with progress
   - Success: Checkmark animation
   - Error: Error icon with message
   - Disabled: Grayed out when offline

6. **Add entity selection menu**
   - Dropdown menu for entity selection
   - Options: All, Products, Customers, Sales, etc.
   - Show entity icon in menu
   - Remember last selection

7. **Create refresh confirmation dialog**
   - Show for "Refresh All" action
   - Warn about network usage
   - Show estimated data size
   - Confirm or cancel

8. **Implement progress tracking**
   - Show percentage during refresh
   - Display entity being refreshed
   - Show count of records updated
   - Estimated time remaining

9. **Add online status check**
   - Check connection before refresh
   - Show warning if offline
   - Disable button when offline
   - Tooltip explains requirement

10. **Create success feedback**
    - Brief success animation
    - Show refresh summary
    - Display records updated count
    - Auto-hide after 3 seconds

11. **Implement error handling**
    - Display error message
    - Show retry option
    - Log error for debugging
    - Provide troubleshooting link

12. **Add cache invalidation options**
    - Option to clear before refresh
    - Option to merge with existing
    - Option to overwrite existing
    - Default: merge with existing

13. **Create button variants**
    - Full button with text and icon
    - Icon-only for compact layouts
    - Menu item for dropdowns
    - Inline link for tables

14. **Integrate into status page**
    - Add to header for global refresh
    - Add to cache details table for entity-specific refresh
    - Ensure consistent styling
    - Update UI after refresh completes

### Button States and Variants

```
Default State:
┌──────────────────────┐
│ ↻ Refresh Cache      │
└──────────────────────┘

With Dropdown:
┌──────────────────────┐
│ ↻ Refresh        [▾] │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│ 🔄 All Entities      │
│ 📦 Products Only     │
│ 👥 Customers Only    │
│ 💰 Sales Only        │
│ 📊 Inventory Only    │
└──────────────────────┘

Loading State:
┌──────────────────────┐
│ ⟳ Refreshing... 45%  │
└──────────────────────┘

Success State:
┌──────────────────────┐
│ ✅ Refreshed!        │
└──────────────────────┘

Error State:
┌──────────────────────┐
│ ❌ Failed (Retry)    │
└──────────────────────┘

Icon-Only Variant:
┌────┐
│ ↻  │
└────┘
```

### Refresh Confirmation Dialog

```
┌─────────────────────────────────────────────┐
│ Confirm Cache Refresh                  [X]  │
├─────────────────────────────────────────────┤
│                                             │
│ This will refresh all cached data from     │
│ the server.                                 │
│                                             │
│ Estimated data transfer:                    │
│ • Products: ~15 MB (1,234 records)          │
│ • Customers: ~6 MB (567 records)            │
│ • Sales: ~4 MB (89 records)                 │
│ ─────────────────────────────────────────   │
│ Total: ~25 MB                               │
│                                             │
│ ⚠️ This may take a few minutes on slow     │
│    connections.                             │
│                                             │
│ [Cancel]                 [Start Refresh]   │
└─────────────────────────────────────────────┘
```

### Progress Display During Refresh

```
┌─────────────────────────────────────────────┐
│ Refreshing Cache                            │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Products (1,234 records) - Complete      │
│ ⏳ Customers (567 records) - 45%            │
│ ⏸️ Sales (89 records) - Pending             │
│                                             │
│ Overall Progress:                           │
│ ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░ 35%                 │
│                                             │
│ Est. time remaining: 2 minutes              │
│                                             │
│                              [Cancel]       │
└─────────────────────────────────────────────┘
```

### Refresh Options

| Option | Description | Impact |
|--------|-------------|--------|
| **Merge** | Combine with existing cache | Preserves local changes |
| **Overwrite** | Replace cache completely | Discards local changes |
| **Clear & Refresh** | Delete then download | Fresh start |
| **Selective** | Refresh specific entities | Targeted refresh |

### Cache Refresh Strategies

| Strategy | When to Use | Data Usage |
|----------|-------------|------------|
| Full Refresh | Initial setup, major issues | High |
| Incremental | Regular updates | Low |
| Selective | Single entity changed | Minimal |
| Force Refresh | Data corruption | High |

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── ... (previous components)
            └── CacheRefreshButton.tsx     # Cache refresh control
```

### Verification Checklist
- [ ] CacheRefreshButton component created
- [ ] Props interface includes all options
- [ ] Hook integration for cache refresh
- [ ] All button states implemented
- [ ] Entity selection menu works
- [ ] Confirmation dialog displays
- [ ] Progress tracking functional
- [ ] Online status check works
- [ ] Success feedback displays
- [ ] Error handling implemented
- [ ] Retry option available
- [ ] Cache invalidation options work
- [ ] All button variants created
- [ ] Component integrated into status page
- [ ] Responsive on mobile devices
- [ ] Accessible to keyboard and screen readers

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 79 | Add offline mode restrictions UI | `OfflineRestrictions.tsx` wrapper component |
| 80 | Create SyncLogViewer component | `SyncLogViewer.tsx` log viewer |
| 81 | Create ManualSyncButton component | `ManualSyncButton.tsx` sync trigger |
| 82 | Add sync error toast notifications | `useSyncToasts.ts` hook |
| 83 | Create offline data status page | `page.tsx` status page |
| 84 | Add cache refresh button | `CacheRefreshButton.tsx` refresh control |

### Final Group E Directory Structure
```
frontend/
├── app/
│   └── pos/
│       └── settings/
│           └── offline/
│               └── page.tsx                    # Task 83
├── components/
│   └── pos/
│       └── offline/
│           ├── OfflineIndicator.tsx            # Task 73
│           ├── ConnectionStatusIcon.tsx        # Task 74
│           ├── SyncStatusBar.tsx              # Task 75
│           ├── PendingTransactionBadge.tsx    # Task 76
│           ├── SyncConflictModal.tsx          # Task 77
│           ├── OfflineBanner.tsx              # Task 78
│           ├── OfflineRestrictions.tsx        # Task 79
│           ├── SyncLogViewer.tsx              # Task 80
│           ├── ManualSyncButton.tsx           # Task 81
│           └── CacheRefreshButton.tsx         # Task 84
└── hooks/
    ├── useOfflineStatus.ts
    ├── useSyncProgress.ts
    ├── usePendingCount.ts
    ├── useSyncHistory.ts
    ├── useManualSync.ts
    ├── useSyncToasts.ts                        # Task 82
    ├── useFeatureRestriction.ts
    └── useCacheRefresh.ts
```

### Component Integration in POS Application

```
┌─────────────────────────────────────────────────────────┐
│ POS Application                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [OfflineBanner] ← Visible when offline                 │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Header                                          │   │
│ │ [Logo]  [OfflineIndicator]  [PendingBadge]    │   │
│ │         [ManualSyncButton]                      │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ <OfflineRestrictions type="DISABLED">          │   │
│ │   Main Content (restricted when offline)        │   │
│ │ </OfflineRestrictions>                          │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ [SyncStatusBar] ← Visible during sync                  │
│                                                         │
│ Settings → Offline Status Page:                        │
│ • Connection status                                     │
│ • [CacheRefreshButton]                                 │
│ • [SyncLogViewer]                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘

[SyncConflictModal] ← Modal overlay when conflicts
[Toast Notifications] ← useSyncToasts hook
```

### Group E Completion
All 12 tasks in Group E are now documented. The frontend offline components provide:
- Visual status indicators for connection and sync state
- Progress tracking and pending transaction badges
- Conflict resolution UI
- Offline mode warnings and restrictions
- Comprehensive sync logging and history
- Manual sync triggers and cache management
- Toast notifications for all sync events
- Detailed status page with diagnostics
- Cache refresh controls

### Next Steps
1. Proceed to [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/) for testing and documentation
2. Implement all frontend components
3. Integrate components with backend sync services
4. Test offline mode workflows end-to-end
5. Verify responsive design on mobile devices

---

## Notes for AI Agents

1. **Execution Order:** Tasks 79-82 can be done in parallel, Task 83 should integrate previous components, Task 84 integrates into Task 83
2. **No Code Generation:** These are instructions only; implementation is developer's responsibility
3. **Component Library:** Use Shadcn/UI, Radix UI, or similar for base components
4. **Toast Library:** Recommend Sonner or React Hot Toast for notifications
5. **Real-time Updates:** All components must react to sync events in real-time
6. **Offline First:** Design all components to work offline when possible
7. **Accessibility:** Full ARIA support and keyboard navigation required
8. **Mobile Responsive:** All components must work on mobile devices
9. **TypeScript:** Full type safety required for all components
10. **Testing:** Unit tests for hooks, integration tests for components
11. **Performance:** Optimize for smooth animations and real-time updates
12. **Error Handling:** All components must handle errors gracefully
