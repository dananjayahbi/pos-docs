# Tasks 81-92: UI Components & Tests

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** F - UI & Testing  
> **Document:** 01 of 01  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-E: Detection & Resolution](../Group-E_Conflict-Resolution/01_Tasks-69-80_Detection-Resolution.md)
- **→ Next SubPhase:** [SubPhase-09: Real-time Sync Engine](../../SubPhase-09_Real-time-Sync-Engine/)

---

## Document Overview

This document covers the creation of comprehensive offline UI components and testing infrastructure for the POS Offline Enhancement system. It includes status indicators, synchronization controls, conflict resolution interfaces, and thorough integration and stress tests to ensure robust offline functionality.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create Offline Indicator | Low | 30 min |
| 82 | Create Sync Status Icon | Low | 30 min |
| 83 | Create Pending Count | Low | 25 min |
| 84 | Create Sync Button | Low | 30 min |
| 85 | Create Sync Progress Modal | Medium | 60 min |
| 86 | Create Conflict Modal | Medium | 60 min |
| 87 | Create Error Toast | Low | 20 min |
| 88 | Create Offline Banner | Low | 25 min |
| 89 | Create Storage Stats | Low | 35 min |
| 90 | Create Prefetch Button | Low | 30 min |
| 91 | Create Integration Tests | High | 120 min |
| 92 | Create Stress Test | Medium | 60 min |

---

## Task 81: Create Offline Indicator

### Overview
Create the OfflineIndicator component that displays the current network connectivity status in the POS application's status bar. This component provides immediate visual feedback about online/offline status using appropriate icons and colors, and updates automatically when connectivity changes.

### Dependencies
- Task 80: Implement Auto-Sync Logic (Group E)
- Shadcn/UI components installed
- Lucide React icons available
- useOfflineStore hook from Task 80

### Instructions

1. **Create component directory structure**
   - Navigate to `frontend/components/` directory
   - Create new directory named `offline`
   - This will house all offline-related UI components

2. **Create OfflineIndicator component file**
   - Create `OfflineIndicator.tsx` in `components/offline/` directory
   - Set up TypeScript React functional component structure
   - Import necessary dependencies (React, icons, store hooks)

3. **Import required icons from Lucide React**
   - Import `Wifi` icon for online state
   - Import `WifiOff` icon for offline state
   - Import `Loader2` icon for syncing state
   - Ensure icons are properly typed

4. **Connect to offline store**
   - Import `useOfflineStore` hook from state management
   - Subscribe to `isOnline` state
   - Subscribe to `isSyncing` state
   - Ensure component re-renders on state changes

5. **Implement status determination logic**
   - Create function to determine current status
   - Priority: syncing > offline > online
   - Return appropriate icon and color for each state

6. **Render indicator with appropriate styling**
   - Display icon based on current status
   - Apply color coding (green for online, red for offline, yellow for syncing)
   - Add accessible text label or tooltip
   - Position in status bar area

7. **Add animation for syncing state**
   - Apply spin animation to Loader2 icon during sync
   - Use CSS animation or Framer Motion
   - Ensure smooth animation performance

8. **Implement tooltip for additional information**
   - Show detailed status on hover
   - Include last sync time if available
   - Display pending operations count if applicable

### Component Status States

| State | Icon | Color | Animation | Tooltip Text |
|-------|------|-------|-----------|--------------|
| Online | Wifi | Green (`text-green-600`) | None | "Connected to server" |
| Offline | WifiOff | Red (`text-red-600`) | None | "Working offline" |
| Syncing | Loader2 | Yellow (`text-yellow-600`) | Spin | "Syncing data..." |

### Status Determination Logic

```
┌─────────────────────────────────────┐
│         Is Syncing?                 │
│              │                      │
│      Yes ────┴──── No              │
│       │              │              │
│   [Syncing]    Is Online?          │
│                      │              │
│              Yes ────┴──── No      │
│               │              │      │
│           [Online]      [Offline]  │
└─────────────────────────────────────┘
```

### Visual Representation

```
Status Bar
┌────────────────────────────────────┐
│  POS System       🟢 Online     👤 │
│                                    │
│  [Transaction Screen]              │
└────────────────────────────────────┘

Syncing State
┌────────────────────────────────────┐
│  POS System       ⟳ Syncing    👤 │
│                                    │
│  [Transaction Screen]              │
└────────────────────────────────────┘

Offline State
┌────────────────────────────────────┐
│  POS System       🔴 Offline    👤 │
│                                    │
│  [Transaction Screen]              │
└────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex items-center gap-2` | Icon and text alignment |
| Icon | `h-4 w-4` | Consistent icon size |
| Text | `text-sm font-medium` | Readable status label |
| Online | `text-green-600` | Positive state |
| Offline | `text-red-600` | Alert state |
| Syncing | `text-yellow-600 animate-spin` | Active state |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Screen Reader | `aria-label` with current status |
| Color Independence | Icon shape differs by state |
| Focus Indicator | Visible focus ring if interactive |
| Status Update | Announce changes to screen readers |

### Expected Outcome
- Functional component displaying network connectivity status
- Real-time updates when connectivity changes
- Clear visual indicators using icons and colors
- Accessible to all users including screen readers
- Smooth animations for state transitions

### Verification Checklist
- [ ] `frontend/components/offline/OfflineIndicator.tsx` file created
- [ ] Component imports useOfflineStore hook
- [ ] All three icons (Wifi, WifiOff, Loader2) imported
- [ ] Component renders correct icon for each state
- [ ] Color coding applied correctly
- [ ] Spin animation works for syncing state
- [ ] Tooltip displays additional information
- [ ] Component positioned in status bar
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 82: Create Sync Status Icon

### Overview
Create the SyncStatus component that displays the current synchronization state with detailed visual feedback. This component shows whether data is synced, currently syncing, has pending operations, or encountered errors, using distinct icons and animations for each state.

### Dependencies
- Task 81: Create Offline Indicator
- Task 80: Implement Auto-Sync Logic
- Lucide React icons library
- useOfflineStore and useSyncStore hooks

### Instructions

1. **Create SyncStatus component file**
   - Create `SyncStatus.tsx` in `components/offline/` directory
   - Set up TypeScript React functional component structure
   - Import required dependencies

2. **Import status icons from Lucide React**
   - Import `Check` icon for synced state
   - Import `Loader2` icon for syncing state
   - Import `Clock` icon for pending state
   - Import `AlertTriangle` icon for error state

3. **Connect to synchronization stores**
   - Import and use `useSyncStore` hook
   - Subscribe to `syncStatus` state
   - Subscribe to `pendingCount` state
   - Subscribe to `lastError` state

4. **Define status type and states**
   - Create type for status: "synced" | "syncing" | "pending" | "error"
   - Map store state to component status
   - Handle null/undefined states appropriately

5. **Implement status determination function**
   - Check for error state first
   - Check for syncing state next
   - Check for pending operations
   - Default to synced state

6. **Render appropriate icon with styling**
   - Display icon based on current status
   - Apply status-specific colors
   - Add animation for syncing state
   - Include status text label

7. **Add click handler for details**
   - Make component clickable for more information
   - Open sync details modal or panel
   - Show last sync time and operation count
   - Display error details if present

8. **Implement status text labels**
   - "All synced" for synced state
   - "Syncing..." for syncing state
   - "X pending" for pending state
   - "Sync failed" for error state

### Sync Status States

| State | Icon | Color | Animation | Text | Condition |
|-------|------|-------|-----------|------|-----------|
| synced | Check | Green | None | "All synced" | No pending, no error |
| syncing | Loader2 | Blue | Spin | "Syncing..." | isSyncing = true |
| pending | Clock | Orange | None | "X pending" | pendingCount > 0 |
| error | AlertTriangle | Red | None | "Sync failed" | lastError exists |

### Status Priority Logic

```
┌─────────────────────────────────────┐
│          Has Error?                 │
│              │                      │
│      Yes ────┴──── No              │
│       │              │              │
│    [Error]     Is Syncing?         │
│                      │              │
│              Yes ────┴──── No      │
│               │              │      │
│          [Syncing]   Has Pending?  │
│                           │         │
│                   Yes ────┴──── No │
│                    │              │ │
│                [Pending]    [Synced]│
└─────────────────────────────────────┘
```

### Component Layout

```
┌──────────────────────────────────┐
│  ✓  All synced                   │  ← Synced state
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ⟳  Syncing...                   │  ← Syncing (animated)
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  🕐  5 pending                   │  ← Pending state
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ⚠  Sync failed                  │  ← Error state
└──────────────────────────────────┘
```

### Styling Specifications

| Element | Classes | Purpose |
|---------|---------|---------|
| Container | `flex items-center gap-2 cursor-pointer` | Layout and interaction |
| Icon Wrapper | `flex-shrink-0` | Prevent icon squishing |
| Icon (synced) | `h-4 w-4 text-green-600` | Success indicator |
| Icon (syncing) | `h-4 w-4 text-blue-600 animate-spin` | Active state |
| Icon (pending) | `h-4 w-4 text-orange-600` | Warning indicator |
| Icon (error) | `h-4 w-4 text-red-600` | Error indicator |
| Text | `text-sm font-medium` | Readable label |

### Click Handler Functionality

| Action | Details Shown |
|--------|---------------|
| Synced | Last sync timestamp, total synced items |
| Syncing | Current progress, items being synced |
| Pending | List of pending operations, total count |
| Error | Error message, retry option, timestamp |

### Animation Specifications

| State | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| synced | None | - | - |
| syncing | Spin | 1s | linear |
| pending | Pulse (subtle) | 2s | ease-in-out |
| error | None | - | - |

### Expected Outcome
- Component accurately displays current sync status
- Distinct visual representation for each state
- Smooth animations for active states
- Interactive component showing details on click
- Real-time updates as sync status changes

### Verification Checklist
- [ ] `frontend/components/offline/SyncStatus.tsx` file created
- [ ] All four status icons imported
- [ ] Component connects to sync store
- [ ] Status determination logic implemented correctly
- [ ] Each status displays correct icon and color
- [ ] Spin animation works for syncing state
- [ ] Click handler opens details view
- [ ] Status text updates appropriately
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 83: Create Pending Count

