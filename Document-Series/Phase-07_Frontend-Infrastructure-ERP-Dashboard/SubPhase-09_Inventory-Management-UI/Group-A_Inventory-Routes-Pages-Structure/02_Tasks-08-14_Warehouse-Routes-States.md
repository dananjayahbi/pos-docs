# Tasks 08-14: Warehouse Routes & Loading States

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** A - Inventory Routes & Pages Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_Inventory-Routes.md](01_Tasks-01-07_Inventory-Routes.md)

---

## Document Overview

This document completes the inventory route structure by adding warehouse management routes, configuring SEO metadata for all pages, and implementing loading states. It covers the creation of warehouse list, new warehouse, and edit warehouse pages, along with proper metadata and loading UI for better user experience.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 08 | Create New Transfer Page Route | Low | 20 min |
| 09 | Create Warehouses Page Route | Low | 20 min |
| 10 | Create New Warehouse Page Route | Low | 20 min |
| 11 | Create Edit Warehouse Page Route | Low | 20 min |
| 12 | Configure Page Metadata | Low | 15 min |
| 13 | Create Inventory Loading States | Low | 25 min |
| 14 | Verify Route Structure | Low | 15 min |

---

## Task 08: Create New Transfer Page Route

### Overview
Create page for initiating new warehouse transfers. Multi-product transfer form with source and destination warehouse selection.

### Dependencies
- Task 07: Create Transfers Page Route

### Instructions

1. **Create new directory:** In transfers folder, create `new/` folder
2. **Create page file:** In new directory, create `page.tsx`
3. **Define metadata:** Title "New Warehouse Transfer - LCC"
4. **Add form header:** Title "New Transfer" with Cancel/Submit buttons
5. **Add warehouse selectors:** Source and destination warehouse dropdowns
6. **Add products section:** Multi-row form to select products and quantities
7. **Add transfer details:** Expected date, notes, priority
8. **Implement validation:** Ensure source ≠ destination, quantities available

### Form Fields

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| From Warehouse | Select | Must exist | Yes |
| To Warehouse | Select | ≠ From | Yes |
| Products | Multi-select | Stock available | Yes |
| Quantities | Number | > 0, ≤ Available | Yes |
| Expected Date | Date | Future date | No |
| Priority | Select | High/Normal/Low | No |
| Notes | Textarea | Max 500 chars | No |

### Form Structure
```
┌──────────────────────────────────────────┐
│  New Warehouse Transfer [Cancel] [Submit]│
├──────────────────────────────────────────┤
│  From: [Main Warehouse ▼]               │
│  To: [Branch 1 ▼]                        │
├──────────────────────────────────────────┤
│  Products to Transfer:                   │
│  ┌────────────────────────────────────┐  │
│  │ Product | Available | Transfer    │  │
│  │ [Select] | 100      | 20          │  │
│  │ [Add Product]                      │  │
│  └────────────────────────────────────┘  │
│  Expected Date: [Select date]            │
│  Priority: [Normal ▼]                    │
│  Notes: [Optional notes...]             │
└──────────────────────────────────────────┘
```

### Validation Rules
- Source and destination must be different
- Product quantities must not exceed available stock
- At least one product must be selected
- Transfer quantities must be positive numbers

### Expected Outcome
- New transfer form at /inventory/transfers/new
- Real-time stock availability checking
- Form validation preventing invalid transfers

### Verification
- [ ] Form renders at correct route
- [ ] Warehouse validation works
- [ ] Stock availability displays correctly

---

## Task 09: Create Warehouses Page Route

### Overview
Create page displaying all warehouses in a card grid layout. Shows warehouse details with quick actions for editing.

### Dependencies
- Task 02: Create Inventory Layout

### Instructions

1. **Create warehouses directory:** In `frontend/app/(dashboard)/inventory/`, create `warehouses/` folder
2. **Create page file:** In warehouses directory, create `page.tsx`
3. **Define metadata:** Title "Warehouses - LCC"
4. **Add page header:** Title "Warehouses" with "New Warehouse" button
5. **Add search/filter:** Search by name, filter by status (active/inactive)
6. **Implement card grid:** Display warehouses as cards with details
7. **Add card actions:** Edit, deactivate/activate buttons

### Warehouse Card Information

| Section | Data Displayed |
|---------|----------------|
| Header | Warehouse name, status badge |
| Contact | Address, phone, email |
| Stats | Total products, total stock value |
| Manager | Manager name and contact |
| Actions | Edit button, status toggle |

