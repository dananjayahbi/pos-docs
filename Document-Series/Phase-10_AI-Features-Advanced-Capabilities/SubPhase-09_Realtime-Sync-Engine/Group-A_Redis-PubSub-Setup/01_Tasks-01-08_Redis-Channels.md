# Tasks 01-08: Redis Configuration and Channel Setup

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 09 - Real-time Sync Engine  
> **Group:** A - Redis Pub/Sub Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Publisher-Subscriber.md](02_Tasks-09-16_Publisher-Subscriber.md)

---

## Document Overview

This document covers the foundational setup of Redis Pub/Sub infrastructure for the real-time sync engine. It establishes Redis configuration, channel naming conventions, individual channel definitions for different entity types (Inventory, Price, Order, Product, Customer), and the message schema that will be used across all channels.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Redis Config | Low | 20 min |
| 02 | Create Channel Naming | Low | 15 min |
| 03 | Create Inventory Channel | Low | 15 min |
| 04 | Create Price Channel | Low | 15 min |
| 05 | Create Order Channel | Low | 15 min |
| 06 | Create Product Channel | Low | 15 min |
| 07 | Create Customer Channel | Low | 15 min |
| 08 | Create Message Schema | Medium | 30 min |

---

## Task 01: Create Redis Config

### Overview
Establish the Redis connection configuration for the Pub/Sub system. This configuration creates a separate Redis connection specifically for real-time messaging, isolated from the caching layer. The config includes connection parameters, authentication, and database selection to ensure proper isolation and security.

### Dependencies
- Docker Redis service must be running
- Environment variables configured
- Backend sync app initialized

### Instructions

1. **Create sync app directory structure**
   - Navigate to `backend/apps/` directory
   - Create new directory named `sync`
   - Initialize as Django app with proper structure

2. **Create config.py file**
   - Create new file `config.py` in `backend/apps/sync/`
   - This file will contain all Redis connection settings

3. **Define Redis configuration class**
   - Create a `RedisConfig` class or configuration dictionary
   - Include all necessary connection parameters
   - Use Django settings for environment variable access

4. **Configure Redis host setting**
   - Read from environment variable `REDIS_HOST`
   - Set default value to `localhost` for local development
   - Document the expected value for Docker (`redis` service name)

5. **Configure Redis port setting**
   - Set port to 6379 (standard Redis port)
   - Allow override via environment variable if needed
   - Validate port number is within valid range

6. **Configure Redis database selection**
   - Use database 1 for Pub/Sub (not database 0)
   - Database 0 is reserved for caching layer
   - This separation prevents cache operations from affecting messaging

7. **Configure Redis password**
   - Read from environment variable `REDIS_PASSWORD`
   - Handle both authenticated and non-authenticated scenarios
   - Store securely and never commit to version control

8. **Set connection timeout values**
   - Configure socket timeout (default: 5 seconds)
   - Configure connection timeout (default: 5 seconds)
   - Set appropriate retry strategy for connection failures

9. **Configure connection pool settings**
   - Set maximum connections for pool
   - Configure connection reuse strategy
   - Define pool timeout parameters

10. **Add health check configuration**
    - Include ping timeout setting
    - Configure connection validation strategy
    - Set reconnection behavior on failure

11. **Document configuration options**
    - Add docstrings explaining each parameter
    - Provide examples of typical values
    - Include troubleshooting notes

### Redis Configuration Parameters

| Parameter | Environment Variable | Default Value | Purpose |
|-----------|---------------------|---------------|---------|
| Host | REDIS_HOST | localhost | Redis server address |
| Port | REDIS_PORT | 6379 | Redis server port |
| Database | REDIS_PUBSUB_DB | 1 | Database number for Pub/Sub |
| Password | REDIS_PASSWORD | None | Authentication credential |
| Socket Timeout | REDIS_SOCKET_TIMEOUT | 5 | Seconds before socket timeout |
| Connection Timeout | REDIS_CONN_TIMEOUT | 5 | Seconds before connection timeout |
| Max Connections | REDIS_MAX_CONNECTIONS | 50 | Pool size limit |

### Configuration Structure

```
RedisConfig
├── Connection Settings
│   ├── host (from REDIS_HOST)
│   ├── port (6379)
│   └── db (1)
├── Authentication
│   └── password (from REDIS_PASSWORD)
├── Timeouts
│   ├── socket_timeout (5s)
│   └── connection_timeout (5s)
└── Connection Pool
    ├── max_connections (50)
    └── connection_class (Redis)
```

### Environment Variables Setup

| Variable | Development | Production | Notes |
|----------|-------------|------------|-------|
| REDIS_HOST | localhost or redis | redis-prod.example.com | Docker service name or hostname |
| REDIS_PORT | 6379 | 6379 | Standard Redis port |
| REDIS_PASSWORD | (optional) | (required) | Strong password in production |
| REDIS_PUBSUB_DB | 1 | 1 | Separate from cache DB |

### Database Isolation Strategy

```
Redis Instance
├── Database 0 (Cache)
│   ├── Session data
│   ├── Query cache
│   └── Temporary data
└── Database 1 (Pub/Sub)
    ├── Real-time messages
    ├── Event streams
    └── Sync notifications
```

### Connection Lifecycle

| Phase | Action | Purpose |
|-------|--------|---------|
| Initialize | Load config from environment | Get connection parameters |
| Connect | Establish Redis connection | Create client instance |
| Validate | Ping Redis server | Verify connectivity |
| Pool | Create connection pool | Enable reuse |
| Monitor | Track connection health | Detect failures |
| Reconnect | Auto-reconnect on failure | Maintain availability |

### Security Considerations

| Aspect | Implementation | Importance |
|--------|----------------|------------|
| Password | Use strong, unique password | High |
| Environment | Store in .env, not in code | Critical |
| SSL/TLS | Enable for production | High |
| Network | Use private network in production | High |
| Access | Limit to backend services only | Medium |

### Configuration Validation