### Overview
Create the PendingCount component that displays a badge showing the number of pending synchronization operations. This component provides users with a quick visual indicator of how many operations are queued for synchronization, appearing only when there are pending items.

### Dependencies
- Task 82: Create Sync Status Icon
- Task 80: Implement Auto-Sync Logic
- Shadcn/UI Badge component
- useSyncStore hook

### Instructions

1. **Create PendingCount component file**
   - Create `PendingCount.tsx` in `components/offline/` directory
   - Set up TypeScript React functional component structure
   - Import required dependencies

2. **Import Shadcn Badge component**
   - Import Badge component from `@/components/ui/badge`
   - Familiarize with Badge variants (default, secondary, destructive)
   - Plan to use appropriate variant for pending count

3. **Connect to sync store**
   - Import `useSyncStore` hook
   - Subscribe to `pendingCount` state
   - Ensure component re-renders when count changes

4. **Implement conditional rendering**
   - Only render component when `pendingCount > 0`
   - Return null when count is 0
   - Ensure smooth appearance/disappearance

5. **Format count display**
   - Show actual number for counts 1-99
   - Show "99+" for counts 100 or greater
   - Ensure consistent width to prevent layout shift

6. **Style the badge component**
   - Use appropriate Badge variant (secondary or outline)
   - Apply warning color (orange/yellow) for visibility
   - Add hover effect to show clickable nature

7. **Make badge interactive**
   - Add click handler to open pending operations list
   - Show modal or panel with detailed pending items
   - Allow users to view what's waiting to sync

8. **Add animation for count changes**
   - Implement subtle scale animation when count updates
   - Use Framer Motion or CSS transitions
   - Ensure animation is not distracting

9. **Implement accessibility features**
   - Add `aria-label` describing pending count
   - Announce count changes to screen readers
   - Ensure keyboard accessibility for interaction

### Count Display Logic

| Pending Count | Display | Example |
|---------------|---------|---------|
| 0 | Hidden | (component not rendered) |
| 1-99 | Actual number | "5", "42", "99" |
| 100+ | "99+" | "99+" for any count ≥ 100 |

### Conditional Rendering Flow

```
┌─────────────────────────────────────┐
│      pendingCount = 0?              │
│              │                      │
│      Yes ────┴──── No              │
│       │              │              │
│  [Return null]  pendingCount >= 100?│
│                      │              │
│              Yes ────┴──── No      │
│               │              │      │
│        [Display "99+"]  [Display actual]│
└─────────────────────────────────────┘
```

### Visual Representation

```
No Pending Items
┌────────────────────────────────────┐
│  ✓  All synced                     │  ← No badge shown
└────────────────────────────────────┘

Few Pending Items
┌────────────────────────────────────┐
│  🕐  Pending    [5]                │  ← Badge shows count
└────────────────────────────────────┘

Many Pending Items
┌────────────────────────────────────┐
│  🕐  Pending    [99+]              │  ← Badge shows 99+
└────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Badge | `bg-orange-100 text-orange-800` | Warning color theme |
| Text | `text-xs font-semibold` | Clear, bold numbers |
| Container | `inline-flex items-center` | Proper alignment |
| Hover | `hover:bg-orange-200 cursor-pointer` | Interactive feedback |

### Badge Variants

| Variant | Use Case | Color |
|---------|----------|-------|
| Secondary | Default pending | Gray |
| Warning | Custom orange | Orange |
| Destructive | Critical/many pending | Red |

### Click Handler Details

| Information Shown | Description |
|-------------------|-------------|
| Total Count | Full number without truncation |
| Operation Types | Sales, inventory, customers, etc. |
| Timestamps | When each operation was queued |
| Actions | Manual sync trigger, clear queue options |

### Animation Specifications

```
Count Change Animation
├── Scale: 1.0 → 1.2 → 1.0
├── Duration: 300ms
├── Easing: ease-out
└── Trigger: pendingCount changes
```

### Expected Outcome
- Component displays only when pending operations exist
- Count accurately reflects pending operations
- Badge is visually distinct and noticeable
- Interactive badge opens detailed pending list
- Smooth animations for count updates
- Fully accessible to screen readers and keyboard users

### Verification Checklist
- [ ] `frontend/components/offline/PendingCount.tsx` file created
- [ ] Component connects to sync store
- [ ] Conditional rendering works (hidden when count = 0)
- [ ] Count displays correctly for all ranges
- [ ] "99+" displays for counts ≥ 100
- [ ] Badge styling matches design system
- [ ] Click handler opens pending details
- [ ] Animation works for count changes
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 84: Create Sync Button

### Overview
Create the SyncButton component that provides manual synchronization control. This button allows users to trigger synchronization on-demand, displaying appropriate states (enabled, disabled, syncing) based on network connectivity and current sync status.

### Dependencies
- Task 83: Create Pending Count
- Task 80: Implement Auto-Sync Logic
- Shadcn/UI Button component
- useOfflineStore and useSyncStore hooks

### Instructions

1. **Create SyncButton component file**
   - Create `SyncButton.tsx` in `components/offline/` directory
   - Set up TypeScript React functional component structure
   - Import required dependencies

2. **Import Shadcn Button component**
   - Import Button component from `@/components/ui/button`
   - Familiarize with Button variants and sizes
   - Import Loader2 icon for syncing state

3. **Connect to offline and sync stores**
   - Import `useOfflineStore` for online status
   - Import `useSyncStore` for sync status
   - Subscribe to relevant state properties

4. **Implement button state logic**
   - Determine if button should be enabled or disabled
   - Button enabled when: online AND not syncing AND has pending
   - Button disabled when: offline OR syncing OR no pending

5. **Create click handler function**
   - Import `triggerSync` action from sync store
   - Call sync function when button clicked
   - Handle any errors from sync operation
   - Provide user feedback on success/failure

6. **Render button with appropriate text**
   - "Sync now" when enabled with pending items
   - "Syncing..." when sync in progress
   - "Offline" when not connected
   - "All synced" when no pending items

7. **Add loading indicator**
   - Show Loader2 icon during sync
   - Apply spin animation to icon
   - Position icon before text

8. **Style button based on state**
   - Use primary variant when actionable
   - Use ghost/outline variant when disabled
   - Apply appropriate colors for each state

9. **Add keyboard accessibility**
   - Ensure button is keyboard navigable
   - Add appropriate ARIA attributes
   - Handle Enter and Space key activation

### Button State Logic

| Condition | Button State | Text | Icon |
|-----------|--------------|------|------|
| Online + Pending + Not Syncing | Enabled | "Sync now" | None |
| Online + Syncing | Disabled | "Syncing..." | Loader2 (spin) |
| Offline | Disabled | "Offline" | None |
| Online + No Pending | Disabled | "All synced" | None |

### State Determination Flow

```
┌─────────────────────────────────────┐
│         Is Online?                  │
│              │                      │
│       No ────┴──── Yes             │
│       │              │              │
│  [Disabled       Is Syncing?       │
│   "Offline"]         │              │
│              Yes ────┴──── No      │
│               │              │      │
│          [Disabled      Has Pending?│
│          "Syncing..."]       │      │
│                      Yes ────┴──── No
│                       │              │
│                  [Enabled        [Disabled
│                  "Sync now"]    "All synced"]
└─────────────────────────────────────┘
```

### Visual States

```
Enabled State (Ready to Sync)
┌────────────────────────────────────┐
│         [Sync now] ←─ Blue         │
└────────────────────────────────────┘

Syncing State (Active)
┌────────────────────────────────────┐
│    ⟳   [Syncing...] ←─ Disabled   │
└────────────────────────────────────┘

Offline State (No Connection)
┌────────────────────────────────────┐
│       [Offline] ←─ Disabled Gray   │
└────────────────────────────────────┘

All Synced State (No Pending)
┌────────────────────────────────────┐
│     [All synced] ←─ Disabled Green │
└────────────────────────────────────┘
```

### Styling Specifications

| State | Variant | Classes | Icon |
|-------|---------|---------|------|
| Enabled | `default` | `bg-blue-600 hover:bg-blue-700` | None |
| Syncing | `ghost` | `cursor-not-allowed` | Loader2 |
| Offline | `outline` | `text-gray-500` | None |
| Synced | `ghost` | `text-green-600` | None |

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `"default" \| "sm" \| "lg"` | `"default"` | Button size |
| className | `string` | `""` | Additional classes |
| variant | `ButtonVariant` | Auto | Override variant |

### Click Handler Implementation

```
1. Check if sync is allowed
   ├── If offline → Show error toast
   ├── If syncing → Do nothing
   └── If no pending → Do nothing

2. Trigger sync operation
   ├── Call triggerSync() from store
   └── Handle promise result

3. Provide feedback
   ├── Success → Toast "Sync complete"
   └── Error → Toast with error message
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | Clear action text |
| Disabled State | `aria-disabled` when inactive |
| Loading State | `aria-busy` during sync |
| Screen Reader | Announce state changes |

### Expected Outcome
- Functional button for manual synchronization
- Appropriate enabled/disabled states based on conditions
- Clear visual feedback during sync operation
- Loading indicator with animation
- Proper error handling and user feedback
- Fully keyboard accessible

### Verification Checklist
- [ ] `frontend/components/offline/SyncButton.tsx` file created
- [ ] Component connects to offline and sync stores
- [ ] Button state logic implemented correctly
- [ ] All four states (enabled, syncing, offline, synced) work
- [ ] Click handler triggers sync operation
- [ ] Loading indicator shows during sync
- [ ] Button text updates appropriately
- [ ] Disabled states prevent clicking
- [ ] Toast notifications show success/error
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 85: Create Sync Progress Modal

### Overview
Create the SyncProgressModal component that displays detailed synchronization progress during manual or automatic sync operations. This modal shows a progress bar, current item being synced, total count, and allows users to cancel the sync operation if needed.

### Dependencies
- Task 84: Create Sync Button
- Shadcn/UI Dialog component
- Shadcn/UI Progress component
- useSyncStore hook

### Instructions

1. **Create SyncProgressModal component file**
   - Create `SyncProgressModal.tsx` in `components/offline/` directory
   - Set up TypeScript React functional component structure
   - Import required dependencies

2. **Import Shadcn UI components**
   - Import Dialog components (Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter)
   - Import Progress component for progress bar
   - Import Button component for cancel action
   - Import necessary icons (Loader2, X)

