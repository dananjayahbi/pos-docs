# Tasks 80-86: Progress, Testing, and Documentation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** F - Frontend & Testing  
> **Document:** 02 of 02  
> **Tasks Covered:** 80, 81, 82, 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-73-79_Types-Display-Upload.md](01_Tasks-73-79_Types-Display-Upload.md)
- **→ Next SubPhase:** [SubPhase-06_Cash-On-Delivery](../../SubPhase-06_Cash-On-Delivery/)

---

## Document Overview

This document covers the completion of the bank transfer frontend integration, including upload progress indicators, preview functionality, success confirmations, the pending status page, payment button integration, comprehensive integration testing, and complete documentation. These tasks finalize the customer-facing bank transfer payment flow and ensure proper testing and documentation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 80 | Upload Progress Bar | Low | 20 min |
| 81 | Upload Preview Component | Low | 25 min |
| 82 | Upload Success Confirmation | Low | 15 min |
| 83 | Pending Status Page | Medium | 45 min |
| 84 | BankTransfer Payment Button | Medium | 35 min |
| 85 | Integration Tests | Medium | 60 min |
| 86 | Bank Transfer Documentation | Medium | 45 min |

---

## Task 80: Upload Progress Bar

### Overview
Create an upload progress bar component that displays real-time upload progress when customers submit their payment proof files. This component provides visual feedback during the file upload process, showing percentage completion and preventing user frustration during network operations.

### Dependencies
- Task 79: Create Upload Component

### Instructions

1. **Create UploadProgress component file**
   - Navigate to `frontend/components/checkout/` directory
   - Create new file named `UploadProgress.tsx`
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `UploadProgressProps` interface
   - Include `progress` prop (number, 0-100)
   - Include optional `fileName` prop for display
   - Include optional `fileSize` prop for size display

3. **Implement progress bar structure**
   - Create container div for progress bar
   - Add progress bar background track
   - Add progress bar fill that scales with percentage
   - Add progress percentage text display

4. **Style progress bar components**
   - Use Tailwind width and height utilities
   - Apply background colors (gray for track, blue for fill)
   - Add border radius for modern appearance
   - Implement smooth transition animations

5. **Add file information display**
   - Display file name above or beside progress bar
   - Show current progress percentage
   - Display file size if provided
   - Use readable formatting for file sizes

6. **Implement progress states**
   - Initial state: 0% (preparing upload)
   - Uploading state: 1-99% (active upload)
   - Complete state: 100% (processing on server)
   - Add appropriate visual indicators for each state

7. **Add animations and transitions**
   - Smooth width transition for progress bar
   - Optional pulse animation during upload
   - Completion animation when reaching 100%

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| progress | number | Yes | - | Upload progress (0-100) |
| fileName | string | No | - | Name of uploading file |
| fileSize | number | No | - | File size in bytes |
| status | "uploading" \| "processing" \| "complete" | No | "uploading" | Current upload status |

### Progress Bar Structure

```
┌─────────────────────────────────────────┐
│ payment-proof.jpg (245 KB)              │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │████████████████░░░░░░░░░░░░░░░░░░│  │  ← Progress bar
│ └───────────────────────────────────┘  │
│                                  65%    │  ← Percentage
└─────────────────────────────────────────┘
```

### Progress States

| State | Progress | Visual Indicator | Description |
|-------|----------|------------------|-------------|
| Preparing | 0% | Gray bar | File validation |
| Uploading | 1-99% | Blue animated bar | Active upload |
| Processing | 100% | Blue pulsing | Server processing |
| Complete | 100% | Green with checkmark | Upload successful |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `space-y-2 p-4` | Layout and spacing |
| File Info | `flex justify-between text-sm` | File name and size |
| Track | `w-full h-2 bg-gray-200 rounded-full` | Progress bar background |
| Fill | `h-2 bg-blue-600 rounded-full transition-all` | Active progress |
| Percentage | `text-sm font-medium text-gray-700` | Progress text |

### File Size Formatting

| Bytes | Display | Format |
|-------|---------|--------|
| < 1024 | "256 B" | Bytes |
| < 1048576 | "245 KB" | Kilobytes |
| ≥ 1048576 | "2.4 MB" | Megabytes |

### Animation Behavior

```
Upload Flow:
├── 0% → Instant display
├── 1-50% → Smooth increment
├── 50-90% → Progressive speed
├── 90-99% → Slower near completion
└── 100% → Hold briefly, then transition
```

### Expected Outcome
- Functional progress bar component with smooth animations
- Real-time progress percentage display
- File information display when provided
- Visual feedback for different upload states

### Verification Checklist
- [ ] `frontend/components/checkout/UploadProgress.tsx` created
- [ ] Component accepts progress, fileName, fileSize props
- [ ] Progress bar displays correctly at all percentages
- [ ] Smooth transition animations implemented
- [ ] File size formatted in human-readable format
- [ ] Different states visually distinguishable
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 81: Upload Preview Component

### Overview
Create a preview component that displays the selected payment proof file before upload, allowing customers to verify they've selected the correct file. This component shows image thumbnails for image files and appropriate icons for PDF documents, with the ability to remove and select a different file.

### Dependencies
- Task 79: Create Upload Component

### Instructions

