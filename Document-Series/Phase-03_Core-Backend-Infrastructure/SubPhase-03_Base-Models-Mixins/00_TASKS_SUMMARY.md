# SubPhase 03: Base Models & Mixins - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 03 of 12  
> **SubPhase Goal:** Create reusable abstract models for consistency across all apps  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 7-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_API-Framework-Setup](../SubPhase-02_API-Framework-Setup/)
- **→ Next SubPhase:** [SubPhase-04_User-Model-Authentication](../SubPhase-04_User-Model-Authentication/)

---

## SubPhase Overview

This sub-phase creates the foundational abstract models and mixins that all business models will inherit from. These ensure consistency in timestamps, soft deletion, audit trails, and tenant scoping across the entire platform.

### Key Outcomes
- TimeStampedModel created
- SoftDeleteModel created
- AuditModel created
- TenantScopedModel created
- UUIDModel created
- All necessary managers and querysets
- Model field mixins defined
- Validators and utilities ready

### Base Models Hierarchy
```
Model
├── TimeStampedModel (created_at, updated_at)
│   ├── SoftDeleteModel (is_deleted, deleted_at)
│   │   └── AuditModel (created_by, updated_by)
│   └── UUIDModel (uuid primary key)
└── TenantScopedModel (automatic tenant filtering)
```

### Dependencies
- **Requires:** SubPhase-01 (Django Apps Structure)

---

## Task Execution Order

```
TASK GROUP A: Base Model Setup (Tasks 01-14)
        │
        ▼
TASK GROUP B: TimeStampedModel (Tasks 15-28)
        │
        ▼
TASK GROUP C: SoftDeleteModel (Tasks 29-44)
        │
        ▼
TASK GROUP D: AuditModel (Tasks 45-58)
        │
        ▼
TASK GROUP E: UUID & TenantScoped Models (Tasks 59-74)
        │
        ▼
TASK GROUP F: Validators & Utilities (Tasks 75-94)
```

---

## Task Index

### Group A: Base Model Setup (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create models Directory** | apps/core/models/ | SubPhase-01 | 🔴 Not Created |
| 02 | **Create models __init__.py** | Export all models | Task 01 | 🔴 Not Created |
| 03 | **Create base.py File** | Base model classes | Task 02 | 🔴 Not Created |
| 04 | **Import Django Models** | from django.db import models | Task 03 | 🔴 Not Created |
| 05 | **Create managers Directory** | apps/core/managers/ | Task 04 | 🔴 Not Created |
| 06 | **Create managers __init__.py** | Export all managers | Task 05 | 🔴 Not Created |
| 07 | **Create BaseManager Class** | Foundation manager | Task 06 | 🔴 Not Created |
| 08 | **Create BaseQuerySet Class** | Foundation queryset | Task 07 | 🔴 Not Created |
| 09 | **Create mixins Directory** | apps/core/mixins/ | Task 08 | 🔴 Not Created |
| 10 | **Create mixins __init__.py** | Export all mixins | Task 09 | 🔴 Not Created |
| 11 | **Define Model Naming Convention** | Standards document | Task 10 | 🔴 Not Created |
| 12 | **Define Field Naming Convention** | Field standards | Task 11 | 🔴 Not Created |
| 13 | **Create Model Documentation Template** | Docstring format | Task 12 | 🔴 Not Created |
| 14 | **Verify Base Structure** | Test imports work | Task 13 | 🔴 Not Created |

---

### Group B: TimeStampedModel (Tasks 15-28)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create timestamped.py File** | TimeStamped model file | Task 14 | 🔴 Not Created |
| 16 | **Create TimeStampedModel Class** | Abstract model class | Task 15 | 🔴 Not Created |
| 17 | **Add created_at Field** | DateTimeField auto_now_add | Task 16 | 🔴 Not Created |
| 18 | **Add updated_at Field** | DateTimeField auto_now | Task 17 | 🔴 Not Created |
| 19 | **Set Meta abstract=True** | Make abstract | Task 18 | 🔴 Not Created |
| 20 | **Add ordering by created_at** | Default ordering | Task 19 | 🔴 Not Created |
| 21 | **Create TimeStampedManager** | Custom manager | Task 20 | 🔴 Not Created |
| 22 | **Add recent() Method** | Filter last N days | Task 21 | 🔴 Not Created |
| 23 | **Add today() Method** | Filter today's records | Task 22 | 🔴 Not Created |
| 24 | **Add this_week() Method** | Filter this week | Task 23 | 🔴 Not Created |
| 25 | **Add this_month() Method** | Filter this month | Task 24 | 🔴 Not Created |
| 26 | **Export in models __init__.py** | Make importable | Task 25 | 🔴 Not Created |
| 27 | **Create TimeStamped Tests** | Unit tests | Task 26 | 🔴 Not Created |
| 28 | **Document TimeStampedModel** | Usage documentation | Task 27 | 🔴 Not Created |

