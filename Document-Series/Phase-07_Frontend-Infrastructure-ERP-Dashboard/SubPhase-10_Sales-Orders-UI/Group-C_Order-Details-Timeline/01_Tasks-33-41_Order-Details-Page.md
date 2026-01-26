# Tasks 33-41: Order Details Page, Info Card, and Items

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** C - Order Details & Timeline  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-B_Order-Listing-Filters](../Group-B_Order-Listing-Filters/)
- **→ Next Document:** [02_Tasks-42-48_Timeline-Activity.md](02_Tasks-42-48_Timeline-Activity.md)

---

## Document Overview

This document covers the creation of the order details page structure, including the page layout, header with actions, status banner, order information card with customer and address sections, and order items table display. This forms the foundation for viewing complete order information in a structured, user-friendly format.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create Order Details Page | Medium | 40 min |
| 34 | Create Order Details Header | Low | 30 min |
| 35 | Create Order Status Banner | Low | 25 min |
| 36 | Create Order Actions Dropdown | Low | 30 min |
| 37 | Create Order Info Card | Medium | 35 min |
| 38 | Create Customer Info Section | Low | 20 min |
| 39 | Create Shipping Address Section | Low | 20 min |
| 40 | Create Billing Address Section | Low | 20 min |
| 41 | Create Order Items Table | Medium | 40 min |

---

## Task 33: Create Order Details Page

### Overview
Create the main order details page component that serves as the container for all order information. This page displays comprehensive order data including header, status, customer information, items, timeline, and actions. It uses a multi-column layout optimized for displaying detailed information.

### Dependencies
- Task 14: Sales module route structure
- SubPhase-06: Authentication and layout structure
- Order type definitions from backend

### Instructions

1. **Create page route file**
   - Navigate to `frontend/app/(dashboard)/orders/` directory
   - Create subdirectory `[id]/` for dynamic routing
   - Create file `page.tsx` in the [id] directory

2. **Import required dependencies**
   - Import use client directive for client component
   - Import useParams and useRouter from Next.js
   - Import Suspense and loading components
   - Import all order detail components
   - Import useOrderDetails hook from API queries

3. **Define page component structure**
   - Create OrderDetailsPage component
   - Extract order ID from URL params
   - Fetch order data using useOrderDetails hook
   - Handle loading and error states

4. **Implement page layout grid**
   - Create two-column responsive layout
   - Left column: Main content (wider, 2/3 width)
   - Right column: Sidebar (narrower, 1/3 width)
   - Stack columns on mobile devices

5. **Organize left column content**
   - Order Details Header at top
   - Order Status Banner below header
   - Order Info Card section
   - Order Items Table section
   - All sections with proper spacing

6. **Organize right column content**
   - Order Status Timeline
   - Order Notes Section
   - Payment History (if applicable)
   - Sticky positioning for better UX

7. **Add loading state**
   - Show skeleton loaders for all sections
   - Maintain layout structure during loading
   - Use Suspense boundaries for components
   - Display loading spinner or progress

8. **Add error state handling**
   - Handle 404 order not found
   - Handle permission errors
   - Display error messages clearly
   - Provide action to return to orders list

9. **Add breadcrumb navigation**
   - Show path: Sales > Orders > [Order Number]
   - Make breadcrumb items clickable
   - Highlight current page
   - Position above header

10. **Implement page metadata**
    - Set dynamic page title with order number
    - Add meta description for SEO
    - Configure Open Graph tags
    - Generate metadata server-side

11. **Add responsive design**
    - Adjust layout for tablet and mobile
    - Stack columns on small screens
    - Ensure all content is accessible
    - Optimize spacing for different viewports

12. **Implement real-time updates**
    - Set up polling for order changes
    - Show notification when order updates
    - Refresh data automatically
    - Add manual refresh button

### Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Sales > Orders > ORD-1001                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────┐  ┌──────────────────────────────┐  │
│  │ Left Column (Main)     │  │ Right Column (Sidebar)       │  │
│  │                        │  │                              │  │
│  │ ┌──────────────────┐  │  │ ┌──────────────────────────┐ │  │
│  │ │ Order Header     │  │  │ │ Status Timeline         │ │  │
│  │ │ + Actions        │  │  │ │                          │ │  │
│  │ └──────────────────┘  │  │ │ ● Draft                  │ │  │
│  │                        │  │ │ ● Confirmed              │ │  │
│  │ ┌──────────────────┐  │  │ │ ● Processing             │ │  │
│  │ │ Status Banner    │  │  │ │                          │ │  │
│  │ └──────────────────┘  │  │ └──────────────────────────┘ │  │
│  │                        │  │                              │  │
│  │ ┌──────────────────┐  │  │ ┌──────────────────────────┐ │  │
│  │ │ Order Info Card  │  │  │ │ Order Notes             │ │  │
│  │ │                  │  │  │ │                          │ │  │
│  │ │ - Customer       │  │  │ │ [Note 1]                 │ │  │
│  │ │ - Shipping       │  │  │ │ [Note 2]                 │ │  │
│  │ │ - Billing        │  │  │ │                          │ │  │
│  │ └──────────────────┘  │  │ │ [+ Add Note]             │ │  │
│  │                        │  │ └──────────────────────────┘ │  │
│  │ ┌──────────────────┐  │  │                              │  │
│  │ │ Order Items      │  │  │                              │  │
│  │ │ Table            │  │  │                              │  │
│  │ │                  │  │  │                              │  │
│  │ │ [Item 1]         │  │  │                              │  │
│  │ │ [Item 2]         │  │  │                              │  │
│  │ │ [Item 3]         │  │  │                              │  │
│  │ │                  │  │  │                              │  │
│  │ │ Totals           │  │  │                              │  │
│  │ └──────────────────┘  │  │                              │  │
│  │                        │  │                              │  │
│  └────────────────────────┘  └──────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Responsive Layout Breakpoints