1. **Create UploadPreview component file**
   - Create `UploadPreview.tsx` in `components/checkout/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `UploadPreviewProps` interface
   - Include `file` prop (File object)
   - Include `onRemove` callback function
   - Include optional `maxHeight` for image preview size

3. **Implement file type detection**
   - Check file MIME type from File object
   - Detect images (image/jpeg, image/png)
   - Detect PDFs (application/pdf)
   - Handle unknown file types gracefully

4. **Create image preview functionality**
   - Use FileReader API to read image files
   - Convert image to data URL
   - Display image in thumbnail container
   - Maintain aspect ratio with object-fit

5. **Create PDF preview display**
   - Display PDF icon for PDF files
   - Show PDF file name and size
   - Optional: Show first page thumbnail (advanced)
   - Use appropriate PDF icon from icon library

6. **Add file information display**
   - Display file name
   - Display file size (formatted)
   - Display file type
   - Show upload timestamp or "Ready to upload"

7. **Implement remove functionality**
   - Add remove/delete button
   - Position button in corner of preview
   - Call onRemove callback when clicked
   - Add confirmation for large files (optional)

8. **Style preview container**
   - Create bordered card for preview
   - Add padding and spacing
   - Implement responsive sizing
   - Add hover effects for interactivity

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| file | File | Yes | - | File object to preview |
| onRemove | () => void | Yes | - | Callback when file removed |
| maxHeight | number | No | 200 | Max preview height in pixels |
| showMetadata | boolean | No | true | Show file metadata |

### Preview Structure

```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐ │
│  │                              [×]│  ← Remove button
│  │      ┌──────────────┐        │ │
│  │      │              │        │ │
│  │      │   Preview    │        │ │  ← Image/Icon
│  │      │   Image      │        │ │
│  │      └──────────────┘        │ │
│  │                               │ │
│  │  payment-proof.jpg            │ │  ← File name
│  │  245 KB • JPEG                │ │  ← Metadata
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### File Type Handling

| File Type | Preview Display | Icon | Additional Info |
|-----------|-----------------|------|-----------------|
| JPEG/PNG | Thumbnail image | - | Dimensions (optional) |
| PDF | PDF icon | 📄 | Page count (if available) |
| Unknown | Generic file icon | 📎 | Warning message |

### Preview Display Matrix

| Aspect | Images | PDFs | Unknown |
|--------|--------|------|---------|
| Preview | Thumbnail | Icon | Warning icon |
| Background | Image data | Gray background | Yellow background |
| Action | Remove + Re-upload | Remove + Re-upload | Remove + Re-select |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `relative border rounded-lg p-4 bg-white` | Card container |
| Preview Area | `relative w-full aspect-square` | Image/icon area |
| Image | `object-cover rounded-md` | Image styling |
| Remove Button | `absolute top-2 right-2 p-1 bg-red-500 rounded-full` | Delete action |
| Metadata | `mt-2 space-y-1 text-sm text-gray-600` | File info |

### Image Preview Generation

```
Process Flow:
├── File selected
├── Check MIME type
├── Create FileReader
├── Read as Data URL
├── Set preview source
├── Display with aspect ratio
└── Enable remove option
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Alt Text | File name as alt attribute |
| Button Label | "Remove file" for remove button |
| Keyboard Nav | Tab to remove button, Enter/Space to activate |
| Screen Reader | Announce file name and size |

### Expected Outcome
- Functional preview component for images and PDFs
- Clear file information display
- Working remove functionality
- Responsive design that adapts to container

### Verification Checklist
- [ ] `frontend/components/checkout/UploadPreview.tsx` created
- [ ] Component accepts file and onRemove props
- [ ] Image files display as thumbnails
- [ ] PDF files display with appropriate icon
- [ ] File name and size displayed correctly
- [ ] Remove button functional and positioned correctly
- [ ] Preview maintains aspect ratio
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 82: Upload Success Confirmation

### Overview
Create a success confirmation component that displays after payment proof is successfully uploaded. This component provides clear feedback to customers that their submission was received, explains the next steps in the verification process, and provides relevant reference information.

### Dependencies
- Task 79: Create Upload Component

### Instructions

1. **Create UploadSuccess component file**
   - Create `UploadSuccess.tsx` in `components/checkout/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `UploadSuccessProps` interface
   - Include `paymentReference` prop (string)
   - Include `uploadedAt` prop (Date or string)
   - Include optional `estimatedVerificationTime` prop

3. **Implement success icon display**
   - Add large checkmark icon or success animation
   - Use green color scheme for success state
   - Consider animated checkmark for visual appeal
   - Position icon prominently at top

4. **Create success message content**
   - Add primary heading: "Payment Proof Uploaded Successfully"
   - Add secondary message explaining next steps
   - Include verification timeline information
   - Add reassuring language about admin review

5. **Display reference information**
   - Show payment reference number prominently
   - Display upload timestamp
   - Show estimated verification time
   - Add copy button for reference number

6. **Add action buttons**
   - "View Order Status" button (primary)
   - "Return to Homepage" button (secondary)
   - Optional: "Upload Another File" button
   - Use proper button hierarchy and styling

7. **Implement email notification message**
   - Inform customer about confirmation email
   - Include email address where sent
   - Explain what email will contain
   - Add "Didn't receive email?" link

8. **Style success state**
   - Use card or modal container
   - Apply success color theme (green accents)
   - Add appropriate spacing and padding
   - Ensure responsive design

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| paymentReference | string | Yes | - | Payment reference number |
| uploadedAt | Date \| string | Yes | - | Upload timestamp |
| estimatedVerificationTime | string | No | "24-48 hours" | Expected verification time |
| orderNumber | string | No | - | Related order number |
| onViewOrder | () => void | No | - | View order callback |

### Success Display Structure

```
┌─────────────────────────────────────┐
│                                     │
│         ✓ (Large Checkmark)         │
│                                     │
│  Payment Proof Uploaded Successfully│  ← Heading
│                                     │
│  Reference: BT-2026-001234         │  ← Reference
│  Uploaded: Jan 31, 2026 10:30 AM   │  ← Timestamp
│                                     │
│  Your payment proof has been        │
│  submitted for verification.        │  ← Description
│  You will be notified once          │
│  approved (usually 24-48 hours).    │
│                                     │
│  ┌────────────────┐  ┌───────────┐ │
│  │ View Order     │  │ Homepage  │ │  ← Actions
│  └────────────────┘  └───────────┘ │
│                                     │
│  📧 Confirmation sent to:           │
│  customer@example.com               │  ← Email info
└─────────────────────────────────────┘
```

