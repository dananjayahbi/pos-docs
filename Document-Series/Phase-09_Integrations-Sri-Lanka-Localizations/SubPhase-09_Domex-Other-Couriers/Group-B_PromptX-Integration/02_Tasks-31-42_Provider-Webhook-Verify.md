# Tasks 31-42: PromptX Provider Implementation and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** B - PromptX Integration  
> **Document:** 02 of 02  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-23-30_Configuration-Client.md](01_Tasks-23-30_Configuration-Client.md)

---

## Document Overview

This document covers the implementation of the PromptXProvider class with all shipping operations, waybill generation, webhook handling, status mapping, admin interface, provider registration, and complete integration verification.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Create PromptXProvider | High | 60 min |
| 32 | Create PromptX Shipment | Medium | 40 min |
| 33 | Create PromptX Rates | Medium | 35 min |
| 34 | Create PromptX Tracking | Medium | 35 min |
| 35 | Create PromptX Cancel | Low | 20 min |
| 36 | Create PromptX Waybill | Medium | 30 min |
| 37 | Create PromptX Label | Low | 20 min |
| 38 | Create PromptX Webhook | Medium | 40 min |
| 39 | Create PromptX Status Map | Low | 15 min |
| 40 | Create PromptX Registration | Low | 15 min |
| 41 | Create PromptX Admin | Medium | 35 min |
| 42 | Verify PromptX Integration | Low | 30 min |

---

## Task 31: Create PromptXProvider

### Overview
Create the PromptXProvider class that implements the ShippingProvider interface. This is the main provider class that integrates PromptX functionality into the shipping system, providing standardized methods for shipment operations.

### Dependencies
- Task 30: Create PromptX Errors
- ShippingProvider abstract base class must exist

### Instructions

1. **Create provider file**
   - Create `provider.py` in `promptx/` directory
   - Import ShippingProvider ABC
   - Import PromptXClient and related classes

2. **Define PromptXProvider class**
   - Inherit from ShippingProvider
   - Implement all required abstract methods
   - Add PromptX-specific attributes

3. **Implement provider initialization**
   - Accept tenant parameter in constructor
   - Load PromptXConfig for tenant
   - Initialize PromptXClient with config

4. **Implement provider properties**
   - Add `name` property returning "PromptX"
   - Add `code` property returning "promptx"
   - Add `is_available` property checking configuration

5. **Implement provider capabilities**
   - Add `supports_same_day` property (True)
   - Add `supports_cod` property (from config)
   - Add `supports_insurance` property (True)
   - Add `coverage_areas` property (Colombo Metro)

6. **Implement service checking**
   - Add `is_service_available()` method
   - Check address against coverage areas
   - Check if same-day cutoff passed
   - Return availability status

7. **Add provider metadata**
   - Add `get_provider_info()` method
   - Return provider details (name, features, coverage)
   - Include configuration status

8. **Implement context manager**
   - Implement `__enter__` method
   - Implement `__exit__` method
   - Manage client lifecycle

9. **Add configuration validation**
   - Add `validate_configuration()` method
   - Check if config exists and is active
   - Verify API credentials
   - Return validation results

10. **Add helper methods**
    - Add `_get_client()` method for client access
    - Add `_check_coverage()` for address validation
    - Add `_check_cutoff_time()` for same-day eligibility

### Provider Class Structure

```
PromptXProvider (extends ShippingProvider)
├── __init__(tenant)
├── Properties
│   ├── name
│   ├── code
│   ├── is_available
│   ├── supports_same_day
│   ├── supports_cod
│   ├── supports_insurance
│   └── coverage_areas
├── Abstract Method Implementations
│   ├── create_shipment() (Task 32)
│   ├── get_rates() (Task 33)
│   ├── track_shipment() (Task 34)
│   ├── cancel_shipment() (Task 35)
│   ├── get_waybill() (Task 36)
│   └── download_label() (Task 37)
├── Provider Methods
│   ├── is_service_available()
│   ├── get_provider_info()
│   └── validate_configuration()
└── Helper Methods
    ├── _get_client()
    ├── _check_coverage()
    └── _check_cutoff_time()
```

### ShippingProvider Interface

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| create_shipment() | shipment_data | Shipment | Create new shipment |
| get_rates() | address, package | List[Rate] | Get shipping rates |
| track_shipment() | tracking_number | TrackingInfo | Track shipment |
| cancel_shipment() | shipment_id | bool | Cancel shipment |
| get_waybill() | shipment_id | str | Get waybill number |
| download_label() | shipment_id | bytes | Download label PDF |

### Provider Properties

| Property | Type | Value | Description |
|----------|------|-------|-------------|
| name | str | "Prompt X" | Display name |
| code | str | "promptx" | Internal identifier |
| is_available | bool | Dynamic | Configuration status |
| supports_same_day | bool | True | Same-day capability |
| supports_cod | bool | From config | COD support |
| supports_insurance | bool | True | Insurance available |
| coverage_areas | list | Colombo Metro | Service coverage |

### Coverage Areas Definition

```
Colombo Metro Coverage:
├── Central Colombo
│   ├── Colombo 01 - Fort
│   ├── Colombo 02 - Slave Island
│   ├── Colombo 03 - Kollupitiya
│   ├── Colombo 04 - Bambalapitiya
│   └── ... (through Colombo 09)
├── Greater Colombo
│   ├── Colombo 10 - Maradana
│   ├── Colombo 11 - Pettah
│   ├── Colombo 12 - Hulftsdorp
│   └── ... (through Colombo 15)
└── Select Suburbs
    ├── Dehiwala
    ├── Mount Lavinia
    ├── Nugegoda
    └── Maharagama
```

### Same-Day Eligibility Check

| Check | Condition | Pass Criteria |
|-------|-----------|---------------|
| Time | Current time | Before 2:00 PM |
| Day | Day of week | Monday - Saturday |
| Holiday | Public holiday | Not a holiday |
| Coverage | Delivery address | In coverage area |
| Config | Tenant setting | same_day_enabled=True |

### Service Availability Logic

```
is_service_available(address) → bool
    ↓
Check if config exists
    ↓
Check if config is active
    ↓
Check address coverage
    ↓
Check cutoff time (if same-day)
    ↓
Return availability status
```

### Provider Info Structure

```json
{
  "name": "Prompt X",
  "code": "promptx",
  "description": "Same-day delivery in Colombo Metro",
  "features": {
    "same_day_delivery": true,
    "cod": true,
    "insurance": true,
    "tracking": true
  },
  "coverage": {
    "areas": ["Colombo 01-15", "Select suburbs"],
    "postal_codes": ["00100", "00200", ...]
  },
  "cutoff_time": "14:00",
  "operating_days": ["Monday", "Tuesday", ..., "Saturday"],
  "is_configured": true,
  "is_active": true
}
```

### Configuration Validation

| Validation | Check | Error If Failed |
|------------|-------|-----------------|
| Config Exists | PromptXConfig for tenant | "Provider not configured" |
| Config Active | is_active=True | "Provider is disabled" |
| API Key | api_key not empty | "API key not set" |
| Credentials | API test call | "Invalid credentials" |

### Context Manager Usage

```
Usage:
with PromptXProvider(tenant) as provider:
    # Provider initialized
    # Client ready
    rates = provider.get_rates(address, package)
    # Operations
# Client automatically closed
```

### Helper Method Details

| Method | Purpose | Returns |
|--------|---------|---------|
| _get_client() | Get initialized PromptXClient | PromptXClient |
| _check_coverage(address) | Verify address in coverage area | bool |
| _check_cutoff_time() | Check if before cutoff | bool |
| _get_config() | Retrieve tenant config | PromptXConfig |
| _is_holiday(date) | Check if date is holiday | bool |

### Coverage Check Logic

```
_check_coverage(address):
    Extract postal code from address
    Check if postal code in PROMPTX_POSTAL_CODES
    Check if city in coverage areas
    Return True if covered, False otherwise
```

### Cutoff Time Check Logic

```
_check_cutoff_time():
    Get current time in Asia/Colombo timezone
    Get cutoff time (14:00)
    Return current_time < cutoff_time
```

### Expected Outcome
- Complete PromptXProvider class implementing ShippingProvider interface
- All required properties and methods defined
- Service availability checking implemented
- Configuration validation working
- Helper methods for common operations

### Verification Checklist
- [ ] `backend/apps/shipping/providers/promptx/provider.py` created
- [ ] PromptXProvider inherits from ShippingProvider
- [ ] Constructor initializes with tenant parameter
- [ ] All properties implemented (name, code, etc.)
- [ ] is_service_available() method working
- [ ] get_provider_info() returning complete info
- [ ] validate_configuration() checking config
- [ ] Context manager implemented
- [ ] Helper methods created (_get_client, _check_coverage, etc.)
- [ ] Coverage areas defined
- [ ] Cutoff time checking working
- [ ] All abstract methods stubbed (implemented in following tasks)

---

## Task 32: Create PromptX Shipment

### Overview
Implement the create_shipment() method in PromptXProvider. This method creates a new shipment booking with PromptX API, handling address formatting, package details, and service selection.

### Dependencies
- Task 31: Create PromptXProvider

### Instructions

1. **Implement create_shipment method**
   - Open `provider.py`
   - Locate PromptXProvider class
   - Implement `create_shipment()` method

2. **Define method signature**
   - Accept shipment_data parameter (dict)
   - Include sender, receiver, package details
   - Return Shipment object or ID

3. **Validate input data**
   - Validate required fields present
   - Check address format
   - Validate package dimensions and weight
   - Check COD amount if applicable

4. **Check service availability**
   - Call is_service_available() with receiver address
   - Raise error if service unavailable
   - Check same-day eligibility if requested

5. **Format sender address**
   - Extract sender details from shipment_data
   - Format according to PromptX requirements
   - Include default pickup address if needed

6. **Format receiver address**
   - Extract receiver details
   - Validate postal code
   - Format phone number (+94 format)
   - Add landmark if available

