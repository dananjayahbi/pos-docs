# Tasks 51-60: Base Action Handlers (Order, Product, Return)

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** D - Action Handlers  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-C_Entity-Extraction](../Group-C_Entity-Extraction/)
- **→ Next Document:** [02_Tasks-61-68_Shipping-Store-Escalation-Registry.md](02_Tasks-61-68_Shipping-Store-Escalation-Registry.md)

---

## Document Overview

This document covers the creation of the base action handler architecture and implementation of three core handlers: OrderStatusHandler, ProductInfoHandler, and ReturnHandler. It establishes the foundational abstract base class pattern, defines the structured response format, and implements handlers for the most common customer service intents in an e-commerce chatbot.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create ActionHandler ABC | Medium | 30 min |
| 52 | Create handle Abstract | Low | 15 min |
| 53 | Create ActionResponse | Low | 20 min |
| 54 | Create OrderStatusHandler | High | 45 min |
| 55 | Create get_order_status | Medium | 30 min |
| 56 | Create format_order_response | Low | 20 min |
| 57 | Create ProductInfoHandler | Medium | 35 min |
| 58 | Create get_product_info | Medium | 30 min |
| 59 | Create ReturnHandler | Medium | 35 min |
| 60 | Create get_return_policy | Low | 20 min |

---

## Task 51: Create ActionHandler ABC

### Overview
Create the ActionHandler abstract base class that serves as the foundation for all intent-specific action handlers. This ABC defines the common interface that all handlers must implement, ensuring consistent behavior across different intent types. The ActionHandler uses the Strategy pattern to enable polymorphic handling of different customer intents.

### Dependencies
- Task 50: Create conversation manager
- Django chatbot app is initialized
- Intent classification is implemented

### Instructions

1. **Navigate to handlers directory**
   - Go to `backend/apps/chatbot/handlers/` directory
   - If directory doesn't exist, create it
   - This module contains all action handler classes

2. **Create base.py file**
   - Create new file named `base.py`
   - This file contains the abstract base class
   - Import ABC and abstractmethod from abc module

3. **Import required dependencies**
   - Import ABC and abstractmethod from abc
   - Import dataclasses for ActionResponse
   - Import typing for type hints (Dict, Any, Optional)
   - Import logging for handler logging

4. **Define ActionHandler ABC**
   - Create class ActionHandler that inherits from ABC
   - Add class-level docstring explaining handler purpose
   - Define `intent_name` as class attribute (str type)
   - This attribute identifies which intent the handler processes

5. **Add constructor method**
   - Define `__init__` method accepting tenant parameter
   - Store tenant instance for tenant-specific operations
   - Initialize logger for this handler
   - Set up any shared handler resources

6. **Define abstract handle method**
   - Declare abstract method signature (implementation in Task 52)
   - Method will accept intent, entities, and context
   - Return type will be ActionResponse
   - Add comprehensive docstring

7. **Add helper methods**
   - Create `_log_action` method for logging handler invocations
   - Create `_validate_entities` method for entity validation
   - Create `_get_tenant_config` method for accessing tenant settings
   - These methods support concrete handler implementations

8. **Document handler lifecycle**
   - Add comments explaining handler instantiation
   - Document how handlers are registered
   - Explain handler invocation flow
   - Note error handling expectations

### Handler Design Pattern

| Pattern | Description |
|---------|-------------|
| Strategy | Encapsulates intent-specific behavior |
| Template | Defines common handler structure |
| Polymorphism | All handlers share common interface |
| Registry | Handlers registered by intent name |

### ActionHandler Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Intent Processing | Execute logic for specific intent |
| Entity Access | Extract required entities from extraction results |
| Tenant Context | Access tenant-specific configuration |
| Response Formatting | Create structured ActionResponse |
| Error Handling | Handle and log handler-specific errors |

### Class Structure Overview
```
ActionHandler (ABC)
├── Class Attributes
│   └── intent_name: str
├── Constructor
│   └── __init__(tenant)
├── Abstract Methods
│   └── handle(intent, entities, context)
└── Helper Methods
    ├── _log_action(action, details)
    ├── _validate_entities(required_entities)
    └── _get_tenant_config(key)
```

### Expected Outcome
- ActionHandler ABC created in base.py
- Clear interface for all intent handlers
- Helper methods for common operations
- Foundation for handler implementations

### Verification Checklist
- [ ] base.py file created in handlers directory
- [ ] ActionHandler inherits from ABC
- [ ] intent_name class attribute defined
- [ ] Constructor accepts tenant parameter
- [ ] Helper methods implemented
- [ ] Comprehensive docstrings added

---

## Task 52: Create handle Abstract Method

### Overview
Define the abstract handle method in the ActionHandler ABC. This method signature establishes the contract that all concrete handler implementations must fulfill. The handle method is the core processing function that takes classified intent, extracted entities, and conversation context to produce an appropriate action response.

### Dependencies
- Task 51: Create ActionHandler ABC

### Instructions

1. **Open base.py file**
   - Navigate to `backend/apps/chatbot/handlers/base.py`
   - Locate the ActionHandler class definition
   - Position cursor in class body for method addition

2. **Add abstractmethod decorator**
   - Import abstractmethod decorator from abc
   - Apply decorator to handle method
   - This enforces implementation in subclasses

3. **Define handle method signature**
   - Method name: `handle`
   - Parameter 1: `intent` (Intent object)
   - Parameter 2: `entities` (Dict[str, Any])
   - Parameter 3: `context` (ConversationContext)
   - Return type: ActionResponse

