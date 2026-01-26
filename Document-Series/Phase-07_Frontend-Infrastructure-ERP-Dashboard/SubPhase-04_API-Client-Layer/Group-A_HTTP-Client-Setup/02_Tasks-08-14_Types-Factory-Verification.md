# Tasks 08-14: Type Definitions, Factory Function, and Verification

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** A - HTTP Client Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_Axios-Client-Configuration.md](01_Tasks-01-07_Axios-Client-Configuration.md)

---

## Document Overview

This document completes the HTTP client setup by creating comprehensive TypeScript type definitions for API communication, implementing a factory function for creating custom client instances, and verifying the complete setup. These types ensure type safety across all API interactions, while the factory enables module-specific client configurations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 08 | Create Type Definitions | Low | 15 min |
| 09 | Create APIResponse Type | Low | 10 min |
| 10 | Create PaginatedResponse Type | Low | 15 min |
| 11 | Create APIError Type | Low | 10 min |
| 12 | Create RequestConfig Type | Low | 10 min |
| 13 | Create API Client Factory | Medium | 25 min |
| 14 | Verify API Client Setup | Low | 15 min |

---

## Task 08: Create Type Definitions

### Overview
Create a dedicated TypeScript file (types/api.ts) to house all API-related type definitions. This centralized location ensures consistent typing across the application, improves maintainability, and provides a single source of truth for API data structures.

### Dependencies
- SubPhase-01: TypeScript configured
- Task 02: API Client Directory created

### Instructions

1. **Navigate to types directory**
   - Locate frontend/types/ directory
   - If types/ doesn't exist, create it
   - This directory contains all TypeScript type definitions

2. **Create api.ts file**
   - Inside types/, create api.ts
   - This file contains API-specific types
   - Separate from component types, utility types, etc.

3. **Add file header comment**
   - Document file purpose
   - List types contained in file
   - Note usage context

4. **Prepare for type definitions**
   - File ready for type exports
   - Will export multiple type definitions
   - Used throughout API client layer

### Types Directory Structure

```
frontend/types/
├── api.ts              ← API types (this file)
├── models.ts           ← Data model types
├── components.ts       ← Component prop types
├── utils.ts            ← Utility types
└── index.ts            ← Re-export all types
```

### Type Organization Strategy

| File | Contains | Examples |
|------|----------|----------|
| api.ts | API communication types | APIResponse, APIError, RequestConfig |
| models.ts | Business entity types | Product, Customer, Order |
| components.ts | Component-specific types | ButtonProps, ModalProps |
| utils.ts | Helper types | Nullable, DeepPartial |

### Why Separate Type Files?

| Benefit | Explanation |
|---------|-------------|
| Organization | Easy to locate specific types |
| Maintainability | Changes isolated to relevant file |
| Import Clarity | Clear where types come from |
| Scalability | File doesn't become unwieldy |
| Reusability | Types imported across modules |

### File Documentation Template

```
File Header:
/**
 * API Type Definitions
 * 
 * Contains TypeScript types for API communication including:
 * - Generic response wrappers
 * - Pagination structures
 * - Error formats
 * - Request configurations
 * 
 * These types align with Django REST Framework response formats
 * and ensure type safety across all API interactions.
 */
```

### Expected Outcome
- types/api.ts file created
- Centralized location for API types
- Foundation for type definitions
- Ready for type exports

### Verification Checklist
- [ ] types/ directory exists
- [ ] types/api.ts file created
- [ ] File header comment added
- [ ] File accessible from project root
- [ ] TypeScript recognizes file
- [ ] No compilation errors

---

## Task 09: Create APIResponse Type

### Overview
Create a generic APIResponse<T> type that wraps all successful API responses. This standardized response structure ensures consistent handling of API data throughout the application and aligns with Django REST Framework's response format.

### Dependencies
- Task 08: Create Type Definitions

### Instructions

1. **Define APIResponse generic type**
   - Open types/api.ts
   - Export interface named APIResponse
   - Add generic type parameter <T>

2. **Add data property**
   - Type: T (generic payload)
   - Contains the actual response data
   - Type varies per endpoint

3. **Add message property**
   - Type: string (optional)
   - Contains success/info message
   - Not all responses include message

4. **Add timestamp property**
   - Type: string
   - ISO 8601 formatted timestamp
   - Indicates when response generated

5. **Add type documentation**
   - Document generic parameter
   - Explain each property
   - Provide usage examples in comments