7. **Format package details**
   - Extract weight, dimensions
   - Convert units if needed (kg, cm)
   - Calculate volumetric weight
   - Add package description

8. **Determine service type**
   - Check if same-day requested and eligible
   - Select appropriate service code
   - Set delivery type parameter

9. **Prepare API request data**
   - Build request payload according to API spec
   - Include all required fields
   - Add optional fields (insurance, COD)

10. **Make API call**
    - Get PromptXClient instance
    - Call shipment creation endpoint
    - Handle response

11. **Process API response**
    - Extract shipment ID
    - Extract tracking number
    - Extract estimated delivery time
    - Store waybill number

12. **Create internal shipment record**
    - Create Shipment model instance
    - Store PromptX shipment ID
    - Store tracking number
    - Set initial status

13. **Handle errors**
    - Catch validation errors
    - Catch API errors
    - Provide user-friendly error messages
    - Rollback on failure

### Shipment Data Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sender | dict | Yes | Sender details |
| receiver | dict | Yes | Receiver details |
| package | dict | Yes | Package information |
| service_type | str | No | "same_day" or "standard" |
| cod_amount | Decimal | No | COD amount if applicable |
| insurance | bool | No | Enable insurance |
| notes | str | No | Delivery instructions |

### Sender/Receiver Address Format

```json
{
  "name": "John Doe",
  "phone": "+94771234567",
  "email": "john@example.com",
  "address_line_1": "123 Main Street",
  "address_line_2": "Floor 2, Unit 5",
  "city": "Colombo",
  "postal_code": "00100",
  "landmark": "Near Town Hall"
}
```

### Package Details Format

```json
{
  "weight": 2.5,
  "length": 30,
  "width": 20,
  "height": 15,
  "description": "Electronics - Mobile Phone",
  "quantity": 1,
  "value": 50000.00
}
```

### API Request Payload

```json
{
  "pickup": {
    "name": "Store Name",
    "phone": "+94771234567",
    "address": "123 Store St, Colombo 03",
    "postal_code": "00300"
  },
  "delivery": {
    "name": "Customer Name",
    "phone": "+94779876543",
    "address": "456 Customer St, Colombo 07",
    "postal_code": "00700",
    "landmark": "Near Library"
  },
  "package": {
    "weight_kg": 2.5,
    "dimensions_cm": {"l": 30, "w": 20, "h": 15},
    "description": "Electronics",
    "declared_value": 50000.00
  },
  "service": {
    "type": "same_day",
    "cod_amount": 50000.00,
    "insurance": true
  },
  "notes": "Handle with care"
}
```

### Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| sender.phone | +94 format | "Invalid sender phone" |
| receiver.phone | +94 format | "Invalid receiver phone" |
| postal_code | In coverage | "Area not covered" |
| weight | 0.1 - 25 kg | "Weight out of range" |
| dimensions | Max 120cm length | "Dimensions exceed limit" |
| cod_amount | > 0 if provided | "Invalid COD amount" |

### Service Type Selection

| Requested | Eligible | Selected | Notes |
|-----------|----------|----------|-------|
| same_day | Yes | same_day | Before cutoff |
| same_day | No | standard | After cutoff |
| standard | - | standard | Always available |
| not specified | Yes | same_day | Default if eligible |
| not specified | No | standard | Fallback |

### API Response Processing

| Response Field | Extract To | Purpose |
|----------------|------------|---------|
| shipment_id | Shipment.external_id | PromptX reference |
| tracking_number | Shipment.tracking_number | Customer tracking |
| waybill_number | Shipment.waybill | Waybill reference |
| estimated_delivery | Shipment.estimated_delivery | ETA |
| status | Shipment.status | Initial status |

### Error Handling

| Error Type | Action | User Message |
|------------|--------|--------------|
| ValidationError | Return validation errors | "Invalid shipment data: {details}" |
| ServiceUnavailableError | Reject shipment | "Service not available in this area" |
| APIError | Log and reject | "Failed to create shipment: {error}" |
| NetworkError | Retry then fail | "Connection error, please try again" |

### Shipment Creation Flow

```
create_shipment(shipment_data)
    ↓
Validate input data
    ↓
Check service availability
    ↓
Format sender address
    ↓
Format receiver address
    ↓
Format package details
    ↓
Determine service type
    ↓
Prepare API request
    ↓
Call PromptX API
    ↓
Process response
    ↓
Create internal record
    ↓
Return Shipment object
```

### Phone Number Formatting

| Input Format | Formatted Output | Notes |
|--------------|------------------|-------|
| 0771234567 | +94771234567 | Add country code |
| 771234567 | +94771234567 | Add +94 |
| +94771234567 | +94771234567 | Already formatted |
| 94771234567 | +94771234567 | Add + prefix |

### Expected Outcome
- Working shipment creation functionality
- Proper data validation and formatting
- API integration with error handling
- Internal shipment record creation

### Verification Checklist
- [ ] create_shipment() method implemented
- [ ] Input data validation working
- [ ] Service availability check integrated
- [ ] Sender address formatting correct
- [ ] Receiver address formatting correct
- [ ] Package details formatting correct
- [ ] Service type selection logic working
- [ ] API request payload building correct
- [ ] API call execution successful
- [ ] Response parsing working
- [ ] Internal shipment record creation
- [ ] Error handling implemented
- [ ] Phone number formatting correct

---

## Task 33: Create PromptX Rates

### Overview
Implement the get_rates() method in PromptXProvider. This method retrieves shipping rate quotes from PromptX API based on destination address and package details, with caching for performance.

### Dependencies
- Task 31: Create PromptXProvider

### Instructions

1. **Implement get_rates method**
   - Open `provider.py`
   - Locate PromptXProvider class
   - Implement `get_rates()` method

2. **Define method signature**
   - Accept destination address (dict)
   - Accept package details (dict)
   - Return list of Rate objects

3. **Validate input parameters**
   - Validate address has required fields
   - Validate package weight and dimensions
   - Raise validation errors if invalid

4. **Check service availability**
   - Verify address is in coverage area
   - Return empty list if not covered
   - Log unavailability reason

5. **Check rate cache**
   - Generate cache key from address and package
   - Check if rates cached
   - Return cached rates if valid

6. **Prepare rate request**
   - Format destination address
   - Format package details
   - Include service preferences

7. **Call rates API endpoint**
   - Use PromptXClient to make request
   - Call /rates or /quote endpoint
   - Include all required parameters

8. **Parse rate response**
   - Extract service options (same-day, standard)
   - Extract pricing for each service
   - Extract delivery time estimates
   - Parse any additional fees

9. **Calculate same-day eligibility**
   - Check if same-day available
   - Check cutoff time
   - Mark same-day option accordingly

10. **Create Rate objects**
    - Create Rate instance for each service
    - Set service name, code, price
    - Set estimated delivery time
    - Add any surcharges

11. **Cache rate results**
    - Store rates in cache with TTL
    - Use appropriate cache key
    - Set expiry (5 minutes)

12. **Handle rate errors**
    - Catch API errors gracefully
    - Return empty list on error
    - Log error details

### Rate Request Structure

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from_postal_code | str | Yes | Pickup postal code |
| to_postal_code | str | Yes | Delivery postal code |
| weight_kg | float | Yes | Package weight |
| dimensions_cm | dict | No | Length, width, height |
| declared_value | Decimal | No | Package value (for insurance) |
| cod_amount | Decimal | No | COD amount if applicable |

### Rate API Request

```json
{
  "origin": {
    "postal_code": "00300"
  },
  "destination": {
    "postal_code": "00700"
  },
  "package": {
    "weight_kg": 2.5,
    "dimensions_cm": {
      "length": 30,
      "width": 20,
      "height": 15
    },
    "declared_value": 50000.00
  },
  "services": ["same_day", "standard"]
}
```

### Rate API Response

```json
{
  "rates": [
    {
      "service_code": "same_day",
      "service_name": "Same Day Delivery",
      "price": 450.00,
      "currency": "LKR",
      "estimated_delivery": "2026-01-31T18:00:00",
      "available": true,
      "cutoff_time": "14:00"
    },
    {
      "service_code": "standard",
      "service_name": "Standard Delivery",
      "price": 300.00,
      "currency": "LKR",
      "estimated_delivery": "2026-02-01T18:00:00",
      "available": true
    }
  ]
}
```

### Rate Object Structure

| Field | Type | Description |
|-------|------|-------------|
| provider_code | str | "promptx" |
| service_code | str | "same_day" or "standard" |
| service_name | str | Display name |
| base_price | Decimal | Base shipping cost |
| fuel_surcharge | Decimal | Fuel surcharge if any |
| insurance_fee | Decimal | Insurance cost |
| cod_fee | Decimal | COD handling fee |
| total_price | Decimal | Sum of all charges |
| currency | str | "LKR" |
| estimated_days | int | Delivery time in days |
| estimated_delivery | datetime | Expected delivery time |
| is_available | bool | Service availability |

### Rate Calculation

```
Total Rate Calculation:
├── Base Price (from API)
├── + Fuel Surcharge (if applicable)
├── + Insurance Fee (if insurance requested)
├── + COD Fee (if COD enabled)
└── = Total Price
```

### Service Pricing Example

| Service | Base Price | Fuel Surcharge | Insurance | COD Fee | Total |
|---------|------------|----------------|-----------|---------|-------|
| Same Day | ₨ 450 | ₨ 50 | ₨ 25 | ₨ 75 | ₨ 600 |
| Standard | ₨ 300 | ₨ 50 | ₨ 25 | ₨ 75 | ₨ 450 |

### Cache Key Generation

```
Cache Key Format:
promptx:rates:{from_postal}:{to_postal}:{weight}:{dimensions_hash}

Example:
promptx:rates:00300:00700:2.5:abc123
```

### Cache TTL Strategy

| Cache Entry | TTL | Reason |
|-------------|-----|--------|
| Rate quotes | 5 minutes | Rates relatively stable |
| Service availability | 10 minutes | Rarely changes |
| Error responses | 1 minute | Allow quick retry |

