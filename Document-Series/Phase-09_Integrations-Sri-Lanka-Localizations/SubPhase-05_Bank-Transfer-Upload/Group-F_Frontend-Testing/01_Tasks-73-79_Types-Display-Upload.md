# Tasks 73-79: Types, Display, and Upload Components

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** F - Frontend & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 73, 74, 75, 76, 77, 78, 79

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-E: 02_Tasks-66-72_API-Email-Verify.md](../Group-E_Admin-Verification-Workflow/02_Tasks-66-72_API-Email-Verify.md)
- **→ Next Document:** [02_Tasks-80-86_Progress-Testing-Docs.md](02_Tasks-80-86_Progress-Testing-Docs.md)

---

## Document Overview

This document covers the frontend implementation of bank transfer payment functionality, including TypeScript types, API client, custom hooks, and user interface components. It establishes the foundation for displaying bank account details, enabling clipboard copy functionality, implementing countdown timers for payment expiry, and creating drag-and-drop file upload components for payment proof submission.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create BankTransfer Types | Low | 20 min |
| 74 | Create BankTransfer API Client | Medium | 45 min |
| 75 | Create useBankTransfer Payment Hook | Medium | 40 min |
| 76 | Create Bank Details Display Component | Medium | 50 min |
| 77 | Create Copy to Clipboard Button | Low | 25 min |
| 78 | Create Countdown Timer Component | Medium | 35 min |
| 79 | Create Upload Component with Drag & Drop | Medium | 60 min |

---

## Task 73: Create BankTransfer Types

### Overview
Create comprehensive TypeScript type definitions for bank transfer functionality. These types ensure type safety across the entire bank transfer payment flow, covering bank account information, payment initiation responses, proof upload data, and payment status tracking.

### Dependencies
- Task 72: Create BankTransfer Payment Signal (from Group E)
- Frontend TypeScript configuration established
- Payment types foundation from earlier phases

### Instructions

1. **Create types directory structure**
   - Navigate to `frontend/lib/payments/bank-transfer/` directory
   - Create `types.ts` file
   - Ensure proper module exports

2. **Define BankAccount interface**
   - Include bank name field (string)
   - Include account number field (string)
   - Include branch name field (string)
   - Include bank code field (string, optional)
   - Include swift code field (string, optional)

3. **Define BankTransferPaymentData interface**
   - Include bank account selection field
   - Include order ID field (string)
   - Include amount field (Decimal/number)
   - Include currency field (string)
   - Include customer reference field (string)

4. **Define BankTransferResponse interface**
   - Include available accounts array (BankAccount[])
   - Include payment reference number (string)
   - Include payment ID (string)
   - Include expires at timestamp (Date/string)
   - Include instructions text (string)
   - Include created at timestamp (Date/string)

5. **Define PaymentProof interface**
   - Include file field (File object)
   - Include uploaded at timestamp (Date/string)
   - Include notes field (string, optional)
   - Include verification status (enum)
   - Include verified by field (string, optional)
   - Include verified at timestamp (Date/string, optional)

6. **Define PaymentStatus enum**
   - PENDING_PAYMENT value
   - PROOF_UPLOADED value
   - UNDER_VERIFICATION value
   - VERIFIED value
   - REJECTED value
   - EXPIRED value

7. **Define UploadProgress interface**
   - Include progress percentage (number, 0-100)
   - Include upload status (enum: idle, uploading, success, error)
   - Include error message (string, optional)

8. **Define file validation types**
   - Define allowed file types (JPEG, PNG, PDF)
   - Define maximum file size (5MB)
   - Define file validation error types

### Type Structure Overview

```
BankTransfer Type System
├── BankAccount
│   ├── name: string
│   ├── account_number: string
│   ├── branch: string
│   ├── bank_code?: string
│   └── swift_code?: string
│
├── BankTransferPaymentData
│   ├── order_id: string
│   ├── amount: Decimal
│   ├── currency: string
│   └── customer_reference: string
│
├── BankTransferResponse
│   ├── accounts: BankAccount[]
│   ├── reference: string
│   ├── payment_id: string
│   ├── expires_at: string
│   ├── instructions: string
│   └── created_at: string
│
├── PaymentProof
│   ├── file: File
│   ├── uploaded_at: string
│   ├── notes?: string
│   ├── status: VerificationStatus
│   ├── verified_by?: string
│   └── verified_at?: string
│
├── PaymentStatus (enum)
│   ├── PENDING_PAYMENT
│   ├── PROOF_UPLOADED
│   ├── UNDER_VERIFICATION
│   ├── VERIFIED
│   ├── REJECTED
│   └── EXPIRED
│
└── UploadProgress
    ├── progress: number
    ├── status: UploadStatus
    └── error?: string
```

### Field Specifications

| Type | Field | Type | Required | Validation |
|------|-------|------|----------|------------|
| BankAccount | name | string | Yes | Max 100 chars |
| BankAccount | account_number | string | Yes | Alphanumeric |
| BankAccount | branch | string | Yes | Max 100 chars |
| BankTransferResponse | reference | string | Yes | Unique |
| BankTransferResponse | expires_at | string | Yes | ISO 8601 |
| PaymentProof | file | File | Yes | Max 5MB |
| UploadProgress | progress | number | Yes | 0-100 |

### Type Export Pattern

| Export | Usage |
|--------|-------|
| Named exports | Individual type imports |
| Namespace export | Group all types together |
| Re-export from index | Simplify import paths |

### Expected Outcome
- Complete TypeScript type definitions for bank transfer
- Type safety across payment flow
- Clear interfaces for API responses
- Proper enum definitions for status tracking
- File validation types for upload component

### Verification Checklist
- [ ] `frontend/lib/payments/bank-transfer/types.ts` created
- [ ] All required interfaces defined
- [ ] PaymentStatus enum created with all states
- [ ] File validation types included
- [ ] UploadProgress interface for UI feedback
- [ ] All fields properly typed
- [ ] Optional fields marked with `?`
- [ ] Types exported correctly

