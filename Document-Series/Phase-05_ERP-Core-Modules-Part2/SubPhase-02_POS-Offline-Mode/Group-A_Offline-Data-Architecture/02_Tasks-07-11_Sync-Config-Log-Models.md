# Tasks 07-11: Sync Configuration and Log Models

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** A - Offline Data Architecture  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_Submodule-Schema-Design.md](01_Tasks-01-06_Submodule-Schema-Design.md)
- **→ Next Document:** [03_Tasks-12-16_Offline-Transaction-Priority.md](03_Tasks-12-16_Offline-Transaction-Priority.md)

---

## Document Overview

This document covers the creation of server-side models for managing offline synchronization configuration and logging. These models enable tenant-specific sync settings and comprehensive tracking of all sync operations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 07 | Create OfflineSyncConfig model | Medium |
| 08 | Add sync frequency settings | Medium |
| 09 | Add conflict resolution settings | Medium |
| 10 | Create SyncLog model | Medium |
| 11 | Add sync log fields | Medium |

---

## Task 07: Create OfflineSyncConfig Model

### Overview
Create a Django model to store tenant-specific offline synchronization configuration settings. This model controls sync behavior, timing, and limits for each tenant's POS operations.

### Dependencies
- Task 01: Create offline submodule
- Multi-tenancy infrastructure (django-tenants)
- POS models foundation

### Instructions

1. **Create sync_config.py file**
   - Navigate to `apps/pos/offline/models/`
   - Create new file `sync_config.py`

2. **Add file docstring**
   - Explain model purpose
   - Note tenant-specific configuration

3. **Import required dependencies**
   - Django model imports
   - Tenant-aware base model
   - Validation utilities
   - Constants from offline.constants

4. **Define OfflineSyncConfig model class**
   - Inherit from appropriate base model
   - Add model docstring

5. **Add tenant relationship field**
   - ForeignKey to Tenant model
   - Set appropriate related_name
   - Configure on_delete behavior

6. **Add basic identification fields**
   - config_name: Human-readable configuration name
   - is_active: Boolean to enable/disable config
   - description: Optional text field for notes

7. **Add timestamps**
   - created_at: Auto-set on creation
   - updated_at: Auto-update on modification
   - created_by: Reference to user who created config
   - updated_by: Reference to last user who updated

8. **Add model Meta class**
   - Set verbose_name and verbose_name_plural
   - Define default ordering
   - Add unique constraints if needed
   - Set database table name

9. **Add __str__ method**
   - Return meaningful string representation
   - Include tenant and config name

10. **Add validation methods**
    - Validate sync frequency ranges
    - Validate cache TTL values
    - Validate transaction limits

11. **Update models/__init__.py**
    - Import and expose OfflineSyncConfig model

### Model Structure

```
OfflineSyncConfig
├── Identification
│   ├── id (Primary Key)
│   ├── tenant (Foreign Key)
│   ├── config_name (String)
│   ├── is_active (Boolean)
│   └── description (Text)
│
├── Sync Settings (Tasks 08-09)
│   ├── [Frequency settings]
│   └── [Conflict resolution settings]
│
└── Metadata
    ├── created_at (DateTime)
    ├── updated_at (DateTime)
    ├── created_by (Foreign Key)
    └── updated_by (Foreign Key)
```

### Model Relationships

```
┌─────────┐
│ Tenant  │
└────┬────┘
     │
     │ 1:1 or 1:N
     ▼
┌──────────────────────┐
│ OfflineSyncConfig    │
│ ├── tenant_id        │
│ ├── config_name      │
│ ├── is_active        │
│ ├── [sync settings]  │
│ └── [timestamps]     │
└──────────────────────┘
```

### Field Specifications

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| **id** | UUID/Integer | Yes | Auto | Primary key |
| **tenant** | ForeignKey | Yes | - | Link to tenant |
| **config_name** | CharField(100) | Yes | - | Configuration name |
| **is_active** | BooleanField | Yes | True | Enable/disable config |
| **description** | TextField | No | "" | Optional notes |
| **created_at** | DateTimeField | Yes | Auto | Creation timestamp |
| **updated_at** | DateTimeField | Yes | Auto | Last update timestamp |
| **created_by** | ForeignKey | No | Null | User who created |
| **updated_by** | ForeignKey | No | Null | User who last updated |

### Validation Rules