### APIResponse Structure

```
Generic Type Definition:
interface APIResponse<T> {
  data: T                    ← Generic payload (typed per endpoint)
  message?: string           ← Optional success message
  timestamp: string          ← ISO 8601 timestamp
}
```

### Generic Type Parameter Explanation

The <T> parameter allows type-safe responses for different endpoints:

| Endpoint | T Type | Full Response Type |
|----------|--------|-------------------|
| GET /products | Product[] | APIResponse<Product[]> |
| GET /products/123 | Product | APIResponse<Product> |
| POST /customers | Customer | APIResponse<Customer> |
| PUT /orders/456 | Order | APIResponse<Order> |

### Type Usage Examples

#### Example 1: Product List Response
```
Type: APIResponse<Product[]>

Response Structure:
{
  data: [
    { id: 1, name: "Product A", price: 100 },
    { id: 2, name: "Product B", price: 200 }
  ],
  message: "Products retrieved successfully",
  timestamp: "2026-01-25T10:30:00Z"
}
```

#### Example 2: Single Product Response
```
Type: APIResponse<Product>

Response Structure:
{
  data: {
    id: 1,
    name: "Product A",
    price: 100,
    stock: 50
  },
  message: "Product retrieved successfully",
  timestamp: "2026-01-25T10:30:00Z"
}
```

#### Example 3: Create Customer Response
```
Type: APIResponse<Customer>

Response Structure:
{
  data: {
    id: 123,
    name: "John Doe",
    email: "john@example.com",
    created_at: "2026-01-25T10:30:00Z"
  },
  message: "Customer created successfully",
  timestamp: "2026-01-25T10:30:00Z"
}
```

### Property Details

#### data Property
```
Type: T (generic)
Purpose: Contains actual response payload
Varies: Type changes per endpoint
Required: Yes
Examples:
  - Product object
  - Product array
  - Customer object
  - Order details
```

#### message Property
```
Type: string | undefined
Purpose: Human-readable success message
Varies: May be omitted in some responses
Required: No (optional)
Examples:
  - "Product created successfully"
  - "Order updated"
  - "Customer deleted"
```

#### timestamp Property
```
Type: string
Purpose: Response generation time
Format: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
Required: Yes
Example: "2026-01-25T10:30:00Z"
```

### Django REST Framework Alignment

This type aligns with DRF response serialization:

```
DRF View Returns:
Response({
    'data': serializer.data,
    'message': 'Operation successful',
    'timestamp': timezone.now().isoformat()
})

Frontend Receives:
Type: APIResponse<T>
Matches structure exactly
Full type safety
```

### Type Safety Benefits

| Benefit | Description |
|---------|-------------|
| Autocomplete | IDE suggests available properties |
| Type Checking | Compiler catches type mismatches |
| Refactoring | Changes propagate through codebase |
| Documentation | Types serve as inline documentation |

### Expected Outcome
- APIResponse<T> type defined
- Generic type parameter functional
- All response properties typed
- Type documented with comments

### Verification Checklist
- [ ] APIResponse interface exported
- [ ] Generic <T> parameter added
- [ ] data property typed as T
- [ ] message property optional string
- [ ] timestamp property string
- [ ] Type documented with JSDoc
- [ ] No TypeScript errors

---

## Task 10: Create PaginatedResponse Type

### Overview
Create a PaginatedResponse<T> type for paginated list endpoints. This type extends the base response structure with comprehensive pagination metadata, enabling proper pagination UI components and infinite scroll implementations.

### Dependencies
- Task 08: Create Type Definitions
- Task 09: Create APIResponse Type

### Instructions

1. **Define PaginatedResponse generic type**
   - Open types/api.ts
   - Export interface named PaginatedResponse
   - Add generic type parameter <T>

2. **Add data property**
   - Type: T[] (array of generic type)
   - Contains paginated items
   - Always an array for lists

3. **Create pagination metadata object**
   - Add pagination property
   - Type: nested object
   - Contains all pagination info

4. **Add pagination.page property**
   - Type: number
   - Current page number (1-indexed)
   - Used for pagination controls

5. **Add pagination.pageSize property**
   - Type: number
   - Items per page
   - Matches backend page_size parameter

6. **Add pagination.totalPages property**
   - Type: number
   - Total number of pages
   - Calculated from totalCount ÷ pageSize

