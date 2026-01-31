# Group C: Webstore Sync Consumer - WebSocket & Health Monitoring

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 09 - Real-time Sync Engine  
> **Group:** C of F  
> **Document:** 02 of 02  
> **Tasks Covered:** 44-50  
> **Purpose:** Implement WebSocket broadcasting, consumer logging, error handling, health monitoring, and verification

---

## Navigation

- **↑ Group Overview:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-43_Entity-Handlers.md](./01_Tasks-33-43_Entity-Handlers.md)
- **→ Next Group:** [Group-D Document 01](../Group-D_Bidirectional-Sync/01_Tasks-51-60_Conflict-Resolution.md)

---

## Document Context

### Purpose

This document covers implementing real-time WebSocket broadcasting to connected clients, comprehensive logging infrastructure, error handling with retry mechanisms, health monitoring endpoints, and final consumer verification testing.

### Scope

- WebSocket broadcast infrastructure with Socket.io
- Channel group management for multi-tenant isolation
- Client notification system for real-time updates
- Consumer logging with structured event tracking
- Error handling with retry and dead letter queue
- Health monitoring endpoints and status reporting
- End-to-end consumer verification

### Audience

Backend developers implementing real-time client communication and operational monitoring for Webstore sync consumer.

---

## Task 44: Create WebSocket Broadcast

### Overview

Create WebSocket Broadcast service that pushes synchronization events to connected Webstore clients in real-time. This service uses Socket.io to manage connections, broadcasts updates to relevant client groups, handles tenant isolation, and ensures message delivery to active sessions.

### Dependencies

- Task 43 (All entity handlers operational and emitting updates)
- Socket.io server configured in Webstore application
- Redis adapter for Socket.io for horizontal scaling

### Instructions

1. Create WebSocketBroadcast class with Socket.io server instance in constructor
2. Implement broadcast method accepting room identifier, event name, and payload data
3. Add room validation that verifies tenant context and permission before broadcasting
4. Implement message formatting that creates consistent event structure for clients
5. Add broadcast delivery tracking with message ID and timestamp for debugging
6. Implement connection state check that verifies room has active connections before sending
7. Add broadcast batching for multiple updates to same room within time window
8. Integrate with entity handlers to trigger broadcasts after database commits

### Broadcast Configuration

| Parameter | Type | Purpose |
|-----------|------|---------|
| io | Socket.io Server | WebSocket server instance |
| redisAdapter | Redis Adapter | Multi-instance coordination |
| batchWindow | number | Milliseconds to batch messages |
| messageRetention | number | Messages kept in buffer |

### Broadcast Patterns

| Pattern | Room Format | Use Case |
|---------|-------------|----------|
| Tenant-wide | tenant:{tenant_id} | All users in tenant |
| Product-specific | tenant:{tenant_id}:product:{product_id} | Product page viewers |
| Customer-specific | tenant:{tenant_id}:user:{user_id} | Personal notifications |
| Store-wide | tenant:{tenant_id}:store | General announcements |

### Expected Outcome

- Broadcast service successfully sends messages to Socket.io rooms
- Connected clients receive real-time updates for relevant entities
- Tenant isolation maintained through room-based segregation
- Message delivery tracked for operational visibility

### Verification Checklist

- [ ] Broadcast service initializes with Socket.io server
- [ ] Test broadcast to tenant room delivers to connected client
- [ ] Tenant validation prevents cross-tenant message delivery
- [ ] Message format consistent across all broadcast types
- [ ] Broadcast tracking logs message ID and delivery count
- [ ] No broadcasts sent to empty rooms
- [ ] Message batching reduces duplicate updates

---

## Task 45: Create WS Channel Group

### Overview

Implement WebSocket Channel Group management that handles client connections, room assignments, disconnections, and tenant context validation. This component ensures clients join appropriate rooms based on their authentication and maintains clean connection state.

### Dependencies

