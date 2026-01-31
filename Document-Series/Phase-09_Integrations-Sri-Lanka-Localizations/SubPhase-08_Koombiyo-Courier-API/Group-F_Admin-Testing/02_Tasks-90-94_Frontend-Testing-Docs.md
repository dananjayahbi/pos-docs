# Tasks 90-94: Frontend Client, UI Components, Testing & Documentation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** F - Admin & Testing  
> **Document:** 02 of 02  
> **Tasks Covered:** 90, 91, 92, 93, 94

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-89_Admin-API.md](01_Tasks-81-89_Admin-API.md)
- **→ Next SubPhase:** [SubPhase-09_Domex-Other-Couriers](../../SubPhase-09_Domex-Other-Couriers/)

---

## Document Overview

This document covers the frontend integration for Koombiyo courier services, including TypeScript type definitions, API client implementation, UI components for tracking display, comprehensive integration testing, and complete documentation. These components provide a seamless interface for merchants to generate waybills, track shipments, and schedule pickups directly from the frontend application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 90 | Create Koombiyo Types | Low | 30 min |
| 91 | Create Frontend Client | Medium | 60 min |
| 92 | Create Tracking UI | Medium | 75 min |
| 93 | Create Integration Tests | Medium | 90 min |
| 94 | Create Documentation | Medium | 60 min |

---

## Task 90: Create Koombiyo Types

### Overview
Create comprehensive TypeScript type definitions for all Koombiyo-related data structures. These types ensure type safety throughout the frontend application when working with waybills, tracking events, pickups, and API responses. They serve as the foundation for the API client and UI components.

### Dependencies
- Frontend project initialized (Phase 07)
- TypeScript configured
- API specifications from Task 86-89

### Instructions

1. **Create types directory structure**
   - Navigate to `frontend/lib/` directory
   - Create `shipping/` directory if not exists
   - Create `koombiyo/` subdirectory
   - Create `types.ts` file

2. **Define Waybill type**
   - Create Waybill interface
   - Include all fields from backend model
   - Use proper TypeScript types (string, number, Date)
   - Mark optional fields with `?`

3. **Define nested Order type**
   - Create OrderSummary interface (minimal order data)
   - Include: id, orderNumber, customerName
   - Used in Waybill type as nested object

4. **Define TrackingEvent type**
   - Create TrackingEvent interface
   - Include: status, location, timestamp, description
   - Use union types for status values

5. **Define Pickup type**
   - Create Pickup interface
   - Include schedule fields: pickupDate, timeSlot, status
   - Include location fields: address, city, postalCode
   - Include contact fields: contactPerson, phone

6. **Define CODReport type**
   - Create CODReport interface
   - Include financial fields: totalCollected, totalRemitted, commission
   - Include date range and reconciliation status

7. **Define enum types**
   - Create WaybillStatus enum (pending, confirmed, shipped, delivered, etc.)
   - Create ServiceType enum (standard, express, sameDay)
   - Create PaymentMethod enum (prepaid, COD)
   - Create PickupTimeSlot enum (morning, afternoon, evening)
   - Create ReconciliationStatus enum (pending, reconciled, disputed)

8. **Define API response types**
   - Create PaginatedResponse generic type
   - Create ApiError type for error handling
   - Create WaybillCreateRequest type
   - Create PickupScheduleRequest type

9. **Export all types**
   - Export all interfaces and enums
   - Ensure types are available for import

### Type Structure Overview

```
types.ts
├── Enums
│   ├── WaybillStatus
│   ├── ServiceType
│   ├── PaymentMethod
│   ├── PickupTimeSlot
│   └── ReconciliationStatus
├── Core Types
│   ├── OrderSummary
│   ├── Waybill
│   ├── TrackingEvent
│   ├── Pickup
│   └── CODReport
├── Request Types
│   ├── WaybillCreateRequest
│   └── PickupScheduleRequest
└── Response Types
    ├── PaginatedResponse<T>
    └── ApiError
```

