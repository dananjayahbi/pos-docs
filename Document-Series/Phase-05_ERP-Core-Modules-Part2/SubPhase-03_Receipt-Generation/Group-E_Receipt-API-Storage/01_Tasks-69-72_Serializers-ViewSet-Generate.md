# Tasks 69-72: Receipt Serializers, ViewSet, and Generate Endpoint

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** E - Receipt API & Storage  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-73-78_Actions-Search-Export.md](02_Tasks-73-78_Actions-Search-Export.md)
- **← Previous Group:** [../Group-D_PDF-Email-Receipts/](../Group-D_PDF-Email-Receipts/)

---

## Document Overview

This document covers the creation of REST API serializers and viewsets for receipt management. These components provide data serialization for API responses and core CRUD operations for receipt retrieval.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create ReceiptSerializer | Medium | 25 min |
| 70 | Create ReceiptTemplateSerializer | Medium | 25 min |
| 71 | Create ReceiptViewSet | Medium | 30 min |
| 72 | Add generate receipt endpoint | Medium | 25 min |

---

## Task 69: Create ReceiptSerializer

### Overview
Create a serializer for the Receipt model that handles JSON serialization for API responses, including computed fields for download URLs and receipt metadata.

### Dependencies
- Receipt model (Group A, Task 04)
- Django REST Framework installed

### Instructions

1. **Create serializer file structure**
   - Create directory `apps/pos/receipts/serializers/`
   - Create `__init__.py` to mark as package
   - Create `receipt.py` for receipt serialization

2. **Import required dependencies**
   - Import serializers from rest_framework
   - Import Receipt model
   - Import Transaction, Customer models for nested relationships
   - Import reverse for URL generation

3. **Create ReceiptSerializer class**
   - Inherit from serializers.ModelSerializer
   - Define Meta class with Receipt model

4. **Define read-only fields**
   - receipt_number (auto-generated)
   - generated_at (auto-timestamp)
   - created_at
   - updated_at
   - id (UUID)

5. **Define writable fields**
   - receipt_type (choice field with RECEIPT_TYPE_CHOICES)
   - template (foreign key, optional)
   - transaction (foreign key, optional for manual receipts)
   - receipt_data (JSON field)
   - is_printed (boolean)
   - is_emailed (boolean)

6. **Add nested relationship fields**
   - transaction_detail (nested serializer for transaction summary)
   - customer_detail (nested serializer for customer info)
   - template_detail (nested serializer for template summary)
   - tenant_detail (nested serializer for tenant info)

7. **Add computed URL fields (SerializerMethodField)**
   - pdf_url (endpoint to download PDF)
   - email_url (endpoint to trigger email send)
   - print_url (endpoint to trigger print job)
   - detail_url (endpoint to view receipt detail)

8. **Implement get_pdf_url method**
   - Accept obj (Receipt instance)
   - Use reverse() to generate URL path
   - Return absolute URL with receipt ID
   - Handle case where request context not available

9. **Implement get_email_url method**
   - Generate email action endpoint URL
   - Include receipt ID in path
   - Return formatted URL string

10. **Implement get_print_url method**
    - Generate print action endpoint URL
    - Include receipt ID in path
    - Return formatted URL string

11. **Implement get_detail_url method**
    - Generate receipt detail view URL
    - Include receipt ID in path
    - Return formatted URL string

12. **Add custom validation methods**
    - validate_receipt_data (ensure proper JSON structure)
    - validate_receipt_type (ensure valid type from choices)
    - validate_template (ensure template belongs to tenant)

13. **Add receipt data formatting**
    - Method to format currency values
    - Method to format date/time based on tenant timezone
    - Method to format line items structure

14. **Create summary representation method**
    - Override to_representation for customization
    - Add computed totals if not in receipt_data
    - Add receipt age (time since generation)
    - Add status flags (printed, emailed)

15. **Add Meta configuration**
    - Define fields list (explicit or '__all__')
    - Define read_only_fields tuple
    - Define ordering (by generated_at desc)

### Serializer Structure

| Field Category | Fields |
|----------------|--------|
| **Identity** | id, receipt_number, receipt_type |
| **Timestamps** | generated_at, created_at, updated_at |
| **Relationships** | transaction, customer, template, tenant |
| **Data** | receipt_data (JSON) |
| **Status** | is_printed, is_emailed |
| **Actions** | pdf_url, email_url, print_url |
| **Nested Details** | transaction_detail, customer_detail, template_detail |

