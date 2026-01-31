# Tasks 16-22: Webhook, Admin, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** A - Domex Integration  
> **Document:** 03 of 03  
> **Tasks Covered:** 16, 17, 18, 19, 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-09-15_Provider-Waybill.md](02_Tasks-09-15_Provider-Waybill.md)

---

## Document Overview

This document covers webhook implementation for real-time status updates, status mapping, COD support, pickup scheduling, provider registration, Django admin configuration, and comprehensive integration verification testing.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 16 | Create Domex Webhook | Medium | 60 min |
| 17 | Create Status Mapping | Low | 25 min |
| 18 | Create COD Support | Medium | 50 min |
| 19 | Create Pickup Scheduling | Medium | 55 min |
| 20 | Create Provider Registration | Low | 20 min |
| 21 | Create Domex Admin | Medium | 45 min |
| 22 | Verify Domex Integration | Low | 40 min |

---

## Task 16: Create Domex Webhook

### Overview

Implement webhook endpoint and handler to receive real-time status updates from Domex. When shipment status changes, Domex sends HTTP POST request to webhook URL with updated tracking information, enabling automatic status synchronization.

### Dependencies

- Task 09: Create DomexProvider Class
- Task 04: DomexConfig model with webhook_secret

### Instructions

1. **Create webhooks file**
   - Navigate to `backend/apps/shipping/providers/domex/` directory
   - Create `webhooks.py` file
   - Import necessary Django and DRF components

2. **Define webhook view**
   - Create `DomexWebhookView` class inheriting from APIView
   - Set authentication classes (none, public endpoint)
   - Set permission classes (AllowAny)
   - Define POST method handler

3. **Implement signature verification**
   - Create `_verify_signature()` method
   - Extract signature from request headers
   - Compute HMAC signature using webhook_secret
   - Compare signatures to validate authenticity
   - Reject if signatures don't match

4. **Parse webhook payload**
   - Extract JSON payload from request body
   - Validate required fields present
   - Extract tracking number
   - Extract new status
   - Extract timestamp and other metadata

5. **Validate webhook data**
   - Check tracking number format valid
   - Check status is recognized
   - Verify shipment exists in system
   - Check timestamp not too old (prevent replay)

6. **Look up shipment**
   - Find shipment by tracking number
   - Verify shipment uses Domex provider
   - Get current shipment status
   - Prepare for status update

7. **Process status update**
   - Call status mapping function (Task 17)
   - Update shipment status in database
   - Update status timestamp
   - Store webhook event details

8. **Trigger status-based actions**
   - Send notification to customer if delivered
   - Update order status if applicable
   - Process COD collection if delivered
   - Schedule pickup if status is ready

9. **Log webhook event**
   - Log all webhook receipts
   - Store payload for audit
   - Log processing outcome
   - Track webhook reliability

10. **Return response**
    - Return 200 OK if processed successfully
    - Return 400 Bad Request if invalid data
    - Return 401 Unauthorized if signature fails
    - Return 404 Not Found if shipment missing
    - Don't expose internal errors to Domex

### Webhook Endpoint

| Attribute | Value |
|-----------|-------|
| URL Path | `/api/webhooks/domex/` |
| Method | POST |
| Authentication | Signature verification |
| Content-Type | application/json |

### Domex Webhook Payload

```json
{
    "event": "shipment.status_updated",
    "timestamp": "2026-01-31T15:45:00Z",
    "waybill_number": "DX2026013100123",
    "status": "DELIVERED",
    "location": "Kandy Main Office",
    "description": "Package delivered successfully",
    "delivered_to": "Jane Smith",
    "signature_image_url": "https://domex.lk/signatures/123.png",
    "delivery_proof": {
        "recipient_name": "Jane Smith",
        "recipient_phone": "+94771234568",
        "delivered_at": "2026-01-31T15:30:00Z"
    }
}
```

### Signature Verification

| Component | Description |
|-----------|-------------|
| Header | X-Domex-Signature |
| Algorithm | HMAC-SHA256 |
| Secret | webhook_secret from config |
| Payload | Raw request body |

```
Expected Signature = HMAC-SHA256(webhook_secret, request_body)
Valid = (provided_signature == expected_signature)
```

### Webhook Processing Flow

```
Receive POST Request
    ↓
Extract Signature from Headers
    ↓
Verify Signature → Invalid? Return 401
    ↓
Parse JSON Payload → Invalid? Return 400
    ↓
Validate Required Fields → Missing? Return 400
    ↓
Look Up Shipment → Not Found? Return 404
    ↓
Map Status Code
    ↓
Update Shipment Status
    ↓
Trigger Status Actions
    ↓
Log Event
    ↓
Return 200 OK
```