3. **Connect to sync store**
   - Import `useSyncStore` hook
   - Subscribe to `isSyncing` state for modal visibility
   - Subscribe to `syncProgress` state for progress percentage
   - Subscribe to `currentSyncItem` state for current item info
   - Subscribe to `totalItems` and `syncedItems` for count display

4. **Implement modal visibility control**
   - Modal opens when `isSyncing` is true
   - Modal closes when sync completes
   - Handle manual close with cancel action
   - Prevent closing by clicking outside during sync

5. **Create progress bar component**
   - Use Shadcn Progress component
   - Bind to `syncProgress` value (0-100)
   - Display percentage text above or on bar
   - Ensure smooth animation for progress updates

6. **Display current sync information**
   - Show current item type (e.g., "Sale", "Inventory Update")
   - Show current item ID or identifier
   - Display "Syncing X of Y items" counter
   - Update in real-time as sync progresses

7. **Implement cancel sync functionality**
   - Add "Cancel" button in modal footer
   - Import `cancelSync` action from sync store
   - Confirm cancellation with user
   - Handle graceful sync interruption

8. **Add estimated time remaining (optional)**
   - Calculate based on current progress and elapsed time
   - Display estimated seconds/minutes remaining
   - Update calculation dynamically

9. **Style modal for clarity**
   - Use clear heading "Syncing Data"
   - Proper spacing between elements
   - Emphasize progress bar visually
   - Ensure readable text on all backgrounds

10. **Handle sync completion**
    - Show completion state briefly before closing
    - Display success message
    - Auto-close after 1-2 seconds
    - Allow manual close of success state

### Modal Structure

```
┌─────────────────────────────────────────┐
│  Syncing Data                      [X]  │
├─────────────────────────────────────────┤
│                                         │
│  ⟳  Syncing sale transaction #1234     │
│                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  65%         │
│                                         │
│  Syncing 13 of 20 items                │
│                                         │
│  Estimated time: 15 seconds            │
│                                         │
├─────────────────────────────────────────┤
│                           [Cancel Sync] │
└─────────────────────────────────────────┘
```

### Progress Information Display

| Element | Content | Example |
|---------|---------|---------|
| Current Item | Type + ID | "Sale transaction #1234" |
| Progress Bar | Visual percentage | 65% filled |
| Progress Text | Numerical percentage | "65%" |
| Count | Items synced/total | "13 of 20 items" |
| ETA | Time remaining | "15 seconds" |

### Sync Progress Store State

| Property | Type | Description |
|----------|------|-------------|
| isSyncing | boolean | Whether sync is active |
| syncProgress | number | Percentage complete (0-100) |
| currentSyncItem | object | Current item being synced |
| syncedItems | number | Items synced so far |
| totalItems | number | Total items to sync |

### Progress Bar Styling

| State | Color | Animation |
|-------|-------|-----------|
| 0-33% | Red | Smooth fill |
| 34-66% | Yellow | Smooth fill |
| 67-99% | Blue | Smooth fill |
| 100% | Green | Smooth fill |

### Cancel Confirmation Dialog

```
┌─────────────────────────────────────────┐
│  Cancel Sync?                           │
├─────────────────────────────────────────┤
│                                         │
│  Are you sure you want to cancel the   │
│  sync operation? Unsaved changes will  │
│  remain in the queue.                  │
│                                         │
├─────────────────────────────────────────┤
│           [Go Back]    [Cancel Sync]   │
└─────────────────────────────────────────┘
```

### Modal Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| open | boolean | Yes | Control modal visibility |
| onOpenChange | function | Yes | Handle modal state changes |

### Completion State

```
┌─────────────────────────────────────────┐
│  Sync Complete!                    [✓]  │
├─────────────────────────────────────────┤
│                                         │
│  Successfully synced 20 items          │
│                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%        │
│                                         │
│  All changes have been saved to the    │
│  server.                               │
│                                         │
└─────────────────────────────────────────┘
Auto-closes in 2 seconds
```

### Expected Outcome
- Modal displays during sync operations
- Real-time progress updates with visual bar
- Current item and count information shown
- Cancel functionality works correctly
- Completion state displays before closing
- Clear, professional UI design

### Verification Checklist
- [ ] `frontend/components/offline/SyncProgressModal.tsx` file created
- [ ] Dialog component integrated
- [ ] Progress bar displays correctly
- [ ] Progress percentage updates in real-time
- [ ] Current item information shows
- [ ] Item count displays (X of Y)
- [ ] Cancel button works correctly
- [ ] Cancel confirmation implemented
- [ ] Completion state shows briefly
- [ ] Modal auto-closes after completion
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 86: Create Conflict Modal

### Overview
Create the ConflictModal component that displays when synchronization conflicts are detected between local changes and server data. This modal presents both versions of the conflicting data and allows users to choose how to resolve the conflict (keep local, use server, or merge).

### Dependencies
- Task 85: Create Sync Progress Modal
- Task 77: Implement Conflict Detection (Group E)
- Shadcn/UI Dialog component
- Shadcn/UI Card component
- useConflictStore hook

### Instructions

1. **Create ConflictModal component file**
   - Create `ConflictModal.tsx` in `components/offline/` directory
   - Set up TypeScript React functional component structure
   - Import required dependencies

2. **Import Shadcn UI components**
   - Import Dialog components for modal structure
   - Import Card components for data display
   - Import Button components for resolution actions
   - Import Badge component for field highlighting

3. **Connect to conflict store**
   - Import `useConflictStore` hook
   - Subscribe to `currentConflict` state
   - Subscribe to `hasConflicts` state for modal visibility
   - Import resolution actions (resolveKeepLocal, resolveUseServer, resolveMerge)

4. **Implement modal visibility control**
   - Modal opens when `hasConflicts` is true
   - Show first conflict from queue
   - Prevent closing without resolution
   - Handle queue progression after resolution

5. **Display conflict information**
   - Show conflict type (Sale, Inventory, Customer, etc.)
   - Display record identifier (ID, name, etc.)
   - Show timestamp of local change
   - Show timestamp of server change
   - Indicate which fields are conflicting

6. **Create side-by-side comparison layout**
   - Left card: Local version
   - Right card: Server version
   - Highlight differing fields
   - Use color coding for clarity

7. **Implement field-level diff display**
   - Show each field that differs
   - Display old value and new value
   - Use strikethrough for removed/replaced values
   - Use bold or highlight for new values

8. **Add resolution action buttons**
   - "Keep Local Changes" button
   - "Use Server Version" button
   - "Merge Changes" button (if applicable)
   - Explain what each action does

9. **Implement merge interface (if applicable)**
   - Allow field-by-field selection
   - Checkboxes or radio buttons for each field
   - Preview merged result
   - Validate merged data before applying

10. **Handle resolution execution**
    - Call appropriate resolution action from store
    - Show confirmation toast
    - Move to next conflict if queue has more
    - Close modal when all conflicts resolved

11. **Add conflict context information**
    - Show related data for decision-making
    - Display who made the server change (if available)
    - Show any dependencies or related records

