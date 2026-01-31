# Tasks 09-16: Publisher, Subscriber, and Message Handling

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 09 - Real-time Sync Engine  
> **Group:** A - Redis Pub/Sub Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Redis-Channels.md](01_Tasks-01-08_Redis-Channels.md)

---

## Document Overview

This document covers the implementation of the Redis Pub/Sub messaging system including event type definitions, publisher and subscriber classes, message serialization and validation, error handling with retry logic, dead letter queue for failed messages, and final verification of the complete Redis setup.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create Event Types | Low | 15 min |
| 10 | Create Publisher Class | Medium | 35 min |
| 11 | Create Subscriber Class | Medium | 40 min |
| 12 | Create Message Serializer | Low | 25 min |
| 13 | Create Message Validator | Low | 30 min |
| 14 | Create Retry Handler | Medium | 35 min |
| 15 | Create Dead Letter Queue | Low | 25 min |
| 16 | Verify Redis Setup | Low | 30 min |

---

## Task 09: Create Event Types

### Overview
Define all event type constants that will be used throughout the Redis Pub/Sub system. Event types provide a standardized vocabulary for describing what happened to entities, enabling consistent event handling across all subscribers. These constants ensure type safety and prevent typos in event type strings.

### Dependencies
- Task 08: Create Message Schema

### Instructions

1. **Create events.py file**
   - Create new file `events.py` in `backend/apps/sync/`
   - This file will contain all event type constants

2. **Define base event type constants**
   - Create constants for fundamental events
   - Include CREATED, UPDATED, DELETED types
   - Use uppercase naming convention

3. **Define inventory event types**
   - Create INVENTORY_UPDATED constant
   - Document when this event is triggered
   - Note that inventory typically only has UPDATE events

4. **Define price event types**
   - Create PRICE_UPDATED constant
   - Document pricing change scenarios
   - Note schedule-based vs immediate updates

5. **Define product event types**
   - Create PRODUCT_CREATED constant
   - Create PRODUCT_UPDATED constant
   - Create PRODUCT_DELETED constant
   - Document product lifecycle events

6. **Define order event types**
   - Create ORDER_CREATED constant
   - Create ORDER_UPDATED constant
   - Document order status transitions

7. **Define customer event types**
   - Create CUSTOMER_CREATED constant
   - Create CUSTOMER_UPDATED constant
   - Document customer profile events

8. **Create event type registry**
   - Build list or dictionary of all valid event types
   - Enable validation against this registry
   - Support programmatic event type lookups

9. **Add event type documentation**
   - Document each event type's purpose
   - Provide usage examples
   - Note which channels use which events

10. **Create event type validation function**
    - Function to check if event type is valid
    - Return boolean or raise exception
    - Support case-insensitive checks if needed

### Event Type Categories

```
Event Types
├── Generic Events
│   ├── CREATED
│   ├── UPDATED
│   └── DELETED
├── Inventory Events
│   └── INVENTORY_UPDATED
├── Price Events
│   └── PRICE_UPDATED
├── Product Events
│   ├── PRODUCT_CREATED
│   ├── PRODUCT_UPDATED
│   └── PRODUCT_DELETED
├── Order Events
│   ├── ORDER_CREATED
│   └── ORDER_UPDATED
└── Customer Events
    ├── CUSTOMER_CREATED
    └── CUSTOMER_UPDATED
```

### Event Type Constants

| Constant | Value | Entity | Description |
|----------|-------|--------|-------------|
| INVENTORY_UPDATED | "INVENTORY_UPDATED" | Inventory | Stock level changed |
| PRICE_UPDATED | "PRICE_UPDATED" | Price | Price or discount changed |
| PRODUCT_CREATED | "PRODUCT_CREATED" | Product | New product added |
| PRODUCT_UPDATED | "PRODUCT_UPDATED" | Product | Product details changed |
| PRODUCT_DELETED | "PRODUCT_DELETED" | Product | Product discontinued |
| ORDER_CREATED | "ORDER_CREATED" | Order | New order placed |
| ORDER_UPDATED | "ORDER_UPDATED" | Order | Order status/details changed |
| CUSTOMER_CREATED | "CUSTOMER_CREATED" | Customer | New customer registered |
| CUSTOMER_UPDATED | "CUSTOMER_UPDATED" | Customer | Customer profile updated |

### Event Type to Channel Mapping

| Event Type | Channel | Frequency | Priority |
|------------|---------|-----------|----------|
| INVENTORY_UPDATED | inventory:{tenant_id} | High | High |
| PRICE_UPDATED | prices:{tenant_id} | Medium | Medium-High |
| PRODUCT_CREATED | products:{tenant_id} | Low | Medium |
| PRODUCT_UPDATED | products:{tenant_id} | Medium | Medium |
| PRODUCT_DELETED | products:{tenant_id} | Low | Medium |
| ORDER_CREATED | orders:{tenant_id} | High | High |
| ORDER_UPDATED | orders:{tenant_id} | High | High |
| CUSTOMER_CREATED | customers:{tenant_id} | Low | Medium |
| CUSTOMER_UPDATED | customers:{tenant_id} | Low | Medium |

### Event Type Usage Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| Single event entity | Only one event type | Inventory (only UPDATED) |
| Create/Update entity | Two event types | Customer (CREATED, UPDATED) |
| Full lifecycle entity | Three event types | Product (CREATED, UPDATED, DELETED) |

### Event Lifecycle by Entity

```
Inventory
    └── INVENTORY_UPDATED

Price
    └── PRICE_UPDATED

Product
    PRODUCT_CREATED → PRODUCT_UPDATED → PRODUCT_DELETED

Order
    ORDER_CREATED → ORDER_UPDATED

Customer
    CUSTOMER_CREATED → CUSTOMER_UPDATED
```

### Event Type Validation

| Check | Purpose | Implementation |
|-------|---------|----------------|
| Exists in registry | Prevent typos | Check against constants list |
| Matches entity type | Ensure consistency | Validate entity-event pairing |
| Not empty | Catch errors | String length check |

### Event Registry Structure

```python
EVENT_REGISTRY = {
    "inventory": ["INVENTORY_UPDATED"],
    "prices": ["PRICE_UPDATED"],
    "products": ["PRODUCT_CREATED", "PRODUCT_UPDATED", "PRODUCT_DELETED"],
    "orders": ["ORDER_CREATED", "ORDER_UPDATED"],
    "customers": ["CUSTOMER_CREATED", "CUSTOMER_UPDATED"]
}
```

### Event Type Best Practices

| Practice | Reason | Example |
|----------|--------|---------|
| Use constants | Prevent typos | Use PRODUCT_CREATED not "product_created" |
| Past tense | Describes what happened | CREATED not CREATE |
| Specific names | Clear meaning | INVENTORY_UPDATED not CHANGED |
| Consistent format | Easy to parse | ENTITY_ACTION format |

### Expected Outcome
- All event types defined as constants
- Event registry created for validation
- Clear documentation of event usage
- Validation function for event types
- Entity-to-event mapping documented

### Verification Checklist
- [ ] `backend/apps/sync/events.py` file created
- [ ] All inventory event types defined (INVENTORY_UPDATED)
- [ ] All price event types defined (PRICE_UPDATED)
- [ ] All product event types defined (CREATED, UPDATED, DELETED)
- [ ] All order event types defined (CREATED, UPDATED)
- [ ] All customer event types defined (CREATED, UPDATED)
- [ ] Event registry created
- [ ] Event validation function implemented
- [ ] Event-to-channel mapping documented
- [ ] Constants use uppercase naming
- [ ] Documentation and examples provided

---

## Task 10: Create Publisher Class

### Overview
Create the base publisher class that handles publishing messages to Redis Pub/Sub channels. This class provides a reusable interface for publishing events from any part of the application, handles connection management, message formatting, and error handling during the publishing process.

### Dependencies
- Task 09: Create Event Types

### Instructions

1. **Create publisher directory**
   - Create new directory `publisher` in `backend/apps/sync/`
   - Initialize as Python package with `__init__.py`

2. **Create base publisher file**
   - Create `base.py` in `backend/apps/sync/publisher/`
   - This will contain the BasePublisher class

3. **Define BasePublisher class**
   - Create class with proper initialization
   - Accept Redis configuration in constructor
   - Store configuration for connection

4. **Implement Redis connection method**
   - Create method to establish Redis connection
   - Use configuration from Task 01
   - Handle connection errors gracefully

5. **Create publish method**
   - Define method signature: `publish(channel, message)`
   - Accept channel name and message dictionary
   - Return success/failure indicator

6. **Implement channel validation**
   - Validate channel name format before publishing
   - Ensure channel follows naming convention
   - Raise error for invalid channels

7. **Implement message validation**
   - Validate message against schema from Task 08
   - Ensure all required fields present
   - Check data types correct