### Status-Based Actions

| Status | Actions |
|--------|---------|
| PICKED_UP | Update status, notify sender |
| IN_TRANSIT | Update status, update tracking |
| OUT_FOR_DELIVERY | Notify recipient |
| DELIVERED | Notify both, process COD, update order |
| FAILED | Notify sender, schedule retry |
| CANCELLED | Notify both, process refund |

### Webhook Response Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Processed successfully |
| 400 | Bad Request | Invalid payload |
| 401 | Unauthorized | Signature verification failed |
| 404 | Not Found | Shipment not found |
| 500 | Server Error | Internal processing error |

### Expected Outcome

- Webhook endpoint receiving Domex updates
- Signature verification for security
- Automatic shipment status updates
- Status-based action triggers
- Comprehensive logging
- Proper error responses

### Verification Checklist

- [ ] `webhooks.py` file created
- [ ] DomexWebhookView defined
- [ ] Signature verification implemented
- [ ] Payload parsing added
- [ ] Data validation implemented
- [ ] Shipment lookup working
- [ ] Status update processing added
- [ ] Status-based actions triggered
- [ ] Event logging implemented
- [ ] Proper HTTP responses returned

---

## Task 17: Create Status Mapping

### Overview

Implement status mapping functionality that converts Domex-specific status codes to standardized internal status codes. This ensures consistent status representation across all shipping providers and enables unified tracking logic.

### Dependencies

- Task 16: Create Domex Webhook
- Status constants from Task 01

### Instructions

1. **Define status mapping function**
   - Create `map_domex_status()` function
   - Accept Domex status code parameter
   - Return standardized internal status
   - Handle unknown statuses gracefully

2. **Create forward mapping dictionary**
   - Map all Domex statuses to internal statuses
   - Include: PENDING, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED, CANCELLED, RETURNED
   - Use constants from Task 01
   - Document each mapping

3. **Create reverse mapping dictionary**
   - Map internal statuses to Domex statuses
   - Used when creating shipments
   - Handle one-to-many mappings
   - Provide default for ambiguous cases

4. **Handle edge cases**
   - Unknown Domex status → DEFAULT or UNKNOWN
   - Null/empty status → PENDING
   - Case-insensitive matching
   - Log warnings for unmapped statuses

5. **Add status validation**
   - Validate status is valid Domex status
   - Check status in allowed values
   - Raise error for invalid statuses
   - Return boolean validation result

6. **Implement status comparison**
   - Create `is_terminal_status()` function
   - Identify final statuses (DELIVERED, CANCELLED, RETURNED, FAILED)
   - Used to determine if updates needed
   - Prevent updates on completed shipments

7. **Add status progression logic**
   - Create `can_transition_to()` function
   - Validate status transitions are logical
   - PENDING → PICKED_UP (valid)
   - DELIVERED → IN_TRANSIT (invalid)
   - Prevent backward transitions

8. **Create status display helpers**
   - Map statuses to user-friendly messages
   - Support multiple languages (English, Sinhala)
   - Include status icons/colors
   - Provide context-appropriate messages

9. **Document status lifecycle**
   - Define normal status progression
   - Document exception flows
   - Explain status meanings
   - Provide troubleshooting guidance

10. **Add status analytics**
    - Track status distribution
    - Measure time in each status
    - Identify bottlenecks
    - Generate status reports

### Status Mapping Tables

#### Forward Mapping (Domex → Internal)

| Domex Status | Internal Status | Description |
|--------------|----------------|-------------|
| PENDING | PENDING | Shipment created, awaiting pickup |
| PICKED_UP | IN_TRANSIT | Picked up from sender |
| IN_TRANSIT | IN_TRANSIT | In transit to destination |
| AT_WAREHOUSE | IN_TRANSIT | At sorting facility |
| OUT_FOR_DELIVERY | OUT_FOR_DELIVERY | Out for delivery |
| DELIVERED | DELIVERED | Successfully delivered |
| FAILED_DELIVERY | FAILED | Delivery attempt failed |
| CANCELLED | CANCELLED | Shipment cancelled |
| RETURNED | RETURNED | Returned to sender |
| LOST | FAILED | Package lost |

#### Reverse Mapping (Internal → Domex)

