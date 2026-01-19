# Group F: Platform Audit & Billing

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** F of G  
> **Tasks Covered:** 73-84  
> **Group Goal:** Create platform-level audit logging and tenant billing models

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Feature-Flags-System/](../Group-E_Feature-Flags-System/)
- **→ Next Group:** [../Group-G_Migration-Verification/](../Group-G_Migration-Verification/)

---

## Group Overview

This group creates the audit logging and billing information models for platform-level operations. The audit log tracks administrative actions, while the billing model stores tenant billing information.

### Key Outcomes
- PlatformAuditLog model created
- Action type enum field
- Actor field (who performed action)
- Target tenant field
- Metadata JSONField (action details)
- IP address field
- TenantBilling model created
- Billing address fields
- Tax ID field (business number)
- Payment method field
- Billing contact fields
- Invoice settings
- Admin interfaces created
- Audit logging documentation

### Technology Context
- **Audit:** Platform-level action logging
- **Billing:** Sri Lankan business requirements
- **Tax:** Business Registration Number (BRN)
- **Invoicing:** Monthly billing cycles

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-73-78_Audit-Log-Model.md | 73-78 | PlatformAuditLog, action field, actor, target tenant, metadata, IP address |
| 02 | 02_Tasks-79-84_Billing-Model.md | 79-84 | TenantBilling, address fields, tax ID, payment method, admin, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 73 | Create PlatformAuditLog | Task 07 | Medium |
| 74 | Add Action Field | Task 73 | Simple |
| 75 | Add Actor Field | Task 73 | Simple |
| 76 | Add Target Tenant Field | Task 73 | Simple |
| 77 | Add Metadata JSONField | Task 73 | Simple |
| 78 | Add IP Address Field | Task 73 | Simple |
| 79 | Create TenantBilling Model | Task 07 | Medium |
| 80 | Add Billing Address Fields | Task 79 | Medium |
| 81 | Add Tax ID Field | Task 79 | Simple |
| 82 | Add Payment Method Field | Task 79 | Simple |
| 83 | Create Billing Admin | Task 82 | Medium |
| 84 | Document Audit & Billing | Task 83 | Simple |

---

## Execution Order

```
01_Tasks-73-78_Audit-Log-Model.md
        │
        ▼
02_Tasks-79-84_Billing-Model.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── platform/
        ├── models/
        │   ├── audit.py         # PlatformAuditLog
        │   └── billing.py       # TenantBilling
        └── admin.py             # Updated with audit/billing admin

docs/
└── platform/
    ├── audit-logging.md         # Audit log documentation
    └── billing-setup.md         # Billing configuration
```

---

## Audit Action Types

| Action | Description |
|--------|-------------|
| TENANT_CREATED | New tenant registered |
| TENANT_SUSPENDED | Tenant suspended |
| TENANT_ACTIVATED | Tenant activated |
| PLAN_CHANGED | Subscription plan changed |
| ADMIN_LOGIN | Platform admin login |
| SETTINGS_CHANGED | Platform settings modified |

---

## Sri Lankan Billing Fields

| Field | Description |
|-------|-------------|
| business_name | Registered business name |
| brn_number | Business Registration Number |
| vat_number | VAT registration (if applicable) |
| address_line_1 | Street address |
| city | City |
| postal_code | Postal code |
| province | Province (Western, Southern, etc.) |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group E complete (feature flags exist)
2. **Audit:** Log all platform admin actions
3. **IP Address:** Use GenericIPAddressField
4. **Sri Lankan Tax:** BRN format validation
5. **Billing Cycle:** Monthly by default
6. **Git Commit:** Commit after completing this group

