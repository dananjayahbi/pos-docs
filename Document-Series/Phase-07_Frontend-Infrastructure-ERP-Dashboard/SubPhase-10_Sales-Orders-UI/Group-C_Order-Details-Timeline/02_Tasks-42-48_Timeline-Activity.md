# Tasks 42-48: Item Row, Totals, Timeline, Notes, and Modals

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** C - Order Details & Timeline  
> **Document:** 02 of 02  
> **Tasks Covered:** 42, 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-41_Order-Details-Page.md](01_Tasks-33-41_Order-Details-Page.md)
- **→ Next Group:** [Group-D_Invoice-Management](../Group-D_Invoice-Management/)

---

## Document Overview

This document covers the creation of individual order item row component, order totals calculation display, visual status timeline with history, notes section for communication, add note form, status update modal, and cancel order dialog. These components complete the order details functionality with full interaction capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 42 | Create Order Item Row | Medium | 35 min |
| 43 | Create Order Totals Section | Medium | 30 min |
| 44 | Create Order Status Timeline | Medium | 40 min |
| 45 | Create Timeline Item Component | Medium | 30 min |
| 46 | Create Order Notes Section | Low | 25 min |
| 47 | Create Add Note Form | Low | 30 min |
| 48 | Create Status Update Modal | Medium | 40 min |

---

## Task 42: Create Order Item Row

### Overview
Create the OrderItemRow component representing a single line item in the order items table. This component displays product image, name, SKU, variant information, quantity, unit price, and calculated line total. Includes optional edit and remove functionality for draft orders.

### Dependencies
- Task 41: Create Order Items Table
- OrderItem type definitions
- Product type definitions

### Instructions

1. **Create item row component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `OrderItemRow.tsx`
   - Set up table row component

2. **Import required dependencies**
   - Import TableRow and TableCell components
   - Import Image component from Next.js
   - Import icons from Lucide React (X, Edit)
   - Import currency formatting utility
   - Import OrderItem type

3. **Define component props interface**
   - Create OrderItemRowProps interface
   - Include item property of type OrderItem
   - Include editable boolean (default false)
   - Include onUpdate callback (optional)
   - Include onRemove callback (optional)

4. **Build Product column cell**
   - Create table cell with flex layout
   - Add product image (40x40px, rounded)
   - Display product name (bold, medium size)
   - Show SKU below name (small, muted)
   - Handle missing image with placeholder

5. **Display product image**
   - Use Next.js Image component
   - Set width and height to 40px
   - Apply rounded corners
   - Use object-fit cover
   - Add alt text with product name
   - Show placeholder if image fails

6. **Display product name and SKU**
   - Show product name prominently
   - Apply font-medium weight
   - Display SKU in smaller font
   - Use muted color for SKU
   - Add line break between name and SKU

7. **Build Variant column cell**
   - Extract variant attributes from item
   - Format as "Size: L, Color: Blue"
   - Handle multiple attributes gracefully
   - Show dash "-" if no variant
   - Use muted text color

8. **Format variant attributes**
   - Parse variant_data object
   - Join multiple attributes with commas
   - Format: "Key: Value, Key: Value"
   - Handle missing or null variants
   - Apply consistent text formatting

9. **Build Quantity column cell**
   - Display quantity number
   - Center align content
   - Use monospace font
   - Apply medium font weight
   - Include unit if applicable (pcs, kg)

10. **Build Unit Price column cell**
    - Format price as LKR currency
    - Show two decimal places
    - Right align content
    - Use formatCurrency utility
    - Display "LKR X,XXX.XX" format

11. **Build Total column cell**
    - Calculate: quantity × unit_price
    - Format as LKR currency
    - Right align content
    - Apply bold font weight
    - Highlight as line total

12. **Add edit functionality (optional)**
    - Show Edit icon button if editable
    - Position in actions column
    - Call onUpdate callback with item
    - Open edit item modal
    - Disable if order not editable

13. **Add remove functionality (optional)**
    - Show X icon button if editable
    - Position in actions column
    - Call onRemove callback with item ID
    - Show confirmation dialog
    - Disable if order not editable

14. **Add row hover effect**
    - Apply subtle background on hover
    - Show action buttons on hover
    - Smooth transition effect
    - Improve user experience

15. **Handle special item types**
    - Custom items (no product ID)
    - Discount line items
    - Bundle/package items
    - Service items
    - Apply appropriate styling

### Order Item Row Structure

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌────┐  Product Name        │ Size: L    │ 2 │ 5,000 │ 10,000 │
│  │IMG │  SKU-12345           │ Color: Blue│   │       │        │
│  └────┘                      │            │   │       │        │
│   40px                       │            │   │       │        │
│                              │            │   │       │        │
└──────────────────────────────────────────────────────────────────┘
```

### Product Cell Layout

```
┌─────────────────────────────────┐
│ ┌──────┐                        │
│ │      │  T-Shirt - Cotton      │  ← Product Name (bold)
│ │ IMG  │  SKU-TS-001           │  ← SKU (muted, small)
│ │ 40px │                        │
│ └──────┘                        │
└─────────────────────────────────┘
```

### Variant Formatting Examples

| Variant Data | Formatted Display |
|--------------|-------------------|
| { size: "L", color: "Blue" } | Size: L, Color: Blue |
| { storage: "128GB" } | Storage: 128GB |
| {} | - |
| null | - |
| { pack: "6 units" } | Pack: 6 units |

### Price Calculation Logic

```
Line Total Calculation:
    │
    ├─→ Get item.quantity
    ├─→ Get item.unit_price
    │
    ▼