| Internal Status | Domex Status | Notes |
|----------------|--------------|-------|
| PENDING | PENDING | Initial status |
| IN_TRANSIT | IN_TRANSIT | Default in-transit |
| OUT_FOR_DELIVERY | OUT_FOR_DELIVERY | Final mile |
| DELIVERED | DELIVERED | Completed |
| FAILED | FAILED_DELIVERY | Failed attempt |
| CANCELLED | CANCELLED | Cancelled |
| RETURNED | RETURNED | Return to sender |

### Status Lifecycle

```
PENDING
    ↓
PICKED_UP
    ↓
IN_TRANSIT
    ↓
AT_WAREHOUSE (optional)
    ↓
IN_TRANSIT
    ↓
OUT_FOR_DELIVERY
    ↓
DELIVERED (success)

From OUT_FOR_DELIVERY:
    → FAILED_DELIVERY → IN_TRANSIT (retry)
    
From any status:
    → CANCELLED
    → RETURNED
```

### Terminal Statuses

| Status | Terminal | Can Update |
|--------|----------|-----------|
| PENDING | No | Yes |
| IN_TRANSIT | No | Yes |
| OUT_FOR_DELIVERY | No | Yes |
| DELIVERED | Yes | No |
| CANCELLED | Yes | No |
| RETURNED | Yes | No |
| FAILED | Yes | Limited |

### User-Friendly Messages

| Status | English Message | Sinhala Message |
|--------|----------------|-----------------|
| PENDING | Your package is being prepared | ඔබේ පැකේජය සූදානම් වෙමින් පවතී |
| IN_TRANSIT | Your package is on the way | ඔබේ පැකේජය ගමන් කරමින් පවතී |
| OUT_FOR_DELIVERY | Your package is out for delivery today | ඔබේ පැකේජය අද බෙදා හරිනු ලැබේ |
| DELIVERED | Your package has been delivered | ඔබේ පැකේජය බෙදා හරින ලදී |

### Expected Outcome

- Bidirectional status mapping functions
- Unknown status handling
- Status validation logic
- Terminal status identification
- Status transition validation
- User-friendly display messages

### Verification Checklist

- [ ] `map_domex_status()` function created
- [ ] Forward mapping dictionary defined
- [ ] Reverse mapping dictionary defined
- [ ] Edge cases handled
- [ ] Status validation added
- [ ] Terminal status check implemented
- [ ] Status transition validation added
- [ ] Display helpers created
- [ ] Status lifecycle documented
- [ ] Status analytics added

---

## Task 18: Create COD Support

### Overview

Implement Cash on Delivery (COD) support for Domex shipments. This includes COD amount handling, fee calculation, collection tracking, and remittance reconciliation when the courier collects payment from recipient on delivery.

### Dependencies

- Task 09: Create DomexProvider Class
- Task 10: create_shipment method

### Instructions

1. **Add COD validation**
   - Create `validate_cod_amount()` function
   - Check COD amount is positive
   - Check within allowed limits (min/max)
   - Verify COD enabled in config
   - Raise validation error if invalid

2. **Implement COD fee calculation**
   - Create `calculate_cod_fee()` function
   - Domex charges percentage of COD amount
   - Typical: 2-3% of collection amount
   - Add to shipping cost
   - Return itemized breakdown

3. **Update create_shipment for COD**
   - Check if cod_amount provided
   - Validate COD amount
   - Calculate COD fee
   - Include in Domex API request
   - Store COD details in shipment

4. **Create CODCollection model**
   - Track COD collections per shipment
   - Fields: shipment, cod_amount, collection_date, remittance_status
   - Link to shipment record
   - Track collection and remittance

5. **Process COD on delivery**
   - When webhook receives DELIVERED status
   - Check if shipment has COD
   - Create CODCollection record
   - Set collection_date
   - Set status to COLLECTED

6. **Implement remittance tracking**
   - Track when Domex remits collected amount
   - Update remittance_status
   - Store remittance_date
   - Link to payment/invoice
   - Generate remittance report

7. **Add COD reconciliation**
   - Match COD collections to remittances
   - Identify missing remittances
   - Generate reconciliation report
   - Alert on discrepancies
   - Support bulk reconciliation

8. **Implement COD reporting**
   - Report of pending COD collections
   - Report of remitted amounts
   - Outstanding remittances report
   - COD fee summary
   - Export to CSV/Excel

9. **Handle COD failures**
   - If delivery fails, COD not collected
   - Update CODCollection status
   - Handle re-delivery attempts
   - Process COD refund if cancelled

