# Tasks 45-48: Communication & Modals

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** C - Customer Profile & 360 View  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-44_Customer-Profile.md](01_Tasks-33-44_Customer-Profile.md)
- **→ Next Group:** [Group-D_Vendor-Management](../Group-D_Vendor-Management/)

---

## Document Overview

This document completes the customer profile functionality by implementing the add communication entry form, edit customer modal, adjust credit limit modal, and API integration for the customer details page.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create Add Communication Entry | Medium | 30 min |
| 46 | Create Edit Customer Modal | Medium | 35 min |
| 47 | Create Adjust Credit Limit Modal | Medium | 30 min |
| 48 | Connect Customer Details to API | Medium | 30 min |

---

## Task 45: Create Add Communication Entry

### Overview
Create the AddCommunicationForm component allowing users to log customer interactions including phone calls, emails, meetings, and notes with details and optional file attachments.

### Dependencies
- Task 44: Create Communication Timeline

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `AddCommunicationForm.tsx`

2. **Import required dependencies**
   - Import form components (Input, Textarea, Select)
   - Import React Hook Form
   - Import Zod for validation
   - Import file upload component
   - Import date/time picker

3. **Define validation schema**
   - type: required (phone, email, meeting, note)
   - subject: required, max 200 characters
   - notes: optional, max 1000 characters
   - date: required, not in future
   - time: optional
   - attachments: optional, max 5 files, 10MB total

4. **Create form fields**
   - Type selector (dropdown)
   - Subject input
   - Date picker
   - Time picker
   - Notes textarea
   - File upload area

5. **Implement form submission**
   - Validate all fields
   - Handle file uploads
   - Submit to API
   - Show success message
   - Clear form or close modal
   - Refresh timeline

6. **Add form as modal or inline**
   - Can be modal dialog or expandable section
   - Provide cancel option
   - Show loading state during submission
   - Handle errors gracefully

### Form Layout

```
┌─────────────────────────────────────────────┐
│ Add Communication Entry                     │
├─────────────────────────────────────────────┤
│                                             │
│ Type *                                      │
│ ┌─────────────────────────┐                │
│ │ Phone Call            ▼ │                │
│ └─────────────────────────┘                │
│                                             │
│ Subject *                                   │
│ ┌─────────────────────────────────────┐    │
│ │ Discussed order status              │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Date & Time *                               │
│ ┌──────────────┐  ┌──────────┐             │
│ │ Jan 26, 2024 │  │ 10:30 AM │             │
│ └──────────────┘  └──────────┘             │
│                                             │
│ Notes                                       │
│ ┌─────────────────────────────────────┐    │
│ │ Customer called regarding order     │    │
│ │ delay. Explained shipping situation.│    │
│ │                                     │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Attachments (Optional)                      │
│ ┌─────────────────────────────────────┐    │
│ │ Drag files here or click to upload │    │
│ │ 📎 meeting-notes.pdf (245 KB)       │    │
│ └─────────────────────────────────────┘    │
│                                             │
│             [Cancel]    [Add Entry]         │
└─────────────────────────────────────────────┘
```

### Communication Type Options

| Type | Icon | Use Case |
|------|------|----------|
| Phone Call | Phone | Customer phone conversations |
| Email | Mail | Email correspondence |
| Meeting | Users | Face-to-face or video meetings |
| Note | FileText | Internal notes or reminders |

### Form Validation

| Field | Validation | Error Message |
|-------|------------|---------------|
| Type | Required | Select communication type |
| Subject | Required, max 200 | Subject is required |
| Date | Required, not future | Valid date required |
| Notes | Optional, max 1000 | Notes too long |
| Files | Max 5, 10MB total | Too many files or too large |

### File Upload Constraints

| Constraint | Value |
|------------|-------|
| Max Files | 5 |
| Max Size per File | 5 MB |
| Max Total Size | 10 MB |
| Allowed Types | PDF, DOC, DOCX, JPG, PNG |

### Expected Outcome
- Form allows adding communication entries
- All fields validate correctly
- File upload works
- Submission adds to timeline
- Success message displays

### Verification Checklist
- [ ] AddCommunicationForm.tsx file created
- [ ] Form renders all fields
- [ ] Type selector works
- [ ] Date/time pickers functional
- [ ] File upload works
- [ ] Form validation active
- [ ] Submission works
- [ ] Timeline refreshes after add
- [ ] Error handling works

---

## Task 46: Create Edit Customer Modal

### Overview
Create the EditCustomerModal component allowing users to update customer information including name, contact details, address, type, and credit terms.

### Dependencies
- Task 33: Customer profile structure exists

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `EditCustomerModal.tsx`

2. **Import required dependencies**
   - Import Dialog/Modal components
   - Import form components
   - Import React Hook Form
   - Import Zod validation
   - Import customer update API

