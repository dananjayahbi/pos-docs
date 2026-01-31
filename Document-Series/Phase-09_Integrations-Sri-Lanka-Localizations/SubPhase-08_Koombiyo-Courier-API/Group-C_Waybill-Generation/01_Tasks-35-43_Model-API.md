# Tasks 35-43: Waybill Model and API Integration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** C - Waybill Generation  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-B_API-Client-Implementation/02_Tasks-27-34_Provider-Verify.md](../Group-B_API-Client-Implementation/02_Tasks-27-34_Provider-Verify.md)
- **→ Next Document:** [02_Tasks-44-50_Payload-PDF-Verify.md](02_Tasks-44-50_Payload-PDF-Verify.md)

---

## Document Overview

This document covers the creation of the Waybill model and the core API integration with Koombiyo's waybill generation endpoint. It establishes the database structure for storing waybill information, implements the relationship with orders, and creates the service layer for generating waybills with proper sender and receiver data formatting.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create Waybill Model | Medium | 30 min |
| 36 | Create Order FK | Low | 15 min |
| 37 | Create Waybill Number | Low | 15 min |
| 38 | Create Barcode Field | Low | 15 min |
| 39 | Create Status Field | Low | 20 min |
| 40 | Create PDF URL Field | Low | 15 min |
| 41 | Create create_waybill API | High | 45 min |
| 42 | Create Sender Data | Medium | 25 min |
| 43 | Create Receiver Data | Medium | 25 min |

---

## Task 35: Create Waybill Model

### Overview
Create the Django model for storing waybill information. This model represents a shipping waybill generated through the Koombiyo API and contains all necessary fields for tracking, displaying, and managing shipment labels. The model inherits from appropriate base models and includes tenant-aware fields.

### Dependencies
- SubPhase-02 (Django Tenants Installation) must be complete
- SubPhase-03 (Base Models Mixins) must be complete
- Order model must exist
- Koombiyo configuration (Task 34) must be complete

### Instructions

1. **Create waybill models file**
   - Navigate to `backend/apps/shipping/models/` directory
   - Create new file named `waybill.py`
   - Import required Django model classes and base mixins

2. **Import dependencies**
   - Import Django models module
   - Import base model mixins (TimestampMixin, TenantAwareMixin, SoftDeleteMixin)
   - Import Order model from orders app
   - Import validators and choices

3. **Define Waybill model class**
   - Create class named `Waybill`
   - Inherit from appropriate base mixins
   - Add model docstring describing purpose

4. **Add model metadata**
   - Define Meta class with table name
   - Set ordering (created_at descending)
   - Add indexes for query optimization
   - Configure verbose names

5. **Implement string representation**
   - Override `__str__` method
   - Return waybill number or meaningful identifier
   - Handle cases where waybill number may not exist yet

6. **Add model manager (if needed)**
   - Create custom manager for tenant-aware queries
   - Add methods for common query patterns
   - Override default queryset behavior

7. **Export model in __init__.py**
   - Add Waybill to models package exports
   - Ensure model is accessible from shipping.models

### Waybill Model Structure

```
Waybill Model
├── Inherited Fields
│   ├── id (UUID, primary key)
│   ├── created_at (timestamp)
│   ├── updated_at (timestamp)
│   ├── deleted_at (soft delete)
│   └── tenant (foreign key)
├── Relationship Fields
│   └── order (foreign key) → Task 36
├── Waybill Data Fields
│   ├── waybill_number → Task 37
│   ├── barcode → Task 38
│   ├── status → Task 39
│   └── pdf_url → Task 40
└── Additional Fields
    ├── courier_provider (CharField)
    ├── tracking_url (URLField, optional)
    ├── notes (TextField, optional)
    └── metadata (JSONField, optional)
```

### Model Inheritance Diagram

```
TimestampMixin ──┐
                  ├─→ Waybill
TenantAwareMixin ─┤
                  │
SoftDeleteMixin ──┘
```

### Model Purpose

| Aspect | Description |
|--------|-------------|
| Core Purpose | Store waybill data from Koombiyo API |
| Relationship | Links orders to courier shipments |
| Lifecycle | Created when order ships, updated with tracking |
| Data Source | Populated from Koombiyo API responses |

### Database Considerations

| Consideration | Implementation |
|---------------|----------------|
| Tenant Isolation | Schema-based via django-tenants |
| Query Performance | Index on order_id, waybill_number, status |
| Soft Deletes | Use SoftDeleteMixin for audit trail |
| Data Integrity | Foreign key constraints with PROTECT |

### Expected Outcome
- Functional Waybill model with proper inheritance
- Model registered in Django admin (if applicable)
- Model available for import from shipping.models
- Ready to add specific fields in subsequent tasks

### Verification Checklist
- [ ] `backend/apps/shipping/models/waybill.py` file created
- [ ] Waybill class defined with proper inheritance
- [ ] Model docstring added
- [ ] Meta class configured
- [ ] `__str__` method implemented
- [ ] Model exported in `__init__.py`
- [ ] No syntax errors when importing model

---

## Task 36: Create Order FK

