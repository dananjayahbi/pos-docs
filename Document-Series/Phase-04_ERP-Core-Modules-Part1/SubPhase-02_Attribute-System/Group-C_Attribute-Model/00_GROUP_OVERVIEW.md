# Group C: Attribute Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** C of F  
> **Tasks Covered:** 29-48  
> **Group Goal:** Create Attribute model with type-based validation and category assignment

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_AttributeGroup-Model](../Group-B_AttributeGroup-Model/)
- **→ Next Group:** [Group-D_AttributeOption-Model](../Group-D_AttributeOption-Model/)

---

## Group Overview

### Key Outcomes
- Attribute model with multiple type support
- Category assignment via M2M relationship
- Validation fields (regex, min, max)
- Display flags (filterable, searchable, comparable)
- Unit of measure for numeric attributes

### Technology Context
- ForeignKey to AttributeGroup for organization
- ManyToManyField to Category for assignment
- Choice field for attribute_type from constants
- Validation regex for TEXT type validation

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-29-36_Attribute-Model-Basic-Fields.md | 29-36 | Create Attribute model with basic fields |
| 02 | 02_Tasks-37-42_Display-Validation-Fields.md | 37-42 | Add display and validation fields |
| 03 | 03_Tasks-43-48_Category-Assignment-Export.md | 43-48 | Add category M2M and export |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create attribute.py File | Low |
| 30 | Define Attribute Class | Medium |
| 31 | Add name Field | Low |
| 32 | Add slug Field | Low |
| 33 | Add group Field | Medium |
| 34 | Add attribute_type Field | Medium |
| 35 | Add unit Field | Low |
| 36 | Add is_required Field | Low |
| 37 | Add is_filterable Field | Low |
| 38 | Add is_searchable Field | Low |
| 39 | Add is_comparable Field | Low |
| 40 | Add is_visible_on_product Field | Low |
| 41 | Add display_order Field | Low |
| 42 | Add validation_regex Field | Medium |
| 43 | Add min_value Field | Low |
| 44 | Add max_value Field | Low |
| 45 | Add categories Field | High |
| 46 | Add __str__ Method | Low |
| 47 | Export Attribute | Low |
| 48 | Create Attribute Migration | Low |

---

## Execution Order

```
Tasks 29-36: Basic Fields
    │
    ▼
Tasks 37-42: Display & Validation Fields
    │
    ▼
Tasks 43-48: Category M2M & Export
```

---

## Expected Deliverables

```
backend/apps/attributes/
└── models/
    ├── __init__.py
    ├── attribute_group.py
    └── attribute.py
```

---

## Notes for AI Agents

1. attribute_type uses choices from constants.py
2. categories M2M links to Category model from categories app
3. is_filterable marks attributes for webstore faceted search
4. is_searchable marks attributes for full-text search indexing
5. min_value/max_value only apply to NUMBER type
6. validation_regex only applies to TEXT type
7. Child categories inherit parent's attributes