Calculate: quantity × unit_price
    │
    ├─→ Example: 2 × 5000.00 = 10000.00
    │
    ▼
Format as currency
    │
    └─→ Display: LKR 10,000.00
```

### Special Item Types Handling

**Standard Product**
```
[Image] Product Name    Variant    Qty    Price    Total
        SKU-123         Size: M     2     5,000   10,000
```

**Custom Item (No Product)**
```
[Icon] Custom Service   -          1    10,000   10,000
       CUSTOM-001
```

**Discount Line**
```
[Icon] 10% Discount     -          1    -2,500   -2,500
       DISC-001                                    (negative)
```

### Action Buttons (Editable Mode)

```
When editable = true:
┌─────────────────────────────────────┐
│ Product │ Variant │ Qty │ Price │ □ │
│         │         │     │       │ ✏ │ ← Edit button
│         │         │     │       │ ✕ │ ← Remove button
└─────────────────────────────────────┘

On hover:
- Background changes
- Action buttons appear
- Cursor: pointer
```

### Expected Outcome
- Clean, informative item row
- Product image displays correctly
- All details formatted properly
- Calculations accurate
- Edit/remove buttons work
- Responsive layout
- Professional appearance

### Verification Checklist
- [ ] OrderItemRow component created
- [ ] TableRow renders correctly
- [ ] Product image displays (40x40px)
- [ ] Product name shows bold
- [ ] SKU displays muted
- [ ] Variant formats correctly
- [ ] Quantity centers and formats
- [ ] Unit price formats as LKR
- [ ] Line total calculates correctly
- [ ] Edit button shows when editable
- [ ] Remove button works
- [ ] Hover effects apply
- [ ] Component properly typed

---

## Task 43: Create Order Totals Section

### Overview
Create the OrderTotals component displaying the order financial summary including subtotal, discounts, taxes, shipping fees, and grand total. This section appears at the bottom of the order items table with right-aligned values and clear calculation breakdown.

### Dependencies
- Task 41: Create Order Items Table
- Task 42: Create Order Item Row
- Order type with totals data

### Instructions

1. **Create totals component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `OrderTotals.tsx`
   - Set up component structure

2. **Import required dependencies**
   - Import currency formatting utility
   - Import Separator component
   - Import Order type definition
   - Import cn utility for styling

3. **Define component props interface**
   - Create OrderTotalsProps interface
   - Include subtotal, discount, tax, shipping, total
   - Include currency (default "LKR")
   - Include compact boolean (optional)

4. **Build totals section layout**
   - Create right-aligned container
   - Set max width (e.g., 400px)
   - Apply proper spacing
   - Position at bottom of table

5. **Display Subtotal line**
   - Label: "Subtotal"
   - Calculate: Sum of all line items
   - Format as LKR currency
   - Use regular font weight

6. **Display Discount line (if applicable)**
   - Label: "Discount" or discount name
   - Show discount amount (negative)
   - Format as "- LKR X,XXX.XX"
   - Use red or muted color
   - Hide if no discount

7. **Display Tax line**
   - Label: "Tax (VAT 15%)" or applicable rate
   - Show tax amount
   - Format as LKR currency
   - Calculate: subtotal × tax_rate
   - Use regular font weight

8. **Display Shipping line (if applicable)**
   - Label: "Shipping"
   - Show shipping fee amount
   - Format as LKR currency
   - Hide if free shipping
   - Add shipping method name (optional)

9. **Add separator before total**
   - Use horizontal line or border
   - Separate calculation from total
   - Apply subtle styling
   - Full width of totals section

10. **Display Grand Total line**
    - Label: "Total"
    - Calculate: subtotal - discount + tax + shipping
    - Format as LKR currency
    - Use bold font weight
    - Increase font size
    - Highlight with background (optional)

11. **Add payment status indicator**
    - Show "Paid" badge if fully paid
    - Show "Partially Paid" if partial
    - Show "Unpaid" if no payments
    - Display amount paid vs due
    - Position below total

12. **Handle multiple currencies (optional)**
    - Support currency prop
    - Format according to currency
    - Show currency symbol
    - Handle exchange rates display

13. **Add compact mode (optional)**
    - Smaller font sizes
    - Reduced spacing
    - Hide some details
    - For summary views

14. **Style totals section**
    - Right align all values
    - Left align all labels
    - Use consistent spacing
    - Apply subtle background
    - Add padding and borders

### Totals Section Layout

```
┌────────────────────────────────────┐
│                                    │
│              Subtotal: 19,500.00   │
│      Discount (10%): - 1,950.00    │
│         Tax (15%):     2,633.00    │
│             Shipping:     500.00   │
│  ──────────────────────────────── │
│                Total:  20,683.00   │
│                                    │
│          Status: Paid ✓            │
│                                    │
└────────────────────────────────────┘
```

### Calculation Breakdown

```
Order Total Calculation:
    │
    ├─→ Subtotal = Sum of line items
    │   Example: Item1 (10,000) + Item2 (3,500) + Item3 (6,000)
    │           = 19,500.00
    │
    ├─→ Discount = Subtotal × discount_rate
    │   Example: 19,500 × 0.10 = 1,950.00
    │
    ├─→ After Discount = Subtotal - Discount
    │   Example: 19,500 - 1,950 = 17,550.00
    │
    ├─→ Tax = After Discount × tax_rate
    │   Example: 17,550 × 0.15 = 2,632.50
    │
    ├─→ Shipping = Fixed or calculated amount
    │   Example: 500.00
    │
    ▼
