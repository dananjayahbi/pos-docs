# Tasks 09-15: Provider Implementation and Waybill

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** A - Domex Integration  
> **Document:** 02 of 03  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Configuration-Client.md](01_Tasks-01-08_Configuration-Client.md)
- **→ Next Document:** [03_Tasks-16-22_Webhook-Admin-Verify.md](03_Tasks-16-22_Webhook-Admin-Verify.md)

---

## Document Overview

This document covers the implementation of the DomexProvider class that implements the ShippingProvider interface, all core shipping operations (create shipment, get rates, track shipment, cancel shipment), waybill generation, and label download functionality.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create DomexProvider Class | High | 90 min |
| 10 | Create create_shipment Method | Medium | 60 min |
| 11 | Create get_rates Method | Medium | 50 min |
| 12 | Create track_shipment Method | Medium | 45 min |
| 13 | Create cancel_shipment Method | Low | 30 min |
| 14 | Create Waybill Generation | Medium | 55 min |
| 15 | Create Label Download | Low | 35 min |

---

## Task 09: Create DomexProvider Class

### Overview

Create the `DomexProvider` class that implements the `ShippingProvider` abstract base class. This provider acts as the main interface for all Domex shipping operations, coordinating between the Domex client, configuration, and the standardized shipping provider interface.

### Dependencies

- Task 08: Create Error Handling
- ShippingProvider ABC from SubPhase-08
- DomexClient from Task 05
- DomexConfig from Task 04

### Instructions

1. **Create provider file**
   - Navigate to `backend/apps/shipping/providers/domex/` directory
   - Create `provider.py` file
   - Import necessary dependencies

2. **Define DomexProvider class**
   - Create class inheriting from `ShippingProvider`
   - Define provider identifier constant
   - Set provider name and display name
   - Document provider purpose

3. **Implement initialization**
   - Accept tenant parameter in `__init__`
   - Retrieve DomexConfig for tenant
   - Initialize DomexClient with config
   - Store client and config as attributes
   - Validate configuration exists and is active

4. **Define provider metadata**
   - Set `provider_code = "domex"`
   - Set `provider_name = "Domex Courier"`
   - Set `supports_cod = True`
   - Set `supports_tracking = True`
   - Set `supports_pickup = True`
   - Set `supports_insurance = False` (or based on config)

5. **Implement get_supported_services method**
   - Return list of supported service types
   - Include STANDARD, EXPRESS, SAME_DAY
   - Filter based on config settings
   - Return standardized format

6. **Implement get_service_areas method**
   - Return coverage areas for each service
   - STANDARD: island-wide
   - EXPRESS: major cities
   - SAME_DAY: Colombo area
   - Use postal code validation

7. **Create address validation helper**
   - Define `_validate_address()` private method
   - Check required fields (street, city, postal_code)
   - Validate postal code format
   - Validate phone number format
   - Return validation result

8. **Create shipment data transformation**
   - Define `_prepare_shipment_data()` method
   - Transform internal shipment format to Domex format
   - Map service types
   - Format addresses
   - Handle COD and insurance

9. **Implement error handling wrapper**
   - Create `_handle_api_call()` method
   - Wrap API calls in try-except
   - Catch Domex exceptions
   - Transform to standard shipping errors
   - Log errors appropriately

10. **Add configuration validation**
    - Create `is_configured()` method
    - Check config exists and is active
    - Validate API key present
    - Test connection if needed
    - Return boolean status

### Provider Class Structure

| Component | Purpose | Type |
|-----------|---------|------|
| provider_code | Unique identifier | str constant |
| provider_name | Display name | str constant |
| config | Tenant configuration | DomexConfig instance |
| client | API client | DomexClient instance |
| tenant | Current tenant | Tenant instance |

### Provider Metadata

| Attribute | Value | Description |
|-----------|-------|-------------|
| provider_code | "domex" | Unique identifier |
| provider_name | "Domex Courier" | Display name |
| supports_cod | True | Cash on delivery |
| supports_tracking | True | Real-time tracking |
| supports_pickup | True | Pickup scheduling |
| supports_insurance | False | Insurance not available |
| coverage | "island-wide" | Service area |

### Supported Services

