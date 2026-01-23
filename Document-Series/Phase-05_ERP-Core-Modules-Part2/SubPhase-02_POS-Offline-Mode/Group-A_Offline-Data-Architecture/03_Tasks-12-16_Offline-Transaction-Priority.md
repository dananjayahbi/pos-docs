# Tasks 12-16: Offline Transaction Model and Priority Logic

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** A - Offline Data Architecture  
> **Document:** 03 of 03  
> **Tasks Covered:** 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-11_Sync-Config-Log-Models.md](02_Tasks-07-11_Sync-Config-Log-Models.md)
- **→ Next Group:** [../Group-B_Local-Data-Caching/](../Group-B_Local-Data-Caching/)

---

## Document Overview

This document covers the creation of the OfflineTransaction model for storing transaction data created while offline, defining sync priority logic to optimize sync order, and documenting data freshness requirements for each entity type.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 12 | Create OfflineTransaction model | Medium |
| 13 | Add transaction metadata | Medium |
| 14 | Add transaction payload field | Low |
| 15 | Create sync priority logic | Medium |
| 16 | Document data freshness requirements | Medium |

---

## Task 12: Create OfflineTransaction Model

### Overview
Create a Django model to store transactions that were created while the POS terminal was offline. This model queues transactions for synchronization when connectivity is restored.

### Dependencies
- Task 07: Create OfflineSyncConfig model
- Task 10: Create SyncLog model
- Offline constants defined (Task 03)

### Instructions

1. **Create offline_transaction.py file**
   - Navigate to `apps/pos/offline/models/`
   - Create new file `offline_transaction.py`

2. **Add file docstring**
   - Explain model purpose
   - Note queuing and sync functionality

3. **Import required dependencies**
   - Django model imports
   - Tenant-aware base model
   - JSONField for payload storage
   - UUID for offline transaction IDs
   - Constants from offline.constants

4. **Define OfflineTransaction model class**
   - Inherit from appropriate base model
   - Add model docstring

5. **Add core identification fields**
   - id: Server-assigned primary key (auto)
   - offline_id: UUID assigned by client
   - tenant: ForeignKey to Tenant
   - terminal: ForeignKey to Terminal
   - transaction_type: CharField (sale/refund/exchange)

6. **Add temporal fields**
   - offline_timestamp: When transaction was created offline
   - received_at: When server received the transaction
   - synced_at: When transaction was successfully synced
   - last_sync_attempt: Last attempted sync timestamp

7. **Add sync status tracking**
   - sync_status: CharField with choices (PENDING, IN_PROGRESS, COMPLETED, FAILED, CONFLICT)
   - retry_count: Number of sync attempts
   - max_retries: Maximum allowed retries (default: 3)

8. **Add relationships**
   - sync_log: ForeignKey to SyncLog (optional)
   - related_sale: ForeignKey to Sale model (after successful sync)
   - employee: ForeignKey to Employee who created transaction

9. **Add model Meta class**
   - Set verbose_name and verbose_name_plural
   - Define default ordering (oldest first for FIFO processing)
   - Add unique constraint on (tenant, offline_id)
   - Add indexes for efficient querying
   - Set database table name

10. **Add __str__ method**
    - Return offline_id and transaction type

11. **Add helper methods**
    - is_pending(): Check if awaiting sync
    - is_synced(): Check if successfully synced
    - can_retry(): Check if retry attempts remain
    - increment_retry(): Increment retry count
    - mark_synced(sale_instance): Mark as successfully synced

12. **Update models/__init__.py**
    - Import and expose OfflineTransaction model

### Model Structure

```
OfflineTransaction
├── Identification
│   ├── id (Server PK)
│   ├── offline_id (Client UUID)
│   ├── tenant (Foreign Key)
│   ├── terminal (Foreign Key)
│   └── transaction_type (sale/refund/exchange)
│
├── Temporal Tracking
│   ├── offline_timestamp (DateTime)
│   ├── received_at (DateTime)
│   ├── synced_at (DateTime)
│   └── last_sync_attempt (DateTime)
│
├── Sync Status
│   ├── sync_status (PENDING/IN_PROGRESS/COMPLETED/FAILED/CONFLICT)
│   ├── retry_count (Integer)
│   └── max_retries (Integer)
│
├── Relationships
│   ├── sync_log (Foreign Key to SyncLog)
│   ├── related_sale (Foreign Key to Sale)
│   └── employee (Foreign Key to Employee)
│
├── Metadata (Task 13)
│   └── [Additional tracking fields]
│
└── Payload (Task 14)
    └── [Complete transaction data]
```

### Transaction Types

| Type | Description | Sync Priority |
|------|-------------|---------------|
| **sale** | Standard POS sale transaction | High |
| **refund** | Product return/refund | High |
| **exchange** | Product exchange transaction | High |
| **void** | Voided transaction | Medium |
| **adjustment** | Inventory adjustment | Low |

### Model Relationships