| Check | Purpose | Action on Failure |
|-------|---------|-------------------|
| Host reachable | Verify network connectivity | Raise connection error |
| Port open | Confirm Redis listening | Raise connection error |
| Auth valid | Test credentials | Raise authentication error |
| Database available | Check DB number exists | Raise configuration error |
| Version compatible | Verify Redis version | Log warning or error |

### Expected Outcome
- Functional Redis configuration class ready for use
- Environment-based configuration for flexibility
- Proper database isolation from caching layer
- Secure credential management
- Connection pooling for performance
- Health check capability

### Verification Checklist
- [ ] `backend/apps/sync/config.py` file created
- [ ] RedisConfig class or dictionary defined
- [ ] All configuration parameters included
- [ ] Environment variables properly accessed
- [ ] Database 1 selected for Pub/Sub
- [ ] Password handling implemented securely
- [ ] Connection pool configured
- [ ] Timeout values set appropriately
- [ ] Configuration documented with docstrings
- [ ] Can successfully connect to Redis
- [ ] Connection validation works

---

## Task 02: Create Channel Naming

### Overview
Establish a consistent, tenant-aware channel naming convention for all Redis Pub/Sub channels. This naming scheme ensures proper isolation between tenants while providing clear, predictable channel names that are easy to debug and monitor.

### Dependencies
- Task 01: Create Redis Config

### Instructions

1. **Create channels.py file**
   - Create new file `channels.py` in `backend/apps/sync/`
   - This file will contain channel naming utilities

2. **Define channel naming pattern**
   - Establish pattern: `{entity_type}:{tenant_id}`
   - Ensure pattern is consistent across all channels
   - Document pattern clearly for team reference

3. **Create channel name builder function**
   - Create function to generate channel names dynamically
   - Accept entity type and tenant ID as parameters
   - Return properly formatted channel name string

4. **Implement tenant ID validation**
   - Validate tenant ID format before building channel name
   - Ensure tenant ID is not empty or None
   - Raise appropriate error for invalid tenant IDs

5. **Create channel name constants**
   - Define constants for each entity type prefix
   - Examples: INVENTORY_PREFIX, PRICES_PREFIX, etc.
   - Use uppercase naming convention for constants

6. **Add channel name parsing function**
   - Create function to parse channel name back to components
   - Extract entity type and tenant ID from channel name
   - Return tuple or dictionary with parsed values

7. **Implement wildcard pattern support**
   - Create patterns for subscribing to multiple channels
   - Example: `inventory:*` for all inventory channels
   - Document wildcard usage and implications

8. **Add channel validation function**
   - Validate channel name format
   - Check for required separator (`:`)
   - Verify entity type is recognized

9. **Create helper functions**
   - Function to get all channel names for a tenant
   - Function to get channel name by entity and tenant
   - Function to check if channel name is valid

10. **Document naming conventions**
    - Add comprehensive docstrings
    - Provide examples of valid channel names
    - Explain tenant isolation strategy

### Channel Naming Pattern

| Pattern | Description | Example |
|---------|-------------|---------|
| `{entity}:{tenant}` | Standard pattern | `inventory:tenant_001` |
| `{entity}:*` | Wildcard for all tenants | `inventory:*` |
| `dlq:{tenant}` | Dead letter queue | `dlq:tenant_001` |

### Channel Name Components

```
Channel Name: "inventory:tenant_001"
              ↓         ↓
         Entity Type  Tenant ID
```

### Entity Type Prefixes

| Entity Type | Prefix | Example Channel |
|-------------|--------|-----------------|
| Inventory | `inventory` | `inventory:tenant_001` |
| Prices | `prices` | `prices:tenant_001` |
| Orders | `orders` | `orders:tenant_001` |
| Products | `products` | `products:tenant_001` |
| Customers | `customers` | `customers:tenant_001` |
| Dead Letter Queue | `dlq` | `dlq:tenant_001` |

### Tenant Isolation Strategy

```
Tenant A (tenant_001)
├── inventory:tenant_001
├── prices:tenant_001
├── orders:tenant_001
├── products:tenant_001
└── customers:tenant_001

Tenant B (tenant_002)
├── inventory:tenant_002
├── prices:tenant_002
├── orders:tenant_002
├── products:tenant_002
└── customers:tenant_002

No cross-tenant communication
```

### Channel Name Builder Function

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| build_channel_name | entity_type, tenant_id | string | Create channel name |
| parse_channel_name | channel_name | dict | Extract components |
| validate_channel_name | channel_name | bool | Check validity |
| get_tenant_channels | tenant_id | list | All channels for tenant |

### Validation Rules

| Rule | Check | Error if Failed |
|------|-------|-----------------|
| Entity type required | Not empty string | ValueError |
| Tenant ID required | Not None or empty | ValueError |
| Format correct | Contains single `:` | ValueError |
| Entity type valid | In allowed list | ValueError |
| Tenant ID format | Matches pattern | ValueError |

### Wildcard Patterns

| Pattern | Matches | Use Case |
|---------|---------|----------|
| `inventory:*` | All inventory channels | Monitor all inventory updates |
| `*:tenant_001` | All channels for tenant | Monitor specific tenant |
| `dlq:*` | All dead letter queues | Monitor failures |

### Naming Best Practices

| Practice | Reason | Example |
|----------|--------|---------|
| Lowercase | Consistency | `inventory` not `Inventory` |
| No spaces | Redis compatibility | `customer_data` not `customer data` |
| Descriptive | Clear purpose | `prices` not `p` |
| Consistent | Predictable | All use same pattern |
| Tenant-aware | Isolation | Always include tenant ID |

### Expected Outcome
- Consistent channel naming across entire system
- Tenant isolation enforced through naming
- Helper functions for channel name operations
- Clear documentation of naming conventions
- Validation to prevent malformed channel names

### Verification Checklist
- [ ] `backend/apps/sync/channels.py` file created
- [ ] Channel naming pattern defined and documented
- [ ] build_channel_name function implemented
- [ ] parse_channel_name function implemented
- [ ] validate_channel_name function implemented
- [ ] Entity type constants defined
- [ ] Tenant ID validation included
- [ ] Wildcard pattern support added
- [ ] Helper functions created
- [ ] Comprehensive docstrings added
- [ ] Examples provided in documentation