### Conflict Modal Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Conflict Detected: Sale Transaction                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Transaction #1234 has conflicting changes                  │
│  Last modified: 10 minutes ago (local) | 5 minutes ago (server) │
│                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐       │
│  │  Your Local Changes │    │  Server Version     │       │
│  ├─────────────────────┤    ├─────────────────────┤       │
│  │                     │    │                     │       │
│  │ Total: $150.00     │    │ Total: $175.00     │       │
│  │ Discount: 10%      │    │ Discount: 15%      │       │
│  │ Tax: $13.50        │    │ Tax: $14.88        │       │
│  │ Items: 3           │    │ Items: 3           │       │
│  │                     │    │                     │       │
│  └─────────────────────┘    └─────────────────────┘       │
│                                                              │
│  Conflicting Fields:                                        │
│  • Total amount differs                                     │
│  • Discount percentage differs                              │
│  • Tax amount differs                                       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  [Keep Local]  [Use Server]  [Merge Changes]  [Skip →]    │
└──────────────────────────────────────────────────────────────┘
```

### Conflict Data Structure

| Property | Type | Description |
|----------|------|-------------|
| id | string | Conflict identifier |
| type | string | Entity type (Sale, Inventory, etc.) |
| recordId | string | Record identifier |
| localData | object | Local version data |
| serverData | object | Server version data |
| conflictingFields | string[] | List of differing fields |
| localTimestamp | Date | When local change made |
| serverTimestamp | Date | When server change made |

### Side-by-Side Comparison

```
┌─────────────────────────────────┬─────────────────────────────────┐
│     Your Changes (Local)        │     Server Changes              │
├─────────────────────────────────┼─────────────────────────────────┤
│                                 │                                 │
│  Customer: John Doe             │  Customer: John Doe             │
│  Total: $150.00 ← Different    │  Total: $175.00 ← Different    │
│  Payment: Cash                  │  Payment: Card ← Different     │
│  Status: Completed              │  Status: Completed              │
│  Modified: 2:30 PM              │  Modified: 2:35 PM              │
│                                 │                                 │
└─────────────────────────────────┴─────────────────────────────────┘
```

### Resolution Actions

| Action | Description | Behavior |
|--------|-------------|----------|
| Keep Local | Use your local changes | Overwrites server data |
| Use Server | Accept server version | Discards local changes |
| Merge Changes | Combine both versions | Select fields from each |
| Skip | Resolve later | Moves to next conflict |

### Merge Interface

```
┌──────────────────────────────────────────────────────────────┐
│  Merge Conflicting Changes                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Select which version to use for each field:                │
│                                                              │
│  ○ Local   ● Server    Total Amount                         │
│     $150.00   $175.00                                       │
│                                                              │
│  ● Local   ○ Server    Payment Method                       │
│     Cash      Card                                          │
│                                                              │
│  ○ Local   ● Server    Discount                             │
│     10%       15%                                           │
│                                                              │
│  ┌────────────────────────────────────┐                    │
│  │ Merged Result Preview:              │                    │
│  │ Total: $175.00                      │                    │
│  │ Payment: Cash                       │                    │
│  │ Discount: 15%                       │                    │
│  └────────────────────────────────────┘                    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                       [Cancel]  [Apply Merge]               │
└──────────────────────────────────────────────────────────────┘
```

### Field Highlighting

| State | Color | Indicator |
|-------|-------|-----------|
| Same | Gray | Normal text |
| Different | Yellow background | Bold + highlight |
| Selected (merge) | Blue background | Checkmark |
| Conflicting | Red border | Exclamation icon |

### Queue Progress Indicator

```
Conflict 2 of 5
[▓▓▓▓░░░░░░] 40%
```

### Expected Outcome
- Modal displays when conflicts detected
- Clear side-by-side comparison of data versions
- Conflicting fields are highlighted
- All resolution options available and functional
- Merge interface allows granular field selection
- Queue processes multiple conflicts in sequence
- Resolution actions correctly update data

### Verification Checklist
- [ ] `frontend/components/offline/ConflictModal.tsx` file created
- [ ] Component connects to conflict store
- [ ] Modal opens when conflicts exist
- [ ] Side-by-side comparison displays correctly
- [ ] Conflicting fields are highlighted
- [ ] All three resolution buttons work (Local, Server, Merge)
- [ ] Merge interface functional (if implemented)
- [ ] Field-level selection works in merge mode
- [ ] Resolution updates store correctly
- [ ] Queue progresses to next conflict
- [ ] Modal closes when all conflicts resolved
- [ ] Confirmation toasts display
- [ ] Component exports properly

---

## Task 87: Create Error Toast

### Overview
Create error toast notifications using Sonner library to display synchronization errors and other offline-related error messages to users. These toasts provide clear, actionable error information with optional retry functionality.

### Dependencies
- Task 86: Create Conflict Modal
- Sonner toast library installed
- useSyncStore and error handling hooks

### Instructions

1. **Install Sonner if not already installed**
   - Run `npm install sonner` or `pnpm add sonner`
   - Verify Sonner is added to package.json
   - Check if Toaster component is set up in app layout

2. **Set up Toaster component in layout**
   - Import Toaster from `sonner`
   - Add `<Toaster />` component to root layout
   - Configure Toaster position (top-right, bottom-right, etc.)
   - Set toast duration and other options

3. **Create error toast utility function**
   - Create `toast-utils.ts` in `lib/` or `utils/` directory
   - Import `toast` from `sonner`
   - Create `showSyncError` function wrapper
   - Add default error handling configuration

4. **Define error toast parameters**
   - Error title (brief description)
   - Error description (detailed message)
   - Retry action callback (optional)
   - Dismiss action
   - Error type/severity

5. **Implement showSyncError function**
   - Accept error object or message string
   - Format error for user-friendly display
   - Add retry button if action provided
   - Set appropriate duration (longer for errors)

6. **Connect to sync store error events**
   - Subscribe to sync errors in sync store
   - Automatically show toast when error occurs
   - Include relevant error context
   - Handle different error types appropriately

7. **Create error categorization**
   - Network errors (connection failed)
   - Server errors (500, 503, etc.)
   - Validation errors (invalid data)
   - Authentication errors (token expired)
   - Conflict errors (already handled by modal)

8. **Add retry functionality**
   - Include retry button in toast
   - Call provided retry callback on click
   - Show loading state during retry
   - Display success or new error after retry

9. **Implement error logging**
   - Log errors to console for debugging
   - Send errors to monitoring service (optional)
   - Include error context and timestamp
   - Respect user privacy in logging

10. **Test toast behavior**
    - Test with various error types
    - Verify toast stacking behavior
    - Test retry functionality
    - Ensure toasts are dismissible

### Toast Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Position | `top-right` | Consistent location |
| Duration | `6000ms` (6s) | Time to read error |
| Theme | System or light | Match app theme |
| Rich Colors | `true` | Visual severity indicators |
| Close Button | `true` | Manual dismissal |

### Error Toast Structure

```
┌────────────────────────────────────────┐
│  ⚠  Sync Failed                    [×] │
├────────────────────────────────────────┤
│  Could not connect to the server.      │
│  Your changes are saved locally.       │
│                                        │
│  [Retry]                               │
└────────────────────────────────────────┘
```

### Error Types and Messages

| Error Type | Title | Description | Action |
|------------|-------|-------------|--------|
| Network | "Sync Failed" | "Could not connect to server" | Retry |
| Server Error | "Server Error" | "Server returned error: [code]" | Retry |
| Validation | "Invalid Data" | "Data validation failed: [reason]" | None |
| Auth | "Authentication Failed" | "Please log in again" | Login |
| Conflict | "Conflict Detected" | "Changes conflict with server" | Resolve |

### Toast Utility Functions

```
showSyncError(error, options)
├── Parameters:
│   ├── error: Error object or string
│   └── options: { retry?, onDismiss? }
│
├── Implementation:
│   ├── Parse error message
│   ├── Determine error type
│   ├── Format user-friendly message
│   └── Display toast with actions
│
└── Return: Toast ID for dismissal
```

### Error Toast Examples

```
Network Error Toast
┌────────────────────────────────────────┐
│  ⚠  Connection Failed              [×] │
├────────────────────────────────────────┤
│  Unable to reach the server. Check     │
│  your internet connection.             │
│                                        │
│  [Retry Now]                           │
└────────────────────────────────────────┘

Server Error Toast
┌────────────────────────────────────────┐
│  ⚠  Sync Error                     [×] │
├────────────────────────────────────────┤
│  Server error (500): Internal server   │
│  error. Please try again later.        │
│                                        │
│  [Retry]                               │
└────────────────────────────────────────┘

Validation Error Toast
┌────────────────────────────────────────┐
│  ⚠  Invalid Data                   [×] │
├────────────────────────────────────────┤
│  Sale total cannot be negative.        │
│  Please check the transaction.         │
│                                        │
└────────────────────────────────────────┘
```

### Retry Implementation

```
Retry Flow
├── 1. User clicks Retry button
├── 2. Update toast to show "Retrying..."
├── 3. Execute retry callback
├── 4. Handle result:
│   ├── Success → Show success toast
│   └── Failure → Show new error toast
└── 5. Dismiss loading toast
```

### Success Toast (After Retry)

```
┌────────────────────────────────────────┐
│  ✓  Sync Successful                [×] │
├────────────────────────────────────────┤
│  All changes have been synced to       │
│  the server.                           │
└────────────────────────────────────────┘
```

### Error Logging Format

| Field | Value | Example |
|-------|-------|---------|
| Timestamp | ISO string | "2026-01-31T10:30:00Z" |
| Error Type | String | "NetworkError" |
| Message | String | "Failed to sync" |
| Stack | String | Error stack trace |
| Context | Object | { userId, itemId, etc. } |

### Expected Outcome
- Sonner library properly configured
- Error toasts display for sync failures
- Clear, user-friendly error messages
- Retry functionality works correctly
- Toasts are dismissible
- Multiple toasts stack appropriately
- Error logging captures relevant information

### Verification Checklist
- [ ] Sonner installed and configured
- [ ] Toaster component added to layout
- [ ] `toast-utils.ts` utility file created
- [ ] `showSyncError` function implemented
- [ ] Error categorization logic complete
- [ ] Retry button functional
- [ ] Success toast shows after successful retry
- [ ] Error logging implemented
- [ ] Multiple toasts stack correctly
- [ ] Toasts are keyboard accessible
- [ ] Component exports properly

---

## Task 88: Create Offline Banner

### Overview
Create the OfflineBanner component that displays a prominent notification banner at the top of the screen when the application is offline. This banner alerts users to their offline status and reassures them that functionality remains available.

### Dependencies
- Task 87: Create Error Toast
- Shadcn/UI Alert component
- useOfflineStore hook
- Lucide React icons

### Instructions

1. **Create OfflineBanner component file**
   - Create `OfflineBanner.tsx` in `components/offline/` directory
   - Set up TypeScript React functional component structure
   - Import required dependencies

2. **Import Shadcn Alert component**
   - Import Alert from `@/components/ui/alert`
   - Import AlertDescription if needed
   - Familiarize with Alert variants (default, destructive, warning)

3. **Import required icons**
   - Import `WifiOff` icon for offline indicator
   - Import `Info` or `AlertCircle` icon for information
   - Import `X` icon for dismiss button (optional)

4. **Connect to offline store**
   - Import `useOfflineStore` hook
   - Subscribe to `isOnline` state
   - Re-render when connectivity status changes

5. **Implement conditional rendering**
   - Only show banner when `isOnline` is false
   - Return null when online
   - Consider smooth slide-in animation

6. **Design banner layout**
   - Position at top of screen (fixed or sticky)
   - Full width with container constraints
   - Icon on left, message in center, dismiss on right (optional)

7. **Create banner content**
   - Primary message: "You are currently offline"
   - Secondary message: "Don't worry, you can continue working. Changes will sync when connection is restored."
   - Keep message reassuring and informative

8. **Apply appropriate styling**
   - Use warning color scheme (yellow/orange)
   - Ensure sufficient contrast for accessibility
   - Make banner prominent but not alarming
   - Use appropriate spacing and padding

9. **Add dismiss functionality (optional)**
   - Allow users to dismiss banner
   - Store dismissed state in localStorage
   - Re-show on next offline occurrence
   - Include small dismiss button

10. **Implement animation**
    - Slide down animation on appear
    - Slide up animation on dismiss
    - Use Framer Motion or CSS transitions
    - Ensure smooth, non-jarring animation

11. **Add pending operations indicator**
    - Show count of pending syncs in banner
    - Update dynamically as operations are queued
    - Link to pending operations list

### Banner Structure

```
┌──────────────────────────────────────────────────────────────┐
│  📡  You are offline                                     [×] │
│     Your work is saved locally and will sync when connected  │
│     5 items pending                                          │
└──────────────────────────────────────────────────────────────┘
```

### Banner Variants

| Variant | Color | Use Case |
|---------|-------|----------|
| Warning | Yellow/Orange | Standard offline |
| Info | Blue | Informational only |
| Destructive | Red | Critical offline issue |

### Visual Design

```
Expanded Banner View
┌─────────────────────────────────────────────────────────────┐
│ ⚠ │ You are currently offline                          [×] │
│   │ Don't worry! You can continue working. All changes     │
│   │ will be saved and synced when connection is restored.  │
│   │ • 5 pending operations                                 │
└─────────────────────────────────────────────────────────────┘