8. **Add message serialization**
   - Convert message dictionary to JSON string
   - Handle serialization errors
   - Ensure proper encoding

9. **Execute Redis publish**
   - Call Redis PUBLISH command
   - Pass channel and serialized message
   - Capture publish result (subscriber count)

10. **Add error handling**
    - Catch Redis connection errors
    - Catch serialization errors
    - Log errors appropriately

11. **Implement connection pooling**
    - Use connection pool for efficiency
    - Reuse connections across publishes
    - Handle pool exhaustion

12. **Add logging and monitoring**
    - Log successful publishes
    - Log failures with details
    - Track metrics (publishes per second, etc.)

13. **Create convenience methods**
    - Create entity-specific publish methods
    - Example: `publish_inventory_update(tenant_id, data)`
    - Simplify common publishing patterns

14. **Add retry logic**
    - Retry failed publishes automatically
    - Use exponential backoff
    - Limit retry attempts

15. **Document publisher class**
    - Add comprehensive docstrings
    - Provide usage examples
    - Document error handling behavior

### BasePublisher Class Structure

```
BasePublisher
├── __init__(config)
├── connect()
├── publish(channel, message)
├── validate_channel(channel)
├── validate_message(message)
├── serialize_message(message)
├── close()
└── Convenience Methods
    ├── publish_inventory_update()
    ├── publish_price_update()
    ├── publish_product_event()
    ├── publish_order_event()
    └── publish_customer_event()
```

### Publisher Method Specifications

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| __init__ | config | None | Initialize publisher with config |
| connect | None | connection | Establish Redis connection |
| publish | channel, message | bool/result | Publish message to channel |
| validate_channel | channel | bool | Verify channel name valid |
| validate_message | message | bool | Verify message schema |
| serialize_message | message | string | Convert to JSON |
| close | None | None | Close Redis connection |

### Publish Method Flow

```
publish(channel, message)
    │
    ├─→ Validate channel name
    │   └── Raise error if invalid
    │
    ├─→ Validate message schema
    │   └── Raise error if invalid
    │
    ├─→ Serialize message to JSON
    │   └── Handle serialization errors
    │
    ├─→ Execute Redis PUBLISH
    │   └── Handle Redis errors
    │
    ├─→ Log result
    │   └── Success or failure
    │
    └─→ Return result
        └── True/False or exception
```

### Connection Management

| Aspect | Implementation | Benefit |
|--------|----------------|---------|
| Connection Pool | Use Redis connection pool | Reuse connections |
| Lazy Connection | Connect on first publish | Defer overhead |
| Auto-Reconnect | Reconnect on connection loss | Resilience |
| Health Check | Periodic ping to Redis | Early detection |

### Error Handling Strategy

| Error Type | Action | Recovery |
|------------|--------|----------|
| Connection Error | Log and retry | Exponential backoff |
| Serialization Error | Log and reject | Return error to caller |
| Validation Error | Log and reject | Return error to caller |
| Redis Command Error | Log and retry | Limited retries |
| Channel Not Found | Log and reject | Fix channel name |

### Publishing Patterns

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| Fire and Forget | Non-critical events | Publish without waiting |
| Confirmed Publish | Critical events | Check subscriber count |
| Batch Publish | Multiple events | Use pipeline for efficiency |
| Transactional | Atomic operations | Use Redis transactions |

### Message Publishing Example

```
Step 1: Prepare message
message = {
    "event_id": uuid4(),
    "event_type": "INVENTORY_UPDATED",
    "entity_type": "inventory",
    "entity_id": "prod_123",
    "tenant_id": "tenant_001",
    "data": {"quantity": 100},
    "timestamp": datetime.utcnow().isoformat(),
    "version": 1
}

Step 2: Build channel name
channel = build_channel_name("inventory", "tenant_001")

Step 3: Publish
publisher = BasePublisher(config)
result = publisher.publish(channel, message)
```

### Performance Considerations

| Concern | Solution | Impact |
|---------|----------|--------|
| High throughput | Use connection pooling | Faster publishes |
| Large messages | Consider compression | Reduced bandwidth |
| Network latency | Use local Redis instance | Lower latency |
| Concurrent publishes | Thread-safe implementation | Prevent corruption |

### Monitoring and Metrics

| Metric | Purpose | Implementation |
|--------|---------|----------------|
| Publish count | Track volume | Counter |
| Publish latency | Measure performance | Timer |
| Error rate | Monitor failures | Counter |
| Subscriber count | Verify delivery | Check publish result |

### Publisher Usage Example

```
Usage Pattern 1: Direct Publish
publisher = BasePublisher(redis_config)
publisher.publish(channel, message)

Usage Pattern 2: Convenience Method
publisher.publish_inventory_update(
    tenant_id="tenant_001",
    product_id="prod_123",
    quantity=100
)

Usage Pattern 3: Batch Publish
with publisher.pipeline() as pipe:
    pipe.publish(channel1, message1)
    pipe.publish(channel2, message2)
    pipe.execute()
```

### Expected Outcome
- Functional publisher class for Redis Pub/Sub
- Connection management with pooling
- Message validation and serialization
- Error handling and retry logic
- Logging and monitoring
- Convenience methods for common operations
- Thread-safe implementation

### Verification Checklist
- [ ] `backend/apps/sync/publisher/` directory created
- [ ] `backend/apps/sync/publisher/__init__.py` file created
- [ ] `backend/apps/sync/publisher/base.py` file created
- [ ] BasePublisher class defined
- [ ] Redis connection method implemented
- [ ] publish() method implemented
- [ ] Channel validation added
- [ ] Message validation added
- [ ] Message serialization implemented
- [ ] Error handling included
- [ ] Connection pooling configured
- [ ] Logging added
- [ ] Convenience methods created
- [ ] Retry logic implemented
- [ ] Documentation complete with examples
- [ ] Can successfully publish test message

---

## Task 11: Create Subscriber Class

### Overview
Create the base subscriber class that handles subscribing to Redis Pub/Sub channels and processing received messages. This class provides a reusable interface for consuming events, manages long-running subscription connections, handles message deserialization, and routes messages to appropriate callback handlers.

### Dependencies
- Task 10: Create Publisher Class

### Instructions

1. **Create consumer directory**
   - Create new directory `consumer` in `backend/apps/sync/`
   - Initialize as Python package with `__init__.py`
   - Note: Using "consumer" instead of "subscriber" to match Django patterns

2. **Create base subscriber file**
   - Create `base.py` in `backend/apps/sync/consumer/`
   - This will contain the BaseSubscriber class

3. **Define BaseSubscriber class**
   - Create class with proper initialization
   - Accept Redis configuration in constructor
   - Store configuration and callback handlers

4. **Implement Redis connection method**
   - Create method to establish Redis connection for Pub/Sub
   - Use separate connection for subscriptions (not from pool)
   - Handle connection errors gracefully

5. **Create subscribe method**
   - Define method signature: `subscribe(channel, callback)`
   - Accept channel name and callback function
   - Register callback for the channel

6. **Implement channel subscription**
   - Call Redis SUBSCRIBE command
   - Register channel with Redis
   - Handle subscription errors

7. **Create message listening loop**
   - Implement method to listen for messages
   - Run in continuous loop
   - Break on stop signal or error

8. **Implement message deserialization**
   - Receive raw message from Redis
   - Parse JSON string back to dictionary
   - Handle deserialization errors

9. **Add message validation**
   - Validate received message against schema
   - Log invalid messages
   - Optionally send to dead letter queue

10. **Implement callback execution**
    - Call registered callback with message
    - Pass deserialized message dictionary
    - Handle callback exceptions

11. **Create unsubscribe method**
    - Define method signature: `unsubscribe(channel)`
    - Unregister callback for channel
    - Call Redis UNSUBSCRIBE command

12. **Add pattern subscription support**
    - Implement `psubscribe(pattern, callback)` method
    - Support wildcard patterns like `inventory:*`
    - Handle pattern-based message routing

13. **Implement graceful shutdown**
    - Create stop method to halt listener
    - Cleanup connections and resources
    - Ensure no message loss during shutdown

14. **Add error handling**
    - Catch Redis connection errors
    - Handle deserialization errors
    - Catch and log callback exceptions

15. **Implement thread safety**
    - Ensure subscriber can run in separate thread
    - Use thread-safe callback registration
    - Handle concurrent message processing

16. **Add logging and monitoring**
    - Log subscriptions and unsubscriptions
    - Log received messages
    - Track metrics (messages per second, etc.)

17. **Create convenience methods**
    - Create entity-specific subscribe methods
    - Example: `subscribe_to_inventory(tenant_id, callback)`
    - Simplify common subscription patterns

18. **Document subscriber class**
    - Add comprehensive docstrings
    - Provide usage examples
    - Document threading model