### Success Message Content

| Section | Content | Purpose |
|---------|---------|---------|
| Heading | "Payment Proof Uploaded Successfully" | Confirm action |
| Reference | Payment reference with copy button | Provide tracking ID |
| Timestamp | Upload date and time | Record keeping |
| Description | Verification process explanation | Set expectations |
| Timeline | "Usually verified within 24-48 hours" | Manage expectations |
| Email Notice | Confirmation email sent message | Additional assurance |

### Action Button Hierarchy

| Button | Type | Action | Priority |
|--------|------|--------|----------|
| View Order Status | Primary | Navigate to order page | High |
| Return to Homepage | Secondary | Navigate to home | Medium |
| Contact Support | Tertiary | Open support chat | Low |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg` | Card styling |
| Icon | `w-16 h-16 mx-auto text-green-500` | Success icon |
| Heading | `text-2xl font-bold text-center mt-4` | Primary message |
| Reference | `bg-gray-50 p-3 rounded text-center font-mono` | Highlight reference |
| Description | `text-gray-600 text-center mt-4` | Explanatory text |
| Button | `w-full mt-4 py-2 px-4 rounded-lg` | Action buttons |

### Success State Flow

```
Upload Complete
    │
    ▼
Display Success Message
    │
    ▼
Show Reference & Timestamp
    │
    ▼
Explain Next Steps
    │
    ▼
Provide Action Buttons
    │
    ├─→ View Order Status → Order Details Page
    ├─→ Return Home → Homepage
    └─→ Contact Support → Support Chat
```

### Email Notification Details

| Information | Description |
|-------------|-------------|
| Recipient | Customer email from order |
| Subject | "Payment Proof Received - Order #[number]" |
| Content | Reference, timestamp, next steps |
| Timeline | Sent immediately after upload |

### Expected Outcome
- Clear success confirmation with visual feedback
- Payment reference and timestamp displayed
- Actionable next steps for customer
- Email notification confirmation message

### Verification Checklist
- [ ] `frontend/components/checkout/UploadSuccess.tsx` created
- [ ] Success icon/animation displays prominently
- [ ] Payment reference displayed with copy functionality
- [ ] Upload timestamp formatted correctly
- [ ] Next steps clearly explained
- [ ] Action buttons functional and properly styled
- [ ] Email notification message included
- [ ] Responsive design implemented
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 83: Pending Status Page

### Overview
Create a dedicated page for displaying pending bank transfer payment status. This page shows customers that their payment is awaiting admin verification, displays the current status, provides payment details for reference, and allows customers to check status updates in real-time.

### Dependencies
- Task 74: Create BankTransfer API Client
- Task 75: Create Payment Hook

### Instructions

1. **Create pending status page route**
   - Navigate to `frontend/app/(checkout)/` or appropriate directory
   - Create route: `payment-pending/page.tsx`
   - Set up Next.js page component structure

2. **Implement URL parameter handling**
   - Accept payment ID or reference from URL query
   - Parse orderId from query parameters
   - Handle missing or invalid parameters gracefully
   - Redirect if no valid payment reference

3. **Fetch payment status data**
   - Use useBankTransfer hook or API client
   - Call getStatus method with payment ID
   - Implement loading state during fetch
   - Handle error states (payment not found, network errors)

4. **Display payment status indicator**
   - Show current status badge (Pending, Verifying, Verified, Rejected)
   - Use color coding for status (yellow=pending, blue=verifying, green=verified, red=rejected)
   - Add status icon for visual clarity
   - Display status update timestamp

5. **Show payment reference information**
   - Display payment reference number prominently
   - Show order number and total amount
   - Display upload timestamp
   - Show estimated verification time remaining

6. **Create timeline visualization**
   - Show payment flow steps as timeline
   - Highlight current step
   - Mark completed steps with checkmarks
   - Show pending steps in gray
   - Timeline: Order Placed → Proof Uploaded → Verification → Completed

7. **Add bank transfer details section**
   - Display bank accounts used for transfer
   - Show transfer reference number
   - Show upload date and time
   - Add "View Uploaded Proof" button (if applicable)

8. **Implement real-time status updates**
   - Add "Refresh Status" button
   - Implement auto-refresh every 30-60 seconds (optional)
   - Show last updated timestamp
   - Display loading indicator during refresh

9. **Add action buttons**
   - "View Order Details" button
   - "Contact Support" button
   - "Return to Homepage" button
   - Conditional actions based on status

10. **Handle different status states**
    - Pending: Show "Awaiting Verification" message
    - Verifying: Show "Under Review" message
    - Verified: Show success and redirect options
    - Rejected: Show reason and re-upload option

### Page Structure

```
┌──────────────────────────────────────────┐
│  Payment Status                          │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Status: ⏳ Pending Verification   │ │
│  │  Reference: BT-2026-001234         │ │
│  │  Order: #ORD-5678                  │ │
│  │  Amount: Rs. 15,000.00             │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Timeline:                               │
│  ✓ Order Placed                          │
│  ✓ Payment Proof Uploaded                │
│  ● Verification (Current)                │
│  ○ Payment Confirmed                     │
│                                          │
│  Bank Transfer Details:                  │
│  [Bank account information]              │
│  [Upload timestamp]                      │
│                                          │
│  Actions:                                │
│  [Refresh Status] [View Order] [Support] │
└──────────────────────────────────────────┘
```

### URL Structure

| Pattern | Example | Description |
|---------|---------|-------------|
| With ID | `/payment-pending?id=123` | Payment by ID |
| With Reference | `/payment-pending?ref=BT-2026-001234` | Payment by reference |
| With Order | `/payment-pending?order=ORD-5678` | Payment by order number |

### Payment Status Types

| Status | Display | Color | Icon | Description |
|--------|---------|-------|------|-------------|
| PENDING | Pending Verification | Yellow | ⏳ | Awaiting admin review |
| VERIFYING | Under Review | Blue | 🔍 | Admin actively reviewing |
| VERIFIED | Payment Confirmed | Green | ✓ | Payment approved |
| REJECTED | Payment Rejected | Red | ✗ | Payment not approved |
| EXPIRED | Payment Expired | Gray | ⌛ | Payment window expired |

### Timeline Steps

```
Step 1: Order Placed
    │  ✓ Completed
    │  Jan 31, 2026 09:45 AM
    ▼