Total = After Discount + Tax + Shipping
      = 17,550 + 2,632.50 + 500
      = 20,682.50
```

### Line Item Structure

| Line | Label | Alignment | Format | Style |
|------|-------|-----------|--------|-------|
| Subtotal | Left | Right | LKR X,XXX.XX | Regular |
| Discount | Left | Right | - LKR X,XXX.XX | Red/Muted |
| Tax | Left | Right | LKR X,XXX.XX | Regular |
| Shipping | Left | Right | LKR X,XXX.XX | Regular |
| Separator | - | - | Border | Gray |
| **Total** | Left | Right | **LKR X,XXX.XX** | **Bold, Large** |

### Payment Status Display

```
Payment Status Variations:

Fully Paid:
┌────────────────────────────┐
│ Total: 20,683.00           │
│ Status: Paid ✓ (Green)     │
└────────────────────────────┘

Partially Paid:
┌────────────────────────────┐
│ Total: 20,683.00           │
│ Paid: 10,000.00            │
│ Due: 10,683.00 (Orange)    │
└────────────────────────────┘

Unpaid:
┌────────────────────────────┐
│ Total: 20,683.00           │
│ Status: Unpaid (Red)       │
└────────────────────────────┘
```

### Conditional Line Display Logic

```
Display Logic:
    │
    ├─→ Subtotal: Always show
    │
    ├─→ Discount: Show if discount > 0
    │             Hide if discount = 0
    │
    ├─→ Tax: Always show
    │        Show rate in label
    │
    ├─→ Shipping: Show if shipping > 0
    │             Show "Free" if = 0
    │
    └─→ Total: Always show (bold)