### Page Structure
```
┌──────────────────────────────────────────┐
│  Warehouses             [New Warehouse]  │
├──────────────────────────────────────────┤
│  [Search...] [Status: All ▼]             │
├──────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ Main WH │  │Branch 1 │  │Branch 2 │  │
│  │ Active  │  │ Active  │  │Inactive │  │
│  │ 500 SKU │  │ 200 SKU │  │  50 SKU │  │
│  │[Edit]   │  │[Edit]   │  │[Edit]   │  │
│  └─────────┘  └─────────┘  └─────────┘  │
└──────────────────────────────────────────┘
```

### Status Badge Colors

| Status | Color | Description |
|--------|-------|-------------|
| Active | Green | Warehouse operational |
| Inactive | Gray | Warehouse closed/disabled |

### Expected Outcome
- Warehouses grid page at /inventory/warehouses
- Card-based layout with warehouse details
- Quick access to edit functionality

### Verification
- [ ] Page renders at correct route
- [ ] Cards display warehouse information
- [ ] Search and filter work correctly

---

## Task 10: Create New Warehouse Page Route

### Overview
Create page for adding new warehouse locations. Comprehensive form capturing warehouse details, address, and manager information.

### Dependencies
- Task 09: Create Warehouses Page Route

### Instructions

1. **Create new directory:** In warehouses folder, create `new/` folder
2. **Create page file:** In new directory, create `page.tsx`
3. **Define metadata:** Title "New Warehouse - LCC"
4. **Add form header:** Title "New Warehouse" with Cancel/Save buttons
5. **Add warehouse section:** Name, code, type (main/branch/storage)
6. **Add address section:** Street, city, postal code, district
7. **Add contact section:** Phone, email
8. **Add manager section:** Manager name, contact details
9. **Add settings section:** Active status, default warehouse checkbox

### Form Sections

| Section | Fields | Purpose |
|---------|--------|---------|
| Basic Info | Name, Code, Type | Warehouse identification |
| Address | Street, City, Postal, District | Location details |
| Contact | Phone, Email | Communication |
| Manager | Name, Phone, Email | Responsible person |
| Settings | Active, Is Default | Configuration |

### Warehouse Types

| Type | Purpose | Stock Limit |
|------|---------|-------------|
| Main | Primary distribution center | Unlimited |
| Branch | Retail/sales location | Medium |
| Storage | Overflow storage only | High |

### Form Structure
```
┌──────────────────────────────────────────┐
│  New Warehouse          [Cancel] [Save]  │
├──────────────────────────────────────────┤
│  Basic Information                       │
│  Name: [Enter warehouse name]            │
│  Code: [WH-001]                          │
│  Type: [Main Warehouse ▼]               │
├──────────────────────────────────────────┤
│  Address                                 │
│  Street: [Street address]                │
│  City: [City]    Postal: [10000]        │
│  District: [Colombo ▼]                  │
├──────────────────────────────────────────┤
│  Contact Information                     │
│  Phone: [+94 XX XXX XXXX]               │
│  Email: [warehouse@example.com]          │
├──────────────────────────────────────────┤
│  Manager Details                         │
│  Name: [Manager name]                    │
│  Phone: [+94 XX XXX XXXX]               │
│  Email: [manager@example.com]            │
├──────────────────────────────────────────┤
│  Settings                                │
│  ☑ Active    ☐ Set as Default          │
└──────────────────────────────────────────┘
```

### Validation Rules
- Warehouse code must be unique
- Phone numbers must follow Sri Lankan format (+94 XX XXX XXXX)
- At least one warehouse must be set as default
- All required fields must be filled

### Expected Outcome
- New warehouse form at /inventory/warehouses/new
- Validated form with all necessary fields
- Successful submission creates warehouse

### Verification
- [ ] Form renders at correct route
- [ ] All sections display properly
- [ ] Validation works correctly

---

## Task 11: Create Edit Warehouse Page Route

### Overview
Create dynamic route for editing existing warehouses. Uses [id] parameter to load and update warehouse details.

### Dependencies
- Task 10: Create New Warehouse Page Route

### Instructions

1. **Create dynamic directory:** In warehouses folder, create `[id]/` folder
2. **Create page file:** In [id] directory, create `page.tsx`
3. **Define metadata:** Dynamic title "Edit {Warehouse Name} - LCC"
4. **Fetch warehouse data:** Use warehouse ID from URL params
5. **Reuse form structure:** Same form as Task 10, pre-filled with data
6. **Add delete button:** Allow warehouse deletion (with confirmation)
7. **Handle not found:** Redirect if warehouse ID doesn't exist