4. **Document method parameters**
   - intent: Classified intent object with name and confidence
   - entities: Dictionary of extracted entity key-value pairs
   - context: Conversation context including history and user info
   - Explain how each parameter is used

5. **Add comprehensive docstring**
   - Describe method purpose
   - Document all parameters with types
   - Explain return value structure
   - Include usage example in docstring
   - Note exceptions that may be raised

6. **Define method behavior contract**
   - Handler must validate required entities
   - Handler must access necessary data sources
   - Handler must construct ActionResponse
   - Handler must log action execution
   - Handler must handle errors gracefully

### Method Signature Details

| Element | Specification |
|---------|--------------|
| Method Name | handle |
| Decorator | @abstractmethod |
| Parameter 1 | intent: Intent |
| Parameter 2 | entities: Dict[str, Any] |
| Parameter 3 | context: ConversationContext |
| Return Type | ActionResponse |
| Raises | ValueError, PermissionError, NotFoundError |

### Handle Method Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Entity Validation | Ensure required entities are present |
| Data Retrieval | Fetch data from Django models |
| Business Logic | Execute intent-specific operations |
| Response Construction | Build ActionResponse with appropriate fields |
| Error Handling | Catch and appropriately handle exceptions |

### Expected Outcome
- Abstract handle method defined with proper signature
- All parameters documented with types
- Return type clearly specified
- Contract for subclass implementation established

### Verification Checklist
- [ ] @abstractmethod decorator applied
- [ ] Method signature matches specification
- [ ] All parameters have type hints
- [ ] Return type specified
- [ ] Comprehensive docstring added
- [ ] Contract documented in comments

---

## Task 53: Create ActionResponse Dataclass

### Overview
Create the ActionResponse dataclass that represents the structured output of action handlers. This dataclass standardizes the format of handler responses, ensuring consistent data structure for the conversation manager to process and return to the client. ActionResponse includes message text, additional data, follow-up prompts, and UI action suggestions.

### Dependencies
- Task 52: Create handle Abstract Method

### Instructions

1. **Open base.py file**
   - Navigate to `backend/apps/chatbot/handlers/base.py`
   - Position at top of file after imports
   - ActionResponse should be defined before ActionHandler

2. **Import dataclass decorator**
   - Import dataclass from dataclasses module
   - Import field and default_factory if needed
   - Import List, Dict, Optional from typing

3. **Define ActionResponse dataclass**
   - Use @dataclass decorator
   - Class name: ActionResponse
   - Make class frozen=False for flexibility
   - Add class-level docstring

4. **Add message field**
   - Field name: message
   - Type: str
   - Purpose: Human-readable response text
   - This is shown directly to the user
   - Required field (no default)

5. **Add data field**
   - Field name: data
   - Type: Optional[Dict[str, Any]]
   - Default: None
   - Purpose: Structured data for UI rendering
   - Contains order details, product info, etc.

6. **Add follow_up field**
   - Field name: follow_up
   - Type: Optional[str]
   - Default: None
   - Purpose: Suggested next question or prompt
   - Guides conversation flow

7. **Add actions field**
   - Field name: actions
   - Type: Optional[List[Dict[str, Any]]]
   - Default: None
   - Purpose: UI actions (buttons, links)
   - Examples: "View Order", "Track Shipment"

8. **Add success field**
   - Field name: success
   - Type: bool
   - Default: True
   - Purpose: Indicates if action succeeded
   - Used for error handling

9. **Add error_message field**
   - Field name: error_message
   - Type: Optional[str]
   - Default: None
   - Purpose: Error details when success=False
   - Helps with troubleshooting

10. **Add helper methods**
    - Create `to_dict()` method for JSON serialization
    - Create `from_dict()` class method for deserialization
    - Add validation for required fields

11. **Document response structure**
    - Add examples in docstring
    - Document all fields comprehensively
    - Explain usage patterns
    - Note UI integration points

### ActionResponse Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | str | Yes | Human-readable response text |
| data | Dict[str, Any] | No | Structured data for UI |
| follow_up | str | No | Suggested next question |
| actions | List[Dict] | No | UI action buttons |
| success | bool | Yes (default True) | Action success status |
| error_message | str | No | Error details if failed |

### Response Usage Examples

| Use Case | Fields Used |
|----------|-------------|
| Simple Text | message only |
| Order Status | message + data (order details) + actions (track) |
| Product Info | message + data (product) + follow_up (ask about purchase) |
| Error | message + success=False + error_message |
| Escalation | message + actions (contact agent button) |

### Data Field Structure Examples

**Order Status Data:**
| Key | Value Example |
|-----|---------------|
| order_id | "ORD-12345" |
| status | "shipped" |
| tracking_number | "LK123456789" |
| estimated_delivery | "2024-01-15" |

**Product Info Data:**
| Key | Value Example |
|-----|---------------|
| product_id | 42 |
| name | "Wireless Mouse" |
| price | 1500.00 |
| currency | "LKR" |
| stock_status | "in_stock" |

### Actions Field Structure

| Field | Type | Description |
|-------|------|-------------|
| type | str | Action type: "button", "link", "external" |
| label | str | Button/link text |
| action | str | Action identifier |
| data | Dict | Action-specific data |

### Expected Outcome
- ActionResponse dataclass fully defined
- All fields properly typed and documented
- Helper methods for serialization
- Clear examples in documentation

