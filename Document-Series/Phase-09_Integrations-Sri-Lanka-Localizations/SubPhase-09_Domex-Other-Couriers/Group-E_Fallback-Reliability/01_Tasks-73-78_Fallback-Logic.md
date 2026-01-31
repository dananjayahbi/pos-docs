# Tasks 73-78: Fallback Logic Implementation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** E - Fallback & Reliability  
> **Document:** 01 of 02  
> **Tasks Covered:** 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-79-82_Status-Alert-Verify.md](02_Tasks-79-82_Status-Alert-Verify.md)

---

## Document Overview

This document covers the implementation of the fallback logic system for courier selection. It establishes courier priority ordering, health check services, availability verification, automatic fallback mechanisms, comprehensive logging, and retry logic with exponential backoff. The fallback system ensures reliable shipment processing by automatically switching to alternative couriers when the preferred option fails.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create Courier Priority | Low | 30 min |
| 74 | Create Health Check | Medium | 60 min |
| 75 | Create Availability Check | Medium | 45 min |
| 76 | Create Auto Fallback | High | 90 min |
| 77 | Create Fallback Logging | Low | 30 min |
| 78 | Create Retry with Fallback | Medium | 60 min |

---

## Task 73: Create Courier Priority

### Overview
Establish the courier priority order system that determines the sequence in which couriers are attempted during shipment creation. The priority system supports tenant-level customization while providing sensible defaults. Priority order is configurable per tenant based on their preferred couriers, pricing considerations, and service level requirements.

### Dependencies
- Task 72: Verify Trance Express Integration (previous group)

### Instructions

1. **Define courier priority constants**
   - Navigate to `backend/apps/shipping/constants.py`
   - Create COURIER_PRIORITY enumeration
   - List all available couriers in default priority order
   - Include: Koombiyo, Domex, Prompt X, Royal Express, Trance Express

2. **Create priority configuration model**
   - Add CourierPriority model in `shipping/models/`
   - Link to Tenant model for multi-tenancy
   - Include courier name and priority order fields
   - Add is_enabled flag for enabling/disabling couriers

3. **Implement priority retrieval service**
   - Create get_courier_priority() function in `shipping/services/`
   - Accept tenant parameter
   - Return ordered list of enabled couriers
   - Fall back to default priority if no custom config exists

4. **Add tenant-level priority management**
   - Create admin interface for CourierPriority
   - Allow drag-and-drop reordering in admin
   - Enable bulk enable/disable operations
   - Add validation to ensure at least one courier is enabled

5. **Create priority calculation logic**
   - Consider multiple factors: base priority, tenant preference
   - Include cost optimization option
   - Factor in historical reliability data
   - Support weighted priority based on destination

6. **Add priority override mechanism**
   - Support temporary priority changes
   - Implement API-level override for specific shipments
   - Allow user selection in frontend (optional)
   - Log all priority overrides for audit

7. **Implement caching for priority data**
   - Cache tenant priority configuration
   - Set TTL to 5 minutes
   - Invalidate cache on configuration changes
   - Reduce database queries during high-volume operations

### Priority Order Structure

```
Tenant Priority Configuration
├── Preferred Courier (user-selected)
├── Koombiyo (default #1)
├── Domex (default #2)
├── Prompt X (default #3)
├── Royal Express (default #4)
└── Trance Express (default #5)
```

### Priority Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| Tenant Preference | 40% | Custom priority set by tenant |
| Cost | 25% | Shipping cost for the route |
| Reliability | 20% | Historical success rate |
| Speed | 15% | Delivery time estimate |

### Configuration Fields

| Field | Type | Purpose |
|-------|------|---------|
| tenant | ForeignKey | Link to tenant |
| courier_name | CharField | Courier identifier |
| priority_order | IntegerField | Order position (lower = higher priority) |
| is_enabled | BooleanField | Active status |
| cost_weight | DecimalField | Cost optimization factor |
| reliability_weight | DecimalField | Reliability factor |

### Default Priority Matrix

| Rank | Courier | Reason |
|------|---------|--------|
| 1 | Koombiyo | Best API, widest coverage |
| 2 | Domex | Reliable, good pricing |
| 3 | Prompt X | Good for Colombo |
| 4 | Royal Express | Budget option |
| 5 | Trance Express | Specialized routes |