| Service Code | Name | Delivery Time | Coverage |
|--------------|------|---------------|----------|
| STANDARD | Standard Delivery | 2-3 business days | Island-wide |
| EXPRESS | Express Delivery | 1-2 business days | Major cities |
| SAME_DAY | Same Day Delivery | Same day | Colombo |

### Address Validation Rules

| Field | Required | Validation |
|-------|----------|------------|
| recipient_name | Yes | Min 2 chars |
| recipient_phone | Yes | +94 format |
| street_address | Yes | Min 5 chars |
| city | Yes | Valid city name |
| postal_code | Yes | 5 digits |
| province | No | Valid province |

### Data Transformation Mapping

| Internal Field | Domex Field | Transformation |
|----------------|-------------|----------------|
| service_type | service_code | Map to Domex codes |
| sender_address | pickup_address | Format address |
| recipient_address | delivery_address | Format address |
| cod_amount | cash_on_delivery | Convert to cents |
| package_weight | weight_kg | Convert to kg |

### Expected Outcome

- DomexProvider class implementing ShippingProvider interface
- Provider metadata and capabilities defined
- Configuration and client initialization
- Address validation logic
- Data transformation methods
- Error handling wrapper
- Configuration validation

### Verification Checklist

- [ ] `provider.py` file created in domex directory
- [ ] DomexProvider class defined
- [ ] Inherits from ShippingProvider
- [ ] Initialization accepts tenant parameter
- [ ] Provider metadata defined
- [ ] get_supported_services() implemented
- [ ] get_service_areas() implemented
- [ ] Address validation method created
- [ ] Data transformation method created
- [ ] Error handling wrapper added
- [ ] Configuration validation implemented

---

## Task 10: Create create_shipment Method

### Overview

Implement the `create_shipment()` method in DomexProvider that creates a new shipment with Domex. This method validates shipment data, transforms it to Domex format, calls the Domex API, and returns standardized shipment information including tracking number.

### Dependencies

- Task 09: Create DomexProvider Class
- CREATE_SHIPMENT_ENDPOINT from constants

### Instructions

1. **Define method signature**
   - Method name: `create_shipment()`
   - Accept shipment_data dictionary parameter
   - Accept optional options dictionary
   - Return standardized shipment response

2. **Validate input data**
   - Check required fields present
   - Validate sender address
   - Validate recipient address
   - Validate package details (weight, dimensions)
   - Validate service type
   - Raise validation errors for missing/invalid data

3. **Transform shipment data**
   - Call `_prepare_shipment_data()` helper
   - Map service type to Domex service code
   - Format sender address to Domex format
   - Format recipient address to Domex format
   - Convert weight to kilograms
   - Format dimensions if provided

4. **Handle COD if applicable**
   - Check if COD enabled in config
   - Validate COD amount if present
   - Add COD details to request
   - Convert amount to appropriate format

5. **Handle pickup details**
   - Use default pickup location from config
   - Override with provided pickup details
   - Format pickup date/time
   - Add special instructions if any

6. **Make API request**
   - Use client.post() method
   - Send to CREATE_SHIPMENT_ENDPOINT
   - Pass transformed shipment data
   - Handle API response

7. **Process API response**
   - Extract shipment ID (Domex waybill number)
   - Extract tracking number
   - Extract estimated delivery date
   - Extract any additional metadata

8. **Transform response to standard format**
   - Create standardized shipment response
   - Map Domex fields to internal fields
   - Include provider-specific data
   - Return ShipmentResponse object

9. **Handle errors**
   - Catch DomexValidationError for invalid data
   - Catch DomexError for API failures
   - Transform to standard shipping errors
   - Log error details

10. **Update shipment tracking**
    - Store shipment in internal database
    - Link to Domex tracking number
    - Set initial status (PENDING)
    - Store shipment metadata

### Method Signature

```
create_shipment(
    shipment_data: Dict[str, Any],
    options: Optional[Dict[str, Any]] = None
) -> ShipmentResponse
```

