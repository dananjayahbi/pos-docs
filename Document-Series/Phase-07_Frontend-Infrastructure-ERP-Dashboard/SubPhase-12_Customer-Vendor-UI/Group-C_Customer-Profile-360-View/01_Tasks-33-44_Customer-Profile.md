# Tasks 33-44: Customer Profile & Tabs

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** C - Customer Profile & 360 View  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-45-48_Customer-History.md](02_Tasks-45-48_Customer-History.md)

---

## Document Overview

This document covers the creation of the customer 360 profile view with header section, avatar, quick stats, and tabbed interface displaying overview, orders, invoices, and communication information.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create Customer Avatar | Low | 15 min |
| 34 | Create Customer Quick Stats | Low | 20 min |
| 35 | Create Customer Tabs | Low | 20 min |
| 36 | Create Overview Tab | Low | 25 min |
| 37 | Create Contact Information Card | Low | 20 min |
| 38 | Create Credit Information Card | Medium | 25 min |
| 39 | Create Orders Tab | Low | 20 min |
| 40 | Create Order History Table | Medium | 30 min |
| 41 | Create Invoices Tab | Low | 20 min |
| 42 | Create Invoice History Table | Medium | 30 min |
| 43 | Create Communication Tab | Low | 20 min |
| 44 | Create Communication Timeline | Medium | 35 min |

---

## Task 33: Create Customer Avatar

### Overview
Create the CustomerAvatar component that displays the customer's profile picture or initials in a circular avatar. This appears prominently in the customer header section.

### Dependencies
- Group A (Task 03): Customer details route exists

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `CustomerAvatar.tsx`

2. **Import required dependencies**
   - Import Avatar component from UI library
   - Import image loading utilities
   - Import color utilities for initials background

3. **Define component props**
   - customer: object with name and imageUrl
   - size: small, medium, large (default: large)
   - Optional: editable flag

4. **Generate initials**
   - Extract first letter of first name
   - Extract first letter of last name
   - Combine to create initials (e.g., "JS" for John Silva)

5. **Generate background color**
   - Use consistent color based on customer ID or name
   - Choose from predefined color palette
   - Ensure good contrast with white text

6. **Handle image loading**
   - Display image if imageUrl provided
   - Show initials as fallback
   - Handle loading states
   - Handle image errors

7. **Add upload option (if editable)**
   - Show camera icon on hover
   - Trigger file upload dialog
   - Handle image upload
   - Show upload progress

### Avatar Variations

```
With Image:
┌────────┐
│  📷   │  (Profile photo)
└────────┘

With Initials:
┌────────┐
│   JS   │  (Colored background)
└────────┘

Editable (Hover):
┌────────┐
│   📷   │
│  [+]   │  (Camera icon overlay)
└────────┘
```

### Size Variations

| Size | Diameter | Font Size |
|------|----------|-----------|
| Small | 32px | 14px |
| Medium | 48px | 18px |
| Large | 96px | 32px |

### Color Palette

| Initial | Background | Text |
|---------|------------|------|
| A-D | Blue | White |
| E-H | Green | White |
| I-L | Purple | White |
| M-P | Orange | White |
| Q-T | Pink | White |
| U-Z | Teal | White |

### Expected Outcome
- Avatar component displays image or initials
- Colors consistent for same customer
- Size variations work correctly
- Image upload functional (if editable)

### Verification Checklist
- [ ] CustomerAvatar.tsx file created
- [ ] Displays image if provided
- [ ] Shows initials as fallback
- [ ] Background colors work
- [ ] Size prop works correctly
- [ ] Image upload works (if editable)

---

## Task 34: Create Customer Quick Stats

### Overview
Create the CustomerQuickStats component displaying key metrics about the customer in a compact, visually appealing format below the customer header.

### Dependencies
- Task 33: Create Customer Avatar

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `CustomerQuickStats.tsx`

2. **Import required dependencies**
   - Import formatting utilities
   - Import icon components
   - Import date utilities