### Nested Serializer Fields

**TransactionDetailSerializer (inline):**
- transaction_number
- total_amount
- transaction_date
- payment_method

**CustomerDetailSerializer (inline):**
- customer_name
- email
- phone

**TemplateDetailSerializer (inline):**
- template_name
- template_type
- paper_size

### Receipt Data JSON Structure
```json
{
    "header": {
        "business_name": "Store Name",
        "address": "123 Main St",
        "phone": "0112345678",
        "tax_id": "TIN12345"
    },
    "receipt_info": {
        "receipt_number": "RCP-2024-0001",
        "date": "2024-01-15",
        "time": "14:30:00",
        "cashier": "John Doe",
        "terminal": "POS-01"
    },
    "customer": {
        "name": "Jane Smith",
        "phone": "0771234567",
        "email": "jane@example.com"
    },
    "items": [
        {
            "name": "Product A",
            "quantity": 2,
            "unit_price": 1000.00,
            "discount": 100.00,
            "total": 1900.00
        }
    ],
    "totals": {
        "subtotal": 1900.00,
        "tax": 247.00,
        "discount": 100.00,
        "total": 2047.00
    },
    "payment": {
        "method": "CASH",
        "amount_paid": 2500.00,
        "change": 453.00
    },
    "footer": {
        "thank_you_message": "Thank you for shopping!",
        "return_policy": "Returns within 7 days with receipt"
    }
}
```

### Expected Outcome
```
apps/pos/receipts/
├── serializers/
│   ├── __init__.py
│   └── receipt.py              # ReceiptSerializer
```

### Verification Checklist
- [ ] `serializers/receipt.py` file created
- [ ] ReceiptSerializer class defined
- [ ] All model fields included in serializer
- [ ] Read-only fields marked correctly
- [ ] Nested serializers for relationships
- [ ] URL fields return valid endpoints
- [ ] Validation methods implemented
- [ ] JSON data structure validated
- [ ] Meta configuration complete
- [ ] to_representation customized for computed fields

---

## Task 70: Create ReceiptTemplateSerializer

### Overview
Create a serializer for the ReceiptTemplate model that handles template configuration, layout settings, and customization options.

### Dependencies
- ReceiptTemplate model (Group B, Task 08)
- Task 69: ReceiptSerializer

### Instructions

1. **Create template serializer file**
   - Create `template.py` in serializers directory
   - Import necessary dependencies
   - Import ReceiptTemplate model

2. **Import required modules**
   - Import serializers from rest_framework
   - Import ReceiptTemplate model
   - Import validators for JSON schema

3. **Create ReceiptTemplateSerializer class**
   - Inherit from serializers.ModelSerializer
   - Define Meta class with ReceiptTemplate model

4. **Define read-only fields**
   - id (UUID)
   - created_at
   - updated_at
   - created_by (user who created)
   - updated_by (user who last updated)

5. **Define writable fields**
   - name (string, required, max 100 chars)
   - template_type (choice field with TEMPLATE_TYPE_CHOICES)
   - paper_size (choice field with PAPER_SIZE_CHOICES)
   - layout_config (JSON field)
   - is_default (boolean)
   - is_active (boolean)

6. **Add layout configuration validation**
   - Validate header_config structure
   - Validate footer_config structure
   - Validate item_layout structure
   - Validate style settings (fonts, colors, spacing)

7. **Add tenant isolation validation**
   - Validate template belongs to current tenant
   - Prevent cross-tenant template access
   - Ensure default template uniqueness per tenant

8. **Add computed fields**
   - usage_count (SerializerMethodField for receipt count)
   - last_used_at (SerializerMethodField)
   - preview_url (SerializerMethodField for template preview)

9. **Implement get_usage_count method**
   - Query Receipt model for template usage
   - Filter by template ID
   - Return count of receipts using template

10. **Implement get_last_used_at method**
    - Query Receipt model
    - Get latest receipt with template
    - Return generated_at timestamp or None

11. **Implement get_preview_url method**
    - Generate preview endpoint URL
    - Include template ID in path
    - Return formatted URL string