Step 2: Proof Uploaded
    │  ✓ Completed
    │  Jan 31, 2026 10:30 AM
    ▼
Step 3: Verification
    │  ● In Progress
    │  Estimated: 24-48 hours
    ▼
Step 4: Payment Confirmed
    │  ○ Pending
    │  Will notify via email
    ▼
Step 5: Order Processing
    ○ Pending
```

### Status-Specific Content

| Status | Heading | Message | Actions |
|--------|---------|---------|---------|
| Pending | "Awaiting Verification" | "Your payment proof is being reviewed..." | Refresh, Support |
| Verifying | "Under Review" | "Our team is verifying your payment..." | Refresh, Support |
| Verified | "Payment Confirmed" | "Your payment has been verified!" | View Order |
| Rejected | "Payment Rejected" | "Payment could not be verified. Reason: [...]" | Re-upload, Support |
| Expired | "Payment Expired" | "Payment window has expired." | New Payment, Support |

### Real-Time Updates

| Method | Implementation | Frequency |
|--------|----------------|-----------|
| Manual | "Refresh Status" button | On demand |
| Auto-refresh | Polling API | Every 60 seconds |
| WebSocket | Real-time push | Instant updates |
| Last Updated | Display timestamp | After each fetch |

### Data Fetching Strategy

```
Page Load
    │
    ▼
Get Payment ID from URL
    │
    ▼
Fetch Payment Status
    │
    ├─→ Success: Display status
    ├─→ Loading: Show skeleton
    └─→ Error: Show error message
    │
    ▼
Auto-refresh (Optional)
    │
    └─→ Repeat every 60 seconds
```

### Error Handling

| Error | Display | Action |
|-------|---------|--------|
| Payment Not Found | "Payment not found" message | Redirect to orders page |
| Invalid Reference | "Invalid reference" message | Show error and redirect |
| Network Error | "Connection error" with retry | Retry button |
| Unauthorized | "Access denied" message | Redirect to login |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `max-w-2xl mx-auto p-6` | Page layout |
| Status Badge | `inline-flex items-center px-3 py-1 rounded-full` | Status display |
| Timeline | `space-y-4 border-l-2 pl-4` | Visual timeline |
| Detail Card | `bg-white rounded-lg shadow p-6` | Information cards |
| Action Button | `px-4 py-2 rounded-lg font-medium` | Interactive buttons |

### Expected Outcome
- Functional pending status page with real-time updates
- Clear visual status indicators and timeline
- Payment reference and order information displayed
- Actionable buttons for customer next steps

### Verification Checklist
- [ ] Pending status page route created
- [ ] URL parameters handled correctly
- [ ] Payment status fetched and displayed
- [ ] Status badge with appropriate colors and icons
- [ ] Timeline visualization implemented
- [ ] Payment details displayed accurately
- [ ] Refresh functionality working
- [ ] Action buttons functional
- [ ] Different status states handled
- [ ] Error states handled gracefully
- [ ] Responsive design implemented
- [ ] TypeScript types defined correctly

---

## Task 84: BankTransfer Payment Button

### Overview
Create the bank transfer payment button component for the checkout page. This button initiates the bank transfer payment flow, displays the payment method clearly with appropriate branding, and handles the transition to the bank details display page. This is the primary entry point for customers choosing bank transfer as their payment method.

### Dependencies
- Task 74: Create BankTransfer API Client
- Task 75: Create Payment Hook

### Instructions

1. **Create BankTransferButton component file**
   - Create `BankTransferButton.tsx` in `components/checkout/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `BankTransferButtonProps` interface
   - Include `orderId` prop (string or number)
   - Include `amount` prop (number) for display
   - Include `onSuccess` callback function
   - Include optional `disabled` prop
   - Include optional `className` prop

3. **Import required dependencies**
   - Import useBankTransfer hook
   - Import necessary icons (bank icon)
   - Import loading spinner component
   - Import toast/notification system

4. **Implement button click handler**
   - Call useBankTransfer hook's initiate method
   - Pass orderId and amount to initiation
   - Handle loading state during API call
   - Handle success response
   - Handle error response with error messages

5. **Create button UI structure**
   - Add bank icon to button
   - Display "Bank Transfer" text
   - Show payment method description
   - Add loading spinner during processing
   - Disable button during loading

6. **Style button appropriately**
   - Use primary or secondary button styling
   - Add hover and focus states
   - Implement disabled state styling
   - Ensure button stands out among payment options

7. **Handle success flow**
   - Store bank transfer response data
   - Call onSuccess callback with data
   - Navigate to bank details display page
   - Pass payment reference and bank details

8. **Implement error handling**
   - Display error toast on API failure
   - Show user-friendly error messages
   - Keep button enabled for retry
   - Log errors for debugging

