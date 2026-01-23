# Tasks 73-78: Status Indicators and Banners

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** E - Frontend Offline Components  
> **Document:** 01 of 02  
> **Tasks Covered:** 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Sync-Engine-Conflict-Resolution/](../Group-D_Sync-Engine-Conflict-Resolution/)
- **→ Next Document:** [02_Tasks-79-84_Management-Components.md](02_Tasks-79-84_Management-Components.md)

---

## Document Overview

This document covers the creation of frontend components that display connection status, sync progress, and offline mode warnings. These components provide visual feedback to users about the current state of the POS system's connectivity and data synchronization.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create OfflineIndicator component | Medium | 25 min |
| 74 | Add connection status icon | Medium | 20 min |
| 75 | Create SyncStatusBar component | High | 30 min |
| 76 | Add pending transaction badge | Medium | 20 min |
| 77 | Create SyncConflictModal component | High | 35 min |
| 78 | Create OfflineBanner component | Medium | 25 min |

---

## Task 73: Create OfflineIndicator Component

### Overview
Create a React component that displays the current online/offline status of the POS system with visual indicators for different connection states.

### Dependencies
- Group D: Sync Engine & Conflict Resolution (offline detection hooks)
- React/Next.js frontend infrastructure
- Tailwind CSS configuration

### Instructions

1. **Create component directory structure**
   - Create directory `frontend/components/pos/offline/`
   - Create file `OfflineIndicator.tsx` in the offline directory

2. **Define component props interface**
   - Status type (ONLINE, OFFLINE, SYNCING, SYNC_ERROR)
   - Optional className for styling customization
   - Optional show text flag
   - Optional compact mode flag

3. **Implement connection status hook integration**
   - Import or create `useOfflineStatus` hook
   - Hook should monitor browser online/offline events
   - Hook should monitor sync service status
   - Hook should return current status and last sync timestamp

4. **Create status display logic**
   - Map each status to appropriate icon
   - Map each status to text label
   - Map each status to color scheme
   - Include animation for SYNCING state

5. **Implement component UI structure**
   - Container with flexbox layout
   - Icon element with status-based color
   - Text label (optional based on props)
   - Tooltip with additional details on hover

6. **Add accessibility features**
   - ARIA labels for status
   - ARIA live region for status changes
   - Keyboard navigation support
   - Screen reader announcements

7. **Implement status color scheme**
   - ONLINE: Green (Tailwind: text-green-600, bg-green-50)
   - OFFLINE: Red (Tailwind: text-red-600, bg-red-50)
   - SYNCING: Yellow/amber with pulse animation (text-amber-600, bg-amber-50)
   - SYNC_ERROR: Orange (text-orange-600, bg-orange-50)

8. **Add compact mode styling**
   - Smaller icon size
   - Remove text label
   - Minimal padding
   - Suitable for toolbar placement

9. **Create TypeScript type definitions**
   - OfflineIndicatorProps interface
   - ConnectionStatus enum or type
   - StatusConfig type for icon/color mapping

10. **Add responsive behavior**
    - Hide text on mobile screens if needed
    - Adjust icon size for different breakpoints
    - Ensure clickable area is touch-friendly

### Status Mapping Table

| Status | Icon | Color | Text | Animation |
|--------|------|-------|------|-----------|
| ONLINE | ✓ Checkmark | Green | "Online" | None |
| OFFLINE | ✗ Cross | Red | "Offline" | None |
| SYNCING | ⟳ Circular arrow | Yellow/Amber | "Syncing..." | Spin |
| SYNC_ERROR | ⚠ Warning | Orange | "Sync Error" | None |

### Status Display Diagram