```
┌─────────┐
│ Tenant  │
└────┬────┘
     │
     ├────────┐
     │        │
     │        ▼
     │    ┌──────────┐
     │    │ Terminal │
     │    └────┬─────┘
     │         │
     │         │ N:1
     ▼         ▼
┌──────────────────────────┐
│ OfflineTransaction       │
│ ├── offline_id           │
│ ├── sync_status          │
│ └── payload              │
└────┬──────────────┬──────┘
     │              │
     │ N:1          │ 1:1
     ▼              ▼
┌─────────┐    ┌────────┐
│ SyncLog │    │ Sale   │ (after sync)
└─────────┘    └────────┘
```

### Sync Status Lifecycle

```
┌─────────┐
│ PENDING │ (Transaction queued)
└────┬────┘
     │
     ▼
┌─────────────┐
│ IN_PROGRESS │ (Syncing now)
└──────┬──────┘
       │
       ├──────→ ┌───────────┐
       │        │ COMPLETED │ (Successfully synced)
       │        └───────────┘
       │
       ├──────→ ┌──────────┐
       │        │ CONFLICT │ (Data conflict detected)
       │        └────┬─────┘
       │             │
       │             ▼
       │        (Resolve conflict)
       │             │
       │             ▼
       │        ┌───────────┐
       │        │ COMPLETED │
       │        └───────────┘
       │
       └──────→ ┌────────┐
                │ FAILED │ (After max retries)
                └────┬───┘
                     │
                     ▼
                (Manual intervention)
```

### Field Specifications

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| **id** | Integer/UUID | Yes | Auto | Server primary key |
| **offline_id** | UUID | Yes | - | Client-generated UUID |
| **tenant** | ForeignKey | Yes | - | Associated tenant |
| **terminal** | ForeignKey | Yes | - | Terminal that created transaction |
| **transaction_type** | CharField(20) | Yes | 'sale' | Type of transaction |
| **offline_timestamp** | DateTimeField | Yes | - | When created offline |
| **received_at** | DateTimeField | Yes | Auto | When received by server |
| **synced_at** | DateTimeField | No | Null | When successfully synced |
| **last_sync_attempt** | DateTimeField | No | Null | Last sync attempt time |
| **sync_status** | CharField(20) | Yes | PENDING | Current sync status |
| **retry_count** | PositiveIntegerField | Yes | 0 | Number of retry attempts |
| **max_retries** | PositiveIntegerField | Yes | 3 | Maximum allowed retries |
| **sync_log** | ForeignKey | No | Null | Associated sync log |
| **related_sale** | ForeignKey | No | Null | Created sale after sync |
| **employee** | ForeignKey | No | Null | Employee who created |

### Indexing Strategy

| Index | Columns | Purpose |
|-------|---------|---------|
| **offline_id_idx** | tenant, offline_id | Unique transaction lookup |
| **status_tenant_idx** | sync_status, tenant | Filter pending transactions |
| **terminal_date_idx** | terminal, offline_timestamp | Terminal transaction history |
| **retry_idx** | sync_status, retry_count | Find failed transactions needing retry |

### Helper Methods Behavior

**is_pending():**
- Return True if sync_status is PENDING
- Return False otherwise

**is_synced():**
- Return True if sync_status is COMPLETED
- Return False otherwise

**can_retry():**
- Return True if retry_count < max_retries and sync_status is FAILED
- Return False otherwise

**increment_retry():**
- Increment retry_count by 1
- Update last_sync_attempt to current timestamp
- If retry_count >= max_retries, keep status as FAILED
- Otherwise, set status to PENDING for next retry
- Save model

**mark_synced(sale_instance):**
- Set sync_status to COMPLETED
- Set synced_at to current timestamp
- Set related_sale to provided sale instance
- Save model

### Unique Constraints

**Offline ID Uniqueness:**
- Combination of (tenant, offline_id) must be unique
- Prevents duplicate processing of same offline transaction
- Client-generated UUID ensures uniqueness across terminals

### Expected Outcome
- OfflineTransaction model created for queuing offline transactions
- Status tracking from creation to successful sync
- Retry mechanism for failed syncs
- Relationships to sync logs and final sale records

### Verification Checklist
- [ ] `offline_transaction.py` file created
- [ ] OfflineTransaction model defined
- [ ] offline_id UUID field added
- [ ] Tenant and terminal relationships added
- [ ] transaction_type field added
- [ ] All temporal fields added
- [ ] Sync status tracking fields added
- [ ] Retry management fields added
- [ ] Model relationships configured
- [ ] Model Meta class with indexes and constraints
- [ ] __str__ method implemented
- [ ] Helper methods (is_pending, is_synced, can_retry, increment_retry, mark_synced)
- [ ] Model imported in models/__init__.py
- [ ] Migration file generated

---

## Task 13: Add Transaction Metadata

### Overview
Add comprehensive metadata fields to the OfflineTransaction model to capture device information, network conditions, offline duration, and other contextual data useful for troubleshooting and analytics.

### Dependencies
- Task 12: Create OfflineTransaction model

### Instructions

1. **Open offline_transaction.py**
   - Navigate to OfflineTransaction model

2. **Add device information field**
   - Field name: device_info
   - Type: JSONField
   - Store device/browser details, screen resolution, OS
   - Help text: "Client device information"

3. **Add application version field**
   - Field name: app_version
   - Type: CharField(20)
   - Store POS application version
   - Help text: "POS app version at time of transaction"