---

## Task 03: Create Inventory Channel

### Overview
Define the inventory channel configuration for publishing and subscribing to inventory-related events. This channel handles real-time inventory updates, stock level changes, and inventory adjustments across the system. Proper configuration ensures POS devices and web stores receive timely inventory synchronization.

### Dependencies
- Task 02: Create Channel Naming

### Instructions

1. **Define inventory channel constant**
   - Add INVENTORY_CHANNEL constant to channels.py
   - Set value to entity type prefix: `"inventory"`
   - Document the purpose and usage

2. **Create inventory channel builder function**
   - Create function specific to inventory channels
   - Accept only tenant_id parameter
   - Return channel name using standard pattern

3. **Document inventory events**
   - List all events published to this channel
   - Include INVENTORY_UPDATED event type
   - Describe when each event is triggered

4. **Define inventory message structure**
   - Document required fields for inventory messages
   - Include product_id, sku, quantity fields
   - Specify warehouse or location information

5. **Establish inventory update triggers**
   - Document when inventory updates are published
   - Examples: stock receive, sale, adjustment
   - Include manual and automatic triggers

6. **Configure inventory channel subscribers**
   - List systems that subscribe to inventory channel
   - Include POS devices, web store, reporting
   - Document subscription patterns

7. **Add inventory-specific validation**
   - Validate inventory quantities are numeric
   - Ensure product identifiers are present
   - Check for required inventory fields

8. **Define inventory event priority**
   - Mark inventory updates as high priority
   - Ensure timely delivery to prevent overselling
   - Document retry strategy for inventory

9. **Create inventory channel documentation**
   - Add comprehensive comments explaining usage
   - Provide example inventory messages
   - Include common use cases and patterns

### Inventory Channel Specification

| Attribute | Value | Description |
|-----------|-------|-------------|
| Entity Type | inventory | Channel identifier |
| Channel Pattern | `inventory:{tenant_id}` | Naming format |
| Event Types | INVENTORY_UPDATED | Supported events |
| Priority | High | Delivery priority |
| Retention | None | Messages not persisted |

### Inventory Events

| Event Type | Trigger | Data Included |
|------------|---------|---------------|
| INVENTORY_UPDATED | Stock change | product_id, sku, quantity, warehouse |

### Inventory Message Structure

```
Inventory Message
├── event_id: UUID
├── event_type: "INVENTORY_UPDATED"
├── entity_type: "inventory"
├── entity_id: product_id
├── tenant_id: tenant identifier
├── data
│   ├── product_id: product identifier
│   ├── sku: stock keeping unit
│   ├── quantity: current stock level
│   ├── warehouse_id: location identifier
│   ├── previous_quantity: old stock level
│   └── change_reason: adjustment reason
└── timestamp: ISO format datetime
```

### Inventory Update Triggers

| Trigger | Source | Frequency |
|---------|--------|-----------|
| Sale completed | POS/Web store | Per transaction |
| Stock received | Warehouse management | Per receipt |
| Manual adjustment | Inventory management | As needed |
| Return processed | Returns module | Per return |
| Transfer completed | Multi-warehouse | Per transfer |

### Inventory Subscribers

```
Inventory Channel (inventory:tenant_001)
    │
    ├─→ POS Devices
    │   └── Update local inventory cache
    │
    ├─→ Web Store
    │   └── Update product availability
    │
    ├─→ Reporting Service
    │   └── Track inventory levels
    │
    └─→ Notification Service
        └── Alert on low stock
```

### Inventory Data Flow

| Step | Actor | Action |
|------|-------|--------|
| 1 | ERP Module | Detect inventory change |
| 2 | Publisher | Publish to inventory channel |
| 3 | Redis | Route to subscribers |
| 4 | POS Device | Receive and update cache |
| 5 | Web Store | Update product display |

### Critical Inventory Scenarios

| Scenario | Challenge | Solution |
|----------|-----------|----------|
| Overselling | Multiple sales simultaneously | High-priority delivery |
| Stock discrepancy | Out-of-sync data | Frequent updates |
| Network failure | Message not delivered | Retry with exponential backoff |
| Large inventory | Many SKUs updated | Batch messages efficiently |

### Expected Outcome
- Inventory channel properly configured
- Clear documentation of inventory events
- Standard message format established
- Subscriber list documented
- Validation rules defined

### Verification Checklist
- [ ] INVENTORY_CHANNEL constant defined
- [ ] Inventory channel builder function created
- [ ] Inventory events documented
- [ ] Message structure specified
- [ ] Update triggers identified
- [ ] Subscriber list documented
- [ ] Validation rules added
- [ ] Priority level set
- [ ] Examples provided
- [ ] Comments and docstrings complete

---

## Task 04: Create Price Channel

### Overview
Define the price channel configuration for publishing and subscribing to price-related events. This channel handles real-time price updates, discount changes, and pricing adjustments across the system, ensuring consistent pricing between POS devices and web stores.

### Dependencies
- Task 02: Create Channel Naming

### Instructions

1. **Define price channel constant**
   - Add PRICE_CHANNEL constant to channels.py
   - Set value to entity type prefix: `"prices"`
   - Document the purpose and usage

2. **Create price channel builder function**
   - Create function specific to price channels
   - Accept only tenant_id parameter
   - Return channel name using standard pattern

3. **Document price events**
   - List all events published to this channel
   - Include PRICE_UPDATED event type
   - Describe pricing scenarios and triggers

4. **Define price message structure**
   - Document required fields for price messages
   - Include product_id, price, currency fields
   - Specify discount and tax information

5. **Establish price update triggers**
   - Document when price updates are published
   - Examples: manual update, promotion start/end
   - Include scheduled and immediate updates

6. **Configure price channel subscribers**
   - List systems that subscribe to price channel
   - Include POS devices, web store, mobile app
   - Document subscription patterns

7. **Add price-specific validation**
   - Validate prices are positive numbers
   - Ensure currency is specified
   - Check for required pricing fields

