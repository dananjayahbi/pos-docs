# Group C: Webstore Sync Consumer - Entity Handlers

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 09 - Real-time Sync Engine  
> **Group:** C of F  
> **Document:** 01 of 02  
> **Tasks Covered:** 33-43  
> **Purpose:** Implement Webstore consumer service and entity-specific event handlers

---

## Navigation

- **↑ Group Overview:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-B Document 02](../Group-B_ERP-Sync-Publisher/02_Tasks-26-32_Event-Publishing.md)
- **→ Next Document:** [02_Tasks-44-50_WebSocket-Health.md](./02_Tasks-44-50_WebSocket-Health.md)

---

## Document Context

### Purpose

This document covers implementing the Webstore-side SyncConsumer Service with Redis subscription capabilities and entity-specific handlers for inventory, price, product, and customer synchronization events from ERP.

### Scope

- SyncConsumer Service lifecycle management
- Redis channel subscription infrastructure
- Inventory event handler with stock updates and out-of-stock logic
- Price event handler with pricing updates
- Product event handler with full CRUD synchronization
- Customer event handler with profile synchronization

### Audience

Backend developers implementing real-time event consumption on Webstore Node.js platform.

---

## Task 33: Create SyncConsumer Service

### Overview

Create the main SyncConsumer Service class that manages the lifecycle of Webstore-side event consumption. This service starts on application initialization, maintains Redis subscription connections, routes incoming events to appropriate handlers, and provides graceful shutdown capabilities.

### Dependencies

- Task 32 (ERP Publisher Service operational)
- Redis client library configured
- Webstore database connection available

### Instructions

1. Create SyncConsumer class in webstore sync module with constructor accepting Redis client and handler registry
2. Implement start method that initializes Redis connection, subscribes to channels, and activates event routing
3. Implement stop method that unsubscribes from channels, closes connections, and performs cleanup
4. Add connection state management with reconnection logic for Redis failures
5. Implement event routing logic that parses channel names and dispatches to registered handlers
6. Add error boundary around event processing to prevent service crashes
7. Implement service health tracking with last-received timestamp and connection status
8. Create graceful shutdown hook integrated with application lifecycle

### Service Configuration

| Parameter | Type | Purpose |
|-----------|------|---------|
| redisClient | RedisClient | Connection to Redis pub/sub |
| handlerRegistry | Map<string, Handler> | Event type to handler mapping |
| reconnectDelay | number | Milliseconds between reconnect attempts |
| healthCheckInterval | number | Milliseconds between health checks |

### State Management

| State | Transition | Action |
|-------|------------|--------|
| STOPPED | → STARTING | Initialize Redis connection |
| STARTING | → RUNNING | Subscribe to channels |
| RUNNING | → STOPPING | Unsubscribe from channels |
| STOPPING | → STOPPED | Close connections |
| RUNNING | → ERROR | Log error, attempt reconnect |
| ERROR | → STARTING | Reconnect after delay |

### Expected Outcome

- SyncConsumer service successfully starts and subscribes to Redis channels
- Service maintains stable connection with automatic reconnection on failure
- Events route correctly to registered handlers based on channel and event type
- Service responds to shutdown signals with graceful cleanup

### Verification Checklist

- [ ] Service starts without errors and logs initialization
- [ ] Redis connection established and channels subscribed
- [ ] Test event published from ERP routes to correct handler
- [ ] Connection failure triggers reconnection logic
- [ ] Service stops gracefully on SIGTERM signal
- [ ] No memory leaks during prolonged operation
- [ ] Health check reports accurate service state

---

## Task 34: Create Redis Subscriber

### Overview

Implement Redis Subscriber component that handles low-level Redis pub/sub operations. This component manages channel subscriptions, receives published messages, validates message format, and invokes the appropriate callback for each channel.

### Dependencies

- Task 33 (SyncConsumer Service structure in place)
- Redis client with pub/sub support configured

### Instructions