4. **Add offline duration field**
   - Field name: offline_duration_minutes
   - Type: PositiveIntegerField
   - Store how long terminal was offline when transaction created
   - Help text: "Minutes terminal was offline"

5. **Add transaction hash field**
   - Field name: transaction_hash
   - Type: CharField(64)
   - Store SHA-256 hash of transaction payload
   - Used for integrity verification
   - Help text: "Hash for payload integrity check"

6. **Add network quality field**
   - Field name: network_quality_at_sync
   - Type: CharField(20) with choices
   - Choices: EXCELLENT, GOOD, FAIR, POOR, UNKNOWN
   - Captured during sync attempt
   - Help text: "Network quality during sync"

7. **Add error information field**
   - Field name: error_message
   - Type: TextField
   - Store last error message if sync failed
   - Nullable
   - Help text: "Error message from last sync attempt"

8. **Add validation errors field**
   - Field name: validation_errors
   - Type: JSONField
   - Store detailed validation errors if any
   - Nullable
   - Help text: "Detailed validation errors"

9. **Add customer identifier field**
   - Field name: customer_id_offline
   - Type: CharField(50)
   - Store offline customer reference
   - Nullable (walk-in customers)
   - Help text: "Customer reference from offline data"

10. **Add transaction totals for quick reference**
    - grand_total: DecimalField for transaction total
    - items_count: Number of line items
    - Used for quick filtering and reporting

11. **Add priority field**
    - Field name: sync_priority
    - Type: PositiveIntegerField (1-10)
    - Default: 5
    - Higher numbers = higher priority
    - Help text: "Sync priority (1=low, 10=urgent)"

12. **Add notes field**
    - Field name: notes
    - Type: TextField
    - For admin/manual notes about transaction
    - Nullable
    - Help text: "Additional notes or comments"

13. **Add data source field**
    - Field name: data_source
    - Type: CharField(50)
    - Store source of transaction (web-pos, mobile-pos, tablet-pos)
    - Help text: "Source application type"

### Metadata Structure

```
OfflineTransaction
└── Metadata Fields
    ├── Device & App Info
    │   ├── device_info (JSON)
    │   ├── app_version (String)
    │   └── data_source (String)
    │
    ├── Offline Context
    │   └── offline_duration_minutes (Integer)
    │
    ├── Data Integrity
    │   ├── transaction_hash (String)
    │   └── validation_errors (JSON)
    │
    ├── Network & Sync
    │   ├── network_quality_at_sync (Enum)
    │   └── error_message (Text)
    │
    ├── Quick Reference
    │   ├── customer_id_offline (String)
    │   ├── grand_total (Decimal)
    │   ├── items_count (Integer)
    │   └── sync_priority (Integer)
    │
    └── Administrative
        └── notes (Text)
```

### Device Info JSON Structure

```json
{
  "platform": "web",
  "browser": "Chrome",
  "browser_version": "120.0.6099.109",
  "os": "Windows",
  "os_version": "10",
  "screen_resolution": "1920x1080",
  "device_type": "desktop",
  "ip_address": "192.168.1.100",
  "timezone": "Asia/Colombo",
  "locale": "en-LK"
}
```

### Validation Errors JSON Structure

```json
{
  "errors": [
    {
      "field": "line_items[0].quantity",
      "error": "Quantity exceeds available stock",
      "value": 100,
      "constraint": "max_stock: 50"
    },
    {
      "field": "customer_id",
      "error": "Customer not found in database",
      "value": "cust-12345"
    }
  ]
}
```

### Network Quality Definitions

| Quality | Latency | Bandwidth | Sync Behavior |
|---------|---------|-----------|---------------|
| **EXCELLENT** | <50ms | >10 Mbps | Full speed sync |
| **GOOD** | 50-150ms | 2-10 Mbps | Normal sync |
| **FAIR** | 150-300ms | 500KB-2MB | Reduced batch size |
| **POOR** | >300ms | <500KB | Minimal sync, priority only |
| **UNKNOWN** | N/A | N/A | Default sync behavior |

### Sync Priority Levels

| Priority | Level | Description | Use Cases |
|----------|-------|-------------|-----------|
| **10** | Critical | Urgent, sync immediately | High-value transactions, supervisor requests |
| **8-9** | High | Prioritize in queue | Standard sales, refunds |
| **5-7** | Normal | Regular processing | Most offline transactions |
| **3-4** | Low | Sync when convenient | Draft transactions, test data |
| **1-2** | Deferred | Sync during off-peak | Historical data, reports |

### Transaction Hash Generation

**Purpose:**
- Verify payload integrity
- Detect tampering or corruption
- Ensure data consistency

**Algorithm:**
- Use SHA-256 hashing
- Hash the complete payload JSON (normalized)
- Store hex digest in transaction_hash field
- Verify hash before processing transaction

**Verification Process:**
```
1. Receive offline transaction
2. Calculate hash of received payload
3. Compare with stored transaction_hash
4. If match → proceed with sync
5. If mismatch → flag as corrupted, manual review
```

### Data Source Types

