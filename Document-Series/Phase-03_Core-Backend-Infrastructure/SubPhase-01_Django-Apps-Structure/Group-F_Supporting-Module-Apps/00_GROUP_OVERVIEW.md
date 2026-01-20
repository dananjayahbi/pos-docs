# Group F: Supporting Module Apps

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** F of G  
> **Tasks Covered:** 65-78  
> **Group Goal:** Create supporting module apps (vendors, HR, accounting, webstore, reports)

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Sales-Customer-Apps/](../Group-E_Sales-Customer-Apps/)
- **→ Next Group:** [../Group-G_Integration-Configuration/](../Group-G_Integration-Configuration/)

---

## Group Overview

This group creates the supporting module apps: vendors (supplier management), hr (HR & payroll), accounting (financial management), webstore (e-commerce API), and reports (analytics).

### Key Outcomes
- Create vendors app with structure
- Register vendors in TENANT_APPS
- Create hr app with structure
- Register hr in TENANT_APPS
- Create accounting app with structure
- Register accounting in TENANT_APPS
- Create webstore app with structure
- Register webstore in TENANT_APPS
- Create reports app with structure
- Register reports in TENANT_APPS

### Technology Context
- **Vendors:** Supplier, PurchaseOrder models
- **HR:** Employee, Payroll, Attendance models
- **Accounting:** Account, Journal, Transaction models
- **Webstore:** Cart, Wishlist, WebOrder models
- **Reports:** ReportTemplate, GeneratedReport models

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-65-70_Vendors-HR-Apps.md | 65-70 | Vendors app, HR app, register both |
| 02 | 02_Tasks-71-76_Accounting-Webstore-Apps.md | 71-76 | Accounting app, webstore app, register both |
| 03 | 03_Tasks-77-78_Reports-App.md | 77-78 | Reports app, register |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 65 | Create vendors App | Task 64 | Simple |
| 66 | Create vendors Structure | Task 65 | Simple |
| 67 | Register vendors in Settings | Task 66 | Simple |
| 68 | Create hr App | Task 67 | Simple |
| 69 | Create hr Structure | Task 68 | Simple |
| 70 | Register hr in Settings | Task 69 | Simple |
| 71 | Create accounting App | Task 70 | Simple |
| 72 | Create accounting Structure | Task 71 | Simple |
| 73 | Register accounting in Settings | Task 72 | Simple |
| 74 | Create webstore App | Task 73 | Simple |
| 75 | Create webstore Structure | Task 74 | Simple |
| 76 | Register webstore in Settings | Task 75 | Simple |
| 77 | Create reports App | Task 76 | Simple |
| 78 | Register reports in Settings | Task 77 | Simple |

---

## Execution Order

```
01_Tasks-65-70_Vendors-HR-Apps.md
        │
        ▼
02_Tasks-71-76_Accounting-Webstore-Apps.md
        │
        ▼
03_Tasks-77-78_Reports-App.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/
├── vendors/
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py
│   ├── admin.py
│   ├── urls.py
│   └── tests/
├── hr/
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py
│   ├── admin.py
│   ├── urls.py
│   └── tests/
├── accounting/
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py
│   ├── admin.py
│   ├── urls.py
│   └── tests/
├── webstore/
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py
│   ├── admin.py
│   ├── urls.py
│   └── tests/
└── reports/
    ├── __init__.py
    ├── apps.py
    ├── models.py
    ├── admin.py
    ├── urls.py
    └── tests/
```

---

## App Purposes

| App | Purpose | Key Models |
|-----|---------|------------|
| vendors | Supplier management | Vendor, PurchaseOrder, GRN |
| hr | HR & Payroll | Employee, Salary, Attendance |
| accounting | Financial management | Account, JournalEntry, Transaction |
| webstore | E-commerce frontend | Cart, Wishlist, WebOrder |
| reports | Analytics & reporting | ReportTemplate, ScheduledReport |

---

## Sri Lankan Context

- **HR App:** EPF/ETF calculations, local labor laws
- **Accounting App:** Sri Lankan chart of accounts
- **Reports App:** Statutory reporting requirements

---

## Notes for AI Agents

1. **Dependencies:** Requires Group E complete
2. **Batch Creation:** Create multiple apps in this group
3. **Same Structure:** All apps follow same structure
4. **TENANT_APPS:** All are per-tenant apps
5. **Placeholders:** No model code yet
6. **Git Commit:** Commit after completing this group