8. **Define price event priority**
   - Mark price updates as medium-high priority
   - Balance between speed and consistency
   - Document retry strategy for pricing

9. **Handle price history considerations**
   - Note that messages are real-time only
   - Historical pricing stored in database
   - Price channel for immediate updates only

10. **Create price channel documentation**
    - Add comprehensive comments explaining usage
    - Provide example price messages
    - Include common pricing scenarios

### Price Channel Specification

| Attribute | Value | Description |
|-----------|-------|-------------|
| Entity Type | prices | Channel identifier |
| Channel Pattern | `prices:{tenant_id}` | Naming format |
| Event Types | PRICE_UPDATED | Supported events |
| Priority | Medium-High | Delivery priority |
| Retention | None | Messages not persisted |

### Price Events

| Event Type | Trigger | Data Included |
|------------|---------|---------------|
| PRICE_UPDATED | Price change | product_id, price, currency, discounts |

### Price Message Structure

```
Price Message
├── event_id: UUID
├── event_type: "PRICE_UPDATED"
├── entity_type: "price"
├── entity_id: product_id
├── tenant_id: tenant identifier
├── data
│   ├── product_id: product identifier
│   ├── price: base price
│   ├── currency: ISO currency code
│   ├── sale_price: discounted price (optional)
│   ├── discount_percentage: discount amount
│   ├── effective_date: when price becomes active
│   ├── expiry_date: when price expires (optional)
│   └── price_list: price list identifier (optional)
└── timestamp: ISO format datetime
```

### Price Update Triggers

| Trigger | Source | Frequency |
|---------|--------|-----------|
| Manual update | Admin interface | As needed |
| Promotion start | Promotion scheduler | Scheduled |
| Promotion end | Promotion scheduler | Scheduled |
| Bulk import | Import tool | Batch operations |
| Price list change | Pricing management | As configured |

### Price Subscribers

```
Price Channel (prices:tenant_001)
    │
    ├─→ POS Devices
    │   └── Update local price cache
    │
    ├─→ Web Store
    │   └── Update product prices
    │
    ├─→ Mobile App
    │   └── Refresh price display
    │
    └─→ Reporting Service
        └── Track price changes
```

### Price Data Flow

| Step | Actor | Action |
|------|-------|--------|
| 1 | Pricing Module | Detect price change |
| 2 | Publisher | Publish to price channel |
| 3 | Redis | Route to subscribers |
| 4 | POS Device | Receive and update prices |
| 5 | Web Store | Update product display |

### Price Update Scenarios

| Scenario | Description | Handling |
|----------|-------------|----------|
| Flash Sale | Rapid price changes | Immediate updates |
| Scheduled Promotion | Future-dated pricing | Publish at effective time |
| Bulk Update | Many products at once | Batch messages |
| Currency Change | Multi-currency pricing | Separate messages per product |
| Discount Expiry | Revert to regular price | Automatic trigger |

### Price Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| price | Must be positive number | "Price must be greater than 0" |
| currency | Must be valid ISO code | "Invalid currency code" |
| sale_price | Must be less than base price | "Sale price cannot exceed base price" |
| discount_percentage | Must be 0-100 | "Discount must be between 0 and 100" |

### Expected Outcome
- Price channel properly configured
- Clear documentation of price events
- Standard message format established
- Subscriber list documented
- Validation rules defined
- Price update scenarios covered

### Verification Checklist
- [ ] PRICE_CHANNEL constant defined
- [ ] Price channel builder function created
- [ ] Price events documented
- [ ] Message structure specified
- [ ] Update triggers identified
- [ ] Subscriber list documented
- [ ] Validation rules added
- [ ] Priority level set
- [ ] Currency handling documented
- [ ] Examples provided
- [ ] Comments and docstrings complete

---

## Task 05: Create Order Channel

### Overview
Define the order channel configuration for publishing and subscribing to order-related events. This channel handles real-time order status updates, new order notifications, and order modifications across the system, enabling coordinated order processing between POS, web store, and fulfillment systems.

### Dependencies
- Task 02: Create Channel Naming

### Instructions

1. **Define order channel constant**
   - Add ORDER_CHANNEL constant to channels.py
   - Set value to entity type prefix: `"orders"`
   - Document the purpose and usage

2. **Create order channel builder function**
   - Create function specific to order channels
   - Accept only tenant_id parameter
   - Return channel name using standard pattern

3. **Document order events**
   - List all events published to this channel
   - Include ORDER_CREATED and ORDER_UPDATED types
   - Describe order lifecycle events

4. **Define order message structure**
   - Document required fields for order messages
   - Include order_id, status, customer fields
   - Specify order items and total amount

5. **Establish order event triggers**
   - Document when order events are published
   - Examples: new order, status change, cancellation
   - Include all order state transitions

6. **Configure order channel subscribers**
   - List systems that subscribe to order channel
   - Include warehouse, kitchen display, notifications
   - Document subscription patterns

7. **Add order-specific validation**
   - Validate order status values
   - Ensure required order fields present
   - Check order data integrity

8. **Define order event priority**
   - Mark new orders as high priority
   - Updates as medium priority
   - Document retry strategy for orders

9. **Handle order synchronization**
   - Document how orders sync between systems
   - Address conflict resolution strategy
   - Note database as source of truth

10. **Create order channel documentation**
    - Add comprehensive comments explaining usage
    - Provide example order messages
    - Include common order workflows

### Order Channel Specification

| Attribute | Value | Description |
|-----------|-------|-------------|
| Entity Type | orders | Channel identifier |
| Channel Pattern | `orders:{tenant_id}` | Naming format |
| Event Types | ORDER_CREATED, ORDER_UPDATED | Supported events |
| Priority | High (new), Medium (updates) | Delivery priority |
| Retention | None | Messages not persisted |

### Order Events

| Event Type | Trigger | Data Included |
|------------|---------|---------------|
| ORDER_CREATED | New order placed | order_id, customer, items, total |
| ORDER_UPDATED | Status or details changed | order_id, status, changes |

### Order Message Structure

