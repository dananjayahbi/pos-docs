# Tasks 57-64: Invoice Details, PDF Preview, and Send Modal

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** D - Invoice Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-56_Invoice-Generation.md](01_Tasks-49-56_Invoice-Generation.md)
- **→ Next Group:** [Group-E_Quotes-Conversion](../Group-E_Quotes-Conversion/)

---

## Document Overview

This document covers the creation of the invoice details page with PDF preview functionality, download and print capabilities, send invoice modal for email delivery, and payment history section. These components complete the invoice management system with full document handling and communication features.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Create Invoice Details Page | Medium | 40 min |
| 58 | Create Invoice Header Section | Low | 25 min |
| 59 | Create Invoice PDF Preview | Medium | 45 min |
| 60 | Create Download PDF Button | Low | 20 min |
| 61 | Create Print Invoice Action | Low | 20 min |
| 62 | Create Send Invoice Modal | Medium | 40 min |
| 63 | Create Payment History Section | Medium | 35 min |
| 64 | Connect Invoices to API | Medium | 40 min |

---

## Task 57: Create Invoice Details Page

### Overview
Create the main invoice details page displaying comprehensive invoice information including header, PDF preview, payment history, and action buttons. This page provides full invoice viewing and management capabilities.

### Dependencies
- Task 49: Invoices routing structure
- Invoice type definitions from backend

### Instructions

1. **Create page route file**
   - Navigate to `frontend/app/(dashboard)/invoices/[id]/` directory
   - Create file `page.tsx`
   - Set up dynamic route with ID parameter

2. **Import required components**
   - Import InvoiceHeaderSection (Task 58)
   - Import InvoicePDFPreview (Task 59)
   - Import PaymentHistory (Task 63)
   - Import useInvoiceDetails hook

3. **Build page layout structure**
   - Two-column layout (desktop)
   - Left: PDF preview (wider, 2/3)
   - Right: Actions and history (narrower, 1/3)
   - Stack columns on mobile

4. **Fetch invoice data**
   - Extract invoice ID from route params
   - Use useInvoiceDetails hook
   - Handle loading state
   - Handle error state (404, permission)

5. **Organize left column**
   - Invoice Header Section at top
   - PDF Preview below header
   - Download and Print buttons at bottom

6. **Organize right column**
   - Quick actions card
   - Invoice details summary
   - Payment history section
   - Sticky positioning (optional)

7. **Add loading state**
   - Show skeleton for all sections
   - Maintain layout structure
   - Display loading indicators

8. **Add error handling**
   - Handle invoice not found (404)
   - Handle permission errors (403)
   - Display error messages
   - Provide back button

9. **Add breadcrumb navigation**
   - Path: Sales > Invoices > [Invoice Number]
   - Make clickable
   - Position above header

10. **Configure page metadata**
    - Dynamic title with invoice number
    - Set description for SEO
    - Configure meta tags

### Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Sales > Invoices > INV-1001                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┐  ┌────────────────────────────┐   │
│  │ Left Column (PDF)       │  │ Right Column (Actions)     │   │
│  │                         │  │                            │   │
│  │ ┌─────────────────────┐ │  │ ┌────────────────────────┐ │   │
│  │ │ Invoice Header      │ │  │ │ Quick Actions          │ │   │
│  │ │ INV-1001            │ │  │ │ [Send] [Download]      │ │   │
│  │ │ Status: Paid        │ │  │ │ [Print] [Void]         │ │   │
│  │ └─────────────────────┘ │  │ └────────────────────────┘ │   │
│  │                         │  │                            │   │
│  │ ┌─────────────────────┐ │  │ ┌────────────────────────┐ │   │
│  │ │ PDF Preview         │ │  │ │ Invoice Summary        │ │   │
│  │ │                     │ │  │ │ Total: LKR 25,000      │ │   │
│  │ │ [Invoice PDF]       │ │  │ │ Paid: LKR 25,000       │ │   │
│  │ │                     │ │  │ │ Balance: LKR 0         │ │   │
│  │ │                     │ │  │ └────────────────────────┘ │   │
│  │ │                     │ │  │                            │   │
│  │ └─────────────────────┘ │  │ ┌────────────────────────┐ │   │
│  │                         │  │ │ Payment History        │ │   │
│  │ [Download] [Print]      │  │ │ Jan 24: LKR 25,000     │ │   │
│  │                         │  │ │ Method: Card           │ │   │
│  └─────────────────────────┘  │ └────────────────────────┘ │   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Complete invoice details page
- Two-column layout working
- All sections properly positioned
- Data loads correctly
- Navigation functional

