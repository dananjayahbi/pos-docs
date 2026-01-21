# Group C: Product Form & Creation

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** C of F  
> **Tasks Covered:** 35-54  
> **Group Goal:** Build product creation form with all sections, validation, image upload, and API submission

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Product-Listing-Page](../Group-B_Product-Listing-Page/)
- **→ Next Group:** [Group-D_Product-Editing-Details](../Group-D_Product-Editing-Details/)

---

## Group Overview

This group creates the complete product form for creating new products. Creates Zod validation schema for products. Builds ProductForm component with React Hook Form. Creates sections: Basic Info (name, SKU with auto-generate, rich text description), Pricing (cost price, selling price, tax category), Inventory (track stock, initial stock, reorder point), Categorization (category multi-select, tags input), and Media (drag-drop image upload, preview grid, delete action). Implements form submission to API and creates the complete create product page.

### Key Outcomes

- Product form Zod schema
- ProductForm component
- Basic info section
- SKU auto-generate from name
- Rich text description editor
- Pricing section
- LKR price input component
- Tax category select
- Inventory section
- Initial stock input
- Reorder point input
- Categorization section
- Category multi-select
- Tags input with autocomplete
- Media section
- Image upload zone (drag-drop)
- Image preview grid
- Image delete action
- Form submit handler
- Create product page complete

### Technology Context

- **Form:** React Hook Form
- **Validation:** Zod schemas
- **Rich Text:** Tiptap or simple textarea
- **Image Upload:** Drag-drop with preview
- **API:** useCreateProduct mutation

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-45_Form-Schema-Sections.md` | Create form schema and main sections | 35-45 |
| 02 | `02_Tasks-46-54_Categorization-Media-Submit.md` | Create categorization, media, and submission | 46-54 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Product Form Schema | Medium | Task 14 |
| 36 | Create Product Form Component | Medium | Task 35 |
| 37 | Create Basic Info Section | Medium | Task 36 |
| 38 | Create SKU Auto-Generate | Low | Task 37 |
| 39 | Create Description Editor | Medium | Task 37 |
| 40 | Create Pricing Section | Medium | Task 36 |
| 41 | Create Price Input Component | Low | Task 40 |
| 42 | Create Tax Category Select | Low | Task 40 |
| 43 | Create Inventory Section | Medium | Task 36 |
| 44 | Create Initial Stock Input | Low | Task 43 |
| 45 | Create Reorder Point Input | Low | Task 43 |
| 46 | Create Categorization Section | Medium | Task 36 |
| 47 | Create Category Multi-Select | Medium | Task 46 |
| 48 | Create Tags Input | Medium | Task 46 |
| 49 | Create Media Section | Medium | Task 36 |
| 50 | Create Image Upload Zone | Medium | Task 49 |
| 51 | Create Image Preview Grid | Medium | Task 50 |
| 52 | Create Image Delete Action | Low | Task 51 |
| 53 | Create Form Submit Handler | Medium | Task 36 |
| 54 | Create Create Product Page | Low | Task 53 |

---

## Execution Order

```
Task 35: Product Form Schema
    │
    ▼
Task 36: Product Form Component
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 37: Basic Info Section                            │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 38    Task 39        │                            │
(SKU Auto) (Description)  │                            │
    │          │          │                            │
    └──────────┴──────────┘                            │
               │                                       │
               ▼                                       │
         Task 40: Pricing Section                      │
               │                                       │
         ┌─────┴─────┐                                 │
         ▼           ▼                                 │
      Task 41    Task 42                               │
      (Price)    (Tax)                                 │
         │           │                                 │
         └─────┬─────┘                                 │
               ▼                                       │
         Task 43: Inventory Section                    │
               │                                       │
         ┌─────┴─────┐                                 │
         ▼           ▼                                 │
      Task 44    Task 45                               │
      (Stock)    (Reorder)                             │
         │           │                                 │
         └─────┬─────┘                                 │
               ▼                                       │
         Task 46: Categorization Section               │
               │                                       │
         ┌─────┴─────┐                                 │
         ▼           ▼                                 │
      Task 47    Task 48                               │
      (Category) (Tags)                                │
         │           │                                 │
         └─────┬─────┘                                 │
               ▼                                       │
         Task 49: Media Section                        │
               │                                       │
               ▼                                       │
         Task 50: Image Upload                         │
               │                                       │
               ▼                                       │
         Task 51: Image Preview                        │
               │                                       │
               ▼                                       │
         Task 52: Image Delete                         │
               │                                       │
         └─────────────────────────────────────────────┘
                              │
                              ▼
                        Task 53: Submit Handler
                              │
                              ▼
                        Task 54: Create Page
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── modules/
│       └── products/
│           └── ProductForm/
│               ├── ProductForm.tsx
│               ├── BasicInfoSection.tsx
│               ├── PricingSection.tsx
│               ├── InventorySection.tsx
│               ├── CategorizationSection.tsx
│               ├── MediaSection.tsx
│               ├── ImageUploadZone.tsx
│               ├── ImagePreviewGrid.tsx
│               └── index.ts
├── components/
│   └── ui/
│       ├── PriceInput.tsx
│       └── TagsInput.tsx
└── lib/
    └── validations/
        └── product.ts
```

---

## Notes for AI Agents

### Product Form Schema (Task 35)
| Field | Type | Validation |
|-------|------|------------|
| name | string | Required, 2-200 chars |
| sku | string | Required, unique pattern |
| description | string | Optional, max 5000 chars |
| cost_price | number | Required, min 0 |
| selling_price | number | Required, min 0 |
| tax_category_id | string | Optional UUID |
| track_inventory | boolean | Default true |
| initial_stock | number | Min 0 |
| reorder_point | number | Min 0 |
| category_ids | string[] | Optional UUIDs |
| tags | string[] | Optional |
| images | File[] | Optional |

### SKU Auto-Generate (Task 38)
- Generate from product name
- Format: PREFIX-XXXXX
- Replace spaces with dashes
- Uppercase
- Allow manual override

### Price Input (Task 41)
| Feature | Description |
|---------|-------------|
| Prefix | LKR |
| Format | Thousand separators |
| Decimals | 2 decimal places |
| Input | Numeric only |

### Tax Categories (Task 42)
| Category | Rate |
|----------|------|
| Standard | 12% |
| Reduced | 5% |
| Zero-rated | 0% |
| Exempt | N/A |

### Inventory Section (Task 43)
| Field | Description |
|-------|-------------|
| Track inventory | Toggle on/off |
| Initial stock | Starting quantity |
| Reorder point | Alert threshold |

### Category Multi-Select (Task 47)
- Hierarchical dropdown
- Multiple selection
- Search within options
- Clear all button

### Tags Input (Task 48)
| Feature | Description |
|---------|-------------|
| Type | Autocomplete with free text |
| Existing | Suggest from existing tags |
| Create | Allow new tag creation |
| Display | Chip/badge style |

### Image Upload (Task 50)
| Feature | Description |
|---------|-------------|
| Drag-drop | Supported |
| Click | Browse files |
| Types | JPEG, PNG, WebP |
| Max size | 5MB per image |
| Max count | 10 images |

### Image Preview (Task 51)
| Feature | Description |
|---------|-------------|
| Grid | 4 columns |
| Thumbnail | 150x150 with cover |
| Primary | Star indicator |
| Reorder | Drag to reorder |
