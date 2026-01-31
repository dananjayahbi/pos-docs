# Tasks 17-26: Entity Publishers

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 09 - Real-time Sync Engine  
> **Group:** B of F  
> **Tasks:** 17-26 (10 tasks)  
> **Document:** 01 of 02

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-32_Batch-Throttle.md](02_Tasks-27-32_Batch-Throttle.md)

---

## Document Overview

This document covers entity publisher implementation. Creates base SyncPublisher service as foundation. Implements Inventory Publisher with stock tracking signals and payloads. Implements Price Publisher with price change signals and payloads. Implements Product Publisher with product lifecycle signals and payloads. Implements Customer Publisher with customer signals. Each publisher follows same pattern: publisher class, signal definition, payload structure.

### Tasks in This Document

| Task # | Task Name | Complexity | Lines Est. |
|--------|-----------|------------|-----------|
| 17 | Create SyncPublisher Service | Medium | 120 |
| 18 | Create Inventory Publisher | Medium | 80 |
| 19 | Create Stock Changed Signal | Low | 40 |
| 20 | Create Stock Event Payload | Low | 60 |
| 21 | Create Price Publisher | Medium | 80 |
| 22 | Create Price Changed Signal | Low | 40 |
| 23 | Create Price Event Payload | Low | 60 |
| 24 | Create Product Publisher | Medium | 100 |
| 25 | Create Product Signal | Low | 50 |
| 26 | Create Product Payload | Low | 70 |

### Key Outcomes

- Base SyncPublisher service operational
- Four entity publishers implemented (Inventory, Price, Product, Customer)
- Django signals configured for real-time triggers
- Event payloads structured for Redis transport
- Multi-tenant channel routing established
- Publisher pattern reusable for future entities

---

## Task 17: Create SyncPublisher Service

### Overview

Implement base SyncPublisher service as foundation for all entity publishers. Service wraps Redis pub/sub operations with tenant-aware channel routing and error handling. Uses singleton pattern for application-wide access.

**Dependencies:** Task 16 (Redis configured)

### Instructions

1. Create `backend/apps/sync/publisher/` directory with `__init__.py`
2. Create `service.py` implementing SyncPublisher class with singleton pattern
3. Add Redis connection initialization using django-redis
4. Implement `publish(channel, event_data)` method accepting channel name and event dictionary
5. Add tenant ID injection from current request context to channel name
6. Format channel as `{entity_type}:{tenant_id}` pattern
7. Serialize event data to JSON before publishing to Redis
8. Implement error handling with logging for Redis connection failures
9. Add connection retry logic with exponential backoff
10. Create factory method `get_publisher()` for singleton access

### Configuration Requirements

| Setting | Value | Purpose |
|---------|-------|---------|
| SYNC_PUBLISHER_ENABLED | True/False | Feature flag |
| SYNC_RETRY_ATTEMPTS | 3 | Max retries |
| SYNC_RETRY_DELAY | 1.0 | Initial delay (seconds) |
| SYNC_RETRY_BACKOFF | 2.0 | Backoff multiplier |

### Publisher Interface

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| publish | channel, event_data | bool | Publish single event |
| publish_async | channel, event_data | Coroutine | Async publish |
| is_connected | - | bool | Check Redis connection |
| close | - | None | Close connections |

### Expected Outcome

- SyncPublisher service instantiable via singleton pattern
- Events successfully published to tenant-specific Redis channels
- Connection errors handled gracefully with retries and logging

### Verification Checklist

- [ ] SyncPublisher singleton accessible via `get_publisher()`
- [ ] Events published with correct `{entity}:{tenant_id}` channel format
- [ ] JSON serialization working for complex event data
- [ ] Redis connection failures logged and retried
- [ ] Tenant ID correctly extracted from request context
- [ ] Service configurable via Django settings
- [ ] Unit tests pass for publish success and failure scenarios

---

## Task 18: Create Inventory Publisher

### Overview

Implement InventoryPublisher for real-time stock quantity changes. Listens to inventory model changes and publishes stock updates to webstore. Handles both individual stock adjustments and bulk inventory movements.

