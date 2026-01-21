# Group D: Bulk Generation & Email

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** D of F  
> **Tasks Covered:** 49-64  
> **Group Goal:** Implement bulk generation with Celery and email distribution

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: PDF Generation Engine](../Group-C_PDF-Generation-Engine/)
- **→ Next Group:** [Group E: Employee Self-Service](../Group-E_Employee-Self-Service/)

---

## Group Overview

### Key Outcomes

1. **Bulk Generation Celery Task** - Batch generation task
2. **Period-Based Generation** - Generate all for period
3. **Generation Progress Tracking** - Track via Redis
4. **Generation Error Handling** - Handle failures gracefully
5. **PayslipBatch Model** - Track bulk batches
6. **Batch Status Fields** - total, success, failed counts
7. **Batch Timing Fields** - started_at, completed_at
8. **Batch Migrations** - Apply migrations
9. **Email Template** - HTML email template
10. **Email Subject Configuration** - Tenant-configurable
11. **PayslipEmailer Service** - Email distribution service
12. **Send Single Email Method** - Email with attachment
13. **Bulk Email Celery Task** - Batch email sending
14. **Email Throttling** - Rate limit sending
15. **Email Status Tracking** - Update Payslip.email_sent
16. **Email Failure Handling** - Log and retry

### Technology Context

| Technology | Purpose |
|------------|---------|
| Celery | Async batch processing |
| Redis | Progress tracking |
| Django Email | Email with attachments |
| SMTP | Email delivery |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-49-56_Bulk-Generation.md` | 49-56 | Celery task, batch model |
| 02 | `02_Tasks-57-64_Email-Distribution.md` | 57-64 | Email template, emailer service |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create Bulk Generation Celery Task | High | 35 min |
| 50 | Add Period-Based Generation | Medium | 25 min |
| 51 | Add Generation Progress Tracking | Medium | 25 min |
| 52 | Add Generation Error Handling | Medium | 20 min |
| 53 | Create PayslipBatch Model | Medium | 25 min |
| 54 | Add Batch Status Fields | Low | 15 min |
| 55 | Add Batch Timing Fields | Low | 15 min |
| 56 | Run Batch Migrations | Low | 15 min |
| 57 | Create Email Template | Medium | 25 min |
| 58 | Add Email Subject Configuration | Low | 15 min |
| 59 | Create PayslipEmailer Service | High | 30 min |
| 60 | Add Send Single Email Method | Medium | 25 min |
| 61 | Add Bulk Email Celery Task | High | 30 min |
| 62 | Add Email Throttling | Medium | 20 min |
| 63 | Add Email Status Tracking | Low | 15 min |
| 64 | Add Email Failure Handling | Medium | 20 min |

---

## Execution Order

```
[Tasks 49-56: Bulk generation, batch model]
         │
         ▼
[Tasks 57-64: Email template, emailer service]
```

---

## Expected Deliverables

```
apps/payslip/
├── models/
│   └── payslip_batch.py          # Tasks 53-55
├── services/
│   └── emailer.py                # Tasks 59-60
├── templates/
│   └── payslip/
│       └── email_template.html   # Task 57
├── tasks.py                      # Tasks 49-52, 61-64
└── migrations/
    └── 0004_payslip_batch.py     # Task 56
```

---

## Notes for AI Agents

### Bulk Generation Celery Task
```
@shared_task(bind=True)
def generate_payslips_bulk(self, period_id, batch_id):
    # Get all employee payrolls for period
    # For each employee:
    #   - Create or get Payslip record
    #   - Generate PDF
    #   - Save to storage
    #   - Update progress
    # Finalize batch
```

### Period-Based Generation
```
Generate all payslips for a payroll period:
1. Get finalized PayrollRun for period
2. Get all EmployeePayroll records
3. Create PayslipBatch record
4. Start Celery task
5. Return batch_id for tracking
```

### Progress Tracking
```
Redis key: payslip_batch:{batch_id}
Value: {
  "total": 50,
  "processed": 35,
  "success": 33,
  "failed": 2,
  "current": "EMP-0036",
  "percentage": 70
}
```

### PayslipBatch Model Fields
- tenant: FK to Client
- payroll_period: FK to PayrollPeriod
- batch_type: Choice (GENERATION, EMAIL)
- status: Choice (PENDING, PROCESSING, COMPLETED, FAILED)
- total_count: Integer
- success_count: Integer
- failed_count: Integer
- started_at: DateTimeField
- completed_at: DateTimeField (nullable)
- initiated_by: FK to User
- error_log: JSONField

### Batch Status Flow
```
PENDING → PROCESSING → COMPLETED
                    ↘ FAILED (if all fail)
```

### Error Log JSON
```json
{
  "errors": [
    {
      "employee_id": "EMP-0025",
      "error": "File storage error",
      "timestamp": "2026-01-20T10:05:00Z"
    },
    {
      "employee_id": "EMP-0042",
      "error": "Template render error",
      "timestamp": "2026-01-20T10:07:00Z"
    }
  ]
}
```

### Email Template HTML
```html
<h2>Your Payslip for {{ period_name }}</h2>
<p>Dear {{ employee_name }},</p>
<p>Your payslip for {{ period_name }} is attached.</p>
<table>
  <tr><td>Net Salary:</td><td>LKR {{ net_salary }}</td></tr>
  <tr><td>Pay Date:</td><td>{{ pay_date }}</td></tr>
</table>
<p>You can also view your payslip in the HR portal.</p>
<p>Regards,<br>{{ company_name }} HR</p>
```

### Email Subject Configuration
```
Default: "Your Payslip for {{ period_name }}"
Custom: Tenant can configure subject template

Variables:
- {{ period_name }}
- {{ employee_name }}
- {{ company_name }}
- {{ slip_number }}
```

### PayslipEmailer Service
```
PayslipEmailer:
├── __init__(tenant)
├── send_single(payslip_id) → bool
├── send_bulk(batch_id) → None (Celery)
├── _build_email(payslip) → EmailMessage
├── _attach_pdf(email, payslip) → None
└── _update_status(payslip, success) → None
```

### Email with PDF Attachment
```python
email = EmailMessage(
    subject=subject,
    body=html_body,
    from_email=settings.DEFAULT_FROM_EMAIL,
    to=[employee.work_email],
)
email.content_subtype = 'html'
email.attach(
    filename=f'{payslip.slip_number}.pdf',
    content=pdf_content,
    mimetype='application/pdf'
)
email.send()
```

### Email Throttling
```
Rate limiting strategy:
- Max 10 emails per second
- Max 500 emails per minute
- Use Celery rate_limit='10/s'

Prevents:
- SMTP server overload
- Blacklisting
- Delivery failures
```

### Email Status Tracking
```
On successful send:
- payslip.email_sent = True
- payslip.sent_at = timezone.now()
- payslip.sent_to = employee.work_email
- payslip.status = SENT

On failure:
- Log error to batch.error_log
- Mark for retry (max 3 attempts)
```

### Retry Mechanism
```
Celery retry configuration:
- max_retries=3
- retry_backoff=True
- retry_backoff_max=600 (10 minutes)
```