3. **Define component props**
   - customer: object with stats data
   - loading: boolean for skeleton state

4. **Create stats grid layout**
   - Use 4-column grid
   - Display: Total Spent, Orders, Last Order, Member Since
   - Stack on mobile (single column)

5. **Format Total Spent**
   - Display in LKR with rupee symbol
   - Use appropriate abbreviations (K, M)
   - Add ShoppingBag icon

6. **Format Orders Count**
   - Display number with Package icon
   - Make clickable to Orders tab
   - Show as link

7. **Format Last Order Date**
   - Display relative date (e.g., "2 days ago")
   - Show full date on hover
   - Use Calendar icon
   - Handle null (show "No orders")

8. **Format Member Since**
   - Display date joined
   - Show relative duration in parentheses
   - Use UserPlus icon

### Stats Grid Layout

```
┌──────────────────────────────────────────────┐
│  💰              📦              📅          👤│
│  Total Spent     Orders          Last Order  Member│
│  ₨1,234,500     45              2 days ago  Since │
│                 (View Orders)    Jan 15     2023  │
└──────────────────────────────────────────────┘
```

### Stats Configuration

| Stat | Icon | Format | Interactive |
|------|------|--------|-------------|
| Total Spent | ShoppingBag | ₨1,234,500 or ₨1.23M | No |
| Orders | Package | 45 (View Orders) | Yes - Link to tab |
| Last Order | Calendar | Relative date | No |
| Member Since | UserPlus | Date + duration | No |

### Responsive Behavior

| Breakpoint | Columns | Layout |
|------------|---------|--------|
| Desktop | 4 | Horizontal row |
| Tablet | 2 | 2x2 grid |
| Mobile | 1 | Vertical stack |

### Expected Outcome
- Quick stats display key metrics
- Formatting applied correctly
- Orders link functional
- Responsive layout works

### Verification Checklist
- [ ] CustomerQuickStats.tsx file created
- [ ] All 4 stats display
- [ ] LKR formatting correct
- [ ] Dates formatted properly
- [ ] Orders link works
- [ ] Responsive design functional

---

## Task 35: Create Customer Tabs

### Overview
Create the CustomerTabs component providing a tabbed interface to organize different sections of customer information: Overview, Orders, Invoices, Communication, and Notes.

### Dependencies
- Task 34: Create Customer Quick Stats

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `CustomerTabs.tsx`

2. **Import required dependencies**
   - Import Tabs components from Radix UI
   - Import tab content components
   - Import state management hooks

3. **Define component props**
   - customerId: string
   - defaultTab: string (default: "overview")
   - onTabChange: callback (optional)

4. **Create tabs list**
   - Overview (default)
   - Orders
   - Invoices
   - Communication
   - Notes

5. **Set up tab state**
   - Use Radix UI Tabs component
   - Sync with URL query parameter (optional)
   - Remember last viewed tab
   - Handle tab changes

6. **Configure tab panels**
   - OverviewTab (Task 36)
   - OrdersTab (Task 39)
   - InvoicesTab (Task 41)
   - CommunicationTab (Task 43)
   - NotesTab (Group F)

7. **Add tab indicators**
   - Show count badges on Orders and Invoices
   - Highlight active tab
   - Add hover states
   - Ensure keyboard navigation

### Tabs Layout

```
┌─────────────────────────────────────────────┐
│ [Overview] [Orders (45)] [Invoices] [Comm] [Notes]
├─────────────────────────────────────────────┤
│                                             │
│         Tab Content Here                    │
│                                             │
└─────────────────────────────────────────────┘
```

### Tab Configuration

| Tab | Label | Badge | Default |
|-----|-------|-------|---------|
| overview | Overview | - | Yes |
| orders | Orders | Order count | No |
| invoices | Invoices | - | No |
| communication | Communication | - | No |
| notes | Notes | - | No |

### URL Integration (Optional)

```
URL with tab parameter:
/customers/cus_abc123?tab=orders

Tabs sync with URL:
- Overview: ?tab=overview
- Orders: ?tab=orders
- Invoices: ?tab=invoices
- Communication: ?tab=communication
- Notes: ?tab=notes
```