| Screen Size | Layout | Column Ratio |
|-------------|--------|--------------|
| Desktop (≥1024px) | 2-column | 2:1 (66% : 33%) |
| Tablet (768-1023px) | 2-column | 3:2 (60% : 40%) |
| Mobile (<768px) | Stacked | 100% width each |

### Component Hierarchy

```
OrderDetailsPage
├── Breadcrumb
├── LoadingState (if loading)
├── ErrorState (if error)
└── DetailsLayout (if data loaded)
    ├── LeftColumn
    │   ├── OrderDetailsHeader
    │   ├── OrderStatusBanner
    │   ├── OrderInfoCard
    │   │   ├── CustomerInfoSection
    │   │   ├── ShippingAddressSection
    │   │   └── BillingAddressSection
    │   └── OrderItemsTable
    │       ├── OrderItemRow (multiple)
    │       └── OrderTotals
    └── RightColumn
        ├── OrderTimeline
        │   └── TimelineItem (multiple)
        └── OrderNotes
            └── AddNoteForm
```

### Expected Outcome
- Complete order details page structure
- Two-column responsive layout
- Proper loading and error states
- All sections properly organized
- Clean and intuitive design
- Real-time data updates

### Verification Checklist
- [ ] Page route created at `/orders/[id]`
- [ ] Dynamic ID parameter extracted
- [ ] Order data fetches correctly
- [ ] Two-column layout renders
- [ ] Left column displays main content
- [ ] Right column shows timeline/notes
- [ ] Loading state shows skeletons
- [ ] Error state displays message
- [ ] Breadcrumb navigation works
- [ ] Responsive design functions
- [ ] Metadata generates correctly

---

## Task 34: Create Order Details Header

### Overview
Create the OrderDetailsHeader component displaying the order number, status, key dates, and action buttons. This header provides quick access to important order information and primary actions like edit, print, and cancel. The header is sticky for easy access while scrolling.

### Dependencies
- Task 33: Create Order Details Page
- Order type definitions

### Instructions

1. **Create header component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `OrderDetailsHeader.tsx`
   - Set up component with TypeScript types

2. **Import required dependencies**
   - Import Button component
   - Import icons from Lucide React
   - Import Badge component for status
   - Import OrderActionsDropdown from Task 36
   - Import date formatting utilities

3. **Define component props interface**
   - Create OrderDetailsHeaderProps interface
   - Include order property of type Order
   - Include onEdit, onPrint, onCancel callbacks
   - Include isLoading optional prop

4. **Build header layout structure**
   - Create flex container with space-between
   - Left side: Order info and metadata
   - Right side: Action buttons
   - Responsive stacking on mobile

5. **Display order number**
   - Show large, prominent order number
   - Format as "Order #ORD-1001"
   - Apply bold font weight
   - Use monospace font for number

6. **Show order metadata**
   - Display creation date
   - Show last updated date
   - Display customer name
   - Format dates as "MMM dd, yyyy"

7. **Add quick status indicator**
   - Display current order status badge
   - Position next to order number
   - Use OrderStatusBadge component
   - Make it visually prominent

8. **Implement primary actions**
   - Add Edit button (primary)
   - Add Print button (outline)
   - Include OrderActionsDropdown
   - Show appropriate icons

9. **Configure action button states**
   - Disable Edit if order shipped
   - Always enable Print
   - Disable actions during loading
   - Show loading spinners when processing

10. **Add responsive behavior**
    - Stack buttons vertically on mobile
    - Reduce button sizes on small screens
    - Ensure touch-friendly targets
    - Optimize spacing for mobile

11. **Make header sticky**
    - Apply sticky positioning
    - Set z-index for proper layering
    - Add subtle shadow when scrolling
    - Maintain background color

12. **Style for visual hierarchy**
    - Large order number (text-2xl)
    - Medium metadata (text-sm)
    - Proper spacing and padding
    - Clear separation of sections

### Header Layout Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ OrderDetailsHeader (Sticky)                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────┐  ┌──────────────────────────┐  │
│  │ Left: Order Info           │  │ Right: Actions          │  │
│  │                            │  │                          │  │
│  │ Order #ORD-1001  [●]       │  │  [Edit] [Print] [⋮]     │  │
│  │ ↳ Status Badge             │  │                          │  │
│  │                            │  │                          │  │
│  │ Customer: John Doe         │  │                          │  │
│  │ Created: Jan 24, 2026      │  │                          │  │
│  │ Updated: Jan 25, 2026      │  │                          │  │
│  │                            │  │                          │  │
│  └────────────────────────────┘  └──────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Action Buttons Configuration

| Button | Icon | Variant | Show When | Action |
|--------|------|---------|-----------|--------|
| Edit | Pencil | Primary | Not shipped | Navigate to edit page |
| Print | Printer | Outline | Always | Open print dialog |
| More | MoreVertical | Ghost | Always | Show dropdown menu |

### Responsive Behavior

**Desktop (≥768px)**
```
┌──────────────────────────────────────────────┐
│ Order #ORD-1001 [●]    [Edit] [Print] [⋮]   │
│ John Doe • Jan 24, 2026                      │
└──────────────────────────────────────────────┘
```

**Mobile (<768px)**
```
┌──────────────────────────┐
│ Order #ORD-1001 [●]      │
│ John Doe                 │
│ Jan 24, 2026             │
│                          │
│ [Edit]  [Print]  [⋮]     │
└──────────────────────────┘
```