- Task 44 (WebSocket Broadcast infrastructure in place)
- Authentication middleware for Socket.io
- Tenant context extraction from JWT tokens

### Instructions

1. Create ChannelGroupManager class managing client-to-room mappings
2. Implement connection handler that authenticates client and extracts tenant context from token
3. Add auto-join logic that subscribes client to tenant-wide room on successful authentication
4. Implement joinRoom method for explicit room joins with permission validation
5. Add leaveRoom method for explicit room departures and cleanup
6. Implement disconnection handler that removes client from all rooms and logs session end
7. Add room membership tracking that maintains list of clients per room for diagnostics

### Connection Flow

| Step | Action | Validation |
|------|--------|------------|
| 1 | Client connects | Check connection limit |
| 2 | Authenticate | Validate JWT token |
| 3 | Extract tenant | Parse tenant_id from token |
| 4 | Auto-join tenant room | Join tenant:{tenant_id} |
| 5 | Subscribe to events | Listen for join requests |
| 6 | Handle disconnection | Clean up all rooms |

### Room Permissions

| Room Type | Join Permission | Validation |
|-----------|-----------------|------------|
| Tenant-wide | Any authenticated user | Tenant match |
| Product-specific | Any authenticated user | Tenant match |
| Customer-specific | Account owner only | User ID match |
| Admin | Admin role required | Role check |

### Expected Outcome

- Clients successfully connect and authenticate via Socket.io
- Automatic room assignment based on tenant context
- Permission validation prevents unauthorized room access
- Clean disconnection handling removes stale client references

### Verification Checklist

- [ ] Client connection succeeds with valid JWT token
- [ ] Client automatically joins tenant room on connect
- [ ] Client receives broadcasts in tenant room
- [ ] Unauthorized client rejected on authentication failure
- [ ] Client can explicitly join product-specific room
- [ ] Client removed from all rooms on disconnect
- [ ] Room membership list accurate after connections/disconnections

---

## Task 46: Create Client Notification

### Overview

Create Client Notification system that formats and delivers typed notification events to connected clients. This system defines notification schemas for different event types, includes relevant data payloads, handles notification preferences, and ensures consistent message structure.

### Dependencies

- Task 45 (Channel Group management operational)
- Notification preferences stored in user profile
- Notification templates defined

### Instructions

1. Create NotificationService class with method for each notification type
2. Implement sendStockUpdate method that formats inventory change notifications
3. Implement sendPriceUpdate method that formats price change notifications
4. Implement sendProductUpdate method that formats product modification notifications
5. Implement sendOrderUpdate method that formats order status notifications
6. Add notification preference check that filters based on user settings before delivery
7. Add notification templating that populates message templates with event data
8. Integrate with WebSocket Broadcast to deliver formatted notifications to appropriate rooms

### Notification Types

| Type | Event | Data Included | Target Room |
|------|-------|---------------|-------------|
| stock_update | Inventory changed | product_id, sku, quantity, availability | Product viewers |
| price_update | Price changed | product_id, sku, old_price, new_price, percent | Product viewers |
| product_update | Product modified | product_id, sku, change_type, fields | Product viewers |
| order_update | Order status change | order_id, status, tracking_number | Customer-specific |
| sale_started | Sale begins | product_ids[], sale_price, end_date | Tenant-wide |
| restock_alert | Product back in stock | product_id, sku, quantity | Waitlist customers |

### Notification Schema

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| notification_id | uuid | Yes | Unique identifier |
| type | string | Yes | Notification category |
| timestamp | number | Yes | Event time (milliseconds) |
| tenant_id | string | Yes | Tenant context |
| entity_type | string | Yes | Affected entity |
| entity_id | string | Yes | Entity identifier |
| data | object | Yes | Type-specific payload |
| action_url | string | No | Navigation link |
| priority | string | Yes | low, medium, high |

### Expected Outcome