### Expected Outcome
- Configurable courier priority system
- Tenant-specific priority overrides
- Default priority order for all tenants
- Admin interface for priority management
- Cached priority data for performance

### Verification Checklist
- [ ] CourierPriority model created
- [ ] Default priority order defined
- [ ] Tenant-specific configuration working
- [ ] Admin interface functional
- [ ] Caching implemented
- [ ] Priority retrieval service tested

---

## Task 74: Create Health Check

### Overview
Implement a periodic health check service that monitors the availability and responsiveness of all courier APIs. The health check system runs automated tests against each courier's API endpoints, tracks response times, and maintains historical health data. This enables proactive detection of courier API issues and informs fallback decisions.

### Dependencies
- Task 73: Create Courier Priority

### Instructions

1. **Create health check service module**
   - Create `backend/apps/shipping/services/health_check.py`
   - Define CourierHealthCheck class
   - Implement async health check methods
   - Support concurrent checks for multiple couriers

2. **Define health check endpoints for each courier**
   - Koombiyo: GET /api/v1/health or equivalent
   - Domex: Lightweight rate request
   - Prompt X: Status endpoint
   - Royal Express: Ping endpoint
   - Trance Express: Health endpoint

3. **Implement health check method**
   - Create check_courier_health() method
   - Set request timeout to 5 seconds
   - Catch connection errors and timeouts
   - Return health status object with details

4. **Add response validation**
   - Verify HTTP status code (200 = healthy)
   - Check response time (< 2 seconds = good)
   - Validate response structure
   - Parse any health indicators in response

5. **Create batch health check functionality**
   - Implement check_all_couriers() method
   - Run checks concurrently using asyncio
   - Aggregate results from all couriers
   - Return comprehensive health report

6. **Implement health status storage**
   - Store health check results in database
   - Link to CourierStatus model (Task 79)
   - Record timestamp, response time, status
   - Maintain history for trend analysis

7. **Create Celery periodic task**
   - Set up Celery beat task for automated checks
   - Configure 5-minute interval
   - Add task to CELERYBEAT_SCHEDULE
   - Log task execution and results

8. **Add health check retry logic**
   - Retry failed checks up to 3 times
   - Use exponential backoff (1s, 2s, 4s)
   - Mark as unhealthy after all retries fail
   - Log all retry attempts

9. **Implement health score calculation**
   - Calculate health score (0-100)
   - Factor in success rate, response time
   - Weight recent checks more heavily
   - Use rolling 24-hour window

### Health Check Flow

```
┌─────────────────────────────────────┐
│   Celery Periodic Task (5 min)     │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   check_all_couriers()              │
│   - Run concurrent checks           │
└─────────┬───────────────────────────┘
          │
          ├──────┬──────┬──────┬──────┤
          ▼      ▼      ▼      ▼      ▼
     Koombiyo Domex PromptX Royal Trance
          │      │      │      │      │
          └──────┴──────┴──────┴──────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   Store Results in CourierStatus    │
│   - Update last_check timestamp     │
│   - Record health metrics           │
└─────────────────────────────────────┘
```

### Health Check Response Structure

| Field | Type | Description |
|-------|------|-------------|
| courier | String | Courier identifier |
| is_healthy | Boolean | Overall health status |
| response_time | Float | API response time (ms) |
| status_code | Integer | HTTP status code |
| timestamp | DateTime | Check timestamp |
| error_message | String | Error details if failed |

### Health Status Criteria

| Status | Condition |
|--------|-----------|
| Healthy | Response < 2s, HTTP 200 |
| Degraded | Response 2-5s, HTTP 200 |
| Unhealthy | Timeout or HTTP error |

### Timeout Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Connection timeout | 3 seconds | Quick connection check |
| Read timeout | 5 seconds | Allow for slow responses |
| Total timeout | 5 seconds | Overall request limit |

### Health Check Schedule

| Frequency | Purpose |
|-----------|---------|
| Every 5 minutes | Regular monitoring |
| On-demand | Manual health check |
| Pre-shipment | Verify before booking |

### Expected Outcome
- Automated health check service
- Periodic monitoring of all couriers
- Health status stored in database
- Response time tracking
- Concurrent check execution
- Celery beat integration

### Verification Checklist
- [ ] Health check service created
- [ ] All courier endpoints defined
- [ ] Timeout configuration set
- [ ] Concurrent checks working
- [ ] Celery task scheduled
- [ ] Health status storage implemented
- [ ] Retry logic functional