---

## Task 74: Create BankTransfer API Client

### Overview
Create a dedicated API client for bank transfer operations, providing methods to initiate bank transfer payments, upload payment proofs, check payment status, and handle API responses. This client encapsulates all HTTP communication with the backend bank transfer endpoints.

### Dependencies
- Task 73: Create BankTransfer Types
- Base API client from Core Frontend Infrastructure
- Axios or Fetch API configured

### Instructions

1. **Create API client file**
   - Navigate to `frontend/lib/payments/bank-transfer/` directory
   - Create `client.ts` file
   - Import necessary types from types.ts

2. **Set up base configuration**
   - Import base API client or axios instance
   - Define base URL for payment endpoints
   - Configure request interceptors for auth tokens
   - Set up response interceptors for error handling

3. **Implement initiateBankTransfer method**
   - Accept order ID as parameter
   - Accept amount as parameter
   - Make POST request to `/api/payments/bank-transfer/initiate/`
   - Include order details in request body
   - Return BankTransferResponse type
   - Handle errors and throw appropriate exceptions

4. **Implement uploadPaymentProof method**
   - Accept payment ID as parameter
   - Accept File object as parameter
   - Accept optional notes as parameter
   - Create FormData for file upload
   - Make POST request to `/api/payments/{id}/proof/`
   - Include Content-Type: multipart/form-data
   - Track upload progress via onUploadProgress
   - Return upload confirmation response
   - Handle file size and type validation errors

5. **Implement getPaymentStatus method**
   - Accept payment ID as parameter
   - Make GET request to `/api/payments/{id}/status/`
   - Return payment status response
   - Include latest verification info
   - Handle not found errors

6. **Implement cancelPayment method**
   - Accept payment ID as parameter
   - Make POST request to `/api/payments/{id}/cancel/`
   - Return cancellation confirmation
   - Handle already processed errors

7. **Add error handling utilities**
   - Create error parser for API responses
   - Map HTTP status codes to user messages
   - Handle network errors gracefully
   - Extract validation errors from response

8. **Add request/response logging (development only)**
   - Log outgoing requests with payload
   - Log response status and data
   - Redact sensitive information
   - Use environment variable to control logging

### API Client Architecture

```
BankTransfer API Client
│
├── Configuration
│   ├── Base URL
│   ├── Auth interceptor
│   └── Error interceptor
│
├── Methods
│   ├── initiateBankTransfer()
│   │   └── POST /api/payments/bank-transfer/initiate/
│   │
│   ├── uploadPaymentProof()
│   │   └── POST /api/payments/{id}/proof/
│   │
│   ├── getPaymentStatus()
│   │   └── GET /api/payments/{id}/status/
│   │
│   └── cancelPayment()
│       └── POST /api/payments/{id}/cancel/
│
└── Error Handling
    ├── Network errors
    ├── Validation errors
    ├── Auth errors
    └── Server errors
```

### API Methods Specification

| Method | Endpoint | HTTP | Parameters | Returns |
|--------|----------|------|------------|---------|
| initiateBankTransfer | `/api/payments/bank-transfer/initiate/` | POST | orderId, amount | BankTransferResponse |
| uploadPaymentProof | `/api/payments/{id}/proof/` | POST | paymentId, file, notes | UploadResponse |
| getPaymentStatus | `/api/payments/{id}/status/` | GET | paymentId | StatusResponse |
| cancelPayment | `/api/payments/{id}/cancel/` | POST | paymentId | CancelResponse |

### Error Handling Strategy

| Error Type | HTTP Status | User Message | Action |
|------------|-------------|--------------|--------|
| Network Error | N/A | "Connection failed" | Retry option |
| Invalid File | 400 | "File type not supported" | Show requirements |
| File Too Large | 413 | "File exceeds 5MB" | Show size limit |
| Not Found | 404 | "Payment not found" | Navigate back |
| Expired Payment | 400 | "Payment expired" | Create new payment |
| Unauthorized | 401 | "Please log in" | Redirect to login |
| Server Error | 500 | "Try again later" | Contact support |

### Upload Progress Tracking

```
Upload Flow
│
├── Prepare FormData
│   ├── Append file
│   └── Append metadata
│
├── Start Upload
│   ├── Progress: 0%
│   └── Status: uploading
│
├── Track Progress
│   ├── onUploadProgress callback
│   ├── Update progress %
│   └── Update UI
│
└── Complete Upload
    ├── Progress: 100%
    ├── Status: success/error
    └── Update payment status
```

### Expected Outcome
- Fully functional API client for bank transfer operations
- Type-safe method signatures using defined types
- Comprehensive error handling and user feedback
- Upload progress tracking capability
- Clean separation of concerns
- Reusable across multiple components

### Verification Checklist
- [ ] `frontend/lib/payments/bank-transfer/client.ts` created
- [ ] All four main methods implemented
- [ ] Request/response types properly typed
- [ ] Auth token included in requests
- [ ] Error handling for all methods
- [ ] Upload progress tracking configured
- [ ] FormData properly constructed for file upload
- [ ] File validation before upload
- [ ] Client exports correctly
- [ ] Development logging implemented

---

## Task 75: Create useBankTransfer Payment Hook

### Overview
Create a custom React hook that manages bank transfer payment state and operations. This hook provides a clean interface for components to initiate payments, upload proofs, check status, and handle loading/error states without directly managing API calls or complex state logic.

### Dependencies
- Task 74: Create BankTransfer API Client
- React hooks knowledge (useState, useEffect, useCallback)
- React Query or SWR (optional, for caching)

### Instructions

1. **Create hooks file**
   - Navigate to `frontend/lib/payments/bank-transfer/` directory
   - Create `hooks.ts` file
   - Import API client from client.ts
   - Import types from types.ts