---

### Group C: SoftDeleteModel (Tasks 29-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 29 | **Create soft_delete.py File** | SoftDelete model file | Task 28 | 🔴 Not Created |
| 30 | **Create SoftDeleteModel Class** | Extend TimeStampedModel | Task 29 | 🔴 Not Created |
| 31 | **Add is_deleted Field** | BooleanField default False | Task 30 | 🔴 Not Created |
| 32 | **Add deleted_at Field** | DateTimeField nullable | Task 31 | 🔴 Not Created |
| 33 | **Create SoftDeleteManager** | Custom manager | Task 32 | 🔴 Not Created |
| 34 | **Override get_queryset** | Filter out deleted | Task 33 | 🔴 Not Created |
| 35 | **Create all_with_deleted Manager** | Include deleted | Task 34 | 🔴 Not Created |
| 36 | **Create deleted_only Manager** | Only deleted items | Task 35 | 🔴 Not Created |
| 37 | **Add soft_delete() Method** | Soft delete method | Task 36 | 🔴 Not Created |
| 38 | **Add restore() Method** | Restore deleted item | Task 37 | 🔴 Not Created |
| 39 | **Add hard_delete() Method** | Permanent delete | Task 38 | 🔴 Not Created |
| 40 | **Override delete() Method** | Use soft_delete | Task 39 | 🔴 Not Created |
| 41 | **Add db_index to is_deleted** | Index for performance | Task 40 | 🔴 Not Created |
| 42 | **Export in models __init__.py** | Make importable | Task 41 | 🔴 Not Created |
| 43 | **Create SoftDelete Tests** | Unit tests | Task 42 | 🔴 Not Created |
| 44 | **Document SoftDeleteModel** | Usage documentation | Task 43 | 🔴 Not Created |

---

### Group D: AuditModel (Tasks 45-58)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Create audit.py File** | Audit model file | Task 44 | 🔴 Not Created |
| 46 | **Create AuditModel Class** | Extend SoftDeleteModel | Task 45 | 🔴 Not Created |
| 47 | **Add created_by Field** | ForeignKey to User | Task 46 | 🔴 Not Created |
| 48 | **Add updated_by Field** | ForeignKey to User | Task 47 | 🔴 Not Created |
| 49 | **Configure on_delete** | SET_NULL for safety | Task 48 | 🔴 Not Created |
| 50 | **Add related_name Pattern** | Consistent naming | Task 49 | 🔴 Not Created |
| 51 | **Create AuditManager** | Custom manager | Task 50 | 🔴 Not Created |
| 52 | **Add created_by_user() Filter** | Filter by creator | Task 51 | 🔴 Not Created |
| 53 | **Add updated_by_user() Filter** | Filter by updater | Task 52 | 🔴 Not Created |
| 54 | **Create AuditMixin** | For views/serializers | Task 53 | 🔴 Not Created |
| 55 | **Add set_created_by Method** | Set creator on create | Task 54 | 🔴 Not Created |
| 56 | **Add set_updated_by Method** | Set updater on save | Task 55 | 🔴 Not Created |
| 57 | **Create Audit Tests** | Unit tests | Task 56 | 🔴 Not Created |
| 58 | **Document AuditModel** | Usage documentation | Task 57 | 🔴 Not Created |

---

### Group E: UUID & TenantScoped Models (Tasks 59-74)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 59 | **Create uuid_model.py File** | UUID model file | Task 58 | 🔴 Not Created |
| 60 | **Create UUIDModel Class** | Abstract UUID model | Task 59 | 🔴 Not Created |
| 61 | **Add uuid Field** | UUIDField as primary key | Task 60 | 🔴 Not Created |
| 62 | **Configure uuid Default** | uuid4 default | Task 61 | 🔴 Not Created |
| 63 | **Set editable=False** | Non-editable UUID | Task 62 | 🔴 Not Created |
| 64 | **Create UUID Tests** | Unit tests | Task 63 | 🔴 Not Created |
| 65 | **Create tenant_scoped.py File** | TenantScoped model file | Task 64 | 🔴 Not Created |
| 66 | **Create TenantScopedModel Class** | Tenant-aware abstract model | Task 65 | 🔴 Not Created |
| 67 | **Create TenantScopedManager** | Auto-filter by tenant | Task 66 | 🔴 Not Created |
| 68 | **Override get_queryset** | Add tenant filter | Task 67 | 🔴 Not Created |
| 69 | **Integrate with django-tenants** | Use connection.tenant | Task 68 | 🔴 Not Created |
| 70 | **Create for_tenant() Method** | Explicit tenant filter | Task 69 | 🔴 Not Created |
| 71 | **Add tenant Field** | Optional FK to Tenant | Task 70 | 🔴 Not Created |
| 72 | **Create TenantScoped Tests** | Unit tests | Task 71 | 🔴 Not Created |
| 73 | **Export All in __init__.py** | Make all importable | Task 72 | 🔴 Not Created |
| 74 | **Document UUID & TenantScoped** | Usage documentation | Task 73 | 🔴 Not Created |