**Configuration Validation:**
- config_name must be unique per tenant
- At most one config can be active per tenant
- Active config must have valid sync frequency settings
- Cache TTL values must be positive integers
- Transaction limits must be within reasonable ranges

**Business Rules:**
- Cannot deactivate config if terminals are currently using it
- Cannot delete config with associated sync logs
- Updating active config requires confirmation
- Default config created automatically for new tenants

### Expected Outcome
- OfflineSyncConfig model created in database
- Model registered in admin (optional)
- Model available for import from offline.models
- Basic tenant-specific configuration capability

### Verification Checklist
- [ ] `sync_config.py` file created
- [ ] OfflineSyncConfig model defined
- [ ] Tenant relationship established
- [ ] All identification fields added
- [ ] Timestamps and audit fields included
- [ ] Model Meta class configured
- [ ] __str__ method implemented
- [ ] Basic validation methods added
- [ ] Model imported in models/__init__.py
- [ ] Migration file generated

---

## Task 08: Add Sync Frequency Settings

### Overview
Add fields to the OfflineSyncConfig model that control the timing and frequency of automatic synchronization operations between offline terminals and the server.

### Dependencies
- Task 07: Create OfflineSyncConfig model

### Instructions

1. **Open sync_config.py**
   - Navigate to OfflineSyncConfig model

2. **Add auto sync interval field**
   - Field name: auto_sync_interval
   - Type: PositiveIntegerField
   - Unit: minutes
   - Default value: 30 minutes
   - Help text: "Minutes between automatic sync operations"

3. **Add sync on startup field**
   - Field name: sync_on_startup
   - Type: BooleanField
   - Default: True
   - Help text: "Perform full sync when POS terminal starts"

4. **Add sync on transaction field**
   - Field name: sync_after_transaction
   - Type: BooleanField
   - Default: False
   - Help text: "Sync immediately after each transaction"

5. **Add max offline transactions field**
   - Field name: max_offline_transactions
   - Type: PositiveIntegerField
   - Default: 100
   - Help text: "Maximum queued transactions before forced sync"

6. **Add cache TTL fields for each entity type**
   - cache_ttl_products: Product cache duration (default: 240 minutes)
   - cache_ttl_prices: Price cache duration (default: 120 minutes)
   - cache_ttl_customers: Customer cache duration (default: 480 minutes)
   - cache_ttl_categories: Category cache duration (default: 1440 minutes)
   - cache_ttl_settings: Settings cache duration (default: 60 minutes)

7. **Add batch size field**
   - Field name: sync_batch_size
   - Type: PositiveIntegerField
   - Default: 50
   - Help text: "Number of records to sync per batch"

8. **Add retry configuration fields**
   - max_retry_attempts: Maximum sync retry count (default: 3)
   - retry_backoff_minutes: Minutes to wait between retries (default: 5)
   - retry_exponential: Use exponential backoff (default: True)

9. **Add bandwidth optimization field**
   - Field name: low_bandwidth_mode
   - Type: BooleanField
   - Default: False
   - Help text: "Optimize sync for slow connections"

10. **Add sync schedule fields**
    - scheduled_sync_enabled: Enable time-based sync (default: False)
    - scheduled_sync_times: JSON field with array of times
    - sync_during_business_hours_only: Boolean (default: False)

11. **Update model validation**
    - Validate that auto_sync_interval is between 5 and 1440 minutes
    - Validate that max_offline_transactions is between 10 and 1000
    - Validate that cache TTL values are reasonable (5-10080 minutes)
    - Validate that batch size is between 10 and 500

### Sync Frequency Settings Structure

```
OfflineSyncConfig
└── Sync Frequency Settings
    ├── Automatic Sync
    │   ├── auto_sync_interval (30 min default)
    │   ├── sync_on_startup (True)
    │   ├── sync_after_transaction (False)
    │   └── max_offline_transactions (100)
    │
    ├── Cache TTL
    │   ├── cache_ttl_products (240 min)
    │   ├── cache_ttl_prices (120 min)
    │   ├── cache_ttl_customers (480 min)
    │   ├── cache_ttl_categories (1440 min)
    │   └── cache_ttl_settings (60 min)
    │
    ├── Sync Performance
    │   ├── sync_batch_size (50)
    │   ├── low_bandwidth_mode (False)
    │   └── max_retry_attempts (3)
    │
    ├── Retry Configuration
    │   ├── retry_backoff_minutes (5)
    │   └── retry_exponential (True)
    │
    └── Scheduled Sync
        ├── scheduled_sync_enabled (False)
        ├── scheduled_sync_times (JSON array)
        └── sync_during_business_hours_only (False)
```