12. **Add layout validation methods**
    - validate_layout_config (ensure valid JSON structure)
    - validate_paper_size (ensure size matches type)
    - validate_template_type (ensure valid type)

13. **Add default template handling**
    - Method to check if another default exists
    - Validation to prevent multiple defaults per tenant
    - Auto-unset other defaults when setting new default

14. **Add style configuration validation**
    - Validate font names from allowed list
    - Validate font sizes (8-72pt range)
    - Validate color codes (hex format)
    - Validate margin values (0-50mm range)

15. **Create layout preview method**
    - Method to generate preview data structure
    - Include sample receipt data for preview
    - Return formatted preview JSON

16. **Add template cloning support**
    - Method to prepare template for cloning
    - Reset fields (name, is_default)
    - Preserve layout_config

17. **Add Meta configuration**
    - Define fields list
    - Define read_only_fields tuple
    - Define ordering (by name)
    - Add unique_together validation

### Template Layout Config Structure
```json
{
    "header": {
        "show_logo": true,
        "logo_size": "medium",
        "business_name_font": "Arial",
        "business_name_size": 16,
        "show_address": true,
        "show_phone": true,
        "show_tax_id": true,
        "separator_style": "dotted"
    },
    "receipt_info": {
        "show_receipt_number": true,
        "show_date": true,
        "show_time": true,
        "show_cashier": true,
        "show_terminal": true,
        "layout": "two_column"
    },
    "items": {
        "columns": ["name", "qty", "price", "total"],
        "show_item_codes": false,
        "show_discounts": true,
        "font_size": 10,
        "line_spacing": 1.2
    },
    "totals": {
        "show_subtotal": true,
        "show_tax": true,
        "show_discount": true,
        "total_font_size": 14,
        "total_font_weight": "bold"
    },
    "payment": {
        "show_method": true,
        "show_amount_paid": true,
        "show_change": true
    },
    "footer": {
        "thank_you_message": "Thank you for your business!",
        "show_return_policy": true,
        "show_website": true,
        "show_qr_code": false,
        "barcode_type": "none"
    },
    "style": {
        "font_family": "Arial",
        "font_size": 10,
        "margin_top": 5,
        "margin_bottom": 5,
        "margin_left": 5,
        "margin_right": 5,
        "line_height": 1.5
    }
}
```

### Paper Size Options
| Size | Width | Height | Use Case |
|------|-------|--------|----------|
| 58mm | 58mm | Variable | Thermal printer (small) |
| 80mm | 80mm | Variable | Thermal printer (standard) |
| A4 | 210mm | 297mm | Laser printer |
| Letter | 8.5in | 11in | US laser printer |

### Expected Outcome
```
apps/pos/receipts/
├── serializers/
│   ├── __init__.py
│   ├── receipt.py              # Task 69
│   └── template.py             # ReceiptTemplateSerializer
```

### Verification Checklist
- [ ] `serializers/template.py` file created
- [ ] ReceiptTemplateSerializer class defined
- [ ] All template fields included
- [ ] Layout config validation implemented
- [ ] Style validation rules applied
- [ ] Default template handling correct
- [ ] Usage count calculation works
- [ ] Preview URL generation works
- [ ] Tenant isolation enforced
- [ ] JSON schema validation complete

---

## Task 71: Create ReceiptViewSet

### Overview
Create a ViewSet that provides CRUD operations for receipts, including list, retrieve, and custom actions for receipt operations.

### Dependencies
- Task 69: ReceiptSerializer
- Task 70: ReceiptTemplateSerializer
- Receipt model

### Instructions

1. **Create views directory structure**
   - Create directory `apps/pos/receipts/views/`
   - Create `__init__.py` file
   - Create `receipt.py` for receipt views

2. **Import required dependencies**
   - Import ViewSet from rest_framework.viewsets
   - Import Response from rest_framework.response
   - Import status from rest_framework
   - Import decorators (action, permission_classes)
   - Import filters (SearchFilter, OrderingFilter)
   - Import pagination classes

3. **Create ReceiptViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Set queryset to Receipt.objects.all()
   - Set serializer_class to ReceiptSerializer

4. **Add tenant filtering**
   - Override get_queryset method
   - Filter receipts by current tenant
   - Use request.tenant from middleware
   - Order by generated_at descending