### Required Shipment Data Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sender_name | str | Yes | Sender full name |
| sender_phone | str | Yes | Sender contact number |
| sender_address | dict | Yes | Complete sender address |
| recipient_name | str | Yes | Recipient full name |
| recipient_phone | str | Yes | Recipient contact |
| recipient_address | dict | Yes | Complete delivery address |
| service_type | str | Yes | STANDARD/EXPRESS/SAME_DAY |
| package_weight | float | Yes | Weight in kg |
| package_dimensions | dict | No | Length, width, height |
| cod_amount | decimal | No | COD collection amount |
| declared_value | decimal | No | Package value |

### Domex API Request Format

```json
{
    "service_code": "STD",
    "pickup_address": {
        "name": "John Doe",
        "phone": "+94771234567",
        "address_line1": "123 Main St",
        "city": "Colombo",
        "postal_code": "00100"
    },
    "delivery_address": {
        "name": "Jane Smith",
        "phone": "+94771234568",
        "address_line1": "456 Park Rd",
        "city": "Kandy",
        "postal_code": "20000"
    },
    "package": {
        "weight_kg": 2.5,
        "length_cm": 30,
        "width_cm": 20,
        "height_cm": 10
    },
    "cash_on_delivery": 5000.00,
    "declared_value": 8000.00
}
```

### Domex API Response Format

```json
{
    "success": true,
    "data": {
        "shipment_id": "DX2026013100123",
        "waybill_number": "DX2026013100123",
        "tracking_url": "https://domex.lk/track/DX2026013100123",
        "estimated_delivery": "2026-02-03",
        "service": "STANDARD",
        "status": "PENDING"
    }
}
```

### Standardized Response Format

| Field | Type | Description |
|-------|------|-------------|
| provider | str | "domex" |
| tracking_number | str | Waybill number |
| shipment_id | str | Internal ID |
| status | str | Current status |
| estimated_delivery | date | Expected delivery |
| cost | decimal | Shipping cost (if available) |
| label_url | str | Label download URL |
| metadata | dict | Additional data |

### Error Handling

| Error Type | Action | User Message |
|------------|--------|--------------|
| Missing required field | Raise ValidationError | "Required field missing: {field}" |
| Invalid address | Raise ValidationError | "Invalid {address_type} address" |
| Invalid service type | Raise ValidationError | "Unsupported service type" |
| API error | Raise ShippingError | "Failed to create shipment" |
| Authentication error | Raise ConfigurationError | "Invalid Domex credentials" |

### Expected Outcome

- Functional create_shipment method
- Input validation and transformation
- API call to Domex create shipment endpoint
- Response transformation to standard format
- Error handling and logging
- Shipment tracking in database

### Verification Checklist

- [ ] `create_shipment()` method defined
- [ ] Input validation implemented
- [ ] Data transformation working
- [ ] COD handling added
- [ ] Pickup details handling added
- [ ] API request sent correctly
- [ ] Response parsed and transformed
- [ ] Error handling implemented
- [ ] Shipment stored in database
- [ ] Method returns ShipmentResponse

---

## Task 11: Create get_rates Method

### Overview

Implement the `get_rates()` method in DomexProvider that retrieves shipping rate quotes from Domex for different service types. This method calculates costs based on package details, origin/destination, and service level.

### Dependencies

- Task 09: Create DomexProvider Class
- GET_RATES_ENDPOINT from constants

### Instructions

1. **Define method signature**
   - Method name: `get_rates()`
   - Accept origin address dictionary
   - Accept destination address dictionary
   - Accept package details dictionary
   - Return list of rate options

2. **Validate input parameters**
   - Validate origin address required fields
   - Validate destination address required fields
   - Validate package weight present
   - Validate dimensions if provided
   - Raise validation errors if invalid

3. **Prepare rates request**
   - Format origin address
   - Format destination address
   - Include package weight
   - Include dimensions if available
   - Add declared value if provided

4. **Make API request**
   - Use client.post() method
   - Send to GET_RATES_ENDPOINT
   - Pass rate request data
   - Handle API response

5. **Parse rate response**
   - Extract available services
   - Extract rates for each service
   - Extract delivery time estimates
   - Extract any surcharges or fees

6. **Transform to standard format**
   - Create RateOption objects
   - Include service type
   - Include cost breakdown
   - Include delivery estimate
   - Include currency (LKR)

7. **Filter based on availability**
   - Check service availability for destination
   - Filter out unavailable services
   - Sort by delivery time or cost
   - Return only applicable rates