- Notifications deliver with consistent structure across types
- Client applications parse and display notifications correctly
- User preferences filter unwanted notifications
- High-priority notifications delivered immediately

### Verification Checklist

- [ ] Stock update notification triggers on quantity change
- [ ] Price update notification includes old and new price
- [ ] Product update notification specifies changed fields
- [ ] Order update notification delivers to correct customer
- [ ] Notification preference filtering works correctly
- [ ] Notification schema validation catches malformed data
- [ ] Client UI renders notifications as expected

---

## Task 47: Create Consumer Logging

### Overview

Implement comprehensive Consumer Logging that tracks all event consumption activities, measures processing latency, identifies performance bottlenecks, maintains audit trail, and supports operational troubleshooting. This logging provides visibility into sync health and enables performance optimization.

### Dependencies

- Task 46 (All consumer components operational and generating events)
- Structured logging library configured (e.g., Winston, Pino)
- Log aggregation service available (e.g., ELK, Datadog)

### Instructions

1. Create ConsumerLogger class wrapping structured logging library with domain-specific methods
2. Implement logEventReceived method capturing event type, tenant, entity, and timestamp
3. Implement logEventProcessed method capturing processing result, latency, and status
4. Add performance metrics collection measuring handler execution time per event type
5. Implement logBroadcastSent method tracking WebSocket message delivery with recipient count
6. Add correlation ID tracking that links event through entire processing pipeline
7. Implement log level configuration supporting development debug and production info levels
8. Add structured log fields following standard schema for easy querying

### Log Events

| Event | Level | Trigger | Fields |
|-------|-------|---------|--------|
| event.received | INFO | Event arrives from Redis | event_type, tenant_id, entity_id |
| event.processed | INFO | Handler completes | handler, latency_ms, status |
| event.failed | ERROR | Handler throws error | error_message, stack_trace |
| broadcast.sent | DEBUG | WebSocket message sent | room, recipient_count, message_id |
| consumer.started | INFO | Service starts | version, channels |
| consumer.stopped | INFO | Service stops | uptime, events_processed |

### Log Schema

| Field | Type | Purpose |
|-------|------|---------|
| timestamp | ISO 8601 | Event time |
| level | string | Log severity |
| service | string | Always "sync-consumer" |
| event_type | string | Specific event |
| correlation_id | uuid | Request tracking |
| tenant_id | string | Tenant context |
| entity_type | string | Affected entity |
| entity_id | string | Entity identifier |
| latency_ms | number | Processing time |
| status | string | success, failed, skipped |
| metadata | object | Additional context |

### Expected Outcome

- Comprehensive logging provides visibility into all consumer activities
- Processing latency metrics identify slow handlers
- Correlation IDs enable tracing events through entire system
- Structured logs support efficient querying and alerting

### Verification Checklist

- [ ] Event received logs appear when Redis message arrives
- [ ] Event processed logs include accurate latency measurements
- [ ] Error logs capture stack traces for failed events
- [ ] Broadcast sent logs track message delivery
- [ ] Correlation IDs consistent across related log entries
- [ ] Log aggregation service ingests and indexes logs
- [ ] Query for specific event type returns relevant logs

---

## Task 48: Create Error Handler

### Overview

Create Error Handler that catches consumer errors, implements retry logic with exponential backoff, routes unprocessable events to dead letter queue, sends error alerts to monitoring systems, and ensures service resilience against transient failures.

### Dependencies

- Task 47 (Consumer Logging operational for error tracking)
- Dead letter queue configured in Redis
- Error alerting service available (e.g., Sentry, PagerDuty)

### Instructions

1. Create ErrorHandler class with methods for different error types and retry strategies
2. Implement handleEventError method that wraps event processing with try-catch
3. Add retry logic that attempts reprocessing with exponential backoff for transient errors
4. Implement error classification that distinguishes transient vs permanent failures
5. Add dead letter queue routing for events exceeding retry limit or having permanent errors
6. Implement error alerting that sends critical errors to monitoring service with context
7. Add error rate limiting that prevents alert storms during widespread failures
8. Create error recovery method that reprocesses DLQ events after issues resolved