```
┌─────────────────────────────────┐
│ Component States                │
├─────────────────────────────────┤
│                                 │
│  🟢 Online                      │  ← Normal operation
│                                 │
│  🔴 Offline                     │  ← No connection
│                                 │
│  🟡 Syncing... (animated)       │  ← Sync in progress
│                                 │
│  🟠 Sync Error                  │  ← Sync failed
│                                 │
└─────────────────────────────────┘
```

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            └── OfflineIndicator.tsx   # Status indicator component
```

### Verification Checklist
- [ ] Component file created in correct directory
- [ ] TypeScript interfaces defined for props and status
- [ ] Hook integration for real-time status updates
- [ ] All four status states implemented
- [ ] Color scheme matches specification
- [ ] Accessibility features included (ARIA labels, live regions)
- [ ] Compact mode implemented
- [ ] Component is responsive
- [ ] Animation works for SYNCING state
- [ ] Tooltip shows additional information on hover

---

## Task 74: Add Connection Status Icon

### Overview
Enhance the OfflineIndicator component with a dedicated connection status icon that provides visual feedback and can be used independently throughout the application.

### Dependencies
- Task 73: Create OfflineIndicator component
- Icon library (Lucide React, Heroicons, or custom SVG)

### Instructions

1. **Select or create connection status icons**
   - Choose icon library or create custom SVG icons
   - Ensure icons are visually distinct for each status
   - Maintain consistent size and style

2. **Create ConnectionStatusIcon sub-component**
   - Create file `ConnectionStatusIcon.tsx` in offline directory
   - Make it reusable across different contexts
   - Support different sizes (small, medium, large)

3. **Define icon props interface**
   - Status type (required)
   - Size variant (optional, default: medium)
   - Custom className (optional)
   - Show animation flag (optional)

4. **Implement icon rendering logic**
   - Switch/map based on status type
   - Return appropriate icon component
   - Apply status-specific colors
   - Add animation classes for SYNCING state

5. **Create icon size variants**
   - Small: 16x16px (w-4 h-4)
   - Medium: 24x24px (w-6 h-6)
   - Large: 32x32px (w-8 h-8)

6. **Implement SYNCING animation**
   - CSS keyframes for rotation
   - Smooth animation with `animate-spin`
   - Use Tailwind's built-in animation or custom CSS

7. **Add icon color states**
   - Use currentColor for flexibility
   - Apply Tailwind text color classes
   - Support hover states for interactive contexts

8. **Integrate icon into OfflineIndicator**
   - Replace or enhance existing icon implementation
   - Pass through status and size props
   - Maintain backward compatibility

9. **Create standalone icon usage examples**
   - In toolbar/header
   - In status bar
   - In settings pages
   - As badge overlay

10. **Export icon component**
    - Export from index file
    - Include in component library
    - Add to Storybook/documentation if available

### Icon Selection Guide

| Status | Recommended Icon | Alternative |
|--------|------------------|-------------|
| ONLINE | Wifi/Signal icon | Checkmark circle |
| OFFLINE | Wifi-off/Signal-slash | X circle |
| SYNCING | Refresh/Arrows | Loading spinner |
| SYNC_ERROR | Alert triangle | Exclamation circle |

### Icon Size Reference

```
┌────────────────────────────────┐
│ Icon Sizes                     │
├────────────────────────────────┤
│                                │
│  Small (16x16):   [◯]         │
│                                │
│  Medium (24x24):  [◯]         │
│                                │
│  Large (32x32):   [◯]         │
│                                │
└────────────────────────────────┘
```

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── OfflineIndicator.tsx        # Enhanced with icon
            └── ConnectionStatusIcon.tsx    # Standalone icon component
```

### Verification Checklist
- [ ] Icon component file created
- [ ] Props interface defined
- [ ] All status states have distinct icons
- [ ] Three size variants implemented
- [ ] Animation works for SYNCING status
- [ ] Colors match status specification
- [ ] Icon integrated into OfflineIndicator
- [ ] Component is reusable independently
- [ ] TypeScript types properly exported
- [ ] Icons render correctly across browsers

---

## Task 75: Create SyncStatusBar Component

### Overview
Create a comprehensive status bar component that displays real-time sync progress, pending transaction count, and sync operation details.

### Dependencies
- Task 73: Create OfflineIndicator component
- Task 74: Add connection status icon
- Group D: Sync Engine (sync progress hooks)

### Instructions

1. **Create SyncStatusBar component file**
   - Create file `SyncStatusBar.tsx` in offline directory
   - Plan for horizontal bar layout

2. **Define component props interface**
   - Show/hide flag
   - Position variant (top, bottom, floating)
   - Compact mode flag
   - Custom className