7. **Add pagination.totalCount property**
   - Type: number
   - Total items across all pages
   - Used for "Showing X of Y" displays

8. **Add pagination.hasNext property**
   - Type: boolean
   - Indicates if next page exists
   - Used for "Next" button state

9. **Add pagination.hasPrevious property**
   - Type: boolean
   - Indicates if previous page exists
   - Used for "Previous" button state

10. **Add type documentation**
    - Document pagination structure
    - Explain each metadata field
    - Provide usage examples

### PaginatedResponse Structure

```
Generic Type Definition:
interface PaginatedResponse<T> {
  data: T[]                         ← Array of items
  pagination: {
    page: number                    ← Current page (1-indexed)
    pageSize: number                ← Items per page
    totalPages: number              ← Total pages
    totalCount: number              ← Total items
    hasNext: boolean                ← Has next page?
    hasPrevious: boolean            ← Has previous page?
  }
  message?: string                  ← Optional message
  timestamp: string                 ← ISO timestamp
}
```

### Pagination Metadata Breakdown

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| page | number | Current page number | 2 |
| pageSize | number | Items per page | 20 |
| totalPages | number | Total pages available | 5 |
| totalCount | number | Total items (all pages) | 93 |
| hasNext | boolean | Can navigate to next page | true |
| hasPrevious | boolean | Can navigate to previous | true |

### Pagination Calculation Example

```
Scenario:
- Total items: 93
- Page size: 20
- Current page: 2

Calculations:
- totalPages = Math.ceil(93 / 20) = 5
- hasNext = (page < totalPages) = (2 < 5) = true
- hasPrevious = (page > 1) = (2 > 1) = true

Page Breakdown:
- Page 1: Items 1-20 (20 items)
- Page 2: Items 21-40 (20 items) ← Current
- Page 3: Items 41-60 (20 items)
- Page 4: Items 61-80 (20 items)
- Page 5: Items 81-93 (13 items)
```

### Type Usage Examples

#### Example 1: Product List (Page 2 of 5)
```
Type: PaginatedResponse<Product>

Response:
{
  data: [
    { id: 21, name: "Product 21", price: 100 },
    { id: 22, name: "Product 22", price: 150 },
    // ... 18 more products
  ],
  pagination: {
    page: 2,
    pageSize: 20,
    totalPages: 5,
    totalCount: 93,
    hasNext: true,
    hasPrevious: true
  },
  message: "Products retrieved successfully",
  timestamp: "2026-01-25T10:30:00Z"
}
```

#### Example 2: Customer List (First Page)
```
Type: PaginatedResponse<Customer>

Response:
{
  data: [
    { id: 1, name: "Customer A", email: "a@example.com" },
    { id: 2, name: "Customer B", email: "b@example.com" },
    // ... more customers
  ],
  pagination: {
    page: 1,
    pageSize: 50,
    totalPages: 3,
    totalCount: 127,
    hasNext: true,
    hasPrevious: false  ← First page, no previous
  },
  timestamp: "2026-01-25T10:30:00Z"
}
```

#### Example 3: Order List (Last Page)
```
Type: PaginatedResponse<Order>

Response:
{
  data: [
    { id: 81, orderNumber: "ORD-081", total: 500 },
    { id: 82, orderNumber: "ORD-082", total: 750 }
    // Only 2 items on last page
  ],
  pagination: {
    page: 5,
    pageSize: 20,
    totalPages: 5,
    totalCount: 82,
    hasNext: false,     ← Last page, no next
    hasPrevious: true
  },
  timestamp: "2026-01-25T10:30:00Z"
}
```

### Pagination UI Integration

The type structure supports various pagination patterns:

#### Traditional Pagination Controls
```
Components Use:
- pagination.page → Current page display
- pagination.totalPages → Total pages display
- pagination.hasPrevious → Enable/disable Previous button
- pagination.hasNext → Enable/disable Next button

UI Display:
[Previous] Page 2 of 5 [Next]
  ↑         ↑      ↑      ↑
  enabled   page   total  enabled
```

#### Page Number Links
```
Components Use:
- pagination.page → Active page highlight
- pagination.totalPages → Generate page links

UI Display:
[1] [2] [3] [4] [5]
     ↑ Active page
```

#### Infinite Scroll
```
Components Use:
- pagination.hasNext → Load more data
- pagination.totalCount → Total items display

UI Behavior:
Scroll to bottom → Check hasNext → Load next page
```