---

## Task 75: Create Availability Check

### Overview
Implement zone availability checking to verify whether a courier provides service to a specific destination. The availability check validates that the selected courier operates in the destination city, district, or postal code area before attempting to create a shipment. This prevents API failures due to service area limitations and improves fallback decision-making.

### Dependencies
- Task 74: Create Health Check

### Instructions

1. **Define courier coverage data**
   - Create coverage data structure for each courier
   - List supported cities, districts, postal codes
   - Include exclusion zones (areas not served)
   - Support different coverage for different service types

2. **Create availability check service**
   - Create `shipping/services/availability_check.py`
   - Implement CourierAvailabilityChecker class
   - Add check_availability() method
   - Support multiple address formats

3. **Implement city-level availability**
   - Check if destination city is in courier's coverage
   - Use city name matching (case-insensitive)
   - Support city aliases (e.g., "Colombo" = "CMB")
   - Return boolean availability status

4. **Add district-level availability**
   - Check district coverage if city not found
   - Use district boundaries for verification
   - Support partial district coverage
   - Provide coverage percentage for districts

5. **Implement postal code verification**
   - Create postal code range checker
   - Support postal code prefix matching
   - Validate format before checking
   - Handle partial postal codes

6. **Create zone mapping system**
   - Define delivery zones for each courier
   - Map cities/districts to zones
   - Support zone-based pricing integration
   - Maintain zone mapping in database

7. **Add coverage API integration**
   - Query courier API for coverage (if available)
   - Cache coverage data locally
   - Sync coverage data periodically
   - Handle API coverage check failures gracefully

8. **Implement fallback coverage logic**
   - If exact match not found, check nearby areas
   - Use geo-coordinates for proximity check
   - Calculate distance to nearest covered zone
   - Return availability with distance factor

9. **Create coverage caching**
   - Cache availability results for 24 hours
   - Key by courier + destination
   - Invalidate on coverage data updates
   - Reduce API calls and improve performance

### Availability Check Flow

```
┌─────────────────────────────────────┐
│   check_availability()              │
│   Input: courier, destination       │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Check Cache   │
         └────────┬───────┘
                  │
         ┌────────┴────────┐
         │                 │
    Cache Hit          Cache Miss
         │                 │
         ▼                 ▼
    Return Result   ┌──────────────┐
                    │ City Check   │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │              │
                  Found         Not Found
                    │              │
                    │              ▼
                    │      ┌──────────────┐
                    │      │District Check│
                    │      └──────┬───────┘
                    │             │
                    │      ┌──────┴───────┐
                    │      │              │
                    │    Found         Not Found
                    │      │              │
                    │      │              ▼
                    │      │      ┌──────────────┐
                    │      │      │Postal Check  │
                    │      │      └──────┬───────┘
                    │      │             │
                    └──────┴─────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ Cache Result  │
                   └───────┬───────┘
                           │
                           ▼
                   Return Availability
```

### Coverage Data Structure

| Courier | Coverage Type | Data Source |
|---------|---------------|-------------|
| Koombiyo | City list | API + database |
| Domex | District zones | Static config |
| Prompt X | Postal codes | API lookup |
| Royal Express | City + postal | Database |
| Trance Express | Custom zones | Manual config |

### Availability Response

| Field | Type | Description |
|-------|------|-------------|
| is_available | Boolean | Service available |
| coverage_type | String | city/district/postal |
| matched_zone | String | Zone identifier |
| confidence | Float | Match confidence (0-1) |
| estimated_distance | Float | Distance to zone (km) |

### Coverage Match Priority

| Priority | Check Type | Accuracy |
|----------|------------|----------|
| 1 | Exact city match | 100% |
| 2 | District match | 90% |
| 3 | Postal code range | 85% |
| 4 | Nearby zone | 70% |

### Zone Types

| Zone Type | Description | Example |
|-----------|-------------|---------|
| Urban | Metro cities | Colombo, Kandy |
| Suburban | Outskirts | Dehiwala, Kadawatha |
| Rural | Remote areas | Village areas |
| Special | Islands, restricted | Jaffna, military zones |

### Expected Outcome
- Zone availability checking service
- City, district, postal code validation
- Coverage data for all couriers
- Cached availability results
- Integration with fallback logic
- Support for partial coverage

