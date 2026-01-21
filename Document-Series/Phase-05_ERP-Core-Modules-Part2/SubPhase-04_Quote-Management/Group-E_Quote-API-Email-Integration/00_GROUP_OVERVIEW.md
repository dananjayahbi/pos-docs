# Group E: Quote API & Email Integration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Create API endpoints and email delivery for quotes

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Quote PDF Generation](../Group-D_Quote-PDF-Generation/)
- **→ Next Group:** [Group F: Testing & Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **QuoteSerializer** - DRF serializer with nested line items
2. **QuoteLineItemSerializer** - Serializer for line items with validation
3. **QuoteListSerializer** - Lightweight list serializer
4. **QuoteViewSet** - ViewSet with CRUD and custom actions
5. **Quote Filtering** - Filter by status, customer, date, creator
6. **Quote Search** - Search by quote_number, customer name, title
7. **Quote Status Actions** - send, accept, reject, convert actions
8. **QuoteEmailService** - Email sending with PDF attachment
9. **Quote Email Template** - HTML email template
10. **Email Sending Endpoint** - API endpoint for email
11. **Celery Email Task** - Async email with retry
12. **Quote Public View** - Unauthenticated customer view
13. **Accept/Reject Actions** - Customer actions from public view
14. **API URL Registration** - Register all endpoints

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers and viewsets |
| django-filter | Quote filtering |
| Celery | Async email tasks |
| JWT/Token | Public view authentication |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-69-75_Serializers-ViewSet-Actions.md` | 69-75 | Serializers, ViewSet, filtering, search, status actions |
| 02 | `02_Tasks-76-82_Email-Public-URLs.md` | 76-82 | Email service, template, endpoints, Celery, public view, accept/reject, URLs |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create QuoteSerializer | Medium | 25 min |
| 70 | Create QuoteLineItemSerializer | Medium | 25 min |
| 71 | Create QuoteListSerializer | Low | 20 min |
| 72 | Create QuoteViewSet | High | 30 min |
| 73 | Implement Quote Filtering | Medium | 25 min |
| 74 | Implement Quote Search | Medium | 25 min |
| 75 | Add Quote Status Actions | High | 30 min |
| 76 | Create QuoteEmailService | Medium | 25 min |
| 77 | Create Quote Email Template | Medium | 25 min |
| 78 | Implement Email Sending Endpoint | Medium | 25 min |
| 79 | Create Celery Task for Email | Medium | 25 min |
| 80 | Implement Quote Public View | Medium | 30 min |
| 81 | Add Quote Accept/Reject Actions | Medium | 25 min |
| 82 | Register Quote API URLs | Low | 20 min |

---

## Execution Order

```
[Tasks 69-71: Serializers]
         │
         ▼
[Tasks 72-75: ViewSet with filtering and actions]
         │
         ▼
[Tasks 76-79: Email service, template, endpoint, Celery]
         │
         ▼
[Tasks 80-82: Public view, customer actions, URL registration]
```

---

## Expected Deliverables

```
apps/quotes/
├── serializers/
│   ├── __init__.py
│   ├── quote.py                  # Tasks 69, 71
│   └── line_item.py              # Task 70
├── views/
│   ├── __init__.py
│   ├── quote.py                  # Tasks 72-75
│   └── public.py                 # Tasks 80-81
├── services/
│   ├── __init__.py
│   └── email_service.py          # Task 76
├── templates/
│   └── quotes/
│       └── email.html            # Task 77
├── tasks/
│   ├── __init__.py
│   └── email.py                  # Task 79
├── filters.py                    # Task 73
└── urls.py                       # Task 82
```

---

## Notes for AI Agents

### API Endpoints
```
/api/v1/quotes/
├── GET /                         # List quotes
├── POST /                        # Create quote
├── GET /{id}/                    # Get quote detail
├── PUT /{id}/                    # Update quote
├── DELETE /{id}/                 # Delete quote (draft only)
├── POST /{id}/send/              # Send quote (Task 75)
├── POST /{id}/accept/            # Accept quote (Task 75)
├── POST /{id}/reject/            # Reject quote (Task 75)
├── POST /{id}/convert/           # Convert to order (Task 75)
├── POST /{id}/duplicate/         # Duplicate quote
├── POST /{id}/email/             # Send email (Task 78)
└── GET /{id}/pdf/                # Download PDF

/api/v1/quotes/public/
├── GET /{token}/                 # Public view (Task 80)
├── POST /{token}/accept/         # Customer accept (Task 81)
└── POST /{token}/reject/         # Customer reject (Task 81)
```

### QuoteSerializer Fields
- id, quote_number, status, title
- customer (nested or ID)
- guest_name, guest_email, guest_phone
- issue_date, valid_until
- line_items (nested QuoteLineItemSerializer)
- subtotal, discount_amount, tax_amount, total
- notes, terms_and_conditions
- pdf_url, created_at, updated_at

### Quote Filtering Options
```
GET /quotes/?status=SENT&customer=uuid&created_by=uuid
GET /quotes/?date_from=2026-01-01&date_to=2026-01-31
GET /quotes/?is_expired=true
```

### Quote Search Fields
- quote_number (exact, starts with)
- customer__name (contains)
- title (contains)
- guest_name (contains)

### Email Template Sections
- Subject: "Quotation {quote_number} from {business_name}"
- Greeting with customer name
- Quote summary (number, date, total)
- Call-to-action buttons (View, Accept, Reject)
- Attached PDF
- Footer with business contact

### Public View Token
```python
token = signing.dumps({
    'quote_id': quote.id,
    'email': quote.guest_email or quote.customer.email,
    'expires': quote.valid_until.isoformat()
})
```

### Celery Email Task
```python
@shared_task(bind=True, max_retries=3)
def send_quote_email(self, quote_id, recipient_email):
    try:
        # Send email with PDF attachment
    except Exception as exc:
        self.retry(exc=exc, countdown=60 * (self.request.retries + 1))
```