2. **Define hook state interface**
   - Define loading states for each operation
   - Define error state for error messages
   - Define payment data state (BankTransferResponse)
   - Define upload progress state
   - Define payment status state

3. **Create useBankTransfer hook**
   - Accept optional configuration object
   - Initialize state variables using useState
   - Return state and methods object

4. **Implement initiate payment method**
   - Accept order ID and amount as parameters
   - Set loading state to true
   - Call API client initiateBankTransfer method
   - Store response in payment data state
   - Clear any existing errors
   - Set loading state to false
   - Handle errors and update error state
   - Return success/failure indication

5. **Implement upload proof method**
   - Accept File and optional notes as parameters
   - Validate file before upload (type, size)
   - Set upload loading state to true
   - Initialize progress state to 0
   - Call API client uploadPaymentProof method
   - Update progress state during upload
   - Update payment status after success
   - Set loading state to false
   - Handle errors appropriately
   - Return success/failure indication

6. **Implement refresh status method**
   - Accept payment ID as parameter
   - Set loading state to true
   - Call API client getPaymentStatus method
   - Update payment status state
   - Set loading state to false
   - Return updated status

7. **Implement cancel payment method**
   - Accept payment ID as parameter
   - Show confirmation dialog
   - Call API client cancelPayment method
   - Clear payment data state
   - Navigate user appropriately

8. **Add auto-refresh functionality (optional)**
   - Use useEffect to set up polling interval
   - Poll status every 30 seconds when payment pending
   - Clear interval when payment verified or expired
   - Stop polling when component unmounts

9. **Add cleanup on unmount**
   - Use useEffect return function
   - Cancel any in-flight requests
   - Clear timers and intervals

### Hook Architecture

```
useBankTransfer Hook
│
├── State
│   ├── isLoading: boolean
│   ├── isUploading: boolean
│   ├── uploadProgress: UploadProgress
│   ├── error: string | null
│   ├── paymentData: BankTransferResponse | null
│   └── paymentStatus: PaymentStatus | null
│
├── Methods
│   ├── initiatePayment(orderId, amount)
│   ├── uploadProof(file, notes)
│   ├── refreshStatus(paymentId)
│   ├── cancelPayment(paymentId)
│   └── clearError()
│
└── Effects
    ├── Auto-refresh polling
    └── Cleanup on unmount
```

### Hook Return Interface

| Property | Type | Description |
|----------|------|-------------|
| isLoading | boolean | General loading state |
| isUploading | boolean | Upload in progress |
| uploadProgress | UploadProgress | Upload progress data |
| error | string \| null | Error message |
| paymentData | BankTransferResponse \| null | Payment details |
| paymentStatus | PaymentStatus \| null | Current status |
| initiatePayment | Function | Start payment |
| uploadProof | Function | Upload proof |
| refreshStatus | Function | Check status |
| cancelPayment | Function | Cancel payment |
| clearError | Function | Clear error |

### State Management Flow

```
Payment Initiation Flow
├── User clicks "Bank Transfer"
├── Component calls initiatePayment()
├── Hook sets isLoading = true
├── API call to initiate endpoint
├── Store response in paymentData
├── Hook sets isLoading = false
└── Component receives paymentData

Upload Flow
├── User selects file
├── Component calls uploadProof()
├── Hook validates file
├── Hook sets isUploading = true
├── Hook sets uploadProgress = 0%
├── API call with progress tracking
├── Hook updates uploadProgress continuously
├── Hook updates paymentStatus on success
├── Hook sets isUploading = false
└── Component receives updated status

Status Refresh Flow
├── Auto-refresh timer triggers OR user clicks refresh
├── Hook calls refreshStatus()
├── API call to status endpoint
├── Hook updates paymentStatus
└── Component re-renders with new status
```

### Error Handling Pattern

| Scenario | Hook Behavior | Component Response |
|----------|---------------|-------------------|
| Network Error | Set error state, clear loading | Show error alert with retry |
| Validation Error | Set error state immediately | Show inline validation |
| Upload Failure | Set error, reset progress | Show error, allow retry |
| Payment Expired | Update status, set error | Redirect to new payment |
| Unauthorized | Set error | Redirect to login |

### File Validation Logic

| Check | Condition | Error Message |
|-------|-----------|---------------|
| File Type | Must be JPG, PNG, or PDF | "Only JPG, PNG, and PDF files are allowed" |
| File Size | Must be ≤ 5MB | "File must be smaller than 5MB" |
| File Exists | File object not null | "Please select a file" |

### Expected Outcome
- Reusable custom hook for bank transfer operations
- Clean state management for all payment stages
- Automatic error handling and user feedback
- Upload progress tracking built-in
- Optional auto-refresh for status updates
- Easy integration into any component

### Verification Checklist
- [ ] `frontend/lib/payments/bank-transfer/hooks.ts` created
- [ ] useBankTransfer hook exported
- [ ] All state variables defined
- [ ] initiatePayment method implemented
- [ ] uploadProof method implemented
- [ ] refreshStatus method implemented
- [ ] cancelPayment method implemented
- [ ] File validation before upload
- [ ] Error handling for all methods
- [ ] Upload progress tracking
- [ ] Optional auto-refresh implemented
- [ ] Cleanup on unmount
- [ ] Hook returns all necessary data and methods

---

## Task 76: Create Bank Details Display Component

### Overview
Create a React component that displays bank account details in a clear, organized, and user-friendly format. The component should present bank name, account number, branch information, payment reference, amount, and expiry countdown, making it easy for customers to complete their bank transfer payment.

### Dependencies
- Task 74: Create BankTransfer API Client
- Task 75: Create useBankTransfer Payment Hook
- UI component library (shadcn/ui or similar)

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/checkout/` directory
   - Create `BankDetailsDisplay.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - Include accounts array (BankAccount[])
   - Include payment reference (string)
   - Include amount (Decimal/number)
   - Include currency (string)
   - Include expires at timestamp (string)
   - Include order ID (string)
   - Include optional instructions text