3. **Define component props**
   - customer: Customer object
   - isOpen: boolean
   - onClose: callback
   - onSuccess: callback

4. **Create validation schema**
   - name: required, 2-200 characters
   - phone: required, Sri Lankan format
   - email: optional, valid email
   - address: optional
   - type: required (individual/business/wholesale)
   - creditLimit: optional, >= 0
   - paymentTerms: optional

5. **Create form structure**
   - Basic Information section
     - Name input
     - Type selector
   - Contact Details section
     - Phone input
     - Email input
   - Address section
     - Street address
     - City, postal code
   - Credit Terms section
     - Credit limit
     - Payment terms

6. **Pre-fill form with current data**
   - Load customer data into form
   - Use React Hook Form's defaultValues
   - Allow clearing optional fields

7. **Implement form submission**
   - Validate all fields
   - Call update API
   - Handle loading state
   - Show success message
   - Close modal on success
   - Refresh customer data

8. **Add confirmation for major changes**
   - Warn if credit limit decreased
   - Confirm if changing to inactive
   - Show impact message

### Modal Layout

```
┌─────────────────────────────────────────────┐
│ Edit Customer                         [✕]   │
├─────────────────────────────────────────────┤
│                                             │
│ Basic Information                           │
│ ┌─────────────────────────────────────┐    │
│ │ Customer Name *                     │    │
│ │ John Silva                          │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ ┌──────────────────┐                        │
│ │ Type: Individual▼│                        │
│ └──────────────────┘                        │
│                                             │
│ Contact Details                             │
│ ┌─────────────┐  ┌────────────────────┐    │
│ │ Phone *     │  │ Email              │    │
│ │ 0771234567  │  │ john@example.com   │    │
│ └─────────────┘  └────────────────────┘    │
│                                             │
│ Address                                     │
│ ┌─────────────────────────────────────┐    │
│ │ Street Address                      │    │
│ │ 123 Main Street                     │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ ┌──────────────┐  ┌────────────┐           │
│ │ City         │  │ Postal Code│           │
│ │ Colombo 10   │  │ 01000      │           │
│ └──────────────┘  └────────────┘           │
│                                             │
│ Credit Terms                                │
│ ┌─────────────┐  ┌─────────────┐           │
│ │ Credit Limit│  │ Terms       │           │
│ │ 500000      │  │ Net 30    ▼ │           │
│ └─────────────┘  └─────────────┘           │
│                                             │
│              [Cancel]    [Save Changes]     │
└─────────────────────────────────────────────┘
```

### Form Sections

| Section | Fields | Required |
|---------|--------|----------|
| Basic Info | Name, Type | Name required |
| Contact | Phone, Email | Phone required |
| Address | Street, City, Postal | Optional |
| Credit | Limit, Terms | Optional |

### Payment Terms Options

| Option | Value | Description |
|--------|-------|-------------|
| Due on Receipt | 0 | Immediate payment |
| Net 15 | 15 | Payment due in 15 days |
| Net 30 | 30 | Payment due in 30 days |
| Net 45 | 45 | Payment due in 45 days |
| Net 60 | 60 | Payment due in 60 days |

### Expected Outcome
- Modal opens with current customer data
- All fields editable
- Validation works
- Save updates customer
- Success message displays
- Modal closes after save

### Verification Checklist
- [ ] EditCustomerModal.tsx file created
- [ ] Modal opens and closes
- [ ] Form pre-filled with data
- [ ] All fields editable
- [ ] Validation works
- [ ] Save button updates customer
- [ ] API call succeeds
- [ ] Success message shows
- [ ] Data refreshes after save
- [ ] Error handling works

---

## Task 47: Create Adjust Credit Limit Modal

### Overview
Create the AdjustCreditModal component specifically for adjusting a customer's credit limit with approval workflow and reason tracking.

