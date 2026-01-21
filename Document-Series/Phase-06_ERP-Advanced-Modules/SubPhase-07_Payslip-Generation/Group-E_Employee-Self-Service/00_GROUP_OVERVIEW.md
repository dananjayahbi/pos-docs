# Group E: Employee Self-Service

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** E of F  
> **Tasks Covered:** 65-78  
> **Group Goal:** Implement admin configuration and employee self-service access

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Bulk Generation & Email](../Group-D_Bulk-Generation-Email/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **Payslip Admin Config** - Django admin configuration
2. **Admin List Display** - slip number, employee, period, status
3. **Admin Filters** - Filter by period, status, email_sent
4. **Admin Actions** - Generate PDF, Send Email actions
5. **PayslipSerializer** - DRF serializer
6. **Nested Earnings Serializer** - Include earnings
7. **Nested Deductions Serializer** - Include deductions
8. **Employee Payslip ViewSet** - Self-service ViewSet
9. **List My Payslips Action** - List employee's payslips
10. **View Payslip Detail** - Get with breakdown
11. **Download PDF Endpoint** - Stream PDF file
12. **View Tracking Logic** - Update first_viewed_at
13. **Download Tracking Logic** - Update download_count
14. **Payslip URL Routes** - Register URLs

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django Admin | Admin interface |
| DRF Serializers | API serialization |
| ViewSet | API views |
| FileResponse | PDF streaming |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-65-71_Admin-Serializers.md` | 65-71 | Admin config, serializers |
| 02 | `02_Tasks-72-78_ViewSet-Tracking-URLs.md` | 72-78 | Employee ViewSet, tracking, URLs |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create Payslip Admin Config | Medium | 25 min |
| 66 | Add Admin List Display | Low | 15 min |
| 67 | Add Admin Filters | Low | 15 min |
| 68 | Add Admin Actions | Medium | 25 min |
| 69 | Create PayslipSerializer | Medium | 25 min |
| 70 | Add Nested Earnings Serializer | Low | 15 min |
| 71 | Add Nested Deductions Serializer | Low | 15 min |
| 72 | Create Employee Payslip ViewSet | High | 30 min |
| 73 | Add List My Payslips Action | Medium | 20 min |
| 74 | Add View Payslip Detail | Medium | 20 min |
| 75 | Add Download PDF Endpoint | Medium | 25 min |
| 76 | Add View Tracking Logic | Low | 15 min |
| 77 | Add Download Tracking Logic | Low | 15 min |
| 78 | Add Payslip URL Routes | Low | 20 min |

---

## Execution Order

```
[Tasks 65-71: Admin, serializers]
         │
         ▼
[Tasks 72-78: ViewSet, tracking, URLs]
```

---

## Expected Deliverables

```
apps/payslip/
├── admin.py                      # Tasks 65-68
├── serializers/
│   ├── __init__.py
│   ├── payslip.py                # Task 69
│   └── payslip_line.py           # Tasks 70-71
├── views/
│   ├── __init__.py
│   └── employee.py               # Tasks 72-77
└── urls.py                       # Task 78
```

---

## Notes for AI Agents

### Django Admin Configuration
```python
@admin.register(Payslip)
class PayslipAdmin(admin.ModelAdmin):
    list_display = [
        'slip_number', 'employee', 'payroll_period',
        'status', 'email_sent', 'view_count', 'download_count'
    ]
    list_filter = ['status', 'payroll_period', 'email_sent']
    search_fields = ['slip_number', 'employee__name']
    readonly_fields = [
        'generated_at', 'generated_by', 
        'first_viewed_at', 'view_count'
    ]
    actions = ['generate_pdfs', 'send_emails']
```

### Admin Actions
```python
@admin.action(description='Generate PDFs for selected')
def generate_pdfs(self, request, queryset):
    for payslip in queryset:
        generator.save(payslip.id)
    self.message_user(request, f'{queryset.count()} PDFs generated')

@admin.action(description='Send emails for selected')
def send_emails(self, request, queryset):
    emailer.send_bulk([p.id for p in queryset])
    self.message_user(request, f'Emails queued for {queryset.count()} payslips')
```

### PayslipSerializer
```json
{
  "id": "uuid",
  "slip_number": "PAY-2026-01-001",
  "employee": {
    "id": "uuid",
    "name": "John Doe",
    "employee_id": "EMP-0001"
  },
  "period": {
    "name": "January 2026",
    "start_date": "2026-01-01",
    "end_date": "2026-01-31"
  },
  "status": "GENERATED",
  "generated_at": "2026-01-20T10:00:00Z",
  "email_sent": true,
  "sent_at": "2026-01-20T11:00:00Z",
  "earnings": [...],
  "deductions": [...],
  "summary": {
    "gross_salary": 193750,
    "total_deductions": 22500,
    "net_salary": 171250
  },
  "ytd": {
    "gross_ytd": 193750,
    "deductions_ytd": 22500,
    "net_ytd": 171250
  },
  "employer_contributions": [...],
  "pdf_available": true
}
```

### PayslipEarningSerializer
```json
{
  "component_code": "BASIC",
  "component_name": "Basic Salary",
  "amount": 150000,
  "ytd_amount": 150000,
  "display_order": 1
}
```

### Employee Self-Service ViewSet
```python
class EmployeePayslipViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return payslips for logged-in employee
        return Payslip.objects.filter(
            employee=self.request.user.employee
        ).order_by('-payroll_period__start_date')
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        # Stream PDF file
        pass
```

### List My Payslips Query
```
GET /api/v1/payslips/my/

Returns:
- All payslips for logged-in employee
- Ordered by period (newest first)
- Pagination supported
```

### View Payslip Detail
```
GET /api/v1/payslips/my/{id}/

Returns:
- Full payslip with earnings/deductions
- Updates view_count
- Sets first_viewed_at if first view
```

### Download PDF Endpoint
```
GET /api/v1/payslips/my/{id}/download/

Response:
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="PAY-2026-01-001.pdf"
- Binary PDF content

Updates:
- download_count += 1
- last_downloaded_at = now()
- status = DOWNLOADED (if first download)
```

### View Tracking Logic
```python
def track_view(payslip):
    payslip.view_count += 1
    if not payslip.first_viewed_at:
        payslip.first_viewed_at = timezone.now()
        if payslip.status == PayslipStatus.SENT:
            payslip.status = PayslipStatus.VIEWED
    payslip.save()
```

### Download Tracking Logic
```python
def track_download(payslip):
    payslip.download_count += 1
    payslip.last_downloaded_at = timezone.now()
    if payslip.status in [PayslipStatus.SENT, PayslipStatus.VIEWED]:
        payslip.status = PayslipStatus.DOWNLOADED
    payslip.save()
```

### URL Routes
```python
router = DefaultRouter()
router.register('my', EmployeePayslipViewSet, basename='my-payslips')

urlpatterns = [
    path('', include(router.urls)),
]
```

### Security - Employee Access Only
```
Employees can ONLY access their own payslips.

Validation in ViewSet:
- Filter queryset by request.user.employee
- 404 if trying to access other's payslip
- No direct ID guessing allowed
```