```

### Expected Outcome
- Clear financial summary
- Accurate calculations
- Proper currency formatting
- Professional layout
- Right-aligned values
- Conditional line display
- Payment status visible

### Verification Checklist
- [ ] OrderTotals component created
- [ ] Subtotal displays correctly
- [ ] Discount shows if applicable
- [ ] Tax calculates accurately
- [ ] Shipping displays
- [ ] Separator renders
- [ ] Grand total bold and prominent
- [ ] All values right-aligned
- [ ] LKR formatting correct
- [ ] Payment status shows
- [ ] Conditional display works
- [ ] Component properly typed

---

## Task 44: Create Order Status Timeline

### Overview
Create the OrderTimeline component displaying a visual chronological history of order status changes and events. This timeline shows each status transition with icon, timestamp, user who made the change, and optional notes. Uses a vertical timeline design with connecting lines.

### Dependencies
- Task 33: Create Order Details Page (sidebar placement)
- Timeline data from order history
- TimelineItem component (Task 45)

### Instructions

1. **Create timeline component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `OrderTimeline.tsx`
   - Set up component structure

2. **Import required dependencies**
   - Import Card components
   - Import TimelineItem from Task 45
   - Import ScrollArea component
   - Import OrderHistory type

3. **Define component props interface**
   - Create OrderTimelineProps interface
   - Include timeline array of OrderHistory items
   - Include isLoading boolean
   - Include maxHeight (optional)

4. **Build timeline container**
   - Use Card component as wrapper
   - Add CardHeader with "Timeline" title
   - Include CardContent for timeline items
   - Apply proper padding and spacing

5. **Create vertical timeline structure**
   - Use relative positioning for container
   - Add vertical line connecting items
   - Position line on left side
   - Use subtle color (border or background)

6. **Render timeline items**
   - Map through timeline array
   - Render TimelineItem for each entry
   - Sort by timestamp (newest first or oldest first)
   - Connect items with vertical line

7. **Sort timeline entries**
   - Default: Newest at top (descending)
   - Alternative: Oldest at top (ascending)
   - Make sort direction configurable
   - Add toggle button for sorting

8. **Add vertical connecting line**
   - Position absolute on left
   - Height spans all items
   - Width: 2px
   - Color: muted border color
   - Connect all timeline dots

9. **Handle empty timeline**
   - Show "No activity yet" message
   - Display placeholder icon
   - Use muted styling
   - Maintain container structure

10. **Add loading state**
    - Show skeleton timeline items
    - Display 3-4 skeleton entries
    - Maintain layout structure
    - Use shimmer effect

11. **Add scroll behavior**
    - Wrap in ScrollArea if many items
    - Set max height (e.g., 600px)
    - Enable smooth scrolling
    - Show scroll indicators

12. **Add filter options (optional)**
    - Filter by event type
    - Filter by user
    - Filter by date range
    - Show filter chips

13. **Add export functionality (optional)**
    - Export timeline as PDF
    - Export timeline as CSV
    - Include all details
    - Add export button in header

14. **Style timeline consistently**
    - Apply card styling
    - Use consistent spacing between items
    - Ensure vertical line aligns
    - Make responsive for mobile

### Timeline Layout Structure

```
┌─────────────────────────────┐
│ Timeline              [Sort]│
├─────────────────────────────┤
│                             │
│  ●─ Delivered               │
│  │  Jan 26, 11:30 AM        │
│  │  by: Admin User          │
│  │  "Successfully delivered"│
│  │                          │
│  ●─ Shipped                 │
│  │  Jan 25, 2:00 PM         │
│  │  by: Warehouse Staff     │
│  │  "Courier: DHL"          │
│  │                          │
│  ●─ Processing              │
│  │  Jan 24, 10:00 AM        │
│  │  by: Operations          │
│  │                          │
│  ●─ Confirmed               │
│  │  Jan 24, 9:00 AM         │
│  │  by: Sales Agent         │
│  │                          │
│  ●─ Draft Created           │
│     Jan 23, 5:00 PM         │
│     by: John Doe            │
│                             │
└─────────────────────────────┘
```

### Timeline Item Ordering

**Newest First (Default)**
```
Current Status
↓
Previous Status
↓
Earlier Status
↓
Original Status
```

**Oldest First (Alternative)**
```
Original Status
↓
Earlier Status
↓
Previous Status
↓
Current Status
```

### Timeline Event Types

| Event Type | Icon | Color | Description |
|------------|------|-------|-------------|
| Created | FilePlus | Gray | Order created |
| Confirmed | CheckCircle | Blue | Customer confirmed |
| Processing | Clock | Yellow | Started processing |
| Shipped | Truck | Purple | Shipped to customer |
| Delivered | Package | Green | Successfully delivered |
| Cancelled | XCircle | Red | Order cancelled |
| Updated | Edit | Gray | Details updated |
| Note Added | MessageSquare | Gray | Note added |
| Payment | DollarSign | Green | Payment received |

### Timeline Data Structure

```typescript
interface OrderHistory {
  id: string;
  order_id: string;
  event_type: 'status_change' | 'note' | 'payment' | 'update';
  status_from?: OrderStatus;
  status_to?: OrderStatus;
  note?: string;
  user_id: string;
  user_name: string;
  created_at: string;
  metadata?: Record<string, any>;
}
```

### Vertical Line Styling

```
Timeline Container:
┌─────────────────────┐
│ position: relative  │
│                     │
│  │ ← Vertical Line  │
│  │    (absolute)    │
│  │    left: 12px    │
│  │    height: 100%  │
│  │    width: 2px    │
│  │    bg: muted     │
│                     │
│  ● ← Timeline Dots  │
│  │    (relative)    │
│  │    z-index: 1    │
└─────────────────────┘
```

### Expected Outcome
- Visual chronological timeline
- Clear event history
- Vertical connecting line
- Sorted by date
- Empty and loading states
- Scrollable if many items
- Professional appearance

### Verification Checklist
- [ ] OrderTimeline component created
- [ ] Card wrapper renders
- [ ] Timeline title displays
- [ ] Vertical line visible
- [ ] TimelineItems render correctly
- [ ] Items sorted by date
- [ ] Empty state shows
- [ ] Loading skeleton displays
- [ ] Scroll works if tall
- [ ] Responsive on mobile
- [ ] Component properly typed

---

## Task 45: Create Timeline Item Component

### Overview
Create the TimelineItem component representing a single entry in the order timeline. This component displays the event icon, status or action name, timestamp, user who performed the action, and optional note or description. Uses a dot-and-line visual design.

### Dependencies
- Task 44: Create Order Status Timeline
- OrderHistory type definition

### Instructions

1. **Create timeline item component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `TimelineItem.tsx`
   - Set up component structure

2. **Import required dependencies**
   - Import icons from Lucide React
   - Import Avatar component
   - Import date formatting utility (formatDistanceToNow)
   - Import OrderHistory type

3. **Define component props interface**
   - Create TimelineItemProps interface
   - Include event property of type OrderHistory
   - Include isLast boolean (for line rendering)
   - Include optional compact mode

4. **Build timeline item structure**
   - Create flex container with gap
   - Left side: Icon/dot and connecting line
   - Right side: Event details
   - Apply proper spacing

5. **Create timeline dot/icon section**
   - Position icon or dot on left
   - Size: 32px circle
   - Apply status-specific color
   - Use z-index to appear over line
   - Center align vertically

6. **Select appropriate icon**
   - Status change: Status-specific icon
   - Note added: MessageSquare
   - Payment: DollarSign
   - Update: Edit
   - Use event_type to determine icon

7. **Apply status-specific colors**
   - Draft: Gray background
   - Confirmed: Blue background
   - Processing: Yellow background
   - Shipped: Purple background
   - Delivered: Green background
   - Cancelled: Red background

8. **Display event title**
   - Show main event description
   - For status: "Order Confirmed"
   - For note: "Note Added"
   - For payment: "Payment Received"
   - Use medium font weight

9. **Display timestamp**
   - Format relative time: "2 hours ago"
   - Use formatDistanceToNow utility
   - Show exact time on hover
   - Apply muted text color
   - Use small font size

10. **Display user information**
    - Show user who performed action
    - Format: "by [User Name]"
    - Include avatar if available
    - Use muted text color
    - Small font size

11. **Display event note/description**
    - Show additional details if present
    - Use quote or box styling
    - Apply muted background
    - Truncate long notes
    - Expandable on click (optional)

12. **Handle status transitions**
    - Show "from [Status] to [Status]"
    - Use arrows or "→" symbol
    - Format: "Draft → Confirmed"
    - Apply color coding

13. **Add hover effects**
    - Highlight item on hover
    - Show tooltip with full details
    - Expand truncated notes
    - Smooth transition

14. **Style for visual hierarchy**
    - Prominent event title
    - Secondary timestamp and user
    - Tertiary note text
    - Proper spacing between elements

### Timeline Item Layout

```
┌─────────────────────────────────────┐
│                                     │
│  ●─  Order Confirmed                │  ← Event Title
│  │   2 hours ago                    │  ← Timestamp
│  │   by: John Doe                   │  ← User
│  │   ┌──────────────────────────┐   │
│  │   │ "Customer called to       │   │  ← Note/Description
│  │   │  confirm payment details" │   │
│  │   └──────────────────────────┘   │
│  │                                  │
│                                     │
└─────────────────────────────────────┘
```

### Timeline Item Structure Breakdown

```
TimelineItem
├── Icon Section (Left)
│   ├── Icon Background Circle
│   │   ├── Size: 32px
│   │   ├── Status Color
│   │   └── z-index: 1
│   └── Status Icon
│       ├── Size: 16px
│       └── White color
│
└── Details Section (Right)
    ├── Event Title (text-base, font-medium)
    ├── Timestamp (text-sm, muted)
    ├── User Info (text-sm, muted)
    └── Note/Description (text-sm, muted bg)