### Waybill Interface Example Structure

```typescript
interface Waybill {
  id: number;
  order: OrderSummary;
  waybillNumber: string;
  status: WaybillStatus;
  serviceType: ServiceType;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  recipientInfo: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  shippingCost: number;
  paymentMethod: PaymentMethod;
  codAmount?: number;
  trackingUrl?: string;
  pdfUrl?: string;
  trackingEvents?: TrackingEvent[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Enum Definitions

| Enum | Values | Purpose |
|------|--------|---------|
| WaybillStatus | Pending, Confirmed, Printed, Shipped, InTransit, OutForDelivery, Delivered, Failed, Cancelled | Waybill lifecycle states |
| ServiceType | Standard, Express, SameDay | Shipping service levels |
| PaymentMethod | Prepaid, COD | Payment types |
| PickupTimeSlot | Morning, Afternoon, Evening | Pickup scheduling |
| ReconciliationStatus | Pending, Reconciled, Disputed | COD report status |

### Type Safety Benefits

| Benefit | Description |
|---------|-------------|
| Autocomplete | IDE provides field suggestions |
| Type Checking | Catch errors at compile time |
| Documentation | Types serve as inline documentation |
| Refactoring | Safe changes across codebase |

### Expected Outcome
- Comprehensive TypeScript types for Koombiyo data
- Enum types for status values
- Request and response type definitions
- Type-safe data structures throughout frontend
- Foundation for API client and components

### Verification Checklist
- [ ] types.ts file created in correct location
- [ ] All enums defined with correct values
- [ ] Waybill interface includes all fields
- [ ] TrackingEvent interface matches backend
- [ ] Pickup interface complete
- [ ] Request/response types defined
- [ ] All types exported correctly
- [ ] No TypeScript compilation errors
- [ ] Types match API specifications

---

## Task 91: Create Frontend Client

### Overview
Create a TypeScript API client for interacting with Koombiyo backend endpoints. This client provides strongly-typed methods for all Koombiyo operations including waybill generation, tracking retrieval, and pickup scheduling. It handles HTTP requests, error handling, and data transformation between frontend and backend formats.

### Dependencies
- Task 90: Create Koombiyo Types
- Task 86-89: Backend APIs

### Instructions

1. **Create client file**
   - In `frontend/lib/shipping/koombiyo/` directory
   - Create `client.ts` file
   - This file contains the API client class

2. **Import dependencies**
   - Import axios or fetch for HTTP requests
   - Import all types from types.ts
   - Import API base URL from config

3. **Create KoombiyoClient class**
   - Define class with private baseUrl property
   - Add constructor to set base URL
   - Include auth token handling

4. **Implement waybill methods**
   - `getWaybills(params)`: List waybills with filters/pagination
   - `getWaybill(id)`: Get single waybill by ID
   - `generateWaybill(orderId, data)`: Generate waybill for order
   - Use proper types for parameters and return values

5. **Implement tracking method**
   - `getTracking(waybillId, refresh)`: Get tracking events
   - Accept optional refresh parameter
   - Return array of TrackingEvent

6. **Implement pickup methods**
   - `schedulePickup(data)`: Schedule new pickup
   - `getPickups(params)`: List scheduled pickups
   - `getPickup(id)`: Get single pickup details

7. **Add error handling**
   - Create helper method for error parsing
   - Transform API errors to ApiError type
   - Handle network errors and timeouts
   - Provide meaningful error messages

8. **Add request interceptor**
   - Attach authentication token to requests
   - Add tenant context if needed
   - Set common headers (Content-Type, Accept)

9. **Add response interceptor**
   - Transform date strings to Date objects
   - Convert snake_case to camelCase
   - Handle pagination metadata

10. **Create singleton instance**
    - Export default instance of client
    - Configure with environment variables
    - Allow custom configuration for testing

11. **Add TypeScript generics**
    - Use generics for paginated responses
    - Type-safe filter and sort parameters
    - Ensure return types match expectations

### Client Class Structure

```
KoombiyoClient
├── Constructor
│   └── Set baseUrl, configure axios
├── Waybill Methods
│   ├── getWaybills(params)
│   ├── getWaybill(id)
│   └── generateWaybill(orderId, data)
├── Tracking Methods
│   └── getTracking(waybillId, refresh)
├── Pickup Methods
│   ├── schedulePickup(data)
│   ├── getPickups(params)
│   └── getPickup(id)
└── Utility Methods
    ├── handleError(error)
    └── transformResponse(data)
