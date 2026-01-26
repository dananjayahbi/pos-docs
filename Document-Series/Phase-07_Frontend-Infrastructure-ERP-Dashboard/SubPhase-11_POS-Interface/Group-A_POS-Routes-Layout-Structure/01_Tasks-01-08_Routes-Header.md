# Tasks 01-08: Routes, Layout & Header

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** A - POS Routes & Layout Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Panels-Context-Verify.md](02_Tasks-09-16_Panels-Context-Verify.md)

---

## Document Overview

This document covers the foundational POS route structure, full-screen layout configuration, and header component creation with exit functionality and shift status display.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create POS Route Directory | Low |
| 02 | Create POS Layout | Medium |
| 03 | Create POS Page Route | Low |
| 04 | Create POS Loading State | Low |
| 05 | Create POS Error Boundary | Low |
| 06 | Create POS Header Component | Medium |
| 07 | Create Exit POS Button | Low |
| 08 | Create Shift Status Display | Low |

---

## Task 01: Create POS Route Directory

### Overview
Establish the dedicated POS route directory structure using Next.js App Router with a route group to enable full-screen layout separate from the main ERP dashboard.

### Dependencies
- SubPhase-07: ERP Dashboard Foundation (main app structure)
- SubPhase-01: Next.js frontend project initialized

### Instructions