### Expected Outcome
- Tabs component with 5 tabs created
- Tab switching works
- Active tab highlighted
- Tab content displays correctly
- URL sync works (if implemented)

### Verification Checklist
- [ ] CustomerTabs.tsx file created
- [ ] All 5 tabs render
- [ ] Tab switching works
- [ ] Active tab highlighted
- [ ] Count badges display
- [ ] Keyboard navigation works
- [ ] URL sync works (optional)

---

## Task 36: Create Overview Tab

### Overview
Create the OverviewTab component displaying the customer's key information in an organized layout with contact information and credit information cards.

### Dependencies
- Task 35: Create Customer Tabs

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `OverviewTab.tsx`

2. **Import required dependencies**
   - Import ContactInfoCard (Task 37)
   - Import CreditInfoCard (Task 38)
   - Import grid/layout components

3. **Define component props**
   - customerId: string
   - customer: customer object (optional if fetched internally)

4. **Create tab layout**
   - Use 2-column grid
   - Left column: Contact Information
   - Right column: Credit Information
   - Stack on mobile

5. **Fetch customer data**
   - Use useCustomer hook with customerId
   - Handle loading state
   - Handle error state
   - Pass data to cards

6. **Add additional sections (optional)**
   - Customer type badge
   - Tags/labels
   - Custom fields
   - Internal notes preview

### Overview Tab Layout

```
┌───────────────────────┬───────────────────────┐
│ Contact Information   │ Credit Information    │
│                       │                       │
│ 📞 Phone              │ 💳 Credit Limit       │
│   +94 77 123 4567     │   ₨500,000           │
│                       │                       │
│ 📧 Email              │ 📊 Used               │
│   john@example.com    │   ₨125,000 (25%)     │
│                       │                       │
│ 📍 Address            │ ✅ Available          │
│   123 Main St         │   ₨375,000           │
│   Colombo 10          │                       │
│                       │ 🎯 Status             │
│ 🏢 Type               │   Good Standing       │
│   Individual          │                       │
└───────────────────────┴───────────────────────┘
```

### Grid Layout

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Desktop | 2 equal | 24px |
| Tablet | 2 equal | 16px |
| Mobile | 1 full | 16px |

### Expected Outcome
- Overview tab displays contact and credit cards
- Grid layout responsive
- Data loads correctly
- Cards display information properly

### Verification Checklist
- [ ] OverviewTab.tsx file created
- [ ] Grid layout works
- [ ] ContactInfoCard integrated
- [ ] CreditInfoCard integrated
- [ ] Data fetching works
- [ ] Loading states display
- [ ] Responsive design functional

---

## Task 37: Create Contact Information Card

### Overview
Create the ContactInfoCard component displaying the customer's contact details including phone, email, address, and business type in a clean, readable card format.

### Dependencies
- Task 36: Create Overview Tab

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `ContactInfoCard.tsx`

2. **Import required dependencies**
   - Import Card component
   - Import icons (Phone, Mail, MapPin, Building)
   - Import copy-to-clipboard utility

3. **Define component props**
   - customer: object with contact fields
   - editable: boolean (show edit button)
   - onEdit: callback function

4. **Create card structure**
   - Card header with "Contact Information" title
   - Edit button (if editable)
   - List of contact fields
   - Icons for each field

5. **Display contact fields**
   - Phone with Phone icon (format: +94 XX XXX XXXX)
   - Email with Mail icon (clickable mailto link)
   - Address with MapPin icon (multi-line if needed)
   - Type with Building icon

6. **Add interaction features**
   - Click to copy phone/email
   - Click email to open mail client
   - Click phone to call (mobile)
   - Show copy confirmation toast

7. **Handle missing data**
   - Show "Not provided" for empty fields
   - Use muted text color
   - Offer "Add" option if editable

### Card Layout