### Sync Timing Scenarios

| Scenario | Configuration | Behavior |
|----------|---------------|----------|
| **Normal Operation** | auto_sync_interval=30, sync_on_startup=True | Sync every 30 min, sync on start |
| **High Volume** | auto_sync_interval=15, max_offline=50 | More frequent syncs, lower queue limit |
| **Low Bandwidth** | low_bandwidth_mode=True, batch_size=25 | Smaller batches, optimized data |
| **Immediate Sync** | sync_after_transaction=True | Sync after each sale |
| **Scheduled Only** | scheduled_sync_enabled=True, auto_sync_interval=0 | Only at specified times |

### Cache TTL Recommendations

| Entity Type | Typical TTL | Critical Threshold | Use Case |
|-------------|-------------|-------------------|----------|
| **Products** | 4 hours (240 min) | 1 hour | Balance freshness vs bandwidth |
| **Prices** | 2 hours (120 min) | 30 min | More frequent for pricing accuracy |
| **Customers** | 8 hours (480 min) | 2 hours | Less critical for offline sales |
| **Categories** | 24 hours (1440 min) | 4 hours | Rarely change |
| **Settings** | 1 hour (60 min) | 15 min | Important for operational changes |

### Retry Strategy with Exponential Backoff

```
Attempt 1: Immediate retry
         │
         ▼ (failed)
Attempt 2: Wait 5 minutes
         │
         ▼ (failed)
Attempt 3: Wait 10 minutes (exponential)
         │
         ▼ (failed)
Attempt 4: Wait 20 minutes (exponential)
         │
         ▼ (failed)
Mark as FAILED - Manual intervention required
```

### Scheduled Sync Configuration

JSON structure for scheduled_sync_times:
```json
{
  "times": ["08:00", "12:00", "16:00", "20:00"],
  "timezone": "Asia/Colombo",
  "skip_if_already_synced": true
}
```

### Validation Rules

| Field | Min | Max | Default | Notes |
|-------|-----|-----|---------|-------|
| **auto_sync_interval** | 5 | 1440 | 30 | Minutes |
| **max_offline_transactions** | 10 | 1000 | 100 | Count |
| **cache_ttl_*** | 5 | 10080 | Varies | Minutes (7 days max) |
| **sync_batch_size** | 10 | 500 | 50 | Records |
| **max_retry_attempts** | 1 | 10 | 3 | Count |
| **retry_backoff_minutes** | 1 | 60 | 5 | Minutes |

### Expected Outcome
- Complete sync frequency configuration capability
- Flexible timing options for different business needs
- Optimizations for bandwidth and performance
- Retry logic configuration

### Verification Checklist
- [ ] auto_sync_interval field added
- [ ] sync_on_startup field added
- [ ] sync_after_transaction field added
- [ ] max_offline_transactions field added
- [ ] All cache_ttl_* fields added
- [ ] sync_batch_size field added
- [ ] Retry configuration fields added
- [ ] low_bandwidth_mode field added
- [ ] Scheduled sync fields added
- [ ] Field validation implemented
- [ ] Help text added to all fields
- [ ] Migration file generated

---

## Task 09: Add Conflict Resolution Settings

### Overview
Add fields to the OfflineSyncConfig model that define how data conflicts should be resolved when offline transactions are synchronized with the server.

### Dependencies
- Task 08: Add sync frequency settings

### Instructions

1. **Continue in sync_config.py**
   - Add conflict resolution section to OfflineSyncConfig model

2. **Define conflict resolution strategy choices**
   - Create constants for resolution strategies
   - SERVER_WINS: Server data takes precedence
   - CLIENT_WINS: Offline/client data takes precedence
   - MERGE: Attempt automatic merge
   - MANUAL: Require human review

3. **Add default conflict resolution field**
   - Field name: default_conflict_resolution
   - Type: CharField with choices
   - Default: SERVER_WINS
   - Help text: "Default strategy for resolving data conflicts"

4. **Add entity-specific resolution strategies**
   - product_conflict_resolution: Strategy for product conflicts
   - customer_conflict_resolution: Strategy for customer conflicts
   - price_conflict_resolution: Strategy for price conflicts
   - transaction_conflict_resolution: Strategy for transaction conflicts