```

### Method Signatures

| Method | Parameters | Return Type | HTTP Method |
|--------|------------|-------------|-------------|
| getWaybills | filters, page, pageSize | Promise<PaginatedResponse<Waybill>> | GET |
| getWaybill | id | Promise<Waybill> | GET |
| generateWaybill | orderId, data | Promise<Waybill> | POST |
| getTracking | waybillId, refresh? | Promise<TrackingEvent[]> | GET |
| schedulePickup | data | Promise<Pickup> | POST |
| getPickups | filters | Promise<PaginatedResponse<Pickup>> | GET |

### Error Handling Flow

```
API Request
      │
      ▼
Try Request
      │
      ├─→ Success
      │   ├─→ Transform response
      │   └─→ Return data
      │
      └─→ Error
          ├─→ Network Error
          │   └─→ Throw "Network error"
          ├─→ 400 Bad Request
          │   └─→ Parse validation errors
          ├─→ 401 Unauthorized
          │   └─→ Trigger re-auth
          ├─→ 404 Not Found
          │   └─→ Throw "Not found"
          └─→ 500 Server Error
              └─→ Throw "Server error"
```

### Request Transformation

| Frontend (camelCase) | Backend (snake_case) | Transformation |
|---------------------|---------------------|----------------|
| waybillNumber | waybill_number | Automatic |
| trackingUrl | tracking_url | Automatic |
| createdAt | created_at | String → Date |
| recipientInfo | recipient_info | Nested object |

### Authentication

```
Request Flow
      │
      ▼
Get Auth Token
      │
      ▼
Add to Headers
Authorization: Bearer <token>
      │
      ▼
Make Request
```

### Usage Example Pattern

```typescript
// Import client
import koombiyoClient from '@/lib/shipping/koombiyo/client';

// Use client methods
const waybills = await koombiyoClient.getWaybills({
  status: WaybillStatus.Shipped,
  page: 1
});

const waybill = await koombiyoClient.generateWaybill(orderId, {
  serviceType: ServiceType.Express
});

const tracking = await koombiyoClient.getTracking(waybillId, true);
```

### Expected Outcome
- Fully functional API client for Koombiyo
- Type-safe method signatures
- Proper error handling and transformation
- Authentication integration
- Singleton instance for app-wide use

### Verification Checklist
- [ ] client.ts file created in correct location
- [ ] All methods implemented with correct signatures
- [ ] Types used throughout for type safety
- [ ] Error handling catches all cases
- [ ] Request/response transformations work
- [ ] Authentication token attached to requests
- [ ] Singleton instance exported
- [ ] No TypeScript compilation errors
- [ ] Client methods callable from components

---

## Task 92: Create Tracking UI

### Overview
Create a React component to display shipment tracking information in a visual timeline format. The TrackingTimeline component shows all tracking events for a waybill in chronological order with status icons, locations, timestamps, and descriptions. It provides a user-friendly way for merchants and customers to monitor shipment progress.

### Dependencies
- Task 91: Create Frontend Client
- Task 90: Create Koombiyo Types
- Shadcn/UI components (Timeline, Card, Badge)

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/orders/` directory
   - Create `TrackingTimeline.tsx` file
   - This component displays tracking events

2. **Define component props**
   - Create TrackingTimelineProps interface
   - Include waybillId (required)
   - Include showRefresh (optional, default true)
   - Include onRefresh callback (optional)