5. **Add permission classes**
   - IsAuthenticated for all operations
   - Custom permission for tenant isolation
   - Role-based access (manager can view all, cashier only own)

6. **Configure filtering backends**
   - Add SearchFilter for text search
   - Add OrderingFilter for sorting
   - Add DjangoFilterBackend for field filtering

7. **Define search fields**
   - receipt_number (exact and contains)
   - transaction__transaction_number
   - customer__name
   - customer__email
   - customer__phone

8. **Define filterset fields**
   - receipt_type (exact)
   - is_printed (boolean)
   - is_emailed (boolean)
   - generated_at (date range)
   - created_at (date range)
   - terminal (exact)

9. **Define ordering fields**
   - generated_at
   - created_at
   - receipt_number
   - transaction__total_amount

10. **Add pagination configuration**
    - Set pagination_class to PageNumberPagination
    - Set page_size to 25 receipts per page
    - Allow page_size override via query param

11. **Override list method**
    - Add custom query optimizations
    - Use select_related for foreign keys
    - Use prefetch_related for reverse relationships
    - Add summary statistics in response

12. **Override retrieve method**
    - Fetch single receipt by ID or receipt_number
    - Include full nested data
    - Track retrieval for analytics
    - Return 404 if not found or wrong tenant

13. **Add custom queryset optimizations**
    - select_related('transaction', 'customer', 'template')
    - prefetch_related('transaction__items')
    - Annotate with computed fields
    - Cache expensive queries

14. **Add error handling**
    - Handle Receipt.DoesNotExist
    - Handle validation errors
    - Return appropriate HTTP status codes
    - Include helpful error messages

15. **Add response formatting**
    - Standardize response structure
    - Include metadata (count, page info)
    - Add links to related resources
    - Format timestamps consistently

### ViewSet Structure

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **list** | GET /receipts/ | List all receipts (filtered) |
| **retrieve** | GET /receipts/{id}/ | Get single receipt detail |
| **create** | POST /receipts/ | Create manual receipt |
| **update** | PUT /receipts/{id}/ | Update receipt |
| **partial_update** | PATCH /receipts/{id}/ | Partially update receipt |
| **destroy** | DELETE /receipts/{id}/ | Delete receipt |

### Query Parameters

**Filtering:**
```
?receipt_type=SALE
?is_printed=true
?is_emailed=false
?generated_at_after=2024-01-01
?generated_at_before=2024-01-31
?terminal=POS-01
```

**Searching:**
```
?search=RCP-2024
?search=customer@email.com
?search=0771234567
```

**Ordering:**
```
?ordering=-generated_at
?ordering=receipt_number
?ordering=-transaction__total_amount
```

**Pagination:**
```
?page=2
?page_size=50
```

### List Response Structure
```json
{
    "count": 150,
    "next": "/api/v1/pos/receipts/?page=2",
    "previous": null,
    "results": [
        {
            "id": "uuid",
            "receipt_number": "RCP-2024-0001",
            "receipt_type": "SALE",
            "generated_at": "2024-01-15T14:30:00Z",
            "transaction_detail": {
                "transaction_number": "TXN-2024-0001",
                "total_amount": "2047.00"
            },
            "customer_detail": {
                "customer_name": "Jane Smith",
                "email": "jane@example.com"
            },
            "is_printed": true,
            "is_emailed": false,
            "pdf_url": "/api/v1/pos/receipts/{id}/pdf/",
            "email_url": "/api/v1/pos/receipts/{id}/email/",
            "print_url": "/api/v1/pos/receipts/{id}/print/"
        }
    ],
    "summary": {
        "total_receipts": 150,
        "printed_count": 120,
        "emailed_count": 45,
        "total_amount": "305000.00"
    }
}
```

### Retrieve Response Structure
```json
{
    "id": "uuid",
    "receipt_number": "RCP-2024-0001",
    "receipt_type": "SALE",
    "generated_at": "2024-01-15T14:30:00Z",
    "receipt_data": {
        "header": {...},
        "items": [...],
        "totals": {...}
    },
    "transaction_detail": {
        "transaction_number": "TXN-2024-0001",
        "transaction_date": "2024-01-15",
        "total_amount": "2047.00",
        "payment_method": "CASH"
    },
    "customer_detail": {
        "customer_name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "0771234567"
    },
    "template_detail": {
        "template_name": "Standard Receipt",
        "paper_size": "80mm"
    },
    "is_printed": true,
    "is_emailed": false,
    "pdf_url": "/api/v1/pos/receipts/{id}/pdf/",
    "email_url": "/api/v1/pos/receipts/{id}/email/",
    "print_url": "/api/v1/pos/receipts/{id}/print/",
    "created_at": "2024-01-15T14:30:00Z",
    "updated_at": "2024-01-15T14:30:00Z"
}
```