3. **Implement sync progress hook integration**
   - Create or import `useSyncProgress` hook
   - Hook should return current sync operation details
   - Hook should provide percentage completion
   - Hook should return entity being synced

4. **Create progress bar UI structure**
   - Container with fixed/sticky positioning option
   - Left section: sync status icon and text
   - Center section: progress bar with percentage
   - Right section: pending count badge

5. **Implement progress bar visualization**
   - Animated progress bar fill
   - Smooth transitions for percentage updates
   - Color-coded based on status
   - Show/hide based on active sync operation

6. **Add sync status text display**
   - "Idle" when no sync active
   - "Syncing..." with entity name when active
   - "Sync complete" with success animation
   - "Sync failed" with error state

7. **Calculate and display pending counts**
   - Count of unsynced transactions
   - Count of pending orders
   - Count of pending products
   - Total pending operations

8. **Implement auto-hide behavior**
   - Show when sync starts
   - Show for 3 seconds after sync completes
   - Stay visible if pending items exist
   - Fade in/out animations

9. **Add detailed info tooltip**
   - Hover shows detailed sync information
   - List of entities being synced
   - Start time and duration
   - Success/failure counts

10. **Create responsive layout**
    - Full width on desktop
    - Adapt to mobile screens
    - Compact mode for limited space
    - Stack elements on small screens

11. **Implement status color coding**
    - Blue/info color during sync
    - Green for successful completion
    - Red for sync errors
    - Gray for idle state

12. **Add click interactions**
    - Click to expand detailed view
    - Click pending badge to show pending items
    - Click error to show error details

### SyncStatusBar Layout

```
┌────────────────────────────────────────────────────────┐
│ 🔄 Syncing products...  ▓▓▓▓▓▓▓▓░░░░░░░░ 45%  📋 3    │
│                         ←─ Progress Bar ─→    Pending  │
└────────────────────────────────────────────────────────┘

States:
┌────────────────────────────────────────────────────────┐
│ ✓ Sync complete                              📋 0     │  ← Success
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ ✗ Sync failed (click for details)           📋 5     │  ← Error
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ ⏸ Idle                                       📋 0     │  ← Idle
└────────────────────────────────────────────────────────┘
```

### Sync Progress States

| State | Icon | Color | Progress Bar | Auto-hide |
|-------|------|-------|--------------|-----------|
| Idle | Pause | Gray | Hidden | After 3s |
| Syncing | Spinner | Blue | 0-100% | No |
| Complete | Check | Green | 100% | After 3s |
| Failed | X | Red | Paused | No |

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── OfflineIndicator.tsx
            ├── ConnectionStatusIcon.tsx
            └── SyncStatusBar.tsx          # Sync progress bar