3. **Design component layout structure**
   - Create main container with card styling
   - Add header section with title and expiry timer
   - Add bank accounts section (may be multiple banks)
   - Add payment details section (amount, reference)
   - Add instructions section
   - Add footer with help text

4. **Implement bank account display**
   - Loop through accounts array
   - Display each bank in separate card or section
   - Show bank name as heading
   - Show account number in large, readable font
   - Show branch name
   - Show SWIFT code if available
   - Use monospace font for account numbers

5. **Display payment reference prominently**
   - Show in highlighted box or badge
   - Use large, copyable text
   - Include copy button (Task 77)
   - Add "Important" label or icon
   - Explain its purpose

6. **Display amount and currency**
   - Show total amount to transfer
   - Format currency appropriately (LKR format)
   - Display prominently above bank details
   - Include currency code (LKR)

7. **Show payment instructions**
   - Display step-by-step instructions
   - Number the steps clearly
   - Include emphasis on reference number
   - Mention expiry time
   - Add warning about exact amount

8. **Add visual hierarchy**
   - Use headings for each section
   - Apply appropriate spacing
   - Use color to highlight important info
   - Add icons for visual appeal
   - Ensure responsive layout

9. **Implement responsive design**
   - Stack sections vertically on mobile
   - Optimize spacing for different screens
   - Ensure text remains readable
   - Test on various device sizes

10. **Add accessibility features**
    - Use semantic HTML elements
    - Add ARIA labels where needed
    - Ensure proper heading hierarchy
    - Maintain sufficient color contrast
    - Support keyboard navigation

### Component Structure

```
┌─────────────────────────────────────────────┐
│  Bank Transfer Payment Details         ⏱️   │
├─────────────────────────────────────────────┤
│  Amount to Transfer                         │
│  Rs. 15,750.00                              │
├─────────────────────────────────────────────┤
│  Important: Payment Reference              │
│  ┌───────────────────────────────────────┐ │
│  │  BT-2026-0123-ABC123        [Copy]    │ │
│  └───────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│  Bank Account Details                       │
│  ┌─────────────────────────────────────┐   │
│  │ Bank of Ceylon - Main Branch        │   │
│  │ Account: 1234567890                 │   │
│  │ Branch: Colombo 01                  │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ Commercial Bank - Central Branch    │   │
│  │ Account: 0987654321                 │   │
│  │ Branch: Kandy                       │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Payment Instructions                       │
│  1. Transfer the exact amount              │
│  2. Use the payment reference              │
│  3. Upload proof within 24 hours           │
│  4. Wait for verification                  │
└─────────────────────────────────────────────┘
```

### Display Sections

| Section | Content | Styling |
|---------|---------|---------|
| Header | Title + Timer | Bold, with countdown |
| Amount | Total to transfer | Large, prominent |
| Reference | Payment reference + copy button | Highlighted box |
| Bank Accounts | All available accounts | Cards or bordered sections |
| Instructions | Step-by-step guide | Numbered list |
| Footer | Help text | Small, muted |

### Bank Account Card Format

| Field | Display Format | Example |
|-------|----------------|---------|
| Bank Name | Bold heading | "Bank of Ceylon" |
| Account Number | Monospace, large | `1234567890` |
| Branch | Normal text | "Main Branch, Colombo 01" |
| SWIFT | Optional, small | "BCEYLKLX" |

### Amount Display Formatting

| Currency | Format | Example |
|----------|--------|---------|
| LKR | Rs. #,###.## | Rs. 15,750.00 |
| USD | $ #,###.## | $250.00 |

### Instructions Template

```
Step-by-step Instructions:
1. Open your bank's mobile app or visit a branch
2. Transfer exactly Rs. [amount] to any of the accounts shown above
3. IMPORTANT: Include the payment reference "[reference]" in your transfer
4. After completing the transfer, upload your payment proof below
5. Your order will be processed once we verify your payment
6. Payment verification usually takes 1-2 hours during business hours
```

### Visual Elements

| Element | Purpose | Implementation |
|---------|---------|----------------|
| Bank Icon | Visual identification | Icon next to bank name |
| Copy Icon | Indicates copyable text | Next to reference |
| Warning Icon | Highlight important info | Next to reference note |
| Timer Icon | Show time remaining | In header with countdown |
| Check Icon | Show completed steps | Future enhancement |

### Expected Outcome
- Clear, professional display of bank transfer details
- Easy-to-read bank account information
- Prominent payment reference with copy functionality
- Step-by-step instructions for users
- Responsive design for all devices
- Accessible to all users

### Verification Checklist
- [ ] `frontend/components/checkout/BankDetailsDisplay.tsx` created
- [ ] Component accepts all required props
- [ ] Amount displayed prominently
- [ ] Payment reference highlighted
- [ ] All bank accounts displayed clearly
- [ ] Account numbers in monospace font
- [ ] Payment instructions included
- [ ] Copy button integrated (Task 77)
- [ ] Countdown timer integrated (Task 78)
- [ ] Responsive on mobile and desktop
- [ ] Semantic HTML used
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 77: Create Copy to Clipboard Button

### Overview
Create a reusable button component that copies text to the clipboard and provides visual feedback to users. This component will be used extensively throughout the bank transfer interface to allow users to easily copy account numbers, payment references, and other important details.

### Dependencies
- Task 76: Create Bank Details Display Component
- Clipboard API browser support
- UI feedback system (toast notifications)

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/ui/` directory
   - Create `CopyButton.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - Include text to copy (string)
   - Include optional button label (string)
   - Include optional success message (string)
   - Include optional button variant/style
   - Include optional button size
   - Include optional onCopy callback

3. **Implement clipboard copy functionality**
   - Use Clipboard API (navigator.clipboard.writeText)
   - Add fallback for older browsers (execCommand)
   - Handle promise resolution for async copy
   - Catch and handle clipboard permission errors