### Expected Outcome
```
apps/pos/receipts/
├── views/
│   ├── __init__.py
│   └── receipt.py              # ReceiptViewSet
```

### Verification Checklist
- [ ] `views/receipt.py` file created
- [ ] ReceiptViewSet class defined
- [ ] Tenant filtering implemented
- [ ] Permission classes configured
- [ ] Search filter working
- [ ] Ordering filter working
- [ ] Pagination configured
- [ ] List method optimized
- [ ] Retrieve method returns full detail
- [ ] Error handling implemented

---

## Task 72: Add Generate Receipt Endpoint

### Overview
Create a custom endpoint that generates a receipt from a completed transaction, applying the appropriate template and storing the receipt data.

### Dependencies
- Task 71: ReceiptViewSet
- Transaction model
- ReceiptGenerator service (Group C, Task 38)

### Instructions

1. **Add action decorator to ViewSet**
   - Import action from rest_framework.decorators
   - Add @action decorator with detail=False
   - Set methods=['post']
   - Set url_path='transactions/<uuid:transaction_id>/receipt'

2. **Create generate_from_transaction action**
   - Define method in ReceiptViewSet
   - Accept request and transaction_id parameters
   - Return Response with created receipt data

3. **Validate transaction exists**
   - Query Transaction model by transaction_id
   - Check transaction belongs to current tenant
   - Raise ValidationError if not found
   - Raise PermissionDenied if wrong tenant

4. **Validate transaction status**
   - Check transaction status is COMPLETED
   - Reject if transaction is PENDING or CANCELLED
   - Return error with appropriate message

5. **Check for existing receipt**
   - Query Receipt model for transaction
   - If receipt exists, return existing receipt
   - Include option to regenerate if forced

6. **Extract request parameters**
   - template_id (optional, UUID)
   - receipt_type (optional, default from transaction)
   - auto_print (optional, boolean)
   - email_to (optional, email address)
   - regenerate (optional, boolean to force regenerate)

7. **Validate template if provided**
   - Check template exists and belongs to tenant
   - Verify template is active
   - Use default template if not provided

8. **Get default template if needed**
   - Query ReceiptTemplate with is_default=True
   - Filter by tenant
   - Raise error if no default template exists

9. **Determine receipt type**
   - Use provided receipt_type if valid
   - Otherwise, infer from transaction type
   - Map transaction types to receipt types

10. **Call ReceiptGenerator service**
    - Import ReceiptGenerator class
    - Instantiate with transaction and template
    - Call generate() method
    - Capture generated receipt instance

11. **Handle auto-print if requested**
    - Check auto_print parameter
    - Get default printer for terminal
    - Queue print job via Celery task
    - Don't wait for print completion

12. **Handle email if requested**
    - Check email_to parameter
    - Validate email format
    - Queue email task via Celery
    - Don't wait for email completion

13. **Track generation metrics**
    - Log receipt generation event
    - Record generation time
    - Track template usage
    - Update transaction status

14. **Serialize and return response**
    - Use ReceiptSerializer for response
    - Include generated receipt data
    - Add status flags (printed, emailed)
    - Return 201 Created status

15. **Add error handling**
    - Catch generation errors
    - Handle template errors
    - Handle printer errors
    - Return appropriate status codes

### Generate Receipt Endpoint

**URL:** `POST /api/v1/pos/receipts/transactions/{transaction_id}/receipt/`

**Request Body:**
```json
{
    "template_id": "uuid-optional",
    "receipt_type": "SALE",
    "auto_print": true,
    "email_to": "customer@email.com",
    "regenerate": false
}
```