1. Create RedisSubscriber class wrapping Redis client pub/sub functionality
2. Implement subscribe method accepting array of channel patterns with callback mappings
3. Add message validation that checks for required fields before callback invocation
4. Implement unsubscribe method for graceful channel cleanup
5. Add channel pattern matching supporting wildcards for tenant-specific routing
6. Implement message parsing that deserializes JSON and extracts metadata
7. Add subscription status tracking with channel list and subscription timestamps

### Channel Configuration

| Channel Pattern | Handler | Purpose |
|-----------------|---------|---------|
| sync:inventory:{tenant} | InventoryHandler | Stock updates |
| sync:price:{tenant} | PriceHandler | Price changes |
| sync:product:{tenant} | ProductHandler | Product CRUD |
| sync:customer:{tenant} | CustomerHandler | Customer sync |

### Message Structure

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| event_type | string | Yes | Action identifier |
| tenant_id | string | Yes | Tenant context |
| entity_type | string | Yes | Entity category |
| entity_id | string | Yes | Entity identifier |
| data | object | Yes | Event payload |
| timestamp | number | Yes | Event creation time |
| version | number | Yes | Schema version |

### Expected Outcome

- Subscriber successfully subscribes to all configured channel patterns
- Messages arrive and parse correctly with all required fields validated
- Callbacks invoke with properly structured event objects
- Subscription handles multi-tenant channel isolation correctly

### Verification Checklist

- [ ] All channel patterns subscribed successfully
- [ ] Test message published to each channel invokes callback
- [ ] Invalid message format rejected with error log
- [ ] Wildcard patterns match tenant-specific channels
- [ ] Unsubscribe removes channels cleanly
- [ ] No duplicate message delivery observed
- [ ] Subscription survives Redis connection reset

---

## Task 35: Create Inventory Handler

### Overview

Create InventoryHandler that processes inventory-related events from ERP. This handler receives stock updates, validates product existence in Webstore, and prepares data for stock quantity updates in Webstore product catalog.

### Dependencies

- Task 34 (Redis Subscriber operational)
- Webstore product model available
- Database transaction support configured

### Instructions

1. Create InventoryHandler class implementing event handler interface with handleEvent method
2. Implement event type routing for INVENTORY_UPDATED, STOCK_ADJUSTED, and STOCK_RESERVED events
3. Add product lookup by SKU to find corresponding Webstore product entity
4. Implement validation that checks product exists and tenant matches event context
5. Extract stock quantity and warehouse location from event payload
6. Add pre-update validation checking for negative stock or invalid values
7. Prepare update object with new stock quantity and last-updated timestamp
8. Pass validated data to Stock Update Logic for database persistence

### Event Types Handled

| Event Type | Trigger | Data Fields |
|------------|---------|-------------|
| INVENTORY_UPDATED | Stock count changed | sku, quantity, warehouse |
| STOCK_ADJUSTED | Manual adjustment | sku, adjustment, reason |
| STOCK_RESERVED | Order placed | sku, reserved_qty, order_id |

### Validation Rules

| Rule | Check | Action on Failure |
|------|-------|-------------------|
| Product Exists | SKU lookup succeeds | Log error, return early |
| Tenant Match | Event tenant equals product tenant | Log error, return early |
| Quantity Valid | quantity >= 0 | Log warning, set to 0 |
| Warehouse Valid | warehouse_id exists | Use default warehouse |

### Expected Outcome

- Handler successfully receives and parses inventory events
- Product lookup by SKU identifies correct Webstore product
- Validation catches mismatched tenants or missing products
- Prepared data passes to Stock Update Logic for persistence

### Verification Checklist

- [ ] Handler registered with SyncConsumer for inventory channel
- [ ] INVENTORY_UPDATED event processes successfully
- [ ] Product lookup finds correct product by SKU
- [ ] Invalid tenant event rejected with error log
- [ ] Missing product event logged and skipped
- [ ] Negative stock quantity handled gracefully
- [ ] Event processing completes within 100ms

---

## Task 36: Create Stock Update Logic

### Overview

Implement Stock Update Logic that persists inventory changes to Webstore product catalog. This logic executes database updates, maintains stock history, handles concurrent updates with locking, and triggers downstream notifications for stock changes.

