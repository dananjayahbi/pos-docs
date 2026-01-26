# Tasks 25-30: Notifications & Command Palette

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** B - UI State Stores  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-24_Sidebar-Theme-Modals.md](01_Tasks-15-24_Sidebar-Theme-Modals.md)

---

## Document Overview

This document completes the UI state store by implementing notification management and command palette state. Creates a notification queue system with auto-dismiss functionality and type-based styling. Implements command palette state for keyboard-driven application navigation. These features enhance user experience through timely feedback and efficient navigation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Define Notification State | Low | 20 min |
| 26 | Create addNotification Action | Low | 25 min |
| 27 | Create removeNotification Action | Low | 10 min |
| 28 | Create clearNotifications Action | Low | 10 min |
| 29 | Define CommandPalette State | Low | 10 min |
| 30 | Create toggleCommandPalette Action | Low | 15 min |

---

## Task 25: Define Notification State

### Overview
Define the notification state structure for managing application-wide notifications. Creates a notification queue system that supports multiple notification types, auto-dismiss functionality, and customizable appearance. This provides consistent user feedback across all dashboard operations.

### Dependencies
- Task 15: Create UI Store
- UIStore file exists

### Instructions

1. **Define Notification interface**
   - Create interface in types or within store file
   - Include all necessary properties
   - Export for component usage

2. **Add id property**
   - Type: string
   - Unique identifier for each notification
   - Generated using nanoid or UUID
   - Required for removal and tracking

3. **Add type property**
   - Type: 'success' | 'error' | 'warning' | 'info'
   - Determines notification styling and icon
   - Required field
   - Maps to visual variants

4. **Add title property**
   - Type: string
   - Main notification message
   - Required field
   - Brief and descriptive (max 80 chars recommended)

5. **Add message property**
   - Type: string | undefined
   - Optional detailed message
   - Optional field (can be undefined)
   - Supports longer explanatory text

6. **Add duration property**
   - Type: number | undefined
   - Auto-dismiss timeout in milliseconds
   - Optional field
   - If undefined, notification persists until manually dismissed

7. **Add timestamp property**
   - Type: Date or number
   - When notification was created
   - Auto-generated on creation
   - Used for sorting and display

8. **Add action property (optional)**
   - Type: object with label and callback
   - Optional action button in notification
   - Example: "Undo", "View Details"
   - Enhances interactivity

9. **Add notifications array to UIState**
   - Array of Notification objects
   - Initialize as empty array
   - Maintains insertion order
   - Used for rendering notification list

### Notification Type Specifications

| Type | Use Case | Default Duration | Icon | Color Scheme |
|------|----------|------------------|------|--------------|
| success | Operation completed successfully | 3000ms | CheckCircle | Green |
| error | Operation failed, user action needed | 5000ms | XCircle | Red |
| warning | Potential issue, attention required | 4000ms | AlertTriangle | Yellow/Orange |
| info | Informational message | 3000ms | Info | Blue |

### Notification Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| id | string | Yes | Generated | Unique identifier |
| type | NotificationType | Yes | - | Visual variant |
| title | string | Yes | - | Main message |
| message | string? | No | undefined | Detailed description |
| duration | number? | No | Type-based | Auto-dismiss ms |
| timestamp | Date | Yes | new Date() | Creation time |
| action | Action? | No | undefined | Optional button |

### Notification Lifecycle

```
User Action or System Event
         ↓
  addNotification()
         ↓
  Generate unique ID
         ↓
  Add timestamp
         ↓
  Insert into array
         ↓
  [Duration specified?] ──Yes→ Set timeout
         │                        ↓
         No                   Auto-remove
         ↓
  Display notification
         ↓
  Wait for user interaction
         ↓
  removeNotification()
         ↓
  Remove from array
```

### Usage Scenarios

#### Success Notification
**Scenario:** User saves settings  
**Title:** "Settings saved successfully"  
**Message:** "Your preferences have been updated"  
**Duration:** 3000ms  
**Type:** success

#### Error Notification
**Scenario:** API request fails  
**Title:** "Failed to load data"  
**Message:** "Unable to connect to server. Please try again."  
**Duration:** 5000ms (longer for errors)  
**Type:** error  
**Action:** { label: "Retry", onClick: retryFunction }

#### Warning Notification
**Scenario:** Low stock alert  
**Title:** "Low stock warning"  
**Message:** "5 products are below minimum stock level"  
**Duration:** 4000ms  
**Type:** warning  
**Action:** { label: "View Products", onClick: navigateToInventory }