### Expected Outcome
- Clean, professional header component
- Clear display of order information
- Easy access to primary actions
- Responsive design for all screens
- Sticky behavior when scrolling
- Proper action state management

### Verification Checklist
- [ ] OrderDetailsHeader component created
- [ ] Order number displays prominently
- [ ] Status badge shows correctly
- [ ] Customer name visible
- [ ] Dates format properly
- [ ] Edit button works
- [ ] Print button triggers dialog
- [ ] Actions dropdown functions
- [ ] Buttons disable appropriately
- [ ] Header sticks on scroll
- [ ] Responsive design works
- [ ] Component properly typed

---

## Task 35: Create Order Status Banner

### Overview
Create the OrderStatusBanner component to display a prominent, full-width banner showing the current order status. This banner provides immediate visual feedback about the order state with color-coded backgrounds, icons, and status-specific messaging.

### Dependencies
- Task 34: Create Order Details Header
- OrderStatus type definitions

### Instructions

1. **Create banner component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `OrderStatusBanner.tsx`
   - Set up component structure

2. **Import required dependencies**
   - Import Alert or Banner component
   - Import status icons from Lucide React
   - Import cn utility for styling
   - Import OrderStatus type

3. **Define component props interface**
   - Create OrderStatusBannerProps interface
   - Include status property of type OrderStatus
   - Include optional message property
   - Include optional onActionClick callback

4. **Define status configurations**
   - Create statusConfig mapping object
   - For each status, define:
     - Background color
     - Text color
     - Icon component
     - Default message
     - Action button (if applicable)

5. **Configure Draft status**
   - Gray/slate background color
   - FileText icon
   - Message: "This order is in draft. Confirm to proceed."
   - Action: "Confirm Order" button

6. **Configure Confirmed status**
   - Blue background color
   - CheckCircle icon
   - Message: "Order confirmed and ready for processing."
   - Action: "Start Processing" button

7. **Configure Processing status**
   - Yellow/amber background color
   - Clock icon with pulse animation
   - Message: "Order is being prepared for shipment."
   - Action: "Mark as Shipped" button

8. **Configure Shipped status**
   - Purple/indigo background color
   - Truck icon
   - Message: "Order has been shipped and is in transit."
   - Show tracking number if available

9. **Configure Delivered status**
   - Green background color
   - Package icon with checkmark
   - Message: "Order successfully delivered to customer."
   - Action: "Request Feedback" button

10. **Configure Cancelled status**
    - Red background color
    - XCircle icon
    - Message: "This order has been cancelled."
    - Show cancellation reason if available

11. **Implement banner structure**
    - Full-width container with padding
    - Flex layout with icon, message, and action
    - Rounded corners
    - Subtle shadow or border

12. **Add icon section**
    - Position icon on the left
    - Size icon appropriately (24px)
    - Apply status-specific color
    - Add background circle (optional)

13. **Add message section**
    - Display status message prominently
    - Show additional context if provided
    - Apply readable typography
    - Allow HTML or rich text

14. **Add action button section**
    - Position on the right
    - Show status-appropriate action
    - Style button to match banner
    - Handle click events

15. **Add dismissible option**
    - Include close button (optional)
    - Store dismissed state
    - Don't show again for session
    - Respect user preference

16. **Style for accessibility**
    - Ensure color contrast meets WCAG AA
    - Add aria-live for status updates
    - Include role="alert" or "status"
    - Support screen readers

### Status Banner Configurations

| Status | Background | Icon | Message | Action Button |
|--------|-----------|------|---------|---------------|
| Draft | Gray | FileText | Order in draft | Confirm Order |
| Confirmed | Blue | CheckCircle | Order confirmed | Start Processing |
| Processing | Yellow | Clock | Being prepared | Mark as Shipped |
| Shipped | Purple | Truck | In transit | Track Order |
| Delivered | Green | Package | Successfully delivered | Request Feedback |
| Cancelled | Red | XCircle | Order cancelled | - |

### Banner Visual Examples

**Draft Status**
```
┌─────────────────────────────────────────────────────────────┐
│ 📄  This order is in draft. Confirm to proceed.  [Confirm] │
│     ↑ Gray background, dark text                            │
└─────────────────────────────────────────────────────────────┘
```

**Processing Status**
```
┌─────────────────────────────────────────────────────────────┐
│ ⏱  Order is being prepared for shipment.  [Mark Shipped]   │
│     ↑ Yellow background, amber text, pulsing icon           │
└─────────────────────────────────────────────────────────────┘
```

**Delivered Status**
```
┌─────────────────────────────────────────────────────────────┐
│ ✓  Order successfully delivered to customer. [Feedback]    │
│     ↑ Green background, dark green text                     │
└─────────────────────────────────────────────────────────────┘
```

### Banner Structure

```
OrderStatusBanner
├── Container (full-width, colored background)
│   ├── Icon Section
│   │   └── Status Icon (with optional animation)
│   ├── Message Section
│   │   ├── Primary Message
│   │   └── Secondary Info (optional)
│   └── Action Section
│       ├── Action Button (optional)
│       └── Close Button (optional)
```

### Expected Outcome
- Visually prominent status banner
- Clear status communication
- Appropriate color coding
- Actionable buttons when relevant
- Accessible design
- Smooth animations

### Verification Checklist
- [ ] OrderStatusBanner component created
- [ ] All 6 status types supported
- [ ] Correct colors for each status
- [ ] Appropriate icons display
- [ ] Messages show correctly
- [ ] Action buttons work
- [ ] Aria attributes present
- [ ] Color contrast sufficient
- [ ] Animations smooth (if any)
- [ ] Component properly typed
- [ ] Exports working

---

## Task 36: Create Order Actions Dropdown