**Response (201 Created):**
```json
{
    "id": "receipt-uuid",
    "receipt_number": "RCP-2024-0001",
    "receipt_type": "SALE",
    "generated_at": "2024-01-15T14:30:00Z",
    "transaction_detail": {
        "transaction_number": "TXN-2024-0001",
        "total_amount": "2047.00"
    },
    "receipt_data": {
        "header": {...},
        "items": [...],
        "totals": {...}
    },
    "is_printed": false,
    "is_emailed": false,
    "pdf_url": "/api/v1/pos/receipts/{id}/pdf/",
    "email_url": "/api/v1/pos/receipts/{id}/email/",
    "print_url": "/api/v1/pos/receipts/{id}/print/",
    "actions": {
        "print_queued": true,
        "email_queued": true
    }
}
```

### Transaction to Receipt Type Mapping

| Transaction Type | Receipt Type |
|------------------|--------------|
| SALE | SALE |
| RETURN | RETURN |
| REFUND | REFUND |
| VOID | VOID |
| EXCHANGE | EXCHANGE |
| LAYAWAY | LAYAWAY |

### Generation Workflow

```
[Receive Request]
        ↓
[Validate Transaction] ─→ [Not Found] → Return 404
        ↓
[Check Existing Receipt] ─→ [Exists] → Return existing (unless regenerate=true)
        ↓
[Get/Validate Template] ─→ [Invalid] → Return 400
        ↓
[Call ReceiptGenerator]
        ↓
[Save Receipt]
        ↓
[Queue Print Job] (if auto_print)
        ↓
[Queue Email Task] (if email_to)
        ↓
[Return Response]
```

### Error Scenarios

| Error | Status | Message |
|-------|--------|---------|
| Transaction not found | 404 | "Transaction not found" |
| Transaction incomplete | 400 | "Cannot generate receipt for incomplete transaction" |
| Template not found | 404 | "Receipt template not found" |
| No default template | 400 | "No default receipt template configured" |
| Generation failed | 500 | "Failed to generate receipt: {error}" |
| Invalid email | 400 | "Invalid email address" |

### Expected Outcome
```
apps/pos/receipts/
├── views/
│   ├── __init__.py
│   └── receipt.py              # ReceiptViewSet with generate action
```

### Verification Checklist
- [ ] Generate endpoint added to ReceiptViewSet
- [ ] Transaction validation working
- [ ] Existing receipt check implemented
- [ ] Template selection logic correct
- [ ] ReceiptGenerator service called
- [ ] Auto-print queuing works
- [ ] Email queuing works
- [ ] Response includes all required data
- [ ] Error handling comprehensive
- [ ] Tenant isolation enforced

---

## Diagrams

### Receipt API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │ ReceiptViewSet   │      │TemplateViewSet   │           │
│  │                  │      │                  │           │
│  │ • list()         │      │ • list()         │           │
│  │ • retrieve()     │      │ • create()       │           │
│  │ • create()       │      │ • update()       │           │
│  │ • generate()     │◄─────┤ • delete()       │           │
│  │ • print()        │      │ • set_default()  │           │
│  │ • email()        │      └──────────────────┘           │
│  │ • download()     │                                      │
│  └────────┬─────────┘                                      │
│           │                                                 │
└───────────┼─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Serializer Layer                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │ReceiptSerializer │      │TemplateSerializer│           │
│  │                  │      │                  │           │
│  │ • Validation     │      │ • Validation     │           │
│  │ • Formatting     │      │ • Layout Config  │           │
│  │ • Nested Data    │      │ • Style Rules    │           │
│  │ • URL Generation │      │ • Defaults       │           │
│  └────────┬─────────┘      └────────┬─────────┘           │
│           │                         │                      │
└───────────┼─────────────────────────┼───────────────────────┘
            │                         │
            ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Model Layer                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │ Receipt Model    │      │Template Model    │           │
│  │                  │      │                  │           │
│  │ • receipt_number │      │ • name           │           │
│  │ • receipt_type   │      │ • layout_config  │           │
│  │ • receipt_data   │◄─────┤ • is_default     │           │
│  │ • is_printed     │      │ • paper_size     │           │
│  │ • is_emailed     │      └──────────────────┘           │
│  └──────────────────┘                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Receipt Generation Flow