### Overview
Add the foreign key relationship between the Waybill model and the Order model. This establishes the one-to-many relationship where each order can have multiple waybills (in case of re-shipment or multiple packages), but each waybill belongs to exactly one order.

### Dependencies
- Task 35: Create Waybill Model
- Order model must exist in orders app

### Instructions

1. **Import Order model**
   - Add import statement for Order model
   - Use string reference if circular import issues exist
   - Example: `'orders.Order'` instead of direct import

2. **Add order field to Waybill model**
   - Define ForeignKey field named `order`
   - Set reference to Order model
   - Configure on_delete behavior

3. **Configure on_delete behavior**
   - Use `models.PROTECT` to prevent order deletion with waybills
   - This ensures data integrity for shipped orders
   - Alternative: Use `models.CASCADE` with careful consideration

4. **Add related_name**
   - Set related_name to `'waybills'` or `'shipping_waybills'`
   - Allows reverse lookup from Order to Waybills
   - Usage: `order.waybills.all()`

5. **Add field constraints**
   - Set `null=False` to make field required
   - Set `blank=False` for form validation
   - Add database index for query performance

6. **Add helpful properties**
   - Consider adding property to get order number
   - Consider adding property to get customer info
   - These simplify template rendering and API serialization

7. **Update admin configuration (if applicable)**
   - Add order field to admin list display
   - Add order filter to admin filters
   - Configure order field as read-only in certain contexts

### Foreign Key Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| to | `'orders.Order'` | Target model |
| on_delete | `models.PROTECT` | Prevent data loss |
| related_name | `'waybills'` | Reverse relationship |
| null | `False` | Required field |
| blank | `False` | Form validation |
| db_index | `True` | Query optimization |

### Relationship Diagram

```
Order (orders app)
    │
    │ One-to-Many
    │
    ▼
Waybill (shipping app)
    ├── waybill_1 (original shipment)
    ├── waybill_2 (re-shipment)
    └── waybill_3 (replacement)
```

### Usage Examples

| Context | Code Pattern |
|---------|--------------|
| Get waybills from order | `order.waybills.all()` |
| Get order from waybill | `waybill.order` |
| Filter waybills by order | `Waybill.objects.filter(order=order)` |
| Count order waybills | `order.waybills.count()` |

### Data Integrity Considerations

| Scenario | Behavior with PROTECT |
|----------|------------------------|
| Delete order with waybills | Raises ProtectedError |
| Delete waybill | Succeeds, order unaffected |
| Order soft-deleted | Waybills remain accessible |
| Tenant isolation | Automatic via schema |

### Expected Outcome
- Order foreign key field added to Waybill model
- Proper relationship configuration with PROTECT behavior
- Related name allows reverse lookups from Order
- Database indexes optimize query performance

### Verification Checklist
- [ ] Order field added to Waybill model
- [ ] ForeignKey points to Order model
- [ ] on_delete set to PROTECT
- [ ] related_name configured
- [ ] null and blank set appropriately
- [ ] Database index added
- [ ] Can access order from waybill instance
- [ ] Can access waybills from order instance

---

## Task 37: Create Waybill Number

### Overview
Add the waybill_number field to store the unique tracking identifier provided by Koombiyo API. This field is the primary tracking reference for the shipment and must be unique within the tenant schema. The waybill number is generated by Koombiyo and returned in the API response.

### Dependencies
- Task 35: Create Waybill Model

### Instructions

1. **Add waybill_number field**
   - Define CharField field named `waybill_number`
   - Set appropriate max_length (typically 50-100 characters)
   - Configure field as unique within tenant

2. **Configure field constraints**
   - Set `max_length=100` to accommodate various formats
   - Set `unique=True` to prevent duplicates
   - Set `null=True, blank=True` initially (populated after API call)
   - Add database index for lookup performance

3. **Add field validators**
   - Consider adding regex validator for format checking
   - Add validator to ensure uppercase if needed
   - Validate alphanumeric characters only

4. **Add helpful methods**
   - Create property to format waybill number for display
   - Create method to generate tracking URL
   - Create method to check if waybill is assigned

5. **Update model string representation**
   - Consider using waybill_number in `__str__` method
   - Provide fallback if waybill_number not yet assigned
   - Format: "Waybill #KBY12345"

6. **Add admin configuration**
   - Make field searchable in Django admin
   - Add to list display with prominent placement
   - Make field read-only after creation (populated by API)

7. **Document field usage**
   - Add field docstring or help_text
   - Document that value comes from Koombiyo API
   - Note field is populated during waybill creation

### Waybill Number Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | CharField | Text storage |
| max_length | 100 | Accommodate various formats |
| unique | True | Prevent duplicates |
| null | True | Allow creation before API call |
| blank | True | Form validation |
| db_index | True | Fast lookups |
| help_text | "Unique waybill number from Koombiyo" | Documentation |

### Waybill Number Format Examples

| Courier | Format Example | Pattern |
|---------|---------------|---------|
| Koombiyo | KBY123456789 | KBY + 9 digits |
| Koombiyo | KMB-20260131-001 | Prefix + date + sequence |
| Koombiyo | 2026013100001234 | Date + sequence |