| Source | Description | Device Type |
|--------|-------------|-------------|
| **web-pos** | Browser-based POS | Desktop, laptop |
| **mobile-pos** | Native mobile app | Smartphone |
| **tablet-pos** | Tablet-optimized app | Tablet |
| **kiosk-pos** | Self-service kiosk | Fixed kiosk |

### Field Specifications

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| **device_info** | JSONField | No | {} | Device details |
| **app_version** | CharField(20) | Yes | - | App version |
| **offline_duration_minutes** | PositiveIntegerField | No | 0 | Offline time |
| **transaction_hash** | CharField(64) | Yes | - | Payload hash |
| **network_quality_at_sync** | CharField(20) | No | UNKNOWN | Network quality |
| **error_message** | TextField | No | Null | Last error |
| **validation_errors** | JSONField | No | Null | Validation issues |
| **customer_id_offline** | CharField(50) | No | Null | Customer ref |
| **grand_total** | DecimalField(12,2) | Yes | - | Transaction total |
| **items_count** | PositiveIntegerField | Yes | - | Line items count |
| **sync_priority** | PositiveIntegerField | Yes | 5 | Priority (1-10) |
| **notes** | TextField | No | "" | Admin notes |
| **data_source** | CharField(50) | Yes | - | Source app type |

### Expected Outcome
- Comprehensive metadata for each offline transaction
- Device and app context for troubleshooting
- Integrity verification via transaction hash
- Priority-based sync ordering
- Rich data for analytics and reporting

### Verification Checklist
- [ ] device_info JSON field added
- [ ] app_version field added
- [ ] offline_duration_minutes field added
- [ ] transaction_hash field added
- [ ] network_quality_at_sync field added
- [ ] error_message field added
- [ ] validation_errors JSON field added
- [ ] customer_id_offline field added
- [ ] grand_total and items_count fields added
- [ ] sync_priority field added
- [ ] notes field added
- [ ] data_source field added
- [ ] All fields have appropriate help_text
- [ ] Migration file generated

---

## Task 14: Add Transaction Payload Field

### Overview
Add a JSONField to the OfflineTransaction model to store the complete transaction data including cart header, line items, payments, customer information, and all necessary data for recreating the transaction on the server.

### Dependencies
- Task 13: Add transaction metadata
- Task 06: Define offline transaction schema (for payload structure)

### Instructions

1. **Continue in offline_transaction.py**
   - Add payload field to OfflineTransaction model

2. **Add payload field**
   - Field name: payload
   - Type: JSONField
   - Store complete transaction as JSON
   - Not nullable (payload is required)
   - Help text: "Complete transaction data in JSON format"

3. **Add payload validation method**
   - Method name: validate_payload()
   - Check required keys exist (header, line_items, payments)
   - Validate data types
   - Check referential integrity
   - Return validation result with errors

4. **Add payload extraction methods**
   - get_header(): Extract transaction header data
   - get_line_items(): Extract line items array
   - get_payments(): Extract payments array
   - get_customer_data(): Extract customer information if present

5. **Add payload size field**
   - Field name: payload_size_bytes
   - Type: PositiveIntegerField
   - Auto-calculated from payload JSON size
   - Used for bandwidth and storage monitoring

6. **Add compression flag**
   - Field name: payload_compressed
   - Type: BooleanField
   - Default: False
   - Indicates if payload is compressed (for large transactions)

7. **Add helper method for payload stats**
   - Method name: get_payload_stats()
   - Return dictionary with item count, payment count, total amount
   - Extract from payload without full deserialization

8. **Add method to validate against hash**
   - Method name: verify_payload_integrity()
   - Calculate hash of current payload
   - Compare with transaction_hash
   - Return True if match, False if corrupted

9. **Add save() override**
   - Auto-calculate transaction_hash when payload changes
   - Auto-calculate payload_size_bytes
   - Extract grand_total and items_count from payload
   - Call parent save()

10. **Add method to create Sale from payload**
    - Method name: create_sale_from_payload()
    - Parse payload and create Sale model instance
    - Create related SaleItems
    - Create related Payments
    - Handle customer association
    - Return created Sale instance

### Payload Field Structure

```
OfflineTransaction
└── Payload
    ├── payload (JSON)
    │   ├── header
    │   │   ├── offline_id
    │   │   ├── transaction_type
    │   │   ├── offline_timestamp
    │   │   ├── terminal_id
    │   │   ├── employee_id
    │   │   ├── customer_id (optional)
    │   │   ├── subtotal
    │   │   ├── tax_total
    │   │   ├── discount_total
    │   │   ├── grand_total
    │   │   └── notes
    │   │
    │   ├── line_items (array)
    │   │   └── [...]
    │   │
    │   ├── payments (array)
    │   │   └── [...]
    │   │
    │   └── customer (optional)
    │       └── {...}
    │
    ├── payload_size_bytes (Integer)
    └── payload_compressed (Boolean)
```

### Complete Payload Structure (Reference Task 06)