5. **Add auto-merge configuration**
   - Field name: allow_auto_merge
   - Type: BooleanField
   - Default: False
   - Help text: "Allow automatic merging of non-critical conflicts"

6. **Add merge rules field**
   - Field name: merge_rules
   - Type: JSONField
   - Store entity-specific merge rules
   - Help text: "Custom rules for automatic conflict merging"

7. **Add conflict notification settings**
   - notify_on_conflict: Send notification when conflict occurs
   - conflict_notification_emails: JSON array of email addresses
   - require_supervisor_approval: Require manager approval for conflicts

8. **Add conflict timeout settings**
   - Field name: conflict_resolution_timeout_hours
   - Type: PositiveIntegerField
   - Default: 24
   - Help text: "Hours before unresolved conflict escalates"

9. **Add conflict preservation settings**
   - preserve_client_data: Keep copy of client data in conflict
   - preserve_server_data: Keep copy of server data in conflict
   - conflict_archive_days: Days to keep conflict history

10. **Add priority-based resolution**
    - Field name: prioritize_latest_timestamp
    - Type: BooleanField
    - Default: True
    - Help text: "Prefer data with most recent timestamp"

11. **Update model validation**
    - Validate that at least one resolution strategy is defined
    - Validate notification emails format
    - Validate timeout values are reasonable
    - Ensure manual strategy has notification enabled

### Conflict Resolution Settings Structure

```
OfflineSyncConfig
└── Conflict Resolution Settings
    ├── Default Strategy
    │   ├── default_conflict_resolution (SERVER_WINS)
    │   ├── prioritize_latest_timestamp (True)
    │   └── allow_auto_merge (False)
    │
    ├── Entity-Specific Strategies
    │   ├── product_conflict_resolution
    │   ├── customer_conflict_resolution
    │   ├── price_conflict_resolution
    │   └── transaction_conflict_resolution
    │
    ├── Merge Configuration
    │   ├── merge_rules (JSON)
    │   └── allow_auto_merge (Boolean)
    │
    ├── Notifications
    │   ├── notify_on_conflict (Boolean)
    │   ├── conflict_notification_emails (JSON)
    │   └── require_supervisor_approval (Boolean)
    │
    ├── Timeouts & Escalation
    │   └── conflict_resolution_timeout_hours (24)
    │
    └── Data Preservation
        ├── preserve_client_data (Boolean)
        ├── preserve_server_data (Boolean)
        └── conflict_archive_days (Integer)
```

### Resolution Strategy Definitions

| Strategy | Description | Use Case | Risk |
|----------|-------------|----------|------|
| **SERVER_WINS** | Server data always takes precedence | Master data updates | Low - may lose offline changes |
| **CLIENT_WINS** | Offline data takes precedence | Critical POS transactions | Medium - may override server updates |
| **MERGE** | Automatically merge compatible changes | Non-conflicting field updates | Medium - merge logic complexity |
| **MANUAL** | Require human review and decision | High-value or ambiguous conflicts | Low - but slower resolution |

### Entity-Specific Resolution Recommendations

| Entity | Recommended Strategy | Rationale |
|--------|---------------------|-----------|
| **Products** | SERVER_WINS | Master data managed centrally |
| **Prices** | SERVER_WINS | Pricing accuracy critical |
| **Customers** | MERGE | Contact info can be merged |
| **Transactions** | CLIENT_WINS | POS transactions are authoritative |
| **Inventory** | MANUAL | Requires careful reconciliation |
| **Settings** | SERVER_WINS | Configuration managed centrally |

### Conflict Resolution Flow

```
┌──────────────────┐
│ Conflict Detected│
└────────┬─────────┘
         │
         ▼
┌─────────────────────────┐
│ Check Entity-Specific   │
│ Resolution Strategy     │
└────────┬────────────────┘
         │
         ├──→ SERVER_WINS ──→ Apply server data
         │
         ├──→ CLIENT_WINS ──→ Apply client data
         │
         ├──→ MERGE ───────┐
         │                 │
         │                 ▼
         │            ┌─────────────┐
         │            │ Auto-merge  │
         │            │ allowed?    │
         │            └──────┬──────┘
         │                   │
         │              Yes  │  No
         │                   │  │
         │                   ▼  ▼
         │            [Merge] [Manual]
         │
         └──→ MANUAL ───────┐
                            │
                            ▼
                   ┌─────────────────┐
                   │ Create Conflict │
                   │ Resolution Task │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Notify Users    │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Wait for        │
                   │ Resolution      │
                   └─────────────────┘
```

