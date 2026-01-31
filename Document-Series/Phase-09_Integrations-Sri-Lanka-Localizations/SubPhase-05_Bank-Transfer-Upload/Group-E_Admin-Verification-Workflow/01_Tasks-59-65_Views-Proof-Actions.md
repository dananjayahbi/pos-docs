# Tasks 59-65: Admin Views, Proof Preview & Actions

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** E - Admin Verification Workflow  
> **Document:** 01 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-D: 02_Tasks-52-58_Storage-API-Verify.md](../Group-D_Proof-Upload-Verification/02_Tasks-52-58_Storage-API-Verify.md)
- **→ Next Document:** [02_Tasks-66-72_API-Email-Verify.md](02_Tasks-66-72_API-Email-Verify.md)

---

## Document Overview

This document covers the creation of the admin verification workflow interface in the ERP dashboard. It establishes the pending payments view where admins can review all bank transfer submissions awaiting verification. It creates a detailed payment view showing full order information, customer details, transaction data, and uploaded proof documents. It implements sophisticated proof preview components with image zoom/pan capabilities and PDF viewing functionality. It provides verify and reject action buttons with appropriate styling and confirmation flows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Pending Payments View | Medium | 45 min |
| 60 | Payment Detail View | Medium | 60 min |
| 61 | Proof Preview Component | Medium | 40 min |
| 62 | Image Viewer | Medium | 45 min |
| 63 | PDF Viewer | Medium | 45 min |
| 64 | Verify Button | Low | 20 min |
| 65 | Reject Button | Low | 20 min |

---

## Task 59: Pending Payments View

### Overview
Create the pending payments list view in the ERP dashboard at `/erp/payments/bank-transfer`. This view displays all bank transfer payments with PENDING status that require admin verification. The view provides filtering, sorting, and search capabilities to help admins efficiently manage the verification queue. Each row shows essential information and links to the detail view for full verification workflow.

### Dependencies
- Group-D Task 58: Upload verification is complete
- ERP dashboard layout exists (Phase-07)
- Data table components are available
- Payment model with bank transfer fields created

### Instructions

1. **Create the page route structure**
   - Navigate to `frontend/app/(erp)/payments/` directory
   - Create new folder named `bank-transfer`
   - Create `page.tsx` file inside bank-transfer folder
   - This creates route: `/erp/payments/bank-transfer`

2. **Set up page imports**
   - Import necessary React hooks (useState, useEffect, useMemo)
   - Import data table component from UI library
   - Import date formatting utilities
   - Import currency formatting utilities
   - Import API client for payments endpoint
   - Import Link component for navigation

3. **Define page metadata**
   - Set page title: "Bank Transfer Verification"
   - Set description for SEO purposes
   - Configure breadcrumbs for navigation

4. **Create state management**
   - State for payments list (fetched data)
   - State for loading indicator
   - State for error handling
   - State for filter values
   - State for sort configuration
   - State for search query
   - State for pagination (page, limit)

5. **Implement data fetching**
   - Create useEffect hook for initial data load
   - Call GET `/api/payments/bank-transfers/pending/` endpoint
   - Filter by status = PENDING
   - Sort by created_at ascending (oldest first)
   - Include pagination parameters
   - Handle loading and error states

6. **Define table columns**
   - Payment ID (clickable link to detail view)
   - Order ID (with link to order detail)
   - Customer Name (from order)
   - Amount (formatted with currency)
   - Submitted Date (formatted timestamp)
   - Days Pending (calculated from submitted date)
   - Proof Status (icon indicator: uploaded/missing)
   - Quick Actions (view button)

7. **Implement filter controls**
   - Date range filter (submitted date)
   - Amount range filter
   - Customer search filter
   - Proof status filter (has proof / no proof)
   - Reset filters button

8. **Add sort functionality**
   - Sort by submitted date (oldest/newest)
   - Sort by amount (low/high)
   - Sort by days pending
   - Default sort: oldest first

9. **Implement search feature**
   - Search by payment ID
   - Search by order ID
   - Search by customer name
   - Debounce search input (300ms)

10. **Add pagination controls**
    - Show total count of pending payments
    - Items per page selector (10, 25, 50, 100)
    - Previous/Next buttons
    - Page number display
    - Jump to page input

11. **Create empty state**
    - Show when no pending payments
    - Display friendly message
    - Provide context about workflow

12. **Add loading states**
    - Skeleton loaders for table rows
    - Loading spinner during data fetch
    - Disable controls during load

13. **Implement error handling**
    - Show error message if fetch fails
    - Provide retry button
    - Log errors to console for debugging

14. **Add header section**
    - Page title and description
    - Pending count badge
    - Refresh button to reload data
    - Filter toggle button

### Page Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Bank Transfer Verification                             │
│  Review and approve pending payment proofs              │
│                                                          │
│  [Refresh] [Filters ▼]              Pending: (15) 🔔   │
├─────────────────────────────────────────────────────────┤
│  [Search: Payment ID, Order ID, Customer...]            │
│                                                          │
│  ┌─ Filters (expandable) ─────────────────────────┐    │
│  │ Date Range: [From] [To]                         │    │
│  │ Amount Range: [Min] [Max]                       │    │
│  │ Proof Status: [All | Has Proof | No Proof]     │    │
│  │ [Apply] [Reset]                                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─ Pending Payments Table ─────────────────────┐      │
│  │ ID    Order   Customer   Amount   Date  Days  │      │
│  │─────────────────────────────────────────────  │      │
│  │ #001  ORD123  John Doe  25000  Jan20   11d   │      │
│  │ #002  ORD124  Jane S.   15000  Jan19   12d   │      │
│  │ #003  ORD125  Mike W.   30000  Jan18   13d   │      │
│  └───────────────────────────────────────────────┘      │
│                                                          │
│  Showing 1-10 of 15 | [Prev] [1][2] [Next]             │
└─────────────────────────────────────────────────────────┘
```

### Table Columns Definition

| Column | Display | Sort | Filter | Action |
|--------|---------|------|--------|--------|
| Payment ID | PAY001 | Yes | Search | Link to detail |
| Order ID | ORD123 | Yes | Search | Link to order |
| Customer | John Doe | Yes | Search | Display only |
| Amount | LKR 25,000.00 | Yes | Range | Display only |
| Submitted | Jan 20, 2026 10:30 AM | Yes | Range | Display only |
| Days Pending | 11 days | Yes | No | Badge (warn >7) |
| Proof Status | ✓ Uploaded | No | Yes | Icon indicator |
| Actions | [View] | No | No | Button to detail |

### Filter Options

| Filter Type | Options | Default |
|-------------|---------|---------|
| Date Range | From/To date pickers | Last 30 days |
| Amount Range | Min/Max inputs | No limit |
| Proof Status | All, Has Proof, No Proof | All |
| Search | Text input (ID, customer) | Empty |

### Sort Options

| Sort By | Order | Default |
|---------|-------|---------|
| Submitted Date | Asc/Desc | Asc (oldest first) |
| Amount | Asc/Desc | None |
| Days Pending | Asc/Desc | None |
| Customer Name | Asc/Desc | None |

### Visual Indicators

| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| Has Proof | Green | ✓ | Document uploaded |
| No Proof | Orange | ⚠ | Awaiting upload |
| >7 Days | Yellow | ⏰ | Review urgent |
| >14 Days | Red | 🔴 | Very urgent |

### API Integration

```
GET /api/payments/bank-transfers/pending/

Query Parameters:
- status=PENDING (required)
- page=1
- limit=25
- sort_by=created_at
- sort_order=asc
- search=<query>
- date_from=<date>
- date_to=<date>
- amount_min=<number>
- amount_max=<number>
- has_proof=<boolean>