3. **Set up component state**
   - Use useState for tracking events array
   - Use useState for loading state
   - Use useState for error state
   - Use useState for last updated timestamp

4. **Fetch tracking data on mount**
   - Use useEffect to load tracking on component mount
   - Call koombiyoClient.getTracking(waybillId)
   - Update state with tracking events
   - Handle errors gracefully

5. **Implement refresh functionality**
   - Add refresh button to component header
   - Call API with refresh=true parameter
   - Show loading indicator during refresh
   - Update events with latest data

6. **Create timeline layout**
   - Use vertical timeline component from Shadcn/UI
   - Map over tracking events array
   - Each event is a timeline item

7. **Design event item**
   - Show status icon (based on event status)
   - Display status label with badge
   - Show location prominently
   - Display timestamp (formatted)
   - Include description text

8. **Add status icons**
   - Map status to appropriate icon
   - Use different colors per status
   - Icons: CheckCircle (delivered), Truck (in transit), Clock (pending), etc.

9. **Format timestamps**
   - Use date-fns or similar library
   - Show relative time ("2 hours ago")
   - Include full timestamp on hover
   - Consider timezone (Asia/Colombo)

10. **Handle empty state**
    - Show message if no tracking events
    - Provide helpful text ("Tracking info not yet available")
    - Include refresh button

11. **Handle error state**
    - Display error message if fetch fails
    - Provide retry button
    - Log error for debugging

12. **Add loading skeleton**
    - Show skeleton UI while loading
    - Maintain timeline structure
    - Use Shadcn skeleton component

13. **Make responsive**
    - Adjust layout for mobile devices
    - Stack timeline vertically
    - Ensure text readability

### Component Structure

```
TrackingTimeline
├── Header
│   ├── Title "Shipment Tracking"
│   └── Refresh Button
├── Loading State
│   └── Skeleton Timeline
├── Error State
│   ├── Error Message
│   └── Retry Button
├── Empty State
│   └── "No tracking events"
└── Timeline (Events)
    └── For each event
        ├── Status Icon
        ├── Status Badge
        ├── Location
        ├── Timestamp
        └── Description
```

### Timeline Layout Visual

```
Shipment Tracking                    [Refresh]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ●  [Delivered]
  │  Colombo 5
  │  Jan 30, 2026 - 2:30 PM
  │  Package delivered successfully
  │
  ●  [Out for Delivery]
  │  Colombo 5
  │  Jan 30, 2026 - 10:30 AM
  │  Out for delivery to recipient
  │
  ●  [In Transit]
  │  Kandy Hub
  │  Jan 29, 2026 - 3:15 PM
  │  Package in transit to Colombo
  │
  ●  [Picked Up]
  │  Colombo Hub
  │  Jan 29, 2026 - 9:00 AM
  │  Package picked up from merchant
```

### Status Icon Mapping

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| Delivered | CheckCircle | Green | Success |
| Out for Delivery | Truck | Blue | Active |
| In Transit | ArrowRight | Blue | Moving |
| Picked Up | Package | Purple | Started |
| Pending | Clock | Gray | Waiting |
| Failed | XCircle | Red | Error |

### Timestamp Formatting

| Format | Example | When to Use |
|--------|---------|-------------|
| Relative | "2 hours ago" | Recent events (< 24h) |
| Short | "Jan 30, 2:30 PM" | Within same year |
| Full | "Jan 30, 2026 2:30 PM" | Older events |

### Props Interface

```typescript
interface TrackingTimelineProps {
  waybillId: number;
  showRefresh?: boolean;
  onRefresh?: () => void;
  className?: string;
}
```

### State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| events | TrackingEvent[] | Tracking data |
| loading | boolean | Loading indicator |
| error | string | null | Error message |
| lastUpdated | Date | null | Last refresh time |

### Expected Outcome
- Visual timeline component for tracking
- Real-time refresh capability
- Status-specific icons and colors
- Responsive design for all devices
- Loading and error states handled