### Dynamic Route Pattern

| URL | Warehouse ID | Action |
|-----|--------------|--------|
| /inventory/warehouses/123 | 123 | Edit warehouse 123 |
| /inventory/warehouses/456 | 456 | Edit warehouse 456 |
| /inventory/warehouses/999 | 999 | Not found → Redirect |

### Page Flow
```
URL: /inventory/warehouses/[id]
         │
         ▼
    Fetch Data
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  Found    Not Found
    │         │
    ▼         ▼
Edit Form   Redirect
```

### Form Differences from New

| Feature | New Warehouse | Edit Warehouse |
|---------|---------------|----------------|
| Title | "New Warehouse" | "Edit {Name}" |
| Button | Save | Update |
| Extra Action | None | Delete button |
| Code Field | Editable | Read-only |
| Data | Empty | Pre-filled |

### Expected Outcome
- Edit page at /inventory/warehouses/[id]
- Form pre-populated with warehouse data
- Update and delete functionality

### Verification
- [ ] Dynamic route works with any ID
- [ ] Form loads existing data
- [ ] Update saves changes correctly

---

## Task 12: Configure Page Metadata

### Overview
Configure SEO metadata for all inventory pages. Ensures proper titles, descriptions, and Open Graph tags for each route.

### Dependencies
- Tasks 01-11 (All pages created)

### Instructions

1. **Review all page files:** List all page.tsx files in inventory routes
2. **Add metadata export:** Ensure each page exports metadata object
3. **Configure titles:** Set descriptive titles with "LCC" suffix
4. **Add descriptions:** Write brief, SEO-friendly descriptions
5. **Set Open Graph tags:** Configure og:title, og:description
6. **Test metadata:** Verify in browser dev tools

### Metadata Configuration

| Page | Title | Description |
|------|-------|-------------|
| Stock Overview | "Inventory - LCC" | "View and manage stock levels across warehouses" |
| Movements | "Stock Movements - LCC" | "Track all stock movements and transactions" |
| Adjustments List | "Stock Adjustments - LCC" | "View and manage stock adjustment records" |
| New Adjustment | "New Adjustment - LCC" | "Create new stock adjustment" |
| Transfers List | "Warehouse Transfers - LCC" | "Manage transfers between warehouses" |
| New Transfer | "New Transfer - LCC" | "Create new warehouse transfer" |
| Warehouses List | "Warehouses - LCC" | "Manage warehouse locations" |
| New Warehouse | "New Warehouse - LCC" | "Add new warehouse location" |
| Edit Warehouse | "Edit Warehouse - LCC" | "Update warehouse details" |

### Metadata Structure Template
```
Metadata Object:
- title: string
- description: string
- openGraph:
  - title: string
  - description: string
  - type: "website"
```

### SEO Best Practices
- Keep titles under 60 characters
- Keep descriptions under 160 characters
- Include relevant keywords (Inventory, Stock, Warehouse)
- Use "LCC" brand suffix consistently

### Expected Outcome
- All pages have proper metadata configured
- Consistent branding across all pages
- SEO-optimized titles and descriptions

### Verification
- [ ] All 9 pages have metadata exports
- [ ] Titles follow consistent format
- [ ] Descriptions are descriptive and concise

---

## Task 13: Create Inventory Loading States

### Overview
Implement loading states for all inventory pages using Next.js loading.tsx files. Provides skeleton UI while data loads.

### Dependencies
- Tasks 01-11 (All pages created)

### Instructions

1. **Create root loading:** In `inventory/` directory, create `loading.tsx`
2. **Create movements loading:** In `movements/` directory, create `loading.tsx`
3. **Create adjustments loading:** In `adjustments/` directory, create `loading.tsx`
4. **Create transfers loading:** In `transfers/` directory, create `loading.tsx`
5. **Create warehouses loading:** In `warehouses/` directory, create `loading.tsx`
6. **Design skeleton UI:** Create loading skeletons matching page layouts
7. **Test loading states:** Verify loading UI appears during data fetch

### Loading Files to Create

| Directory | File | Purpose |
|-----------|------|---------|
| inventory/ | loading.tsx | Stock overview loading |
| movements/ | loading.tsx | Movements table loading |
| adjustments/ | loading.tsx | Adjustments table loading |
| transfers/ | loading.tsx | Transfers table loading |
| warehouses/ | loading.tsx | Warehouse cards loading |

### Skeleton Components

| Component | Loading Pattern |
|-----------|----------------|
| Table | Animated rows with shimmer |
| Cards | Card outlines with shimmer |
| Filters | Input skeletons |
| Buttons | Button-sized skeletons |