### Verification Checklist
- [ ] @dataclass decorator applied
- [ ] All six fields defined with types
- [ ] Default values set appropriately
- [ ] to_dict() method implemented
- [ ] from_dict() class method implemented
- [ ] Comprehensive docstring with examples
- [ ] Field validation added

---

## Task 54: Create OrderStatusHandler

### Overview
Create the OrderStatusHandler class that processes ORDER_STATUS intents. This handler is responsible for retrieving order information, verifying customer ownership, formatting order details, and providing tracking information. OrderStatusHandler is one of the most critical handlers as order status inquiries are among the most common customer service requests.

### Dependencies
- Task 53: Create ActionResponse
- Order model exists in ERP core modules
- Customer authentication is implemented

### Instructions

1. **Create order_status.py file**
   - Navigate to `backend/apps/chatbot/handlers/` directory
   - Create new file named `order_status.py`
   - This module contains OrderStatusHandler implementation

2. **Import required dependencies**
   - Import ActionHandler and ActionResponse from base
   - Import Order model from ERP orders app
   - Import Customer model from authentication
   - Import Django exceptions (ObjectDoesNotExist, PermissionDenied)
   - Import typing utilities

3. **Define OrderStatusHandler class**
   - Create class that inherits from ActionHandler
   - Set intent_name class attribute to "ORDER_STATUS"
   - Add class docstring explaining handler purpose
   - Document expected entities: order_id or order_number

4. **Implement handle method**
   - Override abstract handle method from ActionHandler
   - Accept intent, entities, and context parameters
   - Extract order identifier from entities
   - Validate that order_id or order_number exists
   - Return appropriate error response if missing

5. **Extract order identifier**
   - Check entities dict for 'order_id' key
   - Check entities dict for 'order_number' key
   - Accept either format (ID or number)
   - Normalize to consistent format
   - Log entity extraction

6. **Retrieve customer from context**
   - Access user information from context
   - Verify user is authenticated
   - Get associated customer object
   - Handle anonymous users appropriately
   - Return error if customer not found

7. **Call get_order_status method**
   - Invoke get_order_status with order identifier and customer
   - Pass tenant context for multi-tenancy
   - Handle exceptions from get_order_status
   - Log order retrieval attempt

8. **Handle retrieval errors**
   - Catch ObjectDoesNotExist for order not found
   - Catch PermissionDenied for unauthorized access
   - Return user-friendly error messages
   - Log errors with appropriate severity
   - Provide helpful suggestions in error response

9. **Format successful response**
   - Call format_order_response method (Task 56)
   - Construct ActionResponse with formatted message
   - Include order data in data field
   - Add relevant actions (track shipment, view details)
   - Add follow-up question if appropriate

10. **Add tracking actions**
    - If order is shipped, include tracking action
    - Create "Track Shipment" button with tracking URL
    - Add "View Order Details" action
    - Include "Contact Support" option
    - Structure actions according to order status

### OrderStatusHandler Structure

```
OrderStatusHandler(ActionHandler)
├── Class Attributes
│   └── intent_name = "ORDER_STATUS"
├── Methods
│   ├── handle(intent, entities, context) → ActionResponse
│   ├── get_order_status(order_id, customer) → Order
│   └── format_order_response(order) → str
└── Helper Methods
    ├── _validate_order_entity(entities)
    ├── _verify_customer_ownership(order, customer)
    └── _build_tracking_actions(order)
```

### Required Entities

| Entity | Type | Required | Description |
|--------|------|----------|-------------|
| order_id | int | Yes* | Numeric order ID |
| order_number | str | Yes* | Order reference number |

*Either order_id or order_number must be present

### Error Scenarios

| Scenario | Response Action |
|----------|----------------|
| No order entity | Return error: "Please provide order number" |
| Order not found | Return error: "Order not found in our system" |
| Wrong customer | Return error: "Order belongs to different account" |
| Order in wrong tenant | Return error: "Order not found" (security) |

### Success Response Structure

| Field | Value |
|-------|-------|
| message | Formatted order status text |
| data.order_id | Order ID |
| data.status | Current status |
| data.tracking_number | Tracking code (if shipped) |
| data.estimated_delivery | ETA date |
| actions | [Track, View Details, Support] |

### Expected Outcome
- OrderStatusHandler class implemented
- handle method processes ORDER_STATUS intents
- Error handling for all scenarios
- Foundation for get_order_status method (Task 55)

### Verification Checklist
- [ ] order_status.py file created
- [ ] OrderStatusHandler inherits from ActionHandler
- [ ] intent_name set to "ORDER_STATUS"
- [ ] handle method implemented
- [ ] Entity validation implemented
- [ ] Customer verification implemented
- [ ] Error handling comprehensive
- [ ] ActionResponse properly constructed

---

## Task 55: Create get_order_status Method

### Overview
Create the get_order_status method within OrderStatusHandler that retrieves order details from the database. This method handles the actual data retrieval, performs authorization checks to ensure customers can only access their own orders, and applies tenant filtering for multi-tenancy support.

### Dependencies
- Task 54: Create OrderStatusHandler
- Order model with status tracking
- Multi-tenant database schema

### Instructions

1. **Open order_status.py file**
   - Navigate to OrderStatusHandler class
   - Locate method definitions section
   - Position after handle method