8. **Handle COD fees**
   - Add COD fee if applicable
   - Calculate based on COD amount
   - Include in total cost
   - Show as separate line item

9. **Add rate metadata**
   - Include fuel surcharge if applicable
   - Include remote area fee if applicable
   - Include insurance cost if requested
   - Include any promotional discounts

10. **Handle errors**
    - Catch API errors gracefully
    - Return empty list if rates unavailable
    - Log errors for debugging
    - Show user-friendly message

### Method Signature

```
get_rates(
    origin: Dict[str, Any],
    destination: Dict[str, Any],
    package: Dict[str, Any],
    options: Optional[Dict[str, Any]] = None
) -> List[RateOption]
```

### Rate Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| origin_postal_code | str | Yes | Sender postal code |
| destination_postal_code | str | Yes | Recipient postal code |
| weight_kg | float | Yes | Package weight |
| length_cm | float | No | Package length |
| width_cm | float | No | Package width |
| height_cm | float | No | Package height |
| declared_value | decimal | No | Package value |
| cod_amount | decimal | No | COD collection |

### Domex Rates API Request

```json
{
    "origin": {
        "postal_code": "00100"
    },
    "destination": {
        "postal_code": "20000"
    },
    "package": {
        "weight_kg": 2.5,
        "dimensions": {
            "length_cm": 30,
            "width_cm": 20,
            "height_cm": 10
        }
    },
    "services": ["STANDARD", "EXPRESS", "SAME_DAY"]
}
```

### Domex Rates API Response

```json
{
    "success": true,
    "rates": [
        {
            "service_code": "STD",
            "service_name": "Standard Delivery",
            "cost": 350.00,
            "currency": "LKR",
            "delivery_days": "2-3",
            "estimated_delivery": "2026-02-03",
            "fees": {
                "base_rate": 300.00,
                "fuel_surcharge": 50.00
            }
        },
        {
            "service_code": "EXP",
            "service_name": "Express Delivery",
            "cost": 550.00,
            "currency": "LKR",
            "delivery_days": "1-2",
            "estimated_delivery": "2026-02-02"
        }
    ]
}
```

### Standard Rate Option Format

| Field | Type | Description |
|-------|------|-------------|
| provider | str | "domex" |
| service_type | str | Service code |
| service_name | str | Display name |
| total_cost | decimal | Total amount |
| currency | str | "LKR" |
| delivery_estimate | str | Delivery timeframe |
| estimated_delivery_date | date | Expected delivery |
| cost_breakdown | dict | Itemized costs |

### Cost Breakdown

| Fee Type | Description | When Applied |
|----------|-------------|--------------|
| Base Rate | Standard shipping fee | Always |
| Fuel Surcharge | Fuel cost adjustment | Always |
| COD Fee | Cash collection fee | If COD enabled |
| Remote Area Fee | Delivery to remote area | Based on postal code |
| Insurance Fee | Package insurance | If requested |

### Expected Outcome

- Functional get_rates method
- Rate quotes from Domex API
- Multiple service options returned
- Cost breakdown provided
- Delivery estimates included
- Filtering based on availability

### Verification Checklist

- [ ] `get_rates()` method defined
- [ ] Input validation implemented
- [ ] Rate request prepared correctly
- [ ] API call made to rates endpoint
- [ ] Response parsed successfully
- [ ] Rates transformed to standard format
- [ ] Service filtering implemented
- [ ] COD fees handled
- [ ] Rate metadata included
- [ ] Error handling added

---

## Task 12: Create track_shipment Method

### Overview

Implement the `track_shipment()` method in DomexProvider that retrieves real-time tracking information for a shipment from Domex. This method queries tracking status, location history, and delivery updates.

### Dependencies

- Task 09: Create DomexProvider Class
- TRACK_SHIPMENT_ENDPOINT from constants

### Instructions

1. **Define method signature**
   - Method name: `track_shipment()`
   - Accept tracking_number (waybill) parameter
   - Return standardized tracking response
   - Handle optional detailed parameter

2. **Validate tracking number**
   - Check tracking number not empty
   - Validate format if Domex has specific format
   - Check tracking number exists in system
   - Raise error for invalid number