#### Info Notification
**Scenario:** Background task completed  
**Title:** "Report generated"  
**Message:** "Your sales report is ready to download"  
**Duration:** 3000ms  
**Type:** info  
**Action:** { label: "Download", onClick: downloadReport }

### Notification Queue Management

**Maximum Notifications**
- Limit to 5 visible notifications
- Oldest notifications dismissed first
- Prevents screen clutter
- Maintains performance

**Position Strategy**
- Display in fixed position (top-right or bottom-right)
- Stack vertically
- Newest on top or bottom (configurable)
- Slide-in animation

**Stacking Behavior**
```
╔═══════════════════════════════════╗
║ ✓ Settings saved                  ║  ← Newest (shown 0s ago)
╠═══════════════════════════════════╣
║ ⓘ Report generated                ║  ← Shown 2s ago
╠═══════════════════════════════════╣
║ ⚠ Low stock warning               ║  ← Shown 5s ago
╠═══════════════════════════════════╣
║ ✗ Failed to sync                  ║  ← Oldest (shown 8s ago)
╚═══════════════════════════════════╝
```

### Sri Lanka-Specific Considerations

**Language Support**
- Title and message support Sinhala/Tamil
- RTL layout for Tamil text
- Unicode character rendering
- Font fallbacks for local languages

**Network Awareness**
- Error notifications for connectivity issues
- Retry mechanisms for poor connections
- Offline mode indicators
- Sync status notifications

**Local Business Context**
- Payment confirmation messages
- Tax calculation notifications
- Currency formatting (LKR)
- Business hour reminders

### Expected Outcome
- Well-structured notification state
- Type-safe notification properties
- Flexible notification system
- Foundation for notification management

### Verification Checklist
- [ ] Notification interface defined
- [ ] id property added (string)
- [ ] type property added (union type)
- [ ] title property added (string)
- [ ] message property added (optional string)
- [ ] duration property added (optional number)
- [ ] timestamp property added (Date)
- [ ] action property defined (optional)
- [ ] notifications array added to UIState
- [ ] Interface exported for component usage

---

## Task 26: Create addNotification Action

### Overview
Create the addNotification action that adds new notifications to the queue with automatic ID generation and timeout management. This action handles notification insertion, auto-dismiss timing, and queue size limits to maintain optimal user experience.

### Dependencies
- Task 25: Define Notification State
- Notification interface exists

### Instructions

1. **Add addNotification method to UIActions**
   - Accept notification parameters
   - Return notification ID
   - Enable chaining and tracking

2. **Define method signature**
   - Accept partial notification object
   - ID and timestamp auto-generated
   - Return string (notification ID)
   - Type-safe parameters

3. **Implement ID generation**
   - Use nanoid or UUID library
   - Generate unique ID
   - Ensure no collisions
   - Short but unique (8-12 chars)

4. **Add timestamp**
   - Set to current date/time
   - Use Date object or timestamp
   - Used for sorting and display
   - Required for all notifications

5. **Set default duration**
   - Apply type-based defaults if not specified
   - success: 3000ms
   - error: 5000ms
   - warning: 4000ms
   - info: 3000ms

6. **Add to notifications array**
   - Use immer for immutability
   - Push to beginning or end of array
   - Maintain insertion order
   - Update state atomically

7. **Implement queue size limit**
   - Check array length after insertion
   - Limit to 5 active notifications
   - Remove oldest if exceeds limit
   - Prevent memory leaks

8. **Set up auto-dismiss timeout**
   - Check if duration is specified
   - Use setTimeout for auto-removal
   - Store timeout ID if needed
   - Call removeNotification after duration

9. **Handle persistence exclusion**
   - Notifications should not persist
   - Excluded from localStorage
   - Fresh state on page load
   - Transient by nature

10. **Return notification ID**
    - Return generated ID
    - Enables manual removal
    - Allows tracking
    - Supports action callbacks

### Implementation Flow

```
addNotification(params) called
         ↓
  Generate unique ID (nanoid)
         ↓
  Add current timestamp
         ↓
  Apply default duration (if not provided)
         ↓
  Create complete notification object
         ↓
  Add to notifications array
         ↓
  [Array > 5 items?] ──Yes→ Remove oldest
         │                      ↓
         No                 Continue
         ↓
  [Duration exists?] ──Yes→ Set timeout
         │                      ↓
         No                 removeNotification(id)
         ↓
  Return notification ID
```

### Method Signature

**Input Parameters**
```typescript
{
  type: 'success' | 'error' | 'warning' | 'info',
  title: string,
  message?: string,
  duration?: number,
  action?: {
    label: string,
    onClick: () => void
  }
}
```

**Return Value**
```typescript
string  // Notification ID
```

### Queue Management Logic