### Field State Lifecycle

```
Waybill Creation
    ├── Initial State: waybill_number = NULL
    ├── API Call: create_waybill(order_data)
    ├── API Response: { waybill_number: "KBY123456789" }
    └── Update: waybill.waybill_number = "KBY123456789"
```

### Usage Patterns

| Context | Implementation |
|---------|----------------|
| Display in template | `{{ waybill.waybill_number }}` |
| Generate tracking URL | `waybill.get_tracking_url()` |
| Search by number | `Waybill.objects.get(waybill_number=number)` |
| Check if assigned | `if waybill.waybill_number:` |

### Uniqueness Considerations

| Aspect | Implementation |
|--------|----------------|
| Tenant Scope | Unique within tenant schema |
| Database Level | Unique constraint in database |
| Application Level | Validation in model clean() |
| Error Handling | Catch IntegrityError on duplicate |

### Expected Outcome
- waybill_number field added to model
- Unique constraint enforced at database level
- Field nullable to allow creation before API response
- Fast lookups via database index

### Verification Checklist
- [ ] waybill_number field added as CharField
- [ ] max_length set appropriately
- [ ] unique=True configured
- [ ] null=True, blank=True for initial state
- [ ] Database index added
- [ ] help_text or docstring provided
- [ ] Admin configuration updated
- [ ] Can query by waybill_number efficiently

---

## Task 38: Create Barcode Field

### Overview
Add the barcode field to store the barcode value provided by Koombiyo API. This barcode is used for scanning packages during pickup, transit, and delivery. The barcode value is typically alphanumeric and may be displayed as a barcode image in labels.

### Dependencies
- Task 35: Create Waybill Model

### Instructions

1. **Add barcode field**
   - Define CharField field named `barcode`
   - Set max_length similar to waybill_number
   - Configure field to accept alphanumeric values

2. **Configure field properties**
   - Set `max_length=100` for flexibility
   - Set `null=True, blank=True` (populated by API)
   - Add database index for scanning lookups
   - Set `unique=False` unless required by Koombiyo

3. **Add field validation**
   - Validate barcode format if specific pattern required
   - Consider uppercase conversion for consistency
   - Validate character set (alphanumeric, no special chars)

4. **Add barcode utility methods**
   - Create method to generate barcode image (if needed)
   - Create method to format barcode for display
   - Create method to validate barcode format

5. **Document barcode usage**
   - Add help_text explaining purpose
   - Document relationship to waybill_number
   - Note that barcode may differ from waybill_number

6. **Consider barcode image generation**
   - Plan for barcode image generation (future task)
   - Consider using python-barcode library
   - Store generated image path or URL

7. **Update admin interface**
   - Add barcode to list display
   - Make field searchable
   - Display barcode in detail view

### Barcode Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | CharField | Text storage |
| max_length | 100 | Barcode string |
| unique | False | Not globally unique |
| null | True | Populated by API |
| blank | True | Form validation |
| db_index | True | Scanning lookups |
| help_text | "Barcode for package scanning" | Documentation |

### Barcode vs Waybill Number

| Aspect | Waybill Number | Barcode |
|--------|---------------|---------|
| Purpose | Human tracking reference | Machine scanning |
| Format | Alphanumeric string | Scannable code |
| Display | Text in emails, forms | Image on label |
| Uniqueness | Globally unique | May be same as waybill |
| Source | Koombiyo API response | Koombiyo API response |

### Barcode Lifecycle

```
API Response
    ├── waybill_number: "KBY123456789"
    └── barcode: "123456789" or "KBY123456789"
            │
            ├── Store in database
            ├── Generate barcode image (Task 48)
            └── Print on label PDF
```

### Barcode Types Supported

| Type | Format | Usage |
|------|--------|-------|
| Code 128 | Alphanumeric | Most common |
| Code 39 | Alphanumeric + symbols | Legacy systems |
| EAN-13 | 13 digits | Product barcodes |
| QR Code | Any data | Mobile scanning |

### Usage Patterns

| Context | Implementation |
|---------|----------------|
| Store barcode value | `waybill.barcode = response['barcode']` |
| Display barcode | `{{ waybill.barcode }}` |
| Generate image | `generate_barcode(waybill.barcode)` |
| Scan lookup | `Waybill.objects.get(barcode=scanned_value)` |

### Expected Outcome
- barcode field added to Waybill model
- Field configured to accept API response data
- Database index for scanning lookups
- Ready for barcode image generation in later tasks

### Verification Checklist
- [ ] barcode field added as CharField
- [ ] max_length set appropriately
- [ ] null=True, blank=True configured
- [ ] Database index added
- [ ] help_text provided
- [ ] Admin configuration updated
- [ ] Can store and retrieve barcode values

---

## Task 39: Create Status Field

### Overview
Add the status field to track the shipment lifecycle through various stages from creation to delivery. This field uses predefined choices to represent different states in the shipping process, allowing the system to display current shipment status to customers and staff.

### Dependencies
- Task 35: Create Waybill Model