```
┌───────────────────────────┐
│ Contact Information  [✏️] │
├───────────────────────────┤
│ 📞 Phone                  │
│    +94 77 123 4567        │
│    [Copy]                 │
│                           │
│ 📧 Email                  │
│    john@example.com       │
│    [Copy] [Send Email]    │
│                           │
│ 📍 Address                │
│    123 Main Street        │
│    Colombo 10             │
│    Sri Lanka              │
│                           │
│ 🏢 Type                   │
│    Individual Customer    │
└───────────────────────────┘
```

### Contact Field Configuration

| Field | Icon | Format | Actions |
|-------|------|--------|---------|
| Phone | Phone | +94 XX XXX XXXX | Copy, Call |
| Email | Mail | email@domain.com | Copy, Send |
| Address | MapPin | Multi-line | - |
| Type | Building | Formatted label | - |

### Expected Outcome
- Contact card displays all information
- Icons properly aligned
- Copy functionality works
- Email link opens mail client
- Edit button triggers callback

### Verification Checklist
- [ ] ContactInfoCard.tsx file created
- [ ] All fields display correctly
- [ ] Phone formatting correct
- [ ] Copy to clipboard works
- [ ] Email link functional
- [ ] Edit button works (if editable)
- [ ] Missing data handled gracefully

---

## Task 38: Create Credit Information Card

### Overview
Create the CreditInfoCard component displaying the customer's credit terms, usage, and status with visual indicators like progress bars and status badges.

### Dependencies
- Task 36: Create Overview Tab

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `CreditInfoCard.tsx`

2. **Import required dependencies**
   - Import Card component
   - Import Progress bar component
   - Import Badge component
   - Import icons

3. **Define component props**
   - customer: object with credit fields
   - onAdjustCredit: callback to open modal
   - editable: boolean

4. **Create card structure**
   - Header with "Credit Information" title
   - Adjust Credit button
   - Credit limit display
   - Used amount with progress bar
   - Available amount
   - Credit status badge

5. **Calculate credit metrics**
   - Used percentage: (used / limit) * 100
   - Available amount: limit - used
   - Determine status: Good / Near Limit / Over Limit

6. **Display progress bar**
   - Visual bar showing credit utilization
   - Color coding:
     - Green: 0-70% (Good)
     - Yellow: 70-100% (Near Limit)
     - Red: >100% (Over Limit)

7. **Add status badge**
   - "Good Standing" (green) if < 70%
   - "Near Limit" (yellow) if 70-100%
   - "Over Limit" (red) if > 100%
   - "No Credit" (gray) if no credit terms

### Card Layout

```
┌──────────────────────────────┐
│ Credit Information  [Adjust] │
├──────────────────────────────┤
│ 💳 Credit Limit              │
│    ₨500,000                 │
│                              │
│ 📊 Used                      │
│    ₨125,000                 │
│    ▓▓▓▓░░░░░░░░░░░░  25%    │
│                              │
│ ✅ Available                 │
│    ₨375,000                 │
│                              │
│ 🎯 Status                    │
│    [Good Standing]           │
│                              │
│ 📅 Payment Terms             │
│    Net 30 Days               │
└──────────────────────────────┘
```

### Credit Status Rules

| Used % | Status | Color | Badge |
|--------|--------|-------|-------|
| 0-69% | Good | Green | Good Standing |
| 70-99% | Warning | Yellow | Near Limit |
| 100%+ | Danger | Red | Over Limit |
| No limit | N/A | Gray | No Credit |

### Progress Bar Colors

```
Progress Bar Color Mapping:
├── 0-70%: bg-green-500
├── 70-100%: bg-yellow-500
└── >100%: bg-red-500
```

### Expected Outcome
- Credit card displays all information
- Progress bar shows utilization
- Colors reflect credit status
- Adjust button triggers modal
- Calculations accurate

### Verification Checklist
- [ ] CreditInfoCard.tsx file created
- [ ] Credit limit displays correctly
- [ ] Used amount and percentage correct
- [ ] Progress bar displays and colors work
- [ ] Available amount calculated correctly
- [ ] Status badge displays appropriate color
- [ ] Adjust Credit button works
- [ ] Payment terms display