### Overview
Create the OrderActionsDropdown component providing a comprehensive menu of actions available for the current order. This dropdown includes Edit, Print, Duplicate, Cancel, Email, and other contextual actions. Actions are enabled/disabled based on order status and user permissions.

### Dependencies
- Task 34: Create Order Details Header
- DropdownMenu component from UI library

### Instructions

1. **Create dropdown component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `OrderActionsDropdown.tsx`
   - Set up component with TypeScript

2. **Import required dependencies**
   - Import DropdownMenu components
   - Import Button component
   - Import icons from Lucide React (MoreVertical, Edit, Printer, Copy, Mail, FileText, XCircle)
   - Import useRouter for navigation
   - Import Order type

3. **Define component props interface**
   - Create OrderActionsDropdownProps interface
   - Include order property of type Order
   - Include callback functions for each action
   - Include permissions object (optional)

4. **Implement Edit action**
   - Label: "Edit Order"
   - Icon: Pencil/Edit
   - Navigate to edit page
   - Enable only if order is draft, confirmed, or processing
   - Disable if shipped or delivered

5. **Implement Print action**
   - Label: "Print Order"
   - Icon: Printer
   - Trigger browser print dialog
   - Format order for printing
   - Always enabled

6. **Implement Duplicate action**
   - Label: "Duplicate Order"
   - Icon: Copy
   - Create new order with same items
   - Navigate to new order form
   - Pre-fill with current order data
   - Always enabled

7. **Implement Email action**
   - Label: "Email to Customer"
   - Icon: Mail
   - Open email modal
   - Pre-fill customer email
   - Attach order PDF
   - Enable for confirmed+ orders

8. **Implement Invoice action**
   - Label: "Generate Invoice"
   - Icon: FileText
   - Navigate to invoice creation
   - Pre-fill from order data
   - Enable if no invoice exists

9. **Implement Cancel action**
   - Label: "Cancel Order"
   - Icon: XCircle
   - Apply destructive styling (red)
   - Show with separator above
   - Open cancel confirmation dialog
   - Disable if already cancelled
   - Disable if delivered

10. **Add dropdown trigger**
    - Use MoreVertical icon
    - Style as ghost button
    - Show as icon-only
    - Add aria-label "Order actions"

11. **Implement action handlers**
    - Create handler for each action
    - Show loading state during processing
    - Display success/error toasts
    - Close dropdown after action

12. **Add keyboard navigation**
    - Support arrow keys for navigation
    - Enter/Space to select action
    - Escape to close dropdown
    - Tab to focus next item

13. **Add tooltips for disabled items**
    - Show reason why action is disabled
    - Example: "Cannot edit shipped orders"
    - Use Tooltip component
    - Display on hover

14. **Style dropdown menu**
    - Apply consistent spacing
    - Use appropriate icon sizes
    - Add hover states
    - Separate destructive actions
    - Apply proper text colors

### Actions Availability Matrix

| Action | Draft | Confirmed | Processing | Shipped | Delivered | Cancelled |
|--------|-------|-----------|------------|---------|-----------|-----------|
| Edit | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Print | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Duplicate | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Email | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Invoice | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Cancel | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |

### Dropdown Menu Structure

```
┌─────────────────────────────┐
│ ⋮ More Actions              │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ ✏ Edit Order                │
├─────────────────────────────┤
│ 🖨 Print Order              │
├─────────────────────────────┤
│ 📋 Duplicate Order          │
├─────────────────────────────┤
│ ✉ Email to Customer         │
├─────────────────────────────┤
│ 📄 Generate Invoice         │
├─────────────────────────────┤
│ ───────────────────────────  │ (separator)
├─────────────────────────────┤
│ ✕ Cancel Order (red)        │
└─────────────────────────────┘
```

### Action Handler Flow

```
User clicks action
    │
    ▼
Validate action availability
    │
    ├─→ If disabled
    │   └─→ Show tooltip
    │       └─→ Prevent action
    │
    └─→ If enabled
        │
        ▼
    Show loading state
        │
        ▼
    Execute action
        │
        ├─→ Success
        │   ├─→ Show success toast
        │   ├─→ Update order data
        │   └─→ Close dropdown
        │
        └─→ Error
            ├─→ Show error toast
            ├─→ Reset loading state
            └─→ Keep dropdown open
```

### Expected Outcome
- Comprehensive actions dropdown
- All actions properly implemented
- Correct availability logic
- Clear visual feedback
- Smooth interactions
- Accessible menu

### Verification Checklist
- [ ] OrderActionsDropdown created
- [ ] All actions present
- [ ] Edit navigates correctly
- [ ] Print triggers dialog
- [ ] Duplicate creates new order
- [ ] Email opens modal
- [ ] Invoice navigation works
- [ ] Cancel shows confirmation
- [ ] Disabled states correct
- [ ] Tooltips display
- [ ] Keyboard navigation works
- [ ] Component properly typed

---

## Task 37: Create Order Info Card

### Overview
Create the OrderInfoCard component serving as the main container for displaying customer information, shipping address, and billing address. This card organizes key order information in a clean, three-section layout with clear visual separation.

### Dependencies
- Task 33: Create Order Details Page
- Card component from UI library

### Instructions

1. **Create info card component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `OrderInfoCard.tsx`
   - Set up component structure

2. **Import required dependencies**
   - Import Card components (Card, CardHeader, CardTitle, CardContent)
   - Import CustomerInfoSection from Task 38
   - Import ShippingAddressSection from Task 39
   - Import BillingAddressSection from Task 40
   - Import Order type

3. **Define component props interface**
   - Create OrderInfoCardProps interface
   - Include order property of type Order
   - Include onEdit callback (optional)
   - Include isLoading prop