3. **Make tracking API request**
   - Use client.get() method
   - Send to TRACK_SHIPMENT_ENDPOINT with waybill
   - Pass tracking number in URL path
   - Handle API response

4. **Parse tracking response**
   - Extract current status
   - Extract status history/timeline
   - Extract current location
   - Extract delivery information
   - Extract scan events

5. **Map status codes**
   - Use status mapping from constants
   - Convert Domex status to internal status
   - Handle unknown statuses gracefully
   - Maintain original status for reference

6. **Build tracking timeline**
   - Extract all tracking events
   - Sort by timestamp
   - Include location for each event
   - Include scan type and description

7. **Extract delivery details**
   - Get estimated delivery date
   - Get actual delivery date if delivered
   - Get delivery person name if available
   - Get recipient signature if available

8. **Format response**
   - Create TrackingResponse object
   - Include current status
   - Include tracking timeline
   - Include delivery information
   - Include provider metadata

9. **Handle special cases**
   - Shipment not found: raise NotFoundError
   - Multiple tracking records: return latest
   - Delayed shipment: include delay reason
   - Failed delivery: include failure reason

10. **Cache tracking data**
    - Update local shipment record
    - Cache tracking status
    - Store tracking timeline
    - Update last_tracked_at timestamp

### Method Signature

```
track_shipment(
    tracking_number: str,
    detailed: bool = False
) -> TrackingResponse
```

### Domex Tracking API Request

```
GET /v1/track/{waybill_number}
Headers:
    X-API-Key: {api_key}
```

### Domex Tracking API Response

```json
{
    "success": true,
    "tracking": {
        "waybill_number": "DX2026013100123",
        "status": "IN_TRANSIT",
        "current_location": "Colombo Distribution Center",
        "estimated_delivery": "2026-02-03",
        "history": [
            {
                "timestamp": "2026-01-31T10:30:00Z",
                "status": "PENDING",
                "location": "Colombo",
                "description": "Shipment created"
            },
            {
                "timestamp": "2026-01-31T14:00:00Z",
                "status": "PICKED_UP",
                "location": "Colombo Main Office",
                "description": "Package picked up"
            },
            {
                "timestamp": "2026-02-01T09:15:00Z",
                "status": "IN_TRANSIT",
                "location": "Colombo Distribution Center",
                "description": "In transit to Kandy"
            }
        ]
    }
}
```

### Standard Tracking Response Format

| Field | Type | Description |
|-------|------|-------------|
| tracking_number | str | Waybill number |
| status | str | Current status |
| status_message | str | User-friendly message |
| current_location | str | Current location |
| estimated_delivery | date | Expected delivery |
| actual_delivery | date | Actual delivery (if completed) |
| timeline | list | Tracking events |
| delivery_details | dict | Delivery information |

### Status Mapping

| Domex Status | Internal Status | User Message |
|--------------|----------------|--------------|
| PENDING | PENDING | Shipment created, awaiting pickup |
| PICKED_UP | IN_TRANSIT | Package picked up from sender |
| IN_TRANSIT | IN_TRANSIT | Package in transit |
| OUT_FOR_DELIVERY | OUT_FOR_DELIVERY | Out for delivery today |
| DELIVERED | DELIVERED | Package delivered successfully |
| FAILED | FAILED | Delivery attempt failed |
| CANCELLED | CANCELLED | Shipment cancelled |
| RETURNED | RETURNED | Package returned to sender |

### Tracking Timeline Event

| Field | Type | Description |
|-------|------|-------------|
| timestamp | datetime | Event time |
| status | str | Status at this event |
| location | str | Location of scan |
| description | str | Event description |
| scan_type | str | Type of scan |

### Expected Outcome

- Functional track_shipment method
- Real-time tracking from Domex API
- Status mapping to internal codes
- Complete tracking timeline
- Delivery details if available
- Local cache update

### Verification Checklist

- [ ] `track_shipment()` method defined
- [ ] Tracking number validation added
- [ ] API request to tracking endpoint
- [ ] Response parsed successfully
- [ ] Status mapping implemented
- [ ] Tracking timeline built
- [ ] Delivery details extracted
- [ ] Response formatted to standard
- [ ] Special cases handled
- [ ] Local cache updated

---

## Task 13: Create cancel_shipment Method