### Same-Day Availability Logic

| Time | Same-Day Available | Delivery Time |
|------|-------------------|---------------|
| Before 14:00 | Yes | Same day by 18:00 |
| After 14:00 | No | Next day |
| Sunday | No | Monday delivery |
| Holiday | No | Next business day |

### Error Handling

| Error Scenario | Action | Return Value |
|----------------|--------|--------------|
| Invalid address | Log warning | Empty list |
| Out of coverage | Log info | Empty list |
| API error | Log error | Empty list |
| Network timeout | Log error | Empty list |
| Cache error | Continue without cache | Fresh rates |

### Rate Filtering

| Filter | Condition | Action |
|--------|-----------|--------|
| Unavailable | is_available=False | Exclude from results |
| Over budget | price > max_budget | Include with flag |
| Expired cutoff | Same-day after 14:00 | Mark unavailable |

### Expected Outcome
- Working rate retrieval functionality
- Multiple service options returned
- Accurate pricing with all fees
- Caching for performance
- Error handling for graceful degradation

### Verification Checklist
- [ ] get_rates() method implemented
- [ ] Input validation working
- [ ] Service availability check integrated
- [ ] Cache checking implemented
- [ ] Rate request formatting correct
- [ ] API call execution successful
- [ ] Response parsing working
- [ ] Rate objects created correctly
- [ ] Same-day eligibility calculated
- [ ] Cache storage implemented
- [ ] Error handling graceful
- [ ] Empty list returned on errors
- [ ] All fees included in total price

---

## Task 34: Create PromptX Tracking

### Overview
Implement the track_shipment() method in PromptXProvider. This method retrieves tracking information for a shipment from PromptX API, including current status, location, and delivery history.

### Dependencies
- Task 31: Create PromptXProvider

### Instructions

1. **Implement track_shipment method**
   - Open `provider.py`
   - Locate PromptXProvider class
   - Implement `track_shipment()` method

2. **Define method signature**
   - Accept tracking_number parameter (str)
   - Return TrackingInfo object
   - Handle not found errors

3. **Validate tracking number**
   - Check tracking number format
   - Ensure not empty
   - Validate format matches PromptX pattern

4. **Check tracking cache**
   - Generate cache key from tracking number
   - Check for cached tracking data
   - Return cached data if fresh (< 60 seconds)

5. **Prepare tracking request**
   - Format tracking number for API
   - Build request parameters
   - Include tenant credentials

6. **Call tracking API endpoint**
   - Use PromptXClient to make request
   - Call /track or /shipments/{id}/tracking endpoint
   - Handle authentication

7. **Parse tracking response**
   - Extract current status
   - Extract current location
   - Extract tracking events/history
   - Extract proof of delivery if delivered

8. **Map status codes**
   - Convert PromptX status to internal status
   - Use status mapping from Task 39
   - Set appropriate status enum value

9. **Format tracking events**
   - Parse each tracking event
   - Format timestamps to local timezone
   - Create TrackingEvent objects

10. **Create TrackingInfo object**
    - Populate with parsed data
    - Include current status and location
    - Include event history
    - Include estimated delivery

11. **Cache tracking data**
    - Store TrackingInfo in cache
    - Set short TTL (60 seconds)
    - Use tracking number as key

12. **Handle tracking errors**
    - Handle shipment not found (404)
    - Handle API errors
    - Return appropriate error or null

### Tracking Request Structure

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tracking_number | str | Yes | Shipment tracking number |
| include_history | bool | No | Include full event history |
| include_pod | bool | No | Include proof of delivery |

### Tracking API Request

```
GET /api/v1/track/{tracking_number}
Headers:
  Authorization: Bearer {api_key}
  Accept: application/json
```

### Tracking API Response

```json
{
  "tracking_number": "PX123456789",
  "waybill_number": "WB987654321",
  "current_status": "INTRANSIT",
  "current_location": "Colombo Processing Center",
  "estimated_delivery": "2026-01-31T18:00:00",
  "events": [
    {
      "status": "PICKED",
      "location": "Store - Colombo 03",
      "timestamp": "2026-01-31T10:30:00",
      "description": "Package picked up from sender",
      "updated_by": "Driver - Kamal"
    },
    {
      "status": "INTRANSIT",
      "location": "Processing Center",
      "timestamp": "2026-01-31T11:45:00",
      "description": "Package in transit",
      "updated_by": "System"
    }
  ],
  "delivery_info": {
    "recipient_name": "John Doe",
    "signature": "base64_image_data",
    "delivered_at": null
  }
}
```

### TrackingInfo Object Structure

| Field | Type | Description |
|-------|------|-------------|
| tracking_number | str | Tracking number |
| provider_code | str | "promptx" |
| current_status | StatusEnum | Mapped status |
| current_location | str | Current location |
| estimated_delivery | datetime | Expected delivery time |
| events | List[TrackingEvent] | Event history |
| proof_of_delivery | dict | POD data if delivered |
| last_updated | datetime | Last tracking update |

### TrackingEvent Structure

| Field | Type | Description |
|-------|------|-------------|
| status | StatusEnum | Event status |
| status_display | str | Human-readable status |
| location | str | Event location |
| timestamp | datetime | Event time |
| description | str | Event description |
| updated_by | str | Who updated |

### Status Mapping

| PromptX Status | Internal Status | Display Text |
|----------------|-----------------|--------------|
| PENDING | PENDING | Order Pending |
| CONFIRMED | CONFIRMED | Booking Confirmed |
| PICKED | PICKED_UP | Picked Up |
| INTRANSIT | IN_TRANSIT | In Transit |
| OUT_DELIVERY | OUT_FOR_DELIVERY | Out for Delivery |
| DELIVERED | DELIVERED | Delivered |
| FAILED | DELIVERY_FAILED | Delivery Failed |
| RETURNED | RETURNED | Returned to Sender |
| CANCELLED | CANCELLED | Cancelled |

### Tracking Event Timeline

```
Timeline Visualization:
├── 10:30 AM - PICKED - Package picked up
├── 11:45 AM - INTRANSIT - In transit
├── 03:20 PM - OUT_DELIVERY - Out for delivery
└── 05:45 PM - DELIVERED - Delivered successfully
```

### Cache Key Generation

```
Cache Key Format:
promptx:tracking:{tracking_number}

Example:
promptx:tracking:PX123456789
```

### Cache Strategy

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Active shipments | 60 seconds | Updates frequently |
| Delivered shipments | 1 hour | Rarely changes |
| Failed/Cancelled | 5 minutes | May retry |

### Error Handling

| Error | Status Code | Action | Return |
|-------|-------------|--------|--------|
| Not Found | 404 | Log warning | Raise NotFoundError |
| Invalid Number | 400 | Log warning | Raise ValidationError |
| API Error | 500 | Log error | Raise APIError |
| Network Error | - | Log error | Raise ConnectionError |

### Proof of Delivery Structure

```json
{
  "recipient_name": "John Doe",
  "recipient_phone": "+94771234567",
  "delivered_at": "2026-01-31T17:45:00",
  "signature": "base64_encoded_signature_image",
  "photo": "base64_encoded_delivery_photo",
  "notes": "Delivered to reception"
}
```

### Tracking Status Flow

```
PENDING → CONFIRMED → PICKED → INTRANSIT → OUT_DELIVERY → DELIVERED

Alternative Paths:
├── INTRANSIT → FAILED → INTRANSIT (retry)
├── OUT_DELIVERY → FAILED → RETURNED
└── Any → CANCELLED
```

### Expected Outcome
- Working tracking functionality
- Current status and location retrieval
- Full event history available
- Status properly mapped to internal values
- Caching for performance

### Verification Checklist
- [ ] track_shipment() method implemented
- [ ] Tracking number validation working
- [ ] Cache checking implemented
- [ ] Tracking request formatting correct
- [ ] API call execution successful
- [ ] Response parsing working
- [ ] Status mapping applied correctly
- [ ] TrackingInfo object creation working
- [ ] TrackingEvent objects created
- [ ] Cache storage implemented
- [ ] Error handling for not found
- [ ] POD data parsed if available
- [ ] Timestamps converted to local timezone

---

## Task 35: Create PromptX Cancel

### Overview
Implement the cancel_shipment() method in PromptXProvider. This method cancels a shipment booking with PromptX API before pickup or during transit if allowed.

### Dependencies
- Task 31: Create PromptXProvider

### Instructions

1. **Implement cancel_shipment method**
   - Open `provider.py`
   - Locate PromptXProvider class
   - Implement `cancel_shipment()` method

2. **Define method signature**
   - Accept shipment_id parameter (internal ID)
   - Accept reason parameter (optional)
   - Return boolean success status

3. **Load shipment record**
   - Retrieve Shipment from database
   - Get PromptX shipment ID (external_id)
   - Verify shipment belongs to tenant

4. **Validate cancellation eligibility**
   - Check current shipment status
   - Allow cancellation only for certain statuses
   - Reject if already delivered or cancelled

5. **Prepare cancellation request**
   - Format shipment ID for API
   - Include cancellation reason
   - Add tenant credentials

6. **Call cancellation API endpoint**
   - Use PromptXClient to make request
   - Call DELETE or POST /cancel endpoint
   - Include shipment identifier

7. **Process cancellation response**
   - Extract cancellation status
   - Extract refund information if applicable
   - Extract any cancellation fees

8. **Update internal shipment record**
   - Update status to CANCELLED
   - Store cancellation reason
   - Store cancelled_at timestamp
   - Store cancellation response

9. **Handle already cancelled**
   - Check if already cancelled in PromptX
   - Sync status if needed
   - Return success if already cancelled

10. **Handle cancellation errors**
    - Handle "too late to cancel" errors
    - Handle "already delivered" errors
    - Return false with error message

### Cancellation Request Structure

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| shipment_id | str | Yes | PromptX shipment ID |
| reason | str | No | Cancellation reason |
| cancelled_by | str | No | User who cancelled |