### Merge Rules JSON Structure

```json
{
  "customer": {
    "merge_fields": ["phone", "email", "address"],
    "server_priority_fields": ["loyalty_points", "credit_limit"],
    "client_priority_fields": ["notes"],
    "conflict_fields": ["name"]
  },
  "product": {
    "merge_fields": [],
    "server_priority_fields": ["all"],
    "client_priority_fields": [],
    "conflict_fields": []
  }
}
```

### Notification Configuration

**Notification Triggers:**
- Any conflict with MANUAL resolution strategy
- Conflicts exceeding auto-merge threshold
- Conflicts timeout approaching
- Critical entity conflicts (transactions, payments)

**Notification Content:**
- Entity type and ID
- Conflict details (field differences)
- Resolution options
- Link to resolution interface
- Deadline for resolution

### Conflict Preservation Strategy

| Scenario | Preserve Client | Preserve Server | Archive Days |
|----------|----------------|-----------------|--------------|
| **High Stakes** | Yes | Yes | 90 |
| **Normal** | Yes | No | 30 |
| **Low Stakes** | No | No | 7 |

### Expected Outcome
- Comprehensive conflict resolution configuration
- Entity-specific resolution strategies
- Automated and manual resolution options
- Notification and escalation workflows

### Verification Checklist
- [ ] Conflict resolution strategy choices defined
- [ ] default_conflict_resolution field added
- [ ] Entity-specific resolution fields added
- [ ] allow_auto_merge field added
- [ ] merge_rules JSON field added
- [ ] Notification settings fields added
- [ ] Timeout configuration added
- [ ] Data preservation fields added
- [ ] prioritize_latest_timestamp field added
- [ ] Field validation implemented
- [ ] Migration file generated

---

## Task 10: Create SyncLog Model

### Overview
Create a Django model to track all synchronization operations, including successful syncs, failures, and performance metrics. This model provides audit trail and troubleshooting capability for offline mode.

### Dependencies
- Task 07: Create OfflineSyncConfig model
- Offline constants defined

### Instructions

1. **Create sync_log.py file**
   - Navigate to `apps/pos/offline/models/`
   - Create new file `sync_log.py`

2. **Add file docstring**
   - Explain model purpose
   - Note audit and monitoring capabilities

3. **Import required dependencies**
   - Django model imports
   - Tenant-aware base model
   - JSONField for storing detailed data
   - Constants from offline.constants

4. **Define SyncLog model class**
   - Inherit from appropriate base model
   - Add model docstring

5. **Add core identification fields**
   - sync_id: Unique identifier (UUID)
   - tenant: ForeignKey to Tenant
   - terminal: ForeignKey to Terminal (if applicable)
   - config: ForeignKey to OfflineSyncConfig

6. **Add sync operation type field**
   - Field name: sync_type
   - Type: CharField with choices
   - Choices: PUSH, PULL, FULL, AUTO, MANUAL
   - Help text: "Type of synchronization operation"

7. **Add sync status field**
   - Field name: status
   - Type: CharField with choices
   - Use constants from Task 03
   - Choices: PENDING, IN_PROGRESS, COMPLETED, FAILED, CONFLICT

8. **Add timing fields**
   - initiated_by: ForeignKey to User
   - initiated_at: DateTime when sync started
   - started_at: DateTime when sync actually began processing
   - completed_at: DateTime when sync finished
   - duration_ms: Calculated duration in milliseconds

9. **Add model Meta class**
   - Set verbose_name and verbose_name_plural
   - Define default ordering (most recent first)
   - Add indexes for common queries
   - Set database table name

10. **Add __str__ method**
    - Return sync type, status, and timestamp

11. **Add helper methods**
    - calculate_duration(): Calculate sync duration
    - mark_completed(): Set completion timestamp and status
    - mark_failed(): Set failure status and error
    - is_successful(): Check if sync completed successfully

12. **Update models/__init__.py**
    - Import and expose SyncLog model

### Model Structure

```
SyncLog
├── Identification
│   ├── id/sync_id (Primary Key)
│   ├── tenant (Foreign Key)
│   ├── terminal (Foreign Key)
│   └── config (Foreign Key)
│
├── Operation Details
│   ├── sync_type (PUSH/PULL/FULL/AUTO/MANUAL)
│   └── status (PENDING/IN_PROGRESS/COMPLETED/FAILED/CONFLICT)
│
├── Timing
│   ├── initiated_by (Foreign Key)
│   ├── initiated_at (DateTime)
│   ├── started_at (DateTime)
│   ├── completed_at (DateTime)
│   └── duration_ms (Integer)
│
├── Results & Details (Task 11)
│   └── [Detailed sync results]
│
└── Metadata
    └── [Additional tracking fields]
```