4. **Build card structure**
   - Use Card component as wrapper
   - Add CardHeader with title "Order Information"
   - Include edit button in header (if editable)
   - Add CardContent with sections

5. **Organize three-column layout**
   - Create responsive grid layout
   - Desktop: 3 columns (Customer, Shipping, Billing)
   - Tablet: 2 columns + 1 row
   - Mobile: Stack all vertically

6. **Add section separators**
   - Use vertical dividers between sections (desktop)
   - Use horizontal dividers when stacked
   - Apply subtle styling
   - Maintain consistent spacing

7. **Implement Customer Info section**
   - Render CustomerInfoSection component
   - Pass customer data from order
   - Include name, email, phone
   - Show customer avatar/icon

8. **Implement Shipping Address section**
   - Render ShippingAddressSection component
   - Pass shipping address from order
   - Display formatted address
   - Include edit capability

9. **Implement Billing Address section**
   - Render BillingAddressSection component
   - Pass billing address from order
   - Display formatted address
   - Show "Same as shipping" if applicable

10. **Add loading state**
    - Show skeleton loaders for each section
    - Maintain layout structure
    - Use shimmer effect
    - Keep card visible

11. **Add empty state handling**
    - Handle missing customer info
    - Handle missing addresses
    - Show placeholder text
    - Provide edit/add option

12. **Style card consistently**
    - Apply proper padding
    - Use consistent spacing between sections
    - Add subtle borders
    - Ensure readability

### Card Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Order Information                                     [Edit]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────┐          │
│  │ Customer    │ │ │ Shipping    │ │ │ Billing     │          │
│  │ Info        │ │ │ Address     │ │ │ Address     │          │
│  │             │ │ │             │ │ │             │          │
│  │ 👤 John Doe │ │ │ 📍 123 Main │ │ │ 💳 Same as  │          │
│  │             │ │ │    Street   │ │ │    Shipping │          │
│  │ ✉ john@..   │ │ │    Colombo  │ │ │             │          │
│  │             │ │ │    10100    │ │ │             │          │
│  │ ☎ +94...    │ │ │    LK       │ │ │             │          │
│  │             │ │ │             │ │ │             │          │
│  └─────────────┘ │ └─────────────┘ │ └─────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Responsive Layout Breakpoints

**Desktop (≥1024px) - 3 Columns**
```
┌───────────────────────────────────────┐
│ [Customer] │ [Shipping] │ [Billing]  │
└───────────────────────────────────────┘
```

**Tablet (768-1023px) - 2 + 1 Layout**
```
┌───────────────────────────────┐
│ [Customer] │ [Shipping]       │
├───────────────────────────────┤
│ [Billing]                     │
└───────────────────────────────┘
```

**Mobile (<768px) - Stacked**
```
┌───────────────┐
│ [Customer]    │
├───────────────┤
│ [Shipping]    │
├───────────────┤
│ [Billing]     │
└───────────────┘
```

### Component Hierarchy

```
OrderInfoCard
├── Card (wrapper)
│   ├── CardHeader
│   │   ├── CardTitle ("Order Information")
│   │   └── EditButton (optional)
│   └── CardContent
│       └── Grid (3 columns responsive)
│           ├── CustomerInfoSection
│           ├── Separator (vertical)
│           ├── ShippingAddressSection
│           ├── Separator (vertical)
│           └── BillingAddressSection
```

### Expected Outcome
- Well-organized info card layout
- Three distinct sections visible
- Clean visual separation
- Responsive design working
- Loading states functional
- Easy to scan and read

### Verification Checklist
- [ ] OrderInfoCard component created
- [ ] Card renders with header
- [ ] Three-column layout displays
- [ ] CustomerInfoSection renders
- [ ] ShippingAddressSection renders
- [ ] BillingAddressSection renders
- [ ] Separators visible (desktop)
- [ ] Layout responsive on tablet
- [ ] Layout stacks on mobile
- [ ] Loading skeleton shows
- [ ] Edit button functional
- [ ] Component properly typed

---

## Task 38: Create Customer Info Section

### Overview
Create the CustomerInfoSection component displaying customer details within the Order Info Card. This section shows customer name with icon, email address, phone number, and optionally customer ID and tags. Information is displayed in a clean, scannable format.

### Dependencies
- Task 37: Create Order Info Card
- Customer type definitions

### Instructions

1. **Create section component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `CustomerInfoSection.tsx`
   - Set up component with props

2. **Import required dependencies**
   - Import icons from Lucide React (User, Mail, Phone, Tag)
   - Import Avatar component
   - Import Link component from Next.js
   - Import Customer type

3. **Define component props interface**
   - Create CustomerInfoSectionProps interface
   - Include customer property (name, email, phone, avatar)
   - Include optional customerId
   - Include optional showLink boolean

4. **Build section structure**
   - Create container div with proper spacing
   - Add section title "Customer"
   - Organize info items vertically
   - Apply consistent styling

5. **Display customer name**
   - Show customer full name prominently
   - Include User icon or Avatar image
   - Make name larger and bold
   - Link to customer profile (optional)

6. **Display customer avatar**
   - Show avatar image if available
   - Use fallback initials if no image
   - Size appropriately (40-48px)
   - Apply circular shape

7. **Display email address**
   - Show email with Mail icon
   - Format as clickable mailto link
   - Truncate if very long
   - Show tooltip with full email

8. **Display phone number**
   - Show phone with Phone icon
   - Format as Sri Lankan number (+94 XX XXX XXXX)
   - Make clickable tel: link
   - Handle various format inputs

9. **Add customer ID display**
   - Show customer ID if available
   - Use small, muted text
   - Display below name
   - Format as "ID: CUST-XXXX"