### Error Classification

| Error Type | Classification | Retry Strategy |
|------------|----------------|----------------|
| Network timeout | Transient | Retry 3x with backoff |
| Database deadlock | Transient | Retry 3x with backoff |
| Invalid event format | Permanent | Send to DLQ immediately |
| Missing product | Permanent | Send to DLQ immediately |
| Connection refused | Transient | Retry with circuit breaker |
| Rate limit exceeded | Transient | Retry after delay |

### Retry Configuration

| Attempt | Delay | Total Elapsed |
|---------|-------|---------------|
| 1 | 0ms | 0ms |
| 2 | 1000ms | 1s |
| 3 | 2000ms | 3s |
| 4 | 4000ms | 7s |
| Final | DLQ | - |

### Expected Outcome

- Transient errors retry automatically with exponential backoff
- Permanent errors route to DLQ without blocking pipeline
- Critical errors trigger alerts to on-call engineers
- Error recovery enables reprocessing after system restoration

### Verification Checklist

- [ ] Transient error triggers retry with correct delay
- [ ] Event succeeds on retry after transient failure
- [ ] Permanent error routes to DLQ immediately
- [ ] DLQ contains failed events with error context
- [ ] Error alert sent to monitoring service for critical failures
- [ ] Alert rate limiting prevents duplicate notifications
- [ ] DLQ reprocessing succeeds after issue resolution
- [ ] Error logs include complete troubleshooting context

---

## Task 49: Create Consumer Health

### Overview

Implement Consumer Health monitoring that provides health check endpoint, reports service status, tracks key metrics, detects degraded states, and enables automated remediation through orchestration platforms. This health check supports load balancer health probes and service monitoring.

### Dependencies

- Task 48 (Error Handler operational and tracking failures)
- Health check endpoint framework (e.g., Express health route)
- Metrics collection service available

### Instructions

1. Create HealthMonitor class that tracks consumer service health indicators
2. Implement getHealthStatus method returning comprehensive health report with status code
3. Add Redis connection check that verifies subscriber connection is active and responsive
4. Add event processing check that ensures events consumed within acceptable timeframe
5. Implement error rate check that flags degraded status if error rate exceeds threshold
6. Add latency check that monitors average processing latency against SLA target
7. Create health endpoint route returning JSON health report with HTTP status codes
8. Implement readiness vs liveness probes for Kubernetes orchestration

### Health Indicators

| Indicator | Check | Healthy Threshold |
|-----------|-------|-------------------|
| Redis Connection | Connection state | Connected |
| Last Event Time | Time since last event | < 60 seconds |
| Error Rate | Failed events / total | < 5% |
| Avg Latency | Processing time | < 500ms |
| Queue Depth | Pending messages | < 100 |
| Memory Usage | Process memory | < 80% limit |

### Health Status Values

| Status | HTTP Code | Condition | Action |
|--------|-----------|-----------|--------|
| healthy | 200 | All checks pass | None |
| degraded | 200 | Some checks warning | Log alert |
| unhealthy | 503 | Critical check fails | Remove from load balancer |
| starting | 503 | Service initializing | Wait for ready |

### Expected Outcome

- Health endpoint returns accurate service status
- Load balancers route traffic only to healthy instances
- Monitoring systems detect and alert on degraded status
- Orchestration platforms restart unhealthy containers

### Verification Checklist

- [ ] Health endpoint responds with 200 when service healthy
- [ ] Health endpoint responds with 503 when Redis disconnected
- [ ] Health report includes all configured indicators
- [ ] Error rate calculation accurate based on recent events
- [ ] Latency average reflects actual processing times
- [ ] Readiness probe passes only after full initialization
- [ ] Liveness probe detects hung consumer process
- [ ] Kubernetes restarts pod on repeated liveness failures

