# Group D: Vendor Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** D of F  
> **Tasks Covered:** 49-66  
> **Group Goal:** Build vendor listing, profile, and creation form

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Customer-Profile-360-View](../Group-C_Customer-Profile-360-View/)
- **→ Next Group:** [Group-E_Purchase-Orders](../Group-E_Purchase-Orders/)

---

## Group Overview

This group creates the complete vendor management functionality. Creates vendors list page with header and add vendor action. Builds summary cards for total and active vendors. Creates filter toolbar with search and filters. Creates vendors table with columns for name, contact, products, PO count, and status. Adds vendor actions cell. Creates vendor details page with header section. Adds vendor tabs: Overview (company info, terms), Products (from vendor), and PO History. Creates new vendor page with form. Creates Zod schema for vendor. Builds contact fields and payment terms fields. Connects to vendors API.

### Key Outcomes

- Vendors list page component
- Vendors header with action
- Vendor summary cards
- Vendor filters toolbar
- Vendors table
- Table columns defined
- Vendor actions cell
- Vendor details page
- Vendor header section
- Vendor tabs
- Vendor overview tab
- Vendor products tab
- Vendor PO history tab
- New vendor page
- Vendor form schema
- Vendor contact fields
- Vendor terms fields
- Connected to vendors API

### Technology Context

- **Data Table:** TanStack Table
- **Tabs:** Radix UI tabs
- **Form:** React Hook Form + Zod
- **State:** TanStack Query useVendors

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-49-58_List-Details.md` | Create vendor list and details | 49-58 |
| 02 | `02_Tasks-59-66_Tabs-Form-API.md` | Create tabs, form, and API connection | 59-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 49 | Create Vendors List Page | Low | Task 14 |
| 50 | Create Vendors Header | Low | Task 49 |
| 51 | Create Vendor Summary Cards | Medium | Task 49 |
| 52 | Create Vendor Filters | Low | Task 49 |
| 53 | Create Vendors Table | Medium | Task 49 |
| 54 | Define Vendor Table Columns | Medium | Task 53 |
| 55 | Create Vendor Actions Cell | Low | Task 54 |
| 56 | Create Vendor Details Page | Medium | Task 14 |
| 57 | Create Vendor Header Section | Low | Task 56 |
| 58 | Create Vendor Tabs | Low | Task 56 |
| 59 | Create Vendor Overview Tab | Low | Task 58 |
| 60 | Create Vendor Products Tab | Medium | Task 58 |
| 61 | Create Vendor PO History Tab | Medium | Task 58 |
| 62 | Create New Vendor Page | Medium | Task 14 |
| 63 | Create Vendor Form Schema | Medium | Task 62 |
| 64 | Create Vendor Contact Fields | Low | Task 63 |
| 65 | Create Vendor Terms Fields | Low | Task 63 |
| 66 | Connect Vendors to API | Medium | Task 65 |

---

## Execution Order

```
Task 49: Vendors List Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 50: Vendors Header                                │
    │                                                  │
    ▼                                                  │
Task 51: Summary Cards                                 │
    │                                                  │
    ▼                                                  │
Task 52: Vendor Filters                                │
    │                                                  │
    ▼                                                  │
Task 53: Vendors Table                                 │
    │                                                  │
    ▼                                                  │
Task 54: Table Columns                                 │
    │                                                  │
    ▼                                                  │
Task 55: Actions Cell                                  │
    │                                                  │
    └──────────────────────────────────────────────────┘
               │
               ▼
         Task 56: Vendor Details Page
               │
               ▼
         Task 57: Vendor Header
               │
               ▼
         Task 58: Vendor Tabs
               │
         ┌─────┼─────┬─────┐
         ▼     ▼     ▼     │
      Task 59 Task 60 Task 61
      (Overview)(Products)(History)
         │     │     │     │
         └─────┴─────┴─────┘
               │
               ▼
         Task 62: New Vendor Page
               │
               ▼
         Task 63: Form Schema
               │
         ┌─────┴─────┐
         ▼           ▼
      Task 64    Task 65
      (Contact)  (Terms)
         │           │
         └─────┬─────┘
               ▼
         Task 66: API
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── vendors/
│           ├── page.tsx
│           ├── new/
│           │   └── page.tsx
│           └── [id]/
│               └── page.tsx
├── components/
│   └── modules/
│       └── crm/
│           └── Vendors/
│               ├── VendorsList.tsx
│               ├── VendorsHeader.tsx
│               ├── VendorSummaryCards.tsx
│               ├── VendorFilters.tsx
│               ├── VendorsTable.tsx
│               ├── VendorTableColumns.tsx
│               ├── VendorActionsCell.tsx
│               ├── VendorProfile/
│               │   ├── VendorDetails.tsx
│               │   ├── VendorHeader.tsx
│               │   ├── VendorTabs.tsx
│               │   ├── OverviewTab.tsx
│               │   ├── ProductsTab.tsx
│               │   ├── POHistoryTab.tsx
│               │   └── index.ts
│               ├── VendorForm.tsx
│               ├── VendorContactFields.tsx
│               ├── VendorTermsFields.tsx
│               └── index.ts
└── lib/
    └── validations/
        └── vendor.ts
```

---

## Notes for AI Agents

### Vendor Summary Cards (Task 51)
| Card | Icon | Value |
|------|------|-------|
| Total Vendors | Building2 | Count of all vendors |
| Active | CheckCircle | Count with active status |

### Vendor Filters (Task 52)
| Filter | Type |
|--------|------|
| Search | Text (name, contact) |
| Status | Select (active/inactive) |
| Category | Select |

### Vendor Table Columns (Task 54)
| Column | Width | Sortable |
|--------|-------|----------|
| Name | 200px | Yes |
| Contact | 140px | No |
| Products | 80px | Yes |
| POs | 80px | Yes |
| Status | 100px | Yes |
| Actions | 80px | No |

### Vendor Actions (Task 55)
| Action | Icon | Description |
|--------|------|-------------|
| View | Eye | Open profile |
| Edit | Pencil | Edit vendor |
| Delete | Trash | Delete (if no POs) |

### Vendor Tabs (Task 58)
| Tab | Content |
|-----|---------|
| Overview | Company info, terms |
| Products | Products from vendor |
| PO History | Purchase orders |

### Vendor Overview (Task 59)
| Section | Content |
|---------|---------|
| Company Info | Name, address, contact |
| Payment Terms | Net days, currency |
| Lead Time | Default lead time |

### Vendor Form Schema (Task 63)
| Field | Type | Validation |
|-------|------|------------|
| name | string | Required, 2-200 chars |
| contact_name | string | Required |
| phone | string | Sri Lankan format |
| email | string | Valid email |
| address | object | Optional |
| payment_terms | number | Days (Net 30, etc.) |
| lead_time | number | Days |

### Contact Fields (Task 64)
| Field | Type |
|-------|------|
| Contact Name | Text |
| Phone | Phone input |
| Email | Email input |
| Website | URL input |

### Terms Fields (Task 65)
| Field | Type |
|-------|------|
| Payment Terms | Select (Net 15/30/60) |
| Currency | Select (LKR default) |
| Lead Time | Number (days) |
| Min Order | Number (LKR) |