**Adding Notification**
1. Create notification with generated ID
2. Insert at beginning of array (newest first)
3. Check array length
4. If length > 5, remove last item
5. Update state
6. Set timeout if duration specified

**Maximum Queue Size**
- Limit: 5 notifications
- Overflow behavior: Remove oldest
- Visual clarity maintained
- Performance optimized

### Auto-Dismiss Implementation

**Timeout Management**
- Create setTimeout when duration exists
- Store timeout reference (optional)
- Clear timeout on manual dismiss
- Cleanup on component unmount

**Timeout Cleanup**
```
Set timeout → User dismisses → Clear timeout
                     ↓
              Prevent double removal
                     ↓
              State remains consistent
```

### Default Duration by Type

| Type | Duration | Rationale |
|------|----------|-----------|
| success | 3000ms | Quick confirmation, positive feedback |
| error | 5000ms | User needs time to read error |
| warning | 4000ms | Important but not critical |
| info | 3000ms | Informational, brief display |

### Usage Examples

#### Simple Success Notification
```
Call addNotification with:
- type: 'success'
- title: 'Product added'

Result:
- ID generated automatically
- Duration defaults to 3000ms
- Auto-dismisses after 3 seconds
```

#### Error with Custom Duration
```
Call addNotification with:
- type: 'error'
- title: 'Failed to save'
- message: 'Network error occurred'
- duration: 7000

Result:
- Extended display time for error
- User has time to read and act
```

#### Persistent Notification
```
Call addNotification with:
- type: 'warning'
- title: 'Action required'
- message: 'Please verify your email'
- duration: undefined

Result:
- No auto-dismiss
- Remains until manually closed
- Critical user action needed
```

#### Notification with Action
```
Call addNotification with:
- type: 'info'
- title: 'Update available'
- message: 'Version 2.0 is ready'
- action: {
    label: 'Update Now',
    onClick: handleUpdate
  }

Result:
- Displays action button
- User can interact
- Callback executed on click
```

### Edge Cases

**Rapid Notification Creation**
- Queue fills quickly
- Oldest dismissed automatically
- User sees most recent 5
- No performance degradation

**Long-Running Timeouts**
- Component unmounts during timeout
- Cleanup timeout references
- Prevent memory leaks
- No dangling callbacks

**Duplicate Notifications**
- Same title/message added multiple times
- Each gets unique ID
- All displayed (up to queue limit)
- User sees repetition (intentional)

### Performance Considerations

**State Updates**
- Single state update per addition
- Immer handles immutability
- No unnecessary re-renders
- Efficient array operations

**Memory Management**
- Limited queue size
- Automatic cleanup
- Timeout cleanup
- No memory leaks

### Expected Outcome
- Functional notification addition system
- Automatic ID and timestamp generation
- Auto-dismiss with type-based defaults
- Queue size management
- Return ID for tracking

### Verification Checklist
- [ ] addNotification method added to UIActions
- [ ] Method accepts partial notification object
- [ ] Unique ID generation implemented
- [ ] Timestamp automatically added
- [ ] Default duration logic implemented
- [ ] Notification added to array
- [ ] Queue size limit enforced (max 5)
- [ ] Auto-dismiss timeout set when duration exists
- [ ] Timeout cleanup handled
- [ ] Method returns notification ID
- [ ] Immer used for state updates

---

## Task 27: Create removeNotification Action

### Overview
Create the removeNotification action that removes a specific notification from the queue by its ID. This action handles manual dismissal by users and automatic removal by auto-dismiss timeouts, ensuring clean state management.

### Dependencies
- Task 25: Define Notification State
- Task 26: Create addNotification Action

### Instructions

1. **Add removeNotification method to UIActions**
   - Accept notification ID parameter
   - Remove notification from array
   - Type-safe implementation

2. **Define method signature**
   - Single parameter: notification ID (string)
   - No return value (void)
   - Simple and focused

3. **Implement removal logic**
   - Find notification by ID
   - Remove from notifications array
   - Use immer for immutability
   - Handle missing ID gracefully

4. **Use array filter method**
   - Filter out notification with matching ID
   - Preserve all other notifications
   - Maintain array order
   - Efficient operation

5. **Handle non-existent ID**
   - Check if notification exists before removal
   - Silent failure (no error)
   - Idempotent operation
   - Safe to call multiple times

6. **Clear any pending timeouts**
   - If timeout reference stored
   - Clear timeout on removal
   - Prevent dangling callbacks
   - Memory cleanup

7. **Update state atomically**
   - Single state update
   - Use Zustand's set method
   - Immer handles immutability
   - No race conditions

### Removal Implementation

