# Group E: Admin & Management Commands

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** E of F  
> **Tasks Covered:** 65-78  
> **Group Goal:** Create Django admin and management commands for categories

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Category-Serializers-Views](../Group-D_Category-Serializers-Views/)
- **→ Next Group:** [Group-F_Testing-Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes
- Tree-based admin with MPTTModelAdmin
- Drag-drop reordering in admin interface
- Seed command for demo data
- Tree rebuild command for fixing structure
- Import/export commands for category data

### Technology Context
- MPTTModelAdmin for tree-based admin
- django-admin-sortable2 compatible structure
- BaseCommand for management commands
- JSON format for import/export

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-65-73_Admin-Configuration.md | 65-73 | Create CategoryAdmin with tree support |
| 02 | 02_Tasks-74-78_Management-Commands.md | 74-78 | Create management commands |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 65 | Create admin.py File | Low |
| 66 | Import MPTTModelAdmin | Low |
| 67 | Create CategoryAdmin Class | Medium |
| 68 | Configure list_display | Low |
| 69 | Configure list_filter | Low |
| 70 | Configure search_fields | Low |
| 71 | Configure prepopulated_fields | Low |
| 72 | Configure ordering | Low |
| 73 | Enable Drag-Drop Reordering | High |
| 74 | Create Management Commands | Low |
| 75 | Create seed_categories Command | Medium |
| 76 | Create rebuild_tree Command | Medium |
| 77 | Create export_categories Command | Medium |
| 78 | Create import_categories Command | High |

---

## Execution Order

```
Tasks 65-72: Admin Configuration
    │
    ▼
Task 73: Drag-Drop Support
    │
    ▼
Task 74: Commands Directory
    │
    ▼
Tasks 75-78: Management Commands
```

---

## Expected Deliverables

```
backend/apps/categories/
├── admin.py
└── management/
    └── commands/
        ├── __init__.py
        ├── seed_categories.py
        ├── rebuild_tree.py
        ├── export_categories.py
        └── import_categories.py
```

---

## Notes for AI Agents

1. Use MPTTModelAdmin for proper tree display
2. prepopulated_fields enables auto-slug in admin
3. Drag-drop requires proper MPTT integration
4. seed_categories should include Sri Lankan business categories
5. rebuild_tree uses MPTT's rebuild() method
6. Import command must handle parent references correctly