10. **Add customer tags**
    - Display customer tags/labels if present
    - Show as small badges
    - Examples: "VIP", "Wholesale", "New"
    - Limit to 2-3 visible tags

11. **Style info items consistently**
    - Use flex layout for icon + text
    - Align icons vertically
    - Apply proper spacing (gap)
    - Use muted colors for icons
    - Maintain text hierarchy

12. **Add empty state handling**
    - Handle missing email gracefully
    - Handle missing phone gracefully
    - Show placeholder text
    - Maintain layout structure

### Customer Info Display Structure

```
┌─────────────────────────┐
│ Customer                │
├─────────────────────────┤
│                         │
│  ┌─┐  John Doe          │
│  │J│  ↑ Avatar + Name   │
│  └─┘  VIP               │
│       ↑ Customer Tag    │
│                         │
│  ✉  john@example.com    │
│  ↑ Email Icon           │
│                         │
│  ☎  +94 77 123 4567     │
│  ↑ Phone Icon           │
│                         │
│  ID: CUST-1001          │
│  ↑ Customer ID          │
│                         │
└─────────────────────────┘
```

### Info Item Layout

```
Each Info Item:
┌─────────────────────────┐
│ [Icon] Label            │
│  16px  Text Content     │
│  gap   ↑ Clickable link │
└─────────────────────────┘
```

### Phone Number Formatting Examples

| Input | Formatted Output |
|-------|------------------|
| 0771234567 | +94 77 123 4567 |
| +94771234567 | +94 77 123 4567 |
| 94771234567 | +94 77 123 4567 |
| 077-123-4567 | +94 77 123 4567 |

### Expected Outcome
- Clean customer information display
- All details properly formatted
- Icons aligned with text
- Links working correctly
- Responsive text sizing
- Professional appearance

### Verification Checklist
- [ ] CustomerInfoSection component created
- [ ] Section title displays
- [ ] Customer name shows prominently
- [ ] Avatar/icon renders
- [ ] Email displays with link
- [ ] Phone displays with formatting
- [ ] Phone link works (tel:)
- [ ] Customer ID shows if available
- [ ] Tags display correctly
- [ ] Icons aligned properly
- [ ] Links clickable
- [ ] Component properly typed

---

## Task 39: Create Shipping Address Section

### Overview
Create the ShippingAddressSection component displaying the shipping address for the order. This section formats and displays a complete Sri Lankan address with proper structure including street, city, district, postal code, and country. Includes copy and edit functionality.

### Dependencies
- Task 37: Create Order Info Card
- Address type definitions

### Instructions

1. **Create section component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `ShippingAddressSection.tsx`
   - Set up component structure

2. **Import required dependencies**
   - Import icons from Lucide React (MapPin, Copy, Edit)
   - Import Button component
   - Import Address type definition
   - Import toast for notifications

3. **Define component props interface**
   - Create ShippingAddressSectionProps interface
   - Include address property of type Address
   - Include onEdit callback (optional)
   - Include allowCopy boolean (default true)

4. **Build section structure**
   - Create container with section title
   - Add "Shipping Address" header
   - Include action buttons (copy, edit)
   - Display formatted address

5. **Format address display**
   - Line 1: Street address, building/apt
   - Line 2: City/Town name
   - Line 3: District, Postal Code
   - Line 4: Country (Sri Lanka)
   - Apply proper line breaks

6. **Display address line 1**
   - Combine street number and street name
   - Include building, apartment, or floor
   - Show on single line if short
   - Wrap to next line if long

7. **Display city and district**
   - Show city/town name
   - Display district (Sri Lankan administrative)
   - Format as "City, District"
   - Handle missing district

8. **Display postal code**
   - Show 5-digit Sri Lankan postal code
   - Format with proper spacing
   - Validate format if editing
   - Example: "10100"

9. **Add copy address button**
   - Include Copy icon button
   - Copy full formatted address to clipboard
   - Show success toast on copy
   - Position in header or footer

10. **Add edit address button**
    - Include Edit icon button
    - Call onEdit callback when clicked
    - Show only if onEdit provided
    - Position next to copy button

11. **Handle missing address**
    - Show "No shipping address provided"
    - Display add address button
    - Use muted styling
    - Maintain section layout

12. **Add address validation indicator**
    - Show verified badge if address validated
    - Display warning if incomplete
    - Include "Verify Address" action
    - Use subtle styling

13. **Style address text**
    - Use readable font size
    - Apply proper line height
    - Use muted color for text
    - Maintain consistent spacing

14. **Add map link (optional)**
    - Include "View on Map" link
    - Open Google Maps with address
    - Use MapPin icon
    - Show in small link

### Address Display Format

```
┌─────────────────────────────────┐
│ Shipping Address    [📋] [✏]   │
├─────────────────────────────────┤
│                                 │
│  📍  123/A Main Street          │
│      Apartment 5B               │
│      Colombo 01                 │
│      Western Province, 10100    │
│      Sri Lanka                  │
│                                 │
│  🗺 View on Map                 │
│                                 │
└─────────────────────────────────┘
```

### Sri Lankan Address Structure

| Component | Example | Required |
|-----------|---------|----------|
| Street | 123/A Main Street | Yes |
| Building/Apt | Apartment 5B, Floor 2 | No |
| City | Colombo 01 | Yes |
| District | Colombo District | Yes |
| Postal Code | 10100 | Yes |
| Province | Western Province | No |
| Country | Sri Lanka | Yes |

### Common Sri Lankan Postal Codes

| City | Postal Code |
|------|-------------|
| Colombo 01 | 10100 |
| Kandy | 20000 |
| Galle | 80000 |
| Jaffna | 40000 |
| Negombo | 11500 |

### Copy Address Format