4. **Add visual feedback mechanism**
   - Show "Copied!" message after successful copy
   - Change button icon temporarily (checkmark)
   - Revert to original state after 2-3 seconds
   - Use subtle animation for feedback

5. **Implement button states**
   - Default state: Shows copy icon
   - Hover state: Highlight/darken
   - Clicking state: Brief press animation
   - Success state: Shows checkmark icon
   - Error state: Shows error indication

6. **Handle browser compatibility**
   - Check for Clipboard API support
   - Implement fallback copy method
   - Show appropriate error if copy fails
   - Gracefully degrade on unsupported browsers

7. **Add accessibility features**
   - Include proper ARIA labels
   - Use aria-live for status announcements
   - Ensure keyboard accessibility
   - Add focus indicators

8. **Implement error handling**
   - Detect clipboard permission denied
   - Show user-friendly error message
   - Provide manual copy instructions as fallback
   - Log errors for debugging

9. **Add optional toast notification**
   - Trigger toast on successful copy
   - Show copied text in notification
   - Auto-dismiss after 2 seconds
   - Position appropriately on screen

### Component Architecture

```
CopyButton Component
│
├── Props
│   ├── text: string (to copy)
│   ├── label?: string
│   ├── successMessage?: string
│   ├── onCopy?: callback
│   └── variant?: ButtonVariant
│
├── State
│   ├── isCopied: boolean
│   └── isError: boolean
│
├── Methods
│   ├── handleCopy()
│   ├── copyToClipboard()
│   └── resetState()
│
└── Render
    ├── Button element
    ├── Icon (copy/check)
    └── Label text
```

### Copy Flow Diagram

```
User Action
    │
    ├─→ Click Copy Button
    │       │
    │       ├─→ Check Clipboard API Support
    │       │       │
    │       │       ├─→ Supported
    │       │       │       │
    │       │       │       ├─→ Call navigator.clipboard.writeText()
    │       │       │       │       │
    │       │       │       │       ├─→ Success
    │       │       │       │       │       │
    │       │       │       │       │       ├─→ Set isCopied = true
    │       │       │       │       │       ├─→ Show checkmark icon
    │       │       │       │       │       ├─→ Show "Copied!" message
    │       │       │       │       │       ├─→ Trigger toast notification
    │       │       │       │       │       └─→ Reset after 2 seconds
    │       │       │       │       │
    │       │       │       │       └─→ Error (permission denied)
    │       │       │       │               │
    │       │       │       │               ├─→ Set isError = true
    │       │       │       │               ├─→ Show error message
    │       │       │       │               └─→ Offer manual copy option
    │       │       │       │
    │       │       └─→ Not Supported
    │       │               │
    │       │               └─→ Use Fallback Method (execCommand)
    │       │                       │
    │       │                       └─→ Follow same success/error flow
    │       │
    │       └─→ Call onCopy callback (if provided)
    │
    └─→ Auto-reset state after timeout
```

### Button States & Icons

| State | Icon | Color | Duration |
|-------|------|-------|----------|
| Default | Copy icon | Gray | Persistent |
| Hover | Copy icon | Blue | While hovering |
| Copying | Spinner | Blue | < 1 second |
| Success | Checkmark | Green | 2 seconds |
| Error | X icon | Red | 3 seconds |

### Clipboard API Implementation

| Method | Browser Support | Fallback |
|--------|----------------|----------|
| navigator.clipboard.writeText() | Modern browsers | execCommand('copy') |
| Async/Promise based | Chrome 66+, Firefox 63+ | Synchronous |
| Requires HTTPS | Secure contexts only | Works on HTTP |

### Error Scenarios & Handling

| Error | Cause | User Message | Action |
|-------|-------|--------------|--------|
| Permission Denied | User denied clipboard access | "Clipboard access denied" | Show manual copy |
| API Not Supported | Old browser | "Copy not supported" | Show text to select |
| Copy Failed | Unknown error | "Failed to copy" | Retry button |
| No Text Provided | Developer error | (Silent fail) | Log error |

### Fallback Copy Method

```
Fallback Flow (execCommand)
│
├── Create temporary textarea element
├── Set textarea value to text to copy
├── Append textarea to document body
├── Select textarea content
├── Execute document.execCommand('copy')
├── Check success/failure
├── Remove textarea from DOM
└── Return result
```

### Accessibility Requirements

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| ARIA Label | `aria-label="Copy [text]"` | Screen reader support |
| ARIA Live | `aria-live="polite"` | Announce copy status |
| Keyboard Access | Tab navigation + Enter key | Non-mouse users |
| Focus Indicator | Visible outline on focus | Navigation clarity |
| Status Text | Hidden text for screen readers | Status updates |

### Expected Outcome
- Reusable copy button component for any text
- Smooth visual feedback on copy action
- Browser compatibility with fallback
- Clear success/error indication
- Accessible to all users
- Can be used throughout the application

### Verification Checklist
- [ ] `frontend/components/ui/CopyButton.tsx` created
- [ ] Clipboard API implemented
- [ ] Fallback method for old browsers
- [ ] Visual feedback (icon change) works
- [ ] "Copied!" message displays
- [ ] State resets after timeout
- [ ] Error handling for permission denial
- [ ] Toast notification integration (optional)
- [ ] ARIA labels added
- [ ] Keyboard accessible
- [ ] Works on all supported browsers
- [ ] Component exports properly
- [ ] Can be integrated into BankDetailsDisplay

---

## Task 78: Create Countdown Timer Component

### Overview
Create a countdown timer component that displays the time remaining until a bank transfer payment expires. The timer should update in real-time, show appropriate visual warnings as time runs low, and handle expired states gracefully. This component helps create urgency and prevents users from attempting payments after the expiry time.