### Dependencies
- Task 38: Credit Information Card exists

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/CustomerProfile/` directory
   - Create new file `AdjustCreditModal.tsx`

2. **Import required dependencies**
   - Import Dialog/Modal components
   - Import form components
   - Import React Hook Form and Zod
   - Import currency input

3. **Define component props**
   - customer: Customer object
   - isOpen: boolean
   - onClose: callback
   - onSuccess: callback

4. **Create validation schema**
   - newLimit: required, >= 0
   - reason: required if increasing above threshold
   - notes: optional, max 500 characters

5. **Create form structure**
   - Current limit display (read-only)
   - New limit input (LKR)
   - Change amount display (calculated)
   - Reason selector (if needed)
   - Notes textarea
   - Approval checkbox (for managers)

6. **Calculate and display changes**
   - Show current limit
   - Show new limit input
   - Calculate difference (increase/decrease)
   - Show percentage change
   - Highlight if significant change

7. **Implement approval logic**
   - Increases < 50%: Auto-approve
   - Increases 50-100%: Manager approval
   - Increases > 100%: Director approval
   - Decreases: Always allowed
   - Show required approval level

8. **Add reason options**
   - Business growth
   - Good payment history
   - Large order request
   - Risk reduction
   - Other (with notes)

9. **Implement submission**
   - Validate form
   - Submit to API
   - Show success message
   - Refresh credit info
   - Close modal

### Modal Layout

```
┌─────────────────────────────────────────────┐
│ Adjust Credit Limit                   [✕]   │
├─────────────────────────────────────────────┤
│                                             │
│ Current Credit Limit                        │
│ ₨500,000                                   │
│                                             │
│ New Credit Limit *                          │
│ ┌─────────────────────────┐                │
│ │ ₨                       │                │
│ │   750,000              │                │
│ └─────────────────────────┘                │
│                                             │
│ Change: +₨250,000 (+50%)                   │
│ ⚠️ Requires manager approval               │
│                                             │
│ Reason for Change *                         │
│ ┌─────────────────────────────────────┐    │
│ │ Business growth                   ▼ │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Additional Notes                            │
│ ┌─────────────────────────────────────┐    │
│ │ Customer expanding operations...    │    │
│ │                                     │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ ☐ I approve this credit limit change       │
│   (Manager approval required)               │
│                                             │
│              [Cancel]    [Adjust Limit]     │
└─────────────────────────────────────────────┘
```

### Approval Thresholds

| Change | Threshold | Approval Required |
|--------|-----------|-------------------|
| Decrease | Any | None (auto-approve) |
| Increase | < 50% | None (auto-approve) |
| Increase | 50-100% | Manager |
| Increase | > 100% | Director |

### Change Indicators

```
Change Display Examples:

Increase:
+₨250,000 (+50%)  [Yellow/Warning]
Requires manager approval

Large Increase:
+₨600,000 (+120%)  [Red/Danger]
Requires director approval

Decrease:
-₨100,000 (-20%)  [Blue/Info]
Auto-approved
```

### Reason Options

| Reason | When to Use |
|--------|-------------|
| Business Growth | Customer expanding |
| Good Payment History | Consistent on-time payments |
| Large Order Request | Special order needs |
| Risk Reduction | Decreasing exposure |
| Credit Review | Periodic review |
| Other | Custom reason (notes required) |

### Expected Outcome
- Modal opens with current limit
- New limit input functional
- Change calculation shows
- Approval requirements display
- Reason selection works
- Submission updates limit

### Verification Checklist
- [ ] AdjustCreditModal.tsx file created
- [ ] Modal opens and closes
- [ ] Current limit displays
- [ ] New limit input works
- [ ] Change calculation correct
- [ ] Approval levels show correctly
- [ ] Reason selector works
- [ ] Notes field functional
- [ ] Submission updates credit limit
- [ ] Success message shows
- [ ] Credit info refreshes
- [ ] Error handling works

---

## Task 48: Connect Customer Details to API

### Overview
Integrate the customer details page with backend APIs using TanStack Query hooks. Fetch customer data, handle updates, and manage all CRUD operations for customer profile.

### Dependencies
- Task 47: All customer profile components created

### Instructions

1. **Create API client functions**
   - Navigate to `frontend/lib/api/customers.ts`
   - Add or update functions:
     - `fetchCustomer(id)`
     - `updateCustomer(id, data)`
     - `deleteCustomer(id)`
     - `adjustCreditLimit(id, data)`
     - `addCommunication(customerId, data)`
     - `fetchCustomerOrders(customerId, params)`
     - `fetchCustomerInvoices(customerId, params)`
     - `fetchCommunications(customerId, params)`

2. **Create TanStack Query hooks**
   - Create `useCustomer(id)` hook
   - Create `useUpdateCustomer()` mutation hook
   - Create `useDeleteCustomer()` mutation hook
   - Create `useAdjustCredit()` mutation hook
   - Create `useAddCommunication()` mutation hook
   - Create `useCustomerOrders(customerId)` hook
   - Create `useCustomerInvoices(customerId)` hook
   - Create `useCommunications(customerId)` hook

3. **Implement useCustomer hook**
   - Query key: `['customer', id]`
   - Fetch function: fetchCustomer
   - Enable when id is valid
   - Handle loading and error states
   - Cache for 5 minutes
   - Refetch on window focus

4. **Implement mutation hooks**
   - useUpdateCustomer:
     - Optimistic updates
     - Invalidate customer query
     - Show success toast
   - useDeleteCustomer:
     - Confirmation required
     - Navigate after deletion
     - Show success message
   - useAdjustCredit:
     - Invalidate customer query
     - Update credit info cache
     - Show success toast
   - useAddCommunication:
     - Invalidate communications query
     - Add to timeline immediately
     - Show success message

5. **Connect components to hooks**
   - CustomerDetails: Use useCustomer
   - EditCustomerModal: Use useUpdateCustomer
   - AdjustCreditModal: Use useAdjustCredit
   - AddCommunicationForm: Use useAddCommunication
   - OrdersTab: Use useCustomerOrders
   - InvoicesTab: Use useCustomerInvoices
   - CommunicationTimeline: Use useCommunications

6. **Handle loading states**
   - Show skeleton loaders in CustomerDetails
   - Show spinners in modals during submission
   - Disable buttons during loading
   - Show loading overlay for delete

7. **Handle error states**
   - Show error messages for failed fetches
   - Display validation errors in forms
   - Handle 404 (customer not found)
   - Handle 403 (unauthorized)
   - Show retry options

8. **Implement optimistic updates**
   - Update cache immediately on edit
   - Show provisional data while saving
   - Revert on error
   - Smooth user experience

### API Endpoints

```
Customer Details:
GET    /api/v1/customers/:id