---

## Task 50: Verify Consumer

### Overview

Execute comprehensive consumer verification testing that validates end-to-end event flow, confirms all handlers operate correctly, verifies real-time client notifications, tests error handling and recovery, measures performance under load, and certifies production readiness.

### Dependencies

- Task 49 (All consumer components implemented and health checks operational)
- Test environment with ERP publisher configured
- Load testing tools available (e.g., Artillery, k6)

### Instructions

1. Create verification test suite covering all consumer functionality with automated assertions
2. Implement end-to-end test that publishes ERP event and verifies Webstore update and client notification
3. Add handler-specific tests for inventory, price, product, and customer handlers with various scenarios
4. Implement error handling tests that inject failures and verify retry and DLQ behavior
5. Add tenant isolation test that verifies events route only to correct tenant rooms
6. Implement performance test measuring throughput and latency under sustained load
7. Add stress test that identifies breaking points and resource limits
8. Execute all tests and document results with pass/fail status and performance metrics

### Test Scenarios

| Scenario | Test Steps | Expected Outcome |
|----------|------------|------------------|
| Inventory Update | Publish INVENTORY_UPDATED → Check DB → Verify broadcast | Stock updates in <100ms |
| Price Change | Publish PRICE_UPDATED → Check DB → Verify client notification | Price updates in <100ms |
| Product Create | Publish PRODUCT_CREATED → Check DB → Verify search index | Product created in <500ms |
| Customer Sync | Publish CUSTOMER_UPDATED → Check DB → Verify profile | Profile syncs in <200ms |
| Transient Error | Inject network timeout → Verify retry → Confirm success | Succeeds on retry |
| Permanent Error | Publish malformed event → Verify DLQ routing | Routes to DLQ immediately |
| Tenant Isolation | Publish tenant A event → Verify tenant B not notified | No cross-tenant leakage |

### Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| Throughput | 1000 events/sec | Peak sustainable rate |
| P50 Latency | <100ms | Median processing time |
| P95 Latency | <500ms | 95th percentile time |
| P99 Latency | <1000ms | 99th percentile time |
| Error Rate | <0.1% | Failed events / total |
| Broadcast Delivery | >99.9% | Delivered messages / sent |

### Expected Outcome

- All functional tests pass demonstrating correct behavior
- Performance tests meet or exceed target benchmarks
- Error handling tests confirm resilience and recovery
- Tenant isolation tests verify security boundaries
- Consumer certified ready for production deployment

### Verification Checklist

- [ ] End-to-end test passes for all entity types
- [ ] Inventory handler updates stock correctly
- [ ] Price handler updates prices correctly
- [ ] Product handler performs CRUD operations correctly
- [ ] Customer handler syncs profiles correctly
- [ ] WebSocket clients receive notifications in real-time
- [ ] Retry logic handles transient errors successfully
- [ ] DLQ captures permanent errors correctly
- [ ] Health endpoint reports accurate status
- [ ] Throughput meets 1000 events/sec target
- [ ] P95 latency under 500ms
- [ ] Tenant isolation verified with no cross-tenant leakage
- [ ] Service recovers gracefully from Redis restart
- [ ] Memory usage stable during sustained operation
- [ ] No memory leaks detected in 24-hour test
- [ ] All verification test results documented

---

## Integration Testing

### Multi-Component Tests

| Test Name | Components Tested | Verification |
|-----------|-------------------|--------------|
| Full Sync Flow | Publisher → Redis → Consumer → DB → WebSocket | Complete data flow |
| Concurrent Updates | Multiple publishers → Single consumer | No data loss or corruption |
| Failover Handling | Publisher fails → Consumer retries → Publisher recovers | Resilient recovery |
| Scale Testing | Multiple consumers → Shared Redis → Load balancing | Even distribution |

