# Group D: Product Editing & Details

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** D of F  
> **Tasks Covered:** 55-70  
> **Group Goal:** Build product detail view, edit page, delete/archive actions, and duplicate functionality

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Product-Form-Creation](../Group-C_Product-Form-Creation/)
- **→ Next Group:** [Group-E_Variant-Category-Management](../Group-E_Variant-Category-Management/)

---

## Group Overview

This group creates product detail view and editing functionality. Creates product detail page with header (name, status, actions), info card, pricing card, inventory card (stock per warehouse), image gallery with lightbox, and activity timeline. Creates edit product page that fetches product data, populates form with existing values, and handles update submission with optimistic updates. Creates delete confirmation dialog, implements deletion, archive/restore actions, and duplicate product functionality.

### Key Outcomes

- Product detail page
- Product detail header
- Product info card
- Product pricing card
- Product inventory card
- Product image gallery
- Product activity timeline
- Edit product page
- Fetch product data for edit
- Populate form with data
- Update submit handler
- Optimistic updates
- Delete product dialog
- Delete implementation
- Archive/restore actions
- Duplicate product action

### Technology Context

- **Data Fetching:** useProduct hook
- **Mutations:** useUpdateProduct, useDeleteProduct
- **Optimistic Updates:** TanStack Query
- **Gallery:** Lightbox component
- **Timeline:** Activity log display

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-55-61_Detail-Page.md` | Create product detail page and cards | 55-61 |
| 02 | `02_Tasks-62-70_Edit-Delete-Actions.md` | Create edit page and actions | 62-70 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 55 | Create Product Detail Page | Medium | Task 14 |
| 56 | Create Product Detail Header | Low | Task 55 |
| 57 | Create Product Info Card | Low | Task 55 |
| 58 | Create Product Pricing Card | Low | Task 55 |
| 59 | Create Product Inventory Card | Medium | Task 55 |
| 60 | Create Product Image Gallery | Medium | Task 55 |
| 61 | Create Product Activity Timeline | Medium | Task 55 |
| 62 | Create Edit Product Page | Medium | Task 54 |
| 63 | Fetch Product Data for Edit | Low | Task 62 |
| 64 | Populate Form with Existing Data | Low | Task 63 |
| 65 | Create Update Handler | Medium | Task 64 |
| 66 | Handle Optimistic Updates | Medium | Task 65 |
| 67 | Create Delete Product Dialog | Low | Task 55 |
| 68 | Implement Product Deletion | Medium | Task 67 |
| 69 | Create Archive/Restore Actions | Low | Task 55 |
| 70 | Create Duplicate Product Action | Medium | Task 55 |

---

## Execution Order

```
Task 55: Product Detail Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 56: Detail Header                                 │
    │                                                  │
    ├──────────┬──────────┬──────────┬──────────┬──────┤
    ▼          ▼          ▼          ▼          ▼      │
Task 57    Task 58    Task 59    Task 60    Task 61    │
(Info)     (Pricing)  (Inventory)(Gallery)  (Timeline) │
    │          │          │          │          │      │
    └──────────┴──────────┴──────────┴──────────┘      │
               │                                       │
               ├──────────┬──────────┬─────────────────┤
               ▼          ▼          ▼                 │
           Task 67    Task 69    Task 70               │
           (Delete)   (Archive)  (Duplicate)           │
               │                                       │
               ▼                                       │
           Task 68: Delete Implementation              │
               │                                       │
               └───────────────────────────────────────┘
                              │
                              ▼
                        Task 62: Edit Page
                              │
                              ▼
                        Task 63: Fetch Data
                              │
                              ▼
                        Task 64: Populate Form
                              │
                              ▼
                        Task 65: Update Handler
                              │
                              ▼
                        Task 66: Optimistic Updates
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── products/
│           └── [id]/
│               ├── page.tsx
│               └── edit/
│                   └── page.tsx
└── components/
    └── modules/
        └── products/
            └── ProductDetail/
                ├── ProductDetail.tsx
                ├── ProductDetailHeader.tsx
                ├── ProductInfoCard.tsx
                ├── ProductPricingCard.tsx
                ├── ProductInventoryCard.tsx
                ├── ProductImageGallery.tsx
                ├── ProductActivityTimeline.tsx
                ├── DeleteProductDialog.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Product Detail Header (Task 56)
| Element | Description |
|---------|-------------|
| Name | Product name (H1) |
| Status | Status badge |
| Edit | Edit button |
| More | Dropdown (archive, duplicate, delete) |

### Product Info Card (Task 57)
| Field | Display |
|-------|---------|
| SKU | Badge |
| Description | Rendered HTML |
| Categories | Chip list |
| Tags | Tag list |
| Created | Date + time |
| Updated | Date + time |

### Product Pricing Card (Task 58)
| Field | Display |
|-------|---------|
| Cost Price | LKR formatted |
| Selling Price | LKR formatted |
| Profit Margin | Calculated percentage |
| Tax Category | Category name |

### Product Inventory Card (Task 59)
| Column | Description |
|--------|-------------|
| Warehouse | Warehouse name |
| Available | Available stock |
| Reserved | Reserved stock |
| Total | Total stock |

### Image Gallery (Task 60)
| Feature | Description |
|---------|-------------|
| Thumbnails | Grid of images |
| Primary | Highlighted |
| Click | Open lightbox |
| Navigate | Left/right arrows |

### Activity Timeline (Task 61)
| Field | Description |
|-------|-------------|
| Icon | Activity type icon |
| Title | What changed |
| User | Who made change |
| Date | When (relative) |
| Details | Expandable details |

### Optimistic Updates (Task 66)
1. Update local cache immediately
2. Show success toast
3. Revert on error
4. Invalidate related queries

### Delete Dialog (Task 67)
| Element | Content |
|---------|---------|
| Title | Delete Product |
| Message | Confirm deletion warning |
| Cancel | Cancel button |
| Confirm | Delete button (destructive) |

### Archive Action (Task 69)
| Action | API Call |
|--------|----------|
| Archive | PATCH status: archived |
| Restore | PATCH status: active |

### Duplicate Action (Task 70)
1. Fetch product data
2. Navigate to /products/new
3. Pre-fill form (except SKU)
4. Clear images