---

### Group F: Validators & Utilities (Tasks 75-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 75 | **Create validators.py File** | Custom validators | Task 74 | 🔴 Not Created |
| 76 | **Create PhoneNumberValidator** | Sri Lankan phone format | Task 75 | 🔴 Not Created |
| 77 | **Create NICValidator** | National ID card format | Task 76 | 🔴 Not Created |
| 78 | **Create BRNValidator** | Business registration | Task 77 | 🔴 Not Created |
| 79 | **Create PositiveDecimalValidator** | Positive decimals only | Task 78 | 🔴 Not Created |
| 80 | **Create PercentageValidator** | 0-100 range | Task 79 | 🔴 Not Created |
| 81 | **Create fields.py File** | Custom model fields | Task 80 | 🔴 Not Created |
| 82 | **Create MoneyField** | Currency with precision | Task 81 | 🔴 Not Created |
| 83 | **Create PercentageField** | Percentage field | Task 82 | 🔴 Not Created |
| 84 | **Create PhoneNumberField** | Phone with validation | Task 83 | 🔴 Not Created |
| 85 | **Create SlugField with Auto** | Auto-generate slug | Task 84 | 🔴 Not Created |
| 86 | **Create utils.py File** | Model utilities | Task 85 | 🔴 Not Created |
| 87 | **Create generate_unique_code** | Unique code generator | Task 86 | 🔴 Not Created |
| 88 | **Create get_current_tenant** | Get active tenant | Task 87 | 🔴 Not Created |
| 89 | **Create get_current_user** | Get request user | Task 88 | 🔴 Not Created |
| 90 | **Export All Validators** | In validators __init__ | Task 89 | 🔴 Not Created |
| 91 | **Export All Fields** | In fields __init__ | Task 90 | 🔴 Not Created |
| 92 | **Create Initial Migration** | Generate migrations | Task 91 | 🔴 Not Created |
| 93 | **Create Full Test Suite** | All model tests | Task 92 | 🔴 Not Created |
| 94 | **Document All Base Models** | Complete documentation | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/core/
├── models/
│   ├── __init__.py
│   ├── base.py
│   ├── timestamped.py
│   ├── soft_delete.py
│   ├── audit.py
│   ├── uuid_model.py
│   └── tenant_scoped.py
├── managers/
│   ├── __init__.py
│   ├── base.py
│   ├── timestamped.py
│   ├── soft_delete.py
│   ├── audit.py
│   └── tenant_scoped.py
├── mixins/
│   ├── __init__.py
│   ├── audit_mixin.py
│   └── tenant_mixin.py
├── validators/
│   ├── __init__.py
│   └── validators.py
├── fields/
│   ├── __init__.py
│   └── fields.py
├── utils/
│   ├── __init__.py
│   └── utils.py
└── tests/
    ├── __init__.py
    ├── test_timestamped.py
    ├── test_soft_delete.py
    ├── test_audit.py
    ├── test_uuid.py
    └── test_tenant_scoped.py
```

---

## Model Inheritance Diagram

```
┌─────────────────────────────────────────────────────┐
│              BASE MODEL HIERARCHY                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│               django.db.models.Model                │
│                        │                            │
│            ┌──────────┴──────────┐                 │
│            │                     │                  │
│   TimeStampedModel          UUIDModel              │
│   (created_at,              (uuid pk)              │
│    updated_at)                                     │
│            │                                        │
│   SoftDeleteModel                                  │
│   (is_deleted,                                     │
│    deleted_at)                                     │
│            │                                        │
│      AuditModel                                    │
│   (created_by,                                     │
│    updated_by)                                     │
│            │                                        │
│   TenantScopedModel                                │
│   (tenant filtering)                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 94 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 94 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Abstract Models:** All base models are abstract=True
3. **Inheritance Order:** TimeStamped → SoftDelete → Audit
4. **Managers Important:** Custom managers filter data
5. **Tenant Awareness:** TenantScopedModel uses django-tenants
6. **Validators:** Sri Lankan specific (phone, NIC)
7. **Testing Required:** Each model needs unit tests
8. **Circular Imports:** User FK uses string reference
9. **Documentation:** Document each model usage