### Instructions

1. **Define status choices**
   - Create choices tuple or TextChoices class
   - Define all possible waybill states
   - Use descriptive labels for display

2. **Add status field to model**
   - Define CharField field named `status`
   - Set choices parameter to status choices
   - Set appropriate max_length for choice values

3. **Configure field properties**
   - Set `max_length=20` for choice codes
   - Set `default` to initial status (PENDING)
   - Set `null=False` to make required
   - Add database index for filtering

4. **Define status values**
   - PENDING: Waybill created, awaiting pickup
   - PICKED_UP: Package collected by courier
   - IN_TRANSIT: Package in transit
   - OUT_FOR_DELIVERY: Out for delivery
   - DELIVERED: Successfully delivered
   - FAILED: Delivery failed
   - RETURNED: Returned to sender

5. **Add status helper methods**
   - Create method `is_delivered()` for checking completion
   - Create method `is_active()` for in-progress shipments
   - Create method `can_cancel()` for cancellation logic
   - Create method `get_status_display_color()` for UI

6. **Add status validation**
   - Validate status transitions (state machine)
   - Prevent invalid status changes
   - Log status change history

7. **Document status workflow**
   - Add docstring explaining status flow
   - Document valid status transitions
   - Note webhook updates for status changes

### Status Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | CharField | Text with choices |
| max_length | 20 | Status code |
| choices | StatusChoices | Valid values |
| default | 'PENDING' | Initial state |
| null | False | Always required |
| blank | False | Form validation |
| db_index | True | Status filtering |

### Status Choices Definition

| Status Code | Display Label | Description |
|-------------|---------------|-------------|
| PENDING | Pending Pickup | Waybill created, awaiting pickup |
| PICKED_UP | Picked Up | Package collected by courier |
| IN_TRANSIT | In Transit | Package en route to destination |
| OUT_FOR_DELIVERY | Out for Delivery | Package out for final delivery |
| DELIVERED | Delivered | Successfully delivered |
| FAILED | Delivery Failed | Delivery attempt failed |
| RETURNED | Returned to Sender | Package returned |

### Status Transition Diagram

```
PENDING
    │
    ▼
PICKED_UP
    │
    ▼
IN_TRANSIT
    │
    ├──→ OUT_FOR_DELIVERY
    │        │
    │        ├──→ DELIVERED ✓
    │        │
    │        └──→ FAILED
    │                 │
    │                 └──→ RETURNED
    │
    └──→ RETURNED
```

### Valid Status Transitions

| Current Status | Valid Next States |
|----------------|-------------------|
| PENDING | PICKED_UP, RETURNED |
| PICKED_UP | IN_TRANSIT, RETURNED |
| IN_TRANSIT | OUT_FOR_DELIVERY, RETURNED |
| OUT_FOR_DELIVERY | DELIVERED, FAILED |
| FAILED | OUT_FOR_DELIVERY, RETURNED |
| DELIVERED | (final state) |
| RETURNED | (final state) |

### Status Display Colors

| Status | Color | Tailwind Class |
|--------|-------|----------------|
| PENDING | Yellow | text-yellow-600 |
| PICKED_UP | Blue | text-blue-600 |
| IN_TRANSIT | Blue | text-blue-600 |
| OUT_FOR_DELIVERY | Indigo | text-indigo-600 |
| DELIVERED | Green | text-green-600 |
| FAILED | Red | text-red-600 |
| RETURNED | Orange | text-orange-600 |

### Status Helper Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| is_delivered() | Boolean | Check if successfully delivered |
| is_active() | Boolean | Check if in progress |
| is_final() | Boolean | Check if in final state |
| can_cancel() | Boolean | Check if cancellable |
| get_status_color() | String | Get UI color class |

### Expected Outcome
- status field with choices added to model
- Default status set to PENDING
- Status display method available via Django
- Database index for efficient filtering

### Verification Checklist
- [ ] status field added as CharField
- [ ] Status choices defined (TextChoices or tuple)
- [ ] max_length configured appropriately
- [ ] default='PENDING' set
- [ ] null=False, blank=False configured
- [ ] Database index added
- [ ] Can display human-readable status
- [ ] Can filter by status efficiently

---

## Task 40: Create PDF URL Field

### Overview
Add the pdf_url field to store the URL of the shipping label PDF provided by Koombiyo API. This URL points to the waybill label that can be downloaded and printed. The URL may be temporary or permanent depending on Koombiyo's implementation.

### Dependencies
- Task 35: Create Waybill Model

### Instructions

1. **Add pdf_url field**
   - Define URLField field named `pdf_url`
   - Set max_length for long URLs
   - Configure as optional initially

2. **Configure field properties**
   - Set `max_length=500` for long URLs
   - Set `null=True, blank=True` (populated by API)
   - Set `help_text` to describe purpose
   - No unique constraint needed

3. **Add URL validation**
   - URLField provides basic URL validation
   - Consider custom validator for Koombiyo domain
   - Validate HTTPS for security