9. **Add payment method information**
   - Show brief description: "Transfer from your bank account"
   - Display processing time: "Manual verification required"
   - Add tooltip with more details (optional)

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| orderId | string \| number | Yes | - | Order ID to pay for |
| amount | number | Yes | - | Payment amount in Rs. |
| onSuccess | (data) => void | Yes | - | Success callback with bank details |
| disabled | boolean | No | false | Disable button |
| className | string | No | "" | Additional CSS classes |
| size | "sm" \| "md" \| "lg" | No | "md" | Button size |

### Button States

| State | Visual | Behavior | Duration |
|-------|--------|----------|----------|
| Idle | Normal styling | Clickable | Until clicked |
| Loading | Spinner + disabled | Not clickable | During API call |
| Success | Brief checkmark | Transition away | 1-2 seconds |
| Error | Normal + toast | Clickable again | After error |
| Disabled | Grayed out | Not clickable | While disabled prop |

### Button Structure

```
┌──────────────────────────────────────┐
│  🏦  Bank Transfer                   │  ← Icon + Text
│                                      │
│  Transfer from your bank account     │  ← Description
│  Manual verification (24-48 hours)   │  ← Processing time
└──────────────────────────────────────┘
```

### Button Click Flow

```
User Clicks Button
    │
    ▼
Set Loading State
    │
    ▼
Call initiate() API
    │
    ├─→ Success
    │   │
    │   ▼
    │   Store Response Data
    │   │
    │   ▼
    │   Call onSuccess Callback
    │   │
    │   ▼
    │   Navigate to Bank Details
    │
    └─→ Error
        │
        ▼
        Display Error Toast
        │
        ▼
        Reset to Idle State
```

### API Integration

| Action | API Call | Parameters | Response |
|--------|----------|------------|----------|
| Initiate | POST /api/payments/bank-transfer/initiate/ | orderId, amount | accounts, reference, expires_at |

### Success Response Handling

| Data Field | Usage | Example |
|------------|-------|---------|
| accounts | Display bank details | Array of bank accounts |
| reference | Payment tracking | "BT-2026-001234" |
| expires_at | Countdown timer | "2026-02-01T10:30:00Z" |
| payment_id | Status tracking | 123 |

### Error Scenarios

| Error Type | Message | User Action |
|------------|---------|-------------|
| Network Error | "Connection failed. Please try again." | Retry button enabled |
| Server Error | "Unable to process request. Contact support." | Support link provided |
| Validation Error | "Invalid order or amount." | Check order details |
| Order Already Paid | "This order has already been paid." | View order status |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Button | `w-full p-4 rounded-lg border-2 hover:border-blue-500` | Main container |
| Icon | `w-8 h-8 text-blue-600` | Bank icon |
| Title | `text-lg font-semibold text-gray-900` | Payment method name |
| Description | `text-sm text-gray-600 mt-1` | Method description |
| Loading | `animate-spin w-5 h-5` | Loading spinner |
| Disabled | `opacity-50 cursor-not-allowed` | Disabled state |

### Payment Method Display

| Component | Content |
|-----------|---------|
| Icon | Bank building icon (🏦) |
| Title | "Bank Transfer" |
| Description | "Transfer from your bank account" |
| Badge | "Manual Verification" |
| Processing Time | "24-48 hours" |

### Integration with Checkout

```
Checkout Payment Methods:
├── Credit/Debit Card
├── Bank Transfer ← This Component
├── Mobile Payment
└── Cash on Delivery

Selection Flow:
User selects Bank Transfer
    │
    ▼
BankTransferButton clicked
    │
    ▼
Navigate to Bank Details Page
    │
    ▼
Show BankDetailsDisplay component
```

### Expected Outcome
- Functional button that initiates bank transfer flow
- Clear visual representation of payment method
- Proper loading and error states
- Smooth transition to bank details page

### Verification Checklist
- [ ] `frontend/components/checkout/BankTransferButton.tsx` created
- [ ] Component accepts required props (orderId, amount, onSuccess)
- [ ] Button displays bank icon and descriptive text
- [ ] Click handler calls initiate API correctly
- [ ] Loading state displays spinner and disables button
- [ ] Success callback executed with response data
- [ ] Error handling with user-friendly messages
- [ ] Button styling matches checkout design system
- [ ] Disabled state handled appropriately
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 85: Integration Tests

### Overview
Create comprehensive integration tests for the bank transfer payment flow. These tests verify the complete end-to-end functionality including payment initiation, bank details display, file upload, status checking, and admin verification workflow. Tests ensure all components work together correctly and handle various scenarios including success and error cases.

### Dependencies
- Task 72: Backend Integration Tests
- All frontend tasks (73-84) completed

### Instructions

1. **Create test file structure**
   - Navigate to `frontend/__tests__/payments/` directory
   - Create test file: `bank-transfer.test.ts` or `.tsx`
   - Set up test framework imports (Jest, React Testing Library)
   - Create test suite with describe blocks

2. **Set up test environment**
   - Import necessary testing utilities
   - Import components to be tested
   - Import mock API utilities
   - Set up mock providers (router, context, etc.)

3. **Create mock data fixtures**
   - Mock bank account data
   - Mock payment response data
   - Mock order data
   - Mock file upload responses
   - Mock status check responses

4. **Mock API endpoints**
   - Mock initiate endpoint response
   - Mock upload endpoint response
   - Mock status endpoint response
   - Set up MSW (Mock Service Worker) or similar
   - Handle success and error scenarios

5. **Write test: Bank Transfer Initiation**
   - Test button click triggers API call
   - Verify loading state displayed
   - Verify success response handled correctly
   - Verify bank details displayed after initiation
   - Verify error handling on API failure

6. **Write test: Bank Details Display**
   - Test bank accounts rendered correctly
   - Test reference number displayed
   - Test countdown timer starts correctly
   - Test copy button functionality
   - Test amount formatting