### BaseSubscriber Class Structure

```
BaseSubscriber
├── __init__(config)
├── connect()
├── subscribe(channel, callback)
├── unsubscribe(channel)
├── psubscribe(pattern, callback)
├── punsubscribe(pattern)
├── listen()
├── stop()
├── deserialize_message(data)
├── validate_message(message)
├── execute_callback(message)
└── Convenience Methods
    ├── subscribe_to_inventory()
    ├── subscribe_to_prices()
    ├── subscribe_to_products()
    ├── subscribe_to_orders()
    └── subscribe_to_customers()
```

### Subscriber Method Specifications

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| __init__ | config | None | Initialize subscriber with config |
| connect | None | connection | Establish Redis Pub/Sub connection |
| subscribe | channel, callback | None | Subscribe to specific channel |
| unsubscribe | channel | None | Unsubscribe from channel |
| psubscribe | pattern, callback | None | Subscribe to channel pattern |
| punsubscribe | pattern | None | Unsubscribe from pattern |
| listen | None | None | Start message listening loop |
| stop | None | None | Stop listening and cleanup |
| deserialize_message | data | dict | Parse JSON message |
| validate_message | message | bool | Verify message schema |
| execute_callback | message | None | Call registered handler |

### Subscription Flow

```
subscribe(channel, callback)
    │
    ├─→ Validate channel name
    │   └── Raise error if invalid
    │
    ├─→ Register callback
    │   └── Store in callback registry
    │
    ├─→ Execute Redis SUBSCRIBE
    │   └── Handle Redis errors
    │
    └─→ Log subscription
        └── Success confirmation
```

### Message Processing Flow

```
listen()
    │
    └─→ Continuous Loop
        │
        ├─→ Wait for message from Redis
        │   └── Blocking wait with timeout
        │
        ├─→ Receive raw message
        │   └── Extract channel and data
        │
        ├─→ Deserialize message
        │   └── Parse JSON to dictionary
        │
        ├─→ Validate message
        │   └── Check against schema
        │
        ├─→ Look up callback
        │   └── Find handler for channel
        │
        ├─→ Execute callback
        │   └── Pass message to handler
        │
        └─→ Handle errors
            └── Log and continue
```

### Connection Management

| Aspect | Implementation | Reason |
|--------|----------------|--------|
| Dedicated Connection | Separate from publish pool | Pub/Sub requires dedicated connection |
| Long-Running | Keep connection open | Continuous message delivery |
| Auto-Reconnect | Reconnect on disconnect | Maintain subscription |
| Heartbeat | Periodic health check | Detect connection issues |

### Callback Handler Pattern

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Single Callback | One handler per channel | Simple processing |
| Multiple Callbacks | Multiple handlers per channel | Different processing steps |
| Pattern Callbacks | One handler for multiple channels | Unified entity handling |
| Async Callbacks | Non-blocking handlers | High throughput |

### Error Handling Strategy

| Error Type | Action | Recovery |
|------------|--------|----------|
| Connection Error | Log, reconnect | Resume subscription |
| Deserialization Error | Log, skip message | Continue listening |
| Validation Error | Log, optionally DLQ | Continue listening |
| Callback Error | Log, continue | Don't stop listener |
| Stop Signal | Cleanup, exit | Graceful shutdown |

### Threading Model

```
Main Thread
    │
    └─→ Start Subscriber

Subscriber Thread (listener)
    │
    ├─→ Wait for messages
    ├─→ Process message
    ├─→ Execute callback
    └─→ Loop

Callback Execution
    ├── Option 1: Inline (blocking)
    └── Option 2: Queue for async (non-blocking)
```

### Subscription Patterns

| Pattern Type | Syntax | Matches |
|--------------|--------|---------|
| Exact | `inventory:tenant_001` | Only that channel |
| Wildcard | `inventory:*` | All inventory channels |
| Multi-Entity | Multiple subscribes | Different entity types |
| All Tenant | `*:tenant_001` | All entities for one tenant |

### Message Validation in Subscriber

| Check | Purpose | Action if Failed |
|-------|---------|------------------|
| Valid JSON | Ensure parseable | Log, skip message |
| Schema compliance | Verify structure | Log, optionally DLQ |
| Tenant isolation | Ensure correct tenant | Log, reject |
| Event type valid | Known event type | Log, skip |

### Subscriber Usage Example

```
Usage Pattern 1: Direct Subscribe
def on_inventory_update(message):
    product_id = message['data']['product_id']
    quantity = message['data']['quantity']
    # Update local cache

subscriber = BaseSubscriber(redis_config)
subscriber.subscribe("inventory:tenant_001", on_inventory_update)
subscriber.listen()  # Blocks and listens

Usage Pattern 2: Pattern Subscribe
def on_any_inventory(message):
    # Handle inventory from any tenant
    pass

subscriber.psubscribe("inventory:*", on_any_inventory)
subscriber.listen()

Usage Pattern 3: Multiple Channels
subscriber.subscribe("inventory:tenant_001", on_inventory)
subscriber.subscribe("prices:tenant_001", on_price)
subscriber.subscribe("orders:tenant_001", on_order)
subscriber.listen()
```

### Graceful Shutdown Process

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Receive stop signal | Initiate shutdown |
| 2 | Stop listening loop | No new messages |
| 3 | Process pending messages | Complete in-flight |
| 4 | Unsubscribe from channels | Clean Redis state |
| 5 | Close connection | Release resources |
| 6 | Exit thread | Cleanup complete |

### Monitoring and Metrics

| Metric | Purpose | Implementation |
|--------|---------|----------------|
| Message count | Track volume | Counter per channel |
| Processing latency | Measure delay | Timer from timestamp to callback |
| Error rate | Monitor failures | Counter for each error type |
| Active subscriptions | Track channels | Count registered callbacks |

### Expected Outcome
- Functional subscriber class for Redis Pub/Sub
- Long-running message listener
- Message deserialization and validation
- Callback execution with error handling
- Pattern subscription support
- Graceful shutdown capability
- Thread-safe implementation
- Logging and monitoring

### Verification Checklist
- [ ] `backend/apps/sync/consumer/` directory created
- [ ] `backend/apps/sync/consumer/__init__.py` file created
- [ ] `backend/apps/sync/consumer/base.py` file created
- [ ] BaseSubscriber class defined
- [ ] Redis connection method implemented
- [ ] subscribe() method implemented
- [ ] unsubscribe() method implemented
- [ ] psubscribe() for pattern support
- [ ] listen() method with message loop
- [ ] stop() method for graceful shutdown
- [ ] Message deserialization implemented
- [ ] Message validation added
- [ ] Callback execution with error handling
- [ ] Thread-safe implementation
- [ ] Auto-reconnect on disconnect
- [ ] Logging added
- [ ] Convenience methods created
- [ ] Documentation complete with examples
- [ ] Can successfully receive test messages

---

## Task 12: Create Message Serializer

### Overview
Create the message serializer utility that handles converting message dictionaries to JSON strings for publishing and parsing JSON strings back to dictionaries for consuming. This serializer ensures consistent encoding, handles special data types, and provides error handling for serialization issues.

### Dependencies
- Task 11: Create Subscriber Class

### Instructions

1. **Add serializer to schemas.py**
   - Open `backend/apps/sync/schemas.py`
   - Add serialization functions to existing file
   - Keep serialization logic with schema definitions

2. **Create serialize function**
   - Define function: `serialize_message(message)`
   - Accept message dictionary as input
   - Return JSON string

3. **Implement JSON encoding**
   - Use JSON library to convert dictionary to string
   - Set ensure_ascii parameter appropriately
   - Configure indentation for readability (optional)

4. **Handle datetime serialization**
   - Convert datetime objects to ISO 8601 strings
   - Use custom JSON encoder if needed
   - Ensure UTC timezone

5. **Handle UUID serialization**
   - Convert UUID objects to strings
   - Preserve UUID format
   - Handle None values

6. **Add custom object handling**
   - Create custom JSON encoder class
   - Handle special types (Decimal, Date, etc.)
   - Provide fallback for unknown types

7. **Create deserialize function**
   - Define function: `deserialize_message(json_string)`
   - Accept JSON string as input
   - Return message dictionary

8. **Implement JSON decoding**
   - Use JSON library to parse string
   - Handle malformed JSON
   - Validate structure after parsing

9. **Handle datetime deserialization**
   - Parse ISO 8601 strings back to datetime
   - Restore timezone information
   - Handle invalid date formats

10. **Add error handling**
    - Catch JSONDecodeError for invalid JSON
    - Catch ValueError for invalid data
    - Raise custom exceptions with context

11. **Implement validation after deserialization**
    - Verify required fields present
    - Check data types
    - Optionally use validation from Task 13

12. **Add encoding options**
    - Support pretty printing for debugging
    - Support compact format for production
    - Allow custom encoder configuration