```

### Verification Checklist
- [ ] Component file created
- [ ] Props interface defined with all variants
- [ ] Hook integration for real-time sync data
- [ ] Progress bar animates smoothly
- [ ] Percentage displays correctly (0-100%)
- [ ] Pending count updates in real-time
- [ ] All status states render correctly
- [ ] Auto-hide behavior works as specified
- [ ] Tooltip shows detailed information
- [ ] Responsive on mobile devices
- [ ] Click interactions functional
- [ ] Color coding matches specification
- [ ] Animations smooth and performant

---

## Task 76: Add Pending Transaction Badge

### Overview
Create a badge component that displays the count of pending (unsynced) transactions and can be integrated into various UI components like the SyncStatusBar, navigation bar, and settings page.

### Dependencies
- Task 75: Create SyncStatusBar component
- Group D: Offline storage service (pending transactions query)

### Instructions

1. **Create PendingTransactionBadge component file**
   - Create file `PendingTransactionBadge.tsx` in offline directory
   - Design as standalone reusable component

2. **Define component props interface**
   - Show count flag (show/hide number)
   - Variant (default, minimal, detailed)
   - Size (small, medium, large)
   - Custom className
   - onClick handler (optional)

3. **Implement pending count hook**
   - Create or import `usePendingCount` hook
   - Hook queries offline storage for unsynced items
   - Hook returns counts by entity type
   - Hook updates in real-time

4. **Calculate total pending count**
   - Count pending sales transactions
   - Count pending product updates
   - Count pending inventory adjustments
   - Sum all pending operations

5. **Create badge UI structure**
   - Badge icon (document/clipboard icon)
   - Count number display
   - Optional label text
   - Visual indicator dot when count > 0

6. **Implement count display logic**
   - Show exact count for 1-99
   - Show "99+" for counts ≥ 100
   - Show empty state when count is 0
   - Animate when count changes

7. **Add visual states**
   - Default state (gray) when count is 0
   - Warning state (yellow) when count is 1-10
   - Alert state (orange) when count is 11-50
   - Critical state (red) when count > 50

8. **Create variant styles**
   - Default: Icon + count + optional label
   - Minimal: Count only in small circle
   - Detailed: Breakdown by entity type in tooltip

9. **Implement tooltip for detailed view**
   - Show on hover
   - List entity types with counts
   - Show oldest pending item timestamp
   - Show sync status

10. **Add click interaction**
    - Click to navigate to pending items list
    - Click to trigger manual sync (optional)
    - Click to show detailed modal

11. **Integrate into SyncStatusBar**
    - Position in right section of status bar
    - Update SyncStatusBar to include badge
    - Ensure visual consistency

12. **Add animation effects**
    - Pulse animation when count increases
    - Bounce animation when new pending item added
    - Fade animation when count decreases

### Badge Display Variants

```
Default Variant:
┌──────────────┐
│ 📋 3 pending │
└──────────────┘

Minimal Variant:
┌────┐
│ 3  │  ← Small circle badge
└────┘

Detailed Variant (with tooltip on hover):
┌──────────────┐        ┌─────────────────────┐
│ 📋 5 pending │  →→→   │ • 3 Sales           │
└──────────────┘        │ • 1 Product update  │
                        │ • 1 Inventory adj   │
                        │                     │
                        │ Oldest: 5 min ago   │
                        └─────────────────────┘
```

### Badge Color States

| Pending Count | Color | CSS Class | Urgency |
|---------------|-------|-----------|---------|
| 0 | Gray | text-gray-500 bg-gray-100 | None |
| 1-10 | Yellow | text-yellow-600 bg-yellow-100 | Low |
| 11-50 | Orange | text-orange-600 bg-orange-100 | Medium |
| > 50 | Red | text-red-600 bg-red-100 | High |

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── OfflineIndicator.tsx
            ├── ConnectionStatusIcon.tsx
            ├── SyncStatusBar.tsx              # Includes badge
            └── PendingTransactionBadge.tsx    # Standalone badge
```

### Verification Checklist
- [ ] Badge component file created
- [ ] Props interface includes all variants
- [ ] Hook integration for real-time count updates
- [ ] Total count calculates correctly
- [ ] Count display shows "99+" for large numbers
- [ ] All color states implemented
- [ ] Three variants render correctly
- [ ] Tooltip shows detailed breakdown
- [ ] Animations work smoothly
- [ ] Click handler executes properly
- [ ] Badge integrated into SyncStatusBar
- [ ] Component is reusable independently
- [ ] Responsive on all screen sizes
- [ ] Accessibility features included

---

## Task 77: Create SyncConflictModal Component

### Overview
Create a modal component that displays sync conflicts and allows users to resolve them by choosing between local and server versions or merging changes.

### Dependencies
- Task 73: Create OfflineIndicator component
- Group D: Conflict detection service
- Shadcn/UI modal components (or equivalent)

### Instructions

1. **Create SyncConflictModal component file**
   - Create file `SyncConflictModal.tsx` in offline directory
   - Use modal/dialog component from UI library

2. **Define component props interface**
   - Conflict data object
   - Open/close state
   - onResolve callback
   - onCancel callback
   - Entity type

3. **Design conflict data structure**
   - Entity type (product, sale, customer, etc.)
   - Entity ID and name
   - Local version with timestamp
   - Server version with timestamp
   - Conflicting fields list
   - Conflict detected timestamp

4. **Create modal structure layout**
   - Header with entity information
   - Two-column comparison view (local vs server)
   - Field-by-field conflict list
   - Resolution options section
   - Action buttons (resolve, cancel)

