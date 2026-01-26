# Tasks 27-32: Table Columns & API

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** B - Customer Listing & Filters  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-26_Customer-List-Filters.md](01_Tasks-15-26_Customer-List-Filters.md)
- **→ Next Group:** [Group-C_Customer-Profile-360-View](../Group-C_Customer-Profile-360-View/)

---

## Document Overview

This document completes the customer listing page by defining table columns, creating the actions cell with dropdown menu, implementing table sorting, connecting to the customers API, and adding the final touches for a fully functional customer management interface.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Define Customer Table Columns | Medium | 35 min |
| 28 | Create Customer Actions Cell | Low | 20 min |
| 29 | Implement Table Sorting | Medium | 25 min |
| 30 | Connect to Customers API | Medium | 30 min |
| 31 | Add Export Customers | Low | 20 min |
| 32 | Create Index Exports | Low | 15 min |

---

## Task 27: Define Customer Table Columns

### Overview
Define the column configuration for the customers table using TanStack Table's column definition API. This includes all column specifications, data accessors, formatting functions, and sorting configurations.

### Dependencies
- Task 26: Create Customers Table

### Instructions

1. **Create column definitions file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `CustomerTableColumns.tsx`

2. **Import required dependencies**
   - Import ColumnDef from TanStack Table
   - Import Badge, Avatar components
   - Import formatting utilities
   - Import CustomerActionsCell (Task 28)

3. **Define Customer type**
   - Create TypeScript interface for Customer
   - Include all necessary fields
   - Match API response structure

4. **Create Name column**
   - Use accessor: "name"
   - Add avatar with initials
   - Display full name
   - Enable sorting
   - Set width to 200px

5. **Create Phone column**
   - Use accessor: "phone"
   - Format phone number
   - Display with country code
   - Disable sorting
   - Set width to 140px

6. **Create Email column**
   - Use accessor: "email"
   - Display email address
   - Add mailto link
   - Disable sorting
   - Set width to 200px

7. **Create Orders column**
   - Use accessor: "ordersCount"
   - Display as number
   - Enable sorting
   - Center align
   - Set width to 80px

8. **Create Balance column**
   - Use accessor: "balance"
   - Format as LKR currency
   - Color code (red if negative)
   - Enable sorting
   - Set width to 120px

9. **Create Status column**
   - Use accessor: "status"
   - Display as badge
   - Green for active, gray for inactive
   - Enable sorting
   - Set width to 100px

10. **Create Actions column**
    - Use custom cell renderer
    - Render CustomerActionsCell
    - Pass row data
    - Disable sorting
    - Set width to 80px

### Customer Type Interface

```
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'business' | 'wholesale';
  status: 'active' | 'inactive';
  ordersCount: number;
  totalSpent: number;
  balance: number;
  creditLimit: number;
  creditUsed: number;
  lastOrderDate: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Column Definitions Table

| Column ID | Accessor | Header | Sortable | Width | Align |
|-----------|----------|--------|----------|-------|-------|
| name | name | Name | Yes | 200px | Left |
| phone | phone | Phone | No | 140px | Left |
| email | email | Email | No | 200px | Left |
| orders | ordersCount | Orders | Yes | 80px | Center |
| balance | balance | Balance (LKR) | Yes | 120px | Right |
| status | status | Status | Yes | 100px | Center |
| actions | - | Actions | No | 80px | Center |

### Name Column Cell Renderer

```
Cell Structure:
┌─────────────────────┐
│ [JS] John Silva     │
└─────────────────────┘

Components:
├── Avatar (initials or image)
└── Text (customer name)
```

### Balance Column Formatting

| Value | Display | Color |
|-------|---------|-------|
| 125000 | ₨125,000 | Default |
| -5000 | -₨5,000 | Red |
| 0 | ₨0 | Gray |

### Status Badge Styling

| Status | Badge Color | Text |
|--------|-------------|------|
| active | Green | Active |
| inactive | Gray | Inactive |

### Expected Outcome
- Column definitions exported
- All columns configured correctly
- Formatters applied appropriately
- Sorting enabled on correct columns
- Cell renderers functional

### Verification Checklist
- [ ] CustomerTableColumns.tsx file created
- [ ] Customer interface defined
- [ ] All 7 columns defined
- [ ] Formatters work correctly
- [ ] Sorting configuration correct
- [ ] Cell renderers functional

---

## Task 28: Create Customer Actions Cell

### Overview
Create the CustomerActionsCell component that provides a dropdown menu with actions for each customer row. Actions include View Details, Edit, Adjust Credit, and Delete.

### Dependencies
- Task 27: Define Customer Table Columns

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `CustomerActionsCell.tsx`

2. **Import required dependencies**
   - Import DropdownMenu components
   - Import icons (MoreVertical, Eye, Edit, CreditCard, Trash)
   - Import useRouter for navigation
   - Import confirmation dialog

3. **Define component props**
   - customer: Customer object
   - onEdit: callback function
   - onDelete: callback function
   - onAdjustCredit: callback function

4. **Create dropdown trigger**
   - Use IconButton with MoreVertical icon
   - Style as subtle/ghost button
   - Add hover and focus states
   - Ensure accessibility

5. **Create dropdown menu**
   - Add "View Details" option (navigate to /customers/[id])
   - Add "Edit Customer" option (open edit modal)
   - Add "Adjust Credit" option (open credit modal)
   - Add divider
   - Add "Delete Customer" option (with confirmation)

6. **Implement action handlers**
   - View: Navigate to customer details page
   - Edit: Trigger edit modal
   - Adjust Credit: Open credit adjustment modal
   - Delete: Show confirmation dialog then delete

7. **Add confirmation dialog**
   - Confirm delete action
   - Show customer name in message
   - Warn about consequences
   - Provide cancel option

### Actions Menu Structure

```
┌─────────────────────┐
│      [⋮]            │ ← Trigger Button
└─────────────────────┘