### Load Testing Scenarios

| Scenario | Configuration | Duration | Target |
|----------|---------------|----------|--------|
| Baseline | 100 events/sec | 10 min | Establish baseline metrics |
| Sustained Load | 500 events/sec | 60 min | Verify stability |
| Peak Load | 1000 events/sec | 10 min | Confirm capacity |
| Spike Load | 2000 events/sec | 1 min | Test elasticity |

### Monitoring During Testing

| Metric | Collection | Alert Threshold |
|--------|------------|-----------------|
| CPU Usage | Per-second | >80% |
| Memory Usage | Per-second | >85% |
| Event Latency | Per-event | >1000ms |
| Error Rate | Per-minute | >1% |
| Queue Depth | Per-second | >500 |

---

## Operational Procedures

### Deployment Checklist

- [ ] Environment variables configured with correct values
- [ ] Redis connection string points to production cluster
- [ ] Database connection pool sized appropriately
- [ ] Socket.io Redis adapter configured for multi-instance
- [ ] Logging configured to send to aggregation service
- [ ] Error alerting connected to monitoring service
- [ ] Health check endpoint exposed to load balancer
- [ ] Kubernetes readiness and liveness probes configured
- [ ] Resource limits set (CPU, memory, file descriptors)
- [ ] Auto-scaling policies configured based on CPU and queue depth

### Monitoring Setup

| Monitor | Metric | Threshold | Action |
|---------|--------|-----------|--------|
| Event Lag | Time behind current | >30 seconds | Alert on-call |
| Error Rate | Failed events % | >5% | Alert on-call |
| Queue Depth | Pending messages | >1000 | Scale up consumers |
| Latency | P95 processing time | >1000ms | Investigate bottleneck |
| Connection Drops | Reconnect events | >10/hour | Check network |

### Troubleshooting Guide

| Issue | Symptoms | Investigation Steps | Resolution |
|-------|----------|---------------------|------------|
| No events processing | No logs, zero throughput | Check Redis connection, verify publisher running | Restart consumer, fix connection |
| High latency | P95 >1000ms | Check DB queries, review handler logic | Optimize queries, add indexes |
| Memory leak | Memory usage climbing | Profile heap, check event handlers | Fix handler cleanup, restart instance |
| Missing broadcasts | DB updates but no client notifications | Check Socket.io connections, verify rooms | Restart WebSocket server |
| Cross-tenant data | Events in wrong tenant | Review room joins, check tenant extraction | Fix tenant validation logic |

---

## Summary

This document covered implementing WebSocket broadcast infrastructure for real-time client updates, channel group management with tenant isolation, client notification formatting and delivery, comprehensive consumer logging with structured events, error handling with retry and DLQ mechanisms, health monitoring endpoints with multiple indicators, and thorough consumer verification testing validating production readiness.

**Implementation Complete:** Webstore Sync Consumer fully functional with entity handlers, real-time broadcasting, operational monitoring, and verified through comprehensive testing. Ready for production deployment and integration with ERP publisher.

---

## Cross-References

### Related Phases

- **Phase 03:** Authentication system for WebSocket auth
- **Phase 08:** Webstore platform infrastructure

### Related SubPhases

- **SubPhase 08.06:** Real-time features with Socket.io
- **SubPhase 09.02:** ERP publisher creating events

### Integration Points

| Component | Integration | Purpose |
|-----------|-------------|---------|
| ERP Publisher | Redis pub/sub | Event delivery |
| Socket.io Server | WebSocket connections | Client notifications |
| Webstore DB | Data persistence | Sync target |
| Monitoring Service | Error alerts | Operational visibility |
| Load Balancer | Health checks | Traffic routing |

### Next Steps

Proceed to Group-D for bidirectional sync implementation enabling Webstore-to-ERP synchronization, conflict resolution, and full two-way data flow.

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Status:** Ready for Implementation