### Verification Checklist
- [ ] Availability check service created
- [ ] Coverage data defined for all couriers
- [ ] City-level checking working
- [ ] District-level checking working
- [ ] Postal code verification implemented
- [ ] Caching functional
- [ ] Fallback coverage logic added

---

## Task 76: Create Auto Fallback

### Overview
Implement the automatic fallback mechanism that switches to alternative couriers when the primary courier fails. The auto fallback system integrates courier priority, health status, and availability checks to intelligently select the next best courier option. It handles multiple failure scenarios including API errors, timeout issues, and service unavailability.

### Dependencies
- Task 75: Create Availability Check

### Instructions

1. **Create fallback orchestrator service**
   - Create `shipping/services/fallback.py`
   - Define CourierFallbackOrchestrator class
   - Implement main fallback logic
   - Coordinate between priority, health, availability

2. **Implement primary courier selection**
   - Get courier priority list from Task 73
   - Select top priority enabled courier
   - Check health status from Task 74
   - Verify availability from Task 75

3. **Create fallback trigger detection**
   - Detect API connection errors
   - Catch timeout exceptions
   - Identify rate limit responses
   - Handle invalid response formats
   - Recognize service unavailability errors

4. **Implement fallback iteration logic**
   - Move to next courier in priority list
   - Skip unhealthy couriers
   - Verify availability for destination
   - Attempt shipment creation
   - Repeat until success or exhaustion

5. **Add maximum fallback attempts limit**
   - Set limit to 3 courier attempts
   - Track attempts count
   - Raise final error if all fail
   - Log all attempted couriers

6. **Create intelligent courier filtering**
   - Filter by health status (healthy only)
   - Filter by availability for destination
   - Filter by service type support
   - Filter by tenant-enabled couriers

7. **Implement fallback state management**
   - Track current courier attempt
   - Store attempted courier list
   - Record failure reasons for each
   - Maintain fallback context throughout process

8. **Add fallback decision logging**
   - Log initial courier selection
   - Log fallback triggers and reasons
   - Log each courier attempt
   - Log final outcome (success/failure)

9. **Create fallback metrics tracking**
   - Count fallback occurrences
   - Track most common failure causes
   - Measure fallback success rates
   - Identify problematic couriers

10. **Implement fallback hooks**
    - Pre-fallback hook for custom logic
    - Post-fallback hook for notifications
    - Success callback for analytics
    - Failure callback for alerts

### Auto Fallback Flow

```
┌─────────────────────────────────────┐
│   create_shipment_with_fallback()  │
│   Input: shipment_data              │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   Get Priority List (Task 73)      │
│   - Filter by enabled               │
│   - Apply tenant preferences        │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   Select Primary Courier            │
│   - Top priority                    │
│   - Check health (Task 74)          │
│   - Check availability (Task 75)    │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   Attempt Shipment Creation         │
└─────────┬────────────────────┬──────┘
          │                    │
      Success                Failure
          │                    │
          ▼                    ▼
    Return Result    ┌──────────────────┐
                     │  Check Attempts  │
                     └────────┬─────────┘
                              │
                     ┌────────┴─────────┐
                     │                  │
                < 3 attempts       >= 3 attempts
                     │                  │
                     ▼                  ▼
          ┌──────────────────┐  Raise Error
          │  Fallback Logic  │  (All Failed)
          │  - Next courier  │
          │  - Health check  │
          │  - Availability  │
          └────────┬─────────┘
                   │
                   ▼
          (Loop back to Attempt)
```

### Fallback Triggers

| Trigger | Description | Action |
|---------|-------------|--------|
| ConnectionError | Cannot reach API | Immediate fallback |
| Timeout | Request timeout | Retry then fallback |
| HTTP 5xx | Server error | Immediate fallback |
| HTTP 429 | Rate limit | Skip courier |
| HTTP 400 | Invalid request | Log, try next if available |
| ServiceUnavailable | Courier down | Check health, fallback |

### Courier Selection Criteria

| Criteria | Priority | Required |
|----------|----------|----------|
| Enabled | High | Yes |
| Healthy | High | Yes |
| Available | High | Yes |
| Priority order | Medium | Yes |
| Cost | Low | No |

### Fallback Attempt Tracking