10. **Add COD notifications**
    - Notify seller when COD collected
    - Notify when remittance received
    - Send remittance schedule
    - Alert on delays

### COD Configuration

| Setting | Value | Source |
|---------|-------|--------|
| COD Enabled | True/False | DomexConfig |
| Min COD Amount | LKR 100 | Domex policy |
| Max COD Amount | LKR 500,000 | Domex policy |
| COD Fee Rate | 2.5% | Domex pricing |
| Min COD Fee | LKR 50 | Domex minimum |
| Remittance Cycle | Weekly | Domex schedule |

### COD Request Format

```json
{
    "waybill_number": "DX2026013100123",
    "cash_on_delivery": {
        "enabled": true,
        "amount": 15000.00,
        "currency": "LKR"
    }
}
```

### CODCollection Model Fields

| Field | Type | Description |
|-------|------|-------------|
| shipment | ForeignKey | Related shipment |
| cod_amount | DecimalField | Amount to collect |
| cod_fee | DecimalField | Collection fee |
| collected_at | DateTimeField | Collection timestamp |
| collection_status | CharField | PENDING/COLLECTED/FAILED |
| remittance_status | CharField | PENDING/REMITTED |
| remitted_at | DateTimeField | Remittance timestamp |
| remittance_reference | CharField | Payment reference |

### COD Fee Calculation

```
COD Amount: LKR 15,000
COD Fee Rate: 2.5%
COD Fee: 15,000 * 0.025 = LKR 375
Min Fee: LKR 50
Actual Fee: max(375, 50) = LKR 375
Net Amount: 15,000 - 375 = LKR 14,625 (to merchant)
```

### COD Reconciliation Process

```
Daily:
    → Check delivered shipments with COD
    → Create CODCollection records
    
Weekly:
    → Receive remittance report from Domex
    → Match collections to remittances
    → Update remittance_status
    → Generate reconciliation report
    
Monthly:
    → Identify outstanding remittances
    → Follow up with Domex
    → Generate financial reports
```

### Expected Outcome

- COD validation and fee calculation
- COD support in shipment creation
- CODCollection tracking model
- Automatic collection recording on delivery
- Remittance tracking and reconciliation
- COD reporting and notifications

### Verification Checklist

- [ ] COD validation function created
- [ ] COD fee calculation implemented
- [ ] create_shipment updated for COD
- [ ] CODCollection model created
- [ ] COD processing on delivery added
- [ ] Remittance tracking implemented
- [ ] Reconciliation logic added
- [ ] COD reporting created
- [ ] COD failure handling added
- [ ] COD notifications implemented

---

## Task 19: Create Pickup Scheduling

### Overview

Implement pickup scheduling functionality that allows merchants to request Domex to collect packages from their location. This includes scheduling pickup time, managing pickup locations, tracking pickup status, and handling pickup confirmations.

### Dependencies

- Task 09: Create DomexProvider Class
- PICKUP_SCHEDULE_ENDPOINT from constants

### Instructions

1. **Define schedule_pickup method**
   - Create `schedule_pickup()` method in provider
   - Accept shipment IDs or tracking numbers
   - Accept pickup date and time slot
   - Accept pickup location details
   - Return pickup confirmation

2. **Validate pickup request**
   - Check shipments exist and are eligible
   - Verify shipments are PENDING status
   - Check pickup location is valid
   - Validate pickup date is future date
   - Ensure within service hours

3. **Prepare pickup request data**
   - Include list of shipment/waybill numbers
   - Include pickup location details
   - Include requested date and time
   - Include contact person information
   - Include special instructions

4. **Make pickup API request**
   - Use client.post() method
   - Send to PICKUP_SCHEDULE_ENDPOINT
   - Pass pickup request data
   - Handle API response

5. **Process pickup confirmation**
   - Extract pickup ID/reference number
   - Extract confirmed pickup date/time
   - Extract assigned courier details
   - Store pickup details

6. **Create PickupRequest model**
   - Track pickup requests
   - Fields: tenant, pickup_date, location, status, shipments
   - Link to multiple shipments
   - Track pickup lifecycle

7. **Update shipment statuses**
   - Mark shipments as pickup scheduled
   - Link shipments to pickup request
   - Update expected pickup time
   - Send confirmation to merchant

8. **Handle pickup completion**
   - Receive webhook or API update
   - Update PickupRequest status to COMPLETED
   - Update shipment statuses to PICKED_UP
   - Log actual pickup time