---

## Task 39: Create Orders Tab

### Overview
Create the OrdersTab component as a container for displaying the customer's order history. This tab hosts the OrderHistoryTable component.

### Dependencies
- Task 35: Create Customer Tabs

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `OrdersTab.tsx`

2. **Import required dependencies**
   - Import OrderHistoryTable (Task 40)
   - Import useCustomerOrders hook
   - Import loading components

3. **Define component props**
   - customerId: string
   - Optional: filters and pagination

4. **Fetch customer orders**
   - Use useCustomerOrders hook
   - Pass customerId as filter
   - Handle pagination
   - Handle loading and error states

5. **Create tab layout**
   - Tab header with order count
   - Optional: filters (status, date range)
   - OrderHistoryTable component
   - Pagination controls

6. **Add empty state**
   - Show message when no orders
   - Add "Create Order" CTA button
   - Display helpful icon

### Orders Tab Layout

```
┌─────────────────────────────────────────────┐
│ Orders (45)               [Filter▼] [Date▼] │
├─────────────────────────────────────────────┤
│ Order#     Date       Items    Total  Status│
│ ORD-001    Jan 15    3        ₨25K   Paid  │
│ ORD-002    Jan 12    5        ₨38K   Paid  │
│ ORD-003    Jan 08    2        ₨15K   Pending│
│ ...                                         │
├─────────────────────────────────────────────┤
│ Showing 1-10 of 45      [← 1 2 3 4 5 →]   │
└─────────────────────────────────────────────┘
```

### Empty State