13. **Create utility functions**
    - Function to check if string is valid JSON
    - Function to get message size after serialization
    - Function to sanitize sensitive data before logging

14. **Document serializer functions**
    - Add docstrings explaining usage
    - Provide examples of serialization
    - Document error handling behavior

### Serializer Function Structure

```
Message Serialization
├── serialize_message(message)
│   ├── Handle datetime objects
│   ├── Handle UUID objects
│   ├── Custom encoder for special types
│   └── Return JSON string
└── deserialize_message(json_string)
    ├── Parse JSON string
    ├── Convert ISO strings to datetime
    ├── Validate structure
    └── Return message dictionary
```

### Serializer Function Specifications

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| serialize_message | message (dict) | string | Convert dict to JSON |
| deserialize_message | json_string (str) | dict | Parse JSON to dict |
| is_valid_json | json_string (str) | bool | Check if valid JSON |
| get_message_size | message (dict) | int | Get serialized size in bytes |
| sanitize_for_log | message (dict) | dict | Remove sensitive data |

### Serialization Flow

```
serialize_message(message)
    │
    ├─→ Validate message structure
    │   └── Check required fields
    │
    ├─→ Convert special types
    │   ├── datetime → ISO 8601 string
    │   ├── UUID → string
    │   └── Decimal → float/string
    │
    ├─→ Encode to JSON
    │   └── Use custom encoder
    │
    ├─→ Handle errors
    │   └── TypeError, ValueError
    │
    └─→ Return JSON string
```

### Deserialization Flow

```
deserialize_message(json_string)
    │
    ├─→ Parse JSON string
    │   └── Handle JSONDecodeError
    │
    ├─→ Validate structure
    │   └── Check required fields
    │
    ├─→ Convert string types back
    │   ├── ISO string → datetime
    │   └── String → UUID (if needed)
    │
    ├─→ Handle errors
    │   └── ValueError, KeyError
    │
    └─→ Return message dictionary
```

### Special Type Handling

| Type | Serialization | Deserialization |
|------|---------------|-----------------|
| datetime | ISO 8601 string | Parse ISO string |
| UUID | String format | String (no conversion) |
| Decimal | Float or string | String or float |
| None | null | None |
| bytes | Base64 string | Decode base64 |

### Custom JSON Encoder Example

```
Custom Encoder Class
├── Extends json.JSONEncoder
├── Override default() method
├── Handle datetime → ISO string
├── Handle UUID → string
├── Handle Decimal → float
└── Fallback to super() for others
```

### Error Handling

| Error Type | Scenario | Response |
|------------|----------|----------|
| TypeError | Non-serializable type | Log, raise SerializationError |
| JSONDecodeError | Invalid JSON string | Log, raise DeserializationError |
| ValueError | Invalid data value | Log, raise ValidationError |
| KeyError | Missing required field | Log, raise ValidationError |

### Serialization Options

| Option | Default | Purpose |
|--------|---------|---------|
| ensure_ascii | False | Allow Unicode characters |
| indent | None (production), 2 (debug) | Pretty print or compact |
| sort_keys | False | Deterministic output |
| separators | (',', ': ') | Compact format |

### Message Size Considerations

| Scenario | Recommendation | Reason |
|----------|----------------|--------|
| Large data field | Consider compression | Reduce Redis memory |
| Small message | No optimization needed | Overhead not worth it |
| Binary data | Use Base64 encoding | JSON compatibility |
| Frequent large messages | Evaluate architecture | May need different approach |

### Serialization Best Practices

| Practice | Benefit | Implementation |
|----------|---------|----------------|
| Use ISO 8601 | Standard format | datetime.isoformat() |
| Handle timezone | Avoid ambiguity | Always use UTC |
| Validate before serialize | Early error detection | Check schema first |
| Test edge cases | Prevent production issues | Unit tests |
| Log serialization errors | Debug issues | Include message excerpt |

### Usage Examples

```
Example 1: Serialize Message
message = {
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "event_type": "INVENTORY_UPDATED",
    "entity_type": "inventory",
    "entity_id": "prod_123",
    "tenant_id": "tenant_001",
    "data": {"quantity": 100},
    "timestamp": datetime.utcnow(),  # datetime object
    "version": 1
}

json_string = serialize_message(message)
# Returns: '{"event_id":"550e8400-...","timestamp":"2026-01-31T10:30:00Z",...}'

Example 2: Deserialize Message
json_string = '{"event_id":"550e8400-...","timestamp":"2026-01-31T10:30:00Z",...}'

message = deserialize_message(json_string)
# Returns: {"event_id": "550e8400-...", "timestamp": datetime(...), ...}

Example 3: Check Message Size
message_size = get_message_size(message)
# Returns: 256 (bytes)
```

### Sanitization for Logging

| Field | Action | Reason |
|-------|--------|--------|
| Sensitive data | Mask or remove | Security |
| Large fields | Truncate | Log size |
| Binary data | Omit | Readability |
| Personally Identifiable Info | Mask | Privacy compliance |

### Expected Outcome
- Functional serialization utilities
- Consistent JSON encoding/decoding
- Special type handling (datetime, UUID)
- Error handling for invalid data
- Utility functions for common operations
- Clear documentation with examples

### Verification Checklist
- [ ] Serialization functions added to schemas.py
- [ ] serialize_message() function implemented
- [ ] deserialize_message() function implemented
- [ ] datetime serialization handled (ISO 8601)
- [ ] UUID serialization handled
- [ ] Custom JSON encoder created if needed
- [ ] Error handling for serialization errors
- [ ] Error handling for deserialization errors
- [ ] is_valid_json() utility function
- [ ] get_message_size() utility function
- [ ] sanitize_for_log() utility function (optional)
- [ ] Documentation with examples
- [ ] Can serialize and deserialize test messages
- [ ] Handles special types correctly
- [ ] Proper error messages on failure

---

## Task 13: Create Message Validator

### Overview
Create the message validator that ensures all messages conform to the defined schema before publishing or after receiving. This validator checks for required fields, validates data types, verifies value constraints, and provides clear error messages for validation failures. Validation prevents malformed messages from propagating through the system.

### Dependencies
- Task 12: Create Message Serializer

### Instructions

1. **Add validator to schemas.py**
   - Open `backend/apps/sync/schemas.py`
   - Add validation functions to existing file
   - Keep validation logic with schema definitions

2. **Create validate_message function**
   - Define function: `validate_message(message)`
   - Accept message dictionary as input
   - Return validation result (bool or raise exception)

3. **Validate required fields presence**
   - Check event_id field exists
   - Check event_type field exists
   - Check entity_type, entity_id, tenant_id, data, timestamp, version
   - Raise ValidationError for missing fields

4. **Validate event_id format**
   - Verify event_id is string type
   - Check UUID format (36 characters with hyphens)
   - Use regex or UUID parsing for validation

5. **Validate event_type**
   - Verify event_type is string type
   - Check event_type is in valid event list
   - Use event registry from Task 09

6. **Validate entity_type**
   - Verify entity_type is string type
   - Check entity_type matches event_type
   - Ensure entity_type is recognized

7. **Validate entity_id**
   - Verify entity_id is string type
   - Check entity_id is not empty
   - Validate format if specific pattern required

8. **Validate tenant_id**
   - Verify tenant_id is string type
   - Check tenant_id is not empty
   - Validate format if specific pattern required

9. **Validate data field**
   - Verify data is dictionary/object type
   - Check data is not empty
   - Optionally validate entity-specific structure

10. **Validate timestamp field**
    - Verify timestamp is string or datetime
    - Check ISO 8601 format if string
    - Ensure timestamp is reasonable (not far future/past)

11. **Validate version field**
    - Verify version is integer/number type
    - Check version is positive
    - Verify version matches current schema version

12. **Add entity-specific validation**
    - Create validation functions for each entity type
    - Validate inventory data structure
    - Validate price, order, product, customer data

13. **Create validation error class**
    - Define custom ValidationError exception
    - Include field name and error message
    - Provide helpful error context

14. **Implement comprehensive error reporting**
    - Collect all validation errors, not just first
    - Return list of errors for debugging
    - Format errors clearly

15. **Add validation configuration**
    - Allow strict vs lenient validation
    - Configure required vs optional fields
    - Support schema version compatibility

16. **Document validator functions**
    - Add docstrings explaining validation rules
    - Provide examples of valid messages
    - Document common validation errors

### Validator Function Structure

```
Message Validation
├── validate_message(message)
│   ├── validate_required_fields()
│   ├── validate_event_id()
│   ├── validate_event_type()
│   ├── validate_entity_type()
│   ├── validate_entity_id()
│   ├── validate_tenant_id()
│   ├── validate_data()
│   ├── validate_timestamp()
│   └── validate_version()
├── validate_inventory_data(data)
├── validate_price_data(data)
├── validate_order_data(data)
├── validate_product_data(data)
└── validate_customer_data(data)
```