9. **Handle pickup failures**
   - If courier unable to pickup
   - Update status to FAILED
   - Notify merchant
   - Allow rescheduling

10. **Implement auto-scheduling**
    - If auto_schedule_pickup enabled in config
    - Automatically schedule pickup when shipment created
    - Use default pickup location
    - Use next available slot
    - Notify merchant of scheduled pickup

### Pickup Time Slots

| Time Slot | Time Range | Availability |
|-----------|-----------|--------------|
| Morning | 09:00 - 12:00 | Mon-Sat |
| Afternoon | 13:00 - 16:00 | Mon-Sat |
| Evening | 16:00 - 18:00 | Mon-Fri |

### Domex Pickup API Request

```json
{
    "pickup_date": "2026-02-01",
    "time_slot": "MORNING",
    "location": {
        "address": "123 Main St, Colombo 3",
        "postal_code": "00300",
        "contact_name": "John Doe",
        "contact_phone": "+94771234567",
        "special_instructions": "Call before arrival"
    },
    "shipments": [
        "DX2026013100123",
        "DX2026013100124",
        "DX2026013100125"
    ],
    "total_packages": 3
}
```

### Domex Pickup API Response

```json
{
    "success": true,
    "pickup": {
        "pickup_id": "PKP-2026020100789",
        "scheduled_date": "2026-02-01",
        "time_slot": "MORNING",
        "estimated_time": "10:00 - 11:00",
        "courier_name": "Kamal Silva",
        "courier_phone": "+94772345678",
        "status": "SCHEDULED"
    }
}
```

### PickupRequest Model Fields

| Field | Type | Description |
|-------|------|-------------|
| tenant | ForeignKey | Associated tenant |
| pickup_id | CharField | Domex pickup ID |
| pickup_date | DateField | Scheduled date |
| time_slot | CharField | Time slot |
| location | JSONField | Pickup address |
| contact_name | CharField | Contact person |
| contact_phone | CharField | Contact number |
| status | CharField | SCHEDULED/COMPLETED/FAILED/CANCELLED |
| shipments | ManyToManyField | Related shipments |
| created_at | DateTimeField | Request time |
| completed_at | DateTimeField | Actual pickup time |

### Pickup Status Lifecycle

```
SCHEDULED
    ↓
In Progress → COMPLETED (success)
    ↓          ↓
    └───────→ FAILED → RESCHEDULED
                ↓
            CANCELLED
```

### Auto-Scheduling Logic

```
If auto_schedule_pickup == True:
    When shipment created:
        ↓
    Check if pickups exist for today
        ↓
    If yes → Add to existing pickup
    If no → Create new pickup request
        ↓
    Schedule for next available slot
        ↓
    Notify merchant
```

### Expected Outcome

- Pickup scheduling functionality
- Pickup request validation
- API integration for scheduling
- PickupRequest tracking model
- Pickup confirmation and updates
- Auto-scheduling support
- Pickup failure handling

### Verification Checklist

- [ ] `schedule_pickup()` method created
- [ ] Pickup request validation added
- [ ] Pickup data preparation implemented
- [ ] API request to pickup endpoint
- [ ] Pickup confirmation processed
- [ ] PickupRequest model created
- [ ] Shipment status updates added
- [ ] Pickup completion handling added
- [ ] Pickup failure handling added
- [ ] Auto-scheduling implemented

---

## Task 20: Create Provider Registration

### Overview

Register the Domex provider with the shipping provider factory/registry to make it available for use throughout the application. This enables dynamic provider selection and ensures Domex appears in provider lists and configuration options.

### Dependencies

- Task 09: Create DomexProvider Class
- CourierFactory from SubPhase-08

### Instructions

1. **Locate provider registry**
   - Find CourierFactory or ShippingProviderRegistry
   - Located in `backend/apps/shipping/` directory
   - Review registration mechanism

2. **Register Domex provider**
   - Add Domex to provider registry
   - Use provider_code "domex" as key
   - Map to DomexProvider class
   - Ensure registration happens at import time

3. **Update provider imports**
   - Add DomexProvider import to __init__.py
   - Ensure provider module loaded
   - Trigger registration on app startup
   - Check app configuration

4. **Add to provider choices**
   - Update SHIPPING_PROVIDER_CHOICES
   - Add ("domex", "Domex Courier")
   - Used in model fields and forms
   - Maintain alphabetical order