```
Copied text:
123/A Main Street
Apartment 5B
Colombo 01
Western Province, 10100
Sri Lanka
```

### Expected Outcome
- Well-formatted address display
- Copy functionality working
- Edit capability present
- Professional Sri Lankan format
- Clear visual hierarchy
- Empty state handled

### Verification Checklist
- [ ] ShippingAddressSection created
- [ ] Section title displays
- [ ] Address formats correctly
- [ ] All address lines show
- [ ] Postal code displays
- [ ] District shows correctly
- [ ] Copy button works
- [ ] Clipboard copy successful
- [ ] Toast shows on copy
- [ ] Edit button functional
- [ ] Empty state handled
- [ ] Component properly typed

---

## Task 40: Create Billing Address Section

### Overview
Create the BillingAddressSection component displaying the billing address for the order. This section is similar to shipping address but includes a special "Same as shipping" option. Displays formatted billing address with copy and edit functionality.

### Dependencies
- Task 37: Create Order Info Card
- Task 39: Create Shipping Address Section (reference)
- Address type definitions

### Instructions

1. **Create section component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `BillingAddressSection.tsx`
   - Set up component structure

2. **Import required dependencies**
   - Import icons from Lucide React (CreditCard, Copy, Edit, Check)
   - Import Button component
   - Import Address type definition
   - Import toast for notifications

3. **Define component props interface**
   - Create BillingAddressSectionProps interface
   - Include billingAddress property
   - Include shippingAddress property (for comparison)
   - Include isSameAsShipping boolean
   - Include onEdit callback

4. **Build section structure**
   - Create container with section title
   - Add "Billing Address" header
   - Include action buttons
   - Display address or "same as" message

5. **Check if same as shipping**
   - Compare billing and shipping addresses
   - Set isSameAsShipping if matching
   - Show special display when same
   - Update when addresses change

6. **Display "Same as Shipping" state**
   - Show checkmark icon with message
   - Text: "Same as shipping address"
   - Apply success/info color
   - Include reference to shipping section
   - Hide full address details

7. **Display different billing address**
   - If not same as shipping
   - Format address like shipping section
   - Show all address components
   - Apply consistent formatting

8. **Reuse address formatting logic**
   - Use same format as ShippingAddressSection
   - Display street, city, district, postal
   - Maintain consistent line breaks
   - Apply same text styling

9. **Add copy functionality**
   - Include Copy icon button
   - Copy billing address to clipboard
   - If same as shipping, copy shipping address
   - Show success toast

10. **Add edit functionality**
    - Include Edit icon button
    - Call onEdit callback
    - Allow changing to different address
    - Update isSameAsShipping state

11. **Add toggle option**
    - Include "Use shipping address" checkbox
    - Allow toggling same as shipping
    - Update address when toggled
    - Show in edit mode

12. **Handle missing billing address**
    - Show "No billing address provided"
    - Default to "Same as shipping"
    - Display add address button
    - Maintain section structure

13. **Style consistently with shipping**
    - Match ShippingAddressSection styling
    - Use same spacing and layout
    - Apply consistent colors
    - Maintain visual harmony

### Billing Address Display Modes

**Mode 1: Same as Shipping**
```
┌─────────────────────────────────┐
│ Billing Address       [✏]       │
├─────────────────────────────────┤
│                                 │
│  ✓  Same as shipping address    │
│     (See shipping details)      │
│                                 │
└─────────────────────────────────┘
```

**Mode 2: Different Address**
```
┌─────────────────────────────────┐
│ Billing Address    [📋] [✏]    │
├─────────────────────────────────┤
│                                 │
│  💳  456 Business Street        │
│      Office Suite 12            │
│      Colombo 03                 │
│      Western Province, 10300    │
│      Sri Lanka                  │
│                                 │
└─────────────────────────────────┘
```

### Address Comparison Logic

```
Compare Addresses:
    │
    ├─→ Check street match
    ├─→ Check city match
    ├─→ Check district match
    ├─→ Check postal code match
    │
    ▼
All match?
    │
    ├─→ Yes: isSameAsShipping = true
    │         Show "Same as" message
    │
    └─→ No:  isSameAsShipping = false
              Show full address
```

### Toggle Same as Shipping Flow

```
User toggles checkbox
    │
    ▼
Is checked?
    │
    ├─→ Yes: Copy shipping to billing
    │        Set isSameAsShipping = true
    │        Show "Same as" message
    │
    └─→ No:  Clear billing address
             Set isSameAsShipping = false
             Show address form/fields
```

### Expected Outcome
- Billing address section working
- "Same as shipping" detection
- Different address display
- Copy functionality working
- Edit capability present
- Toggle option functional
- Consistent styling

### Verification Checklist
- [ ] BillingAddressSection created
- [ ] Section title displays
- [ ] "Same as" detection works
- [ ] "Same as" message shows
- [ ] Different address displays
- [ ] Address formats correctly
- [ ] Copy button works
- [ ] Edit button functional
- [ ] Toggle option works
- [ ] Address comparison logic correct
- [ ] Empty state handled
- [ ] Component properly typed

---

## Task 41: Create Order Items Table

### Overview
Create the OrderItemsTable component displaying all line items in the order. This table shows product information, variants, quantities, unit prices, and line totals. Includes product images, proper formatting, and a totals section at the bottom.

### Dependencies
- Task 33: Create Order Details Page
- OrderItem type definitions
- Product type definitions

### Instructions

1. **Create items table component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `OrderItemsTable.tsx`
   - Set up table structure

2. **Import required dependencies**
   - Import Table components (Table, TableHeader, TableBody, TableRow, TableCell)
   - Import Image component from Next.js
   - Import currency formatting utility
   - Import OrderItem type