### Verification Checklist
- [ ] TrackingTimeline.tsx created in correct location
- [ ] Component accepts waybillId prop
- [ ] Tracking data loads on mount
- [ ] Refresh button fetches latest data
- [ ] Timeline displays events chronologically
- [ ] Status icons and colors appropriate
- [ ] Timestamps formatted correctly
- [ ] Empty state handled gracefully
- [ ] Error state displays retry option
- [ ] Loading skeleton shows during fetch
- [ ] Component responsive on mobile
- [ ] No console errors or warnings

---

## Task 93: Create Integration Tests

### Overview
Create comprehensive integration tests for the complete Koombiyo integration flow. These tests validate the end-to-end functionality including waybill generation, tracking updates, pickup scheduling, and COD reconciliation. Tests cover both happy paths and error scenarios to ensure system reliability.

### Dependencies
- Task 81-92: All Koombiyo implementation complete
- Backend API running
- Test database configured
- Testing framework (Jest, pytest)

### Instructions

1. **Set up test environment**
   - Configure test database with sample data
   - Create test fixtures for orders, waybills
   - Mock Koombiyo API responses
   - Set up test client/user authentication

2. **Create backend test file**
   - Navigate to `backend/apps/shipping/tests/`
   - Create `test_koombiyo_integration.py`
   - Import necessary models, API client, test utilities

3. **Write waybill generation tests**
   - Test successful waybill creation from order
   - Test validation errors (missing address, invalid weight)
   - Test API error handling
   - Test duplicate waybill prevention
   - Verify waybill data stored correctly

4. **Write tracking tests**
   - Test tracking event creation via webhook
   - Test tracking retrieval API
   - Test tracking refresh functionality
   - Test empty tracking state
   - Verify event ordering and timestamps

5. **Write pickup scheduling tests**
   - Test successful pickup creation
   - Test waybill association with pickup
   - Test validation (date, time slot, waybills)
   - Test Koombiyo API integration
   - Verify pickup confirmation

6. **Write COD reconciliation tests**
   - Test COD report generation
   - Test reconciliation flow
   - Test amount calculations
   - Test status updates
   - Verify financial accuracy

7. **Write admin interface tests**
   - Test admin list views load correctly
   - Test filtering and search
   - Test bulk actions (print labels)
   - Test inline displays
   - Verify permissions

8. **Create frontend test file**
   - Navigate to `frontend/__tests__/shipping/`
   - Create `koombiyo-integration.test.ts`
   - Import testing library, client, components

9. **Write API client tests**
   - Test all client methods
   - Mock HTTP responses
   - Test error handling
   - Test data transformation
   - Verify request headers and body

10. **Write component tests**
    - Test TrackingTimeline renders correctly
    - Test refresh functionality
    - Test loading and error states
    - Test empty state display
    - Verify timeline item rendering

11. **Write end-to-end tests**
    - Test complete flow: order → waybill → tracking → delivery
    - Test pickup scheduling flow
    - Test COD reconciliation flow
    - Use test database with real API calls (or mocked)

12. **Add performance tests**
    - Test API response times
    - Test pagination with large datasets
    - Test concurrent waybill generation
    - Verify no N+1 query problems

13. **Document test coverage**
    - Run coverage report
    - Aim for > 80% coverage
    - Document untested edge cases
    - Add comments for complex tests

### Test File Structure

```
Backend Tests (Python/pytest)
├── test_koombiyo_integration.py
    ├── TestWaybillGeneration
    │   ├── test_create_waybill_success
    │   ├── test_create_waybill_missing_address
    │   ├── test_create_waybill_api_error
    │   └── test_duplicate_waybill_prevention
    ├── TestTracking
    │   ├── test_webhook_creates_event
    │   ├── test_get_tracking_events
    │   └── test_tracking_refresh
    ├── TestPickup
    │   ├── test_schedule_pickup_success
    │   ├── test_pickup_validation
    │   └── test_waybill_association
    └── TestCODReconciliation
        ├── test_generate_report
        └── test_reconcile_amounts

Frontend Tests (TypeScript/Jest)
├── koombiyo-integration.test.ts
    ├── API Client Tests
    │   ├── test getWaybills
    │   ├── test generateWaybill
    │   ├── test getTracking
    │   └── test schedulePickup
    └── Component Tests
        ├── test TrackingTimeline render
        ├── test refresh functionality
        └── test error handling
```