1. **Create POS route group directory**
   - Navigate to `frontend/app/` directory
   - Create new directory named `(pos)/` with parentheses
   - Parentheses indicate a route group (URL path won't include "pos")

2. **Create POS terminal route**
   - Inside `(pos)/`, create `pos/` directory
   - This will be accessible at `/pos` URL path
   - Route group allows dedicated layout without affecting URL

3. **Document route purpose**
   - Add README.md in `(pos)/` directory
   - Describe: "POS Terminal Route Group - Full-screen layout for point of sale operations"
   - Note: Separate from main ERP navigation

4. **Plan route structure**
   - Prepare for POS-specific routes:
     - `/pos` - Main POS terminal
     - Future: `/pos/history`, `/pos/reports`

5. **Verify route accessibility**
   - Route group structure allows:
     - Dedicated layout for POS
     - URL remains clean: `/pos` not `/(pos)/pos`
     - Independent from sidebar navigation

### Expected Directory Structure
```
frontend/app/
├── (dashboard)/          # Main ERP routes with sidebar
├── (pos)/                # POS routes with full-screen layout
│   └── pos/              # Main POS terminal route
└── layout.tsx            # Root layout
```

### Route Group Benefits

| Feature | Standard Route | Route Group |
|---------|----------------|-------------|
| URL Path | `/pos/pos/page` | `/pos` |
| Layout Isolation | No | Yes |
| Navigation | Shared | Independent |

### Verification Checklist
- [ ] `(pos)/` directory exists in `frontend/app/`
- [ ] `pos/` directory exists inside `(pos)/`
- [ ] README.md documents route group purpose
- [ ] Route structure follows Next.js conventions
- [ ] Path will resolve to `/pos` URL

---

## Task 02: Create POS Layout

### Overview
Create a dedicated full-screen layout for the POS route group that removes the standard ERP sidebar and provides maximum screen space for POS operations.

### Dependencies
- Task 01: Create POS Route Directory

### Instructions

1. **Create layout file**
   - Create `layout.tsx` in `(pos)/` directory
   - This layout applies to all routes within the POS group

2. **Define layout metadata**
   - Set page title: "POS Terminal"
   - Set description for SEO/browser tab
   - Define viewport settings for optimal display

3. **Create full-screen layout structure**
   - Remove sidebar/navigation components
   - Use 100vh height for full vertical screen
   - Set background color suitable for POS operations
   - Ensure no scrollbars on main layout

4. **Add layout container styling**
   - Use flexbox or grid for structure
   - Vertical layout: header at top, content fills remaining space
   - Prevent overflow on main container
   - Consider dark mode support

5. **Define children rendering**
   - Render children in main content area
   - Content area should be scrollable independently
   - Maintain header visibility at all times

6. **Add error boundary wrapper**
   - Wrap children in error boundary component
   - Provide fallback UI for unexpected errors
   - Log errors for debugging

### Layout Structure Diagram
```
┌─────────────────────────────────────────────────┐
│ POS Layout (Full Screen)                        │
│ ┌───────────────────────────────────────────┐   │
│ │ Header (Fixed)                            │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│ ┌───────────────────────────────────────────┐   │
│ │                                           │   │
│ │ Content Area (Scrollable)                 │   │
│ │ - POS Terminal Page                       │   │
│ │ - Other POS routes                        │   │
│ │                                           │   │
│ └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Layout Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Height | 100vh | Full viewport height |
| Sidebar | None | Maximizes POS space |
| Navigation | Minimal | Focus on transactions |
| Background | Neutral | Reduces eye strain |

### Expected File Structure
```typescript
// File: frontend/app/(pos)/layout.tsx

// Imports
// Metadata export
// Layout component
//   - Full-screen container
//   - Error boundary
//   - Children rendering
```

### Verification Checklist
- [ ] `layout.tsx` exists in `(pos)/` directory
- [ ] Layout uses 100vh height
- [ ] No sidebar components included
- [ ] Header area reserved at top
- [ ] Content area fills remaining space
- [ ] Error boundary wraps children
- [ ] Metadata configured for POS

---

## Task 03: Create POS Page Route

### Overview
Create the main POS terminal page that serves as the entry point for all point of sale operations, housing the product search, cart, and payment interfaces.

### Dependencies
- Task 02: Create POS Layout

### Instructions

1. **Create page file**
   - Create `page.tsx` in `pos/` directory
   - This renders at `/pos` route
   - Main component for POS terminal

2. **Define page metadata**
   - Set page title: "POS Terminal"
   - Add description for accessibility
   - Configure robots meta (noindex for internal app)

3. **Create page component structure**
   - Use async server component or client component
   - Client component if using React hooks
   - Add 'use client' directive if needed

4. **Add main container structure**
   - Create main wrapper div
   - Set minimum height to fill available space
   - Add appropriate padding and spacing

5. **Plan component hierarchy**
   - Page will contain:
     - POS Header (from Task 06)
     - Main Container with Product/Cart panels (Task 09)
     - Context providers (Task 12)

6. **Add accessibility features**
   - Set main landmark role
   - Add aria-label for screen readers
   - Ensure keyboard navigation support

7. **Configure initial state**
   - Add client-side state management setup
   - Connect to POS context (will be added in Task 12)
   - Prepare for data fetching

### Page Structure Diagram
```
┌─────────────────────────────────────────────────┐
│ POS Page Component                              │
│                                                 │
│ ┌───────────────────────────────────────────┐   │
│ │ POS Header                                │   │
│ │ - Exit Button | Shift Status              │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│ ┌───────────────────────────────────────────┐   │
│ │ Main Container (Two Columns)              │   │
│ │ ┌─────────────┐ ┌─────────────────────┐   │   │
│ │ │  Product    │ │  Cart               │   │   │
│ │ │  Panel      │ │  Panel              │   │   │
│ │ │             │ │                     │   │   │
│ │ │  (Left)     │ │  (Right)            │   │   │
│ │ └─────────────┘ └─────────────────────┘   │   │
│ └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Expected File Structure
```typescript
// File: frontend/app/(pos)/pos/page.tsx

// Imports
// Metadata (if server component)
// POS page component
//   - Main container
//   - Component placeholders
//   - Accessibility attributes
```

### Verification Checklist
- [ ] `page.tsx` exists in `pos/` directory
- [ ] Component exported as default
- [ ] Main container structure defined
- [ ] Accessibility attributes added
- [ ] Client/server component type decided
- [ ] Ready to receive child components

---

## Task 04: Create POS Loading State

### Overview
Create a loading state component that displays while the POS page and its dependencies are being fetched, providing visual feedback to users during initial load.

### Dependencies
- Task 01: Create POS Route Directory

### Instructions

1. **Create loading file**
   - Create `loading.tsx` in `pos/` directory
   - Next.js automatically shows this during page load
   - Wraps page in Suspense boundary

2. **Design loading UI**
   - Create centered loading indicator
   - Use spinner or skeleton screen
   - Match POS interface styling
   - Maintain full-screen layout

3. **Add loading message**
   - Display "Loading POS Terminal..." text
   - Use appropriate font size
   - Center text below spinner

4. **Style loading container**
   - Full viewport height (100vh)
   - Flexbox centering
   - Background matches POS theme
   - Smooth appearance transition

5. **Add loading animation**
   - Use CSS animation for spinner
   - Rotate or pulse effect
   - Smooth, non-distracting motion
   - Accessible (respects prefers-reduced-motion)

6. **Consider loading timeout**
   - Note: Actual timeout handled by Next.js
   - Document expected load time
   - Plan for error state transition

### Loading UI Options

| Type | Use Case | Complexity |
|------|----------|------------|
| Spinner | Quick loads | Low |
| Skeleton | Showing structure | Medium |
| Progress Bar | Known load steps | High |

### Loading State Diagram
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│            ┌───────────────────┐                │
│            │                   │                │
│            │   ◐  Loading...   │                │
│            │                   │                │
│            │  Loading POS      │                │
│            │  Terminal         │                │
│            │                   │                │
│            └───────────────────┘                │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Expected File Structure
```typescript
// File: frontend/app/(pos)/pos/loading.tsx

// Imports
// Loading component
//   - Centered container
//   - Spinner animation
//   - Loading message
```

### Verification Checklist
- [ ] `loading.tsx` exists in `pos/` directory
- [ ] Loading UI is centered
- [ ] Spinner or skeleton displayed
- [ ] Loading message clear
- [ ] Animation smooth
- [ ] Respects reduced motion preference
- [ ] Matches POS theme

---

## Task 05: Create POS Error Boundary

### Overview
Create an error boundary component that gracefully handles runtime errors in the POS interface, preventing complete application crashes and providing recovery options.

### Dependencies
- Task 01: Create POS Route Directory

### Instructions

1. **Create error file**
   - Create `error.tsx` in `pos/` directory
   - Must be a client component ('use client')
   - Automatically catches errors in page and children

2. **Define error component props**
   - Accept `error` prop (Error object)
   - Accept `reset` function prop
   - TypeScript types for props

3. **Design error UI**
   - Clear error heading: "Something went wrong"
   - User-friendly error message (avoid technical jargon)
   - Centered, full-screen layout
   - Consistent with POS styling

4. **Add error details section**
   - Display sanitized error message
   - Show only in development mode
   - Hide technical details in production
   - Include error timestamp

5. **Create recovery actions**
   - Add "Try Again" button
   - Button calls reset() function
   - Add "Return to Dashboard" link
   - Add "Report Issue" option

6. **Log error for debugging**
   - Console.error in development
   - Send to error tracking service in production
   - Include user context and state
   - Respect privacy (no sensitive data)

7. **Add fallback navigation**
   - Ensure user can exit POS
   - Provide clear path back to safety
   - Don't trap user in error state

### Error Recovery Flow
```
Error Occurs
    │
    ▼
Error Boundary Catches
    │
    ▼
Display Error UI
    │
    ├──► "Try Again" → reset() → Retry render
    ├──► "Dashboard" → Navigate away
    └──► "Report" → Log to service
```

### Error UI Layout
```
┌─────────────────────────────────────────────────┐
│                                                 │
│            ┌───────────────────┐                │
│            │        ⚠️         │                │
│            │                   │                │
│            │ Something went    │                │
│            │ wrong             │                │
│            │                   │                │
│            │ [Try Again]       │                │
│            │ [Return to        │                │
│            │  Dashboard]       │                │
│            │                   │                │
│            └───────────────────┘                │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Expected File Structure
```typescript
// File: frontend/app/(pos)/pos/error.tsx

// 'use client' directive
// Imports
// Error component with props
//   - Error UI container
//   - Error message display
//   - Recovery action buttons
//   - Error logging
```

### Verification Checklist
- [ ] `error.tsx` exists in `pos/` directory
- [ ] 'use client' directive at top
- [ ] Props typed correctly (error, reset)
- [ ] Error UI user-friendly
- [ ] Try Again button functional
- [ ] Return to Dashboard link works
- [ ] Errors logged appropriately
- [ ] Technical details hidden in production

---

## Task 06: Create POS Header Component

### Overview
Create the main POS header component that spans the top of the terminal, providing essential controls and information including exit functionality and shift status.

### Dependencies
- Task 02: Create POS Layout

### Instructions

1. **Create header component file**
   - Create `Header/` directory in `components/modules/pos/`
   - Create `POSHeader.tsx` in Header directory
   - Export as client component ('use client')

2. **Define header structure**
   - Full-width container
   - Fixed height (e.g., 64px)
   - Horizontal layout with space-between
   - Border bottom for visual separation

3. **Add left section**
   - POS Terminal title/logo
   - Show tenant/company name
   - Display current date/time (live updating)

4. **Add center section**
   - Optional notification area
   - Connection status indicator
   - Shift information placeholder

5. **Add right section**
   - Exit POS button (Task 07)
   - Shift status display (Task 08)
   - User avatar/name
   - Quick actions menu

6. **Style header appropriately**
   - Background color distinct from content
   - Adequate padding and spacing
   - Ensure touch-friendly button sizes
   - Responsive for different screen widths

7. **Add accessibility features**
   - Proper semantic HTML (header tag)
   - ARIA labels for screen readers
   - Keyboard navigation support
   - Focus indicators

### Header Layout Diagram
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────┐   ┌───────────┐   ┌──────────────────────┐ │
│ │ Left        │   │ Center    │   │ Right                │ │
│ │             │   │           │   │                      │ │
│ │ • Logo      │   │ • Shift   │   │ • Shift Status       │ │
│ │ • Time      │   │   Info    │   │ • Exit Button        │ │
│ │ • Date      │   │ • Status  │   │ • User Menu          │ │
│ └─────────────┘   └───────────┘   └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Header Sections

| Section | Content | Alignment |
|---------|---------|-----------|
| Left | Branding, Time | Left |
| Center | Shift Info, Status | Center |
| Right | Exit, User Menu | Right |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Header/POSHeader.tsx

// 'use client' directive
// Imports
// POSHeader component
//   - Header container
//   - Left section
//   - Center section
//   - Right section
```

### Verification Checklist
- [ ] `Header/` directory exists in `components/modules/pos/`
- [ ] `POSHeader.tsx` created
- [ ] Three-section layout implemented
- [ ] Full-width header container
- [ ] Appropriate height and padding
- [ ] Styling matches POS theme
- [ ] Accessibility attributes present
- [ ] Component exported properly

---

## Task 07: Create Exit POS Button

### Overview
Create the Exit POS button with confirmation dialog to prevent accidental exits during active transactions, ensuring cashiers can safely return to the main dashboard.

### Dependencies
- Task 06: Create POS Header Component

### Instructions

1. **Create exit button component**
   - Create `ExitPOSButton.tsx` in Header directory
   - Use client component for interaction
   - Add to right section of POSHeader

2. **Design button UI**
   - Clear "Exit POS" label
   - Use icon (e.g., door/logout icon)
   - Prominent but not intrusive
   - Touch-friendly size (min 44x44px)

3. **Add click handler**
   - Open confirmation dialog on click
   - Check if active transaction in progress
   - Prevent accidental exits

4. **Create confirmation dialog**
   - Ask: "Exit POS Terminal?"
   - Warning: "Active transaction will be held"
   - Two options: "Cancel" and "Exit"
   - Modal overlay to focus attention

5. **Implement exit logic**
   - Check for unsaved cart state
   - Offer to hold/save current transaction
   - Clear appropriate session data
   - Navigate to dashboard route

6. **Add keyboard shortcut**
   - Register Escape key handler
   - Respect dialog focus trapping
   - Document shortcut in UI

7. **Handle edge cases**
   - Cart not empty: require confirmation
   - Cart empty: exit directly
   - Payment in progress: block exit
   - Network offline: allow exit with warning

### Exit Confirmation Flow
```
Click Exit Button
    │
    ▼
Check Cart Status
    │
    ├─── Cart Empty ──────────► Exit Immediately
    │
    └─── Cart Has Items
            │
            ▼
        Show Dialog
            │
            ├─── Cancel ────────► Stay in POS
            │
            └─── Confirm
                    │
                    ├─► Hold Sale ──► Exit
                    └─► Clear Sale ──► Exit
```

### Confirmation Dialog Layout
```
┌─────────────────────────────────────┐
│ Exit POS Terminal?                  │
│                                     │
│ You have items in the cart.         │
│ The current sale will be held.      │
│                                     │
│         [ Cancel ]  [ Exit ]        │
└─────────────────────────────────────┘
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Header/ExitPOSButton.tsx

// 'use client' directive
// Imports
// ExitPOSButton component
//   - Button UI
//   - Click handler
//   - Confirmation dialog
//   - Exit logic
```

### Verification Checklist
- [ ] `ExitPOSButton.tsx` created
- [ ] Button visible in header
- [ ] Icon and label clear
- [ ] Click opens confirmation
- [ ] Dialog displays correctly
- [ ] Cancel button works
- [ ] Exit navigates to dashboard
- [ ] Cart state checked before exit
- [ ] Keyboard shortcut implemented

---

## Task 08: Create Shift Status Display

### Overview
Create the shift status display component that shows current shift information, including shift status, opening time, and cashier name, providing context for all POS operations.

### Dependencies
- Task 06: Create POS Header Component

### Instructions

1. **Create shift status component**
   - Create `ShiftStatus.tsx` in Header directory
   - Use client component for real-time updates
   - Add to center or right section of POSHeader

2. **Define shift status states**
   - No Active Shift: Gray/inactive state
   - Shift Open: Green/active state
   - Shift Paused: Yellow/warning state
   - Display different UI for each state

3. **Display shift information**
   - Shift status badge (Open/Closed)
   - Cashier name
   - Shift start time
   - Duration (elapsed time)

4. **Add visual indicators**
   - Status dot with color coding
   - Icon representing current state
   - Badge or pill styling
   - Clear typography

5. **Implement click interaction**
   - Click to show detailed shift info
   - Popover or dropdown with:
     - Opening cash amount
     - Number of transactions
     - Total sales amount
     - Option to close shift

6. **Handle no-shift state**
   - Display "No Active Shift" message
   - Show "Open Shift" button
   - Prevent POS operations until shift opened
   - Redirect to shift open modal

7. **Add real-time updates**
   - Update duration timer every minute
   - Reflect shift changes immediately
   - Sync with server state periodically

### Shift Status States

| State | Color | Icon | Display |
|-------|-------|------|---------|
| No Shift | Gray | ○ | "No Active Shift" |
| Shift Open | Green | ● | "Shift Open - HH:MM" |
| Shift Paused | Yellow | ◐ | "Shift Paused" |

### Shift Status Layout
```
┌───────────────────────────────────┐
│ ● Shift Open                      │
│ Cashier: John Doe                 │
│ Started: 09:30 AM (2h 15m ago)    │
│                                   │
│ [ View Details ]                  │
└───────────────────────────────────┘
```

### Shift Info Popover
```
┌────────────────────────────────────┐
│ Shift Details                      │
│                                    │
│ Status: Open                       │
│ Cashier: John Doe                  │
│ Started: 09:30 AM                  │
│ Duration: 2h 15m                   │
│                                    │
│ Opening Cash: LKR 5,000.00         │
│ Transactions: 23                   │
│ Total Sales: LKR 45,230.00         │
│                                    │
│ [ Close Shift ]                    │
└────────────────────────────────────┘
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Header/ShiftStatus.tsx

// 'use client' directive
// Imports
// ShiftStatus component
//   - Status badge
//   - Shift information
//   - Click handler
//   - Info popover
//   - Timer update logic
```

### Verification Checklist
- [ ] `ShiftStatus.tsx` created
- [ ] Status states defined
- [ ] Visual indicators clear
- [ ] Shift info displays correctly
- [ ] Click interaction works
- [ ] Popover shows detailed info
- [ ] No-shift state handled
- [ ] Duration timer updates
- [ ] Color coding appropriate
- [ ] Component responsive

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create POS Route Directory | `(pos)/pos/` route structure |
| 02 | Create POS Layout | Full-screen layout without sidebar |
| 03 | Create POS Page Route | Main POS terminal page |
| 04 | Create POS Loading State | Loading UI for page initialization |
| 05 | Create POS Error Boundary | Error handling with recovery options |
| 06 | Create POS Header Component | Header container with sections |
| 07 | Create Exit POS Button | Exit button with confirmation |
| 08 | Create Shift Status Display | Shift information and status |

### Current Progress
```
frontend/
├── app/
│   └── (pos)/
│       ├── layout.tsx           # Task 02 ✓
│       └── pos/
│           ├── page.tsx         # Task 03 ✓
│           ├── loading.tsx      # Task 04 ✓
│           └── error.tsx        # Task 05 ✓
└── components/
    └── modules/
        └── pos/
            └── Header/
                ├── POSHeader.tsx      # Task 06 ✓
                ├── ExitPOSButton.tsx  # Task 07 ✓
                └── ShiftStatus.tsx    # Task 08 ✓
```

### POS Header Status
✓ **Completed Components:**
- POS route directory with layout
- Page, loading, and error states
- Header container with three sections
- Exit button with confirmation dialog
- Shift status display with popover

⏳ **Pending (Next Document):**
- Main container with two-column layout (Task 09)
- Product panel (Task 10)
- Cart panel (Task 11)
- POS context provider (Tasks 12-13)
- Offline indicator (Task 14)
- Keyboard shortcuts (Task 15)
- Route verification (Task 16)

### Next Steps
Proceed to [02_Tasks-09-16_Panels-Context-Verify.md](02_Tasks-09-16_Panels-Context-Verify.md) to create the main panel layout, context provider, and complete the POS foundation.

---

## Notes for AI Agents

1. **Route Groups:** Use parentheses `(pos)` for layout isolation without affecting URL structure
2. **Full Screen:** Remove all ERP navigation elements for dedicated POS experience
3. **Error Boundaries:** Always provide recovery options and clear navigation paths
4. **Shift Status:** POS operations should be blocked when no active shift exists
5. **Exit Confirmation:** Prevent data loss by checking cart state before exit
6. **Loading States:** Provide immediate feedback during page transitions
7. **Accessibility:** Ensure all interactive elements are keyboard navigable and screen reader friendly
8. **Next Document:** Continue with panel layout and state management setup
