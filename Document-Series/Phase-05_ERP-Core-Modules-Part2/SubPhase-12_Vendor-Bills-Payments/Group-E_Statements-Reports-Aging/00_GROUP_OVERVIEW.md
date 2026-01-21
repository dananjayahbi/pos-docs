# Group E: Statements, Reports & Aging

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement vendor statements, bill aging, and payment reports

---

## Navigation

- **↑ Parent:** [SubPhase-12 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Payment Recording & Scheduling](../Group-D_Payment-Recording-Scheduling/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **VendorStatementService** - Service for generating vendor statements
2. **Statement Data Aggregation** - Aggregate bills, payments, balance
3. **Statement PDF Generator** - Generate PDF vendor statement
4. **Statement Email Template** - HTML email template for statements
5. **Statement Email Celery Task** - Async email sending
6. **BillAgingService** - Service for aging report calculations
7. **Aging Buckets** - Calculate 0-30, 31-60, 61-90, 90+ days
8. **Aging Report Generator** - Generate detailed aging report
9. **Overdue Bill Alert** - Celery task for overdue notifications
10. **PaymentHistoryService** - Service for payment history queries
11. **Vendor Payment Summary** - Total paid per vendor, per period
12. **Accounts Payable Summary** - Total outstanding, due this week/month
13. **Report Export Service** - Export reports to Excel/CSV
14. **Payments Dashboard Data** - Aggregate data for dashboard widgets

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Report generation |
| ReportLab/WeasyPrint | PDF statements |
| Celery | Async emails, alerts |
| openpyxl | Excel export |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-67-71_Statement-Service.md` | 67-71 | VendorStatementService, PDF, email template, Celery task |
| 02 | `02_Tasks-72-75_Aging-Service.md` | 72-75 | BillAgingService, buckets, report, overdue alerts |
| 03 | `03_Tasks-76-80_Payment-History-Dashboard.md` | 76-80 | PaymentHistoryService, summaries, export, dashboard |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create VendorStatementService | High | 30 min |
| 68 | Implement Statement Data Aggregation | Medium | 25 min |
| 69 | Implement Statement PDF Generator | High | 35 min |
| 70 | Create Statement Email Template | Medium | 25 min |
| 71 | Implement Statement Email Celery Task | Medium | 25 min |
| 72 | Create BillAgingService | High | 30 min |
| 73 | Implement Aging Buckets | Medium | 25 min |
| 74 | Implement Aging Report Generator | Medium | 25 min |
| 75 | Implement Overdue Bill Alert | Medium | 25 min |
| 76 | Create PaymentHistoryService | Medium | 25 min |
| 77 | Implement Vendor Payment Summary | Medium | 25 min |
| 78 | Implement Accounts Payable Summary | Medium | 25 min |
| 79 | Create Report Export Service | Medium | 25 min |
| 80 | Create Payments Dashboard Data | Medium | 25 min |

---

## Execution Order

```
[Tasks 67-71: Vendor statement service]
         │
         ▼
[Tasks 72-75: Bill aging service]
         │
         ▼
[Tasks 76-80: Payment history, export, dashboard]
```

---

## Expected Deliverables

```
apps/vendor_bills/
├── services/
│   ├── __init__.py
│   ├── statement_service.py      # Tasks 67-69
│   ├── aging_service.py          # Tasks 72-74
│   ├── payment_history_service.py # Tasks 76-78
│   └── export_service.py         # Task 79
├── templates/
│   └── email/
│       ├── vendor_statement.html # Task 70
│       └── overdue_alert.html
├── tasks/
│   ├── __init__.py
│   ├── email_tasks.py            # Task 71
│   └── aging_tasks.py            # Task 75
└── dashboard/
    └── widgets.py                # Task 80
```

---

## Notes for AI Agents

### VendorStatementService Methods
- generate_statement(vendor_id, date_from, date_to)
- get_statement_data(vendor_id, date_from, date_to)
- generate_pdf(vendor_id, date_from, date_to) → bytes
- email_statement(vendor_id, date_from, date_to)

### Vendor Statement Structure
```
┌─────────────────────────────────────────────────────────────┐
│                  VENDOR STATEMENT                            │
│                  [Company Logo]                              │
├─────────────────────────────────────────────────────────────┤
│ To: ABC Electronics                Statement Date: 2026-01-31│
│ Period: 2026-01-01 to 2026-01-31   Account #: VND-001       │
├─────────────────────────────────────────────────────────────┤
│ Date       | Description          | Debit    | Credit | Bal │
├─────────────────────────────────────────────────────────────┤
│ 2026-01-01 | Opening Balance      |          |        |50000│
│ 2026-01-05 | BILL-2026-00001      | 150,000  |        |200K │
│ 2026-01-10 | PAY-2026-00001       |          | 50,000 |150K │
│ 2026-01-15 | BILL-2026-00025      | 75,000   |        |225K │
│ 2026-01-25 | PAY-2026-00010       |          | 100,000|125K │
├─────────────────────────────────────────────────────────────┤
│            | Closing Balance      |          |        |125K │
├─────────────────────────────────────────────────────────────┤
│ Summary: Total Billed: Rs.225,000 | Total Paid: Rs.150,000  │
└─────────────────────────────────────────────────────────────┘
```

### BillAgingService Methods
- get_aging_report(vendor_id=None)
- get_aging_buckets(vendor_id)
- get_aging_summary()
- get_overdue_bills()

### Aging Buckets
| Bucket | Days | Calculation |
|--------|------|-------------|
| Current | 0-30 | due_date >= today - 30 days |
| 31-60 Days | 31-60 | due_date between 31-60 days ago |
| 61-90 Days | 61-90 | due_date between 61-90 days ago |
| Over 90 Days | 90+ | due_date > 90 days ago |

### Aging Report Structure
```json
{
  "generated_at": "2026-01-31",
  "summary": {
    "total_outstanding": 500000,
    "current": 200000,
    "days_31_60": 150000,
    "days_61_90": 100000,
    "over_90": 50000
  },
  "by_vendor": [
    {
      "vendor": "ABC Electronics",
      "total": 200000,
      "current": 100000,
      "days_31_60": 50000,
      "days_61_90": 30000,
      "over_90": 20000,
      "bills": [...]
    }
  ]
}
```

### Overdue Alert Schedule
| Days Overdue | Alert Type |
|--------------|------------|
| 1 day | First overdue notice |
| 7 days | Second overdue notice |
| 14 days | Escalation to manager |
| 30 days | Critical alert |

### Accounts Payable Summary
```json
{
  "total_outstanding": 1500000,
  "due_today": 100000,
  "due_this_week": 250000,
  "due_this_month": 500000,
  "overdue": 200000,
  "total_vendors": 45,
  "vendors_with_overdue": 5
}
```

### Dashboard Widgets
| Widget | Data |
|--------|------|
| Total Payables | Sum of all outstanding bills |
| Due This Week | Bills due in next 7 days |
| Overdue Bills | Bills past due date |
| Recent Payments | Last 10 payments |
| Aging Pie Chart | Distribution by aging bucket |
| Top Vendors | Vendors with highest payables |

### Export Formats
- **Excel**: .xlsx with formatting
- **CSV**: .csv for data import
- **PDF**: Statement/report format