### Dependencies

- Task 35 (Inventory Handler provides validated data)
- Webstore product schema with stock fields
- Database transaction and locking support

### Instructions

1. Implement updateStock function accepting product ID, new quantity, and metadata
2. Begin database transaction with row-level lock on product record for concurrent safety
3. Fetch current stock quantity for comparison and delta calculation
4. Update product stock_quantity field with new value and updated_at timestamp
5. Calculate stock delta and insert stock history record with change details
6. Check if stock crosses reorder threshold and create low-stock alert if needed
7. Commit transaction and return update result with old and new quantities
8. Add retry logic for deadlock scenarios with exponential backoff

### Update Operations

| Operation | SQL Action | Lock Type |
|-----------|------------|-----------|
| Read Current | SELECT stock_quantity FOR UPDATE | Row lock |
| Update Stock | UPDATE products SET stock_quantity = ? | Write lock |
| Insert History | INSERT INTO stock_history | No lock |
| Check Threshold | Compare stock vs reorder_point | No lock |

### Stock History Schema

| Field | Type | Purpose |
|-------|------|---------|
| id | uuid | Record identifier |
| product_id | uuid | Product reference |
| old_quantity | integer | Previous stock |
| new_quantity | integer | Updated stock |
| delta | integer | Change amount |
| reason | string | Change reason |
| event_id | string | Source event |
| created_at | timestamp | Record time |

### Expected Outcome

- Stock quantity updates persist correctly to Webstore product records
- Stock history maintains complete audit trail of changes
- Concurrent updates handled safely without race conditions
- Low-stock alerts trigger when thresholds crossed

### Verification Checklist

- [ ] Stock update reflects in product table immediately
- [ ] Stock history record created with accurate delta
- [ ] Concurrent updates from multiple events handled correctly
- [ ] Deadlock scenario retries successfully
- [ ] Transaction rollback on error preserves data integrity
- [ ] Low-stock alert created when stock below reorder point
- [ ] Update latency under 50ms for single product

---

## Task 37: Create Out of Stock Handler

### Overview

Create Out of Stock Handler that detects zero or negative stock conditions and takes appropriate actions. This handler marks products as unavailable, prevents new orders, notifies customers on waitlists, and triggers restock workflow if configured.

### Dependencies

- Task 36 (Stock Update Logic completes successfully)
- Webstore product availability flags
- Customer notification service available

### Instructions

1. Create OutOfStockHandler with checkAndHandle method triggered after stock updates
2. Implement stock level check comparing new quantity against zero threshold
3. Update product availability_status field to "out_of_stock" when quantity reaches zero
4. Add product_variants update if applicable to mark all variants unavailable
5. Query customer waitlist table for customers interested in the product
6. Generate notification events for each waitlisted customer informing of stock status
7. Check restock automation settings and create restock request if enabled

### Availability States

| Status | Condition | Customer Action |
|--------|-----------|-----------------|
| available | stock > 0 | Can purchase |
| low_stock | stock <= reorder_point | Can purchase, show warning |
| out_of_stock | stock = 0 | Cannot purchase, can join waitlist |
| discontinued | manually set | Cannot purchase, no restock |

### Notification Configuration

| Recipient | Trigger | Message Type |
|-----------|---------|--------------|
| Waitlisted customers | Stock reaches 0 | Out of stock notification |
| Store managers | Stock reaches 0 | Restock alert |
| Customers viewing | Stock reaches 0 | Real-time availability update |

### Expected Outcome

- Products automatically marked unavailable when stock reaches zero
- Customers cannot add out-of-stock products to cart
- Waitlisted customers receive notifications of stock status
- Restock workflows trigger for automatically managed inventory

### Verification Checklist

- [ ] Product availability_status updates to out_of_stock at zero quantity
- [ ] Product variants also marked unavailable if applicable
- [ ] Add-to-cart button disabled for out-of-stock products
- [ ] Waitlisted customers receive notification within 60 seconds
- [ ] Restock request created if automation enabled
- [ ] Status reverts to available when stock replenished
- [ ] Real-time UI updates reflect availability change

