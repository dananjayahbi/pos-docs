# Group D: Tenant Settings Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** D of F  
> **Tasks Covered:** 47-58  
> **Group Goal:** Create per-tenant configuration settings model

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Domain-Model-Implementation/](../Group-C_Domain-Model-Implementation/)
- **→ Next Group:** [../Group-E_Tenant-Subscription-Tracking/](../Group-E_Tenant-Subscription-Tracking/)

---

## Group Overview

This group creates the TenantSettings model that stores per-tenant configuration options. This includes branding, invoice/receipt settings, tax rates, and JSON fields for flexible feature toggles and integration settings.

### Key Outcomes
- TenantSettings model created
- Tenant OneToOne relationship
- Theme color field (brand color)
- Invoice prefix field
- Order prefix field
- Default tax rate field
- Invoice footer text
- Receipt footer text
- Notification settings JSONField
- Feature settings JSONField
- Integration settings JSONField
- Auto-creation signal on tenant creation

### Technology Context
- **Relationship:** OneToOne with Tenant
- **JSONFields:** Flexible settings storage
- **Signal:** Auto-create settings on new tenant
- **Caching:** Settings cached per tenant

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-47-52_Settings-Core.md | 47-52 | TenantSettings, tenant OneToOne, theme, prefixes, tax rate |
| 02 | 02_Tasks-53-58_Text-JSON-Signal.md | 53-58 | Footer texts, JSON settings fields, auto-create signal |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 47 | Create TenantSettings Model | Task 16 | Medium |
| 48 | Add Tenant OneToOne | Task 47 | Simple |
| 49 | Add Theme Color Field | Task 47 | Simple |
| 50 | Add Invoice Prefix Field | Task 47 | Simple |
| 51 | Add Order Prefix Field | Task 47 | Simple |
| 52 | Add Tax Rate Field | Task 47 | Simple |
| 53 | Add Invoice Footer Field | Task 47 | Simple |
| 54 | Add Receipt Footer Field | Task 47 | Simple |
| 55 | Add Notification Settings | Task 47 | Medium |
| 56 | Add Feature Settings | Task 47 | Medium |
| 57 | Add Integration Settings | Task 47 | Medium |
| 58 | Create Settings Signal | Task 47 | Medium |

---

## Execution Order

```
01_Tasks-47-52_Settings-Core.md
        │
        ▼
02_Tasks-53-58_Text-JSON-Signal.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        ├── models/
        │   └── settings.py      # TenantSettings model
        └── signals.py           # Auto-create signal
```

---

## Default Settings Values

| Field | Default |
|-------|---------|
| theme_color | #1E40AF (blue) |
| invoice_prefix | INV |
| order_prefix | ORD |
| tax_rate | 0.00 |
| invoice_footer | (blank) |
| receipt_footer | Thank you for your purchase! |

---

## JSON Settings Structure

```python
# notification_settings default
{
    "email_on_order": True,
    "email_on_payment": True,
    "sms_enabled": False,
    "low_stock_alert": True
}

# feature_settings default
{
    "webstore_enabled": True,
    "pos_enabled": True,
    "multi_location": False,
    "advanced_reports": False
}

# integration_settings default
{
    "payment_gateway": None,
    "accounting_software": None,
    "shipping_provider": None
}
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete (Domain model exists)
2. **OneToOne:** Ensures one settings per tenant
3. **Signal:** Use post_save on Tenant to auto-create
4. **JSONField:** Use Django's native JSONField
5. **Defaults:** Provide sensible defaults for all fields
6. **Git Commit:** Commit after completing this group