5. **Update provider discovery**
   - If using auto-discovery mechanism
   - Ensure Domex provider discovered
   - Add to provider list API endpoint
   - Include in provider documentation

6. **Test provider instantiation**
   - Test factory can create Domex provider
   - Test with valid tenant configuration
   - Verify provider methods accessible
   - Check provider metadata

7. **Add provider capabilities metadata**
   - Register provider features
   - supports_cod, supports_tracking, etc.
   - Used for feature filtering
   - Display in provider selection UI

8. **Update provider selection logic**
   - Ensure Domex appears in provider dropdowns
   - Filter by tenant's enabled providers
   - Show provider capabilities
   - Display provider logo if available

### Registration Methods

#### Method 1: Decorator-based

```python
@register_provider("domex")
class DomexProvider(ShippingProvider):
    pass
```

#### Method 2: Factory Registration

```python
# In factory.py or registry.py
CourierFactory.register("domex", DomexProvider)
```

#### Method 3: App Configuration

```python
# In apps.py
class ShippingConfig(AppConfig):
    def ready(self):
        from .providers.domex import DomexProvider
        registry.register("domex", DomexProvider)
```

### Provider Registry Structure

| Provider Code | Provider Class | Display Name | Active |
|--------------|----------------|--------------|--------|
| domex | DomexProvider | Domex Courier | Yes |
| koombiyo | KoombiyoProvider | Koombiyo | Yes |
| pronto | ProntoProvider | Pronto Lanka | Yes |

### Provider Factory Usage

```python
# Get provider for tenant
provider = CourierFactory.get_provider("domex", tenant)

# List all providers
providers = CourierFactory.list_providers()

# Get available providers for tenant
available = CourierFactory.get_available_providers(tenant)
```

### Expected Outcome

- Domex provider registered in factory
- Provider available via factory
- Appears in provider lists and choices
- Provider instantiation working
- Metadata properly configured

### Verification Checklist

- [ ] Provider registry located
- [ ] Domex provider registered with "domex" key
- [ ] Provider imports updated
- [ ] Provider choices updated
- [ ] Provider discovery working
- [ ] Factory instantiation tested
- [ ] Capabilities metadata added
- [ ] Provider selection UI shows Domex

---

## Task 21: Create Domex Admin

### Overview

Configure Django admin interface for managing Domex configurations, viewing shipments, monitoring pickups, and reconciling COD collections. Provides administrative tools for tenant support and troubleshooting.

### Dependencies

- Task 04: DomexConfig model
- Task 18: CODCollection model
- Task 19: PickupRequest model

### Instructions

1. **Create admin file**
   - Create `admin.py` in domex directory
   - Import Django admin and models
   - Import necessary mixins

2. **Register DomexConfig admin**
   - Create `DomexConfigAdmin` class
   - Register with admin.site.register()
   - Configure list display
   - Add filters and search

3. **Configure list display**
   - Show tenant, is_sandbox, is_active
   - Show default_service_type
   - Show created_at, last_sync_at
   - Make clickable links

4. **Add list filters**
   - Filter by is_sandbox
   - Filter by is_active
   - Filter by default_service_type
   - Filter by tenant

5. **Configure fieldsets**
   - Group: Tenant Information
   - Group: Credentials (encrypt sensitive fields)
   - Group: Service Preferences
   - Group: Operational Settings
   - Group: Metadata

6. **Add custom actions**
   - Action: Test API credentials
   - Action: Sync configuration
   - Action: Enable/disable config
   - Action: Reset webhook secret

7. **Register CODCollection admin**
   - Create `CODCollectionAdmin` class
   - Show shipment, cod_amount, collection_status
   - Filter by collection_status, remittance_status
   - Add date hierarchy

8. **Add COD reconciliation view**
   - Custom admin view for reconciliation
   - Show unreconciled collections
   - Bulk update remittance status
   - Export reconciliation report

9. **Register PickupRequest admin**
   - Create `PickupRequestAdmin` class
   - Show tenant, pickup_date, status
   - Filter by status and date
   - Link to related shipments

10. **Add admin customizations**
    - Use TenantAwareMixin for multi-tenancy
    - Add inline editing where appropriate
    - Add readonly fields for computed values
    - Implement custom validation

### DomexConfigAdmin Configuration

#### List Display
| Column | Description |
|--------|-------------|
| tenant | Tenant name (link) |
| is_sandbox | Environment indicator |
| is_active | Active status |
| default_service_type | Default service |
| total_shipments | Shipment count |
| last_sync_at | Last sync timestamp |