4. **Add PDF helper methods**
   - Create method `has_pdf()` to check if URL exists
   - Create method `get_pdf_filename()` to extract filename
   - Create method `is_pdf_expired()` if URLs are temporary
   - Create method `download_pdf()` for local storage (Task 48)

5. **Handle URL expiration**
   - Document URL expiration policy if applicable
   - Plan for re-downloading expired URLs
   - Consider storing local copy (Task 49)

6. **Add admin configuration**
   - Display URL as clickable link in admin
   - Add "Download PDF" action in admin
   - Show PDF preview if possible

7. **Document PDF handling**
   - Add docstring explaining URL source
   - Document URL format and domain
   - Note local storage alternative (Task 49)

### PDF URL Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | URLField | URL validation |
| max_length | 500 | Long URLs |
| null | True | Optional field |
| blank | True | Form validation |
| help_text | "URL to shipping label PDF" | Documentation |

### PDF URL Format Examples

| Pattern | Example |
|---------|---------|
| Direct URL | `https://api.koombiyo.lk/labels/KBY123456789.pdf` |
| Signed URL | `https://s3.amazonaws.com/koombiyo-labels/...?signature=...` |
| CDN URL | `https://cdn.koombiyo.lk/labels/2026/01/31/KBY123456789.pdf` |

### PDF URL Lifecycle

```
API Response
    ├── pdf_url: "https://api.koombiyo.lk/labels/KBY123.pdf"
    │
    ├── Store URL in database
    │
    ├── Download PDF (Task 48)
    │
    └── Store locally (Task 49)
        ├── Local path: /media/waybills/{tenant}/{order}/label.pdf
        └── Update waybill with local path
```

### URL Storage Strategies

| Strategy | Pros | Cons |
|----------|------|------|
| Store URL only | Simple, no storage cost | URL may expire |
| Download and store | Permanent access | Storage cost |
| Hybrid | Fast access, backup available | More complex |

### PDF Helper Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| has_pdf() | Boolean | Check if PDF URL exists |
| get_pdf_url() | String | Get PDF URL with fallback |
| download_pdf() | File | Download PDF from URL |
| get_local_path() | Path | Get local storage path |

### URL Security Considerations

| Aspect | Implementation |
|--------|----------------|
| HTTPS Only | Validate https:// protocol |
| Domain Validation | Check Koombiyo domain |
| URL Expiration | Handle expired URLs gracefully |
| Access Control | Tenant-based access control |

### Expected Outcome
- pdf_url field added to Waybill model
- URLField provides automatic URL validation
- Field nullable to allow creation before API response
- Helper methods for PDF access and download

### Verification Checklist
- [ ] pdf_url field added as URLField
- [ ] max_length=500 configured
- [ ] null=True, blank=True set
- [ ] help_text provided
- [ ] Can store URL from API response
- [ ] URL validation works correctly
- [ ] Admin displays URL as clickable link

---

## Task 41: Create create_waybill API

### Overview
Implement the create_waybill method in the Koombiyo service class to call the Koombiyo API's waybill creation endpoint. This method orchestrates the entire waybill generation process: building the request payload with sender, receiver, package, and COD data, making the API call, handling the response, and creating the Waybill model instance.

### Dependencies
- Task 35: Create Waybill Model
- Task 34: Koombiyo Provider Registration (Group B)
- Tasks 27-33: API Client Implementation (Group B)
- Order model with shipping address data

### Instructions

1. **Create waybill service module**
   - Navigate to `backend/apps/shipping/services/` directory
   - Create file named `waybill_service.py`
   - Import Koombiyo client and Waybill model

2. **Define create_waybill method signature**
   - Create method `create_waybill(order, **kwargs)`
   - Accept order instance as primary parameter
   - Accept optional parameters for customization
   - Return Waybill instance or raise exception

3. **Validate input data**
   - Check order has shipping address
   - Check order has valid customer phone
   - Check tenant has Koombiyo configuration
   - Raise ValidationError if requirements not met

4. **Build waybill payload**
   - Call sender data builder (Task 42)
   - Call receiver data builder (Task 43)
   - Call package data builder (Task 44)
   - Call COD data builder if applicable (Task 45)
   - Call items description builder (Task 46)
   - Combine all data into request payload

5. **Make API request**
   - Get Koombiyo client instance
   - Call waybill creation endpoint
   - Pass authentication headers
   - Handle request timeout appropriately

6. **Handle API response**
   - Check response status code
   - Parse response JSON (Task 47)
   - Extract waybill_number, barcode, pdf_url
   - Handle API errors gracefully

7. **Create Waybill instance**
   - Create new Waybill object with order FK
   - Populate waybill_number from response
   - Populate barcode from response
   - Populate pdf_url from response
   - Set status to PENDING
   - Save to database

8. **Implement error handling**
   - Catch API connection errors
   - Catch API validation errors
   - Catch response parsing errors
   - Log errors for debugging
   - Raise appropriate exceptions

9. **Add transaction management**
   - Wrap in database transaction
   - Rollback on API failures
   - Ensure data consistency

10. **Add logging**
    - Log API request details
    - Log API response
    - Log created waybill
    - Use appropriate log levels