### Cancellation API Request

```
POST /api/v1/shipments/{shipment_id}/cancel
Headers:
  Authorization: Bearer {api_key}
  Content-Type: application/json
Body:
{
  "reason": "Customer request",
  "cancelled_by": "admin@tenant.com"
}
```

### Cancellation API Response

```json
{
  "success": true,
  "shipment_id": "PX123456789",
  "status": "CANCELLED",
  "cancelled_at": "2026-01-31T12:00:00",
  "refund_amount": 450.00,
  "cancellation_fee": 0.00,
  "message": "Shipment cancelled successfully"
}
```

### Cancellable Status Check

| Current Status | Cancellable | Reason |
|----------------|-------------|--------|
| PENDING | Yes | Not yet processed |
| CONFIRMED | Yes | Not picked up yet |
| PICKED | Maybe | Within grace period |
| INTRANSIT | No | Already in transit |
| OUT_DELIVERY | No | Out for delivery |
| DELIVERED | No | Already delivered |
| FAILED | Yes | Can cancel retry |
| CANCELLED | No | Already cancelled |

### Cancellation Flow

```
cancel_shipment(shipment_id, reason)
    ↓
Load shipment record
    ↓
Check current status
    ↓
Validate cancellable
    ↓
Prepare API request
    ↓
Call cancellation endpoint
    ↓
Process response
    ↓
Update internal record
    ↓
Return success/failure
```

### Grace Period for Picked Shipments

| Status | Time Since Pickup | Cancellable | Fee |
|--------|-------------------|-------------|-----|
| PICKED | < 30 minutes | Yes | None |
| PICKED | 30-60 minutes | Yes | Partial |
| PICKED | > 60 minutes | No | N/A |

### Cancellation Reasons

| Reason Code | Display Text |
|-------------|--------------|
| CUSTOMER_REQUEST | Customer requested cancellation |
| WRONG_ADDRESS | Incorrect address provided |
| DUPLICATE_ORDER | Duplicate order created |
| OUT_OF_STOCK | Item out of stock |
| CUSTOMER_UNAVAILABLE | Customer not available |
| OTHER | Other reason |

### Refund Calculation

```
Refund Amount:
├── If not picked: Full refund
├── If picked < 30min: Full refund
├── If picked 30-60min: 50% refund
└── If in transit: No refund
```

### Error Handling

| Error | API Response | Action | Return |
|-------|--------------|--------|--------|
| Not Found | 404 | Log error | False |
| Too Late | 422 | Log info | False |
| Already Cancelled | 200/400 | Sync status | True |
| Already Delivered | 422 | Update local | False |
| API Error | 500 | Log error | False |

### Internal Record Update

| Field | Update To | Notes |
|-------|-----------|-------|
| status | CANCELLED | Shipment status |
| cancelled_at | Current timestamp | Cancellation time |
| cancellation_reason | From parameter | Why cancelled |
| cancelled_by | User ID/email | Who cancelled |
| refund_amount | From API response | Refund value |
| cancellation_fee | From API response | Fee if any |

### Cancellation Validation

```
Validation Checks:
├── Shipment exists
├── Belongs to tenant
├── Status is cancellable
├── Not already cancelled
└── Within cancellation window
```

### Expected Outcome
- Working cancellation functionality
- Status validation before cancellation
- API integration for cancellation
- Internal record updates
- Proper error handling

### Verification Checklist
- [ ] cancel_shipment() method implemented
- [ ] Shipment loading from database
- [ ] Status validation for cancellable states
- [ ] Cancellation request formatting
- [ ] API call execution successful
- [ ] Response parsing working
- [ ] Internal record update working
- [ ] Status sync for already cancelled
- [ ] Error handling for various scenarios
- [ ] Refund amount captured
- [ ] Cancellation reason stored
- [ ] Boolean return value correct

---

## Task 36: Create PromptX Waybill

### Overview
Implement waybill generation functionality for PromptX shipments. The waybill is a tracking document that accompanies the package and includes barcode, addresses, and shipment details.

### Dependencies
- Task 32: Create PromptX Shipment

### Instructions

1. **Implement get_waybill method**
   - Open `provider.py`
   - Locate PromptXProvider class
   - Implement `get_waybill()` method

2. **Define method signature**
   - Accept shipment_id parameter
   - Return waybill number (string)
   - Handle errors appropriately

3. **Load shipment record**
   - Retrieve Shipment from database
   - Verify shipment exists
   - Check if waybill already exists

4. **Check waybill cache**
   - Check if waybill number already stored
   - Return cached waybill if exists
   - Skip API call if already generated

5. **Prepare waybill request**
   - Format shipment ID for API
   - Build request parameters
   - Include tenant credentials

6. **Call waybill generation API**
   - Use PromptXClient to make request
   - Call POST /waybill or GET /shipments/{id}/waybill
   - Handle response

7. **Parse waybill response**
   - Extract waybill number
   - Extract barcode data
   - Extract generation timestamp

8. **Store waybill number**
   - Update Shipment record with waybill number
   - Store waybill generation timestamp
   - Cache waybill number

9. **Format waybill number**
   - Apply any formatting rules
   - Ensure proper format for display
   - Return formatted number

10. **Handle waybill errors**
    - Handle shipment not found
    - Handle already generated waybill
    - Handle API errors gracefully

### Waybill Request Structure

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| shipment_id | str | Yes | PromptX shipment ID |
| format | str | No | "barcode" or "pdf" |

### Waybill API Request

```
POST /api/v1/shipments/{shipment_id}/waybill
Headers:
  Authorization: Bearer {api_key}
  Content-Type: application/json
Body:
{
  "format": "barcode"
}
```

### Waybill API Response

```json
{
  "waybill_number": "WB987654321",
  "barcode": "123456789012",
  "barcode_image": "base64_encoded_barcode_image",
  "generated_at": "2026-01-31T10:35:00",
  "shipment_id": "PX123456789"
}
```

### Waybill Number Format

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | WB | WB |
| Sequential | 9 digits | 987654321 |
| Full Number | WB + digits | WB987654321 |
| Barcode | 12 digits | 123456789012 |

### Waybill Generation Flow

```
get_waybill(shipment_id)
    ↓
Load shipment record
    ↓
Check if waybill exists
    ↓
If exists → Return cached
    ↓
If not exists:
    Call API to generate
    ↓
    Parse response
    ↓
    Store waybill number
    ↓
    Return waybill number
```

### Waybill Data Storage

| Field | Storage Location | Type |
|-------|------------------|------|
| waybill_number | Shipment.waybill | String |
| barcode | Shipment.barcode | String |
| barcode_image | File storage | Binary |
| generated_at | Shipment.waybill_generated_at | DateTime |

### Waybill Usage

| Usage | Format | Where |
|-------|--------|-------|
| Display | WB987654321 | UI, Emails |
| Scanning | Barcode (Code128) | Physical package |
| Tracking | Either number | Customer portal |
| API Calls | PromptX shipment ID | Internal |

### Cache Strategy

```
Cache Key: promptx:waybill:{shipment_id}
Value: waybill_number
TTL: No expiry (permanent)
```

### Error Handling

| Error | Scenario | Action | Return |
|-------|----------|--------|--------|
| Not Found | Shipment doesn't exist | Raise NotFoundError | None |
| Too Early | Shipment not confirmed | Wait and retry | None |
| Already Exists | Waybill already generated | Return existing | waybill_number |
| API Error | Generation failed | Raise APIError | None |

### Barcode Generation

| Type | Standard | Digits | Use |
|------|----------|--------|-----|
| Primary | Code128 | Variable | Waybill number |
| Alternate | Code39 | Fixed | Tracking number |
| QR Code | QR | N/A | Mobile scanning |

### Waybill Document Contents

```
Waybill Document:
├── Waybill Number (large, top)
├── Barcode (center)
├── Sender Information
│   ├── Name
│   ├── Address
│   └── Phone
├── Receiver Information
│   ├── Name
│   ├── Address
│   └── Phone
├── Package Details
│   ├── Weight
│   ├── Dimensions
│   └── Description
└── Service Information
    ├── Service Type
    ├── Payment Method
    └── Special Instructions
```

### Expected Outcome
- Waybill number generation working
- Waybill stored in shipment record
- Barcode data retrieved
- Caching to prevent duplicate generation

### Verification Checklist
- [ ] get_waybill() method implemented
- [ ] Shipment loading working
- [ ] Waybill existence check
- [ ] API request formatting correct
- [ ] API call execution successful
- [ ] Response parsing working
- [ ] Waybill number stored in database
- [ ] Barcode data captured
- [ ] Cache implementation working
- [ ] Error handling for not found
- [ ] Error handling for already exists
- [ ] Waybill number formatting correct

---

## Task 37: Create PromptX Label

### Overview
Implement label download functionality for PromptX shipments. The label is a printable PDF document containing all shipment details, barcode, and addresses for physical attachment to packages.

### Dependencies
- Task 36: Create PromptX Waybill

### Instructions

1. **Implement download_label method**
   - Open `provider.py`
   - Locate PromptXProvider class
   - Implement `download_label()` method

2. **Define method signature**
   - Accept shipment_id parameter
   - Accept format parameter (pdf, png)
   - Return bytes (label document)

3. **Load shipment record**
   - Retrieve Shipment from database
   - Verify shipment exists and has waybill
   - Get PromptX shipment ID

4. **Validate label eligibility**
   - Ensure shipment is confirmed
   - Ensure waybill generated
   - Check label not already downloaded (optional)

5. **Prepare label request**
   - Format shipment ID for API
   - Specify desired format (PDF, PNG)
   - Include size preferences if supported

6. **Call label download API**
   - Use PromptXClient to make request
   - Call GET /labels or /shipments/{id}/label
   - Set appropriate Accept header

7. **Handle binary response**
   - Receive response content as bytes
   - Validate content type
   - Check file size is reasonable

