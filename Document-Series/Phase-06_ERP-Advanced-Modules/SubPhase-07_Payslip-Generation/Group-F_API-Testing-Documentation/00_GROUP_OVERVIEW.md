# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** F of F  
> **Tasks Covered:** 79-88  
> **Group Goal:** Create admin API endpoints, tests, and documentation

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Employee Self-Service](../Group-E_Employee-Self-Service/)

---

## Group Overview

### Key Outcomes

1. **Admin Payslip ViewSet** - Admin API for management
2. **Generate Single Endpoint** - POST to generate one
3. **Bulk Generate Endpoint** - POST for batch generation
4. **Send Email Endpoint** - POST to send email
5. **Bulk Send Email Endpoint** - POST for batch emails
6. **Generation Status Endpoint** - GET progress
7. **Payslip Model Tests** - Unit tests
8. **PDF Generation Tests** - Test PDF output
9. **Email Distribution Tests** - Test with mocks
10. **Payslip API Documentation** - Document endpoints

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | Admin API |
| pytest | Testing framework |
| Mock | Email testing |
| OpenAPI | API documentation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-79-84_Admin-API.md` | 79-84 | Admin ViewSet, endpoints |
| 02 | `02_Tasks-85-88_Tests-Documentation.md` | 85-88 | Tests, API documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Admin Payslip ViewSet | High | 30 min |
| 80 | Add Generate Single Endpoint | Medium | 20 min |
| 81 | Add Bulk Generate Endpoint | Medium | 25 min |
| 82 | Add Send Email Endpoint | Medium | 20 min |
| 83 | Add Bulk Send Email Endpoint | Medium | 25 min |
| 84 | Add Generation Status Endpoint | Medium | 20 min |
| 85 | Write Payslip Model Tests | High | 35 min |
| 86 | Write PDF Generation Tests | High | 35 min |
| 87 | Write Email Distribution Tests | Medium | 30 min |
| 88 | Create Payslip API Documentation | Medium | 30 min |

---

## Execution Order

```
[Tasks 79-84: Admin ViewSet, endpoints]
         │
         ▼
[Tasks 85-88: Tests, documentation]
```

---

## Expected Deliverables

```
apps/payslip/
├── views/
│   └── admin.py                  # Tasks 79-84
├── tests/
│   ├── __init__.py
│   ├── test_models.py            # Task 85
│   ├── test_generator.py         # Task 86
│   ├── test_emailer.py           # Task 87
│   └── test_api.py               # Tasks 85-87
└── docs/
    └── README.md                 # Task 88
```

---

## Notes for AI Agents

### Payslip Admin API Endpoints
```
/api/v1/payslip/admin/
├── GET /payslips/                # List all payslips
├── GET /payslips/{id}/           # Get payslip detail
├── POST /payslips/{id}/generate/ # Generate single PDF
├── POST /payslips/{id}/send/     # Send email
├── POST /generate-bulk/          # Bulk generate
├── POST /send-bulk/              # Bulk send emails
├── GET /batches/                 # List batches
├── GET /batches/{id}/            # Batch detail
├── GET /batches/{id}/status/     # Batch progress
└── GET /templates/               # Template settings
    PUT /templates/               # Update template
```

### Generate Single Endpoint
```
POST /api/v1/payslip/admin/payslips/{id}/generate/

Request: (empty body)

Response:
{
  "success": true,
  "payslip_id": "uuid",
  "slip_number": "PAY-2026-01-001",
  "pdf_url": "/media/payslips/.../PAY-2026-01-001.pdf",
  "generated_at": "2026-01-20T10:00:00Z"
}
```

### Bulk Generate Endpoint
```
POST /api/v1/payslip/admin/generate-bulk/

Request:
{
  "period_id": "uuid"
}

Response:
{
  "batch_id": "uuid",
  "total_count": 50,
  "status": "PROCESSING",
  "message": "Bulk generation started"
}
```

### Send Email Endpoint
```
POST /api/v1/payslip/admin/payslips/{id}/send/

Request: (empty body)

Response:
{
  "success": true,
  "payslip_id": "uuid",
  "sent_to": "john.doe@email.com",
  "sent_at": "2026-01-20T11:00:00Z"
}
```

### Bulk Send Email Endpoint
```
POST /api/v1/payslip/admin/send-bulk/

Request:
{
  "period_id": "uuid",
  "filter": "unsent"  // optional: all, unsent, failed
}

Response:
{
  "batch_id": "uuid",
  "total_count": 45,
  "status": "PROCESSING",
  "message": "Bulk email distribution started"
}
```

### Generation Status Endpoint
```
GET /api/v1/payslip/admin/batches/{id}/status/

Response:
{
  "batch_id": "uuid",
  "batch_type": "GENERATION",
  "status": "PROCESSING",
  "progress": {
    "total": 50,
    "processed": 35,
    "success": 33,
    "failed": 2,
    "percentage": 70
  },
  "started_at": "2026-01-20T10:00:00Z",
  "estimated_completion": "2026-01-20T10:05:00Z"
}
```

### Test Categories
| Category | Tests |
|----------|-------|
| Model Tests | Payslip creation, number generation, status flow |
| Generator Tests | PDF validity, template rendering, storage |
| Emailer Tests | Email sending (mocked), attachments, throttling |
| API Tests | All endpoints, permissions |
| Integration Tests | End-to-end generation and distribution |

### Model Test Cases
- Payslip number auto-generation
- Unique constraint (employee, period)
- Status transitions
- View/download tracking
- Relationship to EmployeePayroll

### PDF Generation Test Cases
- Valid PDF output (check magic bytes)
- All sections rendered
- Currency formatting correct
- YTD calculations accurate
- Template customization applied

### Email Test Cases
- Email content correct
- PDF attached
- Subject template rendered
- Throttling respected
- Status updated on send

### Mock Email Setup
```python
@pytest.fixture
def mock_email():
    with patch('django.core.mail.EmailMessage.send') as mock:
        yield mock

def test_send_payslip_email(mock_email, payslip):
    emailer = PayslipEmailer(payslip.tenant)
    result = emailer.send_single(payslip.id)
    
    assert result is True
    assert mock_email.called
    assert payslip.email_sent is True
```

### Documentation Sections
1. **Overview** - Module introduction
2. **Models** - Payslip, line items, template
3. **PDF Generation** - WeasyPrint, template design
4. **Bulk Generation** - Celery tasks, progress
5. **Email Distribution** - Email service, throttling
6. **Employee Self-Service** - My payslips API
7. **Admin API** - Management endpoints
8. **Configuration** - Template settings
9. **Testing** - Test coverage
10. **Troubleshooting** - Common issues