### Verification Checklist
- [ ] Page route created
- [ ] Dynamic ID extracted
- [ ] Layout renders correctly
- [ ] Invoice data fetches
- [ ] Left column displays
- [ ] Right column displays
- [ ] Loading state shows
- [ ] Error handling works
- [ ] Breadcrumb navigates
- [ ] Metadata configured

---

## Task 58: Create Invoice Header Section

### Overview
Create the InvoiceHeaderSection component displaying invoice number, dates (issued, due), status badge, and key information at the top of the invoice details page.

### Dependencies
- Task 57: Create Invoice Details Page
- InvoiceStatusBadge component

### Instructions

1. **Create header component file**
   - Navigate to `frontend/components/modules/sales/Invoices/InvoiceDetails/` directory
   - Create file `InvoiceHeaderSection.tsx`

2. **Build header layout**
   - Flex container with space-between
   - Left: Invoice number and dates
   - Right: Status badge
   - Responsive stacking

3. **Display invoice number**
   - Large, bold invoice number
   - Format: "Invoice #INV-1001"
   - Monospace font

4. **Display dates**
   - Issue date: "Issued: MMM dd, yyyy"
   - Due date: "Due: MMM dd, yyyy"
   - Muted color, smaller font

5. **Display status badge**
   - Use InvoiceStatusBadge component
   - Position prominently
   - Larger size

6. **Add customer name**
   - Show "To: [Customer Name]"
   - Below invoice number
   - Link to customer profile (optional)

7. **Style for prominence**
   - Clear visual hierarchy
   - Proper spacing
   - Professional appearance

### Header Layout

```
┌─────────────────────────────────────┐
│ Invoice #INV-1001      [● Paid]     │
│ To: John Doe                        │
│ Issued: Jan 24, 2026                │
│ Due: Feb 23, 2026                   │
└─────────────────────────────────────┘
```

### Expected Outcome
- Clear invoice header
- All information visible
- Status prominent
- Professional layout

### Verification Checklist
- [ ] Header component created
- [ ] Invoice number displays
- [ ] Dates format correctly
- [ ] Customer name shows
- [ ] Status badge renders
- [ ] Layout responsive
- [ ] Component typed

---

## Task 59: Create Invoice PDF Preview

### Overview
Create the InvoicePDFPreview component displaying an embedded PDF viewer showing the invoice document. Includes zoom controls, page navigation, and full-screen option.

### Dependencies
- Task 57: Create Invoice Details Page
- PDF viewer library (react-pdf or similar)

### Instructions

1. **Create PDF preview component file**
   - Navigate to `frontend/components/modules/sales/Invoices/InvoiceDetails/` directory
   - Create file `InvoicePDFPreview.tsx`

2. **Import PDF viewer library**
   - Install and import react-pdf or PDF.js
   - Import Document, Page components
   - Configure worker

3. **Build PDF container**
   - Create responsive container
   - Set appropriate aspect ratio
   - Apply border and shadow

4. **Load PDF document**
   - Fetch PDF from API endpoint
   - Handle loading state
   - Handle error state
   - Display in viewer