```
┌─────────────────────────────────────────────┐
│                                             │
│              📦                            │
│                                             │
│         No Orders Yet                       │
│                                             │
│    This customer hasn't placed any orders.  │
│                                             │
│         [Create Order]                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Orders tab displays order history
- Filtering works (if implemented)
- Pagination functional
- Empty state shows when no orders
- Loading states handled

### Verification Checklist
- [ ] OrdersTab.tsx file created
- [ ] Order data fetches correctly
- [ ] OrderHistoryTable integrated
- [ ] Pagination works
- [ ] Empty state displays
- [ ] Loading states handled

---

## Task 40: Create Order History Table

### Overview
Create the OrderHistoryTable component displaying a list of the customer's orders in a sortable table format with order details and status indicators.

### Dependencies
- Task 39: Create Orders Tab

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `OrderHistoryTable.tsx`

2. **Import required dependencies**
   - Import TanStack Table
   - Import Badge component for status
   - Import Link for navigation
   - Import date formatting utilities

3. **Define table columns**
   - Order # (clickable link)
   - Date (formatted)
   - Items (count)
   - Total (LKR)
   - Status (badge)
   - Actions (view details)

4. **Create column definitions**
   - Order #: Link to /orders/[id]
   - Date: Format as "Jan 15, 2024"
   - Items: Number of line items
   - Total: Format as ₨XX,XXX
   - Status: Colored badge (Paid, Pending, Cancelled)

5. **Implement table**
   - Use TanStack Table
   - Enable sorting on date and total
   - Handle click to view order details
   - Add hover states

6. **Add status badges**
   - Paid: Green badge
   - Pending: Yellow badge
   - Processing: Blue badge
   - Cancelled: Red badge

### Table Layout

```
┌──────────────────────────────────────────────┐
│ Order #    Date       Items  Total     Status│
├──────────────────────────────────────────────┤
│ ORD-001   Jan 15     3      ₨25,000   [Paid]│
│ ORD-002   Jan 12     5      ₨38,500   [Paid]│
│ ORD-003   Jan 08     2      ₨15,000[Pending]│
│ ORD-004   Jan 05     8      ₨64,200   [Paid]│
│ ORD-005   Dec 28     1      ₨8,500 [Cancelled]│
└──────────────────────────────────────────────┘
```

### Order Status Colors

| Status | Color | Badge Style |
|--------|-------|-------------|
| Paid | Green | Success |
| Processing | Blue | Info |
| Pending | Yellow | Warning |
| Cancelled | Red | Danger |

### Column Configuration

| Column | Width | Sortable | Format |
|--------|-------|----------|--------|
| Order # | 120px | No | ORD-XXX |
| Date | 100px | Yes | Jan 15, 2024 |
| Items | 80px | No | Number |
| Total | 120px | Yes | ₨XX,XXX |
| Status | 100px | Yes | Badge |

### Expected Outcome
- Order history table displays data
- Columns formatted correctly
- Sorting works
- Status badges colored appropriately
- Order links navigate correctly

### Verification Checklist
- [ ] OrderHistoryTable.tsx file created
- [ ] Table columns render
- [ ] Data displays correctly
- [ ] Order links work
- [ ] Status badges show correct colors
- [ ] Sorting functional
- [ ] Date and currency formatted

---

## Task 41: Create Invoices Tab

### Overview
Create the InvoicesTab component as a container for displaying the customer's invoice history. Similar to OrdersTab but for invoices.

### Dependencies
- Task 35: Create Customer Tabs

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `InvoicesTab.tsx`

2. **Import required dependencies**
   - Import InvoiceHistoryTable (Task 42)
   - Import useCustomerInvoices hook
   - Import filter components

3. **Define component props**
   - customerId: string
   - Optional: filters

4. **Fetch customer invoices**
   - Use useCustomerInvoices hook
   - Handle pagination
   - Handle loading states

5. **Create tab layout**
   - Header with invoice count
   - Filter options (status, date)
   - InvoiceHistoryTable
   - Pagination

6. **Add summary metrics**
   - Total invoiced amount
   - Outstanding balance
   - Paid invoices count

### Invoices Tab Layout

```
┌─────────────────────────────────────────────┐
│ Invoices (38)    Outstanding: ₨125,000      │
├─────────────────────────────────────────────┤
│ Invoice#   Date      Amount    Due    Status│
│ INV-001    Jan 15   ₨25,000   Jan 30  [Paid]│
│ INV-002    Jan 12   ₨38,000   Jan 27[Overdue]│
│ INV-003    Jan 08   ₨15,000   Jan 23 [Pending]│
│ ...                                         │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Invoices tab displays invoice history
- Summary metrics show
- Table integrated
- Filtering works

### Verification Checklist
- [ ] InvoicesTab.tsx file created
- [ ] Invoice data fetches
- [ ] Summary metrics display
- [ ] InvoiceHistoryTable integrated
- [ ] Filters work

---

## Task 42: Create Invoice History Table

### Overview
Create the InvoiceHistoryTable component displaying customer invoices with payment status, due dates, and amounts.

### Dependencies
- Task 41: Create Invoices Tab

### Instructions

1. **Create component file**
   - Create new file `InvoiceHistoryTable.tsx`

2. **Define table columns**
   - Invoice # (link)
   - Date
   - Amount (LKR)
   - Due Date
   - Status (badge)
   - Actions

3. **Implement status badges**
   - Paid: Green
   - Pending: Yellow
   - Overdue: Red
   - Partial: Blue

4. **Add due date indicators**
   - Show days until due
   - Highlight overdue in red
   - Show "Due today" for same day

5. **Create action buttons**
   - View PDF
   - Download
   - Send reminder (for overdue)

### Invoice Status Colors

| Status | Color | Condition |
|--------|-------|-----------|
| Paid | Green | Fully paid |
| Pending | Yellow | Due date not passed |
| Overdue | Red | Past due date |
| Partial | Blue | Partially paid |

### Expected Outcome
- Invoice table displays data
- Status badges colored correctly
- Due dates highlighted
- Actions functional

### Verification Checklist
- [ ] InvoiceHistoryTable.tsx file created
- [ ] Columns render correctly
- [ ] Status badges work
- [ ] Due date indicators show
- [ ] Actions functional

---

## Task 43: Create Communication Tab