Response:
{
  "count": 15,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "payment_id": "PAY001",
      "order_id": "ORD123",
      "order": {
        "customer_name": "John Doe",
        "customer_email": "john@example.com"
      },
      "amount": "25000.00",
      "currency": "LKR",
      "created_at": "2026-01-20T10:30:00Z",
      "has_proof": true,
      "proof_count": 2,
      "days_pending": 11
    }
  ]
}
```

### Expected Outcome
- Pending payments page accessible at `/erp/payments/bank-transfer`
- All pending bank transfers displayed in sortable table
- Filter and search functionality working
- Pagination controls for large datasets
- Links to detail view for each payment
- Visual indicators for urgent items
- Responsive design for various screen sizes

### Verification Checklist
- [ ] Page route created correctly
- [ ] Data fetches from API successfully
- [ ] Table displays all required columns
- [ ] Filters work correctly
- [ ] Search functionality responsive
- [ ] Sorting updates data correctly
- [ ] Pagination controls function
- [ ] Links navigate to detail view
- [ ] Visual indicators display correctly
- [ ] Empty state shows when appropriate
- [ ] Loading states display properly
- [ ] Error handling works
- [ ] Responsive on mobile devices

---

## Task 60: Payment Detail View

### Overview
Create the payment detail view at `/erp/payments/bank-transfer/[id]` that displays comprehensive information about a specific bank transfer payment. This view is the central hub for admin verification workflow, showing full order details, customer information, transaction data, uploaded proof documents, and action buttons for verification or rejection. The layout is organized into logical sections for efficient review and decision-making.

### Dependencies
- Task 59: Pending Payments View
- Order model and API available
- Customer data accessible
- Transaction data structure defined

### Instructions

1. **Create the dynamic route**
   - Navigate to `frontend/app/(erp)/payments/bank-transfer/` directory
   - Create new folder named `[id]`
   - Create `page.tsx` file inside [id] folder
   - This creates dynamic route: `/erp/payments/bank-transfer/[id]`

2. **Set up page props and params**
   - Define page component with params prop
   - Extract id from params object
   - Type params correctly for TypeScript

3. **Configure page metadata**
   - Set dynamic title: "Payment #[ID] - Verification"
   - Configure description
   - Set up breadcrumbs: Payments > Bank Transfer > [ID]

4. **Create state management**
   - State for payment data (full details)
   - State for order data
   - State for customer data
   - State for proof documents list
   - State for loading indicator
   - State for error state
   - State for selected proof (for preview)

5. **Implement data fetching**
   - Create useEffect for initial load
   - Fetch payment details: GET `/api/payments/bank-transfers/{id}/`
   - Include related order data (expand=order)
   - Include customer data (expand=customer)
   - Include proof documents (expand=proofs)
   - Handle 404 if payment not found
   - Handle permission errors

6. **Create page header section**
   - Display payment ID prominently
   - Show status badge (PENDING, CONFIRMED, REJECTED)
   - Display submitted timestamp
   - Show days since submission
   - Add back button to list view

7. **Design order information section**
   - Section title: "Order Details"
   - Order ID with link to order page
   - Order date
   - Order status
   - Order total amount
   - Line items summary (count)
   - Billing address

8. **Design customer information section**
   - Section title: "Customer Information"
   - Customer full name
   - Email address (with mailto link)
   - Phone number (with tel link)
   - Customer account creation date
   - Customer order history count
   - Trust indicator (new/returning customer)

9. **Design transaction details section**
   - Section title: "Transaction Details"
   - Bank transfer amount
   - Currency (LKR)
   - Reference number (from form)
   - Transfer date (from form)
   - Depositor name (from form)
   - Transfer method (online/branch)
   - Bank account used (destination)
   - Account name
   - Account number

10. **Design proof documents section**
    - Section title: "Uploaded Proof Documents"
    - List all uploaded files
    - Show filename, file type, file size
    - Show upload timestamp
    - Thumbnail preview for images
    - File icon for PDFs
    - View button to open in preview
    - Download button for each file

11. **Add verification timeline section**
    - Section title: "Verification Timeline"
    - Show submission event
    - Show any admin views
    - Show verification/rejection when done
    - Display admin user who took action
    - Show timestamp for each event

12. **Implement action buttons area**
    - Primary action: Verify button (green)
    - Secondary action: Reject button (red)
    - Disable if already verified/rejected
    - Show confirmation dialogs
    - Position prominently at top and bottom

13. **Create loading state**
    - Skeleton loaders for each section
    - Show loading spinner during fetch
    - Maintain page structure while loading

14. **Implement error handling**
    - Show error if payment not found
    - Show error if fetch fails
    - Provide retry button
    - Redirect if unauthorized

15. **Add responsive layout**
    - Two-column layout on desktop
    - Single column on mobile
    - Sticky action buttons on scroll
    - Collapsible sections on mobile

### Page Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to List                                          │
│                                                          │
│  Payment #PAY001                    [PENDING] ⏰ 11d    │
│  Submitted: Jan 20, 2026 10:30 AM                       │
│                                                          │
│  [✓ Confirm Payment] [✗ Reject Payment]                │
├─────────────────────────────────────────────────────────┤
│  ┌─ Order Details ───────┐  ┌─ Customer Info ────┐    │
│  │ Order: #ORD123         │  │ Name: John Doe      │    │
│  │ Date: Jan 20, 2026     │  │ Email: john@...     │    │
│  │ Status: Processing     │  │ Phone: +94...       │    │
│  │ Total: LKR 25,000      │  │ Since: 2024         │    │
│  │ Items: 3               │  │ Orders: 15 (return) │    │
│  └────────────────────────┘  └─────────────────────┘    │
│                                                          │
│  ┌─ Transaction Details ──────────────────────────┐    │
│  │ Amount: LKR 25,000.00                           │    │
│  │ Reference: REF123456                            │    │
│  │ Transfer Date: Jan 20, 2026                     │    │
│  │ Depositor: John Doe                             │    │
│  │ Method: Online Banking                          │    │
│  │ Bank Account: Commercial Bank - 1234567890     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─ Uploaded Proof Documents ──────────────────────┐   │
│  │ 📄 bank-receipt.pdf (234 KB)                     │   │
│  │    Uploaded: Jan 20, 2026 10:32 AM               │   │
│  │    [View] [Download]                             │   │
│  │                                                   │   │
│  │ 🖼️ transfer-screenshot.jpg (567 KB)              │   │
│  │    Uploaded: Jan 20, 2026 10:33 AM               │   │
│  │    [Thumbnail] [View] [Download]                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Verification Timeline ─────────────────────────┐   │
│  │ ● Jan 20, 10:30 AM - Submitted by customer      │   │
│  │ ● Jan 20, 11:15 AM - Viewed by Admin User       │   │
│  │ ○ Pending verification...                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [✓ Confirm Payment] [✗ Reject Payment]                │
└─────────────────────────────────────────────────────────┘
```

### Section Breakdown

| Section | Purpose | Key Fields |
|---------|---------|------------|
| Header | Quick overview | Payment ID, status, age |
| Order Details | Order context | Order ID, date, amount, items |
| Customer Info | Customer verification | Name, contact, history, trust |
| Transaction | Bank transfer data | Amount, reference, date, method |
| Proof Documents | Evidence review | Files, types, timestamps |
| Timeline | Audit trail | Events, users, timestamps |
| Actions | Decision buttons | Verify, Reject |

### Order Details Fields

| Field | Display | Source |
|-------|---------|--------|
| Order ID | ORD123 (link) | order.order_number |
| Order Date | Jan 20, 2026 | order.created_at |
| Order Status | Processing | order.status |
| Order Total | LKR 25,000.00 | order.total_amount |
| Item Count | 3 items | order.line_items.count() |
| Billing Address | Address format | order.billing_address |

