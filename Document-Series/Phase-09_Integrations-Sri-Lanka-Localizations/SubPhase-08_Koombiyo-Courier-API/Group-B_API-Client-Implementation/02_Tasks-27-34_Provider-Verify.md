# Tasks 27-34: Shipping Provider and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** B - API Client Implementation  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-26_Client-Methods.md](01_Tasks-17-26_Client-Methods.md)
- **→ Next Document:** [Group-C_Waybill-Generation/00_GROUP_OVERVIEW.md](../Group-C_Waybill-Generation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers the creation of the abstract ShippingProvider interface and its Koombiyo implementation. It establishes a standardized interface for all shipping providers, enabling pluggable courier integrations. The document includes the abstract base class definition, required method signatures, KoombiyoProvider implementation, provider registration system, and complete verification.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create ShippingProvider ABC | Medium | 40 min |
| 28 | Create create_shipment Method | Low | 20 min |
| 29 | Create get_rates Method | Low | 20 min |
| 30 | Create track_shipment Method | Low | 20 min |
| 31 | Create cancel_shipment Method | Low | 20 min |
| 32 | Create KoombiyoProvider Class | High | 50 min |
| 33 | Create Provider Registration | Low | 25 min |
| 34 | Verify API Client | Low | 30 min |

---

## Task 27: Create ShippingProvider ABC

### Overview
Create the ShippingProvider abstract base class that defines the standard interface for all shipping courier integrations. This abstract class establishes the contract that all provider implementations must follow, ensuring consistent behavior across different courier services (Koombiyo, DHL, FedEx, etc.). It defines abstract methods for core shipping operations without implementing them.

### Dependencies
- Task 16: Verify configuration settings

### Instructions

1. **Create base provider module**
   - Navigate to `backend/apps/shipping/providers/` directory
   - Create new file named `base.py`
   - This module will contain abstract interfaces

2. **Import required dependencies**
   - Import ABC (Abstract Base Class) from abc module
   - Import abstractmethod decorator
   - Import typing annotations (Dict, List, Optional)
   - Import data classes for request/response models

3. **Define ShippingProvider abstract class**
   - Create ShippingProvider class inheriting from ABC
   - Add comprehensive docstring explaining purpose
   - Document expected behavior for subclasses
   - Define class as abstract base class

4. **Define abstract methods**
   - Mark methods with @abstractmethod decorator
   - Define method signatures only (no implementation)
   - Include type hints for parameters and returns
   - Add docstrings for each method

5. **Add provider configuration**
   - Define `__init__` method accepting configuration
   - Store configuration in instance
   - Allow subclasses to call super().__init__()
   - Don't mark __init__ as abstract

6. **Define provider metadata**
   - Add class attributes for provider info
   - Define provider name attribute
   - Define provider capabilities
   - Add version information

7. **Include helper properties**
   - Define `is_configured()` property
   - Define `provider_name` property
   - Define `supports_tracking()` property
   - Define `supports_rates()` property

8. **Add validation methods**
   - Define `validate_config()` method
   - Define `validate_address()` method
   - Provide default implementations
   - Allow subclasses to override

### ShippingProvider Architecture

```
┌──────────────────────────────────────┐
│     ShippingProvider (ABC)           │
├──────────────────────────────────────┤
│ Attributes:                          │
│ - config: dict                       │
│ - provider_name: str                 │
│                                      │
│ Abstract Methods:                    │
│ - create_shipment()                  │
│ - get_rates()                        │
│ - track_shipment()                   │
│ - cancel_shipment()                  │
│                                      │
│ Concrete Methods:                    │
│ - __init__(config)                   │
│ - validate_config()                  │
│ - is_configured()                    │
└──────────────────────────────────────┘
         ▲
         │ Inherits
         │
┌──────────────────────────────────────┐
│     KoombiyoProvider                 │
│     (Concrete Implementation)        │
└──────────────────────────────────────┘
```

### Abstract Method Signatures

| Method | Parameters | Return Type | Purpose |
|--------|------------|-------------|---------|
| create_shipment | request: ShipmentRequest | ShipmentResponse | Create new shipment |
| get_rates | request: RateRequest | List[Rate] | Get shipping rates |
| track_shipment | waybill_number: str | TrackingInfo | Track shipment status |
| cancel_shipment | waybill_number: str | CancellationResult | Cancel shipment |

### Provider Capabilities

```
Provider Capabilities Structure:
┌────────────────────────────────┐
│ capabilities = {               │
│   'tracking': True,            │
│   'rating': True,              │
│   'label_generation': True,    │
│   'pickup_scheduling': False,  │
│   'insurance': False,          │
│   'cod': True,                 │
│   'international': False       │
│ }                              │
└────────────────────────────────┘
```

### Abstract Class Structure

```
class ShippingProvider(ABC):
  │
  ├── Class Attributes:
  │   ├─ provider_name: str = None
  │   ├─ version: str = "1.0"
  │   └─ capabilities: dict
  │
  ├── Instance Attributes:
  │   └─ config: dict
  │
  ├── Concrete Methods:
  │   ├─ __init__(config: dict)
  │   ├─ validate_config() → bool
  │   ├─ is_configured() → bool
  │   └─ get_capabilities() → dict
  │
  └── Abstract Methods:
      ├─ create_shipment() → ShipmentResponse
      ├─ get_rates() → List[Rate]
      ├─ track_shipment() → TrackingInfo
      └─ cancel_shipment() → CancellationResult
```

### Data Models for Interface

| Model | Purpose | Key Fields |
|-------|---------|------------|
| ShipmentRequest | Create shipment input | pickup, delivery, items, cod |
| ShipmentResponse | Shipment result | waybill_number, status, label_url |
| RateRequest | Rate quote input | origin, destination, weight |
| Rate | Single rate option | cost, currency, service_type |
| TrackingInfo | Tracking result | status, location, history |
| CancellationResult | Cancel result | success, message |

### Provider Hierarchy

```
ABC (Python abstract base class)
  │
  └── ShippingProvider
      │
      ├── KoombiyoProvider
      ├── DHLProvider
      ├── FedExProvider
      └── [Future providers]
```

### Abstract Method Requirements

| Method | Must Implement | Must Return | Must Handle Errors |
|--------|----------------|-------------|-------------------|
| create_shipment | Yes | ShipmentResponse | Yes |
| get_rates | Yes | List[Rate] | Yes |
| track_shipment | Yes | TrackingInfo | Yes |
| cancel_shipment | Yes | CancellationResult | Yes |

### Validation Methods

```
validate_config():
  │
  ├─→ Check required config keys
  │   ├─ API credentials present?
  │   └─ Base URL present?
  │
  ├─→ Validate config values
  │   ├─ Non-empty strings?
  │   └─ Valid formats?
  │
  └─→ Return validation result
      ├─ True if valid
      └─ False if invalid

validate_address():
  │
  ├─→ Check required address fields
  ├─→ Validate postal code format
  ├─→ Validate phone number format
  └─→ Return validation result
```

### Provider Properties

| Property | Type | Purpose | Implementation |
|----------|------|---------|----------------|
| is_configured | bool | Config validity | Check config exists |
| provider_name | str | Provider identifier | Return class name |
| supports_tracking | bool | Tracking capability | Check capabilities |
| supports_rates | bool | Rating capability | Check capabilities |

### Interface Benefits

| Benefit | Description |
|---------|-------------|
| Consistency | All providers have same interface |
| Testability | Easy to mock providers |
| Extensibility | Add providers without changing code |
| Type Safety | Type hints ensure correct usage |
| Documentation | Clear contract for implementations |

### Expected Outcome
- Complete abstract base class for shipping providers
- Four abstract methods defining core operations
- Configuration and validation support
- Provider metadata and capabilities
- Foundation for multiple courier integrations

### Verification Checklist
- [ ] `base.py` file created in providers directory
- [ ] ShippingProvider class inherits from ABC
- [ ] Four abstract methods defined and decorated
- [ ] Method signatures include type hints
- [ ] `__init__` method accepts configuration
- [ ] Validation methods implemented
- [ ] Provider properties defined
- [ ] Comprehensive docstrings added

---

## Task 28: Create create_shipment Method

### Overview
Define the abstract create_shipment method signature in the ShippingProvider base class. This method establishes the contract for creating new shipments with any courier provider. It specifies the input data structure (ShipmentRequest), expected output (ShipmentResponse), and error handling requirements that all implementations must follow.

### Dependencies
- Task 27: Create ShippingProvider ABC

### Instructions

1. **Define method signature**
   - Add @abstractmethod decorator
   - Define method name as `create_shipment`
   - Accept `self` as first parameter
   - Accept `request` parameter of type ShipmentRequest

2. **Add type hints**
   - Parameter type: ShipmentRequest
   - Return type: ShipmentResponse
   - Use typing annotations properly
   - Import required types

3. **Write comprehensive docstring**
   - Describe method purpose
   - Document ShipmentRequest parameters
   - Document ShipmentResponse return value
   - List possible exceptions
   - Provide usage example

4. **Define ShipmentRequest structure**
   - Create ShipmentRequest data class or TypedDict
   - Include pickup address fields
   - Include delivery address fields
   - Include package details (weight, dimensions)
   - Include optional COD amount
   - Include special instructions

5. **Define ShipmentResponse structure**
   - Create ShipmentResponse data class
   - Include waybill_number (tracking number)
   - Include shipment status
   - Include label_url (PDF label)
   - Include estimated delivery date
   - Include cost information

6. **Document expected behavior**
   - Method should create shipment with provider
   - Should return waybill number for tracking
   - Should generate shipping label
   - Should validate input data
   - Should handle API errors gracefully

7. **List required validations**
   - Validate pickup address is complete
   - Validate delivery address is complete
   - Validate package weight is positive
   - Validate phone numbers are valid
   - Validate COD amount if present

8. **Document error scenarios**
   - Invalid address → ValidationError
   - API failure → APIError
   - Authentication failure → AuthError
   - Network error → NetworkError
   - Should specify which errors to raise

### Method Signature

```
@abstractmethod
def create_shipment(
    self,
    request: ShipmentRequest
) -> ShipmentResponse:
    """
    Create a new shipment with the courier provider.
    
    This method creates a shipment booking, generates a waybill
    number, and returns a shipping label URL.
    
    Args:
        request: ShipmentRequest containing all shipment details
        
    Returns:
        ShipmentResponse with waybill number and label
        
    Raises:
        ValidationError: If request data is invalid
        APIError: If provider API fails
        AuthError: If authentication fails
    """
    pass
```

### ShipmentRequest Structure

```
ShipmentRequest:
┌────────────────────────────────────┐
│ pickup_address:                    │
│   ├─ name: str                     │
│   ├─ phone: str                    │
│   ├─ address_line1: str            │
│   ├─ address_line2: str (optional) │
│   ├─ city: str                     │
│   └─ postal_code: str              │
│                                    │
│ delivery_address:                  │
│   ├─ name: str                     │
│   ├─ phone: str                    │
│   ├─ address_line1: str            │
│   ├─ address_line2: str (optional) │
│   ├─ city: str                     │
│   └─ postal_code: str              │
│                                    │
│ package:                           │
│   ├─ weight: float (kg)            │
│   ├─ length: float (cm, optional)  │
│   ├─ width: float (cm, optional)   │
│   ├─ height: float (cm, optional)  │
│   └─ description: str              │
│                                    │
│ service:                           │
│   ├─ service_type: str             │
│   └─ cod_amount: Decimal (optional)│
│                                    │
│ special_instructions: str (optional)│
└────────────────────────────────────┘
```

### ShipmentResponse Structure

```
ShipmentResponse:
┌────────────────────────────────────┐
│ waybill_number: str                │
│   └─ Unique tracking number        │
│                                    │
│ status: str                        │
│   └─ Initial status (e.g., "pending")│
│                                    │
│ label_url: str                     │
│   └─ URL to download PDF label    │
│                                    │
│ estimated_delivery: datetime       │
│   └─ Expected delivery date        │
│                                    │
│ cost: Decimal                      │
│   └─ Shipping cost                 │
│                                    │
│ currency: str                      │
│   └─ Currency code (e.g., "LKR")  │
│                                    │
│ created_at: datetime               │
│   └─ Shipment creation timestamp   │
└────────────────────────────────────┘
```

### Request/Response Flow

```
create_shipment() called
  │
  ├─→ Validate request
  │   ├─ Check required fields
  │   ├─ Validate addresses
  │   ├─ Validate package details
  │   └─ Validate phone numbers
  │
  ├─→ Send to provider API
  │   ├─ Transform to provider format
  │   ├─ Make API call
  │   └─ Handle API errors
  │
  ├─→ Parse response
  │   ├─ Extract waybill number
  │   ├─ Extract label URL
  │   └─ Extract status
  │
  └─→ Return ShipmentResponse
      └─ Standardized format
```

### Address Validation Requirements

| Field | Validation | Error If Missing |
|-------|------------|------------------|
| name | Not empty | ValidationError |
| phone | Valid format (+94) | ValidationError |
| address_line1 | Not empty | ValidationError |
| city | Not empty | ValidationError |
| postal_code | Valid format | ValidationError |

### Package Validation Requirements

| Field | Validation | Error If Invalid |
|-------|------------|------------------|
| weight | Positive number | ValidationError |
| weight | <= max weight | ValidationError |
| dimensions | Positive if provided | ValidationError |
| description | Not empty | ValidationError |

### Service Types

| Service Type | Description | COD Supported |
|--------------|-------------|---------------|
| standard | Standard delivery | Yes |
| express | Express delivery | Yes |
| same_day | Same-day delivery | No |
| international | International | No |

### Error Handling

| Error Condition | Exception | When It Occurs |
|----------------|-----------|----------------|
| Missing required field | ValidationError | Invalid request data |
| Invalid address | ValidationError | Address validation fails |
| Invalid phone | ValidationError | Phone format incorrect |
| API authentication | AuthError | Invalid credentials |
| API failure | APIError | Provider API error |
| Network error | NetworkError | Connection failure |

### Expected Implementation Behavior

| Implementation Must | Reason |
|---------------------|--------|
| Validate all inputs | Prevent API errors |
| Transform data format | Match provider API |
| Handle errors gracefully | User-friendly errors |
| Return standardized response | Consistent interface |
| Log all attempts | Debugging and audit |

### Expected Outcome
- Abstract method signature defined clearly
- ShipmentRequest structure documented
- ShipmentResponse structure documented
- Validation requirements specified
- Error scenarios documented
- Foundation for concrete implementations

### Verification Checklist
- [ ] Method signature defined with @abstractmethod
- [ ] Type hints for parameters and return
- [ ] Comprehensive docstring written
- [ ] ShipmentRequest structure defined
- [ ] ShipmentResponse structure defined
- [ ] Validation requirements documented
- [ ] Error scenarios documented
- [ ] Usage example provided in docstring

---

## Task 29: Create get_rates Method

### Overview
Define the abstract get_rates method signature in the ShippingProvider base class. This method establishes the contract for retrieving shipping rate quotes from courier providers. It specifies the input parameters (RateRequest) and expected output (list of Rate objects) that implementations must follow to provide rate comparison functionality.

### Dependencies
- Task 27: Create ShippingProvider ABC

### Instructions

1. **Define method signature**
   - Add @abstractmethod decorator
   - Define method name as `get_rates`
   - Accept `self` parameter
   - Accept `request` parameter of type RateRequest

2. **Add type hints**
   - Parameter type: RateRequest
   - Return type: List[Rate]
   - Use proper typing annotations
   - Import List from typing

3. **Write comprehensive docstring**
   - Describe purpose (get rate quotes)
   - Document RateRequest parameters
   - Document Rate return structure
   - List possible exceptions
   - Provide usage example

4. **Define RateRequest structure**
   - Create RateRequest data class
   - Include origin address (or city)
   - Include destination address (or city)
   - Include package weight
   - Include package dimensions (optional)
   - Include service type filter (optional)

5. **Define Rate structure**
   - Create Rate data class
   - Include service_type (standard, express, etc.)
   - Include cost (shipping cost)
   - Include currency (LKR)
   - Include estimated_delivery_days
   - Include provider-specific details

6. **Document expected behavior**
   - Method should query provider for rates
   - Should return multiple rate options
   - Should include different service levels
   - Should handle unavailable services
   - Should sort by cost (lowest first)

7. **List validation requirements**
   - Validate origin and destination present
   - Validate weight is positive
   - Validate locations are serviceable
   - Return empty list if no rates available

8. **Document error scenarios**
   - Invalid locations → ValidationError
   - API failure → APIError
   - No service available → Return empty list
   - Authentication failure → AuthError

### Method Signature

```
@abstractmethod
def get_rates(
    self,
    request: RateRequest
) -> List[Rate]:
    """
    Get shipping rate quotes for a route.
    
    Queries the provider API for available shipping rates
    between origin and destination for the given package.
    
    Args:
        request: RateRequest with route and package details
        
    Returns:
        List of Rate objects, sorted by cost (lowest first)
        Returns empty list if no rates available
        
    Raises:
        ValidationError: If request data is invalid
        APIError: If provider API fails
        AuthError: If authentication fails
    """
    pass
```

### RateRequest Structure

```
RateRequest:
┌────────────────────────────────────┐
│ origin:                            │
│   ├─ city: str                     │
│   ├─ postal_code: str (optional)   │
│   └─ country: str = "LK"           │
│                                    │
│ destination:                       │
│   ├─ city: str                     │
│   ├─ postal_code: str (optional)   │
│   └─ country: str = "LK"           │
│                                    │
│ package:                           │
│   ├─ weight: float (kg)            │
│   ├─ length: float (cm, optional)  │
│   ├─ width: float (cm, optional)   │
│   └─ height: float (cm, optional)  │
│                                    │
│ filters:                           │
│   ├─ service_types: List[str]      │
│   └─ max_cost: Decimal (optional)  │
└────────────────────────────────────┘
```

### Rate Structure

```
Rate:
┌────────────────────────────────────┐
│ service_type: str                  │
│   └─ "standard", "express", etc.   │
│                                    │
│ service_name: str                  │
│   └─ Display name                  │
│                                    │
│ cost: Decimal                      │
│   └─ Shipping cost                 │
│                                    │
│ currency: str                      │
│   └─ "LKR"                         │
│                                    │
│ estimated_delivery_days: int       │
│   └─ Business days                 │
│                                    │
│ description: str                   │
│   └─ Service description           │
│                                    │
│ provider: str                      │
│   └─ Provider name                 │
│                                    │
│ metadata: dict                     │
│   └─ Provider-specific details     │
└────────────────────────────────────┘
```

### Rate Request/Response Flow

```
get_rates() called
  │
  ├─→ Validate request
  │   ├─ Check origin and destination
  │   ├─ Validate weight
  │   └─ Check serviceable locations
  │
  ├─→ Query provider API
  │   ├─ Transform to provider format
  │   ├─ Make API call
  │   └─ Handle API errors
  │
  ├─→ Parse response
  │   ├─ Extract rate options
  │   ├─ Convert to Rate objects
  │   └─ Apply filters
  │
  ├─→ Sort rates
  │   └─ By cost (lowest first)
  │
  └─→ Return List[Rate]
      └─ Empty list if no rates
```

### Service Types and Rates

| Service Type | Description | Typical Cost | Delivery Time |
|--------------|-------------|--------------|---------------|
| standard | Standard delivery | ₨ 350-500 | 3-5 days |
| express | Express delivery | ₨ 600-800 | 1-2 days |
| same_day | Same-day delivery | ₨ 1000+ | Same day |

### Rate Validation

| Field | Validation | Default |
|-------|------------|---------|
| origin.city | Not empty | Required |
| destination.city | Not empty | Required |
| package.weight | Positive | Required |
| package.dimensions | Positive if set | Optional |

### Rate Filtering

```
Apply filters:
  │
  ├─→ Filter by service_types
  │   └─ Include only requested types
  │
  ├─→ Filter by max_cost
  │   └─ Exclude rates above max
  │
  ├─→ Filter by availability
  │   └─ Exclude unavailable services
  │
  └─→ Return filtered list
```

### Rate Sorting

| Sort Criteria | Priority | Order |
|---------------|----------|-------|
| Cost | Primary | Ascending |
| Delivery time | Secondary | Ascending |
| Service type | Tertiary | Standard first |

### Error Handling

| Error Condition | Exception | Behavior |
|----------------|-----------|----------|
| Invalid location | ValidationError | Raise immediately |
| No rates available | None | Return empty list |
| API failure | APIError | Raise with details |
| Unsupported route | None | Return empty list |

### Expected Implementation Behavior

| Implementation Must | Reason |
|---------------------|--------|
| Query all available rates | Provide options |
| Return standardized format | Consistent interface |
| Sort by cost | User convenience |
| Handle unavailable services | Graceful degradation |
| Cache rates (optional) | Performance |

### Rate Comparison Example

```
User requests rates:
  Origin: Colombo
  Destination: Kandy
  Weight: 2.5 kg

Response:
┌──────────────────────────────────────┐
│ [                                    │
│   Rate(                              │
│     service="standard",              │
│     cost=Decimal("350.00"),          │
│     delivery_days=3                  │
│   ),                                 │
│   Rate(                              │
│     service="express",               │
│     cost=Decimal("600.00"),          │
│     delivery_days=1                  │
│   )                                  │
│ ]                                    │
└──────────────────────────────────────┘
```

### Expected Outcome
- Abstract method for rate retrieval defined
- RateRequest structure documented
- Rate structure documented
- Filtering and sorting requirements specified
- Error scenarios documented
- Foundation for rate comparison feature

### Verification Checklist
- [ ] Method signature defined with @abstractmethod
- [ ] Type hints for parameters and return
- [ ] Comprehensive docstring written
- [ ] RateRequest structure defined
- [ ] Rate structure defined
- [ ] Filtering logic documented
- [ ] Sorting requirements specified
- [ ] Error scenarios documented
- [ ] Empty list behavior documented

---

## Task 30: Create track_shipment Method

### Overview
Define the abstract track_shipment method signature in the ShippingProvider base class. This method establishes the contract for tracking shipments across different courier providers. It specifies how to query shipment status using the waybill number and defines the standardized tracking information structure that all implementations must return.

### Dependencies
- Task 27: Create ShippingProvider ABC

### Instructions

1. **Define method signature**
   - Add @abstractmethod decorator
   - Define method name as `track_shipment`
   - Accept `self` parameter
   - Accept `waybill_number` parameter (string)

2. **Add type hints**
   - Parameter type: str (waybill number)
   - Return type: TrackingInfo
   - Use proper typing annotations

3. **Write comprehensive docstring**
   - Describe purpose (track shipment status)
   - Document waybill_number parameter
   - Document TrackingInfo return structure
   - List possible exceptions
   - Provide usage example

4. **Define TrackingInfo structure**
   - Create TrackingInfo data class
   - Include waybill_number
   - Include current status
   - Include current location
   - Include status history (timeline)
   - Include estimated delivery date
   - Include delivery proof (if delivered)

5. **Define shipment status enum**
   - Define standard status values
   - Include: pending, picked_up, in_transit, out_for_delivery, delivered, cancelled, failed
   - Map provider statuses to standard values
   - Document status meanings

6. **Define TrackingEvent structure**
   - Create TrackingEvent for history entries
   - Include timestamp
   - Include status
   - Include location
   - Include description/notes

7. **Document expected behavior**
   - Method should query provider tracking API
   - Should return current status and location
   - Should include complete status history
   - Should handle non-existent waybills
   - Should cache tracking data (optional)

8. **Document error scenarios**
   - Invalid waybill format → ValidationError
   - Waybill not found → NotFoundError
   - API failure → APIError
   - Authentication failure → AuthError

### Method Signature

```
@abstractmethod
def track_shipment(
    self,
    waybill_number: str
) -> TrackingInfo:
    """
    Track a shipment by waybill number.
    
    Retrieves current status, location, and complete
    history for the shipment from the provider.
    
    Args:
        waybill_number: Unique tracking number
        
    Returns:
        TrackingInfo with status and history
        
    Raises:
        ValidationError: If waybill number format invalid
        NotFoundError: If waybill not found
        APIError: If provider API fails
        AuthError: If authentication fails
    """
    pass
```

### TrackingInfo Structure

```
TrackingInfo:
┌────────────────────────────────────┐
│ waybill_number: str                │
│   └─ Tracking number               │
│                                    │
│ status: ShipmentStatus             │
│   └─ Current status enum           │
│                                    │
│ status_description: str            │
│   └─ Human-readable status         │
│                                    │
│ current_location: str              │
│   └─ Current city/facility         │
│                                    │
│ estimated_delivery: datetime       │
│   └─ Expected delivery date        │
│                                    │
│ actual_delivery: datetime (opt)    │
│   └─ Actual delivery timestamp     │
│                                    │
│ recipient_name: str (optional)     │
│   └─ Who received package          │
│                                    │
│ history: List[TrackingEvent]       │
│   └─ Status change timeline        │
│                                    │
│ metadata: dict                     │
│   └─ Provider-specific details     │
└────────────────────────────────────┘
```

### ShipmentStatus Enum

| Status | Description | Terminal |
|--------|-------------|----------|
| pending | Shipment created, awaiting pickup | No |
| picked_up | Picked up from sender | No |
| in_transit | Moving between facilities | No |
| out_for_delivery | Out with delivery agent | No |
| delivered | Successfully delivered | Yes |
| cancelled | Shipment cancelled | Yes |
| failed | Delivery failed/returned | Yes |
| on_hold | Temporarily held | No |

### TrackingEvent Structure

```
TrackingEvent:
┌────────────────────────────────────┐
│ timestamp: datetime                │
│   └─ When event occurred           │
│                                    │
│ status: ShipmentStatus             │
│   └─ Status at this event          │
│                                    │
│ location: str                      │
│   └─ Where event occurred          │
│                                    │
│ description: str                   │
│   └─ Event details                 │
│                                    │
│ performed_by: str (optional)       │
│   └─ Agent/facility name           │
└────────────────────────────────────┘
```

### Tracking Flow

```
track_shipment() called
  │
  ├─→ Validate waybill number
  │   ├─ Check format
  │   └─ Check not empty
  │
  ├─→ Query provider API
  │   ├─ Make tracking API call
  │   └─ Handle API errors
  │
  ├─→ Parse response
  │   ├─ Extract current status
  │   ├─ Extract location
  │   ├─ Parse status history
  │   └─ Map provider statuses
  │
  ├─→ Build TrackingInfo
  │   ├─ Create TrackingEvent list
  │   ├─ Sort events by timestamp
  │   └─ Populate all fields
  │
  └─→ Return TrackingInfo
```

### Status Mapping

| Provider Status | Standard Status | Notes |
|----------------|-----------------|-------|
| "PENDING" | pending | Initial state |
| "PICKED" | picked_up | Pickup confirmed |
| "IN_TRANSIT" | in_transit | En route |
| "OUT_FOR_DELIVERY" | out_for_delivery | Final mile |
| "DELIVERED" | delivered | Completed |
| "CANCELLED" | cancelled | User cancelled |
| "RETURNED" | failed | Delivery failed |

### Tracking History Example

```
Tracking Timeline:
┌────────────────────────────────────┐
│ 2026-01-31 09:00 - Colombo         │
│ └─ PICKED_UP: Picked from sender   │
│                                    │
│ 2026-01-31 14:30 - Colombo Hub     │
│ └─ IN_TRANSIT: Arrived at hub      │
│                                    │
│ 2026-01-31 20:00 - Kandy Hub       │
│ └─ IN_TRANSIT: Arrived at Kandy    │
│                                    │
│ 2026-02-01 09:15 - Kandy           │
│ └─ OUT_FOR_DELIVERY: Out for del.  │
│                                    │
│ 2026-02-01 11:45 - Kandy           │
│ └─ DELIVERED: Delivered to John    │
└────────────────────────────────────┘
```

### Waybill Validation

| Check | Error If |
|-------|----------|
| Not empty | ValidationError |
| Valid format | ValidationError |
| Exists in system | NotFoundError |

### Error Handling

| Error Condition | Exception | When |
|----------------|-----------|------|
| Empty waybill | ValidationError | Validation fails |
| Invalid format | ValidationError | Format check fails |
| Not found | NotFoundError | Provider returns 404 |
| API failure | APIError | Provider error |
| Network error | NetworkError | Connection fails |

### Caching Considerations

| Aspect | Recommendation |
|--------|----------------|
| Cache tracking? | Yes (short TTL) |
| TTL | 5-10 minutes |
| Cache key | waybill_number |
| Invalidate on | Manual refresh |

### Expected Implementation Behavior

| Implementation Must | Reason |
|---------------------|--------|
| Query latest status | Real-time updates |
| Parse complete history | Full visibility |
| Map to standard statuses | Consistency |
| Handle missing waybills | Graceful errors |
| Include location | User information |

### Expected Outcome
- Abstract method for shipment tracking defined
- TrackingInfo structure documented
- ShipmentStatus enum defined
- TrackingEvent structure for history
- Status mapping requirements specified
- Error scenarios documented

### Verification Checklist
- [ ] Method signature defined with @abstractmethod
- [ ] Type hints for parameters and return
- [ ] Comprehensive docstring written
- [ ] TrackingInfo structure defined
- [ ] ShipmentStatus enum defined
- [ ] TrackingEvent structure defined
- [ ] Status mapping documented
- [ ] Error scenarios documented
- [ ] Waybill validation specified

---

## Task 31: Create cancel_shipment Method

### Overview
Define the abstract cancel_shipment method signature in the ShippingProvider base class. This method establishes the contract for cancelling shipments before they are delivered. It specifies how to cancel using the waybill number and defines the standardized cancellation result structure that implementations must return, including success status and any associated fees.

### Dependencies
- Task 27: Create ShippingProvider ABC

### Instructions

1. **Define method signature**
   - Add @abstractmethod decorator
   - Define method name as `cancel_shipment`
   - Accept `self` parameter
   - Accept `waybill_number` parameter (string)
   - Accept optional `reason` parameter

2. **Add type hints**
   - waybill_number type: str
   - reason type: Optional[str]
   - Return type: CancellationResult
   - Use proper typing annotations

3. **Write comprehensive docstring**
   - Describe purpose (cancel shipment)
   - Document waybill_number parameter
   - Document optional reason parameter
   - Document CancellationResult return structure
   - List possible exceptions
   - Provide usage example

4. **Define CancellationResult structure**
   - Create CancellationResult data class
   - Include success flag (boolean)
   - Include message (description)
   - Include cancellation fee (if applicable)
   - Include refund amount (if applicable)
   - Include cancelled_at timestamp

5. **Document cancellation rules**
   - Define when cancellation is allowed
   - Specify cancellation deadlines
   - Document fee structure
   - Explain non-cancellable statuses

6. **Define cancellation states**
   - Before pickup → Full refund, no fee
   - After pickup, before delivery → Possible fee
   - Out for delivery → May not be cancellable
   - Already delivered → Cannot cancel

7. **Document expected behavior**
   - Method should validate waybill exists
   - Should check if cancellation allowed
   - Should process cancellation with provider
   - Should calculate any fees
   - Should update shipment status

8. **Document error scenarios**
   - Invalid waybill → ValidationError
   - Waybill not found → NotFoundError
   - Already delivered → CancellationError
   - API failure → APIError

### Method Signature

```
@abstractmethod
def cancel_shipment(
    self,
    waybill_number: str,
    reason: Optional[str] = None
) -> CancellationResult:
    """
    Cancel a shipment before delivery.
    
    Attempts to cancel the shipment with the provider.
    Cancellation may incur fees depending on shipment status.
    
    Args:
        waybill_number: Tracking number to cancel
        reason: Optional cancellation reason
        
    Returns:
        CancellationResult with success status and details
        
    Raises:
        ValidationError: If waybill number invalid
        NotFoundError: If waybill not found
        CancellationError: If cancellation not allowed
        APIError: If provider API fails
        AuthError: If authentication fails
    """
    pass
```

### CancellationResult Structure

```
CancellationResult:
┌────────────────────────────────────┐
│ success: bool                      │
│   └─ True if cancelled             │
│                                    │
│ message: str                       │
│   └─ Description of result         │
│                                    │
│ waybill_number: str                │
│   └─ Cancelled tracking number     │
│                                    │
│ cancellation_fee: Decimal          │
│   └─ Fee charged (if any)          │
│                                    │
│ refund_amount: Decimal             │
│   └─ Amount refunded (if any)      │
│                                    │
│ cancelled_at: datetime             │
│   └─ Cancellation timestamp        │
│                                    │
│ can_rebook: bool                   │
│   └─ Can create new shipment?      │
│                                    │
│ reason: str (optional)             │
│   └─ Cancellation reason           │
└────────────────────────────────────┘
```

### Cancellation Rules Matrix

| Shipment Status | Cancellable | Fee | Refund |
|----------------|-------------|-----|--------|
| pending | Yes | None | 100% |
| picked_up | Yes | Possible | Partial |
| in_transit | Yes | Yes | Partial |
| out_for_delivery | Maybe | Yes | None |
| delivered | No | N/A | N/A |
| cancelled | No | N/A | N/A |

### Cancellation Flow

```
cancel_shipment() called
  │
  ├─→ Validate waybill number
  │   ├─ Check format
  │   └─ Check not empty
  │
  ├─→ Get current shipment status
  │   ├─ Query tracking API
  │   └─ Check current status
  │
  ├─→ Check if cancellable
  │   │
  │   ├─ Status allows cancellation?
  │   │   ├─ Yes → Continue
  │   │   └─ No → Raise CancellationError
  │
  ├─→ Calculate fees
  │   ├─ Determine cancellation fee
  │   ├─ Calculate refund amount
  │   └─ Consider shipment stage
  │
  ├─→ Submit cancellation
  │   ├─ Call provider cancel API
  │   ├─ Include reason if provided
  │   └─ Handle API errors
  │
  ├─→ Parse response
  │   ├─ Extract confirmation
  │   ├─ Get fee details
  │   └─ Get refund details
  │
  └─→ Return CancellationResult
```

### Fee Calculation

| Stage | Base Fee | Additional | Refund |
|-------|----------|------------|--------|
| Pending | ₨ 0 | - | 100% |
| Picked up | ₨ 100 | - | 80% |
| In transit | ₨ 200 | Distance-based | 50% |
| Out for delivery | ₨ 300 | - | 0% |

### Cancellation Reasons

| Reason | Common Usage |
|--------|--------------|
| customer_request | Customer wants to cancel |
| wrong_address | Address incorrect |
| duplicate_order | Order duplicated |
| item_unavailable | Items out of stock |
| price_change | Price changed |
| other | Other reasons |

### Success Response Example

```
Successful Cancellation:
┌────────────────────────────────────┐
│ CancellationResult(                │
│   success=True,                    │
│   message="Shipment cancelled",    │
│   waybill_number="WB123456",       │
│   cancellation_fee=Decimal("0"),   │
│   refund_amount=Decimal("350"),    │
│   cancelled_at=datetime.now(),     │
│   can_rebook=True                  │
│ )                                  │
└────────────────────────────────────┘
```

### Failure Response Example

```
Cancellation Not Allowed:
┌────────────────────────────────────┐
│ Raises CancellationError:          │
│   "Cannot cancel shipment"         │
│   "Shipment is out for delivery"   │
│   "Please contact support"         │
└────────────────────────────────────┘
```

### Error Handling

| Error Condition | Exception | Message |
|----------------|-----------|---------|
| Already delivered | CancellationError | "Shipment already delivered" |
| Already cancelled | CancellationError | "Shipment already cancelled" |
| Out for delivery | CancellationError | "Too late to cancel" |
| Waybill not found | NotFoundError | "Shipment not found" |
| API failure | APIError | "Cancellation failed" |

### Validation Requirements

| Check | Error If Failed |
|-------|-----------------|
| Waybill not empty | ValidationError |
| Waybill valid format | ValidationError |
| Shipment exists | NotFoundError |
| Cancellation allowed | CancellationError |

### Expected Implementation Behavior

| Implementation Must | Reason |
|---------------------|--------|
| Check current status | Determine if cancellable |
| Calculate fees accurately | User expectations |
| Submit to provider API | Actual cancellation |
| Return detailed result | User information |
| Update local status | Data consistency |

### Provider-Specific Considerations

| Provider | Cancellation Policy | Notes |
|----------|-------------------|-------|
| Koombiyo | Depends on status | Fee structure varies |
| DHL | Strict deadlines | Higher fees |
| FedEx | Status-based | API confirmation required |

### Expected Outcome
- Abstract method for shipment cancellation defined
- CancellationResult structure documented
- Cancellation rules matrix defined
- Fee calculation logic specified
- Error scenarios documented
- Validation requirements specified

### Verification Checklist
- [ ] Method signature defined with @abstractmethod
- [ ] Type hints for parameters and return
- [ ] Comprehensive docstring written
- [ ] CancellationResult structure defined
- [ ] Cancellation rules documented
- [ ] Fee structure specified
- [ ] Error scenarios documented
- [ ] Validation requirements specified
- [ ] Success and failure examples provided

---

## Task 32: Create KoombiyoProvider Class

### Overview
Implement the KoombiyoProvider class as a concrete implementation of the ShippingProvider abstract base class. This class provides the actual Koombiyo-specific logic for all shipping operations, utilizing the KoombiyoClient for API communication. It transforms data between the standard interface format and Koombiyo's API format, handles Koombiyo-specific business logic, and ensures compliance with both the abstract interface and Koombiyo API requirements.

### Dependencies
- Task 31: Create cancel_shipment Method
- Task 26: Create Request Logging (KoombiyoClient complete)

### Instructions

1. **Create provider implementation file**
   - Navigate to `backend/apps/shipping/providers/koombiyo/` directory
   - Create new file named `provider.py`
   - Import ShippingProvider base class
   - Import KoombiyoClient

2. **Define KoombiyoProvider class**
   - Create class inheriting from ShippingProvider
   - Set provider_name class attribute to "koombiyo"
   - Define capabilities dictionary
   - Add comprehensive class docstring

3. **Implement __init__ method**
   - Call super().__init__(config)
   - Create KoombiyoClient instance
   - Store client as instance attribute
   - Initialize any provider-specific settings

4. **Implement create_shipment method**
   - Accept ShipmentRequest parameter
   - Validate request data
   - Transform to Koombiyo API format
   - Call client.request() with shipment endpoint
   - Parse response
   - Transform to ShipmentResponse format
   - Return ShipmentResponse

5. **Implement get_rates method**
   - Accept RateRequest parameter
   - Validate request data
   - Transform to Koombiyo format
   - Call client.request() with rates endpoint
   - Parse rate options
   - Transform to Rate objects
   - Sort by cost
   - Return List[Rate]

6. **Implement track_shipment method**
   - Accept waybill_number parameter
   - Validate waybill format
   - Call client.request() with tracking endpoint
   - Parse tracking response
   - Map Koombiyo statuses to standard statuses
   - Build TrackingInfo object
   - Return TrackingInfo

7. **Implement cancel_shipment method**
   - Accept waybill_number and optional reason
   - Get current shipment status
   - Check if cancellation allowed
   - Call client.request() with cancel endpoint
   - Parse cancellation response
   - Calculate fees from response
   - Build CancellationResult
   - Return CancellationResult

8. **Add data transformation methods**
   - Create `_transform_shipment_request()` helper
   - Create `_parse_shipment_response()` helper
   - Create `_transform_rate_request()` helper
   - Create `_parse_rate_response()` helper
   - Create `_map_status()` for status mapping

9. **Implement validation methods**
   - Override validate_config() if needed
   - Add validate_phone_number() for Sri Lankan phones
   - Add validate_postal_code() for Sri Lankan codes
   - Add validate_city() for supported cities

10. **Add error handling**
    - Catch KoombiyoClient exceptions
    - Transform to appropriate provider exceptions
    - Add context to error messages
    - Log all errors

### KoombiyoProvider Architecture

```
┌────────────────────────────────────┐
│     ShippingProvider (ABC)         │
└────────────────────────────────────┘
         ▲
         │ Implements
         │
┌────────────────────────────────────┐
│     KoombiyoProvider               │
├────────────────────────────────────┤
│ Attributes:                        │
│ - provider_name = "koombiyo"       │
│ - client: KoombiyoClient           │
│ - capabilities: dict               │
│                                    │
│ Concrete Methods:                  │
│ - create_shipment()                │
│ - get_rates()                      │
│ - track_shipment()                 │
│ - cancel_shipment()                │
│                                    │
│ Helper Methods:                    │
│ - _transform_shipment_request()    │
│ - _parse_shipment_response()       │
│ - _map_status()                    │
│ - validate_phone_number()          │
└────────────────────────────────────┘
         │
         │ Uses
         ▼
┌────────────────────────────────────┐
│     KoombiyoClient                 │
└────────────────────────────────────┘
```

### Class Definition

```
class KoombiyoProvider(ShippingProvider):
    """
    Koombiyo courier provider implementation.
    
    Implements ShippingProvider interface for Koombiyo API.
    Handles shipment creation, rate quotes, tracking, and
    cancellation using Koombiyo's REST API.
    """
    
    provider_name = "koombiyo"
    version = "1.0"
    
    capabilities = {
        'tracking': True,
        'rating': True,
        'label_generation': True,
        'pickup_scheduling': False,
        'insurance': False,
        'cod': True,
        'international': False
    }
```

### Implementation Flow

```
KoombiyoProvider Initialization:
┌────────────────────────────────────┐
│ __init__(config)                   │
│   ├─ super().__init__(config)      │
│   ├─ Extract Koombiyo credentials  │
│   ├─ Create KoombiyoClient         │
│   ├─ Store client instance         │
│   └─ Validate configuration        │
└────────────────────────────────────┘

create_shipment() flow:
┌────────────────────────────────────┐
│ 1. Validate ShipmentRequest        │
│ 2. _transform_shipment_request()   │
│    └─ Convert to Koombiyo format   │
│ 3. client.request('POST', '/ship') │
│ 4. _parse_shipment_response()      │
│    └─ Extract waybill, label       │
│ 5. Return ShipmentResponse         │
└────────────────────────────────────┘
```

### Data Transformation Examples

| Standard Format | Koombiyo Format | Transform |
|----------------|-----------------|-----------|
| pickup_address.phone | pickup_contact_number | Field rename |
| delivery_address.city | delivery_city | Field rename |
| package.weight | weight_kg | Field rename |
| service.cod_amount | cod_value | Field rename |
| datetime object | "2026-01-31" | Date format |

### Status Mapping

```
_map_status() method:
┌────────────────────────────────────┐
│ KOOMBIYO_STATUS_MAP = {            │
│   'PENDING': ShipmentStatus.pending│
│   'PICKED': ShipmentStatus.picked_up│
│   'IN_TRANSIT': ShipmentStatus.in_transit│
│   'OUT_FOR_DELIVERY': ShipmentStatus.out_for_delivery│
│   'DELIVERED': ShipmentStatus.delivered│
│   'CANCELLED': ShipmentStatus.cancelled│
│   'RETURNED': ShipmentStatus.failed│
│ }                                  │
└────────────────────────────────────┘
```

### API Endpoints

| Method | Koombiyo Endpoint | HTTP Method |
|--------|-------------------|-------------|
| create_shipment | `/api/v1/shipments` | POST |
| get_rates | `/api/v1/rates` | POST |
| track_shipment | `/api/v1/track/{waybill}` | GET |
| cancel_shipment | `/api/v1/shipments/{waybill}/cancel` | POST |

### Validation Methods

| Method | Purpose | Checks |
|--------|---------|--------|
| validate_phone_number | Sri Lankan phones | +94 format, 9-10 digits |
| validate_postal_code | Sri Lankan codes | 5 digits |
| validate_city | Supported cities | In Koombiyo service area |
| validate_weight | Package weight | 0.1 - 50 kg |

### Error Handling

```
try:
    response = self.client.request(...)
except KoombiyoAuthError as e:
    raise AuthError(f"Koombiyo auth failed: {e}")
except KoombiyoValidationError as e:
    raise ValidationError(f"Invalid data: {e}")
except KoombiyoAPIError as e:
    raise APIError(f"Koombiyo API error: {e}")
```

### Helper Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| _transform_shipment_request | Convert to API format | dict |
| _parse_shipment_response | Parse API response | ShipmentResponse |
| _transform_rate_request | Convert to API format | dict |
| _parse_rate_response | Parse API response | List[Rate] |
| _map_status | Map status codes | ShipmentStatus |
| _parse_tracking_events | Parse history | List[TrackingEvent] |

### Configuration Usage

```
Provider initialized with:
┌────────────────────────────────────┐
│ config = {                         │
│   'api_key': 'xxx',                │
│   'merchant_id': 'yyy',            │
│   'base_url': 'https://...',       │
│   'timeout': 30                    │
│ }                                  │
│                                    │
│ self.client = KoombiyoClient(      │
│   api_key=config['api_key'],       │
│   merchant_id=config['merchant_id']│
│ )                                  │
└────────────────────────────────────┘
```

### Expected Outcome
- Complete concrete implementation of ShippingProvider
- All four abstract methods implemented
- Data transformation between formats
- Koombiyo API integration via client
- Validation and error handling
- Helper methods for common operations

### Verification Checklist
- [ ] `provider.py` file created
- [ ] KoombiyoProvider class inherits from ShippingProvider
- [ ] `__init__` creates KoombiyoClient instance
- [ ] `create_shipment()` implemented
- [ ] `get_rates()` implemented
- [ ] `track_shipment()` implemented
- [ ] `cancel_shipment()` implemented
- [ ] Data transformation helpers created
- [ ] Status mapping implemented
- [ ] Validation methods added
- [ ] Error handling comprehensive
- [ ] All methods return correct types

---

## Task 33: Create Provider Registration

### Overview
Implement a provider factory/registry system that allows dynamic instantiation of shipping providers. This system enables the application to support multiple courier providers, switch between them easily, and add new providers without modifying existing code. It provides a clean interface for provider discovery, registration, and instantiation based on configuration.

### Dependencies
- Task 32: Create KoombiyoProvider Class

### Instructions

1. **Create factory module**
   - Navigate to `backend/apps/shipping/providers/` directory
   - Create new file named `factory.py`
   - This module manages provider registration

2. **Create provider registry**
   - Define PROVIDER_REGISTRY dictionary
   - Map provider names to provider classes
   - Allow dynamic registration
   - Provide default providers

3. **Implement register_provider function**
   - Accept provider name and class
   - Validate provider class inherits from ShippingProvider
   - Add to registry dictionary
   - Raise error if already registered (or allow override)

4. **Implement get_provider_class function**
   - Accept provider name parameter
   - Look up in registry
   - Return provider class if found
   - Raise NotFoundError if not found

5. **Implement create_provider function**
   - Accept provider name parameter
   - Accept configuration dictionary
   - Get provider class from registry
   - Instantiate provider with config
   - Return provider instance

6. **Implement list_providers function**
   - Return list of registered provider names
   - Include provider capabilities
   - Return as list of dictionaries

7. **Register default providers**
   - Auto-register KoombiyoProvider
   - Use provider_name as registry key
   - Allow additional providers in future

8. **Add provider discovery**
   - Create auto-discovery mechanism (optional)
   - Scan providers directory
   - Auto-register found providers
   - Document discovery behavior

### Provider Registry Architecture

```
┌────────────────────────────────────┐
│      Provider Factory              │
├────────────────────────────────────┤
│ PROVIDER_REGISTRY = {              │
│   'koombiyo': KoombiyoProvider,    │
│   'dhl': DHLProvider,              │
│   'fedex': FedExProvider           │
│ }                                  │
│                                    │
│ Functions:                         │
│ - register_provider()              │
│ - get_provider_class()             │
│ - create_provider()                │
│ - list_providers()                 │
└────────────────────────────────────┘
```

### Registry Structure

```
PROVIDER_REGISTRY: Dict[str, Type[ShippingProvider]]

Example:
┌────────────────────────────────────┐
│ {                                  │
│   'koombiyo': KoombiyoProvider,    │
│   'dhl': DHLProvider,              │
│   'fedex': FedExProvider           │
│ }                                  │
└────────────────────────────────────┘
```

### Registration Flow

```
register_provider() called
  │
  ├─→ Validate provider_name
  │   └─ Not empty, lowercase
  │
  ├─→ Validate provider_class
  │   ├─ Is a class?
  │   ├─ Inherits from ShippingProvider?
  │   └─ Implements all abstract methods?
  │
  ├─→ Check if already registered
  │   ├─ Yes → Raise or warn
  │   └─ No → Continue
  │
  ├─→ Add to registry
  │   └─ PROVIDER_REGISTRY[name] = class
  │
  └─→ Log registration
```

### Provider Creation Flow

```
create_provider() called
  │
  ├─→ Get provider class
  │   └─ get_provider_class(name)
  │
  ├─→ Validate configuration
  │   └─ Config dict present?
  │
  ├─→ Instantiate provider
  │   └─ ProviderClass(config)
  │
  ├─→ Validate provider
  │   └─ Call provider.validate_config()
  │
  └─→ Return provider instance
```

### Factory Functions

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| register_provider | name: str, class: Type | None | Add provider to registry |
| get_provider_class | name: str | Type[ShippingProvider] | Get provider class |
| create_provider | name: str, config: dict | ShippingProvider | Create instance |
| list_providers | None | List[dict] | List all providers |

### Usage Examples

```
Register provider:
┌────────────────────────────────────┐
│ register_provider(                 │
│     'koombiyo',                    │
│     KoombiyoProvider               │
│ )                                  │
└────────────────────────────────────┘

Create provider:
┌────────────────────────────────────┐
│ config = {                         │
│     'api_key': 'xxx',              │
│     'merchant_id': 'yyy'           │
│ }                                  │
│                                    │
│ provider = create_provider(        │
│     'koombiyo',                    │
│     config                         │
│ )                                  │
└────────────────────────────────────┘

List providers:
┌────────────────────────────────────┐
│ providers = list_providers()       │
│ # Returns:                         │
│ [                                  │
│   {                                │
│     'name': 'koombiyo',            │
│     'capabilities': {...}          │
│   }                                │
│ ]                                  │
└────────────────────────────────────┘
```

### Default Registration

```
At module load:
┌────────────────────────────────────┐
│ # Auto-register default providers  │
│ register_provider(                 │
│     'koombiyo',                    │
│     KoombiyoProvider               │
│ )                                  │
└────────────────────────────────────┘
```

### Error Handling

| Error Condition | Exception | When |
|----------------|-----------|------|
| Provider not found | ProviderNotFoundError | get_provider_class fails |
| Already registered | ProviderAlreadyRegisteredError | Duplicate registration |
| Invalid class | TypeError | Class doesn't inherit from base |
| Invalid config | ValidationError | Config validation fails |

### Provider Discovery (Optional)

```
Auto-discovery:
┌────────────────────────────────────┐
│ 1. Scan providers/ directory       │
│ 2. Import all *_provider.py files  │
│ 3. Find ShippingProvider subclasses│
│ 4. Auto-register each provider     │
└────────────────────────────────────┘
```

### Integration with Settings

```
Load provider from settings:
┌────────────────────────────────────┐
│ SHIPPING_CONFIG = {                │
│   'default_provider': 'koombiyo',  │
│   'providers': {                   │
│     'koombiyo': {                  │
│       'api_key': '...',            │
│       'merchant_id': '...'         │
│     }                              │
│   }                                │
│ }                                  │
│                                    │
│ provider_name = SHIPPING_CONFIG[   │
│   'default_provider'               │
│ ]                                  │
│ config = SHIPPING_CONFIG[          │
│   'providers'][provider_name]      │
│ ]                                  │
│ provider = create_provider(        │
│   provider_name, config            │
│ )                                  │
└────────────────────────────────────┘
```

### Benefits of Factory Pattern

| Benefit | Description |
|---------|-------------|
| Flexibility | Easy provider switching |
| Extensibility | Add providers without changing code |
| Testability | Easy to mock providers |
| Configuration | Provider selection from config |
| Discovery | Automatic provider detection |

### Expected Outcome
- Provider factory system implemented
- Provider registration mechanism
- Provider creation with configuration
- Provider discovery and listing
- Clean, extensible architecture

### Verification Checklist
- [ ] `factory.py` file created
- [ ] PROVIDER_REGISTRY dictionary defined
- [ ] `register_provider()` function implemented
- [ ] `get_provider_class()` function implemented
- [ ] `create_provider()` function implemented
- [ ] `list_providers()` function implemented
- [ ] KoombiyoProvider registered by default
- [ ] Error handling for not found providers
- [ ] Type hints on all functions
- [ ] Comprehensive docstrings added

---

## Task 34: Verify API Client

### Overview
Perform comprehensive verification and testing of the complete Koombiyo API client implementation. This task ensures all components work together correctly, validates integration with the Koombiyo API, verifies error handling, and confirms that the system meets all requirements. It includes manual testing, integration testing, and verification of all success and error scenarios.

### Dependencies
- Task 33: Create Provider Registration

### Instructions

1. **Create verification script**
   - Create `verify_koombiyo.py` in scripts or management commands
   - Import necessary modules and provider
   - Set up logging for verification output
   - Structure script with test sections

2. **Verify configuration**
   - Load Koombiyo configuration from settings
   - Validate all required settings present
   - Check API credentials format
   - Verify base URL accessibility
   - Log configuration status

3. **Test provider instantiation**
   - Use factory to create KoombiyoProvider
   - Verify provider is configured
   - Check capabilities are correct
   - Verify client is initialized
   - Log provider creation success

4. **Test rate retrieval**
   - Create sample RateRequest
   - Call get_rates() method
   - Verify rates returned
   - Check rate structure is correct
   - Verify rates are sorted by cost
   - Log rate retrieval results

5. **Test shipment creation**
   - Create sample ShipmentRequest with valid data
   - Call create_shipment() method
   - Verify waybill number returned
   - Check label URL is valid
   - Verify response structure
   - Save waybill for tracking test
   - Log shipment creation success

6. **Test shipment tracking**
   - Use waybill from creation test
   - Call track_shipment() method
   - Verify TrackingInfo returned
   - Check status is correct
   - Verify history is present
   - Log tracking results

7. **Test shipment cancellation**
   - Use waybill from creation test (if applicable)
   - Call cancel_shipment() method
   - Verify cancellation result
   - Check fee information
   - Verify cancellation success
   - Log cancellation results

8. **Test error handling**
   - Test with invalid credentials → AuthError
   - Test with invalid data → ValidationError
   - Test with non-existent waybill → NotFoundError
   - Verify proper exception types raised
   - Check error messages are clear
   - Log error handling verification

9. **Test retry logic**
   - Simulate network error (if possible)
   - Verify retry attempts occur
   - Check exponential backoff
   - Verify eventual success or failure
   - Log retry behavior

10. **Test rate limiting**
    - Make rapid requests
    - Verify rate limiter throttles
    - Check no rate limit errors occur
    - Log rate limiting behavior

11. **Verify logging**
    - Check request logs generated
    - Verify response logs present
    - Ensure sensitive data sanitized
    - Check log format is consistent
    - Verify error logs are detailed

12. **Generate verification report**
    - Summarize all test results
    - List successes and failures
    - Document any issues found
    - Provide recommendations
    - Output report to file and console

### Verification Script Structure

```
verify_koombiyo.py structure:
┌────────────────────────────────────┐
│ def verify_configuration():        │
│     # Test config loading          │
│                                    │
│ def verify_provider_creation():    │
│     # Test provider instantiation  │
│                                    │
│ def verify_rate_retrieval():       │
│     # Test get_rates()             │
│                                    │
│ def verify_shipment_creation():    │
│     # Test create_shipment()       │
│                                    │
│ def verify_tracking():             │
│     # Test track_shipment()        │
│                                    │
│ def verify_cancellation():         │
│     # Test cancel_shipment()       │
│                                    │
│ def verify_error_handling():       │
│     # Test exceptions              │
│                                    │
│ def main():                        │
│     # Run all verifications        │
│     # Generate report              │
└────────────────────────────────────┘
```

### Sample Test Data

```
RateRequest:
┌────────────────────────────────────┐
│ {                                  │
│   'origin': {                      │
│     'city': 'Colombo',             │
│     'postal_code': '00100'         │
│   },                               │
│   'destination': {                 │
│     'city': 'Kandy',               │
│     'postal_code': '20000'         │
│   },                               │
│   'package': {                     │
│     'weight': 2.5                  │
│   }                                │
│ }                                  │
└────────────────────────────────────┘

ShipmentRequest:
┌────────────────────────────────────┐
│ {                                  │
│   'pickup_address': {              │
│     'name': 'Test Sender',         │
│     'phone': '+94771234567',       │
│     'address_line1': '123 Main St',│
│     'city': 'Colombo',             │
│     'postal_code': '00100'         │
│   },                               │
│   'delivery_address': {            │
│     'name': 'Test Receiver',       │
│     'phone': '+94777654321',       │
│     'address_line1': '456 Hill Rd',│
│     'city': 'Kandy',               │
│     'postal_code': '20000'         │
│   },                               │
│   'package': {                     │
│     'weight': 2.5,                 │
│     'description': 'Test package'  │
│   }                                │
│ }                                  │
└────────────────────────────────────┘
```

### Verification Checklist

| Component | Verification | Status |
|-----------|-------------|--------|
| Configuration | Settings loaded correctly | ✓/✗ |
| Provider Creation | Factory creates provider | ✓/✗ |
| Rate Retrieval | Rates returned properly | ✓/✗ |
| Shipment Creation | Waybill generated | ✓/✗ |
| Tracking | Status retrieved | ✓/✗ |
| Cancellation | Cancellation works | ✓/✗ |
| Error Handling | Exceptions raised correctly | ✓/✗ |
| Retry Logic | Retries on failure | ✓/✗ |
| Rate Limiting | Throttling works | ✓/✗ |
| Logging | Logs generated | ✓/✗ |

### Expected Verification Output

```
Verification Report:
┌────────────────────────────────────┐
│ Koombiyo API Client Verification   │
│ ---------------------------------- │
│                                    │
│ ✓ Configuration: PASS              │
│ ✓ Provider Creation: PASS          │
│ ✓ Rate Retrieval: PASS             │
│   - Retrieved 2 rate options       │
│   - Rates: ₨350, ₨600             │
│ ✓ Shipment Creation: PASS          │
│   - Waybill: WB123456789           │
│   - Label URL: https://...         │
│ ✓ Tracking: PASS                   │
│   - Status: pending                │
│   - Location: Colombo              │
│ ✓ Cancellation: PASS               │
│   - Fee: ₨0                        │
│   - Refund: ₨350                   │
│ ✓ Error Handling: PASS             │
│   - Auth errors caught             │
│   - Validation errors caught       │
│ ✓ Retry Logic: PASS                │
│   - Retries on timeout             │
│ ✓ Rate Limiting: PASS              │
│   - Throttling active              │
│ ✓ Logging: PASS                    │
│   - Request logs present           │
│   - Sensitive data sanitized       │
│                                    │
│ Overall: ALL TESTS PASSED          │
└────────────────────────────────────┘
```

### Common Issues to Check

| Issue | Check | Resolution |
|-------|-------|------------|
| Authentication fails | API credentials correct? | Update settings |
| Rate limit errors | Rate limiter enabled? | Enable rate limiting |
| Timeout errors | Timeout too short? | Increase timeout |
| Validation errors | Data format correct? | Fix data format |
| Missing configuration | All settings present? | Add missing settings |

### Integration Test Scenarios

| Scenario | Test | Expected Result |
|----------|------|-----------------|
| Happy path | Create, track, cancel shipment | All succeed |
| Invalid credentials | Use wrong API key | AuthError raised |
| Invalid data | Missing required fields | ValidationError raised |
| Network error | Simulate connection failure | Retry and eventual failure |
| Rate limiting | Make 20 rapid requests | Throttled, no errors |

### Performance Benchmarks

| Operation | Expected Time | Acceptable Range |
|-----------|--------------|------------------|
| Get rates | < 1 second | 0.5-2 seconds |
| Create shipment | < 2 seconds | 1-5 seconds |
| Track shipment | < 1 second | 0.5-2 seconds |
| Cancel shipment | < 1 second | 0.5-2 seconds |

### Expected Outcome
- Complete verification of all components
- All success scenarios tested
- All error scenarios validated
- Performance acceptable
- Comprehensive verification report
- Documentation of any issues

### Verification Checklist
- [ ] Verification script created
- [ ] Configuration verified
- [ ] Provider creation tested
- [ ] Rate retrieval tested
- [ ] Shipment creation tested
- [ ] Tracking tested
- [ ] Cancellation tested
- [ ] Error handling validated
- [ ] Retry logic verified
- [ ] Rate limiting verified
- [ ] Logging verified
- [ ] Verification report generated
- [ ] All tests passed or issues documented

---

## Summary

This document covered the implementation of the ShippingProvider abstract interface and its Koombiyo concrete implementation. The system includes:

- **ShippingProvider ABC**: Abstract base class defining provider interface
- **create_shipment Method**: Abstract method for shipment creation
- **get_rates Method**: Abstract method for rate quotes
- **track_shipment Method**: Abstract method for shipment tracking
- **cancel_shipment Method**: Abstract method for cancellation
- **KoombiyoProvider**: Concrete implementation using KoombiyoClient
- **Provider Factory**: Registration and instantiation system
- **Verification**: Complete testing and validation

The Koombiyo API client is now complete and ready for integration with the broader shipping module. The next group will implement waybill generation and label printing functionality.