```
Order Message
├── event_id: UUID
├── event_type: "ORDER_CREATED" or "ORDER_UPDATED"
├── entity_type: "order"
├── entity_id: order_id
├── tenant_id: tenant identifier
├── data
│   ├── order_id: order identifier
│   ├── order_number: human-readable number
│   ├── status: order status
│   ├── customer_id: customer identifier
│   ├── items: array of order items
│   ├── subtotal: items total
│   ├── tax: tax amount
│   ├── total: grand total
│   ├── payment_status: payment state
│   ├── source: POS, webstore, mobile, etc.
│   └── created_by: user or system
└── timestamp: ISO format datetime
```

### Order Event Triggers

| Trigger | Event Type | Description |
|---------|------------|-------------|
| Order placed | ORDER_CREATED | New order submitted |
| Status changed | ORDER_UPDATED | Processing, shipped, etc. |
| Items modified | ORDER_UPDATED | Products added/removed |
| Payment received | ORDER_UPDATED | Payment status change |
| Order cancelled | ORDER_UPDATED | Order cancellation |

### Order Subscribers

```
Order Channel (orders:tenant_001)
    │
    ├─→ Warehouse Management
    │   └── Initiate fulfillment
    │
    ├─→ Kitchen Display System
    │   └── Show new orders
    │
    ├─→ Notification Service
    │   └── Send confirmations
    │
    ├─→ Reporting Service
    │   └── Track order metrics
    │
    └─→ Inventory Service
        └── Reserve stock
```

### Order Status Lifecycle

```
ORDER_CREATED
    ↓
PENDING
    ↓
PROCESSING
    ↓
┌───────┬─────────┐
↓       ↓         ↓
SHIPPED READY    CANCELLED
    ↓       ↓
DELIVERED COMPLETED
```

### Order Data Flow

| Step | Actor | Action |
|------|-------|--------|
| 1 | POS/Web Store | Create order |
| 2 | Order Service | Publish ORDER_CREATED |
| 3 | Redis | Route to subscribers |
| 4 | Warehouse | Receive fulfillment request |
| 5 | Inventory | Reserve stock |
| 6 | Notification | Send confirmation |

### Order Synchronization Scenarios

| Scenario | Challenge | Solution |
|----------|-----------|----------|
| Simultaneous edits | Conflicting updates | Last-write-wins with timestamp |
| Network partition | Delayed delivery | Queue messages, process on reconnect |
| Invalid status transition | Illegal state change | Validate before publishing |
| Missing dependencies | Inventory unavailable | Handle gracefully, retry |

### Order Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| order_id | Must be present and unique | "Order ID required" |
| status | Must be valid status value | "Invalid order status" |
| items | Must contain at least one item | "Order must have items" |
| total | Must match calculated total | "Order total mismatch" |
| customer_id | Must reference valid customer | "Invalid customer" |

### Expected Outcome
- Order channel properly configured
- Clear documentation of order events
- Standard message format established
- Subscriber list documented
- Order lifecycle documented
- Validation rules defined

### Verification Checklist
- [ ] ORDER_CHANNEL constant defined
- [ ] Order channel builder function created
- [ ] Order events documented (CREATED, UPDATED)
- [ ] Message structure specified
- [ ] Event triggers identified
- [ ] Subscriber list documented
- [ ] Validation rules added
- [ ] Priority levels set
- [ ] Order status lifecycle documented
- [ ] Synchronization strategy noted
- [ ] Examples provided
- [ ] Comments and docstrings complete

---

## Task 06: Create Product Channel

### Overview
Define the product channel configuration for publishing and subscribing to product catalog events. This channel handles product creation, updates, and deletion events, ensuring product information remains synchronized across all systems including POS devices, web store, and mobile applications.

### Dependencies
- Task 02: Create Channel Naming

### Instructions

1. **Define product channel constant**
   - Add PRODUCT_CHANNEL constant to channels.py
   - Set value to entity type prefix: `"products"`
   - Document the purpose and usage

2. **Create product channel builder function**
   - Create function specific to product channels
   - Accept only tenant_id parameter
   - Return channel name using standard pattern

3. **Document product events**
   - List all events published to this channel
   - Include PRODUCT_CREATED, PRODUCT_UPDATED, PRODUCT_DELETED
   - Describe product lifecycle events

4. **Define product message structure**
   - Document required fields for product messages
   - Include product_id, name, sku, description
   - Specify categories, attributes, images

5. **Establish product event triggers**
   - Document when product events are published
   - Examples: new product, details updated, discontinued
   - Include catalog management operations

6. **Configure product channel subscribers**
   - List systems that subscribe to product channel
   - Include POS devices, web store, mobile app, search
   - Document subscription patterns

7. **Add product-specific validation**
   - Validate required product fields
   - Ensure SKU uniqueness per tenant
   - Check product data completeness

8. **Define product event priority**
   - Mark product creation as medium priority
   - Updates as low-medium priority
   - Deletions as medium priority

9. **Handle product relationships**
   - Document how variants are handled
   - Address bundles and kits
   - Note related products synchronization

10. **Create product channel documentation**
    - Add comprehensive comments explaining usage
    - Provide example product messages
    - Include common product operations

### Product Channel Specification

| Attribute | Value | Description |
|-----------|-------|-------------|
| Entity Type | products | Channel identifier |
| Channel Pattern | `products:{tenant_id}` | Naming format |
| Event Types | PRODUCT_CREATED, PRODUCT_UPDATED, PRODUCT_DELETED | Supported events |
| Priority | Medium | Delivery priority |
| Retention | None | Messages not persisted |

### Product Events

| Event Type | Trigger | Data Included |
|------------|---------|---------------|
| PRODUCT_CREATED | New product added | product_id, name, sku, details |
| PRODUCT_UPDATED | Product details changed | product_id, changed fields |
| PRODUCT_DELETED | Product discontinued | product_id, deletion reason |

### Product Message Structure