### create_waybill Method Flow

```
create_waybill(order)
    │
    ├──→ Validate order data
    │       ├── Has shipping address?
    │       ├── Has customer phone?
    │       └── Tenant configured?
    │
    ├──→ Build payload
    │       ├── Sender data (Task 42)
    │       ├── Receiver data (Task 43)
    │       ├── Package data (Task 44)
    │       ├── COD data (Task 45)
    │       └── Items description (Task 46)
    │
    ├──→ Call API
    │       ├── POST /api/v1/waybill/create
    │       ├── Headers: API key, tenant
    │       └── Body: payload JSON
    │
    ├──→ Parse response (Task 47)
    │       ├── Extract waybill_number
    │       ├── Extract barcode
    │       └── Extract pdf_url
    │
    └──→ Create Waybill model
            ├── Set order FK
            ├── Set waybill_number
            ├── Set barcode
            ├── Set pdf_url
            ├── Set status = PENDING
            └── Save to database
```

### Method Signature

```python
def create_waybill(
    order: Order,
    pickup_address: Optional[Address] = None,
    custom_weight: Optional[float] = None,
    custom_dimensions: Optional[dict] = None,
    notes: Optional[str] = None
) -> Waybill:
```

### Input Validation Rules

| Validation | Check | Error Message |
|------------|-------|---------------|
| Order exists | `order is not None` | "Order is required" |
| Shipping address | `order.shipping_address` | "Order missing shipping address" |
| Customer phone | `order.customer.phone` | "Customer phone required" |
| Tenant config | `tenant.koombiyo_config` | "Koombiyo not configured" |
| Order status | `order.is_paid()` | "Order must be paid" |

### Request Payload Structure

```json
{
  "sender": {
    // Task 42: Sender Data
  },
  "receiver": {
    // Task 43: Receiver Data
  },
  "package": {
    // Task 44: Package Data
  },
  "cod": {
    // Task 45: COD Data (if applicable)
  },
  "items": {
    // Task 46: Items Description
  },
  "service_type": "standard",
  "reference": "ORDER-12345"
}
```

### API Endpoint Details

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/api/v1/waybill/create` |
| Content-Type | application/json |
| Auth | API Key in header |
| Timeout | 30 seconds |

### Response Handling

| Response Code | Action |
|---------------|--------|
| 200 OK | Parse response, create Waybill |
| 400 Bad Request | ValidationError with details |
| 401 Unauthorized | ConfigurationError (invalid API key) |
| 500 Server Error | APIError, retry logic |
| Timeout | APIError, alert admin |

### Error Handling Strategy

| Error Type | Exception Class | Recovery Action |
|------------|----------------|-----------------|
| Missing data | ValidationError | Display to user |
| API down | APIConnectionError | Retry after delay |
| Invalid API key | ConfigurationError | Alert admin |
| Malformed response | ResponseParseError | Log and alert |

### Transaction Management

```
Begin Transaction
    │
    ├──→ Create Waybill instance
    ├──→ Call API
    ├──→ Update Waybill with response data
    ├──→ Save Waybill
    │
    ├──→ Success: Commit transaction
    │
    └──→ Failure: Rollback transaction