### Test Scenarios

| Test Category | Scenario | Expected Result |
|---------------|----------|-----------------|
| Waybill Generation | Valid order with complete address | Waybill created, API called |
| Waybill Generation | Order missing postal code | Validation error returned |
| Waybill Generation | Koombiyo API error | Error handled gracefully |
| Tracking | Webhook receives status update | Event created in database |
| Tracking | Retrieve tracking for waybill | Events returned chronologically |
| Pickup | Schedule with valid data | Pickup confirmed, waybills linked |
| Pickup | Invalid time slot | Validation error |
| COD | Generate report for date range | Report with correct totals |

### Mock Data Structure

```python
# Backend test fixture
@pytest.fixture
def sample_order():
    return Order.objects.create(
        order_number="TEST-001",
        customer_name="Test Customer",
        shipping_address="123 Test St, Colombo",
        city="Colombo",
        postal_code="00100",
        phone="+94771234567",
        total_amount=5000
    )

@pytest.fixture
def mock_koombiyo_response():
    return {
        'waybill_number': 'WB123456',
        'tracking_url': 'https://koombiyo.com/track/WB123456',
        'pdf_url': 'https://koombiyo.com/labels/WB123456.pdf'
    }
```

### Frontend Test Example

```typescript
describe('KoombiyoClient', () => {
  it('should generate waybill successfully', async () => {
    // Mock API response
    mockAxios.onPost('/api/orders/123/waybill/').reply(201, {
      waybillNumber: 'WB123456',
      status: 'confirmed'
    });

    // Call client method
    const waybill = await koombiyoClient.generateWaybill(123, {
      serviceType: ServiceType.Express
    });

    // Assert result
    expect(waybill.waybillNumber).toBe('WB123456');
    expect(waybill.status).toBe(WaybillStatus.Confirmed);
  });
});
```

### Test Coverage Goals

| Component | Target Coverage | Critical Areas |
|-----------|----------------|----------------|
| Models | 90%+ | Validation, methods |
| API Views | 85%+ | All endpoints, errors |
| Serializers | 90%+ | Field validation |
| Client | 85%+ | All methods, errors |
| Components | 80%+ | Rendering, interactions |

### CI/CD Integration

```
Test Pipeline
      │
      ├─→ Backend Tests
      │   ├─→ Unit tests
      │   ├─→ Integration tests
      │   └─→ Coverage report
      │
      ├─→ Frontend Tests
      │   ├─→ Unit tests
      │   ├─→ Component tests
      │   └─→ Coverage report
      │
      └─→ E2E Tests
          └─→ Full flow scenarios
```

### Expected Outcome
- Comprehensive test suite for Koombiyo integration
- Coverage > 80% for critical paths
- All happy paths tested
- Error scenarios validated
- Performance benchmarks established

### Verification Checklist
- [ ] Backend test file created with all test classes
- [ ] All waybill generation scenarios tested
- [ ] Tracking webhook and retrieval tested
- [ ] Pickup scheduling tested
- [ ] COD reconciliation tested
- [ ] Frontend client tests complete
- [ ] Component tests cover all states
- [ ] Mocks configured correctly
- [ ] All tests pass successfully
- [ ] Coverage reports generated
- [ ] Performance tests included
- [ ] Tests integrated into CI/CD pipeline

---

## Task 94: Create Documentation

### Overview
Create comprehensive documentation for the Koombiyo integration covering setup, configuration, API usage, admin interfaces, troubleshooting, and best practices. This documentation serves as the definitive guide for developers, administrators, and support staff working with the Koombiyo courier integration.