#### Results Summary
```
Components Use:
- pagination.page → Calculate item range
- pagination.pageSize → Calculate item range
- pagination.totalCount → Total items

UI Display:
Showing 21-40 of 93 products
        ↑    ↑     ↑
      start end  total
```

### Django REST Framework PageNumberPagination

This type aligns with DRF's PageNumberPagination response:

```
DRF Paginator Settings:
- page_size = 20
- page_size_query_param = 'page_size'
- max_page_size = 100

DRF Response Structure:
{
  "count": 93,              → totalCount
  "next": "...?page=3",     → hasNext (true if not null)
  "previous": "...?page=1", → hasPrevious (true if not null)
  "results": [...]          → data
}

Frontend Transform:
Map DRF format to PaginatedResponse<T> type
Extract pagination metadata
Calculate derived fields
```

### Expected Outcome
- PaginatedResponse<T> type defined
- Complete pagination metadata
- Supports various pagination UIs
- DRF-compatible structure

### Verification Checklist
- [ ] PaginatedResponse interface exported
- [ ] Generic <T> parameter for items
- [ ] data property is T[] array
- [ ] pagination object defined
- [ ] All pagination fields included
- [ ] Type documented with JSDoc
- [ ] Compatible with DRF responses

---

## Task 11: Create APIError Type

### Overview
Create an APIError type that standardizes error responses from the backend. This type ensures consistent error handling, provides structured field-level error information, and aligns with Django REST Framework's error response format.

### Dependencies
- Task 08: Create Type Definitions

### Instructions

1. **Define APIError interface**
   - Open types/api.ts
   - Export interface named APIError
   - No generic parameter needed

2. **Add code property**
   - Type: string
   - Contains error code identifier
   - Examples: 'validation_error', 'not_found', 'unauthorized'

3. **Add message property**
   - Type: string
   - Human-readable error message
   - Displayed to users

4. **Add details property**
   - Type: Record<string, string[]> (optional)
   - Contains field-level validation errors
   - Maps field name to error messages array

5. **Add timestamp property**
   - Type: string
   - ISO 8601 formatted timestamp
   - When error occurred

6. **Add type documentation**
   - Document error structure
   - Explain when errors occur
   - Provide examples for each error type

### APIError Structure

```
Type Definition:
interface APIError {
  code: string                          ← Error code identifier
  message: string                       ← Main error message
  details?: Record<string, string[]>    ← Field-level errors (optional)
  timestamp: string                     ← ISO timestamp
}
```

### Error Property Details

#### code Property
```
Type: string
Purpose: Identifies error category
Usage: Error handling logic, logging
Examples:
  - 'validation_error'
  - 'not_found'
  - 'unauthorized'
  - 'forbidden'
  - 'server_error'
```

#### message Property
```
Type: string
Purpose: Human-readable error description
Usage: Display to users in UI
Examples:
  - "Invalid input data"
  - "Resource not found"
  - "Authentication required"
  - "Permission denied"
```

#### details Property
```
Type: Record<string, string[]> | undefined
Purpose: Field-specific validation errors
Usage: Show errors next to form fields
Structure: { fieldName: [error1, error2, ...] }
Examples:
  - { email: ["Invalid email format"] }
  - { price: ["Must be positive", "Required"] }
```

#### timestamp Property
```
Type: string
Purpose: Error occurrence time
Format: ISO 8601
Example: "2026-01-25T10:30:00Z"
```

### Error Response Examples

#### Example 1: Validation Error
```
Scenario: Invalid product creation

Error Response:
{
  code: "validation_error",
  message: "Invalid input data",
  details: {
    name: ["This field is required"],
    price: ["Must be a positive number"],
    sku: ["SKU already exists"]
  },
  timestamp: "2026-01-25T10:30:00Z"
}

UI Display:
Name: [___________] ← "This field is required"
Price: [___________] ← "Must be a positive number"
SKU: [___________] ← "SKU already exists"
```

#### Example 2: Not Found Error
```
Scenario: Product ID doesn't exist

Error Response:
{
  code: "not_found",
  message: "Product with ID 999 not found",
  timestamp: "2026-01-25T10:30:00Z"
}

No details property (not applicable)

UI Display:
Toast: "Product with ID 999 not found"
```

#### Example 3: Authentication Error
```
Scenario: Token expired

Error Response:
{
  code: "unauthorized",
  message: "Authentication credentials are invalid or expired",
  timestamp: "2026-01-25T10:30:00Z"
}

UI Action:
Redirect to login page
Show message: "Session expired, please log in again"
```