```

### Icon Selection Logic

```
Select Icon based on event_type:
    │
    ├─→ status_change
    │   ├─→ Check status_to value
    │   ├─→ Draft: FileText
    │   ├─→ Confirmed: CheckCircle
    │   ├─→ Processing: Clock
    │   ├─→ Shipped: Truck
    │   ├─→ Delivered: Package
    │   └─→ Cancelled: XCircle
    │
    ├─→ note_added
    │   └─→ MessageSquare
    │
    ├─→ payment_received
    │   └─→ DollarSign
    │
    └─→ order_updated
        └─→ Edit
```

### Status Transition Display

```
Status Change Display:
┌────────────────────────────────┐
│ ● Order Status Changed         │
│   2 hours ago                  │
│   by: Admin User               │
│   Draft → Confirmed            │
│   ↑ Status transition with arrow
└────────────────────────────────┘
```

### Color Coding by Status

| Status | Icon BG Color | Icon | Text Color |
|--------|---------------|------|------------|
| Draft | Gray (slate-200) | FileText | slate-700 |
| Confirmed | Blue (blue-500) | CheckCircle | blue-700 |
| Processing | Yellow (amber-500) | Clock | amber-700 |
| Shipped | Purple (purple-500) | Truck | purple-700 |
| Delivered | Green (green-500) | Package | green-700 |
| Cancelled | Red (red-500) | XCircle | red-700 |
| Note | Gray (gray-400) | MessageSquare | gray-700 |
| Payment | Green (green-500) | DollarSign | green-700 |

### Timestamp Formatting

| Time Difference | Display |
|----------------|---------|
| < 1 minute | Just now |
| 1-59 minutes | X minutes ago |
| 1-23 hours | X hours ago |
| 1 day | Yesterday |
| 2-6 days | X days ago |
| 1+ week | MMM DD, YYYY |

### Expected Outcome
- Clear timeline entry display
- Appropriate icon and color
- Readable event description
- Relative timestamp
- User attribution
- Optional note display
- Consistent styling

### Verification Checklist
- [ ] TimelineItem component created
- [ ] Icon renders correctly
- [ ] Icon color matches status
- [ ] Event title displays
- [ ] Timestamp formats relatively
- [ ] User name shows
- [ ] Note displays if present
- [ ] Status transitions show clearly
- [ ] Hover effects work
- [ ] Spacing consistent
- [ ] Component properly typed

---

## Task 46: Create Order Notes Section

### Overview
Create the OrderNotes component displaying a list of notes and comments associated with the order. This section shows internal and customer-facing notes with timestamps, authors, and the ability to add new notes. Includes filtering by note type and search functionality.

### Dependencies
- Task 33: Create Order Details Page (sidebar placement)
- AddNoteForm component (Task 47)
- Note type definitions

### Instructions

1. **Create notes section component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `OrderNotes.tsx`
   - Set up component structure

2. **Import required dependencies**
   - Import Card components
   - Import ScrollArea component
   - Import AddNoteForm from Task 47
   - Import icons from Lucide React
   - Import Note type

3. **Define component props interface**
   - Create OrderNotesProps interface
   - Include notes array of Note items
   - Include orderId for adding notes
   - Include onAddNote callback
   - Include isLoading boolean

4. **Build notes section structure**
   - Use Card component as wrapper
   - Add CardHeader with "Notes" title
   - Include filter/search controls
   - Add CardContent for notes list
   - Include AddNoteForm at bottom

5. **Create notes list container**
   - Display notes in reverse chronological order
   - Use ScrollArea if many notes
   - Set max height (e.g., 400px)
   - Apply proper spacing between notes

6. **Render individual note items**
   - Map through notes array
   - Display note content
   - Show author and timestamp
   - Apply note type styling
   - Include edit/delete actions

7. **Format note display**
   - Show note text prominently
   - Display author name with avatar
   - Format timestamp as relative
   - Show "Internal" or "Customer" badge
   - Apply card or box styling per note

8. **Add note type indicator**
   - Internal notes: Lock icon, muted
   - Customer notes: User icon, normal
   - System notes: Cog icon, light
   - Use colored badges or backgrounds

9. **Implement note filtering**
   - Filter by type (Internal/Customer/All)
   - Add filter tabs or dropdown
   - Update display based on filter
   - Show count per type

10. **Add search functionality**
    - Search input for note text
    - Filter notes by search query
    - Highlight matching text
    - Clear search button

11. **Display note metadata**
    - Author name and role
    - Created timestamp
    - Last edited indicator
    - Note type/visibility

12. **Add empty state**
    - Show when no notes exist
    - Display "No notes yet" message
    - Include illustration or icon
    - Encourage adding first note

13. **Add loading state**
    - Show skeleton note items
    - Display 2-3 skeleton entries
    - Maintain layout structure
    - Use shimmer effect

14. **Handle long notes**
    - Truncate very long notes
    - Add "Read more" expansion
    - Show full note on click
    - Smooth expand/collapse

15. **Style notes section**
    - Apply consistent spacing
    - Use alternating backgrounds
    - Add subtle borders
    - Ensure readability

### Notes Section Layout

```
┌─────────────────────────────────┐
│ Notes                     [All▼]│
├─────────────────────────────────┤
│ [Search notes...]               │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🔒 Internal                 │ │
│ │ Need to verify payment      │ │
│ │ by: Admin • 2 hours ago     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 👤 Customer Facing          │ │
│ │ Thank you for your order    │ │
│ │ by: Sales • 1 day ago       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ⚙ System                    │ │
│ │ Payment confirmed           │ │
│ │ by: System • 2 days ago     │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [+ Add Note]                    │
└─────────────────────────────────┘
```

### Note Item Structure

```
Individual Note:
┌─────────────────────────────────┐
│ 🔒 Internal                     │  ← Type Badge
│                                 │
│ Need to verify payment details  │  ← Note Content
│ before shipping the order       │
│                                 │
│ by: John Doe • 2 hours ago      │  ← Author & Time
│                     [Edit] [Del]│  ← Actions
└─────────────────────────────────┘
```

### Note Type Configuration

| Type | Icon | Badge Color | Visibility | Description |
|------|------|-------------|------------|-------------|
| Internal | Lock | Gray | Staff only | Private note |
| Customer | User | Blue | Customer visible | Shared note |
| System | Cog | Purple | Staff only | Auto-generated |

### Filter Options

```
Filter Tabs:
┌──────┬──────────┬──────────┬────────┐
│ All  │ Internal │ Customer │ System │
│ (15) │   (8)    │   (5)    │  (2)   │
└──────┴──────────┴──────────┴────────┘
        ↑ Active tab highlighted