```
Product Message
├── event_id: UUID
├── event_type: "PRODUCT_CREATED" | "PRODUCT_UPDATED" | "PRODUCT_DELETED"
├── entity_type: "product"
├── entity_id: product_id
├── tenant_id: tenant identifier
├── data
│   ├── product_id: product identifier
│   ├── sku: stock keeping unit
│   ├── name: product name
│   ├── description: product description
│   ├── category_id: category identifier
│   ├── brand: brand name
│   ├── attributes: product attributes object
│   ├── images: array of image URLs
│   ├── is_active: availability status
│   ├── is_variant: variant flag
│   ├── parent_product_id: parent if variant
│   └── metadata: additional data
└── timestamp: ISO format datetime
```

### Product Event Triggers

| Trigger | Event Type | Source |
|---------|------------|--------|
| Add product | PRODUCT_CREATED | Catalog management |
| Edit details | PRODUCT_UPDATED | Catalog management |
| Update attributes | PRODUCT_UPDATED | Catalog management |
| Add images | PRODUCT_UPDATED | Media management |
| Discontinue | PRODUCT_DELETED | Catalog management |
| Bulk import | PRODUCT_CREATED | Import tool |

### Product Subscribers

```
Product Channel (products:tenant_001)
    │
    ├─→ POS Devices
    │   └── Update product catalog
    │
    ├─→ Web Store
    │   └── Update product pages
    │
    ├─→ Mobile App
    │   └── Refresh product list
    │
    ├─→ Search Index
    │   └── Reindex products
    │
    └─→ Reporting Service
        └── Track catalog changes
```

### Product Data Flow

| Step | Actor | Action |
|------|-------|--------|
| 1 | Catalog Module | Detect product change |
| 2 | Publisher | Publish to product channel |
| 3 | Redis | Route to subscribers |
| 4 | POS Device | Update local catalog |
| 5 | Web Store | Refresh product display |
| 6 | Search Service | Reindex product |

### Product Synchronization Scenarios

| Scenario | Description | Handling |
|----------|-------------|----------|
| New product | Add to catalog | Publish PRODUCT_CREATED |
| Details update | Change name, description | Publish PRODUCT_UPDATED |
| Image added | New product photo | Publish PRODUCT_UPDATED |
| Discontinue | Remove from active catalog | Publish PRODUCT_DELETED |
| Variant created | Add product variant | Publish PRODUCT_CREATED with parent_id |
| Bulk update | Many products at once | Batch messages |

### Product Relationships

```
Parent Product
├── Variant 1 (Size: Small)
├── Variant 2 (Size: Medium)
└── Variant 3 (Size: Large)

Each variant publishes separate message
All reference parent_product_id
```

### Product Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| product_id | Must be present | "Product ID required" |
| sku | Must be unique per tenant | "SKU already exists" |
| name | Must not be empty | "Product name required" |
| is_active | Must be boolean | "Invalid active status" |
| category_id | Must reference valid category | "Invalid category" |

### Product Update Strategies

| Update Type | Impact | Priority | Broadcast |
|-------------|--------|----------|-----------|
| Critical (name, price) | High | High | Immediate |
| Important (description) | Medium | Medium | Standard |
| Minor (metadata) | Low | Low | Batched |

### Expected Outcome
- Product channel properly configured
- Clear documentation of product events
- Standard message format established
- Subscriber list documented
- Product lifecycle documented
- Validation rules defined
- Relationship handling documented

### Verification Checklist
- [ ] PRODUCT_CHANNEL constant defined
- [ ] Product channel builder function created
- [ ] Product events documented (CREATED, UPDATED, DELETED)
- [ ] Message structure specified
- [ ] Event triggers identified
- [ ] Subscriber list documented
- [ ] Validation rules added
- [ ] Priority levels set
- [ ] Variant handling documented
- [ ] Relationship strategy noted
- [ ] Examples provided
- [ ] Comments and docstrings complete

---

## Task 07: Create Customer Channel

### Overview
Define the customer channel configuration for publishing and subscribing to customer-related events. This channel handles customer creation, profile updates, and customer data synchronization across systems, enabling consistent customer experience across POS, web store, and mobile applications.

### Dependencies
- Task 02: Create Channel Naming

### Instructions

1. **Define customer channel constant**
   - Add CUSTOMER_CHANNEL constant to channels.py
   - Set value to entity type prefix: `"customers"`
   - Document the purpose and usage

2. **Create customer channel builder function**
   - Create function specific to customer channels
   - Accept only tenant_id parameter
   - Return channel name using standard pattern

3. **Document customer events**
   - List all events published to this channel
   - Include CUSTOMER_CREATED and CUSTOMER_UPDATED
   - Describe customer lifecycle events

4. **Define customer message structure**
   - Document required fields for customer messages
   - Include customer_id, name, email, phone
   - Specify loyalty points and preferences

5. **Establish customer event triggers**
   - Document when customer events are published
   - Examples: registration, profile update, address change
   - Include loyalty program updates

6. **Configure customer channel subscribers**
   - List systems that subscribe to customer channel
   - Include POS devices, CRM, loyalty service, marketing
   - Document subscription patterns

7. **Add customer-specific validation**
   - Validate email format
   - Validate phone number format
   - Check required customer fields

8. **Address privacy considerations**
   - Document data minimization strategy
   - Note sensitive data handling
   - Ensure GDPR/privacy compliance

9. **Define customer event priority**
   - Mark customer creation as medium priority
   - Updates as low-medium priority
   - Document retry strategy

10. **Create customer channel documentation**
    - Add comprehensive comments explaining usage
    - Provide example customer messages
    - Include common customer operations

### Customer Channel Specification

| Attribute | Value | Description |
|-----------|-------|-------------|
| Entity Type | customers | Channel identifier |
| Channel Pattern | `customers:{tenant_id}` | Naming format |
| Event Types | CUSTOMER_CREATED, CUSTOMER_UPDATED | Supported events |
| Priority | Medium | Delivery priority |
| Retention | None | Messages not persisted |

### Customer Events

| Event Type | Trigger | Data Included |
|------------|---------|---------------|
| CUSTOMER_CREATED | New customer registered | customer_id, name, email, phone |
| CUSTOMER_UPDATED | Profile or preferences changed | customer_id, changed fields |

### Customer Message Structure