Menu Opened:
┌─────────────────────┐
│ 👁 View Details     │
│ ✏ Edit Customer    │
│ 💳 Adjust Credit   │
├─────────────────────┤
│ 🗑 Delete Customer │
└─────────────────────┘
```

### Action Options

| Action | Icon | Handler | Confirmation |
|--------|------|---------|--------------|
| View Details | Eye | Navigate to /customers/[id] | No |
| Edit Customer | Edit | Open edit modal | No |
| Adjust Credit | CreditCard | Open credit modal | No |
| Delete Customer | Trash | Delete API call | Yes |

### Delete Confirmation Dialog

```
┌─────────────────────────────────┐
│  ⚠️  Delete Customer?           │
│                                 │
│  Are you sure you want to       │
│  delete "John Silva"?           │
│                                 │
│  This action cannot be undone.  │
│                                 │
│  [Cancel]  [Delete Customer]    │
└─────────────────────────────────┘
```

### Expected Outcome
- Actions cell displays dropdown menu
- All action options functional
- Navigation works correctly
- Delete confirmation shows
- Proper error handling

### Verification Checklist
- [ ] CustomerActionsCell.tsx file created
- [ ] Dropdown menu renders
- [ ] View action navigates correctly
- [ ] Edit action triggers modal
- [ ] Adjust Credit action works
- [ ] Delete shows confirmation
- [ ] All actions have proper error handling

---

## Task 29: Implement Table Sorting

### Overview
Implement comprehensive sorting functionality for the customers table, including client-side and server-side sorting, sort indicators, and proper state management.

### Dependencies
- Task 27: Define Customer Table Columns
- Task 26: Create Customers Table

### Instructions

1. **Update table hook configuration**
   - Enable sorting in TanStack Table config
   - Configure getSortedRowModel
   - Set up sorting state management
   - Define default sort (by name ascending)

2. **Add sort state management**
   - Use useState for sorting state
   - Structure: `[{id: 'name', desc: false}]`
   - Sync with URL query parameters (optional)
   - Pass to API query

3. **Configure column sorting**
   - Enable sorting on: name, ordersCount, balance, status
   - Disable sorting on: phone, email, actions
   - Define sort functions for each column
   - Handle null/undefined values

4. **Add sort indicators**
   - Show up arrow for ascending sort
   - Show down arrow for descending sort
   - Show both arrows (subtle) when not sorted
   - Highlight active sort column

5. **Implement server-side sorting**
   - Pass sort configuration to API
   - Handle API sort parameter format
   - Update query when sort changes
   - Refetch data with new sort

6. **Add multi-column sorting**
   - Enable shift+click for multi-sort (optional)
   - Show sort priority numbers
   - Handle sort clearing
   - Maintain sort state in URL

### Sorting State Structure

```
Single Column Sort:
[
  { id: 'name', desc: false }
]

Multi-Column Sort:
[
  { id: 'balance', desc: true },
  { id: 'ordersCount', desc: false }
]
```

### Sort Indicators

| State | Icon | Description |
|-------|------|-------------|
| Not sorted | ⇅ (subtle) | Column is sortable |
| Ascending | ↑ | Sorted A-Z, low-high |
| Descending | ↓ | Sorted Z-A, high-low |

### API Sort Parameter Format

```
Query Parameters:
?sortBy=name&sortOrder=asc

or