---

## Task 38: Create Price Handler

### Overview

Create PriceHandler that processes price-related events from ERP. This handler receives price updates, validates pricing rules, handles multi-currency scenarios, manages sale prices versus regular prices, and prepares data for price persistence.

### Dependencies

- Task 34 (Redis Subscriber operational)
- Webstore product pricing model
- Currency conversion service if multi-currency

### Instructions

1. Create PriceHandler class implementing event handler interface with handleEvent method
2. Implement event type routing for PRICE_UPDATED, SALE_PRICE_SET, and SALE_PRICE_EXPIRED events
3. Add product lookup by SKU with validation of tenant context
4. Extract price data including amount, currency, effective dates, and price type
5. Implement validation that checks price is non-negative and currency is supported
6. Handle multi-currency scenarios by converting to Webstore default currency if needed
7. Determine price type (regular vs sale) and prepare appropriate fields for update
8. Pass validated data to Price Update Logic for database persistence

### Event Types Handled

| Event Type | Trigger | Data Fields |
|------------|---------|-------------|
| PRICE_UPDATED | Regular price change | sku, price, currency, effective_date |
| SALE_PRICE_SET | Sale starts | sku, sale_price, start_date, end_date |
| SALE_PRICE_EXPIRED | Sale ends | sku, original_price |

### Price Validation Rules

| Rule | Check | Action on Failure |
|------|-------|-------------------|
| Non-negative | price >= 0 | Reject with error |
| Currency Supported | currency in allowed list | Reject or convert |
| Sale Price Lower | sale_price < regular_price | Log warning, accept |
| Date Range Valid | start_date < end_date | Reject with error |

### Expected Outcome

- Handler successfully receives and parses price events
- Product pricing updates prepared with validated amounts
- Multi-currency prices convert correctly to store default
- Sale prices distinguished from regular prices correctly

### Verification Checklist

- [ ] Handler registered with SyncConsumer for price channel
- [ ] PRICE_UPDATED event processes successfully
- [ ] Product lookup finds correct product by SKU
- [ ] Negative price rejected with error log
- [ ] Unsupported currency handled gracefully
- [ ] Sale price dates validated correctly
- [ ] Event processing completes within 100ms

---

## Task 39: Create Price Update Logic

### Overview

Implement Price Update Logic that persists pricing changes to Webstore product catalog. This logic handles regular prices, sale prices, scheduled price changes, price history tracking, and triggers cache invalidation for affected products.

### Dependencies

- Task 38 (Price Handler provides validated data)
- Webstore product pricing schema
- Cache invalidation service available

### Instructions

1. Implement updatePrice function accepting product ID, price data, and price type
2. Begin database transaction to ensure atomic price updates
3. Update product price field with new regular price if provided
4. Update sale_price, sale_start_date, and sale_end_date fields for sales
5. Insert price history record documenting the change with timestamp and reason
6. Calculate price change percentage for significant changes triggering notifications
7. Commit transaction and invalidate product cache entries for immediate effect
8. Return update result with old and new prices for logging and broadcasting

### Price Fields

| Field | Type | Purpose |
|-------|------|---------|
| price | decimal | Regular selling price |
| sale_price | decimal | Discounted price (nullable) |
| sale_start_date | timestamp | Sale begins (nullable) |
| sale_end_date | timestamp | Sale ends (nullable) |
| cost_price | decimal | Cost for margin calculation |
| currency | string | Price currency code |

### Price History Schema

| Field | Type | Purpose |
|-------|------|---------|
| id | uuid | Record identifier |
| product_id | uuid | Product reference |
| old_price | decimal | Previous price |
| new_price | decimal | Updated price |
| price_type | string | regular or sale |
| change_percent | decimal | Percentage change |
| event_id | string | Source event |
| effective_date | timestamp | When price becomes active |
| created_at | timestamp | Record time |

### Expected Outcome

