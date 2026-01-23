# Tasks 73-78: Print, Email, PDF, Search, and Export Endpoints

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** E - Receipt API & Storage  
> **Document:** 02 of 02  
> **Tasks Covered:** 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-72_Serializers-ViewSet-Generate.md](01_Tasks-69-72_Serializers-ViewSet-Generate.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Document Overview

This document covers custom action endpoints for receipt operations including printing, emailing, PDF download, template management, search functionality, and data export capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Add print receipt endpoint | Medium | 25 min |
| 74 | Add email receipt endpoint | Medium | 20 min |
| 75 | Add download PDF endpoint | Medium | 20 min |
| 76 | Create ReceiptTemplateViewSet | Medium | 25 min |
| 77 | Add receipt search endpoint | Medium | 25 min |
| 78 | Create receipt export | Medium | 25 min |

---

## Task 73: Add Print Receipt Endpoint

### Overview
Create a custom action endpoint that queues a receipt for printing on a specific printer, handling print job creation and status tracking.

### Dependencies
- Task 71: ReceiptViewSet
- PrintJob model (Group C)
- Printer configuration

### Instructions

1. **Add print action decorator**
   - Add @action decorator with detail=True
   - Set methods=['post']
   - Set url_path='print'
   - Set permission_classes as needed

2. **Create print_receipt action method**
   - Define method in ReceiptViewSet
   - Accept request and pk parameters
   - Return Response with print job details

3. **Validate receipt exists**
   - Get receipt instance by pk
   - Check receipt belongs to current tenant
   - Raise 404 if not found
   - Check receipt has data to print

4. **Extract request parameters**
   - printer_id (optional UUID)
   - copies (optional integer, default 1)
   - priority (optional: LOW, NORMAL, HIGH)
   - auto_cut (optional boolean, default True)

5. **Validate copies parameter**
   - Must be integer between 1-10
   - Default to 1 if not provided
   - Raise validation error if out of range

6. **Resolve printer to use**
   - If printer_id provided, validate printer exists
   - Check printer belongs to tenant
   - If not provided, get default printer for terminal
   - Get terminal from request.user.current_terminal

7. **Validate printer status**
   - Check printer is_active flag
   - Check printer is_online status
   - Check printer has paper (if available)
   - Return warning if printer offline

8. **Get receipt PDF data**
   - Check if PDF already generated
   - If not, generate PDF on-the-fly
   - Use template for formatting
   - Store PDF bytes or path

9. **Create PrintJob instance**
   - Set job_type to 'RECEIPT'
   - Set document_content (PDF data)
   - Set copies count
   - Set priority level
   - Set status to 'QUEUED'
   - Link to receipt instance

10. **Queue print task via Celery**
    - Import print_receipt_task
    - Call task with receipt_id and job_id
    - Set task priority based on request
    - Don't wait for task completion

11. **Update receipt status**
    - Set is_printed to False initially
    - Will be updated when job completes
    - Track print_count (increment)
    - Record last_printed_at timestamp

12. **Handle printer offline scenario**
    - Still create print job
    - Set status to 'PENDING'
    - Will process when printer comes online
    - Return warning in response

13. **Track printing metrics**
    - Log print request event
    - Track printer usage
    - Record user who printed
    - Store printing timestamp

14. **Return response with job details**
    - Include print_job_id
    - Include job_status
    - Include printer info
    - Include estimated completion time

15. **Add error handling**
    - Handle printer not found
    - Handle invalid printer configuration
    - Handle PDF generation errors
    - Return appropriate status codes

### Print Endpoint

**URL:** `POST /api/v1/pos/receipts/{id}/print/`

**Request Body:**
```json
{
    "printer_id": "uuid-optional",
    "copies": 1,
    "priority": "NORMAL",
    "auto_cut": true
}
```

**Response (202 Accepted):**
```json
{
    "message": "Print job queued successfully",
    "print_job": {
        "job_id": "uuid",
        "job_number": "PJ-2024-0001",
        "status": "QUEUED",
        "printer": {
            "printer_id": "uuid",
            "printer_name": "POS Printer 01",
            "is_online": true
        },
        "copies": 1,
        "priority": "NORMAL",
        "created_at": "2024-01-15T14:30:00Z",
        "estimated_completion": "2024-01-15T14:30:30Z"
    },
    "receipt": {
        "receipt_number": "RCP-2024-0001",
        "print_count": 1
    }
}
```

### Printer Offline Response (202 Accepted)
```json
{
    "message": "Print job queued (printer offline)",
    "warning": "Printer is currently offline. Job will process when available.",
    "print_job": {
        "job_id": "uuid",
        "status": "PENDING",
        "printer": {
            "printer_id": "uuid",
            "printer_name": "POS Printer 01",
            "is_online": false,
            "last_seen": "2024-01-15T14:00:00Z"
        }
    }
}
```

### Error Scenarios

| Error | Status | Message |
|-------|--------|---------|
| Receipt not found | 404 | "Receipt not found" |
| Printer not found | 404 | "Printer not found" |
| Printer inactive | 400 | "Printer is not active" |
| Invalid copies | 400 | "Copies must be between 1 and 10" |
| No default printer | 400 | "No default printer configured for terminal" |
| PDF generation failed | 500 | "Failed to generate PDF for printing" |

### Expected Outcome
```
apps/pos/receipts/
├── views/
│   ├── __init__.py
│   └── receipt.py              # ReceiptViewSet with print action
```

### Verification Checklist
- [ ] Print action added to ReceiptViewSet
- [ ] Receipt validation working
- [ ] Printer resolution logic correct
- [ ] Copies validation implemented
- [ ] PrintJob creation working
- [ ] Celery task queued
- [ ] Offline printer handling correct
- [ ] Response includes job details
- [ ] Error handling comprehensive
- [ ] Metrics tracking working

---

## Task 74: Add Email Receipt Endpoint

### Overview
Create a custom action endpoint that sends a receipt via email to a customer, with optional PDF attachment and custom message.

### Dependencies
- Task 71: ReceiptViewSet
- Email service (Group D)
- Celery task queue

### Instructions

1. **Add email action decorator**
   - Add @action decorator with detail=True
   - Set methods=['post']
   - Set url_path='email'
   - Set permission_classes as needed

2. **Create email_receipt action method**
   - Define method in ReceiptViewSet
   - Accept request and pk parameters
   - Return Response with email task details

3. **Validate receipt exists**
   - Get receipt instance by pk
   - Check receipt belongs to current tenant
   - Raise 404 if not found
   - Verify receipt has customer data

4. **Extract request parameters**
   - email (required, email address)
   - attach_pdf (optional boolean, default True)
   - custom_message (optional string)
   - cc_emails (optional list of emails)
   - subject (optional string)

5. **Validate email address**
   - Check email format using EmailValidator
   - Allow multiple recipients if cc_emails provided
   - Validate all email addresses
   - Reject invalid formats

6. **Use customer email as default**
   - If email not provided in request
   - Use receipt.customer.email if available
   - Raise error if no email available

7. **Check tenant email configuration**
   - Verify SMTP settings configured
   - Check from_email set
   - Verify email service enabled
   - Return error if not configured

8. **Prepare email content**
   - Get email template (HTML)
   - Populate template with receipt data
   - Add business logo and branding
   - Format currency and dates

9. **Generate PDF attachment if requested**
   - Check attach_pdf parameter
   - Generate or retrieve PDF file
   - Attach PDF with proper filename
   - Handle generation errors

10. **Set email subject**
    - Use custom subject if provided
    - Default: "Your Receipt from {Business Name}"
    - Include receipt number in subject
    - Format professionally

11. **Add custom message to email body**
    - Include custom_message if provided
    - Add before receipt details
    - Sanitize HTML in custom message
    - Preserve line breaks

12. **Queue email task via Celery**
    - Import send_receipt_email_task
    - Pass receipt_id and email parameters
    - Set task priority
    - Don't wait for task completion

13. **Update receipt status**
    - Set is_emailed to False initially
    - Will be updated when email sent
    - Track email_count (increment)
    - Record last_emailed_at timestamp

14. **Handle email service unavailable**
    - Check service status
    - Queue for retry if unavailable
    - Return appropriate message
    - Log service errors

15. **Return response with task details**
    - Include task_id
    - Include recipient email
    - Include send status
    - Include retry info if queued

### Email Endpoint

**URL:** `POST /api/v1/pos/receipts/{id}/email/`

**Request Body:**
```json
{
    "email": "customer@example.com",
    "attach_pdf": true,
    "custom_message": "Thank you for your purchase!",
    "cc_emails": ["manager@store.com"],
    "subject": "Your Purchase Receipt"
}
```

**Response (202 Accepted):**
```json
{
    "message": "Email queued successfully",
    "email_task": {
        "task_id": "celery-task-uuid",
        "status": "QUEUED",
        "recipient": "customer@example.com",
        "cc_recipients": ["manager@store.com"],
        "has_attachment": true,
        "queued_at": "2024-01-15T14:30:00Z",
        "estimated_delivery": "2024-01-15T14:31:00Z"
    },
    "receipt": {
        "receipt_number": "RCP-2024-0001",
        "email_count": 1
    }
}
```

### Email Template Structure

**Plain Text Version:**
```
{Business Name}
{Business Address}
{Business Phone}

RECEIPT: {receipt_number}
Date: {date}
Time: {time}

{custom_message}

Items:
- {item_name} x {qty} @ {price} = {total}
...

Subtotal: {subtotal}
Tax: {tax}
Total: {total_amount}

Payment Method: {payment_method}
Amount Paid: {amount_paid}
Change: {change}

Thank you for your business!
```

**HTML Version:**
- Branded header with logo
- Styled receipt layout
- Button to download PDF
- Footer with business info
- Mobile-responsive design

### Error Scenarios

| Error | Status | Message |
|-------|--------|---------|
| Receipt not found | 404 | "Receipt not found" |
| No email provided | 400 | "Email address required" |
| Invalid email format | 400 | "Invalid email address" |
| No customer email | 400 | "No email address available for customer" |
| Email not configured | 400 | "Email service not configured" |
| PDF generation failed | 500 | "Failed to generate PDF attachment" |

### Expected Outcome
```
apps/pos/receipts/
├── views/
│   ├── __init__.py
│   └── receipt.py              # ReceiptViewSet with email action
```

### Verification Checklist
- [ ] Email action added to ReceiptViewSet
- [ ] Email validation working
- [ ] Customer email fallback working
- [ ] PDF attachment generation works
- [ ] Custom message included
- [ ] Email task queued
- [ ] Response includes task details
- [ ] Error handling comprehensive
- [ ] HTML email template formatted
- [ ] SMTP configuration checked

---

## Task 75: Add Download PDF Endpoint

### Overview
Create an endpoint that generates and returns a PDF file for a receipt, with proper content-type headers and filename handling.

### Dependencies
- Task 71: ReceiptViewSet
- PDF generation service (Group D)
- File storage system

### Instructions

1. **Add download action decorator**
   - Add @action decorator with detail=True
   - Set methods=['get']
   - Set url_path='pdf'
   - Set permission_classes as needed

2. **Create download_pdf action method**
   - Define method in ReceiptViewSet
   - Accept request and pk parameters
   - Return FileResponse with PDF

3. **Validate receipt exists**
   - Get receipt instance by pk
   - Check receipt belongs to current tenant
   - Raise 404 if not found
   - Verify receipt has data

4. **Check for existing PDF file**
   - Check if PDF already generated and stored
   - Verify file exists in storage
   - Check file is not corrupted
   - Use cached PDF if available

5. **Generate PDF if not exists**
   - Import ReceiptPDFGenerator
   - Instantiate with receipt instance
   - Call generate() method
   - Capture PDF bytes or file path

6. **Store generated PDF**
   - Save to file storage system
   - Use proper path structure
   - Set filename: {receipt_number}.pdf
   - Store file reference in database

7. **Set PDF filename**
   - Format: "{business_name}_Receipt_{receipt_number}.pdf"
   - Remove special characters
   - Ensure filename is filesystem-safe
   - Limit filename length

8. **Create FileResponse**
   - Import FileResponse from django.http
   - Pass file content or path
   - Set content_type to 'application/pdf'
   - Set as_attachment parameter

9. **Set Content-Disposition header**
   - Set disposition to 'attachment' for download
   - Or 'inline' for browser viewing
   - Include filename in header
   - Handle special characters in filename

10. **Add cache control headers**
    - Set Cache-Control for client caching
    - Set appropriate max-age
    - Set ETag for cache validation
    - Set Last-Modified header

11. **Track download metrics**
    - Log download event
    - Track user who downloaded
    - Record download timestamp
    - Update download_count

12. **Handle file not found errors**
    - Try to regenerate if file missing
    - Return 500 if regeneration fails
    - Log error for investigation
    - Return helpful error message

13. **Add streaming for large files**
    - Use streaming response for large PDFs
    - Set proper chunk size
    - Don't load entire file into memory
    - Improve performance

14. **Support query parameters**
    - inline=true (view in browser)
    - inline=false (download)
    - Default to download
    - Handle parameter parsing

15. **Add error handling**
    - Handle PDF generation errors
    - Handle file system errors
    - Handle storage errors
    - Return appropriate status codes

### Download PDF Endpoint

**URL:** `GET /api/v1/pos/receipts/{id}/pdf/`

**Query Parameters:**
```
?inline=false     # Download as attachment (default)
?inline=true      # View in browser
```

**Response Headers:**
```
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="MyStore_Receipt_RCP-2024-0001.pdf"
Content-Length: 45678
Cache-Control: private, max-age=3600
ETag: "abc123hash"
Last-Modified: Tue, 15 Jan 2024 14:30:00 GMT
```

**Response Body:**
```
[PDF Binary Data]
```

### Inline View Response (inline=true)
```
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: inline; filename="MyStore_Receipt_RCP-2024-0001.pdf"
Content-Length: 45678
```

### Error Scenarios

| Error | Status | Message |
|-------|--------|---------|
| Receipt not found | 404 | "Receipt not found" |
| PDF generation failed | 500 | "Failed to generate PDF" |
| File not found | 500 | "PDF file not found" |
| Storage error | 500 | "Error accessing PDF file" |

### PDF Storage Structure
```
media/
└── receipts/
    └── {tenant_id}/
        └── {year}/
            └── {month}/
                └── {receipt_number}.pdf
```

### Expected Outcome
```
apps/pos/receipts/
├── views/
│   ├── __init__.py
│   └── receipt.py              # ReceiptViewSet with download_pdf action
```

### Verification Checklist
- [ ] Download action added to ReceiptViewSet
- [ ] Receipt validation working
- [ ] Existing PDF check implemented
- [ ] PDF generation on-demand works
- [ ] File storage handling correct
- [ ] Filename formatting safe
- [ ] FileResponse configured properly
- [ ] Content-Disposition headers set
- [ ] Cache headers included
- [ ] Inline view parameter working
- [ ] Download metrics tracked
- [ ] Error handling comprehensive

---

## Task 76: Create ReceiptTemplateViewSet

### Overview
Create a ViewSet for managing receipt templates, including CRUD operations, default template handling, and template activation.

### Dependencies
- Task 70: ReceiptTemplateSerializer
- ReceiptTemplate model

### Instructions

1. **Create template viewset file**
   - Create `template.py` in views directory
   - Import required dependencies
   - Import ReceiptTemplateSerializer

2. **Import required modules**
   - Import viewsets from rest_framework
   - Import Response, status
   - Import action decorator
   - Import permission classes

3. **Create ReceiptTemplateViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Set queryset to ReceiptTemplate.objects.all()
   - Set serializer_class to ReceiptTemplateSerializer

4. **Add tenant filtering**
   - Override get_queryset method
   - Filter templates by current tenant
   - Order by is_default desc, name asc
   - Include only active templates by default

5. **Add permission classes**
   - IsAuthenticated for all operations
   - Custom permission for template management
   - Role check (only managers can create/delete)

6. **Configure filtering backends**
   - Add SearchFilter for name search
   - Add OrderingFilter for sorting
   - Add DjangoFilterBackend for field filtering

7. **Define search fields**
   - name (contains)
   - template_type (exact)
   - paper_size (exact)

8. **Define filterset fields**
   - template_type (exact)
   - paper_size (exact)
   - is_default (boolean)
   - is_active (boolean)

9. **Define ordering fields**
   - name
   - created_at
   - updated_at
   - usage_count (if annotated)

10. **Override create method**
    - Validate template data
    - Check name uniqueness per tenant
    - Set tenant from request
    - Set created_by from request.user
    - Return 201 with created template

11. **Override update method**
    - Validate template belongs to tenant
    - Check not deleting last template
    - Set updated_by from request.user
    - Return updated template

12. **Override destroy method**
    - Check template is not default
    - Check template not in use
    - Allow soft delete (set is_active=False)
    - Return 204 No Content

13. **Add set_default custom action**
    - Add @action decorator with detail=True
    - Set methods=['post']
    - Set url_path='set-default'
    - Unset other defaults for tenant

14. **Implement set_default logic**
    - Get template instance
    - Unset is_default for all tenant templates
    - Set is_default=True for this template
    - Return success message

15. **Add duplicate/clone action**
    - Add @action decorator with detail=True
    - Set methods=['post']
    - Set url_path='clone'
    - Create copy of template

16. **Implement clone logic**
    - Copy template instance
    - Set new name (add "Copy" suffix)
    - Set is_default=False
    - Preserve layout_config
    - Return cloned template

17. **Add preview action**
    - Add @action decorator with detail=True
    - Set methods=['get']
    - Set url_path='preview'
    - Generate sample receipt

18. **Implement preview logic**
    - Load sample receipt data
    - Apply template layout
    - Return formatted preview
    - Don't create actual receipt

19. **Add usage statistics action**
    - Add @action decorator with detail=True
    - Set methods=['get']
    - Set url_path='usage'
    - Return usage metrics

20. **Implement usage statistics**
    - Count receipts using template
    - Get date range of usage
    - Calculate usage trends
    - Return JSON statistics

### ReceiptTemplateViewSet Structure

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **list** | GET /receipt-templates/ | List all templates |
| **create** | POST /receipt-templates/ | Create new template |
| **retrieve** | GET /receipt-templates/{id}/ | Get template detail |
| **update** | PUT /receipt-templates/{id}/ | Update template |
| **partial_update** | PATCH /receipt-templates/{id}/ | Partial update |
| **destroy** | DELETE /receipt-templates/{id}/ | Delete/deactivate template |
| **set_default** | POST /receipt-templates/{id}/set-default/ | Set as default |
| **clone** | POST /receipt-templates/{id}/clone/ | Clone template |
| **preview** | GET /receipt-templates/{id}/preview/ | Preview template |
| **usage** | GET /receipt-templates/{id}/usage/ | Usage statistics |

### Set Default Request/Response

**URL:** `POST /api/v1/pos/receipt-templates/{id}/set-default/`

**Response (200 OK):**
```json
{
    "message": "Template set as default successfully",
    "template": {
        "id": "uuid",
        "name": "Standard Receipt",
        "is_default": true,
        "previous_default": {
            "id": "uuid",
            "name": "Old Default"
        }
    }
}
```

### Clone Template Request/Response

**URL:** `POST /api/v1/pos/receipt-templates/{id}/clone/`

**Request Body (optional):**
```json
{
    "name": "Custom Clone Name"
}
```

**Response (201 Created):**
```json
{
    "message": "Template cloned successfully",
    "template": {
        "id": "new-uuid",
        "name": "Standard Receipt (Copy)",
        "template_type": "THERMAL_80MM",
        "layout_config": {...},
        "is_default": false,
        "is_active": true
    },
    "source_template_id": "original-uuid"
}
```

### Usage Statistics Response

**URL:** `GET /api/v1/pos/receipt-templates/{id}/usage/`

**Response (200 OK):**
```json
{
    "template": {
        "id": "uuid",
        "name": "Standard Receipt"
    },
    "usage": {
        "total_receipts": 1250,
        "last_30_days": 450,
        "last_7_days": 120,
        "today": 15,
        "first_used": "2024-01-01T10:00:00Z",
        "last_used": "2024-01-15T14:30:00Z",
        "average_per_day": 41.67
    },
    "breakdown_by_type": {
        "SALE": 1000,
        "RETURN": 150,
        "REFUND": 100
    }
}
```

### Expected Outcome
```
apps/pos/receipts/
├── views/
│   ├── __init__.py
│   ├── receipt.py              # Task 71
│   └── template.py             # ReceiptTemplateViewSet
```

### Verification Checklist
- [ ] Template viewset file created
- [ ] CRUD operations implemented
- [ ] Tenant filtering working
- [ ] Permission checks in place
- [ ] Set default action working
- [ ] Clone action working
- [ ] Preview action working
- [ ] Usage statistics accurate
- [ ] Error handling comprehensive
- [ ] Search and filtering working

---

## Task 77: Add Receipt Search Endpoint

### Overview
Create a custom search endpoint that allows advanced querying of receipts by multiple criteria, with aggregated results and faceted search.

### Dependencies
- Task 71: ReceiptViewSet
- Receipt model
- Search functionality

### Instructions

1. **Add search action decorator**
   - Add @action decorator with detail=False
   - Set methods=['get']
   - Set url_path='search'
   - Set permission_classes as needed

2. **Create search_receipts action method**
   - Define method in ReceiptViewSet
   - Accept request parameter
   - Return Response with search results

3. **Extract search parameters**
   - date_from (date string)
   - date_to (date string)
   - customer_id (UUID)
   - customer_name (string)
   - customer_email (string)
   - customer_phone (string)
   - amount_min (decimal)
   - amount_max (decimal)
   - receipt_type (choice)
   - receipt_number (string, partial match)
   - terminal_id (UUID)
   - cashier_id (UUID)
   - transaction_number (string)
   - is_printed (boolean)
   - is_emailed (boolean)

4. **Start with base queryset**
   - Get all receipts for tenant
   - Filter by tenant automatically
   - Order by generated_at desc
   - Apply select_related optimizations

5. **Apply date range filters**
   - Parse date_from and date_to
   - Validate date formats
   - Filter generated_at__gte and __lte
   - Handle timezone conversions

6. **Apply customer filters**
   - Filter by customer_id if provided
   - Or search by customer name (icontains)
   - Or search by email (icontains)
   - Or search by phone (icontains)
   - Use Q objects for OR logic

7. **Apply amount range filters**
   - Extract total from receipt_data JSON
   - Filter by amount_min (gte)
   - Filter by amount_max (lte)
   - Handle currency conversions

8. **Apply receipt type filter**
   - Filter by receipt_type if provided
   - Validate against RECEIPT_TYPE_CHOICES
   - Allow multiple types (comma-separated)

9. **Apply receipt number search**
   - Search by receipt_number (icontains)
   - Support partial matching
   - Support wildcards if needed

10. **Apply terminal and cashier filters**
    - Filter by terminal_id from transaction
    - Filter by cashier_id from transaction
    - Use nested lookups

11. **Apply status filters**
    - Filter by is_printed boolean
    - Filter by is_emailed boolean
    - Allow both, either, or neither

12. **Add aggregation calculations**
    - Count total results
    - Sum total amounts
    - Calculate average amount
    - Group by receipt type

13. **Add faceted search results**
    - Return counts by receipt_type
    - Return counts by date (daily)
    - Return counts by terminal
    - Return counts by cashier

14. **Apply pagination**
    - Use paginator for results
    - Default page_size to 50
    - Allow page_size override
    - Return page info in response

15. **Format search results**
    - Serialize receipt data
    - Include highlights for matches
    - Add relevance scores if applicable
    - Return structured response

### Search Endpoint

**URL:** `GET /api/v1/pos/receipts/search/`

**Query Parameters:**
```
?date_from=2024-01-01
?date_to=2024-01-31
?customer_name=Smith
?amount_min=1000
?amount_max=5000
?receipt_type=SALE
?terminal_id=uuid
?is_printed=true
?page=1
?page_size=50
```

**Response (200 OK):**
```json
{
    "count": 125,
    "next": "/api/v1/pos/receipts/search/?page=2&...",
    "previous": null,
    "results": [
        {
            "id": "uuid",
            "receipt_number": "RCP-2024-0001",
            "receipt_type": "SALE",
            "generated_at": "2024-01-15T14:30:00Z",
            "customer_detail": {
                "customer_name": "Jane Smith",
                "email": "jane@example.com"
            },
            "total_amount": "2047.00",
            "is_printed": true,
            "is_emailed": false,
            "pdf_url": "/api/v1/pos/receipts/{id}/pdf/"
        }
    ],
    "aggregations": {
        "total_amount": "255875.00",
        "average_amount": "2047.00",
        "count_by_type": {
            "SALE": 100,
            "RETURN": 15,
            "REFUND": 10
        },
        "count_by_date": {
            "2024-01-15": 45,
            "2024-01-14": 38,
            "2024-01-13": 42
        }
    },
    "facets": {
        "terminals": {
            "POS-01": 70,
            "POS-02": 55
        },
        "cashiers": {
            "John Doe": 80,
            "Jane Smith": 45
        },
        "status": {
            "printed": 100,
            "not_printed": 25,
            "emailed": 50,
            "not_emailed": 75
        }
    },
    "search_params": {
        "date_from": "2024-01-01",
        "date_to": "2024-01-31",
        "customer_name": "Smith",
        "amount_range": [1000, 5000]
    }
}
```

### Advanced Search Features

**Full-Text Search (if using PostgreSQL):**
- Search across receipt_number, customer name, transaction data
- Use GIN indexes for performance
- Support stemming and fuzzy matching

**Date Range Presets:**
```
?preset=today
?preset=yesterday
?preset=this_week
?preset=last_week
?preset=this_month
?preset=last_month
```

**Quick Filters:**
```
?unprinted=true       # is_printed=false
?unemailed=true       # is_emailed=false
?high_value=true      # amount > 10000
?recent=true          # last 24 hours
```

### Expected Outcome
```
apps/pos/receipts/
├── views/
│   ├── __init__.py
│   └── receipt.py              # ReceiptViewSet with search action
```

### Verification Checklist
- [ ] Search action added to ReceiptViewSet
- [ ] All search parameters handled
- [ ] Date range filtering working
- [ ] Customer search working
- [ ] Amount range filtering working
- [ ] Aggregations calculated correctly
- [ ] Faceted results included
- [ ] Pagination working
- [ ] Performance optimized
- [ ] Response formatted properly

---

## Task 78: Create Receipt Export

### Overview
Create export functionality that allows bulk export of receipts in various formats (CSV, Excel, JSON) for accounting integration and reporting.

### Dependencies
- Task 71: ReceiptViewSet
- Export libraries (csv, openpyxl)
- Receipt model

### Instructions

1. **Create export views file**
   - Create `export.py` in views directory
   - Import required export libraries
   - Import receipt models and serializers

2. **Import required modules**
   - Import csv, json modules
   - Import openpyxl for Excel
   - Import HttpResponse
   - Import timezone utilities

3. **Create ReceiptExportView class**
   - Inherit from APIView
   - Add permission classes
   - Define get method for export

4. **Add export action to ReceiptViewSet**
   - Add @action decorator with detail=False
   - Set methods=['get']
   - Set url_path='export'
   - Set permission_classes (managers only)

5. **Extract export parameters**
   - format (csv, xlsx, json)
   - date_from (required)
   - date_to (required)
   - receipt_type (optional)
   - terminal_id (optional)
   - include_voided (optional boolean)

6. **Validate date range**
   - Check date_from and date_to provided
   - Validate date formats
   - Check date_to >= date_from
   - Limit maximum range (e.g., 90 days)

7. **Build export queryset**
   - Filter receipts by date range
   - Apply additional filters
   - Order by generated_at
   - Use select_related for efficiency

8. **Define export columns**
   - receipt_number
   - receipt_date
   - receipt_time
   - receipt_type
   - customer_name
   - customer_email
   - customer_phone
   - transaction_number
   - terminal_name
   - cashier_name
   - items_count
   - subtotal
   - tax_amount
   - discount_amount
   - total_amount
   - payment_method
   - is_printed
   - is_emailed
   - generated_at

9. **Create CSV export method**
   - Create HttpResponse with text/csv content-type
   - Set Content-Disposition header with filename
   - Create csv.writer
   - Write header row
   - Write data rows
   - Return response

10. **Create Excel export method**
    - Create Workbook instance
    - Add worksheet with title
    - Write header row with styling
    - Write data rows
    - Format currency columns
    - Auto-size columns
    - Save to BytesIO
    - Return response with xlsx content-type

11. **Create JSON export method**
    - Serialize receipts using ReceiptSerializer
    - Format as JSON array
    - Include metadata (export_date, count)
    - Pretty-print JSON
    - Return response with json content-type

12. **Format currency values**
    - Format amounts with 2 decimals
    - Include currency symbol (LKR ₨)
    - Handle null values
    - Format consistently across formats

13. **Format date/time values**
    - Convert to tenant timezone
    - Format dates as YYYY-MM-DD
    - Format times as HH:MM:SS
    - Include timezone info in metadata

14. **Add export limits**
    - Limit maximum records (e.g., 10000)
    - Return error if limit exceeded
    - Suggest date range reduction
    - Offer pagination for large exports

15. **Track export activity**
    - Log export event
    - Record user who exported
    - Track export parameters
    - Store export timestamp

16. **Add export filename generation**
    - Format: "receipts_{from_date}_{to_date}_{timestamp}.{ext}"
    - Sanitize filename
    - Include tenant name if multi-tenant
    - Make filesystem-safe

17. **Handle empty results**
    - Return empty file with headers only
    - Include message in response
    - Don't return error
    - Log empty export

18. **Add error handling**
    - Handle invalid date formats
    - Handle database errors
    - Handle file generation errors
    - Return appropriate status codes

### Export Endpoint

**URL:** `GET /api/v1/pos/receipts/export/`

**Query Parameters:**
```
?format=csv
?date_from=2024-01-01
?date_to=2024-01-31
?receipt_type=SALE
?terminal_id=uuid
?include_voided=false
```

**Response (200 OK) - CSV:**
```
HTTP/1.1 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="receipts_2024-01-01_2024-01-31_20240115143000.csv"

receipt_number,receipt_date,receipt_time,receipt_type,customer_name,...
RCP-2024-0001,2024-01-15,14:30:00,SALE,Jane Smith,...
RCP-2024-0002,2024-01-15,15:45:00,SALE,John Doe,...
```

**Response (200 OK) - Excel:**
```
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="receipts_2024-01-01_2024-01-31_20240115143000.xlsx"

[Excel Binary Data with formatted columns]
```

**Response (200 OK) - JSON:**
```json
{
    "export_metadata": {
        "format": "json",
        "exported_at": "2024-01-15T14:30:00Z",
        "exported_by": "john.doe@example.com",
        "date_range": {
            "from": "2024-01-01",
            "to": "2024-01-31"
        },
        "filters": {
            "receipt_type": "SALE"
        },
        "count": 125,
        "currency": "LKR"
    },
    "receipts": [
        {
            "receipt_number": "RCP-2024-0001",
            "receipt_date": "2024-01-15",
            "receipt_time": "14:30:00",
            "receipt_type": "SALE",
            "customer_name": "Jane Smith",
            "customer_email": "jane@example.com",
            "transaction_number": "TXN-2024-0001",
            "terminal_name": "POS-01",
            "cashier_name": "John Doe",
            "items_count": 3,
            "subtotal": "1900.00",
            "tax_amount": "247.00",
            "discount_amount": "100.00",
            "total_amount": "2047.00",
            "payment_method": "CASH",
            "is_printed": true,
            "is_emailed": false
        }
    ]
}
```

### CSV Column Format
| Column | Format | Example |
|--------|--------|---------|
| receipt_number | String | RCP-2024-0001 |
| receipt_date | YYYY-MM-DD | 2024-01-15 |
| receipt_time | HH:MM:SS | 14:30:00 |
| receipt_type | String | SALE |
| customer_name | String | Jane Smith |
| total_amount | Decimal(2) | 2047.00 |
| payment_method | String | CASH |
| is_printed | Boolean | TRUE/FALSE |

### Excel Formatting
- Header row: Bold, background color, frozen
- Currency columns: Accounting format with ₨ symbol
- Date columns: Date format
- Boolean columns: Checkbox or TRUE/FALSE
- Auto-filter enabled on header row
- Column widths auto-adjusted

### Error Scenarios

| Error | Status | Message |
|-------|--------|---------|
| Missing date range | 400 | "date_from and date_to required" |
| Invalid date format | 400 | "Invalid date format. Use YYYY-MM-DD" |
| Date range too large | 400 | "Date range cannot exceed 90 days" |
| Invalid format | 400 | "Invalid format. Use: csv, xlsx, json" |
| Too many records | 400 | "Export limit exceeded. Reduce date range" |
| No permission | 403 | "Permission denied for export" |

### Expected Outcome
```
apps/pos/receipts/
├── views/
│   ├── __init__.py
│   ├── receipt.py              # Task 71, 77
│   ├── template.py             # Task 76
│   └── export.py               # Export view
```

### Verification Checklist
- [ ] Export view file created
- [ ] Export action added to ViewSet
- [ ] Date range validation working
- [ ] CSV export generating correctly
- [ ] Excel export formatting properly
- [ ] JSON export structured correctly
- [ ] Currency formatting consistent
- [ ] Date/time formatting correct
- [ ] Filename generation working
- [ ] Export limits enforced
- [ ] Permission checks in place
- [ ] Error handling comprehensive
- [ ] Empty results handled
- [ ] Activity tracking working

---

## Diagrams

### Receipt API Endpoints Overview

```
┌──────────────────────────────────────────────────────────┐
│                 Receipt API Endpoints                     │
└──────────────────────────────────────────────────────────┘

/api/v1/pos/receipts/
│
├── GET /                          List receipts (paginated)
├── GET /{id}/                     Get receipt detail
├── POST /                         Create manual receipt
├── PUT /{id}/                     Update receipt
├── DELETE /{id}/                  Delete receipt
│
├── POST /transactions/{id}/receipt/   Generate from transaction (Task 72)
│   ├── Request: { template_id, auto_print, email_to }
│   └── Response: Created receipt with URLs
│
├── POST /{id}/print/              Trigger print job (Task 73)
│   ├── Request: { printer_id, copies, priority }
│   └── Response: Print job details
│
├── POST /{id}/email/              Send receipt email (Task 74)
│   ├── Request: { email, attach_pdf, custom_message }
│   └── Response: Email task details
│
├── GET /{id}/pdf/                 Download PDF (Task 75)
│   ├── Query: ?inline=true
│   └── Response: PDF binary
│
├── GET /search/                   Advanced search (Task 77)
│   ├── Query: Multiple filters
│   └── Response: Filtered results with aggregations
│
└── GET /export/                   Export receipts (Task 78)
    ├── Query: format, date_from, date_to
    └── Response: CSV/Excel/JSON file

/api/v1/pos/receipt-templates/
│
├── GET /                          List templates
├── POST /                         Create template
├── GET /{id}/                     Get template detail
├── PUT /{id}/                     Update template
├── DELETE /{id}/                  Delete template
│
├── POST /{id}/set-default/        Set as default template (Task 76)
├── POST /{id}/clone/              Clone template (Task 76)
├── GET /{id}/preview/             Preview template (Task 76)
└── GET /{id}/usage/               Usage statistics (Task 76)
```

### Print Receipt Workflow

```
┌─────────────┐
│   Client    │
│  POST /print│
└──────┬──────┘
       │
       │ { printer_id, copies }
       │
       ▼
┌──────────────────────────────┐
│    ReceiptViewSet            │
│    print_receipt()           │
└──────┬───────────────────────┘
       │
       │ 1. Validate receipt
       │
       ▼
┌──────────────────────────────┐
│  Resolve Printer             │
│  • Use provided printer_id?  │
│  • Use terminal default?     │
│  • Check printer online?     │
└──────┬───────────────────────┘
       │
       │ 2. Get/generate PDF
       │
       ▼
┌──────────────────────────────┐
│   PDF Generation             │
│   • Check cached PDF         │
│   • Generate if needed       │
│   • Store PDF data           │
└──────┬───────────────────────┘
       │
       │ 3. Create print job
       │
       ▼
┌──────────────────────────────┐
│   Create PrintJob            │
│   • Set status = QUEUED      │
│   • Set printer              │
│   • Set copies               │
│   • Link to receipt          │
└──────┬───────────────────────┘
       │
       │ 4. Queue Celery task
       │
       ▼
┌──────────────────────────────┐
│   Celery Task Queue          │
│   print_receipt_task.delay() │
└──────┬───────────────────────┘
       │
       │ 5. Return response
       │
       ▼
┌──────────────────────────────┐
│   Response                   │
│   • job_id                   │
│   • status = QUEUED          │
│   • printer info             │
│   • estimated completion     │
└──────────────────────────────┘

       [Background Processing]
               │
               ▼
       ┌──────────────┐
       │ Celery Worker│
       │ • Send to    │
       │   printer    │
       │ • Update job │
       │   status     │
       │ • Update     │
       │   receipt    │
       │   is_printed │
       └──────────────┘
```

### Email Receipt Workflow

```
┌─────────────┐
│   Client    │
│ POST /email │
└──────┬──────┘
       │
       │ { email, attach_pdf }
       │
       ▼
┌──────────────────────────────┐
│   ReceiptViewSet             │
│   email_receipt()            │
└──────┬───────────────────────┘
       │
       │ 1. Validate email
       │
       ▼
┌──────────────────────────────┐
│  Email Validation            │
│  • Check format              │
│  • Use customer email?       │
│  • Check SMTP configured     │
└──────┬───────────────────────┘
       │
       │ 2. Prepare content
       │
       ▼
┌──────────────────────────────┐
│  Email Content Preparation   │
│  • Get HTML template         │
│  • Populate receipt data     │
│  • Add custom message        │
│  • Format branding           │
└──────┬───────────────────────┘
       │
       │ 3. Attach PDF if requested
       │
       ▼
┌──────────────────────────────┐
│  PDF Attachment              │
│  • Generate/get PDF          │
│  • Set filename              │
│  • Attach to email           │
└──────┬───────────────────────┘
       │
       │ 4. Queue email task
       │
       ▼
┌──────────────────────────────┐
│  Celery Task Queue           │
│  send_receipt_email.delay()  │
└──────┬───────────────────────┘
       │
       │ 5. Return response
       │
       ▼
┌──────────────────────────────┐
│  Response                    │
│  • task_id                   │
│  • status = QUEUED           │
│  • recipient                 │
│  • estimated delivery        │
└──────────────────────────────┘

      [Background Processing]
              │
              ▼
      ┌──────────────┐
      │Celery Worker │
      │ • Connect    │
      │   SMTP       │
      │ • Send email │
      │ • Update     │
      │   receipt    │
      │   is_emailed │
      │ • Log result │
      └──────────────┘
```

### Search and Filter Flow

```
┌──────────────────────────────────────────────────────────┐
│                  Search Request                          │
│  GET /receipts/search/?date_from=...&customer_name=...  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Parse Query Parameters                      │
│  • date_from / date_to                                  │
│  • customer_name / email / phone                        │
│  • amount_min / amount_max                              │
│  • receipt_type                                         │
│  • terminal_id / cashier_id                             │
│  • is_printed / is_emailed                              │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Build Base Queryset                         │
│  Receipt.objects.filter(tenant=current_tenant)          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ├──────────────┬──────────────┬────────────┐
                     │              │              │            │
                     ▼              ▼              ▼            ▼
            ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
            │ Date Filter  │ │Customer  │ │ Amount   │ │  Status  │
            │ generated_at │ │  Search  │ │  Range   │ │  Filters │
            │ __range      │ │  Q()     │ │ gte/lte  │ │ boolean  │
            └──────┬───────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
                   │              │             │            │
                   └──────────────┴─────────────┴────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   Combined Queryset      │
                    │   with all filters       │
                    └────────┬─────────────────┘
                             │
                             ├───────────────┬─────────────┐
                             │               │             │
                             ▼               ▼             ▼
                    ┌──────────────┐ ┌──────────┐ ┌──────────┐
                    │ Aggregations │ │  Facets  │ │Pagination│
                    │ • Count      │ │ • Types  │ │ • Page   │
                    │ • Sum        │ │ • Dates  │ │ • Size   │
                    │ • Average    │ │ • Status │ │          │
                    └──────┬───────┘ └────┬─────┘ └────┬─────┘
                           │              │            │
                           └──────────────┴────────────┘
                                          │
                                          ▼
                            ┌──────────────────────────┐
                            │   Format Response        │
                            │   • Results array        │
                            │   • Aggregations         │
                            │   • Facets               │
                            │   • Pagination info      │
                            └────────┬─────────────────┘
                                     │
                                     ▼
                            ┌──────────────────────────┐
                            │   Return JSON            │
                            └──────────────────────────┘
```

### Export Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                   Export Request                         │
│  GET /receipts/export/?format=csv&date_from=...         │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Validate Parameters                         │
│  • Check format (csv/xlsx/json)                         │
│  • Validate date range                                  │
│  • Check date range limit (90 days)                     │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Build Export Queryset                       │
│  • Filter by date range                                 │
│  • Apply additional filters                             │
│  • Optimize with select_related                         │
│  • Check record count limit                             │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Extract Receipt Data                        │
│  For each receipt:                                       │
│  • receipt_number, date, time                           │
│  • customer info                                        │
│  • amounts (subtotal, tax, total)                       │
│  • payment method                                       │
│  • status flags                                         │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │
            ┌────────┴────────┬────────────────┐
            │                 │                │
            ▼                 ▼                ▼
   ┌────────────────┐ ┌──────────────┐ ┌──────────────┐
   │  CSV Format    │ │ Excel Format │ │ JSON Format  │
   │                │ │              │ │              │
   │ • Create       │ │ • Create     │ │ • Serialize  │
   │   csv.writer   │ │   Workbook   │ │   with DRF   │
   │ • Write header │ │ • Style      │ │ • Add        │
   │ • Write rows   │ │   header     │ │   metadata   │
   │ • Plain text   │ │ • Format     │ │ • Pretty     │
   │                │ │   currency   │ │   print      │
   │                │ │ • Auto-size  │ │              │
   └───────┬────────┘ └──────┬───────┘ └──────┬───────┘
           │                 │                │
           └─────────────────┴────────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │  Generate Filename       │
                │  receipts_{from}_{to}_   │
                │  {timestamp}.{ext}       │
                └────────┬─────────────────┘
                         │
                         ▼
                ┌──────────────────────────┐
                │  Set Response Headers    │
                │  • Content-Type          │
                │  • Content-Disposition   │
                │  • Filename              │
                └────────┬─────────────────┘
                         │
                         ▼
                ┌──────────────────────────┐
                │  Return File Response    │
                │  [Binary file data]      │
                └──────────────────────────┘
```

### Template Management Structure

```
┌──────────────────────────────────────────────────────────┐
│              ReceiptTemplateViewSet                      │
└──────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ CRUD Ops     │    │ Custom       │    │ Analytics    │
│              │    │ Actions      │    │              │
│ • List       │    │              │    │ • Usage      │
│ • Create     │    │ • Set        │    │   Statistics │
│ • Retrieve   │    │   Default    │    │ • Trends     │
│ • Update     │    │ • Clone      │    │ • Popular    │
│ • Delete     │    │ • Preview    │    │   Templates  │
└──────────────┘    └──────────────┘    └──────────────┘

Template Lifecycle:
───────────────────

┌──────────┐      ┌──────────┐      ┌──────────┐
│ CREATE   │─────▶│ ACTIVE   │─────▶│ DEFAULT  │
│ New      │      │ In use   │      │ Primary  │
│ Template │      │          │      │ Template │
└──────────┘      └────┬─────┘      └────┬─────┘
                       │                  │
                       │                  │
                       ▼                  ▼
                ┌──────────┐      ┌──────────┐
                │ INACTIVE │      │  CLONE   │
                │ Disabled │      │  Copy    │
                └──────────┘      └──────────┘

Template Selection Flow:
────────────────────────

Generate Receipt Request
         │
         ▼
    template_id provided?
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    ▼         ▼
Validate   Get Default
Template   Template
    │         │
    └────┬────┘
         │
         ▼
    Apply Layout
         │
         ▼
  Generate Receipt
```

---

## End of Document 02

**Next Steps:**
- Proceed to [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/) for testing and documentation
- Configure URL routing for all endpoints
- Set up Celery tasks for async operations (print, email)
- Test all endpoints with various scenarios
- Review API documentation and examples

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Tasks Completed:** 73, 74, 75, 76, 77, 78  
**Group Status:** All Group-E tasks complete