8. **Store label (optional)**
   - Save label to file storage
   - Link to shipment record
   - Generate download URL

9. **Return label bytes**
   - Return binary label data
   - Include content type in metadata
   - Set appropriate file name

10. **Handle label errors**
    - Handle waybill not generated
    - Handle label generation failures
    - Handle API errors

### Label Request Structure

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| shipment_id | str | Yes | PromptX shipment ID |
| format | str | No | "pdf" or "png" |
| size | str | No | "4x6", "a4", "letter" |

### Label API Request

```
GET /api/v1/shipments/{shipment_id}/label?format=pdf&size=4x6
Headers:
  Authorization: Bearer {api_key}
  Accept: application/pdf
```

### Label API Response

```
Response:
  Status: 200 OK
  Content-Type: application/pdf
  Content-Length: 45678
  Content-Disposition: attachment; filename="label_PX123456789.pdf"
  Body: <binary PDF data>
```

### Label Download Flow

```
download_label(shipment_id, format)
    ↓
Load shipment record
    ↓
Validate waybill exists
    ↓
Prepare API request
    ↓
Call label download endpoint
    ↓
Receive binary response
    ↓
Validate response
    ↓
Store label (optional)
    ↓
Return bytes
```

### Label Format Options

| Format | Content-Type | Size | Use Case |
|--------|--------------|------|----------|
| PDF | application/pdf | 30-50 KB | Printing |
| PNG | image/png | 100-200 KB | Screen display |
| ZPL | application/zpl | 5-10 KB | Thermal printers |

### Label Size Options

| Size | Dimensions | Use |
|------|------------|-----|
| 4x6 | 4" x 6" | Standard thermal |
| A4 | 210mm x 297mm | Laser printer |
| Letter | 8.5" x 11" | US standard |
| A6 | 105mm x 148mm | Small format |

### Label Contents

```
Label Layout (4x6):
┌────────────────────────────┐
│ PromptX Logo     Waybill # │
│                            │
│  ┌──────────────────────┐  │
│  │    Barcode/QR Code   │  │
│  └──────────────────────┘  │
│                            │
│ FROM:                      │
│ Store Name                 │
│ Address Line 1             │
│ City, Postal Code          │
│                            │
│ TO:                        │
│ Customer Name              │
│ Address Line 1             │
│ City, Postal Code          │
│ Phone: +94XXXXXXXXX        │
│                            │
│ Weight: 2.5kg  COD: ₨5000 │
│ Service: Same Day          │
└────────────────────────────┘
```

### File Storage

| Storage Option | Path Pattern | Retention |
|----------------|--------------|-----------|
| Local Storage | /labels/{tenant}/{shipment_id}.pdf | 90 days |
| S3/Cloud | labels/{tenant}/{year}/{month}/{id}.pdf | 1 year |
| Database | BinaryField (not recommended) | Permanent |

### Label Metadata

| Field | Storage | Type |
|-------|---------|------|
| label_url | Shipment.label_url | URLField |
| label_downloaded_at | Shipment.label_downloaded_at | DateTime |
| label_format | Shipment.label_format | CharField |
| label_size | Shipment.label_size | CharField |

### Error Handling

| Error | Scenario | Action | Return |
|-------|----------|--------|--------|
| Not Found | Shipment doesn't exist | Raise NotFoundError | None |
| No Waybill | Waybill not generated | Raise ValidationError | None |
| Generation Failed | PDF creation error | Raise APIError | None |
| Invalid Format | Unsupported format | Raise ValidationError | None |

### Content Validation

| Check | Validation | Action |
|-------|------------|--------|
| Content-Type | Matches requested format | Verify |
| File Size | Between 1KB and 5MB | Validate |
| PDF Magic | Starts with %PDF- | Check |
| PNG Magic | Starts with PNG header | Check |

### Label Caching

```
Cache Strategy:
- Do not cache label bytes (too large)
- Cache label URL for 1 hour
- Invalidate on shipment update
```

### Expected Outcome
- Label download functionality working
- Binary PDF/PNG returned correctly
- Optional storage of label files
- Proper error handling

### Verification Checklist
- [ ] download_label() method implemented
- [ ] Shipment loading working
- [ ] Waybill validation checking
- [ ] API request formatting correct
- [ ] API call with Accept header
- [ ] Binary response handling
- [ ] Content-Type validation
- [ ] File size validation
- [ ] Optional file storage working
- [ ] Label URL generation (if stored)
- [ ] Error handling for no waybill
- [ ] Error handling for generation failures

---

## Task 38: Create PromptX Webhook

### Overview
Implement webhook handler for receiving real-time shipment status updates from PromptX API. This allows the system to receive push notifications when shipment status changes, eliminating the need for constant polling.

### Dependencies
- Task 31: Create PromptXProvider

### Instructions

1. **Create webhooks file**
   - Create `webhooks.py` in `promptx/` directory
   - Import webhook utilities and decorators
   - Import PromptX models and client

2. **Define webhook receiver view**
   - Create Django view or API endpoint
   - Accept POST requests only
   - URL pattern: `/api/webhooks/promptx/`

3. **Implement signature verification**
   - Extract signature from request headers
   - Calculate expected signature
   - Compare signatures securely
   - Reject if signatures don't match

4. **Parse webhook payload**
   - Extract JSON body from request
   - Validate required fields present
   - Parse shipment ID and status

5. **Identify tenant**
   - Extract tenant identifier from payload or headers
   - Load tenant context
   - Switch to tenant schema

6. **Load shipment record**
   - Query shipment by tracking number or external ID
   - Verify shipment exists
   - Lock record for update

7. **Map webhook status**
   - Extract status from payload
   - Use status mapping (Task 39)
   - Convert to internal status enum

8. **Update shipment status**
   - Update shipment status field
   - Update location if provided
   - Add tracking event
   - Update estimated delivery if changed

9. **Trigger notifications**
   - Send email to customer if configured
   - Send SMS if enabled
   - Trigger internal events

10. **Return webhook response**
    - Return 200 OK for successful processing
    - Return 400 for validation errors
    - Return 401 for signature mismatch
    - Log all webhook attempts

### Webhook URL Structure

```
URL: https://yourdomain.com/api/webhooks/promptx/
Method: POST
Content-Type: application/json
Headers:
  X-PromptX-Signature: sha256=...
  X-PromptX-Event: status_update
```

### Webhook Payload Structure

```json
{
  "event": "status_update",
  "timestamp": "2026-01-31T11:45:00Z",
  "shipment": {
    "shipment_id": "PX123456789",
    "tracking_number": "PX123456789",
    "waybill_number": "WB987654321",
    "status": "INTRANSIT",
    "location": "Colombo Processing Center",
    "estimated_delivery": "2026-01-31T18:00:00Z"
  },
  "event_details": {
    "description": "Package in transit",
    "updated_by": "System",
    "latitude": 6.9271,
    "longitude": 79.8612
  }
}
```

### Signature Verification

| Component | Source | Purpose |
|-----------|--------|---------|
| Signature Header | X-PromptX-Signature | Contains HMAC signature |
| Secret Key | Settings/Config | Signing key |
| Payload | Request body | Data to verify |
| Algorithm | SHA256 | Hash algorithm |

### Signature Calculation

```
Signature Verification:
1. Get raw request body (bytes)
2. Get secret key from settings
3. Calculate HMAC: hmac.new(key, body, sha256)
4. Get hex digest
5. Compare with header signature
6. Accept if match, reject if not
```

### Webhook Event Types

| Event Type | Description | Action |
|------------|-------------|--------|
| status_update | Status changed | Update status |
| location_update | Location changed | Update location |
| delivered | Package delivered | Mark delivered, send notification |
| failed_delivery | Delivery failed | Update status, alert |
| cancelled | Shipment cancelled | Update status |
| exception | Exception occurred | Log and alert |

### Webhook Processing Flow

```
Receive Webhook POST
    ↓
Verify signature
    ↓
Parse payload
    ↓
Identify tenant
    ↓
Load shipment
    ↓
Map status
    ↓
Update shipment
    ↓
Add tracking event
    ↓
Trigger notifications
    ↓
Return 200 OK
```

### Tenant Identification Strategies

| Strategy | Implementation | Reliability |
|----------|----------------|-------------|
| Subdomain | Extract from request host | High |
| Header | X-Tenant-ID header | Medium |
| Payload | tenant_id in webhook data | High |
| Shipment Lookup | Query by tracking number | High |

### Shipment Update Logic

| Field | Update From | Notes |
|-------|-------------|-------|
| status | payload.status | Map to internal |
| current_location | payload.location | Update if provided |
| estimated_delivery | payload.estimated_delivery | Update if changed |
| last_updated | Current timestamp | Always update |

### Tracking Event Creation

```
TrackingEvent:
├── shipment: Foreign key
├── status: Mapped status
├── status_raw: Original PromptX status
├── location: From payload
├── description: Event description
├── timestamp: Event timestamp
├── event_data: Full payload (JSON)
└── source: "webhook"
```

### Notification Triggers

| Status | Email | SMS | Push | Internal Event |
|--------|-------|-----|------|----------------|
| CONFIRMED | ✓ | - | - | shipment.confirmed |
| PICKED_UP | ✓ | ✓ | ✓ | shipment.picked_up |
| IN_TRANSIT | - | - | - | shipment.in_transit |
| OUT_FOR_DELIVERY | ✓ | ✓ | ✓ | shipment.out_for_delivery |
| DELIVERED | ✓ | ✓ | ✓ | shipment.delivered |
| DELIVERY_FAILED | ✓ | ✓ | ✓ | shipment.failed |

### Error Handling

| Error Type | HTTP Status | Response | Action |
|------------|-------------|----------|--------|
| Invalid Signature | 401 | Unauthorized | Log attempt |
| Invalid Payload | 400 | Bad Request | Log error |
| Shipment Not Found | 404 | Not Found | Log warning |
| Server Error | 500 | Internal Error | Log and alert |
| Success | 200 | OK | No action |

### Security Measures

