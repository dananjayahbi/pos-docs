# Group A: Variant Option Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create VariantOptionType and VariantOptionValue models

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group-B_ProductVariant-Model](../Group-B_ProductVariant-Model/)

---

## Group Overview

### Key Outcomes
- VariantOptionType model (Size, Color, Material)
- VariantOptionValue model (S, M, L, Red, Blue)
- Support for color swatches (hex codes)
- Support for image swatches
- Display ordering for both types and values

### Technology Context
- ForeignKey relationship between Type and Value
- Image field for swatch images
- Color code field for hex color display
- Tenant-scoped models

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-08_VariantOptionType-Model.md | 01-08 | Create VariantOptionType model |
| 02 | 02_Tasks-09-16_VariantOptionValue-Model.md | 09-16 | Create VariantOptionValue model |
| 03 | 03_Tasks-17-18_Migration-Testing.md | 17-18 | Create migration and basic tests |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create variant_option.py File | Low |
| 02 | Define VariantOptionType Class | Medium |
| 03 | Add type name Field | Low |
| 04 | Add type slug Field | Low |
| 05 | Add display_order Field | Low |
| 06 | Add is_color_swatch Field | Low |
| 07 | Add is_image_swatch Field | Low |
| 08 | Export VariantOptionType | Low |
| 09 | Define VariantOptionValue Class | Medium |
| 10 | Add option_type Field | Medium |
| 11 | Add value Field | Low |
| 12 | Add label Field | Low |
| 13 | Add color_code Field | Low |
| 14 | Add image Field | Medium |
| 15 | Add display_order Field | Low |
| 16 | Export VariantOptionValue | Low |
| 17 | Create Option Migration | Low |
| 18 | Test Option Models | Medium |

---

## Execution Order

```
Tasks 01-08: VariantOptionType Model
    │
    ▼
Tasks 09-16: VariantOptionValue Model
    │
    ▼
Tasks 17-18: Migration & Testing
```

---

## Expected Deliverables

```
backend/apps/products/
└── models/
    ├── __init__.py
    └── variant_option.py
```

---

## Notes for AI Agents

1. VariantOptionType examples: Size, Color, Material, Style
2. VariantOptionValue examples: S, M, L, XL, Red, Blue
3. is_color_swatch=True shows color picker in UI
4. is_image_swatch=True shows image selector in UI
5. color_code stores hex like #FF0000 for red
6. One Type can have many Values (1:N relationship)
