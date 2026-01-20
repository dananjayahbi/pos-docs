# Group B: Category Model Definition

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** B of F  
> **Tasks Covered:** 15-32  
> **Group Goal:** Define the Category model with all required fields

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_MPTT-Setup](../Group-A_MPTT-Setup/)
- **→ Next Group:** [Group-C_Category-Manager-QuerySets](../Group-C_Category-Manager-QuerySets/)

---

## Group Overview

### Key Outcomes
- Category model inheriting from MPTTModel
- Basic fields: name, slug, parent, description
- Display fields: image, icon, display_order, is_active
- SEO fields: seo_title, seo_description, seo_keywords
- MPTTMeta configuration for ordering

### Technology Context
- MPTTModel base class from django-mptt
- TreeForeignKey for parent-child relationships
- UUID primary key from BaseModel
- Rich text description using TextField
- Image storage with tenant-isolated paths

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-21_Category-Class-Basic-Fields.md | 15-21 | Create Category class with basic fields |
| 02 | 02_Tasks-22-26_Display-Image-Fields.md | 22-26 | Add display, image, and status fields |
| 03 | 03_Tasks-27-32_SEO-Fields-Meta-Export.md | 27-32 | Add SEO fields, MPTTMeta, and export |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create category.py Model File | Low |
| 16 | Import MPTTModel | Low |
| 17 | Import TreeForeignKey | Low |
| 18 | Define Category Class | Medium |
| 19 | Add name Field | Low |
| 20 | Add slug Field | Low |
| 21 | Add parent Field | Medium |
| 22 | Add description Field | Low |
| 23 | Add image Field | Medium |
| 24 | Add icon Field | Low |
| 25 | Add is_active Field | Low |
| 26 | Add display_order Field | Low |
| 27 | Add seo_title Field | Low |
| 28 | Add seo_description Field | Low |
| 29 | Add seo_keywords Field | Low |
| 30 | Define MPTTMeta Class | Medium |
| 31 | Add __str__ Method | Low |
| 32 | Export Category Model | Low |

---

## Execution Order

```
Tasks 15-17: Create File & Imports
    │
    ▼
Tasks 18-21: Category Class & Basic Fields
    │
    ▼
Tasks 22-26: Display & Status Fields
    │
    ▼
Tasks 27-29: SEO Fields
    │
    ▼
Tasks 30-32: Meta, String Rep & Export
```

---

## Expected Deliverables

```
backend/apps/categories/
└── models/
    ├── __init__.py
    └── category.py
```

---

## Notes for AI Agents

1. Category inherits from both BaseModel and MPTTModel
2. Use TreeForeignKey for parent field, not regular ForeignKey
3. Slug should be auto-generated from name
4. Image path should include tenant schema for isolation
5. MPTTMeta.order_insertion_by controls child ordering
6. is_active default should be True