```

### Search Functionality

```
Search Flow:
User types query
    │
    ▼
Filter notes array
    │
    ├─→ Match note.content
    ├─→ Match note.author
    ├─→ Match note.tags
    │
    ▼
Display filtered results
    │
    └─→ Highlight matching text
```

### Note Data Structure

```typescript
interface Note {
  id: string;
  order_id: string;
  type: 'internal' | 'customer' | 'system';
  content: string;
  author_id: string;
  author_name: string;
  author_role: string;
  created_at: string;
  updated_at?: string;
  is_edited: boolean;
}
```

### Expected Outcome
- Organized notes display
- Clear type differentiation
- Chronological ordering
- Search and filter working
- Add note form present
- Empty and loading states
- Professional appearance

### Verification Checklist
- [ ] OrderNotes component created
- [ ] Card wrapper renders
- [ ] Notes list displays
- [ ] Note items format correctly
- [ ] Type badges show
- [ ] Author and time display
- [ ] Filter tabs work
- [ ] Search functionality works
- [ ] Empty state shows
- [ ] Loading skeleton displays
- [ ] AddNoteForm included
- [ ] Component properly typed

---

## Task 47: Create Add Note Form

### Overview
Create the AddNoteForm component allowing users to add new notes to the order. This form includes a textarea for note content, note type selector (Internal/Customer), and submit button. Integrates with the order notes section and provides validation.

### Dependencies
- Task 46: Create Order Notes Section
- Form components from UI library
- React Hook Form and Zod validation

### Instructions

1. **Create add note form component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `AddNoteForm.tsx`
   - Set up form with React Hook Form

2. **Import required dependencies**
   - Import useForm from React Hook Form
   - Import Textarea component
   - Import Select component for note type
   - Import Button component
   - Import toast for notifications

3. **Define component props interface**
   - Create AddNoteFormProps interface
   - Include orderId property
   - Include onSubmit callback
   - Include isSubmitting boolean

4. **Create form validation schema**
   - Use Zod for validation
   - Content: Required, min 1 char, max 1000 chars
   - Type: Required, enum (internal/customer)
   - Validate on submit

5. **Initialize form with React Hook Form**
   - Call useForm hook with schema
   - Set default values (type: 'internal')
   - Configure validation mode
   - Get form methods (register, handleSubmit, etc.)

6. **Build form structure**
   - Create form element
   - Add note type selector at top
   - Add textarea for content
   - Add submit button
   - Apply proper spacing

7. **Create note type selector**
   - Use RadioGroup or Select component
   - Options: Internal, Customer
   - Show icon for each type
   - Default to Internal
   - Apply inline or stacked layout

8. **Create note content textarea**
   - Use Textarea component
   - Placeholder: "Add a note..."
   - Min rows: 3
   - Max rows: 8
   - Auto-resize as typing
   - Character count indicator

9. **Add character counter**
   - Display current/max characters
   - Format: "0 / 1000"
   - Position below textarea
   - Change color near limit
   - Prevent submit if over limit

10. **Create submit button**
    - Label: "Add Note"
    - Primary style
    - Disable when submitting
    - Show loading spinner
    - Full width or right-aligned

11. **Implement form submission**
    - Validate form data
    - Call onSubmit callback with data
    - Show success toast
    - Clear form after success
    - Handle errors gracefully

12. **Add form reset functionality**
    - Reset form after successful submit
    - Clear textarea
    - Reset type to default
    - Reset validation errors

13. **Handle submission errors**
    - Display validation errors
    - Show API error messages
    - Don't clear form on error
    - Allow user to correct and retry

14. **Add keyboard shortcuts**
    - Cmd/Ctrl + Enter to submit
    - Escape to clear form
    - Tab to move between fields
    - Improve user experience

15. **Style form components**
    - Apply consistent spacing
    - Use proper form layout
    - Clear visual hierarchy
    - Accessible form controls

### Add Note Form Layout

```
┌─────────────────────────────────┐
│ Add Note                        │
├─────────────────────────────────┤
│                                 │
│ Note Type:                      │
│ ○ Internal  ○ Customer          │
│   ↑ Radio buttons               │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Add a note...               │ │
│ │                             │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│ 0 / 1000 characters             │
│                                 │
│              [Add Note]         │
│              ↑ Submit button    │
│                                 │
└─────────────────────────────────┘
```

### Form Fields Configuration

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| type | Radio/Select | Yes | Enum: internal, customer |
| content | Textarea | Yes | Min: 1, Max: 1000 chars |

### Note Type Options

```
Radio Group Layout:
┌────────────────────────────────┐
│ ● Internal                     │  ← Selected
│   Private note for staff only  │
│                                │
│ ○ Customer Facing              │
│   Visible to customer          │
└────────────────────────────────┘
```

### Character Counter States

| Characters | Display | Color |
|-----------|---------|-------|
| 0-900 | X / 1000 | Muted (gray) |
| 901-950 | X / 1000 | Warning (orange) |
| 951-1000 | X / 1000 | Critical (red) |
| > 1000 | Over limit! | Error (red) |

### Form Submission Flow

```
User fills form
    │
    ▼
