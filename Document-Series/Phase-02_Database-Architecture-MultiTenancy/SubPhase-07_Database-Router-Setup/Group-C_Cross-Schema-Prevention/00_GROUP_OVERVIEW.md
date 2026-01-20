# Group C: Cross-Schema Prevention

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 07 - Database Router Setup  
> **Group:** C of F  
> **Tasks Covered:** 29-42  
> **Group Goal:** Prevent unauthorized cross-schema queries and relationships

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Schema-Routing-Logic/](../Group-B_Schema-Routing-Logic/)
- **→ Next Group:** [../Group-D_Connection-Management/](../Group-D_Connection-Management/)

---

## Group Overview

This group implements security measures to prevent unauthorized cross-schema queries and foreign key relationships. This is critical for maintaining tenant data isolation.

### Key Outcomes
- Cross-schema rules defined
- Cross-tenant FK blocked
- Cross-tenant queries blocked
- Shared-to-tenant FK allowed
- Tenant-to-shared FK blocked
- allow_relation implementation
- Model schema determination
- Schema comparison logic
- Cross-schema error raising
- Custom exception created
- Cross-schema attempt logging
- Raw query handling
- ORM relation validation
- Prevention documentation

### Technology Context
- **Isolation:** Prevent data leakage
- **FK Rules:** Control foreign key relationships
- **Exception:** CrossSchemaViolationError
- **Logging:** Audit blocked attempts

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-29-35_Rules-Relation.md | 29-35 | Define rules, block/allow FK, implement allow_relation, get schema |
| 02 | 02_Tasks-36-42_Errors-Logging-Validation.md | 36-42 | Compare, error, exception, logging, raw queries, ORM validation, docs |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 29 | Define Cross-Schema Rules | Task 28 | Simple |
| 30 | Block Cross-Tenant FK | Task 29 | Medium |
| 31 | Block Cross-Tenant Queries | Task 29 | Medium |
| 32 | Allow Shared-Tenant FK | Task 29 | Simple |
| 33 | Block Tenant-Shared FK | Task 29 | Simple |
| 34 | Implement allow_relation | Task 30 | Medium |
| 35 | Get Model Schema | Task 34 | Medium |
| 36 | Compare Model Schemas | Task 35 | Simple |
| 37 | Raise Cross-Schema Error | Task 36 | Simple |
| 38 | Create Custom Exception | Task 37 | Simple |
| 39 | Log Cross-Schema Attempts | Task 38 | Simple |
| 40 | Handle Raw Queries | Task 39 | Complex |
| 41 | Validate ORM Relations | Task 34 | Medium |
| 42 | Document Cross-Schema Rules | Task 41 | Simple |

---

## Execution Order

```
01_Tasks-29-35_Rules-Relation.md
        │
        ▼
02_Tasks-36-42_Errors-Logging-Validation.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        ├── routers/
        │   └── tenant_router.py    # Updated with prevention
        └── exceptions.py           # CrossSchemaViolationError

docs/
└── routing/
    └── cross-schema-prevention.md
```

---

## Cross-Schema Rules

| Source | Target | Allowed | Reason |
|--------|--------|---------|--------|
| Tenant A | Tenant A | ✅ Yes | Same schema |
| Tenant A | Tenant B | ❌ No | Data isolation |
| Tenant A | Public | ✅ Yes | Reference shared data |
| Public | Tenant A | ❌ No | Cannot reference tenant data |

---

## Custom Exception

```python
class CrossSchemaViolationError(Exception):
    """Raised when attempting cross-schema operation"""
    def __init__(self, source_schema, target_schema):
        self.source_schema = source_schema
        self.target_schema = target_schema
        message = f"Cross-schema operation blocked: {source_schema} → {target_schema}"
        super().__init__(message)
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (routing works)
2. **Critical:** This prevents data leakage between tenants
3. **FK Direction:** Tenant → Shared OK, Shared → Tenant NOT OK
4. **Logging:** Log all blocked attempts for security audit
5. **Raw SQL:** Extra caution needed for raw queries
6. **Git Commit:** Commit after completing this group