2. **Define get_order_status method**
   - Method name: get_order_status
   - Parameter 1: self
   - Parameter 2: order_identifier (str or int)
   - Parameter 3: customer (Customer object)
   - Return type: Order
   - Add method docstring

3. **Determine identifier type**
   - Check if order_identifier is integer or string
   - If integer, treat as order ID
   - If string, treat as order number
   - Log identifier type for debugging

4. **Build database query**
   - Start with Order.objects queryset
   - Filter by tenant using self.tenant
   - Add filter for order_identifier
   - Use Q objects for OR logic if needed
   - Select related fields to optimize queries

5. **Add customer authorization filter**
   - Filter orders by customer relationship
   - Ensure order belongs to requesting customer
   - This prevents unauthorized access
   - Critical for security and privacy

6. **Optimize query with prefetch**
   - Use select_related for foreign keys
   - Prefetch order items for complete data
   - Prefetch shipping information
   - Prefetch payment information
   - Reduces database queries

7. **Execute query and handle exceptions**
   - Call .get() to retrieve single order
   - Catch ObjectDoesNotExist exception
   - Raise custom OrderNotFoundError
   - Log unsuccessful retrieval attempts

8. **Verify order ownership**
   - Double-check customer matches order.customer
   - Even with filter, verify as security measure
   - Raise PermissionDenied if mismatch
   - Log security violations

9. **Check tenant isolation**
   - Verify order.tenant matches self.tenant
   - Critical for multi-tenant security
   - Raise error if tenant mismatch
   - Log tenant boundary violations

10. **Return order object**
    - Return the retrieved Order instance
    - Order includes all prefetched relationships
    - Ready for format_order_response method
    - Log successful retrieval

### Database Query Structure

| Query Component | Purpose |
|-----------------|---------|
| filter(tenant=self.tenant) | Tenant isolation |
| filter(Q(id=x) \| Q(number=x)) | Find by ID or number |
| filter(customer=customer) | Authorization check |
| select_related('customer', 'shipping_address') | Optimize FK lookups |
| prefetch_related('items', 'payments') | Optimize M2M lookups |

### Authorization Checks

| Check | Purpose | Exception |
|-------|---------|-----------|
| Tenant match | Multi-tenant isolation | PermissionDenied |
| Customer match | Order ownership | PermissionDenied |
| Order exists | Valid identifier | OrderNotFoundError |

### Order Fields Retrieved

| Field | Source | Description |
|-------|--------|-------------|
| id | Order.id | Primary key |
| order_number | Order.order_number | Display number |
| status | Order.status | Current order status |
| created_at | Order.created_at | Order date |
| total_amount | Order.total_amount | Order total |
| items | Order.items.all() | Order line items |
| shipping_address | Order.shipping_address | Delivery address |
| tracking_number | Order.tracking_number | Shipment tracking |
| estimated_delivery | Order.estimated_delivery | ETA date |

### Expected Outcome
- get_order_status method implemented
- Database query optimized with prefetch
- Authorization checks in place
- Multi-tenant security enforced

### Verification Checklist
- [ ] Method signature correct
- [ ] Tenant filter applied
- [ ] Customer authorization implemented
- [ ] Identifier type handling (ID vs number)
- [ ] Query optimization with select_related
- [ ] Query optimization with prefetch_related
- [ ] Exception handling comprehensive
- [ ] Security logging implemented

---

## Task 56: Create format_order_response Method

### Overview
Create the format_order_response method that converts Order model data into human-readable text. This method generates conversational responses that vary based on order status, include relevant details, and maintain a friendly, helpful tone. The formatted text is used as the message field in ActionResponse.

### Dependencies
- Task 55: Create get_order_status Method

### Instructions

1. **Open order_status.py file**
   - Navigate to OrderStatusHandler class
   - Position after get_order_status method
   - Prepare to add formatting method

2. **Define format_order_response method**
   - Method name: format_order_response
   - Parameter 1: self
   - Parameter 2: order (Order object)
   - Return type: str
   - Add method docstring

3. **Extract order details**
   - Get order_number for reference
   - Get status from order.status field
   - Get created_at date
   - Get total_amount
   - Get tracking_number if available

4. **Create status-specific templates**
   - Define template for PENDING status
   - Define template for PROCESSING status
   - Define template for SHIPPED status
   - Define template for DELIVERED status
   - Define template for CANCELLED status
   - Define template for REFUNDED status

5. **Build pending status response**
   - Message: Order received and being prepared
   - Include order number and date
   - Set expectation for processing time
   - Provide reassurance

6. **Build processing status response**
   - Message: Order is being prepared
   - Include order number
   - Mention packing and quality checks
   - Provide estimated shipping date

7. **Build shipped status response**
   - Message: Order is on the way
   - Include order number
   - Include tracking number prominently
   - Include estimated delivery date
   - Add tracking instructions

8. **Build delivered status response**
   - Message: Order successfully delivered
   - Include order number
   - Include delivery date
   - Thank customer
   - Offer help if issues exist

9. **Build cancelled/refunded responses**
   - Message: Status and reason
   - Include order number
   - Provide refund timeline if applicable
   - Offer support contact information

10. **Format monetary values**
    - Convert total_amount to currency string
    - Use tenant's currency from configuration
    - Format according to locale (Sri Lankan Rupees)
    - Include currency symbol (Rs.)

11. **Format dates**
    - Convert datetime to readable format
    - Use friendly format: "January 15, 2024"
    - Calculate relative dates: "2 days ago"
    - Format estimated delivery clearly