### Customer Information Fields

| Field | Display | Source |
|-------|---------|--------|
| Full Name | John Doe | customer.full_name |
| Email | john@example.com | customer.email |
| Phone | +94 77 123 4567 | customer.phone |
| Member Since | 2024 | customer.created_at.year |
| Total Orders | 15 orders | customer.orders.count() |
| Customer Type | Returning | Based on order count |

### Transaction Details Fields

| Field | Display | Source |
|-------|---------|--------|
| Amount | LKR 25,000.00 | payment.amount |
| Reference | REF123456 | payment.reference_number |
| Transfer Date | Jan 20, 2026 | payment.transfer_date |
| Depositor Name | John Doe | payment.depositor_name |
| Transfer Method | Online Banking | payment.transfer_method |
| Bank Account | Destination account | payment.bank_account |
| Account Name | Account holder | bank_account.account_name |
| Account Number | 1234567890 | bank_account.account_number |

### Proof Documents Display

| Property | Display | Action |
|----------|---------|--------|
| Filename | bank-receipt.pdf | Display name |
| File Type | PDF/Image | Icon indicator |
| File Size | 234 KB | Formatted size |
| Uploaded | Jan 20, 10:32 AM | Timestamp |
| Thumbnail | Preview image | Show for images |
| View Button | Opens preview | Trigger Task 61 |
| Download Button | Download file | Direct download |

### Timeline Events

| Event | Timestamp | Actor | Display |
|-------|-----------|-------|---------|
| Submitted | Auto | Customer | "Submitted by customer" |
| Viewed | Auto | Admin | "Viewed by [admin name]" |
| Verified | Manual | Admin | "Confirmed by [admin name]" |
| Rejected | Manual | Admin | "Rejected by [admin name]: [reason]" |

### API Integration

```
GET /api/payments/bank-transfers/{id}/

Query Parameters:
- expand=order,customer,proofs,timeline

Response:
{
  "id": "uuid",
  "payment_id": "PAY001",
  "status": "PENDING",
  "amount": "25000.00",
  "currency": "LKR",
  "reference_number": "REF123456",
  "transfer_date": "2026-01-20",
  "depositor_name": "John Doe",
  "transfer_method": "online",
  "created_at": "2026-01-20T10:30:00Z",
  "days_pending": 11,
  "order": {
    "id": "uuid",
    "order_number": "ORD123",
    "total_amount": "25000.00",
    "status": "PROCESSING",
    "line_items_count": 3,
    "billing_address": {...}
  },
  "customer": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+94771234567",
    "created_at": "2024-01-15T00:00:00Z",
    "total_orders": 15
  },
  "bank_account": {
    "account_name": "LankaCommerce Cloud",
    "account_number": "1234567890",
    "bank_name": "Commercial Bank"
  },
  "proofs": [
    {
      "id": "uuid",
      "file_name": "bank-receipt.pdf",
      "file_type": "application/pdf",
      "file_size": 234567,
      "file_url": "https://...",
      "uploaded_at": "2026-01-20T10:32:00Z"
    }
  ],
  "timeline": [
    {
      "event": "submitted",
      "timestamp": "2026-01-20T10:30:00Z",
      "actor": "customer"
    }
  ]
}
```

### Expected Outcome
- Payment detail page loads with all information
- All sections display correctly with proper data
- Order details show complete information
- Customer information builds trust context
- Transaction details clearly presented
- Proof documents listed with actions
- Timeline shows verification progress
- Action buttons ready for verification flow
- Responsive layout works on all devices
- Loading and error states handled properly

### Verification Checklist
- [ ] Dynamic route created correctly
- [ ] Payment data fetches successfully
- [ ] Header displays payment ID and status
- [ ] Order section shows all order details
- [ ] Customer section shows contact info
- [ ] Transaction section displays bank transfer data
- [ ] Proof documents listed with metadata
- [ ] Timeline shows submission event
- [ ] Verify and Reject buttons visible
- [ ] Buttons disabled if already processed
- [ ] Back button navigates to list
- [ ] Links to order page work
- [ ] Loading state displays
- [ ] Error handling works
- [ ] 404 page for invalid ID
- [ ] Responsive design functions

---

## Task 61: Proof Preview Component

### Overview
Create a reusable proof preview component that displays uploaded payment proof documents. This component serves as a container that determines the file type and renders the appropriate viewer (image viewer or PDF viewer). It provides download functionality, file metadata display, and a close/exit action. The component is designed to be used both as a modal overlay and as an inline preview within the payment detail view.

### Dependencies
- Task 60: Payment Detail View structure
- File storage URLs accessible
- Task 62 and 63 (Image/PDF viewers) will integrate here

### Instructions

1. **Create component file structure**
   - Navigate to `frontend/components/payments/` directory
   - Create new file: `ProofPreview.tsx`
   - Create supporting types file: `ProofPreview.types.ts`

2. **Define component props interface**
   - Proof document object (file data)
   - Display mode (modal or inline)
   - Close handler function
   - Download handler function
   - Optional className for styling

3. **Define proof document type**
   - File ID
   - File name
   - File type (MIME type)
   - File size
   - File URL
   - Upload timestamp
   - Uploader information

4. **Set up component structure**
   - Import React hooks (useState, useEffect, useMemo)
   - Import image viewer component (Task 62)
   - Import PDF viewer component (Task 63)
   - Import UI components (button, badge, icon)