**Dependencies:** Task 17 (SyncPublisher service)

### Instructions

1. Create `inventory.py` in publisher directory
2. Define InventoryPublisher class inheriting base publisher pattern
3. Implement `publish_stock_change()` method accepting product ID and quantity data
4. Set channel pattern to `inventory:{tenant_id}`
5. Include warehouse/location context in event data
6. Add support for different stock movement reasons (sale, return, adjustment, transfer)
7. Implement pre-publish validation ensuring required fields present
8. Add deduplication logic to prevent duplicate events for same stock change
9. Configure event priority levels (high for out-of-stock, normal for regular updates)

### Event Types

| Event Type | Trigger | Priority | Description |
|-----------|---------|----------|-------------|
| STOCK_UPDATED | Quantity change | Normal | Regular stock change |
| STOCK_OUT | Quantity = 0 | High | Out of stock alert |
| STOCK_LOW | Quantity < threshold | Normal | Low stock warning |
| STOCK_TRANSFER | Location change | Normal | Inter-warehouse transfer |

### Channel Configuration

| Property | Value | Notes |
|----------|-------|-------|
| Channel Prefix | inventory | Entity identifier |
| Tenant Isolation | Yes | Per-tenant channels |
| TTL | 300 seconds | Event expiry |
| Persistence | Yes | Redis persistence |

### Expected Outcome

- Inventory changes published instantly to webstore
- Stock events include full context (product, quantity, location, reason)
- Multi-location inventory tracked separately

### Verification Checklist

- [ ] Stock changes trigger events on InventoryMovement save
- [ ] Events published to correct `inventory:{tenant_id}` channel
- [ ] All stock movement types handled (sale, return, adjustment)
- [ ] Out-of-stock events prioritized correctly
- [ ] Multi-location inventory updates tracked
- [ ] Event deduplication prevents duplicates
- [ ] Integration test confirms webstore receives events

---

## Task 19: Create Stock Changed Signal

### Overview

Define Django signal for stock quantity changes. Signal connects inventory model to publisher, triggering events on save. Decouples inventory logic from sync logic.

**Dependencies:** Task 18 (Inventory Publisher)

### Instructions

1. Create or update `backend/apps/sync/signals.py`
2. Define `inventory_changed` signal using Django's Signal class
3. Specify signal arguments: product_id, old_quantity, new_quantity, location_id, reason
4. Connect signal to InventoryMovement model post_save
5. Add signal receiver function handling inventory_changed events
6. Implement conditional logic to only fire signal when quantity actually changes
7. Include transaction safety using `transaction.on_commit()` for signal dispatch
8. Add signal documentation with docstring explaining usage

### Signal Definition

| Property | Value | Description |
|----------|-------|-------------|
| Signal Name | inventory_changed | Identifier |
| Sender | InventoryMovement | Model class |
| Providing Args | product_id, old_qty, new_qty, location_id, reason | Event data |
| Dispatch Timing | post_save | After DB commit |

### Receiver Configuration

| Aspect | Implementation | Purpose |
|--------|---------------|---------|
| Connection Point | post_save | After model save |
| Conditional Check | old_qty != new_qty | Avoid no-op events |
| Transaction Safety | on_commit | After transaction |
| Error Handling | Try-except with logging | Prevent signal cascade failures |

### Expected Outcome

- Stock changes trigger inventory_changed signal automatically
- Signal fires only when quantity actually changes
- Signal decoupled from InventoryMovement model implementation

### Verification Checklist

- [ ] Signal registered in Django signals framework
- [ ] Receiver connected to InventoryMovement post_save
- [ ] Signal fires after successful database commit
- [ ] Signal includes all required arguments (product, quantities, location, reason)
- [ ] No-op changes (same quantity) don't trigger signal
- [ ] Signal errors don't break inventory save operation
- [ ] Unit tests verify signal dispatch and receiver execution

---

## Task 20: Create Stock Event Payload

### Overview

