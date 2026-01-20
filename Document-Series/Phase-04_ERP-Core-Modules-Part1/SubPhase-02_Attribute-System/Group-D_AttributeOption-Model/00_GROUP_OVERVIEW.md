# Group D: AttributeOption Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** D of F  
> **Tasks Covered:** 49-62  
> **Group Goal:** Create AttributeOption model for SELECT and MULTISELECT types

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Attribute-Model](../Group-C_Attribute-Model/)
- **→ Next Group:** [Group-E_Serializers-Views](../Group-E_Serializers-Views/)

---

## Group Overview

### Key Outcomes
- AttributeOption model for predefined choices
- Support for color swatches and option images
- Default option marking
- Ordered display of options

### Technology Context
- ForeignKey to Attribute with related_name
- Color code field for visual swatches
- Image field for option visualization
- Unique together constraint for attribute + value

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-49-57_AttributeOption-Model-Fields.md | 49-57 | Create AttributeOption model with fields |
| 02 | 02_Tasks-58-62_Meta-Manager-Export.md | 58-62 | Add Meta, manager, and export |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 49 | Create attribute_option.py File | Low |
| 50 | Define AttributeOption Class | Medium |
| 51 | Add attribute Field | Medium |
| 52 | Add value Field | Low |
| 53 | Add label Field | Low |
| 54 | Add color_code Field | Low |
| 55 | Add image Field | Medium |
| 56 | Add display_order Field | Low |
| 57 | Add is_default Field | Low |
| 58 | Add __str__ Method | Low |
| 59 | Add Meta Class | Medium |
| 60 | Create OptionManager | Medium |
| 61 | Export AttributeOption | Low |
| 62 | Create Option Migration | Low |

---

## Execution Order

```
Tasks 49-57: Model Definition & Fields
    │
    ▼
Tasks 58-60: Meta & Manager
    │
    ▼
Tasks 61-62: Export & Migration
```

---

## Expected Deliverables

```
backend/apps/attributes/
└── models/
    ├── __init__.py
    ├── attribute_group.py
    ├── attribute.py
    └── attribute_option.py
```

---

## Notes for AI Agents

1. AttributeOption only used for SELECT/MULTISELECT types
2. value is the stored value, label is the display text
3. color_code stores hex color for swatch display (e.g., #FF0000)
4. image path should include tenant schema for isolation
5. is_default marks the pre-selected option
6. Unique constraint on (attribute, value) prevents duplicates