#### Example 4: Permission Error
```
Scenario: User lacks permission

Error Response:
{
  code: "forbidden",
  message: "You do not have permission to perform this action",
  timestamp: "2026-01-25T10:30:00Z"
}

UI Display:
Alert: "Access denied: You do not have permission to perform this action"
```

#### Example 5: Server Error
```
Scenario: Internal server error

Error Response:
{
  code: "server_error",
  message: "An unexpected error occurred. Please try again later.",
  timestamp: "2026-01-25T10:30:00Z"
}

UI Display:
Error modal with retry button
Log error for debugging
```

### Common Error Codes

| Code | HTTP Status | Description | Has Details? |
|------|-------------|-------------|--------------|
| validation_error | 400 | Invalid input data | Yes (field errors) |
| not_found | 404 | Resource doesn't exist | No |
| unauthorized | 401 | Not authenticated | No |
| forbidden | 403 | Not authorized | No |
| server_error | 500 | Internal error | No |
| conflict | 409 | Resource conflict | Sometimes |
| rate_limit | 429 | Too many requests | No |

### Django REST Framework Error Mapping

DRF error responses map to APIError type:

```
DRF ValidationError:
{
  "name": ["This field is required"],
  "price": ["Must be positive"]
}

Mapped to APIError:
{
  code: "validation_error",
  message: "Invalid input data",
  details: {
    name: ["This field is required"],
    price: ["Must be positive"]
  },
  timestamp: "2026-01-25T10:30:00Z"
}
```

### Error Handling Pattern

```
Error Response Flow:
1. Backend throws error
2. Error interceptor catches
3. Maps to APIError type
4. Component receives typed error
5. Display appropriate message
```

### Field-Level Error Display

```
Form Validation:
- Check error.details exists
- Iterate over field names
- Match field to form input
- Display errors below input

Example:
if (error.details?.email) {
  // Show error.details.email array
  // Below email input field
}
```

### Expected Outcome
- APIError type defined
- Supports general and field errors
- Consistent error structure
- DRF-compatible format

### Verification Checklist
- [ ] APIError interface exported
- [ ] code property string
- [ ] message property string
- [ ] details property optional Record
- [ ] timestamp property string
- [ ] Type documented with JSDoc
- [ ] Examples cover common scenarios

---

## Task 12: Create RequestConfig Type

### Overview
Create a RequestConfig type that extends Axios request configuration with commonly used options. This type provides type-safe request configuration for API calls, enabling easy customization of headers, timeouts, and other request parameters.

### Dependencies
- Task 08: Create Type Definitions
- Task 01: Axios installed

### Instructions

1. **Import Axios types**
   - At top of types/api.ts
   - Import AxiosRequestConfig from 'axios'
   - Use as base for custom config type

2. **Define RequestConfig type**
   - Export type alias named RequestConfig
   - Extend AxiosRequestConfig
   - Add custom properties if needed

3. **Document common config options**
   - Add JSDoc comment
   - List frequently used properties
   - Provide usage examples

### RequestConfig Structure

```
Type Definition:
import { AxiosRequestConfig } from 'axios';

export type RequestConfig = AxiosRequestConfig;
```

### Why Extend AxiosRequestConfig?

| Reason | Benefit |
|--------|---------|
| Type Safety | Compile-time checking |
| Autocomplete | IDE suggestions |
| Documentation | Built-in property docs |
| Flexibility | All Axios options available |
| Future Extensibility | Can add custom properties |

### Common RequestConfig Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| headers | Record<string, string> | Custom headers | { 'X-Custom': 'value' } |
| params | Record<string, any> | URL query parameters | { page: 2, search: 'term' } |
| timeout | number | Request timeout override | 60000 |
| responseType | string | Expected response type | 'blob' for files |
| signal | AbortSignal | Request cancellation | abortController.signal |

### Usage Examples

#### Example 1: Custom Headers
```
Use Case: Add authorization header

Config:
const config: RequestConfig = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

API Call:
apiClient.get('/products', config);
```

#### Example 2: Query Parameters
```
Use Case: Paginated list with filters

Config:
const config: RequestConfig = {
  params: {
    page: 2,
    page_size: 20,
    category: 'electronics',
    min_price: 100
  }
};

API Call:
apiClient.get('/products', config);

Result URL:
/products?page=2&page_size=20&category=electronics&min_price=100
```