```
removeNotification(id) called
         ↓
  Find notification in array
         ↓
  [Notification exists?] ──No→ Return (no-op)
         │
        Yes
         ↓
  Filter notification from array
         ↓
  [Timeout stored?] ──Yes→ Clear timeout
         │                     ↓
         No                Continue
         ↓
  Update state with filtered array
```

### Method Signature

**Input Parameters**
```typescript
id: string  // Notification ID to remove
```

**Return Value**
```typescript
void  // No return value
```

### Removal Scenarios

#### User Manual Dismiss
**Flow:**
1. User clicks close button
2. Component calls removeNotification(id)
3. Notification filtered from array
4. Timeout cleared (if exists)
5. Notification disappears from UI

#### Auto-Dismiss Timeout
**Flow:**
1. Timeout expires
2. Timeout callback executes
3. Calls removeNotification(id)
4. Notification removed from queue
5. Next notification slides up

#### Notification with Action
**Flow:**
1. User clicks action button
2. Action callback executes
3. Component calls removeNotification(id)
4. Notification dismissed
5. User sees next notification

### Array Filtering Logic

**Filter Operation**
```
Before removal (array length = 5):
[notification_A, notification_B, notification_C, notification_D, notification_E]

Remove notification_C:
Filter: item.id !== 'notification_C'

After removal (array length = 4):
[notification_A, notification_B, notification_D, notification_E]
```

**Array Order Preserved**
- Original insertion order maintained
- No reordering on removal
- Visual consistency
- Predictable behavior

### Edge Cases

**Removing Non-Existent ID**
```
Scenario: Timeout fires after manual dismiss
Result: Filter returns unchanged array
Effect: No error, no side effects
Behavior: Safe and idempotent
```

**Double Removal**
```
Scenario: User clicks close twice rapidly
Result: First call removes, second is no-op
Effect: Array updated once
Behavior: Graceful handling
```

**Removing Last Notification**
```
Scenario: Only one notification in queue
Result: Array becomes empty
Effect: Notification panel hidden
Behavior: Clean state transition
```

### Performance Considerations

**Filter Efficiency**
- O(n) operation where n is queue size
- Maximum n = 5 (queue limit)
- Negligible performance impact
- No optimization needed

**State Update Frequency**
- One update per removal
- No batching needed
- Immediate UI response
- Smooth animations

### Timeout Cleanup

**Why Clear Timeouts?**
- Prevent memory leaks
- Avoid calling removeNotification twice
- Clean resource management
- Better performance

**Timeout Reference Storage**
```
Option 1: Store in notification object
  notification.timeoutId = setTimeout(...)
  
Option 2: Store in separate Map
  timeoutMap.set(id, setTimeout(...))
  
Option 3: No storage (accept double-call)
  Idempotent removal handles it
```

### Integration with Components

**Close Button Handler**
```
User clicks [×] button
     ↓
onClick handler fires
     ↓
Calls removeNotification(notification.id)
     ↓
Notification fades out
     ↓
Removed from array
```

**Action Button Handler**
```
User clicks action button
     ↓
Execute action callback
     ↓
Call removeNotification(notification.id)
     ↓
Notification dismissed
     ↓
Action completed
```

### Expected Outcome
- Clean notification removal
- ID-based targeting
- Graceful error handling
- Timeout cleanup
- Atomic state updates

### Verification Checklist
- [ ] removeNotification method added to UIActions
- [ ] Method accepts notification ID (string)
- [ ] Array filter used for removal
- [ ] Non-existent ID handled gracefully
- [ ] State updated atomically
- [ ] Timeout cleanup implemented (if applicable)
- [ ] Method is idempotent
- [ ] No errors on double removal
- [ ] Immer used for state updates

---

## Task 28: Create clearNotifications Action

### Overview
Create the clearNotifications action that removes all notifications from the queue at once. This action provides a quick way to dismiss all active notifications, useful for cleanup operations, user preference, or error recovery scenarios.

### Dependencies
- Task 25: Define Notification State
- Task 26: Create addNotification Action

### Instructions

1. **Add clearNotifications method to UIActions**
   - No parameters required
   - Removes all notifications
   - Simple implementation

2. **Define method signature**
   - No parameters
   - No return value (void)
   - Straightforward operation

3. **Clear notifications array**
   - Set notifications to empty array
   - Use immer for immutability
   - Single state update
   - Immediate effect

4. **Clear all pending timeouts**
   - Iterate through stored timeout IDs
   - Clear each timeout
   - Prevent orphaned callbacks
   - Memory cleanup

5. **Update state atomically**
   - Single Zustand set call
   - Reset notifications to []
   - Clean state transition
   - No partial updates