12. **Add item count information**
    - Count number of items in order
    - Include in response: "Your order of 3 items..."
    - Makes response more specific

13. **Handle missing data gracefully**
    - If tracking_number is null, omit from message
    - If estimated_delivery unknown, provide estimate
    - Never show null or None to user
    - Provide defaults for missing information

### Status Response Templates

**PENDING:**
| Component | Text |
|-----------|------|
| Greeting | Great news! |
| Status | Your order #{order_number} has been received |
| Details | Order total: Rs. {amount} |
| Timeline | Processing typically takes 1-2 business days |
| Closing | We'll notify you when it ships! |

**PROCESSING:**
| Component | Text |
|-----------|------|
| Greeting | Good news! |
| Status | Your order #{order_number} is being prepared |
| Details | Order of {count} items |
| Timeline | Expected to ship within 24 hours |
| Closing | You'll receive tracking info soon |

**SHIPPED:**
| Component | Text |
|-----------|------|
| Greeting | Your order is on the way! |
| Status | Order #{order_number} has been shipped |
| Tracking | Tracking number: {tracking_number} |
| ETA | Expected delivery: {estimated_delivery} |
| Action | Track your shipment at... |

**DELIVERED:**
| Component | Text |
|-----------|------|
| Greeting | Delivered! |
| Status | Order #{order_number} was delivered on {date} |
| Thanks | Thank you for shopping with us! |
| Support | Any issues? Let us know! |

### Expected Outcome
- format_order_response method implemented
- Status-specific templates created
- Human-friendly, conversational text
- All order details appropriately formatted

### Verification Checklist
- [ ] Method signature correct
- [ ] All order statuses handled
- [ ] Order number included in all responses
- [ ] Dates formatted properly
- [ ] Currency formatted properly
- [ ] Tracking number included when available
- [ ] Missing data handled gracefully
- [ ] Tone is friendly and helpful

---

## Task 57: Create ProductInfoHandler

### Overview
Create the ProductInfoHandler class that processes PRODUCT_INFO intents. This handler retrieves product details from the catalog, handles fuzzy matching for product names, formats product information for display, and suggests related products. ProductInfoHandler helps customers learn about products, check availability, and get pricing information.

### Dependencies
- Task 53: Create ActionResponse
- Product model exists in inventory module
- Product catalog is populated

### Instructions

1. **Create product_info.py file**
   - Navigate to `backend/apps/chatbot/handlers/` directory
   - Create new file named `product_info.py`
   - This module contains ProductInfoHandler implementation

2. **Import required dependencies**
   - Import ActionHandler and ActionResponse from base
   - Import Product model from inventory app
   - Import ProductVariant if variants supported
   - Import Django database functions for search
   - Import fuzzywuzzy or similar for fuzzy matching

3. **Define ProductInfoHandler class**
   - Create class that inherits from ActionHandler
   - Set intent_name class attribute to "PRODUCT_INFO"
   - Add class docstring
   - Document expected entities: product_name, product_id

4. **Implement handle method**
   - Override abstract handle method
   - Extract product identifier from entities
   - Validate that product_name or product_id exists
   - Return error response if no identifier provided

5. **Extract product identifier**
   - Check entities for 'product_name' key
   - Check entities for 'product_id' key
   - Check entities for 'sku' key as alternative
   - Prioritize exact ID over name search
   - Normalize product name (lowercase, strip whitespace)

6. **Call get_product_info method**
   - Invoke get_product_info with identifier
   - Pass tenant context
   - Handle exceptions from get_product_info
   - Log product search attempt

7. **Handle product not found**
   - If no product found, return helpful error
   - Suggest similar products if possible
   - Offer search suggestions
   - Provide category browsing option

8. **Format product information**
   - Extract product name, description
   - Extract price information
   - Extract stock status
   - Extract product images
   - Extract specifications/attributes

9. **Build ActionResponse**
   - Create message with product details
   - Include product data in data field
   - Add actions: "Add to Cart", "View Details"
   - Add follow-up about purchasing

10. **Add product actions**
    - Create "Add to Cart" action if in stock
    - Create "View Full Details" action
    - Create "View Similar Products" action
    - Include product ID in action data

11. **Handle out of stock products**
    - Clearly indicate if out of stock
    - Offer "Notify When Available" action
    - Suggest similar in-stock products
    - Provide estimated restock date if available

### ProductInfoHandler Structure

```
ProductInfoHandler(ActionHandler)
├── Class Attributes
│   └── intent_name = "PRODUCT_INFO"
├── Methods
│   ├── handle(intent, entities, context) → ActionResponse
│   ├── get_product_info(identifier) → Product
│   ├── _fuzzy_match_product(name) → List[Product]
│   └── _format_product_message(product) → str
└── Helper Methods
    ├── _extract_product_identifier(entities)
    ├── _format_price(amount, currency)
    └── _build_product_actions(product)
```

### Required Entities

| Entity | Type | Required | Description |
|--------|------|----------|-------------|
| product_name | str | Yes* | Product name or description |
| product_id | int | Yes* | Numeric product ID |
| sku | str | Yes* | Product SKU code |

*At least one identifier must be present

### Product Search Strategy

| Priority | Method | Description |
|----------|--------|-------------|
| 1 | Exact ID | Direct lookup by product_id |
| 2 | Exact SKU | Direct lookup by SKU |
| 3 | Exact Name | Case-insensitive name match |
| 4 | Fuzzy Match | Similarity search on name |
| 5 | Keyword Search | Search in name and description |