5. **Add zoom controls**
   - Zoom in button (+)
   - Zoom out button (-)
   - Reset zoom button (100%)
   - Fit to width option

6. **Add page navigation**
   - Previous page button
   - Next page button
   - Page number display
   - Page input field

7. **Add full-screen mode**
   - Full-screen button
   - Enter/exit full-screen
   - Keyboard shortcuts (F11)

8. **Add loading state**
   - Show loading spinner
   - Display progress bar
   - Maintain container size

9. **Add error handling**
   - Handle PDF load failure
   - Show error message
   - Provide retry option
   - Fallback to download button

10. **Optimize performance**
    - Lazy load pages
    - Cache PDF data
    - Render visible pages only
    - Smooth scrolling

### PDF Preview Layout

```
┌─────────────────────────────────┐
│ Controls: [-] [100%] [+] [⛶]   │
├─────────────────────────────────┤
│                                 │
│    ┌─────────────────────┐     │
│    │                     │     │
│    │   Invoice PDF       │     │
│    │   Content Here      │     │
│    │                     │     │
│    │                     │     │
│    │                     │     │
│    └─────────────────────┘     │
│                                 │
├─────────────────────────────────┤
│   [←] Page 1 of 1 [→]           │
└─────────────────────────────────┘
```

### Zoom Levels

| Button | Zoom Level |
|--------|------------|
| - | Current - 25% |
| 100% | Reset to 100% |
| + | Current + 25% |
| Fit Width | Fit to container width |

### Expected Outcome
- PDF displays correctly
- Zoom controls working
- Page navigation functional
- Full-screen mode works
- Loading and error states

### Verification Checklist
- [ ] PDF preview component created
- [ ] PDF loads and displays
- [ ] Zoom in/out works
- [ ] Page navigation works
- [ ] Full-screen toggles
- [ ] Loading spinner shows
- [ ] Error handling works
- [ ] Performance optimized
- [ ] Component typed

---

## Task 60: Create Download PDF Button

### Overview
Create the DownloadPDFButton component that triggers the download of the invoice PDF file to the user's device with proper filename.

### Dependencies
- Task 59: Create Invoice PDF Preview
- Invoice API endpoint for PDF

### Instructions

1. **Create download button component file**
   - Navigate to `frontend/components/modules/sales/Invoices/InvoiceDetails/` directory
   - Create file `DownloadPDFButton.tsx`

2. **Build button component**
   - Use Button component
   - Label: "Download PDF"
   - Download icon
   - Primary or outline style

3. **Implement download handler**
   - Fetch PDF from API endpoint
   - Create blob from response
   - Generate download link
   - Trigger browser download

4. **Set proper filename**
   - Format: "Invoice-INV-1001.pdf"
   - Include invoice number
   - Use safe characters

5. **Add loading state**
   - Show spinner while downloading
   - Disable button during download
   - Display progress (optional)

6. **Handle download errors**
   - Catch network errors
   - Display error toast
   - Allow retry

7. **Add download success feedback**
   - Show success toast
   - Brief animation
   - Clear messaging

### Download Flow

```
User clicks Download
    │
    ▼
Show loading state
    │
    ▼
Fetch PDF from API
    │
    ├─→ Success
    │   ├─→ Create blob
    │   ├─→ Generate filename
    │   ├─→ Trigger download
    │   └─→ Show success toast
    │
    └─→ Error
        ├─→ Show error toast
        └─→ Enable retry
```

### Expected Outcome
- Download button functional
- PDF downloads correctly
- Proper filename generated
- Loading and error states
- Success feedback shown

### Verification Checklist
- [ ] Button component created
- [ ] Click triggers download
- [ ] PDF downloads successfully
- [ ] Filename correct
- [ ] Loading state shows
- [ ] Error handling works
- [ ] Success toast displays
- [ ] Component typed

---

## Task 61: Create Print Invoice Action

### Overview
Create the PrintInvoiceButton component that opens the browser's print dialog with the invoice PDF ready to print.