```

### Logging Requirements

| Event | Log Level | Details to Log |
|-------|-----------|----------------|
| Method called | INFO | Order ID, tenant |
| Payload built | DEBUG | Payload JSON |
| API request | INFO | Endpoint, headers (no key) |
| API response | INFO | Status code, waybill_number |
| Waybill created | INFO | Waybill ID, number |
| Error occurred | ERROR | Exception details, traceback |

### Expected Outcome
- Functional create_waybill method in service class
- Complete waybill creation workflow
- Proper error handling and logging
- Transaction safety for data consistency

### Verification Checklist
- [ ] waybill_service.py file created
- [ ] create_waybill method defined
- [ ] Input validation implemented
- [ ] Payload building orchestration (calls Tasks 42-46)
- [ ] API client integration
- [ ] Response parsing (Task 47)
- [ ] Waybill model creation
- [ ] Error handling implemented
- [ ] Transaction management added
- [ ] Logging statements added
- [ ] Method returns Waybill instance

---

## Task 42: Create Sender Data

### Overview
Implement the build_sender_data method that constructs the sender information section of the waybill request payload. This data represents the pickup location (merchant/warehouse address) and is typically derived from the tenant's configuration or warehouse settings.

### Dependencies
- Task 41: Create create_waybill API
- Tenant configuration model with pickup address
- Address model or settings

### Instructions

1. **Create sender data builder method**
   - Define method `build_sender_data(order, **kwargs)`
   - Return dictionary with sender fields
   - Accept optional override parameters

2. **Retrieve sender configuration**
   - Get tenant's default pickup address
   - Get tenant's business name
   - Get tenant's contact phone
   - Get tenant's contact email (if required)

3. **Build sender data dictionary**
   - Add sender name (business name)
   - Add sender address line 1
   - Add sender address line 2 (optional)
   - Add sender city
   - Add sender postal code (if available)
   - Add sender phone number
   - Add sender email (if required)

4. **Format address data**
   - Ensure address lines are properly formatted
   - Trim whitespace from all fields
   - Ensure city name is correct format
   - Format phone number to Koombiyo requirements

5. **Validate sender data**
   - Check all required fields present
   - Validate phone number format (+94 XX XXX XXXX)
   - Validate email format if provided
   - Raise ValidationError if data incomplete

6. **Handle multiple warehouses (if applicable)**
   - Allow specifying pickup warehouse
   - Default to tenant's primary warehouse
   - Support custom pickup addresses

7. **Add data transformation**
   - Convert data to Koombiyo API format
   - Apply any field name mappings
   - Apply any value transformations

### Sender Data Fields

| Field | Source | Required | Format |
|-------|--------|----------|--------|
| name | Tenant business name | Yes | String, max 100 chars |
| address | Pickup address line 1 | Yes | String, max 200 chars |
| address2 | Pickup address line 2 | No | String, max 200 chars |
| city | Pickup city | Yes | String |
| postal_code | Pickup postal code | No | String, 5 digits |
| phone | Contact phone | Yes | +94 XX XXX XXXX |
| email | Contact email | No | Valid email |

### Sender Data Sources

| Data Point | Primary Source | Fallback Source |
|------------|---------------|-----------------|
| Business Name | Tenant.business_name | Tenant.name |
| Address | Tenant.pickup_address | Warehouse.address |
| City | Tenant.pickup_city | Warehouse.city |
| Phone | Tenant.contact_phone | User.phone |
| Email | Tenant.contact_email | Tenant.email |

### Sender Data Structure

```json
{
  "sender": {
    "name": "Colombo Fashion Store",
    "address": "No. 123, Galle Road",
    "address2": "Colombo Fort",
    "city": "Colombo",
    "postal_code": "00100",
    "phone": "+94112345678",
    "email": "shop@example.lk"
  }
}
```

### Phone Number Formatting

| Input Format | Output Format | Valid |
|-------------|---------------|-------|
| 0112345678 | +94112345678 | Yes |
| +94 11 234 5678 | +94112345678 | Yes |
| 94112345678 | +94112345678 | Yes |
| 11-234-5678 | +94112345678 | Yes |

### City Name Mapping

| Common Variations | Standard Name |
|-------------------|---------------|
| Colombo, CMB | Colombo |
| Kandy, KDY | Kandy |
| Galle, GLE | Galle |
| Negombo, NGB | Negombo |

### Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| name | Not empty, max 100 chars | "Sender name required" |
| address | Not empty, max 200 chars | "Sender address required" |
| city | Not empty, valid city | "Valid sender city required" |
| phone | +94 format, 10 digits | "Valid phone number required" |
| email | Valid email format | "Invalid email format" |

### Error Handling

| Error Condition | Exception | User Message |
|-----------------|-----------|--------------|
| No pickup address | ConfigurationError | "Pickup address not configured" |
| Invalid phone | ValidationError | "Invalid contact phone number" |
| Missing required field | ValidationError | "Sender data incomplete" |

### Expected Outcome
- Functional build_sender_data method
- Returns properly formatted sender dictionary
- Validates all required fields present
- Phone number formatted to Koombiyo requirements

### Verification Checklist
- [ ] build_sender_data method created
- [ ] Retrieves tenant configuration
- [ ] Builds sender dictionary with all fields
- [ ] Validates required fields present
- [ ] Formats phone number correctly
- [ ] Handles missing data with clear errors
- [ ] Returns dictionary matching API requirements
- [ ] Supports optional custom addresses

---

## Task 43: Create Receiver Data

### Overview
Implement the build_receiver_data method that constructs the receiver (customer) information section of the waybill request payload. This data represents the delivery destination and is derived from the order's shipping address and customer details.

### Dependencies
- Task 41: Create create_waybill API
- Order model with shipping_address relationship
- Customer model with contact details

### Instructions

1. **Create receiver data builder method**
   - Define method `build_receiver_data(order, **kwargs)`
   - Return dictionary with receiver fields
   - Accept order instance as parameter

2. **Retrieve receiver data from order**
   - Get shipping name from order.shipping_address
   - Get shipping address lines
   - Get shipping city
   - Get shipping postal code (if available)
   - Get customer phone from order.customer
   - Get customer email (if required)

3. **Build receiver data dictionary**
   - Add receiver name
   - Add receiver address line 1
   - Add receiver address line 2 (optional)
   - Add receiver city
   - Add receiver postal code (if available)
   - Add receiver phone number
   - Add receiver email (if required)

4. **Format address data**
   - Ensure address is complete and formatted
   - Trim whitespace from all fields
   - Normalize city name to Koombiyo standards
   - Format phone number correctly

5. **Validate receiver data**
   - Check all required fields present
   - Validate phone number format (+94 XX XXX XXXX)
   - Validate email format if provided
   - Validate city is in serviceable area
   - Raise ValidationError if data incomplete

6. **Handle name variations**
   - Use shipping name if provided
   - Fall back to customer name
   - Handle business deliveries
   - Ensure name is not empty

7. **Add address validation**
   - Check address is not empty
   - Check city is valid Sri Lankan city
   - Validate postal code format (5 digits)
   - Warn if address seems incomplete

### Receiver Data Fields

| Field | Source | Required | Format |
|-------|--------|----------|--------|
| name | order.shipping_name | Yes | String, max 100 chars |
| address | order.shipping_address.line1 | Yes | String, max 200 chars |
| address2 | order.shipping_address.line2 | No | String, max 200 chars |
| city | order.shipping_address.city | Yes | String |
| postal_code | order.shipping_address.postal_code | No | String, 5 digits |
| phone | order.customer.phone | Yes | +94 XX XXX XXXX |
| email | order.customer.email | No | Valid email |

### Receiver Data Sources

| Data Point | Primary Source | Fallback Source |
|------------|----------------|-----------------|
| Name | order.shipping_name | order.customer.name |
| Address Line 1 | shipping_address.line1 | shipping_address.street |
| Address Line 2 | shipping_address.line2 | shipping_address.district |
| City | shipping_address.city | shipping_address.town |
| Postal Code | shipping_address.postal_code | City default postal |
| Phone | customer.phone | shipping_address.phone |
| Email | customer.email | - |

### Receiver Data Structure

```json
{
  "receiver": {
    "name": "Nimal Perera",
    "address": "No. 456, Temple Road",
    "address2": "Nugegoda",
    "city": "Colombo",
    "postal_code": "10250",
    "phone": "+94771234567",
    "email": "nimal@example.lk"
  }
}
```

### Phone Number Handling

| Scenario | Input | Output | Action |
|----------|-------|--------|--------|
| Valid mobile | 0771234567 | +94771234567 | Format |
| Valid landline | 0112345678 | +94112345678 | Format |
| Already formatted | +94771234567 | +94771234567 | Use as-is |
| Missing | null | - | Raise error |

### City Validation

| City | Valid | Serviceable | Notes |
|------|-------|-------------|-------|
| Colombo | Yes | Yes | All districts |
| Kandy | Yes | Yes | Central province |
| Galle | Yes | Yes | Southern province |
| Jaffna | Yes | Depends | Check coverage |
| Invalid | No | No | Raise error |

### Name Handling

| Source | Priority | Fallback |
|--------|----------|----------|
| shipping_name | 1 | Use directly |
| customer.full_name | 2 | If shipping_name empty |
| customer.first_name + last_name | 3 | Combine names |
| "Customer" | 4 | Last resort (not recommended) |

### Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| name | Not empty, max 100 chars | "Receiver name required" |
| address | Not empty, max 200 chars | "Delivery address required" |
| city | Not empty, valid city | "Valid delivery city required" |
| phone | +94 format, valid number | "Valid phone number required" |
| email | Valid email (if provided) | "Invalid email format" |

### Address Completeness Check

| Check | Purpose | Warning |
|-------|---------|---------|
| Has street number | Precise location | "Address may be incomplete" |
| Has landmark | Easy finding | "Consider adding landmark" |
| City matches postal | Consistency | "City/postal code mismatch" |
| Within coverage | Deliverability | "May not be serviceable" |

### Error Handling

| Error Condition | Exception | User Message |
|-----------------|-----------|--------------|
| Missing address | ValidationError | "Delivery address not provided" |
| Invalid phone | ValidationError | "Invalid customer phone number" |
| Unserviceable city | ServiceabilityError | "Delivery not available to this city" |
| Missing customer | ValidationError | "Order missing customer information" |

### Expected Outcome
- Functional build_receiver_data method
- Returns properly formatted receiver dictionary
- Validates all required fields present
- Phone number formatted correctly
- City validated against serviceable areas

### Verification Checklist
- [ ] build_receiver_data method created
- [ ] Retrieves order shipping address
- [ ] Retrieves customer contact information
- [ ] Builds receiver dictionary with all fields
- [ ] Validates required fields present
- [ ] Formats phone number correctly
- [ ] Validates city is serviceable
- [ ] Handles missing data with clear errors
- [ ] Returns dictionary matching API requirements

---

## Summary

This document established the Waybill model structure and implemented the core API integration for waybill generation. The model stores essential shipment data including order relationship, tracking identifiers (waybill number and barcode), shipment status, and PDF label URL. The create_waybill API orchestrates the complete waybill generation workflow with proper sender and receiver data formatting.

### Completed Tasks
1. ✓ Created Waybill model with proper inheritance
2. ✓ Added Order foreign key relationship
3. ✓ Added waybill_number field for tracking
4. ✓ Added barcode field for scanning
5. ✓ Added status field with lifecycle tracking
6. ✓ Added pdf_url field for label access
7. ✓ Implemented create_waybill API integration
8. ✓ Implemented sender data builder
9. ✓ Implemented receiver data builder

### Next Steps
Proceed to [02_Tasks-44-50_Payload-PDF-Verify.md](02_Tasks-44-50_Payload-PDF-Verify.md) to complete the payload building with package data, COD data, and items description, implement PDF label download and local storage, and verify the complete waybill generation workflow.