### Clear Implementation

```
clearNotifications() called
         ↓
  [Timeouts stored?] ──Yes→ Clear all timeouts
         │                       ↓
         No                  Continue
         ↓
  Set notifications = []
         ↓
  Update state
         ↓
  All notifications dismissed
```

### Method Signature

**Input Parameters**
```typescript
None  // No parameters needed
```

**Return Value**
```typescript
void  // No return value
```

### Use Cases

#### Clear All Button
**Scenario:** User wants to dismiss all notifications at once  
**Action:** User clicks "Clear All" button in notification panel  
**Result:** All notifications removed instantly  
**Benefit:** Quick cleanup without clicking each notification

#### Route Navigation
**Scenario:** User navigates to different page  
**Action:** Route change clears old notifications  
**Result:** Fresh notification state for new page  
**Benefit:** Context-appropriate notifications

#### Error Recovery
**Scenario:** System encounters multiple errors  
**Action:** Clear all error notifications before retry  
**Result:** Clean slate for new operation  
**Benefit:** Prevents notification spam

#### Logout/Session End
**Scenario:** User logs out  
**Action:** Clear notifications on session end  
**Result:** No notifications persist after logout  
**Benefit:** Clean state for next user

### Timeout Cleanup

**Why Clear All Timeouts?**
- Prevent callbacks after clear
- Memory leak prevention
- Clean state management
- Avoid race conditions

**Cleanup Strategies**

**Strategy 1: Stored Timeout Map**
```
Store timeouts in Map:
timeoutMap = { id1: timeout1, id2: timeout2 }

On clear:
For each timeout in map:
  clearTimeout(timeout)
Clear map
```

**Strategy 2: No Timeout Storage**
```
Accept double-call safety:
removeNotification() is idempotent
Timeouts call removeNotification()
If already cleared, no effect
```

**Strategy 3: Timeout IDs in Notifications**
```
Store timeout in notification object:
notification.timeoutId = setTimeout(...)

On clear:
For each notification:
  clearTimeout(notification.timeoutId)
```

### Integration Scenarios

#### Clear All Button UI
```
Notification Panel Header
┌─────────────────────────────┐
│ Notifications       [Clear All] │  ← Button triggers clearNotifications()
├─────────────────────────────┤
│ ✓ Settings saved              │
│ ⚠ Low stock warning           │
│ ⓘ Report generated            │
└─────────────────────────────┘

After click:
┌─────────────────────────────┐
│ Notifications       [Clear All] │
├─────────────────────────────┤
│ No notifications              │
└─────────────────────────────┘
```

#### Keyboard Shortcut
```
User presses Esc key
     ↓
Global key handler catches event
     ↓
Calls clearNotifications()
     ↓
All notifications dismissed
```

#### Programmatic Clear
```
Error recovery function
     ↓
Clear old error notifications
     ↓
Call clearNotifications()
     ↓
Display new error or success message
```

### State Transition

**Before Clear**
```typescript
{
  notifications: [
    { id: '1', type: 'success', title: 'Saved' },
    { id: '2', type: 'warning', title: 'Low stock' },
    { id: '3', type: 'info', title: 'Report ready' }
  ]
}
```

**After Clear**
```typescript
{
  notifications: []
}
```

### Performance Considerations

**Single Operation**
- One state update
- No iteration over notifications
- Instant array replacement
- Efficient and fast

**Memory Cleanup**
- All notification objects released
- Garbage collection handles cleanup
- Timeout references cleared
- No memory leaks

### User Experience

**Visual Feedback**
- Fade out animation for all notifications
- Smooth transition to empty state
- "No notifications" placeholder appears
- Clear and immediate feedback

**When to Use**
- Multiple unimportant notifications accumulated
- User wants fresh start
- Context change (page navigation)
- Error recovery scenarios

### Expected Outcome
- Complete notification queue clearance
- All timeouts cleared
- Single atomic state update
- Clean empty state

### Verification Checklist
- [ ] clearNotifications method added to UIActions
- [ ] Method has no parameters
- [ ] notifications array set to empty
- [ ] All timeouts cleared (if stored)
- [ ] State updated atomically
- [ ] Single state update operation
- [ ] Method works regardless of queue size
- [ ] No errors on empty array
- [ ] Immer used for state updates

---

## Task 29: Define CommandPalette State

### Overview
Define the command palette state structure for managing the visibility of the keyboard-driven command interface. The command palette provides quick access to actions, navigation, and search functionality through keyboard shortcuts, enhancing power user productivity.

### Dependencies
- Task 15: Create UI Store
- UIStore file exists

### Instructions