```
Customer Message
├── event_id: UUID
├── event_type: "CUSTOMER_CREATED" or "CUSTOMER_UPDATED"
├── entity_type: "customer"
├── entity_id: customer_id
├── tenant_id: tenant identifier
├── data
│   ├── customer_id: customer identifier
│   ├── customer_number: human-readable number
│   ├── name: full name
│   ├── email: email address
│   ├── phone: phone number
│   ├── loyalty_points: current points
│   ├── loyalty_tier: membership tier
│   ├── preferences: customer preferences object
│   ├── is_active: account status
│   └── metadata: additional data
└── timestamp: ISO format datetime
```

### Customer Event Triggers

| Trigger | Event Type | Source |
|---------|------------|--------|
| New registration | CUSTOMER_CREATED | POS, web store, mobile |
| Profile update | CUSTOMER_UPDATED | Customer portal |
| Address change | CUSTOMER_UPDATED | Checkout, profile |
| Loyalty update | CUSTOMER_UPDATED | Loyalty service |
| Preferences change | CUSTOMER_UPDATED | Settings |

### Customer Subscribers

```
Customer Channel (customers:tenant_001)
    │
    ├─→ POS Devices
    │   └── Update customer database
    │
    ├─→ CRM System
    │   └── Sync customer profiles
    │
    ├─→ Loyalty Service
    │   └── Update points and tiers
    │
    ├─→ Marketing Automation
    │   └── Segment and target
    │
    └─→ Reporting Service
        └── Track customer metrics
```

### Customer Data Flow

| Step | Actor | Action |
|------|-------|--------|
| 1 | Registration Form | Create customer |
| 2 | Customer Service | Publish CUSTOMER_CREATED |
| 3 | Redis | Route to subscribers |
| 4 | POS Device | Add to local customer DB |
| 5 | CRM | Create customer profile |
| 6 | Loyalty | Initialize points account |

### Customer Synchronization Scenarios

| Scenario | Description | Handling |
|----------|-------------|----------|
| New registration | Customer signs up | Publish CUSTOMER_CREATED |
| Profile update | Name, email changed | Publish CUSTOMER_UPDATED |
| Loyalty earned | Points awarded | Publish CUSTOMER_UPDATED |
| Address added | New shipping address | Publish CUSTOMER_UPDATED |
| Preferences set | Communication preferences | Publish CUSTOMER_UPDATED |

### Privacy and Data Protection

| Aspect | Implementation | Compliance |
|--------|----------------|------------|
| Data minimization | Only send necessary fields | GDPR Article 5 |
| Sensitive data | Exclude passwords, payment info | PCI DSS |
| Encryption | Encrypt in transit (TLS) | Security best practice |
| Retention | No persistence in Redis | Privacy by design |
| Access control | Tenant isolation | Multi-tenancy |

### Customer Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| customer_id | Must be present | "Customer ID required" |
| email | Must be valid email format | "Invalid email address" |
| phone | Must be valid phone format | "Invalid phone number" |
| name | Must not be empty | "Customer name required" |
| loyalty_points | Must be non-negative number | "Invalid loyalty points" |

### Customer Data Handling

| Data Type | Included in Message | Stored in Database | Notes |
|-----------|--------------------|--------------------|-------|
| Name | Yes | Yes | Public information |
| Email | Yes | Yes | Contact information |
| Phone | Yes | Yes | Contact information |
| Password | No | Yes (hashed) | Never in messages |
| Payment info | No | Yes (tokenized) | Never in messages |
| Loyalty points | Yes | Yes | Sync across systems |
| Preferences | Yes | Yes | Marketing preferences |

### Expected Outcome
- Customer channel properly configured
- Clear documentation of customer events
- Standard message format established
- Subscriber list documented
- Privacy considerations addressed
- Validation rules defined

### Verification Checklist
- [ ] CUSTOMER_CHANNEL constant defined
- [ ] Customer channel builder function created
- [ ] Customer events documented (CREATED, UPDATED)
- [ ] Message structure specified
- [ ] Event triggers identified
- [ ] Subscriber list documented
- [ ] Validation rules added
- [ ] Priority levels set
- [ ] Privacy considerations documented
- [ ] Sensitive data exclusions noted
- [ ] Examples provided
- [ ] Comments and docstrings complete

---

## Task 08: Create Message Schema

### Overview
Define the standardized message schema that all Redis Pub/Sub messages must follow. This schema ensures consistency across all channels, enabling reliable message parsing, validation, and processing. The schema includes required fields, data types, and structure that every message must conform to regardless of entity type or event.

### Dependencies
- Task 07: Create Customer Channel (all channels defined)

### Instructions

1. **Create schemas.py file**
   - Create new file `schemas.py` in `backend/apps/sync/`
   - This file will contain message schema definitions

2. **Define base message schema class**
   - Create class or data structure for message schema
   - Include all required fields
   - Use proper typing annotations

3. **Define event_id field**
   - Type: String (UUID format)
   - Purpose: Unique identifier for each message
   - Generate using UUID library

4. **Define event_type field**
   - Type: String
   - Purpose: Identifies the type of event
   - Examples: INVENTORY_UPDATED, PRODUCT_CREATED

5. **Define entity_type field**
   - Type: String
   - Purpose: Identifies the entity category
   - Examples: inventory, product, order, customer

6. **Define entity_id field**
   - Type: String
   - Purpose: Identifies the specific entity instance
   - Examples: product_123, order_456

7. **Define tenant_id field**
   - Type: String
   - Purpose: Ensures tenant isolation
   - Required for all messages

8. **Define data field**
   - Type: Object/Dictionary
   - Purpose: Contains entity-specific payload
   - Structure varies by entity type

9. **Define timestamp field**
   - Type: DateTime (ISO 8601 format)
   - Purpose: Records when event occurred
   - Use UTC timezone

10. **Define version field**
    - Type: Number/Integer
    - Purpose: Schema version for compatibility
    - Start with version 1

11. **Add optional metadata field**
    - Type: Object/Dictionary (optional)
    - Purpose: Additional context or debugging info
    - Examples: source system, user_id, request_id