?sort=name:asc,balance:desc
```

### Sortable Columns Configuration

| Column | Sort Type | Null Handling |
|--------|-----------|---------------|
| Name | String | nullsLast |
| Orders | Number | nullsLast |
| Balance | Number | nullsLast |
| Status | String | nullsLast |

### Expected Outcome
- Table sorting works on sortable columns
- Sort indicators display correctly
- Server-side sorting queries API
- Sort state persists appropriately
- Multi-column sort works (if enabled)

### Verification Checklist
- [ ] Sorting state configured in table
- [ ] Sort indicators display correctly
- [ ] Clicking headers toggles sort
- [ ] API receives sort parameters
- [ ] Data refetches with new sort
- [ ] Null values handled properly

---

## Task 30: Connect to Customers API

### Overview
Connect the customers list page to the backend API using TanStack Query. Implement data fetching with filters, sorting, pagination, and proper loading/error states.

### Dependencies
- Task 29: Implement Table Sorting
- TanStack Query installed and configured

### Instructions

1. **Create API client function**
   - Navigate to `frontend/lib/api/customers.ts`
   - Create directory and file if not exists
   - Define `fetchCustomers` function
   - Accept filters, sorting, pagination parameters

2. **Create TanStack Query hook**
   - Create `useCustomers` custom hook
   - Use useQuery from TanStack Query
   - Configure query key with filters
   - Set up refetch and caching strategies

3. **Define query parameters**
   - search: string (search query)
   - status: string (active/inactive)
   - type: string (individual/business/wholesale)
   - creditStatus: string (credit filter)
   - sortBy: string (column to sort)
   - sortOrder: string (asc/desc)
   - page: number (current page)
   - pageSize: number (items per page)

4. **Make API request**
   - Use axios or fetch
   - Build query string from parameters
   - Set proper headers
   - Handle authentication token
   - Parse response

5. **Handle API response**
   - Extract customers array
   - Extract pagination metadata (total, pages)
   - Extract summary statistics
   - Transform data if needed

6. **Implement error handling**
   - Catch network errors
   - Handle 401 (authentication)
   - Handle 403 (authorization)
   - Handle 500 (server errors)
   - Display error messages

7. **Create customer stats hook**
   - Create `useCustomerStats` hook
   - Fetch summary statistics
   - Use separate query key
   - Cache independently

8. **Update components to use hooks**
   - Use useCustomers in CustomersList
   - Use useCustomerStats in CustomerSummaryCards
   - Pass data to child components
   - Handle loading and error states

### API Endpoint

```
GET /api/v1/customers

Query Parameters:
- search: string
- status: active|inactive
- type: individual|business|wholesale
- creditStatus: no_credit|good|near_limit|over_limit
- sortBy: name|ordersCount|balance|status
- sortOrder: asc|desc
- page: number (1-based)
- pageSize: number (10,25,50,100)
```

### API Response Structure

```
{
  data: [
    {
      id: "cus_abc123",
      name: "John Silva",
      email: "john@example.com",
      phone: "+94771234567",
      type: "individual",
      status: "active",
      ordersCount: 45,
      totalSpent: 1234500,
      balance: 125000,
      creditLimit: 500000,
      creditUsed: 125000,
      lastOrderDate: "2024-01-15T10:30:00Z",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2024-01-20T15:45:00Z"
    },
    // ... more customers
  ],
  meta: {
    total: 450,
    page: 1,
    pageSize: 25,
    totalPages: 18
  }
}
```

### TanStack Query Configuration

```
useQuery Configuration:
├── queryKey: ['customers', filters, sorting, pagination]
├── queryFn: () => fetchCustomers(params)
├── staleTime: 5 minutes
├── cacheTime: 10 minutes
├── refetchOnWindowFocus: true
├── retry: 2
└── enabled: true
```

### Hook Usage Example

```
Usage in CustomersList:
const {
  data: customersData,
  isLoading,
  isError,
  error,
  refetch
} = useCustomers({
  search,
  status,
  type,
  creditStatus,
  sortBy,
  sortOrder,
  page,
  pageSize
});
```

### Expected Outcome
- API client function created
- TanStack Query hooks implemented
- Data fetches with filters and sorting
- Loading states handled
- Error states handled
- Pagination working
- Data updates on filter changes

### Verification Checklist
- [ ] API client function created
- [ ] useCustomers hook implemented
- [ ] useCustomerStats hook created
- [ ] Query keys configured correctly
- [ ] API requests include all parameters
- [ ] Response parsed correctly
- [ ] Loading states display
- [ ] Error states handled
- [ ] Data displays in table
- [ ] Filtering triggers refetch
- [ ] Sorting triggers refetch
- [ ] Pagination triggers refetch

---

## Task 31: Add Export Customers

### Overview
Add export functionality to download the customer list as CSV or Excel file. This allows users to export filtered customer data for external use.

### Dependencies
- Task 30: Connect to Customers API

### Instructions

1. **Add export button to header**
   - Update CustomersHeader component
   - Add "Export" button next to "Add Customer"
   - Add dropdown for format selection (CSV/Excel)
   - Use Download icon

2. **Create export utility**
   - Create `lib/utils/export.ts`
   - Define `exportToCSV` function
   - Define `exportToExcel` function
   - Handle data transformation

3. **Implement CSV export**
   - Convert customer data to CSV format
   - Include all columns
   - Handle special characters
   - Add headers row
   - Trigger download

4. **Implement Excel export**
   - Use library like xlsx
   - Create workbook with customer data
   - Format columns appropriately
   - Add currency formatting for balance
   - Trigger download

5. **Apply current filters to export**
   - Use same filters as table
   - Fetch all matching results (no pagination)
   - Show loading state during export
   - Handle large datasets

6. **Add export confirmation**
   - Show toast notification on success
   - Display count of exported records
   - Handle errors gracefully

### Export Button UI

```
Header with Export:
┌─────────────────────────────────────────────┐
│ Customers          [Export▼] [+ Add Customer]│
└─────────────────────────────────────────────┘

