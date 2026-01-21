# Group E: Variant & Category Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** E of F  
> **Tasks Covered:** 71-86  
> **Group Goal:** Build variant management interface and category CRUD with tree view

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Product-Editing-Details](../Group-D_Product-Editing-Details/)
- **→ Next Group:** [Group-F_Import-Export-Testing](../Group-F_Import-Export-Testing/)

---

## Group Overview

This group creates variant management and category management interfaces. Variant Management: creates page to manage product variants, attribute selector (size, color, etc.), variant matrix builder that generates combinations, variant table with prices and stock, inline editing for price/SKU, bulk edit for variant prices, and delete individual variants. Category Management: creates category list page with hierarchy tree view, category form for create/edit, name input with slug preview, parent category selector, category image upload, create and edit pages, and delete confirmation dialog.

### Key Outcomes

- Variant management page
- Variant attribute selector
- Variant matrix builder
- Variant table with data
- Variant inline editor
- Variant bulk edit
- Variant delete action
- Category list page
- Category tree view
- Category form
- Category name input
- Parent category select
- Category image upload
- Category create page
- Category edit page
- Category delete dialog

### Technology Context

- **Variants:** Matrix generation from attributes
- **Inline Edit:** Editable table cells
- **Tree View:** Hierarchical display
- **Form:** React Hook Form

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-71-77_Variant-Management.md` | Create variant management interface | 71-77 |
| 02 | `02_Tasks-78-86_Category-Management.md` | Create category CRUD interface | 78-86 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 71 | Create Variant Management Page | Medium | Task 14 |
| 72 | Create Variant Attribute Selector | Medium | Task 71 |
| 73 | Create Variant Matrix Builder | High | Task 72 |
| 74 | Create Variant Table | Medium | Task 73 |
| 75 | Create Variant Inline Editor | Medium | Task 74 |
| 76 | Create Variant Bulk Edit | Medium | Task 74 |
| 77 | Create Variant Delete Action | Low | Task 74 |
| 78 | Create Category List Page | Medium | Task 14 |
| 79 | Create Category Tree View | Medium | Task 78 |
| 80 | Create Category Form | Medium | Task 78 |
| 81 | Create Category Name Input | Low | Task 80 |
| 82 | Create Parent Category Select | Medium | Task 80 |
| 83 | Create Category Image Upload | Low | Task 80 |
| 84 | Create Category Create Page | Low | Task 80 |
| 85 | Create Category Edit Page | Low | Task 80 |
| 86 | Create Category Delete Dialog | Low | Task 78 |

---

## Execution Order

```
Task 71: Variant Management Page
    │
    ▼
Task 72: Attribute Selector
    │
    ▼
Task 73: Matrix Builder
    │
    ▼
Task 74: Variant Table
    │
    ├──────────┬──────────┬──────────┐
    ▼          ▼          ▼          │
Task 75    Task 76    Task 77       │
(Inline)   (Bulk)     (Delete)      │
    │          │          │          │
    └──────────┴──────────┴──────────┘
               │
               ▼
         Task 78: Category List Page
               │
               ├──────────┬──────────┐
               ▼          ▼          │
           Task 79    Task 86       │
           (Tree)     (Delete)      │
               │                     │
               ▼                     │
         Task 80: Category Form     │
               │                     │
    ┌──────────┼──────────┬──────────┤
    ▼          ▼          ▼          │
Task 81    Task 82    Task 83       │
(Name)     (Parent)   (Image)       │
    │          │          │          │
    └──────────┴──────────┘          │
               │                     │
         ┌─────┴─────┐               │
         ▼           ▼               │
      Task 84    Task 85             │
      (Create)   (Edit)              │
         │           │               │
         └───────────┴───────────────┘
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── products/
│           ├── [id]/
│           │   └── variants/
│           │       └── page.tsx
│           └── categories/
│               ├── page.tsx
│               ├── new/
│               │   └── page.tsx
│               └── [id]/
│                   └── page.tsx
└── components/
    └── modules/
        └── products/
            ├── Variants/
            │   ├── VariantManager.tsx
            │   ├── AttributeSelector.tsx
            │   ├── VariantMatrix.tsx
            │   ├── VariantTable.tsx
            │   └── index.ts
            └── Categories/
                ├── CategoryList.tsx
                ├── CategoryTree.tsx
                ├── CategoryForm.tsx
                ├── DeleteCategoryDialog.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Variant Attributes (Task 72)
| Attribute | Example Values |
|-----------|----------------|
| Size | XS, S, M, L, XL, XXL |
| Color | Red, Blue, Green, Black, White |
| Material | Cotton, Polyester, Silk |
| Style | Regular, Slim, Relaxed |

### Attribute Selector (Task 72)
| Feature | Description |
|---------|-------------|
| Select | Choose attribute type |
| Values | Add/remove values |
| Custom | Create custom attribute |

### Matrix Builder (Task 73)
| Input | Output |
|-------|--------|
| Size: S, M, L | S, M, L |
| Color: Red, Blue | Red, Blue |
| Result | S-Red, S-Blue, M-Red, M-Blue, L-Red, L-Blue |

### Variant Table Columns (Task 74)
| Column | Description |
|--------|-------------|
| Variant | Attribute combination |
| SKU | Unique variant SKU |
| Price | Variant price (editable) |
| Stock | Stock level |
| Actions | Delete |

### Inline Editor (Task 75)
| Field | Edit Mode |
|-------|-----------|
| SKU | Click to edit text |
| Price | Click to edit number |
| Stock | View only |

### Bulk Edit (Task 76)
| Action | Description |
|--------|-------------|
| Set Price | Apply price to selected |
| Adjust % | Increase/decrease by % |

### Category Tree (Task 79)
| Feature | Description |
|---------|-------------|
| Expand | Toggle children |
| Indent | Show hierarchy |
| Count | Product count per category |
| Actions | Edit, Delete |

### Category Form (Task 80)
| Field | Type |
|-------|------|
| Name | Text input |
| Slug | Auto-generated, editable |
| Parent | Select dropdown |
| Description | Textarea |
| Image | File upload |

### Parent Select (Task 82)
- Hierarchical dropdown
- Show full path
- Exclude self and descendants

### Category Delete (Task 86)
| Condition | Behavior |
|-----------|----------|
| Has products | Show warning |
| Has children | Move to parent or delete all |
| Empty | Allow delete |