### Validator Function Specifications

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| validate_message | message (dict) | bool or raises | Validate complete message |
| validate_required_fields | message (dict) | None or raises | Check all fields present |
| validate_event_id | event_id (str) | None or raises | Validate UUID format |
| validate_event_type | event_type (str) | None or raises | Check valid event type |
| validate_timestamp | timestamp (str) | None or raises | Check ISO 8601 format |
| validate_inventory_data | data (dict) | None or raises | Inventory-specific validation |
| validate_price_data | data (dict) | None or raises | Price-specific validation |
| validate_order_data | data (dict) | None or raises | Order-specific validation |
| validate_product_data | data (dict) | None or raises | Product-specific validation |
| validate_customer_data | data (dict) | None or raises | Customer-specific validation |

### Validation Flow

```
validate_message(message)
    │
    ├─→ Check message is dict
    │   └── Raise TypeError if not
    │
    ├─→ Validate required fields present
    │   └── Raise ValidationError if missing
    │
    ├─→ Validate field types
    │   └── Check each field type correct
    │
    ├─→ Validate field formats
    │   ├── UUID format for event_id
    │   ├── ISO format for timestamp
    │   └── Other format checks
    │
    ├─→ Validate field values
    │   ├── Event type in registry
    │   ├── Entity type recognized
    │   └── Version number valid
    │
    ├─→ Validate data structure
    │   └── Entity-specific validation
    │
    └─→ Return True or raise ValidationError
```

### Required Field Validation

| Field | Check | Error Message |
|-------|-------|---------------|
| event_id | Present and non-empty | "Missing required field: event_id" |
| event_type | Present and non-empty | "Missing required field: event_type" |
| entity_type | Present and non-empty | "Missing required field: entity_type" |
| entity_id | Present and non-empty | "Missing required field: entity_id" |
| tenant_id | Present and non-empty | "Missing required field: tenant_id" |
| data | Present and is dict | "Missing required field: data" |
| timestamp | Present and non-empty | "Missing required field: timestamp" |
| version | Present and is number | "Missing required field: version" |

### Type Validation Rules

| Field | Expected Type | Validation |
|-------|---------------|------------|
| event_id | string | isinstance(message['event_id'], str) |
| event_type | string | isinstance(message['event_type'], str) |
| entity_type | string | isinstance(message['entity_type'], str) |
| entity_id | string | isinstance(message['entity_id'], str) |
| tenant_id | string | isinstance(message['tenant_id'], str) |
| data | dict/object | isinstance(message['data'], dict) |
| timestamp | string | isinstance(message['timestamp'], str) |
| version | int/number | isinstance(message['version'], int) |

### Format Validation Rules

| Field | Format | Validation Method |
|-------|--------|-------------------|
| event_id | UUID v4 | Regex or UUID parse |
| timestamp | ISO 8601 | datetime.fromisoformat() |
| event_type | UPPERCASE_UNDERSCORE | In event registry |
| tenant_id | Alphanumeric | Regex pattern |

### Entity-Specific Validation

```
Inventory Data Validation
├── product_id: required, string
├── sku: required, string
├── quantity: required, number, >= 0
└── warehouse_id: optional, string

Price Data Validation
├── product_id: required, string
├── price: required, number, > 0
├── currency: required, string (ISO code)
└── sale_price: optional, number, <= price

Order Data Validation
├── order_id: required, string
├── status: required, string (valid status)
├── items: required, array, not empty
└── total: required, number, > 0

Product Data Validation
├── product_id: required, string
├── sku: required, string
├── name: required, string, not empty
└── category_id: optional, string

Customer Data Validation
├── customer_id: required, string
├── email: required, string (email format)
├── phone: optional, string (phone format)
└── loyalty_points: optional, number, >= 0
```

### ValidationError Structure

```
ValidationError Exception
├── message: Error description
├── field: Field that failed validation
├── value: Invalid value
└── constraint: What validation rule failed
```

### Validation Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| Strict | Fail on any error | Production publishing |
| Lenient | Log warnings, continue | Development |
| Batch | Collect all errors | Form validation |

### Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Missing field | Required field not in message | Add missing field |
| Wrong type | Field has incorrect type | Convert to correct type |
| Invalid format | Format doesn't match pattern | Reformat data |
| Invalid value | Value outside constraints | Use valid value |
| Unknown event type | Event type not in registry | Use valid event type |

### Validation Performance

| Consideration | Strategy | Benefit |
|---------------|----------|---------|
| Fast validation | Check cheap rules first | Early failure |
| Expensive checks | Skip if basic checks fail | Save time |
| Caching | Cache validation results | Repeated checks |
| Batch validation | Validate multiple messages | Efficiency |

### Usage Examples

```
Example 1: Valid Message
message = {
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "event_type": "INVENTORY_UPDATED",
    "entity_type": "inventory",
    "entity_id": "prod_123",
    "tenant_id": "tenant_001",
    "data": {"product_id": "prod_123", "quantity": 100},
    "timestamp": "2026-01-31T10:30:00Z",
    "version": 1
}

validate_message(message)  # Returns True or raises nothing

Example 2: Invalid Message - Missing Field
message = {
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "event_type": "INVENTORY_UPDATED",
    # Missing entity_type, entity_id, tenant_id, data, timestamp, version
}

validate_message(message)  # Raises ValidationError: "Missing required field: entity_type"

Example 3: Invalid Message - Wrong Type
message = {
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "event_type": "INVENTORY_UPDATED",
    "entity_type": "inventory",
    "entity_id": "prod_123",
    "tenant_id": "tenant_001",
    "data": "not a dictionary",  # Wrong type
    "timestamp": "2026-01-31T10:30:00Z",
    "version": 1
}

validate_message(message)  # Raises ValidationError: "Field 'data' must be a dictionary"
```

### Expected Outcome
- Comprehensive message validation
- Required field checking
- Type validation for all fields
- Format validation (UUID, ISO datetime)
- Entity-specific data validation
- Clear error messages
- Custom ValidationError exception

### Verification Checklist
- [ ] Validation functions added to schemas.py
- [ ] validate_message() function implemented
- [ ] Required field validation
- [ ] Type validation for all fields
- [ ] event_id UUID format validation
- [ ] event_type validation against registry
- [ ] entity_type validation
- [ ] tenant_id validation
- [ ] data structure validation
- [ ] timestamp ISO 8601 validation
- [ ] version number validation
- [ ] Entity-specific validation functions
- [ ] ValidationError exception class created
- [ ] Clear error messages
- [ ] Documentation with examples
- [ ] Can validate test messages correctly
- [ ] Properly rejects invalid messages

---

## Task 14: Create Retry Handler

### Overview
Implement a retry handler that automatically retries failed publish operations with exponential backoff. This handler improves system resilience by automatically recovering from transient failures such as network issues, temporary Redis unavailability, or resource contention. The retry mechanism prevents message loss while avoiding overwhelming the system with repeated failed attempts.

### Dependencies
- Task 13: Create Message Validator

### Instructions

1. **Create retry.py file**
   - Create new file `retry.py` in `backend/apps/sync/`
   - This file will contain retry logic

2. **Define retry configuration**
   - Create RetryConfig class or dictionary
   - Include max_retries parameter (default: 3)
   - Include initial_delay parameter (default: 1 second)
   - Include max_delay parameter (default: 30 seconds)
   - Include exponential_base parameter (default: 2)

3. **Create RetryHandler class**
   - Define class to encapsulate retry logic
   - Accept retry configuration in constructor
   - Provide method to execute with retry

4. **Implement exponential backoff algorithm**
   - Calculate delay: initial_delay * (exponential_base ** attempt)
   - Apply maximum delay cap
   - Add jitter to prevent thundering herd

5. **Create retry decorator**
   - Define decorator function: `@retry_on_failure`
   - Accept retry configuration parameters
   - Wrap function with retry logic

6. **Implement retry logic**
   - Try to execute operation
   - Catch specified exceptions
   - Wait exponentially increasing delay
   - Retry up to max_retries times

7. **Add exception handling**
   - Define which exceptions trigger retry
   - Include Redis connection errors
   - Include timeout errors
   - Don't retry validation errors (permanent failures)

8. **Implement retry state tracking**
   - Track current attempt number
   - Record each failure reason
   - Log retry attempts

9. **Add jitter to backoff**
   - Add random variation to delay
   - Prevents synchronized retries
   - Use random percentage (e.g., ±20%)

10. **Create success/failure callbacks**
    - Allow custom callback on success
    - Allow custom callback on final failure
    - Pass retry metadata to callbacks

11. **Implement retry metrics**
    - Count successful retries
    - Count failed retries
    - Track retry delay times