Define structured payload format for stock change events. Standardizes data sent to webstore ensuring consistency. Includes all necessary context for webstore to update display.

**Dependencies:** Task 19 (Stock Changed Signal)

### Instructions

1. Create `payloads.py` in sync app
2. Define StockEventPayload dataclass or Pydantic model
3. Include fields: event_type, product_id, sku, old_quantity, new_quantity, location_id, reason, timestamp
4. Add optional fields: warehouse_name, product_name, unit_of_measure
5. Implement `to_dict()` serialization method for JSON conversion
6. Add validation ensuring quantity values non-negative
7. Include ISO-8601 timestamp formatting
8. Add tenant_id to payload for consumer-side routing
9. Implement payload builder method accepting InventoryMovement instance

### Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| event_type | string | Yes | STOCK_UPDATED, STOCK_OUT, STOCK_LOW |
| product_id | UUID | Yes | Product identifier |
| sku | string | Yes | Product SKU |
| old_quantity | decimal | Yes | Previous quantity |
| new_quantity | decimal | Yes | Current quantity |
| location_id | UUID | Yes | Warehouse/location |
| location_name | string | No | Human-readable location |
| reason | string | Yes | sale, return, adjustment, transfer |
| timestamp | ISO-8601 | Yes | Event time |
| tenant_id | UUID | Yes | Tenant identifier |
| unit | string | No | Unit of measure |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Quantity Non-negative | new_quantity >= 0 | "Quantity cannot be negative" |
| SKU Present | sku is not empty | "SKU required" |
| Valid Reason | reason in allowed list | "Invalid reason code" |
| Product Exists | product_id valid UUID | "Invalid product ID" |

### Expected Outcome

- Consistent event structure across all stock changes
- Payload includes sufficient context for webstore updates
- Validation catches malformed data before publishing

### Verification Checklist

- [ ] Payload dataclass/model defined with all required fields
- [ ] Serialization to JSON works correctly
- [ ] Validation rejects negative quantities
- [ ] Timestamp in ISO-8601 format
- [ ] Tenant ID included for multi-tenancy
- [ ] Payload builder creates valid instances from InventoryMovement
- [ ] Unit tests verify payload structure and validation

---

## Task 21: Create Price Publisher

### Overview

Implement PricePublisher for real-time price updates. Publishes price changes to webstore when product prices modified. Supports promotional pricing and currency conversions.

**Dependencies:** Task 17 (SyncPublisher service)

### Instructions

1. Create `price.py` in publisher directory
2. Define PricePublisher class following same pattern as InventoryPublisher
3. Implement `publish_price_change()` method accepting product and price data
4. Set channel pattern to `prices:{tenant_id}`
5. Include currency, effective date, and price tier context
6. Add support for promotional price events separate from base price
7. Implement price comparison logic to determine change magnitude
8. Add validation ensuring price values positive and non-zero
9. Configure event batching for bulk price updates (sale events)

### Event Types

| Event Type | Trigger | Use Case |
|-----------|---------|----------|
| PRICE_UPDATED | Base price change | Regular price adjustment |
| PROMO_STARTED | Promotional price set | Sale begins |
| PROMO_ENDED | Promotion expires | Sale ends, revert to base |
| BULK_PRICE_UPDATE | Multiple products | Category-wide price change |

### Price Context

| Field | Type | Purpose |
|-------|------|---------|
| old_price | Decimal | Previous price |
| new_price | Decimal | Updated price |
| currency | String | LKR |
| effective_from | DateTime | When price active |
| price_tier | String | retail, wholesale, online |
| discount_percent | Decimal | If promotional |

### Expected Outcome

- Price changes reflected in webstore immediately
- Promotional pricing handled separately from base prices
- Bulk price updates batched efficiently

### Verification Checklist

- [ ] Price changes trigger events on Product save
- [ ] Events published to `prices:{tenant_id}` channel
- [ ] Promotional prices distinguished from base prices
- [ ] Currency included in all events (LKR)
- [ ] Effective date handling for scheduled price changes
- [ ] Bulk updates batched to prevent event flood
- [ ] Integration test confirms webstore price updates