- Price updates persist correctly to Webstore product records
- Sale prices activate and expire based on configured dates
- Price history maintains complete audit trail of changes
- Cache invalidation ensures customers see updated prices immediately

### Verification Checklist

- [ ] Regular price update reflects in product table immediately
- [ ] Sale price displays correctly in price calculation logic
- [ ] Price history record created with accurate change percentage
- [ ] Cache invalidation triggers for affected product
- [ ] Transaction rollback on error preserves data integrity
- [ ] Scheduled sale start/end dates enforced correctly
- [ ] Update latency under 50ms for single product

---

## Task 40: Create Product Handler

### Overview

Create ProductHandler that processes comprehensive product events from ERP. This handler manages full product lifecycle including creation, updates, deletion, and archival. It handles product master data, attributes, images, categories, and relationships.

### Dependencies

- Task 34 (Redis Subscriber operational)
- Webstore product model with all attributes
- File storage service for images

### Instructions

1. Create ProductHandler class implementing event handler interface with handleEvent method
2. Implement event type routing for PRODUCT_CREATED, PRODUCT_UPDATED, PRODUCT_DELETED, and PRODUCT_ARCHIVED events
3. Add product existence check for updates/deletes with SKU-based lookup
4. Extract complete product data including name, description, images, categories, attributes
5. Implement validation for required fields based on product type and category
6. Handle product images by downloading from ERP storage and uploading to Webstore storage
7. Process product categories mapping ERP categories to Webstore category tree
8. Pass validated data to Product Sync Logic for full database synchronization

### Event Types Handled

| Event Type | Trigger | Data Scope |
|------------|---------|------------|
| PRODUCT_CREATED | New product in ERP | Full product master data |
| PRODUCT_UPDATED | Product modified | Changed fields only |
| PRODUCT_DELETED | Product removed | Product ID and tenant |
| PRODUCT_ARCHIVED | Product inactive | Product ID and archive flag |

### Product Data Structure

| Field Group | Fields | Validation |
|-------------|--------|------------|
| Basic | sku, name, description | Required, unique SKU |
| Pricing | price, cost_price, currency | Non-negative, valid currency |
| Inventory | stock, reorder_point, warehouse | Non-negative integers |
| Media | images[], videos[] | Valid URLs or base64 |
| Taxonomy | categories[], tags[] | Valid category IDs |
| Attributes | attributes{} | Valid attribute keys |
| Metadata | weight, dimensions, barcode | Format validation |

### Expected Outcome

- Handler successfully receives and parses all product event types
- Product data extraction handles nested structures and media correctly
- Category mappings translate between ERP and Webstore taxonomies
- Prepared data passes to Product Sync Logic for complete persistence

### Verification Checklist

- [ ] Handler registered with SyncConsumer for product channel
- [ ] PRODUCT_CREATED event creates new product successfully
- [ ] PRODUCT_UPDATED event modifies existing product
- [ ] PRODUCT_DELETED event removes or archives product
- [ ] Product images download and upload correctly
- [ ] Category mappings resolve to valid Webstore categories
- [ ] Validation catches malformed product data
- [ ] Event processing completes within 500ms

---

## Task 41: Create Product Sync Logic

### Overview

Implement Product Sync Logic that performs complete product synchronization from ERP to Webstore. This logic handles create, update, delete operations with transactional integrity, manages related entities like variants and images, maintains search indexes, and ensures data consistency.

### Dependencies

- Task 40 (Product Handler provides validated data)
- Webstore product schema with relationships
- Search indexing service available

### Instructions

1. Implement syncProduct function accepting event type, product data, and metadata
2. Begin database transaction for atomic multi-table operations
3. For CREATED events, insert product record with all fields and generate UUID
4. For UPDATED events, fetch existing product, compare changes, and update modified fields
5. For DELETED events, soft-delete product or hard-delete based on configuration
6. Handle product images by storing image records in product_images table with ordering
7. Handle product categories by inserting into product_categories junction table
8. Sync product variants if applicable by iterating variant data and creating child records
9. Update product search index with new data for full-text search
10. Commit transaction and return sync result with operation type and affected IDs