| Measure | Implementation |
|---------|----------------|
| Signature Verification | HMAC SHA256 |
| HTTPS Only | Enforce SSL |
| IP Whitelist | Check sender IP (optional) |
| Rate Limiting | Limit webhooks per minute |
| Logging | Log all attempts |

### Webhook Retry Handling

| Scenario | PromptX Behavior | Our Response |
|----------|------------------|--------------|
| 200 OK | Stop retrying | Process complete |
| 4xx Error | Stop retrying | Fix issue |
| 5xx Error | Retry with backoff | Log and investigate |
| Timeout | Retry with backoff | Log and investigate |

### Expected Outcome
- Webhook endpoint receiving PromptX updates
- Signature verification for security
- Automatic shipment status updates
- Tracking events created
- Notifications triggered

### Verification Checklist
- [ ] `backend/apps/shipping/providers/promptx/webhooks.py` created
- [ ] Webhook receiver view defined
- [ ] POST-only endpoint created
- [ ] Signature verification implemented
- [ ] Payload parsing working
- [ ] Tenant identification working
- [ ] Shipment loading and locking
- [ ] Status mapping applied
- [ ] Shipment update logic working
- [ ] Tracking event creation
- [ ] Notification triggers implemented
- [ ] Error handling for all scenarios
- [ ] 200 OK response for success
- [ ] Webhook logging implemented

---

## Task 39: Create PromptX Status Map

### Overview
Define the status mapping between PromptX shipment statuses and internal system statuses. This mapping ensures consistent status representation across different courier providers and proper state transitions.

### Dependencies
- Task 38: Create PromptX Webhook

### Instructions

1. **Open constants file**
   - Open `constants.py` in `promptx/` directory
   - Add status mapping section
   - Import status enum if needed

2. **Define status mapping dictionary**
   - Create `PROMPTX_STATUS_MAP` constant
   - Map PromptX statuses to internal StatusEnum values
   - Cover all possible PromptX statuses

3. **Add reverse mapping**
   - Create `INTERNAL_TO_PROMPTX_STATUS_MAP` for reverse lookup
   - Map internal statuses back to PromptX
   - Use for API requests

4. **Define status display names**
   - Create `PROMPTX_STATUS_DISPLAY` dictionary
   - Provide human-readable labels
   - Support multiple languages if needed

5. **Add status descriptions**
   - Create detailed descriptions for each status
   - Explain what each status means
   - Use for customer communications

6. **Define status categories**
   - Group statuses by category (active, completed, failed)
   - Create `PROMPTX_STATUS_CATEGORIES` dictionary
   - Use for filtering and reporting

7. **Add status colors**
   - Define UI colors for each status
   - Create `PROMPTX_STATUS_COLORS` dictionary
   - Support theming

8. **Define status icons**
   - Map statuses to icon names
   - Create `PROMPTX_STATUS_ICONS` dictionary
   - Use for UI display

9. **Create status helper functions**
   - Add `map_promptx_status()` function
   - Add `is_terminal_status()` function
   - Add `get_status_display()` function

10. **Add status validation**
    - Create `is_valid_promptx_status()` function
    - Validate status transitions
    - Define allowed transitions

### Status Mapping Dictionary

```python
PROMPTX_STATUS_MAP = {
    "PENDING": StatusEnum.PENDING,
    "CONFIRMED": StatusEnum.CONFIRMED,
    "PICKED": StatusEnum.PICKED_UP,
    "INTRANSIT": StatusEnum.IN_TRANSIT,
    "OUT_DELIVERY": StatusEnum.OUT_FOR_DELIVERY,
    "DELIVERED": StatusEnum.DELIVERED,
    "FAILED": StatusEnum.DELIVERY_FAILED,
    "RETURNED": StatusEnum.RETURNED,
    "CANCELLED": StatusEnum.CANCELLED,
    "EXCEPTION": StatusEnum.EXCEPTION,
}
```

### Reverse Mapping

```python
INTERNAL_TO_PROMPTX_STATUS_MAP = {
    StatusEnum.PENDING: "PENDING",
    StatusEnum.CONFIRMED: "CONFIRMED",
    StatusEnum.PICKED_UP: "PICKED",
    StatusEnum.IN_TRANSIT: "INTRANSIT",
    StatusEnum.OUT_FOR_DELIVERY: "OUT_DELIVERY",
    StatusEnum.DELIVERED: "DELIVERED",
    StatusEnum.DELIVERY_FAILED: "FAILED",
    StatusEnum.RETURNED: "RETURNED",
    StatusEnum.CANCELLED: "CANCELLED",
    StatusEnum.EXCEPTION: "EXCEPTION",
}
```

### Status Display Names

| PromptX Status | Internal Status | Display Name (EN) | Display Name (SI) |
|----------------|-----------------|-------------------|-------------------|
| PENDING | PENDING | Order Pending | ඇණවුම අපේක්ෂාවෙන් |
| CONFIRMED | CONFIRMED | Booking Confirmed | වෙන්කිරීම තහවුරු කරන ලදී |
| PICKED | PICKED_UP | Picked Up | ගෙනිණ |
| INTRANSIT | IN_TRANSIT | In Transit | ප්‍රවාහනයේ |
| OUT_DELIVERY | OUT_FOR_DELIVERY | Out for Delivery | බෙදාහැරීමට පිටත් වී ඇත |
| DELIVERED | DELIVERED | Delivered | භාර දෙන ලදී |
| FAILED | DELIVERY_FAILED | Delivery Failed | බෙදාහැරීම අසාර්ථකයි |
| RETURNED | RETURNED | Returned to Sender | යවන්නාට ආපසු |
| CANCELLED | CANCELLED | Cancelled | අවලංගු කරන ලදී |

### Status Descriptions

```python
PROMPTX_STATUS_DESCRIPTIONS = {
    "PENDING": "Order has been placed and awaiting confirmation",
    "CONFIRMED": "Booking confirmed, awaiting pickup",
    "PICKED": "Package has been picked up from sender",
    "INTRANSIT": "Package is in transit to destination",
    "OUT_DELIVERY": "Package is out for delivery",
    "DELIVERED": "Package successfully delivered to recipient",
    "FAILED": "Delivery attempt failed, will retry",
    "RETURNED": "Package returned to sender",
    "CANCELLED": "Shipment has been cancelled",
}
```

### Status Categories

```python
PROMPTX_STATUS_CATEGORIES = {
    "active": ["PENDING", "CONFIRMED", "PICKED", "INTRANSIT", "OUT_DELIVERY"],
    "completed": ["DELIVERED"],
    "failed": ["FAILED", "RETURNED", "CANCELLED", "EXCEPTION"],
}
```

### Status Colors (Tailwind CSS)

```python
PROMPTX_STATUS_COLORS = {
    "PENDING": "gray",
    "CONFIRMED": "blue",
    "PICKED": "indigo",
    "INTRANSIT": "purple",
    "OUT_DELIVERY": "yellow",
    "DELIVERED": "green",
    "FAILED": "red",
    "RETURNED": "orange",
    "CANCELLED": "gray",
    "EXCEPTION": "red",
}
```

### Status Icons (Heroicons)

```python
PROMPTX_STATUS_ICONS = {
    "PENDING": "clock",
    "CONFIRMED": "check-circle",
    "PICKED": "hand-raised",
    "INTRANSIT": "truck",
    "OUT_DELIVERY": "map-pin",
    "DELIVERED": "check-badge",
    "FAILED": "x-circle",
    "RETURNED": "arrow-uturn-left",
    "CANCELLED": "no-symbol",
    "EXCEPTION": "exclamation-triangle",
}
```

### Helper Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| map_promptx_status() | (promptx_status: str) → StatusEnum | Convert to internal |
| reverse_map_status() | (internal_status: StatusEnum) → str | Convert to PromptX |
| get_status_display() | (status: str, lang: str) → str | Get display name |
| is_terminal_status() | (status: StatusEnum) → bool | Check if final |
| is_active_status() | (status: StatusEnum) → bool | Check if active |

### Terminal Statuses

| Status | Terminal | Reason |
|--------|----------|--------|
| DELIVERED | Yes | Final success state |
| CANCELLED | Yes | Final cancelled state |
| RETURNED | Yes | Returned to sender |
| Other statuses | No | Can still change |

### Status Transitions

```
Valid Transitions:
PENDING → CONFIRMED → PICKED → INTRANSIT → OUT_DELIVERY → DELIVERED

Alternative Paths:
├── Any → CANCELLED (if allowed)
├── OUT_DELIVERY → FAILED → INTRANSIT (retry)
├── FAILED → RETURNED (if max retries)
└── Any → EXCEPTION (system error)
```

### Status Validation Function

```python
def is_valid_transition(from_status: str, to_status: str) -> bool:
    """
    Check if status transition is valid.
    """
    valid_transitions = {
        "PENDING": ["CONFIRMED", "CANCELLED"],
        "CONFIRMED": ["PICKED", "CANCELLED"],
        "PICKED": ["INTRANSIT", "CANCELLED"],
        "INTRANSIT": ["OUT_DELIVERY", "EXCEPTION"],
        "OUT_DELIVERY": ["DELIVERED", "FAILED"],
        "FAILED": ["INTRANSIT", "RETURNED"],
        "DELIVERED": [],  # Terminal
        "RETURNED": [],  # Terminal
        "CANCELLED": [],  # Terminal
    }
    return to_status in valid_transitions.get(from_status, [])
```

### Expected Outcome
- Complete status mapping between systems
- Helper functions for status conversion
- Display names and descriptions
- UI styling information (colors, icons)

### Verification Checklist
- [ ] PROMPTX_STATUS_MAP dictionary defined
- [ ] INTERNAL_TO_PROMPTX_STATUS_MAP reverse mapping
- [ ] PROMPTX_STATUS_DISPLAY names defined
- [ ] PROMPTX_STATUS_DESCRIPTIONS added
- [ ] PROMPTX_STATUS_CATEGORIES defined
- [ ] PROMPTX_STATUS_COLORS specified
- [ ] PROMPTX_STATUS_ICONS mapped
- [ ] map_promptx_status() function created
- [ ] is_terminal_status() function added
- [ ] get_status_display() function implemented
- [ ] Status transition validation function
- [ ] All PromptX statuses covered