1. **Add commandPalette object to UIState**
   - Nested state organization
   - Clear state grouping
   - Type-safe structure

2. **Add isOpen property**
   - Type: boolean
   - Default value: false
   - Indicates if palette is visible
   - Controls modal display

3. **Consider search query (optional)**
   - Type: string
   - Stores current search/filter text
   - Optional enhancement
   - Cleared on close

4. **Consider recent commands (optional)**
   - Type: array of strings
   - Tracks recently used commands
   - Enhances user experience
   - Limited to recent 5-10

5. **Add TypeScript interface**
   - Define CommandPaletteState interface
   - Export for type safety
   - Document properties
   - Use in UIState

### Command Palette State Structure

**Minimal State (Required)**
```typescript
commandPalette: {
  isOpen: boolean  // Default: false
}
```

**Extended State (Optional)**
```typescript
commandPalette: {
  isOpen: boolean,           // Palette visibility
  searchQuery: string,       // Current search text
  recentCommands: string[],  // Recently used commands
  selectedIndex: number      // Keyboard navigation index
}
```

### Command Palette Purpose

**What is a Command Palette?**
- Keyboard-driven interface
- Quick action access
- Search-based navigation
- Power user tool
- Inspired by VSCode, Sublime Text

**Key Features**
- Fuzzy search
- Keyboard shortcuts
- Recent commands
- Action execution
- Navigation shortcuts

### Command Palette Workflow

```
User presses Cmd/Ctrl+K
         ↓
  toggleCommandPalette()
         ↓
  isOpen = true
         ↓
  Palette modal appears
         ↓
  User types search query
         ↓
  Results filtered/ranked
         ↓
  User selects command (Enter)
         ↓
  Command executes
         ↓
  Palette closes (isOpen = false)
```

### State Properties

| Property | Type | Required | Default | Purpose |
|----------|------|----------|---------|---------|
| isOpen | boolean | Yes | false | Palette visibility |
| searchQuery | string | Optional | '' | Current search text |
| recentCommands | string[] | Optional | [] | Command history |
| selectedIndex | number | Optional | 0 | Keyboard selection |

### Command Palette Use Cases

#### Quick Navigation
**User Action:** Open palette, type "cust"  
**Result:** Filtered commands show "Customers", "Customer Orders"  
**Selection:** User selects "Customers"  
**Effect:** Navigate to Customers page

#### Action Execution
**User Action:** Open palette, type "add prod"  
**Result:** Shows "Add Product" command  
**Selection:** User presses Enter  
**Effect:** Product creation modal opens

#### Settings Access
**User Action:** Open palette, type "theme"  
**Result:** Shows "Change Theme" command  
**Selection:** User selects command  
**Effect:** Theme picker appears

#### Recent Commands
**User Action:** Open palette (empty search)  
**Result:** Shows recently used commands  
**Selection:** User selects recent command  
**Effect:** Command re-executes

### Keyboard Shortcuts

**Primary Shortcut**
- Windows/Linux: Ctrl + K
- macOS: Cmd + K
- Global shortcut
- Works from any page

**Alternative Shortcuts**
- Ctrl/Cmd + P (navigation focus)
- Ctrl/Cmd + Shift + P (command focus)
- Esc to close

### Visual Representation

```
Command Palette Modal (Centered Overlay)
┌────────────────────────────────────────────┐
│  🔍 Search commands...                     │  ← Search input
├────────────────────────────────────────────┤
│  ⚡ Recent                                  │
│  → Navigate to Customers                   │
│  → Add New Product                         │
│                                            │
│  📋 Navigation                             │
│  → Dashboard                               │
│  → Products                                │
│  → Customers                               │
│  → Orders                                  │
│                                            │
│  ⚙️ Actions                                │
│  → Change Theme                            │
│  → Open Settings                           │
└────────────────────────────────────────────┘
```

### Command Categories

| Category | Icon | Examples |
|----------|------|----------|
| Navigation | → | Go to Dashboard, View Products |
| Actions | ⚡ | Add Product, Create Order |
| Settings | ⚙️ | Change Theme, User Preferences |
| Search | 🔍 | Search Products, Find Customer |
| Recent | 📋 | Recently used commands |

### State Management Strategy

**When to Open**
- Keyboard shortcut triggered
- User clicks command palette button
- Specific action requires command selection

**When to Close**
- User presses Esc
- User selects command
- User clicks outside modal
- User navigates to different page

**State Persistence**
- isOpen: Never persisted (always start closed)
- recentCommands: Persist in localStorage
- searchQuery: Never persisted (always start empty)

### Integration with Other UI State

**Modal Interaction**
- Command palette is a modal
- Closes other modals when opened
- Has highest z-index
- Blocks interaction with background