```
┌──────────────┐
│   Client     │
│  (POS App)   │
└──────┬───────┘
       │
       │ POST /transactions/{id}/receipt/
       │ { template_id, auto_print, email_to }
       │
       ▼
┌──────────────────────────────────────────────┐
│         ReceiptViewSet                       │
│   generate_from_transaction()                │
└──────┬───────────────────────────────────────┘
       │
       │ 1. Validate transaction
       │
       ▼
┌──────────────────────────────────────────────┐
│      Transaction Validation                  │
│  • Exists?                                   │
│  • Belongs to tenant?                        │
│  • Status = COMPLETED?                       │
└──────┬───────────────────────────────────────┘
       │
       │ 2. Check existing receipt
       │
       ▼
┌──────────────────────────────────────────────┐
│       Receipt Existence Check                │
│  • Receipt exists for transaction?           │
│  • Regenerate flag = true?                   │
└──────┬───────────────────────────────────────┘
       │
       │ 3. Get template
       │
       ▼
┌──────────────────────────────────────────────┐
│       Template Resolution                    │
│  • Use provided template_id?                 │
│  • Use default template?                     │
│  • Validate template active?                 │
└──────┬───────────────────────────────────────┘
       │
       │ 4. Generate receipt
       │
       ▼
┌──────────────────────────────────────────────┐
│       ReceiptGenerator Service               │
│  • Format receipt data                       │
│  • Apply template layout                     │
│  • Generate receipt_number                   │
│  • Save Receipt instance                     │
└──────┬───────────────────────────────────────┘
       │
       │ 5. Handle actions
       │
       ├─────────────┬─────────────┐
       │             │             │
       ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Print   │  │  Email   │  │  Store   │
│  Queue   │  │  Queue   │  │  PDF     │
│ (Celery) │  │ (Celery) │  │          │
└──────────┘  └──────────┘  └──────────┘
       │             │             │
       └─────────────┴─────────────┘
                     │
                     │ 6. Return response
                     │
                     ▼
            ┌────────────────┐
            │ ReceiptSerializer
            │ • Format data   │
            │ • Add URLs     │
            │ • Return JSON  │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │    Client      │
            │  (201 Created) │
            └────────────────┘
```

### Serializer Field Mapping

```
┌─────────────────────────────────────────────────────────┐
│              Receipt Model                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  id (UUID)                                              │
│  receipt_number (CharField)                             │
│  receipt_type (CharField)                               │
│  transaction (ForeignKey)                               │
│  customer (ForeignKey)                                  │
│  template (ForeignKey)                                  │
│  receipt_data (JSONField)                               │
│  is_printed (BooleanField)                              │
│  is_emailed (BooleanField)                              │
│  generated_at (DateTimeField)                           │
│  created_at (DateTimeField)                             │
│  updated_at (DateTimeField)                             │
│                                                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Serialization
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           ReceiptSerializer Output                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  {                                                       │
│    "id": "uuid",                                        │
│    "receipt_number": "RCP-2024-0001",                   │
│    "receipt_type": "SALE",                              │
│    "generated_at": "2024-01-15T14:30:00Z",             │
│                                                          │
│    "transaction_detail": {        ◄── Nested            │
│      "transaction_number": "...", │                     │
│      "total_amount": "..."        │                     │
│    },                             │                     │
│                                   │                     │
│    "customer_detail": {           ◄── Nested            │
│      "name": "...",               │                     │
│      "email": "..."               │                     │
│    },                             │                     │
│                                   │                     │
│    "template_detail": {           ◄── Nested            │
│      "name": "...",               │                     │
│      "paper_size": "..."          │                     │
│    },                             │                     │
│                                   │                     │
│    "receipt_data": { ... },       ◄── JSONField         │
│                                                          │
│    "is_printed": true,                                  │
│    "is_emailed": false,                                 │
│                                                          │
│    "pdf_url": "...",              ◄── Computed          │
│    "email_url": "...",            ◄── Computed          │
│    "print_url": "...",            ◄── Computed          │
│    "detail_url": "..."            ◄── Computed          │
│  }                                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## End of Document 01

**Next Steps:**
- Proceed to [02_Tasks-73-78_Actions-Search-Export.md](02_Tasks-73-78_Actions-Search-Export.md) for print, email, PDF, search, and export endpoints
- Review ViewSet permissions and authentication requirements
- Test serializer validation with various receipt data structures

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Tasks Completed:** 69, 70, 71, 72  
**Remaining in Group:** Tasks 73-78