12. **Add circuit breaker pattern (optional)**
    - Track failure rate over time
    - Open circuit after threshold failures
    - Prevent retries when circuit open
    - Close circuit after timeout

13. **Document retry handler**
    - Explain exponential backoff algorithm
    - Provide configuration examples
    - Document which operations should use retry

### Retry Handler Structure

```
Retry Handler
├── RetryConfig
│   ├── max_retries: 3
│   ├── initial_delay: 1s
│   ├── max_delay: 30s
│   ├── exponential_base: 2
│   └── jitter: 0.2 (20%)
├── RetryHandler
│   ├── __init__(config)
│   ├── execute_with_retry(func, *args, **kwargs)
│   ├── calculate_delay(attempt)
│   └── should_retry(exception)
└── Decorator
    └── @retry_on_failure
```

### Retry Configuration Parameters

| Parameter | Default | Description | Example Values |
|-----------|---------|-------------|----------------|
| max_retries | 3 | Maximum retry attempts | 1, 3, 5 |
| initial_delay | 1.0 | First retry delay (seconds) | 0.5, 1.0, 2.0 |
| max_delay | 30.0 | Maximum delay cap (seconds) | 10, 30, 60 |
| exponential_base | 2 | Backoff multiplier | 2, 3 |
| jitter | 0.2 | Random variation (0-1) | 0.1, 0.2, 0.3 |

### Exponential Backoff Calculation

```
Attempt 1: delay = initial_delay * (base^0) = 1 * 1 = 1s
Attempt 2: delay = initial_delay * (base^1) = 1 * 2 = 2s
Attempt 3: delay = initial_delay * (base^2) = 1 * 4 = 4s
Attempt 4: delay = initial_delay * (base^3) = 1 * 8 = 8s

With Jitter (±20%):
Attempt 1: 0.8s - 1.2s (random)
Attempt 2: 1.6s - 2.4s (random)
Attempt 3: 3.2s - 4.8s (random)
Attempt 4: 6.4s - 9.6s (random)

With Max Delay Cap (30s):
If calculated delay > max_delay, use max_delay
```

### Retry Flow

```
execute_with_retry(func)
    │
    └─→ For attempt in range(max_retries + 1)
        │
        ├─→ Try execute function
        │   └── If success, return result
        │
        ├─→ Catch retriable exception
        │   └── If not retriable, raise immediately
        │
        ├─→ Check if more retries available
        │   └── If no more retries, raise exception
        │
        ├─→ Calculate backoff delay
        │   ├── Exponential calculation
        │   ├── Apply max cap
        │   └── Add jitter
        │
        ├─→ Log retry attempt
        │   └── Include attempt number and delay
        │
        ├─→ Sleep for delay
        │   └── Wait before next attempt
        │
        └─→ Loop to next attempt
```

### Retriable vs Non-Retriable Exceptions

| Exception Type | Retriable | Reason |
|----------------|-----------|--------|
| ConnectionError | Yes | Network issue, may resolve |
| TimeoutError | Yes | Temporary slowness |
| RedisError (generic) | Yes | Transient Redis issue |
| ValidationError | No | Permanent data issue |
| AuthenticationError | No | Wrong credentials |
| PermissionError | No | Access control issue |
| ValueError | No | Programming error |

### Retry Strategy Comparison

| Strategy | Delay Pattern | Use Case |
|----------|---------------|----------|
| Fixed | 1s, 1s, 1s | Simple, predictable |
| Linear | 1s, 2s, 3s | Moderate scaling |
| Exponential | 1s, 2s, 4s, 8s | Fast backoff |
| Exponential with Cap | 1s, 2s, 4s, 8s, 10s, 10s | Controlled growth |
| Exponential with Jitter | 0.9s, 2.1s, 3.8s | Prevent thundering herd |

### Retry Handler Usage Examples

```
Example 1: Using Decorator
@retry_on_failure(max_retries=3, initial_delay=1)
def publish_message(channel, message):
    # This function will auto-retry on failure
    redis_client.publish(channel, message)

Example 2: Using Handler Directly
handler = RetryHandler(
    max_retries=3,
    initial_delay=1,
    max_delay=30
)

result = handler.execute_with_retry(
    redis_client.publish,
    channel,
    message
)

Example 3: Custom Configuration
retry_config = {
    "max_retries": 5,
    "initial_delay": 0.5,
    "max_delay": 60,
    "exponential_base": 3,
    "jitter": 0.3
}

@retry_on_failure(**retry_config)
def critical_publish(channel, message):
    redis_client.publish(channel, message)
```

### Logging Retry Attempts

| Log Level | Event | Message Format |
|-----------|-------|----------------|
| WARNING | Retry attempt | "Retry attempt {n} for {func} after {delay}s delay" |
| ERROR | Final failure | "Operation failed after {max_retries} attempts: {error}" |
| INFO | Retry success | "Operation succeeded on retry attempt {n}" |
| DEBUG | Delay calculation | "Calculated retry delay: {delay}s (attempt {n})" |

### Retry Metrics to Track

| Metric | Purpose | Implementation |
|--------|---------|----------------|
| Retry count | Track retry frequency | Counter |
| Success after retry | Measure recovery rate | Counter |
| Final failures | Track permanent failures | Counter |
| Average retries | Measure system health | Histogram |
| Retry latency | Track time cost | Timer |

### Circuit Breaker Integration (Optional)

```
Circuit Breaker States
    │
    ├─→ CLOSED (Normal)
    │   ├── Allow all requests
    │   └── Track failure rate
    │
    ├─→ OPEN (Failing)
    │   ├── Reject all requests immediately
    │   ├── No retry attempts
    │   └── Wait for timeout
    │
    └─→ HALF_OPEN (Testing)
        ├── Allow limited requests
        ├── Test if recovered
        └── Move to CLOSED or OPEN
```

### Best Practices

| Practice | Reason | Implementation |
|----------|--------|----------------|
| Limit retries | Prevent infinite loops | max_retries = 3-5 |
| Cap delay | Prevent excessive waits | max_delay = 30-60s |
| Add jitter | Prevent thundering herd | Random ±20% |
| Log retries | Debug issues | Log each attempt |
| Monitor metrics | Track health | Count successes/failures |
| Don't retry permanent errors | Waste of resources | Check exception type |

### Expected Outcome
- Automatic retry for transient failures
- Exponential backoff with jitter
- Configurable retry parameters
- Proper exception handling
- Logging of retry attempts
- Metrics tracking
- Decorator for easy application

### Verification Checklist
- [ ] `backend/apps/sync/retry.py` file created
- [ ] RetryConfig class or dict defined
- [ ] RetryHandler class implemented
- [ ] Exponential backoff algorithm
- [ ] Jitter added to delays
- [ ] Maximum delay cap enforced
- [ ] max_retries limit enforced
- [ ] Retriable exception detection
- [ ] Non-retriable exceptions skip retry
- [ ] @retry_on_failure decorator created
- [ ] Logging for retry attempts
- [ ] Success and failure callbacks (optional)
- [ ] Metrics tracking implemented
- [ ] Documentation with examples
- [ ] Can successfully retry failed operations
- [ ] Respects retry limits

---

## Task 15: Create Dead Letter Queue

### Overview
Implement a dead letter queue (DLQ) for messages that fail processing even after retries. The DLQ captures failed messages for later analysis, debugging, and potential reprocessing. This ensures no messages are silently lost and provides visibility into system failures. Failed messages are published to a special DLQ channel with additional error metadata.

### Dependencies
- Task 14: Create Retry Handler

### Instructions

1. **Add DLQ to channels.py**
   - Open `backend/apps/sync/channels.py`
   - Add dead letter queue channel definitions
   - Keep DLQ logic with other channels

2. **Define DLQ channel naming**
   - Pattern: `dlq:{tenant_id}`
   - Separate DLQ per tenant for isolation
   - Document naming convention

3. **Create DLQ message schema**
   - Extend base message schema
   - Add error_type field (exception type)
   - Add error_message field (error description)
   - Add failure_timestamp field (when failed)
   - Add retry_count field (number of attempts)
   - Add original_channel field (source channel)

4. **Create send_to_dlq function**
   - Accept failed message and error details
   - Build DLQ message with metadata
   - Publish to DLQ channel

5. **Integrate with retry handler**
   - After final retry failure, send to DLQ
   - Include retry history in DLQ message
   - Log DLQ send operation

6. **Implement DLQ TTL**
   - Configure time-to-live for DLQ messages
   - Default: 7 days retention
   - Use Redis EXPIRE command or stream with maxlen

7. **Create DLQ subscriber**
   - Optional subscriber for DLQ monitoring
   - Alert on DLQ messages
   - Log DLQ events for analysis

8. **Add DLQ retrieval function**
   - Function to retrieve messages from DLQ
   - Support pagination if using Redis stream
   - Return messages with metadata