User clicks "Add Note"
    │
    ▼
Validate form data
    │
    ├─→ Invalid
    │   └─→ Show validation errors
    │       └─→ User corrects
    │
    └─→ Valid
        │
        ▼
    Call onSubmit(data)
        │
        ├─→ Success
        │   ├─→ Show success toast
        │   ├─→ Clear form
        │   ├─→ Update notes list
        │   └─→ Focus back to textarea
        │
        └─→ Error
            ├─→ Show error toast
            ├─→ Keep form data
            └─→ Allow retry
```

### Form Data Structure

```typescript
interface AddNoteFormData {
  type: 'internal' | 'customer';
  content: string;
}

// Submitted data
{
  order_id: string,
  type: 'internal' | 'customer',
  content: string,
  author_id: string (from auth context)
}
```

### Validation Schema (Zod)

```typescript
const addNoteSchema = z.object({
  type: z.enum(['internal', 'customer']),
  content: z.string()
    .min(1, 'Note cannot be empty')
    .max(1000, 'Note too long (max 1000 chars)')
    .trim()
});
```

### Expected Outcome
- Functional add note form
- Type selection working
- Textarea auto-resizing
- Character counter updating
- Validation errors showing
- Successful submission
- Form clears after submit
- Professional appearance

### Verification Checklist
- [ ] AddNoteForm component created
- [ ] Form renders correctly
- [ ] Type selector works
- [ ] Textarea displays
- [ ] Character counter updates
- [ ] Validation schema working
- [ ] Submit button functions
- [ ] Loading state shows
- [ ] Success toast displays
- [ ] Form resets after submit
- [ ] Error handling works
- [ ] Keyboard shortcuts work
- [ ] Component properly typed

---

## Task 48: Create Status Update Modal

### Overview
Create the StatusUpdateModal component allowing users to change the order status. This modal displays current status, available status transitions, optional note field, and confirmation button. Includes validation for allowed status changes and customer notification option.

### Dependencies
- Task 34: Create Order Details Header (trigger)
- Modal/Dialog component from UI library
- Order status type definitions

### Instructions

1. **Create status update modal component file**
   - Navigate to `frontend/components/modules/sales/Orders/OrderDetails/` directory
   - Create file `StatusUpdateModal.tsx`
   - Set up modal with form

2. **Import required dependencies**
   - Import Dialog components
   - Import useForm from React Hook Form
   - Import Select component
   - Import Textarea component
   - Import Checkbox component
   - Import Button component

3. **Define component props interface**
   - Create StatusUpdateModalProps interface
   - Include isOpen boolean
   - Include onClose callback
   - Include order property
   - Include onSubmit callback

4. **Build modal structure**
   - Use Dialog component
   - Add DialogHeader with title
   - Add DialogContent with form
   - Add DialogFooter with buttons
   - Apply proper sizing (max-w-md)

5. **Display current status**
   - Show current order status prominently
   - Use OrderStatusBadge component
   - Label: "Current Status:"
   - Apply subtle background

6. **Create new status selector**
   - Use Select component
   - Label: "New Status:"
   - Populate with allowed transitions
   - Disable invalid status changes
   - Show tooltips for disabled options

7. **Define allowed status transitions**
   - Draft → Confirmed, Cancelled
   - Confirmed → Processing, Cancelled
   - Processing → Shipped, Cancelled
   - Shipped → Delivered
   - Delivered → (No changes)
   - Cancelled → (No changes)

8. **Add status transition validation**
   - Check if transition is allowed
   - Disable invalid options in select
   - Show warning if trying invalid transition
   - Provide clear error messages

9. **Create note field**
   - Add optional Textarea
   - Label: "Note (Optional):"
   - Placeholder: "Add a note about this status change..."
   - Max length: 500 characters
   - Character counter

10. **Add customer notification checkbox**
    - Label: "Notify customer via email"
    - Default: checked for customer-facing changes
    - Show email preview link (optional)
    - Disabled for internal status changes

11. **Add confirmation message**
    - Show impact of status change
    - Example: "This will mark the order as confirmed"
    - Use info alert or message box
    - Position above buttons

12. **Create action buttons**
    - Cancel button (secondary)
    - Update Status button (primary)
    - Disable update if invalid
    - Show loading state when submitting

13. **Implement form submission**
    - Validate new status selection
    - Validate note length
    - Call onSubmit with data
    - Close modal on success
    - Show error on failure

14. **Handle submission response**
    - Show success toast
    - Update order data
    - Close modal
    - Refresh timeline
    - Handle errors gracefully

15. **Add keyboard shortcuts**
    - Escape to close
    - Enter to submit (when valid)
    - Tab navigation between fields

### Status Update Modal Layout

```
┌─────────────────────────────────────┐
│ Update Order Status            [×]  │
├─────────────────────────────────────┤
│                                     │
│ Current Status:                     │
│ ┌─────────────────────────────────┐ │
│ │ [●] Processing                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ New Status:                         │
│ ┌─────────────────────────────────┐ │
│ │ Select new status         [▼]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Note (Optional):                    │
│ ┌─────────────────────────────────┐ │
│ │ Add a note...                   │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ 0 / 500                             │
│                                     │
│ ☑ Notify customer via email         │
│                                     │
│ ℹ This will mark the order as       │
│   shipped and send tracking info.   │
│                                     │
├─────────────────────────────────────┤
│          [Cancel]  [Update Status]  │
└─────────────────────────────────────┘
```

### Allowed Status Transitions Matrix

| From Status | Allowed To | Restricted |
|-------------|------------|------------|
| Draft | Confirmed, Cancelled | All others |
| Confirmed | Processing, Cancelled | All others |
| Processing | Shipped, Cancelled | All others |
| Shipped | Delivered | All others |
| Delivered | (None) | All |
| Cancelled | (None) | All |

### Status Transition Logic

```
Validate Transition:
    │
    ├─→ Get current_status
    ├─→ Get new_status
    │
    ▼