12. **Create schema validation function**
    - Function to validate message against schema
    - Check all required fields present
    - Verify data types correct

13. **Add schema documentation**
    - Document each field's purpose
    - Provide examples of valid messages
    - Include schema version history

### Message Schema Structure

```
Message Schema
├── event_id (string, UUID)
├── event_type (string)
├── entity_type (string)
├── entity_id (string)
├── tenant_id (string)
├── data (object)
├── timestamp (string, ISO 8601)
├── version (number)
└── metadata (object, optional)
```

### Schema Field Specifications

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| event_id | UUID string | Yes | Unique event identifier | "550e8400-e29b-41d4-a716-446655440000" |
| event_type | String | Yes | Type of event | "INVENTORY_UPDATED" |
| entity_type | String | Yes | Entity category | "inventory" |
| entity_id | String | Yes | Specific entity ID | "prod_123" |
| tenant_id | String | Yes | Tenant identifier | "tenant_001" |
| data | Object | Yes | Event payload | {"quantity": 100} |
| timestamp | ISO datetime | Yes | Event timestamp | "2026-01-31T10:30:00Z" |
| version | Number | Yes | Schema version | 1 |
| metadata | Object | No | Additional context | {"source": "POS"} |

### Data Type Specifications

| Type | Format | Validation | Examples |
|------|--------|------------|----------|
| UUID | String, 36 chars | Valid UUID v4 | "550e8400-e29b-41d4-a716-446655440000" |
| String | Text | Not empty | "INVENTORY_UPDATED" |
| Object | JSON object | Valid JSON | {"key": "value"} |
| DateTime | ISO 8601 | Valid datetime | "2026-01-31T10:30:00Z" |
| Number | Integer/Float | Numeric | 1, 2.5 |

### Complete Message Example

```
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_type": "INVENTORY_UPDATED",
  "entity_type": "inventory",
  "entity_id": "prod_12345",
  "tenant_id": "tenant_001",
  "data": {
    "product_id": "prod_12345",
    "sku": "SKU-001",
    "quantity": 100,
    "warehouse_id": "warehouse_01"
  },
  "timestamp": "2026-01-31T10:30:00Z",
  "version": 1,
  "metadata": {
    "source": "ERP",
    "user_id": "user_789",
    "request_id": "req_xyz"
  }
}
```

### Entity-Specific Data Structures

| Entity Type | Data Structure | Key Fields |
|-------------|----------------|------------|
| inventory | Inventory data | product_id, sku, quantity, warehouse_id |
| price | Pricing data | product_id, price, currency, sale_price |
| order | Order data | order_id, status, customer_id, items, total |
| product | Product data | product_id, sku, name, description, category |
| customer | Customer data | customer_id, name, email, phone, loyalty_points |

### Schema Validation Rules

| Rule | Check | Action if Failed |
|------|-------|------------------|
| All required fields present | Check each field | Reject message |
| Data types correct | Validate types | Reject message |
| UUID format valid | Regex check | Reject message |
| Timestamp format valid | ISO 8601 parse | Reject message |
| Tenant ID not empty | String check | Reject message |
| Data field is object | Type check | Reject message |

### Schema Versioning Strategy

| Version | Changes | Compatibility |
|---------|---------|---------------|
| 1 | Initial schema | N/A |
| 2 (future) | Add new optional field | Backward compatible |
| 3 (future) | Modify required field | Breaking change |

### Schema Evolution Guidelines

| Change Type | Version Increment | Migration Required |
|-------------|-------------------|-------------------|
| Add optional field | Minor (1.1) | No |
| Add required field | Major (2.0) | Yes |
| Remove field | Major (2.0) | Yes |
| Rename field | Major (2.0) | Yes |
| Change type | Major (2.0) | Yes |

### Validation Error Types

| Error | Description | Resolution |
|-------|-------------|------------|
| MissingFieldError | Required field missing | Add missing field |
| InvalidTypeError | Field has wrong type | Convert to correct type |
| InvalidFormatError | Format doesn't match spec | Reformat data |
| EmptyValueError | Required field is empty | Provide value |

### Expected Outcome
- Standard message schema defined and documented
- All required fields specified with types
- Validation function created
- Examples provided for all entity types
- Schema version tracking established
- Clear documentation for developers

### Verification Checklist
- [ ] `backend/apps/sync/schemas.py` file created
- [ ] Base message schema defined
- [ ] All required fields specified (event_id, event_type, etc.)
- [ ] Data types documented for each field
- [ ] timestamp in ISO 8601 format
- [ ] version field included
- [ ] Optional metadata field added
- [ ] Validation function implemented
- [ ] Complete message examples provided
- [ ] Entity-specific data structures documented
- [ ] Schema versioning strategy defined
- [ ] Comments and docstrings complete

---

## Summary

This document established the foundational Redis Pub/Sub infrastructure including Redis configuration, channel naming conventions, individual channel definitions for five entity types (inventory, prices, orders, products, customers), and the standardized message schema that ensures consistency across all real-time messages.

### Completed Tasks
1. ✓ Created Redis Config with connection settings and database isolation
2. ✓ Created Channel Naming conventions with tenant-aware patterns
3. ✓ Created Inventory Channel for stock level synchronization
4. ✓ Created Price Channel for pricing updates
5. ✓ Created Order Channel for order lifecycle events
6. ✓ Created Product Channel for catalog synchronization
7. ✓ Created Customer Channel for customer data sync
8. ✓ Created Message Schema with required fields and validation

### Key Deliverables
- Redis configuration with proper isolation (Database 1)
- Tenant-aware channel naming pattern: `{entity_type}:{tenant_id}`
- Five entity-specific channels (inventory, prices, orders, products, customers)
- Standardized message schema with 9 fields
- Validation rules for messages and channels
- Comprehensive documentation with examples

### Next Steps
Proceed to [02_Tasks-09-16_Publisher-Subscriber.md](02_Tasks-09-16_Publisher-Subscriber.md) to create the publisher and subscriber classes, message serialization, validation, retry handling, and dead letter queue implementation.