**Sidebar Interaction**
- Can navigate to sidebar items
- Sidebar highlights selected item
- Command palette can toggle sidebar

**Theme Interaction**
- Theme commands in palette
- Execute theme changes
- Show current theme in results

### Expected Outcome
- Clean command palette state structure
- Boolean visibility control
- Foundation for keyboard navigation
- Scalable for future enhancements

### Verification Checklist
- [ ] commandPalette object added to UIState
- [ ] isOpen property defined (boolean)
- [ ] Default value set to false
- [ ] TypeScript interface defined (if applicable)
- [ ] State structure documented
- [ ] Optional properties considered
- [ ] Integration points identified

---

## Task 30: Create toggleCommandPalette Action

### Overview
Create the toggleCommandPalette action that controls the visibility of the command palette modal. This action enables keyboard shortcut integration and provides a simple mechanism to show and hide the command interface, enhancing application navigation and action access.

### Dependencies
- Task 29: Define CommandPalette State
- commandPalette state exists

### Instructions

1. **Add toggleCommandPalette method to UIActions**
   - No parameters (simple toggle)
   - Flips isOpen state
   - Type-safe implementation

2. **Define method signature**
   - No parameters
   - No return value (void)
   - Simple toggle operation

3. **Implement toggle logic**
   - Read current isOpen value
   - Set to opposite value
   - Use immer for immutability
   - Atomic state update

4. **Consider open action (optional)**
   - Separate openCommandPalette method
   - Explicitly set isOpen = true
   - More control in components

5. **Consider close action (optional)**
   - Separate closeCommandPalette method
   - Explicitly set isOpen = false
   - Clean state management

6. **Clear search query on close (optional)**
   - If searchQuery state exists
   - Reset to empty string on close
   - Fresh state for next open

7. **Clear selection index on close (optional)**
   - If selectedIndex state exists
   - Reset to 0 on close
   - Start at top of list

8. **Handle keyboard shortcut integration**
   - Document shortcut (Cmd/Ctrl+K)
   - Integrate with global key handler
   - Works from any component

### Toggle Implementation

```
toggleCommandPalette() called
         ↓
  Read current isOpen value
         ↓
  Calculate new value (!isOpen)
         ↓
  [Closing (isOpen → false)?] ──Yes→ Clear search query
         │                               Clear selection
         No
         ↓
  Update isOpen state
         ↓
  Palette visibility changes
```

### Method Signature

**Toggle Method**
```typescript
toggleCommandPalette: () => void
```

**Optional Explicit Methods**
```typescript
openCommandPalette: () => void
closeCommandPalette: () => void
```

### Action Variants

**Toggle Approach (Simpler)**
```
Single method
Flips state
Keyboard shortcut → toggle
Component button → toggle
```

**Explicit Approach (More Control)**
```
Two methods (open, close)
Explicit state control
Keyboard shortcut → toggle logic in handler
Close button → closeCommandPalette()
Open button → openCommandPalette()
```

### State Transitions

**Opening Command Palette**
```
Before: { commandPalette: { isOpen: false } }
        ↓
Call toggleCommandPalette()
        ↓
After: { commandPalette: { isOpen: true } }
        ↓
Modal appears with animation
```

**Closing Command Palette**
```
Before: { commandPalette: { isOpen: true, searchQuery: 'prod' } }
        ↓
Call toggleCommandPalette()
        ↓
After: { commandPalette: { isOpen: false, searchQuery: '' } }
        ↓
Modal fades out
```

### Keyboard Shortcut Integration

**Global Key Handler Setup**
```
useEffect on root component
     ↓
Register Cmd/Ctrl+K handler
     ↓
Prevent default browser behavior
     ↓
Call toggleCommandPalette()
     ↓
Palette opens/closes
```

**Keyboard Event Details**
- Event: keydown
- Keys: (Meta OR Control) + K
- PreventDefault: Yes
- Bubbling: No (stopPropagation)

**Cross-Platform Support**
```
macOS:
  Meta (Cmd) + K

Windows/Linux:
  Control + K

Detection:
  if (event.metaKey || event.ctrlKey) && event.key === 'k'
```

### Component Integration

**Header Component**
```
Command palette button in header
     ↓
onClick handler
     ↓
Call toggleCommandPalette()
     ↓
Palette appears
```

**Command Palette Component**
```
Modal component
     ↓
Read isOpen from store
     ↓
Render when isOpen === true
     ↓
Listen for Esc key
     ↓
Call toggleCommandPalette() to close
```

**Outside Click Handler**
```
User clicks outside palette
     ↓
onClickOutside event
     ↓
Call toggleCommandPalette()
     ↓
Palette closes
```