### Sync Operations

| Operation | Database Actions | Affected Tables |
|-----------|------------------|-----------------|
| CREATE | INSERT product, images, categories, variants | 4 tables |
| UPDATE | UPDATE product, MERGE images, categories | 3 tables |
| DELETE | UPDATE deleted_at or DELETE records | 1-4 tables |
| ARCHIVE | UPDATE is_active, remove from search | 2 tables |

### Conflict Resolution

| Conflict | Detection | Resolution |
|----------|-----------|------------|
| Duplicate SKU | Unique constraint violation | Update existing product |
| Stale Update | Version mismatch | Use latest timestamp |
| Missing Category | Category ID not found | Skip category or create placeholder |
| Image Upload Fail | Storage error | Continue without image, log error |

### Expected Outcome

- Product synchronization completes transactionally across all related tables
- Product variants sync correctly with parent-child relationships
- Product images store with correct ordering and associations
- Search indexes update immediately for product discoverability

### Verification Checklist

- [ ] New product creation inserts all data correctly
- [ ] Product update modifies only changed fields
- [ ] Product images store with correct URLs and order
- [ ] Product categories establish correct associations
- [ ] Product variants create with parent linkage
- [ ] Soft delete preserves data for audit purposes
- [ ] Search index reflects new product data
- [ ] Transaction rollback on error prevents partial state
- [ ] Sync latency under 300ms for typical product

---

## Task 42: Create Customer Handler

### Overview

Create CustomerHandler that processes customer-related events from ERP. This handler receives customer profile updates, manages unified customer identity across ERP and Webstore, synchronizes contact information, handles customer segments, and prepares data for customer profile updates.

### Dependencies

- Task 34 (Redis Subscriber operational)
- Webstore customer/user model
- Unified identity matching service

### Instructions

1. Create CustomerHandler class implementing event handler interface with handleEvent method
2. Implement event type routing for CUSTOMER_CREATED, CUSTOMER_UPDATED, and CUSTOMER_MERGED events
3. Add customer lookup by email or phone to find corresponding Webstore user account
4. Implement identity matching logic that handles multiple identifiers and duplicate accounts
5. Extract customer data including contact info, billing/shipping addresses, preferences
6. Validate email format, phone number format, and address completeness
7. Handle customer segments by mapping ERP segments to Webstore customer groups
8. Pass validated data to Customer Sync Logic for profile updates

### Event Types Handled

| Event Type | Trigger | Data Fields |
|------------|---------|-------------|
| CUSTOMER_CREATED | New customer in ERP | Full profile data |
| CUSTOMER_UPDATED | Profile modified | Changed fields |
| CUSTOMER_MERGED | Duplicate accounts merged | Merged account IDs |

### Customer Data Structure

| Field Group | Fields | Synchronization |
|-------------|--------|-----------------|
| Identity | email, phone, erp_customer_id | Primary matching keys |
| Profile | first_name, last_name, company | Bidirectional sync |
| Addresses | billing_address, shipping_addresses[] | ERP master, Webstore adds more |
| Preferences | marketing_consent, language, currency | Webstore master |
| Segments | customer_group, loyalty_tier | ERP master |
| Metadata | created_at, last_purchase_date | Read-only from ERP |

### Identity Matching Logic

| Match Type | Criteria | Action |
|------------|----------|--------|
| Exact | email and tenant match | Update existing account |
| Partial | email matches, tenant differs | Create new account |
| Phone | phone matches, no email | Match and merge |
| ERP ID | erp_customer_id matches | Direct link |
| None | No matches found | Create new account |

### Expected Outcome

- Handler successfully receives and parses customer events
- Customer identity matching finds correct Webstore user accounts
- Profile data validates and prepares for synchronization
- Customer segments map correctly to Webstore groups

### Verification Checklist

- [ ] Handler registered with SyncConsumer for customer channel
- [ ] CUSTOMER_CREATED event creates or links account
- [ ] CUSTOMER_UPDATED event modifies existing profile
- [ ] Email matching finds correct user account
- [ ] Phone matching handles missing email scenarios
- [ ] Address validation catches incomplete data
- [ ] Customer segment mapping resolves correctly
- [ ] Event processing completes within 200ms