3. **Define component props interface**
   - Create OrderItemsTableProps interface
   - Include items array of type OrderItem[]
   - Include editable boolean (default false)
   - Include onItemUpdate callback (optional)

4. **Build table structure**
   - Create table with proper semantic HTML
   - Define table header with columns
   - Render table body with item rows
   - Add table footer for totals

5. **Define table columns**
   - Product: Image + Name + SKU
   - Variant: Size, Color, etc.
   - Quantity: Number of units
   - Unit Price: Price per unit (LKR)
   - Total: Line total (LKR)

6. **Create Product column cell**
   - Display product image (40x40px)
   - Show product name prominently
   - Display SKU below name (muted)
   - Link to product page (optional)

7. **Create Variant column cell**
   - Show variant attributes
   - Format as "Size: L, Color: Blue"
   - Handle multiple attributes
   - Use muted text
   - Show "No variant" if standard product

8. **Create Quantity column cell**
   - Display quantity number
   - Center align content
   - Apply monospace font
   - Format with proper unit (pcs, kg, etc.)

9. **Create Unit Price column cell**
   - Format as LKR currency
   - Show two decimal places
   - Right align content
   - Include "LKR" or "₨" symbol

10. **Create Total column cell**
    - Calculate quantity × unit price
    - Format as LKR currency
    - Right align content
    - Apply bold font weight

11. **Add table header styling**
    - Use background color
    - Apply border bottom
    - Bold text for headers
    - Proper alignment per column

12. **Add table row styling**
    - Alternate row colors (zebra striping)
    - Add hover effect
    - Proper padding for cells
    - Border between rows

13. **Add responsive behavior**
    - On mobile, stack product info
    - Hide less important columns
    - Ensure images scale properly
    - Maintain readability

14. **Handle empty items**
    - Show "No items in order" message
    - Display add items button (if editable)
    - Maintain table structure
    - Use placeholder styling

### Table Structure Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│ Order Items                                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Product    │ Variant  │ Qty │ Unit Price │ Total          │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ [IMG] Item │ L, Blue  │  2  │ 5,000.00   │ 10,000.00      │ │
│  │ Product 1  │          │     │            │                │ │
│  │ SKU-001    │          │     │            │                │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ [IMG] Item │ M, Red   │  1  │ 3,500.00   │  3,500.00      │ │
│  │ Product 2  │          │     │            │                │ │
│  │ SKU-002    │          │     │            │                │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ [IMG] Item │ -        │  5  │ 1,200.00   │  6,000.00      │ │
│  │ Product 3  │          │     │            │                │ │
│  │ SKU-003    │          │     │            │                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Created by OrderTotals component (Task 43)                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Column Configuration

| Column | Width | Alignment | Format |
|--------|-------|-----------|--------|
| Product | 40% | Left | Image + Text |
| Variant | 20% | Left | Text attributes |
| Quantity | 10% | Center | Number |
| Unit Price | 15% | Right | LKR X,XXX.XX |
| Total | 15% | Right | LKR X,XXX.XX |

### Product Cell Layout

```
┌──────────────────────────────┐
│ ┌────┐  Product Name         │
│ │IMG │  Large, Bold          │
│ │40px│  SKU-12345            │
│ └────┘  Small, Muted         │
└──────────────────────────────┘
```

### Variant Display Examples

| Product Type | Variant Display |
|--------------|-----------------|
| T-Shirt | Size: L, Color: Blue |
| Phone | Storage: 128GB, Color: Black |
| Standard Product | - (no variant) |
| Multi-pack | Pack: 6 units |

### Currency Formatting

| Value | Formatted |
|-------|-----------|
| 1000.00 | LKR 1,000.00 |
| 25000.50 | LKR 25,000.50 |
| 150.00 | LKR 150.00 |

### Responsive Behavior

**Desktop**
```
[Product Image + Name] [Variant] [Qty] [Price] [Total]
```

**Mobile**
```
[Product Image + Name]
Variant: Size L, Color Blue
Qty: 2 × LKR 5,000.00 = LKR 10,000.00
```

### Expected Outcome
- Clean, professional items table
- All product information visible
- Proper currency formatting
- Images loading correctly
- Responsive design working
- Calculations accurate

### Verification Checklist
- [ ] OrderItemsTable component created
- [ ] Table structure renders
- [ ] All columns defined
- [ ] Product images display
- [ ] Product names show
- [ ] SKUs visible
- [ ] Variants format correctly
- [ ] Quantities display
- [ ] Unit prices format as LKR
- [ ] Line totals calculate correctly
- [ ] Empty state handled
- [ ] Component properly typed

---

## Summary

This document covered the creation of the order details page structure, header, status banner, actions dropdown, order information card with three sections (customer, shipping, billing), and order items table. These components form the foundation for displaying comprehensive order information in a well-organized, user-friendly layout.

### Completed Components

1. **OrderDetailsPage** - Main page with two-column layout
2. **OrderDetailsHeader** - Order number, metadata, and action buttons
3. **OrderStatusBanner** - Prominent status display with actions
4. **OrderActionsDropdown** - Comprehensive action menu
5. **OrderInfoCard** - Container for info sections
6. **CustomerInfoSection** - Customer details display
7. **ShippingAddressSection** - Formatted shipping address
8. **BillingAddressSection** - Billing address with "same as" option
9. **OrderItemsTable** - Line items display

### Key Features Delivered

- Complete order details page structure
- Responsive two-column layout
- Contextual actions dropdown
- Status-based banner with messaging
- Well-formatted customer information
- Sri Lankan address formatting
- Professional items table layout
- Loading and error states

### Next Steps

Proceed to **Document 02** to create order item rows, totals section, status timeline, notes functionality, and action modals.

---

**End of Document 01**