7. **Write test: File Upload Flow**
   - Test file selection via input
   - Test file validation (type, size)
   - Test drag and drop functionality
   - Test upload progress display
   - Test upload success confirmation
   - Test upload error handling

8. **Write test: Upload Preview**
   - Test image preview generation
   - Test PDF preview display
   - Test file information display
   - Test remove file functionality

9. **Write test: Pending Status Page**
   - Test status fetching on page load
   - Test status display correct
   - Test timeline visualization
   - Test refresh functionality
   - Test different status states

10. **Write test: Complete Payment Flow**
    - Test end-to-end flow from button to completion
    - User clicks bank transfer button
    - Bank details displayed
    - User uploads proof
    - Status page shown
    - Admin verification simulated
    - Order status updated

11. **Write test: Error Scenarios**
    - Test network error handling
    - Test invalid file type rejection
    - Test file too large rejection
    - Test expired payment handling
    - Test rejected payment handling

12. **Write test: Edge Cases**
    - Test missing required fields
    - Test concurrent uploads
    - Test navigation during upload
    - Test countdown timer expiry
    - Test status refresh during state change

### Test Suite Structure

```
describe("Bank Transfer Integration Tests", () => {
  
  describe("Payment Initiation", () => {
    test("Initiates bank transfer successfully")
    test("Displays loading state during initiation")
    test("Handles initiation error gracefully")
    test("Navigates to bank details on success")
  })
  
  describe("Bank Details Display", () => {
    test("Displays all bank accounts")
    test("Shows payment reference number")
    test("Displays countdown timer")
    test("Copy button copies to clipboard")
    test("Formats amount correctly")
  })
  
  describe("File Upload", () => {
    test("Accepts valid image file")
    test("Accepts valid PDF file")
    test("Rejects invalid file type")
    test("Rejects oversized file")
    test("Shows upload progress")
    test("Displays upload success")
    test("Handles upload error")
  })
  
  describe("Upload Preview", () => {
    test("Generates image preview")
    test("Shows PDF icon for PDF")
    test("Displays file metadata")
    test("Remove button works correctly")
  })
  
  describe("Pending Status Page", () => {
    test("Fetches payment status on load")
    test("Displays correct status badge")
    test("Shows timeline correctly")
    test("Refresh updates status")
    test("Handles missing payment ID")
  })
  
  describe("End-to-End Flow", () => {
    test("Complete successful payment flow")
    test("Flow with payment rejection")
    test("Flow with expired payment")
  })
  
  describe("Error Handling", () => {
    test("Network error during initiation")
    test("Invalid file upload")
    test("Expired payment window")
    test("Server error handling")
  })
})
```

### Mock Data Examples

| Mock | Fields | Purpose |
|------|--------|---------|
| Bank Account | name, account_number, branch, bank_code | Test bank details display |
| Payment Response | accounts, reference, expires_at, payment_id | Test initiation success |
| Upload Response | success, proof_id, uploaded_at | Test upload success |
| Status Response | status, updated_at, admin_notes | Test status display |
| Order Data | id, amount, status, customer | Test order context |

### Test Scenarios Matrix

| Scenario | Input | Expected Output | Verification |
|----------|-------|-----------------|--------------|
| Valid Initiation | Valid orderId, amount | Bank details displayed | Check accounts rendered |
| Invalid Order | Invalid orderId | Error message | Check error toast |
| Valid Upload | Valid image file | Success confirmation | Check success message |
| Invalid File | Non-image file | Rejection message | Check error message |
| Expired Payment | Old expires_at | Expired warning | Check expiry notice |
| Pending Status | PENDING status | Yellow badge | Check badge color |
| Verified Status | VERIFIED status | Green badge | Check badge color |

### API Mocking Strategy

```
Mock Setup:
├── MSW (Mock Service Worker)
│   ├── POST /api/payments/bank-transfer/initiate/
│   ├── POST /api/payments/{id}/proof/
│   └── GET /api/payments/{id}/status/
│
├── Success Responses
│   ├── 200 with valid data
│   └── Delay simulation (optional)
│
└── Error Responses
    ├── 400 Bad Request
    ├── 404 Not Found
    ├── 500 Server Error
    └── Network timeout
```

### Testing Utilities

| Utility | Purpose | Example |
|---------|---------|---------|
| render() | Render component | `render(<Component />)` |
| screen | Query elements | `screen.getByRole('button')` |
| fireEvent | Trigger events | `fireEvent.click(button)` |
| waitFor() | Wait for async | `await waitFor(() => ...)` |
| userEvent | Simulate user actions | `userEvent.type(input, 'text')` |

### Assertion Examples

```
Check Element Existence:
expect(screen.getByText('Bank Transfer')).toBeInTheDocument()

Check Element Count:
expect(screen.getAllByRole('listitem')).toHaveLength(3)

Check API Call:
expect(mockApiCall).toHaveBeenCalledWith(expectedParams)

Check Navigation:
expect(mockRouter.push).toHaveBeenCalledWith('/bank-details')

Check State:
expect(button).toBeDisabled()
expect(input).toHaveValue('expected value')
```

### Coverage Goals

| Category | Target | Priority |
|----------|--------|----------|
| Line Coverage | > 80% | High |
| Branch Coverage | > 75% | High |
| Function Coverage | > 85% | High |
| Integration Paths | 100% | Critical |

### Expected Outcome
- Comprehensive test suite covering all bank transfer functionality
- Tests for success and error scenarios
- Integration tests for complete payment flows
- High code coverage with meaningful assertions

### Verification Checklist
- [ ] Test file created in correct location
- [ ] Test environment and mocks set up
- [ ] Mock data fixtures created
- [ ] API endpoints mocked correctly
- [ ] Initiation tests written and passing
- [ ] Bank details display tests written and passing
- [ ] File upload tests written and passing
- [ ] Upload preview tests written and passing
- [ ] Pending status tests written and passing
- [ ] End-to-end flow tests written and passing
- [ ] Error handling tests written and passing
- [ ] Edge case tests written and passing
- [ ] All tests pass successfully
- [ ] Code coverage meets targets