Compact Banner View
┌─────────────────────────────────────────────────────────────┐
│ 📡 Offline mode • 5 pending                            [×] │
└─────────────────────────────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `fixed top-0 left-0 right-0 z-50` | Top positioning |
| Alert | `bg-yellow-50 border-yellow-200` | Warning theme |
| Icon | `text-yellow-600 h-5 w-5` | Visual indicator |
| Text | `text-yellow-900` | Readable text |
| Dismiss | `text-yellow-600 hover:text-yellow-800` | Interactive element |

### Banner Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| dismissible | boolean | No | false | Allow dismissing banner |
| showPending | boolean | No | true | Show pending count |
| compact | boolean | No | false | Use compact layout |
| className | string | No | "" | Additional classes |

### Animation Specifications

```
Slide-In Animation
├── Initial: translateY(-100%)
├── Final: translateY(0)
├── Duration: 300ms
├── Easing: ease-out
└── Delay: 0ms

Slide-Out Animation
├── Initial: translateY(0)
├── Final: translateY(-100%)
├── Duration: 200ms
├── Easing: ease-in
└── Delay: 0ms
```

### Pending Operations Display

| Count | Display Text |
|-------|--------------|
| 0 | "No pending operations" |
| 1 | "1 item pending" |
| 2-99 | "X items pending" |
| 100+ | "99+ items pending" |

### Dismiss Functionality

```
Dismiss Flow
├── 1. User clicks dismiss button
├── 2. Store dismissed state in localStorage
│      └── Key: "offline-banner-dismissed"
│      └── Value: timestamp
├── 3. Fade out banner
├── 4. Remove from DOM
└── 5. Reset on next offline occurrence
```

### Responsive Behavior

```
Mobile (< 640px)
├── Compact layout
├── Icon + text only
└── Smaller padding

Tablet/Desktop (≥ 640px)
├── Full layout
├── Icon + extended message
└── Normal padding
```

### Expected Outcome
- Banner displays prominently when offline
- Clear, reassuring message to users
- Shows pending operations count
- Dismissible if configured
- Smooth animations for appearance/dismissal
- Responsive across device sizes
- Does not obstruct critical UI

### Verification Checklist
- [ ] `frontend/components/offline/OfflineBanner.tsx` file created
- [ ] Component connects to offline store
- [ ] Banner only shows when offline
- [ ] Offline icon displays correctly
- [ ] Message text is clear and reassuring
- [ ] Pending count displays (if enabled)
- [ ] Warning color scheme applied
- [ ] Dismiss button works (if enabled)
- [ ] Animation smooth on show/hide
- [ ] Banner positions at top of screen
- [ ] Responsive on mobile and desktop
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 89: Create Storage Stats

### Overview
Create the StorageStats component that displays IndexedDB storage usage statistics for offline data. This component shows how much storage is being used, total available storage, and provides visual indicators when storage is running low.

### Dependencies
- Task 88: Create Offline Banner
- Task 72: Implement IndexedDB Storage (Group D)
- Shadcn/UI Progress component
- Shadcn/UI Card component

### Instructions

1. **Create StorageStats component file**
   - Create `StorageStats.tsx` in `components/offline/` directory
   - Set up TypeScript React functional component structure
   - Import required dependencies

2. **Import Shadcn UI components**
   - Import Card components (Card, CardHeader, CardTitle, CardContent)
   - Import Progress component for storage bar
   - Import Badge component for warnings

3. **Create storage calculation hook**
   - Create `useStorageStats` custom hook
   - Use Navigator.storage.estimate() API
   - Calculate used and total storage
   - Calculate percentage used
   - Update periodically or on demand

4. **Implement storage estimation logic**
   - Call `navigator.storage.estimate()`
   - Extract `usage` and `quota` values
   - Convert bytes to human-readable format (MB, GB)
   - Calculate percentage: (usage / quota) × 100

5. **Format storage values**
   - Create utility function to format bytes
   - Convert to appropriate units (KB, MB, GB)
   - Round to 2 decimal places
   - Handle edge cases (0 bytes, undefined)

6. **Render storage statistics**
   - Display used storage (e.g., "45 MB")
   - Display total storage (e.g., "500 MB")
   - Show percentage used (e.g., "9%")
   - Include visual progress bar

7. **Implement storage threshold warnings**
   - Low threshold: 80% used (yellow warning)
   - Critical threshold: 90% used (red warning)
   - Show warning badge when thresholds exceeded
   - Provide guidance on clearing data

8. **Add breakdown by entity type (optional)**
   - Show storage per entity (Sales, Inventory, etc.)
   - Calculate size of each IndexedDB store
   - Display as list or chart
   - Help users identify space-heavy data

9. **Implement refresh functionality**
   - Add refresh button to recalculate stats
   - Update stats automatically every 30 seconds
   - Show loading state during calculation
   - Cache results to avoid excessive calculations

10. **Add clear data action (optional)**
    - Provide button to clear cached data
    - Confirm action with user
    - Only clear synced data, preserve pending
    - Update stats after clearing

### Storage Stats Display

```
┌─────────────────────────────────────────┐
│  Storage Usage                          │
├─────────────────────────────────────────┤
│                                         │
│  45 MB of 500 MB used (9%)             │
│                                         │
│  ▓▓░░░░░░░░░░░░░░░░░░░░  9%           │
│                                         │
│  Details:                               │
│  • Sales: 20 MB                         │
│  • Inventory: 15 MB                     │
│  • Customers: 10 MB                     │
│                                         │
│  [↻ Refresh]  [Clear Cache]            │
│                                         │
└─────────────────────────────────────────┘
```

### Storage Calculation

| Property | Source | Format |
|----------|--------|--------|
| Used | navigator.storage.estimate().usage | "45 MB" |
| Total | navigator.storage.estimate().quota | "500 MB" |
| Percentage | (used / total) × 100 | "9%" |

### Storage Thresholds

| Level | Threshold | Color | Action |
|-------|-----------|-------|--------|
| Normal | < 80% | Green | None |
| Warning | 80-89% | Yellow | Show warning badge |
| Critical | ≥ 90% | Red | Show warning + clear option |

### Warning Messages

| Level | Message | Icon |
|-------|---------|------|
| Warning | "Storage space running low" | ⚠️ |
| Critical | "Storage space critically low. Clear cache to free space." | 🔴 |

### Byte Formatting Function

```
formatBytes(bytes, decimals = 2)
├── If bytes === 0 → return "0 Bytes"
├── Define units: ['Bytes', 'KB', 'MB', 'GB', 'TB']
├── Calculate unit index: Math.floor(Math.log(bytes) / Math.log(1024))
├── Calculate value: bytes / (1024 ^ index)
├── Round to decimals
└── Return: value + ' ' + unit
```

### Progress Bar Styling

| Usage Level | Progress Color | Background Color |
|-------------|----------------|------------------|
| 0-79% | Green | Light green |
| 80-89% | Yellow | Light yellow |
| 90-100% | Red | Light red |

### Entity Breakdown Structure

```
Storage Breakdown
├── Sales: 20 MB (44%)
│   └── Progress bar
├── Inventory: 15 MB (33%)
│   └── Progress bar
├── Customers: 10 MB (22%)
│   └── Progress bar
└── Total: 45 MB
```

### useStorageStats Hook

```
useStorageStats()
├── Returns:
│   ├── used: number (bytes)
│   ├── quota: number (bytes)
│   ├── percentage: number (0-100)
│   ├── usedFormatted: string ("45 MB")
│   ├── quotaFormatted: string ("500 MB")
│   ├── isLoading: boolean
│   ├── error: Error | null
│   └── refresh: () => void
│
└── Updates: Every 30 seconds or on refresh()
```

### Clear Cache Confirmation

```
┌─────────────────────────────────────────┐
│  Clear Cached Data?                     │
├─────────────────────────────────────────┤
│                                         │
│  This will clear all synced offline     │
│  data. Pending operations will be       │
│  preserved.                             │
│                                         │
│  This will free approximately 30 MB.    │
│                                         │
├─────────────────────────────────────────┤
│           [Cancel]  [Clear Cache]      │
└─────────────────────────────────────────┘
```

### Expected Outcome
- Component displays accurate storage statistics
- Used and total storage shown in readable format
- Progress bar visually represents usage
- Warnings display at appropriate thresholds
- Entity breakdown shows detailed usage (optional)
- Refresh functionality updates stats
- Clear cache option available (optional)
- Responsive and accessible design

### Verification Checklist
- [ ] `frontend/components/offline/StorageStats.tsx` file created
- [ ] `useStorageStats` hook implemented
- [ ] navigator.storage.estimate() API used
- [ ] Byte formatting function works correctly
- [ ] Used and total storage display
- [ ] Percentage calculation accurate
- [ ] Progress bar renders correctly
- [ ] Progress bar color changes at thresholds
- [ ] Warning badges show at 80% and 90%
- [ ] Entity breakdown displays (if implemented)
- [ ] Refresh button updates stats
- [ ] Clear cache functionality works (if implemented)
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 90: Create Prefetch Button

### Overview
Create the PrefetchButton component that allows users to manually trigger prefetching of data for offline use. This button provides control over what data is cached locally, enabling users to prepare for offline work sessions.

### Dependencies
- Task 89: Create Storage Stats
- Task 74: Implement Data Prefetching (Group D)
- Shadcn/UI Button component
- usePrefetchStore hook

### Instructions

1. **Create PrefetchButton component file**
   - Create `PrefetchButton.tsx` in `components/offline/` directory
   - Set up TypeScript React functional component structure
   - Import required dependencies

2. **Import Shadcn Button component**
   - Import Button from `@/components/ui/button`
   - Import relevant icons (Download, Loader2, Check)
   - Prepare for different button states

3. **Connect to prefetch store**
   - Import `usePrefetchStore` hook (or create if needed)
   - Subscribe to `isPrefetching` state
   - Subscribe to `lastPrefetchTime` state
   - Import `triggerPrefetch` action

4. **Implement button state logic**
   - Enabled: online and not currently prefetching
   - Disabled: offline or currently prefetching
   - Success: recently completed prefetch
   - Determine appropriate button text for each state