### Dependencies
- Task 93: Create Integration Tests (all implementation complete)
- Documentation structure from Phase 01

### Instructions

1. **Create documentation directory**
   - Navigate to `backend/docs/` directory
   - Create `shipping/` subdirectory
   - Create `koombiyo-integration.md` file

2. **Write overview section**
   - Explain purpose of Koombiyo integration
   - List key features (waybill generation, tracking, pickup, COD)
   - Describe system architecture
   - Include integration diagram

3. **Document setup and configuration**
   - List environment variables required
   - Explain API key configuration
   - Document database models and migrations
   - Provide initial setup checklist

4. **Document Koombiyo API client**
   - Explain KoombiyoClient class usage
   - Document all public methods
   - Provide code examples for each method
   - List error codes and meanings

5. **Document Django admin interfaces**
   - Explain each admin page (Waybill, Tracking, Pickup, COD)
   - Document admin actions (bulk print labels)
   - Provide screenshots of admin interfaces
   - Explain filtering and search capabilities

6. **Document REST APIs**
   - List all endpoints with methods and paths
   - Document request/response formats
   - Provide cURL examples
   - Explain authentication requirements

7. **Document frontend components**
   - Explain TrackingTimeline component usage
   - Document component props and API
   - Provide integration examples
   - Show component screenshots

8. **Document webhook handling**
   - Explain webhook endpoint configuration
   - Document expected webhook payloads
   - Describe event processing flow
   - Provide security recommendations

9. **Create troubleshooting guide**
   - List common errors and solutions
   - Explain debugging steps
   - Document logging locations
   - Provide error code reference

10. **Document best practices**
    - Explain when to generate waybills
    - Recommend pickup scheduling strategies
    - Describe COD reconciliation workflow
    - Provide performance optimization tips

11. **Add API reference**
    - Create detailed API reference table
    - Document all parameters and types
    - List validation rules
    - Include response examples

12. **Include configuration examples**
    - Provide sample .env configuration
    - Show example Django settings
    - Include example nginx configuration for webhooks
    - Document rate limiting recommendations

13. **Create FAQ section**
    - Answer common questions
    - Address known limitations
    - Explain workarounds for edge cases

14. **Add version history**
    - Document integration version
    - List breaking changes
    - Note deprecations
    - Provide migration guides

### Documentation Structure

```
Koombiyo Integration Documentation
├── 1. Overview
│   ├── Purpose and Features
│   ├── System Architecture
│   └── Integration Diagram
├── 2. Setup and Configuration
│   ├── Environment Variables
│   ├── Database Setup
│   ├── API Key Configuration
│   └── Webhook Setup
├── 3. Backend Implementation
│   ├── Models Reference
│   ├── API Client Usage
│   ├── ViewSets and Endpoints
│   └── Webhook Handlers
├── 4. Admin Interfaces
│   ├── Waybill Admin
│   ├── Tracking Admin
│   ├── Pickup Admin
│   └── COD Report Admin
├── 5. Frontend Implementation
│   ├── TypeScript Types
│   ├── API Client
│   ├── TrackingTimeline Component
│   └── Integration Examples
├── 6. API Reference
│   ├── Endpoints Table
│   ├── Request/Response Formats
│   └── Error Codes
├── 7. Testing
│   ├── Running Tests
│   ├── Test Coverage
│   └── Manual Testing Guide
├── 8. Troubleshooting
│   ├── Common Issues
│   ├── Debugging Steps
│   └── Error Resolution
├── 9. Best Practices
│   ├── Waybill Generation
│   ├── Pickup Scheduling
│   ├── COD Reconciliation
│   └── Performance Optimization
└── 10. Appendix
    ├── Configuration Examples
    ├── FAQ
    └── Version History
```

### Environment Variables Documentation

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| KOOMBIYO_API_KEY | String | Yes | API authentication key | `koombiyo_live_abc123` |
| KOOMBIYO_API_URL | String | Yes | Base API URL | `https://api.koombiyo.com/v1` |
| KOOMBIYO_WEBHOOK_SECRET | String | Yes | Webhook signature secret | `webhook_secret_xyz` |
| KOOMBIYO_TIMEOUT | Integer | No | Request timeout (seconds) | `30` |