### Dependencies
- Task 76: Create Bank Details Display Component
- React hooks (useState, useEffect, useRef)
- Date manipulation utilities

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/ui/` directory
   - Create `CountdownTimer.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - Include expires at timestamp (Date or string)
   - Include optional onExpiry callback
   - Include optional warning threshold (default: 1 hour)
   - Include optional format (HH:MM:SS or descriptive)
   - Include optional size variant

3. **Calculate time remaining**
   - Parse expires at timestamp to Date object
   - Get current time
   - Calculate difference in milliseconds
   - Convert to hours, minutes, and seconds
   - Handle negative values (expired)

4. **Set up interval for updates**
   - Use useEffect to create interval
   - Update every second
   - Clear interval on component unmount
   - Use useRef to maintain stable interval reference

5. **Format time display**
   - Display as HH:MM:SS format
   - Pad single digits with zero (09:05:23)
   - Show days if more than 24 hours remain
   - Show "Expired" message if time passed
   - Option for descriptive format ("9 hours 5 minutes remaining")

6. **Implement visual warning states**
   - Normal state: Blue/neutral color (> warning threshold)
   - Warning state: Orange/yellow (< warning threshold)
   - Critical state: Red (< 30 minutes)
   - Expired state: Red with "Expired" message
   - Add pulsing animation for critical state

7. **Handle expiry callback**
   - Detect when timer reaches zero
   - Call onExpiry callback once
   - Prevent multiple callback calls
   - Update parent component about expiry

8. **Add icon indicators**
   - Clock icon for normal state
   - Warning icon for warning state
   - Alert icon for critical state
   - Expired icon for expired state

9. **Implement responsive sizing**
   - Small variant for compact spaces
   - Medium variant for normal display
   - Large variant for prominent placement
   - Adjust font size and spacing

10. **Add accessibility features**
    - Use aria-live for time updates
    - Announce time remaining to screen readers
    - Provide text alternative for visual warnings
    - Ensure sufficient color contrast

### Component Architecture

```
CountdownTimer Component
│
├── Props
│   ├── expiresAt: Date | string
│   ├── onExpiry?: callback
│   ├── warningThreshold?: number (minutes)
│   ├── format?: 'digital' | 'descriptive'
│   └── size?: 'sm' | 'md' | 'lg'
│
├── State
│   ├── timeRemaining: TimeRemaining
│   ├── isExpired: boolean
│   └── hasExpiredCallbackFired: boolean
│
├── Effects
│   ├── Initialize timer
│   ├── Update every second
│   └── Cleanup on unmount
│
├── Methods
│   ├── calculateTimeRemaining()
│   ├── formatTime()
│   ├── getColorClass()
│   └── handleExpiry()
│
└── Render
    ├── Icon
    ├── Time display
    └── Status text
```

### Time Calculation Flow

```
Timer Update Cycle (Every Second)
│
├── Get current timestamp
├── Get expiry timestamp
├── Calculate difference (ms)
│
├── If difference > 0 (Not expired)
│   │
│   ├── Convert to hours, minutes, seconds
│   ├── Format time string
│   ├── Determine visual state
│   │   ├── > warningThreshold → Normal (blue)
│   │   ├── < warningThreshold → Warning (orange)
│   │   └── < 30 minutes → Critical (red)
│   └── Update display
│
└── If difference ≤ 0 (Expired)
    │
    ├── Set isExpired = true
    ├── Display "Expired" message
    ├── Clear interval
    ├── Call onExpiry callback (once)
    └── Stop updates
```

### Time Display Formats

| Remaining Time | Digital Format | Descriptive Format |
|----------------|----------------|--------------------|
| 25:30:45 | 25:30:45 | 25 hours 30 minutes remaining |
| 05:15:30 | 05:15:30 | 5 hours 15 minutes remaining |
| 00:45:20 | 00:45:20 | 45 minutes remaining |
| 00:05:10 | 00:05:10 | 5 minutes remaining |
| 00:00:30 | 00:00:30 | 30 seconds remaining |
| Expired | Expired | Payment window expired |

### Visual States

| State | Time Remaining | Text Color | Background | Icon | Animation |
|-------|----------------|------------|------------|------|-----------|
| Normal | > 1 hour | Blue | Light blue | Clock | None |
| Warning | 30 min - 1 hour | Orange | Light orange | Warning | None |
| Critical | < 30 minutes | Red | Light red | Alert | Pulse |
| Expired | ≤ 0 | Red | Light red | X | None |

### Color Classes (Tailwind)

| State | Text Class | Background Class | Border Class |
|-------|-----------|------------------|--------------|
| Normal | `text-blue-600` | `bg-blue-50` | `border-blue-200` |
| Warning | `text-orange-600` | `bg-orange-50` | `border-orange-200` |
| Critical | `text-red-600` | `bg-red-50` | `border-red-200` |
| Expired | `text-red-700` | `bg-red-100` | `border-red-300` |

### Component Display Structure

```
┌─────────────────────────────────┐
│  ⏰  Time Remaining             │
│                                 │
│       23:45:30                  │
│                                 │
│  Payment expires in 23 hours   │
└─────────────────────────────────┘

(Warning State - < 1 hour)
┌─────────────────────────────────┐
│  ⚠️  Time Remaining             │
│                                 │
│       00:45:30                  │
│                                 │
│  Only 45 minutes remaining!    │
└─────────────────────────────────┘

(Critical State - < 30 min)
┌─────────────────────────────────┐
│  🔔  Time Running Out!          │
│                                 │
│       00:15:30    (pulsing)    │
│                                 │
│  Complete payment soon!        │
└─────────────────────────────────┘

(Expired)
┌─────────────────────────────────┐
│  ❌  Payment Expired            │
│                                 │
│       Expired                   │
│                                 │
│  Please create a new payment   │
└─────────────────────────────────┘
```

### Interval Management

| Aspect | Implementation | Reason |
|--------|----------------|--------|
| Update Frequency | 1000ms (1 second) | Real-time display |
| useRef for interval ID | Stable reference | Proper cleanup |
| Clear on unmount | useEffect cleanup | Prevent memory leaks |
| Pause when expired | Clear interval | Stop unnecessary updates |