### Sync Type Definitions

| Sync Type | Description | Initiated By |
|-----------|-------------|--------------|
| **PUSH** | Send offline transactions to server | Terminal/Manual |
| **PULL** | Receive updated master data from server | Terminal/Manual |
| **FULL** | Complete bidirectional sync | Terminal/Manual |
| **AUTO** | Automatically triggered sync | System/Timer |
| **MANUAL** | User-initiated sync | User action |

### Model Relationships

```
┌─────────┐
│ Tenant  │
└────┬────┘
     │
     ├────────────┐
     │            │
     │            ▼
     │       ┌──────────────────────┐
     │       │ OfflineSyncConfig    │
     │       └────┬─────────────────┘
     │            │
     │            │ 1:N
     ▼            ▼
┌──────────┐   ┌──────────┐
│ Terminal │──→│ SyncLog  │
└──────────┘   └────┬─────┘
                    │
                    │ N:1
                    ▼
               ┌────────┐
               │ User   │
               └────────┘
```

### Field Specifications

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| **sync_id** | UUID | Yes | Auto | Unique sync identifier |
| **tenant** | ForeignKey | Yes | - | Associated tenant |
| **terminal** | ForeignKey | No | Null | Terminal that initiated sync |
| **config** | ForeignKey | Yes | - | Configuration used |
| **sync_type** | CharField(20) | Yes | - | Type of sync operation |
| **status** | CharField(20) | Yes | PENDING | Current sync status |
| **initiated_by** | ForeignKey | No | Null | User who initiated |
| **initiated_at** | DateTimeField | Yes | Auto | When sync was requested |
| **started_at** | DateTimeField | No | Null | When sync began processing |
| **completed_at** | DateTimeField | No | Null | When sync finished |
| **duration_ms** | PositiveIntegerField | No | Null | Duration in milliseconds |

### Sync Status Transitions

```
┌─────────┐
│ PENDING │ (Sync queued)
└────┬────┘
     │
     ▼
┌─────────────┐
│ IN_PROGRESS │ (Sync running)
└──────┬──────┘
       │
       ├─────→ ┌───────────┐
       │       │ COMPLETED │ (All data synced successfully)
       │       └───────────┘
       │
       ├─────→ ┌──────────┐
       │       │ FAILED   │ (Sync failed after retries)
       │       └──────────┘
       │
       └─────→ ┌──────────┐
               │ CONFLICT │ (Conflicts need resolution)
               └──────────┘
```

### Helper Methods Behavior

**calculate_duration():**
- If completed_at and started_at exist, calculate difference in milliseconds
- Store result in duration_ms field
- Return duration value

**mark_completed():**
- Set completed_at to current timestamp
- Set status to COMPLETED
- Calculate and store duration_ms
- Save model

**mark_failed(error_message):**
- Set completed_at to current timestamp
- Set status to FAILED
- Store error message (Task 11)
- Calculate duration
- Save model

**is_successful():**
- Return True if status is COMPLETED
- Return False otherwise

### Indexing Strategy

| Index | Columns | Purpose |
|-------|---------|---------|
| **tenant_status_idx** | tenant, status | Filter logs by tenant and status |
| **tenant_date_idx** | tenant, initiated_at | Date range queries per tenant |
| **terminal_date_idx** | terminal, initiated_at | Terminal-specific sync history |
| **status_date_idx** | status, initiated_at | Find recent failures/conflicts |

### Expected Outcome
- SyncLog model created to track all sync operations
- Status tracking from initiation to completion
- Performance metrics (duration) captured
- Relationships to tenant, terminal, config, and user

### Verification Checklist
- [ ] `sync_log.py` file created
- [ ] SyncLog model defined
- [ ] sync_id field added
- [ ] Tenant, terminal, config relationships added
- [ ] sync_type field with choices added
- [ ] status field with choices added
- [ ] All timing fields added
- [ ] initiated_by user reference added
- [ ] Model Meta class configured
- [ ] Indexes defined
- [ ] __str__ method implemented
- [ ] Helper methods (calculate_duration, mark_completed, mark_failed) added
- [ ] Model imported in models/__init__.py
- [ ] Migration file generated