### Product Response Fields

| Field | Source | Description |
|-------|--------|-------------|
| name | Product.name | Product name |
| price | Product.price | Current price |
| currency | Tenant.currency | Currency code |
| stock_status | Product.stock_status | In stock / Out of stock |
| description | Product.short_description | Brief description |
| image_url | Product.primary_image.url | Product image |
| product_id | Product.id | For actions |

### Stock Status Messages

| Status | Message |
|--------|---------|
| IN_STOCK | "In stock and ready to ship!" |
| LOW_STOCK | "Only {quantity} left in stock" |
| OUT_OF_STOCK | "Currently out of stock" |
| PREORDER | "Available for pre-order" |
| DISCONTINUED | "This product is discontinued" |

### Expected Outcome
- ProductInfoHandler class implemented
- handle method processes PRODUCT_INFO intents
- Fuzzy matching for product names
- Foundation for get_product_info method (Task 58)

### Verification Checklist
- [ ] product_info.py file created
- [ ] ProductInfoHandler inherits from ActionHandler
- [ ] intent_name set to "PRODUCT_INFO"
- [ ] handle method implemented
- [ ] Entity extraction for multiple identifier types
- [ ] Error handling for product not found
- [ ] ActionResponse properly constructed
- [ ] Actions include Add to Cart when appropriate

---

## Task 58: Create get_product_info Method

### Overview
Create the get_product_info method within ProductInfoHandler that retrieves product details from the database. This method implements intelligent product search with exact matching, fuzzy matching, and keyword search fallback. It handles multi-tenant product isolation and optimizes queries for performance.

### Dependencies
- Task 57: Create ProductInfoHandler
- Product model with catalog data
- Search functionality configured

### Instructions

1. **Open product_info.py file**
   - Navigate to ProductInfoHandler class
   - Position after handle method
   - Prepare to add data retrieval method

2. **Define get_product_info method**
   - Method name: get_product_info
   - Parameter 1: self
   - Parameter 2: identifier (str or int)
   - Return type: Optional[Product]
   - Add method docstring

3. **Determine identifier type**
   - Check if identifier is integer (product ID)
   - Check if identifier matches SKU pattern
   - Otherwise treat as product name
   - Log identifier type for debugging

4. **Attempt exact ID lookup**
   - If identifier is integer, query by ID
   - Filter by tenant
   - Filter by active status
   - Return immediately if found

5. **Attempt exact SKU lookup**
   - If identifier matches SKU pattern
   - Query Product.objects.filter(sku=identifier)
   - Filter by tenant
   - Return if found

6. **Attempt exact name lookup**
   - Query with case-insensitive exact match
   - Use iexact lookup: name__iexact=identifier
   - Filter by tenant and active status
   - Return if single match found

7. **Implement fuzzy name matching**
   - Query products with similar names
   - Use trigram similarity or contains lookup
   - Use name__icontains for partial matches
   - Get top matches sorted by relevance

8. **Rank fuzzy matches**
   - Calculate similarity score for each product
   - Use fuzzywuzzy library or built-in Django TrigramSimilarity
   - Sort results by similarity score
   - Return best match if score above threshold (e.g., 0.7)

9. **Implement keyword search fallback**
   - If fuzzy match fails, search in description
   - Split identifier into keywords
   - Search across name and description fields
   - Use Q objects for complex queries

10. **Optimize query with prefetch**
    - Use select_related for category, brand
    - Prefetch images for product display
    - Prefetch variants if applicable
    - Prefetch stock information

11. **Apply tenant filtering**
    - Ensure all queries filter by self.tenant
    - Critical for multi-tenant isolation
    - Verify product belongs to tenant

12. **Handle no matches**
    - Return None if no product found
    - Log search attempt with identifier
    - Calling method will handle None return

### Search Priority Flow

```
Identifier Input
    │
    ├─> Is Integer? ──Yes──> Lookup by ID
    │                           │
    │                           ├─> Found? ──Yes──> Return Product
    │                           └─> Found? ──No───> Continue
    │
    ├─> Matches SKU? ──Yes──> Lookup by SKU
    │                           │
    │                           ├─> Found? ──Yes──> Return Product
    │                           └─> Found? ──No───> Continue
    │
    ├─> Exact Name? ──Yes──> Lookup by Exact Name
    │                           │
    │                           ├─> Found? ──Yes──> Return Product
    │                           └─> Found? ──No───> Continue
    │
    ├─> Fuzzy Match ──> Calculate Similarity
    │                           │
    │                           ├─> Score > 0.7? ──Yes──> Return Best Match
    │                           └─> Score < 0.7? ──No───> Continue
    │
    └─> Keyword Search ──> Search Name + Description
                            │
                            ├─> Found? ──Yes──> Return Best Match
                            └─> Found? ──No───> Return None
```

### Database Query Optimization

| Optimization | Purpose |
|--------------|---------|
| select_related('category') | Reduce queries for category FK |
| select_related('brand') | Reduce queries for brand FK |
| prefetch_related('images') | Load all images efficiently |
| prefetch_related('variants') | Load variants if needed |
| filter(is_active=True) | Show only active products |
| filter(tenant=self.tenant) | Multi-tenant isolation |

### Fuzzy Match Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Threshold | 0.7 | Minimum similarity score |
| Algorithm | Token Set Ratio | Handles word order differences |
| Max Results | 5 | Limit candidates for scoring |