---

## Task 22: Create Price Changed Signal

### Overview

Define Django signal for price changes. Connects Product model price field updates to publisher. Fires only when price actually changes, not on every save.

**Dependencies:** Task 21 (Price Publisher)

### Instructions

1. Add `price_changed` signal to `signals.py`
2. Specify arguments: product_id, old_price, new_price, currency, effective_from
3. Connect to Product model post_save
4. Implement receiver checking if price field modified
5. Add logic to detect promotional vs base price changes
6. Use `transaction.on_commit()` for signal safety
7. Include price tier detection from product configuration
8. Add conditional firing only when price difference exceeds threshold (e.g., 0.01)

### Signal Specification

| Property | Value | Notes |
|----------|-------|-------|
| Signal Name | price_changed | Identifier |
| Sender | Product | Model |
| Arguments | product_id, old_price, new_price, currency, effective_from | Payload data |
| Firing Condition | price modified | Avoid unnecessary events |

### Change Detection

| Check | Logic | Purpose |
|-------|-------|---------|
| Field Changed | price != old_price | Detect actual change |
| Threshold | abs(difference) > 0.01 | Ignore rounding errors |
| Promotional | promo_price field present | Distinguish promo |
| Effective Date | effective_from in future | Scheduled pricing |

### Expected Outcome

- Price changes trigger signal automatically
- Signal fires only for meaningful price differences
- Promotional pricing handled distinctly

### Verification Checklist

- [ ] Signal registered for Product model
- [ ] Receiver detects price field changes
- [ ] Threshold logic prevents noise from rounding
- [ ] Promotional price changes identified
- [ ] Signal fires after database commit
- [ ] Currency included in signal arguments
- [ ] Tests verify signal dispatch on price update

---

## Task 23: Create Price Event Payload

### Overview

Define structured payload for price change events. Ensures consistent price data format sent to webstore. Includes historical pricing context and metadata.

**Dependencies:** Task 22 (Price Changed Signal)

### Instructions

1. Add PriceEventPayload to `payloads.py`
2. Define fields: event_type, product_id, sku, old_price, new_price, currency, effective_from, price_tier
3. Add optional fields: discount_percent, promo_code, promo_end_date
4. Implement decimal serialization for price precision
5. Add currency validation (currently only LKR supported)
6. Include percentage change calculation method
7. Format effective_from as ISO-8601 datetime
8. Add tenant_id for multi-tenant routing
9. Create payload builder from Product instance

### Payload Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| event_type | string | Yes | PRICE_UPDATED, PROMO_STARTED, PROMO_ENDED |
| product_id | UUID | Yes | Product identifier |
| sku | string | Yes | Product SKU |
| old_price | decimal | Yes | Previous price (2 decimals) |
| new_price | decimal | Yes | Current price (2 decimals) |
| currency | string | Yes | LKR |
| effective_from | ISO-8601 | Yes | When price becomes active |
| price_tier | string | No | retail, wholesale, online |
| discount_percent | decimal | No | For promotions |
| promo_code | string | No | Promotion identifier |
| promo_end_date | ISO-8601 | No | When promotion expires |
| tenant_id | UUID | Yes | Tenant identifier |
| change_percent | decimal | Computed | Price change percentage |

### Validation Rules

| Rule | Check | Message |
|------|-------|---------|
| Positive Price | new_price > 0 | "Price must be positive" |
| Valid Currency | currency == "LKR" | "Invalid currency" |
| Price Precision | 2 decimal places | "Invalid price format" |
| Effective Date | Not in past | "Effective date cannot be past" |
| Promo Logic | If promo_code, require promo_end_date | "Promo end date required" |

### Expected Outcome

- Price payloads formatted consistently for webstore consumption
- Decimal precision maintained for currency accuracy
- Promotional context included when applicable

### Verification Checklist