### Accessibility Features

| Feature | Implementation | ARIA Attribute |
|---------|----------------|----------------|
| Time Updates | Polite announcements | `aria-live="polite"` |
| Status Changes | Immediate announcements | `aria-live="assertive"` (critical) |
| Visual Alternative | Text descriptions | `aria-label` |
| Color Meaning | Text supplements color | Status text |

### Expected Outcome
- Real-time countdown timer with second precision
- Visual warning indicators at configurable thresholds
- Automatic expiry detection and callback
- Multiple display format options
- Responsive sizing for different contexts
- Accessible to screen reader users

### Verification Checklist
- [ ] `frontend/components/ui/CountdownTimer.tsx` created
- [ ] Time calculation accurate
- [ ] Updates every second
- [ ] HH:MM:SS format displayed correctly
- [ ] Normal state (blue) works
- [ ] Warning state (orange) triggers at threshold
- [ ] Critical state (red) triggers correctly
- [ ] Pulse animation on critical state
- [ ] Expired state displays correctly
- [ ] onExpiry callback fires once
- [ ] Interval clears on unmount
- [ ] ARIA live region updates
- [ ] Multiple size variants work
- [ ] Component exports properly
- [ ] Integrates into BankDetailsDisplay

---

## Task 79: Create Upload Component with Drag & Drop

### Overview
Create a comprehensive file upload component specifically designed for payment proof submission. The component should support drag-and-drop functionality, manual file selection, file type and size validation, upload progress indication, and file preview. This component is critical for the bank transfer payment flow.

### Dependencies
- Task 74: Create BankTransfer API Client
- Task 75: Create useBankTransfer Payment Hook
- File validation utilities
- UI components (progress bar, alerts)

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/checkout/` directory
   - Create `PaymentProofUpload.tsx` file
   - Set up React functional component structure

2. **Define component props interface**
   - Include payment ID (string)
   - Include on upload complete callback
   - Include on upload error callback
   - Include optional accepted file types array
   - Include optional max file size (default: 5MB)
   - Include optional multiple files flag (default: false)

3. **Set up component state**
   - Selected file state (File | null)
   - Is dragging state (boolean)
   - Upload progress state (number, 0-100)
   - Upload status state (idle, uploading, success, error)
   - Error message state (string | null)
   - File preview URL state (string | null)

4. **Implement drag-and-drop handlers**
   - Handle onDragEnter event
   - Handle onDragOver event (prevent default)
   - Handle onDragLeave event
   - Handle onDrop event
   - Highlight drop zone when dragging
   - Extract files from drop event

5. **Implement file selection**
   - Create hidden file input element
   - Trigger input click on drop zone click
   - Handle onChange event from input
   - Accept JPG, PNG, PDF files
   - Validate selected file immediately

6. **Implement file validation**
   - Check file type against allowed types
   - Validate file size (max 5MB)
   - Check file is not null/undefined
   - Show clear error messages for failures
   - Clear previous errors before new validation

7. **Implement file preview generation**
   - Generate preview for images (JPG, PNG)
   - Use FileReader to read file as data URL
   - Display thumbnail for images
   - Show PDF icon for PDF files
   - Display file name and size

8. **Implement upload functionality**
   - Call useBankTransfer uploadProof method
   - Track upload progress from API client
   - Update progress bar in real-time
   - Handle upload success
   - Handle upload errors
   - Allow cancellation (optional)

9. **Design drop zone UI**
   - Large, visible drop target area
   - Clear instructions text
   - Upload icon or illustration
   - Different styles for default, hover, dragging states
   - Highlight with border color change on drag

10. **Create file preview section**
    - Show selected file details
    - Display file name
    - Display file size (formatted)
    - Show preview image/icon
    - Include remove button to clear selection

11. **Add upload button**
    - Enabled only when file selected and validated
    - Disabled during upload
    - Show loading spinner during upload
    - Show success checkmark after upload
    - Include clear error messages

12. **Implement error handling**
    - Display validation errors inline
    - Show upload errors with retry option
    - Handle network errors gracefully
    - Provide clear, actionable error messages

### Component Architecture

```
PaymentProofUpload Component
│
├── Props
│   ├── paymentId: string
│   ├── onUploadComplete?: callback
│   ├── onUploadError?: callback
│   ├── acceptedTypes?: string[]
│   ├── maxSize?: number
│   └── allowMultiple?: boolean
│
├── State
│   ├── selectedFile: File | null
│   ├── isDragging: boolean
│   ├── uploadProgress: number
│   ├── uploadStatus: UploadStatus
│   ├── error: string | null
│   └── previewUrl: string | null
│
├── Event Handlers
│   ├── handleDragEnter()
│   ├── handleDragOver()
│   ├── handleDragLeave()
│   ├── handleDrop()
│   ├── handleFileSelect()
│   ├── handleRemoveFile()
│   └── handleUpload()
│
├── Validation
│   ├── validateFileType()
│   ├── validateFileSize()
│   └── validateFile()
│
├── Upload
│   ├── generatePreview()
│   ├── uploadFile()
│   └── handleUploadProgress()
│
└── Render
    ├── Drop Zone
    ├── File Preview
    ├── Progress Bar
    ├── Upload Button
    └── Error Message