#### List Filters
- is_active (Boolean)
- is_sandbox (Boolean)
- default_service_type (Choice)
- tenant (Foreign Key)

#### Fieldsets

```
Tenant Information
    - tenant
    
Credentials (collapsed)
    - api_key (password field)
    - is_sandbox
    - is_active
    
Service Preferences
    - default_service_type
    - enable_cod
    - enable_insurance
    - default_pickup_location
    
Operational Settings
    - webhook_secret (readonly)
    - auto_schedule_pickup
    - notification_email
    - notification_phone
    
Metadata (collapsed)
    - created_at (readonly)
    - updated_at (readonly)
    - last_sync_at (readonly)
    - total_shipments (readonly)
```

#### Custom Actions

| Action | Description | Permission |
|--------|-------------|-----------|
| test_credentials | Test API connection | Admin |
| sync_configuration | Sync with Domex | Admin |
| enable_configurations | Enable selected configs | Admin |
| disable_configurations | Disable selected configs | Admin |
| regenerate_webhook_secret | Generate new webhook secret | Superuser |

### CODCollectionAdmin Configuration

#### List Display
| Column | Description |
|--------|-------------|
| shipment | Shipment tracking number |
| cod_amount | Collection amount |
| collection_status | Collection status |
| remittance_status | Remittance status |
| collected_at | Collection date |
| remitted_at | Remittance date |

#### List Filters
- collection_status
- remittance_status
- collected_at (DateFilter)
- remitted_at (DateFilter)

### PickupRequestAdmin Configuration

#### List Display
| Column | Description |
|--------|-------------|
| tenant | Tenant name |
| pickup_id | Domex pickup ID |
| pickup_date | Scheduled date |
| time_slot | Time slot |
| status | Current status |
| shipment_count | Number of shipments |

#### List Filters
- status
- pickup_date (DateFilter)
- tenant

### Expected Outcome

- Django admin for DomexConfig
- Admin for CODCollection
- Admin for PickupRequest
- Custom actions for management
- Filters and search configured
- Tenant-aware permissions

### Verification Checklist

- [ ] `admin.py` file created in domex directory
- [ ] DomexConfigAdmin created and registered
- [ ] List display configured
- [ ] List filters added
- [ ] Fieldsets organized
- [ ] Custom actions implemented
- [ ] CODCollectionAdmin created
- [ ] COD reconciliation view added
- [ ] PickupRequestAdmin created
- [ ] Tenant-aware permissions applied

---

## Task 22: Verify Domex Integration

### Overview

Perform comprehensive verification and testing of the Domex integration to ensure all components work correctly together. This includes manual testing, automated tests, integration validation, and documentation review.

### Dependencies

- All previous tasks (01-21) complete
- Domex sandbox credentials available

### Instructions

1. **Verify configuration setup**
   - Check constants file has all required values
   - Verify settings file configured correctly
   - Confirm API key in environment variables
   - Test environment switching (sandbox/production)

2. **Test DomexConfig model**
   - Create test tenant configuration
   - Validate all fields save correctly
   - Test model methods (get_client, validate_credentials)
   - Verify encryption of sensitive fields

3. **Test DomexClient**
   - Initialize client with test config
   - Test authentication headers
   - Make test API request
   - Verify error handling

4. **Test DomexProvider initialization**
   - Instantiate provider with test tenant
   - Verify config loaded
   - Check client initialized
   - Test provider metadata

5. **Test create_shipment end-to-end**
   - Prepare valid shipment data
   - Call create_shipment method
   - Verify API call made
   - Check shipment created in Domex
   - Verify local shipment record created

6. **Test get_rates**
   - Prepare rate request data
   - Call get_rates method
   - Verify rates returned
   - Check rate calculations

7. **Test track_shipment**
   - Use tracking number from test shipment
   - Call track_shipment method
   - Verify tracking data returned
   - Check status mapping works

8. **Test cancel_shipment**
   - Create test shipment
   - Call cancel_shipment method
   - Verify cancellation successful
   - Check status updated

9. **Test waybill and label generation**
   - Generate waybill for test shipment
   - Verify PDF file created
   - Download shipping label
   - Check files stored correctly

10. **Test webhook handling**
    - Simulate webhook POST request
    - Include valid signature
    - Verify status updated
    - Check actions triggered

11. **Test COD functionality**
    - Create shipment with COD
    - Verify COD amount included
    - Check COD fee calculated
    - Simulate COD collection

