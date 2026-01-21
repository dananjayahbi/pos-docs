# Group E: Admin & Serializers

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** E of F  
> **Tasks Covered:** 67-78  
> **Group Goal:** Configure Django admin with tree view and create DRF serializers for Account API responses

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Account-Management-Features](../Group-D_Account-Management-Features/)
- **→ Next Group:** [Group-F_API-Testing-Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

This group configures Django admin for efficient account management with hierarchical tree views and creates comprehensive DRF serializers for API responses. Admin configuration includes list display, filters, search, and MPTT tree visualization. Serializers support nested children, full tree structure, and separate serializers for AccountTypeConfig and COATemplate models.

### Key Outcomes

- Django admin for Account model with tree display
- List display showing code, name, type, balance, status
- Filters by account type, category, status
- Search by account code and name
- Hierarchical tree view in admin
- AccountSerializer with basic fields
- Nested children serializer for sub-accounts
- AccountTreeSerializer for full hierarchy
- AccountTypeSerializer for type configurations
- COATemplateSerializer for templates
- Custom validation in serializers

### Technology Context

- **Admin:** Django admin with django-mptt-admin for tree view
- **Serializers:** Django REST Framework serializers
- **Nesting:** Recursive serializers for tree structure
- **Validation:** Custom validation in serializer create/update

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-71_Account-Admin-Config.md` | Configure Django admin with tree view, filters, search | 67-71 |
| 02 | `02_Tasks-72-74_Account-Serializers.md` | Create AccountSerializer, nested children, tree serializer | 72-74 |
| 03 | `03_Tasks-75-78_Type-Template-Validation.md` | AccountType/Template serializers and validation | 75-78 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create Account Admin Config | Medium | Task 66 |
| 68 | Add Admin List Display | Low | Task 67 |
| 69 | Add Admin Filters | Low | Task 68 |
| 70 | Add Admin Tree View | Medium | Task 69 |
| 71 | Add Admin Search | Low | Task 70 |
| 72 | Create AccountSerializer | Medium | Task 71 |
| 73 | Add Nested Children Serializer | Medium | Task 72 |
| 74 | Create AccountTreeSerializer | Medium | Task 73 |
| 75 | Create AccountTypeSerializer | Low | Task 74 |
| 76 | Create COATemplateSerializer | Low | Task 75 |
| 77 | Add Create Account Validation | Medium | Task 76 |
| 78 | Add Update Account Validation | Medium | Task 77 |

---

## Execution Order

```
Task 67: Create Account Admin Config
    │
    ▼
Task 68: Add List Display
    │
    ▼
Task 69: Add Filters
    │
    ▼
Task 70: Add Tree View
    │
    ▼
Task 71: Add Search
    │
    ▼
Task 72: Create AccountSerializer
    │
    ▼
Task 73: Add Nested Children Serializer
    │
    ▼
Task 74: Create AccountTreeSerializer
    │
    ├──────────────┐
    ▼              ▼
Task 75        Task 76
(Type Serial.) (Template Serial.)
    │              │
    └──────┬───────┘
           ▼
      Task 77: Create Validation
           │
           ▼
      Task 78: Update Validation
```

---

## Expected Deliverables

```
apps/accounting/
├── admin.py                  # Account admin with tree view
├── serializers/
│   ├── __init__.py
│   ├── account.py           # AccountSerializer
│   ├── account_tree.py      # AccountTreeSerializer
│   ├── account_type.py      # AccountTypeSerializer
│   └── coa_template.py      # COATemplateSerializer
└── tests/
    └── test_serializers.py  # Serializer tests

requirements/
└── base.txt                 # django-mptt-admin added
```

---

## Notes for AI Agents

### Admin Configuration
Consider using django-mptt-admin for tree visualization:
- DraggableMPTTAdmin for drag-and-drop reordering
- Indented tree display in list view
- Expand/collapse functionality

### Admin List Display Fields
- code: Account code (e.g., 1100)
- name: Account name
- account_type: Type (Asset, Liability, etc.)
- category: Category (Current, Non-Current, etc.)
- current_balance: Formatted balance
- status: Active/Inactive/Archived

### Admin Filters
- list_filter = ['account_type', 'category', 'status', 'is_header', 'is_system']
- Enable easy filtering for account management

### Serializer Structure
```
AccountSerializer (flat):
├── id, code, name, description
├── account_type (nested TypeSerializer)
├── category, status
├── is_header, is_system
├── current_balance, opening_balance
└── parent_id

AccountTreeSerializer (recursive):
├── All AccountSerializer fields
└── children: [AccountTreeSerializer, ...] (recursive)
```

### Create/Update Validation
On Create:
- Validate code within type range
- Validate code uniqueness
- Validate parent is same type

On Update:
- Prevent type change if has transactions
- Prevent code change if is_system=True
- Validate new parent is same type

### Read-only Fields
- current_balance (calculated)
- is_system (set by fixtures only)
- tree fields (managed by MPTT)