---

## Task 11: Add Sync Log Fields

### Overview
Add detailed tracking fields to the SyncLog model to capture comprehensive information about what data was synced, errors encountered, and performance metrics.

### Dependencies
- Task 10: Create SyncLog model

### Instructions

1. **Open sync_log.py**
   - Navigate to SyncLog model

2. **Add entities synced tracking**
   - Field name: entities_synced
   - Type: JSONField
   - Store count of each entity type synced
   - Format: {"products": 150, "customers": 25, "transactions": 10}

3. **Add records processed field**
   - Field name: total_records_processed
   - Type: PositiveIntegerField
   - Default: 0
   - Help text: "Total number of records processed"

4. **Add records successful field**
   - Field name: records_successful
   - Type: PositiveIntegerField
   - Default: 0
   - Help text: "Number of records synced successfully"

5. **Add records failed field**
   - Field name: records_failed
   - Type: PositiveIntegerField
   - Default: 0
   - Help text: "Number of records that failed to sync"

6. **Add conflicts detected field**
   - Field name: conflicts_detected
   - Type: PositiveIntegerField
   - Default: 0
   - Help text: "Number of data conflicts detected"

7. **Add error details field**
   - Field name: errors
   - Type: JSONField
   - Store array of error objects
   - Each error: {entity, id, error_message, timestamp}

8. **Add warnings field**
   - Field name: warnings
   - Type: JSONField
   - Store non-critical issues encountered

9. **Add sync direction field**
   - Field name: sync_direction
   - Type: CharField with choices
   - Choices: PUSH (client to server), PULL (server to client), BIDIRECTIONAL

10. **Add data size fields**
    - bytes_uploaded: Size of data sent to server
    - bytes_downloaded: Size of data received from server
    - Use BigIntegerField for large data transfers

11. **Add network metrics**
    - Field name: network_latency_ms
    - Average network latency during sync
    - Connection quality indicator

12. **Add retry information**
    - Field name: retry_count
    - Number of retry attempts
    - Field name: retry_reason
    - Why retries were needed

13. **Add conflict details field**
    - Field name: conflict_details
    - Type: JSONField
    - Store detailed conflict information for resolution

14. **Add success rate calculation property**
    - Create property method: success_rate
    - Calculate: (records_successful / total_records_processed) * 100

15. **Update helper methods**
    - Extend mark_completed() to calculate totals
    - Extend mark_failed() to log errors properly
    - Add add_error() method for incrementally adding errors

### Sync Log Fields Structure

```
SyncLog
└── Detailed Tracking Fields
    ├── Entity Counts
    │   ├── entities_synced (JSON)
    │   ├── total_records_processed (Integer)
    │   ├── records_successful (Integer)
    │   ├── records_failed (Integer)
    │   └── conflicts_detected (Integer)
    │
    ├── Error Tracking
    │   ├── errors (JSON array)
    │   └── warnings (JSON array)
    │
    ├── Sync Details
    │   └── sync_direction (PUSH/PULL/BIDIRECTIONAL)
    │
    ├── Data Transfer Metrics
    │   ├── bytes_uploaded (BigInteger)
    │   ├── bytes_downloaded (BigInteger)
    │   └── network_latency_ms (Integer)
    │
    ├── Retry Information
    │   ├── retry_count (Integer)
    │   └── retry_reason (Text)
    │
    └── Conflict Details
        └── conflict_details (JSON)
```

### Entities Synced JSON Structure

```json
{
  "products": {
    "total": 150,
    "successful": 148,
    "failed": 2,
    "conflicts": 0
  },
  "customers": {
    "total": 25,
    "successful": 24,
    "failed": 0,
    "conflicts": 1
  },
  "transactions": {
    "total": 10,
    "successful": 10,
    "failed": 0,
    "conflicts": 0
  },
  "prices": {
    "total": 300,
    "successful": 300,
    "failed": 0,
    "conflicts": 0
  }
}
```

### Errors JSON Structure

```json
{
  "errors": [
    {
      "entity_type": "product",
      "entity_id": "prod-12345",
      "error_code": "VALIDATION_ERROR",
      "error_message": "Price cannot be negative",
      "timestamp": "2026-01-23T10:15:30Z",
      "retry_attempted": true
    },
    {
      "entity_type": "customer",
      "entity_id": "cust-67890",
      "error_code": "NETWORK_ERROR",
      "error_message": "Connection timeout",
      "timestamp": "2026-01-23T10:16:45Z",
      "retry_attempted": true
    }
  ],
  "warnings": [
    {
      "entity_type": "product",
      "entity_id": "prod-11111",
      "warning_message": "Product image not found, using placeholder",
      "timestamp": "2026-01-23T10:15:00Z"
    }
  ]
}
```

