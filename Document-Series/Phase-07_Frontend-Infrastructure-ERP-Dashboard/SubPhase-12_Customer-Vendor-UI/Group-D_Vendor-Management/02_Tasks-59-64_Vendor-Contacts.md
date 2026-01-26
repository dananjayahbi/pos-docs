# Tasks 59-64: Vendor Tabs, Form & API

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** D - Vendor Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-58_Vendor-List-Profile.md](01_Tasks-49-58_Vendor-List-Profile.md)
- **→ Next Group:** [Group-E_Purchase-Orders](../Group-E_Purchase-Orders/)

---

## Document Overview

This document completes vendor management with tab content (Overview, Products, PO History), new vendor form, validation schema, and API integration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create Vendor Overview Tab | Low | 20 min |
| 60 | Create Vendor Products Tab | Medium | 30 min |
| 61 | Create Vendor PO History Tab | Medium | 30 min |
| 62 | Create New Vendor Page | Medium | 25 min |
| 63 | Create Vendor Form Schema | Medium | 25 min |
| 64 | Create Vendor Contact Fields | Low | 20 min |
| 65 | Create Vendor Terms Fields | Low | 20 min |
| 66 | Connect Vendors to API | Medium | 30 min |

---

## Task 59: Create Vendor Overview Tab

### Overview
Create OverviewTab for vendor displaying company information and payment terms.

### Dependencies
- Task 58: Vendor Tabs created

### Instructions

1. **Create component file**
   - Create `OverviewTab.tsx` in VendorProfile directory

2. **Display company information:**
   - Company name
   - Contact person
   - Phone and email
   - Physical address
   - Website (if available)

3. **Display payment terms:**
   - Payment terms (Net 30, etc.)
   - Currency
   - Lead time
   - Minimum order amount

4. **Create card layout**
   - Two columns: Company Info, Payment Terms
   - Stack on mobile

### Layout

```
┌──────────────────────┬──────────────────────┐
│ Company Information  │ Payment Terms        │
│ Name: ABC Suppliers  │ Terms: Net 30 Days   │
│ Contact: Raj Kumar   │ Currency: LKR        │
│ Phone: 0711234567    │ Lead Time: 14 days   │
│ Email: info@abc.lk   │ Min Order: ₨10,000  │
│ Address: Colombo 10  │                      │
└──────────────────────┴──────────────────────┘
```

### Expected Outcome
- Overview tab displays vendor details
- Information organized in cards

### Verification Checklist
- [ ] OverviewTab.tsx file created
- [ ] Company info displays
- [ ] Payment terms display
- [ ] Responsive layout works

---

## Task 60: Create Vendor Products Tab

### Overview
Create ProductsTab displaying products available from this vendor with pricing.

### Dependencies
- Task 58: Vendor Tabs created

### Instructions

1. **Create component file**
   - Create `ProductsTab.tsx` in VendorProfile directory

2. **Fetch vendor products**
   - Use useVendorProducts(vendorId) hook
   - Include product name, SKU, unit cost, last order date

3. **Create products table:**
   - Product name
   - SKU
   - Unit cost (LKR)
   - Last ordered date
   - Stock status

4. **Add search and filter**
   - Search by product name or SKU
   - Filter by category

### Layout

```
┌─────────────────────────────────────────────┐
│ Products (45)            🔍 Search...       │
├─────────────────────────────────────────────┤
│ Product      SKU      Unit Cost  Last Order│
│ Widget A     WA-001   ₨1,000    Jan 15     │
│ Widget B     WB-002   ₨2,500    Jan 12     │
│ ...                                         │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Products tab displays vendor's products
- Table sortable and searchable

### Verification Checklist
- [ ] ProductsTab.tsx file created
- [ ] Products table renders
- [ ] Data fetches correctly
- [ ] Search and sort work

---

## Task 61: Create Vendor PO History Tab

### Overview
Create POHistoryTab displaying purchase orders from this vendor.

### Dependencies
- Task 58: Vendor Tabs created

### Instructions

1. **Create component file**
   - Create `POHistoryTab.tsx` in VendorProfile directory

2. **Fetch vendor POs**
   - Use useVendorPOs(vendorId) hook
   - Include PO number, date, status, total

3. **Create PO table:**
   - PO number (link to details)
   - Date
   - Items count
   - Total (LKR)
   - Status badge

4. **Add filters**
   - Filter by status
   - Filter by date range

### Layout

```
┌─────────────────────────────────────────────┐
│ Purchase Orders (32)    [Status▼] [Date▼]  │
├─────────────────────────────────────────────┤
│ PO #      Date      Items   Total    Status │
│ PO-001    Jan 15   5       ₨125K  [Received]│
│ PO-002    Jan 10   3       ₨85K   [Partial] │
│ ...                                         │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- PO history tab displays purchase orders
- Filters functional