---

## Task 43: Create Customer Sync

### Overview

Implement Customer Sync Logic that synchronizes customer profiles between ERP and Webstore. This logic handles bidirectional updates, resolves conflicts, maintains unified customer identity, synchronizes addresses, manages customer groups, and ensures GDPR compliance for customer data handling.

### Dependencies

- Task 42 (Customer Handler provides validated data)
- Webstore user/customer schema
- GDPR compliance utilities available

### Instructions

1. Implement syncCustomer function accepting event type, customer data, and matching result
2. Begin database transaction for atomic customer profile updates
3. For CREATED events, create user account if not exists, or link to existing account
4. For UPDATED events, fetch existing profile, merge changes with conflict resolution
5. Update core profile fields (name, contact) prioritizing ERP as master source
6. Sync billing address by updating or creating address record in addresses table
7. Sync shipping addresses by comparing with existing and adding new ones
8. Update customer_group assignment based on ERP segment data
9. Respect GDPR flags by checking data_processing_consent before profile updates
10. Commit transaction and return sync result with profile ID and sync status

### Sync Strategy

| Data Type | Master Source | Conflict Resolution |
|-----------|---------------|---------------------|
| Contact Info | ERP | ERP always wins |
| Billing Address | ERP | ERP always wins |
| Shipping Addresses | Both | Merge, keep all |
| Preferences | Webstore | Webstore wins |
| Order History | Both | Read-only from both |
| Loyalty Points | ERP | ERP always wins |

### Address Synchronization

| Operation | Condition | Action |
|-----------|-----------|--------|
| Create | Address not in Webstore | INSERT new address |
| Update | Address exists, data differs | UPDATE existing |
| Keep | Address exists, data same | No action |
| Archive | Address in Webstore, not in ERP | Mark deleted if not default |

### Expected Outcome

- Customer profiles synchronize bidirectionally with conflict resolution
- Unified customer identity maintained across both platforms
- Addresses sync correctly without duplication
- Customer groups update based on ERP segmentation

### Verification Checklist

- [ ] Customer profile creates or updates successfully
- [ ] Contact information reflects latest ERP data
- [ ] Billing address updates correctly
- [ ] Shipping addresses merge without duplicates
- [ ] Customer group assignment reflects ERP segment
- [ ] GDPR consent flags respected during updates
- [ ] Transaction rollback on error preserves data integrity
- [ ] Sync latency under 200ms for typical profile
- [ ] No orphaned address records after sync

---

## Summary

This document covered implementing the Webstore SyncConsumer Service and entity-specific event handlers. Tasks 33-34 established the consumer infrastructure with Redis subscription. Tasks 35-37 created inventory handling with stock updates and out-of-stock logic. Tasks 38-39 implemented price handling with sale price support. Tasks 40-41 created comprehensive product synchronization with full CRUD operations. Tasks 42-43 implemented customer profile synchronization with unified identity management.

**Next Steps:** Proceed to Document 02 for WebSocket broadcast implementation, consumer logging, error handling, health monitoring, and consumer verification.

---

## Cross-References

### Related Phases

- **Phase 02:** Multi-tenancy architecture for tenant isolation
- **Phase 03:** Authentication system for admin access
- **Phase 08:** Webstore platform infrastructure

### Related SubPhases

- **SubPhase 08.01:** Webstore architecture foundation
- **SubPhase 08.06:** Real-time features infrastructure
- **SubPhase 09.02:** ERP publisher implementation

### Integration Points

| Component | Integration | Purpose |
|-----------|-------------|---------|
| Redis | Pub/sub subscription | Event delivery |
| Webstore DB | Product/customer tables | Data persistence |
| Search Service | Index updates | Product discoverability |
| Cache Service | Invalidation | Fresh data delivery |
| Notification Service | Customer alerts | Stock/price notifications |

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Status:** Ready for Implementation