### Dependencies
- Task 59: Create Invoice PDF Preview
- Browser print API

### Instructions

1. **Create print button component file**
   - Navigate to `frontend/components/modules/sales/Invoices/InvoiceDetails/` directory
   - Create file `PrintInvoiceButton.tsx`

2. **Build button component**
   - Use Button component
   - Label: "Print"
   - Printer icon
   - Outline style

3. **Implement print handler**
   - Open print dialog with window.print()
   - Format invoice for printing
   - Apply print styles
   - Handle print completion

4. **Optimize for printing**
   - Use print media query CSS
   - Hide non-essential elements
   - Format for A4 paper
   - Set proper margins

5. **Add print preview**
   - Show print preview before printing
   - Allow user to review
   - Provide cancel option

6. **Handle print cancellation**
   - Detect if user cancels
   - Return to normal view
   - No error messaging needed

### Print Handler Flow

```
User clicks Print
    │
    ▼
Apply print styles
    │
    ▼
Open print dialog
    │
    ├─→ User confirms
    │   └─→ Print starts
    │       └─→ Return to normal view
    │
    └─→ User cancels
        └─→ Return to normal view
```

### Expected Outcome
- Print button functional
- Print dialog opens
- Invoice formats correctly
- Print styles applied

### Verification Checklist
- [ ] Button component created
- [ ] Click opens print dialog
- [ ] Invoice formats for print
- [ ] Print styles apply
- [ ] A4 layout correct
- [ ] Non-essential elements hidden
- [ ] Component typed

---

## Task 62: Create Send Invoice Modal

### Overview
Create the SendInvoiceModal component allowing users to email the invoice to the customer with customizable email content and options.

### Dependencies
- Task 57: Create Invoice Details Page
- Modal/Dialog component
- Email template

### Instructions

1. **Create send modal component file**
   - Navigate to `frontend/components/modules/sales/Invoices/InvoiceDetails/` directory
   - Create file `SendInvoiceModal.tsx`

2. **Build modal structure**
   - Use Dialog component
   - Modal title: "Send Invoice"
   - Form with email fields
   - Action buttons

3. **Create email recipient field**
   - Pre-fill with customer email
   - Allow editing
   - Validate email format
   - Support multiple recipients

4. **Create CC field**
   - Optional additional emails
   - Comma-separated input
   - Validate each email
   - Clear button

5. **Create subject line field**
   - Pre-fill with: "Invoice INV-1001 from [Company]"
   - Allow editing
   - Character limit (100)

6. **Create message body field**
   - Textarea for custom message
   - Pre-fill with template
   - Support basic formatting
   - Character limit (500)

7. **Add attachment option**
   - Checkbox: "Attach PDF"
   - Default: checked
   - Show PDF filename
   - Disable unchecking (required)

8. **Create email preview**
   - Show preview of email
   - Display formatted message
   - Show attachment indicator
   - Toggle preview/edit

9. **Implement send handler**
   - Validate all fields
   - Call send API endpoint
   - Show loading state
   - Handle success/error

10. **Add success feedback**
    - Show success toast
    - Close modal
    - Update invoice status (if draft)
    - Show "Sent" timestamp

11. **Handle send errors**
    - Display error message
    - Keep modal open
    - Allow retry
    - Suggest fixes

### Send Modal Layout

```
┌─────────────────────────────────────┐
│ Send Invoice                   [×]  │
├─────────────────────────────────────┤
│                                     │
│ To: *                               │
│ ┌─────────────────────────────────┐ │
│ │ john@example.com                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ CC:                                 │
│ ┌─────────────────────────────────┐ │
│ │ accounting@example.com          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Subject: *                          │
│ ┌─────────────────────────────────┐ │
│ │ Invoice INV-1001 from Company   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Message:                            │
│ ┌─────────────────────────────────┐ │
│ │ Dear John,                      │ │
│ │                                 │ │
│ │ Please find attached invoice... │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ☑ Attach PDF (Invoice-INV-1001.pdf)│
│                                     │
├─────────────────────────────────────┤
│           [Cancel]  [Send Invoice]  │
└─────────────────────────────────────┘
```