### Usage Examples

#### Simple Toggle
```
User presses Cmd+K
     ↓
Global handler calls toggleCommandPalette()
     ↓
Palette state: isOpen = !isOpen
     ↓
Palette appears or disappears
```

#### Open from Button
```
User clicks search icon in header
     ↓
onClick calls toggleCommandPalette()
     ↓
Palette opens (isOpen = true)
     ↓
User can search/navigate
```

#### Close on Escape
```
Palette is open
     ↓
User presses Esc key
     ↓
Palette's key handler calls toggleCommandPalette()
     ↓
Palette closes (isOpen = false)
```

#### Close on Command Selection
```
Palette is open
     ↓
User selects a command
     ↓
Command executes
     ↓
Call toggleCommandPalette()
     ↓
Palette closes
```

### Additional State Management

**Search Query Reset**
```
On close (isOpen becomes false):
  - Clear searchQuery to ''
  - Reset filtered results
  - Fresh state for next open
```

**Selection Index Reset**
```
On close:
  - Reset selectedIndex to 0
  - Next open starts at top
  - Consistent behavior
```

**Recent Commands Update**
```
On command execution:
  - Add command to recentCommands
  - Limit to 5-10 most recent
  - Persist to localStorage
```

### Modal Behavior

**Focus Management**
- Auto-focus search input on open
- Trap focus within modal
- Return focus to trigger on close

**Overlay Interaction**
- Click overlay to close
- Backdrop prevents body scroll
- High z-index (above other modals)

**Animation**
- Fade in/out animation
- Scale animation (optional)
- Smooth transitions
- 200-300ms duration

### Accessibility Considerations

**Keyboard Navigation**
- Tab through commands
- Arrow keys for selection
- Enter to execute
- Esc to close

**ARIA Attributes**
- role="dialog"
- aria-modal="true"
- aria-label="Command Palette"
- aria-describedby for instructions

**Screen Reader Support**
- Announce when opened
- Announce selected command
- Announce command count
- Clear feedback

### Performance Considerations

**State Updates**
- Single state update on toggle
- No unnecessary re-renders
- Efficient state changes

**Component Mounting**
- Lazy load command palette component
- Mount only when needed
- Unmount on close (optional)
- Reduce initial bundle size

### Expected Outcome
- Functional command palette toggle
- Keyboard shortcut integration
- Clean state management
- Smooth user experience

### Verification Checklist
- [ ] toggleCommandPalette method added to UIActions
- [ ] Method toggles isOpen state
- [ ] State update is atomic
- [ ] Search query cleared on close (if applicable)
- [ ] Selection index reset on close (if applicable)
- [ ] Optional open/close methods considered
- [ ] Keyboard shortcut integration documented
- [ ] Immer used for state updates
- [ ] No parameters required
- [ ] Method is type-safe

---

## Summary

This document completed the UI state store by implementing notification management and command palette state:

### Completed Features
- ✅ Notification state structure with full type definitions
- ✅ addNotification action with ID generation and auto-dismiss
- ✅ removeNotification action with timeout cleanup
- ✅ clearNotifications action for bulk dismissal
- ✅ Command palette state with visibility control
- ✅ toggleCommandPalette action for keyboard-driven interface

### Key Achievements

1. **Notification System** - Complete notification queue management
2. **Auto-Dismiss** - Type-based duration with timeout management
3. **Queue Management** - Limited to 5 notifications, oldest removed first
4. **Action Support** - Notifications can include interactive actions
5. **Clean Removal** - ID-based targeting with graceful error handling
6. **Bulk Clear** - Single action to dismiss all notifications
7. **Command Palette** - Keyboard-shortcut driven navigation interface
8. **Toggle Control** - Simple state management for palette visibility

### Notification Features
- Four notification types (success, error, warning, info)
- Auto-dismiss with configurable duration
- Manual dismissal by ID
- Clear all functionality
- Queue size limiting
- Timeout cleanup
- Action buttons support

### Command Palette Features
- Boolean visibility state
- Toggle action for keyboard shortcuts
- Foundation for fuzzy search
- Support for recent commands
- Integration with global shortcuts
- Modal behavior management

### State Management Patterns
- Immer for immutability
- Atomic state updates
- Type-safe actions
- Clean state transitions
- No persistence for transient state

### Integration Points
- Notification components can consume notification array
- Command palette modal reads isOpen state
- Global keyboard handler triggers toggle
- Components can add/remove notifications easily

### Next Steps
With the UI state store complete, proceed to Group C for auth state management, implementing user authentication state, login/logout actions, and session management.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~950