Export Dropdown:
┌──────────────┐
│ Export    ▼ │
├──────────────┤
│ 📄 CSV       │
│ 📊 Excel     │
└──────────────┘
```

### CSV Format

```
Name,Phone,Email,Type,Status,Orders,Total Spent,Balance
"John Silva","+94771234567","john@example.com","Individual","Active",45,"1234500","125000"
"Mary Perera","+94772345678","mary@example.com","Business","Active",32,"980000","98000"
...
```

### Expected Outcome
- Export button added to header
- CSV export functional
- Excel export functional
- Current filters applied to export
- Download triggers correctly
- Success notifications display

### Verification Checklist
- [ ] Export button added to header
- [ ] Format dropdown works
- [ ] CSV export downloads file
- [ ] Excel export downloads file
- [ ] Exported data matches filters
- [ ] File names include timestamp
- [ ] Success notifications show
- [ ] Error handling works

---

## Task 32: Create Index Exports

### Overview
Create index.ts files to organize and simplify imports from the Customers module. This improves code organization and makes imports cleaner throughout the application.

### Dependencies
- All previous tasks completed

### Instructions

1. **Create main module index**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create `index.ts` file
   - Export all customer components
   - Group exports logically

2. **Export list components**
   - Export CustomersList
   - Export CustomersHeader
   - Export CustomerSummaryCards
   - Export individual cards

3. **Export filter components**
   - Export CustomerFilters
   - Export individual filter components

4. **Export table components**
   - Export CustomersTable
   - Export CustomerTableColumns
   - Export CustomerActionsCell

5. **Export types**
   - Export Customer interface
   - Export CustomerFilters interface
   - Export any other shared types

6. **Create CRM module index**
   - Navigate to `frontend/components/modules/crm/`
   - Create or update `index.ts`
   - Re-export from Customers module

### Index File Structure

```
frontend/components/modules/crm/Customers/index.ts

Exports:
├── CustomersList (default)
├── CustomersHeader
├── CustomerSummaryCards
├── TotalCustomersCard
├── ActiveCustomersCard
├── CreditOutstandingCard
├── CustomerFilters
├── CustomersTable
├── CustomerTableColumns
├── CustomerActionsCell
└── types
    ├── Customer
    └── CustomerFiltersState
```

### Usage After Index Export

```
Before:
import CustomersList from '@/components/modules/crm/Customers/CustomersList';
import CustomersHeader from '@/components/modules/crm/Customers/CustomersHeader';
import CustomersTable from '@/components/modules/crm/Customers/CustomersTable';

After:
import { 
  CustomersList, 
  CustomersHeader, 
  CustomersTable 
} from '@/components/modules/crm/Customers';
```

### Expected Outcome
- Index files created
- All components exported
- Types exported
- Imports simplified
- No circular dependencies

### Verification Checklist
- [ ] index.ts created in Customers directory
- [ ] All components exported
- [ ] Types exported
- [ ] No TypeScript errors
- [ ] Imports work from index
- [ ] No circular dependencies

---

## Summary

This document completed the customer listing functionality with table columns, actions, sorting, API integration, and export capabilities. The following were implemented:

### Table Implementation
- CustomerTableColumns - All 7 columns defined with formatters
- CustomerActionsCell - Dropdown menu with actions
- Table sorting - Client and server-side sorting

### API Integration
- fetchCustomers - API client function
- useCustomers - TanStack Query hook
- useCustomerStats - Statistics hook
- Complete filter, sort, and pagination support

### Export Functionality
- Export button with format dropdown
- CSV export implementation
- Excel export implementation
- Filtered data export

### Code Organization
- Index exports for clean imports
- Type definitions exported
- Module structure organized

The customer listing page is now fully functional with all features implemented. Users can view, search, filter, sort, and export customer data efficiently. The next group will implement the customer profile 360 view.