| Field | Type | Description |
|-------|------|-------------|
| attempt_number | Integer | Current attempt (1-3) |
| courier_name | String | Courier attempted |
| failure_reason | String | Why it failed |
| timestamp | DateTime | Attempt time |
| response_time | Float | API response time |

### Fallback Scenarios

| Scenario | Primary Action | Fallback Action |
|----------|----------------|-----------------|
| API timeout | Retry 1x | Next courier |
| Connection error | Immediate fallback | Try next |
| Invalid response | Log error | Try next |
| Service unavailable | Mark unhealthy | Skip courier |
| All couriers fail | Raise exception | Notify admin |

### Maximum Attempts Logic

```
Max Attempts = 3 couriers
├── Attempt 1: Primary (top priority)
├── Attempt 2: Secondary (next in list)
└── Attempt 3: Tertiary (third option)

If all fail → Raise CourierExhaustedError
```

### Expected Outcome
- Automatic courier fallback on failure
- Integration with priority, health, availability
- Maximum 3 courier attempts
- Comprehensive failure tracking
- Intelligent courier filtering
- Fallback metrics collection

### Verification Checklist
- [ ] Fallback orchestrator created
- [ ] Primary courier selection working
- [ ] Fallback trigger detection implemented
- [ ] Iteration logic functional
- [ ] Maximum attempts enforced
- [ ] Courier filtering working
- [ ] State management implemented
- [ ] Logging comprehensive
- [ ] Metrics tracking added

---

## Task 77: Create Fallback Logging

### Overview
Implement comprehensive logging for all fallback events to enable debugging, analytics, and monitoring of the fallback system. The logging system captures courier switches, failure reasons, attempt details, and outcomes. Logs are structured for easy querying and analysis of fallback patterns and courier reliability.

### Dependencies
- Task 76: Create Auto Fallback

### Instructions

1. **Define fallback log structure**
   - Create FallbackLog model in `shipping/models/`
   - Include fields: tenant, shipment, timestamp
   - Add from_courier and to_courier fields
   - Store failure_reason and attempt_number

2. **Create fallback logger utility**
   - Create `shipping/utils/fallback_logger.py`
   - Implement FallbackLogger class
   - Add methods for different log types
   - Support both database and file logging

3. **Implement log_fallback_event() method**
   - Accept shipment, from_courier, to_courier
   - Include failure reason and context
   - Store in database for queryability
   - Write to application log file

4. **Add structured logging format**
   - Use JSON format for log entries
   - Include timestamp, tenant, shipment ID
   - Add courier details and failure info
   - Include relevant context (destination, service)

5. **Integrate logging into fallback flow**
   - Log at each fallback trigger point
   - Log before attempting next courier
   - Log final outcome (success/failure)
   - Include timing information

6. **Create log level management**
   - Use WARNING level for fallbacks
   - Use ERROR level for total failures
   - Use INFO level for fallback success
   - Use DEBUG level for detailed flow

7. **Implement log aggregation**
   - Create method to query logs by courier
   - Support date range filtering
   - Calculate fallback statistics
   - Generate daily/weekly summaries

8. **Add log retention policy**
   - Retain detailed logs for 30 days
   - Keep aggregated data for 1 year
   - Archive old logs to S3 or similar
   - Implement automatic cleanup task

### Fallback Logging Flow

```
┌─────────────────────────────────────┐
│   Fallback Triggered                │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   log_fallback_event()              │
│   - Create FallbackLog entry        │
│   - Write to application log        │
└─────────────────┬───────────────────┘
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
  ┌──────────────┐  ┌──────────────┐
  │   Database   │  │  Log File    │
  │   Record     │  │  Entry       │
  └──────────────┘  └──────────────┘
```

### FallbackLog Model Fields

| Field | Type | Description |
|-------|------|-------------|
| tenant | ForeignKey | Tenant reference |
| shipment | ForeignKey | Related shipment |
| from_courier | CharField | Original courier |
| to_courier | CharField | Fallback courier |
| failure_reason | TextField | Why fallback occurred |
| attempt_number | IntegerField | Which attempt (1-3) |
| timestamp | DateTimeField | When it happened |
| response_time | FloatField | API response time |
| destination_city | CharField | Destination for analysis |
| was_successful | BooleanField | Final outcome |

### Log Entry Structure (JSON)