---

## Task 40: Create PromptX Registration

### Overview
Register PromptXProvider with the CourierFactory to make it available throughout the shipping system. This enables automatic provider discovery and instantiation.

### Dependencies
- Task 31: Create PromptXProvider
- CourierFactory must exist

### Instructions

1. **Locate provider registration**
   - Find CourierFactory or provider registry
   - Usually in `shipping/providers/__init__.py`
   - Or in provider factory module

2. **Import PromptXProvider**
   - Add import statement for PromptXProvider
   - Import from promptx.provider module
   - Ensure import path is correct

3. **Register provider**
   - Add PromptXProvider to provider registry
   - Use provider code "promptx" as key
   - Map to PromptXProvider class

4. **Update provider list**
   - Add "promptx" to AVAILABLE_PROVIDERS list
   - Update provider choices if enum exists
   - Document provider code

5. **Add provider metadata**
   - Define provider display name
   - Define provider description
   - Set provider capabilities

6. **Update package init**
   - Export PromptXProvider from promptx package
   - Update `__all__` list in `__init__.py`
   - Ensure proper package imports

7. **Create provider config entry**
   - Add PromptX to settings if needed
   - Define default configuration
   - Document configuration options

8. **Update provider documentation**
   - Add PromptX to provider list docs
   - Document provider-specific features
   - Add integration guide reference

### Provider Registry Structure

```python
# shipping/providers/__init__.py

from .domex.provider import DomexProvider
from .promptx.provider import PromptXProvider

PROVIDER_REGISTRY = {
    "domex": DomexProvider,
    "promptx": PromptXProvider,
}

AVAILABLE_PROVIDERS = [
    "domex",
    "promptx",
]
```

### CourierFactory Registration

```python
# shipping/factory.py

class CourierFactory:
    _providers = {
        "domex": DomexProvider,
        "promptx": PromptXProvider,
    }
    
    @classmethod
    def get_provider(cls, provider_code: str, tenant):
        provider_class = cls._providers.get(provider_code)
        if not provider_class:
            raise ValueError(f"Unknown provider: {provider_code}")
        return provider_class(tenant)
    
    @classmethod
    def get_available_providers(cls, tenant):
        """Return list of configured providers for tenant"""
        available = []
        for code, provider_class in cls._providers.items():
            provider = provider_class(tenant)
            if provider.is_available:
                available.append(provider)
        return available
```

### Provider Metadata

```python
PROVIDER_METADATA = {
    "promptx": {
        "name": "Prompt X",
        "display_name": "Prompt X Courier",
        "description": "Same-day delivery in Colombo Metro",
        "logo": "/static/images/providers/promptx-logo.png",
        "website": "https://promptx.lk",
        "support_email": "support@promptx.lk",
        "capabilities": {
            "same_day": True,
            "cod": True,
            "insurance": True,
            "tracking": True,
            "international": False,
        },
        "coverage": ["Colombo Metro"],
        "features": [
            "Real-time tracking",
            "Same-day delivery",
            "COD support",
            "Insurance options",
        ],
    }
}
```

### Package __init__.py

```python
# shipping/providers/promptx/__init__.py

from .provider import PromptXProvider
from .client import PromptXClient
from .config import PromptXConfig
from .constants import *
from .errors import *

__all__ = [
    "PromptXProvider",
    "PromptXClient",
    "PromptXConfig",
]
```

### Provider Choices (Django Model)

```python
class ShippingProviderChoices(models.TextChoices):
    DOMEX = "domex", "Domex Courier"
    PROMPTX = "promptx", "Prompt X"
    # ... other providers
```

### Settings Integration

```python
# config/settings/integrations/__init__.py

from .domex import *
from .promptx import *

ENABLED_SHIPPING_PROVIDERS = [
    "domex",
    "promptx",
]
```

### Provider Discovery

```python
def discover_providers(tenant):
    """
    Discover and return all available providers for a tenant.
    """
    providers = []
    for code in AVAILABLE_PROVIDERS:
        try:
            provider = CourierFactory.get_provider(code, tenant)
            if provider.is_available:
                providers.append({
                    "code": code,
                    "name": provider.name,
                    "capabilities": provider.get_capabilities(),
                })
        except Exception as e:
            logger.error(f"Error loading provider {code}: {e}")
    return providers
```

### Migration for Provider Choice

```python
# If ShippingProvider is a database model with choices:

# Add to migration
migrations.AlterField(
    model_name='shipment',
    name='provider',
    field=models.CharField(
        max_length=50,
        choices=[
            ('domex', 'Domex'),
            ('promptx', 'Prompt X'),
        ]
    ),
)
```

### Expected Outcome
- PromptXProvider registered with factory
- Provider available for instantiation
- Provider discoverable by code
- Proper imports and exports

### Verification Checklist
- [ ] PromptXProvider imported in provider registry
- [ ] Provider registered in PROVIDER_REGISTRY
- [ ] "promptx" added to AVAILABLE_PROVIDERS
- [ ] Provider metadata defined
- [ ] Package __init__.py updated
- [ ] Provider exported from package
- [ ] CourierFactory can instantiate PromptXProvider
- [ ] Settings integration complete
- [ ] Provider choices updated (if applicable)
- [ ] Documentation updated

---

## Task 41: Create PromptX Admin

### Overview
Create Django admin interface for managing PromptXConfig records. Provide tenant administrators with a user-friendly interface to configure PromptX credentials and settings.

### Dependencies
- Task 26: Create PromptXConfig Model

### Instructions

1. **Create admin file**
   - Create `admin.py` in `promptx/` directory (if not exists)
   - Import Django admin module
   - Import PromptXConfig model

2. **Register PromptXConfig model**
   - Create PromptXConfigAdmin class
   - Inherit from admin.ModelAdmin
   - Register with admin.site.register()

3. **Define list display**
   - Show tenant, is_active, is_sandbox
   - Show created_at, last_verified_at
   - Add status indicators

4. **Add list filters**
   - Filter by is_active
   - Filter by is_sandbox
   - Filter by created_at date
   - Filter by tenant if multi-tenant admin

5. **Configure search fields**
   - Search by tenant name
   - Search by account_id
   - Search by notification_email

6. **Define field organization**
   - Group fields in fieldsets
   - Separate credentials, config, notifications
   - Use collapsible sections

7. **Add readonly fields**
   - Make created_at readonly
   - Make updated_at readonly
   - Make last_verified_at readonly
   - Show waybill count or shipment count

8. **Implement custom actions**
   - Add "Verify Credentials" action
   - Add "Test Connection" action
   - Add "Enable/Disable" actions

9. **Add inline editing (optional)**
   - Show recent shipments inline
   - Display summary statistics
   - Add quick actions

10. **Secure sensitive fields**
    - Mask API key in list view
    - Use password widget for API key field
    - Restrict permissions appropriately

### Admin Class Structure

```python
# shipping/providers/promptx/admin.py

from django.contrib import admin
from .config import PromptXConfig

@admin.register(PromptXConfig)
class PromptXConfigAdmin(admin.ModelAdmin):
    list_display = [
        'tenant',
        'is_active',
        'is_sandbox',
        'same_day_enabled',
        'cod_enabled',
        'created_at',
        'status_indicator',
    ]
    
    list_filter = [
        'is_active',
        'is_sandbox',
        'same_day_enabled',
        'cod_enabled',
        'created_at',
    ]
    
    search_fields = [
        'tenant__name',
        'account_id',
        'notification_email',
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'last_verified_at',
    ]
    
    fieldsets = (
        ('Tenant', {
            'fields': ('tenant',)
        }),
        ('Credentials', {
            'fields': ('api_key', 'account_id'),
            'description': 'PromptX API credentials',
        }),
        ('Configuration', {
            'fields': (
                'is_active',
                'is_sandbox',
                'same_day_enabled',
                'cod_enabled',
                'max_cod_amount',
            ),
        }),
        ('Default Settings', {
            'fields': ('default_pickup_address',),
            'classes': ('collapse',),
        }),
        ('Notifications', {
            'fields': (
                'notification_email',
                'notification_phone',
            ),
            'classes': ('collapse',),
        }),
        ('Tracking', {
            'fields': (
                'created_at',
                'updated_at',
                'last_verified_at',
            ),
            'classes': ('collapse',),
        }),
    )
    
    actions = ['verify_credentials', 'enable_configs', 'disable_configs']
```

### List Display Fields

| Field | Display | Format |
|-------|---------|--------|
| tenant | Tenant name | Link to tenant |
| is_active | Active status | ✓ or ✗ |
| is_sandbox | Sandbox mode | Badge |
| same_day_enabled | Same-day | ✓ or ✗ |
| cod_enabled | COD | ✓ or ✗ |
| created_at | Created date | Short date |
| status_indicator | Overall status | Colored badge |

### Status Indicator Method

```python
def status_indicator(self, obj):
    """Display colored status indicator"""
    if not obj.is_active:
        return format_html(
            '<span style="color: gray;">Disabled</span>'
        )
    if obj.is_sandbox:
        return format_html(
            '<span style="color: orange;">Sandbox</span>'
        )
    if obj.is_configured():
        return format_html(
            '<span style="color: green;">✓ Configured</span>'
        )
    return format_html(
        '<span style="color: red;">⚠ Incomplete</span>'
    )

status_indicator.short_description = 'Status'
```

### Custom Actions

| Action | Function | Description |
|--------|----------|-------------|
| verify_credentials | Test API connection | Verify credentials work |
| enable_configs | Set is_active=True | Enable selected configs |
| disable_configs | Set is_active=False | Disable selected configs |
| test_same_day | Check same-day eligibility | Test same-day feature |

### Verify Credentials Action