5. **Implement entity information display**
   - Entity type badge
   - Entity name/identifier
   - Conflict detection time
   - Number of conflicting fields

6. **Create side-by-side comparison view**
   - Left column: Local version
   - Right column: Server version
   - Highlight conflicting fields
   - Show timestamps for each version

7. **Build field comparison list**
   - Iterate through conflicting fields
   - Display field name
   - Show local value with label
   - Show server value with label
   - Highlight differences visually

8. **Implement resolution options**
   - "Keep Local" button - use local version
   - "Keep Server" button - use server version
   - "Merge" button (if applicable) - combine changes
   - Field-level resolution (advanced)

9. **Add field-level resolution UI**
   - Radio buttons for each field
   - Select local or server value per field
   - Preview of merged result
   - Apply selected resolution

10. **Create confirmation flow**
    - Show summary of selected resolution
    - Confirm action button
    - Warning for irreversible actions
    - Success/error feedback

11. **Implement cancel/close behavior**
    - Cancel button to close without resolving
    - X button in header
    - Escape key to close
    - Backdrop click to close (optional)

12. **Add visual indicators**
    - Color-code conflicting fields (red/amber)
    - Show modification timestamps
    - Display user who made changes (if available)
    - Icon for field type

13. **Handle multiple conflicts**
    - Support conflict queue
    - Show "1 of 3 conflicts" counter
    - Previous/Next navigation buttons
    - Resolve all or skip to next

14. **Add accessibility features**
    - Focus trap within modal
    - ARIA labels for all interactive elements
    - Keyboard navigation support
    - Screen reader announcements

### Modal Layout Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Sync Conflict: Product #12345                          [X]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🏷️ Product "Wireless Mouse"                                │
│ ⚠️ Conflict detected 2 minutes ago                         │
│ 📊 3 fields have conflicting changes                       │
│                                                             │
├──────────────────────┬──────────────────────────────────────┤
│   Local Version      │      Server Version                  │
│   (Your changes)     │      (Latest from server)            │
├──────────────────────┼──────────────────────────────────────┤
│                      │                                      │
│ Price: Rs. 2,500     │ Price: Rs. 2,800  ← Conflict        │
│ Stock: 45            │ Stock: 45                            │
│ Name: Wireless Mouse │ Name: Wireless Mouse Pro ← Conflict  │
│                      │                                      │
│ Modified: 5 min ago  │ Modified: 2 min ago                  │
│                      │                                      │
└──────────────────────┴──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Resolution Options:                                         │
│                                                             │
│ ○ Keep My Changes (Local Version)                          │
│ ○ Use Server Version (Discard My Changes)                  │
│ ○ Resolve Field by Field (Advanced)                        │
│                                                             │
│ [Cancel]                               [Resolve Conflict]  │
└─────────────────────────────────────────────────────────────┘
```

### Field-Level Resolution View

```
┌─────────────────────────────────────────────────────────────┐
│ Field-by-Field Resolution                              [X]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Price:                                                      │
│ ◉ Local: Rs. 2,500    ○ Server: Rs. 2,800                 │
│                                                             │
│ Product Name:                                               │
│ ○ Local: Wireless Mouse    ◉ Server: Wireless Mouse Pro   │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│                                                             │
│ Preview of Merged Result:                                   │
│ • Price: Rs. 2,500                                         │
│ • Name: Wireless Mouse Pro                                 │
│ • Stock: 45                                                │
│                                                             │
│ [Cancel]                                       [Apply]     │
└─────────────────────────────────────────────────────────────┘
```

### Resolution Options

| Option | Description | Use Case |
|--------|-------------|----------|
| Keep Local | Use your local version, discard server changes | Your changes are more recent/accurate |
| Keep Server | Use server version, discard your changes | Server has correct data |
| Merge | Combine both versions field-by-field | Both have valid changes |
| Skip | Resolve later, move to next conflict | Need more information |

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── OfflineIndicator.tsx
            ├── ConnectionStatusIcon.tsx
            ├── SyncStatusBar.tsx
            ├── PendingTransactionBadge.tsx
            └── SyncConflictModal.tsx       # Conflict resolution modal
```