### API Endpoints Reference Table

| Endpoint | Method | Description | Auth | Request | Response |
|----------|--------|-------------|------|---------|----------|
| `/api/waybills/` | GET | List waybills | Required | Query params | Paginated list |
| `/api/waybills/{id}/` | GET | Get waybill | Required | - | Waybill object |
| `/api/orders/{id}/waybill/` | POST | Generate waybill | Required | Service type | Waybill object |
| `/api/waybills/{id}/tracking/` | GET | Get tracking | Required | refresh param | Events array |
| `/api/pickups/schedule/` | POST | Schedule pickup | Required | Pickup details | Pickup object |

### Integration Diagram

```
Frontend Application
      │
      ├─→ Generate Waybill
      │        │
      │        ▼
      │   POST /api/orders/{id}/waybill/
      │        │
      │        ▼
      │   Django Backend
      │        │
      │        ▼
      │   KoombiyoClient.create_waybill()
      │        │
      │        ▼
      │   Koombiyo API
      │        │
      │        ├─→ Return waybill number
      │        └─→ Return PDF label
      │
      ├─→ Track Shipment
      │        │
      │        ▼
      │   GET /api/waybills/{id}/tracking/
      │        │
      │        ▼
      │   Return tracking events
      │
      └─→ Receive Webhook
           │
           ▼
      POST /webhooks/koombiyo/tracking/
           │
           ▼
      Process tracking update
           │
           ▼
      Create TrackingEvent
```

### Troubleshooting Table

| Issue | Cause | Solution |
|-------|-------|----------|
| Waybill generation fails | Missing API key | Check KOOMBIYO_API_KEY in environment |
| Webhook not received | Firewall blocking | Configure firewall to allow Koombiyo IPs |
| Tracking not updating | Webhook signature invalid | Verify KOOMBIYO_WEBHOOK_SECRET |
| Pickup scheduling fails | Invalid time slot | Use: morning, afternoon, or evening |
| PDF label missing | API returned no PDF | Check Koombiyo API status |

### Best Practices Section

| Practice | Recommendation | Reason |
|----------|----------------|--------|
| Waybill Generation | Generate after payment confirmed | Avoid wasted labels |
| Pickup Scheduling | Schedule 24 hours ahead | Ensure availability |
| COD Reconciliation | Daily reconciliation | Maintain cash flow |
| Error Logging | Log all API errors | Debugging and monitoring |
| Rate Limiting | Respect API limits | Avoid throttling |

### Expected Outcome
- Complete documentation for Koombiyo integration
- Setup and configuration guide
- API reference with examples
- Admin interface documentation
- Troubleshooting guide
- Best practices and recommendations

### Verification Checklist
- [ ] Documentation file created in correct location
- [ ] Overview section complete with diagrams
- [ ] Setup instructions clear and accurate
- [ ] All API endpoints documented
- [ ] Admin interfaces explained
- [ ] Frontend components documented
- [ ] Webhook configuration covered
- [ ] Troubleshooting guide comprehensive
- [ ] Best practices provided
- [ ] Code examples accurate and tested
- [ ] Screenshots included where helpful
- [ ] FAQ answers common questions
- [ ] Documentation reviewed for clarity
- [ ] Links to related documentation included

---

## Summary

This document covered the frontend integration, comprehensive testing, and documentation for the Koombiyo courier API. The TypeScript types and API client provide type-safe access to Koombiyo functionality throughout the frontend application. The TrackingTimeline component delivers a polished user interface for shipment monitoring. Integration tests validate the entire system end-to-end, ensuring reliability and catching regressions. Complete documentation serves as a reference for developers and administrators, enabling efficient use and maintenance of the Koombiyo integration. With these components in place, the Koombiyo integration is production-ready and fully supported.