---

## Task 86: Bank Transfer Documentation

### Overview
Create comprehensive documentation for the bank transfer payment method. This documentation covers setup instructions, customer usage flow, admin verification workflow, technical implementation details, troubleshooting guides, and FAQs. The documentation serves as a reference for developers, administrators, and support staff.

### Dependencies
- Task 85: Integration Tests (to document tested functionality)

### Instructions

1. **Create documentation file**
   - Navigate to documentation directory (e.g., `docs/payments/`)
   - Create file: `bank-transfer.md`
   - Set up documentation structure with clear sections

2. **Write Overview section**
   - Explain what bank transfer payment is
   - Describe when to use this payment method
   - List key features and capabilities
   - Highlight benefits and limitations

3. **Document Setup and Configuration**
   - Environment variables required
   - Bank account configuration in admin
   - Expiry time settings
   - File upload limits configuration
   - Email notification templates

4. **Document Customer Flow**
   - Step-by-step customer journey
   - Screenshots or diagrams of each step
   - What customers see at each stage
   - Expected timelines and wait times

5. **Document Admin Workflow**
   - How admins access pending payments
   - Steps to verify payment proof
   - Approve or reject process
   - Adding verification notes
   - Notification triggers

6. **Create Technical Documentation**
   - API endpoints and parameters
   - Request/response formats
   - Data models and types
   - Database schema
   - Frontend components structure

7. **Write Integration Guide**
   - How to integrate into checkout flow
   - Required frontend components
   - Hook usage examples
   - Event handling
   - Error handling patterns

8. **Document Testing Procedures**
   - How to run tests
   - Test data setup
   - Manual testing checklist
   - Expected test results

9. **Create Troubleshooting Guide**
   - Common issues and solutions
   - Error messages and meanings
   - Debugging tips
   - Log file locations
   - Support escalation path

10. **Write FAQ Section**
    - Common questions from customers
    - Common questions from admins
    - Technical questions from developers
    - Business policy questions

11. **Add Configuration Examples**
    - Example environment variables
    - Example bank account setup
    - Example email templates
    - Example admin settings

12. **Include Diagrams and Visuals**
    - Payment flow diagram
    - System architecture diagram
    - Database schema diagram
    - UI mockups or screenshots

### Documentation Structure

```markdown
# Bank Transfer Payment Documentation

## Table of Contents
1. Overview
2. Setup and Configuration
3. Customer Flow
4. Admin Workflow
5. Technical Documentation
6. Integration Guide
7. Testing
8. Troubleshooting
9. FAQ
10. Appendices

## 1. Overview
[What is bank transfer payment]
[When to use]
[Key features]

## 2. Setup and Configuration
[Environment variables]
[Bank account configuration]
[Settings]

## 3. Customer Flow
[Step-by-step guide with screenshots]

## 4. Admin Workflow
[Verification process]
[Approval/rejection]

## 5. Technical Documentation
[API endpoints]
[Data models]
[Database schema]

## 6. Integration Guide
[How to integrate]
[Code examples]

## 7. Testing
[Test procedures]
[Test data]

## 8. Troubleshooting
[Common issues]
[Solutions]

## 9. FAQ
[Questions and answers]

## 10. Appendices
[Additional resources]
[References]
```

### Overview Section Content

| Topic | Content |
|-------|---------|
| Description | Manual bank transfer payment method with upload verification |
| Use Cases | Large orders, B2B payments, customers preferring bank transfers |
| Features | Manual verification, proof upload, expiry timer, status tracking |
| Benefits | Lower fees, direct bank transfers, suitable for large amounts |
| Limitations | Manual verification required, 24-48 hour processing time |

### Setup Configuration Details

| Configuration | Type | Example | Description |
|---------------|------|---------|-------------|
| BANK_TRANSFER_ENABLED | Boolean | true | Enable/disable feature |
| BANK_TRANSFER_EXPIRY_HOURS | Integer | 24 | Payment expiry time |
| BANK_TRANSFER_MAX_FILE_SIZE | Integer | 5242880 | Max upload size (bytes) |
| BANK_TRANSFER_ALLOWED_TYPES | List | jpg,png,pdf | Allowed file types |

### Customer Flow Steps

```
Step 1: Select Payment Method
├── User selects "Bank Transfer" at checkout
└── Clicks "Pay with Bank Transfer" button

Step 2: View Bank Details
├── System displays bank accounts
├── Shows payment reference number
├── Displays amount to transfer
└── Shows countdown timer

Step 3: Make Bank Transfer
├── Customer transfers from their bank
├── Uses provided reference number
└── Completes transfer

Step 4: Upload Payment Proof
├── Customer uploads proof (receipt/screenshot)
├── Sees upload progress
└── Receives upload confirmation

Step 5: Await Verification
├── Payment status shows "Pending"
├── Customer receives confirmation email
└── Can check status anytime

Step 6: Verification Complete
├── Admin verifies payment
├── Customer receives approval email
└── Order proceeds to fulfillment
```

### Admin Workflow Diagram

```
Admin Dashboard
    │
    ▼
Navigate to Pending Payments
    │
    ▼
View Payment Details
├── Bank transfer details
├── Order information
├── Customer information
└── Uploaded proof file
    │
    ▼
Verify Payment Proof
├── Check bank account
├── Verify amount
├── Match reference number
└── Check transfer date
    │
    ├─→ Payment Valid?
    │   │
    │   ├─→ YES: Approve Payment
    │   │   ├── Click "Approve" button
    │   │   ├── Add verification notes
    │   │   ├── System updates order status
    │   │   └── Customer email sent
    │   │
    │   └─→ NO: Reject Payment
    │       ├── Click "Reject" button
    │       ├── Add rejection reason
    │       ├── System notifies customer
    │       └── Customer can re-upload
    │
    ▼
Verification Complete
```