5. **Create click handler function**
   - Call `triggerPrefetch` action from store
   - Handle loading state during prefetch
   - Show success message on completion
   - Handle and display errors

6. **Render button with appropriate state**
   - "Prefetch Data" when idle
   - "Prefetching..." with spinner when active
   - "Prefetched" with checkmark after completion
   - "Offline" when not connected

7. **Add prefetch configuration options (optional)**
   - Create dropdown or modal for prefetch options
   - Allow selecting entity types to prefetch
   - Set date range for data to prefetch
   - Configure prefetch depth (related records)

8. **Implement progress feedback**
   - Show toast notification on start
   - Display progress if possible
   - Show success toast on completion
   - Display error toast on failure

9. **Add last prefetch time display**
   - Show when data was last prefetched
   - Format as relative time ("2 hours ago")
   - Update dynamically
   - Include in tooltip

10. **Implement automatic prefetch scheduling**
    - Add checkbox to enable scheduled prefetch
    - Configure prefetch frequency (daily, weekly)
    - Store preference in settings
    - Trigger automatically based on schedule

### Button States

| State | Text | Icon | Enabled | Color |
|-------|------|------|---------|-------|
| Idle | "Prefetch Data" | Download | Yes | Primary blue |
| Prefetching | "Prefetching..." | Loader2 (spin) | No | Gray |
| Success | "Prefetched" | Check | No | Green |
| Offline | "Offline" | - | No | Gray |
| Error | "Prefetch Failed" | X | Yes | Red |

### State Determination Flow

```
┌─────────────────────────────────────┐
│         Is Online?                  │
│              │                      │
│       No ────┴──── Yes             │
│       │              │              │
│  [Offline        Is Prefetching?   │
│   State]             │              │
│              Yes ────┴──── No      │
│               │              │      │
│          [Prefetching  Recent Success?
│           State]           │        │
│                    Yes ────┴──── No│
│                     │              ││
│                [Success       [Idle]│
│                 State]              │
└─────────────────────────────────────┘
```

### Button Visual States

```
Idle State
┌────────────────────────────────────┐
│     ⬇  [Prefetch Data]            │
└────────────────────────────────────┘

Prefetching State
┌────────────────────────────────────┐
│     ⟳  [Prefetching...]           │
└────────────────────────────────────┘

Success State
┌────────────────────────────────────┐
│     ✓  [Prefetched]               │
└────────────────────────────────────┘

Offline State
┌────────────────────────────────────┐
│        [Offline]                   │ (disabled)
└────────────────────────────────────┘
```

### Prefetch Options Modal

```
┌──────────────────────────────────────────┐
│  Prefetch Options                        │
├──────────────────────────────────────────┤
│                                          │
│  Select data to prefetch:                │
│                                          │
│  ☑ Sales (last 7 days)                  │
│  ☑ Inventory (all items)                │
│  ☑ Customers (active only)              │
│  ☐ Reports (last 30 days)               │
│                                          │
│  Date Range:                             │
│  [Last 7 days ▼]                        │
│                                          │
│  ☑ Include related records              │
│                                          │
├──────────────────────────────────────────┤
│         [Cancel]  [Start Prefetch]      │
└──────────────────────────────────────────┘
```

### Click Handler Implementation

```
handlePrefetchClick()
├── 1. Check if online
│   └── If offline → Show error toast
│
├── 2. Check if already prefetching
│   └── If yes → Do nothing
│
├── 3. Show confirmation (optional)
│   └── Warn about data usage
│
├── 4. Trigger prefetch
│   ├── Call triggerPrefetch()
│   └── Update button state
│
├── 5. Handle result
│   ├── Success → Show success toast
│   └── Error → Show error toast
│
└── 6. Update last prefetch time
```

### Toast Notifications

| Event | Toast Type | Message |
|-------|------------|---------|
| Start | Info | "Starting data prefetch..." |
| Progress | Info | "Prefetching: 50 of 100 items" |
| Success | Success | "Prefetch complete! Data ready for offline use." |
| Error | Error | "Prefetch failed: [error message]" |

### Last Prefetch Display

```
┌────────────────────────────────────┐
│  ⬇  Prefetch Data                 │
│                                    │
│  Last prefetched: 2 hours ago     │
└────────────────────────────────────┘
```

### Automatic Prefetch Settings

```
┌──────────────────────────────────────────┐
│  Prefetch Settings                       │
├──────────────────────────────────────────┤
│                                          │
│  ☑ Enable automatic prefetch            │
│                                          │
│  Frequency:                              │
│  ○ Daily (8:00 AM)                      │
│  ● Weekly (Monday 8:00 AM)              │
│  ○ Custom                               │
│                                          │
│  Only prefetch on:                      │
│  ☑ WiFi connection                      │
│  ☐ Mobile data                          │
│                                          │
├──────────────────────────────────────────┤
│                    [Save]               │
└──────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| showLastPrefetch | boolean | No | true | Display last prefetch time |
| showOptions | boolean | No | false | Show options before prefetch |
| size | string | No | "default" | Button size |
| className | string | No | "" | Additional classes |

### Expected Outcome
- Functional button for manual data prefetching
- Appropriate states for different conditions
- Loading indicator during prefetch operation
- Success feedback after completion
- Optional prefetch configuration
- Last prefetch time display
- Toast notifications for user feedback
- Automatic prefetch scheduling (optional)

### Verification Checklist
- [ ] `frontend/components/offline/PrefetchButton.tsx` file created
- [ ] Component connects to prefetch store
- [ ] Button state logic implemented correctly
- [ ] All states display appropriate text and icons
- [ ] Click handler triggers prefetch
- [ ] Loading state shows during prefetch
- [ ] Success state displays after completion
- [ ] Error handling implemented
- [ ] Toast notifications show correctly
- [ ] Last prefetch time displays
- [ ] Prefetch options modal works (if implemented)
- [ ] Automatic scheduling settings work (if implemented)
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 91: Create Integration Tests

### Overview
Create comprehensive end-to-end integration tests using Playwright to verify the complete offline functionality workflow. These tests simulate real user scenarios including offline detection, offline operations, synchronization, conflict resolution, and data prefetching.

### Dependencies
- Task 90: Create Prefetch Button
- All previous offline functionality implemented
- Playwright testing framework installed
- Test database and environment configured

### Instructions

1. **Set up Playwright test environment**
   - Ensure Playwright is installed (`npm install -D @playwright/test`)
   - Create `tests/offline/` directory
   - Create `offline.spec.ts` test file
   - Configure Playwright for offline testing

2. **Configure test fixtures**
   - Create test user and authentication
   - Set up test database with sample data
   - Configure test server endpoints
   - Prepare offline simulation utilities

3. **Implement offline detection test**
   - Test name: `test_offline_detection`
   - Navigate to POS page while online
   - Verify online indicator shows green
   - Simulate offline mode using Playwright
   - Verify offline indicator shows red
   - Verify offline banner appears

4. **Implement offline sale transaction test**
   - Test name: `test_offline_sale`
   - Set browser to offline mode
   - Navigate to POS transaction page
   - Create a complete sale transaction
   - Verify transaction saves locally
   - Check pending count increments
   - Verify transaction appears in pending queue

5. **Implement sync queue test**
   - Test name: `test_sync_queue`
   - Create multiple offline transactions
   - Verify all transactions queued
   - Verify pending count accurate
   - Set browser to online mode
   - Trigger manual sync
   - Verify sync progress modal appears
   - Wait for sync completion
   - Verify pending count returns to zero

6. **Implement conflict resolution test**
   - Test name: `test_conflict`
   - Create transaction offline
   - Simulate server-side modification of same record
   - Set browser to online mode
   - Trigger sync
   - Verify conflict modal appears
   - Select "Keep Local" resolution
   - Verify resolution applied correctly
   - Verify sync completes

7. **Implement prefetch test**
   - Test name: `test_prefetch`
   - Navigate to settings or offline page
   - Click prefetch button
   - Wait for prefetch completion
   - Verify success message
   - Set browser to offline mode
   - Verify prefetched data accessible

8. **Implement auto-sync test**
   - Test name: `test_auto_sync`
   - Create offline transaction
   - Set browser to online mode
   - Wait for auto-sync to trigger
   - Verify sync occurs without manual intervention
   - Verify pending count clears

9. **Implement storage persistence test**
   - Test name: `test_storage_persistence`
   - Create offline transactions
   - Close and reopen browser
   - Verify transactions still in queue
   - Verify pending count persists

10. **Implement error handling test**
    - Test name: `test_error_handling`
    - Create offline transaction
    - Set browser to online
    - Mock server error (500)
    - Trigger sync
    - Verify error toast appears
    - Verify retry option available
    - Verify transaction remains in queue

11. **Add test utilities and helpers**
    - Create `offline-test-utils.ts`
    - Implement `goOffline()` utility
    - Implement `goOnline()` utility
    - Implement `createTestSale()` utility
    - Implement `waitForSync()` utility
    - Implement `clearOfflineData()` utility

12. **Configure test reporting**
    - Set up test results output
    - Configure screenshots on failure
    - Enable video recording for debugging
    - Set up HTML test reporter

### Test Suite Structure

```
tests/offline/
├── offline.spec.ts          # Main integration tests
├── offline-test-utils.ts    # Test utilities
└── fixtures/
    ├── test-data.json       # Sample test data
    └── test-users.json      # Test user accounts