5. **Create file type detection logic**
   - Determine if file is image (image/*)
   - Determine if file is PDF (application/pdf)
   - Handle unsupported file types
   - Use MIME type and file extension

6. **Implement conditional rendering**
   - Render image viewer for image files
   - Render PDF viewer for PDF files
   - Render generic file preview for others
   - Show error for corrupted files

7. **Create preview header**
   - Display file name prominently
   - Show file type badge
   - Show file size (formatted)
   - Show upload timestamp
   - Add close button (X icon)
   - Add download button

8. **Design modal mode layout**
   - Full-screen overlay with backdrop
   - Semi-transparent dark background
   - Close on backdrop click (optional)
   - ESC key to close
   - Centered content area
   - z-index layering correct

9. **Design inline mode layout**
   - Contained within parent bounds
   - No backdrop overlay
   - Fixed height container
   - Scrollable if needed
   - Maintains aspect ratio

10. **Implement download functionality**
    - Download button triggers file download
    - Use browser download API
    - Preserve original filename
    - Handle download errors
    - Show download progress if large file

11. **Add keyboard navigation**
    - ESC key closes modal
    - Arrow keys for multi-file navigation (future)
    - Tab navigation within header controls

12. **Implement error handling**
    - Show error if file fails to load
    - Display friendly error message
    - Provide retry button
    - Log error details

13. **Add loading state**
    - Show loading spinner while file loads
    - Display loading progress for large files
    - Skeleton loader for preview area

14. **Create file metadata section**
    - File details accordion (expandable)
    - Show uploaded by, timestamp
    - Show file dimensions (if image)
    - Show page count (if PDF)

### Component Structure

```
┌─────────────────────────────────────────────────────────┐
│  bank-receipt.pdf  [PDF] 234 KB           [↓] [✗]      │
│  Uploaded: Jan 20, 2026 10:32 AM                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                                                          │
│              [Viewer Component Area]                     │
│              (Image Viewer or PDF Viewer)                │
│                                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ⓘ File Details ▼                                       │
│     Uploaded by: Customer (John Doe)                    │
│     File size: 234 KB                                   │
│     File type: application/pdf                          │
└─────────────────────────────────────────────────────────┘
```

### Modal Mode Structure

```
┌───────────────────────────────────────────────────────┐
│                   [Dark Backdrop]                      │
│                                                        │
│   ┌─────────────────────────────────────────────┐    │
│   │  receipt.pdf [PDF] 234KB      [↓] [✗]      │    │
│   ├─────────────────────────────────────────────┤    │
│   │                                              │    │
│   │                                              │    │
│   │         [Viewer Component]                   │    │
│   │                                              │    │
│   │                                              │    │
│   └─────────────────────────────────────────────┘    │
│                                                        │
└───────────────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| proof | ProofDocument | Yes | File data object |
| mode | 'modal' \| 'inline' | No | Display mode (default: modal) |
| onClose | () => void | Yes | Close handler |
| onDownload | () => void | No | Download handler |
| className | string | No | Additional CSS classes |

### ProofDocument Type

| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique file identifier |
| fileName | string | Original file name |
| fileType | string | MIME type |
| fileSize | number | Size in bytes |
| fileUrl | string | Download/view URL |
| uploadedAt | string | ISO timestamp |
| uploadedBy | string | Uploader name |

### File Type Detection

| MIME Type | Category | Viewer |
|-----------|----------|--------|
| image/jpeg | Image | ImageViewer |
| image/png | Image | ImageViewer |
| image/gif | Image | ImageViewer |
| image/webp | Image | ImageViewer |
| application/pdf | PDF | PDFViewer |
| Other | Unsupported | GenericPreview |

### Header Controls

| Control | Icon | Action | Position |
|---------|------|--------|----------|
| Download | ↓ | Download file | Right |
| Close | ✗ | Close preview | Right-most |
| Filename | - | Display only | Left |
| File Badge | [PDF] | Display only | Center-left |
| File Size | - | Display only | Center-left |

### File Metadata Fields

| Field | Display | Format |
|-------|---------|--------|
| File Name | receipt.pdf | String |
| File Type | PDF Document | Friendly name |
| File Size | 234 KB | Formatted size |
| Dimensions | 1920 x 1080 | For images only |
| Page Count | 3 pages | For PDFs only |
| Uploaded | Jan 20, 10:32 AM | Formatted timestamp |
| Uploaded By | Customer (John Doe) | User display name |

### Keyboard Shortcuts

| Key | Action | Mode |
|-----|--------|------|
| ESC | Close preview | Modal only |
| Arrow Left | Previous file | Future feature |
| Arrow Right | Next file | Future feature |

### Loading States

| State | Display | Trigger |
|-------|---------|---------|
| Loading | Spinner + "Loading file..." | File fetch in progress |
| Error | Error icon + message | File load failed |
| Ready | Viewer component | File loaded successfully |

### Error Messages

| Error Type | Message | Action |
|------------|---------|--------|
| Load Failed | "Failed to load file" | [Retry] button |
| Unsupported Type | "File type not supported" | [Download] button |
| Not Found | "File not found" | [Close] button |
| Network Error | "Network error occurred" | [Retry] button |

### Expected Outcome
- Proof preview component created and reusable
- Automatically detects file type
- Renders appropriate viewer component
- Header displays file metadata
- Download functionality works
- Modal and inline modes both function
- Keyboard shortcuts work in modal mode
- Error and loading states display properly
- File details section expandable
- Responsive design adapts to screen size

### Verification Checklist
- [ ] Component file created
- [ ] Props interface defined
- [ ] File type detection works
- [ ] Image files render ImageViewer
- [ ] PDF files render PDFViewer
- [ ] Header shows file metadata
- [ ] Download button works
- [ ] Close button works
- [ ] Modal mode displays correctly
- [ ] Inline mode displays correctly
- [ ] Backdrop click closes modal
- [ ] ESC key closes modal
- [ ] Loading state shows
- [ ] Error handling works
- [ ] File details section expands
- [ ] Responsive on all devices

---

## Task 62: Image Viewer

### Overview
Create an advanced image viewer component with zoom, pan, and pinch capabilities for viewing uploaded payment proof images. This component provides an intuitive interface for admins to examine bank receipt screenshots and transfer confirmations in detail. It supports touch gestures for mobile devices and mouse controls for desktop, ensuring accessibility across all platforms.

### Dependencies
- Task 61: Proof Preview Component structure
- react-zoom-pan-pinch library or similar
- Image optimization utilities

### Instructions

1. **Install required library**
   - Install react-zoom-pan-pinch package
   - Alternative: react-image-zoom or custom implementation
   - Import necessary components from library

2. **Create component file**
   - Navigate to `frontend/components/payments/` directory
   - Create new file: `ImageViewer.tsx`
   - Create types file: `ImageViewer.types.ts`

3. **Define component props**
   - Image URL (required)
   - Alt text for accessibility
   - Max zoom level (default: 5)
   - Min zoom level (default: 1)
   - Enable pan (default: true)
   - Enable pinch zoom (default: true)

4. **Set up zoom/pan library**
   - Wrap image in TransformWrapper component
   - Configure TransformComponent for controls
   - Set initial scale to 1 (100%)
   - Set max scale to 5 (500% zoom)
   - Set min scale to 1 (no zoom out beyond original)
   - Enable smooth animations

5. **Implement zoom controls**
   - Zoom in button (+)
   - Zoom out button (-)
   - Reset button (fit to view)
   - Zoom level indicator (e.g., "200%")
   - Mouse wheel zoom support
   - Double-click to zoom

6. **Implement pan functionality**
   - Click and drag to pan
   - Touch and drag on mobile
   - Auto-center when zoomed out
   - Boundary limits (no infinite pan)
   - Smooth deceleration

7. **Add rotation controls**
   - Rotate left button (90° CCW)
   - Rotate right button (90° CW)
   - Reset rotation button
   - Maintain rotation state

8. **Create control toolbar**
   - Position at bottom of viewer
   - Semi-transparent background
   - Contains all control buttons
   - Show/hide on hover (desktop)
   - Always visible on mobile

9. **Implement touch gestures**
   - Pinch to zoom (two fingers)
   - Drag to pan (one finger when zoomed)
   - Double-tap to zoom in
   - Two-finger rotation

10. **Add loading state**
    - Show loading spinner while image loads
    - Display image dimensions when loaded
    - Handle image load errors
    - Progressive loading for large images

11. **Implement fullscreen mode**
    - Fullscreen button in toolbar
    - Browser fullscreen API
    - ESC to exit fullscreen
    - Maintain zoom/pan state

12. **Add keyboard shortcuts**
    - Plus/Equals key: Zoom in
    - Minus key: Zoom out
    - 0 key: Reset zoom
    - Arrow keys: Pan image
    - F key: Toggle fullscreen

13. **Create mobile-optimized view**
    - Larger touch targets for buttons
    - Gesture instructions on first load
    - Disable conflicting scroll behaviors
    - Optimize for portrait and landscape

14. **Add accessibility features**
    - Alt text for screen readers
    - ARIA labels for controls
    - Keyboard-accessible buttons
    - Focus indicators

### Component Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│                   [Image Display Area]                   │
│                   (Zoomable & Pannable)                  │
│                                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [↻] [↺] [−] [150%] [+] [⛶] [⤢]                        │
│  Rotate Rotate Zoom  Level Zoom Reset Full              │
└─────────────────────────────────────────────────────────┘
```

### Control Toolbar Buttons

| Button | Icon | Action | Shortcut |
|--------|------|--------|----------|
| Rotate Left | ↻ | Rotate 90° CCW | R |
| Rotate Right | ↺ | Rotate 90° CW | Shift+R |
| Zoom Out | − | Decrease zoom | - |
| Zoom Level | 150% | Display current zoom | - |
| Zoom In | + | Increase zoom | + |
| Reset View | ⛶ | Reset zoom/pan/rotation | 0 |
| Fullscreen | ⤢ | Toggle fullscreen | F |

### Zoom Behavior

| Action | Desktop | Mobile | Result |
|--------|---------|--------|--------|
| Zoom In | Click + button | Pinch out | Increase scale |
| Zoom Out | Click - button | Pinch in | Decrease scale |
| Wheel Zoom | Scroll wheel | N/A | Zoom at cursor |
| Double Click | Double click | Double tap | Zoom to 2x |
| Reset | Click reset | Tap reset | Back to 100% |

### Pan Behavior

| Action | Desktop | Mobile | Result |
|--------|---------|--------|--------|
| Pan | Click + drag | Touch + drag | Move image |
| Auto-center | Zoom out to 100% | Same | Center image |
| Boundaries | Stop at edge | Same | Can't pan beyond |

### Zoom Levels

| Level | Scale | Use Case |
|-------|-------|----------|
| Min | 1x (100%) | Full view |
| Default | 1x (100%) | Initial view |
| 2x | 2x (200%) | Read small text |
| 3x | 3x (300%) | Examine details |
| 4x | 4x (400%) | Very close inspection |
| Max | 5x (500%) | Maximum detail |

### Touch Gestures

| Gesture | Action | Platform |
|---------|--------|----------|
| Single tap | Show/hide controls | Mobile |
| Double tap | Zoom to 2x | Mobile |
| Pinch out | Zoom in | Mobile |
| Pinch in | Zoom out | Mobile |
| Drag (zoomed) | Pan image | Mobile |
| Two-finger rotate | Rotate image | Mobile |

### Keyboard Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| + or = | Zoom in | Increase zoom by 0.5x |
| - | Zoom out | Decrease zoom by 0.5x |
| 0 | Reset | Reset to original view |
| ← | Pan left | Move image left |
| → | Pan right | Move image right |
| ↑ | Pan up | Move image up |
| ↓ | Pan down | Move image down |
| R | Rotate CCW | Rotate 90° counter-clockwise |
| Shift+R | Rotate CW | Rotate 90° clockwise |
| F | Fullscreen | Toggle fullscreen mode |

### Props Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| imageUrl | string | required | Image source URL |
| altText | string | '' | Alt text for accessibility |
| maxZoom | number | 5 | Maximum zoom level |
| minZoom | number | 1 | Minimum zoom level |
| initialZoom | number | 1 | Starting zoom level |
| enablePan | boolean | true | Allow panning |
| enablePinch | boolean | true | Allow pinch zoom |
| showControls | boolean | true | Show control toolbar |

### Image Load States

| State | Display | Action |
|-------|---------|--------|
| Loading | Spinner + "Loading image..." | Wait |
| Loaded | Display image | Enable controls |
| Error | Error icon + message | Show retry |
| Dimensions | "1920 × 1080 px" | Display in toolbar |

### Error Handling

| Error | Message | Action |
|-------|---------|--------|
| Load failed | "Failed to load image" | Retry button |
| Invalid URL | "Invalid image URL" | Close viewer |
| Network error | "Network error" | Retry button |
| Unsupported format | "Unsupported image format" | Close viewer |

### Performance Optimization

| Optimization | Implementation |
|--------------|----------------|
| Lazy loading | Load image on demand |
| Image optimization | Serve WebP with fallback |
| Cache control | Browser caching headers |
| Progressive loading | Show low-res first |
| GPU acceleration | Use CSS transforms |

### Expected Outcome
- Image viewer component functional and smooth
- Zoom in/out works with multiple methods
- Pan functionality allows detailed inspection
- Rotation controls work properly
- Touch gestures work on mobile devices
- Keyboard shortcuts enhance desktop UX
- Control toolbar displays and hides appropriately
- Loading and error states handled
- Fullscreen mode available
- Performance optimized for large images

### Verification Checklist
- [ ] Component created and imported
- [ ] Image displays correctly
- [ ] Zoom in button increases zoom
- [ ] Zoom out button decreases zoom
- [ ] Mouse wheel zoom works
- [ ] Double-click zoom works
- [ ] Pan by dragging works
- [ ] Reset button restores original view
- [ ] Rotate buttons work
- [ ] Control toolbar visible
- [ ] Touch gestures work on mobile
- [ ] Pinch zoom works
- [ ] Keyboard shortcuts work
- [ ] Fullscreen mode works
- [ ] Loading state displays
- [ ] Error handling works
- [ ] Boundaries prevent infinite pan
- [ ] Smooth animations present

---

## Task 63: PDF Viewer

### Overview
Create a PDF viewer component for displaying uploaded bank statement PDFs and official transfer receipts. This component provides page navigation, zoom controls, and download functionality. It handles multi-page documents and provides a smooth viewing experience for reviewing payment proof documents in PDF format.

### Dependencies
- Task 61: Proof Preview Component structure
- react-pdf library (pdf.js wrapper)
- PDF file accessible via URL

### Instructions

1. **Install required library**
   - Install react-pdf package
   - Install pdfjs-dist (peer dependency)
   - Configure PDF.js worker

2. **Create component file**
   - Navigate to `frontend/components/payments/` directory
   - Create new file: `PDFViewer.tsx`
   - Create types file: `PDFViewer.types.ts`

3. **Define component props**
   - PDF file URL (required)
   - Initial page number (default: 1)
   - Enable text selection (default: true)
   - Scale/zoom level (default: 1.0)
   - onLoadSuccess callback
   - onLoadError callback

4. **Set up PDF.js worker**
   - Configure worker source path
   - Set worker from CDN or local bundle
   - Handle worker initialization errors

5. **Initialize PDF document**
   - Import Document component from react-pdf
   - Load PDF from URL
   - Handle loading state
   - Handle load errors
   - Get total page count on load

6. **Implement page rendering**
   - Import Page component from react-pdf
   - Render current page
   - Apply scale/zoom level
   - Enable text layer (for selection)
   - Render annotations if present

7. **Create page navigation controls**
   - Previous page button
   - Next page button
   - Page number input (go to page)
   - Current page indicator
   - Total pages display (e.g., "Page 2 of 5")
   - First page button
   - Last page button

8. **Implement zoom controls**
   - Zoom in button (increase scale)
   - Zoom out button (decrease scale)
   - Zoom level dropdown (50%, 75%, 100%, 125%, 150%, 200%)
   - Fit to width option
   - Fit to page option

9. **Add control toolbar**
   - Position at bottom of viewer
   - Contains navigation and zoom controls
   - Semi-transparent background
   - Always visible

10. **Implement page state management**
    - Track current page number
    - Track total page count
    - Track zoom scale
    - Track loading state per page
    - Prevent invalid page navigation

11. **Add keyboard navigation**
    - Arrow Up/Page Up: Previous page
    - Arrow Down/Page Down: Next page
    - Home: First page
    - End: Last page
    - Plus/Minus: Zoom in/out

12. **Create loading indicators**
    - Document loading spinner
    - Page loading spinner
    - Show loading progress for large PDFs

13. **Implement error handling**
    - Document load error
    - Page render error
    - Invalid page number
    - Corrupted PDF handling
    - Display user-friendly error messages

14. **Add mobile optimizations**
    - Touch-friendly controls
    - Swipe for page navigation
    - Pinch zoom support (if possible)
    - Responsive scale adjustments

15. **Implement text selection**
    - Enable text layer rendering
    - Allow text selection and copy
    - Highlight search terms (future)

### Component Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                   [PDF Page Display]                     │
│                   (Current Page Rendered)                │
│                                                          │
│                                                          │
│                                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [⇤] [←] Page [2] of 5 [→] [⇥]  [−] 100% [+] [⤢]      │
│  First Prev  Input   Total Next Last Zoom Scale Zoom Full│
└─────────────────────────────────────────────────────────┘
```

### Navigation Controls

| Control | Icon | Action | Shortcut |
|---------|------|--------|----------|
| First Page | ⇤ | Go to page 1 | Home |
| Previous | ← | Go to previous page | ↑ / PgUp |
| Page Input | [2] | Jump to page number | - |
| Page Display | of 5 | Show total pages | - |
| Next | → | Go to next page | ↓ / PgDn |
| Last Page | ⇥ | Go to last page | End |

### Zoom Controls

| Control | Display | Action | Shortcut |
|---------|---------|--------|----------|
| Zoom Out | − | Decrease scale 0.25x | - |
| Scale | 100% | Current zoom level | - |
| Zoom In | + | Increase scale 0.25x | + |
| Fit Width | [⬌] | Fit to container width | W |
| Fit Page | [⬍] | Fit entire page | P |
| Fullscreen | ⤢ | Toggle fullscreen | F |

### Zoom Levels

| Level | Scale | Use Case |
|-------|-------|----------|
| 50% | 0.5 | Overview |
| 75% | 0.75 | Compact view |
| 100% | 1.0 | Default |
| 125% | 1.25 | Comfortable reading |
| 150% | 1.5 | Large text |
| 200% | 2.0 | Maximum detail |
| Fit Width | Auto | Full width |
| Fit Page | Auto | Full page visible |

### Page Navigation Behavior

| Action | Condition | Result |
|--------|-----------|--------|
| Next page | Not on last page | Load next page |
| Next page | On last page | Disabled / no action |
| Previous page | Not on first page | Load previous page |
| Previous page | On first page | Disabled / no action |
| Go to page | Valid page number | Load specified page |
| Go to page | Invalid number | Show error, stay on current |

### Keyboard Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| ↑ or Page Up | Previous page | Go to previous page |
| ↓ or Page Down | Next page | Go to next page |
| Home | First page | Jump to page 1 |
| End | Last page | Jump to last page |
| + or = | Zoom in | Increase scale |
| - | Zoom out | Decrease scale |
| 0 | Reset zoom | Back to 100% |
| W | Fit width | Fit to container width |
| P | Fit page | Fit entire page |
| F | Fullscreen | Toggle fullscreen |

### Props Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| pdfUrl | string | required | PDF file URL |
| initialPage | number | 1 | Starting page number |
| initialScale | number | 1.0 | Starting zoom level |
| enableTextSelection | boolean | true | Allow text selection |
| showControls | boolean | true | Show control toolbar |
| onLoadSuccess | function | null | Callback on load |
| onLoadError | function | null | Callback on error |

### Load States

| State | Display | Action |
|-------|---------|--------|
| Loading | Spinner + "Loading PDF..." | Wait |
| Loaded | Display page | Enable navigation |
| Error | Error message | Show retry |
| Page Loading | Page spinner | Wait for render |
| Success | Document info | Show page count |

### Error Handling

| Error | Message | Action |
|-------|---------|--------|
| Load failed | "Failed to load PDF" | Retry button |
| Invalid file | "Invalid PDF file" | Close viewer |
| Page error | "Failed to render page" | Retry page |
| Worker error | "PDF worker failed" | Reload component |
| Corrupted | "PDF file is corrupted" | Download option |

### PDF.js Worker Setup

```
Configuration required:
- Set pdfjs.GlobalWorkerOptions.workerSrc
- Use CDN: 'https://unpkg.com/pdfjs-dist@.../pdf.worker.min.js'
- Or bundle locally and set path
- Handle worker initialization in useEffect
```

### Text Layer Features

| Feature | Enabled | Purpose |
|---------|---------|---------|
| Text Selection | Yes | Allow copy/paste |
| Search | Future | Find text in PDF |
| Annotations | Yes | Show PDF annotations |
| Links | Yes | Clickable hyperlinks |

### Mobile Optimizations

| Feature | Implementation |
|---------|----------------|
| Touch controls | Larger touch targets |
| Swipe navigation | Swipe left/right for pages |
| Responsive scale | Auto-fit to screen |
| Orientation | Handle portrait/landscape |

### Performance Considerations

| Optimization | Implementation |
|--------------|----------------|
| Lazy load pages | Render current page only |
| Canvas optimization | Use PDF.js canvas mode |
| Memory management | Cleanup on unmount |
| Caching | Cache rendered pages |

### Expected Outcome
- PDF viewer displays documents correctly
- Page navigation works smoothly
- All pages accessible via controls
- Zoom functionality works properly
- Text can be selected and copied
- Keyboard shortcuts enhance navigation
- Control toolbar always accessible
- Loading states display appropriately
- Error handling prevents crashes
- Mobile-friendly and responsive

### Verification Checklist
- [ ] Component created and imported
- [ ] PDF loads from URL
- [ ] First page displays correctly
- [ ] Page count shows total pages
- [ ] Next button navigates forward
- [ ] Previous button navigates backward
- [ ] First/Last page buttons work
- [ ] Page input jumps to page
- [ ] Zoom in/out buttons work
- [ ] Scale dropdown changes zoom
- [ ] Fit width works
- [ ] Fit page works
- [ ] Keyboard shortcuts work
- [ ] Text selection enabled
- [ ] Loading spinner shows
- [ ] Error handling works
- [ ] Multi-page PDFs work
- [ ] Mobile responsive

---

## Task 64: Verify Button

### Overview
Create the verify button component that allows admins to confirm bank transfer payments as genuine and approved. This button triggers the payment verification workflow, updating the payment status to CONFIRMED, updating the order status to PAID, and initiating confirmation notifications to the customer. The button includes visual feedback, confirmation dialogs, and proper authorization checks.

### Dependencies
- Task 60: Payment Detail View
- Admin authentication and authorization
- Verification API endpoint (Task 67)

### Instructions

1. **Create button component**
   - Add verify button to payment detail page
   - Position prominently in header and footer
   - Use primary action button styling (green)
   - Add success icon (checkmark)

2. **Define button states**
   - Default state (ready to verify)
   - Loading state (verification in progress)
   - Success state (verification complete)
   - Disabled state (already verified)
   - Error state (verification failed)

3. **Implement button styling**
   - Primary green color (#22c55e or theme green)
   - White text color
   - Rounded corners
   - Padding for comfortable click
   - Hover effect (darker green)
   - Active/pressed effect
   - Disabled styling (grayed out)

4. **Add button icon**
   - Checkmark icon (✓) on left
   - Or shield-check icon
   - Loading spinner when processing
   - Success icon when complete

5. **Implement button text**
   - Default: "Confirm Payment"
   - Loading: "Confirming..."
   - Success: "Payment Confirmed"
   - Disabled: "Already Confirmed"

6. **Create confirmation dialog**
   - Show dialog on button click
   - Title: "Confirm Payment?"
   - Message: Summary of payment and order
   - Show amount and order ID
   - Confirm button (green)
   - Cancel button (gray)

7. **Add authorization check**
   - Verify user has admin role
   - Verify user has payment.verify permission
   - Disable button if not authorized
   - Show tooltip explaining why disabled

8. **Implement status validation**
   - Check if payment status is PENDING
   - Disable button if already CONFIRMED
   - Disable button if REJECTED
   - Show appropriate message for each state

9. **Handle button click action**
   - Prevent double-click submissions
   - Show confirmation dialog first
   - On confirm, call verification API
   - Show loading state during API call
   - Handle API response (success/error)

10. **Add success feedback**
    - Show success toast notification
    - Update button to success state
    - Update payment status in UI
    - Scroll to top of page
    - Highlight success message

11. **Implement error handling**
    - Catch API errors
    - Show error toast notification
    - Display detailed error message
    - Return button to default state
    - Allow retry

12. **Add audit logging**
    - Log verification attempt
    - Include admin user ID
    - Include timestamp
    - Include payment ID
    - Log success or failure

### Button Styling States

| State | Color | Icon | Text | Cursor |
|-------|-------|------|------|--------|
| Default | Green | ✓ | Confirm Payment | Pointer |
| Hover | Dark Green | ✓ | Confirm Payment | Pointer |
| Loading | Green | ⟳ | Confirming... | Default |
| Success | Dark Green | ✓ | Payment Confirmed | Default |
| Disabled | Gray | ✓ | Already Confirmed | Not-allowed |
| Error | Red | ⚠ | Verification Failed | Pointer |

### Confirmation Dialog Structure

```
┌─────────────────────────────────────────┐
│  Confirm Payment?                        │
│                                          │
│  You are about to confirm this payment: │
│                                          │
│  Payment ID: PAY001                      │
│  Order ID: ORD123                        │
│  Amount: LKR 25,000.00                   │
│  Customer: John Doe                      │
│                                          │
│  This action will:                       │
│  • Mark payment as confirmed             │
│  • Update order status to PAID           │
│  • Send confirmation email to customer   │
│                                          │
│  [Cancel]         [✓ Confirm Payment]   │
└─────────────────────────────────────────┘
```

### Authorization Requirements

| Check | Required | Action if Failed |
|-------|----------|------------------|
| User authenticated | Yes | Redirect to login |
| User is admin | Yes | Hide button |
| Has permission | payment.verify | Disable button + tooltip |
| Payment is PENDING | Yes | Disable button |
| Proof uploaded | No | Show warning |

### Button Visibility Logic

| Condition | Button Display |
|-----------|----------------|
| Payment PENDING | Show enabled |
| Payment CONFIRMED | Show disabled (gray) |
| Payment REJECTED | Show disabled (gray) |
| No proof uploaded | Show with warning |
| Not admin | Hide button |
| No permission | Disable button |

### Click Flow Diagram

```
User Clicks Button
    │
    ▼
Check Authorization ──[Fail]──> Show Error Toast
    │
   [Pass]
    │
    ▼
Show Confirmation Dialog
    │
    ├──[Cancel]──> Close Dialog
    │
    ▼
   [Confirm]
    │
    ▼
Set Loading State
    │
    ▼
Call Verification API
    │
    ├──[Success]──> Show Success Toast
    │               Update UI
    │               Log Event
    │
    └──[Error]──> Show Error Toast
                  Log Error
                  Reset Button
```

### API Integration

```
POST /api/payments/bank-transfers/{id}/verify/

Headers:
- Authorization: Bearer {admin_token}

Request Body:
{
  "verified_by": "admin_user_id",
  "verified_at": "2026-01-31T10:00:00Z"
}

Response (Success):
{
  "success": true,
  "message": "Payment confirmed successfully",
  "payment": {
    "id": "uuid",
    "status": "CONFIRMED",
    "verified_at": "2026-01-31T10:00:00Z",
    "verified_by": {
      "id": "uuid",
      "name": "Admin User"
    }
  }
}

Response (Error):
{
  "success": false,
  "error": "Payment already confirmed"
}
```

### Success Notification

| Element | Content |
|---------|---------|
| Type | Success toast |
| Icon | ✓ Checkmark |
| Title | "Payment Confirmed" |
| Message | "Payment PAY001 has been confirmed. Confirmation email sent to customer." |
| Duration | 5 seconds |
| Position | Top-right |

### Error Notification

| Element | Content |
|---------|---------|
| Type | Error toast |
| Icon | ⚠ Warning |
| Title | "Verification Failed" |
| Message | Error message from API |
| Duration | Until dismissed |
| Position | Top-right |
| Action | [Retry] button |

### Disabled States

| Reason | Button Text | Tooltip Message |
|--------|-------------|-----------------|
| Already confirmed | Already Confirmed | This payment has been confirmed |
| Already rejected | Payment Rejected | This payment was rejected |
| No permission | Confirm Payment | You don't have permission to verify |
| Processing | Confirming... | Please wait... |

### Expected Outcome
- Verify button displays prominently
- Button styling clear and inviting
- Confirmation dialog prevents accidental clicks
- Authorization checks prevent unauthorized access
- API integration works correctly
- Success feedback clear and informative
- Error handling prevents data inconsistency
- Button disabled after successful verification
- Audit logging records admin action

### Verification Checklist
- [ ] Button added to payment detail page
- [ ] Green primary styling applied
- [ ] Checkmark icon displayed
- [ ] Button text appropriate for state
- [ ] Hover effect works
- [ ] Click shows confirmation dialog
- [ ] Confirmation dialog displays correctly
- [ ] Cancel button closes dialog
- [ ] Confirm button calls API
- [ ] Loading state shows during API call
- [ ] Success toast appears on success
- [ ] Payment status updates in UI
- [ ] Button disabled after confirmation
- [ ] Error toast shows on failure
- [ ] Authorization check works
- [ ] Permission check works
- [ ] Disabled states styled correctly

---

## Task 65: Reject Button

### Overview
Create the reject button component that allows admins to reject bank transfer payments that fail verification. This button opens a rejection reason dialog where admins must provide a reason for rejection before proceeding. The rejection workflow updates the payment status to REJECTED, sends a rejection notification email to the customer with the reason, and logs the action for audit purposes.

### Dependencies
- Task 60: Payment Detail View
- Admin authentication and authorization
- Task 66: Rejection Reason Input (integrated here)
- Rejection API endpoint (Task 68)

### Instructions

1. **Create button component**
   - Add reject button to payment detail page
   - Position next to verify button
   - Use danger/destructive button styling (red)
   - Add warning icon (X or alert)

2. **Define button states**
   - Default state (ready to reject)
   - Loading state (rejection in progress)
   - Success state (rejection complete)
   - Disabled state (already rejected/confirmed)
   - Error state (rejection failed)

3. **Implement button styling**
   - Danger red color (#ef4444 or theme red)
   - White text color
   - Rounded corners
   - Border style (outline or filled)
   - Hover effect (darker red)
   - Active/pressed effect
   - Disabled styling (grayed out)

4. **Add button icon**
   - X icon (✗) or ban icon on left
   - Loading spinner when processing
   - Warning icon for emphasis

5. **Implement button text**
   - Default: "Reject Payment"
   - Loading: "Rejecting..."
   - Success: "Payment Rejected"
   - Disabled: "Already Rejected"

6. **Create rejection dialog**
   - Show dialog on button click
   - Title: "Reject Payment?"
   - Warning message about rejection
   - Show payment and order summary
   - Include rejection reason input (Task 66)
   - Submit button (red)
   - Cancel button (gray)

7. **Integrate rejection reason input**
   - Textarea for custom reason
   - Predefined reason dropdown/radio
   - Common reasons as quick options
   - Minimum length requirement (optional)
   - Required field validation

8. **Define common rejection reasons**
   - "Invalid or unclear proof document"
   - "Amount does not match"
   - "Bank account details incorrect"
   - "Transfer date discrepancy"
   - "Suspected fraudulent document"
   - "Duplicate payment submission"
   - "Other (please specify)"

9. **Add authorization check**
   - Verify user has admin role
   - Verify user has payment.reject permission
   - Disable button if not authorized
   - Show tooltip explaining why disabled

10. **Implement status validation**
    - Check if payment status is PENDING
    - Disable button if already REJECTED
    - Disable button if CONFIRMED
    - Show appropriate message for each state

11. **Handle button click action**
    - Prevent double-click submissions
    - Show rejection dialog first
    - Validate rejection reason is provided
    - On submit, call rejection API with reason
    - Show loading state during API call
    - Handle API response (success/error)

12. **Add success feedback**
    - Show success toast notification
    - Update button to rejected state
    - Update payment status in UI
    - Display rejection reason in UI
    - Highlight rejection notice

13. **Implement error handling**
    - Catch API errors
    - Show error toast notification
    - Display detailed error message
    - Keep dialog open to retry
    - Preserve rejection reason in form

14. **Add audit logging**
    - Log rejection attempt
    - Include admin user ID
    - Include rejection reason
    - Include timestamp
    - Include payment ID
    - Log success or failure

### Button Styling States

| State | Color | Icon | Text | Cursor |
|-------|-------|------|------|--------|
| Default | Red | ✗ | Reject Payment | Pointer |
| Hover | Dark Red | ✗ | Reject Payment | Pointer |
| Loading | Red | ⟳ | Rejecting... | Default |
| Success | Dark Red | ✗ | Payment Rejected | Default |
| Disabled | Gray | ✗ | Already Rejected | Not-allowed |
| Error | Red | ⚠ | Rejection Failed | Pointer |

### Rejection Dialog Structure

```
┌─────────────────────────────────────────────┐
│  ⚠ Reject Payment?                          │
│                                              │
│  You are about to reject this payment:      │
│                                              │
│  Payment ID: PAY001                          │
│  Order ID: ORD123                            │
│  Amount: LKR 25,000.00                       │
│  Customer: John Doe                          │
│                                              │
│  Rejection Reason: *                         │
│  ○ Invalid or unclear proof document         │
│  ○ Amount does not match                     │
│  ○ Bank account details incorrect            │
│  ○ Transfer date discrepancy                 │
│  ○ Suspected fraudulent document             │
│  ○ Other (specify below)                     │
│                                              │
│  Additional Details:                         │
│  ┌──────────────────────────────────────┐   │
│  │                                       │   │
│  │ (Enter detailed rejection reason)    │   │
│  │                                       │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  This will:                                  │
│  • Mark payment as REJECTED                  │
│  • Send rejection email to customer          │
│  • Customer can resubmit correct proof       │
│                                              │
│  [Cancel]           [✗ Reject Payment]      │
└─────────────────────────────────────────────┘
```

### Rejection Reasons (Predefined)

| Reason | Description | Common Use |
|--------|-------------|------------|
| Invalid proof | Document unclear, unreadable | Quality issues |
| Amount mismatch | Transferred amount incorrect | Math error |
| Wrong account | Details don't match | Account error |
| Date discrepancy | Transfer date doesn't match | Timing issue |
| Fraudulent | Suspected fake document | Security concern |
| Duplicate | Payment already submitted | Duplicate entry |
| Other | Custom reason required | Any other case |

### Authorization Requirements

| Check | Required | Action if Failed |
|-------|----------|------------------|
| User authenticated | Yes | Redirect to login |
| User is admin | Yes | Hide button |
| Has permission | payment.reject | Disable button + tooltip |
| Payment is PENDING | Yes | Disable button |
| Reason provided | Yes | Prevent submission |

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Reason Radio | Required | "Please select a rejection reason" |
| Additional Details | Optional | - |
| Additional Details (if Other) | Required | "Please provide details for rejection" |
| Min Length | 10 characters (if Other) | "Please provide more detail" |

### Click Flow Diagram

```
User Clicks Button
    │
    ▼
Check Authorization ──[Fail]──> Show Error Toast
    │
   [Pass]
    │
    ▼
Show Rejection Dialog
    │
    ├──[Cancel]──> Close Dialog
    │
    ▼
   [User fills reason]
    │
    ▼
   [Submit]
    │
    ▼
Validate Reason ──[Invalid]──> Show Validation Error
    │
   [Valid]
    │
    ▼
Set Loading State
    │
    ▼
Call Rejection API
    │
    ├──[Success]──> Show Success Toast
    │               Update UI
    │               Log Event
    │               Close Dialog
    │
    └──[Error]──> Show Error Toast
                  Keep Dialog Open
                  Log Error
```

### API Integration

```
POST /api/payments/bank-transfers/{id}/reject/

Headers:
- Authorization: Bearer {admin_token}

Request Body:
{
  "rejected_by": "admin_user_id",
  "rejected_at": "2026-01-31T10:00:00Z",
  "rejection_reason": "Invalid or unclear proof document",
  "rejection_details": "The uploaded receipt is too blurry to verify..."
}

Response (Success):
{
  "success": true,
  "message": "Payment rejected successfully",
  "payment": {
    "id": "uuid",
    "status": "REJECTED",
    "rejected_at": "2026-01-31T10:00:00Z",
    "rejected_by": {
      "id": "uuid",
      "name": "Admin User"
    },
    "rejection_reason": "Invalid or unclear proof document"
  }
}

Response (Error):
{
  "success": false,
  "error": "Payment already processed"
}
```

### Success Notification

| Element | Content |
|---------|---------|
| Type | Warning toast |
| Icon | ⚠ Warning |
| Title | "Payment Rejected" |
| Message | "Payment PAY001 has been rejected. Rejection email sent to customer." |
| Duration | 5 seconds |
| Position | Top-right |

### Error Notification

| Element | Content |
|---------|---------|
| Type | Error toast |
| Icon | ⚠ Warning |
| Title | "Rejection Failed" |
| Message | Error message from API |
| Duration | Until dismissed |
| Position | Top-right |
| Action | Dialog remains open |

### Disabled States

| Reason | Button Text | Tooltip Message |
|--------|-------------|-----------------|
| Already confirmed | Payment Confirmed | This payment is already confirmed |
| Already rejected | Already Rejected | This payment is already rejected |
| No permission | Reject Payment | You don't have permission to reject |
| Processing | Rejecting... | Please wait... |

### Expected Outcome
- Reject button displays next to verify button
- Button styling clear as destructive action
- Rejection dialog opens with reason form
- Predefined reasons available for quick selection
- Custom reason input available
- Validation ensures reason is provided
- API integration works correctly
- Success feedback includes reason
- Rejection email sent to customer
- Button disabled after rejection
- Audit logging records admin action and reason

### Verification Checklist
- [ ] Button added to payment detail page
- [ ] Red danger styling applied
- [ ] Warning icon displayed
- [ ] Button text appropriate for state
- [ ] Hover effect works
- [ ] Click shows rejection dialog
- [ ] Rejection dialog displays correctly
- [ ] Predefined reasons displayed
- [ ] Custom reason textarea works
- [ ] Validation prevents empty submission
- [ ] Cancel button closes dialog
- [ ] Submit button calls API with reason
- [ ] Loading state shows during API call
- [ ] Success toast appears on success
- [ ] Payment status updates to REJECTED
- [ ] Rejection reason displays in UI
- [ ] Button disabled after rejection
- [ ] Error toast shows on failure
- [ ] Authorization check works
- [ ] Permission check works
- [ ] Disabled states styled correctly

---

## Document Summary

This document covered the creation of the admin verification workflow interface for bank transfer payments. The pending payments view provides a comprehensive list of all submissions awaiting review with filtering and sorting capabilities. The payment detail view consolidates all relevant information needed for verification decisions in a well-organized layout.

The proof preview components enable detailed examination of uploaded documents through sophisticated image viewing with zoom/pan capabilities and robust PDF viewing with page navigation. The verify and reject buttons provide clear action paths with appropriate confirmation flows, validation checks, and comprehensive error handling.

These components work together to create an efficient admin workflow that balances speed with thoroughness, ensuring proper verification while maintaining a smooth user experience for admin staff.

### Next Steps
- Proceed to Document 02 for API implementation and email notifications
- Implement verification and rejection API endpoints
- Create email templates for confirmation and rejection notifications
- Set up verification logging for audit trail
- Test complete admin workflow end-to-end

---

**End of Document 01**