### Product Fields Retrieved

| Field | Description |
|-------|-------------|
| id | Product primary key |
| name | Product name |
| sku | Stock keeping unit |
| price | Current selling price |
| description | Short description |
| category | Product category |
| brand | Product brand |
| stock_quantity | Available quantity |
| stock_status | Availability status |
| images | Product images |

### Expected Outcome
- get_product_info method implemented
- Multi-stage search strategy
- Fuzzy matching for user-friendly search
- Optimized database queries

### Verification Checklist
- [ ] Method signature correct
- [ ] Exact ID lookup implemented
- [ ] Exact SKU lookup implemented
- [ ] Exact name lookup implemented
- [ ] Fuzzy matching implemented
- [ ] Keyword search fallback implemented
- [ ] Tenant filtering on all queries
- [ ] Query optimization with select_related
- [ ] Query optimization with prefetch_related
- [ ] Proper return type (Optional[Product])

---

## Task 59: Create ReturnHandler

### Overview
Create the ReturnHandler class that processes RETURNS intents. This handler manages product return inquiries, provides return policy information, initiates return requests, and guides customers through the return process. ReturnHandler helps automate a common post-purchase service inquiry while ensuring compliance with the store's return policies.

### Dependencies
- Task 53: Create ActionResponse
- Order and Return models exist
- Return policy configured in tenant settings

### Instructions

1. **Create returns.py file**
   - Navigate to `backend/apps/chatbot/handlers/` directory
   - Create new file named `returns.py`
   - This module contains ReturnHandler implementation

2. **Import required dependencies**
   - Import ActionHandler and ActionResponse from base
   - Import Order, OrderItem models
   - Import ReturnRequest model (if exists)
   - Import timezone utilities for date calculations
   - Import Django exceptions

3. **Define ReturnHandler class**
   - Create class that inherits from ActionHandler
   - Set intent_name class attribute to "RETURNS"
   - Add class docstring
   - Document expected entities: order_id, return_reason

4. **Implement handle method**
   - Override abstract handle method
   - Determine if request is for return policy or return initiation
   - Check entities for order_id presence
   - Route to appropriate sub-method

5. **Route based on request type**
   - If no order_id in entities: return policy inquiry
   - If order_id present: return initiation request
   - Call get_return_policy() for policy inquiries
   - Call initiate_return() for return requests

6. **Handle policy inquiry**
   - Call get_return_policy method
   - Format policy information clearly
   - Include return window, conditions, process
   - Add helpful examples

7. **Handle return initiation**
   - Extract order_id from entities
   - Extract return_reason from entities (optional)
   - Validate order exists and belongs to customer
   - Check if order is eligible for return