### Loading Structure Example (Table)
```
┌──────────────────────────────────────────┐
│  [████████]         [███████]            │ Header
├──────────────────────────────────────────┤
│  [███] [███] [███] [███] [███]           │ Filters
├──────────────────────────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │ Skeleton Row
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │ Skeleton Row
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │ Skeleton Row
└──────────────────────────────────────────┘
```

### Animation
- Use Tailwind's animate-pulse for shimmer effect
- Match skeleton dimensions to actual content
- Keep skeleton simple and clean

### Expected Outcome
- Loading states for all major inventory pages
- Smooth loading experience with skeleton UI
- Consistent loading patterns across pages

### Verification
- [ ] All 5 loading.tsx files created
- [ ] Skeletons match actual page layouts
- [ ] Loading animations work smoothly

---

## Task 14: Verify Route Structure

### Overview
Perform comprehensive verification of the entire inventory route structure. Test all routes, navigation, and functionality.

### Dependencies
- Tasks 01-13 (All tasks complete)

### Instructions

1. **Test all routes:** Navigate to each inventory route manually
2. **Verify layout:** Confirm tab navigation works on all pages
3. **Test navigation:** Click all tabs and verify active states
4. **Test dynamic routes:** Test warehouse edit with different IDs
5. **Verify metadata:** Check browser tab titles for all pages
6. **Test loading states:** Refresh pages and observe loading UI
7. **Check responsiveness:** Test on mobile, tablet, desktop
8. **Verify links:** Ensure all "New" buttons link correctly
9. **Document issues:** Record any problems found

### Verification Checklist

#### Route Accessibility
- [ ] /inventory loads stock overview
- [ ] /inventory/movements displays movements
- [ ] /inventory/adjustments shows adjustments list
- [ ] /inventory/adjustments/new opens adjustment form
- [ ] /inventory/transfers shows transfers list
- [ ] /inventory/transfers/new opens transfer form
- [ ] /inventory/warehouses displays warehouse grid
- [ ] /inventory/warehouses/new opens warehouse form
- [ ] /inventory/warehouses/[id] loads edit form

#### Navigation & Layout
- [ ] Tab navigation appears on all pages
- [ ] Active tab highlights correctly
- [ ] Tab clicks navigate properly
- [ ] Back button works correctly
- [ ] Dashboard breadcrumbs show

#### Metadata & Loading
- [ ] All pages have correct titles
- [ ] Metadata descriptions set
- [ ] Loading states appear on refresh
- [ ] Loading skeletons match layouts

#### Responsive Design
- [ ] Mobile layout works (< 640px)
- [ ] Tablet layout works (640-1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Navigation collapses on mobile

### Testing Methodology

1. **Manual Testing:** Click through all routes
2. **Browser DevTools:** Verify metadata in head
3. **Network Throttling:** Test loading states
4. **Responsive Mode:** Test different screen sizes
5. **Console Check:** Ensure no errors

### Expected Outcome
- All routes functional and accessible
- Consistent layout and navigation
- Proper metadata and loading states
- Responsive design working

### Issue Resolution
- Document any broken routes
- Fix navigation issues immediately
- Update metadata if missing
- Adjust loading states as needed

---

## Summary

This document completed the inventory route structure:

### Routes Created
- `/inventory/transfers/new` - Create transfer (Task 08)
- `/inventory/warehouses` - Warehouse list (Task 09)
- `/inventory/warehouses/new` - New warehouse (Task 10)
- `/inventory/warehouses/[id]` - Edit warehouse (Task 11)

### Configuration
- SEO metadata for all 9 pages (Task 12)
- Loading states for 5 directories (Task 13)
- Complete route verification (Task 14)

### Final Structure
```
frontend/app/(dashboard)/inventory/
├── layout.tsx                    # Shared layout with tabs
├── page.tsx                      # Stock overview
├── loading.tsx                   # Stock loading
├── movements/
│   ├── page.tsx
│   └── loading.tsx
├── adjustments/
│   ├── page.tsx
│   ├── loading.tsx
│   └── new/
│       └── page.tsx
├── transfers/
│   ├── page.tsx
│   ├── loading.tsx
│   └── new/
│       └── page.tsx
└── warehouses/
    ├── page.tsx
    ├── loading.tsx
    ├── new/
    │   └── page.tsx
    └── [id]/
        └── page.tsx
```

### Group A Complete
All 14 tasks finished. Inventory route structure fully established with proper navigation, metadata, and loading states. Ready for Group B implementation.