#### Example 3: Extended Timeout
```
Use Case: Long-running report generation

Config:
const config: RequestConfig = {
  timeout: 60000  // 60 seconds
};

API Call:
apiClient.post('/reports/generate', reportData, config);
```

#### Example 4: File Download
```
Use Case: Download product export

Config:
const config: RequestConfig = {
  responseType: 'blob'
};

API Call:
const response = await apiClient.get('/products/export', config);
// response.data is Blob
```

#### Example 5: Request Cancellation
```
Use Case: Cancel search on new input

Setup:
const abortController = new AbortController();

Config:
const config: RequestConfig = {
  signal: abortController.signal
};

API Call:
apiClient.get('/search', config);

Cancel:
abortController.abort();  // Cancels request
```

### Full AxiosRequestConfig Options (Reference)

| Category | Properties |
|----------|-----------|
| URL | url, baseURL, params |
| Method | method |
| Data | data, transformRequest |
| Headers | headers |
| Response | responseType, transformResponse |
| Timeout | timeout, timeoutErrorMessage |
| Credentials | withCredentials, auth |
| Progress | onUploadProgress, onDownloadProgress |
| Cancellation | signal, cancelToken (deprecated) |
| Validation | validateStatus |
| Proxy | proxy |
| Adapters | adapter |

### Type Safety Benefits

```
Without RequestConfig:
apiClient.get('/products', { hedaers: { ... } });
                             ↑ Typo not caught

With RequestConfig:
const config: RequestConfig = {
  hedaers: { ... }  ← TypeScript error: unknown property
};
```

### Future Extensibility

Can add custom properties in the future:

```
Extended Type:
export interface CustomRequestConfig extends AxiosRequestConfig {
  retry?: boolean;           ← Custom retry flag
  retryAttempts?: number;    ← Max retry attempts
  cache?: boolean;           ← Enable caching
  cacheTimeout?: number;     ← Cache duration
}

export type RequestConfig = CustomRequestConfig;
```

### Expected Outcome
- RequestConfig type defined
- Extends AxiosRequestConfig
- Type-safe request configuration
- Supports all Axios options

### Verification Checklist
- [ ] AxiosRequestConfig imported
- [ ] RequestConfig type exported
- [ ] Type documented with JSDoc
- [ ] Type usage verified in test
- [ ] IDE autocomplete works
- [ ] No TypeScript errors

---

## Task 13: Create API Client Factory

### Overview
Create a factory function (createApiClient) that generates custom Axios instances with configurable settings. This enables module-specific clients with different base URLs, timeouts, or interceptors while maintaining the same base configuration patterns.

### Dependencies
- Task 03: Create Base API Client
- Task 12: Create RequestConfig Type

### Instructions

1. **Open apiClient.ts file**
   - Navigate to services/api/apiClient.ts
   - Add factory function after base client

2. **Define factory function signature**
   - Name: createApiClient
   - Parameters: config (optional partial Axios config)
   - Returns: AxiosInstance

3. **Implement factory function**
   - Create new Axios instance using axios.create()
   - Merge provided config with base defaults
   - Return configured instance

4. **Document factory purpose**
   - Add JSDoc comment
   - Explain when to use factory vs base client
   - Provide usage examples

5. **Export factory function**
   - Add named export
   - Available alongside base client
   - Enables custom instance creation

### Factory Function Structure

```
Function Signature:
function createApiClient(
  config?: Partial<AxiosRequestConfig>
): AxiosInstance

Purpose:
- Create isolated Axios instances
- Custom configuration per instance
- Independent interceptors
- Module-specific settings
```

### Factory Implementation Pattern

```
Implementation Steps:
1. Define function with optional config parameter
2. Create default configuration object
3. Merge base config with provided config
4. Call axios.create() with merged config
5. Return new AxiosInstance
```

### Factory vs Base Client

| Aspect | Base Client | Factory-Created Client |
|--------|-------------|----------------------|
| Instance | Single shared instance | Multiple isolated instances |
| Use Case | General API calls | Module-specific needs |
| Config | Fixed at initialization | Customized per creation |
| Interceptors | Shared by all | Independent per instance |
| Base URL | Single backend | Can vary (microservices) |

### Factory Use Cases