- [ ] Payload includes all required price fields
- [ ] Decimal serialization preserves 2-digit precision
- [ ] Currency validation enforced (LKR only)
- [ ] Percentage change calculated correctly
- [ ] Promotional fields populated when applicable
- [ ] Effective date in future validated
- [ ] Builder creates valid payload from Product instance

---

## Task 24: Create Product Publisher

### Overview

Implement ProductPublisher for full product lifecycle events. Handles product creation, updates, and deletion. Publishes comprehensive product data including attributes, categories, and media.

**Dependencies:** Task 17 (SyncPublisher service)

### Instructions

1. Create `product.py` in publisher directory
2. Define ProductPublisher class with comprehensive product event handling
3. Implement `publish_product_created()` for new products
4. Implement `publish_product_updated()` for modifications
5. Implement `publish_product_deleted()` for soft/hard deletes
6. Set channel to `products:{tenant_id}`
7. Include full product data: attributes, categories, images, variants, localization
8. Add field change detection to only publish modified fields on update
9. Implement media URL generation for product images
10. Add support for product variants and bundles

### Product Lifecycle Events

| Event Type | Trigger | Payload Size | Description |
|-----------|---------|--------------|-------------|
| PRODUCT_CREATED | New product saved | Full | All product data |
| PRODUCT_UPDATED | Existing product modified | Delta | Only changed fields |
| PRODUCT_DELETED | Product soft-deleted | Minimal | ID and timestamp |
| PRODUCT_ACTIVATED | is_active = True | Minimal | ID and status |
| PRODUCT_DEACTIVATED | is_active = False | Minimal | ID and status |

### Product Data Scope

| Category | Fields Included | Notes |
|----------|----------------|-------|
| Core | id, sku, name, name_si, description, is_active | Required |
| Pricing | price, cost, tax_rate | From separate events too |
| Inventory | stock_quantity, reorder_level | From separate events too |
| Categorization | category_id, subcategory_id, tags | Hierarchical |
| Media | images[], thumbnail | CDN URLs |
| Variants | has_variants, variant_options | If applicable |
| Localization | name_si, description_si | Sinhala support |

### Expected Outcome

- Complete product information synchronized to webstore
- Product lifecycle (create, update, delete) tracked accurately
- Sinhala localization included in events

### Verification Checklist

- [ ] Product creation publishes full product data
- [ ] Product updates send only changed fields (delta)
- [ ] Product deletion events received by webstore
- [ ] Sinhala names and descriptions included
- [ ] Product images published as CDN URLs
- [ ] Category relationships included in payload
- [ ] Variant information synchronized for variant products

---

## Task 25: Create Product Signal

### Overview

Define Django signals for product lifecycle. Connects Product model to publisher for create, update, delete events. Handles both post_save and post_delete signals.

**Dependencies:** Task 24 (Product Publisher)

### Instructions

1. Add `product_changed` signal to `signals.py`
2. Connect to Product model post_save and post_delete
3. Implement receiver distinguishing create vs update based on `created` flag
4. Add field tracking to detect which fields changed on update
5. Include category change detection for re-categorization events
6. Use `transaction.on_commit()` for all product signals
7. Add image change detection for media updates
8. Implement signal filtering to skip draft products (not published yet)

### Signal Matrix

| Signal | Trigger | Event Type | Condition |
|--------|---------|-----------|-----------|
| product_changed | post_save (created=True) | PRODUCT_CREATED | is_published=True |
| product_changed | post_save (created=False) | PRODUCT_UPDATED | is_published=True |
| product_changed | post_delete | PRODUCT_DELETED | Always |
| product_changed | save (is_active changed) | PRODUCT_ACTIVATED/DEACTIVATED | State change |

### Change Tracking

| Field | Tracked | Why |
|-------|---------|-----|
| name, name_si | Yes | Display change |
| price | No | Separate price signal |
| stock_quantity | No | Separate inventory signal |
| category_id | Yes | Re-categorization |
| is_active | Yes | Availability change |
| images | Yes | Media update |
| description | Yes | Content update |

### Expected Outcome

- Product changes trigger appropriate signals automatically
- Signal type (created, updated, deleted) determined correctly
- Draft products excluded from synchronization