```

### Test Case Overview

| Test # | Test Name | Purpose | Duration |
|--------|-----------|---------|----------|
| 1 | test_offline_detection | Verify offline detection | 1 min |
| 2 | test_offline_sale | Process sale offline | 2 min |
| 3 | test_sync_queue | Sync multiple items | 3 min |
| 4 | test_conflict | Resolve sync conflict | 3 min |
| 5 | test_prefetch | Prefetch data manually | 2 min |
| 6 | test_auto_sync | Auto-sync on reconnect | 2 min |
| 7 | test_storage_persistence | Data persists after reload | 2 min |
| 8 | test_error_handling | Handle sync errors | 2 min |

### Test: Offline Detection

```
test('Offline detection and indicator', async ({ page, context }) => {
  // 1. Navigate to POS page
  await page.goto('/pos');
  
  // 2. Verify online indicator
  await expect(page.locator('[data-testid="offline-indicator"]'))
    .toContainText('Online');
  await expect(page.locator('[data-testid="offline-icon"]'))
    .toHaveClass(/text-green-600/);
  
  // 3. Go offline
  await context.setOffline(true);
  await page.waitForTimeout(1000);
  
  // 4. Verify offline indicator
  await expect(page.locator('[data-testid="offline-indicator"]'))
    .toContainText('Offline');
  await expect(page.locator('[data-testid="offline-icon"]'))
    .toHaveClass(/text-red-600/);
  
  // 5. Verify offline banner appears
  await expect(page.locator('[data-testid="offline-banner"]'))
    .toBeVisible();
});
```

### Test: Offline Sale

```
test('Process sale transaction offline', async ({ page, context }) => {
  // 1. Set offline mode
  await context.setOffline(true);
  await page.goto('/pos/sales/new');
  
  // 2. Create sale transaction
  await page.fill('[data-testid="customer-search"]', 'John Doe');
  await page.click('[data-testid="customer-result-1"]');
  await page.fill('[data-testid="product-search"]', 'Widget');
  await page.click('[data-testid="product-result-1"]');
  await page.fill('[data-testid="quantity"]', '2');
  await page.click('[data-testid="add-item"]');
  await page.click('[data-testid="complete-sale"]');
  
  // 3. Verify sale saved locally
  await expect(page.locator('[data-testid="success-message"]'))
    .toContainText('Sale saved locally');
  
  // 4. Verify pending count incremented
  await expect(page.locator('[data-testid="pending-count"]'))
    .toContainText('1');
  
  // 5. Verify in pending queue
  await page.click('[data-testid="pending-count"]');
  await expect(page.locator('[data-testid="pending-item-1"]'))
    .toBeVisible();
});
```

### Test: Sync Queue

```
test('Sync multiple queued items', async ({ page, context }) => {
  // 1. Create multiple offline transactions
  await context.setOffline(true);
  for (let i = 0; i < 5; i++) {
    await createTestSale(page, i);
  }
  
  // 2. Verify pending count
  await expect(page.locator('[data-testid="pending-count"]'))
    .toContainText('5');
  
  // 3. Go online
  await context.setOffline(false);
  await page.waitForTimeout(1000);
  
  // 4. Trigger manual sync
  await page.click('[data-testid="sync-button"]');
  
  // 5. Verify sync progress modal
  await expect(page.locator('[data-testid="sync-progress-modal"]'))
    .toBeVisible();
  await expect(page.locator('[data-testid="progress-bar"]'))
    .toBeVisible();
  
  // 6. Wait for completion
  await page.waitForSelector('[data-testid="sync-progress-modal"]', {
    state: 'hidden',
    timeout: 30000
  });
  
  // 7. Verify pending count cleared
  await expect(page.locator('[data-testid="pending-count"]'))
    .not.toBeVisible();
});
```

### Test: Conflict Resolution

```
test('Resolve sync conflict', async ({ page, context }) => {
  // 1. Create transaction offline
  await context.setOffline(true);
  const saleId = await createTestSale(page, 1);
  
  // 2. Mock server-side modification
  await mockServerUpdate(saleId, { total: 200 });
  
  // 3. Go online and sync
  await context.setOffline(false);
  await page.click('[data-testid="sync-button"]');
  
  // 4. Verify conflict modal appears
  await expect(page.locator('[data-testid="conflict-modal"]'))
    .toBeVisible();
  await expect(page.locator('[data-testid="local-version"]'))
    .toContainText('150');
  await expect(page.locator('[data-testid="server-version"]'))
    .toContainText('200');
  
  // 5. Select resolution
  await page.click('[data-testid="keep-local-button"]');
  
  // 6. Verify resolution applied
  await expect(page.locator('[data-testid="success-toast"]'))
    .toContainText('Conflict resolved');
  
  // 7. Verify sync completes
  await expect(page.locator('[data-testid="pending-count"]'))
    .not.toBeVisible();
});
```

### Test Utilities

```typescript
// offline-test-utils.ts