9. **Create DLQ reprocessing function**
   - Function to republish DLQ message
   - Remove error metadata
   - Send to original channel for retry

10. **Implement DLQ metrics**
    - Count messages sent to DLQ
    - Track DLQ size (if using stream)
    - Alert on high DLQ rates

11. **Add DLQ cleanup job**
    - Periodic job to clean old DLQ messages
    - Respect TTL configuration
    - Log cleanup operations

12. **Document DLQ usage**
    - Explain DLQ purpose and usage
    - Provide examples of DLQ messages
    - Document reprocessing procedure

### DLQ Channel Structure

```
Dead Letter Queues
├── dlq:tenant_001
├── dlq:tenant_002
├── dlq:tenant_003
└── ...

Each tenant has isolated DLQ
```

### DLQ Channel Naming

| Pattern | Example | Purpose |
|---------|---------|---------|
| dlq:{tenant_id} | dlq:tenant_001 | Tenant-specific DLQ |

### DLQ Message Schema

```
DLQ Message
├── Original Message Fields
│   ├── event_id
│   ├── event_type
│   ├── entity_type
│   ├── entity_id
│   ├── tenant_id
│   ├── data
│   ├── timestamp
│   └── version
└── DLQ Metadata
    ├── error_type (exception class name)
    ├── error_message (exception message)
    ├── error_traceback (stack trace)
    ├── failure_timestamp (when failed)
    ├── retry_count (number of retries)
    ├── original_channel (source channel)
    └── dlq_reason (why sent to DLQ)
```

### DLQ Message Example

```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_type": "INVENTORY_UPDATED",
  "entity_type": "inventory",
  "entity_id": "prod_123",
  "tenant_id": "tenant_001",
  "data": {"product_id": "prod_123", "quantity": 100},
  "timestamp": "2026-01-31T10:30:00Z",
  "version": 1,
  "dlq_metadata": {
    "error_type": "ConnectionError",
    "error_message": "Failed to connect to Redis",
    "error_traceback": "Traceback (most recent call last)...",
    "failure_timestamp": "2026-01-31T10:35:00Z",
    "retry_count": 3,
    "original_channel": "inventory:tenant_001",
    "dlq_reason": "Max retries exceeded"
  }
}
```

### DLQ Workflow

```
Message Processing
    │
    ├─→ Try to process
    │   └── Success: Done
    │
    ├─→ Failure: Retry with exponential backoff
    │   ├── Retry 1: Failed
    │   ├── Retry 2: Failed
    │   └── Retry 3: Failed
    │
    └─→ Max retries exceeded
        │
        └─→ Send to Dead Letter Queue
            ├── Add error metadata
            ├── Publish to dlq:{tenant_id}
            └── Log DLQ event
```

### DLQ Functions

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| send_to_dlq | message, error, retry_count | bool | Send failed message to DLQ |
| get_dlq_messages | tenant_id, limit | list | Retrieve DLQ messages |
| reprocess_dlq_message | dlq_message | bool | Republish to original channel |
| cleanup_dlq | tenant_id, age | int | Remove old DLQ messages |
| get_dlq_stats | tenant_id | dict | Get DLQ metrics |

### DLQ TTL Configuration

| Setting | Default | Purpose |
|---------|---------|---------|
| DLQ_TTL_DAYS | 7 | Days to retain DLQ messages |
| DLQ_MAX_SIZE | 10000 | Maximum DLQ messages per tenant |
| DLQ_CLEANUP_INTERVAL | 24h | How often to run cleanup |

### DLQ Storage Options

| Option | Implementation | Pros | Cons |
|--------|----------------|------|------|
| Redis Pub/Sub | Publish to dlq channel | Simple | Not persisted |
| Redis List | LPUSH to dlq list | Persisted | Manual cleanup needed |
| Redis Stream | XADD to dlq stream | Persisted, auto-trim | More complex |
| Database | Store in PostgreSQL | Queryable | Slower |

### Recommended: Redis Stream for DLQ

```
Redis Stream Benefits
├── Persistence (messages stored)
├── Automatic trimming (MAXLEN)
├── Ordered by time
├── Support pagination
└── Can replay messages
```

### DLQ Monitoring

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| DLQ message count | > 100 per hour | Investigate failures |
| DLQ growth rate | Rapid increase | Check system health |
| DLQ age | Messages > 7 days | Review and clean |

### DLQ Reprocessing Strategy

```
Reprocessing Flow
    │
    ├─→ Identify issue with DLQ messages
    │   └── Fix underlying problem
    │
    ├─→ Retrieve messages from DLQ
    │   └── Filter by error type or time
    │
    ├─→ For each message:
    │   ├── Remove DLQ metadata
    │   ├── Validate message still relevant
    │   └── Republish to original channel
    │
    └─→ Monitor reprocessing results
        └── Check for new DLQ entries
```

### DLQ Analysis Use Cases

| Use Case | Purpose | Method |
|----------|---------|--------|
| Identify recurring errors | Find systematic issues | Group by error_type |
| Trace message history | Debug specific message | Search by event_id |
| Measure error rate | System health monitoring | Count DLQ messages |
| Audit failed operations | Compliance | Review DLQ logs |

### DLQ Best Practices

| Practice | Reason | Implementation |
|----------|--------|----------------|
| Always use TTL | Prevent unbounded growth | Set EXPIRE or stream MAXLEN |
| Log DLQ sends | Visibility | Log event_id and error |
| Alert on DLQ | Early detection | Monitor DLQ rate |
| Periodically review | Find patterns | Weekly DLQ analysis |
| Document errors | Knowledge base | Link error types to fixes |

### Expected Outcome
- Dead letter queue channel configured
- Failed messages captured with metadata
- DLQ integrated with retry handler
- TTL configured to prevent unbounded growth
- Functions for retrieval and reprocessing
- Monitoring and alerting
- Documentation of DLQ procedures

### Verification Checklist
- [ ] DLQ channel naming added to channels.py
- [ ] DLQ message schema defined
- [ ] send_to_dlq() function implemented
- [ ] DLQ metadata fields added (error_type, error_message, etc.)
- [ ] Integration with retry handler
- [ ] TTL configured for DLQ messages
- [ ] get_dlq_messages() function for retrieval
- [ ] reprocess_dlq_message() function
- [ ] DLQ metrics tracking
- [ ] Cleanup job for old messages
- [ ] Logging for DLQ operations
- [ ] Documentation with examples
- [ ] Can send test message to DLQ
- [ ] Can retrieve messages from DLQ
- [ ] DLQ respects TTL

---

## Task 16: Verify Redis Setup

### Overview
Perform comprehensive verification of the complete Redis Pub/Sub setup. This final task ensures all components work together correctly, validates configuration, tests message flow end-to-end, and confirms error handling functions properly. Verification provides confidence that the real-time sync engine foundation is solid before building higher-level features.

### Dependencies
- Task 15: Create Dead Letter Queue

### Instructions

1. **Create test script**
   - Create file `test_redis_setup.py` in `backend/apps/sync/`
   - Structure script with verification steps
   - Include both automated tests and manual checks

2. **Verify Redis connection**
   - Test connection to Redis using configuration
   - Validate database selection (DB 1)
   - Confirm connection pooling works
   - Check ping response time

3. **Verify channel naming**
   - Test channel name builder functions
   - Validate all entity type channels
   - Check tenant isolation in channel names
   - Verify wildcard pattern support

4. **Verify message schema**
   - Create test messages for each entity type
   - Validate all required fields present
   - Confirm data types correct
   - Check timestamp format (ISO 8601)

5. **Verify message serialization**
   - Serialize test messages to JSON
   - Deserialize back to dictionaries
   - Confirm datetime handling works
   - Verify UUID handling correct

6. **Verify message validation**
   - Test validator with valid messages
   - Test validator with invalid messages (missing fields)
   - Test validator with wrong types
   - Confirm ValidationError raised appropriately

7. **Verify publisher functionality**
   - Create publisher instance
   - Publish test messages to each channel type
   - Confirm publish returns success
   - Check Redis reports subscriber count

8. **Verify subscriber functionality**
   - Create subscriber instance
   - Subscribe to test channels
   - Verify subscription confirmed
   - Test pattern subscription (inventory:*)

9. **Verify end-to-end message flow**
   - Start subscriber in background
   - Publish message from publisher
   - Confirm subscriber receives message
   - Validate message contents match

10. **Verify retry handler**
    - Simulate transient failure
    - Confirm retry attempts occur
    - Validate exponential backoff timing
    - Check success after retry

11. **Verify dead letter queue**
    - Simulate permanent failure
    - Confirm message sent to DLQ
    - Validate DLQ metadata added
    - Retrieve message from DLQ