### Verification Checklist
- [ ] Modal component file created
- [ ] Props interface includes all required data
- [ ] Modal opens/closes correctly
- [ ] Entity information displays clearly
- [ ] Side-by-side comparison shows both versions
- [ ] Conflicting fields are highlighted
- [ ] All resolution options functional
- [ ] Field-level resolution works correctly
- [ ] Confirmation flow implemented
- [ ] Cancel/close behavior works
- [ ] Multiple conflict navigation implemented
- [ ] Visual indicators display correctly
- [ ] Accessibility features included
- [ ] Resolution callback fires with correct data
- [ ] Responsive layout on mobile devices

---

## Task 78: Create OfflineBanner Component

### Overview
Create a prominent banner component that displays at the top of the POS interface when the system is operating in offline mode, informing users about reduced functionality and automatic syncing.

### Dependencies
- Task 73: Create OfflineIndicator component
- Offline status detection hook

### Instructions

1. **Create OfflineBanner component file**
   - Create file `OfflineBanner.tsx` in offline directory
   - Design as fixed/sticky banner

2. **Define component props interface**
   - Show/hide state
   - Position (top, bottom)
   - Dismissible flag
   - Custom message (optional)
   - Show actions flag

3. **Implement offline status detection**
   - Use `useOfflineStatus` hook
   - Banner shows only when offline
   - Auto-hide when connection restored
   - Animate show/hide transitions

4. **Create banner UI structure**
   - Full-width container
   - Warning icon
   - Message text
   - Optional action buttons
   - Dismiss button (if dismissible)

5. **Design banner message content**
   - Primary message: "You are currently offline"
   - Secondary message: "Transactions will be saved locally and synced when connection is restored"
   - Include pending transaction count
   - Show last successful sync time

6. **Implement banner styling**
   - Warning color scheme (yellow/amber background)
   - Contrasting text color
   - Subtle border or shadow
   - Adequate padding for readability

7. **Add banner positioning**
   - Fixed to top of viewport by default
   - Option for bottom positioning
   - Z-index to stay above content
   - Push content down (no overlay)

8. **Create action buttons**
   - "Retry Connection" button
   - "View Pending Items" button
   - "Settings" button (link to offline settings)
   - Icon buttons for compact layout

9. **Implement dismissible behavior**
   - Show close/dismiss button if enabled
   - Store dismissed state in session
   - Re-show on page reload or status change
   - Animate dismissal

10. **Add responsive layout**
    - Full message on desktop
    - Abbreviated message on mobile
    - Stack buttons on small screens
    - Adjust padding for mobile

11. **Create animation effects**
    - Slide down animation on show
    - Slide up animation on hide
    - Fade transition for appearance
    - Smooth collapse animation on dismiss

12. **Implement accessibility**
    - ARIA role="alert" for urgency
    - ARIA live region for dynamic updates
    - Focus management for buttons
    - Screen reader friendly messages

13. **Add conditional display logic**
    - Show immediately when offline
    - Don't show if user is syncing intentionally
    - Show priority message if sync failed
    - Hide after connection restored for 3 seconds

### Banner Layout Diagram

```
Desktop View:
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ You are currently offline. Transactions will be saved   │
│    locally and synced when connection is restored.          │
│    3 pending transactions                                   │
│                                                              │
│    [Retry Connection]  [View Pending]  [Settings]    [X]   │
└─────────────────────────────────────────────────────────────┘

Mobile View:
┌──────────────────────────────────────┐
│ ⚠️ Offline Mode                      │
│ 3 pending • Last sync: 5 min ago    │
│                                      │
│ [Retry]  [Pending]            [X]   │
└──────────────────────────────────────┘

Compact View:
┌──────────────────────────────────────┐
│ ⚠️ Offline • 3 pending      [↻] [X] │
└──────────────────────────────────────┘
```

### Banner States

| Connection State | Banner Display | Color | Actions |
|-----------------|----------------|-------|---------|
| Online | Hidden | - | None |
| Offline | Visible | Yellow/Amber | Retry, View |
| Sync Failed | Visible | Red/Orange | Retry, Details |
| Reconnecting | Visible | Blue | Cancel, Wait |