export async function goOffline(context: BrowserContext) {
  await context.setOffline(true);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function goOnline(context: BrowserContext) {
  await context.setOffline(false);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function createTestSale(page: Page, index: number) {
  await page.goto('/pos/sales/new');
  await page.fill('[data-testid="customer-search"]', `Customer ${index}`);
  await page.click(`[data-testid="customer-result-${index}"]`);
  await page.fill('[data-testid="product-search"]', 'Product');
  await page.click('[data-testid="product-result-1"]');
  await page.click('[data-testid="complete-sale"]');
  
  // Return sale ID
  const saleId = await page.locator('[data-testid="sale-id"]').textContent();
  return saleId;
}

export async function waitForSync(page: Page, timeout = 30000) {
  await page.waitForSelector('[data-testid="sync-progress-modal"]', {
    state: 'hidden',
    timeout
  });
}

export async function clearOfflineData(page: Page) {
  await page.evaluate(() => {
    return indexedDB.deleteDatabase('offline-db');
  });
}
```

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'offline-tests',
      testMatch: /offline\.spec\.ts/,
    },
  ],
});
```

### Expected Outcome
- Complete integration test suite for offline functionality
- All critical user workflows tested
- Offline detection verified
- Transaction processing tested
- Sync operations validated
- Conflict resolution tested
- Error handling verified
- Tests run reliably and consistently
- Clear test output and reporting

### Verification Checklist
- [ ] `tests/offline/offline.spec.ts` file created
- [ ] Playwright configured correctly
- [ ] Test fixtures and utilities created
- [ ] Offline detection test passes
- [ ] Offline sale test passes
- [ ] Sync queue test passes
- [ ] Conflict resolution test passes
- [ ] Prefetch test passes
- [ ] Auto-sync test passes
- [ ] Storage persistence test passes
- [ ] Error handling test passes
- [ ] Test utilities implemented
- [ ] Screenshots captured on failure
- [ ] Test reports generated
- [ ] All tests pass consistently

---

## Task 92: Create Stress Test

### Overview
Create stress tests to evaluate offline system performance under heavy load conditions. These tests simulate scenarios with large operation queues, rapid transaction creation, concurrent operations, and memory constraints to ensure the system remains stable and responsive.

### Dependencies
- Task 91: Create Integration Tests
- Jest or Vitest testing framework
- Performance monitoring utilities
- Memory profiling tools

### Instructions

1. **Create stress test file**
   - Create `stress.spec.ts` in `tests/offline/` directory
   - Set up testing framework (Jest/Vitest)
   - Import required utilities and helpers
   - Configure extended timeout for long-running tests

2. **Set up performance monitoring**
   - Install performance monitoring tools
   - Create utilities to measure operation time
   - Implement memory usage tracking
   - Set up CPU usage monitoring (if applicable)

3. **Implement large queue stress test**
   - Test name: `test_large_queue_sync`
   - Create 1000 offline operations
   - Queue all operations in IndexedDB
   - Measure queue creation time
   - Trigger sync operation
   - Measure sync time and memory usage
   - Verify all operations sync successfully
   - Check for memory leaks

4. **Implement rapid operation stress test**
   - Test name: `test_rapid_operation_creation`
   - Create operations rapidly (100/second)
   - Continue for 10 seconds (1000 total)
   - Measure operation throughput
   - Verify all operations saved
   - Check IndexedDB performance
   - Monitor memory growth

5. **Implement concurrent operation stress test**
   - Test name: `test_concurrent_operations`
   - Simulate 10 concurrent users
   - Each user creates 100 operations
   - Run operations in parallel
   - Measure total time and conflicts
   - Verify data integrity
   - Check for race conditions

6. **Implement memory constraint stress test**
   - Test name: `test_memory_limits`
   - Fill IndexedDB to 80% capacity
   - Continue adding operations
   - Monitor storage warnings
   - Verify graceful handling of limits
   - Test cleanup functionality
   - Ensure no data corruption

7. **Implement continuous sync stress test**
   - Test name: `test_continuous_sync_load`
   - Create operations continuously
   - Sync every 10 operations
   - Run for 5 minutes
   - Monitor sync queue length
   - Verify no queue buildup
   - Check for performance degradation

8. **Implement network instability stress test**
   - Test name: `test_flaky_network`
   - Simulate intermittent connectivity
   - Create operations during disconnections
   - Sync when connection available
   - Random connection drops during sync
   - Verify retry logic works
   - Ensure no data loss

9. **Implement data size stress test**
   - Test name: `test_large_payload_operations`
   - Create operations with large payloads
   - Each operation 1MB+ (images, etc.)
   - Queue 100 large operations
   - Measure storage impact
   - Test sync performance
   - Verify memory efficiency

10. **Implement browser resource stress test**
    - Test name: `test_resource_exhaustion`
    - Create operations while simulating CPU load
    - Throttle browser resources
    - Monitor responsiveness
    - Verify UI remains functional
    - Check background sync works
    - Test recovery after resource constraint

11. **Create performance benchmarks**
    - Define acceptable performance thresholds
    - Operation creation: < 50ms per operation
    - Sync throughput: > 50 operations/second
    - Memory usage: < 200MB for 1000 operations
    - Compare actual vs. expected performance

12. **Generate stress test report**
    - Collect all performance metrics
    - Generate summary report
    - Identify performance bottlenecks
    - Provide optimization recommendations
    - Save results for regression testing

### Stress Test Structure

```
tests/offline/
├── stress.spec.ts              # Main stress tests
├── stress-utils.ts             # Stress test utilities
├── performance-monitor.ts      # Performance tracking
└── reports/
    └── stress-test-report.json # Test results
```

### Stress Test Overview

| Test # | Test Name | Load | Duration | Metrics |
|--------|-----------|------|----------|---------|
| 1 | Large Queue | 1000 ops | 5 min | Time, memory |
| 2 | Rapid Creation | 100 ops/sec | 10 sec | Throughput |
| 3 | Concurrent Ops | 10 users × 100 | 2 min | Conflicts, integrity |
| 4 | Memory Limits | 80%+ storage | 3 min | Warnings, cleanup |
| 5 | Continuous Sync | 500 ops | 5 min | Queue stability |
| 6 | Flaky Network | Variable | 5 min | Retry success |
| 7 | Large Payloads | 100 × 1MB | 10 min | Storage, speed |
| 8 | Resource Exhaustion | CPU throttle | 5 min | Responsiveness |

### Test: Large Queue Sync

```typescript
test('Sync large queue of 1000 operations', async () => {
  const startTime = performance.now();
  const startMemory = getMemoryUsage();
  
  // 1. Create 1000 operations
  console.log('Creating 1000 operations...');
  for (let i = 0; i < 1000; i++) {
    await offlineStore.queueOperation({
      type: 'sale',
      action: 'create',
      data: generateTestSale(i),
      timestamp: Date.now(),
    });
    
    if (i % 100 === 0) {
      console.log(`Created ${i} operations...`);
    }
  }
  
  const creationTime = performance.now() - startTime;
  console.log(`Creation time: ${creationTime}ms`);
  
  // 2. Verify queue size
  const queueSize = await offlineStore.getPendingCount();
  expect(queueSize).toBe(1000);
  
  // 3. Trigger sync
  console.log('Starting sync...');
  const syncStart = performance.now();
  await syncStore.triggerSync();
  
  // 4. Wait for completion
  await waitForSyncComplete(60000);
  const syncTime = performance.now() - syncStart;
  console.log(`Sync time: ${syncTime}ms`);
  
  // 5. Verify all synced
  const remainingQueue = await offlineStore.getPendingCount();
  expect(remainingQueue).toBe(0);
  
  // 6. Check memory
  const endMemory = getMemoryUsage();
  const memoryIncrease = endMemory - startMemory;
  console.log(`Memory increase: ${memoryIncrease}MB`);
  expect(memoryIncrease).toBeLessThan(200); // Max 200MB increase
  
  // 7. Performance assertions
  expect(creationTime).toBeLessThan(60000); // < 1 minute
  expect(syncTime).toBeLessThan(120000); // < 2 minutes
  expect(syncTime / 1000).toBeLessThan(150); // < 150ms per operation
});
```

### Test: Rapid Operation Creation

```typescript
test('Create operations rapidly at 100/second', async () => {
  const targetRate = 100; // operations per second
  const duration = 10; // seconds
  const totalOperations = targetRate * duration;
  
  const startTime = performance.now();
  let created = 0;
  
  // Create operations rapidly
  const interval = 1000 / targetRate;
  
  for (let i = 0; i < totalOperations; i++) {
    const opStart = performance.now();
    
    await offlineStore.queueOperation({
      type: 'sale',
      action: 'create',
      data: generateTestSale(i),
      timestamp: Date.now(),
    });
    
    created++;
    
    const opTime = performance.now() - opStart;
    
    // Verify operation time is reasonable
    expect(opTime).toBeLessThan(50); // < 50ms per operation
    
    // Wait to maintain rate
    const elapsed = performance.now() - startTime;
    const expectedElapsed = (i + 1) * interval;
    const delay = expectedElapsed - elapsed;
    
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  const totalTime = performance.now() - startTime;
  const actualRate = created / (totalTime / 1000);
  
  console.log(`Created ${created} operations in ${totalTime}ms`);
  console.log(`Actual rate: ${actualRate.toFixed(2)} ops/sec`);
  
  // Verify rate achieved
  expect(actualRate).toBeGreaterThan(targetRate * 0.9); // 90% of target
  
  // Verify all saved
  const queueSize = await offlineStore.getPendingCount();
  expect(queueSize).toBe(totalOperations);
});
```

### Test: Concurrent Operations

```typescript
test('Handle concurrent operations from 10 users', async () => {
  const userCount = 10;
  const opsPerUser = 100;
  
  const startTime = performance.now();
  
  // Simulate concurrent users
  const userPromises = Array.from({ length: userCount }, async (_, userId) => {
    const userOps = [];
    
    for (let i = 0; i < opsPerUser; i++) {
      const op = offlineStore.queueOperation({
        type: 'sale',
        action: 'create',
        data: {
          ...generateTestSale(i),
          userId: `user-${userId}`,
        },
        timestamp: Date.now(),
      });
      
      userOps.push(op);
    }
    
    return Promise.all(userOps);
  });
  
  // Wait for all concurrent operations
  await Promise.all(userPromises);
  
  const totalTime = performance.now() - startTime;
  console.log(`Concurrent operations completed in ${totalTime}ms`);
  
  // Verify all operations saved
  const queueSize = await offlineStore.getPendingCount();
  expect(queueSize).toBe(userCount * opsPerUser);
  
  // Verify data integrity
  const allOperations = await offlineStore.getAllPending();
  const userOperations = new Map();
  
  allOperations.forEach(op => {
    const userId = op.data.userId;
    userOperations.set(userId, (userOperations.get(userId) || 0) + 1);
  });
  
  // Each user should have exactly opsPerUser operations
  userOperations.forEach((count, userId) => {
    expect(count).toBe(opsPerUser);
  });
});
```

### Performance Monitoring Utilities

```typescript
// performance-monitor.ts

export function getMemoryUsage(): number {
  if (performance.memory) {
    return performance.memory.usedJSHeapSize / 1024 / 1024; // MB
  }
  return 0;
}

export async function measureOperationTime<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await operation();
  const duration = performance.now() - start;
  
  console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
  
  return { result, duration };
}

export class PerformanceTracker {
  private metrics: Map<string, number[]> = new Map();
  
  record(metric: string, value: number) {
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, []);
    }
    this.metrics.get(metric)!.push(value);
  }
  
  getAverage(metric: string): number {
    const values = this.metrics.get(metric) || [];
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  
  getMax(metric: string): number {
    const values = this.metrics.get(metric) || [];
    return Math.max(...values);
  }
  
  getMin(metric: string): number {
    const values = this.metrics.get(metric) || [];
    return Math.min(...values);
  }
  
  generateReport(): Record<string, any> {
    const report: Record<string, any> = {};
    
    this.metrics.forEach((values, metric) => {
      report[metric] = {
        count: values.length,
        average: this.getAverage(metric),
        min: this.getMin(metric),
        max: this.getMax(metric),
      };
    });
    
    return report;
  }
}
```

### Performance Thresholds

| Metric | Threshold | Unit | Critical |
|--------|-----------|------|----------|
| Operation Creation | < 50 | ms | Yes |
| Sync Throughput | > 50 | ops/sec | Yes |
| Memory Usage (1000 ops) | < 200 | MB | No |
| Queue Query Time | < 100 | ms | Yes |
| IndexedDB Write | < 20 | ms | No |
| Storage Limit Warning | 80 | % | Yes |

### Stress Test Report Format

```json
{
  "timestamp": "2026-01-31T10:00:00Z",
  "testsRun": 8,
  "testsPassed": 8,
  "testsFailed": 0,
  "metrics": {
    "largeQueueSync": {
      "operationCount": 1000,
      "creationTime": 45000,
      "syncTime": 95000,
      "memoryIncrease": 175,
      "passed": true
    },
    "rapidCreation": {
      "targetRate": 100,
      "actualRate": 98.5,
      "operationsCreated": 1000,
      "totalTime": 10150,
      "passed": true
    },
    "concurrentOperations": {
      "userCount": 10,
      "opsPerUser": 100,
      "totalTime": 8500,
      "conflicts": 0,
      "passed": true
    }
  },
  "recommendations": [
    "System handles large queues well within acceptable limits",
    "Consider implementing batch operations for better performance",
    "Memory usage is optimal, no leaks detected"
  ]
}
```

### Expected Outcome
- Comprehensive stress test coverage
- System performs well under heavy load
- No memory leaks detected
- No data integrity issues
- Performance thresholds met
- Clear performance metrics collected
- Detailed test report generated
- Optimization opportunities identified

### Verification Checklist
- [ ] `tests/offline/stress.spec.ts` file created
- [ ] Performance monitoring utilities implemented
- [ ] Large queue test passes
- [ ] Rapid creation test passes
- [ ] Concurrent operations test passes
- [ ] Memory limits test passes
- [ ] Continuous sync test passes
- [ ] Network instability test passes
- [ ] Large payload test passes
- [ ] Resource exhaustion test passes
- [ ] Performance thresholds defined
- [ ] All thresholds met
- [ ] No memory leaks detected
- [ ] Test report generated
- [ ] Optimization recommendations provided

---

## Summary

This document covered the creation of comprehensive UI components and testing infrastructure for the POS Offline Enhancement system. All components work together to provide a complete offline experience with clear visual feedback, manual controls, conflict resolution, and robust testing.

### Completed Tasks

1. ✓ Created OfflineIndicator component for connectivity status
2. ✓ Created SyncStatus component for synchronization state
3. ✓ Created PendingCount badge for queued operations
4. ✓ Created SyncButton for manual synchronization
5. ✓ Created SyncProgressModal for sync feedback
6. ✓ Created ConflictModal for conflict resolution
7. ✓ Created Error Toast notifications using Sonner
8. ✓ Created OfflineBanner for offline mode indication
9. ✓ Created StorageStats for storage usage monitoring
10. ✓ Created PrefetchButton for manual data prefetching
11. ✓ Created comprehensive Integration Tests with Playwright
12. ✓ Created Stress Tests for performance validation

### Component Summary

| Component | Purpose | Location |
|-----------|---------|----------|
| OfflineIndicator | Network status display | Status bar |
| SyncStatus | Sync state indicator | Status bar |
| PendingCount | Queued operations badge | Near sync status |
| SyncButton | Manual sync trigger | Toolbar/menu |
| SyncProgressModal | Sync progress display | Modal overlay |
| ConflictModal | Conflict resolution UI | Modal overlay |
| Error Toast | Error notifications | Toast container |
| OfflineBanner | Offline mode banner | Top of screen |
| StorageStats | Storage usage display | Settings page |
| PrefetchButton | Manual prefetch trigger | Settings/menu |

### Testing Coverage

| Test Type | Tests | Coverage |
|-----------|-------|----------|
| Integration | 8 tests | E2E workflows |
| Stress | 8 tests | Performance limits |
| Total | 16 tests | Complete system |

### Next Steps

Proceed to [SubPhase-09: Real-time Sync Engine](../../SubPhase-09_Real-time-Sync-Engine/) to implement real-time synchronization capabilities, WebSocket connections, and live data updates for enhanced multi-user collaboration.

---

**End of Document**