### Verification Checklist
- [ ] POHistoryTab.tsx file created
- [ ] PO table renders
- [ ] Links navigate correctly
- [ ] Filters work

---

## Task 62: Create New Vendor Page

### Overview
Create new vendor form page at /vendors/new for adding suppliers.

### Dependencies
- Group A (Task 07): New vendor route exists

### Instructions

1. **Create VendorForm component**
   - Create `VendorForm.tsx` in Vendors directory

2. **Structure form sections:**
   - Company Information
   - Contact Details (Task 64)
   - Address
   - Payment Terms (Task 65)

3. **Implement form with React Hook Form**
   - Use validation schema (Task 63)
   - Handle submission
   - Show success message

4. **Add form actions**
   - Cancel button (go back)
   - Save Draft button (optional)
   - Create Vendor button

### Form Layout

```
┌─────────────────────────────────────────────┐
│ ← Back to Vendors                           │
│ Add New Vendor                              │
├─────────────────────────────────────────────┤
│ Company Information                         │
│ [Name field]                                │
│                                             │
│ Contact Details                             │
│ [Contact fields from Task 64]               │
│                                             │
│ Address                                     │
│ [Address fields]                            │
│                                             │
│ Payment Terms                               │
│ [Terms fields from Task 65]                 │
│                                             │
│ [Cancel]              [Create Vendor]       │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- New vendor form displays all fields
- Validation works
- Submission creates vendor

### Verification Checklist
- [ ] VendorForm.tsx file created
- [ ] All sections render
- [ ] Form validation works
- [ ] Submission functional

---

## Task 63: Create Vendor Form Schema

### Overview
Create Zod validation schema for vendor form data.

### Dependencies
- Task 62: New Vendor Page structure

### Instructions

1. **Create schema file**
   - Create `lib/validations/vendor.ts`

2. **Define vendor schema:**
   - name: required, 2-200 characters
   - contactName: required
   - phone: required, Sri Lankan format
   - email: required, valid email
   - address: optional object
   - paymentTerms: optional number (days)
   - leadTime: optional number (days)
   - currency: optional, default LKR
   - minOrderAmount: optional number

3. **Add custom validations**
   - Phone number format
   - Email format
   - Positive numbers for terms and amounts

### Schema Structure

```typescript
vendorSchema = z.object({
  name: z.string().min(2).max(200),
  contactName: z.string().min(2),
  phone: z.string().regex(/^0[0-9]{9}$/),
  email: z.string().email(),
  address: z.object({...}).optional(),
  paymentTerms: z.number().min(0).optional(),
  leadTime: z.number().min(0).optional(),
  currency: z.enum(['LKR', 'USD']),
  minOrderAmount: z.number().min(0).optional()
})
```

### Expected Outcome
- Validation schema exported
- All fields validated correctly

### Verification Checklist
- [ ] vendor.ts schema file created
- [ ] All fields validated
- [ ] Custom validations work
- [ ] Error messages clear

---

## Task 64: Create Vendor Contact Fields

### Overview
Create VendorContactFields component for contact information section of vendor form.

### Dependencies
- Task 63: Vendor schema defined

### Instructions

1. **Create component file**
   - Create `VendorContactFields.tsx`

2. **Create contact fields:**
   - Contact person name (required)
   - Phone number (required, formatted)
   - Email address (required)
   - Website URL (optional)

3. **Add field helpers**
   - Phone format hint: "+94 XX XXX XXXX"
   - Email validation on blur
   - Website URL validation

### Fields Layout

```
Contact Details
┌─────────────────────────────────────┐
│ Contact Person Name *               │
│ [Raj Kumar                        ] │
└─────────────────────────────────────┘

┌─────────────┐  ┌────────────────────┐
│ Phone *     │  │ Email *            │
│ 0711234567  │  │ info@abc.lk        │
└─────────────┘  └────────────────────┘