### API Endpoints Reference

| Method | Endpoint | Parameters | Response | Description |
|--------|----------|------------|----------|-------------|
| POST | /api/payments/bank-transfer/initiate/ | order_id, amount | accounts, reference, expires_at | Initiate payment |
| POST | /api/payments/{id}/proof/ | file (multipart) | proof_id, uploaded_at | Upload proof |
| GET | /api/payments/{id}/status/ | - | status, updated_at, notes | Get status |
| POST | /api/admin/payments/{id}/verify/ | status, notes | success | Admin verify |

### Data Models Documentation

```typescript
// Bank Account Model
interface BankAccount {
  name: string;              // Bank name
  account_number: string;    // Account number
  account_name: string;      // Account holder name
  branch: string;            // Branch name
  bank_code: string;         // Bank code/SWIFT
}

// Payment Response Model
interface BankTransferResponse {
  payment_id: number;        // Payment ID
  accounts: BankAccount[];   // Bank accounts
  reference: string;         // Reference number
  expires_at: string;        // Expiry timestamp
  amount: number;            // Amount in Rs.
}

// Upload Response Model
interface UploadResponse {
  proof_id: number;          // Proof ID
  uploaded_at: string;       // Upload timestamp
  filename: string;          // File name
  file_size: number;         // File size (bytes)
}

// Status Response Model
interface StatusResponse {
  status: PaymentStatus;     // Current status
  payment_id: number;        // Payment ID
  reference: string;         // Reference number
  uploaded_at?: string;      // Upload time
  verified_at?: string;      // Verification time
  admin_notes?: string;      // Admin notes
  updated_at: string;        // Last update
}
```

### Troubleshooting Guide

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Upload fails | File too large | Reduce file size or compress |
| Upload fails | Invalid file type | Use JPG, PNG, or PDF |
| Timer expired | Waited too long | Initiate new payment |
| Reference not showing | JavaScript error | Clear cache and refresh |
| Status not updating | Cache issue | Click refresh status |
| Admin can't see proof | Permission issue | Check admin role permissions |

### FAQ Content

#### Customer FAQs

| Question | Answer |
|----------|--------|
| How long do I have to make the transfer? | 24 hours from payment initiation |
| What file types can I upload? | JPG, PNG, or PDF (max 5MB) |
| How long until verification? | Usually 24-48 hours during business days |
| Can I change payment method? | Yes, before uploading proof |
| What if payment is rejected? | You can re-upload proof or choose another method |

#### Admin FAQs

| Question | Answer |
|----------|--------|
| How to access pending payments? | Admin Dashboard → Payments → Bank Transfers |
| What to check when verifying? | Amount, reference number, transfer date, bank account |
| Can I edit verification after approval? | Contact technical support |
| How to handle suspicious payments? | Reject with detailed notes and contact customer |

#### Developer FAQs

| Question | Answer |
|----------|--------|
| How to customize expiry time? | Update BANK_TRANSFER_EXPIRY_HOURS env variable |
| How to add new bank account? | Admin panel → Settings → Bank Accounts → Add |
| How to customize email templates? | Edit templates in /templates/emails/bank_transfer/ |
| How to extend file type support? | Update BANK_TRANSFER_ALLOWED_TYPES setting |

### Expected Outcome
- Complete documentation covering all aspects of bank transfer
- Clear step-by-step guides for users and admins
- Technical reference for developers
- Troubleshooting guide for support staff
- FAQ for common questions

### Verification Checklist
- [ ] Documentation file created
- [ ] Overview section written
- [ ] Setup and configuration documented
- [ ] Customer flow documented with steps
- [ ] Admin workflow documented
- [ ] API endpoints documented
- [ ] Data models documented
- [ ] Integration guide written
- [ ] Testing procedures documented
- [ ] Troubleshooting guide created
- [ ] FAQ section completed
- [ ] Diagrams and visuals included
- [ ] Code examples provided
- [ ] Configuration examples included
- [ ] Documentation reviewed for accuracy

---

## Summary

This document completed the bank transfer frontend integration with upload progress, preview functionality, success confirmations, the pending status page, payment button integration, comprehensive testing, and full documentation. The bank transfer payment method is now fully functional and ready for production use.

### Completed Tasks
1. ✓ Created upload progress bar with real-time percentage display
2. ✓ Created upload preview component for images and PDFs
3. ✓ Created upload success confirmation with next steps
4. ✓ Created pending status page with timeline and real-time updates
5. ✓ Created bank transfer payment button for checkout
6. ✓ Created comprehensive integration tests for complete flow
7. ✓ Created detailed documentation for all stakeholders

### Next Steps
Proceed to [SubPhase-06_Cash-On-Delivery](../../SubPhase-06_Cash-On-Delivery/) to implement the cash on delivery payment method with similar verification workflows.

---

## Phase-09 Progress Tracker

### SubPhase-05: Bank Transfer with Upload - Status: ✓ Complete

| Group | Tasks | Status |
|-------|-------|--------|
| A: Backend Models & API | 01-14 | ✓ Complete |
| B: Payment Initiation | 15-28 | ✓ Complete |
| C: File Upload & Storage | 29-42 | ✓ Complete |
| D: Expiry & Validation | 43-56 | ✓ Complete |
| E: Admin Verification | 57-72 | ✓ Complete |
| F: Frontend & Testing | 73-86 | ✓ Complete |

**Total Tasks Completed:** 86/86 (100%)

---

*Document generated for Phase-09, SubPhase-05, Group-F, covering Tasks 80-86*