### Verification Checklist

- [ ] post_save signal fires for new products
- [ ] post_save signal fires for product updates
- [ ] post_delete signal fires when product deleted
- [ ] Created flag distinguishes new vs updated products
- [ ] Field tracking identifies changed attributes
- [ ] Draft products (unpublished) skipped
- [ ] Signals fire after transaction commit

---

## Task 26: Create Product Payload

### Overview

Define comprehensive product event payload structure. Largest and most complex payload type. Includes all product data needed for webstore display and search.

**Dependencies:** Task 25 (Product Signal)

### Instructions

1. Add ProductEventPayload to `payloads.py`
2. Define core fields: event_type, product_id, sku, name, name_si, description, description_si, is_active
3. Add pricing fields: price, cost, currency, tax_rate
4. Add inventory snapshot: stock_quantity, reorder_level, stock_status
5. Add categorization: category_id, category_name, subcategory_id, tags
6. Add media: images[], thumbnail_url, video_url
7. Add variant data: has_variants, variant_options[], default_variant_id
8. Add metadata: created_at, updated_at, tenant_id, publisher_id
9. Implement nested serialization for complex fields (images, variants)
10. Add builder method with lazy loading for related objects

### Core Payload Structure

| Section | Fields | Notes |
|---------|--------|-------|
| Identity | product_id, sku, tenant_id | Unique identifiers |
| Content | name, name_si, description, description_si | Bilingual |
| Status | is_active, is_featured, is_published | Flags |
| Pricing | price, cost, tax_rate, currency | Snapshot |
| Inventory | stock_quantity, reorder_level, stock_status | Snapshot |
| Categorization | category_id, category_name, subcategory_id, tags[] | Hierarchy |
| Media | images[], thumbnail_url, video_url | URLs |
| Variants | has_variants, variant_options[], default_variant_id | If applicable |
| Metadata | created_at, updated_at, event_timestamp | Timestamps |

### Image Object Structure

| Field | Type | Description |
|-------|------|-------------|
| image_id | UUID | Image identifier |
| url | string | CDN URL |
| thumbnail_url | string | Thumbnail URL |
| alt_text | string | SEO alt text |
| display_order | integer | Sort order |
| is_primary | boolean | Primary image flag |

### Variant Option Structure

| Field | Type | Description |
|-------|------|-------------|
| option_name | string | Size, Color, etc. |
| option_value | string | Large, Red, etc. |
| price_modifier | decimal | +/- price adjustment |
| sku_suffix | string | Variant SKU component |

### Expected Outcome

- Complete product data available in single payload
- Webstore can render product pages from payload alone
- Bilingual content (English/Sinhala) included

### Verification Checklist

- [ ] Payload includes all required product fields
- [ ] Sinhala translations (name_si, description_si) present
- [ ] Image array properly serialized with URLs
- [ ] Variant options included for variant products
- [ ] Category hierarchy maintained in payload
- [ ] Nested objects serialize to JSON correctly
- [ ] Builder handles missing related objects gracefully
- [ ] Payload size reasonable (<50KB for typical product)

---

## Summary and Next Steps

### Completed in This Document

This document covered Tasks 17-26, implementing the foundation of ERP publisher system. Created base SyncPublisher service providing singleton access to Redis pub/sub. Implemented four entity publishers: Inventory, Price, Product, and Customer. Each publisher includes dedicated Django signals and structured payload definitions. Publishers handle real-time synchronization of critical ERP data to webstore.

### Task Completion Status

| Task | Component | Status |
|------|-----------|--------|
| 17 | SyncPublisher Service | ✓ Documented |
| 18 | Inventory Publisher | ✓ Documented |
| 19 | Stock Changed Signal | ✓ Documented |
| 20 | Stock Event Payload | ✓ Documented |
| 21 | Price Publisher | ✓ Documented |
| 22 | Price Changed Signal | ✓ Documented |
| 23 | Price Event Payload | ✓ Documented |
| 24 | Product Publisher | ✓ Documented |
| 25 | Product Signal | ✓ Documented |
| 26 | Product Payload | ✓ Documented |