┌─────────────────────────────────────┐
│ Website                             │
│ https://abcsuppliers.lk             │
└─────────────────────────────────────┘
```

### Expected Outcome
- Contact fields group renders
- Validation works on each field

### Verification Checklist
- [ ] VendorContactFields.tsx file created
- [ ] All fields render
- [ ] Validation works
- [ ] Phone formatting works

---

## Task 65: Create Vendor Terms Fields

### Overview
Create VendorTermsFields component for payment and ordering terms.

### Dependencies
- Task 63: Vendor schema defined

### Instructions

1. **Create component file**
   - Create `VendorTermsFields.tsx`

2. **Create terms fields:**
   - Payment terms (select: Net 15/30/45/60)
   - Currency (select: LKR/USD)
   - Lead time in days (number)
   - Minimum order amount (number in LKR)

3. **Add field helpers**
   - Payment terms tooltip
   - Lead time explanation
   - Currency conversion note (if USD)

### Fields Layout

```
Payment Terms
┌─────────────┐  ┌─────────────┐
│ Terms     ▼ │  │ Currency  ▼ │
│ Net 30 Days │  │ LKR         │
└─────────────┘  └─────────────┘

┌─────────────┐  ┌─────────────┐
│ Lead Time   │  │ Min Order   │
│ 14 days     │  │ ₨10,000    │
└─────────────┘  └─────────────┘
```

### Expected Outcome
- Terms fields render correctly
- Dropdowns populated with options

### Verification Checklist
- [ ] VendorTermsFields.tsx file created
- [ ] All fields render
- [ ] Select options work
- [ ] Number inputs validate

---

## Task 66: Connect Vendors to API

### Overview
Integrate vendor components with backend APIs using TanStack Query hooks.

### Dependencies
- Task 65: All vendor components created

### Instructions

1. **Create API client functions**
   - In `lib/api/vendors.ts`:
     - fetchVendors(params)
     - fetchVendor(id)
     - createVendor(data)
     - updateVendor(id, data)
     - deleteVendor(id)
     - fetchVendorProducts(vendorId)
     - fetchVendorPOs(vendorId)
     - fetchVendorStats()

2. **Create TanStack Query hooks:**
   - useVendors() - List vendors
   - useVendor(id) - Get vendor details
   - useCreateVendor() - Create mutation
   - useUpdateVendor() - Update mutation
   - useDeleteVendor() - Delete mutation
   - useVendorProducts(id) - Get products
   - useVendorPOs(id) - Get purchase orders
   - useVendorStats() - Get statistics

3. **Connect components:**
   - VendorsList → useVendors
   - VendorDetails → useVendor
   - VendorForm → useCreateVendor
   - ProductsTab → useVendorProducts
   - POHistoryTab → useVendorPOs
   - VendorSummaryCards → useVendorStats

4. **Implement caching and invalidation:**
   - Cache vendors list for 5 minutes
   - Invalidate on create/update/delete
   - Optimistic updates for better UX

5. **Handle loading and errors:**
   - Show skeleton loaders
   - Display error messages
   - Provide retry options

### API Endpoints

```
GET    /api/v1/vendors
GET    /api/v1/vendors/:id
POST   /api/v1/vendors
PATCH  /api/v1/vendors/:id
DELETE /api/v1/vendors/:id
GET    /api/v1/vendors/:id/products
GET    /api/v1/vendors/:id/purchase-orders
GET    /api/v1/vendors/stats
```

### Hook Configuration

```
useVendors:
- queryKey: ['vendors', filters, sorting]
- staleTime: 5 minutes
- refetchOnWindowFocus: true

useVendor:
- queryKey: ['vendor', id]
- enabled: !!id
- staleTime: 5 minutes
```

### Expected Outcome
- All API calls functional
- Data fetches and displays correctly
- CRUD operations work
- Loading and error states handled

### Verification Checklist
- [ ] API client functions created
- [ ] All hooks implemented
- [ ] Components connected to hooks
- [ ] Data fetches correctly
- [ ] Create vendor works
- [ ] Update vendor works
- [ ] Delete vendor works
- [ ] Loading states display
- [ ] Error handling works
- [ ] Cache invalidation correct

---

## Summary

This document completed vendor management functionality with tab content, forms, and API integration. The following were implemented:

### Vendor Tabs
- OverviewTab - Company info and terms
- ProductsTab - Products from vendor
- POHistoryTab - Purchase order history

### Vendor Form
- VendorForm - New vendor page
- Vendor Form Schema - Zod validation
- VendorContactFields - Contact information
- VendorTermsFields - Payment and order terms

### API Integration
- fetchVendors, fetchVendor - Retrieve data
- createVendor, updateVendor, deleteVendor - CRUD operations
- fetchVendorProducts, fetchVendorPOs - Related data
- useVendors, useVendor hooks - Data fetching
- useCreateVendor, useUpdateVendor mutations - Data modification

Vendor management is now complete with full CRUD capabilities. The next group will implement purchase order management.