### Overview

Implement the `cancel_shipment()` method in DomexProvider that cancels a shipment with Domex before it has been picked up or delivered. This method sends cancellation request and updates shipment status.

### Dependencies

- Task 09: Create DomexProvider Class
- CANCEL_SHIPMENT_ENDPOINT from constants

### Instructions

1. **Define method signature**
   - Method name: `cancel_shipment()`
   - Accept tracking_number parameter
   - Accept optional reason parameter
   - Return cancellation confirmation

2. **Validate cancellation eligibility**
   - Check shipment exists
   - Check shipment status allows cancellation
   - Cannot cancel if already delivered
   - Cannot cancel if already cancelled
   - Raise error if not eligible

3. **Prepare cancellation request**
   - Include tracking/waybill number
   - Include cancellation reason if provided
   - Add requester information
   - Add timestamp

4. **Make API request**
   - Use client.post() or client.delete()
   - Send to CANCEL_SHIPMENT_ENDPOINT
   - Pass cancellation data
   - Handle API response

5. **Process cancellation response**
   - Confirm cancellation successful
   - Extract cancellation ID if provided
   - Extract refund information if applicable
   - Note any cancellation fees

6. **Update internal records**
   - Update shipment status to CANCELLED
   - Store cancellation reason
   - Store cancellation timestamp
   - Link cancellation ID

7. **Handle refund if applicable**
   - Check if refund applicable
   - Calculate refund amount
   - Store refund details
   - Notify billing system

8. **Handle errors**
   - Catch cancellation not allowed errors
   - Catch shipment not found errors
   - Catch API errors
   - Provide user-friendly messages

9. **Send notifications**
   - Notify sender of cancellation
   - Notify recipient if applicable
   - Update order status
   - Log cancellation event

10. **Return confirmation**
    - Create CancellationResponse object
    - Include success status
    - Include cancellation details
    - Include next steps if any

### Method Signature

```
cancel_shipment(
    tracking_number: str,
    reason: Optional[str] = None
) -> CancellationResponse
```

### Cancellation Eligibility Rules

| Current Status | Can Cancel | Notes |
|----------------|-----------|-------|
| PENDING | Yes | No fees |
| PICKED_UP | Yes | May have fees |
| IN_TRANSIT | Maybe | Check with Domex |
| OUT_FOR_DELIVERY | No | Too late |
| DELIVERED | No | Cannot cancel |
| CANCELLED | No | Already cancelled |

### Domex Cancel API Request