### Deliverables Summary

```
backend/apps/sync/
├── publisher/
│   ├── __init__.py
│   ├── service.py          # Task 17: Base publisher
│   ├── inventory.py        # Task 18: Inventory publisher
│   ├── price.py            # Task 21: Price publisher
│   └── product.py          # Task 24: Product publisher
├── signals.py              # Tasks 19, 22, 25: Django signals
└── payloads.py            # Tasks 20, 23, 26: Event payloads
```

### Integration Points

| Publisher | Signal | Payload | Channel Pattern |
|-----------|--------|---------|-----------------|
| Inventory | inventory_changed | StockEventPayload | inventory:{tenant_id} |
| Price | price_changed | PriceEventPayload | prices:{tenant_id} |
| Product | product_changed | ProductEventPayload | products:{tenant_id} |

### Key Design Patterns

- **Singleton:** SyncPublisher service ensures single Redis connection
- **Observer:** Django signals decouple models from sync logic
- **Publisher-Subscriber:** Redis channels enable real-time communication
- **Data Transfer Object:** Payloads standardize event structure
- **Multi-tenancy:** Channel names include tenant_id for isolation

### Testing Strategy

| Test Type | Focus | Coverage |
|-----------|-------|----------|
| Unit | Individual publishers, signals, payloads | 80%+ |
| Integration | End-to-end event flow ERP → Redis | Critical paths |
| Load | Publisher throughput and throttling | 1000 events/sec |

### Next Document

**Document 02:** [02_Tasks-27-32_Batch-Throttle.md](02_Tasks-27-32_Batch-Throttle.md)

Covers remaining publisher tasks:
- Task 27: Customer Publisher
- Task 28: Customer Signal
- Task 29: Batch Publisher
- Task 30: Throttle Logic
- Task 31: Publisher Logging
- Task 32: Verify ERP Publisher

Implements bulk event handling, rate limiting, logging, and comprehensive publisher verification.

---

## Notes for Implementation

### Redis Connection Pooling

Configure Django-Redis with connection pooling:
- Min connections: 5
- Max connections: 50
- Connection timeout: 5 seconds
- Socket timeout: 3 seconds

### Error Handling Strategy

| Error Type | Strategy | Action |
|-----------|----------|--------|
| Connection Failure | Retry with backoff | Log and queue |
| Serialization Error | Skip event | Log error details |
| Invalid Payload | Validation error | Log and alert |
| Channel Error | Fallback channel | Use default channel |

### Performance Considerations

- Use async publishers for high-throughput scenarios
- Batch events when possible (covered in Task 29)
- Implement circuit breaker for Redis failures
- Monitor queue depth and publish latency
- Set TTL on Redis channels to prevent memory bloat

### Security Considerations

- Validate tenant_id before publishing to prevent cross-tenant leaks
- Sanitize user-generated content in payloads
- Use secure Redis connections (TLS) in production
- Implement rate limiting per tenant
- Log all publish operations for audit trail

### Monitoring Metrics

| Metric | Type | Threshold |
|--------|------|-----------|
| Events Published | Counter | Monitor baseline |
| Publish Latency | Histogram | <50ms p95 |
| Redis Connection Errors | Counter | <1% error rate |
| Payload Size | Histogram | <10KB average |
| Events Per Second | Gauge | Configurable limit |

### Multi-Tenant Considerations

Each publisher must:
- Extract tenant_id from current context
- Include tenant_id in channel name
- Validate tenant_id exists and is active
- Handle tenant-specific configuration
- Support tenant isolation for data privacy

### Localization Support

Product payloads include Sinhala (Sinhalese) translations:
- Field naming: `{field}_si` (e.g., name_si, description_si)
- Language detection from request context
- Fallback to English if translation missing
- Support for RTL languages planned (future)

---

**End of Document 01**

*Total Tasks Documented: 10 (Tasks 17-26)*  
*Next: Document 02 - Batch, Throttle, Logging, Verification*