### Email Template

```
Dear [Customer Name],

Please find attached your invoice #[Invoice Number] dated [Date].

Invoice Details:
- Amount: LKR [Amount]
- Due Date: [Due Date]

Please contact us if you have any questions.

Best regards,
[Company Name]
```

### Expected Outcome
- Send modal functional
- Email fields pre-filled
- Validation working
- Email sends successfully
- Success/error feedback shown

### Verification Checklist
- [ ] Modal component created
- [ ] Opens/closes correctly
- [ ] Email fields pre-filled
- [ ] Validation works
- [ ] CC field accepts multiple emails
- [ ] Subject editable
- [ ] Message customizable
- [ ] Attachment checkbox works
- [ ] Send button triggers API
- [ ] Loading state shows
- [ ] Success toast displays
- [ ] Error handling works
- [ ] Component typed

---

## Task 63: Create Payment History Section

### Overview
Create the PaymentHistory component displaying all payments made against the invoice with dates, amounts, methods, and references.

### Dependencies
- Task 57: Create Invoice Details Page
- Payment type definitions

### Instructions

1. **Create payment history component file**
   - Navigate to `frontend/components/modules/sales/Invoices/InvoiceDetails/` directory
   - Create file `PaymentHistory.tsx`

2. **Build section structure**
   - Card wrapper with title
   - Table or list layout
   - Chronological order (newest first)

3. **Display payment entries**
   - Map through payments array
   - Show date, method, amount, reference
   - Apply consistent styling
   - Alternate row colors

4. **Format payment date**
   - Display as "MMM dd, yyyy"
   - Show time if same day
   - Relative time on hover

5. **Display payment method**
   - Show method name (Cash, Card, Bank Transfer)
   - Include method icon
   - Format consistently

6. **Display payment amount**
   - Format as LKR currency
   - Right align
   - Bold font

7. **Display reference number**
   - Show transaction reference
   - Truncate if long
   - Copy on click (optional)

8. **Calculate running balance**
   - Show remaining balance after each payment
   - Display in separate column
   - Update progressively

9. **Add empty state**
   - Show "No payments recorded"
   - Display when empty
   - Muted styling

10. **Add total summary**
    - Sum of all payments
    - Display at bottom
    - Highlight total paid
    - Show remaining balance

### Payment History Layout

```
┌─────────────────────────────────┐
│ Payment History                 │
├─────────────────────────────────┤
│ Date      Method  Amount Balance│
├─────────────────────────────────┤
│ Jan 24    Card    25,000  0     │
│ Jan 20    Bank    10,000  25,000│
│ Jan 15    Cash     5,000  35,000│
├─────────────────────────────────┤
│ Total Paid:       40,000        │
│ Remaining:             0        │
└─────────────────────────────────┘
```

### Payment Methods Icons

| Method | Icon |
|--------|------|
| Cash | DollarSign |
| Card | CreditCard |
| Bank Transfer | Building |
| Cheque | FileText |

### Expected Outcome
- Payment history displays
- All payments listed
- Proper formatting
- Running balance calculates
- Empty state handled

### Verification Checklist
- [ ] Component created
- [ ] Payments list renders
- [ ] Dates format correctly
- [ ] Methods display with icons
- [ ] Amounts format as LKR
- [ ] References show
- [ ] Balance calculates
- [ ] Total summary shows
- [ ] Empty state displays
- [ ] Component typed

---

## Task 64: Connect Invoices to API

### Overview
Connect all invoice components to the backend API using TanStack Query. Implement data fetching, caching, mutations for create/update/send operations, and error handling.