```

### Upload Flow Diagram

```
File Upload Flow
│
├── User Action
│   ├── Drag & Drop File
│   │   ├── onDragEnter → Highlight zone
│   │   ├── onDragOver → Maintain highlight
│   │   ├── onDrop → Process file
│   │   └── onDragLeave → Remove highlight
│   │
│   └── Click to Select File
│       ├── Trigger file input click
│       ├── User selects file
│       └── onChange → Process file
│
├── File Processing
│   ├── Validate File Type
│   │   ├── Allowed: JPG, PNG, PDF
│   │   └── Not allowed: Show error
│   │
│   ├── Validate File Size
│   │   ├── ≤ 5MB: Continue
│   │   └── > 5MB: Show error
│   │
│   ├── Generate Preview
│   │   ├── Image: Load as data URL
│   │   └── PDF: Show PDF icon
│   │
│   └── Update State
│       ├── Store file
│       └── Display preview
│
├── Upload Initiation
│   ├── User clicks "Upload" button
│   ├── Set uploadStatus = 'uploading'
│   ├── Call API client uploadProof()
│   └── Track progress
│
├── Upload Progress
│   ├── Receive progress updates (0-100%)
│   ├── Update progress bar
│   └── Show percentage text
│
└── Upload Completion
    ├── Success
    │   ├── Set uploadStatus = 'success'
    │   ├── Call onUploadComplete callback
    │   ├── Show success message
    │   └── Clear file selection
    │
    └── Error
        ├── Set uploadStatus = 'error'
        ├── Store error message
        ├── Call onUploadError callback
        ├── Show error message
        └── Allow retry
```

### Drop Zone States

| State | Border Color | Background | Text | Icon |
|-------|--------------|------------|------|------|
| Default | Gray | White | "Drag & drop or click to select" | Upload icon |
| Hover | Blue | Light blue | "Drag & drop or click to select" | Upload icon |
| Dragging | Blue (thick) | Blue tint | "Drop file here" | Upload icon (large) |
| File Selected | Green | Light green | File preview shown | File icon |
| Error | Red | Light red | Error message | Error icon |

### File Validation Rules

| Check | Rule | Error Message |
|-------|------|---------------|
| File Type | Must be JPG, PNG, or PDF | "Only JPG, PNG, and PDF files are allowed" |
| File Size | Must be ≤ 5MB | "File size must not exceed 5MB. Your file is [size]" |
| File Exists | File object not null | "Please select a file" |
| Single File | Only one file allowed | "Please select only one file" |

### File Preview Display

```
┌─────────────────────────────────────┐
│  Selected File                      │
│  ┌─────────────────────────────┐   │
│  │  📄 payment_proof.pdf       │   │
│  │  2.3 MB                     │   │
│  │                        [X]   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

OR (for images)

┌─────────────────────────────────────┐
│  Selected File                      │
│  ┌─────────────────────────────┐   │
│  │  ┌────────┐                 │   │
│  │  │ [IMG]  │ receipt.jpg     │   │
│  │  └────────┘ 1.8 MB          │   │
│  │                        [X]   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Upload Progress Display

```
┌─────────────────────────────────────┐
│  Uploading...                       │
│  ┌─────────────────────────────┐   │
│  │ ████████████░░░░░░░░░░░ 65% │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Allowed File Types

| Type | MIME Type | Extension | Max Size |
|------|-----------|-----------|----------|
| JPEG | image/jpeg | .jpg, .jpeg | 5MB |
| PNG | image/png | .png | 5MB |
| PDF | application/pdf | .pdf | 5MB |

### Error Messages

| Error Type | Message | Action |
|------------|---------|--------|
| Invalid Type | "Only JPG, PNG, and PDF files are allowed" | Show supported types |
| File Too Large | "File must be smaller than 5MB (yours: 7.2MB)" | Suggest compression |
| Upload Failed | "Failed to upload file. Please try again." | Retry button |
| Network Error | "Connection lost. Please check your internet." | Retry button |
| Server Error | "Server error. Please try again later." | Contact support |

### Upload Button States

| State | Appearance | Enabled | Text | Icon |
|-------|------------|---------|------|------|
| No File | Gray, disabled | No | "Select a file first" | - |
| File Selected | Blue, enabled | Yes | "Upload Proof" | Upload icon |
| Uploading | Blue, disabled | No | "Uploading..." | Spinner |
| Success | Green | No | "Uploaded!" | Checkmark |
| Error | Red, enabled | Yes | "Retry Upload" | Retry icon |

### Expected Outcome
- User-friendly upload component with drag-and-drop
- Clear visual feedback for all states
- Robust file validation before upload
- Real-time upload progress indication
- File preview for user confirmation
- Comprehensive error handling with recovery options

### Verification Checklist
- [ ] `frontend/components/checkout/PaymentProofUpload.tsx` created
- [ ] Drag-and-drop functionality works
- [ ] Manual file selection works
- [ ] File type validation (JPG, PNG, PDF only)
- [ ] File size validation (max 5MB)
- [ ] Clear error messages for validation failures
- [ ] Preview generation for images
- [ ] PDF icon displayed for PDF files
- [ ] Upload progress bar shows real-time progress
- [ ] Upload success state shows confirmation
- [ ] Upload error state shows error with retry
- [ ] Remove file button works
- [ ] Component integrates with useBankTransfer hook
- [ ] onUploadComplete callback fires
- [ ] onUploadError callback fires
- [ ] Component is responsive
- [ ] Keyboard accessible
- [ ] ARIA labels added
- [ ] Component exports properly

---

## Summary

This document established the frontend foundation for bank transfer payments, including complete TypeScript type definitions, a robust API client, a powerful custom hook for state management, and essential UI components for displaying bank details, copying information, tracking time, and uploading payment proofs.

### Completed Tasks
1. ✓ Created BankTransfer TypeScript types for type safety
2. ✓ Created BankTransfer API client with all endpoints
3. ✓ Created useBankTransfer hook for state management
4. ✓ Created BankDetailsDisplay component for account info
5. ✓ Created CopyButton component with clipboard functionality
6. ✓ Created CountdownTimer component with expiry warnings
7. ✓ Created PaymentProofUpload component with drag-and-drop

### Next Steps
Proceed to [02_Tasks-80-86_Progress-Testing-Docs.md](02_Tasks-80-86_Progress-Testing-Docs.md) to create upload progress indicators, upload preview functionality, upload success confirmation, pending status page, bank transfer payment button, integration tests, and comprehensive documentation.