12. **Test pickup scheduling**
    - Schedule pickup for test shipments
    - Verify pickup request created
    - Check confirmation received
    - Test auto-scheduling

13. **Test provider registration**
    - Verify Domex in provider registry
    - Test factory instantiation
    - Check provider selection UI
    - Verify capabilities displayed

14. **Test admin interface**
    - Access DomexConfig admin
    - Create/edit configurations
    - Test custom actions
    - Verify COD and pickup admins

15. **Review error handling**
    - Test invalid API key
    - Test network errors
    - Test validation errors
    - Verify user-friendly messages

16. **Performance testing**
    - Test with multiple concurrent requests
    - Measure API response times
    - Check connection pooling
    - Verify no memory leaks

17. **Security review**
    - Verify API keys not logged
    - Check webhook signature validation
    - Test authentication failures
    - Review permission checks

18. **Documentation review**
    - Verify all tasks documented
    - Check code comments added
    - Review API documentation
    - Update integration guide

### Testing Checklist

#### Configuration Tests
- [ ] Constants file complete
- [ ] Settings configured
- [ ] API key loaded from environment
- [ ] Environment switching works

#### Model Tests
- [ ] DomexConfig CRUD operations
- [ ] Model methods work
- [ ] Field validation working
- [ ] Encryption verified

#### Client Tests
- [ ] Client initialization
- [ ] Authentication working
- [ ] API requests successful
- [ ] Error handling correct

#### Provider Tests
- [ ] Provider instantiation
- [ ] create_shipment works
- [ ] get_rates works
- [ ] track_shipment works
- [ ] cancel_shipment works
- [ ] Waybill generation works
- [ ] Label download works

#### Integration Tests
- [ ] Webhook handling works
- [ ] Status mapping correct
- [ ] COD support functional
- [ ] Pickup scheduling works
- [ ] Provider registration works

#### Admin Tests
- [ ] DomexConfig admin works
- [ ] CODCollection admin works
- [ ] PickupRequest admin works
- [ ] Custom actions work

#### Quality Tests
- [ ] Error handling comprehensive
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Documentation complete

### Test Shipment Data

```json
{
    "sender_name": "Test Sender",
    "sender_phone": "+94771234567",
    "sender_address": {
        "street": "123 Test Street",
        "city": "Colombo",
        "postal_code": "00100"
    },
    "recipient_name": "Test Recipient",
    "recipient_phone": "+94771234568",
    "recipient_address": {
        "street": "456 Test Road",
        "city": "Kandy",
        "postal_code": "20000"
    },
    "service_type": "STANDARD",
    "package_weight": 2.5,
    "cod_amount": 1500.00
}
```

### Expected Outcome

- All Domex integration components verified
- End-to-end workflows tested
- Error handling validated
- Performance acceptable
- Security measures confirmed
- Documentation complete
- Integration ready for production

### Verification Checklist

- [ ] Configuration setup verified
- [ ] DomexConfig model tested
- [ ] DomexClient tested
- [ ] DomexProvider initialized
- [ ] create_shipment tested end-to-end
- [ ] get_rates tested
- [ ] track_shipment tested
- [ ] cancel_shipment tested
- [ ] Waybill generation tested
- [ ] Label download tested
- [ ] Webhook handling tested
- [ ] COD functionality tested
- [ ] Pickup scheduling tested
- [ ] Provider registration verified
- [ ] Admin interface tested
- [ ] Error handling reviewed
- [ ] Performance tested
- [ ] Security reviewed
- [ ] Documentation reviewed

---

## Summary

This document completed the Domex integration with webhook handling, status synchronization, COD support, pickup scheduling, provider registration, admin interface, and comprehensive verification. The Domex courier is now fully integrated and ready for use.

### Completed Tasks

16. ✓ Created webhook endpoint for real-time status updates
17. ✓ Implemented status mapping between Domex and internal codes
18. ✓ Implemented COD support with collection and remittance tracking
19. ✓ Implemented pickup scheduling with auto-scheduling support
20. ✓ Registered Domex provider in factory
21. ✓ Created Django admin for all Domex models
22. ✓ Verified complete integration functionality

### Integration Complete

The Domex courier integration is now complete and provides:
- Full CRUD operations for shipments
- Real-time tracking and status updates
- COD collection and remittance
- Pickup scheduling and management
- Administrative tools
- Webhook integration
- Comprehensive error handling

### Next Group

Proceed to Group-B_PromptX-Integration to implement the next courier provider following the same pattern.