### Banner Message Variants

| Scenario | Primary Message | Secondary Message |
|----------|----------------|-------------------|
| Just went offline | You are currently offline | Transactions will sync when connection returns |
| Offline with pending | Offline mode active | 5 transactions pending sync |
| Sync failed | Sync failed | Click to retry or view error details |
| Reconnecting | Reconnecting... | Please wait while we restore connection |

### Expected Outcome
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── OfflineIndicator.tsx
            ├── ConnectionStatusIcon.tsx
            ├── SyncStatusBar.tsx
            ├── PendingTransactionBadge.tsx
            ├── SyncConflictModal.tsx
            └── OfflineBanner.tsx           # Offline warning banner
```

### Verification Checklist
- [ ] Banner component file created
- [ ] Props interface defined
- [ ] Offline status detection working
- [ ] Banner shows only when offline
- [ ] Banner hides when online
- [ ] Message content is clear and helpful
- [ ] Pending count displays correctly
- [ ] Last sync time shown
- [ ] Action buttons functional
- [ ] Dismissible behavior works (if enabled)
- [ ] Positioning options work (top/bottom)
- [ ] Animations smooth and performant
- [ ] Responsive on mobile devices
- [ ] Accessibility features implemented
- [ ] ARIA attributes correct

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 73 | Create OfflineIndicator component | `OfflineIndicator.tsx` status display |
| 74 | Add connection status icon | `ConnectionStatusIcon.tsx` icon component |
| 75 | Create SyncStatusBar component | `SyncStatusBar.tsx` progress bar |
| 76 | Add pending transaction badge | `PendingTransactionBadge.tsx` count badge |
| 77 | Create SyncConflictModal component | `SyncConflictModal.tsx` conflict resolver |
| 78 | Create OfflineBanner component | `OfflineBanner.tsx` warning banner |

### Component Directory Structure
```
frontend/
└── components/
    └── pos/
        └── offline/
            ├── OfflineIndicator.tsx           # Task 73
            ├── ConnectionStatusIcon.tsx        # Task 74
            ├── SyncStatusBar.tsx              # Task 75
            ├── PendingTransactionBadge.tsx    # Task 76
            ├── SyncConflictModal.tsx          # Task 77
            └── OfflineBanner.tsx              # Task 78
```

### Component Integration Flow

```
┌─────────────────────────────────────────────────────────┐
│ POS Layout                                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [OfflineBanner] ← Shows when offline                   │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Header                                          │   │
│ │ [OfflineIndicator]           [PendingBadge]    │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ Main Content                                            │
│                                                         │
│ [SyncStatusBar] ← Shows during sync                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

[SyncConflictModal] ← Shows when conflict detected
```

### Component Dependencies

```
ConnectionStatusIcon (Task 74)
        ↓
OfflineIndicator (Task 73)
        ↓
┌───────┴────────┬──────────────┐
│                │              │
SyncStatusBar  OfflineBanner  SyncConflictModal
(Task 75)      (Task 78)     (Task 77)
│
PendingTransactionBadge
(Task 76)
```

### Next Steps
1. Proceed to [02_Tasks-79-84_Management-Components.md](02_Tasks-79-84_Management-Components.md) to create management and utility components
2. Test all status indicator components together
3. Verify real-time updates work correctly
4. Ensure responsive design across devices

---

## Notes for AI Agents

1. **Execution Order:** Tasks 73-74 should be completed first, followed by 75-76, then 77-78
2. **No Code Generation:** These are instructions only; actual implementation is the developer's responsibility
3. **Component Library:** Assume Shadcn/UI or similar component library is available
4. **Hook Dependencies:** All components depend on hooks from Group D (Sync Engine)
5. **Real-time Updates:** All components must react to real-time status/sync changes
6. **Accessibility:** ARIA labels and keyboard navigation are mandatory
7. **Responsive Design:** All components must work on mobile devices
8. **Animation Performance:** Use CSS transforms for smooth animations
9. **TypeScript:** All components must be fully typed
10. **Testing:** Each component should have corresponding test files