```json
{
  "event": "courier_fallback",
  "timestamp": "2026-01-31T10:30:45Z",
  "tenant_id": "abc123",
  "shipment_id": "ship_xyz789",
  "from_courier": "koombiyo",
  "to_courier": "domex",
  "failure_reason": "API timeout after 5s",
  "attempt_number": 1,
  "destination": "Kandy",
  "context": {
    "health_status": "degraded",
    "availability": true,
    "response_time_ms": 5100
  }
}
```

### Log Levels Usage

| Level | Use Case | Example |
|-------|----------|---------|
| DEBUG | Flow details | "Checking courier availability" |
| INFO | Fallback success | "Successfully fell back to Domex" |
| WARNING | Fallback triggered | "Koombiyo failed, trying Domex" |
| ERROR | All couriers failed | "All fallback attempts exhausted" |

### Fallback Statistics

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| Fallback rate | Fallbacks / Total shipments | Overall reliability |
| Courier failure rate | Failures / Attempts | Courier performance |
| Success after fallback | Successful fallbacks / Total | Fallback effectiveness |
| Average attempts | Sum attempts / Shipments | Complexity measure |

### Log Query Examples

| Query | Purpose |
|-------|---------|
| Fallbacks by courier | Identify problematic couriers |
| Fallbacks by destination | Find coverage gaps |
| Fallbacks by time | Detect outage patterns |
| Fallback success rate | Measure system effectiveness |

### Expected Outcome
- FallbackLog model for structured storage
- Comprehensive logging at all fallback points
- JSON-formatted log entries
- Query interface for log analysis
- Statistics and aggregation methods
- Log retention and cleanup policy

### Verification Checklist
- [ ] FallbackLog model created
- [ ] Fallback logger utility implemented
- [ ] Logging integrated into fallback flow
- [ ] JSON log format working
- [ ] Log levels configured correctly
- [ ] Query methods functional
- [ ] Statistics calculation working
- [ ] Retention policy implemented

---

## Task 78: Create Retry with Fallback

### Overview
Implement an intelligent retry mechanism that attempts to recover from transient failures before triggering the fallback system. The retry logic uses exponential backoff to avoid overwhelming failing APIs while maximizing the chance of success with the preferred courier. After exhausting retries, the system seamlessly transitions to the fallback mechanism.

### Dependencies
- Task 76: Create Auto Fallback

### Instructions

1. **Create retry configuration constants**
   - Define MAX_RETRIES = 3 for same courier
   - Set INITIAL_BACKOFF = 1 second
   - Configure BACKOFF_MULTIPLIER = 2
   - Set MAX_BACKOFF = 8 seconds

2. **Implement retry decorator**
   - Create `@retry_with_fallback` decorator
   - Accept retry count and backoff parameters
   - Wrap courier API calls
   - Handle specific exception types

3. **Create exponential backoff calculator**
   - Calculate wait time: initial * (multiplier ^ attempt)
   - Add jitter (random 0-20%) to prevent thundering herd
   - Cap maximum wait time
   - Return calculated wait duration

4. **Implement retry logic**
   - Wrap API call in try-except block
   - Catch retryable exceptions (timeout, connection)
   - Wait for calculated backoff duration
   - Increment retry counter
   - Retry up to MAX_RETRIES times

5. **Define retryable vs non-retryable errors**
   - Retryable: timeout, connection error, 503, 429
   - Non-retryable: 400, 401, 403, 404
   - Immediate fallback for non-retryable
   - Retry then fallback for retryable

6. **Integrate with fallback system**
   - After MAX_RETRIES exhausted, trigger fallback
   - Pass context to fallback system
   - Include retry history in fallback logs
   - Maintain attempt counter across retries and fallbacks

7. **Add circuit breaker pattern**
   - Track consecutive failures per courier
   - Open circuit after 5 consecutive failures
   - Skip courier in open state
   - Close circuit after cooldown period (10 min)

8. **Implement retry metrics tracking**
   - Count retry attempts per courier
   - Track retry success rate
   - Measure average retry time
   - Identify patterns in retry needs

9. **Create retry logging**
   - Log each retry attempt
   - Include wait time and reason
   - Log retry exhaustion events
   - Track transition to fallback

### Retry Flow with Fallback