```json
{
  "header": {
    "offline_id": "550e8400-e29b-41d4-a716-446655440000",
    "transaction_type": "sale",
    "offline_timestamp": "2026-01-23T10:30:00+05:30",
    "terminal_id": "term-001",
    "employee_id": "emp-123",
    "customer_id": "cust-456",
    "subtotal": "5000.00",
    "tax_total": "600.00",
    "discount_total": "500.00",
    "grand_total": "5100.00",
    "notes": "Bulk order discount applied"
  },
  
  "line_items": [
    {
      "line_id": "line-001",
      "product_id": "prod-789",
      "variant_id": "var-012",
      "sku": "SKU-12345",
      "product_name": "Laptop - 15 inch",
      "quantity": "1.00",
      "unit_price": "4500.00",
      "discount_amount": "450.00",
      "tax_rate": "0.12",
      "tax_amount": "486.00",
      "line_total": "4536.00",
      "notes": ""
    },
    {
      "line_id": "line-002",
      "product_id": "prod-790",
      "variant_id": null,
      "sku": "SKU-67890",
      "product_name": "Mouse - Wireless",
      "quantity": "2.00",
      "unit_price": "250.00",
      "discount_amount": "50.00",
      "tax_rate": "0.12",
      "tax_amount": "54.00",
      "line_total": "504.00",
      "notes": ""
    }
  ],
  
  "payments": [
    {
      "payment_id": "pay-001",
      "payment_method": "cash",
      "amount": "5100.00",
      "reference_number": "",
      "timestamp": "2026-01-23T10:35:00+05:30",
      "change_amount": "0.00",
      "status": "completed"
    }
  ],
  
  "customer": {
    "id": "cust-456",
    "name": "John Doe",
    "phone": "+94 77 123 4567",
    "email": "john@example.com",
    "loyalty_number": "LOY-123456"
  }
}
```

### Payload Validation Rules

| Validation | Rule | Error if Failed |
|------------|------|-----------------|
| **Header Exists** | payload must have "header" key | "Missing transaction header" |
| **Line Items** | payload must have "line_items" array with >= 1 item | "No line items in transaction" |
| **Payments** | payload must have "payments" array with >= 1 payment | "No payments in transaction" |
| **Totals Match** | Sum of payment amounts must equal grand_total | "Payment total mismatch" |
| **Line Totals** | Sum of line_item totals must equal calculated total | "Line items total mismatch" |
| **Required Fields** | All required fields must be present | "Missing required field: {field}" |
| **Data Types** | Fields must be correct type (decimal for amounts, etc.) | "Invalid data type for {field}" |

### Payload Extraction Methods

**get_header():**
- Return payload["header"] dictionary
- Raise error if header missing

**get_line_items():**
- Return payload["line_items"] array
- Return empty array if missing

**get_payments():**
- Return payload["payments"] array
- Return empty array if missing

**get_customer_data():**
- Return payload.get("customer", None)
- Return None if no customer data

### Payload Stats Dictionary

```python
{
  "line_items_count": 5,
  "payments_count": 2,
  "grand_total": Decimal("5100.00"),
  "has_customer": True,
  "transaction_type": "sale",
  "offline_timestamp": datetime(...),
  "payload_size_kb": 12.5
}
```

### Hash Verification Process

```
┌──────────────────────┐
│ Receive Transaction  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Extract Payload      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Calculate Hash       │
│ (SHA-256)            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Compare with Stored  │
│ transaction_hash     │
└──────────┬───────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐   ┌──────────┐
│ Match  │   │ Mismatch │
└───┬────┘   └────┬─────┘
    │             │
    ▼             ▼
[Process]    [Reject/Flag]
```

### Sale Creation Flow

```
┌─────────────────────────┐
│ OfflineTransaction      │
│ payload                 │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ validate_payload()      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ create_sale_from_payload│
└────────────┬────────────┘
             │
             ├──→ Create Sale instance
             │
             ├──→ Create SaleItem instances
             │
             ├──→ Create Payment instances
             │
             ├──→ Link customer (if present)
             │
             └──→ Update inventory
                  │
                  ▼
             ┌─────────┐
             │ Sale    │
             └─────────┘
```

### Payload Compression

**When to Compress:**
- Payload size > 50 KB
- Large number of line items (>50)
- Network bandwidth is limited

**Compression Method:**
- Use gzip compression
- Store compressed data as base64 string
- Set payload_compressed = True
- Decompress before processing

### Expected Outcome
- Complete transaction data stored in payload field
- Automatic hash calculation for integrity
- Validation methods to ensure data quality
- Extraction methods for easy data access
- Sale creation capability from payload

### Verification Checklist
- [ ] payload JSONField added
- [ ] validate_payload() method implemented
- [ ] Payload extraction methods (get_header, get_line_items, etc.) added
- [ ] payload_size_bytes field added
- [ ] payload_compressed field added
- [ ] get_payload_stats() method implemented
- [ ] verify_payload_integrity() method added
- [ ] save() method overridden to auto-calculate fields
- [ ] create_sale_from_payload() method implemented
- [ ] Payload validation rules documented
- [ ] Migration file generated

---

## Task 15: Create Sync Priority Logic

### Overview
Define and document the logic for prioritizing which offline transactions and data entities should be synchronized first when connectivity is restored. This ensures critical data is synced before less important data.

### Dependencies
- Task 12: Create OfflineTransaction model
- Task 05: Define cacheable entities list

### Instructions

1. **Create priority_logic.py file**
   - Navigate to `apps/pos/offline/`
   - Create new file `priority_logic.py`
   - Add module docstring