#### Use Case 1: Different Base URL
```
Scenario: Separate authentication service

Factory Usage:
const authClient = createApiClient({
  baseURL: 'https://auth.example.com/api'
});

Why Factory:
- Auth service on different domain
- Different base URL needed
- Isolated from main API client
```

#### Use Case 2: Extended Timeout
```
Scenario: File upload service

Factory Usage:
const uploadClient = createApiClient({
  timeout: 120000,  // 2 minutes
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

Why Factory:
- File uploads take longer
- Need extended timeout
- Different content type
```

#### Use Case 3: Module-Specific Interceptors
```
Scenario: Analytics module with custom logging

Factory Usage:
const analyticsClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Add analytics-specific interceptor
analyticsClient.interceptors.request.use(logRequest);

Why Factory:
- Analytics needs request logging
- Don't want to log all requests
- Isolated interceptor
```

#### Use Case 4: Microservices Architecture
```
Scenario: Multiple backend services

Factory Usage:
const productClient = createApiClient({
  baseURL: 'https://products.example.com/api'
});

const orderClient = createApiClient({
  baseURL: 'https://orders.example.com/api'
});

const inventoryClient = createApiClient({
  baseURL: 'https://inventory.example.com/api'
});

Why Factory:
- Different services, different URLs
- Each service may need different config
- Isolated clients per service
```

### Configuration Merging

```
Merge Strategy:
1. Start with base defaults (base URL, timeout, etc.)
2. Override with factory config parameter
3. Deep merge for nested objects (headers)
4. Create new instance with merged config

Example:
Base: { timeout: 30000, headers: { 'Accept': 'application/json' } }
Factory: { timeout: 60000, headers: { 'X-Custom': 'value' } }
Result: { timeout: 60000, headers: { 'Accept': 'application/json', 'X-Custom': 'value' } }
```

### Factory Function Documentation

```
JSDoc Template:
/**
 * Creates a custom API client instance with optional configuration
 * 
 * @param config - Optional Axios configuration overrides
 * @returns Configured Axios instance
 * 
 * @example
 * // Create client with extended timeout
 * const uploadClient = createApiClient({ timeout: 60000 });
 * 
 * @example
 * // Create client with different base URL
 * const authClient = createApiClient({
 *   baseURL: 'https://auth.example.com/api'
 * });
 */
```

### When to Use Factory

| Situation | Use Factory? | Reason |
|-----------|-------------|--------|
| Standard API calls | No | Use base client |
| Different base URL | Yes | Factory with custom baseURL |
| Extended timeout | Yes | Factory with custom timeout |
| Custom headers | Maybe | Can use config in request |
| Module interceptors | Yes | Isolated instance needed |
| File uploads | Yes | Different timeout/headers |
| Third-party API | Yes | Different base URL |

### Expected Outcome
- createApiClient factory function created
- Accepts optional configuration
- Returns configured Axios instance
- Enables custom client creation

### Verification Checklist
- [ ] createApiClient function defined
- [ ] Accepts optional config parameter
- [ ] Returns AxiosInstance
- [ ] Merges config properly
- [ ] Function documented
- [ ] Named export added
- [ ] Test custom instance creation

---

## Task 14: Verify API Client Setup

### Overview
Perform comprehensive verification of the complete API client setup. This includes testing the base client, verifying type definitions, confirming factory function, and ensuring the entire HTTP client layer is ready for integration with authentication and interceptors.

### Dependencies
- All previous tasks in Group A (01-13)

### Instructions

1. **Verify file structure**
   - Confirm all files created
   - Check directory organization
   - Ensure imports work correctly

2. **Verify base client configuration**
   - Review apiClient.ts
   - Confirm all config properties set
   - Check exports present

3. **Verify type definitions**
   - Review types/api.ts
   - Confirm all types exported
   - Check type usage in IDE

4. **Test basic request**
   - Create simple test file or component
   - Make GET request to backend
   - Verify request succeeds

5. **Verify TypeScript compilation**
   - Run TypeScript compiler
   - Check for type errors
   - Resolve any issues

6. **Document setup completion**
   - List completed components
   - Note any issues found
   - Prepare for next group

### Verification Checklist

#### File Structure
```
Expected Structure:
frontend/
├── services/
│   └── api/
│       └── apiClient.ts      ← Base client and factory
└── types/
    └── api.ts                ← Type definitions
```

- [ ] services/api/ directory exists
- [ ] apiClient.ts file present
- [ ] types/ directory exists
- [ ] types/api.ts file present