```python
@admin.action(description='Verify API credentials')
def verify_credentials(self, request, queryset):
    """Verify credentials for selected configurations"""
    success_count = 0
    for config in queryset:
        try:
            if config.verify_credentials():
                success_count += 1
                config.update_last_verified()
        except Exception as e:
            self.message_user(
                request,
                f"Verification failed for {config.tenant}: {e}",
                level=messages.ERROR
            )
    
    if success_count:
        self.message_user(
            request,
            f"Successfully verified {success_count} configuration(s)",
            level=messages.SUCCESS
        )
```

### API Key Field Widget

```python
from django import forms

class PromptXConfigAdminForm(forms.ModelForm):
    class Meta:
        model = PromptXConfig
        fields = '__all__'
        widgets = {
            'api_key': forms.PasswordInput(render_value=True),
        }
```

### Inline Display (Optional)

```python
class RecentShipmentsInline(admin.TabularInline):
    model = Shipment
    extra = 0
    max_num = 5
    can_delete = False
    fields = ['tracking_number', 'status', 'created_at']
    readonly_fields = ['tracking_number', 'status', 'created_at']
    
    def has_add_permission(self, request, obj=None):
        return False

# Add to PromptXConfigAdmin
inlines = [RecentShipmentsInline]
```

### Permissions

| Permission | Codename | Description |
|------------|----------|-------------|
| View | view_promptxconfig | Can view configs |
| Add | add_promptxconfig | Can add configs |
| Change | change_promptxconfig | Can edit configs |
| Delete | delete_promptxconfig | Can delete configs |

### Expected Outcome
- Functional Django admin for PromptXConfig
- Easy configuration management
- Credential verification actions
- Proper field organization
- Security for sensitive data

### Verification Checklist
- [ ] `backend/apps/shipping/providers/promptx/admin.py` created
- [ ] PromptXConfigAdmin class defined
- [ ] Model registered with admin
- [ ] List display configured
- [ ] List filters added
- [ ] Search fields configured
- [ ] Fieldsets organized logically
- [ ] Readonly fields set
- [ ] Custom actions implemented
- [ ] Status indicator working
- [ ] API key masked/secured
- [ ] Permissions configured
- [ ] Admin accessible in Django admin

---

## Task 42: Verify PromptX Integration

### Overview
Comprehensively test and verify the complete PromptX integration. Execute end-to-end tests covering configuration, shipment creation, rate retrieval, tracking, webhooks, and admin interface.

### Dependencies
- Task 41: Create PromptX Admin
- All previous tasks completed

### Instructions

1. **Verify provider registration**
   - Check PromptXProvider in provider registry
   - Verify provider discoverable by code
   - Test provider instantiation

2. **Test configuration setup**
   - Create PromptXConfig via admin
   - Add test API credentials
   - Verify configuration saved

3. **Test credential verification**
   - Run verify_credentials() method
   - Check API connectivity
   - Verify authentication working

4. **Test rate retrieval**
   - Call get_rates() with test address
   - Verify rates returned
   - Check same-day eligibility logic

5. **Test shipment creation**
   - Create test shipment
   - Verify API call successful
   - Check shipment record created
   - Verify tracking number assigned

6. **Test tracking**
   - Call track_shipment() with tracking number
   - Verify tracking info returned
   - Check status mapping correct

7. **Test waybill generation**
   - Call get_waybill() for shipment
   - Verify waybill number returned
   - Check waybill stored

8. **Test label download**
   - Call download_label() for shipment
   - Verify PDF bytes returned
   - Check file validity

9. **Test webhook processing**
   - Send test webhook request
   - Verify signature validation
   - Check shipment status updated
   - Verify tracking event created

10. **Test cancellation**
    - Cancel test shipment
    - Verify cancellation successful
    - Check status updated

11. **Test error handling**
    - Test invalid API credentials
    - Test out-of-coverage addresses
    - Test API errors
    - Verify proper exceptions raised

12. **Test edge cases**
    - Test cutoff time checking
    - Test same-day eligibility
    - Test COD amount limits
    - Test dimension limits

13. **Verify admin interface**
    - Access PromptXConfig admin
    - Test CRUD operations
    - Test custom actions
    - Verify field display and editing

14. **Performance testing**
    - Test rate caching
    - Test tracking caching
    - Verify API timeout handling
    - Check connection pooling

15. **Security testing**
    - Test webhook signature verification
    - Verify API key encryption
    - Check permission requirements
    - Test input validation

16. **Documentation review**
    - Verify all files created
    - Check code comments
    - Verify docstrings present
    - Review integration documentation

### Verification Checklist Structure

```
PromptX Integration Verification
├── Provider Registration
│   ├── [ ] Provider in registry
│   ├── [ ] Provider discoverable
│   └── [ ] Instantiation working
├── Configuration
│   ├── [ ] Config model working
│   ├── [ ] Admin interface functional
│   ├── [ ] Credential verification
│   └── [ ] Settings loading
├── Core Operations
│   ├── [ ] Rate retrieval
│   ├── [ ] Shipment creation
│   ├── [ ] Tracking
│   ├── [ ] Cancellation
│   ├── [ ] Waybill generation
│   └── [ ] Label download
├── Webhook Processing
│   ├── [ ] Signature verification
│   ├── [ ] Payload parsing
│   ├── [ ] Status updates
│   └── [ ] Event creation
├── Error Handling
│   ├── [ ] API errors
│   ├── [ ] Network errors
│   ├── [ ] Validation errors
│   └── [ ] Business logic errors
└── Performance & Security
    ├── [ ] Caching working
    ├── [ ] Security measures
    ├── [ ] Input validation
    └── [ ] Logging functional
```

### Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Happy Path | Create → Track → Deliver | All operations succeed |
| Rate Inquiry | Get rates for valid address | Rates returned |
| Same-Day Check | Check before/after cutoff | Correct eligibility |
| Out of Coverage | Get rates for invalid area | Empty rates or error |
| Invalid API Key | Use wrong credentials | Authentication error |
| Network Timeout | Simulate timeout | Retry and error handling |
| Webhook Update | Send status update | Status updated locally |

### Test Data

```python
TEST_SENDER = {
    "name": "Test Store",
    "phone": "+94771234567",
    "address_line_1": "123 Test Street",
    "city": "Colombo",
    "postal_code": "00300",
}

TEST_RECEIVER = {
    "name": "Test Customer",
    "phone": "+94779876543",
    "address_line_1": "456 Customer Road",
    "city": "Colombo",
    "postal_code": "00700",
}

TEST_PACKAGE = {
    "weight": 2.5,
    "length": 30,
    "width": 20,
    "height": 15,
    "description": "Test Package",
    "value": 50000.00,
}
```

### Integration Test Example

```python
def test_promptx_integration():
    """End-to-end integration test"""
    
    # Setup
    tenant = create_test_tenant()
    config = PromptXConfig.objects.create(
        tenant=tenant,
        api_key="test_key",
        is_active=True,
        is_sandbox=True,
    )
    
    # Test provider
    provider = PromptXProvider(tenant)
    assert provider.is_available
    
    # Test rates
    rates = provider.get_rates(TEST_RECEIVER, TEST_PACKAGE)
    assert len(rates) > 0
    
    # Test shipment creation
    shipment_data = {
        "sender": TEST_SENDER,
        "receiver": TEST_RECEIVER,
        "package": TEST_PACKAGE,
    }
    shipment = provider.create_shipment(shipment_data)
    assert shipment.tracking_number
    
    # Test tracking
    tracking = provider.track_shipment(shipment.tracking_number)
    assert tracking.current_status
    
    # Test waybill
    waybill = provider.get_waybill(shipment.id)
    assert waybill
    
    # Cleanup
    delete_test_data()
```

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Provider not found | Not registered | Check provider registry |
| API auth fails | Invalid credentials | Verify API key in config |
| Rates empty | Out of coverage | Check postal code coverage |
| Shipment fails | Validation error | Check address format |
| Webhook rejected | Invalid signature | Verify webhook secret |
| Tracking fails | Invalid number | Check tracking number format |

### Performance Benchmarks

| Operation | Target Time | Acceptable Time |
|-----------|-------------|-----------------|
| Rate retrieval | < 1s | < 3s |
| Shipment creation | < 2s | < 5s |
| Tracking query | < 500ms | < 2s |
| Webhook processing | < 500ms | < 1s |
| Label download | < 3s | < 10s |

### Expected Outcome
- Complete PromptX integration verified
- All operations tested and working
- Error handling validated
- Performance acceptable
- Security measures in place
- Documentation complete

### Final Verification Checklist
- [ ] Provider registered and discoverable
- [ ] Configuration model and admin working
- [ ] Credential verification successful
- [ ] Rate retrieval functional
- [ ] Shipment creation working
- [ ] Tracking operational
- [ ] Waybill generation successful
- [ ] Label download working
- [ ] Webhook processing functional
- [ ] Status mapping correct
- [ ] Cancellation working
- [ ] Error handling comprehensive
- [ ] Caching implemented
- [ ] Security measures validated
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] No critical bugs
- [ ] Ready for production use

---

## Summary

This document completed the PromptX provider implementation with all shipping operations, webhook handling, admin interface, and comprehensive verification. The PromptX integration is now fully functional and ready for production use.

### Completed Tasks
1. ✓ Created PromptXProvider class with all interfaces
2. ✓ Implemented shipment creation functionality
3. ✓ Implemented rate retrieval with caching
4. ✓ Implemented tracking with event history
5. ✓ Implemented shipment cancellation
6. ✓ Implemented waybill generation
7. ✓ Implemented label download
8. ✓ Created webhook handler with signature verification
9. ✓ Created comprehensive status mapping
10. ✓ Registered provider with factory
11. ✓ Created admin interface for configuration
12. ✓ Completed integration verification

### Integration Complete
PromptX courier integration is now complete with same-day delivery support for Colombo Metro, real-time webhook updates, comprehensive tracking, and full administrative capabilities.