### Conflict Details JSON Structure

```json
{
  "conflicts": [
    {
      "conflict_id": "conf-uuid-1234",
      "entity_type": "customer",
      "entity_id": "cust-56789",
      "field": "phone",
      "client_value": "+94 77 123 4567",
      "server_value": "+94 77 765 4321",
      "client_timestamp": "2026-01-23T09:00:00Z",
      "server_timestamp": "2026-01-23T09:30:00Z",
      "resolution_strategy": "MANUAL",
      "resolved": false,
      "resolved_by": null,
      "resolved_at": null
    }
  ]
}
```

### Performance Metrics

| Metric | Field | Calculation | Purpose |
|--------|-------|-------------|---------|
| **Success Rate** | success_rate (property) | (successful / total) × 100 | Sync quality indicator |
| **Sync Speed** | records_per_second | total / (duration_ms / 1000) | Performance benchmark |
| **Error Rate** | error_rate (property) | (failed / total) × 100 | Reliability indicator |
| **Conflict Rate** | conflict_rate (property) | (conflicts / total) × 100 | Data consistency metric |
| **Transfer Efficiency** | bytes_per_record | bytes_downloaded / total | Bandwidth usage |

### Sync Direction Choices

| Direction | Description | Use Case |
|-----------|-------------|----------|
| **PUSH** | Client to server | Uploading offline transactions |
| **PULL** | Server to client | Downloading master data updates |
| **BIDIRECTIONAL** | Two-way sync | Full synchronization |

### Network Quality Indicators

| Latency (ms) | Quality | Impact on Sync |
|--------------|---------|----------------|
| 0-50 | Excellent | No noticeable impact |
| 51-150 | Good | Minor slowdown |
| 151-300 | Fair | Noticeable delay |
| 301-1000 | Poor | Significant slowdown |
| >1000 | Very Poor | Consider low bandwidth mode |

### Helper Method Extensions

**Extended mark_completed():**
- Calculate total_records_processed from entities_synced
- Calculate success_rate
- Set status to COMPLETED
- Log summary metrics

**Extended mark_failed(error_message):**
- Add error to errors array
- Increment records_failed
- Set status to FAILED
- Log failure details

**New add_error(entity_type, entity_id, error_message):**
- Append error to errors array with timestamp
- Increment records_failed
- Save model

**New add_warning(entity_type, entity_id, warning_message):**
- Append warning to warnings array
- Save model

**New calculate_metrics():**
- Calculate success_rate, error_rate, conflict_rate
- Calculate records_per_second
- Return metrics dictionary

### Expected Outcome
- Comprehensive tracking of all sync operations
- Detailed error and warning information
- Performance metrics for analysis
- Conflict details for resolution
- Foundation for sync monitoring and reporting

### Verification Checklist
- [ ] entities_synced JSON field added
- [ ] Record count fields added (total, successful, failed)
- [ ] conflicts_detected field added
- [ ] errors JSON field added
- [ ] warnings JSON field added
- [ ] sync_direction field added
- [ ] Data transfer size fields added
- [ ] network_latency_ms field added
- [ ] Retry information fields added
- [ ] conflict_details JSON field added
- [ ] success_rate property added
- [ ] Helper methods extended (mark_completed, mark_failed)
- [ ] New methods added (add_error, add_warning, calculate_metrics)
- [ ] Migration file generated

---

## Summary

This document established the server-side models for managing offline synchronization:

1. **Created OfflineSyncConfig model** - Tenant-specific sync configuration
2. **Added sync frequency settings** - Control timing and automation of syncs
3. **Added conflict resolution settings** - Define how conflicts are handled
4. **Created SyncLog model** - Comprehensive sync operation tracking
5. **Added sync log fields** - Detailed metrics, errors, and performance data

These models provide the server-side foundation for configuring and monitoring offline synchronization operations across all POS terminals.

---

## Next Steps

Proceed to [03_Tasks-12-16_Offline-Transaction-Priority.md](03_Tasks-12-16_Offline-Transaction-Priority.md) to implement the offline transaction model and define sync priority logic.