### Dependencies
- All previous invoice tasks
- TanStack Query configured
- API endpoints available

### Instructions

1. **Create invoice query hooks file**
   - Navigate to `frontend/lib/api/queries/` directory
   - Create file `useInvoices.ts`

2. **Define query keys**
   - invoicesKeys object
   - List keys with filters
   - Detail keys with ID
   - PDF keys with ID

3. **Implement useInvoices hook**
   - Fetch invoices list
   - Support filters (status, date, customer)
   - Support pagination
   - Support sorting

4. **Implement useInvoiceDetails hook**
   - Fetch single invoice by ID
   - Include related data (payments, order)
   - Handle 404 errors

5. **Implement useInvoicePDF hook**
   - Fetch PDF blob
   - Cache PDF data
   - Support re-fetching

6. **Create mutation hooks**
   - useCreateInvoice
   - useUpdateInvoice
   - useSendInvoice
   - useVoidInvoice
   - useRecordPayment

7. **Configure caching strategy**
   - Set appropriate staleTime
   - Configure cacheTime
   - Enable refetchOnWindowFocus
   - Set retry attempts

8. **Implement optimistic updates**
   - Update cache immediately
   - Rollback on error
   - Provide smooth UX

9. **Add error handling**
   - Transform API errors
   - Display user-friendly messages
   - Handle network errors
   - Implement retry logic

10. **Integrate with components**
    - Import hooks in list page
    - Use in details page
    - Connect to modals
    - Pass data to table

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/v1/invoices | GET | List invoices |
| /api/v1/invoices/:id | GET | Get invoice details |
| /api/v1/invoices/:id/pdf | GET | Get PDF blob |
| /api/v1/invoices | POST | Create invoice |
| /api/v1/invoices/:id | PUT | Update invoice |
| /api/v1/invoices/:id/send | POST | Send invoice email |
| /api/v1/invoices/:id/void | POST | Void invoice |
| /api/v1/invoices/:id/payments | POST | Record payment |

### Query Keys Structure

```javascript
invoicesKeys = {
  all: ['invoices'],
  lists: () => [...invoicesKeys.all, 'list'],
  list: (filters) => [...invoicesKeys.lists(), filters],
  details: () => [...invoicesKeys.all, 'detail'],
  detail: (id) => [...invoicesKeys.details(), id],
  pdf: (id) => [...invoicesKeys.detail(id), 'pdf'],
}
```

### Expected Outcome
- All API connections working
- Data fetches correctly
- Mutations update cache
- Error handling functional
- Optimistic updates smooth

### Verification Checklist
- [ ] Query hooks created
- [ ] useInvoices fetches list
- [ ] useInvoiceDetails works
- [ ] useInvoicePDF fetches blob
- [ ] Mutation hooks created
- [ ] Cache strategy configured
- [ ] Error handling implemented
- [ ] Optimistic updates work
- [ ] Components integrated
- [ ] API calls in network tab

---

## Summary

This document covered the creation of invoice details page with PDF preview, download and print functionality, send invoice modal for email delivery, payment history display, and complete API integration.

### Completed Components

1. **InvoiceDetailsPage** - Full details page layout
2. **InvoiceHeaderSection** - Invoice header information
3. **InvoicePDFPreview** - Embedded PDF viewer
4. **DownloadPDFButton** - PDF download functionality
5. **PrintInvoiceButton** - Print dialog trigger
6. **SendInvoiceModal** - Email invoice form
7. **PaymentHistory** - Payments list display
8. **API Integration** - Complete backend connection

### Key Features Delivered

- Complete invoice viewing
- PDF preview with controls
- Download and print capabilities
- Email sending with customization
- Payment history tracking
- Full API integration
- Error handling and loading states

### Next Steps

Proceed to **Group E: Quotes & Conversion** to build quote management and quote-to-order conversion functionality.

---

**End of Document 02**