2. **Define priority constants**
   - PRIORITY_CRITICAL = 10
   - PRIORITY_HIGH = 8
   - PRIORITY_NORMAL = 5
   - PRIORITY_LOW = 3
   - PRIORITY_DEFERRED = 1

3. **Create transaction priority function**
   - Function name: get_transaction_priority(transaction)
   - Analyze transaction metadata
   - Return priority score (1-10)

4. **Define transaction priority rules**
   - High-value transactions (>100,000 LKR): CRITICAL
   - Standard sales/refunds: HIGH
   - Draft transactions: LOW
   - Test transactions: DEFERRED

5. **Create entity priority function**
   - Function name: get_entity_sync_priority(entity_type)
   - Return priority for entity types
   - Reference Task 05 priorities

6. **Define entity priority mapping**
   - Tax rates: CRITICAL
   - Prices: HIGH
   - Products: HIGH
   - Customers: NORMAL
   - Categories: LOW

7. **Create sync queue ordering function**
   - Function name: order_sync_queue(transactions)
   - Sort transactions by priority
   - Then by offline_timestamp (oldest first within priority)
   - Return ordered list

8. **Add priority boost logic**
   - Function: boost_priority_if_needed(transaction)
   - Boost priority if transaction is old (>24 hours)
   - Boost if retry_count > 2
   - Boost if specific transaction type

9. **Create batch priority grouping**
   - Function: create_priority_batches(transactions, batch_size)
   - Group transactions by priority level
   - Create batches within each priority group
   - Return list of batches with priority labels

10. **Add documentation section**
    - Document all priority rules
    - Provide examples for each priority level
    - Note special cases and exceptions

### Priority Logic Structure

```
apps/pos/offline/priority_logic.py
│
├── Constants
│   ├── PRIORITY_CRITICAL = 10
│   ├── PRIORITY_HIGH = 8
│   ├── PRIORITY_NORMAL = 5
│   ├── PRIORITY_LOW = 3
│   └── PRIORITY_DEFERRED = 1
│
├── Functions
│   ├── get_transaction_priority(transaction)
│   ├── get_entity_sync_priority(entity_type)
│   ├── order_sync_queue(transactions)
│   ├── boost_priority_if_needed(transaction)
│   └── create_priority_batches(transactions, batch_size)
│
└── Documentation
    └── Priority rules and examples
```

### Transaction Priority Rules

| Criteria | Condition | Priority | Reasoning |
|----------|-----------|----------|-----------|
| **High Value** | grand_total > 100,000 LKR | CRITICAL (10) | Financial significance |
| **Supervisor Override** | manual priority boost | CRITICAL (10) | Management directive |
| **Standard Sale** | Normal sale/refund | HIGH (8) | Core business transaction |
| **Old Transaction** | offline > 24 hours | Boost +2 | Prevent indefinite queuing |
| **Multiple Retries** | retry_count >= 3 | Boost +1 | Persistent issue needs attention |
| **Draft** | status = draft | LOW (3) | Not finalized |
| **Test Transaction** | is_test = true | DEFERRED (1) | Non-production data |

### Entity Type Priority Mapping

| Entity Type | Priority | Freshness | Sync Frequency |
|-------------|----------|-----------|----------------|
| **Tax Rates** | CRITICAL (10) | Real-time | Every 5 min |
| **POS Settings** | CRITICAL (10) | Real-time | Every 5 min |
| **Product Prices** | HIGH (8) | 30 min | Every 30 min |
| **Products** | HIGH (8) | 1 hour | Every 1 hour |
| **Discount Rules** | HIGH (8) | 30 min | Every 30 min |
| **Customers** | NORMAL (5) | 1 hour | Every 2 hours |
| **Categories** | NORMAL (5) | 24 hours | Daily |
| **Employees** | NORMAL (5) | 4 hours | Every 4 hours |
| **Historical Data** | LOW (3) | 7 days | Weekly |
| **Product Images** | DEFERRED (1) | 30 days | On-demand |

### Sync Queue Ordering Logic

```
┌─────────────────────────┐
│ All Pending             │
│ Transactions            │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Calculate Priority      │
│ for Each                │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Apply Priority Boosts   │
│ (age, retries)          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Group by Priority Level │
│ 10, 8, 5, 3, 1          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Within Each Group:      │
│ Sort by Timestamp       │
│ (oldest first - FIFO)   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Create Batches          │
│ (batch_size = 50)       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Ordered Sync Queue      │
└─────────────────────────┘
```

### Priority Boost Conditions

**Age-Based Boost:**
- Transaction offline > 24 hours: +2 priority
- Transaction offline > 72 hours: +3 priority
- Prevents transactions from being stuck indefinitely

**Retry-Based Boost:**
- After 3 failed retries: +1 priority
- After 5 failed retries: +2 priority
- Escalates persistent issues

**Type-Based Boost:**
- Refund transactions: +1 priority (customer satisfaction)
- Supervisor-initiated: +3 priority (management directive)

### Batch Creation Example