8. **Check return eligibility**
   - Verify order is within return window
   - Check order status (can't return unshipped orders)
   - Verify items haven't been previously returned
   - Check product-specific return restrictions

9. **Build policy response**
   - Create ActionResponse with policy text
   - Include data with policy details
   - Add "Initiate Return" action button
   - Add follow-up asking if customer wants to return

10. **Build return initiation response**
    - Create ActionResponse confirming return request
    - Include return authorization number
    - Provide next steps instructions
    - Add actions for printing return label

11. **Handle ineligible returns**
    - Clearly explain why return cannot be initiated
    - Provide policy details relevant to situation
    - Offer escalation to human agent if needed
    - Maintain empathetic tone

### ReturnHandler Structure

```
ReturnHandler(ActionHandler)
├── Class Attributes
│   └── intent_name = "RETURNS"
├── Methods
│   ├── handle(intent, entities, context) → ActionResponse
│   ├── get_return_policy() → str
│   ├── initiate_return(order_id, reason) → ActionResponse
│   ├── _check_return_eligibility(order) → bool
│   └── _calculate_return_window(order) → int
└── Helper Methods
    ├── _format_policy_message()
    ├── _format_return_confirmation(return_request)
    └── _build_return_actions(order)
```

### Request Type Routing

| Entities Present | Request Type | Handler Method |
|-----------------|--------------|----------------|
| None | General policy inquiry | get_return_policy() |
| order_id only | Start return for order | initiate_return() |
| order_id + reason | Start return with reason | initiate_return() |

### Return Policy Components

| Component | Description |
|-----------|-------------|
| Window | Number of days for returns (e.g., 7, 14, 30) |
| Conditions | Item condition requirements |
| Exclusions | Non-returnable items |
| Process | Step-by-step return instructions |
| Refund Method | How refund is processed |
| Refund Timeline | When customer receives refund |

### Return Eligibility Checks

| Check | Condition | Error Message |
|-------|-----------|---------------|
| Order Age | Within return window | "Return window has expired" |
| Order Status | Delivered status | "Order must be delivered first" |
| Item Condition | Not damaged/used | "Item not eligible due to condition" |
| Already Returned | Not previously returned | "This order has already been returned" |
| Product Type | Not in exclusions list | "This product type cannot be returned" |

### Return Policy Response Format

| Section | Content |
|---------|---------|
| Headline | "Our Return Policy" |
| Window | "You can return items within {X} days" |
| Conditions | "Items must be unopened and unused" |
| Process | "1. Request return 2. Pack item 3. Ship back" |
| Refund | "Refund processed to original payment" |
| Timeline | "Refunds take 5-7 business days" |

### Expected Outcome
- ReturnHandler class implemented
- handle method routes to policy or initiation
- Return eligibility validation
- Foundation for get_return_policy and initiate_return methods

### Verification Checklist
- [ ] returns.py file created
- [ ] ReturnHandler inherits from ActionHandler
- [ ] intent_name set to "RETURNS"
- [ ] handle method implemented
- [ ] Request type routing logic implemented
- [ ] Eligibility checking logic defined
- [ ] Error messages for ineligible returns
- [ ] ActionResponse properly constructed

---

## Task 60: Create get_return_policy Method

### Overview
Create the get_return_policy method within ReturnHandler that retrieves and formats the store's return policy. This method accesses tenant-specific return policy configuration, formats the policy information in a clear and customer-friendly way, and provides comprehensive details about the return process, conditions, and timelines.

### Dependencies
- Task 59: Create ReturnHandler
- Tenant model includes return policy fields
- Return policy configuration exists

### Instructions

1. **Open returns.py file**
   - Navigate to ReturnHandler class
   - Position after handle method
   - Prepare to add policy retrieval method

2. **Define get_return_policy method**
   - Method name: get_return_policy
   - Parameter: self only
   - Return type: str
   - Add method docstring

3. **Access tenant configuration**
   - Get return policy from self.tenant
   - Access tenant.return_policy_days for window
   - Access tenant.return_conditions for conditions
   - Access tenant.return_exclusions for exclusions

4. **Set default values**
   - If tenant.return_policy_days is None, default to 7
   - If conditions not configured, use standard defaults
   - Ensure policy always has valid values
   - Log if using defaults

5. **Build policy message structure**
   - Start with friendly greeting
   - Include return window prominently
   - List conditions for returns
   - Explain the return process
   - Describe refund method and timeline

6. **Format return window**
   - Convert days to human-readable format
   - Example: "14 days" or "30 days"
   - Make it prominent in message
   - Clarify if business days or calendar days

7. **List return conditions**
   - Items must be unopened/unused
   - Original packaging required
   - Tags/labels must be attached
   - Proof of purchase needed
   - Format as bullet points or numbered list

8. **Explain return process**
   - Step 1: Request return authorization
   - Step 2: Pack item securely
   - Step 3: Ship with provided label or instructions
   - Step 4: Wait for inspection
   - Step 5: Receive refund
   - Make steps clear and actionable

9. **Describe refund method**
   - Refund to original payment method
   - Credit card refunds take X-Y days
   - Cash/store credit options if applicable
   - Explain bank processing time

10. **Include exclusions if applicable**
    - List non-returnable items
    - Examples: perishables, custom items, sale items
    - Clearly mark as exclusions
    - Be specific about categories

11. **Add helpful examples**
    - Example: "For order placed Jan 1, return by Jan 14"
    - Example: "Opened items may be exchanged but not refunded"
    - Make policy concrete and understandable

12. **Format for readability**
    - Use clear section headers
    - Use bullet points for lists
    - Bold important information
    - Keep paragraphs short
    - Use whitespace effectively

### Return Policy Template Structure

**Header:**
| Component | Text |
|-----------|------|
| Greeting | "Here's our return policy:" |
| Emphasis | "We want you to be completely satisfied!" |

**Return Window:**
| Component | Text |
|-----------|------|
| Window | "You may return items within {days} days of delivery" |
| Clarification | "This means calendar days from delivery date" |

**Conditions:**
| Condition | Description |
|-----------|-------------|
| 1 | Items must be unopened and in original packaging |
| 2 | All tags and labels must be attached |
| 3 | Proof of purchase (order number) required |
| 4 | Item must be in resalable condition |

**Process Steps:**
| Step | Action |
|------|--------|
| 1 | Contact us to request return authorization |
| 2 | Pack item securely in original packaging |
| 3 | Include order number and reason for return |
| 4 | Ship to provided return address |
| 5 | Await refund after inspection (3-5 days) |

**Refund Details:**
| Detail | Description |
|--------|-------------|
| Method | Original payment method |
| Timeline | 5-7 business days after approval |
| Partial | Shipping charges not refunded |

**Exclusions:**
| Category | Reason |
|----------|--------|
| Perishable goods | Health and safety |
| Custom/personalized items | Made to order |
| Opened personal care items | Health and safety |
| Final sale items | Marked as final sale |

### Default Policy Values

| Setting | Default Value |
|---------|---------------|
| Return window | 7 days |
| Condition | Unopened, original packaging |
| Refund method | Original payment |
| Refund timeline | 5-7 business days |
| Shipping | Customer pays return shipping |

### Expected Outcome
- get_return_policy method implemented
- Policy retrieved from tenant configuration
- Human-friendly formatted text
- Comprehensive policy information

### Verification Checklist
- [ ] Method signature correct
- [ ] Tenant configuration accessed
- [ ] Default values set for missing config
- [ ] Return window included and prominent
- [ ] Conditions listed clearly
- [ ] Process steps explained
- [ ] Refund details included
- [ ] Exclusions listed if applicable
- [ ] Formatted for readability
- [ ] Friendly and professional tone

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-C_Entity-Extraction](../Group-C_Entity-Extraction/)
- **→ Next Document:** [02_Tasks-61-68_Shipping-Store-Escalation-Registry.md](02_Tasks-61-68_Shipping-Store-Escalation-Registry.md)

---

*This document covers Tasks 51-60, establishing the base action handler architecture and implementing order status, product information, and return policy handlers.*