```json
{
    "waybill_number": "DX2026013100123",
    "reason": "Customer requested cancellation",
    "requester": {
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

### Domex Cancel API Response

```json
{
    "success": true,
    "cancellation": {
        "waybill_number": "DX2026013100123",
        "status": "CANCELLED",
        "cancellation_id": "CXL-2026013100456",
        "cancelled_at": "2026-01-31T15:30:00Z",
        "refund_eligible": true,
        "refund_amount": 350.00,
        "cancellation_fee": 0.00
    }
}
```

### Standard Cancellation Response

| Field | Type | Description |
|-------|------|-------------|
| success | bool | Cancellation successful |
| tracking_number | str | Waybill number |
| cancellation_id | str | Cancellation reference |
| cancelled_at | datetime | Cancellation timestamp |
| refund_eligible | bool | If refund available |
| refund_amount | decimal | Refund amount |
| message | str | Confirmation message |

### Expected Outcome

- Functional cancel_shipment method
- Eligibility validation before cancellation
- API call to cancel endpoint
- Response processing and confirmation
- Internal records updated
- Notifications sent

### Verification Checklist

- [ ] `cancel_shipment()` method defined
- [ ] Eligibility validation implemented
- [ ] Cancellation request prepared
- [ ] API call made successfully
- [ ] Response processed
- [ ] Internal records updated
- [ ] Refund handling added
- [ ] Error handling implemented
- [ ] Notifications sent
- [ ] Method returns CancellationResponse

---

## Task 14: Create Waybill Generation

### Overview

Implement waybill generation functionality that creates a Domex waybill document for a shipment. The waybill contains shipment details, barcode, and tracking information required for package handling and delivery.

### Dependencies

- Task 10: Create create_shipment Method
- WAYBILL_GENERATION_ENDPOINT from constants

### Instructions

1. **Define waybill generation method**
   - Method name: `generate_waybill()`
   - Accept tracking_number parameter
   - Accept optional format parameter (PDF/HTML)
   - Return waybill data or file

2. **Validate shipment exists**
   - Check tracking number valid
   - Verify shipment exists in system
   - Confirm shipment created with Domex
   - Raise error if not found

3. **Make waybill API request**
   - Use client.get() method
   - Send to WAYBILL_GENERATION_ENDPOINT
   - Pass tracking number
   - Specify format (PDF or HTML)

4. **Process waybill response**
   - Extract waybill content (PDF bytes or HTML)
   - Extract barcode data
   - Extract QR code if available
   - Extract metadata

5. **Save waybill locally**
   - Store waybill file in storage (S3 or local)
   - Generate unique filename
   - Store file path in database
   - Link to shipment record

6. **Extract barcode information**
   - Get waybill barcode (1D or 2D)
   - Get tracking barcode
   - Store barcode value
   - Store barcode format

7. **Generate waybill URL**
   - Create signed URL for download
   - Set appropriate expiration
   - Store URL in shipment record
   - Return URL in response

8. **Handle multiple formats**
   - Support PDF format (primary)
   - Support HTML format (preview)
   - Support image format (PNG/JPG)
   - Convert between formats if needed

9. **Add waybill metadata**
   - Store generation timestamp
   - Store waybill version
   - Store page count
   - Store file size

10. **Handle errors**
    - Catch waybill not available errors
    - Catch generation failures
    - Retry on transient errors
    - Provide fallback options

### Method Signature

```
generate_waybill(
    tracking_number: str,
    format: str = "PDF"
) -> WaybillResponse
```

### Waybill Content

| Section | Content | Purpose |
|---------|---------|---------|
| Header | Company logo, waybill number | Identification |
| Sender | Name, address, phone | Pickup details |
| Recipient | Name, address, phone | Delivery details |
| Package | Weight, dimensions, description | Package info |
| Barcode | 1D barcode with tracking number | Scanning |
| QR Code | 2D code with shipment data | Mobile scanning |
| Footer | Terms, instructions | Legal info |

### Domex Waybill API Request

```
GET /v1/waybill/{waybill_number}?format=pdf
Headers:
    X-API-Key: {api_key}
    Accept: application/pdf
```

### Domex Waybill API Response

```
Response: Binary PDF data
Headers:
    Content-Type: application/pdf
    Content-Disposition: attachment; filename="waybill_DX2026013100123.pdf"
    Content-Length: 45678