Check allowedTransitions map
    │
    ├─→ Valid transition
    │   └─→ Allow update
    │       └─→ Show confirmation
    │
    └─→ Invalid transition
        └─→ Disable option
            └─→ Show tooltip explaining why
```

### Customer Notification Rules

| Status Transition | Notify Default | Email Content |
|-------------------|----------------|---------------|
| Draft → Confirmed | Yes | Order confirmation |
| Confirmed → Processing | No | - |
| Processing → Shipped | Yes | Shipping notification |
| Shipped → Delivered | Yes | Delivery confirmation |
| Any → Cancelled | Yes | Cancellation notice |

### Confirmation Messages by Status

| New Status | Confirmation Message |
|------------|---------------------|
| Confirmed | This will confirm the order and may trigger payment processing |
| Processing | This will start order processing and notify warehouse |
| Shipped | This will mark the order as shipped and send tracking info |
| Delivered | This will mark the order as delivered and request feedback |
| Cancelled | This will cancel the order and may trigger refund process |

### Form Data Structure

```typescript
interface StatusUpdateFormData {
  new_status: OrderStatus;
  note?: string;
  notify_customer: boolean;
}

// Submitted data
{
  order_id: string,
  status_from: OrderStatus,
  status_to: OrderStatus,
  note?: string,
  notify_customer: boolean,
  user_id: string
}
```

### Expected Outcome
- Functional status update modal
- Current status displayed
- Status selector working
- Only valid transitions allowed
- Optional note field
- Customer notification option
- Confirmation message shown
- Successful status update
- Modal closes after success

### Verification Checklist
- [ ] StatusUpdateModal created
- [ ] Modal opens/closes correctly
- [ ] Current status displays
- [ ] Status selector populated
- [ ] Only valid statuses enabled
- [ ] Invalid options disabled
- [ ] Note field works
- [ ] Character counter updates
- [ ] Notification checkbox functions
- [ ] Confirmation message shows
- [ ] Submit button works
- [ ] Loading state displays
- [ ] Success updates order
- [ ] Error handling works
- [ ] Component properly typed

---

## Summary

This document covered the creation of order item row, totals calculation display, visual status timeline with history, notes section with filtering, add note form, and status update modal. These components complete the order details functionality with comprehensive interaction capabilities.

### Completed Components

1. **OrderItemRow** - Individual line item with product details
2. **OrderTotals** - Financial summary with calculations
3. **OrderTimeline** - Visual chronological history
4. **TimelineItem** - Individual timeline entry
5. **OrderNotes** - Notes list with filtering
6. **AddNoteForm** - Form to add new notes
7. **StatusUpdateModal** - Change order status with validation

### Key Features Delivered

- Detailed line item display
- Accurate financial calculations
- Visual timeline with status history
- Internal and customer notes
- Note filtering and search
- Status change workflow
- Customer notification options
- Form validation and error handling

### Next Steps

Proceed to **Group D: Invoice Management** to build invoice listing, details page with PDF preview, and invoice sending capabilities.

---

**End of Document 02**