#### Base Client Configuration
- [ ] Axios imported
- [ ] Base client instance created
- [ ] baseURL configured with env variable
- [ ] Default headers set (Content-Type, Accept)
- [ ] timeout set to 30000ms
- [ ] withCredentials set to true
- [ ] Default export present
- [ ] Named export present

#### Type Definitions
- [ ] APIResponse<T> type exported
- [ ] data property generic
- [ ] message property optional
- [ ] timestamp property present
- [ ] PaginatedResponse<T> type exported
- [ ] data property array of T
- [ ] pagination metadata complete
- [ ] APIError type exported
- [ ] code, message, timestamp present
- [ ] details property optional
- [ ] RequestConfig type exported

#### Factory Function
- [ ] createApiClient function defined
- [ ] Accepts optional config parameter
- [ ] Returns AxiosInstance
- [ ] Named export present
- [ ] Function documented

### Basic Request Test

#### Test File Creation
```
Location: tests/apiClient.test.ts (or similar)

Purpose:
- Verify client can make requests
- Check response structure
- Confirm types work correctly
```

#### Test Implementation Steps
1. Import apiClient
2. Make simple GET request
3. Log response structure
4. Verify response matches APIResponse type
5. Handle errors

#### Test Request Example (Conceptual)
```
Test Flow:
1. Import: import apiClient from '@/services/api/apiClient'
2. Request: const response = await apiClient.get('/health')
3. Verify: response.data structure matches expectations
4. Types: TypeScript validates response type
5. Success: No errors, types correct
```

### TypeScript Compilation Check

#### Compilation Commands
```
Command: pnpm tsc --noEmit
Purpose: Check for TypeScript errors without building
Location: Run from frontend/ directory
```

#### Expected Results
```
Success:
- No errors reported
- All types resolved
- Imports valid

If Errors:
- Review error messages
- Fix type issues
- Re-run compilation
```

### Configuration Verification

| Configuration | Expected Value | Verify Method |
|---------------|---------------|---------------|
| baseURL | process.env.NEXT_PUBLIC_API_URL | Check apiClient.ts |
| timeout | 30000 | Check apiClient.ts |
| Content-Type | application/json | Check headers config |
| Accept | application/json | Check headers config |
| withCredentials | true | Check apiClient.ts |

### Type Export Verification

```
Test Imports (in test file):
import type {
  APIResponse,
  PaginatedResponse,
  APIError,
  RequestConfig
} from '@/types/api';

IDE Behavior:
- Autocomplete suggests types
- No import errors
- Type definitions visible
```

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Import errors | Path alias not configured | Update tsconfig.json paths |
| Type errors | Missing type exports | Add exports to types/api.ts |
| Runtime errors | Env variable not set | Create .env.local with API URL |
| CORS errors | Backend not configured | Configure Django CORS (later) |
| 404 errors | Backend not running | Start Django dev server |

### Next Steps Preparation

After verification complete, ready for:
- Group B: Authentication and token management
- Group C: Request/response interceptors
- Group D: Error handling and retry logic
- Group E: Module-specific API services
- Group F: API utilities and documentation

### Verification Report

Document verification results:

```
Verification Report:
✅ Files created and organized
✅ Base client configured
✅ Types defined and exported
✅ Factory function implemented
✅ TypeScript compilation successful
✅ Basic request test passed
✅ Ready for Group B

Issues Found: [None / List any]
Notes: [Any observations]
```

### Expected Outcome
- Complete HTTP client layer verified
- All components working correctly
- TypeScript types validated
- Foundation ready for next group

### Final Verification Checklist
- [ ] All files created
- [ ] Base client configured
- [ ] Types defined
- [ ] Factory function works
- [ ] TypeScript compiles
- [ ] Basic request succeeds
- [ ] Documentation updated
- [ ] Ready for authentication layer

---

## Summary

This document completed the HTTP client setup by creating comprehensive TypeScript type definitions, implementing a flexible factory function, and verifying the entire setup. The API client layer now has:

✅ types/api.ts created  
✅ APIResponse<T> generic type  
✅ PaginatedResponse<T> type with metadata  
✅ APIError type for error handling  
✅ RequestConfig type for configurations  
✅ createApiClient factory function  
✅ Complete setup verified and tested  

The foundation is now ready for authentication token management (Group B), request/response interceptors (Group C), and error handling with retry logic (Group D).