```
Input: 150 pending transactions
Batch size: 50

Result:
Batch 1 (Priority 10 - CRITICAL): 20 transactions
Batch 2 (Priority 8 - HIGH): 50 transactions
Batch 3 (Priority 8 - HIGH): 50 transactions (continuation)
Batch 4 (Priority 5 - NORMAL): 30 transactions
```

### Special Cases

**Emergency Sync:**
- Triggered manually by supervisor
- All pending transactions get CRITICAL priority
- Bypasses normal queue order
- Used during critical business needs

**Low Bandwidth Mode:**
- Only CRITICAL and HIGH priority transactions synced
- NORMAL and below deferred until better connection
- Reduces batch size to 25

**Business Hours Priority:**
- During business hours (9 AM - 6 PM): boost all by +1
- After hours: normal priority only
- Ensures smoother operations during peak times

### Expected Outcome
- Clear priority rules for all transaction types
- Entity type priority mapping
- Queue ordering logic implementation
- Batch creation with priority grouping
- Priority boost mechanisms

### Verification Checklist
- [ ] `priority_logic.py` file created
- [ ] Priority constants defined
- [ ] get_transaction_priority() function implemented
- [ ] Transaction priority rules documented
- [ ] get_entity_sync_priority() function implemented
- [ ] Entity priority mapping created
- [ ] order_sync_queue() function implemented
- [ ] boost_priority_if_needed() function implemented
- [ ] create_priority_batches() function implemented
- [ ] Special cases documented
- [ ] Priority logic thoroughly tested

---

## Task 16: Document Data Freshness Requirements

### Overview
Create comprehensive documentation defining how fresh (recent) data must be for each entity type in offline mode. This establishes acceptable staleness levels and guides cache invalidation logic.

### Dependencies
- Task 05: Define cacheable entities list
- Task 15: Create sync priority logic

### Instructions

1. **Create freshness_requirements.md file**
   - Navigate to `apps/pos/offline/docs/`
   - Create new file `freshness_requirements.md`

2. **Add document header and overview**
   - Explain purpose of freshness requirements
   - Define staleness concept
   - Note impact on business operations

3. **Define freshness categories**
   - Real-time: <5 minutes staleness
   - Near real-time: 5-30 minutes
   - Fresh: 30 minutes - 4 hours
   - Acceptable: 4-24 hours
   - Stale-acceptable: >24 hours

4. **Document critical entity freshness**
   - Tax rates: Real-time (5 minutes max)
   - Product prices: Near real-time (30 minutes max)
   - POS settings: Real-time (5 minutes max)
   - Payment methods: Near real-time (15 minutes max)

5. **Document master data freshness**
   - Products: Fresh (1-4 hours)
   - Product variants: Fresh (1-4 hours)
   - Categories: Acceptable (24 hours)
   - Units of measure: Stale-acceptable (7 days)

6. **Document reference data freshness**
   - Customers: Acceptable (1-4 hours)
   - Employees: Acceptable (4 hours)
   - Terminals: Acceptable (1 hour)

7. **Document staleness detection**
   - How to check if data is stale
   - Cache timestamp comparison
   - Server version checking

8. **Define staleness handling strategies**
   - **Block**: Prevent operation if data too stale
   - **Warn**: Show warning but allow operation
   - **Allow**: Proceed with stale data
   - **Fallback**: Use alternative data source

9. **Document business impact**
   - Impact of stale prices (incorrect charges)
   - Impact of stale inventory (overselling)
   - Impact of stale tax rates (compliance issues)

10. **Add refresh triggers**
    - Automatic refresh based on TTL
    - Manual refresh by user
    - Event-driven refresh (server push)
    - On-demand refresh (when accessed)

11. **Create freshness verification table**
    - Entity type
    - Maximum staleness allowed
    - Refresh strategy
    - Staleness handling
    - Business impact if stale

12. **Add monitoring recommendations**
    - Metrics to track staleness
    - Alerts for critically stale data
    - Reporting on refresh success rates

### Freshness Categories

| Category | Staleness | TTL | Use Cases |
|----------|-----------|-----|-----------|
| **Real-time** | <5 minutes | 5 min | Tax rates, critical settings |
| **Near Real-time** | 5-30 minutes | 30 min | Prices, payment configs |
| **Fresh** | 30 min - 4 hours | 4 hours | Products, variants |
| **Acceptable** | 4-24 hours | 24 hours | Customers, categories |
| **Stale-acceptable** | >24 hours | 7 days | Historical data, static references |

### Entity Freshness Requirements

#### Critical Entities (Block if Stale)

| Entity | Max Staleness | Refresh Trigger | Handling | Business Impact |
|--------|---------------|-----------------|----------|-----------------|
| **Tax Rates** | 5 minutes | Auto + Manual | BLOCK | Compliance violations, incorrect tax |
| **Product Prices** | 30 minutes | Auto + Manual | WARN | Incorrect charges, customer disputes |
| **POS Settings** | 5 minutes | Auto + On-login | BLOCK | Operational errors |
| **Payment Methods** | 15 minutes | Auto | WARN | Payment processing failures |

#### Master Data (Warn if Stale)