Customer Update:
PATCH  /api/v1/customers/:id
Body: { name, phone, email, address, type, creditLimit }

Customer Delete:
DELETE /api/v1/customers/:id

Adjust Credit:
POST   /api/v1/customers/:id/adjust-credit
Body: { newLimit, reason, notes }

Add Communication:
POST   /api/v1/customers/:id/communications
Body: { type, subject, date, notes, attachments }

Customer Orders:
GET    /api/v1/customers/:id/orders
Query: page, pageSize, status, sortBy

Customer Invoices:
GET    /api/v1/customers/:id/invoices
Query: page, pageSize, status, sortBy

Communications:
GET    /api/v1/customers/:id/communications
Query: page, pageSize, type, sortBy
```

### Hook Usage Examples

```
In CustomerDetails component:
const { 
  data: customer, 
  isLoading, 
  isError, 
  error 
} = useCustomer(customerId);

In EditCustomerModal:
const updateCustomer = useUpdateCustomer();
const handleSubmit = (data) => {
  updateCustomer.mutate({ id: customer.id, data });
};

In AdjustCreditModal:
const adjustCredit = useAdjustCredit();
const handleAdjust = (data) => {
  adjustCredit.mutate({ 
    customerId: customer.id, 
    newLimit: data.newLimit, 
    reason: data.reason 
  });
};
```

### Query Configuration

```
useCustomer Configuration:
├── queryKey: ['customer', id]
├── queryFn: () => fetchCustomer(id)
├── staleTime: 5 minutes
├── cacheTime: 10 minutes
├── refetchOnWindowFocus: true
├── retry: 2
└── enabled: !!id

useUpdateCustomer Configuration:
├── mutationFn: ({ id, data }) => updateCustomer(id, data)
├── onMutate: (optimistic update)
├── onSuccess: (invalidate queries, show toast)
├── onError: (revert, show error)
└── onSettled: (cleanup)
```

### Expected Outcome
- All API calls functional
- Data fetches on page load
- Updates work correctly
- Loading states display
- Error handling works
- Optimistic updates smooth
- Success messages show

### Verification Checklist
- [ ] API client functions created
- [ ] useCustomer hook implemented
- [ ] useUpdateCustomer hook created
- [ ] useDeleteCustomer hook created
- [ ] useAdjustCredit hook created
- [ ] useAddCommunication hook created
- [ ] useCustomerOrders hook created
- [ ] useCustomerInvoices hook created
- [ ] useCommunications hook created
- [ ] All components connected to hooks
- [ ] Data fetches correctly
- [ ] Updates work
- [ ] Delete works
- [ ] Credit adjustment works
- [ ] Communication add works
- [ ] Loading states display
- [ ] Error states handled
- [ ] Optimistic updates work
- [ ] Cache invalidation correct
- [ ] Success toasts show

---

## Summary

This document completed the customer profile functionality with communication features, modals, and API integration. The following were implemented:

### Communication Features
- AddCommunicationForm - Log customer interactions
- File upload support
- Timeline integration

### Modals
- EditCustomerModal - Update customer information
- AdjustCreditModal - Modify credit limits with approval workflow

### API Integration
- useCustomer - Fetch customer details
- useUpdateCustomer - Update customer
- useDeleteCustomer - Delete customer
- useAdjustCredit - Adjust credit limit
- useAddCommunication - Log interactions
- useCustomerOrders - Fetch order history
- useCustomerInvoices - Fetch invoices
- useCommunications - Fetch communications

### Features Completed
- Complete customer 360 view
- All CRUD operations
- Communication logging
- Credit management
- Order and invoice history
- Loading and error states
- Optimistic updates

The customer management module is now fully functional. The next group will implement vendor management functionality.