### Overview
Create the CommunicationTab component as a container for the customer communication timeline and add entry form.

### Dependencies
- Task 35: Create Customer Tabs

### Instructions

1. **Create component file**
   - Create new file `CommunicationTab.tsx`

2. **Import dependencies**
   - Import CommunicationTimeline (Task 44)
   - Import Add Communication form
   - Import useCommunications hook

3. **Create tab layout**
   - Add communication button
   - Communication timeline
   - Filter by type

4. **Fetch communications**
   - Use useCommunications hook
   - Pass customerId
   - Handle loading

5. **Add type filters**
   - All
   - Phone Calls
   - Emails
   - Meetings
   - Notes

### Expected Outcome
- Communication tab shows timeline
- Add communication button works
- Type filters functional

### Verification Checklist
- [ ] CommunicationTab.tsx file created
- [ ] Timeline integrated
- [ ] Add button works
- [ ] Filters functional

---

## Task 44: Create Communication Timeline

### Overview
Create the CommunicationTimeline component displaying a vertical timeline of all customer interactions including phone calls, emails, meetings, and notes.

### Dependencies
- Task 43: Create Communication Tab

### Instructions

1. **Create component file**
   - Create new file `CommunicationTimeline.tsx`

2. **Import dependencies**
   - Import Timeline components
   - Import type icons
   - Import date utilities

3. **Create timeline structure**
   - Vertical timeline with dots
   - Colored dots per type
   - Entry card for each item
   - Date separators

4. **Design entry cards**
   - Icon and type badge
   - Subject/title
   - Date and time
   - Description/notes
   - Attached files (if any)

5. **Add type icons and colors**
   - Phone: Phone icon, blue
   - Email: Mail icon, purple
   - Meeting: Users icon, green
   - Note: FileText icon, gray

6. **Group by date**
   - Add date headers (Today, Yesterday, Jan 15)
   - Group entries under dates
   - Show relative times

### Timeline Layout

```
┌─────────────────────────────────────────────┐
│ Today                                       │
│                                             │
│ ● Phone Call                      10:30 AM  │
│   Discussed order status                    │
│   Called about order ORD-001 delay          │
│                                             │
│ ● Email Sent                       9:15 AM  │
│   Invoice reminder                          │
│   Sent invoice INV-002 payment reminder     │
│                                             │
│ Yesterday                                   │
│                                             │
│ ● Meeting                          2:00 PM  │
│   Quarterly review                          │
│   Discussed credit limit increase           │
│   📎 meeting-notes.pdf                     │
└─────────────────────────────────────────────┘
```

### Communication Types

| Type | Icon | Color | Badge |
|------|------|-------|-------|
| Phone Call | Phone | Blue | 🔵 |
| Email | Mail | Purple | 🟣 |
| Meeting | Users | Green | 🟢 |
| Note | FileText | Gray | ⚪ |

### Expected Outcome
- Timeline displays all communications
- Entries grouped by date
- Type icons and colors show
- Relative times display
- Attached files shown

### Verification Checklist
- [ ] CommunicationTimeline.tsx file created
- [ ] Timeline renders vertically
- [ ] Type icons display
- [ ] Colors applied correctly
- [ ] Date grouping works
- [ ] Entry cards show all info
- [ ] Attachments display (if any)

---

## Summary

This document created the customer profile 360 view with header, tabs, and detailed information displays. The following components were implemented:

### Profile Components
- CustomerAvatar - Image or initials display
- CustomerQuickStats - Key metrics display
- CustomerTabs - Tabbed navigation

### Overview Tab
- OverviewTab - Main container
- ContactInfoCard - Contact details
- CreditInfoCard - Credit information with progress bar

### Orders Tab
- OrdersTab - Container
- OrderHistoryTable - Order list with status

### Invoices Tab
- InvoicesTab - Container
- InvoiceHistoryTable - Invoice list

### Communication Tab
- CommunicationTab - Container
- CommunicationTimeline - Interaction history

The next document will complete the communication features and modals.
