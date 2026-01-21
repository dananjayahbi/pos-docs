# Group E: Receipt API & Storage

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** E of F  
> **Tasks Covered:** 69-78  
> **Group Goal:** Create API endpoints for receipt operations and storage

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: PDF & Email Receipts](../Group-D_PDF-Email-Receipts/)
- **→ Next Group:** [Group F: Testing & Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **ReceiptSerializer** - Serializer with receipt data and download URLs
2. **ReceiptTemplateSerializer** - Serializer for template configuration
3. **ReceiptViewSet** - ViewSet for receipt retrieval and reprint
4. **Generate Receipt Endpoint** - POST to generate receipt from transaction
5. **Print Receipt Endpoint** - POST to trigger print job
6. **Email Receipt Endpoint** - POST to send receipt email
7. **Download PDF Endpoint** - GET to download PDF receipt
8. **ReceiptTemplateViewSet** - ViewSet for template management
9. **Receipt Search Endpoint** - Search by date, customer, amount
10. **Receipt Export** - Export receipts for accounting integration

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers and viewsets |
| File Response | PDF download endpoint |
| Celery | Async email/print tasks |
| CSV/Excel Export | Accounting exports |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-69-72_Serializers-ViewSet-Generate.md` | 69-72 | ReceiptSerializer, ReceiptTemplateSerializer, ViewSet, generate endpoint |
| 02 | `02_Tasks-73-78_Actions-Search-Export.md` | 73-78 | Print, email, PDF endpoints, template ViewSet, search, export |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create ReceiptSerializer | Medium | 25 min |
| 70 | Create ReceiptTemplateSerializer | Medium | 25 min |
| 71 | Create ReceiptViewSet | Medium | 30 min |
| 72 | Add generate receipt endpoint | Medium | 25 min |
| 73 | Add print receipt endpoint | Medium | 25 min |
| 74 | Add email receipt endpoint | Medium | 20 min |
| 75 | Add download PDF endpoint | Medium | 20 min |
| 76 | Create ReceiptTemplateViewSet | Medium | 25 min |
| 77 | Add receipt search endpoint | Medium | 25 min |
| 78 | Create receipt export | Medium | 25 min |

---

## Execution Order

```
[Tasks 69-70: Serializers]
         │
         ▼
[Tasks 71-72: ReceiptViewSet with generate endpoint]
         │
         ▼
[Tasks 73-75: Print, email, PDF endpoints]
         │
         ▼
[Tasks 76-78: Template ViewSet, search, export]
```

---

## Expected Deliverables

```
apps/pos/receipts/
├── serializers/
│   ├── __init__.py
│   ├── receipt.py                # Task 69
│   └── template.py               # Task 70
├── views/
│   ├── __init__.py
│   ├── receipt.py                # Tasks 71-75, 77
│   ├── template.py               # Task 76
│   └── export.py                 # Task 78
└── urls.py                       # URL configuration
```

---

## Notes for AI Agents

### API Endpoints
```
/api/v1/pos/receipts/
├── GET /                         # List receipts
├── GET /{id}/                    # Get receipt detail
├── POST /transactions/{id}/receipt/  # Generate receipt (Task 72)
├── POST /{id}/print/             # Trigger print (Task 73)
├── POST /{id}/email/             # Send email (Task 74)
├── GET /{id}/pdf/                # Download PDF (Task 75)
├── GET /search/                  # Search receipts (Task 77)
└── GET /export/                  # Export receipts (Task 78)

/api/v1/pos/receipt-templates/
├── GET /                         # List templates
├── POST /                        # Create template
├── GET /{id}/                    # Get template
├── PUT /{id}/                    # Update template
├── DELETE /{id}/                 # Delete template
└── POST /{id}/set-default/       # Set as default
```

### ReceiptSerializer Fields
```python
class ReceiptSerializer(serializers.ModelSerializer):
    receipt_number = serializers.CharField(read_only=True)
    receipt_type = serializers.CharField()
    generated_at = serializers.DateTimeField(read_only=True)
    receipt_data = serializers.JSONField()
    pdf_url = serializers.SerializerMethodField()
    email_url = serializers.SerializerMethodField()
    print_url = serializers.SerializerMethodField()
```

### Generate Receipt Request
```json
POST /transactions/{transaction_id}/receipt/
{
    "template_id": "uuid",  // Optional, use default if not provided
    "receipt_type": "SALE",
    "auto_print": true,
    "email_to": "customer@email.com"  // Optional
}
```

### Print Receipt Request
```json
POST /receipts/{id}/print/
{
    "printer_id": "uuid",
    "copies": 1
}
```

### Email Receipt Request
```json
POST /receipts/{id}/email/
{
    "email": "customer@email.com",
    "attach_pdf": true,
    "custom_message": "Thank you for your purchase!"
}
```

### Receipt Search Parameters
```
GET /receipts/search/?
    date_from=2024-01-01&
    date_to=2024-01-31&
    customer_id=uuid&
    amount_min=1000&
    amount_max=5000&
    receipt_type=SALE&
    terminal_id=uuid
```

### Receipt Export Formats
| Format | Content Type | Use Case |
|--------|--------------|----------|
| CSV | text/csv | Spreadsheet import |
| XLSX | application/vnd.openxmlformats | Excel |
| JSON | application/json | API integration |

### Export Columns
- receipt_number
- date
- time
- customer_name
- items_count
- subtotal
- tax_amount
- total
- payment_method
- cashier
- terminal