| Entity | Max Staleness | Refresh Trigger | Handling | Business Impact |
|--------|---------------|-----------------|----------|-----------------|
| **Products** | 4 hours | Auto | WARN | Outdated product info |
| **Product Variants** | 4 hours | Auto | WARN | Incorrect variant selection |
| **Discount Rules** | 2 hours | Auto + Manual | WARN | Incorrect discounts applied |
| **Categories** | 24 hours | Auto | ALLOW | Minor categorization issues |

#### Reference Data (Allow if Stale)

| Entity | Max Staleness | Refresh Trigger | Handling | Business Impact |
|--------|---------------|-----------------|----------|-----------------|
| **Customers** | 4 hours | Auto + On-search | ALLOW | Outdated customer info |
| **Employees** | 4 hours | Auto + On-login | ALLOW | Outdated employee list |
| **Terminals** | 1 hour | Auto | ALLOW | Minor terminal info mismatch |
| **Units of Measure** | 7 days | Manual | ALLOW | Minimal impact |

### Staleness Detection Logic

```
┌─────────────────────────┐
│ Access Cached Data      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Get cache_timestamp     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Calculate Age           │
│ (now - cache_timestamp) │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Compare with TTL        │
└────────────┬────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────┐  ┌──────────┐
│ Fresh    │  │ Stale    │
└────┬─────┘  └────┬─────┘
     │             │
     ▼             ▼
 [Use Data]   [Apply Staleness
               Handling Strategy]
```

### Staleness Handling Strategies

**BLOCK Strategy:**
- Prevent transaction from proceeding
- Show error message to user
- Force immediate refresh
- Log blocked attempt
- Example: "Cannot process sale - tax rates are outdated. Refreshing..."

**WARN Strategy:**
- Show warning to user
- Allow user to proceed or refresh
- Log warning with user action
- Example: "Product prices may be outdated (2 hours old). Refresh now or continue?"

**ALLOW Strategy:**
- Use cached data without warning
- Schedule background refresh
- Log staleness for monitoring
- Example: Customer data used silently, refresh queued

**FALLBACK Strategy:**
- Attempt to use alternative data source
- Fall back to last known good value
- Log fallback usage
- Example: Use default tax rate if specific rate unavailable

### Business Impact Assessment

| Impact Level | Description | Examples | Response Required |
|--------------|-------------|----------|-------------------|
| **Critical** | Revenue loss, compliance violation | Wrong tax rates, incorrect pricing | Immediate action, block operation |
| **High** | Customer dissatisfaction, disputes | Outdated prices, wrong discounts | Warning, user confirmation |
| **Medium** | Minor operational inconvenience | Old customer info, outdated categories | Background refresh |
| **Low** | Minimal to no impact | Historical data, static references | Scheduled refresh |

### Refresh Triggers

**Automatic Refresh:**
- Triggered when data age exceeds TTL
- Background process checks periodically
- Attempts refresh without user interaction

**Manual Refresh:**
- User clicks "Sync Now" button
- Forces immediate refresh of all data
- Updates cache timestamps

**Event-Driven Refresh:**
- Server pushes notification of data change
- Client immediately refreshes affected entities
- Requires WebSocket or similar connection

**On-Demand Refresh:**
- Triggered when specific data is accessed
- Checks freshness before use
- Refreshes if stale

**On-Login Refresh:**
- Automatic refresh when user logs in
- Ensures fresh data at session start
- Critical for settings and configurations

### Monitoring and Alerting

**Metrics to Track:**
- Average staleness per entity type
- Percentage of transactions with stale data
- Refresh success/failure rates
- Time since last successful refresh
- Staleness-related blocks/warnings

**Alert Conditions:**
- Tax rates stale for >10 minutes
- Prices not refreshed in >1 hour
- Multiple consecutive refresh failures
- High percentage of stale data warnings

**Reporting:**
- Daily staleness report per terminal
- Entity-wise freshness dashboard
- Trends in refresh success rates
- Impact analysis of stale data on operations

### Expected Outcome
- Clear freshness requirements for all entity types
- Defined staleness handling strategies
- Business impact understanding
- Monitoring and alerting framework
- Documentation for developers and operators

### Verification Checklist
- [ ] `freshness_requirements.md` created
- [ ] Freshness categories defined
- [ ] Critical entity requirements documented
- [ ] Master data requirements documented
- [ ] Reference data requirements documented
- [ ] Staleness detection logic explained
- [ ] Handling strategies (BLOCK/WARN/ALLOW/FALLBACK) defined
- [ ] Business impact assessment included
- [ ] Refresh triggers documented
- [ ] Monitoring recommendations provided
- [ ] Alert conditions specified

---

## Summary

This document completed the offline data architecture foundation:

1. **Created OfflineTransaction model** - Server-side queuing of offline transactions
2. **Added transaction metadata** - Device info, network quality, integrity hashing
3. **Added transaction payload field** - Complete transaction data storage with validation
4. **Created sync priority logic** - Intelligent ordering of sync operations
5. **Documented data freshness requirements** - Staleness handling and refresh strategies

Group A has established the complete offline data architecture, providing the foundation for implementing local caching, sync engines, and conflict resolution in subsequent groups.

---

## Next Steps

Proceed to [Group B: Local Data Caching](../Group-B_Local-Data-Caching/) to implement the client-side data caching mechanisms using IndexedDB and implement cache management utilities.