12. **Verify tenant isolation**
    - Publish to tenant A channel
    - Subscribe to tenant B channel
    - Confirm tenant B subscriber doesn't receive tenant A messages
    - Validate channel separation

13. **Verify event types**
    - Test all defined event type constants
    - Validate event type validation
    - Confirm entity-event type mapping

14. **Performance testing**
    - Publish multiple messages rapidly
    - Measure publish latency
    - Measure message throughput
    - Test under load conditions

15. **Create verification report**
    - Document all verification results
    - Note any issues found
    - Provide recommendations
    - Confirm system ready for use

16. **Create verification documentation**
    - Document how to run verification
    - Provide troubleshooting guide
    - Include expected output examples

### Verification Checklist

```
Redis Pub/Sub Setup Verification
├── Configuration
│   ├── [ ] Redis connection successful
│   ├── [ ] Database 1 selected
│   ├── [ ] Connection pool configured
│   └── [ ] Environment variables loaded
├── Channels
│   ├── [ ] Inventory channel naming correct
│   ├── [ ] Price channel naming correct
│   ├── [ ] Order channel naming correct
│   ├── [ ] Product channel naming correct
│   ├── [ ] Customer channel naming correct
│   └── [ ] DLQ channel naming correct
├── Messages
│   ├── [ ] Message schema defined
│   ├── [ ] Serialization works
│   ├── [ ] Deserialization works
│   └── [ ] Validation works
├── Publishing
│   ├── [ ] Publisher creates successfully
│   ├── [ ] Can publish to all channels
│   ├── [ ] Messages serialized correctly
│   └── [ ] Errors handled properly
├── Subscribing
│   ├── [ ] Subscriber creates successfully
│   ├── [ ] Can subscribe to channels
│   ├── [ ] Messages received correctly
│   └── [ ] Pattern subscription works
├── End-to-End
│   ├── [ ] Message published and received
│   ├── [ ] Content matches exactly
│   ├── [ ] Tenant isolation confirmed
│   └── [ ] Multiple channels work
├── Error Handling
│   ├── [ ] Retry handler works
│   ├── [ ] Exponential backoff correct
│   ├── [ ] DLQ captures failures
│   └── [ ] DLQ metadata complete
└── Performance
    ├── [ ] Publish latency acceptable (< 10ms)
    ├── [ ] Throughput sufficient (> 1000 msg/s)
    ├── [ ] No memory leaks
    └── [ ] Connection stable under load
```

### Test Message Templates

```python
# Inventory message
inventory_message = {
    "event_id": str(uuid4()),
    "event_type": "INVENTORY_UPDATED",
    "entity_type": "inventory",
    "entity_id": "prod_123",
    "tenant_id": "tenant_001",
    "data": {
        "product_id": "prod_123",
        "sku": "SKU-001",
        "quantity": 100,
        "warehouse_id": "warehouse_01"
    },
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "version": 1
}

# Price message
price_message = {
    "event_id": str(uuid4()),
    "event_type": "PRICE_UPDATED",
    "entity_type": "price",
    "entity_id": "prod_123",
    "tenant_id": "tenant_001",
    "data": {
        "product_id": "prod_123",
        "price": 99.99,
        "currency": "LKR",
        "sale_price": 79.99
    },
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "version": 1
}

# Similar for order, product, customer...
```

### Verification Test Script Structure

```python
#!/usr/bin/env python
# test_redis_setup.py

def test_redis_connection():
    # Test connection
    pass

def test_channel_naming():
    # Test channel builders
    pass

def test_message_schema():
    # Test schema compliance
    pass

def test_serialization():
    # Test serialize/deserialize
    pass

def test_validation():
    # Test validator
    pass

def test_publisher():
    # Test publishing
    pass

def test_subscriber():
    # Test subscribing
    pass

def test_end_to_end():
    # Test complete flow
    pass

def test_retry():
    # Test retry handler
    pass

def test_dlq():
    # Test dead letter queue
    pass

def run_all_tests():
    # Execute all tests
    # Print results
    pass

if __name__ == "__main__":
    run_all_tests()
```

### Expected Test Results

| Test | Expected Result | Pass Criteria |
|------|----------------|---------------|
| Redis Connection | Connected to Redis DB 1 | PING returns PONG |
| Channel Naming | All channels follow pattern | Format: {entity}:{tenant} |
| Serialization | JSON string created | Valid JSON output |
| Validation | Valid messages pass, invalid fail | Correct exceptions |
| Publishing | Message published | subscriber_count > 0 |
| Subscribing | Message received | Callback executed |
| End-to-End | Full flow completes | Message matches |
| Retry | Failed publish retried | Succeeds on retry |
| DLQ | Failed message in DLQ | DLQ contains message |
| Tenant Isolation | No cross-tenant messages | Only own messages received |

### Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| Publish Latency | < 10ms | Time from publish call to return |
| Subscribe Latency | < 50ms | Time from publish to callback |
| Throughput | > 1000 msg/s | Messages published per second |
| Connection Setup | < 100ms | Time to establish connection |
| Serialization | < 1ms | Time to serialize message |

### Troubleshooting Common Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Cannot connect | Redis not running | Start Redis service |
| Wrong database | Config points to DB 0 | Update to DB 1 |
| Messages not received | Not subscribed | Call subscribe before publish |
| Validation fails | Wrong schema | Check required fields |
| Serialization error | Invalid data type | Convert to JSON-serializable types |
| No retries | Exception not retriable | Check exception type |
| DLQ empty | Success or wrong tenant | Verify tenant ID |

### Verification Documentation

```markdown
# Redis Pub/Sub Verification Guide

## Prerequisites
- Redis running on localhost:6379 or REDIS_HOST
- Redis password configured (if required)
- Python dependencies installed

## Running Verification
1. Navigate to backend/apps/sync/
2. Run: python test_redis_setup.py
3. Review output for any failures

## Expected Output
All tests should pass with "OK" status
No errors or exceptions should occur
Performance metrics should meet targets

## Troubleshooting
See troubleshooting section for common issues
Check logs for detailed error messages
Verify environment variables set correctly
```

### Expected Outcome
- Complete verification of Redis Pub/Sub setup
- All components tested and working
- Configuration validated
- End-to-end message flow confirmed
- Error handling verified
- Performance benchmarks met
- Documentation of verification process
- System ready for integration

### Verification Checklist
- [ ] test_redis_setup.py script created
- [ ] Redis connection test passes
- [ ] Channel naming tests pass
- [ ] Message schema tests pass
- [ ] Serialization tests pass
- [ ] Validation tests pass
- [ ] Publisher tests pass
- [ ] Subscriber tests pass
- [ ] End-to-end tests pass
- [ ] Tenant isolation verified
- [ ] Retry handler tested
- [ ] DLQ tested
- [ ] Performance benchmarks met
- [ ] All test messages work
- [ ] No errors in logs
- [ ] Verification documentation complete
- [ ] System ready for next phase

---

## Summary

This document completed the Redis Pub/Sub messaging system by implementing event types, publisher and subscriber classes, message serialization and validation, retry handling with exponential backoff, dead letter queue for failed messages, and comprehensive verification of the entire setup.

### Completed Tasks
9. ✓ Created Event Types with constants for all entities
10. ✓ Created Publisher Class with connection management and error handling
11. ✓ Created Subscriber Class with message listening and callback execution
12. ✓ Created Message Serializer for JSON encoding/decoding
13. ✓ Created Message Validator with schema compliance checking
14. ✓ Created Retry Handler with exponential backoff and jitter
15. ✓ Created Dead Letter Queue for failed message capture
16. ✓ Verified Redis Setup with comprehensive testing

### Key Deliverables
- Event type constants and registry
- BasePublisher class with publishing capabilities
- BaseSubscriber class with subscription and listening
- Message serialization utilities
- Message validation functions with error reporting
- Retry handler with configurable backoff
- Dead letter queue with TTL and reprocessing
- Verification script and documentation

### System Capabilities
- Publish messages to tenant-specific channels
- Subscribe to channels and receive messages in real-time
- Automatic retry of failed operations
- Capture and analyze failed messages
- Validate message integrity
- Handle datetime and special types
- Maintain tenant isolation
- Monitor system health

### Next Steps
Proceed to **Group B: ERP Sync Publisher** to implement entity-specific publishers that use this Redis Pub/Sub infrastructure to broadcast events when inventory, prices, orders, products, and customers change in the ERP system.

### Files Created
```
backend/apps/sync/
├── config.py (Task 01)
├── channels.py (Task 02)
├── schemas.py (Task 08, 12, 13)
├── events.py (Task 09)
├── retry.py (Task 14)
├── publisher/
│   ├── __init__.py
│   └── base.py (Task 10)
├── consumer/
│   ├── __init__.py
│   └── base.py (Task 11)
└── test_redis_setup.py (Task 16)
```