```
┌─────────────────────────────────────┐
│   Attempt API Call                  │
└─────────────────┬───────────────────┘
                  │
          ┌───────┴────────┐
          │                │
      Success           Failure
          │                │
          ▼                ▼
    Return Result   ┌──────────────┐
                    │ Error Type?  │
                    └──────┬───────┘
                           │
                  ┌────────┴────────┐
                  │                 │
            Retryable         Non-retryable
                  │                 │
                  ▼                 ▼
         ┌─────────────┐     Immediate Fallback
         │Retry Count? │     (Task 76)
         └──────┬──────┘
                │
       ┌────────┴────────┐
       │                 │
   < MAX_RETRIES    >= MAX_RETRIES
       │                 │
       ▼                 ▼
┌──────────────┐   Trigger Fallback
│ Wait (Exp    │   (Task 76)
│ Backoff)     │
└──────┬───────┘
       │
       ▼
(Loop back to Attempt)
```

### Retry Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| MAX_RETRIES | 3 | Max same-courier retries |
| INITIAL_BACKOFF | 1s | First wait duration |
| BACKOFF_MULTIPLIER | 2 | Exponential factor |
| MAX_BACKOFF | 8s | Maximum wait time |
| JITTER | 0-20% | Prevent synchronized retries |

### Exponential Backoff Schedule

| Attempt | Base Wait | With Jitter (range) |
|---------|-----------|---------------------|
| 1 | 1s | 0.8s - 1.2s |
| 2 | 2s | 1.6s - 2.4s |
| 3 | 4s | 3.2s - 4.8s |
| 4 (fallback) | - | Switch courier |

### Error Classification

| Error Type | Retry? | Fallback? |
|------------|--------|-----------|
| Timeout | Yes (3x) | After retries |
| Connection error | Yes (3x) | After retries |
| HTTP 503 | Yes (3x) | After retries |
| HTTP 429 | Yes (with backoff) | After retries |
| HTTP 500 | Yes (2x) | After retries |
| HTTP 400 | No | Immediate |
| HTTP 401 | No | Immediate |
| HTTP 403 | No | Immediate |
| HTTP 404 | No | Immediate |

### Circuit Breaker States

| State | Condition | Action |
|-------|-----------|--------|
| Closed | < 5 failures | Normal operation |
| Open | >= 5 consecutive failures | Skip courier |
| Half-Open | After 10 min cooldown | Try 1 request |

### Retry Metrics

| Metric | Description |
|--------|-------------|
| Retry rate | % requests requiring retry |
| Retry success rate | % retries that succeed |
| Average retry count | Mean retries per request |
| Retry time overhead | Added latency from retries |

### Combined Retry + Fallback Example

```
Shipment Creation Request
├── Try Koombiyo (Attempt 1)
│   ├── Fail: Timeout
│   ├── Wait 1s
│   ├── Retry (Attempt 2)
│   ├── Fail: Timeout
│   ├── Wait 2s
│   ├── Retry (Attempt 3)
│   ├── Fail: Timeout
│   └── Retries exhausted
├── Fallback to Domex (Attempt 1)
│   ├── Success
│   └── Return tracking number
```

### Expected Outcome
- Retry mechanism with exponential backoff
- Integration with fallback system
- Intelligent error classification
- Circuit breaker implementation
- Comprehensive retry metrics
- Smooth transition from retry to fallback

### Verification Checklist
- [ ] Retry configuration defined
- [ ] Retry decorator implemented
- [ ] Exponential backoff working
- [ ] Error classification correct
- [ ] Fallback integration functional
- [ ] Circuit breaker implemented
- [ ] Retry metrics tracking
- [ ] Logging comprehensive

---

## Document Summary

This document established the complete fallback logic system for courier selection:

- **Task 73:** Courier priority configuration with tenant customization
- **Task 74:** Health check service with periodic monitoring
- **Task 75:** Zone availability checking for destination verification
- **Task 76:** Automatic fallback orchestration with intelligent selection
- **Task 77:** Comprehensive fallback logging for analysis
- **Task 78:** Retry mechanism with exponential backoff and circuit breaker

The fallback system ensures reliable shipment processing by automatically handling courier failures, maintaining service continuity, and providing detailed tracking of all fallback events.

---

## Next Steps

Proceed to **[02_Tasks-79-82_Status-Alert-Verify.md](02_Tasks-79-82_Status-Alert-Verify.md)** to implement the courier status model, status dashboard, failure alerts, and complete verification of the fallback logic system.