```

### Waybill Storage

| Storage Type | Path Format | Retention |
|--------------|-------------|-----------|
| S3 | shipments/{tenant}/waybills/{year}/{month}/{tracking}.pdf | 2 years |
| Local | media/shipments/waybills/{tracking}.pdf | 90 days |

### Standard Waybill Response

| Field | Type | Description |
|-------|------|-------------|
| tracking_number | str | Waybill number |
| waybill_url | str | Download URL |
| barcode_data | str | Barcode value |
| qr_code_data | str | QR code content |
| format | str | File format |
| file_size | int | Size in bytes |
| generated_at | datetime | Generation time |

### Expected Outcome

- Functional waybill generation
- PDF waybill from Domex API
- Local storage of waybill
- Barcode extraction
- Download URL generation
- Metadata tracking

### Verification Checklist

- [ ] `generate_waybill()` method defined
- [ ] Shipment validation added
- [ ] API request to waybill endpoint
- [ ] Waybill content received
- [ ] File saved to storage
- [ ] Barcode data extracted
- [ ] Download URL generated
- [ ] Metadata stored
- [ ] Multiple formats supported
- [ ] Error handling implemented

---

## Task 15: Create Label Download

### Overview

Implement shipping label download functionality that retrieves a printable shipping label from Domex. The label includes barcode, addresses, and shipment information in a printer-friendly format.

### Dependencies

- Task 14: Create Waybill Generation
- LABEL_DOWNLOAD_ENDPOINT from constants

### Instructions

1. **Define label download method**
   - Method name: `download_label()`
   - Accept tracking_number parameter
   - Accept optional size parameter (A4/4x6)
   - Return label file or URL

2. **Validate shipment and label availability**
   - Check shipment exists
   - Verify label available (shipment created)
   - Check label not already downloaded
   - Raise error if not available

3. **Make label API request**
   - Use client.get() method
   - Send to LABEL_DOWNLOAD_ENDPOINT
   - Pass tracking number
   - Specify label size/format

4. **Process label response**
   - Receive PDF or image binary data
   - Validate file format
   - Check file size reasonable
   - Extract content type

5. **Save label file**
   - Store in same location as waybills or separate labels directory
   - Generate unique filename
   - Store file path in database
   - Link to shipment record

6. **Generate download URL**
   - Create signed URL for download
   - Set short expiration (24 hours)
   - Store URL in response
   - Allow multiple downloads

7. **Support multiple label sizes**
   - A4 (210mm x 297mm) for standard printers
   - 4x6 inch for thermal printers
   - Convert between sizes if needed
   - Store size preference

8. **Track label downloads**
   - Log download timestamp
   - Count download attempts
   - Store download user/IP
   - Limit downloads if needed

9. **Handle printing requirements**
   - Provide printing instructions
   - Suggest label paper type
   - Recommend printer settings
   - Include QA checklist

10. **Handle errors**
    - Catch label not ready errors
    - Retry generation if failed
    - Provide preview option
    - Fallback to waybill if needed

### Method Signature

```
download_label(
    tracking_number: str,
    size: str = "A4"
) -> LabelResponse
```

### Label Sizes

| Size | Dimensions | Format | Use Case |
|------|-----------|--------|----------|
| A4 | 210mm x 297mm | PDF | Standard printer |
| 4x6 | 4" x 6" | PDF/PNG | Thermal printer |
| Letter | 8.5" x 11" | PDF | US standard |

### Domex Label API Request

```
GET /v1/labels/{waybill_number}?size=A4&format=pdf
Headers:
    X-API-Key: {api_key}
    Accept: application/pdf
```

### Label Storage

| Storage Type | Path | Naming |
|--------------|------|--------|
| S3 | shipments/{tenant}/labels/ | label_{tracking}_{size}.pdf |
| Local | media/shipments/labels/ | label_{tracking}_{size}.pdf |

### Standard Label Response

| Field | Type | Description |
|-------|------|-------------|
| tracking_number | str | Waybill number |
| label_url | str | Download URL |
| format | str | File format (PDF/PNG) |
| size | str | Label size |
| file_size | int | Size in bytes |
| expires_at | datetime | URL expiration |
| print_instructions | str | Printing guide |

### Printing Instructions

| Aspect | Recommendation |
|--------|---------------|
| Paper | White adhesive label paper |
| Print Quality | High quality, 300 DPI |
| Color | Black and white sufficient |
| Margin | No margin (full bleed) |
| Orientation | Portrait |

### Expected Outcome

- Functional label download
- PDF label from Domex API
- Multiple size support
- Local storage and URLs
- Printing instructions
- Download tracking

### Verification Checklist

- [ ] `download_label()` method defined
- [ ] Shipment validation added
- [ ] API request to label endpoint
- [ ] Label file received
- [ ] File saved to storage
- [ ] Download URL generated
- [ ] Multiple sizes supported
- [ ] Download tracking implemented
- [ ] Printing instructions provided
- [ ] Error handling added

---

## Summary

This document implemented the core DomexProvider functionality including all shipping operations (create, rates, track, cancel) and waybill/label management. The provider is now ready for webhook integration and admin configuration.

### Completed Tasks

9. ✓ Created DomexProvider class implementing ShippingProvider interface
10. ✓ Implemented create_shipment method with validation and transformation
11. ✓ Implemented get_rates method for rate quotes
12. ✓ Implemented track_shipment method with status mapping
13. ✓ Implemented cancel_shipment method with eligibility checks
14. ✓ Implemented waybill generation with barcode extraction
15. ✓ Implemented label download with multiple size support

### Next Steps

Proceed to [03_Tasks-16-22_Webhook-Admin-Verify.md](03_Tasks-16-22_Webhook-Admin-Verify.md) to implement webhook handling for status updates, COD support, pickup scheduling, provider registration, admin interface, and integration verification.
