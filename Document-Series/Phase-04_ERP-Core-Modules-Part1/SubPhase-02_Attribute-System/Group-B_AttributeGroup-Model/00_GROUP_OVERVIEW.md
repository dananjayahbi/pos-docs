# Group B: AttributeGroup Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Create AttributeGroup model for organizing attributes

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Attributes-App-Setup](../Group-A_Attributes-App-Setup/)
- **→ Next Group:** [Group-C_Attribute-Model](../Group-C_Attribute-Model/)

---

## Group Overview

### Key Outcomes
- AttributeGroup model for organizing attributes
- Custom manager with active and prefetch methods
- Ordering by display_order field
- Export from models module

### Technology Context
- Django model inheriting from BaseModel
- Custom QuerySet and Manager patterns
- Prefetch optimization for related attributes
- Slug field for URL-friendly identifiers

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-22_AttributeGroup-Model-Fields.md | 15-22 | Create AttributeGroup model with fields |
| 02 | 02_Tasks-23-28_Manager-Migration-Export.md | 23-28 | Create manager, migration, and export |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create attribute_group.py File | Low |
| 16 | Define AttributeGroup Class | Medium |
| 17 | Add name Field | Low |
| 18 | Add slug Field | Low |
| 19 | Add description Field | Low |
| 20 | Add display_order Field | Low |
| 21 | Add is_active Field | Low |
| 22 | Add __str__ Method | Low |
| 23 | Add Meta Class | Low |
| 24 | Create GroupManager | Medium |
| 25 | Add active Method | Low |
| 26 | Add with_attributes Method | Medium |
| 27 | Export AttributeGroup | Low |
| 28 | Create Initial Migration | Low |

---

## Execution Order

```
Tasks 15-22: Model Definition & Fields
    │
    ▼
Tasks 23-26: Meta Class & Manager
    │
    ▼
Tasks 27-28: Export & Migration
```

---

## Expected Deliverables

```
backend/apps/attributes/
└── models/
    ├── __init__.py
    └── attribute_group.py
```

---

## Notes for AI Agents

1. AttributeGroup organizes related attributes (e.g., "Dimensions", "Technical Specs")
2. with_attributes should use prefetch_related for efficiency
3. display_order enables custom sorting in UI
4. Slug auto-generated from name
5. Used for grouping attributes in product forms and display
